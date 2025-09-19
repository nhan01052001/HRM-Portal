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

let enumName = EnumName,
    _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = screenName => {
    _rowActions = [];
    _selected = [];
    // screenName = screenName;
    const permission = PermissionForAppMobile.value;

    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[screenName],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_MODIFY, E_ResourceName, E_Name, E_Rule, E_DELETE } = enumName;


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
                    onPress: (item) => HouseholdBusinessFunction.businessModifyRecord(item, screenName),
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
                        HouseholdBusinessFunction.businessDeleteRecords([{ ...item }], dataBody, screenName),
                    ...actionDelete
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Delete'),
                    type: E_DELETE,
                    onPress: (item, dataBody) =>
                        HouseholdBusinessFunction.businessDeleteRecords(item, dataBody, screenName),
                    ...actionDelete
                }
            ];
        }


        return { rowActions: _rowActions, selected: _selected };
    }
};

export const HouseholdBusinessFunction = {
    checkForLoadEditDelete: {
        [ScreenName.HouseholdConfirmed]: false,
        [ScreenName.HouseholdWaitConfirm]: false
    },
    setThisForBusiness: (dataThis) => {
        // if (navigation && navigation.state && navigation.state.routeName === screenName) {
        _this = dataThis;
        // }
    },
    businessDeleteRecords: (items, dataBody, screenName) => {
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
                    HouseholdBusinessFunction.checkingDataWorkingForTaskDelete(selectedID, screenName);
                }
            });
        }
    },
    checkingDataWorkingForTaskDelete: (selectedID, screenName) => {
        if (Array.isArray(selectedID) && selectedID.length > 0) {
            let apiGetByID = null;
            VnrLoadingSevices.show();
            //get record, valid config
            //https://demo13.vnresource.net:1040//Att_GetData/DeleteOrRemoveEdit
            //https://demo13.vnresource.net:1040//Att_GetData/DeleteOrRemoveAdd
            if (screenName == ScreenName.HouseholdWaitConfirm) {
                apiGetByID = '[URI_HR]/Att_GetData/DeleteOrRemoveAdd';
            } else if (screenName == ScreenName.HouseholdEdit) {
                apiGetByID = '[URI_HR]/Att_GetData/DeleteOrRemoveEdit';
            }

            if (apiGetByID != null) {
                HttpService.Post(apiGetByID, {
                    selectedIds: selectedID,
                    profileId: dataVnrStorage.currentUser.info.ProfileID
                }).then(res => {
                    VnrLoadingSevices.hide();
                    try {
                        if (res && res === 'Success') {
                            ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                            // TaskBusinessBusinessFunction.checkForLoadEditDelete = {
                            //     HreTaskAssign: true,
                            //     HreTaskAssigned: true,
                            //     HreTaskFollow: true
                            // };
                            _this.reload('E_KEEP_FILTER', true);
                        } else {
                            ToasterSevice.showError('Hrm_Fail', 4000);
                        }
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });
            }
        }
    },

    //#region [modify]
    businessModifyRecord: (item, screenName) => {
        const { reload } = _this;
        let apiGetByID = null;

        //get record, valid config

        if (screenName == ScreenName.HouseholdWaitConfirm) {
            apiGetByID = '[URI_HR]/Hre_GetData/GetByIdAdd_Households?ID=';
        } else if (screenName == ScreenName.HouseholdConfirmed) {
            apiGetByID = '[URI_HR]/api//Hre_ApprovedHouseholds/GetById?ID=';
        } else if (screenName == ScreenName.HouseholdEdit) {
            apiGetByID = '[URI_HR]/Hre_GetData/GetByIdEdit_Households?ID=';
        }

        if (apiGetByID != null) {
            VnrLoadingSevices.show();
            HttpService.Get(apiGetByID + item.ID).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (
                        res &&
                        (res.ActionStatus == EnumName.E_Success || res.ActionStatus == 'Thao tác thành công')
                        // && res.BusinessAllowAction && res.BusinessAllowAction.indexOf('E_MODIFY') >= 0
                    ) {
                        DrawerServices.navigate('HouseholdAddOrEdit', {
                            record: res,
                            reload: reload,
                            screenName: screenName
                        });
                    } else {
                        ToasterSevice.showWarning('StatusNotAction');
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        }
    },
    businessCreateOrEditRecord: (params, isModify, screenName) => {
        VnrLoadingSevices.show();

        HttpService.Post('[URI_HR]/api/Hre_ApprovedProfileQualification', params).then(data => {
            if (
                data.ActionStatus == 'Thao tác thành công' ||
                data.ActionStatus == 'Cập nhật thành công' ||
                data.ActionStatus == 'E_SUCCESS'
            ) {
                VnrLoadingSevices.hide();
                ToasterSevice.showSuccess('Hrm_Succeed', 4000);

                // Nếu Edit ở màn hình đã xác nhận thì reload lại màn hình danh sách chỉnh sửa
                if (isModify && screenName == ScreenName.HouseholdConfirmed) {
                    HouseholdBusinessFunction.checkForLoadEditDelete[ScreenName.HouseholdEdit] = true;
                    // if(screenName == ScreenName.Quan)
                } else {
                    // Nếu tạo mới thì reload list Chờ xác nhận
                    HouseholdBusinessFunction.checkForLoadEditDelete[ScreenName.HouseholdWaitConfirm] = true;
                }

                _this.reload();
                DrawerServices.navigate(screenName);
            } else {
                VnrLoadingSevices.hide();
                ToasterSevice.showWarning(data.ActionStatus);
            }
        });
    }
};
