/* eslint-disable no-unused-vars */
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName } from '../../../../../assets/constant';

let enumName = EnumName,
    evaSubmitManager = ScreenName.EvaSubmitManager,
    _isOnScreenNotification = false,
    _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];
    // const permission = PermissionForAppMobile.value;

    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[evaSubmitManager],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_ResourceName, E_Name, E_Rule, E_APPROVE, E_REJECT, E_CANCEL } = enumName;

        // const actionApprove = businessAction ? businessAction.find(action => action.Type === E_APPROVE) : null,
        //     actionApproveResource = actionApprove ? actionApprove[E_ResourceName][E_Name] : null,
        //     actionApproveRule = actionApprove ? actionApprove[E_ResourceName][E_Rule] : null,
        //     actionApprovePer = (actionApproveResource && actionApproveRule)
        //         ? permission[actionApproveResource][actionApproveRule] : null;

        // if (actionApprovePer) {
        //     _rowActions = [
        //         {
        //             title: translate('HRM_Common_Approve'),
        //             type: E_APPROVE,
        //             onPress: (item, dataBody) => EvaSubmitManagerBusinessFunction.businessApproveRecords([{ ...item }], dataBody),
        //             ...actionApprove
        //         }
        //     ];

        //     _selected = [
        //         {
        //             title: translate('HRM_Common_Approve'),
        //             type: E_APPROVE,
        //             onPress: (item, dataBody) => EvaSubmitManagerBusinessFunction.businessApproveRecords(item, dataBody),
        //             ...actionApprove
        //         }
        //     ]
        // }

        // const actionReject = businessAction ? businessAction.find(action => action.Type === E_REJECT) : null,
        //     actionRejectResource = actionReject ? actionReject[E_ResourceName][E_Name] : null,
        //     actionRejectRule = actionReject ? actionReject[E_ResourceName][E_Rule] : null,
        //     actionRejectPer = (actionRejectResource && actionRejectRule)
        //         ? permission[actionRejectResource][actionRejectRule] : null;

        // if (actionRejectPer) {
        //     _rowActions = [
        //         ..._rowActions,
        //         {
        //             title: translate('HRM_Common_Reject'),
        //             type: E_REJECT,
        //             onPress: (item, dataBody) => EvaSubmitManagerBusinessFunction.businessRejectRecords([{ ...item }], dataBody),
        //             ...actionReject
        //         }
        //     ];

        //     _selected = [
        //         ..._selected,
        //         {
        //             title: translate('HRM_Common_Reject'),
        //             type: E_REJECT,
        //             onPress: (item, dataBody) => EvaSubmitManagerBusinessFunction.businessRejectRecords(item, dataBody),
        //             ...actionReject
        //         }
        //     ]
        // }

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
        //             onPress: (item, dataBody) => EvaSubmitManagerBusinessFunction.businessCancelRecords([{ ...item }], dataBody),
        //             ...actionCancel
        //         }
        //     ];

        //     _selected = [
        //         ..._selected,
        //         {
        //             title: translate('HRM_Common_Cancel'),
        //             type: E_CANCEL,
        //             onPress: (items, dataBody) => EvaSubmitManagerBusinessFunction.businessCancelRecords(items, dataBody),
        //             ...actionCancel
        //         }
        //     ]
        // }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const EvaSubmitManagerBusinessFunction = {
    // Đối tượng checkForReLoadScreen để check có refresh ListApprovedStopWorking không
    checkForReLoadScreen: {
        [ScreenName.EvaSubmitManager]: false
    },
    setThisForBusiness: (dataThis, isNotification) => {
        if (isNotification) _isOnScreenNotification = true;
        else _isOnScreenNotification = false;

        _this = dataThis;
    }
};

export default {
    generateRowActionAndSelected: generateRowActionAndSelected,
    EvaSubmitManagerBusinessFunction: EvaSubmitManagerBusinessFunction
};
