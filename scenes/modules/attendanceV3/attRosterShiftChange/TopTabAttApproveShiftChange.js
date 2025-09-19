import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import AttApproveShiftChange from './attApproveShiftChange/attApproveShiftChange/AttApproveShiftChange';
import AttRejectShiftChange from './attApproveShiftChange/attRejectShiftChange/AttRejectShiftChange';
import AttApprovedShiftChange from './attApproveShiftChange/attApprovedShiftChange/AttApprovedShiftChange';
import AttAllTakeShiftChange from './attApproveShiftChange/attAllTakeShiftChange/AttAllTakeShiftChange';
import AttCanceledShiftChange from './attApproveShiftChange/attCanceledShiftChange/AttCanceledShiftChange';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTab_AttApproveWorkingOvertime_WaitingApproval',
        screenName: ScreenName.AttApproveShiftChange
    },
    {
        title: 'HRM_PortalApp_TopTab_AttApproveWorkingOvertime_Approved',
        screenName: ScreenName.AttApprovedShiftChange
    },
    {
        title: 'HRM_PortalApp_TopTab_AttApproveWorkingOvertime_Rejected',
        screenName: ScreenName.AttRejectShiftChange
    },
    {
        title: 'HRM_PortalApp_TopTab_AttApproveWorkingOvertime_Canceled',
        screenName: ScreenName.AttCanceledShiftChange
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabAttApproveShiftChange = createMaterialTopTabNavigator(
    {
        AttApproveShiftChange: {
            screen: AttApproveShiftChange,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveWorkingOvertime_WaitingApproval')
        },
        AttApprovedShiftChange: {
            screen: AttApprovedShiftChange,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveWorkingOvertime_Approved')
        },
        AttRejectShiftChange: {
            screen: AttRejectShiftChange,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveWorkingOvertime_Rejected')
        },
        AttCanceledShiftChange: {
            screen: AttCanceledShiftChange,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveWorkingOvertime_Canceled')
        },
        AttAllTakeShiftChange: {
            screen: AttAllTakeShiftChange,
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

export default TopTabAttApproveShiftChange;
