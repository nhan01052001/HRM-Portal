/* eslint-disable no-console */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Colors, Size, styleSheets, styleSafeAreaView, CustomStyleSheet } from '../../constants/styleConfig';
import { translate } from '../../i18n/translate';
import VnrText from '../../components/VnrText/VnrText';
import VnrLoading from '../../components/VnrLoading/VnrLoading';
import EmptyData from '../../components/EmptyData/EmptyData';
import { IconBack, IconNext } from '../../constants/Icons';
import Modal from 'react-native-modal';
import { FlatList } from 'react-native-gesture-handler';

export default class VnrYearPicker extends Component {
    constructor(props) {
        super(props);
        this.state = {
            listYears: null,
            isModalVisible: false,
            indexYearSelect: 0,
            yearSelect: null,
            isVisibleLoading: true,
            refreshList: false
        };

        this.itemScroll = null;
        this.dataConfirm = null;
        this.refScrollView = null;
    }

    setDataConfirm = data => {
        this.dataConfirm = data;
    };
    getDataConfirm = () => {
        return this.dataConfirm;
    };

    initYears = () => {
        const { maxYear, minYear, value } = this.props;

        let listLastYear = [],
            listNextYear = [];
        // lấy quá khứ 10 năm , tương lại 10 năm
        for (let i = 0; i <= LENGTH_GET_YEAR; i++) {
            let lastYear = [value - i],
                nextYear = value + i;

            if (minYear && maxYear) {
                if (lastYear > minYear - 3) listLastYear = [...lastYear, ...listLastYear];

                if (i > 0 && nextYear < maxYear + 3) listNextYear.push(nextYear);
            } else {
                listLastYear = [...lastYear, ...listLastYear];
                if (i > 0) listNextYear.push(nextYear);
            }
        }

        const newYears = listLastYear.concat(listNextYear),
            indexItemSelected = newYears.findIndex(e => e == value);

        this.setDataConfirm({ data: value, index: indexItemSelected });

        this.setState({
            listYears: newYears,
            indexYearSelect: indexItemSelected,
            yearSelect: value,
            isVisibleLoading: false,
            refreshList: !this.state.refreshList
        });
    };

    componentDidMount() {
        this.initYears();
    }

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

    onPressItem = indexItem => () => {
        const { listYears } = this.state;
        let itemScroll = listYears[indexItem];

        if (indexItem < 0) return;

        this.scrollToIndex(indexItem - LENGTH_LAST_YAER_DISPLAY);

        this.setState({
            indexYearSelect: indexItem,
            yearSelect: itemScroll
        });
    };

    scrollToIndex = index => {
        try {
            this.refScrollView !== null && this.refScrollView.scrollToIndex({ animated: true, index: index });
        } catch (error) {
            console.log(error);
        }
    };

    closeModal = () => {
        const { refreshList } = this.state;
        let dataConfirm = this.getDataConfirm();

        if (dataConfirm != null) {
            this.setState({
                isModalVisible: false,
                yearSelect: dataConfirm.data,
                indexYearSelect: dataConfirm.index,
                refreshList: !refreshList
            });
        }
    };

    showPicker = () => {
        this.setState({ isModalVisible: true });
    };

    saveUpdate = () => {
        const { listYears, indexYearSelect } = this.state,
            { onFinish } = this.props;
        this.setDataConfirm({
            data: listYears[indexYearSelect],
            index: indexYearSelect
        });

        this.setState({ isModalVisible: false }, () => {
            onFinish({
                year: listYears[indexYearSelect]
            });
        });
    };

    nextYear = () => {
        const { indexYearSelect, listYears } = this.state,
            { onFinish } = this.props,
            indexNext = indexYearSelect + 1;
        if (indexNext < listYears.length - 2) {
            let itemSelect = listYears[indexNext];
            this.setDataConfirm({ data: itemSelect, index: indexNext });
            this.setState(
                {
                    indexYearSelect: indexNext,
                    yearSelect: itemSelect
                },
                () => {
                    onFinish({ year: itemSelect });
                }
            );
        }
    };

    preYear = () => {
        const { indexYearSelect, listYears } = this.state,
            { onFinish } = this.props,
            indexPre = indexYearSelect - 1;
        if (indexPre > 1) {
            let itemSelect = listYears[indexPre];
            this.setDataConfirm({ data: itemSelect, index: indexPre });
            this.setState(
                {
                    indexYearSelect: indexPre,
                    yearSelect: itemSelect
                },
                () => {
                    onFinish({ year: itemSelect });
                }
            );
        }
    };

    render() {
        const { isModalVisible, listYears, indexYearSelect, isVisibleLoading } = this.state,
            { value, stylePicker, disable } = this.props;
        let viewListYears = <View />;
        if (isVisibleLoading) {
            viewListYears = <VnrLoading size="small" isVisible={isVisibleLoading} />;
        } else if (listYears != null && listYears.length > 0) {
            viewListYears = (
                <View style={[styles.contetList]}>
                    <View style={styles.styViewTop} pointerEvents="none" />
                    <View style={styles.styViewSelected} />
                    <View style={styles.styViewBottom} pointerEvents="none" />
                    <FlatList
                        ref={ref => (this.refScrollView = ref)}
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
            viewListYears = <EmptyData messageEmptyData={'EmptyData'} />;
        }
        return (
            <View style={CustomStyleSheet.flex(1)}>
                <TouchableOpacity
                    style={[styles.styBntPicker, stylePicker, disable && { backgroundColor: Colors.gray_4 }]}
                    onPress={this.showPicker}
                    disabled={disable}
                >
                    <TouchableOpacity disabled={disable} onPress={this.preYear} style={styles.styBntNextPre}>
                        <IconBack size={Size.iconSize} color={Colors.primary} />
                    </TouchableOpacity>
                    <Text style={[styleSheets.text, styles.styValuePicker]}>
                        {translate('E_YEAR')} {value}
                    </Text>
                    <TouchableOpacity disabled={disable} onPress={this.nextYear} style={styles.styBntNextPre}>
                        <IconNext size={Size.iconSize} color={Colors.primary} />
                    </TouchableOpacity>
                </TouchableOpacity>

                <View style={CustomStyleSheet.flex(1)}>
                    <Modal
                        onBackButtonPress={() => this.closeModal()}
                        key={'@MODAL_YEAR_PICKER'}
                        isVisible={isModalVisible}
                        onBackdropPress={() => this.closeModal()}
                        customBackdrop={
                            <TouchableWithoutFeedback onPress={() => null}>
                                <View
                                    style={styles.styDrop}
                                />
                            </TouchableWithoutFeedback>
                        }
                    >
                        <SafeAreaView {...styleSafeAreaView} style={styles.styViewModal}>
                            <View style={styles.container}>
                                {listYears != null}

                                {viewListYears}

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
    styDrop : {
        flex: 1,
        backgroundColor: Colors.black,
        opacity: 0.5
    },
    styViewModal: {
        // backgroundColor: Colors.white,
        position: 'absolute',
        bottom: 0,
        // borderTopLeftRadius: 15,
        // borderTopRightRadius: 15,
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
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        paddingBottom: Size.defineSpace / 2,
        marginBottom: Size.defineSpace / 2,
        position: 'relative'
    },
    styBntPicker: {
        height: Size.heightInput,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        marginHorizontal: Size.defineSpace,
        borderRadius: 8
        // paddingHorizontal: 8,
    },
    styValuePicker: {
        fontWeight: '500'
    },
    styleViewBntApprove: {
        flexDirection: 'row'
        // marginTop: Size.defineSpace,
    },
    styItemYear: {
        height: HEIGHT_ITEM,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 1
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
        // zIndex: 2
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
        // borderColor: Colors.black,
        // borderWidth: 0.5,
    },
    bntApprove: {
        flex: 1,
        height: 40,
        borderRadius: 15,
        // backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styTextBntApprove: {
        fontSize: Size.text + 2,
        fontWeight: '500',
        color: Colors.primary
    },
    styBntNextPre: {
        // backgroundColor: 'red',
        height: '100%',
        width: 50,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
