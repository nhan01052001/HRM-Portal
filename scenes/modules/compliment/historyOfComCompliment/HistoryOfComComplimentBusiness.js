import { ToasterSevice } from '../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../../utils/HttpService';
import { translate } from '../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../assets/configProject/PermissionForAppMobile';
import { ConfigList } from '../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumIcon, EnumStatus } from '../../../../assets/constant';

let enumName = EnumName;

let _this = null,
    _rowActions = [],
    _selected = [];

export const generateRowActionAndSelected = (screenName) => {
    _rowActions = [];
    _selected = [];

    const permission = PermissionForAppMobile.value;
    if (ConfigList.value != null && ConfigList.value != undefined) {
        const _configList = ConfigList.value[screenName],
            businessAction = _configList[enumName.E_BusinessAction],
            { E_ResourceName, E_Name, E_Rule, E_SENDTHANKS, E_CANCEL } = enumName;

        //action send mail
        const actionSendThanks = businessAction ? businessAction.find((action) => action.Type === E_SENDTHANKS) : null,
            actionSendMailResource = actionSendThanks ? actionSendThanks[E_ResourceName][E_Name] : null,
            actionSendMailRule = actionSendThanks ? actionSendThanks[E_ResourceName][E_Rule] : null,
            actionSendMailPer =
                actionSendMailResource && actionSendMailRule
                    ? permission[actionSendMailResource][actionSendMailRule]
                    : null;

        if (actionSendMailPer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_PortalApp_Compliment_SendAppreciation'),
                    type: E_SENDTHANKS,
                    onPress: (item, dataBody) =>
                        HistoryOfComComplimentBusinessFunction.businessSendThanksRecords(
                            Array.isArray(item) ? item : [{ ...item }],
                            dataBody
                        ),
                    ...actionSendThanks
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_PortalApp_Compliment_SendAppreciation'),
                    type: E_SENDTHANKS,
                    onPress: (items, dataBody) =>
                        HistoryOfComComplimentBusinessFunction.businessSendThanksRecords(items, dataBody),
                    ...actionSendThanks
                }
            ];
        }

        //action cancel
        const actionCancel = businessAction ? businessAction.find((action) => action.Type === E_CANCEL) : null,
            actionCancelResource = actionCancel ? actionCancel[E_ResourceName][E_Name] : null,
            actionCancelRule = actionCancel ? actionCancel[E_ResourceName][E_Rule] : null,
            actionCancelPer =
                actionCancelResource && actionCancelRule ? permission[actionCancelResource][actionCancelRule] : null;

        if (actionCancelPer) {
            _rowActions = [
                ..._rowActions,
                {
                    title: translate('HRM_Common_Cancel'),
                    type: E_CANCEL,
                    onPress: (item, dataBody) =>
                        HistoryOfComComplimentBusinessFunction.businessCancelRecords(
                            Array.isArray(item) ? item : [{ ...item }],
                            dataBody
                        ),
                    ...actionCancel
                }
            ];

            _selected = [
                ..._selected,
                {
                    title: translate('HRM_Common_Cancel'),
                    type: E_CANCEL,
                    onPress: (item, dataBody) =>
                        HistoryOfComComplimentBusinessFunction.businessCancelRecords(item, dataBody),
                    ...actionCancel
                }
            ];
        }
        return { rowActions: _rowActions, selected: _selected };
    }
};

export const HistoryOfComComplimentBusinessFunction = {
    checkForReLoadScreen: {
        HistoryOfComComplimented: false
    },
    setThisForBusiness: (dataThis) => {
        _this = dataThis;
    },

    //#region [action send mail]
    businessSendThanksRecords: (items) => {
        const lsParams = [];
        if (Array.isArray(items) && items.length > 0) {
            items.map((item) => {
                if (item?.ProfileID) {
                    lsParams.push({
                        ID: item?.ProfileID,
                        CodeEmp: item?.CodeEmp,
                        ImagePath: item?.ImagePath,
                        JobTitleName: item?.JobTitleName,
                        NameEnglish: null,
                        PositionName: null,
                        ProfileName: item?.ProfileName,
                        isSelect: true
                    });
                }
            });

            if (lsParams.length > 0) {
                let newListParams = [...new Map(lsParams.map((m) => [m.ID, m])).values()];
                _this.onSendThanks(newListParams);
            }
        }
    },
    //#endregion

    //#region [action cancel]
    businessCancelRecords: (items, dataBody) => {
        if (items.length === 0 && !dataBody) {
            ToasterSevice.showWarning('HRM_Common_Select', 4000);
        } else {
            let selectedID = [];
            items.forEach((item) => {
                if (item.BusinessAllowAction && item.BusinessAllowAction.indexOf(EnumStatus.E_CANCEL) > -1) {
                    selectedID.push(item);
                }
            });

            if (selectedID.length == 0) {
                ToasterSevice.showWarning('HRM_PortalApp_Status_AllowCancel', 4000);
                return;
            }

            HistoryOfComComplimentBusinessFunction.confirmCancel({
                strResultID: selectedID,
                message: 'HRM_PortalApp_DoYouWantToCancelThisRequest' //keyTrans.replace('[E_NUMBER]', numberRow)
            });
        }
    },

    confirmCancel: (objValid) => {
        let actionCancel = _rowActions.find((item) => item.Type === 'E_CANCEL'),
            isConfirm = actionCancel['Confirm'];

        if (isConfirm) {
            let isInputText = isConfirm['isInputText'],
                isValidInputText = isConfirm['isValidInputText'],
                message = objValid.message && typeof objValid.message === 'string' ? objValid.message : null,
                placeholder = translate('HRM_Common_CommentCancel');

            AlertSevice.alert({
                iconType: EnumIcon.E_CANCEL,
                placeholder: placeholder,
                isValidInputText: isValidInputText,
                isInputText: isInputText,
                message: message,
                onCancel: () => {},
                onConfirm: (reason) => {
                    if (isValidInputText && (!reason || reason === '')) {
                        let mesNotEmpty = placeholder + translate('FieldNotAllowNull');
                        ToasterSevice.showWarning(mesNotEmpty, 4000, null, false);
                    } else {
                        HistoryOfComComplimentBusinessFunction.setCancel({ ...objValid, Comment: reason });
                    }
                }
            });
        } else {
            HistoryOfComComplimentBusinessFunction.setCancel(objValid);
        }
    },

    setCancel: (objValid) => {
        if (Array.isArray(objValid?.strResultID) && objValid?.strResultID.length > 0) {
            let lsID = [];
            objValid?.strResultID.map((item) => {
                if (item?.ID) {
                    lsID.push(item?.ID);
                }
            });

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Com_GetData/ChangeStatusCancels', {
                lstID: lsID
            })
                .then((res) => {
                    VnrLoadingSevices.hide();
                    if (res && res === 'Success') {
                        ToasterSevice.showSuccess('HRM_Common_CreateOrEdit_Success', 4000);
                        _this.reload('E_KEEP_FILTER', true);
                        HistoryOfComComplimentBusinessFunction.checkForReLoadScreen[ScreenName.HistoryConversion] =
                            true;
                        HistoryOfComComplimentBusinessFunction.checkForReLoadScreen[ScreenName.ComCompliment] = true;
                    } else if (res && res && typeof res == 'string') {
                        ToasterSevice.showError(res, 4000);
                    } else {
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                    }
                })
                .catch(() => {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                });
        }
    }
    //#endregion
};
