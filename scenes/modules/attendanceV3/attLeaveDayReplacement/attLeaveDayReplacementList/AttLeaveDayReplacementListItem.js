/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TouchableWithoutFeedback, Dimensions, Platform } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {
    Colors,
    CustomStyleSheet,
    Size,
    styleSheets,
    stylesScreenDetailV3
} from '../../../../../constants/styleConfig';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { IconCheck, IconDate, IconChat } from '../../../../../constants/Icons';
import RightActions from '../../../../../componentsV3/ListButtonMenuRight/RightActions';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import VnrRenderListItem from '../../../../../componentsV3/VnrRenderList/VnrRenderListItem';
import { translate } from '../../../../../i18n/translate';
import moment from 'moment';

export default class AttLeaveDayReplacementListItem extends VnrRenderListItem {
    render() {
        const {
            dataItem,
            index,
            listItemOpenSwipeOut,
            rowActions,
            isOpenAction,
            isDisable,
            hiddenFiled,
            handerOpenSwipeOut,
            keyDataLocal
        } = this.props;

        let colorStatusView = null,
            textFieldSalary = '',
            textFieldDate = '',
            bgStatusView = null,
            isHaveAvatar = false,
            textFieldTime = '',
            isHidetextFieldTime = false,
            textConfirmHours = null,
            textDataNote = null;

        hiddenFiled &&
            typeof hiddenFiled == 'object' &&
            Object.keys(hiddenFiled).forEach((key) => {
                if (!hiddenFiled[key]) {
                    dataItem[key] = null;
                }
            });

        const { DataStatus, Status, DataConfirmReason } = dataItem;
        isHaveAvatar = dataItem?.ProfileInfo?.ProfileName ? true : false;
        if (Status === 'E_CONFIRM') {
            textConfirmHours = `${dataItem?.ConfirmHours ? dataItem?.ConfirmHours : 0}`;
            textDataNote = DataConfirmReason?.ConfirmReason ? `${DataConfirmReason?.ConfirmReason}` : null;
        } else {
            textDataNote = dataItem.DataNote ? `${dataItem.DataNote}` : null;
        }

        if (
            dataItem.DurationType === 'E_FIRST' ||
            dataItem.DurationType === 'E_LAST' ||
            dataItem.DurationType === 'E_FIRST_AND_LAST'
        ) {
            isHidetextFieldTime = true;
        }

        if (dataItem.HoursFrom && dataItem.HoursTo && !isHidetextFieldTime) {
            // nua ca dau, nua ca sau, giua ca,
            textFieldTime = `(${moment(dataItem.HoursFrom).format('HH:mm')} - ${moment(dataItem.HoursTo).format(
                'HH:mm'
            )})`;
        }

        if (dataItem.DateStart != null && dataItem.DateEnd != null) {
            // xử lý dateStart và dateEnd
            let dateStart = dataItem.DateStart ? dataItem.DateStart : null,
                dateEnd = dataItem.DateEnd ? dataItem.DateEnd : null,
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

        // xử lý color
        if (dataItem.itemStatus) {
            const { colorStatus, bgStatus } = dataItem.itemStatus;
            if (Status === 'E_CONFIRM') {
                let itemStatus = Vnr_Services.formatStyleStatusApp(Status);
                colorStatusView = itemStatus.colorStatus;
                bgStatusView = itemStatus.bgStatus;
            } else {
                colorStatusView = colorStatus ? colorStatus : null;
                bgStatusView = bgStatus ? bgStatus : null;
            }
        }
        if (keyDataLocal == 'KT_AttWaitConfirmLeaveDayReplacement') {
            DataStatus.StatusView = translate('HRM_PortalApp_PITFinalization_tabWaitingConfirmed');
            colorStatusView = '#FA8C16';
            bgStatusView = '250, 140, 22, 0.08';
        } else {
            DataStatus.StatusView = translate('HRM_PortalApp_TopTab_AttSubmitWorkingOvertime_Confirmed');
            colorStatusView = '#52C41A';
            bgStatusView = '82, 196, 26, 0.08';
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
                <View style={[styles.swipeableLayout]}>
                    <View style={styles.left_isCheckbox}>
                        {rowActions === null || (Array.isArray(rowActions) && rowActions.length === 0) ? null : (
                            <View style={[styles.styRadiusCheck, this.props.isSelect && stylesScreenDetailV3.checkAll]}>
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
                                        <View style={{ ...CustomStyleSheet.width('70%') }}>
                                            <View style={[styles.styleFlex1_row_AlignCenter]}>
                                                <Text style={[styleSheets.lable, styles.styleTextViewTop]}>
                                                    {textFieldDate}
                                                    {dataItem?.LeaveDays
                                                        ? ` (${dataItem?.LeaveDays} ${translate(
                                                            'HRM_PortalApp_TakeLeave_day'
                                                        )})`
                                                        : ''}
                                                </Text>
                                            </View>

                                            <View style={styles.flex1}>
                                                <View style={styles.styleFlex1_row_AlignCenter}>
                                                    <Text
                                                        style={[styleSheets.lable, styles.styleTextType]}
                                                        numberOfLines={2}
                                                    >
                                                        {`${
                                                            dataItem?.DurationTypeView ? dataItem?.DurationTypeView : ''
                                                        }` +
                                                            `${isHidetextFieldTime ? '' : ' '}` + //space nếu có textFieldTime
                                                            `${textFieldTime}` +
                                                            `${
                                                                dataItem.IsSubstitute
                                                                    ? ', ' +
                                                                      translate(
                                                                          'HRM_PortalApp_TakeLeave_ToNeedAReplacement'
                                                                      )
                                                                    : ''
                                                            }`}
                                                    </Text>
                                                </View>
                                            </View>
                                        </View>

                                        {/* Top - right */}
                                        <View style={styles.viewContentTopRight}>
                                            <View
                                                style={[
                                                    styles.lineSatus,
                                                    {
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
                                                            color: colorStatusView ? colorStatusView : Colors.gray_10
                                                        }
                                                    ]}
                                                >
                                                    {DataStatus && DataStatus.StatusView ? DataStatus.StatusView : ''}
                                                </Text>
                                            </View>
                                            {dataItem?.EmergencyLeave == translate('E_YES') && (
                                                <View
                                                    style={[
                                                        styles.lineSatus,
                                                        {
                                                            marginTop: 4,
                                                            backgroundColor:
                                                                this.convertTextToColor('245, 34, 45, 0.08')
                                                        }
                                                    ]}
                                                >
                                                    <Text
                                                        numberOfLines={1}
                                                        style={[
                                                            styleSheets.text,
                                                            styles.lineSatus_text,
                                                            CustomStyleSheet.color(Colors.red)
                                                        ]}
                                                    >
                                                        {translate('HRM_PortalApp_TakeLeave_EmergencyLeave')}
                                                    </Text>
                                                </View>
                                            )}
                                        </View>
                                    </View>

                                    <View style={[{ flex: 1, alignItems: 'center', flexDirection: 'row' }]}>
                                        {/* cennter */}
                                        <View
                                            style={[
                                                styles.leftContent,
                                                isDisable ? styleSheets.opacity05 : styleSheets.opacity1
                                            ]}
                                        >
                                            {isHaveAvatar
                                                ? Vnr_Function.renderAvatarCricleByName(
                                                    dataItem.ProfileInfo.ImagePath,
                                                      dataItem?.ProfileInfo.ProfileName,
                                                      20
                                                )
                                                : null}
                                        </View>
                                        {isHaveAvatar ? (
                                            <View style={styles.styUserApprove}>
                                                <Text
                                                    numberOfLines={1}
                                                    style={[styleSheets.lable, styles.textProfileName]}
                                                >
                                                    {dataItem?.ProfileInfo?.ProfileName
                                                        ? dataItem?.ProfileInfo?.ProfileName
                                                        : dataItem?.ProfileInfo
                                                            ? dataItem?.ProfileInfo
                                                            : null}
                                                    {dataItem?.ProfileInfo?.ProfileName
                                                        ? ` (${translate('HRM_PortalApp_LeaveEmployee')})`
                                                        : ''}
                                                </Text>
                                            </View>
                                        ) : (
                                            <View style={styles.styUserApprove} />
                                        )}
                                    </View>
                                </View>
                                <View style={[styles.viewStatusBottom]}>
                                    {textDataNote != null && (
                                        <View style={styles.wrapContentCenter}>
                                            <View style={styles.styIconMess}>
                                                <IconChat size={Size.text + 1} color={Colors.gray_8} />
                                            </View>
                                            <View style={styles.wrapReason}>
                                                <Text
                                                    numberOfLines={2}
                                                    style={[styleSheets.text, styles.viewReason_text]}
                                                >
                                                    {textDataNote}
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </View>
                                {/* {dataItem.WarningViolation && (
                                    <View style={styles.viewLimitTitle}>
                                        <IconInfo color={Colors.red} size={Size.text} />
                                        <Text
                                            numberOfLines={1}
                                            style={[styleSheets.lable, styles.viewReasoLimitTitle_text]}
                                        >
                                            {translate('HRM_Attendance_Limit_Violation_Title')}
                                        </Text>
                                    </View>
                                )} */}
                                {textConfirmHours !== null && (
                                    <View style={styles.styViewConfirmHours}>
                                        <Text style={[styleSheets.text]}>{`${
                                            translate('HRM_PortalApp_Overtime_ConfirmHours') + ': '
                                        }`}</Text>
                                        <Text
                                            style={[
                                                styleSheets.text,
                                                dataItem.ConfirmHours < dataItem.RegisterHours && { color: Colors.red }
                                            ]}
                                        >
                                            {textConfirmHours}
                                        </Text>
                                        <Text> </Text>
                                        <Text style={[styleSheets.text]}>
                                            {translate('HRM_PortalApp_Hour_Lowercase')}
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
    styViewConfirmHours: {
        flex: 1,
        alignItems: 'center',
        paddingBottom: PADDING_DEFINE / 2,
        paddingLeft: 4,
        flexDirection: 'row'
    },
    styUserApprove: {
        flexShrink: 1
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
        paddingVertical: Size.defineHalfSpace,
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
    contentMain: {
        flex: 1,
        paddingTop: 4
        // paddingHorizontal: Size.defineSpace,
    },
    styViewTop: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: Size.defineHalfSpace
    },
    leftContent: {
        marginRight: 5,
        flexDirection: 'row'
    },
    styleFlex1_row_AlignCenter: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    styleTextViewTop: {
        // fontWeight: fw,
        color: Colors.gray_10,
        fontSize: Size.text + 1
    },
    styleTextType: {
        fontWeight: Platform.OS == 'android' ? '600' : '500',
        color: Colors.gray_10,
        fontSize: Size.text - 2
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
        alignItems: 'center'
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
    AccumulateHour: {
        width: '100%',
        paddingRight: 12,
        marginVertical: 4
    }
});
