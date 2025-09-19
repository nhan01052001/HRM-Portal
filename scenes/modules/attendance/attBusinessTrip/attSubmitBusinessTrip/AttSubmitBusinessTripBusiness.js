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
import moment from 'moment';
import { ModalCheckEmpsSevices } from '../../../../../components/modal/ModalCheckEmps';

const enumName = EnumName,
    attSubmitBusinessTrip = ScreenName.AttSubmitBusinessTrip,
    attSubmitBusinessTripAddOrEdit = ScreenName.AttSubmitBusinessTripAddOrEdit;

let _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];
    const permission = PermissionForAppMobile.value;

    if (ConfigList.value != null && ConfigList.value != undefined) {

        const _configList = ConfigList.value[attSubmitBusinessTrip],
            businessAction = _configList[enumName.E_BusinessAction],
            {
                E_MODIFY,
                E_ResourceName,
                E_Name,
                E_Rule,
                E_SENDMAIL,
                E_DELETE,
                E_CANCEL,
                E_BUSINESSTRIPVIEWCOST,
                E_BUSINESSTRIPADDCOST
            } = enumName;

        const actionEdit = businessAction ? businessAction.find(action => action.Type === E_MODIFY) : null,
            actionEditResource = actionEdit ? actionEdit[E_ResourceName][E_Name] : null,
            actionEditRule = actionEdit ? actionEdit[E_ResourceName][E_Rule] : null, // 'Modify'
            actionEditPer =
                actionEditResource && actionEditRule ? permission[actionEditResource][actionEditRule] : null;

        if (actionEditPer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_System_Resource_Sys_Edit'),
                    type: E_MODIFY,
                    onPress: (item, dataBody) =>
                        AttSubmitBusinessTripBusinessFunction.businessModifyRecord({ ...item }, dataBody),
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
                    title: translate('HRM_Common_SendMail'),
                    type: E_SENDMAIL,
                    onPress: (item, dataBody) =>
                        AttSubmitBusinessTripBusinessFunction.businessSendMailRecords([{ ...item }], dataBody),
                    ...actionSendMail
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_SendMail'),
                    type: E_SENDMAIL,
                    onPress: (items, dataBody) =>
                        AttSubmitBusinessTripBusinessFunction.businessSendMailRecords(items, dataBody),
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
                        AttSubmitBusinessTripBusinessFunction.businessDeleteRecords([{ ...item }], dataBody),
                    ...actionDelete
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Delete'),
                    type: E_DELETE,
                    onPress: (item, dataBody) =>
                        AttSubmitBusinessTripBusinessFunction.businessDeleteRecords(item, dataBody),
                    ...actionDelete
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
                    onPress: (item, dataBody, isShowMultiRecord) =>
                        AttSubmitBusinessTripBusinessFunction.businessCancelRecords(
                            [{ ...item }],
                            dataBody,
                            isShowMultiRecord
                        ),
                    ...actionCancel
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Cancel'),
                    type: E_CANCEL,
                    onPress: (item, dataBody, isShowMultiRecord) =>
                        AttSubmitBusinessTripBusinessFunction.businessCancelRecords(item, dataBody, isShowMultiRecord),
                    ...actionCancel
                }
            ];
        }

        //action Chi tiet phi
        const actionCost = businessAction
                ? businessAction.find(action => action.Type === E_BUSINESSTRIPVIEWCOST)
                : null,
            actionCostResource = actionCost ? actionCost[E_ResourceName][E_Name] : null,
            actionCostRule = actionCost ? actionCost[E_ResourceName][E_Rule] : null,
            actionCostPer =
                actionCostResource && actionCostRule ? permission[actionCostResource][actionCostRule] : null;

        if (actionCostPer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_Common_BusinessTravelCosts_View'),
                    type: E_BUSINESSTRIPVIEWCOST,
                    onPress: (item, dataBody, isShowMultiRecord) =>
                        AttSubmitBusinessTripBusinessFunction.businessDetailCost(item),
                    ...actionCost
                }
            ];
        }

        //action Thêm Chi tiet phi
        // const actionAddCost = businessAction ? businessAction.find(action => action.Type === E_BUSINESSTRIPADDCOST) : null,
        //     actionAddCostResource = actionAddCost ? actionAddCost[E_ResourceName][E_Name] : null,
        //     actionAddCostRule = actionAddCost ? actionAddCost[E_ResourceName][E_Rule] : null,
        //     actionAddCostPer = (actionAddCostResource && actionAddCostRule)
        //         ? permission[actionAddCostResource][actionAddCostRule] : null;

        // if (actionAddCostPer) {
        //     _rowActions = [
        //         ..._rowActions,
        //         {
        //             title: translate('HRM_Common_BusinessTravelCosts_Add'),
        //             type: E_BUSINESSTRIPADDCOST,
        //             onPress: (item, dataBody, isShowMultiRecord) => AttSubmitBusinessTripBusinessFunction.businessAddCost(item),
        //             ...actionCost
        //         }
        //     ];
        // }

        // _rowActions = [
        //     ..._rowActions,
        //     {
        //         title: translate('HRM_Common_BusinessTravelCosts_Add'),
        //         type: E_BUSINESSTRIPADDCOST,
        //         onPress: (item, dataBody, isShowMultiRecord) => AttSubmitBusinessTripBusinessFunction.businessAddCost(item),
        //         ...actionCost
        //     }
        // ];
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const AttSubmitBusinessTripBusinessFunction = {
    setThisForBusiness: dataThis => {
        _this = dataThis;
    },
    //#region [action delete]
    businessDeleteRecords: (items, dataBody) => {

        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map(item => {
                return item.ID;
            });

            // console.log(selectedID, 'selectedID')
            //view detail hoặc chọn 1 dòng từ lưới
            if (selectedID.length === 1) {
                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Att_GetData/GetBusinessTripById', {
                    id: selectedID[0],
                    screenName: attSubmitBusinessTrip
                }).then(res => {
                    VnrLoadingSevices.hide();
                    try {
                        if (res && res.BusinessAllowAction && res.BusinessAllowAction.indexOf('E_DELETE') >= 0) {
                            VnrLoadingSevices.show();
                            HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionDelete', {
                                selectedID,
                                screenName: attSubmitBusinessTrip
                            }).then(res => {
                                VnrLoadingSevices.hide();
                                try {
                                    if (res && typeof res === enumName.E_object) {
                                        let isValid = res.isValid;

                                        //dữ liệu hợp lệ => gọi hàm confirm Xóa
                                        if (isValid) {
                                            AttSubmitBusinessTripBusinessFunction.confirmDelete(res);
                                        }
                                        //không hợp lệ
                                        else if (
                                            isValid == false &&
                                            res.message &&
                                            typeof res.message === enumName.E_string
                                        ) {
                                            ToasterSevice.showWarning(res.message, 4000);
                                        }
                                        //FAIL
                                        else {
                                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
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
                        } else {
                            ToasterSevice.showWarning('StatusNotAction');
                        }
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });
            } else {

                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionDelete', {
                    selectedID,
                    screenName: attSubmitBusinessTrip,
                    dataBody: dataBody ? JSON.stringify(dataBody) : ''
                }).then(res => {
                    VnrLoadingSevices.hide();
                    try {
                        if (res && typeof res === enumName.E_object) {
                            let isValid = res.isValid;

                            //dữ liệu hợp lệ => gọi hàm confirm Xóa
                            if (isValid) {
                                AttSubmitBusinessTripBusinessFunction.confirmDelete(res);
                            }
                            //không hợp lệ
                            else if (isValid == false && res.message && typeof res.message === enumName.E_string) {
                                ToasterSevice.showWarning(res.message, 4000);
                            }
                            //FAIL
                            else {
                                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
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
            }
        }
    },

    confirmDelete: objValid => {

        const { E_DELETE, E_isInputText, E_isValidInputText, E_string, E_Confirm } = enumName;

        let actionCancel = _rowActions.find(item => item.Type === E_DELETE),
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
                onConfirm: reason => {

                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        //check khung giờ cho Phổ Đình
                        let strId = objValid.strResultID;
                        AttSubmitBusinessTripBusinessFunction.setIsDelete({ Ids: strId, reason });
                    }
                }
            });
        } else {
            //check khung giờ cho Phổ Đình
            let strId = objValid.strResultID;
            AttSubmitBusinessTripBusinessFunction.setIsDelete({ Ids: strId });
        }
    },

    setIsDelete: objValid => {
        VnrLoadingSevices.show();
        let selectedIds = objValid.Ids,
            reason = objValid.reason;

        // api xóa đi cogn tac
        HttpService.Post('[URI_HR]/Att_GetData/RemoveSelectedLeaveDay', {
            selectedIds,
            reason
        }).then(res => {

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

        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map(item => {
                return item.ID;
            });

            //view detail hoặc chọn 1 dòng từ lưới
            if (selectedID.length === 1) {

                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Att_GetData/GetBusinessTripById', {
                    id: selectedID[0],
                    screenName: attSubmitBusinessTrip
                }).then(res => {
                    VnrLoadingSevices.hide();
                    try {
                        if (res && res.BusinessAllowAction && res.BusinessAllowAction.indexOf('E_SENDMAIL') >= 0) {
                            VnrLoadingSevices.show();
                            HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionSendEmail', {
                                selectedID,
                                screenName: attSubmitBusinessTrip,
                                dataBody: dataBody ? JSON.stringify(dataBody) : ''
                            }).then(res => {
                                VnrLoadingSevices.hide();

                                try {
                                    if (res && typeof res === enumName.E_object) {
                                        let isValid = res.isValid;
                                        if (isValid == true) {
                                            AttSubmitBusinessTripBusinessFunction.confirmSendMail(res);
                                        } else if (
                                            isValid == false &&
                                            res.message &&
                                            typeof res.message === enumName.E_string
                                        ) {
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
                            ToasterSevice.showWarning('StatusNotAction');
                        }
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });
            } else {

                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionSendEmail', {
                    selectedID,
                    screenName: attSubmitBusinessTrip,
                    dataBody: dataBody ? JSON.stringify(dataBody) : ''
                }).then(res => {
                    VnrLoadingSevices.hide();

                    try {
                        if (res && typeof res === enumName.E_object) {
                            let isValid = res.isValid;
                            if (isValid == true) {
                                AttSubmitBusinessTripBusinessFunction.confirmSendMail(res);
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
            }
        }
    },

    confirmSendMail: objValid => {
        const { E_SENDMAIL, E_isInputText, E_isValidInputText, E_string } = enumName;

        let actionCancel = _rowActions.find(item => item.Type === E_SENDMAIL),
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
                onConfirm: reason => {

                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        const { apiConfig } = dataVnrStorage,
                            _uriPor = apiConfig ? apiConfig.uriPor : null;

                        VnrLoadingSevices.show();
                        let arrId = objValid.strResultID.split(',');

                        HttpService.Post('[URI_HR]/Att_GetData/ProcessingSendMailLeaveDayTrip', {
                            host: _uriPor,
                            selectedIds: arrId,
                            reason
                        }).then(res => {
                            VnrLoadingSevices.hide();
                            try {
                                if (res && res.success) {
                                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                                    _this.reload('E_KEEP_FILTER');
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
                _uriPor = apiConfig ? apiConfig.uriPor : null;

            VnrLoadingSevices.show();
            let arrId = objValid.strResultID.split(',');

            HttpService.Post('[URI_HR]/Att_GetData/ProcessingSendMailLeaveDayTrip', {
                host: _uriPor,
                selectedIds: arrId
            }).then(res => {
                VnrLoadingSevices.hide();

                try {
                    if (res && res.success) {
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        _this.reload('E_KEEP_FILTER');
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

    //#region [action cancel]
    businessCancelRecords: (items, dataBody, isShowMultiRecord) => {

        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map(item => {
                return item.ID;
            });

            //view detail => check lại dữ liệu cho button đã thao tác
            if (selectedID.length == 1) {
                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Att_GetData/GetBusinessTripById', {
                    id: selectedID[0],
                    screenName: attSubmitBusinessTrip
                }).then(res => {
                    VnrLoadingSevices.hide();
                    try {
                        if (res && res.BusinessAllowAction && res.BusinessAllowAction.indexOf('E_CANCEL') >= 0) {
                            VnrLoadingSevices.show();
                            HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionCancel', {
                                selectedID,
                                screenName: attSubmitBusinessTrip,
                                dataBody: dataBody ? JSON.stringify(dataBody) : ''
                            }).then(res => {
                                VnrLoadingSevices.hide();

                                try {
                                    if (res && typeof res === enumName.E_object) {
                                        let isValid = res.isValid;

                                        //dữ liệu hợp lệ => gọi hàm confirm Hủy
                                        if (isValid) {
                                            AttSubmitBusinessTripBusinessFunction.confirmCancel(res);
                                        }
                                        //không hợp lệ
                                        else if (
                                            isValid == false &&
                                            res.message &&
                                            typeof res.message === enumName.E_string
                                        ) {
                                            ToasterSevice.showWarning(res.message, 4000);
                                        }
                                        //FAIL
                                        else {
                                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
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
                        } else {
                            ToasterSevice.showWarning('DataCancelCanNotCancel');
                        }
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });
            } else {
                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionCancel', {
                    selectedID,
                    screenName: attSubmitBusinessTrip,
                    dataBody: dataBody ? JSON.stringify(dataBody) : ''
                }).then(res => {
                    VnrLoadingSevices.hide();

                    try {
                        if (res && typeof res === enumName.E_object) {
                            let isValid = res.isValid;

                            //dữ liệu hợp lệ => gọi hàm confirm Hủy
                            if (isValid) {
                                AttSubmitBusinessTripBusinessFunction.confirmCancel(res);
                            }
                            //không hợp lệ
                            else if (isValid == false && res.message && typeof res.message === enumName.E_string) {
                                ToasterSevice.showWarning(res.message, 4000);
                            }
                            //FAIL
                            else {
                                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
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
            }
        }
    },

    confirmCancel: objValid => {
        const { E_CANCEL, E_isInputText, E_isValidInputText, E_string, E_Confirm } = enumName;

        let actionCancel = _rowActions.find(item => item.Type === E_CANCEL),
            isConfirm = actionCancel[E_Confirm];

        if (isConfirm) {
            let isInputText = isConfirm[E_isInputText],
                isValidInputText = isConfirm[E_isValidInputText],
                message = objValid.message && typeof objValid.message === E_string ? objValid.message : null,
                placeholder = translate('HRM_Common_CommentCancel');

            AlertSevice.alert({
                iconType: EnumIcon.E_CANCEL,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                isInputText: isInputText,
                message: message,
                onCancel: () => {},
                onConfirm: reason => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        //check khung giờ cho Phổ Đình
                        let strId = objValid.strResultID;
                        AttSubmitBusinessTripBusinessFunction.setStatusCancel({ Ids: strId, reason });
                    }
                }
            });
        } else {
            //check khung giờ cho Phổ Đình
            let strId = objValid.strResultID;
            AttSubmitBusinessTripBusinessFunction.setStatusCancel({ Ids: strId });
        }
    },

    setStatusCancel: objValid => {
        let selectedIds = objValid.Ids && Array.isArray(objValid.Ids) ? objValid.Ids.join(',') : objValid.Ids,
            commentCancel = objValid.reason;

        const { apiConfig } = dataVnrStorage,
            _uriPor = apiConfig ? apiConfig.uriPor : null;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/ChangeStatusCancelLeavedayBusiness', {
            selectedIds,
            RejectReason: commentCancel
        }).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res && res !== '') {
                    if (res == enumName.E_Success) {
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        _this.reload('E_KEEP_FILTER');
                    } else if (res == 'Fail') {
                        ToasterSevice.showWarning('DateFormLessDateNow', 4000);
                    } else if (res == enumName.E_Locked) {
                        ToasterSevice.showWarning('Hrm_Locked', 4000);
                    } else if (typeof res == 'string') {
                        let message = translate('HRM_HR_StatusCanNotChangeToCancel') + ' ' + res;
                        ToasterSevice.showWarning(message, 4000);
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

    //#region [modify]
    businessModifyRecord: item => {
        //view detail hoặc chọn 1 dòng từ lưới
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetBusinessTripById', {
            id: item.ID,
            screenName: attSubmitBusinessTrip
        }).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res && res.BusinessAllowAction && res.BusinessAllowAction.indexOf('E_MODIFY') >= 0) {
                    const { reload } = _this;
                    _this.props.navigation.navigate(attSubmitBusinessTripAddOrEdit, { record: item, reload });
                } else {
                    ToasterSevice.showWarning('StatusNotAction');
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    },
    //#endregion

    //#region [Cost]
    businessDetailCost: item => {
        DrawerServices.navigate('AttSubmitBusinessTripViewCost', { dataItem: item });
        // debugger
        // VnrLoadingSevices.show();
        // HttpService.Post(`[URI_HR]/Att_GetData/New_GetCostItem_ByStrLdID`,
        //     {
        //         strLdID: item.ID,
        //         //   screenName: attSubmitBusinessTrip
        //     })
        //     .then(res => {
        //         VnrLoadingSevices.hide();
        //         try {
        //             if (res && res.Data) {
        //                 console.log(res.Data, ' asdsadas');
        //                 (_this.showDetailCost && typeof _this.showDetailCost == 'function') && _this.showDetailCost(res.Data);
        //                 // const { reload } = _this;
        //                 // _this.props.navigation.navigate(attSubmitBusinessTripAddOrEdit, { record: item, reload });
        //             }
        //             else {
        //                 ToasterSevice.showWarning('StatusNotAction');
        //             }

        //         } catch (error) {
        //             DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        //         }
        //     });
    },
    //#endregion

    //#region [Add Cost]
    businessAddCost: item => {
        VnrLoadingSevices.show();
        HttpService.MultiRequest([
            HttpService.Get('[URI_HR]/Att_GetData/GetListMissionCostTypeByBusinessTravel'),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiCurrency'),
            HttpService.Get('[URI_HR]/Att_GetData/GetSettingByKey?Key=HRM_ATT_CONFIG_ISSHOWACTUALCOSTBUSINESSTRAVEL')
        ]).then(resAll => {
            VnrLoadingSevices.hide();
            console.log(resAll, 'resAllresAll');
            try {
                if (resAll && resAll.length > 0) {
                    const configActuaCost = resAll[2],
                        isShowActualCost =
                            configActuaCost && configActuaCost.Value1 && configActuaCost.Value1.indexOf('True') >= 0;

                    _this.showAddCost &&
                        typeof _this.showAddCost == 'function' &&
                        _this.showAddCost(item, resAll[0], resAll[1], isShowActualCost);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    }
    //#endregion
};
