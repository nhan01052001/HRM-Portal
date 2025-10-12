/* eslint-disable no-console */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import {
    RNCamera
    //FaceDetector
} from 'react-native-camera'; // Import the necessary components
import { Colors, Size, styleSheets } from '../../constants/styleConfig';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import * as Animatable from 'react-native-animatable';
import { IconCheckCirlceo, IconPrev } from '../../constants/Icons';
import DrawerServices from '../../utils/DrawerServices';
import * as Progress from 'react-native-progress';
import VnrLoading from '../../components/VnrLoading/VnrLoading';
import { dataVnrStorage } from '../../assets/auth/authentication';
import { ToasterSevice } from '../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../components/VnrLoading/VnrLoadingPages';
import axios from 'axios';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
const SCREEN_WIDTH = Size.deviceWidth;

// Define the total number of photos you want to take
const TOTAL_PHOTOS = 17;

// Define the total time span in which you want to take the photos (in milliseconds)
const TOTAL_TIME = 10 * 1000; // 10 minutes

// Calculate the interval between each photo
const INTERVAL = TOTAL_TIME / TOTAL_PHOTOS;
const dataDefault = [
    {
        index: 0,
        lable: 'Chụp chính diện',
        uri: null
    },
    {
        index: 1,
        lable: 'Nghiêng sang trái',
        uri: null
    },
    {
        index: 2,
        lable: 'Nghiêng sang phải',
        uri: null
    },
    {
        index: 3,
        lable: 'Nhìn lên trên',
        uri: null
    },
    {
        index: 4,
        lable: 'Nhìn xuống dưới',
        uri: null
    }
];
class FaceScanSetting extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isStarted: false,
            isShowingSuccess: false,
            photos: [],
            txtError: ''
        };
        this.camera = null;
        this.isCapturing = false;
        // this.listPhotos = [];
    }

    onFaceDetected = () => {
        this.setState({ isFaceDetected: true });
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

    takePicture = async (camera) => {
        try {
            const { photos } = this.state;
            if (camera && camera.takePictureAsync) {
                const options = { quality: 0.1, base64: false };
                this.isCapturing = true;
                const data = await camera.takePictureAsync(options);

                const title = data.uri.split('/').pop().split('#')[0].split('?')[0];

                const file = {
                    uri: data.uri,
                    name: title,
                    type: 'image/jpeg',
                    fileSize: data.height * data.width * 4,
                    temp: true
                };
                // this.listPhotos.push(file);
                // const progress = (this.listPhotos.length / TOTAL_PHOTOS) * 100 / 100;
                // let indexItem = photos.findIndex(item => item.uri == null),
                //     itemfind = photos[indexItem];

                // photos[indexItem] = {
                //     ...itemfind,
                //     uri: data.uri,
                //     file: file
                // };

                photos.push({
                    uri: data.uri,
                    file: file
                });

                const progress = ((photos.length / TOTAL_PHOTOS) * 100) / 100;
                // const progress = ((itemfind.index + 1 / TOTAL_PHOTOS) * 100) / 100;
                this.isCapturing = false;
                this.setState({
                    photos: photos,
                    progress: progress,
                    txtError: ''
                });

                // Phát hiện khuôn mặt trên ảnh đã chụp
                // const faceDetectionOptions = {
                //     mode: FaceDetector.Constants.Mode.fast,
                //     detectLandmarks: FaceDetector.Constants.Landmarks.all,
                //     runClassifications: FaceDetector.Constants.Classifications.none,
                // };
                // const faces = await FaceDetector.detectFacesAsync(data.uri, faceDetectionOptions);
                // let indexItem = photos.findIndex(item => item.uri == null),
                //     itemfind = photos[indexItem];
                // if (this.validateFaceAngles(faces, itemfind.index)) {
                //     photos[indexItem] = {
                //         ...itemfind,
                //         uri: data.uri,
                //         file: file
                //     };

                //     const progress = (itemfind.index + 1 / TOTAL_PHOTOS) * 100 / 100;
                //     this.isCapturing = false;
                //     this.setState({
                //         photos: photos,
                //         progress: progress,
                //         txtError: ''
                //     });
                // }
                // else {
                //     // ToasterSevice.showWarning(itemfind.lable + ' không thành công')
                //     this.isCapturing = false;
                //     this.setState({
                //         txtError: itemfind.lable + ' không thành công'
                //     });
                // }
            }
        } catch (error) {
            console.log(error, 'error');
        }
    };

    startContinuousCapture = (camera) => {
        //this.takePicture(camera);
        const { photos } = this.state;
        this.intervalId = setInterval(() => {
            console.log('intervalId');
            // If we've taken the total number of photos, clear the interval
            if (photos.filter((item) => item.uri != null).length >= TOTAL_PHOTOS) {
                clearInterval(this.intervalId);
                this.saveAvatar();

                return;
            }

            // Otherwise, take a photo
            this.isCapturing == false && this.takePicture(camera);
            // Increment the counter
        }, INTERVAL);
    };

    started = (camera) => {
        this.setState(
            {
                isStarted: true
            },
            () => this.startContinuousCapture(camera)
        );
    };

    componentWillUnmount() {
        this.intervalId && clearInterval(this.intervalId);
    }

    saveAvatar = () => {
        const { photos } = this.state;

        if (photos && photos.length > 0) {
            VnrLoadingSevices.show();
            const formData = new FormData();

            photos.forEach((photo) => {
                formData.append('photos', photo.file);
            });

            const info = dataVnrStorage.currentUser.info,
                name = `${info.FullName}|${info.ImagePath}|${info.Email}|${info.ProfileID}`;

            formData.append('name', name);
            formData.append('store', '1');
            formData.append('collections', '');

            // const configs = {
            //     headers: {
            //         Accept: 'application/json',
            //         'Content-Type': 'multipart/form-data',
            //         'token': '6a556da33450471988b4d113efd75c4b',
            //     },
            // };

            axios
                .post('https://api.luxand.cloud/v2/person', formData, {
                    headers: {
                        token: 'e0c414c6d6874a199970bd55d4278759',
                        Accept: 'application/json',
                        'Content-Type': 'multipart/form-data'
                    },
                    maxContentLength: Infinity
                })
                .then((res) => {
                    VnrLoadingSevices.hide();
                    if (res?.status) {
                        if (res?.status == 'success') {
                            this.setState({ isShowingSuccess: true });
                            ToasterSevice.showSuccess('Thiết lập khuôn mặt thành công!');
                        } else if (res?.status == 'failure') {
                            this.resetScan();
                            ToasterSevice.showWarning('Không thể tìm thấy khuôn mặt trong ảnh đính kèm');
                        }
                    } else {
                        this.resetScan();
                        ToasterSevice.showWarning('Không chụp được ảnh, vui lòng thử lại!');
                    }
                });
        } else {
            ToasterSevice.showWarning('Không chụp được ảnh, vui lòng thử lại!');
        }
    };

    validateFaceAngles = (faces, indexface) => {
        if (faces && Array.isArray(faces) && faces.length > 0) {
            faces.forEach((face) => {
                // Kiểm tra các landmarks để xác định góc nhìn
                const landmarks = face.landmarks;
                const nose = landmarks['noseBase'];
                const leftEye = landmarks['leftEye'];
                const rightEye = landmarks['rightEye'];

                // Tính toán góc giữa mắt và mũi
                const angle = Math.atan2(rightEye.y - leftEye.y, rightEye.x - leftEye.x) * (180 / Math.PI);

                // Kiểm tra các điều kiện để xác định góc nhìn của khuôn mặt
                if (angle > -20 && angle < 20 && indexface == 0) {
                    console.log('Chụp chính diện khuôn mặt');
                    return true;
                } else if (angle <= -20 && indexface == 1) {
                    console.log('Nghiêng sang trái');
                    return true;
                } else if (angle >= 20 && indexface == 2) {
                    console.log('Nghiêng sang phải');
                    return true;
                }

                // Kiểm tra vị trí của mắt và mũi để xác định góc nhìn lên trên hoặc xuống dưới
                if (nose.y < leftEye.y && nose.y < rightEye.y && indexface == 3) {
                    console.log('Nhìn lên trên');
                    return true;
                } else if (nose.y > leftEye.y && nose.y > rightEye.y && indexface == 4) {
                    console.log('Nhìn xuống dưới');
                    return true;
                }

                return false;
            });
        } else {
            return false;
        }
    };

    resetScan = () => {
        this.setState({
            isStarted: false,
            isShowingSuccess: false,
            photos: [...dataDefault],
            progress: 0
        });
        this.listPhotos = [];
    };

    render() {
        const { isStarted, isShowingSuccess, progress, photos, txtError } = this.state;

        return (
            <View style={styles.container}>
                <RNCamera
                    key={'SCAN_FACE'}
                    captureAudio={false}
                    style={styles.preview}
                    type={RNCamera.Constants.Type.front}
                    // faceDetectionClassifications={RNCamera.Constants.FaceDetection.Classifications.all}
                    // faceDetectionLandmarks={RNCamera.Constants.FaceDetection.Landmarks.all}
                    // faceDetectionMode={RNCamera.Constants.FaceDetection.Mode.fast}
                    // flashMode={typeCamera}
                    androidCameraPermissionOptions={{
                        title: 'Permission to use camera',
                        message: 'We would like to use your camera for taking pictures in the GPS timekeeping screen',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel'
                    }}
                    androidRecordAudioPermissionOptions={{
                        title: 'Permission to use audio recording',
                        message: 'We need your permission to use your audio',
                        buttonPositive: 'Ok',
                        buttonNegative: 'Cancel'
                    }}
                >
                    {({ camera, status }) => {
                        if (status !== 'READY') {
                            return <VnrLoading size="small" color={Colors.primary} />;
                        } else {
                            return (
                                <SafeAreaConsumer>
                                    {(insets) => {
                                        const stylePadding = { paddingBottom: insets.bottom, paddingTop: insets.top };
                                        return (
                                            <View style={styles.viewAll}>
                                                {isShowingSuccess ? (
                                                    <View
                                                        style={[
                                                            styles.styFontSc,
                                                            stylePadding,
                                                            { backgroundColor: Colors.gray_9 }
                                                        ]}
                                                    >
                                                        <View style={styles.styheader}>
                                                            <TouchableOpacity
                                                                style={styles.bntGoBack}
                                                                onPress={() => DrawerServices.goBack()}
                                                            >
                                                                <IconPrev size={Size.iconSize} color={Colors.white} />
                                                            </TouchableOpacity>
                                                            <Text
                                                                style={[
                                                                    styleSheets.text,
                                                                    styles.header,
                                                                    { color: Colors.white }
                                                                ]}
                                                            >
                                                                Success
                                                            </Text>
                                                            <Text
                                                                style={[
                                                                    styleSheets.text,
                                                                    styles.subtitle,
                                                                    { color: Colors.white }
                                                                ]}
                                                            >
                                                                Thiết lập gương mặt thành công
                                                            </Text>
                                                        </View>

                                                        <View style={styles.rectangle}>
                                                            <IconCheckCirlceo
                                                                size={SCREEN_WIDTH * 0.5}
                                                                color={Colors.white}
                                                            />
                                                        </View>
                                                    </View>
                                                ) : (
                                                    <View
                                                        style={[
                                                            styles.styFontSc,
                                                            stylePadding,
                                                            !isStarted && {
                                                                backgroundColor: Colors.gray_3
                                                            }
                                                        ]}
                                                    >
                                                        <View style={styles.styheader}>
                                                            <TouchableOpacity
                                                                style={styles.bntGoBack}
                                                                onPress={() => DrawerServices.goBack()}
                                                            >
                                                                <IconPrev size={Size.iconSize} color={Colors.gray_10} />
                                                            </TouchableOpacity>
                                                            <Text style={[styleSheets.text, styles.header]}>
                                                                Thiết lập khuôn mặt
                                                            </Text>
                                                            <Text style={[styleSheets.text, styles.subtitle]}>
                                                                Vui lòng giữ gương mặt ở giữa khung hình, di chuyển
                                                                khuôn mặt để camera bắt được nhiều góc cạnh của gương
                                                                mặt
                                                            </Text>
                                                        </View>

                                                        <View style={styles.rectangle}>
                                                            <Icon
                                                                name="scan-helper"
                                                                size={SCREEN_WIDTH * 0.5}
                                                                color={Colors.gray_10}
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

                                                        {!isStarted ? (
                                                            <View style={styles.styBtnPrimary}>
                                                                <TouchableOpacity
                                                                    style={styles.button}
                                                                    onPress={() => this.started(camera)}
                                                                >
                                                                    <Text style={[styleSheets.text, styles.buttonText]}>
                                                                        Bắt đầu thiết lập
                                                                    </Text>
                                                                </TouchableOpacity>
                                                                <TouchableOpacity
                                                                    style={styles.notNowButton}
                                                                    onPress={() => DrawerServices.goBack()}
                                                                >
                                                                    <Text style={[styleSheets.text, styles.notNowText]}>
                                                                        Lúc khác
                                                                    </Text>
                                                                </TouchableOpacity>
                                                            </View>
                                                        ) : (
                                                            <View style={styles.styBtnPrimary}>
                                                                <Text style={[styleSheets.text, { color: Colors.red }]}>
                                                                    {txtError}
                                                                </Text>

                                                                <Progress.Bar
                                                                    backgroundColor={Colors.white}
                                                                    progress={progress}
                                                                    width={WITHD_PROGRESS}
                                                                    color={Colors.gray_9}
                                                                    height={1}
                                                                />

                                                                <ScrollView
                                                                    horizontal={true}
                                                                    style={styles.containerImage}
                                                                >
                                                                    {photos.map((item) => {
                                                                        return item.uri ? (
                                                                            <View style={styles.styViewImage}>
                                                                                <Image
                                                                                    source={{ uri: item.uri }}
                                                                                    style={styles.ImgSize}
                                                                                />
                                                                                {/* <Text
                                                                                    style={[
                                                                                        styleSheets.text,
                                                                                        styles.txtImg,
                                                                                    ]}
                                                                                >
                                                                                    {item.lable}
                                                                                </Text> */}
                                                                            </View>
                                                                        ) : (
                                                                            <View style={styles.styViewImage}>
                                                                                <View style={styles.ImgSize} />
                                                                                {/* <Text
                                                                                    style={[
                                                                                        styleSheets.text,
                                                                                        styles.txtImg,
                                                                                    ]}
                                                                                >
                                                                                    {item.lable}
                                                                                </Text> */}
                                                                            </View>
                                                                        );
                                                                    })}
                                                                </ScrollView>
                                                            </View>
                                                        )}
                                                    </View>
                                                )}
                                            </View>
                                        );
                                    }}
                                </SafeAreaConsumer>
                            );
                        }
                    }}
                </RNCamera>
            </View>
        );
    }
}

const WITHD_PROGRESS = Size.deviceWidth - Size.defineSpace * 4;

const scanBarWidth = SCREEN_WIDTH * 0.46; // this is equivalent to 180 from a 393 device width
const scanBarHeight = SCREEN_WIDTH * 0.0025; //this is equivalent to 1 from a 393 device width

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    viewAll: {
        flex: 1
    },
    containerImage: {
        height: 'auto',
        flexDirection: 'row',
        borderColor: Colors.grey,
        borderWidth: 0.5,
        padding: Size.defineHalfSpace,
        borderRadius: styleSheets.radius_5,
        marginTop: Size.defineHalfSpace
    },
    styViewImage: {
        height: 'auto',
        width: 'auto',
        marginRight: Size.defineSpace,
        justifyContent: 'center',
        alignItems: 'center'
    },
    ImgSize: {
        backgroundColor: Colors.whiteOpacity70,
        height: Size.deviceWidth * 0.15,
        width: Size.deviceWidth * 0.15,
        marginRight: Size.defineHalfSpace,
        marginBottom: 5,
        borderRadius: 5,
        resizeMode: 'cover'
    },
    styFontSc: {
        flex: 1,
        position: 'absolute',
        width: Size.deviceWidth,
        height: '100%',
        top: 0,
        left: 0,
        flexDirection: 'column',
        paddingHorizontal: Size.defineSpace * 2
    },
    bntGoBack: {
        width: 44,
        height: 44,
        borderRadius: 8,
        // backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: -Size.defineSpace,
        marginTop: Size.defineHalfSpace
    },
    rectangle: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        // backgroundColor: "transparent",
        paddingBottom: Size.defineSpace
    },
    styBtnPrimary: {
        paddingBottom: Size.defineSpace * 2
    },
    scanBar: {
        width: scanBarWidth,
        height: scanBarHeight,
        backgroundColor: Colors.gray_10
    },
    styheader: {},
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginVertical: Size.defineHalfSpace
    },
    subtitle: {
        fontSize: 16,
        marginBottom: 32
    },
    preview: {
        flex: 1,
        height: Size.deviceheight,
        width: Size.deviceWidth
    },

    button: {
        backgroundColor: Colors.gray_9,
        padding: 12,
        borderRadius: 20,
        marginTop: 16
    },
    buttonText: {
        color: Colors.white,
        fontSize: 16,
        textAlign: 'center'
    },
    notNowButton: {
        marginTop: Size.defineSpace
    },
    notNowText: {
        color: Colors.black,
        fontSize: 14,
        textAlign: 'center'
    }
});

export default FaceScanSetting;
