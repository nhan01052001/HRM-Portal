import React, { Component } from 'react';
import {
    View,
    StyleSheet,
    Platform,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Text,
    KeyboardAvoidingView
} from 'react-native';
import Modal from 'react-native-modal';
import WebView from 'react-native-webview';
import { IconCancel, IconColse } from '../../constants/Icons';
import { Colors, CustomStyleSheet, Size, styleSafeAreaView, styleSheets, stylesModalPopupBottom } from '../../constants/styleConfig';
import DeviceInfo from 'react-native-device-info';
import { SafeAreaView } from 'react-navigation';
import { dataVnrStorage } from '../../assets/auth/authentication';
class ModalAuthorize extends Component {
    constructor(props) {
        super(props);
        this.state = {
            show: false
        };
        // biến để nhận biết có được goback nữa hay không
        this.canGoback = null;
    }

    shouldComponentUpdate (nextProps, nextState){
        return nextProps.siteKey !== this.props.siteKey || this.state.show !== nextState.show
    }

    show = () => {
        this.setState({ show: true });
    };

    hide = () => {
        this.setState({ show: false });
    };

    onMessage = event => {
        let { onMessage } = this.props;

        let data = null;
        try {
            data = JSON.parse(event.nativeEvent.data);
        } catch (error) {
            data = event.nativeEvent.data;
        }
        if (data) {
            onMessage && typeof onMessage == 'function' && onMessage(data);
        }
    };

    render() {
        const { show } = this.state;
        const { siteKey, language } = this.props;

        const { deviceToken, customerID } = dataVnrStorage;
        let urlSso = null;

        const _aboutDevice = {
            deviceID: DeviceInfo.getUniqueId(),
            plasform: Platform.OS,
            version: DeviceInfo.getSystemVersion(),
            brand: DeviceInfo.getBrand()
        };

        const data = {
            AboutDevice: JSON.stringify(_aboutDevice),
            DeviceId: _aboutDevice.deviceID,
            CusID: customerID,
            DeviceToken: deviceToken,
            Language: language,
            IsPortalApp: true
        };

        if (siteKey) {
            let url = `?AboutDevice=${data.AboutDevice}&DeviceId=${data.DeviceId}&CusID=${data.CusID}&DeviceToken=${
                    data.DeviceToken
                }&Language=${data.Language}&IsPortalApp=${data.IsPortalApp}`,
                encodeURL = encodeURIComponent(url);

            urlSso = `${siteKey}${encodeURL}`;
        }

        return (
            <Modal
                onBackButtonPress={() => this.hide()}
                onBackdropPress={() => this.hide()}
                customBackdrop={
                    <TouchableWithoutFeedback onPress={() => this.hide()}>
                        <View
                            style={styles.styDrop}
                        />
                    </TouchableWithoutFeedback>
                }
                isVisible={show}
                style={CustomStyleSheet.margin(0)}
            >
                <KeyboardAvoidingView style={CustomStyleSheet.flex(1)} behavior={Platform.OS == 'ios' ? 'padding' : 'height'}>
                    <View
                        style={
                            Platform.OS == 'android'
                                // eslint-disable-next-line react-native/no-inline-styles
                                ? {
                                    flex: 1,
                                    backgroundColor: Colors.white
                                }
                                : [
                                    stylesModalPopupBottom.viewEditModal,
                                    {
                                        height: Size.deviceheight * 0.9
                                    }
                                ]
                        }
                    >
                        <SafeAreaView {...styleSafeAreaView} style={stylesModalPopupBottom.safeRadius}>
                            <View style={stylesModalPopupBottom.headerCloseModal}>
                                <IconColse color={Colors.white} size={Size.iconSize} />
                                <Text style={styleSheets.lable} />
                                <TouchableOpacity onPress={() => this.hide()}>
                                    <IconCancel color={Colors.black} size={Size.iconSize} />
                                </TouchableOpacity>
                            </View>
                            <View style={styles.wrapper}>
                                {urlSso !== null && (
                                    <WebView
                                        scrollEnabled
                                        ref={refWebView => (this.refWebView = refWebView)}
                                        source={{
                                            uri: urlSso,
                                            method: 'GET',
                                            headers: {
                                                'x-requested-with': 'com.portal4hrm'
                                            }
                                        }}
                                        startInLoadingState={true}
                                        incognito={true}
                                        onMessage={this.onMessage}
                                    />
                                )}
                            </View>
                        </SafeAreaView>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        );
    }
}

const styles = StyleSheet.create({
    styDrop : {
        flex: 1,
        backgroundColor: Colors.black,
        opacity: 0.5
    },
    wrapper: {
        flex: 1,
        backgroundColor: Colors.black03,
        overflow: 'hidden'
    }
});

export default ModalAuthorize;
