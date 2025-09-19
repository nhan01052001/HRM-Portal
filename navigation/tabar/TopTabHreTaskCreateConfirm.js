import { Colors, styleSheets } from '../../constants/styleConfig';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import HreTaskConfirmTabCreateByModelConfirm from '../../scenes/modules/humanResource/hreTask/hreTaskAdd/hreTaskConfirmTab/HreTaskConfirmTabCreateByModelConfirm';
import HreTaskConfirmTabCreateNotModelConfirm from '../../scenes/modules/humanResource/hreTask/hreTaskAdd/hreTaskConfirmTab/HreTaskConfirmTabCreateNotModelConfirm';
import { translate } from '../../i18n/translate';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const TopTabHreTaskCreateConfirm = createMaterialTopTabNavigator(
    {
        HreTaskConfirmTabCreateByModelConfirm: {
            screen: HreTaskConfirmTabCreateByModelConfirm,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Tas_Task_TaskByModel')
        },
        HreTaskConfirmTabCreateNotModelConfirm: {
            screen: HreTaskConfirmTabCreateNotModelConfirm,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Tas_Task_TaskNotModel')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);

export default TopTabHreTaskCreateConfirm;
