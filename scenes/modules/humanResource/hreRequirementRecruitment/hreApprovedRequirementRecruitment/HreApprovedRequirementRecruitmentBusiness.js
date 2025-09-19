/* eslint-disable no-unused-vars */
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName } from '../../../../../assets/constant';

let enumName = EnumName,
    hreApprovedRequirementRecruitment = ScreenName.HreApprovedRequirementRecruitment;

// eslint-disable-next-line no-unused-vars
let _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];

    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[hreApprovedRequirementRecruitment],
            businessAction = _configList[enumName.E_BusinessAction];

        return { rowActions: _rowActions, selected: _selected };
    }
};

export const HreApprovedRequirementRecruitmentBusinessFunction = {
    setThisForBusiness: (dataThis) => {
        _this = dataThis;
    }
};
