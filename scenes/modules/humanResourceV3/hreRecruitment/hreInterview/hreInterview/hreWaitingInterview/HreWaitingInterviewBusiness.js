/* eslint-disable no-unused-vars */
import { translate } from '../../../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../../../assets/configProject/PermissionForAppMobile';
import { dataVnrStorage } from '../../../../../../../assets/auth/authentication';
import { ConfigList } from '../../../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName } from '../../../../../../../assets/constant';

let enumName = EnumName;

let _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = (screenName) => {
    _rowActions = [];
    _selected = [];
    screenName = screenName != null ? screenName : ScreenName.HreWaitingInterview;
    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined && screenName != null) {
        const _configList = ConfigList.value[screenName]
            ? ConfigList.value[screenName]
            : {
                Api: {
                    urlApi: '[URI_CENTER]/api/Att_GetData/New_GetAnnualDetailPersonal',
                    type: 'POST',
                    pageSize: 20
                },
                Order: [
                    {
                        field: 'TimeLog',
                        dir: 'desc'
                    }
                ],
                Filter: [
                    {
                        logic: 'and',
                        filters: []
                    }
                ],
                Row: [
                    {
                        TypeView: 'E_STATUS',
                        Name: 'Status',
                        DisplayKey: '',
                        DataType: 'string'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'InterviewSchedule',
                        DisplayKey: 'HRM_PortalApp_InterviewSchedule',
                        DataType: 'string'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'JobVacancyName',
                        DisplayKey: 'HRM_PortalApp_jobVacancy',
                        DataType: 'string'
                    }
                ],
                BusinessAction: [
                    {
                        Type: 'E_ENTER_INTERVIEW',
                        Resource: {
                            Name: 'New_PortalV3_Rec_InterviewPlan_CreateInterviewResult',
                            Rule: 'View'
                        },
                        Confirm: {
                            isInputText: true,
                            isValidInputText: false
                        }
                    },
                    {
                        Type: 'E_MODIFY',
                        Resource: {
                            Name: 'New_PortalV3_Rec_InterviewPlan_CreateInterviewResult',
                            Rule: 'View'
                        },
                        Confirm: {
                            isInputText: true,
                            isValidInputText: false
                        }
                    }
                ]
            };
        if (_configList) {
            const businessAction = _configList[enumName.E_BusinessAction],
                { E_ResourceName, E_Name, E_Rule, E_ENTER_INTERVIEW, E_MODIFY } = enumName;

            //action Create
            const actionEnterInterView = businessAction
                    ? businessAction.find((action) => action.Type === E_ENTER_INTERVIEW)
                    : null,
                actionEnterInterViewResource = actionEnterInterView ? actionEnterInterView[E_ResourceName][E_Name] : null,
                actionEnterInterViewRule = actionEnterInterView ? actionEnterInterView[E_ResourceName][E_Rule] : null,
                actionEnterInterViewPer =
                        actionEnterInterViewResource && actionEnterInterViewRule
                            ? permission[actionEnterInterViewResource][actionEnterInterViewRule]
                            : null;

            if (actionEnterInterViewPer) {
                _rowActions = [
                    ..._rowActions,
                    {
                        title: translate('HRM_PortalApp_InputResult'),
                        type: E_ENTER_INTERVIEW,
                        onPress: (item, dataBody) =>
                            HreWaitingInterviewBusiness.businessEnterInterViewRecords(item, dataBody),
                        ...actionEnterInterView
                    }
                ];
            }

            // action Modify
            const actionModifyInterView = businessAction
                    ? businessAction.find((action) => action.Type === E_MODIFY)
                    : null,
                actionModifyInterViewResource = actionModifyInterView ? actionModifyInterView[E_ResourceName][E_Name] : null,
                actionModifyInterViewRule = actionModifyInterView ? actionModifyInterView[E_ResourceName][E_Rule] : null,
                actionModifyInterViewPer =
                    actionModifyInterViewResource && actionModifyInterViewRule
                        ? permission[actionModifyInterViewResource][actionModifyInterViewRule]
                        : null;

            if (actionModifyInterViewPer) {
                _rowActions = [
                    ..._rowActions,
                    {
                        title: translate('HRM_PortalApp_InputResult_Edit'),
                        type: E_MODIFY,
                        onPress: (item, dataBody) =>
                            HreWaitingInterviewBusiness.businessModifyInterViewRecords(item, dataBody),
                        ...actionModifyInterView
                    }
                ];
            }

        }
    }

    return { rowActions: _rowActions, selected: _selected };
};

export const HreWaitingInterviewBusiness = {
    checkForReLoadScreen: {
        HreWaitingInterview: false,
        HreCompletedInterview: false
    },
    setThisForBusiness: (dataThis) => {
        _this = dataThis;
    },
    //#region [Enter and modify inverView]
    businessEnterInterViewRecords: (item) => {
        _this.onCreate && _this.onCreate(item);
    },
    businessModifyInterViewRecords: (item) => {
        _this.onEdit && _this.onEdit(item);
    }
    //#endregion
};
