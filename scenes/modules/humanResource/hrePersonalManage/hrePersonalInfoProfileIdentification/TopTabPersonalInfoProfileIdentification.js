import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../../i18n/translate';
import { ScreenName } from '../../../../../assets/constant';
import RenderTopTab from '../../../../../navigation/tabar/RenderTopTab';
import HreAllPersonalInfoProfileIdentification from './HreAllPersonalInfoProfileIdentification';
import HreHirePersonalInfoProfileIdentification from './HreHirePersonalInfoProfileIdentification';
import HreWaitPersonalInfoProfileIdentification from './HreWaitPersonalInfoProfileIdentification';
import HreStopPersonalInfoProfileIdentification from './HreStopPersonalInfoProfileIdentification';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTabAllData',
        screenName: ScreenName.HreAllPersonalInfoProfileIdentification
    },
    {
        title: 'HRM_PortalApp_TopTabWaitData',
        screenName: ScreenName.HreWaitPersonalInfoProfileIdentification
    },
    {
        title: 'HRM_PortalApp_TopTabHireData',
        screenName: ScreenName.HreHirePersonalInfoProfileIdentification
    },
    {
        title: 'HRM_PortalApp_TopTabStopData',
        screenName: ScreenName.HreStopPersonalInfoProfileIdentification
    }
];

const TopTabPersonalInfoProfileIdentification = createMaterialTopTabNavigator(
    {
        HreAllPersonalInfoProfileIdentification: {
            screen: HreAllPersonalInfoProfileIdentification,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreWaitPersonalInfoProfileIdentification: {
            screen: HreWaitPersonalInfoProfileIdentification,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreHirePersonalInfoProfileIdentification: {
            screen: HreHirePersonalInfoProfileIdentification,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreStopPersonalInfoProfileIdentification: {
            screen: HreStopPersonalInfoProfileIdentification,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: function tabBarComponent(navigationAll) {
            return <RenderTopTab data={data} navigationAll={navigationAll} />;
        }
    }
);
export default TopTabPersonalInfoProfileIdentification;
