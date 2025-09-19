import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import HttpService from '../../../../../utils/HttpService';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumIcon, EnumStatus } from '../../../../../assets/constant';
import DrawerServices from '../../../../../utils/DrawerServices';
import NotificationsService from '../../../../../utils/NotificationsService';
import store from '../../../../../store';
import badgesNotification from '../../../../../redux/badgesNotification';
//import { DebugInstructions } from 'react-native/Libraries/NewAppScreen';

let enumName = EnumName,
    apiConfig = null,
    headers = null;

let _this = null,
    _isOnScreenNotification = false,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = screenName => {
    _rowActions = [];
    _selected = [];
    apiConfig = dataVnrStorage.apiConfig;
    headers = dataVnrStorage.currentUser.headers;

    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[screenName],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_ResourceName, E_Name, E_Rule, E_APPROVE, E_REJECT, E_CANCEL } = enumName;

        const actionApprove = businessAction ? businessAction.find(action => action.Type === E_APPROVE) : null,
            actionApproveResource = actionApprove ? actionApprove[E_ResourceName][E_Name] : null,
            actionApproveRule = actionApprove ? actionApprove[E_ResourceName][E_Rule] : null,
            actionApprovePer =
                actionApproveResource && actionApproveRule
                    ? permission[actionApproveResource][actionApproveRule]
                    : null;

        if (actionApprovePer) {
            _rowActions = [
                {
                    title: translate('HRM_Common_Approve'),
                    type: E_APPROVE,
                    onPress: (item, dataBody) =>
                        AttApproveShiftChangeBusiness.businessApproveRecords(
                            Array.isArray(item) ? item : [{ ...item }],
                            dataBody
                        ),
                    ...actionApprove
                }
            ];

            _selected = [
                {
                    title: translate('HRM_Common_Approve'),
                    type: E_APPROVE,
                    onPress: (item, dataBody) =>
                        AttApproveShiftChangeBusiness.businessApproveRecords(item, dataBody),
                    ...actionApprove
                }
            ];
        }

        const actionReject = businessAction ? businessAction.find(action => action.Type === E_REJECT) : null,
            actionRejectResource = actionReject ? actionReject[E_ResourceName][E_Name] : null,
            actionRejectRule = actionReject ? actionReject[E_ResourceName][E_Rule] : null,
            actionRejectPer =
                actionRejectResource && actionRejectRule ? permission[actionRejectResource][actionRejectRule] : null;

        if (actionRejectPer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_Common_Reject'),
                    type: E_REJECT,
                    onPress: (item, dataBody) =>
                        AttApproveShiftChangeBusiness.businessRejectRecords(
                            Array.isArray(item) ? item : [{ ...item }],
                            dataBody
                        ),
                    ...actionReject
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Reject'),
                    type: E_REJECT,
                    onPress: (item, dataBody) =>
                        AttApproveShiftChangeBusiness.businessRejectRecords(item, dataBody),
                    ...actionReject
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
                        AttApproveShiftChangeBusiness.businessCancelRecords(
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
                    onPress: (items, dataBody) =>
                        AttApproveShiftChangeBusiness.businessCancelRecords(items, dataBody),
                    ...actionCancel
                }
            ];
        }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const AttApproveShiftChangeBusiness = {
    // Đối tượng checkForReLoadScreen để check có refresh AttApprovedShiftChange không
    checkForReLoadScreen: {
        AttApproveShiftChange: false,
        AttRejectShiftChange: false,
        AttCanceledShiftChange: false,
        AttAllTakeShiftChange: false,
        AttApprovedShiftChange: false
    },
    setThisForBusiness: (dataThis, isNotification, rowActionsFromScreen) => {
        if (isNotification) _isOnScreenNotification = true;
        else _isOnScreenNotification = false;
        _rowActions = rowActionsFromScreen ?? [];
        _this = dataThis;
    },
    checkRequireNote: async (field) => {
        try {
            const res = await HttpService.Get(
                '[URI_CENTER]/api/Att_GetData/GetConfigNoteValidate?business=E_OVERTIMEPLAN'
            );

            if (res.Status === enumName.E_SUCCESS) {
                if (res && res.Data && res.Data[field]) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    },
    //#region [action approve]
    businessApproveRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 5000);
        } else {
            let arrValid = [];

            items.map(item => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_APPROVE) > -1) {
                    arrValid.push(item.ID);
                }
            });

            if (arrValid.length > 0) {
                AttApproveShiftChangeBusiness.validateApproveShiftChange(arrValid, items);
            } else {
                ToasterSevice.showWarning('HRM_Common_Message_NonDataHandle');
            }
        }
    },

    validateApproveShiftChange: (objValid, allItem) => {
        if (objValid && Array.isArray(objValid) && objValid.length > 0) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_CENTER]/api/Att_Roster/ValidateApproveRosterApproveChangeShift', {
                IsWaiting: true,
                ListRecordID: objValid,
                ListSelectedId: objValid,
                SelectedIds: objValid.join(',')
            })
                .then(res => {
                    VnrLoadingSevices.hide();
                    if (res && res?.Status === EnumName.E_SUCCESS) {
                        let mess = res.Message;
                        if (Array.isArray(allItem) && Array.isArray(res?.Data)) {
                            if (allItem.length === 1) {
                                mess = translate('HRM_PortalApp_DailyTask_ApproveConfirmOnly');
                                mess = mess.replace('[E_NUMBER]', 1);
                            } else if (allItem.length > 1) {
                                mess = translate('HRM_PortalApp_ConfirmAprrove_LeavedayReplace');
                                mess = mess.replace('[E_NUMBER]', `${res?.Data.length}/${allItem.length}`);
                            }
                        }
                        AttApproveShiftChangeBusiness.confirmApprove({
                            ListRecordID: res?.Data,
                            message: mess
                        });
                    } else if (res?.Status === EnumName.E_FAIL && typeof res?.Message === 'string') {
                        ToasterSevice.showError(res?.Message, 5000);
                    } else {
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 5000);
                    }
                })
                .catch(error => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                });
        }
    },

    confirmApprove: async (objValid) => {

        let actionCancel = _rowActions.find(item => item.Type === 'E_APPROVE'),
            isConfirm = actionCancel['Confirm'];

        if (isConfirm && !objValid?.isSkipConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
                placeholder = translate('Note'),
                limit = 500,
                textLimit = translate('HRM_Sytem_Reason_DynamicMaxLength').replace(
                    '[E_DYNAMIC1]',
                    `[${translate('Note')}]`
                );
            textLimit = textLimit.replace('[E_DYNAMIC2]', 500);

            AlertSevice.alert({
                title: 'HRM_PortalApp_ApproveNote',
                iconType: EnumIcon.E_APPROVE,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                message: message,
                isInputText: isInputText,
                limit: limit,
                textLimit: textLimit,
                onCancel: () => { },
                onConfirm: reason => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + ' ' + translate('FieldNotAllowNullShort');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        VnrLoadingSevices.show();

                        HttpService.Post('[URI_CENTER]/api/Att_Roster/ApproveRosterApproveChangeShift', {
                            Host: apiConfig.uriPor,
                            ListRecordID: objValid.ListRecordID,
                            UserLogin: headers.userlogin,
                            UserProcessID: headers.userid,
                            Comment: reason
                        }).then(res => {
                            VnrLoadingSevices.hide();
                            try {
                                if (res) {
                                    if (res.Status === 'SUCCESS') {
                                        ToasterSevice.showSuccess(res.Message ? res.Message : 'Hrm_Succeed', 5000);
                                        NotificationsService.getListUserPushNotify();
                                        _this.reload('E_KEEP_FILTER');
                                        // set true để refresh AttApprovedShiftChange
                                        AttApproveShiftChangeBusiness.checkForReLoadScreen[
                                            ScreenName.AttAllTakeShiftChange
                                        ] = true;
                                        AttApproveShiftChangeBusiness.checkForReLoadScreen[
                                            ScreenName.AttApprovedShiftChange
                                        ] = true;

                                        // Đếm lại con số ở Dashboard
                                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                                        // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                                        if (!_isOnScreenNotification)
                                            DrawerServices.navigate('AttApproveShiftChange');
                                    } else if (res.Status === 'Locked') {
                                        ToasterSevice.showWarning('Hrm_Locked', 5000);
                                    } else {
                                        ToasterSevice.showWarning(res.Message, 5000);
                                    }
                                } else {
                                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 5000);
                                }
                            } catch (error) {
                                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                            }
                        });
                    }
                }
            });
        } else {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_CENTER]/api/Att_Roster/ApproveRosterApproveChangeShift', {
                Host: apiConfig.uriPor,
                ListRecordID: objValid.ListRecordID,
                UserLogin: headers.userlogin,
                UserProcessID: headers.userid,
                Comment: ''
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res) {
                        if (res.Status === 'SUCCESS') {
                            ToasterSevice.showSuccess(res.Message ? res.Message : 'Hrm_Succeed', 5000);
                            NotificationsService.getListUserPushNotify();
                            _this.reload('E_KEEP_FILTER');
                            // set true để refresh AttApproveShiftChange
                            AttApproveShiftChangeBusiness.checkForReLoadScreen[
                                ScreenName.AttAllTakeShiftChange
                            ] = true;
                            AttApproveShiftChangeBusiness.checkForReLoadScreen[
                                ScreenName.AttApprovedShiftChange
                            ] = true;

                            // Đếm lại con số ở Dashboard
                            store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                            // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                            if (!_isOnScreenNotification) DrawerServices.navigate('AttApproveShiftChange');
                        } else if (res.Status === 'Locked') {
                            ToasterSevice.showWarning('Hrm_Locked', 5000);
                        } else {
                            ToasterSevice.showWarning(res.Message, 5000);
                        }
                    } else {
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 5000);
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        }
    },
    //#endregion

    //#region [action reject]
    businessRejectRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 5000);
        } else {
            let arrValid = [];

            items.map(item => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_REJECT) > -1) {
                    arrValid.push(item.ID);
                }
            });

            if (arrValid.length > 0) {
                AttApproveShiftChangeBusiness.validateRejectShiftChange(arrValid, items);
            } else {
                ToasterSevice.showWarning('HRM_Common_Message_NonDataHandle');
            }
        }
    },

    validateRejectShiftChange: (objValid, allItems) => {
        if (objValid && Array.isArray(objValid) && objValid.length > 0) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_CENTER]/api/Att_Roster/ValidateRejectRosterApproveChangeShift', {
                IsWaiting: true,
                ListRecordID: objValid,
                ListSelectedId: objValid,
                SelectedIds: objValid.join(',')
            })
                .then(res => {
                    VnrLoadingSevices.hide();
                    if (res && res?.Status === EnumName.E_SUCCESS) {
                        let mess = res.Message;
                        if (Array.isArray(allItems) && Array.isArray(res?.Data)) {
                            if (allItems.length === 1) {
                                mess = translate('HRM_PortalApp_DailyTask_RejectConfirmOnly');
                                mess = mess.replace('[E_NUMBER]', 1);
                            } else if (allItems.length > 1) {
                                mess = translate('HRM_PortalApp_ConfirmReject_LeavedayReplace');
                                mess = mess.replace('[E_NUMBER]', `${res?.Data.length}/${allItems.length}`);
                            }
                        }
                        AttApproveShiftChangeBusiness.confirmReject({
                            ListRecordID: res?.Data,
                            message: mess
                        });
                    } else if (res?.Status === EnumName.E_FAIL && typeof res?.Message === 'string') {
                        ToasterSevice.showError(res?.Message, 5000);
                    } else {
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 5000);
                    }
                })
                .catch(error => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                });
        }
    },

    confirmReject: async (objValid) => {
        let actionCancel = _rowActions.find(item => item.Type === 'E_REJECT'),
            isConfirm = actionCancel['Confirm'];

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
                placeholder = translate('Reason'),
                limit = 500,
                textLimit = translate('HRM_Sytem_Reason_DynamicMaxLength').replace(
                    '[E_DYNAMIC1]',
                    `[${translate('HRM_PortalApp_ReasonReject')}]`
                );
            textLimit = textLimit.replace('[E_DYNAMIC2]', 500);

            AlertSevice.alert({
                title: 'HRM_PortalApp_ReasonReject',
                iconType: EnumIcon.E_REJECT,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                message: message,
                isInputText: isInputText,
                limit: limit,
                textLimit: textLimit,
                onCancel: () => { },
                onConfirm: reason => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + ' ' + translate('FieldNotAllowNullShort');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        VnrLoadingSevices.show();

                        HttpService.Post('[URI_CENTER]/api/Att_Roster/RejectRosterApproveChangeShift', {
                            Host: apiConfig.uriPor,
                            ListRecordID: objValid.ListRecordID,
                            UserLogin: headers.userlogin,
                            UserProcessID: headers.userid,
                            Comment: reason
                        }).then(res => {
                            VnrLoadingSevices.hide();
                            try {
                                if (res) {
                                    if (res.Status === 'SUCCESS') {
                                        ToasterSevice.showSuccess('Hrm_Succeed', 5000);
                                        NotificationsService.getListUserPushNotify();
                                        _this.reload('E_KEEP_FILTER');
                                        // set true để refresh AttRejectShiftChange
                                        AttApproveShiftChangeBusiness.checkForReLoadScreen[
                                            ScreenName.AttAllTakeShiftChange
                                        ] = true;
                                        AttApproveShiftChangeBusiness.checkForReLoadScreen[
                                            ScreenName.AttRejectShiftChange
                                        ] = true;

                                        // Đếm lại con số ở Dashboard
                                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());
                                        // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                                        if (!_isOnScreenNotification)
                                            DrawerServices.navigate('AttApproveShiftChange');
                                    } else if (res.Status === 'Locked') {
                                        ToasterSevice.showWarning('Hrm_Locked', 5000);
                                    } else {
                                        ToasterSevice.showWarning(res.Message, 5000);
                                    }
                                } else {
                                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 5000);
                                }
                            } catch (error) {
                                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                            }
                        });
                    }
                }
            });
        } else {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_CENTER]/api/Att_Roster/RejectRosterApproveChangeShift', {
                Host: apiConfig.uriPor,
                ListRecordID: objValid.ListRecordID,
                UserLogin: headers.userlogin,
                UserProcessID: headers.userid
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res) {
                        if (res.Status === 'SUCCESS') {
                            ToasterSevice.showSuccess('Hrm_Succeed', 5000);
                            NotificationsService.getListUserPushNotify();
                            _this.reload('E_KEEP_FILTER');
                            // set true để refresh AttRejectShiftChange
                            AttApproveShiftChangeBusiness.checkForReLoadScreen[
                                ScreenName.AttAllTakeShiftChange
                            ] = true;
                            AttApproveShiftChangeBusiness.checkForReLoadScreen[
                                ScreenName.AttRejectShiftChange
                            ] = true;

                            // Đếm lại con số ở Dashboard
                            store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());
                            // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                            if (!_isOnScreenNotification) DrawerServices.navigate('AttApproveShiftChange');
                        } else if (res.Status === 'Locked') {
                            ToasterSevice.showWarning('Hrm_Locked', 5000);
                        } else {
                            ToasterSevice.showWarning(res.Message, 5000);
                        }
                    } else {
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 5000);
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
            let arrValid = [];

            items.map(item => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_CANCEL) > -1) {
                    arrValid.push(item.ID);
                }
            });

            if (arrValid.length > 0) {
                AttApproveShiftChangeBusiness.validateCancleShiftChange(arrValid, items);
            } else {
                ToasterSevice.showWarning('HRM_PortalApp_Status_AllowCancel');
            }
        }
    },

    validateCancleShiftChange: (objValid, allItems) => {
        if (objValid && Array.isArray(objValid) && objValid.length > 0) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_CENTER]/api/Att_Roster/ValidateCancelRosterApproveChangeShift', {
                IsWaiting: true,
                ListRecordID: objValid,
                ListSelectedId: objValid,
                SelectedIds: objValid.join(',')
            })
                .then(res => {
                    VnrLoadingSevices.hide();
                    if (res && res?.Status === EnumName.E_SUCCESS) {
                        let mess = res.Message;
                        if (Array.isArray(allItems) && Array.isArray(res?.Data)) {
                            if (allItems.length === 1) {
                                mess = translate('HRM_PortalApp_DailyTask_CancelConfirmOnly');
                                mess = mess.replace('[E_NUMBER]', 1);
                            } else if (allItems.length > 1) {
                                mess = translate('HRM_PortalApp_DailyTask_ConfirmCancel');
                                mess = mess.replace('[E_NUMBER]', `${res?.Data.length}/${allItems.length}`);
                            }
                        }
                        AttApproveShiftChangeBusiness.confirmCancel({
                            ListRecordID: res?.Data,
                            message: mess
                        });
                    } else if (res?.Status === EnumName.E_FAIL && typeof res?.Message === 'string') {
                        ToasterSevice.showError(res?.Message, 5000);
                    } else {
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 5000);
                    }
                })
                .catch(error => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                });
        }
    },

    confirmCancel: async (objValid) => {
        let actionCancel = _rowActions.find(item => item.Type === 'E_CANCEL'),
            isConfirm = actionCancel['Confirm'];

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isConfirm['isValidInputText'],
                placeholder = translate('Reason'),
                limit = 500,
                textLimit = translate('HRM_Sytem_Reason_DynamicMaxLength').replace(
                    '[E_DYNAMIC1]',
                    `[${translate('HRM_Medical_ImmunizationRecord_CommentCancel')}]`
                );
            textLimit = textLimit.replace('[E_DYNAMIC2]', 500);

            AlertSevice.alert({
                title: 'HRM_Common_CommentCancel',
                iconType: EnumIcon.E_CANCEL,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                message: objValid.message,
                isInputText: isInputText,
                limit: limit,
                textLimit: textLimit,
                onCancel: () => { },
                onConfirm: reason => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + ' ' + translate('FieldNotAllowNullShort');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        VnrLoadingSevices.show();
                        HttpService.Post('[URI_CENTER]/api/Att_Roster/CancelRosterApproveChangeShift', {
                            Host: apiConfig.uriPor,
                            IsPortal: true,
                            ListRecordID: objValid.ListRecordID,
                            UserLogin: headers.userlogin,
                            UserProcessID: headers.userid,
                            Comment: reason
                        }).then(res => {

                            VnrLoadingSevices.hide();
                            try {
                                if (res) {
                                    if (res.Status === 'SUCCESS') {
                                        ToasterSevice.showSuccess('Hrm_Succeed', 5000);
                                        NotificationsService.getListUserPushNotify();
                                        _this.reload('E_KEEP_FILTER');
                                        // set true để refresh AttCanceledShiftChange
                                        AttApproveShiftChangeBusiness.checkForReLoadScreen[
                                            ScreenName.AttAllTakeShiftChange
                                        ] = true;
                                        AttApproveShiftChangeBusiness.checkForReLoadScreen[
                                            ScreenName.AttCanceledShiftChange
                                        ] = true;
                                    } else if (res.Status === 'Locked') {
                                        ToasterSevice.showWarning('Hrm_Locked', 5000);
                                    } else {
                                        ToasterSevice.showWarning(res.Message, 5000);
                                    }
                                } else {
                                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 5000);
                                }
                            } catch (error) {
                                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                            }
                        });
                    }
                }
            });
        } else {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_CENTER]/api/Att_Roster/CancelRosterApproveChangeShift', {
                Host: apiConfig.uriPor,
                IsPortal: true,
                ListRecordID: objValid.ListRecordID,
                UserLogin: headers.userlogin,
                UserProcessID: headers.userid
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res) {
                        if (res.Status === 'SUCCESS') {
                            ToasterSevice.showSuccess('Hrm_Succeed', 5000);
                            NotificationsService.getListUserPushNotify();
                            _this.reload('E_KEEP_FILTER');
                            // set true để refresh AttCanceledShiftChange
                            AttApproveShiftChangeBusiness.checkForReLoadScreen[
                                ScreenName.AttAllTakeShiftChange
                            ] = true;
                            AttApproveShiftChangeBusiness.checkForReLoadScreen[
                                ScreenName.AttCanceledShiftChange
                            ] = true;
                        } else if (res.Status === 'Locked') {
                            ToasterSevice.showWarning('Hrm_Locked', 5000);
                        } else {
                            ToasterSevice.showWarning(res.Message, 5000);
                        }
                    } else {
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 5000);
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        }
    }
    //#endregion
};
