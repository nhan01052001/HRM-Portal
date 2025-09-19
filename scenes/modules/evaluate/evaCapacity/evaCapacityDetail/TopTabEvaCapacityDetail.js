import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, styleSheets } from '../../../../../constants/styleConfig';
import { createMaterialTopTabNavigator } from 'react-navigation-tabs';
import EvaCapacityDetailConfirmed from './EvaCapacityDetailConfirmed';
import EvaCapacityDetailWatting from './EvaCapacityDetailWatting';
import { translate } from '../../../../../i18n/translate';
import VnrText from '../../../../../components/VnrText/VnrText';

const navigationOptionsCogfig = (navigation, Title_Key) => {
    return {
        title: translate(Title_Key)
    };
};

//#region [tạo tab màn hình Edit (công việc, người liên quan, đánh giá)]
const TopTabEvaCapacityDetail = createMaterialTopTabNavigator(
    {
        EvaCapacityDetailWatting: {
            screen: EvaCapacityDetailWatting,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'Chờ đánh giá')
        },
        EvaCapacityDetailConfirmed: {
            screen: EvaCapacityDetailConfirmed,
            navigationOptions: ({ navigation }) => navigationOptionsCogfig(navigation, 'Đã đánh giá')
        }
    },
    {
        lazy: true,
        swipeEnabled: false,
        // eslint-disable-next-line react/display-name
        tabBarComponent: (navigationAll) => {
            const { navigation } = navigationAll,
                { index } = navigation.state;

            // let perTabConfirmed = false,
            //     perTabWaitConfirm = false,
            //     perTabEdit = false;

            // if (PermissionForAppMobile && PermissionForAppMobile.value['Personal_DependantConfirmed']
            //     && PermissionForAppMobile.value['Personal_DependantConfirmed']['View']) {
            //     perTabConfirmed = true;
            // }

            // if (PermissionForAppMobile && PermissionForAppMobile.value['Personal_DependantWaitConfirm']
            //     && PermissionForAppMobile.value['Personal_DependantWaitConfirm']['View']) {
            //     perTabWaitConfirm = true;
            // }

            // if (PermissionForAppMobile && PermissionForAppMobile.value['Personal_DependantEdit']
            //     && PermissionForAppMobile.value['Personal_DependantEdit']['View']) {
            //     perTabEdit = true;
            // }

            // if (perTabConfirmed && (perTabWaitConfirm || perTabEdit)) {
            return (
                <View style={styles.containTab}>
                    <TouchableOpacity
                        style={[styles.tabStyle, index == 0 && styles.styleTabActive]}
                        onPress={() => navigation.navigate('EvaCapacityDetailWatting')}
                    >
                        <VnrText
                            i18nKey={'Chờ đánh giá'}
                            style={[styleSheets.lable, index == 0 ? styles.text_colorSecondary : styles.text_colorGray]}
                        />
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.tabStyle, index == 1 && styles.styleTabActive]}
                        onPress={() => navigation.navigate('EvaCapacityDetailConfirmed')}
                    >
                        <VnrText
                            i18nKey={'Đã đánh giá'}
                            style={[styleSheets.lable, index == 1 ? styles.text_colorSecondary : styles.text_colorGray]}
                        />
                    </TouchableOpacity>
                </View>
            );
            // }
            // else {
            //     return (
            //         <View />
            //     );
            // }
        }
    }
);
//#endregion

const styles = StyleSheet.create({
    containTab: {
        flex: 1,
        maxHeight: 55,
        backgroundColor: Colors.white,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        flexDirection: 'row'
    },
    tabStyle: {
        flex: 1,
        borderRadius: 5,
        width: 'auto',
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    text_colorGray: {
        color: Colors.gray_10
    },
    text_colorSecondary: {
        color: Colors.primary,
        fontWeight: '600'
    },
    styleTabActive: {
        borderBottomWidth: 1.5,
        borderBottomColor: Colors.primary
    }
});

export default TopTabEvaCapacityDetail;
