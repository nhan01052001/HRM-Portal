import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import AttWaitConfirmLeaveDayReplacement from './attWaitConfirmLeaveDayReplacement/AttWaitConfirmLeaveDayReplacement';
import AttConfirmedLeaveDayReplacement from './attConfirmedLeaveDayReplacement/AttConfirmedLeaveDayReplacement';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_LeaveDayReplacement_tabPendingConfirmation',
        screenName: ScreenName.AttWaitConfirmLeaveDayReplacement
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Confirmed',
        screenName: ScreenName.AttConfirmedLeaveDayReplacement
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabAttLeaveDayReplacement = createMaterialTopTabNavigator(
    {
        AttWaitConfirmLeaveDayReplacement: {
            screen: AttWaitConfirmLeaveDayReplacement,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTakeLeaveDay_All')
        },
        AttConfirmedLeaveDayReplacement: {
            screen: AttConfirmedLeaveDayReplacement,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTakeLeaveDay_SaveTemporary')
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

export default TopTabAttLeaveDayReplacement;
