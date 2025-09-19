import { Colors, styleSheets } from '../../../../constants/styleConfig';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import EvaPerformanceQuicklyProfile from './evaPerformanceQuicklyTabProfile/EvaPerformanceQuicklyProfile';
import EvaPerformanceQuicklyTarget from './evaPerformanceQuicklyTabTarget/EvaPerformanceQuicklyTarget';
import { translate } from '../../../../i18n/translate';
import { ScreenName } from '../../../../assets/constant';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

//#region [tạo tab màn hình DS (đánh giá nhanh)]
const EvaPerformanceQuickly = createMaterialTopTabNavigator(
    {
        EvaPerformanceQuicklyProfile: {
            screen: EvaPerformanceQuicklyProfile,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Attendance_ProfileName')
        },
        EvaPerformanceQuicklyTarget: {
            screen: EvaPerformanceQuicklyTarget,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Edit_In_bulk')
        }
    },
    {
        tabBarOptions: {
            style: {
                backgroundColor: Colors.white,
                borderTopColor: Colors.white,
                borderTopWidth: 0
            },
            activeTintColor: Colors.primary,
            inactiveTintColor: Colors.gray_10,
            labelStyle: styleSheets.lable,
            indicatorStyle: {
                borderBottomColor: Colors.primary,
                borderBottomWidth: 2.5
            },
            upperCaseLabel: false
        },
        lazy: true
    }
);
//#endregion

export const TaskBusinessFunction = {
    checkForLoadEditDelete: {
        [ScreenName.EvaPerformanceQuicklyTarget]: false,
        [ScreenName.EvaPerformanceQuicklyProfile]: false
    }
};
export default EvaPerformanceQuickly;
