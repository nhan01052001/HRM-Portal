import React, { Component } from 'react';
import { Text, StyleSheet, View, Image, TextInput, TouchableOpacity, ScrollView } from 'react-native';
import { Size, Colors, styleSheets, styleSafeAreaView } from '../../../constants/styleConfig';
import styleComonAddOrEdit from '../../../constants/styleComonAddOrEdit';
import { SafeAreaView } from 'react-navigation';
import { translate } from '../../../i18n/translate';
import { IconEyeV2, IconEyeOffV2 } from '../../../constants/Icons';
import { VnrLoadingSevices } from '../../../components/VnrLoading/VnrLoadingPages';
import HttpService from '../../../utils/HttpService';
import { EnumName } from '../../../assets/constant';
import PasswordRules from './PasswordRules';
import DrawerServices from '../../../utils/DrawerServices';
import Vnr_Function from '../../../utils/Vnr_Function';
import { ToasterSevice } from '../../../components/Toaster/Toaster';

export default class SalChangePasswordV3 extends Component {
    constructor(porps) {
        super(porps);

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
        let errorText = translate('HRM_PortalApp_Common_NoEmpty');
        if (field === 'passsWordOld') {
            if (passsWordOld === '') {
                this.setState({ passsWordOldError: errorText });
            } else {
                this.setState({ passsWordOldError: '' });
            }
        }

        if (field === 'passsWordNew') {
            if (passsWordNew === '') {
                this.setState({ passsWordNewError: errorText });
            } else {
                this.setState({ passsWordNewError: '' });
            }
        }

        if (field === 'passsWordReNew') {
            if (passsWordReNew === '') {
                this.setState({ passsWordReNewError: errorText });
            } else {
                this.setState({ passsWordReNewError: '' });
            }
        }
    }

    isDataEmptyOrZero(data) {
        if (typeof data === 'object') {
            // eslint-disable-next-line no-unused-vars
            for (let key in data) {
                if (Object.prototype.hasOwnProperty.call(data, key) && data[key] !== 0) {
                    return false
                }
            }
        }
        return true;
    }

    getConfigPasswordRules() {
        VnrLoadingSevices.show();

        HttpService.Get('[URI_CENTER]/api/Sal_GetData/GetConfigPasswordRules')
            .then((res) => {
                VnrLoadingSevices.hide();
                if (res && res.Status === EnumName.E_SUCCESS) {
                    if (!Vnr_Function.CheckIsNullOrEmpty(res.Data) && !this.isDataEmptyOrZero(res.Data)) {
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
            })
            .catch(() => {
                DrawerServices.navigate('ErrorScreen', {
                    ErrorDisplay: 'Thiêu Prop keyDataLocal'
                });
            });
    }

    checkAllConditionsValid = (errors) => {
        return Object.values(errors).every((error) => error.isValid);
    };

    checkValidateAll(field) {
        const { passsWordOld, passsWordNew, passsWordReNew, passwordRules } = this.state;
        this.validate(field);
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

    onSubmitNewPass = () => {
        const { passsWordOld, passsWordNew, passsWordReNew } = this.state;

        const data = {
            OldPassword: passsWordOld,
            NewPassword: passsWordNew,
            ConfirmNewPassword: passsWordReNew
        };

        VnrLoadingSevices.show();

        HttpService.Post('[URI_CENTER]/api/Sal_SalaryInfo/ConfirmChangePasswordPayslip', data).then((res) => {
            VnrLoadingSevices.hide();
            if (res && res.Status === EnumName.E_SUCCESS) {
                if (res.Data) {
                    ToasterSevice.showSuccess('Hrm_Succeed', 3000);
                    this.goBack();
                    // ChangePassword_Success
                } else if (res.Message) {
                    ToasterSevice.showError(res.Message, 3000);
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

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <ScrollView style={styles.container}>
                    <View style={styles.imgSty}>
                        <Image
                            source={require('../../../assets/images/profileinfo/lockPassword.png')}
                            style={[Size.iconSize + 5, styles.imgViewSty]}
                            resizeMode={'contain'}
                        />
                    </View>
                    <View style={styles.formControl}>
                        <View style={styles.textInputWrap}>
                            <Text style={[styleSheets.lable]}>{translate('HRM_System_ChanPaySPass_OldPass')}</Text>
                            <View style={styles.textInputView}>
                                <TextInput
                                    autoCapitalize={'none'}
                                    secureTextEntry={!isShowpasssWordOld}
                                    // autoFocus={true}
                                    onBlur={() => this.validate('passsWordOld')}
                                    placeholder={translate('HRM_PortalApp_PasswordPleaseEnter')}
                                    placeholderTextColor={Colors.gray_6}
                                    style={[styleSheets.text, styles.textInputControl]}
                                    onChangeText={(text) =>
                                        this.setState({ passsWordOld: text }, () =>
                                            this.checkValidateAll('passsWordOld')
                                        )
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
                            <Text style={[styleSheets.lable]}>{translate('HRM_System_User_NewPassword')}</Text>
                            <View style={styles.textInputView}>
                                <TextInput
                                    ref={(resInput) => (this.PassWordNew = resInput)}
                                    autoCapitalize={'none'}
                                    onBlur={() => this.validate('passsWordNew')}
                                    secureTextEntry={!isShowpasssWordNew}
                                    onChangeText={(text) =>
                                        this.setState({ passsWordNew: text }, () =>
                                            this.checkValidateAll('passsWordNew')
                                        )
                                    }
                                    //autoFocus={true}
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
                            <Text style={[styleSheets.lable]}>{translate('HRM_System_ChanPaySPass_ReType')}</Text>
                            <View style={styles.textInputView}>
                                <TextInput
                                    ref={(resInput) => (this.PassWordRenew = resInput)}
                                    autoCapitalize={'none'}
                                    secureTextEntry={!isShowpasssWordReNew}
                                    onBlur={() => this.validate('passsWordReNew')}
                                    //autoFocus={true}
                                    placeholder={translate('HRM_PortalApp_PasswordPleaseEnter')}
                                    placeholderTextColor={Colors.gray_6}
                                    style={[styleSheets.text, styles.textInputControl]}
                                    onChangeText={(text) =>
                                        this.setState({ passsWordReNew: text }, () =>
                                            this.checkValidateAll('passsWordReNew')
                                        )
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
                    {isShowPasswordRules && (
                        <PasswordRules
                            ref={(ref) => {
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
                            {translate('HRM_Common_Save')}
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
    }
});
