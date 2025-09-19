/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-console */
import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import {
    Colors,
    Size,
    styleSheets,
    styleValid,
    stylesVnrPickerV3,
    CustomStyleSheet
} from '../../constants/styleConfig';
import VnrLoading from '../../components/VnrLoading/VnrLoading';
import Vnr_Function from '../../utils/Vnr_Function';
import VnrText from '../../components/VnrText/VnrText';
import ListItem from './ListItem';
// import ListMultiItem from './MultiItem';
import EmptyData from '../../components/EmptyData/EmptyData';
import { translate } from '../../i18n/translate';
import { IconDown, IconPlus, IconWarn } from '../../constants/Icons';
import Modal from 'react-native-modal';
import styleComonAddOrEdit from '../../constants/styleComonAddOrEdit';

const defaultState = {
    isModalVisible: false,
    itemSelected: [],
    isVisibleLoading: false,
    dataPicker: [],
    fullData: null,
    isExceedSize: false
};

export const DATA_WEEKS = [
    {
        ID: 1,
        Text: 'HRM_PortalApp_EveryMonday',
        isChecked: false,
        Value: 'E_MONDAY',
        TextDisPlay: 'HRM_PortalApp_MondayCompact',
        numberWeekday: 1
    },
    {
        ID: 2,
        Text: 'HRM_PortalApp_EveryTuesday',
        isChecked: false,
        Value: 'E_TUESDAY',
        TextDisPlay: 'HRM_PortalApp_TuesdayCompact',
        numberWeekday: 2
    },
    {
        ID: 3,
        Text: 'HRM_PortalApp_EveryWednesday',
        isChecked: false,
        Value: 'E_WEDNESDAY',
        TextDisPlay: 'HRM_PortalApp_WednesdayCompact',
        numberWeekday: 3
    },
    {
        ID: 4,
        Text: 'HRM_PortalApp_EveryThursday',
        isChecked: false,
        Value: 'E_THURSDAY',
        TextDisPlay: 'HRM_PortalApp_ThursdayCompact',
        numberWeekday: 4
    },
    {
        ID: 5,
        Text: 'HRM_PortalApp_EveryFriday',
        isChecked: false,
        Value: 'E_FIRDAY',
        TextDisPlay: 'HRM_PortalApp_FridayCompact',
        numberWeekday: 5
    },
    {
        ID: 6,
        Text: 'HRM_PortalApp_EverySaturday',
        isChecked: false,
        Value: 'E_SATURDAY',
        TextDisPlay: 'HRM_PortalApp_SaturdayCompact',
        numberWeekday: 6
    },
    {
        ID: 7,
        Text: 'HRM_PortalApp_EverySunday',
        isChecked: false,
        Value: 'E_SUNDAY',
        TextDisPlay: 'HRM_PortalApp_SundayCompact',
        numberWeekday: 0
    }
];

export default class VnrPickerWeekDays extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...defaultState,
            ...{ stateProps: props }
        };
        this.dataConfirm = [];
        this.isModalOpened = false;
    }

    setDataConfirm = data => {
        this.dataConfirm = data;
    };

    getDataConfirm = () => {
        return this.dataConfirm;
    };

    opentModal = () => {
        let isVisibleLoading = this.isModalOpened ? false : true;
        this.setState({
            isModalVisible: true,
            isVisibleLoading: isVisibleLoading
        });
    };

    checkItemInArray(arr, item, valueField) {
        if (
            arr.findIndex(value => {
                return value[valueField] == item[valueField];
            }) != -1
        ) {
            return true;
        } else {
            return false;
        }
    }

    handelDataSelect = data => {
        const { valueField } = this.state.stateProps;
        let { itemSelected, fullData } = this.state;
        const { value } = this.props;

        if (!Vnr_Function.CheckIsNullOrEmpty(value) && value.length > 0) {
            itemSelected = [...value];
            data = data.map((item) => {
                if (
                    value.findIndex(_value => {
                        return _value[valueField] == item[valueField];
                    }) != -1
                ) {
                    item.isSelect = true;
                } else {
                    item.isSelect = false;
                }
                return item;
            });
            if (data.length > 0) {
                value.map(item => {
                    if (
                        data.findIndex(_value => {
                            return _value[valueField] == item[valueField];
                        }) < 0
                    ) {
                        item.isSelect = true;
                        data = [...[item], ...data];
                    }
                });
            }
        }

        fullData = data;

        this.setState({
            dataPicker: data,
            fullData: fullData,
            isVisibleLoading: false,
            itemSelected
        });
    };

    getData = () => {
        const { isVisibleLoading } = this.state;
        if (!isVisibleLoading) {
            this.setState({ isVisibleLoading: true });
        }
        if (!Vnr_Function.CheckIsNullOrEmpty(DATA_WEEKS) && Array.isArray(DATA_WEEKS)) {
            const _dataLocal = DATA_WEEKS.map((item) => {
                item.isSelect = false;
                return item;
            });
            this.isModalOpened = true;
            this.handelDataSelect(_dataLocal);
            return;
        }
        this.isModalOpened = true;
        this.handelDataSelect([]);
    };

    closeModal = () => {
        let { itemSelected, dataPicker, stateProps } = this.state;
        const data = this.getDataConfirm();
        itemSelected = [...data];
        if (dataPicker != null && dataPicker.length > 0) {
            dataPicker = dataPicker.map((item) => {
                if (
                    itemSelected.findIndex(value => {
                        return value[stateProps.valueField] == item[stateProps.valueField];
                    }) != -1
                ) {
                    item.isSelect = true;
                } else {
                    item.isSelect = false;
                }
                return item;
            });
        }
        this.setState(
            {
                isModalVisible: false,
                itemSelected: itemSelected,
                dataPicker: dataPicker
            },
            () => {
                stateProps.onFinish(itemSelected, { isClose: true });
            }
        );
    };

    onShowModal = () => {
        if (this.isModalOpened === false) {
            this.getData();
        }
    };

    addItemChecked = (indexItem) => {
        const { valueField, onlyChooseOne } = this.state.stateProps;
        let { itemSelected, dataPicker } = this.state;

        if (onlyChooseOne) {
            dataPicker = dataPicker.map(item => {
                item.isSelect = false;
                return item;
            });

            let itemChecked = dataPicker[indexItem];
            itemChecked.isSelect = true;
            itemSelected = [itemChecked];
        } else {
            let itemChecked = dataPicker[indexItem];
            if (!itemChecked.isSelect)
                // kiem tra isSelect == true thi add vao mang itemSelected
                itemSelected = itemSelected.concat(itemChecked);
            else {
                itemSelected = Vnr_Function.removeObjectInArray(itemSelected, itemChecked, valueField);
            }
            itemChecked.isSelect = !itemChecked.isSelect;
        }

        this.setState({ dataPicker: dataPicker, itemSelected: itemSelected });
    };

    revomeItemSelected = objectItem => {
        let { itemSelected, stateProps, dataPicker } = this.state;
        const List = Vnr_Function.removeObjectInArray(itemSelected, objectItem, stateProps.valueField);
        if (dataPicker != null && dataPicker.length > 0) {
            let indexItemRemove = dataPicker.findIndex(item => {
                return item[stateProps.valueField] == objectItem[stateProps.valueField];
            });
            if (indexItemRemove != -1) {
                dataPicker[indexItemRemove].isSelect = false;
            }
        }
        this.setDataConfirm([...List]);
        this.setState(
            {
                itemSelected: List,
                dataPicker: dataPicker
            },
            stateProps.onFinish(itemSelected)
        );
    };

    removeAllItem = () => {
        let { stateProps, dataPicker } = this.state;
        this.setDataConfirm([]);
        if (dataPicker != null && dataPicker.length > 0) {
            dataPicker.map(item => {
                item.isSelect = false;
                return item;
            });
        }
        this.setState(
            {
                itemSelected: [],
                dataPicker: dataPicker
            },
            stateProps.onFinish([])
        );
    };

    onOK = () => {
        let { itemSelected } = this.state;
        this.setDataConfirm([...itemSelected]);
        this.state.stateProps.onFinish(itemSelected);
    };

    changeDisable = bool => {
        const stateProps = { ...this.state.stateProps };
        if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.disable) && typeof stateProps.disable === 'boolean') {
            stateProps.disable = bool;
            this.setState({ stateProps: stateProps });
        }
    };

    onRefreshControl = nextProps => {
        const { value } = nextProps;
        let _state = this.state;
        _state = defaultState;
        _state.stateProps = nextProps;
        this.isModalOpened = false;
        if (this.props.autoBind) {
            this.getData();
        }

        if (!Vnr_Function.CheckIsNullOrEmpty(value) && value.length > 0) {
            this.setDataConfirm([...value]);
            _state.itemSelected = [...value];
            this.setState(_state);
        } else {
            this.setDataConfirm([]);
            _state.itemSelected = [];
            this.setState(_state);
        }
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.refresh !== this.props.refresh) {
            this.onRefreshControl(nextProps);
        }
    }

    componentDidMount() {
        const { value, autoBind } = this.state.stateProps;
        if (autoBind) {
            this.getData();
        }

        if (!Vnr_Function.CheckIsNullOrEmpty(value) && value.length > 0) {
            let { itemSelected } = this.state;
            this.setDataConfirm([...value]);
            itemSelected = [...value];
            this.setState({ itemSelected: itemSelected });
        } else {
            // if (this.props?.isCheckAll) {
            //     const DATA_WEEKS_BK = [...DATA_WEEKS];
            //     DATA_WEEKS_BK.forEach((item) => {
            //         item.isChecked = true;
            //     })
            //     this.setDataConfirm(DATA_WEEKS_BK);
            //     this.setState({ itemSelected: DATA_WEEKS_BK }, () => {
            //         this.onOK(DATA_WEEKS_BK);
            //     });
            //     return;
            // }
            this.setDataConfirm([]);
            this.setState({ itemSelected: [] });
        }
    }

    eventExceedSizeWith = (value, value2) => {
        const { isExceedSize } = this.state;

        if (value >= value2 / 2 - 5) {
            if (isExceedSize !== true) {
                this.setState({
                    isExceedSize: true
                });
            }
        }
    };

    renderIconRight = (isShowErr) => {
        const { isOptionFilterQuicly, layoutFilter, disable } = this.props;

        if (isShowErr === true) {
            return (
                <View style={stylesVnrPickerV3.styRightPicker}>
                    <View style={stylesVnrPickerV3.styBtnClear}>
                        <IconWarn color={Colors.red} size={Size.iconSize - 2} />
                    </View>
                </View>
            );
        } else if (!layoutFilter) {
            if (isOptionFilterQuicly === true) return <View />;
            else {
                return (
                    <View style={stylesVnrPickerV3.styRightPicker}>
                        <IconDown size={Size.iconSize} color={disable ? Colors.gray_7 : Colors.gray_8} />
                    </View>
                );
            }
        }
    };

    renderLableLayout = value => {
        const { lable } = this.props;
        let countSelect = value !== undefined ? value.length : null;

        return (
            <View style={{}}>
                <TouchableOpacity
                    onPress={() => this.opentModal()}
                    activeOpacity={0.3}
                    style={stylesVnrPickerV3.styViewLayoutFilter}
                >
                    <View style={stylesVnrPickerV3.styWarpLayoutFilter}>
                        <VnrText
                            style={[styleSheets.lable, stylesVnrPickerV3.styLableLayoutFilter]}
                            numberOfLines={1}
                            value={`${translate(lable)} ${countSelect ? '(' + countSelect + ') ' : ''}`}
                        />
                        {countSelect != null && countSelect != 0 && (
                            <TouchableOpacity onPress={this.removeAllItem}>
                                <VnrText
                                    style={[styleSheets.lable, stylesVnrPickerV3.styRemoveLayoutFilter]}
                                    i18nKey={'Delete'}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={stylesVnrPickerV3.styIconLayoutFilter}>
                        <IconPlus color={Colors.black} size={Size.iconSize} />
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    render() {
        const {
            isModalVisible,
            isVisibleLoading,
            dataPicker,
            stateProps
        } = this.state;
        const {
            bntPickerDisable
        } = stylesVnrPickerV3;

        const { value, isOptionFilterQuicly, layoutFilter } = this.props;
        let disable = false;
        let isHaveValue = true;
        let viewListItem = <View />;
        let isShowErr = false;
        let isCheckAll = false;
        if (
            this.props.fieldValid &&
            this.props.fieldValid === true &&
            this.props.isCheckEmpty &&
            this.props.isCheckEmpty === true &&
            (stateProps.value === null || stateProps.value === undefined)
        ) {
            isShowErr = true;
        } else {
            isShowErr = false;
        }

        if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.disable) && typeof stateProps.disable === 'boolean') {
            disable = stateProps.disable;
        }

        if (isVisibleLoading) {
            viewListItem = <VnrLoading size="small" isVisible={isVisibleLoading} />;
        } else if (dataPicker.length > 0) {
            viewListItem = (
                <ListItem
                    isLoading={isVisibleLoading}
                    dataSource={dataPicker}
                    textField={stateProps.textField}
                    valueField={stateProps.valueField}
                    textFieldFilter={stateProps.textFieldFilter}
                    addItem={this.addItemChecked}
                />
            );
        } else if (!isVisibleLoading) {
            viewListItem = <EmptyData messageEmptyData={'EmptyData'} />;
        }
        if (!value || value.length == 0) {
            isHaveValue = false;
        }
        let valueDisplay = null;
        if (Array.isArray(value) && value.length > 0) {
            if (value.length === DATA_WEEKS.length) {
                isCheckAll = true;
            }
            let temp = [];
            value.map((item) => {
                temp.push(translate(item?.TextDisPlay));

                if (Array.isArray(temp) && temp.length > 0) {
                    valueDisplay = temp.join(', ');
                }
            })
        };

        return (
            <View
                style={[
                    styles.styContentPicker,
                    layoutFilter && { height: 50 },
                    isOptionFilterQuicly === true
                        ? { height: '100%', width: '100%' }
                        : { height: 50 }
                ]}
            >
                {layoutFilter && this.renderLableLayout(value)}

                <TouchableOpacity
                    onPress={() => (!disable ? this.opentModal() : null)}
                    style={[
                        stateProps.stylePicker,
                        isShowErr && { borderBottomColor: Colors.red, borderBottomWidth: 1.5 },
                        disable && bntPickerDisable,
                        isOptionFilterQuicly === true
                            ? {
                                height: '100%',
                                width: '100%'
                            }
                            : styles.styBntPicker,
                        layoutFilter && { borderBottomWidth: 0 }
                    ]}
                    activeOpacity={!disable ? 0.2 : 1}
                >
                    <View
                        style={[
                            stylesVnrPickerV3.styLeftPicker,
                            { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }
                        ]}
                    >
                        {stateProps.lable && !layoutFilter && !isOptionFilterQuicly && (
                            <View style={[stylesVnrPickerV3.styLbPicker, { flex: 1 }]}>
                                <VnrText
                                    style={[
                                        styleSheets.text,
                                        stylesVnrPickerV3.styLbNoValuePicker
                                    ]}
                                    i18nKey={stateProps.lable}
                                />
                                {stateProps.fieldValid && (
                                    <VnrText style={[styleSheets.text, styleValid]} i18nKey={'*'} />
                                )}
                            </View>
                        )}

                        <View
                            style={[
                                stylesVnrPickerV3.styVlPicker,
                                styles.yetValue,
                                { flex: 1 }
                            ]}
                        >
                            {isHaveValue ? (
                                // <ListMultiItem
                                //     disable={disable}
                                //     textField={stateProps.textField}
                                //     valueField={stateProps.valueField}
                                //     dataSource={value}
                                //     onOpentModal={this.opentModal}
                                //     revomeItemSelect={this.revomeItemSelected}
                                //     onExceedSizeWith={this.eventExceedSizeWith}
                                // />
                                <View
                                    style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        alignItems: 'flex-end'
                                    }}
                                >
                                    <Text style={[
                                        styleSheets.text
                                    ]}>{isCheckAll ? translate('HRM_PortalApp_Daily') : valueDisplay}</Text>
                                </View>
                            ) : (
                                !layoutFilter && (
                                    <View style={[isOptionFilterQuicly === true ? styles.fl1Center : {}]}>
                                        <VnrText
                                            style={[styleSheets.text]}
                                            i18nKey={'HRM_PortalApp_NoRepeat'}
                                        />
                                    </View>
                                )
                            )}
                        </View>
                    </View>
                    {this.renderIconRight(isShowErr)}
                </TouchableOpacity>
                <Modal
                    animationIn="fadeIn"
                    animationOut="fadeOut"
                    avoidKeyboard={true}
                    key={'123'}
                    isVisible={isModalVisible}
                    onBackdropPress={() => {
                        this.closeModal()
                    }}
                    onShow={this.onShowModal}
                    style={{
                        justifyContent: 'flex-end',
                        margin: 0
                    }}
                >
                    <View
                        style={{
                            width: '100%',
                            height: '55%',
                            justifyContent: 'flex-end'
                        }}
                    >
                        <View style={
                            [{
                                flex: 1,
                                flexDirection: 'column',
                                justifyContent: 'flex-end',
                                position: 'relative'
                            },
                            CustomStyleSheet.backgroundColor(Colors.white)]
                        }
                        >
                            <View style={[{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                padding: 16
                            }, CustomStyleSheet.backgroundColor(Colors.gray_2)]}>
                                <VnrText
                                    style={[
                                        styleSheets.text,
                                        styleComonAddOrEdit.styRegister,
                                        styleComonAddOrEdit.fS16fW600,
                                        { color:  Colors.black }
                                    ]}
                                    i18nKey={`${stateProps.lable}`}
                                />
                                <View style={[stylesVnrPickerV3.styDefTitle, CustomStyleSheet.marginRight(0)]}>
                                    <TouchableOpacity
                                        onPress={() => (this.onOK())}
                                    >
                                        <VnrText
                                            style={[
                                                styleSheets.text,
                                                styleComonAddOrEdit.styApproveProcessTitle,
                                                { color: Colors.primary }
                                            ]}
                                            i18nKey={'HRM_Common_VnrUpload_Done'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={{ flex: 9, flexDirection: 'column' }}>
                                <View
                                    style={{
                                        flex: 1,
                                        flexDirection: 'column'
                                    }}
                                >
                                    {viewListItem}
                                </View>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    styContentPicker: {
        height: 50,
        width: '100%'
        // maxHeight: 110,
    },
    styBntPicker: {
        flex: 1,
        flexDirection: 'row',
        borderColor: Colors.gray_5,
        borderBottomWidth: 1,
        borderRadius: Size.borderPicker,
        paddingHorizontal: Size.defineSpace,
        backgroundColor: Colors.white,
        alignItems: 'center'
    },
    yetValue: { width: '60%', justifyContent: 'flex-end' },
    fl1Center: { flex: 1, justifyContent: 'center', alignItems: 'flex-start' }
});
