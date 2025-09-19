/* eslint-disable no-console */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import moment from 'moment';
import { IconDate } from '../../constants/Icons';
import {
    Colors,
    Size,
    styleSheets,
    styleSafeAreaView,
    stylesVnrPicker,
    CustomStyleSheet,
    stylesVnrPickerV3
} from '../../constants/styleConfig';
import VnrText from '../../components/VnrText/VnrText';
import Vnr_Function from '../../utils/Vnr_Function';
import { SafeAreaView } from 'react-navigation';
import VnrLoading from '../../components/VnrLoading/VnrLoading';
import EmptyData from '../../components/EmptyData/EmptyData';
import Modal from 'react-native-modal';
import { FlatList } from 'react-native-gesture-handler';
import { dataVnrStorage } from '../../assets/auth/authentication';

const LocaleConfig = {
    VN: [
        'Tháng 1',
        'Tháng 2',
        'Tháng 3',
        'Tháng 4',
        'Tháng 5',
        'Tháng 6',
        'Tháng 7',
        'Tháng 8',
        'Tháng 9',
        'Tháng 10',
        'Tháng 11',
        'Tháng 12'
    ],
    EN: [
        'January',
        'February',
        'March',
        'April',
        'May',
        'June',
        'July',
        'August',
        'September',
        'October',
        'November',
        'December'
    ]
};

export default class VnrMonthYear extends Component {
    constructor(props) {
        super(props);
        this.state = {
            valueDate: props.value != null ? new Date(moment(props.value)) : null,
            stateProps: props,
            listYears: null,
            listMonths: [0, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 0, 0],
            setDatePickerVisibility: false,
            indexYearSelect: 0,
            indexMonthSelect: 0,
            yearSelect: null,
            monthSelect: null,
            isVisibleLoading: true,
            refreshList: false
        };

        this.itemScroll = null;
        this.dataConfirm = null;
        this.refScrollView = null;
        this.refScrollViewMonth = null;
    }

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

    changeDisable = (bool) => {
        const stateProps = { ...this.state.stateProps };
        if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.disable) && typeof stateProps.disable === 'boolean') {
            stateProps.disable = bool;
            this.setState({ stateProps: stateProps });
        }
    };

    onRefreshControl = (nextProps) => {
        const valueDate = !Vnr_Function.CheckIsNullOrEmpty(nextProps.value) ? new Date(moment(nextProps.value)) : null;

        this.setState({ stateProps: nextProps, valueDate }, () => {
            this.initMonthsYears();
        });
    };

    componentDidMount() {
        const { autoShowModal } = this.props;
        if (autoShowModal) {
            this.showDatePicker();
        }

        this.initMonthsYears();
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.refresh !== this.props.refresh) {
            this.onRefreshControl(nextProps);
        }
    }

    setDataConfirm = (data) => {
        this.dataConfirm = data;
    };

    getDataConfirm = () => {
        return this.dataConfirm;
    };

    initMonthsYears = () => {
        const { listMonths, valueDate } = this.state;
        const { maxYear, minYear } = this.props;
        let listLastYear = [],
            listNextYear = [];

        let valueYear = valueDate ? valueDate.getFullYear() : new Date().getFullYear(),
            valueMonth = valueDate ? valueDate.getMonth() + 1 : new Date().getMonth() + 1;
        // lấy quá khứ 10 năm , tương lại 10 năm
        for (let i = 0; i <= LENGTH_GET_YEAR; i++) {
            let lastYear = [valueYear - i],
                nextYear = valueYear + i;

            if (minYear && maxYear) {
                if (lastYear > minYear - 3) listLastYear = [...lastYear, ...listLastYear];

                if (i > 0 && nextYear < maxYear + 3) listNextYear.push(nextYear);
            } else {
                listLastYear = [...lastYear, ...listLastYear];
                if (i > 0) listNextYear.push(nextYear);
            }
        }

        const newYears = listLastYear.concat(listNextYear),
            indexItemSelected = newYears.findIndex((e) => e == valueYear),
            indexMonthNow = listMonths.findIndex((e) => e == valueMonth);

        this.setDataConfirm({
            yearSelect: valueYear,
            indexYearSelect: indexItemSelected,
            monthSelect: valueMonth,
            indexMonthSelect: indexMonthNow
        });

        this.setState({
            listYears: newYears,
            indexYearSelect: indexItemSelected,
            indexMonthSelect: indexMonthNow,
            yearSelect: valueYear,
            monthSelect: valueMonth,
            isVisibleLoading: false,
            refreshList: !this.state.refreshList
        });
    };

    onMomentumScrollEnd(event) {
        if (!event) return;
        try {
            const { listYears } = this.state;

            let contentOffset = event.nativeEvent.contentOffset;
            let indexItem = Math.floor(contentOffset.y / HEIGHT_ITEM + LENGTH_LAST_YAER_DISPLAY);

            let itemScroll = listYears[indexItem];

            this.setState({
                indexYearSelect: indexItem,
                yearSelect: itemScroll
            });
        } catch (error) {
            console.log(error, 'error');
        }
    }

    onMomentumScrollEndMonth(event) {
        if (!event) return;
        try {
            const { listMonths } = this.state;

            let contentOffset = event.nativeEvent.contentOffset;
            let indexItem = Math.floor(contentOffset.y / HEIGHT_ITEM + LENGTH_LAST_YAER_DISPLAY);

            let itemScroll = listMonths[indexItem];
            this.setState({
                indexMonthSelect: indexItem,
                monthSelect: itemScroll
            });
        } catch (error) {
            console.log(error, 'error');
        }
    }

    onPressItem = (indexItem) => () => {
        const { listYears } = this.state;
        let itemScroll = listYears[indexItem];

        if (indexItem < 0) return;

        this.scrollToIndex(indexItem - LENGTH_LAST_YAER_DISPLAY);

        this.setState({
            indexYearSelect: indexItem,
            yearSelect: itemScroll
        });
    };

    onPressItemMonth = (indexItem) => () => {
        const { listMonths } = this.state;
        let itemScroll = listMonths[indexItem];

        if (indexItem < 0) return;

        this.scrollToIndexMonths(indexItem - LENGTH_LAST_YAER_DISPLAY);

        this.setState({
            indexMonthSelect: indexItem,
            monthSelect: itemScroll
        });
    };

    scrollToIndex = (index) => {
        try {
            this.refScrollView !== null && this.refScrollView.scrollToIndex({ animated: true, index: index });
        } catch (error) {
            console.log(error);
        }
    };

    scrollToIndexMonths = (index) => {
        try {
            this.refScrollViewMonth !== null && this.refScrollViewMonth.scrollToIndex({ animated: true, index: index });
        } catch (error) {
            console.log(error);
        }
    };

    closeModal = () => {
        const { refreshList } = this.state;
        let dataConfirm = this.getDataConfirm();

        if (dataConfirm != null) {
            this.setState({
                yearSelect: dataConfirm.yearSelect,
                indexYearSelect: dataConfirm.indexYearSelect,
                monthSelect: dataConfirm.monthSelect,
                indexMonthSelect: dataConfirm.indexMonthSelect,
                setDatePickerVisibility: false,
                refreshList: !refreshList
            });
        }

        const { stateProps } = this.state;
        if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.onCancel)) {
            stateProps.onCancel();
        }

        const { autoShowModal } = this.props;
        if (autoShowModal) {
            stateProps.onFinish(null);
        }
    };

    showDatePicker = () => {
        this.setState({ setDatePickerVisibility: true });
    };

    saveUpdate = () => {
        const { listYears, indexYearSelect, indexMonthSelect, monthSelect, yearSelect } = this.state,
            { onFinish } = this.props;

        this.setDataConfirm({
            yearSelect: listYears[indexYearSelect],
            indexYearSelect: indexYearSelect,
            monthSelect: monthSelect,
            indexMonthSelect: indexMonthSelect
        });

        let valueConfirm = new Date(`${monthSelect}/01/${yearSelect}`);

        this.setState({ setDatePickerVisibility: false, valueDate: valueConfirm }, () => {
            onFinish(valueConfirm);
        });
    };

    render() {
        const {
                stateProps,
                valueDate,
                setDatePickerVisibility,
                listYears,
                listMonths,
                indexYearSelect,
                isVisibleLoading,
                indexMonthSelect
            } = this.state,
            { styViewDrop } = stylesVnrPicker.VnrPicker;

        const { isOptionFilterQuicly, layoutFilter, placeHolder, lable } = this.props;
        const language = dataVnrStorage.languageApp;
        const langMonth = LocaleConfig[language ? language : 'VN'];

        let textValue = null,
            disable = false,
            viewListMonthYears = <View />,
            displayControl = true;

        if (valueDate != null) {
            textValue = moment(valueDate).format(stateProps.format);
        }

        if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.disable) && typeof stateProps.disable === 'boolean') {
            disable = stateProps.disable;
        }
        if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.hideControl) && stateProps.hideControl) {
            displayControl = false;
        }

        if (isVisibleLoading) {
            viewListMonthYears = <VnrLoading size="small" isVisible={isVisibleLoading} />;
        } else if (listYears != null && listYears.length > 0) {
            viewListMonthYears = (
                <View style={[styles.contetList]}>
                    <View style={styles.styViewTop} pointerEvents="none" />
                    <View style={styles.styViewSelected} />
                    <View style={styles.styViewBottom} pointerEvents="none" />
                    <FlatList
                        ref={(ref) => (this.refScrollViewMonth = ref)}
                        showsVerticalScrollIndicator={false}
                        extraData={this.state.refreshList}
                        data={listMonths}
                        initialScrollIndex={indexMonthSelect - LENGTH_LAST_YAER_DISPLAY}
                        snapToInterval={HEIGHT_ITEM}
                        decelerationRate={1}
                        pagingEnabled
                        scrollEventThrottle={16}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableWithoutFeedback onPress={this.onPressItemMonth(index)}>
                                    <View style={styles.styItemMonth}>
                                        <Text
                                            style={[
                                                styleSheets.text,
                                                styles.styTextItem,
                                                (index < 2 || index > listMonths.length - 3) &&
                                                    styles.styTextItemDisable
                                            ]}
                                        >
                                            {item !== 0 ? langMonth[item - 1] : ''}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            );
                        }}
                        getItemLayout={(data, index) => ({
                            length: HEIGHT_ITEM,
                            offset: HEIGHT_ITEM * index,
                            index
                        })}
                        onMomentumScrollEnd={this.onMomentumScrollEndMonth.bind(this)}
                        keyExtractor={(item, index) => index}
                    />

                    <FlatList
                        ref={(ref) => (this.refScrollView = ref)}
                        showsVerticalScrollIndicator={false}
                        extraData={this.state.refreshList}
                        data={listYears}
                        initialScrollIndex={indexYearSelect - LENGTH_LAST_YAER_DISPLAY}
                        snapToInterval={HEIGHT_ITEM}
                        decelerationRate={1}
                        pagingEnabled
                        scrollEventThrottle={16}
                        renderItem={({ item, index }) => {
                            return (
                                <TouchableWithoutFeedback onPress={this.onPressItem(index)}>
                                    <View style={styles.styItemYear}>
                                        <Text
                                            style={[
                                                styleSheets.text,
                                                styles.styTextItem,
                                                (index < 2 || index > listYears.length - 3) && styles.styTextItemDisable
                                            ]}
                                        >
                                            {item}
                                        </Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            );
                        }}
                        getItemLayout={(data, index) => ({
                            length: HEIGHT_ITEM,
                            offset: HEIGHT_ITEM * index,
                            index
                        })}
                        onMomentumScrollEnd={this.onMomentumScrollEnd.bind(this)}
                        keyExtractor={(item, index) => index}
                    />
                </View>
                // </ScrollView>
            );
        } else if (!isVisibleLoading) {
            viewListMonthYears = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return (
            <View
                style={[
                    CustomStyleSheet.width('100%'),
                    isOptionFilterQuicly === true ? CustomStyleSheet.height('100%') : stylesVnrPickerV3.styContentPicker,
                    layoutFilter && CustomStyleSheet.height(65)
                ]}
            >
                {layoutFilter && (
                    <View style={CustomStyleSheet.marginHorizontal(Size.defineSpace)}>
                        <VnrText
                            style={[styleSheets.lable, stylesVnrPickerV3.styLableLayoutFilter]}
                            numberOfLines={1}
                            i18nKey={lable}
                        />
                    </View>
                )}

                {displayControl && (
                    <TouchableOpacity
                        onPress={() => (!disable ? this.showDatePicker() : null)}
                        style={[
                            stylesVnrPickerV3.styBntPicker,
                            stateProps.stylePicker,
                            // isShowErr && stylesVnrPickerV3.styBntPickerError,
                            disable && stylesVnrPickerV3.bntPickerDisable,
                            (isOptionFilterQuicly === true || layoutFilter) && CustomStyleSheet.borderBottomWidth(0)
                        ]}
                        activeOpacity={!disable ? 0.2 : 1}
                    >
                        <View
                            style={[stylesVnrPickerV3.styLeftPicker, lable && stylesVnrPickerV3.onlyFlRowSpaceBetween]}
                        >
                            {lable && (
                                <View style={stylesVnrPickerV3.styLbPicker}>
                                    <IconDate size={Size.iconSize} color={disable ? Colors.gray_7 : Colors.gray_8} />

                                    <VnrText
                                        style={[
                                            styleSheets.text,
                                            stylesVnrPickerV3.styLbNotHaveValuePicker
                                        ]}
                                        i18nKey={layoutFilter ? placeHolder : lable}
                                    />
                                    {/* {stateProps.fieldValid && (
                                    <VnrText style={[styleSheets.text, styleValid]} i18nKey={'*'} />
                                )} */}
                                </View>
                            )}

                            <View style={stylesVnrPickerV3.styVlPicker}>
                                {textValue != null ? (
                                    <Text style={[styleSheets.text, stylesVnrPickerV3.styLableValue]} numberOfLines={1}>
                                        {textValue}
                                    </Text>
                                ) : (
                                    <VnrText
                                        style={[styleSheets.text, stylesVnrPickerV3.stylePlaceholder]}
                                        i18nKey={placeHolder && !layoutFilter ? placeHolder : 'SELECT_ITEM'}
                                    />
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                )}

                <Modal
                    onBackButtonPress={() => this.closeModal()}
                    key={'@MODAL_YEAR_PICKER'}
                    isVisible={setDatePickerVisibility}
                    onBackdropPress={() => this.closeModal()}
                    customBackdrop={
                        <TouchableWithoutFeedback onPress={() => null}>
                            <View style={styViewDrop} />
                        </TouchableWithoutFeedback>
                    }
                >
                    <SafeAreaView {...styleSafeAreaView} style={styles.styViewModal}>
                        <View style={styles.container}>
                            {/* {listYears != null} */}

                            {viewListMonthYears}

                            <View style={styles.styleViewBntApprove}>
                                <TouchableOpacity style={styles.bntCancel} onPress={() => this.closeModal()}>
                                    <VnrText
                                        style={[styleSheets.text, { color: Colors.black }]}
                                        i18nKey={'HRM_Common_Close'}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.bntApprove} onPress={this.saveUpdate}>
                                    <VnrText
                                        style={[styleSheets.lable, styles.styTextBntApprove]}
                                        i18nKey={'HRM_Common_Confirm'}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                </Modal>
            </View>
        );
    }
}

const WIDTH_MODAL = Size.deviceWidth - Size.defineSpace * 2,
    HEIGHT_ITEM = 40,
    HEIGHT_BNT = 40,
    HEIGHT_CONTENT = HEIGHT_ITEM * 5 + HEIGHT_BNT + Size.defineSpace * 2,
    LENGTH_GET_YEAR = 30,
    LENGTH_LAST_YAER_DISPLAY = 2;

const styles = StyleSheet.create({
    styViewModal: {
        position: 'absolute',
        bottom: 0,
        borderRadius: 15,
        height: HEIGHT_CONTENT,
        width: WIDTH_MODAL
    },
    container: {
        flex: 1,
        borderRadius: 15,
        backgroundColor: Colors.white,
        paddingHorizontal: Size.defineSpace / 2,
        paddingVertical: Size.defineSpace / 2
    },
    contetList: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        paddingBottom: Size.defineSpace / 2,
        marginBottom: Size.defineSpace / 2,
        position: 'relative'
    },
    styleViewBntApprove: {
        flexDirection: 'row'
    },
    styItemYear: {
        flex: 1,
        height: HEIGHT_ITEM,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        marginRight: Size.defineSpace * 2
    },
    styItemMonth: {
        flex: 1,
        height: HEIGHT_ITEM,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1,
        marginLeft: Size.defineSpace * 2
    },
    styTextItem: {
        fontSize: Size.text + 4,
        fontWeight: '600',
        color: Colors.gray_10
    },
    styTextItemDisable: {
        fontSize: Size.text,
        // fontWeight: '500',
        color: Colors.gray_7
    },
    styViewSelected: {
        backgroundColor: Colors.gray_3,
        position: 'absolute',
        height: HEIGHT_ITEM,
        width: '100%',
        top: HEIGHT_ITEM * 2,
        left: 0,
        borderRadius: 15,
        borderWidth: 0.7,
        borderColor: Colors.gray_5
    },
    styViewTop: {
        position: 'absolute',
        height: HEIGHT_ITEM * 2,
        width: '100%',
        top: 0,
        left: 0,
        backgroundColor: Colors.whileOpacity80,
        opacity: 0.7,
        zIndex: 1
    },
    styViewBottom: {
        position: 'absolute',
        height: HEIGHT_ITEM * 2,
        width: '100%',
        bottom: Size.defineHalfSpace,
        left: 0,
        backgroundColor: Colors.whileOpacity80,
        opacity: 0.7,
        zIndex: 2
    },
    bntCancel: {
        flex: 1,
        height: 40,
        borderRadius: 15,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bntApprove: {
        flex: 1,
        height: 40,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styTextBntApprove: {
        fontSize: Size.text + 2,
        fontWeight: '500',
        color: Colors.primary
    }
});
