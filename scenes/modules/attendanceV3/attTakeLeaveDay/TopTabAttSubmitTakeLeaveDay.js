import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import AttSubmitTakeLeaveDay from './attSubmitTakeLeaveDay/AttSubmitTakeLeaveDay';
import AttSaveTempSubmitTakeLeaveDay from './attSubmitTakeLeaveDay/attSaveTempSubmitTakeLeaveDay/AttSaveTempSubmitTakeLeaveDay';
import AttApproveSubmitTakeLeaveDay from './attSubmitTakeLeaveDay/attApproveSubmitTakeLeaveDay/AttApproveSubmitTakeLeaveDay';
import AttApprovedSubmitTakeLeaveDay from './attSubmitTakeLeaveDay/attApprovedSubmitTakeLeaveDay/AttApprovedSubmitTakeLeaveDay';
import AttRejectSubmitTakeLeaveDay from './attSubmitTakeLeaveDay/atRejectSubmitTakeLeaveDay/AttRejectSubmitTakeLeaveDay';
import AttCanceledSubmitTakeLeaveDay from './attSubmitTakeLeaveDay/attCanceledSubmitTakeLeaveDay/AttCanceledSubmitTakeLeaveDay';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTakeLeaveDay_All',
        screenName: ScreenName.AttSubmitTakeLeaveDay
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTakeLeaveDay_SaveTemporary',
        screenName: ScreenName.AttSaveTempSubmitTakeLeaveDay
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTakeLeaveDay_WaitingApproval',
        screenName: ScreenName.AttApproveSubmitTakeLeaveDay
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTakeLeaveDay_Approved',
        screenName: ScreenName.AttApprovedSubmitTakeLeaveDay
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTakeLeaveDay_Rejected',
        screenName: ScreenName.AttRejectSubmitTakeLeaveDay
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTakeLeaveDay_Canceled',
        screenName: ScreenName.AttCanceledSubmitTakeLeaveDay
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabAttSubmitTakeLeaveDay = createMaterialTopTabNavigator(
    {
        AttSubmitTakeLeaveDay: {
            screen: AttSubmitTakeLeaveDay,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTakeLeaveDay_All')
        },
        AttSaveTempSubmitTakeLeaveDay: {
            screen: AttSaveTempSubmitTakeLeaveDay,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTakeLeaveDay_SaveTemporary')
        },
        AttApproveSubmitTakeLeaveDay: {
            screen: AttApproveSubmitTakeLeaveDay,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTakeLeaveDay_WaitingApproval')
        },
        AttApprovedSubmitTakeLeaveDay: {
            screen: AttApprovedSubmitTakeLeaveDay,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTakeLeaveDay_Approved')
        },
        AttRejectSubmitTakeLeaveDay: {
            screen: AttRejectSubmitTakeLeaveDay,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTakeLeaveDay_Rejected')
        },
        AttCanceledSubmitTakeLeaveDay: {
            screen: AttCanceledSubmitTakeLeaveDay,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTakeLeaveDay_Canceled')
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

export default TopTabAttSubmitTakeLeaveDay;
