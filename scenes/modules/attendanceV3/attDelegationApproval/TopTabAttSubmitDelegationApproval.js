import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import AttSubmitDelegationApproval from './attSubmitDelegationApproval/AttSubmitDelegationApproval';
import AttWaitConfirmSubmitDelegationApproval from './attSubmitDelegationApproval/attWaitConfirmSubmitDelegationApproval/AttWaitConfirmSubmitDelegationApproval';
import AttConfirmedSubmitDelegationApproval from './attSubmitDelegationApproval/attConfirmedSubmitDelegationApproval/AttConfirmedSubmitDelegationApproval';
import AttRejectSubmitDelegationApproval from './attSubmitDelegationApproval/attRejectSubmitDelegationApproval/AttRejectSubmitDelegationApproval';
import AttCanceledSubmitDelegationApproval from './attSubmitDelegationApproval/attCanceledSubmitDelegationApproval/AttCanceledSubmitDelegationApproval';
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
        screenName: ScreenName.AttSubmitDelegationApproval
    },
    {
        title: 'HRM_PortalApp_Awaiting',
        screenName: ScreenName.AttWaitConfirmSubmitDelegationApproval
    },
    {
        title: 'HRM_PortalApp_Confirmed',
        screenName: ScreenName.AttConfirmedSubmitDelegationApproval
    },
    {
        title: 'HRM_PortalApp_Rejected_UC',
        screenName: ScreenName.AttRejectSubmitDelegationApproval
    },
    {
        title: 'HRM_PortalApp_Canceled_UC',
        screenName: ScreenName.AttCanceledSubmitDelegationApproval
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabAttSubmitDelegationApproval = createMaterialTopTabNavigator(
    {
        AttSubmitDelegationApproval: {
            screen: AttSubmitDelegationApproval,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_All')
        },
        AttWaitConfirmSubmitDelegationApproval: {
            screen: AttWaitConfirmSubmitDelegationApproval,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_Awaiting')
        },
        AttConfirmedSubmitDelegationApproval: {
            screen: AttConfirmedSubmitDelegationApproval,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_Confirmed')
        },
        AttRejectSubmitDelegationApproval: {
            screen: AttRejectSubmitDelegationApproval,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_Rejected')
        },
        AttCanceledSubmitDelegationApproval: {
            screen: AttCanceledSubmitDelegationApproval,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_Canceled_UC')
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

export default TopTabAttSubmitDelegationApproval;
