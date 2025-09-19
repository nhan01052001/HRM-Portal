/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-console */
import React, { Component } from 'react';
import { View, TextInput, TouchableOpacity } from 'react-native';
import { Colors, Size, styleSheets } from '../../constants/styleConfig';
import { IconCancel } from '../../constants/Icons';
import Vnr_Function from '../../utils/Vnr_Function';
import format from 'number-format.js';

export default class VnrTextInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            stateProps: props,
            isShowClearText: false,
            isTestValue: false
        };
    }

    changeDisable = (bool) => {
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

    onRefreshControl = (nextProps) => {
        this.setState({ stateProps: nextProps });
    };

    onChangeText = (text) => {
        const { onChangeText, charType } = this.state.stateProps,
            numRegexTypeInt = /^[0-9]+$/g,
            numRegexTypeDouble = /^(-)?(((\d+(\.\d*)?)|(\.\d*)))?$/,
            numRegexTypeMoney = / ?[+-]?[0-9]{1,3}(?:,?[0-9])*(?:\.[0-9]{1,2})?/;

        const { value, isUpperCase } = this.props;

        if (isUpperCase && isUpperCase === true && typeof text === 'string' && text.length > 0) {
            let textUpperCase = text.split(' ');
            for (let i = 0; i < textUpperCase.length; i++) {
                if (textUpperCase[i].length > 0 && textUpperCase[i] !== '' && textUpperCase[i] !== ' ') {
                    textUpperCase[i] = textUpperCase[i][0].toUpperCase() + textUpperCase[i].substr(1);
                }
            }
            onChangeText(textUpperCase.join(' '));
        } else if (charType === 'int') {
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

    onBlur = () => {
        const { onChangeText, value } = this.state.stateProps,
            numRegexTextEmpty = /^\s+$/;

        if (value) {
            // Block input empty, space or \n
            if (numRegexTextEmpty.test(value) == true) {
                onChangeText('');
            }
        }

        this.props.onBlur && this.props.onBlur();
    };

    render() {
        const stateProps = this.state.stateProps;
        let disable = false;

        if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.disable) && typeof stateProps.disable === 'boolean') {
            disable = stateProps.disable;
        }

        return (
            <View
                style={{
                    flex: 1,
                    height: '100%',
                    flexDirection: 'row'
                }}
            >
                <View style={{ flex: 1 }}>
                    <TextInput
                        accessibilityLabel={`VnrTextInput-${stateProps.textField ? stateProps.textField : stateProps.lable || ''}`}
                        ref={(ref) => (this.refInput = ref)}
                        editable={!disable}
                        {...this.props}
                        style={
                            this.props.style
                                ? [this.props.style, disable && styleSheets.textInputDisable]
                                : [
                                    styleSheets.text,
                                    styleSheets.textInput,
                                    disable && styleSheets.textInputDisable,
                                    {
                                        height: this.props.height == undefined ? Size.heightInput : this.props.height
                                    }
                                ]
                        }
                        onBlur={this.onBlur}
                        onChangeText={(text) => this.onChangeText(text)}
                    />
                </View>
                {!Vnr_Function.CheckIsNullOrEmpty(stateProps.onClearText) &&
                    typeof stateProps.onClearText == 'function' &&
                    this.props.value !== '' && (
                    <TouchableOpacity
                        onPress={() => stateProps.onClearText()}
                        style={{
                            minWidth: 25,
                            minHeight: '100%',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <IconCancel
                            size={Size.iconSize - 2}
                            color={this.props.iconCloseColor ? this.props.iconCloseColor : Colors.grey}
                        />
                    </TouchableOpacity>
                )}
            </View>
        );
    }
}
