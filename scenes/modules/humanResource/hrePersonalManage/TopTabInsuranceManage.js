import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import HreAllInsuranceManage from './hreInsuranceManage/HreAllInsuranceManage';
import HreHireInsuranceManage from './hreInsuranceManage/HreHireInsuranceManage';
import HreWaitInsuranceManage from './hreInsuranceManage/HreWaitInsuranceManage';
import HreStopInsuranceManage from './hreInsuranceManage/HreStopInsuranceManage';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTabAllData',
        screenName: ScreenName.HreAllInsuranceManage
    },
    {
        title: 'HRM_PortalApp_TopTabWaitData',
        screenName: ScreenName.HreWaitInsuranceManage
    },
    {
        title: 'HRM_PortalApp_TopTabHireData',
        screenName: ScreenName.HreHireInsuranceManage
    },
    {
        title: 'HRM_PortalApp_TopTabStopData',
        screenName: ScreenName.HreStopInsuranceManage
    }
];

const TopTabInsuranceManage = createMaterialTopTabNavigator(
    {
        HreAllInsuranceManage: {
            screen: HreAllInsuranceManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreWaitInsuranceManage: {
            screen: HreWaitInsuranceManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreHireInsuranceManage: {
            screen: HreHireInsuranceManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreStopInsuranceManage: {
            screen: HreStopInsuranceManage,
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
export default TopTabInsuranceManage;
