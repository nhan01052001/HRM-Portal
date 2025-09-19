import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import HreAllConcurrentManage from './hreConcurrentManage/HreAllConcurrentManage';
import HreHireConcurrentManage from './hreConcurrentManage/HreHireConcurrentManage';
import HreWaitConcurrentManage from './hreConcurrentManage/HreWaitConcurrentManage';
import HreStopConcurrentManage from './hreConcurrentManage/HreStopConcurrentManage';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTabAllData',
        screenName: ScreenName.HreAllConcurrentManage
    },
    {
        title: 'HRM_PortalApp_TopTabWaitData',
        screenName: ScreenName.HreWaitConcurrentManage
    },
    {
        title: 'HRM_PortalApp_TopTabHireData',
        screenName: ScreenName.HreHireConcurrentManage
    },
    {
        title: 'HRM_PortalApp_TopTabStopData',
        screenName: ScreenName.HreStopConcurrentManage
    }
];

const TopTabConcurrentManage = createMaterialTopTabNavigator(
    {
        HreAllConcurrentManage: {
            screen: HreAllConcurrentManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreWaitConcurrentManage: {
            screen: HreWaitConcurrentManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreHireConcurrentManage: {
            screen: HreHireConcurrentManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreStopConcurrentManage: {
            screen: HreStopConcurrentManage,
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
export default TopTabConcurrentManage;
