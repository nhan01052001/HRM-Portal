import React, { useRef, useEffect } from 'react';
import {
    Text,
    View,
    StyleSheet,
    Animated,
    TouchableOpacity,
    Easing
} from 'react-native';
import { Colors, Size, styleSheets } from '../../constants/styleConfig';
import moment from 'moment';
import { translate } from '../../i18n/translate';


export default function PopupChangeShift(props) {
    const { dateChangeShift, dateChange, isDateChangeShift, handleDateChangeShift } = props;

    const positionButton = useRef(new Animated.Value(0)).current;

    const isOnRef = useRef(false);

    const startAnimToOff = () => {
        Animated.timing(positionButton, {
            toValue: 0,
            duration: 250,
            easing: Easing.ease,
            useNativeDriver: true
        }).start()
    };

    const startAnimToOn = () => {
        Animated.timing(positionButton, {
            toValue: 5.5,
            duration: 250,
            easing: Easing.ease,
            useNativeDriver: true
        }).start()

    };

    const positionInterPol = positionButton.interpolate({ inputRange: [0, 1], outputRange: [0, 30] });

    // chọn ngày đổi ca
    const onPressDateChangeShift = () => {
        if (!isOnRef.current)
            return;
        isOnRef.current = !isOnRef.current;
        startAnimToOff();
        handleDateChangeShift(true);
    }

    // chọn ngày thay thế
    const onPressDateChange = () => {
        if (isOnRef.current)
            return;
        isOnRef.current = !isOnRef.current;
        startAnimToOn();
        handleDateChangeShift(false);
    }

    useEffect(() => {
        if (!isDateChangeShift) {
            onPressDateChange();
            return;
        }

        if (isDateChangeShift && !dateChangeShift) {
            onPressDateChangeShift();
        }
    }, [isDateChangeShift])

    return (
        <View style={[styles.mainStyes]} >
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPressDateChangeShift}
                style={styles.btnChangeShift}
            >
                <Text
                    numberOfLines={1}
                    style={[styles.txtLableChangeShift, !isDateChangeShift && { color: Colors.gray_9 }]}
                >
                    {translate('HRM_PortalApp_TheDayOfShit_Change')}
                </Text>
                <Text
                    style={[styleSheets.text, styles.txtChangeShift, !isDateChangeShift && { color: Colors.gray_9 }]}
                >{dateChangeShift
                        ? moment(dateChangeShift).format('DD-MM-YYYY')
                        : translate('SELECT_ITEM')}</Text>
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={onPressDateChange}
                style={[styles.btnChangeShift]}
            >
                <Text
                    numberOfLines={1}
                    style={[styles.txtLableChangeShift, isDateChangeShift && { color: Colors.gray_9 }]}
                >
                    {translate('HRM_PortalApp_TheReplacementDay')}
                </Text>
                <Text
                    style={[styleSheets.text, styles.txtChangeShift, isDateChangeShift && { color: Colors.gray_9 }]}
                >{dateChange
                        ? moment(dateChange).format('DD-MM-YYYY')
                        : translate('SELECT_ITEM')}</Text>
            </TouchableOpacity>
            <Animated.View style={[styles.basicStyle, {
                transform: [{
                    translateX: positionInterPol
                }]
            }]} />
        </View>
    );
}

const styles = StyleSheet.create({
    basicStyle: {
        position: 'absolute',
        left: 0,
        height: '100%',
        width: 165,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,

        // shadow for ios
        shadowColor: Colors.black_transparent_7,
        shadowOffset: { width: 0.5, height: 0.5 },
        shadowOpacity: 0.5,
        zIndex: 1,

        // shadow for android
        elevation: 5
    },

    mainStyes: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },

    btnChangeShift: {
        width: 165,
        height: 60,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 2,

        // shadow for android
        elevation: 99
    },

    txtLableChangeShift: {
        color: Colors.black,
        fontSize: Size.text - 1,
        fontWeight: 'bold'
    },

    txtChangeShift: {
        color: Colors.black,
        fontSize: Size.text - 1,
        fontWeight: '400'
    }
});
