import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import AttWaitConfirmShiftChange from './attWaitConfirmShiftChange/AttWaitConfirmShiftChange';
import AttConfirmedShiftChange from './attConfirmedShiftChange/AttConfirmedShiftChange';
import AttRejectedShiftChange from './attRejectedShiftChange/AttRejectedShiftChange';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_PITFinalization_tabWaitingConfirmed',
        screenName: ScreenName.AttWaitConfirmShiftChange
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Confirmed',
        screenName: ScreenName.AttConfirmedShiftChange
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Rejected',
        screenName: ScreenName.AttRejectedShiftChange
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabAttConfirmShiftChange = createMaterialTopTabNavigator(
    {
        AttWaitConfirmShiftChange: {
            screen: AttWaitConfirmShiftChange,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_PITFinalization_tabWaitingConfirmed')
        },
        AttConfirmedShiftChange: {
            screen: AttConfirmedShiftChange,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Confirmed')
        },
        AttRejectedShiftChange: {
            screen: AttRejectedShiftChange,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Rejected')
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

export default TopTabAttConfirmShiftChange;
