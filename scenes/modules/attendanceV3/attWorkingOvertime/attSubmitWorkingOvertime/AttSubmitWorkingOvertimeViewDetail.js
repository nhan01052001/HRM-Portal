import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView, Colors } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import {
    generateRowActionAndSelected,
    AttSubmitWorkingOvertimeBusinessFunction
} from './AttSubmitWorkingOvertimeBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { EnumName } from '../../../../../assets/constant';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import AttSubmitWorkingOvertimeAddOrEdit from './AttSubmitWorkingOvertimeAddOrEdit';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';

const configDefault = [
    {
        'TypeView': 'E_STATUS',
        'Name': 'StatusView',
        'DisplayKey': 'HRM_Attendance_Overtime_OvertimeList_Status',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_GROUP_PROFILE',
        'DisplayKey': 'HRM_PortalApp_Subscribers',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON_PROFILE',
        'Name': 'E_COMPANY',
        'DisplayKey': 'E_COMPANY',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON_PROFILE',
        'Name': 'E_BRANCH',
        'DisplayKey': 'E_BRANCH',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON_PROFILE',
        'Name': 'E_UNIT',
        'DisplayKey': 'HRM_Hre_SignatureRegister_E_UNIT',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON_PROFILE',
        'Name': 'E_DIVISION',
        'DisplayKey': 'HRM_Hre_SignatureRegister_E_DIVISION',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON_PROFILE',
        'Name': 'E_DEPARTMENT',
        'DisplayKey': 'HRM_HR_Profile_OrgStructureName',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON_PROFILE',
        'Name': 'E_TEAM',
        'DisplayKey': 'Group',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON_PROFILE',
        'Name': 'E_SECTION',
        'DisplayKey': 'E_SECTION',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON_PROFILE',
        'Name': 'JobTitleName',
        'DisplayKey': 'HRM_HR_Profile_JobTitleName',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON_PROFILE',
        'Name': 'PositionName',
        'DisplayKey': 'HRM_HR_Profile_PositionName',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_GROUP',
        'DisplayKey': 'HRM_PortalApp_OvertimePlanInformation',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'MethodPaymentView',
        'DisplayKey': 'MethodPaymentView',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'WorkDate',
        'DisplayKey': 'HRM_PortalApp_DayRegister',
        'DataType': 'DateToFrom',
        'DataFormat': 'DD/MM/YYYY'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'DurationTypeView',
        'DisplayKey': 'HRM_PortalApp_TypeRegister',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'OvertimeTypeName',
        'DisplayKey': 'HRM_PortalApp_TypeOverTime',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'OrgStructureTransName',
        'DisplayKey': 'HRM_PortalApp_TransferDepartment',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'StrConfirmHours',
        'DisplayKey': 'HRM_PortalApp_Overtime_ConfirmHours',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'StrRegisterHours',
        'DisplayKey': 'HRM_PortalApp_HourRegister',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'TimeFrom',
        'NameSecond': 'TimeTo',
        'DisplayKey': 'HRM_PortalApp_TimeOvertime',
        'DataType': 'DateToFrom',
        'DataFormat': 'HH:mm'
    },
    {
        'TypeView': 'E_FILEATTACH',
        'Name': 'FileAttachment',
        'DisplayKey': 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
        'DataType': 'FileAttach'
    },
    {
        'TypeView': 'E_GROUP',
        'DisplayKey': 'HRM_PortalApp_AnotherInformation',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'IsUnitAssistant',
        'DisplayKey': 'HRM_PortalApp_Change_TLĐV',
        'DataType': 'bool'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'IsSignUpToEat',
        'DisplayKey': 'HRM_PortalApp_RegisterEat',
        'DataType': 'bool'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'IsRequestForBenefit',
        'DisplayKey': 'E_ARCHIVESPAYMENTREQUEST',
        'DataType': 'bool'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'IsRequestEntryExitGate',
        'DisplayKey': 'HRM_PortalApp_Request_InOut',
        'DataType': 'bool'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'BusinessUnitTypeView',
        'DisplayKey': 'HRM_Portal_Att_TimesheetEvaluation_BusinessUnitTypeName',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'BusinessUnitView',
        'DisplayKey': 'HRM_Payroll_Sal_SeveranceAllowance_ShopID',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'SendToView',
        'DisplayKey': 'HRM_Category_HeadcountOrg_MailToHeadcount_code',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_COMMON',
        'Name': 'OvertimeArea',
        'DisplayKey': 'HRM_OTWorkingArea',
        'DataType': 'string'
    },
    {
        'TypeView': 'E_GROUP_APPROVE',
        'DisplayKey': 'HRM_HRE_Concurrent_ApproveHistory',
        'DataType': 'string'
    }
];

export default class AttSubmitWorkingOvertimeViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: generateRowActionAndSelected(this.props.navigation.state.params?.screenName),
            listActions: this.resultListActionHeader()
        };

        this.AttSubmitWorkingOvertimeAddOrEdit = null;
    }

    onEdit = (item) => {
        if (item) {
            if (this.AttSubmitWorkingOvertimeAddOrEdit && this.AttSubmitWorkingOvertimeAddOrEdit.onShow) {
                this.AttSubmitWorkingOvertimeAddOrEdit.onShow({
                    reload: this.reload,
                    record: item
                });
            }
        }
    };

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
            !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction)
        ) {
            _listActions = rowActions.filter((item) => {
                return dataItem.BusinessAllowAction.indexOf(item.type) >= 0;
            });
        }
        return _listActions;
    };

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[screenName]
                    ? ConfigListDetail.value[screenName]
                    : configDefault;

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID;
            if (id) {
                const response = await HttpService.Get(
                    `[URI_CENTER]/api/Att_OvertimePlan/GetOvertimePlanByID?ID=${id}`
                );

                const getDetailConfig = await Vnr_Function.HandleConfigListDetailATT(
                    _configListDetail,
                    'Detail_List_Overtime'
                );

                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = { ...response.Data, ...response.Data.SingleWordDetail[0] };
                    data.BusinessAllowAction = Vnr_Services.handleStatus(
                        data.Status,
                        dataItem?.SendEmailStatus ? dataItem?.SendEmailStatus : false,
                        dataItem?.TypeApprove
                    );
                    data.itemStatus = Vnr_Services.formatStyleStatusApp(data.Status);
                    data.FileAttachment = ManageFileSevice.setFileAttachApp(data.FileAttachment);
                    data.ImagePath = data?.AvatarUserRegister
                        ? data.AvatarUserRegister
                        : dataItem?.ProfileInfo?.ImagePath;
                    data.AccumulateHour = dataItem?.AccumulateHour
                        ? [
                            {
                                value: dataItem?.AccumulateHour?.UdHourByDate,
                                color:
                                    dataItem?.AccumulateHour?.UdLimitColorDate || dataItem?.UdLimitColorDay
                                        ? Colors.red
                                        : null
                            },
                            {
                                value: dataItem?.AccumulateHour?.UdHourByMonth,
                                color:
                                    dataItem?.AccumulateHour?.UdLimitColorMonth || dataItem?.UdLimitColorMonth
                                        ? Colors.red
                                        : null
                            },
                            {
                                value: dataItem?.AccumulateHour?.UdHourByYear,
                                color:
                                    dataItem?.AccumulateHour?.UdLimitColorYear || dataItem?.UdLimitColorYear
                                        ? Colors.red
                                        : null
                            }
                        ]
                        : null;

                    //0181592: [TB_W30][LTG] APP. Thêm điều kiện lọc để nhận biết Tự sinh tăng ca và tự đăng ký ở màn hình Tăng ca
                    data.ShiftOverTimeplanView = (Array.isArray(data?.OtherInformation)
                        && data?.OtherInformation.length > 0
                        && data?.OtherInformation[0]?.ShiftOverTimeplanView) ? data?.OtherInformation[0]?.ShiftOverTimeplanView : null;

                    // handle synchronized field for app
                    // if (!data?.UserProcessApproveID && data?.UserProcessID) {
                    //     data.UserProcessApproveID = data?.UserProcessID;
                    // }

                    // if (!data?.UserProcessApproveID2 && data?.UserProcessID2) {
                    //     data.UserProcessApproveID2 = data?.UserProcessID2;
                    // }

                    // if (!data?.UserProcessApproveID3 && data?.UserProcessID3) {
                    //     data.UserProcessApproveID3 = data?.UserProcessID3;
                    // }

                    // if (!data?.UserProcessApproveID4 && data?.UserProcessID4) {
                    //     data.UserProcessApproveID4 = data?.UserProcessID4;
                    // }

                    const _listActions = await this.rowActionsHeaderRight(data);
                    this.setState({ configListDetail: getDetailConfig, dataItem: data, listActions: _listActions });
                } else {
                    this.setState({ dataItem: 'EmptyData' });
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
            DrawerServices.navigate('AttSubmitWorkingOvertime');
        } else {
            this.setState({ dataItem: null }, () => {
                this.getDataItem(true);
            });
        }
    };

    componentDidMount() {
        AttSubmitWorkingOvertimeBusinessFunction.setThisForBusiness(this);
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, listActions } = this.state,
            { containerItemDetail, contentScroll, bottomActions } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <AttSubmitWorkingOvertimeAddOrEdit
                        ref={(refs) => (this.AttSubmitWorkingOvertimeAddOrEdit = refs)}
                    />
                    <ScrollView style={contentScroll} showsVerticalScrollIndicator={false}>
                        <View style={containerItemDetail}>
                            {configListDetail.map((e) => {
                                if (e.TypeView != 'E_COMMON_PROFILE')
                                    return Vnr_Function.formatStringTypeV3(dataItem, e, configListDetail);
                            })}
                        </View>
                    </ScrollView>
                    {Array.isArray(listActions) && listActions.length > 0 && (
                        <View style={bottomActions}>
                            <ListButtonMenuRight listActions={listActions} dataItem={dataItem} />
                        </View>
                    )}
                </View>
            );
        } else if (dataItem == 'EmptyData') {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaViewDetail>
        );
    }
}
