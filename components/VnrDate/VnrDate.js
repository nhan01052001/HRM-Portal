import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { IconCancel, IconDate, IconTime } from '../../constants/Icons';
import { Colors, Size, styleSheets, stylesVnrPicker } from '../../constants/styleConfig';
import VnrText from '../VnrText/VnrText';
import Vnr_Function from '../../utils/Vnr_Function';
import { translate } from '../../i18n/translate';
export default class VnrDate extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valueDate: !Vnr_Function.CheckIsNullOrEmpty(props.value) ? new Date(moment(props.value)) : null,
            setDatePickerVisibility: false,
            stateProps: props
        };
    }

    showDatePicker = () => {
        this.setState({ setDatePickerVisibility: true });
    };

    hideDatePicker = () => {
        const { stateProps } = this.state;
        if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.onCancel)) {
            this.state.stateProps.onCancel();
        }

        const { autoShowModal } = this.props;
        if (autoShowModal) {
            stateProps.onFinish(null);
        }

        this.setState({ setDatePickerVisibility: false });
    };

    clearDate = () => {
        const { stateProps } = this.state;
        this.setState({ valueDate: null, setDatePickerVisibility: false }, () => {
            stateProps.onFinish(null);
        });
    };

    handleConfirm = date => {
        const { stateProps } = this.state;

        if (stateProps.format && stateProps.format == 'MM/YYYY') {
            date = new Date(moment(date).startOf('month'));
        }

        if (
            !Vnr_Function.CheckIsNullOrEmpty(stateProps.response) &&
            (stateProps.type == 'date' || stateProps.type == undefined)
        ) {
            let valueFomartServer = Vnr_Function.parseDateTime(date);
            this.setState({ valueDate: date, setDatePickerVisibility: false }, () => {
                stateProps.onFinish(valueFomartServer);
            });
        } else {
            this.setState({ valueDate: date, setDatePickerVisibility: false }, () => {
                stateProps.onFinish(date);
            });
        }
    };

    changeDisable = bool => {
        const stateProps = { ...this.state.stateProps };
        if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.disable) && typeof stateProps.disable === 'boolean') {
            stateProps.disable = bool;
            this.setState({ stateProps: stateProps });
        }
    };

    onRefreshControl = nextProps => {
        const valueDate = !Vnr_Function.CheckIsNullOrEmpty(nextProps.value) ? new Date(moment(nextProps.value)) : null;

        this.setState({ stateProps: nextProps, valueDate });
    };

    componentDidMount() {
        const { autoShowModal } = this.props;
        if (autoShowModal) {
            this.showDatePicker();
        }
    }

    // eslint-disable-next-line react/no-deprecated
    componentWillReceiveProps(nextProps) {
        if (nextProps.refresh !== this.props.refresh) {
            this.onRefreshControl(nextProps);
        }
    }

    // getLocalesTimeZone = (language) => {
    //   switch (language) {
    //     case 'VN':
    //       return 'vi_VN'
    //     case 'EN':
    //       return 'en_GB'
    //     default:
    //       return 'en_GB'
    //   }
    // }

    render() {
        const { stateProps, valueDate } = this.state,
            { bntPicker, selectPicker, stylePlaceholder, bntPickerDisable, styLableValue } = stylesVnrPicker.VnrPicker;
        let textValue = null,
            displayControl = true;
        if (valueDate != null) {
            textValue = moment(valueDate).format(stateProps.format);
        }
        let disable = false;
        if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.disable) && typeof stateProps.disable === 'boolean') {
            disable = stateProps.disable;
        }
        if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.hideControl) && stateProps.hideControl) {
            displayControl = false;
        }

        return (
            <View style={[selectPicker]}>
                {displayControl && (
                    <TouchableOpacity
                        onPress={() => (!disable ? this.showDatePicker() : null)}
                        style={[
                            bntPicker,
                            // {
                            //   backgroundColor: !disable
                            //     ? Colors.white
                            //     : Colors.greyPrimaryConstraint,
                            // },
                            disable && bntPickerDisable,
                            stateProps.stylePicker
                        ]}
                        activeOpacity={!disable ? 0.2 : 1}
                    >
                        <View
                            // eslint-disable-next-line react-native/no-inline-styles
                            style={{
                                flexDirection: 'row',
                                flex: 1
                            }}
                        >
                            {textValue != null ? (
                                <Text style={[styleSheets.text, styLableValue]}>{textValue}</Text>
                            ) : (
                                <VnrText
                                    style={[styleSheets.text, stylePlaceholder]}
                                    i18nKey={stateProps.placeHolder ? stateProps.placeHolder : 'SELECT_ITEM'}
                                />
                            )}
                        </View>

                        {/* nút clear */}
                        {stateProps.clearText == true && textValue != null && (
                            <TouchableOpacity
                                onPress={this.clearDate}
                                // eslint-disable-next-line react-native/no-inline-styles
                                style={{
                                    paddingHorizontal: 5,
                                    height: '100%',
                                    justifyContent: 'center'
                                }}
                            >
                                <IconCancel size={Size.iconSize - 2} color={Colors.grey} />
                            </TouchableOpacity>
                        )}

                        {stateProps.type == 'date' || stateProps.type == undefined ? (
                            <IconDate size={Size.iconSize} color={disable ? Colors.gray_7 : Colors.gray_8} />
                        ) : (
                            <IconTime size={Size.iconSize} color={disable ? Colors.gray_7 : Colors.gray_8} />
                        )}
                    </TouchableOpacity>
                )}
                {
                    <DateTimePickerModal
                        date={valueDate == null ? new Date() : new Date(moment(valueDate))}
                        format="dd/MM/yyyy"
                        isVisible={this.state.setDatePickerVisibility}
                        cancelText="fdf"
                        mode={stateProps.type == 'date' || stateProps.type == undefined ? 'date' : stateProps.type}
                        onConfirm={this.handleConfirm}
                        onCancel={this.hideDatePicker}
                        is24Hour={true}
                        // locale={locales}
                        confirmTextIOS={translate('Confirm')}
                        cancelTextIOS={translate('HRM_Common_Close')}
                    />
                }
            </View>
        );
    }
}
