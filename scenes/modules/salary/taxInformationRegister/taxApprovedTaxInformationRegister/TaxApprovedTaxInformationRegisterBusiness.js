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
    taxApprovedTaxInformationRegister = ScreenName.TaxApprovedTaxInformationRegister;

let _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];

    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[taxApprovedTaxInformationRegister],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_ResourceName, E_Name, E_Rule, E_DELETE } = enumName;

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
                        TaxApprovedTaxInformationRegisterBusinessFunction.businessDeleteRecords(
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
                        TaxApprovedTaxInformationRegisterBusinessFunction.businessDeleteRecords(item, dataBody),
                    ...actionDelete
                }
            ];
        }
    }

    return { rowActions: _rowActions, selected: _selected };
};

export const TaxApprovedTaxInformationRegisterBusinessFunction = {
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
                ToasterSevice.showWarning('HRM_StatusCannotIsDelete', 4000);
                return;
            } else {
                TaxApprovedTaxInformationRegisterBusinessFunction.confirmDelete({
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
                        TaxApprovedTaxInformationRegisterBusinessFunction.setIsDelete({ Ids: strId, reason });
                    }
                }
            });
        } else {
            let strId = objValid.strResultID;
            TaxApprovedTaxInformationRegisterBusinessFunction.setIsDelete({ Ids: strId });
        }
    },

    setIsDelete: (objValid) => {
        VnrLoadingSevices.show();
        let selectedIds = objValid.Ids;

        HttpService.Post('[URI_HR]/Sal_GetData/RemoveSelectedTaxInformationRegister', {
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
    }
    //#endregion
};
