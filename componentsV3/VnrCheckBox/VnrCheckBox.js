import React from 'react';
import { StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Size } from '../../constants/styleConfig';
import { IconCheck } from '../../constants/Icons';

export default class VnrCheckBox extends React.Component {
    shouldComponentUpdate(nextProps) {
        if (this.props.value !== nextProps.value) {
            return true;
        }
        return false;
    }

    render() {
        const { value, isDisable, onFinish = () => {} } = this.props;
        const isCheck = typeof value == 'boolean' && value == true ? true : false;
        return (
            <TouchableOpacity
                disabled={isDisable}
                onPress={() => {
                    onFinish(!isCheck);
                }}
                activeOpacity={1}
                style={[styles.styCheckBox, isCheck && styles.styDeactive]}
            >
                {isCheck == true && <IconCheck size={Size.text} color={Colors.white} />}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    styCheckBox: {
        height: Size.iconSize * 1.2,
        width: Size.iconSize * 1.2,
        borderRadius: (Size.iconSize * 1.2) / 2,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: Colors.gray_7
    },
    styDeactive: {
        backgroundColor: Colors.primary,
        borderColor: Colors.primary
    }
});
