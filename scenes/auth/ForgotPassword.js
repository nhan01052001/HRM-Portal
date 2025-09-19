import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image, Animated, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import languageReducer from '../../redux/i18n';
import VnrText from '../../components/VnrText/VnrText';
import Vnr_Function from '../../utils/Vnr_Function';
import HttpService from '../../utils/HttpService';
import { translate } from '../../i18n/translate';
import { SafeAreaView } from 'react-native-safe-area-context';
import { dataVnrStorage } from '../../assets/auth/authentication';
import { styleSheets, Colors, Size, CustomStyleSheet } from '../../constants/styleConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ToasterSevice } from '../../components/Toaster/Toaster';
import VnrLoading from '../../components/VnrLoading/VnrLoading';
import DrawerServices from '../../utils/DrawerServices';
import { IconBack } from '../../constants/Icons';
const sourceLogo = '../../assets/images/AvatarVnR.png';

class ForgotPassword extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            userName: '',
            emailValue: '',
            txtError: '',
            isLoading: false
        };
    }

    checkForgotPass = () => {
        const { userName, emailValue, isLoading } = this.state;
        const { apiConfig } = dataVnrStorage;

        Keyboard.dismiss();
        if (isLoading) return;

        if (apiConfig == null) {
            ToasterSevice.showError('PleaseUploadFileConfig', 3000);
            return true;
        }

        const data = {
            userLogin: userName,
            email: emailValue,
            screenName: 'Portal/ConfirmLoginForgotPassword',
            isMain: false
        };

        this.setState({ isLoading: true, txtError: '' });

        HttpService.Post('[URI_SYS]/Sys_GetData/LogForgotPassordInfo', data)
            .then(res => {
                try {
                    if (res && res.isSuccess) {
                        ToasterSevice.showSuccess('HRM_System_LoginForgotPassword_Succeed', 5000);
                        this.setState({ isLoading: false, txtError: '' });
                        DrawerServices.navigate('Login');
                    } else {
                        this.setState({ txtError: res.errorMessage, isLoading: false });
                    }
                } catch (error) {
                    this.setState({ txtError: translate('HRM_Common_SendRequest_Error'), isLoading: false });
                }
            })
            .catch(() => {
                this.setState({ txtError: translate('HRM_Common_SendRequest_Error'), isLoading: false });
            });
    };

    render() {
        // test animation
        const { userName, emailValue, txtError, isLoading } = this.state;

        const { apiConfig } = dataVnrStorage;
        const {
            container,
            bntSignInNow,
            fromInput,
            inputStyle,
            headerLogin,
            formControl,
            textSignin,
            control,
            sizeLogo,
            formError,
            textError,
            bntSignInNowDisable
        } = styles;

        let viewError = <View />;
        if (!Vnr_Function.CheckIsNullOrEmpty(txtError)) {
            viewError = (
                <View style={formError}>
                    <View style={styleSheets.lable}>
                        <Text style={[styleSheets.text, textError]}>{txtError}</Text>
                    </View>
                </View>
            );
        } else if (apiConfig == null) {
            viewError = (
                <View style={formError}>
                    <View style={styleSheets.lable}>
                        <Text style={[styleSheets.text, textError]}>{translate('PleaseUploadFileConfig')}</Text>
                    </View>
                </View>
            );
        }

        return (
            <SafeAreaView style={container}>
                <KeyboardAwareScrollView
                    scrollEnabled={true}
                    showsVerticalScrollIndicator={false}
                    contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                    keyboardShouldPersistTaps={'handled'}
                    extraScrollHeight={50} // khoan cach
                >
                    <TouchableOpacity
                        onPress={() => {
                            Keyboard.dismiss();
                        }}
                        style={styles.styViewLoginTop}
                        activeOpacity={1}
                    >
                        <View style={headerLogin}>
                            {apiConfig && apiConfig.uriPor ? (
                                <Image
                                    source={{ uri: apiConfig.uriPor + '/Content/images/icons/LogoApp.png' }}
                                    style={[sizeLogo, { width: Size.deviceWidth * 0.35 }]}
                                    resizeMode={'contain'}
                                />
                            ) : (
                                <Image source={require(sourceLogo)} style={sizeLogo} resizeMode={'contain'} />
                            )}
                        </View>
                        <Animated.View style={[fromInput]}>
                            {viewError}

                            <View style={[formControl]}>
                                <View style={[control]}>
                                    <TextInput
                                        ref={input => {
                                            this.autoFocus = input;
                                        }}
                                        autoCapitalize={'none'}
                                        editable={apiConfig == null || isLoading ? false : true}
                                        placeholder={translate('HRM_System_ForgotPassword_PlaceHolderLoginName')}
                                        style={[styleSheets.text, inputStyle]}
                                        value={userName}
                                        onChangeText={text => this.setState({ userName: text })}
                                        onSubmitEditing={() => this.PassWord && this.PassWord.focus()}
                                        returnKeyType={'next'}
                                    />
                                </View>
                            </View>

                            <View style={[formControl, CustomStyleSheet.marginBottom(10)]}>
                                <View style={control}>
                                    <TextInput
                                        autoCapitalize={'none'}
                                        editable={apiConfig == null || isLoading ? false : true}
                                        ref={resInput => (this.PassWord = resInput)}
                                        placeholder={translate('HRM_System_ForgotPassword_PlaceHolderEmail')}
                                        style={[styleSheets.text, inputStyle]}
                                        value={emailValue}
                                        onChangeText={text => this.setState({ emailValue: text })}
                                        onSubmitEditing={() => this.checkForgotPass()}
                                        returnKeyType={'done'}
                                    />
                                </View>
                            </View>

                            <View style={CustomStyleSheet.flexDirection('row')}>
                                {apiConfig && (userName && emailValue) ? (
                                    <TouchableOpacity
                                        activeOpacity={isLoading ? 1 : 0.5}
                                        style={[bntSignInNow]}
                                        onPress={() => this.checkForgotPass()}
                                    >
                                        {isLoading && (
                                            <View
                                                style={{
                                                    width: Size.iconSizeLoadingSmall,
                                                    height: Size.iconSizeLoadingSmall
                                                }}
                                            />
                                        )}
                                        <View style={styles.stySign}>
                                            <VnrText
                                                i18nKey={'HRM_System_ForgotPassword_CheckAndConfirmed'}
                                                style={textSignin}
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
                                    <TouchableOpacity style={bntSignInNowDisable} activeOpacity={1}>
                                        <VnrText
                                            i18nKey={'HRM_System_ForgotPassword_CheckAndConfirmed'}
                                            style={[textSignin, { color: Colors.grey }]}
                                        />
                                    </TouchableOpacity>
                                )}
                            </View>
                        </Animated.View>
                    </TouchableOpacity>
                </KeyboardAwareScrollView>

                <View
                    style={styles.styGoback}
                >
                    <TouchableOpacity style={styles.bntGoBack} onPress={() => DrawerServices.navigate('Login')}>
                        <IconBack size={Size.iconSizeHeader} color={Colors.gray_10} />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    stySign : { flex: 1, alignItems: 'center' },
    styGoback : {
        position: 'absolute',
        opacity: 1,
        top: 15,
        left: 10
    },
    bntGoBack: {
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: Colors.gray_3,
        alignItems: 'center',
        justifyContent: 'center'
    },
    styViewLoginTop: {
        // flexGrow: 1,
        flex: 1,
        // justifyContent: 'center',
        alignItems: 'center'
    }
});

const mapStateToProps = state => {
    return {
        language: state.languageReducer.language
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setLanguage: language => {
            dispatch(languageReducer.actions.changeLanguage(language));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ForgotPassword);
