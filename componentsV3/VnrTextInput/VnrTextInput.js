/* eslint-disable no-console */
import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity, StyleSheet, Text } from 'react-native';
import { Colors, CustomStyleSheet, Size, styleSheets, stylesVnrPickerV3, styleValid } from '../../constants/styleConfig';
import { IconCancel, IconWarn } from '../../constants/Icons';
import Vnr_Function from '../../utils/Vnr_Function';
import format from 'number-format.js';
import VnrText from '../../components/VnrText/VnrText';
import { translate } from '../../i18n/translate';

export default class VnrTextInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stateProps: props,
            isShowClearText: false,
            isTestValue: false
        };
    }

    shouldComponentUpdate(nextProps, nextState) {
        return nextProps?.value !== this.props?.value ||
            nextProps?.refresh !== this.props?.refresh ||
            nextState?.isShowClearText !== this.state.isShowClearText ||
            nextProps?.isCheckEmpty !== this.props?.isCheckEmpty
    }

    changeDisable = bool => {
        const stateProps = { ...this.state.stateProps };
        if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.disable) && typeof stateProps.disable === 'boolean') {
            stateProps.disable = bool;
            this.setState({ stateProps: stateProps });
        }
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.refresh !== this.props.refresh) {
            this.onRefreshControl(nextProps);
        }
    }
    onRefreshControl = nextProps => {
        this.setState({ stateProps: nextProps });
    };

    onChangeText = text => {
        const { onChangeText, charType } = this.state.stateProps,
            numRegexTypeInt = /^[0-9]+$/g,
            numRegexTypeDouble = /^(-)?(((\d+(\.\d*)?)|(\.\d*)))?$/,
            numRegexTypeMoney = / ?[+-]?[0-9]{1,3}(?:,?[0-9])*(?:\.[0-9]{1,2})?/;

        const { value } = this.props;
        if (charType === 'int') {
            // (validate kieu number)
            if (numRegexTypeInt.test(text)) {
                onChangeText(text);
            }
            // (dang xoa khong can validate)
            else if (value && value.length > text.length) {
                onChangeText(text);
            } else {
                onChangeText(value && value.length > 0 ? value : '');
            }
        } else if (charType === 'double') {
            // (validate kieu double)
            let numberText = text.split(',').join('.');
            if (numRegexTypeDouble.test(numberText)) {
                if (numberText.split('')[0] !== '.' && numberText.split('')[0] !== '-') {
                    onChangeText(numberText);
                }
            }
            // (dang xoa khong can validate)
            else if (value && value.length > numberText.length) {
                onChangeText(numberText);
            } else {
                onChangeText(value && value.length > 0 ? value : '');
            }
        } else if (charType === 'money') {
            // (validate kieu money)
            let numberText = parseFloat(text.split(',').join(''));
            let formatText = format('#,###.#', numberText);
            if (numRegexTypeMoney.test(formatText)) {
                onChangeText(formatText, numberText);
            }
            // (dang xoa khong can validate)
            else if (value && value.length > text.length) {
                onChangeText(formatText, numberText);
            } else {
                onChangeText(value && value.length > 0 ? value : '');
            }
        } else {
            onChangeText(text);
        }
    };

    focus = () => {
        try {
            if (this.refInput && this.refInput.focus) {
                this.refInput.focus();
            }
        } catch (error) {
            console.log(error);
        }
    };

    blur = () => {
        try {
            if (this.refInput && this.refInput.blur) {
                this.refInput.blur();
            }
        } catch (error) {
            console.log(error);
        }
    };

    render() {
        const stateProps = this.state.stateProps;
        const { lable, maxNumber } = this.props;
        let disable = false;
        let isShowErr = false;
        let errorMax500 = '';
        if (
            (this.props.fieldValid &&
                this.props.fieldValid === true &&
                this.props.isCheckEmpty &&
                this.props.isCheckEmpty === true &&
                (stateProps.value === null ||
                    stateProps.value === undefined ||
                    stateProps.value === '' ||
                    (stateProps.value && stateProps.value.length > 1000)))
            || (this.props.fieldValid &&
                this.props.isCheckEmpty &&
                !isNaN(Number(maxNumber)) &&
                !isNaN(Number(stateProps.value))
                && stateProps.value >= maxNumber + 1)
        ) {
            isShowErr = true;
        } else {
            isShowErr = false;
        }

        if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.disable) && typeof stateProps.disable === 'boolean') {
            disable = stateProps.disable;
        }

        if (this.props.value && this.props.value.length > 500) {
            let keyTrans = translate('HRM_Sytem_MaxLength500');
            errorMax500 = keyTrans.replace('[E_NAME]', lable ? `[${translate(lable)}]` : '');
        }

        return (
            <View
                style={[
                    styles.styVnrTextInputName,
                    isShowErr && stylesVnrPickerV3.styBntPickerError,
                    this.props.styleContent && this.props.styleContent,
                    stateProps.lable && {
                        paddingTop: stateProps.isTextRow ? Size.defineHalfSpace : Size.defineSpace,
                        paddingBottom: Size.defineHalfSpace
                    }
                ]}
            >
                {stateProps.isTextRow ? (
                    <View style={styles.styViewRow}>
                        {stateProps.lable && (
                            <View style={stylesVnrPickerV3.styLbPicker}>
                                <VnrText
                                    style={[styleSheets.text, styles.styLbNotHaveValuePicker]}
                                    i18nKey={stateProps.lable}
                                />
                                {stateProps.fieldValid && (
                                    <VnrText style={[styleSheets.text, styleValid]} i18nKey={'HRM_Valid_Char'} />
                                )}
                            </View>
                        )}

                        <TextInput
                            ref={ref => (this.refInput = ref)}
                            accessibilityLabel={`VnrTextInput-${stateProps.textField ? stateProps.textField : stateProps.lable}`}
                            editable={!disable}
                            placeholder={translate(stateProps.placeHolder)}
                            {...this.props}
                            style={[
                                styleSheets.text,
                                styles.styTextRow,
                                disable && styleSheets.textInputDisable,
                                {
                                    height: this.props.height == undefined ? Size.heightInput : this.props.height
                                }
                            ]}
                            onChangeText={text => this.onChangeText(text)}
                        />
                    </View>
                ) : (
                    <View style={CustomStyleSheet.flex(1)}>
                        {stateProps.lable && (
                            <View style={stylesVnrPickerV3.styLbPicker}>
                                <VnrText
                                    style={[styleSheets.text, styles.styLbNotHaveValuePicker]}
                                    i18nKey={stateProps.lable}
                                />
                                {stateProps.fieldValid && (
                                    <VnrText style={[styleSheets.text, styleValid]} i18nKey={'HRM_Valid_Char'} />
                                )}
                            </View>
                        )}
                        {errorMax500 != '' && (
                            <Text style={[styleSheets.text, styles.styTextEror500]} numberOfLines={2}>
                                {errorMax500}
                            </Text>
                        )}

                        <TextInput
                            ref={ref => (this.refInput = ref)}
                            accessibilityLabel={`VnrTextInput-${stateProps.textField ? stateProps.textField : stateProps.lable}`}
                            editable={!disable}
                            placeholder={translate(stateProps.placeHolder)}
                            {...this.props}
                            style={
                                this.props.style
                                    ? [this.props.style, disable && styleSheets.textInputDisable]
                                    : [
                                        styleSheets.text,
                                        styleSheets.textInput,
                                        disable && styleSheets.textInputDisable,
                                        {
                                            height:
                                                this.props.height == undefined ? Size.heightInput : this.props.height
                                        },
                                        stateProps.textRight &&
                                        stateProps.textRight === true && {
                                            textAlign: 'right',
                                            borderRightWidth: 0,
                                            borderTopWidth: 0
                                        }
                                    ]
                            }
                            onChangeText={text => this.onChangeText(text)}
                        />
                    </View>
                )}

                {isShowErr ? (
                    <View style={stylesVnrPickerV3.styRightPicker}>
                        <View style={stylesVnrPickerV3.styBtnClear}>
                            <IconWarn color={Colors.red} size={Size.iconSize - 2} />
                        </View>
                    </View>
                ) : !Vnr_Function.CheckIsNullOrEmpty(stateProps.onClearText) &&
                    typeof stateProps.onClearText == 'function' &&
                    this.props.value !== '' ? (
                        <TouchableOpacity
                            onPress={() => stateProps.onClearText()}
                            style={styles.styBtnClear}
                        >
                            <IconCancel
                                size={Size.iconSize - 2}
                                color={this.props.iconCloseColor ? this.props.iconCloseColor : Colors.grey}
                            />
                        </TouchableOpacity>
                    ) : null}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    styBtnClear: {
        minWidth: 25,
        minHeight: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12
    },
    styLbNotHaveValuePicker: {
        fontSize: Size.text + 1,
        color: Colors.gray_8
    },
    styVnrTextInputName: {
        flex: 1,
        flexDirection: 'row',
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        // paddingTop: Size.defineSpace,
        // paddingBottom: Size.defineHalfSpace,
        paddingVertical: Size.defineHalfSpace,
        paddingHorizontal: Size.defineSpace
    },
    styTextRow: {
        flex: 1,
        height: 35,
        fontSize: Size.text,
        fontWeight: '500',
        paddingLeft: Size.defineSpace,
        paddingVertical: 0,
        textAlign: 'right',
        borderWidth: 0,
        borderRadius: 7,
        marginLeft: Size.defineHalfSpace
    },
    styViewRow: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    styTextEror500: {
        fontSize: Size.text - 1,
        color: Colors.red,
        marginTop: 5
    }
});
