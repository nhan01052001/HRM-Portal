import { ToasterSevice } from '../../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../../../utils/HttpService';
import { translate } from '../../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../../assets/configProject/PermissionForAppMobile';
import { ConfigList } from '../../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumIcon } from '../../../../../../assets/constant';
import DrawerServices from '../../../../../../utils/DrawerServices';
import store from '../../../../../../store';
import badgesNotification from '../../../../../../redux/badgesNotification';

let enumName = EnumName;

let _this = null,
    _isOnScreenNotification = false,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];
    const permission = PermissionForAppMobile.value;
    if (ConfigList.value) {
        const _configList = ConfigList.value['SalWaitApprovePaymentCostRegister'],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_ResourceName, E_Name, E_Rule, E_APPROVE, E_REJECT } = enumName;

        const actionApprove = businessAction ? businessAction.find(action => action.Type === E_APPROVE) : null,
            actionApproveResource = actionApprove ? actionApprove[E_ResourceName][E_Name] : null,
            actionApproveRule = actionApprove ? actionApprove[E_ResourceName][E_Rule] : null,
            actionApprovePer =
                actionApproveResource && actionApproveRule
                    ? permission[actionApproveResource][actionApproveRule]
                    : null;

        if (actionApprovePer) {
            _rowActions = [
                {
                    title: translate('HRM_Common_Approve'),
                    type: E_APPROVE,
                    onPress: (item, dataBody) =>
                        SalWaitApprovePaymentCostRegisterBusiness.businessApproveRecords([{ ...item }], dataBody),
                    ...actionApprove
                }
            ];

            _selected = [
                {
                    title: translate('HRM_Common_Approve'),
                    type: E_APPROVE,
                    onPress: (item, dataBody) =>
                        SalWaitApprovePaymentCostRegisterBusiness.businessApproveRecords(item, dataBody),
                    ...actionApprove
                }
            ];
        }

        const actionReject = businessAction ? businessAction.find(action => action.Type === E_REJECT) : null,
            actionRejectResource = actionReject ? actionReject[E_ResourceName][E_Name] : null,
            actionRejectRule = actionReject ? actionReject[E_ResourceName][E_Rule] : null,
            actionRejectPer =
                actionRejectResource && actionRejectRule ? permission[actionRejectResource][actionRejectRule] : null;

        if (actionRejectPer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_Common_Reject'),
                    type: E_REJECT,
                    onPress: (item, dataBody) =>
                        SalWaitApprovePaymentCostRegisterBusiness.businessRejectRecords([{ ...item }], dataBody),
                    ...actionReject
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Reject'),
                    type: E_REJECT,
                    onPress: (item, dataBody) =>
                        SalWaitApprovePaymentCostRegisterBusiness.businessRejectRecords(item, dataBody),
                    ...actionReject
                }
            ];
        }

        // kiểm tra chi phí
        if (permission['New_Sal_ConfirmPaymentCost_New_Index_btnFeeCheck'] && permission['New_Sal_ConfirmPaymentCost_New_Index_btnFeeCheck']['View']) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_PortalApp_FeeCheck'),
                    type: 'E_FEECHECK',
                    onPress: (item, dataBody) => SalWaitApprovePaymentCostRegisterBusiness.handleFeeCheck(item, dataBody),
                    Type: 'E_FEECHECK',
                    Resource: {
                        Name: 'New_Sal_ConfirmPaymentCost_New_Index_btnFeeCheck',
                        Rule: 'View'
                    },
                    Confirm: {
                        isInputText: false,
                        isValidInputText: false
                    }
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_PortalApp_FeeCheck'),
                    type: 'E_FEECHECK',
                    onPress: (item, dataBody) => SalWaitApprovePaymentCostRegisterBusiness.handleFeeCheck(item, dataBody),
                    Type: 'E_FEECHECK',
                    Resource: {
                        Name: 'New_Sal_ConfirmPaymentCost_New_Index_btnFeeCheck',
                        Rule: 'View'
                    },
                    Confirm: {
                        isInputText: false,
                        isValidInputText: false
                    }
                }
            ];
        }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const SalWaitApprovePaymentCostRegisterBusiness = {
    // Đối tượng checkForReLoadScreen để check có refresh ListApprovedStopWorking không
    checkForReLoadScreen: {},
    setThisForBusiness: (dataThis, isNotification) => {
        if (isNotification) _isOnScreenNotification = true;
        else _isOnScreenNotification = false;

        _this = dataThis;
    },
    //#region [action reject]
    businessRejectRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 5000);
        } else {
            let selectedID = [];

            items.forEach(item => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf('E_APPROVE') > -1) {
                    selectedID.push(item.ID);
                }
            });

            if (selectedID.length === 0) {
                ToasterSevice.showWarning('HRM_Common_Message_NonDataHandle');
                return;
            }

            SalWaitApprovePaymentCostRegisterBusiness.confirmReject(selectedID);
        }
    },

    confirmReject: objValid => {
        let actionCancel = _rowActions.find(item => item.Type === enumName.E_REJECT),
            isConfirm = actionCancel[enumName.E_Confirm];

        if (isConfirm) {
            let isInputText = isConfirm[enumName.E_isInputText],
                isValidInputText = isConfirm[enumName.E_isValidInputText],
                placeholder = translate('ReasonReject');

            AlertSevice.alert({
                iconType: EnumIcon.E_REJECT,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                message: 'HRM_PortalApp_PleaseInputReasonReject',
                isInputText: isInputText,
                onCancel: () => { },
                onConfirm: reason => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        SalWaitApprovePaymentCostRegisterBusiness.setStatusReject({ _selectedIds: objValid.join(','), reasonReject: reason });
                    }
                }
            });
        } else {
            SalWaitApprovePaymentCostRegisterBusiness.setStatusReject({ _selectedIds: objValid.join(',') });
        }
    },

    setStatusReject: objValid => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Sal_GetData/SetRejecPaymentCostRegisterInPortal', {
            ...objValid
        }).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res) {

                    if (res?.Success) {
                        ToasterSevice.showSuccess('Hrm_Succeed', 5000);
                        _this.reload('E_KEEP_FILTER');
                        // set true để refresh AttApprovedLeaveDay
                        SalWaitApprovePaymentCostRegisterBusiness.checkForReLoadScreen[ScreenName.SalApprovedPaymentCostRegister] = true;

                        // Đếm lại con số ở Dashboard
                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                        // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                        if (!_isOnScreenNotification) DrawerServices.navigate('SalWaitApprovePaymentCostRegister');
                    } else {
                        ToasterSevice.showWarning(res.Message, 5000);
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
    },
    //#endregion

    //#region [action approve]

    businessApproveRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 5000);
        } else {
            let selectedID = [];

            items.forEach(item => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf('E_APPROVE') > -1) {
                    selectedID.push(item.ID);
                }
            });

            if (selectedID.length === 0) {
                ToasterSevice.showWarning('HRM_Common_Message_NonDataHandle');
                return;
            }

            SalWaitApprovePaymentCostRegisterBusiness.confirmApprove(selectedID, items);
        }
    },

    confirmApprove: (selectedID, allItem) => {
        let actionCancel = _rowActions.find(item => item.Type === enumName.E_APPROVE),
            isConfirm = actionCancel[enumName.E_Confirm];

        if (isConfirm) {
            let isInputText = isConfirm[enumName.E_isInputText],
                isValidInputText = isConfirm[enumName.E_isValidInputText],
                placeholder = translate('ReasonApprove'),
                message = translate('HRM_PortalApp_Message_ApproveConfirm');

            message = message.replace('[E_NUMBER]', `${selectedID.length}/${allItem.length}`);


            AlertSevice.alert({
                iconType: EnumIcon.E_APPROVE,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                message: message,
                isInputText: isInputText,
                onCancel: () => { },
                onConfirm: reason => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        SalWaitApprovePaymentCostRegisterBusiness.setStatusApprove(selectedID);
                    }
                }
            });
        } else {
            SalWaitApprovePaymentCostRegisterBusiness.setStatusApprove(selectedID);
        }
    },

    setStatusApprove: (selectedID) => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Sal_GetData/SetApprovePaymentCostRegisterInPortal', {
            _selectedIds: selectedID
        }).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res) {

                    if (res?.Success) {
                        ToasterSevice.showSuccess('Hrm_Succeed', 5000);
                        _this.reload('E_KEEP_FILTER');
                        // set true để refresh AttApprovedLeaveDay
                        SalWaitApprovePaymentCostRegisterBusiness.checkForReLoadScreen[ScreenName.SalApprovedPaymentCostRegister] = true;

                        // Đếm lại con số ở Dashboard
                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                        // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                        if (!_isOnScreenNotification) DrawerServices.navigate('SalWaitApprovePaymentCostRegister');
                    } else {
                        ToasterSevice.showWarning(res.Message, 5000);
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
    },
    //#endregion

    // #region kiểm tra chi phí
    handleFeeCheck: (item) => {
        if (!item?.RequestPeriod) {

            // không được bỏ trống!
            ToasterSevice.showWarning('[Kỳ yêu cầu] không được bỏ trống!');
            return;
        }

        try {
            let params = {
                CodeEmp: null,
                RequestPeriod: item?.RequestPeriod,
                RequestPeriodName: item?.RequestPeriodName,
                PaymentPeriod: null,
                page: 1,
                pageSize: 20
            };

            DrawerServices.navigate('SalFeeCheck', params);

        } catch (error) {
            VnrLoadingSevices.hide();
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }

    }
    //#endregion
};
