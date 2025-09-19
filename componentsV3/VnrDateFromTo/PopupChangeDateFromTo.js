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
import VnrText from '../../components/VnrText/VnrText';


export default function PopupChangeDateFromTo(props) {
    const { range, isEditEndDate, isEditStartDate, handleChangeDateFromTo, isDateChangeShift } = props;

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

    const positionInterPol = positionButton.interpolate({ inputRange: [0, 1], outputRange: [0, 25.5] });

    const onPressChangeDateFrom = (isEditStartDate, isEditEndDate) => {
        if (!isOnRef.current)
            return;
        isOnRef.current = !isOnRef.current;
        startAnimToOff();
        handleChangeDateFromTo(isEditStartDate, isEditEndDate);
    }

    const onPressChangeDateTo = (isEditStartDate, isEditEndDate) => {
        if (isOnRef.current)
            return;
        isOnRef.current = !isOnRef.current;
        startAnimToOn();
        handleChangeDateFromTo(isEditStartDate, isEditEndDate);
    }

    useEffect(() => {
        if ((!isEditStartDate && isEditEndDate) || !isDateChangeShift) {
            onPressChangeDateTo(false, true);
            return;
        }

        if ((isEditStartDate && !isEditEndDate) || (!isEditStartDate && !isEditEndDate) || (isDateChangeShift && !range?.startDate)) {
            onPressChangeDateFrom(true, false);
            return;
        }
    }, [isEditStartDate, isEditEndDate, isDateChangeShift])

    return (
        <View style={[styles.mainStyes]} >
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onPressChangeDateFrom(true, false)}
                style={styles.btnChangeShift}
            >
                <Text
                    numberOfLines={1}
                    style={[styles.txtLableChangeShift, !isDateChangeShift && { color: Colors.gray_9 }]}
                >
                    {translate('HRM_PortalApp_VnrDateFromTo_DateStart')}
                </Text>
                {range.startDate ? (
                    <Text style={[styles.textResultChange, styleSheets.text]}>
                        {' '}
                        {range.startDate
                            ? moment(range.startDate).format('DD/MM/YYYY')
                            : null}{' '}
                    </Text>
                ) : (
                    <VnrText
                        style={
                            [range.startDate
                                ? [styles.textResultChange, styleSheets.text]
                                : [styles.textResultDefault, styleSheets.text],
                            !isDateChangeShift && { color: Colors.gray_9 }
                            ]
                        }
                        i18nKey={'SELECT_ITEM'}
                    />
                )}
            </TouchableOpacity>
            <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => onPressChangeDateTo(false, true)}
                style={[styles.btnChangeShift]}
            >
                <Text
                    numberOfLines={1}
                    style={[styles.txtLableChangeShift, isDateChangeShift && { color: Colors.gray_9 }]}
                >
                    {translate('HRM_PortalApp_VnrDateFromTo_DateEnd')}
                </Text>
                {(range.endDate) && (!moment(range.endDate).isBefore(moment(range.startDate), 'day')) ? (
                    <Text style={[styles.textResultChange, styleSheets.text]}>
                        {' '}{moment(range.endDate).format('DD/MM/YYYY')}{' '}
                    </Text>
                ) : (
                    <VnrText
                        style={
                            [
                                range.endDate
                                    ? [styles.textResultChange, styleSheets.text]
                                    : [styles.textResultDefault, styleSheets.text],
                                isDateChangeShift && { color: Colors.gray_9 }
                            ]
                        }
                        i18nKey={'SELECT_ITEM'}
                    />
                )}
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
        width: 140,
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
        width: 140,
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
    }
});
