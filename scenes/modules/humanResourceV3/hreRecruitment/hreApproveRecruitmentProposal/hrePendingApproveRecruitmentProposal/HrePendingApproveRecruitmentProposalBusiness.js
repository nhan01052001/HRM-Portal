import { ToasterSevice } from '../../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../../../components/VnrLoading/VnrLoadingPages';
import { dataVnrStorage } from '../../../../../../assets/auth/authentication';
import HttpService from '../../../../../../utils/HttpService';
import { translate } from '../../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../../assets/configProject/PermissionForAppMobile';
import { ConfigList } from '../../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumIcon, EnumStatus } from '../../../../../../assets/constant';
import DrawerServices from '../../../../../../utils/DrawerServices';
import NotificationsService from '../../../../../../utils/NotificationsService';
import store from '../../../../../../store';
import badgesNotification from '../../../../../../redux/badgesNotification';

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
            { E_ResourceName, E_Name, E_Rule, E_APPROVE, E_REJECT, E_CANCEL, E_REQUEST_CHANGE } = enumName;

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
                    title: translate('HRM_PortalApp_AgreeIsApprove'),
                    type: E_APPROVE,
                    onPress: (item, dataBody) =>
                        HrePendingApproveRecruitmentProposalBusiness.businessApproveRecords(
                            Array.isArray(item) ? item : [{ ...item }],
                            dataBody
                        ),
                    ...actionApprove
                }
            ];

            _selected = [
                {
                    title: translate('HRM_PortalApp_AgreeIsApprove'),
                    type: E_APPROVE,
                    onPress: (item, dataBody) =>
                        HrePendingApproveRecruitmentProposalBusiness.businessApproveRecords(item, dataBody),
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
                        HrePendingApproveRecruitmentProposalBusiness.businessRejectRecords(
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
                        HrePendingApproveRecruitmentProposalBusiness.businessRejectRecords(item, dataBody),
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
                        HrePendingApproveRecruitmentProposalBusiness.businessCancelRecords(
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
                        HrePendingApproveRecruitmentProposalBusiness.businessCancelRecords(items, dataBody),
                    ...actionCancel
                }
            ];
        }

        //action request change
        const actionRequestChange = businessAction
                ? businessAction.find((action) => action.Type === E_REQUEST_CHANGE)
                : null,
            actionRequestChangeResource = actionRequestChange ? actionRequestChange[E_ResourceName][E_Name] : null,
            actionRequestChangeRule = actionRequestChange ? actionRequestChange[E_ResourceName][E_Rule] : null,
            actionRequestChangePer =
                actionRequestChangeResource && actionRequestChangeRule
                    ? permission[actionRequestChangeResource][actionRequestChangeRule]
                    : null;

        if (actionRequestChangePer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_PortalApp_ChangeRequest'),
                    type: E_REQUEST_CHANGE,
                    onPress: (item, dataBody) =>
                        HrePendingApproveRecruitmentProposalBusiness.businessRequestChangelRecords(
                            Array.isArray(item) ? item : [{ ...item }],
                            dataBody
                        ),
                    ...actionRequestChange
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_PortalApp_ChangeRequest'),
                    type: E_REQUEST_CHANGE,
                    onPress: (items, dataBody) =>
                        HrePendingApproveRecruitmentProposalBusiness.businessRequestChangelRecords(items, dataBody),
                    ...actionRequestChange
                }
            ];
        }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const HrePendingApproveRecruitmentProposalBusiness = {
    // Đối tượng checkForReLoadScreen để check có refresh HrePendingApproveRecruitmentProposal không
    checkForReLoadScreen: {
        HreProcesedApproveRecruitmentProposal: false,
        HrePendingApproveRecruitmentProposal: false
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
                let message = translate('HRM_PortalApp_DecriptionAgree').replace('[E_NUMBER]',
                    arrValid.length === items.length ? arrValid.length : `${arrValid.length}/${items.length}`);

                HrePendingApproveRecruitmentProposalBusiness.confirmApprove({
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
                return item?.RecordID
            })
        }

        const isNote = await HrePendingApproveRecruitmentProposalBusiness.checkRequireNote('IsRequiredApproveNote')

        if (isConfirm && !objValid?.isSkipConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isNote ? isNote : isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
                placeholder = translate('HRM_PortalApp_Message_ErrorDescription');

            AlertSevice.alert({
                title: 'HRM_PortalApp_ApprovalNote',
                iconType: EnumIcon.E_APPROVE,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                message: message,
                isInputText: isInputText,
                textRightButton: 'HRM_PortalApp_AgreeIsApprove',
                onCancel: () => { },
                onConfirm: reason => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + ' ' + translate('FieldNotAllowNullShort');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        VnrLoadingSevices.show();

                        HttpService.Post('[URI_CENTER]/api/Rec_RecruitmentFlyer/SetApproveRecruitmentFlyer', {
                            Host: apiConfig.uriPor,
                            ListRecordID: listRecord,
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
                                        // set true để refresh HrePendingApproveRecruitmentProposal
                                        HrePendingApproveRecruitmentProposalBusiness.checkForReLoadScreen[
                                            ScreenName.HreProcesedApproveRecruitmentProposal
                                        ] = true;
                                        HrePendingApproveRecruitmentProposalBusiness.checkForReLoadScreen[
                                            ScreenName.HrePendingApproveRecruitmentProposal
                                        ] = true;

                                        // Đếm lại con số ở Dashboard
                                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                                        // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                                        if (!_isOnScreenNotification)
                                            DrawerServices.navigate('HrePendingApproveRecruitmentProposal');
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
            HttpService.Post('[URI_CENTER]/api/Rec_RecruitmentFlyer/SetApproveRecruitmentFlyer', {
                Host: apiConfig.uriPor,
                ListRecordID: listRecord,
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
                            // set true để refresh HrePendingApproveRecruitmentProposal
                            HrePendingApproveRecruitmentProposalBusiness.checkForReLoadScreen[
                                ScreenName.HreProcesedApproveRecruitmentProposal
                            ] = true;
                            HrePendingApproveRecruitmentProposalBusiness.checkForReLoadScreen[
                                ScreenName.HrePendingApproveRecruitmentProposal
                            ] = true;

                            // Đếm lại con số ở Dashboard
                            store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                            // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                            if (!_isOnScreenNotification) DrawerServices.navigate('HrePendingApproveRecruitmentProposal');
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
                let message = translate('HRM_PortalApp_DecriptionReject').replace('[E_NUMBER]',
                    arrValid.length === items.length ? arrValid.length : `${arrValid.length}/${items.length}`);
                HrePendingApproveRecruitmentProposalBusiness.confirmReject({
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
                return item?.RecordID
            })
        }

        const isNote = await HrePendingApproveRecruitmentProposalBusiness.checkRequireNote('IsRequiredRejectNote')
        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isNote ? isNote : isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
                placeholder = translate('Reason');

            AlertSevice.alert({
                title: 'HRM_PortalApp_PITFinalization_ReasonToRejection',
                iconType: EnumIcon.E_REJECT,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                message: message,
                isInputText: isInputText,
                textRightButton: 'HRM_PortalApp_ConfirmRejection',
                onCancel: () => { },
                onConfirm: reason => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + ' ' + translate('FieldNotAllowNullShort');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        VnrLoadingSevices.show();

                        HttpService.Post('[URI_CENTER]/api/Rec_RecruitmentFlyer/SetRejectRecruitmentFlyer', {
                            Host: apiConfig.uriPor,
                            ListRecordID: listRecord,
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
                                        // set true để refresh HrePendingApproveRecruitmentProposal
                                        HrePendingApproveRecruitmentProposalBusiness.checkForReLoadScreen[
                                            ScreenName.HreProcesedApproveRecruitmentProposal
                                        ] = true;
                                        HrePendingApproveRecruitmentProposalBusiness.checkForReLoadScreen[
                                            ScreenName.HrePendingApproveRecruitmentProposal
                                        ] = true;

                                        // Đếm lại con số ở Dashboard
                                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());
                                        // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                                        if (!_isOnScreenNotification)
                                            DrawerServices.navigate('HrePendingApproveRecruitmentProposal');
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
            HttpService.Post('[URI_CENTER]/api/Rec_RecruitmentFlyer/SetRejectRecruitmentFlyer', {
                Host: apiConfig.uriPor,
                ListRecordID: listRecord,
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
                            // set true để refresh HrePendingApproveRecruitmentProposal
                            HrePendingApproveRecruitmentProposalBusiness.checkForReLoadScreen[
                                ScreenName.HreProcesedApproveRecruitmentProposal
                            ] = true;
                            HrePendingApproveRecruitmentProposalBusiness.checkForReLoadScreen[
                                ScreenName.HrePendingApproveRecruitmentProposal
                            ] = true;

                            // Đếm lại con số ở Dashboard
                            store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());
                            // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                            if (!_isOnScreenNotification) DrawerServices.navigate('HrePendingApproveRecruitmentProposal');
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

    //#region [action request change]
    businessRequestChangelRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let arrValid = [];

            items.map(item => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_REQUEST_CHANGE) > -1) {
                    arrValid.push({
                        RecordID: item.ID,
                        Comment: '',
                        Type: 'E_REQUEST_CHANGE'
                    });
                }
            });

            if (arrValid.length > 0) {
                let message = translate('HRM_PortalApp_HreRecruitment_YouAreRequesting').replace('[E_NUMBER]',
                    arrValid.length === items.length ? arrValid.length : `${arrValid.length}/${items.length}`);
                HrePendingApproveRecruitmentProposalBusiness.confirmRequestChange({
                    ListRecord: arrValid,
                    message,
                    allItems: Array.isArray(items) ? items.length : 0
                });
            } else {
                ToasterSevice.showWarning('HRM_Common_Message_NonDataHandle');
            }
        }
    },

    confirmRequestChange: async (objValid) => {
        let actionCancel = _rowActions.find(item => item.Type === 'E_REQUEST_CHANGE'),
            isConfirm = actionCancel['Confirm'];


        let listRecord = [];
        if (objValid.ListRecord) {
            listRecord = objValid.ListRecord.map((item) => {
                return item?.RecordID
            })
        }

        const isNote = await HrePendingApproveRecruitmentProposalBusiness.checkRequireNote('IsRequiredRejectNote')
        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isNote ? isNote : isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
                placeholder = translate('Reason');

            AlertSevice.alert({
                title: 'HRM_PortalApp_HreRecruitment_ReasonForRequestingChange',
                iconType: EnumIcon.E_REQUEST_CHANGE,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                message: message,
                isInputText: isInputText,
                textRightButton: 'HRM_PortalApp_ConfirmChangeRequest',
                onCancel: () => { },
                onConfirm: reason => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + ' ' + translate('FieldNotAllowNullShort');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        VnrLoadingSevices.show();

                        HttpService.Post('[URI_CENTER]/api/Rec_RecruitmentFlyer/SetFeedbackRecruitmentFlyer', {
                            Host: apiConfig.uriPor,
                            ListRecordID: listRecord,
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
                                        // set true để refresh HrePendingApproveRecruitmentProposal
                                        HrePendingApproveRecruitmentProposalBusiness.checkForReLoadScreen[
                                            ScreenName.HreProcesedApproveRecruitmentProposal
                                        ] = true;
                                        HrePendingApproveRecruitmentProposalBusiness.checkForReLoadScreen[
                                            ScreenName.HrePendingApproveRecruitmentProposal
                                        ] = true;

                                        // Đếm lại con số ở Dashboard
                                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());
                                        // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                                        if (!_isOnScreenNotification)
                                            DrawerServices.navigate('HrePendingApproveRecruitmentProposal');
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
            HttpService.Post('[URI_CENTER]/api/Rec_RecruitmentFlyer/SetFeedbackRecruitmentFlyer', {
                Host: apiConfig.uriPor,
                ListRecordID: listRecord,
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
                            // set true để refresh HrePendingApproveRecruitmentProposal
                            HrePendingApproveRecruitmentProposalBusiness.checkForReLoadScreen[
                                ScreenName.HreProcesedApproveRecruitmentProposal
                            ] = true;
                            HrePendingApproveRecruitmentProposalBusiness.checkForReLoadScreen[
                                ScreenName.HrePendingApproveRecruitmentProposal
                            ] = true;

                            // Đếm lại con số ở Dashboard
                            store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());
                            // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                            if (!_isOnScreenNotification) DrawerServices.navigate('HrePendingApproveRecruitmentProposal');
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
