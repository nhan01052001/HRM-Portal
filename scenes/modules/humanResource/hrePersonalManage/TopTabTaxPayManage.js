import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import HreAllTaxPayManage from './hreTaxPayManage/HreAllTaxPayManage';
import HreHireTaxPayManage from './hreTaxPayManage/HreHireTaxPayManage';
import HreStopTaxPayManage from './hreTaxPayManage/HreStopTaxPayManage';
import HreWaitTaxPayManage from './hreTaxPayManage/HreWaitTaxPayManage';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTabAllData',
        screenName: ScreenName.HreAllTaxPayManage
    },
    {
        title: 'HRM_PortalApp_TopTabHireData',
        screenName: ScreenName.HreHireTaxPayManage
    },
    {
        title: 'HRM_PortalApp_TopTabStopData',
        screenName: ScreenName.HreStopTaxPayManage
    },
    {
        title: 'HRM_PortalApp_TopTabWaitData',
        screenName: ScreenName.HreWaitTaxPayManage
    }
];

const TopTabTaxPayManage = createMaterialTopTabNavigator(
    {
        HreAllTaxPayManage: {
            screen: HreAllTaxPayManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreStopTaxPayManage: {
            screen: HreStopTaxPayManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreHireTaxPayManage: {
            screen: HreHireTaxPayManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreWaitTaxPayManage: {
            screen: HreWaitTaxPayManage,
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
export default TopTabTaxPayManage;
