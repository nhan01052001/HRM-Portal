import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated, ImageBackground } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';
import { IconCheck, IconDate, IconChat } from '../../../../../constants/Icons';
import Color from 'color';
import RightActions from '../../../../../componentsV3/ListButtonMenuRight/RightActions';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';

export default class ItemHistoryOfComCompliment extends React.Component {
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
        const { dataItem, index, listItemOpenSwipeOut, rowActions, isOpenAction, isDisable } = this.props;

        let ImagePath = null,
            ImageIcon = null;

        const { apiConfig } = dataVnrStorage;

        if (dataItem?.ImagePath && apiConfig?.uriMain) {
            ImagePath = apiConfig?.uriMain + '/Images/' + dataItem?.ImagePath;
        }

        if (dataItem?.Icon && apiConfig?.uriMain) {
            ImageIcon = apiConfig?.uriMain + '/Uploads/' + dataItem?.Icon;
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
                <TouchableOpacity
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
                    <View style={styles.left_isCheckbox}>
                        {rowActions === null || (Array.isArray(rowActions) && rowActions.length === 0) ? null : (
                            <View style={[styles.styRadiusCheck, this.props.isSelect && styles.itemSelected]}>
                                {this.props.isSelect && <IconCheck size={Size.iconSize - 10} color={Colors.white} />}
                            </View>
                        )}
                    </View>
                    {/* styles.container */}
                    <View activeOpacity={1} style={styles.btnRight_ViewDetail}>
                        <View style={[CustomStyleSheet.flex(1)]}>
                            <View style={[styles.contentMain]} key={index}>
                                {/* top */}
                                <View style={styles.styViewTop}>
                                    {/* Top - left */}
                                    <View style={styles.viewContentTopRight}>
                                        <View>
                                            {/* {
                        ImageIcon ? (
                          <Image source={{ uri: ImageIcon }} style={styles.circle36} />
                        ) : (
                          <Image source={require('../../../../../assets/images/compliment/PraisedDefault.png')} style={styles.circle36} />
                        )
                      } */}
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

                                    {/* Top - right */}
                                    <View>
                                        <View>
                                            <Text
                                                numberOfLines={1}
                                                adjustsFontSizeToFit
                                                style={[styleSheets.lable, styles.styleTextViewTop]}
                                            >
                                                {dataItem?.CriteriaName ? dataItem.CriteriaName : ''}
                                            </Text>
                                        </View>
                                        <View
                                            style={[
                                                styles.wrapPoint,
                                                this.props.color === 'blue' && {
                                                    backgroundColor: Colors.blue_transparent_8
                                                }
                                            ]}
                                        >
                                            <Text
                                                style={[
                                                    styleSheets.lable,
                                                    styles.styleTextNum,
                                                    this.props.color === 'blue'
                                                        ? { color: Colors.blue }
                                                        : { color: Colors.volcano }
                                                ]}
                                            >
                                                {dataItem?.Point ? dataItem.Point : '0'} {translate('Point')}
                                            </Text>
                                        </View>
                                    </View>
                                </View>

                                {/* cennter */}
                                {dataItem.Note != null && (
                                    <View style={styles.wrapContentCenter}>
                                        <View style={styles.styIconMess}>
                                            <IconChat size={Size.text + 1} color={Colors.gray_8} />
                                        </View>
                                        <View style={styles.wrapReason}>
                                            <Text numberOfLines={2} style={[styleSheets.text, styles.viewReason_text]}>
                                                {dataItem.Note ? `${dataItem.Note}` : ''}
                                            </Text>
                                        </View>
                                    </View>
                                )}
                            </View>
                            <View style={[styles.viewStatusBottom]}>
                                <View
                                    style={[
                                        styles.leftContent,
                                        isDisable ? styleSheets.opacity05 : styleSheets.opacity1
                                    ]}
                                >
                                    {typeof dataItem?.ProfileName === 'string' &&
                                        dataItem?.ProfileName.trim().length > 0 &&
                                        Vnr_Function.renderAvatarCricleByName(ImagePath, dataItem?.ProfileName, 20)}
                                </View>
                                <View style={styles.styUserApprove}>
                                    <Text numberOfLines={1} style={[styleSheets.lable, styles.textProfileName]}>
                                        {dataItem?.ProfileName
                                            ? dataItem?.ProfileName +
                                              ' (' +
                                              translate('HRM_Com_Tab_History_Praised') +
                                              ') '
                                            : ''}
                                    </Text>
                                </View>
                                {dataItem?.RecordDate && (
                                    <View style={styles.styViewDate}>
                                        <Text style={[styleSheets.text, styles.dateTimeSubmit_Text]}>{'|  '}</Text>

                                        <IconDate size={Size.text - 1} color={Colors.gray_7} />

                                        <Text style={[styleSheets.text, styles.dateTimeSubmit_Text]}>
                                            {moment(dataItem.RecordDate).format('DD/MM/YYYY')}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </View>
                </TouchableOpacity>
            </Swipeable>
        );
    }
}

const PADDING_DEFINE = Size.defineSpace;
const styles = StyleSheet.create({
    styImageBackground: { zIndex: 2, elevation: 2 },
    styUserApprove: {
        flexShrink: 1
    },
    styViewDate: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 2
    },
    swipeable: {
        flex: 1
    },
    swipeableLayout: {
        flex: 1,
        backgroundColor: Colors.white,
        flexDirection: 'row'
    },
    viewStatusBottom: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: PADDING_DEFINE / 2,
        paddingRight: Size.defineSpace,
        flexDirection: 'row'
    },

    viewReason_text: {
        fontSize: Size.textSmall,
        color: Colors.gray_9
    },

    styRadiusCheck: {
        width: Size.iconSize - 3,
        height: Size.iconSize - 3,
        borderRadius: (Size.iconSize - 3) / 2,
        borderWidth: 1,
        borderColor: Colors.gray_8,
        justifyContent: 'center',
        alignItems: 'center'
    },

    dateTimeSubmit_Text: {
        fontSize: Size.text - 2,
        color: Colors.gray_8,
        marginLeft: 3
    },
    contentMain: {
        flex: 1,
        paddingTop: Size.defineSpace
        // paddingHorizontal: Size.defineSpace,
    },
    styViewTop: {
        flexDirection: 'row'
        // justifyContent: 'space-between',
        // marginBottom: Size.defineHalfSpace,
    },
    leftContent: {
        marginRight: 5
    },

    styleTextViewTop: {
        // fontWeight: fw,
        color: Colors.gray_10,
        fontSize: Size.text + 1
    },
    styleTextNum: {
        fontSize: Size.text - 1
    },

    left_isCheckbox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingLeft: 16
    },

    btnRight_ViewDetail: {
        flex: 1,
        zIndex: 1,
        elevation: 1
    },

    viewContentTopRight: {
        justifyContent: 'center',
        paddingRight: 12
    },

    wrapContentCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4
    },
    styIconMess: {
        marginTop: 3
    },
    wrapReason: {
        width: '92%',
        paddingRight: 12,
        paddingLeft: 6,
        marginTop: 2
    },

    textProfileName: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.blue
    },

    circle36: {
        width: 36,
        height: 36,
        borderRadius: 36
    },

    wrapPoint: {
        backgroundColor: Colors.brown_tranparent,
        paddingVertical: 2,
        paddingHorizontal: 6,
        alignSelf: 'flex-start'
    },

    itemSelected: {
        backgroundColor: Colors.primary,
        borderRadius: 100,
        borderWidth: 0
    }
});
