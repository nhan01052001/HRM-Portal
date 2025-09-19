import React from 'react';
import { View } from 'react-native';
import { styleSheets } from '../../../../../constants/styleConfig';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import QualificationConfirmed from './qualificationConfirmed/QualificationConfirmed';
import QualificationWaitConfirm from './qualificationWaitConfirm/QualificationWaitConfirm';
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
        screenName: ScreenName.QualificationConfirmed
    },
    {
        title: 'HRM_Common_WaitingConfirm',
        screenName: ScreenName.QualificationWaitConfirm
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabQualificationInfo = createMaterialTopTabNavigator(
    {
        QualificationConfirmed: {
            screen: QualificationConfirmed,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Common_Confirm')
        },
        QualificationWaitConfirm: {
            screen: QualificationWaitConfirm,
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
                (!PermissionForAppMobile.value['ProfileQualification_Index_ProfileQualificationGird'] ||
                    !PermissionForAppMobile.value['ProfileQualification_Index_ProfileQualificationGird']['View'] ===
                        true)
            ) {
                data = data.filter(item => item.screenName !== ScreenName.QualificationConfirmed);
                perTabConfirmed = false;
            }

            if (
                PermissionForAppMobile &&
                (!PermissionForAppMobile.value[
                    'ProfileQualification_Request_Index_ProfileQualification_Request_Gird'
                ] ||
                    !PermissionForAppMobile.value[
                        'ProfileQualification_Request_Index_ProfileQualification_Request_Gird'
                    ]['View'] === true)
            ) {
                data = data.filter(item => item.screenName !== ScreenName.QualificationWaitConfirm);
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

export default TopTabQualificationInfo;
