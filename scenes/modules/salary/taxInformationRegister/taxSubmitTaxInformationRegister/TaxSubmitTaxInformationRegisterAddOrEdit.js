import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    Size,
    stylesModalPopupBottom,
    styleViewTitleForGroup,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import HttpService from '../../../../../utils/HttpService';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName, EnumIcon, ScreenName } from '../../../../../assets/constant';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { IconColse } from '../../../../../constants/Icons';
import Modal from 'react-native-modal';
import { translate } from '../../../../../i18n/translate';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import { TaxApproveTaxInformationRegisterBusinessFunctionisterList } from '../taxApproveTaxInformationRegister/TaxApproveTaxInformationRegisterBusiness';
import Vnr_Function from '../../../../../utils/Vnr_Function';

let enumName = null,
    profileInfo = null;

// need fix (Overtime)
const initSateDefault = {
    ID: null,
    Status: null,
    Profile: {
        label: 'HRM_Attendance_Leaveday_ProfileID',
        ID: null,
        ProfileName: null,
        disable: true
    },
    // task: 0164850
    Type: {
        label: 'HRM_Payroll_Sal_TaxInformationRegister_strType',
        data: [],
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    DateSubmit: {
        label: 'HRM_Payroll_Sal_TaxInformationRegister_DateSubmit',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    CodeTax: {
        label: 'HRM_Payroll_Sal_TaxInformationRegister_CodeTax',
        disable: false,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    DateOfIssuedTaxCode: {
        label: 'HRM_Payroll_Sal_TaxInformationRegister_DateOfIssuedTaxCode',
        disable: false,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    TaxDepartment: {
        label: 'HRM_Rec_Candidate_TaxDepartment',
        disable: false,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    ProfileName: {
        label: 'eBHXHD02TSTangCol1',
        disable: false,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    DateOfBirth: {
        label: 'eBHXHD02TSTangCol3',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    Gender: {
        label: 'HRM_HR_Profile_Gender',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    NationalityID: {
        label: 'HRM_HR_Profile_NationalityID',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    PhoneNumber: {
        label: 'HRM_Insurance_InsuranceInfo_PhoneNumber',
        disable: false,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    Email: {
        label: 'HRM_Payroll_Sal_TaxInformationRegister_Email',
        disable: false,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    CompanyEmail: {
        label: 'HRM_Payroll_Sal_TaxInformationRegister_CompanyEmail',
        disable: false,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    CompanyID: {
        label: 'HRM_Payroll_Sal_TaxInformationRegister_strCompanyIDs',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    FileAttach: {
        label: 'HRM_Hre_ProfileMoreInfo_AttachFile',
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },
    Note: {
        label: 'HRM_Attendance_RegisterVehicle_Note',
        disable: false,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    // CMND (EN: ID Card)
    IDNo: {
        label: 'eBHXHD02TSGiamCol74',
        disable: true,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    IDDateOfIssue: {
        label: 'HRM_HR_Profile_IDDateOfIssue2',
        value: null,
        refresh: false,
        disable: true,
        visibleConfig: true,
        visible: true
    },
    IDPlaceOfIssue: {
        label: 'Rec_CandidateProfile_PlaceOfIssueNewID',
        disable: true,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    // Thẻ CCCD (EN: Identification)
    IDCard: {
        label: 'HRM_Payroll_Sal_TaxInformationRegister_IDCard',
        disable: true,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    IDCardDateOfIssue: {
        label: 'HRM_Payroll_Sal_TaxInformationRegister_IDCardDateOfIssue',
        value: null,
        refresh: false,
        disable: true,
        visibleConfig: true,
        visible: true
    },
    IDCardPlaceOfIssue: {
        label: 'HRM_Payroll_Sal_TaxInformationRegister_IDCardPlaceOfIssue',
        disable: true,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    // Hộ chiếu (EN: Passport)
    PassportNo: {
        label: 'iBHXHD02TSGiamCol131',
        disable: true,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    PassportDateOfIssue: {
        label: 'ProfilePassportDateOfIssue',
        value: null,
        refresh: false,
        disable: true,
        visibleConfig: true,
        visible: true
    },
    PassportPlaceOfIssue: {
        label: 'ProfilePassportPlaceOfIssue',
        disable: true,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    // Địa chỉ thường trú (EN: Permanent Address)
    SearchPermanentAddress: {
        label: 'HRM_Insurance_ChangeInsInfoRegister_tempPAddress',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    PCountryID: {
        label: 'HRM_Hre_Relatives_CountryPermanent',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    PProvinceID: {
        label: 'HRM_Insurance_InsuranceInfo_PProvinceID',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    PDistrictID: {
        label: 'HRM_Insurance_InsuranceInfo_PDistrictID',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    PVillageID: {
        label: 'HRM_Insurance_InsuranceInfo_PVillageID',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    PAddress: {
        label: 'HRM_Hre_Relatives_AddressPermanent',
        disable: false,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    // Địa chỉ tạm trú (EN: Temporary Address)
    SearchTemporaryAddress: {
        label: 'HRM_Payroll_Sal_TaxInformationRegister_TFindAddress',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    TCountryID: {
        label: 'HRM_Hre_Relatives_CountryTemporary',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    TProvinceID: {
        label: 'HRM_Payroll_Sal_TaxInformationRegister_TProvinceID',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    TDistrictID: {
        label: 'HRM_Payroll_Sal_TaxInformationRegister_TDistrictID',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    TVillageID: {
        label: 'HRM_Payroll_Sal_TaxInformationRegister_TVillageID',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    TAddress: {
        label: 'HRM_Hre_Relatives_AddressTemporary',
        disable: false,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },

    modalErrorDetail: {
        isModalVisible: false,
        cacheID: null,
        data: []
    },
    fieldValid: {
        Type: true,
        ProfileName: true,
        DateOfBirth: true,
        Gender: true,
        NationalityID: true,
        CompanyID: true,
        FileAttach: true,
        PProvinceID: true,
        PDistrictID: true,
        PVillageID: true,
        PAddress: true,
        TProvinceID: true,
        TDistrictID: true,
        TVillageID: true,
        TAddress: true
    },

    dataOld: null
};

export default class TaxSubmitTaxInformationRegisterAddOrEdit extends Component {
    constructor(props) {
        super(props);

        this.state = initSateDefault;

        // need fix
        // props.navigation.setParams({
        //   title: (props.navigation.state.params && props.navigation.state.params.record)
        //     ? 'HRM_Payroll_Sal_TaxInformationRegister_Update_Title' : 'HRM_Payroll_Sal_TaxInformationRegister_Create_Title'
        // });

        this.setVariable();
    }
    //#region [khởi tạo - lấy các dữ liệu cho control, lấy giá trị mặc đinh]
    setVariable = () => {
        //biến trạng thái
        this.isModify = false;
        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;

        this.isChangeLevelApprove = null;
        this.levelApproveLateEarlyAllowed = null;

        // show detail error
        this.IsContinueSave = false;
        this.ProfileRemoveIDs = null;
        this.IsRemoveAndContinue = null;
        this.CacheID = null;
    };

    refreshView = () => {
        this.setVariable();

        const { FileAttach } = this.state;
        let resetState = {
            ...initSateDefault,
            FileAttach: {
                ...initSateDefault.FileAttach,
                refresh: !FileAttach.refresh
            }
        };
        this.setState(resetState, () => this.getConfigValid('Sal_TaxInformationRegister', true));
    };

    //promise get config valid
    getConfigValid = (tblName, isRefresh) => {
        VnrLoadingSevices.show();
        HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName).then((res) => {
            VnrLoadingSevices.hide();
            if (res) {
                try {
                    //map field hidden by config
                    const _configField =
                            ConfigField && ConfigField.value['TaxSubmitTaxInformationRegisterAddOrEdit']
                                ? ConfigField.value['TaxSubmitTaxInformationRegisterAddOrEdit']['Hidden']
                                : [],
                        { fieldValid } = this.state;

                    let nextState = { fieldValid: { ...fieldValid, ...res } };

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
                    });

                    this.setState({ ...nextState }, () => {
                        enumName = EnumName;
                        profileInfo = dataVnrStorage
                            ? dataVnrStorage.currentUser
                                ? dataVnrStorage.currentUser.info
                                : null
                            : null;

                        let { record } = !isRefresh ? this.props.navigation.state.params : {};

                        //get config khi đăng ký
                        if (!record) {
                            this.initData();
                        } else {
                            this.isModify = true;
                            this.getRecordAndConfigByID(record, this.handleSetState);
                        }
                    });
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            }
        });
    };

    componentDidMount() {
        //get config validate
        this.getConfigValid('Sal_TaxInformationRegister');
    }

    CheckUserRegisterTaxInformationForApp = (_profile) => {
        const { Type } = this.state;
        let nextState = {},
            typeTemp = null;

        const { resAll } = this.props.navigation.state.params;

        if (resAll && Array.isArray(resAll) && resAll.length > 0) {
            if (resAll[0]) {
                if (resAll[0].Data === true) {
                    typeTemp = 'E_AdditionalAdjustments';
                    this.props.navigation.setParams({
                        title: 'HRM_Payroll_Sal_TaxInformationRegisterAdditionalAdjustments_Create_Title'
                    });
                } else {
                    typeTemp = 'E_NewRegistration';
                    this.props.navigation.setParams({
                        title: 'HRM_Payroll_Sal_TaxInformationRegister_Create_Title'
                    });
                }

                if (resAll[1] && Array.isArray(resAll[1]) && resAll[1].length > 0) {
                    resAll[1].find((e) => {
                        if (e.Value && e.Value === typeTemp) {
                            nextState = {
                                Type: {
                                    ...Type,
                                    value: e,
                                    refresh: !Type.refresh
                                }
                            };
                        }
                    });
                }

                this.setState(nextState, () => {
                    this.handleLoadDataDefault(_profile);
                });
            } else {
                ToasterSevice.showError('HRM_Message_GetDataServices_Error');
            }
        } else {
            ToasterSevice.showError('HRM_Message_GetDataServices_Error');
        }
    };

    initData = () => {
        const { E_ProfileID, E_FullName } = enumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] },
            { Profile } = this.state;

        let nextState = {
            Profile: {
                ...Profile,
                ..._profile
            }
        };
        nextState = {
            ...nextState
        };

        this.setState(nextState, () => {
            this.CheckUserRegisterTaxInformationForApp(_profile);
        });
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        let arrRequest = [
            HttpService.Post('[URI_HR]/Cat_GetData/GetDistrictCascading', {
                province: record.PProvinceID ? record.PProvinceID : null
            }),
            HttpService.Post('[URI_HR]/Cat_GetData/GetDistrictCascading', {
                province: record.TProvinceID ? record.TProvinceID : null
            }),
            HttpService.Post('[URI_HR]/Cat_GetData/GetVillageCascading', {
                districtid: record.PDistrictID ? record.PDistrictID : null
            }),
            HttpService.Post('[URI_HR]/Cat_GetData/GetVillageCascading', {
                districtid: record.TDistrictID ? record.TDistrictID : null
            })
        ];

        VnrLoadingSevices.show();
        HttpService.MultiRequest(arrRequest).then((resAll) => {
            VnrLoadingSevices.hide();
            try {
                _handleSetState(record, resAll);
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    handleSetState = (record, resAll) => {
        if (record) {
            if (record.Type) {
                if (record.Type === 'E_NewRegistration') {
                    this.props.navigation.setParams({ title: 'HRM_Payroll_Sal_TaxInformationRegister_Update_Title' });
                } else if (record.Type === 'E_AdditionalAdjustments') {
                    this.props.navigation.setParams({
                        title: 'HRM_Payroll_Sal_TaxInformationRegisterAdditionalAdjustments_Update_Title'
                    });
                }

                const {
                    Profile,
                    Type,
                    DateSubmit,
                    CodeTax,
                    DateOfIssuedTaxCode,
                    TaxDepartment,
                    ProfileName,
                    DateOfBirth,
                    Gender,
                    NationalityID,
                    PhoneNumber,
                    Email,
                    CompanyEmail,
                    CompanyID,
                    FileAttach,
                    Note,
                    IDNo,
                    IDDateOfIssue,
                    IDPlaceOfIssue,
                    IDCard,
                    IDCardDateOfIssue,
                    IDCardPlaceOfIssue,
                    PassportNo,
                    PassportDateOfIssue,
                    PassportPlaceOfIssue,
                    PCountryID,
                    PProvinceID,
                    PDistrictID,
                    PVillageID,
                    PAddress,
                    TCountryID,
                    TProvinceID,
                    TDistrictID,
                    TVillageID,
                    TAddress
                } = this.state;
                let nextState = {};

                nextState = {
                    ...nextState,
                    dataOld: record,
                    ID: record.ID,
                    Status: record.Status,
                    Profile: {
                        ...Profile,
                        ID: record.ProfileID,
                        ProfileName: record.ProfileName
                    },
                    Type: {
                        ...Type,
                        value: { Value: record.Type, Text: record.TypeView },
                        refresh: !Type.refresh
                    },
                    CodeTax: {
                        ...CodeTax,
                        value: record.CodeTax ? record.CodeTax : null,
                        refresh: !CodeTax.refresh
                    },
                    DateSubmit: {
                        ...DateSubmit,
                        value: moment(new Date()),
                        refresh: !DateSubmit.refresh
                    },
                    DateOfIssuedTaxCode: {
                        ...DateOfIssuedTaxCode,
                        value: record.DateOfIssuedTaxCode
                            ? moment(record.DateOfIssuedTaxCode).format('DD/MM/YYYY')
                            : null,
                        refresh: !DateOfIssuedTaxCode.refresh
                    },
                    TaxDepartment: {
                        ...TaxDepartment,
                        value: record.TaxDepartment ? record.TaxDepartment : null,
                        refresh: !TaxDepartment.refresh
                    },
                    ProfileName: {
                        ...ProfileName,
                        value: record.ProfileName ? record.ProfileName : null,
                        refresh: !ProfileName.refresh
                    },
                    DateOfBirth: {
                        ...DateOfBirth,
                        value: record.DateOfBirth ? moment(record.DateOfBirth) : null,
                        refresh: !DateOfBirth.refresh
                    },
                    Gender: {
                        ...Gender,
                        value: record.Gender ? { Text: record.GenderView, Value: record.Gender } : null,
                        refresh: !Gender.refresh
                    },
                    NationalityID: {
                        ...NationalityID,
                        value: record.NationalityID
                            ? {
                                ID: record.NationalityID,
                                CountryName: record.NationalityName ? record.NationalityName : null
                            }
                            : null,
                        disable: false,
                        refresh: !NationalityID.refresh
                    },
                    PhoneNumber: {
                        ...PhoneNumber,
                        value: record.PhoneNumber ? record.PhoneNumber : null,
                        refresh: !PhoneNumber.refresh
                    },
                    Email: {
                        ...Email,
                        value: record.Email ? record.Email : null,
                        refresh: !Email.refresh
                    },
                    CompanyEmail: {
                        ...CompanyEmail,
                        value: record.CompanyEmail ? record.CompanyEmail : null,
                        refresh: !CompanyEmail.refresh
                    },
                    CompanyID: {
                        ...CompanyID,
                        value: record.CompanyID
                            ? { ID: record.CompanyID, CompanyName: record.CompanyName ? record.CompanyName : null }
                            : null,
                        refresh: !CompanyID.refresh
                    },

                    // CMND
                    IDNo: {
                        ...IDNo,
                        value: record.IDNo ? record.IDNo : null,
                        refresh: !IDNo.refresh
                    },
                    IDDateOfIssue: {
                        ...IDDateOfIssue,
                        value: record.IDDateOfIssue ? moment(record.IDDateOfIssue) : null,
                        refresh: !IDDateOfIssue.refresh
                    },
                    IDPlaceOfIssue: {
                        ...IDPlaceOfIssue,
                        value: record.IDPlaceOfIssue ? record.IDPlaceOfIssue : null,
                        refresh: !IDPlaceOfIssue.refresh
                    },

                    // CCCD
                    IDCard: {
                        ...IDCard,
                        value: record.IDCard ? record.IDCard : null,
                        refresh: !IDCard.refresh
                    },
                    IDCardDateOfIssue: {
                        ...IDCardDateOfIssue,
                        value: record.IDCardDateOfIssue ? moment(record.IDCardDateOfIssue) : null,
                        refresh: !IDCardDateOfIssue.refresh
                    },
                    IDCardPlaceOfIssue: {
                        ...IDCardPlaceOfIssue,
                        value: record.IDCardPlaceOfIssue ? record.IDCardPlaceOfIssue : null,
                        refresh: !IDCardPlaceOfIssue.refresh
                    },

                    // Hộ chiếu
                    PassportNo: {
                        ...PassportNo,
                        value: record.PassportNo ? record.PassportNo : null,
                        refresh: !PassportNo.refresh
                    },
                    PassportDateOfIssue: {
                        ...PassportDateOfIssue,
                        value: record.PassportDateOfIssue ? moment(record.PassportDateOfIssue) : null,
                        refresh: !PassportDateOfIssue.refresh
                    },
                    PassportPlaceOfIssue: {
                        ...PassportPlaceOfIssue,
                        value: record.PassportPlaceOfIssue ? record.PassportPlaceOfIssue : null,
                        refresh: !PassportPlaceOfIssue.refresh
                    },

                    // Địa chỉ thường trú
                    PCountryID: {
                        ...PCountryID,
                        value: record.PCountryID
                            ? { ID: record.PCountryID, CountryName: record.PCountryName ? record.PCountryName : null }
                            : null,
                        refresh: !PCountryID.refresh
                    },
                    PProvinceID: {
                        ...PProvinceID,
                        value: record.PProvinceID
                            ? {
                                ID: record.PProvinceID,
                                ProvinceName: record.PProvinceName ? record.PProvinceName : null
                            }
                            : null,
                        refresh: !PProvinceID.refresh
                    },
                    PDistrictID: {
                        ...PDistrictID,
                        value: record.PDistrictID
                            ? {
                                ID: record.PDistrictID,
                                DistrictName: record.PDistrictName ? record.PDistrictName : null
                            }
                            : null,
                        data: resAll && resAll[0] ? resAll[0] : null,
                        refresh: !PDistrictID.refresh
                    },
                    PVillageID: {
                        ...PVillageID,
                        value: record.PVillageID
                            ? { ID: record.PVillageID, VillageName: record.PVillageName ? record.PVillageName : null }
                            : null,
                        data: resAll && resAll[2] ? resAll[2] : null,
                        refresh: !PVillageID.refresh
                    },
                    PAddress: {
                        ...PAddress,
                        value: record.PAddress ? record.PAddress : null,
                        refresh: !PAddress.refresh
                    },

                    // Địa chỉ tạm trú
                    TCountryID: {
                        ...TCountryID,
                        value: record.TCountryID
                            ? { ID: record.TCountryID, CountryName: record.TCountryName ? record.TCountryName : null }
                            : null,
                        refresh: !TCountryID.refresh
                    },
                    TProvinceID: {
                        ...TProvinceID,
                        value: record.TProvinceID
                            ? {
                                ID: record.TProvinceID,
                                ProvinceName: record.TProvinceName ? record.TProvinceName : null
                            }
                            : null,
                        refresh: !TProvinceID.refresh
                    },
                    TDistrictID: {
                        ...TDistrictID,
                        value: record.TDistrictID
                            ? {
                                ID: record.TDistrictID,
                                DistrictName: record.TDistrictName ? record.TDistrictName : null
                            }
                            : null,
                        data: resAll && resAll[1] ? resAll[1] : null,
                        refresh: !TDistrictID.refresh
                    },
                    TVillageID: {
                        ...TVillageID,
                        value: record.TVillageID
                            ? { ID: record.TVillageID, VillageName: record.TVillageName ? record.TVillageName : null }
                            : null,
                        data: resAll && resAll[3] ? resAll[3] : null,
                        refresh: !TVillageID.refresh
                    },
                    TAddress: {
                        ...TAddress,
                        value: record.TAddress ? record.TAddress : null,
                        refresh: !TAddress.refresh
                    },

                    FileAttach: {
                        ...FileAttach,
                        value: record.lstFileAttach,
                        refresh: !FileAttach.refresh
                    },

                    Note: {
                        ...Note,
                        value: record.Note,
                        refresh: !Note.refresh
                    }
                };

                this.setState(nextState, () => {
                    // if (record) {
                    //   this.getDistrictByProvinceID([record.PProvinceID ? record.PProvinceID : null, record.TProvinceID ? record.TProvinceID : null], true);
                    // }
                    if (record.CompanyName === null || record.CompanyName === undefined) {
                        this.handleGetDataMissing(
                            record.CompanyName === null || record.CompanyName === undefined ? true : false
                        );
                    }
                });
            }
        }
    };
    //#endregion

    handleLoadDataDefault = (_profile) => {
        VnrLoadingSevices.show();
        const {
            Type,
            DateSubmit,
            CodeTax,
            DateOfIssuedTaxCode,
            TaxDepartment,
            ProfileName,
            DateOfBirth,
            Gender,
            NationalityID,
            PhoneNumber,
            Email,
            CompanyEmail,
            CompanyID,
            IDNo,
            IDDateOfIssue,
            IDPlaceOfIssue,
            IDCard,
            IDCardDateOfIssue,
            IDCardPlaceOfIssue,
            PassportNo,
            PassportDateOfIssue,
            PassportPlaceOfIssue,
            PCountryID,
            PProvinceID,
            PDistrictID,
            PVillageID,
            PAddress,
            TCountryID,
            TProvinceID,
            TDistrictID,
            TVillageID,
            TAddress
        } = this.state;

        let URL = '',
            nextState = {};

        if (Type.value && Type.value.Value) {
            // if (Type.value.Value === 'E_NewRegistration') {
            //   URL = '[URI_HR]/Hre_GetData/GetProfileForTaxByID';
            // } else {
            //   URL = '[URI_HR]/Sal_GetData/GetSalTaxInformationByProfileID';
            // }

            URL = '[URI_HR]/Hre_GetData/GetProfileForTaxByID';

            HttpService.Post(URL, {
                profileID: _profile && _profile.ID ? _profile.ID : null
            })
                .then((res) => {
                    VnrLoadingSevices.hide();
                    if (res && Array.isArray(res) && res.length > 0) {
                        nextState = {
                            ...nextState,
                            dataOld: res[0],
                            CodeTax: {
                                ...CodeTax,
                                value: res[0].CodeTax ? res[0].CodeTax : null,
                                refresh: !CodeTax.refresh
                            },
                            DateSubmit: {
                                ...DateSubmit,
                                value: moment(new Date()).format('YYYY-MM-DD 00:00:00'),
                                refresh: !DateSubmit.refresh
                            },
                            DateOfIssuedTaxCode: {
                                ...DateOfIssuedTaxCode,
                                value: res[0].DateOfIssuedTaxCode ? moment(res[0].DateOfIssuedTaxCode) : null,
                                visibleConfig:
                                    Type.value.Value === 'E_AdditionalAdjustments' || !DateOfIssuedTaxCode.visibleConfig
                                        ? false
                                        : true,
                                refresh: !DateOfIssuedTaxCode.refresh
                            },
                            TaxDepartment: {
                                ...TaxDepartment,
                                value: res[0].TaxDepartment ? res[0].TaxDepartment : null,
                                refresh: !TaxDepartment.refresh
                            },
                            ProfileName: {
                                ...ProfileName,
                                value: res[0].ProfileName ? res[0].ProfileName : null,
                                refresh: !ProfileName.refresh
                            },
                            DateOfBirth: {
                                ...DateOfBirth,
                                value: res[0].DateOfBirth ? moment(res[0].DateOfBirth) : null,
                                refresh: !DateOfBirth.refresh
                            },
                            Gender: {
                                ...Gender,
                                value: res[0].Gender ? { Text: res[0].GenderView, Value: res[0].Gender } : null,
                                refresh: !Gender.refresh
                            },
                            NationalityID: {
                                ...NationalityID,
                                value: res[0].NationalityID
                                    ? {
                                        ID: res[0].NationalityID,
                                        CountryName: res[0].NationalityName ? res[0].NationalityName : null
                                    }
                                    : null,
                                disable: false,
                                refresh: !NationalityID.refresh
                            },
                            PhoneNumber: {
                                ...PhoneNumber,
                                value: res[0].Cellphone ? res[0].Cellphone : null,
                                refresh: !PhoneNumber.refresh
                            },
                            Email: {
                                ...Email,
                                value: res[0].Email ? res[0].Email : null,
                                refresh: !Email.refresh
                            },
                            CompanyEmail: {
                                ...CompanyEmail,
                                value: res[0].CompanyEmail ? res[0].CompanyEmail : null,
                                refresh: !CompanyEmail.refresh
                            },
                            CompanyID: {
                                ...CompanyID,
                                value: res[0].CompanyID
                                    ? {
                                        ID: res[0].CompanyID,
                                        CompanyName: res[0].CompanyName ? res[0].CompanyName : null
                                    }
                                    : null,
                                refresh: !CompanyID.refresh
                            },

                            // CMND
                            IDNo: {
                                ...IDNo,
                                value: res[0].IDNo ? res[0].IDNo : null,
                                refresh: !IDNo.refresh
                            },
                            IDDateOfIssue: {
                                ...IDDateOfIssue,
                                value: res[0].IDDateOfIssue ? moment(res[0].IDDateOfIssue) : null,
                                refresh: !IDDateOfIssue.refresh
                            },
                            IDPlaceOfIssue: {
                                ...IDPlaceOfIssue,
                                value: res[0].IDPlaceOfIssue ? res[0].IDPlaceOfIssue : null,
                                refresh: !IDPlaceOfIssue.refresh
                            },

                            // CCCD
                            IDCard: {
                                ...IDCard,
                                value: res[0].IDCard ? res[0].IDCard : null,
                                refresh: !IDCard.refresh
                            },
                            IDCardDateOfIssue: {
                                ...IDCardDateOfIssue,
                                value: res[0].IDCardDateOfIssue ? moment(res[0].IDCardDateOfIssue) : null,
                                refresh: !IDCardDateOfIssue.refresh
                            },
                            IDCardPlaceOfIssue: {
                                ...IDCardPlaceOfIssue,
                                value: res[0].IDCardPlaceOfIssue ? res[0].IDCardPlaceOfIssue : null,
                                refresh: !IDCardPlaceOfIssue.refresh
                            },

                            // Hộ chiếu
                            PassportNo: {
                                ...PassportNo,
                                value: res[0].PassportNo ? res[0].PassportNo : null,
                                refresh: !PassportNo.refresh
                            },
                            PassportDateOfIssue: {
                                ...PassportDateOfIssue,
                                value: res[0].PassportDateOfIssue ? moment(res[0].PassportDateOfIssue) : null,
                                refresh: !PassportDateOfIssue.refresh
                            },
                            PassportPlaceOfIssue: {
                                ...PassportPlaceOfIssue,
                                value: res[0].PassportPlaceOfIssue ? res[0].PassportPlaceOfIssue : null,
                                refresh: !PassportPlaceOfIssue.refresh
                            },

                            // Địa chỉ thường trú
                            PCountryID: {
                                ...PCountryID,
                                value: res[0].PCountryID
                                    ? {
                                        ID: res[0].PCountryID,
                                        CountryName: res[0].PCountryName ? res[0].PCountryName : null
                                    }
                                    : null,
                                visibleConfig: Type.value.Value === 'E_AdditionalAdjustments' ? false : true,
                                refresh: !PCountryID.refresh
                            },
                            PProvinceID: {
                                ...PProvinceID,
                                value: res[0].PProvinceID
                                    ? {
                                        ID: res[0].PProvinceID,
                                        ProvinceName: res[0].PProvinceName ? res[0].PProvinceName : null
                                    }
                                    : null,
                                refresh: !PProvinceID.refresh
                            },
                            PDistrictID: {
                                ...PDistrictID,
                                value: res[0].PDistrictID
                                    ? {
                                        ID: res[0].PDistrictID,
                                        DistrictName: res[0].PDistrictName ? res[0].PDistrictName : null
                                    }
                                    : null,
                                refresh: !PDistrictID.refresh
                            },
                            PVillageID: {
                                ...PVillageID,
                                value: res[0].PVillageID
                                    ? {
                                        ID: res[0].PVillageID,
                                        VillageName: res[0].PVillageName ? res[0].PVillageName : null
                                    }
                                    : null,
                                refresh: !PVillageID.refresh
                            },
                            PAddress: {
                                ...PAddress,
                                value: res[0].PAddress ? res[0].PAddress : null,
                                refresh: !PAddress.refresh
                            },

                            // Địa chỉ tạm trú
                            TCountryID: {
                                ...TCountryID,
                                value: res[0].TCountryID
                                    ? {
                                        ID: res[0].TCountryID,
                                        CountryName: res[0].TCountryName ? res[0].TCountryName : null
                                    }
                                    : null,
                                visibleConfig: Type.value.Value === 'E_AdditionalAdjustments' ? false : true,
                                refresh: !TCountryID.refresh
                            },
                            TProvinceID: {
                                ...TProvinceID,
                                value: res[0].TProvinceID
                                    ? {
                                        ID: res[0].TProvinceID,
                                        ProvinceName: res[0].TProvinceName ? res[0].TProvinceName : null
                                    }
                                    : null,
                                refresh: !TProvinceID.refresh
                            },
                            TDistrictID: {
                                ...TDistrictID,
                                value: res[0].TDistrictID
                                    ? {
                                        ID: res[0].TDistrictID,
                                        DistrictName: res[0].TDistrictName ? res[0].TDistrictName : null
                                    }
                                    : null,
                                refresh: !TDistrictID.refresh
                            },
                            TVillageID: {
                                ...TVillageID,
                                value: res[0].TVillageID
                                    ? {
                                        ID: res[0].TVillageID,
                                        VillageName: res[0].TVillageName ? res[0].TVillageName : null
                                    }
                                    : null,
                                refresh: !TVillageID.refresh
                            },
                            TAddress: {
                                ...TAddress,
                                value: res[0].TAddress ? res[0].TAddress : null,
                                refresh: !TAddress.refresh
                            }
                        };
                    }
                    this.setState(nextState, () => {
                        if (res[0]) {
                            this.getDistrictByProvinceID(
                                [
                                    res[0].PProvinceID ? res[0].PProvinceID : null,
                                    res[0].TProvinceID ? res[0].TProvinceID : null
                                ],
                                true
                            );
                        }

                        if (res[0].CompanyName === null || res[0].CompanyName === undefined) {
                            this.handleGetDataMissing(
                                res[0].CompanyName === null || res[0].CompanyName === undefined ? true : false
                            );
                        }
                    });
                })
                .catch(() => {
                    ToasterSevice.showWarning('HRM_Common_SendRequest_Error');
                });
        }
    };

    getDistrictByProvinceID = (ProvinceID, IsContinue) => {
        VnrLoadingSevices.show();
        HttpService.MultiRequest([
            HttpService.Post('[URI_HR]/Cat_GetData/GetDistrictCascading', {
                province: ProvinceID[0] ? ProvinceID[0] : null
            }),
            HttpService.Post('[URI_HR]/Cat_GetData/GetDistrictCascading', {
                province: ProvinceID[1] ? ProvinceID[1] : null
            })
        ])
            .then((res) => {
                VnrLoadingSevices.hide();
                if (res && Array.isArray(res) && res.length > 1) {
                    const [resPDistrict, resTDistrict] = res,
                        { PDistrictID, TDistrictID } = this.state;
                    let nextState = {};

                    if (resPDistrict && Array.isArray(resPDistrict) && resPDistrict.length > 0) {
                        nextState = {
                            ...nextState,
                            PDistrictID: {
                                ...PDistrictID,
                                data: resPDistrict,
                                disable: false,
                                refresh: !PDistrictID.refresh
                            }
                        };
                    }

                    if (resTDistrict && Array.isArray(resTDistrict) && resTDistrict.length > 0) {
                        nextState = {
                            ...nextState,
                            TDistrictID: {
                                ...TDistrictID,
                                data: resTDistrict,
                                disable: false,
                                refresh: !TDistrictID.refresh
                            }
                        };
                    }

                    if (IsContinue) {
                        this.getVillageByDistrictID(nextState);
                    } else {
                        this.setState(nextState);
                    }
                }
            })
            .catch(() => {
                ToasterSevice.showWarning('HRM_Common_SendRequest_Error');
            });
    };

    // nếu không truyền vào DistrictID (là 1 mảng) thì mặc định lấy từ state
    getVillageByDistrictID = (
        nextState = {},
        DistrictID = [
            this.state.PDistrictID.value && this.state.PDistrictID.value.ID ? this.state.PDistrictID.value.ID : null,
            this.state.TDistrictID.value && this.state.TDistrictID.value.ID ? this.state.TDistrictID.value.ID : null
        ]
    ) => {
        VnrLoadingSevices.show();
        HttpService.MultiRequest([
            HttpService.Post('[URI_HR]/Cat_GetData/GetVillageCascading', {
                districtid: DistrictID[0] ? DistrictID[0] : null
            }),
            HttpService.Post('[URI_HR]/Cat_GetData/GetVillageCascading', {
                districtid: DistrictID[1] ? DistrictID[1] : null
            })
        ])
            .then((res) => {
                VnrLoadingSevices.hide();
                if (res && Array.isArray(res) && res.length > 1) {
                    const [resPVillage, resTVillage] = res,
                        { PVillageID, TVillageID } = this.state;
                    // let newState = {};

                    if (resPVillage && Array.isArray(resPVillage) && resPVillage.length > 0) {
                        nextState = {
                            ...nextState,
                            PVillageID: {
                                ...PVillageID,
                                data: resPVillage,
                                disable: false,
                                refresh: !PVillageID.refresh
                            }
                        };
                    }

                    if (resTVillage && Array.isArray(resTVillage) && resTVillage.length > 0) {
                        nextState = {
                            ...nextState,
                            TVillageID: {
                                ...TVillageID,
                                data: resTVillage,
                                disable: false,
                                refresh: !TVillageID.refresh
                            }
                        };
                    }

                    this.setState(nextState);
                }
            })
            .catch(() => {
                ToasterSevice.showWarning('HRM_Common_SendRequest_Error');
            });
    };

    onSave = (navigation, isCreate, isSend) => {
        if (this.isProcessing) {
            return;
        }

        const {
            ID,
            Status,
            Profile,
            Type,
            DateSubmit,
            CodeTax,
            DateOfIssuedTaxCode,
            TaxDepartment,
            ProfileName,
            DateOfBirth,
            Gender,
            NationalityID,
            PhoneNumber,
            Email,
            CompanyEmail,
            CompanyID,
            FileAttach,
            Note,
            IDNo,
            IDDateOfIssue,
            IDPlaceOfIssue,
            IDCard,
            IDCardDateOfIssue,
            IDCardPlaceOfIssue,
            PassportNo,
            PassportDateOfIssue,
            PassportPlaceOfIssue,
            PCountryID,
            PProvinceID,
            PDistrictID,
            PVillageID,
            PAddress,
            TCountryID,
            TProvinceID,
            TDistrictID,
            TVillageID,
            TAddress,
            dataOld
        } = this.state;
        let param = {
            ProfileID: Profile.ID,
            UserSubmit: Profile.ID,
            IsPortal: true,
            IsSavePortal: true,

            Type: Type.value ? Type.value.Value : null,
            DateSubmit: DateSubmit.value ? moment(DateSubmit.value).format('MM/DD/YYYY LT') : null,
            CodeTax: CodeTax.value ? CodeTax.value : null,
            DateOfIssuedTaxCode: DateOfIssuedTaxCode.value
                ? moment(DateOfIssuedTaxCode.value).format('MM/DD/YYYY LT')
                : null,
            TaxDepartment: TaxDepartment.value ? TaxDepartment.value : null,
            ProfileName: ProfileName.value ? ProfileName.value : null,
            DateOfBirth: DateOfBirth.value ? moment(DateOfBirth.value).format('MM/DD/YYYY LT') : null,
            Gender: Gender.value ? Gender.value.Value : null,
            NationalityID: NationalityID.value && NationalityID.value.ID ? NationalityID.value.ID : null,
            PhoneNumber: PhoneNumber.value ? PhoneNumber.value : null,
            Email: Email.value ? Email.value : null,
            CompanyEmail: CompanyEmail.value ? CompanyEmail.value : null,
            CompanyID: CompanyID.value && CompanyID.value.ID ? CompanyID.value.ID : null,

            // CMND
            IDNo: IDNo.value ? IDNo.value : null,
            IDDateOfIssue: IDDateOfIssue.value ? moment(IDDateOfIssue.value).format('MM/DD/YYYY LT') : null,
            IDPlaceOfIssue: IDPlaceOfIssue.value ? IDPlaceOfIssue.value : null,

            // CCCD
            IDCard: IDCard.value ? IDCard.value : null,
            IDCardDateOfIssue: IDCardDateOfIssue.value ? moment(IDCardDateOfIssue.value).format('MM/DD/YYYY LT') : null,
            IDCardPlaceOfIssue: IDCardPlaceOfIssue.value ? IDCardPlaceOfIssue.value : null,

            // Passport
            PassportNo: PassportNo.value ? PassportNo.value : null,
            PassportDateOfIssue: PassportDateOfIssue.value
                ? moment(PassportDateOfIssue.value).format('MM/DD/YYYY LT')
                : null,
            PassportPlaceOfIssue: PassportPlaceOfIssue.value ? PassportPlaceOfIssue.value : null,

            // Permanent
            PCountryID: PCountryID.value && PCountryID.value.ID ? PCountryID.value.ID : null,
            PProvinceID: PProvinceID.value && PProvinceID.value.ID ? PProvinceID.value.ID : null,
            PDistrictID: PDistrictID.value && PDistrictID.value.ID ? PDistrictID.value.ID : null,
            PVillageID: PVillageID.value && PVillageID.value.ID ? PVillageID.value.ID : null,
            PAddress: PAddress.value ? PAddress.value : null,

            // Temporary
            TCountryID: TCountryID.value && TCountryID.value.ID ? TCountryID.value.ID : null,
            TProvinceID: TProvinceID.value && TProvinceID.value.ID ? TProvinceID.value.ID : null,
            TDistrictID: TDistrictID.value && TDistrictID.value.ID ? TDistrictID.value.ID : null,
            TVillageID: TVillageID.value && TVillageID.value.ID ? TVillageID.value.ID : null,
            TAddress: TAddress.value ? TAddress.value : null,

            Note: Note.value ? Note.value : null,
            FileAttach: FileAttach.value ? FileAttach.value.map((item) => item.fileName).join(',') : null
        };

        if (Email.value && !Vnr_Function.isValidateEmail(Email.value)) {
            let displayField = translate(Email.label)
            const nameField = translate('HRM_FieldInvalidEmail').replace('[{0}]', `[${displayField}]`);
            ToasterSevice.showWarning(nameField);
            return;
        } else if (CompanyEmail.value && !Vnr_Function.isValidateEmail(CompanyEmail.value)) {
            let displayField = translate(CompanyEmail.label)
            const nameField = translate('HRM_FieldInvalidEmail').replace('[{0}]', `[${displayField}]`);
            ToasterSevice.showWarning(nameField);
            return;
        }

        if (Type.value.Value === 'E_AdditionalAdjustments') {
            param = {
                ...param,
                ScreenView: 'Sal_TaxInformationRegisterAdditionalAdjustments',
                TaxDepartmentOld: dataOld.TaxDepartment ? dataOld.TaxDepartment : null,
                ProfileNameOld: dataOld.ProfileName ? dataOld.ProfileName : null,
                DateOfBirthOld: dataOld.DateOfBirth ? moment(dataOld.DateOfBirth).format('MM/DD/YYYY LT') : null,
                GenderOld: dataOld.Gender ? dataOld.Gender : null,
                OldNationalityID: dataOld.NationalityID ? dataOld.NationalityID : null,
                PhoneNumberOld: dataOld.PhoneNumber
                    ? dataOld.PhoneNumber
                    : dataOld.Cellphone
                        ? dataOld.Cellphone
                        : null,
                EmailOld: dataOld.Email ? dataOld.Email : null,
                OldCompanyEmail: dataOld.CompanyEmail ? dataOld.CompanyEmail : null,
                CompanyIDOld: dataOld.CompanyID ? dataOld.CompanyID : null,

                // CMND
                IDNoOld: dataOld.IDNo ? dataOld.IDNo : null,
                IDDateOfIssueOld: dataOld.IDDateOfIssue ? moment(dataOld.IDDateOfIssue).format('MM/DD/YYYY LT') : null,
                IDPlaceOfIssueOld: dataOld.IDPlaceOfIssue ? dataOld.IDPlaceOfIssue : null,

                // CCCD
                IDCardOld: dataOld.PassportNo ? dataOld.PassportNo : null,
                IDCardDateOfIssueOld: dataOld.IDCardDateOfIssue
                    ? moment(dataOld.IDCardDateOfIssue).format('MM/DD/YYYY LT')
                    : null,
                IDCardPlaceOfIssueOld: dataOld.IDCardPlaceOfIssue ? dataOld.IDCardPlaceOfIssue : null,

                // Passport
                OldPassportNo: dataOld.PassportNo ? dataOld.PassportNo : null,
                OldPassportDateOfIssue: dataOld.PassportDateOfIssue
                    ? moment(dataOld.PassportDateOfIssue).format('MM/DD/YYYY LT')
                    : null,
                OldPassportPlaceOfIssue: dataOld.PassportPlaceOfIssue ? dataOld.PassportPlaceOfIssue : null,

                // Permanent
                PProvinceIDOld: dataOld.PProvinceID ? dataOld.PProvinceID : null,
                PDistrictIDOld: dataOld.PDistrictID ? dataOld.PDistrictID : null,
                PVillageIDOld: dataOld.PVillageID ? dataOld.PVillageID : null,
                PAddressOld: dataOld.PAddress ? dataOld.PAddress : null,

                // Temporary
                TProvinceIDOld: dataOld.TProvinceID ? dataOld.TProvinceID : null,
                TDistrictIDOld: dataOld.TDistrictID ? dataOld.TDistrictID : null,
                TVillageIDOld: dataOld.TVillageID ? dataOld.TVillageID : null,
                TAddressOld: dataOld.TAddress ? dataOld.TAddress : null
            };
        } else {
            param = {
                ...param,
                ScreenView: 'Sal_TaxInformationRegisterInfo'
            };
        }

        // Send mail
        if (isSend) {
            param = {
                ...param,
                TypeButton: 'SaveForward'
            };
        }

        if (ID && Status) {
            param = {
                ...param,
                ID,
                Status
            };
        }
        this.isProcessing = true;
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Sal_TaxInformationRegister', param).then((data) => {
            VnrLoadingSevices.hide();
            this.isProcessing = false;
            if (data.ConfigMessage) {
                if (data.ConfigMessage == 'E_BLOCK') {
                    this.isProcessing = false;
                    ToasterSevice.showWarning(data.ActionStatus, 4000);
                } else if (data.ConfigMessage == 'E_WARRNING') {
                    this.isProcessing = false;

                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        iconType: EnumIcon.E_WARNING,
                        message: data.ActionStatus,
                        //lưu và tiếp tục
                        textRightButton: translate('Button_OK'),
                        onConfirm: () => {
                            this.IsContinueSave = true;
                            this.onSave(navigation, isCreate, isSend);
                        },
                        //đóng
                        onCancel: () => {}
                    });
                }
            } else if (data.ActionStatus.indexOf('Success') >= 0) {
                ToasterSevice.showSuccess('Hrm_Succeed', 4000);

                if (isCreate) {
                    this.refreshView();
                } else {
                    TaxApproveTaxInformationRegisterBusinessFunctionisterList.checkForReLoadScreen[
                        ScreenName.TaxApproveTaxInformationRegister
                    ] = true;
                    navigation.navigate('TaxApproveTaxInformationRegister');
                }

                // const { reload } = navigation.state.params;
                // if (typeof reload == 'function') {
                //   reload();
                // }
            } else if (data.ActionStatus == 'Locked') {
                ToasterSevice.showWarning('DataIsLocked', 4000);
            } else if (typeof data.ActionStatus == 'string') {
                ToasterSevice.showWarning(data.ActionStatus);
            } else {
                ToasterSevice.showWarning('HRM_Common_SendRequest_Error');
            }
        });
    };

    onSaveAndCreate = (navigation) => {
        this.onSave(navigation, true, null);
    };

    onSaveAndSend = (navigation) => {
        this.onSave(navigation, null, true);
    };

    //#region [xử lý group theo Message để thông báo lỗi]
    groupByMessage = (array, key) => {
        // Return the end result
        return array.reduce((result, currentValue) => {
            // If an array already present for key, push it to the array. Else create an array and push the object
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
            return result;
        }, {}); // empty object is the initial value for result object
    };

    mappingDataGroup = (dataGroup) => {
        let dataSource = [];
        // eslint-disable-next-line no-unused-vars
        for (let key in dataGroup) {
            let title =
                translate('HRM_Attendance_Message_MessageName') +
                ': ' +
                key +
                ' (' +
                translate('NumberCount') +
                ': ' +
                dataGroup[key].length +
                ')';

            dataSource = [...dataSource, { Type: 'E_GROUP', TitleGroup: title }, ...dataGroup[key]];
        }

        return dataSource;
    };

    renderErrorDetail = () => {
        const { modalErrorDetail } = this.state,
            { data } = modalErrorDetail,
            { styleViewTitleGroup } = styleViewTitleForGroup,
            RenderItemAction = styles;

        if (data) {
            const dataGroup = this.groupByMessage(data, 'MessageName'),
                dataSourceError = this.mappingDataGroup(dataGroup);

            return dataSourceError.map((dataItem, index) => {
                let viewContent = <View />;
                if (dataItem['Type'] && dataItem['Type'] == 'E_GROUP') {
                    viewContent = (
                        <View style={[styleViewTitleGroup, styles.styViewTitleGroup]}>
                            <VnrText
                                style={[styleSheets.text, styles.styTExtTitleGropup]}
                                i18nKey={dataItem['TitleGroup']}
                            />
                        </View>
                    );
                } else {
                    viewContent = (
                        <View style={RenderItemAction.viewInfo}>
                            <View style={RenderItemAction.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                    i18nKey={'HRM_HR_Profile_CodeEmp'}
                                />
                                <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text numberOfLines={1} style={[styleSheets.textItalic, RenderItemAction.fontText]}>
                                        {dataItem['CodeEmp']}
                                    </Text>
                                </View>
                            </View>

                            <View style={RenderItemAction.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                    i18nKey={'HRM_HR_Profile_ProfileName'}
                                />
                                <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text numberOfLines={1} style={[styleSheets.textItalic, RenderItemAction.fontText]}>
                                        {dataItem['ProfileName']}
                                    </Text>
                                </View>
                            </View>

                            <View style={RenderItemAction.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                    i18nKey={'HRM_Attendance_ErrorMessageRespone_ErrorDescription'}
                                />
                                <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>
                                        {dataItem['ErrorDescription']}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    );
                }

                return <View key={index} style={styles.styleViewBorderButtom}>{viewContent}</View>;
            });
        } else {
            return <View />;
        }
    };

    getErrorMessageRespone() {
        const { modalErrorDetail } = this.state,
            { cacheID } = modalErrorDetail;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetErrorMessageRespone', { cacheID: cacheID }).then((res) => {
            VnrLoadingSevices.hide();
            if (res && res.Data) {
                this.setState({
                    modalErrorDetail: {
                        ...modalErrorDetail,
                        data: res.Data
                    }
                });
            }
        });
    }

    closeModalErrorDetail = () => {
        let nextState = {
            modalErrorDetail: {
                ...this.state.modalErrorDetail,
                isModalVisible: false
            }
        };

        this.setState(nextState);
    };
    //#endregion

    getAddressWhenSearch = (ID, isPermanent) => {
        try {
            if (ID) {
                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Cat_GetData/GetDataSoureAddress', {
                    ID
                })
                    .then((res) => {
                        VnrLoadingSevices.hide();
                        if (res && Array.isArray(res) && res.length > 0) {
                            const {
                                PCountryID,
                                PProvinceID,
                                PDistrictID,
                                PVillageID,
                                TCountryID,
                                TProvinceID,
                                TDistrictID,
                                TVillageID
                            } = this.state;
                            let nextState = {};
                            if (isPermanent) {
                                nextState = {
                                    ...nextState,
                                    PCountryID: {
                                        ...PCountryID,
                                        value: res[0].CountryID
                                            ? {
                                                ID: res[0].CountryID,
                                                CountryName: res[0].CountryName ? res[0].CountryName : null
                                            }
                                            : null,
                                        refresh: !PCountryID.refresh
                                    },
                                    PProvinceID: {
                                        ...PProvinceID,
                                        value: res[0].ProvinceID
                                            ? {
                                                ID: res[0].ProvinceID,
                                                ProvinceName: res[0].ProvinceName ? res[0].ProvinceName : null
                                            }
                                            : null,
                                        refresh: !PProvinceID.refresh
                                    },
                                    PDistrictID: {
                                        ...PDistrictID,
                                        value: res[0].DistrictID
                                            ? {
                                                ID: res[0].DistrictID,
                                                DistrictName: res[0].DistrictName ? res[0].DistrictName : null
                                            }
                                            : null,
                                        refresh: !PDistrictID.refresh
                                    },
                                    PVillageID: {
                                        ...PVillageID,
                                        value: res[0].VillageID
                                            ? {
                                                ID: res[0].VillageID,
                                                VillageName: res[0].VillageName ? res[0].VillageName : null
                                            }
                                            : null,
                                        refresh: !PVillageID.refresh
                                    }
                                };
                            } else {
                                nextState = {
                                    ...nextState,
                                    TCountryID: {
                                        ...TCountryID,
                                        value: res[0].CountryID
                                            ? {
                                                ID: res[0].CountryID,
                                                CountryName: res[0].CountryName ? res[0].CountryName : null
                                            }
                                            : null,
                                        refresh: !TCountryID.refresh
                                    },
                                    TProvinceID: {
                                        ...TProvinceID,
                                        value: res[0].ProvinceID
                                            ? {
                                                ID: res[0].ProvinceID,
                                                ProvinceName: res[0].ProvinceName ? res[0].ProvinceName : null
                                            }
                                            : null,
                                        refresh: !TProvinceID.refresh
                                    },
                                    TDistrictID: {
                                        ...TDistrictID,
                                        value: res[0].DistrictID
                                            ? {
                                                ID: res[0].DistrictID,
                                                DistrictName: res[0].DistrictName ? res[0].DistrictName : null
                                            }
                                            : null,
                                        refresh: !TDistrictID.refresh
                                    },
                                    TVillageID: {
                                        ...TVillageID,
                                        value: res[0].VillageID
                                            ? {
                                                ID: res[0].VillageID,
                                                VillageName: res[0].VillageName ? res[0].VillageName : null
                                            }
                                            : null,
                                        refresh: !TVillageID.refresh
                                    }
                                };
                            }

                            this.setState(nextState, () => {
                                if (isPermanent) {
                                    this.getDistrictByProvinceID(
                                        [res[0].ProvinceID ? res[0].ProvinceID : null, null],
                                        true
                                    );
                                } else {
                                    this.getDistrictByProvinceID(
                                        [null, res[0].ProvinceID ? res[0].ProvinceID : null],
                                        true
                                    );
                                }
                            });
                        }
                    })
                    .catch(() => {
                        ToasterSevice.showWarning('HRM_Common_SendRequest_Error');
                    });
            }
        } catch (error) {
            return;
        }
    };

    handleGetDataMissing = (missingCompanyName = false) => {
        const { CompanyID } = this.state;
        let arrRequest = [HttpService.Get('[URI_HR]/Cat_GetData/GetMultiCompany')],
            nextState = {};

        HttpService.MultiRequest(arrRequest)
            .then((resAll) => {
                if (resAll && Array.isArray(resAll) && resAll.length > 0) {
                    if (missingCompanyName && Array.isArray(resAll[0]) && resAll[0].length > 0) {
                        resAll[0].find((value) => {
                            if (
                                value.ID &&
                                value.CompanyName &&
                                CompanyID.value &&
                                CompanyID.value.ID &&
                                value.ID === CompanyID.value.ID
                            ) {
                                nextState = {
                                    ...nextState,
                                    CompanyID: {
                                        ...CompanyID,
                                        value: { ID: value.ID, CompanyName: value.CompanyName },
                                        refresh: !CompanyID.refresh
                                    }
                                };
                            }
                        });
                    }

                    this.setState(nextState);
                }
            })
            .catch(() => {});
    };

    handleValidateMail(email) {
        if (email.value && !Vnr_Function.isValidateEmail(email.value)) {
            let displayField = translate(email.label)
            const nameField = translate('HRM_FieldInvalidEmail').replace('[{0}]', `[${displayField}]`);
            ToasterSevice.showWarning(nameField);
        }
    }

    render() {
        const {
            Type,
            DateSubmit,
            CodeTax,
            DateOfIssuedTaxCode,
            TaxDepartment,
            ProfileName,
            DateOfBirth,
            Gender,
            NationalityID,
            PhoneNumber,
            Email,
            CompanyEmail,
            CompanyID,
            FileAttach,
            Note,
            IDNo,
            IDDateOfIssue,
            IDPlaceOfIssue,
            IDCard,
            IDCardDateOfIssue,
            IDCardPlaceOfIssue,
            PassportNo,
            PassportDateOfIssue,
            PassportPlaceOfIssue,
            SearchPermanentAddress,
            PCountryID,
            PProvinceID,
            PDistrictID,
            PVillageID,
            PAddress,
            SearchTemporaryAddress,
            TCountryID,
            TProvinceID,
            TDistrictID,
            TVillageID,
            TAddress,
            fieldValid,
            modalErrorDetail
        } = this.state;

        const {
            textLableInfo,
            contentViewControl,
            viewLable,
            viewControl,
            viewInputMultiline
        } = stylesListPickerControl;
        //#region [Xử lý 3 nút lưu]
        const listActions = [];

        listActions.push({
            type: EnumName.E_SAVE_SENMAIL,
            title: translate('HRM_Common_SaveAndForward_Sal'),
            onPress: () => this.onSaveAndSend(this.props.navigation)
        });

        listActions.push({
            type: EnumName.E_SAVE_CLOSE,
            title: translate('HRM_Common_SaveClose'),
            onPress: () => this.onSave(this.props.navigation)
        });

        //#endregion
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={styles.styKeyboardView}
                        ref={(ref) => (this.scrollViewRef = ref)}
                    >
                        {/* task: 0164850 */}

                        {/* Loại -  Type */}
                        {Type.visibleConfig && Type.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Type.label} />

                                    {/* valid Type */}
                                    {/* {
                    fieldValid.Type && <VnrText style={styleValid} i18nKey={"HRM_Valid_Char"} />
                  } */}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        autoFilter={true}
                                        dataLocal={Type.data}
                                        refresh={Type.refresh}
                                        textField="Text"
                                        valueField="Value"
                                        filter={false}
                                        value={Type.value}
                                        filterServer={false}
                                        disable={Type.disable}
                                        onFinish={(item) =>
                                            this.setState({
                                                Type: {
                                                    ...Type,
                                                    value: item,
                                                    refresh: !Type.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày đăng ký - DateSubmit */}
                        {DateSubmit.visibleConfig && DateSubmit.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DateSubmit.label} />

                                    {/* valid DateSubmit */}
                                    {fieldValid.DateSubmit && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        disable={DateSubmit.disable}
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={DateSubmit.value}
                                        refresh={DateSubmit.refresh}
                                        type={'date'}
                                        onFinish={(value) => {
                                            this.setState({
                                                DateSubmit: {
                                                    ...DateSubmit,
                                                    value: value,
                                                    refresh: !DateSubmit.refresh
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Mã số thuế -  CodeTax*/}
                        {CodeTax.visibleConfig && CodeTax.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={CodeTax.label} />
                                    {fieldValid.CodeTax && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={CodeTax.disable}
                                        refresh={CodeTax.refresh}
                                        value={CodeTax.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                CodeTax: {
                                                    ...CodeTax,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày áp dụng MST - DateOfIssuedTaxCode */}
                        {DateOfIssuedTaxCode.visibleConfig && DateOfIssuedTaxCode.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={DateOfIssuedTaxCode.label}
                                    />

                                    {/* valid DateOfIssuedTaxCode */}
                                    {fieldValid.DateOfIssuedTaxCode && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        disable={DateOfIssuedTaxCode.disable}
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={DateOfIssuedTaxCode.value}
                                        refresh={DateOfIssuedTaxCode.refresh}
                                        type={'date'}
                                        onFinish={() => {}}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Cơ quan quản lý MST -  TaxDepartment*/}
                        {TaxDepartment.visibleConfig && TaxDepartment.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={TaxDepartment.label} />
                                    {fieldValid.TaxDepartment && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={TaxDepartment.disable}
                                        refresh={TaxDepartment.refresh}
                                        value={TaxDepartment.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                TaxDepartment: {
                                                    ...TaxDepartment,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Họ và tên -  ProfileName*/}
                        {ProfileName.visibleConfig && ProfileName.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={ProfileName.label} />
                                    {fieldValid.ProfileName && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={ProfileName.disable}
                                        refresh={ProfileName.refresh}
                                        value={ProfileName.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                ProfileName: {
                                                    ...ProfileName,
                                                    value: text
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
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DateOfBirth.label} />

                                    {/* valid DateOfBirth */}
                                    {fieldValid.DateOfBirth && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        disable={DateOfBirth.disable}
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={DateOfBirth.value}
                                        refresh={DateOfBirth.refresh}
                                        type={'date'}
                                        onFinish={() => {}}
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
                                        autoFilter={true}
                                        api={{
                                            urlApi: '[URI_SYS]/Sys_GetData/GetEnum?text=Gender&text=',
                                            type: 'E_GET'
                                        }}
                                        refresh={Gender.refresh}
                                        textField="Text"
                                        valueField="Value"
                                        filter={true}
                                        value={Gender.value}
                                        filterServer={false}
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

                        {/* Quốc tịch -  NationalityID */}
                        {NationalityID.visibleConfig && NationalityID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={NationalityID.label} />

                                    {/* valid NationalityID */}
                                    {fieldValid.NationalityID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiCountry?text=',
                                            type: 'E_GET'
                                        }}
                                        autoFilter={true}
                                        refresh={NationalityID.refresh}
                                        textField="CountryName"
                                        valueField="ID"
                                        filter={true}
                                        value={NationalityID.value}
                                        filterServer={false}
                                        // filterParams= "text"
                                        disable={NationalityID.disable}
                                        onFinish={(item) =>
                                            this.setState({
                                                NationalityID: {
                                                    ...NationalityID,
                                                    value: item,
                                                    refresh: !NationalityID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* SĐT liên hệ -  PhoneNumber*/}
                        {PhoneNumber.visibleConfig && PhoneNumber.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PhoneNumber.label} />
                                    {fieldValid.PhoneNumber && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={PhoneNumber.disable}
                                        refresh={PhoneNumber.refresh}
                                        value={PhoneNumber.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
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

                        {/* Email -  Email*/}
                        {Email.visibleConfig && Email.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Email.label} />
                                    {fieldValid.Email && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Email.disable}
                                        refresh={Email.refresh}
                                        value={Email.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onBlur={() => this.handleValidateMail(Email)}
                                        onChangeText={(text) =>
                                            this.setState({
                                                Email: {
                                                    ...Email,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Email Công ty -  CompanyEmail */}
                        {CompanyEmail.visibleConfig && CompanyEmail.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={CompanyEmail.label} />
                                    {fieldValid.CompanyEmail && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={CompanyEmail.disable}
                                        refresh={CompanyEmail.refresh}
                                        value={CompanyEmail.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        onBlur={() => this.handleValidateMail(CompanyEmail)}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                CompanyEmail: {
                                                    ...CompanyEmail,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Công ty -  CompanyID */}
                        {CompanyID.visibleConfig && CompanyID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={CompanyID.label} />

                                    {/* valid CompanyID */}
                                    {fieldValid.CompanyID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiCompany',
                                            type: 'E_GET'
                                        }}
                                        autoFilter={true}
                                        refresh={CompanyID.refresh}
                                        textField="CompanyName"
                                        valueField="ID"
                                        filter={true}
                                        value={CompanyID.value}
                                        filterServer={true}
                                        filterParams="text"
                                        disable={CompanyID.disable}
                                        onFinish={(item) =>
                                            this.setState({
                                                CompanyID: {
                                                    ...CompanyID,
                                                    value: item,
                                                    refresh: !CompanyID.refresh
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
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={FileAttach.label} />

                                    {/* valid FileAttach */}
                                    {fieldValid.FileAttach && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrAttachFile
                                        disable={FileAttach.disable}
                                        refresh={FileAttach.refresh}
                                        value={FileAttach.value}
                                        multiFile={true}
                                        uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                        onFinish={(file) => {
                                            this.setState({
                                                FileAttach: {
                                                    ...FileAttach,
                                                    value: file,
                                                    refresh: !FileAttach.refresh
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ghi chú -  Note*/}
                        {Note.visibleConfig && Note.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Note.label} />
                                    {fieldValid.Note && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Note.disable}
                                        refresh={Note.refresh}
                                        value={Note.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
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

                        {/* Title CMND */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo, styles.stTextTAddress]}
                                    i18nKey={'SalaryTaxInfoToInput__E_IDCard'}
                                />
                            </View>
                        </View>

                        {/* Số CMND -  IDNo*/}
                        {IDNo.visibleConfig && IDNo.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={IDNo.label} />
                                    {fieldValid.IDNo && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={IDNo.disable}
                                        refresh={IDNo.refresh}
                                        value={IDNo.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                IDNo: {
                                                    ...IDNo,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày cấp CMND - IDDateOfIssue */}
                        {IDDateOfIssue.visibleConfig && IDDateOfIssue.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={IDDateOfIssue.label} />

                                    {/* valid IDDateOfIssue */}
                                    {fieldValid.IDDateOfIssue && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        disable={IDDateOfIssue.disable}
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={IDDateOfIssue.value}
                                        refresh={IDDateOfIssue.refresh}
                                        type={'date'}
                                        onFinish={() => {}}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Nơi cấp CMND -  IDPlaceOfIssue*/}
                        {IDPlaceOfIssue.visibleConfig && IDPlaceOfIssue.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={IDPlaceOfIssue.label} />
                                    {fieldValid.IDPlaceOfIssue && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={IDPlaceOfIssue.disable}
                                        refresh={IDPlaceOfIssue.refresh}
                                        value={IDPlaceOfIssue.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                IDPlaceOfIssue: {
                                                    ...IDPlaceOfIssue,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Title Thẻ CCCD */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo, styles.stTextTAddress]}
                                    i18nKey={'IdentificationNo'}
                                />
                            </View>
                        </View>

                        {/* Số TCC -  IDCard*/}
                        {IDCard.visibleConfig && IDCard.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={IDCard.label} />
                                    {fieldValid.IDCard && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={IDCard.disable}
                                        refresh={IDCard.refresh}
                                        value={IDCard.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                IDCard: {
                                                    ...IDCard,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày cấp TCC - IDCardDateOfIssue */}
                        {IDCardDateOfIssue.visibleConfig && IDCardDateOfIssue.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={IDCardDateOfIssue.label}
                                    />

                                    {/* valid IDCardDateOfIssue */}
                                    {fieldValid.IDCardDateOfIssue && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        disable={IDCardDateOfIssue.disable}
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={IDCardDateOfIssue.value}
                                        refresh={IDCardDateOfIssue.refresh}
                                        type={'date'}
                                        onFinish={() => {}}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Nơi cấp TCC -  IDCardPlaceOfIssue*/}
                        {IDCardPlaceOfIssue.visibleConfig && IDCardPlaceOfIssue.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={IDCardPlaceOfIssue.label}
                                    />
                                    {fieldValid.IDCardPlaceOfIssue && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={IDCardPlaceOfIssue.disable}
                                        refresh={IDCardPlaceOfIssue.refresh}
                                        value={IDCardPlaceOfIssue.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                IDCardPlaceOfIssue: {
                                                    ...IDCardPlaceOfIssue,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Title Hộ chiếu */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo, styles.stTextTAddress]}
                                    i18nKey={'SalaryTaxInfoToInput__E_Passport'}
                                />
                            </View>
                        </View>

                        {/* Số Hộ chiếu -  PassportNo*/}
                        {PassportNo.visibleConfig && PassportNo.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PassportNo.label} />
                                    {fieldValid.PassportNo && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={PassportNo.disable}
                                        refresh={PassportNo.refresh}
                                        value={PassportNo.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                PassportNo: {
                                                    ...PassportNo,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày cấp Hộ chiếu - PassportDateOfIssue */}
                        {PassportDateOfIssue.visibleConfig && PassportDateOfIssue.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={PassportDateOfIssue.label}
                                    />

                                    {/* valid PassportDateOfIssue */}
                                    {fieldValid.PassportDateOfIssue && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        disable={PassportDateOfIssue.disable}
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={PassportDateOfIssue.value}
                                        refresh={PassportDateOfIssue.refresh}
                                        type={'date'}
                                        onFinish={() => {}}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Nơi cấp Hộ chiếu -  PassportPlaceOfIssue*/}
                        {PassportPlaceOfIssue.visibleConfig && PassportPlaceOfIssue.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={PassportPlaceOfIssue.label}
                                    />
                                    {fieldValid.PassportPlaceOfIssue && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={PassportPlaceOfIssue.disable}
                                        refresh={PassportPlaceOfIssue.refresh}
                                        value={PassportPlaceOfIssue.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                PassportPlaceOfIssue: {
                                                    ...PassportPlaceOfIssue,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Title Địa chỉ thường trú */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo, styles.stTextTAddress]}
                                    i18nKey={'HRM_Hre_Relatives_PAddress'}
                                />
                            </View>
                        </View>

                        {/* Tìm địa chỉ thường trú - SearchPermanentAddress*/}
                        {SearchPermanentAddress.visibleConfig && SearchPermanentAddress.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={SearchPermanentAddress.label}
                                    />

                                    {/* valid SearchPermanentAddress */}
                                    {fieldValid.SearchPermanentAddress && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetAddressMulti',
                                            type: 'E_GET'
                                        }}
                                        autoFilter={true}
                                        refresh={SearchPermanentAddress.refresh}
                                        textField="AddressVN"
                                        valueField="ID"
                                        filter={true}
                                        value={SearchPermanentAddress.value}
                                        filterServer={true}
                                        filterParams="text"
                                        disable={SearchPermanentAddress.disable}
                                        onFinish={(item) =>
                                            this.setState(
                                                {
                                                    SearchPermanentAddress: {
                                                        ...SearchPermanentAddress,
                                                        value: item,
                                                        refresh: !SearchPermanentAddress.refresh
                                                    }
                                                },
                                                () => {
                                                    this.getAddressWhenSearch(item && item.ID ? item.ID : null, true);
                                                }
                                            )
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Quốc gia (Thường trú) - PCountryID*/}
                        {PCountryID.visibleConfig && PCountryID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PCountryID.label} />

                                    {/* valid PCountryID */}
                                    {fieldValid.PCountryID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiCountry?text=',
                                            type: 'E_GET'
                                        }}
                                        autoFilter={true}
                                        refresh={PCountryID.refresh}
                                        textField="CountryName"
                                        valueField="ID"
                                        filter={true}
                                        value={PCountryID.value}
                                        filterServer={false}
                                        disable={PCountryID.disable}
                                        onFinish={(item) =>
                                            this.setState({
                                                PCountryID: {
                                                    ...PCountryID,
                                                    value: item,
                                                    refresh: !PCountryID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Tỉnh/TP (Thường trú) - PProvinceID*/}
                        {PProvinceID.visibleConfig && PProvinceID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PProvinceID.label} />

                                    {/* valid PProvinceID */}
                                    {fieldValid.PProvinceID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiProvince?text=',
                                            type: 'E_GET'
                                        }}
                                        autoFilter={true}
                                        refresh={PProvinceID.refresh}
                                        textField="ProvinceName"
                                        valueField="ID"
                                        filter={true}
                                        value={PProvinceID.value}
                                        filterServer={false}
                                        disable={PProvinceID.disable}
                                        onFinish={(item) => {
                                            this.setState(
                                                {
                                                    PProvinceID: {
                                                        ...PProvinceID,
                                                        value: item,
                                                        refresh: !PProvinceID.refresh
                                                    },
                                                    PDistrictID: {
                                                        ...PDistrictID,
                                                        value: null,
                                                        refresh: !PDistrictID.refresh
                                                    },
                                                    PVillageID: {
                                                        ...PVillageID,
                                                        value: null,
                                                        data: [],
                                                        disable: true,
                                                        refresh: !PVillageID.refresh
                                                    }
                                                },
                                                () => {
                                                    this.getDistrictByProvinceID(
                                                        [item && item.ID ? item.ID : null, null],
                                                        false
                                                    );
                                                }
                                            );
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Quận huyện (Thường trú) - PDistrictID*/}
                        {PDistrictID.visibleConfig && PDistrictID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PDistrictID.label} />

                                    {/* valid PDistrictID */}
                                    {fieldValid.PDistrictID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        // api={{
                                        //   urlApi:
                                        //     '[URI_HR]/Cat_GetData/GetMultiDistrict?text=',
                                        //   type: 'E_GET',
                                        // }}
                                        dataLocal={PDistrictID.data}
                                        autoFilter={true}
                                        refresh={PDistrictID.refresh}
                                        textField="DistrictName"
                                        valueField="ID"
                                        filter={true}
                                        value={PDistrictID.value}
                                        filterServer={false}
                                        disable={PDistrictID.disable}
                                        onFinish={(item) =>
                                            this.setState(
                                                {
                                                    PDistrictID: {
                                                        ...PDistrictID,
                                                        value: item,
                                                        refresh: !PDistrictID.refresh
                                                    },
                                                    PVillageID: {
                                                        ...PVillageID,
                                                        value: null,
                                                        refresh: !PVillageID.refresh
                                                    }
                                                },
                                                () => {
                                                    this.getVillageByDistrictID();
                                                }
                                            )
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Phường/Xã (Thường trú) - PDistrictID*/}
                        {PVillageID.visibleConfig && PVillageID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PVillageID.label} />

                                    {/* valid PVillageID */}
                                    {fieldValid.PVillageID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        // api={{
                                        //   urlApi:
                                        //     '[URI_HR]/Cat_GetData/GetMultiDistrict?text=',
                                        //   type: 'E_GET',
                                        // }}
                                        dataLocal={PVillageID.data}
                                        autoFilter={true}
                                        refresh={PVillageID.refresh}
                                        textField="VillageName"
                                        valueField="ID"
                                        filter={true}
                                        value={PVillageID.value}
                                        filterServer={false}
                                        disable={PVillageID.disable}
                                        onFinish={(item) =>
                                            this.setState({
                                                PVillageID: {
                                                    ...PVillageID,
                                                    value: item,
                                                    refresh: !PVillageID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Địa chỉ (Thường trú) -  PAddress*/}
                        {PAddress.visibleConfig && PAddress.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PAddress.label} />
                                    {fieldValid.PAddress && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={PAddress.disable}
                                        refresh={PAddress.refresh}
                                        value={PAddress.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
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

                        {/* Title Địa chỉ tạm trú */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo, styles.stTextTAddress]}
                                    i18nKey={'HRM_HR_Profile_ProfileTAddress'}
                                />
                            </View>
                        </View>

                        {/* Tìm địa chỉ tạm trú - SearchTemporaryAddress*/}
                        {SearchTemporaryAddress.visibleConfig && SearchTemporaryAddress.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={SearchTemporaryAddress.label}
                                    />

                                    {/* valid SearchTemporaryAddress */}
                                    {fieldValid.SearchTemporaryAddress && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetAddressMulti',
                                            type: 'E_GET'
                                        }}
                                        autoFilter={true}
                                        refresh={SearchTemporaryAddress.refresh}
                                        textField="AddressVN"
                                        valueField="ID"
                                        filter={true}
                                        value={SearchTemporaryAddress.value}
                                        filterServer={true}
                                        filterParams="text"
                                        disable={SearchTemporaryAddress.disable}
                                        onFinish={(item) =>
                                            this.setState(
                                                {
                                                    SearchTemporaryAddress: {
                                                        ...SearchTemporaryAddress,
                                                        value: item,
                                                        refresh: !SearchTemporaryAddress.refresh
                                                    }
                                                },
                                                () => {
                                                    this.getAddressWhenSearch(item && item.ID ? item.ID : null, false);
                                                }
                                            )
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Quốc gia (Tạm trú) - TCountryID*/}
                        {TCountryID.visibleConfig && TCountryID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={TCountryID.label} />

                                    {/* valid TCountryID */}
                                    {fieldValid.TCountryID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiCountry?text=',
                                            type: 'E_GET'
                                        }}
                                        autoFilter={true}
                                        refresh={TCountryID.refresh}
                                        textField="CountryName"
                                        valueField="ID"
                                        filter={true}
                                        value={TCountryID.value}
                                        filterServer={false}
                                        disable={TCountryID.disable}
                                        onFinish={(item) =>
                                            this.setState({
                                                TCountryID: {
                                                    ...TCountryID,
                                                    value: item,
                                                    refresh: !TCountryID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Tỉnh/TP (Tạm trú) - TProvinceID*/}
                        {TProvinceID.visibleConfig && TProvinceID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={TProvinceID.label} />

                                    {/* valid TProvinceID */}
                                    {fieldValid.TProvinceID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiProvince?text=',
                                            type: 'E_GET'
                                        }}
                                        autoFilter={true}
                                        refresh={TProvinceID.refresh}
                                        textField="ProvinceName"
                                        valueField="ID"
                                        filter={true}
                                        value={TProvinceID.value}
                                        filterServer={false}
                                        disable={TProvinceID.disable}
                                        onFinish={(item) => {
                                            this.setState(
                                                {
                                                    TProvinceID: {
                                                        ...TProvinceID,
                                                        value: item,
                                                        refresh: !TProvinceID.refresh
                                                    },
                                                    TDistrictID: {
                                                        ...TDistrictID,
                                                        value: null,
                                                        refresh: !TDistrictID.refresh
                                                    },
                                                    TVillageID: {
                                                        ...TVillageID,
                                                        value: null,
                                                        data: [],
                                                        disable: true,
                                                        refresh: !TVillageID.refresh
                                                    }
                                                },
                                                () => {
                                                    this.getDistrictByProvinceID(
                                                        [null, item && item.ID ? item.ID : null],
                                                        false
                                                    );
                                                }
                                            );
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Quận huyện (Tạm trú) - TDistrictID*/}
                        {TDistrictID.visibleConfig && TDistrictID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={TDistrictID.label} />

                                    {/* valid TDistrictID */}
                                    {fieldValid.TDistrictID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        // api={{
                                        //   urlApi:
                                        //     '[URI_HR]/Cat_GetData/GetMultiDistrict?text=',
                                        //   type: 'E_GET',
                                        // }}
                                        dataLocal={TDistrictID.data}
                                        autoFilter={true}
                                        refresh={TDistrictID.refresh}
                                        textField="DistrictName"
                                        valueField="ID"
                                        filter={true}
                                        value={TDistrictID.value}
                                        filterServer={false}
                                        disable={TDistrictID.disable}
                                        onFinish={(item) =>
                                            this.setState(
                                                {
                                                    TDistrictID: {
                                                        ...TDistrictID,
                                                        value: item,
                                                        refresh: !TDistrictID.refresh
                                                    },
                                                    TVillageID: {
                                                        ...TVillageID,
                                                        value: null,
                                                        refresh: !TVillageID.refresh
                                                    }
                                                },
                                                () => {
                                                    this.getVillageByDistrictID();
                                                }
                                            )
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Phường/Xã (Tạm trú) - TVillageID*/}
                        {TVillageID.visibleConfig && TVillageID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={TVillageID.label} />

                                    {/* valid TVillageID */}
                                    {fieldValid.TVillageID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        // api={{
                                        //   urlApi:
                                        //     '[URI_HR]/Cat_GetData/GetMultiDistrict?text=',
                                        //   type: 'E_GET',
                                        // }}
                                        dataLocal={TVillageID.data}
                                        autoFilter={true}
                                        refresh={TVillageID.refresh}
                                        textField="VillageName"
                                        valueField="ID"
                                        filter={true}
                                        value={TVillageID.value}
                                        filterServer={false}
                                        disable={TVillageID.disable}
                                        onFinish={(item) =>
                                            this.setState({
                                                TVillageID: {
                                                    ...TVillageID,
                                                    value: item,
                                                    refresh: !TVillageID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Địa chỉ (Tạm trú) -  TAddress*/}
                        {TAddress.visibleConfig && TAddress.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={TAddress.label} />
                                    {fieldValid.TAddress && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={TAddress.disable}
                                        refresh={TAddress.refresh}
                                        value={TAddress.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
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
                    </KeyboardAwareScrollView>

                    <ListButtonSave listActions={listActions} />

                    {modalErrorDetail.isModalVisible && (
                        <Modal
                            onBackButtonPress={() => this.closeModalErrorDetail()}
                            isVisible={true}
                            onBackdropPress={() => this.closeModalErrorDetail()}
                            customBackdrop={
                                <TouchableWithoutFeedback onPress={() => this.closeModalErrorDetail()}>
                                    <View style={styles.styViewModalError} />
                                </TouchableWithoutFeedback>
                            }
                            style={CustomStyleSheet.margin(0)}
                        >
                            <View style={stylesModalPopupBottom.viewModal}>
                                <SafeAreaView {...styleSafeAreaView} style={stylesModalPopupBottom.safeRadius}>
                                    <View style={styles.headerCloseModal}>
                                        <IconColse color={Colors.white} size={Size.iconSize} />
                                        <VnrText
                                            style={styleSheets.lable}
                                            i18nKey={'HRM_Attendance_Message_ViolationNotification'}
                                        />
                                        <TouchableOpacity onPress={() => this.closeModalErrorDetail()}>
                                            <IconColse color={Colors.grey} size={Size.iconSize} />
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView style={styles.styScrollErrorDetail}>
                                        {this.renderErrorDetail()}
                                    </ScrollView>
                                    <View style={styles.groupButton}>
                                        <TouchableOpacity
                                            onPress={() => this.closeModalErrorDetail()}
                                            style={styles.btnClose}
                                        >
                                            <VnrText
                                                style={[styleSheets.lable, { color: Colors.white }]}
                                                i18nKey={'HRM_Common_Close'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </SafeAreaView>
                            </View>
                        </Modal>
                    )}
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styKeyboardView: { flexGrow: 1, paddingTop: 10 },
    styTExtTitleGropup: { fontWeight: '500', color: Colors.primary },
    styScrollErrorDetail: { flexGrow: 1, flexDirection: 'column' },
    stTextTAddress: { fontSize: 20, fontWeight: '700' },
    styViewModalError: { flex: 1, backgroundColor: Colors.black, opacity: 0.5 },
    styViewTitleGroup: { marginHorizontal: 0, paddingBottom: 5, marginBottom: 10 },
    headerCloseModal: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    groupButton: {
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: styleSheets.p_10,
        backgroundColor: Colors.white,
        marginTop: 10,
        marginBottom: 10
    },
    btnClose: {
        height: Size.heightButton,
        backgroundColor: Colors.red,
        borderRadius: styleSheets.radius_5,
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
    },
    styleViewBorderButtom: {
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.borderColor,
        flex: 1,
        marginBottom: 0.5,
        marginHorizontal: 10,
        paddingVertical: 10
    }
});
