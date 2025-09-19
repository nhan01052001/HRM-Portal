/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-console */
import React from 'react';
import { Platform, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, CustomStyleSheet, Size, stylesVnrPicker } from '../../constants/styleConfig';
import { translate } from '../../i18n/translate';
import ListItem from './ListItem';
import HttpFactory from '../../factories/HttpFactory';
import VnrLoading from '../../components/VnrLoading/VnrLoading';
import Vnr_Function from '../../utils/Vnr_Function';
import EmptyData from '../EmptyData/EmptyData';
import VnrTextInput from '../VnrTextInput/VnrTextInput';

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

export default class Picker extends React.Component {
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
        this.setState({ isModalVisible: true, isVisibleLoading: isVisibleLoading });
    };

    handelDataSelect = data => {
        const { valueField, filter, filterServer } = this.state.stateProps,
            { value } = this.props,
            { searchText, itemSelected } = this.state;

        let callbackFunctioFilterLocal = null;
        if (filterServer == false && filter == true && !Vnr_Function.CheckIsNullOrEmpty(searchText)) {
            callbackFunctioFilterLocal = this.filterLocal;
        }
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
            }
            // else if (Object.keys(value).length > 0) {
            //   value.isSelect = true;
            //   value.index = 0;
            //   this.oldItemIndex = 0;
            //   data = [
            //     ...[value],
            //     ...data.map(item => {
            //       item.isSelect = false;
            //       return item;
            //     }),
            //   ];
            //   itemSelected.push(value);
            // }
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
                this.isModalOpened = true;
                this.handelDataSelect(res);
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

    onShowModal = () => {
        if (this.isModalOpened === false) {
            this.getData();
        }
    };

    addItemChecked = indexItem => {
        let { itemSelected, dataPicker } = this.state;
        itemSelected.length = 0; // dua mang ve rong
        let itemChecked = dataPicker[indexItem];

        //if (!itemChecked.isSelect)
        // kiem tra isSelect == true thi add vao mang itemSelected
        itemSelected = itemSelected.concat(itemChecked);

        // phu dinh lai trang thai chon cua item
        itemChecked.isSelect = true;

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

        this.state.stateProps.onFinish(itemSelected[0]);

        this.setState({ dataPicker: dataPicker, itemSelected: itemSelected });

        // code cu
        // if (!itemChecked.isSelect)
        //   // kiem tra isSelect == true thi add vao mang itemSelected
        //   itemSelected = itemSelected.concat(itemChecked);

        // // phu dinh lai trang thai chon cua item
        // itemChecked.isSelect = !itemChecked.isSelect;

        // if (
        //   this.oldItemIndex != null &&
        //   this.oldItemIndex !== indexItem &&
        //   !Vnr_Function.CheckIsNullOrEmpty(dataPicker[this.oldItemIndex])
        // ) {
        //   dataPicker[this.oldItemIndex].isSelect = false;
        // }
        // this.oldItemIndex = indexItem;

        // if (itemSelected.length == 0) {
        //   this.setDataConfirm({ data: {}, index: null });
        // } else if (itemSelected.length > 0) {
        //   this.setDataConfirm({ data: itemSelected[0], index: this.oldItemIndex });
        // }
        // this.state.stateProps.onFinish(itemSelected[0]);

        // this.setState({ dataPicker: dataPicker, itemSelected: itemSelected });
    };

    // onOK = () => {
    //   let { itemSelected } = this.state;
    //   if (itemSelected.length == 0) {
    //     this.setDataConfirm({ data: {}, index: null });
    //   } else if (itemSelected.length > 0) {
    //     this.setDataConfirm({ data: itemSelected[0], index: this.oldItemIndex });
    //   }
    //   this.state.stateProps.onFinish(itemSelected[0]);
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
        const { textField, filter, filterServer, filterParams } = this.state.stateProps,
            { fullData, searchText, itemSelected } = this.state;
        if (filter && !filterServer && searchText != null) {
            let data = fullData.filter(item => {
                if (!Vnr_Function.CheckIsNullOrEmpty(filterParams)) {
                    return Vnr_Function.CheckContains(item, filterParams, searchText);
                } else {
                    return Vnr_Function.CheckContains(item, textField, searchText);
                }
            });
            // if (
            //   !Vnr_Function.CheckIsNullOrEmpty(value) &&
            //   Object.keys(value).length > 0
            // ) {
            //   itemSelected.length = 0; // dua mang ve rong
            //   if (
            //     data.findIndex(item => {
            //       return value[valueField] == item[valueField];
            //     }) > -1
            //   ) {
            //     data = data.map((item, index) => {
            //       if (item[valueField] === value[valueField]) {
            //         item.isSelect = true;
            //         this.oldItemIndex = index;
            //         value.index = index;
            //       } else {
            //         item.isSelect = false;
            //       }
            //       return item;
            //     });
            //     itemSelected.push({ ...value, ...{ isSelect: true } });
            //   }
            //   else if (Object.keys(value).length > 0) {
            //     value.isSelect = true;
            //     value.index = 0;
            //     this.oldItemIndex = 0;
            //     data = [
            //       ...[value],
            //       ...data.map(item => {
            //         item.isSelect = false;
            //         return item;
            //       }),
            //     ];
            //     itemSelected.push(value);
            //   }
            // }
            // else {
            // data = data.map(item => {
            //   item.isSelect = false;
            //   return item;
            // });
            // }

            data = data.map(item => {
                item.isSelect = false;
                return item;
            });

            this.setState({ dataPicker: data, itemSelected });
        }
    };

    componentDidMount() {
        // const { autoShowModal } = this.props;
        // if (autoShowModal) {
        //   this.opentModal();
        // }
        this.getData();
    }

    onRefreshControl = nextProps => {
        let _state = this.state;
        _state = defaultState;
        _state.stateProps = nextProps;
        this.setState(_state);
        this.isModalOpened = false;
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.refresh !== this.props.refresh) {
            this.onRefreshControl(nextProps);
        }
    }

    render() {
        const { textInput, headerSearch, topModal } = stylesVnrPicker.VnrPicker;
        const { searchText, isVisibleLoading, dataPicker, stateProps } = this.state;
        // let textValue = null;
        // let disable = false;
        let viewListItem = <View />;
        // if (
        //     !Vnr_Function.CheckIsNullOrEmpty(this.props.value) &&
        //     !Vnr_Function.CheckIsNullOrEmpty(this.props.value[stateProps.textField])
        // ) {
        //     textValue = this.props.value[stateProps.textField];
        // }

        // if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.disable) && typeof stateProps.disable === 'boolean') {
        //     disable = stateProps.disable;
        // }

        if (dataPicker.length > 0) {
            viewListItem = (
                <ListItem
                    typeIconPicker={stateProps.typeIconPicker}
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

        return (
            <View style={[CustomStyleSheet.flex(1)]}>
                {stateProps.filter === true && (
                    <View style={topModal}>
                        <View style={headerSearch}>
                            <Icon name={iconNameSearch} size={Size.iconSize} color={Colors.grey} />
                            <VnrTextInput
                                onClearText={() =>
                                    this.setState({ searchText: '' }, () =>
                                        stateProps.filterServer ? this.filterServer() : this.filterLocal()
                                    )
                                }
                                placeholder={translate('HRM_Common_Search')}
                                onChangeText={text => this.changeSearchBar(text)}
                                value={searchText}
                                style={textInput}
                                returnKeyType="search"
                                onSubmitEditing={stateProps.filterServer ? this.filterServer : this.filterLocal}
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
                        <VnrLoading size="small" isVisible={isVisibleLoading} />
                        {viewListItem}
                    </View>
                </View>
            </View>
        );
    }
}
