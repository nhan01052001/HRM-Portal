import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import AttApproveTakeLateEarlyAllowed from './attApproveTakeLateEarlyAllowed/attApproveTakeLateEarlyAllowed/AttApproveTakeLateEarlyAllowed';
import AttRejectTakeLateEarlyAllowed from './attApproveTakeLateEarlyAllowed/attRejectTakeLateEarlyAllowed/AttRejectTakeLateEarlyAllowed';
import AttApprovedTakeLateEarlyAllowed from './attApproveTakeLateEarlyAllowed/attApprovedTakeLateEarlyAllowed/AttApprovedTakeLateEarlyAllowed';
import AttAllTakeLateEarlyAllowed from './attApproveTakeLateEarlyAllowed/attAllTakeLateEarlyAllowed/AttAllTakeLateEarlyAllowed';
import AttCanceledTakeLateEarlyAllowed from './attApproveTakeLateEarlyAllowed/attCanceledTakeLateEarlyAllowed/AttCanceledTakeLateEarlyAllowed';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTab_AttApproveTakeLateEarlyAllowed_WaitingApproval',
        screenName: ScreenName.AttApproveTakeLateEarlyAllowed
    },
    {
        title: 'HRM_PortalApp_TopTab_AttApproveTakeLateEarlyAllowed_Approved',
        screenName: ScreenName.AttApprovedTakeLateEarlyAllowed
    },
    {
        title: 'HRM_PortalApp_TopTab_AttApproveTakeLateEarlyAllowed_Rejected',
        screenName: ScreenName.AttRejectTakeLateEarlyAllowed
    },
    {
        title: 'HRM_PortalApp_TopTab_AttApproveTakeLateEarlyAllowed_Canceled',
        screenName: ScreenName.AttCanceledTakeLateEarlyAllowed
    },
    {
        title: 'HRM_PortalApp_TopTab_AttApproveTakeLateEarlyAllowed_All',
        screenName: ScreenName.AttAllTakeLateEarlyAllowed
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabAttApproveTakeLateEarlyAllowed = createMaterialTopTabNavigator(
    {
        AttApproveTakeLateEarlyAllowed: {
            screen: AttApproveTakeLateEarlyAllowed,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveTakeLateEarlyAllowed_WaitingApproval')
        },
        AttApprovedTakeLateEarlyAllowed: {
            screen: AttApprovedTakeLateEarlyAllowed,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveTakeLateEarlyAllowed_Approved')
        },
        AttRejectTakeLateEarlyAllowed: {
            screen: AttRejectTakeLateEarlyAllowed,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveTakeLateEarlyAllowed_Rejected')
        },
        AttCanceledTakeLateEarlyAllowed: {
            screen: AttCanceledTakeLateEarlyAllowed,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveTakeLateEarlyAllowed_Canceled')
        },
        AttAllTakeLateEarlyAllowed: {
            screen: AttAllTakeLateEarlyAllowed,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveTakeLateEarlyAllowed_All')
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

            if (perTabApprove || ((perTabWaitApproved || perTabReject) && Array.isArray(data) && data.length > 0)) {
                return <RenderTopTab data={data} navigationAll={navigationAll} />;
            } else {
                return <View />;
            }
        }
    }
);
//#endregion

export default TopTabAttApproveTakeLateEarlyAllowed;
