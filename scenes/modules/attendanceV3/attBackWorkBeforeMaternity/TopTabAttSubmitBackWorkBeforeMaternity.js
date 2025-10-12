import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import AttSubmitBackWorkBeforeMaternity from './attSubmitBackWorkBeforeMaternity/AttSubmitBackWorkBeforeMaternity';
import AttApproveSubmitBackWorkBeforeMaternity from './attSubmitBackWorkBeforeMaternity/attApproveSubmitBackWorkBeforeMaternity/AttApproveSubmitBackWorkBeforeMaternity';
import AttApprovedSubmitBackWorkBeforeMaternity from './attSubmitBackWorkBeforeMaternity/attApprovedSubmitBackWorkBeforeMaternity/AttApprovedSubmitBackWorkBeforeMaternity';
import AttCanceledSubmitBackWorkBeforeMaternity from './attSubmitBackWorkBeforeMaternity/attCanceledSubmitBackWorkBeforeMaternity/AttCanceledSubmitBackWorkBeforeMaternity';
import AttRejectSubmitBackWorkBeforeMaternity from './attSubmitBackWorkBeforeMaternity/attRejectSubmitBackWorkBeforeMaternity/AttRejectSubmitBackWorkBeforeMaternity';
import AttSaveTempSubmitBackWorkBeforeMaternity from './attSubmitBackWorkBeforeMaternity/attSaveTempSubmitBackWorkBeforeMaternity/AttSaveTempSubmitBackWorkBeforeMaternity';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTabAllData',
        screenName: ScreenName.AttSubmitBackWorkBeforeMaternity
    },
    {
        title: 'HRM_PortalApp_TopTabSaveTemp',
        screenName: ScreenName.AttSaveTempSubmitBackWorkBeforeMaternity
    },
    {
        title: 'HRM_PortalApp_TopTabWaitingApprove',
        screenName: ScreenName.AttApproveSubmitBackWorkBeforeMaternity
    },
    {
        title: 'HRM_PortalApp_TopTabApproved',
        screenName: ScreenName.AttApprovedSubmitBackWorkBeforeMaternity
    },
    {
        title: 'HRM_PortalApp_TopTabReject',
        screenName: ScreenName.AttRejectSubmitBackWorkBeforeMaternity
    },
    {
        title: 'HRM_PortalApp_TopTabCancel',
        screenName: ScreenName.AttCanceledSubmitBackWorkBeforeMaternity
    }
];

const TopTabAttSubmitBackWorkBeforeMaternity = createMaterialTopTabNavigator(
    {
        AttSubmitBackWorkBeforeMaternity: {
            screen: AttSubmitBackWorkBeforeMaternity,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTabAllData')
        },
        AttSaveTempSubmitBackWorkBeforeMaternity: {
            screen: AttSaveTempSubmitBackWorkBeforeMaternity,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTabSaveTemp')
        },
        AttApproveSubmitBackWorkBeforeMaternity: {
            screen: AttApproveSubmitBackWorkBeforeMaternity,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTabWaitingApprove')
        },
        AttApprovedSubmitBackWorkBeforeMaternity: {
            screen: AttApprovedSubmitBackWorkBeforeMaternity,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTabApproved')
        },
        AttRejectSubmitBackWorkBeforeMaternity: {
            screen: AttRejectSubmitBackWorkBeforeMaternity,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTabReject')
        },
        AttCanceledSubmitBackWorkBeforeMaternity: {
            screen: AttCanceledSubmitBackWorkBeforeMaternity,
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

            if ((perTabApprove || perTabWaitApproved || perTabReject) && Array.isArray(data) && data.length > 0) {
                return <RenderTopTab data={data} navigationAll={navigationAll} />;
            } else {
                return <View />;
            }
        }
    }
);

export default TopTabAttSubmitBackWorkBeforeMaternity;


