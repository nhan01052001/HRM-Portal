import React, { Component } from 'react';
import { View, TouchableOpacity, Modal, ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleProfileInfo,
    styleSafeAreaView,
    Size,
    Colors,
    stylesListPickerControl,
    styleValid,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
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
import { IconBack, IconCloseCircle } from '../../../../../constants/Icons';
import moment from 'moment';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { BankAccountConfirmedBusinessFunction } from './bankAccountConfirmed/BankAccountConfirmedBusinessFunction';
import { AlertInModal, AlertSevice } from '../../../../../components/Alert/Alert';
import { EnumIcon } from '../../../../../assets/constant';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';

const initSateDefault = {
    //IsCheckFormat: null,
    // StrBlockRelativesCodeTax: null,
    // IsExcludeProbation: null,
    // StrBlockRelativesIDNo: null,
    // IsBlockRelativesIDNo: null,
    // IsBlockRelativesCodeTax: null,
    ID: null,
    numberAccount: 1,
    isMultipleAccounts: false,
    Profile: {},

    SalaryPaidAccount: {
        label: 'HRM_Payroll_Sal_SalaryInformation_SalaryPaidAccount',
        disable: false,
        refresh: false,
        value: { Text: 'Account 1', Value: 'E_ACCOUNT_1', Number: 1 },
        visibleConfig: true,
        visible: true
    },

    GroupBank: {
        label: 'HRM_Payroll_Sal_SalaryInformation_GroupBank',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true
    },
    FileAttach: {
        label: 'FileAttach',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    // thông tin tài khoản

    AccountName: {
        label: 'HRM_Payroll_Sal_SalaryInformation_AccountNameGeneral',
        disable: false,
        refresh: false,
        value: '',
        visibleConfig: true,
        visible: true
    },
    AccountNo: {
        label: 'HRM_Payroll_Sal_SalaryInformation_AccountNoGeneral',
        disable: false,
        refresh: false,
        value: '',
        visibleConfig: true,
        visible: true
    },
    BankID: {
        label: 'HRM_Payroll_Sal_SalaryInformation_BankIDGeneral',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    BranchID: {
        label: 'HRM_Payroll_Sal_SalaryInformation_BranchIDGeneral',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    BankBrandName: {
        label: 'HRM_Payroll_Sal_SalaryInformation_BankBrandNameGeneral',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    CountryID: {
        label: 'HRM_Payroll_Sal_SalaryInformation_CountryIDGeneral',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    ProvinceCodeName: {
        label: 'HRM_Payroll_Sal_SalaryInformation_ProvinceCodeNameGeneral',
        disable: true,
        refresh: false,
        value: '',
        visibleConfig: true,
        visible: true
    },
    Address: {
        label: 'HRM_HR_Address_AddressName',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    SwiftCode: {
        label: 'HRM_Payroll_Sal_SalaryInformation_SwiftCodeGeneral',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    SortCode: {
        label: 'HRM_Payroll_Sal_SalaryInformation_SortCodeGeneral',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    DateReleased: {
        label: 'HRM_Payroll_Sal_SalaryInformation_DateReleasedGeneral',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    DateExpired: {
        label: 'HRM_Payroll_Sal_SalaryInformation_DateExpiredGeneral',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    IsCash: {
        label: 'HRM_Payroll_Sal_SalaryInformation_IsCashGeneral',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true
    },
    IsRemainAmontByCash: {
        label: 'HRM_Payroll_Sal_SalaryInformation_IsRemainAmontByCashGeneral',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true
    },
    AmountTransfer: {
        label: 'HRM_Payroll_Sal_SalaryInformation_AmountTransferGeneral',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    CurrencyID: {
        label: 'HRM_Payroll_Sal_SalaryInformation_CurrencyIDGeneral',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    AccountCompanyID: {
        label: 'HRM_Payroll_Sal_SalaryInformation_AccountCompanyIDGeneral',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    IBAN: {
        label: 'HRM_Payroll_Sal_SalaryInformation_IBANGeneral',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true
    },
    Note: {
        label: 'HRM_Payroll_Sal_SalaryInformation_NoteGeneral',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true
    },

    fieldValid: {},
    isUpperCaseText: {},

    modalErrorDetail: {
        isModalVisible: false,
        cacheID: null,
        data: []
    },
    isShowLoading: false
};

export default class BankAccountAddOrEdit extends Component {
    constructor(props) {
        super(props);
        this.state = initSateDefault;
        this.setVariable();
        const { isMultipleAccounts, numberAccount, rollbackAccount } = props.navigation.state.params;
        if (
            props.navigation.state &&
            props.navigation.state.params &&
            props.navigation.state.params.record &&
            props.navigation.state.params.record.ID
        ) {
            props.navigation.setParams({
                title: 'HRM_Payroll_Sal_SalaryInformation_Edit'
            });
        } else if (isMultipleAccounts) {
            props.navigation.setParams({
                title: translate('Sal_Infomation_Account') + ' ' + numberAccount
            });
        } else {
            props.navigation.setParams({
                title: 'HRM_PortalApp_Sal_SalaryInformation_PopUp_Create_Title'
            });
        }

        props.navigation.setParams({
            headerLeft: (
                <TouchableOpacity
                    onPress={() => {
                        DrawerServices.goBack();
                        rollbackAccount && typeof rollbackAccount == 'function' && rollbackAccount();
                    }}
                >
                    <View style={styleSheets.bnt_HeaderRight}>
                        <IconBack color={Colors.gray_10} size={Size.iconSizeHeader} />
                    </View>
                </TouchableOpacity>
            )
        });
    }

    //#region [khởi tạo , lấy các dữ liệu cho control, lấy giá trị mặc đinh]

    setVariable = () => {
        this.isModify = false;

        this.isProcessing = false;
        this.profileInfo = dataVnrStorage && dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info : {};

        this.AlertSevice = {
            alert: null
        };
        this.IsContinueSave = false;
        this.ProfileRemoveIDs = null;
        this.IsRemoveAndContinue = null;
        this.CacheID = null;
    };

    // refreshView = () => {
    //     this.props.navigation.setParams({ title: 'HRM_Insurance_Hre_HouseholdInfo_PopUp_Addnew_Title' });
    //     this.setVariable();
    //     const { AttachImage } = this.state;
    //     let resetState = {
    //         ...initSateDefault,
    //         AttachImage: {
    //             ...initSateDefault.AttachImage,
    //             refresh: !AttachImage.refresh
    //         }
    //     }

    //     this.setState(resetState, () => this.getConfigValid('Sal_SalaryInformationView', true));
    // }

    //promise get config valid
    getConfigValid = (tblName, isRefresh) => {
        VnrLoadingSevices.show();
        HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName).then(resConfigValid => {
            if (resConfigValid) {
                try {
                    VnrLoadingSevices.hide();
                    let { numberAccount, isMultipleAccounts } = this.props.navigation.state.params;
                    //map field hidden by config
                    const _configField =
                        ConfigField && ConfigField.value['BankAccountAddOrEdit']
                            ? ConfigField.value['BankAccountAddOrEdit']['Hidden']
                            : [],
                        { E_ProfileID, E_FullName } = EnumName,
                        _profile = { ID: this.profileInfo[E_ProfileID], ProfileName: this.profileInfo[E_FullName] };

                    let nextState = {
                        fieldValid: resConfigValid,
                        Profile: _profile,
                        numberAccount: numberAccount ? numberAccount : 1,
                        isMultipleAccounts: isMultipleAccounts
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
                    });

                    this.setState(nextState, () => {
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
        });
    };

    componentDidMount() {
        this.getConfigValid('Sal_SalaryInformationView');
    }

    getConfig = () => {
        this.getDefaultValue();
    };

    getDefaultValue = () => {
        const { BankID, CurrencyID } = this.state;
        VnrLoadingSevices.show();
        HttpService.MultiRequest([
            HttpService.Get('[URI_POR]/New_Personal/GetDefaultValue'),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiBank')
        ]).then(resAll => {
            VnrLoadingSevices.hide();
            const [data, dataBank] = resAll;
            try {
                if (data) {
                    let nextState = {
                        BankID: {
                            ...BankID,
                            data: dataBank,
                            refresh: !BankID.refresh
                        }
                    };

                    if (data.BankID && data.BankCode && data.BankName) {
                        nextState = {
                            ...nextState,
                            BankID: {
                                ...nextState.BankID,
                                value: { ID: data.BankID, BankCodeName: `${data.BankCode} - ${data.BankName}` },
                                refresh: !BankID.refresh
                            }
                        };
                    }

                    if (data.CurrencyID && data.CurrencyName) {
                        nextState = {
                            ...nextState,
                            CurrencyID: {
                                ...CurrencyID,
                                value: { ID: data.CurrencyID, CurrencyName: data.CurrencyName },
                                refresh: !CurrencyID.refresh
                            }
                        };
                    }
                    // if (data.CurrencyID && data.CurrencyName ) {
                    //     nextState = {
                    //         ...nextState,
                    //         AccountName: {
                    //             ...AccountName,
                    //             value: ,
                    //             refresh: !AccountName.refresh
                    //         }
                    //     }
                    // }

                    this.setState(nextState, () => {
                        this.getBranchByID({ ID: data.BankID });
                    });
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    setRecordForModify = response => {
        VnrLoadingSevices.show();
        HttpService.MultiRequest([
            HttpService.Get('[URI_POR]/New_Personal/GetDefaultValue'),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiBank')
        ]).then(resAll => {
            VnrLoadingSevices.hide();
            const [data, dataBank] = resAll;
            try {
                this.handleState(response, data, dataBank);
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    handleState = (response, dataBranch, dataBank) => {
        let nextState = {};
        const {
            // ID,
            // isMultipleAccounts,
            // numberAccount,
            // fieldValid,
            //-------//
            SalaryPaidAccount,
            GroupBank,
            FileAttach,
            // thông tin tài khoản
            AccountName,
            AccountNo,
            BankID,
            BranchID,
            BankBrandName,
            CountryID,
            ProvinceCodeName,
            Address,
            SwiftCode,
            SortCode,
            DateReleased,
            DateExpired,
            IsCash,
            IsRemainAmontByCash,
            AmountTransfer,
            CurrencyID,
            AccountCompanyID,
            IBAN,
            Note
        } = this.state;

        let isDisableBranch = response.BranchID ? true : false;
        nextState = {
            ID: response.ID ? response.ID : null,
            SalaryPaidAccount: {
                ...SalaryPaidAccount,
                value: response.SalaryPaidAccount ? { Value: response.SalaryPaidAccount } : '',
                refresh: !SalaryPaidAccount.refresh
            },
            GroupBank: {
                ...GroupBank,
                value: response.GroupBank ? response.GroupBank : '',
                refresh: !GroupBank.refresh
            },
            IsCash: {
                ...IsCash,
                value: response.IsCash,
                refresh: !IsCash.refresh
            },
            IsRemainAmontByCash: {
                ...IsRemainAmontByCash,
                value: response.IsRemainAmontByCash,
                refresh: !IsRemainAmontByCash.refresh
            },
            AccountName: {
                ...AccountName,
                value: response.AccountName ? response.AccountName : '',
                refresh: !AccountName.refresh
            },
            AmountTransfer: {
                ...AmountTransfer,
                value: response.AmountTransfer ? response.AmountTransfer : '',
                refresh: !AmountTransfer.refresh
            },
            AccountNo: {
                ...AccountNo,
                value: response.AccountNo ? response.AccountNo : '',
                refresh: !AccountNo.refresh
            },
            BankBrandName: {
                ...BankBrandName,
                value: response.BankBrandName ? response.BankBrandName : '',
                disable: isDisableBranch,
                refresh: !BankBrandName.refresh
            },
            ProvinceCodeName: {
                ...ProvinceCodeName,
                value: response.ProvinceCodeName ? response.ProvinceCodeName : '',
                // disable: isDisableBranch,
                refresh: !ProvinceCodeName.refresh
            },
            Address: {
                ...Address,
                value: response.Address ? response.Address : '',
                disable: isDisableBranch,
                refresh: !Address.refresh
            },
            SwiftCode: {
                ...SwiftCode,
                value: response.SwiftCode ? response.SwiftCode : '',
                disable: isDisableBranch,
                refresh: !SwiftCode.refresh
            },
            SortCode: {
                ...SortCode,
                value: response.SortCode ? response.SortCode : '',
                disable: isDisableBranch,
                refresh: !SortCode.refresh
            },
            IBAN: {
                ...IBAN,
                value: response.IBAN ? response.IBAN : '',
                refresh: !IBAN.refresh
            },
            Note: {
                ...Note,
                value: response.Note1 ? response.Note1 : '',
                refresh: !Note.refresh
            },
            CountryID: {
                ...CountryID,
                value: response.CountryID ? { ID: response.CountryID, CountryName: response.CountryName } : null,
                disable: isDisableBranch,
                refresh: !CountryID.refresh
            },
            BankID: {
                ...BankID,
                data: dataBank,
                value: response.BankID
                    ? {
                        ID: response.BankID,
                        BankCodeName: `${response.BankCode} - ${response.BankName}`,
                        BankCode: response.BankCode,
                        BankName: response.BankName
                    }
                    : null,
                refresh: !BankID.refresh
            },
            BranchID: {
                ...BranchID,
                value: response.BranchID ? { ID: response.BranchID, BranchName: response.BranchName } : null,
                data: dataBranch,
                refresh: !BranchID.refresh
            },
            AccountCompanyID: {
                ...AccountCompanyID,
                value: response.AccountCompany1ID
                    ? { ID: response.AccountCompany1ID, AccountCompanyName: response.AccountCompany1Name }
                    : null,
                refresh: !AccountCompanyID.refresh
            },
            CurrencyID: {
                ...CurrencyID,
                value: { ID: response.CurrencyID, CurrencyName: response.CurrencyName },
                refresh: !CurrencyID.refresh
            },
            DateReleased: {
                ...DateReleased,
                value: response.DateReleased ? moment(response.DateReleased) : null,
                refresh: !DateReleased.refresh
            },
            DateExpired: {
                ...DateExpired,
                value: response.DateExpired ? moment(response.DateExpired) : null,
                refresh: !DateExpired.refresh
            },
            FileAttach: {
                ...FileAttach,
                value: response.lstFileAttach,
                refresh: !FileAttach.refresh
            }
        };

        this.setState(nextState);
    };

    onSaveAndCreate = () => {
        this.onSave(true, null);
    };

    onSaveAndSend = () => {
        this.onSave(null, true);
    };

    onAddAccounts = () => {
        this.onSave();
    };

    checkDulicateSalInfomation = () => {
        const { AccountNo } = this.state;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Sal_GetData/CheckDulicateSalInfomation', {
            AccountNos: AccountNo.value,
            ProfileID: this.profileInfo.ProfileID
        }).then(data => {
            VnrLoadingSevices.hide();
            if (data && data.success === false) {
                ToasterSevice.showWarning(data.message || 'Có lỗi xảy ra khi kiểm tra số tài khoản trùng', 4000);
            }
        });
    };

    onSave = (isCreate, isSend, isContinue) => {
        if (this.isProcessing) {
            return;
        }

        const {
            ID,
            isMultipleAccounts,
            numberAccount,
            fieldValid,
            GroupBank,
            FileAttach,
            // thông tin tài khoản
            AccountName,
            AccountNo,
            BankID,
            BranchID,
            BankBrandName,
            CountryID,
            ProvinceCodeName,
            Address,
            SwiftCode,
            SortCode,
            DateReleased,
            DateExpired,
            IsCash,
            IsRemainAmontByCash,
            AmountTransfer,
            CurrencyID,
            AccountCompanyID,
            IBAN,
            Note,
            modalErrorDetail
        } = this.state;
        const { addAccount } = this.props.navigation.state.params;
        let params = {},
            txtNumber = numberAccount != 1 ? numberAccount : '';

        if (
            (isMultipleAccounts &&
                (fieldValid.AccountName && (AccountName.value == null || AccountName.value == ''))) ||
            (fieldValid.AccountNo && (AccountNo.value == null || AccountNo.value == '')) ||
            (fieldValid.BankBrandName && (BankBrandName.value == null || BankBrandName.value == '')) ||
            (fieldValid.ProvinceCodeName && (ProvinceCodeName.value == null || ProvinceCodeName.value == '')) ||
            (fieldValid.Address && (Address.value == null || Address.value == '')) ||
            (fieldValid.SwiftCode && (SwiftCode.value == null || SwiftCode.value == '')) ||
            (fieldValid.SortCode && (SortCode.value == null || SortCode.value == '')) ||
            (fieldValid.AmountTransfer && (AmountTransfer.value == null || AmountTransfer.value == '')) ||
            (fieldValid.IBAN && (IBAN.value == null || IBAN.value == '')) ||
            (fieldValid.Note && (Note.value == null || Note.value == '')) ||
            (fieldValid.DateReleased && DateReleased.value == null) ||
            (fieldValid.DateExpired && DateExpired.value == null) ||
            (fieldValid.CurrencyID && CurrencyID.value == null) ||
            (fieldValid.AccountCompanyID && AccountCompanyID.value == null) ||
            (fieldValid.BankID && BankID.value == null) ||
            (fieldValid.BranchID && BranchID.value == null) ||
            (fieldValid.CountryID && CountryID.value == null)
        ) {
            ToasterSevice.showWarning('HRM_PortalApp_InputValue_Please');
            return;
        }

        if (
            DateReleased.value &&
            DateExpired.value &&
            !moment(DateReleased.value).isBefore(moment(DateExpired.value))
        ) {
            ToasterSevice.showWarning('HRM_Validate_ExpirationDate_Expiration_Date');
            return;
        }
        let noteAccountAliasTranslate = translate('HRM_Payroll_Sal_SalaryInformation_NoteGeneral'),
            noteMess = translate('HRM_Portal_BankAccount_NoteNoMoreThan500Characters').replace(
                '[noteAccount]',
                `[${noteAccountAliasTranslate} ${numberAccount}]`
            );

        if (Note.value && Note.value.length >= 500) {
            ToasterSevice.showWarning(noteMess);
            return;
        }

        if (isMultipleAccounts && numberAccount && numberAccount > 0) {
            txtNumber = '';
            params = {
                [`AccountName${txtNumber}`]: AccountName.value,
                [`AccountNo${txtNumber}`]: AccountNo.value,
                [`BankID${txtNumber}`]: BankID.value ? BankID.value.ID : null,
                [`BankName${txtNumber}`]: BankID.value ? BankID.value.BankName : null,
                [`BankCode${txtNumber}`]: BankID.value ? BankID.value.BankCode : null,
                [`BranchID${txtNumber}`]: BranchID.value ? BranchID.value.ID : null,
                [`BankBrandName${txtNumber}`]: BankBrandName.value,
                [`CountryID${txtNumber}`]: CountryID.value ? CountryID.value.ID : null,
                [`CountryName${txtNumber}`]: CountryID.value ? CountryID.value.CountryName : null,
                [`ProvinceCodeName${txtNumber}`]: ProvinceCodeName.value,
                [`Address${txtNumber}`]: Address.value,
                [`SwiftCode${txtNumber}`]: SwiftCode.value,
                [`SortCode${txtNumber}`]: SortCode.value,
                [`DateReleased${txtNumber}`]: DateReleased.value
                    ? Vnr_Function.formatDateAPI(DateReleased.value)
                    : null,
                [`DateExpired${txtNumber}`]: DateExpired.value ? Vnr_Function.formatDateAPI(DateExpired.value) : null,
                [`IsCash${txtNumber}`]: IsCash.value,
                [`IsRemainAmontByCash${txtNumber}`]: IsRemainAmontByCash.value,
                [`AmountTransfer${txtNumber}`]: AmountTransfer.value,
                [`CurrencyID${txtNumber}`]: CurrencyID.value ? CurrencyID.value.ID : null,
                [`CurrencyName${txtNumber}`]: CurrencyID.value ? CurrencyID.value.CurrencyName : null,
                ['AccountCompany1ID']: AccountCompanyID.value ? AccountCompanyID.value.ID : null,
                ['AccountCompany1Name']: AccountCompanyID.value ? AccountCompanyID.value.AccountCompanyName : null,
                [`IBAN${txtNumber}`]: IBAN.value,
                ['Note1']: Note.value
            };
        } else if (numberAccount && numberAccount > 0) {
            params = {
                [`AccountName${txtNumber}`]: AccountName.value,
                [`AccountNo${txtNumber}`]: AccountNo.value,
                [`BankID${txtNumber}`]: BankID.value ? BankID.value.ID : null,
                [`BankName${txtNumber}`]: BankID.value ? BankID.value.BankName : null,
                [`BankCode${txtNumber}`]: BankID.value ? BankID.value.BankCode : null,
                [`BranchID${txtNumber}`]: BranchID.value ? BranchID.value.ID : null,
                [`BankBrandName${txtNumber}`]: BankBrandName.value,
                [`CountryID${txtNumber}`]: CountryID.value ? CountryID.value.ID : null,
                [`CountryName${txtNumber}`]: CountryID.value ? CountryID.value.CountryName : null,
                [`ProvinceCodeName${txtNumber}`]: ProvinceCodeName.value,
                [`Address${txtNumber}`]: Address.value,
                [`SwiftCode${txtNumber}`]: SwiftCode.value,
                [`SortCode${txtNumber}`]: SortCode.value,
                [`DateReleased${txtNumber}`]: DateReleased.value
                    ? Vnr_Function.formatDateAPI(DateReleased.value)
                    : null,
                [`DateExpired${txtNumber}`]: DateExpired.value ? Vnr_Function.formatDateAPI(DateExpired.value) : null,
                [`IsCash${txtNumber}`]: IsCash.value,
                [`IsRemainAmontByCash${txtNumber}`]: IsRemainAmontByCash.value,
                [`AmountTransfer${txtNumber}`]: AmountTransfer.value,
                [`CurrencyID${txtNumber}`]: CurrencyID.value ? CurrencyID.value.ID : null,
                [`AccountCompany${numberAccount}ID`]: AccountCompanyID.value ? AccountCompanyID.value.ID : null,
                [`IBAN${txtNumber}`]: IBAN.value,
                [`Note${numberAccount}`]: Note.value
            };
        }

        // Trường hợp 1 tài khoản
        if (isMultipleAccounts == false && Object.keys(params).length > 0 && numberAccount == 1) {
            if (ID) {
                params = {
                    ...params,
                    ID
                };
            }

            params = {
                ...params,
                numberAccount: 'E_ACCOUNTS_1',
                NumberOfAccount: 'E_ACCOUNTS_1',
                SalaryPaidAccount: 'E_ACCOUNTS_1',
                ProfileID: this.profileInfo.ProfileID,
                UserID: this.profileInfo.userid,
                // Thông tin chung
                // SalaryPaidAccount: SalaryPaidAccount?.value?.Value ? SalaryPaidAccount.value.Value : null,
                GroupBank: GroupBank.value,
                FileAttach: FileAttach.value ? FileAttach.value.map(item => item.fileName).join(',') : null,
                FileAttachment: FileAttach.value ? FileAttach.value.map(item => item.fileName).join(',') : null,
                IsPortal: true,
                ListMiniModelSave: []
            };

            params?.ListMiniModelSave.push({
                AccountName: AccountName.value,
                AccountNo: AccountNo.value,
                BankID: BankID.value ? BankID.value.ID : null,
                BranchID: BranchID.value ? BranchID.value.ID : null,
                BankBrandName: BankBrandName.value,
                CountryID: CountryID.value ? CountryID.value.ID : null,
                CountryName: CountryID.value ? CountryID.value.CountryName : null,
                ProvinceCodeName: ProvinceCodeName.value,
                Address: Address.value,
                SwiftCode: SwiftCode.value,
                SortCode: SortCode.value,
                CurrencyID: CurrencyID.value ? CurrencyID.value.ID : null,
                AmountTransfer: AmountTransfer.value,
                AccountCompanyID: AccountCompanyID.value ? AccountCompanyID.value.ID : null,
                IBAN: IBAN.value,
                Note: Note.value,
                DateReleased: DateReleased.value ? Vnr_Function.formatDateAPI(DateReleased.value) : null,
                DateExpired: DateExpired.value ? Vnr_Function.formatDateAPI(DateExpired.value) : null,
                BankAccountIndex: txtNumber,
                ID: ID,
                IsPortal: true
            });

            // Send mail
            if (isSend) {
                params = {
                    ...params,
                    IsSubmitSave: true
                };
            }

            if (isContinue) {
                params = {
                    ...params,
                    IsPassCheckAccountNoDuplicate: true,
                    IsPassChangeBankAccount: true
                };
            }

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/api/Hre_ApprovedSalaryInformation', params)
                .then(data => {
                    this.isProcessing = false;
                    VnrLoadingSevices.hide();
                    if (data && typeof data == 'object') {
                        if (data.ErrorRespone) {
                            if (data.ErrorRespone.IsBlock) {
                                // Nếu có IsBlock, kiểm tra có IsShowRemoveAndContinue hay không
                                if (data.ErrorRespone.IsShowRemoveAndContinue) {
                                    AlertSevice.alert({
                                        title: translate('Hrm_Notification'),
                                        iconType: EnumIcon.E_WARNING,
                                        message: translate('HRM_Attendance_Message_InvalidRequestDataPleaseCheckAgain'),
                                        // Lưu và tiếp tục
                                        colorSecondConfirm: Colors.primary,
                                        textSecondConfirm: translate('Button_OK'),
                                        onSecondConfirm: () => {
                                            this.ProfileRemoveIDs = data.ErrorRespone.ProfileRemoveIDs;
                                            this.IsRemoveAndContinue = true;
                                            this.CacheID = data.ErrorRespone.CacheID;
                                            this.onSave(null, isSend, true);
                                        },
                                        // Đóng
                                        onCancel: () => { },
                                        // Chi tiết lỗi
                                        textRightButton: translate('Button_Detail'),
                                        onConfirm: () => {
                                            this.setState(
                                                {
                                                    modalErrorDetail: {
                                                        ...modalErrorDetail,
                                                        cacheID: data.ErrorRespone.CacheID,
                                                        isModalVisible: true
                                                    }
                                                },
                                                () => {
                                                    this.getErrorMessageRespone();
                                                }
                                            );
                                        }
                                    });
                                } else {
                                    AlertSevice.alert({
                                        title: translate('Hrm_Notification'),
                                        iconType: EnumIcon.E_WARNING,
                                        message: translate('HRM_Attendance_Message_InvalidRequestDataPleaseCheckAgain'),
                                        textRightButton: translate('Button_Detail'),
                                        // Đóng popup
                                        onCancel: () => { },
                                        // Chi tiết lỗi
                                        onConfirm: () => {
                                            this.setState(
                                                {
                                                    modalErrorDetail: {
                                                        ...modalErrorDetail,
                                                        cacheID: data.ErrorRespone.CacheID,
                                                        isModalVisible: true
                                                    }
                                                },
                                                () => {
                                                    this.getErrorMessageRespone();
                                                }
                                            );
                                        }
                                    });
                                }
                            } else {
                                AlertSevice.alert({
                                    title: translate('Hrm_Notification'),
                                    iconType: EnumIcon.E_WARNING,
                                    message: translate('HRM_Attendance_Message_InvalidRequestDataDoYouWantToSave'),
                                    // Lưu và tiếp tục
                                    colorSecondConfirm: Colors.primary,
                                    textSecondConfirm: translate('Button_OK'),
                                    onSecondConfirm: () => {
                                        this.IsContinueSave = true;
                                        this.ProfileRemoveIDs = data.ErrorRespone.ProfileRemoveIDs;
                                        this.IsRemoveAndContinue = true;
                                        this.CacheID = data.ErrorRespone.CacheID;
                                        this.onSave(null, isSend, true);
                                    },
                                    // Đóng
                                    onCancel: () => { },
                                    // Chi tiết lỗi
                                    textRightButton: translate('Button_Detail'),
                                    onConfirm: () => {
                                        this.setState(
                                            {
                                                modalErrorDetail: {
                                                    ...modalErrorDetail,
                                                    cacheID: data.ErrorRespone.CacheID,
                                                    isModalVisible: true
                                                }
                                            },
                                            () => {
                                                this.getErrorMessageRespone();
                                            }
                                        );
                                    }
                                });
                            }
                        } else if (data.ActionStatus && data.ActionStatus.split('|')[0] == 'InValid') {
                            ToasterSevice.showWarning(data.ActionStatus.split('|')[1], 4000);
                        } else if (data.ActionStatus && data.ActionStatus.split('|')[0] == 'Exist') {
                            ToasterSevice.showWarning(data.ActionStatus.split('|')[1], 4000);
                        } else {
                            ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                            const { reload } = this.props.navigation.state.params;
                            if (reload && typeof reload === 'function') {
                                reload();
                            }

                            // if (isCreate) {
                            //     this.refreshView();
                            // }
                            // else {
                            BankAccountConfirmedBusinessFunction.checkForLoadEditDelete[
                                ScreenName.BankAccountConfirm
                            ] = true;
                            DrawerServices.navigate('BankAccountConfirm');
                            // }
                        }
                    }
                })
                .catch(() => {
                    VnrLoadingSevices.hide();
                });
        } else if (addAccount) {
            addAccount({
                ...params,
                accountNumber: numberAccount
            });
            DrawerServices.navigate('BankAccountMultiAddOrEdit');
        }
    };

    groupByMessage = (array, key) => {
        // Return the end result
        return array.reduce((result, currentValue) => {
            // If an array already present for key, push it to the array. Else create an array and push the object
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
            return result;
        }, {}); // empty object is the initial value for result object
    };

    mappingDataGroup = dataGroup => {
        let dataSource = [];
        let key = '';
        for (key in dataGroup) {
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
            { data } = modalErrorDetail;

        if (data) {
            const dataGroup = this.groupByMessage(data, 'MessageName'),
                dataSourceError = this.mappingDataGroup(dataGroup);

            return dataSourceError.map((dataItem, index) => {
                let viewContent = <View />;
                if (dataItem['Type'] && dataItem['Type'] == 'E_GROUP') {
                    viewContent = (
                        <View style={styleComonAddOrEdit.styleViewTitleGroup}>
                            <VnrText
                                style={[styleSheets.lable, styleComonAddOrEdit.styFontErrTitle]}
                                i18nKey={dataItem['TitleGroup']}
                            />
                        </View>
                    );
                } else {
                    viewContent = (
                        <View style={styleComonAddOrEdit.styFontErrInfo}>
                            <View style={styleComonAddOrEdit.styFontErrLine}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    i18nKey={'HRM_PortalApp_Message_ErrorCodeEmp'}
                                />

                                <View style={styleComonAddOrEdit.styFontErrVal}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    >
                                        {dataItem['CodeEmp']}
                                    </Text>
                                </View>
                            </View>

                            <View style={styleComonAddOrEdit.styFontErrLine}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    i18nKey={'HRM_PortalApp_Message_ErrorProfileName'}
                                />

                                <View style={styleComonAddOrEdit.styFontErrVal}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    >
                                        {dataItem['ProfileName']}
                                    </Text>
                                </View>
                            </View>

                            <View style={styleComonAddOrEdit.styFontErrLine}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    i18nKey={'HRM_PortalApp_Message_ErrorDescription'}
                                />

                                <View style={styleComonAddOrEdit.styFontErrVal}>
                                    <Text style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}>
                                        {dataItem['ErrorDescription']}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    );
                }

                return (
                    <View
                        key={index}
                        style={[
                            styleComonAddOrEdit.styleViewBorderButtom,
                            dataSourceError.length - 1 == index && styleComonAddOrEdit.styleViewNoBorder
                        ]}
                    >
                        {viewContent}
                    </View>
                );
            });
        } else {
            return <View />;
        }
    };

    getErrorMessageRespone() {
        const { modalErrorDetail } = this.state,
            { cacheID } = modalErrorDetail;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetErrorMessageRespone', { cacheID: cacheID }).then(res => {
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

    onChangeBranchID = item => {
        const { BranchID, CountryID, Address, SwiftCode, SortCode, BankBrandName } = this.state;
        let nextState = {};

        if (item) {
            nextState = {
                BankBrandName: {
                    ...BankBrandName,
                    value: item?.BranchName,
                    disable: true,
                    refresh: !BankBrandName.refresh
                },
                CountryID: {
                    ...CountryID,
                    disable: true,
                    refresh: !CountryID.refresh
                },
                Address: {
                    ...Address,
                    disable: true,
                    refresh: !Address.refresh
                },
                SwiftCode: {
                    ...SwiftCode,
                    disable: true,
                    refresh: !SwiftCode.refresh
                },
                SortCode: {
                    ...SortCode,
                    disable: true,
                    refresh: !SortCode.refresh
                }
            };
        } else {
            nextState = {
                BankBrandName: {
                    ...BankBrandName,
                    value: null,
                    disable: false,
                    refresh: !BankBrandName.refresh
                },
                CountryID: {
                    ...CountryID,
                    value: null,
                    disable: false,
                    refresh: !CountryID.refresh
                },
                Address: {
                    ...Address,
                    value: null,
                    disable: false,
                    refresh: !Address.refresh
                },
                SwiftCode: {
                    ...SwiftCode,
                    value: null,
                    disable: false,
                    refresh: !SwiftCode.refresh
                },
                SortCode: {
                    ...SortCode,
                    value: null,
                    disable: false,
                    refresh: !SortCode.refresh
                }
            };
        }

        this.setState(
            {
                BranchID: {
                    ...BranchID,
                    value: item,
                    refresh: !BranchID.refresh
                },
                ...nextState
            },
            () => {
                if (item) {
                    const { CountryID, ProvinceCodeName, Address, SwiftCode, SortCode } = this.state;
                    VnrLoadingSevices.show();
                    HttpService.Get(`[URI_HR]/Cat_GetData/GetBanchByID?BranchID=${item.ID}`).then(data => {
                        VnrLoadingSevices.hide();
                        try {
                            if (data) {
                                let nextState = {
                                    ProvinceCodeName: {
                                        ...ProvinceCodeName,
                                        value: data.ProvinceNameView ? data.ProvinceNameView : '',
                                        disable: true,
                                        refresh: !CountryID.refresh
                                    },
                                    Address: {
                                        ...Address,
                                        value: data.Address ? data.Address : '',
                                        disable: true,
                                        refresh: !CountryID.refresh
                                    },
                                    SwiftCode: {
                                        ...SwiftCode,
                                        value: data.BranchSwiftCode ? data.BranchSwiftCode : '',
                                        disable: true,
                                        refresh: !CountryID.refresh
                                    },
                                    SortCode: {
                                        ...SortCode,
                                        value: data.BranchSortCode ? data.BranchSortCode : '',
                                        disable: true,
                                        refresh: !SortCode.refresh
                                    }
                                };

                                if (data.CountryID) {
                                    nextState = {
                                        ...nextState,
                                        CountryID: {
                                            ...CountryID,
                                            value: {
                                                CountryName: data.CountryName,
                                                ID: data.CountryID
                                            },
                                            disable: true,
                                            refresh: !CountryID.refresh
                                        }
                                    };
                                }

                                this.setState(nextState);
                            }
                        } catch (error) {
                            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                        }
                    });
                }
            }
        );
    };

    getBranchByID = item => {
        const { BranchID, CountryID, Address, SwiftCode, SortCode, BankBrandName } = this.state;
        let stateNull = {
            BankBrandName: {
                ...BankBrandName,
                value: null,
                disable: false,
                refresh: !CountryID.refresh
            },
            CountryID: {
                ...CountryID,
                value: null,
                disable: false,
                refresh: !CountryID.refresh
            },
            Address: {
                ...Address,
                value: null,
                disable: false,
                refresh: !CountryID.refresh
            },
            SwiftCode: {
                ...SwiftCode,
                value: null,
                disable: false,
                refresh: !CountryID.refresh
            },
            SortCode: {
                ...SortCode,
                value: null,
                disable: false,
                refresh: !SortCode.refresh
            }
        };
        if (item) {
            VnrLoadingSevices.show();
            HttpService.Get(`[URI_HR]/Cat_GetData/GetBanchInfoByBankMulti?BankID=${item.ID}`).then(data => {
                VnrLoadingSevices.hide();
                try {
                    if (Array.isArray(data) && data.length > 0) {
                        this.setState(
                            {
                                BranchID: {
                                    ...BranchID,
                                    data: data,
                                    value: data.length === 1 ? data[0] : null,
                                    disable: false,
                                    refresh: !BranchID.refresh
                                },
                                BankBrandName: {
                                    ...BankBrandName,
                                    value: null,
                                    disable: false,
                                    refresh: !BankBrandName.refresh
                                }
                            },
                            () => {
                                if (data.length === 1) this.onChangeBranchID(data[0]);
                            }
                        );
                    } else {
                        this.setState({
                            ...stateNull,
                            BranchID: {
                                ...BranchID,
                                data: null,
                                value: null,
                                disable: true,
                                refresh: !BranchID.refresh
                            },
                            BankBrandName: {
                                ...BankBrandName,
                                value: null,
                                disable: true,
                                refresh: !BankBrandName.refresh
                            }
                        });
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        } else {
            this.setState({
                ...stateNull,
                BranchID: {
                    ...BranchID,
                    data: null,
                    value: null,
                    disable: true,
                    refresh: !BranchID.refresh
                },
                BankBrandName: {
                    ...BankBrandName,
                    value: null,
                    disable: true,
                    refresh: !BankBrandName.refresh
                }
            });
        }
    };

    render() {
        const {
            fieldValid,
            SalaryPaidAccount,
            GroupBank,
            FileAttach,
            isMultipleAccounts,

            // thông tin tài khoản
            AccountName,
            AccountNo,
            BankID,
            BranchID,
            BankBrandName,
            CountryID,
            ProvinceCodeName,
            Address,
            SwiftCode,
            SortCode,
            DateReleased,
            DateExpired,
            IsCash,
            IsRemainAmontByCash,
            AmountTransfer,
            CurrencyID,
            AccountCompanyID,
            IBAN,
            Note,
            modalErrorDetail,
            numberAccount
        } = this.state;

        const {
                textLableInfo,
                contentViewControl,
                viewLable,
                viewControl,
                viewInputMultiline
            } = stylesListPickerControl,
            { textLableGroup, styleViewTitleGroup } = styleProfileInfo;

        let accountNoAliasTranslate = translate('HRM_Payroll_Sal_SalaryInformation_AccountNoGeneral');
        let accountNoMess = translate('HRM_PortalApp_BankAccount_AccountNoMaxLength50').replace(
            '[accountNo]',
            `[${accountNoAliasTranslate} ${numberAccount}]`
        );
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

        // listActions.push(
        //     {
        //         title: translate('HRM_Common_Close'),
        //         onPress: () => {
        //             DrawerServices.goBack();
        //         },
        //     }
        // );

        const listActionAdd = [];

        listActionAdd.push({
            type: EnumName.E_SAVE_CLOSE,
            title: translate('HRM_Common_Save'),
            onPress: () => this.onAddAccounts()
        });

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <AlertInModal ref={refs => (this.AlertSevice = refs)} />
                    <KeyboardAwareScrollView contentContainerStyle={CustomStyleSheet.flexGrow(1)}>
                        {isMultipleAccounts == false && (
                            <View>
                                <View style={styleViewTitleGroup}>
                                    <VnrText
                                        style={[styleSheets.text, textLableGroup]}
                                        i18nKey={'HRM_HR_GeneralInformation'}
                                    />
                                </View>

                                {/* Tài khoản trả lương - SalaryPaidAccount */}
                                {SalaryPaidAccount.visibleConfig && SalaryPaidAccount.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={SalaryPaidAccount.label}
                                            />

                                            {/* valid SalaryPaidAccount */}
                                            {fieldValid.SalaryPaidAccount && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPickerQuickly
                                                autoFilter={true}
                                                api={{
                                                    urlApi: '[URI_SYS]/Sys_GetData/GetEnum?text=SalaryPaidAccount',
                                                    type: 'E_GET'
                                                }}
                                                autoBind={true}
                                                value={SalaryPaidAccount.value}
                                                refresh={SalaryPaidAccount.refresh}
                                                textField="Text"
                                                valueField="Value"
                                                filter={true}
                                                filterServer={false}
                                                filterParams="Text"
                                                disable={SalaryPaidAccount.disable}
                                                onFinish={item => {
                                                    this.setState({
                                                        SalaryPaidAccount: {
                                                            ...SalaryPaidAccount,
                                                            value: item,
                                                            refresh: !SalaryPaidAccount.refresh
                                                        }
                                                    });
                                                }}
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Nhóm ngân hàng - GroupBank */}
                                {GroupBank.visibleConfig && GroupBank.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={GroupBank.label}
                                            />

                                            {/* valid GroupBank */}
                                            {fieldValid.GroupBank && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={GroupBank.disable}
                                                refresh={GroupBank.refresh}
                                                value={GroupBank.value}
                                                onChangeText={text =>
                                                    this.setState({
                                                        GroupBank: {
                                                            ...GroupBank,
                                                            value: text
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* File đính kèm - FileAttach */}
                                {FileAttach.visibleConfig && FileAttach.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={FileAttach.label}
                                            />
                                        </View>
                                        <View style={viewControl}>
                                            <VnrAttachFile
                                                disable={FileAttach.disable}
                                                value={FileAttach.value}
                                                multiFile={true}
                                                uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                                refresh={FileAttach.refresh}
                                                onFinish={file => {
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
                            </View>
                        )}

                        <View style={styleViewTitleGroup}>
                            <VnrText
                                style={[styleSheets.text, textLableGroup]}
                                i18nKey={'HRM_Payroll_SalaryInformation'}
                            />
                        </View>

                        <View>
                            {/*Tên tài khoản - AccountName */}
                            {AccountName.visibleConfig && AccountName.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={AccountName.label}
                                        />

                                        {/* valid AccountName */}
                                        {fieldValid.AccountName && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={AccountName.disable}
                                            refresh={AccountName.refresh}
                                            value={AccountName.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    AccountName: {
                                                        ...AccountName,
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Số sổ hộ khẩu - AccountNo */}
                            {AccountNo.visibleConfig && AccountNo.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={AccountNo.label} />

                                        {/* valid AccountNo */}
                                        {fieldValid.AccountNo && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            keyboardType={'numeric'}
                                            charType={'int'}
                                            disable={AccountNo.disable}
                                            refresh={AccountNo.refresh}
                                            value={AccountNo.value}
                                            onBlur={() => this.checkDulicateSalInfomation()}
                                            onSubmitEditing={() => this.checkDulicateSalInfomation()}
                                            onChangeText={text => {
                                                if (typeof text === 'string' && text.length > 50) {
                                                    ToasterSevice.showWarning(accountNoMess);
                                                    return;
                                                }

                                                this.setState({
                                                    AccountNo: {
                                                        ...AccountNo,
                                                        value: text,
                                                        refresh: !AccountNo.refresh
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Ngân hàng - BankID */}
                            {BankID.visibleConfig && BankID.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={BankID.label} />

                                        {/* valid BankID */}
                                        {fieldValid.BankID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerQuickly
                                            autoFilter={true}
                                            dataLocal={BankID.data}
                                            value={BankID.value}
                                            refresh={BankID.refresh}
                                            textField="BankCodeName"
                                            valueField="ID"
                                            filter={true}
                                            filterServer={false}
                                            filterParams="BankCodeName"
                                            disable={BankID.disable}
                                            onFinish={item => {
                                                this.setState(
                                                    {
                                                        BankID: {
                                                            ...BankID,
                                                            value: item,
                                                            refresh: !BankID.refresh
                                                        }
                                                    },
                                                    () => this.getBranchByID(item)
                                                );
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Chi nhánh - BranchID */}
                            {BranchID.visibleConfig && BranchID.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={BranchID.label} />

                                        {/* valid BranchID */}
                                        {fieldValid.BranchID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerQuickly
                                            autoFilter={true}
                                            dataLocal={BranchID.data ? BranchID.data : []}
                                            // api={
                                            //     {
                                            //         "urlApi": "[URI_HR]/Cat_GetData/GetBanchInfoByBankMulti",
                                            //         "type": "E_GET"
                                            //     }
                                            // }
                                            value={BranchID.value}
                                            refresh={BranchID.refresh}
                                            textField="BranchName"
                                            valueField="ID"
                                            filter={true}
                                            filterServer={false}
                                            filterParams="BranchName"
                                            disable={BranchID.disable}
                                            onFinish={item => this.onChangeBranchID(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Chi nhánh ngân hàng - BankBrandName */}
                            {BankBrandName.visibleConfig && BankBrandName.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={BankBrandName.label}
                                        />

                                        {/* valid BankBrandName */}
                                        {fieldValid.BankBrandName && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={BankBrandName.disable}
                                            refresh={BankBrandName.refresh}
                                            value={BankBrandName.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    BankBrandName: {
                                                        ...BankBrandName,
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Quốc gia - CountryID */}
                            {CountryID.visibleConfig && CountryID.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={CountryID.label} />

                                        {/* valid CountryID */}
                                        {fieldValid.CountryID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerQuickly
                                            autoFilter={true}
                                            api={{
                                                urlApi: '[URI_HR]/Cat_GetData/GetMultiCountry',
                                                type: 'E_GET'
                                            }}
                                            value={CountryID.value}
                                            refresh={CountryID.refresh}
                                            textField="CountryName"
                                            valueField="ID"
                                            filter={true}
                                            filterServer={true}
                                            filterParams="text"
                                            disable={CountryID.disable}
                                            onFinish={item => {
                                                this.setState({
                                                    CountryID: {
                                                        ...CountryID,
                                                        value: item,
                                                        refresh: !CountryID.refresh
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Tỉnh/Thành - ProvinceCodeName */}
                            {ProvinceCodeName.visibleConfig && ProvinceCodeName.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={ProvinceCodeName.label}
                                        />

                                        {/* valid ProvinceCodeName */}
                                        {fieldValid.ProvinceCodeName && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={ProvinceCodeName.disable}
                                            refresh={ProvinceCodeName.refresh}
                                            value={ProvinceCodeName.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    ProvinceCodeName: {
                                                        ...ProvinceCodeName,
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Địa chỉ - Address */}
                            {Address.visibleConfig && Address.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Address.label} />

                                        {/* valid Address */}
                                        {fieldValid.Address && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            style={[styleSheets.text, viewInputMultiline]}
                                            multiline={true}
                                            disable={Address.disable}
                                            refresh={Address.refresh}
                                            value={Address.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    Address: {
                                                        ...Address,
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Swift code - SwiftCode */}
                            {SwiftCode.visibleConfig && SwiftCode.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={SwiftCode.label} />

                                        {/* valid SwiftCode */}
                                        {fieldValid.SwiftCode && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={SwiftCode.disable}
                                            refresh={SwiftCode.refresh}
                                            value={SwiftCode.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    SwiftCode: {
                                                        ...SwiftCode,
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Sort code - SortCode */}
                            {SortCode.visibleConfig && SortCode.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={SortCode.label} />

                                        {/* valid SortCode */}
                                        {fieldValid.SortCode && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={SortCode.disable}
                                            refresh={SortCode.refresh}
                                            value={SortCode.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    SortCode: {
                                                        ...SortCode,
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Ngày phát hành - DateReleased */}
                            {DateReleased.visibleConfig && DateReleased.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={DateReleased.label}
                                        />

                                        {fieldValid.DateReleased && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={DateReleased.value}
                                            refresh={DateReleased.refresh}
                                            type={'date'}
                                            onFinish={value =>
                                                this.setState({
                                                    DateReleased: {
                                                        ...DateReleased,
                                                        value,
                                                        refresh: !DateReleased.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Ngày hết hạn - DateExpired */}
                            {DateExpired.visibleConfig && DateExpired.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={DateExpired.label}
                                        />

                                        {fieldValid.DateExpired && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={DateExpired.value}
                                            refresh={DateExpired.refresh}
                                            type={'date'}
                                            onFinish={value =>
                                                this.setState({
                                                    DateExpired: {
                                                        ...DateExpired,
                                                        value,
                                                        refresh: !DateExpired.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Thanh toán tiền mặt - IsCash */}
                            {IsCash.visibleConfig && IsCash.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={IsCash.label} />

                                        {fieldValid.IsCash && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                    </View>
                                    <View style={viewControl}>
                                        <CheckBox
                                            checkBoxColor={Colors.primary}
                                            checkedCheckBoxColor={Colors.primary}
                                            isChecked={IsCash.value}
                                            disable={IsCash.disable}
                                            onClick={() =>
                                                this.setState({
                                                    IsCash: {
                                                        ...IsCash,
                                                        value: !IsCash.value
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Số tiền mặt còn lại - IsRemainAmontByCash */}
                            {IsRemainAmontByCash.visibleConfig && IsRemainAmontByCash.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={IsRemainAmontByCash.label}
                                        />

                                        {fieldValid.IsRemainAmontByCash && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <CheckBox
                                            checkBoxColor={Colors.primary}
                                            checkedCheckBoxColor={Colors.primary}
                                            isChecked={IsRemainAmontByCash.value}
                                            disable={IsRemainAmontByCash.disable}
                                            onClick={() =>
                                                this.setState({
                                                    IsRemainAmontByCash: {
                                                        ...IsRemainAmontByCash,
                                                        value: !IsRemainAmontByCash.value
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Số tiền chuyển khoản - AmountTransfer */}
                            {AmountTransfer.visibleConfig && AmountTransfer.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={AmountTransfer.label}
                                        />

                                        {/* valid ProfileID */}
                                        {fieldValid.AmountTransfer && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={AmountTransfer.disable}
                                            refresh={AmountTransfer.refresh}
                                            value={AmountTransfer.value}
                                            keyboardType={'numeric'}
                                            charType={'double'}
                                            returnKeyType={'done'}
                                            onChangeText={text =>
                                                this.setState({
                                                    AmountTransfer: {
                                                        ...AmountTransfer,
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Tiền tệ chuyển khoản - CurrencyID */}
                            {CurrencyID.visibleConfig && CurrencyID.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={CurrencyID.label} />

                                        {/* valid CurrencyID */}
                                        {fieldValid.CurrencyID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerQuickly
                                            autoFilter={true}
                                            api={{
                                                urlApi: '[URI_HR]/Cat_GetData/GetMultiCurrency',
                                                type: 'E_GET'
                                            }}
                                            value={CurrencyID.value}
                                            refresh={CurrencyID.refresh}
                                            textField="CurrencyName"
                                            valueField="ID"
                                            filter={true}
                                            filterServer={false}
                                            filterParams="CurrencyName"
                                            disable={CurrencyID.disable}
                                            onFinish={item => {
                                                this.setState({
                                                    CurrencyID: {
                                                        ...CurrencyID,
                                                        value: item,
                                                        refresh: !CurrencyID.refresh
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Tài khoản chi trả - AccountCompanyID */}
                            {AccountCompanyID.visibleConfig && AccountCompanyID.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={AccountCompanyID.label}
                                        />

                                        {/* valid AccountCompanyID */}
                                        {fieldValid.AccountCompanyID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerQuickly
                                            autoFilter={true}
                                            api={{
                                                urlApi: '[URI_HR]/Cat_GetData/GetMultiAccountCompany',
                                                type: 'E_GET'
                                            }}
                                            autoBind={true}
                                            value={AccountCompanyID.value}
                                            refresh={AccountCompanyID.refresh}
                                            textField="AccountCompanyName"
                                            valueField="ID"
                                            filter={true}
                                            filterServer={false}
                                            filterParams="AccountCompanyName"
                                            disable={AccountCompanyID.disable}
                                            onFinish={item => {
                                                this.setState({
                                                    AccountCompanyID: {
                                                        ...AccountCompanyID,
                                                        value: item,
                                                        refresh: !AccountCompanyID.refresh
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Mã số BHXH - IBAN */}
                            {IBAN.visibleConfig && IBAN.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={IBAN.label} />

                                        {/* valid ProfileID */}
                                        {fieldValid.IBAN && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={IBAN.disable}
                                            refresh={IBAN.refresh}
                                            value={IBAN.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    IBAN: {
                                                        ...IBAN,
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Ghi chú - Note */}
                            {Note.visibleConfig && Note.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Note.label} />

                                        {/* valid ProfileID */}
                                        {fieldValid.Note && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            style={[styleSheets.text, viewInputMultiline]}
                                            multiline={true}
                                            disable={Note.disable}
                                            refresh={Note.refresh}
                                            value={Note.value}
                                            onChangeText={text =>
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
                    </KeyboardAwareScrollView>
                    {!isMultipleAccounts ? (
                        <ListButtonSave listActions={listActions} />
                    ) : (
                        <ListButtonSave listActions={listActionAdd} />
                    )}
                </View>
                {modalErrorDetail.isModalVisible && (
                    <Modal animationType="slide" transparent={true} isVisible={true}>
                        <View style={styleComonAddOrEdit.wrapModalError}>
                            <TouchableOpacity
                                style={[styleComonAddOrEdit.bgOpacity]}
                                onPress={() => this.closeModalErrorDetail()}
                            />
                            <SafeAreaView style={styleComonAddOrEdit.wrapContentModalError}>
                                <View style={styleComonAddOrEdit.wrapTitileHeaderModalError}>
                                    <VnrText
                                        style={[
                                            styleSheets.text,
                                            styleComonAddOrEdit.styRegister,
                                            styleComonAddOrEdit.fS16fW600
                                        ]}
                                        i18nKey={'HRM_PortalApp_Message_ErrorDetail'}
                                    />

                                    <TouchableOpacity onPress={() => this.closeModalErrorDetail()}>
                                        <IconCloseCircle size={Size.iconSize} color={Colors.white} />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView style={styleComonAddOrEdit.wrapLevelError}>
                                    {this.renderErrorDetail()}
                                </ScrollView>
                            </SafeAreaView>
                        </View>
                    </Modal>
                )}
            </SafeAreaView>
        );
    }
}
