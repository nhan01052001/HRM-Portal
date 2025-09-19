import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
// import { generateRowActionAndSelected, HrePendingProcessingCandidateApplicationsBusiness } from './hrePendingProcessingCandidateApplications/HrePendingProcessingCandidateApplicationsBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import { EnumName } from '../../../../../assets/constant';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import { ItemViewDetail } from '../../../../../componentsV3/VnrRenderList/ItemViewDetail';

const configDefault = [
    {
        TypeView: 'E_GROUP_PROFILE',
        DisplayKey: 'HRM_PortalApp_CandidateInfo',
        DataType: 'string',
        isCollapse: true
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'OrgStructureName',
        DisplayKey: 'HRM_HR_Profile_OrgStructureName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'StatusView',
        DisplayKey: 'HRM_Attendance_Overtime_OvertimeList_Status',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_PersonalInformation',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CandidateName',
        DisplayKey: 'HRM_PortalApp_FullName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CodeCandidate',
        DisplayKey: 'HRM_PortalApp_CandidateCode',
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
        Name: 'MarriageStatusView',
        DisplayKey: 'HRM_PortalApp_MaritalStatus',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'NumberChild',
        DisplayKey: 'HRM_PortalApp_NumberOfChildren',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CodeTax',
        DisplayKey: 'HRM_PortalApp_PITFinalization_TaxCode',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateOfIssuedTaxCode',
        DisplayKey: 'DateOfIssuedTaxCode',
        DataType: 'DateToFrom',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SourceAdsName',
        DisplayKey: 'HRM_PortalApp_SourceCandidate',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'EthnicName',
        DisplayKey: 'HRM_PortalApp_Ethnicity',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ReligionName',
        DisplayKey: 'HRM_PortalApp_Religion',
        DataType: 'string'
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
        Name: 'Height',
        DisplayKey: 'HRM_PortalApp_Height_CM',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Weight',
        DisplayKey: 'HRM_PortalApp_Weight_KG',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'GraduatedLevelName',
        DisplayKey: 'HRM_PortalApp_GraduationLevel',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lstFileAttach',
        DisplayKey: '',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_COMMON_LABEL',
        DisplayKey: 'HRM_PortalApp_HrePersonalInfoProfileIdentification_IDCard',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IDCard',
        DisplayKey: 'HRM_HR_Rec_Candidate_IDCard',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IDCardDateOfIssue',
        DisplayKey: 'HRM_HR_Rec_Candidate_IDCardDateOfIssue',
        DataType: 'DateToFrom',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IDCardIssueNewPlaceName',
        DisplayKey: 'HRM_HR_Rec_Candidate_IDCardPlaceOfIssue',
        DataType: 'string'
    }
    // {
    //     TypeView: 'E_CLUSTER',
    //     Name: 'MethodPaymentView, OrgStructureName, DurationTypeView',
    //     DisplayKey: 'Các khoá huấn luyện'
    // },
];

// eslint-disable-next-line no-unused-vars
const E_POSITIONAPPLIED = [
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_PositionAppliedFor',
        DataType: 'string',
        isCollapse: true
    },
    {
        TypeView: 'E_COMMON',
        Name: '',
        DisplayKey: 'HRM_PortalApp_SuitabilityLevel',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'JobVacancyName',
        DisplayKey: 'HRM_PortalApp_PositionAppliedFor',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SalarySuggest',
        DisplayKey: 'HRM_PortalApp_DesiredSalary',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateStartWorking',
        DisplayKey: 'HRM_PortalApp_AvailableDate',
        DataType: 'DateToFrom',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateApply',
        DisplayKey: 'HRM_PortalApp_ApplicationDate',
        DataType: 'DateToFrom',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Description',
        DisplayKey: 'HRM_PortalApp_ApplicationReason',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PersonalPlan',
        DisplayKey: 'HRM_PortalApp_PostApplicationPlans',
        DataType: 'string'
    }
];

// eslint-disable-next-line no-unused-vars
const E_CONTACT = [
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_Contact',
        DataType: 'string',
        isCollapse: true
    },
    {
        TypeView: 'E_COMMON_LABEL',
        DisplayKey: 'HRM_HR_Profile_ContactInfo',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Mobile',
        DisplayKey: 'HRM_HR_Profile_CellPhone',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Mobile2',
        DisplayKey: 'HRM_PortalApp_AlternatePhoneNumber',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Email',
        DisplayKey: 'Email',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_LABEL',
        DisplayKey: 'HRM_PortalApp_InforContact_PermanentAddress',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PCountryName',
        DisplayKey: 'HRM_PortalApp_Country',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PProvinceName',
        DisplayKey: 'HRM_PortalApp_Province_City',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PDistrictName',
        DisplayKey: 'HRM_PortalApp_District_District',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PWardName',
        DisplayKey: 'HRM_PortalApp_Wards_Wards',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Paddress',
        DisplayKey: 'HRM_PortalApp_Address',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_LABEL',
        DisplayKey: 'HRM_PortalApp_InforContact_TemporaryAddress',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TCountryName',
        DisplayKey: 'HRM_PortalApp_Country',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TProvinceName',
        DisplayKey: 'HRM_PortalApp_Province_City',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TDistrictName',
        DisplayKey: 'HRM_PortalApp_District_District',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TWardName',
        DisplayKey: 'HRM_PortalApp_Wards_Wards',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Taddress',
        DisplayKey: 'HRM_PortalApp_Address',
        DataType: 'string'
    }
];

// eslint-disable-next-line no-unused-vars
const E_QUALIFICATION = [
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_HR_Qualification_QualificationName',
        DataType: 'string',
        isCollapse: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateStart',
        NameSecond: 'DateFinish',
        DisplayKey: 'HRM_PortalApp_TimePeriod',
        DataType: 'DateToFrom',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'StudyProvinceName',
        DisplayKey: 'HRM_PortalApp_LocationOfStudy',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TrainingPlaceName',
        DisplayKey: 'HRM_PortalApp_SchoolName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SubMajorName',
        DisplayKey: 'HRM_PortalApp_Major',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TypeOfEducationView',
        DisplayKey: 'HRM_PortalApp_TrainingType',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'EducationLevelName',
        DisplayKey: 'HRM_PortalApp_AcademicLevel',
        DataType: 'string'
    }
];

// eslint-disable-next-line no-unused-vars
const E_TRAININGCOURSES = [
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_TrainingCourses',
        DataType: 'string',
        isCollapse: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateStart',
        NameSecond: 'DateFinish',
        DisplayKey: 'HRM_PortalApp_TimePeriod',
        DataType: 'DateToFrom',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'StudyProvinceName',
        DisplayKey: 'HRM_PortalApp_SchoolOrganization',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TrainingPlaceName',
        DisplayKey: 'HRM_PortalApp_Major',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SubMajorName',
        DisplayKey: 'HRM_PortalApp_Degree',
        DataType: 'string'
    }
];

// eslint-disable-next-line no-unused-vars
const E_FOREIGNLANGUAGE = [
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_HR_Rec_LanguageTypeIDs',
        DataType: 'string',
        isCollapse: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'LanguageType',
        DisplayKey: 'HRM_PortalApp_LanguageName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'LevelView',
        DisplayKey: 'TaskLevelID',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'LanguageLevel',
        DisplayKey: 'HRM_Language_SpecialLevel',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Mark',
        DisplayKey: 'HRM_PortalApp_Score',
        DataType: 'string'
    }
];

// eslint-disable-next-line no-unused-vars
const E_COMPUTERSKILL = [
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Rec_Candidate_ComputingLevel',
        DataType: 'string',
        isCollapse: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ComputingType',
        DisplayKey: 'HRM_PortalApp_ToolName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Comment',
        DisplayKey: 'HRM_PortalApp_CertificateDescription',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ComputingLevel',
        DisplayKey: 'HRM_Language_SpecialLevel',
        DataType: 'string'
    }
];

// eslint-disable-next-line no-unused-vars
const E_WORKINGEXPERIENCE = [
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_HreCandidateHistory_Title',
        DataType: 'string',
        isCollapse: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateStart',
        NameSecond: 'DateFinish',
        DisplayKey: 'HRM_PortalApp_TimePeriod',
        DataType: 'DateToFrom',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PositionLast',
        DisplayKey: 'HRM_PortalApp_ContractHistory_JobTitle',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CompanyName',
        DisplayKey: 'CompanyName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SalaryLast',
        DisplayKey: 'HRM_PortalApp_Salary',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SupComment',
        DisplayKey: 'HRM_PortalApp_Responsibilities_Achievements',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ResignReason',
        DisplayKey: 'ResignReasonName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SupRelation',
        DisplayKey: 'HRM_PortalApp_ReferenceName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SupPosition',
        DisplayKey: 'HRM_PortalApp_ReferenceJobTitle',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SupMobile',
        DisplayKey: 'HRM_HR_Profile_CellPhone',
        DataType: 'string'
    }
]

const ListScreen = [
    'E_POSITIONAPPLIED',
    'E_CONTACT',
    'E_QUALIFICATION',
    'E_TRAININGCOURSES',
    'E_FOREIGNLANGUAGE',
    'E_COMPUTERSKILL',
    'E_WORKINGEXPERIENCE'
];

export default class HreCandidateProfileViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: [],
            listActions: this.resultListActionHeader(),
            listData: [],
            listConfigAll: []
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
                _configListDetail = ConfigListDetail.value['HreCandidateProfileViewDetail'] ?? configDefault;
            // ConfigListDetail.value = {
            //     ...ConfigListDetail.value,
            //     HreCandidateProfileViewDetail: [
            //         ...configDefault
            //     ],
            //     E_POSITIONAPPLIED: [
            //         ...E_POSITIONAPPLIED
            //     ],
            //     E_CONTACT: [
            //         ...E_CONTACT
            //     ],
            //     E_QUALIFICATION: [
            //         ...E_QUALIFICATION
            //     ],
            //     E_TRAININGCOURSES: [
            //         ...E_TRAININGCOURSES
            //     ],
            //     E_FOREIGNLANGUAGE: [
            //         ...E_FOREIGNLANGUAGE
            //     ],
            //     E_COMPUTERSKILL: [
            //         ...E_COMPUTERSKILL
            //     ],
            //     E_WORKINGEXPERIENCE: [
            //         ...E_WORKINGEXPERIENCE
            //     ]
            // }

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.CandidateProfileID;

            if (id) {
                const api = {
                    'E_POSITIONAPPLIED': HttpService.Get(
                        `[URI_CENTER]/api/Rec_CandidateProfile/GetCandidateByCandidateProfileId?ID=${id}`
                    ),
                    'E_CONTACT': HttpService.Get(
                        `[URI_CENTER]/api/Rec_CandidateProfile/GetDetailCandidateProfileContactById?ID=${id}`
                    ),
                    'E_QUALIFICATION': HttpService.Get(
                        `[URI_CENTER]/api/Rec_CandidateProfile/GetCandidateQualificationByCandidateProfileId?ID=${id}`
                    ),
                    'E_TRAININGCOURSES': HttpService.Get(
                        `[URI_CENTER]/api/Rec_CandidateProfile/GetCandidateTrainingCourseByCandidateProfileID?ID=${id}`
                    ),
                    'E_FOREIGNLANGUAGE': HttpService.Get(
                        `[URI_CENTER]/api/Rec_CandidateProfile/GetCandidateLanguageLevelByCandidateProfileID?ID=${id}`
                    ),
                    'E_COMPUTERSKILL': HttpService.Get(
                        `[URI_CENTER]/api/Rec_CandidateProfile/GetCandidateComputingLevelByCandidateProfileID?ID=${id}`
                    ),
                    'E_WORKINGEXPERIENCE': HttpService.Get(
                        `[URI_CENTER]/api/Rec_CandidateProfile/GetCandidateHistoryByCandidateProfileID?ID=${id}`
                    )
                }
                let listRequest = [
                        HttpService.Get(
                            `[URI_CENTER]/api/Rec_CandidateProfile/GetCandidateProfileForViewDetailById?ID=${id}`
                        )
                    ],
                    listConfigAndData = [
                        {
                            [`${screenName}`]: [
                                ..._configListDetail
                            ],
                            data: {}
                        }
                    ];


                ListScreen.map((item) => {
                    if (ConfigListDetail.value[item]) {
                        listConfigAndData = [
                            ...listConfigAndData,
                            {
                                [`${item}`]: [
                                    ...ConfigListDetail.value[item]
                                ],
                                data: {}
                            }
                        ];
                        listRequest = [
                            ...listRequest,
                            api[item]
                        ]
                    }
                });

                const resAll = await HttpService.MultiRequest(listRequest);


                if (!Array.isArray(resAll) || resAll.length !== listRequest.length) {
                    this.setState({ dataItem: 'EmptyData' });
                    return;
                }

                resAll.map((res, index) => {
                    if (res && res.Status == EnumName.E_SUCCESS && Array.isArray(res?.Data) && res?.Data.length > 0) {
                        listConfigAndData[index].data = {
                            ...dataItem,
                            ...listConfigAndData[index].data,
                            ...res?.Data[0]
                        }
                    }
                });


                const getDetailConfig = await Vnr_Function.HandleConfigListDetailATT(
                    _configListDetail,
                    'Detail_List_Overtime'
                );

                const _listActions = await this.rowActionsHeaderRight(dataItem);


                this.setState({ configListDetail: getDetailConfig, dataItem: dataItem, listActions: _listActions, listData: listConfigAndData });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    reload = (actionIsDelete) => {
        const { reloadScreenList } = this.props.navigation.state.params;

        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');

        //nếu action = Delete => back về danh sách
        if (actionIsDelete) {
            DrawerServices.navigate('HrePendingProcessingCandidateApplications');
        } else {
            this.setState({ dataItem: null }, () => {
                this.getDataItem(true);
            });
        }
    };

    componentDidMount() {
        // HrePendingProcessingCandidateApplicationsBusiness.setThisForBusiness(this);
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, listActions, listData } = this.state,
            { containerItemDetail, contentScroll, bottomActions } = styleScreenDetail;


        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={contentScroll} showsVerticalScrollIndicator={false}>
                        <View style={containerItemDetail}>
                            {
                                listData.map((item, index) => {
                                    const [config, data] = Object.values(item);

                                    if (!Array.isArray(config) || !data)
                                        return null;
                                    return <ItemViewDetail props={{ config, data }} key={index} />
                                })
                            }
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
