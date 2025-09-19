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
    attApproveRoster = ScreenName.AttApproveRoster,
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
        const _configList = ConfigList.value[attApproveRoster],
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
                    title: translate('HRM_Common_Approve'),
                    type: E_APPROVE,
                    onPress: (item, dataBody) => {
                        if (Array.isArray(item) && item.length > 0) {
                            AttApproveRosterBusinessFunction.businessApproveRecords(item, dataBody);
                        } else {
                            AttApproveRosterBusinessFunction.businessApproveRecords([{ ...item }], dataBody);
                        }
                    },
                    ...actionApprove
                }
            ];

            _selected = [
                {
                    title: translate('HRM_Common_Approve'),
                    type: E_APPROVE,
                    onPress: (items, dataBody) =>
                        AttApproveRosterBusinessFunction.businessApproveRecords(items, dataBody),
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
                    onPress: (item, dataBody) => {
                        if (Array.isArray(item) && item.length > 0) {
                            AttApproveRosterBusinessFunction.businessRejectRecords(item, dataBody);
                        } else {
                            AttApproveRosterBusinessFunction.businessRejectRecords([{ ...item }], dataBody);
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
                    onPress: (item, dataBody) => AttApproveRosterBusinessFunction.businessRejectRecords(item, dataBody),
                    ...actionReject
                }
            ];
        }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const AttApproveRosterBusinessFunction = {
    // Đối tượng checkForReLoadScreen để check có refresh ListApprovedStopWorking không
    checkForReLoadScreen: {
        [ScreenName.AttApprovedRoster]: false
    },
    setThisForBusiness: (dataThis, isNotification) => {
        if (isNotification) _isOnScreenNotification = true;
        else _isOnScreenNotification = false;

        _this = dataThis;
    },
    //#region [action approve]

    businessApproveRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 5000);
        } else {
            let selectedID = items.map(item => {
                return item.ID;
            });

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionApprove', {
                selectedID,
                screenName: 'AttApproveRoster',
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && typeof res === 'object') {
                        let isValid = res.isValid;
                        if (isValid) {
                            AttApproveRosterBusinessFunction.confirmApprove(res);
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
        const { E_APPROVE, E_isInputText, E_isValidInputText, E_string, E_Confirm } = enumName;

        let actionCancel = _rowActions.find(item => item.Type === E_APPROVE),
            isConfirm = actionCancel[E_Confirm];

        if (isConfirm) {
            let isInputText = isConfirm[E_isInputText],
                isValidInputText = isConfirm[E_isValidInputText],
                message = objValid.message && typeof objValid.message === E_string ? objValid.message : null,
                placeholder = translate('ReasonApprove');

            AlertSevice.alert({
                iconType: EnumIcon.E_APPROVE,
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
                            objValid.strResultID && typeof objValid.strResultID === E_string
                                ? objValid.strResultID
                                : '';
                        const { apiConfig } = dataVnrStorage,
                            _uriPor = apiConfig ? apiConfig.uriPor : null;

                        VnrLoadingSevices.show();
                        HttpService.Post('[URI_HR]/Att_GetData/SetApproveRosterInPortal', {
                            host: _uriPor,
                            selectedIds: strId,
                            userApproveID: null,
                            userProcessID: headers.userid,
                            approveComment: reason,
                            IsPortal: true
                        }).then(res => {
                            VnrLoadingSevices.hide();
                            try {
                                if (res && res !== '') {
                                    if (res == 'Success') {
                                        ToasterSevice.showSuccess('Hrm_Succeed', 5000);
                                        NotificationsService.getListUserPushNotify();
                                        // set true để refresh AttApprovedRoster
                                        AttApproveRosterBusinessFunction.checkForReLoadScreen[
                                            ScreenName.AttApprovedRoster
                                        ] = true;
                                        _this.reload('E_KEEP_FILTER');

                                        // Đếm lại con số ở Dashboard
                                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                                        // nếu duyệt ở màn hình notify thì không chuyển hướng.
                                        if (!_isOnScreenNotification) DrawerServices.navigate('AttApproveRoster');
                                    } else if (res == 'Locked') {
                                        ToasterSevice.showWarning('Hrm_Locked', 5000);
                                    } else {
                                        ToasterSevice.showWarning(res, 5000);
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
            let strId = objValid.strResultID && typeof objValid.strResultID === 'string' ? objValid.strResultID : '';
            const { apiConfig } = dataVnrStorage,
                _uriPor = apiConfig ? apiConfig.uriPor : null;

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/SetApproveRosterInPortal', {
                host: _uriPor,
                selectedIds: strId,
                userApproveID: null,
                userProcessID: headers.userid,
                IsPortal: true
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && res !== '') {
                        if (res == 'Success') {
                            ToasterSevice.showSuccess('Hrm_Succeed', 5000);
                            NotificationsService.getListUserPushNotify();
                            // set true để refresh AttApprovedRoster
                            AttApproveRosterBusinessFunction.checkForReLoadScreen[ScreenName.AttApprovedRoster] = true;
                            _this.reload('E_KEEP_FILTER');

                            // Đếm lại con số ở Dashboard
                            store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                            // nếu duyệt ở màn hình notify thì không chuyển hướng.
                            if (!_isOnScreenNotification) DrawerServices.navigate('AttApproveRoster');
                        } else if (res == 'Locked') {
                            ToasterSevice.showWarning('Hrm_Locked', 5000);
                        } else {
                            ToasterSevice.showWarning(res, 5000);
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
            let selectedID = items.map(item => {
                return item.ID;
            });

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionReject', {
                selectedID,
                screenName: attApproveRoster,
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && typeof res === enumName.E_object) {
                        let isValid = res.isValid;
                        if (isValid) {
                            AttApproveRosterBusinessFunction.confirmReject(res);
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
                        HttpService.Post('[URI_HR]/Att_GetData/SetRejectRosterInPortal', {
                            host: _uriPor,
                            selectedIds: strId,
                            userRejectID: null,
                            userProcessID: headers.userid,
                            DeclineReason: reason,
                            IsPortal: true
                        }).then(res => {
                            VnrLoadingSevices.hide();
                            try {
                                if (res && res !== '') {
                                    if (res === 'Success') {
                                        ToasterSevice.showSuccess('Hrm_Succeed', 5000);
                                        NotificationsService.getListUserPushNotify();
                                        // set true để refresh AttApprovedRoster
                                        AttApproveRosterBusinessFunction.checkForReLoadScreen[
                                            ScreenName.AttApprovedRoster
                                        ] = true;
                                        _this.reload('E_KEEP_FILTER');

                                        // Đếm lại con số ở Dashboard
                                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                                        // nếu duyệt ở màn hình notify thì không chuyển hướng.
                                        if (!_isOnScreenNotification) DrawerServices.navigate('AttApproveRoster');
                                    } else if (res == 'Locked') {
                                        ToasterSevice.showWarning('Hrm_Locked', 5000);
                                    } else {
                                        ToasterSevice.showWarning(res, 5000);
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
            const { apiConfig } = dataVnrStorage,
                _uriPor = apiConfig ? apiConfig.uriPor : null;
            let strId = objValid.strResultID && typeof objValid.strResultID === 'string' ? objValid.strResultID : '';

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/SetRejectRosterInPortal', {
                host: _uriPor,
                selectedIds: strId,
                userRejectID: null,
                userProcessID: headers.userid,
                IsPortal: true
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && res !== '') {
                        if (res === 'Success') {
                            ToasterSevice.showSuccess('Hrm_Succeed', 5000);
                            NotificationsService.getListUserPushNotify();
                            // set true để refresh AttApprovedRoster
                            AttApproveRosterBusinessFunction.checkForReLoadScreen[ScreenName.AttApprovedRoster] = true;
                            _this.reload('E_KEEP_FILTER');

                            // Đếm lại con số ở Dashboard
                            store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                            // nếu duyệt ở màn hình notify thì không chuyển hướng.
                            if (!_isOnScreenNotification) DrawerServices.navigate('AttApproveRoster');
                        } else if (res == 'Locked') {
                            ToasterSevice.showWarning('Hrm_Locked', 5000);
                        } else {
                            ToasterSevice.showWarning(res, 5000);
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

export default {
    generateRowActionAndSelected: generateRowActionAndSelected,
    AttApproveRosterBusinessFunction: AttApproveRosterBusinessFunction
};
