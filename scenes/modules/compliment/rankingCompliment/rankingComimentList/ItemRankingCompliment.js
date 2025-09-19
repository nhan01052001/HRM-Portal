import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Animated,
    TouchableWithoutFeedback,
    Dimensions,
    Platform,
    ScrollView,
    ImageBackground
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, Size, styleSheets, stylesScreenDetailV3 } from '../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';
import { IconInfo, IconCheck, IconDate, IconChat } from '../../../../../constants/Icons';
import VnrText from '../../../../../components/VnrText/VnrText';
import Color from 'color';
import RightActions from '../../../../../componentsV3/ListButtonMenuRight/RightActions';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { ScreenName } from '../../../../../assets/constant';

const fw = Platform.OS == 'android' ? '700' : '500';
const fw600 = Platform.OS == 'android' ? '600' : '400';

export default class ItemRankingCompliment extends React.Component {
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
                item.title = item.title;
                return (
                    !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction) &&
                    dataItem.BusinessAllowAction.indexOf(item.type) >= 0
                );
            });
        }
    };
    componentWillReceiveProps(nextProps) {
        if (nextProps.isPullToRefresh !== this.props.isPullToRefresh) {
            this.setRightAction(nextProps);
        }
    }
    shouldComponentUpdate(nextProps, nextState) {
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
        return <View style={{ width: 0 }} />;
    };

    convertTextToColor = (value) => {
        const [num1, num2, num3, opacity] = value.split(',');
        return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
    };

    render() {
        const { dataItem, index, listItemOpenSwipeOut, rowActions, isOpenAction, isDisable } = this.props;

        let colorStatusView = null,
            borderStatusView = null,
            bgStatusView = null,
            ImagePath = null,
            ImageIcon = null;

        const { apiConfig } = dataVnrStorage;

        if (dataItem?.ImagePath && apiConfig?.uriMain) {
            ImagePath = apiConfig?.uriMain + '/Images/' + dataItem?.ImagePath;
        }

        if (dataItem?.Icon && apiConfig?.uriMain) {
            ImageIcon = apiConfig?.uriMain + '/Uploads/' + dataItem?.Icon;
        }

        // xử lý color
        if (dataItem.itemStatus) {
            const { colorStatus, borderStatus, bgStatus } = dataItem.itemStatus;
            colorStatusView = colorStatus ? colorStatus : null;
            borderStatusView = borderStatus ? borderStatus : null;
            bgStatusView = bgStatus ? bgStatus : null;
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

        let isScreenName_RankingDepartment = this.props?.screenName === ScreenName.RankingDepartment ? true : false;

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
                        } else {
                            this.props.onClick();
                        }
                    }}
                >
                    {!isScreenName_RankingDepartment && (
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
                    )}
                    {/* styles.container */}
                    <View style={[styles.btnRight_ViewDetail, isScreenName_RankingDepartment && { paddingLeft: 8 }]}>
                        <View style={[{ flex: 1 }]}>
                            <View style={[styles.contentMain]} key={index}>
                                {/* top */}
                                <View style={styles.styViewTop}>
                                    {/* Top - left */}
                                    <View style={styles.styleTopLeft}>
                                        <View style={styles.viewContentTopRight}>
                                            <View>
                                                {typeof dataItem?.ProfileName === 'string' &&
                                                    dataItem?.ProfileName.trim().length > 0 &&
                                                    Vnr_Function.renderAvatarCricleByName(
                                                        ImagePath,
                                                        dataItem?.ProfileName,
                                                        36
                                                    )}
                                            </View>
                                        </View>
                                        <View>
                                            <View>
                                                <Text
                                                    numberOfLines={1}
                                                    adjustsFontSizeToFit
                                                    style={[styleSheets.lable, styles.styleTextViewTop]}
                                                >
                                                    {isScreenName_RankingDepartment
                                                        ? dataItem?.OrgStructureName
                                                            ? dataItem?.OrgStructureName
                                                            : ''
                                                        : dataItem?.ProfileName
                                                          ? dataItem.ProfileName
                                                          : ''}
                                                </Text>
                                            </View>
                                            <View>
                                                <Text
                                                    numberOfLines={1}
                                                    adjustsFontSizeToFit
                                                    style={[
                                                        styleSheets.lable,
                                                        styles.styleTextViewTop,
                                                        { fontSize: Size.text, color: Colors.gray_7 }
                                                    ]}
                                                >
                                                    {isScreenName_RankingDepartment
                                                        ? dataItem?.PraisedOnEmp
                                                            ? translate('HRM_PortalApp_PraisedEmployee')
                                                            : ''
                                                        : dataItem?.JobTitleName
                                                          ? dataItem.JobTitleName
                                                          : ''}
                                                    {isScreenName_RankingDepartment && dataItem?.PraisedOnEmp && (
                                                        <Text style={{ color: Colors.gray_10 }}>
                                                            {dataItem?.PraisedOnEmp}
                                                        </Text>
                                                    )}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* Top - right */}
                                    <View>
                                        <View
                                            style={[
                                                styles.wrapPoint,
                                                this.props.color === 'blue' && {
                                                    backgroundColor: 'rgba(9, 113, 220, 0.08)'
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
                                                {isScreenName_RankingDepartment
                                                    ? dataItem?.TotalPoint
                                                        ? dataItem?.TotalPoint
                                                        : '0'
                                                    : dataItem?.RootCumulativePoint
                                                      ? dataItem.RootCumulativePoint
                                                      : '0'}{' '}
                                                {translate('Point')}
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
                                {Array.isArray(dataItem?.ListComplimentGroup) &&
                                    dataItem?.ListComplimentGroup.length > 0 && (
                                        <ScrollView
                                            horizontal={true}
                                            showsHorizontalScrollIndicator={false}
                                            style={{ paddingVertical: 6, zIndex: 99, elevation: 99 }}
                                        >
                                            {dataItem?.ListComplimentGroup.map((item) => {
                                                return (
                                                    <View style={[styles.styleTopLeft, { marginHorizontal: 6 }]}>
                                                        <ImageBackground
                                                            source={{
                                                                uri: `${apiConfig?.uriMain + '/Uploads/' + item?.Icon}`
                                                            }}
                                                            resizeMode="cover"
                                                            style={styles.circle20}
                                                            imageStyle={[styles.circle20, { zIndex: 2, elevation: 2 }]}
                                                        >
                                                            <Image
                                                                source={require('../../../../../assets/images/compliment/PraisedDefault.png')}
                                                                style={styles.circle20}
                                                            />
                                                        </ImageBackground>
                                                        <Text style={styles.pointBottom}>{item?.Point}</Text>
                                                    </View>
                                                );
                                            })}
                                        </ScrollView>
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
    container: {
        flex: 1
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

    styRanked: {
        width: Size.iconSize - 3,
        height: Size.iconSize - 3,
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: 30,
        minWidth: 30
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
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
        // marginBottom: Size.defineHalfSpace,
    },
    leftContent: {
        marginRight: 5
    },

    styleTextViewTop: {
        // fontWeight: fw,
        color: Colors.gray_10,
        fontSize: Size.text + 1,
        fontWeight: fw600
    },
    styleTextNum: {
        fontSize: Size.text - 1
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
        fontWeight: fw600,
        color: Colors.blue
    },

    circle36: {
        width: 36,
        height: 36,
        borderRadius: 36
    },

    wrapPoint: {
        backgroundColor: 'rgba(250, 84, 28, 0.08)',
        paddingVertical: 2,
        paddingHorizontal: 6,
        alignSelf: 'flex-start'
    },

    itemSelected: {
        backgroundColor: Colors.primary,
        borderRadius: 100,
        borderWidth: 0
    },

    circle20: {
        width: 20,
        height: 20,
        borderRadius: 20
    },

    styleTopLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    },

    pointBottom: {
        fontSize: Size.text,
        fontWeight: fw600,
        marginLeft: 4
    }
});
