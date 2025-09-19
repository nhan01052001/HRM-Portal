import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import AttApproveTakeBusinessTrip from './attApproveTakeBusinessTrip/attApproveTakeBusinessTrip/AttApproveTakeBusinessTrip';
import AttApprovedTakeBusinessTrip from './attApproveTakeBusinessTrip/attApprovedTakeBusinessTrip/AttApprovedTakeBusinessTrip';
import AttRejectTakeBusinessTrip from './attApproveTakeBusinessTrip/attRejectTakeBusinessTrip/AttRejectTakeBusinessTrip';
import AttCanceledTakeBusinessTrip from './attApproveTakeBusinessTrip/attCanceledTakeBusinessTrip/AttCanceledTakeBusinessTrip';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTabWaitingApprove',
        screenName: ScreenName.AttApproveTakeBusinessTrip
    },
    {
        title: 'HRM_PortalApp_TopTabApproved',
        screenName: ScreenName.AttApprovedTakeBusinessTrip
    },
    {
        title: 'HRM_PortalApp_TopTabReject',
        screenName: ScreenName.AttRejectTakeBusinessTrip
    },
    {
        title: 'HRM_PortalApp_TopTabCancel',
        screenName: ScreenName.AttCanceledTakeBusinessTrip
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabAttApproveTakeBusinessTrip = createMaterialTopTabNavigator(
    {
        AttApproveTakeBusinessTrip: {
            screen: AttApproveTakeBusinessTrip,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTabWaitingApprove')
        },
        AttApprovedTakeBusinessTrip: {
            screen: AttApprovedTakeBusinessTrip,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTabApproved')
        },
        AttRejectTakeBusinessTrip: {
            screen: AttRejectTakeBusinessTrip,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTabReject')
        },
        AttCanceledTakeBusinessTrip: {
            screen: AttCanceledTakeBusinessTrip,
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

export default TopTabAttApproveTakeBusinessTrip;
