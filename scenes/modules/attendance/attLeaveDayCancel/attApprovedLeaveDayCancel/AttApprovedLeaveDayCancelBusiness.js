import { ConfigList } from '../../../../../assets/configProject/ConfigList';

let _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];

    if (ConfigList.value != null && ConfigList.value != undefined) {
        // const _configList = ConfigList.value[attApprovedLeaveDayCancel],
        //     businessAction = _configList[enumName.E_BusinessAction],
        //     { E_ResourceName, E_Name, E_Rule, E_CANCEL } = enumName;

        // //action cancel
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
        //             onPress: (item, dataBody) => AttApprovedLeaveDayCancelBusinessFunction.businessCancelRecords([{ ...item }], dataBody),
        //             ...actionCancel
        //         }
        //     ];

        //     _selected = [
        //         {
        //             title: translate('HRM_Common_Cancel'),
        //             type: E_CANCEL,
        //             onPress: (items, dataBody) => AttApprovedLeaveDayCancelBusinessFunction.businessCancelRecords(items, dataBody),
        //             ...actionCancel
        //         }
        //     ]
        // }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const AttApprovedLeaveDayCancelBusinessFunction = {
    setThisForBusiness: () => {

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
    //             screenName: attApprovedLeaveDayCancel,
    //             dataBody: dataBody ? JSON.stringify(dataBody) : ''
    //         })
    //             .then(res => {
    //                 VnrLoadingSevices.hide();

    //                 try {
    //                     if (res && typeof res === enumName.E_object) {

    //                         let isValid = res.isValid;

    //                         //dữ liệu hợp lệ => gọi hàm confirm Hủy
    //                         if (isValid) {
    //                             AttApprovedLeaveDayCancelBusinessFunction.confirmCancel(res);
    //                         }
    //                         //không hợp lệ
    //                         else if (isValid == false && res.message && typeof res.message === enumName.E_string) {
    //                             ToasterSevice.showWarning(res.message, 4000);
    //                         }
    //                         //FAIL
    //                         else {
    //                             ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
    //                         }
    //                     }
    //                     //FAIL
    //                     else {
    //                         ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
    //                     }
    //                 } catch (error) {
    //                     DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
    //                 }
    //             })
    //     }
    // },

    // confirmCancel: (objValid) => {

    //     let actionCancel = _rowActions.find(item => item.Type === enumName.E_CANCEL),
    //         isConfirm = actionCancel[enumName.E_Confirm];

    //     if (isConfirm) {

    //         let isInputText = isConfirm[enumName.E_isInputText],
    //             isValidInputText = isConfirm[enumName.E_isValidInputText],
    //             message = (objValid.message && typeof objValid.message === enumName.E_string) ? objValid.message : null,
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

    //                     //check khung giờ cho Phổ Đình
    //                     let strId = objValid.strResultID;
    //                     AttApprovedLeaveDayCancelBusinessFunction.setStatusCancel({ Ids: strId, reason });
    //                 }
    //             }
    //         })
    //     }
    //     else {

    //         //check khung giờ cho Phổ Đình
    //         let strId = objValid.strResultID;
    //         AttApprovedLeaveDayCancelBusinessFunction.setStatusCancel({ Ids: strId });
    //     }
    // },

    // setStatusCancel: (objValid) => {

    //     let selectedIds = objValid.Ids.split(','),
    //         CommentCancel = objValid.reason;

    //     VnrLoadingSevices.show();
    //     HttpService.Post('[URI_HR]/Att_GetData/ProcessCancelLeavedayPoral', {
    //         selectedIds,
    //         CommentCancel
    //     })
    //         .then(res => {

    //             VnrLoadingSevices.hide();
    //             try {
    //                 if (res && res !== '') {
    //                     if (res == enumName.E_Success) {
    //                         ToasterSevice.showSuccess("Hrm_Succeed", 5000);
    //                         NotificationsService.getListUserPushNotify();
    //                         _this.reload('E_KEEP_FILTER');
    //                     }
    //                     else if (res == enumName.E_Locked) {
    //                         ToasterSevice.showWarning('Hrm_Locked', 5000);
    //                     }
    //                     else {
    //                         ToasterSevice.showWarning(res, 5000);
    //                     }
    //                 }
    //                 else {
    //                     ToasterSevice.showError("HRM_Common_SendRequest_Error", 5000);
    //                 }
    //             } catch (error) {
    //                 DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
    //             }
    //         })

    // }
    //#endregion
};
