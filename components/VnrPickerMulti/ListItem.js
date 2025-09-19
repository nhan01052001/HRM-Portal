/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, FlatList } from 'react-native';
import { Colors, styleSheets } from '../../constants/styleConfig';
import Item from './Item';

export default class ListItem extends React.Component {
    constructor(props) {
        super(props);
    }

    renderSeparator = () => {
        return (
            <View
                style={{
                    height: 1,
                    width: 'auto',
                    backgroundColor:Colors.gray_6,
                    marginHorizontal: styleSheets.p_10
                }}
            />
        );
    };

    render() {
        const { dataSource, textField, valueField, addItem, textFieldFilter } = this.props;
        return (
            <View style={{ flex: 1 }}>
                <FlatList
                    showsVerticalScrollIndicator={false}
                    data={dataSource}
                    extraData={this.state}
                    //ItemSeparatorComponent={this.renderSeparator}
                    renderItem={({ item, index }) => (
                        <Item
                            index={index}
                            isSelect={item.isSelect}
                            dataItem={item}
                            textField={textField}
                            textFieldFilter={textFieldFilter}
                            isChecked={index => addItem(index)}
                            lastItem={index == dataSource.length - 1 ? true : false}
                        />
                    )}
                    keyExtractor={item => item[valueField]}
                />
            </View>
        );
    }
}
