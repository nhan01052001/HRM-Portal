import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../../utils/HttpService';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumIcon, EnumStatus } from '../../../../../assets/constant';
import DrawerServices from '../../../../../utils/DrawerServices';

let enumName = EnumName,
    taxApproveTaxInformationRegister = ScreenName.TaxApproveTaxInformationRegister,
    taxSubmitTaxInformationRegisterAddOrEdit = ScreenName.TaxSubmitTaxInformationRegisterAddOrEdit;

let _this = null,
    // eslint-disable-next-line no-unused-vars
    _isOnScreenNotification = false,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];
    const permission = PermissionForAppMobile.value;

    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[taxApproveTaxInformationRegister],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_MODIFY, E_ResourceName, E_Name, E_Rule, E_SENDMAIL, E_DELETE } = enumName;

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
                    title: translate('HRM_Payroll_Sal_TaxInformationRegister_btnForward'),
                    type: E_SENDMAIL,
                    onPress: (item, dataBody) =>
                        TaxApproveTaxInformationRegisterBusinessFunctionisterList.businessForwardRecords(
                            [{ ...item }],
                            dataBody
                        ),
                    ...actionSendMail
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Payroll_Sal_TaxInformationRegister_btnForward'),
                    type: E_SENDMAIL,
                    onPress: (items, dataBody) =>
                        TaxApproveTaxInformationRegisterBusinessFunctionisterList.businessForwardRecords(
                            items,
                            dataBody
                        ),
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
                    onPress: (item) =>
                        TaxApproveTaxInformationRegisterBusinessFunctionisterList.businessModifyRecord({ ...item }),
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
                        TaxApproveTaxInformationRegisterBusinessFunctionisterList.businessDeleteRecords(
                            [{ ...item }],
                            dataBody
                        ),
                    ...actionDelete
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Delete'),
                    type: E_DELETE,
                    onPress: (item, dataBody) =>
                        TaxApproveTaxInformationRegisterBusinessFunctionisterList.businessDeleteRecords(item, dataBody),
                    ...actionDelete
                }
            ];
        }

        return { rowActions: _rowActions, selected: _selected };
    }
};

export const TaxApproveTaxInformationRegisterBusinessFunctionisterList = {
    // Đối tượng checkForReLoadScreen để check có refresh ListApprovedStopWorking không

    checkForReLoadScreen: {
        [ScreenName.TaxApprovedTaxInformationRegister]: false,
        [ScreenName.TaxApproveTaxInformationRegister]: false
    },
    setThisForBusiness: (dataThis, isNotification) => {
        if (isNotification) _isOnScreenNotification = true;
        else _isOnScreenNotification = false;

        _this = dataThis;
    },

    //#region [action chuyển]
    businessForwardRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = [];
            items.forEach((item) => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_SENDMAIL) > -1) {
                    selectedID.push(item.ID);
                }
            });

            if (selectedID.length == 0) {
                ToasterSevice.showWarning(
                    'HRM_Payroll_Sal_TaxInformationRegister_StatusForward_Notification_CommonPortal',
                    4000
                );
                return;
            } else {
                TaxApproveTaxInformationRegisterBusinessFunctionisterList.confirmForward({
                    strResultID: selectedID,
                    message: translate('HRM_Portal_DoYouWantSend_ENUMBER').replace(
                        '[E_NUMBER]',
                        `${selectedID.length}/${items.length}`
                    )
                });
            }
        }
    },

    confirmForward: (objValid) => {
        let actionForward = _rowActions.find((item) => item.Type === 'E_SENDMAIL'),
            isConfirm = actionForward['Confirm'];

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
                placeholder = translate('HRM_Attendance_AnnualDayOffTransfer_Reason');

            AlertSevice.alert({
                iconType: EnumIcon.E_FORWARD,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                isInputText: isInputText,
                message: message,
                onCancel: () => {},
                onConfirm: (reason) => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + ' ' + translate('FieldNotAllowNullShort');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        TaxApproveTaxInformationRegisterBusinessFunctionisterList.setForward({
                            ...objValid,
                            Comment: reason
                        });
                    }
                }
            });
        } else {
            TaxApproveTaxInformationRegisterBusinessFunctionisterList.setForward(objValid);
        }
    },

    setForward: (objValid) => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Sal_GetData/UpdateStatusForwardPortal', {
            strTaxInformationRegisters: objValid.strResultID.join()
        })
            .then((res) => {
                VnrLoadingSevices.hide();
                if (res && res.Messenger.toUpperCase() === EnumName.E_SUCCESS) {
                    ToasterSevice.showSuccess('HRM_Common_CreateOrEdit_Success', 4000);
                    _this.reload('E_KEEP_FILTER');
                } else {
                    ToasterSevice.showError(res.Messenger, 4000);
                }
            })
            .catch(() => {
                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
            });
    },
    //#endregion

    //#region [action delete]
    businessDeleteRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = [];
            items.forEach((item) => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_DELETE) > -1) {
                    selectedID.push(item.ID);
                }
            });

            if (selectedID.length == 0) {
                ToasterSevice.showWarning('HRM_StatusCannotIsDelete', 4000);
                return;
            } else {
                TaxApproveTaxInformationRegisterBusinessFunctionisterList.confirmDelete({
                    strResultID: selectedID,
                    message: translate('HRM_Portal_DoYouWantDelete_ENUMBER').replace(
                        '[E_NUMBER]',
                        `${selectedID.length}/${items.length}`
                    )
                });
            }
        }
    },

    confirmDelete: (objValid) => {
        const { E_DELETE, E_isInputText, E_isValidInputText, E_string, E_Confirm } = enumName;

        let actionDelete = _rowActions.find((item) => item.Type === E_DELETE),
            isConfirm = actionDelete[E_Confirm];
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
                        TaxApproveTaxInformationRegisterBusinessFunctionisterList.setIsDelete({ Ids: strId, reason });
                    }
                }
            });
        } else {
            let strId = objValid.strResultID;
            TaxApproveTaxInformationRegisterBusinessFunctionisterList.setIsDelete({ Ids: strId });
        }
    },

    setIsDelete: (objValid) => {
        VnrLoadingSevices.show();
        let selectedIds = objValid.Ids;

        HttpService.Post('[URI_POR]/New_Sal_TaxInformationRegister/RemoveSelected', {
            selectedIds: selectedIds
        }).then((res) => {
            VnrLoadingSevices.hide();
            try {
                if (res && res !== '') {
                    if (res == enumName.E_Success) {
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        _this.reload('E_KEEP_FILTER', true);
                    } else if (res == enumName.E_Locked) {
                        ToasterSevice.showWarning('DataIsLocked', 4000);
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
    businessModifyRecord: (item) => {
        if (item) {
            //check status có cho chỉnh sửa => case ở view detail có nhiều button (sửa, xóa, mail,...)
            if (item.BusinessAllowAction.indexOf(EnumStatus.E_MODIFY) > -1) {
                VnrLoadingSevices.show();
                HttpService.Get(`[URI_HR]/api/Sal_TaxInformationRegister?id=${item.ID}`).then((res) => {
                    VnrLoadingSevices.hide();
                    try {
                        if (res) {
                            const { reload } = _this;
                            _this.props.navigation.navigate(taxSubmitTaxInformationRegisterAddOrEdit, {
                                record: res,
                                reload
                            });
                        }
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });
            } else {
                ToasterSevice.showWarning(
                    translate('HRM_Portal_DontEdit_ENUMBER').replace('[E_NUMBER]', item.StatusView),
                    4000
                );
                return;
            }
        }
    }
    //#endregion
};

export default {
    generateRowActionAndSelected: generateRowActionAndSelected,
    TaxApproveTaxInformationRegisterBusinessFunctionisterList: TaxApproveTaxInformationRegisterBusinessFunctionisterList
};
