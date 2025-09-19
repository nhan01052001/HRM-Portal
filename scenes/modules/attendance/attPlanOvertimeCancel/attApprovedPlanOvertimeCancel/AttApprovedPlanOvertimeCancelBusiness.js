import { ConfigList } from '../../../../../assets/configProject/ConfigList';
let _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];

    if (ConfigList.value != null && ConfigList.value != undefined) {
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const AttApprovedPlanOvertimeCancelBusinessFunction = {
    setThisForBusiness: () => {

    }
};
