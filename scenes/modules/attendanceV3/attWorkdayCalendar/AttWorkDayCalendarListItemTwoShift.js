import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Size, styleSheets, Colors, CustomStyleSheet } from '../../../../constants/styleConfig';
import moment from 'moment';
import VnrText from '../../../../components/VnrText/VnrText';
import { getDayOfWeek } from '../../../../i18n/langCalendars';
import { EnumName, EnumStatus, ScreenName } from '../../../../assets/constant';
import Vnr_Function from '../../../../utils/Vnr_Function';
import {
    IconCancel,
    IconCancelMarker,
    IconCheck,
    IconDate,
    IconDelete,
    IconDot,
    IconExclamation,
    IconMinus
} from '../../../../constants/Icons';
import { translate } from '../../../../i18n/translate';
import Vnr_Services from '../../../../utils/Vnr_Services';
import { IconMoreHorizontal } from '../../../../constants/Icons';
import { TouchableWithoutFeedback } from 'react-native';
import DrawerServices from '../../../../utils/DrawerServices';

export default class AttWorkDayCalendarListItemTwoShift extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    shouldComponentUpdate(nexProps) {
        return (
            this.props.isRefreshList !== nexProps.isRefreshList
        );
    }

    renderListAllowLateEarly = (_listListAllowLateEarly) => {
        return _listListAllowLateEarly.map((item, index) => {
            let colorStatusView = null,
                bgStatusView = null;

            if (item.itemStatus) {
                const { colorStatus, bgStatus } = item.itemStatus;
                colorStatusView = colorStatus ? colorStatus : null;
                bgStatusView = bgStatus ? bgStatus : null;
            }

            return (
                <TouchableWithoutFeedback
                    key={index}
                    onPress={() => this.onPressToDetail(ScreenName.AttSubmitTakeLateEarlyAllowed, item.ID)}
                >
                    <View style={styles.viewStatus}>
                        <View
                            style={[
                                styles.styViewTextType,
                                {
                                    backgroundColor: bgStatusView
                                        ? Vnr_Function.convertTextToColor(bgStatusView)
                                        : Colors.white
                                }
                            ]}
                        >
                            <View style={styles.styViewIc}>
                                {this.iconStatus(item.Status, Vnr_Function.convertTextToColor(colorStatusView))}
                                <VnrText
                                    style={[
                                        styleSheets.text,
                                        styles.txtRegister,
                                        {
                                            color: colorStatusView
                                                ? Vnr_Function.convertTextToColor(colorStatusView)
                                                : Colors.gray_10
                                        }
                                    ]}
                                    i18nKey={
                                        item.LateMinutes
                                            ? translate('HRM_Attendance_WorkDay_LateDuration')
                                            : translate('HRM_Attendance_WorkDay_EarlyDuration')
                                    }
                                />
                            </View>

                            <Text style={[styleSheets.lable]}>
                                {item.LateMinutes
                                    ? `${item.LateMinutes} ${translate('Minute_Lowercase')}`
                                    : `${item.EarlyMinutes} ${translate('Minute_Lowercase')}`}
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        });
    };

    renderListDataBusiness = (_ListDataBusiness) => {
        return _ListDataBusiness.map((item, index) => {
            let colorStatusView = null;

            if (item.StatusView) {
                const { colorStatus } = Vnr_Services.formatStyleStatusApp(item.StatusView);
                colorStatusView = colorStatus ? colorStatus : null;
            }

            return (
                <TouchableWithoutFeedback
                    key={index}
                    onPress={() => this.onPressToDetail(ScreenName.AttSubmitTakeBusinessTrip, item.ID)}
                >
                    <View style={styles.viewStatus}>
                        <View
                            style={[
                                styles.styViewTextType,
                                {
                                    borderLeftColor: colorStatusView
                                        ? Vnr_Function.convertTextToColor(colorStatusView)
                                        : Colors.white
                                }
                            ]}
                        >
                            <VnrText
                                style={[styleSheets.lable, styles.txtLableTpye]}
                                i18nKey={'HRM_PortalApp_Wd_Business'}
                            />

                            <Text style={[styleSheets.text, styles.txtRegister]}>
                                {item.DurationTypeView ? `${item.DurationTypeView} (${item.LeaveyHours}h)` : ''}
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        });
    };

    renderListDataLeaveday = (_ListDataLeaveday) => {
        return _ListDataLeaveday.map((item, index) => {
            let colorStatusView = null;

            if (item.StatusView) {
                const { colorStatus } = Vnr_Services.formatStyleStatusApp(item.StatusView);
                colorStatusView = colorStatus ? colorStatus : null;
            }

            return (
                <TouchableWithoutFeedback
                    key={index}
                    onPress={() => this.onPressToDetail(ScreenName.AttSubmitTakeLeaveDay, item.ID)}
                >
                    <View style={styles.viewStatus}>
                        <View
                            style={[
                                styles.styViewTextType,
                                {
                                    borderLeftColor: colorStatusView
                                        ? Vnr_Function.convertTextToColor(colorStatusView)
                                        : Colors.white
                                }
                            ]}
                        >
                            <VnrText
                                style={[styleSheets.lable, styles.txtLableTpye]}
                                i18nKey={'HRM_PortalApp_Wd_LeaveDay'}
                            />

                            <Text style={[styleSheets.text, styles.txtRegister]}>
                                {item.DurationTypeView ? `${item.DurationTypeView} (${item.LeaveyHours}h)` : ''}
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        });
    };

    // renderListDataOvertimePlan = _ListDataTamScanLog => {
    //     return _ListDataTamScanLog.map(item => {
    //         let colorStatusView = null,
    //             borderStatusView = null,
    //             bgStatusView = null,
    //             dataStatus = item.DataStatus;

    //         if (dataStatus.Status) {
    //             const { colorStatus, borderStatus, bgStatus } = Vnr_Services.formatStyleStatusApp(dataStatus.Status);
    //             colorStatusView = colorStatus ? colorStatus : null;
    //             borderStatusView = borderStatus ? borderStatus : null;
    //             bgStatusView = bgStatus ? bgStatus : null;
    //         }

    //         return (
    //             <TouchableWithoutFeedback onPress={() => this.onPressToDetail(ScreenName.AttSubmitWorkingOvertime, item.ID)}>
    //                 <View style={styles.viewStatus}>
    //                     <View style={[styles.styViewTextType, {
    //                         borderLeftColor: colorStatusView
    //                             ? Vnr_Function.convertTextToColor(colorStatusView)
    //                             : Colors.white,
    //                     }]}>
    //                         <VnrText
    //                             style={[
    //                                 styleSheets.lable, styles.txtLableTpye
    //                             ]}
    //                             i18nKey={'HRM_PortalApp_Wd_OT'}
    //                         />

    //                         <Text style={[styleSheets.text, styles.txtRegister]}>
    //                             {item.DurationTypeView ? `${item.DurationTypeView} (${item.OvertimeHours}h)` : ''}
    //                         </Text>
    //                     </View>
    //                 </View>
    //             </TouchableWithoutFeedback>
    //         );
    //     });
    // };

    renderListDataOvertime = (_ListDataOvertime) => {
        return _ListDataOvertime.map((item, index) => {
            let colorStatusView = null,
                dataStatus = item.DataStatus;

            if (dataStatus.Status) {
                const { colorStatus } = Vnr_Services.formatStyleStatusApp(dataStatus.Status);
                colorStatusView = colorStatus ? colorStatus : null;
            }

            return (
                <TouchableWithoutFeedback
                    key={index}
                    onPress={() => this.onPressToDetail(ScreenName.AttSubmitWorkingOvertime, item.ID)}
                >
                    <View style={styles.viewStatus}>
                        <View
                            style={[
                                styles.styViewTextType,
                                {
                                    borderLeftColor: colorStatusView
                                        ? Vnr_Function.convertTextToColor(colorStatusView)
                                        : Colors.white
                                }
                            ]}
                        >
                            <VnrText style={[styleSheets.lable, styles.txtLableTpye]} i18nKey={'HRM_PortalApp_Wd_OT'} />

                            <Text style={[styleSheets.text, styles.txtRegister]}>
                                {item.DuratationTypeView ? `${item.DuratationTypeView} (${item.OvertimeHours}h)` : ''}
                            </Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            );
        });
    };

    iconStatus = (status, color) => {
        let buttonColor = color;
        let iconName = '';

        if (status == 'E_CANCEL') {
            iconName = <IconCancelMarker size={Size.text - 2} color={Colors.white} />;
        } else if (status == 'E_REJECT' || status == 'E_REJECTED') {
            iconName = <IconCancel size={Size.text - 2} color={Colors.white} />;
        } else if (status == 'E_SUBMIT') {
            iconName = <IconCancel size={Size.text - 2} color={Colors.white} />;
        } else if (status == 'E_DELETE') {
            iconName = <IconDelete size={Size.text - 2} color={Colors.white} />;
        } else if (
            status == 'E_APPROVED' ||
            status == 'E_APPROVED3' ||
            status == 'E_APPROVED' ||
            status == 'E_FIRST_APPROVED' ||
            status == 'E_APPROVED2' ||
            status == 'E_APPROVED1'
        ) {
            iconName = <IconCheck size={Size.text - 2} color={Colors.white} />;
        } else {
            iconName = <IconMinus size={Size.text - 2} color={Colors.white} />;
        }

        return <View style={[styles.styIconStatus, { backgroundColor: buttonColor }]}>{iconName}</View>;
    };

    onPressContent = () => {
        const { onPressContent, dataItem } = this.props;
        if (onPressContent) onPressContent(dataItem);
    };

    onPressToDetail = (screen, id) => {
        DrawerServices.navigate(`${screen}ViewDetail`, {
            screenName: screen,
            dataId: id
        });
    };

    renderContent = () => {
        const { dataItem, index } = this.props;
        let { isMissIn, isMissOut, isLate, isEarly, Outtime1, InTime1 } = dataItem;

        let dayOffWeek = '',
            colorStamScanlog = null,
            colorStamScanlogIn = null,
            colorStamScanlogOut = null,
            colorTime = Colors.gray_9;

        if (dataItem) {
            dayOffWeek = getDayOfWeek(dataItem.WorkDate);
        }

        if (dataItem.TamScanLogStatus && dataItem.TypeShift != 'E_NORMAL') {
            const { colorStatus } = Vnr_Services.formatStyleStatusApp(dataItem.TamScanLogStatus);
            colorStamScanlog = colorStatus ? Vnr_Function.convertTextToColor(colorStatus) : null;

            if (dataItem.TamScanLogStatus == EnumStatus.E_APPROVED) {
                if (!isLate && isMissIn && InTime1 != null) colorStamScanlogIn = colorStamScanlog;
                if (!isEarly && isMissOut && Outtime1 != null) colorStamScanlogOut = colorStamScanlog;

                if (isMissIn || isMissOut) {
                    colorStamScanlog = null;
                }
            } else {
                if (!isLate && isMissIn && InTime1 != null) colorStamScanlogIn = colorStamScanlog;
                if (!isEarly && isMissOut && Outtime1 != null) colorStamScanlogOut = colorStamScanlog;
            }
        }

        if (dataItem.TypeShift == 'E_NORMAL') {
            colorTime = Colors.green;
        }

        let isLeaveRegistered = false;
        if (
            dataItem.ListDataLeaveday &&
            dataItem.ListDataLeaveday.length > 0 &&
            dataItem.ListDataLeaveday[0].DurationType === EnumName.E_FULLSHIFT &&
            dataItem.LeavedayStatus == EnumStatus.E_APPROVED
        ) {
            isLeaveRegistered = true;
        }

        let midTimeLogText = '';
        if (dataItem.MidTimeLog) {
            midTimeLogText = dataItem.MidTimeLog.split('').reduce((acc, char, index) => {
                if (char === ',') {
                    acc.push(<Text key={index}>{char}</Text>);
                } else {
                    acc.push(
                        <Text key={index} style={{ color: Colors.green }}>
                            {char}
                        </Text>
                    );
                }
                return acc;
            }, []);
        }

        return (
            <TouchableWithoutFeedback onPress={() => this.onPressContent()}>
                <View style={styles.styContent}>
                    <View style={styles.styRowDate}>
                        <IconDate size={Size.text} color={dataItem.isToday ? Colors.primary : Colors.gray_10} />
                        <Text
                            style={[styleSheets.lable, styles.styDate, dataItem.isToday && { color: Colors.primary }]}
                        >
                            {`${dayOffWeek} `}
                            <Text
                                style={[
                                    styleSheets.lable,
                                    styles.styDateTime,
                                    dataItem.isToday && { color: Colors.primary }
                                ]}
                            >
                                {moment(dataItem.WorkDate).format('DD/MM/YYYY')}
                            </Text>
                        </Text>
                    </View>
                    <View style={styles.swipeable} key={index}>
                        <View style={[CustomStyleSheet.flexDirection('row')]}>
                            <View style={styles.leftBody}>
                                <Text style={[styleSheets.lable, styles.styShiftText]} numberOfLines={1}>
                                    {dataItem.ShiftName ? dataItem.ShiftName : ''}
                                </Text>

                                <Text style={[styleSheets.text, styles.styShiftText]}>
                                    {dataItem.StartShiftView && dataItem.EndShiftView
                                        ? `${dataItem.StartShiftView} - ${dataItem.EndShiftView}`
                                        : ''}
                                </Text>
                            </View>
                            <View style={styles.rightBody}>
                                <View style={styles.styltTime}>
                                    {dataItem.TypeShift == 'E_NORMAL' ? (
                                        <Text
                                            style={[
                                                styleSheets.text,
                                                styles.styShiftText,
                                                styles.styTypeView,
                                                { color: colorStamScanlog ? colorStamScanlog : colorTime }
                                            ]}
                                        >
                                            {dataItem.TypeView ? dataItem.TypeView : ''}
                                        </Text>
                                    ) : (
                                        <Text
                                            style={[
                                                styleSheets.text,
                                                styles.styShiftText,
                                                styles.styTypeView,
                                                { color: colorStamScanlog ? colorStamScanlog : Colors.red }
                                            ]}
                                        >
                                            {dataItem.TypeView ? dataItem.TypeView : ''}
                                        </Text>
                                    )}
                                </View>

                                <View style={styles.styltTime}>
                                    {isLate || isMissIn ? (
                                        <Text
                                            style={[
                                                styleSheets.lable,
                                                styles.styTimeText,
                                                { color: colorStamScanlogIn ? colorStamScanlogIn : Colors.red }
                                            ]}
                                        >
                                            {dataItem.InTime1
                                                ? moment(dataItem.InTime1).format('HH:mm')
                                                : isLeaveRegistered
                                                    ? '--'
                                                    : '??'}
                                        </Text>
                                    ) : (
                                        <Text
                                            style={[
                                                styleSheets.lable,
                                                styles.styTimeText,
                                                { color: colorStamScanlogIn ? colorStamScanlogIn : colorTime }
                                            ]}
                                        >
                                            {dataItem.InTime1
                                                ? moment(dataItem.InTime1).format('HH:mm')
                                                : isLeaveRegistered
                                                    ? '--'
                                                    : '??'}
                                        </Text>
                                    )}

                                    <Text style={[styleSheets.lable]}>{' - '}</Text>
                                    {isEarly || isMissOut ? (
                                        <Text
                                            style={[
                                                styleSheets.lable,
                                                styles.styTimeText,
                                                { color: colorStamScanlogOut ? colorStamScanlogOut : Colors.red }
                                            ]}
                                        >
                                            {dataItem.Outtime1
                                                ? moment(dataItem.Outtime1).format('HH:mm')
                                                : isLeaveRegistered
                                                    ? '--'
                                                    : '??'}
                                        </Text>
                                    ) : (
                                        <Text
                                            style={[
                                                styleSheets.lable,
                                                styles.styTimeText,
                                                { color: colorStamScanlogOut ? colorStamScanlogOut : colorTime }
                                            ]}
                                        >
                                            {dataItem.Outtime1
                                                ? moment(dataItem.Outtime1).format('HH:mm')
                                                : isLeaveRegistered
                                                    ? '--'
                                                    : '??'}
                                        </Text>
                                    )}
                                </View>
                            </View>
                        </View>
                        {dataItem?.MidTimeLog && (
                            <View style={[CustomStyleSheet.flexDirection('row'), CustomStyleSheet.alignItems('flex-end'), CustomStyleSheet.marginTop(4)]}>
                                <Text style={[styleSheets.text]}>{`${translate('HRM_PotalApp_AttWorkday_BreakTime')}: `}</Text>
                                <Text style={[styleSheets.text, styles.styShiftText]}>{midTimeLogText}</Text>
                            </View>
                        )}
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    renderContentOther = () => {
        const { dataItem, index } = this.props;

        let dayOffWeek = '',
            viewOther = <View />;

        if (dataItem) {
            dayOffWeek = getDayOfWeek(dataItem.WorkDate);
        }

        if (dataItem.DayType == 'E_HOLIDAY' || dataItem.DayType == 'OFF') {
            if (dataItem.DayType == 'OFF') dataItem.TypeView = 'OFF';
            viewOther = (
                <View style={styles.swipeable} key={index}>
                    <Text
                        style={[
                            styleSheets.lable,
                            styles.styShiftText,
                            dataItem.DayType == 'E_HOLIDAY' && { color: Colors.pink }
                        ]}
                        numberOfLines={1}
                    >
                        {dataItem.TypeView ? dataItem.TypeView : ''}
                    </Text>

                    <View style={styles.rightBody}>
                        {(dataItem.InTime1 != null || dataItem.Outtime1 != null) && (
                            <View style={styles.styltTime}>
                                <Text style={[styleSheets.lable, styles.styTimeText, { color: Colors.green }]}>
                                    {dataItem.InTime1 ? moment(dataItem.InTime1).format('HH:mm') : '??'}
                                </Text>

                                <Text style={[styleSheets.lable]}>{' - '}</Text>

                                <Text style={[styleSheets.lable, styles.styTimeText, { color: Colors.green }]}>
                                    {dataItem.Outtime1 ? moment(dataItem.Outtime1).format('HH:mm') : '??'}
                                </Text>
                            </View>
                        )}
                    </View>
                </View>
            );
        } else {
            viewOther = (
                <View style={[styles.swipeable, styles.swipeable_future]} key={index}>
                    <Text
                        style={[
                            styleSheets.lable,
                            styles.styShiftText
                            // dataItem.isToday && { color: Colors.primary }
                        ]}
                        numberOfLines={1}
                    >
                        {dataItem.ShiftName ? dataItem.ShiftName : ''}
                    </Text>

                    <Text style={[styleSheets.text, styles.styShiftText]}>
                        {dataItem.StartShiftView && dataItem.EndShiftView
                            ? `${dataItem.StartShiftView} - ${dataItem.EndShiftView}`
                            : ''}
                    </Text>
                </View>
            );
        }

        return (
            <View style={[styles.styContent]}>
                <View style={styles.styRowDate}>
                    <IconDate size={Size.text} color={Colors.gray_10} />
                    <Text style={[styleSheets.lable, styles.styDate]}>
                        {`${dayOffWeek} `}
                        <Text style={[styleSheets.lable, styles.styDateTime]}>
                            {moment(dataItem.WorkDate).format('DD/MM/YYYY')}
                            {/* styles.styDateTime */}
                        </Text>
                    </Text>
                </View>
                {viewOther}
            </View>
        );
    };

    renderContentShift2 = () => {
        const { dataItem, index } = this.props;

        let colorTime = Colors.gray_9;

        if (dataItem.TypeShift2 == 'E_NORMAL') {
            colorTime = Colors.green;
        }

        return (
            <TouchableWithoutFeedback onPress={() => this.onPressContent()}>
                <View style={styles.styContentShift2}>
                    <View style={styles.swipeable} key={index}>
                        <View style={styles.leftBody}>
                            <Text style={[styleSheets.lable, styles.styShiftText]} numberOfLines={1}>
                                {dataItem.Shift2Name ? dataItem.Shift2Name : ''}
                            </Text>

                            <Text style={[styleSheets.text, styles.styShiftText]}>
                                {dataItem.StartShift2View && dataItem.EndShift2View
                                    ? `${dataItem.StartShift2View} - ${dataItem.EndShift2View}`
                                    : ''}
                            </Text>
                        </View>
                        <View style={styles.rightBody}>
                            <View style={styles.styltTime}>
                                {dataItem.TypeShift2 == 'E_NORMAL' ? (
                                    <Text
                                        style={[
                                            styleSheets.text,
                                            styles.styShiftText,
                                            styles.styTypeView,
                                            { color: colorTime }
                                        ]}
                                    >
                                        {dataItem.TypeView2 ? dataItem.TypeView2 : ''}
                                    </Text>
                                ) : (
                                    <Text
                                        style={[
                                            styleSheets.text,
                                            styles.styShiftText,
                                            styles.styTypeView,
                                            { color: Colors.red }
                                        ]}
                                    >
                                        {dataItem.TypeView2 ? dataItem.TypeView2 : ''}
                                    </Text>
                                )}
                            </View>

                            <View style={styles.styltTime}>
                                {dataItem.TypeShift2 !== 'E_NORMAL' ? (
                                    <Text style={[styleSheets.lable, styles.styTimeText, { color: Colors.red }]}>
                                        {dataItem.InTime2 ? moment(dataItem.InTime2).format('HH:mm') : '??'}
                                    </Text>
                                ) : (
                                    <Text style={[styleSheets.lable, styles.styTimeText, { color: colorTime }]}>
                                        {dataItem.InTime2 ? moment(dataItem.InTime2).format('HH:mm') : '??'}
                                    </Text>
                                )}

                                <Text style={[styleSheets.lable]}>{' - '}</Text>
                                {dataItem.TypeShift2 !== 'E_NORMAL' ? (
                                    <Text style={[styleSheets.lable, styles.styTimeText, { color: Colors.red }]}>
                                        {dataItem.Outtime2 ? moment(dataItem.Outtime2).format('HH:mm') : '??'}
                                    </Text>
                                ) : (
                                    <Text style={[styleSheets.lable, styles.styTimeText, { color: colorTime }]}>
                                        {dataItem.Outtime2 ? moment(dataItem.Outtime2).format('HH:mm') : '??'}
                                    </Text>
                                )}
                            </View>
                        </View>
                    </View>
                </View>
            </TouchableWithoutFeedback>
        );
    };

    renderTimeLine = () => {
        const { dataItem } = this.props;

        let viewIconLine = <View />;

        if (dataItem.isFuture || dataItem.DayType == 'E_HOLIDAY' || dataItem.DayType == 'OFF') {
            viewIconLine = (
                <View
                    style={[
                        styles.stylineIcon,
                        {
                            ...CustomStyleSheet.backgroundColor(Colors.white),
                            ...CustomStyleSheet.borderWidth(1),
                            ...CustomStyleSheet.borderColor(Colors.gray_7)
                        }
                    ]}
                >
                    <IconDot size={Size.text - 3} color={Colors.gray_7} />
                </View>
            );
        } else if (
            dataItem.TamScanLogStatus &&
            dataItem.TypeShift != 'E_NORMAL' &&
            dataItem.TamScanLogStatus !== EnumStatus.E_APPROVED
        ) {
            let { colorStatus } = Vnr_Services.formatStyleStatusApp(dataItem.TamScanLogStatus),
                colorStamScanlog = colorStatus ? Vnr_Function.convertTextToColor(colorStatus) : null;

            viewIconLine = (
                <View style={[styles.stylineIcon, { backgroundColor: colorStamScanlog }]}>
                    <IconMoreHorizontal size={Size.text - 3} color={Colors.white} />
                </View>
            );
        } else if (dataItem.TypeShift == 'E_NORMAL') {
            viewIconLine = (
                <View style={[styles.stylineIcon, { backgroundColor: Colors.green }]}>
                    <IconCheck size={Size.text - 3} color={Colors.white} />
                </View>
            );
        } else {
            viewIconLine = (
                <View style={[styles.stylineIcon, { backgroundColor: Colors.red }]}>
                    <IconExclamation size={Size.text - 3} color={Colors.white} />
                </View>
            );
        }

        return (
            <View style={styles.styViewLine}>
                <View style={styles.styTimeLine} />
                {viewIconLine}
            </View>
        );
    };

    render() {
        const { dataItem } = this.props;

        return (
            <View style={styles.containerItem}>
                {this.renderTimeLine(dataItem)}

                {dataItem.isFuture || dataItem.DayType == 'E_HOLIDAY' || dataItem.DayType == 'OFF'
                    ? this.renderContentOther()
                    : this.renderContent()}

                {dataItem.IsHaveTwoShift != null && this.renderContentShift2()}

                {dataItem.ListDataOvertime &&
                    dataItem.ListDataOvertime.length > 0 &&
                    this.renderListDataOvertime(dataItem.ListDataOvertime)}

                {dataItem.ListDataLeaveday &&
                    dataItem.ListDataLeaveday.length > 0 &&
                    this.renderListDataLeaveday(dataItem.ListDataLeaveday)}

                {dataItem.ListDataBusiness &&
                    dataItem.ListDataBusiness.length > 0 &&
                    this.renderListDataBusiness(dataItem.ListDataBusiness)}

                {/* {dataItem.ListDataOvertimePlan &&
                    dataItem.ListDataOvertimePlan.length > 0 &&
                    this.renderListDataOvertimePlan(dataItem.ListDataOvertimePlan)} */}

                {/* {dataItem.ListDataChangeRoster &&
                    dataItem.ListDataChangeRoster.length > 0 &&
                    this.renderListDataChangeRoster(dataItem.ListDataChangeRoster)} */}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerItem: {
        flex: 1,
        position: 'relative',
        paddingBottom: Size.defineHalfSpace
    },
    styRowDate: {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'flex-start',
        marginBottom: 5
    },
    styContent: {
        width: '100%',
        paddingTop: Size.defineSpace,
        paddingHorizontal: Size.defineSpace,
        paddingLeft: Size.defineSpace * 3
    },
    styContentShift2: {
        width: '100%',
        paddingHorizontal: Size.defineSpace,
        paddingLeft: Size.defineSpace * 3
    },
    styDate: {
        fontSize: Size.text - 1,
        marginTop: -2,
        marginLeft: 4
    },
    styDateTime: {
        fontSize: Size.text - 1,
        color: Colors.gray_9
    },
    viewStatus: {
        width: '100%',
        paddingHorizontal: Size.defineSpace,
        paddingLeft: Size.defineSpace * 3
    },
    styViewTextType: {
        flex: 1,
        paddingVertical: Size.defineHalfSpace,
        paddingHorizontal: Size.defineSpace,
        backgroundColor: Colors.white,
        borderTopColor: Colors.gray_5,
        borderLeftWidth: 2.5,
        borderTopWidth: 0.5
    },
    txtLableTpye: {
        fontSize: Size.text
    },
    txtRegister: {
        fontSize: Size.text - 1,
        color: Colors.gray_8
    },
    rightBody: {
        flex: 5,
        alignItems: 'flex-end'
    },
    styltTime: {
        flexDirection: 'row',
        marginLeft: Size.defineSpace
    },
    styTimeText: {
        color: Colors.gray_10,
        fontSize: Size.text - 1,
        fontWeight: '600'
    },

    swipeable: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: Size.defineHalfSpace,
        paddingHorizontal: Size.defineSpace,
        backgroundColor: Colors.white
    },
    swipeable_future: {
        backgroundColor: Colors.gray_2,
        flexDirection: 'column'
    },
    styShiftText: {
        fontSize: Size.text - 1,
        color: Colors.gray_10
    },
    styTypeView: {
        textAlign: 'right'
    },
    leftBody: {
        flex: 5,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginRight: 23
    },
    // style Line
    styViewLine: {
        height: '100%',
        position: 'absolute',
        top: Size.defineSpace,
        left: Size.defineSpace
        // backgroundColor: Colors.red_3
    },
    stylineIcon: {
        width: Size.text + 2,
        height: Size.text + 2,
        borderRadius: (Size.text + 2) / 2,
        backgroundColor: Colors.red,
        justifyContent: 'center',
        alignItems: 'center'
    },

    styTimeLine: {
        position: 'absolute',
        top: 0,
        left: (Size.text + 2) / 2,
        width: 0.5,
        height: '100%',
        borderWidth: 0.6,
        // backgroundColor : 'red',
        borderColor: Colors.gray_5,
        borderStyle: 'dotted',
        borderRadius: 1
    }
});
