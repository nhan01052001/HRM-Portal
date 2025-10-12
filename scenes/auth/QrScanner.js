/* eslint-disable react-native/no-color-literals */
import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    Image,
    Platform,
    TouchableWithoutFeedback,
    ScrollView
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Colors,
    Size,
    stylesModalPopupBottom,
    styleSafeAreaView,
    CustomStyleSheet
} from '../../constants/styleConfig';
import {
    IconBack,
    IconCancel,
    IconColse,
    IconListAlt,
    IconQrcode,
    IconRadioCheck,
    IconRadioUnCheck
} from '../../constants/Icons';
import Vnr_Function from '../../utils/Vnr_Function';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HttpService from '../../utils/HttpService';
import { connect } from 'react-redux';
import { dataVnrStorage, setdataVnrStorage } from '../../assets/auth/authentication';
import QRCodeScanner from 'react-native-qrcode-scanner';
import { VnrLoadingSevices } from '../../components/VnrLoading/VnrLoadingPages';
import languageReducer from '../../redux/i18n';
import VnrText from '../../components/VnrText/VnrText';
import VnrTextInput from '../../components/VnrTextInput/VnrTextInput';
import { ToasterSevice } from '../../components/Toaster/Toaster';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { translate } from '../../i18n/translate';
import { UpdateVersionApi } from '../../components/modalUpdateVersion/ModalUpdateVersion';
import ImagePicker from 'react-native-image-picker';
import * as Animatable from 'react-native-animatable';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import { EnumName } from '../../assets/constant';
import EmptyData from '../../components/EmptyData/EmptyData';
import DrawerServices from '../../utils/DrawerServices';
import { decode } from 'base-64';

const SCREEN_WIDTH = Size.deviceWidth;
class QrScanner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            codeQR: '',
            dataQRSave: {
                data: null,
                modalVisible: false
            }
        };
        this.scanner = null;
    }

    router = (roouterName) => {
        const { navigation } = this.props;
        navigation.navigate(roouterName);
    };

    setLanguage = async (language) => {
        dataVnrStorage.languageApp = language;
        await setdataVnrStorage(dataVnrStorage);
        this.props.setLanguage(language);
    };

    getDefaultLanguage = () => {
        VnrLoadingSevices.hide();
        try {
            let _lang = 'VN';
            this.setLanguage(_lang.toUpperCase());

            const { state } = this.props.navigation;
            if (state.params && state.params.setStateValidApi && typeof state.params.setStateValidApi === 'function') {
                state.params.setStateValidApi(true);
            }
            this.props.navigation.goBack();
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    uploadFile = async (data) => {
        VnrLoadingSevices.show();
        try {
            let dataFile = {
                uriPor: data.UriPor,
                uriSys: data.UriSys,
                uriHr: data.UriHR,
                uriMain: data.UriMain,
                uriCenter: data.UriCenter,
                uriIdentity: data.UriIdentity
            };

            if (
                !Vnr_Function.CheckIsNullOrEmpty(dataFile.uriPor) &&
                !Vnr_Function.CheckIsNullOrEmpty(dataFile.uriHr) &&
                !Vnr_Function.CheckIsNullOrEmpty(dataFile.uriSys) &&
                !Vnr_Function.CheckIsNullOrEmpty(dataFile.uriMain)
            ) {
                dataVnrStorage.apiConfig = { ...dataFile };
                dataVnrStorage.customerID = data.ID;
                dataVnrStorage.providerSso = null;

                // có cấu hình 2 link mới thì cho phép chạy giao diện mới
                if (data.UriCenter && data.UriIdentity) dataVnrStorage.isNewLayoutV3 = true;
                else dataVnrStorage.isNewLayoutV3 = false;

                await setdataVnrStorage(dataVnrStorage);
                this.getDefaultLanguage();

                this.addQrToList(data);
            } else {
                ToasterSevice.showError('ScanQrCode_invalid', 4000);
                VnrLoadingSevices.hide();
                this.props.navigation.goBack();
            }
        } catch (error) {
            ToasterSevice.showError('ScanQrCode_invalid', 4000);
            VnrLoadingSevices.hide();
            this.props.navigation.goBack();
        }
    };

    selectQr = (data) => {
        const { dataQRSave } = this.state;
        this.setState(
            {
                dataQRSave: {
                    ...dataQRSave,
                    modalVisible: false
                }
            },
            () => {
                this.onSuccessQrScanner(data.ID, true);
            }
        );
    };

    addQrToList = async (dataQr) => {
        let strListQr = await AsyncStorage.getItem('@DATA_SCANED_QR_LIST'),
            dataListQr = strListQr != null ? JSON.parse(strListQr) : null;

        if (dataListQr == null) {
            dataListQr = [
                {
                    ...dataQr,
                    isSelect: true
                }
            ];
        } else if (dataListQr && Array.isArray(dataListQr) && dataListQr.length > 0) {
            let findIndex = dataListQr.findIndex((item) => item.ID == dataQr.ID);

            if (findIndex > -1) {
                dataListQr = dataListQr.map((item) => {
                    if (item.ID == dataQr.ID) {
                        item = {
                            ...dataQr,
                            isSelect: true
                        };
                    } else {
                        item.isSelect = false;
                    }
                    return item;
                });
            } else {
                dataListQr = dataListQr.map((item) => {
                    item.isSelect = false;
                    return item;
                });

                dataListQr.push({
                    ...dataQr,
                    isSelect: true
                });
            }
        }

        if (dataListQr !== null) {
            await AsyncStorage.setItem('@DATA_SCANED_QR_LIST', JSON.stringify(dataListQr));
            if (UpdateVersionApi.checkVersion && typeof UpdateVersionApi.checkVersion == 'function') {
                UpdateVersionApi.checkVersion();
            }
        }
    };

    onSuccessQrScanner = (e, isInput) => {
        let qrCode = isInput ? e : e.data;
        if (qrCode && qrCode !== '') {
            if (qrCode.length <= 62) {
                VnrLoadingSevices.show();
                HttpService.Get('https://qr.vnresource.net/api/AppCustomer?QRCode=' + qrCode)
                    .then((res) => {
                        VnrLoadingSevices.hide();
                        try {
                            if (res && res.UriPor && res.UriHR && res.UriMain && res.UriSys && res.ID) {
                                this.uploadFile(res);
                            } else {
                                ToasterSevice.showError('HRM_Incorrect_QRCode', 4000, 'TOP');
                            }
                        } catch (error) {
                            ToasterSevice.showError('HRM_Incorrect_QRCode', 4000, 'TOP');
                        }
                    })
                    .catch(() => {
                        ToasterSevice.showError('HRM_Incorrect_QRCode', 4000, 'TOP');
                    });
            } else {
                VnrLoadingSevices.show();
                const testString = JSON.parse(decode(qrCode));
                if (testString) {
                    VnrLoadingSevices.hide();
                    if (
                        testString &&
                        testString.UriPor &&
                        testString.UriHR &&
                        testString.UriMain &&
                        testString.UriSys
                    ) {
                        this.uploadFile(testString);
                    } else {
                        ToasterSevice.showError('HRM_Incorrect_QRCode', 4000, 'TOP');
                    }
                } else {
                    ToasterSevice.showError('HRM_Incorrect_QRCode', 4000, 'TOP');
                }
            }
        } else {
            ToasterSevice.showError('HRM_Incorrect_QRCode', 4000, 'TOP');
        }
    };

    goBack = () => {
        const { navigation } = this.props,
            _params =
                this.props.navigation.state && this.props.navigation.state.params
                    ? this.props.navigation.state.params
                    : {},
            { isGoBackHome } = _params;

        if (isGoBackHome) {
            navigation.navigate('Permission');
        } else {
            navigation.goBack();
        }
    };

    uploadQrImage = () => {
        ImagePicker.launchImageLibrary({ quality: 0.2 }, (response) => {
            if (response.didCancel) {
                // console.log('User cancelled image picker');
            } else if (response.error) {
                // console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                // console.log('User tapped custom button: ', response.customButton);
            } else {
                VnrLoadingSevices.show();
                const dataBody = {
                    base64String: response.data,
                    contentType: null
                };

                HttpService.Post('https://qr.vnresource.net/api/AppCustomer/Post', dataBody)
                    .then((res) => {
                        VnrLoadingSevices.hide();
                        try {
                            if (res && res.UriPor && res.UriHR && res.UriMain && res.UriSys && res.ID) {
                                this.uploadFile(res);
                            } else {
                                ToasterSevice.showError('HRM_Incorrect_QRCode', 4000, 'TOP');
                            }
                        } catch (error) {
                            ToasterSevice.showError('HRM_Incorrect_QRCode', 4000, 'TOP');
                        }
                    })
                    .catch(() => {
                        VnrLoadingSevices.hide();
                        ToasterSevice.showError('HRM_Incorrect_QRCode', 4000, 'TOP');
                    });
            }
        });
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

    closeModalQR = () => {
        const { dataQRSave } = this.state;
        this.setState({
            dataQRSave: {
                ...dataQRSave,
                modalVisible: false
            }
        });
    };

    showListQrScaned = async () => {
        const { dataQRSave } = this.state;
        if (dataQRSave.data != null) {
            this.setState({
                dataQRSave: {
                    ...dataQRSave,
                    modalVisible: true
                }
            });
            return;
        }

        VnrLoadingSevices.show();
        const strListQr = await AsyncStorage.getItem('@DATA_SCANED_QR_LIST'),
            dataListQr = strListQr != null ? JSON.parse(strListQr) : null;

        VnrLoadingSevices.hide();
        if (dataListQr && Array.isArray(dataListQr) && dataListQr.length > 0) {
            this.setState({
                dataQRSave: {
                    data: dataListQr,
                    modalVisible: true
                }
            });
        } else {
            this.setState({
                dataQRSave: {
                    data: EnumName.E_EMPTYDATA,
                    modalVisible: true
                }
            });
        }
    };

    viewListItemQR = () => {
        const { dataQRSave } = this.state;
        if (dataQRSave.data === EnumName.E_EMPTYDATA) {
            return <EmptyData messageEmptyData={'HRM_Scanned_QR_list_EmptyData'} />;
        } else if (dataQRSave && dataQRSave.data && Array.isArray(dataQRSave.data) && dataQRSave.data.length > 0) {
            return (
                <ScrollView style={CustomStyleSheet.flex(1)}>
                    {dataQRSave.data.map((col, index) => {
                        let imageAvatar = { uri: `${col.UriMain}/Content/images/logo.png` };
                        return (
                            <TouchableOpacity
                                onPress={() => this.selectQr(col)}
                                style={[styles.styQrContent]}
                                key={index}
                            >
                                <View style={styles.leftContent}>
                                    <View style={styles.leftContentIconView}>
                                        <Image source={imageAvatar} style={styles.leftContentIcon} />
                                    </View>
                                </View>

                                <View style={styles.contentRight}>
                                    <Text style={[styleSheets.text]}>{col.CusName ? col.CusName : ''}</Text>
                                    <Text style={[styleSheets.text, styles.styLinkPor]}>
                                        {col.UriPor ? col.UriPor : ''}
                                    </Text>
                                </View>
                                {col.isSelect ? (
                                    <IconRadioCheck size={Size.iconSize} color={Colors.primary} />
                                ) : (
                                    <IconRadioUnCheck size={Size.iconSize} color={Colors.gray_7} />
                                )}
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>
            );
        }
    };

    render() {
        const { contentBottomQR, formSubmit, optionSubmit } = styles;
        const { language } = this.props;
        const { dataQRSave } = this.state;
        return (
            <SafeAreaView style={styles.styContentSafe} forceInset={{ top: 'never', bottom: 'always' }}>
                <KeyboardAwareScrollView
                    contentContainerStyle={styles.styScroll}
                    enableOnAndroid={false}
                    extraScrollHeight={20}
                >
                    <View style={styles.BackgroundLogin}>
                        <View style={CustomStyleSheet.flex(1)}>
                            <QRCodeScanner
                                showMarker
                                onRead={(e) => this.onSuccessQrScanner(e, false)}
                                cameraStyle={styles.styCamera}
                                customMarker={
                                    <View style={styles.rectangleContainer}>
                                        <View style={styles.topOverlay} />

                                        <View style={CustomStyleSheet.flexDirection('row')}>
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
                                                style={[styles.styViewIconUpload, styles.styViewIconSelectProject]}
                                                onPress={() => this.showListQrScaned()}
                                            >
                                                <IconListAlt size={Size.iconSizeHeader + 2} color={Colors.white} />
                                                <Text style={[styleSheets.text, styles.styTextImport]}>
                                                    {language == 'VN'
                                                        ? 'Danh sách QR \n đã quét'
                                                        : 'Scanned qr \n list'}
                                                </Text>
                                            </TouchableOpacity>

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

                            <View style={contentBottomQR}>
                                <VnrText
                                    style={[styleSheets.lable, styles.styTextScan]}
                                    i18nKey={'Permission_Move_Camera_ScanQrCode'}
                                />
                                <View style={optionSubmit}>
                                    <Text style={[styleSheets.lable, { color: Colors.primary }]}>_____ </Text>
                                    <VnrText
                                        style={[styleSheets.lable, { color: Colors.primary }]}
                                        i18nKey={'Permission_ScanQrCode_OrEnterCode'}
                                    />
                                    <Text style={[styleSheets.lable, { color: Colors.primary }]}> _____</Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={formSubmit}>
                        <VnrTextInput
                            placeholder={translate('HRM_Enter_QR')}
                            value={this.state.codeQR}
                            onChangeText={(text) => this.setState({ codeQR: text })}
                            onSubmitEditing={() => this.onSuccessQrScanner(this.state.codeQR, true)}
                            returnKeyType={'go'}
                        />
                    </View>
                </KeyboardAwareScrollView>

                {dataQRSave.modalVisible && (
                    <Modal
                        onBackButtonPress={() => this.closeModalQR()}
                        isVisible={true}
                        onBackdropPress={() => this.closeModalQR()}
                        customBackdrop={
                            <TouchableWithoutFeedback onPress={() => this.closeModalQR()}>
                                <View style={styles.styDrop} />
                            </TouchableWithoutFeedback>
                        }
                        style={CustomStyleSheet.margin(0)}
                    >
                        <View style={[stylesModalPopupBottom.viewModalTime, styles.styHeightModal]}>
                            <SafeAreaView {...styleSafeAreaView} style={stylesModalPopupBottom.safeRadius}>
                                <View style={styles.headerCloseModal}>
                                    <IconColse color={Colors.white} size={Size.iconSize} />
                                    <VnrText
                                        style={[styleSheets.lable, styles.styTitleHeader]}
                                        i18nKey={'HRM_Scanned_QR_list'}
                                    />
                                    <TouchableOpacity onPress={() => this.closeModalQR()}>
                                        <IconCancel color={Colors.black} size={Size.iconSize} />
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.styListQr}>{this.viewListItemQR()}</View>
                            </SafeAreaView>
                        </View>
                    </Modal>
                )}

                <View style={styles.styViewGoback}>
                    <SafeAreaView style={styles.styViewSafeGoback}>
                        <TouchableOpacity style={styles.bntGoBack} onPress={() => this.goBack()}>
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
    // eslint-disable-next-line react-native/no-unused-styles
    formSubmit: {
        flexDirection: 'row',
        // height: 50,
        paddingHorizontal: styleSheets.m_10,
        paddingVertical: Size.defineHalfSpace,
        backgroundColor: Colors.white,
        marginBottom: 14
    },
    // eslint-disable-next-line react-native/no-unused-styles
    optionSubmit: {
        flexDirection: 'row',
        marginTop: styleSheets.m_5
    },
    BackgroundLogin: {
        flex: 1,
        // height: '100%',
        backgroundColor: Colors.black
    },
    styViewIconUpload: {
        height: '100%',
        // backgroundColor : 'red',
        alignItems: 'center',
        justifyContent: 'center'
    },
    styViewIconSelectProject: {
        marginRight: Size.defineSpace * 2
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
    // eslint-disable-next-line react-native/no-unused-styles
    contentBottomQR: {
        width: Size.deviceWidth,
        alignItems: 'center',
        height: HEIGHT_TEXT_QR,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        paddingHorizontal: 10,
        paddingVertical: Size.defineHalfSpace
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
        backgroundColor: 'transparent'
    },

    rectangle: {
        height: rectDimensions,
        width: rectDimensions,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },

    topOverlay: {
        flex: 1,
        width: SCREEN_WIDTH,
        backgroundColor: overlayColor
    },

    bottomOverlay: {
        flex: 1,
        flexDirection: 'row',
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
    },

    // header modal
    styHeightModal: {
        height: Size.deviceheight * 0.7
    },
    styTitleHeader: {
        fontSize: Size.text + 2
    },
    headerCloseModal: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    styQrContent: {
        flex: 1,
        flexDirection: 'row',
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        backgroundColor: Colors.white,
        paddingVertical: Size.defineSpace,
        paddingRight: Size.defineHalfSpace,
        marginBottom: Size.defineSpace,
        marginHorizontal: Size.defineSpace,
        alignItems: 'center'
    },
    leftContent: {
        paddingHorizontal: Size.defineSpace
    },
    contentRight: {
        flex: 7.2,
        justifyContent: 'flex-start',
        paddingRight: Size.defineSpace
    },
    leftContentIconView: {
        position: 'relative',
        backgroundColor: Colors.gray_3,
        borderRadius: 20
    },
    leftContentIcon: {
        width: Size.deviceWidth * 0.2,
        height: Size.deviceWidth * 0.2,
        resizeMode: 'contain',
        maxWidth: 150,
        maxHeight: 190,
        borderRadius: 20
    },
    styLinkPor: {
        fontSize: Size.text - 2,
        color: Colors.gray_7,
        marginTop: 3
    },
    styListQr: {
        flex: 1,
        flexDirection: 'column'
    },
    styContentSafe: { flex: 1, backgroundColor: Colors.white },
    styScroll: { flexGrow: 1, maxHeight: Size.deviceheight },
    styCamera: {
        width: Size.deviceWidth,
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center'
    },
    styTextScan: { color: Colors.black, textAlign: 'center' },
    styDrop: {
        flex: 1,
        backgroundColor: Colors.black,
        opacity: 0.5
    }
});

const mapStateToProps = (state) => {
    return {
        language: state.languageReducer.language
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        setLanguage: (language) => {
            dispatch(languageReducer.actions.changeLanguage(language));
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(QrScanner);
