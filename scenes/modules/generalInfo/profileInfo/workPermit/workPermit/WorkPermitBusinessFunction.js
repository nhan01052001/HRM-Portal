/* eslint-disable no-unused-vars */

import { PermissionForAppMobile } from '../../../../../../assets/configProject/PermissionForAppMobile';
import { dataVnrStorage } from '../../../../../../assets/auth/authentication';
import { ConfigList } from '../../../../../../assets/configProject/ConfigList';
import { EnumName } from '../../../../../../assets/constant';

let enumName = EnumName,
    // screenName = null,
    //hreTaskAssigned = ScreenName.HreTaskAssigned,
    apiConfig = null,
    headers = null,
    _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = screenName => {
    _rowActions = [];
    _selected = [];
    apiConfig = dataVnrStorage.apiConfig;
    headers = dataVnrStorage.currentUser.headers;
    // screenName = screenName;

    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[screenName],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_MODIFY, E_ResourceName, E_Name, E_Rule, E_EVALUATION, E_DELETE, E_CANCEL } = enumName;

        return { rowActions: _rowActions, selected: _selected };
    }
};

export const WorkPermitBusinessFunction = {
    checkForLoadEditDelete: {
        // [ScreenName.PassportConfirmed]: false,
        // [ScreenName.PassportEdit]: false,
        // [ScreenName.PassportWaitConfirm]: false
    },
    setThisForBusiness: (dataThis, navigation, screenName) => {
        // if (navigation && navigation.state && navigation.state.routeName === screenName) {
        _this = dataThis;
        // }
    }
};
