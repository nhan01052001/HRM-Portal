import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text } from 'react-native';
import { Size, styleSheets, Colors } from '../../constants/styleConfig';
import DrawerServices from '../../utils/DrawerServices';
import Vnr_Function from '../../utils/Vnr_Function';
import VnrLoading from '../VnrLoading/VnrLoading';
import VnrText from '../VnrText/VnrText';

export default class ItemMain extends Component {
    constructor(props) {
        super(props);
        this.state = {
            newProps: null
        };
    }

    shouldComponentUpdate(nextProps) {
        return nextProps.title !== this.props.title || nextProps.countNumApprove !== this.props.countNumApprove;
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        // console.log(nextProps.countNumApprove, this.props);
        if (nextProps.countNumApprove !== this.props.countNumApprove) {
            this.setState({
                newProps: nextProps
            });
        }
    }

    router = (roouterName, params) => {
        DrawerServices.navigateForVersion(roouterName, params);
    };

    render() {
        const { newProps } = this.state;
        const { title, urlIcon, screenName, countNumApprove, index, countWaitApprove } = newProps
            ? newProps
            : this.props;

        let contentBages = <View />;
        if (countWaitApprove && countNumApprove == undefined) {
            // hiển thị loadding khi chưa có dữ liệu count
            contentBages = (
                <View style={styles.styViewBadges}>
                    <View style={styles.styBadgesLoading}>
                        <VnrLoading size={Size.textSmall - 1} color={Colors.primary} />
                    </View>
                </View>
            );
        } else if (countNumApprove != null && countNumApprove != 0) {
            contentBages = (
                <View style={styles.styViewBadges}>
                    <View style={styles.styBadges}>
                        <Text style={[styleSheets.text, styles.styBadgesText]} numberOfLines={1}>
                            {countNumApprove > 99 ? '99+' : countNumApprove}
                        </Text>
                    </View>
                </View>
            );
        }

        return (
            <TouchableOpacity
                style={[
                    styles.viewButtonIOS,
                    // eslint-disable-next-line react-native/no-inline-styles
                    {
                        marginTop: 10,
                        marginRight:
                            Size.deviceWidth <= 320
                                ? (index + 1) % 3 == 0
                                    ? 0
                                    : PADDING
                                : (index + 1) % 4 == 0
                                    ? 0
                                    : PADDING
                    }
                ]}
                onPress={() => {
                    if (Vnr_Function.checkIsPath(screenName)) Vnr_Function.openLink(screenName);
                    else this.router(screenName);
                }}
            >
                <View style={styles.icon}>
                    <Image source={urlIcon} style={screenName === 'ProfileInfo' ? styles.iconForProfile : styles.iconStyle} />
                </View>
                <View style={styles.viewLable}>
                    <VnrText numberOfLines={2} i18nKey={title} style={[styleSheets.textFontMedium, styles.lableStyle]} />
                </View>
                {contentBages}
            </TouchableOpacity>
        );
    }
}

const PADDING = Size.deviceWidth >= 1024 ? Size.defineSpace : 10,
    WIDTH_VIEW =
        Size.deviceWidth <= 320
            ? (Size.deviceWidth - Size.defineSpace * 2 - PADDING * 2 - 3) / 3
            : (Size.deviceWidth - Size.defineSpace * 2 - PADDING * 3 - 4) / 4,
    HEIHGT_BUTTON = Size.deviceheight >= 1024 ? 120 : Size.deviceWidth <= 320 ? 85 : 95,
    WIDTH_HEIGHT_ICON = WIDTH_VIEW * 0.35 >= 50 ? 50 : WIDTH_VIEW * 0.35;
const styles = StyleSheet.create({
    viewButtonIOS: {
        height: HEIHGT_BUTTON,
        maxHeight: HEIHGT_BUTTON,
        width: WIDTH_VIEW,
        borderRadius: 5,
        // paddingVertical: 8,
        borderWidth: 0.5,
        borderColor: Colors.gray_3,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 3,
        zIndex: 1,
        backgroundColor: Colors.gray_3
    },
    icon: {
        marginBottom: 8,
        justifyContent: 'center',
        alignItems: 'center'
    },
    iconStyle: {
        width: WIDTH_VIEW,
        height: WIDTH_HEIGHT_ICON,
        maxWidth: 50,
        maxHeight: 50,
        resizeMode: 'contain'
    },
    iconForProfile: {
        width: WIDTH_HEIGHT_ICON,
        height: WIDTH_HEIGHT_ICON,
        resizeMode: 'cover',
        borderRadius: WIDTH_HEIGHT_ICON / 2
    },
    lableStyle: {
        fontSize: Size.text - 2,
        textAlign: 'center',
        color: Colors.black,
        fontWeight: '500',
        paddingBottom: 1
    },
    viewLable: {
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    styViewBadges: {
        position: 'absolute',
        top: 5,
        right: 5
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
    styBadgesLoading: {
        backgroundColor: Colors.primary_transparent_8,
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
    }
});
