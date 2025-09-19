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
            { E_ResourceName, E_Name, E_Rule, E_APPROVE, E_REJECT, E_REQUEST_CHANGE } = enumName;

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
                        HreRecruitmentProposalProcessingBusiness.businessApproveRecords(
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
                        HreRecruitmentProposalProcessingBusiness.businessApproveRecords(item, dataBody),
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
                        HreRecruitmentProposalProcessingBusiness.businessRejectRecords(
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
                        HreRecruitmentProposalProcessingBusiness.businessRejectRecords(item, dataBody),
                    ...actionReject
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
                    title: translate('HRM_PortalApp_HreRecruitmentProposalProcessing_ChangeRequest'),
                    type: E_REQUEST_CHANGE,
                    onPress: (item, dataBody) =>
                        HreRecruitmentProposalProcessingBusiness.businessRequestChangelRecords(
                            Array.isArray(item) ? item : [{ ...item }],
                            dataBody
                        ),
                    ...actionRequestChange
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_PortalApp_HreRecruitmentProposalProcessing_ChangeRequest'),
                    type: E_REQUEST_CHANGE,
                    onPress: (items, dataBody) =>
                        HreRecruitmentProposalProcessingBusiness.businessRequestChangelRecords(items, dataBody),
                    ...actionRequestChange
                }
            ];
        }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const HreRecruitmentProposalProcessingBusiness = {
    // Đối tượng checkForReLoadScreen để check có refresh HreWaitRecruitmentProposalProcessing không
    checkForReLoadScreen: {
        HreDoneRecruitmentProposalProcessing: false,
        HreWaitRecruitmentProposalProcessing: false
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

                // HreRecruitmentProposalProcessingBusiness.confirmApprove({ ListRecord, message });
                HreRecruitmentProposalProcessingBusiness.validateApproveRecProposalProcessing({
                    ListRecord: arrValid,
                    message,
                    allItems: Array.isArray(items) ? items.length : 0
                });
            } else {
                ToasterSevice.showWarning('HRM_Common_Message_NonDataHandle');
            }
        }
    },

    validateApproveRecProposalProcessing: objValid => {
        if (objValid && Array.isArray(objValid?.ListRecord) && objValid?.ListRecord.length > 0) {
            let listID = [];
            objValid?.ListRecord.map(item => {
                if (item.RecordID) listID.push(item.RecordID);
            });
            VnrLoadingSevices.show();
            HttpService.Post('[URI_CENTER]/api/Rec_RequirementRecruitmentNew/ValidateRecordRequirementRecruitment', {
                Host: apiConfig.uriPor,
                ListRecordID: listID,
                ActionType: 'E_APPROVE',
                UserLogin: headers.userlogin,
                UserProcessID: headers.userid
            })
                .then(res => {
                    VnrLoadingSevices.hide();
                    if (res) {
                        if (res.Status === 'SUCCESS' && res.Data && Array.isArray(res.Data) && res.Data.length > 0) {
                            HreRecruitmentProposalProcessingBusiness.confirmApprove({
                                ListRecord: {
                                    RecordID: res.Data,
                                    Comment: '',
                                    Type: 'E_APPROVED'
                                },
                                message: translate('HRM_PortalApp_Message_ApproveConfirm').replace(
                                    '[E_NUMBER]',
                                    `${res.Data.length}/${objValid?.allItems}`
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

    confirmApprove: async (objValid) => {

        let actionCancel = _rowActions.find(item => item.Type === 'E_APPROVE'),
            isConfirm = actionCancel['Confirm'];

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
                placeholder = translate('HRM_PortalApp_Notes'),
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
                title: 'ReasonApprove',
                textLimit: textLimit,
                textRightButton: 'HRM_PortalApp_AgreeIsApprove',
                onCancel: () => {},
                onConfirm: reason => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + ' ' + translate('FieldNotAllowNullShort');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        VnrLoadingSevices.show();

                        // objValid.ListRecord = objValid.ListRecord.map(item => {
                        //     item.Comment = reason;
                        //     return item;
                        // });
                        HttpService.Post('[URI_CENTER]/api/Rec_RequirementRecruitmentNew/SetApproveRequirementRecruitment', {
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

                                        HreRecruitmentProposalProcessingBusiness.checkForReLoadScreen[
                                            ScreenName.HreWaitRecruitmentProposalProcessing
                                        ] = true;
                                        HreRecruitmentProposalProcessingBusiness.checkForReLoadScreen[
                                            ScreenName.HreDoneRecruitmentProposalProcessing
                                        ] = true;

                                        // Đếm lại con số ở Dashboard
                                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                                        // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                                        if (!_isOnScreenNotification) DrawerServices.navigate('HreWaitRecruitmentProposalProcessing');
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
            HttpService.Post('[URI_CENTER]/api/Rec_RequirementRecruitmentNew/SetApproveRequirementRecruitment', {
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

                            HreRecruitmentProposalProcessingBusiness.checkForReLoadScreen[
                                ScreenName.HreWaitRecruitmentProposalProcessing
                            ] = true;
                            HreRecruitmentProposalProcessingBusiness.checkForReLoadScreen[
                                ScreenName.HreDoneRecruitmentProposalProcessing
                            ] = true;

                            // Đếm lại con số ở Dashboard
                            store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                            // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                            if (!_isOnScreenNotification) DrawerServices.navigate('HreWaitRecruitmentProposalProcessing');
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

                // HreRecruitmentProposalProcessingBusiness.confirmReject({ ListRecord, message });
                HreRecruitmentProposalProcessingBusiness.validateRejectRecProposalProcessing({
                    ListRecord: arrValid,
                    message,
                    allItems: Array.isArray(items) ? items.length : 0
                });
            } else {
                ToasterSevice.showWarning('HRM_Common_Message_NonDataHandle');
            }
        }
    },

    validateRejectRecProposalProcessing: objValid => {
        if (objValid && Array.isArray(objValid?.ListRecord) && objValid?.ListRecord.length > 0) {
            let listID = [];
            objValid?.ListRecord.map(item => {
                if (item.RecordID) listID.push(item.RecordID);
            });
            VnrLoadingSevices.show();
            HttpService.Post('[URI_CENTER]/api/Rec_RequirementRecruitmentNew/ValidateRecordRequirementRecruitment', {
                Host: apiConfig.uriPor,
                ListRecordID: listID,
                ActionType: 'E_REJECT',
                UserLogin: headers.userlogin,
                UserProcessID: headers.userid
            })
                .then(res => {
                    VnrLoadingSevices.hide();
                    if (res) {
                        if (res.Status === 'SUCCESS' && res.Data && Array.isArray(res.Data) && res.Data.length > 0) {
                            HreRecruitmentProposalProcessingBusiness.confirmReject({
                                ListRecord: {
                                    RecordID: res.Data,
                                    Comment: '',
                                    Type: 'E_APPROVED'
                                },
                                message: translate('HRM_PortalApp_Message_Rec_RejectConfirm').replace(
                                    '[E_NUMBER]',
                                    `${res.Data.length}/${objValid?.allItems}`
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

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = true,
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
                placeholder = translate('HRM_PortalApp_Notes'),
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
                title: 'HRM_PortalApp_PITFinalization_ReasonToRejection',
                textLimit: textLimit,
                textRightButton: 'HRM_PortalApp_ConfirmRejection',
                onCancel: () => {},
                onConfirm: reason => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + ' ' + translate('FieldNotAllowNullShort');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        VnrLoadingSevices.show();

                        // objValid.ListRecord = objValid.ListRecord.map(item => {
                        //     item.Comment = reason;
                        //     return item;
                        // });

                        HttpService.Post('[URI_CENTER]/api/Rec_RequirementRecruitmentNew/SetRejectRequirementRecruitment', {
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
                                        ToasterSevice.showSuccess('Hrm_Succeed', 5000);
                                        NotificationsService.getListUserPushNotify();
                                        _this.reload('E_KEEP_FILTER');
                                        HreRecruitmentProposalProcessingBusiness.checkForReLoadScreen[
                                            ScreenName.HreDoneRecruitmentProposalProcessing
                                        ] = true;
                                        HreRecruitmentProposalProcessingBusiness.checkForReLoadScreen[
                                            ScreenName.HreWaitRecruitmentProposalProcessing
                                        ] = true;

                                        // Đếm lại con số ở Dashboard
                                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());
                                        // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                                        if (!_isOnScreenNotification) DrawerServices.navigate('HreWaitRecruitmentProposalProcessing');
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
            HttpService.Post('[URI_CENTER]/api/Rec_RequirementRecruitmentNew/SetRejectRequirementRecruitment', {
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

                            HreRecruitmentProposalProcessingBusiness.checkForReLoadScreen[
                                ScreenName.HreWaitRecruitmentProposalProcessing
                            ] = true;
                            HreRecruitmentProposalProcessingBusiness.checkForReLoadScreen[
                                ScreenName.HreDoneRecruitmentProposalProcessing
                            ] = true;

                            // Đếm lại con số ở Dashboard
                            store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());
                            // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                            if (!_isOnScreenNotification) DrawerServices.navigate('HreWaitRecruitmentProposalProcessing');
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
        } else if (items.length > 1) {
            ToasterSevice.showWarning('HRM_PortalApp_Rec_OnlyOneChangeRequest', 4000);
        } else {
            let ListRecordID = [];
            let arrValid = [];

            items.forEach((item) => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_REQUEST_CHANGE) > -1) {
                    ListRecordID.push(item.ID);
                    arrValid.push(item.ID);
                }
            });

            if (arrValid.length > 0 && ListRecordID.length > 0) {
                HreRecruitmentProposalProcessingBusiness.validateRequestChangeRecProposalProcessing({ ListRecordID });
            } else {
                ToasterSevice.showWarning('HRM_PortalApp_DataCanNotRequestChange');
            }
        }
    },

    validateRequestChangeRecProposalProcessing: (objValid) => {
        if (objValid && Array.isArray(objValid?.ListRecordID) && objValid?.ListRecordID.length > 0) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_CENTER]/api/Rec_RequirementRecruitmentNew/ValidateRecordRequirementRecruitment', {
                ListRecordID: objValid?.ListRecordID,
                ActionType: 'E_FEEDBACK',
                Host: apiConfig.uriPor,
                UserLogin: headers.userlogin,
                UserProcessID: headers.userid
            })
                .then((res) => {
                    VnrLoadingSevices.hide();
                    if (res) {
                        if (res.Status === 'SUCCESS' && res.Data && Array.isArray(res.Data) && res.Data.length > 0) {
                            let messsage = translate('HRM_PortalApp_Rec_SubmitChangeRequest').replace(
                                '[E_NUMBER]',
                                `${res.Data.length}/${objValid?.ListRecordID.length}`
                            );
                            HreRecruitmentProposalProcessingBusiness.confirmRequestChange({
                                ListRecord: res.Data,
                                message: messsage
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
                .catch((error) => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                });
        }
    },

    confirmRequestChange: (objValid) => {
        let actionCancel = _rowActions.find((item) => item.Type === 'E_REQUEST_CHANGE'),
            isConfirm = actionCancel['Confirm'];

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = true,
                placeholder = translate('HRM_PortalApp_Notes'),
                limit = 500,
                textLimit = translate('HRM_Sytem_Reason_DynamicMaxLength').replace(
                    '[E_DYNAMIC1]',
                    `[${translate('HRM_Hre_ApproveWalletConfirmation_RejectionReason')}]`
                );
            textLimit = textLimit.replace('[E_DYNAMIC2]', 500);

            AlertSevice.alert({
                iconType: EnumIcon.E_REQUEST_CHANGE,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                message: objValid.message,
                isInputText: isInputText,
                title: 'HRM_PortalApp_HreRecruitmentProposalProcessing_ChangeRequest',
                textRightButton: 'HRM_PortalApp_ConfirmChangeRequest',
                limit: limit,
                textLimit: textLimit,
                onCancel: () => {},
                onConfirm: (reason) => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + ' ' + translate('FieldNotAllowNullShort');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        VnrLoadingSevices.show();
                        HttpService.Post('[URI_CENTER]/api/Rec_RequirementRecruitmentNew/SetFeedbackRequirementRecruitment', {
                            ListRecordID: objValid.ListRecord,
                            Comment: reason
                        }).then((res) => {
                            VnrLoadingSevices.hide();
                            try {
                                if (res && res !== '') {
                                    if (res.Status == 'SUCCESS') {
                                        ToasterSevice.showSuccess(res.Message ? res.Message : 'Hrm_Succeed', 5000);
                                        NotificationsService.getListUserPushNotify();
                                        _this.reload('E_KEEP_FILTER');
                                        HreRecruitmentProposalProcessingBusiness.checkForReLoadScreen[
                                            ScreenName.HreDoneRecruitmentProposalProcessing
                                        ] = true;
                                        HreRecruitmentProposalProcessingBusiness.checkForReLoadScreen[
                                            ScreenName.HreWaitRecruitmentProposalProcessing
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
            HttpService.Post('[URI_CENTER]/api/Hre_StopWorking/SetRequestChangeStopWorking', {
                Host: apiConfig.uriPor,
                ListRecordID: objValid.ListRecord.RecordID,
                UserLogin: headers.userlogin,
                UserProcessID: headers.userid,
                Comment: ''
            }).then((res) => {
                VnrLoadingSevices.hide();
                try {
                    if (res && res !== '') {
                        if (res.Status == 'SUCCESS') {
                            ToasterSevice.showSuccess(res.Message ? res.Message : 'Hrm_Succeed', 5000);
                            NotificationsService.getListUserPushNotify();
                            _this.reload('E_KEEP_FILTER');
                            HreRecruitmentProposalProcessingBusiness.checkForReLoadScreen[
                                ScreenName.HreWaitRecruitmentProposalProcessing
                            ] = true;
                            HreRecruitmentProposalProcessingBusiness.checkForReLoadScreen[
                                ScreenName.HreDoneRecruitmentProposalProcessing
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
};
