import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Animated } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../../constants/styleConfig';
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
import Color from 'color';
import RightActions from '../../../../../components/ListButtonMenuRight/RightActions';
export default class AttRosterGroupByEmpListItemApprove extends React.Component {
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
        // dataItem.BusinessAllowAction = ['E_MODIFY', 'E_SENDMAIL', 'E_DELETE', 'E_APPROVE', 'E_REJECT', 'E_CANCEL']
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
        if (dataItem.isGroup && this.sheetActions[index].onPress) {
            this.sheetActions[index].onPress(dataItem.dataGroupMaster);
        } else if (this.sheetActions[index].onPress) {
            this.sheetActions[index].onPress(dataItem);
        }
    };

    rightActionsEmpty = () => {
        return <View style={CustomStyleSheet.width(10)} />;
    };

    convertTextToColor = value => {
        const [num1, num2, num3, opacity] = value.split(',');
        return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
    };

    renderItem = () => {
        const { dataItem, isSelect, index, listItemOpenSwipeOut, rowActions, isOpenAction, isDisable } = this.props;

        let imageAvatar = '',
            TimeCouse = '',
            colorStatusView = null,
            borderStatusView = null,
            dateStart = dataItem.DateStart ? dataItem.DateStart : null,
            dateEnd = dataItem.DateEnd ? dataItem.DateEnd : null,
            textFieldSalary = '',
            bgStatusView = null;

        if (dataItem.ImagePath) {
            imageAvatar = { uri: dataItem.ImagePath };
        }
        // xử lý color
        if (dataItem.itemStatus) {
            const { colorStatus, borderStatus, bgStatus } = dataItem.itemStatus;
            colorStatusView = colorStatus ? colorStatus : null;
            borderStatusView = borderStatus ? borderStatus : null;
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

        // xử lý dateStart và dateEnd
        if (dateStart && dateEnd) {
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
        } else {
            if (dateStart) {
                TimeCouse = moment(dateStart).format('DD/MM/YYYY');
            }
            if (dateEnd) {
                if (TimeCouse !== '') {
                    TimeCouse = `${TimeCouse} - ${moment(dataItem.dateEnd).format('DD/MM/YYYY')}`;
                } else {
                    TimeCouse = moment(dataItem.dateEnd).format('DD/MM/YYYY');
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
                    rowActions != null && !isOpenAction
                        ? () => <RightActions rowActions={rowActions} dataItem={dataItem} />
                        : this.rightActionsEmpty
                }
                friction={0.6}
                containerStyle={[styles.swipeable]}
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
                    <View style={styles.container}>
                        <View style={[styles.contentMain]} key={index}>
                            <View style={styles.styViewTop}>
                                <View style={[styles.leftContent, isDisable ? styleSheets.opacity05 : styleSheets.opacity1]}>
                                    <View style={styles.leftContentIconView}>
                                        <Image source={imageAvatar} style={styles.leftContentIcon} />
                                    </View>
                                </View>

                                <View style={styles.contentRight}>
                                    <Text numberOfLines={1} style={[styleSheets.lable, styles.profileText]}>
                                        {dataItem.ProfileName}
                                    </Text>

                                    {dataItem.OrgStructureName != null && (
                                        <Text numberOfLines={1} style={[styleSheets.text, styles.positionText]}>
                                            {dataItem.OrgStructureName ? dataItem.OrgStructureName : ''}
                                        </Text>
                                    )}

                                    {textFieldSalary != '' && (
                                        <Text numberOfLines={1} style={[styleSheets.text, styles.positionText]}>
                                            {textFieldSalary}
                                        </Text>
                                    )}
                                </View>
                            </View>

                            <View style={styles.Line}>
                                <View style={styles.lineRight}>
                                    <View style={styles.line_value}>
                                        <VnrText
                                            style={[styleSheets.text, styles.line_value_lable]}
                                            i18nKey={'HRM_Att_RosterGroupByEmp_DateEffective'}
                                        />
                                        <View style={styles.line_time_wrap}>
                                            <Text numberOfLines={1} style={[styleSheets.text, styles.line_value_value]}>
                                                {TimeCouse}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.line_value}>
                                        <VnrText
                                            style={[styleSheets.text, styles.line_value_lable]}
                                            i18nKey={'HRM_Att_RosterGroupByEmp_RosterGroup'}
                                        />
                                        <View style={styles.line_time_wrap}>
                                            <Text numberOfLines={1} style={[styleSheets.text, styles.line_value_value]}>
                                                {/* // lay ma loai phep */}
                                                {dataItem.RosterGroupTypeName != null
                                                    ? dataItem.RosterGroupTypeName
                                                    : ''}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.viewReason}>
                            <Text numberOfLines={2} style={[styleSheets.textItalic, styles.viewReason_text]}>
                                {dataItem.Note != null
                                    ? `${translate('HRM_Attendance_Notes')}: ${dataItem.Note}`
                                    : `${translate('HRM_Attendance_Notes')}:`}
                            </Text>
                        </View>

                        <View style={styles.viewStatusBottom}>
                            <View style={styles.dateTimeSubmit}>
                                <Text style={[styleSheets.textItalic, styles.dateTimeSubmit_Text]} numberOfLines={1}>
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
                                    {dataItem.StatusView ? dataItem.StatusView : ''}
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
                    {/* </View> */}
                </View>
                {Array.isArray(this.rightListActions) && this.rightListActions.length > 0 && (
                    <View style={styles.actionRight}>
                        <IconBack color={Colors.gray_7} size={Size.defineSpace} />
                    </View>
                )}
            </Swipeable>
        );
    };

    renderItemIsGroup = () => {
        const { dataItem, isSelect, index, listItemOpenSwipeOut, rowActions, isOpenAction, isDisable } = this.props;

        let imageAvatar = '',
            TimeCouse = dataItem.DateStart ? moment(dataItem.DateStart).format('MM/YYYY') : '',
            colorStatusView = null,
            borderStatusView = null,
            textFieldSalary = '',
            bgStatusView = null;

        if (dataItem.ImagePath) {
            imageAvatar = { uri: dataItem.ImagePath };
        }
        // xử lý color
        if (dataItem.itemStatus) {
            const { colorStatus, borderStatus, bgStatus } = dataItem.itemStatus;
            colorStatusView = colorStatus ? colorStatus : null;
            borderStatusView = borderStatus ? borderStatus : null;
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
                containerStyle={[styles.swipeable]}
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
                    <View style={styles.container}>
                        <View style={[styles.contentMain]} key={index}>
                            <View style={styles.styViewTop}>
                                <View style={[styles.leftContent, isDisable ? styleSheets.opacity05 : styleSheets.opacity1]}>
                                    <View style={styles.leftContentIconView}>
                                        <Image source={imageAvatar} style={styles.leftContentIcon} />
                                    </View>
                                </View>

                                <View style={styles.contentRight}>
                                    <Text numberOfLines={1} style={[styleSheets.lable, styles.profileText]}>
                                        {dataItem.ProfileName}
                                    </Text>

                                    {dataItem.OrgStructureName != null && (
                                        <Text numberOfLines={1} style={[styleSheets.text, styles.positionText]}>
                                            {dataItem.OrgStructureName ? dataItem.OrgStructureName : ''}
                                        </Text>
                                    )}

                                    {textFieldSalary != '' && (
                                        <Text numberOfLines={1} style={[styleSheets.text, styles.positionText]}>
                                            {textFieldSalary}
                                        </Text>
                                    )}
                                </View>
                            </View>

                            <View style={styles.Line}>
                                <View style={styles.lineRight}>
                                    <View style={styles.line_value}>
                                        <VnrText
                                            style={[styleSheets.text, styles.line_value_lable]}
                                            i18nKey={'HRM_Attendance_MonthYear'}
                                        />
                                        <View style={styles.line_time_wrap}>
                                            <Text numberOfLines={1} style={[styleSheets.text, styles.line_value_value]}>
                                                {TimeCouse}
                                            </Text>
                                        </View>
                                    </View>

                                    <View style={styles.line_value}>
                                        <VnrText
                                            style={[styleSheets.text, styles.line_value_lable]}
                                            i18nKey={'HRM_PortalApp_RosterGroupByEmp_CountDay_Changes'}
                                        />
                                        <View style={styles.line_time_wrap}>
                                            <Text numberOfLines={1} style={[styleSheets.text, styles.line_value_value]}>
                                                {dataItem.dataGroupMaster ? dataItem.dataGroupMaster.length : ''}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            </View>
                        </View>

                        <View style={styles.viewStatusBottom}>
                            <View style={styles.dateTimeSubmit}>
                                <Text style={[styleSheets.textItalic, styles.dateTimeSubmit_Text]} numberOfLines={1}>
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
                                    {dataItem.StatusView ? dataItem.StatusView : ''}
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
    };

    render() {
        const { dataItem } = this.props;

        return dataItem.isGroup ? this.renderItemIsGroup() : this.renderItem();
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
        flex: 1
    },
    line_time_wrap: {
        flex: 1,
        alignItems: 'flex-end'
    },
    viewStatusBottom: {
        paddingVertical: PADDING_DEFINE / 2,
        paddingHorizontal: PADDING_DEFINE,
        borderTopColor: Colors.gray_5,
        borderTopWidth: 0.5,
        flexDirection: 'row'
    },
    lineSatus: {
        borderRadius: styleSheets.radius_5,
        alignItems: 'center',
        borderWidth: 0.5,
        paddingVertical: 2,
        paddingHorizontal: PADDING_DEFINE
    },
    viewReason: {
        width: '100%',
        marginBottom: PADDING_DEFINE / 2,
        paddingHorizontal: PADDING_DEFINE
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
    },
    viewReason_text: {
        fontSize: Size.text - 1,
        color: Colors.gray_10
    },
    lineSatus_text: {
        fontSize: Size.text - 3,
        fontWeight: '500'
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
    dateTimeSubmit: {
        alignSelf: 'flex-end',
        paddingRight: 5,
        flex: 1
    },
    dateTimeSubmit_Text: {
        fontSize: Size.text - 4,
        color: Colors.gray_10
    },
    positionText: {
        fontSize: Size.text - 4.5,
        color: Colors.gray_7,
        marginTop: -2
    },
    profileText: {
        fontSize: Size.text,
        color: Colors.gray_10,
        marginTop: -2
    },
    contentMain: {
        flex: 1,
        paddingTop: Size.defineSpace,
        marginBottom: Size.defineSpace / 2,
        paddingHorizontal: Size.defineSpace
    },
    styViewTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Size.defineHalfSpace
    },
    leftContent: {
        marginRight: Size.defineHalfSpace
    },
    contentRight: {
        flex: 7.2,
        paddingRight: PADDING_DEFINE,
        justifyContent: 'center'
    },
    actionRight: {
        position: 'absolute',
        top: 0,
        right: -Size.defineSpace,
        height: '100%',
        justifyContent: 'center'
    },
    leftContentIconView: {
        borderRadius: 11,
        maxWidth: 60,
        maxHeight: 70
    },
    leftContentIcon: {
        width: Size.deviceWidth * 0.11,
        height: Size.deviceWidth * 0.11,
        resizeMode: 'cover',
        maxWidth: 60,
        maxHeight: 60,
        borderRadius: 11
    },

    Line: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: Colors.primary_transparent_8,
        paddingHorizontal: PADDING_DEFINE / 2,
        paddingVertical: PADDING_DEFINE / 2,
        borderRadius: 8
        // marginTop: 3,
    },
    lineRight: {
        flex: 1
        // paddingLeft: Size.defineSpace / 2,
    },
    line_value: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    line_value_value: {
        fontSize: Size.text - 1,
        color: Colors.primary,
        fontWeight: '500'
    },
    line_value_lable: {
        fontSize: Size.text - 3,
        marginRight: PADDING_DEFINE / 2
    }
});
