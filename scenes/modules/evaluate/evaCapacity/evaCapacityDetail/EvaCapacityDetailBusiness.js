import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName } from '../../../../../assets/constant';

let enumName = EnumName,
    screenName = ScreenName.EvaPerformanceWait,
    //hreTaskAssigned = ScreenName.HreTaskAssigned,
    // eslint-disable-next-line no-unused-vars
    _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = () => {
    _rowActions = [];
    _selected = [];

    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[screenName],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_ResourceName, E_Name, E_Rule, E_EVALUATION } = enumName;

        //action Evaluate ( cho màn hình đánh giá nhân viên )
        const actionEvaluate = businessAction ? businessAction.find((action) => action.Type === E_EVALUATION) : null,
            actionEvaluateResource = actionEvaluate ? actionEvaluate[E_ResourceName][E_Name] : null,
            actionEvaluateRule = actionEvaluate ? actionEvaluate[E_ResourceName][E_Rule] : null,
            actionEvaluatePer =
                actionEvaluateResource && actionEvaluateRule
                    ? permission[actionEvaluateResource][actionEvaluateRule]
                    : null;

        if (actionEvaluatePer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_System_Resource_Evaluation'),
                    type: E_EVALUATION,
                    onPress: (item) => EvaCapacityDetailBusinessFunction.businessEvaluationRecord(item),
                    ...actionEvaluate
                }
            ];
        }

        return { rowActions: _rowActions, selected: _selected };
    }
};

export const EvaCapacityDetailBusinessFunction = {
    checkForLoadEditDelete: {
        EvaPerformanceWaitEvaluation: false
    },
    setThisForBusiness: (dataThis) => {
        _this = dataThis;
    },
    //#region [Evalution]
    businessEvaluationRecord: () => {
        // const { reload } = _this;
        // VnrLoadingSevices.show();
        // debugger
        // HttpService.Get('[URI_POR]/New_PersonalWaitingEvaluation/GetById?ID=' + item.ID)
        //     .then(res => {
        //         VnrLoadingSevices.hide();
        //         try {
        //             if (res && res.ActionStatus == EnumName.E_Success) {
        //                 DrawerServices.navigate('EvaPerformanceWaitEvaluation', {
        //                     recordID: item.ID,
        //                     reloadList: reload,
        //                     dataItem: res,
        //                 });
        //             }
        //         } catch (error) {
        //             DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        //         }
        //     })
    }
    //#endregion
};
