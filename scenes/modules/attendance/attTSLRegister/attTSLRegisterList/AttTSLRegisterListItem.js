import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, Size, styleSheets, CustomStyleSheet } from '../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { translate } from '../../../../../i18n/translate';
import {
    IconInfo,
    IconBack,
    IconCheckCirlceo
} from '../../../../../constants/Icons';
import VnrText from '../../../../../components/VnrText/VnrText';
import { EnumName } from '../../../../../assets/constant';
import Color from 'color';
import RightActions from '../../../../../components/ListButtonMenuRight/RightActions';

export default class AttTSLRegisterListItem extends React.Component {
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
                item.title = item?.title;
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

    openActionSheet = () => {
        this.ActionSheet.show();
    };

    actionSheetOnCLick = index => {
        const { dataItem } = this.props;
        !Vnr_Function.CheckIsNullOrEmpty(this.sheetActions[index].onPress) &&
            this.sheetActions[index].onPress(dataItem);
    };

    rightActionsEmpty = () => {
        return <View style={CustomStyleSheet.wi} />;
    };

    convertTextToColor = value => {
        const [num1, num2, num3, opacity] = value.split(',');
        return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
    };

    render() {
        const {
            dataItem,
            isSelect,
            index,
            listItemOpenSwipeOut,
            rowActions,
            isOpenAction,
            isDisable
        } = this.props;

        let colorStatusView = null,
            borderStatusView = null,
            bgStatusView = null,
            viewTextInOut = <View />;

        // xử lý color
        if (dataItem.itemStatus) {
            const { colorStatus, borderStatus, bgStatus } = dataItem.itemStatus;
            colorStatusView = colorStatus ? colorStatus : null;
            borderStatusView = borderStatus ? borderStatus : null;
            bgStatusView = bgStatus ? bgStatus : null;
        }

        // xử lý icon In/Out
        if (dataItem.Type && dataItem.Type === EnumName.E_IN) {
            viewTextInOut = (
                <VnrText
                    i18nKey={'Att_TAMScanType_In'}
                    style={[styleSheets.text, styles.line_value_value, { color: Colors.primary }]}
                />
            );
        } else if (dataItem.Type && dataItem.Type === EnumName.E_OUT) {
            viewTextInOut = (
                <VnrText
                    i18nKey={'Att_TAMScanType_Out'}
                    style={[styleSheets.text, styles.line_value_value, { color: Colors.orange }]}
                />
            );
        } else {
            viewTextInOut = (
                <VnrText
                    i18nKey={'HRM_System_Resource_Att_InOut'}
                    style={[styleSheets.text, styles.line_value_value, { color: Colors.primary }]}
                />
            );
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
                    rowActions != null && !isOpenAction
                        ? () => <RightActions rowActions={rowActions} dataItem={dataItem} />
                        : this.rightActionsEmpty
                }
                friction={0.6}
                containerStyle={styles.swipeable}
            >
                <View
                    style={[
                        styles.swipeableLayout,
                        isSelect && { backgroundColor: Colors.Secondary95 },
                        dataItem.WarningViolation && { borderColor: Colors.red }
                    ]}
                >
                    {isOpenAction && (
                        <View style={[styles.selectView, isDisable ? styleSheets.opacity05 : styleSheets.opacity1]}>
                            <TouchableOpacity
                                activeOpacity={isDisable ? 1 : 0.8}
                                onPress={() => {
                                    !isDisable ? this.props.onClick() : null;
                                }}
                            >
                                <View
                                    style={[
                                        styles.selectViewCircle,
                                        !this.props.isSelect && {
                                            ...CustomStyleSheet.borderColor(Colors.primary),
                                            ...CustomStyleSheet.borderWidth(1)
                                        }
                                    ]}
                                >
                                    {this.props.isSelect && (
                                        <IconCheckCirlceo size={Size.iconSize - 4} color={Colors.primary} />
                                    )}
                                </View>
                            </TouchableOpacity>
                        </View>
                    )}

                    <View style={[styles.container]} key={index}>
                        <View style={styles.Line}>
                            <View style={styles.lineLeft}>
                                <View style={styles.line_date_row}>
                                    <VnrText
                                        i18nKey={'HRM_Attendance_Type'}
                                        style={[styleSheets.text, styles.line_value_lable]}
                                    />
                                    <View style={styles.line_time_wrap}>{viewTextInOut}</View>
                                </View>
                            </View>

                            <View style={styles.lineRight}>
                                <View style={styles.line_date_row}>
                                    <VnrText i18nKey={'E_DAY'} style={[styleSheets.text, styles.line_value_lable]} />
                                    <View style={styles.line_time_wrap}>
                                        <Text style={[styleSheets.text, styles.line_value_value]} numberOfLines={1}>
                                            {dataItem.TimeLog ? moment(dataItem.TimeLog).format('DD/MM/YYYY') : ''}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.line_date_row}>
                                    <VnrText i18nKey={'E_HOUR'} style={[styleSheets.text, styles.line_value_lable]} />
                                    <View style={styles.line_time_wrap}>
                                        <Text style={[styleSheets.text, styles.line_value_value]} numberOfLines={1}>
                                            {dataItem.TimeLog ? moment(dataItem.TimeLog).format('HH:mm') : ''}
                                        </Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                        <View style={styles.viewReason}>
                            {dataItem.IsCheckApp ? (
                                dataItem.ShopNamebyGPS ? (
                                    <VnrText
                                        value={`${translate('HRM_PortalApp_IsCheckIn_App')} (${translate(
                                            'ShopName'
                                        )}: ${dataItem.ShopNamebyGPS})`}
                                        style={[styleSheets.textItalic, styles.viewReason_text]}
                                    />
                                ) : (
                                    <VnrText
                                        numberOflines={1}
                                        i18nKey={'HRM_PortalApp_IsCheckIn_App'}
                                        style={[styleSheets.textItalic, styles.viewReason_text]}
                                    />
                                )
                            ) : (
                                <Text numberOflines={1} style={[styleSheets.textItalic, styles.viewReason_text]}>
                                    {dataItem.TAMScanReasonMissName != null
                                        ? `${translate('E_REASON')}: ${dataItem.TAMScanReasonMissName}`
                                        : `${translate('E_REASON')}:`}
                                </Text>
                            )}
                        </View>
                        <View style={styles.viewStatusBottom}>
                            <View style={styles.dateTimeSubmit}>
                                <Text numberOfLines={1} style={[styleSheets.textItalic, styles.dateTimeSubmit_Text]}>
                                    {dataItem.DateCreate != null &&
                                        dataItem.DateCreate != undefined &&
                                        `${translate('E_AT_TIME')} ${moment(dataItem.DateCreate).format(
                                            'HH:mm DD/MM/YYYY'
                                        )}`}
                                </Text>
                            </View>

                            <View
                                style={[
                                    styles.lineSatus,
                                    {
                                        borderColor: borderStatusView
                                            ? this.convertTextToColor(borderStatusView)
                                            : Colors.gray_10,
                                        backgroundColor: bgStatusView
                                            ? this.convertTextToColor(bgStatusView)
                                            : Colors.white
                                    }
                                ]}
                            >
                                <Text
                                    numberOfLines={1}
                                    style={[
                                        styleSheets.text,
                                        styles.lineSatus_text,
                                        {
                                            color: colorStatusView
                                                ? this.convertTextToColor(colorStatusView)
                                                : Colors.gray_10
                                        }
                                    ]}
                                >
                                    {dataItem.StatusView != null ? dataItem.StatusView : ''}
                                </Text>
                            </View>
                        </View>

                        {dataItem.WarningViolation && (
                            <View style={styles.viewLimitTitle}>
                                <IconInfo color={Colors.red} size={Size.text} />
                                <Text numberOfLines={1} style={[styleSheets.lable, styles.viewReasoLimitTitle_text]}>
                                    {translate('HRM_Attendance_Limit_Violation_Title')}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
                {Array.isArray(this.rightListActions) && this.rightListActions.length > 0 && (
                    <View style={styles.actionRight}>
                        <IconBack color={Colors.gray_7} size={Size.defineSpace} />
                    </View>
                )}
            </Swipeable>
        );
    }
}

const PADDING_DEFINE = Size.defineSpace;
const styles = StyleSheet.create({
    swipeable: {
        flex: 1,
        paddingHorizontal: Size.defineSpace
    },
    swipeableLayout: {
        flex: 1,
        borderRadius: 8,
        backgroundColor: Colors.white,
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        position: 'relative',
        flexDirection: 'row'
    },
    container: {
        flex: 1,
        // flexDirection: 'row',
        paddingTop: PADDING_DEFINE,
        marginBottom: 4
    },
    viewStatusBottom: {
        paddingVertical: PADDING_DEFINE / 2,
        paddingHorizontal: PADDING_DEFINE,
        borderTopColor: Colors.gray_5,
        borderTopWidth: 0.5,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    lineSatus: {
        borderRadius: styleSheets.radius_5,
        alignItems: 'center',
        borderWidth: 0.5,
        paddingVertical: 2,
        paddingHorizontal: PADDING_DEFINE
    },
    dateTimeSubmit: {
        alignSelf: 'flex-end',
        paddingRight: 5,
        flex: 1
    },

    lineSatus_text: {
        fontSize: Size.text - 3,
        fontWeight: '500'
    },
    line_time_wrap: {
        flex: 1,
        alignItems: 'flex-end'
    },
    selectView: {
        alignItems: 'center',
        justifyContent: 'center',
        borderTopLeftRadius: 8,
        borderBottomLeftRadius: 8,
        paddingLeft: 5,
        paddingRight: 5,
        borderRightColor: Colors.gray_5,
        borderRightWidth: 0.5
    },
    selectViewCircle: {
        borderColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        width: Size.iconSize - 4,
        height: Size.iconSize - 4,
        borderRadius: (Size.iconSize - 4) / 2
    },
    actionRight: {
        position: 'absolute',
        top: 0,
        right: -Size.defineSpace,
        height: '100%',
        justifyContent: 'center'
    },
    Line: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.primary_transparent_8,
        paddingHorizontal: PADDING_DEFINE / 2,
        paddingVertical: PADDING_DEFINE / 2,
        borderRadius: 8,
        marginHorizontal: Size.defineSpace
    },
    lineLeft: {
        flex: 4.5,
        borderRightColor: Colors.primary,
        borderRightWidth: 0.3,
        paddingRight: Size.defineSpace / 2,
        justifyContent: 'center'
    },
    lineRight: {
        flex: 5.5,
        paddingLeft: Size.defineSpace / 2,
        justifyContent: 'center'
    },
    viewReason: {
        width: '100%',
        marginVertical: PADDING_DEFINE / 2,
        paddingHorizontal: PADDING_DEFINE
    },
    viewReason_text: {
        fontSize: Size.text,
        color: Colors.gray_10
    },
    dateTimeSubmit_Text: {
        fontSize: Size.text - 3,
        color: Colors.gray_10
    },
    line_date_row: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    line_value_value: {
        fontSize: Size.text - 1,
        color: Colors.primary,
        fontWeight: '500'
    },
    line_value_lable: {
        fontSize: Size.text - 1,
        marginRight: PADDING_DEFINE / 2
    },
    viewLimitTitle: {
        width: '100%',
        marginBottom: PADDING_DEFINE / 2,
        paddingHorizontal: PADDING_DEFINE,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row'
    },
    viewReasoLimitTitle_text: {
        fontSize: Size.text - 1,
        color: Colors.red,
        marginLeft: 5
    }
});
