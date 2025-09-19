import React, { Component } from 'react';
import { View, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSafeAreaView, Size, CustomStyleSheet } from '../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import { WebView } from 'react-native-webview';
import { VnrLoadingSevices } from '../../../../components/VnrLoading/VnrLoadingPages';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import DrawerServices from '../../../../utils/DrawerServices';
export default class SocialNetWork extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisibleWebView: true,
            uriNews: dataVnrStorage.apiConfig.uriNews
        };
        props.navigation.setParams({
            goback: this.goBack.bind(this)
        });

        // biến để nhận biết có được goback nữa hay không
        this.canGoback = null;
    }

    goBack = () => {
        if (this.canGoback && this.refWebView) {
            this.refWebView.goBack();
        } else {
            DrawerServices.goBack();
        }
    };

    componentDidMount() {
        //this.generaRender();
    }

    render() {
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <WebView
                    style={CustomStyleSheet.flex(1)}
                    ref={(refWebView) => (this.refWebView = refWebView)}
                    cacheEnabled={false}
                    source={{ uri: 'http://103.63.212.190:8008/ossn/home' }}
                    scalesPageToFit={Platform.OS === 'android' ? false : true}
                    startInLoadingState={true}
                    scrollEnabled
                    renderLoading={() => (
                        <View style={styles.styWebView}>
                            <VnrLoading size={'large'} />
                        </View>
                    )}
                    onLoadStart={() => {
                        // hàm gọi khi start load
                        this.canGoback && VnrLoadingSevices.show();
                    }}
                    onLoadEnd={(syntheticEvent) => {
                        // hàm gọi khi end load
                        VnrLoadingSevices.hide();
                        const { nativeEvent } = syntheticEvent;
                        this.canGoback = nativeEvent.canGoBack;
                    }}
                />
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styWebView: {
        position: 'absolute',
        width: Size.deviceWidth,
        height: Size.deviceheight - Size.headerHeight,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
