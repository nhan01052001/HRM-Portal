// import React, { Component } from 'react';
// import { Colors, styleSheets } from '../../constants/styleConfig';
// import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
// import NtfManage from './NtfManage';
// import NtfOverview from './NtfOverview';
// import NtfPersonal from './NtfPersonal';
// // import NtfTask from './NtfTask';
// import VnrText from '../../components/VnrText/VnrText';

// import { translate } from '../../i18n/translate';

// const navigationOptionsCogfig = (navigation, Title_Key) => {
//   return {
//     title: translate(Title_Key)
//   }
// }
// const TopTabNotification = createMaterialTopTabNavigator(
//   {
//     // NtfOverview: {
//     //   screen: NtfOverview,
//     //   navigationOptions: ({ navigation }) => (navigationOptionsCogfig(navigation, 'HRM_System_AllSetting'))
//     // },
//     NtfPersonal: {
//       screen: NtfPersonal,
//       navigationOptions: ({ navigation }) => (navigationOptionsCogfig(navigation, 'HRM_HR_Profile_Personal'))
//     },
//     NtfManage: {
//       screen: NtfManage,
//       navigationOptions: ({ navigation }) => (navigationOptionsCogfig(navigation, 'HRM_Dashboard_DashboardOption_Manage'))
//     },
//     // NtfTask: {
//     //   screen: NtfTask,
//     //   navigationOptions: ({ navigation }) => (navigationOptionsCogfig(navigation, 'HRM_Hre_Tas_Task_Assignment'))
//     // },
//   },
//   {
//     tabBarOptions: {
//       style: {
//         backgroundColor: Colors.white,
//         borderTopColor: Colors.white,
//         borderTopWidth: 0,
//       },
//       activeTintColor: Colors.primary,
//       inactiveTintColor: Colors.gray_10,
//       labelStyle: styleSheets.lable,
//       indicatorStyle: {
//         borderBottomColor: Colors.primary,
//         borderBottomWidth: 2.5,
//       },
//       upperCaseLabel: false
//     },

//     lazy: true
//   }
// );
// export default TopTabNotification;
