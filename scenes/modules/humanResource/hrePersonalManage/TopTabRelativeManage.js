import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import HreAllRelativeManage from './hreRelativeManage/HreAllRelativeManage';
import HreHireRelativeManage from './hreRelativeManage/HreHireRelativeManage';
import HreWaitRelativeManage from './hreRelativeManage/HreWaitRelativeManage';
import HreStopRelativeManage from './hreRelativeManage/HreStopRelativeManage';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTabAllData',
        screenName: ScreenName.HreAllRelativeManage
    },
    {
        title: 'HRM_PortalApp_TopTabWaitData',
        screenName: ScreenName.HreWaitRelativeManage
    },
    {
        title: 'HRM_PortalApp_TopTabHireData',
        screenName: ScreenName.HreHireRelativeManage
    },
    {
        title: 'HRM_PortalApp_TopTabStopData',
        screenName: ScreenName.HreStopRelativeManage
    }
];

const TopTabRelativeManage = createMaterialTopTabNavigator(
    {
        HreAllRelativeManage: {
            screen: HreAllRelativeManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreWaitRelativeManage: {
            screen: HreWaitRelativeManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreHireRelativeManage: {
            screen: HreHireRelativeManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreStopRelativeManage: {
            screen: HreStopRelativeManage,
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
export default TopTabRelativeManage;
