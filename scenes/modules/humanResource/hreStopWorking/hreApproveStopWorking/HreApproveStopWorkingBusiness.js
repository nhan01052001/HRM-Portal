import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../../utils/HttpService';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumIcon } from '../../../../../assets/constant';
import DrawerServices from '../../../../../utils/DrawerServices';

let enumName = EnumName,
    hreApproveStopWorking = ScreenName.HreApproveStopWorking,
    _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];
    const permission = PermissionForAppMobile.value;

    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[hreApproveStopWorking],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_ResourceName, E_Name, E_Rule, E_APPROVE, E_REJECT } = enumName;

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
                        HreApproveStopWorkingBusinessFunction.businessApproveRecords([{ ...item }], dataBody),
                    ...actionApprove
                }
            ];

            _selected = [
                {
                    title: translate('HRM_Common_Approve'),
                    type: E_APPROVE,
                    onPress: (item, dataBody) =>
                        HreApproveStopWorkingBusinessFunction.businessApproveRecords(item, dataBody),
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
                        HreApproveStopWorkingBusinessFunction.businessRejectRecords([{ ...item }], dataBody),
                    ...actionReject
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Reject'),
                    type: E_REJECT,
                    onPress: (item, dataBody) =>
                        HreApproveStopWorkingBusinessFunction.businessRejectRecords(item, dataBody),
                    ...actionReject
                }
            ];
        }

        return { rowActions: _rowActions, selected: _selected };
    }
};

export const HreApproveStopWorkingBusinessFunction = {
    // Đối tượng checkForReLoadScreen để check có refresh ListApprovedStopWorking không
    checkForReLoadScreen: {
        [ScreenName.HreApprovedStopWorking]: false
    },
    setThisForBusiness: dataThis => {
        _this = dataThis;
    },

    //#region [action approve]

    businessApproveRecords: (items, dataBody) => {
        const { E_APPROVE, E_Confirm } = enumName;
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 5000);
        } else {
            // 0150777: Hotfix [Toyota_v8.9.44.01.07.59] thêm nội dung ghi nhận có tuyển thay thế và lý do khi duyệt nghỉ việc không
            // Check AddRecruitment is Same True or Same False

            let actionApprove = _rowActions.find(item => item.Type === E_APPROVE),
                isConfirm = actionApprove[E_Confirm],
                isCheckBox = isConfirm.isCheckBox,
                checkflag = true,
                isAddRecruitment = items[0]['AddRecruitment'];

            if (isCheckBox) {
                items.forEach(el => {
                    if (el.AddRecruitment !== isAddRecruitment) {
                        checkflag = false;
                    }
                });
                isAddRecruitment = isAddRecruitment ? isAddRecruitment : false;

                if (!checkflag) {
                    ToasterSevice.showWarning('HRM_Hre_StopWorking_AddRecruitment_NotIsSame', 5000);
                    return;
                }
            }
            // ================ //

            let selectedID = items.map(item => {
                return item.ID;
            });

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Hre_GetData/BusinessAllowActionApprove', {
                selectedID,
                screenName: hreApproveStopWorking,
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && typeof res === enumName.E_object) {
                        let isValid = res.isValid;

                        //dữ liệu hợp lệ => gọi hàm confirm
                        if (isValid) {
                            HreApproveStopWorkingBusinessFunction.confirmApprove(res, isAddRecruitment);
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

    confirmApprove: (objValid, isAddRecruitment) => {
        const { E_APPROVE, E_isInputText, E_isValidInputText, E_string, E_Confirm } = enumName;

        let actionApprove = _rowActions.find(item => item.Type === E_APPROVE),
            isConfirm = actionApprove[E_Confirm];

        if (isConfirm) {
            let isInputText = isConfirm[E_isInputText],
                isValidInputText = isConfirm[E_isValidInputText],
                isCheckBox = isConfirm.isCheckBox,
                message = objValid.message && typeof objValid.message === E_string ? objValid.message : null,
                placeholder = translate('ReasonApprove');

            AlertSevice.alert({
                iconType: EnumIcon.E_APPROVE,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                message: message,
                lableCheckBox: 'HRM_Hre_StopWorking_AddRecruitment',
                isCheckBox:
                    (isCheckBox && isAddRecruitment == false) || isAddRecruitment == true ? isAddRecruitment : null,
                isInputText: isInputText,
                onCancel: () => {},
                onConfirm: (reason, isCheckBox) => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        let strId = objValid.strResultID;
                        HreApproveStopWorkingBusinessFunction.setStatusApprove({ Ids: strId, reason, isCheckBox });
                    }
                }
            });
        } else {
            let strId = objValid.strResultID;
            // eslint-disable-next-line no-undef
            HreApproveStopWorkingBusinessFunction.setStatusApprove({ Ids: strId, reason, isCheckBox: false });
        }
    },

    setStatusApprove: objValid => {
        let selectedIds = objValid.Ids,
            approveComment = objValid.reason,
            isAddRecruitment = objValid.isCheckBox,
            dataBody = {
                isUpdateWorkhistory: objValid.isUpdateWorkhistory,
                selectedIds,
                addRecruitment: isAddRecruitment, // Add Recruitment
                approveComment
            };

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Hre_GetData/ApproveStopWorking', dataBody).then(data => {
            VnrLoadingSevices.hide();

            if (data == 'Success') {
                ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                _this.reload('E_KEEP_FILTER', true);
                // set true để refresh ListApprovedStopWorking
                HreApproveStopWorkingBusinessFunction.checkForReLoadScreen[ScreenName.HreApprovedStopWorking] = true;
                DrawerServices.navigate(hreApproveStopWorking);
            } else if (data.indexOf('NotFinishWorkList') >= 0) {
                ToasterSevice.showWarning('NotFinishWorkList', 5000);
            } else if (data == 'HRM_HR_StopWorking_DoYouWantToUpdateWorkHistory') {
                dataBody = {
                    ...dataBody,
                    isUpdateWorkhistory: '1'
                };

                HreApproveStopWorkingBusinessFunction.updateWorkHistory(dataBody);
            }
        });
    },

    updateWorkHistory: dataBody => {
        AlertSevice.alert({
            iconType: EnumIcon.E_CONFIRM,
            message: translate('HRM_HR_StopWorking_DoYouWantToUpdateWorkHistory'),
            onCancel: () => {},
            onConfirm: () => {
                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Hre_GetData/ApproveStopWorking', dataBody).then(data => {
                    VnrLoadingSevices.hide();

                    if (data == 'Success') {
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        _this.reload('E_KEEP_FILTER', true);
                        DrawerServices.navigate(hreApproveStopWorking);
                    } else if (data.indexOf('NotFinishWorkList') >= 0) {
                        ToasterSevice.showWarning('NotFinishWorkList', 5000);
                    } else if (data == 'HRM_HR_StopWorking_DoYouWantToUpdateWorkHistory') {
                        dataBody = {
                            ...dataBody,
                            isUpdateWorkhistory: '1'
                        };

                        HreApproveStopWorkingBusinessFunction.updateWorkHistory(dataBody);
                    }
                });
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
            HttpService.Post('[URI_HR]/Hre_GetData/BusinessAllowActionReject', {
                selectedID,
                screenName: hreApproveStopWorking,
                dataBody: dataBody ? JSON.stringify(dataBody) : ''
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && typeof res === 'object') {
                        let isValid = res.isValid;

                        //dữ liệu hợp lệ => gọi hàm confirm Hủy
                        if (isValid) {
                            HreApproveStopWorkingBusinessFunction.confirmReject(res);
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
                        HreApproveStopWorkingBusinessFunction.setStatusReject({ Ids: strId, reason });
                    }
                }
            });
        } else {
            let strId = objValid.strResultID;
            HreApproveStopWorkingBusinessFunction.setStatusReject({ Ids: strId });
        }
    },

    setStatusReject: objValid => {
        let selectedIds = objValid.Ids,
            declineReason = objValid.reason;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Hre_GetData/RejectStopWorking', {
            selectedIds,
            rejectComment: declineReason
        }).then(data => {
            VnrLoadingSevices.hide();

            try {
                if (data) {
                    if (data == 'NoPermission') {
                        ToasterSevice.showWarning('NoPermission', 5000);
                    } else if (data == 'NoApproveOTMySelf') {
                        ToasterSevice.showWarning('NoApproveOTMySelf', 5000);
                    } else {
                        ToasterSevice.showSuccess('Hrm_Succeed', 5000);
                        _this.reload('E_KEEP_FILTER', true);
                        // set true để refresh ListApprovedStopWorking
                        HreApproveStopWorkingBusinessFunction.checkForReLoadScreen[
                            ScreenName.HreApprovedStopWorking
                        ] = true;
                        DrawerServices.navigate(hreApproveStopWorking);
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
