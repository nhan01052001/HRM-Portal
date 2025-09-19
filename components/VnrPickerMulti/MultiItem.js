import React, { Component } from 'react';
import { View, TouchableOpacity, FlatList, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, CustomStyleSheet, stylesVnrPickerMulti } from '../../constants/styleConfig';
import VnrText from '../VnrText/VnrText';

class MultiItem extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isDelete: false
        };
    }
    toggleIsCheckItem() {
        this.setState({ isCheck: !this.state.isDelete });
    }
    removeItemSlect = () => {
        const { revomeItemSelect, item } = this.props;
        revomeItemSelect(item);
    };
    render() {
        //const iconNameUnCheck = `${Platform.OS === 'ios' ? 'ios-' : 'md-'}square-outline`;
        const iconNameDelete = `${Platform.OS === 'ios' ? 'ios-' : 'md-'}close`;
        const { item, textFieldTitle, disable } = this.props;
        const styles = stylesVnrPickerMulti.MultiItem;
        return (
            <TouchableOpacity
                onPress={() => {
                    !disable ? this.props.onOpentModal() : null;
                }}
                activeOpacity={!disable ? 0.2 : 1}
            >
                <View style={styles.multiItem}>
                    <View>
                        {/* <Text style={styles.titleItem}>{item[textFieldTitle]}</Text> */}
                        <VnrText style={styles.titleItem} i18nKey={item[textFieldTitle]} />
                    </View>
                    <View style={[styles.borderDetele, CustomStyleSheet.marginRight(1)]}>
                        <TouchableOpacity
                            activeOpacity={!disable ? 0.2 : 1}
                            onPress={() => {
                                !disable ? this.removeItemSlect() : null;
                            }}
                            style={styles.bnt_delete}
                        >
                            <Icon name={iconNameDelete} size={20} color={Colors.black} />
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}

export default class ListMultiItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { dataSource, textField, onOpentModal, revomeItemSelect, disable } = this.props;
        return (
            <FlatList
                showsVerticalScrollIndicator={false}
                data={dataSource}
                renderItem={({ item }) => (
                    <MultiItem
                        revomeItemSelect={revomeItemSelect}
                        item={item}
                        textFieldTitle={textField}
                        onOpentModal={onOpentModal}
                        disable={disable}
                    />
                )}
                keyExtractor={item => item[textField]}
                horizontal={true}
            />
        );
    }
}
