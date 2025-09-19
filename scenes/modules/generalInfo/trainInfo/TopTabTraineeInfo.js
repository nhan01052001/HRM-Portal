import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import Trainee from './trainee/Trainee';
import TraineeCertificate from './traineeCertificate/TraineeCertificate';
import TraineePlan from './traineePlan/TraineePlan';
import { translate } from '../../../../i18n/translate';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import { ScreenName } from '../../../../assets/constant';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

let data = [
    {
        title: 'HRM_Tra_Trainee_ClassID',
        screenName: ScreenName.Trainee
    },
    {
        title: 'HRM_HR_SoftSkill_Certificate',
        screenName: ScreenName.TraineeCertificate
    },
    {
        title: 'HRM_Tra_PlanOutside_Title',
        screenName: ScreenName.TraineePlan
    }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabTraineeInfo = createMaterialTopTabNavigator(
    {
        Trainee: {
            screen: Trainee,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Tra_Trainee_ClassID')
        },
        TraineeCertificate: {
            screen: TraineeCertificate,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_HR_SoftSkill_Certificate')
        },
        TraineePlan: {
            screen: TraineePlan,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Tra_PlanOutside_Title')
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

export default TopTabTraineeInfo;
