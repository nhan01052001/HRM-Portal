import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../../utils/HttpService';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumIcon, EnumStatus } from '../../../../../assets/constant';
import DrawerServices from '../../../../../utils/DrawerServices';

const enumName = EnumName,
    salSubmitUnusualAllowance = ScreenName.SalSubmitUnusualAllowance,
    salSubmitUnusualAllowanceAddOrEdit = ScreenName.SalSubmitUnusualAllowanceAddOrEdit;

let _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];

    const permission = PermissionForAppMobile.value;

    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[salSubmitUnusualAllowance],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_MODIFY, E_ResourceName, E_Name, E_Rule, E_DELETE, E_CANCEL, E_SENDMAIL } = enumName;

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
                        SalSubmitUnusualAllowanceBusinessFunction.businessModifyRecord({ ...item }, dataBody),
                    ...actionEdit
                }
            ];
        }

        //action delete
        const actionDelete = businessAction ? businessAction.find((action) => action.Type === E_DELETE) : null,
            actionDeleteResource = actionDelete ? actionDelete[E_ResourceName][E_Name] : null,
            actionDeleteRule = actionDelete ? actionDelete[E_ResourceName][E_Rule] : null,
            actionDeletePer =
                actionDeleteResource && actionDeleteRule ? permission[actionDeleteResource][actionDeleteRule] : null;

        if (actionDeletePer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_Common_Delete'),
                    type: E_DELETE,
                    onPress: (item, dataBody) =>
                        SalSubmitUnusualAllowanceBusinessFunction.businessDeleteRecords([{ ...item }], dataBody),
                    ...actionDelete
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Delete'),
                    type: E_DELETE,
                    onPress: (item, dataBody) =>
                        SalSubmitUnusualAllowanceBusinessFunction.businessDeleteRecords(item, dataBody),
                    ...actionDelete
                }
            ];
        }

        //action cancel
        const actionCancel = businessAction ? businessAction.find((action) => action.Type === E_CANCEL) : null,
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
                    onPress: (item, dataBody) => {
                        if (Array.isArray(item) && item.length > 0) {
                            SalSubmitUnusualAllowanceBusinessFunction.businessCancelRecords(item, dataBody);
                        } else {
                            SalSubmitUnusualAllowanceBusinessFunction.businessCancelRecords([{ ...item }], dataBody);
                        }
                    },
                    ...actionCancel
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Cancel'),
                    type: E_CANCEL,
                    onPress: (item, dataBody) =>
                        SalSubmitUnusualAllowanceBusinessFunction.businessCancelRecords(item, dataBody),
                    ...actionCancel
                }
            ];
        }

        //action send mail
        const actionSendMail = businessAction ? businessAction.find((action) => action.Type === E_SENDMAIL) : null,
            actionSendMailResource = actionSendMail ? actionSendMail[E_ResourceName][E_Name] : null,
            actionSendMailRule = actionSendMail ? actionSendMail[E_ResourceName][E_Rule] : null,
            actionSendMailPer =
                actionSendMailResource && actionSendMailRule && permission[actionSendMailResource]
                    ? permission[actionSendMailResource][actionSendMailRule]
                    : null;

        if (actionSendMailPer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_Common_SendRequest_Button'),
                    type: E_SENDMAIL,
                    onPress: (item, dataBody) => {
                        if (Array.isArray(item) && item.length > 0) {
                            SalSubmitUnusualAllowanceBusinessFunction.businessSendMailRecords(item, dataBody);
                        } else {
                            SalSubmitUnusualAllowanceBusinessFunction.businessSendMailRecords([{ ...item }], dataBody);
                        }
                    },
                    ...actionSendMail
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_SendRequest_Button'),
                    type: E_SENDMAIL,
                    onPress: (items, dataBody) =>
                        SalSubmitUnusualAllowanceBusinessFunction.businessSendMailRecords(items, dataBody),
                    ...actionSendMail
                }
            ];
        }

        return { rowActions: _rowActions, selected: _selected };
    }
};

export const SalSubmitUnusualAllowanceBusinessFunction = {
    setThisForBusiness: (dataThis) => {
        _this = dataThis;
    },
    //#region [action delete]
    businessDeleteRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let checkAllowAction = items.find((item) => item.Status != 'E_SUBMIT_TEMP');

            if (checkAllowAction) {
                ToasterSevice.showWarning('HRM_Message_OnlyDeleteDataTemp');
            } else {
                let selectedID = items.map((item) => {
                        return item.ID;
                    }),
                    res = {
                        isValid: true,
                        message:
                            translate('AreYouSureYouWantToDelete') +
                            ' ' +
                            selectedID.length +
                            ' ' +
                            translate('HRM_Message_RecordSelected'),
                        strResultID: selectedID
                    };

                SalSubmitUnusualAllowanceBusinessFunction.confirmDelete(res);
            }
        }
    },

    confirmDelete: (objValid) => {
        const { E_DELETE, E_isInputText, E_isValidInputText, E_string, E_Confirm } = enumName;

        let actionCancel = _rowActions.find((item) => item.Type === E_DELETE),
            isConfirm = actionCancel[E_Confirm];

        if (isConfirm) {
            let isInputText = isConfirm[E_isInputText],
                isValidInputText = isConfirm[E_isValidInputText],
                message = objValid.message && typeof objValid.message === E_string ? objValid.message : null,
                placeholder = translate('Reason');

            AlertSevice.alert({
                iconType: EnumIcon.E_DELETE,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                message: message,
                isInputText: isInputText,
                onCancel: () => {},
                onConfirm: (reason) => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        //check khung giờ cho Phổ Đình
                        let strId = objValid.strResultID;
                        SalSubmitUnusualAllowanceBusinessFunction.setIsDelete({ Ids: strId, reason });
                    }
                }
            });
        } else {
            //check khung giờ cho Phổ Đình
            let strId = objValid.strResultID;
            SalSubmitUnusualAllowanceBusinessFunction.setIsDelete({ Ids: strId });
        }
    },

    setIsDelete: (objValid) => {
        VnrLoadingSevices.show();
        let selectedIds = objValid.Ids,
            reason = objValid.reason;

        HttpService.Post('[URI_HR]/Sal_GetData/DeleteOrRemoveSal_UnusualAllowanceEvent', {
            selectedIds,
            reason
        }).then((res) => {
            VnrLoadingSevices.hide();
            try {
                if (res && res !== '') {
                    if (res == enumName.E_Success) {
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        _this.reload('E_KEEP_FILTER', true);
                    } else if (res == enumName.E_Locked) {
                        ToasterSevice.showWarning('Hrm_Locked', 4000);
                    } else {
                        ToasterSevice.showWarning(res, 4000);
                    }
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    },
    //#endregion

    //#region [action cancel]
    businessCancelRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map((item) => {
                return item.ID;
            });

            if (dataBody) {
                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Sal_GetData/BusinessAllowActionCancel', {
                    selectedID,
                    screenName: salSubmitUnusualAllowance,
                    dataBody: dataBody ? JSON.stringify(dataBody) : ''
                })
                    .then((res) => {
                        SalSubmitUnusualAllowanceBusinessFunction.confirmCancel(res);
                        VnrLoadingSevices.hide();
                        try {
                            if (res && typeof res === 'object') {
                                let isValid = res.isValid;
                                if (isValid) {
                                    SalSubmitUnusualAllowanceBusinessFunction.confirmCancel(res);
                                    VnrLoadingSevices.hide();
                                } else if (isValid == false && res.message && typeof res.message === 'string') {
                                    ToasterSevice.showWarning(res.message, 4000);
                                    VnrLoadingSevices.hide();
                                } else {
                                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                    VnrLoadingSevices.hide();
                                }
                            } else {
                                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                VnrLoadingSevices.hide();
                            }
                        } catch (error) {
                            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                            VnrLoadingSevices.hide();
                        }
                    })
                    .catch((error) => {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });

                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                        VnrLoadingSevices.hide();
                    });
            } else {
                let checkValid = items.filter((item) => item.Status == 'E_SUBMIT' || item.Status == 'E_APPROVED');

                if (checkValid && checkValid.length == 0) {
                    ToasterSevice.showWarning('HRM_Notify_OnlyCancelStatusSubmitAndApprove');
                } else {
                    SalSubmitUnusualAllowanceBusinessFunction.confirmCancel({
                        isValid: true,
                        strResultID: checkValid.map((item) => item.ID).join(),
                        message:
                            translate('HRM_Common_AreYouSure_Cancel') +
                            ' ' +
                            checkValid.length +
                            '/' +
                            items.length +
                            ' ' +
                            translate('HRM_Message_RecordSelected')
                    });
                }
            }
        }
    },

    confirmCancel: (objValid) => {
        let actionCancel = _rowActions.find((item) => item.Type === 'E_CANCEL'),
            isConfirm = actionCancel['Confirm'];

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
                placeholder = translate('HRM_Common_CommentCancel');

            AlertSevice.alert({
                iconType: EnumIcon.E_CANCEL,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                isInputText: isInputText,
                message: message,
                onCancel: () => {},
                onConfirm: (reason) => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        VnrLoadingSevices.show();

                        let strId =
                            objValid.strResultID && typeof objValid.strResultID === 'string'
                                ? objValid.strResultID
                                : '';

                        HttpService.Post('[URI_HR]/Sal_Getdata/UpdateCancelUnusualAllowance', {
                            listId: strId,
                            ReasonCancel: reason
                        })
                            .then((res) => {
                                try {
                                    if (res && res !== '') {
                                        if (res.Success) {
                                            ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                                            _this.reload('E_KEEP_FILTER');
                                        } else if (res.Messenger) {
                                            ToasterSevice.showWarning(res.Messenger, 4000);
                                        }
                                        // else {
                                        //     ToasterSevice.showWarning(res, 4000);
                                        // }
                                    } else {
                                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                    }
                                    VnrLoadingSevices.hide();
                                } catch (error) {
                                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                                    VnrLoadingSevices.hide();
                                }
                            })
                            .catch((error) => {
                                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                                VnrLoadingSevices.hide();
                            });
                    }
                }
            });
        } else {
            VnrLoadingSevices.show();
            let strId = objValid.strResultID && typeof objValid.strResultID === 'string' ? objValid.strResultID : '';
            HttpService.Post('[URI_HR]/Sal_Getdata/UpdateCancelUnusualAllowance', {
                listId: strId,
                ReasonCancel: null
            })
                .then((res) => {
                    try {
                        if (res && res !== '') {
                            if (res.Success) {
                                ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                                _this.reload('E_KEEP_FILTER');
                            } else if (res.Messenger) {
                                ToasterSevice.showWarning(res.Messenger, 4000);
                            }
                            // else {
                            //     ToasterSevice.showWarning(res, 4000);
                            // }
                        } else {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                        }
                        VnrLoadingSevices.hide();
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                        VnrLoadingSevices.hide();
                    }
                })
                .catch((error) => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    VnrLoadingSevices.hide();
                });
        }
    },
    //#endregion

    //#region [modify]
    businessModifyRecord: (item) => {
        if (item && item.Status != 'E_SUBMIT_TEMP') {
            ToasterSevice.showWarning('HRM_Message_OnlyUpdateDataTemp');
        } else {
            //view detail hoặc chọn 1 dòng từ lưới
            const { reload } = _this;
            _this.props.navigation.navigate(salSubmitUnusualAllowanceAddOrEdit, { record: item, reload });
        }
    },
    //#endregion

    //#region [action send mail]
    businessSendMailRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let isCheckStatusTemp = true;
            let selectedID = items.map((item) => {
                if (item.Status !== EnumStatus.E_SUBMIT_TEMP) isCheckStatusTemp = false;
                return item.ID;
            });

            if (!isCheckStatusTemp) {
                ToasterSevice.showWarning('HRM_Common_Send_Request_Status_Temp', 4000);
                return;
            }

            SalSubmitUnusualAllowanceBusinessFunction.confirmSendMail(selectedID);
        }
    },

    confirmSendMail: (selectedIDs) => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Sal_GetData/SendRequestUnusualAllowancePortal', {
            listIDs: selectedIDs
        })
            .then((res) => {
                if (res.Success) {
                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                }
                VnrLoadingSevices.hide();
                _this.reload('E_KEEP_FILTER');
            })
            .catch((error) => {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });

                VnrLoadingSevices.hide();
                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                _this.reload('E_KEEP_FILTER');
            });
    }
    //#endregion
};
