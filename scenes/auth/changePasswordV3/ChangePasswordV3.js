import React, { Component } from 'react';
import { Text, StyleSheet, View, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Size, Colors, styleSheets, styleSafeAreaView } from '../../../constants/styleConfig';
import styleComonAddOrEdit from '../../../constants/styleComonAddOrEdit';
import { SafeAreaView } from 'react-navigation';
import { translate } from '../../../i18n/translate';
import { IconEyeV2, IconEyeOffV2, IconBack } from '../../../constants/Icons';
import { VnrLoadingSevices } from '../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../utils/HttpService';
import { EnumName } from '../../../assets/constant';
import PasswordRules from './PasswordRules';
import Vnr_Function from '../../../utils/Vnr_Function';
import { logout, setdataVnrStorageFromDataUser } from '../../../assets/auth/authentication';
import { ToasterSevice } from '../../../components/Toaster/Toaster';
import DrawerServices from '../../../utils/DrawerServices';
import TouchIDService from '../../../utils/TouchIDService';

export default class ChangePasswordV3 extends Component {
    constructor(props) {
        super(props);

        this.state = {
            passsWordOld: '',
            passsWordNew: '',
            passsWordReNew: '',
            isShowpasssWordOld: false,
            isShowpasssWordNew: false,
            isShowpasssWordReNew: false,
            passwordRules: null,
            isShowPasswordRules: false,
            passsWordOldError: '',
            passsWordNewError: '',
            passsWordReNewError: '',
            isActiveSave: false
        };
    }

    validate(field) {
        const { passsWordOld, passsWordNew, passsWordReNew } = this.state;
        if (field === 'passsWordOld') {
            if (passsWordOld === '') {
                this.setState({ passsWordOldError: translate('HRM_PortalApp_Common_NoEmpty') });
            } else {
                this.setState({ passsWordOldError: '' });
            }
        }

        if (field === 'passsWordNew') {
            if (passsWordNew === '') {
                this.setState({ passsWordNewError: translate('HRM_PortalApp_Common_NoEmpty') });
            } else {
                this.setState({ passsWordNewError: '' });
            }
        }

        if (field === 'passsWordReNew') {
            if (passsWordReNew === '') {
                this.setState({ passsWordReNewError: translate('HRM_PortalApp_Common_NoEmpty') });
            } else if (passsWordReNew != passsWordNew) {
                this.setState({ passsWordReNewError: translate('HRM_PortalApp_ConfirmChange_Mismatch') });
            } else {
                this.setState({ passsWordReNewError: '' });
            }
        }
    }

    getConfigPasswordRules() {
        VnrLoadingSevices.show();

        HttpService.Get('[URI_CENTER]/api/Sys_Common/GetPolicyConfig').then(res => {
            VnrLoadingSevices.hide();
            if (res && res.Status === EnumName.E_SUCCESS) {
                if (res.Data && res.Data.SecurityConfig && res.Data.SecurityConfig.IsUseSecurityPolicy) {
                    this.setState({
                        passwordRules: res.Data,
                        isShowPasswordRules: true
                    });
                } else {
                    this.setState({
                        isShowPasswordRules: false
                    });
                }
            }
        });
    }

    checkAllConditionsValid = errors => {
        return Object.values(errors).every(error => error.isValid);
    };

    checkValidateAll() {
        const { passsWordOld, passsWordNew, passsWordReNew, passwordRules } = this.state;

        if (
            passsWordNew === passsWordReNew &&
            !Vnr_Function.CheckIsNullOrEmpty(passsWordOld) &&
            !Vnr_Function.CheckIsNullOrEmpty(passsWordNew) &&
            !Vnr_Function.CheckIsNullOrEmpty(passsWordReNew)
        ) {
            let isActiveSave;
            if (passwordRules) {
                isActiveSave = this.checkAllConditionsValid(this.PasswordRulesRef?.state?.passwordErrors);
            } else {
                isActiveSave = true;
            }
            this.setState({ isActiveSave: isActiveSave });
        } else {
            this.setState({ isActiveSave: false });
        }
    }

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

    onSubmitNewPass = () => {
        const { passsWordOld, passsWordNew, passsWordReNew } = this.state;

        const data = {
            OldPassword: passsWordOld,
            NewPassword: passsWordNew,
            ConfirmPassword: passsWordReNew
        };

        VnrLoadingSevices.show();

        HttpService.Post('[URI_CENTER]/api/Sys_Common/ValidateUserChangePassword', data).then(res => {
            VnrLoadingSevices.hide();
            if (res) {
                if (res.Status == EnumName.E_SUCCESS) {
                    ToasterSevice.showSuccess('Hrm_Succeed', 3000);
                    this.changePasswordSuccess();
                } else if (res.Message) {
                    ToasterSevice.showError(res.Message, 3000);
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 3000);
                }
            } else {
                ToasterSevice.showError('HRM_Common_SendRequest_Error', 3000);
            }
        });
    };

    componentDidMount() {
        this.getConfigPasswordRules();
    }

    render() {
        const {
            isShowpasssWordOld,
            isShowpasssWordNew,
            isShowpasssWordReNew,
            isShowPasswordRules,
            passwordRules,
            passsWordOldError,
            passsWordReNewError,
            passsWordNewError,
            passsWordNew,
            isActiveSave
        } = this.state;

        const { params = {} } = this.props.navigation.state,
            { IsFirstLogin } = typeof params == 'object' ? params : JSON.parse(params);

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <ScrollView style={styles.container}>
                    {IsFirstLogin && (
                        <TouchableOpacity
                            //disabled={!isActiveSave}
                            style={styles.btnLogout}
                            onPress={() => logout()}
                        >
                            <IconBack color={Colors.gray_7} size={Size.iconSizeHeader} />
                        </TouchableOpacity>
                    )}

                    <View style={styles.imgSty}>
                        <Image
                            source={require('../../../assets/images/profileinfo/lockPassword.png')}
                            style={[Size.iconSize + 5, styles.imgViewSty]}
                            resizeMode={'contain'}
                        />
                    </View>
                    <View style={styles.formControl}>
                        <View style={styles.textInputWrap}>
                            <Text style={[styleSheets.lable]}>{translate('HRM_PortalApp_OldPass')}</Text>
                            <View style={styles.textInputView}>
                                <TextInput
                                    autoCapitalize={'none'}
                                    secureTextEntry={!isShowpasssWordOld}
                                    onBlur={() => this.validate('passsWordOld')}
                                    placeholder={translate('HRM_PortalApp_PasswordPleaseEnter')}
                                    placeholderTextColor={Colors.gray_6}
                                    style={[styleSheets.text, styles.textInputControl]}
                                    onChangeText={text =>
                                        this.setState({ passsWordOld: text }, () => this.checkValidateAll())
                                    }
                                    onSubmitEditing={() => this.PassWordNew && this.PassWordNew.focus()}
                                />
                                <TouchableOpacity
                                    onPress={() => this.setState({ isShowpasssWordOld: !isShowpasssWordOld })}
                                >
                                    {isShowpasssWordOld ? (
                                        <IconEyeOffV2 size={Size.iconSize + 5} color={Colors.grey} />
                                    ) : (
                                        <IconEyeV2 size={Size.iconSize + 5} color={Colors.grey} />
                                    )}
                                </TouchableOpacity>
                            </View>
                            {passsWordOldError ? (
                                <View style={styles.lineError} />
                            ) : (
                                <View style={styles.lineDefault} />
                            )}
                            {passsWordOldError ? (
                                <View style={styles.ErrorViewSty}>
                                    <Text style={[styleSheets.text, { color: Colors.red, fontSize: Size.text - 1 }]}>
                                        {passsWordOldError}
                                    </Text>
                                </View>
                            ) : (
                                <View />
                            )}
                        </View>
                        <View style={styles.textInputWrap}>
                            <Text style={[styleSheets.lable]}>{translate('HRM_PortalApp_NewPass')}</Text>
                            <View style={styles.textInputView}>
                                <TextInput
                                    ref={resInput => (this.PassWordNew = resInput)}
                                    autoCapitalize={'none'}
                                    onBlur={() => this.validate('passsWordNew')}
                                    secureTextEntry={!isShowpasssWordNew}
                                    onChangeText={text =>
                                        this.setState({ passsWordNew: text }, () => this.checkValidateAll())
                                    }
                                    placeholder={translate('HRM_PortalApp_PasswordPleaseEnter')}
                                    placeholderTextColor={Colors.gray_6}
                                    style={[styleSheets.text, styles.textInputControl]}
                                    onSubmitEditing={() => this.PassWordRenew && this.PassWordRenew.focus()}
                                />
                                <TouchableOpacity
                                    onPress={() => this.setState({ isShowpasssWordNew: !isShowpasssWordNew })}
                                >
                                    {isShowpasssWordNew ? (
                                        <IconEyeOffV2 size={Size.iconSize + 5} color={Colors.grey} />
                                    ) : (
                                        <IconEyeV2 size={Size.iconSize + 5} color={Colors.grey} />
                                    )}
                                </TouchableOpacity>
                            </View>
                            {passsWordNewError ? (
                                <View style={styles.lineError} />
                            ) : (
                                <View style={styles.lineDefault} />
                            )}
                            {passsWordNewError ? (
                                <View style={styles.ErrorViewSty}>
                                    <Text style={[styleSheets.text, { color: Colors.red, fontSize: Size.text - 1 }]}>
                                        {passsWordNewError}
                                    </Text>
                                </View>
                            ) : (
                                <View />
                            )}
                        </View>
                        <View style={{}}>
                            <Text style={[styleSheets.lable]}>{translate('HRM_PortalApp_ReNewPass')}</Text>
                            <View style={styles.textInputView}>
                                <TextInput
                                    ref={resInput => (this.PassWordRenew = resInput)}
                                    autoCapitalize={'none'}
                                    secureTextEntry={!isShowpasssWordReNew}
                                    onBlur={() => this.validate('passsWordReNew')}
                                    placeholder={translate('HRM_PortalApp_PasswordPleaseEnter')}
                                    placeholderTextColor={Colors.gray_6}
                                    style={[styleSheets.text, styles.textInputControl]}
                                    onChangeText={text =>
                                        this.setState({ passsWordReNew: text }, () => this.checkValidateAll())
                                    }
                                />
                                <TouchableOpacity
                                    onPress={() => this.setState({ isShowpasssWordReNew: !isShowpasssWordReNew })}
                                >
                                    {isShowpasssWordReNew ? (
                                        <IconEyeOffV2 size={Size.iconSize + 5} color={Colors.grey} />
                                    ) : (
                                        <IconEyeV2 size={Size.iconSize + 5} color={Colors.grey} />
                                    )}
                                </TouchableOpacity>
                            </View>
                            {passsWordReNewError ? (
                                <View style={styles.lineError} />
                            ) : (
                                <View style={styles.lineDefault} />
                            )}
                            {passsWordReNewError ? (
                                <View style={styles.ErrorViewSty}>
                                    <Text style={[styleSheets.text, { color: Colors.red, fontSize: Size.text - 1 }]}>
                                        {passsWordReNewError}
                                    </Text>
                                </View>
                            ) : (
                                <View />
                            )}
                        </View>
                    </View>
                    {isShowPasswordRules && passsWordNew != '' && (
                        <PasswordRules
                            ref={ref => {
                                this.PasswordRulesRef = ref;
                            }}
                            data={passwordRules}
                            password={passsWordNew}
                        />
                    )}
                </ScrollView>
                <View style={[styleComonAddOrEdit.wrapButtonHandler, styles.saveButtonWrap]}>
                    <TouchableOpacity
                        disabled={!isActiveSave}
                        style={[styles.btnSave, { backgroundColor: isActiveSave ? Colors.primary : Colors.gray_3 }]}
                        onPress={() => this.onSubmitNewPass()}
                    >
                        <Text style={[styleSheets.lable, { color: isActiveSave ? Colors.white : Colors.gray_6 }]}>
                            {translate('HRM_System_User_ChangePass')}
                        </Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    formControl: {
        marginTop: 20,
        marginBottom: 20
    },
    imgViewSty: {
        width: 128,
        height: 128,
        alignSelf: 'center'
    },
    textInputWrap: {
        marginBottom: 24
    },
    imgSty: {
        alignSelf: 'center',
        maxWidth: Size.deviceWidth / 2
    },
    lineDefault: {
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 1
    },
    lineError: {
        borderBottomColor: Colors.red,
        borderBottomWidth: 1
    },
    ErrorViewSty: {
        marginLeft: 2,
        marginTop: 4
    },
    textInputView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 12
    },
    textInputControl: {
        paddingVertical: 12,
        flex: 1
    },
    saveButtonWrap: {
        borderTopWidth: 0.5,
        borderTopColor: Colors.gray_5,
        borderRadius: Size.borderRadiusBotton
    },
    container: {
        backgroundColor: Colors.white,
        flex: 1,
        paddingTop: Size.defineSpace + 8,
        paddingHorizontal: Size.defineSpace + 8,
        paddingBottom: 100
    },
    btnSave: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.gray_3,
        paddingVertical: 12,
        borderRadius: Size.borderRadiusBotton
    },
    btnLogout: {
        position:'absolute',
        top:0,
        left: 0,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.gray_3,
        padding: Size.defineHalfSpace,
        borderRadius: Size.borderRadiusBotton
    }
});
