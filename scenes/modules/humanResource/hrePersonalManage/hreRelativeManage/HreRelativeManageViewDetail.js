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
        DisplayKey: 'HRM_Hre_Relatives_TabStripRelative',
        DataType: 'string'
    },
    {
        Name: 'StatusView',
        DisplayKey: 'HRM_Attendance_LateEarlyAllowed_Status',
        DataType: 'status'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'RelativeName',
        DisplayKey: 'RelativeName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'RelativeTypeName',
        DisplayKey: 'RelativeTypeName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateOfWedding',
        DisplayKey: 'HRM_HRE_Relatives_DateOfWedding',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY',
        IsNullOrEmpty: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'GenderView',
        DisplayKey: 'GenderView',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'YearOfBirthDatetime',
        DisplayKey: 'DateOfBirth',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'YearOfLose',
        DisplayKey: 'YearOfLose',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY',
        IsNullOrEmpty: true
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PhoneNumber',
        DisplayKey: 'Hre_SignatureRegister_owner_mobile',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'StudyingSchools',
        DisplayKey: 'TypeRelatives__E_CONFIRMSTUDYING',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lstFileAttach',
        DisplayKey: 'Attachment',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Notes',
        DisplayKey: 'HRM_Category_Cat_HRPlanningPeriod_Note',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CountryName',
        DisplayKey: 'CountryName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IdentifierNumber',
        DisplayKey: 'HRM_HRE_Relatives_IdentificationNumber',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'EthnicGroupName',
        DisplayKey: 'ProfileEthnicGroupName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TypeOfDocument',
        DisplayKey: 'HRM_PortalApp_Relatives_TypeDocument',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IDNo',
        DisplayKey: 'eBHXHD02TSGiamCol74',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IDDateOfIssue',
        DisplayKey: 'HRM_HR_Profile_IDDateOfIssue',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ProvinceName',
        DisplayKey: 'Rec_CandidateProfile_PlaceOfIssueNewID',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IDDateOfExpiry',
        DisplayKey: 'HRM_PortalApp_IDExpiryDate',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IDCardNo',
        DisplayKey: 'HRM_HRE_Relatives_IdentificationNo',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateOfIssuanceOfIdentityCard',
        DisplayKey: 'HRM_HR_Rec_Candidate_IDCardDateOfIssue',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'IDCardIssuePlaceName',
        DisplayKey: 'HRM_HRE_Relatives_PlaceOfIssuanceOfIdentityCard',
        DataType: 'string'
    },
    {
        Name: 'ExpiryDateOfIdentityCard',
        DisplayKey: 'HRM_HR_IDCardDateOfExpiry',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'RelativesPassportNo',
        DisplayKey: 'HRM_HR_Profile_PassportNo',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'RelativesPassportDateOfIssue',
        DisplayKey: 'HRM_HR_Profile_PassportDateOfIssue',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PassportIssuePlaceName',
        DisplayKey: 'HRM_HR_Profile_PassportPlaceOfIssue',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'RelativesPassportDateOfExpiry',
        DisplayKey: 'HRM_HR_Profile_PassportDateOfExpiry',
        DataType: 'datetime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Career',
        DisplayKey: 'HRM_HR_Relatives_Career',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PAddress',
        DisplayKey: 'HRM_Hre_Relatives_AddressPermanent',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TAddress',
        DisplayKey: 'HRM_Hre_Relatives_AddressTemporary',
        DataType: 'string'
    }
];

// SpecializationName,Loại thử việc(check lại)
// các field chưa có

export default class HreRelativeManageViewDetail extends Component {
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
                    ConfigListDetail.value[ScreenName.HreRelativeManageViewDetail] != null
                        ? ConfigListDetail.value[ScreenName.HreRelativeManageViewDetail]
                        : configDefault;
            let id = dataItem.ProfileID ? dataItem.ProfileID : dataItem.ID;
            if (id) {
                const dataBody = {
                    RelativeID: id
                };
                const response = await HttpService.Post(
                    '[URI_CENTER]/api/Hre_Relatives/New_GetDetailDataProfileRelatives',
                    dataBody,
                    null,
                    this.reload
                );
                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = {
                        ...dataItem,
                        ...response.Data
                    };
                    if (response.Data['RelativesDetail'] && response.Data['RelativesDetail'][0]) {
                        data = {
                            ...data,
                            ...response.Data['RelativesDetail'][0]
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
