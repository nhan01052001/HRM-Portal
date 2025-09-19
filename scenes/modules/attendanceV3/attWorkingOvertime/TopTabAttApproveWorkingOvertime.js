import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import AttApproveWorkingOvertime from './attApproveWorkingOvertime/attApproveWorkingOvertime/AttApproveWorkingOvertime';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import AttRejectWorkingOvertime from './attApproveWorkingOvertime/attRejectWorkingOvertime/AttRejectWorkingOvertime';
import AttApprovedWorkingOvertime from './attApproveWorkingOvertime/attApprovedWorkingOvertime/AttApprovedWorkingOvertime';
import AttAllWorkingOvertime from './attApproveWorkingOvertime/attAllTakeWorkingOvertime/AttAllWorkingOvertime';
import AttCanceledWorkingOvertime from './attApproveWorkingOvertime/attCanceledWorkingOvertime/AttCanceledWorkingOvertime';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTab_AttApproveWorkingOvertime_WaitingApproval',
        screenName: ScreenName.AttApproveWorkingOvertime
    },
    {
        title: 'HRM_PortalApp_TopTab_AttApproveWorkingOvertime_Approved',
        screenName: ScreenName.AttApprovedWorkingOvertime
    },
    {
        title: 'HRM_PortalApp_TopTab_AttApproveWorkingOvertime_Rejected',
        screenName: ScreenName.AttRejectWorkingOvertime
    },
    {
        title: 'HRM_PortalApp_TopTab_AttApproveWorkingOvertime_Canceled',
        screenName: ScreenName.AttCanceledWorkingOvertime
    },
    {
        title: 'HRM_PortalApp_TopTab_AttApproveWorkingOvertime_All',
        screenName: ScreenName.AttAllWorkingOvertime
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabAttApproveWorkingOvertime = createMaterialTopTabNavigator(
    {
        AttApproveWorkingOvertime: {
            screen: AttApproveWorkingOvertime,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveWorkingOvertime_WaitingApproval')
        },
        AttApprovedWorkingOvertime: {
            screen: AttApprovedWorkingOvertime,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveWorkingOvertime_Approved')
        },
        AttRejectWorkingOvertime: {
            screen: AttRejectWorkingOvertime,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveWorkingOvertime_Rejected')
        },
        AttCanceledWorkingOvertime: {
            screen: AttCanceledWorkingOvertime,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveWorkingOvertime_Canceled')
        },
        AttAllWorkingOvertime: {
            screen: AttAllWorkingOvertime,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveWorkingOvertime_All')
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

export default TopTabAttApproveWorkingOvertime;
