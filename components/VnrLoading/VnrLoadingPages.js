import React from 'react';
import { View, ActivityIndicator, TouchableOpacity, Platform, StyleSheet } from 'react-native';
import { Colors, CustomStyleSheet, Size } from '../../constants/styleConfig';

const api = {};
export const VnrLoadingSevices = api;

export default class VnrLoadingPages extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false
        };
        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
    }

    show = () => {
        this.setState({ isVisible: true });
    };

    hide = () => {
        this.setState({ isVisible: false });
    };

    componentDidMount() {
        api.show = this.show;
        api.hide = this.hide;
    }

    render() {
        return (
            <View style={Platform.OS == 'ios' && CustomStyleSheet.zIndex(2)}>
                {this.state.isVisible === true && (
                    <View style={styles.modal} accessibilityLabel={'VnrLoadingPages-LoadingScreen'}>
                        <TouchableOpacity activeOpacity={1} style={[styles.container]} onPress={() => null}>
                            <ActivityIndicator size="large" color={Colors.primary} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        zIndex: 4,
        position: 'absolute',
        height: Size.deviceheight,
        width: Size.deviceWidth,
        alignSelf: 'flex-end'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
