import React, { Component } from 'react';
import { View, Animated, Text, Image, StyleSheet, ScrollView } from 'react-native';
import {
    styleSheets,
    Colors,
    Size,
    CustomStyleSheet,
    stylesScreenDetailV3,
    styleContentFilterDesign,
    styleContentFilterDesignV3
} from '../../../../../constants/styleConfig';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import moment from 'moment';
import { getDataLocal } from '../../../../../factories/LocalData';
import DrawerServices from '../../../../../utils/DrawerServices';
import { translate } from '../../../../../i18n/translate';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import VnrFormatStringTypeItem from '../../../../../componentsV3/VnrFormatStringType/VnrFormatStringTypeItem';
import VnrFilterCommon from '../../../../../componentsV3/VnrFilter/VnrFilterCommon';
import { ConfigListFilter } from '../../../../../assets/configProject/ConfigListFilter';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';

let configList = null,
    enumName = null,
    attLeaveFundCompensatoryViewDetail = null,
    attLeaveFundCompensatoryViewDetailKeyTask = null,
    pageSizeList = 20;

class AttLeaveFundCompensatoryViewDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataBody: null,
            dataSource: [],
            isRefreshList: false,
            isLazyLoading: false,
            keyQuery: EnumName.E_PRIMARY_DATA,
            totalLeave: 0,
            leaveTaken: 0,
            leaveReman: 0,
            isLoading: true,
            dataChange: false //biến check dữ liệu có thay đổi hay không
        };
        this.AttLeaveDayReplacementAddOrEdit = null;
        this.isHaveFilter = ConfigListFilter.value['AttLeaveFundCompensatoryViewDetail'];

        // animation filter
        this.scrollYAnimatedValue = new Animated.Value(0);

        this.storeParamsDefault = null;

        //biến lưu lại object filter
        this.paramsFilter = null;
        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {});
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    reload = (paramsFilter) => {
        if (paramsFilter?.DateFrom && paramsFilter?.DateTo) {
            paramsFilter.DateFrom = moment(paramsFilter.DateFrom).format('DD/MM/YYYY');
            paramsFilter.DateTo = moment(paramsFilter.DateTo).format('DD/MM/YYYY');
        }
        if (paramsFilter === 'E_KEEP_FILTER') {
            paramsFilter = { ...this.paramsFilter };
        } else {
            this.paramsFilter = { ...paramsFilter };
        }

        let _paramsDefault = this.storeParamsDefault ? this.storeParamsDefault : this.paramsDefault(),
            _keyQuery = EnumName.E_FILTER;

        _paramsDefault = {
            ..._paramsDefault,
            keyQuery: _keyQuery,
            isRefreshList: !this.state.isRefreshList, // reload lại ds.
            dataBody: {
                ..._paramsDefault?.dataBody,
                ...paramsFilter,
                Year:
                    paramsFilter && paramsFilter.Year
                        ? `${paramsFilter.Year}/01/01`
                        : `${parseInt(moment(new Date()).format('YYYY'))}`
            }
        };
        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: attLeaveFundCompensatoryViewDetailKeyTask,
                payload: {
                    ...dataBody,
                    keyQuery: keyQuery,
                    isCompare: false,
                    reload: this.reload
                }
            });
        });
    };

    remoteData = (isLazyLoading) => {
        const { keyQuery } = this.state;
        getDataLocal(EnumTask.KT_AttLeaveFundCompensatoryViewDetail)
            .then((resData) => {
                const res = resData && resData[keyQuery] ? resData[keyQuery] : null;

                if (Array.isArray(res?.Data?.Data)) {
                    res.Data = res?.Data?.Data;
                }

                if (res && res !== EnumName.E_EMPTYDATA) {
                    let data = [];

                    if (res && (res.Data || res.data)) {
                        if (res.data) {
                            data = [...res.data];
                        } else if (res.Data) {
                            data = [...res.Data];
                        }
                    } else if (res && Array.isArray(res)) {
                        data = [...res];
                    }

                    this.setState(
                        {
                            dataSource: data,
                            isLoading: false,
                            refreshing: false,
                            isLoadingHeader: isLazyLoading ? false : true,
                            isLoadingFooter: false,
                            isPullToRefresh: !this.state.isPullToRefresh
                        },
                        () => {
                            setTimeout(() => {
                                this.endLoading = false;
                            }, 1000);
                        }
                    );
                } else if (res === EnumName.E_EMPTYDATA) {
                    this.setState({
                        dataSource: EnumName.E_EMPTYDATA,
                        isLoading: false,
                        refreshing: false,
                        isLoadingHeader: isLazyLoading ? false : true,
                        isLoadingFooter: false,
                        isPullToRefresh: !this.state.isPullToRefresh
                    });
                }
            })
            .catch((error) => {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            });
    };

    checkDataFormNotify = () => {
        const { params = {} } = this.props.navigation.state,
            _params = typeof params == 'object' ? params : JSON.parse(params);
        return _params;
    };

    paramsDefault = () => {
        const _configList = configList[attLeaveFundCompensatoryViewDetail],
            //orderBy = _configList[enumName.E_Order],
            renderRow = _configList[enumName.E_Row],
            filter = _configList[enumName.E_Filter],
            groupField = _configList[enumName.E_Field_Group] ? _configList[enumName.E_Field_Group] : null,
            dataFromParams = this.checkDataFormNotify();
        const _paramsNavigate = this.props.navigation.state.params;
        let nextState = {},
            totalLeave = 0,
            leaveTaken = 0,
            leaveReman = 0;

        if (Array.isArray(_paramsNavigate?.fullData?.GeneralModel) && _paramsNavigate?.Type) {
            _paramsNavigate?.fullData?.GeneralModel.map((item) => {
                if (item[_paramsNavigate?.Type] !== null && item[_paramsNavigate?.Type] !== undefined) {
                    // tổng phép
                    if (item?.Field === 'Available') {
                        totalLeave = item[_paramsNavigate?.Type];
                    }

                    // phép đã nghỉ
                    if (item?.Field === 'TotalLeaveBef') {
                        leaveTaken = item[_paramsNavigate?.Type];
                    }

                    // phép còn lại
                    if (item?.Field === 'Remain') {
                        leaveReman = item[_paramsNavigate?.Type];
                    }
                }
            });
            nextState = {
                totalLeave,
                leaveTaken,
                leaveReman
            };
        }

        let _params = {
            ...dataFromParams,
            IsPortalNew: true,
            filter: filter,
            pageSize: pageSizeList,
            Year: `${parseInt(moment(new Date()).format('YYYY'))}`
        };

        return {
            // rowActions: dataRowActionAndSelected.rowActions,
            // selected: dataRowActionAndSelected.selected,
            renderRow: renderRow,
            groupField: groupField,
            dataBody: _params,
            keyQuery: EnumName.E_PRIMARY_DATA,
            ...nextState
        };
    };

    pullToRefresh = () => {
        const { dataBody, keyQuery } = this.state;
        this.setState(
            {
                keyQuery: keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA
            },
            () => {
                startTask({
                    keyTask: attLeaveFundCompensatoryViewDetailKeyTask,
                    payload: {
                        ...dataBody,
                        keyQuery: keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA,
                        isCompare: false,
                        reload: this.reload
                    }
                });
            }
        );
    };

    pagingRequest = (page) => {
        const { dataBody } = this.state;
        this.setState(
            {
                keyQuery: EnumName.E_PAGING
            },
            () => {
                startTask({
                    keyTask: attLeaveFundCompensatoryViewDetailKeyTask,
                    payload: {
                        ...dataBody,
                        page: page,
                        pageSize: 20,
                        keyQuery: EnumName.E_PAGING,
                        isCompare: false,
                        reload: this.reload,
                        dataSourceRequestString: `page=${page}&pageSize=20`,
                        take: 20
                    }
                });
            }
        );
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == attLeaveFundCompensatoryViewDetailKeyTask) {
            //khi màn hình đang reload thì messsage phải là filter thì màn hình mới reload
            if (keyQuery === EnumName.E_FILTER && nextProps.message && keyQuery == nextProps.message.keyQuery) {
                this.remoteData(true); //dữ liệu đổi thì reload datalocal
            } else if (nextProps.message && keyQuery == nextProps.message.keyQuery) {
                // dataChange == true ? khác : giống nhau
                if (!nextProps.message.dataChange) {
                    this.setState({
                        isLoadingHeader: false //dữ liệu không đổi thì ngừng load
                    });
                } else {
                    this.remoteData(true); //dữ liệu đổi reload datalocal
                }
            }
        }
    }

    componentDidMount() {
        if (!ConfigList.value[ScreenName.AttLeaveFundCompensatoryViewDetail]) {
            ConfigList.value[ScreenName.AttLeaveFundCompensatoryViewDetail] = {
                Order: [
                    {
                        field: 'TimeLog',
                        dir: 'desc'
                    }
                ],
                Filter: [
                    {
                        logic: 'and',
                        filters: []
                    }
                ],
                Row: [
                    {
                        TypeView: 'E_GROUP',
                        Name: 'WorkDateRoot',
                        DisplayKey: 'HRM_PortalApp_AttLeaveFund_OvertimeDate',
                        DataType: 'datetime',
                        DataFormat: 'DD/MM/YYYY'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'DateApprove',
                        DisplayKey: 'HRM_PortalApp_AttLeaveFund_ApproveDate',
                        DataType: 'datetime',
                        DataFormat: 'DD/MM/YYYY'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'ApproveHours',
                        DisplayKey: 'HRM_PortalApp_AttLeaveFund_ApproveHours',
                        DataType: 'string'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'CompLeaveHours',
                        DisplayKey: 'HRM_PortalApp_AttLeaveFund_CompLeaveHours',
                        DataType: 'string'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'RemainCompLeaveHours',
                        DisplayKey: 'HRM_PortalApp_AttLeaveFund_RemainCompLeaveHours',
                        DataType: 'string'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'DateExpired',
                        DisplayKey: 'HRM_PortalApp_AttLeaveFund_DateExpired',
                        DataType: 'datetime',
                        DataFormat: 'DD/MM/YYYY'
                    }
                ],
                BusinessAction: []
            };
        }

        attLeaveFundCompensatoryViewDetail = ScreenName.AttLeaveFundCompensatoryViewDetail;
        attLeaveFundCompensatoryViewDetailKeyTask = EnumTask.KT_AttLeaveFundCompensatoryViewDetail;
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);
        this.remoteData();
        startTask({
            keyTask: attLeaveFundCompensatoryViewDetailKeyTask,
            payload: {
                ..._paramsDefault.dataBody,
                pageSize: pageSizeList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload,
                skip: 0,
                take: 20
            }
        });
    }

    render() {
        const { totalLeave, leaveReman, leaveTaken, dataSource, renderRow, dataBody, isLoading } = this.state;

        let contentList = <View />;
        if (isLoading) {
            contentList = (
                <VnrLoading
                    size="large" color={Colors.primary}
                />
            );
        } else if (dataSource == EnumName.E_EMPTYDATA || dataSource.length == 0) {
            contentList = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataSource && dataSource.length > 0) {
            contentList = (
                <ScrollView style={CustomStyleSheet.flex(1)}>
                    {dataSource.length > 0 && (
                        <View style={[CustomStyleSheet.flex(1)]}>
                            {dataSource.map((dataItem, index) => {
                                return (
                                    <View style={styles.styContainer} key={index}>
                                        {renderRow.map((item, i) => {
                                            if (item.TypeView === 'E_GROUP') {
                                                return (
                                                    <View
                                                        key={i}
                                                        style={[
                                                            CustomStyleSheet.paddingRight(16),
                                                            CustomStyleSheet.marginBottom(10),
                                                            styles.styItemContentGroup
                                                        ]}
                                                    >
                                                        <Text
                                                            style={[
                                                                styleSheets.lable,
                                                                stylesScreenDetailV3.styTextGroup,
                                                                CustomStyleSheet.flex(1)
                                                            ]}
                                                        >
                                                            {`${translate(item.DisplayKey)}: ${dataItem[item.Name] && item.DataType === 'datetime' ? moment(dataItem[item.Name]).format(item.DataFormat) : ''}`}
                                                        </Text>
                                                    </View>
                                                );
                                            } else {
                                                return (
                                                    <View key={i} style={[CustomStyleSheet.paddingHorizontal(16)]}>
                                                        <VnrFormatStringTypeItem
                                                            key={i}
                                                            data={dataItem}
                                                            col={item}
                                                            allConfig={renderRow}
                                                        />
                                                    </View>
                                                );
                                            }
                                        })}
                                    </View>
                                );
                            })}
                        </View>
                    )}
                </ScrollView>
            );
        }

        return (
            <SafeAreaViewDetail style={CustomStyleSheet.flex(1)}>
                <VnrFilterCommon
                    dataBody={dataBody}
                    style={{
                        ...styleContentFilterDesign,
                        ...styleContentFilterDesignV3
                    }}
                    screenName={attLeaveFundCompensatoryViewDetail}
                    onSubmitEditing={this.reload}
                    scrollYAnimatedValue={this.scrollYAnimatedValue}
                />
                <View
                    style={[
                        styles.wrapHeader,
                        this.isHaveFilter
                            ? { ...CustomStyleSheet.paddingTop(80), ...CustomStyleSheet.marginTop(0) }
                            : { ...CustomStyleSheet.paddingTop(16), ...CustomStyleSheet.marginTop(Size.defineHalfSpace) }
                    ]}
                >
                    <Text style={[styleSheets.text, { fontSize: Size.text + 1 }]}>
                        {translate('HRM_Att_ManageLeave_Available')}
                    </Text>
                    <Text style={[styleSheets.lable, CustomStyleSheet.fontSize(24)]}>
                        {totalLeave} {translate('HRM_PortalApp_Day_Lowercase')}
                    </Text>
                </View>
                <View style={styles.wrapMiddle}>
                    <View style={styles.itemMiddle}>
                        <View style={styles.wrapImgInMiddle}>
                            <Image source={require('../../../../../assets/images/paidLeave/leavetaken.png')} />
                        </View>
                        <View style={{ ...CustomStyleSheet.flex(1), ...CustomStyleSheet.paddingLeft(6) }}>
                            <Text
                                numberOfLines={1}
                                style={[
                                    styleSheets.text,
                                    {
                                        ...CustomStyleSheet.fontSize(Size.text - 1),
                                        ...CustomStyleSheet.maxWidth('100%')
                                    }
                                ]}
                            >
                                {translate('HRM_PortalApp_Remaining_Leave')}
                            </Text>
                            <Text style={[styleSheets.lable, { fontSize: Size.text + 3 }]}>
                                {leaveReman} {translate('HRM_PortalApp_Day_Lowercase')}
                            </Text>
                        </View>
                    </View>
                    <View style={styles.itemMiddle}>
                        <View style={styles.wrapImgInMiddle}>
                            <Image source={require('../../../../../assets/images/paidLeave/leaveremain.png')} />
                        </View>
                        <View style={{ ...CustomStyleSheet.flex(1), ...CustomStyleSheet.paddingLeft(6) }}>
                            <Text
                                numberOfLines={1}
                                style={[
                                    styleSheets.text,
                                    {
                                        ...CustomStyleSheet.fontSize(Size.text - 1),
                                        ...CustomStyleSheet.maxWidth('100%')
                                    }
                                ]}
                            >
                                {translate('HRM_PortalApp_Leave_Used')}
                            </Text>
                            <Text style={[styleSheets.lable, { fontSize: Size.text + 3 }]}>
                                {leaveTaken} {translate('HRM_PortalApp_Day_Lowercase')}
                            </Text>
                        </View>
                    </View>
                </View>
                {contentList}
            </SafeAreaViewDetail>
        );
    }
}

const styles = StyleSheet.create({
    styContainer: {
        backgroundColor: Colors.white,
        paddingBottom: 10
    },
    styItemContentGroup: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 16,
        backgroundColor: Colors.gray_3
    },
    wrapHeader: {
        width: '100%',
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        borderBottomColor: Colors.gray_3,
        borderBottomWidth: 0.5
    },

    wrapMiddle: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    itemMiddle: {
        flex: 0.5,
        padding: 16,
        backgroundColor: Colors.white,
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
        borderRightColor: Colors.gray_3,
        borderRightWidth: 0.5
    },

    wrapImgInMiddle: {
        width: 40,
        height: 40,
        backgroundColor: Colors.gray_3,
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(mapStateToProps, null)(AttLeaveFundCompensatoryViewDetail);
