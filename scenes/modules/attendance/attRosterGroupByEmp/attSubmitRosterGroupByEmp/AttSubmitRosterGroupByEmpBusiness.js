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
    attSubmitRosterGroupByEmp = ScreenName.AttSubmitRosterGroupByEmp;

let _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];

    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[attSubmitRosterGroupByEmp],
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
                    onPress: (item, dataBody) => {
                        if (Array.isArray(item) && item.length > 0) {
                            // AttSubmitRosterGroupByEmpBusinessFunction.businessSendMailRecords(item, dataBody)
                        } else {
                            AttSubmitRosterGroupByEmpBusinessFunction.businessModifyRecord({ ...item }, dataBody);
                        }
                    },
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
                    onPress: (item, dataBody) => {
                        if (Array.isArray(item) && item.length > 0) {
                            AttSubmitRosterGroupByEmpBusinessFunction.businessSendMailRecords(item, dataBody);
                        } else {
                            AttSubmitRosterGroupByEmpBusinessFunction.businessSendMailRecords([{ ...item }], dataBody);
                        }
                    },
                    ...actionSendMail
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_SendMail'),
                    type: E_SENDMAIL,
                    onPress: (items, dataBody) =>
                        AttSubmitRosterGroupByEmpBusinessFunction.businessSendMailRecords(items, dataBody),
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
                    onPress: (item, dataBody) => {
                        if (Array.isArray(item) && item.length > 0) {
                            AttSubmitRosterGroupByEmpBusinessFunction.businessDeleteRecords(item, dataBody);
                        } else {
                            AttSubmitRosterGroupByEmpBusinessFunction.businessDeleteRecords([{ ...item }], dataBody);
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
                        AttSubmitRosterGroupByEmpBusinessFunction.businessDeleteRecords(item, dataBody),
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
                    onPress: (item, dataBody) => {
                        if (Array.isArray(item) && item.length > 0) {
                            AttSubmitRosterGroupByEmpBusinessFunction.businessCancelRecords(item, dataBody);
                        } else {
                            AttSubmitRosterGroupByEmpBusinessFunction.businessCancelRecords([{ ...item }], dataBody);
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
                        AttSubmitRosterGroupByEmpBusinessFunction.businessCancelRecords(item, dataBody),
                    ...actionCancel
                }
            ];
        }

        return { rowActions: _rowActions, selected: _selected };
    }
};

export const AttSubmitRosterGroupByEmpBusinessFunction = {
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

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionDelete', {
                selectedID,
                screenName: 'AttSubmitRosterGroupByEmp',
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            })
                .then(res => {
                    try {
                        if (res && typeof res === 'object') {
                            let isValid = res.isValid;
                            if (isValid) {
                                AttSubmitRosterGroupByEmpBusinessFunction.confirmDelete(res);
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
                .catch(error => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    VnrLoadingSevices.hide();
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
                        VnrLoadingSevices.show();

                        let strId =
                            objValid.strResultID && typeof objValid.strResultID === 'string'
                                ? objValid.strResultID
                                : '';

                        HttpService.Post('[URI_POR]/New_Att_RosterGroupByEmp/RemoveSelected', {
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
                                        ToasterSevice.showWarning('ObjectIsLockedV2', 4000);
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

            HttpService.Post('[URI_POR]/New_Att_RosterGroupByEmp/RemoveSelected', {
                selectedIds: strId.split(',')
            }).then(res => {
                VnrLoadingSevices.hide();

                try {
                    if (res && res !== '') {
                        if (res == 'Success') {
                            ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                            _this.reload('E_KEEP_FILTER', true);
                        } else if (res == 'Locked') {
                            ToasterSevice.showWarning('ObjectIsLockedV2', 4000);
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
                screenName: 'AttSubmitRosterGroupByEmp',
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            })
                .then(res => {
                    try {
                        if (res && typeof res === 'object') {
                            let isValid = res.isValid;
                            if (isValid == true) {
                                AttSubmitRosterGroupByEmpBusinessFunction.confirmSendMail(res);
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
                .catch(error => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    VnrLoadingSevices.hide();
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
                        const { apiConfig } = dataVnrStorage,
                            _uriPor = apiConfig ? apiConfig.uriPor : null;

                        VnrLoadingSevices.show();
                        let strId =
                            objValid.strResultID && typeof objValid.strResultID === 'string'
                                ? objValid.strResultID
                                : '';

                        HttpService.Post('[URI_HR]/Att_GetData/ProcessSendMailRosterGroupByEmp', {
                            host: _uriPor,
                            selectedIds: strId.split(','),
                            reason
                        })
                            .then(res => {
                                try {
                                    if (res && res.success) {
                                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                                    } else if (res && !res.success) {
                                        if (res.mess.Key == 'Hrm_Locked') {
                                            ToasterSevice.showWarning('ObjectIsLockedV2', 4000);
                                        } else {
                                            ToasterSevice.showWarning(res.mess.Value);
                                        }
                                    } else {
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
                            .catch(error => {
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

            HttpService.Post('[URI_HR]/Att_GetData/ProcessSendMailRosterGroupByEmp', {
                host: _uriPor,
                selectedIds: strId.split(',')
            })
                .then(res => {
                    try {
                        if (res && res.success) {
                            ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        } else if (res && !res.success) {
                            if (res.mess.Key == 'Hrm_Locked') {
                                ToasterSevice.showWarning('ObjectIsLockedV2', 4000);
                            } else {
                                ToasterSevice.showWarning(res.mess.Value);
                            }
                        } else {
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
                .catch(error => {
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
            let selectedID = items.map(item => {
                return item.ID;
            });

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionCancel', {
                selectedID,
                screenName: 'AttSubmitRosterGroupByEmp',
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            })
                .then(res => {
                    try {
                        if (res && typeof res === 'object') {
                            let isValid = res.isValid;
                            if (isValid) {
                                AttSubmitRosterGroupByEmpBusinessFunction.confirmCancel(res);
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
                .catch(error => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });

                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                    VnrLoadingSevices.hide();
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
                        VnrLoadingSevices.show();

                        let strId =
                            objValid.strResultID && typeof objValid.strResultID === 'string'
                                ? objValid.strResultID
                                : '';

                        HttpService.Post('[URI_HR]/Att_GetData/ChangeStatusCancelRosterGroupByEmp', {
                            selectedIDs: strId,
                            commentCancel: reason
                        })
                            .then(res => {
                                try {
                                    if (res && res !== '') {
                                        if (res == 'Success') {
                                            ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                                            _this.reload('E_KEEP_FILTER');
                                        } else if (res == 'Locked') {
                                            ToasterSevice.showWarning('ObjectIsLockedV2', 4000);
                                        } else if (res.indexOf('FieldLengthError') >= 0) {
                                            ToasterSevice.showWarning(res.split('|')[1]);
                                        } else {
                                            ToasterSevice.showWarning(res, 4000);
                                        }
                                    } else {
                                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                    }
                                    VnrLoadingSevices.hide();
                                } catch (error) {
                                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                                    VnrLoadingSevices.hide();
                                }
                            })
                            .catch(error => {
                                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                                VnrLoadingSevices.hide();
                            });
                    }
                }
            });
        } else {
            VnrLoadingSevices.show();
            let strId = objValid.strResultID && typeof objValid.strResultID === 'string' ? objValid.strResultID : '';
            HttpService.Post('[URI_HR]/Att_GetData/ChangeStatusCancelRosterGroupByEmp', {
                selectedIDs: strId
            })
                .then(res => {
                    try {
                        if (res && res !== '') {
                            if (res == 'Success') {
                                ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                                _this.reload('E_KEEP_FILTER');
                            } else if (res == 'Locked') {
                                ToasterSevice.showWarning('ObjectIsLockedV2', 4000);
                            } else if (res.indexOf('FieldLengthError') >= 0) {
                                ToasterSevice.showWarning(res.split('|')[1]);
                            } else {
                                ToasterSevice.showWarning(res, 4000);
                            }
                        } else {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                        }
                        VnrLoadingSevices.hide();
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                        VnrLoadingSevices.hide();
                    }
                })
                .catch(error => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    VnrLoadingSevices.hide();
                });
        }
    },
    //#endregion

    //#region [modify]
    businessModifyRecord: item => {
        const { reload } = _this,
            { ID } = item;

        VnrLoadingSevices.show();
        HttpService.Get('[URI_HR]/Att_GetData/GetRosterGroupByEmpByIDApp?id=' + ID).then(data => {
            VnrLoadingSevices.hide();
            if (data) {
                if (data.Status == 'E_LOCKED') {
                    ToasterSevice.showWarning('DataIsLocked');
                } else {
                    _this.props.navigation.navigate('AttSubmitRosterGroupByEmpAddOrEdit', { record: data, reload });
                }
            }
        });
    }
    //#endregion
};
