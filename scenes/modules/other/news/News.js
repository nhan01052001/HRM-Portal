import React, { Component } from 'react';
import { View, TouchableOpacity, Platform, StyleSheet, Keyboard } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styleSafeAreaView, Size, Colors } from '../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import { WebView } from 'react-native-webview';
import { VnrLoadingSevices } from '../../../../components/VnrLoading/VnrLoadingPages';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import DrawerServices from '../../../../utils/DrawerServices';
import { IconBack } from '../../../../constants/Icons';
import { getDataVnrStorage } from '../../../../assets/auth/authentication';
export default class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uriNews: dataVnrStorage.apiConfig.uriNews,
            uriNewsWordPress: dataVnrStorage.apiConfig.uriNewsWordPress,
            IsGoBackVisible: true
        };
        // props.navigation.setParams({
        //     goback: this.goBack.bind(this),
        // });

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
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        //this.generaRender();
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
        this.setState({ IsGoBackVisible: false });
    };

    _keyboardDidHide = () => {
        this.setState({ IsGoBackVisible: true });
    };

    render() {
        const { uriNews, uriNewsWordPress, IsGoBackVisible } = this.state;

        const dataVnrStorage = getDataVnrStorage(),
            { currentUser } = dataVnrStorage;

        const script_Inject = `
            const style = document.createElement('style');
            style.type = 'text/css';
            style.innerHTML = '* { -webkit-tap-highlight-color: transparent; }';
            document.head.appendChild(style);

            const meta = document.createElement('meta');
                meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                meta.setAttribute('name', 'viewport');
                document.head.appendChild(meta);
            setTimeout(function () {
                localStorage.setItem('accessTokenMobile' , '${currentUser?.headers?.tokenportalapp}')
            },2000);
            true; 
        `;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styles.styContainer}>
                    <View style={styles.styViewBtnFullScreen}>
                        {IsGoBackVisible && (
                            <TouchableOpacity
                                style={styles.styBtnFullScreen}
                                onPress={() => {
                                    this.goBack();
                                }}
                            >
                                <IconBack size={Size.iconSizeHeader + 8} color={Colors.white} />
                            </TouchableOpacity>
                        )}
                    </View>
                    <WebView
                        style={styles.styWebView}
                        ref={(refWebView) => (this.refWebView = refWebView)}
                        cacheEnabled={false}
                        javaScriptEnabled={true}
                        source={{
                            uri: uriNewsWordPress
                                ? uriNewsWordPress
                                : uriNews
                                    ? uriNews.trim() + '&v=' + new Date().getTime()
                                    : uriNews
                        }}
                        scalesPageToFit={Platform.OS === 'android' ? false : true}
                        startInLoadingState={true}
                        injectedJavaScript={script_Inject}
                        scrollEnabled
                        renderLoading={() => (
                            <View style={styles.loadingWebView}>
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
                </View>
            </SafeAreaView>
        );
    }
}

const HIGHT_BTN = Size.deviceWidth >= 1024 ? 60 : Size.deviceWidth * 0.15;

const styles = StyleSheet.create({
    loadingWebView: {
        position: 'absolute',
        width: Size.deviceWidth,
        height: Size.deviceheight - Size.headerHeight,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styWebView: { flex: 1 },
    styContainer: { position: 'relative', top: 0, right: 0, left: 0, height: '100%', elevation: 99 },
    styViewBtnFullScreen: {
        position: 'absolute',
        bottom: Size.defineSpace * 4,
        left: Size.defineSpace,
        alignItems: 'flex-end',
        zIndex: 100
    },
    styBtnFullScreen: {
        width: HIGHT_BTN,
        height: HIGHT_BTN,
        borderRadius: HIGHT_BTN / 2,
        backgroundColor: Colors.gray_10,
        justifyContent: 'center',
        alignItems: 'center',
        opacity: 0.7
    }
});
