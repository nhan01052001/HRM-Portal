import React, { Component } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Modal from 'react-native-modal';
import GoogleReCaptcha from './GoogleReCaptcha';
import { Colors } from '../../constants/styleConfig';

const { width, height } = Dimensions.get('window');

class ConfirmGoogleCaptcha extends Component {
    state = {
        show: false
    };
    show = () => {
        this.setState({ show: true });
    };
    hide = () => {
        this.setState({ show: false });
    };
    render() {
        let { show } = this.state;
        let { siteKey, baseUrl, languageCode, onMessage, cancelButtonText } = this.props;
        return (
            <Modal
                backdropOpacity={0.6}
                useNativeDriver
                hideModalContentWhileAnimating
                deviceHeight={height}
                deviceWidth={width}
                style={styles.modal}
                animationIn="fadeIn"
                animationOut="fadeOut"
                isVisible={show}
            >
                <View style={styles.wrapper}>
                    <GoogleReCaptcha
                        url={baseUrl}
                        siteKey={siteKey}
                        onMessage={onMessage}
                        languageCode={languageCode}
                        cancelButtonText={cancelButtonText}
                    />
                </View>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    modal: {
        margin: 0
    },
    wrapper: {
        flex: 1,
        backgroundColor: Colors.black03,
        overflow: 'hidden'
    }
});

export default ConfirmGoogleCaptcha;
