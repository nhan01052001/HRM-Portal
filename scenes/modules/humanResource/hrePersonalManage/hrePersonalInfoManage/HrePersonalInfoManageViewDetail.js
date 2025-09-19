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
        Name: 'E_COMPANY',
        DisplayKey: 'HRM_Hre_SignatureRegister_E_COMPANY',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_BRANCH',
        DisplayKey: 'HRM_Hre_SignatureRegister_E_BRANCH',
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
        Name: 'E_DEPARTMENT',
        DisplayKey: 'HRM_Hre_SignatureRegister_E_DEPARTMENT',
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
        DisplayKey: 'HRM_HR_Information',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateHire',
        DisplayKey: 'HRM_HR_Profile_DateHire',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CodeAttendance',
        DisplayKey: 'HRM_HR_Profile_CodeAttendance',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CodeTax',
        DisplayKey: 'ProfileCodeTax',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateSenior',
        DisplayKey: 'HRM_HR_Profile_DateSenior',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateStartProbation',
        NameSecond: 'DateEndProbation',
        DisplayKey: 'HRM_HR_Profile_ProbationTime',
        DataType: 'DateToFrom',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ProbationDuration',
        DisplayKey: 'HRM_HR_Profile_ProbationDays',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'OrgStructureName',
        DisplayKey: 'HRM_HR_Profile_OrgStructureName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'WorkPlaceName',
        DisplayKey: 'HRM_Rec_JobVacancy_WorkPlaceName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateOfBirth',
        DisplayKey: 'HRM_HR_Profile_DayOfBirth',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PositionName',
        DisplayKey: 'HRM_HR_Profile_PositionName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'JobTitleName',
        DisplayKey: 'HRM_HR_Profile_JobTitleName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SalaryClassName',
        DisplayKey: 'Ngạch lương',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'EducationLevelName',
        DisplayKey: 'HRM_EducationLevel_NameEntityName',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'EducationLevelFile',
        DisplayKey: 'HRM_Hre_ProfileMoreInfoEducationFileAttach',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Specialization',
        DisplayKey: 'HRM_Category_Position_SubMajorID',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'SpecializationFile',
        DisplayKey: 'HRM_Hre_ProfileMoreInfoSpecializationFileAttach',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'MarriageStatusView',
        DisplayKey: 'HRM_HR_Profile_MarriageStatus',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'MarriageStatusFile',
        DisplayKey: 'HRM_Hre_ProfileMoreInfoMarriageFileAttach',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Origin',
        DisplayKey: 'HRM_HR_Profile_Origin',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'NationalityName',
        DisplayKey: 'HRM_HR_Profile_NationalityName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'EthnicGroupName',
        DisplayKey: 'HRM_HR_Profile_EthnicGroupName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ReligionName',
        DisplayKey: 'HRM_HR_Profile_ReligionName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PlaceOfBirthName',
        DisplayKey: 'HRM_HR_Profile_PlaceOfBirth',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DayOfAnnualLeave',
        DisplayKey: 'HRM_HR_Contract_DayOfAnnualLeave',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SupervisorName',
        DisplayKey: 'HRM_HR_Profile_SupervisiorID',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'MidSupervisorName',
        DisplayKey: 'HRM_HR_Profile_MidSupervisorID',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'NextSupervisorName',
        DisplayKey: 'HRM_HR_Profile_NextSupervisorID',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'HighSupervisorName',
        DisplayKey: 'HRM_HR_Profile_HighSupervisiorID',
        DataType: 'string'
    }
];

// SpecializationName,Loại thử việc(check lại)
// các field chưa có

export default class HrePersonalInfoManageViewDetail extends Component {
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
                _configListDetail =
                    ConfigListDetail.value[ScreenName.HrePersonalInfoManageViewDetail] != null
                        ? ConfigListDetail.value[ScreenName.HrePersonalInfoManageViewDetail]
                        : configDefault;

            let id = dataItem.ProfileID ? dataItem.ProfileID : dataItem.ID;
            if (id) {
                const dataBody = {
                    ProfileID: id
                };
                const response = await HttpService.Post(
                    '[URI_CENTER]/api/Hre_ProfileAPI/GetProfileDetailPortalByID',
                    dataBody,
                    null,
                    this.reload
                );
                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = {
                        ...dataItem,
                        ...response.Data
                    };
                    if (
                        response.Data['New_Hre_ProfilePersonalDetailModel'] &&
                        response.Data['New_Hre_ProfilePersonalDetailModel'][0]
                    ) {
                        data = {
                            ...data,
                            ...response.Data['New_Hre_ProfilePersonalDetailModel'][0]
                        };
                    }

                    //data.itemStatus = Vnr_Services.formatStyleStatusApp(data.WorkListStatus);
                    data.EducationLevelFile = ManageFileSevice.setFileAttachApp(data.EducationLevelFile);
                    data.SpecializationFile = ManageFileSevice.setFileAttachApp(data.SpecializationFile);
                    data.MarriageStatusFile = ManageFileSevice.setFileAttachApp(data.FileAttach);
                    this.setState({ configListDetail: _configListDetail, dataItem: data });
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
