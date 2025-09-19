/* eslint-disable no-console */
import React, { createRef } from 'react';
import {
    View,
    Platform,
    StyleSheet,
    PanResponder,
    Animated,
    Text,
    TouchableWithoutFeedback,
    TouchableOpacity,
    // eslint-disable-next-line react-native/split-platform-components
    PermissionsAndroid
} from 'react-native';
import { connect } from 'react-redux';
import RecordScreen, { RecordingResult } from 'react-native-record-screen';

import { Colors, Size } from '../../constants/styleConfig';
import {
    IconScreenshot,
    IconVideo,
    IconCancel,
    IconPauseVideo,
    IconResumeVideo,
    IconNextForward
} from '../../constants/Icons';
import DrawerServices from '../../utils/DrawerServices';
import { captureScreen } from 'react-native-view-shot';
import feedback from '../../redux/feedback';
import { ToasterSevice } from '../Toaster/Toaster';
import RNFetchBlob from 'rn-fetch-blob';
import { translate } from '../../i18n/translate';

const api = {};
export const VnrBalloonService = api;
const firstValueX = Size.deviceWidth - 85;
const firstValueY = Size.deviceheight - 162;

const initSateDefault = {
    isVisible: false,
    animation: new Animated.ValueXY({
        x: firstValueX,
        y: firstValueY
    }),
    type: null,
    isShowButtonOption: false,
    timer: 0,
    isStartScreenShot: false,
    isTakePicture: false
};

class VnrBalloon extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initSateDefault
        };

        this.viewRef = createRef(null);

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
        this.takeScreenShot = this.takeScreenShot.bind(this);
    }

    show = type => {
        let nextState = {};
        if (type) {
            nextState = {
                ...nextState,
                isTakePicture: false,
                type
            };
        }
        this.setState({ isVisible: true, ...nextState });
    };

    hide = () => {
        this.setState({ isVisible: false });
    };

    componentDidMount() {
        api.show = this.show;
        api.hide = this.hide;
        api.takeScreenShot = this.takeScreenShot;
    }

    // eslint-disable-next-line react/no-deprecated
    componentWillMount() {
        this.handleMoveBallon();
    }

    handleSetLocationBalloon = (isHold = false) => {
        this._x = this.state.animation.x?._value ? this.state.animation.x?._value : firstValueX;
        this._y = this.state.animation.y?._value ? this.state.animation.y?._value : firstValueY;

        this.state.animation.addListener(value => {
            this._x = value.x;
            this._y = value.y;
        });

        this.state.animation.flattenOffset();

        Animated.timing(this.state.animation, {
            toValue: {
                x:
                    this._x <= 0
                        ? 12
                        : this._x >= firstValueX
                            ? firstValueX
                            : this._x <= Size.deviceWidth / 2 - 25
                                ? 12
                                : firstValueX,
                y: this._y <= 0 ? 12 : this._y >= Size.deviceheight - 162 * 2 ? Size.deviceheight - 162 * 2 : this._y
            },
            duration: 0
        }).start(() => {
            if (isHold) {
                this.setState({
                    isShowButtonOption: true
                });
            } else {
                this.setState(
                    {
                        isShowButtonOption: true,
                        isStartScreenShot: true
                    },
                    () => {
                        // this.startRecording();
                    }
                );
            }
        });
    };

    handleMoveBallon = () => {
        this._x = this.state.animation.x?._value ? this.state.animation.x?._value : firstValueX;
        this._y = this.state.animation.y?._value ? this.state.animation.y?._value : firstValueY;

        this.state.animation.addListener(value => {
            this._x = value.x;
            this._y = value.y;
        });

        this._panResponder = PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onPanResponderGrant: () => {
                this.state.animation.setOffset({ x: this._x, y: this._y });
                this.state.animation.setValue({ x: 0, y: 0 });
            },
            onPanResponderMove: Animated.event([null, { dx: this.state.animation.x, dy: this.state.animation.y }]),
            onPanResponderRelease: () => {
                this.state.animation.flattenOffset();

                Animated.timing(this.state.animation, {
                    toValue: {
                        x:
                            this._x <= 0
                                ? 12
                                : this._x >= firstValueX
                                    ? firstValueX
                                    : this._x <= Size.deviceWidth / 2 - 25
                                        ? 12
                                        : firstValueX,
                        y:
                            this._y <= 0
                                ? 12
                                : this.state.isShowButtonOption
                                    ? this._y >= Size.deviceheight - 162 * 2
                                        ? Size.deviceheight - 162 * 2
                                        : this._y
                                    : this._y >= firstValueY
                                        ? firstValueY
                                        : this._y
                    },
                    duration: 400
                }).start(() => {
                    // animation finished
                });
            }
        });
    };

    countDown() {
        this.interval = setInterval(() => {
            this.setState(state => ({
                timer: state.timer + 1
            }));
        }, 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    transformMinutes = time => {
        const convertedValue = Math.floor(((time * 1000) / 60000) % 60);
        const formattedValue = ('0' + convertedValue).slice(-2);
        return formattedValue;
    };
    transformSeconds = time => {
        const convertedValue = Math.floor(((time * 1000) / 1000) % 60);
        const formattedValue = ('0' + convertedValue).slice(-2);
        return formattedValue;
    };

    takeScreenShot = (params = null) => {
        this.setState(
            {
                isTakePicture: true
            },
            () => {
                captureScreen({
                    format: 'jpg',
                    quality: 0.8
                }).then(
                    async uri => {
                        let size = null;
                        if (this.props?.setDataImgVideo && Array.isArray(this.props?.dataImgVideo))
                            await RNFetchBlob.fs
                                .stat(uri)
                                .then(res => {
                                    if (res) {
                                        size = res.size;
                                    }
                                })
                                // eslint-disable-next-line no-unused-vars
                                .catch(error => {
                                    ToasterSevice.showWarning('HRM_PortalApp_Feedback_UnableFileSize!');
                                });

                        this.props?.setDataImgVideo([
                            ...this.props?.dataImgVideo,
                            {
                                id: this.props?.dataImgVideo.length,
                                uri,
                                type: 'img',
                                size
                            }
                        ]);
                        this.setState(
                            {
                                ...initSateDefault,
                                isTakePicture: false
                            },
                            () => {
                                DrawerServices.navigate('Feedback', {
                                    params
                                });
                            }
                        );
                    },
                    () => {
                        ToasterSevice.showError('HRM_PortalApp_Feedback_ErrorTakeScreenshots');
                    }
                );
            }
        );
    };

    requestMicrophonePermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO, {
                    title: translate('HRM_PortalApp_Feedback_MicrophonePermission'),
                    message: translate('HRM_PortalApp_Feedback_RequestMicrophonePermission')
                });
                // If Microphone Permission is granted
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                return false;
            }
        } else return true;
    };

    startRecording = async () => {
        try {
            // recording start
            const isMicrophonePermission = await this.requestMicrophonePermission();

            const res = await RecordScreen.startRecording({
                bitrate: 1024000, // default 236390400
                fps: 24, // default 60
                mic: isMicrophonePermission
            }).catch(error => console.log(error, 'error'));
            if (res === RecordingResult.PermissionError) {
                // user denies access
                this.setState(
                    {
                        isShowButtonOption: false,
                        isStartScreenShot: false,
                        timer: 0
                    },
                    () => {
                        clearInterval(this.interval);
                    }
                );
                return;
            } else {
                this.countDown();
            }
        } catch (error) {
            ToasterSevice.showError('HRM_PortalApp_Feedback_ErrorScreenRecording');
        }
    };

    stopRecording = async (isSkip = false) => {
        try {
            // recording stop
            const res = await RecordScreen.stopRecording().catch(() => {
                clearInterval(this.interval);
                ToasterSevice.showError('HRM_PortalApp_Feedback_ErrorScreenRecording');
            });
            if (res?.status === 'success') {
                let size = null;
                if (this.props?.setDataImgVideo && Array.isArray(this.props?.dataImgVideo)) {
                    let url = res.result.outputURL;
                    if (Platform.OS === 'ios') {
                        url = res.result.outputURL.replace('file://', '');
                    }
                    await RNFetchBlob.fs
                        .stat(url)
                        .then(res => {
                            if (res) {
                                size = res.size;
                            }
                        })
                        .catch(() => {
                            clearInterval(this.interval);
                            ToasterSevice.showError('HRM_PortalApp_Feedback_UnableFileSize');
                        });

                    this.props?.setDataImgVideo([
                        ...this.props?.dataImgVideo,
                        {
                            id: this.props?.dataImgVideo.length,
                            uri: res.result.outputURL,
                            type: 'video',
                            size
                        }
                    ]);
                    if (!isSkip) {
                        this.setState(
                            {
                                ...initSateDefault
                            },
                            () => {
                                clearInterval(this.interval);
                                DrawerServices.navigate('Feedback');
                            }
                        );
                    }
                }
            } else {
                clearInterval(this.interval);
                ToasterSevice.showError('HRM_PortalApp_Feedback_ErrorScreenRecording');
            }
        } catch (error) {
            clearInterval(this.interval);
            ToasterSevice.showError('HRM_PortalApp_Feedback_ErrorScreenRecording');
        }
    };

    renderButtonOptions = () => {
        const { type, isStartScreenShot } = this.state;

        return (
            <View style={styles.styBtnOption}>
                <TouchableWithoutFeedback
                    onPress={() => {
                        this.setState({
                            isShowButtonOption: false
                        });
                    }}
                    activeOpacity={1}
                    style={[styles.btnBallonOption]}
                >
                    <View style={[styles.btnBallonOption]}>
                        <IconCancel color={Colors.primary} size={Size.iconSizeHeader} />
                    </View>
                </TouchableWithoutFeedback>

                {!isStartScreenShot && (
                    <TouchableWithoutFeedback
                        onPress={() => {
                            this.setState(
                                {
                                    ...initSateDefault
                                },
                                () => {
                                    DrawerServices.navigate('Feedback');
                                }
                            );
                        }}
                        activeOpacity={1}
                        style={[styles.btnBallonOption]}
                    >
                        <View style={[styles.btnBallonOption]}>
                            <IconNextForward color={Colors.primary} size={Size.iconSizeHeader} />
                        </View>
                    </TouchableWithoutFeedback>
                )}

                {type === 'VideoScreen' && (
                    <TouchableWithoutFeedback
                        onPress={() => {
                            if (isStartScreenShot) {
                                this.setState(
                                    {
                                        isStartScreenShot: false,
                                        timer: 0
                                    },
                                    () => {
                                        this.stopRecording(true);
                                    }
                                );
                            } else {
                                this.setState(
                                    {
                                        isStartScreenShot: true
                                    },
                                    () => {
                                        this.startRecording();
                                    }
                                );
                            }
                        }}
                        activeOpacity={1}
                        style={[styles.btnBallonOption]}
                    >
                        <View style={[styles.btnBallonOption]}>
                            {isStartScreenShot ? (
                                <IconPauseVideo color={Colors.primary} size={Size.iconSizeHeader} />
                            ) : (
                                <IconResumeVideo color={Colors.primary} size={Size.iconSizeHeader} />
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                )}
            </View>
        );
    };

    render() {
        const { isVisible, type, isShowButtonOption, timer, isStartScreenShot, isTakePicture } = this.state;
        console.log({
            isShowButtonOption,
            isStartScreenShot
        });
        return (
            <Animated.View
                style={[
                    Platform.OS == 'ios' && styles.styBallonIos,
                    // Platform.OS === 'android' ?
                    isTakePicture
                        ? styles.ballonAndroid
                        : isVisible && !isShowButtonOption
                            ? styles.ballonAndroidOption
                            : isShowButtonOption && type === 'TakeScreenshot'
                                ? [styles.ballonAndroidOption, { height: 200 }]
                                : isShowButtonOption && type !== 'TakeScreenshot'
                                    ? [styles.ballonAndroidOption, { height: 260 }]
                                    : {},
                    this.state.animation.getLayout()
                ]}
                {...this._panResponder.panHandlers}
            >
                {isVisible && (
                    <TouchableOpacity
                        onPress={() => {
                            if (type === 'TakeScreenshot') {
                                this.takeScreenShot();
                            } else if (isStartScreenShot) {
                                this.setState(
                                    {
                                        isShowButtonOption: false,
                                        isStartScreenShot: false,
                                        timer: 0
                                    },
                                    () => {
                                        this.stopRecording();
                                    }
                                );
                            } else {
                                this.handleSetLocationBalloon();
                                this.setState(
                                    {
                                        isShowButtonOption: true,
                                        isStartScreenShot: true
                                    },
                                    () => {
                                        this.startRecording();
                                    }
                                );
                            }
                        }}
                        onLongPress={() => {
                            this.setState(
                                {
                                    isShowButtonOption: true
                                },
                                () => {
                                    this.handleSetLocationBalloon(true);
                                }
                            );
                        }}
                        activeOpacity={1}
                        style={styles.wrapBtnBallon}
                    >
                        {isShowButtonOption && this.renderButtonOptions()}

                        <View style={[styles.box]}>
                            <View style={[styles.box]}>
                                {isStartScreenShot ? (
                                    <Text>
                                        {this.transformMinutes(timer)} : {this.transformSeconds(timer)}
                                    </Text>
                                ) : type === 'TakeScreenshot' ? (
                                    <IconScreenshot color={Colors.primary} size={Size.iconSizeHeader} />
                                ) : (
                                    <IconVideo color={Colors.primary} size={Size.iconSizeHeader} />
                                )}
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    styBallonIos : { zIndex: 2, elevation: 2 },
    styBtnOption :{ marginVertical: 6, justifyContent: 'center' },
    box: {
        height: 60,
        width: 60,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        backgroundColor: Colors.white,
        borderColor: Colors.red,
        borderWidth: 3
    },
    // eslint-disable-next-line react-native/no-color-literals
    ballonAndroid: {
        width: '100%',
        height: '100%',
        backgroundColor: 'transparent',
        position: 'absolute'
    },
    ballonAndroidOption: {
        zIndex: 98,
        elevation: 98,
        width: 60,
        height: 60,
        position: 'absolute',
        right: 10,
        top: 200,
        alignItems: 'center',
        justifyContent: 'center'
    },
    wrapBtnBallon: {
        position: 'absolute',
        zIndex: 99,
        elevation: 99,
        alignItems: 'center',
        justifyContent: 'center'
    },
    btnBallonOption: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white,
        borderColor: Colors.gray_9,
        borderWidth: 3,
        height: 50,
        width: 50,
        borderRadius: 50,
        marginVertical: 6
    }
});

const mapStateToProps = state => {
    return {
        dataImgVideo: state.feedback.dataImgVideo
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setDataImgVideo: data => {
            dispatch(feedback.actions.setDataImgVideo(data));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(VnrBalloon);
