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
    attApprovePregnancy = ScreenName.AttApprovePregnancy,
    _isOnScreenNotification = false,
    apiConfig = null,
    headers = null,
    _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];
    apiConfig = dataVnrStorage.apiConfig;
    headers = dataVnrStorage.currentUser.headers;
    // const permission = PermissionForAppMobile.value;

    const permission = PermissionForAppMobile.value;

    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[attApprovePregnancy],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_ResourceName, E_Name, E_Rule, E_APPROVE, E_REJECT, E_CANCEL } = enumName;

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
                        AttApprovePregnancyBusinessFunction.businessApproveRecords([{ ...item }], dataBody),
                    ...actionApprove
                }
            ];

            _selected = [
                {
                    title: translate('HRM_Common_Approve'),
                    type: E_APPROVE,
                    onPress: (item, dataBody) =>
                        AttApprovePregnancyBusinessFunction.businessApproveRecords(item, dataBody),
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
                        AttApprovePregnancyBusinessFunction.businessRejectRecords([{ ...item }], dataBody),
                    ...actionReject
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Reject'),
                    type: E_REJECT,
                    onPress: (item, dataBody) =>
                        AttApprovePregnancyBusinessFunction.businessRejectRecords(item, dataBody),
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
                        AttApprovePregnancyBusinessFunction.businessCancelRecords([{ ...item }], dataBody),
                    ...actionCancel
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Cancel'),
                    type: E_CANCEL,
                    onPress: (items, dataBody) =>
                        AttApprovePregnancyBusinessFunction.businessCancelRecords(items, dataBody),
                    ...actionCancel
                }
            ];
        }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const AttApprovePregnancyBusinessFunction = {
    // Đối tượng checkForReLoadScreen để check có refresh ListApprovedStopWorking không
    checkForReLoadScreen: {
        [ScreenName.AttApprovedPregnancy]: false
    },
    setThisForBusiness: (dataThis, isNotification) => {
        if (isNotification) _isOnScreenNotification = true;
        else _isOnScreenNotification = false;

        _this = dataThis;
    },

    //#region [action cancel] chưa dùng

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
                screenName: ScreenName.AttApprovedPregnancy,
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            }).then(res => {
                VnrLoadingSevices.hide();

                try {
                    if (res && typeof res === enumName.E_object) {
                        let isValid = res.isValid;

                        //dữ liệu hợp lệ => gọi hàm confirm Hủy
                        if (isValid) {
                            AttApprovePregnancyBusinessFunction.confirmCancel(res);
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
                        AttApprovePregnancyBusinessFunction.checkingDataWorkingForOTCancel({ Ids: strId, reason });
                    }
                }
            });
        } else {
            //check khung giờ cho Phổ Đình
            let strId = objValid.strResultID;
            AttApprovePregnancyBusinessFunction.checkingDataWorkingForOTCancel({ Ids: strId });
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
                        AttApprovePregnancyBusinessFunction.setStatusCancel(objValid);
                    }
                    //khung giờ không hợp lệ => gọi hàm mở popup để review
                    else if (res[0] === 'error') {
                        AttApprovePregnancyBusinessFunction.confirmEmpWorkingForCancel(res, objValid);
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
                AttApprovePregnancyBusinessFunction.setStatusCancel(objValid);
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
                        // set true để refresh AttApprovedPregnancy
                        AttApprovePregnancyBusinessFunction.checkForReLoadScreen[
                            ScreenName.AttApprovedPregnancy
                        ] = true;
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
                screenName: attApprovePregnancy,
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && typeof res === enumName.E_object) {
                        let isValid = res.isValid;

                        //dữ liệu hợp lệ => gọi hàm confirm
                        if (isValid) {
                            AttApprovePregnancyBusinessFunction.confirmApprove(res);
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
                        let strId = objValid.strResultID;
                        AttApprovePregnancyBusinessFunction.setStatusApprove({ Ids: strId, reason });
                    }
                }
            });
        } else {
            let strId = objValid.strResultID;
            AttApprovePregnancyBusinessFunction.setStatusApprove({ Ids: strId });
        }
    },

    setStatusApprove: objValid => {

        let selectedIds = objValid.Ids,
            approveComment = objValid.reason,
            dataBody = {
                host: apiConfig.uriPor,
                selectedIds,
                userProcessID: headers.userid,
                isConfirm: false,
                approveComment
            };

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/SetApprovePregnancyRegisterInPortal', dataBody).then(data => {
            VnrLoadingSevices.hide();
            if (data && typeof data === 'string') {
                if (data == enumName.E_Success) {
                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                    _this.reload('E_KEEP_FILTER', true);
                    // set true để refresh AttApprovedPregnancy
                    AttApprovePregnancyBusinessFunction.checkForReLoadScreen[ScreenName.AttApprovedPregnancy] = true;

                    // Đếm lại con số ở Dashboard
                    store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                    // nếu duyệt ở màn hình notify thì không chuyển hướng.
                    if (!_isOnScreenNotification) DrawerServices.navigate(ScreenName.AttApprovePregnancy);
                } else if (data.indexOf('FieldLengthError') > -1) {
                    const mesError = data.split('|')[1];
                    ToasterSevice.showWarning(mesError ? mesError : 'HRM_Common_SendRequest_Error');
                }
            } else {
                ToasterSevice.showWarning('HRM_Common_SendRequest_Error');
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
                screenName: attApprovePregnancy,
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && typeof res === 'object') {
                        let isValid = res.isValid;

                        //dữ liệu hợp lệ => gọi hàm confirm Hủy
                        if (isValid) {
                            AttApprovePregnancyBusinessFunction.confirmReject(res);
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
                        let strId = objValid.strResultID;
                        AttApprovePregnancyBusinessFunction.setStatusReject({ Ids: strId, reason });
                    }
                }
            });
        } else {
            let strId = objValid.strResultID;
            AttApprovePregnancyBusinessFunction.setStatusReject({ Ids: strId });
        }
    },

    setStatusReject: objValid => {
        let selectedIds = objValid.Ids,
            DeclineReason = objValid.reason;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/SetRejectPregnancyRegisterInPortal', {
            host: apiConfig.uriPor,
            selectedIds,
            userProcessID: headers.userid,
            DeclineReason
        }).then(data => {
            VnrLoadingSevices.hide();

            try {
                if (data && typeof data === 'string') {
                    if (data == enumName.E_Success) {
                        ToasterSevice.showSuccess('Hrm_Succeed', 5000);
                        _this.reload('E_KEEP_FILTER', true);
                        // set true để refresh AttApprovedPregnancy
                        AttApprovePregnancyBusinessFunction.checkForReLoadScreen[
                            ScreenName.AttApprovedPregnancy
                        ] = true;

                        // Đếm lại con số ở Dashboard
                        store.dispatch(badgesNotification.actions.fetchCountNumberApproveInfo());

                        // nếu duyệt ở màn hình notify thì không chuyển hướng.
                        if (!_isOnScreenNotification) DrawerServices.navigate(ScreenName.AttApprovePregnancy);
                    } else {
                        ToasterSevice.showWarning(data);
                    }
                } else {
                    ToasterSevice.showWarning('HRM_Common_SendRequest_Error');
                }

                // if (data) {
                //     if (data == enumName.E_Locked) {
                //         ToasterSevice.showWarning('Hrm_Locked', 5000);
                //     }
                //     else {
                //         if (data.ActionStatus == "NoPermission") {
                //             ToasterSevice.showWarning('NoPermission', 5000);
                //         }
                //         else if (data.ActionStatus == "NoApproveOTMySelf") {
                //             ToasterSevice.showWarning('NoApproveOTMySelf', 5000);
                //         }
                //         else if (data == "Error") {
                //             ToasterSevice.showWarning('Hrm_Error', 5000);
                //         }
                //         else if (data.indexOf('E_BLOCK') >= 0) {
                //             ToasterSevice.showWarning(data.split('|')[1], 5000);
                //         }
                //         else if (data.indexOf('E_WARNING') >= 0) {

                //             AlertSevice.alert({
                //                 //title: translate('Hrm_Notification'),
                //                 iconType: EnumIcon.E_REJECT,
                //                 message: data.split('|')[1],
                //                 onCancel: () => { },
                //                 onConfirm: () => {
                //                     AttApprovePregnancyBusinessFunction.setStatusReject(objValid);
                //                 }
                //             })
                //         }
                //         else {

                //         }
                //     }
                // }
                // else {
                //     ToasterSevice.showError("HRM_Common_SendRequest_Error", 5000);
                // }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    }
    //#endregion
};

export default {
    generateRowActionAndSelected: generateRowActionAndSelected,
    AttApprovePregnancyBusinessFunction: AttApprovePregnancyBusinessFunction
};
