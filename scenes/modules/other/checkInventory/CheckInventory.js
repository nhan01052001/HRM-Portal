import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, Colors, Size, CustomStyleSheet } from '../../../../constants/styleConfig';
import { IconBack, IconQrcode } from '../../../../constants/Icons';
import HttpService from '../../../../utils/HttpService';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { VnrLoadingSevices } from '../../../../components/VnrLoading/VnrLoadingPages';
import { ToasterSevice } from '../../../../components/Toaster/Toaster';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ImagePicker from 'react-native-image-picker';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { EnumName } from '../../../../assets/constant';
import DrawerServices from '../../../../utils/DrawerServices';
import axios from 'axios';
import { dataVnrStorage } from '../../../../assets/auth/authentication';

const SCREEN_WIDTH = Size.deviceWidth;
class CheckInventory extends Component {
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
            // if (!this.validateParams(idCode)) {
            //     ToasterSevice.showError('HRM_Hre_CheckInventory_Error', 4000, 'TOP');
            //     this.reloadScan();
            //     return;
            // }

            VnrLoadingSevices.show();

            HttpService.Get('[URI_HR]/api/Hre_FacilityItem_GetByCode?code=' + idCode).then((res) => {
                VnrLoadingSevices.hide();
                this.reloadScan();
                try {
                    if (res && res.ActionStatus == EnumName.E_Success) {
                        DrawerServices.navigate('CheckInventoryViewDetail', {
                            dataItem: res
                        });
                    } else {
                        ToasterSevice.showError('HRM_Hre_CheckInventory_Error', 4000, 'TOP');
                    }
                } catch (error) {
                    ToasterSevice.showError('HRM_Hre_CheckInventory_Error', 4000, 'TOP');
                }
            });
        } else {
            this.reloadScan();
            ToasterSevice.showError('HRM_Hre_CheckInventory_Error', 4000, 'TOP');
        }
    };

    uploadQrImage = () => {
        ImagePicker.launchImageLibrary({ quality: 0.2 }, (response) => {
            if (response.didCancel) {
                // eslint-disable-next-line no-console
                console.log('User cancelled image picker');
            } else if (response.error) {
                // eslint-disable-next-line no-console
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                // eslint-disable-next-line no-console
                console.log('User tapped custom button: ', response.customButton);
            } else {
                try {
                    VnrLoadingSevices.show();
                    const dataBody = {
                        base64String: response.data,
                        contentType: null
                    };

                    axios
                        .post(HttpService.handelUrl('[URI_HR]/Fac_GetData/GetQRCodeInfo'), dataBody, {
                            headers: HttpService.generateHeader({}, null)
                        })
                        .then((res) => {
                            VnrLoadingSevices.hide();
                            this.reloadScan();
                            try {
                                if (res && res.ActionStatus == EnumName.E_Success) {
                                    DrawerServices.navigate('CheckInventoryViewDetail', {
                                        dataItem: {
                                            ...res,
                                            base64String: dataBody.base64String
                                        }
                                    });
                                } else {
                                    ToasterSevice.showError('HRM_Hre_CheckInventory_Error', 4000, 'TOP');
                                }
                            } catch (error) {
                                ToasterSevice.showError('HRM_Hre_CheckInventory_Error', 4000, 'TOP');
                            }
                        })
                        .catch(() => {
                            VnrLoadingSevices.hide();
                        });
                } catch (error) {
                    VnrLoadingSevices.hide();
                }
            }
        });
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
        const language = dataVnrStorage.languageApp;
        return (
            <SafeAreaView style={styles.stySafeAreaViewWrap} forceInset={{ top: 'never', bottom: 'always' }}>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.styKeyboardAwareContainer}
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
                                cameraStyle={styles.styCameraQRcode}
                                customMarker={
                                    <View style={styles.rectangleContainer}>
                                        <View style={styles.topOverlay} />

                                        <View style={styles.styViewCustomMarker}>
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
                                            <TouchableOpacity
                                                style={styles.styViewIconUpload}
                                                onPress={() => this.uploadQrImage()}
                                            >
                                                <IconQrcode size={Size.iconSizeHeader + 2} color={Colors.white} />
                                                <Text style={[styleSheets.text, styles.styTextImport]}>
                                                    {language == 'VN'
                                                        ? 'Chọn QR từ\n thư viện'
                                                        : 'Select QR\n from gallery'}
                                                </Text>
                                            </TouchableOpacity>
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
    styKeyboardAwareContainer: {
        flexGrow: 1,
        maxHeight: Size.deviceheight
    },
    stySafeAreaViewWrap: {
        flex: 1,
        backgroundColor: Colors.white
    },
    styViewCustomMarker: { flexDirection: 'row' },
    styCameraQRcode: {
        width: Size.deviceWidth,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    // eslint-disable-next-line react-native/no-unused-styles
    BackgroundLogin: {
        flex: 1,
        // height: '100%',
        backgroundColor: Colors.black
    },
    styViewIconUpload: {
        alignItems: 'center'
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
    styTextImport: {
        color: Colors.white,
        flexDirection: 'row',
        flexWrap: 'wrap',
        textAlign: 'center',
        fontSize: Size.text - 2,
        marginTop: 6
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

export default CheckInventory;
