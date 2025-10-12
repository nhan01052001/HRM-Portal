import React, { Component } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import moment from 'moment';
import Vnr_Function from '../../../../utils/Vnr_Function';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../constants/styleConfig';
import { Image, StyleSheet, View, TouchableOpacity, ScrollView, Platform, Animated } from 'react-native';
import { ExpandableCalendar, AgendaList, CalendarProvider } from '../../../../node_modules/react-native-calendars';
import DrawerServices from '../../../../utils/DrawerServices';
import VnrText from '../../../../components/VnrText/VnrText';
import { EnumName, EnumStatus } from '../../../../assets/constant';
import EmptyData from '../../../../components/EmptyData/EmptyData';
import { getDataLocal } from '../../../../factories/LocalData';
import { EnumTask } from '../../../../assets/constant';
import VnrIndeterminate from '../../../../components/VnrLoading/VnrIndeterminate';
import { connect } from 'react-redux';
import { startTask } from '../../../../factories/BackGroundTask';
import AttWorkDayCalendarListItem from './AttWorkDayCalendarListItem';
import { Text } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native';
import { ConfigField } from '../../../../assets/configProject/ConfigField';
import { IconCancel, IconHome, IconPlus, IconSearch } from '../../../../constants/Icons';
import Modal from 'react-native-modal';
import { translate } from '../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../assets/configProject/PermissionForAppMobile';
import Vnr_Services from '../../../../utils/Vnr_Services';
import AttWorkdayFilter from './AttWorkdayFilter';
import VnrLoadingScreen from '../../../../components/VnrLoading/VnrLoadingScreen';
import AttSubmitTamScanLogRegisterAddOrEdit from '../attTamScanLogRegister/attSubmitTamScanLogRegister/AttSubmitTamScanLogRegisterAddOrEdit';
import AttSubmitTakeLeaveDayAddOrEdit from '../attTakeLeaveDay/attSubmitTakeLeaveDay/AttSubmitTakeLeaveDayAddOrEdit';
import AttSubmitWorkingOvertimeAddOrEdit from '../attWorkingOvertime/attSubmitWorkingOvertime/AttSubmitWorkingOvertimeAddOrEdit';
import AttSubmitTakeBusinessTripAddOrEdit from '../attTakeBusinessTrip/attSubmitTakeBusinessTrip/AttSubmitTakeBusinessTripAddOrEdit';
import HttpService from '../../../../utils/HttpService';
import AttWorkDayCalendarListItemTwoShift from './AttWorkDayCalendarListItemTwoShift';
import AttSubmitShiftChangeAddOrEdit from '../attRosterShiftChange/attSubmitShiftChange/AttSubmitShiftChangeAddOrEdit';
import AttSubmitTakeLateEarlyAllowedAddOrEdit from '../attTakeLateEarlyAllowed/attSubmitTakeLateEarlyAllowed/AttSubmitTakeLateEarlyAllowedAddOrEdit';

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
    expandableCalendar: {
        CONTAINER: 'expandableCalendar'
    },
    weekCalendar: { CONTAINER: 'weekCalendar' },
    theme: {
        CONTAINER: {
            backgroundColor: Colors.gray_3,
            textSectionTitleDisabledColor: '#d9e1e8',
            selectedDayBackgroundColor: Colors.primary,
            todayTextColor: Colors.primary,
            dotColor: Colors.primary,
            indicatorColor: Colors.primary,
            dayTextColor: Colors.gray_10,
            arrowColor: Colors.gray_9,
            textDayFontFamily: Platform.OS == 'android' ? 'Roboto-Regular' : 'AvenirNext-Regular',
            textMonthFontFamily: Platform.OS == 'android' ? 'Roboto-Regular' : 'AvenirNext-Regular',
            textDayHeaderFontFamily: Platform.OS == 'android' ? 'Roboto-Regular' : 'AvenirNext-Regular',
            'stylesheet.expandable.main': {
                week: {
                    marginTop: 7,
                    marginBottom: 7,
                    paddingRight: 0,
                    paddingLeft: 0,
                    flexDirection: 'row',
                    justifyContent: 'space-around'
                }
            },
            'stylesheet.calendar.header': {
                monthText: {
                    ...styleSheets.text,
                    width: 'auto',
                    textAlign: 'center',
                    fontSize: Size.text + 1,
                    fontWeight: Platform.OS == 'ios' ? '500' : '600',
                    color: Colors.gray_10
                },
                header: {
                    flexDirection: 'row',
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: Colors.gray_3,
                    width: 'auto',
                    height: 40,
                    borderRadius: 20,
                    alignSelf: 'center',
                    marginTop: Size.defineHalfSpace,
                    paddingHorizontal: Platform.OS == 'ios' ? Size.defineHalfSpace : 0
                }
            },
            'stylesheet.calendar-list.main': {
                staticHeader: {
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    top: 0,
                    backgroundColor: Colors.white,
                    paddingHorizontal: 0
                },
                calendar: {
                    paddingLeft: 0,
                    paddingRight: 0
                }
            }
        }
    },
    customContainerMarked: {
        container: {
            backgroundColor: Colors.gray_2,
            borderRadius: 4,
            paddingLeft: 0,
            paddingRight: 0
        }
    }
};

class AttWorkDayCalendar extends Component {
    constructor(porps) {
        super(porps);

        this.state = {
            weekView: false,
            dataCalendar: [],
            dataCalendarBackup: {},
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
                listDataTamscanlog: {}
            },
            isVisibleModalFilter: false,
            isLoading: true,
            isGetOT: true,
            isGetLD: true,
            isGetRT: true,
            monthYearRange: null,
            daySelected: moment().format('YYYY-MM-DD'),
            cutOffDuration: {
                data: null,
                value: null
            },
            calendarToggled: false,
            keyQuery: EnumName.E_PRIMARY_DATA,
            dataModalItem: null,
            isDurationCommand: false,
            refreshing: false,
            isLoadingHeader: true,
            minDate: moment(new Date()).startOf('month').format('YYYY-MM-DD'),
            maxDate: moment(new Date()).endOf('month').format('YYYY-MM-DD'),
            isOnUpdateInOut: false,
            dataItemForAddInOut: null,
            dataItemForAddInOutTemp: null,
            isWatingAddOut: false, // tham số hiển thị modal bổ sung dữ liêu Out sau khi bổ sung In xong,
            isMissingInoutFilter: false,
            isShowModalSubmit: {
                visible: false,
                dataWorkdayItem: null
            },
            isVisibleListProfileTimeSheetMaster: false,
            disableBtnViewDetail: moment().date() !== 1
        };
        this.listItemOpenSwipeOut = {}; //[];
        this.oldIndexOpenSwipeOut = null;
        this.refAgenda = null;
        this.rowAction = null;
        this.refsworkdayFilter = null;
        this.scrollYAnimatedValue = new Animated.Value(0);
        this.scrollY = new Animated.Value(0);
        // ref Quên chấm công
        this.AttSubmitTamScanLogRegisterAddOrEdit = null;

        // ref Đk Ngày nghỉ
        this.AttSubmitTakeLeaveDayAddOrEdit = null;

        // ref Đi công tác
        this.AttSubmitTakeBusinessTripAddOrEdit = null;

        // ref Tăng ca
        this.AttSubmitWorkingOvertimeAddOrEdit = null;

        // ref đổi ca
        this.AttSubmitShiftChangeAddOrEdit = null;

        // Trễ sớm
        this.AttSubmitTakeLateEarlyAllowedAddOrEdit = null;

        this.onScrollEnd = this.debounce(this.onScrollEnd.bind(this), 100);
    }

    renderItem(item) {
        const { minDate, refreshing } = this.state;
        const index = minDate == item.section?.title,
            contentRemind = index ? this.renderRemind() : <View />;

        if (item && item.item !== null) {
            return (
                <View>
                    {index && contentRemind}
                    {item.item.IsHaveTwoShift ? (
                        <AttWorkDayCalendarListItemTwoShift dataItem={item.item} onPressContent={this.onPressContent} isRefreshList={refreshing} />
                    ) : (
                        <AttWorkDayCalendarListItem dataItem={item.item} onPressContent={this.onPressContent} isRefreshList={refreshing} />
                    )}
                </View>
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

    onDayPress = (dayChagne) => {
        const { daySelected, listMarked, listMarkedBackup, minDate, maxDate } = this.state;
        const date = {
            dateString: dayChagne,
            month: parseInt(moment(dayChagne).format('MM')),
            year: parseInt(moment(dayChagne).format('YYYY'))
        };

        if (listMarkedBackup[daySelected] && date.dateString !== daySelected)
            listMarked[daySelected] = { ...listMarkedBackup[daySelected] };
        else
            listMarked[daySelected] = {
                customStyles: {
                    ...testIDs.customContainerMarked,
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
                // currentDate: date,
                listMarked: listMarked
            },
            () => {
                if (
                    date.dateString != null &&
                    (moment(date.dateString) < moment(minDate) || moment(date.dateString) > moment(maxDate))
                ) {
                    this.onChangeMonth(date);
                }
            }
        );
    };

    onPressContent = (data) => {
        this.setState({
            isShowModalSubmit: {
                visible: true,
                dataWorkdayItem: data
            }
        });
    };

    renderEmptyDate() {
        return (
            <View style={styles.emptyDate}>
                <EmptyData messageEmptyData={'HRM_Sal_HoldSalary_NotData'} />
            </View>
        );
    }

    refreshList = () => {
        this.setState(
            {
                isLoading: true
            },
            () => {
                this.pullToRefresh();
            }
        );
    };

    pullToRefresh = () => {
        const { cutOffDuration, keyQuery } = this.state,
            _payload = {
                CutOffDurationID: cutOffDuration.value ? cutOffDuration.value.ID : null,
                keyQuery: keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA
            };

        startTask({
            keyTask: EnumTask.KT_AttWorkDayCalendar,
            payload: _payload
        });
    };

    GetCutOffDurationByMonthYear = (_dateString, _Month, _Year) => {
        // chay lazy loading
        startTask({
            keyTask: EnumTask.KT_AttWorkDayCalendar,
            payload: {
                Month: _Month,
                Year: _Year,
                keyQuery: EnumName.E_FILTER
            }
        });
    };

    onChangeMonth = (value) => {
        const { minDate, maxDate, cutOffDuration } = this.state;
        if (!value) {
            return;
        }

        let isCheckChangeMonth =
            value.dateString != null &&
            (moment(value.dateString) < moment(minDate) || moment(value.dateString) > moment(maxDate));
        // luu lai value thang hien tai
        if (isCheckChangeMonth) {
            const valueCutOff = cutOffDuration.data.find(
                (item) =>
                    moment(item.DateStart) <= moment(value.dateString) &&
                    moment(value.dateString) <= moment(item.DateEnd)
            );
            this.setState(
                {
                    minDate: valueCutOff ? moment(valueCutOff.DateStart).format('YYYY-MM-DD') : value.dateString,
                    maxDate: valueCutOff ? moment(valueCutOff.DateEnd).format('YYYY-MM-DD') : value.dateString,
                    monthYearRange: valueCutOff ? valueCutOff.MonthYear : null,
                    cutOffDuration: {
                        ...cutOffDuration,
                        value: valueCutOff ? valueCutOff : null
                    },
                    daySelected: value.dateString,
                    isRefreshList: !this.state.isRefreshList,
                    keyQuery: EnumName.E_FILTER,
                    isLoading: isCheckChangeMonth ? true : false,
                    disableBtnViewDetail: moment(value?.dateString).date() !== 1
                },
                () => {
                    Vnr_Function.delay(() => {
                        startTask({
                            keyTask: EnumTask.KT_AttWorkDayCalendar,
                            payload: {
                                CutOffDurationID: valueCutOff ? valueCutOff.ID : null,
                                keyQuery: EnumName.E_FILTER
                            }
                        });
                    }, 1000);
                }
            );
        }
    };

    componentDidMount() {
        this.generaRender();
    }

    paramsDefault = () => {
        const { params = {} } = this.props.navigation.state,
            { CutOffDurationID, CutOffDuration, businessType } =
                typeof params == 'object' ? params : JSON.parse(params);

        if (CutOffDurationID && CutOffDuration) {
            // Vào từ Notification
            return {
                businessType: businessType,
                CutOffDurationID: CutOffDurationID,
                daySelected: moment(CutOffDuration).format('YYYY-MM-DD')
            };
        } else {
            return params;
        }
    };

    generaRender = () => {
        let _rowAction = [];

        if (PermissionForAppMobile && PermissionForAppMobile.value) {
            const permission = PermissionForAppMobile.value;

            if (
                permission['New_Att_TamScanLogRegister_New_Index_WorkDay_btnCreate'] &&
                permission['New_Att_TamScanLogRegister_New_Index_WorkDay_btnCreate']['View']
            ) {
                _rowAction = [
                    ..._rowAction,
                    {
                        type: 'E_INOUT',
                        title: translate('HRM_AddInOut'),
                        icon: require('../../../../assets/images/GPS/fingerprint.png'),
                        isSheet: false,
                        onPress: (items) => {
                            if (this.AttSubmitTamScanLogRegisterAddOrEdit) {
                                if (items) {
                                    this.AttSubmitTamScanLogRegisterAddOrEdit.onShow({
                                        reload: this.refreshList,
                                        listItem: Array.isArray(items) ? items : [items]
                                    });
                                } else {
                                    this.AttSubmitTamScanLogRegisterAddOrEdit.onShow({
                                        reload: this.refreshList
                                    });
                                }
                            }
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
                        icon: require('../../../../assets/images/GPS/LateEarly.png'),
                        isSheet: false,
                        onPress: (items) => {
                            if (this.AttSubmitTakeLateEarlyAllowedAddOrEdit) {
                                if (items) {
                                    this.AttSubmitTakeLateEarlyAllowedAddOrEdit.onShow({
                                        reload: this.refreshList,
                                        listItem: Array.isArray(items) ? items : [items]
                                    });
                                } else {
                                    this.AttSubmitTakeLateEarlyAllowedAddOrEdit.onShow({
                                        reload: this.refreshList
                                    });
                                }
                            }
                            //   DrawerServices.navigate('AttSubmitLateEarlyAllowedAddOrEdit', {
                            //       workDayItem: items ? { ...item } : null,
                            //       reload: this.refreshList,
                            //       goBack: 'WorkDay'
                            //   });
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
                        icon: require('../../../../assets/images/GPS/LeaveDay.png'),
                        isSheet: false,
                        onPress: (items) => {
                            if (this.AttSubmitTakeLeaveDayAddOrEdit) {
                                if (items) {
                                    this.AttSubmitTakeLeaveDayAddOrEdit.onShow({
                                        reload: this.refreshList,
                                        listItem: Array.isArray(items) ? items : [items]
                                    });
                                } else {
                                    this.AttSubmitTakeLeaveDayAddOrEdit.onShow({
                                        reload: this.refreshList
                                    });
                                }
                            }
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
                        icon: require('../../../../assets/images/GPS/OT.png'),
                        isSheet: false,
                        onPress: (items) => {
                            if (this.AttSubmitWorkingOvertimeAddOrEdit) {
                                if (items) {
                                    this.AttSubmitWorkingOvertimeAddOrEdit.onShow({
                                        reload: this.refreshList,
                                        listItem: Array.isArray(items) ? items : [items]
                                    });
                                } else {
                                    this.AttSubmitWorkingOvertimeAddOrEdit.onShow({
                                        reload: this.refreshList
                                    });
                                }
                            }
                        }
                    }
                ];
            }

            // if (
            //     permission['New_Att_Overtime_New_Index_WorkDay_btnCreate'] &&
            //     permission['New_Att_Overtime_New_Index_WorkDay_btnCreate']['View']
            // ) {
            //     _rowAction = [
            //         ..._rowAction,
            //         {
            //             type: 'E_ROSTERSHIFTCHANGE',
            //             title: translate('HRM_PortalApp_ShiftChange_Register'),
            //             icon: require('../../../../assets/images/changeshfit.png'),
            //             isSheet: false,
            //             onPress: (items) => {
            //                 if (this.AttSubmitShiftChangeAddOrEdit) {
            //                     if (items) {
            //                         this.AttSubmitShiftChangeAddOrEdit.onShow({
            //                             reload: this.refreshList,
            //                             listItem: Array.isArray(items) ? items : [items]
            //                         });
            //                     } else {
            //                         this.AttSubmitShiftChangeAddOrEdit.onShow({
            //                             reload: this.refreshList
            //                         });
            //                     }
            //                 }
            //             }
            //         }
            //     ];
            // }
        }
        this.rowAction = _rowAction;
        const param = this.paramsDefault();
        HttpService.Get('[URI_CENTER]/api/Att_GetData/GetCutOffDurationByProfile').then((res) => {
            if (res && res.Status == EnumName.E_SUCCESS) {
                const dataCutOff = res.Data;
                let _keyQuery = EnumName.E_PRIMARY_DATA;

                if (param != null && param.CutOffDurationID != null) {
                    // Vào từ thông báo
                    _keyQuery = EnumName.E_FILTER;

                    let value = {
                        year: parseInt(moment(param.daySelected).format('YYYY')),
                        month: parseInt(moment(param.daySelected).format('MM')),
                        dateString: moment(param.daySelected).format('YYYY-MM-DD')
                    };

                    const valueCutOff = dataCutOff.find((item) => item.ID == param.CutOffDurationID);
                    this.setState(
                        {
                            minDate: moment(valueCutOff.DateStart).format('YYYY-MM-DD'),
                            maxDate: moment(valueCutOff.DateEnd).format('YYYY-MM-DD'),
                            cutOffDuration: {
                                data: dataCutOff,
                                value: valueCutOff
                            },
                            daySelected: value.dateString,
                            isRefreshList: !this.state.isRefreshList,
                            keyQuery: _keyQuery,
                            isLoading: true,
                            isMissingInoutFilter:
                                param && param.businessType == 'E_MISSING_IN_OUT_NOTAUTOCOMPUWORKDAY' ? true : false
                        },
                        () => {
                            startTask({
                                keyTask: EnumTask.KT_AttWorkDayCalendar,
                                payload: {
                                    ...param,
                                    keyQuery: _keyQuery,
                                    isCompare: true
                                }
                            });
                        }
                    );
                } else {
                    const current = new Date(),
                        valueCutOff = dataCutOff.find(
                            (item) =>
                                moment(item.DateStart) <= moment(current) && moment(current) <= moment(item.DateEnd)
                        );

                    this.setState(
                        {
                            minDate: valueCutOff
                                ? moment(valueCutOff.DateStart).format('YYYY-MM-DD')
                                : moment().format('YYYY-MM-DD'),
                            maxDate: valueCutOff
                                ? moment(valueCutOff.DateEnd).format('YYYY-MM-DD')
                                : moment().format('YYYY-MM-DD'),
                            monthYearRange: valueCutOff ? valueCutOff.MonthYear : null,
                            cutOffDuration: {
                                data: dataCutOff,
                                value: valueCutOff ? valueCutOff : null
                            },
                            daySelected: moment(current).format('YYYY-MM-DD'),
                            isRefreshList: !this.state.isRefreshList,
                            keyQuery: _keyQuery,
                            isLoading: true,
                            isMissingInoutFilter:
                                param && param.businessType == 'E_MISSING_IN_OUT_NOTAUTOCOMPUWORKDAY' ? true : false
                        },
                        () => {
                            this.loadItems();
                            startTask({
                                keyTask: EnumTask.KT_AttWorkDayCalendar,
                                payload: {
                                    CutOffDurationID: valueCutOff ? valueCutOff.ID : null,
                                    keyQuery: EnumName.E_PRIMARY_DATA,
                                    isCompare: true,
                                    reload: this.loadItems
                                }
                            });
                        }
                    );
                }
            }
        });
    };

    loadItems = (isLazyLoading) => {
        const { keyQuery, refreshing, daySelected } = this.state;

        this.setState({ isLoading: true });
        getDataLocal(EnumTask.KT_AttWorkDayCalendar).then((resData) => {
            const res = resData && resData[keyQuery] ? resData[keyQuery] : null;
            const listData = [],
                listDataViolate = { keyTras: 'HRM_PortalApp_Wd_DateViolation', data: [], marked: {} },
                listDataMissInOut = { keyTras: 'HRM_PortalApp_Wd_Missing', data: [], marked: {} },
                listDataLateEarly = { keyTras: 'HRM_PortalApp_Wd_LateEarly_Time', data: [], marked: {} },
                listDataInvalid = { keyTras: 'HRM_PortalApp_Wd_Asynchronous', data: [], marked: {} },
                listDataLeaveDay = { keyTras: 'HRM_PortalApp_Wd_LeaveDay', data: [], marked: {} },
                listDataOvertime = { keyTras: 'HRM_PortalApp_Wd_OT', data: [], marked: {} },
                listDataTravel = { keyTras: 'HRM_PortalApp_Wd_Business', data: [], marked: {} },
                listDataTamscanlog = { keyTras: 'HRM_PortalApp_Wd_Tamscanlog', data: [], marked: {} };

            let listMarked = {},
                listMarkedBackup = {};

            let dataFilter = {},
                objTotalWorkDay = {
                    TotalPaidWorkDays: null,
                    TotalLeaveDays: null,
                    TotalBusinessDays: null,
                    TotalOvertimeHours: null,
                    TotalInvalidNote: null,
                    TotalChangeShift: null,
                    TotalLateEarlyCount: null,
                    StandardWorkdayCount: null,
                    LackWorkCount: null,
                    isEmptyData: true,
                    TotalTimeSheetActual: null,
                    ListProfileTimeSheetMaster: []
                };

            if (res && res.Status == EnumName.E_SUCCESS && res.Data && res.Data.length > 0) {
                const lstWorkDay = res.Data[0]['ListWorkdayByDate'];
                if (lstWorkDay && Array.isArray(lstWorkDay) && lstWorkDay.length > 0) {
                    lstWorkDay.forEach((item) => {
                        item.WorkDate = item.Start;
                        item.isToday = moment(item.WorkDate).isSame(new Date(), 'date');
                        let dateTime = moment(item.WorkDate).format('YYYY-MM-DD');

                        let fieldNameType = item.IsHaveTwoShift ? 'TypeShift' : 'Type';
                        // check MissIn MissOut, check Late, check early
                        if (item.DayType == 'Working') {
                            if (item[fieldNameType] == 'E_NORMAL') {
                                // Đủ công
                                item.TypeView = translate('HRM_PortalApp_Lable_Worday_Normal');
                            } else {
                                // Thiếu công
                                let messageTypeView = '';

                                if (item[fieldNameType] == 'E_MISS_IN_OUT') {
                                    //messageTypeView = translate('HRM_PortalApp_Lable_MissInOut');
                                    item.isMissIn = true;
                                    item.isMissOut = true;
                                    // THiếu cả IN OUT thì không cần check trễ sớm
                                } else if (item[fieldNameType] == 'E_MISS_OUT' || item[fieldNameType] == 'E_MISS_IN') {
                                    if (item[fieldNameType] == 'E_MISS_IN' && item.ShiftID != null) {
                                        //messageTypeView = translate('HRM_PortalApp_Lable_MissIn');
                                        item.isMissIn = true;

                                        // Thiếu in thì check Về sớm
                                        if (
                                            item.IsLateEarly &&
                                            item.EarlyDuration1 != null &&
                                            item.EarlyDuration1 > 0
                                        ) {
                                            if (messageTypeView != '')
                                                messageTypeView = `${messageTypeView}, ${translate(
                                                    'HRM_PortalApp_Lable_EarlyDuration'
                                                )} (${item.EarlyDuration1}${translate('HRM_PortalApp_Mins')})`;
                                            else
                                                messageTypeView = `${translate('HRM_PortalApp_Lable_EarlyDuration')} (${item.EarlyDuration1
                                                }${translate('HRM_PortalApp_Mins')})`;

                                            item.isEarly = true;
                                        }
                                    } else if (item[fieldNameType] == 'E_MISS_OUT' && item.ShiftID != null) {
                                        //messageTypeView = translate('HRM_PortalApp_Lable_MissOut');
                                        item.isMissOut = true;

                                        // Thiếu OUT thì check vào trễ
                                        if (item.IsLateEarly && item.LateDuration1 != null && item.LateDuration1 > 0) {
                                            if (messageTypeView != '')
                                                messageTypeView = `${messageTypeView}, ${translate(
                                                    'HRM_PortalApp_Lable_LateDuration'
                                                )} (${item.LateDuration1}${translate('HRM_PortalApp_Mins')})`;
                                            else
                                                messageTypeView = `${translate('HRM_PortalApp_Lable_LateDuration')} (${item.LateDuration1
                                                }${translate('HRM_PortalApp_Mins')})`;

                                            item.isLate = true;
                                        }
                                    }
                                } else if (item[fieldNameType] == 'E_LATE_EARLY') {
                                    // Thiếu in thì check Về sớm
                                    if (item.IsLateEarly && item.EarlyDuration1 != null && item.EarlyDuration1 > 0) {
                                        if (messageTypeView != '')
                                            messageTypeView = `${messageTypeView}, ${translate(
                                                'HRM_PortalApp_Lable_EarlyDuration'
                                            )} (${item.EarlyDuration1}${translate('HRM_PortalApp_Mins')})`;
                                        else
                                            messageTypeView = `${translate('HRM_PortalApp_Lable_EarlyDuration')} (${item.EarlyDuration1
                                            }${translate('HRM_PortalApp_Mins')})`;

                                        item.isEarly = true;
                                    }

                                    // Thiếu OUT thì check vào trễ
                                    if (item.IsLateEarly && item.LateDuration1 != null && item.LateDuration1 > 0) {
                                        if (messageTypeView != '')
                                            messageTypeView = `${messageTypeView}, ${translate(
                                                'HRM_PortalApp_Lable_LateDuration'
                                            )} (${item.LateDuration1}${translate('HRM_PortalApp_Mins')})`;
                                        else
                                            messageTypeView = `${translate('HRM_PortalApp_Lable_LateDuration')} (${item.LateDuration1
                                            }${translate('HRM_PortalApp_Mins')})`;

                                        item.isLate = true;
                                    }
                                }

                                item.TypeView = messageTypeView ? messageTypeView : item.TypeView;
                            }

                            if (
                                item.TamScanLogStatus &&
                                item[fieldNameType] != 'E_NORMAL' &&
                                item.TamScanLogStatus !== EnumStatus.E_APPROVED
                            ) {
                                let { colorStatus } = Vnr_Services.formatStyleStatusApp(item.TamScanLogStatus),
                                    colorStamScanlog = colorStatus
                                        ? Vnr_Function.convertTextToColor(colorStatus)
                                        : null;

                                listMarked[dateTime] = {
                                    customStyles: {
                                        ...testIDs.customContainerMarked,
                                        text: {
                                            ...styleSheets.lable,
                                            color: colorStamScanlog
                                        }
                                    }
                                };
                            } else if (item[fieldNameType] == 'E_NORMAL') {
                                listMarked[dateTime] = {
                                    customStyles: {
                                        ...testIDs.customContainerMarked,
                                        text: {
                                            ...styleSheets.lable,
                                            color: Colors.green
                                        }
                                    }
                                };
                            } else if (item.isLate || item.isMissIn || item.isMissOut || item.isEarly) {
                                listMarked[dateTime] = {
                                    customStyles: {
                                        ...testIDs.customContainerMarked,
                                        text: {
                                            color: Colors.red
                                        }
                                    }
                                };
                            }
                        } else if (item.DayType == 'E_HOLIDAY' || item.DayType == 'OFF') {
                            listMarked[dateTime] = {
                                customStyles: {
                                    ...testIDs.customContainerMarked,
                                    text: {
                                        ...styleSheets.lable,
                                        color: item.DayType == 'E_HOLIDAY' ? Colors.pink : Colors.gray_7
                                    }
                                }
                            };
                        } else {
                            item.isFuture = true;
                            listMarked[dateTime] = {
                                customStyles: {
                                    ...testIDs.customContainerMarked,
                                    text: {
                                        ...styleSheets.lable,
                                        color: Colors.gray_10
                                    }
                                }
                            };
                        }
                        //------------------------------------------------//

                        let dataItem = {
                            title: dateTime,
                            data: [item]
                        };
                        // -------add data filter ---------------//
                        if (item.isLate || item.isMissIn || item.isMissOut || item.isEarly) {
                            listDataViolate.data.push(dataItem);
                            listDataViolate['dateStart'] = dateTime;
                            if (listMarked[dateTime]) listDataViolate['marked'][dateTime] = { ...listMarked[dateTime] };
                        }

                        if ((item.isMissIn || item.isMissOut) && item.ListDataTamScanLog.length == 0) {
                            listDataMissInOut.data.push(dataItem);
                            listDataMissInOut['dateStart'] = dateTime;
                            if (listMarked[dateTime])
                                listDataMissInOut['marked'][dateTime] = { ...listMarked[dateTime] };
                        }

                        if (item.isLate || item.isEarly) {
                            listDataLateEarly.data.push(dataItem);
                            listDataLateEarly['dateStart'] = dateTime;
                            if (listMarked[dateTime])
                                listDataLateEarly['marked'][dateTime] = { ...listMarked[dateTime] };
                        }

                        if (item.ListDataLeaveday && item.ListDataLeaveday.length > 0) {
                            listDataLeaveDay.data.push(dataItem);
                            listDataLeaveDay['dateStart'] = dateTime;

                            if (listMarked[dateTime])
                                listDataLeaveDay['marked'][dateTime] = { ...listMarked[dateTime] };
                        }

                        if (item.ListDataOvertime && item.ListDataOvertime.length > 0) {
                            listDataOvertime.data.push(dataItem);
                            listDataOvertime['dateStart'] = dateTime;
                            if (listMarked[dateTime])
                                listDataOvertime['marked'][dateTime] = { ...listMarked[dateTime] };
                        }

                        if (item.ListDataTamScanLog && item.ListDataTamScanLog.length > 0) {
                            listDataTamscanlog.data.push(dataItem);
                            listDataTamscanlog['dateStart'] = dateTime;
                            if (listMarked[dateTime])
                                listDataTamscanlog['marked'][dateTime] = { ...listMarked[dateTime] };
                        }

                        if (item.ListDataBusiness && item.ListDataBusiness.length > 0) {
                            listDataTravel.data.push(dataItem);
                            listDataTravel['dateStart'] = dateTime;
                            if (listMarked[dateTime]) listDataTravel['marked'][dateTime] = { ...listMarked[dateTime] };
                        }
                        // ------------------------------//

                        listData.push(dataItem);
                    });

                    listMarkedBackup = Object.assign({}, listMarked);

                    if (listDataViolate.dateStart) dataFilter['listDataViolate'] = listDataViolate;

                    if (listDataViolate.dateStart) dataFilter['listDataMissInOut'] = listDataMissInOut;

                    if (listDataInvalid.dateStart) dataFilter['listDataInvalid'] = listDataInvalid;

                    if (listDataLeaveDay.dateStart) dataFilter['listDataLeaveDay'] = listDataLeaveDay;

                    if (listDataOvertime.dateStart) dataFilter['listDataOvertime'] = listDataOvertime;

                    if (listDataTravel.dateStart) dataFilter['listDataTravel'] = listDataTravel;

                    if (listDataTamscanlog.dateStart) dataFilter['listDataTamscanlog'] = listDataTamscanlog;

                    if (listDataLateEarly.dateStart) dataFilter['listDataLateEarly'] = listDataLateEarly;

                    if (res.Data && res.Data.length > 0) {
                        const firstItem = res.Data[0];
                        if (firstItem) {
                            objTotalWorkDay = {
                                TotalPaidWorkDays: firstItem.TotalPaidWorkDays, // Ngày công
                                TotalLeaveDays: firstItem.TotalLeaveDays, // Ngày nghỉ
                                TotalBusinessDays: firstItem.TotalBusinessDays, // đi công tác
                                TotalOvertimeHours: firstItem.TotalOvertimeHours, // tăng ca
                                TotalInvalidNote: firstItem.TotalInvalidNote, // ghi chú bất hợp lệ
                                TotalChangeShift: firstItem.TotalChangeShift, // đổi ca
                                TotalLateEarlyCount: firstItem.TotalLateEarlyCount, // lần trễ/sớm
                                StandardWorkdayCount: firstItem.StandardWorkdayCount, // ngày công chuẩn
                                LackWorkCount: firstItem.LackWorkCount, // Thiếu công
                                isEmptyData: false,
                                TotalTimeSheetActual: firstItem?.TotalTimeSheetActual, // TPC: tổng công sản phẩm
                                ListProfileTimeSheetMaster: firstItem?.ListProfileTimeSheetMaster // TPC: DS tổng công sản phẩm theo phòng ban
                            };
                        }
                    }

                    let _daySelected = daySelected;
                    // if (moment(daySelected) > moment(minDate) && moment(daySelected) < moment(maxDate)) {
                    //   _daySelected = moment(daySelected).format('YYYY-MM-DD');
                    // }

                    listMarked = {
                        ...listMarked,
                        [_daySelected]: {
                            customStyles: {
                                text: {
                                    color: Colors.white
                                }
                            }
                        }
                    };

                    this.setState(
                        {
                            ...objTotalWorkDay,
                            dataFilter: dataFilter,
                            dataCalendar: listData,
                            dataCalendarBackup: [...listData],
                            listMarked: listMarked,
                            listMarkedBackup: listMarkedBackup,
                            isLoading: false,
                            isLoadingHeader: isLazyLoading ? false : true,
                            refreshing: !refreshing
                        },
                        () => {
                            //isMissingInoutFilter && this.onFilter('listDataViolate')
                        }
                    );
                } else {
                    let today = new Date();
                    this.setState({
                        ...objTotalWorkDay,
                        dataFilter: dataFilter,
                        daySelected: moment(today).format('YYYY-MM-DD'),
                        dataCalendar: [],
                        dataCalendarBackup: [],
                        listMarked: {},
                        listMarkedBackup: {},
                        isLoading: false,
                        isLoadingHeader: isLazyLoading ? false : true,
                        refreshing: !refreshing,
                        isMissingInoutFilter: false
                    });
                }
            } else if (res == EnumName.E_EMPTYDATA) {
                //let today = new Date();
                this.setState({
                    ...objTotalWorkDay,
                    isLoadingHeader: isLazyLoading ? false : true,
                    dataFilter: {},
                    dataCalendar: [],
                    dataCalendarBackup: [],
                    listMarked: {},
                    listMarkedBackup: {},
                    minDate: moment(daySelected).format('YYYY-MM-DD'),
                    maxDate: moment(daySelected).format('YYYY-MM-DD'),
                    isLoading: false,
                    refreshing: !refreshing,
                    isMissingInoutFilter: false
                });
            }
        });
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == EnumTask.KT_AttWorkDayCalendar) {
            //khi màn hình đang reload thì messsage phải là filter thì màn hình mới reload
            if (keyQuery === EnumName.E_FILTER && nextProps.message && keyQuery == nextProps.message.keyQuery) {
                this.loadItems(true);
            } else if (nextProps.message && keyQuery == nextProps.message.keyQuery) {
                // dataChange == true ? khác : giống nhau
                if (!nextProps.message.dataChange) {
                    this.setState({
                        isLoadingHeader: false
                    });
                } else {
                    this.loadItems(true);
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

    removeDuplicates = (array) => {
        let seen = {};
        return array.filter((item) => {
            if (seen[item.title]) {
                return false;
            } else {
                seen[item.title] = true;
                return true;
            }
        });
    };

    onFilter = (key) => {
        let { dataFilter, dataCalendarBackup } = this.state;

        const _dataFilter = Object.assign({}, dataFilter);
        if (_dataFilter[key]) {
            const item = _dataFilter[key];
            item.isSelect = !item.isSelect;

            const checkHavenFilter = Object.keys(_dataFilter).filter((key) => _dataFilter[key]?.isSelect === true);
            let handleData = [];
            let listMarked = {},
                listMarkedBackup = {};

            if (checkHavenFilter.length > 0) {
                checkHavenFilter.forEach((key) => {
                    handleData = handleData.concat(_dataFilter[key]['data']);

                    listMarked = {
                        ...listMarked,
                        ..._dataFilter[key]['marked']
                    };

                    listMarkedBackup = {
                        ...listMarkedBackup,
                        ..._dataFilter[key]['marked']
                    };
                });

                handleData = this.removeDuplicates(handleData);
            } else {
                handleData = dataCalendarBackup;
                Object.keys(_dataFilter).forEach((key) => {
                    listMarked = {
                        ...listMarked,
                        ..._dataFilter[key]['marked']
                    };

                    listMarkedBackup = {
                        ...listMarkedBackup,
                        ..._dataFilter[key]['marked']
                    };
                });
            }

            let firstitem = handleData[0];
            this.setState(
                {
                    dataCalendar: handleData,
                    refreshing: !this.state.refreshing,
                    listMarkedBackup: listMarkedBackup,
                    listMarked: listMarked,
                    dataFilter: _dataFilter,
                    isMissingInoutFilter: false
                },
                () => {
                    this.onDayPress(firstitem.title);
                }
            );
        }
    };

    onClearFilter = () => {
        let { dataFilter, dataCalendarBackup } = this.state;

        const _dataFilter = Object.assign({}, dataFilter);

        Object.keys(_dataFilter).map((key) => (_dataFilter[key].isSelect = false));

        let handleData = [];
        let listMarked = {},
            listMarkedBackup = {};

        handleData = dataCalendarBackup;
        Object.keys(_dataFilter).forEach((key) => {
            listMarked = {
                ...listMarked,
                ..._dataFilter[key]['marked']
            };

            listMarkedBackup = {
                ...listMarkedBackup,
                ..._dataFilter[key]['marked']
            };
        });

        let firstitem = handleData[0];
        this.setState(
            {
                dataCalendar: handleData,
                refreshing: !this.state.refreshing,
                listMarkedBackup: listMarkedBackup,
                listMarked: listMarked,
                dataFilter: _dataFilter
            },
            () => {
                this.onDayPress(firstitem.title);
            }
        );
    };

    renderViewTopWorkDay = () => {
        const { TotalPaidWorkDays, LackWorkCount, TotalLateEarlyCount, TotalTimeSheetActual, dataFilter } = this.state;
        // Có cấu hình ẩn field thì không hiển thị vùng master
        const _configField = ConfigField && ConfigField.value['Workday'] ? ConfigField.value['Workday']['Hidden'] : [];

        let isShowTotalPaidWorkDays = _configField.findIndex((key) => key == 'TotalPaidWorkDays') > -1 ? false : true,
            isShowLackWorkCount = _configField.findIndex((key) => key == 'LackWorkCount') > -1 ? false : true,
            isShowTotalLateEarlyCount =
                _configField.findIndex((key) => key == 'TotalLateEarlyCount') > -1 ? false : true,
            checkHavenFilter = Object.keys(dataFilter).filter((key) => dataFilter[key]?.isSelect === true);

        return (
            <View style={styles.styViewTopWorkDay}>
                <View style={styles.styLeftAvatar}>
                    <TouchableOpacity
                        style={styles.stySizeIcon}
                        onPress={() => {
                            if (this.refsworkdayFilter != null) {
                                this.refsworkdayFilter.showFilter();
                            }
                        }}
                    >
                        <IconSearch color={Colors.gray_9} size={Size.iconSize} />
                        {checkHavenFilter.length > 0 && (
                            <View style={styles.styFilterBadged}>
                                <Text style={[styleSheets.lable, styles.styFilterLable]}>
                                    {checkHavenFilter.length}
                                </Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
                <View style={styles.styBoxCenter}>
                    {/* Ngày công*/}
                    {TotalPaidWorkDays != null && isShowTotalPaidWorkDays && (
                        <View style={styles.styBox}>
                            <View style={styles.styBoxLableView}>
                                <VnrText
                                    style={[styleSheets.lable, styles.styboxLable]}
                                    i18nKey={'HRM_PortalApp_Wd_WorkDate_Master'}
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

                    {/* Thiếu công*/}
                    {LackWorkCount != null && isShowLackWorkCount && (
                        <View style={styles.styBox}>
                            <View style={styles.styBoxLableView}>
                                <VnrText
                                    style={[styleSheets.lable, styles.styboxLable]}
                                    i18nKey={'HRM_PortalApp_Wd_LackOf_Master'}
                                    numberOfLines={1}
                                />
                            </View>
                            <View>
                                <Text
                                    style={[
                                        styleSheets.text,
                                        styles.styboxValue,
                                        LackWorkCount > 0 && { color: Colors.red }
                                    ]}
                                >
                                    {LackWorkCount ? Vnr_Function.mathRoundNumber(LackWorkCount) : 0}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Trễ sớm */}
                    {TotalLateEarlyCount != null && isShowTotalLateEarlyCount && (
                        <View style={styles.styBox}>
                            <View style={styles.styBoxLableView}>
                                <VnrText
                                    style={[styleSheets.lable, styles.styboxLable]}
                                    i18nKey={'HRM_PortalApp_Wd_LateEarly_Master'}
                                    numberOfLines={1}
                                />
                            </View>
                            <View>
                                <Text
                                    style={[
                                        styleSheets.text,
                                        styles.styboxValue,
                                        TotalLateEarlyCount > 0 && { color: Colors.red }
                                    ]}
                                >
                                    {TotalLateEarlyCount ? Vnr_Function.mathRoundNumber(TotalLateEarlyCount) : 0}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Tổng công sản phẩm */}
                    {
                        TotalTimeSheetActual ? (
                            <View style={styles.styBox}>
                                <TouchableOpacity style={styles.styBoxLableView}
                                    onPress={() => this.handleVisibleListProfileTimeSheetMaster()}
                                >
                                    <VnrText
                                        style={[styleSheets.lable, styles.styboxLable, styles.textUnderline]}
                                        i18nKey={'HRM_PortalApp_TotalProductOutput'}
                                        numberOfLines={1}
                                    />
                                </TouchableOpacity>
                                <View>
                                    <Text
                                        style={[
                                            styleSheets.text,
                                            styles.styboxValue,
                                            TotalTimeSheetActual > 0 && { color: Colors.red }
                                        ]}
                                    >
                                        {TotalTimeSheetActual ? Vnr_Function.mathRoundNumber(TotalTimeSheetActual) : 0}
                                    </Text>
                                </View>
                            </View>
                        ) : null
                    }
                </View>

                {this.rowAction && Array.isArray(this.rowAction) && this.rowAction.length > 0 && (
                    <View style={styles.styBoxRight}>
                        <TouchableWithoutFeedback
                            onPress={() => {
                                this.setState({
                                    isShowModalSubmit: {
                                        visible: true,
                                        dataWorkdayItem: null
                                    }
                                });
                            }}
                        >
                            <View style={styles.styBtnAdd}>
                                <IconPlus size={Size.iconSizeHeader + 7} color={Colors.white} />
                            </View>
                        </TouchableWithoutFeedback>
                    </View>
                )}
            </View>
        );
    };

    renderRemind = () => {
        const { dataFilter, isLoading } = this.state;
        if (
            dataFilter.listDataMissInOut &&
            dataFilter.listDataMissInOut.data &&
            dataFilter.listDataMissInOut.data.length > 0 &&
            !isLoading
        ) {
            const { isSelect } = dataFilter.listDataMissInOut;
            let title = translate('HRM_PortalApp_Wd_Remind_MissInOut'),
                callBackSubmit = null,
                actionInOut = this.rowAction.length > 0 ? this.rowAction[0] : null,
                dataList = [];

            if (actionInOut && actionInOut.type == 'E_INOUT') {
                dataFilter.listDataMissInOut.data.forEach((item) => {
                    dataList = dataList.concat(item.data);
                });

                callBackSubmit = () => {
                    actionInOut.onPress(dataList);
                };
            }

            title = title.replace('[E_NUMBER]', dataFilter.listDataMissInOut.data.length);
            return (
                <View style={styles.styViewRemind}>
                    <View style={styles.styViewRmText}>
                        <VnrText style={[styleSheets.lable, styles.styRmText]} value={title} />
                    </View>

                    {callBackSubmit != null && (
                        <TouchableOpacity
                            style={!isSelect ? styles.styRmSubmitBnt : styles.styRmSubmitBntNo}
                            onPress={callBackSubmit}
                        >
                            <VnrText
                                style={[styleSheets.lable, styles.styRmSubmitText]}
                                i18nKey={'HRM_PortalApp_Register'}
                            />
                        </TouchableOpacity>
                    )}

                    {!isSelect && (
                        <TouchableOpacity
                            style={styles.styRmSubmitBnt}
                            onPress={() => {
                                this.onFilter('listDataMissInOut');
                            }}
                        >
                            <VnrText
                                style={[styleSheets.lable, styles.styRmDetailText]}
                                i18nKey={'HRM_PortalApp_Wd_Filter_ViewDetail'}
                            />
                        </TouchableOpacity>
                    )}
                </View>
            );
        } else return <View />;
    };

    hideModalSubmit = () => {
        this.setState({
            isShowModalSubmit: {
                visible: false,
                dataWorkdayItem: null
            }
        });
    };

    hideModalDetail = () => {
        this.setState({
            dataModalItem: null
        });
    };

    showModalDetail = (item) => {
        this.setState({
            dataModalItem: item
        });
    };

    hideModalUpdateInOut = () => {
        this.setState({ isOnUpdateInOut: false, dataItemForAddInOut: null });
    };

    // In JavaScript,
    // a debounce function makes sure that your code is only triggered once per user input.
    // Search box suggestions, text-field auto-saves, and eliminating double-button clicks are all use cases for debounce.
    debounce(func, timeout = 100) {
        let timer;
        return (...args) => {
            clearTimeout(timer);
            timer = setTimeout(() => {
                func.apply(this, args);
            }, timeout);
        };
    }

    onScrollEnd() {
        if (this.state.disableBtnViewDetail && Platform.OS === 'android')
            this.setState({
                disableBtnViewDetail: false
            });
    }

    onScroll = () => {
        this.onScrollEnd();
    };

    handleVisibleListProfileTimeSheetMaster = () => {
        const { isVisibleListProfileTimeSheetMaster } = this.state;
        this.setState({
            isVisibleListProfileTimeSheetMaster: !isVisibleListProfileTimeSheetMaster
        })
    }

    render() {
        const {
                daySelected,
                listMarked,
                dataCalendar,
                minDate,
                maxDate,
                isLoading,
                isShowModalSubmit,
                dataFilter,
                monthYearRange,
                disableBtnViewDetail,
                isVisibleListProfileTimeSheetMaster,
                ListProfileTimeSheetMaster
            } = this.state,
            { dataWorkdayItem } = isShowModalSubmit;

        let contentList = <View />,
            formatMonthYearRange = `'${translate('HRM_PortalApp_Lable_Worday_Term')} ${moment(
                monthYearRange ? monthYearRange : daySelected
            ).format('YYYY-MM')}'`;

        if (isLoading) {
            contentList = <VnrLoadingScreen size="large" isVisible={isLoading} type={EnumStatus.E_APPROVE} />;
        } else if (dataCalendar == EnumName.E_EMPTYDATA || dataCalendar.length == 0) {
            contentList = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataCalendar && dataCalendar.length > 0) {

            contentList = (
                <AgendaList
                    ref={refAgenda => this.refAgenda = refAgenda}
                    testID={testIDs.agenda.CONTAINER}
                    sections={dataCalendar}
                    renderItem={this.renderItem.bind(this)}
                    sectionStyle={styles.componentAgendaList}
                    theme={testIDs.theme.CONTAINER}
                    style={styles.styAgenda}
                    onScroll={() => {
                        // handle just only androids
                        if (disableBtnViewDetail && Platform.OS === 'android') this.onScrollEnd();
                    }}
                    onScrollToIndexFailed={() => {
                        this.setState({
                            disableBtnViewDetail: false
                        });
                    }}
                    onMomentumScrollEnd={() => {
                        // handle just only IOS
                        if (disableBtnViewDetail && Platform.OS === 'ios')
                            this.setState({
                                disableBtnViewDetail: false
                            });
                    }}
                />
            );
        }

        return (
            <SafeAreaView style={styles.mainCal}>
                <View style={styles.styContainer}>
                    <TouchableOpacity style={styles.styBtnGoHome} onPress={() => DrawerServices.goBack()}>
                        <IconHome color={Colors.gray_10} size={Size.iconSizeHeader} />
                    </TouchableOpacity>

                    {!isLoading && this.renderViewTopWorkDay()}

                    <CalendarProvider
                        date={daySelected}
                        onDateChanged={(item) => this.onDayPress(item)}
                        onMonthChange={(month) => this.onChangeMonth(month)}
                    >
                        <ExpandableCalendar
                            testID={testIDs.expandableCalendar.CONTAINER}
                            horizontal={true}
                            theme={testIDs.theme.CONTAINER}
                            firstDay={1}
                            markingType={'custom'}
                            markedDates={listMarked}
                            minDate={minDate}
                            maxDate={maxDate}
                            monthFormat={formatMonthYearRange}
                        // leftArrowImageSource={leftArrowIcon}
                        // rightArrowImageSource={rightArrowIcon}
                        />
                        {this._renderHeaderLoading()}

                        {
                            disableBtnViewDetail && (
                                <View style={styles.opacityTransparent}>
                                </View>
                            )
                        }
                        {contentList}
                    </CalendarProvider>

                    <AttWorkdayFilter
                        ref={(ref) => (this.refsworkdayFilter = ref)}
                        dataFilter={dataFilter}
                        onFilter={this.onFilter}
                        onClearFilter={this.onClearFilter}
                    />

                    <AttSubmitTakeLateEarlyAllowedAddOrEdit
                        ref={refs => (this.AttSubmitTakeLateEarlyAllowedAddOrEdit = refs)}
                    />

                    <AttSubmitTamScanLogRegisterAddOrEdit
                        ref={(refs) => (this.AttSubmitTamScanLogRegisterAddOrEdit = refs)}
                    />
                    <AttSubmitTakeLeaveDayAddOrEdit ref={(refs) => (this.AttSubmitTakeLeaveDayAddOrEdit = refs)} />
                    <AttSubmitTakeBusinessTripAddOrEdit
                        ref={(refs) => (this.AttSubmitTakeBusinessTripAddOrEdit = refs)}
                    />
                    <AttSubmitWorkingOvertimeAddOrEdit
                        ref={(refs) => (this.AttSubmitWorkingOvertimeAddOrEdit = refs)}
                    />

                    <AttSubmitShiftChangeAddOrEdit ref={(refs) => (this.AttSubmitShiftChangeAddOrEdit = refs)} />

                    {isShowModalSubmit.visible && (
                        <Modal
                            onBackButtonPress={() => this.hideModalSubmit()}
                            isVisible={true}
                            onBackdropPress={() => this.hideModalSubmit()}
                            customBackdrop={
                                <TouchableWithoutFeedback onPress={() => this.hideModalSubmit()}>
                                    <View style={styleSheets.coatingOpacity05} />
                                </TouchableWithoutFeedback>
                            }
                            style={CustomStyleSheet.margin(0)}
                        >
                            <View style={[styles.styModalDetailItem, { height: Size.deviceheight / 2 }]}>
                                <SafeAreaView style={CustomStyleSheet.paddingTop(0)}>
                                    <View style={styles.headerCloseModal}>
                                        <View style={styles.titleModal}>
                                            <VnrText
                                                numberOfLines={1}
                                                style={[styleSheets.lable, styles.titleModal__text]}
                                                value={`${translate('HRM_PortalApp_Submit_Work')} ${dataWorkdayItem
                                                    ? moment(dataWorkdayItem.WorkDate).format('DD/MM/YYYY')
                                                    : ''
                                                }`}
                                            />
                                        </View>

                                        <TouchableOpacity onPress={() => this.hideModalSubmit()}>
                                            <IconCancel size={Size.iconSize} color={Colors.gray_10} />
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView style={styles.styCrBtnSubRest}>
                                        {this.rowAction &&
                                            this.rowAction.map((action, index) => (
                                                <TouchableOpacity
                                                    key={index}
                                                    style={styles.styBtnSub}
                                                    onPress={() => {
                                                        this.hideModalSubmit();
                                                        action.onPress(dataWorkdayItem ? dataWorkdayItem : null);
                                                    }}
                                                >
                                                    <Image source={action.icon} style={styles.styBtnSubImg} />
                                                    <Text
                                                        numberOfLines={1}
                                                        style={[styleSheets.lable, styles.styEgAtt]}
                                                    >
                                                        {action.title}
                                                    </Text>
                                                </TouchableOpacity>
                                            ))}
                                    </ScrollView>
                                </SafeAreaView>
                            </View>
                        </Modal>
                    )}

                    {isVisibleListProfileTimeSheetMaster && (
                        <Modal
                            onBackButtonPress={() => this.handleVisibleListProfileTimeSheetMaster()}
                            isVisible={isVisibleListProfileTimeSheetMaster}
                            onBackdropPress={() => this.handleVisibleListProfileTimeSheetMaster()}
                            customBackdrop={
                                <TouchableWithoutFeedback onPress={() => this.handleVisibleListProfileTimeSheetMaster()}>
                                    <View style={styleSheets.coatingOpacity05} />
                                </TouchableWithoutFeedback>
                            }
                            style={CustomStyleSheet.margin(0)}
                        >
                            <View style={[styles.styModalDetailItem, { height: Size.deviceheight / 2 }]}>
                                <SafeAreaView style={[CustomStyleSheet.paddingTop(0), CustomStyleSheet.flex(1)]}>
                                    <View style={styles.headerCloseModal}>
                                        <View style={styles.titleModal}>
                                            <VnrText
                                                numberOfLines={1}
                                                style={[styleSheets.lable, styles.titleModal__text]}
                                                i18nKey={'HRM_PortalApp_ProductList'}
                                            />
                                        </View>

                                        <TouchableOpacity onPress={() => this.handleVisibleListProfileTimeSheetMaster()}>
                                            <IconCancel size={Size.iconSize} color={Colors.gray_10} />
                                        </TouchableOpacity>
                                    </View>
                                    <View
                                        style={styles.nameTable}
                                    >
                                        <View
                                            style={styles.columnDepartment}
                                        >
                                            <Text style={[styleSheets.lable]}>{translate('HRM_PortalApp_Compliment_Department')}</Text>
                                        </View>
                                        <View
                                            style={styles.columnWorkNumber}
                                        >
                                            <Text style={[styleSheets.lable]}>{translate('HRM_PortalApp_WorkNumber')}</Text>
                                        </View>
                                    </View>
                                    <ScrollView style={[styles.styCrBtnSubRest, CustomStyleSheet.flex(1)]}>
                                        {
                                            (Array.isArray(ListProfileTimeSheetMaster) && ListProfileTimeSheetMaster.length > 0) && (
                                                ListProfileTimeSheetMaster.map((item, index) => {
                                                    if (item?.OrgStructuretTransName)
                                                        return (
                                                            <View
                                                                key={index}
                                                                style={[styles.wrapItemValue, index === ListProfileTimeSheetMaster.length - 1 && CustomStyleSheet.marginBottom(16)]}
                                                            >
                                                                <View
                                                                    style={styles.valueColumnDepartment}
                                                                >
                                                                    <Text numberOfLines={2} style={[styleSheets.lable, CustomStyleSheet.maxWidth('85%')]}>{item?.OrgStructuretTransName}</Text>
                                                                </View>
                                                                <View
                                                                    style={styles.valueColumnWorkNumber}
                                                                >
                                                                    <Text style={[styleSheets.lable]}>{item?.TotalWorkdaysTimeSheet ?? '0'}</Text>
                                                                </View>
                                                            </View>
                                                        )
                                                })
                                            )
                                        }
                                    </ScrollView>
                                </SafeAreaView>
                            </View>
                        </Modal>
                    )}
                </View>
            </SafeAreaView>
        );
    }
}

const sizeBtnAdd = Size.iconSizeHeader + 30;

const HEIGHT_BOTTOM_VIEW = Size.deviceheight * 0.1 + Size.defineHalfSpace + 12;

const styles = StyleSheet.create({
    styAgenda: {
        flex: 1,
        marginBottom: HEIGHT_BOTTOM_VIEW
        // paddingTop: HEADER_MAX_HEIGHT,
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
    styEgAtt: {
        color: Colors.black
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
    mainCal: {
        flex: 1,
        backgroundColor: Colors.white
    },
    styContainer: {
        flex: 1,
        zIndex: 3,

        backgroundColor: Colors.gray_2,
        position: 'relative'
    },
    styBtnGoHome: {
        position: 'absolute',
        top: 13,
        left: Size.defineSpace,
        elevation: 4,
        zIndex: 4
    },
    emptyDate: {
        flex: 1
    },
    styBtnAdd: {
        // position: 'absolute',
        // top: -((Size.defineSpace + (sizeViewBtnAdd / 2)) - Size.defineSpace),
        // right: Size.defineSpace,
        height: sizeBtnAdd,
        width: sizeBtnAdd,
        borderRadius: sizeBtnAdd / 2,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: Colors.primary,
        zIndex: 2,
        elevation: 2
    },
    styViewTopWorkDay: {
        width: '100%',
        height: HEIGHT_BOTTOM_VIEW,
        flexDirection: 'row',
        position: 'absolute',
        bottom: 0,
        backgroundColor: Colors.white,

        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineSpace,
        borderTopColor: Colors.gray_5,
        borderTopWidth: 0.5,
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
        width: Size.deviceWidth * 0.13,
        height: Size.deviceWidth * 0.13,
        borderRadius: (Size.deviceWidth * 0.13) / 2,
        maxWidth: 150,
        maxHeight: 150,
        backgroundColor: Colors.gray_3,

        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative'
    },
    styBoxRight: {
        flex: 3,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    styBoxCenter: {
        flex: 5,
        justifyContent: 'center'
    },
    styBoxLableView: {
        flex: 1
    },
    styboxLable: {
        fontSize: Size.text
        // fontWeight: Platform.OS =='ios' ? '500' : '600',
        // color: Colors.gray_10
    },
    styboxValue: {
        fontSize: Size.text - 1,
        fontWeight: Platform.OS == 'ios' ? '600' : '700',
        color: Colors.black,
        marginLeft: Size.defineSpace,
        marginBottom: 3
    },
    styBox: {
        justifyContent: 'space-between',
        flexDirection: 'row'
        // marginBottom: 5
    },
    styFilterBadged: {
        position: 'absolute',
        top: -5,
        right: -5,
        width: Size.text + 5,
        height: Size.text + 5,
        borderRadius: (Size.text + 5) / 2,
        backgroundColor: Colors.danger,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styFilterLable: {
        color: Colors.white,
        fontSize: Size.text - 3,
        marginTop: -1
    },

    // Remind
    styViewRemind: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: Size.deviceWidth - Size.defineSpace * 2,
        marginTop: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace,
        marginHorizontal: Size.defineSpace,
        borderRadius: 4,
        borderWidth: 0.5,
        borderColor: Colors.primary,
        backgroundColor: Colors.primary_transparent_8,
        paddingHorizontal: Size.defineHalfSpace
    },
    styRmSubmitBnt: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styRmSubmitBntNo: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    styViewRmText: {
        width: '55%',
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    styRmSubmitText: {
        fontSize: Size.text + 1,
        color: Colors.primary
    },
    styRmDetailText: {
        color: Colors.gray_8
    },

    componentAgendaList: {
        position: 'absolute',
        left: -100,
        width: 0,
        height: 0
    },
    opacityTransparent: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        zIndex: 1,
        elevation: 1
    },

    textUnderline: {
        color: Colors.blue, textDecorationLine: 'underline'
    },

    nameTable: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.gray_3,
        paddingHorizontal: Size.defineSpace
    },

    columnDepartment: {
        flex: 0.8,
        borderRightColor: Colors.gray_7,
        borderRightWidth: 0.5,
        paddingVertical: Size.defineSpace
    },

    columnWorkNumber: {
        flex: 0.3,
        borderLeftColor: Colors.gray_7,
        borderLeftWidth: 0.5,
        alignItems: 'flex-end',
        paddingVertical: Size.defineSpace
    },

    wrapItemValue: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    },
    valueColumnDepartment: {
        flex: 0.8,
        paddingVertical: Size.defineHalfSpace
    },

    valueColumnWorkNumber: {
        flex: 0.2, alignItems: 'flex-end',
        paddingVertical: Size.defineHalfSpace
    }
});

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(mapStateToProps, null)(AttWorkDayCalendar);
