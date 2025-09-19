import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../../utils/HttpService';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { EnumName, EnumIcon, EnumStatus, ScreenName } from '../../../../../assets/constant';
import DrawerServices from '../../../../../utils/DrawerServices';
import { Colors } from '../../../../../constants/styleConfig';

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
            { E_ResourceName, E_Name, E_Rule, E_CANCEL, E_STOP_POSTING, E_EXPIRE, E_REPOST, E_POSTPONE } = enumName;

        const actionApprove = businessAction ? businessAction.find(action => action.Type === E_REPOST) : null,
            actionApproveResource = actionApprove ? actionApprove[E_ResourceName][E_Name] : null,
            actionApproveRule = actionApprove ? actionApprove[E_ResourceName][E_Rule] : null,
            actionApprovePer =
                actionApproveResource && actionApproveRule
                    ? permission[actionApproveResource][actionApproveRule]
                    : null;

        if (actionApprovePer) {
            _rowActions = [
                {
                    title: translate('HRM_PortalApp_RePost'),
                    type: E_REPOST,
                    onPress: (item, dataBody) =>
                        HreJobPostingBusiness.businessConfirmRecords(
                            Array.isArray(item) ? item : [{ ...item }],
                            dataBody
                        ),
                    ...actionApprove
                }
            ];

            _selected = [
                {
                    title: translate('HRM_PortalApp_RePost'),
                    type: E_REPOST,
                    onPress: (item, dataBody) =>
                        HreJobPostingBusiness.businessConfirmRecords(item, dataBody),
                    ...actionApprove
                }
            ];
        }

        const actionReject = businessAction ? businessAction.find(action => action.Type === E_STOP_POSTING) : null,
            actionRejectResource = actionReject ? actionReject[E_ResourceName][E_Name] : null,
            actionRejectRule = actionReject ? actionReject[E_ResourceName][E_Rule] : null,
            actionRejectPer =
                actionRejectResource && actionRejectRule ? permission[actionRejectResource][actionRejectRule] : null;

        if (actionRejectPer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_PortalApp_StopPost'),
                    type: E_STOP_POSTING,
                    onPress: (item, dataBody) =>
                        HreJobPostingBusiness.businessStopPosting(
                            Array.isArray(item) ? item : [{ ...item }],
                            dataBody
                        ),
                    ...actionReject
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_PortalApp_StopPost'),
                    type: E_STOP_POSTING,
                    onPress: (item, dataBody) =>
                        HreJobPostingBusiness.businessStopPosting(item, dataBody),
                    ...actionReject
                }
            ];
        }

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
                        HreJobPostingBusiness.businessCancelRecords(
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
                    onPress: (items, dataBody) =>
                        HreJobPostingBusiness.businessCancelRecords(items, dataBody),
                    ...actionCancel
                }
            ];
        }

        //action request change
        const actionRequestChange = businessAction
                ? businessAction.find((action) => action.Type === E_EXPIRE)
                : null,
            actionRequestChangeResource = actionRequestChange ? actionRequestChange[E_ResourceName][E_Name] : null,
            actionRequestChangeRule = actionRequestChange ? actionRequestChange[E_ResourceName][E_Rule] : null,
            actionRequestChangePer =
                actionRequestChangeResource && actionRequestChangeRule
                    ? permission[actionRequestChangeResource][actionRequestChangeRule]
                    : null;

        if (actionRequestChangePer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_PortalApp_Extend'),
                    type: E_EXPIRE,
                    onPress: (item, dataBody) =>
                        HreJobPostingBusiness.businessExpire(
                            Array.isArray(item) ? item : [{ ...item }],
                            dataBody
                        ),
                    ...actionRequestChange
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_PortalApp_Extend'),
                    type: E_EXPIRE,
                    onPress: (items, dataBody) =>
                        HreJobPostingBusiness.businessExpire(items, dataBody),
                    ...actionRequestChange
                }
            ];
        }

        //action request change
        const actionPostPone = businessAction
                ? businessAction.find((action) => action.Type === E_POSTPONE)
                : null,
            actionPostPoneResource = actionPostPone ? actionPostPone[E_ResourceName][E_Name] : null,
            actionPostPoneRule = actionPostPone ? actionPostPone[E_ResourceName][E_Rule] : null,
            actionPostPonePer =
                actionPostPoneResource && actionPostPoneRule
                    ? permission[actionPostPoneResource][actionPostPoneRule]
                    : null;


        if (actionPostPonePer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_PortalApp_PostponeEffectiveDate'),
                    type: E_POSTPONE,
                    onPress: (item, dataBody) =>
                        HreJobPostingBusiness.businessPostpone(
                            Array.isArray(item) ? item : [{ ...item }],
                            dataBody
                        ),
                    ...actionPostPone
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_PortalApp_PostponeEffectiveDate'),
                    type: E_POSTPONE,
                    onPress: (items, dataBody) =>
                        HreJobPostingBusiness.businessPostpone(items, dataBody),
                    ...actionPostPone
                }
            ];
        }

        return { rowActions: _rowActions, selected: _selected };
    }
};

export const HreJobPostingBusiness = {
    // Đối tượng checkForReLoadScreen để check có refresh HrePendingApproveRecruitmentProposal không
    checkForReLoadScreen: {
        HreProcesedApproveRecruitmentProposal: false,
        HrePendingApproveRecruitmentProposal: false
    },
    setThisForBusiness: (dataThis) => {
        _this = dataThis;
    },
    checkRequireNote: async (field) => {
        try {
            const res = await HttpService.Get(
                '[URI_CENTER]/api/Att_GetData/GetConfigNoteValidate?business=E_OVERTIMEPLAN'
            );

            if (res.Status === enumName.E_SUCCESS) {
                if (res && res.Data && res.Data[field]) {
                    return true;
                }
            }
            return false;
        } catch (error) {
            return false;
        }
    },
    //#region [action confirm]
    businessConfirmRecords: (items, dataBody) => {

        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 5000);
        } else {
            let arrValid = [];

            items.map(item => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_REPOST) > -1) {
                    arrValid.push(item.ID);
                }
            });

            if (arrValid.length > 0) {
                if (typeof _this?.onShow === 'function')
                    _this?.onShow('E_REPOST', { ListRecordID: arrValid }, items.length > 1 ? null : items[0])
            } else {
                ToasterSevice.showWarning('HRM_Common_Message_NonDataHandle');
            }
        }
    },
    //#endregion

    //#region [action stop posting]
    businessStopPosting: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 5000);
        } else {
            let arrValid = [];

            items.map(item => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_STOP_POSTING) > -1) {
                    arrValid.push(item.ID);
                }
            });

            if (arrValid.length > 0) {
                AlertSevice.alert({
                    title: 'HRM_PortalApp_Confirmation',
                    iconType: EnumIcon.E_WARNING,
                    placeholder: 'placeholder',
                    isValidInputText: false,
                    message: 'HRM_PortalApp_YouWantToStopPosting',
                    isInputText: false,
                    textRightButton: 'HRM_PortalApp_Agree_OK',
                    colorRightButton: Colors.blue,
                    onCancel: () => { },
                    onConfirm: () => {
                        HreJobPostingBusiness.setStopPosting({
                            'ActionType': 'E_STOP',
                            'ListRecordID': arrValid
                        })
                    }
                });
            } else {
                ToasterSevice.showWarning('HRM_Common_Message_NonDataHandle');
            }
        }
    },

    setStopPosting: (objValid) => {
        try {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_CENTER]/api/Rec_ComposePostingDetail/ComposePostingDetaiAction', { ...objValid }).then((res) => {
                VnrLoadingSevices.hide();
                if (res && res.Status == EnumName.E_SUCCESS) {
                    ToasterSevice.showSuccess(res.Message, 4000);
                    HreJobPostingBusiness.checkForReLoadScreen[
                        ScreenName.HreStopJobPosting
                    ] = true;
                    _this.reload('E_KEEP_FILTER', true);
                } else if (res && res.Message && typeof res.Message == 'string') {
                    ToasterSevice.showError(res.Message, 4000);
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                }
            })
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    },

    //#endregion

    //#region [action EXPIRE]
    businessExpire: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let arrValid = [];

            items.map(item => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_EXPIRE) > -1) {
                    arrValid.push(item.ID);
                }
            });

            if (arrValid.length > 0) {
                if (typeof _this?.onShow === 'function')
                    _this?.onShow('E_EXPIRE', { ListRecordID: arrValid }, items.length > 1 ? null : items[0])
            } else {
                ToasterSevice.showWarning('HRM_Common_Message_NonDataHandle');
            }
        }
    },
    //#endregion

    //#region [action POSTPONE]
    businessPostpone: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let arrValid = [];

            items.map(item => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_POSTPONE) > -1) {
                    arrValid.push(item.ID);
                }
            });

            if (arrValid.length > 0) {
                if (typeof _this?.onShow === 'function')
                    _this?.onShow('E_POSTPONE', { 
                        ListRecordID: arrValid, 
                        message: translate('HRM_PortalApp_Rec_JobPosting_PostponeMessageConfirm').replace(
                        '[E_NUMBER]',
                        `${arrValid.length}/${items.length}`
                        )
                    }, items.length > 1 ? null : items[0])
            } else {
                ToasterSevice.showWarning('HRM_Common_Message_NonDataHandle');
            }
        }
    }
    //#endregion
};
