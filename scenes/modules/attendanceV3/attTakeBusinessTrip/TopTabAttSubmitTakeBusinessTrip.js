import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import AttSubmitTakeBusinessTrip from './attSubmitTakeBusinessTrip/AttSubmitTakeBusinessTrip';
import AttApproveSubmitTakeBusinessTrip from './attSubmitTakeBusinessTrip/attApproveSubmitTakeBusinessTrip/AttApproveSubmitTakeBusinessTrip';
import AttApprovedSubmitTakeBusinessTrip from './attSubmitTakeBusinessTrip/attApprovedSubmitTakeBusinessTrip/AttApprovedSubmitTakeBusinessTrip';
import AttCanceledSubmitTakeBusinessTrip from './attSubmitTakeBusinessTrip/attCanceledSubmitTakeBusinessTrip/AttCanceledSubmitTakeBusinessTrip';
import AttRejectSubmitTakeBusinessTrip from './attSubmitTakeBusinessTrip/attRejectSubmitTakeBusinessTrip/AttRejectSubmitTakeBusinessTrip';
import AttSaveTempSubmitTakeBusinessTrip from './attSubmitTakeBusinessTrip/attSaveTempSubmitTakeBusinessTrip/AttSaveTempSubmitTakeBusinessTrip';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTabAllData',
        screenName: ScreenName.AttSubmitTakeBusinessTrip
    },
    {
        title: 'HRM_PortalApp_TopTabSaveTemp',
        screenName: ScreenName.AttSaveTempSubmitTakeBusinessTrip
    },
    {
        title: 'HRM_PortalApp_TopTabWaitingApprove',
        screenName: ScreenName.AttApproveSubmitTakeBusinessTrip
    },
    {
        title: 'HRM_PortalApp_TopTabApproved',
        screenName: ScreenName.AttApprovedSubmitTakeBusinessTrip
    },
    {
        title: 'HRM_PortalApp_TopTabReject',
        screenName: ScreenName.AttRejectSubmitTakeBusinessTrip
    },
    {
        title: 'HRM_PortalApp_TopTabCancel',
        screenName: ScreenName.AttCanceledSubmitTakeBusinessTrip
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabAttSubmitTakeBusinessTrip = createMaterialTopTabNavigator(
    {
        AttSubmitTakeBusinessTrip: {
            screen: AttSubmitTakeBusinessTrip,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTabAllData')
        },
        AttSaveTempSubmitTakeBusinessTrip: {
            screen: AttSaveTempSubmitTakeBusinessTrip,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTabSaveTemp')
        },
        AttApproveSubmitTakeBusinessTrip: {
            screen: AttApproveSubmitTakeBusinessTrip,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTabWaitingApprove')
        },
        AttApprovedSubmitTakeBusinessTrip: {
            screen: AttApprovedSubmitTakeBusinessTrip,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTabApproved')
        },
        AttRejectSubmitTakeBusinessTrip: {
            screen: AttRejectSubmitTakeBusinessTrip,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTabReject')
        },
        AttCanceledSubmitTakeBusinessTrip: {
            screen: AttCanceledSubmitTakeBusinessTrip,
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

            if ((perTabApprove || perTabWaitApproved || perTabReject) && Array.isArray(data) && data.length > 0) {
                return <RenderTopTab data={data} navigationAll={navigationAll} />;
            } else {
                return <View />;
            }
        }
    }
);
//#endregion

export default TopTabAttSubmitTakeBusinessTrip;
