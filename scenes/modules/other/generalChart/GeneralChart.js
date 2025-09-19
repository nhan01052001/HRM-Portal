/* eslint-disable react/display-name */
// Biểu đồ hiển thị nhóm tuổi nhân viên
// https://hrm.skypec.com.vn:1236/Sys_GetData/GetReportContentReportDynamicSQL
// //modelExport[PivotTableID]: ea08197a-8537-4017-81ff-461f0d778fdf
// modelExport[IsCreateTemplate]:
// modelExport[IsCreateTemplateForDynamicGrid]:

// Biểu đồ hiển thị nhân viên đáp ứng Tiếng Anh
// https://hrm.skypec.com.vn:1236/Sys_GetData/GetReportContentReportDynamicSQL
// modelExport[PivotTableID]: 32a9be38-e203-4fe0-bac1-a7d0d18a34aa
// modelExport[IsCreateTemplate]:

// Biểu đồ hiển thị trình độ đào tạo (Đơn vị)
// https://hrm.skypec.com.vn:1236/Sys_GetData/GetReportContentReportDynamicSQL
// modelExport[PivotTableID]: 9a4a276a-1d90-4a83-81fe-477efc9c3dc4
// modelExport[IsCreateTemplate]:
// modelExport[IsCreateTemplateForDynamicGrid]:

import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, styleSheets } from '../../../../constants/styleConfig';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';
import ChEmployeeAge from './ChEmployeeAge';
import ChEmployeeEarly from './ChEmployeeEarly';
import ChEmployeeGender from './ChEmployeeGender';
import ChEmployeeLate from './ChEmployeeLate';
import ChEmployeeFillEnglish from './ChEmployeeFillEnglish';
import ChQualificationTrainee from './ChQualificationTrainee';
// import ChEmployeeAre from './ChEmployeeAre';
import VnrText from '../../../../components/VnrText/VnrText';

//#region [tạo tab màn hình Detail (bảng đánh giá nhân viên, DS nhóm tiêu chí,
// DS Tiêu chí, Đánh giá chung , thông tin khác]
const navigationOptionsCogfigTopTabHreTaskEditInfo = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const TopTabChGeneralChart = createMaterialTopTabNavigator(
    {
        ChEmployeeAge: {
            screen: ChEmployeeAge,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfigTopTabHreTaskEditInfo(navigation, 'HRM_GeneralChart_Age')
        },
        ChEmployeeGender: {
            screen: ChEmployeeGender,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfigTopTabHreTaskEditInfo(navigation, 'HRM_GeneralChart_Ratio_MaleFemale')
        },
        ChEmployeeFillEnglish: {
            screen: ChEmployeeFillEnglish,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfigTopTabHreTaskEditInfo(navigation, 'HRM_GeneralChart_Staff_English')
        },
        ChQualificationTrainee: {
            screen: ChQualificationTrainee,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfigTopTabHreTaskEditInfo(navigation, 'HRM_GeneralChart_Qualification_Trainee')
        },
        ChEmployeeLate: {
            screen: ChEmployeeLate,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfigTopTabHreTaskEditInfo(navigation, 'HRM_GeneralChart_Late')
        },
        ChEmployeeEarly: {
            screen: ChEmployeeEarly,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfigTopTabHreTaskEditInfo(navigation, 'HRM_GeneralChart_Early')
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        tabBarComponent: (navigationAll) => {
            const { navigation } = navigationAll,
                { index } = navigation.state;
            return (
                <View style={styles.containTab}>
                    <ScrollView
                        // extraData={index}
                        horizontal
                        pagingEnabled={false}
                        showsHorizontalScrollIndicator={false}
                    >
                        <TouchableOpacity
                            style={[styles.tabStyle, index == 0 && styles.styleTabActive]}
                            onPress={() => navigation.navigate('ChEmployeeAge', { screenName: 'ChEmployeeAge' })}
                        >
                            <VnrText
                                i18nKey={'HRM_GeneralChart_Age'}
                                style={[styleSheets.text, index != 0 ? styles.text_colorGrey : styles.text_colorBlue]}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabStyle, index == 1 && styles.styleTabActive]}
                            onPress={() => navigation.navigate('ChEmployeeGender')}
                        >
                            <VnrText
                                i18nKey={'HRM_GeneralChart_Ratio_MaleFemale'}
                                style={[styleSheets.text, index != 1 ? styles.text_colorGrey : styles.text_colorBlue]}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabStyle, index == 2 && styles.styleTabActive]}
                            onPress={() => navigation.navigate('ChEmployeeFillEnglish')}
                        >
                            <VnrText
                                i18nKey={'HRM_GeneralChart_Staff_English'}
                                style={[styleSheets.text, index != 2 ? styles.text_colorGrey : styles.text_colorBlue]}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabStyle, index == 3 && styles.styleTabActive]}
                            onPress={() => navigation.navigate('ChQualificationTrainee')}
                        >
                            <VnrText
                                i18nKey={'HRM_GeneralChart_Qualification_Trainee'}
                                style={[styleSheets.text, index != 3 ? styles.text_colorGrey : styles.text_colorBlue]}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabStyle, index == 4 && styles.styleTabActive]}
                            onPress={() => navigation.navigate('ChEmployeeLate')}
                        >
                            <VnrText
                                i18nKey={'HRM_GeneralChart_Late'}
                                style={[styleSheets.text, index != 4 ? styles.text_colorGrey : styles.text_colorBlue]}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabStyle, index == 5 && styles.styleTabActive]}
                            onPress={() => navigation.navigate('ChEmployeeEarly')}
                        >
                            <VnrText
                                i18nKey={'HRM_GeneralChart_Early'}
                                style={[styleSheets.text, index != 5 ? styles.text_colorGrey : styles.text_colorBlue]}
                            />
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            );
        }
    }
);
//#endregion

export default TopTabChGeneralChart;

const styles = StyleSheet.create({
    containTab: {
        flex: 1,
        maxHeight: 55,
        backgroundColor: Colors.greyPrimaryConstraint,
        paddingVertical: 8
    },
    tabStyle: {
        marginHorizontal: 5,
        borderRadius: 5,
        borderColor: Colors.borderColor,
        borderWidth: 1,
        width: 'auto',
        paddingHorizontal: 10,
        justifyContent: 'center'
    },
    text_colorGrey: {
        color: Colors.grey
    },
    text_colorBlue: {
        color: Colors.primary
    },
    styleTabActive: {
        backgroundColor: Colors.white,
        borderColor: Colors.primary,
        borderWidth: 1
    }
});
