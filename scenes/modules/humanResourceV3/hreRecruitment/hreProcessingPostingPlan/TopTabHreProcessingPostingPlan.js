import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../../i18n/translate';
import { ScreenName } from '../../../../../assets/constant';
import RenderTopTab from '../../../../../navigation/tabar/RenderTopTab';
import HreDoneProcessingPostingPlan from './hreDoneProcessingPostingPlan/HreDoneProcessingPostingPlan';
import HreWaitProcessingPostingPlan from './hreWaitProcessingPostingPlan/HreWaitProcessingPostingPlan';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_HreRecruitmentProposal_ProcessingWaitingApproved', //HRM_PortalApp_TopTab_ProcessingPostingPlan_Wait
        screenName: ScreenName.HreWaitProcessingPostingPlan
    },
    {
        title: 'HRM_PortalApp_HreRecruitmentProposal_ProcessedApproved', //HRM_PortalApp_TopTab_ProcessingPostingPlan_Done
        screenName: ScreenName.HreDoneProcessingPostingPlan
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabHreProcessingPostingPlan = createMaterialTopTabNavigator(
    {
        HreWaitProcessingPostingPlan: {
            screen: HreWaitProcessingPostingPlan,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_HreRecruitmentProposal_ProcessingWaitingApproved')
        },
        HreDoneProcessingPostingPlan: {
            screen: HreDoneProcessingPostingPlan,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_HreRecruitmentProposal_ProcessedApproved')
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

export default TopTabHreProcessingPostingPlan;
