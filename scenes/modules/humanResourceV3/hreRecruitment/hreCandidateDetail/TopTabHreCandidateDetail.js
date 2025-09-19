import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { ScreenName } from '../../../../../assets/constant';
import HreCandidateInformation from './HreCandidateInformation';
import HreCandidateHistoryApply from './HreCandidateHistoryApply';
import HreCandidateInterview from './HreCandidateInterview';
import HreRecruitmentProposal from './HreRecruitmentProposal';

import RenderTopTab from '../../../../../navigation/tabar/RenderTopTab';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
// import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';

// Chi tiết ứng viên
const TopTabHreCandidateDetail = createMaterialTopTabNavigator(
    {
        HreCandidateInformation: {
            screen: HreCandidateInformation
        },
        HreCandidateInterview: {
            screen: HreCandidateInterview
        },
        HreRecruitmentProposal: {
            screen: HreRecruitmentProposal
        },
        HreCandidateHistoryApply: {
            screen: HreCandidateHistoryApply
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: navigationAll => {
            let perHreCandidateInformation = true,
                perHreCandidateInterview = true,
                perHreRecruitmentProposal = true,
                perHreCandidateHistoryApply = true;

            let data = [
                {
                    title: 'HRM_PortalApp_DocumentInformation',
                    screenName: ScreenName.HreCandidateInformation
                },
                {
                    title: 'HRM_PortalApp_TopTabInterview',
                    screenName: ScreenName.HreCandidateInterview
                },
                {
                    title: 'HRM_PortalApp_RecruitmentProposal',
                    screenName: ScreenName.HreRecruitmentProposal
                },
                {
                    title: 'HRM_PortalApp_ApplicationHistory',
                    screenName: ScreenName.HreCandidateHistoryApply
                }
            ];

            if (
                PermissionForAppMobile &&
                (!PermissionForAppMobile.value['New_PortalV3_Rec_CandidateProfileDetail_GeneralInfoTab'] ||
                    !PermissionForAppMobile.value['New_PortalV3_Rec_CandidateProfileDetail_GeneralInfoTab']['View'])
            ) {
                data = data.filter(item => item.screenName !== ScreenName.HreCandidateInformation);
                perHreCandidateInformation = false;
            }

            if (
                PermissionForAppMobile &&
                (!PermissionForAppMobile.value['New_PortalV3_Rec_CandidateProfileDetail_InterviewTab'] ||
                    !PermissionForAppMobile.value['New_PortalV3_Rec_CandidateProfileDetail_InterviewTab']['View'])
            ) {
                data = data.filter(item => item.screenName !== ScreenName.HreCandidateInterview);
                perHreCandidateInterview = false;
            }

            if (
                PermissionForAppMobile &&
                (!PermissionForAppMobile.value['New_PortalV3_Rec_CandidateProfileDetail_HiringProposalTab'] ||
                    !PermissionForAppMobile.value['New_PortalV3_Rec_CandidateProfileDetail_HiringProposalTab']['View'])
            ) {
                data = data.filter(item => item.screenName !== ScreenName.HreRecruitmentProposal);
                perHreRecruitmentProposal = false;
            }

            if (
                PermissionForAppMobile &&
                (!PermissionForAppMobile.value['New_PortalV3_Rec_CandidateProfileDetail_HistoryCandidateTab'] ||
                    !PermissionForAppMobile.value['New_PortalV3_Rec_CandidateProfileDetail_HistoryCandidateTab']['View'])
            ) {
                data = data.filter(item => item.screenName !== ScreenName.HreCandidateHistoryApply);
                perHreCandidateHistoryApply = false;
            }

            if ((perHreCandidateInformation || perHreCandidateInterview || perHreRecruitmentProposal || perHreCandidateHistoryApply) && Array.isArray(data) && data.length > 0) {
                return <RenderTopTab data={data} navigationAll={navigationAll} />;
            } else {
                return <View />;
            }
        }
    }
);

export default TopTabHreCandidateDetail;
