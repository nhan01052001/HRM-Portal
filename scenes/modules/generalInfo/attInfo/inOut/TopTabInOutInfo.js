import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import InOut from './InOut';
import InOutBusinessTravel from './InOutBusinessTravel';
import RenderTopTab from '../../../../../navigation/tabar/RenderTopTab';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';

let data = [
    {
        title: 'HRM_System_Resource_Att_TAMScan',
        screenName: 'InOutInfo'
    },
    {
        title: 'HRM_Attendance_WhileBusinessTravel_Title',
        screenName: 'InOutBusinessTravel'
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabInOutInfo = createMaterialTopTabNavigator(
    {
        InOutInfo: {
            screen: InOut
        },
        InOutBusinessTravel: {
            screen: InOutBusinessTravel
        }
    },
    {
        lazy: true,
        swipeEnabled: true,
        tabBarComponent: (navigationAll) => {
            let perTabInOutBusinessTravel = false;

            if (
                PermissionForAppMobile &&
                PermissionForAppMobile.value['New_Search_Att_TamScanApp_New_Index_Portal'] &&
                PermissionForAppMobile.value['New_Search_Att_TamScanApp_New_Index_Portal']['View']
            ) {
                perTabInOutBusinessTravel = true;
            }

            if (perTabInOutBusinessTravel) return <RenderTopTab data={data} navigationAll={navigationAll} />;
            else return <View />;
        }
    }
);
//#endregion

export default TopTabInOutInfo;
