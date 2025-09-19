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
    attSubmitTSLRegister = ScreenName.AttSubmitTSLRegister,
    attSubmitTSLRegisterAddOrEdit = ScreenName.AttSubmitTSLRegisterAddOrEdit;

let _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];

    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[attSubmitTSLRegister],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_MODIFY, E_ResourceName, E_Name, E_Rule, E_SENDMAIL, E_DELETE, E_CANCEL } = enumName;

        //action edit
        const actionEdit = businessAction ? businessAction.find(action => action.Type === E_MODIFY) : null,
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
                    onPress: (item, dataBody) =>
                        AttSubmitTSLRegisterBusinessFunction.businessModifyRecord({ ...item }, dataBody),
                    ...actionEdit
                }
            ];
        }

        //action send mail
        const actionSendMail = businessAction ? businessAction.find(action => action.Type === E_SENDMAIL) : null,
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
                    title: translate('HRM_Common_SendMail'),
                    type: E_SENDMAIL,
                    onPress: (item, dataBody) =>
                        AttSubmitTSLRegisterBusinessFunction.businessSendMailRecords([{ ...item }], dataBody),
                    ...actionSendMail
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_SendMail'),
                    type: E_SENDMAIL,
                    onPress: (items, dataBody) =>
                        AttSubmitTSLRegisterBusinessFunction.businessSendMailRecords(items, dataBody),
                    ...actionSendMail
                }
            ];
        }

        //action delete
        const actionDelete = businessAction ? businessAction.find(action => action.Type === E_DELETE) : null,
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
                    onPress: (item, dataBody) =>
                        AttSubmitTSLRegisterBusinessFunction.businessDeleteRecords([{ ...item }], dataBody),
                    ...actionDelete
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Delete'),
                    type: E_DELETE,
                    onPress: (item, dataBody) =>
                        AttSubmitTSLRegisterBusinessFunction.businessDeleteRecords(item, dataBody),
                    ...actionDelete
                }
            ];
        }

        //action cancel
        const actionCancel = businessAction ? businessAction.find(action => action.Type === E_CANCEL) : null,
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
                    onPress: (item, dataBody) =>
                        AttSubmitTSLRegisterBusinessFunction.businessCancelRecords([{ ...item }], dataBody),
                    ...actionCancel
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Cancel'),
                    type: E_CANCEL,
                    onPress: (item, dataBody) =>
                        AttSubmitTSLRegisterBusinessFunction.businessCancelRecords(item, dataBody),
                    ...actionCancel
                }
            ];
        }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const AttSubmitTSLRegisterBusinessFunction = {
    setThisForBusiness: dataThis => {
        _this = dataThis;
    },
    //#region [action delete]
    businessDeleteRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map(item => {
                return item.ID;
            });
            // AttSubmitTSLRegisterBusinessFunction.confirmDelete({
            //     strResultID: selectedID.join(','),
            //     message: 'test'
            // });
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionDelete', {
                selectedID,
                screenName: 'AttSubmitTSLRegister',
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && typeof res === 'object') {
                        let isValid = res.isValid;
                        if (isValid) {
                            AttSubmitTSLRegisterBusinessFunction.confirmDelete(res);
                        } else if (isValid == false && res.message && typeof res.message === 'string') {
                            ToasterSevice.showWarning(res.message, 4000);
                        } else {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
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

    confirmDelete: objValid => {
        let actionCancel = _rowActions.find(item => item.Type === 'E_DELETE'),
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
                onCancel: () => {},
                onConfirm: reason => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        let strId =
                            objValid.strResultID && typeof objValid.strResultID === 'string'
                                ? objValid.strResultID
                                : '';

                        VnrLoadingSevices.show();
                        HttpService.Post('[URI_HR]/Att_GetData/RemoveSelectedTamScanLogRegister', {
                            selectedIds: strId.split(','),
                            reason
                        }).then(res => {
                            VnrLoadingSevices.hide();
                            try {
                                if (res && res !== '') {
                                    if (res == 'Success') {
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
            HttpService.Post('[URI_HR]/Att_GetData/RemoveSelectedTamScanLogRegister', {
                selectedIds: strId.split(',')
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && res !== '') {
                        if (res == 'Success') {
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

    //#region [action send mail]
    businessSendMailRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map(item => {
                return item.ID;
            });

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionSendEmail', {
                selectedID,
                screenName: 'AttSubmitTSLRegister',
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && typeof res === 'object') {
                        let isValid = res.isValid;
                        if (isValid == true) {
                            AttSubmitTSLRegisterBusinessFunction.confirmSendMail(res);
                        } else if (isValid == false && res.message && typeof res.message === 'string') {
                            ToasterSevice.showWarning(res.message, 4000);
                        } else {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
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

    confirmSendMail: objValid => {
        let actionCancel = _rowActions.find(item => item.Type === 'E_SENDMAIL'),
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
                onCancel: () => {},
                onConfirm: reason => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        let strId =
                                objValid.strResultID && typeof objValid.strResultID === 'string'
                                    ? objValid.strResultID.split(',')
                                    : '';

                        const { apiConfig } = dataVnrStorage,
                            _uriPor = apiConfig ? apiConfig.uriPor : null;

                        VnrLoadingSevices.show();
                        HttpService.Post('[URI_HR]/Att_GetData/ProcessSendMailInOut', {
                            host: _uriPor,
                            selectedIds: strId,
                            reason
                        }).then(res => {
                            VnrLoadingSevices.hide();
                            try {
                                if (res && res.success) {
                                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                                    _this.reload('E_KEEP_FILTER');
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
            let strId =
                objValid.strResultID && typeof objValid.strResultID === 'string' ? objValid.strResultID.split(',') : '';
            const { apiConfig } = dataVnrStorage,
                _uriPor = apiConfig ? apiConfig.uriPor : null;

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/ProcessSendMailInOut', {
                host: _uriPor,
                selectedIds: strId
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && res.success) {
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        _this.reload('E_KEEP_FILTER');
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

    //#region [action cancel]
    businessCancelRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map(item => {
                return item.ID;
            });

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionCancel', {
                selectedID,
                screenName: 'AttSubmitTSLRegister',
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && typeof res === 'object') {
                        let isValid = res.isValid;
                        if (isValid) {
                            AttSubmitTSLRegisterBusinessFunction.confirmCancel(res);
                        } else if (isValid == false && res.message && typeof res.message === 'string') {
                            ToasterSevice.showWarning(res.message, 4000);
                        } else {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
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

    confirmCancel: objValid => {
        let actionCancel = _rowActions.find(item => item.Type === 'E_CANCEL'),
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
                onCancel: () => {},
                onConfirm: reason => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        let strId =
                            objValid.strResultID && typeof objValid.strResultID === 'string'
                                ? objValid.strResultID
                                : '';
                        VnrLoadingSevices.show();
                        HttpService.Post('[URI_HR]/Att_GetData/ChangeStatusCancelRegisterV2', {
                            selectedIds: strId,
                            RejectReason: reason
                        }).then(res => {
                            VnrLoadingSevices.hide();
                            try {
                                if (res && res !== '') {
                                    if (res == 'Success') {
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
        } else {
            let strId = objValid.strResultID && typeof objValid.strResultID === 'string' ? objValid.strResultID : '';
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/ChangeStatusCancelRegisterV2', {
                selectedIds: strId
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && res !== '') {
                        if (res == 'Success') {
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
    },
    //#endregion

    //#region [modify]
    businessModifyRecord: item => {
        const { reload } = _this;
        _this.props.navigation.navigate(attSubmitTSLRegisterAddOrEdit, { record: item, reload });
    }
    //#endregion
};
