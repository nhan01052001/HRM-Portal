import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import AttApproveTamScanLogRegister from './attApproveTamScanLogRegister/AttApproveTamScanLogRegister';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import AttRejectTamScanLogRegister from './attApproveTamScanLogRegister/attRejectTamScanLogRegister/AttRejectTamScanLogRegister';
import AttCanceledTamScanLogRegister from './attApproveTamScanLogRegister/attCanceledTamScanLogRegister/AttCanceledTamScanLogRegister';
import AttAllTamScanLogRegister from './attApproveTamScanLogRegister/attAllTamScanLogRegister/AttAllTamScanLogRegister';
import AttApprovedTamScanLogRegister from './attApproveTamScanLogRegister/attApprovedTamScanLogRegister/AttApprovedTamScanLogRegister';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTab_AttApproveTamScanLogRegister_WaitingApproval',
        screenName: ScreenName.AttApproveTamScanLogRegister
    },
    {
        title: 'HRM_PortalApp_TopTab_AttApproveTamScanLogRegister_Approved',
        screenName: ScreenName.AttApprovedTamScanLogRegister
    },
    {
        title: 'HRM_PortalApp_TopTab_AttApproveTamScanLogRegister_Rejected',
        screenName: ScreenName.AttRejectTamScanLogRegister
    },
    {
        title: 'HRM_PortalApp_TopTab_AttApproveTamScanLogRegister_Canceled',
        screenName: ScreenName.AttCanceledTamScanLogRegister
    },
    {
        title: 'HRM_PortalApp_TopTab_AttApproveTamScanLogRegister_All',
        screenName: ScreenName.AttAllTamScanLogRegister
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabAttApproveTamScanLogRegister = createMaterialTopTabNavigator(
    {
        AttApproveTamScanLogRegister: {
            screen: AttApproveTamScanLogRegister,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveTamScanLogRegister_WaitingApproval')
        },
        AttApprovedTamScanLogRegister: {
            screen: AttApprovedTamScanLogRegister,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveTamScanLogRegister_Approved')
        },
        AttRejectTamScanLogRegister: {
            screen: AttRejectTamScanLogRegister,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveTamScanLogRegister_Rejected')
        },
        AttCanceledTamScanLogRegister: {
            screen: AttCanceledTamScanLogRegister,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveTamScanLogRegister_Canceled')
        },
        AttAllTamScanLogRegister: {
            screen: AttAllTamScanLogRegister,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttApproveTamScanLogRegister_All')
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: navigationAll => {;

            let perTabApprove = true,
                perTabWaitApproved = true,
                perTabReject = true;

            // if (PermissionForAppMobile && PermissionForAppMobile.value['Personal_RelativeConfirmed']
            //     && PermissionForAppMobile.value['Personal_RelativeConfirmed']['View']) {
            //     perTabApprove = true;
            // }

            // if (PermissionForAppMobile && PermissionForAppMobile.value['Personal_RelativeWaitConfirm']
            //     && PermissionForAppMobile.value['Personal_RelativeWaitConfirm']['View']) {
            //     perTabWaitApproved = true;
            // }

            // if (PermissionForAppMobile && PermissionForAppMobile.value['Personal_RelativeEdit']
            //     && PermissionForAppMobile.value['Personal_RelativeEdit']['View']) {
            //     perTabReject = true;
            // }

            if ((perTabApprove || perTabWaitApproved || perTabReject) && Array.isArray(data) && data.length > 0) {
                return <RenderTopTab data={data} navigationAll={navigationAll} />;
            } else {
                return <View />;
            }
        }
    }
);
//#endregion

export default TopTabAttApproveTamScanLogRegister;
