import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import AttRejectTakeDailyTask from './attApproveTakeDailyTask/attRejectTakeDailyTask/AttRejectTakeDailyTask';
import AttCanceledTakeDailyTask from './attApproveTakeDailyTask/attCanceledTakeDailyTask/AttCanceledTakeDailyTask';
import AttApproveTakeDailyTask from './attApproveTakeDailyTask/attApproveTakeDailyTask/AttApproveTakeDailyTask';
import AttApprovedTakeDailyTask from './attApproveTakeDailyTask/attApprovedTakeDailyTask/AttApprovedTakeDailyTask';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTab_AwaitingApproval',
        screenName: ScreenName.AttApproveTakeDailyTask
    },
    {
        title: 'HRM_PortalApp_TopTab_AttApproveWorkingOvertime_Approved',
        screenName: ScreenName.AttApprovedTakeDailyTask
    },
    {
        title: 'HRM_PortalApp_TopTab_AttApproveWorkingOvertime_Rejected',
        screenName: ScreenName.AttRejectTakeDailyTask
    },
    {
        title: 'HRM_PortalApp_TopTab_AttApproveWorkingOvertime_Canceled',
        screenName: ScreenName.AttCanceledTakeDailyTask
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabAttApproveTakeDailyTask = createMaterialTopTabNavigator(
    {
        AttApproveTakeDailyTask: {
            screen: AttApproveTakeDailyTask,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_WaitingApproval')
        },
        AttApprovedTakeDailyTask: {
            screen: AttApprovedTakeDailyTask,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Approved')
        },
        AttRejectTakeDailyTask: {
            screen: AttRejectTakeDailyTask,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Rejected')
        },
        AttCanceledTakeDailyTask: {
            screen: AttCanceledTakeDailyTask,
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

export default TopTabAttApproveTakeDailyTask;
