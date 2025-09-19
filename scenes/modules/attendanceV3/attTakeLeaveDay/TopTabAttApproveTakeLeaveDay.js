import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import AttApproveTakeLeaveDay from './attApproveLeaveDay/attApproveTakeLeaveDay/AttApproveTakeLeaveDay';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import AttRejectTakeLeaveDay from './attApproveLeaveDay/attRejectTakeLeaveDay/AttRejectTakeLeaveDay';
import AttCanceledTakeLeaveDay from './attApproveLeaveDay/attCanceledTakeLeaveDay/AttCanceledTakeLeaveDay';
import AttAllTakeLeaveDay from './attApproveLeaveDay/attAllTakeLeaveDay/AttAllTakeLeaveDay';
import AttApprovedTakeLeaveDay from './attApproveLeaveDay/attApprovedTakeLeaveDay/AttApprovedTakeLeaveDay';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTab_AttApproveTakeLeaveDay_WaitingApproval',
        screenName: ScreenName.AttApproveTakeLeaveDay
    },
    {
        title: 'HRM_PortalApp_TopTab_AttApproveTakeLeaveDay_Approved',
        screenName: ScreenName.AttApprovedTakeLeaveDay
    },
    {
        title: 'HRM_PortalApp_TopTab_AttApproveTakeLeaveDay_Rejected',
        screenName: ScreenName.AttRejectTakeLeaveDay
    },
    {
        title: 'HRM_PortalApp_TopTab_AttApproveTakeLeaveDay_Canceled',
        screenName: ScreenName.AttCanceledTakeLeaveDay
    },
    {
        title: 'HRM_PortalApp_TopTab_AttApproveTakeLeaveDay_All',
        screenName: ScreenName.AttAllTakeLeaveDay
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabAttApproveTakeLeaveDay = createMaterialTopTabNavigator(
    {
        AttApproveTakeLeaveDay: {
            screen: AttApproveTakeLeaveDay,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveTakeLeaveDay_WaitingApproval')
        },
        AttApprovedTakeLeaveDay: {
            screen: AttApprovedTakeLeaveDay,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveTakeLeaveDay_Approved')
        },
        AttRejectTakeLeaveDay: {
            screen: AttRejectTakeLeaveDay,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveTakeLeaveDay_Rejected')
        },
        AttCanceledTakeLeaveDay: {
            screen: AttCanceledTakeLeaveDay,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveTakeLeaveDay_Canceled')
        },
        AttAllTakeLeaveDay: {
            screen: AttAllTakeLeaveDay,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveTakeLeaveDay_All')
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

export default TopTabAttApproveTakeLeaveDay;
