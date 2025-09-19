import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView, CustomStyleSheet } from '../../../../constants/styleConfig';
// import { ConfigListDetail } from '../../../../assets/configProject/ConfigListDetail';
import { ScreenName } from '../../../../assets/constant';
import { ConfigListDetail } from '../../../../assets/configProject/ConfigListDetail';

import Vnr_Function from '../../../../utils/Vnr_Function';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../components/EmptyData/EmptyData';

import { dataVnrStorage } from '../../../../assets/auth/authentication';

import HttpService from '../../../../utils/HttpService';

import DrawerServices from '../../../../utils/DrawerServices';
import TouchIDService from '../../../../utils/TouchIDService';

const configDefault = [
    // {
    //     "TypeView": "E_GROUP",
    //     "DisplayKey": "HRM_HR_Profile_Info",
    //     "DataType": "string"
    // },
    // {
    //     "TypeView": "E_COMMON",
    //     "Name": "CodeEmp",
    //     "DisplayKey": "HRM_HR_Profile_CodeEmp",
    //     "DataType": "string"
    // },
    // {
    //     "TypeView": "E_COMMON",
    //     "Name": "ProfileName",
    //     "DisplayKey": "HRM_HR_Profile_ProfileName",
    //     "DataType": "string"
    // },
    // {
    //     "TypeView": "E_COMMON",
    //     "Name": "OrgStructureName",
    //     "DisplayKey": "HRM_Eva_Performance_OrgStructureName",
    //     "DataType": "string"
    // },
    // {
    //     "TypeView": "E_COMMON",
    //     "Name": "PositionName",
    //     "DisplayKey": "HRM_HR_Profile_PositionName",
    //     "DataType": "string"
    // },
    // {
    //     "TypeView": "E_GROUP",
    //     "DisplayKey": "HRM_Detail_Process_Info_Common",
    //     "DataType": "string"
    // },
    // {
    //     "TypeView": "E_COMMON",
    //     "Name": "LCB",
    //     "DisplayKey": "HRM_Payroll_BasicSalary_BasicSalary",
    //     "DataType": "string"
    // },

    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_HR_GeneralInformation',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'E_BonusTypename',
        DisplayKey: 'HRM_Category_ElementBonus_BonusTypeName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'E_PaymentDate',
        DisplayKey: 'HRM_Sal_ComputePayroll_PaymentDayFrom',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'E_IsCash',
        DisplayKey: 'PaymentMethod',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'E_BankCode',
        DisplayKey: 'HRM_Category_Bank',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'E_Currency',
        DisplayKey: 'HRM_Sal_PerformanceAllowance_CurrencyName',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Category_Pur_MCAM_PayMentMethod_Info',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'LCBT',
        DisplayKey: 'Lương cơ bản tháng',
        DataType: 'string'
    }

    // {
    //     "TypeView": "E_COMMON",
    //     "Name": "LBQ",
    //     "DisplayKey": "LateEarlyTypeView",
    //     "DataType": "string"
    // },
    // {
    //     "TypeView": "E_COMMON",
    //     "Name": "TienThuongT13",
    //     "DisplayKey": "HRM_Attendance_LateEarlyAllowed_LateMinutes",
    //     "DataType": "string"
    // },
    // {
    //     "TypeView": "E_COMMON",
    //     "Name": "PCPHEPNAM",
    //     "DisplayKey": "HRM_Attendance_LateEarlyAllowed_EarlyMinutes",
    //     "DataType": "string"
    // },
    // {
    //     "TypeView": "E_FILEATTACH",
    //     "Name": "TTPHEPNAM",
    //     "DisplayKey": "HRM_Attendance_LateEarlyAllowed_Attachment",
    //     "DataType": "string"
    // },
    // {
    //     "TypeView": "E_FILEATTACH",
    //     "Name": "PCSTHUE",
    //     "DisplayKey": "HRM_Attendance_LateEarlyAllowed_Attachment",
    //     "DataType": "string"
    // },
    // {
    //     "TypeView": "E_FILEATTACH",
    //     "Name": "ThucNhan",
    //     "IsBold" : true,
    //     "DisplayKey": "HRM_Attendance_LateEarlyAllowed_Attachment",
    //     "DataType": "string"
    // }
];

export default class SalRewardPayslipViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoading: false,
            dataItem: null,
            configListDetail: null
            // dataRowActionAndSelected: generateRowActionAndSelected(),
            // listActions: this.resultListActionHeader(),
        };

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            setTimeout(() => {
                if (
                    DrawerServices.getBeforeScreen() !== ScreenName.SalRewardPayslip &&
                    DrawerServices.getBeforeScreen() !== ScreenName.SalRewardPayslipViewDetail
                ) {
                    TouchIDService.checkConfirmPass(this.onFinish.bind(this));
                } else {
                    this.getDataItem();
                }
            }, 200);
        });
    }

    onFinish = (isSuccess) => {
        if (isSuccess) this.getDataItem();
        else DrawerServices.goBack();
    };

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    resultListActionHeader = () => {
        const _params = this.props.navigation.state.params;
        if (_params && _params.listActions && Array.isArray(_params.listActions)) {
            return _params.listActions;
        }
        return [];
    };

    // rowActionsHeaderRight = (dataItem) => {
    //     let _listActions = [];
    //     const { rowActions } = this.state.dataRowActionAndSelected;

    //     if (
    //         !Vnr_Function.CheckIsNullOrEmpty(rowActions) &&
    //         !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction)
    //     ) {
    //         _listActions = rowActions.filter((item) => {
    //             return dataItem.BusinessAllowAction.indexOf(item.type) >= 0;
    //         });
    //     }
    //     return _listActions;
    // };

    getDataItem = async (isReload = false) => {
        this.setState({ isLoading: true });
        try {
            const _params = this.props.navigation.state.params;
            const { screenName, dataId, dataItem } = typeof _params === 'object' ? _params : JSON.parse(_params);
            const _configListDetail = ConfigListDetail.value[screenName]
                ? ConfigListDetail.value[screenName]
                : configDefault;

            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload || dataItem.ID) {
                let _ID = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID;
                const dataBody = {
                    profileID: dataVnrStorage.currentUser.info.ProfileID,
                    RewardPeriodID: _ID,
                    UserLogin: dataVnrStorage.currentUser.headers.userlogin
                };

                HttpService.Post('[URI_HR]/Sal_GetData/GetRewardPayslipFormPayslipByProfile_ForApp', dataBody).then(
                    (response) => {
                        if (!Vnr_Function.CheckIsNullOrEmpty(response)) {
                            this.setState({
                                configListDetail: _configListDetail,
                                dataItem: response
                            });
                        } else {
                            this.setState({ dataItem: 'EmptyData' });
                        }
                    }
                );
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                this.setState({ configListDetail: _configListDetail, dataItem });
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
            DrawerServices.navigate('SalRewardPayslip');
        } else {
            this.getDataItem(true);
        }
    };

    componentDidMount() {
        //this.checkBeforScreen();
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
                            {configListDetail.map((e) => {
                                return Vnr_Function.formatStringTypeV2(dataItem, e);
                            })}
                        </View>
                    </ScrollView>
                    {/* {Array.isArray(listActions) && listActions.length > 0 && (
                        <View style={bottomActions}>
                            <ListButtonMenuRight listActions={listActions} dataItem={dataItem} />
                        </View>
                    )} */}
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
