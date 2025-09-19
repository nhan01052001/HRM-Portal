import { Colors } from '../../../../../constants/styleConfig';
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
import { Platform } from 'react-native';

const enumName = EnumName,
    attSubmitPlanOvertimeCancel = ScreenName.AttSubmitPlanOvertimeCancel,
    attSubmitPlanOvertimeCancelAddOrEdit = ScreenName.AttSubmitPlanOvertimeCancelAddOrEdit;

let _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];

    const permission = PermissionForAppMobile.value;

    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[attSubmitPlanOvertimeCancel],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_MODIFY, E_ResourceName, E_Name, E_Rule, E_SENDMAIL, E_DELETE } = enumName;

        //action edit
        const actionEdit = businessAction ? businessAction.find(action => action.Type === E_MODIFY) : null,
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
                    onPress: item => AttSubmitPlanOvertimeCancelBusinessFunction.businessModifyRecord({ ...item }),
                    ...actionEdit
                }
            ];
        }

        //action send mail
        const actionSendMail = businessAction ? businessAction.find(action => action.Type === E_SENDMAIL) : null,
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
                    title: translate('HRM_Common_SendMail'),
                    type: E_SENDMAIL,
                    onPress: (item, dataBody) =>
                        AttSubmitPlanOvertimeCancelBusinessFunction.businessSendMailRecords([{ ...item }], dataBody),
                    ...actionSendMail
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_SendMail'),
                    type: E_SENDMAIL,
                    onPress: (items, dataBody) =>
                        AttSubmitPlanOvertimeCancelBusinessFunction.businessSendMailRecords(items, dataBody),
                    ...actionSendMail
                }
            ];
        }

        //action delete
        const actionDelete = businessAction ? businessAction.find(action => action.Type === E_DELETE) : null,
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
                        AttSubmitPlanOvertimeCancelBusinessFunction.businessDeleteRecords([{ ...item }], dataBody),
                    ...actionDelete
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Delete'),
                    type: E_DELETE,
                    onPress: (item, dataBody) =>
                        AttSubmitPlanOvertimeCancelBusinessFunction.businessDeleteRecords(item, dataBody),
                    ...actionDelete
                }
            ];
        }

        return { rowActions: _rowActions, selected: _selected };
    }
};

export const AttSubmitPlanOvertimeCancelBusinessFunction = {
    setThisForBusiness: dataThis => {
        _this = dataThis;
    },
    //#region [action send mail]
    businessSendMailRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map(item => {
                return item.ID;
            });

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionSendEmail', {
                selectedID,
                screenName: attSubmitPlanOvertimeCancel,
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && typeof res === enumName.E_object) {
                        let isValid = res.isValid;

                        if (isValid == true) {
                            AttSubmitPlanOvertimeCancelBusinessFunction.confirmSendMail(res);
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

    confirmSendMail: objValid => {
        const { E_SENDMAIL, E_isInputText, E_isValidInputText, E_string } = enumName;
        let actionCancel = _rowActions.find(item => item.Type === E_SENDMAIL),
            isConfirm = actionCancel[enumName.E_Confirm];

        if (isConfirm) {
            let isInputText = isConfirm[E_isInputText],
                isValidInputText = isConfirm[E_isValidInputText],
                message = objValid.message && typeof objValid.message === E_string ? objValid.message : null,
                placeholder = translate('Reason');

            AlertSevice.alert({
                icon: `${Platform.OS === 'ios' ? 'ios-' : 'md-'}mail`,
                iconColor: Colors.primary,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                isInputText: isInputText,
                message: message,
                onCancel: () => {},
                onConfirm: reason => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        const { apiConfig } = dataVnrStorage,
                            _uriPor = apiConfig ? apiConfig.uriPor : null;

                        let arrId = objValid.strResultID.split(',');
                        VnrLoadingSevices.show();

                        HttpService.Post('[URI_HR/Att_GetData/ProcessSendMailRequestCancelation', {
                            host: _uriPor,
                            selectedIds: arrId,
                            reason
                        }).then(res => {
                            VnrLoadingSevices.hide();
                            try {
                                if (res && res.success) {
                                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                                    _this.reload('E_KEEP_FILTER');
                                } else if (res && res.mess) {
                                    ToasterSevice.showError(res.mess, 4000);
                                } else {
                                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
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
            let arrId = objValid.strResultID.split(',');
            VnrLoadingSevices.show();

            HttpService.Post('[URI_HR]/Att_GetData/ProcessSendMailRequestCancelation', {
                host: _uriPor,
                selectedIds: arrId
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && res.success) {
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        _this.reload('E_KEEP_FILTER');
                    } else if (res && res.mess) {
                        ToasterSevice.showError(res.mess, 4000);
                    } else {
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        }
    },
    //#endregion

    //#region [action delete]
    businessDeleteRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map(item => {
                return item.ID;
            });
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionDelete', {
                selectedID,
                screenName: attSubmitPlanOvertimeCancel,
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && typeof res === enumName.E_object) {
                        let isValid = res.isValid;

                        //dữ liệu hợp lệ => gọi hàm confirm Xóa
                        if (isValid) {
                            AttSubmitPlanOvertimeCancelBusinessFunction.confirmDelete(res);
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

    confirmDelete: objValid => {
        const { E_DELETE, E_isInputText, E_isValidInputText, E_string, E_Confirm } = enumName;

        let actionCancel = _rowActions.find(item => item.Type === E_DELETE),
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
                onConfirm: reason => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        let strId = objValid.strResultID;
                        AttSubmitPlanOvertimeCancelBusinessFunction.setIsDelete({ Ids: strId, reason });
                    }
                }
            });
        } else {
            let strId = objValid.strResultID;
            AttSubmitPlanOvertimeCancelBusinessFunction.setIsDelete({ Ids: strId });
        }
    },

    setIsDelete: objValid => {
        VnrLoadingSevices.show();
        let selectedIds = objValid.Ids,
            reason = objValid.reason;
        HttpService.Post('[URI_HR]/Att_GetData/RemoveSelectedRequestCancelationOvertimePlan', {
            selectedIds,
            reason
        }).then(res => {
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

    //#region [modify]
    businessModifyRecord: item => {
        //check status có cho chỉnh sửa => case ở view detail có nhiều button (sửa, xóa, mail,...)
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetRequestCancelationOTPlanByID', {
            id: item.ID,
            screenName: attSubmitPlanOvertimeCancel
        }).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res && res.BusinessAllowAction && res.BusinessAllowAction.indexOf('E_MODIFY') >= 0) {
                    const { reload } = _this;
                    _this.props.navigation.navigate(attSubmitPlanOvertimeCancelAddOrEdit, {
                        record: res,
                        screenName: 'AttSubmitPlanOvertimeCancel',
                        reload
                    });
                } else {
                    ToasterSevice.showWarning('StatusNotAction');
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    }
    //#endregion

    //#region [action cancel]
    // businessCancelRecords: (items, dataBody, isShowMultiRecord) => {

    //     if (items.length === 0 && !dataBody) {
    //         ToasterSevice.showWarning('HRM_Common_Select', 4000);
    //     }
    //     else {

    //         let selectedID = items.map(item => {
    //             return item.ID;
    //         });

    //         //view detail => check lại dữ liệu cho button đã thao tác
    //         if (selectedID.length == 1) {

    //             VnrLoadingSevices.show();
    //             HttpService.Post(`[URI_HR]/Att_GetData/GetPlanOvertimeCancelById`, { id: selectedID[0], screenName: attSubmitPlanOvertimeCancel })
    //                 .then(res => {
    //                     VnrLoadingSevices.hide();
    //                     try {

    //                         if (res && res.BusinessAllowAction && res.BusinessAllowAction.indexOf('E_CANCEL') >= 0) {

    //                             VnrLoadingSevices.show();
    //                             HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionCancel', {
    //                                 selectedID,
    //                                 screenName: attSubmitPlanOvertimeCancel,
    //                                 dataBody: dataBody ? JSON.stringify(dataBody) : ''
    //                             })
    //                                 .then(res => {
    //                                     VnrLoadingSevices.hide();

    //                                     try {
    //                                         if (res && typeof res === enumName.E_object) {

    //                                             let isValid = res.isValid;

    //                                             //dữ liệu hợp lệ => gọi hàm confirm Hủy
    //                                             if (isValid) {
    //                                                 AttSubmitPlanOvertimeCancelBusinessFunction.confirmCancel(res);
    //                                             }
    //                                             //không hợp lệ
    //                                             else if (isValid == false && res.message && typeof res.message === enumName.E_string) {
    //                                                 ToasterSevice.showWarning(res.message, 4000);
    //                                             }
    //                                             //FAIL
    //                                             else {
    //                                                 ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
    //                                             }
    //                                         }
    //                                         //FAIL
    //                                         else {
    //                                             ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
    //                                         }
    //                                     } catch (error) {
    //                                         DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
    //                                     }
    //                                 })
    //                         }
    //                         else {
    //                             ToasterSevice.showWarning('DataCancelCanNotCancel');
    //                         }

    //                     } catch (error) {
    //                         DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
    //                     }
    //                 });
    //         }
    //         else {

    //             VnrLoadingSevices.show();
    //             HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionCancel', {
    //                 selectedID,
    //                 screenName: attSubmitPlanOvertimeCancel,
    //                 dataBody: dataBody ? JSON.stringify(dataBody) : ''
    //             })
    //                 .then(res => {
    //                     VnrLoadingSevices.hide();

    //                     try {
    //                         if (res && typeof res === enumName.E_object) {

    //                             let isValid = res.isValid;

    //                             //dữ liệu hợp lệ => gọi hàm confirm Hủy
    //                             if (isValid) {
    //                                 AttSubmitPlanOvertimeCancelBusinessFunction.confirmCancel(res);
    //                             }
    //                             //không hợp lệ
    //                             else if (isValid == false && res.message && typeof res.message === enumName.E_string) {
    //                                 ToasterSevice.showWarning(res.message, 4000);
    //                             }
    //                             //FAIL
    //                             else {
    //                                 ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
    //                             }
    //                         }
    //                         //FAIL
    //                         else {
    //                             ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
    //                         }
    //                     } catch (error) {
    //                         DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
    //                     }
    //                 })
    //         }
    //     }
    // },

    // confirmCancel: (objValid) => {

    //     const { E_CANCEL, E_isInputText, E_isValidInputText,
    //         E_string, E_Confirm } = enumName;

    //     let actionCancel = _rowActions.find(item => item.Type === E_CANCEL),
    //         isConfirm = actionCancel[E_Confirm];

    //     if (isConfirm) {

    //         let isInputText = isConfirm[E_isInputText],
    //             isValidInputText = isConfirm[E_isValidInputText],
    //             message = (objValid.message && typeof objValid.message === E_string) ? objValid.message : null,
    //             placeholder = translate('HRM_Common_CommentCancel');

    //         AlertSevice.alert({
    //             iconType: EnumIcon.E_CANCEL,
    //             placeholder: placeholder,
    //             isValidInputText: isValidInputText,
    //             isInputText: isInputText,
    //             message: message,
    //             onCancel: () => { },
    //             onConfirm: (reason) => {

    //                 if (isValidInputText && (!reason || reason === '')) {
    //                     let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
    //                     ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
    //                 }
    //                 else {

    //                     //check khung giờ cho Phổ Đình
    //                     let strId = objValid.strResultID;
    //                     AttSubmitPlanOvertimeCancelBusinessFunction.setStatusCancel({ Ids: strId, reason });
    //                 }
    //             }
    //         })
    //     }
    //     else {

    //         //check khung giờ cho Phổ Đình
    //         let strId = objValid.strResultID;
    //         AttSubmitPlanOvertimeCancelBusinessFunction.setStatusCancel({ Ids: strId });
    //     }
    // },

    // setStatusCancel: (objValid) => {

    //     let Ids = objValid.Ids,
    //         CommentCancel = objValid.reason;
    //     const { apiConfig } = dataVnrStorage,
    //         _uriMain = apiConfig ? apiConfig.uriMain : null;

    //     VnrLoadingSevices.show();
    //     HttpService.Post('[URI_HR]/Att_GetData/ChangeStatusCancelOvertimePlanNew', {
    //         Ids,
    //         host: _uriMain,
    //         CommentCancel,
    //         //IsConfirmWorkingByFrame: true,
    //         IsPortal: true
    //     })
    //         .then(res => {
    //             VnrLoadingSevices.hide();
    //             try {
    //                 if (res && res !== '') {
    //                     if (typeof res == 'string' && res.includes('Success')) {
    //                         ToasterSevice.showSuccess('Hrm_Succeed', 4000);
    //                         _this.reload('E_KEEP_FILTER');
    //                     }
    //                     else if (data.indexOf('FieldInvalidMaxLenght') > -1) {
    //                         const mesError = data.split('|')[0];
    //                         ToasterSevice.showWarning(mesError ? mesError : 'HRM_Common_SendRequest_Error');
    //                     }
    //                     else if (res == "Fail") {
    //                         ToasterSevice.showWarning('DateFormLessDateNow', 4000);
    //                     }
    //                     else if (res == enumName.E_Locked) {
    //                         ToasterSevice.showWarning('Hrm_Locked', 4000);
    //                     }
    //                     else if (res == "HRM_ATT_CannotCancelDataInPast") {
    //                         ToasterSevice.showWarning('HRM_ATT_CannotCancelDataInPast', 4000);
    //                     }
    //                     else {
    //                         ToasterSevice.showWarning(res, 4000);
    //                     }
    //                 }
    //                 else {
    //                     ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
    //                 }
    //             } catch (error) {
    //                 DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
    //             }
    //         })
    // },
    //#endregion
};
