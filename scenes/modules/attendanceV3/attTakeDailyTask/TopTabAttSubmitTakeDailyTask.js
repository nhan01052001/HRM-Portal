import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import AttApproveSubmitTakeDailyTask from './attSubmitTakeDailyTask/attApproveSubmitTakeDailyTask/AttApproveSubmitTakeDailyTask';
import AttApprovedSubmitTakeDailyTask from './attSubmitTakeDailyTask/attApprovedSubmitTakeDailyTask/AttApprovedSubmitTakeDailyTask';
import AttSaveTempSubmitTakeDailyTask from './attSubmitTakeDailyTask/attSaveTempSubmitTakeDailyTask/AttSaveTempSubmitTakeDailyTask';
import AttCanceledSubmitTakeDailyTask from './attSubmitTakeDailyTask/attCanceledSubmitTakeDailyTask/AttCanceledSubmitTakeDailyTask';
import AttRejectSubmitTakeDailyTask from './attSubmitTakeDailyTask/attRejectSubmitTakeDailyTask/AttRejectSubmitTakeDailyTask';
import AttSubmitTakeDailyTask from './attSubmitTakeDailyTask/AttSubmitTakeDailyTask';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_All',
        screenName: ScreenName.AttSubmitTakeDailyTask
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_SaveTemporary',
        screenName: ScreenName.AttSaveTempSubmitTakeDailyTask
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_WaitingApproval',
        screenName: ScreenName.AttApproveSubmitTakeDailyTask
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Approved',
        screenName: ScreenName.AttApprovedSubmitTakeDailyTask
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Rejected',
        screenName: ScreenName.AttRejectSubmitTakeDailyTask
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Canceled',
        screenName: ScreenName.AttCanceledSubmitTakeDailyTask
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabAttSubmitTakeDailyTask = createMaterialTopTabNavigator(
    {
        AttSubmitTakeDailyTask: {
            screen: AttSubmitTakeDailyTask,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_All')
        },
        AttSaveTempSubmitTakeDailyTask: {
            screen: AttSaveTempSubmitTakeDailyTask,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_SaveTemporary')
        },
        AttApproveSubmitTakeDailyTask: {
            screen: AttApproveSubmitTakeDailyTask,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_WaitingApproval')
        },
        AttApprovedSubmitTakeDailyTask: {
            screen: AttApprovedSubmitTakeDailyTask,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Approved')
        },
        AttRejectSubmitTakeDailyTask: {
            screen: AttRejectSubmitTakeDailyTask,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Rejected')
        },
        AttCanceledSubmitTakeDailyTask: {
            screen: AttCanceledSubmitTakeDailyTask,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Canceled')
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

export default TopTabAttSubmitTakeDailyTask;
