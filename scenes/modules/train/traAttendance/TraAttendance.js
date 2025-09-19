import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Colors, Size, CustomStyleSheet } from '../../../../constants/styleConfig';
import { IconBack } from '../../../../constants/Icons';
import HttpService from '../../../../utils/HttpService';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { VnrLoadingSevices } from '../../../../components/VnrLoading/VnrLoadingPages';
import { ToasterSevice } from '../../../../components/Toaster/Toaster';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { EnumIcon, EnumName } from '../../../../assets/constant';
import DrawerServices from '../../../../utils/DrawerServices';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import { AlertSevice } from '../../../../components/Alert/Alert';

const SCREEN_WIDTH = Size.deviceWidth;
class TraAttendace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            codeQR: null
        };
        this.scanner = null;
    }

    validateParams = (text) => {
        const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
        return regexExp.test(text);
    };

    onSuccessQrScanner = (e) => {
        let idCode = e.data;
        if (idCode && idCode !== '') {
            if (!this.validateParams(idCode)) {
                ToasterSevice.showError('HRM_Error_DataInvalid', 4000, 'TOP');
                this.reloadScan();
                return;
            }

            VnrLoadingSevices.show();

            HttpService.Post('[URI_HR]/Tra_GetData/SubmitAttendanceDetail', {
                classID: idCode,
                profileID: dataVnrStorage.currentUser.info.ProfileID
            }).then((res) => {
                VnrLoadingSevices.hide();
                try {
                    if (res && res == EnumName.E_Success) {
                        this.showMessage(EnumName.E_Success, 'HRM_Tra_Class_Attendace_Success');
                    } else if (res && typeof res == 'string') {
                        this.showMessage(null, res);
                    }
                } catch (error) {
                    this.showMessage(null, 'HRM_Error_DataInvalid');
                }
            });
        } else {
            this.showMessage(null, 'HRM_Error_DataInvalid');
        }
    };

    showMessage = (type, message) => {
        if (type == EnumName.E_Success) {
            AlertSevice.alert({
                iconType: EnumIcon.E_APPROVE,
                title: message,
                textLeftButton: 'HRM_Logout',
                textRightButton: 'HRM_Common_Continue',
                onCancel: () => {
                    DrawerServices.goBack();
                },
                onConfirm: () => {
                    this.reloadScan();
                }
            });
        } else {
            AlertSevice.alert({
                iconType: EnumIcon.E_REJECT,
                title: message,
                textLeftButton: 'HRM_Logout',
                textRightButton: 'HRM_Common_Continue',
                onCancel: () => {
                    DrawerServices.goBack();
                },
                onConfirm: () => {
                    this.reloadScan();
                }
            });
        }
    };

    reloadScan = () => {
        setTimeout(() => {
            this.scanner && this.scanner.reactivate && this.scanner.reactivate();
        }, 500);
    };

    makeSlideOutTranslation(translationType, fromValue) {
        return {
            from: {
                [translationType]: SCREEN_WIDTH * -0.1
            },
            to: {
                [translationType]: fromValue
            }
        };
    }

    render() {
        const { BackgroundLogin } = styles;
        return (
            <SafeAreaView style={styles.stySafeAreaViewExtend} forceInset={{ top: 'never', bottom: 'always' }}>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.styKeyBoardAware}
                    enableOnAndroid={false}
                    extraScrollHeight={20}
                >
                    <View style={BackgroundLogin}>
                        <View style={CustomStyleSheet.flex(1)}>
                            <QRCodeScanner
                                showMarker
                                ref={(node) => {
                                    this.scanner = node;
                                }}
                                onRead={(e) => this.onSuccessQrScanner(e)}
                                cameraStyle={styles.styCameraView}
                                customMarker={
                                    <View style={styles.rectangleContainer}>
                                        <View style={styles.topOverlay} />

                                        <View style={styles.styOverlayExtend}>
                                            <View style={styles.leftAndRightOverlay} />

                                            <View style={styles.rectangle}>
                                                <Icon
                                                    name="scan-helper"
                                                    size={SCREEN_WIDTH * 0.5}
                                                    color={Colors.primary}
                                                />
                                                <Animatable.View
                                                    style={styles.scanBar}
                                                    direction="alternate-reverse"
                                                    iterationCount="infinite"
                                                    duration={1700}
                                                    easing="linear"
                                                    animation={this.makeSlideOutTranslation(
                                                        'translateY',
                                                        SCREEN_WIDTH * -0.45
                                                    )}
                                                />
                                            </View>

                                            <View style={styles.leftAndRightOverlay} />
                                        </View>
                                        <View style={styles.bottomOverlay}>
                                            {/* <TouchableOpacity
                                                style={styles.styViewIconUpload}
                                                onPress={() => this.uploadQrImage()}
                                            >
                                                <IconQrcode size={Size.iconSizeHeader + 2} color={Colors.white} />
                                                <Text style={[styleSheets.text, styles.styTextImport]}>
                                                    {language == 'VN' ? `Chọn QR từ\n thư viện` : `Select QR\n from gallery`}
                                                </Text>

                                            </TouchableOpacity> */}
                                        </View>
                                    </View>
                                }
                            />
                        </View>
                    </View>
                </KeyboardAwareScrollView>
                <View style={styles.styViewGoback}>
                    <SafeAreaView style={styles.styViewSafeGoback}>
                        <TouchableOpacity style={styles.bntGoBack} onPress={() => DrawerServices.navigate('Home')}>
                            <IconBack size={Size.iconSizeHeader} color={Colors.primary} />
                        </TouchableOpacity>
                    </SafeAreaView>
                </View>
            </SafeAreaView>
        );
    }
}

// const HEIGHT_HEADER = 0;
const HEIGHT_HEADER = Platform.OS == 'ios' ? Size.headerHeight : Size.headerHeight - 25;
const HEIGHT_TEXT_QR = 80;
const HEIGHT_INPUT = 35 + 14; //marrginBottom
const HEIGHT_SCANNER = Size.deviceheight - (HEIGHT_HEADER + HEIGHT_TEXT_QR + HEIGHT_INPUT);

const overlayColor = 'rgba(0,0,0,0.5)'; // this gives us a black color with a 50% transparency
const rectDimensions = SCREEN_WIDTH * 0.65; // this is equivalent to 255 from a 393 device width
const scanBarWidth = SCREEN_WIDTH * 0.46; // this is equivalent to 180 from a 393 device width
const scanBarHeight = SCREEN_WIDTH * 0.0025; //this is equivalent to 1 from a 393 device width

const styles = StyleSheet.create({
    styOverlayExtend: { flexDirection: 'row' },
    styCameraView: { width: Size.deviceWidth, height: '100%', justifyContent: 'center', alignItems: 'center' },
    styKeyBoardAware: { flexGrow: 1, maxHeight: Size.deviceheight },
    stySafeAreaViewExtend: { flex: 1, backgroundColor: Colors.white },
    // eslint-disable-next-line react-native/no-unused-styles
    BackgroundLogin: {
        flex: 1,
        // height: '100%',
        backgroundColor: Colors.black
    },

    styViewGoback: {
        height: Size.deviceheight >= 1024 ? HEIGHT_HEADER + 20 : HEIGHT_HEADER,
        width: Size.deviceWidth,

        position: 'absolute',
        opacity: 1,
        top: 0,
        left: 0
        // backgroundColor: 'red'
    },
    styViewSafeGoback: {
        flex: 1,
        justifyContent: Platform.OS == 'ios' ? 'flex-end' : 'center',
        paddingLeft: Size.defineSpace
    },
    bntGoBack: {
        height: 35,
        width: 35,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.white,
        borderRadius: 7
    },
    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.transparent
    },
    rectangle: {
        height: rectDimensions,
        width: rectDimensions,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.transparent
    },
    topOverlay: {
        flex: 1,
        width: SCREEN_WIDTH,
        backgroundColor: overlayColor
    },

    bottomOverlay: {
        flex: 1,
        height: HEIGHT_SCANNER,
        width: SCREEN_WIDTH,
        backgroundColor: overlayColor,
        justifyContent: 'center',
        alignItems: 'center'
    },

    leftAndRightOverlay: {
        height: SCREEN_WIDTH * 0.65,
        width: SCREEN_WIDTH,
        backgroundColor: overlayColor
    },

    scanBar: {
        width: scanBarWidth,
        height: scanBarHeight,
        backgroundColor: Colors.primary
    }
});

export default TraAttendace;
