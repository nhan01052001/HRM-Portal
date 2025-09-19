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
import store from '../../../../../store';
import badgesNotification from '../../../../../redux/badgesNotification';

let enumName = EnumName,
    attApproveLeaveDayCancel = ScreenName.AttApproveLeaveDayCancel,
    apiConfig = null,
    headers = null;

let _this = null,
    _isOnScreenNotification = false,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];
    apiConfig = dataVnrStorage.apiConfig;
    headers = dataVnrStorage.currentUser.headers;
    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[attApproveLeaveDayCancel],
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
                    onPress: (item, dataBody) =>
                        AttApproveLeaveDayCancelBusinessFunction.businessApproveRecords([{ ...item }], dataBody),
                    ...actionApprove
                }
            ];

            _selected = [
                {
                    title: translate('HRM_Common_Approve'),
                    type: E_APPROVE,
                    onPress: (item, dataBody) =>
                        AttApproveLeaveDayCancelBusinessFunction.businessApproveRecords(item, dataBody),
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
                        AttApproveLeaveDayCancelBusinessFunction.businessRejectRecords([{ ...item }], dataBody),
                    ...actionReject
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Reject'),
                    type: E_REJECT,
                    onPress: (item, dataBody) =>
                        AttApproveLeaveDayCancelBusinessFunction.businessRejectRecords(item, dataBody),
                    ...actionReject
                }
            ];
        }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const AttApproveLeaveDayCancelBusinessFunction = {
    // Đối tượng checkForReLoadScreen để check có refresh ListApprovedStopWorking không
    checkForReLoadScreen: {
        [ScreenName.AttApprovedLeaveDayCancel]: false
    },
    setThisForBusiness: (dataThis, isNotification) => {
        if (isNotification) _isOnScreenNotification = true;
        else _isOnScreenNotification = false;

        _this = dataThis;
    },
    //#region [action reject]
    businessRejectRecords: (items, dataBody) => {

        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 5000);
        } else {
            let selectedID = items.map(item => {
                return item.ID;
            });

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Por_GetData/BusinessAllowActionReject', {
                selectedID,
                screenName: attApproveLeaveDayCancel,
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && typeof res === 'object') {
                        let isValid = res.isValid;

                        //dữ liệu hợp lệ => gọi hàm confirm Hủy
                        if (isValid) {
                            AttApproveLeaveDayCancelBusinessFunction.confirmReject(res);
                        }
                        //không hợp lệ
                        else if (isValid == false && res.message && typeof res.message === 'string') {
                            ToasterSevice.showWarning(res.message, 4000);
                        }
                        //FAIL
                        else {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                        }
                    }
                    //FAIL
                    else {
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
            isConfirm = actionCancel[enumName.E_Confirm];

        if (isConfirm) {
            let isInputText = isConfirm[enumName.E_isInputText],
                isValidInputText = isConfirm[enumName.E_isValidInputText],
                message = objValid.message && typeof objValid.message === enumName.E_string ? objValid.message : null,
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
                        let strId = objValid.strResultID;
                        AttApproveLeaveDayCancelBusinessFunction.setStatusReject({ Ids: strId, reason });
                    }
                }
            });
        } else {
            let strId = objValid.strResultID;
            AttApproveLeaveDayCancelBusinessFunction.setStatusReject({ Ids: strId });
        }
    },

    setStatusReject: objValid => {
        let selectedIds = objValid.Ids,
            DeclineReason = objValid.reason;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/SetRejectRequestLeaveDayCancelPortal', {
            host: apiConfig.uriPor,
            selectedIds,
            userProcessID: headers.userid,
            DeclineReason
        }).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res && res !== '') {
                    if (res === enumName.E_Success) {
                        ToasterSevice.showSuccess('Hrm_Succeed', 5000);
                        _this.reload('E_KEEP_FILTER');
                        // set true để refresh AttApprovedLeaveDay
                        AttApproveLeaveDayCancelBusinessFunction.checkForReLoadScreen[
                            ScreenName.AttApprovedLeaveDayCancel
                        ] = true;

                        // Đếm lại con số ở Dashboard
                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                        // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                        if (!_isOnScreenNotification) DrawerServices.navigate(attApproveLeaveDayCancel);
                    } else if (res == enumName.E_Locked) {
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
    },
    //#endregion

    //#region [action approve]

    businessApproveRecords: (items, dataBody) => {

        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 5000);
        } else {
            let selectedID = items.map(item => {
                return item.ID;
            });

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Por_GetData/BusinessAllowActionApprove', {
                selectedID,
                screenName: attApproveLeaveDayCancel,
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && typeof res === enumName.E_object) {
                        let isValid = res.isValid;

                        //dữ liệu hợp lệ => gọi hàm confirm
                        if (isValid) {
                            AttApproveLeaveDayCancelBusinessFunction.confirmApprove(res);
                        }
                        //không hợp lệ
                        else if (isValid == false && res.message && typeof res.message === enumName.E_string) {
                            ToasterSevice.showWarning(res.message, 4000);
                        }
                        //FAIL
                        else {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                        }
                    }
                    //FAIL
                    else {
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
                        //check khung giờ cho Phổ Đình
                        let strId = objValid.strResultID;
                        AttApproveLeaveDayCancelBusinessFunction.setStatusApprove({ Ids: strId, reason });
                    }
                }
            });
        } else {
            //check khung giờ cho Phổ Đình
            let strId = objValid.strResultID;
            AttApproveLeaveDayCancelBusinessFunction.setStatusApprove({ Ids: strId });
        }
    },

    setStatusApprove: objValid => {
        let selectedIds = objValid.Ids,
            approveComment = objValid.reason;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/SetApproveRequestLeaveDayCancelPortal', {
            host: apiConfig.uriPor,
            selectedIds,
            userProcessID: headers.userid,
            approveComment
        }).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res && res !== '') {
                    if (res == enumName.E_Success) {
                        ToasterSevice.showSuccess('Hrm_Succeed', 5000);
                        _this.reload('E_KEEP_FILTER');
                        // set true để refresh AttApprovedLeaveDay
                        AttApproveLeaveDayCancelBusinessFunction.checkForReLoadScreen[
                            ScreenName.AttApprovedLeaveDayCancel
                        ] = true;

                        // Đếm lại con số ở Dashboard
                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                        // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                        if (!_isOnScreenNotification) DrawerServices.navigate(attApproveLeaveDayCancel);
                    } else if (res == enumName.E_Locked) {
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
    //#endregion
};

export default {
    generateRowActionAndSelected: generateRowActionAndSelected,
    AttApproveLeaveDayCancelBusinessFunction: AttApproveLeaveDayCancelBusinessFunction
};
