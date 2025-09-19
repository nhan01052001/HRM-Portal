import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { styleSheets, Colors, Size } from '../../../constants/styleConfig';
import { translate } from '../../../i18n/translate';
import { IconCloseCircle, IconCheckCirlce } from '../../../constants/Icons';
import Vnr_Function from '../../../utils/Vnr_Function';

export class PasswordRules extends Component {
    constructor(porps) {
        super(porps);

        this.state = {
            passwordErrors: []
        };
    }

    initConfig() {
        const { data } = this.props;
        const {
            PasswordMinLength,
            PasswordMaxLength,
            PasswordMinDigits,
            PasswordMinSpecials,
            PasswordMinLowercase,
            PasswordMinUppercase
        } = data;

        let nextState = {};

        // chiều dài mật khẩu
        if (PasswordMinLength && PasswordMaxLength) {
            let ruleText = translate('HRM_PortalApp_PasswordRules_MinMaxLength').replace(
                '[E_MIN]',
                `${PasswordMinLength}`
            );
            ruleText = ruleText.replace('[E_MAX]', `${PasswordMaxLength}`);
            nextState.PasswordMinMaxLength = {
                ruleText: ruleText,
                isValid: false
            };
        } else if (PasswordMinLength) {
            let ruleText = translate('HRM_PortalApp_PasswordRules_MinLength').replace(
                '[E_MIN]',
                `${PasswordMinLength}`
            );
            nextState.PasswordMinLength = {
                ruleText: ruleText,
                isValid: false
            };
        } else if (PasswordMaxLength) {
            let ruleText = translate('HRM_PortalApp_PasswordRules_MaxLength').replace(
                '[E_MAX]',
                `${PasswordMaxLength}`
            );
            nextState.PasswordMaxLength = {
                ruleText: ruleText,
                isValid: false
            };
        }

        // ký tự đặt biệt
        if (PasswordMinSpecials) {
            let ruleText = translate('HRM_PortalApp_PasswordRules_MinSpecials').replace(
                '[E_N]',
                `${PasswordMinSpecials}`
            );
            nextState.PasswordMinSpecials = {
                ruleText: ruleText,
                isValid: false
            };
        }

        // Chữ số
        if (PasswordMinDigits) {
            let ruleText = translate('HRM_PortalApp_PasswordRules_MinDigits').replace('[E_N]', `${PasswordMinDigits}`);
            nextState.PasswordMinDigits = {
                ruleText: ruleText,
                isValid: false
            };
        }

        // số lượng chữ hoa chữ thường
        if (PasswordMinLowercase && PasswordMinUppercase) {
            let ruleText = translate('HRM_PortalApp_PasswordRules_MinLowerUpper').replace(
                '[E_LOWER]',
                `${PasswordMinLowercase}`
            );
            ruleText = ruleText.replace('[E_UPPER]', `${PasswordMinUppercase}`);
            nextState.PasswordMinLowerUpper = {
                ruleText: ruleText,
                isValid: false
            };
        } else if (PasswordMinLowercase) {
            let ruleText = translate('HRM_PortalApp_PasswordRules_MinLower').replace(
                '[E_LOWER]',
                `${PasswordMinLowercase}`
            );
            nextState.PasswordMinLower = {
                ruleText: ruleText,
                isValid: false
            };
        } else if (PasswordMinUppercase) {
            let ruleText = translate('HRM_PortalApp_PasswordRules_MinUpper').replace(
                '[E_UPPER]',
                `${PasswordMinUppercase}`
            );
            nextState.PasswordMinUpper = {
                ruleText: ruleText,
                isValid: false
            };
        }

        this.setState({ passwordErrors: nextState });
    }

    checkValidate() {
        const { data, password } = this.props;
        const {
            PasswordMinLength,
            PasswordMaxLength,
            PasswordMinDigits,
            PasswordMinSpecials,
            PasswordMinLowercase,
            PasswordMinUppercase
        } = data;
        const { passwordErrors } = this.state;

        let nextState = { ...passwordErrors };

        if (nextState) {
            // Kiểm tra chiều dài mật khẩu
            if (nextState.PasswordMinMaxLength) {
                if (password.length >= PasswordMinLength && password.length <= PasswordMaxLength) {
                    nextState.PasswordMinMaxLength.isValid = true;
                } else {
                    nextState.PasswordMinMaxLength.isValid = false;
                }
            } else if (nextState.PasswordMinLength) {
                if (password.length >= PasswordMinLength) {
                    nextState.PasswordMinLength.isValid = true;
                } else {
                    nextState.PasswordMinLength.isValid = false;
                }
            } else if (nextState.PasswordMaxLength) {
                if (password.length <= PasswordMaxLength) {
                    nextState.PasswordMaxLength.isValid = true;
                } else {
                    nextState.PasswordMaxLength.isValid = false;
                }
            }

            // Kiểm tra ký tự đặt biệt
            if (nextState.PasswordMinSpecials) {
                const specialChars = '!@#$%^&*()_+-{}:"<>?|[];.,/~`';
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

            // Kiểm tra số lượng chữ hoa chữ thường
            const lowercaseCount = password
                .split('')
                .filter((char) => char === char.toLowerCase() && char.match(/[a-z]/)).length;
            const uppercaseCount = password
                .split('')
                .filter((char) => char === char.toUpperCase() && char.match(/[A-Z]/)).length;
            if (nextState.PasswordMinLowerUpper) {
                if (lowercaseCount >= PasswordMinLowercase && uppercaseCount >= PasswordMinUppercase) {
                    nextState.PasswordMinLowerUpper.isValid = true;
                } else {
                    nextState.PasswordMinLowerUpper.isValid = false;
                }
            } else if (nextState.PasswordMinLower) {
                if (lowercaseCount >= PasswordMinLowercase) {
                    nextState.PasswordMinLower.isValid = true;
                } else {
                    nextState.PasswordMinLower.isValid = false;
                }
            } else if (nextState.PasswordMinUpper) {
                if (uppercaseCount >= PasswordMinUppercase) {
                    nextState.PasswordMinUpper.isValid = true;
                } else {
                    nextState.PasswordMinUpper.isValid = false;
                }
            }
        }
        this.setState({ passwordErrors: nextState });
    }

    componentDidMount() {
        this.initConfig();
    }

    componentDidUpdate(prevProps) {
        const { password } = this.props;
        if (prevProps.password !== this.props.password && !Vnr_Function.CheckIsNullOrEmpty(password)) {
            this.checkValidate();
        }
    }

    render() {
        const { password } = this.props;
        const { passwordErrors } = this.state;

        return (
            <View style={styles.container}>
                <Text style={[styleSheets.text, styles.passwordRulesLabel]}>
                    {translate('HRM_PortalApp_PasswordRulesRequire')}
                </Text>
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
        marginLeft: Size.defineHalfSpace,
        flex: 1
    }
});

export default PasswordRules;
