import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import PassportConfirmed from './passportConfirmed/PassportConfirmed';
import PassportWaitConfirm from './passportWaitConfirm/PassportWaitConfirm';
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
        screenName: ScreenName.PassportConfirmed
    },
    {
        title: 'HRM_Common_WaitingConfirm',
        screenName: ScreenName.PassportWaitConfirm
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabPassportInfo = createMaterialTopTabNavigator(
    {
        PassportConfirmed: {
            screen: PassportConfirmed,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Common_Confirm')
        },
        PassportWaitConfirm: {
            screen: PassportWaitConfirm,
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
                (!PermissionForAppMobile.value['HRM_HR_Passport_Portal_ListGird'] ||
                    !PermissionForAppMobile.value['HRM_HR_Passport_Portal_ListGird']['View'])
            ) {
                data = data.filter(item => item.screenName !== ScreenName.PassportConfirmed);
                perTabConfirmed = false;
            }

            if (
                PermissionForAppMobile &&
                (!PermissionForAppMobile.value['HRM_HR_Hre_Passport_Portal_Create_WaitingGrid'] ||
                    !PermissionForAppMobile.value['HRM_HR_Hre_Passport_Portal_Create_WaitingGrid']['View'])
            ) {
                data = data.filter(item => item.screenName !== ScreenName.PassportWaitConfirm);
                perTabWaitConfirm = false;
            }
            if ((perTabConfirmed || perTabWaitConfirm) && Array.isArray(data) && data.length > 0) {
                return <RenderTopTab data={data} navigationAll={navigationAll} />;
            } else {
                return <View />;
            }
        }
    }
);
//#endregion

export default TopTabPassportInfo;
