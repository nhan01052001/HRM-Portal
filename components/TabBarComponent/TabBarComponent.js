import React, { Component } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, Platform, Keyboard, Text } from 'react-native';
import { Colors, Size, styleSheets } from '../../constants/styleConfig';
import { BlurView } from '@react-native-community/blur';
import { SafeAreaView } from 'react-navigation';
import VnrText from '../VnrText/VnrText';
import { IconHome, IconNotify, IconSetting, IconChat } from '../../constants/Icons';
import { PermissionForAppMobile } from '../../assets/configProject/PermissionForAppMobile';
import { ConfigVersionBuild } from '../../assets/configProject/ConfigVersionBuild';
import { connect } from 'react-redux';
import badgesNotification from '../../redux/badgesNotification';
import { SafeAreaConsumer } from 'react-native-safe-area-context';
const defaultConfig = {
    activeTintColor: Colors.primary,
    inactiveTintColor: Colors.gray_8
};

class TabBarComponent extends Component {
    constructor(porps) {
        super(porps);
        this.disable = false;
        this.state = {
            isVisibleKeyboard: true,
            countNotify: 0
        };
        if (Platform.OS === 'android') {
            this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
                // console.log('keyboardDidShow');
                this.setState({ isVisibleKeyboard: false });
            });
            this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
                // console.log('keyboardDidHide');
                this.setState({ isVisibleKeyboard: true });
            });
        }
    }

    visible = visible => {
        this.setState({ isVisibleKeyboard: visible });
    };

    componentWillUnmount = () => {
        this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
    };

    UNSAFE_componentWillReceiveProps = nextProps => {
        const { countBadgesNotify } = nextProps;
        if (countBadgesNotify != null)
            this.setState({
                countNotify: countBadgesNotify
            });
    };

    tabNotifyOnPress = () => {
        //const { setNumberBadgesNotify } = this.props;
        //setNumberBadgesNotify(0);
    };

    componentDidMount() {
        const { countBadgesNotify } = this.props;
        if (countBadgesNotify != null)
            this.setState({
                countNotify: countBadgesNotify
            });
    }

    _renderIcon = scene => {
        const { route, focused } = scene,
            iconSize = Size.iconSize + 4;
        let icon = <View />;
        switch (route.routeName) {
            case 'Notify':
                icon = focused ? (
                    <IconNotify size={iconSize} color={Colors.primary} />
                ) : (
                    <IconNotify size={iconSize} color={Colors.gray_9} />
                );
                break;
            case 'Setup':
                icon = focused ? (
                    <IconSetting size={iconSize} color={Colors.primary} />
                ) : (
                    <IconSetting size={iconSize} color={Colors.gray_9} />
                );
                break;
            case 'Messaging':
                icon = focused ? (
                    <IconChat size={iconSize} color={Colors.primary} />
                ) : (
                    <IconChat size={iconSize} color={Colors.gray_9} />
                );
                break;
            default:
                icon = focused ? (
                    <IconHome size={iconSize} color={Colors.primary} />
                ) : (
                    <IconHome size={iconSize} color={Colors.gray_9} />
                );
                break;
        }
        return icon;
    };

    _renderLabel = scene => {
        const { route, focused } = scene;
        let KeyText,
            intColor = focused ? defaultConfig.activeTintColor : defaultConfig.inactiveTintColor;
        switch (route.routeName) {
            case 'Notify':
                KeyText = 'Notify';
                break;
            case 'Setup':
                KeyText = 'setting';
                break;
            case 'Messaging':
                KeyText = 'HRM_Chat_Title_Message';
                break;
            case 'Test':
                KeyText = 'Test';
                break;
            default:
                KeyText = 'home';
        }
        return (
            focused && (
                <VnrText
                    i18nKey={KeyText}
                    value={KeyText}
                    style={[
                        styleSheets.text,
                        // eslint-disable-next-line react-native/no-inline-styles
                        {
                            fontSize: Size.text - 1,
                            fontWeight: '500',
                            color: intColor
                        }
                    ]}
                />
            )
        );
    };

    onTabPress = route => {
        if (route.key == 'Notify') {
            this.tabNotifyOnPress();
        }
        this.props.navigation.navigate(route.routeName);
    };

    renderRoute = () => {
        const { countNotify } = this.state,
            { routes } = this.props.navigation.state,
            // { versionBuild } = dataVnrStorage.apiConfig,
            checkVersion = ConfigVersionBuild.value,
            permission = PermissionForAppMobile.value;

        return routes.map((route, index) => {
            const focused = index === this.props.navigation.state.index;
            const scene = { route, focused };
            if (
                route.key == 'Messaging' &&
                permission['New_Feature_Messaging_Tabbar'] &&
                permission['New_Feature_Messaging_Tabbar']['View']
            ) {
                return (
                    <TouchableWithoutFeedback
                        key={route.key}
                        onPress={() => {
                            this.onTabPress(route);
                        }}
                    >
                        <View style={styles.tab}>
                            <View style={styles.viewIcon}>{this._renderIcon(scene)}</View>
                            {focused && <View style={styles.viewLabe}>{this._renderLabel(scene)}</View>}
                        </View>
                    </TouchableWithoutFeedback>
                );
            } else if (
                route.key == 'Notify' &&
                permission['New_Feature_Notification_Tabbar'] &&
                permission['New_Feature_Notification_Tabbar']['View']
            ) {
                return (
                    <TouchableWithoutFeedback
                        key={route.key}
                        onPress={() => {
                            this.onTabPress(route);
                        }}
                    >
                        <View style={styles.tab}>
                            <View style={styles.viewIcon}>{this._renderIcon(scene)}</View>
                            {focused && <View style={styles.viewLabe}>{this._renderLabel(scene)}</View>}
                            {countNotify != null && countNotify != 0 && route.key == 'Notify' && (
                                <View style={styles.styViewBadges}>
                                    <View style={styles.styBadges}>
                                        <Text style={[styleSheets.text, styles.styBadgesText]} numberOfLines={1}>
                                            {countNotify > 99 ? '99+' : countNotify}
                                        </Text>
                                    </View>
                                </View>
                            )}
                        </View>
                    </TouchableWithoutFeedback>
                );
            } else if (route.key !== 'Messaging' && route.key !== 'Notify') {
                if (route.key.indexOf('Main') === 0) {
                    if (route.key == `Main${checkVersion}`) {
                        return (
                            <TouchableWithoutFeedback
                                key={route.key}
                                onPress={() => {
                                    this.onTabPress(route);
                                }}
                            >
                                <View style={styles.tab}>
                                    <View style={styles.viewIcon}>{this._renderIcon(scene)}</View>
                                    {focused && <View style={styles.viewLabe}>{this._renderLabel(scene)}</View>}
                                </View>
                            </TouchableWithoutFeedback>
                        );
                    } else {
                        return <View />;
                    }
                } else {
                    return (
                        <TouchableWithoutFeedback
                            key={route.key}
                            onPress={() => {
                                this.onTabPress(route);
                            }}
                        >
                            <View style={styles.tab}>
                                <View style={styles.viewIcon}>{this._renderIcon(scene)}</View>
                                {focused && <View style={styles.viewLabe}>{this._renderLabel(scene)}</View>}
                            </View>
                        </TouchableWithoutFeedback>
                    );
                }
            } else {
                return <View />;
            }
        });
    };

    render() {
        const { isVisibleKeyboard } = this.state,
            { routes } = this.props.navigation.state;

        return !isVisibleKeyboard ? null : (
            <BlurView style={styles.ContentCenter} blurType="light" blurAmount={10} reducedTransparencyFallbackColor="gray">
                {Platform.OS == 'ios' ? (
                    <SafeAreaConsumer>
                        {insets => (
                            <View style={[styles.tabbar, { paddingBottom: insets.bottom }]}>
                                {this.renderRoute(routes)}
                            </View>
                        )}
                    </SafeAreaConsumer>
                ) : (
                    <SafeAreaView>
                        <View style={styles.tabbar}>{this.renderRoute(routes)}</View>
                    </SafeAreaView>
                )}
            </BlurView>
        );
    }
}

const mapStateToProps = state => {
    return {
        countBadgesNotify: state.badgesNotification.countBadgesNotify
    };
};

const mapDispatchToProps = dispatch => {
    return {
        setNumberBadgesNotify: number => {
            dispatch(badgesNotification.actions.setNumberBadgesNotify(number));
        }
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TabBarComponent);

const styles = StyleSheet.create({
    ContentCenter: {
        position: 'absolute',
        bottom: 0,
        width: '100%'
    },
    tabbar: {
        height:
            Size.deviceWidth <= 320
                ? Size.deviceheight * 0.09
                : Platform.OS === 'android'
                    ? Size.deviceheight * 0.08
                    : Size.deviceheight * 0.1,
        minHeight: 45,
        maxHeight: 90,
        justifyContent: 'space-around',
        flexDirection: 'row',
        alignItems: 'center',
        paddingTop: Platform.OS == 'ios' ? Size.defineHalfSpace : 0
    },
    tab: {
        flex: 1,
        height: '100%',
        width: Size.deviceWidth * 0.4,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    viewIcon: {
        marginBottom: 3
    },
    viewLabe: {},
    styViewBadges: {
        position: 'absolute'
        // top: 5,
    },
    styBadges: {
        backgroundColor: Colors.red,
        flexGrow: 1,
        borderRadius: ((Size.textSmall - 1) * 2) / 2,
        justifyContent: 'center',
        alignItems: 'center',
        maxWidth: 60,
        minWidth: 20,
        paddingHorizontal: 3.5,
        height: (Size.textSmall + 1) * 1.4,
        marginLeft: Size.iconSize + 2,
        marginBottom: Size.iconSize + 5
    },
    styBadgesText: {
        color: Colors.white,
        fontSize: Size.textSmall - 2,
        fontWeight: '600'
        // marginBottom: -1.5
    }
});
