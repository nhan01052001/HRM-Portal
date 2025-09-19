import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    Size,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import HttpService from '../../../../../utils/HttpService';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName, EnumIcon, ScreenName } from '../../../../../assets/constant';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { translate } from '../../../../../i18n/translate';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import format from 'number-format.js';

const initSateDefault = {
    ID: null,
    PaymentCostsGroupID: {
        label: 'HRM_Category_PaymentAmount_PaymentCostsGroupID',
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetMultiPaymentCostGroupMulti',
            type: 'E_GET'
        },
        valueField: 'ID',
        textField: 'PaymentCostGroupNameAndCode',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    PaymentAmountID: {
        label: 'HRM_sal_PaymentCostRegister_PaymentAmountName',
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetMultiListPaymentAmount_Portal',
            type: 'E_GET'
        },
        valueField: 'ID',
        textField: 'PaymentAmountNameAndCode',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    ComputationBasis: {
        label: 'HRM_Sal_PaymentCostRegister_ComputationBasis',
        disable: true,
        value: '',
        specification: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    FromDate: {
        label: 'HRM_Sal_PaymentCostRegister_Fromdate',
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true,
        disable: false
    },
    ToDate: {
        label: 'HRM_Sal_PaymentCostRegister_Todate',
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true,
        disable: false
    },
    Quantity: {
        label: 'HRM_Sal_PaymentCostRegister_Quantity',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    UnitView: {
        label: 'HRM_Sal_PaymentCostRegister_Unit',
        disable: true,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    Amount: {
        disable: true,
        value: 0,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    TotalAmount: {
        label: 'HRM_Sal_PaymentCostRegister_TotalAmount',
        disable: true,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    Notes: {
        label: 'HRM_Sal_PaymentCostRegister_Note',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    NoteOfSecretary: {
        label: 'HRM_Sal_PaymentCostRegister_NoteOfSecretary',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    Attachment: {
        label: 'HRM_Sal_PaymentCost_Attachment',
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },
    OrderNumber: null,
    SpecificationCustom: null,
    fieldValid: {}
};

export default class SalSubmitPaymentCostRegisterAddPay extends Component {
    constructor(props) {
        super(props);

        this.state = initSateDefault;

        //set title screen
        props.navigation.setParams({
            title:
                props.navigation.state.params && props.navigation.state.params.record
                    ? 'HRM_Sal_PaymentCostRegister_Edit_Title'
                    : 'HRM_Common_SearchAddPayCost',
            goback: this.goBack.bind(this)
        });

        this.setVariable();
    }

    goBack = () => {
        if (DrawerServices.getBeforeScreen() === ScreenName.SalSubmitPaymentCostRegisterAddOrEdit) {
            DrawerServices.navigate('SalSubmitPaymentCostRegister');
        } else {
            DrawerServices.goBack();
        }
    };
    //#region [khởi tạo - lấy các dữ liệu cho control, lấy giá trị mặc đinh]
    setVariable = () => {
        //biến trạng thái
        this.isModify = false;
        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;
    };

    refreshView = () => {
        this.props.navigation.setParams({ title: 'HRM_Common_SearchAddPayCost' });
        this.setVariable();

        initSateDefault.FromDate.refresh = !this.state.FromDate.refresh;
        initSateDefault.ToDate.refresh = !this.state.ToDate.refresh;
        initSateDefault.UnitView.value = translate('HRM_UNIT');
        initSateDefault.UnitView.refresh = !this.state.UnitView.refresh;

        this.setState(initSateDefault, () => this.getConfigValid('Sal_PaymentCostRegisterDetailInfo', true));
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
                        ConfigField && ConfigField.value['SalSubmitPaymentCostRegisterAddPay']
                            ? ConfigField.value['SalSubmitPaymentCostRegisterAddPay']['Hidden']
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

                        // let { record } = this.props.navigation.state.params;
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
        this.getConfigValid('Sal_PaymentCostRegisterDetailInfo');
    }

    initData = () => {
        VnrLoadingSevices.show();

        HttpService.MultiRequest([
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiPaymentCostGroupMulti'),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiListPaymentAmount_Portal')
        ]).then((res) => {
            VnrLoadingSevices.hide();

            const { PaymentCostsGroupID, PaymentAmountID, UnitView } = this.state;

            this.setState({
                PaymentCostsGroupID: {
                    ...PaymentCostsGroupID,
                    data: [...res[0]],
                    refresh: !PaymentCostsGroupID.refresh
                },
                PaymentAmountID: {
                    ...PaymentAmountID,
                    data: [...res[1]],
                    refresh: !PaymentAmountID.refresh
                },
                UnitView: {
                    ...UnitView,
                    value: translate('HRM_UNIT'),
                    refresh: !UnitView.refresh
                }
            });
        });
    };

    handleSetState = (record, res) => {
        const {
                Profile,
                Amount,
                Notes,
                Attachment,
                PaymentCostsGroupID,
                PaymentAmountID,
                FromDate,
                ToDate,
                Quantity,
                TotalAmount,
                NoteOfSecretary,
                ComputationBasis
            } = this.state,
            item = res[0],
            dataPaymentCostsGroupID = res[1],
            dataPaymentAmountID = res[2],
            dataSalaryClassPaymentCostRegister = res[3];


        let valuePaymentCostsGroupID = null,
            valuePaymentAmountID = null;

        if (Array.isArray(dataPaymentCostsGroupID) && dataPaymentCostsGroupID.length > 0) {
            valuePaymentCostsGroupID = dataPaymentCostsGroupID.find((item) => item?.ID === record?.PaymentCostsGroupID);
        }

        if (Array.isArray(dataPaymentAmountID) && dataPaymentAmountID.length > 0) {
            valuePaymentAmountID = dataPaymentAmountID.find((item) => item?.ID === record?.PaymentAmountID);
        }

        let nextState = {};

        nextState = {
            ID: record.ID,
            Profile: {
                ...Profile,
                ID: item.ProfileID,
                ProfileName: item.ProfileName
            },
            Amount: {
                ...Amount,
                value: dataSalaryClassPaymentCostRegister.Amount ? dataSalaryClassPaymentCostRegister.Amount.toString() : null,
                refresh: !Amount.refresh
            },
            Notes: {
                ...Notes,
                value: record.Notes,
                refresh: !Notes.refresh
            },
            Attachment: {
                ...Attachment,
                value: item.lstFileAttach,
                refresh: !Attachment.refresh
            },
            PaymentCostsGroupID: {
                ...PaymentCostsGroupID,
                data: [...dataPaymentCostsGroupID],
                value: valuePaymentCostsGroupID,
                refresh: !PaymentCostsGroupID.refresh
            },

            PaymentAmountID: {
                ...PaymentAmountID,
                data: [...dataPaymentAmountID],
                value: valuePaymentAmountID,
                refresh: !PaymentAmountID.refresh
            },
            FromDate: {
                ...FromDate,
                value: record?.FromDate ?? null,
                refresh: !FromDate.refresh
            },
            ToDate: {
                ...ToDate,
                value: record?.ToDate ?? null,
                refresh: !ToDate.refresh
            },
            Quantity: {
                ...Quantity,
                value: record?.Quantity ? `${record?.Quantity}` : null,
                refresh: !Quantity.refresh
            },
            OrderNumber: record?.OrderNumber ?? null,
            TotalAmount: {
                ...TotalAmount,
                value: record?.TotalAmount ? `${record?.TotalAmount}` : null,
                refresh: !TotalAmount.refresh
            },
            NoteOfSecretary: {
                ...NoteOfSecretary,
                value: record?.NoteOfSecretary ?? null,
                refresh: !NoteOfSecretary.refresh
            },
            ComputationBasis: {
                ...ComputationBasis,
                value: record.Specification,
                refresh: !ComputationBasis.refresh
            }
        };

        this.setState(nextState);
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        const { ID } = record;

        const dataBody = {
            dateTo: moment(record?.ToDate).format(),
            ProfileID: record?.ProfileID,
            PaymentAmountID: record?.PaymentAmountID
        };

        let arrRequest = [
            HttpService.Get('[URI_HR]/api/Sal_UnusualAllowance/GetById?ID=' + ID),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiPaymentCostGroupMulti'),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiListPaymentAmount_Portal'),
            HttpService.Post('[URI_HR]/Sal_GetData/GetSalaryClassPaymentCostRegister', dataBody)
        ];

        VnrLoadingSevices.show();
        HttpService.MultiRequest(arrRequest).then((res) => {
            VnrLoadingSevices.hide();
            try {
                if (res && res.length) {
                    _handleSetState(record, res);
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 5000);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };
    //#endregion

    onChangePaymentCostsGroup = (isStop) => {
        const { PaymentCostsGroupID, PaymentAmountID } = this.state;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Cat_GetData/GetMultiListPaymentAmount', {
            text: '',
            stringIDs: PaymentCostsGroupID.value ? PaymentCostsGroupID.value.ID : null
        }).then((data) => {
            VnrLoadingSevices.hide();

            if (PaymentCostsGroupID.value) {
                this.setState(
                    {
                        PaymentAmountID: {
                            ...PaymentAmountID,
                            data,
                            value: data[0],
                            refresh: !PaymentAmountID.refresh
                        }
                    },
                    () => this.onLoadData()
                );
            } else {
                this.setState(
                    {
                        PaymentAmountID: {
                            ...PaymentAmountID,
                            data,
                            value: null,
                            refresh: !PaymentAmountID.refresh
                        }
                    },
                    () => {
                        this.onLoadData();
                        if (isStop != true) {
                            this.onChangePaymentAmount();
                        }
                    }
                );
            }
        });
    };

    onChangePaymentAmount = (isStop) => {
        const { PaymentCostsGroupID, PaymentAmountID } = this.state;
        VnrLoadingSevices.show();

        HttpService.Post('[URI_HR]/Cat_GetData/GetMultiPaymentCostGroupMulti', {
            text: '',
            stringIDs: PaymentAmountID.value ? PaymentAmountID.value.ID : null
        }).then((data) => {
            VnrLoadingSevices.hide();

            if (PaymentAmountID.value) {
                this.setState(
                    {
                        PaymentCostsGroupID: {
                            ...PaymentCostsGroupID,
                            data,
                            value: data[0],
                            refresh: !PaymentCostsGroupID.refresh
                        }
                    },
                    () => this.onLoadData()
                );
            } else {
                this.setState(
                    {
                        PaymentCostsGroupID: {
                            ...PaymentCostsGroupID,
                            data,
                            value: null,
                            refresh: !PaymentCostsGroupID.refresh
                        }
                    },
                    () => {
                        this.onLoadData();
                        if (isStop != true) {
                            this.onChangePaymentCostsGroup(true);
                        }
                    }
                );
            }
        });
    };

    onChangeToDate = () => {
        const { MasterData } = this.props.navigation.state.params,
            { PaymentAmountID, ToDate, ComputationBasis, TotalAmount, Amount, Quantity } = this.state;

        if (PaymentAmountID.value) {
            VnrLoadingSevices.show();
            const dataBody = {
                dateTo: moment(ToDate).format(),
                ProfileID: MasterData.ProfileID,
                PaymentAmountID: PaymentAmountID.value.ID
            };

            HttpService.Post('[URI_HR]/Sal_GetData/GetSalaryClassPaymentCostRegister', dataBody).then((data) => {
                VnrLoadingSevices.hide();
                let nextState = {
                    ComputationBasis: {
                        ...ComputationBasis,
                        value: data.Specification,
                        refresh: !ComputationBasis.refresh
                    },
                    Amount: {
                        ...Amount,
                        value: data.Amount,
                        refresh: !Amount.refresh
                    }
                };

                let totalFormat = '';
                if (data.Amount && Quantity.value) {
                    totalFormat = format('#,###.#', Quantity.value * data.Amount);

                    nextState = {
                        ...nextState,
                        TotalAmount: {
                            ...TotalAmount,
                            value: totalFormat,
                            refresh: !TotalAmount.refresh
                        }
                    };
                }
                this.setState(nextState);
            });
        }
    };

    onLoadData = () => {
        const { PaymentAmountID, UnitView, Quantity, ComputationBasis, TotalAmount, ToDate } = this.state;
        if (PaymentAmountID.value) {
            VnrLoadingSevices.show();
            HttpService.Get('[URI_HR]/api/Cat_PaymentAmount/GetById?id=' + PaymentAmountID.value.ID).then((data) => {
                VnrLoadingSevices.hide();
                if (!data) {
                    ToasterSevice.showWarning(data.ActionStatus);
                } else {
                    let nextState = {
                        OrderNumber: data.OrderNumber,
                        SpecificationCustom: data.SpecificationCustom,
                        UnitView: {
                            ...UnitView,
                            value: data.UnitView,
                            refresh: !UnitView.refresh
                        }
                        // ComputationBasis: {
                        //   ...ComputationBasis,
                        //   value: data.ComputationBasis,
                        //   specification: data.Specification ? data.Specification : '',
                        //   refresh: !ComputationBasis.refresh
                        // }
                    };

                    // if (data.ComputationBasis && Quantity.value)
                    //   nextState = {
                    //     ...nextState,
                    //     TotalAmount: {
                    //       ...TotalAmount,
                    //       value: (data.ComputationBasis * Quantity.value).toString(),
                    //       specification: data.Specification ? data.Specification : '',
                    //       refresh: !TotalAmount.refresh
                    //     }
                    //   }
                    this.setState(nextState, () => {
                        if (ToDate.value) {
                            this.onChangeToDate();
                        }
                    });
                }
            });
        } else {
            this.setState({
                OrderNumber: null,
                SpecificationCustom: null,
                UnitView: {
                    ...UnitView,
                    value: null,
                    refresh: !UnitView.refresh
                },
                ComputationBasis: {
                    ...ComputationBasis,
                    value: null,
                    refresh: !ComputationBasis.refresh
                },
                TotalAmount: {
                    ...TotalAmount,
                    value: null,
                    refresh: !TotalAmount.refresh
                },
                Quantity: {
                    ...Quantity,
                    value: null,
                    refresh: !Quantity.refresh
                }
            });
        }
    };

    save = (navigation, isCreate) => {
        const { record, MasterData, fullDataCost } = this.props.navigation.state.params,
            {
                PaymentCostsGroupID,
                PaymentAmountID,
                ComputationBasis,
                FromDate,
                ToDate,
                Quantity,
                UnitView,
                TotalAmount,
                Notes,
                NoteOfSecretary,
                Attachment,
                OrderNumber,
                SpecificationCustom,
                ID
            } = this.state;

        let lstPaymentCost = [
            {
                ProfileID: MasterData.ProfileID,
                PaymentCostsGroupID: PaymentCostsGroupID.value ? PaymentCostsGroupID.value.ID : null,
                PaymentAmountID: PaymentAmountID.value ? PaymentAmountID.value.ID : null,
                ComputationBasis: ComputationBasis.value,
                FromDate: FromDate.value ? moment(FromDate.value).format('YYYY-MM-DD 00:00:00') : null,
                ToDate: ToDate.value ? moment(ToDate.value).format('YYYY-MM-DD 00:00:00') : null,
                Quantity: Quantity.value,
                UnitView: UnitView.value,
                TotalAmount: TotalAmount.value,
                Notes: Notes.value,
                NoteOfSecretary: NoteOfSecretary.value,
                OrderNumber: OrderNumber,
                SpecificationCustom: SpecificationCustom,
                Attachment: Attachment.value ? Attachment.value.map((item) => item.fileName).join(',') : null
            }
        ];

        if (Array.isArray(fullDataCost) && fullDataCost.length > 0 && ID) {
            fullDataCost.forEach((value) => {
                value.FromDate = FromDate.value ? moment(FromDate.value).format('YYYY-MM-DD 00:00:00') : null;
                value.ToDate = ToDate.value ? moment(ToDate.value).format('YYYY-MM-DD 00:00:00') : null;
            });
            let indexID = fullDataCost.findIndex((item) => item?.ID === ID);
            if (indexID > -1) {
                lstPaymentCost = [{
                    ...fullDataCost[indexID],
                    ProfileID: MasterData.ProfileID,
                    PaymentCostsGroupID: PaymentCostsGroupID.value ? PaymentCostsGroupID.value.ID : null,
                    PaymentAmountID: PaymentAmountID.value ? PaymentAmountID.value.ID : null,
                    ComputationBasis: ComputationBasis.value,
                    FromDate: FromDate.value ? moment(FromDate.value).format('YYYY-MM-DD 00:00:00') : null,
                    ToDate: ToDate.value ? moment(ToDate.value).format('YYYY-MM-DD 00:00:00') : null,
                    Quantity: Quantity.value,
                    UnitView: UnitView.value,
                    TotalAmount: TotalAmount.value,
                    Notes: Notes.value,
                    NoteOfSecretary: NoteOfSecretary.value,
                    OrderNumber: OrderNumber,
                    SpecificationCustom: SpecificationCustom,
                    Attachment: Attachment.value ? Attachment.value.map((item) => item.fileName).join(',') : null
                }];
            }
        }

        let param = {
            ...MasterData,
            lstPaymentCost
        };

        if (record && MasterData?.ID) {
            param = {
                ...param,
                ID: MasterData?.ID
            };
        }
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Sal_GetData/ValidatePaymentCost', param).then((data) => {
            VnrLoadingSevices.hide();

            //xử lý lại event Save
            this.isProcessing = false;

            if (data) {
                if (
                    data.Success == false &&
                    data.Messenger == 'HRM_PaymentCostRe_Please_Select_FromDateToDate_RequestPeriodNew'
                ) {
                    param = {
                        ...param,
                        StatusView: false
                    };

                    AlertSevice.alert({
                        title: translate('AlertsView'),
                        iconType: EnumIcon.E_WARNING,
                        message: translate('HRM_PaymentCostRe_Please_Select_FromDateToDate_RequestPeriodNew'),
                        onCancel: () => { },
                        onConfirm: () => {
                            param = {
                                ...param,
                                datanote: 'HRM_PaymentCostRe_Registered_Date_Outside_Of_Range'
                            };
                            this.saveCostPayment(param, navigation, isCreate);
                        }
                    });
                } else if (data.Success == true) {
                    this.saveCostPayment(param, navigation, isCreate);
                } else {
                    ToasterSevice.showWarning(data.Messenger);
                }
            }
        });
    };

    saveAndCreate = (navigation) => {
        this.save(navigation, true);
    };

    saveCostPayment = (param, navigation, isCreate) => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Sal_PaymentCostRegister', param).then((data) => {
            VnrLoadingSevices.hide();

            if (data.ActionStatus == 'Success') {
                ToasterSevice.showSuccess('Hrm_Succeed', 4000);

                const { reload, goBackScreen } = navigation.state.params;

                if (reload && typeof reload === 'function') {
                    reload();
                }

                if (isCreate) {
                    this.refreshView();
                } else if (goBackScreen) {
                    navigation.navigate(goBackScreen);
                } else {
                    navigation.navigate('SalSubmitPaymentCostRegister');
                }
            } else {
                ToasterSevice.showWarning(data.ActionStatus);
            }
        });
    };

    onSubmitQuantity = () => {
        const { Quantity, Amount, TotalAmount } = this.state;
        if (Quantity.value && Amount.value) {
            let totalFormat = format('#,###.#', Quantity.value * Amount.value);
            this.setState({
                TotalAmount: {
                    ...TotalAmount,
                    value: totalFormat,
                    refresh: !TotalAmount.refresh
                }
            });
        } else {
            this.setState({
                TotalAmount: {
                    ...TotalAmount,
                    value: null,
                    refresh: !TotalAmount.refresh
                }
            });
        }
    };

    render() {
        const {
                PaymentCostsGroupID,
                PaymentAmountID,
                ComputationBasis,
                FromDate,
                ToDate,
                Quantity,
                UnitView,
                TotalAmount,
                Notes,
                NoteOfSecretary,
                Attachment,
                fieldValid
            } = this.state,
            {
                textLableInfo,
                contentViewControl,
                viewLable,
                viewControl,
                controlDate_To,
                controlDate_from,
                formDate_To_From
            } = stylesListPickerControl,
            listActions = [
                {
                    type: EnumName.E_SAVE_CLOSE,
                    title: translate('HRM_Common_SaveClose'),
                    onPress: () => this.save(this.props.navigation)
                },
                {
                    type: EnumName.E_SAVE_NEW,
                    title: translate('HRM_Common_SaveNew'),
                    onPress: () => this.saveAndCreate(this.props.navigation)
                }
            ];

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                    >
                        {/* nhóm chi phí - PaymentCostsGroupID */}
                        {PaymentCostsGroupID.visibleConfig && PaymentCostsGroupID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={PaymentCostsGroupID.label}
                                    />

                                    {/* valid PaymentCostsGroupID */}
                                    {fieldValid.PaymentCostsGroupID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={PaymentCostsGroupID.data}
                                        refresh={PaymentCostsGroupID.refresh}
                                        textField={PaymentCostsGroupID.textField}
                                        valueField={PaymentCostsGroupID.valueField}
                                        filter={true}
                                        value={PaymentCostsGroupID.value}
                                        filterServer={false}
                                        disable={PaymentCostsGroupID.disable}
                                        onFinish={(item) =>
                                            this.setState(
                                                {
                                                    PaymentCostsGroupID: {
                                                        ...PaymentCostsGroupID,
                                                        value: item,
                                                        refresh: !PaymentCostsGroupID.refresh
                                                    }
                                                },
                                                () => this.onChangePaymentCostsGroup()
                                            )
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* khoản thanh toán chi phí - PaymentAmountID*/}
                        {PaymentAmountID.visibleConfig && PaymentAmountID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={PaymentAmountID.label}
                                    />

                                    {/* valid PaymentAmountID */}
                                    {fieldValid.PaymentAmountID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={PaymentAmountID.data}
                                        refresh={PaymentAmountID.refresh}
                                        textField={PaymentAmountID.textField}
                                        valueField={PaymentAmountID.valueField}
                                        filter={true}
                                        value={PaymentAmountID.value}
                                        filterServer={false}
                                        disable={PaymentAmountID.disable}
                                        onFinish={(item) =>
                                            this.setState(
                                                {
                                                    PaymentAmountID: {
                                                        ...PaymentAmountID,
                                                        value: item,
                                                        refresh: !PaymentAmountID.refresh
                                                    }
                                                },
                                                () => this.onChangePaymentAmount()
                                            )
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Thời gian - FromDate, ToDate */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={FromDate.label} />
                                <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={' - '} />
                                <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={ToDate.label} />

                                {/* valid FromDate */}
                                {fieldValid.FromDate && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>
                            <View style={viewControl}>
                                <View style={formDate_To_From}>
                                    <View style={controlDate_from}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={FromDate.value}
                                            refresh={FromDate.refresh}
                                            type={'date'}
                                            onFinish={(value) =>
                                                this.setState({
                                                    FromDate: {
                                                        ...FromDate,
                                                        value,
                                                        refresh: FromDate.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                    <View style={controlDate_To}>
                                        <VnrDate
                                            disable={ToDate.disable}
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={ToDate.value}
                                            refresh={ToDate.refresh}
                                            type={'date'}
                                            onFinish={(value) =>
                                                this.setState(
                                                    {
                                                        ToDate: {
                                                            ...ToDate,
                                                            value: value,
                                                            refresh: !ToDate.refresh
                                                        }
                                                    },
                                                    this.onChangeToDate
                                                )
                                            }
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Số lượng -  Quantity, Đơn vị tính - UnitView */}
                        {Quantity.visibleConfig && Quantity.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Quantity.label} />
                                    {fieldValid.Quantity && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>

                                <View style={formDate_To_From}>
                                    {/* Số lượng -  Quantity */}
                                    <View style={controlDate_from}>
                                        <VnrTextInput
                                            value={Quantity.value}
                                            refresh={Quantity.refresh}
                                            disable={Quantity.disable}
                                            keyboardType={'numeric'}
                                            charType={'double'}
                                            returnKeyType={'done'}
                                            onChangeText={(value) => {
                                                this.setState(
                                                    {
                                                        Quantity: {
                                                            ...Quantity,
                                                            value,
                                                            refresh: !Quantity.refresh
                                                        }
                                                    },
                                                    () => this.onSubmitQuantity()
                                                );
                                            }}
                                        // onBlur={this.onSubmitQuantity}
                                        // onSubmitEditing={this.onSubmitQuantity}
                                        />
                                    </View>

                                    {/* Đơn vị tính - UnitView */}
                                    <View style={controlDate_To}>
                                        <VnrTextInput
                                            disable={UnitView.disable}
                                            value={UnitView.value}
                                            refresh={UnitView.refresh}
                                        />
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* cơ sở tính - ComputationBasis */}
                        {ComputationBasis.visibleConfig && ComputationBasis.visible && (
                            <View>
                                <View style={[contentViewControl, styles.styViewLeaveDayCount]}>
                                    <Text style={[styleSheets.text, styles.styViewLeaveDayCountLable]}>
                                        {`${translate('HRM_Category_PaymentAmount_Specification')} : `}
                                    </Text>
                                    <VnrText
                                        style={[styleSheets.lable, styles.styViewLeaveDayCountValue]}
                                        value={`${ComputationBasis.value}`}
                                    />
                                </View>
                            </View>
                        )}

                        {/* tổng tiền - TotalAmount */}
                        {TotalAmount.visibleConfig && TotalAmount.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={TotalAmount.label} />
                                    {fieldValid.TotalAmount && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        value={TotalAmount.value}
                                        refresh={TotalAmount.refresh}
                                        disable={TotalAmount.disable}
                                        keyboardType={'numeric'}
                                        charType={'money'}
                                        returnKeyType={'done'}
                                        onChangeText={() => { }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ghi chú - Notes*/}
                        {Notes.visibleConfig && Notes.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Notes.label} />

                                    {/* valid Notes */}
                                    {fieldValid.Notes && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Notes.disable}
                                        refresh={Notes.refresh}
                                        value={Notes.value}
                                        onChangeText={(text) =>
                                            this.setState({
                                                Notes: {
                                                    ...Notes,
                                                    value: text,
                                                    refresh: !Notes.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* thư ký ghi chú - NoteOfSecretary*/}
                        {NoteOfSecretary.visibleConfig && NoteOfSecretary.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={NoteOfSecretary.label}
                                    />

                                    {/* valid NoteOfSecretary */}
                                    {fieldValid.NoteOfSecretary && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={NoteOfSecretary.disable}
                                        refresh={NoteOfSecretary.refresh}
                                        value={NoteOfSecretary.value}
                                        onChangeText={(text) =>
                                            this.setState({
                                                NoteOfSecretary: {
                                                    ...NoteOfSecretary,
                                                    value: text,
                                                    refresh: !NoteOfSecretary.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* File đính kèm- Attachment*/}
                        {Attachment.visibleConfig && Attachment.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Attachment.label} />

                                    {/* valid Attachment */}
                                    {fieldValid.Attachment && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrAttachFile
                                        disable={Attachment.disable}
                                        refresh={Attachment.refresh}
                                        value={Attachment.value}
                                        multiFile={true}
                                        uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                        onFinish={(file) =>
                                            this.setState({
                                                Attachment: {
                                                    ...Attachment,
                                                    value: file,
                                                    refresh: !Attachment.refresh
                                                }
                                            })
                                        }
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
}

const styles = StyleSheet.create({
    styViewLeaveDayCount: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -10
    },
    styViewLeaveDayCountLable: {
        color: Colors.gray_9,
        fontSize: Size.text - 3
    },
    styViewLeaveDayCountValue: {
        fontWeight: '600',
        color: Colors.primary,
        fontSize: Size.text - 2
    }
});
