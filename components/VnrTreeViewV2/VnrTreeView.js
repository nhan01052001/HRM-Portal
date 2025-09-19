import React from 'react';
import { ScrollView, View, Text, TouchableOpacity, Modal, Platform } from 'react-native';
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
import VnrLoading from '../VnrLoading/VnrLoading';
import RenderNode from './RenderNode';
import Icon from 'react-native-vector-icons/Ionicons';
import HttpFactory from '../../factories/HttpFactory';
import VnrText from '../VnrText/VnrText';
import VnrTextInput from '../VnrTextInput/VnrTextInput';
import { translate } from '../../i18n/translate';
import { IconDown } from '../../constants/Icons';
const iconNameSearch = `${Platform.OS === 'ios' ? 'ios-' : 'md-'}search`;
const defaultState = {
    data: [],
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

        this.state = { ...defaultState };
        this.itemSelected = [];
        this.itemSelectedOnly = [{}];
        this.IsCheckChildren = props.isCheckChildren;
        this.isModalOpened = false;
        this.Value = props.value;
        this.ValueField = props.valueField;
        this.TextField = props.textField;
        const { value } = props;

        if (value && props.isCheckChildren) {
            this.itemSelected = value;
        } else if (value && !props.isCheckChildren) {
            this.itemSelectedOnly = value[0];
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
        this.setOrgName(this.getItemSelectedOnly());
    }

    handleGetData = () => {
        const { api } = this.props;
        HttpFactory.getDataPicker(api)
            .then(responseJson => {
                responseJson.forEach(item => (item.hasExpand = true));
                this.handelData(responseJson, 0, [0]);
                this.setState({ data: [...responseJson], isVisibleLoading: false });
            })
    };

    handelData = (pureData, level, path) => {
        if (pureData) {
            pureData.forEach((item, index) => {
                if (level === 0) {
                    path = [index];
                } else if (level <= path.length) {
                    let _path = path.slice(0, level);
                    path = [..._path];
                    path.push(index);
                }

                item.path = path;
                item.Path = path;

                if (item.hasChildren) {
                    const levelTmp = level + 1;
                    this.handelData(item.ListChild, levelTmp, path);
                }
            });
        }
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
        const { path, Path } = node;

        if (path) {
            node.Path = path;
        } else if (Path) {
            node.path = Path;
        }

        const lenPath = node.path.length;
        let item = data[node.path[0]];
        for (let index = 1; index < lenPath; index++) {
            item = item.ListChild[node.path[index]];
        }

        item.isChecked = false;
        this.Value = null;
    }

    checkedNode = node => {
        const { data } = this.state;
        const { path } = node;
        const lenPath = path.length;
        let item = data[path[0]];
        for (let index = 1; index < lenPath; index++) {
            item = item.ListChild[path[index]];
        }

        item.isChecked = !item.isChecked;
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
                        return item[this.ValueField] === pressNode[this.ValueField];
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
                if (itemSelectedOnly[0].path) {
                    let _itemFirst = { ...itemSelectedOnly[0] };
                    this.unCheckNode(_itemFirst);
                    this.setItemSelectedOnly([{ ..._itemFirst }, { ...item }]);
                } else {
                    this.setItemSelectedOnly([{}, { ...item }]);
                }
            } else if (itemSelectedOnly[1] && itemSelectedOnly[1][this.ValueField] !== item[this.ValueField]) {
                let _itemLast = { ...itemSelectedOnly[1] };
                this.unCheckNode(_itemLast);

                if (itemSelectedOnly[0].path) {
                    this.setItemSelectedOnly([{ ...itemSelectedOnly[0] }, { ...item }]);
                } else {
                    this.setItemSelectedOnly([{}, { ...item }]);
                }
            }
        }

        this.setState({ data: data });
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

            let _indexOf = item[this.TextField].toLowerCase().indexOf(key);

            if (_indexOf >= 0) {
                item.IsShow = true;
                item.hasExpand = true;
                item.isExpanded = true;
                item.NameFilter = item[this.TextField].substr(_indexOf, key.length);
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

            const arrValue = this.Value && this.Value.length ? this.Value.map(item => item[this.ValueField]) : [];

            if (arrValue.indexOf(node[this.ValueField]) >= 0) {
                node.isChecked = true;
                this.setItemSelectedOnly([{ ...node, path: path }]);
            }

            let cloneNode = { ...node, path: path };
            const { ListChild } = cloneNode;
            const levelTmp = level + 1;

            return (
                cloneNode.hasExpand &&
                cloneNode.IsShow &&
                (ListChild && ListChild.length > 0 ? (
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
                        {ListChild && ListChild.length > 0 && this.initTreeView(cloneNode.ListChild, levelTmp, path)}
                    </View>
                ) : (
                    <RenderNode level={level} cloneNode={cloneNode} checkedNode={this.checkedNode} />
                ))
            );
        });
    };

    setModalVisible(visible, isPressClose) {
        const { disable } = this.props;
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
                    });
                }
            } else {
                const _itemSelectedOnly = this.itemSelectedOnly;
                let { data } = this.state;

                _itemSelectedOnly.forEach((item, i) => {
                    const { path, Path } = item;
                    if (path || Path) {
                        const lenPath = path ? path.length : Path.length;
                        let node = path ? data[path[0]] : data[Path[0]];
                        for (let index = 1; index < lenPath; index++) {
                            if (path) {
                                node = node.ListChild[path[index]];
                            } else if (Path) {
                                node = node.ListChild[Path[index]];
                            }
                        }

                        if (i === 0) {
                            node.isChecked = item.isChecked;
                            this.setItemSelectedOnly([{ ...node }]);
                        } else {
                            node.isChecked = !item.isChecked;
                        }
                    }
                });
            }
        }

        this.setItemSelected([]);

        this.setState({ modalVisible: visible });
        if (!isPressClose && visible && !this.state.hasLoaded && !this.isModalOpened) {
            this.isModalOpened = true;
            this.handleGetData(false);
        }
    }

    getNodeChecked = (data, result) => {
        if (!result) result = [];
        if (data) {
            data.forEach((node) => {
                if (node.isChecked) {
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
        if (nodesChecked && nodesChecked.length) {
            let arrName = nodesChecked.map((node) => {
                return node[this.TextField];
            });

            if (arrName.length) {
                this.setState({ selectedValue: arrName.join(', '), hasPick: true });
            } else {
                this.setState({ selectedValue: null, hasPick: false });
            }
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
            hasPick: false
        });
        this.handleGetData(this.state.toggle);
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
        this.isModalOpened = false;
        this.Value = nextProps.value;
        this.setState(
            {
                ...defaultState,
                stateProps: nextProps
            },
            () => this.setOrgName(this.Value)
        );
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.refresh !== this.props.refresh) {
            this.onRefreshControl(nextProps);
        }

        return false;
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
                <Modal animationType="none" transparent={false} visible={this.state.modalVisible}>
                    <SafeAreaView
                        style={CustomStyleSheet.flex(1)}
                        forceInset={{ top: 'always', bottom: 'always' }}
                    >
                        <View style={styles.headerTop}>
                            <View style={styles.headerTopUpon}>
                                {/* <VnrText
                                    i18nKey={'HRM_ORG_Button_Show_Hidden'}
                                />
                                <Switch value={this.state.toggle}
                                    onValueChange={this.onValueChange} />
                                <TouchableOpacity style={{ borderWidth: 1, padding: 3, marginLeft: 10 }}
                                    onPress={this.refreshData}>
                                    <Image style={{ width: 20, height: 20, borderWidth: 1, borderRadius: 2 }}
                                        source={refresh} />
                                </TouchableOpacity> */}
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

                        <View style={[CustomStyleSheet.flex(8), CustomStyleSheet.paddingTop(15)]}>
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
                                        // eslint-disable-next-line react-native/no-inline-styles
                                        {
                                            color: Colors.danger,
                                            textDecorationLine: 'underline',
                                            textDecorationStyle: 'solid',
                                            textDecorationColor: Colors.red
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
                        <View style={CustomStyleSheet.flex('90%')}>
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
