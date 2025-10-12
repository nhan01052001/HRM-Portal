import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import AttSubmitWorkingOvertime from './attSubmitWorkingOvertime/AttSubmitWorkingOvertime';
import AttSaveTempSubmitWorkingOvertime from './attSubmitWorkingOvertime/attSaveTempSubmitWorkingOvertime/AttSaveTempSubmitWorkingOvertime';
import AttApproveSubmitWorkingOvertime from './attSubmitWorkingOvertime/attApproveSubmitWorkingOvertime/AttApproveSubmitWorkingOvertime';
import AttApprovedSubmitWorkingOvertime from './attSubmitWorkingOvertime/attApprovedSubmitWorkingOvertime/AttApprovedSubmitWorkingOvertime';
import AttConfirmedSubmitWorkingOvertime from './attSubmitWorkingOvertime/attConfirmedSubmitWorkingOvertime/AttConfirmedSubmitWorkingOvertime';
import AttRejectSubmitWorkingOvertime from './attSubmitWorkingOvertime/atRejectSubmitWorkingOvertime/AttRejectSubmitWorkingOvertime';
import AttCanceledSubmitWorkingOvertime from './attSubmitWorkingOvertime/attCanceledSubmitWorkingOvertime/AttCanceledSubmitWorkingOvertime';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import { PermissionForAppMobile } from '../../../../assets/configProject/PermissionForAppMobile';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_All',
        screenName: ScreenName.AttSubmitWorkingOvertime
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_SaveTemporary',
        screenName: ScreenName.AttSaveTempSubmitWorkingOvertime
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_WaitingApproval',
        screenName: ScreenName.AttApproveSubmitWorkingOvertime
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Approved',
        screenName: ScreenName.AttApprovedSubmitWorkingOvertime
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Confirmed',
        screenName: ScreenName.AttConfirmedSubmitWorkingOvertime
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Rejected',
        screenName: ScreenName.AttRejectSubmitWorkingOvertime
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Canceled',
        screenName: ScreenName.AttCanceledSubmitWorkingOvertime
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabAttSubmitWorkingOvertime = createMaterialTopTabNavigator(
    {
        AttSubmitWorkingOvertime: {
            screen: AttSubmitWorkingOvertime,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_All')
        },
        AttSaveTempSubmitWorkingOvertime: {
            screen: AttSaveTempSubmitWorkingOvertime,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_SaveTemporary')
        },
        AttApproveSubmitWorkingOvertime: {
            screen: AttApproveSubmitWorkingOvertime,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_WaitingApproval')
        },
        AttApprovedSubmitWorkingOvertime: {
            screen: AttApprovedSubmitWorkingOvertime,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Approved')
        },
        AttConfirmedSubmitWorkingOvertime: {
            screen: AttConfirmedSubmitWorkingOvertime,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Confirmed')
        },
        AttRejectSubmitWorkingOvertime: {
            screen: AttRejectSubmitWorkingOvertime,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Rejected')
        },
        AttCanceledSubmitWorkingOvertime: {
            screen: AttCanceledSubmitWorkingOvertime,
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

            let perTabConfirmed = false;

            if (PermissionForAppMobile && PermissionForAppMobile.value['New_Att_OvertimePlan_New_Index_V2_TabConfirm']
            && PermissionForAppMobile.value['New_Att_OvertimePlan_New_Index_V2_TabConfirm']['View']) {
                perTabConfirmed = true;
            }

            let filteredData = data;

            if (!perTabConfirmed) {
                filteredData = data.filter(item => item.title !== 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Confirmed');
            }

            if ((perTabApprove || perTabWaitApproved || perTabReject) && Array.isArray(data) && data.length > 0) {
                return <RenderTopTab data={filteredData} navigationAll={navigationAll} />;
            } else {
                return <View />;
            }
        }
    }
);
//#endregion

export default TopTabAttSubmitWorkingOvertime;
