import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Size, styleSheets, Colors } from '../../constants/styleConfig';
import VnrText from '../VnrText/VnrText';
import Vnr_Function from '../../utils/Vnr_Function';
import DrawerServices from '../../utils/DrawerServices';
import { logout } from '../../assets/auth/authentication';
import { IconLogout, IconLanguage } from '../../constants/Icons';
import HttpService from '../../utils/HttpService';
import { dataVnrStorage } from '../../assets/auth/authentication';
import { ToasterSevice } from '../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../components/VnrLoading/VnrLoadingPages';

export default class ItemMenu extends Component {
    constructor(porps) {
        super(porps);
    }

    router = (roouterName, params) => {
        //check đăng ký nghỉ việc thì không cho đk nữa
        if (roouterName === 'HreSubmitStopWorkingAddOrEdit') {
            DrawerServices.closeDrawer();
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Hre_GetData/GetMultiProfileActiveStopWorking', { text: '' }).then(data => {
                VnrLoadingSevices.hide();
                const { ProfileID } = dataVnrStorage.currentUser.info;
                if (data) {
                    let itemProfile = data.find(item => item.ID == ProfileID);

                    if (itemProfile) {
                        DrawerServices.navigateForVersion(roouterName, params);
                    } else {
                        ToasterSevice.showWarning('HRM_HR_Profile_Has_Register_StopWorking');
                    }
                } else {
                    DrawerServices.navigateForVersion(roouterName, params);
                }
            });
        }
        //màn hình khác
        else {
            DrawerServices.navigateForVersion(roouterName, params);
        }
    };

    onPressItemMenu = () => {
        const { screenName, type, touchMenu } = this.props;

        if (type == 'E_SCREEN' && screenName) {
            this.router(screenName);
        } else if (type == 'E_LOGOUT') {
            logout();
        } else if (type == 'E_CHANGE_LANGUAGE' && touchMenu && typeof touchMenu == 'function') {
            touchMenu();
        }
    };

    render() {
        let _colorTypeMessage = Colors.info,
            viewIcon = <View />;
        const { title, type, urlIcon, screenCreate, screenName, nav } = this.props;
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
                style={styles.BackgroundIcon}
                onPress={() => {
                    this.onPressItemMenu();
                }}
            >
                <View style={styles.icon}>{viewIcon}</View>
                <View style={styles.viewLable}>
                    <VnrText numberOfLines={1} i18nKey={title} style={styles.lableStyle} />
                </View>
                {!Vnr_Function.CheckIsNullOrEmpty(screenCreate) && (
                    <TouchableOpacity
                        style={[
                            styles.rightMessage,
                            {
                                backgroundColor: screenCreate.colorType ? screenCreate.colorType : _colorTypeMessage
                            }
                        ]}
                        onPress={() =>
                            screenCreate.screenName
                                ? this.router(screenCreate.screenName, { reload: () => null })
                                : null
                        }
                    >
                        <VnrText
                            numberOfLines={1}
                            i18nKey={screenCreate.title}
                            style={[styleSheets.text, styles.textMessage]}
                        />
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    BackgroundIcon: {
        flexDirection: 'row',
        height: 45,
        alignItems: 'center'
    },
    icon: {
        marginRight: styleSheets.m_20
    },
    iconStyle: {
        width: 23,
        height: 23,
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
    },
    rightMessage: {
        paddingHorizontal: 10,
        paddingVertical: 1,
        borderRadius: 10
    },
    textMessage: {
        color: Colors.white
    }
});
