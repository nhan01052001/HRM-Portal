import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../../utils/HttpService';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumIcon, EnumStatus } from '../../../../../assets/constant';
import DrawerServices from '../../../../../utils/DrawerServices';

let enumName = EnumName;

let _this = null,
    _rowActions = [],
    _selected = [];

const { apiConfig } = dataVnrStorage,
    _uriPor = apiConfig ? apiConfig.uriPor : null;

export const generateRowActionAndSelected = screenName => {
    _rowActions = [];
    _selected = [];

    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[screenName],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_MODIFY, E_ResourceName, E_Name, E_Rule, E_SENDMAIL, E_DELETE, E_CANCEL, E_REQUEST_CANCEL } = enumName;

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
                        AttSubmitTakeLeaveDayBusinessFunction.businessModifyRecord({ ...item }, dataBody, item),
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
                    title: translate('HRM_CommonSendEmail'),
                    type: E_SENDMAIL,
                    onPress: (item, dataBody) =>
                        AttSubmitTakeLeaveDayBusinessFunction.businessSendMailRecords(
                            Array.isArray(item) ? item : [{ ...item }],
                            dataBody
                        ),
                    ...actionSendMail
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_CommonSendEmail'),
                    type: E_SENDMAIL,
                    onPress: (items, dataBody) =>
                        AttSubmitTakeLeaveDayBusinessFunction.businessSendMailRecords(items, dataBody),
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
                        AttSubmitTakeLeaveDayBusinessFunction.businessDeleteRecords(
                            Array.isArray(item) ? item : [{ ...item }],
                            dataBody
                        ),
                    ...actionDelete
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Delete'),
                    type: E_DELETE,
                    onPress: (item, dataBody) =>
                        AttSubmitTakeLeaveDayBusinessFunction.businessDeleteRecords(item, dataBody),
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
                        AttSubmitTakeLeaveDayBusinessFunction.businessCancelRecords(
                            Array.isArray(item) ? item : [{ ...item }],
                            dataBody
                        ),
                    ...actionCancel
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Cancel'),
                    type: E_CANCEL,
                    onPress: (item, dataBody) =>
                        AttSubmitTakeLeaveDayBusinessFunction.businessCancelRecords(item, dataBody),
                    ...actionCancel
                }
            ];
        }

        //action Request cancel
        const actionRequestCancel = businessAction
                ? businessAction.find(action => action.Type === E_REQUEST_CANCEL)
                : null,
            actionRequestCancelResource = actionRequestCancel ? actionRequestCancel[E_ResourceName][E_Name] : null,
            actionRequestCancelRule = actionRequestCancel ? actionRequestCancel[E_ResourceName][E_Rule] : null,
            actionRequestCancelPer =
                actionRequestCancelResource && actionRequestCancelRule
                    ? permission[actionRequestCancelResource][actionRequestCancelRule]
                    : null;

        if (actionRequestCancelPer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_Att_RequireCancel'),
                    type: E_REQUEST_CANCEL,
                    onPress: (item, dataBody) =>
                        AttSubmitTakeLeaveDayBusinessFunction.businessRequestCancelRecords(
                            Array.isArray(item) ? item : [{ ...item }],
                            dataBody
                        ),
                    ...actionRequestCancel
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Att_RequireCancel'),
                    type: E_REQUEST_CANCEL,
                    onPress: (item, dataBody) =>
                        AttSubmitTakeLeaveDayBusinessFunction.businessRequestCancelRecords(item, dataBody),
                    ...actionCancel
                }
            ];
        }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const AttSubmitTakeLeaveDayBusinessFunction = {
    checkForReLoadScreen: {
        AttSubmitTakeLeaveDay: false,
        AttSaveTempSubmitTakeLeaveDay: false,
        AttCanceledSubmitTakeLeaveDay: false,
        AttApproveSubmitTakeLeaveDay: false,
        AttApprovedSubmitTakeLeaveDay: false,
        AttRejectSubmitTakeLeaveDay: false
    },
    setThisForBusiness: dataThis => {
        _this = dataThis;
    },
    //#region [action delete]
    businessDeleteRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = [];

            items.forEach(item => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_DELETE) > -1) {
                    selectedID.push(item.ID);
                }
            });

            if (selectedID.length == 0) {
                ToasterSevice.showWarning('HRM_PortalApp_Status_AllowDelete', 4000);
                return;
            }

            VnrLoadingSevices.show();
            HttpService.Post('[URI_CENTER]/api/Att_LeaveDay/CheckStatusLeaveForDelete', {
                ListRecordID: selectedID,
                UserLogin: dataVnrStorage.currentUser.headers.userlogin,
                UserProcessID: dataVnrStorage.currentUser.headers.userid,
                Host: _uriPor
            }).then(res => {
                VnrLoadingSevices.hide();
                if (res && res.Status == EnumName.E_SUCCESS) {
                    if (res.Data && res.Data.length > 0) {
                        let numberRow = res.Data.length == 1 ? '1' : `${res.Data.length}/${items.length}`,
                            keyTrans = translate('HRM_PortalApp_Message_DeleteConfirm');

                        AttSubmitTakeLeaveDayBusinessFunction.confirmDelete({
                            strResultID: res.Data,
                            message: keyTrans.replace('[E_NUMBER]', numberRow)
                        });
                    } else {
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                    }
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
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
                        AttSubmitTakeLeaveDayBusinessFunction.setDelete(objValid);
                    }
                }
            });
        } else {
            AttSubmitTakeLeaveDayBusinessFunction.setDelete(objValid);
        }
    },

    setDelete: objValid => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_CENTER]/api/Att_LeaveDay/DeleteLeaveDayHandle', {
            ListRecordID: objValid.strResultID,
            UserLogin: dataVnrStorage.currentUser.headers.userlogin,
            UserProcessID: dataVnrStorage.currentUser.headers.userid,
            Host: _uriPor
        }).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res && res.Status == EnumName.E_SUCCESS) {
                    ToasterSevice.showSuccess(res.Message, 4000);
                    AttSubmitTakeLeaveDayBusinessFunction.checkForReLoadScreen[ScreenName.AttSubmitTakeLeaveDay] = true;
                    _this.reload('E_KEEP_FILTER', true);
                } else if (res && res.Message && typeof res.Message == 'string') {
                    ToasterSevice.showError(res.Message, 4000);
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    },
    //#endregion

    //#region [action send mail]
    businessSendMailRecords: (items, dataBody) => {

        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = [];
            items.forEach(item => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_SENDMAIL) > -1) {
                    selectedID.push(item.ID);
                }
            });

            if (selectedID.length == 0) {
                ToasterSevice.showWarning('HRM_PortalApp_Status_IsSended', 4000);
                return;
            } else {
                AttSubmitTakeLeaveDayBusinessFunction.setSendMail({
                    strResultID: selectedID,
                    message: ''
                });
            }
        }
    },

    setSendMail: objValid => {
        const { apiConfig } = dataVnrStorage,
            _uriPor = apiConfig ? apiConfig.uriPor : null;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_CENTER]/api/Att_LeaveDay/ProcessingSendMailLeaveDay', {
            ListRecordID: objValid.strResultID,
            UserLogin: dataVnrStorage.currentUser.headers.userlogin,
            UserProcessID: dataVnrStorage.currentUser.headers.userid,
            Host: _uriPor
        }).then(res => {
            VnrLoadingSevices.hide();
            if (res && res.Status == EnumName.E_SUCCESS) {
                ToasterSevice.showSuccess(res.Message, 4000);
                _this.reload('E_KEEP_FILTER', true);
                AttSubmitTakeLeaveDayBusinessFunction.checkForReLoadScreen[ScreenName.AttSubmitTakeLeaveDay] = true;
                AttSubmitTakeLeaveDayBusinessFunction.checkForReLoadScreen[
                    ScreenName.AttApproveSubmitTakeLeaveDay
                ] = true;
                AttSubmitTakeLeaveDayBusinessFunction.checkForReLoadScreen[
                    ScreenName.AttSaveTempSubmitTakeLeaveDay
                ] = true;
            } else if (res && res.Message && typeof res.Message == 'string') {
                ToasterSevice.showError(res.Message, 4000);
            } else {
                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
            }
        });
    },
    //#endregion

    //#region [action cancel]
    businessCancelRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = [];
            items.forEach(item => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_CANCEL) > -1) {
                    selectedID.push(item.ID);
                }
            });

            if (selectedID.length == 0) {
                ToasterSevice.showWarning('HRM_PortalApp_Status_AllowCancel', 4000);
                return;
            }

            VnrLoadingSevices.show();
            HttpService.MultiRequest([
                HttpService.Post('[URI_CENTER]/api/Att_LeaveDay/ValidateCancelLeaveDay', {
                    ListRecordID: selectedID,
                    UserLogin: dataVnrStorage.currentUser.headers.userlogin,
                    UserProcessID: dataVnrStorage.currentUser.headers.userid,
                    Host: _uriPor
                }),
                HttpService.Get('[URI_CENTER]/api/Att_GetData/GetConfigNoteValidate?business=E_LEAVEDAY')
            ]).then(resAll => {
                VnrLoadingSevices.hide()
                const [res, configNote] = resAll;
                let isNote = configNote && configNote.Data && configNote.Data?.IsRequiredCancelNote;
                if (res && res.Status == EnumName.E_SUCCESS) {
                    if (res.Data && res.Data.length > 0) {
                        let numberRow = res.Data.length == 1 ? '1' : `${res.Data.length}/${items.length}`,
                            keyTrans = translate('HRM_PortalApp_Message_CancelConfirm');

                        AttSubmitTakeLeaveDayBusinessFunction.confirmCancel({
                            strResultID: res.Data,
                            message: keyTrans.replace('[E_NUMBER]', numberRow)
                        }, isNote);
                    } else {
                        ToasterSevice.showError(res.Message ? res.Message : 'HRM_Common_SendRequest_Error', 4000);
                    }
                } else if (res && res.Status === EnumName.E_FAIL) {
                    ToasterSevice.showError(res.Message ? res.Message : 'HRM_Common_SendRequest_Error', 4000);
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                }
            });
        }
    },

    confirmCancel: (objValid, isNote) => {
        let actionCancel = _rowActions.find(item => item.Type === 'E_CANCEL'),
            isConfirm = actionCancel['Confirm'];

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isNote ? isNote : isConfirm['isValidInputText'],
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
                        AttSubmitTakeLeaveDayBusinessFunction.setCancel({ ...objValid, Comment: reason });
                    }
                }
            });
        } else {
            AttSubmitTakeLeaveDayBusinessFunction.setCancel(objValid);
        }
    },

    setCancel: objValid => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_CENTER]/api/Att_LeaveDay/ChangeStatusCancelLeaveDayHandle', {
            //Comment: objValid.Comment,
            ListRecordID: objValid.strResultID,
            UserLogin: dataVnrStorage.currentUser.headers.userlogin,
            UserProcessID: dataVnrStorage.currentUser.headers.userid,
            Host: _uriPor
        }).then(res => {
            VnrLoadingSevices.hide();
            if (res && res.Status == EnumName.E_SUCCESS) {
                ToasterSevice.showSuccess(res.Message, 4000);
                _this.reload('E_KEEP_FILTER', true);
                AttSubmitTakeLeaveDayBusinessFunction.checkForReLoadScreen[ScreenName.AttSubmitTakeLeaveDay] = true;
                AttSubmitTakeLeaveDayBusinessFunction.checkForReLoadScreen[
                    ScreenName.AttCanceledSubmitTakeLeaveDay
                ] = true;
            } else if (res && res.Message && typeof res.Message == 'string') {
                ToasterSevice.showError(res.Message, 4000);
            } else {
                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
            }
        });
    },
    //#endregion

    //#region [action  requestcancel]
    businessRequestCancelRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = [],
                ListDataRequestCancel = [];
            items.forEach(item => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_REQUEST_CANCEL) > -1) {
                    selectedID.push(item.ID);
                    ListDataRequestCancel.push({
                        ID: item.ID,
                        ProfileID: item?.ProfileID
                    });
                }
            });

            if (selectedID.length == 0) {
                ToasterSevice.showWarning('HRM_PortalApp_Status_AllowRequestCancel', 4000);
                return;
            }

            VnrLoadingSevices.show();
            HttpService.Post('[URI_CENTER]/api/Att_LeaveDay/ValidateRequestCancelLeaveDay', {
                ListRecordID: selectedID,
                UserLogin: dataVnrStorage.currentUser.headers.userlogin,
                UserProcessID: dataVnrStorage.currentUser.headers.userid,
                Host: _uriPor
            }).then(res => {
                VnrLoadingSevices.hide();
                if (res && res.Status == EnumName.E_SUCCESS) {
                    if (res.Data && res.Data.length > 0) {
                        let numberRow = res.Data.length == 1 ? '1' : `${res.Data.length}/${items.length}`,
                            message = '';

                        if (res.Data.length === 1) {
                            message = translate('HRM_PortalApp_Message_RequestCancelConfirmOneLine').replace(
                                '[E_NUMBER]',
                                numberRow
                            );
                        } else {
                            message = translate('HRM_PortalApp_Message_RequestCancelConfirmMultiLine').replace(
                                '[E_NUMBER]',
                                numberRow
                            );
                        }

                        AttSubmitTakeLeaveDayBusinessFunction.confirmRequestCancel({
                            strResultID: res.Data,
                            message: message,
                            ListDataRequestCancel
                        });
                    } else {
                        ToasterSevice.showError(res.Message ? res.Message : 'HRM_Common_SendRequest_Error', 4000);
                    }
                } else if (res && res.Status === EnumName.E_FAIL) {
                    ToasterSevice.showError(res.Message ? res.Message : 'HRM_Common_SendRequest_Error', 4000);
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                }
            });
        }
    },

    confirmRequestCancel: objValid => {
        let actionCancel = _rowActions.find(item => item.Type === EnumStatus.E_REQUEST_CANCEL),
            isConfirm = actionCancel['Confirm'];

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isConfirm['isValidInputText'],
                isAttachFile = isConfirm['isAttachFile'],
                isNotNullAttachFile = isConfirm['isNotNullAttachFile'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
                placeholder = translate('HRM_Common_CommentCancel'),
                limit = 500,
                textLimitFile = translate('HRM_PortalApp_LimitDynamicFile').replace('[E_DYNAMIC]', 3);

            AlertSevice.alert({
                iconType: EnumIcon.E_CONFIRM,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                isInputText: isInputText,
                message: message,
                isAttachFile,
                isNotNullAttachFile,
                limit: limit,
                textLimit: 'HRM_Sytem_Reason_MaxLength500',
                limitFile: 3,
                textLimitFile: textLimitFile,
                onCancel: () => {},
                onConfirm: (reason, isCheckBox, FileAttachment) => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        AttSubmitTakeLeaveDayBusinessFunction.setRequestCancel({
                            ...objValid,
                            Comment: reason,
                            FileAttach: FileAttachment
                        });
                    }
                }
            });
        } else {
            AttSubmitTakeLeaveDayBusinessFunction.setRequestCancel(objValid);
        }
    },

    setRequestCancel: objValid => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_CENTER]/api/Att_LeaveDay/ProcessCreateRequestCancelationLeaveDay', {
            Comment: objValid.Comment,
            ListDataRequestCancel: objValid.ListDataRequestCancel,
            UserLogin: dataVnrStorage.currentUser.headers.userlogin,
            UserProcessID: dataVnrStorage.currentUser.headers.userid,
            Host: _uriPor,
            FileAttachment: Array.isArray(objValid?.FileAttach)
                ? objValid?.FileAttach.map(item => item.fileName).join(',')
                : null
        }).then(res => {
            VnrLoadingSevices.hide();
            if (res && res.Status == EnumName.E_SUCCESS) {
                ToasterSevice.showSuccess(res.Message, 4000);
                _this.reload('E_KEEP_FILTER', true);
                AttSubmitTakeLeaveDayBusinessFunction.checkForReLoadScreen[ScreenName.AttSubmitTakeLeaveDay] = true;
                AttSubmitTakeLeaveDayBusinessFunction.checkForReLoadScreen[
                    ScreenName.AttApproveSubmitTakeLeaveDay
                ] = true;
                AttSubmitTakeLeaveDayBusinessFunction.checkForReLoadScreen[
                    ScreenName.AttApprovedSubmitTakeLeaveDay
                ] = true;
                AttSubmitTakeLeaveDayBusinessFunction.checkForReLoadScreen[
                    ScreenName.AttSaveTempSubmitTakeLeaveDay
                ] = true;
            } else if (res && res.Message && typeof res.Message == 'string') {
                ToasterSevice.showError(res.Message, 4000);
            } else {
                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
            }
        });
    },
    //#endregion

    //#region [modify]
    businessModifyRecord: (item, dataBody, itemRoot) => {
        if (Array.isArray(itemRoot) && itemRoot.length > 1) {
            ToasterSevice.showWarning('Sys_LockObjectWaiting_JustCheckOneItem');
            return;
        }

        if (Object.keys(item).length === 0) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
            return;
        }

        if (itemRoot) {
            if (
                Array.isArray(itemRoot) &&
                itemRoot[0]?.BusinessAllowAction !== null &&
                itemRoot[0]?.BusinessAllowAction !== undefined &&
                itemRoot[0]?.BusinessAllowAction.indexOf('E_MODIFY') < 0
            ) {
                ToasterSevice.showWarning('HRM_Common_DataInStatus_CannotEdit', 4000);
                return;
            } else if (
                !Array.isArray(itemRoot) &&
                itemRoot?.BusinessAllowAction !== null &&
                itemRoot?.BusinessAllowAction !== undefined &&
                itemRoot?.BusinessAllowAction.indexOf('E_MODIFY') < 0
            ) {
                ToasterSevice.showWarning('HRM_Common_DataInStatus_CannotEdit', 4000);
                return;
            } else {

                _this.onEdit(Array.isArray(itemRoot) ? itemRoot[0] : itemRoot);
            }
        }
    }
    //#endregion
};
