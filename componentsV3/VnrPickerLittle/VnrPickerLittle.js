/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-console */
import React from 'react';
import { View, Text, TouchableOpacity, Modal, Image } from 'react-native';
import {
    Colors,
    Size,
    styleSheets,
    styleValid,
    stylesVnrPickerV3
} from '../../constants/styleConfig';
import { translate } from '../../i18n/translate';
import VnrText from '../../components/VnrText/VnrText';
import ListItem from './ListItem';
import HttpFactory from '../../factories/HttpFactory';
import VnrLoading from '../../components/VnrLoading/VnrLoading';
import Vnr_Function from '../../utils/Vnr_Function';
import EmptyData from '../../components/EmptyData/EmptyData';
import { IconCancel, IconDown, IconWarn } from '../../constants/Icons';
import HttpService from '../../utils/HttpService';
import { EnumName } from '../../assets/constant';
import styleComonAddOrEdit from '../../constants/styleComonAddOrEdit';

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

export default class VnrPickerLittle extends React.Component {
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
        const { api, filter, filterParams, filterServer, params } = this.state.stateProps;
        const { searchText, isVisibleLoading } = this.state;
        const url = { ...api };

        if (!isVisibleLoading) {
            this.setState({ isVisibleLoading: true });
        }
        if (Object.prototype.hasOwnProperty.call(this.state.stateProps, 'dataLocal')) {
            this.handelDataSelect(this.props.dataLocal); // this.props.dataLocal not save cache data
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
                url.urlApi = `${url.urlApi}?${filterParams}=${
                    searchText !== '' ? searchText : params && params !== '' ? params : searchText
                }`;
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
        this.setState(
            {
                dataPicker: dataPicker,
                itemSelected: itemSelected /*isModalVisible: this.props.isChooseQuickly ? true : false*/
            },
            () => {
                if (this.props.isChooseQuickly) {
                    // this.state.stateProps.onFinish(itemSelected[0]);
                    this.onOK();
                }
            }
        );
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
        if (nextProps.refresh !== this.props.refresh) {
            this.onRefreshControl(nextProps);
        }
    }

    render() {
        const {
            bntPickerDisable,
            stylePlaceholder
        } = stylesVnrPickerV3;

        const { isModalVisible, isVisibleLoading, dataPicker, itemSelected, stateProps } = this.state;

        const { isOptionFilterQuicly, isShowIcon, icon } = this.props;

        let textValue = null;
        let disable = false;
        let viewListItem = <View />;
        // let viewTitlePicker = <View />;
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

        // if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.titlePicker)) {
        //     viewTitlePicker = (
        //         <View
        //             style={{
        //                 justifyContent: 'center',
        //                 alignItems: 'center',
        //                 paddingVertical: Size.defineHalfSpace
        //             }}
        //         >
        //             <VnrText i18nKey={stateProps.titlePicker} style={styleSheets.headerTitleStyle} />
        //         </View>
        //     );
        // }

        if (isVisibleLoading) {
            viewListItem = (
                <View style={{ height: 300, width: '100%' }}>
                    <VnrLoading size="small" isVisible={isVisibleLoading} />
                </View>
            );
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
            viewListItem = (
                <View style={{ height: 300, width: '100%' }}>
                    <EmptyData messageEmptyData={'EmptyData'} />
                </View>
            );
        }

        return (
            <View
                style={[
                    { width: '100%' },
                    isOptionFilterQuicly === true ? { height: '100%' } : stylesVnrPickerV3.styContentPicker
                ]}
            >
                <TouchableOpacity
                    accessibilityLabel={`VnrPicker-${stateProps.textField ? stateProps.textField : stateProps.lable}`}
                    onPress={() => (!disable ? this.opentModal() : null)}
                    style={[
                        stylesVnrPickerV3.styBntPicker,
                        stateProps.stylePicker,
                        disable && bntPickerDisable,
                        isShowErr && stylesVnrPickerV3.styBntPickerError,
                        isOptionFilterQuicly === true && { borderBottomWidth: 0 }
                    ]}
                    activeOpacity={!disable ? 0.2 : 1}
                >
                    <View
                        style={[
                            stylesVnrPickerV3.styLeftPicker,
                            stateProps.lable && stylesVnrPickerV3.onlyFlRowSpaceBetween
                        ]}
                    >
                        {isShowIcon && icon && icon !== '' ? <Image source={{ uri: icon }} /> : null}
                        {stateProps.lable && (
                            <View style={[stylesVnrPickerV3.styLbPicker, { width: '50%', maxHeight: '100%' }]}>
                                <VnrText
                                    numberOfLines={2}
                                    style={[
                                        styleSheets.text,
                                        stylesVnrPickerV3.styLbNotHaveValuePicker,
                                        {
                                            marginLeft: 0
                                        }
                                        // textValue != null
                                        //     ? stylesVnrPickerV3.styLbHaveValuePicker
                                        //     : stylesVnrPickerV3.styLbNotHaveValuePicker,
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
                                isOptionFilterQuicly === true
                                    ? { width: '100%' }
                                    : { width: '50%', justifyContent: 'flex-end', alignItems: 'center' }
                            ]}
                        >
                            {textValue != null ? (
                                <Text style={[styleSheets.text, stylesVnrPickerV3.styLableValue]} numberOfLines={1}>
                                    {translate(textValue)}
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

                    <View style={stylesVnrPickerV3.styRightPicker}>
                        {isShowErr === true ? (
                            <View style={stylesVnrPickerV3.styBtnClear}>
                                <IconWarn color={Colors.red} size={Size.iconSize - 2} />
                            </View>
                        ) : // nút clear
                            stateProps.clearText == true && textValue != null ? (
                                <TouchableOpacity onPress={this.clearDate} style={stylesVnrPickerV3.styBtnClear}>
                                    <IconCancel size={Size.iconSize - 2} color={Colors.grey} />
                                </TouchableOpacity>
                            ) : isOptionFilterQuicly === true ? null : (
                                <View style={stylesVnrPickerV3.styBtnClear}>
                                    <IconDown size={Size.iconSize} color={disable ? Colors.gray_7 : Colors.gray_8} />
                                </View>
                            )}
                    </View>
                </TouchableOpacity>
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={isModalVisible} //isModalVisible
                    style={{ padding: 0, margin: 0 }}
                    onShow={this.onShowModal}
                    onRequestClose={this.closeModal}
                >
                    <View style={[styleComonAddOrEdit.wrapModalApprovaLevel, { paddingBottom: 0 }]}>
                        <TouchableOpacity
                            accessibilityLabel={'VnrPicker-CloseModal'}
                            style={[styleComonAddOrEdit.bgOpacity, { backgroundColor: Colors.black, opacity: 0.5 }]}
                            onPress={this.closeModal}
                        />
                        <View style={{ width: '100%', backgroundColor:  Colors.white }}>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    padding: 16
                                }}
                            >
                                {stateProps.lable && (
                                    <VnrText
                                        style={[
                                            styleSheets.text,
                                            styleComonAddOrEdit.styRegister,
                                            styleComonAddOrEdit.fS16fW600,
                                            { color:  Colors.black }
                                        ]}
                                        i18nKey={`${stateProps.lable}`}
                                    />
                                )}
                                {!this.props.isChooseQuickly && (
                                    <TouchableOpacity
                                        accessibilityLabel={'VnrPicker-Confirm'}
                                        onPress={this.onOK}
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
                                )}
                            </View>
                            <View style={{ maxHeight: 500, width: '100%' }}>{viewListItem}</View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}
