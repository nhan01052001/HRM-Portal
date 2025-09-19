import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Size, styleSheets, Colors } from '../../../../../constants/styleConfig';
import moment from 'moment';
import VnrText from '../../../../../components/VnrText/VnrText';
import { getDayOfWeek } from '../../../../../i18n/langCalendars';
import { EnumName } from '../../../../../assets/constant';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { IconCancel, IconCancelMarker, IconCheck, IconDelete, IconMinus } from '../../../../../constants/Icons';
import { translate } from '../../../../../i18n/translate';

export default class WorkDayV2ListItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    renderListAllowLateEarly = _listListAllowLateEarly => {
        return _listListAllowLateEarly.map(item => {
            let colorStatusView = null,
                bgStatusView = null;

            if (item.itemStatus) {
                const { colorStatus, borderStatus, bgStatus } = item.itemStatus;
                colorStatusView = colorStatus ? colorStatus : null;
                bgStatusView = bgStatus ? bgStatus : null;
            }

            return (
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
            );
        });
    };

    renderListForgeLeaveday = _listForgeLeaveday => {
        return _listForgeLeaveday.map(item => {
            let colorStatusView = null,
                bgStatusView = null;

            if (item.itemStatus) {
                const { colorStatus, borderStatus, bgStatus } = item.itemStatus;
                colorStatusView = colorStatus ? colorStatus : null;
                bgStatusView = bgStatus ? bgStatus : null;
            }

            return (
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
                            {this.iconStatus(item.StatusLeave, Vnr_Function.convertTextToColor(colorStatusView))}
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
                                i18nKey={'HRM_PortalApp_Workday_ForgeLeaveday'}
                            />
                        </View>

                        <Text style={[styleSheets.lable]}>
                            {item.LeaveDays !== null
                                ? `${Vnr_Function.mathRoundNumber(item.LeaveDays)} ${translate('E_DAY_LOWERCASE')}`
                                : null}
                        </Text>
                    </View>
                </View>
            );
        });
    };

    renderListBusinessTravel = _listBusinessTravel => {
        return _listBusinessTravel.map(item => {
            let colorStatusView = null,
                bgStatusView = null;

            if (item.itemStatus) {
                const { colorStatus, borderStatus, bgStatus } = item.itemStatus;
                colorStatusView = colorStatus ? colorStatus : null;
                bgStatusView = bgStatus ? bgStatus : null;
            }

            return (
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
                            {this.iconStatus(item.StatusLeave, Vnr_Function.convertTextToColor(colorStatusView))}
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
                                i18nKey={'Att_BusinessTrip'}
                            />
                        </View>

                        <Text style={[styleSheets.lable]}>
                            {item.LeaveDays !== null
                                ? `${Vnr_Function.mathRoundNumber(item.LeaveDays)} ${translate('E_DAY_LOWERCASE')}`
                                : null}
                        </Text>
                    </View>
                </View>
            );
        });
    };

    renderListLeaveDay = _listLeaveDay => {
        return _listLeaveDay.map(item => {
            let colorStatusView = null,
                bgStatusView = null;

            if (item.itemStatus) {
                const { colorStatus, borderStatus, bgStatus } = item.itemStatus;
                colorStatusView = colorStatus ? colorStatus : null;
                bgStatusView = bgStatus ? bgStatus : null;
            }

            return (
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
                            {this.iconStatus(item.StatusLeave, Vnr_Function.convertTextToColor(colorStatusView))}
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
                                i18nKey={'AnnualLeaveDetailType__E_ANNUAL_LEAVE'}
                            />
                        </View>

                        <Text style={[styleSheets.lable]}>
                            {`${Vnr_Function.mathRoundNumber(item.LeaveDays)} (${item.LeavedayTypeCode})`}
                        </Text>
                    </View>
                </View>
            );
        });
    };

    renderTamscanlogRegister = _listTamscanlogRegister => {
        return _listTamscanlogRegister.map(item => {
            let colorStatusView = null,
                borderStatusView = null,
                bgStatusView = null;

            if (item.itemStatus) {
                const { colorStatus, borderStatus, bgStatus } = item.itemStatus;
                colorStatusView = colorStatus ? colorStatus : null;
                borderStatusView = borderStatus ? borderStatus : null;
                bgStatusView = bgStatus ? bgStatus : null;
            }

            return (
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
                                i18nKey={'Quên chấm công'}
                            />
                        </View>

                        <Text style={[styleSheets.lable]}>
                            {item.TimeLog
                                ? `${item.TypeTamscanlogRegisterView} (${moment(item.TimeLog).format('HH:mm')})`
                                : ''}
                        </Text>
                    </View>
                </View>
            );
        });
    };

    renderListOvertime = _listOvertime => {
        return _listOvertime.map(item => {
            let colorStatusView = null,
                borderStatusView = null,
                bgStatusView = null;

            if (item.itemStatus) {
                const { colorStatus, borderStatus, bgStatus } = item.itemStatus;
                colorStatusView = colorStatus ? colorStatus : null;
                borderStatusView = borderStatus ? borderStatus : null;
                bgStatusView = bgStatus ? bgStatus : null;
            }

            return (
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
                            {this.iconStatus(item.StatusOvertime, Vnr_Function.convertTextToColor(colorStatusView))}
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
                                i18nKey={'HRM_Att_WorkdaySummary_OT'}
                            />
                        </View>

                        <Text style={[styleSheets.lable]}>
                            {`${Vnr_Function.mathRoundNumber(item.OvertimeHours)} ${translate('E_IMPORT_FILE_HOUR')}`}
                        </Text>
                    </View>
                </View>
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

    renderContent = () => {
        const { dataItem, index } = this.props;
        let isHaveNotShift = false,
            isMissIn = false,
            isMissOut = false,
            isLate = false,
            isEarly = false;
        if (dataItem.TitleWeek == null) {
            // check có ca không
            if (dataItem.ShiftID == null) isHaveNotShift = true;
            else isHaveNotShift = false;

            // // check missInout
            // if (dataItem.ShiftID != null && (dataItem.Type == 'E_MISS_OUT' || dataItem.Type == 'E_MISS_IN' || dataItem.Type == 'E_MISS_IN_OUT')
            //     && dataItem.Type !== 'E_HOLIDAY'
            // )
            //     isHaveNotShift = true;
            // else
            //     isHaveNotShift = false;
        }
        if (moment(dataItem.WorkDate).isSameOrBefore(new Date(), 'date')) {
            if (dataItem.Type == 'E_MISS_IN_OUT') {
                isMissIn = true;
                isMissOut = true;
            } else {
                if (dataItem.Type == 'E_MISS_IN' && dataItem.ShiftID != null) {
                    isMissIn = true;
                }

                if (dataItem.Type == 'E_MISS_OUT' && dataItem.ShiftID != null) {
                    isMissOut = true;
                }
            }

            if (dataItem.LateDuration1) {
                isLate = true;
            }

            if (dataItem.EarlyDuration1) {
                isEarly = true;
            }
        }

        let dayOffWeek = '',
            isToday = false;

        if (dataItem) {
            day = moment(dataItem.WorkDate).format('DD');
            dayOffWeek = getDayOfWeek(dataItem.WorkDate);
        }

        if (moment(dataItem.WorkDate).format('DD/MM/YYYY') === moment().format('DD/MM/YYYY')) {
            isToday = true;
        }

        return (
            <View style={styles.swipeable} key={index}>
                <View style={styles.leftBody}>
                    <Text
                        style={[
                            styleSheets.lable,
                            styles.viewTime_week,
                            isToday && { color: Colors.primary },
                            (isLate || isMissIn || isMissOut || isEarly) && { color: Colors.red }
                        ]}
                    >
                        {`${dayOffWeek} ${moment(dataItem.WorkDate).format('DD/MM/YYYY')}`}
                    </Text>
                </View>
                <View style={styles.rightBody}>
                    <View style={styles.styltTime}>
                        <View style={[styles.styClTime, isMissIn && { backgroundColor: Colors.red }]}>
                            <Text style={[styleSheets.text, styles.styClTimeText]}>{dataItem.InTimeLabel}</Text>
                        </View>
                        <Text
                            style={[
                                styleSheets.lable,
                                styles.styTimeText,
                                (isLate || isMissIn) && { color: Colors.red }
                            ]}
                        >
                            {dataItem.InTime1 ? moment(dataItem.InTime1).format('HH:mm') : '??      '}
                        </Text>
                    </View>

                    <View style={styles.styltTime}>
                        <View style={[styles.styClTime, isMissOut && { backgroundColor: Colors.red }]}>
                            <Text style={[styleSheets.text, styles.styClTimeText]}>{dataItem.OutTimeLabel}</Text>
                        </View>

                        <Text
                            style={[
                                styleSheets.lable,
                                styles.styTimeText,
                                (isEarly || isMissOut) && { color: Colors.red }
                            ]}
                        >
                            {dataItem.OutTime1 ? moment(dataItem.OutTime1).format('HH:mm') : '??      '}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    renderContentFuture = () => {
        const { dataItem, index } = this.props;

        let isHaveNotShift = false,
            isMissIn = false,
            isMissOut = false,
            isLate = false,
            isEarly = false;

        if (dataItem.TitleWeek == null) {
            // check có ca không
            if (dataItem.ShiftID == null) isHaveNotShift = true;
            else isHaveNotShift = false;
        }

        let dayOffWeek = '',
            day = '',
            isToday = false;

        if (dataItem) {
            day = moment(dataItem.WorkDate).format('DD');
            dayOffWeek = getDayOfWeek(dataItem.WorkDate);
        }

        if (moment(dataItem.WorkDate).format('DD/MM/YYYY') === moment().format('DD/MM/YYYY')) {
            isToday = true;
        }

        return (
            <View style={[styles.swipeable, styles.swipeable_future]} key={index}>
                <View style={styles.leftBody}>
                    <Text
                        style={[
                            styleSheets.lable,
                            styles.viewTime_future,
                            isToday && { color: Colors.primary },
                            (isLate || isMissIn || isMissOut || isEarly) && { color: Colors.red }
                        ]}
                    >
                        {`${dayOffWeek} ${moment(dataItem.WorkDate).format('DD/MM/YYYY')}`}
                    </Text>
                </View>
                <View style={styles.rightBody}>
                    <Text style={[styleSheets.text, styles.styShiftName]}>{dataItem.ShiftName}</Text>
                </View>
            </View>
        );
    };

    render() {
        const { dataItem } = this.props;

        return (
            <View style={styles.containerItem}>
                {dataItem.isFuture ? this.renderContentFuture() : this.renderContent()}

                {dataItem.ListLeaveday &&
                    dataItem.ListLeaveday.length > 0 &&
                    this.renderListLeaveDay(dataItem.ListLeaveday)}

                {dataItem.ListOvertime &&
                    dataItem.ListOvertime.length > 0 &&
                    this.renderListOvertime(dataItem.ListOvertime)}

                {dataItem.ListForgeLeaveday &&
                    dataItem.ListForgeLeaveday.length > 0 &&
                    this.renderListForgeLeaveday(dataItem.ListForgeLeaveday)}

                {dataItem.ListBusinessTravel &&
                    dataItem.ListBusinessTravel.length > 0 &&
                    this.renderListBusinessTravel(dataItem.ListBusinessTravel)}

                {dataItem.ListTamscanlogRegister &&
                    dataItem.ListTamscanlogRegister.length > 0 &&
                    this.renderTamscanlogRegister(dataItem.ListTamscanlogRegister)}

                {dataItem.ListAllowLateEarly &&
                    dataItem.ListAllowLateEarly.length > 0 &&
                    this.renderListAllowLateEarly(dataItem.ListAllowLateEarly)}
            </View>
        );
    }
}

const styles = StyleSheet.create({
    containerItem: {
        flex: 1
    },
    viewStatus: {
        width: '100%',
        backgroundColor: Colors.white
    },
    styIconStatus: {
        width: Size.iconSize - 3,
        height: Size.iconSize - 3,
        borderRadius: (Size.iconSize - 3) / 2,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5,
        marginTop: 2
    },
    styViewTextType: {
        width: '80%',
        flexDirection: 'row',
        alignSelf: 'flex-end',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingLeft: Size.defineHalfSpace,
        paddingRight: Size.defineSpace,
        paddingVertical: 6,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    },
    styViewIc: {
        flexDirection: 'row'
    },
    txtRegister: {
        fontWeight: '500'
    },
    rightBody: {
        flex: 6,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    styltTime: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginLeft: Size.defineSpace
    },
    styClTimeText: {
        color: Colors.white,
        fontSize: Size.text - 1
    },
    styTimeText: {
        color: Colors.gray_10,
        fontSize: Size.text + 2,
        fontWeight: '600'
    },
    styClTime: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.green,
        width: 32,
        height: 32,
        borderRadius: 32 / 2,
        marginRight: Size.defineHalfSpace
    },

    swipeable: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: Size.defineHalfSpace,
        paddingHorizontal: Size.defineSpace,
        backgroundColor: Colors.white,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    },
    swipeable_future: {
        backgroundColor: Colors.gray_2
    },
    styShiftName: {
        color: Colors.gray_7
    },
    viewTime_future: {
        color: Colors.gray_7
    },
    viewTime_week: {
        fontSize: Size.text + 1,
        color: Colors.gray_10
    },
    viewTime_day: {
        fontSize: Size.text + 11,
        fontWeight: '600',
        color: Colors.gray_10
    },

    leftBody: {
        flex: 4,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginRight: 23
    },
    line: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: Size.defineSpace / 2
    },
    lineLeft: {
        flexDirection: 'row',
        alignItems: 'center'
    }
});
