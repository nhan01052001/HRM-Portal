import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import AttApproveBackWorkBeforeMaternity from './attApproveBackWorkBeforeMaternity/attApproveBackWorkBeforeMaternity/AttApproveBackWorkBeforeMaternity';
import AttApprovedBackWorkBeforeMaternity from './attApproveBackWorkBeforeMaternity/attApprovedBackWorkBeforeMaternity/AttApprovedBackWorkBeforeMaternity';
import AttRejectBackWorkBeforeMaternity from './attApproveBackWorkBeforeMaternity/attRejectBackWorkBeforeMaternity/AttRejectBackWorkBeforeMaternity';
import AttCanceledBackWorkBeforeMaternity from './attApproveBackWorkBeforeMaternity/attCanceledBackWorkBeforeMaternity/AttCanceledBackWorkBeforeMaternity';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTabWaitingApprove',
        screenName: ScreenName.AttApproveBackWorkBeforeMaternity
    },
    {
        title: 'HRM_PortalApp_TopTabApproved',
        screenName: ScreenName.AttApprovedBackWorkBeforeMaternity
    },
    {
        title: 'HRM_PortalApp_TopTabReject',
        screenName: ScreenName.AttRejectBackWorkBeforeMaternity
    },
    {
        title: 'HRM_PortalApp_TopTabCancel',
        screenName: ScreenName.AttCanceledBackWorkBeforeMaternity
    }
];

const TopTabAttApproveBackWorkBeforeMaternity = createMaterialTopTabNavigator(
    {
        AttApproveBackWorkBeforeMaternity: {
            screen: AttApproveBackWorkBeforeMaternity,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTabWaitingApprove')
        },
        AttApprovedBackWorkBeforeMaternity: {
            screen: AttApprovedBackWorkBeforeMaternity,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTabApproved')
        },
        AttRejectBackWorkBeforeMaternity: {
            screen: AttRejectBackWorkBeforeMaternity,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTabReject')
        },
        AttCanceledBackWorkBeforeMaternity: {
            screen: AttCanceledBackWorkBeforeMaternity,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTabCancel')
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: (navigationAll) => {
            let perTabApprove = true,
                perTabWaitApproved = true,
                perTabReject = true;

            if (perTabApprove || ((perTabWaitApproved || perTabReject) && Array.isArray(data) && data.length > 0)) {
                return <RenderTopTab data={data} navigationAll={navigationAll} />;
            } else {
                return <View />;
            }
        }
    }
);

export default TopTabAttApproveBackWorkBeforeMaternity;


