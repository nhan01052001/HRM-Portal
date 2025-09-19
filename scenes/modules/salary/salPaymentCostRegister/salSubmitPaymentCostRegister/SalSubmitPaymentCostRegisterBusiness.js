import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../../utils/HttpService';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumIcon } from '../../../../../assets/constant';
import DrawerServices from '../../../../../utils/DrawerServices';

let enumName = EnumName,
    salSubmitPaymentCostRegister = ScreenName.SalSubmitPaymentCostRegister;

let _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];

    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[salSubmitPaymentCostRegister],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_MODIFY, E_ResourceName, E_Name, E_Rule, E_SENDMAIL, E_DELETE, E_CANCEL } = enumName;

        //action edit
        const actionEdit = businessAction ? businessAction.find((action) => action.Type === E_MODIFY) : null,
            actionEditResource = actionEdit ? actionEdit[E_ResourceName][E_Name] : null,
            actionEditRule = actionEdit ? actionEdit[E_ResourceName][E_Rule] : null,
            actionEditPer =
                actionEditResource && actionEditRule ? permission[actionEditResource][actionEditRule] : null;

        if (actionEditPer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_System_Resource_Sys_Edit'),
                    type: E_MODIFY,
                    onPress: (item, dataBody) => {
                        if (Array.isArray(item) && item.length > 0) {
                            // SalSubmitPaymentCostRegisterBusinessFunction.businessSendMailRecords(item, dataBody)
                        } else {
                            SalSubmitPaymentCostRegisterBusinessFunction.businessModifyRecord({ ...item }, dataBody);
                        }
                    },
                    ...actionEdit
                }
            ];
        }

        //action send mail
        const actionSendMail = businessAction ? businessAction.find((action) => action.Type === E_SENDMAIL) : null,
            actionSendMailResource = actionSendMail ? actionSendMail[E_ResourceName][E_Name] : null,
            actionSendMailRule = actionSendMail ? actionSendMail[E_ResourceName][E_Rule] : null,
            actionSendMailPer =
                actionSendMailResource && actionSendMailRule
                    ? permission[actionSendMailResource][actionSendMailRule]
                    : null;

        if (actionSendMailPer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_Common_SendMailHR_Button'),
                    type: E_SENDMAIL,
                    onPress: (item, dataBody) => {
                        if (Array.isArray(item) && item.length > 0) {
                            SalSubmitPaymentCostRegisterBusinessFunction.businessSendMailRecords(item, dataBody);
                        } else {
                            SalSubmitPaymentCostRegisterBusinessFunction.businessSendMailRecords(
                                [{ ...item }],
                                dataBody
                            );
                        }
                    },
                    ...actionSendMail
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_SendMailHR_Button'),
                    type: E_SENDMAIL,
                    onPress: (items, dataBody) =>
                        SalSubmitPaymentCostRegisterBusinessFunction.businessSendMailRecords(items, dataBody),
                    ...actionSendMail
                }
            ];
        }

        //action delete
        const actionDelete = businessAction ? businessAction.find((action) => action.Type === E_DELETE) : null,
            actionDeleteResource = actionDelete ? actionDelete[E_ResourceName][E_Name] : null,
            actionDeleteRule = actionDelete ? actionDelete[E_ResourceName][E_Rule] : null,
            actionDeletePer =
                actionDeleteResource && actionDeleteRule ? permission[actionDeleteResource][actionDeleteRule] : null;

        if (actionDeletePer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_Common_Delete'),
                    type: E_DELETE,
                    onPress: (item, dataBody) => {
                        if (Array.isArray(item) && item.length > 0) {
                            SalSubmitPaymentCostRegisterBusinessFunction.businessDeleteRecords(item, dataBody);
                        } else {
                            SalSubmitPaymentCostRegisterBusinessFunction.businessDeleteRecords([{ ...item }], dataBody);
                        }
                    },
                    ...actionDelete
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Delete'),
                    type: E_DELETE,
                    onPress: (item, dataBody) =>
                        SalSubmitPaymentCostRegisterBusinessFunction.businessDeleteRecords(item, dataBody),
                    ...actionDelete
                }
            ];
        }

        //action cancel
        const actionCancel = businessAction ? businessAction.find((action) => action.Type === E_CANCEL) : null,
            actionCancelResource = actionCancel ? actionCancel[E_ResourceName][E_Name] : null,
            actionCancelRule = actionCancel ? actionCancel[E_ResourceName][E_Rule] : null,
            actionCancelPer =
                actionCancelResource && actionCancelRule ? permission[actionCancelResource][actionCancelRule] : null;

        if (actionCancelPer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_Common_Cancel'),
                    type: E_CANCEL,
                    onPress: (item, dataBody) => {
                        if (Array.isArray(item) && item.length > 0) {
                            SalSubmitPaymentCostRegisterBusinessFunction.businessCancelRecords(item, dataBody);
                        } else {
                            SalSubmitPaymentCostRegisterBusinessFunction.businessCancelRecords([{ ...item }], dataBody);
                        }
                    },
                    ...actionCancel
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Cancel'),
                    type: E_CANCEL,
                    onPress: (item, dataBody) =>
                        SalSubmitPaymentCostRegisterBusinessFunction.businessCancelRecords(item, dataBody),
                    ...actionCancel
                }
            ];
        }

        // kiểm tra chi phí
        if (permission['New_Sal_ConfirmPaymentCost_New_Index_btnFeeCheck'] && permission['New_Sal_ConfirmPaymentCost_New_Index_btnFeeCheck']['View']) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_PortalApp_FeeCheck'),
                    type: 'E_FEECHECK',
                    onPress: (item, dataBody) => SalSubmitPaymentCostRegisterBusinessFunction.handleFeeCheck(item, dataBody),
                    Type: 'E_FEECHECK',
                    Resource: {
                        Name: 'New_Sal_ConfirmPaymentCost_New_Index_btnFeeCheck',
                        Rule: 'View'
                    },
                    Confirm: {
                        isInputText: false,
                        isValidInputText: false
                    }
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_PortalApp_FeeCheck'),
                    type: 'E_FEECHECK',
                    onPress: (item, dataBody) => SalSubmitPaymentCostRegisterBusinessFunction.handleFeeCheck(item, dataBody),
                    Type: 'E_FEECHECK',
                    Resource: {
                        Name: 'New_Sal_ConfirmPaymentCost_New_Index_btnFeeCheck',
                        Rule: 'View'
                    },
                    Confirm: {
                        isInputText: false,
                        isValidInputText: false
                    }
                }
            ];
        }

        return { rowActions: _rowActions, selected: _selected };
    }
};

export const SalSubmitPaymentCostRegisterBusinessFunction = {
    checkForReLoadScreen: {},
    setThisForBusiness: (dataThis) => {
        _this = dataThis;
    },
    //#region [action delete]
    businessDeleteRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map((item) => {
                return item.ID;
            });

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Sal_GetData/BusinessAllowActionDelete', {
                selectedID,
                screenName: salSubmitPaymentCostRegister,
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            })
                .then((res) => {
                    try {
                        if (res && typeof res === 'object') {
                            let isValid = res.isValid;
                            if (isValid) {
                                SalSubmitPaymentCostRegisterBusinessFunction.confirmDelete(res);
                                VnrLoadingSevices.hide();
                            } else if (isValid == false && res.message && typeof res.message === 'string') {
                                ToasterSevice.showWarning(res.message, 4000);
                                VnrLoadingSevices.hide();
                            } else {
                                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                VnrLoadingSevices.hide();
                            }
                        } else {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                            VnrLoadingSevices.hide();
                        }
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                        VnrLoadingSevices.hide();
                    }
                })
                .catch((error) => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    VnrLoadingSevices.hide();
                });
        }
    },

    confirmDelete: (objValid) => {
        let actionCancel = _rowActions.find((item) => item.Type === 'E_DELETE'),
            isConfirm = actionCancel['Confirm'];

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
                placeholder = translate('Reason');

            AlertSevice.alert({
                iconType: EnumIcon.E_DELETE,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                message: message,
                isInputText: isInputText,
                onCancel: () => { },
                onConfirm: (reason) => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        VnrLoadingSevices.show();

                        let strId =
                            objValid.strResultID && typeof objValid.strResultID === 'string'
                                ? objValid.strResultID
                                : '';

                        HttpService.Post('[URI_HR]/Sal_GetData/RemoveSelectedPaymentCostRegister', {
                            selectedIds: strId.split(','),
                            reason
                        }).then((res) => {
                            VnrLoadingSevices.hide();
                            try {
                                if (res && res !== '') {
                                    if (res == EnumName.E_Success) {
                                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                                        _this.reload('E_KEEP_FILTER', true);
                                    } else if (res == 'Locked') {
                                        ToasterSevice.showWarning('Hrm_Locked', 4000);
                                    } else {
                                        ToasterSevice.showWarning(res, 4000);
                                    }
                                } else {
                                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                }
                            } catch (error) {
                                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                            }
                        });
                    }
                }
            });
        } else {
            let strId = objValid.strResultID && typeof objValid.strResultID === 'string' ? objValid.strResultID : '';

            VnrLoadingSevices.show();

            HttpService.Post('[URI_HR]/Sal_GetData/RemoveSelectedPaymentCostRegister', {
                selectedIds: strId.split(',')
            }).then((res) => {
                VnrLoadingSevices.hide();
                try {
                    if (res && res !== '') {
                        if (res == EnumName.E_Success) {
                            ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                            _this.reload('E_KEEP_FILTER', true);
                        } else if (res == 'Locked') {
                            ToasterSevice.showWarning('Hrm_Locked', 4000);
                        } else {
                            ToasterSevice.showWarning(res, 4000);
                        }
                    } else {
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        }
    },
    //#endregion

    //#region [action delete detail payment]
    businessDeleteSalPaymentCost: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map((item) => {
                    return item.ID;
                }),
                res = {
                    isValid: true,
                    message:
                        translate('AreYouSureYouWantToDelete') +
                        ' ' +
                        selectedID.length +
                        ' ' +
                        translate('HRM_Message_RecordSelected'),
                    strResultID: selectedID
                };

            SalSubmitPaymentCostRegisterBusinessFunction.confirmDeleteSalPaymentCost(res);
        }
    },

    confirmDeleteSalPaymentCost: (objValid) => {
        let actionCancel = _rowActions.find((item) => item.Type === 'E_DELETE'),
            isConfirm = actionCancel['Confirm'];

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
                placeholder = translate('Reason');

            AlertSevice.alert({
                iconType: EnumIcon.E_DELETE,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                message: message,
                isInputText: isInputText,
                onCancel: () => { },
                onConfirm: (reason) => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        VnrLoadingSevices.show();

                        let strId = objValid.strResultID && objValid.strResultID.length > 0 ? objValid.strResultID : '';

                        HttpService.Post('[URI_HR]/Sal_GetData/RemoveSalPaymentCostSelected', {
                            selectedIds: strId,
                            reason
                        }).then((res) => {
                            VnrLoadingSevices.hide();
                            try {
                                if (res && res !== '') {
                                    if (res == EnumName.E_Success) {
                                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                                        _this.reload('E_KEEP_FILTER');
                                    } else if (res == 'Locked') {
                                        ToasterSevice.showWarning('Hrm_Locked', 4000);
                                    } else {
                                        ToasterSevice.showWarning(res, 4000);
                                    }
                                } else {
                                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                }
                            } catch (error) {
                                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                            }
                        });
                    }
                }
            });
        }
    },
    //#endregion

    //#region [action send mail]
    businessSendMailRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map((item) => {
                return item.ID;
            });

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Sal_GetData/BusinessAllowActionSendEmail', {
                selectedID,
                screenName: salSubmitPaymentCostRegister,
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            })
                .then((res) => {
                    try {
                        if (res && typeof res === 'object') {
                            let isValid = res.isValid;
                            if (isValid == true) {
                                SalSubmitPaymentCostRegisterBusinessFunction.confirmSendMail(res);
                                VnrLoadingSevices.hide();
                            } else if (isValid == false && res.message && typeof res.message === 'string') {
                                ToasterSevice.showWarning(res.message, 4000);
                                VnrLoadingSevices.hide();
                            } else {
                                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                VnrLoadingSevices.hide();
                            }
                        } else {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                            VnrLoadingSevices.hide();
                        }
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                        VnrLoadingSevices.hide();
                    }
                })
                .catch((error) => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    VnrLoadingSevices.hide();
                });
        }
    },

    confirmSendMail: (objValid) => {
        let actionCancel = _rowActions.find((item) => item.Type === 'E_SENDMAIL'),
            isConfirm = actionCancel['Confirm'];

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
                placeholder = translate('Reason');

            AlertSevice.alert({
                iconType: EnumIcon.E_SENDMAIL,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                isInputText: isInputText,
                message: message,
                onCancel: () => { },
                onConfirm: (reason) => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        const { apiConfig } = dataVnrStorage,
                            _uriPor = apiConfig ? apiConfig.uriPor : null;

                        VnrLoadingSevices.show();
                        let strId =
                            objValid.strResultID && typeof objValid.strResultID === 'string'
                                ? objValid.strResultID
                                : '';

                        HttpService.Post('[URI_HR]/Sal_GetData/SendMailHRPaymentCostRegister', {
                            host: _uriPor,
                            selectedIds: strId.split(','),
                            reason
                        })
                            .then((res) => {
                                try {
                                    if (res && res == EnumName.E_Success) {
                                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                                    }
                                    else if (res && typeof res === 'string') {
                                        ToasterSevice.showWarning(res, 4000);
                                    }
                                    else {
                                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                    }
                                    VnrLoadingSevices.hide();
                                    _this.reload('E_KEEP_FILTER');
                                } catch (error) {
                                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                                    VnrLoadingSevices.hide();
                                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                    _this.reload('E_KEEP_FILTER');
                                }
                            })
                            .catch((error) => {
                                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });

                                VnrLoadingSevices.hide();
                                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                _this.reload('E_KEEP_FILTER');
                            });
                    }
                }
            });
        } else {
            VnrLoadingSevices.show();
            let strId = objValid.strResultID && typeof objValid.strResultID === 'string' ? objValid.strResultID : '';

            const { apiConfig } = dataVnrStorage,
                _uriPor = apiConfig ? apiConfig.uriPor : null;

            HttpService.Post('[URI_HR]/Sal_GetData/SendMailHRPaymentCostRegister', {
                host: _uriPor,
                selectedIds: strId.split(',')
            })
                .then((res) => {
                    try {
                        if (res && res == EnumName.E_Success) {
                            ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        }
                        else if (res && typeof res === 'string') {
                            ToasterSevice.showWarning(res, 4000);
                        }
                        else {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                        }
                        VnrLoadingSevices.hide();
                        _this.reload('E_KEEP_FILTER');
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                        VnrLoadingSevices.hide();
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                        _this.reload('E_KEEP_FILTER');
                    }
                })
                .catch((error) => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });

                    VnrLoadingSevices.hide();
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                    _this.reload('E_KEEP_FILTER');
                });
        }
    },
    //#endregion

    //#region [action cancel]
    businessCancelRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map((item) => {
                return item.ID;
            });

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Sal_GetData/BusinessAllowActionCancel', {
                selectedID,
                screenName: salSubmitPaymentCostRegister,
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            })
                .then((res) => {
                    try {
                        if (res && typeof res === 'object') {
                            let isValid = res.isValid;
                            if (isValid) {
                                SalSubmitPaymentCostRegisterBusinessFunction.confirmCancel(res);
                                VnrLoadingSevices.hide();
                            } else if (isValid == false && res.message && typeof res.message === 'string') {
                                ToasterSevice.showWarning(res.message, 4000);
                                VnrLoadingSevices.hide();
                            } else {
                                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                VnrLoadingSevices.hide();
                            }
                        } else {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                            VnrLoadingSevices.hide();
                        }
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                        VnrLoadingSevices.hide();
                    }
                })
                .catch((error) => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });

                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                    VnrLoadingSevices.hide();
                });
        }
    },

    confirmCancel: (objValid) => {
        let actionCancel = _rowActions.find((item) => item.Type === 'E_CANCEL'),
            isConfirm = actionCancel['Confirm'];

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
                placeholder = translate('HRM_Common_CommentCancel');

            AlertSevice.alert({
                iconType: EnumIcon.E_CANCEL,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                isInputText: isInputText,
                message: message,
                onCancel: () => { },
                onConfirm: (reason) => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        VnrLoadingSevices.show();

                        let strId =
                            objValid.strResultID && typeof objValid.strResultID === 'string'
                                ? objValid.strResultID
                                : '';

                        HttpService.Post('[URI_HR]/Sal_Getdata/UpdateCancelPayCostRe', {
                            listId: strId,
                            CommentCancel: reason
                        })
                            .then((res) => {
                                try {
                                    if (res && res !== '') {
                                        if (res.Success) {
                                            ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                                            _this.reload('E_KEEP_FILTER');
                                        } else if (res.Messenger) {
                                            ToasterSevice.showWarning(res.Messenger, 4000);
                                        }
                                        // else {
                                        //     ToasterSevice.showWarning(res, 4000);
                                        // }
                                    } else {
                                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                    }
                                    VnrLoadingSevices.hide();
                                } catch (error) {
                                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                                    VnrLoadingSevices.hide();
                                }
                            })
                            .catch((error) => {
                                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                                VnrLoadingSevices.hide();
                            });
                    }
                }
            });
        } else {
            VnrLoadingSevices.show();
            let strId = objValid.strResultID && typeof objValid.strResultID === 'string' ? objValid.strResultID : '';
            HttpService.Post('[URI_HR]/Sal_Getdata/UpdateCancelPayCostRe', {
                listId: strId
            })
                .then((res) => {
                    try {
                        if (res && res !== '') {
                            if (res.Success) {
                                ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                                _this.reload('E_KEEP_FILTER');
                            } else if (res.Messenger) {
                                ToasterSevice.showWarning(res.Messenger, 4000);
                            }
                            // else {
                            //     ToasterSevice.showWarning(res, 4000);
                            // }
                        } else {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                        }
                        VnrLoadingSevices.hide();
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                        VnrLoadingSevices.hide();
                    }
                })
                .catch((error) => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    VnrLoadingSevices.hide();
                });
        }
    },
    //#endregion

    //#region [modify]
    businessModifyRecord: (item, MasterData, fullDataCost) => {

        if (item?.PaymentCostRegisterID && MasterData) {
            const { reload } = _this;
            _this.props.navigation.navigate('SalSubmitPaymentCostRegisterAddPay', { record: item, MasterData: MasterData, reload, fullDataCost });
            return;
        }


        VnrLoadingSevices.show();
        const { ID } = item;

        if (!ID) {
            ToasterSevice.showWarning('StatusNotAction');
            return;
        }

        HttpService.Get('[URI_HR]/Sal_GetData/GetSalPaymentCostRegisterById?id=' + ID).then((res) => {
            VnrLoadingSevices.hide();

            try {
                if (res && res.BusinessAllowAction && res.BusinessAllowAction.indexOf('E_MODIFY') >= 0) {
                    const { reload } = _this;
                    _this.props.navigation.navigate('SalSubmitPaymentCostRegisterAddOrEdit', { record: res, reload });
                } else {
                    ToasterSevice.showWarning('StatusNotAction');
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    },
    //#endregion

    // #region kiểm tra chi phí
    handleFeeCheck: (item) => {
        if (!item?.RequestPeriod) {

            // không được bỏ trống!
            ToasterSevice.showWarning('[Kỳ yêu cầu] không được bỏ trống!');
            return;
        }

        try {
            let params = {
                CodeEmp: null,
                RequestPeriod: item?.RequestPeriod,
                RequestPeriodName: item?.RequestPeriodName,
                PaymentPeriod: null,
                page: 1,
                pageSize: 20
            };

            DrawerServices.navigate('SalFeeCheck', params);

        } catch (error) {
            VnrLoadingSevices.hide();
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }

    }
    //#endregion
};
