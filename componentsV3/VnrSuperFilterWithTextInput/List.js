import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Colors, Size, stylesVnrPickerMulti } from '../../constants/styleConfig';

export default class Item extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isCheck: false
        };
    }

    toggleIsCheckItem() {
        this.setState({ isCheck: !this.state.isCheck });
    }

    render() {
        const iconNameChecked = `${Platform.OS === 'ios' ? 'ios-' : 'md-'}checkmark`;
        const { title } = this.props;
        const { isCheck } = this.state;
        const styles = stylesVnrPickerMulti.List;
        return (
            <TouchableOpacity onPress={() => this.toggleIsCheckItem()}>
                <View style={styles.item}>
                    <Text style={styles.title}>{title}</Text>
                    <Icon
                        name={iconNameChecked}
                        size={Size.iconSize}
                        color={isCheck == true ? Colors.green : Colors.white}
                    />
                </View>
            </TouchableOpacity>
        );
    }
}
