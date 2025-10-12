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

let enumName = EnumName,
    attSubmitTakeBusinessTrip = ScreenName.AttSubmitTakeBusinessTrip;

let _this = null,
    _rowActions = [],
    _selected = [];

const { apiConfig } = dataVnrStorage,
    _uriPor = apiConfig ? apiConfig.uriPor : null;

export const generateRowActionAndSelected = (screenName = attSubmitTakeBusinessTrip) => {
    _rowActions = [];
    _selected = [];

    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[screenName],
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
                        AttSubmitTakeBusinessTripBusinessFunction.businessModifyRecord(
                            Array.isArray(item) ? item : [{ ...item }],
                            dataBody,
                            item
                        ),
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
                        AttSubmitTakeBusinessTripBusinessFunction.businessSendMailRecords(
                            Array.isArray(item) ? item : [{ ...item }],
                            dataBody
                        ),
                    ...actionSendMail
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_SendMail'),
                    type: E_SENDMAIL,
                    onPress: (items, dataBody) =>
                        AttSubmitTakeBusinessTripBusinessFunction.businessSendMailRecords(items, dataBody),
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
                        AttSubmitTakeBusinessTripBusinessFunction.businessDeleteRecords(
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
                        AttSubmitTakeBusinessTripBusinessFunction.businessDeleteRecords(item, dataBody),
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
                        AttSubmitTakeBusinessTripBusinessFunction.businessCancelRecords(
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
                        AttSubmitTakeBusinessTripBusinessFunction.businessCancelRecords(item, dataBody),
                    ...actionCancel
                }
            ];
        }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const AttSubmitTakeBusinessTripBusinessFunction = {
    checkForReLoadScreen: {
        AttSubmitTakeBusinessTrip: false,
        AttSaveTempSubmitTakeBusinessTrip: false,
        AttCanceledSubmitTakeBusinessTrip: false,
        AttApproveSubmitTakeBusinessTrip: false,
        AttApprovedSubmitTakeBusinessTrip: false,
        AttRejectSubmitTakeBusinessTrip: false
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
            HttpService.Post('[URI_CENTER]/api/Att_BussinessTravel/CheckStatusBussinessTripForDelete', {
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

                        AttSubmitTakeBusinessTripBusinessFunction.confirmDelete({
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
                        AttSubmitTakeBusinessTripBusinessFunction.setDelete(objValid);
                    }
                }
            });
        } else {
            AttSubmitTakeBusinessTripBusinessFunction.setDelete(objValid);
        }
    },

    setDelete: objValid => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_CENTER]/api/Att_BussinessTravel/DeleteBussinessTravelHandle', {
            ListRecordID: objValid.strResultID,
            UserLogin: dataVnrStorage.currentUser.headers.userlogin,
            UserProcessID: dataVnrStorage.currentUser.headers.userid,
            Host: _uriPor
        }).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res && res.Status == EnumName.E_SUCCESS) {
                    ToasterSevice.showSuccess(res.Message, 4000);
                    AttSubmitTakeBusinessTripBusinessFunction.checkForReLoadScreen[
                        ScreenName.AttSubmitTakeBusinessTrip
                    ] = true;
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
                AttSubmitTakeBusinessTripBusinessFunction.setSendMail({
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
        HttpService.Post('[URI_CENTER]/api/Att_BussinessTravel/ProcessingSendMailBussinessTrip', {
            ListRecordID: objValid.strResultID,
            UserLogin: dataVnrStorage.currentUser.headers.userlogin,
            UserProcessID: dataVnrStorage.currentUser.headers.userid,
            Host: _uriPor
        }).then(res => {
            VnrLoadingSevices.hide();
            if (res && res.Status == EnumName.E_SUCCESS) {
                ToasterSevice.showSuccess(res.Message, 4000);
                _this.reload('E_KEEP_FILTER', true);
                AttSubmitTakeBusinessTripBusinessFunction.checkForReLoadScreen[
                    ScreenName.AttSubmitTakeBusinessTrip
                ] = true;
                AttSubmitTakeBusinessTripBusinessFunction.checkForReLoadScreen[
                    ScreenName.AttApproveSubmitTakeBusinessTrip
                ] = true;
                AttSubmitTakeBusinessTripBusinessFunction.checkForReLoadScreen[
                    ScreenName.AttSaveTempSubmitTakeBusinessTrip
                ] = true;
            } else if (res && res.Message && typeof res.Message == 'string') {
                ToasterSevice.showError(res.Message, 4000);
            } else {
                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
            }
        // eslint-disable-next-line no-console
        }).catch(err => console.log(err))
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
                HttpService.Post('[URI_CENTER]/api/Att_BussinessTravel/ValidateCancelBusinessTravel', {
                    ListRecordID: selectedID,
                    UserLogin: dataVnrStorage.currentUser.headers.userlogin,
                    UserProcessID: dataVnrStorage.currentUser.headers.userid,
                    Host: _uriPor
                }),
                HttpService.Get('[URI_CENTER]/api/Att_GetData/GetConfigNoteValidate?business=E_BUSINESSTRAVEL')
            ]).then(resAll => {
                VnrLoadingSevices.hide();
                const [res, configNote] = resAll;
                let isNote = configNote && configNote.Data && configNote.Data?.IsRequiredCancelNote;
                if (res && res.Status == EnumName.E_SUCCESS) {
                    if (res.Data && res.Data.length > 0) {
                        let numberRow = (res.Data.length === 1 && items.length === 1) ? '1' : `${res.Data.length}/${items.length}`,
                            keyTrans = translate('HRM_PortalApp_Message_CancelConfirm');

                        AttSubmitTakeBusinessTripBusinessFunction.confirmCancel({
                            strResultID: res.Data,
                            message: keyTrans.replace('[E_NUMBER]', numberRow)
                        }, isNote);
                    } else {
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
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
                placeholder = translate('HRM_Common_CommentCancel'),
                limit = 500,
                textLimit = translate('HRM_Sytem_Reason_DynamicMaxLength').replace(
                    '[E_DYNAMIC1]',
                    `[${translate('HRM_Hre_ApproveWalletConfirmation_ApprovedReason')}]`
                );
            textLimit = textLimit.replace('[E_DYNAMIC2]', 500);

            AlertSevice.alert({
                iconType: EnumIcon.E_CANCEL,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                isInputText: isInputText,
                limit: limit,
                textLimit: textLimit,
                message: message,
                onCancel: () => {},
                onConfirm: reason => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else if (reason && reason.length > 500) {
                        ToasterSevice.showWarning('HRM_Sytem_Reason_MaxLength500', 4000);
                        return;
                    } else {
                        AttSubmitTakeBusinessTripBusinessFunction.setCancel({ ...objValid, Comment: reason });
                    }
                }
            });
        } else {
            AttSubmitTakeBusinessTripBusinessFunction.setCancel(objValid);
        }
    },

    setCancel: objValid => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_CENTER]/api/Att_BussinessTravel/SetCancelBusinessTripInPortal', {
            Comment: objValid.Comment,
            ListRecordID: objValid.strResultID,
            UserLogin: dataVnrStorage.currentUser.headers.userlogin,
            UserProcessID: dataVnrStorage.currentUser.headers.userid,
            Host: _uriPor
        }).then(res => {
            VnrLoadingSevices.hide();
            if (res && res.Status == EnumName.E_SUCCESS) {
                ToasterSevice.showSuccess(res.Message, 4000);
                _this.reload('E_KEEP_FILTER', true);
                AttSubmitTakeBusinessTripBusinessFunction.checkForReLoadScreen[ScreenName.AttSubmitTakeBusinessTrip] = true;
                AttSubmitTakeBusinessTripBusinessFunction.checkForReLoadScreen[
                    ScreenName.AttCanceledSubmitTakeBusinessTrip
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
                const ID = Array.isArray(itemRoot) ? itemRoot[0]?.ID : itemRoot?.ID;
                if (ID) {
                    VnrLoadingSevices.show();
                    HttpService.Get(`[URI_CENTER]/api/Att_BussinessTravel/GetDetailBusinessTripById?ID=${ID}`)
                        .then(res => {
                            VnrLoadingSevices.hide();
                            if (res && res.Status === 'SUCCESS' && res.Data) {
                                _this.onEdit(res.Data);
                            }
                        })
                        .catch(() => {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                        });
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                }
            }
        }
    }
    //#endregion
};
