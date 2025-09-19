import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import LanguageLevelConfirmed from './languageLevelConfirmed/LanguageLevelConfirmed';
import LanguageLevelWaitConfirm from './languageLevelWaitConfirm/LanguageLevelWaitConfirm';
import LanguageLevelEdit from './languageLevelEdit/LanguageLevelEdit';
import { translate } from '../../../../../i18n/translate';
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
        screenName: ScreenName.LanguageLevelConfirmed
    },
    {
        title: 'HRM_Common_WaitingConfirm',
        screenName: ScreenName.LanguageLevelWaitConfirm
    },
    {
        title: 'HRM_System_Resource_Sys_Edit',
        screenName: ScreenName.LanguageLevelEdit
    }
];

const TopTabLanguageLevelInfo = createMaterialTopTabNavigator(
    {
        LanguageLevelConfirmed: {
            screen: LanguageLevelConfirmed,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Common_Confirm')
        },
        LanguageLevelWaitConfirm: {
            screen: LanguageLevelWaitConfirm,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Common_WaitingConfirm')
        },
        LanguageLevelEdit: {
            screen: LanguageLevelEdit,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_System_Resource_Sys_Edit')
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: navigationAll => {

            let perTabConfirmed = true,
                perTabWaitConfirm = true,
                perTabEdit = true;

            // if (PermissionForAppMobile && (!PermissionForAppMobile.value['HRM_HR_ProfileLanguageLevel_Portal_Grid']
            //     || !PermissionForAppMobile.value['HRM_HR_ProfileLanguageLevel_Portal_Grid']['View'])) {
            //     data = data.filter((item) => item.screenName !== ScreenName.LanguageLevelConfirmed)
            //     perTabConfirmed = false;
            // }

            // if (PermissionForAppMobile && (!PermissionForAppMobile.value['HRM_HR_ProfileLanguageLevel_Portal_Create_WaitingGrid']
            //     || !PermissionForAppMobile.value['HRM_HR_ProfileLanguageLevel_Portal_Create_WaitingGrid']['View'])) {
            //     data = data.filter((item) => item.screenName !== ScreenName.LanguageLevelWaitConfirm)
            //     perTabWaitConfirm = false;
            // }

            // if (PermissionForAppMobile && (!PermissionForAppMobile.value['HRM_HR_ProfileLanguageLevel_Portal_Edit_WaitingGrid']
            //     || !PermissionForAppMobile.value['HRM_HR_ProfileLanguageLevel_Portal_Edit_WaitingGrid']['View'])) {
            //     data = data.filter((item) => item.screenName !== ScreenName.LanguageLevelEdit)
            //     perTabEdit = false;
            // }

            if ((perTabConfirmed || (perTabWaitConfirm || perTabEdit)) && Array.isArray(data) && data.length > 0) {
                return <RenderTopTab data={data} navigationAll={navigationAll} />;
            } else {
                return <View />;
            }
        }
    }
);

export default TopTabLanguageLevelInfo;
