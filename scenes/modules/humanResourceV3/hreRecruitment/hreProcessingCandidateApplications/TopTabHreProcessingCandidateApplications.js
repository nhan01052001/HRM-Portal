import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../../i18n/translate';
import { ScreenName } from '../../../../../assets/constant';
import HrePendingProcessingCandidateApplications from './hrePendingProcessingCandidateApplications/HrePendingProcessingCandidateApplications';
import HreProcesedProcessingCandidateApplications from './hreProcesedProcessingCandidateApplications/HreProcesedProcessingCandidateApplications';
import RenderTopTab from '../../../../../navigation/tabar/RenderTopTab';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_WaitingApproval',
        screenName: ScreenName.HrePendingProcessingCandidateApplications
    },
    {
        title: 'HRM_PortalApp_HreRecruitmentProposal_ProcessedApproved',
        screenName: ScreenName.HreProcesedProcessingCandidateApplications
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabHreProcessingCandidateApplications = createMaterialTopTabNavigator(
    {
        HrePendingProcessingCandidateApplications: {
            screen: HrePendingProcessingCandidateApplications,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_All')
        },
        HreProcesedProcessingCandidateApplications: {
            screen: HreProcesedProcessingCandidateApplications,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_SaveTemporary')
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: navigationAll => {

            let perTabApprove = true,
                perTabWaitApproved = true,
                perTabReject = true;

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

export default TopTabHreProcessingCandidateApplications;
