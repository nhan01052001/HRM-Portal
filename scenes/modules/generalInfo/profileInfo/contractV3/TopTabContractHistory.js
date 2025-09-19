import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../../i18n/translate';
import RenderTopTab from '../../../../../navigation/tabar/RenderTopTab';
import { ScreenName } from '../../../../../assets/constant';
import ContractHistoryAll from './contractHistoryAll/ContractHistoryAll';
import ContractHistoryWaitConfirm from './contractHistoryWaitConfirm/ContractHistoryWaitConfirm';
import ContractHistoryConfirmed from './contractHistoryConfirmed/ContractHistoryConfirmed';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

let data = [
    {
        title: 'HRM_PortalApp_ContractHistory_All',
        screenName: ScreenName.ContractHistoryAll
    },
    {
        title: 'HRM_PortalApp_ContractHistory_PendingReview',
        screenName: ScreenName.ContractHistoryWaitConfirm
    },
    {
        title: 'HRM_PortalApp_ContractHistory_HaveEvaluated',
        screenName: ScreenName.ContractHistoryConfirmed
    }
];

const TopTabContractHistory = createMaterialTopTabNavigator(
    {
        ContractHistoryAll: {
            screen: ContractHistoryAll,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Common_Confirm')
        },
        ContractHistoryWaitConfirm: {
            screen: ContractHistoryWaitConfirm,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Common_WaitingConfirm')
        },
        ContractHistoryConfirmed: {
            screen: ContractHistoryConfirmed,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_System_Resource_Sys_Edit')
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: navigationAll => {

            let perTabConfirmed = true,
                perTabWaitConfirm = true,
                perTabEdit = true;

            if ((perTabConfirmed || (perTabWaitConfirm || perTabEdit)) && Array.isArray(data) && data.length > 0) {
                return <RenderTopTab data={data} navigationAll={navigationAll} />;
            } else {
                return <View />;
            }
        }
    }
);

export default TopTabContractHistory;
