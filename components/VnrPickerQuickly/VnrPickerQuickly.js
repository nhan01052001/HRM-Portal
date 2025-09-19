/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-console */
import React from 'react';
import {
    View,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView
} from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {
    Colors,
    Size,
    styleSheets,
    stylesVnrPicker,
    stylesVnrFilter,
    stylesModalPopupBottom,
    CustomStyleSheet
} from '../../constants/styleConfig';
import { translate } from '../../i18n/translate';
import VnrText from '../VnrText/VnrText';
import ListItem from './ListItem';
import HttpFactory from '../../factories/HttpFactory';
import VnrLoading from '../../components/VnrLoading/VnrLoading';
import Vnr_Function from '../../utils/Vnr_Function';
import EmptyData from '../EmptyData/EmptyData';
import { IconDown } from '../../constants/Icons';
import VnrTextInput from '../VnrTextInput/VnrTextInput';
import HttpService from '../../utils/HttpService';

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

export default class VnrPickerQuickly extends React.Component {
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
        const { valueField, textField, filter, filterServer, isAddEmptyItem } = this.state.stateProps,
            { value } = this.props,
            { searchText, itemSelected } = this.state;

        if (isAddEmptyItem && isAddEmptyItem.isActive) {
            data = [isAddEmptyItem.value].concat(data);
        }
        let callbackFunctioFilterLocal = null;
        if (filterServer == false && filter == true && !Vnr_Function.CheckIsNullOrEmpty(searchText)) {
            callbackFunctioFilterLocal = this.filterLocal;
        }

        itemSelected.length = 0; // dua mang ve rong
        // nhan.nguyen: check data is Array
        if (Array.isArray(data)) {
            if (!Vnr_Function.CheckIsNullOrEmpty(value) && Object.keys(value).length > 0) {
                itemSelected.length = 0; // dua mang ve rong
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
        const { api, filter, filterParams, filterServer } = this.state.stateProps;
        const { searchText, isVisibleLoading } = this.state;
        const url = { ...api };

        if (!isVisibleLoading) {
            this.setState({ isVisibleLoading: true });
        }
        if (Object.prototype.hasOwnProperty.call(this.props, 'dataLocal')) {
            this.handelDataSelect(this.props.dataLocal);
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
                this.isModalOpened = true;
                this.handelDataSelect(res);
            })
            .catch(error => console.log(error));
    };

    closeModal = () => {
        console.log('closeModal');
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

    onShowModal = () => {
        if (this.isModalOpened === false) {
            this.getData();
        }
    };

    addItemChecked = indexItem => {
        let { itemSelected, dataPicker } = this.state;
        itemSelected.length = 0; // dua mang ve rong
        let itemChecked = dataPicker[indexItem];

        if (!itemChecked.isSelect) itemSelected = itemSelected.concat(itemChecked);

        // if (this.oldItemIndex != null && this.oldItemIndex == indexItem) {
        //   itemChecked.isSelect = true;
        // }
        // else {
        itemChecked.isSelect = !itemChecked.isSelect;
        // }

        if (
            this.oldItemIndex != null &&
            this.oldItemIndex !== indexItem &&
            !Vnr_Function.CheckIsNullOrEmpty(dataPicker[this.oldItemIndex])
        ) {
            dataPicker[this.oldItemIndex].isSelect = false;
        }
        this.oldItemIndex = indexItem;

        if (itemSelected.length == 0) {
            this.setDataConfirm({ data: {}, index: null });
        } else if (itemSelected.length > 0) {
            this.setDataConfirm({ data: itemSelected[0], index: this.oldItemIndex });
        }

        this.setState(
            {
                dataPicker: dataPicker,
                itemSelected: itemSelected,
                isModalVisible: false
            },
            () => {
                setTimeout(() => {
                    this.state.stateProps.onFinish(itemSelected[0] ? itemSelected[0] : null);
                }, 500);
            }
        );
    };

    // onOK = () => {
    //   let { itemSelected } = this.state;
    //   if (itemSelected.length == 0) {
    //     this.setDataConfirm({ data: {}, index: null });
    //   } else if (itemSelected.length > 0) {
    //     this.setDataConfirm({ data: itemSelected[0], index: this.oldItemIndex });
    //   }

    //   this.setState({ isModalVisible: false });
    // };

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
        if (!filterServer) {
            callBackFilter = this.filterLocal;
        } else if (filterServer && autoFilter) {
            callBackFilter = this.filterServer;
        }

        this.setState({ searchText: textValue }, callBackFilter);
    };

    filterServer = () => {
        const { autoFilter } = this.props;
        if (autoFilter) {
            Vnr_Function.delay(() => {
                this.getData();
            }, 500);
        } else {
            this.getData();
        }
    };

    filterLocal = () => {
        const { textField, filter, filterServer, filterParams, valueField } = this.state.stateProps,
            { value } = this.props,
            { fullData, searchText, itemSelected, textFieldFilter } = this.state;
        const fieldFilterLocal = textFieldFilter ? textFieldFilter : textField;

        if (filter && !filterServer && searchText != null && fullData) {
            let data = fullData.filter(item => {
                if (!Vnr_Function.CheckIsNullOrEmpty(filterParams)) {
                    return Vnr_Function.CheckContains(item, filterParams, searchText);
                } else {
                    return Vnr_Function.CheckContains(item, fieldFilterLocal, searchText);
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
        if (nextProps.refresh !== this.props.refresh) {
            this.onRefreshControl(nextProps);
        }
    }

    render() {
        const {
            textInput,
            headerSearch,
            topModal,
            bntPicker,
            selectPicker,
            ScroollviewModal,
            bottomModal,
            stylePlaceholder,
            styLableValue,
            bntPickerDisable
        } = stylesVnrPicker.VnrPicker;
        const { searchText, isModalVisible, isVisibleLoading, dataPicker, itemSelected, stateProps } = this.state;
        let textValue = null;
        let disable = false;
        let viewListItem = <View />;
        let viewTitlePicker = <View />;

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
                    style={{
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginTop: 15
                    }}
                >
                    <VnrText i18nKey={stateProps.titlePicker} style={[styleSheets.headerTitleStyle]} />
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
                    textFieldFilter={stateProps.textFieldFilter}
                    addItem={this.addItemChecked}
                />
            );
        } else if (!isVisibleLoading) {
            viewListItem = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return (
            <View style={[{ flex: 1 }]}>
                <View
                    style={[
                        selectPicker
                        // {
                        //   opacity: !disable ? 1 : 0.7,
                        //   backgroundColor: !disable
                        //     ? Colors.white
                        //     : Colors.greyPrimaryConstraint,
                        // },
                    ]}
                >
                    <TouchableOpacity
                        onPress={() => (!disable ? this.opentModal() : null)}
                        style={[bntPicker, stateProps.stylePicker, disable && bntPickerDisable]}
                        activeOpacity={!disable ? 0.2 : 1}
                    >
                        <View style={{ flex: 1 }}>
                            <Text style={[styleSheets.text, styLableValue]} numberOfLines={1}>
                                {textValue != null ? (
                                    textValue
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
                            </Text>
                        </View>
                        <View style={{}}>
                            <IconDown size={Size.iconSize} color={disable ? Colors.gray_7 : Colors.gray_8} />
                        </View>
                    </TouchableOpacity>
                </View>
                <View style={{ flex: 1 }}>
                    <Modal
                        onShow={this.onShowModal}
                        onBackButtonPress={() => this.closeModal()}
                        key={'@MODAL_PICKER'}
                        isVisible={isModalVisible}
                        // swipeDirection={
                        //   stateProps.filter && Platform.OS == 'android' ? null : ['down']
                        // }
                        //onSwipeComplete={() => this.closeModal()}
                        // onBackdropPress={() => this.closeModal()}
                        customBackdrop={
                            <TouchableWithoutFeedback onPress={() => this.closeModal()}>
                                <View
                                    style={{
                                        flex: 1,
                                        backgroundColor: Colors.black,
                                        opacity: 0.5
                                    }}
                                />
                            </TouchableWithoutFeedback>
                        }
                        style={{
                            margin: 0
                        }}
                    >
                        <TouchableWithoutFeedback onPress={() => this.closeModal()}>
                            <KeyboardAvoidingView style={{ flex: 1 }} behavior={'height'}>
                                <View
                                    style={
                                        stateProps.filter && Platform.OS == 'android'
                                            ? {
                                                flex: 1,
                                                backgroundColor: Colors.white
                                            }
                                            : [
                                                stylesModalPopupBottom.viewEditModal,
                                                {
                                                    height: Size.deviceheight * 0.6
                                                }
                                            ]
                                    }
                                >
                                    <SafeAreaView style={ScroollviewModal}>
                                        {viewTitlePicker}
                                        {stateProps.filter === true && (
                                            <View style={topModal}>
                                                <View
                                                    style={[
                                                        headerSearch,
                                                        CustomStyleSheet.marginVertical(10)
                                                    ]}
                                                >
                                                    <Icon
                                                        name={iconNameSearch}
                                                        size={Size.iconSize}
                                                        color={Colors.grey}
                                                    />
                                                    <VnrTextInput
                                                        onClearText={() =>
                                                            this.setState({ searchText: '' }, () =>
                                                                stateProps.filterServer
                                                                    ? this.filterServer()
                                                                    : this.filterLocal()
                                                            )
                                                        }
                                                        placeholder={translate('HRM_Common_Search')}
                                                        onChangeText={text => this.changeSearchBar(text)}
                                                        value={searchText}
                                                        style={textInput}
                                                        returnKeyType="search"
                                                        onSubmitEditing={
                                                            stateProps.filterServer
                                                                ? this.filterServer
                                                                : this.filterLocal
                                                        }
                                                    />
                                                </View>
                                            </View>
                                        )}
                                        <View style={{ flex: 9, flexDirection: 'column' }}>{viewListItem}</View>
                                        {isVisibleLoading === false && dataPicker.length == 0 && (
                                            <View style={bottomModal}>
                                                <TouchableOpacity
                                                    onPress={this.closeModal}
                                                    style={[stylesVnrFilter.btn_ClearFilter]}
                                                >
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
                                            </View>
                                        )}
                                    </SafeAreaView>
                                </View>
                            </KeyboardAvoidingView>
                        </TouchableWithoutFeedback>
                    </Modal>
                </View>
            </View>
        );
    }
}
