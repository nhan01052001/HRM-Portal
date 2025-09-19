import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import NavigatorStack0 from './tabar/NavigatorStack';
import NtfOffSetting from '../scenes/notification/ntfOffSetting/NtfOffSetting';
import NtfPersonal from '../scenes/notification/NtfPersonal';
import Setting from '../scenes/setting/Setting';
import SettingNotification from '../scenes/setting/settingNotification/SettingNotification';
import FunctionCommon from './tabar/FunctionCommon';
import TabBarComponent from '../components/TabBarComponent/TabBarComponent';
import MessagingStack from './tabar/MessagingStack';
import ChangePassword from '../scenes/auth/ChangePassword';
import AppendixInfomation from '../scenes/setting/appendixInfomation/AppendixInfomation';
import AppendixInfomationViewDetail from '../scenes/setting/appendixInfomation/AppendixInfomationViewDetail';
import SalChangePassword from '../scenes/setting/salChangePassword/SalChangePassword';
import SalChangePasswordV3 from '../scenes/setting/salChangePasswordV3/SalChangePasswordV3';
import FaceScanSetting from '../scenes/setting/FaceScanSetting';
import ChangePasswordV3 from '../scenes/auth/changePasswordV3/ChangePasswordV3';

const NotifyStack = createStackNavigator(
    {
        Notification: {
            screen: NtfPersonal,
            navigationOptions: ({ navigation }) =>
                FunctionCommon.navigationOptionsConfigScreenTabbar(navigation, 'Notify')
        },
        NtfOffSetting: {
            screen: NtfOffSetting,
            navigationOptions: ({ navigation }) =>
                FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Notification_Off_Setting')
        }
    },
    {
        navigationOptions: ({ navigation }) => ({
            tabBarVisible: navigation.state.index < 1,
            gesturesEnabled: false
        }),
        transitionConfig: () => ({
            transitionSpec: {
                duration: 0
            }
        }),
        headerLayoutPreset: 'center',
        defaultNavigationOptions: {
            //gesturesEnabled: false,
            animationEnabled: Platform.OS == 'ios' ? true : false
        }
    }
);

const SetupStack = createStackNavigator(
    {
        Setting: {
            screen: Setting,
            navigationOptions: ({ navigation }) =>
                FunctionCommon.navigationOptionsConfigScreenTabbar(navigation, 'setting')
        },
        ChangePassword: {
            screen: ChangePassword,
            navigationOptions: ({ navigation }) =>
                FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_System_User_ChangePass')
        },
        ChangePasswordV3: {
            screen: ChangePasswordV3,
            navigationOptions: ({ navigation }) =>
                FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_System_User_ChangePass')
        },
        SettingNotification: {
            screen: SettingNotification,
            navigationOptions: ({ navigation }) =>
                FunctionCommon.navigationOptionsConfigGoBack(navigation, 'Hrm_Notification')
        },
        AppendixInfomation: {
            screen: AppendixInfomation,
            navigationOptions: ({ navigation }) =>
                FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Menu_AppendixInfomationView_PopUp_Name')
        },
        AppendixInfomationViewDetail: {
            screen: AppendixInfomationViewDetail,
            navigationOptions: ({ navigation }) =>
                FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_Menu_AppendixInfomationView_PopUp_Name')
        },
        SalChangePassword: {
            screen: SalChangePassword,
            navigationOptions: ({ navigation }) =>
                FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_System_ConfirmChangePasswordPayslip')
        },
        SalChangePasswordV3: {
            screen: SalChangePasswordV3,
            navigationOptions: ({ navigation }) =>
                FunctionCommon.navigationOptionsConfigGoBack(navigation, 'HRM_System_ConfirmChangePasswordPayslip')
        },
        FaceScanSetting: {
            screen: FaceScanSetting,
            navigationOptions: ({ navigation }) =>
                FunctionCommon.navigationOptionsConfigHeaderNull(navigation, 'HRM_PortalApp_ScanSetting_face')
        }
    },
    {
        navigationOptions: ({ navigation }) => ({
            tabBarVisible: navigation.state.index < 1,
            gesturesEnabled: false
        }),
        transitionConfig: () => ({
            transitionSpec: {
                duration: 0
            }
        }),
        headerLayoutPreset: 'center',
        defaultNavigationOptions: {
            // gesturesEnabled: false,
            animationEnabled: Platform.OS == 'ios' ? true : false
        }
    }
);

const NavigatorStack = {
    Navigator0: NavigatorStack0
};

const IndexNavigator = createBottomTabNavigator(
    {
        Main: NavigatorStack.Navigator0,
        Messaging: MessagingStack,
        Notify: NotifyStack,
        Setup: SetupStack
    },
    {
        defaultNavigationOptions: () => ({
            //tabBarIcon: ({ focused, tintColor }) => getTabBarIcon(navigation, focused, tintColor),
            //tabBarLabel: ({ focused, tintColor }) => getLabelBar(navigation, focused, tintColor),
            animationEnabled: false,
            tabBarVisible: false // custom
        }),

        // eslint-disable-next-line react/display-name
        tabBarComponent: ({ navigation }) => {
            return <TabBarComponent navigation={navigation} />;
        }
    }
);

export default IndexNavigator;
