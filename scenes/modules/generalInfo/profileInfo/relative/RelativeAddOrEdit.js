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
import VnrPickerMulti from '../../../../../components/VnrPickerMulti/VnrPickerMulti';
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
import { EnumIcon, EnumName, ScreenName } from '../../../../../assets/constant';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import { IconNext } from '../../../../../constants/Icons';
import VnrAutoComplete from '../../../../../components/VnrAutoComplete/VnrAutoComplete';
import moment from 'moment';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { RelativeConfirmedBusinessFunction } from './relativeConfirmed/RelativeConfirmedBusinessFunction';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrPickerAddress from '../../../../../components/VnrPickerAddress/VnrPickerAddress';

const initSateDefault = {
    IsCheckFormat: null,
    StrBlockRelativesCodeTax: null,
    IsExcludeProbation: null,
    StrBlockRelativesIDNo: null,
    IsBlockRelativesIDNo: null,
    IsBlockRelativesCodeTax: null,
    ID: null,
    Profile: {},
    //Làm cùng công ty
    IsCheckCompany: {
        label: 'HRM_HR_Relatives_IsCheckCompany',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true,
        //Tên người thân - chọn nhân viên
        SameCompanyProfileID: {
            label: 'HRM_Attendance_Overtime_ProfileName',
            disable: false,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        //Tên người thân - tự nhập
        RelativeName: {
            label: 'HRM_HR_Relatives_RelativeName',
            disable: false,
            refresh: false,
            value: null,
            visibleConfig: true,
            visible: true
        }
    },
    //Loại quan hệ
    RelativeTypeID: {
        label: 'HRM_HR_Relatives_RelativeTypeID',
        disable: false,
        refresh: false,
        data: null,
        value: null,
        visibleConfig: true,
        visible: true
    },
    //Giới tính
    Gender: {
        label: 'HRM_Hre_HouseholdInfo_Gender',
        disable: false,
        refresh: false,
        data: null,
        value: null,
        visibleConfig: true,
        visible: true
    },
    //Năm sinh
    DateYearOfBirth: {
        label: 'HRM_HR_Relatives_YearOfBirth',
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },

    // Ngày kết hôn => Default hidden => task: 0164813
    DateOfWedding: {
        label: 'HRM_HRE_Relatives_DateOfWedding',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },

    //Ngày mất
    YearOfLose: {
        label: 'HRM_HR_Relatives_LostDay',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    //Quốc tịch
    Nationality: {
        label: 'HRM_HR_Relatives_NationalityID',
        disable: false,
        refresh: false,
        data: null,
        value: null,
        visibleConfig: true,
        visible: true
    },
    //Quốc tịch 2
    Nationality2ID: {
        label: 'HRM_HR_Relatives_NationalityID',
        disable: false,
        refresh: false,
        data: null,
        value: null,
        visibleConfig: true,
        visible: true
    },
    //Dân tộc
    EthnicID: {
        label: 'HRM_HR_Profile_EthnicID',
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
    FileAttach: {
        label: 'HRM_Rec_JobVacancy_FileAttachment',
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
    //Thêm vào hộ khẩu
    IsHouseHold: {
        label: 'HRM_Profile_AddToHousehold',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true,
        //Số sổ hộ khẩu
        HouseholdNo: {
            label: 'HRM_Profile_HouseholdNumber',
            disable: false,
            refresh: false,
            value: null,
            visibleConfig: true,
            visible: true
        },
        //Quan hệ với chủ hộ
        HouseholdType: {
            label: 'HRM_Hre_HouseholdInfo_HouseholdTypeID',
            disable: false,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        //Mã số BHXH
        // SocialInsNo: {
        //     label: 'HRM_Profile_SocialInsNumber',
        //     disable: false,
        //     refresh: false,
        //     value: null,
        //     visibleConfig: true,
        //     visible: true
        // },
        //Quyển số
        HouseholdInfoBookNo: {
            label: 'HRM_Hre_HouseholdInfo_BookNo',
            disable: false,
            refresh: false,
            value: null,
            visibleConfig: true,
            visible: true
        }
    },
    //Thêm người phụ thuộc
    CheckAddDependant: {
        label: 'HRM_HR_Relatives_CheckAddDependant',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true,
        //Tháng áp dụng
        MonthOfEffect: {
            label: 'HRM_HR_Dependant_MonthOfEffect',
            value: null,
            refresh: false,
            visibleConfig: true,
            visible: true
        },
        //Tháng kết thúc
        MonthOfExpiry: {
            label: 'HRM_HR_Dependant_MonthOfExpiry',
            value: null,
            refresh: false,
            visibleConfig: true,
            visible: true
        },
        //Mã số thuế NPT
        CodeTax: {
            label: 'HRM_HR_Dependant_CodeTax',
            disable: false,
            refresh: false,
            value: null,
            visibleConfig: true,
            visible: true
        }
    },
    //Địa chỉ Thường chú, Tạm chú
    AddressInformation: {
        label: 'HRM_Hre_Relatives_AddressInformation',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true,
        PCountryID: {
            label: 'HRM_Hre_Relatives_CountryPermanent',
            disable: false,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        PProvinceID: {
            label: 'HRM_Hre_Relatives_ProvincePermanent',
            disable: true,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        PDistrictID: {
            label: 'HRM_Hre_Relatives_DistrictPermanent',
            disable: true,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        PVillageID: {
            label: 'HRM_Hre_Dependant_WardPermanent',
            disable: true,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        PAddress2: {
            label: 'HRM_Hre_Relatives_AddressPermanent',
            disable: false,
            refresh: false,
            value: null,
            visibleConfig: true,
            visible: true
        },
        TCountryID: {
            label: 'HRM_Hre_Relatives_CountryTemporary',
            disable: false,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        TProvinceID: {
            label: 'HRM_Hre_Relatives_ProvinceTemporary',
            disable: true,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        TDistrictID: {
            label: 'HRM_Hre_Relatives_DistrictTemporary',
            disable: true,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        TVillageID: {
            label: 'HRM_Hre_Relatives_WardTemporary',
            disable: true,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        TAddress2: {
            label: 'HRM_Hre_Relatives_AddressTemporary',
            disable: false,
            refresh: false,
            value: null,
            visibleConfig: true,
            visible: true
        }
    },
    //Thêm khai sinh
    BirthCertificateGroup: {
        label: 'HRM_HR_BirthCertificate',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true,
        //Số chứng từ
        NoDocument: {
            label: 'HRM_HR_Relatives_NoDocument',
            disable: false,
            refresh: false,
            value: null,
            visibleConfig: true,
            visible: true
        },
        //Quyển sổ
        RelativeVolDocument: {
            label: 'RelativeVolDocument',
            disable: false,
            refresh: false,
            value: null,
            visibleConfig: true,
            visible: true
        },
        //Số định danh
        IdentifierNumber: {
            label: 'IdentifierNumber',
            disable: false,
            refresh: false,
            value: null,
            visibleConfig: true,
            visible: true
        },
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
            disable: true,
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
        Address: {
            label: 'HRM_HR_Relatives_Address',
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
        RelativesIDCardIssuePlaceID: {
            label: 'HRM_HRE_Relatives_PlaceOfIssuanceOfIdentityCard',
            disable: false,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },

        // PlaceOfIssuanceOfIdentityCard task: 0164813 => default hidden
        PlaceOfIssuanceOfIdentityCard: {
            label: 'HRM_HRE_Relatives_PlaceOfIssuanceOfIdentityCard',
            disable: false,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        DateOfIssuanceOfIdentityCard: {
            label: 'HRM_HRE_Relatives_DateOfIssuanceOfIdentityCard',
            value: null,
            refresh: false,
            disable: false,
            visibleConfig: true,
            visible: true
        },
        ExpiryDateOfIdentityCard: {
            label: 'HRM_HRE_Relatives_ExpiryDateOfIdentityCard',
            value: null,
            refresh: false,
            disable: false,
            visibleConfig: true,
            visible: true
        }
    },
    IdentificationNo: {
        visibleConfig: true
    },
    RelativesIDCardIssuePlaceID: {
        visibleConfig: true
    },

    // PlaceOfIssuanceOfIdentityCard task: 0164813 => default hidden
    PlaceOfIssuanceOfIdentityCard: {
        visibleConfig: true
    },
    DateOfIssuanceOfIdentityCard: {
        visibleConfig: true
    },
    ExpiryDateOfIdentityCard: {
        visibleConfig: true
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
        RelativesIDPlaceOfIssueID: {
            label: 'HRM_HRE_Relatives_RelativesIDPlaceOfIssue',
            disable: false,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        RelativesIDPlaceOfIssue: {
            label: 'HRM_HRE_Relatives_RelativesIDPlaceOfIssue',
            disable: false,
            refresh: false,
            data: null,
            value: null,
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
        },
        IDDateOfExpiry: {
            label: 'HRM_HR_Relatives_IDDateOfExpiry',
            value: null,
            refresh: false,
            disable: false,
            visibleConfig: true,
            visible: true
        }
    },
    IDNo: {
        visibleConfig: true
    },
    RelativesIDPlaceOfIssueID: {
        visibleConfig: true
    },
    RelativesIDPlaceOfIssue: {
        visibleConfig: true
    },
    IDDateOfIssue: {
        visibleConfig: true
    },
    IDDateOfExpiry: {
        visibleConfig: true
    },

    //Thêm Hộ chiếu
    RelativesPassportGroup: {
        label: 'HRM_HR_Passport_Portal',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true,
        RelativesPassportNo: {
            label: 'HRM_HR_Profile_PassportNo',
            disable: false,
            refresh: false,
            value: null,
            visibleConfig: true,
            visible: true
        },
        RelativesPassportIssuePlaceID: {
            label: 'HRM_HR_Profile_PassportPlaceOfIssue',
            disable: false,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        RelativesPassportPlaceOfIssue: {
            label: 'HRM_HR_Profile_PassportPlaceOfIssue',
            disable: false,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        RelativesPassportDateOfIssue: {
            label: 'HRM_HR_Profile_PassportDateOfIssue',
            value: null,
            refresh: false,
            disable: false,
            visibleConfig: true,
            visible: true
        },
        RelativesPassportDateOfExpiry: {
            label: 'HRM_HR_Profile_PassportDateOfExpiry',
            value: null,
            refresh: false,
            disable: false,
            visibleConfig: true,
            visible: true
        }
    },
    RelativesPassportNo: {
        visibleConfig: true
    },
    RelativesPassportIssuePlaceID: {
        visibleConfig: true
    },
    RelativesPassportPlaceOfIssue: {
        visibleConfig: true
    },
    RelativesPassportDateOfIssue: {
        visibleConfig: true
    },
    RelativesPassportDateOfExpiry: {
        visibleConfig: true
    },

    fieldValid: {},

    // task: 0164813
    // Mã y tế
    CodeMedRelatives: {
        label: 'HRM_HR_ProfileInfor_CodeMedRelatives',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },

    // Số sổ BHXH
    SocialInsNo: {
        label: 'HRM_HR_Profile_SocialInsBookNo',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },

    // Số thẻ BHYT
    HealthInsNo: {
        label: 'HRM_HR_Profile_HealthInsNo',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },

    // Địa chỉ
    RelativeAddress: {
        label: 'HRM_Category_Cat_HRPlanningPeriod_Address',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },

    // Địa chỉ tạm trú
    RelativeTAddress: {
        label: 'HRM_HR_Profile_TAAddress',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },

    // Ngày kết thúc
    EndDate: {
        label: 'Tra_ExternalTraineeRequest_EndStart',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },

    // Quốc gia
    CountryID_NDK: {
        visible: true,
        visibleConfig: true,
        label: 'HRM_Portal_CountryID_NDK',
        data: [],
        disable: false,
        refresh: false,
        value: null
    },

    // Tỉnh thành
    ProvinceID_NDK: {
        visible: true,
        visibleConfig: true,
        label: 'HRM_Portal_ProvinceID_NDK',
        data: [],
        disable: true,
        refresh: false,
        value: null
    },

    // Quận huyện
    DistrictID_NDK: {
        visible: true,
        visibleConfig: true,
        label: 'HRM_Portal_DistrictID_NDK',
        data: [],
        disable: true,
        refresh: false,
        value: null
    },

    // Phường xã
    WardID_NDK: {
        visible: true,
        visibleConfig: true,
        label: 'HRM_Portal_WardID_NDK',
        data: [],
        disable: true,
        refresh: false,
        value: null
    },

    //Số nhà/Tên đường
    Address_NDK: {
        visible: true,
        visibleConfig: true,
        label: 'HRM_Portal_Address_NDK',
        data: [],
        disable: false,
        refresh: false,
        value: null
    },
    // Đã mất
    IsLost: {
        label: 'HRM_Hre_Relatives_IsLost',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true
    },

    // Không hiển thị trên Portal/App
    IsNotDisplayedOnPortalApp: {
        label: 'Hrm_Hre_Relatives_IsNotDisplayedOnPortalApp',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true
    },
    isUpperCaseText: {},
    fieldHiden: {}
};
export default class RelativeAddOrEdit extends Component {
    constructor(porps) {
        super(porps);
        this.state = initSateDefault;

        this.setVariable();

        porps.navigation.setParams({
            title: porps.navigation.state.params.record ? 'HRM_HR_Relative_PopUp_Edit_Title' : 'HRM_HR_Relatives_AddNew'
        });
    }

    getConfigUpperTextForField = () => {
        HttpService.Post('[URI_HR]/Hre_GetData/IstUpperTextOfFieldTableByConfig', {
            tableName: 'Hre_Relatives'
        })
            .then(() => {})
            .catch(err => {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: err });
            });
    };

    //#region [khởi tạo , lấy các dữ liệu cho control, lấy giá trị mặc đinh]
    //promise get config valid
    getConfigValid = (tblName, isRefresh) => {
        try {
            HttpService.MultiRequest([
                HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName),
                HttpService.Post('[URI_HR]/Hre_GetData/IstUpperTextOfFieldTableByConfig', {
                    tableName: 'Hre_Relatives'
                }),
                HttpService.Get('[URI_HR]/Hre_GetDataV2/GetDefaultValueRelatives')
            ]).then(resAll => {
                VnrLoadingSevices.hide();
                if (resAll && Array.isArray(resAll) && resAll.length === 3) {
                    const [resConfigValid, resConfigUpperText, valueDefaultRelatives] = resAll,
                        { IsNotDisplayedOnPortalApp, fieldHiden } = this.state;
                    let nextState = {};
                    if (resConfigValid) {
                        try {
                            //map field hidden by config
                            const _configField =
                                    ConfigField && ConfigField.value['RelativeAddOrEdit']
                                        ? ConfigField.value['RelativeAddOrEdit']['Hidden']
                                        : [],
                                { E_ProfileID, E_FullName } = EnumName,
                                _profile = {
                                    ID: this.profileInfo[E_ProfileID],
                                    ProfileName: this.profileInfo[E_FullName]
                                };

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

                                // nhannguyen: ẩn field trường hợp lồng nhiều cấp
                                if (fieldConfig !== null && fieldConfig !== undefined) {
                                    if (nextState?.fieldHiden) {
                                        nextState = {
                                            ...nextState,
                                            fieldHiden: {
                                                ...fieldHiden,
                                                ...nextState?.fieldHiden,
                                                [fieldConfig]: true
                                            }
                                        };
                                    } else {
                                        nextState = {
                                            ...nextState,
                                            fieldHiden: {
                                                ...fieldHiden,
                                                [fieldConfig]: true
                                            }
                                        };
                                    }
                                }
                            });

                            nextState = { ...nextState, fieldValid: resConfigValid, Profile: _profile };
                        } catch (error) {
                            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                        }
                    }

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

                    if (valueDefaultRelatives) {
                        nextState = {
                            ...nextState,
                            IsNotDisplayedOnPortalApp: {
                                ...IsNotDisplayedOnPortalApp,
                                value: valueDefaultRelatives?.IsNotDisplayedOnPortalApp
                                    ? valueDefaultRelatives?.IsNotDisplayedOnPortalApp
                                    : false,
                                refresh: !IsNotDisplayedOnPortalApp.refresh
                            }
                        };
                    }

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
                }
            });
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
        // try {
        //     HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName).then(res => {

        //         if (res) {
        //             try {
        //                 VnrLoadingSevices.hide();
        //                 //map field hidden by config
        //                 const _configField = (ConfigField && ConfigField.value['RelativeAddOrEdit'])
        //                     ? ConfigField.value['RelativeAddOrEdit']['Hidden'] : [],
        //                     { E_ProfileID, E_FullName } = EnumName,
        //                     _profile = { ID: this.profileInfo[E_ProfileID], ProfileName: this.profileInfo[E_FullName] };

        //                 let nextState = { fieldValid: res, Profile: _profile };

        //                 // _configField.forEach(fieldConfig => {
        //                 //     let _field = this.state[fieldConfig];
        //                 //     if (_field && typeof (_field) === 'object') {
        //                 //         _field = {
        //                 //             ..._field,
        //                 //             visibleConfig: false
        //                 //         }

        //                 //         nextState = {
        //                 //             ...nextState,
        //                 //             [fieldConfig]: { ..._field }
        //                 //         }
        //                 //     }
        //                 // });

        //                 this.setState({ ...nextState }, () => {

        //                     let { record } = this.props.navigation.state.params;

        //                     //get config khi đăng ký
        //                     if (!record) {
        //                         this.getConfig();
        //                     }
        //                     else {
        //                         this.isModify = true;
        //                         this.setRecordForModify(record);
        //                     }
        //                 });
        //             } catch (error) {
        //                 DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        //             }
        //         }
        //     })
        // } catch (error) {
        //     DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        // }
    };

    refreshView = () => {
        const { FileAttach } = this.state;
        this.props.navigation.setParams({ title: 'HRM_HR_Relatives_AddNew' });
        this.setVariable();

        let resetState = {
            ...initSateDefault,
            FileAttach: {
                ...FileAttach,
                value: null,
                refresh: !FileAttach.refresh
            }
        };
        this.setState(resetState, () => this.getConfigValid('Hre_RelativesPortal', true));
    };

    setVariable = () => {
        this.stateBackup = null;
        this.isModify = false;
        this.isSaveContinue = null;
        this.profileInfo = dataVnrStorage && dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info : {};
    };

    componentDidMount() {
        VnrLoadingSevices.show();
        this.getConfigValid('Hre_RelativesPortal');
    }

    setRecordForModify = response => {
        let nextState = {};

        const {
                IsCheckCompany,
                //Loại quan hệ
                RelativeTypeID,
                //Giới tính
                Gender,
                //Năm sinh
                DateYearOfBirth,
                //Ngày mất
                YearOfLose,
                //Quốc tịch
                Nationality,
                //Dân tộc
                EthnicID,
                //Số điện thoại
                PhoneNumber,
                //Nghề nghiệp
                Career,
                //Khai báo hồ sơ đã nộp
                BirthCertificate,
                //File đính kèm
                FileAttach,
                //Ghi chú
                Notes,
                //Thêm vào hộ khẩu
                IsHouseHold,
                //Thêm người phụ thuộc
                CheckAddDependant,
                // Địa chỉ thường tru, tạm trú
                AddressInformation,
                //Giấy khai sinh
                BirthCertificateGroup,
                //Hộ chiếu
                RelativesPassportGroup,
                //CCCD
                IdentificationGroup,
                //CMND
                IDNoInfoGroup,

                // task: 0164813
                // Ngày kết hôn
                DateOfWedding,
                // Quốc tịch 2
                Nationality2ID,
                // Mã y tế
                CodeMedRelatives,
                // Số sổ BHXH
                SocialInsNo,

                CountryID_NDK,
                // Tỉnh thành
                ProvinceID_NDK,
                // Quận huyện
                DistrictID_NDK,
                // Tên phường xã
                WardID_NDK,
                //Số nhà/Tên đường
                Address_NDK,
                // Số thẻ BHYT
                HealthInsNo,
                // Địa chỉ
                RelativeAddress,
                // Địa chỉ tạm trú
                RelativeTAddress,
                // Ngày kết thúc
                EndDate,

                IsLost,
                IsNotDisplayedOnPortalApp
            } = this.state,
            {
                //Tên người thân - chọn nhân viên
                SameCompanyProfileID,
                //Tên người thân - tự nhập
                RelativeName
            } = IsCheckCompany,
            {
                //Tháng áp dụng
                MonthOfEffect,
                //Tháng kết thúc
                MonthOfExpiry,
                //Mã số thuế NPT
                CodeTax
            } = CheckAddDependant,
            {
                //Số sổ hộ khẩu
                HouseholdNo,
                //Quan hệ với chủ hộ
                HouseholdType,
                //Mã số BHXH
                // SocialInsNo,
                //Quyển số
                HouseholdInfoBookNo
            } = IsHouseHold,
            {
                PCountryID,
                PProvinceID,
                PDistrictID,
                PVillageID,
                PAddress2,
                TCountryID,
                TProvinceID,
                TDistrictID,
                TVillageID,
                TAddress2
            } = AddressInformation,
            //giấy khai sinh
            {
                //Số chứng từ
                NoDocument,
                //Quyển sổ
                RelativeVolDocument,
                IdentifierNumber
            } = BirthCertificateGroup,
            //CMND
            { IDNo, RelativesIDPlaceOfIssue, RelativesIDPlaceOfIssueID, IDDateOfIssue, IDDateOfExpiry } = IDNoInfoGroup,
            //CCCD
            {
                IdentificationNo,
                RelativesIDCardIssuePlaceID,
                PlaceOfIssuanceOfIdentityCard,
                DateOfIssuanceOfIdentityCard,
                ExpiryDateOfIdentityCard
            } = IdentificationGroup,
            //Hộ chiếu
            {
                RelativesPassportNo,
                RelativesPassportIssuePlaceID,
                RelativesPassportPlaceOfIssue,
                RelativesPassportDateOfIssue,
                RelativesPassportDateOfExpiry
            } = RelativesPassportGroup;

        const { data } = BirthCertificate;
        let setValueBirthCertificate = [];

        data.forEach(item => {
            let fieldName = item.Value;

            if (response[fieldName]) {
                setValueBirthCertificate.push({ ...item });
            }
        });

        nextState = {
            ID: response.ID,
            IsCheckCompany: {
                ...IsCheckCompany,
                value: response.IsCheckCompany,
                refresh: !IsCheckCompany.refresh,

                //Tên người thân - chọn nhân viên
                SameCompanyProfileID: {
                    ...SameCompanyProfileID,
                    value: response.SameCompanyProfileID
                        ? { ID: response.SameCompanyProfileID, ProfileName: response.RelativeName }
                        : null,
                    refresh: !SameCompanyProfileID.refresh
                },
                //Tên người thân - tự nhập
                RelativeName: {
                    ...RelativeName,
                    value: response.RelativeName,
                    refresh: !RelativeName.refresh
                }
            },
            //Loại quan hệ
            RelativeTypeID: {
                ...RelativeTypeID,
                value: response.RelativeTypeID
                    ? { ID: response.RelativeTypeID, RelativeTypeName: response.RelativeTypeName }
                    : null,
                refresh: !RelativeTypeID.refresh
            },
            //Giới tính
            Gender: {
                ...Gender,
                value: response.Gender ? { Value: response.Gender, Text: Gender.GenderView } : null,
                refresh: !Gender.refresh
            },
            //Năm sinh
            DateYearOfBirth: {
                ...DateYearOfBirth,
                value: response.DateYearOfBirth,
                refresh: !DateYearOfBirth.refresh
            },
            //Ngày mất
            YearOfLose: {
                ...YearOfLose,
                value: response.YearOfLose,
                refresh: !YearOfLose.refresh
            },
            //Quốc tịch
            Nationality: {
                ...Nationality,
                value: response.NationalityID
                    ? { ID: response.NationalityID, CountryName: response.NationalityName }
                    : null,
                refresh: !Nationality.refresh
            },
            //Dân tộc
            EthnicID: {
                ...EthnicID,
                value: response.EthnicID ? { ID: response.EthnicID, EthnicGroupName: response.EthnicGroupName } : null,
                refresh: !EthnicID.refresh
            },
            //Số điện thoại
            PhoneNumber: {
                ...PhoneNumber,
                value: response.PhoneNumber,
                refresh: !PhoneNumber.refresh
            },
            //Nghề nghiệp
            Career: {
                ...Career,
                value: response.Career,
                refresh: !Career.refresh
            },
            //Khai báo hồ sơ đã nộp
            BirthCertificate: {
                ...BirthCertificate,
                value: setValueBirthCertificate,
                refresh: !BirthCertificate.refresh
            },
            //File đính kèm
            FileAttach: {
                ...FileAttach,
                value: response.lstFileAttach ? response.lstFileAttach : null,
                disable: false,
                refresh: !FileAttach.refresh
            },
            //Ghi chú
            Notes: {
                ...Notes,
                value: response.Notes,
                refresh: !Notes.refresh
            },
            IsLost: {
                ...IsLost,
                value: response.IsLost ? response.IsLost : false,
                refresh: !IsLost.refresh
            },
            IsNotDisplayedOnPortalApp: {
                ...IsNotDisplayedOnPortalApp,
                value: response.IsNotDisplayedOnPortalApp ? response.IsNotDisplayedOnPortalApp : false,
                refresh: !IsNotDisplayedOnPortalApp.refresh
            },
            //Thêm vào hộ khẩu
            IsHouseHold: {
                ...IsHouseHold,
                value: false, //response.HouseHold, //(task: 164813)
                refresh: !IsHouseHold.refresh,
                visibleConfig: false,
                visible: false,

                //Số sổ hộ khẩu
                HouseholdNo: {
                    ...HouseholdNo,
                    value: null, // response.HouseholdNo, // (task: 164813)
                    refresh: !HouseholdNo.refresh,
                    visibleConfig: false,
                    visible: false
                },
                //Quan hệ với chủ hộ
                HouseholdType: {
                    ...HouseholdType,
                    value: null, //response.HouseholdTypeID ? { ID: response.HouseholdTypeID, RelativeTypeName: response.HouseholdTypeName } : null, // (task: 164813)
                    refresh: !HouseholdType.refresh,
                    visibleConfig: false,
                    visible: false
                },
                //Mã số BHXH
                // SocialInsNo: {
                //     ...SocialInsNo,
                //     value: response.SocialInsNo,
                //     refresh: !SocialInsNo.refresh
                // },
                //Quyển số
                HouseholdInfoBookNo: {
                    ...HouseholdInfoBookNo,
                    value: null, //response.HouseholdInfoBookNo, // (task: 164813)
                    refresh: !HouseholdInfoBookNo.refresh,
                    visibleConfig: false,
                    visible: false
                }
            },
            //Thêm người phụ thuộc
            CheckAddDependant: {
                ...CheckAddDependant,
                value: response.CheckDependent,
                refresh: !CheckAddDependant.refresh,
                //Tháng áp dụng
                MonthOfEffect: {
                    ...MonthOfEffect,
                    value: response.MonthOfEffect,
                    refresh: !MonthOfEffect.refresh
                },
                //Tháng kết thúc
                MonthOfExpiry: {
                    ...MonthOfExpiry,
                    value: response.MonthOfExpiry,
                    refresh: !MonthOfExpiry.refresh
                },
                //Mã số thuế NPT
                CodeTax: {
                    ...CodeTax,
                    value: response.CodeTax,
                    refresh: !CodeTax.refresh
                }
            },
            AddressInformation: {
                ...AddressInformation,
                PCountryID: {
                    ...PCountryID,
                    value: response.PCountryID
                        ? { ID: response.PCountryID, CountryName: response.CountryPermanent }
                        : null,
                    refresh: !PCountryID.refresh
                },
                PProvinceID: {
                    ...PProvinceID,
                    value: response.PProvinceID
                        ? { ID: response.PProvinceID, ProvinceName: response.ProvincePermanent }
                        : null,
                    refresh: !PProvinceID.refresh
                },
                PDistrictID: {
                    ...PDistrictID,
                    value: response.PDistrictID
                        ? { ID: response.PDistrictID, DistrictName: response.DistrictPermanent }
                        : null,
                    refresh: !PDistrictID.refresh
                },
                PVillageID: {
                    ...PVillageID,
                    value: response.PVillageID
                        ? { ID: response.PVillageID, VillageName: response.WardPermanent }
                        : null,
                    refresh: !PVillageID.refresh
                },
                PAddress2: {
                    ...PAddress2,
                    value: response.PAddress2,
                    refresh: !PAddress2.refresh
                },
                TCountryID: {
                    ...TCountryID,
                    value: response.TCountryID
                        ? { ID: response.TCountryID, CountryName: response.CountryTemporary }
                        : null,
                    refresh: !TCountryID.refresh
                },
                TProvinceID: {
                    ...TProvinceID,
                    value: response.TProvinceID
                        ? { ID: response.TProvinceID, ProvinceName: response.ProvinceTemporary }
                        : null,
                    refresh: !TProvinceID.refresh
                },
                TDistrictID: {
                    ...TDistrictID,
                    value: response.TDistrictID
                        ? { ID: response.TDistrictID, DistrictName: response.DistrictTemporary }
                        : null,
                    refresh: !TDistrictID.refresh
                },
                TVillageID: {
                    ...TVillageID,
                    value: response.TVillageID
                        ? { ID: response.TVillageID, VillageName: response.WardTemporary }
                        : null,
                    refresh: !TVillageID.refresh
                },
                TAddress2: {
                    ...TAddress2,
                    value: response.TAddress2,
                    refresh: !TAddress2.refresh
                }
            },
            //Giấy khai sinh
            BirthCertificateGroup: {
                ...BirthCertificateGroup,

                //Số chứng từ
                NoDocument: {
                    ...NoDocument,
                    value: response.NoDocument,
                    refresh: !NoDocument.refresh
                },
                //Quyển sổ
                RelativeVolDocument: {
                    ...RelativeVolDocument,
                    value: response.RelativeVolDocument,
                    refresh: !RelativeVolDocument.refresh
                },
                IdentifierNumber: {
                    ...IdentifierNumber,
                    value: response.IdentifierNumber,
                    refresh: !IdentifierNumber.refresh
                }
                // task: 0164813
                // CountryID: {
                //     ...CountryID,
                //     value: response.CountryID ? { ID: response.CountryID, CountryName: response.CountryName } : null,
                //     refresh: !CountryID.refresh
                // },
                // ProvinceID: {
                //     ...ProvinceID,
                //     value: response.ProvinceID ? { ID: response.ProvinceID, ProvinceName: response.ProvinceName } : null,
                //     refresh: !ProvinceID.refresh
                // },
                // DistrictID: {
                //     ...DistrictID,
                //     value: response.DistrictID ? { ID: response.DistrictID, DistrictName: response.DistrictName } : null,
                //     refresh: !DistrictID.refresh
                // },
                // WardID: {
                //     ...WardID,
                //     value: response.WardID ? { ID: response.WardID, VillageName: response.VillageName } : null,
                //     refresh: !WardID.refresh
                // },
                // Address: {
                //     ...Address,
                //     value: response.Address,
                //     refresh: !Address.refresh
                // }
            },
            //Hộ chiếu
            RelativesPassportGroup: {
                ...RelativesPassportGroup,

                RelativesPassportNo: {
                    ...RelativesPassportNo,
                    value: response.RelativesPassportNo,
                    refresh: !RelativesPassportNo.refresh
                },
                RelativesPassportIssuePlaceID: {
                    ...RelativesPassportIssuePlaceID,
                    value: response.RelativesPassportIssuePlaceID
                        ? {
                            ID: response.RelativesPassportIssuePlaceID,
                            PassportIssuePlaceName: response.RelativesPassportIssuePlaceIDView
                        }
                        : null,
                    refresh: !RelativesPassportIssuePlaceID.refresh
                },
                RelativesPassportPlaceOfIssue: {
                    ...RelativesPassportPlaceOfIssue,
                    value: response.RelativesPassportPlaceOfIssue
                        ? { ProvinceName: response.RelativesPassportPlaceOfIssue }
                        : null,
                    refresh: !RelativesPassportPlaceOfIssue.refresh
                },
                RelativesPassportDateOfIssue: {
                    ...RelativesPassportDateOfIssue,
                    value: response.RelativesPassportDateOfIssue,
                    refresh: !RelativesPassportDateOfIssue.refresh
                },
                RelativesPassportDateOfExpiry: {
                    ...RelativesPassportDateOfExpiry,
                    value: response.RelativesPassportDateOfExpiry,
                    refresh: !RelativesPassportDateOfExpiry.refresh
                }
            },
            //CCCD
            IdentificationGroup: {
                ...IdentificationGroup,

                IdentificationNo: {
                    ...IdentificationNo,
                    value: response.IdentificationNo,
                    refresh: !IdentificationNo.refresh
                },
                PlaceOfIssuanceOfIdentityCard: {
                    ...PlaceOfIssuanceOfIdentityCard,
                    value: response.PlaceOfIssuanceOfIdentityCard
                        ? { IDCardIssuePlaceName: response.PlaceOfIssuanceOfIdentityCard }
                        : null,
                    refresh: !PlaceOfIssuanceOfIdentityCard.refresh
                },
                RelativesIDCardIssuePlaceID: {
                    ...RelativesIDCardIssuePlaceID,
                    value: response.RelativesIDCardIssuePlaceID
                        ? {
                            ID: response.RelativesIDCardIssuePlaceID,
                            ProvinceName: response.RelativesIDCardIssuePlaceID
                        }
                        : null,
                    refresh: !RelativesIDCardIssuePlaceID.refresh
                },
                DateOfIssuanceOfIdentityCard: {
                    ...DateOfIssuanceOfIdentityCard,
                    value: response.DateOfIssuanceOfIdentityCard,
                    refresh: !DateOfIssuanceOfIdentityCard.refresh
                },
                ExpiryDateOfIdentityCard: {
                    ...ExpiryDateOfIdentityCard,
                    value: response.ExpiryDateOfIdentityCard,
                    refresh: !ExpiryDateOfIdentityCard.refresh
                }
            },
            //CMND
            IDNoInfoGroup: {
                ...IDNoInfoGroup,

                IDNo: {
                    ...IDNo,
                    value: response.IDNo,
                    refresh: !IDNo.refresh
                },
                RelativesIDPlaceOfIssue: {
                    ...RelativesIDPlaceOfIssue,
                    value: response.RelativesIDPlaceOfIssue ? { ProvinceName: response.RelativesIDPlaceOfIssue } : null,
                    refresh: !RelativesIDPlaceOfIssue.refresh
                },
                RelativesIDPlaceOfIssueID: {
                    ...RelativesIDPlaceOfIssueID,
                    value: response.RelativesIDPlaceOfIssueID
                        ? {
                            ID: response.RelativesIDPlaceOfIssueID,
                            ProvinceName: response.RelativesIDPlaceOfIssueID
                        }
                        : null,
                    refresh: !RelativesIDPlaceOfIssueID.refresh
                },
                IDDateOfIssue: {
                    ...IDDateOfIssue,
                    value: response.IDDateOfIssue,
                    refresh: !IDDateOfIssue.refresh
                },
                IDDateOfExpiry: {
                    ...IDDateOfExpiry,
                    value: response.IDDateOfExpiry,
                    refresh: !IDDateOfExpiry.refresh
                }
            },

            // task: 0164813
            DateOfWedding: {
                ...DateOfWedding,
                value: response.DateOfWedding ? moment(response.DateOfWedding) : null,
                visible: response.DateOfWedding != null ? true : false,
                refresh: !DateOfWedding.refresh
            },

            CountryID_NDK: {
                ...CountryID_NDK,
                value: response.CountryID ? { ID: response.CountryID, CountryName: response.CountryName } : null,
                disable: false,
                refresh: !CountryID_NDK.refresh
            },
            ProvinceID_NDK: {
                ...ProvinceID_NDK,
                value: response.ProvinceID ? { ID: response.ProvinceID, ProvinceName: response.ProvinceName } : null,
                disable: false,
                refresh: !ProvinceID_NDK.refresh
            },
            DistrictID_NDK: {
                ...DistrictID_NDK,
                value: response.DistrictID ? { ID: response.DistrictID, DistrictName: response.DistrictName } : null,
                disable: false,
                refresh: !DistrictID_NDK.refresh
            },
            WardID_NDK: {
                ...WardID_NDK,
                value: response.WardID ? { ID: response.WardID, VillageName: response.VillageName } : null,
                disable: false,
                refresh: !WardID_NDK.refresh
            },
            Address_NDK: {
                ...Address_NDK,
                value: response.Address,
                refresh: !Address_NDK.refresh
            },
            //Quốc tịch 2
            Nationality2ID: {
                ...Nationality2ID,
                value: response.Nationality2ID
                    ? { ID: response.Nationality2ID, CountryName: response.Nationality2Name }
                    : null,
                refresh: !Nationality2ID.refresh
            },

            CodeMedRelatives: {
                ...CodeMedRelatives,
                value: response.CodeMedRelatives ? response.CodeMedRelatives : null,
                refresh: !CodeMedRelatives.refresh
            },

            SocialInsNo: {
                ...SocialInsNo,
                value: response.SocialInsNo ? response.SocialInsNo : null,
                refresh: !SocialInsNo.refresh
            },

            HealthInsNo: {
                ...HealthInsNo,
                value: response.HealthInsNo ? response.HealthInsNo : null,
                refresh: !HealthInsNo.refresh
            },

            RelativeAddress: {
                ...RelativeAddress,
                value: response.RelativeAddress ? response.RelativeAddress : null,
                refresh: !RelativeAddress.refresh
            },

            RelativeTAddress: {
                ...RelativeTAddress,
                value: response.RelativeTAddress ? response.RelativeTAddress : null,
                refresh: !RelativeTAddress.refresh
            },

            EndDate: {
                ...EndDate,
                value: response.EndDate ? moment(response.EndDate) : null,
                refresh: !EndDate.refresh
            }
        };

        this.stateBackup = JSON.stringify({ ...nextState });
        this.setState({ ...nextState }, () => {
            // this.handleLoadDataNPT(response?.CountryID, response?.ProvinceID, response?.DistrictID);
            this.getDataAddress(
                response?.PCountryID,
                response.PProvinceID,
                response.PDistrictID,
                response?.PVillageID,
                response?.TCountryID,
                response.TProvinceID,
                response.TDistrictID,
                response?.TVillageID
            );
        });
    };

    getDataAddress = (countryIDP, provinceIDP, districtIDP, wardIDP, countryIDT, provinceIDT, districtIDT, wardIDT) => {
        try {
            let arrPromisse = [
                HttpService.Get('[URI_HR]/Cat_GetData/GetMultiCountry?text='),
                HttpService.Get(`[URI_HR]/Cat_GetData/GetProvinceCascading?country=${countryIDP}`),
                HttpService.Get(`[URI_HR]/Cat_GetData/GetDistrictCascading?province=${provinceIDP}`),
                HttpService.Get(`[URI_HR]/Cat_GetData/GetVillageCascading?districtid=${districtIDP}`),
                HttpService.Get(`[URI_HR]/Cat_GetData/GetProvinceCascading?country=${countryIDT}`),
                HttpService.Get(`[URI_HR]/Cat_GetData/GetDistrictCascading?province=${provinceIDT}`),
                HttpService.Get(`[URI_HR]/Cat_GetData/GetVillageCascading?districtid=${districtIDT}`)
            ];

            HttpService.MultiRequest(arrPromisse).then(resAll => {
                if (resAll) {
                    const [
                        dataCountrys,
                        dataProvinces,
                        dataDistricts,
                        dataWards,
                        dataProvincesT,
                        dataDistrictsT,
                        dataWardsT
                    ] = resAll;
                    const { AddressInformation } = this.state,
                        {
                            PCountryID,
                            PProvinceID,
                            PDistrictID,
                            PVillageID,
                            TCountryID,
                            TProvinceID,
                            TDistrictID,
                            TVillageID
                        } = AddressInformation;
                    let nextState = {};
                    if (Array.isArray(dataCountrys) && countryIDP) {
                        const rs = dataCountrys.filter(item => item?.ID === countryIDP);
                        if (rs.length > 0) {
                            if (nextState?.AddressInformation) {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...nextState?.AddressInformation,
                                        PCountryID: {
                                            ...PCountryID,
                                            value: rs[0].ID ? { ID: rs[0].ID, CountryName: rs[0].CountryName } : null,
                                            disable: false,
                                            refresh: !PCountryID.refresh
                                        }
                                    }
                                };
                            } else {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...AddressInformation,
                                        PCountryID: {
                                            ...PCountryID,
                                            value: rs[0].ID ? { ID: rs[0].ID, CountryName: rs[0].CountryName } : null,
                                            disable: false,
                                            refresh: !PCountryID.refresh
                                        }
                                    }
                                };
                            }
                        }
                    }

                    if (Array.isArray(dataProvinces) && provinceIDP) {
                        const rs = dataProvinces.filter(item => item?.ID === provinceIDP);
                        if (rs.length > 0) {
                            if (nextState?.AddressInformation) {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...nextState?.AddressInformation,
                                        PProvinceID: {
                                            ...PProvinceID,
                                            value: rs[0].ID ? { ID: rs[0].ID, ProvinceName: rs[0].ProvinceName } : null,
                                            disable: false,
                                            refresh: !PProvinceID.refresh
                                        }
                                    }
                                };
                            } else {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...AddressInformation,
                                        PProvinceID: {
                                            ...PProvinceID,
                                            value: rs[0].ID ? { ID: rs[0].ID, ProvinceName: rs[0].ProvinceName } : null,
                                            disable: false,
                                            refresh: !PProvinceID.refresh
                                        }
                                    }
                                };
                            }
                        }
                    }

                    if (Array.isArray(dataDistricts) && districtIDP) {
                        const rs = dataDistricts.filter(item => item?.ID === districtIDP);
                        if (rs.length > 0) {
                            if (nextState?.AddressInformation) {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...nextState?.AddressInformation,
                                        PDistrictID: {
                                            ...PDistrictID,
                                            value: rs[0].ID ? { ID: rs[0].ID, DistrictName: rs[0].DistrictName } : null,
                                            disable: false,
                                            refresh: !PDistrictID.refresh
                                        }
                                    }
                                };
                            } else {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...AddressInformation,
                                        PDistrictID: {
                                            ...PDistrictID,
                                            value: rs[0].ID ? { ID: rs[0].ID, DistrictName: rs[0].DistrictName } : null,
                                            disable: false,
                                            refresh: !PDistrictID.refresh
                                        }
                                    }
                                };
                            }
                        }
                    }

                    if (Array.isArray(dataWards) && wardIDP) {
                        const rs = dataWards.filter(item => item?.ID === wardIDP);
                        if (rs.length > 0) {
                            if (nextState?.AddressInformation) {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...nextState?.AddressInformation,
                                        PVillageID: {
                                            ...PVillageID,
                                            value: rs[0].ID ? { ID: rs[0].ID, VillageName: rs[0].VillageName } : null,
                                            disable: false,
                                            refresh: !PVillageID.refresh
                                        }
                                    }
                                };
                            } else {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...AddressInformation,
                                        PVillageID: {
                                            ...PVillageID,
                                            value: rs[0].ID ? { ID: rs[0].ID, VillageName: rs[0].VillageName } : null,
                                            disable: false,
                                            refresh: !PVillageID.refresh
                                        }
                                    }
                                };
                            }
                        }
                    }

                    if (Array.isArray(dataCountrys) && countryIDT) {
                        const rs = dataCountrys.filter(item => item?.ID === countryIDT);
                        if (rs.length > 0) {
                            if (nextState?.AddressInformation) {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...nextState?.AddressInformation,
                                        TCountryID: {
                                            ...TCountryID,
                                            value: rs[0].ID ? { ID: rs[0].ID, CountryName: rs[0].CountryName } : null,
                                            disable: false,
                                            refresh: !TCountryID.refresh
                                        }
                                    }
                                };
                            } else {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...AddressInformation,
                                        TCountryID: {
                                            ...TCountryID,
                                            value: rs[0].ID ? { ID: rs[0].ID, CountryName: rs[0].CountryName } : null,
                                            disable: false,
                                            refresh: !TCountryID.refresh
                                        }
                                    }
                                };
                            }
                        }
                    }

                    if (Array.isArray(dataProvincesT) && provinceIDT) {
                        const rs = dataProvincesT.filter(item => item?.ID === provinceIDT);
                        if (rs.length > 0) {
                            if (nextState?.AddressInformation) {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...nextState?.AddressInformation,
                                        TProvinceID: {
                                            ...TProvinceID,
                                            value: rs[0].ID ? { ID: rs[0].ID, ProvinceName: rs[0].ProvinceName } : null,
                                            disable: false,
                                            refresh: !TProvinceID.refresh
                                        }
                                    }
                                };
                            } else {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...AddressInformation,
                                        TProvinceID: {
                                            ...TProvinceID,
                                            value: rs[0].ID ? { ID: rs[0].ID, ProvinceName: rs[0].ProvinceName } : null,
                                            disable: false,
                                            refresh: !TProvinceID.refresh
                                        }
                                    }
                                };
                            }
                        }
                    }

                    if (Array.isArray(dataDistrictsT) && districtIDT) {
                        const rs = dataDistrictsT.filter(item => item?.ID === districtIDT);
                        if (rs.length > 0) {
                            if (nextState?.AddressInformation) {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...nextState?.AddressInformation,
                                        TDistrictID: {
                                            ...TDistrictID,
                                            value: rs[0].ID ? { ID: rs[0].ID, DistrictName: rs[0].DistrictName } : null,
                                            disable: false,
                                            refresh: !TDistrictID.refresh
                                        }
                                    }
                                };
                            } else {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...AddressInformation,
                                        TDistrictID: {
                                            ...TDistrictID,
                                            value: rs[0].ID ? { ID: rs[0].ID, DistrictName: rs[0].DistrictName } : null,
                                            disable: false,
                                            refresh: !TDistrictID.refresh
                                        }
                                    }
                                };
                            }
                        }
                    }

                    if (Array.isArray(dataWardsT) && wardIDT) {
                        const rs = dataWardsT.filter(item => item?.ID === wardIDT);
                        if (rs.length > 0) {
                            if (nextState?.AddressInformation) {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...nextState?.AddressInformation,
                                        TVillageID: {
                                            ...TVillageID,
                                            value: rs[0].ID ? { ID: rs[0].ID, VillageName: rs[0].VillageName } : null,
                                            disable: false,
                                            refresh: !TVillageID.refresh
                                        }
                                    }
                                };
                            } else {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...AddressInformation,
                                        TVillageID: {
                                            ...TVillageID,
                                            value: rs[0].ID ? { ID: rs[0].ID, VillageName: rs[0].VillageName } : null,
                                            disable: false,
                                            refresh: !TVillageID.refresh
                                        }
                                    }
                                };
                            }
                        }
                    }

                    this.setState(nextState);
                }
            });
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    // handleLoadDataNPT = (countryID = this.state.CountryID_NDK.value?.ID,
    //     provinceID = this.state.ProvinceID_NDK.value?.ID,
    //     districtID = this.state.DistrictID_NDK.value?.ID) => {
    //     HttpService.MultiRequest([
    //         HttpService.Get('[URI_HR]//Cat_GetData/GetMultiCountry?text='),
    //         HttpService.Get(`[URI_HR]//Cat_GetData/GetProvinceCascading?country=${countryID}`),
    //         HttpService.Get(`[URI_HR]//Cat_GetData/GetDistrictCascading?province=${provinceID}`),
    //         HttpService.Get(`[URI_HR]//Cat_GetData/GetVillageCascading?districtid=${districtID}`),
    //     ]).then((resAll) => {
    //         if (resAll && Array.isArray(resAll) && resAll.length === 4) {
    //             let nextState = {};
    //             const [dataCountry, dataProvince, dataDistrict, dataWard] = resAll,
    //                 { CountryID_NDK, ProvinceID_NDK, DistrictID_NDK, WardID_NDK } = this.state;

    //             nextState = {
    //                 ...nextState,
    //                 CountryID_NDK: {
    //                     ...CountryID_NDK,
    //                     data: dataCountry,
    //                     refresh: !CountryID_NDK.refresh
    //                 },

    //                 ProvinceID_NDK: {
    //                     ...ProvinceID_NDK,
    //                     data: dataProvince,
    //                     refresh: !ProvinceID_NDK.refresh
    //                 },

    //                 DistrictID_NDK: {
    //                     ...DistrictID_NDK,
    //                     data: dataDistrict,
    //                     refresh: !DistrictID_NDK.refresh
    //                 },

    //                 WardID_NDK: {
    //                     ...WardID_NDK,
    //                     data: dataWard,
    //                     refresh: !WardID_NDK.refresh
    //                 }
    //             };

    //             this.setState(nextState);
    //         }
    //     }).catch((error) => {
    //         DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
    //     })
    // }

    getConfig = () => {};

    onFinishAddressInformation = data => {
        const { AddressInformation } = this.state;

        this.setState({
            AddressInformation: {
                ...AddressInformation,
                ...data
            }
        });
    };

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

    warningCodeTax = value => {
        //Mã số thuế NPT phải 10 số
        if (value && value.length == 10) {
            return true;
        } else {
            ToasterSevice.showWarning('HRM_Hr_TaxCodeIs10', 4000);
            return false;
        }
    };

    warningCMND = value => {
        //[Số CMND] phải là 9 hoặc 12 số
        if (value && (value.length == 9 || value.length == 12)) {
            return true;
        } else {
            ToasterSevice.showWarning('HRM_HR_Profile_IDNoMust9or12', 4000);
            return false;
        }
    };

    warningCCCD = value => {
        //[Số CCCD] phải là 12 số
        if (value && value.length == 12) {
            return true;
        } else {
            ToasterSevice.showWarning('HRM_HR_Profile_IDCardMust9or12', 4000);
            return false;
        }
    };

    compareData = params => {
        if (this.stateBackup == null) return false;

        const state = JSON.parse(this.stateBackup);
        let params2 = this.getParamsFromData(state);

        if (Vnr_Function.compare(params2, params)) {
            return true;
        }

        return false;
    };

    getParamsFromData = state => {
        const {
                IsCheckFormat,
                StrBlockRelativesCodeTax,
                IsExcludeProbation,
                StrBlockRelativesIDNo,
                IsBlockRelativesIDNo,
                IsBlockRelativesCodeTax,
                IsCheckCompany,
                //Loại quan hệ
                RelativeTypeID,
                //Giới tính
                Gender,
                //Năm sinh
                DateYearOfBirth,
                // Ngày kết hôn => Task: 0164813
                DateOfWedding,
                //Ngày mất
                YearOfLose,
                //Quốc tịch
                Nationality,
                //Dân tộc
                EthnicID,
                //Số điện thoại
                PhoneNumber,
                //Nghề nghiệp
                Career,
                AddressInformation,
                //Khai báo hồ sơ đã nộp
                BirthCertificate,
                //File đính kèm
                FileAttach,
                //Ghi chú
                Notes,
                //Thêm vào hộ khẩu
                IsHouseHold,
                //Thêm người phụ thuộc
                CheckAddDependant,
                //Giấy khai sinh
                BirthCertificateGroup,
                //Hộ chiếu
                RelativesPassportGroup,
                //CCCD
                IdentificationGroup,
                //CMND
                IDNoInfoGroup,

                // task: 164813
                // Địa chỉ tạm trú
                RelativeTAddress,
                // Ngày kết thúc
                EndDate,
                // Số sổ BHXH
                SocialInsNo,
                // Quốc gia
                CountryID_NDK,
                // Tỉnh thành
                ProvinceID_NDK,
                // Quận huyện
                DistrictID_NDK,
                // Tên phường xã
                WardID_NDK,
                //Số nhà/Tên đường
                Address_NDK,
                // Mã y tế
                CodeMedRelatives,
                // Số thẻ BHYT
                HealthInsNo,
                //Quốc tịch 2
                Nationality2ID,
                // Địa chỉ
                RelativeAddress,
                IsLost,
                IsNotDisplayedOnPortalApp
            } = state,
            {
                //Tên người thân - chọn nhân viên
                SameCompanyProfileID,
                //Tên người thân - tự nhập
                RelativeName
            } = IsCheckCompany,
            {
                //Tháng áp dụng
                MonthOfEffect,
                //Tháng kết thúc
                MonthOfExpiry,
                //Mã số thuế NPT
                CodeTax
            } = CheckAddDependant,
            {
                //Số sổ hộ khẩu
                HouseholdNo,
                //Quan hệ với chủ hộ
                HouseholdType,
                //Mã số BHXH
                // SocialInsNo,
                //Quyển số
                HouseholdInfoBookNo
            } = IsHouseHold,
            {
                PCountryID,
                PProvinceID,
                PDistrictID,
                PVillageID,
                PAddress2,
                TCountryID,
                TProvinceID,
                TDistrictID,
                TVillageID,
                TAddress2
            } = AddressInformation,
            {
                //Số chứng từ
                NoDocument,
                //Quyển sổ
                RelativeVolDocument,
                IdentifierNumber
            } = BirthCertificateGroup,
            {
                RelativesPassportNo,
                RelativesPassportIssuePlaceID,
                RelativesPassportPlaceOfIssue,
                RelativesPassportDateOfIssue,
                RelativesPassportDateOfExpiry
            } = RelativesPassportGroup,
            {
                IdentificationNo,
                RelativesIDCardIssuePlaceID,
                PlaceOfIssuanceOfIdentityCard,
                DateOfIssuanceOfIdentityCard,
                ExpiryDateOfIdentityCard
            } = IdentificationGroup,
            { IDNo, RelativesIDPlaceOfIssueID, RelativesIDPlaceOfIssue, IDDateOfIssue, IDDateOfExpiry } = IDNoInfoGroup;

        let params = {
            IsLost: IsLost.value,
            IsNotDisplayedOnPortalApp: IsNotDisplayedOnPortalApp.value,
            IdentifierNumber: IdentifierNumber.value,
            Career: Career.value ? Career.value : null,
            CheckAddDependant: CheckAddDependant.value,
            CodeTax: CodeTax.value,
            DateOfIssuanceOfIdentityCard: DateOfIssuanceOfIdentityCard.value,
            DateYearOfBirth: DateYearOfBirth.value ? moment(DateYearOfBirth.value).format('YYYY-MM-DD') : null,
            // Ngày kết hôn => task: 0164813
            DateOfWedding: DateOfWedding.value ? moment(DateOfWedding.value).format('M/D/YYYY LT') : null,
            EthnicID: EthnicID.value ? EthnicID.value.ID : null,
            ExpiryDateOfIdentityCard: ExpiryDateOfIdentityCard.value,
            Gender: Gender.value ? Gender.value.Value : null,
            IsHouseHold: IsHouseHold.value,
            HouseHold: IsHouseHold.value,
            HouseholdInfoBookNo: HouseholdInfoBookNo.value,
            HouseholdNo: HouseholdNo.value,
            HouseholdTypeID: HouseholdType.value ? HouseholdType.value.ID : null,
            IDDateOfExpiry: IDDateOfExpiry.value,
            IDDateOfIssue: IDDateOfIssue.value,
            IDNo: IDNo.value,
            FileAttach: FileAttach.value ? FileAttach.value.map(item => item.fileName).join(',') : null,
            IdentificationNo: IdentificationNo.value,
            IsBlockRelativesCodeTax:
                IsBlockRelativesCodeTax === null || IsBlockRelativesCodeTax === undefined
                    ? null
                    : IsBlockRelativesCodeTax,
            IsBlockRelativesIDNo:
                IsBlockRelativesIDNo === null || IsBlockRelativesIDNo === undefined ? null : IsBlockRelativesIDNo,
            IsCheckCompany: IsCheckCompany.value,
            IsCheckFormat: IsCheckFormat === null || IsCheckFormat === undefined ? null : IsCheckFormat,
            IsExcludeProbation:
                IsExcludeProbation === null || IsExcludeProbation === undefined ? null : IsExcludeProbation,
            IsNullMonthOfEffect: false,
            IsPortal: true,
            KeyCode: 'VN',
            MonthOfEffect: MonthOfEffect.value,
            MonthOfExpiry: MonthOfExpiry.value,
            NationalityID: Nationality.value ? Nationality.value.ID : null,
            NoDocument: NoDocument.value,
            Notes: Notes.value,
            PhoneNumber: PhoneNumber.value,
            RelativesIDCardIssuePlaceID: RelativesIDCardIssuePlaceID.value
                ? RelativesIDCardIssuePlaceID.value.ID
                : null,
            ProfileID: this.profileInfo.ProfileID,
            RelativeName: RelativeName.value,
            RelativeTypeID: RelativeTypeID.value ? RelativeTypeID.value.ID : null,
            RelativeVolDocument: RelativeVolDocument.value,
            RelativesIDPlaceOfIssueID: RelativesIDPlaceOfIssueID.value ? RelativesIDPlaceOfIssueID.value.ID : null,
            RelativesPassportDateOfExpiry: RelativesPassportDateOfExpiry.value,
            RelativesPassportDateOfIssue: RelativesPassportDateOfIssue.value,
            RelativesPassportNo: RelativesPassportNo.value,
            RelativesPassportIssuePlaceID: RelativesPassportIssuePlaceID.value
                ? RelativesPassportIssuePlaceID.value.ID
                : null,
            SameCompanyProfileID: SameCompanyProfileID.value ? SameCompanyProfileID.value.ID : null,
            SocialInsNo: SocialInsNo.value,
            StrBlockRelativesCodeTax:
                StrBlockRelativesCodeTax === null || StrBlockRelativesCodeTax === undefined
                    ? null
                    : StrBlockRelativesCodeTax,
            StrBlockRelativesIDNo:
                StrBlockRelativesIDNo === null || StrBlockRelativesIDNo === undefined ? null : StrBlockRelativesIDNo,
            UserID: this.profileInfo.userid,
            UserSubmit: this.profileInfo.ProfileID ? this.profileInfo.ProfileID : null,
            VolDocument: RelativeVolDocument.value ? RelativeVolDocument.value : null,
            YearOfLose: YearOfLose.value ? YearOfLose.value : null,
            hideIdentification: '',
            isSaveContinue: this.isSaveContinue ? this.isSaveContinue : null,
            CountryID: CountryID_NDK.value ? CountryID_NDK.value.ID : null,
            ProvinceID: ProvinceID_NDK.value ? ProvinceID_NDK.value.ID : null,
            DistrictID: DistrictID_NDK.value ? DistrictID_NDK.value.ID : null,
            WardID: WardID_NDK.value ? WardID_NDK.value.ID : null,
            Address: Address_NDK.value ? Address_NDK.value : null,
            PlaceOfIssuanceOfIdentityCard: PlaceOfIssuanceOfIdentityCard.value
                ? PlaceOfIssuanceOfIdentityCard.value.IDCardIssuePlaceName
                : null,
            RelativesIDPlaceOfIssue: RelativesIDPlaceOfIssue.value ? RelativesIDPlaceOfIssue.value.ProvinceName : null,
            RelativesPassportPlaceOfIssue: RelativesPassportPlaceOfIssue.value
                ? RelativesPassportPlaceOfIssue.value.ProvinceName
                : null,
            RelativeTAddress: RelativeTAddress.value ? RelativeTAddress.value : null,
            EndDate: EndDate.value ? moment(EndDate.value).format('YYYY-MM-DD') : null,
            CodeMedRelatives: CodeMedRelatives.value ? CodeMedRelatives.value : null,
            HealthInsNo: HealthInsNo.value ? HealthInsNo.value : null,
            Nationality2ID: Nationality2ID.value ? Nationality2ID.value.ID : null,
            RelativeAddress: RelativeAddress.value ? RelativeAddress.value : null,

            PCountryID: PCountryID.value ? PCountryID.value.ID : null,
            PProvinceID: PProvinceID.value ? PProvinceID.value.ID : null,
            PDistrictID: PDistrictID.value ? PDistrictID.value.ID : null,
            PVillageID: PVillageID.value ? PVillageID.value.ID : null,
            PAddress2: PAddress2.value ? PAddress2.value : null,

            TCountryID: TCountryID.value ? TCountryID.value.ID : null,
            TProvinceID: TProvinceID.value ? TProvinceID.value.ID : null,
            TDistrictID: TDistrictID.value ? TDistrictID.value.ID : null,
            TVillageID: TVillageID.value ? TVillageID.value.ID : null,
            TAddress2: TAddress2.value ? TAddress2.value : null
        };

        BirthCertificate.value &&
            BirthCertificate.value.forEach(item => {
                params = {
                    ...params,
                    [item.Value]: true
                };
            });

        return { ...params };
    };

    save = (navigation, isCreate, isSend) => {
        const {
                ID,
                //CCCD
                IdentificationGroup,
                //CMND
                IDNoInfoGroup
            } = this.state,
            {
                IdentificationNo
            } = IdentificationGroup,
            { IDNo } = IDNoInfoGroup,
            { apiConfig } = dataVnrStorage,
            { uriPor } = apiConfig;

        // nhan.nguyen: 0177970: 177074 Modify số ký tự tối đa cho phép nhập trên APP
        // if (CodeTax.value != null && !this.warningCodeTax(CodeTax.value)) {
        //     return;
        // }

        if (IDNo.value && !this.warningCMND(IDNo.value)) {
            return;
        }

        if (IdentificationNo.value && !this.warningCCCD(IdentificationNo.value)) {
            return;
        }

        let params = this.getParamsFromData(this.state);

        if (this.compareData(params) === true) {
            ToasterSevice.showSuccess('Hrm_Succeed', 4000);

            if (isCreate) {
                this.refreshView();
            } else {
                // navigation.goBack();
                const { reload } = this.props.navigation.state.params;
                if (reload && typeof reload === 'function') {
                    reload();
                }

                RelativeConfirmedBusinessFunction.checkForLoadEditDelete[ScreenName.RelativeWaitConfirm] = true;
                DrawerServices.navigate(ScreenName.RelativeWaitConfirm);
            }

            return;
        }

        // Send mail
        if (isSend) {
            params = {
                ...params,
                IsSubmitSave: true,
                Host: uriPor,
                IsAddNewAndSendMail: true
            };
        }

        if (ID) {
            params = {
                ...params,
                ID
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Hre_ApprovedRelatives', params).then(data => {
            VnrLoadingSevices.hide();
            if (data && typeof data == 'object') {
                if (data.ActionStatus && data.ActionStatus.split('|')[0] == 'InValid') {
                    const message = data.ActionStatus.split('|')[1];
                    ToasterSevice.showWarning(message, 4000);
                } else if (data.ActionStatus == 'OpenPopUp') {
                    // task 141521
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        iconType: EnumIcon.E_WARNING,
                        message: translate('HRM_HR_ExistingOtherRelationship_Save'),
                        textRightButton: translate('Button_OK'),
                        onCancel: () => {},
                        onConfirm: () => {
                            this.isSaveContinue = true;
                            this.save();
                        }
                    });
                } else if (data.ActionStatus != 'Success' && data.ActionStatus != translate('Success')) {
                    ToasterSevice.showWarning(data.ActionStatus, 4000);
                } else {
                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);

                    if (isCreate) {
                        this.refreshView();
                    } else {
                        // navigation.goBack();
                        // const { reload, screenName } = this.props.navigation.state.params;
                        // if (reload && typeof (reload) === 'function') {
                        //     reload();
                        // }

                        RelativeConfirmedBusinessFunction.checkForLoadEditDelete[ScreenName.RelativeWaitConfirm] = true;
                        DrawerServices.navigate(ScreenName.RelativeWaitConfirm);
                    }
                }
            }
        });
    };

    onSaveAndCreate = navigation => {
        this.save(navigation, true, null);
    };

    onSaveAndSend = navigation => {
        this.save(navigation, null, true);
    };

    onChangeSameCompany = item => {
        const { IsCheckCompany } = this.state,
            {
                //Tên người thân - chọn nhân viên
                SameCompanyProfileID
            } = IsCheckCompany;

        this.setState(
            {
                IsCheckCompany: {
                    ...IsCheckCompany,
                    SameCompanyProfileID: {
                        ...SameCompanyProfileID,
                        value: item,
                        refresh: !SameCompanyProfileID.refresh
                    }
                }
            },
            () => {
                this.getProfileIsSame(item);
            }
        );
    };

    getProfileIsSame = item => {
        if (item?.ID) {
            const {
                    IsCheckCompany,
                    Gender,
                    //Năm sinh
                    DateYearOfBirth,
                    //Quốc tịch
                    Nationality,
                    //Dân tộc
                    EthnicID,
                    //Số điện thoại
                    PhoneNumber,
                    //Nghề nghiệp
                    Career,
                    RelativesPassportGroup,
                    IdentificationGroup,
                    IDNoInfoGroup
                } = this.state,
                {
                    //Tên người thân - tự nhập
                    RelativeName
                } = IsCheckCompany,
                //CMND
                {
                    IDNo,
                    RelativesIDPlaceOfIssue,
                    RelativesIDPlaceOfIssueID,
                    IDDateOfIssue,
                    IDDateOfExpiry
                } = IDNoInfoGroup,
                //CCCD
                {
                    IdentificationNo,
                    RelativesIDCardIssuePlaceID,
                    PlaceOfIssuanceOfIdentityCard,
                    DateOfIssuanceOfIdentityCard,
                    ExpiryDateOfIdentityCard
                } = IdentificationGroup,
                //Hộ chiếu
                {
                    RelativesPassportNo,
                    RelativesPassportIssuePlaceID,
                    RelativesPassportPlaceOfIssue,
                    RelativesPassportDateOfIssue,
                    RelativesPassportDateOfExpiry
                } = RelativesPassportGroup;

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Hre_GetData/GetInfomationProfileBySameCompanyProfileID', {
                SameCompanyProfileID: item?.ID
            }).then(res => {
                VnrLoadingSevices.hide();
                if (res && Object.keys(res).length > 0) {
                    this.setState({
                        IsCheckCompany: {
                            ...IsCheckCompany,
                            RelativeName: {
                                ...RelativeName,
                                value: item.ProfileName,
                                refresh: !RelativeName.refresh
                            }
                        },
                        Gender: {
                            ...Gender,
                            value: res.Gender ? { Text: null, Value: res.Gender } : null,
                            refresh: !Gender.refresh
                        },
                        DateYearOfBirth: {
                            ...DateYearOfBirth,
                            value: res.DateOfBirth ? res.DateOfBirth : null,
                            refresh: !DateYearOfBirth.refresh
                        },
                        Nationality: {
                            ...Nationality,
                            value:
                                res.NationalityName && res.NationalityID
                                    ? { CountryName: res.NationalityName, ID: res.NationalityID }
                                    : null,
                            refresh: !Nationality.refresh
                        },
                        EthnicID: {
                            ...EthnicID,
                            value:
                                res.EthnicGroupName && res.EthnicID
                                    ? { EthnicGroupName: res.EthnicGroupName, ID: res.EthnicID }
                                    : null,
                            refresh: !EthnicID.refresh
                        },
                        PhoneNumber: {
                            ...PhoneNumber,
                            value: res.PhoneNumber ? res.PhoneNumber : '',
                            refresh: !PhoneNumber.refresh
                        },
                        Career: {
                            ...Career,
                            value: res.PositionName ? res.PositionName : '',
                            refresh: !Career.refresh
                        },
                        //Hộ chiếu
                        RelativesPassportGroup: {
                            ...RelativesPassportGroup,

                            RelativesPassportNo: {
                                ...RelativesPassportNo,
                                value: res.RelativesPassportNo,
                                refresh: !RelativesPassportNo.refresh
                            },
                            RelativesPassportIssuePlaceID: {
                                ...RelativesPassportIssuePlaceID,
                                value: res.RelativesPassportIssuePlaceID
                                    ? {
                                        ID: res.RelativesPassportIssuePlaceID,
                                        PassportIssuePlaceName: res.RelativesPassportIssuePlaceIDView
                                    }
                                    : null,
                                refresh: !RelativesPassportIssuePlaceID.refresh
                            },
                            RelativesPassportPlaceOfIssue: {
                                ...RelativesPassportPlaceOfIssue,
                                value: res.RelativesPassportPlaceOfIssue
                                    ? { ProvinceName: res.RelativesPassportPlaceOfIssue }
                                    : null,
                                refresh: !RelativesPassportPlaceOfIssue.refresh
                            },
                            RelativesPassportDateOfIssue: {
                                ...RelativesPassportDateOfIssue,
                                value: res.RelativesPassportDateOfIssue,
                                refresh: !RelativesPassportDateOfIssue.refresh
                            },
                            RelativesPassportDateOfExpiry: {
                                ...RelativesPassportDateOfExpiry,
                                value: res.RelativesPassportDateOfExpiry,
                                refresh: !RelativesPassportDateOfExpiry.refresh
                            }
                        },
                        //CCCD
                        IdentificationGroup: {
                            ...IdentificationGroup,

                            IdentificationNo: {
                                ...IdentificationNo,
                                value: res.IdentificationNo,
                                refresh: !IdentificationNo.refresh
                            },
                            PlaceOfIssuanceOfIdentityCard: {
                                ...PlaceOfIssuanceOfIdentityCard,
                                value: res.PlaceOfIssuanceOfIdentityCard
                                    ? { IDCardIssuePlaceName: res.PlaceOfIssuanceOfIdentityCard }
                                    : null,
                                refresh: !PlaceOfIssuanceOfIdentityCard.refresh
                            },
                            RelativesIDCardIssuePlaceID: {
                                ...RelativesIDCardIssuePlaceID,
                                value: res.RelativesIDCardIssuePlaceID
                                    ? {
                                        ID: res.RelativesIDCardIssuePlaceID,
                                        ProvinceName: res.RelativesIDCardIssuePlaceID
                                    }
                                    : null,
                                refresh: !RelativesIDCardIssuePlaceID.refresh
                            },
                            DateOfIssuanceOfIdentityCard: {
                                ...DateOfIssuanceOfIdentityCard,
                                value: res.DateOfIssuanceOfIdentityCard,
                                refresh: !DateOfIssuanceOfIdentityCard.refresh
                            },
                            ExpiryDateOfIdentityCard: {
                                ...ExpiryDateOfIdentityCard,
                                value: res.ExpiryDateOfIdentityCard,
                                refresh: !ExpiryDateOfIdentityCard.refresh
                            }
                        },
                        //CMND
                        IDNoInfoGroup: {
                            ...IDNoInfoGroup,

                            IDNo: {
                                ...IDNo,
                                value: res.IDNo,
                                refresh: !IDNo.refresh
                            },
                            RelativesIDPlaceOfIssue: {
                                ...RelativesIDPlaceOfIssue,
                                value: res.RelativesIDPlaceOfIssue
                                    ? { ProvinceName: res.RelativesIDPlaceOfIssue }
                                    : null,
                                refresh: !RelativesIDPlaceOfIssue.refresh
                            },
                            RelativesIDPlaceOfIssueID: {
                                ...RelativesIDPlaceOfIssueID,
                                value: res.RelativesIDPlaceOfIssueID
                                    ? {
                                        ID: res.RelativesIDPlaceOfIssueID,
                                        ProvinceName: res.RelativesIDPlaceOfIssueID
                                    }
                                    : null,
                                refresh: !RelativesIDPlaceOfIssueID.refresh
                            },
                            IDDateOfIssue: {
                                ...IDDateOfIssue,
                                value: res.IDDateOfIssue,
                                refresh: !IDDateOfIssue.refresh
                            },
                            IDDateOfExpiry: {
                                ...IDDateOfExpiry,
                                value: res.IDDateOfExpiry,
                                refresh: !IDDateOfExpiry.refresh
                            }
                        }
                    });
                }
            });
        }
    };

    // getDataCountry = () => {
    //     const { CountryID_NDK } = this.state;
    //     HttpService.Get('[URI_HR]//Cat_GetData/GetMultiCountry?text=').then((res) => {
    //         if (res && Array.isArray(res) && res.length > 0) {
    //             this.setState({
    //                 CountryID_NDK: {
    //                     ...CountryID_NDK,
    //                     data: [...res],
    //                     refresh: !CountryID_NDK.refresh,
    //                 }
    //             })
    //         }
    //     }).catch((err) => {
    //         ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
    //     })
    // }

    getDataProvinceIDByCountryID = value => {
        if (value && value.ID) {
            const { CountryID_NDK, ProvinceID_NDK, DistrictID_NDK, WardID_NDK } = this.state;
            let nextState = {
                CountryID_NDK: {
                    ...CountryID_NDK,
                    value: value,
                    refresh: !CountryID_NDK.refresh
                },
                ProvinceID_NDK: {
                    ...ProvinceID_NDK,
                    value: null,
                    data: [],
                    disable: false,
                    refresh: !ProvinceID_NDK.refresh
                },
                DistrictID_NDK: {
                    ...DistrictID_NDK,
                    value: null,
                    data: [],
                    disable: true,
                    refresh: !DistrictID_NDK.refresh
                },
                WardID_NDK: {
                    ...WardID_NDK,
                    value: null,
                    data: [],
                    disable: true,
                    refresh: !WardID_NDK.refresh
                }
            };
            HttpService.Get(`[URI_HR]//Cat_GetData/GetProvinceCascading?country=${value.ID}`)
                .then(res => {
                    if (res && Array.isArray(res) && res.length > 0) {
                        nextState = {
                            ...nextState,
                            ProvinceID_NDK: {
                                ...nextState.ProvinceID_NDK,
                                data: [...res]
                            }
                        };
                    }

                    this.setState(nextState);
                })
                .catch(() => {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                });
        }
    };

    getDataDistrictIDByProvinceID = value => {
        if (value && value.ID) {
            const { ProvinceID_NDK, DistrictID_NDK, WardID_NDK } = this.state;
            let nextState = {
                ProvinceID_NDK: {
                    ...ProvinceID_NDK,
                    value: value,
                    refresh: !ProvinceID_NDK.refresh
                },
                DistrictID_NDK: {
                    ...DistrictID_NDK,
                    value: null,
                    data: [],
                    disable: false,
                    refresh: !DistrictID_NDK.refresh
                },
                WardID_NDK: {
                    ...WardID_NDK,
                    value: null,
                    data: [],
                    disable: true,
                    refresh: !WardID_NDK.refresh
                }
            };
            HttpService.Get(`[URI_HR]//Cat_GetData/GetDistrictCascading?province=${value.ID}`)
                .then(res => {
                    if (res && Array.isArray(res) && res.length > 0) {
                        nextState = {
                            ...nextState,
                            DistrictID_NDK: {
                                ...nextState.DistrictID_NDK,
                                data: [...res]
                            }
                        };
                    }

                    this.setState(nextState);
                })
                .catch(() => {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                });
        }
    };

    getDataWardIDByDistrictID = value => {
        if (value && value.ID) {
            const { DistrictID_NDK, WardID_NDK } = this.state;
            let nextState = {
                DistrictID_NDK: {
                    ...DistrictID_NDK,
                    value: value,
                    refresh: !DistrictID_NDK.refresh
                },
                WardID_NDK: {
                    ...WardID_NDK,
                    value: null,
                    data: [],
                    disable: false,
                    refresh: !WardID_NDK.refresh
                }
            };
            HttpService.Get(`[URI_HR]//Cat_GetData/GetVillageCascading?districtid=${value.ID}`)
                .then(res => {
                    if (res && Array.isArray(res) && res.length > 0) {
                        nextState = {
                            ...nextState,
                            WardID_NDK: {
                                ...nextState.WardID_NDK,
                                data: [...res]
                            }
                        };
                    }

                    this.setState(nextState);
                })
                .catch(() => {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                });
        }
    };

    handleUpperCase = async (fieldNameInput, valueField) => {
        return await HttpService.Post('[URI_HR]/Hre_GetData/convertToUpperCase', {
            tableName: 'Hre_Relatives',
            fieldNameInput,
            valueField
        });
    };

    refreshRelateveName = () => {
        const { IsCheckCompany } = this.state;

        if (IsCheckCompany?.value === false) {
            // this.setState({
            //     IsCheckCompany: {
            //         ...IsCheckCompany,
            //         RelativeName: {
            //             ...RelativeName,
            //             value: null,
            //             refresh: !RelativeName.refresh
            //         }
            //     }
            // })
            this.refreshView();
        }
    };

    onChangeCheckBox = (field, callBack) => {
        const stateCheck = this.state[field];
        if (stateCheck)
            this.setState(
                {
                    [field]: {
                        ...stateCheck,
                        value: !stateCheck.value
                    }
                },
                () => {
                    callBack && callBack();
                }
            );
    };

    onChangeRelative = item => {
        const { RelativeTypeID, DateOfWedding } = this.state;
        let isShowDate = false;
        if ((item && item.Relative == 'E_HUSBAND') || item.Relative == 'E_WIFE') {
            isShowDate = true;
        }

        this.setState({
            RelativeTypeID: {
                ...RelativeTypeID,
                value: item,
                refresh: !RelativeTypeID.refresh
            },
            DateOfWedding: {
                ...DateOfWedding,
                visible: isShowDate,
                refresh: !DateOfWedding.refresh
            }
        });
    };

    onFinishCountry = listValues => {
        const { CountryID_NDK, ProvinceID_NDK, DistrictID_NDK, WardID_NDK } = this.state;
        let nextState = {};
        if (listValues) {
            nextState = {
                CountryID_NDK: {
                    ...CountryID_NDK,
                    value: listValues['CountryID']
                },
                ProvinceID_NDK: {
                    ...ProvinceID_NDK,
                    value: listValues['ProvinceID'],
                    disable: listValues['CountryID'] != null ? false : true
                },
                DistrictID_NDK: {
                    ...DistrictID_NDK,
                    value: listValues['DistrictID'],
                    disable: listValues['ProvinceID'] != null ? false : true
                },
                WardID_NDK: {
                    ...WardID_NDK,
                    value: listValues['WardID'],
                    disable: listValues['DistrictID'] != null ? false : true
                }
            };
            this.setState(nextState);
        }
    };

    onFinishProvince = listValues => {
        const { ProvinceID_NDK, DistrictID_NDK, WardID_NDK } = this.state;

        let nextState = {};

        if (listValues) {
            nextState = {
                ProvinceID_NDK: {
                    ...ProvinceID_NDK,
                    value: listValues['ProvinceID'],
                    disable: false
                },
                DistrictID_NDK: {
                    ...DistrictID_NDK,
                    value: listValues['DistrictID'],
                    disable: listValues['ProvinceID'] != null ? false : true
                },
                WardID_NDK: {
                    ...WardID_NDK,
                    value: listValues['WardID'],
                    disable: listValues['DistrictID'] != null ? false : true
                }
            };

            this.setState(nextState);
        }
    };

    onFinishDistrict = listValues => {
        const { ProvinceID_NDK, DistrictID_NDK, WardID_NDK } = this.state;

        let nextState = {};

        if (listValues) {
            nextState = {
                DistrictID_NDK: {
                    ...DistrictID_NDK,
                    value: listValues['DistrictID'],
                    disable: ProvinceID_NDK.value ? false : true
                },
                WardID_NDK: {
                    ...WardID_NDK,
                    value: listValues['WardID'],
                    disable: listValues['DistrictID'] != null ? false : true
                }
            };

            this.setState(nextState);
        }
    };

    onFinishVillage = listValues => {
        const { WardID_NDK, DistrictID_NDK } = this.state;

        let nextState = {};

        if (listValues) {
            nextState = {
                WardID_NDK: {
                    ...WardID_NDK,
                    value: listValues['WardID'],
                    disable: DistrictID_NDK.value ? false : true
                }
            };

            this.setState(nextState);
        }
    };

    render() {
        const {
                fieldValid,
                IsCheckCompany,
                //Loại quan hệ
                RelativeTypeID,
                //Giới tính
                Gender,
                //Năm sinh
                DateYearOfBirth,
                // Ngày kết hôn
                DateOfWedding,
                //Ngày mất
                YearOfLose,
                //Quốc tịch
                Nationality,
                //Quốc tịch 2
                Nationality2ID,
                //Dân tộc
                EthnicID,
                //Số điện thoại
                PhoneNumber,
                //Nghề nghiệp
                Career,
                //Khai báo hồ sơ đã nộp
                BirthCertificate,
                //File đính kèm
                FileAttach,
                //Ghi chú
                Notes,
                //Thêm vào hộ khẩu
                IsHouseHold,
                //Thêm người phụ thuộc
                CheckAddDependant,
                AddressInformation,
                //Giấy khai sinh
                BirthCertificateGroup,
                //Hộ chiếu
                RelativesPassportGroup,
                //CCCD
                IdentificationGroup,
                //CMND
                IDNoInfoGroup,

                // Mã yê tế
                CodeMedRelatives,

                // Số thẻ BHYT
                HealthInsNo,

                // Địa chỉ
                RelativeAddress,

                // Địa chỉ tạm trú
                RelativeTAddress,

                // Ngày kết thúc
                EndDate,

                // Quốc gia
                CountryID_NDK,

                // Tỉnh thành
                ProvinceID_NDK,

                // Quận huyện
                DistrictID_NDK,

                // Tên phường xã
                WardID_NDK,

                //Số nhà/Tên đường
                Address_NDK,

                // Số sổ BHXH
                SocialInsNo,

                isUpperCaseText,
                IsLost,
                IsNotDisplayedOnPortalApp,
                fieldHiden
            } = this.state,
            {
                //Tên người thân - chọn nhân viên
                SameCompanyProfileID,
                //Tên người thân - tự nhập
                RelativeName
            } = IsCheckCompany,
            {
                //Tháng áp dụng
                MonthOfEffect,
                //Tháng kết thúc
                MonthOfExpiry,
                //Mã số thuế NPT
                CodeTax
            } = CheckAddDependant,
            {
                //Số sổ hộ khẩu
                HouseholdNo,
                //Quan hệ với chủ hộ
                HouseholdType,
                //Mã số BHXH
                // SocialInsNo,
                //Quyển số
                HouseholdInfoBookNo
            } = IsHouseHold;

        const {
                textLableInfo,
                contentViewControl,
                viewLable,
                viewControl,
                styBtnCheckBox,
                styBtnCheckBoxText
            } = stylesListPickerControl,
            { textLableGroup, styleViewTitleGroup } = styleProfileInfo;

        const DATA_BIRTH_CERTIFICATE = [
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
        ];

        //#region [Xử lý 3 nút lưu]
        const listActions = [];

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['Relatives_Request_Add_Index_Relatives_Request_AddGird_btnTransfer'] &&
            PermissionForAppMobile.value['Relatives_Request_Add_Index_Relatives_Request_AddGird_btnTransfer']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_SENMAIL,
                title: translate('HRM_Common_SaveAndSendRequest'),
                onPress: () => this.onSaveAndSend(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Personal_New_Relatives_btnSaveClose'] &&
            PermissionForAppMobile.value['New_Personal_New_Relatives_btnSaveClose']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_CLOSE,
                title: translate('HRM_Common_SaveClose'),
                onPress: () => this.save(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Hre_Relative_BtnSaveNew'] &&
            PermissionForAppMobile.value['New_Hre_Relative_BtnSaveNew']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_NEW,
                title: translate('HRM_Common_SaveNew'),
                onPress: () => this.onSaveAndCreate(this.props.navigation)
            });
        }

        //#endregion

        const objAddress = {
            country: {
                titlePicker: 'HRM_HR_Profile_TACountry',
                typeName: 'E_COUNTRY',
                api: {
                    urlApi: '[URI_HR]/Cat_GetData/GetMultiCountry',
                    type: 'E_GET'
                },
                textField: 'CountryName',
                valueField: 'ID',
                filter: true,
                filterServer: false,
                fieldName: 'CountryID',
                value: CountryID_NDK.value
            },
            province: {
                typeName: 'E_PROVINCE',
                titlePicker: 'HRM_HR_Profile_TAProvince',
                api: {
                    urlApi: `[URI_HR]/Cat_GetData/GetProvinceCascading${
                        CountryID_NDK.value ? '?country=' + CountryID_NDK.value.ID : ''
                    }`,
                    type: 'E_GET'
                },
                textField: 'ProvinceName',
                valueField: 'ID',
                filter: true,
                filterServer: false,
                value: ProvinceID_NDK.value,
                fieldName: 'ProvinceID',
                objValue: {
                    key: 'TProvinceName',
                    value: 'TProvinceID'
                }
            },
            district: {
                typeName: 'E_DISTRICT',
                titlePicker: 'HRM_HR_Profile_TADistrict',
                api: {
                    urlApi: `[URI_HR]/Cat_GetData/GetDistrictCascading${
                        ProvinceID_NDK.value ? '?province=' + ProvinceID_NDK.value.ID : ''
                    }`,
                    type: 'E_GET'
                },
                textField: 'DistrictName',
                valueField: 'ID',
                filter: true,
                filterServer: false,
                value: DistrictID_NDK.value,
                fieldName: 'DistrictID',
                objValue: {
                    key: 'TDistrictName',
                    value: 'TDistrictID'
                }
            },
            village: {
                typeName: 'E_VILLAGE',
                titlePicker: 'HRM_HR_Profile_Village',
                api: {
                    urlApi: `[URI_HR]/Cat_GetData/GetVillageCascading${
                        DistrictID_NDK.value ? '?districtid=' + DistrictID_NDK.value.ID : ''
                    }`,
                    type: 'E_GET'
                },
                textField: 'VillageName',
                valueField: 'ID',
                filter: true,
                filterServer: false,
                value: WardID_NDK.value,
                fieldName: 'WardID',
                objValue: {
                    key: 'TVillageName',
                    value: 'TAVillageID'
                }
            }
        };

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView contentContainerStyle={CustomStyleSheet.flexGrow(1)}>
                        <View style={styleViewTitleGroup}>
                            <VnrText style={[styleSheets.text, textLableGroup]} i18nKey={'HRM_HR_GeneralInformation'} />
                        </View>

                        {/* thông tin chung */}
                        <View>
                            {/* Làm cùng công ty - IsCheckCompany */}
                            {IsCheckCompany.visibleConfig && IsCheckCompany.visible && (
                                <View style={contentViewControl}>
                                    <TouchableOpacity
                                        style={styBtnCheckBox}
                                        onPress={() =>
                                            this.setState(
                                                {
                                                    IsCheckCompany: {
                                                        ...IsCheckCompany,
                                                        value: !IsCheckCompany.value
                                                    }
                                                },
                                                () => {
                                                    this.refreshRelateveName();
                                                }
                                            )
                                        }
                                    >
                                        <CheckBox
                                            checkBoxColor={Colors.black}
                                            checkedCheckBoxColor={Colors.primary}
                                            isChecked={IsCheckCompany.value}
                                            disable={IsCheckCompany.disable}
                                            onClick={() =>
                                                this.setState(
                                                    {
                                                        IsCheckCompany: {
                                                            ...IsCheckCompany,
                                                            value: !IsCheckCompany.value
                                                        }
                                                    },
                                                    () => {
                                                        this.refreshRelateveName();
                                                    }
                                                )
                                            }
                                        />
                                        <VnrText
                                            style={[styleSheets.text, styBtnCheckBoxText]}
                                            i18nKey={IsCheckCompany.label}
                                        />
                                        {fieldValid.IsCheckCompany && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* chọn nhân viên - SameCompanyProfileID */}
                            {IsCheckCompany.value &&
                                SameCompanyProfileID.visibleConfig &&
                                SameCompanyProfileID.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={SameCompanyProfileID.label}
                                        />

                                        {/* valid SameCompanyProfileID */}
                                        {fieldValid.SameCompanyProfileID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi: '[URI_HR]/Hre_GetData/GetMultiProfile',
                                                type: 'E_GET'
                                            }}
                                            value={SameCompanyProfileID.value}
                                            refresh={SameCompanyProfileID.refresh}
                                            textField="ProfileName"
                                            valueField="ID"
                                            textFieldFilter={'ProfileNameFilterConfig'}
                                            filter={true}
                                            filterServer={true}
                                            filterParams="text"
                                            autoFilter={true}
                                            disable={SameCompanyProfileID.disable}
                                            onFinish={item => this.onChangeSameCompany(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* nhập tên người thân - RelativeName */}
                            {!IsCheckCompany.value && RelativeName.visibleConfig && RelativeName.visible && (
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
                                            disable={RelativeName.disable}
                                            refresh={RelativeName.refresh}
                                            value={RelativeName.value}
                                            isUpperCase={isUpperCaseText.RelativeName ? true : false}
                                            onChangeText={text =>
                                                this.setState({
                                                    IsCheckCompany: {
                                                        ...IsCheckCompany,
                                                        RelativeName: {
                                                            ...RelativeName,
                                                            value: text
                                                        }
                                                    }
                                                })
                                            }
                                            onBlur={() => {
                                                if (isUpperCaseText.RelativeName && RelativeName.value) {
                                                    this.handleUpperCase('RelativeName', RelativeName.value)
                                                        .then(res => {
                                                            this.setState({
                                                                IsCheckCompany: {
                                                                    ...IsCheckCompany,
                                                                    RelativeName: {
                                                                        ...RelativeName,
                                                                        value: res
                                                                    }
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

                            {/* Loại quan hệ - RelativeTypeID */}
                            {RelativeTypeID.visibleConfig && RelativeTypeID.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={RelativeTypeID.label}
                                        />

                                        {/* valid RelativeTypeID */}
                                        {fieldValid.RelativeTypeID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi: '[URI_HR]/Cat_GetData/GetMultiRelativeType',
                                                type: 'E_GET'
                                            }}
                                            autoFilter={true}
                                            autoBind={true}
                                            value={RelativeTypeID.value}
                                            refresh={RelativeTypeID.refresh}
                                            textField="RelativeTypeName"
                                            valueField="ID"
                                            filter={true}
                                            filterServer={true}
                                            filterParams="text"
                                            disable={RelativeTypeID.disable}
                                            onFinish={item => this.onChangeRelative(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Ngày kết hôn - DateOfWedding - task: 0164813 - 169803*/}
                            {DateOfWedding.visibleConfig &&
                                DateOfWedding.visible &&
                                (RelativeTypeID.value?.Relative === 'E_WIFE' ||
                                    RelativeTypeID.value?.Relative === 'E_HUSBAND') && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={DateOfWedding.label}
                                        />

                                        {fieldValid.DateOfWedding && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={DateOfWedding.value}
                                            refresh={DateOfWedding.refresh}
                                            type={'date'}
                                            onFinish={value =>
                                                this.setState({
                                                    DateOfWedding: {
                                                        ...DateOfWedding,
                                                        value,
                                                        refresh: !DateOfWedding.refresh
                                                    }
                                                })
                                            }
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

                            {/* Năm sinh - DateYearOfBirth */}
                            {DateYearOfBirth.visibleConfig && DateYearOfBirth.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={DateYearOfBirth.label}
                                        />

                                        {fieldValid.DateYearOfBirth && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={DateYearOfBirth.value}
                                            refresh={DateYearOfBirth.refresh}
                                            type={'date'}
                                            onFinish={value =>
                                                this.setState({
                                                    DateYearOfBirth: {
                                                        ...DateYearOfBirth,
                                                        value,
                                                        refresh: !DateYearOfBirth.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Ngày mất - YearOfLose -  IsLost*/}
                            {YearOfLose.visibleConfig && YearOfLose.visible && (
                                <View style={contentViewControl}>
                                    <TouchableOpacity
                                        style={styBtnCheckBox}
                                        onPress={() => this.onChangeCheckBox('IsLost')}
                                    >
                                        <CheckBox
                                            checkBoxColor={Colors.black}
                                            checkedCheckBoxColor={Colors.primary}
                                            isChecked={IsLost.value}
                                            disable={IsLost.disable}
                                            onClick={() => this.onChangeCheckBox('IsLost')}
                                        />
                                        <VnrText
                                            style={[styleSheets.text, styBtnCheckBoxText]}
                                            i18nKey={IsLost.label}
                                        />
                                        {fieldValid.IsLost && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                    </TouchableOpacity>

                                    {IsLost.value == true && (
                                        <View>
                                            <View style={viewLable}>
                                                <VnrText
                                                    style={[styleSheets.text, textLableInfo]}
                                                    i18nKey={YearOfLose.label}
                                                />

                                                {fieldValid.YearOfLose && (
                                                    <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                )}
                                            </View>
                                            <View style={viewControl}>
                                                <VnrDate
                                                    response={'string'}
                                                    format={'DD/MM/YYYY'}
                                                    value={YearOfLose.value}
                                                    refresh={YearOfLose.refresh}
                                                    type={'date'}
                                                    onFinish={value =>
                                                        this.setState({
                                                            YearOfLose: {
                                                                ...YearOfLose,
                                                                value,
                                                                refresh: !YearOfLose.refresh
                                                            }
                                                        })
                                                    }
                                                />
                                            </View>
                                        </View>
                                    )}

                                    {IsLost.value == true && !fieldHiden?.IsNotDisplayedOnPortalApp && (
                                        <View>
                                            <TouchableOpacity
                                                style={styBtnCheckBox}
                                                onPress={() => this.onChangeCheckBox('IsNotDisplayedOnPortalApp')}
                                            >
                                                <CheckBox
                                                    checkBoxColor={Colors.black}
                                                    checkedCheckBoxColor={Colors.primary}
                                                    isChecked={IsNotDisplayedOnPortalApp.value}
                                                    disable={IsNotDisplayedOnPortalApp.disable}
                                                    onClick={() => this.onChangeCheckBox('IsNotDisplayedOnPortalApp')}
                                                />
                                                <VnrText
                                                    style={[styleSheets.text, styBtnCheckBoxText]}
                                                    i18nKey={IsNotDisplayedOnPortalApp.label}
                                                />
                                                {fieldValid.IsNotDisplayedOnPortalApp && (
                                                    <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                )}
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                </View>
                            )}

                            {/* Quốc tịch - Nationality */}
                            {Nationality.visibleConfig && Nationality.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={Nationality.label}
                                        />

                                        {/* valid Nationality */}
                                        {fieldValid.Nationality && (
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
                                            value={Nationality.value}
                                            refresh={Nationality.refresh}
                                            textField="CountryName"
                                            valueField="ID"
                                            filter={true}
                                            filterServer={true}
                                            filterParams="text"
                                            disable={Nationality.disable}
                                            onFinish={item => {
                                                this.setState({
                                                    Nationality: {
                                                        ...Nationality,
                                                        value: item,
                                                        refresh: !Nationality.refresh
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
                                        <VnrAutoComplete
                                            api={{
                                                urlApi: '[URI_HR]/Cat_GetData/GetMultiCountryNationality?text=',
                                                type: 'E_GET',
                                                dataBody: {}
                                            }}
                                            autoBind={true}
                                            value={Nationality2ID.value}
                                            refresh={Nationality2ID.refresh}
                                            textField="Nationality"
                                            valueField="ID"
                                            filterParams="Nationality"
                                            filter={true}
                                            filterServer={false}
                                            autoFilter={true}
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

                            {/* Mã số BHXH - CodeMedRelatives */}
                            {CodeMedRelatives.visibleConfig && CodeMedRelatives.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={CodeMedRelatives.label}
                                        />

                                        {/* valid ProfileID */}
                                        {fieldValid.CodeMedRelatives && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={CodeMedRelatives.disable}
                                            refresh={CodeMedRelatives.refresh}
                                            value={CodeMedRelatives.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    CodeMedRelatives: {
                                                        ...CodeMedRelatives,
                                                        value: text,
                                                        refresh: !CodeMedRelatives.refresh
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
                                                        value: text,
                                                        refresh: !SocialInsNo.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Số thẻ BHYT - HealthInsNo */}
                            {HealthInsNo.visibleConfig && HealthInsNo.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={HealthInsNo.label}
                                        />

                                        {/* valid ProfileID */}
                                        {fieldValid.HealthInsNo && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={HealthInsNo.disable}
                                            refresh={HealthInsNo.refresh}
                                            value={HealthInsNo.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    HealthInsNo: {
                                                        ...HealthInsNo,
                                                        value: text,
                                                        refresh: !HealthInsNo.refresh
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
                                            isUpperCase={isUpperCaseText.Career ? true : false}
                                            value={Career.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    Career: {
                                                        ...Career,
                                                        value: text
                                                    }
                                                })
                                            }
                                            onBlur={() => {
                                                if (isUpperCaseText.Career && Career.value) {
                                                    this.handleUpperCase('Career', Career.value)
                                                        .then(res => {
                                                            this.setState({
                                                                Career: {
                                                                    ...Career,
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

                            {/* Địa chỉ - RelativeAddress */}
                            {RelativeAddress.visibleConfig && RelativeAddress.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={RelativeAddress.label}
                                        />

                                        {/* valid RelativeAddress */}
                                        {fieldValid.RelativeAddress && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={RelativeAddress.disable}
                                            refresh={RelativeAddress.refresh}
                                            isUpperCase={isUpperCaseText.RelativeAddress ? true : false}
                                            value={RelativeAddress.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    RelativeAddress: {
                                                        ...RelativeAddress,
                                                        value: text,
                                                        refresh: !RelativeAddress.refresh
                                                    }
                                                })
                                            }
                                            onBlur={() => {
                                                if (isUpperCaseText.RelativeAddress && RelativeAddress.value) {
                                                    this.handleUpperCase('RelativeAddress', RelativeAddress.value)
                                                        .then(res => {
                                                            this.setState({
                                                                RelativeAddress: {
                                                                    ...RelativeAddress,
                                                                    value: res,
                                                                    refresh: !RelativeAddress.refresh
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

                            {/* Địa chỉ tạm trú - RelativeTAddress */}
                            {RelativeTAddress.visibleConfig && RelativeTAddress.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={RelativeTAddress.label}
                                        />

                                        {/* valid RelativeTAddress */}
                                        {fieldValid.RelativeTAddress && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={RelativeTAddress.disable}
                                            refresh={RelativeTAddress.refresh}
                                            value={RelativeTAddress.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    RelativeTAddress: {
                                                        ...RelativeTAddress,
                                                        value: text,
                                                        refresh: !RelativeTAddress.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Ngày kết thúc - EndDate - task: 0164813*/}
                            {EndDate.visibleConfig && EndDate.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={EndDate.label} />

                                        {fieldValid.EndDate && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={EndDate.value}
                                            refresh={EndDate.refresh}
                                            type={'date'}
                                            onFinish={value =>
                                                this.setState({
                                                    EndDate: {
                                                        ...EndDate,
                                                        value,
                                                        refresh: !EndDate.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Khai báo hồ sơ đã nộp - BirthCertificate */}
                            {BirthCertificate.visibleConfig && BirthCertificate.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={BirthCertificate.label}
                                        />

                                        {/* valid BirthCertificate */}
                                        {fieldValid.BirthCertificate && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerMulti
                                            dataLocal={DATA_BIRTH_CERTIFICATE}
                                            value={BirthCertificate.value}
                                            refresh={BirthCertificate.refresh}
                                            textField="Text"
                                            valueField="Value"
                                            filter={true}
                                            filterLocal={true}
                                            filterParams="Text"
                                            onFinish={items =>
                                                this.setState({
                                                    BirthCertificate: {
                                                        ...BirthCertificate,
                                                        value: items,
                                                        refresh: !BirthCertificate.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Tập tin đính kèm - FileAttach */}
                            {FileAttach.visible && FileAttach.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Rec_JobVacancy_FileAttachment'}
                                        />
                                    </View>
                                    <View style={viewControl}>
                                        <VnrAttachFile
                                            //disable={FileAttach.disable}
                                            refresh={FileAttach.refresh}
                                            value={FileAttach.value}
                                            multiFile={true}
                                            uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                            onFinish={file => {
                                                this.setState({
                                                    FileAttach: {
                                                        ...FileAttach,
                                                        value: file
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

                        {/* là người phụ thuộc - CheckAddDependant */}
                        {CheckAddDependant.visibleConfig && CheckAddDependant.visible && (
                            <View>
                                <View style={styleViewTitleGroup}>
                                    <VnrText style={[styleSheets.text, textLableGroup]} i18nKey={'HR_Dependant'} />
                                </View>

                                {/* người thân là người phụ thuộc */}
                                <View style={contentViewControl}>
                                    <TouchableOpacity
                                        style={styBtnCheckBox}
                                        onPress={() =>
                                            this.setState(
                                                {
                                                    CheckAddDependant: {
                                                        ...this.state.CheckAddDependant,
                                                        value: !CheckAddDependant.value
                                                    }
                                                },
                                                () => {
                                                    //this.getDataCountry();
                                                }
                                            )
                                        }
                                    >
                                        <CheckBox
                                            checkBoxColor={Colors.black}
                                            checkedCheckBoxColor={Colors.primary}
                                            isChecked={CheckAddDependant.value}
                                            disable={CheckAddDependant.disable}
                                            onClick={() =>
                                                this.setState(
                                                    {
                                                        CheckAddDependant: {
                                                            ...this.state.CheckAddDependant,
                                                            value: !CheckAddDependant.value
                                                        }
                                                    },
                                                    () => {
                                                        //this.getDataCountry();
                                                    }
                                                )
                                            }
                                        />
                                        <VnrText
                                            style={[styleSheets.text, styBtnCheckBoxText]}
                                            i18nKey={CheckAddDependant.label}
                                        />
                                        {fieldValid.CheckAddDependant && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </TouchableOpacity>
                                </View>

                                {CheckAddDependant.value && (
                                    <View>
                                        {/* Tháng áp dụng - MonthOfEffect */}
                                        {MonthOfEffect.visibleConfig && MonthOfEffect.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={MonthOfEffect.label}
                                                    />

                                                    {fieldValid.MonthOfEffect && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrDate
                                                        response={'string'}
                                                        format={'DD/MM/YYYY'}
                                                        value={MonthOfEffect.value}
                                                        refresh={MonthOfEffect.refresh}
                                                        type={'date'}
                                                        onFinish={value =>
                                                            this.setState({
                                                                CheckAddDependant: {
                                                                    ...this.state.CheckAddDependant,
                                                                    MonthOfEffect: {
                                                                        ...this.state.CheckAddDependant.MonthOfEffect,
                                                                        value
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Tháng kết thúc - MonthOfExpiry */}
                                        {MonthOfExpiry.visibleConfig && MonthOfExpiry.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={MonthOfExpiry.label}
                                                    />

                                                    {fieldValid.MonthOfExpiry && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrDate
                                                        response={'string'}
                                                        format={'DD/MM/YYYY'}
                                                        value={MonthOfExpiry.value}
                                                        refresh={MonthOfExpiry.refresh}
                                                        type={'date'}
                                                        onFinish={value =>
                                                            this.setState({
                                                                CheckAddDependant: {
                                                                    ...this.state.CheckAddDependant,
                                                                    MonthOfExpiry: {
                                                                        ...this.state.CheckAddDependant.MonthOfExpiry,
                                                                        value
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Mã số thuế NPT - CodeTax */}
                                        {CodeTax.visibleConfig && CodeTax.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={CodeTax.label}
                                                    />

                                                    {/* valid ProfileID */}
                                                    {fieldValid.CodeTax && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>

                                                <View style={viewControl}>
                                                    <VnrTextInput
                                                        keyboardType={'numeric'}
                                                        charType={'int'}
                                                        // maxLength={10}
                                                        disable={CodeTax.disable}
                                                        refresh={CodeTax.refresh}
                                                        value={CodeTax.value}
                                                        // onBlur={() => this.warningCodeTax(CodeTax.value)}
                                                        // onSubmitEditing={() => this.warningCodeTax(CodeTax.value)}
                                                        onChangeText={text =>
                                                            this.setState({
                                                                CheckAddDependant: {
                                                                    ...this.state.CheckAddDependant,
                                                                    CodeTax: {
                                                                        ...this.state.CheckAddDependant.CodeTax,
                                                                        value:
                                                                            typeof text === 'string' &&
                                                                            text.length === 0
                                                                                ? null
                                                                                : text,
                                                                        refresh: !this.state.CheckAddDependant.CodeTax
                                                                            .refresh
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Quốc gia - CountryID_NDK */}
                                        {CountryID_NDK.visibleConfig && CountryID_NDK.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={CountryID_NDK.label}
                                                    />

                                                    {/* valid CountryID_NDK */}
                                                    {fieldValid.CountryID_NDK && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPickerAddress
                                                        key="E_COUNTRY"
                                                        disable={CountryID_NDK.disable}
                                                        listPicker={objAddress}
                                                        onFinish={item => this.onFinishCountry(item)}
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Tỉnh thành - ProvinceID_NDK */}
                                        {ProvinceID_NDK.visibleConfig && ProvinceID_NDK.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={ProvinceID_NDK.label}
                                                    />

                                                    {/* valid ProvinceID_NDK */}
                                                    {fieldValid.ProvinceID_NDK && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPickerAddress
                                                        key="E_PROVINCE"
                                                        disable={ProvinceID_NDK.disable}
                                                        listPicker={{
                                                            province: objAddress.province,
                                                            district: objAddress.district,
                                                            village: objAddress.village
                                                        }}
                                                        onFinish={item => this.onFinishProvince(item)}
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Quận huyện - DistrictID_NDK */}
                                        {DistrictID_NDK.visibleConfig && DistrictID_NDK.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={DistrictID_NDK.label}
                                                    />

                                                    {/* valid DistrictID_NDK */}
                                                    {fieldValid.DistrictID_NDK && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPickerAddress
                                                        key="E_DISTRICT"
                                                        disable={DistrictID_NDK.disable}
                                                        listPicker={{
                                                            district: objAddress.district,
                                                            village: objAddress.village
                                                        }}
                                                        onFinish={item => this.onFinishDistrict(item)}
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Phường xã - WardID_NDK */}
                                        {WardID_NDK.visibleConfig && WardID_NDK.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={WardID_NDK.label}
                                                    />

                                                    {/* valid WardID_NDK */}
                                                    {fieldValid.WardID_NDK && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPickerAddress
                                                        key="E_VILLAGE"
                                                        disable={WardID_NDK.disable}
                                                        listPicker={{ village: objAddress.village }}
                                                        onFinish={item => this.onFinishVillage(item)}
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Số nhà/Tên đường - Address_NDK */}
                                        {Address_NDK.visibleConfig && Address_NDK.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={Address_NDK.label}
                                                    />

                                                    {/* valid Address_NDK */}
                                                    {fieldValid.Address_NDK && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrTextInput
                                                        disable={Address_NDK.disable}
                                                        refresh={Address_NDK.refresh}
                                                        value={Address_NDK.value}
                                                        onChangeText={text =>
                                                            this.setState({
                                                                Address_NDK: {
                                                                    ...Address_NDK,
                                                                    value: text,
                                                                    refresh: !Address_NDK.refresh
                                                                }
                                                            })
                                                        }
                                                    />
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>
                        )}

                        {/* thêm vào hộ khẩu - IsHouseHold */}
                        {IsHouseHold.visibleConfig && IsHouseHold.visible && (
                            <View>
                                <View style={styleViewTitleGroup}>
                                    <VnrText
                                        style={[styleSheets.text, textLableGroup]}
                                        i18nKey={'HRM_HR_Dependant_HouseHold'}
                                    />
                                </View>

                                {/* thêm vào hộ khẩu */}
                                <View style={contentViewControl}>
                                    <TouchableOpacity
                                        style={styBtnCheckBox}
                                        onPress={() =>
                                            this.setState({
                                                IsHouseHold: {
                                                    ...this.state.IsHouseHold,
                                                    value: !this.state.IsHouseHold.value
                                                }
                                            })
                                        }
                                    >
                                        <CheckBox
                                            checkBoxColor={Colors.black}
                                            checkedCheckBoxColor={Colors.primary}
                                            isChecked={IsHouseHold.value}
                                            disable={IsHouseHold.disable}
                                            onClick={() =>
                                                this.setState({
                                                    IsHouseHold: {
                                                        ...this.state.IsHouseHold,
                                                        value: !this.state.IsHouseHold.value
                                                    }
                                                })
                                            }
                                        />
                                        <VnrText
                                            style={[styleSheets.text, styBtnCheckBoxText]}
                                            i18nKey={IsHouseHold.label}
                                        />
                                        {fieldValid.IsHouseHold && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </TouchableOpacity>
                                </View>

                                {IsHouseHold.value && (
                                    <View>
                                        {/* Số sổ hộ khẩu - HouseholdNo */}
                                        {HouseholdNo.visibleConfig && HouseholdNo.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={HouseholdNo.label}
                                                    />

                                                    {/* valid ProfileID */}
                                                    {fieldValid.HouseholdNo && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>

                                                <View style={viewControl}>
                                                    <VnrTextInput
                                                        disable={HouseholdNo.disable}
                                                        refresh={HouseholdNo.refresh}
                                                        value={HouseholdNo.value}
                                                        onChangeText={text =>
                                                            this.setState({
                                                                IsHouseHold: {
                                                                    ...this.state.IsHouseHold,
                                                                    HouseholdNo: {
                                                                        ...this.state.IsHouseHold.HouseholdNo,
                                                                        value: text
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Quan hệ với chủ hộ - HouseholdType */}
                                        {HouseholdType.visibleConfig && HouseholdType.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={HouseholdType.label}
                                                    />

                                                    {/* valid HouseholdType */}
                                                    {fieldValid.HouseholdType && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPicker
                                                        api={{
                                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiRelativeType',
                                                            type: 'E_GET'
                                                        }}
                                                        refresh={HouseholdType.refresh}
                                                        textField="RelativeTypeName"
                                                        valueField="ID"
                                                        filter={false}
                                                        value={HouseholdType.value}
                                                        disable={HouseholdType.disable}
                                                        onFinish={item =>
                                                            this.setState({
                                                                IsHouseHold: {
                                                                    ...this.state.IsHouseHold,
                                                                    HouseholdType: {
                                                                        ...this.state.IsHouseHold.HouseholdType,
                                                                        value: item
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Mã số BHXH - SocialInsNo bỏ không dùng nữa (task: 164813) */}
                                        {/* {SocialInsNo.visibleConfig && SocialInsNo.visible && (
                                                <View style={contentViewControl}>
                                                    <View style={viewLable} >
                                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={SocialInsNo.label} />

                                                        {
                                                            fieldValid.SocialInsNo && <VnrText style={styleValid} i18nKey={"HRM_Valid_Char"} />
                                                        }
                                                    </View>

                                                    <View style={viewControl}>
                                                        <VnrTextInput
                                                            disable={SocialInsNo.disable}
                                                            refresh={SocialInsNo.refresh}
                                                            value={SocialInsNo.value}
                                                            onChangeText={text =>
                                                                this.setState({
                                                                    IsHouseHold: {
                                                                        ...this.state.IsHouseHold,
                                                                        SocialInsNo: {
                                                                            ...this.state.IsHouseHold.SocialInsNo,
                                                                            value: text
                                                                        }
                                                                    }
                                                                })
                                                            }
                                                        />
                                                    </View>
                                                </View>
                                            )} */}

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
                                                                IsHouseHold: {
                                                                    ...this.state.IsHouseHold,
                                                                    HouseholdInfoBookNo: {
                                                                        ...this.state.IsHouseHold.HouseholdInfoBookNo,
                                                                        value: text
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    />
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>
                        )}

                        {/* #region [thông tin bổ sung - CMND, CCCD, hộ chiếu, khai sinh, hộ khẩu] */}
                        <View>
                            {/* khai sinh */}
                            {BirthCertificateGroup.visible && BirthCertificateGroup.visibleConfig && (
                                <TouchableOpacity
                                    onPress={() =>
                                        DrawerServices.navigate('OtherBirthCertificate', {
                                            BirthCertificate: { ...BirthCertificateGroup },
                                            fieldValid,
                                            onFinish: this.onFinishBirthCertificateGroup,
                                            fieldHiden
                                        })
                                    }
                                    style={styles.btnOtherInfo}
                                >
                                    <View style={styles.iconNext}>
                                        <IconNext size={Size.iconSize} color={'#fff'} />
                                    </View>
                                    <VnrText
                                        style={[styleSheets.lable, styleButtonAddOrEdit.groupButton__text, styles.text]}
                                        i18nKey={'HRM_HR_BirthCertificate'}
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
                                        DrawerServices.navigate('OtherIdentification', {
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
                                        <IconNext size={Size.iconSize} color={'#fff'} />
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

                            {/* Thông tin địa chỉ */}
                            {AddressInformation.visible && AddressInformation.visibleConfig && (
                                <TouchableOpacity
                                    onPress={() =>
                                        DrawerServices.navigate('OtherAddressInformation', {
                                            AddressInformation: { ...AddressInformation },
                                            fieldValid,
                                            onFinish: this.onFinishAddressInformation,
                                            fieldHiden
                                        })
                                    }
                                    style={styles.btnOtherInfo}
                                >
                                    <View style={styles.iconNext}>
                                        <IconNext size={Size.iconSize} color={'#fff'} />
                                    </View>
                                    <VnrText
                                        style={[styleSheets.lable, styleButtonAddOrEdit.groupButton__text, styles.text]}
                                        i18nKey={AddressInformation.label}
                                    />

                                    <View style={styles.iconNext}>
                                        <IconNext size={Size.iconSize} color={Colors.primary} />
                                    </View>
                                </TouchableOpacity>
                            )}
                        </View>
                    </KeyboardAwareScrollView>

                    {/* bottom button close, confirm */}
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
