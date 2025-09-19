/* eslint-disable react/display-name */
import React from 'react';
import { Colors, styleSheets } from '../../../../../constants/styleConfig';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import EvaPerformanceWaitInfo from './EvaPerformanceWaitInfo';
import EvaPerformanceWaitGroupKPI from './EvaPerformanceWaitGroupKPI';

import { translate } from '../../../../../i18n/translate';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};
const EvaPerformanceWaitEvaluation = createMaterialTopTabNavigator(
    {
        EvaPerformanceWaitInfo: {
            screen: ({ navigation }) => <EvaPerformanceWaitInfo {...{ ...navigation.state.params, navigation }} />,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Evaluation_Information')
        },
        EvaPerformanceWaitGroupKPI: {
            screen: ({ navigation }) => <EvaPerformanceWaitGroupKPI {...{ ...navigation.state.params, navigation }} />,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_Eva_KPIBuildingForEmployee_E_KPI')
        }
        // RelativeEdit: {
        //     screen: RelativeEdit,
        //     navigationOptions: ({ navigation }) => (navigationOptionsCogfig(navigation, 'HRM_System_Resource_Sys_Edit'))
        // },
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
export default EvaPerformanceWaitEvaluation;
