import React from 'react';
import { Colors, styleSheets } from '../../../../constants/styleConfig';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import { translate } from '../../../../i18n/translate';

import EvaPerformanceGeneral from './evaPerformanceEvaDataResultV3Detail/EvaPerformanceGeneral';
import EvaPerformanceGroupTarget from './evaPerformanceEvaDataResultV3Detail/EvaPerformanceGroupTarget';
import EvaPerformanceOrther from './evaPerformanceEvaDataResultV3Detail/EvaPerformanceOrther';
import EvaPerformanceTarget from './evaPerformanceEvaDataResultV3Detail/EvaPerformanceTarget';
import PerformanceTemplateProfile from './evaPerformanceEvaDataResultV3Detail/PerformanceTemplateProfile';
import { View, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import VnrText from '../../../../components/VnrText/VnrText';

//#region [tạo tab màn hình Detail (bảng đánh giá nhân viên, DS nhóm tiêu chí,
// DS Tiêu chí, Đánh giá chung , thông tin khác]
const navigationOptionsCogfigTopTabHreTaskEditInfo = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

const EvaPerformanceEvaDataResultV3Detail = createMaterialTopTabNavigator(
    {
        PerformanceTemplateProfile: {
            screen: PerformanceTemplateProfile,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfigTopTabHreTaskEditInfo(navigation, 'HRM_Evaluation_PerformanceTemplateProfile')
        },
        EvaPerformanceGroupTarget: {
            screen: EvaPerformanceGroupTarget,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfigTopTabHreTaskEditInfo(navigation, 'HRM_Category_NameEntity_Title')
        },
        EvaPerformanceTarget: {
            screen: EvaPerformanceTarget,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfigTopTabHreTaskEditInfo(navigation, 'Eva_PerformanceEvaDataResultV3_TitleGridKPI')
        },
        EvaPerformanceGeneral: {
            screen: EvaPerformanceGeneral,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfigTopTabHreTaskEditInfo(navigation, 'HRM_Evaluation_GeneralPerformance')
        },
        EvaPerformanceOrther: {
            screen: EvaPerformanceOrther,
            navigationOptions: ({ navigation }) =>
                navigationOptionsCogfigTopTabHreTaskEditInfo(navigation, 'HRM_Evaluation_GeneralPerformance')
        }
    },
    {
        lazy: true,
        // eslint-disable-next-line react/display-name
        tabBarComponent: (navigationAll) => {
            const { navigation } = navigationAll,
                { index } = navigation.state;
            return (
                <View style={styles.containTab}>
                    <ScrollView horizontal pagingEnabled={false} showsHorizontalScrollIndicator={false}>
                        <TouchableOpacity
                            style={[styles.tabStyle, index == 0 && styles.styleTabActive]}
                            onPress={() =>
                                navigation.navigate('PerformanceTemplateProfile', {
                                    screenName: 'PerformanceTemplateProfile'
                                })
                            }
                        >
                            <VnrText
                                i18nKey={'HRM_Evaluation_PerformanceTemplateProfile'}
                                style={[styleSheets.text, index != 0 ? styles.text_colorGrey : styles.text_colorBlue]}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabStyle, index == 1 && styles.styleTabActive]}
                            onPress={() => navigation.navigate('EvaPerformanceGroupTarget')}
                        >
                            <VnrText
                                i18nKey={'HRM_Category_NameEntity_Title'}
                                style={[styleSheets.text, index != 1 ? styles.text_colorGrey : styles.text_colorBlue]}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabStyle, index == 2 && styles.styleTabActive]}
                            onPress={() => navigation.navigate('EvaPerformanceTarget')}
                        >
                            <VnrText
                                i18nKey={'Eva_PerformanceEvaDataResultV3_TitleGridKPI'}
                                style={[styleSheets.text, index != 2 ? styles.text_colorGrey : styles.text_colorBlue]}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.tabStyle, index == 3 && styles.styleTabActive]}
                            onPress={() => navigation.navigate('EvaPerformanceGeneral')}
                        >
                            <VnrText
                                i18nKey={'OtherInformation'}
                                style={[styleSheets.text, index != 3 ? styles.text_colorGrey : styles.text_colorBlue]}
                            />
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            );
        }
    }
);
//#endregion

export default EvaPerformanceEvaDataResultV3Detail;

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
