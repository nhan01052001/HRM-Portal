import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import AttSubmitTamScanLogRegister from './attSubmitTamScanLogRegister/AttSubmitTamScanLogRegister';
import AttSaveTempSubmitTamScanLogRegister from './attSubmitTamScanLogRegister/attSaveTempSubmitTamScanLogRegister/AttSaveTempSubmitTamScanLogRegister';
import AttRejectSubmitTamScanLogRegister from './attSubmitTamScanLogRegister/attRejectSubmitTamScanLogRegister/AttRejectSubmitTamScanLogRegister';
import AttCanceledSubmitTamScanLogRegister from './attSubmitTamScanLogRegister/attCanceledSubmitTamScanLogRegister/AttCanceledSubmitTamScanLogRegister';
import AttApproveSubmitTamScanLogRegister from './attSubmitTamScanLogRegister/attApproveSubmitTamScanLogRegister/AttApproveSubmitTamScanLogRegister';
import AttApprovedSubmitTamScanLogRegister from './attSubmitTamScanLogRegister/attApprovedSubmitTamScanLogRegister/AttApprovedSubmitTamScanLogRegister';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_All',
        screenName: ScreenName.AttSubmitTamScanLogRegister
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_SaveTemporary',
        screenName: ScreenName.AttSaveTempSubmitTamScanLogRegister
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_WaitingApproval',
        screenName: ScreenName.AttApproveSubmitTamScanLogRegister
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_Approved',
        screenName: ScreenName.AttApprovedSubmitTamScanLogRegister
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_Rejected',
        screenName: ScreenName.AttRejectSubmitTamScanLogRegister
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_Canceled',
        screenName: ScreenName.AttCanceledSubmitTamScanLogRegister
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabAttSubmitTamScanLogRegister = createMaterialTopTabNavigator(
    {
        AttSubmitTamScanLogRegister: {
            screen: AttSubmitTamScanLogRegister,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_All')
        },
        AttSaveTempSubmitTamScanLogRegister: {
            screen: AttSaveTempSubmitTamScanLogRegister,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_SaveTemporary')
        },
        AttApproveSubmitTamScanLogRegister: {
            screen: AttApproveSubmitTamScanLogRegister,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_WaitingApproval')
        },
        AttApprovedSubmitTamScanLogRegister: {
            screen: AttApprovedSubmitTamScanLogRegister,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_Approved')
        },
        AttRejectSubmitTamScanLogRegister: {
            screen: AttRejectSubmitTamScanLogRegister,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_Rejected')
        },
        AttCanceledSubmitTamScanLogRegister: {
            screen: AttCanceledSubmitTamScanLogRegister,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_Canceled')
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: navigationAll => {

            let perTabApprove = true,
                perTabWaitApproved = true,
                perTabReject = true;

            // if (PermissionForAppMobile && PermissionForAppMobile.value['Personal_RelativeConfirmed']
            //     && PermissionForAppMobile.value['Personal_RelativeConfirmed']['View']) {
            //     perTabApprove = true;
            // }

            // if (PermissionForAppMobile && PermissionForAppMobile.value['Personal_RelativeWaitConfirm']
            //     && PermissionForAppMobile.value['Personal_RelativeWaitConfirm']['View']) {
            //     perTabWaitApproved = true;
            // }

            // if (PermissionForAppMobile && PermissionForAppMobile.value['Personal_RelativeEdit']
            //     && PermissionForAppMobile.value['Personal_RelativeEdit']['View']) {
            //     perTabReject = true;
            // }

            if ((perTabApprove || perTabWaitApproved || perTabReject) && Array.isArray(data) && data.length > 0) {
                return <RenderTopTab data={data} navigationAll={navigationAll} />;
            } else {
                return <View />;
            }
        }
    }
);
//#endregion

export default TopTabAttSubmitTamScanLogRegister;
