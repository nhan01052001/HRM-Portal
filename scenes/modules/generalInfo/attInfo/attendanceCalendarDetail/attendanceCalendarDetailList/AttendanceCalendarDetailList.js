import React from 'react';
import {
    View,
    FlatList,
    RefreshControl,
    TouchableWithoutFeedback,
    Text,
    TouchableOpacity,
    StyleSheet
} from 'react-native';
import {
    Colors,
    CustomStyleSheet,
    Size,
    styleSheets,
    stylesScreenDetailV3
} from '../../../../../../constants/styleConfig';
import AttendanceCalendarDetailItem from './AttendanceCalendarDetailItem';
import RenderTitleWeeks from './RenderTitleWeeks';
import VnrLoading from '../../../../../../components/VnrLoading/VnrLoading';
import Vnr_Function from '../../../../../../utils/Vnr_Function';
import EmptyData from '../../../../../../components/EmptyData/EmptyData';
import DrawerServices from '../../../../../../utils/DrawerServices';
import moment from 'moment';
import { EnumName } from '../../../../../../assets/constant';
import { getDataLocal } from '../../../../../../factories/LocalData';
import VnrIndeterminate from '../../../../../../components/VnrLoading/VnrIndeterminate';
import { dataVnrStorage } from '../../../../../../assets/auth/authentication';
import VnrText from '../../../../../../components/VnrText/VnrText';
import { VnrLoadingSevices } from '../../../../../../components/VnrLoading/VnrLoadingPages';
const heightActionBottom = 45;

export default class AttendanceCalendarDetailList extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            //itemSelected: [],
            refreshing: false,
            isLoading: true,
            // isLoadingHeader: false,
            stateProps: props,
            dataCalendar: [],
            dataSource: [],
            fullData: [],
            footerLoading: false,
            checkDateOfWeek: 0,
            isReloadCalendar: false,
            //isOpenAction: false,
            messageEmptyData: 'EmptyData',
            isLoadingHeader: true // biến hiển thị đang compare data local
        };
        this.callOnEndReached = false;
        this.oldIndexOpenSwipeOut = null;
        this.listItemOpenSwipeOut = {};
        this.refFlatList = null;
        this.successRender = false;
        this.indexToday = 0;
        this.dataSourceCords = [];
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
            nextState.isLoadingHeader !== this.state.isLoadingHeader ||
            nextState.isReloadCalendar !== this.state.isReloadCalendar
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
        const { setTotalWorkDay, keyDataLocal, keyQuery } = this.state.stateProps,
            { isLazyLoading } = param;
        this.indexToday = 0;
        if (keyDataLocal) {
            this.successRender = false;
            getDataLocal(keyDataLocal)
                .then((resData) => {
                    const res = resData && resData[keyQuery] ? resData[keyQuery] : null,
                        dataListTable = res ? res.ListAttendanceTableItem : EnumName.E_EMPTYDATA,
                        datAttendanceTable = res ? res.AttendanceTable : null,
                        listAttendanceTableID = res && res.ListAttendanceTableID ? res.ListAttendanceTableID : null,
                        cutOffDuration = res && res.cutOffDuration ? res.cutOffDuration : null,
                        dataTemp = [];

                    let checkDateOfWeek = 0;
                    let objTotalWorkDay = {
                        TotalDaysReceiveSalary: 0,
                        TotalOvertimeHours: 0,
                        TotalUnpaidLeaves: 0,
                        cutOffDuration: cutOffDuration,
                        ListAttendanceTableID: listAttendanceTableID
                    };
                    if (dataListTable && Array.isArray(dataListTable)) {
                        objTotalWorkDay = {
                            ...objTotalWorkDay,
                            // task: 0167644: [Hotfix_ FGL_v8.10.44.01.11.222] Hiển thị sai dữ liệu field "Tổng ngày công hưởng lương" trên app (task portal 0167245)
                            // => before: dataListTable && dataListTable.TotalDaysReceiveSalary ? dataListTable.TotalDaysReceiveSalary : 0,
                            /* => after: */ TotalDaysReceiveSalary:
                                listAttendanceTableID && listAttendanceTableID.TotalDaysReceiveSalary
                                    ? listAttendanceTableID.TotalDaysReceiveSalary
                                    : 0,
                            TotalOvertimeHours:
                                datAttendanceTable && datAttendanceTable.TotalOvertimeHours
                                    ? datAttendanceTable.TotalOvertimeHours
                                    : 0,
                            TotalUnpaidLeaves:
                                datAttendanceTable && datAttendanceTable.TotalUnpaidLeaves
                                    ? datAttendanceTable.TotalUnpaidLeaves
                                    : 0
                        };

                        if (dataListTable.length > 0) {
                            let firstDay = dataListTable[0].WorkDate;

                            checkDateOfWeek = moment(firstDay).day();

                            for (let i = 0; i < checkDateOfWeek; i++) {
                                dataTemp.push({});
                            }
                        }

                        // console.log([...dataTemp, ...dataListTable], 'checkDateOfWeek')
                        this.setState(
                            {
                                checkDateOfWeek: checkDateOfWeek,
                                dataCalendar: [...dataTemp, ...dataListTable],
                                fullData: dataListTable,
                                dataSource: dataListTable,
                                isLoading: false,
                                refreshing: false,
                                footerLoading: false,
                                isLoadingHeader: isLazyLoading ? false : true
                            },
                            () => {
                                setTotalWorkDay(objTotalWorkDay);
                            }
                        );
                    } else if (res == EnumName.E_EMPTYDATA) {
                        this.setState(
                            {
                                checkDateOfWeek: 0,
                                dataCalendar: EnumName.E_EMPTYDATA,
                                fullData: [],
                                dataSource: EnumName.E_EMPTYDATA,
                                isLoading: false,
                                refreshing: false,
                                footerLoading: false,
                                isLoadingHeader: isLazyLoading ? false : true
                            },
                            () => {
                                setTotalWorkDay(objTotalWorkDay);
                            }
                        );
                    }

                    VnrLoadingSevices.hide();
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

    _handleRefresh = () => {
        const { pullToRefresh } = this.props;
        this.setState({ refreshing: true }, () => {
            pullToRefresh && typeof pullToRefresh === 'function' && pullToRefresh();
        });
    };

    _renderLoading = () => {
        this.successRender = true;
        return (
            <View style={styles.styloadingFooter}>
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

    selectDateItem = (indexItem) => {
        // let { dataCalendar, isReloadCalendar } = this.state;
        // if (dataCalendar && dataCalendar.length > 0) {
        //     dataCalendar = dataCalendar.map(item => {
        //         if (item.ID == ID) {
        //             item.isSelect = true;
        //         }
        //         else {
        //             item.isSelect = false;
        //         }
        //         return item;
        //     })
        //     this.setState({
        //         dataCalendar,
        //         isReloadCalendar: !isReloadCalendar
        //     }, () => {
        this.scrollToItemByIndex(indexItem);
        //     })
        // }
    };

    scrollToItemByIndex = (index) => {
        const { checkDateOfWeek } = this.state;
        try {
            // nhan.nguyen: 0178889: [Hotfix_FGL_v8.10.44.01.11.304] chọn ngày trên bảng công chi tiết tại app , ngày công không tự map theo
            const realIndex = checkDateOfWeek < 0 ? 0 : index - checkDateOfWeek;
            this.refFlatList.scrollTo({ x: 0, y: this.dataSourceCords[realIndex], animated: true });
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    render() {
        const { dataSource, stateProps, isLoading, refreshing, isOpenAction, dataCalendar } = this.state;

        let contentList = <View />,
            contentCalendar = <View />,
            lisWeekName = {
                VN: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
                EN: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
            };
        if (isLoading) {
            contentList = <VnrLoading size="large" isVisible={isLoading} />;
        } else if (dataSource == EnumName.E_EMPTYDATA || dataSource.length <= 0) {
            contentList = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataSource && dataSource.length > 0) {
            contentList = (
                <FlatList
                    onLayout={(event) => {
                        const layout = event.nativeEvent.layout;
                        // eslint-disable-next-line no-undef
                        this.dataSourceCords[index] = layout.y;
                    }}
                    // eslint-disable-next-line no-undef
                    key={index}
                    style={{ paddingTop: Size.defineSpace }}
                    showsVerticalScrollIndicator={false}
                    ref={(ref) => (this.refFlatList = ref)}
                    disableScrollViewPanResponder={true} // fix bug khong the click onPess sau khi pulltoRefresh
                    data={dataSource}
                    extraData={this.state}
                    ListFooterComponent={this._renderLoading}
                    ListHeaderComponent={this._renderHeaderLoading}
                    //onEndReached={()=> console.log('onEndReached')}
                    // onEndReachedThreshold = {(number) => {
                    //     console.log(number,'numbernumber')
                    // }}
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
                                        <AttendanceCalendarDetailItem
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
                    keyExtractor={(item) => {
                        //console.log(item.ID,'item.ID')
                        return item.ID;
                    }}
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

            contentCalendar = (
                <FlatList
                    scrollEnabled={false}
                    style={{ backgroundColor: Colors.white }}
                    data={dataCalendar}
                    numColumns={7}
                    columnWrapperStyle={
                        {
                            //   marginTop: PADDING * 0.5,
                            //   marginBottom: PADDING * 0.5,
                            //   paddingHorizontal: Size.defineSpace,
                        }
                    }
                    renderItem={({ item, index }) => {
                        // let colorStatusView = null;
                        // if (item.TitleWeek != null) {
                        //     return null
                        // }
                        // // xử lý color
                        // if (item.itemStatus) {
                        //     const { colorStatus } = item.itemStatus;
                        //     colorStatusView = colorStatus ? colorStatus : null;
                        // }

                        return item.WorkDate ? (
                            <TouchableOpacity
                                key={index}
                                style={styles.styViewListWrapItem}
                                onPress={() => this.selectDateItem(index, item.ID)}
                            >
                                <View style={[styles.styDateItemUnActive, item.isSelect && styles.styDateItemActive]}>
                                    {item.WorkDate && (
                                        <Text
                                            style={[
                                                styleSheets.text,
                                                styles.styDateText,
                                                item.isSelect && styles.styDateTextActive,
                                                item.IsHaveNotShift && styles.styDateHaveNotShift,
                                                item.IsHaveNotWorking && styles.styDateHaveNotWorking
                                            ]}
                                            numberOfLines={1}
                                        >
                                            {moment(item.WorkDate).format('DD')}
                                        </Text>
                                    )}
                                </View>

                                <View style={styles.styViewDot}>
                                    {item.ListLeaveday && item.ListLeaveday.length > 0 && (
                                        <View style={styles.dotSttLeaveDay} />
                                    )}

                                    {item.ListOvertime && item.ListOvertime.length > 0 && (
                                        <View style={styles.dotSttOvertime} />
                                    )}

                                    {item.LateEarlyMinutes != null && item.LateEarlyMinutes > 0 && (
                                        <View style={styles.dotSttForgeLeaveday} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <View
                                key={index}
                                style={styles.styViewListWrapItem}
                                onPress={() => this.selectDateItem(index, item.ID)}
                            >
                                <View style={[styles.styDateItemUnActive, item.isSelect && styles.styDateItemActive]} />
                            </View>
                        );
                    }}
                    keyExtractor={(item, index) => {
                        return index;
                    }}
                />
            );
        }

        return (
            <View style={[isOpenAction == true && { paddingBottom: heightActionBottom }, styleSheets.container]}>
                <View style={styles.styViewTypeChange}>
                    <View style={styles.styDotTypeItem}>
                        <View style={styles.styDotType} />
                        <VnrText style={[styleSheets.text, styles.styDotTypeLable]} i18nKey={'HRM_Att_Overtime'} />
                    </View>

                    <View style={styles.styDotTypeItem}>
                        <View style={[styles.styDotType, { backgroundColor: Colors.purple }]} />
                        <VnrText
                            style={[styleSheets.text, styles.styDotTypeLable]}
                            i18nKey={'AnnualLeaveDetailType__E_ANNUAL_LEAVE'}
                        />
                    </View>

                    <View style={styles.styDotTypeItem}>
                        <View style={[styles.styDotType, { backgroundColor: Colors.orange }]} />
                        <VnrText style={[styleSheets.text, styles.styDotTypeLable]} i18nKey={'LateEarlyRoot'} />
                    </View>

                    <View style={styles.styDotTypeItem}>
                        <View style={[styles.styDotType, { backgroundColor: Colors.green }]} />
                        <VnrText style={[styleSheets.text, styles.styDotTypeLable]} i18nKey={'Att_BusinessTrip'} />
                    </View>
                </View>

                <View style={styles.styViewListWrap}>
                    {lisWeekName[dataVnrStorage.languageApp == 'EN' ? 'EN' : 'VN'].map((text, index) => (
                        <View key={index} style={styles.styViewListWeekItem}>
                            <Text style={[styleSheets.text, styles.styWeekNameText]}>{text}</Text>
                        </View>
                    ))}
                </View>

                <View>{contentCalendar}</View>

                {contentList}
            </View>
        );
    }
}

const WIDTH_DATE = Size.text * 2.2; //25;
const WIDTH_DOT = 4;
const WIDTH_DOT_MASTER = 7;

const styles = StyleSheet.create({
    styloadingFooter: {
        flex: 1,
        paddingVertical: styleSheets.p_10
    },
    styViewTypeChange: {
        flexDirection: 'row',
        width: Size.deviceWidth
    },
    styDotTypeItem: {
        height: 30,
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    styDotTypeLable: {
        fontSize: Size.text - 2
    },
    styDotType: {
        backgroundColor: Colors.red,
        width: WIDTH_DOT_MASTER,
        height: WIDTH_DOT_MASTER,
        borderRadius: WIDTH_DOT_MASTER / 2,
        marginRight: 5,
        marginTop: 2
    },
    styViewListWrap: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        backgroundColor: Colors.white,
        paddingTop: Size.defineHalfSpace
    },
    styViewListWeekItem: {
        flex: 1,
        alignItems: 'center',
        paddingHorizontal: 2,
        marginBottom: 5
    },
    styViewListWrapItem: {
        width: Size.deviceWidth / 7,
        maxWidth: Size.deviceWidth / 7,
        alignItems: 'center',
        paddingHorizontal: 2,
        marginTop: 2,
        marginBottom: 2
    },
    styWeekNameText: {
        fontWeight: '600',
        color: Colors.gray_7,
        fontSize: Size.text - 2
    },
    styDateItemUnActive: {
        width: WIDTH_DATE,
        height: WIDTH_DATE,
        borderRadius: WIDTH_DATE / 2,
        // paddingHorizontal: 5,
        paddingVertical: 3,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styDateItemActive: {
        width: WIDTH_DATE,
        height: WIDTH_DATE,
        borderRadius: WIDTH_DATE / 2,
        paddingHorizontal: 5,
        paddingVertical: 3,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary
    },
    styDateText: {
        fontSize: Size.text - 2,
        color: Colors.gray_10
    },
    styDateTextActive: {
        color: Colors.white
    },
    styDateHaveNotShift: {
        color: Colors.gray_7
    },
    styDateHaveNotWorking: {
        color: Colors.red
    },
    styViewDot: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    dotSttLeaveDay: {
        backgroundColor: Colors.purple,
        width: WIDTH_DOT,
        height: WIDTH_DOT,
        borderRadius: WIDTH_DOT / 2,
        marginRight: 2,
        marginTop: 3
    },
    dotSttOvertime: {
        backgroundColor: Colors.red,
        width: WIDTH_DOT,
        height: WIDTH_DOT,
        borderRadius: WIDTH_DOT / 2,
        marginRight: 2,
        marginTop: 3
    },
    dotSttForgeLeaveday: {
        backgroundColor: Colors.orange,
        width: WIDTH_DOT,
        height: WIDTH_DOT,
        borderRadius: WIDTH_DOT / 2,
        marginRight: 2,
        marginTop: 3
    }
});
