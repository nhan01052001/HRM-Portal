import React from 'react';
import { View, FlatList, RefreshControl, TouchableWithoutFeedback, StyleSheet } from 'react-native';
import { Colors, CustomStyleSheet, styleSheets, stylesScreenDetailV3 } from '../../../../../../constants/styleConfig';
import RenderItem from './RenderItem';
import RenderTitleWeeks from './RenderTitleWeeks';
import VnrLoading from '../../../../../../components/VnrLoading/VnrLoading';
import Vnr_Function from '../../../../../../utils/Vnr_Function';
import EmptyData from '../../../../../../components/EmptyData/EmptyData';
import DrawerServices from '../../../../../../utils/DrawerServices';
import moment from 'moment';
import { EnumName, EnumStatus } from '../../../../../../assets/constant';
import { getDataLocal } from '../../../../../../factories/LocalData';
import VnrIndeterminate from '../../../../../../components/VnrLoading/VnrIndeterminate';
import VnrLoadingScreen from '../../../../../../components/VnrLoading/VnrLoadingScreen';
const heightActionBottom = 45;

export default class WorkDayList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //itemSelected: [],
            refreshing: false,
            isLoading: true,
            // isLoadingHeader: false,
            stateProps: props,
            dataSource: [],
            fullData: [],
            footerLoading: false,
            //isOpenAction: false,
            messageEmptyData: 'EmptyData',
            isLoadingHeader: true // biến hiển thị đang compare data local
        };
        this.callOnEndReached = false;
        this.oldIndexOpenSwipeOut = null;
        (this.listItemOpenSwipeOut = {}), //[];
        (this.refFlatList = null);
        this.indexToday = 0;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.dataFilter != this.props.dataFilter) {
            this.indexToday = 0;
            this.filterData(nextProps.dataFilter);
        }

        if (nextProps.isRefreshList != this.props.isRefreshList) {
            this.indexToday = 0;
            this.refresh(nextProps);
        }

        if (nextProps.isLazyLoading !== this.props.isLazyLoading) {
            this.lazyLoading(nextProps);
        }
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (
            nextProps.isRefreshList !== this.props.isRefreshList ||
            nextState.isLoading !== this.state.isLoading ||
            nextProps.dataFilter !== this.props.dataFilter ||
            nextProps.isLazyLoading !== this.props.isLazyLoading ||
            nextState.refreshing !== this.state.refreshing ||
            nextState.isLoadingHeader !== this.state.isLoadingHeader
        );
    }

    filterData = (dataFilter) => {
        const { fullData } = this.state;
        let data = fullData.filter((item) => {
            return (
                moment(item['WorkDate']).format('DD/MM/YYYY') == moment(dataFilter).format('DD/MM/YYYY') &&
                item['TitleWeek'] == null
            );
        });

        this.setState({ dataSource: data });
    };

    renderSeparator = () => {
        return <View style={stylesScreenDetailV3.separator} />;
    };

    remoteData = (param = {}) => {
        const { setTotalWorkDay, keyDataLocal, keyQuery, isMissingInoutFilter } = this.state.stateProps,
            { isLazyLoading } = param;

        this.indexToday = 0;
        if (keyDataLocal) {
            getDataLocal(keyDataLocal)
                .then((resData) => {
                    const res = resData && resData[keyQuery] ? resData[keyQuery] : null;
                    if (res && Array.isArray(res) && res.length > 0) {
                        let objTotalWorkDay = {
                                TotalWorkdays: 0,
                                TotalRealWorkdays: 0,
                                TotalOvertimeHours: 0,
                                TotalLeaveBussinessdays: 0,
                                TotalLeavedays: 0
                            },
                            indexCurentDay = res // lay vi tri ngay hien tai
                                .findIndex(
                                    (item) =>
                                        moment(item.WorkDate).format('DD/MM/YYYY') === moment().format('DD/MM/YYYY')
                                ),
                            _data = [],
                            _dataValid = [];

                        if (indexCurentDay > -1) {
                            let indexCurentDayReverse = [...res] // lay vi tri ngay hien tai (dao nguoc mang)
                                    .reverse()
                                    .findIndex(
                                        (item) =>
                                            moment(item.WorkDate).format('DD/MM/YYYY') === moment().format('DD/MM/YYYY')
                                    ),
                                ItemGroup = [...res] // lay title week cua tuan chua ngay hien tai (dao nguoc mang)
                                    .reverse()
                                    .find((item, index) => item.TitleWeek != null && index > indexCurentDayReverse);
                            _data = [...[ItemGroup], ...res.slice(indexCurentDay, res.length)];
                        } else {
                            _data = res;
                        }

                        _data.forEach((item) => {
                            if (item.LateDuration1 || item.EarlyDuration1 || !item.InTime1 || !item.OutTime1) {
                                _dataValid.push(item);
                            }
                        });

                        if (isMissingInoutFilter) {
                            _data = _dataValid;
                        }

                        if (res.length > 0) {
                            const firstItem = res[0];
                            if (firstItem) {
                                objTotalWorkDay = {
                                    TotalHoliday: firstItem.TotalHoliday, //tổng nghĩ lễ
                                    StdWorkdayCount: firstItem.StdWorkdayCount,
                                    TotalForgeLeaveDays: firstItem.TotalForgeLeaveDays, //tổng ngày nghỉ ngừng việc master

                                    TotalPaidWorkDays: firstItem.TotalPaidWorkDays,
                                    TotalRealWorkdays: firstItem.TotalRealWorkdays,
                                    TotalPaidLeaveDays: firstItem.TotalPaidLeaveDays,
                                    TotalBusinessDayLeaveDays: firstItem.TotalBusinessDayLeaveDays,

                                    TotalUnPaidWorkDays: firstItem.TotalUnPaidWorkDays,
                                    TotalUnPaidLeaveDays: firstItem.TotalUnPaidLeaveDays,
                                    TotalLateEarly: firstItem.TotalLateEarly,
                                    TotalLateEarlyDuration3: firstItem.TotalLateEarlyDuration3,

                                    TotalOTPayroll: firstItem.TotalOTPayroll,
                                    TotalOvertimeHoursWorkday: firstItem.TotalOvertimeHoursWorkday,
                                    TotalOvertimeHoursWeekend: firstItem.TotalOvertimeHoursWeekend,
                                    TotalOvertimeHoursHoliday: firstItem.TotalOvertimeHoursHoliday,
                                    TotalNightHours: firstItem.TotalNightHours,
                                    TotalNightHoursAndNightOvertime: firstItem.TotalNightHoursAndNightOvertime,
                                    TotalOvertimeHoursNightWorkday: firstItem.TotalOvertimeHoursNightWorkday,
                                    TotalOvertimeHoursNightWeekend: firstItem.TotalOvertimeHoursNightWeekend,
                                    TotalOvertimeHoursNightHoliday: firstItem.TotalOvertimeHoursNightHoliday,
                                    isEmptyData: false
                                };
                            }
                        }
                        this.setState(
                            {
                                fullData: res,
                                dataSource: _data,
                                isLoading: false,
                                refreshing: false,
                                footerLoading: false,
                                isLoadingHeader: isLazyLoading ? false : true
                            },
                            () => setTotalWorkDay(objTotalWorkDay)
                        );
                    } else if (res == EnumName.E_EMPTYDATA || (res && Array.isArray(res) && res.length == 0)) {
                        let objTotalWorkDay = {
                            TotalHoliday: null,
                            StdWorkdayCount: null,
                            TotalForgeLeaveDays: null,
                            TotalPaidWorkDays: null,
                            TotalRealWorkdays: null,
                            TotalPaidLeaveDays: null,
                            TotalBusinessDayLeaveDays: null,

                            TotalUnPaidWorkDays: null,
                            TotalUnPaidLeaveDays: null,
                            TotalLateEarly: null,
                            TotalLateEarlyDuration3: null,

                            TotalOTPayroll: null,
                            TotalOvertimeHoursWorkday: null,
                            TotalOvertimeHoursWeekend: null,
                            TotalOvertimeHoursHoliday: null,
                            TotalNightHours: null,
                            TotalNightHoursAndNightOvertime: null,
                            TotalOvertimeHoursNightWorkday: null,
                            TotalOvertimeHoursNightWeekend: null,
                            TotalOvertimeHoursNightHoliday: null,
                            isEmptyData: true
                        };

                        this.setState(
                            {
                                fullData: [],
                                dataSource: EnumName.E_EMPTYDATA,
                                isLoading: false,
                                refreshing: false,
                                footerLoading: false,
                                isLoadingHeader: isLazyLoading ? false : true
                            },
                            () => setTotalWorkDay(objTotalWorkDay)
                        );
                    }
                })
                .catch((error) => {
                    // ToasterSevice.showError("HRM_Common_SendRequest_Error", 4000);
                    // this.setState({ isLoading: false, messageEmptyData: 'HRM_Common_SendRequest_Error' });
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                });
        } else {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: 'Thiêu Prop keyDataLocal' });
        }
    };

    componentDidMount() {
        this.remoteData();
    }

    // scrollToItemByIndex = () => {
    //   try {
    //     if (
    //       this.refFlatList &&
    //       this.refFlatList.scrollToIndex &&
    //       this.indexToday != 0
    //     ) {
    //       setTimeout(() => {
    //         // console.log('scroll ', this.indexToday);
    //         this.refFlatList.scrollToIndex({
    //           animated: true,
    //           index: this.indexToday,
    //         });
    //       }, 200);
    //     }
    //   } catch (error) {
    //     console.log(error);
    //   }
    // };

    _handleRefresh = () => {
        const { pullToRefresh } = this.props;
        this.setState({ refreshing: true }, () => {
            pullToRefresh && typeof pullToRefresh === 'function' && pullToRefresh();
        });
    };

    _renderLoading = () => {
        return (
            <View style={styles.styViewLoadingFooter}>
                <VnrLoading size="large" isVisible={this.state.footerLoading} />
            </View>
        );
    };

    _renderHeaderLoading = () => {
        return <VnrIndeterminate isVisible={this.state.isLoadingHeader} />;
    };

    refresh = (nexProps) => {
        this.setState({ isLoading: true, stateProps: nexProps });
    };

    lazyLoading = (nexProps) => {
        // các trường hợp (pulltoRefresh, Màn hình) thì kiểm tra dữ liệu dữ liệu mới và củ có khác nhau hay không
        // paging,filter luôn thay đổi
        // dataChange (dùng để kiểm tra dữ liệu mới và củ  có khác nhau hay không )
        // dataChange == true ? khác : giống nhau
        if (!nexProps.dataChange) {
            this.setState({
                isLoadingHeader: false,
                refreshing: false,
                isLoading: false
            });
        } else {
            this.remoteData({ isLazyLoading: true });
        }
    };

    handerOpenSwipeOut = (indexOnOpen) => {
        if (this.oldIndexOpenSwipeOut !== null && this.oldIndexOpenSwipeOut != indexOnOpen) {
            if (
                !Vnr_Function.CheckIsNullOrEmpty(this.listItemOpenSwipeOut[this.oldIndexOpenSwipeOut]) &&
                this.listItemOpenSwipeOut[this.oldIndexOpenSwipeOut]['value']
            ) {
                this.listItemOpenSwipeOut[this.oldIndexOpenSwipeOut]['value'].close();
            }
        }
        this.oldIndexOpenSwipeOut = indexOnOpen;
    };

    moveToDetail = (item) => {
        const { detail, rowTouch } = this.props;
        if (!Vnr_Function.CheckIsNullOrEmpty(rowTouch) && typeof rowTouch == 'function') {
            rowTouch();
        } else if (
            !Vnr_Function.CheckIsNullOrEmpty(detail) &&
            !Vnr_Function.CheckIsNullOrEmpty(detail.screenDetail) &&
            !Vnr_Function.CheckIsNullOrEmpty(detail.screenName)
        ) {
            DrawerServices.navigate(detail.screenDetail, {
                dataItem: item,
                screenName: detail.screenName
            });
        }
    };

    render() {
        const { dataSource, stateProps, isLoading, refreshing, isOpenAction } = this.state;

        let contentList = <View />;
        if (isLoading) {
            contentList = (
                <VnrLoadingScreen
                    size="large"
                    screenName={this.props.detail ? this.props.detail.screenName : null}
                    isVisible={isLoading}
                    type={EnumStatus.E_SUBMIT}
                />
            );
        } else if (dataSource == EnumName.E_EMPTYDATA || dataSource.length <= 0) {
            contentList = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataSource && dataSource.length > 0) {
            contentList = (
                <FlatList
                    showsVerticalScrollIndicator={false}
                    ref={(ref) => (this.refFlatList = ref)}
                    disableScrollViewPanResponder={true} // fix bug khong the click onPess sau khi pulltoRefresh
                    data={dataSource}
                    extraData={this.state}
                    ListFooterComponent={this._renderLoading}
                    ListHeaderComponent={this._renderHeaderLoading}
                    renderItem={({ item, index }) => {
                        if (item.TitleWeek != null) {
                            return (
                                <RenderTitleWeeks
                                    dataItem={item}
                                    index={index}
                                    listItemOpenSwipeOut={this.listItemOpenSwipeOut}
                                    handerOpenSwipeOut={this.handerOpenSwipeOut}
                                />
                            );
                        } else {
                            let _isToday = false;
                            if (moment(item.WorkDate).format('DD/MM/YYYY') === moment().format('DD/MM/YYYY')) {
                                _isToday = true;
                            }
                            return (
                                <TouchableWithoutFeedback
                                    onPress={() => {
                                        this.moveToDetail(item);
                                    }}
                                    onPressIn={() => {
                                        this.handerOpenSwipeOut(index);
                                    }}
                                >
                                    <View style={CustomStyleSheet.flex(1)}>
                                        <RenderItem
                                            isToday={_isToday}
                                            index={index}
                                            renderRowConfig={stateProps.renderConfig}
                                            dataItem={item}
                                            handerOpenSwipeOut={this.handerOpenSwipeOut}
                                            listItemOpenSwipeOut={this.listItemOpenSwipeOut}
                                            rowActions={
                                                !Vnr_Function.CheckIsNullOrEmpty(stateProps.rowActions)
                                                    ? stateProps.rowActions
                                                    : null
                                            }
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            );
                        }
                    }}
                    // keyExtractor={(item, index) => index}
                    refreshControl={
                        <RefreshControl
                            onRefresh={() => this._handleRefresh()}
                            refreshing={refreshing}
                            size="large"
                            tintColor={Colors.primary}
                        />
                    }
                />
            );
        }

        return (
            <View style={[isOpenAction == true && { paddingBottom: heightActionBottom }, styleSheets.containerGrey]}>
                {contentList}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    styViewLoadingFooter: { flex: 1, paddingVertical: styleSheets.p_10 }
});
