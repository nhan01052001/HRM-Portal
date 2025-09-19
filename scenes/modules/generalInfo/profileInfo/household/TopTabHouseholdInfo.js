import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import HouseholdConfirmed from './householdConfirmed/HouseholdConfirmed';
import HouseholdWaitConfirm from './householdWaitConfirm/HouseholdWaitConfirm';
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
        screenName: ScreenName.HouseholdConfirmed
    },
    {
        title: 'HRM_Common_WaitingConfirm',
        screenName: ScreenName.HouseholdWaitConfirm
    }
];

const TopTabHouseholdInfo = createMaterialTopTabNavigator(
    {
        HouseholdConfirmed: {
            screen: HouseholdConfirmed,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Common_Confirm')
        },
        HouseholdWaitConfirm: {
            screen: HouseholdWaitConfirm,
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
                (!PermissionForAppMobile.value['HouseholdInfo_Index_HouseholdInfoGird'] ||
                    !PermissionForAppMobile.value['HouseholdInfo_Index_HouseholdInfoGird']['View'])
            ) {
                data = data.filter(item => item.screenName !== ScreenName.HouseholdConfirmed);
                perTabConfirmed = false;
            }

            if (
                PermissionForAppMobile &&
                (!PermissionForAppMobile.value['Household_Request_Add_Index_Household_Request_AddGird'] ||
                    !PermissionForAppMobile.value['Household_Request_Add_Index_Household_Request_AddGird']['View'])
            ) {
                data = data.filter(item => item.screenName !== ScreenName.HouseholdWaitConfirm);
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

export default TopTabHouseholdInfo;
