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
import Vnr_Services from '../../../../../utils/Vnr_Services';
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
            Name: 'E_COMPANY',
            DisplayKey: '',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON_PROFILE',
            Name: 'E_BRANCH',
            DisplayKey: '',
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
            Name: 'E_SECTION',
            DisplayKey: '',
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
    ],
    configDefaultSocialInsurance = [
        {
            TypeView: 'E_COMMON',
            Name: 'SocialInsNo',
            DisplayKey: 'HRM_PortalApp_SocialInsBookNo',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'SocialInsIssueDate',
            DisplayKey: 'HRM_PortalApp_SocialInsIssueDate',
            DataType: 'datetime',
            DataFormat: 'DD/MM/YYYY'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'SocialInsIssuePlace',
            DisplayKey: 'HRM_PortalApp_SocialInsJoiningDate',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'ProvinceName',
            DisplayKey: 'HRM_PortalApp_ProvinceOfInsurance',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'SocialInsNote',
            DisplayKey: 'Note',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'SocialInsNoStatus',
            DisplayKey: 'HRM_PortalApp_SocialInsNoStatus',
            DataType: 'string'
        }
    ],
    configDefaultHealthInsurance = [
        {
            TypeView: 'E_COMMON',
            Name: 'HealthInsNo',
            DisplayKey: 'HRM_PortalApp_HealthInsNo',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'HealthTreatmentPlaceName',
            DisplayKey: 'HRM_PortalApp_HealthTreatmentPlace',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'FormatHealthInsIssueDate',
            DisplayKey: 'HRM_PortalApp_HealthInsExpirtyDate',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'HealthTreatmentProvinceCode',
            DisplayKey: 'HRM_PortalApp_ProvinceCodeOfHospital',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'HealthTreatmentPlaceCode',
            DisplayKey: 'HRM_PortalApp_CodeOfRegisteredHospital',
            DataType: 'string'
        }
    ],
    configDefaultUnemploymentInsurance = [
        {
            TypeView: 'E_COMMON',
            Name: 'FormatUnEmpInsDateReg',
            DisplayKey: 'HRM_PortalApp_UnempInsJoiningDate',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'CommentIns',
            DisplayKey: 'Note',
            DataType: 'string'
        }
    ];

// SpecializationName,Loại thử việc(check lại)
// các field chưa có

export default class HreInsuranceManageViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            configListDetailHealthInsurance: null,
            configListDetailUnemploymentInsurance: null
        };
    }

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail =
                    ConfigListDetail.value[ScreenName.HreInsuranceManageViewDetail] != null
                        ? ConfigListDetail.value[ScreenName.HreInsuranceManageViewDetail]
                        : configDefault,
                _configListDetailHealthInsurance =
                    ConfigListDetail.value[ScreenName.HreInsuranceManageViewDetailHealthInsurance] != null
                        ? ConfigListDetail.value[ScreenName.HreInsuranceManageViewDetailHealthInsurance]
                        : configDefaultHealthInsurance,
                _configListDetailSocialInsurance =
                    ConfigListDetail.value[ScreenName.HreInsuranceManageViewDetailSocialInsurance] != null
                        ? ConfigListDetail.value[ScreenName.HreInsuranceManageViewDetailSocialInsurance]
                        : configDefaultSocialInsurance,
                _configListDetailUnemploymentInsurance =
                    ConfigListDetail.value[ScreenName.HreInsuranceManageViewDetailUnemploymentInsurance] != null
                        ? ConfigListDetail.value[ScreenName.HreInsuranceManageViewDetailUnemploymentInsurance]
                        : configDefaultUnemploymentInsurance;
            let id = dataItem.ProfileID ? dataItem.ProfileID : dataItem.ID;
            if (id) {
                const dataBody = {
                    ProfileID: id
                };
                const response = await HttpService.Post(
                    '[URI_CENTER]/api/Hre_ProfileAPI/New_GetProfileInsuranceDetailPortal',
                    dataBody,
                    null,
                    this.reload
                );
                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = {
                        ...dataItem,
                        ...response.Data
                    };

                    data.itemStatus = Vnr_Services.formatStyleStatusApp(data.Status);
                    data.lstFileAttach = ManageFileSevice.setFileAttachApp(data.FileAttach);
                    this.setState({
                        configListDetail: _configListDetail,
                        dataItem: data,
                        configListDetailHealthInsurance: _configListDetailHealthInsurance,
                        configListDetailSocialInsurance: _configListDetailSocialInsurance,
                        configListDetailUnemploymentInsurance: _configListDetailUnemploymentInsurance
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
                configListDetailHealthInsurance,
                configListDetailSocialInsurance,
                configListDetailUnemploymentInsurance
            } = this.state,
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
                        {Array.isArray(dataItem?.SocialInsurance) &&
                            dataItem?.SocialInsurance.length > 0 &&
                            dataItem?.SocialInsurance.map((item, index) => {
                                return (
                                    <View style={contentScroll}>
                                        {index !== 0 ? (
                                            <View style={styleViewDetailHumanResource.wrapLine}>
                                                <View style={styleViewDetailHumanResource.line} />
                                            </View>
                                        ) : (
                                            <View style={styleViewDetailHumanResource.container}>
                                                <Text style={[styleSheets.lable, { marginLeft: 6 }]}>
                                                    {`${translate(['HRM_PortalApp_SocialInsurance'])}`}
                                                </Text>
                                            </View>
                                        )}
                                        <View style={containerItemDetail}>
                                            {configListDetailSocialInsurance.map(e => {
                                                return Vnr_Function.formatStringTypeV3(
                                                    item,
                                                    e,
                                                    configListDetailSocialInsurance
                                                );
                                            })}
                                        </View>
                                    </View>
                                );
                            })}
                        {Array.isArray(dataItem?.HealthInsurance) &&
                            dataItem?.HealthInsurance.length > 0 &&
                            dataItem?.HealthInsurance.map((item, index) => {
                                return (
                                    <View style={contentScroll}>
                                        {index !== 0 ? (
                                            <View style={styleViewDetailHumanResource.wrapLine}>
                                                <View style={styleViewDetailHumanResource.line} />
                                            </View>
                                        ) : (
                                            <View style={styleViewDetailHumanResource.container}>
                                                <Text style={[styleSheets.lable, { marginLeft: 6 }]}>
                                                    {translate(['HRM_PortalApp_HealthInsurance'])}
                                                </Text>
                                            </View>
                                        )}
                                        <View style={containerItemDetail}>
                                            {configListDetailHealthInsurance.map(e => {
                                                return Vnr_Function.formatStringTypeV3(
                                                    item,
                                                    e,
                                                    configListDetailHealthInsurance
                                                );
                                            })}
                                        </View>
                                    </View>
                                );
                            })}
                        {Array.isArray(dataItem?.UnemploymentInsurance) &&
                            dataItem?.UnemploymentInsurance.length > 0 &&
                            dataItem?.UnemploymentInsurance.map((item, index) => {
                                return (
                                    <View style={contentScroll}>
                                        {index !== 0 ? (
                                            <View style={styleViewDetailHumanResource.wrapLine}>
                                                <View style={styleViewDetailHumanResource.line} />
                                            </View>
                                        ) : (
                                            <View style={styleViewDetailHumanResource.container}>
                                                <Text style={[styleSheets.lable, { marginLeft: 6 }]}>
                                                    {translate(['HRM_PortalApp_UnemploymentInsurance'])}
                                                </Text>
                                            </View>
                                        )}
                                        <View style={containerItemDetail}>
                                            {configListDetailUnemploymentInsurance.map(e => {
                                                return Vnr_Function.formatStringTypeV3(
                                                    item,
                                                    e,
                                                    configListDetailUnemploymentInsurance
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
