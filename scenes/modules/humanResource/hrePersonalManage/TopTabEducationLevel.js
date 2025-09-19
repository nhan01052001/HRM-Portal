import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import HreAllEducationLevel from './hreEducationLevel/HreAllEducationLevel';
import HreHireEducationLevel from './hreEducationLevel/HreHireEducationLevel';
import HreWaitEducationLevel from './hreEducationLevel/HreWaitEducationLevel';
import HreStopEducationLevel from './hreEducationLevel/HreStopEducationLevel';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTabAllData',
        screenName: ScreenName.HreAllEducationLevel
    },
    {
        title: 'HRM_PortalApp_TopTabWaitData',
        screenName: ScreenName.HreWaitEducationLevel
    },
    {
        title: 'HRM_PortalApp_TopTabHireData',
        screenName: ScreenName.HreHireEducationLevel
    },
    {
        title: 'HRM_PortalApp_TopTabStopData',
        screenName: ScreenName.HreStopEducationLevel
    }
];

const TopTabEducationLevel = createMaterialTopTabNavigator(
    {
        HreAllEducationLevel: {
            screen: HreAllEducationLevel,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreWaitEducationLevel: {
            screen: HreWaitEducationLevel,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreHireEducationLevel: {
            screen: HreHireEducationLevel,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreStopEducationLevel: {
            screen: HreStopEducationLevel,
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
export default TopTabEducationLevel;
