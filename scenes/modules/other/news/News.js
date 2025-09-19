/* eslint-disable no-console */
import React, { Component } from 'react';
import { View, TouchableOpacity, Platform, StyleSheet, Keyboard, BackHandler } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styleSafeAreaView, Size, Colors } from '../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import { WebView } from 'react-native-webview';
import { VnrLoadingSevices } from '../../../../components/VnrLoading/VnrLoadingPages';
import SkeNews from '../../../../components/VnrLoading/skeletonContent/SkeNews';
import DrawerServices from '../../../../utils/DrawerServices';
import { IconBack } from '../../../../constants/Icons';
import HttpService from '../../../../utils/HttpService';
import EmptyData from '../../../../components/EmptyData/EmptyData';

export default class News extends Component {
    constructor(props) {
        super(props);
        this.state = {
            uriNews: dataVnrStorage.apiConfig.uriNews,
            uriNewsWordPress: dataVnrStorage.apiConfig.uriNewsWordPress,
            IsGoBackVisible: true,
            webViewKey: Date.now().toString(),
            allTokens: null
        };
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

    // Xử lý khi bấm nút back trên Android
    handleBackPress = () => {
        if (this.canGoback && this.refWebView) {
            // Nếu WebView có thể go back, thực hiện go back trong WebView
            this.refWebView.goBack();
            return true; // Ngăn không cho app thoát
        } else {
            // Nếu không thể go back trong WebView, cho phép hành vi mặc định (thoát màn hình)
            return false;
        }
    };

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);

        // Thêm listener cho Android back button
        if (Platform.OS === 'android') {
            this.backHandler = BackHandler.addEventListener('hardwareBackPress', this.handleBackPress);
        }

        //this.generaRender();
        this.loadTokenAndSetupWebView();
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();

        // Xóa listener cho Android back button
        if (Platform.OS === 'android' && this.backHandler) {
            this.backHandler.remove();
        }
    }

    _keyboardDidShow = () => {
        this.setState({ IsGoBackVisible: false });
    };

    _keyboardDidHide = () => {
        this.setState({ IsGoBackVisible: true });
    };

    loadTokenAndSetupWebView = async () => {
        try {
            VnrLoadingSevices.show();
            const tokens = await HttpService.getFullInfoToken();
            this.setState({ allTokens: tokens });
        } catch (error) {
            console.error('Error fetching tokens for WebView:', error);
            // Xử lý lỗi nếu cần
        } finally {
            VnrLoadingSevices.hide();
        }
    };

    handleWebViewMessage = async (event) => {
        try {
            const messageData = JSON.parse(event.nativeEvent.data);
            if (messageData && messageData.Type === 'E_UPDATE_TOKEN' && messageData.Data) {
                console.log('News.js: Received E_UPDATE_TOKEN from WebView', messageData.Data);
                const updateSuccess = await HttpService.updateToken(messageData.Data);
                if (updateSuccess) {
                    console.log('News.js: Token updated successfully via WebView message.');
                } else {
                    console.error('News.js: Failed to update token via WebView message.');
                }
            }
        } catch (error) {
            console.error('Error parsing message from WebView or updating token:', error);
        }
    };

    render() {
        const { uriNews, uriNewsWordPress, IsGoBackVisible, webViewKey, allTokens } = this.state;
        let headers = {};
        if (allTokens && allTokens.accessToken) {
            Object.keys(allTokens).forEach((key) => {
                headers[key] = allTokens[key];
            });
        }

        let uri = null;
        if (uriNewsWordPress && uriNewsWordPress.length > 0) {
            // Nếu có uriNewsWordPress, ưu tiên sử dụng nó
            uri = uriNewsWordPress.trim();
        } else if (uriNews && uriNews.length > 0) {
            // Nếu không có uriNewsWordPress, sử dụng uriNews
            uri = uriNews.trim() + '&v=' + new Date().getTime();
        }

        const script_Inject = `
            // Hàm để web gọi khi cần refresh token
            window.updateTokenInfoJavaScript = function(newTokens) {
                if (newTokens && newTokens.accessToken && newTokens.refreshToken && newTokens.idToken) {
                    window.ReactNativeWebView.postMessage(JSON.stringify({ Type: "E_UPDATE_TOKEN", Data: newTokens }));
                } else {
                    console.error("updateTokenInfoJavaScript: Invalid tokens received", newTokens);
                }
            };

            // Ví dụ cách web có thể gọi hàm này:
            // if (shouldRefreshToken) {
            //     const newTokensFromWebAuth = { accessToken: 'newAccess', refreshToken: 'newRefresh', idToken: 'newId' };
            //     window.updateTokenInfoJavaScript(newTokensFromWebAuth);
            // }
        `;

        if (!allTokens && !headers?.HTTP_ACCESSTOKEN) {
            // Nếu chưa có token nào, hiển thị loading skeleton chung
            return (
                <SafeAreaView {...styleSafeAreaView}>
                    <SkeNews />
                </SafeAreaView>
            );
        }

        if (!uri || uri.length === 0) {
            // Nếu không có URI hợp lệ, hiển thị thông báo lỗi hoặc loading skeleton
            return <EmptyData messageEmptyData={'EmptyData'} />;
        }

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
                        key={webViewKey}
                        style={styles.styWebView}
                        ref={(refWebView) => (this.refWebView = refWebView)}
                        cacheEnabled={false}
                        javaScriptEnabled={true}
                        source={{
                            uri: uri,
                            headers: headers
                        }}
                        scalesPageToFit={Platform.OS === 'android' ? false : true}
                        startInLoadingState={true}
                        injectedJavaScript={script_Inject}
                        scrollEnabled
                        onMessage={this.handleWebViewMessage}
                        renderLoading={() => (
                            <View style={styles.loadingWebView}>
                                <SkeNews />
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
        height: Size.deviceheight,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
        paddingTop: Size.defineSpace
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
