import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { styleSheets, Colors, Size } from '../../../constants/styleConfig';
import { translate } from '../../../i18n/translate';
import { IconCloseCircle, IconCheckCirlce } from '../../../constants/Icons';
import Vnr_Function from '../../../utils/Vnr_Function';
import VnrText from '../../../components/VnrText/VnrText';

export class PasswordRules extends Component {
    constructor(props) {
        super(props);

        this.state = {
            passwordErrors: []
        };
    }

    initConfig() {
        const { data } = this.props;
        const { PasswordMinLength, PasswordMinDigits, PasswordMinSpecials } = data.PrivacyPolicy,
            { IsUseSecurityPolicy } = data.SecurityConfig;

        let nextState = {};

        // Phải có ký tự viết hoa
        if (IsUseSecurityPolicy) {
            const ruleText = translate('HRM_PortalApp_Contain_Uppercase');
            nextState.PasswordMinUpper = {
                ruleText: ruleText,
                isValid: false
            };
        }

        // Độ dài tối thiếu
        if (PasswordMinLength) {
            const keyTras = translate('HRM_PortalApp_SysPasswordRules_MinLength'),
                ruleText = keyTras.replace('[E_MIN]', `${PasswordMinLength}`);
            nextState.PasswordMinLength = {
                ruleText: ruleText,
                isValid: false
            };
        }

        // Số chữ số tối thiểu (kí tự)
        if (PasswordMinDigits) {
            const keyTras = translate('HRM_PortalApp_SysPasswordRules_MinDigits'),
                ruleText = keyTras.replace('[E_MIN]', `${PasswordMinDigits}`);
            nextState.PasswordMinDigits = {
                ruleText: ruleText,
                isValid: false
            };
        }

        // Số ký tự đặc biệt tối thiểu
        if (PasswordMinSpecials) {
            const ruleText = translate('HRM_PortalApp_SysPasswordRules_MinSpecials').replace(
                '[E_MIN]',
                `${PasswordMinSpecials}`
            );
            nextState.PasswordMinSpecials = {
                ruleText: ruleText,
                isValid: false
            };
        }

        this.setState({ passwordErrors: nextState });
    }

    checkValidate(nextProps) {
        const { data, password } = nextProps ? nextProps : this.props;
        const { PasswordMinLength, PasswordMinDigits, PasswordMinSpecials } = data.PrivacyPolicy,
            { passwordErrors } = this.state,
            PasswordMinUppercase = 1;

        let nextState = { ...passwordErrors };
        if (nextState) {
            // Kiểm tra chiều dài mật khẩu
            if (nextState.PasswordMinLength) {
                if (password.length >= PasswordMinLength) {
                    nextState.PasswordMinLength.isValid = true;
                } else {
                    nextState.PasswordMinLength.isValid = false;
                }
            }

            // Kiểm tra ký tự đặt biệt
            if (nextState.PasswordMinSpecials) {
                const specialChars = '!@#$%^&*()_+{}:"<>?|[];.,/~`';
                const specialCount = password.split('').filter((char) => specialChars.includes(char)).length;
                if (specialCount >= PasswordMinSpecials) {
                    nextState.PasswordMinSpecials.isValid = true;
                } else {
                    nextState.PasswordMinSpecials.isValid = false;
                }
            }

            // Kiểm tra số lượng chữ số
            if (nextState.PasswordMinDigits) {
                const digitCount = password.split('').filter((char) => '0123456789'.includes(char)).length;
                if (digitCount >= PasswordMinDigits) {
                    nextState.PasswordMinDigits.isValid = true;
                } else {
                    nextState.PasswordMinDigits.isValid = false;
                }
            }

            // Kiểm tra số lượng chữ hoa
            const uppercaseCount = password
                .split('')
                .filter((char) => char === char.toUpperCase() && char.match(/[A-Z]/)).length;

            if (nextState.PasswordMinUpper) {
                if (uppercaseCount >= PasswordMinUppercase) {
                    nextState.PasswordMinUpper.isValid = true;
                } else {
                    nextState.PasswordMinUpper.isValid = false;
                }
            }
        }
    }

    componentDidMount() {
        this.initConfig();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.password !== this.props.password) {
            this.checkValidate(nextProps);
        }
    }

    render() {
        const { password } = this.props;
        const { passwordErrors } = this.state;

        return (
            <View style={styles.container}>
                <VnrText
                    style={[styleSheets.text, styles.passwordRulesLabel]}
                    i18nKey="HRM_PortalApp_PasswordRulesRequire"
                />
                <View>
                    {Object.keys(passwordErrors).map((key, index) => (
                        <View key={index} style={styles.passwordRulesSty}>
                            {!Vnr_Function.CheckIsNullOrEmpty(password) ? (
                                passwordErrors[key].isValid ? (
                                    <IconCheckCirlce size={Size.iconSize - 3} color={Colors.green} />
                                ) : (
                                    <IconCloseCircle size={Size.iconSize - 3} color={Colors.red} />
                                )
                            ) : (
                                <View style={styles.emptyCircle} />
                            )}
                            <Text style={[styleSheets.text, styles.textRules]}>{passwordErrors[key].ruleText}</Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        paddingBottom: 100
    },
    passwordRulesLabel: {
        color: Colors.gray_8,
        fontSize: Size.text - 1,
        marginBottom: 8
    },
    passwordRulesSty: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10
    },
    emptyCircle: {
        backgroundColor: Colors.gray_4,
        borderRadius: 100,
        width: Size.iconSize - 3,
        height: Size.iconSize - 3
    },
    textRules: {
        marginLeft: Size.defineHalfSpace
    }
});

export default PasswordRules;
