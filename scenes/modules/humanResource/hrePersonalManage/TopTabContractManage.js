import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import HreAllContractManage from './hreContractManage/HreAllContractManage';
import HreHireContractManage from './hreContractManage/HreHireContractManage';
import HreWaitContractManage from './hreContractManage/HreWaitContractManage';
import HreStopContractManage from './hreContractManage/HreStopContractManage';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTabAllData',
        screenName: ScreenName.HreAllContractManage
    },
    {
        title: 'HRM_PortalApp_TopTabWaitData',
        screenName: ScreenName.HreWaitContractManage
    },
    {
        title: 'HRM_PortalApp_TopTabHireData',
        screenName: ScreenName.HreHireContractManage
    },
    {
        title: 'HRM_PortalApp_TopTabStopData',
        screenName: ScreenName.HreStopContractManage
    }
];

const TopTabContractManage = createMaterialTopTabNavigator(
    {
        HreAllContractManage: {
            screen: HreAllContractManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreWaitContractManage: {
            screen: HreWaitContractManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreHireContractManage: {
            screen: HreHireContractManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreStopContractManage: {
            screen: HreStopContractManage,
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
export default TopTabContractManage;
