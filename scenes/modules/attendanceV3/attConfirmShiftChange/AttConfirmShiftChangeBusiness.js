import { ToasterSevice } from '../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../utils/HttpService';
import { translate } from '../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../assets/configProject/PermissionForAppMobile';
import { ConfigList } from '../../../../assets/configProject/ConfigList';
import DrawerServices from '../../../../utils/DrawerServices';
import NotificationsService from '../../../../utils/NotificationsService';
import store from '../../../../store';
import { ScreenName, EnumName, EnumIcon, EnumStatus } from '../../../../assets/constant';
import badgesNotification from '../../../../redux/badgesNotification';
import { dataVnrStorage } from '../../../../assets/auth/authentication';

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
            { E_ResourceName, E_Name, E_Rule, E_APPROVE, E_REJECT } = enumName;

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
                    title: translate('HRM_Common_Confirm'),
                    type: E_APPROVE,
                    onPress: (item, dataBody) =>
                        AttConfirmShiftChangeBusinessFunction.businessApproveRecords(
                            Array.isArray(item) ? item : [{ ...item }],
                            dataBody
                        ),
                    ...actionApprove
                }
            ];

            _selected = [
                {
                    title: translate('HRM_Common_Confirm'),
                    type: E_APPROVE,
                    onPress: (item, dataBody) =>
                        AttConfirmShiftChangeBusinessFunction.businessApproveRecords(item, dataBody),
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
                        AttConfirmShiftChangeBusinessFunction.businessRejectRecords(
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
                        AttConfirmShiftChangeBusinessFunction.businessRejectRecords(item, dataBody),
                    ...actionReject
                }
            ];
        }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const AttConfirmShiftChangeBusinessFunction = {
    // Đối tượng checkForReLoadScreen để check có refresh AttWaitConfirmShiftChange không
    checkForReLoadScreen: {
        AttConfirmedShiftChange: false,
        AttWaitConfirmShiftChange: false,
        AttRejectedShiftChange: false
    },
    setThisForBusiness: (dataThis, rowActionsFromScreen = _rowActions) => {
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
                let message = translate('HRM_PortalApp_ConfirmActionMesage').replace('[E_NUMBER]',
                    items.length === 1 ? '1' : `${arrValid.length}/${items.length}`);

                AttConfirmShiftChangeBusinessFunction.confirmApprove({
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
                message: message,
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

                        HttpService.Post('[URI_CENTER]/api/Att_Roster/ConfirmChangeShift', {
                            Host: apiConfig.uriPor,
                            ListRecordID: listRecord,
                            UserLogin: headers.userlogin,
                            UserProcessID: headers.userid,
                            Comment: reason,
                            IsPortal: true
                        }).then(res => {
                            VnrLoadingSevices.hide();
                            try {
                                if (res?.Status === enumName.E_SUCCESS) {
                                    ToasterSevice.showSuccess(res.Message ? res.Message : 'Hrm_Succeed', 5000);
                                    NotificationsService.getListUserPushNotify();
                                    _this.reload('E_KEEP_FILTER');
                                    // set true để refresh AttApprovedTakeDailyTask
                                    AttConfirmShiftChangeBusinessFunction.checkForReLoadScreen[
                                        ScreenName.AttWaitConfirmShiftChange
                                    ] = true;
                                    AttConfirmShiftChangeBusinessFunction.checkForReLoadScreen[
                                        ScreenName.AttConfirmedShiftChange
                                    ] = true;

                                    // Đếm lại con số ở Dashboard
                                    store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                                    // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                                    if (!_isOnScreenNotification)
                                        DrawerServices.navigate('AttWaitConfirmShiftChange');

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
            HttpService.Post('[URI_CENTER]/api/Att_Roster/ConfirmChangeShift', {
                Host: apiConfig.uriPor,
                ListRecordID: listRecord,
                UserLogin: headers.userlogin,
                UserProcessID: headers.userid,
                Comment: '',
                IsPortal: true
            }).then(res => {
                VnrLoadingSevices.hide();
                VnrLoadingSevices.hide();
                try {
                    if (res?.Status === enumName.E_SUCCESS) {
                        ToasterSevice.showSuccess(res.Message ? res.Message : 'Hrm_Succeed', 5000);
                        NotificationsService.getListUserPushNotify();
                        _this.reload('E_KEEP_FILTER');
                        // set true để refresh AttApprovedTakeDailyTask
                        AttConfirmShiftChangeBusinessFunction.checkForReLoadScreen[
                            ScreenName.AttWaitConfirmShiftChange
                        ] = true;
                        AttConfirmShiftChangeBusinessFunction.checkForReLoadScreen[
                            ScreenName.AttConfirmedShiftChange
                        ] = true;

                        // Đếm lại con số ở Dashboard
                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                        // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                        if (!_isOnScreenNotification)
                            DrawerServices.navigate('AttWaitConfirmShiftChange');

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
                    arrValid.push({
                        RecordID: item.ID,
                        Comment: '',
                        Type: 'E_REJECTED'
                    });
                }
            });

            if (arrValid.length > 0) {
                let message = translate('HRM_PortalApp_ConfirmReject_LeavedayReplace').replace('[E_NUMBER]',
                    items.length === 1 ? '1' : `${arrValid.length}/${items.length}`);
                AttConfirmShiftChangeBusinessFunction.confirmReject({
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
                message: message,
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

                        HttpService.Post('[URI_CENTER]/api/Att_Roster/RejectChangeShift', {
                            Host: apiConfig.uriPor,
                            ListRecordID: listRecord,
                            UserLogin: headers.userlogin,
                            UserProcessID: headers.userid,
                            Comment: reason ? reason : null,
                            IsPortal: true
                        }).then(res => {
                            VnrLoadingSevices.hide();
                            try {
                                if (res?.Status === enumName.E_SUCCESS) {
                                    ToasterSevice.showSuccess(res.Message ? res.Message : 'Hrm_Succeed', 5000);
                                    NotificationsService.getListUserPushNotify();
                                    _this.reload('E_KEEP_FILTER');
                                    // set true để refresh AttApprovedTakeDailyTask
                                    AttConfirmShiftChangeBusinessFunction.checkForReLoadScreen[
                                        ScreenName.AttWaitConfirmShiftChange
                                    ] = true;
                                    AttConfirmShiftChangeBusinessFunction.checkForReLoadScreen[
                                        ScreenName.AttRejectedShiftChange
                                    ] = true;

                                    // Đếm lại con số ở Dashboard
                                    store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                                    // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                                    if (!_isOnScreenNotification)
                                        DrawerServices.navigate('AttWaitConfirmShiftChange');

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
            HttpService.Post('[URI_CENTER]/api/Att_Roster/RejectChangeShift', {
                Host: apiConfig.uriPor,
                ListRecordID: listRecord,
                UserLogin: headers.userlogin,
                UserProcessID: headers.userid,
                Comment: '',
                IsPortal: true
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res?.Status === enumName.E_SUCCESS) {
                        ToasterSevice.showSuccess(res.Message ? res.Message : 'Hrm_Succeed', 5000);
                        NotificationsService.getListUserPushNotify();
                        _this.reload('E_KEEP_FILTER');
                        // set true để refresh AttApprovedTakeDailyTask
                        AttConfirmShiftChangeBusinessFunction.checkForReLoadScreen[
                            ScreenName.AttWaitConfirmShiftChange
                        ] = true;
                        AttConfirmShiftChangeBusinessFunction.checkForReLoadScreen[
                            ScreenName.AttRejectedShiftChange
                        ] = true;

                        // Đếm lại con số ở Dashboard
                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                        // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                        if (!_isOnScreenNotification)
                            DrawerServices.navigate('AttWaitConfirmShiftChange');

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
