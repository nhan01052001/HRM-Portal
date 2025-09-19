/* eslint-disable react/display-name */
/* eslint-disable react-native/no-unused-styles */
import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import VnrText from '../../../../../components/VnrText/VnrText';
import { Colors, styleSheets } from '../../../../../constants/styleConfig';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import HreTaskDependant from './HreTaskDependant';
import HreTaskEvaluete from './HreTaskEvaluete';
//import HreTaskInfo from './HreTaskInfo';
import { translate } from '../../../../../i18n/translate';

import HreTaskInfoTabDescription from './hreTaskInfoTab/HreTaskInfoTabDescription';
import HreTaskInfoTabComment from './hreTaskInfoTab/HreTaskInfoTabComment';
import HreTaskInfoTabDetail from './hreTaskInfoTab/HreTaskInfoTabDetail';
import HreTaskInfoTabPlan from './hreTaskInfoTab/HreTaskInfoTabPlan';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

//#region [chỉnh sửa tab Thông tin công việc]
const navigationOptionsCogfigTopTabHreTaskEditInfo = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const TopTabHreTaskEditInfo = createMaterialTopTabNavigator(
    {
        HreTaskInfoTabDescription: {
            screen: HreTaskInfoTabDescription,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfigTopTabHreTaskEditInfo(navigation, 'Description')
        },
        HreTaskInfoTabPlan: {
            screen: HreTaskInfoTabPlan,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfigTopTabHreTaskEditInfo(navigation, 'HRM_System_Resource_Tra_Plan')
        },
        HreTaskInfoTabDetail: {
            screen: HreTaskInfoTabDetail,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfigTopTabHreTaskEditInfo(navigation, 'HRM_Common_ViewMore')
        },
        HreTaskInfoTabComment: {
            screen: HreTaskInfoTabComment,
            navigationOptions: ({ navigation }) => navigationOptionsCogfigTopTabHreTaskEditInfo(navigation, 'Note')
        }
    },
    {
        lazy: true,
        tabBarComponent: navigationAll => {
            const { navigation } = navigationAll,
                { index } = navigation.state;
            return (
                <View style={stylesTabDetail.containTab}>
                    <ScrollView horizontal pagingEnabled={false} showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity
                            style={[styles.tabStyle, index == 0 && stylesTabDetail.styleTabActive]}
                            onPress={() => navigation.navigate('HreTaskInfoTabDescription')}
                        >
                            <VnrText
                                i18nKey={'Description'}
                                style={[
                                    styleSheets.text,
                                    index != 0 ? stylesTabDetail.text_colorGrey : stylesTabDetail.text_colorBlue
                                ]}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabStyle, index == 1 && stylesTabDetail.styleTabActive]}
                            onPress={() => navigation.navigate('HreTaskInfoTabPlan')}
                        >
                            <VnrText
                                i18nKey={'HRM_System_Resource_Tra_Plan'}
                                style={[
                                    styleSheets.text,
                                    index != 1 ? stylesTabDetail.text_colorGrey : stylesTabDetail.text_colorBlue
                                ]}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabStyle, index == 2 && stylesTabDetail.styleTabActive]}
                            onPress={() => navigation.navigate('HreTaskInfoTabDetail')}
                        >
                            <VnrText
                                i18nKey={'HRM_Common_ViewMore'}
                                style={[
                                    styleSheets.text,
                                    index != 2 ? stylesTabDetail.text_colorGrey : stylesTabDetail.text_colorBlue
                                ]}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabStyle, index == 3 && stylesTabDetail.styleTabActive]}
                            onPress={() => navigation.navigate('HreTaskInfoTabComment')}
                        >
                            <VnrText
                                i18nKey={'Note'}
                                style={[
                                    styleSheets.text,
                                    index != 3 ? stylesTabDetail.text_colorGrey : stylesTabDetail.text_colorBlue
                                ]}
                            />
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            );
        }
    }
);
//#endregion

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const HreTaskTabEdit = createMaterialTopTabNavigator(
    {
        HreTaskInfo: {
            //screen: ({ navigation }) => <HreTaskInfo {...navigation.state.params} />,
            screen: TopTabHreTaskEditInfo,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Info')
        },
        HreTaskDependant: {
            screen: ({ navigation }) => <HreTaskDependant {...{ ...navigation.state.params, navigation }} />,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Tas_Task_PersonsConcerned')
        },
        HreTaskEvaluete: {
            screen: ({ navigation }) => <HreTaskEvaluete {...{ ...navigation.state.params, navigation }} />,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Tas_Task_Evaluation')
        }
    },
    {
        lazy: true,
        tabBarComponent: navigationAll => {
            const { navigation } = navigationAll,
                { index } = navigation.state;
            return (
                <View style={styles.containTab}>
                    <ScrollView horizontal pagingEnabled={false} showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity
                            style={[styles.tabStyle, index == 0 && styles.styleTabActive]}
                            onPress={() => navigation.navigate('HreTaskInfo')}
                        >
                            <VnrText
                                i18nKey={'HRM_Evaluation_Information'}
                                style={[
                                    styleSheets.lable,
                                    index == 0 ? styles.text_colorSecondary : styles.text_colorGray
                                ]}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabStyle, index == 1 && styles.styleTabActive]}
                            onPress={() => navigation.navigate('HreTaskDependant')}
                        >
                            <VnrText
                                i18nKey={'HRM_Tas_Task_PersonsConcerned'}
                                style={[
                                    styleSheets.lable,
                                    index == 1 ? styles.text_colorSecondary : styles.text_colorGray
                                ]}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabStyle, index == 2 && styles.styleTabActive]}
                            onPress={() => navigation.navigate('HreTaskEvaluete')}
                        >
                            <VnrText
                                i18nKey={'HRM_Tas_Task_Evaluation'}
                                style={[
                                    styleSheets.lable,
                                    index == 2 ? styles.text_colorSecondary : styles.text_colorGray
                                ]}
                            />
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            );
        }
    }
);
//#endregion
export default HreTaskTabEdit;

const styles = StyleSheet.create({
    containTab: {
        flex: 1,
        maxHeight: 55,
        backgroundColor: Colors.white,
        paddingVertical: 8,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    },
    tabStyle: {
        marginHorizontal: 5,
        borderRadius: 5,
        width: 'auto',
        paddingHorizontal: 10,
        justifyContent: 'center'
    },
    text_colorGray: {
        color: Colors.gray_10
    },
    text_colorSecondary: {
        color: Colors.primary,
        fontWeight: '600'
    },
    styleTabActive: {
        borderBottomWidth: 0
        // borderBottomColor: Colors.primary,
    }
});

const stylesTabDetail = StyleSheet.create({
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
    text_colorWhite: {
        color: Colors.white
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
