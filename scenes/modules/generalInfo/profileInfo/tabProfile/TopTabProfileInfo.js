import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import TopTabProfileBasicInfo from './TopTabProfileBasicInfo';
import TopTabProfilePersonalInfo from './TopTabProfilePersonalInfo';
import TopTabProfileContactInfo from './TopTabProfileContactInfo';
import RenderTopTab from '../../../../../navigation/tabar/RenderTopTab';
import { ScreenName } from '../../../../../assets/constant';

let data = [
    {
        title: 'HRM_HR_Profile_Basic',
        screenName: ScreenName.TopTabProfileBasicInfo
    },
    {
        title: 'HRM_HR_Profile_PersonalInfo',
        screenName: ScreenName.TopTabProfilePersonalInfo
    },
    {
        title: 'HRM_HR_Profile_ContactInfo',
        screenName: ScreenName.TopTabProfileContactInfo
    }
];

const TopTabProfileInfo = createMaterialTopTabNavigator(
    {
        TopTabProfileBasicInfo: {
            screen: TopTabProfileBasicInfo
        },
        TopTabProfilePersonalInfo: {
            screen: TopTabProfilePersonalInfo
        },
        TopTabProfileContactInfo: {
            screen: TopTabProfileContactInfo
        }
    },
    {
        lazy: true,
        swipeEnabled: true,
        tabBarComponent: (navigationAll) => {
            let perTabBacsicInfo = true,
                perTabPersonalInfo = true,
                perTabContactInfo = true;

            if (
                (perTabBacsicInfo || perTabPersonalInfo || perTabContactInfo) &&
                Array.isArray(data) &&
                data.length > 0
            ) {
                return <RenderTopTab data={data} navigationAll={navigationAll} />;
            } else {
                return <View />;
            }
        }
    }
);
export default TopTabProfileInfo;
