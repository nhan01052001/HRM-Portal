import React from 'react';
import { View, Text, StyleSheet, Image, Animated, Platform, ImageBackground } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {
    Colors,
    CustomStyleSheet,
    Size,
    styleSheets,
    stylesScreenDetailV3
} from '../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';
import { IconHeart } from '../../../../../constants/Icons';
import Color from 'color';
import RightActions from '../../../../../componentsV3/ListButtonMenuRight/RightActions';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';

const fw600 = Platform.OS == 'android' ? '600' : '400';

export default class ItemRankingCriteriaComCompliment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            widthIconBack: new Animated.Value(Size.defineSpace),
            heightIconNext: new Animated.Value(0),
            springIconBack: new Animated.Value(1),
            springIconNext: new Animated.Value(0)
        };
        this.formatStringType = this.formatStringType.bind(this);
        this.setRightAction(props);
        this.Swipe = null;
    }
    setRightAction = (thisProps) => {
        const { dataItem } = thisProps;
        this.sheetActions = [
            {
                title: translate('HRM_Common_Close'),
                onPress: null
            }
        ];
        if (!Vnr_Function.CheckIsNullOrEmpty(thisProps.rowActions)) {
            this.rightListActions = thisProps.rowActions.filter((item) => {
                return (
                    !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction) &&
                    dataItem.BusinessAllowAction.indexOf(item.type) >= 0
                );
            });
        }
    };
    UNSAFE_componentWillReceiveProps(nextProps) {
        if (nextProps.isPullToRefresh !== this.props.isPullToRefresh) {
            this.setRightAction(nextProps);
        }
    }
    shouldComponentUpdate(nextProps) {
        if (
            nextProps.isPullToRefresh !== this.props.isPullToRefresh ||
            nextProps.isSelect !== this.props.isSelect ||
            nextProps.isOpenAction !== this.props.isOpenAction ||
            nextProps.isDisable !== this.props.isDisable
        ) {
            return true;
        } else {
            return false;
        }
    }
    formatStringType = (data, col) => {
        if (data[col.Name]) {
            if (col.DataType && col.DataType.toLowerCase() == 'datetime') {
                return moment(data[col.Name]).format(col.DataFormat);
            }
            if (col.DataType && col.DataType.toLowerCase() == 'double') {
                return format(col.DataFormat, data[col.Name]);
            } else {
                return data[col.Name];
            }
        } else {
            return '';
        }
    };

    rightActionsEmpty = () => {
        return <View style={CustomStyleSheet.width(0)} />;
    };

    convertTextToColor = (value) => {
        const [num1, num2, num3, opacity] = value.split(',');
        return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
    };

    render() {
        const { dataItem, index, listItemOpenSwipeOut, rowActions, isOpenAction } = this.props;

        let ImageIcon = null;

        const { apiConfig } = dataVnrStorage;

        if (dataItem?.CriteriaIcon && apiConfig?.uriMain) {
            ImageIcon = apiConfig?.uriMain + '/Uploads/' + dataItem?.CriteriaIcon;
        }

        let permissionRightAction =
            rowActions != null &&
            Array.isArray(rowActions) &&
            rowActions.length > 0 &&
            !isOpenAction &&
            this.rightListActions &&
            Array.isArray(this.rightListActions) &&
            this.rightListActions.length > 0
                ? true
                : false;

        return (
            <Swipeable
                ref={(ref) => {
                    this.Swipe = ref;
                    if (
                        listItemOpenSwipeOut.findIndex((value) => {
                            return value['ID'] == index;
                        }) < 0
                    ) {
                        listItemOpenSwipeOut.push({ ID: index, value: ref });
                    } else {
                        listItemOpenSwipeOut[index].value = ref;
                    }
                }}
                overshootRight={false}
                renderRightActions={
                    permissionRightAction
                        ? () => <RightActions rowActions={rowActions} dataItem={dataItem} />
                        : this.rightActionsEmpty
                }
                friction={0.6}
                containerStyle={[styles.swipeable]}
            >
                <View
                    style={[styles.swipeableLayout]}
                    activeOpacity={1}
                    disabled={rowActions === null || (Array.isArray(rowActions) && rowActions.length === 0)}
                    onPress={() => {
                        if (rowActions === null || (Array.isArray(rowActions) && rowActions.length === 0)) {
                            return;
                        } else {
                            this.props.onClick();
                        }
                    }}
                >
                    {
                        <View style={styles.left_isCheckbox}>
                            <View style={[styles.styRanked]}>
                                {this.props?.index + 1 === 1 ? (
                                    <Image source={require('../../../../../assets/images/compliment/Rank1.png')} />
                                ) : this.props?.index + 1 === 2 ? (
                                    <Image source={require('../../../../../assets/images/compliment/Rank2.png')} />
                                ) : this.props?.index + 1 === 3 ? (
                                    <Image source={require('../../../../../assets/images/compliment/Rank3.png')} />
                                ) : (
                                    <Text style={stylesScreenDetailV3.styProfileText}>{this.props?.index + 1}</Text>
                                )}
                            </View>
                        </View>
                    }
                    {/* styles.container */}
                    <View style={[styles.btnRight_ViewDetail]}>
                        <View style={[CustomStyleSheet.flex(1)]}>
                            <View style={[styles.contentMain]} key={index}>
                                {/* top */}
                                <View style={styles.styViewTop}>
                                    {/* Top - left */}
                                    <View style={[styles.styleTopLeft]}>
                                        <View style={styles.viewContentTopRight}>
                                            <View>
                                                <ImageBackground
                                                    source={{ uri: ImageIcon }}
                                                    resizeMode="cover"
                                                    style={styles.circle36}
                                                    imageStyle={[styles.circle36, styles.styImageBackground]}
                                                >
                                                    <Image
                                                        source={require('../../../../../assets/images/compliment/PraisedDefault.png')}
                                                        style={styles.circle36}
                                                    />
                                                </ImageBackground>
                                            </View>
                                        </View>
                                        <View style={CustomStyleSheet.flex(1)}>
                                            <View>
                                                <Text
                                                    numberOfLines={1}
                                                    adjustsFontSizeToFit
                                                    style={[styleSheets.lable, styles.styleTextViewTop]}
                                                >
                                                    {dataItem?.CriteriaName ? dataItem.CriteriaName : ''}
                                                </Text>
                                            </View>
                                            <View style={CustomStyleSheet.flex(1)}>
                                                <Text
                                                    numberOfLines={2}
                                                    adjustsFontSizeToFit
                                                    style={[
                                                        styleSheets.lable,
                                                        styles.styleTextViewTop,
                                                        styles.textGroup
                                                    ]}
                                                >
                                                    {dataItem?.GroupName ? dataItem.GroupName : ''}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Top - right */}
                                    <View style={styles.styViewDate}>
                                        <IconHeart size={18} color={Colors.volcano} />
                                        <Text numberOfLines={2} style={[styles.pointBottom, styles.styTextPointBottom]}>
                                            {dataItem?.Rating
                                                ? dataItem?.Rating + ' ' + translate('HRM_PortalApp_InTurn')
                                                : ''}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    </View>
                </View>
            </Swipeable>
        );
    }
}

const styles = StyleSheet.create({
    styTextPointBottom: { maxWidth: '100%' },
    styImageBackground: { zIndex: 2, elevation: 2 },
    styViewDate: {
        width: '25%',
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '25%'
    },
    swipeable: {
        flex: 1
    },
    swipeableLayout: {
        flex: 1,
        backgroundColor: Colors.white,
        flexDirection: 'row'
    },

    styRanked: {
        width: Size.iconSize - 3,
        height: Size.iconSize - 3,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 30,
        minWidth: 30
    },

    contentMain: {
        flex: 1,
        paddingVertical: Size.defineSpace / 2,
        paddingHorizontal: Size.defineSpace / 2
    },
    styViewTop: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
        // marginBottom: Size.defineHalfSpace,
    },

    styleTextViewTop: {
        // fontWeight: fw,
        color: Colors.gray_10,
        fontSize: Size.text + 1,
        fontWeight: fw600
    },

    left_isCheckbox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 6
    },

    btnRight_ViewDetail: {
        flex: 1,
        zIndex: 1,
        elevation: 1,
        paddingRight: 12
    },

    viewContentTopRight: {
        justifyContent: 'center',
        paddingRight: 12
    },

    circle36: {
        width: 36,
        height: 36,
        borderRadius: 36
    },

    styleTopLeft: {
        flex: 1,
        width: '70%',
        flexDirection: 'row',
        alignItems: 'center'
    },

    pointBottom: {
        fontSize: Size.text,
        fontWeight: fw600,
        marginLeft: 4
    },

    textGroup: {
        maxWidth: '95%',
        fontSize: Size.text,
        color: Colors.gray_7
    }
});
