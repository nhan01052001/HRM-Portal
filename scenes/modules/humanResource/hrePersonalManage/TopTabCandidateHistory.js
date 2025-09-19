import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import HreAllCandidateHistory from './hreCandidateHistory/HreAllCandidateHistory';
import HreHireCandidateHistory from './hreCandidateHistory/HreHireCandidateHistory';
import HreWaitCandidateHistory from './hreCandidateHistory/HreWaitCandidateHistory';
import HreStopCandidateHistory from './hreCandidateHistory/HreStopCandidateHistory';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTabAllData',
        screenName: ScreenName.HreAllCandidateHistory
    },
    {
        title: 'HRM_PortalApp_TopTabWaitData',
        screenName: ScreenName.HreStopCandidateHistory
    },
    {
        title: 'HRM_PortalApp_TopTabHireData',
        screenName: ScreenName.HreWaitCandidateHistory
    },
    {
        title: 'HRM_PortalApp_TopTabStopData',
        screenName: ScreenName.HreHireCandidateHistory
    }
];

const TopTabCandidateHistory = createMaterialTopTabNavigator(
    {
        HreAllCandidateHistory: {
            screen: HreAllCandidateHistory,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreWaitCandidateHistory: {
            screen: HreWaitCandidateHistory,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreHireCandidateHistory: {
            screen: HreHireCandidateHistory,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreStopCandidateHistory: {
            screen: HreStopCandidateHistory,
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
export default TopTabCandidateHistory;
