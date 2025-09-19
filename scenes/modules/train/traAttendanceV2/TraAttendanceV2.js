import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, Colors, Size, CustomStyleSheet } from '../../../../constants/styleConfig';
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
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import Modal from 'react-native-modal';
import VnrText from '../../../../components/VnrText/VnrText';

const SCREEN_WIDTH = Size.deviceWidth;
class TraAttendanceV2 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            codeQR: null,
            configContrainInOut: null,

            dataClass: null
        };
        this.scanner = null;
    }

    validateParams = (text) => {
        const regexExp = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/gi;
        return regexExp.test(text);
    };

    submitTam = (isClass, type) => {
        if (isClass && isClass !== '') {
            if (!this.validateParams(isClass)) {
                ToasterSevice.showError('HRM_Error_DataInvalid', 4000, 'TOP');
                this.reloadScan();
                return;
            }

            VnrLoadingSevices.show();

            HttpService.Post('[URI_HR]/Tra_GetData/SubmitTAMScanLogByQRCode', {
                classID: isClass,
                profileID: dataVnrStorage.currentUser.info.ProfileID,
                type: type
            }).then((res) => {
                VnrLoadingSevices.hide();
                try {
                    if (res && res.split('|')[0] == EnumName.E_Success) {
                        let value = res.split('|');
                        if (type == EnumName.E_OUT && value[1] && value[2]) {
                            AlertSevice.alert({
                                iconType: EnumIcon.E_INFO,
                                title: 'HRM_Tra_Class_Attendace_Success',
                                message: 'HRM_AppPortal_TraAttendanceV2_Confirm_Survey',
                                textRightButton: 'HRM_Common_Continue',
                                textLeftButton: 'HRM_Common_Close',
                                onConfirm: () => {
                                    DrawerServices.navigate('HreSurveyEmployeeViewDetail', {
                                        dataId: value[1],
                                        classId: value[2],
                                        isSurveyTraining: true
                                    });
                                }
                            });
                        } else this.showMessage(EnumName.E_Success, 'HRM_Tra_Class_Attendace_Success');
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

    onSuccessQrScanner = (e) => {
        const { configContrainInOut } = this.state;

        if (configContrainInOut) {
            let idClass = e.data;
            VnrLoadingSevices.show();
            // 0164709: [APP_Hotfix PMC_v8.10.32.01.12]Thêm popup gồm các thông tin của lớp học và xác định được giờ quẹt thẻ của học viên
            HttpService.Post('[URI_HR]/Tra_GetData/RegisterTraineeByClassID', {
                classID: idClass
            }).then((resData) => {
                VnrLoadingSevices.hide();
                if (resData) {
                    this.setState({
                        dataClass: {
                            ...resData,
                            classID: idClass
                        }
                    });
                }
            });

            // AlertSevice.alert({
            //     iconType: EnumIcon.info,
            //     title: 'HRM_AppPortal_TraAttendanceV2_Confirm_InOut',
            //     textLeftButton: 'E_IN',
            //     textRightButton: 'E_OUT',
            //     onCancel: () => { this.submitTam(idClass, EnumName.E_IN); },
            //     onConfirm: () => {
            //         this.submitTam(idClass, EnumName.E_OUT);
            //     }
            // })
        } else {
            let idClass = e.data;
            this.submitTam(idClass, null);
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

    componentDidMount() {
        HttpService.Get('[URI_HR]/Tra_GetData/GetConfigSelectInOutTypeWhenScaningQRCode').then((config) => {
            this.setState({
                configContrainInOut: config ? config : false
            });
        });
    }

    render() {
        const { configContrainInOut, dataClass } = this.state;
        const { BackgroundLogin } = styles;
        return (
            <SafeAreaView style={styles.stySafeAreaView} forceInset={{ top: 'never', bottom: 'always' }}>
                {configContrainInOut != null ? (
                    <KeyboardAwareScrollView
                        contentContainerStyle={styles.styAwareView}
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

                                            <View style={styles.styViewOverLay}>
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
                                            <View style={styles.bottomOverlay} />
                                        </View>
                                    }
                                />
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                ) : (
                    <VnrLoading size="large" isVisible={true} />
                )}

                {dataClass !== null && (
                    <Modal
                        animationIn="fadeIn"
                        animationOut="fadeOut"
                        isVisible={true}
                        onBackdropPress={() => this.backDropOnPress()}
                        style={[stylesAlert.modal, styles.styModalAlert]}
                    >
                        <View style={[stylesAlert.contentToaster]}>
                            <Image
                                style={stylesAlert.styImageTeacher}
                                source={require('../../../../assets/images/traAttendance.png')}
                            />
                            <View style={stylesAlert.topAlert}>
                                <View style={stylesAlert.itemTopAlert}>
                                    <VnrText
                                        style={[styleSheets.lable, stylesAlert.itemTopAlert_title__text]}
                                        i18nKey={'HRM_Tra_Class_Tab_TraCourseInfo'}
                                    />
                                </View>

                                <View style={stylesAlert.itemTopAlert}>
                                    {dataClass.ClassName != null && (
                                        <Text style={[styleSheets.text, stylesAlert.itemTopAlert_message__text]}>
                                            {dataClass.ClassName}
                                        </Text>
                                    )}

                                    {dataClass.ScheduleTimeStart != null && (
                                        <Text
                                            style={[
                                                styleSheets.text,
                                                stylesAlert.itemTopAlert_message__text,
                                                stylesAlert.itemTopAlertTime
                                            ]}
                                        >
                                            {dataClass.ScheduleTimeStart}
                                        </Text>
                                    )}

                                    {dataClass.TrainerName != null && (
                                        <Text
                                            style={[
                                                styleSheets.text,
                                                stylesAlert.itemTopAlert_message__text,
                                                stylesAlert.itemTopAlertSubTile
                                            ]}
                                        >
                                            {dataClass.TrainerName}
                                        </Text>
                                    )}

                                    {dataClass.TrainingMethodName != null && (
                                        <Text
                                            style={[
                                                styleSheets.text,
                                                stylesAlert.itemTopAlert_message__text,
                                                stylesAlert.itemTopAlertSubTile
                                            ]}
                                        >
                                            {dataClass.TrainingMethodName}
                                        </Text>
                                    )}
                                </View>
                            </View>

                            <View style={stylesAlert.buttomAlert}>
                                <View style={stylesAlert.contentButton}>
                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({ dataClass: null });
                                            this.submitTam(dataClass.classID, EnumName.E_IN);
                                        }}
                                        style={stylesAlert.bnt_Ok}
                                    >
                                        <VnrText
                                            style={[styleSheets.lable, stylesAlert.bnt_Ok__text]}
                                            i18nKey={'E_IN'}
                                        />
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => {
                                            this.setState({ dataClass: null });
                                            this.submitTam(dataClass.classID, EnumName.E_OUT);
                                        }}
                                        style={stylesAlert.bnt_Ok}
                                    >
                                        <VnrText
                                            style={[styleSheets.lable, stylesAlert.bnt_Ok__text]}
                                            i18nKey={'E_OUT'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View>
                    </Modal>
                )}

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
    styModalAlert: {
        minHeight: 200,
        //height: 'auto',
        top: Size.deviceheight / 2 - 200
    },
    styViewOverLay: { flexDirection: 'row' },
    styCameraView: { width: Size.deviceWidth, height: '100%', justifyContent: 'center', alignItems: 'center' },
    styAwareView: { flexGrow: 1, maxHeight: Size.deviceheight },
    stySafeAreaView: { flex: 1, backgroundColor: Colors.white },
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

const stylesAlert = StyleSheet.create({
    modal: {
        backgroundColor: Colors.white,
        position: 'absolute',
        maxWidth: 400,
        width: Size.deviceWidth * 0.8,
        marginHorizontal:
            Size.deviceWidth * 0.8 >= 400
                ? (Size.deviceWidth - 400) / 2
                : (Size.deviceWidth - Size.deviceWidth * 0.8) / 2,
        borderRadius: 8,
        borderColor: Colors.gray_5,
        borderWidth: 0.5
    },
    contentButton: {
        flex: 1,
        flexDirection: 'row'
        // paddingVertical: styleSheets.p_10,
    },
    contentToaster: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'flex-end',
        position: 'relative'

        // paddingVertical: 14
        // paddingTop: 55,
    },
    styImageTeacher: {
        width: '100%',
        height: 80,
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8
    },
    topAlert: {
        width: '100%',
        minHeight: '30%',
        flex: 1,
        flexDirection: 'column',
        paddingHorizontal: styleSheets.p_10,
        // paddingTop: 5,k
        paddingTop: 18,
        paddingBottom: 10
    },
    itemTopAlert: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 8,
        paddingHorizontal: 5
    },
    buttomAlert: {
        // width: '100%',
        // height: '20%',
        flex: 1,
        justifyContent: 'center',
        borderTopColor: Colors.gray_5,
        borderTopWidth: 0.5,
        paddingVertical: 3
        // paddingHorizontal: styleSheets.p_10,
    },
    bnt_Ok: {
        minHeight: 44,
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    bnt_Ok__text: {
        fontWeight: '600',
        fontSize: Size.text + 2
    },
    itemTopAlert_title__text: {
        textAlign: 'center',
        fontSize: Size.text + 2,
        fontWeight: '600'
    },
    itemTopAlert_message__text: {
        textAlign: 'center',
        fontSize: Size.text
    },
    itemTopAlertTime: {
        color: Colors.primary,
        fontWeight: '600'
    },
    itemTopAlertSubTile: {
        color: Colors.gray_8
    }
});

export default TraAttendanceV2;
