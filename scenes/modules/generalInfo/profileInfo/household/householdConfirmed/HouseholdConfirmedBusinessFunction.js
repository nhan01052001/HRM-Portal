import { ToasterSevice } from '../../../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../../../utils/HttpService';
import { translate } from '../../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../../assets/configProject/PermissionForAppMobile';
import { ConfigList } from '../../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName } from '../../../../../../assets/constant';
import DrawerServices from '../../../../../../utils/DrawerServices';

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
            { E_MODIFY, E_ResourceName, E_Name, E_Rule } = enumName;


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
                    onPress: (item) => HouseholdConfirmedBusinessFunction.businessModifyRecord(item),
                    ...actionEdit
                }
            ];
        }

        return { rowActions: _rowActions, selected: _selected };
    }
};

export const HouseholdConfirmedBusinessFunction = {
    checkForLoadEditDelete: {

    },
    setThisForBusiness: (dataThis) => {
        _this = dataThis;
    },

    //#region [modify]
    businessModifyRecord: item => {
        const { reload } = _this;
        //get record, valid config

        VnrLoadingSevices.show();
        HttpService.Get(`[URI_HR]/api/Hre_ApprovedHouseholdInfo/GetById?ID=${item.ID}`).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res && res.ActionStatus == EnumName.E_Success) {
                    DrawerServices.navigate('HouseholdAddOrEdit', {
                        record: res,
                        reload: reload,
                        screenName: ScreenName.HouseholdWaitConfirm
                    });
                } else {
                    ToasterSevice.showWarning('StatusNotAction');
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    }
};
