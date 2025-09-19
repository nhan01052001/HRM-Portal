import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { ScreenName } from '../../../../../assets/constant';
import moment from 'moment';
import { translate } from '../../../../../i18n/translate';
import DrawerServices from '../../../../../utils/DrawerServices';
import TouchIDService from '../../../../../utils/TouchIDService';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { connect } from 'react-redux';
import RootState from '../../../../../redux/RootState';

const configDefault = {
    KINHDOANH_CH_AP: [
        {
            TypeView: 'E_COMMON',
            Name: 'KD_CH_AP_LUONG_THUC_NHAN',
            DisplayKey: 'quang1',
            DataType: 'string',
            IsNullOrEmpty: true
        }
    ],
    KINHDOANH_CH_FLD: [
        {
            TypeView: 'E_COMMON',
            Name: 'KD_CH_FLD_LUONG_THUC_NHAN',
            DisplayKey: 'quang1',
            DataType: 'string',
            IsNullOrEmpty: true
        }
    ],
    SANPHAM_PX_AP: [
        {
            TypeView: 'E_COMMON',
            Name: 'SP_PX_AP_LUONG_THUC_NHAN',
            DisplayKey: 'quang1',
            DataType: 'string',
            IsNullOrEmpty: true
        }
    ],
    THOIGIAN_BD_AP: [
        {
            TypeView: 'E_COMMON',
            Name: 'TG_BD_AP_LUONG_THUC_NHAN',
            DisplayKey: 'quang1',
            DataType: 'string',
            IsNullOrEmpty: true
        }
    ],
    THOIGIAN_PX4_AP: [
        {
            TypeView: 'E_COMMON',
            Name: 'TG_PX4_AP_LUONG_THUC_NHAN',
            DisplayKey: 'quang1',
            DataType: 'string',
            IsNullOrEmpty: true
        }
    ],
    THOIGIAN_PX6_AP: [
        {
            TypeView: 'E_COMMON',
            Name: 'TG_PX6_AP_LUONG_THUC_NHAN',
            DisplayKey: 'quang1',
            DataType: 'string',
            IsNullOrEmpty: true
        }
    ],
    THOIGIAN_TB1_AP: [
        {
            TypeView: 'E_COMMON',
            Name: 'TG_TB1_AP_LUONG_THUC_NHAN',
            DisplayKey: 'quang1',
            DataType: 'string',
            IsNullOrEmpty: true
        }
    ],
    THOIGIAN_TB2_AP: [
        {
            TypeView: 'E_COMMON',
            Name: 'TG_TB2_AP_LUONG_THUC_NHAN',
            DisplayKey: 'quang1',
            DataType: 'string',
            IsNullOrEmpty: true
        }
    ],
    THOIGIAN_VP_AP: [
        {
            TypeView: 'E_COMMON',
            Name: 'TG_VP_AP_LUONG_THUC_NHAN',
            DisplayKey: 'quang1',
            DataType: 'string',
            IsNullOrEmpty: true
        }
    ],
    THOIGIAN_VP_FLD: [
        {
            TypeView: 'E_COMMON',
            Name: 'TG_VP_FLD_LUONG_THUC_NHAN',
            DisplayKey: 'quang1',
            DataType: 'string',
            IsNullOrEmpty: true
        }
    ],
    THOIGIAN_VP_TOS: [
        {
            TypeView: 'E_COMMON',
            Name: 'TG_VP_TOS_LUONG_THUC_NHAN',
            DisplayKey: 'quang11111',
            DataType: 'string',
            IsNullOrEmpty: true
        }
    ]
};

class SalaryViewDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataItem: null,
            configListDetail: null,
            isLoading: false,
            cutOffDurationID: null
        };

        let screenName =
            props.navigation.state.params && props.navigation.state.params.screenName
                ? props.navigation.state.params.screenName
                : null;

        this.monthPayroll =
            props.navigation.state.params &&
            props.navigation.state.params.dataItem &&
            props.navigation.state.params.dataItem.MonthYear
                ? moment(props.navigation.state.params.dataItem.MonthYear).format('MM/YYYY')
                : null;

        if (screenName === ScreenName.SalaryPayrollViewDetail) {
            this.monthPayroll !== null &&
                props.navigation.setParams({
                    title: `${translate('HRM_Payroll_Sal_MonthYear_Detail_Info')} ${this.monthPayroll}`
                });
        } else if (screenName === ScreenName.SalaryTempViewDetail) {
            this.monthPayroll !== null &&
                props.navigation.setParams({
                    title: `${translate('HRM_Payroll_Sal_MonthYear_DetailTemp_Info')} ${this.monthPayroll}`
                });
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { dataItem } = this.state;
        const currentScreen = DrawerServices.getCurrentScreen();
        if (
            nextProps.cancelPublishPayslip != null &&
            dataItem != null &&
            dataItem != 'EmptyData' &&
            nextProps.cancelPublishPayslip.cutOffDurationID == dataItem.CutOffDurationID &&
            currentScreen == ScreenName.SalaryViewDetail
        ) {
            this.confirmCancelPublishPayslip(nextProps.cancelPublishPayslip);
        }
    }

    confirmCancelPublishPayslip = data => {
        const { cutOffDurationName } = data,
            { reloadScreenList } = this.props.navigation.state.params,
            { setCancelPaySlip } = this.props;

        let mess = translate('HRM_PortalApp_CancelPublishPayslip_Confirm');
        if (cutOffDurationName) mess = mess.replace('E_CUTOFF_NAME', cutOffDurationName);

        ToasterSevice.showWarning(mess, 5000);

        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList();
        typeof setCancelPaySlip == 'function' && setCancelPaySlip(null);
        DrawerServices.navigate('Salary');
    };

    checkBeforScreen = () => {
        let getBeforeScreen = DrawerServices.getBeforeScreen();
        if (getBeforeScreen !== ScreenName.Salary) {
            TouchIDService.checkConfirmPass(this.onFinish.bind(this));
        } else {
            this.getDataItem();
        }
    };

    onFinish = isSuccess => {
        if (isSuccess) this.getDataItem();
        else DrawerServices.goBack();
    };

    getDataItem = async () => {
        this.setState({ isLoading: true });
        try {
            const _params = this.props.navigation.state.params,
                { screenName, elementCode, CutOffDurationID, dataItem, tokenEncodedParam } =
                    typeof _params == 'object' ? _params : JSON.parse(_params);

            let listCode = {};
            let _configListDetail =
                ConfigListDetail.value[screenName] != null ? ConfigListDetail.value[screenName] : configDefault;
            // trường hợp chạy phần tử lương khác nhau cho mỗi user
            if (
                _configListDetail &&
                Object.prototype.toString.call(_configListDetail) == '[object Object]' &&
                Object.keys(_configListDetail).length > 0
            ) {
                if (
                    elementCode &&
                    typeof elementCode == 'string' &&
                    _configListDetail[elementCode] &&
                    Array.isArray(_configListDetail[elementCode])
                ) {
                    _configListDetail = _configListDetail[elementCode];
                } else {
                    _configListDetail = [];
                }
            }

            // Lấy phần tử lương
            _configListDetail.map(col => {
                if (col.Name != null) listCode[col.Name] = true;
            });

            if ((dataItem && dataItem.CutOffDurationID) || CutOffDurationID || tokenEncodedParam) {
                let _CutOffDurationID = CutOffDurationID
                    ? CutOffDurationID
                    : dataItem.CutOffDurationID
                        ? dataItem.CutOffDurationID
                        : null;

                if (screenName === ScreenName.SalaryPayrollViewDetail || screenName === ScreenName.SalaryViewDetail) {
                    HttpService.Post('[URI_HR]/Sal_GetData/New_GetPayrollTableItemByIdProfilePortal', {
                        CutOffDurationID: _CutOffDurationID,
                        ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                        strEnums: Object.keys(listCode).join(','),
                        tokenEncodedParam: tokenEncodedParam
                    }).then(res => {
                        if (res && res.Data) {
                            let dataSource = res.Data,
                                data = {};

                            if (CutOffDurationID && dataSource[0] && dataSource[0]['MonthYear']) {
                                let monthPayroll = moment(dataSource[0]['MonthYear']).format('MM/YYYY');

                                this.props.navigation.setParams({
                                    title: `${translate('HRM_Payroll_Sal_MonthYear_Detail_Info')} ${monthPayroll}`
                                });
                            }

                            _configListDetail.map(col => {
                                if (col.Name) {
                                    let findValue = dataSource.find(e => e.Code === col.Name);
                                    if (findValue) {
                                        data[col.Name] = findValue['Value'];
                                    }
                                }
                            });

                            this.setState({
                                configListDetail: _configListDetail,
                                dataItem: {
                                    ...data,
                                    CutOffDurationID: dataItem.CutOffDurationID
                                }
                            });
                        } else {
                            this.setState({ dataItem: 'EmptyData' });
                        }
                    });
                } else if (screenName === ScreenName.SalaryTempViewDetail) {
                    // let listCode = {};
                    // _configListDetail.map(col => {
                    //     if (col.Name != null)
                    //         listCode[col.Name] = true;
                    // });

                    HttpService.Post('[URI_HR]/Sal_GetData/New_GetUnusualPayByIdProfilePortal', {
                        CutOffDurationID: _CutOffDurationID,
                        ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                        strEnums: Object.keys(listCode).join(',')
                    }).then(res => {
                        if (res && res.data) {
                            let dataSource = res.data,
                                data = {};

                            // if (CutOffDurationID && dataSource[0] && dataSource[0]['MonthYear']) {
                            //     let monthPayroll = moment(dataSource[0]['MonthYear']).format('MM/YYYY')

                            this.props.navigation.setParams({
                                title: `${translate('HRM_Payroll_Sal_MonthYear_DetailTemp_Info')}`
                            });
                            //}
                            _configListDetail.map(col => {
                                if (col.Name) {
                                    let findValue = dataSource.find(e => e.Code === col.Name);
                                    if (findValue) {
                                        data[col.Name] = findValue['Amount'];
                                    }
                                }
                            });

                            this.setState({
                                configListDetail: _configListDetail,
                                dataItem: data
                            });
                        } else {
                            this.setState({ dataItem: 'EmptyData' });
                        }
                    });
                }
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    componentDidMount() {
        this.checkBeforScreen();
    }

    render() {
        const { dataItem, configListDetail } = this.state,
            { containerItemDetail } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={CustomStyleSheet.flexGrow(1)}>
                        <View style={containerItemDetail}>
                            {configListDetail.map(e => {
                                return Vnr_Function.formatStringTypeV2(dataItem, e);
                            })}
                        </View>
                    </ScrollView>
                </View>
            );
        } else if (dataItem == 'EmptyData') {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaView>
        );
    }
}

const mapStateToProps = state => {
    return {
        cancelPublishPayslip: state.RootState.cancelPublishPayslip
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setCancelPaySlip: data => {
            dispatch(RootState.actions.setCancelPaySlip(data));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(SalaryViewDetail);
