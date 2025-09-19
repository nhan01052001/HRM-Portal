import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import RelativeConfirmed from './relativeConfirmed/RelativeConfirmed';
import RelativeWaitConfirm from './relativeWaitConfirm/RelativeWaitConfirm';
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
        screenName: ScreenName.RelativeConfirmed
    },
    {
        title: 'HRM_Common_WaitingConfirm',
        screenName: ScreenName.RelativeWaitConfirm
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabRelativeInfo = createMaterialTopTabNavigator(
    {
        RelativeConfirmed: {
            screen: RelativeConfirmed,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Common_Confirm')
        },
        RelativeWaitConfirm: {
            screen: RelativeWaitConfirm,
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
                (!PermissionForAppMobile.value['Personal_RelativeConfirmed'] ||
                    !PermissionForAppMobile.value['Personal_RelativeConfirmed']['View'])
            ) {
                data = data.filter(item => item.screenName !== ScreenName.RelativeConfirmed);
                perTabConfirmed = false;
            }

            if (
                PermissionForAppMobile &&
                (!PermissionForAppMobile.value['Personal_RelativeWaitConfirm'] ||
                    !PermissionForAppMobile.value['Personal_RelativeWaitConfirm']['View'])
            ) {
                data = data.filter(item => item.screenName !== ScreenName.RelativeWaitConfirm);
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

export default TopTabRelativeInfo;
