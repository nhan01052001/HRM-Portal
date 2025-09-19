import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../../i18n/translate';
import { ScreenName } from '../../../../../assets/constant';
import RenderTopTab from '../../../../../navigation/tabar/RenderTopTab';
import HreDoneRecruitmentProposalProcessing from './hreDoneRecruitmentProposalProcessing/HreDoneRecruitmentProposalProcessing';
import HreWaitRecruitmentProposalProcessing from './hreWaitRecruitmentProposalProcessing/HreWaitRecruitmentProposalProcessing';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_HreRecruitmentProposal_ProcessingWaitingApproved', //HRM_PortalApp_TopTab_RecruitmentProposalProcessing_Wait
        screenName: ScreenName.HreWaitRecruitmentProposalProcessing
    },
    {
        title: 'HRM_PortalApp_HreRecruitmentProposal_ProcessedApproved', //HRM_PortalApp_TopTab_RecruitmentProposalProcessing_Done
        screenName: ScreenName.HreDoneRecruitmentProposalProcessing
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabHreRecruitmentProposalProcessing = createMaterialTopTabNavigator(
    {
        HreWaitRecruitmentProposalProcessing: {
            screen: HreWaitRecruitmentProposalProcessing,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_HreRecruitmentProposal_ProcessingWaitingApproved')
        },
        HreDoneRecruitmentProposalProcessing: {
            screen: HreDoneRecruitmentProposalProcessing,
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

export default TopTabHreRecruitmentProposalProcessing;
