import { Platform } from 'react-native';
import { Colors } from '../../../../../constants/styleConfig';
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
import { ModalCheckEmpsSevices } from '../../../../../components/modal/ModalCheckEmps';
import moment from 'moment';

const enumName = EnumName,
    attSubmitLeaveDay = ScreenName.AttSubmitLeaveDay,
    attSubmitLeaveDayAddOrEdit = ScreenName.AttSubmitLeaveDayAddOrEdit;

let _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];

    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[attSubmitLeaveDay],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_MODIFY, E_ResourceName, E_Name, E_Rule, E_SENDMAIL, E_DELETE, E_CANCEL, E_REQUESTCANCEL } = enumName;

        //action edit
        const actionEdit = businessAction ? businessAction.find(action => action.Type === E_MODIFY) : null,
            actionEditResource = actionEdit ? actionEdit[E_ResourceName][E_Name] : null,
            actionEditRule = actionEdit ? actionEdit[E_ResourceName][E_Rule] : null,
            actionEditPer =
                actionEditResource && actionEditRule ? permission[actionEditResource][actionEditRule] : null;

        if (actionEditPer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_System_Resource_Sys_Edit'),
                    type: E_MODIFY,
                    onPress: item => AttSubmitLeaveDayBusinessFunction.businessModifyRecord({ ...item }),
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
                        AttSubmitLeaveDayBusinessFunction.businessSendMailRecords([{ ...item }], dataBody),
                    ...actionSendMail
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_SendMail'),
                    type: E_SENDMAIL,
                    onPress: (items, dataBody) =>
                        AttSubmitLeaveDayBusinessFunction.businessSendMailRecords(items, dataBody),
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
                        AttSubmitLeaveDayBusinessFunction.businessDeleteRecords([{ ...item }], dataBody),
                    ...actionDelete
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Delete'),
                    type: E_DELETE,
                    onPress: (item, dataBody) =>
                        AttSubmitLeaveDayBusinessFunction.businessDeleteRecords(item, dataBody),
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
                    onPress: (item, dataBody) =>
                        AttSubmitLeaveDayBusinessFunction.businessCancelRecords([{ ...item }], dataBody),
                    ...actionCancel
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Cancel'),
                    type: E_CANCEL,
                    onPress: (item, dataBody) =>
                        AttSubmitLeaveDayBusinessFunction.businessCancelRecords(item, dataBody),
                    ...actionCancel
                }
            ];
        }

        //action Request cancel
        const actionRequestCancel = businessAction
                ? businessAction.find(action => action.Type === E_REQUESTCANCEL)
                : null,
            actionRequestCancelResource = actionRequestCancel ? actionRequestCancel[E_ResourceName][E_Name] : null,
            actionRequestCancelRule = actionRequestCancel ? actionRequestCancel[E_ResourceName][E_Rule] : null,
            actionRequestCancelPer =
                actionRequestCancelResource && actionRequestCancelRule
                    ? permission[actionRequestCancelResource][actionRequestCancelRule]
                    : null;

        if (actionRequestCancelPer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_Att_RequireCancel'),
                    type: E_REQUESTCANCEL,
                    onPress: item => AttSubmitLeaveDayBusinessFunction.businessRequestCancelRecords({ ...item }),
                    ...actionRequestCancel
                }
            ];
        }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const AttSubmitLeaveDayBusinessFunction = {
    setThisForBusiness: dataThis => {
        _this = dataThis;
    },
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
                HttpService.Post('[URI_HR]/Att_GetData/GetLeaveDayById', {
                    id: selectedID[0],
                    screenName: 'AttSubmitLeaveDay'
                }).then(res => {
                    VnrLoadingSevices.hide();
                    try {
                        if (res && res.BusinessAllowAction && res.BusinessAllowAction.indexOf('E_SENDMAIL') >= 0) {
                            VnrLoadingSevices.show();
                            HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionSendEmail', {
                                selectedID,
                                screenName: attSubmitLeaveDay,
                                dataBody: dataBody ? JSON.stringify(dataBody) : ''
                            }).then(res => {
                                VnrLoadingSevices.hide();
                                try {
                                    if (res && typeof res === enumName.E_object) {
                                        let isValid = res.isValid;
                                        if (isValid == true) {
                                            AttSubmitLeaveDayBusinessFunction.confirmSendMail(res);
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
                            ToasterSevice.showWarning('HRM_Message_SentmailReady');
                        }
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });
            } else {
                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionSendEmail', {
                    selectedID,
                    screenName: attSubmitLeaveDay,
                    dataBody: dataBody ? JSON.stringify(dataBody) : ''
                }).then(res => {
                    VnrLoadingSevices.hide();
                    try {
                        if (res && typeof res === enumName.E_object) {
                            let isValid = res.isValid;

                            if (isValid == true) {
                                AttSubmitLeaveDayBusinessFunction.confirmSendMail(res);
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
                icon: `${Platform.OS === 'ios' ? 'ios-' : 'md-'}mail`,
                iconColor: Colors.primary,
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

                        let arrId = objValid.strResultID.split(',');
                        VnrLoadingSevices.show();

                        HttpService.Post('[URI_HR]/Att_GetData/ProcessingSendMailLeaveDay', {
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
            let arrId = objValid.strResultID.split(',');
            VnrLoadingSevices.show();

            HttpService.Post('[URI_HR]/Att_GetData/ProcessingSendMailLeaveDay', {
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

    //#region [action delete]
    businessDeleteRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map(item => {
                return item.ID;
            });

            VnrLoadingSevices.show();

            HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionDelete', {
                selectedID,
                screenName: attSubmitLeaveDay,
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            }).then(res => {
                VnrLoadingSevices.hide();

                try {
                    if (res && typeof res === enumName.E_object) {
                        let isValid = res.isValid;

                        //dữ liệu hợp lệ => gọi hàm confirm Xóa
                        if (isValid) {
                            AttSubmitLeaveDayBusinessFunction.confirmDelete(res);
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
                        AttSubmitLeaveDayBusinessFunction.checkingDataWorkingForLeaveDayDelete({ Ids: strId, reason });
                    }
                }
            });
        } else {
            //check khung giờ cho Phổ Đình
            let strId = objValid.strResultID;
            AttSubmitLeaveDayBusinessFunction.checkingDataWorkingForLeaveDayDelete({ Ids: strId });
        }
    },

    checkingDataWorkingForLeaveDayDelete: objValid => {
        let selectedID = objValid.Ids.split(',');

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/CheckingValidateEmployeeWorking', {
            selectedIds: selectedID,
            functionApproval: 'E_DELETED',
            userLogin: dataVnrStorage.currentUser.headers.userlogin
        }).then(res => {
            VnrLoadingSevices.hide();

            try {
                if (res && Array.isArray(res)) {
                    //dữ liệu hợp lệ
                    if (res[0] === 'success') {
                        AttSubmitLeaveDayBusinessFunction.setIsDelete(objValid);
                    }
                    //khung giờ không hợp lệ => gọi hàm mở popup để review
                    else if (res[0] === 'error') {
                        AttSubmitLeaveDayBusinessFunction.confirmEmpWorkingForDelete(res, objValid);
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

    confirmEmpWorkingForDelete: (res, objValid) => {
        //check có dữ liệu bị BLOCK status
        let listInvalidFame = res[1] && Array.isArray(res[1]) ? res[1] : [],
            textLeftButton = '',
            isShowLeftButton = false;

        if (!listInvalidFame.find(item => item.Status === 'E_BLOCK')) {
            textLeftButton = translate('HRM_Common_Cancel');
            isShowLeftButton = true;
        }

        listInvalidFame.forEach(item => {
            item.DateString = moment(item.Date).format('DD/MM/YYYY');
        });

        //xử lý group theo ngày cho data
        const groupBy = (array, key) => {
            // Return the end result
            return array.reduce((result, currentValue) => {
                // If an array already present for key, push it to the array. Else create an array and push the object
                (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
                // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
                return result;
            }, {}); // empty object is the initial value for result object
        };

        const objInvalidFameGroup = groupBy(listInvalidFame, 'DateString');

        let dataSource = [];
        let key = '';
        for (key in objInvalidFameGroup) {
            let title =
                translate('HRM_Attendance_Day') +
                ': ' +
                key +
                ' (' +
                translate('NumberCount') +
                ': ' +
                objInvalidFameGroup[key].length +
                ')';

            dataSource = [...dataSource, { Type: 'E_GROUP', TitleGroup: title }, ...objInvalidFameGroup[key]];
        }

        ModalCheckEmpsSevices.show({
            titleModal: 'Hrm_Notification',
            textLeftButton: textLeftButton,
            isShowLeftButton,
            textRightButton: 'HRM_Common_Close',
            onFinish: () => {
                AttSubmitLeaveDayBusinessFunction.setIsDelete(objValid);
            },
            onClose: () => {},
            dataSource
        });
    },

    setIsDelete: objValid => {
        let selectedIds = objValid.Ids.split(','),
            reason = objValid.reason;

        VnrLoadingSevices.show();

        HttpService.Post('[URI_POR]/Att_Leaveday/RemoveSelected', {
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

    //#region [modify]
    businessModifyRecord: item => {
        //check status có cho chỉnh sửa => case ở view detail có nhiều button (sửa, xóa, mail,...)
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetLeaveDayById', { id: item.ID, screenName: 'AttSubmitLeaveDay' }).then(
            res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && res.BusinessAllowAction && res.BusinessAllowAction.indexOf('E_MODIFY') >= 0) {
                        const { reload } = _this;
                        _this.props.navigation.navigate(attSubmitLeaveDayAddOrEdit, { record: item, reload });
                    } else {
                        ToasterSevice.showWarning('StatusNotAction');
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            }
        );
    },
    //#endregion

    //#region [action cancel]
    businessCancelRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map(item => {
                return item.ID;
            });

            VnrLoadingSevices.show();

            HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionCancel', {
                selectedID,
                screenName: attSubmitLeaveDay,
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && typeof res === enumName.E_object) {
                        let isValid = res.isValid;

                        //dữ liệu hợp lệ => gọi hàm confirm Hủy
                        if (isValid) {
                            AttSubmitLeaveDayBusinessFunction.confirmCancel(res);
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
    },

    confirmCancel: objValid => {
        const { E_CANCEL, E_isInputText, E_isValidInputText, E_string, E_Confirm } = enumName;

        let actionCancel = _rowActions.find(item => item.Type === E_CANCEL),
            isConfirm = actionCancel[E_Confirm];

        //có cấu hình confirm
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
                    //validate bắt buộc nhập lý do
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        let strId = objValid.strResultID;
                        const { apiConfig } = dataVnrStorage,
                            _uriMain = apiConfig ? apiConfig.uriMain : null;

                        //check khung giờ cho Phổ Đình
                        AttSubmitLeaveDayBusinessFunction.checkingDataWorkingForLeaveDayCancel({
                            Ids: strId,
                            host: _uriMain,
                            commentCancel: reason
                        });
                    }
                }
            });
        } else {
            //check khung giờ cho Phổ Đình
            let strId = objValid.strResultID;
            const { apiConfig } = dataVnrStorage,
                _uriMain = apiConfig ? apiConfig.uriMain : null;

            AttSubmitLeaveDayBusinessFunction.checkingDataWorkingForLeaveDayCancel({
                Ids: strId,
                host: _uriMain
            });
        }
    },

    checkingDataWorkingForLeaveDayCancel: objValid => {
        let selectedID = objValid.Ids.split(',');

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/CheckingValidateEmployeeWorking', {
            selectedIds: selectedID,
            functionApproval: 'E_CANCELED',
            userLogin: dataVnrStorage.currentUser.headers.userlogin
        }).then(res => {
            VnrLoadingSevices.hide();

            try {
                if (res && Array.isArray(res)) {
                    //dữ liệu hợp lệ
                    if (res[0] === 'success') {
                        AttSubmitLeaveDayBusinessFunction.setStatusCancel(objValid);
                    }
                    //khung giờ không hợp lệ => gọi hàm mở popup để review
                    else if (res[0] === 'error') {
                        AttSubmitLeaveDayBusinessFunction.confirmEmpWorkingForCancel(res, objValid);
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

    confirmEmpWorkingForCancel: (res, objValid) => {
        //check có dữ liệu bị BLOCK status
        let listInvalidFame = res[1] && Array.isArray(res[1]) ? res[1] : [],
            textLeftButton = '',
            isShowLeftButton = false;

        if (!listInvalidFame.find(item => item.Status === 'E_BLOCK')) {
            textLeftButton = translate('HRM_Common_Cancel');
            isShowLeftButton = true;
        }

        listInvalidFame.forEach(item => {
            item.DateString = moment(item.Date).format('DD/MM/YYYY');
        });

        //xử lý group theo ngày cho data
        const groupBy = (array, key) => {
            // Return the end result
            return array.reduce((result, currentValue) => {
                // If an array already present for key, push it to the array. Else create an array and push the object
                (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
                // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
                return result;
            }, {}); // empty object is the initial value for result object
        };

        const objInvalidFameGroup = groupBy(listInvalidFame, 'DateString');

        let dataSource = [];
        let key = '';
        for (key in objInvalidFameGroup) {
            let title =
                translate('HRM_Attendance_Day') +
                ': ' +
                key +
                ' (' +
                translate('NumberCount') +
                ': ' +
                objInvalidFameGroup[key].length +
                ')';

            dataSource = [...dataSource, { Type: 'E_GROUP', TitleGroup: title }, ...objInvalidFameGroup[key]];
        }

        ModalCheckEmpsSevices.show({
            titleModal: 'Hrm_Notification',
            textLeftButton: textLeftButton,
            isShowLeftButton,
            textRightButton: 'HRM_Common_Close',
            onFinish: () => {
                AttSubmitLeaveDayBusinessFunction.setStatusCancel(objValid);
            },
            onClose: () => {},
            dataSource
        });
    },

    setStatusCancel: dataBody => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/ChangeStatusCancelLeaveDay', dataBody).then(res => {
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
                    } else if (res == 'Stop') {
                        ToasterSevice.showWarning('DataHavebeenChooseNotCondition', 4000);
                    } else if (res == 'HRM_ATT_CannotCancelDataInPast') {
                        ToasterSevice.showWarning('HRM_ATT_CannotCancelDataInPast', 4000);
                    } else {
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

    //#region [action Request cancel]
    businessRequestCancelRecords: item => {
        let selectedID = [item.ID];

        VnrLoadingSevices.show();

        HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionRequestCancel', {
            selectedID,
            screenName: attSubmitLeaveDay,
            dataBody: ''
        }).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res && typeof res === enumName.E_object) {
                    let isValid = res.isValid;

                    //dữ liệu hợp lệ
                    if (isValid) {
                        const { reload } = _this;
                        DrawerServices.navigate('AttSubmitLeaveDayCancelAddOrEdit', {
                            record: item,
                            reload,
                            screenName: attSubmitLeaveDay
                        });
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
    //#endregion
};
