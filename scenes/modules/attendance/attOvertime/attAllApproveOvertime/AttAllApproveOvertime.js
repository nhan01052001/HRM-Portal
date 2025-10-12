import React, { Component } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import VnrListItemAction from '../../../../../components/VnrListItem/VnrListItemAction';
import { styleSheets, Colors, Size, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { IconCreate } from '../../../../../constants/Icons';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../../utils/HttpService';
import { translate } from '../../../../../i18n/translate';
import VnrFilterCommon from '../../../../../components/VnrFilter/VnrFilterCommon';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumIcon } from '../../../../../assets/constant';

let permission = null,
    configList = null,
    enumName = null,
    attSubmitLeaveDay = null,
    attSubmitLeaveDayViewDetail = null;

export default class AttAllApproveOvertime extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataBody: null,
            rowActions: [],
            selected: []
        };

        this.storeParamsDefault = null;
        props.navigation.setParams({ reload: this.reload.bind(this) });
    }

    static navigationOptions = ({ navigation }) => {
        const { params = {} } = navigation.state;
        return {
            headerRight: true && (
                <TouchableOpacity
                    onPress={() => navigation.navigate('AttSubmitLeaveDayAddOrEdit', { reload: () => params.reload() })}
                >
                    <View style={styleSheets.bnt_HeaderRight}>
                        <IconCreate color={Colors.white} size={Size.iconSizeHeader} />
                    </View>
                </TouchableOpacity>
            )
        };
    };

    reload = paramsFilter => {
        let _paramsDefault = this.storeParamsDefault;
        _paramsDefault = { ..._paramsDefault, dataBody: { ..._paramsDefault.dataBody, ...paramsFilter } };
        this.setState(_paramsDefault);
    };

    paramsDefault = () => {
        const _configList = configList[attSubmitLeaveDay],
            renderRow = _configList[enumName.E_Row],
            orderBy = _configList[enumName.E_Order],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_MODIFY, E_ResourceName, E_Name, E_Rule, E_SENDMAIL, E_object, E_DELETE, E_CANCEL } = enumName;

        let _rowActions = [],
            _selected = [];
        //debugger

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
                    title: translate('HRM_Common_Modify'),
                    type: E_MODIFY,
                    isSheet: false,
                    onPress: item => this.businessModifyRecord(item),
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
                    isSheet: false,
                    onPress: item => {
                        if (item && typeof item === E_object) {
                            const toArray = [{ ...item }];
                            this.businessSendMailRecords(toArray);
                        } else {
                            this.businessSendMailRecords([]);
                        }
                    },
                    ...actionSendMail
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_SendMail'),
                    type: E_SENDMAIL,
                    onPress: items => this.businessSendMailRecords(items),
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
                    isSheet: false,
                    onPress: item => {
                        if (item && typeof item === E_object) {
                            const toArray = [{ ...item }];
                            this.businessDeleteRecords(toArray);
                        } else {
                            this.businessDeleteRecords([]);
                        }
                    },
                    ...actionDelete
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Delete'),
                    type: E_DELETE,
                    onPress: item => this.businessDeleteRecords(item),
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
                    isSheet: false,
                    onPress: item => {
                        if (item && typeof item === E_object) {
                            const toArray = [{ ...item }];
                            this.businessCancelRecords(toArray);
                        } else {
                            this.businessCancelRecords([]);
                        }
                    },
                    ...actionCancel
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Cancel'),
                    type: E_CANCEL,
                    onPress: item => this.businessCancelRecords(item),
                    ...actionCancel
                }
            ];
        }

        let _params = {
            // IsPortal: true,
            // UserSubmit: "136a8e27-7bc2-4e09-b434-6367f49b9304",
            // UserCreateID: "136a8e27-7bc2-4e09-b434-6367f49b9304",
            // IsPortalApp: true,
            sort: orderBy
        };

        return {
            rowActions: _rowActions,
            selected: _selected,
            renderRow: renderRow,
            dataBody: _params
        };
    };

    componentDidMount() {
        //set by config
        permission = PermissionForAppMobile.value;
        configList = ConfigList.value;
        enumName = EnumName;
        attSubmitLeaveDay = ScreenName.AttSubmitLeaveDay;
        attSubmitLeaveDayViewDetail = ScreenName.AttSubmitLeaveDayViewDetail;

        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);
    }

    //#region [action delete]
    businessDeleteRecords = items => {
        if (items.length === 0) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map(item => {
                return item.ID;
            });

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionDelete', {
                selectedID,
                screenName: 'AttSubmitRoster'
            })
                .then(res => {
                    try {
                        if (res && typeof res === 'object') {
                            let isValid = res.isValid;
                            if (isValid) {
                                this.confirmDelete(res);
                                VnrLoadingSevices.hide();
                            } else if (isValid == false && res.message && typeof res.message === 'string') {
                                ToasterSevice.showWarning(res.message, 4000);
                                VnrLoadingSevices.hide();
                            } else {
                                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                VnrLoadingSevices.hide();
                            }
                        } else {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                            VnrLoadingSevices.hide();
                        }
                    } catch (error) {
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                        VnrLoadingSevices.hide();
                    }
                })
                .catch(() => {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                    VnrLoadingSevices.hide();
                });
        }
    };

    confirmDelete = objValid => {
        let { rowActions } = this.state,
            actionCancel = rowActions.find(item => item.Type === 'E_DELETE'),
            isConfirm = actionCancel['Confirm'];

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
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
                        VnrLoadingSevices.show();
                        let strId =
                            objValid.strResultID && typeof objValid.strResultID === 'string'
                                ? objValid.strResultID
                                : '';
                        HttpService.Post('[URI_POR]/New_Att_Roster/RemoveSelected', {
                            selectedIds: strId.split(','),
                            reason
                        })
                            .then(res => {
                                try {
                                    if (res && res !== '') {
                                        if (res == 'Success') {
                                            ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                                        } else if (res == 'Locked') {
                                            ToasterSevice.showWarning('Hrm_Locked', 4000);
                                        } else {
                                            ToasterSevice.showWarning(res, 4000);
                                        }
                                    } else {
                                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                    }

                                    VnrLoadingSevices.hide();

                                    let _dataBody = { ...this.storeParamsDefault };
                                    this.setState(_dataBody);
                                } catch (error) {
                                    VnrLoadingSevices.hide();
                                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                    let _dataBody = { ...this.storeParamsDefault };
                                    this.setState(_dataBody);
                                }
                            })
                            .catch(() => {
                                VnrLoadingSevices.hide();
                                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);

                                let _dataBody = { ...this.storeParamsDefault };
                                this.setState(_dataBody);
                            });
                    }
                }
            });
        } else {
            VnrLoadingSevices.show();
            let strId = objValid.strResultID && typeof objValid.strResultID === 'string' ? objValid.strResultID : '';
            HttpService.Post('[URI_POR]/New_Att_Roster/RemoveSelected', {
                selectedIds: strId.split(',')
            })
                .then(res => {
                    try {
                        if (res && res !== '') {
                            if (res == 'Success') {
                                ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                            } else if (res == 'Locked') {
                                ToasterSevice.showWarning('Hrm_Locked', 4000);
                            } else {
                                ToasterSevice.showWarning(res, 4000);
                            }
                        } else {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                        }

                        VnrLoadingSevices.hide();

                        let _dataBody = { ...this.storeParamsDefault };
                        this.setState(_dataBody);
                    } catch (error) {
                        VnrLoadingSevices.hide();
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                        let _dataBody = { ...this.storeParamsDefault };
                        this.setState(_dataBody);
                    }
                })
                .catch(() => {
                    VnrLoadingSevices.hide();
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);

                    let _dataBody = { ...this.storeParamsDefault };
                    this.setState(_dataBody);
                });
        }
    };
    //#endregion

    //#region [action send mail]
    businessSendMailRecords = items => {
        if (items.length === 0) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map(item => {
                return item.ID;
            });

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionSendEmail', {
                selectedID,
                screenName: 'AttSubmitRoster'
            })
                .then(res => {
                    try {
                        if (res && typeof res === 'object') {
                            let isValid = res.isValid;
                            if (isValid == true) {
                                this.confirmSendMail(res);
                                VnrLoadingSevices.hide();
                            } else if (isValid == false && res.message && typeof res.message === 'string') {
                                ToasterSevice.showWarning(res.message, 4000);
                                VnrLoadingSevices.hide();
                            } else {
                                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                VnrLoadingSevices.hide();
                            }
                        } else {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                            VnrLoadingSevices.hide();
                        }
                    } catch (error) {
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                        VnrLoadingSevices.hide();
                    }
                })
                .catch(() => {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                    VnrLoadingSevices.hide();
                });
        }
    };

    confirmSendMail = objValid => {
        let { rowActions } = this.state,
            actionCancel = rowActions.find(item => item.Type === 'E_SENDMAIL'),
            isConfirm = actionCancel['Confirm'];

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
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
                        let strId =
                            objValid.strResultID && typeof objValid.strResultID === 'string'
                                ? objValid.strResultID
                                : '';

                        HttpService.Post('[URI_HR]/Att_GetData/ProcessingSendMailRoster', {
                            host: _uriPor,
                            selectedIds: strId.split(','),
                            reason
                        })
                            .then(res => {
                                try {
                                    if (res && res.success) {
                                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                                    } else {
                                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                    }
                                    VnrLoadingSevices.hide();
                                    let _dataBody = { ...this.storeParamsDefault };
                                    this.setState(_dataBody);
                                } catch (error) {
                                    VnrLoadingSevices.hide();
                                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                    let _dataBody = { ...this.storeParamsDefault };
                                    this.setState(_dataBody);
                                }
                            })
                            .catch(() => {
                                VnrLoadingSevices.hide();
                                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                let _dataBody = { ...this.storeParamsDefault };
                                this.setState(_dataBody);
                            });
                    }
                }
            });
        } else {
            VnrLoadingSevices.show();
            let strId = objValid.strResultID && typeof objValid.strResultID === 'string' ? objValid.strResultID : '';

            const { apiConfig } = dataVnrStorage,
                _uriPor = apiConfig ? apiConfig.uriPor : null;

            HttpService.Post('[URI_HR]/Att_GetData/ProcessingSendMailRoster', {
                host: _uriPor,
                selectedIds: strId.split(',')
            })
                .then(res => {
                    try {
                        if (res && res.success) {
                            ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        } else {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                        }
                        VnrLoadingSevices.hide();
                        let _dataBody = { ...this.storeParamsDefault };
                        this.setState(_dataBody);
                    } catch (error) {
                        VnrLoadingSevices.hide();
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                        let _dataBody = { ...this.storeParamsDefault };
                        this.setState(_dataBody);
                    }
                })
                .catch(() => {
                    VnrLoadingSevices.hide();
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                    let _dataBody = { ...this.storeParamsDefault };
                    this.setState(_dataBody);
                });
        }
    };
    //#endregion

    //#region [action cancel]
    businessCancelRecords = items => {
        if (items.length === 0) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = items.map(item => {
                return item.ID;
            });

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/BusinessAllowActionCancel', {
                selectedID,
                screenName: 'AttSubmitRoster'
            })
                .then(res => {
                    try {
                        if (res && typeof res === 'object') {
                            let isValid = res.isValid;
                            if (isValid) {
                                this.confirmCancel(res);
                                VnrLoadingSevices.hide();
                            } else if (isValid == false && res.message && typeof res.message === 'string') {
                                ToasterSevice.showWarning(res.message, 4000);
                                VnrLoadingSevices.hide();
                            } else {
                                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                VnrLoadingSevices.hide();
                            }
                        } else {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                            VnrLoadingSevices.hide();
                        }
                    } catch (error) {
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                        VnrLoadingSevices.hide();
                    }
                })
                .catch(() => {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                    VnrLoadingSevices.hide();
                });
        }
    };

    confirmCancel = objValid => {
        let { rowActions } = this.state,
            actionCancel = rowActions.find(item => item.Type === 'E_CANCEL'),
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

                        HttpService.Post('[URI_HR]/Att_GetData/ChangeStatusCancelRosters', {
                            selectedIDs: strId,
                            commentCancel: reason
                        })
                            .then(res => {
                                try {
                                    if (res && res !== '') {
                                        if (res == 'Success') {
                                            ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                                        } else if (res == 'Locked') {
                                            ToasterSevice.showWarning('Hrm_Locked', 4000);
                                        } else {
                                            ToasterSevice.showWarning(res, 4000);
                                        }
                                    } else {
                                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                    }

                                    VnrLoadingSevices.hide();

                                    let _dataBody = { ...this.storeParamsDefault };
                                    this.setState(_dataBody);
                                } catch (error) {
                                    VnrLoadingSevices.hide();
                                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);

                                    let _dataBody = { ...this.storeParamsDefault };
                                    this.setState(_dataBody);
                                }
                            })
                            .catch(() => {
                                VnrLoadingSevices.hide();
                                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                                let _dataBody = { ...this.storeParamsDefault };
                                this.setState(_dataBody);
                            });
                    }
                }
            });
        } else {
            VnrLoadingSevices.show();

            let strId = objValid.strResultID && typeof objValid.strResultID === 'string' ? objValid.strResultID : '';

            HttpService.Post('[URI_HR]/Att_GetData/ChangeStatusCancelRosters', {
                selectedIDs: strId
            })
                .then(res => {
                    try {
                        if (res && res !== '') {
                            if (res == 'Success') {
                                ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                            } else if (res == 'Locked') {
                                ToasterSevice.showWarning('Hrm_Locked', 4000);
                            } else {
                                ToasterSevice.showWarning(res, 4000);
                            }
                        } else {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                        }

                        VnrLoadingSevices.hide();

                        let _dataBody = { ...this.storeParamsDefault };
                        this.setState(_dataBody);
                    } catch (error) {
                        VnrLoadingSevices.hide();
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);

                        let _dataBody = { ...this.storeParamsDefault };
                        this.setState(_dataBody);
                    }
                })
                .catch(() => {
                    VnrLoadingSevices.hide();
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                    let _dataBody = { ...this.storeParamsDefault };
                    this.setState(_dataBody);
                });
        }
    };
    //#endregion

    //#region [modify]
    businessModifyRecord = item => {
        const { reload } = this.props.navigation.state.params;
        this.props.navigation.navigate('AttSubmitRosterAddOrEdit', { record: item, reload });
    };
    //#endregion

    render() {
        const { dataBody, renderRow, rowActions, selected } = this.state;
        return (
            <SafeAreaView {...styleSafeAreaView}>
                {attSubmitLeaveDay && attSubmitLeaveDayViewDetail && (
                    <View style={[styleSheets.container]}>
                        <VnrFilterCommon screenName={attSubmitLeaveDay} onSubmitEditing={this.reload} />

                        <View style={[styleSheets.col_10]}>
                            {dataBody && (
                                <VnrListItemAction
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: attSubmitLeaveDayViewDetail,
                                        screenName: attSubmitLeaveDay
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    api={{
                                        urlApi: '[URI_HR]/Att_GetData/New_GetLeaveDayByFilter',
                                        type: 'E_POST',
                                        dataBody: dataBody,
                                        pageSize: 20
                                    }}
                                    valueField="ID"
                                    renderConfig={renderRow}
                                />
                            )}
                        </View>
                    </View>
                )}
            </SafeAreaView>
        );
    }
}
