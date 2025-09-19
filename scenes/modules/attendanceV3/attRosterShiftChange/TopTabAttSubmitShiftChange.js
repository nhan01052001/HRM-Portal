import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import AttSubmitShiftChange from './attSubmitShiftChange/AttSubmitShiftChange';
import AttSaveTempSubmitShiftChange from './attSubmitShiftChange/attSaveTempSubmitShiftChange/AttSaveTempSubmitShiftChange';
import AttApproveSubmitShiftChange from './attSubmitShiftChange/attApproveSubmitShiftChange/AttApproveSubmitShiftChange';
import AttApprovedSubmitShiftChange from './attSubmitShiftChange/attApprovedSubmitShiftChange/AttApprovedSubmitShiftChange';
import AttRejectSubmitShiftChange from './attSubmitShiftChange/atRejectSubmitShiftChange/AttRejectSubmitShiftChange';
import AttCanceledSubmitShiftChange from './attSubmitShiftChange/attCanceledSubmitShiftChange/AttCanceledSubmitShiftChange';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_All',
        screenName: ScreenName.AttSubmitShiftChange
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_SaveTemporary',
        screenName: ScreenName.AttSaveTempSubmitShiftChange
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_WaitingApproval',
        screenName: ScreenName.AttApproveSubmitShiftChange
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Approved',
        screenName: ScreenName.AttApprovedSubmitShiftChange
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Rejected',
        screenName: ScreenName.AttRejectSubmitShiftChange
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Canceled',
        screenName: ScreenName.AttCanceledSubmitShiftChange
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabAttSubmitShiftChange = createMaterialTopTabNavigator(
    {
        AttSubmitShiftChange: {
            screen: AttSubmitShiftChange,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_All')
        },
        AttSaveTempSubmitShiftChange: {
            screen: AttSaveTempSubmitShiftChange,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_SaveTemporary')
        },
        AttApproveSubmitShiftChange: {
            screen: AttApproveSubmitShiftChange,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_WaitingApproval')
        },
        AttApprovedSubmitShiftChange: {
            screen: AttApprovedSubmitShiftChange,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Approved')
        },
        AttRejectSubmitShiftChange: {
            screen: AttRejectSubmitShiftChange,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Rejected')
        },
        AttCanceledSubmitShiftChange: {
            screen: AttCanceledSubmitShiftChange,
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

            if ((perTabApprove || perTabWaitApproved || perTabReject) && Array.isArray(data) && data.length > 0) {
                return <RenderTopTab data={data} navigationAll={navigationAll} />;
            } else {
                return <View />;
            }
        }
    }
);
//#endregion

export default TopTabAttSubmitShiftChange;
