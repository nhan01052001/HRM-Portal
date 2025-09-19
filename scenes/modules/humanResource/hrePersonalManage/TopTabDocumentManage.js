import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import HreAllDocumentManage from './hreDocumentManage/HreAllDocumentManage';
import HreHireDocumentManage from './hreDocumentManage/HreHireDocumentManage';
import HreWaitDocumentManage from './hreDocumentManage/HreWaitDocumentManage';
import HreStopDocumentManage from './hreDocumentManage/HreStopDocumentManage';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTabAllData',
        screenName: ScreenName.HreAllDocumentManage
    },
    {
        title: 'HRM_PortalApp_TopTabWaitData',
        screenName: ScreenName.HreStopDocumentManage
    },
    {
        title: 'HRM_PortalApp_TopTabHireData',
        screenName: ScreenName.HreWaitDocumentManage
    },
    {
        title: 'HRM_PortalApp_TopTabStopData',
        screenName: ScreenName.HreHireDocumentManage
    }
];

const TopTabDocumentManage = createMaterialTopTabNavigator(
    {
        HreAllDocumentManage: {
            screen: HreAllDocumentManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreWaitDocumentManage: {
            screen: HreWaitDocumentManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreHireDocumentManage: {
            screen: HreHireDocumentManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreStopDocumentManage: {
            screen: HreStopDocumentManage,
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
export default TopTabDocumentManage;
