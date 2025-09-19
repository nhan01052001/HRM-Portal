import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../../utils/HttpService';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumIcon, EnumStatus } from '../../../../../assets/constant';

let enumName = EnumName;

let _this = null,
    // eslint-disable-next-line no-unused-vars
    _isOnScreenNotification = false,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = screenName => {
    _rowActions = [];
    _selected = [];

    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[screenName],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_ResourceName, E_Name, E_Rule, E_CANCEL } = enumName;

        //action cancel
        const actionCancel = businessAction ? businessAction.find(action => action.Type === E_CANCEL) : null,
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
                        AttSubmitDelegationApprovalBusiness.businessCancelRecords(
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
                        AttSubmitDelegationApprovalBusiness.businessCancelRecords(item, dataBody),
                    ...actionCancel
                }
            ];
        }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const AttSubmitDelegationApprovalBusiness = {
    checkForReLoadScreen: {
        AttSubmitDelegationApproval: false,
        AttSaveTempSubmitWorkingOvertime: false,
        AttCanceledSubmitWorkingOvertime: false,
        AttApproveSubmitWorkingOvertime: false,
        AttApprovedSubmitWorkingOvertime: false,
        AttConfirmedSubmitWorkingOvertime: false,
        AttRejectSubmitWorkingOvertime: false
    },
    setThisForBusiness: (dataThis, isNotification, rowActionsFromScreen = _rowActions) => {
        if (isNotification) _isOnScreenNotification = true;
        else _isOnScreenNotification = false;

        _rowActions = rowActionsFromScreen ?? [];
        _this = dataThis;
    },
    //#endregion

    //#region [action cancel]
    businessCancelRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = [],
                fullSelectedID = [];
            items.forEach(item => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_CANCEL) > -1) {
                    selectedID.push(item.ID);
                }
                fullSelectedID.push(item.ID);
            });

            if (selectedID.length == 0) {
                ToasterSevice.showWarning('HRM_PortalApp_DataCannotCancel', 4000);
                return;
            }

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Sys_GetData/ValidateActionCancelDelegateApprovalInPortal', {
                selectedIds: fullSelectedID,
                actionValidate: 'CANCEL'
            }).then((res) => {
                VnrLoadingSevices.hide();
                if (!res || typeof res !== 'string') {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                    return;
                }

                const [status, message, IDs] = res.split('|');
                if (status === EnumName.E_Success && typeof IDs === 'string') {
                    AttSubmitDelegationApprovalBusiness.confirmCancel({
                        selectedIds: IDs.split(','),
                        message: message
                    });
                } else {
                    ToasterSevice.showError(message ?? 'HRM_Common_SendRequest_Error', 4000);
                }

            });
        }
    },

    confirmCancel: (objValid) => {
        let actionCancel = _rowActions.find(item => item.Type === 'E_CANCEL'),
            isConfirm = actionCancel['Confirm'];

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
                placeholder = translate('HRM_PortalApp_ReasonForCancellation');

            AlertSevice.alert({
                limit: 500,
                textLimit: translate('HRM_Sytem_MaxLength500'),
                title: 'HRM_PortalApp_CancellationInformation',
                iconType: EnumIcon.E_CANCEL,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                isInputText: isInputText,
                message: message,
                onCancel: () => { },
                onConfirm: reason => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        AttSubmitDelegationApprovalBusiness.setCancel({ ...objValid, comment: reason });
                    }
                }
            });
        } else {
            AttSubmitDelegationApprovalBusiness.setCancel(objValid);
        }
    },

    setCancel: objValid => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Sys_GetData/UpdateStatusDeletegateByAction', {
            Ids: Array.isArray(objValid.selectedIds) ? objValid.selectedIds.join(',') : objValid.selectedIds,
            comment: objValid?.comment,
            actionValidate: 'CANCEL'
        }).then(res => {
            if (!(res && typeof res === 'string')) {
                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                return;
            }

            const [status, message] = res.split('|');
            VnrLoadingSevices.hide();
            if (status === EnumName.E_Success) {
                ToasterSevice.showSuccess('Hrm_Succeed', 4000);

                if (typeof _this.reload === 'function')
                    _this.reload('E_KEEP_FILTER', true);
                AttSubmitDelegationApprovalBusiness.checkForReLoadScreen[ScreenName.AttSubmitDelegationApproval] = true;
                AttSubmitDelegationApprovalBusiness.checkForReLoadScreen[
                    ScreenName.AttWaitConfirmSubmitDelegationApproval
                ] = true;
                AttSubmitDelegationApprovalBusiness.checkForReLoadScreen[
                    ScreenName.AttCanceledSubmitDelegationApproval
                ] = true;
            } else if (message && typeof message == 'string') {
                ToasterSevice.showError(message, 4000);
            } else {
                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
            }
        });
    }
    //#endregion
};
