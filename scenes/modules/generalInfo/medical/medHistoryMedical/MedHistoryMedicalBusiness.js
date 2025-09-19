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


const enumName = EnumName,
    medHistoryMedical = ScreenName.MedHistoryMedical,
    medHistoryMedicalAddOrEdit = ScreenName.MedHistoryMedicalAddOrEdit;

let _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];
    const permission = PermissionForAppMobile.value;

    if (ConfigList.value != null && ConfigList.value != undefined) {

        const _configList = ConfigList.value[medHistoryMedical],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_MODIFY, E_ResourceName, E_Name, E_Rule, E_SENDMAIL, E_DELETE, E_CANCEL } = enumName;

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
                        MedHistoryMedicalBusinessFunction.businessModifyRecord({ ...item }, dataBody),
                    ...actionEdit
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
                        MedHistoryMedicalBusinessFunction.businessDeleteRecords([{ ...item }], dataBody),
                    ...actionDelete
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Delete'),
                    type: E_DELETE,
                    onPress: (item, dataBody) =>
                        MedHistoryMedicalBusinessFunction.businessDeleteRecords(item, dataBody),
                    ...actionDelete
                }
            ];
        }

        // //action cancel
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
                        MedHistoryMedicalBusinessFunction.businessCancelRecords(
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
                        MedHistoryMedicalBusinessFunction.businessCancelRecords(item, dataBody, isShowMultiRecord),
                    ...actionCancel
                }
            ];
        }
        console.log(_rowActions, '_rowActions');
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const MedHistoryMedicalBusinessFunction = {
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

            MedHistoryMedicalBusinessFunction.setIsDelete({
                Ids: selectedID,
                reason: ''
            });
        }
    },

    setIsDelete: objValid => {
        VnrLoadingSevices.show();
        let selectedIds = objValid.Ids,
            reason = objValid.reason;

        HttpService.Post('[URI_HR]/Hre_GetDataV2/RemoveSelectedMedHistoryMedical', {
            selectedIds,
            profileId: dataVnrStorage.currentUser.info.ProfileID
        }).then(res => {

            VnrLoadingSevices.hide();
            try {
                if (res && res !== '') {
                    if (res == enumName.E_Success) {
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        _this.reload('E_KEEP_FILTER', true);
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

    //#region [action cancel]
    businessCancelRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = [];

            items.forEach(el => {
                if (
                    el.BusinessAllowAction &&
                    el.BusinessAllowAction.split(',').findIndex(a => a == EnumIcon.E_CANCEL) > -1
                ) {
                    selectedID.push(el.ID);
                }
            });

            if (selectedID.length == 0) {
                ToasterSevice.showWarning('HRM_Common_SendRequest_Error', 5000);
                return;
            }

            MedHistoryMedicalBusinessFunction.confirmCancel({
                message: `${translate('HRM_Message_DoYouSureWantToCancel')} ${selectedID.length}/${
                    items.length
                } ${translate('HRM_Message_DoYouSureWantToCancelDataSelected')}`,
                strResultID: selectedID.join(',')
            });
        }
    },

    confirmCancel: objValid => {
        let actionCancel = _rowActions.find(item => item.Type === 'E_CANCEL'),
            isConfirm = actionCancel['Confirm'];

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
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
                        VnrLoadingSevices.show();

                        let strId =
                            objValid.strResultID && typeof objValid.strResultID === 'string'
                                ? objValid.strResultID
                                : '';

                        HttpService.Post('[URI_HR]/Med_GetData/CancelHistoryMedical', {
                            selectedIds: strId
                        })
                            .then(res => {
                                try {
                                    if (res && res !== '' && typeof res == 'string') {
                                        ToasterSevice.showWarning(res, 4000);
                                    } else {
                                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                                        _this.reload('E_KEEP_FILTER');
                                    }
                                    VnrLoadingSevices.hide();
                                } catch (error) {
                                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                                    VnrLoadingSevices.hide();
                                }
                            })
                            .catch(error => {
                                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                                VnrLoadingSevices.hide();
                            });
                    }
                }
            });
        } else {
            VnrLoadingSevices.show();
            let strId = objValid.strResultID && typeof objValid.strResultID === 'string' ? objValid.strResultID : '';
            HttpService.Post('[URI_HR]/Med_GetData/CancelHistoryMedical', {
                selectedIds: strId
            })
                .then(res => {
                    try {
                        if (res && res !== '' && typeof res == 'string') {
                            ToasterSevice.showWarning(res, 4000);
                        } else {
                            ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                            _this.reload('E_KEEP_FILTER');
                        }
                        VnrLoadingSevices.hide();
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                        VnrLoadingSevices.hide();
                    }
                })
                .catch(error => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    VnrLoadingSevices.hide();
                });
        }
    },
    //#endregion

    //#region [modify]
    businessModifyRecord: item => {
        //view detail hoặc chọn 1 dòng từ lưới
        VnrLoadingSevices.show();
        HttpService.Get(`[URI_HR]/api/Med_HistoryMedical?ID=${item.ID}`).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res && res.BusinessAllowAction && res.BusinessAllowAction.indexOf('E_MODIFY') >= 0) {
                    const { reload } = _this;
                    console.log(res, 'resresres');
                    _this.props.navigation.navigate(medHistoryMedicalAddOrEdit, { record: res, reload });
                } else {
                    ToasterSevice.showWarning('StatusNotAction');
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    }
    //#endregion
};
