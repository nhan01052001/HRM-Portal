import React, { Component } from 'react';
import { View, StyleSheet, Image, Platform } from 'react-native';
import Color from 'color';
import { Colors, Size, styleSheets } from '../../constants/styleConfig';
import VnrText from '../VnrText/VnrText';
export default class ItemProfile extends Component {
    constructor(porps) {
        super(porps);
    }

    render() {
        const { title } = this.props;
        const pathIcon = require('../../assets/images/Main/NV.png');

        return Platform.OS == 'android' ? (
            <View style={styles.BackgroundIcon}>
                <View style={styles.viewButton}>
                    <View style={styles.icon}>
                        <Image source={pathIcon} style={styles.iconStyle} />
                    </View>
                    <View style={styles.viewLable}>
                        <VnrText numberOfLines={1} i18nKey={title} style={styles.lableStyle} />
                    </View>
                </View>
            </View>
        ) : (
            <View style={styles.viewButtonIOS}>
                <View style={styles.icon}>
                    <Image source={pathIcon} style={styles.iconStyle} />
                </View>
                <View style={styles.viewLable}>
                    <VnrText numberOfLines={1} i18nKey={title} style={styles.lableStyle} />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    viewButtonIOS: {
        height: 100,
        width: (Size.deviceWidth - 80) / 3,
        borderRadius: 12,
        marginHorizontal: 10,
        marginVertical: 10,
        padding: 2,
        backgroundColor: Colors.whiteOpacity70,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor:Colors.black,
        shadowOffset: {
            width: 0,
            height: 4
        },
        shadowOpacity: 0.32,
        shadowRadius: 5.46,

        elevation: 9
    },
    BackgroundIcon: {
        height: 100,
        width: (Size.deviceWidth - 80) / 3,
        backgroundColor: Colors.whitePure,
        borderRadius: 12,
        marginHorizontal: 10,
        marginVertical: 10,
        padding: 2
    },
    viewButton: {
        height: 96,
        width: (Size.deviceWidth - 80) / 3 - 4,
        backgroundColor: Color.rgb(255, 255, 255, 0.7),
        borderRadius: 12,
        justifyContent: 'center',
        alignItems: 'center'
    },
    icon: {
        marginBottom: styleSheets.m_5
    },
    iconStyle: {
        width: 55,
        height: 60,
        resizeMode: 'contain'
    },
    lableStyle: {
        fontSize: 11,
        fontWeight: '700'
    },

    viewLable: {
        alignItems: 'center',
        padding: 2,
        flexDirection: 'row'
    }
});
