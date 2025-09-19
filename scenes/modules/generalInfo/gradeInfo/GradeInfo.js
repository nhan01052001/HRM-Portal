import { Colors, styleSheets } from '../../../../constants/styleConfig';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import GradeAttendance from './gradeAttendance/GradeAttendance';
import GradeInsurance from './gradeInsurance/GradeInsurance';
import GradeSalary from './gradeSalary/GradeSalary';
import { translate } from '../../../../i18n/translate';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const TopTaGradeInfo = createMaterialTopTabNavigator(
    {
        GradeAttendance: {
            screen: GradeAttendance,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Attendance')
        },
        GradeInsurance: {
            screen: GradeInsurance,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_HR_Profile_Insurance')
        },
        GradeSalary: {
            screen: GradeSalary,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Payroll')
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
export default TopTaGradeInfo;
