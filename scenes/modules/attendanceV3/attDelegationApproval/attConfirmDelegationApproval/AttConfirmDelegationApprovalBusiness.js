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
                    title: translate('HRM_PortalApp_Compliment_Commfirm'),
                    type: E_APPROVE,
                    onPress: (item, dataBody) =>
                        AttConfirmDelegationApprovalBusiness.businessApproveRecords(
                            Array.isArray(item) ? item : [{ ...item }],
                            dataBody
                        ),
                    ...actionApprove
                }
            ];

            _selected = [
                {
                    title: translate('HRM_PortalApp_Compliment_Commfirm'),
                    type: E_APPROVE,
                    onPress: (item, dataBody) =>
                        AttConfirmDelegationApprovalBusiness.businessApproveRecords(item, dataBody),
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
                        AttConfirmDelegationApprovalBusiness.businessRejectRecords(
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
                        AttConfirmDelegationApprovalBusiness.businessRejectRecords(item, dataBody),
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
                        AttConfirmDelegationApprovalBusiness.businessCancelRecords(
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
                        AttConfirmDelegationApprovalBusiness.businessCancelRecords(items, dataBody),
                    ...actionCancel
                }
            ];
        }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const AttConfirmDelegationApprovalBusiness = {
    // Đối tượng checkForReLoadScreen để check có refresh AttApprovedDelegationApproval không
    checkForReLoadScreen: {
        [ScreenName.AttConfirmDelegationApproval]: false,
        AttRejectDelegationApproval: false,
        AttCanceledDelegationApproval: false,
        AttConfirmedDelegationApproval: false
    },
    setThisForBusiness: (dataThis, isNotification, rowActionsFromScreen = _rowActions) => {
        if (isNotification) _isOnScreenNotification = true;
        else _isOnScreenNotification = false;

        _rowActions = rowActionsFromScreen ?? [];
        _this = dataThis;
    },
    //#region [action approve]
    businessApproveRecords: (items, dataBody) => {

        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 5000);
        } else {
            let arrValid = [];

            items.map(item => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_APPROVE) > -1) {
                    arrValid.push({
                        RecordID: item.ID,
                        Comment: '',
                        Type: 'E_APPROVED'
                    });
                }
            });

            if (arrValid.length > 0) {
                let message = translate('HRM_PortalApp_DecriptionAgree').replace('[E_NUMBER]',
                    arrValid.length === items.length ? arrValid.length : `${arrValid.length}/${items.length}`);

                AttConfirmDelegationApprovalBusiness.confirmApprove({
                    ListRecord: arrValid,
                    message,
                    allItems: Array.isArray(items) ? items.length : 0
                });
            } else {
                ToasterSevice.showWarning('HRM_Common_Message_NonDataHandle');
            }
        }
    },

    confirmApprove: async (objValid) => {

        let actionCancel = _rowActions.find(item => item.Type === 'E_APPROVE'),
            isConfirm = actionCancel['Confirm'];

        let listRecord = [];
        if (objValid.ListRecord) {
            listRecord = objValid.ListRecord.map((item) => {
                return item?.RecordID;
            });
        }

        if (isConfirm && !objValid?.isSkipConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
                placeholder = translate('HRM_PortalApp_ConfirmationReason'),
                limit = 500,
                textLimit = translate('HRM_Sytem_Reason_DynamicMaxLength').replace(
                    '[E_DYNAMIC1]',
                    `[${translate('HRM_Hre_ApproveWalletConfirmation_ApprovedReason')}]`
                );
            textLimit = textLimit.replace('[E_DYNAMIC2]', 500);

            AlertSevice.alert({
                iconType: EnumIcon.E_APPROVE,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                // message: message,
                isInputText: isInputText,
                limit: limit,
                title: 'HRM_PortalApp_ConfirmationInformation',
                textLimit: textLimit,
                textRightButton: 'HRM_PortalApp_Compliment_Commfirm',
                onCancel: () => {},
                onConfirm: reason => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + ' ' + translate('FieldNotAllowNullShort');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        VnrLoadingSevices.show();

                        HttpService.Post('[URI_HR]/Sys_GetData/SetConfirmationSysDelegateApprovePortal', {
                            Host: apiConfig.uriPor,
                            selectedIds: listRecord.join(','),
                            UserLogin: headers.userlogin,
                            UserProcessID: headers.userid,
                            approveComment: reason
                        }).then(res => {
                            VnrLoadingSevices.hide();
                            try {
                                if (res === enumName.E_Success) {
                                    ToasterSevice.showSuccess(res.Message ? res.Message : 'Hrm_Succeed', 5000);
                                    NotificationsService.getListUserPushNotify();
                                    _this.reload('E_KEEP_FILTER');
                                    // set true để refresh AttApprovedTakeDailyTask
                                    AttConfirmDelegationApprovalBusiness.checkForReLoadScreen[
                                        ScreenName.AttConfirmDelegationApproval
                                    ] = true;
                                    AttConfirmDelegationApprovalBusiness.checkForReLoadScreen[
                                        ScreenName.AttConfirmedDelegationApproval
                                    ] = true;

                                    // Đếm lại con số ở Dashboard
                                    store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                                    // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                                    if (!_isOnScreenNotification)
                                        DrawerServices.navigate('AttConfirmDelegationApproval');

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
            HttpService.Post('[URI_HR]/Sys_GetData/SetConfirmationSysDelegateApprovePortal', {
                Host: apiConfig.uriPor,
                selectedIds: listRecord.join(','),
                UserLogin: headers.userlogin,
                UserProcessID: headers.userid,
                approveComment: ''
            }).then(res => {
                VnrLoadingSevices.hide();
                VnrLoadingSevices.hide();
                try {
                    if (res === enumName.E_Success) {
                        ToasterSevice.showSuccess(res.Message ? res.Message : 'Hrm_Succeed', 5000);
                        NotificationsService.getListUserPushNotify();
                        _this.reload('E_KEEP_FILTER');
                        // set true để refresh AttApprovedTakeDailyTask
                        AttConfirmDelegationApprovalBusiness.checkForReLoadScreen[
                            ScreenName.AttConfirmDelegationApproval
                        ] = true;
                        AttConfirmDelegationApprovalBusiness.checkForReLoadScreen[
                            ScreenName.AttConfirmedDelegationApproval
                        ] = true;

                        // Đếm lại con số ở Dashboard
                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                        // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                        if (!_isOnScreenNotification)
                            DrawerServices.navigate('AttConfirmDelegationApproval');

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
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_APPROVE) > -1) {
                    arrValid.push({
                        RecordID: item.ID,
                        Comment: '',
                        Type: 'E_REJECTED'
                    });
                }
            });

            if (arrValid.length > 0) {
                let message = translate('HRM_PortalApp_DecriptionReject').replace('[E_NUMBER]',
                    arrValid.length === items.length ? arrValid.length : `${arrValid.length}/${items.length}`);
                AttConfirmDelegationApprovalBusiness.confirmReject({
                    ListRecord: arrValid,
                    message,
                    allItems: Array.isArray(items) ? items.length : 0
                });
            } else {
                ToasterSevice.showWarning('HRM_Common_Message_NonDataHandle');
            }
        }
    },

    confirmReject: async (objValid) => {
        let actionCancel = _rowActions.find(item => item.Type === 'E_REJECT'),
            isConfirm = actionCancel['Confirm'];

        let listRecord = [];
        if (objValid.ListRecord) {
            listRecord = objValid.ListRecord.map((item) => {
                return item?.RecordID;
            });
        }

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
                placeholder = translate('HRM_PortalApp_RejectionReason'),
                limit = 500,
                textLimit = translate('HRM_Sytem_Reason_DynamicMaxLength').replace(
                    '[E_DYNAMIC1]',
                    `[${translate('HRM_Hre_ApproveWalletConfirmation_RejectionReason')}]`
                );
            textLimit = textLimit.replace('[E_DYNAMIC2]', 500);

            AlertSevice.alert({
                iconType: EnumIcon.E_REJECT,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                // message: message,
                isInputText: isInputText,
                limit: limit,
                title: 'HRM_PortalApp_RejectionInformation',
                textLimit: textLimit,
                textRightButton: 'HRM_Common_Reject',
                onCancel: () => {},
                onConfirm: reason => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + ' ' + translate('FieldNotAllowNullShort');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        VnrLoadingSevices.show();

                        HttpService.Post('[URI_HR]/Sys_GetData/SetRejectSysDelegateApprovePortal', {
                            Host: apiConfig.uriPor,
                            selectedIds: listRecord.join(','),
                            UserLogin: headers.userlogin,
                            UserProcessID: headers.userid,
                            DeclineReason: reason ? reason : null
                        }).then(res => {
                            VnrLoadingSevices.hide();
                            try {
                                if (res === enumName.E_Success) {
                                    ToasterSevice.showSuccess(res.Message ? res.Message : 'Hrm_Succeed', 5000);
                                    NotificationsService.getListUserPushNotify();
                                    _this.reload('E_KEEP_FILTER');
                                    // set true để refresh AttApprovedTakeDailyTask
                                    AttConfirmDelegationApprovalBusiness.checkForReLoadScreen[
                                        ScreenName.AttConfirmDelegationApproval
                                    ] = true;
                                    AttConfirmDelegationApprovalBusiness.checkForReLoadScreen[
                                        ScreenName.AttConfirmedDelegationApproval
                                    ] = true;

                                    // Đếm lại con số ở Dashboard
                                    store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                                    // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                                    if (!_isOnScreenNotification)
                                        DrawerServices.navigate('AttConfirmDelegationApproval');

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
            HttpService.Post('[URI_HR]/Sys_GetData/SetRejectSysDelegateApprovePortal', {
                Host: apiConfig.uriPor,
                selectedIds: listRecord.join(','),
                UserLogin: headers.userlogin,
                UserProcessID: headers.userid,
                DeclineReason: ''
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res === enumName.E_Success) {
                        ToasterSevice.showSuccess(res.Message ? res.Message : 'Hrm_Succeed', 5000);
                        NotificationsService.getListUserPushNotify();
                        _this.reload('E_KEEP_FILTER');
                        // set true để refresh AttApprovedTakeDailyTask
                        AttConfirmDelegationApprovalBusiness.checkForReLoadScreen[
                            ScreenName.AttConfirmDelegationApproval
                        ] = true;
                        AttConfirmDelegationApprovalBusiness.checkForReLoadScreen[
                            ScreenName.AttConfirmedDelegationApproval
                        ] = true;

                        // Đếm lại con số ở Dashboard
                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                        // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                        if (!_isOnScreenNotification)
                            DrawerServices.navigate('AttConfirmDelegationApproval');

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

    //#region [action cancel]
    businessCancelRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let ListRecordID = [];
            let arrValid = [];
            let totalList = [];
            items.forEach(item => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_CANCEL) > -1) {
                    ListRecordID.push(item.ID);
                    arrValid.push(item.ID);
                    totalList.push(item.ID);
                }
                else {
                    totalList.push(item.ID);
                }
            });

            if (arrValid.length > 0 && ListRecordID.length > 0 && totalList.length > 0) {
                let message = translate('HRM_PortalApp_TSL_Cancle').replace('[E_NUMBER]', arrValid.length);

                // AttConfirmDelegationApprovalBusiness.confirmCancel({ ListRecordID, message });
                AttConfirmDelegationApprovalBusiness.validateCancleTakeDailyTask({ ListRecordID, message, totalList });
            } else {
                ToasterSevice.showWarning('HRM_PortalApp_Status_AllowCancel');
            }
        }
    },

    validateCancleTakeDailyTask: objValid => {
        if (objValid && Array.isArray(objValid?.ListRecordID) && objValid?.ListRecordID.length > 0) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_CENTER]/api/Att_Roster/ValidateCancelTimeSheetRegisterByUserApprove', {
                Host: apiConfig.uriPor,
                ListRecordID: objValid?.ListRecordID,
                UserLogin: headers.userlogin,
                UserProcessID: headers.userid
            })
                .then(res => {
                    VnrLoadingSevices.hide();
                    if (res) {
                        let numberRow = objValid?.totalList.length == 1 ? '1/1' : `${res.Data.length}/${objValid?.totalList.length}`,
                            keyTrans = objValid?.totalList.length > 1 ? translate('HRM_PortalApp_DailyTask_ConfirmCancel') : translate('HRM_PortalApp_DailyTask_CancelConfirmOnly');
                        if (res.Status === 'SUCCESS' && res.Data && Array.isArray(res.Data) && res.Data.length > 0) {
                            AttConfirmDelegationApprovalBusiness.confirmCancel({
                                ListRecord: {
                                    RecordID: res.Data,
                                    Comment: '',
                                    Type: 'E_CANCEL'
                                },
                                message: keyTrans.replace('[E_NUMBER]', numberRow)
                            });
                        } else {
                            ToasterSevice.showError(res.Message ? res.Message : 'HRM_Common_SendRequest_Error', 5000);
                        }
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
                placeholder = translate('HRM_Common_CommentCancel'),
                limit = 500,
                textLimit = translate('HRM_Sytem_Reason_DynamicMaxLength').replace(
                    '[E_DYNAMIC1]',
                    `[${translate('HRM_Medical_ImmunizationRecord_CommentCancel')}]`
                );
            textLimit = textLimit.replace('[E_DYNAMIC2]', 500);

            AlertSevice.alert({
                iconType: EnumIcon.E_CANCEL,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                message: objValid.message,
                isInputText: isInputText,
                limit: limit,
                textLimit: textLimit,
                onCancel: () => {},
                onConfirm: reason => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + ' ' + translate('FieldNotAllowNullShort');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        VnrLoadingSevices.show();
                        HttpService.Post('[URI_CENTER]/api/Att_Roster/ProcessCancelTimeSheetRegisterPortal', {
                            Host: apiConfig.uriPor,
                            ListRecordID: objValid.ListRecord.RecordID,
                            UserLogin: headers.userlogin,
                            UserProcessID: headers.userid,
                            Comment: reason
                        }).then(res => {

                            VnrLoadingSevices.hide();
                            try {
                                if (res && res !== '') {
                                    if (res.Status == 'SUCCESS') {
                                        ToasterSevice.showSuccess(res.Message ? res.Message : 'Hrm_Succeed', 5000);
                                        NotificationsService.getListUserPushNotify();
                                        _this.reload('E_KEEP_FILTER');
                                        AttConfirmDelegationApprovalBusiness.checkForReLoadScreen[
                                            ScreenName.AttAllTakeDailyTask
                                        ] = true;
                                        AttConfirmDelegationApprovalBusiness.checkForReLoadScreen[
                                            ScreenName.AttCanceledTakeDailyTask
                                        ] = true;
                                    } else if (res.Status == 'FAIL') {
                                        ToasterSevice.showError(res.Message ? res.Message : 'Hrm_Locked', 5000);
                                    } else {
                                        ToasterSevice.showError(
                                            res.Message ? res.Message : 'HRM_Common_SendRequest_Error',
                                            5000
                                        );
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
            HttpService.Post('[URI_CENTER]/api/Att_Roster/ProcessCancelTimeSheetRegisterPortal', {
                Host: apiConfig.uriPor,
                ListRecordID: objValid.ListRecord.RecordID,
                UserLogin: headers.userlogin,
                UserProcessID: headers.userid,
                Comment: ''
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && res !== '') {
                        if (res.Status == 'SUCCESS') {
                            ToasterSevice.showSuccess(res.Message ? res.Message : 'Hrm_Succeed', 5000);
                            NotificationsService.getListUserPushNotify();
                            _this.reload('E_KEEP_FILTER');
                            AttConfirmDelegationApprovalBusiness.checkForReLoadScreen[
                                ScreenName.AttAllTakeDailyTask
                            ] = true;
                            AttConfirmDelegationApprovalBusiness.checkForReLoadScreen[
                                ScreenName.AttCanceledTakeDailyTask
                            ] = true;
                        } else if (res.Status == 'FAIL') {
                            ToasterSevice.showError(res.Message ? res.Message : 'Hrm_Locked', 5000);
                        } else {
                            ToasterSevice.showError(res.Message ? res.Message : 'HRM_Common_SendRequest_Error', 5000);
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
