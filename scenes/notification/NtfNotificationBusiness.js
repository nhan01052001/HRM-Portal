import { ToasterSevice } from '../../components/Toaster/Toaster';
import { AlertSevice } from '../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../utils/HttpService';
import { translate } from '../../i18n/translate';
import { PermissionForAppMobile } from '../../assets/configProject/PermissionForAppMobile';
import { dataVnrStorage } from '../../assets/auth/authentication';
import { ConfigList } from '../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumIcon } from '../../assets/constant';
import DrawerServices from '../../utils/DrawerServices';
import moment from 'moment';
import NotificationsService from '../../utils/NotificationsService';

let enumName = EnumName,
    _this = {};
export const generateRowActionAndSelected = () => {
    const _rowActions = [
        {
            title: translate('HRM_Common_Cancel'),
            type: EnumName.E_DELETE,
            onPress: (item, message) => NtfNotificationBusinessFunction.businessDeleteRecords(item, message)
        },
        {
            title: translate('HRM_Common_Update'),
            type: EnumName.E_UPDATESTATUS,
            onPress: item => NtfNotificationBusinessFunction.updateIsSeen(item)
        }
    ];
    return { rowActions: _rowActions };
};

export const NtfNotificationBusinessFunction = {
    setThisForBusiness: dataThis => {
        _this = dataThis;
    },
    //#region [action delete]
    businessDeleteRecords: (item, message) => {
        NtfNotificationBusinessFunction.confirmDelete({
            strResultID: item.lstID,
            message: message
        });
    },

    confirmDelete: objValid => {
        // console.log(objValid)
        const { E_DELETE, E_isInputText, E_isValidInputText, E_string, E_Confirm } = enumName;
        debugger;
        let message = objValid.message && typeof objValid.message === E_string ? objValid.message : null;

        AlertSevice.alert({
            iconType: EnumIcon.E_DELETE,
            message: message,
            onCancel: () => {},
            onConfirm: () => {
                let strId = objValid.strResultID;
                NtfNotificationBusinessFunction.setIsDelete({ Ids: strId });
            }
        });
    },

    setIsDelete: objValid => {
        debugger;
        VnrLoadingSevices.show();
        let lstID = objValid.Ids;

        //
        HttpService.Post('[URI_HR]/Por_GetData/SetDeleteNotification', {
            lstID: lstID
        });

        ToasterSevice.showSuccess('HRM_Notification_Toaster_Deleted', 4000);
        _this.reload('E_KEEP_FILTER', true);
        VnrLoadingSevices.hide();
    },
    //#endregion

    //#region [action Update status]
    updateIsSeen: item => {
        const dataBody = {
            lstID: item.lstID
        };

        HttpService.Post('[URI_HR]/Por_GetData/UpdateStatusForSysNotification', dataBody).then(res => {
            if (res && res == EnumName.E_Success) {
                NotificationsService.fetchContbadges();
            }
        });
    }
    //#endregion
};
