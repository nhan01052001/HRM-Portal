import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import HreAllDisciplineManage from './hreDisciplineManage/HreAllDisciplineManage';
import HreHireDisciplineManage from './hreDisciplineManage/HreHireDisciplineManage';
import HreWaitDisciplineManage from './hreDisciplineManage/HreWaitDisciplineManage';
import HreStopDisciplineManage from './hreDisciplineManage/HreStopDisciplineManage';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTabAllData',
        screenName: ScreenName.HreAllDisciplineManage
    },
    {
        title: 'HRM_PortalApp_TopTabWaitData',
        screenName: ScreenName.HreWaitDisciplineManage
    },
    {
        title: 'HRM_PortalApp_TopTabHireData',
        screenName: ScreenName.HreHireDisciplineManage
    },
    {
        title: 'HRM_PortalApp_TopTabStopData',
        screenName: ScreenName.HreStopDisciplineManage
    }
];

const TopTabDisciplineManage = createMaterialTopTabNavigator(
    {
        HreAllDisciplineManage: {
            screen: HreAllDisciplineManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreWaitDisciplineManage: {
            screen: HreWaitDisciplineManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreHireDisciplineManage: {
            screen: HreHireDisciplineManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreStopDisciplineManage: {
            screen: HreStopDisciplineManage,
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
export default TopTabDisciplineManage;
