import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';

const configDefault = [
    {
        TypeView: 'E_GROUP_PROFILE',
        DisplayKey: 'ProfileNameViewNew',
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
        DisplayKey: 'HRM_HR_Profile_OrgStructureName',
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
        DisplayKey: 'HRM_PortalApp_RecommendedInformation',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'FormatDateEffective',
        DisplayKey: 'HRM_PortalApp_HreMovementHistory_EffectiveDate',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TypeOfTransferName',
        DisplayKey: 'HRM_PortalApp_HreMovementHistory_InsuranceType',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'WHOrgStructureName',
        NameOld: 'WHOrgStructureName_Old',
        DisplayKey: 'HRM_PortalApp_HreMovementHistory_ProposedDepartment',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'WHPositionName',
        NameOld: 'WHPositionName_Old',
        DisplayKey: 'HRM_PortalApp_HreMovementHistory_ProposedPosition',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'WHJobTitleName',
        NameOld: 'WHJobTitleName_Old',
        DisplayKey: 'HRM_PortalApp_HreMovementHistory_ProposedJobTitle',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SalaryClassName',
        NameOld: 'SalaryClassName_Old',
        DisplayKey: 'HRM_PortalApp_HreMovementHistory_ProposedSalaryGrades',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'WorkPlaceName',
        NameOld: 'WorkPlaceName_Old',
        DisplayKey: 'HRM_PortalApp_HreMovementHistory_ProposedWorkplace',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SupervisorName',
        NameOld: 'SupervisorName_Old',
        DisplayKey: 'HRM_PortalApp_HreMovementHistory_ProposedDirectSupervisor',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'MidSupervisorName',
        NameOld: 'MidSupervisorName_Old',
        DisplayKey: 'HRM_PortalApp_HreMovementHistory_ProposedMidSupervisor',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'NextSupervisorName',
        NameOld: 'NextSupervisorName_Old',
        DisplayKey: 'HRM_PortalApp_HreMovementHistory_ProposedNextSupervisor',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'HighSupervisorName',
        NameOld: 'HighSupervisorName_Old',
        DisplayKey: 'HRM_PortalApp_HreMovementHistory_ProposedHighSupervisor',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Notes',
        DisplayKey: 'HRM_Category_Cat_HRPlanningPeriod_Note',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lstFileAttach',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_RecommendedInformation',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'BasicSalary',
        NameOld: 'BasicSalary_Old',
        DisplayKey: 'HRM_PortalApp_ContractHistory_SalaryBasic',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'KPIAmount',
        NameOld: 'KPIAmount_Old',
        DisplayKey: 'HRM_PortalApp_WorkHistory_KPIAmount',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalSalary',
        NameOld: 'TotalSalary_Old',
        DisplayKey: 'HRM_PortalApp_ContractHistory_Salary',
        DataType: 'string'
    }
];

// SpecializationName,Loại thử việc(check lại)
// các field chưa có

export default class HreMovementHistoryViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null
        };
    }

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[ScreenName.HreMovementHistoryViewDetail]
                    ? ConfigListDetail.value[ScreenName.HreMovementHistoryViewDetail]
                    : configDefault;
            let id = dataItem.ProfileID ? dataItem.ProfileID : dataItem.ID;
            if (id) {
                const dataBody = {
                    WorkHistoryID: id
                };
                const response = await HttpService.Post(
                    '[URI_CENTER]/api/Hre_ProfileAPI/New_GetProfileWorkHistoryDetailPortal',
                    dataBody,
                    null,
                    this.reload
                );

                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = {
                        ...dataItem,
                        ...response.Data
                    };

                    if (response['RecommendedInformation'] && response['RecommendedInformation'][0]) {
                        data = {
                            ...data,
                            ...response['RecommendedInformation'][0]
                        };
                    }

                    if (response['ProposedSalary'] && response['ProposedSalary'][0]) {
                        data = {
                            ...data,
                            ...response['ProposedSalary'][0]
                        };
                    }

                    data.itemStatus = Vnr_Services.formatStyleStatusApp(data.Status);
                    data.lstFileAttach = ManageFileSevice.setFileAttachApp(data.FileAttach);
                    this.setState({ configListDetail: _configListDetail, dataItem: data });
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

    reload = () => {
        const { reloadScreenList } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');
        this.setState({ dataItem: null }, () => {
            this.getDataItem(true);
        });
    };

    componentDidMount() {
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail } = this.state,
            { containerItemDetail, contentScroll } = styleScreenDetail;

        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={contentScroll} showsVerticalScrollIndicator={false}>
                        <View style={containerItemDetail}>
                            {configListDetail.map(e => {
                                if (e.TypeView != 'E_COMMON_PROFILE')
                                    return Vnr_Function.formatStringTypeV3(dataItem, e, configListDetail);
                            })}
                        </View>
                    </ScrollView>
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
