/* eslint-disable react/display-name */
import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import HreWaitWorkManage from './hreWorkManage/HreWaitWorkManage';
import HreDoneWorkManage from './hreWorkManage/HreDoneWorkManage';
import HreAllWorkManage from './hreWorkManage/HreAllWorkManage';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'ProfileWorkList__E_WAITING',
        screenName: ScreenName.HreWaitWorkManage
    },
    {
        title: 'ProfileWorkList__E_DONE',
        screenName: ScreenName.HreDoneWorkManage
    },
    {
        title: 'HRM_PortalApp_TopTabAllData',
        screenName: ScreenName.HreAllWorkManage
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabHreWorkManage = createMaterialTopTabNavigator(
    {
        HreWaitWorkManage: {
            screen: HreWaitWorkManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreDoneWorkManage: {
            screen: HreDoneWorkManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        },
        HreAllWorkManage: {
            screen: HreAllWorkManage,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, '')
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: (navigationAll) => {
            return <RenderTopTab data={data} navigationAll={navigationAll} />;
        }
    }
);
//#endregion
export default TopTabHreWorkManage;
