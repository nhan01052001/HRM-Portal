import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import TopTabHisProfileBasicInfo from './TopTabHisProfileBasicInfo';
import TopTabHisProfilePersonalInfo from './TopTabHisProfilePersonalInfo';
import TopTabHisProfileContactInfo from './TopTabHisProfileContactInfo';
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
        title: 'HRM_HR_Profile_Basic',
        screenName: ScreenName.TopTabHisProfileBasicInfo
    },
    {
        title: 'HRM_HR_Profile_PersonalInfo',
        screenName: ScreenName.TopTabHisProfilePersonalInfo
    },
    {
        title: 'HRM_HR_Profile_ContactInfo',
        screenName: ScreenName.TopTabHisProfileContactInfo
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabHisProfileInfo = createMaterialTopTabNavigator(
    {
        TopTabHisProfileBasicInfo: {
            screen: TopTabHisProfileBasicInfo,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_HR_Profile_Basic')
        },
        TopTabHisProfilePersonalInfo: {
            screen: TopTabHisProfilePersonalInfo,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_HR_Profile_PersonalInfo')
        },
        TopTabHisProfileContactInfo: {
            screen: TopTabHisProfileContactInfo,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_HR_Profile_ContactInfo')
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: navigationAll => {

            let perTabBacsicInfo = true,
                perTabPersonalInfo = true,
                perTabContactInfo = true;

            if (
                PermissionForAppMobile &&
                (!PermissionForAppMobile.value['HRM_HR_Profile_BasicInfo_Grid_WaitingConfirm'] ||
                    !PermissionForAppMobile.value['HRM_HR_Profile_BasicInfo_Grid_WaitingConfirm']['View'])
            ) {
                data = data.filter(item => item.screenName !== ScreenName.TopTabHisProfileBasicInfo);
                perTabBacsicInfo = false;
            }

            if (
                PermissionForAppMobile &&
                (!PermissionForAppMobile.value['HRM_HR_Profile_PersonalInfo_Grid_WaitingConfirm'] ||
                    !PermissionForAppMobile.value['HRM_HR_Profile_PersonalInfo_Grid_WaitingConfirm']['View'])
            ) {
                data = data.filter(item => item.screenName !== ScreenName.TopTabHisProfilePersonalInfo);
                perTabPersonalInfo = false;
            }

            if (
                PermissionForAppMobile &&
                (!PermissionForAppMobile.value['HRM_HR_Profile_PersonalContact_Grid_WaitingConfirm'] ||
                    !PermissionForAppMobile.value['HRM_HR_Profile_PersonalContact_Grid_WaitingConfirm']['View'])
            ) {
                data = data.filter(item => item.screenName !== ScreenName.TopTabHisProfileContactInfo);
                perTabContactInfo = false;
            }

            if (
                (perTabBacsicInfo || perTabPersonalInfo || perTabContactInfo) &&
                Array.isArray(data) &&
                data.length > 0
            ) {
                return <RenderTopTab data={data} navigationAll={navigationAll} />;
            } else {
                return <View />;
            }
        }
    }
);
//#endregion


export default TopTabHisProfileInfo;
