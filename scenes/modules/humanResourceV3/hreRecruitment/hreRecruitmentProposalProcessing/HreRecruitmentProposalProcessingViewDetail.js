import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { generateRowActionAndSelected, HreRecruitmentProposalProcessingBusiness } from './HreRecruitmentProposalProcessingBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';

const configDefault = [
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_General',
        DataType: 'string',
        isCollapse: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'StatusView',
        DisplayKey: 'HRM_Attendance_Overtime_OvertimeList_Status',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'RequirementRecruitmentName',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_RequirementRecruitmentName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CompanyName',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_Company',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'OrgStructureName',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_Department',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'RecruitmentReasonView',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_RecruitmentReason',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateRequest',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_SendReqDate',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'EmployeeTypeName',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_EmployeeType',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP_APPROVE',
        DisplayKey: 'HRM_PortalApp_Approval_Process',
        DataType: 'string',
        isCollapse: true
    }
];

const configJobVacancyDefault = [
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'JobVacancyName',
        DataType: 'string',
        PropName: 'JobVacancyName',
        isCollapse: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'JobVacancyName',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_JobVacancyName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PositionName',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_PositionName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Quantity',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_Quantity',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateStart',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_DateStart',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SalaryView',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_ExpectedSalary',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'WorkPlaceName',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_WorkplaceName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'JobDescription',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_JobDescription',
        DataType: 'E_HTML'
    },
    {
        TypeView: 'E_COMMON_LABEL',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_Standard',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'EducationLevelName',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_EducationLevelName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SubMajorName',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_Major',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Experience',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_Experience',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'AgeView',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_Age',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'HealthStatus',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_HealthStatus',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'GenderView',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_GenderView',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'LanguageTypeName',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_ListLanguageLevel',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ComputingSkillName',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_ComputingSkillName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'WorkAttitude',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_WorkAttitude',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'LeaderManagerSkill',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_LeaderManagerSkill',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ProfessionalKnowledge',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_ProfessionalKnowledge',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Skill',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_Skill',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'OthersRequirement',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_OthersRequirement',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_LABEL',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_AttachFile',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ExtendName',
        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_ProfileType',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'FileAttachment',
        DisplayKey: '',
        DataType: 'FileAttach'
    }
];

export default class HreRecruitmentProposalProcessingViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            configJobVacancy: null,
            dataRowActionAndSelected: generateRowActionAndSelected(ScreenName.HreWaitRecruitmentProposalProcessing),
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
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[screenName]
                    ? ConfigListDetail.value[screenName]
                    : configDefault,
                _configJobVacancy = ConfigListDetail.value['HreRecruitmentProposalProcessingJobVacancy']
                    ? ConfigListDetail.value['HreRecruitmentProposalProcessingJobVacancy']
                    : configJobVacancyDefault;

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID;
            if (id) {
                const response = await HttpService.Post(
                    '[URI_CENTER]/api/Rec_RequirementRecruitmentNew/GetDetailRequirementRecruitment',
                    {
                        ID: id
                    }
                );

                // const getDetailConfig = await Vnr_Function.HandleConfigListDetailATT(
                //     _configListDetail,
                //     'Detail_List_Overtime'
                // );

                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = { ...response.Data };

                    data.itemStatus = Vnr_Services.formatStyleStatusApp(data.Status);
                    data.BusinessAllowAction = Vnr_Services.handleStatusApprove(data.Status, dataItem?.TypeApprove);
                    if (data.Status === 'E_WAIT_APPROVED') {
                        let arr = data.BusinessAllowAction.split(',');
                        arr.push('E_REQUEST_CHANGE');
                        data.BusinessAllowAction = arr.join(',');
                    }

                    const _listActions = await this.rowActionsHeaderRight(data);
                    this.setState({
                        configListDetail: _configListDetail,
                        configJobVacancy: _configJobVacancy,
                        dataItem: data,
                        listActions: _listActions
                    });
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
            DrawerServices.navigate('AttSubmitTakeLeaveDay');
        } else {
            this.setState({ dataItem: null }, () => {
                this.getDataItem(true);
            });
        }
    };

    componentDidMount() {
        HreRecruitmentProposalProcessingBusiness.setThisForBusiness(this);
        this.getDataItem();
    }

    renderJobVacancies = (jobVacancy) => {
        const { configJobVacancy } = this.state;
        let attachmentString = jobVacancy.listExtendAttachments.map((item) => item.Attachment).join(',');
        jobVacancy.FileAttachment = ManageFileSevice.setFileAttachApp(attachmentString);
        jobVacancy.ExtendName = jobVacancy.listExtendAttachments[0].ExtendName
        return configJobVacancy.map((e) => {
            if (e.TypeView != 'E_COMMON_PROFILE') {
                return Vnr_Function.formatStringTypeV3(jobVacancy, e, configJobVacancy);
            }
            return null; // Nếu không thỏa mãn điều kiện thì trả về null
        });
    };

    render() {
        const { dataItem, configListDetail, listActions } = this.state,
            { containerItemDetail, contentScroll, bottomActions } = styleScreenDetail;

        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={contentScroll} showsVerticalScrollIndicator={false}>
                        <View style={containerItemDetail}>
                            {configListDetail.map((e) => {
                                if (e.TypeView != 'E_COMMON_PROFILE' && e.TypeView != 'E_GROUP_APPROVE')
                                    return Vnr_Function.formatStringTypeV3(dataItem, e, configListDetail);
                            })}
                            {Array.isArray(dataItem.listJobVacancies) &&
                                dataItem.listJobVacancies.length > 0 &&
                                dataItem.listJobVacancies.map((jobVacancy, index) => {
                                    return <View key={index}>{this.renderJobVacancies(jobVacancy)}</View>;
                                })}
                            {configListDetail.map((e) => {
                                if (e.TypeView === 'E_GROUP_APPROVE')
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
