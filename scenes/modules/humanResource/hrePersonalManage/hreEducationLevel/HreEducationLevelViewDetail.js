import React, { Component } from 'react';
import { View, ScrollView, Text } from 'react-native';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    styleViewDetailHumanResource
} from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import { translate } from '../../../../../i18n/translate';

const configDefault = [
    {
        TypeView: 'E_GROUP_PROFILE',
        DisplayKey: 'ProfileNameViewNew',
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
        DisplayKey: 'HRM_HR_Profile_OrgStructureName',
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
        Name: 'JobTitleName',
        DisplayKey: 'HRM_HR_Profile_JobTitleName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'PositionName',
        DisplayKey: 'HRM_HR_Profile_PositionName',
        DataType: 'string'
    }
];

const configDefaultEducationLevel = [
    // {
    //     "TypeView": "E_GROUP",
    //     "DisplayKey": "HRM_PortalApp_HreEducationLevel",
    //     "DataType": "string"
    // },
    {
        TypeView: 'E_COMMON',
        Name: 'EducationLevelName',
        DisplayKey: 'HRM_PortalApp_HreEducationLevel_Education',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CatQualificationName',
        DisplayKey: 'HRM_PortalApp_HreEducationLevel_QualificationLevel',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SpecialLevelName',
        DisplayKey: 'HRM_PortalApp_HreEducationLevel_Level',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TrainingTypeView',
        DisplayKey: 'HRM_PortalApp_HreEducationLevel_TrainingSystem',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'FieldOfTraining',
        DisplayKey: 'HRM_PortalApp_HreEducationLevel_MainSpecialization',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TrainingPlace',
        DisplayKey: 'HRM_PortalApp_HreEducationLevel_TrainingPlace',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CertificateName',
        DisplayKey: 'HRM_PortalApp_HreEducationLevel_Certificate',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Rank',
        DisplayKey: 'HRM_PortalApp_HreEducationLevel_Grade',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'GraduationDate',
        DisplayKey: 'HRM_PortalApp_HreEducationLevel_GraduationDate',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lsFileAttach',
        DisplayKey: 'HRM_PortalApp_HreEducationLevel_Scan',
        DataType: 'FileAttach'
    }
];

const configDefaultComputingLevel = [
    // {
    //     "TypeView": "E_GROUP",
    //     "DisplayKey": "HRM_PortalApp_HreEducationLevel_ComputingLevel",
    //     "DataType": "string"
    // },
    {
        TypeView: 'E_COMMON',
        Name: 'SpecialTypeName',
        DisplayKey: 'HRM_PortalApp_HreEducationLevel_SkillType',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'MainExpertise',
        DisplayKey: 'HRM_PortalApp_HreEducationLevel_MainSpecialization',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Grade',
        DisplayKey: 'HRM_PortalApp_HreEducationLevel_Grade',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TrainingPlace',
        DisplayKey: 'HRM_PortalApp_HreEducationLevel_TrainingPlace',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TrainingAddress',
        DisplayKey: 'HRM_PortalApp_Address',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateOfIssue',
        DisplayKey: 'HRM_PortalApp_HreEducationLevel_IssueDate',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lsFileAttach',
        DisplayKey: 'HRM_PortalApp_HreEducationLevel_Scan',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Comment',
        DisplayKey: 'Note',
        DataType: 'string'
    }
];

export default class HreEducationLevelViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            configListDetailEducationLevel: null,
            configListDetailComputingLevel: null
        };
    }

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[ScreenName.HreEducationLevelViewDetail]
                    ? ConfigListDetail.value[ScreenName.HreEducationLevelViewDetail]
                    : configDefault,
                _configListDetailEducationLevel = ConfigListDetail.value[
                    ScreenName.HreEducationLevelViewDetailEducationLevel
                ]
                    ? ConfigListDetail.value[ScreenName.HreEducationLevelViewDetailEducationLevel]
                    : configDefaultEducationLevel,
                _configListDetailComputingLevel = ConfigListDetail.value[
                    ScreenName.HreEducationLevelViewDetailComputingLevel
                ]
                    ? ConfigListDetail.value[ScreenName.HreEducationLevelViewDetailComputingLevel]
                    : configDefaultComputingLevel;

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem?.ID;
            if (id) {
                const dataBody = {
                    ProfileID: id
                };

                const response = await HttpService.Post(
                    '[URI_CENTER]/api/Hre_AcademicLevel/New_GetDetailDataProfileAcademicLevel',
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
                        Array.isArray(data?.ListProfileQualificationDetail) &&
                        data?.ListProfileQualificationDetail.length > 0
                    ) {
                        data?.ListProfileQualificationDetail.forEach(element => {
                            element.lsFileAttach = ManageFileSevice.setFileAttachApp(element?.FileAttach);
                        });
                    }

                    if (
                        Array.isArray(data?.ListProfileComputingLevelDetailModel) &&
                        data?.ListProfileComputingLevelDetailModel.length > 0
                    ) {
                        data?.ListProfileComputingLevelDetailModel.forEach(element => {
                            element.lsFileAttach = ManageFileSevice.setFileAttachApp(element?.FileAttach);
                        });
                    }

                    this.setState({
                        configListDetail: _configListDetail,
                        dataItem: data,
                        configListDetailEducationLevel: _configListDetailEducationLevel,
                        configListDetailComputingLevel: _configListDetailComputingLevel
                    });
                } else {
                    this.setState({ dataItem: 'EmptyData' });
                }
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                this.setState({
                    configListDetail: _configListDetail,
                    dataItem,
                    configListDetailEducationLevel: _configListDetailEducationLevel,
                    configListDetailComputingLevel: _configListDetailComputingLevel
                });
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
        const {
                dataItem,
                configListDetail,
                configListDetailComputingLevel,
                configListDetailEducationLevel
            } = this.state,
            { containerItemDetail, contentScroll } = styleScreenDetail;

        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail && configListDetailComputingLevel && configListDetailEducationLevel) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={contentScroll} showsVerticalScrollIndicator={false}>
                        <View style={containerItemDetail}>
                            {configListDetail.map(e => {
                                if (e.TypeView != 'E_COMMON_PROFILE')
                                    return Vnr_Function.formatStringTypeV3(dataItem, e, configListDetail);
                            })}
                        </View>
                        {Array.isArray(dataItem?.ListProfileQualificationDetail) &&
                            dataItem?.ListProfileQualificationDetail.length > 0 &&
                            dataItem?.ListProfileQualificationDetail.map((item, index) => {
                                return (
                                    <View style={contentScroll}>
                                        {index !== 0 ? (
                                            <View style={styleViewDetailHumanResource.wrapLine}>
                                                <View style={styleViewDetailHumanResource.line} />
                                            </View>
                                        ) : (
                                            <View style={styleViewDetailHumanResource.container}>
                                                <Text style={[styleSheets.lable, { marginLeft: 6 }]}>
                                                    {`${translate(['HRM_Rec_JobVacancy_EducationLevelIDs'])}`}
                                                </Text>
                                            </View>
                                        )}
                                        <View style={containerItemDetail}>
                                            {configListDetailEducationLevel.map(e => {
                                                return Vnr_Function.formatStringTypeV3(
                                                    item,
                                                    e,
                                                    configListDetailEducationLevel
                                                );
                                            })}
                                        </View>
                                    </View>
                                );
                            })}
                        {Array.isArray(dataItem?.ListProfileComputingLevelDetailModel) &&
                            dataItem?.ListProfileComputingLevelDetailModel.length > 0 &&
                            dataItem?.ListProfileComputingLevelDetailModel.map((item, index) => {
                                return (
                                    <View style={contentScroll}>
                                        {index !== 0 ? (
                                            <View style={styleViewDetailHumanResource.wrapLine}>
                                                <View style={styleViewDetailHumanResource.line} />
                                            </View>
                                        ) : (
                                            <View style={styleViewDetailHumanResource.container}>
                                                <Text style={[styleSheets.lable, { marginLeft: 6 }]}>
                                                    {translate(['HRM_PortalApp_HreEducationLevel'])}
                                                </Text>
                                            </View>
                                        )}
                                        <View style={containerItemDetail}>
                                            {configListDetailComputingLevel.map(e => {
                                                return Vnr_Function.formatStringTypeV3(
                                                    item,
                                                    e,
                                                    configListDetailComputingLevel
                                                );
                                            })}
                                        </View>
                                    </View>
                                );
                            })}
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
