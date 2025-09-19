import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Modal, ScrollView, Text } from 'react-native';
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
import { translate } from '../../../../../i18n/translate';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import DrawerServices from '../../../../../utils/DrawerServices';
import HttpService from '../../../../../utils/HttpService';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import { IconPlus, IconCloseCircle } from '../../../../../constants/Icons';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import { BankAccountConfirmedBusinessFunction } from './bankAccountConfirmed/BankAccountConfirmedBusinessFunction';
import BankAccountListItem from './bankAccountList/BankAccountListItem';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';
import { EnumIcon } from '../../../../../assets/constant';
import { AlertSevice } from '../../../../../components/Alert/Alert';

const initSateDefault = {
    //IsCheckFormat: null,
    // StrBlockRelativesCodeTax: null,
    // IsExcludeProbation: null,
    // StrBlockRelativesIDNo: null,
    // IsBlockRelativesIDNo: null,
    // IsBlockRelativesCodeTax: null,
    ID: null,
    totalAccount: 0,
    isMultipleAccounts: true,
    Profile: {},

    SalaryPaidAccount: {
        label: 'HRM_Payroll_Sal_SalaryInformation_SalaryPaidAccount',
        disable: false,
        refresh: false,
        value: false,
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
    NumberOfAccount: {
        label: 'HRM_Payroll_Sal_SalaryInformation_NumberOfAccount',
        disable: true,
        refresh: false,
        value: '',
        visibleConfig: true,
        visible: true
    },
    // thông tin tài khoản
    fieldValid: {},
    isUpperCaseText: {},

    dataSource: {},
    isRefresh: false,

    totalBank: '',
    modalErrorDetail: {
        isModalVisible: false,
        cacheID: null,
        data: []
    },
    salaryPaidAccountEnums: ''
};

export default class BankAccountMultiAddOrEdit extends Component {
    constructor(props) {
        super(props);
        this.state = initSateDefault;
        this.setVariable();

        if (
            props.navigation.state &&
            props.navigation.state.params &&
            props.navigation.state.params.record &&
            props.navigation.state.params.record.ID
        ) {
            props.navigation.setParams({
                title: 'HRM_Payroll_Sal_SalaryInformation_PopUp_Edit_Title'
            });
        } else {
            props.navigation.setParams({
                title: 'HRM_PortalApp_Sal_SalaryInformation_PopUp_Create_Title'
            });
        }

        this.listItemOpenSwipeOut = [];
        this.oldIndexOpenSwipeOut = null;
    }

    //#region [khởi tạo , lấy các dữ liệu cho control, lấy giá trị mặc đinh]

    setVariable = () => {
        this.isModify = false;

        this.isProcessing = false;
        this.profileInfo = dataVnrStorage && dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info : {};

        // Thông báo chi tiết lỗi
        this.IsContinueSave = false;
        this.ProfileRemoveIDs = null;
        this.IsRemoveAndContinue = null;
        this.CacheID = null;

        this.ToasterSevice = {
            showError: null,
            showSuccess: null,
            showWarning: null,
            showInfo: null
        };

        this.AlertSevice = {
            alert: null
        };
    };

    //promise get config valid
    getConfigValid = (tblName, isRefresh) => {
        VnrLoadingSevices.show();
        HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName).then(resConfigValid => {
            if (resConfigValid) {
                try {
                    VnrLoadingSevices.hide();
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
                        totalAccount: 0,
                        isMultipleAccounts: true,
                        dataSource: {}
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
        });
    };

    componentDidMount() {
        this.getConfigValid('Sal_SalaryInformationView');
        this.getMaximumAccountNumber();
    }

    getConfig = () => {
        // this.getBranchByID();
        // this.getDefaultValue();
    };

    setRecordForModify = response => {
        let nextState = {};
        let { SalaryPaidAccount, GroupBank, FileAttach, dataSource, isRefresh } = this.state;

        nextState = {
            ID: response.ID ? response.ID : null,
            SalaryPaidAccount: {
                ...SalaryPaidAccount,
                value: response.SalaryPaidAccount
                    ? { Value: response.SalaryPaidAccount, Text: response.SalaryPaidAccountView }
                    : '',
                refresh: !SalaryPaidAccount.refresh
            },
            GroupBank: {
                ...GroupBank,
                value: response.GroupBank ? response.GroupBank : '',
                refresh: !GroupBank.refresh
            },
            FileAttach: {
                ...FileAttach,
                value: response.lstFileAttach,
                refresh: !FileAttach.refresh
            }
        };

        if (response.NumberOfAccount) {
            let _totalAccount = response.NumberOfAccount ? response.NumberOfAccount.split('_')[2] : 0;
            for (let _number = 1; _number <= parseInt(_totalAccount); _number++) {
                let _accountNumber = `E_ACCOUNTS_${_number}`,
                    txtNumber = _number != 1 ? _number : '';
                dataSource = {
                    ...dataSource,
                    [_accountNumber]: {
                        accountNumber: _number,
                        AccountName: response[`AccountName${txtNumber}`],
                        AccountNo: response[`AccountNo${txtNumber}`],
                        BankID: response[`BankID${txtNumber}`],
                        BankCode: response[`BankCode${txtNumber}`],
                        BankName: response[`BankName${txtNumber}`],
                        BranchName: response[`BankName${txtNumber}`],
                        BranchID: response[`BranchID${txtNumber}`],
                        BankBrandName: response[`BankBrandName${txtNumber}`],
                        CountryID: response[`Country${txtNumber}ID`],
                        CountryName: response[`CountryName${txtNumber}`],
                        ProvinceCodeName: response[`ProvinceCodeName${txtNumber}`],
                        Address: response[`Address${txtNumber}`],
                        SwiftCode: response[`SwiftCode${txtNumber}`],
                        SortCode: response[`SortCode${txtNumber}`],
                        DateReleased: response[`DateReleased${txtNumber}`],
                        DateExpired: response[`DateExpired${txtNumber}`],
                        IsCash: response[`IsCash${txtNumber}`],
                        IsRemainAmontByCash: response[`IsRemainAmontByCash${txtNumber}`],
                        AmountTransfer: response[`AmountTransfer${txtNumber}`],
                        CurrencyID: response[`CurrencyID${txtNumber}`],
                        CurrencyName: response[`CurrencyName${txtNumber}`],
                        ['AccountCompany1ID']: response[`AccountCompany${_number}ID`],
                        ['AccountCompany1Name']: response[`AccountCompany${_number}Name`],
                        IBAN: response[`IBAN${txtNumber}`],
                        ['Note1']: response[`Note${_number}`]
                    }
                };
            }

            nextState = {
                ...nextState,
                totalAccount: parseInt(_totalAccount),
                dataSource: dataSource,
                isRefresh: !isRefresh
            };
        }

        this.setState(nextState, () => this.getEnumSalaryPaidAccount());
    };

    onSaveAndCreate = () => {
        this.onSave(true, null);
    };

    onSaveAndSend = () => {
        this.onSave(null, true);
    };

    addAccount = item => {
        let { dataSource, totalAccount, isRefresh } = this.state;
        let _accountNumber = null,
            _number = null;

        if (item.accountNumber) {
            _accountNumber = `E_ACCOUNTS_${item.accountNumber}`;
            _number = item.accountNumber;
        } else if (item) {
            _accountNumber = `E_ACCOUNTS_${totalAccount}`;
            _number = totalAccount;
        }

        dataSource = {
            ...dataSource,
            [_accountNumber]: {
                accountNumber: _number,
                ...item
            }
        };

        this.setState(
            {
                dataSource,
                isRefresh: !isRefresh
            },
            () => this.getEnumSalaryPaidAccount()
        );
    };

    rollbackAccount = () => {
        let { totalAccount } = this.state;
        totalAccount -= 1;
        this.setState({ totalAccount: totalAccount <= 0 ? 0 : totalAccount });
    };

    newItem = () => {
        let { totalAccount } = this.state;
        totalAccount += 1;
        if (totalAccount < 14) {
            this.setState({ totalAccount }, () => {
                DrawerServices.navigate('BankAccountAddOrEdit', {
                    numberAccount: totalAccount,
                    isMultipleAccounts: true,
                    addAccount: this.addAccount,
                    rollbackAccount: this.rollbackAccount
                });
            });
        }
    };

    deleteRecords = item => {
        let { dataSource, totalAccount, SalaryPaidAccount } = this.state;
        let _accountNumber = `E_ACCOUNTS_${item.accountNumber}`;

        if (dataSource[_accountNumber]) {
            // Xóa object
            let newData = { ...dataSource };
            delete newData[_accountNumber];

            // Đưa oject về đúng thứ tự 1 => 13
            totalAccount -= 1;
            const newDataArrray = Object.values(newData);
            let newSource = {};

            for (let _number = 1; _number <= parseInt(totalAccount); _number++) {
                let _accountNumber = `E_ACCOUNTS_${_number}`;
                newSource = {
                    ...newSource,
                    [_accountNumber]: {
                        ...newDataArrray[_number - 1],
                        accountNumber: _number
                    }
                };
            }
            let SalaryPaidAccountNumber = parseInt(SalaryPaidAccount?.value.Value.match(/\d+/)[0]),
                selectPaidAccount = null;

            if (totalAccount >= SalaryPaidAccountNumber) {
                selectPaidAccount = SalaryPaidAccount.value;
            } else {
                selectPaidAccount = {
                    Value: 'E_ACCOUNT_1',
                    Text: translate('HRM_PortalApp_FirstSalPaidAccount'),
                    Number: 1
                };
            }

            this.setState(
                {
                    dataSource: newSource,
                    totalAccount: totalAccount,
                    SalaryPaidAccount: {
                        ...SalaryPaidAccount,
                        value: selectPaidAccount ? selectPaidAccount : null
                    }
                },
                () => this.getEnumSalaryPaidAccount()
            );
        }
    };

    modifyRecord = item => {
        let { dataSource } = this.state;
        let _accountNumber = `E_ACCOUNTS_${item.accountNumber}`;

        if (dataSource[_accountNumber]) {
            DrawerServices.navigate('BankAccountAddOrEdit', {
                record: dataSource[_accountNumber],
                numberAccount: item.accountNumber,
                isMultipleAccounts: true,
                addAccount: this.addAccount
            });
        }
    };

    // return an array have value same
    toFindDuplicates(arry) {
        if (Array.isArray(arry)) {
            const uniqueElements = new Set(arry);
            const filteredElements = arry.filter(item => {
                if (uniqueElements.has(item)) {
                    uniqueElements.delete(item);
                } else {
                    return item;
                }
            });

            return filteredElements;
        }
    }

    // Kiểm tra trùng lặp trong mảng
    getDuplicateElementIndex(list) {
        let indices = [];

        list.filter(function (item, index) {
            if (item.AccountNo && list.findIndex(e => e.AccountNo === item.AccountNo) !== index) {
                indices.push(list.findIndex(e => e.AccountNo === item.AccountNo));
                indices.push(index);
            }
            return indices.length > 2;
        });

        return indices;
    }

    onSave = (isCreate, isSend, isContinue) => {
        if (this.isProcessing) {
            return;
        }

        const { ID, totalAccount, dataSource, SalaryPaidAccount, GroupBank, FileAttach, modalErrorDetail } = this.state;
        let params = {},
            accountNumber = `E_ACCOUNTS_${totalAccount}`;

        if (ID) {
            let arrTemp = Object.values(dataSource).map(item => {
                if (item?.AccountNo) {
                    return item?.AccountNo;
                } else {
                    return 'NULL';
                }
            });
            let valueSame = [];
            let mess = '';

            const duplicateElements = this.toFindDuplicates(arrTemp);
            if (Array.isArray(duplicateElements) && duplicateElements.length > 0) {
                arrTemp.map((item, index) => {
                    if (item === duplicateElements[0]) {
                        valueSame.push(index);
                    }
                });
            }

            if (valueSame.length >= 2) {
                mess = translate('HRM_PortalApp_Duplicate_AccountNo').replace('[value1]', Number(valueSame[0]) + 1);
                mess = mess.replace('[value2]', Number(valueSame[1]) + 1);
                ToasterSevice.showWarning(mess);
                return;
            }
        }

        if (dataSource && Object.keys(dataSource).length > 0) {
            params = {
                numberAccount: accountNumber,
                NumberOfAccount: accountNumber,

                ProfileID: this.profileInfo.ProfileID,
                UserID: this.profileInfo.userid,
                // -------------//
                SalaryPaidAccount: SalaryPaidAccount.value?.Value ? SalaryPaidAccount.value?.Value : null,
                GroupBank: GroupBank.value,
                FileAttach: FileAttach.value ? FileAttach.value.map(item => item.fileName).join(',') : null,
                FileAttachment: FileAttach.value ? FileAttach.value.map(item => item.fileName).join(',') : null,
                ListMiniModelSave: []
            };

            Object.keys(dataSource).forEach(key => {
                let dataItem = dataSource[key];
                let txtNumber = dataItem.accountNumber != 1 ? dataItem.accountNumber : '';

                const {
                    AccountName,
                    AccountNo,
                    BankID,
                    BranchID,
                    BankBrandName,
                    CountryID,
                    CountryName,
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
                    IBAN,
                    AccountCompany1ID,
                    Note1
                } = dataItem;

                params?.ListMiniModelSave.push({
                    AccountName: AccountName,
                    AccountNo: AccountNo,
                    BankID: BankID,
                    BranchID: BranchID,
                    BankBrandName: BankBrandName,
                    CountryID: CountryID,
                    CountryName: CountryName,
                    ProvinceCodeName: ProvinceCodeName,
                    Address: Address,
                    SwiftCode: SwiftCode,
                    SortCode: SortCode,
                    CurrencyID: CurrencyID,
                    AmountTransfer: AmountTransfer,
                    AccountCompanyID: AccountCompany1ID,
                    IBAN: IBAN,
                    Note: Note1,
                    DateReleased: DateReleased,
                    DateExpired: DateExpired,
                    BankAccountIndex: txtNumber,
                    IsRemainAmontByCash: IsRemainAmontByCash,
                    IsCash: IsCash
                });

                // params = {
                //     ...params,
                //     [`AccountName${txtNumber}`]: AccountName,
                //     [`AccountNo${txtNumber}`]: AccountNo,
                //     [`BankID${txtNumber}`]: BankID ? BankID : null,
                //     [`BranchID${txtNumber}`]: BranchID ? BranchID : null,
                //     [`BankBrandName${txtNumber}`]: BankBrandName,
                //     [`CountryID${txtNumber}`]: CountryID ? CountryID : null,
                //     [`ProvinceCodeName${txtNumber}`]: ProvinceCodeName,
                //     [`Address${txtNumber}`]: Address,
                //     [`SwiftCode${txtNumber}`]: SwiftCode,
                //     [`SortCode${txtNumber}`]: SortCode,
                //     [`DateReleased${txtNumber}`]: DateReleased ? Vnr_Function.formatDateAPI(DateReleased) : null,
                //     [`DateExpired${txtNumber}`]: DateExpired ? Vnr_Function.formatDateAPI(DateExpired) : null,
                //     [`IsCash${txtNumber}`]: IsCash,
                //     [`IsRemainAmontByCash${txtNumber}`]: IsRemainAmontByCash,
                //     [`AmountTransfer${txtNumber}`]: AmountTransfer,
                //     [`CurrencyID${txtNumber}`]: CurrencyID ? CurrencyID : null,
                //     [`AccountCompany${numberAccount}ID`]: AccountCompany1ID ? AccountCompany1ID : '',
                //     [`IBAN${txtNumber}`]: IBAN,
                //     [`Note${numberAccount}`]: Note1 ? Note1 : '',
                // }
            });

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

            if (isContinue) {
                params = {
                    ...params,
                    IsPassCheckAccountNoDuplicate: true,
                    IsPassChangeBankAccount: true
                };
            }

            var duplicates = this.getDuplicateElementIndex(params.ListMiniModelSave);
            if (duplicates && duplicates.length >= 2) {
                let accountNoAliasTranslate = translate('HRM_Payroll_Sal_SalaryInformation_AccountNoGeneral');
                let mess = '';
                mess = translate('HRM_Payroll_Sal_SalaryInformation_AccountNo_AccountNo_Duplicate2').replace(
                    '[1]',
                    `[${accountNoAliasTranslate} ${duplicates[0] + 1}]`
                );
                mess = mess.replace('[2]', `[${accountNoAliasTranslate} ${duplicates[1] + 1}]`);
                ToasterSevice.showError(mess, 4000);
            } else {
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
                                            message: translate(
                                                'HRM_Attendance_Message_InvalidRequestDataPleaseCheckAgain'
                                            ),
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
                                            message: translate(
                                                'HRM_Attendance_Message_InvalidRequestDataPleaseCheckAgain'
                                            ),
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
            }
        } else {
            ToasterSevice.showWarning('HRM_PortalApp_InputValue_Please');
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

    handerOpenSwipeOut = indexOnOpen => {
        if (this.oldIndexOpenSwipeOut !== null && this.oldIndexOpenSwipeOut != indexOnOpen) {
            if (
                this.listItemOpenSwipeOut[this.oldIndexOpenSwipeOut] &&
                this.listItemOpenSwipeOut[this.oldIndexOpenSwipeOut]['value'] != null
            ) {
                this.listItemOpenSwipeOut[this.oldIndexOpenSwipeOut]['value'].close();
            }
        }
        this.oldIndexOpenSwipeOut = indexOnOpen;
    };

    getMaximumAccountNumber() {
        HttpService.Get('[URI_HR]/Sal_GetData/GetConfigMaximumAccountNumber')
            .then(res => {
                if (res !== null && res.MaximumBankAccountNumber) {
                    this.setState({
                        totalBank: res.MaximumBankAccountNumber
                    });
                } else if (res === null) {
                    this.setState({
                        totalBank: 13
                    });
                }
            })
            .catch(() => {
                //
            });
    }

    getEnumSalaryPaidAccount() {
        //lọc enum tài khoản trả lương theo đúng số bộ tài khoản
        HttpService.Get('[URI_SYS]/Sys_GetData/GetEnum?text=SalaryPaidAccount')
            .then(res => {
                if (res) {
                    let { dataSource } = this.state;
                    const filteredData = res.filter(account => {
                        const key = `E_ACCOUNTS_${account.Number}`;
                        return dataSource[key] && dataSource[key].accountNumber === account.Number;
                    });

                    // Sắp xếp filteredData theo thứ tự tăng dần của số tài khoản
                    filteredData.sort((a, b) => a.Number - b.Number);

                    this.setState({
                        salaryPaidAccountEnums: filteredData
                    });
                }
            })
            .catch(() => {
                //
            });
    }

    render() {
        const {
            fieldValid,
            SalaryPaidAccount,
            GroupBank,
            FileAttach,
            totalAccount,
            dataSource,
            NumberOfAccount,
            isRefresh,
            totalBank,
            modalErrorDetail,
            salaryPaidAccountEnums
        } = this.state;

        const {
                textLableInfo,
                contentViewControl,
                viewLable,
                viewControl
            } = stylesListPickerControl,
            { textLableGroup, styleViewTitleGroup } = styleProfileInfo;

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

        const rowActions = [
            {
                title: translate('HRM_System_Resource_Sys_Edit'),
                type: EnumName.E_MODIFY,
                onPress: item => this.modifyRecord(item)
            },
            {
                title: translate('HRM_Common_Delete'),
                type: EnumName.E_DELETE,
                onPress: item => this.deleteRecords(item)
            }
        ];

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView contentContainerStyle={CustomStyleSheet.flexGrow(1)}>
                        <View style={styleViewTitleGroup}>
                            <VnrText style={[styleSheets.text, textLableGroup]} i18nKey={'HRM_HR_GeneralInformation'} />
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
                                        dataLocal={salaryPaidAccountEnums}
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
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={GroupBank.label} />

                                    {/* valid GroupBank */}
                                    {fieldValid.GroupBank && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
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

                        {/* Số lượng tài khoản - NumberOfAccount */}
                        {NumberOfAccount.visibleConfig && NumberOfAccount.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={NumberOfAccount.label}
                                    />

                                    {/* valid Address */}
                                    {fieldValid.NumberOfAccount && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>

                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={NumberOfAccount.disable}
                                        refresh={NumberOfAccount.refresh}
                                        value={
                                            totalAccount != 0
                                                ? translate(`NumberOfAccounts__E_ACCOUNTS_${totalAccount}`)
                                                : ''
                                        }
                                        onChangeText={text =>
                                            this.setState({
                                                NumberOfAccount: {
                                                    ...NumberOfAccount,
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
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={FileAttach.label} />
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

                        <View style={styleViewTitleGroup}>
                            <VnrText
                                style={[styleSheets.text, textLableGroup]}
                                i18nKey={'HRM_Payroll_SalaryInformation'}
                            />
                        </View>

                        <View style={styles.styListAc}>
                            {dataSource &&
                                Object.keys(dataSource).length > 0 &&
                                Object.keys(dataSource).map((key, index) => {
                                    const item = dataSource[key];
                                    item.BusinessAllowAction = 'E_DELETE,E_MODIFY';
                                    return (
                                        <TouchableWithoutFeedback key={index} onPressIn={() => this.handerOpenSwipeOut(index)}>
                                            <View style={styles.styListAcItem}>
                                                <BankAccountListItem
                                                    index={index}
                                                    isPullToRefresh={isRefresh}
                                                    dataItem={item}
                                                    listItemOpenSwipeOut={this.listItemOpenSwipeOut}
                                                    rowActions={rowActions}
                                                    isFromAddOrEdit={true}
                                                />
                                            </View>
                                        </TouchableWithoutFeedback>
                                    );
                                })}
                        </View>
                    </KeyboardAwareScrollView>

                    {totalAccount < totalBank && ( //số tài khoản lớn hơn tổng tài khoản cho phép thì ẩn nút
                        <TouchableOpacity style={styles.styBtnAddCost} onPress={() => this.newItem()}>
                            <IconPlus size={Size.iconSizeHeader + 10} color={Colors.white} />
                        </TouchableOpacity>
                    )}

                    <ListButtonSave listActions={listActions} />
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

const sizeBtnAdd = Size.iconSizeHeader + 30;
const styles = StyleSheet.create({
    styBtnAddCost: {
        position: 'absolute',
        height: sizeBtnAdd,
        width: sizeBtnAdd,
        borderRadius: sizeBtnAdd / 2,
        justifyContent: 'center',
        alignItems: 'center',
        bottom: Size.deviceWidth * 0.2,
        backgroundColor: Colors.neutralGreen,
        right: Size.defineSpace,

        elevation: 1,
        zIndex: 1
    },
    styListAc: {
        flex: 1,
        marginTop: Size.defineHalfSpace,
        marginBottom: Size.defineSpace * 3
    },
    styListAcItem: {
        marginTop: Size.defineHalfSpace
    }
});
