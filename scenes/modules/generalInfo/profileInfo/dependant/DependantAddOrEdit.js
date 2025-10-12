import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleSafeAreaView,
    Size,
    Colors,
    styleButtonAddOrEdit,
    stylesListPickerControl,
    styleValid,
    styleViewTitleForGroup,
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
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import moment from 'moment';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { DependantConfirmedBusinessFunction } from './dependantConfirmed/DependantConfirmedBusinessFunction';
import VnrPickerAddress from '../../../../../components/VnrPickerAddress/VnrPickerAddress';

const initSateDefault = {
    StrBlockRelativesCodeTax: null,
    IsExcludeProbation: null,
    StrBlockRelativesIDNo: null,
    IsBlockRelativesIDNo: null,
    IsBlockRelativesCodeTax: null,
    ID: null,
    Profile: {},
    DependantName: {
        label: 'HRM_HR_Dependant_DependantName',
        disable: false,
        refresh: false,
        value: '',
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
    },
    //Mã số thuế NPT cũ
    CodeTaxOld: {
        label: 'HRM_PortalApp_TaxCodeDependantOld',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    //Loại phụ thuộc
    RelationID: {
        label: 'HRM_HR_Dependant_RelationID',
        disable: false,
        refresh: false,
        data: null,
        value: null,
        visibleConfig: true,
        visible: true
    },
    DateOfWedding: {
        label: 'HRM_HRE_Relatives_DateOfWedding',
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: false
    },
    DateOfBirth: {
        label: 'HRM_HR_Dependant_DateOfBirth',
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    YearOfLose: {
        label: 'HRM_HR_Relatives_LostDay',
        value: null,
        refresh: false,
        disable: false,
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
    DependentsAddress: {
        label: 'HRM_Hre_Dependant_DependentsAddress',
        disable: false,
        refresh: false,
        value: '',
        visibleConfig: true,
        visible: true
    },
    NationalityID: {
        label: 'HRM_HR_Relatives_NationalityID',
        disable: false,
        refresh: false,
        data: null,
        value: null,
        visibleConfig: true,
        visible: true
    },
    ReqDocumnetIDs: {
        label: 'HRM_HR_Profile_ReqDocumentID',
        disable: false,
        refresh: false,
        data: null,
        value: null,
        visibleConfig: true,
        visible: true
    },
    SchoolYear: {
        label: 'HRM_HR_Relatives_SchoolYear',
        value: null,
        refresh: false,
        disable: false,
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
    PhoneNumber: {
        label: 'HRM_Hre_HouseholdInfo_PhoneNumber',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    Career: {
        label: 'HRM_HR_Relatives_Career',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    Note: {
        label: 'HRM_Category_Subject_Notes',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
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
    //Thêm người phụ thuộc
    IsRegisterAtCompany: {
        label: 'HRM_HR_Relatives_IsRegisterAtCompany',
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
        CompleteDate: {
            label: 'HRM_HR_Dependant_CompleteDate',
            value: null,
            refresh: false,
            visibleConfig: true,
            visible: true
        }
    },

    // task 0171426: [Hotfix_AVN_v8.11.41.01.08] Modify popup tạo mới Người Phụ thuộc (APP)
    AddressInformation: {
        lable: 'HRM_Hre_Dependant_AddressInformation',
        visibleConfig: true,
        visible: true,
        PCountryID: {
            label: 'HRM_HR_Profile_PACountry',
            disable: false,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        PProvinceID: {
            label: 'HRM_HR_Profile_PAProvince',
            disable: true,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        PDistrictID: {
            label: 'HRM_HR_Profile_PADistrict',
            disable: true,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        PVillageID: {
            label: 'HRM_HR_Profile_PVillage',
            disable: true,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        PAddressNew: {
            label: 'HRM_HR_Address_AddressName',
            disable: false,
            refresh: false,
            value: null,
            visibleConfig: true,
            visible: true
        },
        TCountryID: {
            label: 'HRM_HR_Profile_TACountry',
            disable: false,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        TProvinceID: {
            label: 'HRM_HR_Profile_TAProvince',
            disable: true,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        TDistrictID: {
            label: 'HRM_HR_Profile_TADistrict',
            disable: true,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        TVillageID: {
            label: 'HRM_HR_Profile_TVillage',
            disable: true,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        TAddressNew: {
            label: 'HRM_HR_Address_AddressName',
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
        VolDocument: {
            label: 'VolDocument',
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
        // PlaceOfIssuanceOfIdentityCard task: 0164814 => default hidden
        PlaceOfIssuanceOfIdentityCard: {
            label: 'HRM_HRE_Relatives_PlaceOfIssuanceOfIdentityCard',
            disable: false,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        PlaceOfIssuanceOfIdentityCardID: {
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
    // PlaceOfIssuanceOfIdentityCard task: 0164814 => default hidden
    PlaceOfIssuanceOfIdentityCard: {
        visibleConfig: true
    },
    PlaceOfIssuanceOfIdentityCardID: {
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
        // Task: 0164814 => default hidden
        DependantIDPlaceOfIssue: {
            label: 'HRM_HRE_Relatives_RelativesIDPlaceOfIssue',
            disable: false,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        DependantIDPlaceOfIssueID: {
            label: 'HRM_HRE_Relatives_RelativesIDPlaceOfIssue',
            disable: false,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        DependantIDDateOfIssue: {
            label: 'HRM_HRE_Relatives_DateOfIssuanceOfIdentityCard',
            value: null,
            refresh: false,
            disable: false,
            visibleConfig: true,
            visible: true
        },
        DependantIDDateOfExpiry: {
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
    // Task: 0164814 => default hidden
    DependantIDPlaceOfIssue: {
        visibleConfig: true
    },
    DependantIDPlaceOfIssueID: {
        visibleConfig: true
    },
    DependantIDDateOfIssue: {
        visibleConfig: true
    },
    DependantIDDateOfExpiry: {
        visibleConfig: true
    },

    //Thêm Hộ chiếu
    DepentantsPassportGroup: {
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
        // Task: 0164814 => default hidden
        DependantPassportPlaceOfIssue: {
            label: 'HRM_HR_Profile_PassportPlaceOfIssue',
            disable: false,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        DependantPassportIssuePlaceID: {
            label: 'HRM_HR_Profile_PassportPlaceOfIssue',
            disable: false,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        },
        DependantPassportDateOfIssue: {
            label: 'HRM_HR_Profile_PassportDateOfIssue',
            value: null,
            refresh: false,
            disable: false,
            visibleConfig: true,
            visible: true
        },
        DependantPassportDateOfExpiry: {
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
    DependantPassportPlaceOfIssue: {
        visibleConfig: true
    },
    DependantPassportIssuePlaceID: {
        visibleConfig: true
    },
    DependantPassportDateOfIssue: {
        visibleConfig: true
    },
    DependantPassportDateOfExpiry: {
        visibleConfig: true
    },

    fieldValid: {},

    // Task: Nhan.Nguyen 0164814: [Source Main] Modify màn hình “Danh sách người phụ thuộc” trong Hồ sơ cá nhân (App)
    // Người phụ thuộc là người thân
    IsRelatives: {
        label: 'HRM_HR_Dependant_IsRelatives',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true,
        //Tên người thân - chọn nhân viên
        RelativesID: {
            label: 'E_Owner_Relative',
            disable: false,
            refresh: false,
            data: null,
            value: null,
            visibleConfig: true,
            visible: true
        }
    },
    RegisterDate: {
        label: 'RequestInfoDateSubmit',
        value: moment(new Date()),
        refresh: false,
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
    fieldHiden: {},
    PAddress: {
        label: 'PAddressDependant',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    TAddress: {
        label: 'TAddressDependant',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    }
};

export default class DependantAddOrEdit extends Component {
    constructor(props) {
        super(props);
        this.state = initSateDefault;

        this.setVariable();

        this.isModify = false;
        this.profileInfo = dataVnrStorage && dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info : {};

        props.navigation.setParams({
            title:
                props.navigation.state.params && props.navigation.state.params.record
                    ? 'HRM_Hre_ApproveDependant_Update_Title'
                    : 'HRM_Hre_ApproveDependant_Create_Title'
        });
    }

    refreshView = () => {
        const { FileAttach } = this.state;
        this.props.navigation.setParams({ title: 'HRM_Hre_ApproveDependant_Create_Title' });
        this.setVariable();

        let resetState = {
            ...initSateDefault,
            FileAttach: {
                ...FileAttach,
                value: null,
                refresh: !FileAttach.refresh
            }
        };
        this.setState(resetState, () => this.getConfigValid('Hre_DependantPortal', true));
    };

    setVariable = () => {
        this.isModify = false;
        this.isSaveContinue = null;
        this.profileInfo = dataVnrStorage && dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info : {};
    };

    //#region [khởi tạo , lấy các dữ liệu cho control, lấy giá trị mặc đinh]
    //promise get config valid

    getConfigValid = (tblName, isRefresh) => {
        try {
            HttpService.MultiRequest([
                HttpService.Get('[URI_HR]/Hre_GetDataV2/GetFieldInfoFileByTableNameKaizenVersion?tableName=' + tblName),
                HttpService.Post('[URI_HR]/Hre_GetData/IstUpperTextOfFieldTableByConfig', {
                    tableName: 'Hre_Dependant'
                }),
                HttpService.Get('[URI_HR]/Hre_GetDataV2/GetDefaultValueDependant')
            ]).then((resAll) => {
                VnrLoadingSevices.hide();
                if (resAll && Array.isArray(resAll) && resAll.length === 3) {
                    const [resConfigValid, resConfigUpperText, valueDefaultDependant] = resAll,
                        {
                            IdentificationGroup,
                            IDNoInfoGroup,
                            DepentantsPassportGroup,
                            IsRelatives,
                            IsNotDisplayedOnPortalApp,
                            fieldHiden
                        } = this.state;

                    let { record } = !isRefresh ? this.props.navigation.state.params : {};

                    let nextState = {},
                        tempConfig = {};

                    try {
                        //map field hidden by config
                        const _configField =
                                ConfigField && ConfigField.value['DependantAddOrEdit']
                                    ? ConfigField.value['DependantAddOrEdit']['Hidden']
                                    : [],
                            { E_ProfileID, E_FullName } = EnumName,
                            _profile = { ID: this.profileInfo[E_ProfileID], ProfileName: this.profileInfo[E_FullName] };

                        _configField.forEach((fieldConfig) => {
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
                            if (fieldConfig) {
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

                        nextState = { ...nextState, Profile: _profile };
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }

                    if (Array.isArray(resConfigValid) && resConfigValid.length > 0) {
                        resConfigValid.map((item) => {
                            if (item?.FieldName && !item?.Nullable)
                                tempConfig = {
                                    ...tempConfig,
                                    [item.FieldName]: {
                                        ...item
                                    }
                                };
                        });

                        nextState = { ...nextState, fieldValid: tempConfig };
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

                    nextState = {
                        ...nextState,

                        IDNoInfoGroup: {
                            ...IDNoInfoGroup,
                            IDNo: {
                                ...IDNoInfoGroup.IDNo,
                                visibleConfig: nextState.IDNo ? nextState.IDNo.visibleConfig : true
                            },
                            DependantIDPlaceOfIssueID: {
                                ...IDNoInfoGroup.DependantIDPlaceOfIssueID,
                                visibleConfig: nextState.DependantIDPlaceOfIssueID
                                    ? nextState.DependantIDPlaceOfIssueID.visibleConfig
                                    : true
                            },
                            DependantIDPlaceOfIssue: {
                                ...IDNoInfoGroup.DependantIDPlaceOfIssue,
                                visibleConfig: nextState.DependantIDPlaceOfIssue
                                    ? nextState.DependantIDPlaceOfIssue.visibleConfig
                                    : true
                            },
                            DependantIDDateOfIssue: {
                                ...IDNoInfoGroup.DependantIDDateOfIssue,
                                visibleConfig: nextState.DependantIDDateOfIssue
                                    ? nextState.DependantIDDateOfIssue.visibleConfig
                                    : true
                            },
                            DependantIDDateOfExpiry: {
                                ...IDNoInfoGroup.DependantIDDateOfExpiry,
                                visibleConfig: nextState.DependantIDDateOfExpiry
                                    ? nextState.DependantIDDateOfExpiry.visibleConfig
                                    : true
                            }
                        },
                        DepentantsPassportGroup: {
                            ...DepentantsPassportGroup,
                            PassportNo: {
                                ...DepentantsPassportGroup.PassportNo,
                                visibleConfig: nextState.PassportNo ? nextState.PassportNo.visibleConfig : true
                            },
                            DependantPassportIssuePlaceID: {
                                ...DepentantsPassportGroup.DependantPassportIssuePlaceID,
                                visibleConfig: nextState.DependantPassportIssuePlaceID
                                    ? nextState.DependantPassportIssuePlaceID.visibleConfig
                                    : true
                            },
                            DependantPassportPlaceOfIssue: {
                                ...DepentantsPassportGroup.DependantPassportPlaceOfIssue,
                                visibleConfig: nextState.DependantPassportPlaceOfIssue
                                    ? nextState.DependantPassportPlaceOfIssue.visibleConfig
                                    : true
                            },
                            DependantPassportDateOfIssue: {
                                ...DepentantsPassportGroup.DependantPassportDateOfIssue,
                                visibleConfig: nextState.DependantPassportDateOfIssue
                                    ? nextState.DependantPassportDateOfIssue.visibleConfig
                                    : true
                            },
                            DependantPassportDateOfExpiry: {
                                ...DepentantsPassportGroup.DependantPassportDateOfExpiry,
                                visibleConfig: nextState.DependantPassportDateOfExpiry
                                    ? nextState.DependantPassportDateOfExpiry.visibleConfig
                                    : true
                            }
                        },
                        IdentificationGroup: {
                            ...IdentificationGroup,
                            IdentificationNo: {
                                ...IdentificationGroup.IdentificationNo,
                                visibleConfig: nextState.IdentificationNo
                                    ? nextState.IdentificationNo.visibleConfig
                                    : true
                            },
                            PlaceOfIssuanceOfIdentityCardID: {
                                ...IdentificationGroup.PlaceOfIssuanceOfIdentityCardID,
                                visibleConfig: nextState.PlaceOfIssuanceOfIdentityCardID
                                    ? nextState.PlaceOfIssuanceOfIdentityCardID.visibleConfig
                                    : true
                            },

                            PlaceOfIssuanceOfIdentityCard: {
                                ...IdentificationGroup.PlaceOfIssuanceOfIdentityCard,
                                visibleConfig: nextState.PlaceOfIssuanceOfIdentityCard
                                    ? nextState.PlaceOfIssuanceOfIdentityCard.visibleConfig
                                    : true
                            },
                            DateOfIssuanceOfIdentityCard: {
                                ...IdentificationGroup.DateOfIssuanceOfIdentityCard,
                                visibleConfig: nextState.DateOfIssuanceOfIdentityCard
                                    ? nextState.DateOfIssuanceOfIdentityCard.visibleConfig
                                    : true
                            },
                            ExpiryDateOfIdentityCard: {
                                ...IdentificationGroup.ExpiryDateOfIdentityCard,
                                visibleConfig: nextState.ExpiryDateOfIdentityCard
                                    ? nextState.ExpiryDateOfIdentityCard.visibleConfig
                                    : true
                            }
                        }
                    };

                    if (valueDefaultDependant && !record) {
                        nextState = {
                            ...nextState,
                            IsRelatives: {
                                ...IsRelatives,
                                value: valueDefaultDependant?.IsRelatives ? valueDefaultDependant?.IsRelatives : false,
                                refresh: !IsRelatives.refresh
                            },
                            IsNotDisplayedOnPortalApp: {
                                ...IsNotDisplayedOnPortalApp,
                                value: valueDefaultDependant?.IsNotDisplayedOnPortalApp
                                    ? valueDefaultDependant?.IsNotDisplayedOnPortalApp
                                    : false,
                                refresh: !IsNotDisplayedOnPortalApp.refresh
                            }
                        };
                    }

                    this.setState({ ...nextState }, () => {
                        let { record } = !isRefresh ? this.props.navigation.state.params : {};

                        // reload dataSource control Relatives (create)
                        if (valueDefaultDependant?.IsRelatives && !record) this.getMultiRelativeWhenChooseIsRelatives();

                        //get config khi đăng ký
                        if (!record) {
                            this.getConfig();
                            this.getTPAddressByProfileID();
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
    };

    componentDidMount() {
        VnrLoadingSevices.show();
        this.getConfigValid('Hre_DependantPortal');
    }

    setRecordForModify = (response) => {
        let nextState = {};

        const {
                CodeTax,
                RelationID,
                DependantName,
                DateOfWedding,
                DateOfBirth,
                YearOfLose,
                Gender,
                DependentsAddress,
                NationalityID,
                ReqDocumnetIDs,
                SchoolYear,
                FileAttach,
                IsRegisterAtCompany,
                BirthCertificate,
                PhoneNumber,
                Career,
                Note,
                IsLost,

                CountryID_NDK,
                // Tỉnh thành
                ProvinceID_NDK,
                // Quận huyện
                DistrictID_NDK,
                // Tên phường xã
                WardID_NDK,
                //Số nhà/Tên đường
                Address_NDK,

                IsNotDisplayedOnPortalApp,
                //Giấy khai sinh
                BirthCertificateGroup,
                //Hộ chiếu
                DepentantsPassportGroup,
                //CCCD
                IdentificationGroup,
                //CMND
                IDNoInfoGroup,
                AddressInformation,
                IsRelatives,
                PAddress,
                TAddress,
                CodeTaxOld
            } = this.state,
            { RelativesID } = IsRelatives,
            {
                //Tháng áp dụng
                MonthOfEffect,
                //Tháng kết thúc
                MonthOfExpiry,
                CompleteDate
            } = IsRegisterAtCompany,
            //giấy khai sinh
            {
                //Số chứng từ
                NoDocument,
                //Quyển sổ
                VolDocument,
                CountryID,
                ProvinceID,
                DistrictID,
                WardID,
                IdentifierNumber
            } = BirthCertificateGroup,
            //CMND
            {
                IDNo,
                DependantIDPlaceOfIssueID,
                DependantIDPlaceOfIssue,
                DependantIDDateOfIssue,
                DependantIDDateOfExpiry
            } = IDNoInfoGroup,
            //CCCD
            {
                IdentificationNo,
                PlaceOfIssuanceOfIdentityCardID,
                PlaceOfIssuanceOfIdentityCard,
                DateOfIssuanceOfIdentityCard,
                ExpiryDateOfIdentityCard
            } = IdentificationGroup,
            //Hộ chiếu
            {
                PassportNo,
                DependantPassportIssuePlaceID,
                DependantPassportPlaceOfIssue,
                DependantPassportDateOfIssue,
                DependantPassportDateOfExpiry
            } = DepentantsPassportGroup,
            {
                PCountryID,
                PProvinceID,
                PDistrictID,
                PVillageID,
                PAddressNew,
                TCountryID,
                TProvinceID,
                TDistrictID,
                TVillageID,
                TAddressNew
            } = AddressInformation;

        const { data } = BirthCertificate;
        let setValueBirthCertificate = [];

        data.forEach((item) => {
            let fieldName = item.Value;

            if (response[fieldName]) {
                setValueBirthCertificate.push({ ...item });
            }
        });

        nextState = {
            ID: response.ID,
            IsRelatives: {
                ...IsRelatives,
                value: response.IsRelatives,
                refresh: !IsRelatives.refresh,
                RelativesID: {
                    ...RelativesID,
                    value: response.RelativesID && response.IsRelatives ? { ID: response.RelativesID } : null,
                    refresh: !RelativesID.refresh
                }
            },

            //Mã số thuế NPT
            CodeTax: {
                ...CodeTax,
                value: response.CodeTax,
                refresh: !CodeTax.refresh
            },
            //Mã số thuế NPT (cũ)
            CodeTaxOld: {
                ...CodeTaxOld,
                value: response?.CodeTaxOld ?? null,
                refresh: !CodeTaxOld.refresh
            },
            //Loại quan hệ
            RelationID: {
                ...RelationID,
                value: response.RelationID
                    ? { ID: response.RelationID, RelativeTypeName: response.RelativeTypeName }
                    : null,
                refresh: !RelationID.refresh
            },
            DependantName: {
                ...DependantName,
                value: response.DependantName ? response.DependantName : '',
                refresh: !DependantName.refresh
            },
            DateOfWedding: {
                ...DateOfWedding,
                value: response.DateOfWedding,
                visible: response.DateOfWedding != null ? true : false,
                refresh: !DateOfWedding.refresh
            },
            IsLost: {
                ...IsLost,
                value: response?.IsLost === true || response.YearOfLose ? true : false,
                refresh: !IsLost.refresh
            },
            IsNotDisplayedOnPortalApp: {
                ...IsNotDisplayedOnPortalApp,
                value: response.IsNotDisplayedOnPortalApp ? response.IsNotDisplayedOnPortalApp : false,
                refresh: !IsNotDisplayedOnPortalApp.refresh
            },
            YearOfLose: {
                ...YearOfLose,
                value: response.YearOfLose,
                refresh: !YearOfLose.refresh
            },
            Gender: {
                ...Gender,
                value: response.Gender ? { Value: response.Gender, Text: response.GenderView } : null,
                refresh: !Gender.refresh
            },
            DependentsAddress: {
                ...DependentsAddress,
                value: response.DependentsAddress ? response.DependentsAddress : '',
                refresh: !DependentsAddress.refresh
            },
            NationalityID: {
                ...NationalityID,
                value: response.NationalityID
                    ? { ID: response.NationalityID, CountryName: response.NationalityName }
                    : null,
                refresh: !NationalityID.refresh
            },
            ReqDocumnetIDs: {
                ...ReqDocumnetIDs,
                value: response.ReqDocumnetIDs
                    ? { Code: response.ReqDocumnetIDs, ReqDocumentName: response.ReqDocumentName }
                    : null,
                refresh: !ReqDocumnetIDs.refresh
            },
            DateOfBirth: {
                ...DateOfBirth,
                value: response.DateOfBirth,
                refresh: !DateOfBirth.refresh
            },
            SchoolYear: {
                ...SchoolYear,
                value: response.SchoolYear,
                refresh: !SchoolYear.refresh
            },
            PhoneNumber: {
                ...PhoneNumber,
                value: response.PhoneNumber,
                refresh: !PhoneNumber.refresh
            },
            Career: {
                ...Career,
                value: response.Career,
                refresh: !Career.refresh
            },
            FileAttach: {
                ...FileAttach,
                value: response.lstFileAttach ? response.lstFileAttach : null,
                disable: false,
                refresh: !FileAttach.refresh
            },
            Note: {
                ...Note,
                value: response.Note,
                refresh: !Note.refresh
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
                value: response.AddressRegister,
                refresh: !Address_NDK.refresh
            },
            IsRegisterAtCompany: {
                ...IsRegisterAtCompany,
                value: response.IsRegisterAtCompany,
                refresh: !IsRegisterAtCompany.refresh,
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
                CompleteDate: {
                    ...CompleteDate,
                    value: response.CompleteDate,
                    refresh: !CompleteDate.refresh
                }
            },
            BirthCertificate: {
                ...BirthCertificate,
                value: setValueBirthCertificate,
                refresh: !BirthCertificate.refresh
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
                VolDocument: {
                    ...VolDocument,
                    value: response.VolDocument,
                    refresh: !VolDocument.refresh
                },
                IdentifierNumber: {
                    ...IdentifierNumber,
                    value: response.IdentifierNumber,
                    refresh: !IdentifierNumber.refresh
                },
                CountryID: {
                    ...CountryID,
                    value: response.CountryID ? { ID: response.CountryID, CountryName: response.CountryName } : null,
                    refresh: !CountryID.refresh
                },
                ProvinceID: {
                    ...ProvinceID,
                    value: response.ProvinceID
                        ? { ID: response.ProvinceID, ProvinceName: response.ProvinceName }
                        : null,
                    refresh: !ProvinceID.refresh
                },
                DistrictID: {
                    ...DistrictID,
                    value: response.DistrictID
                        ? { ID: response.DistrictID, DistrictName: response.DistrictName }
                        : null,
                    refresh: !DistrictID.refresh
                },
                WardID: {
                    ...WardID,
                    value: response.WardID ? { ID: response.WardID, VillageName: response.VillageName } : null,
                    refresh: !WardID.refresh
                }
            },
            //Hộ chiếu
            DepentantsPassportGroup: {
                ...DepentantsPassportGroup,

                PassportNo: {
                    ...PassportNo,
                    value: response.PassportNo,
                    refresh: !PassportNo.refresh
                },
                DependantPassportIssuePlaceID: {
                    ...DependantPassportIssuePlaceID,
                    value: response.DependantPassportIssuePlaceID
                        ? {
                              ID: response.DependantPassportIssuePlaceID,
                              PassportIssuePlaceName: response.DependantPassportIssuePlaceIDView
                          }
                        : null,
                    refresh: !DependantPassportIssuePlaceID.refresh
                },
                DependantPassportPlaceOfIssue: {
                    ...DependantPassportPlaceOfIssue,
                    value: response.DependantPassportPlaceOfIssue
                        ? { PassportIssuePlaceName: response.DependantPassportPlaceOfIssue }
                        : null,
                    refresh: !DependantPassportPlaceOfIssue.refresh
                },
                DependantPassportDateOfIssue: {
                    ...DependantPassportDateOfIssue,
                    value: response.DependantPassportDateOfIssue,
                    refresh: !DependantPassportDateOfIssue.refresh
                },
                DependantPassportDateOfExpiry: {
                    ...DependantPassportDateOfExpiry,
                    value: response.DependantPassportDateOfExpiry,
                    refresh: !DependantPassportDateOfExpiry.refresh
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
                PlaceOfIssuanceOfIdentityCardID: {
                    ...PlaceOfIssuanceOfIdentityCardID,
                    value: response.DependantIDCardIssuePlaceID
                        ? {
                              ID: response.DependantIDCardIssuePlaceID,
                              IDCardIssuePlaceName: response.DependantIDCardIssuePlaceIDView
                          }
                        : null,
                    refresh: !PlaceOfIssuanceOfIdentityCardID.refresh
                },
                PlaceOfIssuanceOfIdentityCard: {
                    ...PlaceOfIssuanceOfIdentityCard,
                    value: response.PlaceOfIssuanceOfIdentityCard
                        ? { IDCardIssuePlaceName: response.PlaceOfIssuanceOfIdentityCard }
                        : null,
                    refresh: !PlaceOfIssuanceOfIdentityCard.refresh
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
                DependantIDPlaceOfIssueID: {
                    ...DependantIDPlaceOfIssueID,
                    value: response.DependantIDPlaceOfIssueID
                        ? {
                              ID: response.DependantIDPlaceOfIssueID,
                              ProvinceName: response.DependantIDPlaceOfIssueIDView
                          }
                        : null,
                    refresh: !DependantIDPlaceOfIssueID.refresh
                },
                DependantIDPlaceOfIssue: {
                    ...DependantIDPlaceOfIssue,
                    value: response.DependantIDPlaceOfIssue ? { ProvinceName: response.DependantIDPlaceOfIssue } : null,
                    refresh: !DependantIDPlaceOfIssue.refresh
                },
                DependantIDDateOfIssue: {
                    ...DependantIDDateOfIssue,
                    value: response.DependantIDDateOfIssue,
                    refresh: !DependantIDDateOfIssue.refresh
                },
                DependantIDDateOfExpiry: {
                    ...DependantIDDateOfExpiry,
                    value: response.DependantIDDateOfExpiry,
                    refresh: !DependantIDDateOfExpiry.refresh
                }
            },

            AddressInformation: {
                ...AddressInformation,
                PCountryID: {
                    ...PCountryID,
                    value: response?.PCountryID
                        ? { ID: response.PCountryID, CountryName: response?.CountryPermanent }
                        : null,
                    disable: true,
                    refresh: !PCountryID.refresh
                },
                PProvinceID: {
                    ...PProvinceID,
                    value: response?.PProvinceID
                        ? { ID: response.PProvinceID, ProvinceName: response?.ProvincePermanent }
                        : null,
                    disable: true,
                    refresh: !PProvinceID.refresh
                },
                PDistrictID: {
                    ...PDistrictID,
                    value: response?.PDistrictID
                        ? { ID: response.PDistrictID, DistrictName: response?.DistrictPermanent }
                        : null,
                    disable: true,
                    refresh: !PDistrictID.refresh
                },
                PVillageID: {
                    ...PVillageID,
                    value: response?.PVillageID
                        ? { ID: response.PVillageID, VillageName: response?.WardPermanent }
                        : null,
                    disable: true,
                    refresh: !PVillageID.refresh
                },
                PAddressNew: {
                    ...PAddressNew,
                    value: response?.PAddressNew,
                    refresh: !PAddressNew.refresh
                },
                TCountryID: {
                    ...TCountryID,
                    value: response?.TCountryID
                        ? { ID: response.TCountryID, CountryName: response?.CountryTemporary }
                        : null,
                    disable: true,
                    refresh: !TCountryID.refresh
                },
                TProvinceID: {
                    ...TProvinceID,
                    value: response?.TProvinceID
                        ? { ID: response.TProvinceID, ProvinceName: response?.ProvinceTemporary }
                        : null,
                    disable: true,
                    refresh: !TProvinceID.refresh
                },
                TDistrictID: {
                    ...TDistrictID,
                    value: response?.TDistrictID
                        ? { ID: response.TDistrictID, DistrictName: response?.DistrictTemporary }
                        : null,
                    disable: true,
                    refresh: !TDistrictID.refresh
                },
                TVillageID: {
                    ...TVillageID,
                    value: response?.TVillageID
                        ? { ID: response.TVillageID, VillageName: response?.WardTemporary }
                        : null,
                    disable: true,
                    refresh: !TVillageID.refresh
                },
                TAddressNew: {
                    ...TAddressNew,
                    value: response?.TAddressNew,
                    refresh: !TAddressNew.refresh
                }
            },

            PAddress: {
                ...PAddress,
                value: response?.PAddress ? response?.PAddress : null,
                refresh: !PAddress.refresh
            },

            TAddress: {
                ...TAddress,
                value: response?.TAddress ? response?.TAddress : null,
                refresh: !TAddress.refresh
            }
        };

        this.setState(nextState, () => {
            this.getDataAddressNDK(
                !response.CountryName ? response?.CountryID : null,
                !response.ProvinceName ? response?.ProvinceID : null,
                !response.DistrictName ? response?.DistrictID : null,
                !response.VillageName ? response.WardID : null
            );

            // get information address when api not return name address
            this.getDataAddress(
                !response?.CountryPermanent ? response?.PCountryID : null,
                !response?.ProvincePermanent ? response.PProvinceID : null,
                !response?.DistrictPermanent ? response.PDistrictID : null,
                !response?.WardPermanent ? response?.PVillageID : null,
                !response?.CountryTemporary ? response?.TCountryID : null,
                !response?.ProvinceTemporary ? response.TProvinceID : null,
                !response?.DistrictTemporary ? response.TDistrictID : null,
                !response?.WardTemporary ? response?.TVillageID : null
            );
            if (response.RelativesID && response.IsRelatives) this.getMultiRelativeWhenChooseIsRelatives();
        });
    };

    getDataAddressNDK = (countryID, provinceID, districtID, wardID) => {
        try {
            let arrPromisse = [HttpService.Post('[URI_HR]/Cat_GetData/GetMultiCountry?text=')];

            if (countryID) {
                arrPromisse.push(HttpService.Post(`[URI_HR]/Cat_GetData/GetProvinceCascading?country=${countryID}`));
            }

            if (provinceID) {
                arrPromisse.push(HttpService.Post(`[URI_HR]/Cat_GetData/GetDistrictCascading?province=${provinceID}`));
            }

            if (districtID) {
                arrPromisse.push(HttpService.Post(`[URI_HR]/Cat_GetData/GetVillageCascading?districtid=${districtID}`));
            }

            HttpService.MultiRequest(arrPromisse).then((resAll) => {
                if (resAll) {
                    const [dataCountrys, dataProvinces, dataDistricts, dataWards] = resAll;
                    const {
                        CountryID_NDK,
                        // Tỉnh thành
                        ProvinceID_NDK,
                        // Quận huyện
                        DistrictID_NDK,
                        // Tên phường xã
                        WardID_NDK
                    } = this.state;
                    let nextState = {};
                    if (Array.isArray(dataCountrys) && countryID) {
                        const rs = dataCountrys.filter((item) => item?.ID === countryID);
                        if (rs.length > 0) {
                            nextState = {
                                ...nextState,
                                CountryID_NDK: {
                                    ...CountryID_NDK,
                                    value: rs[0].ID ? { ID: rs[0].ID, CountryName: rs[0].CountryName } : null,
                                    disable: false,
                                    refresh: !CountryID_NDK.refresh
                                }
                            };
                        }
                    }

                    if (Array.isArray(dataProvinces) && provinceID) {
                        const rs = dataProvinces.filter((item) => item?.ID === provinceID);
                        if (rs.length > 0) {
                            nextState = {
                                ...nextState,
                                ProvinceID_NDK: {
                                    ...ProvinceID_NDK,
                                    value: rs[0].ID ? { ID: rs[0].ID, ProvinceName: rs[0].ProvinceName } : null,
                                    disable: false,
                                    refresh: !ProvinceID_NDK.refresh
                                }
                            };
                        }
                    }

                    if (Array.isArray(dataDistricts) && districtID) {
                        const rs = dataDistricts.filter((item) => item?.ID === districtID);
                        if (rs.length > 0) {
                            nextState = {
                                ...nextState,
                                DistrictID_NDK: {
                                    ...DistrictID_NDK,
                                    value: rs[0].ID ? { ID: rs[0].ID, DistrictName: rs[0].DistrictName } : null,
                                    disable: false,
                                    refresh: !DistrictID_NDK.refresh
                                }
                            };
                        }
                    }

                    if (Array.isArray(dataWards) && wardID) {
                        const rs = dataWards.filter((item) => item?.ID === wardID);
                        if (rs.length > 0) {
                            nextState = {
                                ...nextState,
                                WardID_NDK: {
                                    ...WardID_NDK,
                                    value: rs[0].ID ? { ID: rs[0].ID, VillageName: rs[0].VillageName } : null,
                                    disable: false,
                                    refresh: !WardID_NDK.refresh
                                }
                            };
                        }
                    }

                    this.setState(nextState);
                }
            });
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    getConfig = () => {};

    onFinishBirthCertificateGroup = (data) => {
        const { BirthCertificate } = data,
            { BirthCertificateGroup } = this.state;

        this.setState({
            BirthCertificateGroup: {
                ...BirthCertificateGroup,
                ...BirthCertificate
            }
        });
    };

    onFinishOtherIdentificationGroup = (data) => {
        const { DepentantsPassport, Identification, IDNoInfo } = data,
            { DepentantsPassportGroup, IdentificationGroup, IDNoInfoGroup, CodeTax } = this.state;
        let nextState = {};
        if (data?.Identification?.IdentificationNo?.value) {
            nextState = {
                CodeTax: {
                    ...CodeTax,
                    value:
                        typeof data?.Identification?.IdentificationNo?.value === 'string' &&
                        data?.Identification?.IdentificationNo?.value.length === 0
                            ? null
                            : data?.Identification?.IdentificationNo?.value,
                    refresh: !CodeTax.refresh
                }
            };
        }

        this.setState({
            ...nextState,
            DepentantsPassportGroup: { DepentantsPassportGroup, ...DepentantsPassport },
            IdentificationGroup: { IdentificationGroup, ...Identification },
            IDNoInfoGroup: { IDNoInfoGroup, ...IDNoInfo }
        });
    };

    save = (navigation, isCreate, isSend) => {
        const {
                ID,
                DependantName,
                RelationID,
                CodeTax,
                DateOfWedding,
                YearOfLose,
                DependentsAddress,
                ReqDocumnetIDs,
                SchoolYear,
                PhoneNumber,
                Career,
                Gender,
                DateOfBirth,
                FileAttach,
                Note,
                IsRegisterAtCompany,
                NationalityID,
                BirthCertificate,
                //Giấy khai sinh
                BirthCertificateGroup,
                //Hộ chiếu
                DepentantsPassportGroup,
                //CCCD
                IdentificationGroup,
                //CMND
                IDNoInfoGroup,
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
                // Task: 0164814
                IsRelatives,
                RegisterDate,
                AddressInformation,
                IsLost,
                IsNotDisplayedOnPortalApp,
                PAddress,
                TAddress,
                CodeTaxOld
            } = this.state,
            { MonthOfEffect, MonthOfExpiry, CompleteDate } = IsRegisterAtCompany,
            {
                NoDocument,
                VolDocument,
                // CountryID,
                // ProvinceID,
                // DistrictID,
                // WardID,
                // Address,
                IdentifierNumber
            } = BirthCertificateGroup,
            {
                PassportNo,
                // Task: 0164814 => default hidden
                DependantPassportPlaceOfIssue,
                DependantPassportIssuePlaceID,
                DependantPassportDateOfIssue,
                DependantPassportDateOfExpiry
            } = DepentantsPassportGroup,
            {
                IdentificationNo,
                // task: 0164814
                PlaceOfIssuanceOfIdentityCard,
                PlaceOfIssuanceOfIdentityCardID,
                DateOfIssuanceOfIdentityCard,
                ExpiryDateOfIdentityCard
            } = IdentificationGroup,
            {
                IDNo,
                // task: 0164814
                DependantIDPlaceOfIssue,
                DependantIDPlaceOfIssueID,
                DependantIDDateOfIssue,
                DependantIDDateOfExpiry
            } = IDNoInfoGroup,
            { RelativesID } = IsRelatives,
            { apiConfig } = dataVnrStorage,
            { uriPor } = apiConfig;

        let params = {
            IsLost: IsLost.value,
            IsNotDisplayedOnPortalApp: IsNotDisplayedOnPortalApp.value,
            IdentifierNumber: IdentifierNumber.value,
            ProfileID: this.profileInfo.ProfileID,
            UserID: this.profileInfo.userid,
            DependantName: DependantName.value ? DependantName.value : '',
            CodeTax: CodeTax.value,
            RelationID: RelationID.value ? RelationID.value.ID : null,
            DateOfWedding: DateOfWedding.value ? Vnr_Function.formatDateAPI(DateOfWedding.value) : null,
            DateOfBirth: DateOfBirth.value ? Vnr_Function.formatDateAPI(DateOfBirth.value) : null,
            YearOfLose: YearOfLose.value ? Vnr_Function.formatDateAPI(YearOfLose.value) : null,
            Gender: Gender.value ? Gender.value.Value : null,
            DependentsAddress: DependentsAddress.value ? DependentsAddress.value : '',
            NationalityID: NationalityID.value ? NationalityID.value.ID : null,
            ReqDocumnetIDs: ReqDocumnetIDs.value ? ReqDocumnetIDs.value.Code : null,
            SchoolYear: SchoolYear.value ? SchoolYear.value : null,
            Career: Career.value,
            PhoneNumber: PhoneNumber.value,
            FileAttach: FileAttach.value ? FileAttach.value.map((item) => item.fileName).join(',') : null,
            Note: Note.value,
            IsRegisterAtCompany: IsRegisterAtCompany.value,
            MonthOfEffect: MonthOfEffect.value,
            MonthOfExpiry: MonthOfExpiry.value,
            CompleteDate: CompleteDate.value,

            CountryID: CountryID_NDK.value ? CountryID_NDK.value.ID : null,
            ProvinceID: ProvinceID_NDK.value ? ProvinceID_NDK.value.ID : null,
            DistrictID: DistrictID_NDK.value ? DistrictID_NDK.value.ID : null,
            WardID: WardID_NDK.value ? WardID_NDK.value.ID : null,
            // Address: Address_NDK.value ? Address_NDK.value : null,
            AddressRegister: Address_NDK.value,
            // Giay khai sinh
            NoDocument: NoDocument.value,
            VolDocument: VolDocument.value,
            // CountryID: CountryID.value ? CountryID.value.ID : null,
            // ProvinceID: ProvinceID.value ? ProvinceID.value.ID : null,
            // DistrictID: DistrictID.value ? DistrictID.value.ID : null,
            // WardID: WardID.value ? WardID.value.ID : null,
            // Address: Address.value,

            //  hộ chiếu
            DependantPassportDateOfExpiry: DependantPassportDateOfExpiry.value
                ? DependantPassportDateOfExpiry.value
                : null,
            DependantPassportDateOfIssue: DependantPassportDateOfIssue.value
                ? DependantPassportDateOfIssue.value
                : null,
            PassportNo: PassportNo.value,
            DependantPassportIssuePlaceID: DependantPassportIssuePlaceID?.value?.ID
                ? DependantPassportIssuePlaceID?.value?.ID
                : null,
            //CCCD
            IdentificationNo: IdentificationNo.value,
            DependantIDCardIssuePlaceID: PlaceOfIssuanceOfIdentityCardID?.value?.ID
                ? PlaceOfIssuanceOfIdentityCardID?.value?.ID
                : null,
            DateOfIssuanceOfIdentityCard: DateOfIssuanceOfIdentityCard.value,
            ExpiryDateOfIdentityCard: ExpiryDateOfIdentityCard.value,
            //CMND
            DependantIDDateOfExpiry: DependantIDDateOfExpiry.value,
            DependantIDDateOfIssue: DependantIDDateOfIssue.value,
            IDNo: IDNo.value,
            DependantIDPlaceOfIssueID: DependantIDPlaceOfIssueID?.value?.ID
                ? DependantIDPlaceOfIssueID?.value?.ID
                : null,

            IsPortal: true,
            KeyCode: 'VN',

            // task: 0164814
            DependantPassportPlaceOfIssue: DependantPassportPlaceOfIssue?.value?.PassportIssuePlaceName
                ? DependantPassportPlaceOfIssue?.value?.PassportIssuePlaceName
                : null,
            PlaceOfIssuanceOfIdentityCard: PlaceOfIssuanceOfIdentityCard?.value?.IDCardIssuePlaceName
                ? PlaceOfIssuanceOfIdentityCard?.value?.IDCardIssuePlaceName
                : null,
            DependantIDPlaceOfIssue: DependantIDPlaceOfIssue?.value?.ProvinceName
                ? DependantIDPlaceOfIssue?.value?.ProvinceName
                : null,
            IsRelatives: IsRelatives.value,
            RegisterDate: Vnr_Function.formatDateAPI(RegisterDate.value), // moment(RegisterDate.value).format('M/D/YYYY LT')
            RelativesID: RelativesID?.value?.ID ? RelativesID?.value?.ID : null,

            // task: 0171426: [Hotfix_AVN_v8.11.41.01.08] Modify popup tạo mới Người Phụ thuộc (APP)
            PCountryID: AddressInformation.PCountryID.value?.ID ? AddressInformation.PCountryID.value?.ID : null,
            PProvinceID: AddressInformation.PProvinceID.value?.ID ? AddressInformation.PProvinceID.value?.ID : null,
            PDistrictID: AddressInformation.PDistrictID.value?.ID ? AddressInformation.PDistrictID.value?.ID : null,
            PVillageID: AddressInformation.PVillageID.value?.ID ? AddressInformation.PVillageID.value?.ID : null,
            PAddressNew: AddressInformation.PAddressNew.value ? AddressInformation.PAddressNew.value : null,
            TCountryID: AddressInformation.TCountryID.value?.ID ? AddressInformation.TCountryID.value?.ID : null,
            TProvinceID: AddressInformation.TProvinceID.value?.ID ? AddressInformation.TProvinceID.value?.ID : null,
            TDistrictID: AddressInformation.TDistrictID.value?.ID ? AddressInformation.TDistrictID.value?.ID : null,
            TVillageID: AddressInformation.TVillageID.value?.ID ? AddressInformation.TVillageID.value?.ID : null,
            TAddressNew: AddressInformation.TAddressNew.value ? AddressInformation.TAddressNew.value : null,
            PAddress: PAddress.value ? PAddress.value : null,
            TAddress: TAddress.value ? TAddress.value : null,
            CodeTaxOld: CodeTaxOld.value ?? null
        };

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

        BirthCertificate.value &&
            BirthCertificate.value.forEach((item) => {
                params = {
                    ...params,
                    [item.Value]: true
                };
            });

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Hre_ApprovedDependant', params).then((data) => {
            VnrLoadingSevices.hide();

            if (data && typeof data == 'object') {
                if (data.ActionStatus && data.ActionStatus.split('|')[0] == 'InValid') {
                    const message = data.ActionStatus.split('|')[1];
                    ToasterSevice.showWarning(message, 4000);
                } else if (data.ActionStatus == 'OpenPopUp') {
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
                }
                // else if (data.ActionStatus != 'Success' && data.ActionStatus != translate('Success')) {
                //     ToasterSevice.showWarning(data.ActionStatus, 4000);
                // }
                else {
                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);

                    if (isCreate) {
                        this.refreshView();
                    } else {
                        // navigation.goBack();
                        const { reload } = this.props.navigation.state.params;
                        if (reload && typeof reload === 'function') {
                            reload();
                        }

                        DependantConfirmedBusinessFunction.checkForLoadEditDelete[ScreenName.DependantWaitConfirm] =
                            true;
                        DrawerServices.navigate(ScreenName.DependantWaitConfirm);
                    }
                }
            }
        });
    };

    onSaveAndCreate = (navigation) => {
        this.save(navigation, true, null);
    };

    onSaveAndSend = (navigation) => {
        this.save(navigation, null, true);
    };

    onChangeMonthOfEffect = (value) => {
        const { IsRegisterAtCompany } = this.state;
        this.setState({
            IsRegisterAtCompany: {
                ...IsRegisterAtCompany,
                MonthOfEffect: {
                    ...IsRegisterAtCompany.MonthOfEffect,
                    value,
                    refresh: !IsRegisterAtCompany.MonthOfEffect.refresh
                }
            }
        });
    };

    onChangeMonthOfExpiry = (value) => {
        const { IsRegisterAtCompany } = this.state;
        this.setState({
            IsRegisterAtCompany: {
                ...IsRegisterAtCompany,
                MonthOfExpiry: {
                    ...IsRegisterAtCompany.MonthOfExpiry,
                    value,
                    refresh: !IsRegisterAtCompany.MonthOfExpiry.refresh
                }
            }
        });
    };

    onChangeCompleteDate = (value) => {
        const { IsRegisterAtCompany } = this.state;
        this.setState({
            IsRegisterAtCompany: {
                ...IsRegisterAtCompany,
                CompleteDate: {
                    ...IsRegisterAtCompany.CompleteDate,
                    value,
                    refresh: !IsRegisterAtCompany.CompleteDate.refresh
                }
            }
        });
    };

    getMultiRelativeWhenChooseIsRelatives = () => {
        const { Profile, IsRelatives } = this.state,
            { RelativesID } = IsRelatives;
        HttpService.Get(
            `[URI_HR]/Hre_GetData/GetMultiRelativesByProfileID?ProfileID=${Profile?.ID ? Profile?.ID : null}`
        )
            .then((res) => {
                if (res && Array.isArray(res) && res.length > 0) {
                    this.setState({
                        IsRelatives: {
                            ...IsRelatives,
                            RelativesID: {
                                ...IsRelatives.RelativesID,
                                data: res,
                                value:
                                    RelativesID.value && RelativesID.value.ID
                                        ? res.find((item) => item.ID == RelativesID.value.ID)
                                        : null,
                                refresh: !IsRelatives.RelativesID.refresh
                            }
                        }
                    });
                }
            })
            .catch((error) => {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            });
    };

    onChooseRelative = (value) => {
        if (value) {
            const {
                    DependantName,
                    CodeTax,
                    RelationID,
                    DateOfWedding,
                    DateOfBirth,
                    YearOfLose,
                    Gender,
                    DependentsAddress,
                    NationalityID,
                    PhoneNumber,
                    Career,
                    IsRegisterAtCompany,
                    //Giấy khai sinh
                    BirthCertificateGroup,
                    //Hộ chiếu
                    DepentantsPassportGroup,
                    //CCCD
                    IdentificationGroup,
                    //CMND
                    IDNoInfoGroup,

                    // Task: Nhan.Nguyen 0164814: [Source Main] Modify màn hình “Danh sách người phụ thuộc” trong Hồ sơ cá nhân (App)

                    // Người phụ thuộc là người thân
                    IsRelatives,
                    RegisterDate,
                    isUpperCaseText,
                    AddressInformation
                } = this.state,
                { MonthOfEffect, MonthOfExpiry } = IsRegisterAtCompany,
                { RelativesID } = IsRelatives,
                { NoDocument, VolDocument } = BirthCertificateGroup,
                {
                    PassportNo,
                    // Task: 0164814 => default hidden
                    DependantPassportPlaceOfIssue,
                    DependantPassportIssuePlaceID,
                    DependantPassportDateOfIssue,
                    DependantPassportDateOfExpiry
                } = DepentantsPassportGroup,
                {
                    IdentificationNo,
                    // task: 0164814
                    PlaceOfIssuanceOfIdentityCard,
                    PlaceOfIssuanceOfIdentityCardID,
                    DateOfIssuanceOfIdentityCard,
                    ExpiryDateOfIdentityCard
                } = IdentificationGroup,
                {
                    IDNo,
                    // task: 0164814
                    DependantIDPlaceOfIssue,
                    DependantIDPlaceOfIssueID,
                    DependantIDDateOfIssue,
                    DependantIDDateOfExpiry
                } = IDNoInfoGroup,
                {
                    PCountryID,
                    PProvinceID,
                    PDistrictID,
                    PVillageID,
                    PAddressNew,
                    TCountryID,
                    TProvinceID,
                    TDistrictID,
                    TVillageID,
                    TAddressNew
                } = AddressInformation;
            try {
                HttpService.Post('[URI_HR]/Hre_GetDataDI/GetRelativeByID', {
                    ID: value.ID
                })
                    .then((res) => {
                        if (res) {
                            let nextState = {
                                IsRelatives: {
                                    ...IsRelatives,
                                    RelativesID: {
                                        ...RelativesID,
                                        value: value,
                                        refresh: !RelativesID.refresh
                                    }
                                },
                                DependantName: {
                                    ...DependantName,
                                    value: value.RelativeName ? value.RelativeName : null,
                                    refresh: !DependantName.refresh
                                },
                                CodeTax: {
                                    ...CodeTax,
                                    value: res?.CodeTax ?? res?.IdentificationNo ?? null,
                                    refresh: !CodeTax.refresh
                                },
                                RelationID: {
                                    ...RelationID,
                                    value: res.RelativeTypeID
                                        ? { ID: res.RelativeTypeID, RelativeTypeName: res.RelativeTypeName }
                                        : null,
                                    refresh: !RelationID.refresh
                                },
                                DateOfWedding: {
                                    ...DateOfWedding,
                                    value: res.DateOfWedding ? moment(res.DateOfWedding) : null,
                                    refresh: !DateOfWedding.refresh
                                },
                                DateOfBirth: {
                                    ...DateOfBirth,
                                    value: res.DateOfBirth ? moment(res.DateOfBirth) : null,
                                    refresh: !DateOfBirth.refresh
                                },
                                YearOfLose: {
                                    ...YearOfLose,
                                    value: res.YearOfLose ? moment(res.YearOfLose) : null,
                                    refresh: !YearOfLose.refresh
                                },
                                Gender: {
                                    ...Gender,
                                    value: res.Gender ? { Value: res.Gender, Text: res.GenderView } : null,
                                    refresh: !CodeTax.refresh
                                },
                                DependentsAddress: {
                                    ...DependentsAddress,
                                    value: res.Address ? res.Address : null,
                                    refresh: !DependentsAddress.refresh
                                },
                                NationalityID: {
                                    ...NationalityID,
                                    value: res.NationalityID
                                        ? { ID: res.NationalityID, CountryName: res.NationalityName }
                                        : null,
                                    refresh: !NationalityID.refresh
                                },
                                Career: {
                                    ...Career,
                                    value: res.Career ? res.Career : null,
                                    refresh: !Career.refresh
                                },
                                PhoneNumber: {
                                    ...PhoneNumber,
                                    value: res.PhoneNumber ? res.PhoneNumber : null,
                                    refresh: !PhoneNumber.refresh
                                },
                                BirthCertificateGroup: {
                                    ...BirthCertificateGroup,
                                    NoDocument: {
                                        ...NoDocument,
                                        value: res.NoDocument ? res.NoDocument : null,
                                        refresh: !NoDocument.refresh
                                    },
                                    VolDocument: {
                                        ...VolDocument,
                                        value: res.VolDocument ? res.VolDocument : null,
                                        refresh: !VolDocument.refresh
                                    }
                                },
                                IsRegisterAtCompany: {
                                    ...IsRegisterAtCompany,
                                    value: res.IsRegisterAtCompany ? res.IsRegisterAtCompany : false,
                                    refresh: !IsRegisterAtCompany.refresh,
                                    MonthOfEffect: {
                                        ...MonthOfEffect,
                                        value: res.MonthOfEffect ? moment(res.MonthOfEffect) : null,
                                        refresh: !MonthOfEffect.refresh
                                    },
                                    MonthOfExpiry: {
                                        ...MonthOfExpiry,
                                        value: res.MonthOfExpiry ? moment(res.MonthOfExpiry) : null,
                                        refresh: !MonthOfExpiry.refresh
                                    }
                                },
                                RegisterDate: {
                                    ...RegisterDate,
                                    value: res.RegisterDate ? moment(res.RegisterDate) : moment(new Date()),
                                    refresh: !RegisterDate.refresh
                                },

                                // CMND
                                IDNoInfoGroup: {
                                    ...IDNoInfoGroup,
                                    IDNo: {
                                        ...IDNo,
                                        value: res.IDNo ? res.IDNo : null,
                                        refresh: !IDNo.refresh
                                    },
                                    DependantIDPlaceOfIssue: {
                                        ...DependantIDPlaceOfIssue,
                                        value: res.RelativesIDPlaceOfIssue
                                            ? { ProvinceName: res.RelativesIDPlaceOfIssue }
                                            : null,
                                        refresh: !DependantIDPlaceOfIssue.refresh
                                    },
                                    DependantIDPlaceOfIssueID: {
                                        ...DependantIDPlaceOfIssueID,
                                        value: res.RelativesIDPlaceOfIssueID
                                            ? {
                                                  ID: res.RelativesIDPlaceOfIssueID,
                                                  ProvinceName: res?.RelativesIDPlaceOfIssueIDView
                                              }
                                            : null,
                                        refresh: !DependantIDPlaceOfIssueID.refresh
                                    },
                                    DependantIDDateOfIssue: {
                                        ...DependantIDDateOfIssue,
                                        value: res.IDDateOfIssue ? moment(res.IDDateOfIssue) : null,
                                        refresh: !DependantIDDateOfIssue.refresh
                                    },
                                    DependantIDDateOfExpiry: {
                                        ...DependantIDDateOfExpiry,
                                        value: res.IDDateOfExpiry ? moment(res.IDDateOfExpiry) : null,
                                        refresh: !DependantIDDateOfExpiry.refresh
                                    }
                                },

                                // CCCD
                                IdentificationGroup: {
                                    ...IdentificationGroup,
                                    IdentificationNo: {
                                        ...IdentificationNo,
                                        value: res.IdentificationNo ? res.IdentificationNo : null,
                                        refresh: !IdentificationNo.refresh
                                    },
                                    PlaceOfIssuanceOfIdentityCard: {
                                        ...PlaceOfIssuanceOfIdentityCard,
                                        value: res.PlaceOfIssuanceOfIdentityCard
                                            ? { IDCardIssuePlaceName: res.PlaceOfIssuanceOfIdentityCard }
                                            : null,
                                        refresh: !PlaceOfIssuanceOfIdentityCard.refresh
                                    },
                                    PlaceOfIssuanceOfIdentityCardID: {
                                        ...PlaceOfIssuanceOfIdentityCardID,
                                        value: res.RelativesIDCardIssuePlaceID
                                            ? {
                                                  ID: res.RelativesIDCardIssuePlaceID,
                                                  IDCardIssuePlaceName: res?.RelativesIDCardIssuePlaceIDView
                                              }
                                            : null,
                                        refresh: !PlaceOfIssuanceOfIdentityCardID.refresh
                                    },
                                    DateOfIssuanceOfIdentityCard: {
                                        ...DateOfIssuanceOfIdentityCard,
                                        value: res.DateOfIssuanceOfIdentityCard
                                            ? moment(res.DateOfIssuanceOfIdentityCard)
                                            : null,
                                        refresh: !DateOfIssuanceOfIdentityCard.refresh
                                    },
                                    ExpiryDateOfIdentityCard: {
                                        ...ExpiryDateOfIdentityCard,
                                        value: res.ExpiryDateOfIdentityCard
                                            ? moment(res.ExpiryDateOfIdentityCard)
                                            : null,
                                        refresh: !ExpiryDateOfIdentityCard.refresh
                                    }
                                },

                                // Hộ chiếu
                                DepentantsPassportGroup: {
                                    ...DepentantsPassportGroup,
                                    PassportNo: {
                                        ...PassportNo,
                                        value: res.RelativesPassportNo ? res.RelativesPassportNo : null,
                                        refresh: !PassportNo.refresh
                                    },
                                    DependantPassportPlaceOfIssue: {
                                        ...DependantPassportPlaceOfIssue,
                                        value: res.PlaceOfIssuanceOfIdentityCard
                                            ? { PassportIssuePlaceName: res.PlaceOfIssuanceOfIdentityCard }
                                            : null,
                                        refresh: !DependantPassportPlaceOfIssue.refresh
                                    },
                                    DependantPassportIssuePlaceID: {
                                        ...DependantPassportIssuePlaceID,
                                        value: res.RelativesPassportIssuePlaceID
                                            ? {
                                                  ID: res.RelativesPassportIssuePlaceID,
                                                  PassportIssuePlaceName: res?.RelativesPassportIssuePlaceIDView
                                              }
                                            : null,
                                        refresh: !DependantPassportIssuePlaceID.refresh
                                    },
                                    DependantPassportDateOfIssue: {
                                        ...DependantPassportDateOfIssue,
                                        value: res.RelativesPassportDateOfIssue
                                            ? moment(res.RelativesPassportDateOfIssue)
                                            : null,
                                        refresh: !DependantPassportDateOfIssue.refresh
                                    },
                                    DependantPassportDateOfExpiry: {
                                        ...DependantPassportDateOfExpiry,
                                        value: res.RelativesPassportDateOfExpiry
                                            ? moment(res.RelativesPassportDateOfExpiry)
                                            : null,
                                        refresh: !DependantPassportDateOfExpiry.refresh
                                    }
                                },

                                AddressInformation: {
                                    ...AddressInformation,
                                    PCountryID: {
                                        ...PCountryID,
                                        value: res?.PCountryID
                                            ? { ID: res?.PCountryID, CountryName: res?.PCountryName }
                                            : null,
                                        refresh: !PCountryID.refresh
                                    },
                                    PProvinceID: {
                                        ...PProvinceID,
                                        value: res?.PProvinceID
                                            ? { ID: res?.PProvinceID, ProvinceName: res?.PProvinceName }
                                            : null,
                                        refresh: !PProvinceID.refresh
                                    },
                                    PDistrictID: {
                                        ...PDistrictID,
                                        value: res?.PDistrictID
                                            ? { ID: res?.PDistrictID, DistrictName: res?.PDistrictName }
                                            : null,
                                        refresh: !PDistrictID.refresh
                                    },
                                    PVillageID: {
                                        ...PVillageID,
                                        value: res?.PVillageID
                                            ? { ID: res?.PVillageID, VillageName: res?.PVillageName }
                                            : null,
                                        refresh: !PVillageID.refresh
                                    },
                                    PAddressNew: {
                                        ...PAddressNew,
                                        value: res?.PAddress ? res?.PAddress : null,
                                        refresh: !PAddressNew.refresh
                                    },
                                    TCountryID: {
                                        ...TCountryID,
                                        value: res?.TCountryID
                                            ? { ID: res?.TCountryID, CountryName: res?.TCountryName }
                                            : null,
                                        refresh: !TCountryID.refresh
                                    },
                                    TProvinceID: {
                                        ...TProvinceID,
                                        value: res?.TProvinceID
                                            ? { ID: res?.TProvinceID, ProvinceName: res?.TProvinceName }
                                            : null,
                                        refresh: !TProvinceID.refresh
                                    },
                                    TDistrictID: {
                                        ...TDistrictID,
                                        value: res?.TDistrictID
                                            ? { ID: res?.TDistrictID, DistrictName: res?.TDistrictName }
                                            : null,
                                        refresh: !TDistrictID.refresh
                                    },
                                    TVillageID: {
                                        ...TVillageID,
                                        value: res?.TVillageID
                                            ? { ID: res?.TVillageID, VillageName: res?.TVillageName }
                                            : null,
                                        refresh: !TVillageID.refresh
                                    },
                                    TAddressNew: {
                                        ...TAddressNew,
                                        value: res?.TAddress ? res?.TAddress : null,
                                        refresh: !TAddressNew.refresh
                                    }
                                }
                            };

                            if (isUpperCaseText?.DependantName && DependantName.value) {
                                this.handleUpperCase('DependantName', DependantName.value)
                                    .then((res) => {
                                        if (res) {
                                            nextState = {
                                                ...nextState,
                                                DependantName: {
                                                    ...DependantName,
                                                    value: res,
                                                    refresh: !DependantName.refresh
                                                }
                                            };
                                        }
                                    })
                                    .catch((error) => {
                                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                                    });
                            }

                            if (isUpperCaseText?.Career && Career.value) {
                                this.handleUpperCase('Career', Career.value)
                                    .then((res) => {
                                        if (res) {
                                            nextState = {
                                                ...nextState,
                                                Career: {
                                                    ...Career,
                                                    value: res,
                                                    refresh: !Career.refresh
                                                }
                                            };
                                        }
                                    })
                                    .catch((error) => {
                                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                                    });
                            }

                            this.setState(nextState, () => {
                                this.getDataAddress(
                                    res?.PCountryID,
                                    res.PProvinceID,
                                    res.PDistrictID,
                                    res?.PVillageID,
                                    res?.TCountryID,
                                    res.TProvinceID,
                                    res.TDistrictID,
                                    res?.TVillageID
                                );
                            });
                        }
                    })
                    .catch((error) => {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    });
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        }
    };

    handleUpperCase = async (fieldNameInput, valueField) => {
        return await HttpService.Post('[URI_HR]/Hre_GetData/convertToUpperCase', {
            tableName: 'Hre_Dependant',
            fieldNameInput,
            valueField
        });
    };

    handleAddressInformation = (data) => {
        const { AddressInformation } = this.state;

        this.setState({
            AddressInformation: {
                ...AddressInformation,
                ...data
            }
        });
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

    onChangeRelative = (item) => {
        const { RelationID, DateOfWedding } = this.state;
        let isShowDate = false;
        if ((item && item.Relative == 'E_HUSBAND') || item.Relative == 'E_WIFE') {
            isShowDate = true;
        }

        this.setState({
            RelationID: {
                ...RelationID,
                value: item,
                refresh: !RelationID.refresh
            },
            DateOfWedding: {
                ...DateOfWedding,
                visible: isShowDate,
                refresh: !DateOfWedding.refresh
            }
        });
    };

    onFinishCountry = (listValues) => {
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

    onFinishProvince = (listValues) => {
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

    onFinishDistrict = (listValues) => {
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

    onFinishVillage = (listValues) => {
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

            HttpService.MultiRequest(arrPromisse).then((resAll) => {
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
                        const rs = dataCountrys.filter((item) => item?.ID === countryIDP);
                        if (rs.length > 0) {
                            if (nextState?.AddressInformation) {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...nextState?.AddressInformation,
                                        PCountryID: {
                                            ...PCountryID,
                                            value: rs[0].ID ? { ID: rs[0].ID, CountryName: rs[0].CountryName } : null,
                                            disable: true,
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
                                            disable: true,
                                            refresh: !PCountryID.refresh
                                        }
                                    }
                                };
                            }
                        }
                    }

                    if (Array.isArray(dataProvinces) && provinceIDP) {
                        const rs = dataProvinces.filter((item) => item?.ID === provinceIDP);
                        if (rs.length > 0) {
                            if (nextState?.AddressInformation) {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...nextState?.AddressInformation,
                                        PProvinceID: {
                                            ...PProvinceID,
                                            value: rs[0].ID ? { ID: rs[0].ID, ProvinceName: rs[0].ProvinceName } : null,
                                            disable: true,
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
                                            disable: true,
                                            refresh: !PProvinceID.refresh
                                        }
                                    }
                                };
                            }
                        }
                    }

                    if (Array.isArray(dataDistricts) && districtIDP) {
                        const rs = dataDistricts.filter((item) => item?.ID === districtIDP);
                        if (rs.length > 0) {
                            if (nextState?.AddressInformation) {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...nextState?.AddressInformation,
                                        PDistrictID: {
                                            ...PDistrictID,
                                            value: rs[0].ID ? { ID: rs[0].ID, DistrictName: rs[0].DistrictName } : null,
                                            disable: true,
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
                                            disable: true,
                                            refresh: !PDistrictID.refresh
                                        }
                                    }
                                };
                            }
                        }
                    }

                    if (Array.isArray(dataWards) && wardIDP) {
                        const rs = dataWards.filter((item) => item?.ID === wardIDP);
                        if (rs.length > 0) {
                            if (nextState?.AddressInformation) {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...nextState?.AddressInformation,
                                        PVillageID: {
                                            ...PVillageID,
                                            value: rs[0].ID ? { ID: rs[0].ID, VillageName: rs[0].VillageName } : null,
                                            disable: true,
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
                                            disable: true,
                                            refresh: !PVillageID.refresh
                                        }
                                    }
                                };
                            }
                        }
                    }

                    if (Array.isArray(dataCountrys) && countryIDT) {
                        const rs = dataCountrys.filter((item) => item?.ID === countryIDT);
                        if (rs.length > 0) {
                            if (nextState?.AddressInformation) {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...nextState?.AddressInformation,
                                        TCountryID: {
                                            ...TCountryID,
                                            value: rs[0].ID ? { ID: rs[0].ID, CountryName: rs[0].CountryName } : null,
                                            disable: true,
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
                                            disable: true,
                                            refresh: !TCountryID.refresh
                                        }
                                    }
                                };
                            }
                        }
                    }

                    if (Array.isArray(dataProvincesT) && provinceIDT) {
                        const rs = dataProvincesT.filter((item) => item?.ID === provinceIDT);
                        if (rs.length > 0) {
                            if (nextState?.AddressInformation) {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...nextState?.AddressInformation,
                                        TProvinceID: {
                                            ...TProvinceID,
                                            value: rs[0].ID ? { ID: rs[0].ID, ProvinceName: rs[0].ProvinceName } : null,
                                            disable: true,
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
                                            disable: true,
                                            refresh: !TProvinceID.refresh
                                        }
                                    }
                                };
                            }
                        }
                    }

                    if (Array.isArray(dataDistrictsT) && districtIDT) {
                        const rs = dataDistrictsT.filter((item) => item?.ID === districtIDT);
                        if (rs.length > 0) {
                            if (nextState?.AddressInformation) {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...nextState?.AddressInformation,
                                        TDistrictID: {
                                            ...TDistrictID,
                                            value: rs[0].ID ? { ID: rs[0].ID, DistrictName: rs[0].DistrictName } : null,
                                            disable: true,
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
                                            disable: true,
                                            refresh: !TDistrictID.refresh
                                        }
                                    }
                                };
                            }
                        }
                    }

                    if (Array.isArray(dataWardsT) && wardIDT) {
                        const rs = dataWardsT.filter((item) => item?.ID === wardIDT);
                        if (rs.length > 0) {
                            if (nextState?.AddressInformation) {
                                nextState = {
                                    ...nextState,
                                    AddressInformation: {
                                        ...nextState?.AddressInformation,
                                        TVillageID: {
                                            ...TVillageID,
                                            value: rs[0].ID ? { ID: rs[0].ID, VillageName: rs[0].VillageName } : null,
                                            disable: true,
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
                                            disable: true,
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

    getTPAddressByProfileID = () => {
        try {
            const { Profile, AddressInformation } = this.state,
                {
                    PCountryID,
                    PProvinceID,
                    PDistrictID,
                    PVillageID,
                    PAddressNew,
                    TCountryID,
                    TProvinceID,
                    TDistrictID,
                    TVillageID,
                    TAddressNew
                } = AddressInformation;
            if (Profile?.ID) {
                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Hre_GetDataV2/GetTPAddressByProfileID', {
                    ProfileID: Profile?.ID
                })
                    .then((res) => {
                        VnrLoadingSevices.hide();
                        if (res) {
                            this.setState({
                                AddressInformation: {
                                    ...AddressInformation,
                                    PCountryID: {
                                        ...PCountryID,
                                        value: res?.PCountryID
                                            ? { ID: res?.PCountryID, CountryName: res?.PCountryName }
                                            : null,
                                        refresh: !PCountryID.refresh
                                    },
                                    PProvinceID: {
                                        ...PProvinceID,
                                        value: res?.PProvinceID
                                            ? { ID: res?.PProvinceID, ProvinceName: res?.PProvinceName }
                                            : null,
                                        refresh: !PProvinceID.refresh
                                    },
                                    PDistrictID: {
                                        ...PDistrictID,
                                        value: res?.PDistrictID
                                            ? { ID: res?.PDistrictID, DistrictName: res?.PDistrictName }
                                            : null,
                                        refresh: !PDistrictID.refresh
                                    },
                                    PVillageID: {
                                        ...PVillageID,
                                        value: res?.VillageID
                                            ? { ID: res?.VillageID, VillageName: res?.VillageName }
                                            : null,
                                        refresh: !PVillageID.refresh
                                    },
                                    PAddressNew: {
                                        ...PAddressNew,
                                        value: res?.PAddress ? res?.PAddress : null,
                                        refresh: !PAddressNew.refresh
                                    },
                                    TCountryID: {
                                        ...TCountryID,
                                        value: res?.TCountryID
                                            ? { ID: res?.TCountryID, CountryName: res?.TCountryName }
                                            : null,
                                        refresh: !TCountryID.refresh
                                    },
                                    TProvinceID: {
                                        ...TProvinceID,
                                        value: res?.TProvinceID
                                            ? { ID: res?.TProvinceID, ProvinceName: res?.TProvinceName }
                                            : null,
                                        refresh: !TProvinceID.refresh
                                    },
                                    TDistrictID: {
                                        ...TDistrictID,
                                        value: res?.TDistrictID
                                            ? { ID: res?.TDistrictID, DistrictName: res?.TDistrictName }
                                            : null,
                                        refresh: !TDistrictID.refresh
                                    },
                                    TVillageID: {
                                        ...TVillageID,
                                        value: res?.TAVillageID
                                            ? { ID: res?.TAVillageID, VillageName: res?.TAVillageName }
                                            : null,
                                        refresh: !TVillageID.refresh
                                    },
                                    TAddressNew: {
                                        ...TAddressNew,
                                        value: res?.TAddress ? res?.TAddress : null,
                                        refresh: !TAddressNew.refresh
                                    }
                                }
                            });
                        }
                    })
                    .catch((error) => {
                        VnrLoadingSevices.hide();
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    });
            }
        } catch (error) {
            VnrLoadingSevices.hide();
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    render() {
        const {
                fieldValid,
                DependantName,
                CodeTax,
                RelationID,
                DateOfWedding,
                DateOfBirth,
                YearOfLose,
                Gender,
                DependentsAddress,
                NationalityID,
                ReqDocumnetIDs,
                SchoolYear,
                PhoneNumber,
                Career,
                Note,
                IsRegisterAtCompany,
                BirthCertificate,
                FileAttach,
                //Giấy khai sinh
                BirthCertificateGroup,
                //Hộ chiếu
                DepentantsPassportGroup,
                //CCCD
                IdentificationGroup,
                //CMND
                IDNoInfoGroup,
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
                // Task: Nhan.Nguyen 0164814: [Source Main] Modify màn hình “Danh sách người phụ thuộc” trong Hồ sơ cá nhân (App)

                // Người phụ thuộc là người thân
                IsRelatives,
                RegisterDate,
                isUpperCaseText,
                AddressInformation,
                IsLost,
                IsNotDisplayedOnPortalApp,
                fieldHiden,
                PAddress,
                TAddress,
                CodeTaxOld
            } = this.state,
            { MonthOfEffect, MonthOfExpiry, CompleteDate } = IsRegisterAtCompany,
            { RelativesID } = IsRelatives;

        const { textLableInfo, contentViewControl, viewLable, viewControl, styBtnCheckBox, styBtnCheckBoxText } =
                stylesListPickerControl,
            { textLableGroup, styleViewTitleGroupRow } = styleViewTitleForGroup;

        let tranPassport =
            translate('HRM_HR_IDCard') +
            '/' +
            translate('HRM_HR_IdentificationCard') +
            '/' +
            translate('HRM_HR_Passport_Portal');

        //#region [Xử lý 3 nút lưu]
        const listActions = [];

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Hre_DependantPopup_BtnSaveSend'] &&
            PermissionForAppMobile.value['New_Hre_DependantPopup_BtnSaveSend']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_SENMAIL,
                title: translate('HRM_Common_SaveAndSendRequest'),
                onPress: () => this.onSaveAndSend(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Hre_DependantPopup_BtnSaveClose'] &&
            PermissionForAppMobile.value['New_Hre_DependantPopup_BtnSaveClose']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_CLOSE,
                title: translate('HRM_Common_SaveClose'),
                onPress: () => this.save(this.props.navigation)
            });
        }

        // New_Hre_DependantPopup_BtnSaveNew
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
                        <View style={styleViewTitleGroupRow}>
                            <VnrText style={[styleSheets.text, textLableGroup]} i18nKey={'HRM_HR_GeneralInformation'} />
                        </View>

                        {/* thông tin chung */}
                        <View>
                            {/* Người phụ thuộc là người thân - IsRelatives */}
                            {IsRelatives.visibleConfig && IsRelatives.visible && (
                                <View style={contentViewControl}>
                                    <TouchableOpacity
                                        style={styBtnCheckBox}
                                        onPress={() =>
                                            this.setState(
                                                {
                                                    IsRelatives: {
                                                        ...IsRelatives,
                                                        value: !IsRelatives.value
                                                    }
                                                },
                                                () => {
                                                    this.getMultiRelativeWhenChooseIsRelatives();
                                                }
                                            )
                                        }
                                    >
                                        <CheckBox
                                            checkBoxColor={Colors.black}
                                            checkedCheckBoxColor={Colors.primary}
                                            isChecked={IsRelatives.value}
                                            disable={IsRelatives.disable}
                                            onClick={() =>
                                                this.setState(
                                                    {
                                                        IsRelatives: {
                                                            ...IsRelatives,
                                                            value: !IsRelatives.value
                                                        }
                                                    },
                                                    () => {
                                                        this.getMultiRelativeWhenChooseIsRelatives();
                                                    }
                                                )
                                            }
                                        />
                                        <VnrText
                                            style={[styleSheets.text, styBtnCheckBoxText]}
                                            i18nKey={IsRelatives.label}
                                        />
                                        {fieldValid.IsRelatives && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </TouchableOpacity>
                                </View>
                            )}

                            {/* chọn người thân - RelativesID */}
                            {IsRelatives.value && RelativesID.visibleConfig && RelativesID.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={RelativesID.label}
                                        />

                                        {/* valid RelativesID */}
                                        {fieldValid.RelativesID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            // api={
                                            //     {
                                            //         "urlApi": `[URI_HR]/Hre_GetData/GetMultiRelativesByProfileID?ProfileID=${Profile?.ID ? Profile?.ID : null}`,
                                            //         "type": "E_GET"
                                            //     }
                                            // }
                                            dataLocal={RelativesID.data}
                                            value={RelativesID.value}
                                            refresh={RelativesID.refresh}
                                            textField="RelativeName"
                                            valueField="ID"
                                            filter={true}
                                            // filterServer={true}
                                            filterLocal={true}
                                            filterParams="RelativeName"
                                            disable={RelativesID.disable}
                                            onFinish={(item) => this.onChooseRelative(item?.ID ? item : null)}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* nhập tên Phụ thuộc - DependantName */}
                            {DependantName.visibleConfig && DependantName.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={DependantName.label}
                                        />

                                        {/* valid ProfileID */}
                                        {fieldValid.DependantName && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={DependantName.disable}
                                            refresh={DependantName.refresh}
                                            value={DependantName.value}
                                            onChangeText={(text) =>
                                                this.setState({
                                                    DependantName: {
                                                        ...DependantName,
                                                        value: text
                                                    }
                                                })
                                            }
                                            onBlur={() => {
                                                if (isUpperCaseText?.DependantName) {
                                                    this.handleUpperCase('DependantName', DependantName.value)
                                                        .then((res) => {
                                                            this.setState({
                                                                DependantName: {
                                                                    ...DependantName,
                                                                    value: res
                                                                }
                                                            });
                                                        })
                                                        .catch((error) => {
                                                            DrawerServices.navigate('ErrorScreen', {
                                                                ErrorDisplay: error
                                                            });
                                                        });
                                                }
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Mã số thuế NPT - CodeTax */}
                            {CodeTax.visibleConfig && CodeTax.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={CodeTax.label} />

                                        {/* valid ProfileID */}
                                        {fieldValid.CodeTax && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            keyboardType={'numeric'}
                                            charType={'int'}
                                            // nhan.nguyen: 0177970: 177074 Modify số ký tự tối đa cho phép nhập trên APP
                                            // maxLength={10}
                                            disable={CodeTax.disable}
                                            refresh={CodeTax.refresh}
                                            value={CodeTax.value}
                                            onChangeText={(text) =>
                                                this.setState({
                                                    CodeTax: {
                                                        ...CodeTax,
                                                        value:
                                                            typeof text === 'string' && text.length === 0 ? null : text,
                                                        refresh: !CodeTax.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Mã số thuế NPT (cũ) - CodeTaxOld */}
                            {CodeTaxOld.visibleConfig && CodeTaxOld.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={CodeTaxOld.label} />

                                        {/* valid ProfileID */}
                                        {fieldValid.CodeTaxOld && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            keyboardType={'numeric'}
                                            charType={'int'}
                                            // nhan.nguyen: 0177970: 177074 Modify số ký tự tối đa cho phép nhập trên APP
                                            // maxLength={10}
                                            disable={CodeTaxOld.disable}
                                            refresh={CodeTaxOld.refresh}
                                            value={CodeTaxOld.value}
                                            onChangeText={(text) =>
                                                this.setState({
                                                    CodeTaxOld: {
                                                        ...CodeTaxOld,
                                                        value:
                                                            typeof text === 'string' && text.length === 0 ? null : text,
                                                        refresh: !CodeTaxOld.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Loại Phụ thuộc - RelationID */}
                            {RelationID.visibleConfig && RelationID.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={RelationID.label} />

                                        {/* valid RelationID */}
                                        {fieldValid.RelationID && (
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
                                            value={RelationID.value}
                                            refresh={RelationID.refresh}
                                            textField="RelativeTypeName"
                                            valueField="ID"
                                            filter={true}
                                            filterServer={true}
                                            filterParams="text"
                                            disable={RelationID.disable}
                                            onFinish={(item) => this.onChangeRelative(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Ngày kết hôn - DateOfWedding - task: 0164813 - 169803*/}
                            {DateOfWedding.visibleConfig && DateOfWedding.visible && (
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
                                            onFinish={(value) =>
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

                            {/* Năm sinh - DateOfBirth */}
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
                                            onFinish={(value) =>
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

                                    {IsLost.value === true && (
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
                                                    onFinish={(value) =>
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
                                            key={Vnr_Function.MakeId(5)}
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
                                            onFinish={(item) =>
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

                            {/* Địa chỉ thường trú - PAddress */}
                            {PAddress.visibleConfig && PAddress.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PAddress.label} />

                                        {/* valid ProfileID */}
                                        {fieldValid.PAddress && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={PAddress.disable}
                                            refresh={PAddress.refresh}
                                            value={PAddress.value}
                                            onChangeText={(text) =>
                                                this.setState({
                                                    PAddress: {
                                                        ...PAddress,
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Địa chỉ tạm trú - TAddress */}
                            {TAddress.visibleConfig && TAddress.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={TAddress.label} />

                                        {/* valid ProfileID */}
                                        {fieldValid.TAddress && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={TAddress.disable}
                                            refresh={TAddress.refresh}
                                            value={TAddress.value}
                                            onChangeText={(text) =>
                                                this.setState({
                                                    TAddress: {
                                                        ...TAddress,
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Địa chỉ người phụ thuộc - DependentsAddress */}
                            {DependentsAddress.visibleConfig && DependentsAddress.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={DependentsAddress.label}
                                        />

                                        {/* valid ProfileID */}
                                        {fieldValid.DependentsAddress && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={DependentsAddress.disable}
                                            refresh={DependentsAddress.refresh}
                                            value={DependentsAddress.value}
                                            onChangeText={(text) =>
                                                this.setState({
                                                    DependentsAddress: {
                                                        ...DependentsAddress,
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Quốc tịch - Nationality */}
                            {NationalityID.visibleConfig && NationalityID.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={NationalityID.label}
                                        />

                                        {/* valid Nationality */}
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
                                            onFinish={(item) => {
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

                            {/* Hồ sơ yêu cầu - ReqDocumnetIDs */}
                            {ReqDocumnetIDs.visibleConfig && ReqDocumnetIDs.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={ReqDocumnetIDs.label}
                                        />

                                        {/* valid Nationality */}
                                        {fieldValid.ReqDocumnetIDs && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            autoBind={true}
                                            api={{
                                                urlApi: '[URI_HR]/Cat_GetData/GetMultiReqDocumentRelative',
                                                type: 'E_GET'
                                            }}
                                            value={ReqDocumnetIDs.value}
                                            refresh={ReqDocumnetIDs.refresh}
                                            textField="ReqDocumentName"
                                            valueField="Code"
                                            filter={true}
                                            filterServer={false}
                                            filterParams="ReqDocumentName"
                                            disable={ReqDocumnetIDs.disable}
                                            onFinish={(item) => {
                                                this.setState({
                                                    ReqDocumnetIDs: {
                                                        ...ReqDocumnetIDs,
                                                        value: item,
                                                        refresh: !ReqDocumnetIDs.refresh
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Niên khóa năm học - SchoolYear */}
                            {SchoolYear.visibleConfig && SchoolYear.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={SchoolYear.label} />

                                        {fieldValid.SchoolYear && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={SchoolYear.value}
                                            refresh={SchoolYear.refresh}
                                            type={'date'}
                                            onFinish={(value) =>
                                                this.setState({
                                                    SchoolYear: {
                                                        ...SchoolYear,
                                                        value,
                                                        refresh: !SchoolYear.refresh
                                                    }
                                                })
                                            }
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
                                            onChangeText={(text) =>
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
                                            onChangeText={(text) =>
                                                this.setState({
                                                    Career: {
                                                        ...Career,
                                                        value: text
                                                    }
                                                })
                                            }
                                            onBlur={() => {
                                                if (isUpperCaseText?.Career) {
                                                    this.handleUpperCase('Career', Career.value)
                                                        .then((res) => {
                                                            this.setState({
                                                                Career: {
                                                                    ...Career,
                                                                    value: res
                                                                }
                                                            });
                                                        })
                                                        .catch((error) => {
                                                            DrawerServices.navigate('ErrorScreen', {
                                                                ErrorDisplay: error
                                                            });
                                                        });
                                                }
                                            }}
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
                                            dataLocal={BirthCertificate.data}
                                            value={BirthCertificate.value}
                                            refresh={BirthCertificate.refresh}
                                            textField="Text"
                                            valueField="Value"
                                            filter={true}
                                            filterServer={false}
                                            onFinish={(items) =>
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
                                            onFinish={(file) => {
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

                            {/* Ghi chú - Note*/}
                            {Note.visible && Note.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Note.label} />

                                        {/* valid Comment */}
                                        {fieldValid.Note && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={Note.disable}
                                            refresh={Note.refresh}
                                            value={Note.value}
                                            onChangeText={(text) =>
                                                this.setState({
                                                    Note: {
                                                        ...Note,
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* là người phụ thuộc làm chung công ty - IsRegisterAtCompany, */}
                        {IsRegisterAtCompany.visibleConfig && IsRegisterAtCompany.visible && (
                            <View>
                                {!fieldHiden?.isLableDependant && (
                                    <View style={styleViewTitleGroupRow}>
                                        <VnrText style={[styleSheets.text, textLableGroup]} i18nKey={'HR_Dependant'} />
                                    </View>
                                )}

                                {/* người thân là người phụ thuộc */}
                                {!fieldHiden?.IsRegisterAtCompany && (
                                    <View style={contentViewControl}>
                                        <TouchableOpacity
                                            style={styBtnCheckBox}
                                            onPress={() => this.onChangeCheckBox('IsRegisterAtCompany')}
                                        >
                                            <CheckBox
                                                checkBoxColor={Colors.black}
                                                checkedCheckBoxColor={Colors.primary}
                                                isChecked={IsRegisterAtCompany.value}
                                                disable={IsRegisterAtCompany.disable}
                                                onClick={() => this.onChangeCheckBox('IsRegisterAtCompany')}
                                            />
                                            <VnrText
                                                style={[styleSheets.text, styBtnCheckBoxText]}
                                                i18nKey={IsRegisterAtCompany.label}
                                            />
                                            {fieldValid.IsRegisterAtCompany && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {/* Ngày đăng ký người phụ thuộc - RegisterDate */}
                                {RegisterDate.visibleConfig && RegisterDate.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={RegisterDate.label}
                                            />

                                            {fieldValid.RegisterDate && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                format={'DD/MM/YYYY'}
                                                value={RegisterDate.value}
                                                refresh={RegisterDate.refresh}
                                                type={'date'}
                                                response={'string'}
                                                onFinish={(value) => {
                                                    this.setState({
                                                        RegisterDate: {
                                                            ...RegisterDate,
                                                            value: moment(value),
                                                            refresh: !RegisterDate.refresh
                                                        }
                                                    });
                                                }}
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Tháng áp dụng - MonthOfEffect */}
                                {!fieldHiden?.MonthOfEffect && (
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
                                                format={'DD/MM/YYYY'}
                                                value={MonthOfEffect.value}
                                                refresh={MonthOfEffect.refresh}
                                                type={'date'}
                                                response={'string'}
                                                onFinish={(value) => this.onChangeMonthOfEffect(value)}
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Tháng kết thúc - MonthOfExpiry */}
                                {!fieldHiden?.MonthOfExpiry && (
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
                                                format={'DD/MM/YYYY'}
                                                value={MonthOfExpiry.value}
                                                refresh={MonthOfExpiry.refresh}
                                                type={'date'}
                                                response={'string'}
                                                onFinish={(value) => this.onChangeMonthOfExpiry(value)}
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ngày hoàn tất HS - CompleteDate */}
                                {!fieldHiden?.CompleteDate && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={CompleteDate.label}
                                            />

                                            {fieldValid.CompleteDate && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                format={'DD/MM/YYYY'}
                                                value={CompleteDate.value}
                                                refresh={CompleteDate.refresh}
                                                type={'date'}
                                                response={'string'}
                                                onFinish={(value) => this.onChangeCompleteDate(value)}
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
                                                onFinish={(item) => this.onFinishCountry(item)}
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
                                                onFinish={(item) => this.onFinishProvince(item)}
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
                                                onFinish={(item) => this.onFinishDistrict(item)}
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
                                                onFinish={(item) => this.onFinishVillage(item)}
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
                                                onChangeText={(text) =>
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

                        {/* #region [thông tin bổ sung - CMND, CCCD, hộ chiếu, khai sinh, hộ khẩu] */}
                        <View>
                            {/* Thông tin địa chỉ */}
                            {AddressInformation.visible && AddressInformation.visibleConfig && (
                                <TouchableOpacity
                                    onPress={() =>
                                        DrawerServices.navigate('DependantOtherAddress', {
                                            AddressInformation: {
                                                ...AddressInformation
                                            },
                                            fieldValid,
                                            fieldHiden,
                                            onFinish: this.handleAddressInformation
                                        })
                                    }
                                    style={styles.btnOtherInfo}
                                >
                                    <View style={styles.iconNext}>
                                        <IconNext size={Size.iconSize} color={'#fff'} />
                                    </View>
                                    <VnrText
                                        style={[styleSheets.lable, styleButtonAddOrEdit.groupButton__text, styles.text]}
                                        i18nKey={'HRM_Hre_Dependant_AddressInformation'}
                                    />

                                    <View style={styles.iconNext}>
                                        <IconNext size={Size.iconSize} color={Colors.primary} />
                                    </View>
                                </TouchableOpacity>
                            )}

                            {/* khai sinh */}
                            {BirthCertificateGroup.visible && BirthCertificateGroup.visibleConfig && (
                                <TouchableOpacity
                                    onPress={() =>
                                        DrawerServices.navigate('DenpendantOtherBirthCertificate', {
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
                                        i18nKey={'HRM_OnlyApp_Certificat_De_Naissance_For_Dependant'}
                                    />

                                    <View style={styles.iconNext}>
                                        <IconNext size={Size.iconSize} color={Colors.primary} />
                                    </View>
                                </TouchableOpacity>
                            )}

                            {/* CMND/CCCD/hộ chiếu */}
                            {((IdentificationGroup.visibleConfig && IdentificationGroup.visible) ||
                                (DepentantsPassportGroup.visibleConfig && DepentantsPassportGroup.visible) ||
                                (IDNoInfoGroup.visibleConfig && IDNoInfoGroup.visible)) && (
                                <TouchableOpacity
                                    onPress={() =>
                                        DrawerServices.navigate('DependantOtherIdentification', {
                                            DepentantsPassport: { ...DepentantsPassportGroup },
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
                                        i18nKey={tranPassport}
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
        marginHorizontal: Size.defineSpace,
        marginVertical: 7,
        paddingHorizontal: Size.defineSpace / 2
    }
});
