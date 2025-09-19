/* eslint-disable no-undef */
import { ToasterSevice } from '../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../utils/HttpService';
import { translate } from '../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../assets/configProject/PermissionForAppMobile';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import { ConfigList } from '../../../../assets/configProject/ConfigList';
import { EnumName, EnumIcon } from '../../../../assets/constant';
import DrawerServices from '../../../../utils/DrawerServices';
import moment from 'moment';
//import { ModalCheckEmpsSevices } from '../../../../components/modal/ModalCheckEmps';

let enumName = EnumName,
    //hreTaskAssigned = ScreenName.HreTaskAssigned,
    _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = screenName => {
    _rowActions = [];
    _selected = [];
    const permission = PermissionForAppMobile.value;

    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[screenName],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_ResourceName, E_Name, E_Rule, E_MODIFY, E_DELETE, E_EVALUATION } = enumName;

        //action Upadate status
        // const actionUpdateSt = businessAction ? businessAction.find(action => action.Type === E_UPDATESTATUS) : null,
        //     actionUpdateStResource = actionUpdateSt ? actionUpdateSt[E_ResourceName][E_Name] : null,
        //     actionUpdateStRule = actionUpdateSt ? actionUpdateSt[E_ResourceName][E_Rule] : null,
        //     actionUpdateStPer = (actionUpdateStResource && actionUpdateStRule)
        //         ? permission[actionUpdateStResource][actionUpdateStRule] : null;

        // if (actionUpdateStPer) {
        //     _rowActions = [
        //         {
        //             title: translate('StatusView'),
        //             type: E_UPDATESTATUS,
        //             onPress: (item, dataBody) => {
        //                 _this.setState({ updateStatusVisible: true, updateStatusData: item })
        //             },
        //             ...actionUpdateSt
        //         }
        //     ];

        //     _selected = [
        //         {
        //             title: translate('StatusView'),
        //             type: E_UPDATESTATUS,
        //             onPress: (item, dataBody) => { console.log('Update') },
        //             ...actionUpdateSt
        //         }
        //     ]
        // }

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
                        TaskBusinessBusinessFunction.businessDeleteRecords([{ ...item }], dataBody),
                    ...actionDelete
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Delete'),
                    type: E_DELETE,
                    onPress: (item, dataBody) => TaskBusinessBusinessFunction.businessDeleteRecords(item, dataBody),
                    ...actionDelete
                }
            ];
        }

        //action Evaluate ( cho màn hình đánh giá công việc )
        const actionEvaluate = businessAction ? businessAction.find(action => action.Type === E_EVALUATION) : null,
            actionEvaluateResource = actionEvaluate ? actionEvaluate[E_ResourceName][E_Name] : null,
            actionEvaluateRule = actionEvaluate ? actionEvaluate[E_ResourceName][E_Rule] : null,
            actionEvaluatePer =
                actionEvaluateResource && actionEvaluateRule
                    ? permission[actionEvaluateResource][actionEvaluateRule]
                    : null;

        if (actionEvaluatePer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_System_Resource_Evaluation'),
                    type: E_EVALUATION,
                    onPress: (item) => TaskBusinessBusinessFunction.businessEvaluationRecord(item),
                    ...actionEvaluate
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_System_Resource_Evaluation'),
                    type: E_EVALUATION,
                    onPress: (item) => TaskBusinessBusinessFunction.businessEvaluationRecord(item),
                    ...actionEvaluate
                }
            ];
        }

        // Action Modify
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
                    onPress: (item) => TaskBusinessBusinessFunction.businessModifyRecord(item),
                    ...actionEdit
                }
            ];
        }

        return { rowActions: _rowActions, selected: _selected };
    }
};

export const generateRowActionAndSelectedForTaskAssigned = screenName => {
    _rowActions = [];
    _selected = [];
    const permission = PermissionForAppMobile.value;

    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[screenName],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_ResourceName, E_Name, E_Rule, E_MODIFY } = enumName;

        // Action Modify
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
                    onPress: (item) => TaskBusinessBusinessFunction.businessModifyRecordForTaskAssigned(item),
                    ...actionEdit
                }
            ];
        }

        return { rowActions: _rowActions, selected: _selected };
    }
};

export const TaskBusinessBusinessFunction = {
    checkForLoadEditDelete: {
        HreTaskAssign: false,
        HreTaskAssigned: false,
        HreTaskFollow: false
    },
    newRecord: null,
    setThisForBusiness: (dataThis) => {
        // if (navigation && navigation.state && navigation.state.routeName === screenName) {
        _this = dataThis;
        // }
    },
    businessDeleteRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map(item => {
                    return item.ID;
                }),
                lengthItemDelete = selectedID.length;

            AlertSevice.alert({
                iconType: EnumIcon.E_DELETE,
                message: `${translate('AreYouSureYouWantToDeleteV2')} ${lengthItemDelete} ${translate(
                    'SelectedDataLines'
                )}`,
                onCancel: () => {},
                onConfirm: () => {
                    TaskBusinessBusinessFunction.checkingDataWorkingForTaskDelete(selectedID);
                }
            });
        }
    },
    checkingDataWorkingForTaskDelete: selectedID => {
        if (Array.isArray(selectedID) && selectedID.length > 0) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_POR]/New_Hre_Tas_Task/RemoveSelected', {
                selectedIds: selectedID,
                userLogin: dataVnrStorage.currentUser.headers.userlogin
            }).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res && res === 'Success') {
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        TaskBusinessBusinessFunction.checkForLoadEditDelete = {
                            HreTaskAssign: true,
                            HreTaskAssigned: true,
                            HreTaskFollow: true
                        };
                        _this.reload('E_KEEP_FILTER', true);
                    } else {
                        ToasterSevice.showError('Hrm_Fail', 4000);
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        }
    },
    //#region [modify]
    businessModifyRecord: item => {
        const { reload } = _this;
        VnrLoadingSevices.show();
        //get record, valid config
        HttpService.MultiRequest([
            HttpService.Get('[URI_POR]/New_Hre_Tas_Task/GetById?ID=' + item.ID),
            HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=Hre_Tas_Task')
        ]).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res) {
                    let record = null,
                        fieldValid = null;

                    //set value cho dataItem
                    if (res['0']) {
                        record = { ...res['0'] };
                    }

                    //set fieldValid
                    if (res['1']) {
                        fieldValid = res['1'];
                    }

                    DrawerServices.navigate('HreTaskTabEdit', {
                        dataItem: item,
                        recordID: item.ID,
                        reload,
                        newRecord: record ? { ...record } : null,
                        fieldValid: fieldValid ? { ...fieldValid } : null,
                        update: TaskBusinessBusinessFunction.updateRecord,
                        updateNewRecord: TaskBusinessBusinessFunction.updateNewRecord
                    });

                    newRecord = record ? { ...record } : null;
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    },
    updateRecord: reload => {
        let params = {
            ...newRecord,
            AssignmentDate: newRecord.AssignmentDate
                ? moment(newRecord.AssignmentDate).format('YYYY-MM-DD HH:mm:ss')
                : null,
            ExpectedDate: newRecord.ExpectedDate ? moment(newRecord.ExpectedDate).format('YYYY-MM-DD HH:mm:ss') : null,
            FinishDate: newRecord.FinishDate ? moment(newRecord.FinishDate).format('YYYY-MM-DD HH:mm:ss') : null,
            EvaluationDate: newRecord.EvaluationDate
                ? moment(newRecord.EvaluationDate).format('YYYY-MM-DD HH:mm:ss')
                : null,
            IsSaveAndNotice: true
        };

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Tas_Task', params).then(data => {
            VnrLoadingSevices.hide();
            try {
                if (data.ActionStatus !== 'Success') {
                    ToasterSevice.showWarning(data.ActionStatus);
                } else {
                    ToasterSevice.showSuccess('Hrm_Succeed');
                    TaskBusinessBusinessFunction.checkForLoadEditDelete = {
                        HreTaskAssign: true,
                        HreTaskAssigned: true,
                        HreTaskFollow: true
                    };
                    if (reload && typeof reload === 'function') {
                        reload();
                        DrawerServices.navigate('TopTabHreTaskManagerment');
                    }
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    },
    updateNewRecord: obj => {
        newRecord = {
            ...newRecord,
            ...obj
        };
    },
    //#endregion

    //#region [modify for TaskAssign]
    businessModifyRecordForTaskAssigned: item => {
        const { reload } = _this;
        VnrLoadingSevices.show();
        //get record, valid config
        HttpService.MultiRequest([
            HttpService.Get('[URI_POR]/New_Hre_Tas_Task/GetById?ID=' + item.ID),
            HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=Hre_Tas_Task')
        ]).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res) {
                    let record = null,
                        fieldValid = null;

                    //set value cho dataItem
                    if (res['0']) {
                        record = { ...res['0'] };
                    }

                    //set fieldValid
                    if (res['1']) {
                        fieldValid = res['1'];
                    }

                    DrawerServices.navigate('HreTaskTabEdit', {
                        roleEditStatusOnly: true,
                        dataItem: item,
                        recordID: item.ID,
                        reload,
                        newRecord: record ? { ...record } : null,
                        fieldValid: fieldValid ? { ...fieldValid } : null,
                        update: TaskBusinessBusinessFunction.updateRecord,
                        updateNewRecord: TaskBusinessBusinessFunction.updateNewRecord
                    });

                    newRecord = record ? { ...record } : null;
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    },
    //#endregion
    //#region [modify Evalution]
    updateEvaluationRecord: reload => {
        try {
            let dataBody = {
                ...newRecord,
                Status: 'E_EVALUATED',
                StatusView: 'E_EVALUATED',
                IsSaveAndNotice: true
            };

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/api/Tas_TaskEvaluationWeb', dataBody)
                .then(res => {
                    VnrLoadingSevices.hide();
                    if (res && Object.keys(res).length > 0 && res.Score !== undefined) {
                        ToasterSevice.showSuccess('Hrm_Succeed');
                        if (reload && typeof reload === 'function') {
                            reload();
                            DrawerServices.navigate('HreTaskEvaluation');
                        }
                    } else if (res && typeof res === 'string') {
                        ToasterSevice.showWarning(res);
                    } else {
                        ToasterSevice.showWarning('Hrm_Fail');
                    }
                })
                .catch(() => {
                    VnrLoadingSevices.hide();
                });
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    },
    businessEvaluationRecord: item => {
        const { reload } = _this;
        VnrLoadingSevices.show();
        //get record, valid config
        HttpService.MultiRequest([
            HttpService.Get('[URI_POR]/New_Hre_Tas_Task/GetById?ID=' + item.ID),
            HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=Hre_Tas_Task')
        ]).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res) {
                    let record = null,
                        fieldValid = null;

                    //set value cho dataItem
                    if (res['0']) {
                        record = { ...res['0'] };
                    }

                    //set fieldValid
                    if (res['1']) {
                        fieldValid = res['1'];
                    }

                    DrawerServices.navigate('HreTaskTabEditEvaluation', {
                        recordID: item.ID,
                        reload,
                        dataItem: item,
                        newRecord: record ? { ...record } : null,
                        fieldValid: fieldValid ? { ...fieldValid } : null,
                        update: TaskBusinessBusinessFunction.updateEvaluationRecord,
                        updateNewRecord: TaskBusinessBusinessFunction.updateNewRecord
                    });

                    newRecord = record ? { ...record } : null;
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    }
    //#endregion
};

export default {
    generateRowActionAndSelected: generateRowActionAndSelected,
    TaskBusinessBusinessFunction: TaskBusinessBusinessFunction
};
