import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import {
    Colors,
    CustomStyleSheet,
    Size,
    styleSheets,
    styleSwipeableAction
} from '../../../../../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import ActionSheet from 'react-native-actionsheet';
import Vnr_Function from '../../../../../../utils/Vnr_Function';
import { translate } from '../../../../../../i18n/translate';
import {
    IconLeaveDay,
    IconInOut,
    IconTime,
    IconMoreHorizontal,
    IconMinus,
    IconLogin,
    IconLogout,
    IconInfo,
    IconDown,
    IconUp,
    IconBack
} from '../../../../../../constants/Icons';
import VnrText from '../../../../../../components/VnrText/VnrText';
import { AlertSevice } from '../../../../../../components/Alert/Alert';
import { EnumIcon, EnumName } from '../../../../../../assets/constant';

export default class RenderItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            showHideGroup: {
                // [EnumName.E_OVERTIME] : false
            }
        };
        this.formatStringType = this.formatStringType.bind(this);
        this.sheetActions = [
            {
                title: translate('HRM_Common_Close'),
                onPress: null
            }
        ];

        if (!Vnr_Function.CheckIsNullOrEmpty(this.props.rowActions) && Array.isArray(this.props.rowActions)) {
            this.rightListActions = this.props.rowActions;
            if (this.rightListActions.length > 2) {
                this.sheetActions = [...this.rightListActions.slice(1), ...this.sheetActions];
            } else if (this.rightListActions.length > 0) {
                this.sheetActions = [...this.rightListActions.slice(2), ...this.sheetActions];
            }
        }
    }

    formatStringType = (data, col) => {
        if (col.DataType && col.DataType.toLowerCase() == 'datetime') {
            return moment(data[col.Name]).format(col.DataFormat);
        }
        if (col.DataType && col.DataType.toLowerCase() == 'double') {
            return format(col.DataFormat, data[col.Name]);
        } else {
            return data[col.Name];
        }
    };

    openActionSheet = () => {
        this.ActionSheet.show();
    };

    actionSheetOnCLick = (index) => {
        const { dataItem } = this.props;
        !Vnr_Function.CheckIsNullOrEmpty(this.sheetActions[index].onPress) &&
            this.sheetActions[index].onPress(dataItem);
    };

    rightActionsEmpty = () => {
        return <View style={CustomStyleSheet.width(0)} />;
    };

    rightActions = () => {
        const options = this.sheetActions.map((item) => {
            return item.title;
        });
        const { dataItem } = this.props;

        return (
            <View style={CustomStyleSheet.flexDirection('row')}>
                {!Vnr_Function.CheckIsNullOrEmpty(this.sheetActions) && this.sheetActions.length > 1 && (
                    <View style={[styleSwipeableAction.viewIcon]}>
                        <TouchableOpacity onPress={() => this.openActionSheet()} style={styleSwipeableAction.bnt_icon}>
                            <View style={[styleSwipeableAction.icon, { backgroundColor: Colors.gray_7 }]}>
                                <IconMoreHorizontal size={Size.iconSize} color={Colors.white} />
                            </View>
                            <Text style={[styleSheets.text, styles.bnt_iconTile]}>{translate('MoreActions')}</Text>
                        </TouchableOpacity>

                        <ActionSheet
                            ref={(o) => (this.ActionSheet = o)}
                            //title={'Which one do you like ?'}
                            options={options}
                            cancelButtonIndex={this.sheetActions.length - 1}
                            destructiveButtonIndex={this.sheetActions.length - 1}
                            onPress={(index) => this.actionSheetOnCLick(index)}
                        />
                    </View>
                )}

                {!Vnr_Function.CheckIsNullOrEmpty(this.rightListActions) &&
                    this.rightListActions.length > 0 &&
                    this.rightListActions.map((item, index) => {
                        let buttonColor = '';
                        let iconName = '';
                        switch (item.type) {
                            case 'E_LEAVEDAY':
                                buttonColor = Colors.info;
                                iconName = <IconLeaveDay size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_INOUT':
                                buttonColor = Colors.warning;
                                iconName = <IconInOut size={Size.iconSize} color={Colors.white} />;
                                break;
                            case 'E_OVERTIME':
                                buttonColor = Colors.primary;
                                iconName = <IconTime size={Size.iconSize} color={Colors.white} />;
                                break;
                            case EnumName.E_EARLYALLOWED:
                                buttonColor = Colors.purple;
                                iconName = <IconLogin size={Size.iconSize} color={Colors.white} />;
                                break;
                        }

                        if (this.sheetActions.length > 0 && index < 1) {
                            return (
                                <View style={styleSwipeableAction.viewIcon}>
                                    <TouchableOpacity
                                        onPress={() => item.onPress(dataItem)}
                                        style={styleSwipeableAction.bnt_icon}
                                    >
                                        <View style={[styleSwipeableAction.icon, { backgroundColor: buttonColor }]}>
                                            {iconName}
                                        </View>
                                        <Text style={[styleSheets.text, styles.bnt_iconTile]}>{item.title}</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        } else if (this.sheetActions.length <= 1 && index < 2) {
                            return (
                                <View style={styleSwipeableAction.viewIcon}>
                                    <TouchableOpacity
                                        onPress={() => item.onPress(dataItem)}
                                        style={styleSwipeableAction.bnt_icon}
                                    >
                                        <View style={[styleSwipeableAction.icon, { backgroundColor: buttonColor }]}>
                                            {iconName}
                                        </View>
                                        <Text style={[styleSheets.text, styles.bnt_iconTile]}>{item.title}</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        }
                    })}
            </View>
        );
    };

    renderListLeaveDay = (_listLeaveDay) => {
        return _listLeaveDay.map((item, index) => {
            let textTypeBusiness = '',
                textShowDetail = '',
                colorStatusView = null,
                borderStatusView = null,
                bgStatusView = null;

            if (item.itemStatus) {
                const { colorStatus, borderStatus, bgStatus } = item.itemStatus;
                colorStatusView = colorStatus ? colorStatus : null;
                borderStatusView = borderStatus ? borderStatus : null;
                bgStatusView = bgStatus ? bgStatus : null;
            }

            if (item.LeavedayTypeName) textTypeBusiness = `${item.LeavedayTypeName}`;

            textShowDetail = `${translate(
                'HRM_PortalApp_Workday_LeaveDayType'
            )} ${textTypeBusiness} ${Vnr_Function.mathRoundNumber(
                item.LeaveHours ? item.LeaveHours : item.LeaveDays
            )} ${translate('E_IMPORT_FILE_HOUR')} ${
                item.LeavedayTypeCodeStatistic ? item.LeavedayTypeCodeStatistic : item.LeavedayTypeCode
            }`;
            return (
                <View key={index} style={styles.viewStatus}>
                    <View style={styles.dotSttLeaveDay} />

                    <View style={[styles.styViewTextType]}>
                        <Text style={[styleSheets.textItalic, styles.txtRegister]}>
                            {`${translate('AnnualLeaveDetailType__E_ANNUAL_LEAVE')}`}
                        </Text>

                        <TouchableOpacity onPress={() => this.showTypeName(textShowDetail)}>
                            <Text style={[styleSheets.textItalic, styles.txtCodeType]}>
                                {item.LeavedayTypeCodeStatistic
                                    ? `${Vnr_Function.mathRoundNumber(
                                        item.LeaveHours ? item.LeaveHours : item.LeaveDays
                                    )} ${translate('E_IMPORT_FILE_HOUR')} ${item.LeavedayTypeCodeStatistic}`
                                    : `${Vnr_Function.mathRoundNumber(
                                        item.LeaveHours ? item.LeaveHours : item.LeaveDays
                                    )} ${translate('E_IMPORT_FILE_HOUR')} ${item.LeavedayTypeCode}`}
                                {/* {item.LeaveHours} {translate('E_IMPORT_FILE_HOUR')} {item.LeavedayTypeCodeStatistic} */}
                            </Text>
                        </TouchableOpacity>
                        <View />
                    </View>

                    <View
                        style={[
                            styles.styViewStatus,
                            {
                                borderColor: borderStatusView
                                    ? Vnr_Function.convertTextToColor(borderStatusView)
                                    : Colors.gray_10,
                                backgroundColor: bgStatusView
                                    ? Vnr_Function.convertTextToColor(bgStatusView)
                                    : Colors.white
                            }
                        ]}
                    >
                        <Text
                            style={[
                                styleSheets.text,
                                styles.txtStatus,
                                {
                                    color: colorStatusView
                                        ? Vnr_Function.convertTextToColor(colorStatusView)
                                        : Colors.gray_10
                                }
                            ]}
                            numberOfLines={1}
                        >
                            {item.StatusLeaveView}
                        </Text>
                    </View>
                </View>
            );
        });
    };

    renderListAllowLateEarly = (_listListAllowLateEarly) => {
        return _listListAllowLateEarly.map((item, index) => {
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
                <View key={index} style={styles.viewStatus}>
                    <View style={styles.dotSttAllowLateEarly} />

                    <View style={[styles.styViewTextType]}>
                        <Text style={[styleSheets.textItalic, styles.txtRegister]}>
                            {item.LateMinutes
                                ? translate('HRM_Attendance_WorkDay_LateDuration')
                                : translate('HRM_Attendance_WorkDay_EarlyDuration')}
                        </Text>
                        <View>
                            <Text style={[styleSheets.textItalic]}>
                                {item.LateMinutes
                                    ? `${item.LateMinutes} ${translate('Minute_Lowercase')}`
                                    : `${item.EarlyMinutes} ${translate('Minute_Lowercase')}`}
                            </Text>
                        </View>
                        <View />
                    </View>

                    <View
                        style={[
                            styles.styViewStatus,
                            {
                                borderColor: borderStatusView
                                    ? Vnr_Function.convertTextToColor(borderStatusView)
                                    : Colors.gray_10,
                                backgroundColor: bgStatusView
                                    ? Vnr_Function.convertTextToColor(bgStatusView)
                                    : Colors.white
                            }
                        ]}
                    >
                        <Text
                            style={[
                                styleSheets.text,
                                styles.txtStatus,
                                {
                                    color: colorStatusView
                                        ? Vnr_Function.convertTextToColor(colorStatusView)
                                        : Colors.gray_10
                                }
                            ]}
                            numberOfLines={1}
                        >
                            {item.StatusView}
                        </Text>
                    </View>
                </View>
            );
        });
    };

    renderListOvertime = (_listOvertime) => {
        const { showHideGroup } = this.state;
        let objGroup = {};

        _listOvertime.map((item) => {
            if (item.GroupType) {
                if (objGroup[item.GroupType]) {
                    objGroup[item.GroupType].value += item.OvertimeHours;
                    objGroup[item.GroupType].data.push(item);
                } else {
                    objGroup[item.GroupType] = {
                        value: item.OvertimeHours,
                        data: [item],
                        isDisplay: false
                    };
                }
            }
        });

        if (Object.keys(objGroup).length > 0) {
            return Object.keys(objGroup).map((key, index) => {
                let keyTranslate = '',
                    valueHoursGroup = objGroup[key] ? objGroup[key]['value'] : '0',
                    dataGroup = objGroup[key] ? objGroup[key]['data'] : [];

                if (key === 'E_WORKDAY') {
                    keyTranslate = 'HRM_Att_Workday_Master_TotalOvertimeHoursWorkday';
                } else if (key === 'E_WEEKEND') {
                    keyTranslate = 'HRM_Att_Workday_Master_TotalOvertimeHoursWeekend';
                } else if (key === 'E_HOLIDAY') {
                    keyTranslate = 'HRM_Att_Workday_Master_TotalOvertimeHoursHoliday';
                }

                return (
                    <View key={index}>
                        <View style={styles.viewStatus}>
                            <View style={styles.dotSttOvertime} />

                            <View style={[styles.styViewTextType]}>
                                <Text style={[styleSheets.textItalic, styles.txtRegister]}>
                                    {`${translate('HRM_Att_WorkdaySummary_OT')}`}
                                </Text>

                                <View>
                                    <Text style={[styleSheets.textItalic]}>
                                        {`${valueHoursGroup} ${translate(keyTranslate)}`}
                                    </Text>
                                </View>
                                <View />
                            </View>

                            {showHideGroup[key + valueHoursGroup] ? (
                                <TouchableOpacity
                                    style={[
                                        styles.styViewStatus,
                                        {
                                            borderColor: Colors.gray_8
                                        }
                                    ]}
                                    onPress={() =>
                                        this.setState({
                                            showHideGroup: {
                                                ...showHideGroup,
                                                [key + valueHoursGroup]: false
                                            }
                                        })
                                    }
                                >
                                    <IconUp size={Size.iconSize} color={Colors.gray_8} />
                                </TouchableOpacity>
                            ) : (
                                <TouchableOpacity
                                    style={[
                                        styles.styViewStatus,
                                        {
                                            borderColor: Colors.gray_8
                                        }
                                    ]}
                                    onPress={() =>
                                        this.setState({
                                            showHideGroup: {
                                                ...showHideGroup,
                                                [key + valueHoursGroup]: true
                                            }
                                        })
                                    }
                                >
                                    <IconDown size={Size.iconSize} color={Colors.gray_8} />
                                </TouchableOpacity>
                            )}
                        </View>
                        <View style={{}}>
                            {showHideGroup[key + valueHoursGroup] &&
                                dataGroup.map((item, index) => {
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
                                        <View key={index} style={styles.viewStatusGroup}>
                                            <View style={styles.dotSttOvertime} />

                                            <View style={[styles.styViewTextType]}>
                                                <Text style={[styleSheets.textItalic, styles.txtRegister]}>
                                                    {`${translate('HRM_Att_WorkdaySummary_OT')}`}
                                                </Text>

                                                <View>
                                                    <Text style={[styleSheets.textItalic]}>
                                                        {`${Vnr_Function.mathRoundNumber(item.OvertimeHours)} ${
                                                            item.OvertimeTypeName
                                                        }`}
                                                    </Text>
                                                </View>
                                                <View />
                                            </View>

                                            <View
                                                style={[
                                                    styles.styViewStatus,
                                                    {
                                                        borderColor: borderStatusView
                                                            ? Vnr_Function.convertTextToColor(borderStatusView)
                                                            : Colors.gray_10,
                                                        backgroundColor: bgStatusView
                                                            ? Vnr_Function.convertTextToColor(bgStatusView)
                                                            : Colors.white
                                                    }
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styleSheets.text,
                                                        styles.txtStatus,
                                                        {
                                                            color: colorStatusView
                                                                ? Vnr_Function.convertTextToColor(colorStatusView)
                                                                : Colors.gray_10
                                                        }
                                                    ]}
                                                    numberOfLines={1}
                                                >
                                                    {item.StatusOvertimeView}
                                                </Text>
                                            </View>
                                        </View>
                                    );
                                })}
                        </View>
                    </View>
                );
            });
        } else {
            return _listOvertime.map((item, index) => {
                let textTypeBusiness = '',
                    colorStatusView = null,
                    borderStatusView = null,
                    bgStatusView = null;

                if (item.itemStatus) {
                    const { colorStatus, borderStatus, bgStatus } = item.itemStatus;
                    colorStatusView = colorStatus ? colorStatus : null;
                    borderStatusView = borderStatus ? borderStatus : null;
                    bgStatusView = bgStatus ? bgStatus : null;
                }

                if (item.OvertimeTypeName) textTypeBusiness = `${item.OvertimeTypeName}`.toLowerCase();

                return (
                    <View key={index} style={styles.viewStatus}>
                        <View style={styles.dotSttOvertime} />

                        <View style={styles.styViewTextType}>
                            <Text style={[styleSheets.textItalic, styles.txtRegister]}>
                                {`${translate('HRM_Att_Overtime')} ${textTypeBusiness} ${Vnr_Function.mathRoundNumber(
                                    item.OvertimeHours
                                )} ${translate('E_IMPORT_FILE_HOUR')}`}
                            </Text>
                        </View>

                        <View
                            style={[
                                styles.styViewStatus,
                                {
                                    borderColor: borderStatusView
                                        ? Vnr_Function.convertTextToColor(borderStatusView)
                                        : Colors.gray_10,
                                    backgroundColor: bgStatusView
                                        ? Vnr_Function.convertTextToColor(bgStatusView)
                                        : Colors.white
                                }
                            ]}
                        >
                            <Text
                                style={[
                                    styleSheets.text,
                                    styles.txtStatus,
                                    {
                                        color: colorStatusView
                                            ? Vnr_Function.convertTextToColor(colorStatusView)
                                            : Colors.gray_10
                                    }
                                ]}
                                numberOfLines={1}
                            >
                                {item.StatusOvertimeView}
                            </Text>
                        </View>
                    </View>
                );
            });
        }
    };

    renderListBusinessTravel = (_listBusinessTravel) => {
        return _listBusinessTravel.map((item, index) => {
            let textTimeDayHours = '',
                textTypeBusiness = '',
                textShowDetail = '',
                colorStatusView = null,
                borderStatusView = null,
                bgStatusView = null;

            if (item.itemStatus) {
                const { colorStatus, borderStatus, bgStatus } = item.itemStatus;
                colorStatusView = colorStatus ? colorStatus : null;
                borderStatusView = borderStatus ? borderStatus : null;
                bgStatusView = bgStatus ? bgStatus : null;
            }
            if (item.LeaveDays !== null) {
                textTimeDayHours = `${Vnr_Function.mathRoundNumber(item.LeaveDays)} ${translate('E_DAY_LOWERCASE')}`;
            }

            if (item.BusinessTravelName) textTypeBusiness = `${item.BusinessTravelName}`;

            textShowDetail = `${translate('HRM_PortalApp_Workday_TravelType')} ${textTypeBusiness} ${textTimeDayHours}`;
            return (
                <View key={index} style={styles.viewStatus}>
                    <View style={styles.dotSttTravel} />

                    <View style={[styles.styViewTextType]}>
                        <Text style={[styleSheets.textItalic, styles.txtRegister]}>
                            {`${translate('Att_BusinessTrip')}`}
                        </Text>

                        <TouchableOpacity onPress={() => this.showTypeName(textShowDetail)}>
                            <Text style={[styleSheets.textItalic, styles.txtCodeType]}>
                                {`${Vnr_Function.mathRoundNumber(item.LeaveDays)} ${item.BusinessTravelCode}`}
                            </Text>
                        </TouchableOpacity>
                        <View />
                    </View>

                    <View
                        style={[
                            styles.styViewStatus,
                            {
                                borderColor: borderStatusView
                                    ? Vnr_Function.convertTextToColor(borderStatusView)
                                    : Colors.gray_10,
                                backgroundColor: bgStatusView
                                    ? Vnr_Function.convertTextToColor(bgStatusView)
                                    : Colors.white
                            }
                        ]}
                    >
                        <Text
                            style={[
                                styleSheets.text,
                                styles.txtStatus,
                                {
                                    color: colorStatusView
                                        ? Vnr_Function.convertTextToColor(colorStatusView)
                                        : Colors.gray_10
                                }
                            ]}
                            numberOfLines={1}
                        >
                            {item.StatusLeaveView}
                        </Text>
                    </View>
                </View>
            );
        });
    };

    renderListForgeLeaveday = (_listForgeLeaveday) => {
        return _listForgeLeaveday.map((item, index) => {
            let textTimeDayHours = '',
                textTypeBusiness = '',
                textShowDetail = '',
                colorStatusView = null,
                borderStatusView = null,
                bgStatusView = null;

            if (item.itemStatus) {
                const { colorStatus, borderStatus, bgStatus } = item.itemStatus;
                colorStatusView = colorStatus ? colorStatus : null;
                borderStatusView = borderStatus ? borderStatus : null;
                bgStatusView = bgStatus ? bgStatus : null;
            }

            if (item.LeaveDays !== null) {
                textTimeDayHours = `${Vnr_Function.mathRoundNumber(item.LeaveDays)} ${translate('E_DAY_LOWERCASE')}`;
            }

            if (item.LeavedayTypeName) textTypeBusiness = `${item.LeavedayTypeName}`;

            textShowDetail = `${translate(
                'HRM_PortalApp_Workday_ForgeLeaveday_Type'
            )} ${textTypeBusiness} ${textTimeDayHours}`;

            return (
                <View key={index} style={styles.viewStatus}>
                    <View style={styles.dotSttForgeLeaveday} />

                    <View style={[styles.styViewTextType]}>
                        <Text style={[styleSheets.textItalic, styles.txtRegister]}>
                            {`${translate('HRM_PortalApp_Workday_ForgeLeaveday')}`}
                        </Text>

                        <TouchableOpacity onPress={() => this.showTypeName(textShowDetail)}>
                            <Text style={[styleSheets.textItalic, styles.txtCodeType]}>
                                {item.LeavedayTypeCodeStatistic
                                    ? `${Vnr_Function.mathRoundNumber(item.LeaveDays)} ${
                                        item.LeavedayTypeCodeStatistic
                                    }`
                                    : `${Vnr_Function.mathRoundNumber(item.LeaveDays)} ${item.LeavedayTypeCode}`}
                            </Text>
                        </TouchableOpacity>
                        <View />
                    </View>

                    <View
                        style={[
                            styles.styViewStatus,
                            {
                                borderColor: borderStatusView
                                    ? Vnr_Function.convertTextToColor(borderStatusView)
                                    : Colors.gray_10,
                                backgroundColor: bgStatusView
                                    ? Vnr_Function.convertTextToColor(bgStatusView)
                                    : Colors.white
                            }
                        ]}
                    >
                        <Text
                            style={[
                                styleSheets.text,
                                styles.txtStatus,
                                {
                                    color: colorStatusView
                                        ? Vnr_Function.convertTextToColor(colorStatusView)
                                        : Colors.gray_10
                                }
                            ]}
                            numberOfLines={1}
                        >
                            {item.StatusLeaveView}
                        </Text>
                    </View>
                </View>
            );
        });
    };

    renderTamscanlogRegister = (_listTamscanlogRegister) => {
        return _listTamscanlogRegister.map((item, index) => {
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
                <View key={index} style={styles.viewStatus}>
                    <View style={styles.dotSttTamscanlogRegister} />

                    <View style={[styles.styViewTextType]}>
                        <Text style={[styleSheets.textItalic, styles.txtRegister]}>
                            {item.TypeTamscanlogRegisterView}
                        </Text>

                        <View>
                            <Text style={[styleSheets.textItalic]}>
                                {item.TimeLog ? moment(item.TimeLog).format('HH:mm') : ''}
                            </Text>
                        </View>
                        <View />
                    </View>

                    <View
                        style={[
                            styles.styViewStatus,
                            {
                                borderColor: borderStatusView
                                    ? Vnr_Function.convertTextToColor(borderStatusView)
                                    : Colors.gray_10,
                                backgroundColor: bgStatusView
                                    ? Vnr_Function.convertTextToColor(bgStatusView)
                                    : Colors.white
                            }
                        ]}
                    >
                        <Text
                            style={[
                                styleSheets.text,
                                styles.txtStatus,
                                {
                                    color: colorStatusView
                                        ? Vnr_Function.convertTextToColor(colorStatusView)
                                        : Colors.gray_10
                                }
                            ]}
                            numberOfLines={1}
                        >
                            {item.StatusView}
                        </Text>
                    </View>
                </View>
            );
        });
    };

    showTypeName = (text) => {
        AlertSevice.alert({
            title: translate('HRM_Common_ViewMore'),
            iconType: EnumIcon.E_INFO,
            message: text,
            showConfirm: false,
            showCancel: false
        });
    };

    renderItemOneInOut = () => {
        const { dataItem, rowActions } = this.props,
            actionAddInOut = rowActions ? rowActions.find((item) => item['type'] === 'E_INOUT') : undefined;

        let colorStatusView = null,
            borderStatusView = null,
            bgStatusView = null;

        if (dataItem.StatusView) {
            const { colorStatus, borderStatus, bgStatus } = dataItem.StatusView;
            colorStatusView = colorStatus ? colorStatus : null;
            borderStatusView = borderStatus ? borderStatus : null;
            bgStatusView = bgStatus ? bgStatus : null;
        }

        let txtTimeWork = '',
            txtLateAndEarly = '',
            timeInView = (
                <View style={styles.timeIn}>
                    <IconInOut size={Size.iconSize} color={Colors.danger} />
                </View>
            ),
            timeOutView = (
                <View style={styles.timeIn}>
                    <IconInOut size={Size.iconSize} color={Colors.danger} />
                </View>
            );

        //check nhỏ hơn ngày hiện tại thì hiển thị
        if (moment(dataItem.WorkDate) <= moment()) {
            if (txtTimeWork.length > 0) {
                txtTimeWork = `${txtTimeWork}, ${translate('HRM_Common_WorkHours')} ${Vnr_Function.mathRoundNumber(
                    dataItem.WorkHours
                )} ${translate('E_IMPORT_FILE_HOUR')}`;
            } else {
                txtTimeWork = `${translate('HRM_Common_WorkHours')} ${Vnr_Function.mathRoundNumber(
                    dataItem.WorkHours
                )} ${translate('E_IMPORT_FILE_HOUR')}`;
            }

            if (dataItem.LateDuration1) {
                if (txtLateAndEarly.length > 0) {
                    txtLateAndEarly = `${txtLateAndEarly}, ${dataItem.LateDuration1Label} : ${
                        dataItem.LateDuration1
                    } ${translate('E_IMPORT_FILE_MINUTE')}`;
                } else {
                    txtLateAndEarly = `${dataItem.LateDuration1Label} : ${dataItem.LateDuration1} ${translate(
                        'E_IMPORT_FILE_MINUTE'
                    )}`;
                }
            }

            if (dataItem.EarlyDuration1) {
                if (txtLateAndEarly.length > 0) {
                    txtLateAndEarly = `${txtLateAndEarly}, ${dataItem.EarlyDuration1Label} : ${
                        dataItem.EarlyDuration1
                    } ${translate('E_IMPORT_FILE_MINUTE')}`;
                } else {
                    txtLateAndEarly = `${dataItem.EarlyDuration1Label} : ${dataItem.EarlyDuration1} ${translate(
                        'E_IMPORT_FILE_MINUTE'
                    )}`;
                }
            }

            if (dataItem.LateDuration3) {
                if (txtLateAndEarly.length > 0) {
                    txtLateAndEarly = `${txtLateAndEarly}, ${dataItem.LateDuration3Label} : ${
                        dataItem.LateDuration3
                    } ${translate('E_IMPORT_FILE_MINUTE')}`;
                } else {
                    txtLateAndEarly = `${dataItem.LateDuration3Label} : ${dataItem.LateDuration3} ${translate(
                        'E_IMPORT_FILE_MINUTE'
                    )}`;
                }
            }

            if (dataItem.LateDuration3) {
                if (txtLateAndEarly.length > 0) {
                    txtLateAndEarly = `${txtLateAndEarly}, ${dataItem.EarlyDuration3Label} : ${
                        dataItem.EarlyDuration3
                    } ${translate('E_IMPORT_FILE_MINUTE')}`;
                } else {
                    txtLateAndEarly = `${dataItem.EarlyDuration3Label} : ${dataItem.EarlyDuration3} ${translate(
                        'E_IMPORT_FILE_MINUTE'
                    )}`;
                }
            }
        }

        //set lại InTime nếu có dữ liệu
        if (dataItem.InTime1 != null) {
            timeInView = (
                <View style={styles.timeIn}>
                    <View style={styles.viewRowTime}>
                        <Text style={[styleSheets.text, styles.timeLarge]}>
                            {moment(dataItem.InTime1).format('HH:mm')}
                        </Text>
                    </View>
                    <View style={styles.viewRowTime}>
                        <Text style={[styleSheets.text, styles.textLeftItem]}>{dataItem.InTimeLabel}</Text>
                    </View>
                </View>
            );
        } else if (moment(dataItem.WorkDate) > moment() || actionAddInOut === undefined) {
            //k có dữ liệu
            //check lớn hơn ngày hiện tại thì k hiển thị button In
            timeInView = (
                <View style={styles.timeIn}>
                    <IconMinus size={Size.iconSize + 10} color={Colors.primary} />
                </View>
            );
        } else {
            //hiển thị button thêm In
            let toDataItem = null;

            if (actionAddInOut) {
                toDataItem = {
                    ...dataItem,
                    Type: 'E_IN'
                };
            }

            timeInView = (
                <TouchableOpacity
                    style={styles.viewComplementory}
                    onPress={actionAddInOut && (() => actionAddInOut.onPress(toDataItem))}
                >
                    <IconLogin size={Size.iconSize} color={Colors.accent} />
                </TouchableOpacity>
            );
        }

        //set lại OutTime nếu có dữ liệu
        if (dataItem.OutTime1 != null) {
            timeOutView = (
                <View style={styles.timeOut}>
                    <View style={styles.viewRowTime}>
                        <Text style={[styleSheets.text, styles.timeLarge]}>
                            {moment(dataItem.OutTime1).format('HH:mm')}
                        </Text>
                    </View>
                    <View style={styles.viewRowTime}>
                        <Text style={[styleSheets.text, styles.textLeftItem]}>{dataItem.OutTimeLabel}</Text>
                    </View>
                </View>
            );
        } else if (moment(dataItem.WorkDate) > moment() || actionAddInOut === undefined) {
            //k có dữ liệu
            //check lớn hơn ngày hiện tại thì k hiển thị button Out
            timeOutView = (
                <View style={styles.timeOut}>
                    <IconMinus size={Size.iconSize + 10} color={Colors.primary} />
                </View>
            );
        } else {
            //hiển thị button thêm Out
            let toDataItem = null;

            if (actionAddInOut) {
                toDataItem = {
                    ...dataItem,
                    Type: 'E_OUT'
                };
            }

            timeOutView = (
                <TouchableOpacity
                    style={styles.viewComplementory}
                    onPress={actionAddInOut && (() => actionAddInOut.onPress(toDataItem))}
                >
                    <IconLogout size={Size.iconSize} color={Colors.accent} />
                </TouchableOpacity>
            );
        }

        return (
            <View style={styles.rightItem}>
                <View style={styles.styViewShiftName}>
                    <Text style={[styleSheets.text, styles.titleTime]} numberOfLines={1}>
                        {dataItem.Type === 'E_HOLIDAY' ? `${dataItem.CodeStatisticHLD}` : `${dataItem.ShiftName}`}
                        {/* {dataItem.ShiftName} */}
                    </Text>
                </View>
                <View style={styles.datailTime}>
                    {timeInView}
                    <View style={styles.titleView}>
                        <View style={styles.boxTitle}>
                            <Text style={[styleSheets.text, styles.textStyleInfo]} numberOfLines={2}>
                                {txtTimeWork}
                            </Text>
                            <Text style={[styleSheets.text, styles.textStyleInfo]} numberOfLines={2}>
                                {txtLateAndEarly ? txtLateAndEarly : '--'}
                            </Text>
                        </View>
                    </View>
                    {timeOutView}
                </View>

                {dataItem.Status && (
                    <View style={styles.viewStatusBottom}>
                        <View
                            style={[
                                styles.lineSatus,
                                {
                                    borderColor: borderStatusView
                                        ? Vnr_Function.convertTextToColor(borderStatusView)
                                        : Colors.gray_10,
                                    backgroundColor: bgStatusView
                                        ? Vnr_Function.convertTextToColor(bgStatusView)
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
                                            ? Vnr_Function.convertTextToColor(colorStatusView)
                                            : Colors.gray_10
                                    }
                                ]}
                            >
                                {dataItem.Status != null ? translate(dataItem.Status) : ''}
                            </Text>
                        </View>
                    </View>
                )}

                {dataItem.ListLeaveday &&
                    dataItem.ListLeaveday.length > 0 &&
                    this.renderListLeaveDay(dataItem.ListLeaveday)}

                {dataItem.ListForgeLeaveday &&
                    dataItem.ListForgeLeaveday.length > 0 &&
                    this.renderListForgeLeaveday(dataItem.ListForgeLeaveday)}

                {dataItem.ListOvertime &&
                    dataItem.ListOvertime.length > 0 &&
                    this.renderListOvertime(dataItem.ListOvertime)}

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
    };

    renderItemTwoInOut = () => {
        const { dataItem, rowActions } = this.props,
            actionAddInOut = rowActions ? rowActions.find((item) => item['type'] === 'E_INOUT') : null;

        let txtTimeWork = '',
            txtLateAndEarly = '',
            timeInView = (
                <View style={styles.timeIn}>
                    <IconInOut size={Size.iconSize} color={Colors.danger} />
                </View>
            ),
            timeOutView = (
                <View style={styles.timeIn}>
                    <IconInOut size={Size.iconSize} color={Colors.danger} />
                </View>
            ),
            txtTimeWork2 = '',
            txtLateAndEarly2 = '',
            timeInView2 = (
                <View style={styles.timeIn}>
                    <IconInOut size={Size.iconSize} color={Colors.danger} />
                </View>
            ),
            timeOutView2 = (
                <View style={styles.timeIn}>
                    <IconInOut size={Size.iconSize} color={Colors.danger} />
                </View>
            );

        //#region [handel InOut 1]
        //check nhỏ hơn ngày hiện tại thì hiển thị
        //
        if (moment(dataItem.WorkDate) <= moment()) {
            txtTimeWork = `${translate('HRM_Common_WorkHours')} ${Vnr_Function.mathRoundNumber(
                dataItem.WorkHours
            )} ${translate('E_IMPORT_FILE_HOUR')}`;

            if (dataItem.LateDuration1) {
                if (txtLateAndEarly.length > 0) {
                    txtLateAndEarly = `${txtLateAndEarly}, ${dataItem.LateDuration1Label} : ${
                        dataItem.LateDuration1
                    } ${translate('E_IMPORT_FILE_MINUTE')}`;
                } else {
                    txtLateAndEarly = `${dataItem.LateDuration1Label} : ${dataItem.LateDuration1} ${translate(
                        'E_IMPORT_FILE_MINUTE'
                    )}`;
                }
            }

            if (dataItem.EarlyDuration1) {
                if (txtLateAndEarly.length > 0) {
                    txtLateAndEarly = `${txtLateAndEarly}, ${dataItem.EarlyDuration1Label} : ${
                        dataItem.EarlyDuration1
                    } ${translate('z')}`;
                } else {
                    txtLateAndEarly = `${dataItem.EarlyDuration1Label} : ${dataItem.EarlyDuration1} ${translate(
                        'E_IMPORT_FILE_MINUTE'
                    )}`;
                }
            }
        }

        //set lại InTime nếu có dữ liệu
        if (dataItem.InTime1 != null) {
            timeInView = (
                <View style={styles.timeInType_2}>
                    <View style={styles.viewRowTime}>
                        <Text style={[styleSheets.text, styles.timeLarge]}>
                            {moment(dataItem.InTime1).format('HH:mm')}
                        </Text>
                    </View>
                    <View style={styles.viewRowTime}>
                        <Text style={[styleSheets.text, styles.textLeftItem]}>{dataItem.InTimeLabel}</Text>
                    </View>
                </View>
            );
        } else if (moment(dataItem.WorkDate) > moment() || actionAddInOut === undefined) {
            //k có dữ liệu
            //check lớn hơn ngày hiện tại thì k hiển thị button In
            timeInView = (
                <View style={styles.timeInType_2}>
                    <IconMinus size={Size.iconSize + 10} color={Colors.primary} />
                </View>
            );
        } else {
            //hiển thị button thêm In
            let toDataItem = null;

            if (actionAddInOut) {
                toDataItem = {
                    ...dataItem,
                    Type: 'E_IN'
                };
            }

            timeInView = (
                <TouchableOpacity
                    style={styles.viewComplementory}
                    onPress={actionAddInOut && (() => actionAddInOut.onPress(toDataItem))}
                >
                    <IconLogin size={Size.iconSize} color={Colors.accent} />
                </TouchableOpacity>
            );
        }

        //set lại OutTime nếu có dữ liệu
        if (dataItem.OutTime1 != null) {
            timeOutView = (
                <View style={styles.timeOutType_2}>
                    <View style={styles.viewRowTime}>
                        <Text style={[styleSheets.text, styles.timeLarge]}>
                            {moment(dataItem.OutTime1).format('HH:mm')}
                        </Text>
                    </View>
                    <View style={styles.viewRowTime}>
                        <Text style={[styleSheets.text, styles.textLeftItem]}>{dataItem.OutTimeLabel}</Text>
                    </View>
                </View>
            );
        } else if (moment(dataItem.WorkDate) > moment() || actionAddInOut === undefined) {
            //check lớn hơn ngày hiện tại thì k hiển thị button Out
            timeOutView = (
                <View style={styles.timeOutType_2}>
                    <IconMinus size={Size.iconSize + 10} color={Colors.primary} />
                </View>
            );
        } else {
            //hiển thị button thêm Out
            let toDataItem = null;

            if (actionAddInOut) {
                toDataItem = {
                    ...dataItem,
                    Type: 'E_OUT'
                };
            }

            timeOutView = (
                <TouchableOpacity
                    style={styles.viewComplementory}
                    onPress={actionAddInOut && (() => actionAddInOut.onPress(toDataItem))}
                >
                    <IconLogout size={Size.iconSize} color={Colors.accent} />
                </TouchableOpacity>
            );
        }

        //#endregion

        //#region [handel InOut 2]
        //check nhỏ hơn ngày hiện tại thì hiển thị
        if (moment(dataItem.WorkDate) <= moment()) {
            txtTimeWork2 = `${translate('HRM_Common_WorkHours')} ${Vnr_Function.mathRoundNumber(
                dataItem.WorkHours2
            )} ${translate('E_IMPORT_FILE_HOUR')}`;

            if (dataItem.LateDuration2) {
                if (txtLateAndEarly2.length > 0) {
                    txtLateAndEarly2 = `${txtLateAndEarly2}, ${dataItem.LateDuration2Label} : ${
                        dataItem.LateDuration2
                    } ${translate('E_IMPORT_FILE_MINUTE')}`;
                } else {
                    txtLateAndEarly2 = `${dataItem.LateDuration2Label} : ${dataItem.LateDuration2} ${translate(
                        'E_IMPORT_FILE_MINUTE'
                    )}`;
                }
            }

            if (dataItem.EarlyDuration2) {
                if (txtLateAndEarly2.length > 0) {
                    txtLateAndEarly2 = `${txtLateAndEarly2}, ${dataItem.EarlyDuration2Label} : ${
                        dataItem.EarlyDuration2
                    } ${translate('E_IMPORT_FILE_MINUTE')}`;
                } else {
                    txtLateAndEarly2 = `${dataItem.EarlyDuration2Label} : ${dataItem.EarlyDuration2} ${translate(
                        'E_IMPORT_FILE_MINUTE'
                    )}`;
                }
            }
        }

        //set lại InTime nếu có dữ liệu
        if (dataItem.InTime2 != null) {
            timeInView2 = (
                <View style={styles.timeInType_2}>
                    <View style={styles.viewRowTime}>
                        <Text style={[styleSheets.text, styles.timeLarge]}>
                            {moment(dataItem.InTime2).format('HH:mm')}
                        </Text>
                    </View>
                    <View style={styles.viewRowTime}>
                        <Text style={[styleSheets.text, styles.textLeftItem]}>{dataItem.InTimeLabel}</Text>
                    </View>
                </View>
            );
        } else if (moment(dataItem.WorkDate) > moment() || actionAddInOut === undefined) {
            //k có dữ liệu
            //check lớn hơn ngày hiện tại thì k hiển thị button In
            timeInView2 = (
                <View style={styles.timeInType_2}>
                    <IconMinus size={Size.iconSize + 10} color={Colors.primary} />
                </View>
            );
        } else {
            //hiển thị button thêm In
            let toDataItem = null;

            if (actionAddInOut) {
                toDataItem = {
                    ...dataItem,
                    Type: 'E_IN'
                };
            }

            timeInView2 = (
                <TouchableOpacity
                    style={styles.viewComplementory}
                    onPress={actionAddInOut && (() => actionAddInOut.onPress(toDataItem))}
                >
                    <IconLogin size={Size.iconSize} color={Colors.accent} />
                </TouchableOpacity>
            );
        }

        //set lại OutTime nếu có dữ liệu
        if (dataItem.OutTime2 != null) {
            timeOutView2 = (
                <View style={styles.timeOutType_2}>
                    <View style={styles.viewRowTime}>
                        <Text style={[styleSheets.text, styles.timeLarge]}>
                            {moment(dataItem.OutTime2).format('HH:mm')}
                        </Text>
                    </View>
                    <View style={styles.viewRowTime}>
                        <Text style={[styleSheets.text, styles.textLeftItem]}>{dataItem.OutTimeLabel}</Text>
                    </View>
                </View>
            );
        } else if (moment(dataItem.WorkDate) > moment() || actionAddInOut === undefined) {
            //k có dữ liệu
            //check lớn hơn ngày hiện tại thì k hiển thị button Out
            timeOutView2 = (
                <View style={styles.timeOutType_2}>
                    <IconMinus size={Size.iconSize + 10} color={Colors.primary} />
                </View>
            );
        } else {
            //hiển thị button thêm Out
            let toDataItem = null;

            if (actionAddInOut) {
                toDataItem = {
                    ...dataItem,
                    Type: 'E_OUT'
                };
            }

            timeOutView2 = (
                <TouchableOpacity
                    style={styles.viewComplementory}
                    onPress={actionAddInOut && (() => actionAddInOut.onPress(toDataItem))}
                >
                    <IconLogout size={Size.iconSize} color={Colors.accent} />
                </TouchableOpacity>
            );
        }

        //#endregion

        return (
            <View style={styles.rightItem}>
                <View style={styles.styViewShiftName}>
                    <Text style={[styleSheets.text, styles.styViewShiftName_text]} numberOfLines={1}>
                        {dataItem.Type === 'E_HOLIDAY' ? `${dataItem.CodeStatisticHLD}` : `${dataItem.ShiftName}`}
                        {/* {dataItem.ShiftName} */}
                    </Text>
                </View>
                <View style={styles.datailTimeType_2}>
                    {timeInView}
                    <View style={styles.titleView}>
                        <View style={styles.boxTitle}>
                            <Text style={[styleSheets.text, styles.textStyleInfo]} numberOfLines={2}>
                                {txtTimeWork}
                            </Text>
                            <Text style={[styleSheets.text, styles.textStyleInfo]} numberOfLines={2}>
                                {txtLateAndEarly != '' ? txtLateAndEarly : '--'}
                            </Text>
                        </View>
                    </View>
                    {timeOutView}
                </View>

                <View style={styles.datailTimeType_2}>
                    {timeInView2}
                    <View style={styles.titleView}>
                        <View style={styles.boxTitle}>
                            <Text style={[styleSheets.text, styles.textStyleInfo]} numberOfLines={2}>
                                {txtTimeWork2}
                            </Text>
                            <Text style={[styleSheets.text, styles.textStyleInfo]} numberOfLines={2}>
                                {txtLateAndEarly2 != '' ? txtLateAndEarly2 : '--'}
                            </Text>
                        </View>
                    </View>
                    {timeOutView2}
                </View>
                <View style={styles.styTotalWorkDay}>
                    <VnrText
                        style={[styleSheets.text, styles.textStyleInfo]}
                        numberOfLines={1}
                        i18nKey={'SumWorkhours'}
                    />

                    <Text style={[styleSheets.text, styles.textStyleInfo]} numberOfLines={1}>
                        {dataItem.TotalWorkHours
                            ? `${Vnr_Function.mathRoundNumber(dataItem.TotalWorkHours)} ${translate(
                                'E_IMPORT_FILE_HOUR'
                            )}`
                            : `0 ${translate('E_IMPORT_FILE_HOUR')}`}
                    </Text>
                </View>
                {dataItem.ListLeaveday &&
                    dataItem.ListLeaveday.length > 0 &&
                    this.renderListLeaveDay(dataItem.ListLeaveday)}

                {dataItem.ListForgeLeaveday &&
                    dataItem.ListForgeLeaveday.length > 0 &&
                    this.renderListForgeLeaveday(dataItem.ListForgeLeaveday)}

                {dataItem.ListOvertime &&
                    dataItem.ListOvertime.length > 0 &&
                    this.renderListOvertime(dataItem.ListOvertime)}

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
    };

    render() {
        const { dataItem, index, listItemOpenSwipeOut, isOpenAction, rowActions, isToday } = this.props;
        const { leftItem } = styles;

        let colorStatusView = null;
        if (dataItem.StatusView) {
            const { colorStatus } = dataItem.StatusView;
            colorStatusView = colorStatus ? colorStatus : null;
        }
        return (
            <Swipeable
                ref={(ref) => {
                    this.Swipe = ref;
                    if (!listItemOpenSwipeOut[index]) {
                        listItemOpenSwipeOut[index] = { ID: index, value: ref };
                    } else {
                        listItemOpenSwipeOut[index].value = ref;
                    }
                }}
                overshootRight={false}
                renderRightActions={rowActions != null && !isOpenAction ? this.rightActions : this.rightActionsEmpty}
                friction={0.6}
                containerStyle={styles.swipeable}
            >
                <View style={[styles.itemContent, dataItem.InvalidNoteView != null && { borderColor: Colors.red }]}>
                    <View style={[leftItem, isToday && styles.styleViewToday]}>
                        {colorStatusView && <View style={styles.styViewStatusColor(colorStatusView)} />}
                        <View style={styles.leftViewItem}>
                            <Text // hiển thị ngày
                                style={[styleSheets.text, styles.textLeftItemDay, isToday && styles.textToday]}
                            >
                                {dataItem.Workday}
                            </Text>
                            <Text // hiển thị thứ
                                style={[styleSheets.text, styles.textLeftItemWeek, isToday && styles.textToday]}
                            >
                                {dataItem.DayOffWeek}
                            </Text>
                        </View>
                    </View>
                    {Object.prototype.hasOwnProperty.call(dataItem, 'IsHaveTwoInOut') && dataItem.IsHaveTwoInOut == true
                        ? this.renderItemTwoInOut()
                        : this.renderItemOneInOut()}
                </View>

                {Array.isArray(this.rightListActions) && this.rightListActions.length > 0 && (
                    <View style={styles.actionRight}>
                        <IconBack color={Colors.gray_7} size={Size.defineSpace} />
                    </View>
                )}

                {dataItem.InvalidNoteView != null && (
                    <View style={styles.viewLimitTitle}>
                        <IconInfo color={Colors.red} size={Size.text} />
                        <Text
                            // numberOfLines={2}
                            style={[styleSheets.lable, styles.viewReasoLimitTitle_text]}
                        >
                            {dataItem.InvalidNoteView}
                        </Text>
                    </View>
                )}
            </Swipeable>
        );
    }
}

const styles = StyleSheet.create({
    swipeable: {
        marginBottom: Size.defineSpace,
        flex: 1
    },
    actionRight: {
        position: 'absolute',
        top: 0,
        right: 0,
        height: '100%',
        justifyContent: 'center'
    },
    viewStatusBottom: {
        paddingVertical: Size.defineSpace / 2,
        paddingHorizontal: Size.defineSpace,
        borderTopColor: Colors.gray_5,
        borderTopWidth: 0.5,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    lineSatus: {
        borderRadius: styleSheets.radius_5,
        alignItems: 'center',
        borderWidth: 0.5,
        paddingVertical: 2,
        paddingHorizontal: Size.defineSpace
    },
    lineSatus_text: {
        fontSize: Size.text - 3,
        fontWeight: '500'
    },
    itemContent: {
        flex: 1,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        minHeight: 87,
        alignItems: 'center',
        marginHorizontal: Size.defineSpace,
        marginLeft: Size.defineHalfSpace,
        borderRadius: 8,
        borderWidth: 0.5,
        borderColor: Colors.gray_5
    },
    viewLimitTitle: {
        width: Size.deviceWidth - Size.defineSpace * 2,
        paddingVertical: Size.defineHalfSpace,
        paddingHorizontal: Size.defineSpace,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        backgroundColor: Colors.gray_3,
        marginHorizontal: Size.defineSpace
    },
    viewReasoLimitTitle_text: {
        fontSize: Size.text - 1,
        color: Colors.red,
        marginLeft: 5,
        textAlign: 'center'
    },
    // eslint-disable-next-line react-native/no-unused-styles
    leftItem: {
        flexDirection: 'row',
        borderRightWidth: 0.5,
        borderRightColor: Colors.gray_5,
        width: 45,
        justifyContent: 'space-between',
        alignItems: 'center',
        height: '90%'
    },
    leftViewItem: {
        alignItems: 'center',
        flex: 1
    },
    styleViewToday: {},
    rightItem: {
        flex: 1,
        flexDirection: 'column'
    },
    timeIn: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styViewShiftName: {
        marginHorizontal: 10,
        alignItems: 'center',
        paddingTop: 5
    },
    styViewShiftName_text: {
        color: Colors.primary,
        fontSize: Size.text + 1,
        fontWeight: '500'
    },
    timeOut: {
        paddingHorizontal: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    timeInType_2: {
        paddingRight: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    timeOutType_2: {
        paddingLeft: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleView: {
        flex: 1
    },
    textLeftItemDay: {
        color: Colors.gray_8,
        paddingVertical: 1.5,
        fontSize: Size.text + 4,
        fontWeight: '600'
    },
    textLeftItemWeek: {
        color: Colors.gray_8,
        paddingVertical: 1.5,
        fontSize: Size.text + 1
    },
    textStyleInfo: {
        paddingVertical: 1.5,
        color: Colors.gray_8,
        textAlign: 'center',
        fontSize: Size.text - 1
    },
    timeLarge: {
        fontWeight: '600'
    },
    viewRowTime: {
        alignItems: 'flex-end',
        justifyContent: 'center'
    },
    titleTime: {
        color: Colors.primary,
        paddingVertical: 3,
        fontWeight: '400'
    },
    boxTitle: {
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    datailTime: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 7
    },
    datailTimeType_2: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.gray_5,
        paddingVertical: 7,
        marginHorizontal: 10
    },
    viewStatusGroup: {
        flex: 1,
        marginHorizontal: 5,
        paddingHorizontal: 10,
        paddingVertical: Size.defineHalfSpace,
        // marginBottom: 0,
        borderRadius: 30,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    },
    viewStatus: {
        flex: 1,
        marginHorizontal: 5,
        paddingHorizontal: 10,
        paddingVertical: Size.defineHalfSpace,
        marginBottom: Size.defineHalfSpace,
        borderRadius: 30,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'flex-start'
    },
    txtRegister: {
        fontWeight: '500'
    },
    txtCodeType: {
        fontWeight: '500',
        color: Colors.black,
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        textDecorationColor: Colors.black,
        paddingBottom: 2
    },
    dotSttLeaveDay: {
        backgroundColor: Colors.purple,
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 7,
        marginTop: Size.text - 7
    },
    dotSttOvertime: {
        backgroundColor: Colors.red,
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 7,
        marginTop: Size.text - 7
    },
    dotSttTravel: {
        backgroundColor: Colors.green,
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 7,
        marginTop: Size.text - 7
    },
    dotSttTamscanlogRegister: {
        backgroundColor: Colors.orange,
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 7,
        marginTop: Size.text - 7
    },
    dotSttForgeLeaveday: {
        backgroundColor: Colors.orange,
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 7,
        marginTop: Size.text - 7
    },
    dotSttAllowLateEarly: {
        backgroundColor: Colors.gray_7,
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 7,
        marginTop: Size.text - 7
    },
    styViewTextType: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    styViewStatus: {
        marginLeft: 5,
        borderRadius: styleSheets.radius_5,
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        paddingVertical: 2,
        paddingHorizontal: Size.defineHalfSpace,
        justifyContent: 'flex-start'
    },
    txtStatus: {
        fontWeight: '500',
        fontSize: Size.text - 3,
        color: Colors.orange
    },
    textToday: {
        color: Colors.primary
    },
    viewComplementory: {
        flexDirection: 'column',
        borderRadius: 16,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: styleSheets.m_5,
        paddingVertical: styleSheets.m_5,
        paddingHorizontal: styleSheets.m_5
    },
    styTotalWorkDay: {
        marginHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 5
    },
    bnt_iconTile: {
        fontSize: Size.text - 2
    },
    styViewStatusColor: (bgColor) => {
        return {
            width: 4,
            height: '100%',
            backgroundColor: bgColor,
            marginLeft: 5,
            borderRadius: 7
        };
    }
});
