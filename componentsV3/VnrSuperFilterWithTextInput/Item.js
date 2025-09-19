/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Colors, stylesVnrPickerMulti, Size, styleSheets, CustomStyleSheet } from '../../constants/styleConfig';
import { IconCheck } from '../../constants/Icons';
import Vnr_Function from '../../utils/Vnr_Function';
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
        const { dataItem, textField, lastItem, licensedDisplay, textFieldFilter } = this.props;
        const styles = stylesVnrPickerMulti.Item;

        let txtSubTitle = '',
            txtTitle = '';

        if (Array.isArray(licensedDisplay.UnderName) && licensedDisplay.UnderName.length === 1) {
            txtSubTitle = dataItem[licensedDisplay.UnderName[0]];
        } else if (
            Array.isArray(licensedDisplay.UnderName) &&
            licensedDisplay.UnderName.length === 2 &&
            Object.prototype.hasOwnProperty.call(dataItem, licensedDisplay.UnderName[0]) &&
            Object.prototype.hasOwnProperty.call(dataItem, licensedDisplay.UnderName[1])
        ) {
            if (dataItem[licensedDisplay.UnderName[0]] && dataItem[licensedDisplay.UnderName[1]]) {
                txtSubTitle = `${dataItem[licensedDisplay.UnderName[0]]} - ${dataItem[licensedDisplay.UnderName[1]]}`;
            } else if (dataItem[licensedDisplay.UnderName[0]] || dataItem[licensedDisplay.UnderName[1]]) {
                txtSubTitle = dataItem[licensedDisplay.UnderName[0]]
                    ? dataItem[licensedDisplay.UnderName[0]]
                    : dataItem[licensedDisplay.UnderName[1]];
            }
        } else if (dataItem[licensedDisplay.UnderName[0]]) {
            txtSubTitle = `${licensedDisplay.UnderName[1] ? translate(licensedDisplay.UnderName[1]) + ':' : ''} ${
                dataItem[licensedDisplay.UnderName[0]]
            }`;
        } else {
            txtSubTitle = '';
        }

        if (textFieldFilter && dataItem[textFieldFilter]) {
            txtTitle = dataItem[textFieldFilter];
        } else if (Array.isArray(licensedDisplay.Name) && licensedDisplay.Name.length === 1) {
            txtTitle = dataItem[licensedDisplay.Name[0]];
        } else if (
            Array.isArray(licensedDisplay.Name) &&
            licensedDisplay.Name.length === 2 &&
            Object.prototype.hasOwnProperty.call(dataItem, licensedDisplay.UnderName[0]) &&
            Object.prototype.hasOwnProperty.call(dataItem, licensedDisplay.UnderName[1])
        ) {
            if (dataItem[licensedDisplay.Name[0]] && dataItem[licensedDisplay.Name[1]]) {
                txtTitle = `${dataItem[licensedDisplay.Name[0]]} - ${dataItem[licensedDisplay.Name[1]]}`;
            } else if (dataItem[licensedDisplay.Name[0]] || dataItem[licensedDisplay.Name[1]]) {
                txtTitle = dataItem[licensedDisplay.Name[0]]
                    ? dataItem[licensedDisplay.Name[0]]
                    : dataItem[licensedDisplay.Name[1]];
            }
        } else {
            txtTitle = dataItem[textField];
        }

        return (
            <TouchableOpacity onPress={this.toggleIsCheckItem} activeOpacity={0.7}>
                <View style={[styles.item, lastItem && CustomStyleSheet.borderBottomWidth(0), CustomStyleSheet.paddingVertical(8)]}>
                    {Vnr_Function.renderAvatarCricleByName(
                        dataItem[licensedDisplay.Avatar[0]],
                        dataItem[textField],
                        40
                    )}
                    <View style={{ flex: 8, marginLeft: 12 }}>
                        <View>
                            <Text style={[styleSheets.text]}>{txtTitle}</Text>
                            {(txtSubTitle && txtSubTitle.length) > 0 && (
                                <Text style={[styleSheets.text, { fontSize: 14, color: Colors.gray_7 }]}>
                                    {txtSubTitle}
                                </Text>
                            )}
                        </View>
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
