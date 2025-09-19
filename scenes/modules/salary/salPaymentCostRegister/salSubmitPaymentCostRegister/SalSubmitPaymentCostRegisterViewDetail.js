import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleSafeAreaView,
    Size,
    Colors,
    stylesScreenDetailV2,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import VnrText from '../../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import {
    generateRowActionAndSelected,
    SalSubmitPaymentCostRegisterBusinessFunction
} from './SalSubmitPaymentCostRegisterBusiness';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName, EnumStatus, ScreenName } from '../../../../../assets/constant';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { IconDelete, IconEdit, IconPlus } from '../../../../../constants/Icons';
import moment from 'moment';
import { translate } from '../../../../../i18n/translate';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';

const configDefault = [
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Detail_Approve_Info_Common',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'UserApproveName',
        DisplayKey: 'HRM_Attendance_Leaveday_UserApproveID',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'UserApproveName2',
        DisplayKey: 'HRM_Attendance_Leaveday_UserApproveID3',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'UserApproveName3',
        DisplayKey: 'HRM_Attendance_Leaveday_UserApproveID4',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'UserApproveName4',
        DisplayKey: 'HRM_Attendance_Leaveday_UserApproveID2',
        DataType: 'string'
    }
];

export default class SalSubmitPaymentCostRegisterViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            configListDetailInfoEmployee: null,
            dataRowActionAndSelected: generateRowActionAndSelected(),
            listActions: this.resultListActionHeader()
        };

        const _params = props.navigation.state.params,
            { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);

        if (dataItem) {
            props.navigation.setParams({
                title: dataItem.RequestPeriodName
            });
        }
    }

    resultListActionHeader = () => {
        const _params = this.props.navigation.state.params;
        if (_params && _params.listActions && Array.isArray(_params.listActions)) {
            return _params.listActions;
        }
        return [];
    };

    rowActionsHeaderRight = (dataItem) => {
        let _listActions = [];
        const { rowActions } = this.state.dataRowActionAndSelected;

        if (
            !Vnr_Function.CheckIsNullOrEmpty(rowActions) &&
            dataItem &&
            !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction)
        ) {
            _listActions = rowActions.filter((item) => {
                return dataItem.BusinessAllowAction.indexOf(item.type) >= 0;
            });
        }
        return _listActions;
    };

    getDataItem = async (isReload = false) => {
        try {
            const _params = this.props.navigation.state.params,
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail =
                    ConfigListDetail.value[screenName] != null ? ConfigListDetail.value[screenName] : configDefault,
                _configListDetailInfoEmployee =
                    ConfigListDetail.value['SalApprovePaymentCostRegisterViewDetailInfoEmployee'] ?? null;

            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
                VnrLoadingSevices.show();
                let _ID = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID;
                const resAll = await HttpService.MultiRequest([
                    HttpService.Get('[URI_HR]/Sal_GetData/GetSalPaymentCostRegisterById?id=' + _ID),
                    HttpService.Post('[URI_HR]/Sal_GetData/GetPaymentCostByRegisterIDList', {
                        PaymentCostRegisterID: _ID
                    })
                ]);
                const [dataDetail, response] = resAll;
                const _listActions = await this.rowActionsHeaderRight(dataDetail);

                const objGroup = {},
                    objCost = {};

                if (response && response.Data && response.Data.length > 0) {
                    response.Data.map((item) => {
                        if (objGroup[item.PaymentCostGroupName]) {
                            objGroup[item.PaymentCostGroupName].push(item);
                        } else {
                            objGroup[item.PaymentCostGroupName] = [item];
                        }

                        if (objCost[item.PaymentCostGroupName]) {
                            objCost[item.PaymentCostGroupName] += item.TotalAmount;
                        } else {
                            objCost[item.PaymentCostGroupName] = item.TotalAmount;
                        }
                    });
                }

                VnrLoadingSevices.hide();
                this.setState({
                    configListDetailInfoEmployee: _configListDetailInfoEmployee,
                    configListDetail: _configListDetail,
                    dataItem: {
                        ...dataDetail,
                        TotalAmount: Object.values(objCost).reduce((a, b) => a + b, 0),
                        listDataCost: objGroup,
                        listDataTotalCost: objCost
                    },
                    listActions: _listActions
                });
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                let _ID = dataItem.ID;
                const response = await HttpService.Post('[URI_HR]/Sal_GetData/GetPaymentCostByRegisterIDList', {
                    PaymentCostRegisterID: _ID
                });
                const _listActions = await this.rowActionsHeaderRight(dataItem);
                const objGroup = {},
                    objCost = {};

                if (response && response.Data && response.Data.length > 0) {
                    response.Data.map((item) => {
                        if (objGroup[item.PaymentCostGroupName]) {
                            objGroup[item.PaymentCostGroupName].push(item);
                        } else {
                            objGroup[item.PaymentCostGroupName] = [item];
                        }

                        if (objCost[item.PaymentCostGroupName]) {
                            objCost[item.PaymentCostGroupName] += item.TotalAmount;
                        } else {
                            objCost[item.PaymentCostGroupName] = item.TotalAmount;
                        }
                    });
                }

                if (objGroup && Object.keys(objGroup).length > 0) {
                    this.setState({
                        configListDetailInfoEmployee: _configListDetailInfoEmployee,
                        configListDetail: _configListDetail,
                        dataItem: {
                            ...dataItem,
                            listDataCost: objGroup,
                            listDataTotalCost: objCost
                        },
                        listActions: _listActions
                    });
                } else {
                    this.setState({
                        configListDetailInfoEmployee: _configListDetailInfoEmployee,
                        configListDetail: _configListDetail,
                        dataItem: { ...dataItem }
                    });
                }
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    reload = (E_KEEP_FILTER, actionIsDelete) => {
        const { reloadScreenList } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');
        //nếu action = Delete => back về danh sách
        if (actionIsDelete) {
            DrawerServices.navigate(ScreenName.SalSubmitPaymentCostRegister);
        } else {
            this.getDataItem(true);
        }
    };

    onPessDelete = (item) => {
        SalSubmitPaymentCostRegisterBusinessFunction.businessDeleteSalPaymentCost([item]);
    };

    onEditFeeCheck = (item, MasterData, fullDataCost) => {
        SalSubmitPaymentCostRegisterBusinessFunction.businessModifyRecord(item, MasterData, fullDataCost);
    }

    rightActions = (item, fullDataCost) => {
        const { dataItem } = this.state;

        if (dataItem && dataItem.BusinessAllowAction && dataItem.BusinessAllowAction.indexOf(EnumName.E_MODIFY) > -1) {
            return (
                <View style={styles.styRightActionView}>
                    <View style={styles.viewIconDelete}>
                        <TouchableOpacity
                            onPress={() => {
                                this.onPessDelete(item);
                            }}
                            style={styles.styBtnDelete}
                        >
                            <IconDelete size={Size.text} color={Colors.white} />
                            <VnrText
                                style={[styleSheets.text, styles.styBtnDeleteText]}
                                i18nKey={'HRM_Common_Delete'}
                            />
                        </TouchableOpacity>
                    </View>

                    {
                        (PermissionForAppMobile.value['New_Sal_ConfirmPaymentCost_New_Index_btnEdit_In_FeeCheck']
                            && PermissionForAppMobile.value['New_Sal_ConfirmPaymentCost_New_Index_btnEdit_In_FeeCheck']['View'])
                        && (
                            <View style={[styles.viewIconDelete, { backgroundColor: Colors.warning }]}>
                                <TouchableOpacity
                                    onPress={() => {
                                        const MasterData = {
                                            ID: dataItem?.ID,
                                            ProfileID: dataItem?.ProfileID,
                                            RequestPeriod: dataItem?.RequestPeriod,
                                            PaymentPeriod: dataItem?.PaymentPeriod,
                                            UserApproveID: dataItem?.UserApproveID,
                                            UserApproveID2: dataItem?.UserApproveID2,
                                            UserApproveID3: dataItem?.UserApproveID3,
                                            UserApproveID4: dataItem?.UserApproveID4,
                                            IsPortal: true,
                                            UserSubmit: dataItem?.UserSubmitID,
                                            UserSubmitID: dataItem?.UserSubmitID,
                                            Status: dataItem?.Status
                                        };

                                        this.onEditFeeCheck(item, MasterData, fullDataCost);
                                    }}
                                    style={styles.styBtnDelete}
                                >
                                    <IconEdit size={Size.iconSize} color={Colors.white} />
                                    <VnrText
                                        style={[styleSheets.text, styles.styBtnDeleteText]}
                                        i18nKey={'HRM_System_Resource_Sys_Edit'}
                                    />
                                </TouchableOpacity>
                            </View>
                        )
                    }
                </View>
            );
        } else {
            return <View />;
        }
    };

    componentDidMount() {
        SalSubmitPaymentCostRegisterBusinessFunction.setThisForBusiness(this, true);
        this.getDataItem();
    }

    initLableValue = (item, fullDataCost) => {
        const { styViewValue, viewLable, styTextValueInfo } = stylesScreenDetailV2;
        let styTextValue = { ...styleSheets.text, ...styTextValueInfo },
            styTextLable = { ...styleSheets.lable, ...{ textAlign: 'left' } };

        let dateStart = item.FromDate ? item.FromDate : null,
            dateEnd = item.ToDate ? item.ToDate : null,
            timeCouse = '';

        let dmyStart = moment(dateStart).format('DD/MM/YYYY'),
            dmyEnd = moment(dateEnd).format('DD/MM/YYYY'),
            myStart = moment(dateStart).format('MM/YYYY'),
            myEnd = moment(dateEnd).format('MM/YYYY'),
            yStart = moment(dateStart).format('YYYY'),
            yEnd = moment(dateEnd).format('YYYY'),
            dStart = moment(dateStart).format('DD'),
            dEnd = moment(dateEnd).format('DD'),
            dmStart = moment(dateStart).format('DD/MM');
        if (dmyStart === dmyEnd) {
            timeCouse = dmyStart;
        } else if (myStart === myEnd) {
            timeCouse = `${dStart} - ${dEnd}/${myStart}`;
        } else if (yStart === yEnd) {
            timeCouse = `${dmStart} - ${dmyEnd}`;
        } else {
            timeCouse = `${dmyStart} - ${dmyEnd}`;
        }

        return (
            <Swipeable overshootRight={false} renderRightActions={() => this.rightActions(item, fullDataCost)} friction={0.6}>
                <View style={styles.styContentData}>
                    <View style={styles.styItemData}>
                        <View style={viewLable}>
                            <VnrText
                                style={styTextLable}
                                value={item.PaymentAmountName ? item.PaymentAmountName : ''}
                            />
                        </View>
                        <View style={styViewValue}>
                            <VnrText
                                style={styTextLable}
                                value={`${(item.TotalAmount != null && item.TotalAmount != '') || item.TotalAmount == 0
                                    ? Vnr_Function.formatNumber(item.TotalAmount)
                                    : ''
                                    } `}
                            />
                        </View>
                    </View>

                    <View style={styles.styItemData}>
                        <View style={[viewLable, CustomStyleSheet.minWidth(160)]}>
                            {timeCouse && (
                                <VnrText
                                    style={[styTextValue, styles.styTextValueCus, styles.styTextTimeCoure]}
                                    i18nKey={timeCouse}
                                />
                            )}
                        </View>
                        <View style={[styViewValue, CustomStyleSheet.minWidth(130)]}>
                            <VnrText
                                style={[styTextValue, styles.styTextValueCus]}
                                value={`${translate('QuantityCalculate')}: ${item.Quantity ? item.Quantity : ''} ${item.UnitView ? item.UnitView : ''
                                    }`}
                            />
                        </View>
                    </View>

                    <View style={styles.styItemData}>
                        <View style={viewLable} />
                        <View style={styViewValue}>
                            <VnrText
                                style={[styTextValue, styles.styTextValueCus]}
                                value={`${translate('HRM_Category_PaymentAmount_Specification')}: ${item.Specification ? item.Specification : ''
                                    }`}
                            />
                        </View>
                    </View>
                </View>
            </Swipeable>
        );
    };

    render() {
        const { dataItem, configListDetail, listActions, configListDetailInfoEmployee } = this.state,
            { styTextGroup, containerItemDetail } = stylesScreenDetailV2;


        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && dataItem.listDataCost && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.containerGrey}>
                    <ScrollView style={styles.styScrollDeteil}>
                        {
                            (configListDetailInfoEmployee
                                && this.props.navigation.state.params?.screenName !== ScreenName.SalSubmitPaymentCostRegister)
                            && (
                                <View style={containerItemDetail}>
                                    {configListDetailInfoEmployee.map((e) => {
                                        return Vnr_Function.formatStringTypeV2(dataItem, e);
                                    })}
                                </View>
                            )
                        }
                        {Object.keys(dataItem.listDataCost).map((key, index) => (
                            <View key={index} style={styles.styBlock}>
                                <View style={styles.styTopTitle}>
                                    <View style={styles.styWrap}>
                                        <VnrText
                                            style={[styleSheets.text, styTextGroup]}
                                            value={key}
                                            numberOfLines={1}
                                        />
                                    </View>

                                    <TouchableOpacity
                                        style={styles.styWrapRight}
                                        onPress={() =>
                                            DrawerServices.navigate('SalSubmitPaymentCostRegisterMoreViewDetail', {
                                                dataItem: dataItem,
                                                keyType: key
                                            })
                                        }
                                    >
                                        <VnrText
                                            style={[styleSheets.text, styles.styTextDetail]}
                                            i18nKey={'HRM_Common_ViewMore'}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.styViewData}>
                                    {dataItem.listDataCost[key] &&
                                        dataItem.listDataCost[key].map((e) => this.initLableValue(e, dataItem.listDataCost[key]))}
                                </View>

                                {dataItem.listDataTotalCost[key] && (
                                    <View style={styles.styViewDataTotal}>
                                        <View style={styles.styWrapRight}>
                                            {/* <VnrText
                                                        style={[styleSheets.lable, styTextGroup]}
                                                        value={`${translate('SumAmount')} : ${((dataItem.TotalAmount != null && dataItem.TotalAmount != '') || dataItem.TotalAmount == 0)
                                                            ? Vnr_Function.formatNumber(dataItem.TotalAmount) : ''} ${dataItem.Specification ? dataItem.Specification : ''}`}
                                                    /> */}
                                            <VnrText
                                                style={[styleSheets.lable, styTextGroup]}
                                                value={`${translate('SumAmount')} : ${Vnr_Function.formatNumber(
                                                    dataItem.listDataTotalCost[key]
                                                )} ${dataItem.Specification ? dataItem.Specification : ''}`}
                                            />
                                        </View>
                                    </View>
                                )}
                            </View>
                        ))}

                        <View style={styles.styViewBottomCost}>
                            <VnrText style={[styleSheets.text, styTextGroup]} value={`${translate('SumAmount')} `} />

                            <VnrText
                                style={[styleSheets.lable, styTextGroup, styles.styTextGroupTotal]}
                                value={`${(dataItem.TotalAmount != null && dataItem.TotalAmount != '') ||
                                    dataItem.TotalAmount == 0
                                    ? Vnr_Function.formatNumber(dataItem.TotalAmount)
                                    : ''
                                    } ${dataItem.Specification ? dataItem.Specification : ''}`}
                            />
                        </View>

                        <View style={containerItemDetail}>
                            {configListDetail.map((e) => {
                                return Vnr_Function.formatStringTypeV2(dataItem, e);
                            })}
                        </View>
                    </ScrollView>

                    {Array.isArray(listActions) && listActions.length > 0 && (
                        <View style={[styles.bottomActions, {}]}>
                            <ListButtonMenuRight listActions={listActions} dataItem={dataItem} />
                        </View>
                    )}
                </View>
            );
        } else if (dataItem && dataItem != 'EmptyData' && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.containerGrey}>
                    <ScrollView style={styles.styScrollDeteil}>
                        <View style={styles.styViewBottomCost}>
                            <VnrText
                                style={[styleSheets.text, styles.styLableTextBottom]}
                                value={`${translate('SumAmount')} `}
                            />

                            <VnrText
                                style={[styleSheets.lable, styTextGroup]}
                                value={`${(dataItem.TotalAmount != null && dataItem.TotalAmount != '') ||
                                    dataItem.TotalAmount == 0
                                    ? Vnr_Function.formatNumber(dataItem.TotalAmount)
                                    : ''
                                    } ${dataItem.Specification ? dataItem.Specification : ''}`}
                            />
                        </View>

                        <View style={containerItemDetail}>
                            {configListDetail.map((e) => {
                                return Vnr_Function.formatStringTypeV2(dataItem, e);
                            })}
                        </View>
                    </ScrollView>

                    {Array.isArray(listActions) && listActions.length > 0 && (
                        <View style={[styles.bottomActions, {}]}>
                            <ListButtonMenuRight listActions={listActions} dataItem={dataItem} />
                        </View>
                    )}
                </View>
            );
        } else if (dataItem == 'EmptyData') {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>
                    {contentViewDetail}

                    {dataItem && dataItem.Status == EnumStatus.E_SUBMIT_TEMP && (
                        <TouchableOpacity
                            style={styles.styBtnAddCost}
                            onPress={() =>
                                this.props.navigation.navigate('SalSubmitPaymentCostRegisterAddPay', {
                                    MasterData: dataItem,
                                    reload: () => this.reload('E_KEEP_FILTER'),
                                    goBackScreen: 'SalSubmitPaymentCostRegisterViewDetail'
                                })
                            }
                        >
                            <IconPlus size={Size.iconSizeHeader + 10} color={Colors.white} />
                        </TouchableOpacity>
                    )}
                </View>
            </SafeAreaView>
        );
    }
}

const sizeBtnAdd = Size.iconSizeHeader + 30;
const styles = StyleSheet.create({
    styTextTimeCoure: { textAlign: 'left' },
    styScrollDeteil: { flexGrow: 1, paddingTop: Size.defineHalfSpace },
    styRightActionView: { maxWidth: 300, flexDirection: 'row', alignItems: 'center' },
    styTextGroupTotal: {
        color: Colors.primary,
        fontSize: Size.text + 3
    },
    styBtnAddCost: {
        position: 'absolute',
        height: sizeBtnAdd,
        width: sizeBtnAdd,
        borderRadius: sizeBtnAdd / 2,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: Size.deviceWidth * 0.25,
        backgroundColor: Colors.neutralGreen,
        right: Size.defineSpace
    },
    styViewBottomCost: {
        flexDirection: 'row',
        backgroundColor: Colors.white,
        width: Size.deviceWidth,
        marginTop: Size.defineHalfSpace,
        marginBottom: Size.defineSpace,
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: Size.defineSpace,
        paddingHorizontal: Size.defineSpace
    },
    bottomActions: {
        flexGrow: 1,
        paddingVertical: Size.defineSpace,
        backgroundColor: Colors.white,
        minHeight: 40 + Size.defineSpace * 2,
        maxHeight: 45 + Size.defineSpace * 2
    },
    styLableTextBottom: {
        color: Colors.gray_8,
        fontSize: Size.text - 1
    },
    styBlock: {
        width: Size.deviceWidth,
        backgroundColor: Colors.white,
        paddingTop: Size.defineSpace,
        paddingBottom: Size.defineHalfSpace,
        marginBottom: Size.defineHalfSpace
    },
    styTopTitle: {
        paddingHorizontal: Size.defineSpace,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '100%'
    },
    styWrap: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginRight: Size.defineSpace,
        alignItems: 'center'
    },
    styWrapRight: {
        alignItems: 'flex-end'
    },
    styTextDetail: {
        fontWeight: '500',
        color: Colors.primary
    },
    styViewData: {
        marginTop: Size.defineHalfSpace
    },
    styViewDataTotal: {
        marginRight: Size.defineSpace,
        marginTop: Size.defineSpace
    },
    styContentData: {
        width: Size.deviceWidth - Size.defineSpace * 2,
        marginHorizontal: Size.defineSpace,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        paddingBottom: Size.defineHalfSpace,
        backgroundColor: Colors.white,
        paddingRight: 2
    },
    styItemData: {
        width: '100%',
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginTop: Size.defineHalfSpace - 2
    },
    viewIconDelete: {
        backgroundColor: Colors.danger,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        borderRadius: 8,
        paddingHorizontal: Size.defineSpace,
        marginVertical: 10,
        marginRight: Size.defineSpace,
        height: 40
    },
    styBtnDelete: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row'
    },
    styBtnDeleteText: {
        color: Colors.white,
        fontWeight: '500',
        marginLeft: 3
    },
    styTextValueCus: {
        fontSize: Size.text - 1
    }
});
