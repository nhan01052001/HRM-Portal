import React, { Component } from 'react';
import { TouchableOpacity, View, StyleSheet } from 'react-native';
import { Size, Colors } from '../../constants/styleConfig';
import { IconPlus } from '../../constants/Icons';

export class VnrBtnCreate extends Component {
    render() {
        return (
            <View style={styles.styViewBtnCreate}>
                <TouchableOpacity
                    accessibilityLabel="VnrBtnCreate"
                    style={styles.styBtnAdd}
                    onPress={() => {
                        if (typeof this.props?.onAction === 'function') {
                            this.props?.onAction();
                        }
                    }}
                >
                    <IconPlus size={Size.iconSizeHeader} color={Colors.white} />
                </TouchableOpacity>
            </View>
        );
    }
}

const HIGHT_BTN = Size.deviceWidth >= 1024 ? 60 : Size.deviceWidth * 0.15;

const styles = StyleSheet.create({
    styViewBtnCreate: {
        position: 'absolute',
        bottom: Size.defineSpace * 3,
        right: Size.defineSpace,
        alignItems: 'flex-end'
    },
    styBtnAdd: {
        width: HIGHT_BTN,
        height: HIGHT_BTN,
        borderRadius: HIGHT_BTN / 2,
        backgroundColor: Colors.neutralGreen,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: Size.defineSpace
    }
});
