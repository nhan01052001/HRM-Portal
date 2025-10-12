import React from 'react';
import { View, Text, TouchableOpacity, Image, AppState, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, Colors, Size, CustomStyleSheet } from '../../constants/styleConfig';
import { VnrLoadingSevices } from '../../components/VnrLoading/VnrLoadingPages';
import VnrFunction from '../../utils/Vnr_Function';
import { translate } from '../../i18n/translate';
import DrawerServices from '../../utils/DrawerServices';
import codePush from 'react-native-code-push';
import { resetTaskRunning } from '../../factories/BackGroundTask';
import { VnrBalloonService } from '../VnrBalloon/VnrBalloon';

export default class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            hasError: !VnrFunction.CheckIsNullOrEmpty(props.error) ? true : false,
            ErrorDisplay: !VnrFunction.CheckIsNullOrEmpty(props.error) ? props.error : '',
            StatusError: null,
            appState: AppState.currentState
        };
    }

    componentDidCatch(error) {
        VnrLoadingSevices.hide();
        this.updateLog(error);
    }

    updateLog = error => {
        let status = error?.response?.status;

        this.setState({
            hasError: !VnrFunction.CheckIsNullOrEmpty(error) ? true : false,
            ErrorDisplay: !VnrFunction.CheckIsNullOrEmpty(error) ? JSON.stringify(error) : '',
            StatusError: error?.response?.status,
            isUpbuild: status && status == 503 ? true : false
        });
    };

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    componentDidMount() {
        AppState.addEventListener('change', this._handleAppStateChange);
        this.updateLog(this.props.error);
    }

    _handleAppStateChange = nextAppState => {
        if (nextAppState === 'background') {
            // console.log("App is in Background Mode.")
        }
        if (nextAppState === 'active') {
            // lỗi 503 server upbuild, khi mở lại App tự quay lại trang chủ
            const { ErrorDisplay, isUpbuild } = this.state;
            if (ErrorDisplay && isUpbuild) DrawerServices.navigate('Permission');
        }
    };

    reloadApp = () => {
        const { StatusError } = this.state;

        // Chống spam API
        resetTaskRunning();

        if (StatusError) DrawerServices.navigate('Permission');
        else codePush.restartApp();
    };

    render() {
        const { ErrorDisplay, StatusError, isUpbuild } = this.state;

        const Img = isUpbuild
            ? require('../../assets/images/Error_503.png')
            : require('../../assets/images/Error_404.png');
        return this.state.hasError ? (
            <SafeAreaView style={CustomStyleSheet.flex(1)}>
                {ErrorDisplay && (
                    <SafeAreaView style={CustomStyleSheet.flex(1)}>
                        <View style={[styleSheets.container, styles.styContent]}>
                            <Image source={Img} style={styles.styImg} />

                            {StatusError && !isUpbuild && (
                                <Text style={styleSheets.headerTitleStyle}>{StatusError}</Text>
                            )}

                            {isUpbuild ? (
                                // thông báo upbuild Main
                                <Text style={[styleSheets.headerTitleStyle, styles.styTextTitle]}>
                                    {`${
                                        translate('HRM_Mesage_error_503') == 'HRM_Mesage_error_503'
                                            ? 'Hệ thống đang nâng câp phiên bản main, bạn có thể quay lại sau 20 phút nữa.'
                                            : translate('HRM_Mesage_error_503')
                                    } 
                        `}
                                </Text>
                            ) : (
                                // thông báo Lỗi khác trên App
                                <Text style={[styleSheets.lable, styles.styLable]}>
                                    {`${
                                        translate('HRM_Mesage_error_Boundary') == 'HRM_Mesage_error_Boundary'
                                            ? 'Xin lỗi, tính năng này đang bị lỗi. Vui lòng chọn [Trở lại trang chủ] hoặc [Quét mã QR] để tiếp tục sử dụng'
                                            : translate('HRM_Mesage_error_Boundary')
                                    } 
                        `}
                                </Text>
                            )}

                            {!isUpbuild && (
                                <View style={styles.styViewBtn}>
                                    <TouchableOpacity
                                        style={styles.styActionBtn}
                                        onPress={() => {
                                            VnrBalloonService.takeScreenShot({
                                                ErrorDisplay,
                                                StatusError,
                                                ScreenName: DrawerServices.getBeforeScreen()
                                            });
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styleSheets.lable,
                                                {
                                                    color: Colors.white,
                                                    fontSize: Size.text + 1
                                                }
                                            ]}
                                        >
                                            {translate('HRM_Common_SendFeedback')}
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        accessibilityLabel={'ERROR_BACK_HOME'}
                                        style={styles.stybtnConfirm}
                                        onPress={() => this.reloadApp()}
                                    >
                                        <Text
                                            style={[
                                                styleSheets.text,
                                                {
                                                    color: Colors.gray_8,
                                                    fontSize: Size.text - 1
                                                }
                                            ]}
                                        >
                                            {translate('HRM_PortalApp_Comming_Home') == 'HRM_PortalApp_Comming_Home'
                                                ? 'Trở lại trang chủ'
                                                : translate('HRM_PortalApp_Comming_Home')}
                                        </Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        accessibilityLabel={'ERROR_SCAN'}
                                        style={styles.stybtnConfirm}
                                        onPress={() => {
                                            DrawerServices.navigate('QrScanner', { isGoBackHome: true });
                                        }}
                                    >
                                        <Text
                                            style={[
                                                styleSheets.text,
                                                {
                                                    color: Colors.gray_8,
                                                    fontSize: Size.text - 1
                                                }
                                            ]}
                                        >
                                            {translate('Permission_ScanQrCode') == 'Permission_ScanQrCode'
                                                ? 'Quét mã QR'
                                                : translate('Permission_ScanQrCode')}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            )}
                        </View>
                    </SafeAreaView>
                )}
            </SafeAreaView>
        ) : (
            this.props.children
        );
    }
}

const styles = StyleSheet.create({
    styContent: { justifyContent: 'center', alignItems: 'center', paddingHorizontal: Size.defineSpace },
    styImg: {
        width: Size.deviceWidth - 160,
        height: Size.deviceWidth - 120,
        maxWidth: 254,
        maxHeight: 294,
        marginBottom: 30
    },
    styTextTitle: {
        textAlign: 'center',
        color: Colors.primary
    },
    styLable: {
        fontSize: Size.text,
        color: Colors.primary,
        textAlign: 'center',
        marginHorizontal: 20,
        marginTop: Size.defineSpace
    },
    styViewBtn: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    styActionBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
        width: Size.deviceWidth - 170,
        height: 40,
        maxWidth: 230,
        marginBottom: Size.defineSpace
    },
    stybtnConfirm: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
        borderRadius: 5,
        marginVertical: Size.defineSpace,
        marginLeft: Size.defineSpace
    }
});
