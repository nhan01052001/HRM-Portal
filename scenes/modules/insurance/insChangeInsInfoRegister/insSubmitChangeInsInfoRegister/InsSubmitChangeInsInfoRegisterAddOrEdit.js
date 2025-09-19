import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import HttpService from '../../../../../utils/HttpService';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName } from '../../../../../assets/constant';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import { translate } from '../../../../../i18n/translate';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import moment from 'moment';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import CheckBox from 'react-native-check-box';

let enumName = null,
    profileInfo = null;

const initSateDefault = {
    ProfileID: {
        ID: null,
        ProfileName: '',
        disable: true,
        label: 'HRM_Insurance_InsuranceRecord_ProfileIDV2'
    },
    RegisterType: {
        label: 'HRM_Attendance_Overtime_DurationType',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true,
        api: {
            urlApi: '[URI_SYS]/Sys_GetData/GetEnum?text=ChangeInsInfoRegister_Type',
            type: 'E_GET'
        },
        valueField: 'Value',
        textField: 'Text',
        data: []
    },
    DateSubmit: {
        ID: null,
        label: 'HRM_Insurance_ChangeInsInfoRegister_DateSubmit',
        disable: false,
        refresh: false,
        value: new Date(),
        visible: true,
        visibleConfig: true
    },
    InsuranceCode: {
        label: 'HRM_Hre_HouseholdInfo_SocialInsNo',
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    SocialInsIssueDate: {
        ID: null,
        label: 'HRM_Insurance_InsuranceInfo_SocialInsIssueDate',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    SocialInsIssuePlace: {
        label: 'SocialInsIssuePlace',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    SocialInsPlaceID: {
        label: 'HRM_HR_Profile_SocialInsPlaceID',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true,
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetMultiProvinceCodeName',
            type: 'E_GET'
        },
        valueField: 'ID',
        textField: 'ProvinceName',
        data: []
    },
    HealthInsNo: {
        label: 'HealthInsNo',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    HealthInsIssueDate: {
        ID: null,
        label: 'HRM_HR_Profile_HealthInsIssueDate',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    HealthTreatmentPlaceID: {
        label: 'HRM_Insurance_ChangeInsInfoRegister_HealthTreatmentPlaceName',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true,
        valueField: 'ID',
        textField: 'HealthTreatmentCodeName',
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetMultiHealthTreatmentPlace',
            type: 'E_GET'
        },
        data: []
    },
    FiveConsecutiveYearsFrom: {
        ID: null,
        label: 'FiveConsecutiveYearsFrom',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    ProfileName: {
        label: 'HRM_HR_Relatives_ProfileName',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    DayOfBirth: {
        ID: null,
        label: 'DayOfBirth',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    Gender: {
        label: 'Gender',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true,
        api: {
            urlApi: '[URI_SYS]/Sys_GetData/GetEnum?text=Gender',
            type: 'E_GET'
        },
        valueField: 'Value',
        textField: 'Text',
        data: []
    },
    NationalityID: {
        label: 'HRM_Payroll_Sal_TaxInformationRegister_NationalityID',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true,
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetMultiCountry',
            type: 'E_GET'
        },
        valueField: 'ID',
        textField: 'CountryCodeName',
        data: []
    },
    EthnicID: {
        label: 'HRM_Insurance_ChangeInsInfoRegister_People',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true,
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetMultiEthnicGroup',
            type: 'E_GET'
        },
        valueField: 'ID',
        textField: 'EthnicCodeName',
        data: []
    },
    tempPAddressID: {
        label: 'HRM_Insurance_ChangeInsInfoRegister_tempPAddress',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true,
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetAddressMulti',
            type: 'E_GET'
        },
        valueField: 'ID',
        textField: 'AddressVN',
        data: []
    },
    PProvinceID: {
        label: 'HRM_Insurance_InsuranceInfo_PProvinceID',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true,
        valueField: 'ID',
        textField: 'ProvinceName',
        data: []
    },
    PDistrictID: {
        label: 'HRM_Insurance_InsuranceInfo_PDistrictID',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true,
        valueField: 'ID',
        textField: 'DistrictName',
        data: []
    },
    PVillageID: {
        label: 'HRM_Insurance_InsuranceInfo_PVillageID',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true,
        valueField: 'ID',
        textField: 'VillageName',
        data: []
    },
    tempRAddress: {
        label: 'HRM_Insurance_ChangeInsInfoRegister_tempRAddress',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true,
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetAddressMulti',
            type: 'E_GET'
        },
        valueField: 'ID',
        textField: 'AddressVN',
        data: []
    },
    RProvinceID: {
        label: 'HRM_Insurance_ChangeInsInfoRegister_RProvinceName',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true,
        valueField: 'ID',
        textField: 'ProvinceName',
        data: []
    },
    RDistrictID: {
        label: 'HRM_Insurance_ChangeInsInfoRegister_RDistrictName',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true,
        valueField: 'ID',
        textField: 'DistrictName',
        data: []
    },
    RVillageID: {
        label: 'HRM_Insurance_ChangeInsInfoRegister_RVillageName',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true,
        valueField: 'ID',
        textField: 'VillageName',
        data: []
    },
    RAdress: {
        ID: null,
        label: 'HRM_Insurance_ChangeInsInfoRegister_RAddress',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    DocumentType: {
        label: 'HRM_Insurance_ChangeInsInfoRegister_DocumentType',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true,
        api: {
            urlApi: '[URI_SYS]/Sys_GetData/GetEnum?text=PersonalInfoToInput',
            type: 'E_GET'
        },
        valueField: 'Value',
        textField: 'Text',
        data: []
    },
    IDNo: {
        ID: null,
        label: 'HRM_Insurance_InsuranceInfo_IDNo',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    PhoneNumber: {
        ID: null,
        label: 'HRM_Insurance_InsuranceInfo_PhoneNumber',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    ChangeContent: {
        ID: null,
        label: 'HRM_Insurance_ChangeInsInfoRegister_ChangeContent',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    AttachedDocuments: {
        ID: null,
        label: 'HRM_Insurance_ChangeInsInfoRegister_AttachedDocuments',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    Is1TimeSocialInsPayment: {
        label: 'HRM_Insurance_ChangeInsInfoRegister_Is1TimeSocialInsPayment',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    IsUnEmploymentPayment: {
        label: 'HRM_Insurance_ChangeInsInfoRegister_IsUnEmploymentPayment',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    Status: {
        label: 'HRM_Attendance_Pregnancy_Status',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true,
        api: {
            urlApi: '[URI_SYS]/Sys_GetData/GetEnum?text=ChangeInsInfoRegister_Status',
            type: 'E_GET'
        },
        valueField: 'Value',
        textField: 'Text',
        data: []
    },
    Note: {
        ID: null,
        label: 'HRM_Insurance_ChangeInsInfoRegister_Note',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    FileAttach: {
        label: 'FileAttach',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    fieldValid: {}
};

export default class InsSubmitChangeInsInfoRegisterAddOrEdit extends Component {
    constructor(props) {
        super(props);

        this.state = initSateDefault;

        props.navigation.setParams({
            title:
                props.navigation.state.params && props.navigation.state.params.record
                    ? 'HRM_Insurance_Ins_ChangeInsInfoRegister_PopUp_Edit_Title'
                    : 'HRM_Insurance_Ins_ChangeInsInfoRegister_PopUp_Addnew_Title'
        });

        this.setVariable();
    }

    //#region [khởi tạo - lấy các dữ liệu cho control, lấy giá trị mặc đinh]

    setVariable = () => {
        this.isAllowToSave = null;
        this.isDataDuplicate = null;
        //biến trạng thái
        this.isModify = false;
        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;

        this.levelApproved = null;
        this.isOnlyOneLevelApprove = null;
    };

    refreshView = () => {
        this.props.navigation.setParams({ title: 'HRM_Insurance_Ins_ChangeInsInfoRegister_PopUp_Addnew_Title' });
        this.setVariable();
        this.setState(initSateDefault, () => {
            //get config validate
            VnrLoadingSevices.show();
            HttpService.Get('[URI_POR]/New_Home/GetFormConfig_Angular?formName=ChangeInsInfoRegisterForm').then(
                (res) => {
                    VnrLoadingSevices.hide();
                    if (res) {
                        try {
                            //map field hidden by config
                            const _configField =
                                ConfigField && ConfigField.value['InsSubmitChangeInsInfoRegister']
                                    ? ConfigField.value['InsSubmitChangeInsInfoRegister']['Hidden']
                                    : [];

                            let _fieldValid = {},
                                nextState = {};

                            res.filter((item) => {
                                return item.Validators.Required;
                            }).forEach((item) => {
                                _fieldValid[item.ControlName] = true;
                            });

                            nextState = { fieldValid: _fieldValid };

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

                                this.initData();
                            });
                        } catch (error) {
                            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                        }
                    }
                }
            );
        });
    };

    //promise get config valid
    getConfigValid = (tblName) => {
        return HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName);
    };

    componentDidMount() {
        //get config validate
        VnrLoadingSevices.show();
        HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=Ins_ChangeInsInfoRegister').then((res) => {
            VnrLoadingSevices.hide();
            if (res) {
                try {
                    //map field hidden by config
                    const _configField =
                        ConfigField && ConfigField.value['InsSubmitChangeInsInfoRegister']
                            ? ConfigField.value['InsSubmitChangeInsInfoRegister']['Hidden']
                            : [];

                    let nextState = { fieldValid: res };

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

                        let { record } = this.props.navigation.state.params;

                        if (record) {
                            this.isModify = true;
                            this.handleSetState(record);
                        } else {
                            this.initData();
                        }
                    });
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            }
        });
    }

    handleSetState = (item) => {
        const {
            ProfileID,
            RegisterType,
            DateSubmit,
            InsuranceCode,
            SocialInsIssueDate,
            SocialInsIssuePlace,
            SocialInsPlaceID,
            HealthInsNo,
            HealthInsIssueDate,
            HealthTreatmentPlaceID,
            FiveConsecutiveYearsFrom,
            ProfileName,
            DayOfBirth,
            Gender,
            NationalityID,
            EthnicID,
            tempPAddressID,
            PProvinceID,
            PDistrictID,
            PVillageID,
            tempRAddress,
            RProvinceID,
            RDistrictID,
            RVillageID,
            RAdress,
            DocumentType,
            IDNo,
            PhoneNumber,
            ChangeContent,
            AttachedDocuments,
            Is1TimeSocialInsPayment,
            IsUnEmploymentPayment,
            Status,
            Note,
            FileAttach
        } = this.state;

        let nextState = {};

        nextState = {
            record: item,
            ID: item.ID,
            ProfileID: {
                ...ProfileID,
                ID: item.ProfileID,
                ProfileName: item.ProfileName
            },
            RegisterType: {
                ...RegisterType,
                value: item.RegisterType
                    ? { Value: item.RegisterType, Text: translate('ChangeInsInfoRegister_Type__' + item.RegisterType) }
                    : null,
                refresh: !RegisterType.refresh
            },
            DateSubmit: {
                ...DateSubmit,
                value: item.DateSubmit,
                refresh: !DateSubmit.refresh
            },
            InsuranceCode: {
                ...InsuranceCode,
                value: item.InsuranceCode,
                refresh: !InsuranceCode.refresh
            },
            SocialInsIssueDate: {
                ...SocialInsIssueDate,
                value: item.SocialInsIssueDate,
                refresh: !SocialInsIssueDate.refresh
            },
            SocialInsIssuePlace: {
                ...SocialInsIssuePlace,
                value: item.SocialInsIssuePlace,
                refresh: !SocialInsIssuePlace.refresh
            },
            SocialInsPlaceID: {
                ...SocialInsPlaceID,
                value: item.SocialInsPlaceID
                    ? { ID: item.SocialInsPlaceID, ProvinceName: item.SocialInsPlaceName }
                    : null,
                refresh: !SocialInsPlaceID.refresh
            },
            HealthInsNo: {
                ...HealthInsNo,
                value: item.HealthInsNo,
                refresh: !HealthInsNo.refresh
            },
            HealthInsIssueDate: {
                ...HealthInsIssueDate,
                value: item.HealthInsIssueDate,
                refresh: !HealthInsIssueDate.refresh
            },
            HealthTreatmentPlaceID: {
                ...HealthTreatmentPlaceID,
                value: item.HealthTreatmentPlaceID
                    ? { ID: item.HealthTreatmentPlaceID, HealthTreatmentCodeName: item.HealthTreatmentCodeName }
                    : null,
                refresh: !HealthTreatmentPlaceID.refresh
            },
            FiveConsecutiveYearsFrom: {
                ...FiveConsecutiveYearsFrom,
                value: item.FiveConsecutiveYearsFrom,
                refresh: !FiveConsecutiveYearsFrom.refresh
            },
            ProfileName: {
                ...ProfileName,
                value: item.ProfileName,
                refresh: !ProfileName.refresh
            },
            DayOfBirth: {
                ...DayOfBirth,
                value: item.DayOfBirth,
                refresh: !DayOfBirth.refresh
            },
            Gender: {
                ...Gender,
                value: item.Gender ? { Value: item.Gender, Text: translate(item.Gender) } : null,
                refresh: !Gender.refresh
            },
            NationalityID: {
                ...NationalityID,
                value: item.NationalityID ? { ID: item.NationalityID, CountryCodeName: item.Nationality } : null,
                refresh: !NationalityID.refresh
            },
            EthnicID: {
                ...EthnicID,
                value: item.EthnicID ? { ID: item.EthnicID, EthnicCodeName: item.EthnicGroupName } : null,
                refresh: !EthnicID.refresh
            },
            tempPAddressID: {
                ...tempPAddressID,
                value: item.tempPAddressID,
                refresh: !tempPAddressID.refresh
            },
            PProvinceID: {
                ...PProvinceID,
                value: item.PProvinceID ? { ID: item.PProvinceID, ProvinceName: item.PProvinceName } : null,
                refresh: !PProvinceID.refresh
            },
            PDistrictID: {
                ...PDistrictID,
                value: item.PDistrictID ? { ID: item.PDistrictID, DistrictName: item.PDistrictName } : null,
                refresh: !PDistrictID.refresh
            },
            PVillageID: {
                ...PVillageID,
                value: item.PVillageID ? { ID: item.PVillageID, VillageName: item.PVillageName } : null,
                refresh: !PVillageID.refresh
            },
            tempRAddress: {
                ...tempRAddress,
                value: item.tempRAddress,
                refresh: !tempRAddress.refresh
            },
            RProvinceID: {
                ...RProvinceID,
                value: item.RProvinceID ? { ID: item.RProvinceID, ProvinceName: item.RProvinceName } : null,
                refresh: !RProvinceID.refresh
            },
            RDistrictID: {
                ...RDistrictID,
                value: item.RDistrictID ? { ID: item.RDistrictID, DistrictName: item.RDistrictName } : null,
                refresh: !RDistrictID.refresh
            },
            RVillageID: {
                ...RVillageID,
                value: item.RVillageID ? { ID: item.RVillageID, VillageName: item.RVillageName } : null,
                refresh: !RVillageID.refresh
            },
            RAdress: {
                ...RAdress,
                value: item.RAdress,
                refresh: !RAdress.refresh
            },
            DocumentType: {
                ...DocumentType,
                value: item.DocumentType
                    ? { Value: item.DocumentType, Text: translate('PersonalInfoToInputv2__' + item.DocumentType) }
                    : null,
                refresh: !DocumentType.refresh
            },
            IDNo: {
                ...IDNo,
                value: item.IDNo,
                refresh: !IDNo.refresh
            },
            PhoneNumber: {
                ...PhoneNumber,
                value: item.PhoneNumber,
                refresh: !PhoneNumber.refresh
            },
            ChangeContent: {
                ...ChangeContent,
                value: item.ChangeContent,
                refresh: !ChangeContent.refresh
            },
            AttachedDocuments: {
                ...AttachedDocuments,
                value: item.AttachedDocuments,
                refresh: !AttachedDocuments.refresh
            },
            Is1TimeSocialInsPayment: {
                ...Is1TimeSocialInsPayment,
                value: item.Is1TimeSocialInsPayment,
                refresh: !Is1TimeSocialInsPayment.refresh
            },
            IsUnEmploymentPayment: {
                ...IsUnEmploymentPayment,
                value: item.IsUnEmploymentPayment,
                refresh: !IsUnEmploymentPayment.refresh
            },
            Status: {
                ...Status,
                value: item.Status,
                refresh: !Status.refresh
            },
            Note: {
                ...Note,
                value: item.Note,
                refresh: !Note.refresh
            },
            FileAttach: {
                ...FileAttach,
                value: item.lstFileAttach,
                refresh: !FileAttach.refresh
            }
        };

        this.setState(nextState, () => this.eventLoad(false));
    };

    initData = () => {
        const { E_ProfileID, E_FullName } = enumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] },
            { ProfileID } = this.state;

        let nextState = {
            ProfileID: {
                ...ProfileID,
                ..._profile
            }
        };

        this.setState(nextState, () => {
            const { PProvinceID, RProvinceID } = this.state;
            HttpService.Post('[URI_HR]/Cat_GetData/GetMultiProvinceCodeName').then(
                (data) => {
                    if (data) {
                        this.setState({
                            PProvinceID: {
                                ...PProvinceID,
                                data,
                                refresh: !PProvinceID.refresh
                            },
                            RProvinceID: {
                                ...RProvinceID,
                                data,
                                refresh: !RProvinceID.refresh
                            }
                        });
                    }
                },
                () => this.eventLoad(true)
            );
        });
    };
    //#endregion

    onSave = (navigation, isCreate, isSend) => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        const {
            ID,
            ProfileID,
            RegisterType,
            DateSubmit,
            InsuranceCode,
            SocialInsIssueDate,
            SocialInsIssuePlace,
            SocialInsPlaceID,
            HealthInsNo,
            HealthInsIssueDate,
            HealthTreatmentPlaceID,
            FiveConsecutiveYearsFrom,
            ProfileName,
            DayOfBirth,
            Gender,
            NationalityID,
            EthnicID,
            tempPAddressID,
            PProvinceID,
            PDistrictID,
            PVillageID,
            tempRAddress,
            RProvinceID,
            RDistrictID,
            RVillageID,
            RAdress,
            DocumentType,
            IDNo,
            PhoneNumber,
            ChangeContent,
            AttachedDocuments,
            Is1TimeSocialInsPayment,
            IsUnEmploymentPayment,
            Note,
            FileAttach
        } = this.state;

        let regisType = RegisterType.value ? RegisterType.value.Value : null,
            param = {
                ID,
                IsRegisterTypeCreate: regisType == 'E_CREATE' ? true : false,
                ProfileID: ProfileID.ID,
                RegisterType: RegisterType.value ? RegisterType.value.Value : null,
                DateSubmit: DateSubmit.value ? moment(DateSubmit.value).format('YYYY-MM-DD HH:mm:ss') : null,
                InsuranceCode: InsuranceCode.value,
                SocialInsIssueDate: SocialInsIssueDate.value
                    ? moment(SocialInsIssueDate.value).format('YYYY-MM-DD HH:mm:ss')
                    : null,
                SocialInsIssuePlace: SocialInsIssuePlace.value,
                SocialInsPlaceID: SocialInsPlaceID.value ? SocialInsPlaceID.value.ID : null,
                HealthInsNo: HealthInsNo.value,
                HealthInsIssueDate: HealthInsIssueDate.value
                    ? moment(HealthInsIssueDate.value).format('YYYY-MM-DD HH:mm:ss')
                    : null,
                HealthTreatmentPlaceID: HealthTreatmentPlaceID.value ? HealthTreatmentPlaceID.value.ID : null,
                FiveConsecutiveYearsFrom: FiveConsecutiveYearsFrom.value
                    ? moment(FiveConsecutiveYearsFrom.value).format('YYYY-MM-DD HH:mm:ss')
                    : null,
                ProfileName: ProfileName.value,
                DayOfBirth: DayOfBirth.value ? moment(DayOfBirth.value).format('YYYY-MM-DD HH:mm:ss') : null,
                Gender: Gender.value ? Gender.value.Value : null,
                NationalityID: NationalityID.value ? NationalityID.value.ID : null,
                EthnicID: EthnicID.value ? EthnicID.value.ID : null,
                tempPAddressID: tempPAddressID.value,
                PProvinceID: PProvinceID.value ? PProvinceID.value.ID : null,
                PDistrictID: PDistrictID.value ? PDistrictID.value.ID : null,
                PVillageID: PVillageID.value ? PVillageID.value.ID : null,
                tempRAddress: tempRAddress.value,
                RProvinceID: RProvinceID.value ? RProvinceID.value.ID : null,
                RDistrictID: RDistrictID.value ? RDistrictID.value.ID : null,
                RVillageID: RVillageID.value ? RVillageID.value.ID : null,
                RAdress: RAdress.value,
                DocumentType: DocumentType.value ? DocumentType.value.Value : null,
                IDNo: IDNo.value,
                PhoneNumber: PhoneNumber.value,
                ChangeContent: ChangeContent.value,
                AttachedDocuments: AttachedDocuments.value,
                Is1TimeSocialInsPayment: Is1TimeSocialInsPayment.value,
                IsUnEmploymentPayment: IsUnEmploymentPayment.value,
                Status: 'E_NOTTRANSFERRED',
                UserSubmitID: ProfileID.ID,
                IsPortalApp: true,
                Note: Note.value,
                FileAttach: FileAttach.value ? FileAttach.value.map((item) => item.fileName).join(',') : null
            };

        if (ID) {
            param = {
                ...param,
                ID
            };
        }

        if (isSend) {
            param = {
                ...param,
                isSendMail: true
            };
        }

        if (this.isAllowToSave == 'DuplicateData' && this.isDataDuplicate != null) {
            let temp = this.isDataDuplicate;

            if (temp.includes('[{0}]')) {
                temp = temp.replace('[{0}]', '');
            }

            ToasterSevice.showWarning(temp);
        } else if (this.isAllowToSave == 'HaveData') {
            ToasterSevice.showWarning('Ins_ChangeInsInfoRegister_HaveDataMess');
        } else if (this.isAllowToSave == 'DontHaveData') {
            ToasterSevice.showWarning('Ins_ChangeInsInfoRegister_DontHaveDataMess');
        } else {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/api/Ins_ChangeInsInfoRegister', param).then((data) => {
                VnrLoadingSevices.hide();

                //xử lý lại event Save
                this.isProcessing = false;

                if (data) {
                    if (data.ActionStatus == 'Success') {
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);

                        if (isCreate) {
                            this.refreshView();
                        } else {
                            navigation.goBack();
                        }

                        const { reload } = this.props.navigation.state.params;
                        if (reload && typeof reload == 'function') {
                            reload();
                        }
                    } else {
                        ToasterSevice.showWarning(data.ActionStatus);
                    }
                }
            });
        }
    };

    onSaveAndCreate = (navigation) => {
        this.onSave(navigation, true, null);
    };

    render() {
        const {
                RegisterType,
                DateSubmit,
                InsuranceCode,
                SocialInsIssueDate,
                SocialInsIssuePlace,
                SocialInsPlaceID,
                HealthInsNo,
                HealthInsIssueDate,
                HealthTreatmentPlaceID,
                FiveConsecutiveYearsFrom,
                ProfileName,
                DayOfBirth,
                Gender,
                NationalityID,
                EthnicID,
                tempPAddressID,
                PProvinceID,
                PDistrictID,
                PVillageID,
                tempRAddress,
                RProvinceID,
                RDistrictID,
                RVillageID,
                RAdress,
                DocumentType,
                IDNo,
                PhoneNumber,
                ChangeContent,
                AttachedDocuments,
                Is1TimeSocialInsPayment,
                IsUnEmploymentPayment,
                Status,
                Note,
                FileAttach,
                fieldValid
            } = this.state,
            { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;

        //#region [Xử lý 3 nút lưu]
        const listActions = [];

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_PlanOvertime_btnSave'] &&
            PermissionForAppMobile.value['New_Att_PlanOvertime_btnSave']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_CLOSE,
                title: translate('HRM_Common_SaveClose'),
                onPress: () => this.onSave(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_PlanOvertime_btnSaveNew'] &&
            PermissionForAppMobile.value['New_Att_PlanOvertime_btnSaveNew']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_NEW,
                title: translate('HRM_Common_SaveNew'),
                onPress: () => this.onSaveAndCreate(this.props.navigation)
            });
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                    >
                        {/*  - RegisterType */}
                        {RegisterType.visibleConfig && RegisterType.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={RegisterType.label} />

                                    {/* valid  */}
                                    {fieldValid.RegisterType && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={RegisterType.api}
                                        textField={RegisterType.textField}
                                        valueField={RegisterType.valueField}
                                        refresh={RegisterType.refresh}
                                        filter={true}
                                        value={RegisterType.value}
                                        filterServer={RegisterType.filterServer}
                                        filterParams={RegisterType.filterParam}
                                        disable={RegisterType.disable}
                                        onFinish={(item) =>
                                            this.setState(
                                                {
                                                    RegisterType: {
                                                        ...RegisterType,
                                                        value: item,
                                                        refresh: !RegisterType.refresh
                                                    }
                                                },
                                                () => this.eventLoad(true)
                                            )
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - DateSubmit */}
                        {DateSubmit.visible && DateSubmit.visibleConfig && (
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
                                        onFinish={(value) =>
                                            this.setState({
                                                DateSubmit: {
                                                    ...DateSubmit,
                                                    value,
                                                    refresh: !DateSubmit.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - InsuranceCode*/}
                        {InsuranceCode.visibleConfig && InsuranceCode.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={InsuranceCode.label} />
                                    {fieldValid.InsuranceCode && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={InsuranceCode.disable}
                                        refresh={InsuranceCode.refresh}
                                        value={InsuranceCode.value}
                                        onChangeText={(text) =>
                                            this.setState({
                                                InsuranceCode: {
                                                    ...InsuranceCode,
                                                    value: text,
                                                    refresh: !InsuranceCode.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - SocialInsIssueDate */}
                        {SocialInsIssueDate.visible && SocialInsIssueDate.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={SocialInsIssueDate.label}
                                    />

                                    {/* valid SocialInsIssueDate */}
                                    {fieldValid.SocialInsIssueDate && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        disable={SocialInsIssueDate.disable}
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={SocialInsIssueDate.value}
                                        refresh={SocialInsIssueDate.refresh}
                                        type={'date'}
                                        onFinish={(value) =>
                                            this.setState({
                                                SocialInsIssueDate: {
                                                    ...SocialInsIssueDate,
                                                    value,
                                                    refresh: !SocialInsIssueDate.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - SocialInsIssuePlace*/}
                        {SocialInsIssuePlace.visibleConfig && SocialInsIssuePlace.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={SocialInsIssuePlace.label}
                                    />
                                    {fieldValid.SocialInsIssuePlace && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={SocialInsIssuePlace.disable}
                                        refresh={SocialInsIssuePlace.refresh}
                                        value={SocialInsIssuePlace.value}
                                        onChangeText={(text) =>
                                            this.setState({
                                                SocialInsIssuePlace: {
                                                    ...SocialInsIssuePlace,
                                                    value: text,
                                                    refresh: !SocialInsIssuePlace.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - SocialInsPlaceID */}
                        {SocialInsPlaceID.visibleConfig && SocialInsPlaceID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={SocialInsPlaceID.label}
                                    />

                                    {/* valid  */}
                                    {fieldValid.SocialInsPlaceID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={SocialInsPlaceID.api}
                                        textField={SocialInsPlaceID.textField}
                                        valueField={SocialInsPlaceID.valueField}
                                        refresh={SocialInsPlaceID.refresh}
                                        filter={true}
                                        value={SocialInsPlaceID.value}
                                        filterServer={SocialInsPlaceID.filterServer}
                                        filterParams={SocialInsPlaceID.filterParam}
                                        disable={SocialInsPlaceID.disable}
                                        onFinish={(item) =>
                                            this.setState({
                                                SocialInsPlaceID: {
                                                    ...SocialInsPlaceID,
                                                    value: item,
                                                    refresh: !SocialInsPlaceID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - HealthInsNo*/}
                        {HealthInsNo.visibleConfig && HealthInsNo.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={HealthInsNo.label} />
                                    {fieldValid.HealthInsNo && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={HealthInsNo.disable}
                                        refresh={HealthInsNo.refresh}
                                        value={HealthInsNo.value}
                                        onChangeText={(text) =>
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

                        {/*  - HealthInsIssueDate */}
                        {HealthInsIssueDate.visible && HealthInsIssueDate.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={HealthInsIssueDate.label}
                                    />

                                    {/* valid HealthInsIssueDate */}
                                    {fieldValid.HealthInsIssueDate && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        disable={HealthInsIssueDate.disable}
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={HealthInsIssueDate.value}
                                        refresh={HealthInsIssueDate.refresh}
                                        type={'date'}
                                        onFinish={(value) =>
                                            this.setState({
                                                HealthInsIssueDate: {
                                                    ...HealthInsIssueDate,
                                                    value,
                                                    refresh: !HealthInsIssueDate.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - HealthTreatmentPlaceID */}
                        {HealthTreatmentPlaceID.visibleConfig && HealthTreatmentPlaceID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={HealthTreatmentPlaceID.label}
                                    />

                                    {/* valid  */}
                                    {fieldValid.HealthTreatmentPlaceID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={HealthTreatmentPlaceID.api}
                                        textField={HealthTreatmentPlaceID.textField}
                                        valueField={HealthTreatmentPlaceID.valueField}
                                        refresh={HealthTreatmentPlaceID.refresh}
                                        filter={true}
                                        value={HealthTreatmentPlaceID.value}
                                        filterServer={true}
                                        filterParams={'text'}
                                        disable={HealthTreatmentPlaceID.disable}
                                        onFinish={(item) =>
                                            this.setState({
                                                HealthTreatmentPlaceID: {
                                                    ...HealthTreatmentPlaceID,
                                                    value: item,
                                                    refresh: !HealthTreatmentPlaceID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - FiveConsecutiveYearsFrom */}
                        {FiveConsecutiveYearsFrom.visible && FiveConsecutiveYearsFrom.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={FiveConsecutiveYearsFrom.label}
                                    />

                                    {/* valid FiveConsecutiveYearsFrom */}
                                    {fieldValid.FiveConsecutiveYearsFrom && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        disable={FiveConsecutiveYearsFrom.disable}
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={FiveConsecutiveYearsFrom.value}
                                        refresh={FiveConsecutiveYearsFrom.refresh}
                                        type={'date'}
                                        onFinish={(value) =>
                                            this.setState({
                                                FiveConsecutiveYearsFrom: {
                                                    ...FiveConsecutiveYearsFrom,
                                                    value,
                                                    refresh: !FiveConsecutiveYearsFrom.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - ProfileName*/}
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
                                        onChangeText={(text) =>
                                            this.setState({
                                                ProfileName: {
                                                    ...ProfileName,
                                                    value: text,
                                                    refresh: !ProfileName.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - DayOfBirth */}
                        {DayOfBirth.visible && DayOfBirth.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DayOfBirth.label} />

                                    {/* valid  */}
                                    {fieldValid.DayOfBirth && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        disable={DayOfBirth.disable}
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={DayOfBirth.value}
                                        refresh={DayOfBirth.refresh}
                                        type={'date'}
                                        onFinish={(value) =>
                                            this.setState({
                                                DayOfBirth: {
                                                    ...DayOfBirth,
                                                    value,
                                                    refresh: !DayOfBirth.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - Gender */}
                        {Gender.visibleConfig && Gender.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Gender.label} />

                                    {/* valid  */}
                                    {fieldValid.Gender && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={Gender.api}
                                        textField={Gender.textField}
                                        valueField={Gender.valueField}
                                        refresh={Gender.refresh}
                                        filter={true}
                                        value={Gender.value}
                                        filterServer={Gender.filterServer}
                                        filterParams={Gender.filterParam}
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

                        {/*  - NationalityID */}
                        {NationalityID.visibleConfig && NationalityID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={NationalityID.label} />

                                    {/* valid  */}
                                    {fieldValid.NationalityID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={NationalityID.api}
                                        textField={NationalityID.textField}
                                        valueField={NationalityID.valueField}
                                        refresh={NationalityID.refresh}
                                        filter={true}
                                        value={NationalityID.value}
                                        filterServer={NationalityID.filterServer}
                                        filterParams={NationalityID.filterParam}
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

                        {/*  - EthnicID */}
                        {EthnicID.visibleConfig && EthnicID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={EthnicID.label} />

                                    {/* valid  */}
                                    {fieldValid.EthnicID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={EthnicID.api}
                                        textField={EthnicID.textField}
                                        valueField={EthnicID.valueField}
                                        refresh={EthnicID.refresh}
                                        filter={true}
                                        value={EthnicID.value}
                                        filterServer={EthnicID.filterServer}
                                        filterParams={EthnicID.filterParam}
                                        disable={EthnicID.disable}
                                        onFinish={(item) =>
                                            this.setState({
                                                EthnicID: {
                                                    ...EthnicID,
                                                    value: item,
                                                    refresh: !EthnicID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - tempPAddressID */}
                        {tempPAddressID.visibleConfig && tempPAddressID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={tempPAddressID.label} />

                                    {/* valid  */}
                                    {fieldValid.tempPAddressID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={tempPAddressID.api}
                                        textField={tempPAddressID.textField}
                                        valueField={tempPAddressID.valueField}
                                        refresh={tempPAddressID.refresh}
                                        filter={true}
                                        value={tempPAddressID.value}
                                        filterServer={tempPAddressID.filterServer}
                                        filterParams={tempPAddressID.filterParam}
                                        disable={tempPAddressID.disable}
                                        onFinish={(item) =>
                                            this.setState(
                                                {
                                                    tempPAddressID: {
                                                        ...tempPAddressID,
                                                        value: item,
                                                        refresh: !tempPAddressID.refresh
                                                    }
                                                },
                                                () => this.ChangetempPAddress(item)
                                            )
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - PProvinceID */}
                        {PProvinceID.visibleConfig && PProvinceID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PProvinceID.label} />

                                    {/* valid  */}
                                    {fieldValid.PProvinceID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={PProvinceID.data}
                                        textField={PProvinceID.textField}
                                        valueField={PProvinceID.valueField}
                                        refresh={PProvinceID.refresh}
                                        filter={true}
                                        value={PProvinceID.value}
                                        filterServer={PProvinceID.filterServer}
                                        filterParams={PProvinceID.filterParam}
                                        disable={PProvinceID.disable}
                                        onFinish={(item) =>
                                            this.setState(
                                                {
                                                    PProvinceID: {
                                                        ...PProvinceID,
                                                        value: item,
                                                        refresh: !PProvinceID.refresh
                                                    }
                                                },
                                                () => this.GetPDistrictID(item)
                                            )
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - PDistrictID */}
                        {PDistrictID.visibleConfig && PDistrictID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PDistrictID.label} />

                                    {/* valid  */}
                                    {fieldValid.PDistrictID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={PDistrictID.data}
                                        textField={PDistrictID.textField}
                                        valueField={PDistrictID.valueField}
                                        refresh={PDistrictID.refresh}
                                        filter={true}
                                        value={PDistrictID.value}
                                        filterServer={PDistrictID.filterServer}
                                        filterParams={PDistrictID.filterParam}
                                        disable={PVillageID.disable}
                                        onFinish={(item) =>
                                            this.setState(
                                                {
                                                    PDistrictID: {
                                                        ...PDistrictID,
                                                        value: item,
                                                        refresh: !PDistrictID.refresh
                                                    }
                                                },
                                                () => this.GetPVillageID(item)
                                            )
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - PVillageID */}
                        {PVillageID.visibleConfig && PVillageID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PVillageID.label} />

                                    {/* valid  */}
                                    {fieldValid.PVillageID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={PVillageID.data}
                                        textField={PVillageID.textField}
                                        valueField={PVillageID.valueField}
                                        refresh={PVillageID.refresh}
                                        filter={true}
                                        value={PVillageID.value}
                                        filterServer={PVillageID.filterServer}
                                        filterParams={PVillageID.filterParam}
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

                        {/*  - tempRAddress */}
                        {tempRAddress.visibleConfig && tempRAddress.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={tempRAddress.label} />

                                    {/* valid  */}
                                    {fieldValid.tempRAddress && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={tempRAddress.api}
                                        textField={tempRAddress.textField}
                                        valueField={tempRAddress.valueField}
                                        refresh={tempRAddress.refresh}
                                        filter={true}
                                        value={tempRAddress.value}
                                        filterServer={tempRAddress.filterServer}
                                        filterParams={tempRAddress.filterParam}
                                        disable={tempRAddress.disable}
                                        onFinish={(item) =>
                                            this.setState(
                                                {
                                                    tempRAddress: {
                                                        ...tempRAddress,
                                                        value: item,
                                                        refresh: !tempRAddress.refresh
                                                    }
                                                },
                                                () => this.ChangetempRAddress(item)
                                            )
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - RProvinceID */}
                        {RProvinceID.visibleConfig && RProvinceID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={RProvinceID.label} />

                                    {/* valid  */}
                                    {fieldValid.RProvinceID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={RProvinceID.data}
                                        textField={RProvinceID.textField}
                                        valueField={RProvinceID.valueField}
                                        refresh={RProvinceID.refresh}
                                        filter={true}
                                        value={RProvinceID.value}
                                        filterServer={RProvinceID.filterServer}
                                        filterParams={RProvinceID.filterParam}
                                        disable={RProvinceID.disable}
                                        onFinish={(item) =>
                                            this.setState(
                                                {
                                                    RProvinceID: {
                                                        ...RProvinceID,
                                                        value: item,
                                                        refresh: !RProvinceID.refresh
                                                    }
                                                },
                                                () => this.GetRDistrictID(item)
                                            )
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - RDistrictID */}
                        {RDistrictID.visibleConfig && RDistrictID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={RDistrictID.label} />

                                    {/* valid  */}
                                    {fieldValid.RDistrictID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={RDistrictID.data}
                                        textField={RDistrictID.textField}
                                        valueField={RDistrictID.valueField}
                                        refresh={RDistrictID.refresh}
                                        filter={true}
                                        value={RDistrictID.value}
                                        filterServer={RDistrictID.filterServer}
                                        filterParams={RDistrictID.filterParam}
                                        disable={RDistrictID.disable}
                                        onFinish={(item) =>
                                            this.setState(
                                                {
                                                    RDistrictID: {
                                                        ...RDistrictID,
                                                        value: item,
                                                        refresh: !RDistrictID.refresh
                                                    }
                                                },
                                                () => this.GetRVillageID(item)
                                            )
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - RVillageID */}
                        {RVillageID.visibleConfig && RVillageID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={RVillageID.label} />

                                    {/* valid  */}
                                    {fieldValid.RVillageID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={RVillageID.data}
                                        textField={RVillageID.textField}
                                        valueField={RVillageID.valueField}
                                        refresh={RVillageID.refresh}
                                        filter={true}
                                        value={RVillageID.value}
                                        filterServer={RVillageID.filterServer}
                                        filterParams={RVillageID.filterParam}
                                        disable={RVillageID.disable}
                                        onFinish={(item) =>
                                            this.setState({
                                                RVillageID: {
                                                    ...RVillageID,
                                                    value: item,
                                                    refresh: !RVillageID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - RAdress*/}
                        {RAdress.visibleConfig && RAdress.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={RAdress.label} />
                                    {fieldValid.RAdress && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={RAdress.disable}
                                        refresh={RAdress.refresh}
                                        value={RAdress.value}
                                        onChangeText={(text) =>
                                            this.setState({
                                                RAdress: {
                                                    ...RAdress,
                                                    value: text,
                                                    refresh: !RAdress.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - DocumentType */}
                        {DocumentType.visibleConfig && DocumentType.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DocumentType.label} />

                                    {/* valid  */}
                                    {fieldValid.DocumentType && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={DocumentType.api}
                                        textField={DocumentType.textField}
                                        valueField={DocumentType.valueField}
                                        refresh={DocumentType.refresh}
                                        filter={true}
                                        value={DocumentType.value}
                                        filterServer={DocumentType.filterServer}
                                        filterParams={DocumentType.filterParam}
                                        disable={DocumentType.disable}
                                        onFinish={(item) =>
                                            this.setState({
                                                DocumentType: {
                                                    ...DocumentType,
                                                    value: item,
                                                    refresh: !DocumentType.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - IDNo */}
                        {IDNo.visibleConfig && IDNo.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={IDNo.label} />

                                    {/* valid IDNo */}
                                    {fieldValid.IDNo && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={IDNo.disable}
                                        refresh={IDNo.refresh}
                                        value={IDNo.value}
                                        onChangeText={(text) =>
                                            this.setState({
                                                IDNo: {
                                                    ...IDNo,
                                                    value: text,
                                                    refresh: !IDNo.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - PhoneNumber*/}
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
                                        onChangeText={(text) =>
                                            this.setState({
                                                PhoneNumber: {
                                                    ...PhoneNumber,
                                                    value: text,
                                                    refresh: !PhoneNumber.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - ChangeContent*/}
                        {ChangeContent.visibleConfig && ChangeContent.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={ChangeContent.label} />
                                    {fieldValid.ChangeContent && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={ChangeContent.disable}
                                        refresh={ChangeContent.refresh}
                                        value={ChangeContent.value}
                                        onChangeText={(text) =>
                                            this.setState({
                                                ChangeContent: {
                                                    ...ChangeContent,
                                                    value: text,
                                                    refresh: !ChangeContent.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - AttachedDocuments*/}
                        {AttachedDocuments.visibleConfig && AttachedDocuments.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={AttachedDocuments.label}
                                    />
                                    {fieldValid.AttachedDocuments && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={AttachedDocuments.disable}
                                        refresh={AttachedDocuments.refresh}
                                        value={AttachedDocuments.value}
                                        onChangeText={(text) =>
                                            this.setState({
                                                AttachedDocuments: {
                                                    ...AttachedDocuments,
                                                    value: text,
                                                    refresh: !AttachedDocuments.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - Is1TimeSocialInsPayment */}
                        {Is1TimeSocialInsPayment.visibleConfig && Is1TimeSocialInsPayment.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={Is1TimeSocialInsPayment.label}
                                    />

                                    {/* valid Is1TimeSocialInsPayment */}
                                    {fieldValid.Is1TimeSocialInsPayment && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <CheckBox
                                        isChecked={Is1TimeSocialInsPayment.value}
                                        disable={Is1TimeSocialInsPayment.disable}
                                        onClick={() =>
                                            this.setState({
                                                Is1TimeSocialInsPayment: {
                                                    ...Is1TimeSocialInsPayment,
                                                    value: !Is1TimeSocialInsPayment.value,
                                                    refresh: !Is1TimeSocialInsPayment.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - IsUnEmploymentPayment */}
                        {IsUnEmploymentPayment.visibleConfig && IsUnEmploymentPayment.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={IsUnEmploymentPayment.label}
                                    />

                                    {/* valid IsUnEmploymentPayment */}
                                    {fieldValid.IsUnEmploymentPayment && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <CheckBox
                                        isChecked={IsUnEmploymentPayment.value}
                                        disable={IsUnEmploymentPayment.disable}
                                        onClick={() =>
                                            this.setState({
                                                IsUnEmploymentPayment: {
                                                    ...IsUnEmploymentPayment,
                                                    value: !IsUnEmploymentPayment.value,
                                                    refresh: !IsUnEmploymentPayment.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - Status */}
                        {false && Status.visibleConfig && Status.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Status.label} />

                                    {/* valid Status */}
                                    {fieldValid.Status && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={Status.api}
                                        textField={Status.textField}
                                        valueField={Status.valueField}
                                        refresh={Status.refresh}
                                        filter={true}
                                        value={Status.value}
                                        filterServer={Status.filterServer}
                                        filterParams={Status.filterParam}
                                        disable={Status.disable}
                                        onFinish={(item) =>
                                            this.setState({
                                                Status: {
                                                    ...Status,
                                                    value: item,
                                                    refresh: !Status.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/*  - Note*/}
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
                                        onChangeText={(text) =>
                                            this.setState({
                                                Note: {
                                                    ...Note,
                                                    value: text,
                                                    refresh: !Note.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* File đính kèm - FileAttach */}
                        {FileAttach.visible && FileAttach.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={FileAttach.label} />
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
                                                    value: file
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}
                    </KeyboardAwareScrollView>

                    <ListButtonSave listActions={listActions} />
                </View>
            </SafeAreaView>
        );
    }

    GetPDistrictID = (item) => {
        const { PDistrictID, PVillageID } = this.state;

        if (item && item.ID) {
            HttpService.Post('[URI_HR]/Cat_GetData/GetDistrictCascading', { province: item.ID }).then((res) => {
                if (res) {
                    this.setState({
                        PDistrictID: {
                            ...PDistrictID,
                            data: res.map((item) => {
                                return {
                                    ...item,
                                    DistrictName: item.DistrictCodeName
                                };
                            }),
                            value: null,
                            refresh: !PDistrictID.refresh
                        },
                        PVillageID: {
                            ...PVillageID,
                            data: [],
                            value: null,
                            refresh: PVillageID.refresh
                        }
                    });
                }
            });
        } else {
            this.setState({
                PDistrictID: {
                    ...PDistrictID,
                    data: [],
                    value: null,
                    refresh: PDistrictID.refresh
                },
                PVillageID: {
                    ...PVillageID,
                    data: [],
                    value: null,
                    refresh: PVillageID.refresh
                }
            });
        }
    };

    GetPVillageID = (item) => {
        const { PVillageID } = this.state;

        if (item && item.ID) {
            HttpService.Post('[URI_HR]/Cat_GetData/GetVillageCascading', { districtid: item.ID }).then((res) => {
                if (res) {
                    this.setState({
                        PVillageID: {
                            ...PVillageID,
                            data: res.map((item) => {
                                return {
                                    ...item,
                                    VillageName: item.VillageCodeName
                                };
                            }),
                            value: null,
                            refresh: !PVillageID.refresh
                        }
                    });
                }
            });
        } else {
            this.setState({
                PVillageID: {
                    ...PVillageID,
                    data: [],
                    value: null,
                    refresh: PVillageID.refresh
                }
            });
        }
    };

    GetRDistrictID = (item) => {
        const { RDistrictID, RVillageID } = this.state;

        if (item && item.ID) {
            HttpService.Post('[URI_HR]/Cat_GetData/GetDistrictCascading', { province: item.ID }).then((res) => {
                if (res) {
                    this.setState({
                        RDistrictID: {
                            ...RDistrictID,
                            data: res.map((item) => {
                                return {
                                    ...item,
                                    DistrictName: item.DistrictCodeName
                                };
                            }),
                            value: null,
                            refresh: !RDistrictID.refresh
                        },
                        RVillageID: {
                            ...RVillageID,
                            data: [],
                            value: null,
                            refresh: RVillageID.refresh
                        }
                    });
                }
            });
        } else {
            this.setState({
                RDistrictID: {
                    ...RDistrictID,
                    data: [],
                    value: null,
                    refresh: RDistrictID.refresh
                },
                RVillageID: {
                    ...RVillageID,
                    data: [],
                    value: null,
                    refresh: RVillageID.refresh
                }
            });
        }
    };

    GetRVillageID = (item) => {
        const { RVillageID } = this.state;

        if (item && item.ID) {
            HttpService.Post('[URI_HR]/Cat_GetData/GetVillageCascading', { districtid: item.ID }).then((res) => {
                if (res) {
                    this.setState({
                        RVillageID: {
                            ...RVillageID,
                            data: res.map((item) => {
                                return {
                                    ...item,
                                    VillageName: item.VillageCodeName
                                };
                            }),
                            value: null,
                            refresh: !RVillageID.refresh
                        }
                    });
                }
            });
        } else {
            this.setState({
                RVillageID: {
                    ...RVillageID,
                    data: [],
                    value: null,
                    refresh: RVillageID.refresh
                }
            });
        }
    };

    eventLoad = (isCheck) => {
        const {
            ProfileID,
            RegisterType,
            ChangeContent,
            AttachedDocuments,
            Is1TimeSocialInsPayment,
            IsUnEmploymentPayment
        } = this.state;
        let profileID = ProfileID.ID,
            regisType = RegisterType.value ? RegisterType.value.Value : null,
            regisTypeText = RegisterType.value ? RegisterType.value.Text : null,
            nextState = {};

        if (regisType == 'E_CREATE') {
            nextState = {
                ChangeContent: {
                    ...ChangeContent,
                    visible: false,
                    value: null,
                    refresh: !ChangeContent.refresh
                },
                AttachedDocuments: {
                    ...AttachedDocuments,
                    visible: false,
                    value: null,
                    refresh: !AttachedDocuments.refresh
                },
                Is1TimeSocialInsPayment: {
                    ...Is1TimeSocialInsPayment,
                    visible: false,
                    value: false,
                    refresh: !Is1TimeSocialInsPayment.refresh
                },
                IsUnEmploymentPayment: {
                    ...IsUnEmploymentPayment,
                    visible: false,
                    value: false,
                    refresh: !IsUnEmploymentPayment.refresh
                }
            };
        } else {
            nextState = {
                ChangeContent: {
                    ...ChangeContent,
                    visible: true,
                    refresh: !ChangeContent.refresh
                },
                AttachedDocuments: {
                    ...AttachedDocuments,
                    visible: true,
                    refresh: !AttachedDocuments.refresh
                },
                Is1TimeSocialInsPayment: {
                    ...Is1TimeSocialInsPayment,
                    visible: true,
                    refresh: !Is1TimeSocialInsPayment.refresh
                },
                IsUnEmploymentPayment: {
                    ...IsUnEmploymentPayment,
                    visible: true,
                    refresh: !IsUnEmploymentPayment.refresh
                }
            };
        }

        this.setState(nextState, () => {
            if (isCheck) {
                if (!profileID || !regisType) {
                    return;
                }

                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Ins_GetData/ReloadChangeInsInfoRegisByProfileID', {
                    profileID: profileID,
                    regisType: regisType
                }).then((data) => {
                    VnrLoadingSevices.hide();

                    if (data) {
                        if (data.status == 'DuplicateData') {
                            this.isAllowToSave = 'DuplicateData';

                            let temp =
                                '[' +
                                data.result.ProfileName +
                                '-' +
                                data.result.CodeEmp +
                                '],[' +
                                regisTypeText +
                                '] ' +
                                translate('FieldDuplicate');
                            this.isDataDuplicate = temp;

                            if (temp.includes('[{0}]')) {
                                temp = temp.replace('[{0}]', '');
                            }

                            ToasterSevice.showWarning(temp);
                        } else if (data.status == 'HaveData') {
                            this.isAllowToSave = 'HaveData';
                            ToasterSevice.showWarning('Ins_ChangeInsInfoRegister_HaveDataMess');
                        } else if (data.status == 'DontHaveData') {
                            this.isAllowToSave = 'DontHaveData';
                            ToasterSevice.showWarning('Ins_ChangeInsInfoRegister_DontHaveDataMess');
                        } else {
                            this.isAllowToSave = '';
                            this.isDataDuplicate = null;
                            const {
                                    InsuranceCode,
                                    ProfileName,
                                    DayOfBirth,
                                    Gender,
                                    NationalityID,
                                    EthnicID,
                                    PProvinceID,
                                    PDistrictID,
                                    PVillageID,
                                    RProvinceID,
                                    RDistrictID,
                                    RVillageID,
                                    RAdress,
                                    IDNo,
                                    PhoneNumber,
                                    HealthTreatmentPlaceID,
                                    DocumentType,
                                    SocialInsIssueDate,
                                    SocialInsIssuePlace,
                                    SocialInsPlaceID,
                                    HealthInsNo,
                                    HealthInsIssueDate,
                                    FiveConsecutiveYearsFrom
                                } = this.state,
                                item = data.result;

                            this.setState(
                                {
                                    SocialInsPlaceID: {
                                        ...SocialInsPlaceID,
                                        value: item.SocialInsPlaceID ? { Value: item.SocialInsPlaceID } : null,
                                        refresh: !SocialInsPlaceID.refresh
                                    },
                                    SocialInsIssueDate: {
                                        ...SocialInsIssueDate,
                                        value: item.SocialInsIssueDate,
                                        refresh: !SocialInsIssueDate.refresh
                                    },
                                    HealthInsIssueDate: {
                                        ...HealthInsIssueDate,
                                        value: item.HealthInsIssueDate,
                                        refresh: !HealthInsIssueDate.refresh
                                    },
                                    FiveConsecutiveYearsFrom: {
                                        ...FiveConsecutiveYearsFrom,
                                        value: item.FiveConsecutiveYearsFrom,
                                        refresh: !FiveConsecutiveYearsFrom.refresh
                                    },
                                    SocialInsIssuePlace: {
                                        ...SocialInsIssuePlace,
                                        value: item.SocialInsIssuePlace,
                                        refresh: !SocialInsIssuePlace.refresh
                                    },
                                    DocumentType: {
                                        ...DocumentType,
                                        value: item.DocumentType
                                            ? { Value: item.DocumentType, Text: item.DocumentTypeView }
                                            : null,
                                        refresh: !DocumentType.refresh
                                    },
                                    HealthInsNo: {
                                        ...HealthInsNo,
                                        value: item.HealthInsNo,
                                        refresh: !HealthInsNo.refresh
                                    },
                                    InsuranceCode: {
                                        ...InsuranceCode,
                                        value: item.InsuranceCode,
                                        refresh: !InsuranceCode.refresh
                                    },
                                    ProfileName: {
                                        ...ProfileName,
                                        value: item.ProfileName,
                                        refresh: !ProfileName.refresh
                                    },
                                    DayOfBirth: {
                                        ...DayOfBirth,
                                        value: item.DayOfBirth,
                                        refresh: !DayOfBirth.refresh
                                    },
                                    Gender: {
                                        ...Gender,
                                        value: item.Gender
                                            ? { Value: item.Gender, Text: translate(item.Gender) }
                                            : null,
                                        refresh: !Gender.refresh
                                    },
                                    NationalityID: {
                                        ...NationalityID,
                                        value: item.NationalityID
                                            ? { ID: item.NationalityID, CountryCodeName: item.CountryCodeName }
                                            : null,
                                        refresh: !NationalityID.refresh
                                    },
                                    EthnicID: {
                                        ...EthnicID,
                                        value: item.EthnicID
                                            ? { ID: item.EthnicID, EthnicCodeName: item.EthnicCodeName }
                                            : null,
                                        refresh: !EthnicID.refresh
                                    },
                                    PProvinceID: {
                                        ...PProvinceID,
                                        value: item.PProvinceID
                                            ? { ID: item.PProvinceID, ProvinceName: item.PProvinceName }
                                            : null,
                                        refresh: !PProvinceID.refresh
                                    },
                                    PDistrictID: {
                                        ...PDistrictID,
                                        value: item.PDistrictID
                                            ? { ID: item.PDistrictID, DistrictName: item.PDistrictName }
                                            : null,
                                        refresh: !PDistrictID.refresh
                                    },
                                    PVillageID: {
                                        ...PVillageID,
                                        value: item.PVillageID
                                            ? { ID: item.PVillageID, VillageName: item.PVillageName }
                                            : null,
                                        refresh: !PVillageID.refresh
                                    },
                                    RProvinceID: {
                                        ...RProvinceID,
                                        value: item.RProvinceID
                                            ? { ID: item.RProvinceID, ProvinceName: item.RProvinceName }
                                            : null,
                                        refresh: !RProvinceID.refresh
                                    },
                                    RDistrictID: {
                                        ...RDistrictID,
                                        value: item.RDistrictID
                                            ? { ID: item.RDistrictID, DistrictName: item.RDistrictName }
                                            : null,
                                        refresh: !RDistrictID.refresh
                                    },
                                    RVillageID: {
                                        ...RVillageID,
                                        value: item.RVillageID
                                            ? { ID: item.RVillageID, VillageName: item.RVillageName }
                                            : null,
                                        refresh: !RVillageID.refresh
                                    },
                                    RAdress: {
                                        ...RAdress,
                                        value: item.RAdress,
                                        refresh: !RAdress.refresh
                                    },
                                    IDNo: {
                                        ...IDNo,
                                        value: item.IDNo,
                                        refresh: !IDNo.refresh
                                    },
                                    PhoneNumber: {
                                        ...PhoneNumber,
                                        value: item.PhoneNumber,
                                        refresh: !PhoneNumber.refresh
                                    }
                                },
                                () => {
                                    VnrLoadingSevices.show();
                                    HttpService.Post('[URI_HR]/Cat_GetData/GetMultiHealthTreatmentPlace', {
                                        text: '',
                                        ID: item.HealthTreatmentPlaceID ? item.HealthTreatmentPlaceID : ''
                                    }).then((data) => {
                                        VnrLoadingSevices.hide();

                                        let listData = data.map(function (el) {
                                            return {
                                                HealthTreatmentCodeName: el['HealthTreatmentCodeName'],
                                                ID: el['ID']
                                            };
                                        });

                                        this.setState({
                                            HealthTreatmentPlaceID: {
                                                ...HealthTreatmentPlaceID,
                                                data: listData,
                                                value: item.HealthTreatmentPlaceID
                                                    ? {
                                                        ID: item.HealthTreatmentPlaceID,
                                                        HealthTreatmentCodeName: item.HealthTreatmentCodeName
                                                    }
                                                    : null,
                                                refresh: !HealthTreatmentPlaceID.refresh
                                            }
                                        });
                                    });
                                }
                            );
                        }
                    }
                });
            }
        });
    };

    eventLoad2 = () => {
        const { ProfileID, IDNo, DocumentType } = this.state;
        let profileID = ProfileID.ID,
            _valDocumentType = DocumentType.value ? DocumentType.value.Value : null;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Ins_GetData/ReloadIDNoByType', {
            profileID: profileID,
            documentType: _valDocumentType
        }).then((data) => {
            VnrLoadingSevices.hide();

            if (data) {
                this.setState({
                    IDNo: {
                        ...IDNo,
                        value: data.IDNo,
                        refresh: !IDNo.refresh
                    }
                });
            }
        });
    };

    ChangetempPAddress = (item) => {
        if (item != null) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Cat_GetData/GetDataSoureAddress', { ID: item.ID }).then((data) => {
                VnrLoadingSevices.hide();

                if (data && data[0]) {
                    this._DataForControlPAddress(data[0]);
                } else {
                    const { PProvinceID, PDistrictID, PVillageID } = this.state;

                    this.setState({
                        PProvinceID: {
                            ...PProvinceID,
                            value: null,
                            refresh: !PProvinceID.refresh
                        },
                        PDistrictID: {
                            ...PDistrictID,
                            data: [],
                            value: null,
                            refresh: !PDistrictID.refresh
                        },
                        PVillageID: {
                            ...PVillageID,
                            value: null,
                            data: [],
                            refresh: !PVillageID.refresh
                        }
                    });
                }
            });
        } else {
            const { PProvinceID, PDistrictID, PVillageID } = this.state;

            this.setState({
                PProvinceID: {
                    ...PProvinceID,
                    value: null,
                    refresh: !PProvinceID.refresh
                },
                PDistrictID: {
                    ...PDistrictID,
                    value: null,
                    data: [],
                    refresh: !PDistrictID.refresh
                },
                PVillageID: {
                    ...PVillageID,
                    value: null,
                    data: [],
                    refresh: !PVillageID.refresh
                }
            });
        }
    };

    _DataForControlPAddress = (itemAddress) => {
        const { PProvinceID, PDistrictID, PVillageID } = this.state,
            { ProvinceID, DistrictID, VillageID } = itemAddress;

        VnrLoadingSevices.show();
        HttpService.MultiRequest([
            HttpService.Post('[URI_HR]/Cat_GetData/GetDistrictCascading', { province: ProvinceID }),
            HttpService.Post('[URI_HR]/Cat_GetData/GetVillageCascading', { districtid: DistrictID })
        ]).then((resAll) => {
            VnrLoadingSevices.hide();

            if (resAll) {
                const dataDistrict = resAll[0].map((item) => {
                        return {
                            ...item,
                            DistrictName: item.DistrictCodeName
                        };
                    }),
                    dataVillage = resAll[1].map((item) => {
                        return {
                            ...item,
                            VillageName: item.VillageCodeName
                        };
                    }),
                    valueProvince = PProvinceID.data.find((item) => item.ID == ProvinceID),
                    valueDistrict = dataDistrict.find((item) => item.ID == DistrictID),
                    valueVillage = dataVillage.find((item) => item.ID == VillageID);

                this.setState({
                    PProvinceID: {
                        ...PProvinceID,
                        value: valueProvince,
                        refresh: !PProvinceID.refresh
                    },
                    PDistrictID: {
                        ...PDistrictID,
                        value: valueDistrict,
                        data: dataDistrict,
                        refresh: !PDistrictID.refresh
                    },
                    PVillageID: {
                        ...PVillageID,
                        data: dataVillage,
                        value: valueVillage,
                        refresh: !PVillageID.refresh
                    }
                });
            }
        });
    };

    ChangetempRAddress = (item) => {
        if (item != null) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Cat_GetData/GetDataSoureAddress', { ID: item.ID }).then((data) => {
                VnrLoadingSevices.hide();

                if (data && data[0]) {
                    this._DataForControlRAddress(data[0]);
                } else {
                    const { RProvinceID, RDistrictID, RVillageID } = this.state;

                    this.setState({
                        RProvinceID: {
                            ...RProvinceID,
                            value: null,
                            refresh: !RProvinceID.refresh
                        },
                        RDistrictID: {
                            ...RDistrictID,
                            data: [],
                            value: null,
                            refresh: !RDistrictID.refresh
                        },
                        RVillageID: {
                            ...RVillageID,
                            value: null,
                            data: [],
                            refresh: !RVillageID.refresh
                        }
                    });
                }
            });
        } else {
            const { PProvinceID, PDistrictID, PVillageID } = this.state;

            this.setState({
                PProvinceID: {
                    ...PProvinceID,
                    value: null,
                    refresh: !PProvinceID.refresh
                },
                PDistrictID: {
                    ...PDistrictID,
                    value: null,
                    data: [],
                    refresh: !PDistrictID.refresh
                },
                PVillageID: {
                    ...PVillageID,
                    value: null,
                    data: [],
                    refresh: !PVillageID.refresh
                }
            });
        }
    };

    _DataForControlRAddress = (itemAddress) => {
        const { RProvinceID, RDistrictID, RVillageID } = this.state,
            { ProvinceID, DistrictID, VillageID } = itemAddress;

        VnrLoadingSevices.show();
        HttpService.MultiRequest([
            HttpService.Post('[URI_HR]/Cat_GetData/GetDistrictCascading', { province: ProvinceID }),
            HttpService.Post('[URI_HR]/Cat_GetData/GetVillageCascading', { districtid: DistrictID })
        ]).then((resAll) => {
            VnrLoadingSevices.hide();

            if (resAll) {
                const dataDistrict = resAll[0].map((item) => {
                        return {
                            ...item,
                            DistrictName: item.DistrictCodeName
                        };
                    }),
                    dataVillage = resAll[1].map((item) => {
                        return {
                            ...item,
                            VillageName: item.VillageCodeName
                        };
                    }),
                    valueProvince = RProvinceID.data.find((item) => item.ID == ProvinceID),
                    valueDistrict = dataDistrict.find((item) => item.ID == DistrictID),
                    valueVillage = dataVillage.find((item) => item.ID == VillageID);

                this.setState({
                    RProvinceID: {
                        ...RProvinceID,
                        value: valueProvince,
                        refresh: !RProvinceID.refresh
                    },
                    RDistrictID: {
                        ...RDistrictID,
                        value: valueDistrict,
                        data: dataDistrict,
                        refresh: !RDistrictID.refresh
                    },
                    RVillageID: {
                        ...RVillageID,
                        data: dataVillage,
                        value: valueVillage,
                        refresh: !RVillageID.refresh
                    }
                });
            }
        });
    };
}
