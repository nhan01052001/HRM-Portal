import { Colors } from '../../../../../constants/styleConfig';
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
                        AttApproveWorkingOvertimeBusiness.businessApproveRecords(
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
                        AttApproveWorkingOvertimeBusiness.businessApproveRecords(item, dataBody),
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
                        AttApproveWorkingOvertimeBusiness.businessRejectRecords(
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
                        AttApproveWorkingOvertimeBusiness.businessRejectRecords(item, dataBody),
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
                        AttApproveWorkingOvertimeBusiness.businessCancelRecords(
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
                        AttApproveWorkingOvertimeBusiness.businessCancelRecords(items, dataBody),
                    ...actionCancel
                }
            ];
        }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const AttApproveWorkingOvertimeBusiness = {
    // Đối tượng checkForReLoadScreen để check có refresh AttApprovedWorkingOvertime không
    checkForReLoadScreen: {
        [ScreenName.AttApprovedWorkingOvertime]: false,
        AttRejectWorkingOvertime: false,
        AttCanceledWorkingOvertime: false,
        AttAllWorkingOvertime: false
    },
    setThisForBusiness: (dataThis, isNotification) => {
        if (isNotification) _isOnScreenNotification = true;
        else _isOnScreenNotification = false;

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
                    arrValid.push({
                        RecordID: item.ID,
                        Comment: '',
                        Type: 'E_APPROVED'
                    });
                }
            });

            if (arrValid.length > 0) {
                let message = translate('HRM_PortalApp_Message_ApproveConfirm').replace('[E_NUMBER]', arrValid.length);

                // AttApproveWorkingOvertimeBusiness.confirmApprove({ ListRecord, message });
                AttApproveWorkingOvertimeBusiness.validateApproveWorkingOvertime({
                    ListRecord: arrValid,
                    message,
                    allItems: Array.isArray(items) ? items.length : 0
                });
            } else {
                ToasterSevice.showWarning('HRM_Common_Message_NonDataHandle');
            }
        }
    },

    validateApproveWorkingOvertime: objValid => {
        if (objValid && Array.isArray(objValid?.ListRecord) && objValid?.ListRecord.length > 0) {
            let listID = [];
            objValid?.ListRecord.map(item => {
                if (item.RecordID) listID.push(item.RecordID);
            });
            VnrLoadingSevices.show();
            HttpService.Post('[URI_CENTER]/api/Att_OvertimePlan/ValidateApproveRejectOvertimePlan', {
                Host: apiConfig.uriPor,
                ListRecordID: listID,
                UserLogin: headers.userlogin,
                UserProcessID: headers.userid
            })
                .then(res => {
                    VnrLoadingSevices.hide();
                    if (res) {
                        //danghai id task 0176664
                        const lsIDValid = res?.Data?.ListIdsValid;
                        if (
                            res.Status === 'SUCCESS' &&
                            res.Data &&
                            Array.isArray(res.Data?.ListIdsValid) &&
                            res.Data?.ListIdsValid.length > 0
                        ) {
                            AttApproveWorkingOvertimeBusiness.confirmApprove({
                                ListRecord: {
                                    RecordID: res.Data.ListIdsValid,
                                    Comment: '',
                                    Type: 'E_APPROVED'
                                },
                                message: translate('HRM_PortalApp_Message_ApproveConfirm').replace(
                                    '[E_NUMBER]',
                                    `${res.Data.ListIdsValid.length}/${objValid?.allItems}`
                                )
                            });
                        } else if (res.Status === 'Locked') {
                            ToasterSevice.showWarning('Hrm_Locked', 5000);
                        } else if (res?.Data?.WarningModel?.HasWarning) {
                            // nhan.nguyen: 0170903: App- Bổ sung tính năng cảnh báo vượt OT khi duyệt dữ liệu KHOT được thiết lập ở chế độ công
                            const cacheID = res?.Data?.WarningModel?.CacheID;
                            if (Array.isArray(lsIDValid) && lsIDValid.length > 0) {
                                const mess = translate('HRM_PortalApp_Message_DataExceeding').replace(
                                    '[E_NUMBER]',
                                    `${lsIDValid.length}`
                                );
                                AlertSevice.alert({
                                    title: translate('Hrm_Notification'),
                                    iconType: EnumIcon.E_WARNING,
                                    message: mess,
                                    //lưu và tiếp tục
                                    colorSecondConfirm: Colors.primary,
                                    textSecondConfirm: translate('ConfirmationPICUnion__E_AGREED'),
                                    textLeftButton: translate('PerformanceApprovalStatus__E_CANCEL'),
                                    onSecondConfirm: () => {
                                        AttApproveWorkingOvertimeBusiness.confirmApprove({
                                            ListRecord: {
                                                RecordID: lsIDValid,
                                                Comment: '',
                                                Type: 'E_APPROVED'
                                            },
                                            message: translate('HRM_PortalApp_Message_ApproveConfirm').replace(
                                                '[E_NUMBER]',
                                                `${lsIDValid.length}/${objValid?.allItems}`
                                            ),
                                            isSkipConfirm: true
                                        });
                                    },
                                    //đóng
                                    onCancel: () => {},
                                    //chi tiết lỗi
                                    textRightButton: translate('Button_Detail'),
                                    // view deatail error
                                    onConfirm: () => {
                                        if (cacheID) {
                                            VnrLoadingSevices.show();
                                            HttpService.Post(
                                                '[URI_CENTER]/api/Att_GetData/GetErrorMessageRespone',
                                                {
                                                    cacheID: cacheID,
                                                    IsPortal: true,
                                                    ProfileID: headers.userid
                                                }
                                            ).then(res => {
                                                VnrLoadingSevices.hide();
                                                if (res && res.Data && res.Status == EnumName.E_SUCCESS) {
                                                    const data = res.Data.Data;
                                                    if (typeof _this?.onShowModalError === 'function') {
                                                            _this?.onShowModalError(data, cacheID);
                                                    }
                                                }
                                            });
                                        }
                                    }
                                });
                            } else {
                                ToasterSevice.showWarning(res.Message, 5000);
                            }
                        } else {
                            AttApproveWorkingOvertimeBusiness.confirmApprove({
                                ListRecord: {
                                    RecordID: lsIDValid,
                                    Comment: '',
                                    Type: 'E_APPROVED'
                                },
                                message: translate('HRM_PortalApp_Message_ApproveConfirm').replace(
                                    '[E_NUMBER]',
                                    `${lsIDValid.length}/${objValid?.allItems}`
                                )
                            });
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

    confirmApprove: async (objValid) => {

        let actionCancel = _rowActions.find(item => item.Type === 'E_APPROVE'),
            isConfirm = actionCancel['Confirm'];

        const isNote = await AttApproveWorkingOvertimeBusiness.checkRequireNote('IsRequiredApproveNote')

        if (isConfirm && !objValid?.isSkipConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isNote ? isNote : isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
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
                        let mesNotEmpty = placeholder + ' ' + translate('FieldNotAllowNullShort');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        VnrLoadingSevices.show();

                        HttpService.Post('[URI_CENTER]/api/Att_OvertimePlan/SetApproveOvertimePlanInPortal', {
                            Host: apiConfig.uriPor,
                            ListRecordID: objValid.ListRecord.RecordID,
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
                                        // set true để refresh AttApprovedWorkingOvertime
                                        AttApproveWorkingOvertimeBusiness.checkForReLoadScreen[
                                            ScreenName.AttAllWorkingOvertime
                                        ] = true;
                                        AttApproveWorkingOvertimeBusiness.checkForReLoadScreen[
                                            ScreenName.AttApprovedWorkingOvertime
                                        ] = true;

                                        // Đếm lại con số ở Dashboard
                                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                                        // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                                        if (!_isOnScreenNotification)
                                            DrawerServices.navigate('AttApproveWorkingOvertime');
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
            HttpService.Post('[URI_CENTER]/api/Att_OvertimePlan/SetApproveOvertimePlanInPortal', {
                Host: apiConfig.uriPor,
                ListRecordID: objValid.ListRecord.RecordID,
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
                            // set true để refresh AttApproveWorkingOvertime
                            AttApproveWorkingOvertimeBusiness.checkForReLoadScreen[
                                ScreenName.AttAllWorkingOvertime
                            ] = true;
                            AttApproveWorkingOvertimeBusiness.checkForReLoadScreen[
                                ScreenName.AttApprovedWorkingOvertime
                            ] = true;

                            // Đếm lại con số ở Dashboard
                            store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                            // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                            if (!_isOnScreenNotification) DrawerServices.navigate('AttApproveWorkingOvertime');
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
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_APPROVE) > -1) {
                    arrValid.push({
                        RecordID: item.ID,
                        Comment: '',
                        Type: 'E_REJECTED'
                    });
                }
            });

            if (arrValid.length > 0) {
                let message = translate('HRM_PortalApp_Message_RejectConfirm').replace('[E_NUMBER]', arrValid.length);
                AttApproveWorkingOvertimeBusiness.validateRejectWorkingOvertime({
                    ListRecord: arrValid,
                    message,
                    allItems: Array.isArray(items) ? items.length : 0
                });
            } else {
                ToasterSevice.showWarning('HRM_Common_Message_NonDataHandle');
            }
        }
    },

    validateRejectWorkingOvertime: objValid => {
        if (objValid && Array.isArray(objValid?.ListRecord) && objValid?.ListRecord.length > 0) {
            let listID = [];
            objValid?.ListRecord.map(item => {
                if (item.RecordID) listID.push(item.RecordID);
            });
            VnrLoadingSevices.show();
            HttpService.Post('[URI_CENTER]/api/Att_OvertimePlan/ValidateApproveRejectOvertimePlan', {
                Host: apiConfig.uriPor,
                ListRecordID: listID,
                UserLogin: headers.userlogin,
                UserProcessID: headers.userid
            })
                .then(res => {
                    VnrLoadingSevices.hide();
                    if (res) {
                        //dang hai id task 0176664
                        if (
                            res.Status === 'SUCCESS' &&
                            res.Data &&
                            Array.isArray(res.Data?.ListIdsValid) &&
                            res.Data?.ListIdsValid.length > 0
                        ) {
                            AttApproveWorkingOvertimeBusiness.confirmReject({
                                ListRecord: {
                                    RecordID: res.Data.ListIdsValid,
                                    Comment: '',
                                    Type: 'E_APPROVED'
                                },
                                message: translate('HRM_PortalApp_Message_RejectConfirm').replace(
                                    '[E_NUMBER]',
                                    `${res.Data.ListIdsValid.length}/${objValid?.allItems}`
                                )
                            });
                        } else if (res.Status === 'Locked') {
                            ToasterSevice.showWarning('Hrm_Locked', 5000);
                        } else {
                            ToasterSevice.showWarning(res.Message, 5000);
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

    confirmReject: async (objValid) => {
        let actionCancel = _rowActions.find(item => item.Type === 'E_REJECT'),
            isConfirm = actionCancel['Confirm'];

        const isNote = await AttApproveWorkingOvertimeBusiness.checkRequireNote('IsRequiredRejectNote')
        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isNote ? isNote : isConfirm['isValidInputText'],
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
                        let mesNotEmpty = placeholder + ' ' + translate('FieldNotAllowNullShort');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        VnrLoadingSevices.show();

                        HttpService.Post('[URI_CENTER]/api/Att_OvertimePlan/SetRejectOvertimePlanInPortal', {
                            Host: apiConfig.uriPor,
                            ListRecordID: objValid.ListRecord.RecordID,
                            UserLogin: headers.userlogin,
                            UserProcessID: headers.userid,
                            Comment: reason ? reason : null
                        }).then(res => {
                            VnrLoadingSevices.hide();
                            try {
                                if (res) {
                                    if (res.Status === 'SUCCESS') {
                                        ToasterSevice.showSuccess('Hrm_Succeed', 5000);
                                        NotificationsService.getListUserPushNotify();
                                        _this.reload('E_KEEP_FILTER');
                                        // set true để refresh AttApprovedWorkingOvertime
                                        AttApproveWorkingOvertimeBusiness.checkForReLoadScreen[
                                            ScreenName.AttAllWorkingOvertime
                                        ] = true;
                                        AttApproveWorkingOvertimeBusiness.checkForReLoadScreen[
                                            ScreenName.AttApprovedWorkingOvertime
                                        ] = true;

                                        // Đếm lại con số ở Dashboard
                                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());
                                        // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                                        if (!_isOnScreenNotification)
                                            DrawerServices.navigate('AttApproveWorkingOvertime');
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
            HttpService.Post('[URI_CENTER]/api/Att_OvertimePlan/SetRejectOvertimePlanInPortal', {
                Host: apiConfig.uriPor,
                ListRecordID: objValid.ListRecord.RecordID,
                UserLogin: headers.userlogin,
                UserProcessID: headers.userid,
                Comment: ''
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res) {
                        if (res.Status === 'SUCCESS') {
                            ToasterSevice.showSuccess('Hrm_Succeed', 5000);
                            NotificationsService.getListUserPushNotify();
                            _this.reload('E_KEEP_FILTER');
                            // set true để refresh AttApprovedWorkingOvertime
                            AttApproveWorkingOvertimeBusiness.checkForReLoadScreen[
                                ScreenName.AttAllWorkingOvertime
                            ] = true;
                            AttApproveWorkingOvertimeBusiness.checkForReLoadScreen[
                                ScreenName.AttApprovedWorkingOvertime
                            ] = true;

                            // Đếm lại con số ở Dashboard
                            store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());
                            // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                            if (!_isOnScreenNotification) DrawerServices.navigate('AttApproveWorkingOvertime');
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
            let ListRecordID = [];
            let arrValid = [];

            items.forEach(item => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_CANCEL) > -1) {
                    ListRecordID.push(item.ID);
                    arrValid.push(item.ID);
                }
            });

            if (arrValid.length > 0 && ListRecordID.length > 0) {
                let message = translate('HRM_PortalApp_TSL_Cancle').replace('[E_NUMBER]', arrValid.length);

                // AttApproveWorkingOvertimeBusiness.confirmCancel({ ListRecordID, message });
                AttApproveWorkingOvertimeBusiness.validateCancleWorkingOvertime({ ListRecordID, message });
            } else {
                ToasterSevice.showWarning('HRM_PortalApp_Status_AllowCancel');
            }
        }
    },

    validateCancleWorkingOvertime: objValid => {
        if (objValid && Array.isArray(objValid?.ListRecordID) && objValid?.ListRecordID.length > 0) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_CENTER]/api/Att_OvertimePlan/ValidateCancelOvertimePlanByUserApprove', {
                Host: apiConfig.uriPor,
                ListRecordID: objValid?.ListRecordID,
                UserLogin: headers.userlogin,
                UserProcessID: headers.userid
            })
                .then(res => {
                    VnrLoadingSevices.hide();
                    if (res) {
                        if (res.Status === 'SUCCESS' && res.Data && Array.isArray(res.Data) && res.Data.length > 0) {
                            AttApproveWorkingOvertimeBusiness.confirmCancel({
                                ListRecord: {
                                    RecordID: res.Data,
                                    Comment: '',
                                    Type: 'E_CANCEL'
                                },
                                message: translate('HRM_PortalApp_Message_RejectConfirm').replace(
                                    '[E_NUMBER]',
                                    `${res.Data.length}/${objValid?.ListRecordID.length}`
                                )
                            });
                        } else if (res.Status === 'Locked') {
                            ToasterSevice.showWarning('Hrm_Locked', 5000);
                        } else {
                            ToasterSevice.showWarning(res.Message, 5000);
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

        const isNote = await AttApproveWorkingOvertimeBusiness.checkRequireNote('IsRequiredCancelNote')

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isNote ? isNote : isConfirm['isValidInputText'],
                placeholder = translate('HRM_Common_CommentCancel');

            AlertSevice.alert({
                iconType: EnumIcon.E_CANCEL,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                message: objValid.message,
                isInputText: isInputText,
                onCancel: () => {},
                onConfirm: reason => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + ' ' + translate('FieldNotAllowNullShort');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        VnrLoadingSevices.show();
                        HttpService.Post('[URI_CENTER]/api/Att_OvertimePlan/ProcessCancelOvertimePlanPortal', {
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
                                        AttApproveWorkingOvertimeBusiness.checkForReLoadScreen[
                                            ScreenName.AttAllWorkingOvertime
                                        ] = true;
                                        AttApproveWorkingOvertimeBusiness.checkForReLoadScreen[
                                            ScreenName.AttCanceledWorkingOvertime
                                        ] = true;
                                    } else if (res.Status == 'Locked') {
                                        ToasterSevice.showWarning('Hrm_Locked', 5000);
                                    } else {
                                        ToasterSevice.showWarning(
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
            HttpService.Post('[URI_CENTER]/api/Att_OvertimePlan/ProcessCancelOvertimePlanPortal', {
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
                            AttApproveWorkingOvertimeBusiness.checkForReLoadScreen[
                                ScreenName.AttAllWorkingOvertime
                            ] = true;
                            AttApproveWorkingOvertimeBusiness.checkForReLoadScreen[
                                ScreenName.AttCanceledWorkingOvertime
                            ] = true;
                        } else if (res.Status == 'Locked') {
                            ToasterSevice.showWarning('Hrm_Locked', 5000);
                        } else {
                            ToasterSevice.showWarning(res.Message ? res.Message : 'HRM_Common_SendRequest_Error', 5000);
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
