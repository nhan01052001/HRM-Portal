import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import {
    generateRowActionAndSelected,
    HreApproveTerminationOfWorkBusinessFunction
} from './HreApproveTerminationOfWorkBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';

const configDefault = [
    {
        TypeView: 'E_STATUS',
        Name: 'StatusView',
        DisplayKey: 'HRM_Attendance_Overtime_OvertimeList_Status',
        DataType: 'string',
        isHiddenDate: true
    },
    {
        TypeView: 'E_GROUP_PROFILE',
        DisplayKey: 'HRM_PortalApp_PeopleQuittingTheirJobs',
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
        DisplayKey: 'HRM_PortalApp_TerminationOfWork_DetailedInformation',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TypeOfStopName',
        DisplayKey: 'HRM_PortalApp_TerminationOfWork_TypeStopWork',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ResignReasonName',
        DisplayKey: 'HRM_PortalApp_TerminationOfWork_ReasonStopWork',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'OtherReason',
        DisplayKey: 'HRM_PortalApp_TerminationOfWork_OtherReason',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'LastWorkingDay',
        DisplayKey: 'HRM_PortalApp_TerminationOfWork_LastWorkingDay',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateStop',
        DisplayKey: 'HRM_PortalApp_TerminationOfWork_DateQuit',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'RequestDate',
        DisplayKey: 'HRM_PortalApp_TerminationOfWork_RequestDate',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DecisionNo',
        DisplayKey: 'HRM_PortalApp_DecisionNo',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lstFileAttach',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
        DataType: 'FileAttach'
    }
];

const configLeveApprove = [
    {
        TypeView: 'UserSubmit',
        Name: 'UserInfoName',
        DisplayKey: 'HRM_PortalApp_Requester',
        DataType: 'string'
    },
    {
        TypeView: 'PersonRequestingChange',
        Name: 'UserInfoName',
        DisplayKey: 'HRM_PortalApp_PersonRequestingChange',
        DataType: 'string'
    },
    {
        TypeView: 'UserApprove1,UserReject',
        Name: 'UserInfoName',
        DisplayKey: 'HRM_PortalApp_Approval_UserApproveID',
        DataType: 'string'
    },
    {
        TypeView: 'UserApprove2,UserReject',
        Name: 'UserInfoName',
        DisplayKey: 'HRM_PortalApp_MidNextApprover',
        DataType: 'string'
    },
    {
        TypeView: 'UserApprove3,UserReject',
        Name: 'UserInfoName',
        DisplayKey: 'HRM_PortalApp_Approval_UserApproveID3',
        DataType: 'string'
    },
    {
        TypeView: 'UserApprove4,UserReject',
        Name: 'UserInfoName',
        DisplayKey: 'HRM_PortalApp_Approval_UserApproveID4',
        DataType: 'string'
    }
];

export default class HreApproveTerminationOfWorkViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: generateRowActionAndSelected(ScreenName.HreApproveTerminationOfWork),
            listActions: this.resultListActionHeader()
        };
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
                { dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[ScreenName.HreApproveTerminationOfWork]
                    ? ConfigListDetail.value[ScreenName.HreApproveTerminationOfWork]
                    : configDefault;

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID;
            if (id) {
                const response = await HttpService.Post(
                    '[URI_CENTER]/api/Hre_StopWorking/New_GetStopWorkingDetailPortal',
                    {
                        ID: id
                    }
                );
                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = {
                        ...dataItem,
                        ...response.Data
                    };

                    if (
                        response.Data &&
                        response.Data?.StopWorkingInformation &&
                        response.Data?.StopWorkingInformation[0]
                    ) {
                        data = {
                            ...data,
                            ...response.Data?.StopWorkingInformation[0]
                        };
                    }

                    data.BusinessAllowAction = dataItem?.BusinessAllowAction
                        ? dataItem?.BusinessAllowAction
                        : Vnr_Services.handleStatusApprove(data.Status, data?.TypeApprove);
                    data.itemStatus = Vnr_Services.formatStyleStatusApp(data.Status);
                    data.lstFileAttach = ManageFileSevice.setFileAttachApp(data.Attachment);
                    data.ImagePath = data?.AvatarUserRegister
                        ? data.AvatarUserRegister
                        : dataItem?.ProfileInfo?.ImagePath;

                    if (data.Status === 'E_SUBMIT') {
                        let arr = data.BusinessAllowAction.split(',');
                        arr.push('E_REQUEST_CHANGE');
                        data.BusinessAllowAction = arr.join(',');
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

    reload = () => {
        const { reloadScreenList } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');
        //this.getDataItem(true);
    };

    componentDidMount() {
        HreApproveTerminationOfWorkBusinessFunction.setThisForBusiness(this);
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, listActions } = this.state,
            { containerItemDetail, contentScroll, bottomActions } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;

        //#region handle styles
        let dataApprover = [];

        if (Array.isArray(dataItem?.ApprovalProcess)) {
            dataApprover = dataItem?.ApprovalProcess;
        }

        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={contentScroll} showsVerticalScrollIndicator={false}>
                        <View style={containerItemDetail}>
                            {configListDetail.map((e) => {
                                if (e.TypeView != 'E_COMMON_PROFILE')
                                    return Vnr_Function.formatStringTypeV3(dataItem, e, configListDetail);
                            })}
                        </View>
                        {Vnr_Function.renderApproveProcessHRE(
                            dataApprover,
                            configLeveApprove,
                            'HRM_PortalApp_Approval_Process',
                            'JobTitleName'
                        )}
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
