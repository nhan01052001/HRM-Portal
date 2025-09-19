import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import DependantConfirmed from './dependantConfirmed/DependantConfirmed';
import DependantWaitConfirm from './dependantWaitConfirm/DependantWaitConfirm';
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
        screenName: ScreenName.DependantConfirmed
    },
    {
        title: 'HRM_Common_WaitingConfirm',
        screenName: ScreenName.DependantWaitConfirm
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabDependantInfo = createMaterialTopTabNavigator(
    {
        DependantConfirmed: {
            screen: DependantConfirmed,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Common_Confirm')
        },
        DependantWaitConfirm: {
            screen: DependantWaitConfirm,
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
                (!PermissionForAppMobile.value['Personal_DependantConfirmed'] ||
                    !PermissionForAppMobile.value['Personal_DependantConfirmed']['View'])
            ) {
                data = data.filter(item => item.screenName !== ScreenName.DependantConfirmed);
                perTabConfirmed = false;
            }

            if (
                PermissionForAppMobile &&
                (!PermissionForAppMobile.value['Personal_DependantWaitConfirm'] ||
                    !PermissionForAppMobile.value['Personal_DependantWaitConfirm']['View'])
            ) {
                data = data.filter(item => item.screenName !== ScreenName.DependantWaitConfirm);
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
export default TopTabDependantInfo;
