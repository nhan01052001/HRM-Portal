/* eslint-disable react-native/no-inline-styles */
/* eslint-disable no-console */
import React from 'react';
import { ScrollView, View, TouchableOpacity, Image, Modal, StyleSheet, Text } from 'react-native';
import {
    Colors,
    Size,
    stylesVnrFilter,
    styleSheets,
    stylesVnrPickerV3,
    CustomStyleSheet,
    styleValid
} from '../../constants/styleConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import VnrLoading from '../../components/VnrLoading/VnrLoading';
import RenderNode from './RenderNode';
import RenderNodeOrg from './RenderNodeOrg';
import Icon from 'react-native-vector-icons/Ionicons';
import HttpFactory from '../../factories/HttpFactory';
import VnrText from '../../components/VnrText/VnrText';
import VnrTextInput from '../../components/VnrTextInput/VnrTextInput';
import { translate } from '../../i18n/translate';
import { IconCancel, IconDown, IconPlus, IconWarn } from '../../constants/Icons';
import Vnr_Function from '../../utils/Vnr_Function';
import { Platform } from 'react-native';
import { EnumName } from '../../assets/constant';
import ListMultiItem from './MultiItem';

const iconNameSearch = `${Platform.OS === 'ios' ? 'ios-' : 'md-'}search`;
const defaultState = {
    data: [],
    nodesChecked: [],
    idChecked: {},
    modalVisible: false,
    selectedValue: null,
    toggle: false,
    key: '',
    isVisibleLoading: true,
    hasLoaded: false,
    hasPick: false
};

export default class VnrTreeView extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            ...defaultState
        };
        this.itemSelected = [];
        this.itemSelectedOnly = [{}];
        this.IsCheckChildren = props.isCheckChildren;
        this.isModalOpened = false;

        const { value } = props;
        if (value && props.isCheckChildren) {
            this.setItemSelected(value);
        } else if (value && !props.isCheckChildren) {
            this.setItemSelected(value);
        }
    }

    setItemSelected = data => {
        this.itemSelected = data;
    };

    getItemSelected = () => {
        return this.itemSelected;
    };

    setItemSelectedOnly = data => {
        this.itemSelectedOnly = data;
    };

    getItemSelectedOnly = () => {
        return this.itemSelectedOnly;
    };

    componentDidMount() {
        this.setOrgName(this.getItemSelected());
        // if (this.state.isVisible) {
        //     this.handleGetData(false);
        // }
    }

    handleGetData = (inactive, isRefesh = false) => {
        const { api } = this.props;
        api.urlApi = api.urlApi + '?ShowInactive=' + inactive;
        this.setState({ isVisibleLoading: true });
        HttpFactory.getDataPicker(api)
            .then(res => {
                let responseJson = [];
                if (res && res.Status == EnumName.E_SUCCESS && Array.isArray(res.Data)) {
                    responseJson = res.Data;
                } else responseJson = res;

                responseJson.forEach(item => (item.hasExpand = true));
                // set value
                let valueId = {};
                if (!isRefesh) {
                    const _value = this.getItemSelected();
                    if (_value) valueId = this.getNodeCheckedToId(_value);
                }

                const _data = [...responseJson];
                this.setState({ data: _data, isVisibleLoading: false, idChecked: { ...valueId } });
            })
            .catch(error => {
                console.error(error);
            });
    };

    getNodeCheckedToId = (data, objResult) => {
        if (!objResult) objResult = {};
        if (data) {
            data.forEach((node) => {
                if (node.id) {
                    objResult[node.id] = true;
                }

                if (node.hasChildren) {
                    this.getNodeCheckedToId(node.ListChild, objResult);
                }
            });
        }
        return objResult;
    };

    expandChild = node => {
        const { data } = this.state;
        const { path } = node;
        const lenPath = path.length;
        let item = data[path[0]];
        for (let index = 1; index < lenPath; index++) {
            item = item.ListChild[path[index]];
        }

        item.isExpanded = !item.isExpanded;

        if (item.hasChildren) {
            let { ListChild } = item;
            ListChild.forEach(itemChild => {
                itemChild.hasExpand = !itemChild.hasExpand;
            });
        }

        this.setState({ data: data });
    };

    setIsCheckedChild = (node, _isChecked, path, pressNode, idChecked) => {
        node.forEach((item, i) => {
            let _path = [...path, i];
            item.Path = _path;

            if (item.isChecked !== _isChecked) {
                pressNode.push({ ...item, isChecked: _isChecked });
            }

            item.isChecked = _isChecked;
            if (idChecked) {
                idChecked[item.id] = item.isChecked;
            }

            if (item.hasChildren) {
                this.setIsCheckedChild(item.ListChild, _isChecked, _path, pressNode);
            }
        });

        return pressNode;
    };

    unCheckNode(node) {
        const { data } = this.state;
        const { Path } = node;
        const lenPath = Path.length;
        let item = data[Path[0]];
        for (let index = 1; index < lenPath; index++) {
            item = item.ListChild[Path[index]];
        }

        item.isChecked = false;
    }

    checkedNode = node => {
        const { data } = this.state;
        const { path } = node;
        const lenPath = path.length;
        let item = data[path[0]];
        let { idChecked } = this.state;

        for (let index = 1; index < lenPath; index++) {
            item = item.ListChild[path[index]];
        }

        item.isChecked = !item.isChecked;
        item.Path = path;
        let pressNodes = [{ ...item }];

        //check child
        if (this.IsCheckChildren) {
            idChecked[item.id] = item.isChecked;
            if (item.hasChildren) {
                pressNodes = this.setIsCheckedChild(item.ListChild, item.isChecked, path, pressNodes, idChecked);
            }

            let _nodesChecked = this.getItemSelected();

            if (!_nodesChecked || (_nodesChecked && _nodesChecked.length === 0)) {
                this.setItemSelected([...pressNodes]);
            } else {
                pressNodes.forEach(pressNode => {
                    let findItem = _nodesChecked.find(item => {
                        return item.id === pressNode.id;
                    });
                    if (!findItem) {
                        _nodesChecked.unshift({ ...pressNode });
                    }
                });
                this.setItemSelected([..._nodesChecked]);
            }
        } else {
            idChecked = {
                [item.id]: item.isChecked
            };

            const itemSelectedOnly = this.getItemSelectedOnly();
            // this.setItemSelectedOnly([{ ...item }]);
            if (!itemSelectedOnly || itemSelectedOnly.length === 1) {
                if (itemSelectedOnly[0].Path) {
                    let _itemFirst = { ...itemSelectedOnly[0] };
                    this.unCheckNode(_itemFirst);
                    this.setItemSelectedOnly([{ ..._itemFirst }, { ...item }]);
                } else {
                    this.setItemSelectedOnly([{}, { ...item }]);
                }
            } else if (Array.isArray(itemSelectedOnly) && itemSelectedOnly[1].id !== item.id) {
                let _itemLast = { ...itemSelectedOnly[1] };
                this.unCheckNode(_itemLast);

                if (itemSelectedOnly[0].Path) {
                    this.setItemSelectedOnly([{ ...itemSelectedOnly[0] }, { ...item }]);
                } else {
                    this.setItemSelectedOnly([{}, { ...item }]);
                }
            }
        }

        this.setState({ data: data, idChecked }, () => {
            if (!this.IsCheckChildren) {
                this.onConfirm(this.props.onSelect);
            }
        });
    };

    filterNode = (data, key, nodeParents, level) => {
        if (!nodeParents) {
            nodeParents = [];
        }
        if (!level) {
            level = 0;
        }

        data.forEach((item) => {
            item.Level = level;

            if (item.ParentID == null) {
                nodeParents = [];
            } else {
                let _nodeParents = nodeParents.filter((nodeParent) => {
                    return nodeParent.Level < level;
                });

                nodeParents = [..._nodeParents];
            }

            let _indexOf = item.Name.toLowerCase().indexOf(key);

            if (_indexOf >= 0) {
                item.IsShow = true;
                item.hasExpand = true;
                item.isExpanded = true;
                item.NameFilter = item.Name.substr(_indexOf, key.length);
                if (nodeParents.length > 0) {
                    nodeParents.forEach((nodeParent) => {
                        nodeParent.IsShow = true;
                        nodeParent.hasExpand = true;
                        nodeParent.isExpanded = true;
                    });
                }
            } else {
                item.IsShow = false;
                item.hasExpand = false;
                item.isExpanded = false;
                item.NameFilter = '';
                nodeParents.push(item);
            }

            if (item.hasChildren) {
                let levelTmp = level + 1;
                this.filterNode(item.ListChild, key, nodeParents, levelTmp);
            }
        });

        return data;
    };

    changeText = text => {
        this.setState({ key: text }, () => {
            const { key } = this.state;
            if (!key || key == '') this.handleGetData(this.state.toggle);
            else
                Vnr_Function.delay(() => {
                    this.onSubmitEditing();
                }, 500);
        });
    };

    initTreeView = (data, level, path) => {
        if (!path) {
            path = [0];
        }
        const { newStyle } = this.props;
        return data.map((node, index) => {
            if (level === 0) {
                path = [index];
            } else if (level <= path.length) {
                let _path = path.slice(0, level);
                path = [..._path];
                path.push(index);
            }

            let cloneNode = { ...node, path: path };
            const { hasChildren } = cloneNode;
            const levelTmp = level + 1;
            const { idChecked } = this.state;
            cloneNode.isChecked = idChecked[cloneNode.id] !== undefined ? idChecked[cloneNode.id] : cloneNode.isChecked;
            return (
                cloneNode.hasExpand &&
                cloneNode.IsShow &&
                (hasChildren ? (
                    <View
                        style={{
                            paddingHorizontal: Size.defineSpace
                        }}
                    >
                        {newStyle == true ? (
                            <RenderNodeOrg
                                level={level}
                                cloneNode={cloneNode}
                                expandChild={this.expandChild}
                                checkedNode={this.checkedNode}
                                isDisable={cloneNode.IsDisable}
                            />
                        ) : (
                            <RenderNode
                                level={level}
                                cloneNode={cloneNode}
                                expandChild={this.expandChild}
                                checkedNode={this.checkedNode}
                                isDisable={cloneNode.IsDisable}
                            />
                        )}

                        {hasChildren && this.initTreeView(cloneNode.ListChild, levelTmp, path)}
                    </View>
                ) : newStyle == true ? (
                    <RenderNodeOrg level={level} cloneNode={cloneNode} checkedNode={this.checkedNode} />
                ) : (
                    <RenderNode level={level} cloneNode={cloneNode} checkedNode={this.checkedNode} />
                ))
            );
        });
    };

    setModalVisible(visible, isPressClose) {
        const { disable } = this.props;
        let { idChecked } = this.state;

        if (disable) {
            return;
        }
        if (isPressClose) {
            if (this.IsCheckChildren) {
                let _itemsSelected = this.getItemSelected();
                // let { data } = this.state;
                if (_itemsSelected && _itemsSelected.length) {
                    _itemsSelected.forEach(item => {
                        idChecked[item.id] = true;
                    });
                }
            } else {
                const _itemSelectedOnly = this.itemSelectedOnly;
                let { data } = this.state;

                _itemSelectedOnly.forEach((item, i) => {
                    const { Path } = item;
                    if (Path) {
                        const lenPath = Path.length;
                        let node = data[Path[0]];
                        for (let index = 1; index < lenPath; index++) {
                            node = node.ListChild[Path[index]];
                        }

                        if (i === 0) {
                            node.isChecked = item.isChecked;
                            idChecked[item.id] = node.isChecked;
                            this.setItemSelectedOnly([{ ...node }]);
                        } else {
                            node.isChecked = !item.isChecked;
                            idChecked[item.id] = node.isChecked;
                        }
                    }
                });
            }
        }

        this.setState({ modalVisible: visible, idChecked });

        if (!isPressClose && visible && !this.state.hasLoaded && !this.isModalOpened) {
            this.isModalOpened = true;
            this.handleGetData(false);
        }
    }

    getNodeChecked = (data, result) => {
        const { idChecked } = this.state;
        if (!result) result = [];
        if (data) {
            data.forEach((node) => {
                if (node.isChecked || idChecked[node.id]) {
                    result.push(node);
                }

                if (node.hasChildren) {
                    this.getNodeChecked(node.ListChild, result);
                }
            });
        }
        return result;
    };

    setOrgName = nodesChecked => {
        let arrName = nodesChecked.map((node) => {
            return node.Name;
        });

        if (arrName.length) {
            this.setState({ selectedValue: arrName.join(', '), nodesChecked, hasPick: true });
        } else {
            this.setState({ selectedValue: null, nodesChecked, hasPick: false });
        }
    };

    onConfirm = callback => {
        let { data } = this.state;
        let nodesChecked = this.getNodeChecked(data);

        if (!this.IsCheckChildren && nodesChecked && nodesChecked[0]) {
            this.setItemSelectedOnly([...nodesChecked]);
        }

        callback(nodesChecked);
        this.setOrgName(nodesChecked);
        this.setModalVisible(false);
    };

    onValueChange = value => {
        this.setState({
            toggle: value,
            key: '',
            selectedValue: null,
            nodesChecked: [],
            isVisibleLoading: true,
            idChecked: {},
            hasPick: false
        });
        this.handleGetData(value);
    };

    refreshData = () => {
        this.setState({
            key: '',
            selectedValue: null,
            nodesChecked: [],
            isVisibleLoading: true,
            hasPick: false,
            idChecked: {}
        });
        this.handleGetData(this.state.toggle, true);
    };

    onSubmitEditing = () => {
        let { key } = this.state;
        if (key && key !== '' && key.length > 1) {
            const { data } = this.state;
            const result = this.filterNode([...data], key.toLowerCase());
            this.setState({ data: result });
        }
    };

    onRefreshControl = nextProps => {
        let _state = this.state;
        _state = defaultState;
        _state.stateProps = nextProps; //this.props;
        this.setState(_state, () => {
            // nhan.nguyen: task: 0164710
            if (_state && _state.stateProps && _state.stateProps.value) {
                this.setOrgName(_state.stateProps.value);
            }
        });
        this.isModalOpened = false;
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.refresh !== this.props.refresh) {
            this.onRefreshControl(nextProps);
        }
    }
    opentModal = () => {
        this.setModalVisible(true);
    };

    renderLableLayout = value => {
        const { lable } = this.props;
        let countSelect = value !== undefined ? value.length : null;

        return (
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

                <View style={[stylesVnrPickerV3.styIconLayoutFilter]}>
                    <IconPlus color={Colors.black} size={Size.iconSize} />
                </View>
                {/* <View
                    style={[
                        stylesVnrPickerV3.styVlPicker,
                        { width: '50%', justifyContent: 'flex-end', alignItems: 'center' }
                    ]}
                >
                    <VnrText
                        style={[styleSheets.text, stylesVnrPickerV3.stylePlaceholder, this.props.stylePlaceholder]}
                        i18nKey={
                            !Vnr_Function.CheckIsNullOrEmpty(this.props.placeholder)
                                ? this.props.placeholder
                                : 'SELECT_ITEM'
                        }
                    />
                </View> */}
            </TouchableOpacity>
        );
    };

    renderLableForCreate = (value) => {
        if (!Array.isArray(value))
            return <View />;
        const { lable, disable, fieldValid, isCheckEmpty, stylePlaceholder, placeholder, clearText, textField } = this.props;

        let isShowErr = false,
            textValue = null;
        if (
            fieldValid &&
            isCheckEmpty &&
            (!value || (Array.isArray((value)) && value.length === 0))
        ) {
            isShowErr = true;
        }

        if (value.length === 1) {
            textValue = value[0][`${textField}`];
        }

        return (
            <TouchableOpacity
                onPress={() => (!disable ? this.opentModal() : null)}
                style={[
                    stylesVnrPickerV3.styBntPicker,
                    isShowErr && stylesVnrPickerV3.styBntPickerError,
                    disable && stylesVnrPickerV3.bntPickerDisable,
                    value.length > 1 && CustomStyleSheet.borderBottomWidth(0)
                ]}
                activeOpacity={!disable ? 0.2 : 1}
            >
                <View
                    style={[
                        stylesVnrPickerV3.styLeftPicker,
                        lable && stylesVnrPickerV3.onlyFlRowSpaceBetween
                    ]}
                >
                    {lable && (
                        <View style={[stylesVnrPickerV3.styLbPicker, { width: '50%', maxHeight: '100%' }]}>
                            <VnrText
                                numberOfLines={2}
                                style={[
                                    styleSheets.text,
                                    stylesVnrPickerV3.styLbNoValuePicker
                                ]}
                                i18nKey={lable}
                            />
                            {fieldValid && (
                                <VnrText style={[styleSheets.text, styleValid]} i18nKey={'*'} />
                            )}
                        </View>
                    )}

                    <View
                        style={[
                            stylesVnrPickerV3.styVlPicker,
                            styles.width50Right
                        ]}
                    >
                        {textValue ? (
                            <Text style={[styleSheets.text, stylesVnrPickerV3.styLableValue]} numberOfLines={1}>
                                {textValue}
                            </Text>
                        ) : (
                            (value.length === 0 && (
                                <VnrText
                                    style={[styleSheets.text, stylesVnrPickerV3.stylePlaceholder, stylePlaceholder && stylePlaceholder]}
                                    i18nKey={
                                        placeholder
                                            ? placeholder
                                            : 'SELECT_ITEM'
                                    }
                                />
                            ))
                        )}
                    </View>
                </View>

                <View style={stylesVnrPickerV3.styRightPicker}>
                    {/* nút clear */}
                    {isShowErr ? (
                        <View style={stylesVnrPickerV3.styBtnClear}>
                            <IconWarn color={Colors.red} size={Size.iconSize - 2} />
                        </View>
                    ) : ((clearText && textValue) || value.length > 0) ? (
                        <TouchableOpacity onPress={this.removeAllItem} style={stylesVnrPickerV3.styBtnClear}>
                            <IconCancel size={Size.iconSize - 2} color={Colors.grey} />
                        </TouchableOpacity>
                    ) : (
                        <IconDown size={Size.iconSize} color={disable ? Colors.gray_7 : Colors.gray_8} />
                    )}
                </View>
            </TouchableOpacity>
        )
    }

    eventExceedSizeWith = () => {
        // const { isExceedSize } = this.state;
        // if (value >= ((value2 / 2) - 5)) {
        //     if (isExceedSize !== true) {
        //         this.setState({
        //             isExceedSize: true
        //         })
        //     }
        // }
    };

    removeAllItem = () => {
        let { idChecked } = this.state;
        const { onSelect } = this.props;
        Object.keys(idChecked).forEach(key => {
            idChecked[key] = false;
        });

        this.setItemSelected([]);
        onSelect && onSelect([]);
        this.isModalOpened = false;
        this.setState({
            idChecked,
            nodesChecked: []
        });
    };

    revomeItemSelected = objectItem => {
        let { idChecked, nodesChecked } = this.state;
        const { onSelect } = this.props;

        Object.keys(idChecked).forEach(key => {
            if (key === objectItem.id) {
                idChecked[key] = false;
            }
        });

        const List = Vnr_Function.removeObjectInArray(nodesChecked, objectItem, 'id');

        this.setItemSelected(List);
        onSelect && onSelect(List);
        this.isModalOpened = false;
        this.setState({
            idChecked: idChecked,
            nodesChecked: List
        });
    };

    render() {
        const { data, isVisibleLoading, nodesChecked } = this.state;
        const { onSelect, disable, lable, stylePicker, layoutFilter, isControlCreate } = this.props;
        const { bntPickerDisable } = stylesVnrPickerV3;

        let isHaveValue = false;
        if (nodesChecked && nodesChecked.length > 0) isHaveValue = true;

        return (
            <View
                style={[
                    styles.styContentPicker,
                    layoutFilter && { height: 50 },
                    (isHaveValue && !isControlCreate) && { height: 'auto', backgroundColor: Colors.red }
                ]}
            >
                <View
                    onPress={() => (!disable ? this.setModalVisible(true) : null)}
                    style={[
                        stylePicker,
                        styles.styBntPicker,
                        disable && bntPickerDisable,
                        layoutFilter && CustomStyleSheet.borderBottomWidth(0)
                    ]}
                    activeOpacity={!disable ? 0.2 : 1}
                >
                    {(layoutFilter && !isControlCreate) && this.renderLableLayout(nodesChecked)}
                    {isControlCreate && this.renderLableForCreate(nodesChecked)}
                    {layoutFilter ? (
                        ((isControlCreate && Array.isArray(nodesChecked) && nodesChecked.length > 1) || (!isControlCreate)) && (
                            <View
                                style={[
                                    stylesVnrPickerV3.styLeftPicker,
                                    lable && isHaveValue ? {} : stylesVnrPickerV3.onlyFlRowSpaceBetween
                                ]}
                            >
                                <View
                                    style={[
                                        stylesVnrPickerV3.styVlPicker,
                                        isHaveValue ? styles.haveValue : styles.yetValue,
                                        CustomStyleSheet.flex(1)
                                    ]}
                                >
                                    {isHaveValue && (
                                        <ListMultiItem
                                            disable={disable}
                                            textField={'Name'}
                                            valueField={'id'}
                                            dataSource={nodesChecked}
                                            onOpentModal={this.opentModal}
                                            revomeItemSelect={this.revomeItemSelected}
                                            onExceedSizeWith={this.eventExceedSizeWith}
                                        />
                                    )}
                                </View>
                            </View>
                        )
                    ) : (
                        <TouchableOpacity
                            onPress={this.opentModal}
                            style={[
                                stylesVnrPickerV3.styLeftPicker,
                                this.props.lable && stylesVnrPickerV3.onlyFlRowSpaceBetween
                            ]}
                        />
                    )}
                </View>
                <Modal
                    //animationType="slide"
                    animationType="none"
                    transparent={false}
                    visible={this.state.modalVisible}
                >
                    <SafeAreaView
                        style={{ flex: 1, flexDirection: 'column' }}
                        forceInset={{ top: 'always', bottom: 'always' }}
                    >
                        <View style={[stylesVnrPickerV3.wrapHeaderTitle, CustomStyleSheet.paddingBottom(0)]}>
                            <View style={stylesVnrPickerV3.styViewTitle}>
                                <VnrText style={styleSheets.lable} i18nKey={lable} />
                            </View>
                            <View style={stylesVnrPickerV3.styDefTitle}>
                                <TouchableOpacity
                                    style={stylesVnrPickerV3.styDefTitleBtn}
                                    onPress={() => this.setModalVisible(false, true)}
                                >
                                    <Image source={require('../../assets/images/filterV3/fi_x.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styles.headerTop}>
                            {/* <View style={styles.headerTopUpon}>
                                <VnrText
                                    i18nKey={'HRM_ORG_Button_Show_Hidden'}
                                />
                                <Switch
                                    value={this.state.toggle}
                                    onValueChange={this.onValueChange}
                                    trackColor={{ false: Colors.gray_5, true: Colors.primary }}
                                    thumbColor={Colors.white}
                                    ios_backgroundColor={Colors.gray_5}
                                    style={[{ marginLeft: Size.defineHalfSpace }, Platform.OS == 'android' ? { transform: [{ scaleX: 1.3 }, { scaleY: 1.2 }] } : {}]}
                                />
                                <TouchableOpacity
                                    style={{
                                        backgroundColor: Colors.gray_3,
                                        borderRadius: 5,
                                        paddingVertical: 5,
                                        paddingHorizontal: 10,
                                        marginLeft: 10,
                                        justifyContent: 'center'
                                    }}
                                    onPress={this.refreshData}
                                >
                                    <IconRefresh size={Size.iconSize} color={Colors.black} />
                                </TouchableOpacity>
                            </View> */}

                            <View style={styles.headerSearch}>
                                <Icon name={iconNameSearch} size={Size.iconSize} color={Colors.grey} />
                                <VnrTextInput
                                    onClearText={() => this.changeText('')}
                                    placeholder={translate('HRM_Common_Search')}
                                    onChangeText={this.changeText}
                                    onSubmitEditing={this.onSubmitEditing}
                                    returnKeyType="search"
                                    value={this.state.key}
                                    style={styles.textInput}
                                />
                            </View>
                        </View>

                        <View style={{ flex: 8 }}>
                            <VnrLoading size="small" isVisible={isVisibleLoading} />
                            {!isVisibleLoading && (
                                <ScrollView horizontal={true}>
                                    <ScrollView>{this.initTreeView([...data], 0)}</ScrollView>
                                </ScrollView>
                            )}
                        </View>

                        {this.props.isCheckChildren && (
                            <View style={styles.bottomModal}>
                                <TouchableOpacity
                                    onPress={() => this.setModalVisible(false, true)}
                                    style={[stylesVnrFilter.btn_ClearFilter]}
                                >
                                    <VnrText
                                        style={[
                                            styleSheets.lable,
                                            {
                                                color: Colors.gray_8
                                            }
                                        ]}
                                        i18nKey={'HRM_Common_Close'}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity
                                    onPress={() => this.onConfirm(onSelect)}
                                    style={[stylesVnrFilter.bnt_Ok, { backgroundColor: Colors.primary }]}
                                >
                                    <VnrText style={[styleSheets.lable, { color: Colors.white }]} i18nKey={'Confirm'} />
                                </TouchableOpacity>
                            </View>
                        )}
                    </SafeAreaView>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    styContentPicker: {
        // height: 50,
        width: '100%',
        flex: 1
    },
    styBntPicker: {
        flex: 1,
        //flexDirection: 'row',
        borderColor: Colors.gray_5,
        borderBottomWidth: 1,
        borderRadius: Size.borderPicker,
        backgroundColor: Colors.white,
        alignItems: 'center'
    },
    haveValue: {
        width: '100%',
        marginTop: Size.defineHalfSpace,
        //minHeight: 80,
        backgroundColor: Colors.white,
        paddingHorizontal: Size.defineSpace
    },
    yetValue: { width: '60%', justifyContent: 'flex-end' },
    headerSearch: {
        flex: 9,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderColor: Colors.gray_5,
        borderWidth: 0.5,
        borderRadius: 5,
        paddingHorizontal: styleSheets.p_10,
        maxHeight: Size.heightInput,
        marginTop: Size.defineSpace,
        backgroundColor: Colors.gray_3
    },
    textInput: {
        height: Size.heightInput,
        paddingLeft: 5
    },
    headerTop: {
        // flex: 1,
        // paddingHorizontal: Size.defineSpace
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: styleSheets.p_10,
        maxHeight: 70,
        minHeight: 40
    },
    bottomModal: {
        flex: 1,
        flexDirection: 'row',
        // borderTopWidth: 0.5,
        // borderTopColor: Colors.grey,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: styleSheets.p_10
    },
    width50Right: {
        width: '50%',
        justifyContent: 'flex-end',
        alignItems: 'center'
    }
});
