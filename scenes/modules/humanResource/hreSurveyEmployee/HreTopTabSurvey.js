import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import HreSurveyEmployee from './HreSurveyEmployee';
import HreSurveyHistory from './HreSurveyHistory';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import { ScreenName } from '../../../../assets/constant';

let data = [
    {
        title: 'HRM_Survey_TopTab_Title',
        screenName: ScreenName.HreSurveyEmployee
    },
    {
        title: 'HRM_SurveyHistory_TopTab_Title',
        screenName: ScreenName.HreSurveyHistory
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const HreTopTabSurvey = createMaterialTopTabNavigator(
    {
        HreSurveyEmployee: {
            screen: HreSurveyEmployee
        },
        HreSurveyHistory: {
            screen: HreSurveyHistory
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        // eslint-disable-next-line react/display-name
        tabBarComponent: navigationAll => {
            return <RenderTopTab data={data} navigationAll={navigationAll} />;
        }
    }
);
//#endregion

export default HreTopTabSurvey;
