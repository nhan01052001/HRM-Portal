/* eslint-disable no-console */
import React from 'react';
import { View, Text, TouchableOpacity, Modal, StyleSheet, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Icon from 'react-native-vector-icons/Ionicons';
import {
    Colors,
    CustomStyleSheet,
    Size,
    styleSheets,
    stylesVnrFilter,
    stylesVnrPickerV3
} from '../../constants/styleConfig';
import { translate } from '../../i18n/translate';
import VnrText from '../../components/VnrText/VnrText';
import ListItem from './ListItem';
import HttpFactory from '../../factories/HttpFactory';
import VnrLoading from '../../components/VnrLoading/VnrLoading';
import Vnr_Function from '../../utils/Vnr_Function';
import EmptyData from '../../components/EmptyData/EmptyData';
import { IconCloseCircle } from '../../constants/Icons';
import VnrTextInput from '../../components/VnrTextInput/VnrTextInput';
import HttpService from '../../utils/HttpService';
import EmptyDataSearch from '../EmptyDataSearch/EmptyDataSearch';
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

export default class VnrLoadApproval extends React.Component {
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
        if (
            HttpService.checkConnectInternet() == false &&
            !Object.prototype.hasOwnProperty.call(this.props, 'dataLocal')
        ) {
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
        if (autoFilter && autoFilter === true && filterServer && filterServer === false) {
            callBackFilter = this.filterLocal;
        } else if (autoFilter && autoFilter === true && filterServer && filterServer === true) {
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
        if (nextProps.refresh !== this.props.refresh) {
            this.onRefreshControl(nextProps);
        }
    }

    renderApproverIsSelected = item => {
        const { stateProps } = this.state,
            fullName = item && item[stateProps.textField] ? item[stateProps.textField] : 'A';

        return (
            <View style={styles.wrapIn4ApproverItem}>
                <View style={styles.styViewAvatar}>
                    {Vnr_Function.renderAvatarCricleByName(item.AvatarURI, fullName, 40)}
                </View>
                <View>
                    <Text style={[styleSheets.text, styles.styFs16Color262626]} numberOfLines={1}>
                        {item !== null && item !== undefined && item[`${stateProps.textField}`]
                            ? item[`${stateProps.textField}`].slice(0, item[`${stateProps.textField}`].indexOf('-'))
                            : null}
                    </Text>
                    <View style={styles.styNameInfo}>
                        <Text style={[styleSheets.text, styles.styFsNoName]} numberOfLines={1}>
                            {item !== null && item !== undefined && item[`${stateProps.textField}`]
                                ? item[`${stateProps.textField}`].slice(
                                    item[`${stateProps.textField}`].indexOf('-') + 1
                                )
                                : null}{' '}
                            -
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    render() {
        const { headerSearch, topModal, ScroollviewModal, bottomModal } = stylesVnrPickerV3;

        const { searchText, isModalVisible, isVisibleLoading, dataPicker, itemSelected, stateProps } = this.state;

        let textValue = null;
        let disable = false;
        let viewListItem = <View />;
        // let viewTitlePicker = <View />;
        let itemValue = null;
        let dataSearch = [];
        if (dataPicker.length > 0) {
            dataPicker.map(value => {
                if (value.isSelect === false) {
                    dataSearch.push(value);
                }
            });
        }

        if (
            !Vnr_Function.CheckIsNullOrEmpty(this.props.value) &&
            !Vnr_Function.CheckIsNullOrEmpty(this.props.value[stateProps.textField])
        ) {
            textValue = this.props.value[stateProps.textField];
            itemValue = this.props.value;
        } else if (
            stateProps.autoBind &&
            itemSelected.length > 0 &&
            itemSelected[0] &&
            itemSelected[0][stateProps.textField]
        ) {
            textValue = itemSelected[0][stateProps.textField];
            itemValue = itemSelected[0];
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
            viewListItem = <VnrLoading size="small" isVisible={isVisibleLoading} />;
        } else if (dataPicker.length > 0 && dataSearch.length > 0) {
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
            if (searchText !== '') {
                viewListItem = (
                    <EmptyDataSearch
                        messageEmptyData={translate('HRM_PortalApp_NoResultsFound')}
                        valueSearch={searchText}
                    />
                );
            } else {
                viewListItem = <EmptyData messageEmptyData={'EmptyData'} />;
            }
        }
        return (
            <View style={stylesVnrPickerV3.styContentPicker}>
                <View style={styles.styPdV4}>
                    {/* title status approver */}
                    <View style={styles.wrapTitleStatusApproval}>
                        <View style={styles.styMh6}>
                            <View
                                style={[
                                    // eslint-disable-next-line react-native/no-inline-styles
                                    {
                                        backgroundColor:
                                            stateProps.status && stateProps.status === 'E_APPROVE'
                                                ? Colors.green
                                                : stateProps.status && stateProps.status === 'E_REJECT'
                                                    ? Colors.red
                                                    : Colors.grayOpacity24
                                    },
                                    styles.statusApproval
                                ]}
                            >
                                {!stateProps.status ||
                                stateProps.status === '' ||
                                stateProps.status === 'E_NORMAL' ||
                                stateProps.status === 'E_APPROVE' ? (
                                        <Text style={[styleSheets.text, styles.styTextLevel]}>
                                            {stateProps.levelApproval}
                                        </Text>
                                    ) : stateProps.status === 'E_APPROVED' ? (
                                        <Image source={require('../../assets/images/approval/Vector.png')} />
                                    ) : (
                                        <Image source={require('../../assets/images/approval/close.png')} />
                                    )}
                            </View>
                        </View>
                        <VnrText
                            style={[styleSheets.text, styles.styRegister, styles.styApprover]}
                            i18nKey={stateProps.nameApprovalLevel ? stateProps.nameApprovalLevel : 'Unknown'}
                        />
                        <View style={styles.dashLine} />
                    </View>
                    {/* information approver */}
                    <TouchableOpacity
                        disabled={disable}
                        style={[
                            styles.styInfoApprove,
                            // eslint-disable-next-line react-native/no-inline-styles
                            (stateProps.status === 'E_APPROVE' || stateProps.status === 'E_REJECT') && {
                                padding: 4,
                                borderColor: stateProps.status === 'E_REJECT' ? Colors.red : Colors.green
                            }
                        ]}
                        onPress={() => (!disable ? this.opentModal() : null)}
                    >
                        <View style={styles.wrapIn4MationApprover}>
                            <View style={[styles.wrapImgAndNameApprover, !stateProps.position && CustomStyleSheet.maxWidth('100%')]}>
                                <View style={styles.wrapImgApprover}>
                                    {itemValue &&
                                        Vnr_Function.renderAvatarCricleByName(
                                            itemValue.AvatarURI,
                                            itemValue[stateProps.textField],
                                            26
                                        )}
                                </View>
                                <View>
                                    {textValue != null ? (
                                        <Text
                                            style={[
                                                styleSheets.text,
                                                styles.styRegister,
                                                styles.styApprover,
                                                styles.styFs14ClWhite
                                            ]}
                                            numberOfLines={1}
                                        >
                                            {textValue}
                                        </Text>
                                    ) : (
                                        <VnrText
                                            style={[
                                                styleSheets.text,
                                                styles.styRegister,
                                                styles.styApprover,
                                                styles.styFs14ClWhite
                                            ]}
                                            i18nKey={
                                                !Vnr_Function.CheckIsNullOrEmpty(stateProps.placeholder)
                                                    ? stateProps.placeholder
                                                    : 'SELECT_ITEM'
                                            }
                                        />
                                    )}
                                </View>
                            </View>
                            {stateProps.position && (
                                <View style={CustomStyleSheet.maxWidth('50%')}>
                                    <VnrText
                                        numberOfLines={1}
                                        style={[styleSheets.text, styles.styRegister, styles.styApprover]}
                                        i18nKey={stateProps.position}
                                    />
                                </View>
                            )}
                        </View>
                    </TouchableOpacity>
                </View>
                <Modal
                    visible={isModalVisible} //isModalVisible
                    animationType="none"
                    //presentationStyle="pageSheet"
                    onShow={this.onShowModal}
                    transparent={false}
                    onRequestClose={this.closeModal}
                >
                    <SafeAreaView
                        style={[ScroollviewModal, Colors.white]}
                        forceInset={{ top: 'always', bottom: 'always' }}
                    >
                        <View style={styles.flRowSpaceBetween}>
                            <VnrText style={[styleSheets.text]} i18nKey={'HRM_ProtalApp_ChangeApprover'} />
                            <TouchableOpacity onPress={() => this.closeModal()}>
                                <IconCloseCircle size={Size.iconSize} color={Colors.gray_8} />
                            </TouchableOpacity>
                        </View>
                        {/* {viewTitlePicker} */}
                        {stateProps.filter === true && (
                            <View style={topModal}>
                                <View style={[headerSearch, styles.hideBorderHeaderSearch]}>
                                    <VnrTextInput
                                        onClearText={() =>
                                            this.setState({ searchText: '' }, () =>
                                                stateProps.filterServer ? this.filterServer() : this.filterLocal()
                                            )
                                        }
                                        placeholder={translate('HRM_ProtalApp_SearchReplacer')}
                                        onChangeText={text => this.changeSearchBar(text)}
                                        value={searchText}
                                        style={[stylesVnrPickerV3.textInput]}
                                        returnKeyType="search"
                                        onSubmitEditing={stateProps.filterServer ? this.filterServer : this.filterLocal}
                                    />
                                    {searchText === '' ? (
                                        <Icon name={iconNameSearch} size={Size.iconSize} color={Colors.grey} />
                                    ) : null}
                                </View>
                            </View>
                        )}
                        <View style={styles.styFl9FlDirCol}>
                            <View style={styles.styFl9FlDirCol}>
                                {/* Người duyệt */}
                                {itemSelected[0] !== null && itemSelected[0] !== undefined ? (
                                    <View>
                                        <View style={[styles.titleApproverInModal]}>
                                            <View style={[styles.statusApproval, Colors.green]}>
                                                <Image source={require('../../assets/images/approval/Vector.png')} />
                                            </View>
                                            <VnrText
                                                style={[styleSheets.text]}
                                                i18nKey={`${
                                                    stateProps.nameApprovalLevel
                                                        ? stateProps.nameApprovalLevel
                                                        : 'Unknown'
                                                }`}
                                            />
                                        </View>
                                        {this.renderApproverIsSelected(itemSelected[0])}
                                    </View>
                                ) : null}

                                {/* Người thay thế */}
                                <View style={CustomStyleSheet.flex(1)}>
                                    <View style={[styles.titleApproverInModal]}>
                                        <View
                                            style={[
                                                styles.statusApproval,
                                                CustomStyleSheet.backgroundColor(Colors.gray_6)
                                            ]}
                                        >
                                            <Image source={require('../../assets/images/approval/swap.png')} />
                                        </View>
                                        <VnrText
                                            style={[styleSheets.text]}
                                            i18nKey={'HRM_Attendance_Leaveday_AlternativeEmployeeID'}
                                        />
                                    </View>

                                    {viewListItem}
                                </View>
                            </View>
                            <View style={bottomModal}>
                                <TouchableOpacity
                                    onPress={this.onOK}
                                    style={[stylesVnrFilter.bnt_Ok, { backgroundColor: Colors.primary }]}
                                >
                                    <Image source={require('../../assets/images/approval/outline.png')} />
                                    <VnrText
                                        style={[styleSheets.lable, { color: Colors.white }]}
                                        i18nKey={
                                            stateProps.textRightButton != null
                                                ? stateProps.textRightButton
                                                : 'HRM_ProtalApp_ChangeApprover'
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
    styNameInfo: { flexDirection: 'row', alignItems: 'center' },
    styTextLevel: { color: Colors.white, fontSize: Size.text },
    styInfoApprove: { borderRadius: 100, borderWidth: 1 },
    // khu vực modal cấp duyệt

    wrapTitleStatusApproval: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 6,
        paddingBottom: 10
    },

    statusApproval: {
        width: 18,
        height: 18,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 6
    },

    styApprover: {
        fontSize: 12,
        fontWeight: '500',
        color: Colors.gray_7,
        marginRight: 8
    },

    dashLine: {
        flex: 1,
        height: 1,
        backgroundColor: Colors.grayOpacity15
    },

    wrapIn4MationApprover: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: 6,
        borderRadius: 100,
        backgroundColor: Colors.grayOpacity15
    },

    wrapImgAndNameApprover: {
        maxWidth: '50%',
        flexDirection: 'row',
        alignItems: 'center'
    },

    wrapImgApprover: {
        marginRight: 4
    },

    flRowSpaceBetween: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: Size.defineSpace,
        backgroundColor: Colors.white
    },

    titleApproverInModal: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 6,
        backgroundColor: Colors.white,
        paddingHorizontal: 18
    },
    wrapIn4ApproverItem: {
        padding: 10,
        backgroundColor: Colors.white,
        paddingHorizontal: 28,
        flexDirection: 'row',
        alignItems: 'center'
    },
    styViewAvatar: {
        marginRight: Size.defineHalfSpace
    },
    hideBorderHeaderSearch: {
        backgroundColor: Colors.white,
        borderRadius: 0,
        borderWidth: 0
    },
    styPdV4: { paddingVertical: 4 },
    styMh6: { marginHorizontal: 6 },
    styFs14ClWhite: {
        fontSize: 14,
        color: Colors.white
    },
    styFl9FlDirCol: { flex: 9, flexDirection: 'column' },
    styFsNoName: { fontSize: 14, color: Colors.gray_7 },
    styFs16Color262626: { fontSize: 16, color: Colors.gray_10 }
});
