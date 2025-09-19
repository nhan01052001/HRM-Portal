import { Colors } from '../../../../../constants/styleConfig';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../../utils/HttpService';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumIcon } from '../../../../../assets/constant';
import DrawerServices from '../../../../../utils/DrawerServices';
import { Platform } from 'react-native';

const enumName = EnumName,
    hreSubmitProfileCard = ScreenName.HreSubmitProfileCard,
    hreSubmitProfileCardAddOrEdit = ScreenName.HreSubmitProfileCardAddOrEdit;

let _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];

    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[hreSubmitProfileCard],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_MODIFY, E_ResourceName, E_Name, E_Rule, E_SENDMAIL, E_DELETE, E_CANCEL } = enumName;

        //action send mail
        const actionSendMail = businessAction ? businessAction.find((action) => action.Type === E_SENDMAIL) : null;
        const actionSendMailResource = actionSendMail ? actionSendMail[E_ResourceName][E_Name] : null;
        const actionSendMailRule = actionSendMail ? actionSendMail[E_ResourceName][E_Rule] : null;

        const actionSendMailPer =
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
                        HreSubmitProfileCardBusinessFunction.businessSendMailRecords([{ ...item }], dataBody),
                    ...actionSendMail
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_SendMail'),
                    type: E_SENDMAIL,
                    onPress: (items, dataBody) =>
                        HreSubmitProfileCardBusinessFunction.businessSendMailRecords(items, dataBody),
                    ...actionSendMail
                }
            ];
        }

        //action edit
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
                    onPress: (item) => HreSubmitProfileCardBusinessFunction.businessModifyRecord({ ...item }),
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
                        HreSubmitProfileCardBusinessFunction.businessDeleteRecords([{ ...item }], dataBody),
                    ...actionDelete
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Delete'),
                    type: E_DELETE,
                    onPress: (item, dataBody) =>
                        HreSubmitProfileCardBusinessFunction.businessDeleteRecords(item, dataBody),
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
                    onPress: (item, dataBody) =>
                        HreSubmitProfileCardBusinessFunction.businessCancelRecords(
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
                    onPress: (item, dataBody) =>
                        HreSubmitProfileCardBusinessFunction.businessCancelRecords(item, dataBody),
                    ...actionCancel
                }
            ];
        }

        return { rowActions: _rowActions, selected: _selected };
    }
};

export const HreSubmitProfileCardBusinessFunction = {
    setThisForBusiness: (dataThis) => {
        _this = dataThis;
    },
    //#region [action send mail]
    businessSendMailRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let lstIsSendMail = [];

            items.forEach((item) => {
                if (item.BusinessAllowAction.indexOf('E_SENDMAIL') > -1) lstIsSendMail.push(item);
            });

            if (lstIsSendMail.length == 0) {
                ToasterSevice.showWarning('Hrm_Change_SendMail_SucceedV2', 4000);
                return;
            }

            let selectedID = lstIsSendMail.map((item) => {
                return item.ID;
            });

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Por_GetData/BusinessAllowActionSendEmail', {
                selectedID: selectedID,
                screenName: hreSubmitProfileCard,
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            }).then((res) => {
                VnrLoadingSevices.hide();
                try {
                    if (res && typeof res === enumName.E_object) {
                        let isValid = res.isValid;

                        if (isValid == true) {
                            HreSubmitProfileCardBusinessFunction.confirmSendMail(res);
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

    confirmSendMail: (objValid) => {
        const { E_SENDMAIL, E_isInputText, E_isValidInputText, E_string } = enumName;
        let actionCancel = _rowActions.find((item) => item.Type === E_SENDMAIL),
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
                onConfirm: (reason) => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        let arrId = objValid.strResultID;
                        VnrLoadingSevices.show();

                        // need fix ProcessingSendMailOvertimePlan (đã fix)
                        HttpService.Post('[URI_HR]/Hre_GetDataV2/SendMailProfileCard', {
                            selectedIds: arrId
                        }).then((res) => {
                            VnrLoadingSevices.hide();
                            try {
                                if (res && res === 'Success') {
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
            let arrId = objValid.strResultID;
            VnrLoadingSevices.show();

            // need fix [done]
            HttpService.Post('[URI_HR]/Hre_GetDataV2/SendMailProfileCard', {
                selectedIds: arrId
            }).then((res) => {
                VnrLoadingSevices.hide();
                try {
                    if (res && res === 'Success') {
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
            let selectedID = items.map((item) => {
                return item.ID;
            });

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Por_GetData/BusinessAllowActionDelete', {
                selectedIds: Array.isArray(selectedID) ? selectedID.join() : null
            }).then((res) => {
                VnrLoadingSevices.hide();
                try {
                    if (res && typeof res === enumName.E_object) {
                        let isValid = res.isValid;

                        //dữ liệu hợp lệ => gọi hàm confirm Xóa
                        if (isValid) {
                            HreSubmitProfileCardBusinessFunction.confirmDelete(res);
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
        // }
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
                        let strId = objValid.strResultID;
                        HreSubmitProfileCardBusinessFunction.setIsDelete({ Ids: strId, reason });
                    }
                }
            });
        } else {
            let strId = objValid.strResultID;
            HreSubmitProfileCardBusinessFunction.setIsDelete({ Ids: strId });
        }
    },

    setIsDelete: (objValid) => {
        VnrLoadingSevices.show();
        let selectedIds = objValid?.Ids?.split(',');

        if (Array.isArray(selectedIds) && selectedIds.length > 0) {
            HttpService.Post('[URI_POR]/New_Rec_ProfileCard/RemoveSelected', {
                selectedIds
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
        }
    },
    //#endregion

    //#region [modify]
    businessModifyRecord: (item) => {
        try {
            if (item?.BusinessAllowAction.indexOf('E_MODIFY') >= 0) {
                VnrLoadingSevices.show();
                HttpService.Get(`[URI_HR]/api/Hre_ProfileCard/${item.ID}`).then((res) => {
                    VnrLoadingSevices.hide();
                    try {
                        if (res?.ActionStatus === 'Success') {
                            const { reload } = _this;
                            _this.props.navigation.navigate(hreSubmitProfileCardAddOrEdit, { record: res, reload });
                        }
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });
            }
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    },
    //#endregion

    //#region [action cancel]
    businessCancelRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = [];
            items.forEach((item) => {
                selectedID.push(item.ID);
            });

            if (selectedID.length == 0) {
                ToasterSevice.showWarning('HRM_Common_Select', 4000);
                return;
            }

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Hre_GetDataV2/ValidateProfileCardInfo', {
                IDs: selectedID.join(',')
            }).then((res) => {
                VnrLoadingSevices.hide();
                if (res?.toUpperCase() == EnumName.E_SUCCESS) {
                    let numberRow = selectedID.length,
                        keyTrans =
                            translate('HRM_Common_AreYouSure_Cancel') +
                            ' ' +
                            numberRow +
                            ' ' +
                            translate('HRM_Message_RecordSelectedConfirm');

                    HreSubmitProfileCardBusinessFunction.confirmCancel({
                        IDs: selectedID.join(','),
                        message: keyTrans
                    });
                } else if (res === EnumName.E_FAIL) {
                    ToasterSevice.showError(res.Message ? res.Message : 'HRM_Common_SendRequest_Error', 4000);
                } else {
                    ToasterSevice.showWarning(res, 4000);
                }
            });
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
                        HreSubmitProfileCardBusinessFunction.setCancel({ ...objValid, Comment: reason });
                    }
                }
            });
        } else {
            HreSubmitProfileCardBusinessFunction.setCancel(objValid);
        }
    },

    setCancel: (objValid) => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Hre_GetDataV2/CancelProfileCardInfo', {
            CancellationReason: objValid.Comment ? objValid.Comment : null,
            isPortal: true,
            IDs: objValid?.IDs
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
    }
    //#endregion
};
