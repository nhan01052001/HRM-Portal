/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-console */
import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, TextInput, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    Colors,
    Size,
    styleSheets,
    stylesVnrFilter,
    stylesVnrPickerV3,
    CustomStyleSheet
} from '../../constants/styleConfig';
import VnrLoading from '../../components/VnrLoading/VnrLoading';
import HttpFactory from '../../factories/HttpFactory';
import Vnr_Function from '../../utils/Vnr_Function';
import VnrText from '../../components/VnrText/VnrText';
import ListItem from './ListItem';
import ListMultiItem from './MultiItem';
import ItemUserApprover from './ItemUserApprover';
import EmptyData from '../../components/EmptyData/EmptyData';
import { translate } from '../../i18n/translate';
import { IconSearch, IconCancel, IconDown, IconWarn } from '../../constants/Icons';
import HttpService from '../../utils/HttpService';
import { EnumName } from '../../assets/constant';

const defaultState = {
    searchText: '',
    isModalVisible: false,
    itemSelected: [],
    isVisibleLoading: false,
    dataPicker: [],
    fullData: null
};

// Component chọn người duyệt với UI theo Figma và logic chọn nhiều/đánh dấu quan trọng
export default class VnrSuperFilterWithTextInputUserApprover extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ...defaultState,
            ...{ stateProps: props }
        };
        this.dataConfirm = [];
        this.isModalOpened = false;
    }

    // Lưu tạm dữ liệu đã xác nhận (OK) để đồng bộ khi đóng
    setDataConfirm = (data) => {
        this.dataConfirm = data;
    };

    // Toggle cờ IsImportant cho một nhân sự đã chọn, cho phép nhiều IsImportant
    toggleImportant = (item) => {
        const { valueField } = this.state.stateProps;
        let { itemSelected, dataPicker } = this.state;

        const isOn = item.IsImportant === true;

        itemSelected = itemSelected.map((it) => {
            if (it[valueField] == item[valueField]) return { ...it, IsImportant: !isOn };
            return it;
        });
        dataPicker = dataPicker.map((it) => {
            if (it[valueField] == item[valueField]) return { ...it, IsImportant: !isOn };
            return it;
        });

        this.setState({ itemSelected, dataPicker });
    };

    getDataConfirm = () => this.dataConfirm;

    // Mở modal và load dữ liệu nếu cần
    opentModal = () => {
        const isVisibleLoading = this.isModalOpened ? false : true;
        if (
            HttpService.checkConnectInternet() == false &&
            !Object.prototype.hasOwnProperty.call(this.props, 'dataLocal')
        ) {
            HttpService.showAlertNoNetwork(this.opentModal);
            return;
        }
        this.setState({ isModalVisible: true, isVisibleLoading });
    };

    // Đồng bộ danh sách hiển thị với danh sách đã chọn hiện có
    handelDataSelect = (data) => {
        let { itemSelected } = this.state;
        const { value, isOptionFilterQuicly } = this.props;

        if (!Vnr_Function.CheckIsNullOrEmpty(value) && value.length > 0) {
            if (itemSelected.length == 0 || (isOptionFilterQuicly && isOptionFilterQuicly === true)) {
                itemSelected = [...value];
            }
        }

        if (itemSelected.length > 0 && Array.isArray(data) && data.length > 0) {
            data = data.map((item) => {
                if (
                    itemSelected.findIndex((_value) => {
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
        this.setState({ dataPicker: data, fullData: data, isVisibleLoading: false, itemSelected });
    };

    // Lấy dữ liệu người duyệt từ API hoặc local, hỗ trợ filter server/local
    getData = () => {
        const { api, dataLocal, filter, filterParams, filterServer } = this.state.stateProps;
        const { searchText, isVisibleLoading } = this.state;
        const url = { ...api };
        if (!isVisibleLoading) this.setState({ isVisibleLoading: true });

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
                if (url.urlApi.indexOf('?') > 0) url.urlApi = `${url.urlApi}&${filterParams}=${searchText}`;
                else url.urlApi = `${url.urlApi}?${filterParams}=${searchText}`;
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
                if (res.Status == EnumName.E_SUCCESS) data = res.Data;
                else if (res) data = res;
                this.isModalOpened = true;
                this.handelDataSelect(data);
            })
            .catch((error) => console.log(error));
    };

    // Đóng modal và gọi onFinish ở cha (đồng bộ danh sách đã chọn)
    closeModal = () => {
        let { itemSelected, dataPicker, stateProps } = this.state;
        const data = this.getDataConfirm();
        itemSelected = [...data];
        if (dataPicker && Array.isArray(dataPicker) && dataPicker.length > 0) {
            dataPicker = dataPicker.map((item) => {
                if (
                    itemSelected.findIndex((value) => {
                        return value[stateProps.valueField] == item[stateProps.valueField];
                    }) != -1
                ) {
                    item.isSelect = true;
                } else item.isSelect = false;
                return item;
            });
        }
        this.isModalOpened = false;
        this.setState({ isModalVisible: false, itemSelected: itemSelected, dataPicker: dataPicker }, () => {
            stateProps.onFinish(itemSelected, { isClose: true });
        });
    };

    // Trigger load data khi modal hiển thị lần đầu
    onShowModal = () => {
        if (this.isModalOpened === false) this.getData();
    };

    // Thêm/bỏ người duyệt, preserve thứ tự append vào cuối danh sách đã chọn
    addItemChecked = (indexItem) => {
        const { valueField, isChooseOne } = this.state.stateProps;
        let { itemSelected, dataPicker } = this.state;
        let itemChecked = dataPicker[indexItem];
        if (isChooseOne) {
            itemSelected.length = 0;
            itemSelected.push(itemChecked);
            const index = dataPicker.findIndex((item) => item?.isSelect === true);
            if (index > -1) dataPicker[index].isSelect = false;
        } else if (!itemChecked.isSelect) {
            // thêm vào CUỐI danh sách đã chọn
            itemSelected = [...itemSelected, itemChecked];
        } else itemSelected = Vnr_Function.removeObjectInArray(itemSelected, itemChecked, valueField);
        itemChecked.isSelect = !itemChecked.isSelect;
        this.setState({ dataPicker: dataPicker, itemSelected: itemSelected, searchText: '' });
    };

    // Xóa một người duyệt khỏi danh sách đã chọn và hủy chọn ở dataSource
    revomeItemSelected = (objectItem) => {
        let { itemSelected, stateProps, dataPicker } = this.state;
        const List = Vnr_Function.removeObjectInArray(itemSelected, objectItem, stateProps.valueField);
        if (dataPicker != null && dataPicker.length > 0) {
            let indexItemRemove = dataPicker.findIndex((item) => {
                return item[stateProps.valueField] == objectItem[stateProps.valueField];
            });
            if (indexItemRemove != -1) dataPicker[indexItemRemove].isSelect = false;
        }
        this.setDataConfirm([...List]);
        this.setState({ itemSelected: List, dataPicker: dataPicker }, stateProps.onFinish(itemSelected));
    };

    // Xóa toàn bộ danh sách đã chọn
    removeAllItem = () => {
        let { stateProps, dataPicker } = this.state;
        this.setDataConfirm([]);
        if (dataPicker != null && dataPicker.length > 0) {
            dataPicker.map((item) => {
                item.isSelect = false;
                return item;
            });
        }
        this.setState({ itemSelected: [], dataPicker: dataPicker }, stateProps.onFinish([]));
    };

    // Xác nhận: trả danh sách đã chọn về cha và đóng modal
    onOK = () => {
        let { itemSelected } = this.state;
        // Trả đúng format đang hiển thị (bao gồm IsImportant)
        const result = Array.isArray(itemSelected) ? itemSelected.map((it) => ({ ...it })) : [];
        this.setDataConfirm([...result]);
        if (typeof this.state.stateProps.onFinish === 'function') {
            this.state.stateProps.onFinish(result);
        }
        this.setState({ isModalVisible: false });
    };

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

    // Debounce gọi API filter server-side
    filterServer = () => {
        Vnr_Function.delay(() => {
            this.getData();
        }, 500);
    };

    // Lọc local theo text nhập và đồng bộ trạng thái chọn
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
                } else item.isSelect = false;
                return item;
            });
            this.setState({ dataPicker: data });
        }
    };

    renderHeaderFigma = () => {
        const { stateProps } = this.state;
        return (
            <View style={stylesFigma.header}>
                <Text style={[styleSheets.lable, stylesFigma.headerTitle]} numberOfLines={1}>
                    {translate(stateProps?.lable) || ''}
                </Text>
                <TouchableOpacity onPress={this.closeModal} style={stylesFigma.headerCloseBtn} activeOpacity={0.7}>
                    <IconCancel size={Size.iconSize - 2} color={Colors.black} />
                </TouchableOpacity>
            </View>
        );
    };

    renderSearchBarFigma = () => {
        const { stateProps, itemSelected, searchText } = this.state;
        const { filter, filterServer } = stateProps;
        if (stateProps.filter !== true) return <View />;
        return (
            <View style={stylesFigma.searchWrap}>
                <View style={stylesFigma.searchContainer}>
                    <View style={stylesFigma.searchIcon}>
                        <IconSearch size={Size.iconSize} color={Colors.gray_9} />
                    </View>
                    <TextInput
                        placeholder={translate('HRM_Common_Search')}
                        onChangeText={(text) => {
                            this.setState({ searchText: text }, () => {
                                if (filter === true && filterServer === true) this.filterServer();
                                else this.filterLocal();
                            });
                        }}
                        value={searchText}
                        style={[styleSheets.text, stylesFigma.searchInput]}
                        returnKeyType="search"
                    />
                </View>
            </View>
        );
    };

    render() {
        const { isModalVisible, isVisibleLoading, dataPicker, itemSelected, stateProps } = this.state;
        const { layoutFilter, children, valueDisplay, isChooseOne, fieldValid, isCheckEmpty, value } = this.props;

        let isShowErr = false;
        let disable = false;
        let isHaveValue = true;
        let viewListItem = <View />;

        if (!Vnr_Function.CheckIsNullOrEmpty(stateProps.disable) && typeof stateProps.disable === 'boolean') {
            disable = stateProps.disable;
        }

        if (isVisibleLoading) viewListItem = <VnrLoading size="small" isVisible={isVisibleLoading} />;
        else if (dataPicker && Array.isArray(dataPicker) && dataPicker.length > 0) {
            const selected = itemSelected; // giữ thứ tự đã chọn (append cuối)
            const unselected = dataPicker.filter((x) => !x.isSelect);
            
            viewListItem = (
                <ScrollView showsVerticalScrollIndicator={false}>
                    {selected.length > 0 && (
                        <View>
                            <View
                                style={{
                                    flexDirection: 'row',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    borderBottomWidth: 0.5,
                                    borderBottomColor: Colors.gray_5,
                                    marginHorizontal: 12
                                }}
                            >
                                <Text style={[styleSheets.text, stylesFigma.sectionTitle]}>{translate('HRM_PortalApp_SelectedUsers')}</Text>

                                <Text style={[styleSheets.text, stylesFigma.sectionTitle]}>{translate('HRM_PortalApp_MainExecutors')}</Text>
                            </View>
                            {selected.map((item, idx) => (
                                <ItemUserApprover
                                    key={`s-${idx}`}
                                    dataItem={item}
                                    textField={stateProps.textField}
                                    licensedDisplay={stateProps.licensedDisplay?.[0]}
                                    isSelect={true}
                                    showStar={true}
                                    onPress={() => {
                                        const i = dataPicker.findIndex(
                                            (it) => it[stateProps.valueField] == item[stateProps.valueField]
                                        );
                                        if (i > -1) this.addItemChecked(i);
                                    }}
                                    onToggleStar={() => this.toggleImportant(item)}
                                />
                            ))}
                        </View>
                    )}
                    <View
                        style={{
                            borderBottomWidth: 0.5,
                            borderBottomColor: Colors.gray_5,
                            marginHorizontal: 12
                        }}
                    >
                        <Text style={[styleSheets.text, stylesFigma.sectionTitle]}>{translate('HRM_PortalApp_UnselectedList')}</Text>
                    </View>
                    {unselected.map((item, idx) => (
                        <ItemUserApprover
                            key={`u-${idx}`}
                            dataItem={item}
                            textField={stateProps.textField}
                            licensedDisplay={stateProps.licensedDisplay?.[0]}
                            isSelect={false}
                            showStar={false}
                            onPress={() => this.addItemChecked(dataPicker.indexOf(item))}
                            onToggleStar={() => {}}
                        />
                    ))}
                </ScrollView>
            );
        } else if (!isVisibleLoading) {
            viewListItem = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        if (!value || value.length == 0) isHaveValue = false;
        if (
            fieldValid &&
            fieldValid === true &&
            isCheckEmpty &&
            isCheckEmpty === true &&
            (value === null || value === undefined || Object.keys(value).length === 0)
        ) {
            isShowErr = true;
        } else isShowErr = false;

        return (
            <View
                style={[
                    stylesRoot.styContentPicker,
                    layoutFilter && { height: 50 },
                    isShowErr && stylesRoot.borderBottom
                ]}
            >
                <TouchableOpacity
                    disabled={Array.isArray(valueDisplay) && valueDisplay.length > 0 ? true : false}
                    onPress={() => (!disable ? this.opentModal() : null)}
                    style={[
                        stateProps.stylePicker,
                        disable && stylesVnrPickerV3.bntPickerDisable,
                        stylesRoot.styBntPicker,
                        (layoutFilter || isShowErr) && { borderBottomWidth: 0 }
                    ]}
                    activeOpacity={!disable ? 0.2 : 1}
                >
                    {children ? (
                        children
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
                                    stateProps.lable && isHaveValue
                                        ? CustomStyleSheet.paddingVertical(6)
                                        : stylesVnrPickerV3.onlyFlRowSpaceBetween,
                                    !isHaveValue && CustomStyleSheet.alignItems('center')
                                ]}
                            >
                                {stateProps.lable && !layoutFilter && (
                                    <View
                                        style={[
                                            stylesVnrPickerV3.styLbPicker,
                                            !isHaveValue && CustomStyleSheet.maxWidth('45%')
                                        ]}
                                    >
                                        <Text style={[styleSheets.text, stylesVnrPickerV3.styLbNoValuePicker]}>
                                            {translate(stateProps.lable)}
                                            {stateProps.fieldValid && (
                                                <VnrText
                                                    style={[styleSheets.text, stylesFigma.starRequired]}
                                                    i18nKey={'*'}
                                                />
                                            )}
                                        </Text>
                                    </View>
                                )}
                                <View
                                    style={[
                                        stylesVnrPickerV3.styVlPicker,
                                        isHaveValue ? stylesRoot.haveValue : stylesRoot.yetValue,
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
                                            onExceedSizeWith={() => {}}
                                            licensedDisplay={stateProps.licensedDisplay?.[0]}
                                        />
                                    ) : (
                                        !layoutFilter && (
                                            <View style={{ marginRight: 2 }}>
                                                <VnrText
                                                    style={[
                                                        styleSheets.text,
                                                        stylesVnrPickerV3.stylePlaceholder,
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
                                    {isHaveValue ? null : (
                                        <View
                                            style={[stylesVnrPickerV3.styRightPicker, CustomStyleSheet.marginRight(16)]}
                                        >
                                            {stateProps.clearText == true ? (
                                                <TouchableOpacity
                                                    activeOpacity={0.7}
                                                    onPress={this.removeAllItem}
                                                    style={stylesVnrPickerV3.styBtnClear}
                                                >
                                                    <IconCancel size={Size.iconSize - 2} color={Colors.grey} />
                                                </TouchableOpacity>
                                            ) : isShowErr ? (
                                                <View style={stylesVnrPickerV3.styBtnClear}>
                                                    <IconWarn color={Colors.red} size={Size.iconSize - 2} />
                                                </View>
                                            ) : (
                                                <IconDown
                                                    size={Size.iconSize}
                                                    color={disable ? Colors.gray_7 : Colors.gray_8}
                                                />
                                            )}
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>
                    )}
                </TouchableOpacity>

                <Modal
                    visible={isModalVisible}
                    animationType="none"
                    onShow={this.onShowModal}
                    transparent={false}
                    onRequestClose={this.closeModal}
                >
                    <SafeAreaView style={stylesFigma.modalRoot}>
                        {this.renderHeaderFigma()}
                        {this.renderSearchBarFigma()}
                        <View style={{ flex: 1 }}>{viewListItem}</View>
                        <View style={stylesFigma.footer}>
                            <TouchableOpacity activeOpacity={0.7} onPress={this.closeModal} style={stylesFigma.footerGhost}>
                                <VnrText
                                    style={[styleSheets.lable, stylesFigma.footerGhostText]}
                                    i18nKey={
                                        stateProps.textLeftButton != null
                                            ? stateProps.textLeftButton
                                            : 'HRM_PortalApp_RemoveSelect'
                                    }
                                />
                            </TouchableOpacity>
                            <TouchableOpacity activeOpacity={0.7} onPress={this.onOK} style={stylesFigma.footerPrimary}>
                                <VnrText
                                    style={[styleSheets.lable, stylesFigma.footerPrimaryText]}
                                    i18nKey={
                                        stateProps.textRightButton != null ? stateProps.textRightButton : 'Confirm'
                                    }
                                />
                            </TouchableOpacity>
                        </View>
                    </SafeAreaView>
                </Modal>
            </View>
        );
    }
}

const stylesRoot = StyleSheet.create({
    styContentPicker: {
        height: 50,
        width: '100%',
        flexWrap: 'wrap'
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
    },
    yetValue: { width: '60%', justifyContent: 'flex-end' },
    borderBottom: {
        borderBottomColor: Colors.red,
        borderBottomWidth: 0.8
    }
});

const stylesFigma = StyleSheet.create({
    modalRoot: {
        flex: 1,
        backgroundColor: Colors.white
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingTop: 12,
        paddingBottom: 8
    },
    headerTitle: {
        fontSize: 16,
        fontWeight: '600'
    },
    headerCloseBtn: {
        padding: 6,
        borderRadius: 100,
        backgroundColor: Colors.gray_4
    },
    searchWrap: {
        paddingHorizontal: 16,
        paddingBottom: 12
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        backgroundColor: Colors.white,
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 2
    },
    searchIcon: {
        marginRight: 8
    },
    searchInput: {
        flex: 1,
        height: 40
    },
    chipsRow: {
        paddingTop: 10
    },
    sectionTitle: {
        fontSize: 12,
        color: Colors.gray_7,
        paddingTop: 6,
        paddingBottom: 6
    },
    divider: {
        height: 1,
        backgroundColor: Colors.gray_5,
        marginHorizontal: 16,
        marginVertical: 8
    },
    chip: {
        maxWidth: 260,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: Colors.gray_3,
        borderColor: Colors.gray_4,
        borderWidth: 0.5,
        borderRadius: 18,
        paddingHorizontal: 8,
        paddingVertical: 6,
        marginRight: 8
    },
    chipText: {
        color: Colors.gray_10,
        marginLeft: Size.defineHalfSpace,
        maxWidth: 180
    },
    chipClose: {
        marginLeft: 4
    },
    starRequired: {
        color: Colors.red
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 16,
        borderTopWidth: 0.5,
        borderTopColor: Colors.gray_5
    },
    footerGhost: {
        flex: 1,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: Colors.white,
        borderWidth: 1,
        borderColor: Colors.gray_5,
        marginRight: 12
    },
    footerGhostText: {
        color: Colors.black
    },
    footerPrimary: {
        flex: 1,
        height: 44,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10,
        backgroundColor: Colors.primary
    },
    footerPrimaryText: {
        color: Colors.white
    }
});
