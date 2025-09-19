/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-console */
import React, { Component } from 'react';
import { View, StyleSheet, TouchableOpacity, Modal, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Size, styleSheets, stylesVnrFilter, styleValid, stylesVnrPickerV3, CustomStyleSheet } from '../../constants/styleConfig';
import VnrLoading from '../../components/VnrLoading/VnrLoading';
import HttpFactory from '../../factories/HttpFactory';
import Vnr_Function from '../../utils/Vnr_Function';
import VnrText from '../../components/VnrText/VnrText';
import ListItem from './ListItem';
import ListMultiItem from './MultiItem';
import EmptyData from '../../components/EmptyData/EmptyData';
import { translate } from '../../i18n/translate';
import VnrTextInput from '../../components/VnrTextInput/VnrTextInput';
import { IconDown, IconPlus, IconWarn } from '../../constants/Icons';
import HttpService from '../../utils/HttpService';
import { EnumName } from '../../assets/constant';
import ItemQuickSelect from './ItemQuickSelect';

const iconNameSearch = `${Platform.OS === 'ios' ? 'ios-' : 'md-'}search`;
const defaultState = {
    searchText: '',
    isModalVisible: false,
    itemSelected: [],
    isVisibleLoading: false,
    dataPicker: [],
    fullData: null,
    isExceedSize: false
};

export default class VnrPickerMulti extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ...defaultState,
            ...{ stateProps: props }
        };
        this.dataConfirm = [];
        this.isModalOpened = false;
    }

    setDataConfirm = (data) => {
        this.dataConfirm = data;
    };

    getDataConfirm = () => {
        return this.dataConfirm;
    };

    opentModal = () => {
        let isVisibleLoading = this.isModalOpened ? false : true;
        if (
            HttpService.checkConnectInternet() == false &&
            !Object.prototype.hasOwnProperty.call(this.props, 'dataLocal')
        ) {
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
            arr.findIndex((value) => {
                return value[valueField] == item[valueField];
            }) != -1
        ) {
            return true;
        } else {
            return false;
        }
    }

    handelDataSelect = (data) => {
        const { valueField } = this.state.stateProps;
        let { searchText, itemSelected, fullData } = this.state;
        const { value } = this.props;

        if (!Vnr_Function.CheckIsNullOrEmpty(value) && value.length > 0) {
            itemSelected = [...value];
            data = data.map((item) => {
                if (
                    value.findIndex((_value) => {
                        return _value[valueField] == item[valueField];
                    }) != -1
                ) {
                    item.isSelect = true;
                } else {
                    item.isSelect = false;
                }
                return item;
            });
            if (data.length > 0 && Vnr_Function.CheckIsNullOrEmpty(searchText)) {
                value.map((item) => {
                    if (
                        data.findIndex((_value) => {
                            return _value[valueField] == item[valueField];
                        }) < 0
                    ) {
                        item.isSelect = true;
                        data = [...[item], ...data];
                    }
                });
            }
        }

        if (searchText == '') fullData = data;

        this.setState({
            dataPicker: data,
            fullData: fullData,
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
            .then((res) => {
                let data = [];
                if (res.Status == EnumName.E_SUCCESS) {
                    data = res.Data;
                } else if (res) {
                    data = res;
                }

                this.isModalOpened = true;
                this.handelDataSelect(data);
            })
            .catch((error) => console.log(error));
    };

    closeModal = () => {
        let { itemSelected, dataPicker, stateProps } = this.state;
        const data = this.getDataConfirm();
        itemSelected = [...data];
        if (dataPicker != null && dataPicker.length > 0) {
            dataPicker = dataPicker.map((item) => {
                if (
                    itemSelected.findIndex((value) => {
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

    addItemChecked = (indexItem, isQuickSelect) => {
        const { valueField, onlyChooseOne } = this.state.stateProps;
        let { itemSelected, dataPicker } = this.state;

        if (onlyChooseOne) {
            dataPicker = dataPicker.map((item) => {
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

        this.setState({ dataPicker: dataPicker, itemSelected: itemSelected }, () => {
            if (isQuickSelect) this.onOK();
            else if (itemSelected && itemSelected.length == 0) {
                // xác nhận nhưng ko đóng
                this.onOK(true);
            }
        });
    };

    revomeItemSelected = (objectItem) => {
        let { itemSelected, stateProps, dataPicker } = this.state;
        const List = Vnr_Function.removeObjectInArray(itemSelected, objectItem, stateProps.valueField);
        if (dataPicker != null && dataPicker.length > 0) {
            let indexItemRemove = dataPicker.findIndex((item) => {
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
            dataPicker.map((item) => {
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

    removeFilter = () => {
        let { stateProps, dataPicker } = this.state;
        if (dataPicker != null && dataPicker.length > 0) {
            dataPicker.map((item) => {
                item.isSelect = false;
                return item;
            });
        }

        this.setState(
            {
                isModalVisible: false,
                itemSelected: [],
                dataPicker: dataPicker
            },
            () => {
                stateProps.onFinish([], { isClose: true });
            }
        );
    };

    onOK = (isNotClose) => {
        let { itemSelected } = this.state;
        this.setDataConfirm([...itemSelected]);
        this.state.stateProps.onFinish(itemSelected);

        !isNotClose && this.setState({ isModalVisible: false });
    };

    changeSearchBar = (textValue) => {
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

    changeDisable = (bool) => {
        const stateProps = { ...this.state.stateProps };
        if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.disable) && typeof stateProps.disable === 'boolean') {
            stateProps.disable = bool;
            this.setState({ stateProps: stateProps });
        }
    };

    filterLocal = () => {
        const { textField, filter, filterServer, valueField, textFieldFilter } = this.state.stateProps;
        const { fullData, searchText, itemSelected } = this.state;
        const fieldFilterLocal = textFieldFilter ? textFieldFilter : textField;
        if (filter && !filterServer) {
            const data = fullData.filter((item) => {
                return Vnr_Function.CheckContains(item, fieldFilterLocal, searchText);
            });
            data.map((item) => {
                if (
                    itemSelected.findIndex((value) => {
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

    onRefreshControl = (nextProps) => {
        const { value } = nextProps;
        let _state = this.state;
        _state = defaultState;
        _state.stateProps = nextProps;
        this.isModalOpened = false;

        if (!Vnr_Function.CheckIsNullOrEmpty(value) && value.length > 0) {
            this.setDataConfirm([...value]);
            _state.itemSelected = [...value];
            this.setState(_state, () => {
                if (this.props.autoBind) {
                    this.getData();
                }
            });
        } else {
            this.setDataConfirm([]);
            _state.itemSelected = [];
            this.setState(_state, () => {
                if (this.props.autoBind) {
                    this.getData();
                }
            });
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

    renderIconRight = (isHaveValue, isShowErr) => {
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
            if (isHaveValue || isOptionFilterQuicly === true) return <View />;
            else {
                return (
                    <View style={stylesVnrPickerV3.styRightPicker}>
                        {/* {stateProps.clearText == true && textValue != null && (
                            <TouchableOpacity onPress={this.clearDate} style={stylesVnrPickerV3.styBtnClear}>
                                <IconCancel size={Size.iconSize - 2} color={Colors.grey} />
                            </TouchableOpacity>
                        )} */}

                        <IconDown size={Size.iconSize} color={disable ? Colors.gray_7 : Colors.gray_8} />
                    </View>
                );
            }
        }
    };

    renderLableLayout = (value) => {
        const { lable, autoBind } = this.props;
        const { fullData, stateProps } = this.state;
        let countSelect = value !== undefined ? value.length : null,
            isShowQuickSelect = false;

        if (autoBind && fullData && Array.isArray(fullData) && fullData.length > 0 && fullData.length < 4)
            isShowQuickSelect = true;

        return (
            <View style={{}}>
                <TouchableOpacity
                    accessibilityLabel={`VnrPicker-${stateProps.fieldName ? stateProps.fieldName : stateProps.lable}`}
                    onPress={() => !isShowQuickSelect && this.opentModal()}
                    activeOpacity={!isShowQuickSelect ? 0.3 : 1}
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
                    {!isShowQuickSelect && (
                        <View style={stylesVnrPickerV3.styIconLayoutFilter}>
                            <IconPlus color={Colors.black} size={Size.iconSize} />
                        </View>
                    )}
                </TouchableOpacity>

                {isShowQuickSelect && (
                    <View
                        style={styles.styMultiQuickSelect}
                        accessibilityLabel={'VnrPicker-isShowQuickSelect'}
                    >
                        {fullData.map((item, index) => {
                            return (
                                <ItemQuickSelect
                                    key={index}
                                    index={index}
                                    isSelect={item.isSelect}
                                    dataItem={item}
                                    textField={stateProps.textField}
                                    isChecked={(index) => this.addItemChecked(index, true)}
                                />
                            );
                        })}
                    </View>
                )}
            </View>
        );
    };

    render() {
        const {
            searchText,
            isModalVisible,
            isVisibleLoading,
            dataPicker,
            fullData,
            stateProps,
            isExceedSize,
            itemSelected
        } = this.state;

        const { textInput, headerSearch, topModal, ScroollviewModal, bottomModal, bntPickerDisable, stylePlaceholder } =
            stylesVnrPickerV3;

        const { value, isOptionFilterQuicly, layoutFilter, autoBind } = this.props;
        let disable = false;
        let isHaveValue = true;
        let isShowQuickSelect = false;
        let viewListItem = <View />;
        let isShowErr = false;
        if (
            this.props.fieldValid &&
            this.props.fieldValid === true &&
            this.props.isCheckEmpty &&
            this.props.isCheckEmpty === true &&
            (stateProps.value === null || stateProps.value === undefined || Object.keys(stateProps.value).length === 0)
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
        } else if (dataPicker && dataPicker.length > 0) {
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

        if (autoBind && fullData && Array.isArray(fullData) && fullData.length > 0 && fullData.length < 4) {
            isShowQuickSelect = true;
        }

        const countSelect = itemSelected && itemSelected.length > 0 ? itemSelected.length : null,
            isBtnChoseDisable = !countSelect ? true : false;
        return (
            <View
                style={[
                    styles.styContentPicker,
                    layoutFilter && { height: 50 },
                    isOptionFilterQuicly === true
                        ? { height: '100%', width: '100%' }
                        : (value !== undefined && value.length > 2) ||
                            (isExceedSize === true && value.length > 1) ||
                            isShowQuickSelect
                            ? { height: 'auto' }
                            : value !== undefined && value.length <= 2 && value.length > 0
                                ? { height: 'auto' }
                                : { height: 50 },
                    isShowErr && { borderBottomWidth: 0.8, borderBottomColor: Colors.red }

                ]}
            >
                {layoutFilter ? this.renderLableLayout(value) : (
                    <TouchableOpacity
                        accessibilityLabel={`VnrPicker-${stateProps.fieldName ? stateProps.fieldName : stateProps.lable}`}
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
                            isShowErr && { borderBottomWidth: 0 },
                            layoutFilter && { borderBottomWidth: 0 }
                        ]}
                        activeOpacity={!disable ? 0.2 : 1}
                    >
                        <View
                            style={[
                                stylesVnrPickerV3.styLeftPicker,
                                stateProps.lable && isHaveValue ? CustomStyleSheet.paddingVertical(6) : stylesVnrPickerV3.onlyFlRowSpaceBetween
                            ]}
                        >
                            {stateProps.lable && !layoutFilter && !isOptionFilterQuicly && (
                                <View style={[stylesVnrPickerV3.styLbPicker, {}]}>
                                    <VnrText
                                        style={[
                                            styleSheets.text,
                                            stylesVnrPickerV3.styLbNoValuePicker
                                            // isHaveValue ? { fontSize: 14,color : 'red' } : { fontSize: Size.text, }
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
                                    isHaveValue ? styles.haveValue : styles.yetValue,
                                    { flex: 1 }
                                ]}
                            >
                                {isHaveValue && !isShowQuickSelect ? (
                                    <ListMultiItem
                                        disable={disable}
                                        textField={stateProps.textField}
                                        valueField={stateProps.valueField}
                                        dataSource={value}
                                        onOpentModal={this.opentModal}
                                        revomeItemSelect={this.revomeItemSelected}
                                        onExceedSizeWith={this.eventExceedSizeWith}
                                    />
                                ) : (
                                    !layoutFilter && (
                                        <View style={[isOptionFilterQuicly === true ? styles.fl1Center : {}]}>
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
                            </View>
                        </View>
                        {this.renderIconRight(isHaveValue, isShowErr)}
                    </TouchableOpacity>
                )}

                <Modal
                    visible={isModalVisible}
                    animationType="none"
                    //presentationStyle="pageSheet"
                    onShow={this.onShowModal}
                    transparent={false}
                    onRequestClose={this.closeModal}
                >
                    <SafeAreaView style={ScroollviewModal} forceInset={{ top: 'always', bottom: 'always' }}>
                        <View style={stylesVnrPickerV3.wrapHeaderTitle}>
                            <View style={stylesVnrPickerV3.styViewTitle}>
                                <VnrText style={styleSheets.lable} i18nKey={stateProps.lable} />
                            </View>
                            <View style={stylesVnrPickerV3.styDefTitle}>
                                <TouchableOpacity
                                    style={stylesVnrPickerV3.styDefTitleBtn}
                                    onPress={() => this.closeModal()}
                                >
                                    <Image source={require('../../assets/images/filterV3/fi_x.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        {stateProps.filter === true && (
                            <View style={topModal}>
                                <View style={headerSearch}>
                                    <Icon name={iconNameSearch} size={Size.iconSize} color={Colors.grey} />
                                    <VnrTextInput
                                        accessibilityLabel={'VnrPicker-Filter'}
                                        onClearText={() =>
                                            this.setState({ searchText: '' }, () => {
                                                stateProps.filterServer ? this.filterServer() : this.filterLocal();
                                            })
                                        }
                                        placeholder={translate('HRM_Common_Search')}
                                        onChangeText={(text) => this.changeSearchBar(text)}
                                        value={searchText}
                                        style={textInput}
                                        returnKeyType="search"
                                        onSubmitEditing={stateProps.filterServer ? this.getData : this.filterLocal}
                                    />
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
                            <View style={bottomModal}>
                                <TouchableOpacity
                                    onPress={() => this.removeFilter()}
                                    style={[stylesVnrFilter.btn_ClearFilter]}
                                >
                                    <VnrText
                                        style={[
                                            styleSheets.lable,
                                            isBtnChoseDisable ? { color: Colors.gray_8 } : { color: Colors.gray_9 }
                                        ]}
                                        i18nKey={
                                            stateProps.textLeftButton != null
                                                ? stateProps.textLeftButton
                                                : 'HRM_PortalApp_RemoveSelect'
                                        }
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    accessibilityLabel={'VnrPicker-Confirm'}
                                    accessibilityState={{ disabled: isBtnChoseDisable }}
                                    onPress={() => (!isBtnChoseDisable ? this.onOK() : null)}
                                    style={[
                                        stylesVnrFilter.bnt_Ok,
                                        isBtnChoseDisable
                                            ? { backgroundColor: Colors.gray_3 }
                                            : { backgroundColor: Colors.primary }
                                    ]}
                                >
                                    <VnrText
                                        style={[
                                            styleSheets.lable,
                                            isBtnChoseDisable ? { color: Colors.gray_8 } : { color: Colors.white }
                                        ]}
                                        value={
                                            stateProps.textRightButton != null
                                                ? translate(stateProps.textRightButton)
                                                : `${translate('HRM_Select_Apply_Filter')} ${countSelect ? `(${countSelect})` : ''
                                                }`
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
    styMultiQuickSelect: {
        width: '100%',
        paddingVertical: Size.defineHalfSpace,
        paddingHorizontal: Size.defineSpace,
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
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
    haveValue: {
        width: '100%',
        marginTop: Size.defineHalfSpace,
        minHeight: 'auto'
    },
    yetValue: { width: '60%', justifyContent: 'flex-end' },
    fl1Center: { flex: 1, justifyContent: 'center', alignItems: 'flex-start' }
});
