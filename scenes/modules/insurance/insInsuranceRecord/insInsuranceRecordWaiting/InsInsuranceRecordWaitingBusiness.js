import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../../utils/HttpService';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName } from '../../../../../assets/constant';
import DrawerServices from '../../../../../utils/DrawerServices';

const enumName = EnumName,
    InsInsuranceRecordWaiting = ScreenName.InsInsuranceRecordWaiting,
    InsInsuranceRecordWaitingAddOrEdit = ScreenName.InsInsuranceRecordWaitingAddOrEdit;

let _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];

    const permission = PermissionForAppMobile.value;

    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[InsInsuranceRecordWaiting],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_MODIFY, E_ResourceName, E_Name, E_Rule } = enumName;
        const actionEdit = businessAction ? businessAction.find((action) => action.Type === E_MODIFY) : null,
            actionEditResource = actionEdit ? actionEdit[E_ResourceName][E_Name] : null,
            actionEditRule = actionEdit ? actionEdit[E_ResourceName][E_Rule] : null,
            actionEditPer =
                actionEditResource && actionEditRule ? permission[actionEditResource][actionEditRule] : null;

        if (actionEditPer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_Common_InsRecordWaiting_Edit'),
                    type: E_MODIFY,
                    onPress: (item, dataBody) =>
                        InsInsuranceRecordWaitingBusinessFunction.businessModifyRecord({ ...item }, dataBody),
                    ...actionEdit
                }
            ];
        }

        return { rowActions: _rowActions, selected: _selected };
    }
};

export const InsInsuranceRecordWaitingBusinessFunction = {
    setThisForBusiness: (dataThis) => {
        _this = dataThis;
    },
    //#region [modify]
    businessModifyRecord: (item) => {
        //view detail hoặc chọn 1 dòng từ lưới
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Ins_GetData/GetInsuranceRecordById', {
            id: item.ID,
            screenName: InsInsuranceRecordWaitingAddOrEdit
        }).then((res) => {
            VnrLoadingSevices.hide();
            try {
                if (res) {
                    const { reload } = _this;
                    _this.props.navigation.navigate(InsInsuranceRecordWaitingAddOrEdit, { record: res, reload });
                } else {
                    ToasterSevice.showWarning('StatusNotAction');
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    }
    //#endregion
};
