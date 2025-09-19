/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Colors, stylesVnrPickerMulti, styleSheets, CustomStyleSheet } from '../../constants/styleConfig';
import CheckBox from 'react-native-check-box';
import VnrText from '../VnrText/VnrText';
import { translate } from '../../i18n/translate';

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
        const { dataItem, textField, lastItem, textFieldFilter } = this.props;
        const styles = stylesVnrPickerMulti.Item;
        const textFieldValue =
            textFieldFilter && dataItem[textFieldFilter] ? dataItem[textFieldFilter] : dataItem[textField];
        return (
            <TouchableOpacity
                onPress={this.toggleIsCheckItem}
                activeOpacity={0.3}
                underlayColor={Colors.greySecondaryConstraint}
            >
                <View style={[styles.item, lastItem && CustomStyleSheet.borderBottomWidth(0)]}>
                    <View style={CustomStyleSheet.flex(9.3)}>
                        {/* <Text style={[styleSheets.text]}>{dataItem[textField]}</Text> */}
                        <VnrText style={[styleSheets.text]} value={translate(textFieldValue)} />
                    </View>
                    <View style={{ flex: 0.7, alignItems: 'flex-end' }}>
                        <CheckBox
                            checkBoxColor={Colors.gray_7}
                            checkedCheckBoxColor={Colors.primary}
                            onClick={this.toggleIsCheckItem}
                            isChecked={dataItem.isSelect}
                        />
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
