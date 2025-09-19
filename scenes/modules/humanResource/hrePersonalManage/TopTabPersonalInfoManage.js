import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import HreAllPersonalInfoManage from './hrePersonalInfoManage/HreAllPersonalInfoManage';
import HreHirePersonalInfoManage from './hrePersonalInfoManage/HreHirePersonalInfoManage';
import HreWaitPersonalInfoManage from './hrePersonalInfoManage/HreWaitPersonalInfoManage';
import HreStopPersonalInfoManage from './hrePersonalInfoManage/HreStopPersonalInfoManage';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTabAllData',
        screenName: ScreenName.HreAllPersonalInfoManage
    },
    {
        title: 'HRM_PortalApp_TopTabWaitData',
        screenName: ScreenName.HreWaitPersonalInfoManage
    },
    {
        title: 'HRM_PortalApp_TopTabHireData',
        screenName: ScreenName.HreHirePersonalInfoManage
    },
    {
        title: 'HRM_PortalApp_TopTabStopData',
        screenName: ScreenName.HreStopPersonalInfoManage
    }
];

const TopTabPersonalInfoManage = createMaterialTopTabNavigator(
    {
        HreAllPersonalInfoManage: {
            screen: HreAllPersonalInfoManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreWaitPersonalInfoManage: {
            screen: HreWaitPersonalInfoManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreHirePersonalInfoManage: {
            screen: HreHirePersonalInfoManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreStopPersonalInfoManage: {
            screen: HreStopPersonalInfoManage,
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
export default TopTabPersonalInfoManage;
