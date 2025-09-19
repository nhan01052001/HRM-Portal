import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import HreAllInforContact from './hreInforContact/HreAllInforContact';
import HreHireInforContact from './hreInforContact/HreHireInforContact';
import HreWaitInforContact from './hreInforContact/HreWaitInforContact';
import HreStopInforContact from './hreInforContact/HreStopInforContact';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTabAllData',
        screenName: ScreenName.HreAllInforContact
    },
    {
        title: 'HRM_PortalApp_TopTabWaitData',
        screenName: ScreenName.HreWaitInforContact
    },
    {
        title: 'HRM_PortalApp_TopTabHireData',
        screenName: ScreenName.HreHireInforContact
    },
    {
        title: 'HRM_PortalApp_TopTabStopData',
        screenName: ScreenName.HreStopInforContact
    }
];

const TopTabInforContactManage = createMaterialTopTabNavigator(
    {
        HreAllInforContact: {
            screen: HreAllInforContact,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreWaitInforContact: {
            screen: HreWaitInforContact,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreHireInforContact: {
            screen: HreHireInforContact,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreStopInforContact: {
            screen: HreStopInforContact,
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
export default TopTabInforContactManage;
