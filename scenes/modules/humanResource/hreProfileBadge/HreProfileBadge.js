import React, { Component } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { CustomStyleSheet, styleSheets } from '../../../../constants/styleConfig';
import { Colors, Size, styleSafeAreaView } from '../../../../constants/styleConfig';
import { IconFullScreen, IconFullScreenExit } from '../../../../constants/Icons';
import { SafeAreaView } from 'react-navigation';
import DrawerServices from '../../../../utils/DrawerServices';
import HttpService from '../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import { WebView } from 'react-native-webview';

export default class HreProfileBadge extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFullScreen: false,
            isVertical: false,
            htmlSource: null
        };
    }

    handlesetSizeCard() {
        this.setState(
            prevState => ({
                isFullScreen: !prevState.isFullScreen,
                isVertical: !prevState.isVertical
            }),
            () => {
                this.getData();
            }
        );
    }

    componentDidMount() {
        this.getData();
    }

    shouldComponentUpdate(nextProps, nextState) {
        // Kiểm tra nếu giá trị của isFullScreen hoặc isVertical đã thay đổi
        if (
            this.state.isFullScreen !== nextState.isFullScreen ||
            this.state.isVertical !== nextState.isVertical ||
            this.state.htmlSource !== nextState.htmlSource
        ) {
            return true; // Cho phép component cập nhật
        }
        return false; // Không cần cập nhật component
    }

    getData = () => {
        try {
            const profileID = dataVnrStorage.currentUser.info.ProfileID; // ProfileID của bạn
            let { isVertical } = this.state;
            // Tạo một object chứa các tham số truyền vào
            // const params = {
            //     ProfileID: profileID
            // };

            // // Kiểm tra nếu isVertical có giá trị thì thêm nó vào object params
            // if (isVertical) {
            //     params.isVertical = isVertical;
            // }
            // Gửi yêu cầu GET với các tham số đã xây dựng
            HttpService.Get(
                `[URI_HR]/EmployeeFeatures/RenderHtmlProfileCard?ProfileID=${profileID}${isVertical ? '&isVertical=true' : ''
                }`
            )
                .then(res => {
                    this.setState({ htmlSource: res });
                })
                .catch(() => {
                    //
                });
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', {
                ErrorDisplay: 'Thiêu Prop keyDataLocal'
            });
        }
    };

    render() {
        const { isFullScreen, htmlSource, isVertical } = this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container,
                    {
                        ...CustomStyleSheet.backgroundColor(Colors.gray_3),
                        ...CustomStyleSheet.justifyContent('center')
                    }]}>
                    {htmlSource !== null ? (
                        <View
                            style={
                                !isVertical
                                    ? {
                                        height: Size.deviceWidth * 0.55
                                    }
                                    : {
                                        height: Size.deviceheight - Size.headerHeight
                                    }
                            }
                        >
                            <WebView
                                style={styles.webWiew}
                                javaScriptEnabled={true}
                                ref={refWebView => (this.refWebView = refWebView)}
                                source={{
                                    html: htmlSource
                                }}
                                // startInLoadingState={true}
                                renderLoading={() => (
                                    <View
                                        style={styles.renderLoading}
                                    >
                                        {/* <VnrLoading size={"large"} /> */}
                                    </View>
                                )}
                            />
                        </View>
                    ) : (
                        <VnrLoading size={'large'} />
                    )}

                    <View style={styles.styViewBtnFullScreen}>
                        <TouchableOpacity style={styles.styBtnFullScreen} onPress={() => this.handlesetSizeCard()}>
                            <View>
                                {isFullScreen ? (
                                    <IconFullScreenExit color={Colors.gray_10} size={Size.iconSizeHeader + 4} />
                                ) : (
                                    <IconFullScreen color={Colors.gray_10} size={Size.iconSizeHeader + 4} />
                                )}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </SafeAreaView>
        );
    }
}

const HIGHT_BTN = Size.deviceWidth >= 1024 ? 60 : Size.deviceWidth * 0.15;

const styles = StyleSheet.create({
    styViewBtnFullScreen: {
        position: 'absolute',
        bottom: Size.defineSpace * 3,
        right: Size.defineSpace,
        alignItems: 'flex-end'
    },
    styBtnFullScreen: {
        width: HIGHT_BTN,
        height: HIGHT_BTN,
        borderRadius: HIGHT_BTN / 2,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
    renderLoading: {
        position: 'absolute',
        width: Size.deviceWidth,
        height: Size.deviceheight - Size.headerHeight,
        justifyContent: 'center',
        alignItems: 'center'
    },
    webWiew: {
        flex: 1,
        width: Size.deviceWidth,
        height: Size.deviceheight - Size.headerHeight
    }
});
