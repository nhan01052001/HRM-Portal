/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, FlatList } from 'react-native';
import { styleSheets, Colors, CustomStyleSheet } from '../../constants/styleConfig';
import Item from './Item';

export default class ListItem extends React.Component {
    constructor(props) {
        super(props);
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 0.5,
                    width: 'auto',
                    backgroundColor: Colors.grey,
                    marginHorizontal: styleSheets.p_10
                }}
            />
        );
    };

    render() {
        const { dataSource, textField, valueField, addItem, isLoading, typeIconPicker } = this.props;
        return !isLoading ? (
            <View style={CustomStyleSheet.flex(1)}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={dataSource}
                    extraData={this.state}
                    //ItemSeparatorComponent={this.renderSeparator}
                    renderItem={({ item, index }) => (
                        <Item
                            typeIconPicker={typeIconPicker}
                            index={index}
                            isSelect={item.isSelect}
                            dataItem={item}
                            textField={textField}
                            isChecked={index => addItem(index)}
                        />
                    )}
                    keyExtractor={item => item[valueField]}
                />
            </View>
        ) : null;
    }
}
