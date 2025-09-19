import { ToasterSevice } from '../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../utils/HttpService';
import { translate } from '../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../assets/configProject/PermissionForAppMobile';
import { ConfigList } from '../../../../assets/configProject/ConfigList';
import { EnumName, EnumStatus } from '../../../../assets/constant';
//import { DebugInstructions } from 'react-native/Libraries/NewAppScreen';

let enumName = EnumName;

let _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = screenName => {
    _rowActions = [];
    _selected = [];

    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[screenName],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_ResourceName, E_Name, E_Rule, E_APPROVE } = enumName;

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
                    title: translate('HRM_Common_Confirm'),
                    type: E_APPROVE,
                    onPress: (item, dataBody) =>
                        AttLeaveDayReplacementBusiness.businessApproveRecords(
                            Array.isArray(item) ? item : [{ ...item }],
                            dataBody
                        ),
                    ...actionApprove
                }
            ];

            _selected = [
                {
                    title: translate('HRM_Common_Confirm'),
                    type: E_APPROVE,
                    onPress: (item, dataBody) =>
                        AttLeaveDayReplacementBusiness.businessApproveRecords(item, dataBody),
                    ...actionApprove
                }
            ];
        }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const AttLeaveDayReplacementBusiness = {
    // Đối tượng checkForReLoadScreen để check có refresh AttWaitConfirmLeaveDayReplacement không
    checkForReLoadScreen: {
        AttConfirmedLeaveDayReplacement: false,
        AttWaitConfirmLeaveDayReplacement: false
    },
    setThisForBusiness: (dataThis, rowActionsFromScreen = _rowActions) => {
        _rowActions = rowActionsFromScreen ?? [];
        _this = dataThis;
    },
    //#region [action approve]
    businessApproveRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 5000);
        } else {
            let arrValid = [];

            items.map(item => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_APPROVE) > -1) {
                    arrValid.push({
                        RecordID: item.ID,
                        Comment: '',
                        Type: 'E_APPROVED'
                    });
                }
            });

            if (arrValid.length > 0) {
                let dataBody = {
                        ReplaceManyDays: true
                    },
                    ReplacementItem = [];

                items.map((item) => {
                    ReplacementItem.push({
                        DateEnd: item?.DateEnd,
                        DateStart: item?.DateStart,
                        DurationType: item?.DurationType,
                        LeaveDayID: item?.ID,
                        ProfileID: item?.ProfileID,
                        ShiftID: item?.ShiftID
                    });
                });

                dataBody = {
                    ...dataBody,
                    ReplacementItem
                };

                VnrLoadingSevices.show();
                HttpService.Post('[URI_CENTER]/api/Att_LeaveDay/GetDataReplacement', { ...dataBody })
                    .then(res => {

                        VnrLoadingSevices.hide();
                        if (res && res.Status === 'SUCCESS' && Array.isArray(res.Data)) {
                            _this.onCreate(res.Data);
                        } else if (res && res?.Status === 'FAIL' && !!res?.Message) {
                            ToasterSevice.showWarning(res?.Message);
                        }
                    })
                    .catch(() => {
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                    });
            } else {
                ToasterSevice.showWarning('HRM_Common_Message_NonDataHandle');
            }
        }
    }

};
