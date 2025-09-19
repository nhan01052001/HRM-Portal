import React from 'react';
import { View } from 'react-native';
import { styleSheets } from '../../../../../constants/styleConfig';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import ComputerLevelConfirmed from './computerLevelConfirmed/ComputerLevelConfirmed';
import ComputerLevelWaitConfirm from './computerLevelWaitConfirm/ComputerLevelWaitConfirm';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import RenderTopTab from '../../../../../navigation/tabar/RenderTopTab';
import { ScreenName } from '../../../../../assets/constant';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

let data = [
    {
        title: 'HRM_Common_Confirm',
        screenName: ScreenName.ComputerLevelConfirmed
    },
    {
        title: 'HRM_Common_WaitingConfirm',
        screenName: ScreenName.ComputerLevelWaitConfirm
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabComputerLevel = createMaterialTopTabNavigator(
    {
        ComputerLevelConfirmed: {
            screen: ComputerLevelConfirmed,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Common_Confirm')
        },
        ComputerLevelWaitConfirm: {
            screen: ComputerLevelWaitConfirm,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Common_WaitingConfirm')
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: navigationAll => {

            let perTabConfirmed = true,
                perTabWaitConfirm = true;

            if (
                PermissionForAppMobile &&
                (!PermissionForAppMobile.value['HRM_HR_ComputerLevel_Portal_ListGird'] ||
                    !PermissionForAppMobile.value['HRM_HR_ComputerLevel_Portal_ListGird']['View'] === true)
            ) {
                data = data.filter(item => item.screenName !== ScreenName.ComputerLevelConfirmed);
                perTabConfirmed = false;
            }

            if (
                PermissionForAppMobile &&
                (!PermissionForAppMobile.value['HRM_HR_ComputerLevel_Portal_WaitingGrid'] ||
                    !PermissionForAppMobile.value['HRM_HR_ComputerLevel_Portal_WaitingGrid']['View'] === true)
            ) {
                data = data.filter(item => item.screenName !== ScreenName.ComputerLevelWaitConfirm);
                perTabWaitConfirm = false;
            }

            if ((perTabConfirmed || perTabWaitConfirm) && Array.isArray(data) && data.length > 0) {
                return <RenderTopTab data={data} navigationAll={navigationAll} />;
            } else {
                return <View style={styleSheets.size100} />;
            }
        }
    }
);
//#endregion

export default TopTabComputerLevel;
