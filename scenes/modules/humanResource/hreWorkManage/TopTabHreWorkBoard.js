import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import HreWaitWorkBoard from './hreWorkBoard/HreWaitWorkBoard';
import HreDoneWorkBoard from './hreWorkBoard/HreDoneWorkBoard';
import HreAllWorkBoard from './hreWorkBoard/HreAllWorkBoard';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'ProfileWorkList__E_WAITING',
        screenName: ScreenName.HreWaitWorkBoard
    },
    {
        title: 'ProfileWorkList__E_DONE',
        screenName: ScreenName.HreDoneWorkBoard
    },
    {
        title: 'HRM_PortalApp_TopTabAllData',
        screenName: ScreenName.HreAllWorkBoard
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabHreWorkBoard = createMaterialTopTabNavigator(
    {
        HreWaitWorkBoard: {
            screen: HreWaitWorkBoard,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'ProfileWorkList__E_WAITING')
        },
        HreDoneWorkBoard: {
            screen: HreDoneWorkBoard,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'ProfileWorkList__E_DONE')
        },
        HreAllWorkBoard: {
            screen: HreAllWorkBoard,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTabAllData')
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        // eslint-disable-next-line react/display-name
        tabBarComponent: (navigationAll) => {
            return <RenderTopTab data={data} navigationAll={navigationAll} />;
        }
    }
);
//#endregion
export default TopTabHreWorkBoard;
