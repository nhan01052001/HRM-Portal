import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    TouchableWithoutFeedback,
    Dimensions
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, CustomStyleSheet, Size, styleSheets, stylesScreenDetailV3 } from '../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';
import {
    IconCheck,
    IconDate,
    IconChat
} from '../../../../../constants/Icons';
import Color from 'color';
import RightActions from '../../../../../componentsV3/ListButtonMenuRight/RightActions';
import { dataConvertDate } from '../attSubmitShiftChange/AttSubmitShiftChangeAddOrEdit';

export default class AttShiftChangeListItem extends React.Component {
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
    setRightAction = thisProps => {
        const { dataItem } = thisProps;
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

    convertTextToColor = value => {
        const [num1, num2, num3, opacity] = value.split(',');
        return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
    };

    render() {
        const {
            dataItem,
            index,
            listItemOpenSwipeOut,
            rowActions,
            isOpenAction,
            isDisable,
            hiddenFiled,
            handerOpenSwipeOut
        } = this.props;

        let colorStatusView = null,
            textFieldSalary = '',
            bgStatusView = null,
            isHaveAvatar = false,
            dateChangeShift = null,
            nameChangeShift = null;

        hiddenFiled &&
            typeof hiddenFiled == 'object' &&
            Object.keys(hiddenFiled).forEach(key => {
                if (!hiddenFiled[key]) {
                    dataItem[key] = null;
                }
            });

        const { DataStatus } = dataItem;
        isHaveAvatar = DataStatus?.UserProcessName ? true : false;

        // xử lý color
        if (dataItem.itemStatus) {
            const { colorStatus, bgStatus } = dataItem.itemStatus;
            colorStatusView = colorStatus ? colorStatus : null;
            bgStatusView = bgStatus ? bgStatus : null;
        }

        if (dataItem.SalaryClassName) {
            textFieldSalary = `${dataItem.SalaryClassName}`;
        }
        if (dataItem.PositionName) {
            if (textFieldSalary != '') {
                textFieldSalary = `${textFieldSalary} | ${dataItem.PositionName}`;
            } else {
                textFieldSalary = `${dataItem.PositionName}`;
            }
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

        const CHAR = '->';
        if (dataItem?.StrChangeDate && dataItem?.StrChangeDate.split(CHAR)?.length === 2) {
            dateChangeShift = <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                allowFontScaling
                style={[styleSheets.lable, styles.styleTextViewTop]}
            >
                <Text style={styles.lineThrough}>
                    {dataItem?.StrChangeDate.split(CHAR)[0]}
                </Text>
                {' '}
                <Text>
                    {CHAR}{dataItem?.StrChangeDate.split(CHAR)[1]}
                </Text>
            </Text>
        } else if (dataItem?.DateStart && dataItem?.DateEnd) {
            dateChangeShift = <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                allowFontScaling
                style={[styleSheets.lable, styles.styleTextViewTop]}
            >
                <Text style={styles.lineThrough}>{moment(dataItem?.DateStart).format('DD/MM/YYYY')}</Text>
                {' '}
                <Text>
                    {CHAR}{moment(dataItem?.DateEnd).format('DD/MM/YYYY')}
                </Text>
            </Text>
        }

        if (dataItem?.ReplacementStaff && dataItem?.ChangeDate && dataItem[`${dataConvertDate[moment(dataItem.ChangeDate).weekday()].split('|')[1]}Name`]) {
            nameChangeShift = <Text
                numberOfLines={1}
                adjustsFontSizeToFit
                allowFontScaling
                style={[styleSheets.lable, styles.styleTextViewTop]}
            >
                {dataItem[`${dataConvertDate[moment(dataItem.ChangeDate).weekday()].split('|')[1]}Name`]}
            </Text>
        } else {
            for (let i = 0; i < 7; i++) {
                let itemConvertDate = dataConvertDate[i].split('|'),
                    shiftName = itemConvertDate[1];
                if (dataItem[`${shiftName}Name`] && dataItem[`${shiftName}NameBefore`]) {
                    nameChangeShift = <Text
                        numberOfLines={2}
                        adjustsFontSizeToFit
                        allowFontScaling
                        style={[styleSheets.lable, styles.styleTextViewTop]}
                    >
                        <Text style={styles.lineThrough}>{dataItem[`${shiftName}NameBefore`]}</Text>
                        {' '}
                        <Text>
                            {CHAR} {dataItem[`${shiftName}Name`]}
                        </Text>
                    </Text>

                    break;
                }
            }
        }

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
                containerStyle={[styles.swipeable]}
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
                                        <View style={styles.wh69}>
                                            {dateChangeShift ? dateChangeShift : null}
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

                                    {
                                        nameChangeShift && (
                                            <View
                                                style={
                                                    CustomStyleSheet.marginVertical(2)
                                                }
                                            >
                                                {nameChangeShift}
                                            </View>
                                        )
                                    }

                                    {
                                        dataItem?.ProfileInfo2?.ProfileName2 && (
                                            <View
                                                style={[styles.viewStatusBottom, CustomStyleSheet.paddingRight(0)]}
                                            >
                                                <View style={[styles.leftContent, isDisable ? styleSheets.opacity05 : styleSheets.opacity1]}>
                                                    {Vnr_Function.renderAvatarCricleByName(
                                                        dataItem?.ProfileInfo2?.ImagePath2,
                                                        dataItem?.ProfileInfo2?.ProfileName2,
                                                        20
                                                    )}
                                                </View>
                                                <View style={styles.styUserApprove}>
                                                    <Text numberOfLines={1} style={[styleSheets.lable, styles.textProfileName]}>
                                                        {dataItem?.ProfileInfo2?.ProfileName2
                                                            ? dataItem?.ProfileInfo2?.ProfileName2
                                                            : null}
                                                    </Text>
                                                </View>
                                            </View>
                                        )
                                    }

                                    {/* cennter */}
                                    {!!dataItem?.Comment && (
                                        <View style={styles.wrapContentCenter}>
                                            <View style={styles.styIconMess}>
                                                <IconChat size={Size.text + 1} color={Colors.gray_8} />
                                            </View>
                                            <View style={styles.wrapReason}>
                                                <Text
                                                    numberOfLines={2}
                                                    style={[styleSheets.text, styles.viewReason_text]}
                                                >
                                                    {dataItem.Comment}
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

                                    {dataItem?.DateEnd && (
                                        <View style={styles.styViewDate}>
                                            {isHaveAvatar && (
                                                <Text style={[styleSheets.text, styles.dateTimeSubmit_Text]}>
                                                    {'|  '}
                                                </Text>
                                            )}

                                            <IconDate size={Size.text - 1} color={Colors.gray_7} />

                                            <Text style={[styleSheets.text, styles.dateTimeSubmit_Text]}>
                                                {moment(dataItem.DateEnd).format('DD/MM/YYYY')}
                                            </Text>
                                        </View>
                                    )}
                                </View>
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
    lineSatus: {
        paddingHorizontal: 6,
        alignItems: 'center',
        paddingVertical: 2,
        borderRadius: Size.borderRadiusCircle
        // padding: 4
    },
    viewReason_text: {
        fontSize: Size.textSmall,
        color: Colors.gray_9
    },
    lineSatus_text: {
        fontSize: Size.text - 3,
        fontWeight: '500'
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
        flexDirection: 'row',
        justifyContent: 'space-between'
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

    left_isCheckbox: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 8,
        paddingLeft: 8
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

    textProfileName: {
        fontSize: 12,
        fontWeight: '600',
        color: Colors.blue
    },

    wh69: { width: '69%', maxWidth: '69%' },
    lineThrough: {
        textDecorationLine: 'line-through',
        textDecorationStyle: 'solid'
    }
});
