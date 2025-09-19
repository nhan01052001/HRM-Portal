import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../../utils/HttpService';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumIcon } from '../../../../../assets/constant';
import DrawerServices from '../../../../../utils/DrawerServices';

const enumName = EnumName,
    InsSubmitChangeInsInfoRegister = ScreenName.InsSubmitChangeInsInfoRegister,
    InsSubmitChangeInsInfoRegisterAddOrEdit = ScreenName.InsSubmitChangeInsInfoRegisterAddOrEdit;

let _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];

    const permission = PermissionForAppMobile.value;

    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[InsSubmitChangeInsInfoRegister],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_MODIFY, E_ResourceName, E_Name, E_Rule, E_SENDMAIL, E_DELETE, E_CANCEL } = enumName;

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
                        InsSubmitChangeInsInfoRegisterBusinessFunction.businessModifyRecord({ ...item }, dataBody),
                    ...actionEdit
                }
            ];
        }

        //action send mail
        const actionSendMail = businessAction ? businessAction.find((action) => action.Type === E_SENDMAIL) : null,
            actionSendMailResource = actionSendMail ? actionSendMail[E_ResourceName][E_Name] : null,
            actionSendMailRule = actionSendMail ? actionSendMail[E_ResourceName][E_Rule] : null,
            actionSendMailPer =
                actionSendMailResource && actionSendMailRule
                    ? permission[actionSendMailResource][actionSendMailRule]
                    : null;

        if (actionSendMailPer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_Common_SendRequest_Button'),
                    type: E_SENDMAIL,
                    onPress: (item, dataBody) =>
                        InsSubmitChangeInsInfoRegisterBusinessFunction.businessSendMailRecords([{ ...item }], dataBody),
                    ...actionSendMail
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_SendRequest_Button'),
                    type: E_SENDMAIL,
                    onPress: (items, dataBody) =>
                        InsSubmitChangeInsInfoRegisterBusinessFunction.businessSendMailRecords(items, dataBody),
                    ...actionSendMail
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
                    onPress: (item, dataBody, isShowMultiRecord) =>
                        InsSubmitChangeInsInfoRegisterBusinessFunction.businessCancelRecords(
                            [{ ...item }],
                            dataBody,
                            isShowMultiRecord
                        ),
                    ...actionCancel
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Cancel'),
                    type: E_CANCEL,
                    onPress: (item, dataBody, isShowMultiRecord) =>
                        InsSubmitChangeInsInfoRegisterBusinessFunction.businessCancelRecords(
                            item,
                            dataBody,
                            isShowMultiRecord
                        ),
                    ...actionCancel
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
                        InsSubmitChangeInsInfoRegisterBusinessFunction.businessDeleteRecords([{ ...item }], dataBody),
                    ...actionDelete
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Delete'),
                    type: E_DELETE,
                    onPress: (item, dataBody) =>
                        InsSubmitChangeInsInfoRegisterBusinessFunction.businessDeleteRecords(item, dataBody),
                    ...actionDelete
                }
            ];
        }

        return { rowActions: _rowActions, selected: _selected };
    }
};

export const InsSubmitChangeInsInfoRegisterBusinessFunction = {
    setThisForBusiness: (dataThis) => {
        _this = dataThis;
    },

    //#region [action delete]
    businessDeleteRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let valid = items.filter((item) => item.Status == 'E_NOTTRANSFERRED');

            if (valid && valid.length > 0) {
                let selectedID = valid.map((item) => {
                    return item.ID;
                });

                InsSubmitChangeInsInfoRegisterBusinessFunction.confirmDelete({
                    isValid: true,
                    message:
                        translate('AreYouSureYouWantToDelete') +
                        ' ' +
                        selectedID.length +
                        ' ' +
                        translate('HRM_Message_RecordSelected'),
                    strResultID: selectedID.join()
                });
            } else {
                ToasterSevice.showWarning('ChangeInsInfoRegister_StatusCantDeleteOrModify');
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
                        InsSubmitChangeInsInfoRegisterBusinessFunction.setIsDelete({ Ids: strId, reason });
                    }
                }
            });
        } else {
            let strId = objValid.strResultID;
            InsSubmitChangeInsInfoRegisterBusinessFunction.setIsDelete({ Ids: strId });
        }
    },

    setIsDelete: (objValid) => {
        VnrLoadingSevices.show();
        let selectedIds = objValid.Ids,
            reason = objValid.reason;

        HttpService.Post('[URI_HR]/Ins_GetData/DeleteOrRemove_ChangeInsInfoRegister_Portal', {
            id: selectedIds,
            reason
        }).then((res) => {
            VnrLoadingSevices.hide();
            try {
                if (res && res !== '') {
                    if (res.ActionStatus == enumName.E_Success) {
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
                HttpService.Post('[URI_HR]/Ins_GetData/BusinessAllowActionCancel', {
                    selectedID,
                    screenName: InsSubmitChangeInsInfoRegister,
                    dataBody: dataBody ? JSON.stringify(dataBody) : ''
                }).then((res) => {
                    VnrLoadingSevices.hide();

                    try {
                        if (res && typeof res === enumName.E_object) {
                            let isValid = res.isValid;

                            //dữ liệu hợp lệ => gọi hàm confirm Hủy
                            if (isValid) {
                                InsSubmitChangeInsInfoRegisterBusinessFunction.confirmCancel(res);
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
            } else {
                VnrLoadingSevices.show();
                HttpService.Get('[URI_HR]/Ins_GetData/GetConfigChangeInsInfoRegisStatusAllowDel').then((res) => {
                    VnrLoadingSevices.hide();
                    if (res) {
                        let checkValid = items.filter((item) => res.includes(item.Status) && item.Status != 'E_CANCEL');

                        if (checkValid && checkValid.length > 0) {
                            selectedID = checkValid.map((item) => item.ID);

                            InsSubmitChangeInsInfoRegisterBusinessFunction.confirmCancel({
                                isValid: true,
                                message:
                                    translate('HRM_Common_AreYouSure_Cancel') +
                                    ' ' +
                                    selectedID.length +
                                    '/' +
                                    items.length +
                                    ' ' +
                                    translate('HRM_SAL_UnusualEDChild_RecordSelected'),
                                strResultID: selectedID.join()
                            });
                        } else {
                            ToasterSevice.showWarning('DataCancelCanNotCancel');
                        }
                    } else {
                        ToasterSevice.showWarning('DataCancelCanNotCancel');
                    }
                });
            }
        }
    },

    confirmCancel: (objValid) => {
        const { E_CANCEL, E_isInputText, E_isValidInputText, E_string, E_Confirm } = enumName;

        let actionCancel = _rowActions.find((item) => item.Type === E_CANCEL),
            isConfirm = actionCancel[E_Confirm];

        if (isConfirm) {
            HttpService.Get('[URI_POR]/New_Home/GetFormConfig_Angular?formName=ngFormCancelReason').then((res) => {
                if (res && res[0]) {
                    const validators = res[0].Validators;

                    if (validators) {
                        let maxLength = validators.MaxLength;

                        let isInputText = isConfirm[E_isInputText],
                            isValidInputText = isConfirm[E_isValidInputText],
                            message =
                                objValid.message && typeof objValid.message === E_string ? objValid.message : null,
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
                                } else if (reason && reason.length > maxLength) {
                                    ToasterSevice.showWarning('HRM_Sytem_Reason_MaxLength500');
                                } else {
                                    let strId = objValid.strResultID;
                                    InsSubmitChangeInsInfoRegisterBusinessFunction.setStatusCancel({
                                        Ids: strId,
                                        reason
                                    });
                                }
                            }
                        });
                    } else {
                        let isInputText = isConfirm[E_isInputText],
                            isValidInputText = isConfirm[E_isValidInputText],
                            message =
                                objValid.message && typeof objValid.message === E_string ? objValid.message : null,
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
                                    let strId = objValid.strResultID;
                                    InsSubmitChangeInsInfoRegisterBusinessFunction.setStatusCancel({
                                        Ids: strId,
                                        reason
                                    });
                                }
                            }
                        });
                    }
                } else {
                    let isInputText = isConfirm[E_isInputText],
                        isValidInputText = isConfirm[E_isValidInputText],
                        message = objValid.message && typeof objValid.message === E_string ? objValid.message : null,
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
                                let strId = objValid.strResultID;
                                InsSubmitChangeInsInfoRegisterBusinessFunction.setStatusCancel({ Ids: strId, reason });
                            }
                        }
                    });
                }
            });
        } else {
            let strId = objValid.strResultID;
            InsSubmitChangeInsInfoRegisterBusinessFunction.setStatusCancel({ Ids: strId });
        }
    },

    setStatusCancel: (objValid) => {
        let selectedIds = objValid.Ids,
            commentCancel = objValid.reason;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Ins_GetData/ChangeInsInfoRegisterCancelInfo', {
            ids: selectedIds,
            cancelReason: commentCancel,
            isPortal: true,
            status: 'E_CANCEL'
        }).then((res) => {
            VnrLoadingSevices.hide();
            try {
                if (res && res !== '') {
                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                    _this.reload('E_KEEP_FILTER');
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    },
    //#endregion

    //#region [action send mail]
    businessSendMailRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let checkValid = items.filter(
                (item) => item.Status.includes('E_NOTTRANSFERRED') || item.Status.includes('E_INVALID')
            );

            if (checkValid.length == 0) {
                ToasterSevice.showWarning('HRM_Insurance_InsuranceRecord_SendRequestMess1');
            } else {
                let checkAttachFile = checkValid.filter(
                    (item) => item.lstFileAttach != null && item.lstFileAttach.length > 0
                );

                if (checkAttachFile.length == 0) {
                    ToasterSevice.showWarning('Hrm_Message_Please_Attachment1');
                } else {
                    let selectedID = checkAttachFile.map((item) => {
                        return item.ID;
                    });

                    VnrLoadingSevices.show();
                    HttpService.Post('[URI_HR]/Ins_GetData/UpdateStatusForSendRequestChangeInsInfoRegis', {
                        selectedIds: selectedID,
                        sstatus: 'E_TRANSFERRED'
                    }).then((res) => {
                        VnrLoadingSevices.hide();
                        try {
                            if (res) {
                                ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                                _this.reload('E_KEEP_FILTER');
                            } else {
                                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                            }
                        } catch (error) {
                            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                        }
                    });
                }
            }
        }
    },
    //#endregion

    //#region [modify]
    businessModifyRecord: (item) => {
        //check status được sửa
        VnrLoadingSevices.show();
        HttpService.Get('[URI_HR]/Ins_GetData/GetConfigChangeInsInfoRegisStatusNotAllowEdit').then((res) => {
            VnrLoadingSevices.hide();
            if (res) {
                if (res.indexOf(item.Status) >= 0) {
                    ToasterSevice.showWarning('HRM_Ins_InsuranceRecord_StatusNotAllowEdit');
                } else {
                    InsSubmitChangeInsInfoRegisterBusinessFunction.getItemByID(item.ID);
                }
            } else if (item.Status == 'E_CONFIRMED') {
                ToasterSevice.showWarning('HRM_Ins_InsuranceRecord_StatusNotAllowEdit');
            } else {
                InsSubmitChangeInsInfoRegisterBusinessFunction.getItemByID(item.ID);
            }
        });
    },

    getItemByID(ID) {
        HttpService.Post('[URI_HR]/Ins_GetData/GetInsuranceChangeInsInfoRegisterById', {
            id: ID,
            screenName: 'InsSubmitChangeInsInfoRegister'
        }).then((res) => {
            VnrLoadingSevices.hide();
            try {
                if (res) {
                    const { reload } = _this;
                    _this.props.navigation.navigate(InsSubmitChangeInsInfoRegisterAddOrEdit, { record: res, reload });
                } else {
                    ToasterSevice.showWarning('StatusNotAction');
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    }
    //#endregion
};
