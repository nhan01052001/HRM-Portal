import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Platform, Animated, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import languageReducer from '../../redux/i18n';
import VnrText from '../../components/VnrText/VnrText';
import Vnr_Function from '../../utils/Vnr_Function';
import HttpService from '../../utils/HttpService';
import { translate } from '../../i18n/translate';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    dataVnrStorage,
    getConfigSSO,
    setdataVnrStorage,
    setdataVnrStorageFromDataUser
} from '../../assets/auth/authentication';
import { styleSheets, Colors, Size, styleSafeAreaView } from '../../constants/styleConfig';
import { IconEye, IconEyeOff, IconCancel, IconQrcode, IconAppStore, IconAndroid } from '../../constants/Icons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ToasterSevice } from '../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../components/VnrLoading/VnrLoadingPages';
import { Easing } from 'react-native-reanimated';
import VnrLoading from '../../components/VnrLoading/VnrLoading';
import TouchID from 'react-native-touch-id';
import DrawerServices from '../../utils/DrawerServices';
import { EnumUser } from '../../assets/constant';
import { SInfoService } from '../../factories/LocalData';
import { AppState } from 'react-native';
import ConfirmGoogleCaptcha from '../../components/GoogleCaptchaV2/ConfirmGoogleCaptcha';
import axios from 'axios';
import ModalAuthorize from '../../components/ModalAuthorize/ModalAuthorize';
import { authorize } from 'react-native-app-auth';
import { UpdateVersionApi } from '../../components/modalUpdateVersion/ModalUpdateVersion';
import CodePush from 'react-native-code-push';

const sourceLogo = '../../assets/images/AvatarVnR.png';
const sourceTouchID = '../../assets/images/TouchID.png';
const sourceFaceID = '../../assets/images/FaceID.png';

// const configs = {
//   identityserver: {
//     issuer: 'https://hrm10.vnresource.net:19005',
//     clientId: 'hrm10_portal_app',
//     redirectUrl: 'portal4hrm:/Home',
//     clientSecret: 'secret',
//     scopes: ["openid", "profile", "api", 'offline_access'],
//     responseTypes: ['code']
//   },

//   // identityserver: {
//   //   issuer: 'https://hrm.vnresource.net:4111',
//   //   clientId: 'hrm10_portal',
//   //   redirectUrl: 'portal4hrm:/Home',
//   //   clientSecret: 'secret',
//   //   scopes: ["openid", "profile", "api", 'offline_access'],
//   //   responseTypes: ['code']
//   // },

// };

class LoginScene extends Component {
    constructor(porps) {
        super(porps);

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            if (dataVnrStorage.apiConfig) {
                this.setStateValidApi(true);
                this.checkIsConfirmCaptcha();
                // this.checkConfigLoginSSO();
            }
        });

        this.captchaForm = null;
        this.isRunConfigSSo = false;

        this.state = {
            userName: '',
            passsWord: '',
            toggleMenu: false,
            isvisibleModalUpload: false,
            isvisibleModalLanguage: false,
            txtError: '',
            txtMessage: '',
            defaultLanguage: '',
            validApi: false,
            isLoading: false,
            isShowHidePass: true,
            fadeInInput: new Animated.Value(0),
            xValue1: new Animated.Value(0),
            xValue2: new Animated.Value(0),
            xValue3: new Animated.Value(0),
            opactyAnimated: new Animated.Value(0),
            aniIconSize: new Animated.Value(30),
            typeID: '',
            isVisibleBioIcon: true,
            colorTextLangVN: '',
            colorTextLangEN: '',
            colorTextLangCN: '',
            appState: AppState.currentState,
            isConfirmCaptcha: false,
            reCaptchaPublicKey: null,
            listProviderSso: {
                isShowOnlySSO: true
            },
            thisVersion: '',
            isLoadingCheckVer: false
        };
    }

    router = (roouterName) => {
        const { navigation } = this.props;
        navigation.navigate(roouterName, { setStateValidApi: this.setStateValidApi });
        this.setState({ toggleMenu: false });
    };

    setStateValidApi = (val) => {
        this.setState({ validApi: val });
    };

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'background') {
            // console.log("App is in Background Mode.")
        }
        if (nextAppState === 'active') {
            this.checkTouchOrFace();
        }
    };

    _getCurrentRouteName(navState) {
        if (Object.prototype.hasOwnProperty.call(navState, 'index')) {
            this._getCurrentRouteName(navState.routes[navState.index]);
        } else {
            DrawerServices.setHistoryScreen(navState.routeName);
        }
    }

    setLanguage = async (language) => {
        dataVnrStorage.languageApp = language;
        if (language === 'VN') {
            this.setState({
                colorTextLangVN: Colors.primary,
                colorTextLangEN: Colors.black,
                colorTextLangCN: Colors.black
            });
        } else if (language === 'EN') {
            this.setState({
                colorTextLangEN: Colors.primary,
                colorTextLangVN: Colors.black,
                colorTextLangCN: Colors.black
            });
        } else if (language === 'CN') {
            this.setState({
                colorTextLangCN: Colors.primary,
                colorTextLangVN: Colors.black,
                colorTextLangEN: Colors.black
            });
        }
        await setdataVnrStorage(dataVnrStorage);
        this.props.setLanguage(language);
        this.setStateValidApi(true);
    };

    loginSuccess = async (dataUser) => {
        const { navigation } = this.props;
        await setdataVnrStorageFromDataUser({ ...dataUser });
        this.setState({ isLoading: false });
        if (dataUser.IsFirstLogin || dataUser.LoginErrorStatusCode == 'E_MustChangePassword') {
            if (dataUser.LoginErrorStatusMessage) ToasterSevice.showError(dataUser.LoginErrorStatusMessage, 6000);

            dataVnrStorage.isNewLayoutV3
                ? DrawerServices.navigate('UpdatePasswordV3', {
                    IsFirstLogin: true,
                    dataUser: dataUser
                })
                : DrawerServices.navigate('UpdatePassword', {
                    IsFirstLogin: true,
                    dataUser: dataUser
                });
        } else {
            navigation.navigate('Permission', { isFromLogin: true });
        }
    };

    checkLogin = () => {
        const { isConfirmCaptcha } = this.state;
        if (isConfirmCaptcha) {
            this.showCaptcha();
            // if (captchaCode !== null)
            //   this.login();
            // else
            //   ToasterSevice.showWarning('Sys_PrivacyPolicyConfig_IsCaptcha');
        } else {
            this.login();
        }
    };

    checkIsConfirmCaptcha = () => {
        if (dataVnrStorage.apiConfig == null) {
            return;
        }

        const dataBaody = {
            PolicyCaptcha: 'E_LOGIN'
        };
        VnrLoadingSevices.show();
        axios
            .post(HttpService.handelUrl('[URI_POR]/Portal/GetConfigPolicyCaptcha'), dataBaody, {
                headers: HttpService.generateHeader({}, null)
            })
            .then((resConfig) => {
                if (resConfig) {
                    HttpService.Get('[URI_POR]/Portal/GetGoogleCaptchaKey').then((res) => {
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
            .catch(() => {
                VnrLoadingSevices.hide();
                this.setState({
                    reCaptchaPublicKey: null,
                    isConfirmCaptcha: false
                });
            });
    };

    // checkConfigLoginSSO = async () => {
    //     if (dataVnrStorage.apiConfig == null) {
    //         return;
    //     }

    //     if (Platform.OS == 'android') {
    //         const configIdentity = await getConfigSSO();
    //         if (configIdentity.issuer) {
    //             // prefetchConfiguration({
    //             //   warmAndPrefetchChrome: true,
    //             //   ...configIdentity
    //             // });
    //         }
    //     }

    //     const { listProviderSso } = this.state;
    //     if (
    //         dataVnrStorage.providerSso == null ||
    //         (dataVnrStorage.providerSso != null && dataVnrStorage.providerSso.data == null)
    //     ) {
    //         VnrLoadingSevices.show();
    //     }

    //     if (!this.isRunConfigSSo) {
    //         this.isRunConfigSSo = true;
    //         axios
    //             .get(HttpService.handelUrl('[URI_POR]/Portal/GetListAuthProvider'))
    //             .then(async (resConfigLink) => {
    //                 this.isRunConfigSSo = false;
    //                 // console.log(resConfigLink, 'resConfigLink')
    //                 VnrLoadingSevices.hide();
    //                 if (
    //                     resConfigLink.Use &&
    //                     Array.isArray(resConfigLink.ListProvider) &&
    //                     resConfigLink.ListProvider.length > 0
    //                 ) {
    //                     axios
    //                         .get(HttpService.handelUrl('[URI_POR]/Portal/GetConfigSSO'))
    //                         .then((isShowOnlySSO) => {
    //                             let _listProviderSso = {
    //                                 ...listProviderSso,
    //                                 data: resConfigLink.ListProvider,
    //                                 isShowOnlySSO: isShowOnlySSO
    //                             };

    //                             this.setState({
    //                                 listProviderSso: _listProviderSso
    //                             });

    //                             dataVnrStorage.providerSso = _listProviderSso;
    //                             setdataVnrStorage(dataVnrStorage);
    //                         })
    //                         .catch(() => {
    //                             let _listProviderSso = {
    //                                 ...listProviderSso,
    //                                 data: resConfigLink.ListProvider,
    //                                 isShowOnlySSO: false
    //                             };

    //                             this.setState({
    //                                 listProviderSso: _listProviderSso
    //                             });

    //                             dataVnrStorage.providerSso = _listProviderSso;
    //                             setdataVnrStorage(dataVnrStorage);
    //                         });
    //                 } else {
    //                     let _listProviderSso = {
    //                         ...listProviderSso,
    //                         data: null,
    //                         isShowOnlySSO: false
    //                     };

    //                     this.setState({
    //                         listProviderSso: _listProviderSso
    //                     });

    //                     dataVnrStorage.providerSso = _listProviderSso;
    //                     setdataVnrStorage(dataVnrStorage);
    //                 }
    //             })
    //             .catch(() => {
    //                 VnrLoadingSevices.hide();
    //                 this.isRunConfigSSo = false;
    //                 let _listProviderSso = {
    //                     ...listProviderSso,
    //                     data: null,
    //                     isShowOnlySSO: false
    //                 };

    //                 this.setState({
    //                     listProviderSso: _listProviderSso
    //                 });

    //                 dataVnrStorage.providerSso = _listProviderSso;
    //                 setdataVnrStorage(dataVnrStorage);
    //             });
    //     }
    // };

    messageLoginSSO = (dataUser) => {
        if (dataUser) {
            this.refAuthorize && this.refAuthorize.hide();
            const { language } = this.props;
            if (dataUser.Language == null) {
                dataUser.Language = language;
            }

            dataUser = {
                ...dataUser,
                isLoginSSO: false
            };
            this.loginSuccess(dataUser);
        }
    };

    onPickCaptcha = (event) => {
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
                return;
            } else {
                setTimeout(() => {
                    this.captchaForm.hide();
                    if (data) {
                        this.login();
                    }
                }, 1500);
            }
        }
    };

    showCaptcha = () => {
        this.captchaForm !== null && this.captchaForm.show();
    };

    login = () => {
        const { userName, passsWord, isLoading } = this.state;
        const { language } = this.props;
        const { deviceToken, apiConfig, customerID } = dataVnrStorage;

        Keyboard.dismiss();
        if (isLoading) return;

        if (apiConfig == null) {
            ToasterSevice.showError('PleaseUploadFileConfig', 3000);
            return true;
        }

        const _aboutDevice = {
            deviceID: DeviceInfo.getUniqueId(),
            plasform: Platform.OS,
            version: DeviceInfo.getSystemVersion(),
            brand: DeviceInfo.getBrand()
        };

        const data = {
            AboutDevice: JSON.stringify(_aboutDevice),
            DeviceId: _aboutDevice.deviceID,
            CusID: customerID,
            DeviceToken: deviceToken,

            UserName: userName,
            Password: passsWord,

            Language: language,
            IsPortalApp: true
        };

        this.setState({ isLoading: true, txtError: '' });

        HttpService.Post('[URI_HR]/Por_GetData/LoginAppMobile', data)
            .then((res) => {
                try {
                    if (res && res.LoginStatus) {
                        this.loginSuccess(res);
                    } else {
                        this.setState({ txtError: res.LoginErrorStatusMessage, isLoading: false });
                    }
                } catch (error) {
                    this.setState({ txtError: translate('HRM_Common_SendRequest_Error'), isLoading: false });
                }
            })
            .catch(() => {
                this.setState({ txtError: translate('HRM_Common_SendRequest_Error'), isLoading: false });
            });
    };

    async handleTouchID() {
        const { isLoading, typeID } = this.state;
        const { language } = this.props;
        const { deviceToken, apiConfig, customerID } = dataVnrStorage;

        const dataStorage = await SInfoService.getItem(EnumUser.DATASAVEID);

        const findUser = dataStorage?.find((x) => x.touchID);
        Keyboard.dismiss();

        if (isLoading) return;

        if (apiConfig == null) {
            ToasterSevice.showError('PleaseUploadFileConfig', 3000);
            return true;
        }

        const _aboutDevice = {
            deviceID: DeviceInfo.getUniqueId(),
            plasform: Platform.OS,
            version: DeviceInfo.getSystemVersion(),
            brand: DeviceInfo.getBrand()
        };

        const data = {
            AboutDevice: JSON.stringify(_aboutDevice),
            DeviceId: _aboutDevice.deviceID,
            CusID: customerID,
            DeviceToken: deviceToken,
            UserName: findUser?.username,
            Password: findUser?.password,
            Language: language,
            IsPortalApp: true
        };

        let message;

        const configs = {
            title: translate('HRM_Authentication_Required'), // Android
            mageColor: Colors.primary, // Android
            imageErrorColor: Colors.red, // Android
            sensorDescription: translate('HRM_Login_TouchID'), // Android
            sensorErrorDescription: translate('HRM_Login_TouchID_Failed'), // Android
            cancelText: translate('HRM_Login_TouchID_Cancel'), // Android
            fallbackLabel: '', // iOS (if empty, then label is hidden)
            unifiedErrors: false, // use unified error messages (default false)
            passcodeFallback: false // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
        };
        const type = await TouchID.isSupported();
        switch (type) {
            case 'TouchID':
                message = '';
                break;
            case 'FaceID':
                message = '';
                break;
        }

        if (type) {
            if (!findUser) {
                if (typeID === 'TouchID') {
                    ToasterSevice.showError('HRM_Login_Error_TouchID', 4000);
                }
                if (typeID === 'FaceID') {
                    ToasterSevice.showError('HRM_Login_Error_FaceID', 4000);
                }
            } else {
                TouchID.authenticate(message, configs)
                    .then(() => {
                        this.setState({ isLoading: true, txtError: '' });

                        HttpService.Post('[URI_HR]/Por_GetData/LoginAppMobile', data)
                            .then((res) => {
                                try {
                                    if (res && res.LoginStatus) {
                                        this.loginSuccess(res);
                                    } else {
                                        if (typeID === 'TouchID') {
                                            ToasterSevice.showError('HRM_Login_Error_TouchID', 4000);
                                        }
                                        if (typeID === 'FaceID') {
                                            ToasterSevice.showError('HRM_Login_Error_FaceID', 4000);
                                        }
                                        this.setState({ txtError: '', isLoading: false });
                                    }
                                } catch (error) {
                                    this.setState({
                                        txtError: translate('HRM_Common_SendRequest_Error'),
                                        isLoading: false
                                    });
                                }
                            })
                            .catch(() => {
                                this.setState({
                                    txtError: translate('HRM_Common_SendRequest_Error'),
                                    isLoading: false
                                });
                            });
                    })
                    .catch(() => {
                        ToasterSevice.showError('HRM_Authentication_Failed', 7000);
                    });
            }
        }
    }

    handleAuthorizeApp = async () => {
        try {
            const { deviceToken } = dataVnrStorage;
            const { language } = this.props;

            VnrLoadingSevices.show();
            const configIdentity = await getConfigSSO();

            if (configIdentity.issuer == null) {
                ToasterSevice.showError('configIdentity issuer is null');
                VnrLoadingSevices.hide();
                return;
            }

            const newAuthState = await authorize(configIdentity);

            VnrLoadingSevices.hide();
            if (newAuthState.accessToken && newAuthState.refreshToken) {
                const dataJWT = Vnr_Function.jwtDecode(newAuthState.accessToken);

                let dataUser = {
                    // ...newAuthState,
                    ProfileID: dataJWT.hrm_profile_id,
                    UserID: dataJWT.hrm_user_id,
                    UserName: dataJWT.hrm_username,
                    // Language: dataJWT.hrm_image_path,
                    FullName: dataJWT.hrm_fullname,

                    Language: dataJWT.hrm_lang_code ? dataJWT.hrm_lang_code : language,
                    Email: dataJWT.hrm_email,
                    ImagePath: dataJWT.hrm_image_path,

                    TokenPortalApp: newAuthState.accessToken,
                    refreshToken: newAuthState.refreshToken,
                    idToken: newAuthState.idToken,
                    // Token Firebase
                    DeviceToken: deviceToken,

                    // có có api hỗ trợ
                    // IsChat: false,
                    // IsGroupChat: false,
                    // uriNews: null,
                    // chatEndpointSocket: null,
                    // serviceEndpointApi: null,
                    // chatEndpointApi: null,
                    // surveyEndpointApi: null,
                    // uriNewsWordPress: null,
                    isLoginSSO: true,
                    isAllowLogin: dataJWT?.hrm_type_user && dataJWT?.hrm_type_user.includes('E_Portal')
                };

                VnrLoadingSevices.show();
                HttpService.Post(
                    '[URI_HR]/Por_GetData/UpdateDeviceAndGetConfig',
                    { ...dataUser },
                    {
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${dataUser.TokenPortalApp}`,
                            UserID: dataUser.UserID
                        }
                    }
                )
                    .then((res) => {
                        VnrLoadingSevices.hide();
                        dataUser = { ...res, ...dataUser };
                        this.loginSuccess(dataUser);
                    })
                    .catch(() => {
                        this.setState({ txtError: translate('HRM_Common_SendRequest_Error'), isLoading: false });
                    });
            }
        } catch (error) {
            if (typeof error === 'string') ToasterSevice.showWarning(error, 5000);
            VnrLoadingSevices.hide();
        }
    };

    toggleMenu = () => {
        if (this.state.isLoading) return;
        this.setState({ toggleMenu: !this.state.toggleMenu });
    };

    showModalUpload = () => {
        this.setState({ isvisibleModalUpload: true, toggleMenu: false });
    };

    hideModalUpload = () => {
        this.setState({ isvisibleModalUpload: false });
    };

    showModalLanguage = () => {
        this.setState({ isvisibleModalLanguage: true, toggleMenu: false });
    };

    hideModalLanguage = () => {
        this.setState({ isvisibleModalLanguage: false });
    };

    componentDidMount() {
        // eslint-disable-next-line no-console
        console.disableYellowBox = true;
        if (dataVnrStorage.languageApp != null) {
            this.setState({ defaultLanguage: dataVnrStorage.languageApp }, () =>
                this.setLanguage(this.state.defaultLanguage)
            );
        }
        //this.checkConfigLoginSSO();
        // this.checkIsConfirmCaptcha();

        this.checkTouchOrFace();
        AppState.addEventListener('change', this._handleAppStateChange);
    }

    checkTouchOrFace = () => {
        const optionalConfigObject = {
            unifiedErrors: false,
            passcodeFallback: true
        };
        TouchID.isSupported(optionalConfigObject)
            .then((biometryType) => {
                //'FaceID' | 'TouchID'
                this.setState({
                    typeID: biometryType === 'FaceID' ? 'FaceID' : 'TouchID',
                    isVisibleBioIcon: true
                });
            })
            .catch(() => {
                this.setState({
                    isVisibleBioIcon: false
                });
            });
    };

    showHidePassword = () => {
        this.setState({ isShowHidePass: !this.state.isShowHidePass });
    };

    increaseOpacty = () => {
        Animated.timing(this.state.opactyAnimated, {
            toValue: 1,
            duration: 1500
        }).start();
    };

    fadeInInput = () => {
        const { fadeInInput } = this.state;
        Animated.timing(fadeInInput, {
            toValue: 1,
            duration: 1000
        }).start();
    };

    moveAnimation = () => {
        Animated.sequence([
            Animated.timing(this.state.xValue1, {
                toValue: (Size.deviceWidth - (Size.deviceWidth - 70)) / 2,
                duration: 1000,
                easing: Easing.linear
            }),
            Animated.timing(this.state.xValue2, {
                toValue: (Size.deviceWidth - (Size.deviceWidth - 70)) / 2,
                duration: 1000,
                easing: Easing.linear
            }),
            Animated.timing(this.state.xValue3, {
                toValue: (Size.deviceWidth - (Size.deviceWidth - 70)) / 2,
                duration: 3000,
                easing: Easing.linear
            })
        ]).start();
    };

    startAnimation = () => {
        Animated.parallel([this.fadeInInput(), this.increaseOpacty()]).start();
    };

    onFocusInputAnimatedIcon = () => {
        Animated.timing(this.state.aniIconSize, {
            toValue: 0,
            duration: 500
        }).start();
    };

    checkVersionCodePush = () => {
        const { thisVersion } = this.state;
        if (thisVersion == '') {
            // gọi hàm cập nhật version
            UpdateVersionApi.checkVersion(true);
            CodePush.getUpdateMetadata().then((metadata) => {
                this.setState({
                    thisVersion: metadata.label,
                    isLoadingCheckVer: false
                });
            });
        } else {
            this.setState({
                thisVersion: '',
                isLoadingCheckVer: false
            });
        }
    };

    render() {
        // test animation
        const {
            userName,
            passsWord,
            toggleMenu,
            txtError,
            txtMessage,
            validApi,
            isShowHidePass,
            isLoading,
            typeID,
            isLoadingBio,
            isVisibleBioIcon,
            colorTextLangVN,
            colorTextLangEN,
            isConfirmCaptcha,
            reCaptchaPublicKey,
            listProviderSso,
            thisVersion
        } = this.state;

        const { language } = this.props;
        const { apiConfig } = dataVnrStorage;

        let viewError = <View />;
        let viewMessage = <View />;
        if (!Vnr_Function.CheckIsNullOrEmpty(txtError)) {
            viewError = (
                <View style={styles.formError}>
                    <View style={styleSheets.lable}>
                        <Text style={[styleSheets.text, styles.textError]}>{txtError}</Text>
                    </View>
                </View>
            );
        } else if (apiConfig == null) {
            viewError = (
                <View style={styles.formError}>
                    <View style={styleSheets.lable}>
                        <Text style={[styleSheets.text, styles.textError]}>{translate('PleaseUploadFileConfig')}</Text>
                    </View>
                </View>
            );
        }
        if (!Vnr_Function.CheckIsNullOrEmpty(txtMessage)) {
            viewMessage = (
                <View style={styles.formError}>
                    <View style={styleSheets.lable}>
                        <Text style={[styleSheets.text]}>{txtMessage}</Text>
                    </View>
                </View>
            );
        }

        let viewBioIcon = <View />;
        if (typeID === 'TouchID') {
            viewBioIcon = <Image source={require(sourceTouchID)} style={styles.sizeLogoBio} />;
        }
        if (typeID === 'FaceID') {
            viewBioIcon = <Image source={require(sourceFaceID)} style={styles.sizeLogoBio} />;
        }

        let domainCaptcha = null;
        if (apiConfig && apiConfig.uriPor) {
            // eslint-disable-next-line no-useless-escape
            let matches = apiConfig.uriPor.match(/^(?:https?:)?(?:\/\/)?(?:[^@\n]+@)?(?:www\.)?([^:\/\n]+)/im);
            domainCaptcha = matches && matches[0] ? matches[0] : null;
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <KeyboardAwareScrollView
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={styles.styScrollView}
                    keyboardShouldPersistTaps={'handled'}
                    extraScrollHeight={50} // khoan cach
                >
                    <TouchableOpacity
                        onPress={() => {
                            Keyboard.dismiss();
                            toggleMenu && this.toggleMenu();
                        }}
                        style={styles.styViewLoginTop}
                        activeOpacity={1}
                    >
                        <View style={styles.headerLogin}>
                            {apiConfig && apiConfig.uriPor ? (
                                <Image
                                    source={{ uri: apiConfig.uriPor + '/Content/images/icons/LogoApp.png' }}
                                    style={[styles.sizeLogo, { width: Size.deviceWidth * 0.27 }]}
                                    resizeMode={'contain'}
                                />
                            ) : (
                                <Image source={require(sourceLogo)} style={styles.sizeLogo} resizeMode={'contain'} />
                            )}
                        </View>

                        {!listProviderSso.isShowOnlySSO && (
                            <Animated.View style={[styles.fromInput]}>
                                {viewError}
                                {viewMessage}

                                <View style={[styles.formControl]}>
                                    <View style={[styles.control]}>
                                        <TextInput
                                            ref={(input) => {
                                                this.autoFocus = input;
                                            }}
                                            autoCapitalize={'none'}
                                            editable={apiConfig == null || isLoading ? false : true}
                                            //autoFocus={apiConfig == null ? false : true}
                                            onFocus={() => {
                                                toggleMenu == true && this.toggleMenu();
                                                this.onFocusInputAnimatedIcon();
                                            }}
                                            placeholder={translate('HRM_System_User_LoginName')}
                                            style={[styleSheets.text, styles.inputStyle]}
                                            value={userName}
                                            onChangeText={(text) => this.setState({ userName: text })}
                                            onSubmitEditing={() => this.PassWord && this.PassWord.focus()}
                                            returnKeyType={'next'}
                                        />
                                        {userName != '' && (
                                            <TouchableOpacity
                                                style={styles.leftIcon}
                                                onPress={() => this.setState({ userName: '' })}
                                            >
                                                <IconCancel size={Size.iconSize - 3} color={Colors.grey} />
                                            </TouchableOpacity>
                                        )}
                                    </View>
                                </View>

                                <View style={[styles.formControl, styles.formControlPadding]}>
                                    <View style={styles.control}>
                                        <TextInput
                                            autoCapitalize={'none'}
                                            editable={apiConfig == null || isLoading ? false : true}
                                            ref={(resInput) => (this.PassWord = resInput)}
                                            onFocus={() => {
                                                toggleMenu == true && this.toggleMenu();
                                            }}
                                            placeholder={translate('HRM_System_User_Password')}
                                            style={[styleSheets.text, styles.inputStyle]}
                                            value={passsWord}
                                            onChangeText={(text) => this.setState({ passsWord: text })}
                                            secureTextEntry={isShowHidePass}
                                            onSubmitEditing={() => this.checkLogin()}
                                            returnKeyType={'done'}
                                        />
                                        {
                                            <TouchableOpacity
                                                style={styles.leftIcon}
                                                onPress={() => this.showHidePassword()}
                                            >
                                                {isShowHidePass ? (
                                                    <IconEyeOff size={Size.iconSize - 3} color={Colors.grey} />
                                                ) : (
                                                    <IconEye size={Size.iconSize - 3} color={Colors.grey} />
                                                )}
                                            </TouchableOpacity>
                                        }
                                    </View>
                                </View>

                                <View style={styles.styViewForgotPass}>
                                    <TouchableOpacity onPress={() => DrawerServices.navigate('ForgotPassword')}>
                                        <VnrText
                                            i18nKey={'HRM_System_ForgotPassword'}
                                            style={styles.styTextForgotPass}
                                        />
                                    </TouchableOpacity>
                                </View>

                                <View style={styles.styViewValid}>
                                    {(validApi || apiConfig) && userName && passsWord ? (
                                        <TouchableOpacity
                                            activeOpacity={isLoading ? 1 : 0.5}
                                            style={[styles.bntSignInNow]}
                                            onPress={() => this.checkLogin()}
                                        >
                                            {isLoading && (
                                                <VnrLoading
                                                    isVisible={true}
                                                    size={'small'}
                                                    color={Colors.primary}
                                                    style={{}}
                                                />
                                            )}
                                            <View style={styles.styViewLogin}>
                                                <VnrText
                                                    i18nKey={'Login'}
                                                    style={styles.textSignin}
                                                    numberOfLines={1}
                                                />
                                            </View>
                                            {isLoading && (
                                                <VnrLoading
                                                    isVisible={true}
                                                    size={'small'}
                                                    color={Colors.white}
                                                    style={{}}
                                                />
                                            )}
                                        </TouchableOpacity>
                                    ) : (
                                        <TouchableOpacity style={styles.bntSignInNowDisable} activeOpacity={1}>
                                            <VnrText
                                                i18nKey={'Login'}
                                                style={[styles.textSignin, { color: Colors.grey }]}
                                            />
                                        </TouchableOpacity>
                                    )}

                                    {isVisibleBioIcon && listProviderSso.data == null ? (
                                        <TouchableOpacity
                                            activeOpacity={isLoadingBio ? 1 : 0.5}
                                            style={styles.bntSignInNowBio}
                                            onPress={() => this.handleTouchID()}
                                        >
                                            {viewBioIcon}
                                        </TouchableOpacity>
                                    ) : (
                                        <View />
                                    )}

                                    {isConfirmCaptcha && (
                                        <ConfirmGoogleCaptcha
                                            ref={(_ref) => (this.captchaForm = _ref)}
                                            siteKey={reCaptchaPublicKey}
                                            baseUrl={domainCaptcha}
                                            languageCode="en"
                                            onMessage={this.onPickCaptcha}
                                        />
                                    )}
                                </View>
                            </Animated.View>
                        )}

                        {/* submit app can co */}
                        {/* <Animated.View
              style={[
                fromInput,
              ]}>
              {viewError}
              {viewMessage}
              <TouchableOpacity style={styles.styBtnUpdate} onPress={() => this.checkVersionCodePush()} >
                {
                  Platform.OS == 'ios' ?
                    <IconAppStore size={Size.text} color={Colors.gray_10} />
                    : <IconAndroid size={Size.text} color={Colors.gray_10} />
                }

                {
                  thisVersion ? (
                    <VnrText
                      style={[styleSheets.text, textQR]}
                      value={`${translate('HRM_Message_Update_Version')}: ${thisVersion}`}
                    />
                  ) : (
                    <VnrText
                      style={[styleSheets.text, textQR]}
                      i18nKey={'HRM_Title_Check_Version'}
                    />
                  )
                }

              </TouchableOpacity>
            </Animated.View> */}

                        <View style={styles.styViewSso}>
                            {!listProviderSso.isShowOnlySSO && (
                                <VnrText
                                    i18nKey={'HRM_Common_SucessFactor_Or'}
                                    style={styles.styTextAndOr}
                                    numberOfLines={1}
                                />
                            )}

                            {listProviderSso.isShowOnlySSO && (
                                <TouchableOpacity
                                    accessibilityLabel="Login-App"
                                    activeOpacity={isLoading ? 1 : 0.5}
                                    style={[styles.bntSignInNow]}
                                    onPress={() => {
                                        this.handleAuthorizeApp();
                                    }}
                                >
                                    <View style={styles.styLoginSso}>
                                        <VnrText
                                            i18nKey={'Login'}
                                            style={styles.textSignin}
                                            numberOfLines={1}
                                        />
                                    </View>
                                </TouchableOpacity>
                            )}

                            {listProviderSso.data != null && listProviderSso.linkActive && (
                                <ModalAuthorize
                                    ref={(_ref) => (this.refAuthorize = _ref)}
                                    siteKey={listProviderSso.linkActive}
                                    language={language}
                                    onMessage={this.messageLoginSSO}
                                />
                            )}
                        </View>
                    </TouchableOpacity>

                    <View style={styles.styViewLoginBottom}>
                        <TouchableOpacity style={styles.styBtnUpdate} onPress={() => this.checkVersionCodePush()}>
                            {Platform.OS == 'ios' ? (
                                <IconAppStore size={Size.text} color={Colors.gray_10} />
                            ) : (
                                <IconAndroid size={Size.text} color={Colors.gray_10} />
                            )}

                            {thisVersion ? (
                                <VnrText
                                    style={[styleSheets.text, styles.textQR]}
                                    value={`${translate('HRM_Message_Update_Version')}: ${thisVersion}`}
                                />
                            ) : (
                                <VnrText
                                    style={[styleSheets.text, styles.textQR]}
                                    i18nKey={'HRM_Title_Check_Version'}
                                />
                            )}
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[styles.qrLogin]}
                            onPress={() => {
                                this.router('QrScanner');
                            }}
                        >
                            <IconQrcode size={Size.text} color={Colors.gray_10} />
                            <VnrText style={[styleSheets.text, styles.textQR]} i18nKey={'Permission_ScanQrCode'} />
                        </TouchableOpacity>

                        <View style={styles.styOpLang}>
                            <TouchableOpacity
                                onPress={() => {
                                    this.setLanguage('VN');
                                }}
                            >
                                <VnrText i18nKey={'Tiếng Việt'} style={[styles.textLang, { color: colorTextLangVN }]} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => {
                                    this.setLanguage('EN');
                                }}
                            >
                                <VnrText
                                    i18nKey={'English'}
                                    style={[styles.textLang, { paddingLeft: styleSheets.p_20, color: colorTextLangEN }]}
                                />
                            </TouchableOpacity>

                            {/* <TouchableOpacity onPress={() => { this.setLanguage('CN') }}>
                <VnrText
                  i18nKey={'简体中文'}
                  style={[textLang, { paddingLeft: styleSheets.p_20, color: colorTextLangCN }]}
                />
              </TouchableOpacity> */}
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }
}

const HEIGHT_BOTTOM = 40 + Size.defineSpace * 4,
    HEIGHT_HEADER = Size.deviceheight * 0.27,
    HEIGHT_CONTENT = Size.deviceheight - HEIGHT_BOTTOM - Size.defineSpace * 2,
    SIZE_BUTTON = Size.deviceWidth - 170;

const styles = StyleSheet.create({
    styLoginSso: {
        flex: 1,
        alignItems: 'center'
    },
    styViewSso: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    styViewLogin: {
        flex: 1,
        alignItems: 'center'
    },
    styViewValid: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },

    styScrollView: { flexGrow: 1 },
    styViewForgotPass: {
        width: '100%',
        paddingLeft: 4
    },
    styTextForgotPass: {
        fontSize: Size.text,
        color: Colors.primary,
        fontWeight: Platform.OS == 'ios' ? '500' : '600',

        textDecorationLine: 'underline',
        textDecorationStyle: 'solid'
    },
    styTextAndOr: {
        marginTop: Size.defineHalfSpace,
        fontSize: Size.text - 1,
        color: Colors.gray_7
    },
    formControlPadding: { marginBottom: 10 },
    styOpLang: {
        flexDirection: 'row',
        width: Size.deviceWidth,
        justifyContent: 'center'
        // position: 'absolute',
        // bottom: Size.defineSpace * 2
    },
    styViewLoginTop: Platform.select({
        ios: {
            flex: 1,
            alignItems: 'center'
        },
        android: {
            minHeight: HEIGHT_CONTENT,
            // maxHeight: HEIGHT_CONTENT,
            alignItems: 'center'
        }
    }),
    styViewLoginBottom: {
        // flex:1,
        height: HEIGHT_BOTTOM,
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingVertical: Size.defineSpace
    },
    fromInput: {
        // height: HEIGHT_CONTENT,
        width: Size.deviceWidth - 70,
        alignItems: 'center'
    },
    headerLogin: {
        height: HEIGHT_HEADER,
        width: Size.deviceWidth,
        justifyContent: 'center',
        alignItems: 'center',
        // backgroundColor: Colors.white,
        position: 'relative'
    },
    sizeLogo: {
        height: Size.deviceWidth * 0.27,
        maxHeight: 150,
        maxWidth: 150
    },
    sizeLogoBio: {
        height: 37,
        width: 37
    },
    textError: {
        color: Colors.danger,
        fontSize: Size.text
    },
    formError: {
        maxWidth: 355,
        width: Size.deviceWidth - 70,
        marginBottom: styleSheets.p_10,
        alignItems: 'center',
        justifyContent: 'center'
    },
    formControl: {
        maxWidth: 355,
        borderColor: Colors.gray_5,
        borderWidth: 1,
        borderRadius: 6,
        width: '100%',
        marginBottom: styleSheets.p_20
    },
    control: {
        flexDirection: 'row',
        height: 43,
        maxWidth: 355
    },
    styBtnUpdate: {
        width: SIZE_BUTTON,
        maxWidth: 260,
        height: 40,

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',

        borderWidth: 1.5,
        borderColor: Colors.gray_5,
        borderRadius: 5,
        borderStyle: 'dotted',
        // marginTop: styleSheets.m_20,

        marginBottom: Size.defineSpace,
        paddingHorizontal: Size.defineHalfSpace
    },
    qrLogin: {
        width: SIZE_BUTTON,
        maxWidth: 260,
        height: 40,

        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',

        borderWidth: 1.5,
        borderColor: Colors.gray_5,
        borderRadius: 5,
        borderStyle: 'dotted',
        // marginTop: styleSheets.m_20,

        marginBottom: Size.defineSpace,
        paddingHorizontal: Size.defineHalfSpace
    },
    textQR: {
        fontSize: Size.text,
        color: Colors.gray_10,
        fontFamily: Platform.OS == 'android' ? 'SF-Pro-Text-Medium' : 'SFProText-Bold',
        marginLeft: Size.defineHalfSpace
    },
    inputStyle: {
        flex: 1,
        paddingLeft: styleSheets.p_10,
        paddingTop: 0,
        paddingBottom: 0,
        textAlignVertical: 'center'
    },
    leftIcon: {
        width: 30,
        height: 45,
        justifyContent: 'center',
        alignItems: 'center'
    },
    textSignin: {
        fontSize: Size.text + 3,
        color: Colors.white,
        fontWeight: '600'
    },
    bntSignInNow: {
        width: SIZE_BUTTON,
        height: 42,
        marginTop: Size.defineSpace,
        maxWidth: 260,
        justifyContent: 'space-between',
        backgroundColor: Colors.primary,
        alignItems: 'center',
        borderRadius: styleSheets.radius_5,
        flexDirection: 'row',
        paddingHorizontal: Size.defineSpace
    },
    bntSignInNowDisable: {
        width: SIZE_BUTTON,
        height: 42,
        marginTop: 20,
        maxWidth: 260,
        justifyContent: 'center',
        backgroundColor: Colors.borderColor,
        alignItems: 'center',
        borderRadius: styleSheets.radius_5,
        flexDirection: 'row'
    },
    bntSignInNowBio: {
        maxWidth: 60,
        maxHeight: 60,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 15,
        marginBottom: 4
    },
    textLang: {
        fontSize: Size.text,
        color: Colors.black,
        fontWeight: '600',
        fontFamily: Platform.OS == 'android' ? 'SF-Pro-Text-Medium' : 'SFProText-Bold'
    }
});

const mapStateToProps = (state) => {
    return {
        language: state.languageReducer.language
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setLanguage: (language) => {
            dispatch(languageReducer.actions.changeLanguage(language));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(LoginScene);
