import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../../utils/HttpService';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumIcon, EnumStatus } from '../../../../../assets/constant';

let enumName = EnumName;

let _this = null,
    _rowActions = [],
    _selected = [];

const { apiConfig } = dataVnrStorage,
    _uriPor = apiConfig ? apiConfig.uriPor : null;

export const generateRowActionAndSelected = (screenName) => {
    _rowActions = [];
    _selected = [];

    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[screenName],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_MODIFY, E_ResourceName, E_Name, E_Rule, E_REQUEST_CANCEL } = enumName;

        // action edit
        const actionEdit = businessAction ? businessAction.find((action) => action.Type === E_MODIFY) : null,
            actionEditResource = actionEdit ? actionEdit[E_ResourceName][E_Name] : null,
            actionEditRule = actionEdit ? actionEdit[E_ResourceName][E_Rule] : null,
            actionEditPer =
                actionEditResource && actionEditRule ? permission[actionEditResource][actionEditRule] : null;

        if (actionEditPer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_System_Resource_Sys_Edit'),
                    type: E_MODIFY,
                    onPress: (item, dataBody) =>
                        HreSubmitTerminationOfWorkBusinessFunction.businessModifyRecord({ ...item }, dataBody, item),
                    ...actionEdit
                }
            ];
        }

        //action send mail
        // const actionSendMail = businessAction ? businessAction.find(action => action.Type === E_SENDMAIL) : null,
        //     actionSendMailResource = actionSendMail ? actionSendMail[E_ResourceName][E_Name] : null,
        //     actionSendMailRule = actionSendMail ? actionSendMail[E_ResourceName][E_Rule] : null,
        //     actionSendMailPer = (actionSendMailResource && actionSendMailRule)
        //         ? permission[actionSendMailResource][actionSendMailRule] : null;

        // if (actionSendMailPer) {
        //     _rowActions = [
        //         ..._rowActions,
        //         {
        //             title: translate('HRM_CommonSendEmail'),
        //             type: E_SENDMAIL,
        //             onPress: (item, dataBody) => HreSubmitTerminationOfWorkBusinessFunction.businessSendMailRecords(Array.isArray(item) ? item : [{ ...item }], dataBody),
        //             ...actionSendMail
        //         }
        //     ];

        //     _selected = [
        //         ..._selected,
        //         {
        //             title: translate('HRM_CommonSendEmail'),
        //             type: E_SENDMAIL,
        //             onPress: (items, dataBody) => HreSubmitTerminationOfWorkBusinessFunction.businessSendMailRecords(items, dataBody),
        //             ...actionSendMail
        //         }
        //     ]
        // }

        //action delete
        // const actionDelete = businessAction ? businessAction.find(action => action.Type === E_DELETE) : null,
        //     actionDeleteResource = actionDelete ? actionDelete[E_ResourceName][E_Name] : null,
        //     actionDeleteRule = actionDelete ? actionDelete[E_ResourceName][E_Rule] : null,
        //     actionDeletePer = (actionDeleteResource && actionDeleteRule)
        //         ? permission[actionDeleteResource][actionDeleteRule] : null;

        // if (actionDeletePer) {
        //     _rowActions = [
        //         ..._rowActions,
        //         {
        //             title: translate('HRM_Common_Delete'),
        //             type: E_DELETE,
        //             onPress: (item, dataBody) => HreSubmitTerminationOfWorkBusinessFunction.businessDeleteRecords(Array.isArray(item) ? item : [{ ...item }], dataBody),
        //             ...actionDelete
        //         }
        //     ];

        //     _selected = [
        //         ..._selected,
        //         {
        //             title: translate('HRM_Common_Delete'),
        //             type: E_DELETE,
        //             onPress: (item, dataBody) => HreSubmitTerminationOfWorkBusinessFunction.businessDeleteRecords(item, dataBody),
        //             ...actionDelete
        //         }
        //     ]
        // }

        //action cancel
        const actionCancel = businessAction ? businessAction.find((action) => action.Type === E_REQUEST_CANCEL) : null,
            actionCancelResource = actionCancel ? actionCancel[E_ResourceName][E_Name] : null,
            actionCancelRule = actionCancel ? actionCancel[E_ResourceName][E_Rule] : null,
            actionCancelPer =
                actionCancelResource && actionCancelRule ? permission[actionCancelResource][actionCancelRule] : null;

        if (actionCancelPer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_PortalApp_TerminationOfWork_DrawCancel'),
                    type: E_REQUEST_CANCEL,
                    onPress: (item, dataBody) =>
                        HreSubmitTerminationOfWorkBusinessFunction.businessCancelRecords(
                            Array.isArray(item) ? item : [{ ...item }],
                            dataBody
                        ),
                    ...actionCancel
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_PortalApp_TerminationOfWork_DrawCancel'),
                    type: E_REQUEST_CANCEL,
                    onPress: (item, dataBody) =>
                        HreSubmitTerminationOfWorkBusinessFunction.businessCancelRecords(item, dataBody),
                    ...actionCancel
                }
            ];
        }

        return { rowActions: _rowActions, selected: _selected };
    }
};

export const HreSubmitTerminationOfWorkBusinessFunction = {
    checkForReLoadScreen: {
        AttSubmitWorkingOvertime: false
    },
    setThisForBusiness: (dataThis) => {
        _this = dataThis;
    },
    //#region [action delete]
    // businessDeleteRecords: (items, dataBody) => {

    //     if (items.length === 0 && !dataBody) {
    //         ToasterSevice.showWarning('HRM_Common_Select', 4000);
    //     }
    //     else {
    //         let selectedID = [];

    //         items.forEach(item => {
    //             if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_DELETE) > -1) {
    //                 selectedID.push(item.ID);
    //             }
    //         });

    //         if (selectedID.length == 0) {
    //             ToasterSevice.showWarning('HRM_PortalApp_Status_AllowDelete', 4000);
    //             return;
    //         }

    //         VnrLoadingSevices.show();
    //         HttpService.Post('[URI_CENTER]/api/Att_OvertimePlan/CheckStatusOverTimePlanForDelete', {
    //             ListRecordID: selectedID,
    //             UserLogin: dataVnrStorage.currentUser.headers.userlogin,
    //             UserProcessID: dataVnrStorage.currentUser.headers.userid,
    //             Host: _uriPor
    //         })
    //             .then(res => {
    //                 VnrLoadingSevices.hide();
    //                 if (res && res.Status == EnumName.E_SUCCESS) {
    //                     if (res.Data && res.Data.length > 0) {
    //                         let numberRow = res.Data.length == 1 ? '1' : `${res.Data.length}/${items.length}`,
    //                             keyTrans = translate('HRM_PortalApp_Message_DeleteConfirm');
    //                         HreSubmitTerminationOfWorkBusinessFunction.confirmDelete({
    //                             strResultID: res.Data,
    //                             message: keyTrans.replace('[E_NUMBER]', numberRow)
    //                         });
    //                     }
    //                     else {
    //                         ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
    //                     }
    //                 }
    //                 else {
    //                     ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
    //                 }
    //             })
    //     }
    // },

    // confirmDelete: (objValid) => {
    //     let actionCancel = _rowActions.find(item => item.Type === 'E_DELETE'),
    //         isConfirm = actionCancel['Confirm'];

    //     if (isConfirm) {

    //         let isInputText = isConfirm['isInputText'],
    //             isValidInputText = isConfirm['isValidInputText'],
    //             message = (objValid.message && typeof objValid.message === 'string') ? objValid.message : null,
    //             placeholder = translate('Reason');

    //         AlertSevice.alert({
    //             iconType: EnumIcon.E_DELETE,
    //             placeholder: placeholder,
    //             isValidInputText: isValidInputText,
    //             message: message,
    //             isInputText: isInputText,
    //             onCancel: () => { },
    //             onConfirm: (reason) => {
    //                 if (isValidInputText && (!reason || reason === '')) {
    //                     let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
    //                     ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
    //                 }
    //                 else {
    //                     HreSubmitTerminationOfWorkBusinessFunction.setDelete(objValid)
    //                 }
    //             }
    //         })
    //     }
    //     else {
    //         HreSubmitTerminationOfWorkBusinessFunction.setDelete(objValid)
    //     }
    // },

    // setDelete: (objValid) => {
    //     VnrLoadingSevices.show();
    //     HttpService.Post('[URI_CENTER]/api/Att_OvertimePlan/DeleteOvertimePlan', {
    //         ListRecordID: objValid.strResultID,
    //         UserLogin: dataVnrStorage.currentUser.headers.userlogin,
    //         UserProcessID: dataVnrStorage.currentUser.headers.userid,
    //         Host: _uriPor
    //     })
    //         .then(res => {
    //             VnrLoadingSevices.hide();
    //             try {
    //                 if (res && res.Status == EnumName.E_SUCCESS) {
    //                     ToasterSevice.showSuccess(res.Message, 4000);
    //                     _this.reload('E_KEEP_FILTER', true);
    //                 }
    //                 else if (res && res.Message && typeof res.Message == 'string') {
    //                     ToasterSevice.showError(res.Message, 4000);
    //                 }
    //                 else {
    //                     ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
    //                 }
    //             }
    //             catch (error) {
    //                 DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
    //             }
    //         })
    // },
    //#endregion

    //#region [action send mail]
    // businessSendMailRecords: (items, dataBody) => {
    //     debugger
    //     if (items.length === 0 && !dataBody) {
    //         ToasterSevice.showWarning('HRM_Common_Select', 4000);
    //     }
    //     else {
    //         let selectedID = [];
    //         items.forEach(item => {
    //             if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_SENDMAIL) > -1) {
    //                 selectedID.push(item.ID);
    //             }
    //         });

    //         if (selectedID.length == 0) {
    //             ToasterSevice.showWarning('HRM_PortalApp_Status_IsSended', 4000);
    //             return;
    //         }
    //         else {
    //             HreSubmitTerminationOfWorkBusinessFunction.setSendMail({
    //                 strResultID: selectedID,
    //                 message: ''
    //             });
    //         }
    //     }
    // },

    // setSendMail: (objValid) => {
    //     const { apiConfig } = dataVnrStorage,
    //         _uriPor = apiConfig ? apiConfig.uriPor : null;

    //     VnrLoadingSevices.show();
    //     HttpService.Post('[URI_CENTER]/api/Att_OvertimePlan/ProcessingSendMailOvertimePlan', {
    //         ListRecordID: objValid.strResultID,
    //         UserLogin: dataVnrStorage.currentUser.headers.userlogin,
    //         UserProcessID: dataVnrStorage.currentUser.headers.userid,
    //         Host: _uriPor
    //     })
    //         .then(res => {
    //             VnrLoadingSevices.hide();
    //             if (res && res.Status == EnumName.E_SUCCESS) {
    //                 ToasterSevice.showSuccess(res.Message, 4000);
    //                 _this.reload('E_KEEP_FILTER', true);
    //             }
    //             else if (res && res.Message && typeof res.Message == 'string') {
    //                 ToasterSevice.showError(res.Message, 4000);
    //             }
    //             else {
    //                 ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
    //             }
    //         })
    // },
    //#endregion

    //#region [action cancel]
    businessCancelRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = [];
            items.forEach((item) => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_REQUEST_CANCEL) > -1) {
                    selectedID.push(item.ID);
                }
            });

            if (selectedID.length == 0) {
                ToasterSevice.showWarning('HRM_PortalApp_Status_AllowCancel', 4000);
                return;
            }

            HreSubmitTerminationOfWorkBusinessFunction.confirmCancel({
                strResultID: selectedID,
                message: translate('HRM_PortalApp_TerminationOfWork_DrawCancel')
            });
        }
    },

    confirmCancel: (objValid) => {
        let actionCancel = _rowActions.find((item) => item.Type === 'E_REQUEST_CANCEL'),
            isConfirm = actionCancel['Confirm'];

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isConfirm['isValidInputText'],
                placeholder = translate('HRM_PortalApp_TerminationOfWork_InputOfWithdrawal'),
                limit = 500,
                textLimit = translate('HRM_Sytem_Reason_DynamicMaxLength').replace('[E_DYNAMIC1]', `[${placeholder}]`);

            textLimit = textLimit.replace('[E_DYNAMIC2]', 500);
            AlertSevice.alert({
                iconType: EnumIcon.E_REQUEST_CANCEL,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                isInputText: isInputText,
                message: '',
                textRightButton: 'HRM_PortalApp_ConfirmationOfWithdrawal',
                limit: limit,
                textLimit: textLimit,
                title: 'HRM_PortalApp_TerminationOfWork_DrawCancel',
                autoFocus : true,
                onCancel: () => {},
                onConfirm: (reason) => {
                    if (reason && reason.length > 500) {
                        ToasterSevice.showWarning(textLimit, 4000, null, false);
                    } else if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty =
                            translate('HRM_PortalApp_TerminationOfWork_ReasonOfWithdrawal') +
                            translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        HreSubmitTerminationOfWorkBusinessFunction.setCancel({ ...objValid, Comment: reason });
                    }
                }
            });
        } else {
            HreSubmitTerminationOfWorkBusinessFunction.setCancel(objValid);
        }
    },

    setCancel: (objValid) => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_CENTER]/api/Hre_StopWorking/SetDrawQuitJobStopWorking', {
            Comment: objValid.Comment,
            ListRecordID: objValid.strResultID,
            UserLogin: dataVnrStorage.currentUser.headers.userlogin,
            UserProcessID: dataVnrStorage.currentUser.headers.userid,
            IsPortal: true,
            Host: _uriPor
        }).then((res) => {
            VnrLoadingSevices.hide();
            if (res && res.Status == EnumName.E_SUCCESS) {
                ToasterSevice.showSuccess(res.Message, 4000);
                _this.reload('E_KEEP_FILTER', true);
                HreSubmitTerminationOfWorkBusinessFunction.checkForReLoadScreen[ScreenName.AttSubmitTakeLeaveDay] =
                    true;
                HreSubmitTerminationOfWorkBusinessFunction.checkForReLoadScreen[
                    ScreenName.AttCanceledSubmitTakeLeaveDay
                ] = true;
            } else if (res && res.Message && typeof res.Message == 'string') {
                ToasterSevice.showError(res.Message, 4000);
            } else {
                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
            }
        });
    },
    //#endregion

    //#region [modify]
    businessModifyRecord: (item, dataBody, itemRoot) => {
        if (Array.isArray(itemRoot) && itemRoot.length > 1) {
            ToasterSevice.showWarning('Sys_LockObjectWaiting_JustCheckOneItem');
            return;
        }

        if (Object.keys(item).length === 0) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
            return;
        }

        if (itemRoot) {
            if (
                Array.isArray(itemRoot) &&
                itemRoot[0]?.BusinessAllowAction !== null &&
                itemRoot[0]?.BusinessAllowAction !== undefined &&
                itemRoot[0]?.BusinessAllowAction.indexOf('E_MODIFY') < 0
            ) {
                ToasterSevice.showWarning('HRM_Common_DataInStatus_CannotEdit', 4000);
                return;
            } else if (
                !Array.isArray(itemRoot) &&
                itemRoot?.BusinessAllowAction !== null &&
                itemRoot?.BusinessAllowAction !== undefined &&
                itemRoot?.BusinessAllowAction.indexOf('E_MODIFY') < 0
            ) {
                ToasterSevice.showWarning('HRM_Common_DataInStatus_CannotEdit', 4000);
                return;
            } else {
                const ID = Array.isArray(itemRoot) ? itemRoot[0]?.ID : itemRoot?.ID;
                if (ID) {
                    VnrLoadingSevices.show();
                    HttpService.Post('[URI_CENTER]/api/Hre_StopWorking/GetByIDStopWoking', { ID: ID })
                        .then((res) => {
                            VnrLoadingSevices.hide();
                            if (res && res.Status === 'SUCCESS' && res.Data) {
                                _this.onEdit({ ...res.Data, ID: ID });
                            }
                        })
                        .catch(() => {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                        });
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                }
            }
        }
    }
    //#endregion
};
