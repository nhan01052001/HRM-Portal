/* eslint-disable no-console */
import React, { createRef } from 'react';
import {
    View,
    Platform,
    StyleSheet,
    PanResponder,
    Animated,
    TouchableOpacity
} from 'react-native';
import { IconHome } from '../../constants/Icons';
import { Colors, Size } from '../../constants/styleConfig';
import DrawerServices from '../../utils/DrawerServices';

const api = {};
export const VnrBalloonService = api;
const firstValueX = Size.deviceWidth - 85;
const firstValueY = Size.deviceheight - 162;

const initSateDefault = {
    isVisible: false,
    animation: new Animated.ValueXY({
        x: firstValueX,
        y: firstValueY
    })
};

class VnrBalloonHome extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initSateDefault
        };

        this.viewRef = createRef(null);

        this.show = this.show.bind(this);
        this.hide = this.hide.bind(this);
    }

    show = () => {
        this.setState({ isVisible: true });
    };

    hide = () => {
        this.setState({ isVisible: false });
    };

    componentDidMount() {
        api.show = this.show;
        api.hide = this.hide;
    }

    // eslint-disable-next-line react/no-deprecated
    componentWillMount() {
        this.handleMoveBallon();
    }

    handleSetLocationBalloon = (isHold = false) => {
        this._x = this.state.animation.x?._value ? this.state.animation.x?._value : firstValueX;
        this._y = this.state.animation.y?._value ? this.state.animation.y?._value : firstValueY;

        this.state.animation.addListener((value) => {
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

        this.state.animation.addListener((value) => {
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

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    render() {
        const { isVisible } = this.state;
        console.log(isVisible, 'balloon');
        return (
            <Animated.View
                style={[
                    Platform.OS == 'ios' && styles.styBallonIos,
                    Platform.OS === 'android' && styles.ballonAndroidOption,
                    this.state.animation.getLayout()
                ]}
                {...this._panResponder.panHandlers}
            >
                {isVisible && (
                    <TouchableOpacity
                        onPress={() => {
                            DrawerServices.navigate('Main');
                            // DrawerServices.navigateForVersion('Home', {
                            //     goBackFromChat: true
                            // });
                            this.hide();
                        }}
                        activeOpacity={0.5}
                        style={styles.wrapBtnBallon}
                    >
                        <View style={[styles.box]}>
                            <View style={[styles.box]}>
                                <IconHome color={Colors.primary} size={Size.iconSizeHeader} />
                            </View>
                        </View>
                    </TouchableOpacity>
                )}
            </Animated.View>
        );
    }
}

const styles = StyleSheet.create({
    styBallonIos: { zIndex: 2, elevation: 2 },
    box: {
        height: 55,
        width: 55,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 100,
        backgroundColor: Colors.white,
        borderColor: Colors.primary,
        borderWidth: 3
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
    }
});

export default VnrBalloonHome;
