/* eslint-disable react/display-name */
import React from 'react';
import { createAppContainer } from 'react-navigation';
import { Colors, styleSheets } from '../../../../constants/styleConfig';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import HreTaskDependantDetail from './hreTaskDetail/HreTaskDependantDetail';
import HreTaskEvalueteDetail from './hreTaskDetail/HreTaskEvalueteDetail';
import HreTaskHistoryDetail from './hreTaskDetail/HreTaskHistoryDetail';
import HreTaskInfoDetail from './hreTaskDetail/HreTaskInfoDetail';

import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import VnrText from '../../../../components/VnrText/VnrText';

import { translate } from '../../../../i18n/translate';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

//#region [tạo tab màn hình detail (công việc, đánh giá)]
const TopTabHreTaskDetail = createMaterialTopTabNavigator(
    {
        HreTaskInfoDetail: {
            screen: ({ navigation, screenProps }) => <HreTaskInfoDetail {...{ ...screenProps, navigation }} />,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Evaluation_Information')
        },
        HreTaskDependantDetail: {
            screen: ({ navigation, screenProps }) => <HreTaskDependantDetail {...{ ...screenProps, navigation }} />,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Tas_Task_PersonsConcerned')
        },
        HreTaskHistoryDetail: {
            screen: ({ navigation, screenProps }) => <HreTaskHistoryDetail {...{ ...screenProps, navigation }} />,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Title_WorkHistory')
        },
        HreTaskEvalueteDetail: {
            screen: ({ navigation, screenProps }) => <HreTaskEvalueteDetail {...{ ...screenProps, navigation }} />,
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
                            onPress={() => navigation.navigate('HreTaskInfoDetail')}
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
                            onPress={() => navigation.navigate('HreTaskDependantDetail')}
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
                            onPress={() => navigation.navigate('HreTaskHistoryDetail')}
                        >
                            <VnrText
                                i18nKey={'HRM_Title_WorkHistory'}
                                style={[
                                    styleSheets.lable,
                                    index == 2 ? styles.text_colorSecondary : styles.text_colorGray
                                ]}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabStyle, index == 3 && styles.styleTabActive]}
                            onPress={() => navigation.navigate('HreTaskEvalueteDetail')}
                        >
                            <VnrText
                                i18nKey={'HRM_Tas_Task_Evaluation'}
                                style={[
                                    styleSheets.lable,
                                    index == 3 ? styles.text_colorSecondary : styles.text_colorGray
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

export default createAppContainer(TopTabHreTaskDetail);

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
