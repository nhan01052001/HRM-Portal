/* eslint-disable react/display-name */
import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import WorkHistory from './WorkHistory';
import WorkPosition from './WorkPosition';
import { translate } from '../../../../../i18n/translate';
import RenderTopTab from '../../../../../navigation/tabar/RenderTopTab';
import { ScreenName } from '../../../../../assets/constant';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

let data = [
    {
        title: 'PositionTempName',
        screenName: ScreenName.WorkPosition
    },
    {
        title: 'HRM_Title_WorkHistory',
        screenName: ScreenName.WorkHistory
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopWorkHistory = createMaterialTopTabNavigator(
    {
        WorkPosition: {
            screen: WorkPosition,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'PositionTempName')
        },
        WorkHistory: {
            screen: WorkHistory,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Title_WorkHistory')
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: navigationAll => {
            return <RenderTopTab data={data} navigationAll={navigationAll} />;
        }
    }
);
//#endregion

export default TopWorkHistory;
