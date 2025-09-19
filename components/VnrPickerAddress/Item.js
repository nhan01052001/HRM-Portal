import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors, stylesVnrPicker, Size, styleSheets, CustomStyleSheet } from '../../constants/styleConfig';
import { IconNext, IconRadioCheck, IconRadioUnCheck } from '../../constants/Icons';
import { EnumName } from '../../assets/constant';
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
        const { dataItem, textField, typeIconPicker } = this.props;
        const styles = stylesVnrPicker.Item;
        return (
            <TouchableOpacity
                onPress={this.toggleIsCheckItem}
                activeOpacity={0.3}
                underlayColor={Colors.greySecondaryConstraint}
            >
                <View style={styles.item}>
                    <View style={CustomStyleSheet.flex(9.3)}>
                        <Text style={[styleSheets.text, dataItem.isSelect && { color: Colors.primary }]}>
                            {translate(dataItem[textField])}
                        </Text>
                    </View>
                    <View style={CustomStyleSheet.flex(0.7)}>
                        {typeIconPicker === EnumName.E_CHECK ? (
                            dataItem.isSelect ? (
                                <IconRadioCheck size={Size.iconSize} color={Colors.primary} />
                            ) : (
                                <IconRadioUnCheck size={Size.iconSize} color={Colors.grey} />
                            )
                        ) : (
                            <IconNext
                                size={Size.iconSize + 1}
                                color={dataItem.isSelect ? Colors.primary : Colors.grey}
                            />
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    }
}
