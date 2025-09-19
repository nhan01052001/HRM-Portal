import React, { Component } from 'react';
import { View, ScrollView, TouchableOpacity } from 'react-native';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    CustomStyleSheet,
    Colors,
    Size
} from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import {
    generateRowActionAndSelected,
    HrePendingApproveRecruitmentProposalBusiness
} from './hrePendingApproveRecruitmentProposal/HrePendingApproveRecruitmentProposalBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { EnumName } from '../../../../../assets/constant';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import { ItemViewDetail } from '../../../../../componentsV3/VnrRenderList/ItemViewDetail';
import ViewMovementHistoryInfo from './ViewMovementHistoryInfo';
import { IconBack } from '../../../../../constants/Icons';
import ViewAcademicQualificationInfo from './ViewAcademicQualificationInfo';
import { translate } from '../../../../../i18n/translate';

// eslint-disable-next-line no-unused-vars
const configDefault = [
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_HR_GeneralInformation',
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
        Name: 'RecruitmentReasonView',
        DisplayKey: 'HRM_PortalApp_HreRecruitment_Reason',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'RecruitmentTypeView',
        DisplayKey: 'HRM_PortalApp_HreRecruitment_Recruitment',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateSubmit',
        DisplayKey: 'HRM_PortalApp_HreRecruitment_SendRequestDate',
        DataType: 'DateToFrom',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'UnitName',
        DisplayKey: 'HRM_PortalApp_HreRecruitment_Department',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PositionName',
        DisplayKey: 'HRM_PortalApp_HreRecruitment_JobTitle',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ProbationDate',
        DisplayKey: 'HRM_PortalApp_HreRecruitment_DateOHire',
        DataType: 'DateToFrom',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'WorkPlaceName',
        DisplayKey: 'HRM_PortalApp_HreRecruitment_Workplace',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SalaryView',
        DisplayKey: 'HRM_PortalApp_DesiredSalary',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'OtherAllowance',
        DisplayKey: 'HRM_PortalApp_HreRecruitment_Additional',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'OtherAllowance',
        DisplayKey: 'HRM_PortalApp_HreRecruitment_Location',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CompanyName',
        DisplayKey: 'HRM_PortalApp_HreRecruitment_PayrollUnit',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Permission',
        DisplayKey: 'HRM_PortalApp_HreRecruitment_JobTitleAndDuties',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP', //E_GROUP_PROFILE
        DisplayKey: 'HRM_PortalApp_HreRecruitment_CV_Attached',
        DataType: 'string',
        isCollapse: true
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'FileAttachment',
        DisplayKey: '',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_HreRecruitment_PersonnelOrganizationChart',
        DataType: 'string',
        isCollapse: true
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'FileAttachment',
        DisplayKey: '',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_HreRecruitment_PositionStructure',
        DataType: 'string',
        isCollapse: true
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'FileAttachment',
        DisplayKey: '',
        DataType: 'FileAttach'
    }
];

// eslint-disable-next-line no-unused-vars
const HreApproveRecruitmentProposalCandidateInfo = [
    {
        TypeView: 'E_GROUP_PROFILE',
        DisplayKey: 'HRM_PortalApp_CandidateInfo',
        DataType: 'string',
        isCollapse: true
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'GenderView',
        DisplayKey: 'HRM_HR_Profile_OrgStructureName',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: '',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CandidateName',
        DisplayKey: 'HRM_PortalApp_HreRecruitment_Candidate',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'GenderView',
        DisplayKey: 'HRM_PortalApp_Gender',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateOfBirth',
        DisplayKey: 'HRM_PortalApp_DateOfBirth',
        DataType: 'DateToFrom',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PlaceOfBirth',
        DisplayKey: 'HRM_PortalApp_PlaceOfBirth',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PlaceOfOriginName',
        DisplayKey: 'HRM_PortalApp_PlaceOfOrigin',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'MarriageStatusView',
        DisplayKey: 'HRM_PortalApp_MaritalStatus',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'HeightView',
        DisplayKey: 'HRM_PortalApp_Height_CM',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'WeightView',
        DisplayKey: 'HRM_PortalApp_Weight_KG',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IDNoNumber',
        DisplayKey: 'HRM_PortalApp_HreRecruitment_Citizen_ID_Number',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IDNoDateOfIssue',
        DisplayKey: 'HRM_PortalApp_HreRecruitment_DateOfIssue',
        DataType: 'DateToFrom',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IDNoNameOfIssue',
        DisplayKey: 'HRM_PortalApp_HreRecruitment_PlaceOfIssue',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PFullAdress',
        DisplayKey: 'HRM_PortalApp_HreRecruitment_PermanentResidence',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TFullAdress',
        DisplayKey: 'HRM_PortalApp_HreRecruitment_CurrentResidence',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'NumberChild',
        DisplayKey: 'HRM_PortalApp_NumberOfChildren',
        DataType: 'string'
    }
];

// eslint-disable-next-line no-unused-vars
const HreApproveRecruitmentProposalMovementHistoryInfo = [
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_HreRecruitment_MovementHistory',
        DataType: 'string',
        isCollapse: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateStart',
        DisplayKey: 'Ngày bắt đầu',
        DataType: 'DateToFrom',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateFinish',
        DisplayKey: 'Ngày kết thúc',
        DataType: 'DateToFrom',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CompanyName',
        DisplayKey: 'Công ty',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PositionLast',
        DisplayKey: 'Chức danh',
        DataType: 'string'
    }
];

// eslint-disable-next-line no-unused-vars
const HreApproveRecruitmentProposalProcessApproval = [
    {
        TypeView: 'E_GROUP_APPROVE',
        DisplayKey: 'HRM_PortalApp_Approval_Process',
        DataType: 'string',
        isCollapse: true
    }
];

const ListScreen = [
    'HreApproveRecruitmentProposalViewDetail|GeneralInfo',
    'HreApproveRecruitmentProposalViewDetailFileAttachment|listExtendAttachments',
    'HreApproveRecruitmentProposalCandidateInfo|CandidateInfo',
    'HreApproveRecruitmentProposalMovementHistoryInfo|MovementHistoryInfo',
    'HreApproveRecruitmentProposalAcademicQualificationInfo|AcademicQualificationInfo',
    'HreApproveRecruitmentProposalProcessApproval|ProcessApproval'
    // 'AcademicQualificationInfo',
    // 'InterviewResult',
    // 'JobvacancyInfo'
];

export default class HreApproveRecruitmentProposalViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: this.props.navigation.state.params?.screenName
                ? generateRowActionAndSelected(this.props.navigation.state.params?.screenName)
                : [],
            listActions: this.resultListActionHeader(),
            listData: []
        };

        props.navigation.setParams({
            headerLeft: (
                <TouchableOpacity
                    onPress={() => {
                        const _params = this.props.navigation.state.params,
                            { beforeScreen } = typeof _params == 'object' ? _params : JSON.parse(_params);
                        if (beforeScreen != null) DrawerServices.navigate(beforeScreen);
                        else DrawerServices.goBack();
                    }}
                >
                    <View style={styleSheets.bnt_HeaderRight}>
                        <IconBack color={Colors.gray_10} size={Size.iconSizeHeader} />
                    </View>
                </TouchableOpacity>
            )
        });
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
            !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction) &&
            dataItem.BusinessAllowAction
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
                { dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID;
            if (id) {
                let listConfig = {},
                    listConfigAndData = [];

                const response = await HttpService.Post(
                    '[URI_CENTER]/api/Rec_RecruitmentFlyer/GetRecruitmentFlyerDetailByID',
                    {
                        ID: id,
                        IsGetInterview: true
                    }
                );

                ConfigListDetail.value = {
                    ...ConfigListDetail.value
                    // 'HreApproveRecruitmentProposalCandidateInfo': [
                    //     {
                    //         'TypeView': 'E_GROUP_PROFILE',
                    //         'DisplayKey': 'HRM_PortalApp_CandidateInfo',
                    //         'DataType': 'string',
                    //         'isCollapse': true
                    //     },
                    //     {
                    //         'TypeView': 'E_COMMON_PROFILE',
                    //         'Name': 'CodeCandidate',
                    //         'DisplayKey': '',
                    //         'DataType': 'string'
                    //     },
                    //     {
                    //         'TypeView': 'E_COMMON_PROFILE',
                    //         'Name': 'GenderView',
                    //         'DisplayKey': 'HRM_HR_Profile_OrgStructureName',
                    //         'DataType': 'string'
                    //     },
                    //     {
                    //         'TypeView': 'E_COMMON_PROFILE',
                    //         'Name': 'AgeView',
                    //         'DisplayKey': '',
                    //         'DataType': 'string'
                    //     },
                    //     {
                    //         'TypeView': 'E_COMMON',
                    //         'Name': 'CandidateName',
                    //         'DisplayKey': 'HRM_PortalApp_HreRecruitment_Candidate',
                    //         'DataType': 'string'
                    //     },
                    //     {
                    //         'TypeView': 'E_COMMON',
                    //         'Name': 'GenderView',
                    //         'DisplayKey': 'HRM_PortalApp_Gender',
                    //         'DataType': 'string'
                    //     },
                    //     {
                    //         'TypeView': 'E_COMMON',
                    //         'Name': 'DateOfBirth',
                    //         'DisplayKey': 'HRM_PortalApp_DateOfBirth',
                    //         'DataType': 'DateToFrom',
                    //         'DataFormat': 'DD/MM/YYYY'
                    //     },
                    //     {
                    //         'TypeView': 'E_COMMON',
                    //         'Name': 'PlaceOfBirth',
                    //         'DisplayKey': 'HRM_PortalApp_PlaceOfBirth',
                    //         'DataType': 'string'
                    //     },
                    //     {
                    //         'TypeView': 'E_COMMON',
                    //         'Name': 'Origin',
                    //         'DisplayKey': 'HRM_PortalApp_PlaceOfOrigin',
                    //         'DataType': 'string'
                    //     },
                    //     {
                    //         'TypeView': 'E_COMMON',
                    //         'Name': 'MarriageStatusView',
                    //         'DisplayKey': 'HRM_PortalApp_MaritalStatus',
                    //         'DataType': 'string'
                    //     },
                    //     {
                    //         'TypeView': 'E_COMMON',
                    //         'Name': 'HeightView',
                    //         'DisplayKey': 'HRM_PortalApp_Height_CM',
                    //         'DataType': 'string'
                    //     },
                    //     {
                    //         'TypeView': 'E_COMMON',
                    //         'Name': 'WeightView',
                    //         'DisplayKey': 'HRM_PortalApp_Weight_KG',
                    //         'DataType': 'string'
                    //     },
                    //     {
                    //         'TypeView': 'E_COMMON',
                    //         'Name': 'IDNoNumber',
                    //         'DisplayKey': 'HRM_PortalApp_HreRecruitment_Citizen_ID_Number',
                    //         'DataType': 'string'
                    //     },
                    //     {
                    //         'TypeView': 'E_COMMON',
                    //         'Name': 'IDNoDateOfIssue',
                    //         'DisplayKey': 'HRM_PortalApp_HreRecruitment_DateOfIssue',
                    //         'DataType': 'DateToFrom',
                    //         'DataFormat': 'DD/MM/YYYY'
                    //     },
                    //     {
                    //         'TypeView': 'E_COMMON',
                    //         'Name': 'IDNoNameOfIssue',
                    //         'DisplayKey': 'HRM_PortalApp_HreRecruitment_PlaceOfIssue',
                    //         'DataType': 'string'
                    //     },
                    //     {
                    //         'TypeView': 'E_COMMON',
                    //         'Name': 'PFullAdress',
                    //         'DisplayKey': 'HRM_PortalApp_HreRecruitment_PermanentResidence',
                    //         'DataType': 'string'
                    //     },
                    //     {
                    //         'TypeView': 'E_COMMON',
                    //         'Name': 'TFullAdress',
                    //         'DisplayKey': 'HRM_PortalApp_HreRecruitment_CurrentResidence',
                    //         'DataType': 'string'
                    //     },
                    //     {
                    //         'TypeView': 'E_COMMON',
                    //         'Name': 'NumberChild',
                    //         'DisplayKey': 'HRM_PortalApp_NumberOfChildren',
                    //         'DataType': 'string'
                    //     }
                    // ],
                    // 'HreApproveRecruitmentProposalViewDetailFileAttachment': [
                    //     {
                    //         'TypeView': 'E_GROUP',
                    //         'DisplayKey': '',
                    //         'DataType': 'string',
                    //         'isCollapse': true
                    //     },
                    //     {
                    //         'TypeView': 'E_FILEATTACH',
                    //         'Name': '',
                    //         'DisplayKey': '',
                    //         'DataType': 'FileAttach'
                    //     }
                    // ]
                };

                if (!response || response.Status !== EnumName.E_SUCCESS || !response?.Data) {
                    this.setState({ dataItem: 'EmptyData' });
                    return;
                }

                let checkEmptyData = false;

                ListScreen.map((item) => {
                    let [screenDetail, screenData] = item.split('|');

                    if (screenData === 'CandidateInfo' && dataItem?.Age) {
                        dataItem.AgeView = `${dataItem?.Age} ${translate('HRM_PortalApp_YearOld')}`;
                    }

                    if (screenDetail && screenData)
                        if (
                            screenData === 'listExtendAttachments' &&
                            Array.isArray(response?.Data.listExtendAttachments) &&
                            response?.Data.listExtendAttachments.length > 0
                        ) {
                            response?.Data.listExtendAttachments.map((value, i) => {
                                if (value?.Attachment && value?.Attachment.length > 0)
                                    listConfigAndData = [
                                        ...listConfigAndData,
                                        {
                                            [`FileAttach${i}`]: [
                                                {
                                                    TypeView: 'E_GROUP',
                                                    DisplayKey: value?.ExtendName,
                                                    DataType: 'string',
                                                    isCollapse: true
                                                },
                                                {
                                                    TypeView: 'E_FILEATTACH',
                                                    Name: 'Attachment',
                                                    DisplayKey: '',
                                                    DataType: 'FileAttach'
                                                }
                                            ],
                                            data: [value]
                                        }
                                    ];
                            });
                        } else {
                            if (ConfigListDetail.value[screenDetail] && response?.Data[screenData].length > 0) {
                                // Ko có cấu hình ẩn lun
                                listConfigAndData = [
                                    ...listConfigAndData,
                                    {
                                        [`${screenDetail}`]: ConfigListDetail.value[screenDetail]
                                            ? [...ConfigListDetail.value[screenDetail]]
                                            : null,
                                        data:
                                            screenData === 'CandidateInfo' &&
                                                Array.isArray(response?.Data[screenData]) &&
                                                response?.Data[screenData].length > 0
                                                ? [{ ...dataItem, ...response?.Data[screenData][0] }]
                                                : response?.Data[screenData]
                                    }
                                ];
                            }

                            if (!Array.isArray(response?.Data[screenData]) || !response?.Data[screenData].length > 0) {
                                checkEmptyData = true;
                            } else {
                                checkEmptyData = false;
                            }
                        }

                    if (ConfigListDetail.value[screenDetail]) {
                        listConfig = {
                            ...listConfig,
                            [`${screenDetail}`]: [...ConfigListDetail.value[screenDetail]]
                        };
                    }
                });

                if (checkEmptyData) {
                    this.setState({ dataItem: 'EmptyData' });
                    return;
                }

                // if not have config => EmptyData
                if (Object.keys(listConfig).length === 0) {
                    this.setState({ dataItem: 'EmptyData' });
                    return;
                }

                const _listActions = await this.rowActionsHeaderRight(dataItem);
                this.setState({
                    configListDetail: listConfig,
                    dataItem: dataItem,
                    listActions: _listActions,
                    listData: listConfigAndData
                });
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
            DrawerServices.navigate('HrePendingApproveRecruitmentProposal');
        } else {
            this.setState({ dataItem: null }, () => {
                this.getDataItem(true);
            });
        }
    };

    componentDidMount() {
        HrePendingApproveRecruitmentProposalBusiness.setThisForBusiness(this);
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, listActions, listData } = this.state,
            { containerItemDetail, contentScroll, bottomActions } = styleScreenDetail;


        let contentViewDetail = <VnrLoading size={'large'} />;

        if (listData.length > 0 && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={contentScroll} showsVerticalScrollIndicator={false}>
                        <View style={[containerItemDetail, CustomStyleSheet.paddingHorizontal(0)]}>
                            {listData.map((item, index) => {
                                const [config, data] = Object.values(item);
                                const screenNameConfig = Object.keys(item)[0];

                                if (!Array.isArray(config) || !Array.isArray(data) || !data.length > 0) return null;

                                if (screenNameConfig === 'HreApproveRecruitmentProposalMovementHistoryInfo')
                                    return <ViewMovementHistoryInfo configListDetail={config} data={data} />;

                                if (screenNameConfig === 'HreApproveRecruitmentProposalAcademicQualificationInfo')
                                    return <ViewAcademicQualificationInfo configListDetail={config} data={data} />;

                                if (screenNameConfig === 'HreApproveRecruitmentProposalProcessApproval')
                                    return (
                                        <View style={CustomStyleSheet.paddingHorizontal(styleSheets.p_10)}>
                                            <ItemViewDetail
                                                props={{ config, data: { ProcessApproval: data } }}
                                                key={index}
                                            />
                                        </View>
                                    );

                                return (
                                    <View key={index} style={CustomStyleSheet.paddingHorizontal(styleSheets.p_10)}>
                                        {data.map((value, i) => {
                                            return <ItemViewDetail props={{ config: config, data: value }} key={i} />;
                                        })}
                                    </View>
                                );
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
