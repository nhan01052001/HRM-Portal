import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import HreAllCompensationManage from './hreCompensationManage/HreAllCompensationManage';
import HreHireCompensationManage from './hreCompensationManage/HreHireCompensationManage';
import HreWaitCompensationManage from './hreCompensationManage/HreWaitCompensationManage';
import HreStopCompensationManage from './hreCompensationManage/HreStopCompensationManage';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTabAllData',
        screenName: ScreenName.HreAllCompensationManage
    },
    {
        title: 'HRM_PortalApp_TopTabWaitData',
        screenName: ScreenName.HreWaitCompensationManage
    },
    {
        title: 'HRM_PortalApp_TopTabHireData',
        screenName: ScreenName.HreHireCompensationManage
    },
    {
        title: 'HRM_PortalApp_TopTabStopData',
        screenName: ScreenName.HreStopCompensationManage
    }
];

const TopTabCompensationManage = createMaterialTopTabNavigator(
    {
        HreAllCompensationManage: {
            screen: HreAllCompensationManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreWaitCompensationManage: {
            screen: HreWaitCompensationManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreHireCompensationManage: {
            screen: HreHireCompensationManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreStopCompensationManage: {
            screen: HreStopCompensationManage,
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
export default TopTabCompensationManage;
