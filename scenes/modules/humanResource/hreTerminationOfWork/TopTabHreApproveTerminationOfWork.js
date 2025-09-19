import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import HreApproveTerminationOfWork from './hreApproveTerminationOfWork/hreApproveTerminationOfWork/HreApproveTerminationOfWork';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import HreRejectTerminationOfWork from './hreApproveTerminationOfWork/hreRejectTerminationOfWork/HreRejectTerminationOfWork';
import HreApprovedTerminationOfWork from './hreApproveTerminationOfWork/hreApprovedTerminationOfWork/HreApprovedTerminationOfWork';
import HreCanceledTerminationOfWork from './hreApproveTerminationOfWork/hreCanceledTerminationOfWork/HreCanceledTerminationOfWork';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTab_TerminationOfWork_WaitingApproval',
        screenName: ScreenName.HreApproveTerminationOfWork
    },
    {
        title: 'HRM_PortalApp_TopTab_TerminationOfWork_Approved',
        screenName: ScreenName.HreApprovedTerminationOfWork
    },
    {
        title: 'HRM_PortalApp_TopTab_TerminationOfWork_Rejected',
        screenName: ScreenName.HreRejectTerminationOfWork
    },
    {
        title: 'HRM_PortalApp_TopTab_TerminationOfWork_Canceled',
        screenName: ScreenName.HreCanceledTerminationOfWork
    }
    // {
    //     title: 'HRM_PortalApp_TopTabAllData',
    //     screenName: ScreenName.HreAllTerminationOfWork
    // },
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabHreApproveTerminationOfWork = createMaterialTopTabNavigator(
    {
        HreApproveTerminationOfWork: {
            screen: HreApproveTerminationOfWork,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_TerminationOfWork_WaitingApproval')
        },
        HreApprovedTerminationOfWork: {
            screen: HreApprovedTerminationOfWork,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_TerminationOfWork_Approved')
        },
        HreRejectTerminationOfWork: {
            screen: HreRejectTerminationOfWork,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_TerminationOfWork_Rejected')
        },
        HreCanceledTerminationOfWork: {
            screen: HreCanceledTerminationOfWork,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_TerminationOfWork_Canceled')
        }
        // HreAllTerminationOfWork: {
        //     screen: HreAllTerminationOfWork,
        //     navigationOptions: ({ navigation }) => (navigationOptionsCogfig(navigation, 'HRM_Portal_Sal_WaitingConfirmPaymentCost'))
        // },
    },
    {
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: (navigationAll) => {
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

            if (perTabApprove || ((perTabWaitApproved || perTabReject) && Array.isArray(data) && data.length > 0)) {
                return <RenderTopTab data={data} navigationAll={navigationAll} />;
            } else {
                return <View />;
            }
        }
    }
);
//#endregion

export default TopTabHreApproveTerminationOfWork;
