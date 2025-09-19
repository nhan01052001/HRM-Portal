import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../../i18n/translate';
import { ScreenName } from '../../../../../assets/constant';
import RenderTopTab from '../../../../../navigation/tabar/RenderTopTab';
import HreDoneProcessingJobPosting from './hreDoneProcessingJobPosting/HreDoneProcessingJobPosting';
import HreWaitProcessingJobPosting from './hreWaitProcessingJobPosting/HreWaitProcessingJobPosting';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_WaitingApproval', //HRM_PortalApp_TopTab_ProcessingJobPosting_Wait
        screenName: ScreenName.HreWaitProcessingJobPosting
    },
    {
        title: 'HRM_PortalApp_HreProcessingPostingPlan_Approved', //HRM_PortalApp_TopTab_ProcessingJobPosting_Done
        screenName: ScreenName.HreDoneProcessingJobPosting
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabHreProcessingJobPosting = createMaterialTopTabNavigator(
    {
        HreWaitProcessingJobPosting: {
            screen: HreWaitProcessingJobPosting,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_WaitingApproval')
        },
        HreDoneProcessingJobPosting: {
            screen: HreDoneProcessingJobPosting,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_HreProcessingPostingPlan_Approved')
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: (navigationAll) => {
            let perTabApprove = true,
                perTabWaitApproved = true,
                perTabReject = true;

            if (perTabApprove || ((perTabWaitApproved || perTabReject) && Array.isArray(data) && data.length > 0)) {
                return <RenderTopTab data={data} navigationAll={navigationAll} />;
            } else {
                return <View />;
            }
        }
    }
);
//#endregion

export default TopTabHreProcessingJobPosting;
