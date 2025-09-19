import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import HreAllAnnualManage from './hreAnnualManage/HreAllAnnualManage';
import HreHireAnnualManage from './hreAnnualManage/HreHireAnnualManage';
import HreWaitAnnualManage from './hreAnnualManage/HreWaitAnnualManage';
import HreStopAnnualManage from './hreAnnualManage/HreStopAnnualManage';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTabAllData',
        screenName: ScreenName.HreAllAnnualManage
    },
    {
        title: 'HRM_PortalApp_TopTabWaitData',
        screenName: ScreenName.HreWaitAnnualManage
    },
    {
        title: 'HRM_PortalApp_TopTabHireData',
        screenName: ScreenName.HreHireAnnualManage
    },
    {
        title: 'HRM_PortalApp_TopTabStopData',
        screenName: ScreenName.HreStopAnnualManage
    }
];

const TopTabAnnualManage = createMaterialTopTabNavigator(
    {
        HreAllAnnualManage: {
            screen: HreAllAnnualManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreWaitAnnualManage: {
            screen: HreWaitAnnualManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreHireAnnualManage: {
            screen: HreHireAnnualManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreStopAnnualManage: {
            screen: HreStopAnnualManage,
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
export default TopTabAnnualManage;
