/* eslint-disable no-unused-vars */
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumIcon } from '../../../../../assets/constant';

let enumName = EnumName,
    hreApprovedEvaluationDoc = ScreenName.HreApprovedEvaluationDoc,
    apiConfig = null,
    headers = null;

let _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];
    apiConfig = dataVnrStorage.apiConfig;
    headers = dataVnrStorage.currentUser.headers;

    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[hreApprovedEvaluationDoc],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_ResourceName, E_Name, E_Rule, E_CANCEL } = enumName;

        //action cancel
        // const actionCancel = businessAction ? businessAction.find(action => action.Type === E_CANCEL) : null,
        //     actionCancelResource = actionCancel ? actionCancel[E_ResourceName][E_Name] : null,
        //     actionCancelRule = actionCancel ? actionCancel[E_ResourceName][E_Rule] : null,
        //     actionCancelPer = (actionCancelResource && actionCancelRule)
        //         ? permission[actionCancelResource][actionCancelRule] : null;

        // if (actionCancelPer) {
        //     _rowActions = [
        //         {
        //             title: translate('HRM_Common_Cancel'),
        //             type: E_CANCEL,
        //             onPress: (item, dataBody) => {
        //                 if (Array.isArray(item) && item.length > 0) {
        //                     HreApprovedEvaluationDocBusinessFunction.businessCancelRecords(item, dataBody)
        //                 }
        //                 else {
        //                     HreApprovedEvaluationDocBusinessFunction.businessCancelRecords([{ ...item }], dataBody)
        //                 }
        //             },
        //             ...actionCancel
        //         }
        //     ];

        //     _selected = [
        //         {
        //             title: translate('HRM_Common_Cancel'),
        //             type: E_CANCEL,
        //             onPress: (items, dataBody) => HreApprovedEvaluationDocBusinessFunction.businessCancelRecords(items, dataBody),
        //             ...actionCancel
        //         }
        //     ]
        // }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const HreApprovedEvaluationDocBusinessFunction = {
    setThisForBusiness: (dataThis) => {
        _this = dataThis;
    }
    //#region [action cancel]

    // businessCancelRecords: (items, dataBody) => {

    //     if (items.length === 0 && !dataBody) {
    //         ToasterSevice.showWarning("HRM_Common_Select", 4000);
    //     }
    //     else {
    //         let selectedID = items.map(item => {
    //             return item.ID;
    //         });

    //         VnrLoadingSevices.show();
    //         HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionCancel', {
    //             selectedID,
    //             screenName: hreApprovedEvaluationDoc,
    //             dataBody: dataBody ? JSON.stringify(dataBody) : ''
    //         })
    //             .then(res => {
    //                 VnrLoadingSevices.hide();

    //                 try {
    //                     if (res && typeof res === 'object') {
    //                         let isValid = res.isValid;
    //                         if (isValid) {
    //                             HreApprovedEvaluationDocBusinessFunction.confirmCancel(res);
    //                             VnrLoadingSevices.hide();
    //                         }
    //                         else if (isValid == false && res.message && typeof res.message === 'string') {
    //                             ToasterSevice.showWarning(res.message, 4000);
    //                             VnrLoadingSevices.hide();
    //                         }
    //                         else {
    //                             ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
    //                             VnrLoadingSevices.hide();
    //                         }
    //                     }
    //                     else {
    //                         ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
    //                         VnrLoadingSevices.hide();
    //                     }
    //                 } catch (error) {
    //                     DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
    //                 }
    //             })
    //     }
    // },

    // confirmCancel: (objValid) => {

    //     let actionCancel = _rowActions.find(item => item.Type === 'E_CANCEL'),
    //         isConfirm = actionCancel['Confirm'];

    //     if (isConfirm) {

    //         let isInputText = isConfirm['isInputText'],
    //             isValidInputText = isConfirm['isValidInputText'],
    //             message = (objValid.message && typeof objValid.message === 'string') ? objValid.message : null,
    //             placeholder = translate('HRM_Common_CommentCancel');

    //         AlertSevice.alert({
    //             iconType: EnumIcon.E_CANCEL,
    //             placeholder: placeholder,
    //             isValidInputText: isValidInputText,
    //             message: message,
    //             isInputText: isInputText,
    //             onCancel: () => { },
    //             onConfirm: (reason) => {
    //                 if (isValidInputText && (!reason || reason === '')) {
    //                     let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
    //                     ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
    //                 }
    //                 else {
    //                     let strId = (objValid.strResultID && typeof objValid.strResultID === 'string') ? objValid.strResultID : '';
    //                     VnrLoadingSevices.show();
    //                     HttpService.Post('[URI_HR]/Att_GetData/ChangeStatusCancelShiftSubstitutionPortal', {
    //                         selectedIds: strId,
    //                         commentCancel: reason
    //                     })
    //                         .then(res => {
    //                             VnrLoadingSevices.hide();
    //                             try {
    //                                 if (res && res !== '') {
    //                                     if (res == 'Success') {
    //                                         ToasterSevice.showSuccess("Hrm_Succeed", 5000);
    //                                         NotificationsService.getListUserPushNotify();
    //                                         _this.reload('E_KEEP_FILTER')
    //                                     }
    //                                     else if (res == "Locked") {
    //                                         ToasterSevice.showWarning('Hrm_Locked', 5000);
    //                                     }
    //                                     else {
    //                                         ToasterSevice.showWarning(res, 5000);
    //                                     }
    //                                 }
    //                                 else {
    //                                     ToasterSevice.showError("HRM_Common_SendRequest_Error", 5000);
    //                                 }
    //                             } catch (error) {
    //                                 DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
    //                             }
    //                         })
    //                 }
    //             }
    //         })
    //     }
    //     else {
    //         let strId = (objValid.strResultID && typeof objValid.strResultID === 'string') ? objValid.strResultID : '';
    //         VnrLoadingSevices.show();
    //         HttpService.Post('[URI_HR]/Att_GetData/ChangeStatusCancelShiftSubstitutionPortal', {
    //             selectedIds: strId
    //         })
    //             .then(res => {
    //                 VnrLoadingSevices.hide();

    //                 try {
    //                     if (res && res !== '') {
    //                         if (res == 'Success') {
    //                             ToasterSevice.showSuccess("Hrm_Succeed", 5000);
    //                             NotificationsService.getListUserPushNotify();
    //                             _this.reload('E_KEEP_FILTER')
    //                         }
    //                         else if (res == "Locked") {
    //                             ToasterSevice.showWarning('Hrm_Locked', 5000);
    //                         }
    //                         else {
    //                             ToasterSevice.showWarning(res, 5000);
    //                         }
    //                     }
    //                     else {
    //                         ToasterSevice.showError("HRM_Common_SendRequest_Error", 5000);
    //                     }
    //                 } catch (error) {
    //                     DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
    //                 }
    //             })
    //     }
    // }
    //#endregion
};
