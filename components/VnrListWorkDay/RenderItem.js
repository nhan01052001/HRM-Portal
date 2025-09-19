/* eslint-disable react-native/no-inline-styles */
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { Colors, Size, styleSheets, styleSwipeableAction } from '../../constants/styleConfig';
import moment from 'moment';
import format from 'number-format.js';
import ActionSheet from 'react-native-actionsheet';
import Vnr_Function from '../../utils/Vnr_Function';
import { translate } from '../../i18n/translate';
import {
    IconLeaveDay,
    IconInOut,
    IconTime,
    IconMoreHorizontal,
    IconMinus,
    IconLogin,
    IconLogout
} from '../../constants/Icons';
import VnrText from '../VnrText/VnrText';

export default class RenderItem extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.formatStringType = this.formatStringType.bind(this);
        this.sheetActions = [
            {
                title: translate('HRM_Common_Close'),
                onPress: null
            }
        ];

        if (!Vnr_Function.CheckIsNullOrEmpty(this.props.rowActions) && Array.isArray(this.props.rowActions)) {
            this.rightListActions = this.props.rowActions.slice(0, 2);
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

    actionSheetOnCLick = index => {
        const { dataItem } = this.props;
        !Vnr_Function.CheckIsNullOrEmpty(this.sheetActions[index].onPress) &&
            this.sheetActions[index].onPress(dataItem);
    };

    rightActionsEmpty = () => {
        return <View style={{ width: 0 }} />;
    };

    rightActions = () => {
        const options = this.sheetActions.map(item => {
            return item.title;
        });
        const { dataItem } = this.props;

        return (
            <View style={{ flexDirection: 'row' }}>
                {!Vnr_Function.CheckIsNullOrEmpty(this.sheetActions) && this.sheetActions.length > 1 && (
                    <View style={[styleSwipeableAction.viewIcon, { backgroundColor: Colors.info }]}>
                        <TouchableOpacity
                            onPress={() => this.openActionSheet()}
                            style={{
                                flex: 1,
                                justifyContent: 'center',
                                alignItems: 'center'
                            }}
                        >
                            <View style={styleSwipeableAction.icon}>
                                <IconMoreHorizontal size={Size.iconSize} color={Colors.white} />
                            </View>
                            <Text style={[styleSheets.text, { color: Colors.white }]}>{translate('MoreActions')}</Text>
                        </TouchableOpacity>
                        <ActionSheet
                            ref={o => (this.ActionSheet = o)}
                            //title={'Which one do you like ?'}
                            options={options}
                            cancelButtonIndex={this.sheetActions.length - 1}
                            destructiveButtonIndex={this.sheetActions.length - 1}
                            onPress={index => this.actionSheetOnCLick(index)}
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
                                        <Text style={[styleSheets.text]}>{item.title}</Text>
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
                                        <Text style={[styleSheets.text]}>{item.title}</Text>
                                    </TouchableOpacity>
                                </View>
                            );
                        }
                    })}
            </View>
        );
    };

    renderListLeaveDay = _listLeaveDay => {
        return _listLeaveDay.map((item, index) => {
            return (
                <View key={index} style={styles.viewStatus}>
                    <View>
                        <Text style={[styleSheets.textItalic, styles.txtRegister]} numberOfLines={1}>
                            {`${translate('HRM_Common_Vacation')} ${
                                item.LeavedayTypeName ? item.LeavedayTypeName : ''
                            } ${item.LeaveHours ? Vnr_Function.mathRoundNumber(item.LeaveHours) : ''} ${translate(
                                'E_IMPORT_FILE_HOUR'
                            )}`}
                        </Text>
                    </View>

                    <Text
                        style={[{ color: Colors.yellow }, styles.txtStatus, styleSheets.textItalic]}
                        numberOfLines={1}
                    >
                        {item.StatusLeaveView}
                    </Text>
                </View>
            );
        });
    };

    renderListOvertime = _listOvertime => {
        return _listOvertime.map((item, index) => {
            return (
                <View key={index} style={styles.viewStatusOvertime}>
                    <Text style={[styleSheets.textItalic, styles.txtRegister]}>
                        {`${translate('HRM_Att_Overtime')} ${
                            item.OvertimeTypeName ? Vnr_Function.mathRoundNumber(item.OvertimeTypeName) : ''
                        } ${item.OvertimeHours} ${translate('E_IMPORT_FILE_HOUR')}`}
                    </Text>
                    <Text style={[{ color: Colors.yellow }, styles.txtStatus, styleSheets.textItalic]}>
                        {item.StatusOvertimeView}
                    </Text>
                </View>
            );
        });
    };

    renderItemOneInOut = () => {
        const { dataItem, rowActions } = this.props,
            actionAddInOut = rowActions ? rowActions.find(item => item['type'] === 'E_INOUT') : undefined;

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
        }
        //k có dữ liệu
        else if (moment(dataItem.WorkDate) > moment() || actionAddInOut === undefined) {
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
        }
        //k có dữ liệu
        else if (moment(dataItem.WorkDate) > moment() || actionAddInOut === undefined) {
            timeOutView = (
                <View style={styles.timeOut}>
                    <IconMinus size={Size.iconSize + 10} color={Colors.primary} />
                </View>
            );
        }
        //hiển thị button thêm Out
        else {
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
                        {dataItem.ShiftName}
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

                {dataItem.ListLeaveday &&
                    dataItem.ListLeaveday.length > 0 &&
                    this.renderListLeaveDay(dataItem.ListLeaveday)}
                {dataItem.ListOvertime &&
                    dataItem.ListOvertime.length > 0 &&
                    this.renderListOvertime(dataItem.ListOvertime)}
            </View>
        );
    };

    renderItemTwoInOut = () => {
        const { dataItem, rowActions } = this.props,
            actionAddInOut = rowActions ? rowActions.find(item => item['type'] === 'E_INOUT') : null;

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
                    } ${translate('E_IMPORT_FILE_MINUTE')}`;
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
        }
        //k có dữ liệu
        else if (moment(dataItem.WorkDate) > moment() || actionAddInOut === undefined) {
            //check lớn hơn ngày hiện tại thì k hiển thị button In
            timeInView = (
                <View style={styles.timeInType_2}>
                    <IconMinus size={Size.iconSize + 10} color={Colors.primary} />
                </View>
            );
        }
        //hiển thị button thêm In
        else {
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
        }
        //k có dữ liệu
        else if (moment(dataItem.WorkDate) > moment() || actionAddInOut === undefined) {
            //check lớn hơn ngày hiện tại thì k hiển thị button Out
            timeOutView = (
                <View style={styles.timeOutType_2}>
                    <IconMinus size={Size.iconSize + 10} color={Colors.primary} />
                </View>
            );
        }
        //hiển thị button thêm Out
        else {
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
        }
        //k có dữ liệu
        else if (moment(dataItem.WorkDate) > moment() || actionAddInOut === undefined) {
            timeInView2 = (
                <View style={styles.timeInType_2}>
                    <IconMinus size={Size.iconSize + 10} color={Colors.primary} />
                </View>
            );
        }
        //hiển thị button thêm In
        else {
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
        }
        //k có dữ liệu
        else if (moment(dataItem.WorkDate) > moment() || actionAddInOut === undefined) {
            timeOutView2 = (
                <View style={styles.timeOutType_2}>
                    <IconMinus size={Size.iconSize + 10} color={Colors.primary} />
                </View>
            );
        }
        //hiển thị button thêm Out
        else {
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
                        {dataItem.ShiftName}
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
                {dataItem.ListOvertime &&
                    dataItem.ListOvertime.length > 0 &&
                    this.renderListOvertime(dataItem.ListOvertime)}
            </View>
        );
    };

    render() {
        const { dataItem, index, listItemOpenSwipeOut, isOpenAction, rowActions, isToday } = this.props;
        return (
            <Swipeable
                ref={ref => {
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
            >
                <View style={styles.itemContent}>
                    <View style={[styles.leftItem, isToday && styles.styleViewToday]}>
                        <Text style={[styleSheets.text, styles.textLeftItemDay, isToday && styles.textToday]}>
                            {dataItem.Workday}
                        </Text>
                        <Text style={[styleSheets.text, styles.textLeftItemWeek, isToday && styles.textToday]}>
                            {dataItem.DayOffWeek}
                        </Text>
                    </View>
                    {Object.prototype.hasOwnProperty.call(dataItem, 'IsHaveTwoInOut') && dataItem.IsHaveTwoInOut == true
                        ? this.renderItemTwoInOut()
                        : this.renderItemOneInOut()}
                </View>
            </Swipeable>
        );
    }
}

const styles = StyleSheet.create({
    itemContent: {
        backgroundColor: Colors.white,
        flexDirection: 'row',
        minHeight: 85,
        alignItems: 'center'
    },
    leftItem: {
        borderRightWidth: 0.5,
        borderRightColor: Colors.gray_5,
        width: 45,
        justifyContent: 'center',
        alignItems: 'center',
        height: '90%'
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
        // height: '100%'
    },
    timeOutType_2: {
        paddingLeft: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleView: {
        flex: 1
        // paddingBottom: styleSheets.p_10,
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
        // backgroundColor: 'blue'
    },
    titleTime: {
        color: Colors.primary,
        paddingVertical: 3,
        fontWeight: '400'
    },
    boxTitle: {
        justifyContent: 'flex-end',
        alignItems: 'center'
        // backgroundColor: 'red',
        // alignItems: 'flex-end',
        // flexDirection: 'row',
    },
    datailTime: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        paddingBottom: 7
        // borderWidth: 0.5
    },
    datailTimeType_2: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.gray_5,
        paddingVertical: 7,
        marginHorizontal: 10
        // backgroundColor: 'red'
    },
    viewStatusOvertime: {
        flex: 1,
        backgroundColor: Colors.success,
        marginHorizontal: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: styleSheets.m_10,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    viewStatus: {
        flex: 1,
        backgroundColor: Colors.info,
        marginHorizontal: 5,
        paddingHorizontal: 10,
        paddingVertical: 5,
        marginBottom: styleSheets.m_10,
        borderRadius: 30,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap'
    },
    txtRegister: {
        color: Colors.white,
        fontWeight: '500'
    },
    txtStatus: {
        fontWeight: '500'
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
    }
});
