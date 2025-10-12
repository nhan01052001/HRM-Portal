/* eslint-disable react-native/no-color-literals */
/* eslint-disable react-native/no-inline-styles */
import React, { Component } from 'react';
import { View, TouchableOpacity, Image, Animated } from 'react-native';
import { RNCamera } from 'react-native-camera';
import axios from 'axios';
import { PinchGestureHandler, State } from 'react-native-gesture-handler';

import DrawerServices from '../../utils/DrawerServices';
import { Colors } from '../../constants/styleConfig';
import { IconPrev } from '../../constants/Icons';
import VnrLoading from '../../components/VnrLoading/VnrLoading';
import { VnrLoadingSevices } from '../../components/VnrLoading/VnrLoadingPages';
import SafeAreaViewDetail from '../../components/safeAreaView/SafeAreaViewDetail';

const BASEURL = 'https://api.luxand.cloud//photo/search/v2';

class TakePictureFace extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cameraType: RNCamera.Constants.Type.back,
            isCapturing: false, // Add a new state to track if the camera is currently capturing
            zoom: 0 // initial zoom
        };

        this.lastScale = 1;
        this.onPinchGestureEvent = Animated.event([{ nativeEvent: { scale: this.scale } }], { useNativeDriver: true });
    }

    takePicture = async function (camera) {
        if (camera && !this.state.isCapturing) {
            // Check if the camera is not currently capturing
            try {
                this.setState({ isCapturing: true }); // Set isCapturing to true before capturing

                const options = { quality: 0.2, base64: false };
                const data = await camera.takePictureAsync(options);

                const title = data.uri.split('/').pop().split('#')[0].split('?')[0];
                const file = {
                    uri: data.uri,
                    name: title,
                    type: 'image/jpeg',
                    fileSize: data.height * data.width * 4,
                    temp: true
                };

                const formData = new FormData();

                formData.append('photo', {
                    uri: file?.uri,
                    name: file?.name,
                    type: file?.type
                });

                this.handleFaceAuthentication(formData, file, {
                    pictureOrientation: data?.pictureOrientation,
                    deviceOrientation: data?.deviceOrientation
                });
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            } finally {
                this.setState({ isCapturing: false }); // Set isCapturing back to false after capturing
            }
        }
    };

    switchCamera = () => {
        const { cameraType } = this.state;
        this.setState({
            cameraType:
                cameraType === RNCamera.Constants.Type.back
                    ? RNCamera.Constants.Type.front
                    : RNCamera.Constants.Type.back
        });
    };

    handleFaceAuthentication = (formData, file, orientation) => {
        // DrawerServices.navigate('ScanFace', {
        //     file,
        //     data:[
        //         {
        //             "name": "TRẦN CÔNG HIẾU|19092020110118.jpeg|hieu.tran@vnresource.org|c35096dc-4c0e-4ace-8c22-c08dff873083",
        //             "probability": 0.9969906806945801,
        //             "rectangle": {
        //                 "left": 1184,
        //                 "top": 451,
        //                 "right": 1282,
        //                 "bottom": 549
        //             },
        //             "uuid": "a763b231-3d05-11ef-86d3-0242ac120002",
        //             "collections": []
        //         },
        //         {
        //             "name": "NGUYỄN THÀNH NHÂN|nhan.png|nhan.nguyenthanh@vnresource.org|360bd2ac-69a6-4735-8fd2-74cdce6a035f",
        //             "probability": 0.8894424438476562,
        //             "rectangle": {
        //                 "left": 2303,
        //                 "top": 577,
        //                 "right": 2391,
        //                 "bottom": 665
        //             },
        //             "uuid": "c8f1b6d4-3d05-11ef-86d3-0242ac120002",
        //             "collections": []
        //         },
        //         {
        //             "name": "TRẦN CÔNG HIẾU|19092020110118.jpeg|hieu.tran@vnresource.org|c35096dc-4c0e-4ace-8c22-c08dff873083|09 898 989 89|Phạm Văn Hiển",
        //             "probability": 0.7945042848587036,
        //             "rectangle": {
        //                 "left": 791,
        //                 "top": 477,
        //                 "right": 893,
        //                 "bottom": 579
        //             },
        //             "uuid": "9f21a8cf-3cdf-11ef-86d3-0242ac120002",
        //             "collections": []
        //         },
        //         {
        //             "name": "NGUYỄN THÀNH TÍN|tin.png|tin.nguyen@vnresource.vn|31eb6545-6cac-4190-b628-3b1a7881dbc5",
        //             "probability": 0.8435714244842529,
        //             "rectangle": {
        //                 "left": 412,
        //                 "top": 403,
        //                 "right": 528,
        //                 "bottom": 519
        //             },
        //             "uuid": "449f1b1d-3d06-11ef-86d3-0242ac120002",
        //             "collections": []
        //         },
        //         {
        //             "name": "TRẦN CÔNG HIẾU|19092020110118.jpeg|hieu.tran@vnresource.org|c35096dc-4c0e-4ace-8c22-c08dff873083",
        //             "probability": 0.7865341901779175,
        //             "rectangle": {
        //                 "left": 601,
        //                 "top": 454,
        //                 "right": 717,
        //                 "bottom": 570
        //             },
        //             "uuid": "a763b231-3d05-11ef-86d3-0242ac120002",
        //             "collections": []
        //         },
        //         {
        //             "name": "NGUYỄN THÀNH NHÂN|nhan.png|nhan.nguyenthanh@vnresource.org|360bd2ac-69a6-4735-8fd2-74cdce6a035f",
        //             "probability": 0.9987074136734009,
        //             "rectangle": {
        //                 "left": 1905,
        //                 "top": 506,
        //                 "right": 1985,
        //                 "bottom": 586
        //             },
        //             "uuid": "c8f1b6d4-3d05-11ef-86d3-0242ac120002",
        //             "collections": []
        //         }
        //     ].filter((item) => item.probability >= 0.96),
        //     orientation,
        // });
        try {
            VnrLoadingSevices.show();
            axios
                .post(BASEURL, formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        token: 'e0c414c6d6874a199970bd55d4278759'
                    }
                })
                .then((response) => {
                    VnrLoadingSevices.hide();
                    if (Array?.isArray(response)) {
                        const dataFilter = response.filter((item) => item.probability >= 0.96);
                        DrawerServices.navigate('ScanFace', {
                            file,
                            data: dataFilter,
                            orientation
                        });
                    }
                })
                .catch((error) => {
                    VnrLoadingSevices.hide();
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                });
        } catch (error) {
            VnrLoadingSevices.hide();
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    zoomIn = () => {
        this.setState((prevState) => ({
            zoom: prevState.zoom + 0.1 > 1 ? 1 : prevState.zoom + 0.1
        }));
    };

    zoomOut = () => {
        this.setState((prevState) => ({
            zoom: prevState.zoom - 0.1 < 0 ? 0 : prevState.zoom - 0.1
        }));
    };

    _baseScale = new Animated.Value(1);
    _pinchScale = new Animated.Value(1);
    _scale = Animated.multiply(this._baseScale, this._pinchScale);
    _lastScale = 1;
    _onPinchGestureEvent = Animated.event([{ nativeEvent: { scale: this._pinchScale } }], { useNativeDriver: true });

    _onPinchHandlerStateChange = (event) => {
        if (event.nativeEvent.oldState === State.ACTIVE && this.state.zoom >= 0 && this.state.zoom <= 0.5) {
            this._lastScale *= event.nativeEvent.scale;
            this.lastScale = this._lastScale;
            this._baseScale.setValue(this._lastScale);
            this._pinchScale.setValue(1);
            this.setState({
                zoom: this._lastScale > 0.5 ? 0.5 : this._lastScale < 0 ? 0.5 : this._lastScale
            });
        }
        // if (event.nativeEvent.oldState === State.ACTIVE) {
        //     const currentScale = event.nativeEvent.scale;
        //     const zoomType = currentScale > this.lastScale ? 'zoom in' : 'zoom out';
        //     console.log('Zoom type:', zoomType);
        //     this.lastScale = currentScale;
        // }
    };

    render() {
        const { cameraType } = this.state;
        return (
            <SafeAreaViewDetail style={{ flex: 1 }}>
                <TouchableOpacity
                    style={{
                        position: 'absolute',
                        top: 35,
                        left: 10,
                        width: 58,
                        height: 58,
                        borderRadius: 13,
                        backgroundColor: '#080808',
                        justifyContent: 'center',
                        alignItems: 'center',
                        zIndex: 100,
                        elevation: 100
                    }}
                    activeOpacity={0.8}
                    onPress={() => {
                        DrawerServices.goBack();
                    }}
                >
                    <IconPrev size={32} color={'#fff'} />
                </TouchableOpacity>
                <PinchGestureHandler
                    onGestureEvent={this._onPinchGestureEvent}
                    onHandlerStateChange={this._onPinchHandlerStateChange}
                >
                    <Animated.View
                        style={[
                            {
                                flex: 1
                            },
                            {
                                //transform: [{ perspective: 200 }, { scale: this._scale }],
                            }
                        ]}
                    >
                        <RNCamera
                            // ref={(ref) => {
                            //     this.camera = ref;
                            // }}
                            zoom={this.state.zoom}
                            captureAudio={false}
                            style={{ flex: 1 }}
                            type={cameraType}
                            orientation={RNCamera.Constants.Orientation.auto}
                            androidCameraPermissionOptions={{
                                title: 'Permission to use camera',
                                message:
                                    'We would like to use your camera for taking pictures in the GPS timekeeping screen',
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
                                        <View
                                            style={{
                                                position: 'absolute',
                                                bottom: 20,
                                                width: '100%',
                                                alignItems: 'center'
                                            }}
                                        >
                                            <View
                                                style={{
                                                    // position: 'relative',
                                                    // bottom: 20,
                                                    // width: '100%',
                                                    flex: 1,
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <TouchableOpacity
                                                    style={{
                                                        position: 'relative',
                                                        width: 60,
                                                        height: 60,
                                                        borderRadius: 60,
                                                        borderWidth: 4,
                                                        borderColor: '#080808',
                                                        justifyContent: 'center',
                                                        alignItems: 'center',
                                                        zIndex: 100,
                                                        elevation: 100
                                                    }}
                                                    activeOpacity={0.8}
                                                    onPress={() => {
                                                        this.takePicture(camera);
                                                    }}
                                                >
                                                    <View
                                                        style={{
                                                            width: 50,
                                                            height: 50,
                                                            borderRadius: 50,
                                                            backgroundColor: '#fff'
                                                        }}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                            <TouchableOpacity
                                                style={{
                                                    position: 'absolute',
                                                    // bottom: 20,
                                                    right: 10,
                                                    width: 60,
                                                    height: 60,
                                                    borderRadius: 60,
                                                    backgroundColor: '#080808',
                                                    justifyContent: 'center',
                                                    alignItems: 'center',
                                                    zIndex: 100,
                                                    elevation: 100
                                                }}
                                                activeOpacity={0.8}
                                                onPress={this.switchCamera}
                                            >
                                                <Image
                                                    source={require('../../assets/images/switchcamera.png')}
                                                    style={{
                                                        width: 32,
                                                        height: 32
                                                    }}
                                                />
                                            </TouchableOpacity>
                                        </View>
                                    );
                                }
                            }}
                        </RNCamera>
                    </Animated.View>
                </PinchGestureHandler>
            </SafeAreaViewDetail>
        );
    }
}

export default TakePictureFace;
