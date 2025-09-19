
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, stylesVnrPicker, Size, styleSheets } from '../../../../constants/styleConfig';
import CheckBox from 'react-native-check-box';
import { IconRadioCheck, IconRadioUnCheck } from '../../../../constants/Icons';

export default class Item extends React.Component {
    constructor(props) {
        super(props);
    }


    shouldComponentUpdate(nextProps, nextState) {
        return nextProps.isToday !== this.props.isToday;
    }
    render() {
        const { item, isToday, changeMonth } = this.props;
        return (
            <TouchableOpacity
                style={styles.itemMonth}
                onPress={() => changeMonth(item.value)}>
                <View style={isToday ? styles.monthActive : styles.monthUnActive}>
                    <Text
                        style={[styleSheets.text, isToday ? styles.txtMonthActiveStyle : styles.txtMonthStyle]}>
                        {item.key}
                    </Text>
                </View>
            </TouchableOpacity>
        );
    }

}

const styles = StyleSheet.create({
    monthViewofYear: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
    },
    itemMonth: {
        width: (Size.deviceWidth - 50) / 4,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        // flex: 1,
    },
    monthActive: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        borderRadius: 35 / 2,
    },
    monthUnActive: {
        width: 35,
        height: 35,
        justifyContent: 'center',
        alignItems: 'center',
    },
    txtMonthStyle: {
        color: '#43515c',
    },
    txtMonthActiveStyle: {
        color: Colors.white,
    },
    viewMonth: {
        flexDirection: 'row',
        alignItems: 'center'
    }

});