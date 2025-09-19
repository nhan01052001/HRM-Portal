import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import AttSubmitTakeLateEarlyAllowed from './attSubmitTakeLateEarlyAllowed/AttSubmitTakeLateEarlyAllowed';
import AttSaveTempSubmitTakeLateEarlyAllowed from './attSubmitTakeLateEarlyAllowed/attSaveTempSubmitTakeLateEarlyAllowed/AttSaveTempSubmitTakeLateEarlyAllowed';
import AttApproveSubmitTakeLateEarlyAllowed from './attSubmitTakeLateEarlyAllowed/attApproveSubmitTakeLateEarlyAllowed/AttApproveSubmitTakeLateEarlyAllowed';
import AttApprovedSubmitTakeLateEarlyAllowed from './attSubmitTakeLateEarlyAllowed/attApprovedSubmitTakeLateEarlyAllowed/AttApprovedSubmitTakeLateEarlyAllowed';
import AttRejectSubmitTakeLateEarlyAllowed from './attSubmitTakeLateEarlyAllowed/atRejectSubmitTakeLateEarlyAllowed/AttRejectSubmitTakeLateEarlyAllowed';
import AttCanceledSubmitTakeLateEarlyAllowed from './attSubmitTakeLateEarlyAllowed/attCanceledSubmitTakeLateEarlyAllowed/AttCanceledSubmitTakeLateEarlyAllowed';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTakeLateEarlyAllowed_All',
        screenName: ScreenName.AttSubmitTakeLateEarlyAllowed
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTakeLateEarlyAllowed_SaveTemporary',
        screenName: ScreenName.AttSaveTempSubmitTakeLateEarlyAllowed
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTakeLateEarlyAllowed_WaitingApproval',
        screenName: ScreenName.AttApproveSubmitTakeLateEarlyAllowed
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTakeLateEarlyAllowed_Approved',
        screenName: ScreenName.AttApprovedSubmitTakeLateEarlyAllowed
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTakeLateEarlyAllowed_Rejected',
        screenName: ScreenName.AttRejectSubmitTakeLateEarlyAllowed
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTakeLateEarlyAllowed_Canceled',
        screenName: ScreenName.AttCanceledSubmitTakeLateEarlyAllowed
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabAttSubmitTakeLateEarlyAllowed = createMaterialTopTabNavigator(
    {
        AttSubmitTakeLateEarlyAllowed: {
            screen: AttSubmitTakeLateEarlyAllowed,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTakeLateEarlyAllowed_All')
        },
        AttSaveTempSubmitTakeLateEarlyAllowed: {
            screen: AttSaveTempSubmitTakeLateEarlyAllowed,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTakeLateEarlyAllowed_SaveTemporary')
        },
        AttApproveSubmitTakeLateEarlyAllowed: {
            screen: AttApproveSubmitTakeLateEarlyAllowed,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTakeLateEarlyAllowed_WaitingApproval')
        },
        AttApprovedSubmitTakeLateEarlyAllowed: {
            screen: AttApprovedSubmitTakeLateEarlyAllowed,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTakeLateEarlyAllowed_Approved')
        },
        AttRejectSubmitTakeLateEarlyAllowed: {
            screen: AttRejectSubmitTakeLateEarlyAllowed,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTakeLateEarlyAllowed_Rejected')
        },
        AttCanceledSubmitTakeLateEarlyAllowed: {
            screen: AttCanceledSubmitTakeLateEarlyAllowed,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTakeLateEarlyAllowed_Canceled')
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: navigationAll => {;

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

export default TopTabAttSubmitTakeLateEarlyAllowed;
