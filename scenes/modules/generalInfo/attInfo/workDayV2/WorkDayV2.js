import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import moment from 'moment';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { Colors, Size, styleSheets, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { Image, StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { Agenda } from '../../../../../node_modules/react-native-calendars';
// import AttDataWorkdaysEmpsItem from './AttDataWorkdaysEmpsItem';
import DrawerServices from '../../../../../utils/DrawerServices';
import HttpService from '../../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import VnrText from '../../../../../components/VnrText/VnrText';
import { EnumName, EnumStatus } from '../../../../../assets/constant';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { getDataLocal } from '../../../../../factories/LocalData';
import { EnumTask } from '../../../../../assets/constant';
import VnrIndeterminate from '../../../../../components/VnrLoading/VnrIndeterminate';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import WorkDayV2ListItem from './WorkDayV2ListItem';
import { Text } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import {
    IconCancel,
    IconCheck,
    IconCheckCirlceo,
    IconColse,
    IconFilter,
    IconMinus,
    IconMoreHorizontal,
    IconPlus,
    IconSearch
} from '../../../../../constants/Icons';
import Modal from 'react-native-modal';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { stylesScreenDetailV2 } from '../../../../../constants/styleConfig';
import ModalAddInOut from './ModalAddInOut';

const testIDs = {
    menu: {
        CONTAINER: 'menu',
        CALENDARS: 'calendars_btn',
        CALENDAR_LIST: 'calendar_list_btn',
        HORIZONTAL_LIST: 'horizontal_list_btn',
        AGENDA: 'agenda_btn',
        EXPANDABLE_CALENDAR: 'expandable_calendar_btn',
        WEEK_CALENDAR: 'week_calendar_btn'
    },
    calendars: {
        CONTAINER: 'calendars',
        FIRST: 'first_calendar',
        LAST: 'last_calendar'
    },
    calendarList: { CONTAINER: 'calendarList' },
    horizontalList: { CONTAINER: 'horizontalList' },
    agenda: {
        CONTAINER: 'agenda',
        ITEM: 'item'
    },
    expandableCalendar: { CONTAINER: 'expandableCalendar' },
    weekCalendar: { CONTAINER: 'weekCalendar' }
};

class WorkDayV2 extends Component {
    constructor(porps) {
        super(porps);

        this.state = {
            dataCalendar: {},
            listMarked: {},
            listMarkedBackup: {},
            dataFilter: {
                listDataViolate: {},
                listDataMissInOut: {},
                listDataLateEarly: {},
                listDataInvalid: {},
                listDataLeaveDay: {},
                listDataOvertime: {},
                listDataTravel: {},
                listDataTamscanlog: {},
                listDataAllowLateEarly: {}
            },
            isVisibleModalFilter: false,
            isLoading: false,
            isGetOT: true,
            isGetLD: true,
            isGetRT: true,
            daySelected: moment().format('YYYY-MM-DD'),
            currentMonth: null,
            currentDate: {
                year: parseInt(moment().format('YYYY')),
                month: parseInt(moment().format('MM'))
            },
            calendarToggled: false,
            keyQuery: EnumName.E_PRIMARY_DATA,
            dataModalItem: null,
            // isCheckAll: true,
            // isCheckLeave: false,
            // ischeckRoster: false,
            // isCheckOvertime: false,
            refreshing: false,
            isLoadingHeader: true,
            minDate: moment(new Date())
                .startOf('month')
                .format('YYYY-MM-DD'),
            maxDate: moment(new Date())
                .endOf('month')
                .format('YYYY-MM-DD'),
            isOnUpdateInOut: false,
            dataItemForAddInOut: null,
            dataItemForAddInOutTemp: null,
            isWatingAddOut: false, // tham số hiển thị modal bổ sung dữ liêu Out sau khi bổ sung In xong,
            isShowModalSubmit: false
        };
        this.listItemOpenSwipeOut = {}; //[];
        this.oldIndexOpenSwipeOut = null;
        this.refAgenda = null;
        this.rowAction = null;
    }

    // moveToDetail = item => {
    //   DrawerServices.navigate('AttDataWorkdaysEmpsViewDetail', {
    //     dataItem: item,
    //   });
    // };

    renderItem(item, index, aaaa) {
        if (item && item.data && item.data.length > 0) {
            return (
                <TouchableOpacity
                    onPress={() => this.showModalDetail(item.data[0])}
                    style={{
                        width: Size.deviceWidth
                    }}
                >
                    <WorkDayV2ListItem dataItem={item.data[0]} />
                </TouchableOpacity>
            );
        }
    }

    rowHasChanged(r1, r2) {
        const thisData = r1 && r1.data && r1.data.length > 0 ? r1.data[0] : { ID: '' },
            nextData = r2 && r2.data && r2.data.length > 0 ? r2.data[0] : { ID: '' };
        return r1.data.length !== r2.data.length && thisData.ID !== nextData.ID;
    }

    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }

    onDayPress = date => {
        console.log('onDayPress');
        const { currentDate, daySelected, listMarked, listMarkedBackup } = this.state;
        if (listMarkedBackup[daySelected]) listMarked[daySelected] = listMarkedBackup[daySelected];
        else
            listMarked[daySelected] = {
                customStyles: {
                    text: {
                        color: Colors.gray_10
                    }
                }
            };

        listMarked[date.dateString] = {
            customStyles: {
                text: {
                    color: Colors.white
                }
            }
        };

        this.setState(
            {
                daySelected: date.dateString,
                listMarked: listMarked
            },
            () => {
                if (currentDate != null && (currentDate.month != date.month || currentDate.year != date.year)) {
                    this.onChangeMonth(date);
                }
            }
        );
    };

    renderEmptyDate() {
        const { isLoading } = this.state;
        return (
            <View style={styles.emptyDate}>
                {!isLoading && <EmptyData messageEmptyData={'HRM_Sal_HoldSalary_NotData'} />}
            </View>
        );
    }

    renderDayCustom = ({ date, state, marking }) => {
        return (
            <TouchableWithoutFeedback onPress={() => this.onDayPress(date)}>
                <View
                    style={{
                        marginVertical: Size.defineHalfSpace,
                        backgroundColor: 'red'
                    }}
                >
                    <Text style={{ textAlign: 'center', color: state === 'disabled' ? 'gray' : 'black' }}>
                        {date.day}
                    </Text>

                    {marking && marking.dots && marking.dots.length > 0 && (
                        <View style={{ flexDirection: 'row', justifyContent: 'center', marginTop: 3 }}>
                            {marking.dots.map(item => (
                                <View
                                    style={{
                                        width: 4,
                                        height: 4,
                                        borderRadius: 2,
                                        backgroundColor: item.color,
                                        marginRight: 2
                                    }}
                                />
                            ))}
                        </View>
                    )}
                </View>
            </TouchableWithoutFeedback>
        );
    };

    refreshList = () => {
        const { isWatingAddOut, dataItemForAddInOutTemp } = this.state;
        if (isWatingAddOut) {
            this.setState(
                {
                    isOnUpdateInOut: true,
                    isWatingAddOut: false,
                    dataItemForAddInOut: {
                        ...{ ...dataItemForAddInOutTemp },
                        Type: EnumName.E_OUT
                    },
                    dataItemForAddInOutTemp: null
                },
                () => {
                    this.pullToRefresh();
                }
            );
        } else {
            // this.setState({ isLoading: true });
            VnrLoadingSevices.show();
            this.pullToRefresh();
        }
    };

    pullToRefresh = () => {
        VnrLoadingSevices.show();
        const { currentMonth, keyQuery } = this.state,
            _payload = {
                Month: currentMonth && currentMonth.month ? currentMonth.month : null,
                Year: currentMonth && currentMonth.year ? currentMonth.year : null,
                keyQuery: keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA
            };

        startTask({
            keyTask: EnumTask.KT_Workday,
            payload: _payload
        });
    };

    GetCutOffDurationByMonthYear = (_dateString, _Month, _Year) => {
        // chay lazy loading
        startTask({
            keyTask: EnumTask.KT_Workday,
            payload: {
                Month: _Month,
                Year: _Year,
                keyQuery: EnumName.E_FILTER
            }
        });
    };

    onChangeMonth = value => {
        if (!value) {
            return;
        }
        // luu lai value thang hien tai

        // this.setCurrentMonth(value);
        this.setState(
            {
                currentMonth: value,
                daySelected: value.dateString,
                isRefreshList: !this.state.isRefreshList,
                keyQuery: EnumName.E_FILTER,
                isLoading: true
            },
            () => {
                this.GetCutOffDurationByMonthYear(value.dateString, value.month, value.year);
            }
        );
    };

    componentDidMount() {
        this.generaRender();
    }

    generaRender = () => {
        let _rowAction = [];
        if (PermissionForAppMobile && PermissionForAppMobile.value) {
            const permission = PermissionForAppMobile.value;

            if (true) {
                _rowAction = [
                    ..._rowAction,
                    {
                        type: 'E_INOUT',
                        title: translate('HRM_AddInOut'),
                        icon: require('../../../../../assets/images/GPS/fingerprint.png'),
                        isSheet: false,
                        onPress: (item, isMissIn, isMissOut) => {
                            if (item) {
                                if (isMissIn && isMissOut)
                                    this.setState({
                                        isOnUpdateInOut: true,
                                        isWatingAddOut: true, // tham số hiển thị modal bổ sung dữ liêu Out sau khi bổ sung In xong
                                        dataItemForAddInOut: {
                                            ...item,
                                            Type: EnumName.E_IN
                                        },
                                        dataItemForAddInOutTemp: {
                                            ...item,
                                            Type: EnumName.E_OUT
                                        }
                                    });
                                else
                                    this.setState({
                                        isOnUpdateInOut: true,
                                        isWatingAddOut: false, // tham số hiển thị modal bổ sung dữ liêu Out sau khi bổ sung In xong
                                        dataItemForAddInOut: {
                                            ...item,
                                            Type: isMissIn ? EnumName.E_IN : EnumName.E_OUT
                                        },
                                        dataItemForAddInOutTemp: null
                                    });
                            } else {
                                DrawerServices.navigate('AttSubmitTSLRegisterAddOrEdit', {
                                    workDayItem: null,
                                    reload: this.refreshList,
                                    goBack: 'WorkDay'
                                });
                            }

                            //this.setState({ isOnUpdateInOut: true, dataItemForAddInOut: item });
                        }
                    }
                ];
            }

            if (
                permission['New_Att_LateEarlyAllowed_New_Index_WorkDay_btnCreate'] &&
                permission['New_Att_LateEarlyAllowed_New_Index_WorkDay_btnCreate']['View']
            ) {
                _rowAction = [
                    ..._rowAction,
                    {
                        type: EnumName.E_EARLYALLOWED,
                        title: translate('HRM_PortalApp_Add_LateEarlyAllowed'),
                        icon: require('../../../../../assets/images/GPS/LateEarly.png'),
                        isSheet: false,
                        onPress: item => {
                            DrawerServices.navigate('AttSubmitLateEarlyAllowedAddOrEdit', {
                                workDayItem: item ? { ...item } : null,
                                reload: this.refreshList,
                                goBack: 'WorkDay'
                            });
                        }
                    }
                ];
            }

            if (
                permission['New_Att_Leaveday_New_Index_WorkDay_btnCreate'] &&
                permission['New_Att_Leaveday_New_Index_WorkDay_btnCreate']['View']
            ) {
                _rowAction = [
                    ..._rowAction,
                    {
                        type: 'E_LEAVEDAY',
                        title: translate('HRM_LeaveDayRegister'),
                        icon: require('../../../../../assets/images/GPS/LeaveDay.png'),
                        isSheet: false,
                        onPress: item => {
                            DrawerServices.navigate('AttSubmitLeaveDayAddOrEdit', {
                                workDayItem: item ? { ...item } : null,
                                reload: this.refreshList,
                                goBack: 'WorkDay'
                            });
                        }
                    }
                ];
            }

            if (
                permission['New_Att_Overtime_New_Index_WorkDay_btnCreate'] &&
                permission['New_Att_Overtime_New_Index_WorkDay_btnCreate']['View']
            ) {
                _rowAction = [
                    ..._rowAction,
                    {
                        type: 'E_OVERTIME',
                        title: translate('HRM_OvertimeRegister'),
                        icon: require('../../../../../assets/images/GPS/OT.png'),
                        isSheet: false,
                        onPress: item => {
                            DrawerServices.navigate('AttSubmitOvertimeAddOrEdit', {
                                workDayItem: item ? { ...item } : null,
                                reload: this.refreshList,
                                goBack: 'WorkDay'
                            });
                        }
                    }
                ];
            }
        }
        this.rowAction = _rowAction;

        this.loadItems();
        startTask({
            keyTask: EnumTask.KT_Workday,
            payload: {
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.loadItems
            }
        });
    };

    addMarked = (listData, fieldStatus) => {
        let arr = [];
        listData.forEach(item => {
            if (item.itemStatus) {
                let { colorStatus } = item.itemStatus,
                    colorStatusView = '';

                if (colorStatus == '18,13,224,1') {
                    colorStatusView = '#120DE0';
                } else if (colorStatus == '255,153,0,1') {
                    colorStatusView = '#E19900';
                } else if (colorStatus == '240,80,80,1') {
                    colorStatusView = '#F05050';
                } else if (colorStatus == '255,3,3,1') {
                    colorStatusView = '#FF0303';
                } else if (colorStatus == '39,194,76,1') {
                    colorStatusView = '#27C24C';
                } else if (colorStatus == '250,219,20,1') {
                    colorStatusView = '#FADB14';
                }

                // arr.push({
                //   key: colorStatus, color: colorStatusView, textColor: 'blue'
                // });

                arr.push({ marked: true, dotColor: '#50cebb' });
            }
        });

        return arr;
    };

    loadItems = () => {
        console.log('loadItems');
        const { keyQuery, refreshing } = this.state;

        this.setState({ isLoading: true });
        getDataLocal(EnumTask.KT_Workday).then(resData => {
            const res = resData && resData[keyQuery] ? resData[keyQuery] : null;
            try {
                const listMarker = {
                        E_OVERTIME: { key: 'E_OVERTIME', color: Colors.red },
                        E_LEAVE_DAY: { key: 'E_LEAVE_DAY', color: Colors.purple },
                        E_TAMSCANLOGREGISTER: { key: 'E_TAMSCANLOGREGISTER', color: Colors.orange },
                        E_LATEEARLY_ALLOWED: { key: 'E_TAMSCANLOGREGISTER', color: Colors.gray_7 },
                        E_BUSSINESSTRAVEL: { key: 'E_BUSSINESSTRAVEL', color: Colors.green }
                    },
                    listData = {},
                    listDataViolate = { keyTras: 'Ngày vi phạm', data: {} },
                    listDataMissInOut = { keyTras: 'Thiếu In/Out', data: {} },
                    listDataLateEarly = { keyTras: 'Lần trễ/sớm', data: {} },
                    listDataInvalid = { keyTras: 'Dữ liệu bất đồng bộ', data: {} },
                    listDataLeaveDay = { keyTras: 'Ngày nghỉ', data: {} },
                    listDataOvertime = { keyTras: 'Tăng ca', data: {} },
                    listDataTravel = { keyTras: 'Ngày công tác', data: {} },
                    listDataTamscanlog = { keyTras: 'Quên chấm công', data: {} },
                    listDataAllowLateEarly = { keyTras: 'Ngày trễ sớm', data: {} },
                    listMarked = { keyTras: 'Ngày vi phạm', data: {} },
                    listMarkedBackup = { keyTras: 'Ngày vi phạm', data: {} };

                let dataFilter = {},
                    minDate = null,
                    maxDate = null;

                if (res && Array.isArray(res) && res.length > 0) {
                    res.forEach((item, index) => {
                        if (item.TitleWeek == null) {
                            // max
                            if (maxDate == null) maxDate = item.WorkDate;

                            // min
                            minDate = item.WorkDate;

                            let dateTime = moment(item.WorkDate).format('YYYY-MM-DD');
                            // let lstDot = [];

                            // if (item.ListBusinessTravel && item.ListBusinessTravel.length > 0) {
                            //   let listMar = this.addMarked(item.ListBusinessTravel, 'StatusLeave');
                            //   lstDot = [...lstDot, ...listMar];
                            // }

                            // check MissIn MissOut, check Late, check early
                            let isMissIn = false,
                                isMissOut = false,
                                isLate = false,
                                isEarly = false;

                            if (moment(item.WorkDate).isSameOrBefore(new Date(), 'date')) {
                                if (item.Type == 'E_MISS_IN_OUT') {
                                    isMissIn = true;
                                    isMissOut = true;
                                } else {
                                    if (item.Type == 'E_MISS_IN' && item.ShiftID != null) {
                                        isMissIn = true;
                                    }

                                    if (item.Type == 'E_MISS_OUT' && item.ShiftID != null) {
                                        isMissOut = true;
                                    }
                                }

                                if (item.LateDuration1) {
                                    isLate = true;
                                }

                                if (item.EarlyDuration1) {
                                    isEarly = true;
                                }

                                if (isLate || isMissIn || isMissOut || isEarly) {
                                    listMarked[dateTime] = {
                                        customStyles: {
                                            text: {
                                                color: Colors.red
                                            }
                                        }
                                    };
                                    listMarkedBackup[dateTime] = {
                                        customStyles: {
                                            text: {
                                                color: Colors.red
                                            }
                                        }
                                    };
                                }
                            } else {
                                item.isFuture = true;
                            }
                            //------------------------------------------------//

                            // -------add data filter ---------------//
                            if (isMissIn || isMissOut || isLate || isEarly) {
                                listDataViolate['data'][dateTime] = [{ data: [item], dateTime: item.WorkDate }];
                                // if (!listDataViolate['dateStart'])
                                listDataViolate['dateStart'] = dateTime;
                            }

                            if (isMissIn || isMissOut) {
                                listDataMissInOut['data'][dateTime] = [{ data: [item], dateTime: item.WorkDate }];
                                // if (!listDataMissInOut['dateStart'])
                                listDataMissInOut['dateStart'] = dateTime;
                            }

                            if (isLate || isEarly) {
                                listDataLateEarly['data'][dateTime] = [{ data: [item], dateTime: item.WorkDate }];
                                //if (!listDataLateEarly['dateStart'])
                                listDataLateEarly['dateStart'] = dateTime;
                            }

                            if (item.ListLeaveday && item.ListLeaveday.length > 0) {
                                listDataLeaveDay['data'][dateTime] = [{ data: [item], dateTime: item.WorkDate }];
                                //if (!listDataLeaveDay['dateStart'])
                                listDataLeaveDay['dateStart'] = dateTime;
                            }

                            if (item.ListOvertime && item.ListOvertime.length > 0) {
                                listDataOvertime['data'][dateTime] = [{ data: [item], dateTime: item.WorkDate }];
                                //if (!listDataOvertime['dateStart'])
                                listDataOvertime['dateStart'] = dateTime;
                            }

                            if (item.ListTamscanlogRegister && item.ListTamscanlogRegister.length > 0) {
                                listDataTamscanlog['data'][dateTime] = [{ data: [item], dateTime: item.WorkDate }];
                                //if (!listDataTamscanlog['dateStart'])
                                listDataTamscanlog['dateStart'] = dateTime;
                            }

                            if (item.ListAllowLateEarly && item.ListAllowLateEarly.length > 0) {
                                listDataAllowLateEarly['data'][dateTime] = [{ data: [item], dateTime: item.WorkDate }];
                                ///if (!listDataAllowLateEarly['dateStart'])
                                listDataAllowLateEarly['dateStart'] = dateTime;
                            }

                            if (item.ListBusinessTravel && item.ListBusinessTravel.length > 0) {
                                listDataTravel['data'][dateTime] = [{ data: [item], dateTime: item.WorkDate }];
                                //if (!listDataTravel['dateStart'])
                                listDataTravel['dateStart'] = dateTime;
                            }
                            // ------------------------------//

                            if (listData[dateTime]) {
                                let calendarItem = listData[dateTime];
                                if (calendarItem[0] && calendarItem[0]['data']) {
                                    calendarItem[0]['data'].push(item);
                                }
                            } else {
                                listData[dateTime] = [{ data: [item], dateTime: item.WorkDate }];
                            }
                        }
                    });
                }

                if (listDataViolate.dateStart) dataFilter['listDataViolate'] = listDataViolate;

                if (listDataInvalid.dateStart) dataFilter['listDataInvalid'] = listDataInvalid;

                if (listDataLeaveDay.dateStart) dataFilter['listDataLeaveDay'] = listDataLeaveDay;

                if (listDataOvertime.dateStart) dataFilter['listDataOvertime'] = listDataOvertime;

                if (listDataTravel.dateStart) dataFilter['listDataTravel'] = listDataTravel;

                if (listDataTamscanlog.dateStart) dataFilter['listDataTamscanlog'] = listDataTamscanlog;

                if (listDataAllowLateEarly.dateStart) dataFilter['listDataAllowLateEarly'] = listDataAllowLateEarly;

                // dataFilter = {
                //   listDataViolate: listDataViolate,
                //   // listDataMissInOut,
                //   // listDataLateEarly,
                //   listDataInvalid: listDataInvalid,
                //   listDataLeaveDay: listDataLeaveDay,
                //   listDataOvertime: listDataOvertime,
                //   listDataTravel: listDataTravel,
                //   listDataTamscanlog: listDataTamscanlog,
                //   listDataAllowLateEarly: listDataAllowLateEarly,
                // }

                let objTotalWorkDay = {};
                if (res.length > 0) {
                    const firstItem = res[0];
                    if (firstItem) {
                        objTotalWorkDay = {
                            TotalHoliday: firstItem.TotalHoliday, //tổng nghĩ lễ
                            StdWorkdayCount: firstItem.StdWorkdayCount,
                            TotalForgeLeaveDays: firstItem.TotalForgeLeaveDays, //tổng ngày nghỉ ngừng việc master

                            TotalPaidWorkDays: firstItem.TotalPaidWorkDays,
                            TotalRealWorkdays: firstItem.TotalRealWorkdays,
                            TotalPaidLeaveDays: firstItem.TotalPaidLeaveDays,
                            TotalBusinessDayLeaveDays: firstItem.TotalBusinessDayLeaveDays,

                            TotalUnPaidWorkDays: firstItem.TotalUnPaidWorkDays,
                            TotalUnPaidLeaveDays: firstItem.TotalUnPaidLeaveDays,
                            TotalLateEarly: firstItem.TotalLateEarly,
                            TotalLateEarlyDuration3: firstItem.TotalLateEarlyDuration3,

                            TotalOTPayroll: firstItem.TotalOTPayroll,
                            TotalOvertimeHoursWorkday: firstItem.TotalOvertimeHoursWorkday,
                            TotalOvertimeHoursWeekend: firstItem.TotalOvertimeHoursWeekend,
                            TotalOvertimeHoursHoliday: firstItem.TotalOvertimeHoursHoliday,
                            TotalNightHours: firstItem.TotalNightHours,
                            TotalNightHoursAndNightOvertime: firstItem.TotalNightHoursAndNightOvertime,
                            TotalOvertimeHoursNightWorkday: firstItem.TotalOvertimeHoursNightWorkday,
                            TotalOvertimeHoursNightWeekend: firstItem.TotalOvertimeHoursNightWeekend,
                            TotalOvertimeHoursNightHoliday: firstItem.TotalOvertimeHoursNightHoliday,
                            isEmptyData: false
                        };
                    }
                } else {
                    objTotalWorkDay = {
                        TotalHoliday: null,
                        StdWorkdayCount: null,
                        TotalForgeLeaveDays: null,
                        TotalPaidWorkDays: null,
                        TotalRealWorkdays: null,
                        TotalPaidLeaveDays: null,
                        TotalBusinessDayLeaveDays: null,

                        TotalUnPaidWorkDays: null,
                        TotalUnPaidLeaveDays: null,
                        TotalLateEarly: null,
                        TotalLateEarlyDuration3: null,

                        TotalOTPayroll: null,
                        TotalOvertimeHoursWorkday: null,
                        TotalOvertimeHoursWeekend: null,
                        TotalOvertimeHoursHoliday: null,
                        TotalNightHours: null,
                        TotalNightHoursAndNightOvertime: null,
                        TotalOvertimeHoursNightWorkday: null,
                        TotalOvertimeHoursNightWeekend: null,
                        TotalOvertimeHoursNightHoliday: null,
                        isEmptyData: true
                    };
                }

                this.setState(
                    {
                        ...objTotalWorkDay,
                        dataFilter: dataFilter,
                        //daySelected: moment(minDate).format('YYYY-MM-DD'),
                        dataCalendar: listData,
                        listMarked: listMarked,
                        listMarkedBackup: listMarkedBackup,
                        isLoading: false,
                        minDate: moment(minDate).format('YYYY-MM-DD'),
                        maxDate: moment(maxDate).format('YYYY-MM-DD'),
                        refreshing: !refreshing
                    },
                    () => {
                        VnrLoadingSevices.hide();
                        // setTimeout(() => {
                        //   (this.refAgenda && this.refAgenda.onDayChange) &&
                        //     this.refAgenda.onDayChange(moment(minDate).format('YYYY-MM-DD'))
                        // }, 500);
                    }
                );
            } catch (error) {
                console.log(error, 'error');
            }
        });
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        debugger;
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == EnumTask.KT_Workday) {
            //khi màn hình đang reload thì messsage phải là filter thì màn hình mới reload
            if (keyQuery === EnumName.E_FILTER && nextProps.message && keyQuery == nextProps.message.keyQuery) {
                this.loadItems();
            } else if (nextProps.message && keyQuery == nextProps.message.keyQuery) {
                // dataChange == true ? khác : giống nhau
                if (!nextProps.message.dataChange) {
                    this.setState({
                        isLoadingHeader: false
                    });
                } else {
                    this.loadItems();
                }
            }
        }
    }

    _renderHeaderLoading = () => {
        return <VnrIndeterminate isVisible={this.state.isLoadingHeader} />;
    };

    closeModalFilter = () => {
        this.setState({
            isVisibleModalFilter: false
        });
    };

    onFilter = item => {
        // console.log(this.refAgenda, 'item.data')
        if (item && Object.keys(item.data).length > 0) {
            this.setState(
                {
                    currentDate: {
                        year: parseInt(moment(item.dateStart).format('YYYY')),
                        month: parseInt(moment(item.dateStart).format('MM'))
                    },
                    dataCalendar: item.data,
                    daySelected: item.dateStart,
                    refreshing: !this.state.refreshing
                },
                () => {
                    this.refAgenda && this.refAgenda.onDayChange && this.refAgenda.onDayChange(item.dateStart);
                }
            );
        }
    };

    renderViewTopWorkDay = () => {
        const {
            TotalPaidWorkDays,
            TotalOTPayroll,
            TotalUnPaidWorkDays,
            StdWorkdayCount,
            TotalNightHoursAndNightOvertime,
            TotalForgeLeaveDays,
            isEmptyData,
            calendarOpened,
            isVisibleModalFilter,
            dataFilter
        } = this.state;
        // Có cấu hình ẩn field thì không hiển thị vùng master
        const _configField = ConfigField && ConfigField.value['Workday'] ? ConfigField.value['Workday']['Hidden'] : [];

        let isShowMasterData = _configField.findIndex(key => key == 'MasterData') > -1 ? false : true,
            isShowTotalUnPaidWorkDays = _configField.findIndex(key => key == 'TotalUnPaidWorkDays') > -1 ? false : true,
            isShowTotalPaidWorkDays = _configField.findIndex(key => key == 'TotalPaidWorkDays') > -1 ? false : true,
            isShowTotalForgeLeaveDays = _configField.findIndex(key => key == 'TotalForgeLeaveDays') > -1 ? false : true,
            isShowTotalOTPayroll = _configField.findIndex(key => key == 'TotalOTPayroll') > -1 ? false : true,
            isShowTotalNightHoursAndNightOvertime =
                _configField.findIndex(key => key == 'TotalNightHoursAndNightOvertime') > -1 ? false : true;

        console.log(Object.keys(dataFilter).length, 'asdasdas');
        return (
            <View style={styles.styViewTopWorkDay}>
                <View style={styles.styLeftAvatar}>
                    <TouchableOpacity
                        style={styles.stySizeIcon}
                        onPress={() => this.setState({ isVisibleModalFilter: true })}
                    >
                        <IconSearch color={Colors.gray_9} size={Size.iconSize} />
                    </TouchableOpacity>
                </View>
                <View style={styles.styBoxCenter}>
                    {/* <TouchableOpacity style={styles.styBoxButtonDetail} onPress={() => {
              DrawerServices.navigate('WorkDayViewDetail', {
                dataItem: this.state,
                screenName: 'WorkDayMasterViewDetail'
              })
            }}>
              <IconMoreHorizontal size={Size.iconSize} color={Colors.black} />
            </TouchableOpacity> */}
                    {/* Công chuẩn (ngày) */}
                    {StdWorkdayCount != null && StdWorkdayCount > 0 && (
                        <View style={styles.styBox}>
                            <View style={styles.styBoxLableView}>
                                <VnrText
                                    style={[styleSheets.lable, styles.styboxLable]}
                                    i18nKey={'HRM_Attendance_AttendanceTable_StdWorkDayCount'}
                                    numberOfLines={1}
                                />
                            </View>
                            <View>
                                <Text style={[styleSheets.text, styles.styboxValue]}>
                                    {StdWorkdayCount ? Vnr_Function.mathRoundNumber(StdWorkdayCount) : 0}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Tổng ngày công tính lương */}
                    {TotalPaidWorkDays != null && TotalPaidWorkDays > 0 && isShowTotalPaidWorkDays && (
                        <View style={styles.styBox}>
                            <View style={styles.styBoxLableView}>
                                <VnrText
                                    style={[styleSheets.lable, styles.styboxLable]}
                                    i18nKey={'HRM_Att_Workday_Master_SalWorkDay'}
                                    numberOfLines={1}
                                />
                            </View>
                            <View>
                                <Text style={[styleSheets.text, styles.styboxValue]}>
                                    {TotalPaidWorkDays ? Vnr_Function.mathRoundNumber(TotalPaidWorkDays) : 0}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Tổng ngày nghỉ ngừng việc */}
                    {TotalForgeLeaveDays != null && TotalForgeLeaveDays > 0 && isShowTotalForgeLeaveDays && (
                        <View style={styles.styBox}>
                            <View style={styles.styBoxLableView}>
                                <VnrText
                                    style={[styleSheets.lable, styles.styboxLable]}
                                    i18nKey={'HRM_Att_Workday_Master_ForgeLeaveDays'}
                                    numberOfLines={1}
                                />
                            </View>
                            <View>
                                <Text style={[styleSheets.text, styles.styboxValue]}>
                                    {TotalForgeLeaveDays ? Vnr_Function.mathRoundNumber(TotalForgeLeaveDays) : 0}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Tổng OT tính lương */}
                    {TotalOTPayroll != null && TotalOTPayroll > 0 && isShowTotalOTPayroll && (
                        <View style={styles.styBox}>
                            <View style={styles.styBoxLableView}>
                                <VnrText
                                    style={[styleSheets.lable, styles.styboxLable]}
                                    i18nKey={'HRM_Att_Workday_Master_TotalOTPayroll'}
                                    numberOfLines={1}
                                />
                            </View>
                            <View>
                                <Text style={[styleSheets.text, styles.styboxValue]}>
                                    {TotalOTPayroll ? Vnr_Function.mathRoundNumber(TotalOTPayroll) : 0}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Tổng ngày không tính lương */}
                    {TotalUnPaidWorkDays != null && TotalUnPaidWorkDays > 0 && isShowTotalUnPaidWorkDays && (
                        <View style={styles.styBox}>
                            <View style={styles.styBoxLableView}>
                                <VnrText
                                    style={[styleSheets.lable, styles.styboxLable]}
                                    i18nKey={'HRM_Att_Workday_Master_Not_SalWorkDay'}
                                    numberOfLines={1}
                                />
                            </View>
                            <View>
                                <Text style={[styleSheets.text, styles.styboxValue]}>
                                    {TotalUnPaidWorkDays ? Vnr_Function.mathRoundNumber(TotalUnPaidWorkDays) : 0}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Tổng công ca đêm */}
                    {TotalNightHoursAndNightOvertime != null &&
                        TotalNightHoursAndNightOvertime > 0 &&
                        isShowTotalNightHoursAndNightOvertime && (
                        <View style={styles.styBox}>
                            <View style={styles.styBoxLableView}>
                                <VnrText
                                    style={[styleSheets.lable, styles.styboxLable]}
                                    i18nKey={'HRM_Att_Workday_Master_TotalNightHoursAndNightOvertime'}
                                    numberOfLines={1}
                                />
                            </View>
                            <View>
                                <Text style={[styleSheets.text, styles.styboxValue]}>
                                    {TotalNightHoursAndNightOvertime
                                        ? Vnr_Function.mathRoundNumber(TotalNightHoursAndNightOvertime)
                                        : 0}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>

                {this.rowAction && Array.isArray(this.rowAction) && this.rowAction.length > 0 && (
                    <View style={styles.styBoxRight}>
                        <TouchableOpacity
                            style={styles.styBtnAdd}
                            onPress={() => {
                                this.setState({
                                    isShowModalSubmit: true
                                });
                            }}
                        >
                            <IconPlus size={Size.iconSizeHeader + 10} color={Colors.white} />
                        </TouchableOpacity>
                    </View>
                )}

                <Modal
                    onBackButtonPress={() => {
                        this.closeModalFilter();
                    }}
                    key={'@MODAL_YEAR_PICKER'}
                    isVisible={isVisibleModalFilter}
                    animationIn="fadeIn"
                    animationOut="fadeOut"
                    onBackdropPress={() => this.closeModalFilter()}
                    customBackdrop={
                        <TouchableWithoutFeedback onPress={() => this.closeModalFilter()}>
                            <View
                                style={{
                                    flex: 1,
                                    backgroundColor: Colors.black,
                                    opacity: 0.2
                                }}
                            />
                        </TouchableWithoutFeedback>
                    }
                >
                    <SafeAreaView {...styleSafeAreaView} style={[styles.styViewModal]}>
                        <View style={styles.container}>
                            <View style={styles.styHdModal}>
                                <Text style={[styleSheets.text, { color: Colors.white }]}>Lọc theo kỳ công</Text>

                                <Text style={[styleSheets.text, { color: Colors.white }]}>Số ngày</Text>
                            </View>
                            <View style={styles.styLstModal}>
                                {dataFilter &&
                                    Object.keys(dataFilter).length > 0 &&
                                    Object.keys(dataFilter).map(key => {
                                        if (Object.keys(dataFilter[key]).length > 0) {
                                            let item = dataFilter[key];
                                            return (
                                                <TouchableOpacity
                                                    style={styles.styBtnModal}
                                                    onPress={() => this.onFilter(item)}
                                                >
                                                    <Text style={[styleSheets.text]}>{item.keyTras}</Text>

                                                    <Text style={[styleSheets.lable]}>
                                                        {Object.keys(item.data).length}
                                                    </Text>
                                                </TouchableOpacity>
                                            );
                                        }
                                    })}
                            </View>

                            <View style={styles.styleViewBntApprove}>
                                <TouchableOpacity style={styles.bntCancel} onPress={() => this.closeModalFilter()}>
                                    <VnrText
                                        style={[styleSheets.text, { color: Colors.black }]}
                                        i18nKey={'HRM_Common_Close'}
                                    />
                                </TouchableOpacity>
                                <TouchableOpacity style={styles.bntApprove} onPress={this.saveUpdate}>
                                    <VnrText
                                        style={[styleSheets.lable, styles.styTextBntApprove]}
                                        i18nKey={'HRM_Common_Confirm'}
                                    />
                                </TouchableOpacity>
                            </View>
                        </View>
                    </SafeAreaView>
                </Modal>
            </View>
        );
    };

    hideModalSubmit = () => {
        this.setState({
            isShowModalSubmit: false
        });
    };

    hideModalDetail = () => {
        this.setState({
            dataModalItem: null
        });
    };

    showModalDetail = item => {
        this.setState({
            dataModalItem: item
        });
    };

    renderIconStatus = status => {
        if (
            status == EnumStatus.E_APPROVE ||
            status == EnumStatus.E_APPROVED ||
            status == EnumStatus.E_APPROVED1 ||
            status == EnumStatus.E_APPROVED2 ||
            status == EnumStatus.E_FIRST_APPROVED ||
            status == EnumStatus.E_APPROVED3
        ) {
            return <IconCheck size={Size.text} color={Colors.white} />;
        } else if (status == EnumStatus.E_REJECT || status == EnumStatus.E_REJECTED || status == EnumStatus.E_CANCEL) {
            return <IconCancel size={Size.text} color={Colors.white} />;
        } else if (status == EnumStatus.E_SUBMIT) {
            return <IconMoreHorizontal size={Size.text} color={Colors.white} />;
        } else {
            return <IconMinus size={Size.text} color={Colors.white} />;
        }
    };

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
                <View style={styles.styBtnDetail}>
                    <View
                        style={[
                            styles.styVeStatus,
                            {
                                backgroundColor: bgStatusView
                                    ? Vnr_Function.convertTextToColor(bgStatusView)
                                    : Colors.white
                            }
                        ]}
                    >
                        <View style={styles.styTopStatus}>
                            <View
                                style={[
                                    styles.styTopIcon,
                                    {
                                        backgroundColor: colorStatusView
                                            ? Vnr_Function.convertTextToColor(colorStatusView)
                                            : Colors.gray_10
                                    }
                                ]}
                            >
                                {this.renderIconStatus(item.Status)}
                            </View>

                            <Text
                                style={[
                                    styleSheets.text,
                                    styles.styTxtLbStatus,
                                    {
                                        color: colorStatusView
                                            ? Vnr_Function.convertTextToColor(colorStatusView)
                                            : Colors.gray_10
                                    }
                                ]}
                            >
                                {translate('HRM_PortalApp_Add_LateEarlyAllowed')}
                            </Text>
                        </View>

                        <Text
                            style={[
                                styleSheets.lable,
                                styles.styTxtVlStatus,
                                {
                                    color: colorStatusView
                                        ? Vnr_Function.convertTextToColor(colorStatusView)
                                        : Colors.gray_10
                                }
                            ]}
                        >
                            {item.StatusView}
                        </Text>
                    </View>

                    <View style={[stylesScreenDetailV2.styItemContent, styles.styVeStContent, styles.styNoBorder]}>
                        <View style={stylesScreenDetailV2.viewLable}>
                            <VnrText style={[styleSheets.lable, { textAlign: 'left' }]} i18nKey={'LateEarlyTypeView'} />
                        </View>
                        <View style={stylesScreenDetailV2.styViewValue}>
                            <Text style={{ ...styleSheets.text, ...stylesScreenDetailV2.styTextValueInfo }}>
                                {item.LateMinutes
                                    ? translate('HRM_Attendance_WorkDay_LateDuration')
                                    : translate('HRM_Attendance_WorkDay_EarlyDuration')}
                            </Text>
                        </View>
                    </View>

                    <View style={[stylesScreenDetailV2.styItemContent, styles.styVeStContent]}>
                        <View style={stylesScreenDetailV2.viewLable}>
                            <VnrText style={[styleSheets.lable, { textAlign: 'left' }]} i18nKey={'HRM_Sys_TimeRange'} />
                        </View>
                        <View style={stylesScreenDetailV2.styViewValue}>
                            <Text style={{ ...styleSheets.text, ...stylesScreenDetailV2.styTextValueInfo }}>
                                {item.LateMinutes
                                    ? `${item.LateMinutes} ${translate('Minute_Lowercase')}`
                                    : `${item.EarlyMinutes} ${translate('Minute_Lowercase')}`}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.styVeMore}>
                        <IconMoreHorizontal size={Size.iconSize} color={Colors.gray_8} />
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
                <View style={styles.styBtnDetail}>
                    <View
                        style={[
                            styles.styVeStatus,
                            {
                                backgroundColor: bgStatusView
                                    ? Vnr_Function.convertTextToColor(bgStatusView)
                                    : Colors.white
                            }
                        ]}
                    >
                        <View style={styles.styTopStatus}>
                            <View
                                style={[
                                    styles.styTopIcon,
                                    {
                                        backgroundColor: colorStatusView
                                            ? Vnr_Function.convertTextToColor(colorStatusView)
                                            : Colors.gray_10
                                    }
                                ]}
                            >
                                {this.renderIconStatus(item.StatusLeave)}
                            </View>

                            <Text
                                style={[
                                    styleSheets.text,
                                    styles.styTxtLbStatus,
                                    {
                                        color: colorStatusView
                                            ? Vnr_Function.convertTextToColor(colorStatusView)
                                            : Colors.gray_10
                                    }
                                ]}
                            >
                                {translate('HRM_PortalApp_Workday_ForgeLeaveday')}
                            </Text>
                        </View>

                        <Text
                            style={[
                                styleSheets.lable,
                                styles.styTxtVlStatus,
                                {
                                    color: colorStatusView
                                        ? Vnr_Function.convertTextToColor(colorStatusView)
                                        : Colors.gray_10
                                }
                            ]}
                        >
                            {item.StatusLeaveView}
                        </Text>
                    </View>

                    <View style={[stylesScreenDetailV2.styItemContent, styles.styVeStContent, styles.styNoBorder]}>
                        <View style={stylesScreenDetailV2.viewLable}>
                            <VnrText
                                style={[styleSheets.lable, { textAlign: 'left' }]}
                                i18nKey={'HRM_PortalApp_Workday_ForgeLeaveday_Type'}
                            />
                        </View>
                        <View style={stylesScreenDetailV2.styViewValue}>
                            <Text style={{ ...styleSheets.text, ...stylesScreenDetailV2.styTextValueInfo }}>
                                {item.LeavedayTypeName}
                            </Text>
                        </View>
                    </View>

                    <View style={[stylesScreenDetailV2.styItemContent, styles.styVeStContent]}>
                        <View style={stylesScreenDetailV2.viewLable}>
                            <VnrText style={[styleSheets.lable, { textAlign: 'left' }]} i18nKey={'HRM_Sys_TimeRange'} />
                        </View>
                        <View style={stylesScreenDetailV2.styViewValue}>
                            <Text style={{ ...styleSheets.text, ...stylesScreenDetailV2.styTextValueInfo }}>
                                {`${Vnr_Function.mathRoundNumber(item.LeaveDays)} ${translate('E_DAY_LOWERCASE')}`}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.styVeMore}>
                        <IconMoreHorizontal size={Size.iconSize} color={Colors.gray_8} />
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
                <View style={styles.styBtnDetail}>
                    <View
                        style={[
                            styles.styVeStatus,
                            {
                                backgroundColor: bgStatusView
                                    ? Vnr_Function.convertTextToColor(bgStatusView)
                                    : Colors.white
                            }
                        ]}
                    >
                        <View style={styles.styTopStatus}>
                            <View
                                style={[
                                    styles.styTopIcon,
                                    {
                                        backgroundColor: colorStatusView
                                            ? Vnr_Function.convertTextToColor(colorStatusView)
                                            : Colors.gray_10
                                    }
                                ]}
                            >
                                {this.renderIconStatus(item.StatusLeave)}
                            </View>

                            <Text
                                style={[
                                    styleSheets.text,
                                    styles.styTxtLbStatus,
                                    {
                                        color: colorStatusView
                                            ? Vnr_Function.convertTextToColor(colorStatusView)
                                            : Colors.gray_10
                                    }
                                ]}
                            >
                                {translate('Att_BusinessTrip')}
                            </Text>
                        </View>

                        <Text
                            style={[
                                styleSheets.lable,
                                styles.styTxtVlStatus,
                                {
                                    color: colorStatusView
                                        ? Vnr_Function.convertTextToColor(colorStatusView)
                                        : Colors.gray_10
                                }
                            ]}
                        >
                            {item.StatusLeaveView}
                        </Text>
                    </View>

                    <View style={[stylesScreenDetailV2.styItemContent, styles.styVeStContent, styles.styNoBorder]}>
                        <View style={stylesScreenDetailV2.viewLable}>
                            <VnrText
                                style={[styleSheets.lable, { textAlign: 'left' }]}
                                i18nKey={'BusinessTravelType'}
                            />
                        </View>
                        <View style={stylesScreenDetailV2.styViewValue}>
                            <Text style={{ ...styleSheets.text, ...stylesScreenDetailV2.styTextValueInfo }}>
                                {item.BusinessTravelName}
                            </Text>
                        </View>
                    </View>

                    <View style={[stylesScreenDetailV2.styItemContent, styles.styVeStContent]}>
                        <View style={stylesScreenDetailV2.viewLable}>
                            <VnrText style={[styleSheets.lable, { textAlign: 'left' }]} i18nKey={'HRM_Sys_TimeRange'} />
                        </View>
                        <View style={stylesScreenDetailV2.styViewValue}>
                            <Text style={{ ...styleSheets.text, ...stylesScreenDetailV2.styTextValueInfo }}>
                                {`${Vnr_Function.mathRoundNumber(item.LeaveDays)} ${translate('E_DAY_LOWERCASE')}`}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.styVeMore}>
                        <IconMoreHorizontal size={Size.iconSize} color={Colors.gray_8} />
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
                <View style={styles.styBtnDetail}>
                    <View
                        style={[
                            styles.styVeStatus,
                            {
                                backgroundColor: bgStatusView
                                    ? Vnr_Function.convertTextToColor(bgStatusView)
                                    : Colors.white
                            }
                        ]}
                    >
                        <View style={styles.styTopStatus}>
                            <View
                                style={[
                                    styles.styTopIcon,
                                    {
                                        backgroundColor: colorStatusView
                                            ? Vnr_Function.convertTextToColor(colorStatusView)
                                            : Colors.gray_10
                                    }
                                ]}
                            >
                                {this.renderIconStatus(item.StatusLeave)}
                            </View>

                            <Text
                                style={[
                                    styleSheets.text,
                                    styles.styTxtLbStatus,
                                    {
                                        color: colorStatusView
                                            ? Vnr_Function.convertTextToColor(colorStatusView)
                                            : Colors.gray_10
                                    }
                                ]}
                            >
                                {translate('HRM_LeaveDayRegister')}
                            </Text>
                        </View>

                        <Text
                            style={[
                                styleSheets.lable,
                                styles.styTxtVlStatus,
                                {
                                    color: colorStatusView
                                        ? Vnr_Function.convertTextToColor(colorStatusView)
                                        : Colors.gray_10
                                }
                            ]}
                        >
                            {item.StatusLeaveView}
                        </Text>
                    </View>

                    <View style={[stylesScreenDetailV2.styItemContent, styles.styVeStContent, styles.styNoBorder]}>
                        <View style={stylesScreenDetailV2.viewLable}>
                            <VnrText
                                style={[styleSheets.lable, { textAlign: 'left' }]}
                                i18nKey={'HRM_PortalApp_Workday_LeaveDayType'}
                            />
                        </View>
                        <View style={stylesScreenDetailV2.styViewValue}>
                            <Text style={{ ...styleSheets.text, ...stylesScreenDetailV2.styTextValueInfo }}>
                                {item.LeavedayTypeName}
                            </Text>
                        </View>
                    </View>

                    <View style={[stylesScreenDetailV2.styItemContent, styles.styVeStContent]}>
                        <View style={stylesScreenDetailV2.viewLable}>
                            <VnrText style={[styleSheets.lable, { textAlign: 'left' }]} i18nKey={'HRM_Sys_TimeRange'} />
                        </View>
                        <View style={stylesScreenDetailV2.styViewValue}>
                            <Text style={{ ...styleSheets.text, ...stylesScreenDetailV2.styTextValueInfo }}>
                                {`${Vnr_Function.mathRoundNumber(item.LeaveDays)} ${item.LeavedayTypeCode}`}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.styVeMore}>
                        <IconMoreHorizontal size={Size.iconSize} color={Colors.gray_8} />
                    </View>
                </View>
            );
        });
    };

    renderTamscanlogRegister = _listTamscanlogRegister => {
        return _listTamscanlogRegister.map(item => {
            let colorStatusView = null,
                bgStatusView = null;

            if (item.itemStatus) {
                const { colorStatus, borderStatus, bgStatus } = item.itemStatus;
                colorStatusView = colorStatus ? colorStatus : null;
                bgStatusView = bgStatus ? bgStatus : null;
            }
            return (
                <View style={styles.styBtnDetail}>
                    <View
                        style={[
                            styles.styVeStatus,
                            {
                                backgroundColor: bgStatusView
                                    ? Vnr_Function.convertTextToColor(bgStatusView)
                                    : Colors.white
                            }
                        ]}
                    >
                        <View style={styles.styTopStatus}>
                            <View
                                style={[
                                    styles.styTopIcon,
                                    {
                                        backgroundColor: colorStatusView
                                            ? Vnr_Function.convertTextToColor(colorStatusView)
                                            : Colors.gray_10
                                    }
                                ]}
                            >
                                {this.renderIconStatus(item.Status)}
                            </View>

                            <Text
                                style={[
                                    styleSheets.text,
                                    styles.styTxtLbStatus,
                                    {
                                        color: colorStatusView
                                            ? Vnr_Function.convertTextToColor(colorStatusView)
                                            : Colors.gray_10
                                    }
                                ]}
                            >
                                {translate('HRM_AddInOut')}
                            </Text>
                        </View>

                        <Text
                            style={[
                                styleSheets.lable,
                                styles.styTxtVlStatus,
                                {
                                    color: colorStatusView
                                        ? Vnr_Function.convertTextToColor(colorStatusView)
                                        : Colors.gray_10
                                }
                            ]}
                        >
                            {item.StatusView}
                        </Text>
                    </View>

                    <View style={[stylesScreenDetailV2.styItemContent, styles.styVeStContent, styles.styNoBorder]}>
                        <View style={stylesScreenDetailV2.viewLable}>
                            <VnrText
                                style={[styleSheets.lable, { textAlign: 'left' }]}
                                i18nKey={'HRM_Attendance_Type'}
                            />
                        </View>
                        <View style={stylesScreenDetailV2.styViewValue}>
                            <Text style={{ ...styleSheets.text, ...stylesScreenDetailV2.styTextValueInfo }}>
                                {item.TypeTamscanlogRegisterView}
                            </Text>
                        </View>
                    </View>

                    <View style={[stylesScreenDetailV2.styItemContent, styles.styVeStContent]}>
                        <View style={stylesScreenDetailV2.viewLable}>
                            <VnrText style={[styleSheets.lable, { textAlign: 'left' }]} i18nKey={'HRM_Sys_TimeRange'} />
                        </View>
                        <View style={stylesScreenDetailV2.styViewValue}>
                            <Text style={{ ...styleSheets.text, ...stylesScreenDetailV2.styTextValueInfo }}>
                                {item.TimeLog ? moment(item.TimeLog).format('HH:mm') : ''}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.styVeMore}>
                        <IconMoreHorizontal size={Size.iconSize} color={Colors.gray_8} />
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
                <View style={styles.styBtnDetail}>
                    <View
                        style={[
                            styles.styVeStatus,
                            {
                                backgroundColor: bgStatusView
                                    ? Vnr_Function.convertTextToColor(bgStatusView)
                                    : Colors.white
                            }
                        ]}
                    >
                        <View style={styles.styTopStatus}>
                            <View
                                style={[
                                    styles.styTopIcon,
                                    {
                                        backgroundColor: colorStatusView
                                            ? Vnr_Function.convertTextToColor(colorStatusView)
                                            : Colors.gray_10
                                    }
                                ]}
                            >
                                {this.renderIconStatus(item.StatusOvertime)}
                            </View>

                            <Text
                                style={[
                                    styleSheets.text,
                                    styles.styTxtLbStatus,
                                    {
                                        color: colorStatusView
                                            ? Vnr_Function.convertTextToColor(colorStatusView)
                                            : Colors.gray_10
                                    }
                                ]}
                            >
                                {translate('HRM_OvertimeRegister')}
                            </Text>
                        </View>

                        <Text
                            style={[
                                styleSheets.lable,
                                styles.styTxtVlStatus,
                                {
                                    color: colorStatusView
                                        ? Vnr_Function.convertTextToColor(colorStatusView)
                                        : Colors.gray_10
                                }
                            ]}
                        >
                            {item.StatusOvertimeView}
                        </Text>
                    </View>

                    <View style={[stylesScreenDetailV2.styItemContent, styles.styVeStContent, styles.styNoBorder]}>
                        <View style={stylesScreenDetailV2.viewLable}>
                            <VnrText style={[styleSheets.lable, { textAlign: 'left' }]} i18nKey={'OvertimeTypeName'} />
                        </View>
                        <View style={stylesScreenDetailV2.styViewValue}>
                            <Text style={{ ...styleSheets.text, ...stylesScreenDetailV2.styTextValueInfo }}>
                                {item.OvertimeTypeName}
                            </Text>
                        </View>
                    </View>

                    <View style={[stylesScreenDetailV2.styItemContent, styles.styVeStContent]}>
                        <View style={stylesScreenDetailV2.viewLable}>
                            <VnrText style={[styleSheets.lable, { textAlign: 'left' }]} i18nKey={'HRM_Sys_TimeRange'} />
                        </View>
                        <View style={stylesScreenDetailV2.styViewValue}>
                            <Text style={{ ...styleSheets.text, ...stylesScreenDetailV2.styTextValueInfo }}>
                                {`${Vnr_Function.mathRoundNumber(item.OvertimeHours)} ${translate(
                                    'E_IMPORT_FILE_HOUR'
                                )}`}
                            </Text>
                        </View>
                    </View>

                    <View style={styles.styVeMore}>
                        <IconMoreHorizontal size={Size.iconSize} color={Colors.gray_8} />
                    </View>
                </View>
            );
        });
    };

    renderDetailItem = item => {
        console.log(item, 'itemitemitemitem');
        // check MissIn MissOut, check Late, check early
        let isMissIn = false,
            isMissOut = false,
            isLate = false,
            isEarly = false;

        let titleType = translate(item.Type);

        if (moment(item.WorkDate).isSameOrBefore(new Date(), 'date')) {
            if (item.Type == 'E_MISS_IN_OUT') {
                isMissIn = true;
                isMissOut = true;
            } else {
                if (item.Type == 'E_MISS_IN' && item.ShiftID != null) {
                    isMissIn = true;
                }

                if (item.Type == 'E_MISS_OUT' && item.ShiftID != null) {
                    isMissOut = true;
                }
            }

            if (item.LateDuration1) {
                isLate = true;
            }

            if (item.EarlyDuration1) {
                isEarly = true;
            }
        } else {
            item.isFuture = true;
        }
        //------------------------------------------------//

        let contentHrWork = <View />,
            titleLateEarly = '',
            stylesTextEr = {
                ...styleSheets.lable,
                ...styles.styEgWork
            };

        if (isMissIn || isMissOut || isLate || isEarly) {
            stylesTextEr = {
                ...stylesTextEr,
                ...{ color: Colors.red }
            };
        }

        if (isMissIn || isMissOut) {
            titleType = translate(item.Type);
        } else if (isLate || isEarly) {
            titleType = translate('E_LATEEARLY');
        }

        if (isLate && isEarly) {
            titleLateEarly = `${translate('HRM_Attendance_LateIn')} (${item.LateDuration1} ${translate(
                'HRM_Attendance_EarlyOut'
            )}, ${item.EarlyDuration1} ${translate('E_IMPORT_FILE_MINUTE')})`;
        } else if (isLate) {
            titleLateEarly = `${translate('HRM_Attendance_LateIn')} (${item.LateDuration1} ${translate(
                'HRM_Attendance_EarlyOut'
            )})`;
        } else if (isEarly) {
            titleLateEarly = `${translate('HRM_Attendance_LateIn')} (${item.EarlyDuration1} ${translate(
                'E_IMPORT_FILE_MINUTE'
            )})`;
        }

        console.log(item.Type, 'item.Type');

        contentHrWork = (
            <View style={styles.styHeaderWork}>
                {item.Type == 'E_NORMAL' && !item.InTime1 && !item.OutTime1 ? (
                    <Text style={[styleSheets.lable, styles.styEgWork]}>
                        <Text style={stylesTextEr}>{titleType}</Text>
                    </Text>
                ) : (
                    <Text style={[styleSheets.lable, styles.styEgWork]}>
                        <Text style={stylesTextEr}>{titleType}</Text>
                        <Text style={stylesTextEr}>
                            {` ${item.InTime1 ? moment(item.InTime1).format('HH:mm') : '??'} `}
                        </Text>

                        <Text style={stylesTextEr}>-</Text>

                        <Text style={stylesTextEr}>
                            {` ${item.OutTime1 ? moment(item.OutTime1).format('HH:mm') : '??'} `}
                        </Text>
                    </Text>
                )}

                <Text numberOfLines={1} style={[styleSheets.lable, styles.styEgAtt]}>
                    {`${translate('HRM_Common_WorkHours')}: ${Vnr_Function.mathRoundNumber(item.WorkHours)} ${translate(
                        'E_IMPORT_FILE_HOUR'
                    )} ${titleLateEarly}`}
                </Text>
            </View>
        );

        return (
            <Modal
                onBackButtonPress={() => this.hideModalDetail()}
                isVisible={true}
                onBackdropPress={() => this.hideModalDetail()}
                customBackdrop={
                    <TouchableWithoutFeedback onPress={() => this.hideModalDetail()}>
                        <View
                            style={{
                                flex: 1,
                                backgroundColor: Colors.black,
                                opacity: 0.5
                            }}
                        />
                    </TouchableWithoutFeedback>
                }
                style={{
                    margin: 0
                }}
            >
                <View style={styles.styModalDetailItem}>
                    <SafeAreaView {...styleSafeAreaView}>
                        <View style={styles.headerCloseModal}>
                            <View style={styles.titleModal}>
                                {item.ShiftID && (
                                    <VnrText
                                        numberOfLines={1}
                                        style={[styleSheets.lable, styles.titleModal__text]}
                                        value={`${item.DayOffWeek} ${item.WorkDateView} (${item.ShiftName})`}
                                    />
                                )}
                            </View>

                            <TouchableOpacity onPress={() => this.hideModalDetail()}>
                                <IconCancel size={Size.iconSize} color={Colors.gray_10} />
                            </TouchableOpacity>
                        </View>

                        {contentHrWork}

                        {this.rowAction && Array.isArray(this.rowAction) && this.rowAction.length > 0 && (
                            <View style={styles.stylstBtnRest}>
                                <ScrollView horizontal style={styles.styCrBtnRest}>
                                    {this.rowAction.map(action => (
                                        <TouchableOpacity
                                            style={styles.styBtnRest}
                                            onPress={() => {
                                                this.hideModalDetail();
                                                action.onPress(item, isMissIn, isMissOut);
                                            }}
                                        >
                                            <Image source={action.icon} style={styles.styBtnRestImg} />
                                            <Text numberOfLines={1} style={[styleSheets.lable, styles.styEgAtt]}>
                                                {action.title}
                                            </Text>
                                        </TouchableOpacity>
                                    ))}
                                </ScrollView>
                            </View>
                        )}

                        <View style={styles.styLstDetail}>
                            <ScrollView style={styles.styScDetail}>
                                {item.ListLeaveday &&
                                    item.ListLeaveday.length > 0 &&
                                    this.renderListLeaveDay(item.ListLeaveday)}

                                {item.ListOvertime &&
                                    item.ListOvertime.length > 0 &&
                                    this.renderListOvertime(item.ListOvertime)}

                                {item.ListForgeLeaveday &&
                                    item.ListForgeLeaveday.length > 0 &&
                                    this.renderListForgeLeaveday(item.ListForgeLeaveday)}

                                {item.ListBusinessTravel &&
                                    item.ListBusinessTravel.length > 0 &&
                                    this.renderListBusinessTravel(item.ListBusinessTravel)}

                                {item.ListTamscanlogRegister &&
                                    item.ListTamscanlogRegister.length > 0 &&
                                    this.renderTamscanlogRegister(item.ListTamscanlogRegister)}

                                {item.ListAllowLateEarly &&
                                    item.ListAllowLateEarly.length > 0 &&
                                    this.renderListAllowLateEarly(item.ListAllowLateEarly)}
                            </ScrollView>
                        </View>
                    </SafeAreaView>
                </View>
            </Modal>
        );
    };

    hideModalUpdateInOut = () => {
        this.setState({ isOnUpdateInOut: false, dataItemForAddInOut: null });
    };

    render() {
        const {
            listDataViolate,
            listDataMissInOut,
            listDataLateEarly,
            listDataInvalid,
            listDataLeaveDay,
            listDataOvertime,
            listDataTravel,
            listDataTamscanlog,
            listDataAllowLateEarly,
            isEmptyData,
            dataModalItem,
            daySelected,
            listMarked,
            dataCalendar,
            calendarToggled,
            refreshing,
            minDate,
            maxDate,
            dataItemForAddInOut,
            isOnUpdateInOut,
            isLoading,
            isShowModalSubmit
        } = this.state;

        console.log(dataCalendar, 'dataCalendar');

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styles.styContainer}>
                    <Agenda
                        ref={refAgenda => (this.refAgenda = refAgenda)}
                        testID={testIDs.agenda.CONTAINER}
                        items={dataCalendar}
                        onCalendarToggled={calendarOpened => {
                            this.setState({
                                calendarToggled: calendarOpened
                            });
                        }}
                        //dayComponent={this.renderDayCustom}
                        onVisibleMonthsChange={months => {
                            calendarToggled &&
                                setTimeout(() => {
                                    this.onChangeMonth(months[1]);
                                }, 200);
                        }}
                        selected={daySelected}
                        renderItem={this.renderItem.bind(this)}
                        renderEmptyDate={this.renderEmptyDate.bind(this)}
                        renderDay={(day, item) => {
                            return <View />;
                        }}
                        //rowHasChanged={this.rowHasChanged.bind(this)}
                        onDayPress={day => this.onDayPress(day)}
                        renderEmptyData={this.renderEmptyDate.bind(this)}
                        onDayChange={day => this.onDayPress(day)}
                        // markingType={'multi-dot'}
                        markingType={'custom'}
                        markedDates={listMarked}
                        displayLoadingIndicator={isLoading}
                        //pastScrollRange={50}
                        // Max amount of months allowed to scroll to the future. Default = 50
                        //futureScrollRange={50}

                        theme={{
                            backgroundColor: Colors.gray_3,
                            textSectionTitleDisabledColor: '#d9e1e8',
                            selectedDayBackgroundColor: Colors.primary,
                            todayTextColor: Colors.primary,
                            dotColor: Colors.primary,
                            indicatorColor: Colors.primary,
                            dayTextColor: Colors.gray_10
                            // textDisabledColor : Colors.red
                        }}
                        refreshing={refreshing}
                        minDate={minDate}
                        maxDate={maxDate}
                        disableAllTouchEventsForDisabledDays={true}
                        // refreshControl={
                        //   <RefreshControl
                        //     onRefresh={() => this.pullToRefresh()}
                        //     refreshing={refreshing}
                        //     size="large"
                        //     tintColor={Colors.primary}
                        //   />
                        // }
                        style={{ flex: 1, marginBottom: Size.deviceheight * 0.13 }}
                    />

                    {this.renderViewTopWorkDay()}

                    {dataModalItem && this.renderDetailItem(dataModalItem)}

                    <Modal
                        onBackButtonPress={() => this.hideModalSubmit()}
                        isVisible={isShowModalSubmit}
                        onBackdropPress={() => this.hideModalSubmit()}
                        customBackdrop={
                            <TouchableWithoutFeedback onPress={() => this.hideModalSubmit()}>
                                <View
                                    style={{
                                        flex: 1,
                                        backgroundColor: Colors.black,
                                        opacity: 0.5
                                    }}
                                />
                            </TouchableWithoutFeedback>
                        }
                        style={{
                            margin: 0
                        }}
                    >
                        <View style={[styles.styModalDetailItem, { height: Size.deviceheight / 2 }]}>
                            <SafeAreaView {...styleSafeAreaView}>
                                <View style={styles.headerCloseModal}>
                                    <View style={styles.titleModal}>
                                        <VnrText
                                            numberOfLines={1}
                                            style={[styleSheets.lable, styles.titleModal__text]}
                                            i18nKey={'HRM_PortalApp_Submit_Work'}
                                        />
                                    </View>

                                    <TouchableOpacity onPress={() => this.hideModalSubmit()}>
                                        <IconCancel size={Size.iconSize} color={Colors.gray_10} />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView style={styles.styCrBtnSubRest}>
                                    {this.rowAction &&
                                        this.rowAction.map(action => (
                                            <TouchableOpacity
                                                style={styles.styBtnSub}
                                                onPress={() => {
                                                    this.hideModalSubmit();
                                                    action.onPress(null);
                                                }}
                                            >
                                                <Image source={action.icon} style={styles.styBtnSubImg} />
                                                <Text numberOfLines={1} style={[styleSheets.lable, styles.styEgAtt]}>
                                                    {action.title}
                                                </Text>
                                            </TouchableOpacity>
                                        ))}
                                </ScrollView>
                            </SafeAreaView>
                        </View>
                    </Modal>

                    {dataItemForAddInOut && dataItemForAddInOut && (
                        <ModalAddInOut
                            reload={this.refreshList}
                            workDayItem={dataItemForAddInOut}
                            isOnUpdateInOut={isOnUpdateInOut}
                            hideModalUpdateInOut={this.hideModalUpdateInOut}
                        />
                    )}
                </View>
            </SafeAreaView>
        );
    }
}

const sizeViewBtnAdd = Size.iconSizeHeader + 36 + Size.defineSpace,
    sizeBtnAdd = Size.iconSizeHeader + 36;

const WIDTH_MODAL = Size.deviceWidth * 0.65,
    HEIGHT_ITEM = 40,
    HEIGHT_BNT = 40,
    HEIGHT_CONTENT = HEIGHT_ITEM * 5 + HEIGHT_BNT + Size.defineSpace * 2,
    HEIGHT_BUTTON_FILTER = Size.heightInput - 5,
    LENGTH_GET_YEAR = 30,
    LENGTH_LAST_YAER_DISPLAY = 2;

const styles = StyleSheet.create({
    styViewModal: {
        position: 'absolute',
        bottom: Size.deviceheight * 0.1 + Size.defineSpace,
        left: Size.defineHalfSpace,
        width: WIDTH_MODAL
    },
    container: {
        flex: 1
    },
    styHdModal: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-between',

        paddingHorizontal: Size.defineHalfSpace,
        paddingVertical: Size.defineHalfSpace,

        backgroundColor: Colors.gray_8
    },
    styLstModal: {
        width: '100%',
        backgroundColor: Colors.white
    },
    styBtnModal: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: Size.defineSpace,
        height: HEIGHT_BUTTON_FILTER,

        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,

        alignItems: 'center',
        justifyContent: 'space-between'
    },
    bntCancel: {
        flex: 1,
        height: 40,
        borderRadius: 15,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bntApprove: {
        flex: 1,
        height: 40,
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styleViewBntApprove: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

        height: HEIGHT_BUTTON_FILTER,
        paddingHorizontal: Size.defineHalfSpace,
        marginTop: Size.defineHalfSpace,

        borderRadius: 4,

        backgroundColor: Colors.white
    },
    styTextBntApprove: {
        fontSize: Size.text + 2,
        fontWeight: '500',
        color: Colors.primary
    },

    // style Modal detail
    headerCloseModal: {
        paddingVertical: Size.defineHalfSpace,
        paddingHorizontal: Size.defineHalfSpace,
        // marginBottom: 15,
        justifyContent: 'space-between',
        alignItems: 'center',

        flexDirection: 'row',

        backgroundColor: Colors.gray_2
        // borderBottomColor: Colors.borderColor,
        // borderBottomWidth: 1,
    },

    titleModal: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    titleModal__text: {
        fontWeight: '600',
        fontSize: Size.text + 2
    },
    styModalDetailItem: {
        backgroundColor: Colors.white,
        height: Size.deviceheight * 0.8,
        width: Size.deviceWidth,
        position: 'absolute',
        bottom: 0
    },
    styContentDetail: {
        flex: 1
    },

    styHeaderWork: {
        paddingVertical: Size.defineHalfSpace,
        paddingHorizontal: Size.defineHalfSpace,
        justifyContent: 'space-between',
        alignItems: 'center',

        flexDirection: 'row',
        backgroundColor: Colors.white
    },
    styEgWork: {
        fontSize: Size.text - 1
    },
    stylstBtnRest: {
        width: Size.deviceWidth,
        paddingHorizontal: Size.defineHalfSpace,
        paddingVertical: Size.defineSpace,

        borderTopWidth: 0.5,
        borderBottomWidth: 0.5,
        borderTopColor: Colors.gray_5,
        borderBottomColor: Colors.gray_5
    },
    styCrBtnRest: {
        flexGrow: 1
    },
    styBtnRest: {
        alignItems: 'center',
        marginRight: Size.defineSpace
    },
    styEgAtt: {
        color: Colors.black
    },
    styBtnRestImg: {
        width: Size.deviceWidth * 0.15,
        height: Size.deviceWidth * 0.15,
        maxWidth: 100,

        marginBottom: 5,

        borderRadius: (Size.deviceWidth * 0.15) / 2
    },
    styCrBtnSubRest: {
        flexGrow: 1,
        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineSpace
    },
    styBtnSub: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: Size.defineSpace
    },
    styBtnSubImg: {
        width: Size.iconSize * 1.5,
        height: Size.iconSize * 1.5,

        marginRight: Size.defineSpace,

        borderRadius: (Size.iconSize * 1.5) / 2
    },

    styLstDetail: {
        flex: 1
    },
    styScDetail: {
        flex: 1,
        padding: Size.defineHalfSpace
    },
    styBtnDetail: {
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        borderRadius: 4
    },
    styVeStatus: {
        alignItems: 'center',

        flexDirection: 'row',
        justifyContent: 'space-between',

        backgroundColor: Colors.green_1,

        padding: Size.defineHalfSpace,
        paddingVertical: 5,

        borderTopLeftRadius: 4,
        borderTopRightRadius: 4
    },
    styTopStatus: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    styTopIcon: {
        width: Size.text + 2,
        height: Size.text + 2,
        borderRadius: (Size.text + 2) / 2,
        backgroundColor: Colors.green,

        justifyContent: 'center',
        alignItems: 'center'
    },
    styTxtLbStatus: {
        marginLeft: 4,
        color: Colors.green
    },
    styTxtVlStatus: {
        color: Colors.green,
        fontWeight: '600'
    },
    styVeStContent: {
        marginHorizontal: Size.defineHalfSpace,
        paddingVertical: Size.defineHalfSpace
    },
    styNoBorder: {
        borderTopWidth: 0
    },
    styVeMore: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    // -------------- //

    styContainer: {
        flex: 1,
        backgroundColor: Colors.gray_2,
        zIndex: 3
    },

    item: {
        backgroundColor: 'white',
        flex: 1,
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        marginTop: 17
    },
    emptyDate: {
        flex: 1
    },
    // Buttom Workday
    // styViewBtnAdd: {
    //   position: 'absolute',
    //   height: 1,
    //   width: sizeBtnAdd + Size.defineHalfSpace,

    //   top: -(Size.defineHalfSpace + 1),
    //   backgroundColor: Colors.white,
    //   right: Size.defineSpace + (Size.defineHalfSpace / 2),

    // },
    // styViewBtnGray: {
    //   position: 'absolute',
    //   height: (sizeViewBtnAdd / 2) + Size.defineHalfSpace - 1,
    //   width: sizeViewBtnAdd,
    //   justifyContent: 'center',
    //   alignItems: 'center',
    //   top: -(Size.defineHalfSpace + (sizeViewBtnAdd / 2) + Size.defineHalfSpace),
    //   backgroundColor: Colors.gray_3,
    //   right: Size.defineSpace,

    // },
    styBtnAdd: {
        position: 'absolute',
        top: -(Size.defineSpace + sizeViewBtnAdd / 2 - Size.defineSpace),
        right: Size.defineSpace + Size.defineSpace / 2,
        height: sizeBtnAdd,
        width: sizeBtnAdd,
        borderRadius: sizeBtnAdd / 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary
    },
    styViewTopWorkDay: {
        width: '100%',
        height: Size.deviceheight * 0.13,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        backgroundColor: Colors.white,

        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace,
        borderTopColor: Colors.gray_5,
        borderTopWidth: 1,
        zIndex: 1
    },
    styLeftAvatar: {
        flex: 2,
        justifyContent: 'center',
        marginRight: Size.defineSpace,

        borderRightWidth: 0.5,
        borderRightColor: Colors.gray_5
    },
    stySizeIcon: {
        width: Size.deviceWidth * 0.12,
        height: Size.deviceWidth * 0.12,
        borderRadius: (Size.deviceWidth * 0.12) / 2,
        maxWidth: 100,
        maxHeight: 100,
        backgroundColor: Colors.gray_3,

        justifyContent: 'center',
        alignItems: 'center'
    },
    styBoxRight: {
        flex: 3,
        justifyContent: 'center'
    },
    styBoxCenter: {
        flex: 5,
        justifyContent: 'center'
    },
    styBoxButtonDetail: {
        alignItems: 'flex-end',
        height: 27
    },
    styBoxLableView: {
        flex: 1
    },
    styboxLable: {
        // fontSize: Size.text + 1,
        // fontWeight: Platform.OS =='ios' ? '500' : '600',
        // color: Colors.gray_10
    },
    styboxValue: {
        // fontSize: Size.text + 2,
        fontWeight: Platform.OS == 'ios' ? '600' : '700',
        color: Colors.black,
        marginLeft: Size.defineSpace
    },
    styBox: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 5
    },
    styBoxLable: {
        flex: 1
    },
    boxTimeTop: {
        alignItems: 'center'
    },
    txtTimeStyle: {
        fontSize: Size.text + 4,
        color: Colors.gray_10
    },
    txtLableTimeStyle: {
        color: Colors.gray_10
    }
});

const mapStateToProps = state => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(
    mapStateToProps,
    null
)(WorkDayV2);
