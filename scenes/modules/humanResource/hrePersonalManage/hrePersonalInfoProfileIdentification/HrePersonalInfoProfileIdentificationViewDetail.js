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
        },
        {
            TypeView: 'E_GROUP',
            DisplayKey: 'HRM_PortalApp_HrePersonalInfoProfileIdentification_IDCard',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'IDCard',
            DisplayKey: 'HRM_PortalApp_HrePersonalInfoProfileIdentification_CardNumber',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'IDCardIssuePlaceName',
            DisplayKey: 'HRM_PortalApp_HrePersonalInfoProfileIdentification_PlaceOfIssueCard',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'IDDateOfIssue',
            DisplayKey: 'HRM_PortalApp_HrePersonalInfoProfileIdentification_DateOfIssueCard',
            DataType: 'datetime',
            DataFormat: 'DD/MM/YYYY'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'IDDateOfExpired',
            DisplayKey: 'HRM_PortalApp_HrePersonalInfoProfileIdentification_DateOfExpiryCard',
            DataType: 'datetime',
            DataFormat: 'DD/MM/YYYY'
        },
        {
            TypeView: 'E_FILEATTACH',
            Name: 'lsScannedCopyOfIDNo',
            DisplayKey: 'HRM_PortalApp_HrePersonalInfoProfileIdentification_IdentificationCardScan',
            DataType: 'FileAttach'
        },
        {
            TypeView: 'E_GROUP',
            DisplayKey: 'HRM_PortalApp_HrePersonalInfoProfileIdentification_CMND',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'IDNo',
            DisplayKey: 'HRM_PortalApp_HrePersonalInfoProfileIdentification_IDNo',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'PlaceOfIssueName',
            DisplayKey: 'HRM_PortalApp_HrePersonalInfoProfileIdentification_PlaceOfIssue',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'IDCardDateOfIssue',
            DisplayKey: 'HRM_PortalApp_HrePersonalInfoProfileIdentification_DateOfIssue',
            DataType: 'datetime',
            DataFormat: 'DD/MM/YYYY'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'IDCardDateOfExpiry',
            DisplayKey: 'HRM_PortalApp_HrePersonalInfoProfileIdentification_DateExpired',
            DataType: 'datetime',
            DataFormat: 'DD/MM/YYYY'
        },
        {
            TypeView: 'E_FILEATTACH',
            Name: 'lsScannedCopyOfIDCard',
            DisplayKey: 'HRM_PortalApp_HrePersonalInfoProfileIdentification_IdentificationCardScan',
            DataType: 'FileAttach'
        },
        {
            TypeView: 'E_GROUP',
            DisplayKey: 'HRM_PortalApp_HrePersonalInfoProfileIdentification_Passport',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'PassportNo',
            DisplayKey: 'HRM_PortalApp_HrePersonalInfoProfileIdentification_IDPassport',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'PassportPlaceNewName',
            DisplayKey: 'HRM_PortalApp_HrePersonalInfoProfileIdentification_PassportIssuePlace',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'PassportDateOfIssue',
            DisplayKey: 'HRM_PortalApp_HrePersonalInfoProfileIdentification_DateExpiredPassport',
            DataType: 'datetime',
            DataFormat: 'DD/MM/YYYY'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'PassportDateOfExpiry',
            DisplayKey: 'HRM_PortalApp_HrePersonalInfoProfileIdentification_DateExpiredPassport',
            DataType: 'datetime',
            DataFormat: 'DD/MM/YYYY'
        },
        {
            TypeView: 'E_FILEATTACH',
            Name: 'lsPassportAttachment',
            DisplayKey: 'HRM_PortalApp_HrePersonalInfoProfileIdentification_PassportScanCopy',
            DataType: 'FileAttach'
        }
    ],
    configDefaultResident = [
        {
            TypeView: 'E_COMMON',
            Name: 'DecisionNo',
            DisplayKey: 'HRM_PortalApp_ResidenceCardNumber',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'DateAllocated',
            DisplayKey: 'HRM_PortalApp_ResidenceCardIssueDate',
            DataType: 'datetime',
            DataFormat: 'DD/MM/YYYY'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'ResidenceCardDateStart',
            DisplayKey: 'HRM_PortalApp_ResidenceCardEffectiveDate',
            DataType: 'datetime',
            DataFormat: 'DD/MM/YYYY'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'ResidenceCardDateEnd',
            DisplayKey: 'HRM_PortalApp_ResidenceCardExpirationDate',
            DataType: 'datetime',
            DataFormat: 'DD/MM/YYYY'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'ResidenceCardNote',
            DisplayKey: 'Notes',
            DataType: 'string'
        },
        {
            TypeView: 'E_FILEATTACH',
            Name: 'lsFileAttachResident',
            DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
            DataType: 'FileAttach'
        }
    ],
    configDefaultWorkPermit = [
        {
            TypeView: 'E_COMMON',
            Name: 'WorkPermitNo',
            DisplayKey: 'HRM_PortalApp_WorkPermit_DecisionNo',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'WorkPermitType',
            DisplayKey: 'HRM_PortalApp_WorkPermitType',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'ExtendTime',
            DisplayKey: 'HRM_PortalApp_IssuanceOfALicense',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'WorkPermitInsDate',
            DisplayKey: 'HRM_PortalApp_WorkPermitIssueDate',
            DataType: 'datetime',
            DataFormat: 'DD/MM/YYYY'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'WorkPermitExpiredDate',
            DisplayKey: 'HRM_PortalApp_WorkPermitExpiredDate',
            DataType: 'datetime',
            DataFormat: 'DD/MM/YYYY'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'WorkPermitAddress',
            DisplayKey: 'HRM_PortalApp_IssuingOffice',
            DataType: 'string'
        },
        {
            TypeView: 'E_FILEATTACH',
            Name: 'lsFileAttachWorkPermit',
            DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
            DataType: 'FileAttach'
        }
    ];

export default class HrePersonalInfoProfileIdentificationViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            configListDetailWorkPermit: null,
            configListDetailResident: null
        };
    }

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[ScreenName.HrePersonalInfoProfileIdentificationViewDetail]
                    ? ConfigListDetail.value[ScreenName.HrePersonalInfoProfileIdentificationViewDetail]
                    : configDefault,
                _configListDetailWorkPermit =
                    ConfigListDetail.value[ScreenName.HrePersonalInfoProfileIdentificationViewDetailWorkPermit] &&
                    1 === 2
                        ? ConfigListDetail.value[ScreenName.HrePersonalInfoProfileIdentificationViewDetailWorkPermit]
                        : configDefaultWorkPermit,
                _configListDetailResident =
                    ConfigListDetail.value[ScreenName.HrePersonalInfoProfileIdentificationViewDetailResident] && 1 === 2
                        ? ConfigListDetail.value[ScreenName.HrePersonalInfoProfileIdentificationViewDetailResident]
                        : configDefaultResident;

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem?.ID;
            if (id) {
                const dataBody = {
                    ProfileID: id
                };

                const response = await HttpService.Post(
                    '[URI_CENTER]/api/Hre_ProfileAPI/GetDetailPersonalDoc',
                    dataBody,
                    null,
                    this.reload
                );

                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = {
                        ...dataItem,
                        ...response.Data,
                        ...response.Data?.SectionIDCard[0],
                        ...response.Data?.SectionPassport[0],
                        ...response.Data?.SectionIDNo[0]
                    };

                    if (Array.isArray(data?.SectionWorkPermit) && data?.SectionWorkPermit.length > 0) {
                        data?.SectionWorkPermit.forEach(element => {
                            element.lsFileAttachWorkPermit = ManageFileSevice.setFileAttachApp(
                                element?.WorkPermitFileAttach
                            );
                            element.WorkPermitExpiredDate = data?.WorkPermitExpiredDate;
                        });
                    }

                    if (Array.isArray(data?.SectionResident) && data?.SectionResident.length > 0) {
                        data?.SectionResident.forEach(element => {
                            element.lsFileAttachResident = ManageFileSevice.setFileAttachApp(
                                element?.ResidenceCardAttachment
                            );
                        });
                    }

                    data.itemStatus = Vnr_Services.formatStyleStatusApp(data.WorkListStatus);
                    data.lsScannedCopyOfIDCard = ManageFileSevice.setFileAttachApp(data.ScannedCopyOfIDCard);
                    data.lsScannedCopyOfIDNo = ManageFileSevice.setFileAttachApp(data.ScannedCopyOfIDNo);
                    data.lsPassportAttachment = ManageFileSevice.setFileAttachApp(data.PassportAttachment);

                    this.setState({
                        configListDetail: _configListDetail,
                        dataItem: data,
                        configListDetailResident: _configListDetailResident,
                        configListDetailWorkPermit: _configListDetailWorkPermit
                    });
                } else {
                    this.setState({ dataItem: 'EmptyData' });
                }
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                this.setState({
                    configListDetail: _configListDetail,
                    dataItem,
                    configListDetailResident: _configListDetailResident,
                    configListDetailWorkPermit: _configListDetailWorkPermit
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
        const { dataItem, configListDetail, configListDetailWorkPermit, configListDetailResident } = this.state,
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
                        {Array.isArray(dataItem?.SectionResident) &&
                            dataItem?.SectionResident.length > 0 &&
                            dataItem?.SectionResident.map((item, index) => {
                                return (
                                    <View style={contentScroll}>
                                        {index !== 0 ? (
                                            <View style={styleViewDetailHumanResource.wrapLine}>
                                                <View style={styleViewDetailHumanResource.line} />
                                            </View>
                                        ) : (
                                            <View style={styleViewDetailHumanResource.container}>
                                                <Text style={[styleSheets.lable, { marginLeft: 6 }]}>
                                                    {`${translate(['HRM_PortalApp_ResidenceCard'])}`}
                                                </Text>
                                            </View>
                                        )}
                                        <View style={containerItemDetail}>
                                            {configListDetailResident.map(e => {
                                                return Vnr_Function.formatStringTypeV3(
                                                    item,
                                                    e,
                                                    configListDetailResident
                                                );
                                            })}
                                        </View>
                                    </View>
                                );
                            })}
                        {Array.isArray(dataItem?.SectionWorkPermit) &&
                            dataItem?.SectionWorkPermit.length > 0 &&
                            dataItem?.SectionWorkPermit.map((item, index) => {
                                return (
                                    <View style={contentScroll}>
                                        {index !== 0 ? (
                                            <View style={styleViewDetailHumanResource.wrapLine}>
                                                <View style={styleViewDetailHumanResource.line} />
                                            </View>
                                        ) : (
                                            <View style={styleViewDetailHumanResource.container}>
                                                <Text style={[styleSheets.lable, { marginLeft: 6 }]}>
                                                    {translate(['HRM_PortalApp_WorkPermit'])}
                                                </Text>
                                            </View>
                                        )}
                                        <View style={containerItemDetail}>
                                            {configListDetailWorkPermit.map(e => {
                                                return Vnr_Function.formatStringTypeV3(
                                                    item,
                                                    e,
                                                    configListDetailWorkPermit
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
