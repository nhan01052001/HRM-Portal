/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors, stylesVnrPickerMulti, Size, styleSheets } from '../../constants/styleConfig';
import { IconCheck } from '../../constants/Icons';
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
            <TouchableOpacity style={[styles.item, { marginHorizontal: 0 }, lastItem && { borderBottomWidth: 0 }]} onPress={this.toggleIsCheckItem} activeOpacity={0.7}>
                <View
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        paddingHorizontal: Size.defineSpace
                    }}
                >
                    <View style={{ flex: 9.3, paddingRight: Size.defineSpace }}>
                        <Text style={[styleSheets.text]} numberOfLines={1}>
                            {translate(textFieldValue)}
                        </Text>
                    </View>
                    <View style={{ flex: 0.7, alignItems: 'flex-end' }}>
                        <View style={[styles.styCheckBox, dataItem.isSelect && styles.styDeactive]}>
                            {dataItem.isSelect && <IconCheck size={Size.text} color={Colors.white} />}
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
