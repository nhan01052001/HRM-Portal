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
import NotificationsService from '../../../../../utils/NotificationsService';
import store from '../../../../../store';
import badgesNotification from '../../../../../redux/badgesNotification';

let enumName = EnumName,
    attWaitConfirmShiftSubstitution = ScreenName.AttWaitConfirmShiftSubstitution,
    headers = null;

let _this = null,
    _isOnScreenNotification = false,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];
    headers = dataVnrStorage.currentUser.headers;
    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[attWaitConfirmShiftSubstitution],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_ResourceName, E_Name, E_Rule, E_REJECT, E_CONFIRM } = enumName;

        const actionConfirm = businessAction ? businessAction.find(action => action.Type === E_CONFIRM) : null,
            actionConfirmResource = actionConfirm ? actionConfirm[E_ResourceName][E_Name] : null,
            actionConfirmRule = actionConfirm ? actionConfirm[E_ResourceName][E_Rule] : null,
            actionConfirmPer =
                actionConfirmResource && actionConfirmRule
                    ? permission[actionConfirmResource][actionConfirmRule]
                    : null;

        if (actionConfirmPer) {
            _rowActions = [
                {
                    title: translate('HRM_Common_Confirm'),
                    type: E_CONFIRM,
                    onPress: (item, dataBody) => {
                        if (Array.isArray(item) && item.length > 0) {
                            AttWaitConfirmShiftSubstitutionBusinessFunction.businessConfirmRecords(item, dataBody);
                        } else {
                            AttWaitConfirmShiftSubstitutionBusinessFunction.businessConfirmRecords(
                                [{ ...item }],
                                dataBody
                            );
                        }
                    },
                    ...actionConfirm
                }
            ];

            _selected = [
                {
                    title: translate('HRM_Common_Confirm'),
                    type: E_CONFIRM,
                    onPress: (items, dataBody) =>
                        AttWaitConfirmShiftSubstitutionBusinessFunction.businessConfirmRecords(items, dataBody),
                    ...actionConfirm
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
                    onPress: (item, dataBody) => {
                        if (Array.isArray(item) && item.length > 0) {
                            AttWaitConfirmShiftSubstitutionBusinessFunction.businessRejectRecords(item, dataBody);
                        } else {
                            AttWaitConfirmShiftSubstitutionBusinessFunction.businessRejectRecords(
                                [{ ...item }],
                                dataBody
                            );
                        }
                    },
                    ...actionReject
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Reject'),
                    type: E_REJECT,
                    onPress: (item, dataBody) =>
                        AttWaitConfirmShiftSubstitutionBusinessFunction.businessRejectRecords(item, dataBody),
                    ...actionReject
                }
            ];
        }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const AttWaitConfirmShiftSubstitutionBusinessFunction = {
    // Đối tượng checkForReLoadScreen để check có refresh không
    checkForReLoadScreen: {
        [ScreenName.AttWaitConfirmedShiftSubstitution]: false
    },
    setThisForBusiness: (dataThis, isNotification) => {
        if (isNotification) _isOnScreenNotification = true;
        else _isOnScreenNotification = false;

        _this = dataThis;
    },

    //#region [action confirm]

    businessConfirmRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 5000);
        } else {
            let selectedID = items.map(item => {
                return item.ID;
            });

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionConfirm', {
                selectedID,
                screenName: attWaitConfirmShiftSubstitution,
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && typeof res === 'object') {
                        let isValid = res.isValid;
                        if (isValid) {
                            AttWaitConfirmShiftSubstitutionBusinessFunction.confirmApprove(res);
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

    confirmApprove: objValid => {
        let actionConfirm = _rowActions.find(item => item.Type === 'E_CONFIRM'),
            isConfirm = actionConfirm['Confirm'];

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
                placeholder = translate('Reason');

            AlertSevice.alert({
                iconType: EnumIcon.E_APPROVE,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                isInputText: isInputText,
                title: 'HRM_Common_Confirm',
                textRightButton: 'HRM_Common_Confirm',
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

                        HttpService.Post('[URI_HR]/Att_GetData/ProcessSendMailShiftSubstitutionSubsPersonConfirm', {
                            host: _uriPor,
                            selectedIds: strId.split(','),
                            reason
                        })
                            .then(res => {
                                try {
                                    if (res && res.success) {
                                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);

                                        // set true để refresh AttApprovedShiftSubstitution
                                        AttWaitConfirmShiftSubstitutionBusinessFunction.checkForReLoadScreen[
                                            ScreenName.AttWaitConfirmedShiftSubstitution
                                        ] = true;

                                        NotificationsService.getListUserPushNotify();

                                        // Đếm lại con số ở Dashboard
                                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());
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

            HttpService.Post('[URI_HR]/Att_GetData/ProcessSendMailShiftSubstitutionSubsPersonConfirm', {
                host: _uriPor,
                selectedIds: strId.split(',')
            })
                .then(res => {
                    try {
                        if (res && res.success) {
                            ToasterSevice.showSuccess('Hrm_Succeed', 4000);

                            // set true để refresh AttApprovedShiftSubstitution
                            AttWaitConfirmShiftSubstitutionBusinessFunction.checkForReLoadScreen[
                                ScreenName.AttWaitConfirmedShiftSubstitution
                            ] = true;

                            NotificationsService.getListUserPushNotify();

                            // Đếm lại con số ở Dashboard
                            store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());
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

    //#region [action reject]

    businessRejectRecords: (items, dataBody) => {

        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 5000);
        } else {
            let selectedID = items.map(item => {
                return item.ID;
            });

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionReject', {
                selectedID,
                screenName: attWaitConfirmShiftSubstitution,
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && typeof res === enumName.E_object) {
                        let isValid = res.isValid;
                        if (isValid) {
                            AttWaitConfirmShiftSubstitutionBusinessFunction.confirmReject(res);
                        } else if (isValid == false && res.message && typeof res.message === enumName.E_string) {
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

    confirmReject: objValid => {

        let actionCancel = _rowActions.find(item => item.Type === enumName.E_REJECT),
            isConfirm = actionCancel['Confirm'];

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
                placeholder = translate('ReasonReject');

            AlertSevice.alert({
                iconType: EnumIcon.E_REJECT,
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
                        const { apiConfig } = dataVnrStorage,
                            _uriPor = apiConfig ? apiConfig.uriPor : null;
                        let strId =
                            objValid.strResultID && typeof objValid.strResultID === 'string'
                                ? objValid.strResultID
                                : '';

                        VnrLoadingSevices.show();
                        HttpService.Post('[URI_HR]/Att_GetData/SetRejectAndSendMailToProfileRequestPortal', {
                            host: _uriPor,
                            selectedIds: strId,
                            userLogin: headers.userid,
                            rejectComment: reason
                        }).then(res => {
                            VnrLoadingSevices.hide();
                            try {
                                if (res == 'Locked') {
                                    ToasterSevice.showWarning('Hrm_Locked', 5000);
                                } else if (res.ActionStatus == 'NoPermission') {
                                    ToasterSevice.showWarning(res.ActionStatus, 5000);
                                } else if (res.ActionStatus == 'NoApproveOTMySelf') {
                                    ToasterSevice.showWarning(res.ActionStatus, 5000);
                                } else if (res.ActionStatus == 'WaringLeaveHourGreaterThanRemain') {
                                    ToasterSevice.showWarning(res.ActionStatus, 5000);
                                } else if (res.indexOf('VaildateMaxLengthError') >= 0) {
                                    ToasterSevice.showWarning(res.split('|')[1], 5000);
                                } else {
                                    ToasterSevice.showSuccess('Hrm_Succeed', 5000);
                                    NotificationsService.getListUserPushNotify();
                                    // set true để refresh AttApprovedShiftSubstitution
                                    AttWaitConfirmShiftSubstitutionBusinessFunction.checkForReLoadScreen[
                                        ScreenName.AttWaitConfirmedShiftSubstitution
                                    ] = true;
                                    _this.reload('E_KEEP_FILTER');

                                    // Đếm lại con số ở Dashboard
                                    store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                                    // nếu duyệt ở màn hình notify thì không chuyển hướng.
                                    if (!_isOnScreenNotification)
                                        DrawerServices.navigate('AttWaitConfirmShiftSubstitution');
                                }
                            } catch (error) {
                                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                            }
                        });
                    }
                }
            });
        } else {
            const { apiConfig } = dataVnrStorage,
                _uriPor = apiConfig ? apiConfig.uriPor : null;
            let strId = objValid.strResultID && typeof objValid.strResultID === 'string' ? objValid.strResultID : '';

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/SetRejectAndSendMailToProfileRequestPortal', {
                host: _uriPor,
                selectedIds: strId,
                userLogin: headers.userid
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res == 'Locked') {
                        ToasterSevice.showWarning('Hrm_Locked', 5000);
                    } else if (res.ActionStatus == 'NoPermission') {
                        ToasterSevice.showWarning(res.ActionStatus, 5000);
                    } else if (res.ActionStatus == 'NoApproveOTMySelf') {
                        ToasterSevice.showWarning(res.ActionStatus, 5000);
                    } else if (res.ActionStatus == 'WaringLeaveHourGreaterThanRemain') {
                        ToasterSevice.showWarning(res.ActionStatus, 5000);
                    } else if (res.indexOf('VaildateMaxLengthError') >= 0) {
                        ToasterSevice.showWarning(res.split('|')[1], 5000);
                    } else {
                        ToasterSevice.showSuccess('Hrm_Succeed', 5000);
                        NotificationsService.getListUserPushNotify();
                        // set true để refresh AttApprovedShiftSubstitution
                        AttWaitConfirmShiftSubstitutionBusinessFunction.checkForReLoadScreen[
                            ScreenName.AttWaitConfirmedShiftSubstitution
                        ] = true;
                        _this.reload('E_KEEP_FILTER');

                        // Đếm lại con số ở Dashboard
                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                        // nếu duyệt ở màn hình notify thì không chuyển hướng.
                        if (!_isOnScreenNotification) DrawerServices.navigate('AttWaitConfirmShiftSubstitution');
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        }
    }
    //#endregion
};

export default {
    generateRowActionAndSelected: generateRowActionAndSelected,
    AttWaitConfirmShiftSubstitutionBusinessFunction: AttWaitConfirmShiftSubstitutionBusinessFunction
};
