/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-console */
import React from 'react';
import { View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {
    Colors,
    Size,
    styleSheets,
    stylesVnrFilter,
    styleValid,
    stylesVnrPickerV3,
    CustomStyleSheet
} from '../../constants/styleConfig';
import { translate } from '../../i18n/translate';
import VnrText from '../../components/VnrText/VnrText';
import ListItem from './ListItem';
import HttpFactory from '../../factories/HttpFactory';
import VnrLoading from '../../components/VnrLoading/VnrLoading';
import Vnr_Function from '../../utils/Vnr_Function';
import EmptyData from '../../components/EmptyData/EmptyData';
import { IconCancel, IconDown, IconWarn } from '../../constants/Icons';
import VnrTextInput from '../../components/VnrTextInput/VnrTextInput';
import HttpService from '../../utils/HttpService';
import { EnumName } from '../../assets/constant';

const iconNameSearch = `${Platform.OS === 'ios' ? 'ios-' : 'md-'}search`;
const defaultState = {
    searchText: '',
    isModalVisible: false,
    itemSelected: [],
    isVisibleLoading: false,
    dataPicker: [],
    fullData: null,
    filterServer: false,
    filter: true
};

export default class VnrPicker extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...defaultState,
            ...{ stateProps: props }
        };
        this.oldItemIndex = null;
        this.dataConfirm = { data: {}, index: null };
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
        if (HttpService.checkConnectInternet() == false && !Object.prototype.hasOwnProperty.call(this.props, 'dataLocal')) {
            HttpService.showAlertNoNetwork(this.opentModal);
            return;
        }
        this.setState({ isModalVisible: true, isVisibleLoading: isVisibleLoading });
    };

    handelDataSelect = data => {
        const { valueField, textField, filter, filterServer } = this.state.stateProps,
            { value } = this.props,
            { searchText, itemSelected } = this.state;

        let callbackFunctioFilterLocal = null;

        if (filterServer == false && filter == true && !Vnr_Function.CheckIsNullOrEmpty(searchText)) {
            callbackFunctioFilterLocal = this.filterLocal;
        }

        itemSelected.length = 0; // dua mang ve rong

        if (!Vnr_Function.CheckIsNullOrEmpty(value) && Object.keys(value).length > 0) {
            if (
                data.findIndex(item => {
                    return value[valueField] == item[valueField];
                }) > -1
            ) {
                data = data.map((item, index) => {
                    if (item[valueField] === value[valueField]) {
                        value[textField] = item[textField];
                        item.isSelect = true;
                        this.oldItemIndex = index;
                        value.index = index;
                    } else {
                        item.isSelect = false;
                    }
                    return item;
                });
                itemSelected.push({ ...value, ...{ isSelect: true } });
            } else if (Object.keys(value).length > 0) {
                value.isSelect = true;
                value.index = 0;
                this.oldItemIndex = 0;
                data = [
                    ...[value],
                    ...data.map(item => {
                        item.isSelect = false;
                        return item;
                    })
                ];
                itemSelected.push(value);
            }
        } else {
            data = data.map(item => {
                item.isSelect = false;
                return item;
            });
        }
        this.setState(
            {
                dataPicker: data,
                fullData: data,
                isVisibleLoading: false,
                itemSelected: itemSelected
            },
            callbackFunctioFilterLocal
        );
    };

    getData = () => {
        const { api, dataLocal, filter, filterParams, filterServer } = this.state.stateProps;
        const { searchText, isVisibleLoading } = this.state;
        const url = { ...api };

        if (!isVisibleLoading) {
            this.setState({ isVisibleLoading: true });
        }
        if (Object.prototype.hasOwnProperty.call(this.state.stateProps, 'dataLocal')) {
            this.handelDataSelect(dataLocal);
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
            if (filterServer == true && !Vnr_Function.CheckIsNullOrEmpty(filterParams) && searchText != null) {
                url.urlApi = `${url.urlApi}?${filterParams}=${searchText}`;
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
        let { value } = this.props;
        let { dataPicker } = this.state;

        if (this.oldItemIndex != null && dataPicker[this.oldItemIndex] != undefined) {
            dataPicker[this.oldItemIndex].isSelect = false;
        }
        if (this.getDataConfirm().index != null && dataPicker[this.getDataConfirm().index] != undefined) {
            this.oldItemIndex = this.getDataConfirm().index;
            dataPicker[this.getDataConfirm().index].isSelect = true;
        } else if (
            !Vnr_Function.CheckIsNullOrEmpty(value) &&
            value.index != undefined &&
            dataPicker[value.index] != undefined
        ) {
            dataPicker[value.index].isSelect = true;
            this.oldItemIndex = value.index;
        }

        const { autoShowModal } = this.props;
        if (autoShowModal) {
            this.state.stateProps.onFinish(null);
        }
        this.setState({ isModalVisible: false, dataPicker: dataPicker });
    };

    clearDate = () => {
        const { stateProps } = this.state;
        this.setState({ itemSelected: [] }, () => {
            stateProps.onFinish(null);
        });
    };

    onShowModal = () => {
        if (this.isModalOpened === false) {
            this.getData();
        }
    };

    addItemChecked = indexItem => {
        let { itemSelected, dataPicker } = this.state;
        itemSelected.length = 0; // dua mang ve rong
        let itemChecked = dataPicker[indexItem];
        if (!itemChecked.isSelect)
            // kiem tra isSelect == true thi add vao mang itemSelected
            itemSelected = itemSelected.concat(itemChecked);

        itemChecked.isSelect = !itemChecked.isSelect;
        if (
            this.oldItemIndex != null &&
            this.oldItemIndex !== indexItem &&
            !Vnr_Function.CheckIsNullOrEmpty(dataPicker[this.oldItemIndex])
        ) {
            dataPicker[this.oldItemIndex].isSelect = false;
        }
        this.oldItemIndex = indexItem;
        this.setState({ dataPicker: dataPicker, itemSelected: itemSelected });
    };

    onOK = () => {
        let { itemSelected } = this.state;
        if (itemSelected.length == 0) {
            this.setDataConfirm({ data: {}, index: null });
        } else if (itemSelected.length > 0) {
            this.setDataConfirm({ data: itemSelected[0], index: this.oldItemIndex });
        }
        this.state.stateProps.onFinish(itemSelected[0]);
        this.setState({ isModalVisible: false });
    };

    // changeDisable = (bool) => {

    //     const stateProps = this.state.stateProps;
    //     if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.disable) && typeof stateProps.disable === "boolean") {

    //         stateProps.disable = bool;
    //         this.setState({ stateProps });
    //     }
    // }

    changeSearchBar = textValue => {
        const { autoFilter, filterServer } = this.props;
        let callBackFilter = null;
        if (autoFilter && autoFilter === true && !filterServer) {
            callBackFilter = this.filterLocal;
        } else if (filterServer && autoFilter) {
            callBackFilter = this.filterServer;
        }

        this.setState({ searchText: textValue }, callBackFilter);
    };

    filterServer = () => {
        this.getData();
    };

    filterLocal = () => {
        const { textField, filter, filterServer, filterParams, valueField } = this.state.stateProps,
            { value } = this.props,
            { fullData, searchText, itemSelected } = this.state;
        if (filter && !filterServer && searchText != null) {
            let data = fullData.filter(item => {
                if (!Vnr_Function.CheckIsNullOrEmpty(filterParams)) {
                    return Vnr_Function.CheckContains(item, filterParams, searchText);
                } else {
                    return Vnr_Function.CheckContains(item, textField, searchText);
                }
            });
            if (!Vnr_Function.CheckIsNullOrEmpty(value) && Object.keys(value).length > 0) {
                itemSelected.length = 0; // dua mang ve rong
                if (
                    data.findIndex(item => {
                        return value[valueField] == item[valueField];
                    }) > -1
                ) {
                    data = data.map((item, index) => {
                        if (item[valueField] === value[valueField]) {
                            item.isSelect = true;
                            this.oldItemIndex = index;
                            value.index = index;
                        } else {
                            item.isSelect = false;
                        }
                        return item;
                    });
                    itemSelected.push({ ...value, ...{ isSelect: true } });
                } else if (Object.keys(value).length > 0) {
                    value.isSelect = true;
                    value.index = 0;
                    this.oldItemIndex = 0;
                    data = [
                        ...[value],
                        ...data.map(item => {
                            item.isSelect = false;
                            return item;
                        })
                    ];
                    itemSelected.push(value);
                }
            } else {
                data = data.map(item => {
                    item.isSelect = false;
                    return item;
                });
            }
            this.setState({ dataPicker: data, itemSelected });
        }
    };

    componentDidMount() {
        const { autoShowModal, autoBind } = this.props;
        if (autoShowModal) {
            this.opentModal();
        }

        if (autoBind) {
            this.getData();
        }
    }

    onRefreshControl = nextProps => {
        let _state = this.state;
        _state = defaultState;
        _state.stateProps = nextProps;

        this.isModalOpened = false;
        if (this.props.autoBind) {
            this.getData();
        }

        this.setState(_state);
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        //console.log(nextProps.refresh, this.props.refresh);
        if (nextProps.refresh !== this.props.refresh || nextProps.isCheckEmpty !== this.props.isCheckEmpty) {
            this.onRefreshControl(nextProps);
        }
    }

    render() {
        const {
            headerSearch,
            topModal,
            bntPickerDisable,
            ScroollviewModal,
            bottomModal,
            stylePlaceholder
        } = stylesVnrPickerV3;

        const { searchText, isModalVisible, isVisibleLoading, dataPicker, itemSelected, stateProps } = this.state;

        const { isOptionFilterQuicly, layoutFilter } = this.props;

        let textValue = null;
        let disable = false;
        let isHaveValue = true;
        let viewListItem = <View />;
        let viewTitlePicker = <View />;
        let isShowErr = false;
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

        if (
            !Vnr_Function.CheckIsNullOrEmpty(this.props.value) &&
            !Vnr_Function.CheckIsNullOrEmpty(this.props.value[stateProps.textField])
        ) {
            textValue = this.props.value[stateProps.textField];
        } else if (
            stateProps.autoBind &&
            itemSelected.length > 0 &&
            itemSelected[0] &&
            itemSelected[0][stateProps.textField]
        ) {
            textValue = itemSelected[0][stateProps.textField];
        }

        if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.disable) && typeof stateProps.disable === 'boolean') {
            disable = stateProps.disable;
        }

        if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.titlePicker)) {
            viewTitlePicker = (
                <View
                    // eslint-disable-next-line react-native/no-inline-styles
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        paddingVertical: Size.defineHalfSpace
                    }}
                >
                    <VnrText i18nKey={stateProps.titlePicker} style={styleSheets.headerTitleStyle} />
                </View>
            );
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
                    addItem={this.addItemChecked}
                />
            );
        } else if (!isVisibleLoading) {
            viewListItem = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        if (!this.props.value || this.props.value.length == 0) {
            isHaveValue = false;
        }

        return (
            <View
                style={[
                    CustomStyleSheet.width('100%'),
                    isOptionFilterQuicly === true ? CustomStyleSheet.height('100%') : stylesVnrPickerV3.styContentPicker,
                    layoutFilter && { height : 65 }
                ]}
            >
                <TouchableOpacity
                    accessibilityLabel={`VnrPicker-${stateProps.textField ? stateProps.textField : stateProps.lable}`}
                    onPress={() => (!disable ? this.opentModal() : null)}
                    style={[
                        stylesVnrPickerV3.styBntPicker,
                        isShowErr && stylesVnrPickerV3.styBntPickerError,
                        stateProps.stylePicker,
                        disable && bntPickerDisable,
                        (isOptionFilterQuicly === true || layoutFilter)&& { borderBottomWidth: 0 }
                    ]}
                    activeOpacity={!disable ? 0.2 : 1}
                >
                    <View
                        style={[
                            stylesVnrPickerV3.styLeftPicker,
                            stateProps.lable && stylesVnrPickerV3.onlyFlRowSpaceBetween
                        ]}
                    >

                        {
                            layoutFilter ? (
                                <View
                                    style={stylesVnrPickerV3.styLbPicker}
                                >
                                    <VnrText
                                        style={[styleSheets.lable, stylesVnrPickerV3.styLableLayoutFilter]}
                                        numberOfLines={1}
                                        i18nKey={stateProps.lable}
                                    />
                                </View>
                            ) : (
                                <View style={stylesVnrPickerV3.styLbPicker}>
                                    <VnrText
                                        style={[
                                            styleSheets.text,
                                            stylesVnrPickerV3.styLbNoValuePicker
                                        // textValue != null
                                        //     ? stylesVnrPickerV3.styLbHaveValuePicker
                                        //     : stylesVnrPickerV3.styLbNotHaveValuePicker,
                                        ]}
                                        i18nKey={layoutFilter ? stateProps.placeHolder : stateProps.lable}
                                    />
                                    {stateProps.fieldValid && (
                                        <VnrText style={[styleSheets.text, styleValid]} i18nKey={'*'} />
                                    )}
                                </View>
                            )
                        }

                        <View
                            style={[
                                stylesVnrPickerV3.styVlPicker,
                                isOptionFilterQuicly === true
                                    ? CustomStyleSheet.width('100%')
                                    // eslint-disable-next-line react-native/no-inline-styles
                                    : { width: '60%', justifyContent: 'flex-end' }
                            ]}
                        >
                            {textValue != null ? (
                                <Text style={[styleSheets.text, stylesVnrPickerV3.styLableValue]} numberOfLines={1}>
                                    {textValue}
                                </Text>
                            ) : (
                                <VnrText
                                    style={[styleSheets.text, stylePlaceholder, stateProps.stylePlaceholder]}
                                    i18nKey={
                                        !Vnr_Function.CheckIsNullOrEmpty(stateProps.placeholder)
                                            ? stateProps.placeholder
                                            : 'SELECT_ITEM'
                                    }
                                />
                            )}
                        </View>
                    </View>

                    {/* <View style={stylesVnrPickerV3.styRightPicker}>
                        {
                            isShowErr === true ? (
                                <View style={stylesVnrPickerV3.styBtnClear}>
                                    <IconWarn color={Colors.red} size={Size.iconSize - 2} />
                                </View>
                            ) : (
                                // nút clear
                                stateProps.clearText == true && textValue != null && (
                                    <TouchableOpacity onPress={this.clearDate} style={stylesVnrPickerV3.styBtnClear}>
                                        <IconCancel size={Size.iconSize - 2} color={Colors.grey} />
                                    </TouchableOpacity>
                                )
                                    (
                                        isOptionFilterQuicly === true ? (
                                            null
                                        ) : (
                                            <IconDown size={Size.iconSize} color={disable ? Colors.gray_7 : Colors.gray_8} />
                                        )
                                    )
                            )
                        }
                    </View> */}
                    {isShowErr === true ? (
                        <View style={stylesVnrPickerV3.styRightPicker}>
                            <View style={stylesVnrPickerV3.styBtnClear}>
                                <IconWarn color={Colors.red} size={Size.iconSize - 2} />
                            </View>
                        </View>
                    ) : isHaveValue ? null : isOptionFilterQuicly === true ? null : (
                        <View style={stylesVnrPickerV3.styRightPicker}>
                            {stateProps.clearText == true && textValue != null && (
                                <TouchableOpacity onPress={this.clearDate} style={stylesVnrPickerV3.styBtnClear}>
                                    <IconCancel size={Size.iconSize - 2} color={Colors.grey} />
                                </TouchableOpacity>
                            )}

                            <IconDown size={Size.iconSize} color={disable ? Colors.gray_7 : Colors.gray_8} />
                        </View>
                    )}
                </TouchableOpacity>
                <Modal
                    visible={isModalVisible}
                    animationType="none"
                    //presentationStyle="pageSheet"
                    onShow={this.onShowModal}
                    transparent={false}
                    onRequestClose={this.closeModal}
                >
                    <SafeAreaView style={ScroollviewModal} forceInset={{ top: 'always', bottom: 'always' }}>
                        {viewTitlePicker}
                        {stateProps.filter === true && (
                            <View style={topModal}>
                                <View style={headerSearch}>
                                    <Icon name={iconNameSearch} size={Size.iconSize} color={Colors.grey} />
                                    <VnrTextInput
                                        accessibilityLabel={'VnrPicker-Filter'}
                                        onClearText={() =>
                                            this.setState({ searchText: '' }, () =>
                                                stateProps.filterServer ? this.filterServer() : this.filterLocal()
                                            )
                                        }
                                        placeholder={translate('HRM_Common_Search')}
                                        onChangeText={text => this.changeSearchBar(text)}
                                        value={searchText}
                                        style={stylesVnrPickerV3.textInput}
                                        returnKeyType="search"
                                        onSubmitEditing={stateProps.filterServer ? this.filterServer : this.filterLocal}
                                    />
                                </View>
                            </View>
                        )}
                        <View style={CustomStyleSheet.flex(9)}>
                            <View
                                style={CustomStyleSheet.flex(9)}
                            >
                                {viewListItem}
                            </View>
                            <View style={bottomModal}>
                                <TouchableOpacity
                                    accessibilityLabel={'VnrPicker-CloseModal'}
                                    onPress={this.closeModal}
                                    style={[stylesVnrFilter.btn_ClearFilter]}>
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
                                                : 'HRM_Common_Close'
                                        }
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    accessibilityLabel={'VnrPicker-Confirm'}
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