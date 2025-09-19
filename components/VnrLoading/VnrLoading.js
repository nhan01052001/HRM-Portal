import React from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Colors, stylesVnrLoading } from '../../constants/styleConfig';

export default class VnrLoading extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        const { container } = stylesVnrLoading.VnrLoading;
        let styleViewLoading = container;

        if (this.props.isVisible == false) {
            return null;
        }

        // trường hợp thay đổi style view bao quanh loading
        if (this.props.style) {
            styleViewLoading = this.props.style;
        }

        return (
            <View style={styleViewLoading} accessibilityLabel={'VnrLoading-ActivityIndicator'}>
                {
                    <ActivityIndicator
                        size={this.props.size}
                        color={this.props.color ? this.props.color : Colors.primary}
                    />
                }
            </View>
        );
    }
}
