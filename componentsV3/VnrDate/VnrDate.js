/* eslint-disable no-console */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import moment from 'moment';
import { IconCancel, IconDate, IconTime, IconWarn } from '../../constants/Icons';
import {
    Colors,
    CustomStyleSheet,
    Size,
    styleSheets,
    stylesVnrPickerV3,
    styleValid
} from '../../constants/styleConfig';
import VnrText from '../../components/VnrText/VnrText';
import Vnr_Function from '../../utils/Vnr_Function';
import { translate } from '../../i18n/translate';
import { CalendarList } from '../../node_modules/react-native-calendars';
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

    handleConfirm = (date) => {
        const { stateProps } = this.state;

        if (stateProps.format && stateProps.format == 'MM/YYYY') {
            date = new Date(moment(date).startOf('month'));
        }

        if (
            !Vnr_Function.CheckIsNullOrEmpty(stateProps.response) &&
            stateProps.response == 'string' &&
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

    changeDisable = (bool) => {
        const stateProps = { ...this.state.stateProps };
        if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.disable) && typeof stateProps.disable === 'boolean') {
            stateProps.disable = bool;
            this.setState({ stateProps: stateProps });
        }
    };

    onRefreshControl = (nextProps) => {
        const valueDate = !Vnr_Function.CheckIsNullOrEmpty(nextProps.value) ? new Date(moment(nextProps.value)) : null;

        this.setState({ stateProps: nextProps, valueDate });
    };

    componentDidMount() {
        const { autoShowModal } = this.props;
        if (autoShowModal) {
            this.showDatePicker();
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
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

    returnIconType = (type, disable) => {
        if (type == 'date' || type == 'datetime' || type == 'datefromto' || type == undefined) {
            return <IconDate size={Size.iconSize} color={disable ? Colors.gray_7 : Colors.gray_8} />;
        } else if (type == 'time') {
            return <IconTime size={Size.iconSize} color={disable ? Colors.gray_7 : Colors.gray_8} />;
        }
    };

    returnPickerType = (type) => {
        const { stateProps, valueDate } = this.state;

        if (type == 'date' || type == 'datetime' || type == 'time' || type == undefined) {
            return (
                <DateTimePickerModal
                    date={valueDate == null ? new Date() : new Date(moment(valueDate))}
                    format="dd/MM/yyyy"
                    isVisible={this.state.setDatePickerVisibility}
                    mode={stateProps.type == 'date' || stateProps.type == undefined ? 'date' : stateProps.type}
                    onConfirm={this.handleConfirm}
                    onCancel={this.hideDatePicker}
                    is24Hour={true}
                    // locale={locales}
                    confirmTextIOS={translate('Confirm')}
                    cancelTextIOS={translate('HRM_Common_Close')}
                />
            );
        } else if (type == 'datefromto') {
            return (
                <CalendarList
                    // Callback which gets executed when visible months change in scroll view. Default = undefined
                    onVisibleMonthsChange={(months) => {
                        console.log('now these months are visible', months);
                    }}
                    // Max amount of months allowed to scroll to the past. Default = 50
                    pastScrollRange={50}
                    // Max amount of months allowed to scroll to the future. Default = 50
                    futureScrollRange={50}
                    // Enable or disable scrolling of calendar list
                    scrollEnabled={true}
                    // Enable or disable vertical scroll indicator. Default = false
                    showScrollIndicator={true}
                    // ...calendarParams
                    {...this.props}
                />
            );
        }
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.setDatePickerVisibility !== nextState.setDatePickerVisibility) {
            return true;
        } else if (this.state.valueDate === nextState.valueDate) {
            if (nextProps.refresh === this.props.refresh) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    render() {
        const { stateProps, valueDate } = this.state;
        const { isOptionFilterQuicly, layoutFilter, placeHolder, lable, fieldValid, isCheckEmpty, isHiddenIcon } = this.props;

        let textValue = null;
        // let displayControl = true;

        let isShowErr = false;
        if (
            fieldValid &&
            fieldValid === true &&
            isCheckEmpty &&
            isCheckEmpty === true &&
            (valueDate === null || valueDate === undefined)
        ) {
            isShowErr = true;
        } else {
            isShowErr = false;
        }

        if (valueDate != null) {
            textValue = moment(valueDate).format(stateProps.format);
        }
        let disable = false;
        if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.disable) && typeof stateProps.disable === 'boolean') {
            disable = stateProps.disable;
        }
        // if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.hideControl) && stateProps.hideControl) {
        //     displayControl = false;
        // }

        return (
            <View
                style={[
                    { width: '100%' },
                    isOptionFilterQuicly === true ? { height: '100%' } : stylesVnrPickerV3.styContentPicker,
                    layoutFilter && { height: 65 }
                ]}
            >
                {
                    layoutFilter && (
                        <View
                            style={CustomStyleSheet.marginHorizontal(Size.defineSpace)}
                        >
                            <VnrText
                                style={[styleSheets.lable, stylesVnrPickerV3.styLableLayoutFilter]}
                                numberOfLines={1}
                                i18nKey={lable}
                            />
                        </View>
                    )
                }

                <TouchableOpacity
                    accessibilityLabel={`VnrDate-${stateProps.textField ? stateProps.textField : stateProps.lable}`}
                    onPress={() => (!disable ? this.showDatePicker() : null)}
                    style={[
                        stylesVnrPickerV3.styBntPicker,
                        stateProps.stylePicker,
                        isShowErr && stylesVnrPickerV3.styBntPickerError,
                        disable && stylesVnrPickerV3.bntPickerDisable,
                        (isOptionFilterQuicly === true || layoutFilter) && { borderBottomWidth: 0 }
                    ]}
                    activeOpacity={!disable ? 0.2 : 1}
                >
                    <View
                        style={[
                            stylesVnrPickerV3.styLeftPicker,
                            lable && stylesVnrPickerV3.onlyFlRowSpaceBetween,
                            CustomStyleSheet.alignItems('center')
                        ]}
                    >
                        {lable && (
                            <View style={stylesVnrPickerV3.styLbPicker}>
                                {isHiddenIcon ? <View /> : stateProps.type && stateProps.type === 'time' ? (
                                    <IconTime size={Size.iconSize} color={disable ? Colors.gray_7 : Colors.gray_8} />
                                ) : (
                                    <IconDate size={Size.iconSize} color={disable ? Colors.gray_7 : Colors.gray_8} />
                                )}

                                <VnrText
                                    style={[
                                        styleSheets.text,
                                        stylesVnrPickerV3.styLbNotHaveValuePicker,
                                        CustomStyleSheet.marginLeft(0)
                                        // { marginLeft: 12 },
                                        // textValue === null
                                        //     ? stylesVnrPickerV3.styLbHaveValuePicker
                                        //     : stylesVnrPickerV3.styLbNotHaveValuePicker,
                                    ]}
                                    i18nKey={layoutFilter ? placeHolder : lable}
                                />
                                {stateProps.fieldValid && (
                                    <VnrText style={[styleSheets.text, styleValid]} i18nKey={'*'} />
                                )}
                            </View>
                        )}

                        <View style={[stylesVnrPickerV3.styVlPicker, this.props?.isNewUIValue && stylesVnrPickerV3.wrapRightLabel]}>
                            {textValue != null ? (
                                <Text style={[styleSheets.text, stylesVnrPickerV3.styLableValue]} numberOfLines={1}>
                                    {textValue}
                                </Text>
                            ) : (
                                <VnrText
                                    style={[styleSheets.text, stylesVnrPickerV3.stylePlaceholder]}
                                    i18nKey={placeHolder && !layoutFilter ? placeHolder : 'HRM_PortalApp_SelectTime'}
                                />
                            )}
                        </View>
                    </View>

                    <View style={stylesVnrPickerV3.styRightPicker}>
                        {isShowErr === true ? (
                            <View style={stylesVnrPickerV3.styBtnClear}>
                                <IconWarn color={Colors.red} size={Size.iconSize - 2} />
                            </View>
                        ) : (
                            stateProps.clearText == true &&
                            textValue != null && (
                                <TouchableOpacity onPress={this.clearDate} style={stylesVnrPickerV3.styBtnClear}>
                                    <IconCancel size={Size.iconSize - 2} color={Colors.grey} />
                                </TouchableOpacity>
                            )
                        )}
                    </View>
                </TouchableOpacity>
                {this.returnPickerType(stateProps.type)}
            </View>
        );
    }
}
