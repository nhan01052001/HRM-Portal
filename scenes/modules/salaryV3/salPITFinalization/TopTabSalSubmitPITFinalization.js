import React from 'react';
import { View } from 'react-native';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import SalSaveTempSubmitPITFinalization from './salSubmitPITFinalization/salSaveTempSubmitPITFinalization/SalSaveTempSubmitPITFinalization';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import SalWaitingConfirmSubmitPITFinalization from './salSubmitPITFinalization/salWaitingConfirmSubmitPITFinalization/SalWaitingConfirmSubmitPITFinalization';
import SalConfirmedSubmitPITFinalization from './salSubmitPITFinalization/salConfirmedSubmitPITFinalization/SalConfirmedSubmitPITFinalization';
import SalSubmitPITFinalization from './salSubmitPITFinalization/SalSubmitPITFinalization';
import SalRejectedSubmitPITFinalization from './salSubmitPITFinalization/salRejectedSubmitPITFinalization/SalRejectedSubmitPITFinalization';
import SalCanceledSubmitPITFinalization from './salSubmitPITFinalization/salCanceledSubmitPITFinalization/SalCanceledSubmitPITFinalization';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const title = 'HRM_PortalApp_PITFinalization_Title';

const data = [
    {
        title: 'HRM_PortalApp_PITFinalization_tabAll',
        screenName: ScreenName.SalSubmitPITFinalization
    },
    {
        title: 'HRM_PortalApp_PITFinalization_tabPendingSend',
        screenName: ScreenName.SalSaveTempSubmitPITFinalization
    },
    {
        title: 'HRM_PortalApp_PITFinalization_tabWaitingConfirmed',
        screenName: ScreenName.SalWaitingConfirmSubmitPITFinalization
    },
    {
        title: 'HRM_PortalApp_PITFinalization_tabConfirmed',
        screenName: ScreenName.SalConfirmedSubmitPITFinalization
    },
    {
        title: 'HRM_PortalApp_PITFinalization_tabRejected',
        screenName: ScreenName.SalRejectedSubmitPITFinalization
    },
    {
        title: 'HRM_PortalApp_PITFinalization_tabCanceled',
        screenName: ScreenName.SalCanceledSubmitPITFinalization
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabSalSubmitPITFinalization = createMaterialTopTabNavigator(
    {
        SalSubmitPITFinalization: {
            screen: SalSubmitPITFinalization,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, title)
        },
        SalSaveTempSubmitPITFinalization: {
            screen: SalSaveTempSubmitPITFinalization,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, title)
        },
        SalWaitingConfirmSubmitPITFinalization: {
            screen: SalWaitingConfirmSubmitPITFinalization,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, title)
        },
        SalConfirmedSubmitPITFinalization: {
            screen: SalConfirmedSubmitPITFinalization,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, title)
        },
        SalRejectedSubmitPITFinalization: {
            screen: SalRejectedSubmitPITFinalization,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, title)
        },
        SalCanceledSubmitPITFinalization: {
            screen: SalCanceledSubmitPITFinalization,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, title)
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: (navigationAll) => {

            let perTabApprove = true,
                perTabWaitApproved = true,
                perTabReject = true,
                perTabCancled = true,
                perTabAll = true,
                perTabSaveTemp = true;

            if (
                perTabApprove ||
                ((perTabWaitApproved || perTabReject || perTabCancled || perTabAll || perTabSaveTemp) &&
                    Array.isArray(data) &&
                    data.length > 0)
            ) {
                return <RenderTopTab data={data} navigationAll={navigationAll} />;
            } else {
                return <View />;
            }
        }
    }
);
//#endregion

export default TopTabSalSubmitPITFinalization;
