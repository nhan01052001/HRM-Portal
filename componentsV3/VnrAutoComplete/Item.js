/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors, stylesVnrPicker, Size, styleSheets } from '../../constants/styleConfig';
import { IconRadioCheck, IconRadioUnCheck } from '../../constants/Icons';

export default class Item extends React.Component {
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
        const { dataItem, textField, lastItem } = this.props;
        const styles = stylesVnrPicker.Item;
        return (
            <TouchableOpacity
                onPress={this.toggleIsCheckItem}
                //style={{backgroundColor:Colors.grey}}
                activeOpacity={1}
                underlayColor={Colors.greySecondaryConstraint}
            >
                <View style={[styles.item, lastItem && { borderBottomWidth: 0 }]}>
                    <View style={{ flex: 9.3 }}>
                        <Text style={[styleSheets.text]}>{dataItem[textField]}</Text>
                    </View>
                    <View style={{ flex: 0.7, alignItems: 'flex-end' }}>
                        {dataItem.isSelect ? (
                            <IconRadioCheck size={Size.iconSize} color={Colors.primary} />
                        ) : (
                            <IconRadioUnCheck size={Size.iconSize} color={Colors.grey} />
                        )}

                        {/* <CheckBox
                            checkBoxColor={Colors.black}
                            checkedCheckBoxColor={Colors.primary}
                            onClick={this.toggleIsCheckItem}
                            isChecked={dataItem.isSelect}
                        /> */}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
