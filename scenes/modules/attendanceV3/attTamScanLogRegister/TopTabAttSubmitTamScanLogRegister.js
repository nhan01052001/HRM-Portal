import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import AttSubmitTamScanLogRegister from './attSubmitTamScanLogRegister/AttSubmitTamScanLogRegister';
import AttSaveTempSubmitTamScanLogRegister from './attSubmitTamScanLogRegister/attSaveTempSubmitTamScanLogRegister/AttSaveTempSubmitTamScanLogRegister';
import AttRejectSubmitTamScanLogRegister from './attSubmitTamScanLogRegister/attRejectSubmitTamScanLogRegister/AttRejectSubmitTamScanLogRegister';
import AttCanceledSubmitTamScanLogRegister from './attSubmitTamScanLogRegister/attCanceledSubmitTamScanLogRegister/AttCanceledSubmitTamScanLogRegister';
import AttApproveSubmitTamScanLogRegister from './attSubmitTamScanLogRegister/attApproveSubmitTamScanLogRegister/AttApproveSubmitTamScanLogRegister';
import AttApprovedSubmitTamScanLogRegister from './attSubmitTamScanLogRegister/attApprovedSubmitTamScanLogRegister/AttApprovedSubmitTamScanLogRegister';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import { PermissionForAppMobile } from '../../../../assets/configProject/PermissionForAppMobile';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_All',
        screenName: ScreenName.AttSubmitTamScanLogRegister
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_SaveTemporary',
        screenName: ScreenName.AttSaveTempSubmitTamScanLogRegister
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_WaitingApproval',
        screenName: ScreenName.AttApproveSubmitTamScanLogRegister
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_Approved',
        screenName: ScreenName.AttApprovedSubmitTamScanLogRegister
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_Rejected',
        screenName: ScreenName.AttRejectSubmitTamScanLogRegister
    },
    {
        title: 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_Canceled',
        screenName: ScreenName.AttCanceledSubmitTamScanLogRegister
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabAttSubmitTamScanLogRegister = createMaterialTopTabNavigator(
    {
        AttSubmitTamScanLogRegister: {
            screen: AttSubmitTamScanLogRegister,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_All')
        },
        AttSaveTempSubmitTamScanLogRegister: {
            screen: AttSaveTempSubmitTamScanLogRegister,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_SaveTemporary')
        },
        AttApproveSubmitTamScanLogRegister: {
            screen: AttApproveSubmitTamScanLogRegister,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_WaitingApproval')
        },
        AttApprovedSubmitTamScanLogRegister: {
            screen: AttApprovedSubmitTamScanLogRegister,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_Approved')
        },
        AttRejectSubmitTamScanLogRegister: {
            screen: AttRejectSubmitTamScanLogRegister,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_Rejected')
        },
        AttCanceledSubmitTamScanLogRegister: {
            screen: AttCanceledSubmitTamScanLogRegister,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_Canceled')
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: (navigationAll) => {
            let perTabApprove = true,
                perTabWaitApproved = true,
                perTabReject = true;

            let perTabSaveTemp = false;

            if (
                PermissionForAppMobile &&
                PermissionForAppMobile.value['HRM_PortalV3_Att_AttInOut_BtnSaveTemp'] &&
                PermissionForAppMobile.value['HRM_PortalV3_Att_AttInOut_BtnSaveTemp']['View']
            ) {
                perTabSaveTemp = true;
            }

            let filteredData = data;
            if (perTabSaveTemp) {
                filteredData = filteredData.filter(
                    (item) => item.title !== 'HRM_PortalApp_TopTab_AttSubmitTamScanLogRegister_SaveTemporary'
                );
            }

            if ((perTabApprove || perTabWaitApproved || perTabReject) && Array.isArray(data) && data.length > 0) {
                return <RenderTopTab data={filteredData} navigationAll={navigationAll} />;
            } else {
                return <View />;
            }
        }
    }
);
//#endregion

export default TopTabAttSubmitTamScanLogRegister;
