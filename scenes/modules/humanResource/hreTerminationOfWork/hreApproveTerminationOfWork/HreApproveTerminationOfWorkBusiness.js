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

export const generateRowActionAndSelected = (screenName) => {
    _rowActions = [];
    _selected = [];
    apiConfig = dataVnrStorage.apiConfig;
    headers = dataVnrStorage.currentUser.headers;

    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[screenName],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_ResourceName, E_Name, E_Rule, E_APPROVE, E_REJECT, E_REQUEST_CHANGE } = enumName;

        const actionApprove = businessAction ? businessAction.find((action) => action.Type === E_APPROVE) : null,
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
                        HreApproveTerminationOfWorkBusinessFunction.businessApproveRecords(
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
                        HreApproveTerminationOfWorkBusinessFunction.businessApproveRecords(item, dataBody),
                    ...actionApprove
                }
            ];
        }

        const actionReject = businessAction ? businessAction.find((action) => action.Type === E_REJECT) : null,
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
                        HreApproveTerminationOfWorkBusinessFunction.businessRejectRecords(
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
                        HreApproveTerminationOfWorkBusinessFunction.businessRejectRecords(item, dataBody),
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
                    title: translate('HRM_PortalApp_ChangRequest'),
                    type: E_REQUEST_CHANGE,
                    onPress: (item, dataBody) =>
                        HreApproveTerminationOfWorkBusinessFunction.businessRequestChangelRecords(
                            Array.isArray(item) ? item : [{ ...item }],
                            dataBody
                        ),
                    ...actionRequestChange
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_PortalApp_ChangRequest'),
                    type: E_REQUEST_CHANGE,
                    onPress: (items, dataBody) =>
                        HreApproveTerminationOfWorkBusinessFunction.businessRequestChangelRecords(items, dataBody),
                    ...actionRequestChange
                }
            ];
        }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const HreApproveTerminationOfWorkBusinessFunction = {
    // Đối tượng checkForReLoadScreen để check có refresh HreApprovedTerminationOfWork không
    checkForReLoadScreen: {
        HreApprovedTerminationOfWork: false,
        HreRejectTerminationOfWork: false,
        HreCanceledTerminationOfWork: false,
        HreAllTerminationOfWork: false,
        HreApproveTerminationOfWork: false
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

            items.map((item) => {
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

                HreApproveTerminationOfWorkBusinessFunction.validateApproveTerminationOfWork({
                    ListRecord: arrValid,
                    message,
                    allItems: Array.isArray(items) ? items.length : 0
                });
            } else {
                ToasterSevice.showWarning('HRM_PortalApp_DataCanNotApprove');
            }
        }
    },

    validateApproveTerminationOfWork: (objValid) => {
        if (objValid && Array.isArray(objValid?.ListRecord) && objValid?.ListRecord.length > 0) {
            let listID = [];
            objValid?.ListRecord.map((item) => {
                if (item.RecordID) listID.push(item.RecordID);
            });
            VnrLoadingSevices.show();
            HttpService.Post('[URI_CENTER]/api/Hre_StopWorking/ValidateApproveOrRejectStopWorking', {
                Host: apiConfig.uriPor,
                ListRecordID: listID,
                UserLogin: headers.userlogin,
                UserProcessID: headers.userid
            })
                .then((res) => {
                    VnrLoadingSevices.hide();
                    if (res) {
                        const lsIDValid = res?.Data;
                        if (res.Status === 'SUCCESS' && lsIDValid && Array.isArray(lsIDValid) && lsIDValid.length > 0) {
                            HreApproveTerminationOfWorkBusinessFunction.validateButtonApprovedTheSurveyStopWorking({
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
                        } else if (res.Status === 'Locked') {
                            ToasterSevice.showWarning('Hrm_Locked', 5000);
                        } else if (res.Status === EnumName.E_FAIL) {
                            ToasterSevice.showWarning('HRM_PortalApp_DataCanNotApprove');
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

    validateButtonApprovedTheSurveyStopWorking: (objValid) => {
        if (objValid && objValid.ListRecord && objValid.ListRecord.RecordID) {
            VnrLoadingSevices.show();
            HttpService.MultiRequest([
                HttpService.Post('[URI_CENTER]/api/Hre_StopWorking/New_ValidateButtonApprovedTheSurveyStopWorking', {
                    ListSelectedId: objValid.ListRecord.RecordID
                }),
                HttpService.Post(
                    `[URI_CENTER]/api/Hre_GetData/GetConfigAllowNoteWhenaApprove?KeyScreen=${EnumName.E_ALLOWNOTE_STOPWORKING}`
                )
            ])
                .then((res) => {
                    VnrLoadingSevices.hide();
                    const [valSurveyApproved, configNote] = res;
                    let isShowNote = configNote && configNote.Data ? configNote.Data : null;
                    if (valSurveyApproved && valSurveyApproved?.Status === EnumName.E_SUCCESS) {
                        const { StatusRecord, ActionStatus, SurveyPortalID, SurveyProfileID } = valSurveyApproved.Data;

                        if ((StatusRecord && StatusRecord == 'E_CONTINUEAPPROVED') || StatusRecord == 'E_DONESURVEY') {
                            // Đã làm hoặc không cấu hình
                            HreApproveTerminationOfWorkBusinessFunction.confirmApprove(objValid, isShowNote);
                        } else if (StatusRecord && StatusRecord == 'E_NOTSURVEY' && SurveyPortalID && SurveyProfileID) {
                            // Chưa làm khảo sát
                            const payload = {
                                Comment: '',
                                ListRecordID: objValid.ListRecord.RecordID,
                                IsFromSurVey: true,
                                SurveyPortalID: SurveyPortalID
                            };

                            DrawerServices.navigate('HreSurveyEmployeeViewDetail', {
                                dataId: SurveyPortalID,
                                isSurveyTermination: true,
                                ApproveQuitjobData: payload,
                                surveyProfileID: SurveyProfileID
                            });
                        } else if (ActionStatus) {
                            ToasterSevice.showWarning(ActionStatus ? ActionStatus : 'Hrm_Fail', 4000);
                        } else {
                            ToasterSevice.showWarning('Hrm_Fail', 4000);
                        }
                    }
                })
                .catch((error) => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                });
        }
    },

    confirmApprove: (objValid, isShowNote) => {
        let actionCancel = _rowActions.find((item) => item.Type === 'E_APPROVE'),
            isConfirm = actionCancel['Confirm'];

        if (isConfirm && !objValid?.isSkipConfirm) {
            let isInputText = isShowNote,
                isValidInputText = isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
                placeholder = translate('ReasonApprove');

            AlertSevice.alert({
                iconType: EnumIcon.E_APPROVE,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                message: message,
                isInputText: isInputText,
                onCancel: () => {},
                onConfirm: (reason) => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + ' ' + translate('FieldNotAllowNullShort');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        VnrLoadingSevices.show();

                        HttpService.Post('[URI_CENTER]/api/Hre_StopWorking/SetApproveStopWorking', {
                            Host: apiConfig.uriPor,
                            ListRecordID: objValid.ListRecord.RecordID,
                            UserLogin: headers.userlogin,
                            UserProcessID: headers.userid,
                            Comment: reason
                        }).then((res) => {
                            VnrLoadingSevices.hide();
                            try {
                                if (res) {
                                    if (res.Status === 'SUCCESS') {
                                        ToasterSevice.showSuccess(res.Message ? res.Message : 'Hrm_Succeed', 5000);
                                        NotificationsService.getListUserPushNotify();
                                        _this.reload('E_KEEP_FILTER');
                                        // set true để refresh HreApprovedTerminationOfWork
                                        HreApproveTerminationOfWorkBusinessFunction.checkForReLoadScreen[
                                            ScreenName.HreAllTerminationOfWork
                                        ] = true;
                                        HreApproveTerminationOfWorkBusinessFunction.checkForReLoadScreen[
                                            ScreenName.HreApprovedTerminationOfWork
                                        ] = true;

                                        // Đếm lại con số ở Dashboard
                                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                                        // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                                        if (!_isOnScreenNotification)
                                            DrawerServices.navigate('HreApproveTerminationOfWork');
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
            HttpService.Post('[URI_CENTER]/api/Hre_StopWorking/SetApproveStopWorking', {
                Host: apiConfig.uriPor,
                ListRecordID: objValid.ListRecord.RecordID,
                UserLogin: headers.userlogin,
                UserProcessID: headers.userid,
                Comment: ''
            }).then((res) => {
                VnrLoadingSevices.hide();
                try {
                    if (res) {
                        if (res.Status === 'SUCCESS') {
                            ToasterSevice.showSuccess(res.Message ? res.Message : 'Hrm_Succeed', 5000);
                            NotificationsService.getListUserPushNotify();
                            _this.reload('E_KEEP_FILTER');
                            // set true để refresh HreApproveTerminationOfWork
                            HreApproveTerminationOfWorkBusinessFunction.checkForReLoadScreen[
                                ScreenName.HreAllTerminationOfWork
                            ] = true;
                            HreApproveTerminationOfWorkBusinessFunction.checkForReLoadScreen[
                                ScreenName.HreApprovedTerminationOfWork
                            ] = true;

                            // Đếm lại con số ở Dashboard
                            store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                            // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                            if (!_isOnScreenNotification) DrawerServices.navigate('HreApproveTerminationOfWork');
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

            items.map((item) => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_REJECT) > -1) {
                    arrValid.push({
                        RecordID: item.ID,
                        Comment: '',
                        Type: 'E_REJECTED'
                    });
                }
            });

            if (arrValid.length > 0) {
                let message = translate('HRM_PortalApp_Message_RejectConfirm').replace('[E_NUMBER]', arrValid.length);
                HreApproveTerminationOfWorkBusinessFunction.validateRejectTerminationOfWork({
                    ListRecord: arrValid,
                    message,
                    allItems: Array.isArray(items) ? items.length : 0
                });
            } else {
                ToasterSevice.showWarning('HRM_PortalApp_DataCanNotReject');
            }
        }
    },

    validateRejectTerminationOfWork: (objValid) => {
        if (objValid && Array.isArray(objValid?.ListRecord) && objValid?.ListRecord.length > 0) {
            let listID = [];
            objValid?.ListRecord.map((item) => {
                if (item.RecordID) listID.push(item.RecordID);
            });
            VnrLoadingSevices.show();
            HttpService.Post('[URI_CENTER]/api/Hre_StopWorking/ValidateApproveOrRejectStopWorking', {
                Host: apiConfig.uriPor,
                ListRecordID: listID,
                UserLogin: headers.userlogin,
                UserProcessID: headers.userid
            })
                .then((res) => {
                    VnrLoadingSevices.hide();
                    if (res) {
                        if (res.Status === 'SUCCESS' && res.Data && Array.isArray(res.Data) && res.Data.length > 0) {
                            HreApproveTerminationOfWorkBusinessFunction.confirmReject({
                                ListRecord: {
                                    RecordID: res.Data,
                                    Comment: '',
                                    Type: 'E_REJECTED'
                                },
                                message: translate('HRM_PortalApp_Message_RejectConfirm').replace(
                                    '[E_NUMBER]',
                                    `${res.Data.length}/${objValid?.allItems}`
                                )
                            });
                        } else if (res.Status === 'Locked') {
                            ToasterSevice.showWarning('Hrm_Locked', 5000);
                        } else {
                            ToasterSevice.showWarning('HRM_PortalApp_DataCanNotReject');
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

    confirmReject: (objValid) => {
        let actionCancel = _rowActions.find((item) => item.Type === 'E_REJECT'),
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
                onConfirm: (reason) => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + ' ' + translate('FieldNotAllowNullShort');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        VnrLoadingSevices.show();

                        HttpService.Post('[URI_CENTER]/api/Hre_StopWorking/SetRejectStopWorking', {
                            Host: apiConfig.uriPor,
                            ListRecordID: objValid.ListRecord.RecordID,
                            UserLogin: headers.userlogin,
                            UserProcessID: headers.userid,
                            Comment: reason
                        }).then((res) => {
                            VnrLoadingSevices.hide();
                            try {
                                if (res) {
                                    if (res.Status === 'SUCCESS') {
                                        ToasterSevice.showSuccess('Hrm_Succeed', 5000);
                                        NotificationsService.getListUserPushNotify();
                                        _this.reload('E_KEEP_FILTER');
                                        // set true để refresh HreApprovedTerminationOfWork
                                        HreApproveTerminationOfWorkBusinessFunction.checkForReLoadScreen[
                                            ScreenName.HreAllTerminationOfWork
                                        ] = true;
                                        HreApproveTerminationOfWorkBusinessFunction.checkForReLoadScreen[
                                            ScreenName.HreApprovedTerminationOfWork
                                        ] = true;

                                        // Đếm lại con số ở Dashboard
                                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());
                                        // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                                        if (!_isOnScreenNotification)
                                            DrawerServices.navigate('HreApproveTerminationOfWork');
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
            HttpService.Post('[URI_CENTER]/api/Hre_StopWorking/SetRejectStopWorking', {
                Host: apiConfig.uriPor,
                ListRecordID: objValid.ListRecord.RecordID,
                UserLogin: headers.userlogin,
                UserProcessID: headers.userid,
                Comment: ''
            }).then((res) => {
                VnrLoadingSevices.hide();
                try {
                    if (res) {
                        if (res.Status === 'SUCCESS') {
                            ToasterSevice.showSuccess('Hrm_Succeed', 5000);
                            NotificationsService.getListUserPushNotify();
                            _this.reload('E_KEEP_FILTER');
                            // set true để refresh HreApprovedTerminationOfWork
                            HreApproveTerminationOfWorkBusinessFunction.checkForReLoadScreen[
                                ScreenName.HreAllTerminationOfWork
                            ] = true;
                            HreApproveTerminationOfWorkBusinessFunction.checkForReLoadScreen[
                                ScreenName.HreApprovedTerminationOfWork
                            ] = true;

                            // Đếm lại con số ở Dashboard
                            store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());
                            // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                            if (!_isOnScreenNotification) DrawerServices.navigate('HreApprovedTerminationOfWork');
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
            let ListRecordID = [];
            let arrValid = [];

            items.forEach((item) => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_REQUEST_CHANGE) > -1) {
                    ListRecordID.push(item.ID);
                    arrValid.push(item.ID);
                }
            });

            if (arrValid.length > 0 && ListRecordID.length > 0) {
                HreApproveTerminationOfWorkBusinessFunction.validateRequestChangeTerminationOfWork({ ListRecordID });
            } else {
                ToasterSevice.showWarning('HRM_PortalApp_DataCanNotRequestChange');
            }
        }
    },

    validateRequestChangeTerminationOfWork: (objValid) => {
        if (objValid && Array.isArray(objValid?.ListRecordID) && objValid?.ListRecordID.length > 0) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_CENTER]/api/Hre_StopWorking/ValidateApproveOrRejectStopWorking', {
                ListRecordID: objValid?.ListRecordID
            })
                .then((res) => {
                    VnrLoadingSevices.hide();
                    if (res) {
                        if (res.Status === 'SUCCESS' && res.Data && Array.isArray(res.Data) && res.Data.length > 0) {
                            let messsage = translate('HRM_PortalApp_SubmitChangeRequest').replace(
                                '[E_NUMBER]',
                                `${res.Data.length}/${objValid?.ListRecordID.length}`
                            );
                            HreApproveTerminationOfWorkBusinessFunction.confirmRequestChange({
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
                isValidInputText = isConfirm['isValidInputText'],
                placeholder = translate('HRM_PortalApp_Notes');

            AlertSevice.alert({
                iconType: EnumIcon.E_REQUEST_CHANGE,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                message: objValid.message,
                isInputText: isInputText,
                title: 'HRM_PortalApp_ChangRequest',
                textRightButton: 'HRM_PortalApp_ConfirmationofChangeRequest',
                onCancel: () => {},
                onConfirm: (reason) => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + ' ' + translate('FieldNotAllowNullShort');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        VnrLoadingSevices.show();
                        HttpService.Post('[URI_CENTER]/api/Hre_StopWorking/SetRequestChangeStopWorking', {
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
                                        HreApproveTerminationOfWorkBusinessFunction.checkForReLoadScreen[
                                            ScreenName.HreAllTerminationOfWork
                                        ] = true;
                                        HreApproveTerminationOfWorkBusinessFunction.checkForReLoadScreen[
                                            ScreenName.HreCanceledTerminationOfWork
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
                            HreApproveTerminationOfWorkBusinessFunction.checkForReLoadScreen[
                                ScreenName.HreAllTerminationOfWork
                            ] = true;
                            HreApproveTerminationOfWorkBusinessFunction.checkForReLoadScreen[
                                ScreenName.HreCanceledTerminationOfWork
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
