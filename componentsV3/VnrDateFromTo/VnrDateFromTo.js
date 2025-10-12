import React, { Component } from 'react';
import { CalendarList } from '../../node_modules/react-native-calendars';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    SafeAreaView,
    Modal,
    ScrollView,
    Animated
} from 'react-native';
import moment from 'moment';
import { ToasterSevice } from '../../components/Toaster/Toaster';
import { IconDate, IconSwapright } from '../../constants/Icons';
import {
    Colors,
    CustomStyleSheet,
    Size,
    styleSheets,
    styleValid,
    stylesVnrPickerV3
} from '../../constants/styleConfig';
import VnrText from '../../components/VnrText/VnrText';
import { translate } from '../../i18n/translate';
import { themeStyleCalanderList } from '../../constants/styleConfigV3';
import { RenderButtonChangeShift } from './RenderButtonChangeShift';
import PopupChangeShift from './PopupChangeShift';
import PopupChangeDateFromTo from './PopupChangeDateFromTo';

class VnrDateFromTo extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isShowModal: false,
            range:
                props.onlyChooseEveryDay && props.onlyChooseEveryDay === true
                    ? props.value === null
                        ? []
                        : Object.entries(props.value).length === 0
                            ? []
                            : props.value
                    : props.value === null
                        ? []
                        : Object.entries(props.value).length === 0 || props.value.startDate === null
                            ? []
                            : props.value,
            isEditStartDate: false,
            isEditEndDate: false,
            startDateF: props.value === null ? null : props.value.startDate ? props.value.startDate : null,

            endDateF: props.value === null ? null : props.value.endDate ? props.value.endDate : null,
            isOptionChooseEveryDay: true,
            isOptionChooseAboutDays: false,
            valueEndDateTemp: null,
            animated: new Animated.Value(210),
            isDateChangeShift: true
        };

        this.positionButton = React.createRef(new Animated.Value(0)).current;
        this.isOnRef = React.createRef(false);
    }

    // reset value
    closeModal = () => {
        this.setState({ isShowModal: false, range: {}, valueEndDateTemp: null });
    };

    showModal = () => {
        const { value, isChangeShiftorChangeSchedule, onlyChooseOneDay, onlyChooseEveryDay, displayOptions } = this.props;
        const { range } = this.state;
        let nextState = {};

        // case use controls change shift if not value, default ChooseAboutDays
        if (
            (value && Object.keys(value).length > 0 && value.startDate && value.endDate) ||
            ((!value || Object.keys(value).length === 0) && isChangeShiftorChangeSchedule)
        ) {
            nextState = {
                ...nextState,
                isOptionChooseEveryDay: false,
                isOptionChooseAboutDays: true
            };
        }

        // case use controls change shift, default is 'Shift change day'
        if (Object.entries(value).length > 0 && isChangeShiftorChangeSchedule) {
            nextState = {
                ...nextState,
                isDateChangeShift: true
            };
        }

        if (Object.entries(value).length === 0 && Object.entries(range).length === 0 && !isChangeShiftorChangeSchedule && (!onlyChooseOneDay && !onlyChooseEveryDay && !displayOptions))
            nextState = {
                ...nextState,
                isDateChangeShift: true,
                isEditStartDate: false,
                isEditEndDate: false
            };

        this.setState(
            {
                ...nextState,
                isShowModal: true,
                range: Object.entries(value).length > 0 ? value : range
            },
            () => {
                if (this.props.isChangeShiftorChangeSchedule) {
                    Animated.timing(this.state.animated, {
                        toValue: 0,
                        duration: 250,
                        useNativeDriver: true
                    }).start();
                }
            }
        );
    };

    cancelModal = () => {
        // this.setState({ isShowModal: false, range: {}, isEditStartDate: false, isEditEndDate: false });
        this.setState({
            isShowModal: false,
            range: {},
            isEditStartDate: false,
            isEditEndDate: false,
            startDateF: '',
            endDateF: '',
            valueEndDateTemp: null
        });
    };

    confirmModal = () => {
        const { range, isOptionChooseAboutDays, valueEndDateTemp } = this.state;
        const { displayOptions, onlyChooseOneDay } = this.props;

        if (onlyChooseOneDay && onlyChooseOneDay === true) {
            this.props.onFinish(range);
        } else if (!displayOptions || isOptionChooseAboutDays === true) {
            if (range.startDate && range.endDate) {
                this.props.onFinish({
                    startDate: range.startDate,
                    endDate: range.endDate
                });
            } else if (range.startDate && !range.endDate && valueEndDateTemp) {
                this.props.onFinish({
                    startDate: range.startDate,
                    endDate: valueEndDateTemp
                });
            } else if (range && Array.isArray(range)) {
                this.props.onFinish(range);
            } else {
                ToasterSevice.showWarning('Thiếu cấu hình');
            }
        } else {
            this.props.onFinish(range);
        }

        this.setState({
            isShowModal: false,
            isEditStartDate: false,
            isEditEndDate: false
        });
    };

    handleChooseEveryDay = () => {
        const { range } = this.state;
        let nextState = {
            range:
                range.startDate && range.endDate
                    ? { ...range }
                    : range.startDate && !range.endDate
                        ? [range.startDate]
                        : Array.isArray(this.props.value)
                            ? this.props.value
                            : []
        };
        if (this.props?.isChangeShiftorChangeSchedule) {
            nextState = {
                ...nextState,
                isDateChangeShift: true,
                range: [range?.startDate, range?.endDate]
            };
        }

        this.setState(
            {
                ...nextState,
                isOptionChooseEveryDay: true,
                isOptionChooseAboutDays: false
            },
            () => {
                if (this.props.isChangeShiftorChangeSchedule) {
                    Animated.timing(this.state.animated, {
                        toValue: 0,
                        duration: 250,
                        useNativeDriver: true
                    }).start();
                }
            }
        );
    };

    handleChooseAboutDays = () => {
        this.setState({
            isOptionChooseEveryDay: false,
            isOptionChooseAboutDays: true,
            range: {}
        });
    };

    componentDidMount() {}

    marked = () => {
        const { range, isOptionChooseEveryDay } = this.state;
        const { displayOptions, onlyChooseEveryDay, onlyChooseOneDay } = this.props;

        let marked = {};
        if (onlyChooseOneDay || onlyChooseEveryDay || (displayOptions && isOptionChooseEveryDay)) {
            let days = [];
            if (range.startDate && range.endDate) {
                let start = new Date(range.startDate).getTime();
                let end = new Date(range.endDate || range.startDate).getTime();
                for (let cur = start; cur <= end; cur += 60 * 60 * 24000) {
                    let curStr = new Date(cur).toISOString().substring(0, 10);
                    days.push(curStr);
                }
                this.setState({
                    range: days
                });
            } else if (range.startDate && !range.endDate) {
                days.push(range.startDate);
                this.setState({
                    range: days
                });
            } else {
                days = range;
                // this.setState({
                //     range: [],
                // });
            }
            for (let i = 0; i < days.length; i++) {
                if (days[i]) {
                    marked[days[i]] = {
                        selected: true,
                        color: Colors.primary
                    };
                }
            }
        } else {
            let start = new Date(range.startDate).getTime();
            let end = new Date(range.endDate || range.startDate).getTime();

            for (let cur = start; cur <= end; cur += 60 * 60 * 24000) {
                let curStr = new Date(cur).toISOString().substring(0, 10);
                marked[curStr] = {
                    selected: true,
                    color: (cur == start) === true || (cur == end) === true ? Colors.primary : Colors.blue_3,
                    startingDay: cur == start,
                    endingDay: cur == end,
                    customContainerStyle: {
                        borderTopRightRadius: 17,
                        borderBottomRightRadius: 17,
                        borderTopLeftRadius: 17,
                        borderBottomLeftRadius: 17
                    },
                    textColor: (cur == start) === true || (cur == end) === true ? Colors.white : Colors.gray_10
                };
            }
        }
        return marked;
    };

    handleDayPress(day) {
        const { range, isOptionChooseEveryDay, isEditStartDate, isEditEndDate, isDateChangeShift } = this.state;
        const { displayOptions, onlyChooseEveryDay, onlyChooseOneDay, isChangeShiftorChangeSchedule } = this.props;
        if (onlyChooseOneDay) {
            this.setState({
                range: [
                    // ...range,
                    day.dateString
                ]
            });
        } else if (onlyChooseEveryDay || (displayOptions && isOptionChooseEveryDay)) {
            if (range && range.length !== 0 && range.length !== undefined) {
                // case for change shift
                // if control is date change shift => choose date auto switch date change
                if (isChangeShiftorChangeSchedule) {
                    let nextState = {};
                    if (isDateChangeShift) {
                        nextState = {
                            range: [day.dateString, range[1]],
                            isDateChangeShift: false
                        };
                    } else {
                        nextState = {
                            range: [range[0], day.dateString]
                        };
                    }
                    this.setState(nextState);
                    return;
                }

                let temp = range.find((value) => {
                    if (day.dateString === value) {
                        return value;
                    }
                });

                if (temp) {
                    this.setState({
                        range: range.filter((e) => {
                            return e !== temp;
                        })
                    });
                } else {
                    this.setState({
                        range: [...range, day.dateString]
                    });
                }
            } else {
                // case not yet choose date change shift or date change
                // after choose date change shift => auto swith to date change
                let nextState = {
                    range: [day.dateString]
                };
                if (isChangeShiftorChangeSchedule) {
                    if (isDateChangeShift)
                        nextState = {
                            ...nextState,
                            isDateChangeShift: false
                        };
                    else
                        nextState = {
                            ...nextState,
                            range: [null, day.dateString],
                            isDateChangeShift: true
                        };
                }
                this.setState({
                    ...nextState
                });
            }
        } else if (isEditStartDate || isEditEndDate) {
            if (isEditStartDate) {
                if (moment(range.endDate).isAfter(day.dateString, 'day')) {
                    this.setState({
                        range: {
                            ...range,
                            startDate: day.dateString
                        },
                        isDateChangeShift: false
                    });
                } else {
                    this.setState({
                        range: {
                            startDate: day.dateString
                        },
                        isDateChangeShift: false,
                        isEditStartDate: false,
                        isEditEndDate: false
                    });
                }
            } else if (moment(range.startDate).isBefore(day.dateString, 'day')) {
                this.setState({
                    range: {
                        ...range,
                        endDate: day.dateString
                    }
                });
            } else {
                this.setState({
                    range: {
                        startDate: day.dateString
                    },
                    isDateChangeShift: false,
                    isEditStartDate: false,
                    isEditEndDate: false
                });
            }
        } else if (range.startDate && !range.endDate) {
            if (moment(range.startDate).isBefore(day.dateString, 'day')) {
                let newRange = { ...range, ...{ endDate: day.dateString } };
                this.setState({ range: newRange });
                // if (this.props.onRangeSelected && this.props.onRangeSelected(newRange)) {

                // }
            } else {
                this.setState({
                    range: {
                        startDate: day.dateString
                    },
                    isDateChangeShift: false
                });
            }
        } else {
            this.setState({
                range: {
                    startDate: day.dateString
                },
                isDateChangeShift: false,
                valueEndDateTemp: day.dateString
            });
        }
    }

    handleChangeDate = () => {};

    onRefreshControl = (nextProps) => {
        // let _state = this.state;
        // _state = defaultState;
        // _state.stateProps = nextProps;

        // this.isModalOpened = false;
        // if (this.props.autoBind) {
        //     this.getData();
        // }

        this.setState({
            range: nextProps.value
        });
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (
            this.state.isShowModal !== nextState.isShowModal ||
            this.state.isEditStartDate !== nextState.isEditStartDate ||
            this.state.isEditEndDate !== nextState.isEditEndDate ||
            this.props.valueDisplay !== nextProps.valueDisplay ||
            this.state.isDateChangeShift !== nextState.isDateChangeShift
        ) {
            return true;
        } else if (this.state.range === nextState.range) {
            if (this.props.onlyChooseEveryDay === false && this.props.displayOptions === true) {
                if (
                    this.state.isOptionChooseEveryDay !== nextState.isOptionChooseEveryDay ||
                    this.state.isOptionChooseAboutDays !== nextState.isOptionChooseAboutDays
                ) {
                    return true;
                } else if (nextProps.refresh === this.props.refresh) {
                    return false;
                } else {
                    return true;
                }
            } else if (nextProps.refresh === this.props.refresh) {
                return false;
            } else {
                return true;
            }
        } else {
            return true;
        }
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.refresh !== this.props.refresh) {
            this.onRefreshControl(nextProps);
        }
    }

    handleRefresh = () => {
        const { range, isOptionChooseEveryDay } = this.state;
        const { displayOptions, onlyChooseEveryDay, onlyChooseOneDay } = this.props;
        if (Object.entries(range).length !== 0) {
            if (
                (onlyChooseOneDay && onlyChooseOneDay === true) ||
                (onlyChooseEveryDay && onlyChooseEveryDay === true) ||
                (displayOptions && isOptionChooseEveryDay)
            ) {
                this.setState(
                    {
                        range: [],
                        valueEndDateTemp: null
                    },
                    () => {
                        this.props.onFinish([]);
                    }
                );
            } else {
                this.setState(
                    {
                        range: {},
                        valueEndDateTemp: null
                    },
                    () => {
                        this.props.onFinish({});
                    }
                );
            }
        }
    };

    render() {
        const {
            value,
            displayOptions,
            onlyChooseEveryDay,
            lable,
            disable,
            fieldValid,
            placeHolder,
            stylePicker,
            stylePlaceholder,
            styContentPicker,
            isOptionFilterQuicly,
            valueDisplay,
            isControll,
            onlyChooseOneDay,
            isCheckEmpty,
            layoutFilter,
            isHiddenIcon,
            isChangeShiftorChangeSchedule,
            fieldName
        } = this.props;
        const {
            isOptionChooseAboutDays,
            isEditStartDate,
            isEditEndDate,
            range,
            isShowModal,
            isOptionChooseEveryDay,
            valueEndDateTemp,
            isDateChangeShift
        } = this.state;
        let statusBtn =
            valueEndDateTemp ||
            (onlyChooseOneDay && onlyChooseOneDay === true) ||
            (onlyChooseEveryDay && onlyChooseEveryDay === true) ||
            (displayOptions && displayOptions == true && isOptionChooseEveryDay === true)
                ? range.length === 0 || Object.keys(range).length === 0
                    ? false
                    : true
                : range.startDate && range.endDate
                    ? true
                    : false;

        let statusMarkingType =
            (onlyChooseOneDay && onlyChooseOneDay === true) ||
            (onlyChooseEveryDay && onlyChooseEveryDay === true) ||
            (displayOptions && displayOptions == true && isOptionChooseEveryDay === true)
                ? true
                : false;

        let isShowErr = false,
            current = null;
        let dateChangeShift = null;
        let dateChange = null;
        let textChangeShiftorChangeSchedule = null;
        if (
            isControll &&
            isControll === true &&
            fieldValid &&
            fieldValid === true &&
            isCheckEmpty &&
            isCheckEmpty === true &&
            (value === null || value === undefined)
        ) {
            isShowErr = true;
        } else {
            isShowErr = false;
        }

        if (value && Object.keys(value).length > 0) {
            if (value.startDate) {
                current = moment(value.startDate).format('YYYY-MM-DD');
            } else if (Array.isArray(value) && value.length > 0) {
                current = moment(value[0]).format('YYYY-MM-DD');
            } else {
                current = moment(new Date()).format('YYYY-MM-DD');
            }
        } else {
            current = moment(new Date()).format('YYYY-MM-DD');
        }

        // case use for change shift
        if (range && isChangeShiftorChangeSchedule) {
            if (Array.isArray(range) && range.length > 0) {
                dateChangeShift = range[0];
                dateChange = range.length > 1 ? range[range.length - 1] : null;
                textChangeShiftorChangeSchedule = (
                    <Text style={[styleSheets.text, styles.styLableValue]} numberOfLines={1}>
                        {`${moment(range[0]).format('DD/MM/YYYY')}`}{' '}
                        <IconSwapright size={Size.text} color={Colors.gray_10} />{' '}
                        <Text
                            style={[styleSheets.text, styles.styLableValue, styles.styLbRightValue]}
                            numberOfLines={1}
                        >
                            {`${moment(range[1]).format('DD/MM/YYYY')}`}
                        </Text>
                    </Text>
                );
            } else {
                dateChangeShift = range.startDate;
                dateChange = range.endDate;
            }
        }

        // if (isChangeShiftorChangeSchedule && (Array.isArray(value) && value.length > 0)) {
        //     textChangeShiftorChangeSchedule = <Text style={[styleSheets.text, styles.styLableValue]} numberOfLines={1}>
        //         {`${moment(value[0]).format('DD/MM/YYYY')}`}
        //         {' '}
        //         <IconSwapright size={Size.text} color={Colors.gray_10} />
        //         {' '}
        //         <Text
        //             style={[
        //                 styleSheets.text,
        //                 styles.styLableValue,
        //                 styles.styLbRightValue
        //             ]}
        //             numberOfLines={1}
        //         >
        //             {`${moment(value[1]).format('DD/MM/YYYY')}`}
        //         </Text>
        //     </Text>
        // }

        return (
            <View
                style={[
                    isOptionFilterQuicly === true ? styleSheets.size100 : styContentPicker ? styContentPicker : styles.styContentPicker,
                    !isControll && !isOptionFilterQuicly && CustomStyleSheet.height(60),
                    layoutFilter && { ...CustomStyleSheet.height(75), ...CustomStyleSheet.borderBottomWidth(0) }
                ]}
            >
                {layoutFilter && (
                    <TouchableOpacity onPress={() => this.showModal()} style={stylesVnrPickerV3.styViewLayoutFilter}>
                        <VnrText style={[styleSheets.lable, stylesVnrPickerV3.styLableLayoutFilter]} i18nKey={lable} />
                    </TouchableOpacity>
                )}

                <TouchableOpacity
                    accessibilityLabel={`VnrPicker-${fieldName ? fieldName : lable}`}
                    onPress={() => (!disable ? this.showModal() : null)}
                    style={[
                        styles.styBntPicker,
                        stylePicker,
                        isShowErr && {
                            ...CustomStyleSheet.borderBottomColor(Colors.red),
                            ...CustomStyleSheet.borderBottomWidth(1.5)
                        },
                        disable && styles.bntPickerDisable,
                        isOptionFilterQuicly === true && CustomStyleSheet.paddingHorizontal(0)
                    ]}
                    activeOpacity={!disable ? 0.2 : 1}
                >
                    {Array.isArray(valueDisplay) && valueDisplay.length > 0 ? (
                        <View
                            style={[
                                { ...CustomStyleSheet.flex(1), ...CustomStyleSheet.paddingRight(12) },
                                styles.styRightPicker
                            ]}
                        >
                            <ScrollView
                                contentContainerStyle={[styles.styScrollView]}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            >
                                {valueDisplay.map((item, index) => {
                                    return (
                                        <TouchableOpacity
                                            key={index}
                                            onPress={() => (!disable ? this.showModal() : null)}
                                        >
                                            <Text style={styleSheets.text}>{item},</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    ) : (
                        <View
                            style={[
                                styles.styBntPicker,
                                CustomStyleSheet.paddingHorizontal(0),
                                stylePicker,
                                disable && styles.bntPickerDisable,
                                isOptionFilterQuicly === true && CustomStyleSheet.paddingHorizontal(0)
                            ]}
                        >
                            <View
                                style={[
                                    styles.styLeftPicker,
                                    isControll && isControll === true && styles.onlyFlRowSpaceBetween
                                ]}
                            >
                                {lable && (
                                    <View style={[styles.styVlPicker, CustomStyleSheet.flex(0.35)]}>
                                        {isControll && !isHiddenIcon && (
                                            <IconDate
                                                size={Size.iconSize}
                                                color={disable ? Colors.gray_7 : Colors.gray_8}
                                            />
                                        )}

                                        <VnrText
                                            numberOfLines={2}
                                            style={[
                                                styleSheets.text,
                                                styles.styLbNotHaveValuePicker,
                                                !isControll && {
                                                    ...CustomStyleSheet.marginLeft(0),
                                                    ...CustomStyleSheet.marginBottom(3)
                                                },
                                                isHiddenIcon && CustomStyleSheet.marginLeft(0)
                                            ]}
                                            i18nKey={layoutFilter ? placeHolder : lable}
                                        />
                                        {fieldValid && <VnrText style={[styleSheets.text, styleValid]} i18nKey={'*'} />}
                                    </View>
                                )}

                                <View style={[styles.styVlPicker, styles.enableLable, !lable && [styles.disableLable, CustomStyleSheet.flex(1)]]}>
                                    {value.startDate && value.endDate ? (
                                        <View style={styles.styVlPickerFromTo}>
                                            <Text style={[styleSheets.text, styles.styLableValue]} numberOfLines={1}>
                                                {`${moment(value.startDate).format('DD/MM/YYYY')}`}{' '}
                                                <IconSwapright size={Size.text} color={Colors.gray_10} />{' '}
                                                <Text
                                                    style={[
                                                        styleSheets.text,
                                                        styles.styLableValue,
                                                        styles.styLbRightValue
                                                    ]}
                                                    numberOfLines={1}
                                                >
                                                    {`${moment(value.endDate).format('DD/MM/YYYY')}`}
                                                </Text>
                                            </Text>
                                            {/* <IconSwapright size={Size.text} color={Colors.gray_10} />
                                               <Text style={[styleSheets.text, styles.styLableValue, styles.styLbRightValue]} numberOfLines={1}>
                                                   {`${moment(value.endDate).format('DD/MM/YYYY')}`}
                                               </Text> */}
                                        </View>
                                    ) : value && Array.isArray(value) && value.length > 0 ? (
                                        value.length === 1 ? (
                                            <Text style={[styleSheets.text, styles.styLableValue]}>
                                                {moment(value[0]).format('DD/MM/YYYY')}
                                            </Text>
                                        ) : textChangeShiftorChangeSchedule ? (
                                            textChangeShiftorChangeSchedule
                                        ) : (
                                            <Text style={[styleSheets.text, styles.styLableValue]}>
                                                {value.length} {translate('E_DAY_LOWERCASE')}
                                            </Text>
                                        )
                                    ) : (
                                        <VnrText
                                            style={[styleSheets.text, stylePlaceholder]}
                                            i18nKey={
                                                placeHolder && !layoutFilter ? placeHolder : 'HRM_PortalApp_Selectdate'
                                            }
                                        />
                                    )}
                                </View>
                            </View>

                            {isOptionFilterQuicly === true ? null : isControll && isControll === true ? (
                                isShowErr && (
                                    <Image
                                        source={require('../../assets/images/filterV3/IconErrorMauDo.png')}
                                        style={CustomStyleSheet.marginLeft(6)}
                                    />
                                )
                            ) : (
                                <View style={styles.styRightPicker}>
                                    <IconDate size={Size.iconSize} color={disable ? Colors.gray_7 : Colors.gray_8} />
                                </View>
                            )}
                        </View>
                    )}
                </TouchableOpacity>
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={isShowModal} //isShowModal
                    onRequestClose={this.closeModal}
                >
                    <SafeAreaView style={styles.wrapInsideModal} forceInset={{ top: 'always', bottom: 'always' }}>
                        <View
                            style={[
                                styles.wrapHeaderCalender,
                                {
                                    backgroundColor: Colors.gray_2
                                }
                            ]}
                        >
                            <View style={CustomStyleSheet.flex(8.5)}>
                                {onlyChooseOneDay ? (
                                    <View style={[styles.flexD_align_center]}>
                                        <VnrText
                                            style={[styleSheets.text]}
                                            i18nKey={'HRM_PortalApp_VnrDateFromTo_TakeDate'}
                                        />
                                        <Text style={[styleSheets.text, CustomStyleSheet.marginLeft(12)]}>
                                            {range[0] ? moment(new Date(range[0])).format('DD/MM/YYYY') : ''}
                                        </Text>
                                    </View>
                                ) : onlyChooseEveryDay ? (
                                    <VnrText
                                        style={[styleSheets.text]}
                                        i18nKey={'HRM_PortalApp_VnrDateFromTo_TakeDate'}
                                    />
                                ) : displayOptions ? (
                                    isChangeShiftorChangeSchedule ? (
                                        <RenderButtonChangeShift
                                            isChangeShift={isOptionChooseAboutDays}
                                            isChangeDate={isOptionChooseEveryDay}
                                            handleChangeShift={this.handleChooseAboutDays}
                                            handleChangeDate={this.handleChooseEveryDay}
                                        />
                                    ) : (
                                        <View style={[styles.flexD_align_center, CustomStyleSheet.marginRight(10)]}>
                                            <VnrText
                                                style={[styleSheets.text]}
                                                i18nKey={'HRM_PortalApp_VnrDateFromTo_TakeDate'}
                                            />

                                            <View style={[styles.flexD_align_center, CustomStyleSheet.marginLeft(12)]}>
                                                <TouchableOpacity
                                                    accessibilityLabel="VnrDateFromTo-BntEveryDay"
                                                    style={[
                                                        styles.btnOptionChoseDays,
                                                        CustomStyleSheet.marginRight(8),
                                                        isOptionChooseEveryDay === true
                                                            ? { backgroundColor: Colors.primary }
                                                            : { backgroundColor: Colors.Secondary95 }
                                                    ]}
                                                    onPress={() => this.handleChooseEveryDay()}
                                                >
                                                    <VnrText
                                                        style={[
                                                            styleSheets.text,
                                                            isOptionChooseEveryDay === true
                                                                ? { color: Colors.white }
                                                                : { color: Colors.black }
                                                        ]}
                                                        i18nKey={'HRM_PortalApp_VnrDateFromTo_Everyday'}
                                                    />
                                                </TouchableOpacity>
                                                <TouchableOpacity
                                                    accessibilityLabel="VnrDateFromTo-BntAboutDays"
                                                    style={[
                                                        styles.btnOptionChoseDays,
                                                        isOptionChooseAboutDays === true
                                                            ? { backgroundColor: Colors.primary }
                                                            : { backgroundColor: Colors.Secondary95 }
                                                    ]}
                                                    onPress={() => this.handleChooseAboutDays()}
                                                >
                                                    <VnrText
                                                        style={[
                                                            styleSheets.text,
                                                            isOptionChooseAboutDays === true
                                                                ? { color: Colors.white }
                                                                : { color: Colors.black }
                                                        ]}
                                                        i18nKey={'HRM_PortalApp_VnrDateFromTo_SelectDate'}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    )
                                ) : (
                                    <View style={[styles.flexD_align_center, CustomStyleSheet.marginRight(10)]}>
                                        <VnrText
                                            style={[styleSheets.text]}
                                            i18nKey={'HRM_PortalApp_VnrDateFromTo_TakeDate'}
                                        />
                                    </View>
                                )}
                            </View>
                            <View style={styles.flex_def}>
                                <TouchableOpacity
                                    style={[styles.flexD_align_center, CustomStyleSheet.paddingHorizontal(10)]}
                                    onPress={() => this.closeModal()}
                                >
                                    <Image source={require('../../assets/images/filterV3/fi_x.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {/* show calender */}
                        <View style={[styleSheets.flex1AlignCenter]}>
                            <CalendarList
                                // auto jump to date selected
                                current={current ? current : moment(new Date()).format('YYYY-MM-DD')}
                                // Callback which gets executed when visible months change in scroll view. Default = undefined
                                onVisibleMonthsChange={() => {
                                    // console.log('now these months are visible', months);
                                }}
                                // Max amount of months allowed to scroll to the past. Default = 50
                                pastScrollRange={200}
                                // Max amount of months allowed to scroll to the future. Default = 50
                                futureScrollRange={200}
                                // Enable or disable scrolling of calendar list
                                scrollEnabled={true}
                                // Enable or disable vertical scroll indicator. Default = false
                                // calendarStyle={{ marginLeft: -18 }}
                                // calendarHeight={200} period
                                showScrollIndicator={false}
                                markingType={statusMarkingType ? 'custom' : 'period'}
                                theme={themeStyleCalanderList}
                                markedDates={this.marked()}
                                onDayPress={(day) => this.handleDayPress(day)}
                                {...this.props}
                            />
                            {isOptionChooseEveryDay && isChangeShiftorChangeSchedule && (
                                <Animated.View
                                    style={[
                                        styles.wrapPopupChangeShift,
                                        { transform: [{ translateY: this.state.animated }] }
                                    ]}>
                                    <PopupChangeShift
                                        dateChangeShift={dateChangeShift} // ngày đổi ca
                                        dateChange={dateChange} // ngày thay thế
                                        isDateChangeShift={isDateChangeShift}
                                        handleDateChangeShift={(res) => {
                                            this.setState({
                                                isDateChangeShift: res
                                            })
                                        }} />
                                </Animated.View>
                            )
                            }

                            {
                                (!onlyChooseOneDay && !onlyChooseEveryDay && !displayOptions) && (
                                    <Animated.View style={[styles.wrapPopupChangeShift]}>
                                        <PopupChangeDateFromTo
                                            range={range}
                                            isEditStartDate={isEditStartDate}
                                            isEditEndDate={isEditEndDate}
                                            isDateChangeShift={isDateChangeShift}
                                            handleChangeDateFromTo={(isEditStartDate, isEditEndDate) => {
                                                this.setState({
                                                    isEditStartDate: isEditStartDate,
                                                    isEditEndDate: isEditEndDate,
                                                    isDateChangeShift: isEditStartDate
                                                })
                                            }}
                                        />
                                    </Animated.View>
                                )
                            }
                        </View>

                        {/* button */}
                        <View style={styles.wrapButtonHandler}>
                            <View style={CustomStyleSheet.flex(1)}>
                                <TouchableOpacity
                                    accessibilityLabel={'VnrDateFromTo-Refresh'}
                                    style={styles.btnRefresh}
                                    onPress={() => this.handleRefresh()}
                                >
                                    <Image
                                        style={{ width: Size.iconSize, height: Size.iconSize }}
                                        resizeMode="cover"
                                        source={require('../../assets/images/vnrDateFromTo/reset-sm.png')}
                                    />
                                </TouchableOpacity>
                            </View>

                            <View style={{ ...CustomStyleSheet.flex(8.5), ...CustomStyleSheet.marginRight(10) }}>
                                <TouchableOpacity
                                    accessibilityLabel={'VnrDateFromTo-Continue'}
                                    style={[
                                        styles.btnContinue,
                                        statusBtn === true
                                            ? { backgroundColor: Colors.primary }
                                            : { backgroundColor: Colors.gray_3 }
                                    ]}
                                    onPress={() => this.confirmModal()}
                                    disabled={!statusBtn}
                                >
                                    <VnrText
                                        style={[
                                            styleSheets.text,
                                            {
                                                ...CustomStyleSheet.fontSize(Size.text + 1),
                                                ...CustomStyleSheet.fontWeight('400')
                                            },
                                            statusBtn === true ? { color: Colors.white } : { color: Colors.grayD1 }
                                        ]}
                                        i18nKey={statusBtn === true ? 'HRM_Common_Continue' : 'HRM_HR_Task_Date'}
                                    />
                                    <Text style={[styleSheets.text, styles.txtDay]}>
                                        {(onlyChooseEveryDay && onlyChooseEveryDay === true) ||
                                        (onlyChooseEveryDay && onlyChooseEveryDay === true) ||
                                        (displayOptions && displayOptions == true && isOptionChooseEveryDay === true)
                                            ? range.length === 0 || range.length === undefined
                                                ? ''
                                                : `(${range.length} ${translate('E_DAY_LOWERCASE')})`
                                            : range.startDate && range.endDate
                                                ? `(${
                                                    moment(range.endDate).diff(moment(range.startDate), 'days') + 1
                                                } ${translate('E_DAY_LOWERCASE')})`
                                                : range.startDate && !range.endDate && valueEndDateTemp
                                                    ? `(1 ${translate('E_DAY_LOWERCASE')})`
                                                    : ''}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    styContentPicker: {
        height: 53,
        width: '100%',
        borderWidth: 0,
        borderRadius: 0,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    },
    bntPickerDisable: {
        backgroundColor: Colors.gray_3,
        borderWidth: 0
    },
    onlyFlRowSpaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    styVlPicker: {
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center'
    },
    styVlPickerFromTo: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    styLbRightValue: {
        marginLeft: 5
    },
    styLeftPicker: {
        flex: 1
    },
    styBntPicker: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: Size.defineSpace,
        backgroundColor: Colors.white,
        alignItems: 'center'
    },
    flex_def: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    wrapInsideModal: {
        flex: 1,
        backgroundColor: Colors.white,
        borderRadius: 8
    },

    wrapHeaderCalender: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 6,
        paddingLeft: 12
    },

    wrapButtonHandler: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        paddingHorizontal: 16,
        zIndex: 99,
        elevation: 99,
        paddingVertical: 12,
        // borderTopWidth: 1,
        // borderTopColor: "#D9D9D9",
        backgroundColor: Colors.white
    },
    styLableValue: {
        fontWeight: '500',
        fontSize: Size.text + 1
    },
    styLbNotHaveValuePicker: {
        fontSize: Size.text + 1,
        color: Colors.gray_8,
        marginLeft: Size.defineHalfSpace
    },

    btnOptionChoseDays: {
        paddingHorizontal: 8,
        paddingVertical: 6,
        borderRadius: Size.borderRadiusBotton
    },

    flexD_align_center: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    btnContinue: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,

        borderRadius: Size.borderRadiusBotton,
        paddingVertical: 10
    },

    btnRefresh: {
        alignItems: 'center',
        paddingVertical: 10
    },

    styRightPicker: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    enableLable: { flex: 0.6, justifyContent: 'flex-end' },
    disableLable: { justifyContent: 'flex-start', paddingTop: 4 },
    txtDay: {
        color: Colors.white,
        fontSize: Size.text + 1,
        fontWeight: '400',
        marginLeft: 6
    },

    wrapPopupChangeShift: {
        position: 'absolute',
        bottom: 12,
        zIndex: 99,
        backgroundColor: Colors.gray_4,
        padding: 6,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 100,

        // shadow for ios
        shadowColor: Colors.black_transparent_7,
        shadowOffset: { width: 0.5, height: 0.5 },
        shadowOpacity: 0.5,
        shadowRadius: 5,

        // shadow for android
        elevation: 5
    }
});

export default VnrDateFromTo;
