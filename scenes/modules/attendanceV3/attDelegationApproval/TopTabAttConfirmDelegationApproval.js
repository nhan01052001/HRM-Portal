import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import AttRejectDelegationApproval from './attConfirmDelegationApproval/attRejectDelegationApproval/AttRejectDelegationApproval';
import AttCanceledDelegationApproval from './attConfirmDelegationApproval/attCanceledDelegationApproval/AttCanceledDelegationApproval';
import AttConfirmDelegationApproval from './attConfirmDelegationApproval/attConfirmDelegationApproval/AttConfirmDelegationApproval';
import AttConfirmedDelegationApproval from './attConfirmDelegationApproval/attConfirmedDelegationApproval/AttConfirmedDelegationApproval';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTab_AttConfirmDelegationApproval_WaitingConfirm',
        screenName: ScreenName.AttConfirmDelegationApproval
    },
    {
        title: 'HRM_PortalApp_TopTab_AttConfirmDelegationApproval_Confirmed',
        screenName: ScreenName.AttConfirmedDelegationApproval
    },
    {
        title: 'HRM_PortalApp_TopTab_AttConfirmDelegationApproval_Rejected',
        screenName: ScreenName.AttRejectDelegationApproval
    },
    {
        title: 'HRM_PortalApp_TopTab_AttConfirmDelegationApproval_Cancelled',
        screenName: ScreenName.AttCanceledDelegationApproval
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabAttConfirmDelegationApproval = createMaterialTopTabNavigator(
    {
        AttConfirmDelegationApproval: {
            screen: AttConfirmDelegationApproval,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttConfirmDelegationApproval_WaitingConfirm')
        },
        AttConfirmedDelegationApproval: {
            screen: AttConfirmedDelegationApproval,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttConfirmDelegationApproval_Confirmed')
        },
        AttRejectDelegationApproval: {
            screen: AttRejectDelegationApproval,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttConfirmDelegationApproval_Rejected')
        },
        AttCanceledDelegationApproval: {
            screen: AttCanceledDelegationApproval,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttConfirmDelegationApproval_Cancelled ')
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

export default TopTabAttConfirmDelegationApproval;
