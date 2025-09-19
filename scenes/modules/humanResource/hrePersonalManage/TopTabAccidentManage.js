import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import HreAllAccidentManage from './hreAccidentManage/HreAllAccidentManage';
import HreHireAccidentManage from './hreAccidentManage/HreHireAccidentManage';
import HreWaitAccidentManage from './hreAccidentManage/HreWaitAccidentManage';
import HreStopAccidentManage from './hreAccidentManage/HreStopAccidentManage';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTabAllData',
        screenName: ScreenName.HreAllAccidentManage
    },
    {
        title: 'HRM_PortalApp_TopTabWaitData',
        screenName: ScreenName.HreWaitAccidentManage
    },
    {
        title: 'HRM_PortalApp_TopTabHireData',
        screenName: ScreenName.HreHireAccidentManage
    },
    {
        title: 'HRM_PortalApp_TopTabStopData',
        screenName: ScreenName.HreStopAccidentManage
    }
];

const TopTabAccidentManage = createMaterialTopTabNavigator(
    {
        HreAllAccidentManage: {
            screen: HreAllAccidentManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreWaitAccidentManage: {
            screen: HreWaitAccidentManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreHireAccidentManage: {
            screen: HreHireAccidentManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreStopAccidentManage: {
            screen: HreStopAccidentManage,
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
export default TopTabAccidentManage;
