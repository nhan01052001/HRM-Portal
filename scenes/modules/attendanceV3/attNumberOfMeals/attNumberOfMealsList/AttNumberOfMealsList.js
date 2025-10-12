import React from 'react';
import {
    View,
    FlatList,
    RefreshControl,
    Text,
    StyleSheet
} from 'react-native';
import { Colors, CustomStyleSheet, Size, stylesScreenDetailV3 } from '../../../../../constants/styleConfig';
import VnrLoadingScreen from '../../../../../components/VnrLoading/VnrLoadingScreen';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { EnumName, EnumStatus, ScreenName } from '../../../../../assets/constant';
import VnrRenderList from '../../../../../componentsV3/VnrRenderList/VnrRenderList';
import AttNumberOfMealsItem from './AttNumberOfMealsItem';
import DrawerServices from '../../../../../utils/DrawerServices';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import { getDataLocal } from '../../../../../factories/LocalData';
import { ConfigListFilter } from '../../../../../assets/configProject/ConfigListFilter';
import VnrIndeterminate from '../../../../../components/VnrLoading/VnrIndeterminate';
import AttNumberOfMealsItemHistory from './AttNumberOfMealsItemHistory';
import { translate } from '../../../../../i18n/translate';
import { TouchableOpacity } from 'react-native';
import VnrDateFromTo from '../../../../../componentsV3/VnrDateFromTo/VnrDateFromTo';
import moment from 'moment';

export default class AttNumberOfMealsList extends VnrRenderList {
    constructor(props) {
        super(props);
        this.state = {
            //valueField: "ID",
            itemSelected: [],
            refreshing: false, //biến hiển thị loading pull to refresh
            isLoading: true, // biến hiển thị loading dữ liệu cho danh sách
            // stateProps: { ...props },
            dataSource: [],
            dataNoGroup: [],
            totalRow: 0,
            page: 1,
            isLoadingFooter: false, // biến hiển thị loading ở footer hay không
            isOpenAction: false, // biến ẩn hiện Action
            messageEmptyData: 'EmptyData',
            marginTopNumber: 0,
            isDisableSelectItem: null,
            isPullToRefresh: false, // biến dùng phủ định lại dữ liệu để render lại RenderItem
            isAddItemChecked: false, // biến dùng để reload DS khi add item checked
            isLoadingHeader: true, // biến hiển thị đang compare data local

            actionReal: [],
            isCheckAll: false,
            TotalMealsToday: 0,
            DateFromTo: {
                refresh: false,
                disable: false,
                value: null
            }
        };
        this.endLoading = false;
        this.callOnEndReached = false;
        this.oldIndexOpenSwipeOut = null;
        this.listItemOpenSwipeOut = [];
        this.isHaveFilter = props?.detail && props.detail?.screenName && ConfigListFilter.value[props.detail.screenName];

        if (
            !Vnr_Function.CheckIsNullOrEmpty(this.props?.api) &&
            !Vnr_Function.CheckIsNullOrEmpty(this.props?.api?.pageSize) &&
            typeof this.props?.api?.pageSize == 'number'
        ) {
            this.pageSize = this.props?.api?.pageSize;
        } else {
            this.pageSize = 20;
        }

        //biến để kiểm tra có check all server
        this.isCheckAllServer = false;

        this.scrollDirection = '';
        this.lastOffsetY = 0;
        this.refFlatList = null;
        this.stateEndScroll = true;
        this.refVnrDateFromTo = null;
    }

    _remoteData = () => {
        const { page } = this.state, { keyDataLocal, keyQuery, detail, groupField, isRefreshList } = this.props;
        if (keyDataLocal) {
            getDataLocal(keyDataLocal)
                .then(resData => {
                    const res = resData && resData[keyQuery] ? resData[keyQuery] : null;

                    let TotalMealsToday = 0;
                    let nextState = {
                        DateFromTo: {
                            ...this.state.DateFromTo,
                            value: null
                        }
                    };

                    if (
                        res &&
                        res !== EnumName.E_EMPTYDATA &&
                        ((res?.data && Object.keys(res?.data).length > 0) ||
                            (res?.Data && Object.keys(res?.Data).length > 0))
                    ) {
                        let data = [], dataNoGroup = [], total = 1;

                        if (res && (res.Data || res.data)) {
                            if (res.data?.ListCalendarDetail) {
                                data = [...res.data?.ListCalendarDetail];
                            } else if (res.Data) {
                                data = [...res.Data?.ListCalendarDetail];
                            }
                        } else if (res && Array.isArray(res)) {
                            data = [...res];
                        }

                        if (detail?.screenName === ScreenName.AttNumberOfMeals)
                            data = [data[0]];
                        if (data?.[0]?.DateMeal) {
                            nextState = {
                                DateFromTo: {
                                    refresh: !this.state.DateFromTo.refresh,
                                    value: [moment(data?.[0]?.DateMeal).format('YYYY-MM-DD')]
                                }
                            };
                        }

                        data.map(item => {
                            if (item?.ListMealByOrg?.length > 0) {
                                item?.ListMealByOrg?.map((mealOrg) => {
                                    TotalMealsToday += mealOrg.ToTalMeal || 0;
                                });
                                item?.ListMealByOrg?.sort((a, b) => {
                                    const hourA = parseInt(a.MealTimeName.replace('H', ''), 10);
                                    const hourB = parseInt(b.MealTimeName.replace('H', ''), 10);
                                    return hourA - hourB;
                                });
                            }
                        });

                        if (page === 1) {
                            dataNoGroup = [...data];
                        }

                        if (groupField && Array.isArray(groupField) && groupField.length > 0) {
                            if (page !== 1) {
                                dataNoGroup = [...this.state.dataNoGroup, ...data];
                                data = Vnr_Services.applyGroupField(dataNoGroup, groupField);

                                if (data && Array.isArray(data) && this.state.itemSelected.length > 0) {
                                    data.forEach(element => {
                                        let rs = null;
                                        if (element?.dataGroupMaster && Array.isArray(element.dataGroupMaster)) {
                                            rs = element.dataGroupMaster.find(value => value.isSelect === false);
                                        }

                                        element.isCheckAll = rs ? false : true;
                                    });
                                }
                            } else {
                                data = Vnr_Services.applyGroupField(data, groupField);
                            }

                        } else if (page !== 1) {
                            data = [...this.state.dataNoGroup, ...data];
                            dataNoGroup = data;
                        }

                        if (data.length > 0 && data.total) {
                            total = data.total;
                        } else if (data.length > 0 && data.Total) {
                            total = data.Total;
                        } else if (data.length > 0 && data[0].TotalRow) {
                            total = data[0].TotalRow;
                        } else if (data.length > 0 && data[0].TotalRow) {
                            total = data[0].TotalRow;
                        }

                        this.setState(
                            {
                                isCheckAll: false,
                                itemSelected: keyQuery && keyQuery === 'E_FILTER' && isRefreshList
                                    ? []
                                    : this.state.itemSelected.length > 0
                                        ? this.state.itemSelected
                                        : [],
                                dataSource: data,
                                dataNoGroup: dataNoGroup,
                                totalRow: total,
                                isLoading: false,
                                refreshing: false,
                                isLoadingHeader: false,
                                isLoadingFooter: false,
                                isOpenAction: false,
                                isPullToRefresh: !this.state.isPullToRefresh,
                                TotalMealsToday: TotalMealsToday,
                                ...nextState
                            },
                            () => {
                                setTimeout(() => {
                                    this.endLoading = false;
                                }, 1000);
                            }
                        );
                    } else if (
                        res === EnumName.E_EMPTYDATA ||
                        ((res?.data && Object.keys(res?.data).length === 0) ||
                            (res?.Data && Object.keys(res?.Data).length === 0))
                    ) {
                        this.setState({
                            itemSelected: [],
                            dataNoGroup: [],
                            dataSource: EnumName.E_EMPTYDATA,
                            totalRow: 0,
                            isLoading: false,
                            refreshing: false,
                            isLoadingHeader: false,
                            isLoadingFooter: false,
                            isOpenAction: false,
                            isPullToRefresh: !this.state.isPullToRefresh,
                            TotalMealsToday: 0,
                            DateFromTo: {
                                ...this.state.DateFromTo,
                                value: null
                            }
                        });
                    }
                })
                .catch(error => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                });
        } else {
            DrawerServices.navigate('ErrorScreen', {
                ErrorDisplay: 'Thiêu Prop keyDataLocal'
            });
        }
    };
    get remoteData() {
        return this._remoteData;
    }
    set remoteData(value) {
        this._remoteData = value;
    }

    _renderHeaderLoading = () => {
        const { TotalMealsToday, dataSource } = this.state;

        return (
            <View style={{ width: Size.deviceWidth }}>
                <VnrIndeterminate
                    isVisible={(this.isHaveFilter && this.state.refreshing) || this.state.isLoadingHeader}
                />
                {
                    this.props?.detail?.screenName === ScreenName.AttNumberOfMeals && (
                        <TouchableOpacity
                            onPress={() => {
                                if (this.refVnrDateFromTo && this.refVnrDateFromTo.showModal) {
                                    // Show modal chọn ngày đăng ký
                                    this.refVnrDateFromTo.showModal();
                                }
                            }}
                            activeOpacity={0.7} style={styles.wrapHeader}>
                            <View>
                                <Text style={styles.textTimeHeader}>
                                    {typeof dataSource[0]?.DateOfWeek === 'string' ? dataSource[0]?.DateOfWeek?.split(',')[0] : dataSource[0]?.DateOfWeek},{' '}
                                    {new Date(dataSource[0]?.DateMeal).toLocaleDateString('vi-VN', {
                                        day: '2-digit',
                                        month: 'long',
                                        year: 'numeric'
                                    })}
                                </Text>
                            </View>

                            <View style={styles.wrapTotalMeal}>
                                <Text style={styles.textTotalMeal}>{translate('HRM_PortalApp_TotalMealsForToday')}</Text>

                                <Text style={[CustomStyleSheet.fontWeight('500'), CustomStyleSheet.color(Colors.white)]}>
                                    <Text style={CustomStyleSheet.fontSize(32)}>{`${TotalMealsToday} `}</Text>
                                    {translate('HRM_PortalApp_Meal')}
                                </Text>
                            </View>
                        </TouchableOpacity>
                    )
                }
            </View>
        );
    };

    render() {
        const {
                dataSource,
                isLoading,
                refreshing,
                isPullToRefresh,
                isOpenAction,
                isDisableSelectItem,
                totalRow,
                DateFromTo
            } = this.state,
            { api, detail, rowActions, scrollYAnimatedValue } = this.props;

        let dataBody = api ? (api.dataBody && this.isCheckAllServer ? api.dataBody : null) : null;
        if (dataBody) {
            dataBody = {
                ...dataBody,
                pageSize: totalRow
            };
        }

        const hiddenFiled = {
            MethodPaymentView: Vnr_Function.checkIsHaveConfigListDetail(detail?.screenName, 'MethodPaymentView'),
            DataNote: Vnr_Function.checkIsHaveConfigListDetail(detail?.screenName, 'ReasonOT')
        };

        let contentList = <View />;
        if (isLoading) {
            let typeLoading =
                detail.screenName == ScreenName.AttApproveWorkingOvertime ||
                    detail.screenName == ScreenName.AttApprovedTSLRegister
                    ? EnumStatus.E_APPROVE
                    : EnumStatus.E_SUBMIT;

            contentList = (
                <VnrLoadingScreen
                    size="large"
                    screenName={this.props.detail ? this.props.detail.screenName : null}
                    isVisible={isLoading}
                    type={typeLoading}
                />
            );
        } else if (dataSource == EnumName.E_EMPTYDATA || dataSource.length == 0) {
            contentList = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataSource && dataSource.length > 0) {
            scrollYAnimatedValue.setValue(0);
            contentList = (
                <FlatList
                    ref={(refs) => (this.refFlatList = refs)}
                    showsVerticalScrollIndicator={false}
                    disableScrollViewPanResponder={true} // fix bug khong the click onPess sau khi pulltoRefresh
                    data={dataSource}
                    extraData={this.state}
                    ListFooterComponent={this._renderFooterLoading}
                    ListHeaderComponent={this._renderHeaderLoading}
                    onScroll={(e) => {
                        const offsetY = e.nativeEvent.contentOffset.y;
                        this.scrollDirection = offsetY - this.lastOffsetY > 0 ? 'up' : 'down';
                        this.lastOffsetY = offsetY;
                        scrollYAnimatedValue.setValue(offsetY);
                    }}
                    onScrollBeginDrag={() => {
                        this.stateEndScroll = false;
                    }}
                    onScrollEndDrag={() => {
                        this.stateEndScroll = true;
                        if (this.lastOffsetY < 80 && !refreshing)
                            this.refFlatList?.scrollToOffset({
                                offset: this.scrollDirection === 'up' ? 80 : 0,
                                animated: true
                            });
                    }}
                    scrollEventThrottle={16}
                    // nếu không có filter thì padding top
                    style={
                        this.isHaveFilter
                            ? { ...CustomStyleSheet.paddingTop(80), ...CustomStyleSheet.marginTop(0) }
                            : { ...CustomStyleSheet.paddingTop(0), ...CustomStyleSheet.marginTop(Size.defineHalfSpace) }
                    }
                    renderItem={({ item, index }) => (
                        <View style={[styles.containBotton]}>
                            <View style={[styles.containBotton]}>
                                <View style={[styles.styleViewBorderButtom, CustomStyleSheet.borderBottomWidth(0)]}>
                                    <View style={CustomStyleSheet.flex(1)}>
                                        {this.props?.detail?.screenName === ScreenName.AttNumberOfMeals ? (
                                            <View style={CustomStyleSheet.flex(1)}>
                                                <Text style={[
                                                    CustomStyleSheet.color(Colors.black),
                                                    CustomStyleSheet.fontSize(18),
                                                    CustomStyleSheet.fontWeight('600'),
                                                    CustomStyleSheet.marginTop(12),
                                                    CustomStyleSheet.marginLeft(12)
                                                ]}>{translate('HRM_PortalApp_PreparationSchedule')}</Text>
                                                <AttNumberOfMealsItem
                                                    key={index}
                                                    hiddenFiled={hiddenFiled}
                                                    currentDetail={detail}
                                                    onClick={() => {
                                                        this.addItemChecked(index, false, null);
                                                    }}
                                                    onMoveDetail={() => {
                                                        this.moveToDetail(item);
                                                    }}
                                                    isDisable={isDisableSelectItem}
                                                    numberDataSoure={dataSource.length}
                                                    isPullToRefresh={isPullToRefresh}
                                                    isOpenAction={isOpenAction}
                                                    isSelect={item.isSelect}
                                                    index={index}
                                                    dataItem={item}
                                                    addItem={this.addItemChecked}
                                                    // toggleAction={this.toggleAction}
                                                    handerOpenSwipeOut={this.handerOpenSwipeOut}
                                                    listItemOpenSwipeOut={this.listItemOpenSwipeOut}
                                                    rowActions={
                                                        !Vnr_Function.CheckIsNullOrEmpty(rowActions) ? rowActions : null
                                                    }
                                                />
                                            </View>
                                        ) : (
                                            <View
                                                style={styles.container}
                                            >
                                                <View style={CustomStyleSheet.marginBottom(8)}>
                                                    <Text
                                                        style={[
                                                            CustomStyleSheet.fontSize(16),
                                                            CustomStyleSheet.fontWeight(500),
                                                            CustomStyleSheet.color(Colors.black)
                                                        ]}
                                                    >
                                                        {item?.DateOfWeek},{' '}
                                                        {new Date(item?.DateMeal).toLocaleDateString('vi-VN', {
                                                            day: '2-digit',
                                                            month: 'long',
                                                            year: 'numeric'
                                                        })}
                                                    </Text>
                                                </View>
                                                {item?.ListMealTime?.length > 0 && (
                                                    <View style={CustomStyleSheet.flex(1)}>
                                                        {item?.ListMealTime?.map((mealTime, i) => {
                                                            return (
                                                                <AttNumberOfMealsItemHistory
                                                                    key={i}
                                                                    dataItem={mealTime}
                                                                    isLastItem={i === item?.ListMealTime?.length - 1}
                                                                />
                                                            );
                                                        })}
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </View>
                    )}
                    keyExtractor={(item, index) => {
                        return index;
                    }}
                    refreshControl={
                        <RefreshControl
                            onRefresh={() => this._handleRefresh()}
                            refreshing={refreshing}
                            size="large"
                            tintColor={Colors.primary}
                        />
                    }
                    onEndReached={() => {
                        // this.callOnEndReached = true;
                        if (!this.endLoading) {
                            this.endLoading = true;
                            this._handleEndRefresh();
                        }
                    }}
                    onEndReachedThreshold={0.5} // khoan cach tinh tu vi tri cuoi ds , se goi onEndReached
                />
            );
        }

        return (
            <View
                style={[
                    styles.containerGrey,
                    CustomStyleSheet.backgroundColor(Colors.gray_4)
                ]}
            >
                <View style={styles.wrapVnrDateFromTo}>
                    <VnrDateFromTo
                        ref={ref => (this.refVnrDateFromTo = ref)}
                        refresh={DateFromTo.refresh}
                        value={DateFromTo.value ? DateFromTo.value : {}}
                        displayOptions={false}
                        onlyChooseOneDay={true}
                        disable={DateFromTo.disable}
                        onFinish={range => {
                            this.setState({
                                DateFromTo: {
                                    refresh: !this.state.DateFromTo.refresh,
                                    value: range
                                }
                            }, () => {
                                if (typeof this.props?.reloadScreenList === 'function') {
                                    this.props?.reloadScreenList({
                                        dateStartFilter: range[0],
                                        dateEndFilter: range[0]
                                    })
                                }
                            })
                        }}
                    />
                </View>
                {contentList}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    ...stylesScreenDetailV3,
    wrapHeader: {
        flex: 1,
        padding: 16,
        backgroundColor: Colors.blue,
        marginHorizontal: 12,
        marginTop: 12,
        borderRadius: 12
    },

    textTimeHeader: {
        fontSize: 14,
        fontWeight: '400',
        color: Colors.white
    },

    textTotalMeal: {
        fontSize: 16,
        fontWeight: '600',
        color: Colors.white
    },

    wrapTotalMeal: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 12
    },

    container: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 12
    },

    wrapVnrDateFromTo: {
        position: 'absolute',
        bottom: -Size.deviceheight
    }
});
