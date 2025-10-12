import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Platform,
    Dimensions,
    TouchableWithoutFeedback
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, CustomStyleSheet, Size, styleSheets, stylesScreenDetailV3 } from '../../../../../constants/styleConfig';
import moment from 'moment';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';
import {
    IconCheck,
    IconInfo,
    IconSwapright,
    IconChat,
    IconDate
} from '../../../../../constants/Icons';
import Color from 'color';
import RightActions from '../../../../../componentsV3/ListButtonMenuRight/RightActions';

export default class AttTakeBusinessTripListItemApprove extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.setRightAction(props);
        this.Swipe = null;
    }

    setRightAction = thisProps => {
        const { dataItem } = thisProps;
        // dataItem.BusinessAllowAction = ['E_MODIFY', 'E_SENDMAIL', 'E_DELETE', 'E_APPROVE', 'E_REJECT', 'E_CANCEL']
        this.sheetActions = [
            {
                title: translate('HRM_Common_Close'),
                onPress: null
            }
        ];
        if (!Vnr_Function.CheckIsNullOrEmpty(thisProps.rowActions)) {
            this.rightListActions = thisProps.rowActions.filter(item => {
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

    rightActionsEmpty = () => {
        return <View style={CustomStyleSheet.width(0)} />;
    };

    convertTextToColor = value => {
        const [num1, num2, num3, opacity] = value.split(',');
        return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
    };

    renderAvatar = () => {
        const { dataItem } = this.props,
            { ProfileInfo } = dataItem,
            fullName = ProfileInfo && ProfileInfo.ProfileName ? ProfileInfo.ProfileName : '',
            randomColor = Vnr_Function.randomColorV3(fullName),
            { PrimaryColor, SecondaryColor, FirstCharName } = randomColor;

        let imageAvatar = null;

        if (ProfileInfo && ProfileInfo.ImagePath && Vnr_Function.checkIsPath(ProfileInfo.ImagePath)) {
            imageAvatar = { uri: ProfileInfo.ImagePath };
        }

        if (imageAvatar) {
            return <Image source={imageAvatar} style={styles.leftContentIcon} />;
        } else {
            return (
                <View style={[styles.leftContentIcon, { backgroundColor: SecondaryColor }]}>
                    <Text
                        style={[
                            styleSheets.textFontMedium,
                            {
                                color: PrimaryColor
                            }
                        ]}
                    >
                        {FirstCharName}
                    </Text>
                </View>
            );
        }
    };

    formatPlace = (dataItem) => {
        if (dataItem?.PlaceFrom && dataItem?.PlaceTo) {
            return (
                <Text style={[styleSheets.lable, styles.styleTextType]}
                    numberOfLines={2}>
                    {dataItem?.PlaceFrom} <IconSwapright size={Size.iconSize - 8} color={Colors.black} /> {dataItem?.PlaceTo}
                </Text>
            );
        } else if (dataItem?.PlaceOutToName) {
            return <Text style={[styleSheets.lable, styles.styleTextType]}
                numberOfLines={2}>{dataItem?.PlaceOutToName}</Text>;
        }
        return null
    }

    render() {
        const {
            dataItem,
            index,
            listItemOpenSwipeOut,
            rowActions,
            isOpenAction,
            isDisable,
            handerOpenSwipeOut
        } = this.props;

        let textFieldDate = '',
            textFieldPlace = '',
            colorStatusView = null,
            bgStatusView = null,
            isHaveAvatar = false
        textFieldPlace = this.formatPlace(dataItem);

        // xử lý color
        if (dataItem.itemStatus) {
            const { colorStatus, bgStatus } = dataItem.itemStatus;
            colorStatusView = colorStatus ? colorStatus : null;
            bgStatusView = bgStatus ? bgStatus : null;
        }

        if (dataItem?.DateFrom != null && dataItem?.DateTo != null) {
            // xử lý dateStart và dateEnd
            let dateStart = dataItem?.DateFrom ? dataItem?.DateFrom : null,
                dateEnd = dataItem?.DateTo ? dataItem?.DateTo : null,
                TimeCouse = '';

            let dmyStart = moment(dateStart).format('DD/MM/YYYY'),
                dmyEnd = moment(dateEnd).format('DD/MM/YYYY'),
                myStart = moment(dateStart).format('MM/YYYY'),
                myEnd = moment(dateEnd).format('MM/YYYY'),
                yStart = moment(dateStart).format('YYYY'),
                yEnd = moment(dateEnd).format('YYYY'),
                dStart = moment(dateStart).format('DD'),
                dEnd = moment(dateEnd).format('DD'),
                dmStart = moment(dateStart).format('DD/MM');
            if (dmyStart === dmyEnd) {
                TimeCouse = dmyStart;
            } else if (myStart === myEnd) {
                TimeCouse = `${dStart} - ${dEnd}/${myStart}`;
            } else if (yStart === yEnd) {
                TimeCouse = `${dmStart} - ${dmyEnd}`;
            } else {
                TimeCouse = `${dmyStart} - ${dmyEnd}`;
            }

            textFieldDate = TimeCouse;
        }

        const { DataStatus } = dataItem;
        isHaveAvatar = DataStatus?.UserProcessName ? true : false;

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
                ref={ref => {
                    this.Swipe = ref;
                    if (
                        listItemOpenSwipeOut.findIndex(value => {
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
                containerStyle={styles.swipeable}
            >
                <View style={[styles.swipeableLayout]}>
                    <View style={styles.left_isCheckbox}>
                        {rowActions === null || (Array.isArray(rowActions) && rowActions.length === 0) ? null : (
                            <View
                                style={[
                                    styles.styRadiusCheck,
                                    this.props.isSelect && stylesScreenDetailV3.checkAll
                                ]}
                            >
                                {this.props.isSelect && <IconCheck size={Size.iconSize - 10} color={Colors.white} />}
                            </View>
                        )}
                        <TouchableOpacity
                            style={[
                                styles.btnLeft_check,
                                (rowActions === null || (Array.isArray(rowActions) && rowActions.length === 0)) && {
                                    ...CustomStyleSheet.zIndex(1),
                                    ...CustomStyleSheet.elevation(1)
                                }
                            ]}
                            activeOpacity={isDisable ? 1 : 0.8}
                            onPress={() => {
                                if (rowActions === null || (Array.isArray(rowActions) && rowActions.length === 0)) {
                                    this.props.onMoveDetail();
                                } else {
                                    this.props.onClick();
                                }
                            }}
                        />
                    </View>
                    {/* styles.container */}
                    <TouchableWithoutFeedback
                        onPressIn={() => handerOpenSwipeOut && handerOpenSwipeOut(index)}
                        onPress={() => {
                            this.props.onMoveDetail();
                        }}
                    >
                        <View style={styles.btnRight_ViewDetail}>
                            <View style={[CustomStyleSheet.flex(1)]}>
                                <View style={[styles.contentMain]} key={index}>
                                    {/* top */}
                                    <View style={styles.styViewTop}>
                                        {/* Top - left */}
                                        <View style={[CustomStyleSheet.width('70%'), styles.styViewHidden]}>
                                            <View style={[styles.styleFlex1_row_AlignCenter, CustomStyleSheet.marginBottom(4)]}>
                                                <Text style={[styleSheets.lable, styles.styleTextViewTop]}>
                                                    {textFieldDate}
                                                </Text>
                                                <View style={styles.wrapNumberLeaveDay}>
                                                    <Text numberOfLines={1} style={[styleSheets.lable, styles.styleTextNum]}>
                                                        {dataItem?.DataRegister?.BusinessTravelName
                                                            ? dataItem?.DataRegister?.BusinessTravelName
                                                            : ''}
                                                    </Text>
                                                </View>
                                            </View>

                                            <View style={CustomStyleSheet.flex(1)}>
                                                <View style={styles.styleFlex1_row_AlignCenter}>
                                                    {textFieldPlace}
                                                </View>
                                            </View>
                                        </View>

                                        {/* Top - right */}
                                        <View style={styles.viewContentTopRight}>
                                            <View
                                                style={[
                                                    styles.lineSatus,
                                                    {
                                                        backgroundColor: bgStatusView ? this.convertTextToColor(bgStatusView) : Colors.white
                                                    }
                                                ]}
                                            >
                                                <Text
                                                    numberOfLines={1}
                                                    style={[
                                                        styleSheets.text,
                                                        styles.lineSatus_text,
                                                        {
                                                            color: colorStatusView ? colorStatusView : Colors.gray_10
                                                        }
                                                    ]}
                                                >
                                                    {DataStatus && DataStatus.StatusView ? DataStatus.StatusView : ''}
                                                </Text>
                                            </View>
                                        </View>
                                    </View>

                                    {/* cennter */}
                                    {!Vnr_Function.CheckIsNullOrEmpty(dataItem.DataNote) && (
                                        <View style={styles.wrapContentCenter}>
                                            <View style={styles.styIconMess}>
                                                <IconChat size={Size.text + 1} color={Colors.gray_8} />
                                            </View>
                                            <View style={styles.wrapReason}>
                                                <Text
                                                    numberOfLines={2}
                                                    style={[styleSheets.text, styles.viewReason_text]}
                                                >
                                                    {dataItem.DataNote ? `${dataItem.DataNote}` : ''}
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                                <View style={[styles.viewStatusBottom]}>
                                    <View style={[styles.leftContent, isDisable ? styleSheets.opacity05 : styleSheets.opacity1]}>
                                        {isHaveAvatar
                                            ? Vnr_Function.renderAvatarCricleByName(
                                                DataStatus.ImagePath,
                                                  DataStatus?.UserProcessName,
                                                  20
                                            )
                                            : null}
                                    </View>
                                    {isHaveAvatar ? (
                                        <View style={styles.styUserApprove}>
                                            <Text numberOfLines={1} style={[styleSheets.lable, styles.textProfileName]}>
                                                {dataItem?.DataStatus?.UserProcessNameForApp
                                                    ? dataItem?.DataStatus?.UserProcessNameForApp
                                                    : DataStatus?.UserProcessName
                                                        ? DataStatus?.UserProcessName
                                                        : null}
                                            </Text>
                                        </View>
                                    ) : (
                                        <View style={styles.styUserApprove} />
                                    )}

                                    {dataItem?.DateUpdate && (
                                        <View style={styles.styViewDate}>
                                            {isHaveAvatar && (
                                                <Text style={[styleSheets.text, styles.dateTimeSubmit_Text]}>
                                                    {'|  '}
                                                </Text>
                                            )}

                                            <IconDate size={Size.text - 1} color={Colors.gray_7} />

                                            <Text style={[styleSheets.text, styles.dateTimeSubmit_Text]}>
                                                {moment(dataItem.DateUpdate).format('DD/MM/YYYY')}
                                            </Text>
                                        </View>
                                    )}
                                </View>
                                {dataItem.WarningViolation && (
                                    <View style={styles.viewLimitTitle}>
                                        <IconInfo color={Colors.red} size={Size.text} />
                                        <Text
                                            numberOfLines={1}
                                            style={[styleSheets.lable, styles.viewReasoLimitTitle_text]}
                                        >
                                            {translate('HRM_Attendance_Limit_Violation_Title')}
                                        </Text>
                                    </View>
                                )}
                            </View>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </Swipeable>
        );
    }
}

const PADDING_DEFINE = Size.defineSpace;
const styles = StyleSheet.create({
    styViewHidden: { overflow: 'hidden' },
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
    lineSatus: {
        paddingHorizontal: 6,
        alignItems: 'center',
        paddingVertical: 2,
        // padding: 4,
        borderRadius: Size.borderRadiusCircle
    },

    lineSatus_text: {
        fontSize: Size.text - 3,
        fontWeight: '500'
    },
    viewReason_text: {
        fontSize: Size.text,
        color: Colors.gray_10
    },
    dateTimeSubmit_Text: {
        fontSize: Size.text - 2,
        color: Colors.gray_8,
        marginLeft: 3
    },
    viewLimitTitle: {
        width: '100%',
        marginBottom: PADDING_DEFINE / 2,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    viewReasoLimitTitle_text: {
        fontSize: Size.text - 1,
        color: Colors.red,
        marginLeft: 5
    },
    left_isCheckbox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingLeft: 16
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
    btnLeft_check: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: Dimensions.get('window').width / 2,
        zIndex: 2,
        elevation: 2
    },
    btnRight_ViewDetail: {
        flex: 1,
        zIndex: 1,
        elevation: 1
    },
    styleFlex1_row_AlignCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingRight: 6
    },
    contentMain: {
        flex: 1,
        paddingTop: Size.defineSpace
        // paddingHorizontal: Size.defineSpace,
    },
    styViewTop: {
        flexDirection: 'row',
        justifyContent: 'space-between'
        // marginBottom: Size.defineHalfSpace,
    },
    wrapNumberLeaveDay: {
        backgroundColor: Colors.gray_5,
        paddingHorizontal: 4,
        marginLeft: 6,
        paddingVertical: 1,
        maxWidth: 150
    },
    styleTextViewTop: {
        // fontWeight: fw,
        color: Colors.gray_10,
        fontSize: Size.text + 1
    },
    styleTextNum: {
        fontSize: Size.text - 1
    },
    styleTextType: {
        fontWeight: Platform.OS == 'android' ? '600' : '500',
        color: Colors.gray_10,
        fontSize: Size.text - 2
    },
    viewContentTopRight: {
        // width: '30%',
        maxWidth: '33%',
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
    styViewDate: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 2
    },
    styUserApprove: {
        flexShrink: 1
    },
    textProfileName: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.blue
    },
    leftContent: {
        marginRight: 5
    }
});
