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
    SalApprovePITFinalization = ScreenName.SalApprovePITFinalization;

let _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];

    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[SalApprovePITFinalization],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_MODIFY, E_ResourceName, E_Name, E_Rule, E_SENDMAIL, E_DELETE } = enumName;

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
                    onPress: (item, dataBody) =>
                        SalApprovePITFinalizationBusinessFunction.businessModifyRecord({ ...item }, dataBody),
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
                        SalApprovePITFinalizationBusinessFunction.businessSendMailRecords([{ ...item }], dataBody),
                    ...actionSendMail
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_SendRequest_Button'),
                    type: E_SENDMAIL,
                    onPress: (items, dataBody) =>
                        SalApprovePITFinalizationBusinessFunction.businessSendMailRecords(items, dataBody),
                    ...actionSendMail
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
                        SalApprovePITFinalizationBusinessFunction.businessDeleteRecords([{ ...item }], dataBody),
                    ...actionDelete
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Delete'),
                    type: E_DELETE,
                    onPress: (item, dataBody) =>
                        SalApprovePITFinalizationBusinessFunction.businessDeleteRecords(item, dataBody),
                    ...actionDelete
                }
            ];
        }

        //action cancel
        // const actionCancel = businessAction ? businessAction.find(action => action.Type === E_CANCEL) : null,
        //     actionCancelResource = actionCancel ? actionCancel[E_ResourceName][E_Name] : null,
        //     actionCancelRule = actionCancel ? actionCancel[E_ResourceName][E_Rule] : null,
        //     actionCancelPer = (actionCancelResource && actionCancelRule)
        //         ? permission[actionCancelResource][actionCancelRule] : null;

        // if (actionCancelPer) {
        //     _rowActions = [
        //         ..._rowActions,
        //         {
        //             title: translate('HRM_Common_Cancel'),
        //             type: E_CANCEL,
        //             onPress: (item, dataBody) => SalApprovePITFinalizationBusinessFunction.businessCancelRecords([{ ...item }], dataBody),
        //             ...actionCancel
        //         }
        //     ];

        //     _selected = [
        //         ..._selected,
        //         {
        //             title: translate('HRM_Common_Cancel'),
        //             type: E_CANCEL,
        //             onPress: (item, dataBody) => SalApprovePITFinalizationBusinessFunction.businessCancelRecords(item, dataBody),
        //             ...actionCancel
        //         }
        //     ]
        // }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const SalApprovePITFinalizationBusinessFunction = {
    checkForReLoadScreen: {
        [ScreenName.SalApprovePITFinalization]: false
    },
    setThisForBusiness: (dataThis) => {
        _this = dataThis;
    },
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
                ToasterSevice.showWarning('HRM_Payroll_Sal_PITFinalization_Index_OnlyDeleteWithStatusTempSave', 4000);
                return;
            }

            let numberRow = selectedID.length,
                keyTrans = translate('HRM_PortalApp_Message_DeleteConfirm');

            SalApprovePITFinalizationBusinessFunction.confirmDelete({
                strResultID: selectedID,
                message: keyTrans.replace('[E_NUMBER]', numberRow)
            });
        }
    },

    confirmDelete: (objValid) => {
        let actionCancel = _rowActions.find((item) => item.Type === 'E_DELETE'),
            isConfirm = actionCancel['Confirm'];

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
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
                        SalApprovePITFinalizationBusinessFunction.setDelete(objValid);
                    }
                }
            });
        } else {
            SalApprovePITFinalizationBusinessFunction.setDelete(objValid);
        }
    },

    setDelete: (objValid) => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Sal_GetData/RemoveSelectedPITFinalizationDelegatee', {
            selectedIds: objValid.strResultID
        }).then((res) => {
            VnrLoadingSevices.hide();
            try {
                if (res && res == EnumName.E_Success) {
                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                    _this.reload('E_KEEP_FILTER', true);
                } else if (res && res.Message && typeof res.Message == 'string') {
                    ToasterSevice.showError(res.Message, 4000);
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    },
    //#endregion

    //#region [action send btnSendRequest]
    businessSendMailRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = [],
                isCheckPITFinalization = false;

            items.forEach((item) => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_SENDMAIL) > -1) {
                    selectedID.push(item.ID);

                    if (isCheckPITFinalization == false) {
                        isCheckPITFinalization = item.IsPITFinalization;
                    }
                }
            });

            if (selectedID.length == 0) {
                ToasterSevice.showWarning('HRM_Only_SendRequest_Status_SaveTemp', 4000);
                return;
            } else {
                SalApprovePITFinalizationBusinessFunction.setSendMail({
                    strResultID: selectedID.join(','),
                    IsPITFinalization: isCheckPITFinalization,
                    message: ''
                });
            }
        }
    },

    setSendMail: (objValid) => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Sal_GetData/SendRequestPITFinalizationDelegatee', {
            SelectedIds: objValid.strResultID
            // Status: 'E_WAITINGCONFIRM',
            // // Cấu hình "Ủy quyền quyết toán thuế"
            // IsPITFinalization: objValid.IsPITFinalization
        }).then((res) => {
            VnrLoadingSevices.hide();
            if (res && res.success == true) {
                ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                _this.reload('E_KEEP_FILTER');
            } else if (res.messageNotify && typeof res.messageNotify == 'string') {
                ToasterSevice.showWarning(res.messageNotify, 4000);
            } else {
                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
            }
        });
    },
    //#endregion

    //#region [modify]
    businessModifyRecord: (item) => {
        const { reload } = _this;
        _this.props.navigation.navigate(ScreenName.SalApprovePITFinalizationAddOrEdit, { record: item, reload });
    }
    //#endregion
};
