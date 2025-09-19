/* eslint-disable react/display-name */
import React from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import VnrText from '../../../../../components/VnrText/VnrText';
import { Colors, styleSheets } from '../../../../../constants/styleConfig';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import HreTaskEvaluete from '../hreTaskEdit/HreTaskEvaluete';
import { translate } from '../../../../../i18n/translate';
import HreTaskInfoDetail from '../hreTaskDetail/HreTaskInfoDetail';
import HreTaskDependantDetail from '../hreTaskDetail/HreTaskDependantDetail';
const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const HreTaskTabEditEvaluation = createMaterialTopTabNavigator(
    {
        HreTaskInfo: {
            screen: ({ navigation }) => <HreTaskInfoDetail {...{ ...navigation.state.params, navigation }} />,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'HRM_Info')
        },
        HreTaskDependant: {
            screen: ({ navigation }) => <HreTaskDependantDetail {...{ ...navigation.state.params, navigation }} />,
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
export default HreTaskTabEditEvaluation;

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
