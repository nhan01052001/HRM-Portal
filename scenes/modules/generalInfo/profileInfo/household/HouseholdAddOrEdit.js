import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleProfileInfo,
    styleSafeAreaView,
    Size,
    Colors,
    styleButtonAddOrEdit,
    stylesListPickerControl,
    styleValid,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import { translate } from '../../../../../i18n/translate';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import DrawerServices from '../../../../../utils/DrawerServices';
import HttpService from '../../../../../utils/HttpService';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import CheckBox from 'react-native-check-box';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import { IconNext } from '../../../../../constants/Icons';
import moment from 'moment';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { HouseholdConfirmedBusinessFunction } from './householdConfirmed/HouseholdConfirmedBusinessFunction';

const initSateDefault = {
    IsCheckFormat: null,
    // StrBlockRelativesCodeTax: null,
    // IsExcludeProbation: null,
    // StrBlockRelativesIDNo: null,
    // IsBlockRelativesIDNo: null,
    // IsBlockRelativesCodeTax: null,
    ID: null,
    Profile: {},
    IsInsuranceStatus: {
        label: 'HRM_Hre_HouseholdInfo_IsInsuranceStatus',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true
    },
    RelativeName: {
        label: 'HRM_Hre_HouseholdInfo_RelativeName',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    //Loại quan hệ
    HouseholdTypeID: {
        label: 'HouseholdTypeName',
        disable: false,
        refresh: false,
        data: null,
        value: null,
        visibleConfig: true,
        visible: true
    },
    Gender: {
        label: 'HRM_Hre_HouseholdInfo_Gender',
        disable: false,
        refresh: false,
        data: null,
        value: null,
        visibleConfig: true,
        visible: true
    },
    DateOfBirth: {
        label: 'HRM_HR_Dependant_DateOfBirth',
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    //Quốc tịch
    NationalityID: {
        label: 'HRM_HR_Profile_NationalityName',
        disable: false,
        refresh: false,
        data: null,
        value: null,
        visibleConfig: true,
        visible: true
    },
    Nationality2ID: {
        label: 'HRM_Hre_HouseholdInfo_Nationality2ID',
        disable: false,
        refresh: false,
        data: null,
        value: null,
        visibleConfig: true,
        visible: true
    },
    //Dân tộc
    EthnicID: {
        label: 'HRM_Insurance_ChangeInsInfoRegister_People',
        disable: false,
        refresh: false,
        data: null,
        value: null,
        visibleConfig: true,
        visible: true
    },
    //Số điện thoại
    PhoneNumber: {
        label: 'HRM_Hre_HouseholdInfo_PhoneNumber',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    //Nghề nghiệp
    Career: {
        label: 'HRM_HR_Relatives_Career',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    //Khai báo hồ sơ đã
    BirthCertificate: {
        label: 'HRM_General_CheckApply',
        disable: false,
        refresh: false,
        data: [
            {
                Value: 'BirthCertificate',
                Text: 'HRM_HR_Dependant_BirthCertificate'
            },
            {
                Value: 'IDCardNo',
                Text: 'HRM_HR_Dependant_IDCard'
            },
            {
                Value: 'Identification',
                Text: 'HRM_HR_Dependant_Identification'
            },
            {
                Value: 'HouseHold',
                Text: 'HRM_HR_Dependant_HouseHold'
            },
            {
                Value: 'MarriageLicenses',
                Text: 'HRM_HR_Dependant_MarriageLicenses'
            },
            {
                Value: 'StudyingSchools',
                Text: 'HRM_HR_Dependant_StudyingSchools'
            },
            {
                Value: 'LaborDisabled',
                Text: 'HRM_HR_Dependant_LaborDisabled'
            },
            {
                Value: 'NurturingObligations',
                Text: 'HRM_HR_Dependant_NurturingObligations'
            },
            {
                Value: 'Less1Million',
                Text: 'HRM_HR_Relatives_Less1Million'
            },
            {
                Value: 'IsOtherJob',
                Text: 'HRM_Hre_Relatives_IsOtherJob'
            }
        ],
        value: null,
        visibleConfig: true,
        visible: true
    },
    //File đính kèm
    AttachImage: {
        label: 'HRM_Hre_HouseholdInfo_AttachImage',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    FileAttachment: {
        label: 'HRM_Hre_HouseholdInfo_AttachImage',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    //Ghi chú
    Notes: {
        label: 'HRM_Category_Subject_Notes',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    SocialInsNo: {
        label: 'HRM_Profile_SocialInsNumber',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    HouseholdInfoNo: {
        label: 'HRM_Hre_HouseholdInfo_No',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    HouseholdInfoBookNo: {
        label: 'HRM_Hre_HouseholdInfo_BookNo',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    //Thêm khai sinh
    BirthCertificateGroup: {
        label: 'HRM_HR_BirthCertificate',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true,
        CountryID: {
            label: 'HRM_HR_Profile_TACountry',
            disable: false,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        ProvinceID: {
            label: 'HRM_HR_Profile_TAProvince',
            disable: false,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        DistrictID: {
            label: 'HRM_HR_Profile_TADistrict',
            disable: true,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        WardID: {
            label: 'HRM_Category_Village_VillageName',
            disable: true,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        HouseholdIssuePlace: {
            label: 'HRM_Hre_HouseholdInfo_HouseholdIssuePlace',
            disable: false,
            refresh: false,
            value: null,
            visibleConfig: true,
            visible: true
        }
    },
    //Thêm CCCD
    IdentificationGroup: {
        label: 'Hre_IdentificationNo',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true,
        IdentificationNo: {
            label: 'HRM_HRE_Relatives_IdentificationNo',
            disable: false,
            refresh: false,
            value: null,
            visibleConfig: true,
            visible: true
        },
        IDCardPlaceOfIssue: {
            label: 'IDCardPlaceOfIssue',
            disable: false,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        HouseholdInfoIDCardIssuePlaceID: {
            label: 'HRM_Hre_HouseholdInfo_IDPlaceOfIssue',
            value: null,
            refresh: false,
            disable: false,
            visibleConfig: true,
            visible: true
        },
        IDCardDateOfIssue: {
            label: 'HRM_HR_Hre_HouseholdInfo_IDCardDateOfIssue',
            value: null,
            refresh: false,
            disable: false,
            visibleConfig: true,
            visible: true
        }
    },
    //Thêm CMND
    IDNoInfoGroup: {
        label: 'IDCardNo',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true,
        IDNo: {
            label: 'HRM_Hre_HouseholdInfo_IDNo',
            disable: false,
            refresh: false,
            value: null,
            visibleConfig: true,
            visible: true
        },
        IDPlaceOfIssue: {
            label: 'IDPlaceOfIssue',
            disable: false,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        HouseholdInfoIDPlaceOfIssueID: {
            label: 'HRM_Hre_HouseholdInfo_HouseholdInfoIDPlaceOfIssueIDView',
            value: null,
            refresh: false,
            disable: false,
            visibleConfig: true,
            visible: true
        },
        IDDateOfIssue: {
            label: 'HRM_HR_Profile_IDDateOfIssue',
            value: null,
            refresh: false,
            disable: false,
            visibleConfig: true,
            visible: true
        }
    },
    //Thêm Hộ chiếu
    RelativesPassportGroup: {
        label: 'HRM_HR_Passport_Portal',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true,
        PassportNo: {
            label: 'HRM_HR_Profile_PassportNo',
            disable: false,
            refresh: false,
            value: null,
            visibleConfig: true,
            visible: true
        },
        PassportPlaceOfIssue: {
            label: 'PassportPlaceOfIssue',
            disable: false,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        HouseholdInfoPassportIssuePlaceID: {
            label: 'HRM_Hre_HouseholdInfo_HouseholdInfoPassportIssuePlaceIDView',
            disable: false,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        PassportDateOfIssue: {
            label: 'HRM_HR_Profile_PassportDateOfIssue',
            value: null,
            refresh: false,
            disable: false,
            visibleConfig: true,
            visible: true
        },
        PassportDateOfExpiry: {
            label: 'HRM_HR_Profile_PassportDateOfExpiry',
            value: null,
            refresh: false,
            disable: false,
            visibleConfig: true,
            visible: true
        }
    },

    PassportNo: {
        visibleConfig: true
    },
    PassportPlaceOfIssue: {
        visibleConfig: true
    },
    HouseholdInfoPassportIssuePlaceID: {
        visibleConfig: true
    },
    PassportDateOfIssue: {
        visibleConfig: true
    },
    PassportDateOfExpiry: {
        visibleConfig: true
    },
    IdentificationNo: {
        visibleConfig: true
    },
    IDCardPlaceOfIssue: {
        visibleConfig: true
    },
    HouseholdInfoIDCardIssuePlaceID: {
        visibleConfig: true
    },
    IDCardDateOfIssue: {
        visibleConfig: true
    },
    IDNo: {
        visibleConfig: true
    },
    IDPlaceOfIssue: {
        visibleConfig: true
    },
    HouseholdInfoIDPlaceOfIssueID: {
        visibleConfig: true
    },
    IDDateOfIssue: {
        visibleConfig: true
    },

    fieldValid: {},
    isUpperCaseText: {}
};

export default class HouseholdAddOrEdit extends Component {
    constructor(porps) {
        super(porps);
        this.state = initSateDefault;
        this.setVariable();

        if (
            porps.navigation.state &&
            porps.navigation.state.params &&
            porps.navigation.state.params.record &&
            porps.navigation.state.params.record.ID
        ) {
            porps.navigation.setParams({
                title: 'HRM_Insurance_Hre_HouseholdInfo_PopUp_Edit_Title'
            });
        } else {
            porps.navigation.setParams({
                title: 'HRM_Insurance_Hre_HouseholdInfo_PopUp_Addnew_Title'
            });
        }
    }

    //#region [khởi tạo , lấy các dữ liệu cho control, lấy giá trị mặc đinh]

    setVariable = () => {
        this.isModify = false;

        this.isProcessing = false;
        this.profileInfo = dataVnrStorage && dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info : {};
    };

    refreshView = () => {
        this.props.navigation.setParams({ title: 'HRM_Insurance_Hre_HouseholdInfo_PopUp_Addnew_Title' });
        this.setVariable();
        const { AttachImage } = this.state;
        let resetState = {
            ...initSateDefault,
            AttachImage: {
                ...initSateDefault.AttachImage,
                refresh: !AttachImage.refresh
            }
        };

        this.setState(resetState, () => this.getConfigValid('Hre_RequestHouseholdInfo', true));
    };

    //promise get config valid
    getConfigValid = (tblName, isRefresh) => {
        VnrLoadingSevices.show();
        HttpService.MultiRequest([
            HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName),
            HttpService.Post('[URI_HR]/Hre_GetData/IstUpperTextOfFieldTableByConfig', {
                tableName: 'Hre_HouseholdInfo'
            })
        ]).then(resAll => {
            if (resAll && Array.isArray(resAll) && resAll.length === 2) {
                const [resConfigValid, resConfigUpperText] = resAll;
                if (resConfigValid) {
                    try {
                        VnrLoadingSevices.hide();

                        const { RelativesPassportGroup, IdentificationGroup, IDNoInfoGroup } = this.state;

                        //map field hidden by config
                        const _configField =
                                ConfigField && ConfigField.value['HouseholdAddOrEdit']
                                    ? ConfigField.value['HouseholdAddOrEdit']['Hidden']
                                    : [],
                            { E_ProfileID, E_FullName } = EnumName,
                            _profile = { ID: this.profileInfo[E_ProfileID], ProfileName: this.profileInfo[E_FullName] };

                        let nextState = { fieldValid: resConfigValid, Profile: _profile };
                        _configField.forEach(fieldConfig => {
                            let _field = this.state[fieldConfig];
                            if (_field && typeof _field === 'object') {
                                _field = {
                                    ..._field,
                                    visibleConfig: false
                                };

                                nextState = {
                                    ...nextState,
                                    [fieldConfig]: { ..._field }
                                };
                            }
                        });

                        if (resConfigUpperText && typeof resConfigUpperText === 'string') {
                            // convert array to object with value default is true (boolean)
                            let obj = {};
                            resConfigUpperText.split(',').forEach((element) => {
                                obj[`${element}`.trim()] = true;
                            });

                            nextState = {
                                ...nextState,
                                isUpperCaseText: obj
                            };
                        }

                        nextState = {
                            ...nextState,

                            IDNoInfoGroup: {
                                ...IDNoInfoGroup,
                                IDPlaceOfIssue: {
                                    ...IDNoInfoGroup.IDPlaceOfIssue,
                                    visibleConfig: nextState.IDPlaceOfIssue
                                        ? nextState.IDPlaceOfIssue.visibleConfig
                                        : true
                                },
                                HouseholdInfoIDPlaceOfIssueID: {
                                    ...IDNoInfoGroup.HouseholdInfoIDPlaceOfIssueID,
                                    visibleConfig: nextState.HouseholdInfoIDPlaceOfIssueID
                                        ? nextState.HouseholdInfoIDPlaceOfIssueID.visibleConfig
                                        : true
                                }
                            },
                            RelativesPassportGroup: {
                                ...RelativesPassportGroup,
                                PassportPlaceOfIssue: {
                                    ...RelativesPassportGroup.PassportPlaceOfIssue,
                                    visibleConfig: nextState.PassportPlaceOfIssue
                                        ? nextState.PassportPlaceOfIssue.visibleConfig
                                        : true
                                },
                                HouseholdInfoPassportIssuePlaceID: {
                                    ...RelativesPassportGroup.HouseholdInfoPassportIssuePlaceID,
                                    visibleConfig: nextState.HouseholdInfoPassportIssuePlaceID
                                        ? nextState.HouseholdInfoPassportIssuePlaceID.visibleConfig
                                        : true
                                }
                            },
                            IdentificationGroup: {
                                ...IdentificationGroup,
                                IDCardPlaceOfIssue: {
                                    ...IdentificationGroup.IDCardPlaceOfIssue,
                                    visibleConfig: nextState.IDCardPlaceOfIssue
                                        ? nextState.IDCardPlaceOfIssue.visibleConfig
                                        : true
                                },
                                HouseholdInfoIDCardIssuePlaceID: {
                                    ...IdentificationGroup.HouseholdInfoIDCardIssuePlaceID,
                                    visibleConfig: nextState.HouseholdInfoIDCardIssuePlaceID
                                        ? nextState.HouseholdInfoIDCardIssuePlaceID.visibleConfig
                                        : true
                                }
                            }
                        };

                        this.setState({ ...nextState }, () => {
                            let { record } = !isRefresh ? this.props.navigation.state.params : {};

                            //get config khi đăng ký
                            if (!record) {
                                this.getConfig();
                            } else {
                                this.isModify = true;
                                this.setRecordForModify(record);
                            }
                        });
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                }
            }
        });
    };

    componentDidMount() {
        this.getConfigValid('Hre_RequestHouseholdInfo');
    }

    // /api/Hre_ApprovedHouseholdInfo/GetById?ID=
    // Att_GetData/GetByIdHouseHoldTotal?id=

    setRecordForModify = response => {
        let nextState = {};
        const {
                RelativeName,
                HouseholdTypeID,
                Gender,
                DateOfBirth,
                NationalityID,
                Nationality2ID,
                EthnicID,
                PhoneNumber,
                Career,
                Notes,
                SocialInsNo,
                HouseholdInfoNo,
                HouseholdInfoBookNo,
                AttachImage,
                FileAttachment,
                IsInsuranceStatus,
                //Giấy khai sinh
                BirthCertificateGroup,
                //Hộ chiếu
                RelativesPassportGroup,
                //CCCD
                IdentificationGroup,
                //CMND
                IDNoInfoGroup
            } = this.state,
            { ProvinceID, DistrictID, WardID, HouseholdIssuePlace } = BirthCertificateGroup,
            {
                PassportNo,
                PassportPlaceOfIssue,
                HouseholdInfoPassportIssuePlaceID,
                PassportDateOfIssue,
                PassportDateOfExpiry
            } = RelativesPassportGroup,
            {
                IdentificationNo,
                IDCardPlaceOfIssue,
                HouseholdInfoIDCardIssuePlaceID,
                IDCardDateOfIssue
            } = IdentificationGroup,
            { IDNo, IDPlaceOfIssue, HouseholdInfoIDPlaceOfIssueID, IDDateOfIssue } = IDNoInfoGroup;

        nextState = {
            ID: response.ID ? response.ID : null,
            RelativeName: {
                ...RelativeName,
                value: response.RelativeName ? response.RelativeName : '',
                refresh: !RelativeName.refresh
            },

            Gender: {
                ...Gender,
                value: response.Gender ? { Value: response.Gender, Text: translate(response.Gender) } : null,
                refresh: !Gender.refresh
            },

            NationalityID: {
                ...NationalityID,
                value: response.NationalityID
                    ? { ID: response.NationalityID, CountryName: response.NationalityName }
                    : null,
                refresh: !NationalityID.refresh
            },
            Nationality2ID: {
                ...Nationality2ID,
                value: response.Nationality2ID
                    ? { ID: response.Nationality2ID, Nationality: response.Nationality2Name }
                    : null,
                refresh: !Nationality2ID.refresh
            },
            EthnicID: {
                ...EthnicID,
                value: response.EthnicID ? { ID: response.EthnicID, RelativeTypeName: response.EthnicName } : null,
                refresh: !EthnicID.refresh
            },
            PhoneNumber: {
                ...PhoneNumber,
                value: response.PhoneNumber ? response.PhoneNumber : '',
                refresh: !PhoneNumber.refresh
            },
            Career: {
                ...Career,
                value: response.Career ? response.Career : '',
                refresh: !Career.refresh
            },
            Notes: {
                ...Notes,
                value: response.Notes ? response.Notes : '',
                refresh: !Notes.refresh
            },
            SocialInsNo: {
                ...SocialInsNo,
                value: response.SocialInsNo ? response.SocialInsNo : '',
                refresh: !SocialInsNo.refresh
            },
            HouseholdInfoNo: {
                ...HouseholdInfoNo,
                value: response.HouseholdInfoNo ? response.HouseholdInfoNo : '',
                refresh: !HouseholdInfoNo.refresh
            },
            HouseholdInfoBookNo: {
                ...HouseholdInfoBookNo,
                value: response.HouseholdInfoBookNo ? response.HouseholdInfoBookNo : '',
                refresh: !HouseholdInfoBookNo.refresh
            },
            AttachImage: {
                ...AttachImage,
                value: response.lstFileAttachImage,
                refresh: !AttachImage.refresh
            },
            FileAttachment: {
                ...FileAttachment,
                value: response.lstFileAttach ? response.lstFileAttach : null,
                refresh: !FileAttachment.refresh
            },
            IsInsuranceStatus: {
                ...IsInsuranceStatus,
                value: response.IsInsuranceStatus,
                refresh: !IsInsuranceStatus.refresh
            },

            //Giấy khai sinh
            BirthCertificateGroup: {
                ...BirthCertificateGroup,

                //Số chứng từ
                HouseholdIssuePlace: {
                    ...HouseholdIssuePlace,
                    value: response.HouseholdIssuePlace ? response.HouseholdIssuePlace : '',
                    refresh: !HouseholdIssuePlace.refresh
                },
                // CountryID: {
                //     ...CountryID,
                //     value: response.CountryID ? { ID: response.CountryID } : null,
                //     refresh: !CountryID.refresh
                // },
                ProvinceID: {
                    ...ProvinceID,
                    value: response.ProvinceBirthCertificateID
                        ? {
                            ID: response.ProvinceBirthCertificateID,
                            ProvinceName: response.ProvinceBirthCertificateName
                        }
                        : null,
                    refresh: !ProvinceID.refresh
                },
                DistrictID: {
                    ...DistrictID,
                    value: response.DistrictBirthCertificateID
                        ? {
                            ID: response.DistrictBirthCertificateID,
                            DistrictName: response.DistrictBirthCertificateName
                        }
                        : null,
                    disable: response.ProvinceBirthCertificateID ? false : true,
                    refresh: !DistrictID.refresh
                },
                WardID: {
                    ...WardID,
                    value: response.VillageBirthCertificateID
                        ? { ID: response.VillageBirthCertificateID, VillageName: response.VillageBirthCertificateName }
                        : null,
                    disable: response.DistrictBirthCertificateID ? false : true,
                    refresh: !WardID.refresh
                }
            },
            //Hộ chiếu
            RelativesPassportGroup: {
                ...RelativesPassportGroup,
                PassportNo: {
                    ...PassportNo,
                    value: response.PassportNo ? response.PassportNo : '',
                    refresh: !PassportNo.refresh
                },
                PassportPlaceOfIssue: {
                    ...PassportPlaceOfIssue,
                    value: response.PassportPlaceOfIssue
                        ? { ID: response.PassportPlaceOfIssue, ProvinceName: response.PassportPlaceOfIssue }
                        : null,
                    refresh: !PassportPlaceOfIssue.refresh
                },
                HouseholdInfoPassportIssuePlaceID: {
                    ...HouseholdInfoPassportIssuePlaceID,
                    value: response.HouseholdInfoPassportIssuePlaceID
                        ? {
                            ID: response.HouseholdInfoPassportIssuePlaceID,
                            PassportIssuePlaceName: response.HouseholdInfoPassportIssuePlaceIDView
                        }
                        : null,
                    refresh: !HouseholdInfoPassportIssuePlaceID.refresh
                },
                PassportDateOfIssue: {
                    ...PassportDateOfIssue,
                    value: response.PassportDateOfIssue ? moment(response.PassportDateOfIssue) : null,
                    refresh: !PassportDateOfIssue.refresh
                },
                PassportDateOfExpiry: {
                    ...PassportDateOfExpiry,
                    value: response.PassportDateOfExpiry ? moment(response.PassportDateOfExpiry) : null,
                    refresh: !PassportDateOfExpiry.refresh
                }
            },
            //CCCD
            IdentificationGroup: {
                ...IdentificationGroup,
                IdentificationNo: {
                    ...IdentificationNo,
                    value: response.IdentificationNo ? response.IdentificationNo : '',
                    refresh: !IdentificationNo.refresh
                },
                HouseholdInfoIDCardIssuePlaceID: {
                    ...HouseholdInfoIDCardIssuePlaceID,
                    value: response.HouseholdInfoIDCardIssuePlaceID
                        ? {
                            ID: response.HouseholdInfoIDCardIssuePlaceID,
                            IDCardIssuePlaceName: response.HouseholdInfoIDCardIssuePlaceIDView
                        }
                        : null,
                    refresh: !HouseholdInfoIDCardIssuePlaceID.refresh
                },
                IDCardPlaceOfIssue: {
                    ...IDCardPlaceOfIssue,
                    value: response.IDCardPlaceOfIssue
                        ? { ID: response.IDCardPlaceOfIssue, ProvinceName: response.IDCardPlaceOfIssue }
                        : null,
                    refresh: !IDCardPlaceOfIssue.refresh
                },
                IDCardDateOfIssue: {
                    ...IDCardDateOfIssue,
                    value: response.IDCardDateOfIssue ? moment(response.IDCardDateOfIssue) : null,
                    refresh: !IDCardDateOfIssue.refresh
                }
            },
            //CMND
            IDNoInfoGroup: {
                ...IDNoInfoGroup,
                IDNo: {
                    ...IDNo,
                    value: response.IDNo ? response.IDNo : '',
                    refresh: !IDNo.refresh
                },
                IDPlaceOfIssue: {
                    ...IDPlaceOfIssue,
                    value: response.IDPlaceOfIssue
                        ? {
                            ID: response.IDPlaceOfIssue,
                            ProvinceName: response.IDPlaceOfIssue
                        }
                        : null,
                    refresh: !IDPlaceOfIssue.refresh
                },
                HouseholdInfoIDPlaceOfIssueID: {
                    ...HouseholdInfoIDPlaceOfIssueID,
                    value: response.HouseholdInfoIDPlaceOfIssueID
                        ? {
                            ID: response.HouseholdInfoIDPlaceOfIssueID,
                            ProvinceName: response.HouseholdInfoIDPlaceOfIssueIDView
                        }
                        : null,
                    refresh: !IDDateOfIssue.refresh
                },
                IDDateOfIssue: {
                    ...IDDateOfIssue,
                    value: response.IDDateOfIssue ? moment(response.IDDateOfIssue) : null,
                    refresh: !IDDateOfIssue.refresh
                }
            }
        };

        if (response.RelativeYearOfBirth && response.RelativeDayOfBirth && response.RelativeMonthOfBirth)
            nextState = {
                ...nextState,
                DateOfBirth: {
                    ...DateOfBirth,
                    value: response.RelativeYearOfBirth
                        ? moment(
                            `${response.RelativeYearOfBirth}/${response.RelativeMonthOfBirth}/${
                                response.RelativeDayOfBirth
                            }`
                        )
                        : null,
                    refresh: !DateOfBirth.refresh
                }
            };
        else
            nextState = {
                ...nextState,
                DateOfBirth: {
                    ...DateOfBirth,
                    value: response.DateOfBirth
                        ? moment(`${response.YearOfBirth}/${response.MonthOfBirth}/${response.DayOfBirth}`)
                        : null,
                    refresh: !DateOfBirth.refresh
                }
            };

        if (response.RelativeTypeID && response.RelativeTypeName)
            nextState = {
                ...nextState,
                HouseholdTypeID: {
                    ...HouseholdTypeID,
                    value: response.RelativeTypeID
                        ? { ID: response.RelativeTypeID, RelativeTypeName: response.RelativeTypeName }
                        : null,
                    refresh: !HouseholdTypeID.refresh
                }
            };
        else
            nextState = {
                ...nextState,
                HouseholdTypeID: {
                    ...HouseholdTypeID,
                    value: response.HouseholdTypeID
                        ? { ID: response.HouseholdTypeID, RelativeTypeName: response.HouseholdTypeName }
                        : null,
                    refresh: !HouseholdTypeID.refresh
                }
            };

        this.setState(nextState);
    };

    getConfig = () => {};

    onFinishBirthCertificateGroup = data => {
        const { BirthCertificate } = data,
            { BirthCertificateGroup } = this.state;

        this.setState({
            BirthCertificateGroup: { BirthCertificateGroup, ...BirthCertificate }
        });
    };

    onFinishOtherIdentificationGroup = data => {
        const { RelativesPassport, Identification, IDNoInfo } = data,
            { RelativesPassportGroup, IdentificationGroup, IDNoInfoGroup } = this.state;

        this.setState({
            RelativesPassportGroup: { RelativesPassportGroup, ...RelativesPassport },
            IdentificationGroup: { IdentificationGroup, ...Identification },
            IDNoInfoGroup: { IDNoInfoGroup, ...IDNoInfo }
        });
    };

    onSaveAndCreate = () => {
        this.onSave(true, null);
    };

    onSaveAndSend = () => {
        this.onSave(null, true);
    };

    onSave = (isCreate, isSend) => {
        if (this.isProcessing) {
            return;
        }

        const {
                ID,
                RelativeName,
                HouseholdTypeID,
                Gender,
                DateOfBirth,
                NationalityID,
                Nationality2ID,
                EthnicID,
                PhoneNumber,
                Career,
                Notes,
                SocialInsNo,
                HouseholdInfoNo,
                HouseholdInfoBookNo,
                AttachImage,
                FileAttachment,
                IsInsuranceStatus,
                //Giấy khai sinh
                BirthCertificateGroup,
                //Hộ chiếu
                RelativesPassportGroup,
                //CCCD
                IdentificationGroup,
                //CMND
                IDNoInfoGroup
            } = this.state,
            { ProvinceID, DistrictID, WardID, HouseholdIssuePlace } = BirthCertificateGroup,
            {
                PassportNo,
                PassportPlaceOfIssue,
                HouseholdInfoPassportIssuePlaceID,
                PassportDateOfIssue,
                PassportDateOfExpiry
            } = RelativesPassportGroup,
            {
                IdentificationNo,
                IDCardPlaceOfIssue,
                HouseholdInfoIDCardIssuePlaceID,
                IDCardDateOfIssue
            } = IdentificationGroup,
            { IDNo, IDPlaceOfIssue, HouseholdInfoIDPlaceOfIssueID, IDDateOfIssue } = IDNoInfoGroup;

        let params = {
            HouseholdInfoNo: HouseholdInfoNo.value,
            HouseholdInfoBookNo: HouseholdInfoBookNo.value,
            BookNo: HouseholdInfoBookNo.value,

            RelativeName: RelativeName.value,
            PhoneNumber: PhoneNumber.value,
            Career: Career.value,
            SocialInsNo: SocialInsNo.value,
            Notes: Notes.value,

            IDNo: IDNo.value ? IDNo.value : null,
            IDPlaceOfIssue: IDPlaceOfIssue.value ? IDPlaceOfIssue.value.ProvinceName : null,
            HouseholdInfoIDPlaceOfIssueID: HouseholdInfoIDPlaceOfIssueID.value
                ? HouseholdInfoIDPlaceOfIssueID.value.ID
                : null,
            IdentificationNo: IdentificationNo.value,
            PassportNo: PassportNo.value,
            PassportPlaceOfIssue: PassportPlaceOfIssue.value ? PassportPlaceOfIssue.value.ProvinceName : null,
            HouseholdInfoPassportIssuePlaceID: HouseholdInfoPassportIssuePlaceID.value
                ? HouseholdInfoPassportIssuePlaceID.value.ID
                : null,
            HouseholdIssuePlace: HouseholdIssuePlace.value,
            IsInsuranceStatus: IsInsuranceStatus.value,

            DateOfBirth: DateOfBirth.value ? Vnr_Function.formatDateAPI(DateOfBirth.value) : null,
            IDDateOfIssue: IDDateOfIssue.value ? Vnr_Function.formatDateAPI(IDDateOfIssue.value) : null,
            IDCardDateOfIssue: IDCardDateOfIssue.value ? Vnr_Function.formatDateAPI(IDCardDateOfIssue.value) : null,
            PassportDateOfIssue: PassportDateOfIssue.value
                ? Vnr_Function.formatDateAPI(PassportDateOfIssue.value)
                : null,
            PassportDateOfExpiry: PassportDateOfExpiry.value
                ? Vnr_Function.formatDateAPI(PassportDateOfExpiry.value)
                : null,
            HouseholdTypeID: HouseholdTypeID.value ? HouseholdTypeID.value.ID : null,
            Gender: Gender.value ? Gender.value.Value : null,
            EthnicID: EthnicID.value ? EthnicID.value.ID : null,
            NationalityID: NationalityID.value ? NationalityID.value.ID : null,
            Nationality2ID: Nationality2ID.value ? Nationality2ID.value.ID : null,
            HouseholdInfoIDCardIssuePlaceID: HouseholdInfoIDCardIssuePlaceID.value
                ? HouseholdInfoIDCardIssuePlaceID.value.ID
                : null,
            IDCardPlaceOfIssue: IDCardPlaceOfIssue.value ? IDCardPlaceOfIssue.value.ProvinceName : null,

            ProvinceBirthCertificateID: ProvinceID.value ? ProvinceID.value.ID : null,
            DistrictBirthCertificateID: DistrictID.value ? DistrictID.value.ID : null,
            VillageBirthCertificateID: WardID.value ? WardID.value.ID : null,

            ProfileID: this.profileInfo.ProfileID,
            InformationInputId: 'E_IdentificationCard,E_IDCard,E_Passport,E_IdentifyNumber',
            AttachImage: AttachImage.value ? AttachImage.value.map(item => item.fileName).join(',') : null,
            FileAttachment: FileAttachment.value ? FileAttachment.value.map(item => item.fileName).join(',') : null,
            IsPortal: true,
            UserSubmit: this.profileInfo.ProfileID,
            UserID: this.profileInfo.userid,
            LangCode: dataVnrStorage.languageApp,
            DayOfBirth: DateOfBirth.value ? parseInt(moment(DateOfBirth.value).format('DD')) : null,
            MonthOfBirth: DateOfBirth.value ? parseInt(moment(DateOfBirth.value).format('MM')) : null,
            YearOfBirth: DateOfBirth.value ? parseInt(moment(DateOfBirth.value).format('YYYY')) : null
        };

        if (ID) {
            params = {
                ...params,
                ID
            };
        }

        // Send mail
        if (isSend) {
            params = {
                ...params,
                IsSubmitSave: true
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Hre_ApprovedHouseholdInfo', params).then(data => {
            this.isProcessing = false;
            VnrLoadingSevices.hide();
            if (data && typeof data == 'object') {
                if (data.ActionStatus && data.ActionStatus.split('|')[0] == 'InValid') {
                    ToasterSevice.showWarning(data.ActionStatus.split('|')[1], 4000);
                } else {
                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                    const { reload } = this.props.navigation.state.params;
                    if (reload && typeof reload === 'function') {
                        reload();
                    }

                    if (isCreate) {
                        this.refreshView();
                    } else {
                        HouseholdConfirmedBusinessFunction.checkForLoadEditDelete[
                            ScreenName.HouseholdWaitConfirm
                        ] = true;
                        DrawerServices.navigate('HouseholdWaitConfirm');
                    }
                }
            }
        });
    };

    handleUpperCase = async (fieldNameInput, valueField) => {
        return await HttpService.Post('[URI_HR]/Hre_GetData/convertToUpperCase', {
            tableName: 'Hre_HouseholdInfo',
            fieldNameInput,
            valueField
        });
    };

    render() {
        const {
            fieldValid,
            RelativeName,
            HouseholdTypeID,
            Gender,
            DateOfBirth,
            NationalityID,
            Nationality2ID,
            EthnicID,
            PhoneNumber,
            Career,
            Notes,
            SocialInsNo,
            HouseholdInfoNo,
            HouseholdInfoBookNo,
            AttachImage,
            IsInsuranceStatus,
            //Giấy khai sinh
            BirthCertificateGroup,
            //Hộ chiếu
            RelativesPassportGroup,
            //CCCD
            IdentificationGroup,
            //CMND
            IDNoInfoGroup,
            isUpperCaseText
        } = this.state;

        const { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl,
            { textLableGroup, styleViewTitleGroup } = styleProfileInfo;

        let tranPassport =
            translate('HRM_HR_IDCard') +
            '/' +
            translate('HRM_HR_IdentificationCard') +
            '/' +
            translate('HRM_HR_Passport_Portal');

        //#region [Xử lý 3 nút lưu]
        const listActions = [];

        listActions.push({
            type: EnumName.E_SAVE_SENMAIL,
            title: translate('HRM_Common_SaveAndSendRequest'),
            onPress: () => this.onSaveAndSend()
        });

        listActions.push({
            type: EnumName.E_SAVE_CLOSE,
            title: translate('HRM_Common_SaveClose'),
            onPress: () => this.onSave()
        });

        listActions.push({
            type: EnumName.E_SAVE_NEW,
            title: translate('HRM_Common_SaveNew'),
            onPress: () => this.onSaveAndCreate()
        });

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView contentContainerStyle={CustomStyleSheet.flexGrow(1)}>
                        <View style={styleViewTitleGroup}>
                            <VnrText style={[styleSheets.text, textLableGroup]} i18nKey={'HRM_HR_GeneralInformation'} />
                        </View>

                        {/* thông tin chung */}
                        <View>
                            {/* Số sổ hộ khẩu - HouseholdInfoNo */}
                            {HouseholdInfoNo.visibleConfig && HouseholdInfoNo.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={HouseholdInfoNo.label}
                                        />

                                        {/* valid HouseholdInfoNo */}
                                        {fieldValid.HouseholdInfoNo && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={HouseholdInfoNo.disable}
                                            refresh={HouseholdInfoNo.refresh}
                                            value={HouseholdInfoNo.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    HouseholdInfoNo: {
                                                        ...HouseholdInfoNo,
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Quyển số - HouseholdInfoBookNo */}
                            {HouseholdInfoBookNo.visibleConfig && HouseholdInfoBookNo.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={HouseholdInfoBookNo.label}
                                        />

                                        {/* valid HouseholdInfoBookNo */}
                                        {fieldValid.HouseholdInfoBookNo && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={HouseholdInfoBookNo.disable}
                                            refresh={HouseholdInfoBookNo.refresh}
                                            value={HouseholdInfoBookNo.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    HouseholdInfoBookNo: {
                                                        ...HouseholdInfoBookNo,
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* tên người thân - RelativeName */}
                            {RelativeName.visibleConfig && RelativeName.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={RelativeName.label}
                                        />

                                        {/* valid ProfileID */}
                                        {fieldValid.RelativeName && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            isUpperCase={isUpperCaseText.RelativeName ? true : false}
                                            disable={RelativeName.disable}
                                            refresh={RelativeName.refresh}
                                            value={RelativeName.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    RelativeName: {
                                                        ...RelativeName,
                                                        value: text
                                                    }
                                                })
                                            }
                                            onBlur={() => {
                                                if (isUpperCaseText.RelativeName) {
                                                    this.handleUpperCase('RelativeName', RelativeName.value)
                                                        .then(res => {
                                                            this.setState({
                                                                RelativeName: {
                                                                    ...RelativeName,
                                                                    value: res
                                                                }
                                                            });
                                                        })
                                                        .catch(() => {});
                                                }
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Loại quan hệ - HouseholdTypeID */}
                            {HouseholdTypeID.visibleConfig && HouseholdTypeID.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={HouseholdTypeID.label}
                                        />

                                        {/* valid HouseholdTypeID */}
                                        {fieldValid.HouseholdTypeID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi: '[URI_HR]/Cat_GetData/GetMultiRelativeType',
                                                type: 'E_GET'
                                            }}
                                            autoBind={true}
                                            value={HouseholdTypeID.value}
                                            refresh={HouseholdTypeID.refresh}
                                            textField="RelativeTypeName"
                                            valueField="ID"
                                            filter={true}
                                            filterServer={true}
                                            filterParams="text"
                                            disable={HouseholdTypeID.disable}
                                            onFinish={item => {
                                                this.setState({
                                                    HouseholdTypeID: {
                                                        ...HouseholdTypeID,
                                                        value: item,
                                                        refresh: !HouseholdTypeID.refresh
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Giới tính - Gender */}
                            {Gender.visibleConfig && Gender.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Gender.label} />

                                        {/* valid Gender */}
                                        {fieldValid.Gender && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerQuickly
                                            autoBind={true}
                                            api={{
                                                urlApi: '[URI_SYS]/Sys_GetData/GetEnum?text=Gender',
                                                type: 'E_GET'
                                            }}
                                            refresh={Gender.refresh}
                                            textField="Text"
                                            valueField="Value"
                                            filter={false}
                                            value={Gender.value}
                                            disable={Gender.disable}
                                            onFinish={item =>
                                                this.setState({
                                                    Gender: {
                                                        ...Gender,
                                                        value: item,
                                                        refresh: !Gender.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Ngày sinh - DateOfBirth */}
                            {DateOfBirth.visibleConfig && DateOfBirth.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={DateOfBirth.label}
                                        />

                                        {fieldValid.DateOfBirth && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={DateOfBirth.value}
                                            refresh={DateOfBirth.refresh}
                                            type={'date'}
                                            onFinish={value =>
                                                this.setState({
                                                    DateOfBirth: {
                                                        ...DateOfBirth,
                                                        value,
                                                        refresh: !DateOfBirth.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Dân tộc - EthnicID */}
                            {EthnicID.visibleConfig && EthnicID.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={EthnicID.label} />

                                        {/* valid EthnicID */}
                                        {fieldValid.EthnicID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            autoBind={true}
                                            api={{
                                                urlApi: '[URI_HR]/Cat_GetData/GetMultiEthnicGroup',
                                                type: 'E_GET'
                                            }}
                                            value={EthnicID.value}
                                            refresh={EthnicID.refresh}
                                            textField="EthnicGroupName"
                                            valueField="ID"
                                            filter={true}
                                            filterServer={true}
                                            filterParams="text"
                                            disable={EthnicID.disable}
                                            onFinish={item => {
                                                this.setState({
                                                    EthnicID: {
                                                        ...EthnicID,
                                                        value: item,
                                                        refresh: !EthnicID.refresh
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Quốc tịch - NationalityID */}
                            {NationalityID.visibleConfig && NationalityID.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={NationalityID.label}
                                        />

                                        {/* valid NationalityID */}
                                        {fieldValid.NationalityID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            autoBind={true}
                                            api={{
                                                urlApi: '[URI_HR]/Cat_GetData/GetMultiCountry',
                                                type: 'E_GET'
                                            }}
                                            value={NationalityID.value}
                                            refresh={NationalityID.refresh}
                                            textField="CountryName"
                                            valueField="ID"
                                            filter={true}
                                            filterServer={true}
                                            filterParams="text"
                                            disable={NationalityID.disable}
                                            onFinish={item => {
                                                this.setState({
                                                    NationalityID: {
                                                        ...NationalityID,
                                                        value: item,
                                                        refresh: !NationalityID.refresh
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Quốc tịch 2 - Nationality2ID */}
                            {Nationality2ID.visibleConfig && Nationality2ID.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={Nationality2ID.label}
                                        />

                                        {/* valid Nationality2ID */}
                                        {fieldValid.Nationality2ID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            autoBind={true}
                                            api={{
                                                urlApi: '[URI_HR]/Cat_GetData/GetMultiCountryNationality',
                                                type: 'E_GET'
                                            }}
                                            value={Nationality2ID.value}
                                            refresh={Nationality2ID.refresh}
                                            textField="Nationality"
                                            valueField="ID"
                                            filter={true}
                                            filterServer={true}
                                            filterParams="text"
                                            disable={Nationality2ID.disable}
                                            onFinish={item => {
                                                this.setState({
                                                    Nationality2ID: {
                                                        ...Nationality2ID,
                                                        value: item,
                                                        refresh: !Nationality2ID.refresh
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Số điện thoại - PhoneNumber */}
                            {PhoneNumber.visibleConfig && PhoneNumber.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={PhoneNumber.label}
                                        />

                                        {/* valid PhoneNumber */}
                                        {fieldValid.PhoneNumber && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            keyboardType={'numeric'}
                                            charType={'int'}
                                            disable={PhoneNumber.disable}
                                            refresh={PhoneNumber.refresh}
                                            value={PhoneNumber.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    PhoneNumber: {
                                                        ...PhoneNumber,
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Nghề nghiệp - Career */}
                            {Career.visibleConfig && Career.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Career.label} />

                                        {/* valid Career */}
                                        {fieldValid.Career && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={Career.disable}
                                            refresh={Career.refresh}
                                            value={Career.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    Career: {
                                                        ...Career,
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Mã số BHXH - SocialInsNo */}
                            {SocialInsNo.visibleConfig && SocialInsNo.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={SocialInsNo.label}
                                        />

                                        {/* valid ProfileID */}
                                        {fieldValid.SocialInsNo && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={SocialInsNo.disable}
                                            refresh={SocialInsNo.refresh}
                                            value={SocialInsNo.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    SocialInsNo: {
                                                        ...SocialInsNo,
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Tình trạng tham gia bảo hiểm - IsInsuranceStatus */}
                            {IsInsuranceStatus.visibleConfig && IsInsuranceStatus.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={IsInsuranceStatus.label}
                                        />

                                        {fieldValid.IsInsuranceStatus && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <CheckBox
                                            checkBoxColor={Colors.Secondary}
                                            checkedCheckBoxColor={Colors.Secondary}
                                            isChecked={IsInsuranceStatus.value}
                                            disable={IsInsuranceStatus.disable}
                                            onClick={() =>
                                                this.setState({
                                                    IsInsuranceStatus: {
                                                        ...IsInsuranceStatus,
                                                        value: !IsInsuranceStatus.value
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* File đính kèm - AttachImage */}
                            {AttachImage.visibleConfig && AttachImage.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={AttachImage.label}
                                        />
                                    </View>
                                    <View style={viewControl}>
                                        <VnrAttachFile
                                            disable={AttachImage.disable}
                                            value={AttachImage.value}
                                            multiFile={true}
                                            uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                            refresh={AttachImage.refresh}
                                            onFinish={file => {
                                                this.setState({
                                                    AttachImage: {
                                                        ...AttachImage,
                                                        value: file,
                                                        refresh: !AttachImage.refresh
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Ghi chú - Notes*/}
                            {Notes.visible && Notes.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Notes.label} />

                                        {/* valid Comment */}
                                        {fieldValid.Notes && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={Notes.disable}
                                            refresh={Notes.refresh}
                                            value={Notes.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    Notes: {
                                                        ...Notes,
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* #region [thông tin bổ sung - CMND, CCCD, hộ chiếu, khai sinh, hộ khẩu] */}
                        <View>
                            {/* khai sinh */}
                            {BirthCertificateGroup.visible && BirthCertificateGroup.visibleConfig && (
                                <TouchableOpacity
                                    onPress={() =>
                                        DrawerServices.navigate('HouseholdOtherBirthCertificate', {
                                            BirthCertificate: { ...BirthCertificateGroup },
                                            fieldValid,
                                            onFinish: this.onFinishBirthCertificateGroup
                                        })
                                    }
                                    style={styles.btnOtherInfo}
                                >
                                    <View style={styles.iconNext}>
                                        <IconNext size={Size.iconSize} color={Colors.white} />
                                    </View>
                                    <VnrText
                                        style={[styleSheets.lable, styleButtonAddOrEdit.groupButton__text, styles.text]}
                                        i18nKey={'HRM_OnlyApp_Certificat_De_Naissance_For_Relative'}
                                    />

                                    <View style={styles.iconNext}>
                                        <IconNext size={Size.iconSize} color={Colors.primary} />
                                    </View>
                                </TouchableOpacity>
                            )}

                            {/* CMND/CCCD/hộ chiếu */}
                            {((IdentificationGroup.visibleConfig && IdentificationGroup.visible) ||
                                (RelativesPassportGroup.visibleConfig && RelativesPassportGroup.visible) ||
                                (IDNoInfoGroup.visibleConfig && IDNoInfoGroup.visible)) && (
                                <TouchableOpacity
                                    onPress={() =>
                                        DrawerServices.navigate('HouseholdOtherIdentification', {
                                            RelativesPassport: { ...RelativesPassportGroup },
                                            Identification: { ...IdentificationGroup },
                                            IDNoInfo: { ...IDNoInfoGroup },
                                            fieldValid,
                                            onFinish: this.onFinishOtherIdentificationGroup
                                        })
                                    }
                                    style={styles.btnOtherInfo}
                                >
                                    <View style={styles.iconNext}>
                                        <IconNext size={Size.iconSize} color={Colors.white} />
                                    </View>
                                    <VnrText
                                        style={[styleSheets.lable, styleButtonAddOrEdit.groupButton__text, styles.text]}
                                        i18nKey={tranPassport}
                                    />

                                    <View style={styles.iconNext}>
                                        <IconNext size={Size.iconSize} color={Colors.primary} />
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                    </KeyboardAwareScrollView>

                    <ListButtonSave listActions={listActions} />
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    text: {
        color: Colors.primary,
        textAlign: 'center',
        flex: 1
    },
    iconNext: {
        alignItems: 'flex-end',
        justifyContent: 'flex-end',
        flexDirection: 'column'
    },
    btnOtherInfo: {
        height: Size.heightButton,
        borderRadius: styleSheets.radius_5,
        borderWidth: 1,
        borderColor: Colors.primary,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 10,
        marginVertical: 7,
        paddingHorizontal: Size.defineSpace / 2
    }
});
