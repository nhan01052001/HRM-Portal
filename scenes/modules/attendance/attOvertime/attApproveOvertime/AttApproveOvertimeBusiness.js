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
import store from '../../../../../store';
import badgesNotification from '../../../../../redux/badgesNotification';

let enumName = EnumName,
    attApproveOvertime = ScreenName.AttApproveOvertime,
    apiConfig = null,
    headers = null,
    _this = null,
    _isOnScreenNotification = false,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];
    apiConfig = dataVnrStorage.apiConfig;
    headers = dataVnrStorage.currentUser.headers;
    const permission = PermissionForAppMobile.value;

    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[attApproveOvertime],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_ResourceName, E_Name, E_Rule, E_APPROVE, E_REJECT, E_CANCEL, E_COMMENT } = enumName;

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
                        AttApproveOvertimeBusinessFunction.businessApproveRecords([{ ...item }], dataBody),
                    ...actionApprove
                }
            ];

            _selected = [
                {
                    title: translate('HRM_Common_Approve'),
                    type: E_APPROVE,
                    onPress: (item, dataBody) =>
                        AttApproveOvertimeBusinessFunction.businessApproveRecords(item, dataBody),
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
                        AttApproveOvertimeBusinessFunction.businessRejectRecords([{ ...item }], dataBody),
                    ...actionReject
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Reject'),
                    type: E_REJECT,
                    onPress: (item, dataBody) =>
                        AttApproveOvertimeBusinessFunction.businessRejectRecords(item, dataBody),
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
                        AttApproveOvertimeBusinessFunction.businessCancelRecords([{ ...item }], dataBody),
                    ...actionCancel
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Cancel'),
                    type: E_CANCEL,
                    onPress: (items, dataBody) =>
                        AttApproveOvertimeBusinessFunction.businessCancelRecords(items, dataBody),
                    ...actionCancel
                }
            ];
        }

        const actionComment = businessAction ? businessAction.find(action => action.Type === E_COMMENT) : null,
            actionCommentResource = actionComment ? actionComment[E_ResourceName][E_Name] : null,
            actionCommentRule = actionComment ? actionComment[E_ResourceName][E_Rule] : null,
            actionCommentPer =
                actionCommentResource && actionCommentRule
                    ? permission[actionCommentResource][actionCommentRule]
                    : null;

        // Action Comment
        if (actionCommentPer) {
            _rowActions = [
                ..._rowActions,
                ...[
                    {
                        title: translate('HRM_Common_Comment'),
                        type: E_COMMENT,
                        onPress: (item) =>
                            AttApproveOvertimeBusinessFunction.businessCommentRecord({ ...item }),
                        ...actionComment
                    }
                ]
            ];
        }

        return { rowActions: _rowActions, selected: _selected };
    }
};

export const AttApproveOvertimeBusinessFunction = {
    // Đối tượng checkForReLoadScreen để check có refresh ListApprovedStopWorking không
    checkForReLoadScreen: {
        [ScreenName.AttApprovedOvertime]: false
    },
    setThisForBusiness: (dataThis, isNotification) => {
        if (isNotification) _isOnScreenNotification = true;
        else _isOnScreenNotification = false;

        _this = dataThis;
    },
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
                screenName: ScreenName.AttApprovedOvertime,
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            }).then(res => {
                VnrLoadingSevices.hide();

                try {
                    if (res && typeof res === enumName.E_object) {
                        let isValid = res.isValid;

                        //dữ liệu hợp lệ => gọi hàm confirm Hủy
                        if (isValid) {
                            AttApproveOvertimeBusinessFunction.confirmCancel(res);
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
        let actionCancel = _rowActions.find(item => item.Type === enumName.E_CANCEL),
            isConfirm = actionCancel[enumName.E_Confirm];

        if (isConfirm) {
            let isInputText = isConfirm[enumName.E_isInputText],
                isValidInputText = isConfirm[enumName.E_isValidInputText],
                message = objValid.message && typeof objValid.message === enumName.E_string ? objValid.message : null,
                placeholder = translate('HRM_Common_CommentCancel');

            AlertSevice.alert({
                iconType: EnumIcon.E_CANCEL,
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
                        AttApproveOvertimeBusinessFunction.checkingDataWorkingForOTCancel({ Ids: strId, reason });
                    }
                }
            });
        } else {
            //check khung giờ cho Phổ Đình
            let strId = objValid.strResultID;
            AttApproveOvertimeBusinessFunction.checkingDataWorkingForOTCancel({ Ids: strId });
        }
    },

    checkingDataWorkingForOTCancel: objValid => {
        let selectedID = objValid.Ids.split(',');

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/CheckingValidateEmployeeWorkingForOvertime', {
            selectedIds: selectedID,
            functionApproval: 'E_CANCELED',
            userLogin: dataVnrStorage.currentUser.headers.userlogin
        }).then(res => {
            VnrLoadingSevices.hide();

            try {
                if (res && Array.isArray(res)) {
                    //dữ liệu hợp lệ
                    if (res[0] === 'success') {
                        AttApproveOvertimeBusinessFunction.setStatusCancel(objValid);
                    }
                    //khung giờ không hợp lệ => gọi hàm mở popup để review
                    else if (res[0] === 'error') {
                        AttApproveOvertimeBusinessFunction.confirmEmpWorkingForCancel(res, objValid);
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
            textLeftButton = translate('HRM_Confirm_Limit_TimeSlot');
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
                AttApproveOvertimeBusinessFunction.setStatusCancel(objValid);
            },
            onClose: () => {},
            dataSource
        });
    },

    setStatusCancel: objValid => {
        let selectedIds = objValid.Ids.split(','),
            commentCancel = objValid.reason;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/ProcessCancelOvertimePortal', {
            selectedIds,
            commentCancel
        }).then(res => {
            VnrLoadingSevices.hide();

            try {
                if (res && res !== '') {
                    if (res == enumName.E_Success) {
                        ToasterSevice.showSuccess('Hrm_Succeed', 5000);
                        // set true để refresh AttApprovedOvertime
                        AttApproveOvertimeBusinessFunction.checkForReLoadScreen[ScreenName.AttApprovedOvertime] = true;
                        _this.reload('E_KEEP_FILTER');
                    } else if (res == enumName.E_Locked) {
                        ToasterSevice.showWarning('Hrm_Locked', 5000);
                    } else {
                        ToasterSevice.showWarning(res, 5000);
                    }
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 5000);
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
            let selectedID = items.map(item => {
                return item.ID;
            });

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionApprove', {
                selectedID,
                screenName: attApproveOvertime,
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && typeof res === enumName.E_object) {
                        let isValid = res.isValid;

                        //dữ liệu hợp lệ => gọi hàm confirm
                        if (isValid) {
                            AttApproveOvertimeBusinessFunction.confirmApprove(res);
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

    confirmApprove: objValid => {
        const { E_APPROVE, E_isInputText, E_isValidInputText, E_string, E_Confirm } = enumName;

        let actionCancel = _rowActions.find(item => item.Type === E_APPROVE),
            isConfirm = actionCancel[E_Confirm];

        if (isConfirm) {
            let isInputText = isConfirm[E_isInputText],
                isValidInputText = isConfirm[E_isValidInputText],
                message = objValid.message && typeof objValid.message === E_string ? objValid.message : null,
                placeholder = translate('ReasonApprove');

            AlertSevice.alert({
                iconType: EnumIcon.E_APPROVE,
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
                        AttApproveOvertimeBusinessFunction.checkingDataWorkingForOTApprove({ Ids: strId, reason });
                    }
                }
            });
        } else {
            //check khung giờ cho Phổ Đình
            let strId = objValid.strResultID;
            AttApproveOvertimeBusinessFunction.checkingDataWorkingForOTApprove({ Ids: strId });
        }
    },

    checkingDataWorkingForOTApprove: objValid => {
        let selectedIds = objValid.Ids.split(',');

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/CheckingValidateEmployeeWorkingForOvertime', {
            selectedIds,
            functionApproval: 'E_APPROVED',
            userLogin: dataVnrStorage.currentUser.headers.userlogin
        }).then(res => {
            VnrLoadingSevices.hide();

            try {
                if (res && Array.isArray(res)) {
                    //dữ liệu hợp lệ
                    if (res[0] === 'success') {
                        AttApproveOvertimeBusinessFunction.checkApproveOTDataLocked(objValid);
                    }
                    //khung giờ không hợp lệ => gọi hàm mở popup để review
                    else if (res[0] === 'error') {
                        AttApproveOvertimeBusinessFunction.confirmEmpWorkingForApprove(res, objValid);
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

    confirmEmpWorkingForApprove: (res, objValid) => {
        //check có dữ liệu bị BLOCK status
        let listInvalidFame = res[1] && Array.isArray(res[1]) ? res[1] : [],
            textLeftButton = '',
            isShowLeftButton = false;

        if (!listInvalidFame.find(item => item.Status === 'E_BLOCK')) {
            textLeftButton = translate('HRM_Confirm_Limit_TimeSlot');
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
                AttApproveOvertimeBusinessFunction.checkApproveOTDataLocked(objValid);
            },
            onClose: () => {},
            dataSource
        });
    },

    checkAllowApproveDataLocked: objValid => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Sal_GetData/GetConfigElement', {
            key: 'HRM_ATT_CONFIG_ISALLOWAPPROVEDATALOCKEDANDTRANFERCUTOFDUATION'
        }).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res) {
                    if (res.Value1 && res.Value1.toLowerCase() == enumName.E_true) {
                        //confirm duyệt
                        AlertSevice.alert({
                            iconType: EnumIcon.E_WARNING,
                            message: translate('HRM_IsLockDataAreYouSureApproved'),
                            onCancel: () => {},
                            onConfirm: () => {
                                AttApproveOvertimeBusinessFunction.setStatusApprove(objValid);
                            }
                        });
                    } else {
                        ToasterSevice.showWarning('DataIsLocked', 5000);
                    }
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 5000);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    },

    checkApproveOTDataLocked: objValid => {
        let arrId = objValid.Ids.split(',');
        VnrLoadingSevices.show();

        HttpService.Post('[URI_HR]/Att_GetData/CheckApproveOvertimeDataLocked', { selectedIds: arrId }).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res) {
                    //không bị khóa > gọi hàm duyệt
                    if (
                        (typeof res === enumName.E_string && res.toLowerCase() === enumName.E_false) ||
                        (typeof res === enumName.E_boolean && !res)
                    ) {
                        AttApproveOvertimeBusinessFunction.setStatusApprove(objValid);
                    }
                    //khóa
                    else if (
                        (typeof res === enumName.E_string && res.toLowerCase() === enumName.E_true) ||
                        (typeof res === enumName.E_boolean && res)
                    ) {
                        //check cấu hình cho duyệt dữ liệu khóa
                        AttApproveOvertimeBusinessFunction.checkAllowApproveDataLocked({ ...objValid });
                    } else {
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 5000);
                    }
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 5000);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    },

    setStatusApprove: objValid => {
        let selectedIds = objValid.Ids,
            approveComment = objValid.reason,
            dataBody = {
                host: apiConfig.uriPor,
                selectedIds,
                UserLoginID: headers.userid,
                isConfirm: objValid.isConfirm ? objValid.isConfirm : false,
                approveComment,
                IsPortal: true
            };

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/SetApproveOvertimePortal', dataBody).then(data => {
            VnrLoadingSevices.hide();
            if (typeof data == 'object') {
                AlertSevice.alert({
                    title: 'Hrm_Notification',
                    textRightButton: 'HRM_Confirm_Limit_TimeSlot',
                    textLeftButton: 'CANCEL',
                    iconType: EnumIcon.E_REJECT,
                    message: translate('Employee') + data[1] + 'vượt mức số giờ ĐK quy định',
                    onCancel: () => {},
                    onConfirm: () => {
                        let toObjValid = {
                            ...objValid,
                            isConfirm: true
                        };

                        AttApproveOvertimeBusinessFunction.setStatusApprove(toObjValid);
                    }
                });
            } else if (data == 'Locked') {
                ToasterSevice.showWarning('DataIsLocked');
            } else if (data == 'errorRegisterHours') {
                ToasterSevice.showWarning('HoursOversubscribedHoursRegistrationRules');
            } else {
                ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                _this.reload('E_KEEP_FILTER', true);
                // set true để refresh AttApprovedOvertime
                AttApproveOvertimeBusinessFunction.checkForReLoadScreen[ScreenName.AttApprovedOvertime] = true;
                // Đếm lại con số ở Dashboard
                store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());
                // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                if (!_isOnScreenNotification) DrawerServices.navigate('AttApproveOvertime');
            }
        });
    },
    //#endregion

    //#region [action reject]

    businessRejectRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 5000);
        } else {
            let selectedID = items.map(item => {
                return item.ID;
            });

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionReject', {
                selectedID,
                screenName: attApproveOvertime,
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && typeof res === 'object') {
                        let isValid = res.isValid;

                        //dữ liệu hợp lệ => gọi hàm confirm Hủy
                        if (isValid) {
                            AttApproveOvertimeBusinessFunction.confirmReject(res);
                        }
                        //không hợp lệ
                        else if (isValid == false && res.message && typeof res.message === 'string') {
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

    confirmReject: objValid => {
        let actionCancel = _rowActions.find(item => item.Type === enumName.E_REJECT),
            isConfirm = actionCancel[enumName.E_Confirm];

        if (isConfirm) {
            let isInputText = isConfirm[enumName.E_isInputText],
                isValidInputText = isConfirm[enumName.E_isValidInputText],
                message = objValid.message && typeof objValid.message === enumName.E_string ? objValid.message : null,
                placeholder = translate('ReasonReject');

            AlertSevice.alert({
                iconType: EnumIcon.E_REJECT,
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
                        AttApproveOvertimeBusinessFunction.checkingDataWorkingForOTReject({ Ids: strId, reason });
                    }
                }
            });
        } else {
            //check khung giờ cho Phổ Đình
            let strId = objValid.strResultID;
            AttApproveOvertimeBusinessFunction.checkingDataWorkingForOTReject({ Ids: strId });
        }
    },

    checkingDataWorkingForOTReject: objValid => {
        let selectedID = objValid.Ids.split(',');

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/CheckingValidateEmployeeWorkingForOvertime', {
            selectedIds: selectedID,
            functionApproval: 'E_REJECTED',
            userLogin: dataVnrStorage.currentUser.headers.userlogin
        }).then(res => {
            VnrLoadingSevices.hide();

            try {
                if (res && Array.isArray(res)) {
                    //dữ liệu hợp lệ
                    if (res[0] === 'success') {
                        AttApproveOvertimeBusinessFunction.setStatusReject(objValid);
                    }
                    //khung giờ không hợp lệ => gọi hàm mở popup để review
                    else if (res[0] === 'error') {
                        AttApproveOvertimeBusinessFunction.confirmEmpWorkingForReject(res, objValid);
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

    confirmEmpWorkingForReject: (res, objValid) => {
        //check có dữ liệu bị BLOCK status
        let listInvalidFame = res[1] && Array.isArray(res[1]) ? res[1] : [],
            textLeftButton = '',
            isShowLeftButton = false;

        if (!listInvalidFame.find(item => item.Status === 'E_BLOCK')) {
            textLeftButton = translate('HRM_Confirm_Limit_TimeSlot');
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
                AttApproveOvertimeBusinessFunction.setStatusReject(objValid);
            },
            onClose: () => {},
            dataSource
        });
    },

    setStatusReject: objValid => {
        let selectedIds = objValid.Ids.split(','),
            declineReason = objValid.reason;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/SetRejectOvertimePortal', {
            host: apiConfig.uriPor,
            selectedIds,
            userLoginID: headers.userid,
            declineReason,
            IsPortal: true
        }).then(data => {
            VnrLoadingSevices.hide();

            try {
                if (data) {
                    if (data == enumName.E_Locked) {
                        ToasterSevice.showWarning('Hrm_Locked', 5000);
                    } else if (data.ActionStatus == 'NoPermission') {
                        ToasterSevice.showWarning('NoPermission', 5000);
                    } else if (data.ActionStatus == 'NoApproveOTMySelf') {
                        ToasterSevice.showWarning('NoApproveOTMySelf', 5000);
                    } else if (data == 'Error') {
                        ToasterSevice.showWarning('Hrm_Error', 5000);
                    } else if (data.indexOf('E_BLOCK') >= 0) {
                        ToasterSevice.showWarning(data.split('|')[1], 5000);
                    } else if (data.indexOf('E_WARNING') >= 0) {
                        AlertSevice.alert({
                            //title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_REJECT,
                            message: data.split('|')[1],
                            onCancel: () => {},
                            onConfirm: () => {
                                AttApproveOvertimeBusinessFunction.setStatusReject(objValid);
                            }
                        });
                    } else {
                        ToasterSevice.showSuccess('Hrm_Succeed', 5000);
                        _this.reload('E_KEEP_FILTER', true);
                        // set true để refresh AttApprovedOvertime
                        AttApproveOvertimeBusinessFunction.checkForReLoadScreen[
                            ScreenName.AttApprovedOvertime
                        ] = true;
                        // Đếm lại con số ở Dashboard
                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());
                        // nếu (duyệt/từ chối) ở màn hình notify thì không chuyển hướng.
                        if (!_isOnScreenNotification) DrawerServices.navigate('AttApproveOvertime');
                    }
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 5000);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    },
    //#endregion
    businessCommentRecord: item => {
        const { reload } = _this;

        DrawerServices.navigate('AttApproveOvertimeComment', { record: item, reload, screenName: attApproveOvertime });
    }
};

export default {
    generateRowActionAndSelected: generateRowActionAndSelected,
    AttApproveOvertimeBusinessFunction: AttApproveOvertimeBusinessFunction
};
