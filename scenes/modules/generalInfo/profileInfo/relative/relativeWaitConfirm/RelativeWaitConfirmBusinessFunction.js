import { ToasterSevice } from '../../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../../../utils/HttpService';
import { translate } from '../../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../../assets/configProject/PermissionForAppMobile';
import { dataVnrStorage } from '../../../../../../assets/auth/authentication';
import { ConfigList } from '../../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumIcon, EnumStatus } from '../../../../../../assets/constant';
import DrawerServices from '../../../../../../utils/DrawerServices';

let enumName = EnumName,
    RelativeWaitConfirm = ScreenName.RelativeWaitConfirm;

let _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];

    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[RelativeWaitConfirm],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_MODIFY, E_ResourceName, E_Name, E_Rule, E_SENDMAIL, E_DELETE, E_ATTACH_FILE } = enumName;

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
                    onPress: (item, dataBody) =>
                        RelativeWaitConfirmBusinessFunction.businessModifyRecord({ ...item }, dataBody),
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
                    title: translate('HR_Hre_Dependent_Transfer'),
                    type: E_SENDMAIL,
                    onPress: (item, dataBody) =>
                        RelativeWaitConfirmBusinessFunction.businessSendMailRecords([{ ...item }], dataBody),
                    ...actionSendMail
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HR_Hre_Dependent_Transfer'),
                    type: E_SENDMAIL,
                    onPress: (items, dataBody) =>
                        RelativeWaitConfirmBusinessFunction.businessSendMailRecords(items, dataBody),
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
                        RelativeWaitConfirmBusinessFunction.businessDeleteRecords([{ ...item }], dataBody),
                    ...actionDelete
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Delete'),
                    type: E_DELETE,
                    onPress: (item, dataBody) =>
                        RelativeWaitConfirmBusinessFunction.businessDeleteRecords(item, dataBody),
                    ...actionDelete
                }
            ];
        }

        //action Attach File
        const actionAttachfile = businessAction ? businessAction.find(action => action.Type === E_ATTACH_FILE) : null,
            actionAttachfileResource = actionAttachfile ? actionAttachfile[E_ResourceName][E_Name] : null,
            actionAttachfileRule = actionAttachfile ? actionAttachfile[E_ResourceName][E_Rule] : null,
            actionAttachfilePer =
                actionAttachfileResource && actionAttachfileRule
                    ? permission[actionAttachfileResource][actionAttachfileRule]
                    : null;

        if (actionAttachfilePer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_Common_FileAttach'),
                    type: E_ATTACH_FILE,
                    onPress: (item, dataBody) =>
                        RelativeWaitConfirmBusinessFunction.businessAttachFileRecord(item, dataBody),
                    ...actionDelete
                }
            ];
        }

        return { rowActions: _rowActions, selected: _selected };
    }
};

export const RelativeWaitConfirmBusinessFunction = {
    setThisForBusiness: dataThis => {
        _this = dataThis;
    },
    //#region [action delete]
    businessDeleteRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = [];

            items.forEach(item => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_DELETE) > -1) {
                    selectedID.push(item.ID);
                }
            });

            if (selectedID.length == 0) {
                ToasterSevice.showWarning('HRM_Hre_Relative_DataInStatus_CannotEditOrDelete', 4000);
                return;
            }

            let numberRow = selectedID.length,
                keyTrans = translate('HRM_PortalApp_Message_DeleteConfirm');

            RelativeWaitConfirmBusinessFunction.confirmDelete({
                strResultID: selectedID,
                message: keyTrans.replace('[E_NUMBER]', items.length > 1 ? `${numberRow}/${items.length}` : numberRow)
            });
        }
    },

    confirmDelete: objValid => {
        let actionCancel = _rowActions.find(item => item.Type === 'E_DELETE'),
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
                onConfirm: reason => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        RelativeWaitConfirmBusinessFunction.setDelete(objValid);
                    }
                }
            });
        } else {
            RelativeWaitConfirmBusinessFunction.setDelete(objValid);
        }
    },

    setDelete: objValid => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Por_GetData/DeleteGridRequestInfo', {
            selectedIds: objValid.strResultID,
            profileId: dataVnrStorage.currentUser.info.ProfileID
        }).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res && res == EnumName.E_Success) {
                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                    _this.reload();
                } else if (res && res.Message && typeof res.Message == 'string') {
                    ToasterSevice.showError(res.Message, 4000);
                } else if (res && typeof res == 'string') {
                    ToasterSevice.showError(res, 4000);
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
            let selectedID = [];

            items.forEach(item => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_SENDMAIL) > -1) {
                    selectedID.push(item.ID);
                }
            });

            if (selectedID.length == 0) {
                ToasterSevice.showWarning('HRM_Hre_Relative_Alert_DataAlreadyTransfer', 4000);
                return;
            } else {
                RelativeWaitConfirmBusinessFunction.setSendMail({
                    strResultID: selectedID,
                    message: ''
                });
            }
        }
    },

    setSendMail: objValid => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Hre_GetData/processTransferRelativesCombine', {
            selectedIDs: objValid.strResultID
        }).then(res => {
            VnrLoadingSevices.hide();
            if (res && res == EnumName.E_Success) {
                ToasterSevice.showSuccess('Hrm_Succeed', 4000);

                DrawerServices.navigate('RelativeWaitConfirm');
                _this.reload();
            } else if (res && res.Message && typeof res.Message == 'string') {
                ToasterSevice.showError(res.Message, 4000);
            } else if (res && typeof res == 'string') {
                ToasterSevice.showSuccess(res, 4000);
            } else {
                ToasterSevice.showSuccess('HRM_Common_SendRequest_Error', 4000);
            }
        });
    },
    //#endregion

    //#region [modify]
    businessModifyRecord: item => {
        const { reload } = _this;
        VnrLoadingSevices.show();
        HttpService.Get(`[URI_HR]/Hre_GetData/GetById_RelativesCombineGrid?id=${item.ID}`).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res && Object.keys(res).length > 0) {
                    DrawerServices.navigate('RelativeAddOrEdit', {
                        record: res,
                        reload: reload,
                        screenName: ScreenName.RelativeWaitConfirm
                    });
                } else {
                    ToasterSevice.showWarning('StatusNotAction');
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    },
    //#endregion

    //#region [Attach file]
    businessAttachFileRecord: item => {
        _this.openModalAttachFile && _this.openModalAttachFile(item.ID);
    },
    businessSaveAttachFile: params => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Hre_GetData/saveAttachRequestInfoRelatives', params).then(res => {
            VnrLoadingSevices.hide();
            if (res && res == EnumName.E_Success) {
                ToasterSevice.showSuccess('Hrm_Succeed', 4000);

                DrawerServices.navigate('RelativeWaitConfirm');
                _this.reload();
            } else if (res && res.Message && typeof res.Message == 'string') {
                ToasterSevice.showError(res.Message, 4000);
            } else if (res && typeof res == 'string') {
                ToasterSevice.showSuccess(res, 4000);
            } else {
                ToasterSevice.showSuccess('HRM_Common_SendRequest_Error', 4000);
            }
        });
    }
    //#endregion
};
