import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import WorkingExperienceConfirmed from './workingExperienceConfirmed/WorkingExperienceConfirmed';
import WorkingExperienceWaitConfirm from './workingExperienceWaitConfirm/WorkingExperienceWaitConfirm';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import RenderTopTab from '../../../../../navigation/tabar/RenderTopTab';
import { ScreenName } from '../../../../../assets/constant';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

let data = [
    {
        title: 'HRM_Common_Confirm',
        screenName: ScreenName.WorkingExperienceConfirmed
    },
    {
        title: 'HRM_Common_WaitingConfirm',
        screenName: ScreenName.WorkingExperienceWaitConfirm
    }
];

const TopTabWorkingExperienceInfo = createMaterialTopTabNavigator(
    {
        WorkingExperienceConfirmed: {
            screen: WorkingExperienceConfirmed,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Common_Confirm')
        },
        WorkingExperienceWaitConfirm: {
            screen: WorkingExperienceWaitConfirm,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Common_WaitingConfirm')
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: navigationAll => {

            let perTabConfirmed = true,
                perTabWaitConfirm = true;

            if (
                PermissionForAppMobile &&
                (!PermissionForAppMobile.value['HRM_HR_WorkingExperience_Portal_ListGird'] ||
                    !PermissionForAppMobile.value['HRM_HR_WorkingExperience_Portal_ListGird']['View'])
            ) {
                data = data.filter(item => item.screenName !== ScreenName.WorkingExperienceConfirmed);
                perTabConfirmed = false;
            }

            if (
                PermissionForAppMobile &&
                (!PermissionForAppMobile.value['HRM_HR_WorkingExperience_Portal_WaitingGrid'] ||
                    !PermissionForAppMobile.value['HRM_HR_WorkingExperience_Portal_WaitingGrid']['View'])
            ) {
                data = data.filter(item => item.screenName !== ScreenName.WorkingExperienceWaitConfirm);
                perTabWaitConfirm = false;
            }

            if ((perTabConfirmed || perTabWaitConfirm) && Array.isArray(data) && data.length > 0) {
                return <RenderTopTab data={data} navigationAll={navigationAll} />;
            } else {
                return <View />;
            }
        }
    }
);

export default TopTabWorkingExperienceInfo;
