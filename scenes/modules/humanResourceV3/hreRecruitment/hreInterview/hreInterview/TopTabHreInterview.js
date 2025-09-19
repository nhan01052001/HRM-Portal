import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { ScreenName } from '../../../../../../assets/constant';
import RenderTopTab from '../../../../../../navigation/tabar/RenderTopTab';
import HreCompletedInterview from './hreCompletedInterview/HreCompletedInterview';
import HreWaitingInterview from './hreWaitingInterview/HreWaitingInterview';

const data = [
    {
        title: 'HRM_PortalApp_TopTab_WaitingInterview',
        screenName: ScreenName.HreWaitingInterview
    },
    {
        title: 'HRM_PortalApp_TopTab_CompletedInterview',
        screenName: ScreenName.HreCompletedInterview
    }
];

//#region [Lịch phỏng vấn (Chờ đánh giá, Đã đánh giá)]
const TopTabHreInterview = createMaterialTopTabNavigator(
    {
        HreWaitingInterview: {
            screen: HreWaitingInterview
        },
        HreCompletedInterview: {
            screen: HreCompletedInterview
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

export default TopTabHreInterview;
