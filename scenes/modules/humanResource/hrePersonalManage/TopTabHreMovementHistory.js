import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import HreAllMovementHistory from './hreMovementHistory/HreAllMovementHistory';
import HreHireMovementHistory from './hreMovementHistory/HreHireMovementHistory';
import HreWaitMovementHistory from './hreMovementHistory/HreWaitMovementHistory';
import HreStopMovementHistory from './hreMovementHistory/HreStopMovementHistory';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTabAllData',
        screenName: ScreenName.HreAllMovementHistory
    },
    {
        title: 'HRM_PortalApp_TopTabWaitData',
        screenName: ScreenName.HreWaitMovementHistory
    },
    {
        title: 'HRM_PortalApp_TopTabHireData',
        screenName: ScreenName.HreHireMovementHistory
    },
    {
        title: 'HRM_PortalApp_TopTabStopData',
        screenName: ScreenName.HreStopMovementHistory
    }
];

const TopTabHreMovementHistory = createMaterialTopTabNavigator(
    {
        HreAllMovementHistory: {
            screen: HreAllMovementHistory,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreWaitMovementHistory: {
            screen: HreWaitMovementHistory,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreHireMovementHistory: {
            screen: HreHireMovementHistory,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreStopMovementHistory: {
            screen: HreStopMovementHistory,
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
export default TopTabHreMovementHistory;
