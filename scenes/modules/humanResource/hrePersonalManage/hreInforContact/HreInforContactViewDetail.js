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
        Name: 'E_TEAM',
        DisplayKey: 'Group',
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
        Name: 'JobTitleName',
        DisplayKey: 'HRM_HR_Profile_JobTitleName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'PositionName',
        DisplayKey: 'HRM_HR_Profile_PositionName',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_Contact',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Email2',
        DisplayKey: 'HRM_PortalApp_InforContact_EmailPersonal',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Email',
        DisplayKey: 'HRM_PortalApp_InforContact_EmailCompany',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Cellphone',
        DisplayKey: 'HRM_PortalApp_InforContact_PhoneNumber',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_InforContact_EmergencyContactInformation',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'NameContactForEmergency',
        DisplayKey: 'HRM_PortalApp_InforContact_NameContacter',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CellPhoneForEmergency',
        DisplayKey: 'HRM_PortalApp_InforContact_PhoneNumberContacter',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Relationship1Name',
        DisplayKey: 'HRM_PortalApp_InforContact_Relationship',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'AddressEmergency',
        DisplayKey: 'HRM_PortalApp_InforContact_Address',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_InforContact_EmergencyContactInformation2',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'NameForSecondaryEmergency',
        DisplayKey: 'HRM_PortalApp_InforContact_NameContacter2',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CellPhoneForSecondaryEmergency',
        DisplayKey: 'HRM_PortalApp_InforContact_PhoneNumberContacter2',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Relationship2Name',
        DisplayKey: 'HRM_PortalApp_InforContact_Relationship2',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'AddressSecondaryEmergency',
        DisplayKey: 'HRM_PortalApp_InforContact_Address2',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_InforContact_PermanentResidentAddress',
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
        DisplayKey: 'HRM_PortalApp_Province',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PDistrictName',
        DisplayKey: 'HRM_PortalApp_District',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'VillageName',
        DisplayKey: 'HRM_PortalApp_Village',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PAddress',
        DisplayKey: 'HRM_PortalApp_Address',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lsPAttachFile',
        DisplayKey: 'HRM_PortalApp_PermanentAttachFile',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_GROUP',
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
        DisplayKey: 'HRM_PortalApp_Province',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TDistrictName',
        DisplayKey: 'HRM_PortalApp_District',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TAVillageName',
        DisplayKey: 'HRM_PortalApp_Village',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TAddress',
        DisplayKey: 'HRM_PortalApp_Address',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lsTAttachFile',
        DisplayKey: 'HRM_PortalApp_TemporaryAttachFile',
        DataType: 'FileAttach'
    }
];

// SpecializationName,Loại thử việc(check lại)
// các field chưa có

export default class HreInforContactViewDetail extends Component {
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
                _configListDetail = ConfigListDetail.value[ScreenName.HreInforContactViewDetail]
                    ? ConfigListDetail.value[ScreenName.HreInforContactViewDetail]
                    : configDefault;
            let id = dataItem.ProfileID ? dataItem.ProfileID : dataItem.ID;
            if (id) {
                const dataBody = {
                    ProfileID: id
                };
                const response = await HttpService.Post(
                    '[URI_CENTER]/api/Hre_ProfileAPI/New_GetProfileContactDetailPortal',
                    dataBody,
                    null,
                    this.reload
                );
                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = {
                        ...dataItem,
                        ...response.Data
                    };

                    if (response?.Data?.PCountryContact && response?.Data?.PCountryContact[0]) {
                        data = {
                            ...data,
                            ...response?.Data?.PCountryContact[0]
                        };
                    }

                    if (response?.Data?.RegionContact && response?.Data?.RegionContact[0]) {
                        data = {
                            ...data,
                            ...response?.Data?.RegionContact[0]
                        };
                    }

                    if (response?.Data?.RegionEmergency2Contact && response?.Data?.RegionEmergency2Contact[0]) {
                        data = {
                            ...data,
                            ...response?.Data?.RegionEmergency2Contact[0]
                        };
                    }

                    if (response?.Data?.RegionEmergencyContact && response?.Data?.RegionEmergencyContact[0]) {
                        data = {
                            ...data,
                            ...response?.Data?.RegionEmergencyContact[0]
                        };
                    }

                    if (response?.Data?.TCountryContact && response?.Data?.TCountryContact[0]) {
                        data = {
                            ...data,
                            ...response?.Data?.TCountryContact[0]
                        };
                    }

                    data.lsPAttachFile = ManageFileSevice.setFileAttachApp(data.PAttachFile);
                    data.lsTAttachFile = ManageFileSevice.setFileAttachApp(data.TAttachFile);

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
