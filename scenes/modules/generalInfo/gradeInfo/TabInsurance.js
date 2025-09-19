import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, styleSheets } from '../../../../constants/styleConfig';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import HealthInsurance from './insurance/HealthInsurance';
import SocialInsurance from './insurance/SocialInsurance';
import UnEmploymentInsurance from './insurance/UnEmploymentInsurance';
import { translate } from '../../../../i18n/translate';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import { ScreenName } from '../../../../assets/constant';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

let data = [
    {
        title: 'HRM_Title_Insurance_IsRegisterSocialIns',
        screenName: ScreenName.SocialInsurance
    },
    {
        title: 'HRM_Title_Insurance_HealthInsurance',
        screenName: ScreenName.HealthInsurance
    },
    {
        title: 'HRM_Title_Insurance_UnEmploymentInsurance',
        screenName: ScreenName.UnEmploymentInsurance
    }
];

const TopTabInsurance = createMaterialTopTabNavigator(
    {
        SocialInsurance: {
            screen: SocialInsurance,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_Title_Insurance_IsRegisterSocialIns')
        },
        HealthInsurance: {
            screen: HealthInsurance,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_Title_Insurance_HealthInsurance')
        },

        UnEmploymentInsurance: {
            screen: UnEmploymentInsurance,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_Title_Insurance_UnEmploymentInsurance')
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: navigationAll => {
            const { navigation } = navigationAll,
                { index } = navigation.state;

            let perTabSocialInsurance = true,
                perTabHealthInsurance = true,
                perTabUnEmploymentInsurance = true;

            if (
                (perTabSocialInsurance || perTabHealthInsurance || perTabUnEmploymentInsurance) &&
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
export default TopTabInsurance;
