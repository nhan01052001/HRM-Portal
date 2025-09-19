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
                    onPress: (item) => RelativeConfirmedBusinessFunction.businessModifyRecord(item),
                    ...actionEdit
                }
            ];
        }

        return { rowActions: _rowActions, selected: _selected };
    }
};

export const RelativeConfirmedBusinessFunction = {
    checkForLoadEditDelete: {
        // [ScreenName.RelativeConfirmed]: false,
        // [ScreenName.RelativeEdit]: false,
        // [ScreenName.RelativeWaitConfirm]: false
    },
    setThisForBusiness: (dataThis) => {
        // if (navigation && navigation.state && navigation.state.routeName === screenName) {
        _this = dataThis;
        // }
    },

    //#region [modify]
    businessModifyRecord: item => {
        const { reload } = _this;
        //get record, valid config

        VnrLoadingSevices.show();
        HttpService.Get(`[URI_HR]/api/Hre_ApprovedRelatives/GetById?ID=${item.ID}`).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res && res.ActionStatus == EnumName.E_Success) {
                    DrawerServices.navigate('RelativeAddOrEdit', {
                        record: res,
                        reload: reload,
                        screenName: ScreenName.RelativeWaitConfirm
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
