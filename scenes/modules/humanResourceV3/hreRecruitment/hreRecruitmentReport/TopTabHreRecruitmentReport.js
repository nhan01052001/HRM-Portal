import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../../i18n/translate';
import { ScreenName } from '../../../../../assets/constant';
import HrePendingRecruitmentReport from './hrePendingRecruitmentReport/HrePendingRecruitmentReport';
import HreProcesedRecruitmentReport from './hreProcesedRecruitmentReport/HreProcesedRecruitmentReport';
import RenderTopTab from '../../../../../navigation/tabar/RenderTopTab';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'Chờ xử lý',
        screenName: ScreenName.HrePendingRecruitmentReport
    },
    {
        title: 'Đã xử lý',
        screenName: ScreenName.HreProcesedRecruitmentReport
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabHreRecruitmentReport = createMaterialTopTabNavigator(
    {
        HrePendingRecruitmentReport: {
            screen: HrePendingRecruitmentReport,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_All')
        },
        HreProcesedRecruitmentReport: {
            screen: HreProcesedRecruitmentReport,
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

export default TopTabHreRecruitmentReport;
