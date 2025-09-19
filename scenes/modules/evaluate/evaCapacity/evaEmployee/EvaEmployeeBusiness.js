/* eslint-disable no-unused-vars */
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName } from '../../../../../assets/constant';

const enumName = EnumName,
    EvaEmployee = ScreenName.EvaEmployee;

// eslint-disable-next-line no-unused-vars
let _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];

    const permission = PermissionForAppMobile.value;

    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[EvaEmployee],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_MODIFY, E_ResourceName, E_Name, E_Rule, E_SENDMAIL, E_DELETE, E_CANCEL } = enumName;

        return { rowActions: _rowActions, selected: _selected };
    }
};

export const EvaEmployeeBusinessFunction = {
    setThisForBusiness: dataThis => {
        _this = dataThis;
    }
};
