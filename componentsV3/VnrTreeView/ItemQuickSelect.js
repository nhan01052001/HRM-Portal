import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Colors, Size, styleSheets } from '../../constants/styleConfig';
export default class ItemQuickSelect extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null
        };

        this.toggleIsCheckItem = this.toggleIsCheckItem.bind(this);
    }

    toggleIsCheckItem() {
        this.props.isChecked(this.props.index);
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.isSelect !== this.props.isSelect;
    }

    render() {
        const { dataItem, textField, isSelect } = this.props;
        return (
            <TouchableOpacity
                style={[styles.item, isSelect && styles.itemActive]}
                onPress={this.toggleIsCheckItem}
                activeOpacity={0.3}
            >
                <Text style={[styleSheets.text, isSelect && { color: Colors.white }]}>{dataItem[textField]}</Text>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    item: {
        height: 'auto',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        width: 'auto',
        backgroundColor: Colors.gray_4,
        borderRadius: 4,
        paddingVertical: 3,
        paddingHorizontal: Size.defineSpace,
        marginRight: Size.defineHalfSpace,
        marginTop: Size.defineHalfSpace
    },
    itemActive: {
        backgroundColor: Colors.primary
    }
});
