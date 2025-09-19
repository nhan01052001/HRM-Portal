import React from 'react';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';
import RenderTopTab from '../../../../navigation/tabar/RenderTopTab';
import HreWaitEvalutionContract from './hreEvalutionContract/HreWaitEvalutionContract';
import HreDoneEvalutionContract from './hreEvalutionContract/HreDoneEvalutionContract';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const data = [
    {
        title: 'HRM_PortalApp_ContractHistory_PendingReview',
        screenName: ScreenName.HreWaitEvalutionContract
    },
    {
        title: 'HRM_PortalApp_ContractHistory_HaveEvaluated',
        screenName: ScreenName.HreDoneEvalutionContract
    }
    // {
    //     title: 'HRM_PortalApp_TopTabAllData',
    //     screenName: ScreenName.HreAllEvalutionContract
    // }
];

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabEvalutionContract = createMaterialTopTabNavigator(
    {
        HreWaitEvalutionContract: {
            screen: HreWaitEvalutionContract,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_ContractHistory_PendingReview')
        },
        HreDoneEvalutionContract: {
            screen: HreDoneEvalutionContract,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfig(navigation, 'HRM_PortalApp_ContractHistory_HaveEvaluated')
        }
        // HreAllEvalutionContract: {
        //     screen: HreAllEvalutionContract,
        //     navigationOptions: ({ navigation }) => (navigationOptionsCogfig(navigation, 'HRM_PortalApp_TopTabAllData'))
        // }
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
export default TopTabEvalutionContract;
