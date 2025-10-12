import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView, Colors } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { generateRowActionAndSelected, AttSubmitShiftChangeBusinessFunction } from './AttSubmitShiftChangeBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { EnumName } from '../../../../../assets/constant';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import AttSubmitShiftChangeAddOrEdit from './AttSubmitShiftChangeAddOrEdit';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';

const configDefault = [
    {
        TypeView: 'E_STATUS',
        Name: 'StatusView',
        DisplayKey: 'HRM_Attendance_Overtime_OvertimeList_Status',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP_PROFILE',
        DisplayKey: 'HRM_PortalApp_Subscribers',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'CodeEmp',
        DisplayKey: 'HRM_HR_Profile_CodeEmp',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'ProfileName',
        DisplayKey: 'HRM_HR_Profile_ProfileName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'PositionName',
        DisplayKey: 'HRM_HR_Profile_PositionName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'JobTitleName',
        DisplayKey: 'HRM_HR_Profile_JobTitleName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'OrgStructureName',
        DisplayKey: 'HRM_Eva_Performance_OrgStructureName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_UNIT',
        DisplayKey: 'HRM_Hre_SignatureRegister_E_UNIT',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_DIVISION',
        DisplayKey: 'HRM_Hre_SignatureRegister_E_DIVISION',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_TEAM',
        DisplayKey: 'Group',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_SECTION',
        DisplayKey: 'HRM_HR_ReportProfileWaitingStopWorking_TeamName',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_OvertimePlanInformation',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'WorkDateRoot',
        DisplayKey: 'DateOvertime',
        DataType: 'DateToFrom',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DurationTypeView',
        DisplayKey: 'HRM_PortalApp_TypeRegister',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'RegisterHours',
        DisplayKey: 'HRM_PortalApp_HourRegister',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TimeFrom',
        NameSecond: 'TimeTo',
        DisplayKey: 'HRM_PortalApp_TimeOvertime',
        DataType: 'DateToFrom',
        DataFormat: 'HH:mm'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'OvertimeReasonName',
        DisplayKey: 'HRM_PortalApp_ReasonOvertime',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ReasonOT',
        DisplayKey: 'HRM_PortalApp_Explanation',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'AccumulateHour',
        DisplayKey: 'HRM_PortalApp_AccumulatedOvertime',
        DataType: 'string',
        DataFormat: 'E_MULTITEXTHORIZONTAL',
        Unit: 'HRM_PortalApp_Hour_Lowercase'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_AnotherInformation',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IsUnitAssistant',
        DisplayKey: 'HRM_PortalApp_Change_TLĐV',
        DataType: 'bool'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IsSignUpToEat',
        DisplayKey: 'HRM_PortalApp_RegisterEat',
        DataType: 'bool'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IsRequestForBenefit',
        DisplayKey: 'E_ARCHIVESPAYMENTREQUEST',
        DataType: 'bool'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IsRequestEntryExitGate',
        DisplayKey: 'HRM_PortalApp_Request_InOut',
        DataType: 'bool'
    },
    {
        TypeView: 'E_GROUP_FILEATTACH',
        DisplayKey: 'HRM_PortalApp_Attachments',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lstFileAttach',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_GROUP_APPROVE',
        DisplayKey: 'HRM_HRE_Concurrent_ApproveHistory',
        DataType: 'string'
    },
    {
        TypeView: 'E_USERAPPROVE1',
        Name: 'UserApproveName',
        DisplayKey: 'PerformanceApprovalStatus__E_APPROVED1',
        DataType: 'string'
    },
    {
        TypeView: 'E_USERAPPROVE3',
        Name: 'UserApproveName3',
        DisplayKey: 'PerformanceApprovalStatus__E_APPROVED2',
        DataType: 'string'
    },
    {
        TypeView: 'E_USERAPPROVE4',
        Name: 'UserApproveName4',
        DisplayKey: 'PerformanceApprovalStatus__E_APPROVED3',
        DataType: 'string'
    },
    {
        TypeView: 'E_USERAPPROVE2',
        Name: 'UserApproveName2',
        DisplayKey: 'JobVacancyStatus__E_APPROVED4',
        DataType: 'string'
    }
];

export default class AttSubmitShiftChangeViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: generateRowActionAndSelected(this.props.navigation.state.params?.screenName),
            listActions: this.resultListActionHeader()
        };

        this.AttSubmitShiftChangeAddOrEdit = null;
    }

    onEdit = item => {
        if (item) {
            if (this.AttSubmitShiftChangeAddOrEdit && this.AttSubmitShiftChangeAddOrEdit.onShow) {
                this.AttSubmitShiftChangeAddOrEdit.onShow({
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

    rowActionsHeaderRight = dataItem => {
        let _listActions = [];
        const { rowActions } = this.state.dataRowActionAndSelected;

        if (
            !Vnr_Function.CheckIsNullOrEmpty(rowActions) &&
            !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction)
        ) {
            _listActions = rowActions.filter(item => {
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
                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = response.Data;
                    data.BusinessAllowAction = Vnr_Services.handleStatus(
                        data.Status,
                        dataItem?.SendEmailStatus ? dataItem?.SendEmailStatus : false
                    );
                    data.itemStatus = Vnr_Services.formatStyleStatusApp(data.Status);
                    data.lstFileAttach = ManageFileSevice.setFileAttachApp(data.FileAttachment);
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

                    // handle synchronized field for app
                    if (!data?.UserProcessApproveID && data?.UserProcessID) {
                        data.UserProcessApproveID = data?.UserProcessID;
                    }

                    if (!data?.UserProcessApproveID2 && data?.UserProcessID2) {
                        data.UserProcessApproveID2 = data?.UserProcessID2;
                    }

                    if (!data?.UserProcessApproveID3 && data?.UserProcessID3) {
                        data.UserProcessApproveID3 = data?.UserProcessID3;
                    }

                    if (!data?.UserProcessApproveID4 && data?.UserProcessID4) {
                        data.UserProcessApproveID4 = data?.UserProcessID4;
                    }

                    const _listActions = await this.rowActionsHeaderRight(data);
                    this.setState({ configListDetail: _configListDetail, dataItem: data, listActions: _listActions });
                } else {
                    this.setState({ dataItem: 'EmptyData' });
                }
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
            DrawerServices.navigate('AttSubmitTakeLeaveDay');
        } else {
            this.setState({ dataItem: null }, () => {
                this.getDataItem(true);
            });
        }
    };

    componentDidMount() {
        AttSubmitShiftChangeBusinessFunction.setThisForBusiness(this);
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, listActions } = this.state,
            { containerItemDetail, contentScroll, bottomActions } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <AttSubmitShiftChangeAddOrEdit ref={refs => (this.AttSubmitShiftChangeAddOrEdit = refs)} />
                    <ScrollView style={contentScroll} showsVerticalScrollIndicator={false}>
                        <View style={containerItemDetail}>
                            {configListDetail.map(e => {
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
