/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-console */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Size, stylesVnrPickerMulti, styleSheets, stylesVnrFilter, CustomStyleSheet } from '../../constants/styleConfig';
import VnrLoading from '../../components/VnrLoading/VnrLoading';
import HttpFactory from '../../factories/HttpFactory';
import Vnr_Function from '../../utils/Vnr_Function';
import VnrText from '../VnrText/VnrText';
import ListItem from './ListItem';
import ListMultiItem from './MultiItem';
import EmptyData from '../EmptyData/EmptyData';
import { translate } from '../../i18n/translate';
import VnrTextInput from '../VnrTextInput/VnrTextInput';
import { IconDown } from '../../constants/Icons';
import HttpService from '../../utils/HttpService';
import { VnrLoadingSevices } from '../VnrLoading/VnrLoadingPages';

const iconNameSearch = `${Platform.OS === 'ios' ? 'ios-' : 'md-'}search`;
const iconNameClose = `${Platform.OS === 'ios' ? 'ios-' : 'md-'}close-circle`;

const defaultState = {
    searchText: '',
    isModalVisible: false,
    itemSelected: [],
    isVisibleLoading: false,
    dataPicker: [],
    fullData: null
};

export default class VnrPickerMultiSave extends Component {
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
        const { value } = this.props;
        if (value === null || value.length === 0) {
            this.getData();
        }
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
        const { valueField } = this.state.stateProps;
        let { searchText, itemSelected } = this.state;
        const { value } = this.props;

        if (Vnr_Function.compare(itemSelected, value)) {
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
                if (data.length > 0 && Vnr_Function.CheckIsNullOrEmpty(searchText)) {
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
        }

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
                this.isModalOpened = true;
                this.handelDataSelect(res);
            })
            .catch(error => console.log(error));
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

    getDataRemoveted = listVL => {
        if (listVL.length === 0) {
            this.getData();
        } else {
            let arr = [];
            const { apiRemove, filter, filterParams, filterServer } = this.state.stateProps;
            const url = { ...apiRemove };
            const { searchText } = this.state;
            const { isRenderLimit, dataLocal } = this.props;
            listVL.map(vl => {
                arr.push(vl.ID);
            });

            if (apiRemove.type === 'E_GET') {
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
            } else if (apiRemove.type === 'E_POST') {
                if (Vnr_Function.CheckIsNullOrEmpty(apiRemove.dataBody)) {
                    console.warn('You can enter dataBody in props api...');
                    return true;
                }
                if (filterServer == true && !Vnr_Function.CheckIsNullOrEmpty(filterParams) && searchText != null) {
                    url.dataBody[filterParams] = searchText;
                }
                // url.dataBody = {
                //     strShiftID: arr.join(',')
                // }
                url.dataBody[Object.keys(url.dataBody)[0]] = arr.join(',');
            }

            VnrLoadingSevices.show();
            HttpFactory.getDataPicker(url)
                .then(res => {
                    if (res) {
                        this.isModalOpened = true;
                        res.map(item => {
                            arr.map(a => {
                                if (a === item.ID) {
                                    item.isSelect = true;
                                }
                            });
                        });

                        // handle task 	0157453: [App] Điều chỉnh màn hình Đổi ca làm việc(thêm props isRenderLimit={true})
                        let arr2 = [];
                        if (isRenderLimit && isRenderLimit === true && dataLocal && Array.isArray(dataLocal)) {
                            res.filter(vl1 => {
                                dataLocal.filter(vl2 => {
                                    if (vl1.ID === vl2.ID) {
                                        arr2.push(vl1);
                                    }
                                });
                            });
                        }
                        this.handelDataSelect(arr2.length > 0 ? arr2 : res);
                        VnrLoadingSevices.hide();
                    }
                })
                .catch(error => console.log(error));
        }
    };

    addItemChecked = indexItem => {
        const { valueField, isConfig } = this.state.stateProps;
        let { itemSelected, dataPicker } = this.state;
        let itemChecked = dataPicker[indexItem];
        if (!itemChecked.isSelect)
            // kiem tra isSelect == true thi add vao mang itemSelected
            itemSelected = itemSelected.concat(itemChecked);
        else {
            itemSelected = Vnr_Function.removeObjectInArray(itemSelected, itemChecked, valueField);
        }
        itemChecked.isSelect = !itemChecked.isSelect;
        this.setState({ dataPicker: dataPicker, itemSelected: itemSelected }, () => {
            if (isConfig) {
                this.getDataRemoveted(itemSelected);
            }
        });
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
        this.getData();
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

    UNSAFE_componentWillReceiveProps (nextProps) {
        if (nextProps.refresh !== this.props.refresh) {
            this.onRefreshControl(nextProps);
        }
    }

    componentDidMount() {
        const { value, isConfig } = this.state.stateProps;
        if (!Vnr_Function.CheckIsNullOrEmpty(value) && value.length > 0) {
            let { itemSelected } = this.state;
            this.setDataConfirm([...value]);
            itemSelected = [...value];
            this.setState({ itemSelected: itemSelected }, () => {
                if (isConfig) {
                    console.log('chi co chinh sua moi vao cho nay`');
                    this.getDataRemoveted(itemSelected);
                }
            });
        } else {
            this.setDataConfirm([]);
            this.setState({ itemSelected: [] });
        }
    }

    render() {
        const {
            textInput,
            headerSearch,
            topModal,
            bntPicker,
            ScroollviewModal,
            multiiSelect,
            multiSelectRight,
            bntDeleteAll,
            bottomModal,
            stylePlaceholder,
            bntPickerDisable
        } = stylesVnrPickerMulti.VnrPickerMulti;
        const { searchText, isModalVisible, isVisibleLoading, dataPicker, stateProps } = this.state;

        const { value } = this.props;

        let disable = false;
        let viewListItem = <View />;
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
        return (
            <View style={[CustomStyleSheet.flex(1), stateProps.stylePicker]}>
                <View
                    style={[
                        multiiSelect
                        // {
                        //     opacity: !disable ? 1 : 0.7,
                        //     backgroundColor: !disable
                        //         ? Colors.white
                        //         : Colors.greyPrimaryConstraint,
                        // },
                    ]}
                >
                    {!value || value.length == 0 ? (
                        <TouchableOpacity
                            onPress={() => {
                                !disable ? this.opentModal() : null;
                            }}
                            activeOpacity={!disable ? 0.2 : 1}
                            style={[bntPicker, stateProps.stylePicker, disable && bntPickerDisable]}
                        >
                            <VnrText
                                style={[styleSheets.text, stylePlaceholder]}
                                i18nKey={
                                    !Vnr_Function.CheckIsNullOrEmpty(stateProps.placeholder)
                                        ? stateProps.placeholder
                                        : 'SELECT_ITEM'
                                }
                            />
                            <IconDown size={Size.iconSize} color={Colors.black} />
                        </TouchableOpacity>
                    ) : (
                        <TouchableOpacity
                            activeOpacity={!disable ? 0.2 : 1}
                            onPress={() => {
                                !disable ? this.opentModal() : null;
                            }}
                            style={[bntPicker, stateProps.stylePicker, disable && bntPickerDisable]}
                        >
                            <ListMultiItem
                                disable={disable}
                                textField={stateProps.textField}
                                valueField={stateProps.valueField}
                                dataSource={value}
                                onOpentModal={this.opentModal}
                                revomeItemSelect={this.revomeItemSelected}
                            />
                            <View style={multiSelectRight}>
                                <Text>({value.length})</Text>
                                <TouchableOpacity
                                    activeOpacity={!disable ? 0.2 : 1}
                                    onPress={() => {
                                        !disable ? this.removeAllItem() : null;
                                    }}
                                    style={bntDeleteAll}
                                >
                                    <Icon name={iconNameClose} size={Size.iconSize} color={Colors.grey} />
                                </TouchableOpacity>
                            </View>
                        </TouchableOpacity>
                    )}
                </View>
                <View style={CustomStyleSheet.flex(1)}>
                    <Modal
                        visible={isModalVisible}
                        animationType="none"
                        //presentationStyle="pageSheet"
                        onShow={this.onShowModal}
                        transparent={false}
                        onRequestClose={this.closeModal}
                    >
                        <SafeAreaView style={ScroollviewModal} forceInset={{ top: 'always', bottom: 'always' }}>
                            {stateProps.filter === true && (
                                <View style={topModal}>
                                    <View style={headerSearch}>
                                        <Icon name={iconNameSearch} size={Size.iconSize} color={Colors.grey} />
                                        <VnrTextInput
                                            onClearText={() =>
                                                this.setState({ searchText: '' }, () => {
                                                    stateProps.filterServer ? this.filterServer() : this.filterLocal();
                                                })
                                            }
                                            placeholder={translate('HRM_Common_Search')}
                                            onChangeText={text => this.changeSearchBar(text)}
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
                                    {/* <TouchableOpacity onPress={() => this.closeModal()} style={bnt_Cancel}>
                                        <VnrText
                                            i18nKey={stateProps.textLeftButton != null ? stateProps.textLeftButton : 'Cancel'}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={this.onOK} style={bnt_Ok}>
                                        <VnrText
                                            i18nKey={stateProps.textRightButton != null ? stateProps.textRightButton : 'Confirm'}
                                        />
                                    </TouchableOpacity> */}
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
                                    <TouchableOpacity
                                        onPress={this.onOK}
                                        style={[stylesVnrFilter.bnt_Ok, { backgroundColor: Colors.primary }]}
                                    >
                                        <VnrText
                                            style={[styleSheets.lable, { color: Colors.white }]}
                                            i18nKey={
                                                stateProps.textRightButton != null
                                                    ? stateProps.textRightButton
                                                    : 'Confirm'
                                            }
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
