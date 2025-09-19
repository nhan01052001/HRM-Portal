import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import HreAllPartyAndUnion from './hrePartyAndUnionManage/HreAllPartyAndUnion';
import HreHirePartyAndUnion from './hrePartyAndUnionManage/HreHirePartyAndUnion';
import HreWaitPartyAndUnion from './hrePartyAndUnionManage/HreWaitPartyAndUnion';
import HreStopPartyAndUnion from './hrePartyAndUnionManage/HreStopPartyAndUnion';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTabAllData',
        screenName: ScreenName.HreAllPartyAndUnion
    },
    {
        title: 'HRM_PortalApp_TopTabWaitData',
        screenName: ScreenName.HreStopPartyAndUnion
    },
    {
        title: 'HRM_PortalApp_TopTabHireData',
        screenName: ScreenName.HreWaitPartyAndUnion
    },
    {
        title: 'HRM_PortalApp_TopTabStopData',
        screenName: ScreenName.HreHirePartyAndUnion
    }
];

const TopTabPartyAndUnionManage = createMaterialTopTabNavigator(
    {
        HreAllPartyAndUnion: {
            screen: HreAllPartyAndUnion,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreWaitPartyAndUnion: {
            screen: HreWaitPartyAndUnion,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreHirePartyAndUnion: {
            screen: HreHirePartyAndUnion,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreStopPartyAndUnion: {
            screen: HreStopPartyAndUnion,
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
export default TopTabPartyAndUnionManage;
