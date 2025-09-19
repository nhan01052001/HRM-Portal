/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-console */
import React, { Component } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    ScrollView,
    TextInput,
    Animated,
    Image,
    Keyboard
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Colors,
    Size,
    styleSheets,
    stylesVnrFilter,
    styleValid,
    stylesVnrPickerV3,
    CustomStyleSheet
} from '../../constants/styleConfig';
import VnrLoading from '../../components/VnrLoading/VnrLoading';
import HttpFactory from '../../factories/HttpFactory';
import Vnr_Function from '../../utils/Vnr_Function';
import VnrText from '../../components/VnrText/VnrText';
import ListItem from './ListItem';
import ListMultiItem from './MultiItem';
import EmptyData from '../../components/EmptyData/EmptyData';
import { translate } from '../../i18n/translate';
import { IconDown, IconSearch, IconCancel, IconPlus, IconWarn } from '../../constants/Icons';
import HttpService from '../../utils/HttpService';
import { EnumName } from '../../assets/constant';

const HEGHT_SEARCH = Size.deviceheight >= 1024 ? 55 : 45;

const defaultState = {
    searchText: '',
    isModalVisible: false,
    itemSelected: [],
    isVisibleLoading: false,
    dataPicker: [],
    fullData: null,
    isExceedSize: false,
    animatedWidthSearch: new Animated.Value(Size.deviceWidth - 32)
};

export default class VnrSuperFilterWithTextInput extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...defaultState,
            ...{ stateProps: props }
        };
        this.dataConfirm = [];
        this.isModalOpened = false;
        this.refSearch = null;
    }

    setDataConfirm = data => {
        this.dataConfirm = data;
    };

    getDataConfirm = () => {
        return this.dataConfirm;
    };

    opentModal = () => {
        let isVisibleLoading = this.isModalOpened ? false : true;
        if (HttpService.checkConnectInternet() == false && !Object.prototype.hasOwnProperty.call(this.props, 'dataLocal')) {
            HttpService.showAlertNoNetwork(this.opentModal);
            return;
        }
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
        let { itemSelected } = this.state;
        const { value, isOptionFilterQuicly } = this.props;

        if (!Vnr_Function.CheckIsNullOrEmpty(value) && value.length > 0) {
            // if (itemSelected.length > 0) {
            //                 let arr = [];
            //                 itemSelected.filter((vl1) => vl1.ID).filter((vl3) => {
            //                     if(
            //                         !value.filter((vl2) => vl2.ID).includes(vl3)
            //                     ) {
            //                         arr.push(vl3);
            //                     }
            //                 })

            //                 if (arr.length > 0) {
            //                     itemSelected = [...value, ...arr];
            //                 } else {
            //                     itemSelected = [...value];
            //                 }
            //             } else {
            //                 itemSelected = [...value];
            //             }

            if (itemSelected.length == 0 || (isOptionFilterQuicly && isOptionFilterQuicly === true)) {
                itemSelected = [...value];
            }
            // data = data.map((item, index) => {
            //     if (
            //         value.findIndex(_value => {
            //             return _value[valueField] == item[valueField];
            //         }) != -1
            //     ) {
            //         item.isSelect = true;
            //     }
            //     else {
            //         item.isSelect = false;
            //     }
            //     return item;
            // });

            // // trường hợp trong dataource không có value thì add value lên trên cùng
            // if (data.length > 0 && Vnr_Function.CheckIsNullOrEmpty(searchText)) {
            //     value.map(item => {
            //         if (
            //             data.findIndex(_value => {
            //                 return _value[valueField] == item[valueField];
            //             }) < 0
            //         ) {
            //             item.isSelect = true;
            //             data = [...[item], ...data];
            //         }
            //     });
            // }
        }

        if (itemSelected.length > 0 && Array.isArray(data) && data.length > 0) {
            data = data.map((item) => {
                if (
                    itemSelected.findIndex(_value => {
                        return _value.ID == item.ID;
                    }) != -1
                ) {
                    item.isSelect = true;
                } else {
                    item.isSelect = false;
                }
                return item;
            });
        }
        this.isModalOpened = false;
        this.setState({
            dataPicker: data,
            fullData: data,
            isVisibleLoading: false,
            itemSelected
        });
    };

    getData = () => {
        const { api, dataLocal, filter, filterParams, filterServer } = this.state.stateProps;
        const { searchText, isVisibleLoading } = this.state;
        const url = { ...api };
        if (!isVisibleLoading) {
            this.setState({ isVisibleLoading: true });
        }
        if (!Vnr_Function.CheckIsNullOrEmpty(dataLocal) && Array.isArray(dataLocal)) {
            const _dataLocal = dataLocal.map((item) => {
                item.isSelect = false;
                return item;
            });
            this.handelDataSelect(_dataLocal);
            return true;
        }
        if (Vnr_Function.CheckIsNullOrEmpty(api)) {
            console.warn('Plase enter props dataLocal or api ...');
            return true;
        }
        if (Vnr_Function.CheckIsNullOrEmpty(filter)) {
            console.warn('You can enter propr filter equa true or false...');
            return true;
        }
        if (api.type === 'E_GET') {
            if (
                filterServer == true &&
                filter == true &&
                !Vnr_Function.CheckIsNullOrEmpty(filterParams) &&
                searchText != null
            ) {
                if (url.urlApi.indexOf('?') > 0) {
                    url.urlApi = `${url.urlApi}&${filterParams}=${searchText}`;
                } else {
                    url.urlApi = `${url.urlApi}?${filterParams}=${searchText}`;
                }
            }
        } else if (api.type === 'E_POST') {
            if (Vnr_Function.CheckIsNullOrEmpty(api.dataBody)) {
                console.warn('You can enter dataBody in props api...');
                return true;
            }
            if (filterServer == true && !Vnr_Function.CheckIsNullOrEmpty(filterParams) && searchText != null) {
                url.dataBody[filterParams] = searchText;
            }
        }

        HttpFactory.getDataPicker(url)
            .then(res => {
                let data = [];
                if (res.Status == EnumName.E_SUCCESS) {
                    data = res.Data;
                } else if (res) {
                    data = res;
                }

                this.isModalOpened = true;
                this.handelDataSelect(data);
            })
            .catch(error => console.log(error));
    };

    closeModal = () => {
        let { itemSelected, dataPicker, stateProps } = this.state;
        const data = this.getDataConfirm();
        itemSelected = [...data];
        if (dataPicker && Array.isArray(dataPicker) && dataPicker.length > 0) {
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
        this.isModalOpened = false;
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

    addItemChecked = indexItem => {
        const { valueField, isChooseOne } = this.state.stateProps;
        let { itemSelected, dataPicker } = this.state;

        let itemChecked = dataPicker[indexItem];
        if (isChooseOne) {
            itemSelected.length = 0;
            itemSelected.push(itemChecked);
            const index = dataPicker.findIndex(item => item?.isSelect === true);
            if (index > -1) {
                dataPicker[index].isSelect = false;
            }
        } else if (!itemChecked.isSelect)
            // kiem tra isSelect == true thi add vao mang itemSelected
            itemSelected = itemSelected.concat(itemChecked);
        else {
            itemSelected = Vnr_Function.removeObjectInArray(itemSelected, itemChecked, valueField);
        }
        itemChecked.isSelect = !itemChecked.isSelect;
        this.setState({ dataPicker: dataPicker, itemSelected: itemSelected, searchText: '' });
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
        this.setState({ isModalVisible: false });
    };

    changeSearchBar = textValue => {
        this.setState({ searchText: textValue });
    };

    changeDisable = bool => {
        const stateProps = { ...this.state.stateProps };
        if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.disable) && typeof stateProps.disable === 'boolean') {
            stateProps.disable = bool;
            this.setState({ stateProps: stateProps });
        }
    };

    filterServer = () => {
        Vnr_Function.delay(() => {
            this.getData();
        }, 500);
    };

    filterLocal = () => {
        const { textField, filter, filterServer, valueField, textFieldFilter } = this.state.stateProps;
        const { fullData, searchText, itemSelected } = this.state;
        const fieldFilterLocal = textFieldFilter ? textFieldFilter : textField;

        if (filter && !filterServer) {
            const data = fullData.filter((item) => {
                return Vnr_Function.CheckContains(item, fieldFilterLocal, searchText);
            });
            data.map(item => {
                if (
                    itemSelected.findIndex(value => {
                        return item[valueField] == value[valueField];
                    }) != -1
                ) {
                    item.isSelect = true;
                } else {
                    item.isSelect = false;
                }
                return item;
            });

            this.setState({ dataPicker: data });
        }
    };

    onRefreshControl = nextProps => {
        const { value } = nextProps;
        let _state = this.state;
        _state = defaultState;
        _state.stateProps = nextProps;
        this.isModalOpened = false;

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
        const { value } = this.state.stateProps;
        if (!Vnr_Function.CheckIsNullOrEmpty(value) && value.length > 0) {
            let { itemSelected } = this.state;
            this.setDataConfirm([...value]);
            itemSelected = [...value];
            this.setState({ itemSelected: itemSelected });
        } else {
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

    focusInputSearch = () => {
        Animated.timing(this.state.animatedWidthSearch, {
            toValue: Size.deviceWidth - 48 - this.widthButtonCancel,
            duration: 200
        }).start();

        this.setState({ isFilter: true }, () => { });
    };

    handleBlur = () => {
        Animated.timing(this.state.animatedWidthSearch, {
            toValue: Size.deviceWidth - 32,
            duration: 100
        }).start();
        this.setState({ isFilter: false }, () => {
            this.refSearch && this.refSearch.blur();
        });
    };

    renderAvatar = (name, avatar) => {
        const firstChar = name ? name.split('')[0] : '';
        let randomColor = Vnr_Function.randomColor(firstChar),
            { PrimaryColor, SecondaryColor } = randomColor;
        return (
            <View style={stylesSearch.viewItemUser_avatar}>
                {avatar ? (
                    <Image source={{ uri: avatar }} style={stylesSearch.viewItemUser_avatar__image} />
                ) : (
                    <View style={[stylesSearch.viewItemUser_avatar__image, { backgroundColor: SecondaryColor }]}>
                        <Text
                            style={[
                                styleSheets.textFontMedium,
                                stylesSearch.viewItemUser_avatar__text,
                                {
                                    color: PrimaryColor
                                }
                            ]}
                        >
                            {firstChar.toUpperCase()}
                        </Text>
                    </View>
                )}
            </View>
        );
    };

    removeItemOnSearch = index => {
        let { itemSelected, dataPicker } = this.state;
        if (itemSelected[index].isSelect === true) {
            itemSelected[index].isSelect = false;
            let arr = itemSelected.filter(item => item.ID !== itemSelected[index].ID);
            let data = dataPicker.map((item) => {
                if (
                    arr.findIndex(_value => {
                        return _value[this.props.valueField] == item[this.props.valueField];
                    }) != -1
                ) {
                    item.isSelect = true;
                } else {
                    item.isSelect = false;
                }
                return item;
            });
            this.setState({
                itemSelected: [...arr],
                dataPicker: data
            });
        }
    };

    handleUnhandledTouches() {
        Keyboard.dismiss();
        return false;
    }

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
            searchText,
            isModalVisible,
            isVisibleLoading,
            dataPicker,
            itemSelected,
            stateProps,
            isExceedSize
        } = this.state;

        const {
            ScroollviewModal,
            bottomModal,
            bntPickerDisable,
            stylePlaceholder
        } = stylesVnrPickerV3;

        const {
            value,
            isOptionFilterQuicly,
            licensedDisplay,
            textField,
            filterServer,
            filter,
            valueDisplay,
            layoutFilter,
            children,
            isChooseOne,
            isCheckEmpty,
            fieldValid
        } = this.props;

        let isShowErr = false;
        let disable = false;
        let isHaveValue = true;
        let viewListItem = <View />;
        if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.disable) && typeof stateProps.disable === 'boolean') {
            disable = stateProps.disable;
        }

        if (isVisibleLoading) {
            viewListItem = <VnrLoading size="small" isVisible={isVisibleLoading} />;
        } else if (dataPicker && Array.isArray(dataPicker) && dataPicker.length > 0) {
            viewListItem = (
                <ListItem
                    isLoading={isVisibleLoading}
                    dataSource={dataPicker}
                    textField={stateProps.textField}
                    valueField={stateProps.valueField}
                    textFieldFilter={stateProps.textFieldFilter}
                    addItem={this.addItemChecked}
                    licensedDisplay={licensedDisplay[0]}
                />
            );
        } else if (!isVisibleLoading) {
            viewListItem = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        if (!value || value.length == 0) {
            isHaveValue = false;
        }

        if (
            fieldValid &&
            fieldValid === true &&
            isCheckEmpty &&
            isCheckEmpty === true &&
            (value === null || value === undefined || Object.keys(value).length === 0)
        ) {
            isShowErr = true;
        } else {
            isShowErr = false;
        }

        return (
            <View
                style={[
                    styles.styContentPicker,
                    layoutFilter && { height: 50 },
                    isOptionFilterQuicly === true
                        ? {
                            height: '100%',
                            width: '100%'
                        }
                        : ((value !== undefined && value.length > 2) || (isExceedSize === true && value.length > 1)) &&
                            !isChooseOne
                            ? { height: 'auto' }
                            : value !== undefined && value.length <= 2 && value.length > 0 && !isChooseOne
                                ? { height: 'auto' }
                                : { height: 50 },
                    isShowErr && styles.borderBottom
                ]}
            >
                {layoutFilter && this.renderLableLayout(value)}

                <TouchableOpacity
                    disabled={Array.isArray(valueDisplay) && valueDisplay.length > 0 ? true : false}
                    onPress={() => (!disable ? this.opentModal() : null)}
                    style={[
                        stateProps.stylePicker,
                        disable && bntPickerDisable,
                        isOptionFilterQuicly === true
                            ? {
                                height: '100%',
                                width: '100%'
                            }
                            : styles.styBntPicker,
                        (layoutFilter || isShowErr) && { borderBottomWidth: 0 }
                    ]}
                    activeOpacity={!disable ? 0.2 : 1}
                >
                    {children ? (
                        children
                    ) : Array.isArray(valueDisplay) && valueDisplay.length > 0 ? (
                        <View style={[{ flex: 1, paddingRight: 12 }, stylesVnrPickerV3.styRightPicker]}>
                            <ScrollView
                                contentContainerStyle={[styles.styScrollView]}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                            >
                                {valueDisplay.map((item, index) => {
                                    return (
                                        <TouchableOpacity key={index} onPress={() => (!disable ? this.opentModal() : null)}>
                                            <Text style={styleSheets.text}>{item},</Text>
                                        </TouchableOpacity>
                                    );
                                })}
                            </ScrollView>
                        </View>
                    ) : (
                        <View
                            style={[
                                stylesVnrPickerV3.styLeftPicker,
                                stateProps.lable && isHaveValue ? {} : stylesVnrPickerV3.onlyFlRowSpaceBetween
                            ]}
                        >
                            <View
                                style={[
                                    stylesVnrPickerV3.styLeftPicker,
                                    stateProps.lable && isHaveValue ? CustomStyleSheet.paddingVertical(6) : stylesVnrPickerV3.onlyFlRowSpaceBetween,
                                    !isHaveValue && CustomStyleSheet.alignItems('center')
                                ]}
                            >
                                {stateProps.lable && !layoutFilter && (
                                    <View style={[stylesVnrPickerV3.styLbPicker, !isHaveValue && CustomStyleSheet.maxWidth('45%')]}>
                                        <Text
                                            style={[
                                                styleSheets.text,
                                                stylesVnrPickerV3.styLbNoValuePicker
                                            ]}>
                                            {translate(stateProps.lable)}
                                            {stateProps.fieldValid && (
                                                <VnrText style={[styleSheets.text, styleValid]} i18nKey={'*'} />
                                            )}
                                        </Text>
                                    </View>
                                )}

                                <View
                                    style={[
                                        stylesVnrPickerV3.styVlPicker,
                                        isHaveValue ? styles.haveValue : styles.yetValue,
                                        { alignItems: 'center' }
                                    ]}
                                >
                                    {isHaveValue ? (
                                        <ListMultiItem
                                            disable={disable}
                                            textField={stateProps.textField}
                                            valueField={stateProps.valueField}
                                            dataSource={value}
                                            onOpentModal={this.opentModal}
                                            revomeItemSelect={this.revomeItemSelected}
                                            onExceedSizeWith={this.eventExceedSizeWith}
                                            licensedDisplay={licensedDisplay[0]}
                                        />
                                    ) : (
                                        !layoutFilter && (
                                            <View style={[isOptionFilterQuicly === true ? styles.fl1Center : { marginRight: 2 }]}>
                                                <VnrText
                                                    style={[
                                                        styleSheets.text,
                                                        stylePlaceholder,
                                                        stateProps.stylePlaceholder
                                                    ]}
                                                    i18nKey={
                                                        !Vnr_Function.CheckIsNullOrEmpty(stateProps.placeholder)
                                                            ? stateProps.placeholder
                                                            : 'SELECT_ITEM'
                                                    }
                                                />
                                            </View>
                                        )
                                    )}
                                    {/* {this.renderIconRight(isHaveValue, isShowErr)} */}
                                    {isHaveValue || isOptionFilterQuicly === true || layoutFilter ? null : (
                                        <View style={[stylesVnrPickerV3.styRightPicker, CustomStyleSheet.marginRight(16)]}>
                                            {stateProps.clearText == true ? (
                                                <TouchableOpacity
                                                    onPress={this.clearDate}
                                                    style={stylesVnrPickerV3.styBtnClear}
                                                >
                                                    <IconCancel size={Size.iconSize - 2} color={Colors.grey} />
                                                </TouchableOpacity>
                                            ) : (
                                                isShowErr ? (
                                                    <View style={stylesVnrPickerV3.styBtnClear}>
                                                        <IconWarn color={Colors.red} size={Size.iconSize - 2} />
                                                    </View>
                                                ) : (
                                                    <IconDown size={Size.iconSize} color={disable ? Colors.gray_7 : Colors.gray_8} />
                                                )
                                            )}
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    )}
                </TouchableOpacity>
                <Modal
                    visible={isModalVisible} //isModalVisible
                    animationType="none"
                    //presentationStyle="pageSheet"
                    onShow={this.onShowModal}
                    transparent={false}
                    onRequestClose={this.closeModal}
                >
                    <SafeAreaView style={ScroollviewModal} forceInset={{ top: 'always', bottom: 'always' }}>
                        {/* search */}
                        {stateProps.filter === true && (
                            <View style={stylesSearch.viewFilter}>
                                <View
                                    style={[stylesSearch.viewFilter_content, { paddingVertical: 2, paddingRight: 2 }]}
                                >
                                    <View style={stylesSearch.viewFilter_icon}>
                                        <IconSearch size={Size.iconSize} color={Colors.gray_9} />
                                    </View>
                                    <View style={stylesSearch.viewFilter_right}>
                                        <ScrollView
                                            contentContainerStyle={stylesSearch.viewFilter_scroll}
                                            onStartShouldSetResponder={() => this.handleUnhandledTouches()}
                                            keyboardShouldPersistTaps={'handled'}
                                        >
                                            <View style={stylesSearch.viewFilter_swap}>
                                                {itemSelected.map((item, index) => (
                                                    <View style={stylesSearch.viewItemUser} key={index}>
                                                        {Vnr_Function.renderAvatarCricleByName(
                                                            item[licensedDisplay[0].Avatar[0]],
                                                            item[textField],
                                                            21
                                                        )}
                                                        <View style={{ maxWidth: '85%' }}>
                                                            <Text
                                                                style={[
                                                                    styleSheets.text,
                                                                    stylesSearch.viewItemUser_text
                                                                ]}
                                                            >
                                                                {item[textField]}
                                                            </Text>
                                                        </View>
                                                        <TouchableOpacity
                                                            style={stylesSearch.viewItemUser_bnt__close}
                                                            onPress={() => this.removeItemOnSearch(index)}
                                                        >
                                                            <IconCancel
                                                                size={Size.iconSize - 8}
                                                                color={Colors.gray_10}
                                                            />
                                                        </TouchableOpacity>
                                                    </View>
                                                ))}
                                            </View>
                                        </ScrollView>

                                        <TextInput
                                            ref={refSearch => (this.refSearch = refSearch)}
                                            // onClearText={() => this.changeSearchBar('')}
                                            placeholder={translate('HRM_Common_Search')}
                                            onChangeText={text => {
                                                this.setState({ searchText: text }, () => {
                                                    if (filter === true && filterServer === true) {
                                                        this.filterServer();
                                                    }
                                                });
                                            }}
                                            value={searchText}
                                            returnKeyType="search"
                                            onSubmitEditing={() => { }}
                                            style={[styleSheets.text, stylesSearch.viewFilter_Input]}
                                        />
                                    </View>
                                </View>
                            </View>
                        )}
                        <View style={{ flex: 9, flexDirection: 'column' }}>
                            <View
                                style={{
                                    flex: 9,
                                    flexDirection: 'column'
                                }}
                            >
                                {viewListItem}
                            </View>
                            {/* Btn */}
                            <View style={bottomModal}>
                                <TouchableOpacity onPress={this.closeModal} style={[stylesVnrFilter.btn_ClearFilter]}>
                                    <VnrText
                                        style={[
                                            styleSheets.lable,
                                            {
                                                color: Colors.gray_8
                                            }
                                        ]}
                                        i18nKey={
                                            stateProps.textLeftButton != null
                                                ? stateProps.textLeftButton
                                                : 'HRM_PortalApp_RemoveSelect'
                                        }
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={this.onOK}
                                    style={[stylesVnrFilter.bnt_Ok, { backgroundColor: Colors.primary }]}
                                >
                                    <VnrText
                                        style={[styleSheets.lable, { color: Colors.white }]}
                                        i18nKey={
                                            stateProps.textRightButton != null ? stateProps.textRightButton : 'Confirm'
                                        }
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

const styles = StyleSheet.create({
    styContentPicker: {
        height: 50,
        width: '100%',
        flexWrap: 'wrap'
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
    haveValue: {
        width: '100%',
        marginTop: Size.defineHalfSpace
        // minHeight: 200,
        // paddingVertical: Size.defineHalfSpace,
    },
    yetValue: { width: '60%', justifyContent: 'flex-end' },
    fl1Center: { flex: 1, justifyContent: 'center', alignItems: 'flex-start' },
    styScrollView: {
        flexGrow: 1,
        alignItems: 'center'
    },
    borderBottom: {
        borderBottomColor: Colors.red,
        borderBottomWidth: 0.8
    }
});

const HEIGHT_INPUT_SEARCH = 40;
const stylesSearch = StyleSheet.create({
    viewFilter: {
        minHeight: HEGHT_SEARCH,
        maxHeight: HEGHT_SEARCH * 4 + 24,
        paddingHorizontal: 16,
        justifyContent: 'center',
        backgroundColor: Colors.white,
        borderBottomRightRadius: Size.deviceWidth >= 1024 ? 38 : 28,
        borderBottomLeftRadius: Size.deviceWidth >= 1024 ? 38 : 28
    },

    viewFilter_content: {
        width: '100%',
        flexDirection: 'row',
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        borderRadius: 20,
        alignItems: 'flex-start',
        paddingRight: 10,
        marginVertical: 12,
        maxHeight: HEGHT_SEARCH * 4,
        paddingVertical: 8
    },
    viewFilter_right: {
        height: '100%',
        width: 'auto',
        flex: 1
    },
    viewFilter_icon: {
        marginLeft: 10,
        marginRight: 10,
        height: HEIGHT_INPUT_SEARCH,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewFilter_scroll: {
        backgroundColor: Colors.white
    },
    viewFilter_swap: {
        flex: 1,
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    viewFilter_Input: {
        height: HEIGHT_INPUT_SEARCH,
        paddingHorizontal: 7
    },
    viewItemUser: {
        maxWidth: '95%',
        paddingHorizontal: 8,
        paddingVertical: 5,
        backgroundColor: Colors.gray_3,
        borderColor: Colors.gray_4,
        borderWidth: 0.5,
        borderRadius: 15,
        marginRight: 8,
        marginTop: 5,
        marginBottom: 4,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewItemUser_text: {
        fontSize: Size.text - 2,
        color: Colors.gray_10,
        marginLeft: Size.defineHalfSpace
    },
    viewItemUser_bnt__close: {
        width: 25,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    viewItemUser_avatar: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 21 / 2,
        marginRight: 5
    },
    viewItemUser_avatar__image: {
        width: 21,
        height: 21,
        borderRadius: 21 / 2,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewItemUser_avatar__text: {
        fontSize: Size.text - 7
    }
});
