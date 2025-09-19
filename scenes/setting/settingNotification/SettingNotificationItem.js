import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, Switch } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, Size, styleSheets, styleSwipeableAction } from '../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import ActionSheet from 'react-native-actionsheet';
import Vnr_Function from '../../../utils/Vnr_Function';
import { translate } from '../../../i18n/translate';
import {
    IconEdit,
    IconMail,
    IconDelete,
    IconMoreHorizontal,
    IconInfo,
    IconCheck,
    IconBack,
    IconCancelMarker,
    IconCancel,
    IconCheckCirlceo
} from '../../../constants/Icons';
import VnrText from '../../../components/VnrText/VnrText';
import { EnumName, ScreenName } from '../../../assets/constant';
import Color from 'color';
import { dataVnrStorage } from '../../../assets/auth/authentication';

export default class SettingNotificationItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.isOnOffNotification !== this.props.isOnOffNotification) {
            return true;
        } else {
            return false;
        }
    }

    render() {
        const {
                dataItem,
                keyGroup,
                toggleSwitchItem,
                index,
                rowActions,
                isOpenAction,
                isDisable,
                isOnOffNotification
            } = this.props,
            { urlIcon, title, subTitle } = dataItem;

        let linkIcon = '';

        if (dataVnrStorage.apiConfig) {
            linkIcon = urlIcon.replace('[URI_POR]', dataVnrStorage.apiConfig.uriPor);
        }

        return (
            <View style={styles.styViewItem}>
                <View style={styles.styViewItem_left}>
                    <Image style={styles.styIcon} source={{ uri: linkIcon }} />
                </View>
                <View style={styles.styViewItem_center}>
                    <VnrText style={[styleSheets.text, styles.styViewItem_title]} i18nKey={title} />
                    <VnrText style={[styleSheets.text, styles.styViewItem_subTitle]} i18nKey={subTitle} />
                </View>
                <View style={styles.styViewItem_right}>
                    <Switch
                        trackColor={{ false: Colors.gray_5, true: Colors.primary }}
                        thumbColor={Colors.white}
                        ios_backgroundColor={Colors.gray_5}
                        onValueChange={() => toggleSwitchItem(keyGroup, index)}
                        value={isOnOffNotification}
                    />
                </View>
            </View>
        );
    }
}

const HEIGHT_INIT_ITEM = Size.deviceWidth * 0.14,
    HEIGHT_ITEM = Math.floor(
        HEIGHT_INIT_ITEM < 70 && HEIGHT_INIT_ITEM > 40 ? HEIGHT_INIT_ITEM : HEIGHT_INIT_ITEM > 70 ? 70 : 40
    );
const styles = StyleSheet.create({
    styViewItem: {
        flexDirection: 'row',
        // paddingVertical: Size.defineSpace * 0.7,
        height: HEIGHT_ITEM,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        alignItems: 'center'
    },
    styViewItem_center: {
        flex: 1,
        marginHorizontal: Size.defineSpace * 0.7
    },
    styViewItem_title: {
        fontSize: Size.text - 1,
        fontWeight: '400',
        textAlign: 'left'
    },
    styViewItem_subTitle: {
        fontSize: Size.text - 3,
        color: Colors.gray_7,
        textAlign: 'left'
    },
    styIcon: {
        width: HEIGHT_ITEM * 0.65,
        height: HEIGHT_ITEM * 0.65,
        resizeMode: 'cover',
        maxWidth: 80,
        maxHeight: 80

        // borderRadius: 18,
    },
    styContentGroup: {}
});
