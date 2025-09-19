import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Size, styleSheets, Colors, CustomStyleSheet } from '../../constants/styleConfig';
import VnrText from '../VnrText/VnrText';
import DrawerServices from '../../utils/DrawerServices';
import { logout } from '../../assets/auth/authentication';
import { IconLogout, IconLanguage } from '../../constants/Icons';

export default class ItemFilterMain extends Component {
    constructor(porps) {
        super(porps);
    }

    router = (roouterName, params) => {
        DrawerServices.navigateForVersion(roouterName, params);
    };

    onPressItemMenu = () => {
        const { screenName, type, touchMenu, closeFilter } = this.props;
        if (type == 'E_SCREEN' && screenName) {
            typeof closeFilter == 'function' && closeFilter();
            this.router(screenName);
        } else if (type == 'E_LOGOUT') {
            typeof closeFilter == 'function' && closeFilter();
            logout();
        } else if (type == 'E_CHANGE_LANGUAGE' && touchMenu && typeof touchMenu == 'function') {
            typeof closeFilter == 'function' && closeFilter();
            touchMenu();
        }
    };

    render() {
        let viewIcon = <View />;
        const { title, type, urlIcon, screenName, index, lengthData } = this.props;
        const _ImgIcon = urlIcon;

        if (type == 'E_SCREEN' && screenName) {
            viewIcon = (
                <Image source={{ uri: _ImgIcon }} style={screenName === 'ProfileInfo' ? styles.iconForProfile : styles.iconStyle} />
            );
        } else if (type == 'E_LOGOUT') {
            viewIcon = <IconLogout size={Size.iconSize} color={Colors.black} />;
        } else if (type == 'E_CHANGE_LANGUAGE') {
            viewIcon = <IconLanguage size={Size.iconSize} color={Colors.primary} />;
        }
        return (
            <TouchableOpacity
                style={[styles.BackgroundIcon, lengthData - 1 == index && CustomStyleSheet.borderBottomWidth(0)]}
                onPress={() => {
                    this.onPressItemMenu();
                    // updateTopNavigate({ ...nav });
                }}
            >
                <View style={styles.icon}>{viewIcon}</View>
                <View style={styles.viewLable}>
                    <VnrText numberOfLines={1} i18nKey={title} style={styles.lableStyle} />
                </View>
            </TouchableOpacity>
        );
    }
}

const widthView = Size.deviceWidth;
const styles = StyleSheet.create({
    BackgroundIcon: {
        flexDirection: 'row',
        // height: 50,
        alignItems: 'center',
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        paddingVertical: 12
    },
    icon: {
        marginRight: styleSheets.m_20
    },
    iconStyle: {
        minWidth: 25,
        maxWidth: 50,
        width: widthView * 0.07,
        height: widthView * 0.07,
        resizeMode: 'contain'
    },
    iconForProfile: {
        width: 23,
        height: 23,
        resizeMode: 'cover',
        borderRadius: 23 / 2,
        backgroundColor: Colors.borderColor
    },
    lableStyle: {
        fontSize: Size.text
    },
    viewLable: {
        flex: 1
    }
});
