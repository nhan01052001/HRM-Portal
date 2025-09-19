/* eslint-disable no-console */
import { View, Keyboard, StyleSheet, Platform } from 'react-native';
import React, { Component } from 'react';
import WebView from 'react-native-webview';
import { SafeAreaView, SafeAreaConsumer } from 'react-native-safe-area-context';
import { Colors, Size } from '../../../constants/styleConfig';
import VnrLoading from '../../../components/VnrLoading/VnrLoading';
import { styleSafeAreaView } from '../../../constants/styleConfig';
import { dataVnrStorage } from '../../../assets/auth/authentication';
import DrawerServices from '../../../utils/DrawerServices';
import VnrBalloonHome from '../../../components/VnrBalloon/VnrBalloonHome';
import { VnrBalloonService } from '../../../components/VnrBalloon/VnrBalloonHome';
import { getDataVnrStorage } from '../../../assets/auth/authentication';
import ManageFileSevice from '../../../utils/ManageFileSevice';

const TABAR_HEIGHT =
    Size.deviceWidth <= 320
        ? Size.deviceheight * 0.09
        : Platform.OS === 'android'
            ? Size.deviceheight * 0.08
            : Size.deviceheight * 0.1;

export class MessageChatBot extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisibleHeader: false,
            TABAR_HEIGHT: TABAR_HEIGHT,
            chatEndpointApi: dataVnrStorage?.apiConfig?.chatEndpointApi
        };

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            VnrBalloonService.show();
        });

        // biến để nhận biết có được goback nữa hay không
        this.canGoback = null;
    }

    componentDidMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', (e) => {
            const hideSidebarMenu = `
            var sidebarMenu = document.querySelector('.sidebar-menu');
            var chatFooter = document.querySelector('.chat-footer');
            if (sidebarMenu || chatFooter) {
                sidebarMenu.style.display = 'none';
                chatFooter.style.marginBottom = 0;
            }
            `;
            this.setState(
                {
                    keyboardHeight: e.endCoordinates.height,
                    TABAR_HEIGHT: 0
                },
                () => {
                    // Inject JavaScript để ẩn sidebar-menu
                    this.refWeb.injectJavaScript(hideSidebarMenu);
                }
            );
        });

        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            const ShowSidebarMenu = `
            var sidebarMenu = document.querySelector('.sidebar-menu');
            var chatFooter = document.querySelector('.chat-footer');
            if (sidebarMenu || chatFooter) {
                sidebarMenu.style.display = 'block';
                var sidebarMenuHeight = sidebarMenu.getBoundingClientRect().height;
                chatFooter.style.marginBottom = sidebarMenuHeight + 'px';
            }
            `;

            this.setState(
                {
                    TABAR_HEIGHT: TABAR_HEIGHT,
                    keyboardHeight: 0
                },
                () => {
                    // Inject JavaScript để ẩn sidebar-menu
                    this.refWeb.injectJavaScript(ShowSidebarMenu);
                }
            );
        });
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    handleMessage = (event) => {
        let data = null;
        try {
            data = JSON.parse(event.nativeEvent.data);
        } catch (error) {
            data = event.nativeEvent.data;
        }

        if (data) {
            let uriFile = '';
            if (data.Type === 'E_DOWNLOAD' && data.Data?.uri) {
                uriFile = data.Data.uri;
                ManageFileSevice.ActualDownloadMulti(uriFile);
            } else if (data.Type === 'E_FILE' && data.Data?.uri) {
                uriFile = data.Data.uri;
                ManageFileSevice.ReviewFile(uriFile);
            }
        }
    };

    //     Mở rộng giao diện Window để bao gồm ReactNativeWebView:
    // Tạo một tệp .d.ts (declaration file) trong dự án của bạn, ví dụ: react-native-webview.d.ts.
    // Thêm khai báo vào tệp .d.ts:
    // Trong tệp react-native-webview.d.ts, khai báo thuộc tính ReactNativeWebView cho đối tượng window như sau:
    // typescript
    // Copy code
    // interface Window {
    //   ReactNativeWebView: {
    //     postMessage: (message: string) => void;
    //   };
    // }

    render() {
        const { chatEndpointApi, keyboardHeight } = this.state;
        const dataVnrStorage = getDataVnrStorage(),
            { currentUser } = dataVnrStorage;
        const injected = `
            const meta = document.createElement('meta');
                meta.setAttribute('content', 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no');
                meta.setAttribute('name', 'viewport');
                document.head.appendChild(meta);
                localStorage.setItem('isApp', JSON.stringify(true))
                localStorage.setItem('primaryColor', '${Colors.primary}')
                localStorage.setItem('accessTokenMobile' , '${currentUser?.headers?.tokenportalapp}')
                    
            // Thêm CSS responsive vào trang web
            const style = document.createElement('style');
            style.textContent = \`
                @media screen and (max-width: 991.98px) {

                    .sidebar-body {
                        padding-bottom: 0!important;
                    }

                    .user-list {
                        padding-bottom: 60px;
                    }

                    .chat .chat-header .chat-options {
                        margin-top: 0;
                        margin-left: 0;
                    }

                    .page-header {
                        padding: 0;
                        border: none;
                        margin-bottom: 0;
                    }

                    .smile {
                        display: none !important;
                    }

                    .chat .chat-header {
                        margin-top: 0;
                        padding: 5px 10px 5px;
                    }
                }
            \`;
            document.head.appendChild(style);                 
        `;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <VnrBalloonHome />
                <SafeAreaConsumer>
                    {(insets) => {
                        let is = keyboardHeight - insets.bottom;
                        return (
                            <View
                                style={[
                                    styles.container,
                                    {
                                        paddingBottom: insets.bottom
                                    }
                                ]}
                            >
                                <WebView
                                    ref={(ref) => (this.refWeb = ref)}
                                    // eslint-disable-next-line react-native/no-inline-styles
                                    style={[
                                        styles.styWebView,
                                        // eslint-disable-next-line react-native/no-inline-styles
                                        {
                                            marginBottom: is && is > 0 && Platform.OS === 'ios' ? is : 0
                                        }
                                    ]}
                                    cacheEnabled={false}
                                    source={{
                                        uri: chatEndpointApi
                                    }}
                                    incognito={true}
                                    startInLoadingState={true}
                                    javaScriptEnabled={true}
                                    automaticallyAdjustsScrollIndicatorInsets={true}
                                    contentInsetAdjustmentBehavior="never"
                                    scrollEnabled={false}
                                    onLoadEnd={(syntheticEvent) => {
                                        const { nativeEvent } = syntheticEvent;
                                        this.canGoback = nativeEvent.canGoBack;
                                    }}
                                    hideKeyboardAccessoryView={true} //hide done<> keyboard ios
                                    injectedJavaScript={injected}
                                    onMessage={this.handleMessage}
                                    renderLoading={() => (
                                        <View style={styles.loadingSty}>
                                            <VnrLoading size={'large'} isVisible={true} />
                                        </View>
                                    )}
                                    onError={() => {
                                        DrawerServices.navigate('ErrorScreen', {
                                            ErrorDisplay: 'Thiêu Prop keyDataLocal'
                                        });
                                    }}
                                />
                            </View>
                        );
                    }}
                </SafeAreaConsumer>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styWebView: {
        // flex: 1
    },
    container: {
        flex: 1
    },
    loadingSty: {
        position: 'absolute',
        width: Size.deviceWidth,
        height: Size.deviceheight - Size.headerHeight,
        justifyContent: 'center',
        alignItems: 'center'
    }
});

export default MessageChatBot;
