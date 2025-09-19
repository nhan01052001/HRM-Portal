import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../../i18n/translate';
import { ScreenName } from '../../../../../assets/constant';
import RenderTopTab from '../../../../../navigation/tabar/RenderTopTab';
import ChOrgDepartmentChart from './ChOrgDepartmentChart';
import ChOrgProfileChart from './ChOrgProfileChart';
import ChOrgPositionChart from './ChOrgPositionChart';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { View } from 'react-native';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_Category_OrgStructure_OrgStructureName',
        screenName: ScreenName.ChOrgDepartmentChart,
        index: 0
    },
    {
        title: 'HRM_PortalApp_PositionOrgChart',
        screenName: ScreenName.ChOrgPositionChart,
        index: 1
    },
    {
        title: 'HRM_HR_Employees',
        screenName: ScreenName.ChOrgProfileChart,
        index: 2
    }
];

const TopTabChOrgChart = createMaterialTopTabNavigator(
    {
        ChOrgDepartmentChart: {
            screen: ChOrgDepartmentChart,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        ChOrgPositionChart: {
            screen: ChOrgPositionChart,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        ChOrgProfileChart: {
            screen: ChOrgProfileChart,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        }
    },
    {
        initialRouteName: ScreenName.ChOrgDepartmentChart,
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: (navigationAll) => {
            const { navigation } = navigationAll;

            let perTab1 = true,
                perTab2 = true,
                perTab3 = true;

            let dataRoute = [...data];
            if (
                PermissionForAppMobile &&
                (!PermissionForAppMobile.value['Hrm_Hre_Chart_DiagramV3_TabOrg'] ||
                    !PermissionForAppMobile.value['Hrm_Hre_Chart_DiagramV3_TabOrg']['View'])
            ) {
                dataRoute = dataRoute.filter((item) => item.screenName !== ScreenName.ChOrgDepartmentChart);
                perTab1 = false;
            }

            if (
                PermissionForAppMobile &&
                (!PermissionForAppMobile.value['Hrm_Hre_Chart_DiagramV3_TabHeadCount'] ||
                    !PermissionForAppMobile.value['Hrm_Hre_Chart_DiagramV3_TabHeadCount']['View'])
            ) {
                dataRoute = dataRoute.filter((item) => item.screenName !== ScreenName.ChOrgPositionChart);
                perTab2 = false;
            }

            if (
                PermissionForAppMobile &&
                (!PermissionForAppMobile.value['Hrm_Hre_Chart_DiagramV3_TabOrgProfile'] ||
                    !PermissionForAppMobile.value['Hrm_Hre_Chart_DiagramV3_TabOrgProfile']['View'])
            ) {
                dataRoute = dataRoute.filter((item) => item.screenName !== ScreenName.ChOrgProfileChart);
                perTab3 = false;
            }

            if (
                Array.isArray(dataRoute) &&
                dataRoute.length > 0 &&
                navigation.state.index != null &&
                dataRoute.findIndex((item) => item.index == navigation.state.index) == -1
            ) {
                const initialRouteName = dataRoute[0].screenName;
                setTimeout(() => {
                    navigation.navigate(initialRouteName);
                }, 500);
            }

            if ((perTab1 || perTab2 || perTab3) && Array.isArray(dataRoute) && dataRoute.length > 1) {
                return <RenderTopTab data={dataRoute} navigationAll={navigationAll} />;
            } else {
                return <View />;
            }
        }
    }
);
export default TopTabChOrgChart;
