/* eslint-disable no-useless-escape */
/* eslint-disable no-console */
import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, TextInput, ImageBackground } from 'react-native';
import VnrText from '../../components/VnrText/VnrText';
import HttpService from '../../utils/HttpService';
import { translate } from '../../i18n/translate';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    styleSheets,
    Colors,
    Size,
    styleSafeAreaView,
    styleButtonAddOrEdit,
    styleValid,
    CustomStyleSheet
} from '../../constants/styleConfig';
import { IconEye, IconEyeOff } from '../../constants/Icons';
import { IconPublish } from '../../constants/Icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ToasterSevice } from '../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../components/VnrLoading/VnrLoadingPages';
import DrawerServices from '../../utils/DrawerServices';
import ConfirmGoogleCaptcha from '../../components/GoogleCaptchaV2/ConfirmGoogleCaptcha';
import axios from 'axios';
import { dataVnrStorage, setdataVnrStorageFromDataUser } from '../../assets/auth/authentication';
import TouchIDService from '../../utils/TouchIDService';
const sourceBackgroud = '../../assets/images/BackgroundLogin.png';
export default class ChangePassword extends Component {
    constructor(porps) {
        super(porps);

        this.state = {
            passsWordOld: '',
            passsWordNew: '',
            passsWordReNew: '',
            isShowpasssWordOld: false,
            isShowpasssWordNew: false,
            isShowpasssWordReNew: false,
            isConfirmCaptcha: false,
            reCaptchaPublicKey: null
        };

        this.captchaForm = null;
    }

    router = roouterName => {
        const { navigation } = this.props;
        navigation.navigate(roouterName, { setStateValidApi: this.setStateValidApi });

        this.setState({ toggleMenu: false });
    };

    setEnabled = () => {
        const { params = {} } = this.props.navigation.state,
            { setupData } = typeof params == 'object' ? params : JSON.parse(params);

        (setupData && typeof setupData == 'function') && setupData();
    };

    changePasswordSuccess = () => {
        const { params = {} } = this.props.navigation.state,
            { IsFirstLogin, dataUser } = typeof params == 'object' ? params : JSON.parse(params);

        TouchIDService.isRemoveTouchID(this.setEnabled.bind(this));
        IsFirstLogin
            ? dataUser
                ? this.loginSuccess(dataUser)
                : DrawerServices.navigate('Login')
            : DrawerServices.goBack();
    };

    loginSuccess = async dataUser => {
        // đổi passWork lần đầu thành công
        dataUser.IsFirstLogin = false;
        await setdataVnrStorageFromDataUser({ ...dataUser });
        DrawerServices.navigate('Permission');
    };

    showHidePassword = () => {
        this.setState({ isShowHidePass: !this.state.isShowHidePass });
    };

    checkSubmitNewPass = () => {
        const { isConfirmCaptcha, passsWordOld, passsWordNew, passsWordReNew } = this.state;

        if (!passsWordOld || !passsWordNew || !passsWordReNew) {
            ToasterSevice.showWarning('HRM_IsFieldRequired', 3000);
            return true;
        }

        if (passsWordNew !== passsWordReNew) {
            ToasterSevice.showWarning('E_Mismatch', 3000);
            return true;
        }

        if (passsWordOld === passsWordNew) {
            ToasterSevice.showWarning('E_Messages', 3000);
            return true;
        }

        if (isConfirmCaptcha) {
            this.showCaptcha();
        } else {
            this.onSubmitNewPass();
        }
    };

    componentDidMount() {
        this.checkIsConfirmCaptcha();
    }

    checkIsConfirmCaptcha = () => {
        const dataBaody = {
            PolicyCaptcha: 'E_CHANGEPASSWORD'
        };

        VnrLoadingSevices.show();
        axios
            .post(HttpService.handelUrl('[URI_POR]/Portal/GetConfigPolicyCaptcha'), dataBaody, {
                headers: HttpService.generateHeader({}, null)
            })
            .then(resConfig => {
                if (resConfig) {
                    HttpService.Get('[URI_POR]/Portal/GetGoogleCaptchaKey').then(res => {
                        VnrLoadingSevices.hide();

                        if (Array.isArray(res) && res.length > 0) {
                            let publicKey = res[1].Value ? res[1].Value : null;
                            this.setState({
                                reCaptchaPublicKey: publicKey,
                                isConfirmCaptcha: true
                            });
                        }
                    });
                } else {
                    VnrLoadingSevices.hide();
                }
            })
            .catch(error => {
                VnrLoadingSevices.hide();
                this.setState({
                    reCaptchaPublicKey: null,
                    isConfirmCaptcha: false
                });
                console.log(error, 'error function ');
            });
    };

    onPickCaptcha = event => {
        let data = null;
        try {
            data = JSON.parse(event.nativeEvent.data);
        } catch (error) {
            data = event.nativeEvent.data;
        }

        if (data) {
            if (['cancel'].includes(data)) {
                this.captchaForm.hide();
                return;
            } else if (['error', 'expired'].includes(data)) {
                console.log(data);
                return;
            } else {
                setTimeout(() => {
                    this.captchaForm.hide();
                    if (data) {
                        this.onSubmitNewPass();
                    }
                }, 1500);
            }
        }
    };

    showCaptcha = () => {
        this.captchaForm !== null && this.captchaForm.show();
    };

    onSubmitNewPass = () => {
        const { passsWordOld, passsWordNew, passsWordReNew } = this.state;

        const data = {
            OldPassword: passsWordOld,
            NewPassword: passsWordNew,
            ReNewPassword: passsWordReNew
        };

        VnrLoadingSevices.show();

        HttpService.Post('[URI_SYS]/Sys_GetData/ChangePasswordSys_User', data).then((res) => {
            console.log(typeof res, res);
            VnrLoadingSevices.hide();

            if (res == 'E_Success') {
                ToasterSevice.showSuccess('ChangePassword_Success', 3000);
                this.changePasswordSuccess();
                // ChangePassword_Success
            } else {
                ToasterSevice.showError(res, 3000);
            }
        });
    };

    render() {
        const {
            passsWordOld,
            passsWordNew,
            passsWordReNew,
            isShowpasssWordOld,
            isShowpasssWordNew,
            isShowpasssWordReNew,
            isConfirmCaptcha,
            reCaptchaPublicKey
        } = this.state;

        const { apiConfig } = dataVnrStorage;

        let domainCaptcha = null;
        if (apiConfig && apiConfig.uriPor) {
            let matches = apiConfig.uriPor.match(/^(?:https?:)?(?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im);
            domainCaptcha = matches && matches[0] ? matches[0] : null;
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <ImageBackground source={require(sourceBackgroud)} style={styles.BackgroundLogin}>
                    <KeyboardAwareScrollView
                        contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                        keyboardShouldPersistTaps={'handled'}
                    >
                        <View style={[styleSheets.container, CustomStyleSheet.alignItems('center')]}>
                            {/* {PassWordOld - Pass cũ} */}
                            <View style={styles.fromInput}>
                                <View style={styles.formControl}>
                                    <View style={styles.control}>
                                        <TextInput
                                            autoCapitalize={'none'}
                                            secureTextEntry={!isShowpasssWordOld}
                                            //autoFocus={true}
                                            placeholder={translate('HRM_System_User_OldPassword')}
                                            style={[styleSheets.text, styles.inputStyle]}
                                            value={passsWordOld}
                                            onChangeText={text => this.setState({ passsWordOld: text })}
                                            onSubmitEditing={() => this.PassWordNew && this.PassWordNew.focus()}
                                            returnKeyType={'next'}
                                        />
                                        {passsWordOld != '' ? (
                                            <TouchableOpacity
                                                style={styles.leftIcon}
                                                onPress={() =>
                                                    this.setState({ isShowpasssWordOld: !isShowpasssWordOld })
                                                }
                                            >
                                                {isShowpasssWordOld ? (
                                                    <IconEyeOff size={Size.iconSize - 3} color={Colors.grey} />
                                                ) : (
                                                    <IconEye size={Size.iconSize - 3} color={Colors.grey} />
                                                )}
                                            </TouchableOpacity>
                                        ) : (
                                            <View style={styles.leftIconError}>
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            </View>
                                        )}
                                    </View>
                                </View>

                                {/* {PassWordOld - Pass mới} */}
                                <View style={styles.formControl}>
                                    <View style={styles.control}>
                                        <TextInput
                                            ref={resInput => (this.PassWordNew = resInput)}
                                            secureTextEntry={!isShowpasssWordNew}
                                            autoCapitalize={'none'}
                                            placeholder={translate('HRM_System_User_NewPassword')}
                                            style={[styleSheets.text, styles.inputStyle]}
                                            value={passsWordNew}
                                            onChangeText={text => this.setState({ passsWordNew: text })}
                                            onSubmitEditing={() => this.PassWordRenew && this.PassWordRenew.focus()}
                                            returnKeyType={'next'}
                                        />
                                        {passsWordNew != '' ? (
                                            <TouchableOpacity
                                                style={styles.leftIcon}
                                                onPress={() =>
                                                    this.setState({ isShowpasssWordNew: !isShowpasssWordNew })
                                                }
                                            >
                                                {isShowpasssWordNew ? (
                                                    <IconEyeOff size={Size.iconSize - 3} color={Colors.grey} />
                                                ) : (
                                                    <IconEye size={Size.iconSize - 3} color={Colors.grey} />
                                                )}
                                            </TouchableOpacity>
                                        ) : (
                                            <View style={styles.leftIconError}>
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            </View>
                                        )}
                                    </View>
                                </View>

                                {/* {PassWordOld - nhập lại passwork} */}
                                <View style={styles.formControl}>
                                    <View style={styles.control}>
                                        <TextInput
                                            ref={resInput => (this.PassWordRenew = resInput)}
                                            secureTextEntry={!isShowpasssWordReNew}
                                            autoCapitalize={'none'}
                                            placeholder={translate('HRM_System_User_ReNewPassword')}
                                            style={[styleSheets.text, styles.inputStyle]}
                                            value={passsWordReNew}
                                            onSubmitEditing={() => this.checkSubmitNewPass()}
                                            onChangeText={text => this.setState({ passsWordReNew: text })}
                                            returnKeyType={'done'}
                                        />
                                        {passsWordReNew != '' ? (
                                            <TouchableOpacity
                                                style={styles.leftIcon}
                                                onPress={() =>
                                                    this.setState({ isShowpasssWordReNew: !isShowpasssWordReNew })
                                                }
                                            >
                                                {isShowpasssWordReNew ? (
                                                    <IconEyeOff size={Size.iconSize - 3} color={Colors.grey} />
                                                ) : (
                                                    <IconEye size={Size.iconSize - 3} color={Colors.grey} />
                                                )}
                                            </TouchableOpacity>
                                        ) : (
                                            <View style={styles.leftIconError}>
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            </View>
                                        )}
                                    </View>
                                </View>
                            </View>
                        </View>

                        {isConfirmCaptcha && (
                            <ConfirmGoogleCaptcha
                                ref={_ref => (this.captchaForm = _ref)}
                                siteKey={reCaptchaPublicKey}
                                baseUrl={domainCaptcha}
                                languageCode="en"
                                onMessage={this.onPickCaptcha}
                            />
                        )}
                    </KeyboardAwareScrollView>
                    {/* bottom button close, confirm */}
                    <View style={styleButtonAddOrEdit.groupButton}>
                        <TouchableOpacity
                            onPress={() => this.checkSubmitNewPass()}
                            style={styleButtonAddOrEdit.groupButton__button_save}
                        >
                            <IconPublish size={Size.iconSize} color={Colors.white} />
                            <VnrText
                                style={[styleSheets.lable, styleButtonAddOrEdit.groupButton__text]}
                                i18nKey={'HRM_System_User_ChangePass'}
                            />
                        </TouchableOpacity>
                    </View>
                </ImageBackground>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    BackgroundLogin: {
        //flex: 1,
        width: Size.deviceWidth,
        height: '100%',
        resizeMode: 'cover',
        justifyContent: 'center'
    },

    fromInput: {
        // height: Size.deviceheight,
        width: Size.deviceWidth - 70,
        alignItems: 'center',
        paddingTop: 50
        // backgroundColor: 'red',
    },

    formControl: {
        maxWidth: 355,
        // borderBottomColor: Colors.primary,
        // borderBottomWidth: 0.5,
        width: '100%', //Size.deviceWidth - 70,
        marginBottom: 25,
        borderColor: Colors.greyPrimary,
        borderWidth: 0.5,
        borderRadius: 6,
        paddingHorizontal: Size.defineSpace
    },
    control: {
        flexDirection: 'row',
        height: 45,
        ///width: Size.deviceWidth - 70,
        maxWidth: 355
    },
    inputStyle: {
        //width: Size.deviceWidth - 70 - 40,
        flex: 1
        ///maxWidth: 265,
        //backgroundColor:'red'
    },

    leftIcon: {
        width: 30,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },
    leftIconError: {
        width: 30,
        height: 45,
        justifyContent: 'center',
        alignItems: 'flex-end'
    }
});
