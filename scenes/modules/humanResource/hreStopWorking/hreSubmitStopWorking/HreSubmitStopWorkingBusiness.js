import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../../utils/HttpService';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumIcon } from '../../../../../assets/constant';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumStatus } from '../../../../../assets/constant';

const enumName = EnumName,
    hreSubmitStopWorking = ScreenName.HreSubmitStopWorking,
    hreSubmitStopWorkingAddOrEdit = ScreenName.HreSubmitStopWorkingAddOrEdit;

let _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];
    const permission = PermissionForAppMobile.value;

    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[hreSubmitStopWorking],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_MODIFY, E_ResourceName, E_Name, E_Rule, E_SENDMAIL, E_DELETE } = enumName;

        const actionEdit = businessAction ? businessAction.find((action) => action.Type === E_MODIFY) : null,
            actionEditResource = actionEdit ? actionEdit[E_ResourceName][E_Name] : null,
            actionEditRule = actionEdit ? actionEdit[E_ResourceName][E_Rule] : null,
            actionEditPer =
                actionEditResource && actionEditRule ? permission[actionEditResource][actionEditRule] : null;

        if (actionEditPer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_Common_Modify'),
                    type: E_MODIFY,
                    onPress: (item, dataBody) =>
                        HreSubmitStopWorkingBusinessFunction.businessModifyRecord({ ...item }, dataBody),
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
                    title: translate('HRM_Common_SendMail'),
                    type: E_SENDMAIL,
                    onPress: (item, dataBody) =>
                        HreSubmitStopWorkingBusinessFunction.businessSendMailRecords([{ ...item }], dataBody),
                    ...actionSendMail
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_SendMail'),
                    type: E_SENDMAIL,
                    onPress: (items, dataBody) =>
                        HreSubmitStopWorkingBusinessFunction.businessSendMailRecords(items, dataBody),
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
                        HreSubmitStopWorkingBusinessFunction.businessDeleteRecords([{ ...item }], dataBody),
                    ...actionDelete
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Delete'),
                    type: E_DELETE,
                    onPress: (item, dataBody) =>
                        HreSubmitStopWorkingBusinessFunction.businessDeleteRecords(item, dataBody),
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
        //             onPress: (item, dataBody, isShowMultiRecord) => HreSubmitStopWorkingBusinessFunction.businessCancelRecords([{ ...item }], dataBody, isShowMultiRecord),
        //             ...actionCancel
        //         }
        //     ];

        //     _selected = [
        //         ..._selected,
        //         {
        //             title: translate('HRM_Common_Cancel'),
        //             type: E_CANCEL,
        //             onPress: (item, dataBody, isShowMultiRecord) => HreSubmitStopWorkingBusinessFunction.businessCancelRecords(item, dataBody, isShowMultiRecord),
        //             ...actionCancel
        //         }
        //     ]
        // }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const HreSubmitStopWorkingBusinessFunction = {
    setThisForBusiness: (dataThis) => {
        _this = dataThis;
    },
    //#region [action delete]
    businessDeleteRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            // task lộc trời: 0165848
            // let selectedID = items.map(item => {
            //     return item.ID;
            // });

            // debugger
            // VnrLoadingSevices.show();
            // HttpService.Post('[URI_HR]/Hre_GetData/BusinessAllowActionDelete', {
            //     selectedID,
            //     screenName: hreSubmitStopWorking,
            //     dataBody: dataBody ? JSON.stringify(dataBody) : ''
            // })
            //     .then(res => {
            //         console.log(res, 'res');
            //         debugger
            //         VnrLoadingSevices.hide();
            //         try {
            //             if (res && typeof res === enumName.E_object) {

            //                 let isValid = res.isValid;

            //                 //dữ liệu hợp lệ => gọi hàm confirm Xóa
            //                 if (isValid) {
            //                     HreSubmitStopWorkingBusinessFunction.confirmDelete(res);
            //                 }
            //                 //không hợp lệ
            //                 else if (isValid == false && res.message && typeof res.message === enumName.E_string) {
            //                     ToasterSevice.showWarning(res.message, 4000);
            //                 }
            //                 //FAIL
            //                 else {
            //                     ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
            //                 }
            //             }
            //             //FAIL
            //             else {
            //                 ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
            //             }
            //         } catch (error) {
            //             DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            //         }
            //     })

            // task lộc trời: 0165848
            let selectedID = [];
            items.forEach((item) => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_DELETE) > -1) {
                    selectedID.push(item.ID);
                }
            });

            // task lộc trời: 0165848
            if (selectedID.length == 0) {
                ToasterSevice.showWarning('HRM_Common_DataInStatus_CannotDelete', 4000);
                return;
            } else {
                HreSubmitStopWorkingBusinessFunction.confirmDelete({
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

        let actionCancel = _rowActions.find((item) => item.Type === E_DELETE),
            isConfirm = actionCancel[E_Confirm];

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
                        HreSubmitStopWorkingBusinessFunction.setIsDelete({ Ids: strId, reason });
                    }
                }
            });
        } else {
            let strId = objValid.strResultID;
            HreSubmitStopWorkingBusinessFunction.setIsDelete({ Ids: strId });
        }
    },

    setIsDelete: (objValid) => {
        VnrLoadingSevices.show();
        // task lộc trời: 0165848
        let selectedIds = objValid.Ids && Array.isArray(objValid.Ids) ? objValid.Ids.join('') : objValid.Ids,
            reason = objValid.reason;
        HttpService.Post('[URI_HR]/Hre_GetDataV2/RemoveSelected_SubmitStopWorking', {
            selectedIds,
            reason
        }).then((res) => {
            VnrLoadingSevices.hide();
            try {
                if (res && res !== '') {
                    if (res == enumName.E_Success) {
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        _this.reload('E_KEEP_FILTER', true);
                    } else if (res == enumName.E_Locked) {
                        ToasterSevice.showWarning('Hrm_Locked', 4000);
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
    },
    //#endregion

    //#region [action send mail]
    businessSendMailRecords: (items, dataBody) => {
        if ((items.length === 0 && !dataBody) || (items.length > 1 && !dataBody)) {
            ToasterSevice.showWarning('HRM_Hre_PersonalSubmitStopWorking_OnlySelect_SendMail', 4000);
        } else {
            let selectedID = items[0].BusinessAllowAction.indexOf('E_SENDMAIL') > -1 ? [items[0].ID] : [];
            if (selectedID.length > 0 && selectedID.length === items.length) {
                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Hre_GetData/BusinessAllowActionSendEmail', {
                    selectedID,
                    screenName: hreSubmitStopWorking,
                    dataBody: dataBody ? JSON.stringify(dataBody) : ''
                }).then((res) => {
                    VnrLoadingSevices.hide();
                    try {
                        if (res && typeof res === enumName.E_object) {
                            let isValid = res.isValid;
                            if (isValid == true) {
                                HreSubmitStopWorkingBusinessFunction.confirmSendMail(res);
                            } else if (isValid == false && res.message && typeof res.message === enumName.E_string) {
                                ToasterSevice.showWarning(res.message, 4000);
                            } else {
                                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                            }
                        } else {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                        }
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });
            } else {
                ToasterSevice.showWarning('HRM_Hre_PersonalSubmitStopWorking_StatusSendMail_Accept', 4000);
            }
        }
    },

    confirmSendMail: (objValid) => {
        const { E_SENDMAIL, E_isInputText, E_isValidInputText, E_string } = enumName;

        let actionCancel = _rowActions.find((item) => item.Type === E_SENDMAIL),
            isConfirm = actionCancel[enumName.E_Confirm];

        if (isConfirm) {
            let isInputText = isConfirm[E_isInputText],
                isValidInputText = isConfirm[E_isValidInputText],
                message = objValid.message && typeof objValid.message === E_string ? objValid.message : null,
                placeholder = translate('Reason');

            AlertSevice.alert({
                iconType: EnumIcon.E_SENDMAIL,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                isInputText: isInputText,
                message: message,
                onCancel: () => {},
                onConfirm: (reason) => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        const { apiConfig } = dataVnrStorage,
                            _uriMain = apiConfig ? apiConfig.uriMain : null;

                        VnrLoadingSevices.show();

                        HttpService.Post('[URI_HR]/Hre_GetData/ProcessingSendMailStopWorking', {
                            host: _uriMain,
                            selectedIds: objValid.strResultID,
                            reason
                        }).then((res) => {
                            VnrLoadingSevices.hide();
                            try {
                                if (res && res.success) {
                                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                                    _this.reload('E_KEEP_FILTER');
                                } else if (typeof res === 'string') {
                                    ToasterSevice.showError(res, 4000);
                                } else {
                                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                }
                            } catch (error) {
                                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                            }
                        });
                    }
                }
            });
        } else {
            const { apiConfig } = dataVnrStorage,
                _uriMain = apiConfig ? apiConfig.uriMain : null;

            VnrLoadingSevices.show();

            HttpService.Post('[URI_HR]/Hre_GetData/ProcessingSendMailStopWorking', {
                host: _uriMain,
                selectedIds: objValid.strResultID
            }).then((res) => {
                VnrLoadingSevices.hide();
                try {
                    if (res && res.success) {
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        _this.reload('E_KEEP_FILTER');
                    } else if (typeof res === 'string') {
                        ToasterSevice.showError(res, 4000);
                    } else {
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        }
    },
    //#endregion

    //#region [modify]
    businessModifyRecord: (item) => {
        const { reload } = _this;
        _this.props.navigation.navigate(hreSubmitStopWorkingAddOrEdit, { record: item, reload });

        //view detail hoặc chọn 1 dòng từ lưới
        // VnrLoadingSevices.show();
        // HttpService.Post(`[URI_HR]/Att_GetData/GetOvertimeById`, { id: item.ID, screenName: 'AttSubmitOvertime' })
        //     .then(res => {
        //         VnrLoadingSevices.hide();
        //         try {

        //             if (res && res.BusinessAllowAction && res.BusinessAllowAction.indexOf('E_MODIFY') >= 0) {

        //                 const { reload } = _this;
        //                 _this.props.navigation.navigate(hreSubmitStopWorkingAddOrEdit, { record: item, reload });
        //             }
        //             else {
        //                 ToasterSevice.showWarning('StatusNotAction');
        //             }

        //         } catch (error) {
        //             DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        //         }
        //     });
    }
    //#endregion
};
