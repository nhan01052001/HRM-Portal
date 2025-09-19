import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Modal, Switch } from 'react-native';
import {
    Colors,
    Size,
    stylesVnrTreeView,
    stylesVnrFilter,
    styleSheets,
    stylesVnrPicker,
    CustomStyleSheet
} from '../../constants/styleConfig';
import { SafeAreaView } from 'react-navigation';
import VnrLoading from '../../components/VnrLoading/VnrLoading';
import RenderNode from './RenderNode';
import Icon from 'react-native-vector-icons/Ionicons';
import HttpFactory from '../../factories/HttpFactory';
import VnrText from '../../components/VnrText/VnrText';
import VnrTextInput from '../VnrTextInput/VnrTextInput';
import { translate } from '../../i18n/translate';
import { IconDown, IconRefresh } from '../../constants/Icons';
import { Platform } from 'react-native';
const iconNameSearch = `${Platform.OS === 'ios' ? 'ios-' : 'md-'}search`;
const defaultState = {
    data: [],
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

    handleGetData = (inactive, isRefesh) => {
        //debugger
        const { api } = this.props;
        api.urlApi = api.urlApi + '?showInactive=' + inactive;
        HttpFactory.getDataPicker(api).then(responseJson => {
            responseJson.forEach(item => (item.hasExpand = true));
            // set value
            let valueId = {};
            if (!isRefesh) {
                const _value = this.getItemSelected();
                if (_value) valueId = this.getNodeCheckedToId(_value);
            }

            const _data = [...responseJson];
            this.setState({ data: _data, isVisibleLoading: false, idChecked: { ...valueId } });
        });
    };

    getNodeCheckedToId = (data, objResult) => {
        if (!objResult) objResult = {};
        if (data) {
            data.forEach(node => {
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

    setIsCheckedChild = (node, _isChecked, path, pressNode) => {
        node.forEach((item, i) => {
            let _path = [...path, i];
            item.Path = _path;

            if (item.isChecked !== _isChecked) {
                pressNode.push({ ...item, isChecked: _isChecked });
            }

            item.isChecked = _isChecked;
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
        const { data, idChecked } = this.state;
        const { path } = node;
        const lenPath = path.length;
        let item = data[path[0]];
        for (let index = 1; index < lenPath; index++) {
            item = item.ListChild[path[index]];
        }

        item.isChecked = !item.isChecked;
        idChecked[item.id] = item.isChecked;
        item.Path = path;
        let pressNodes = [{ ...item }];

        //check child
        if (this.IsCheckChildren) {
            if (item.hasChildren) {
                pressNodes = this.setIsCheckedChild(item.ListChild, item.isChecked, path, pressNodes);
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
            const itemSelectedOnly = this.getItemSelectedOnly();
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

        this.setState({ data: data, idChecked });
    };

    filterNode = (data, key, nodeParents, level) => {
        if (!nodeParents) {
            nodeParents = [];
        }
        if (!level) {
            level = 0;
        }

        data.forEach(item => {
            item.Level = level;

            if (item.ParentID == null) {
                nodeParents = [];
            } else {
                let _nodeParents = nodeParents.filter(nodeParent => {
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
                    nodeParents.forEach(nodeParent => {
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
        this.setState({ key: text });
        if (!text || text === '') {
            this.handleGetData(this.state.toggle);
        }
    };

    initTreeView = (data, level, path) => {
        if (!path) {
            path = [0];
        }

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
            cloneNode.isChecked = idChecked[cloneNode.id];
            return (
                cloneNode.hasExpand &&
                cloneNode.IsShow &&
                (hasChildren ? (
                    <View
                        style={{
                            paddingHorizontal: Size.defineSpace
                        }}
                    >
                        <RenderNode
                            level={level}
                            cloneNode={cloneNode}
                            expandChild={this.expandChild}
                            checkedNode={this.checkedNode}
                        />
                        {hasChildren && this.initTreeView(cloneNode.ListChild, levelTmp, path)}
                    </View>
                ) : (
                    <RenderNode level={level} cloneNode={cloneNode} checkedNode={this.checkedNode} />
                ))
            );
        });
    };

    setModalVisible(visible, isPressClose) {
        const { disable } = this.props,
            { idChecked } = this.state;
        if (disable) {
            return;
        }
        if (isPressClose) {
            if (this.IsCheckChildren) {
                let _itemsSelected = this.getItemSelected();
                let { data } = this.state;
                if (_itemsSelected && _itemsSelected.length) {
                    _itemsSelected.forEach(item => {
                        const { Path } = item;
                        const lenPath = Path.length;
                        let node = data[Path[0]];
                        for (let index = 1; index < lenPath; index++) {
                            node = node.ListChild[Path[index]];
                        }
                        node.isChecked = !item.isChecked;
                        idChecked[item.id] = node.isChecked;
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

        //this.setItemSelected([]);

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
            data.forEach(node => {
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
        let arrName = nodesChecked.map(node => {
            return node.Name;
        });

        if (arrName.length) {
            this.setState({ selectedValue: arrName.join(', '), hasPick: true });
        } else {
            this.setState({ selectedValue: null, hasPick: false });
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
            isVisibleLoading: true,
            hasPick: false
        });
        this.handleGetData(value);
    };

    refreshData = () => {
        this.setState({
            key: '',
            selectedValue: null,
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

    render() {
        const { data, isVisibleLoading, hasPick, selectedValue } = this.state;
        const { onSelect, disable } = this.props;
        const styles = stylesVnrTreeView;
        const {
            bntPicker,
            bntPickerDisable,
            selectPicker,
            stylePlaceholder,
            styLableValue
        } = stylesVnrPicker.VnrPicker;
        return (
            <View style={CustomStyleSheet.flex(1)}>
                <Modal
                    //animationType="slide"
                    animationType="none"
                    transparent={false}
                    visible={this.state.modalVisible}
                >
                    <SafeAreaView
                        style={CustomStyleSheet.flex(1)}
                        forceInset={{ top: 'always', bottom: 'always' }}
                    >
                        <View style={styles.headerTop}>
                            <View style={styles.headerTopUpon}>
                                <VnrText i18nKey={'HRM_ORG_Button_Show_Hidden'} />
                                <Switch
                                    value={this.state.toggle}
                                    onValueChange={this.onValueChange}
                                    trackColor={{ false: Colors.gray_5, true: Colors.primary }}
                                    thumbColor={Colors.white}
                                    ios_backgroundColor={Colors.gray_5}
                                    style={[
                                        { marginLeft: Size.defineHalfSpace },
                                        Platform.OS == 'android'
                                            ? { transform: [{ scaleX: 1.3 }, { scaleY: 1.2 }] }
                                            : {}
                                    ]}
                                />
                                <TouchableOpacity style={styles.styBtnRefresh} onPress={this.refreshData}>
                                    <IconRefresh size={Size.iconSize} color={Colors.black} />
                                </TouchableOpacity>
                            </View>

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

                        <View style={styles.styViewData}>
                            <VnrLoading size="small" isVisible={isVisibleLoading} />
                            {!isVisibleLoading && (
                                <ScrollView horizontal={true}>
                                    <ScrollView>{this.initTreeView([...data], 0)}</ScrollView>
                                </ScrollView>
                            )}
                        </View>

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
                    </SafeAreaView>
                </Modal>

                <View style={selectPicker}>
                    <TouchableOpacity
                        activeOpacity={!disable ? 0.2 : 1}
                        onPress={() => {
                            this.setModalVisible(true);
                        }}
                        style={[bntPicker, disable && bntPickerDisable]}
                    >
                        <View style={CustomStyleSheet.maxWidth('90%')}>
                            {selectedValue != null ? (
                                <Text
                                    style={[
                                        styleSheets.text,
                                        styLableValue,
                                        // eslint-disable-next-line react-native/no-inline-styles
                                        !hasPick && { color: Colors.gray_6, opacity: 0.85 }
                                    ]}
                                    numberOfLines={1}
                                >
                                    {selectedValue}
                                </Text>
                            ) : (
                                <VnrText
                                    style={[
                                        styleSheets.text,
                                        stylePlaceholder,
                                        // eslint-disable-next-line react-native/no-inline-styles
                                        !hasPick && { color: Colors.gray_6, opacity: 0.85 }
                                    ]}
                                    i18nKey={'SELECT_ITEM'}
                                />
                            )}
                        </View>
                        <View style={CustomStyleSheet.maxWidth('10%')}>
                            <IconDown size={Size.iconSize} color={disable ? Colors.gray_7 : Colors.gray_8} />
                        </View>
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}
