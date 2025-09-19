import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../../utils/HttpService';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumIcon } from '../../../../../assets/constant';
import DrawerServices from '../../../../../utils/DrawerServices';
import moment from 'moment';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { ModalCheckEmpsSevices } from '../../../../../components/modal/ModalCheckEmps';

let enumName = EnumName,
    attApprovedBusinessTravelCancel = ScreenName.AttApprovedBusinessTravelCancel;

let _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];
    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[attApprovedBusinessTravelCancel],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_ResourceName, E_Name, E_Rule, E_CANCEL } = enumName;

        //action cancel
        const actionCancel = businessAction ? businessAction.find((action) => action.Type === E_CANCEL) : null,
            actionCancelResource = actionCancel ? actionCancel[E_ResourceName][E_Name] : null,
            actionCancelRule = actionCancel ? actionCancel[E_ResourceName][E_Rule] : null,
            actionCancelPer =
                actionCancelResource && actionCancelRule ? permission[actionCancelResource][actionCancelRule] : null;

        if (actionCancelPer) {
            _rowActions = [
                {
                    title: translate('HRM_Common_Cancel'),
                    type: E_CANCEL,
                    onPress: (item, dataBody) =>
                        AttApprovedBusinessTravelCancelBusinessFunction.businessCancelRecords([{ ...item }], dataBody),
                    ...actionCancel
                }
            ];

            _selected = [
                {
                    title: translate('HRM_Common_Cancel'),
                    type: E_CANCEL,
                    onPress: (items, dataBody) =>
                        AttApprovedBusinessTravelCancelBusinessFunction.businessCancelRecords(items, dataBody),
                    ...actionCancel
                }
            ];
        }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const AttApprovedBusinessTravelCancelBusinessFunction = {
    setThisForBusiness: (dataThis) => {
        _this = dataThis;
    },
    //#region [action cancel]

    businessCancelRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map((item) => {
                return item.ID;
            });

            //view detail hoặc chọn 1 dòng từ lưới
            if (selectedID.length === 1) {
                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionCancel', {
                    selectedID,
                    screenName: attApprovedBusinessTravelCancel
                }).then((res) => {
                    VnrLoadingSevices.hide();

                    try {
                        if (res && typeof res === enumName.E_object) {
                            let isValid = res.isValid;

                            //dữ liệu hợp lệ => gọi hàm confirm Hủy
                            if (isValid) {
                                AttApprovedBusinessTravelCancelBusinessFunction.confirmCancel(res);
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
            } else {
                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionCancel', {
                    selectedID,
                    screenName: attApprovedBusinessTravelCancel,
                    dataBody: dataBody ? JSON.stringify(dataBody) : ''
                }).then((res) => {
                    VnrLoadingSevices.hide();

                    try {
                        if (res && typeof res === enumName.E_object) {
                            let isValid = res.isValid;

                            //dữ liệu hợp lệ => gọi hàm confirm Hủy
                            if (isValid) {
                                AttApprovedBusinessTravelCancelBusinessFunction.confirmCancel(res);
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

    confirmCancel: (objValid) => {
        let actionCancel = _rowActions.find((item) => item.Type === enumName.E_CANCEL),
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
                onConfirm: (reason) => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        //check khung giờ cho Phổ Đình
                        let strId = objValid.strResultID;
                        AttApprovedBusinessTravelCancelBusinessFunction.checkingDataWorkingForOTCancel({
                            Ids: strId,
                            reason
                        });
                    }
                }
            });
        } else {
            //check khung giờ cho Phổ Đình
            let strId = objValid.strResultID;
            AttApprovedBusinessTravelCancelBusinessFunction.checkingDataWorkingForOTCancel({ Ids: strId });
        }
    },

    checkingDataWorkingForOTCancel: (objValid) => {
        let selectedID = objValid.Ids.split(',');

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/CheckingValidateEmployeeWorkingForOvertime', {
            selectedIds: selectedID,
            functionApproval: 'E_CANCELED',
            userLogin: dataVnrStorage.currentUser.headers.userlogin
        }).then((res) => {
            VnrLoadingSevices.hide();

            try {
                if (res && Array.isArray(res)) {
                    //dữ liệu hợp lệ
                    if (res[0] === 'success') {
                        AttApprovedBusinessTravelCancelBusinessFunction.setStatusCancel(objValid);
                    }
                    //khung giờ không hợp lệ => gọi hàm mở popup để review
                    else if (res[0] === 'error') {
                        AttApprovedBusinessTravelCancelBusinessFunction.confirmEmpWorkingForCancel(res, objValid);
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

        if (!listInvalidFame.find((item) => item.Status === 'E_BLOCK')) {
            textLeftButton = translate('HRM_Confirm_Limit_TimeSlot');
            isShowLeftButton = true;
        }

        listInvalidFame.forEach((item) => {
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
                AttApprovedBusinessTravelCancelBusinessFunction.setStatusCancel(objValid);
            },
            onClose: () => {},
            dataSource
        });
    },

    setStatusCancel: (objValid) => {
        let selectedIds = objValid.Ids.split(','),
            commentCancel = objValid.reason;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/ProcessCancelOvertimePortal', {
            selectedIds,
            commentCancel
        }).then((res) => {
            VnrLoadingSevices.hide();

            try {
                if (res && res !== '') {
                    if (res == enumName.E_Success) {
                        ToasterSevice.showSuccess('Hrm_Succeed', 5000);
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
    }
    //#endregion
};
