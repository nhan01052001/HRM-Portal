/* eslint-disable no-unused-vars */
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName } from '../../../../../assets/constant';

let enumName = EnumName,
    hreApprovedWorkHistorySalary = ScreenName.HreApprovedWorkHistorySalary

let _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];

    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[hreApprovedWorkHistorySalary],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_ResourceName, E_Name, E_Rule, E_CANCEL } = enumName;

        return { rowActions: _rowActions, selected: _selected };
    }
};

export const HreApprovedWorkHistorySalaryBusinessFunction = {
    setThisForBusiness: dataThis => {
        _this = dataThis;
    }
};
