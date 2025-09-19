import React, { Component } from 'react';
// import { View, StyleSheet, } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { Colors, styleSafeAreaView } from '../../../../../constants/styleConfig';
import { StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import { Agenda } from '../../../../../node_modules/react-native-calendars';
import RenderItem from '../../../../../components/VnrListWorkDay/RenderItem';
import DrawerServices from '../../../../../utils/DrawerServices';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { translate } from '../../../../../i18n/translate';

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

const ___data = {
    '2018-07-31': [
        {
            ProfileID: '136a8e27-7bc2-4e09-b434-6367f49b9304',
            ShiftID: '18ab99ab-9a34-4247-8440-c7ce3b73fdd0',
            ShiftName: 'Hành Chính (08:00 - 17:00)',
            WorkDate: '/Date(1596128400000)/',
            WorkDateView: '31/07/2020',
            DayOffWeek: 'T6',
            InTime1: null,
            InTimeLabel: 'Vào',
            OutTime1: null,
            OutTimeLabel: 'Ra',
            WorkHours: 0,
            NightWorkHours: 0,
            LateDuration1: 0,
            LateDuration1Label: '',
            EarlyDuration1: 0,
            EarlyDuration1Label: '',
            ListLeaveday: [
                {
                    LeavedayTypeName: 'LuanTest_Nghỉ không có tối đa',
                    LeaveHours: 8,
                    StatusLeave: 'E_REJECTED',
                    StatusLeaveView: 'Từ chối'
                }
            ],
            ListOvertime: [],
            TotalLeavedays: 1,
            TotalLeaveBussinessdays: 0,
            TotalOvertimeHours: 28,
            TotalWorkdays: 27,
            TotalRealWorkdays: 0,
            Workday: 31,
            IsDateNow: false,
            WeekInMonth: 5,
            TitleWeek: null,
            CountIndex: 35,
            ID: '2f82024c-fefe-4fc1-af44-ba09575abd62',
            ServerUpdate: null,
            ServerCreate: null,
            UserUpdate: null,
            UserCreate: null,
            DateCreate: null,
            DateUpdate: '/Date(1595932227054)/',
            UserLockID: null,
            DateLock: null,
            IsDelete: null,
            IPCreate: null,
            IPUpdate: null,
            TotalRow: 0,
            OrgParent1: null,
            OrgParent2: null,
            OrgParentCode1: null,
            OrgParentCode2: null,
            OrgParentEN1: null,
            OrgParentEN2: null,
            ActionStatus: null,
            Label: null,
            LabelView: null
        }
    ],
    '2020-07-30': [
        {
            ProfileID: '136a8e27-7bc2-4e09-b434-6367f49b9304',
            ShiftID: '18ab99ab-9a34-4247-8440-c7ce3b73fdd0',
            ShiftName: 'Hành Chính (08:00 - 17:00)',
            WorkDate: '/Date(1596042000000)/',
            WorkDateView: '30/07/2020',
            DayOffWeek: 'T5',
            InTime1: null,
            InTimeLabel: 'Vào',
            OutTime1: null,
            OutTimeLabel: 'Ra',
            WorkHours: 0,
            NightWorkHours: 0,
            LateDuration1: 0,
            LateDuration1Label: '',
            EarlyDuration1: 0,
            EarlyDuration1Label: '',
            ListLeaveday: [
                {
                    LeavedayTypeName: 'LuanTest_Nghỉ không có tối đa',
                    LeaveHours: 8,
                    StatusLeave: 'E_REJECTED',
                    StatusLeaveView: 'Từ chối'
                }
            ],
            ListOvertime: [
                {
                    OvertimeTypeName: 'Đêm Ngày thường theo thông tư 23',
                    StatusOvertime: 'E_SUBMIT',
                    StatusOvertimeView: 'Yêu cầu',
                    OvertimeHours: 2
                }
            ],
            TotalLeavedays: 1,
            TotalLeaveBussinessdays: 0,
            TotalOvertimeHours: 28,
            TotalWorkdays: 27,
            TotalRealWorkdays: 0,
            Workday: 30,
            IsDateNow: false,
            WeekInMonth: 5,
            TitleWeek: null,
            CountIndex: 34,
            ID: 'd95312fc-1a59-4561-89a5-22d64cf5b217',
            ServerUpdate: null,
            ServerCreate: null,
            UserUpdate: null,
            UserCreate: null,
            DateCreate: null,
            DateUpdate: '/Date(1595932227054)/',
            UserLockID: null,
            DateLock: null,
            IsDelete: null,
            IPCreate: null,
            IPUpdate: null,
            TotalRow: 0,
            OrgParent1: null,
            OrgParent2: null,
            OrgParentCode1: null,
            OrgParentCode2: null,
            OrgParentEN1: null,
            OrgParentEN2: null,
            ActionStatus: null,
            Label: null,
            LabelView: null
        }
    ],
    '2020-07-29': [
        {
            ProfileID: '136a8e27-7bc2-4e09-b434-6367f49b9304',
            ShiftID: '18ab99ab-9a34-4247-8440-c7ce3b73fdd0',
            ShiftName: 'Hành Chính (08:00 - 17:00)',
            WorkDate: '/Date(1595955600000)/',
            WorkDateView: '29/07/2020',
            DayOffWeek: 'T4',
            InTime1: null,
            InTimeLabel: 'Vào',
            OutTime1: null,
            OutTimeLabel: 'Ra',
            WorkHours: 0,
            NightWorkHours: 0,
            LateDuration1: 0,
            LateDuration1Label: '',
            EarlyDuration1: 0,
            EarlyDuration1Label: '',
            ListLeaveday: [
                {
                    LeavedayTypeName: 'LuanTest_Nghỉ không có tối đa',
                    LeaveHours: 8,
                    StatusLeave: 'E_REJECTED',
                    StatusLeaveView: 'Từ chối'
                }
            ],
            ListOvertime: [
                {
                    OvertimeTypeName: 'Ngày thường',
                    StatusOvertime: 'E_SUBMIT',
                    StatusOvertimeView: 'Yêu cầu',
                    OvertimeHours: 1
                }
            ],
            TotalLeavedays: 1,
            TotalLeaveBussinessdays: 0,
            TotalOvertimeHours: 28,
            TotalWorkdays: 27,
            TotalRealWorkdays: 0,
            Workday: 29,
            IsDateNow: false,
            WeekInMonth: 5,
            TitleWeek: null,
            CountIndex: 33,
            ID: '15da103a-ef99-46aa-9c2c-6ffb8bdb2fb9',
            ServerUpdate: null,
            ServerCreate: null,
            UserUpdate: null,
            UserCreate: null,
            DateCreate: null,
            DateUpdate: '/Date(1595932227054)/',
            UserLockID: null,
            DateLock: null,
            IsDelete: null,
            IPCreate: null,
            IPUpdate: null,
            TotalRow: 0,
            OrgParent1: null,
            OrgParent2: null,
            OrgParentCode1: null,
            OrgParentCode2: null,
            OrgParentEN1: null,
            OrgParentEN2: null,
            ActionStatus: null,
            Label: null,
            LabelView: null
        }
    ],
    '2020-07-28': [
        {
            ProfileID: '136a8e27-7bc2-4e09-b434-6367f49b9304',
            ShiftID: '18ab99ab-9a34-4247-8440-c7ce3b73fdd0',
            ShiftName: 'Hành Chính (08:00 - 17:00)',
            WorkDate: '/Date(1595869200000)/',
            WorkDateView: '28/07/2020',
            DayOffWeek: 'T3',
            InTime1: null,
            InTimeLabel: 'Vào',
            OutTime1: null,
            OutTimeLabel: 'Ra',
            WorkHours: 0,
            NightWorkHours: 0,
            LateDuration1: 480,
            LateDuration1Label: 'Vào trễ',
            EarlyDuration1: 0,
            EarlyDuration1Label: 'Ra sớm',
            ListLeaveday: [
                {
                    LeavedayTypeName: 'LuanTest_Nghỉ không có tối đa',
                    LeaveHours: 8,
                    StatusLeave: 'E_REJECTED',
                    StatusLeaveView: 'Từ chối'
                }
            ],
            ListOvertime: [
                {
                    OvertimeTypeName: 'Ngày thường',
                    StatusOvertime: 'E_SUBMIT',
                    StatusOvertimeView: 'Yêu cầu',
                    OvertimeHours: 1
                }
            ],
            TotalLeavedays: 1,
            TotalLeaveBussinessdays: 0,
            TotalOvertimeHours: 28,
            TotalWorkdays: 27,
            TotalRealWorkdays: 0,
            Workday: 28,
            IsDateNow: true,
            WeekInMonth: 5,
            TitleWeek: null,
            CountIndex: 32,
            ID: '039fbb0a-ec03-41e7-af28-1fc77e63693c',
            ServerUpdate: null,
            ServerCreate: null,
            UserUpdate: null,
            UserCreate: null,
            DateCreate: null,
            DateUpdate: '/Date(1595932227054)/',
            UserLockID: null,
            DateLock: null,
            IsDelete: null,
            IPCreate: null,
            IPUpdate: null,
            TotalRow: 0,
            OrgParent1: null,
            OrgParent2: null,
            OrgParentCode1: null,
            OrgParentCode2: null,
            OrgParentEN1: null,
            OrgParentEN2: null,
            ActionStatus: null,
            Label: null,
            LabelView: null
        }
    ],
    '2020-07-27': [
        {
            ProfileID: '136a8e27-7bc2-4e09-b434-6367f49b9304',
            ShiftID: '18ab99ab-9a34-4247-8440-c7ce3b73fdd0',
            ShiftName: 'Hành Chính (08:00 - 17:00)',
            WorkDate: '/Date(1595782800000)/',
            WorkDateView: '27/07/2020',
            DayOffWeek: 'T2',
            InTime1: null,
            InTimeLabel: 'Vào',
            OutTime1: null,
            OutTimeLabel: 'Ra',
            WorkHours: 0,
            NightWorkHours: 0,
            LateDuration1: 480,
            LateDuration1Label: 'Vào trễ',
            EarlyDuration1: 0,
            EarlyDuration1Label: 'Ra sớm',
            ListLeaveday: [
                {
                    LeavedayTypeName: 'LuanTest_Nghỉ không có tối đa',
                    LeaveHours: 8,
                    StatusLeave: 'E_REJECTED',
                    StatusLeaveView: 'Từ chối'
                }
            ],
            ListOvertime: [],
            TotalLeavedays: 1,
            TotalLeaveBussinessdays: 0,
            TotalOvertimeHours: 28,
            TotalWorkdays: 27,
            TotalRealWorkdays: 0,
            Workday: 27,
            IsDateNow: false,
            WeekInMonth: 5,
            TitleWeek: null,
            CountIndex: 31,
            ID: '09dfc6e7-5450-4cd3-b8df-5f3f5aa3c951',
            ServerUpdate: null,
            ServerCreate: null,
            UserUpdate: null,
            UserCreate: null,
            DateCreate: null,
            DateUpdate: '/Date(1595932227054)/',
            UserLockID: null,
            DateLock: null,
            IsDelete: null,
            IPCreate: null,
            IPUpdate: null,
            TotalRow: 0,
            OrgParent1: null,
            OrgParent2: null,
            OrgParentCode1: null,
            OrgParentCode2: null,
            OrgParentEN1: null,
            OrgParentEN2: null,
            ActionStatus: null,
            Label: null,
            LabelView: null
        }
    ],
    '2020-07-26': [
        {
            ProfileID: '136a8e27-7bc2-4e09-b434-6367f49b9304',
            ShiftID: '18ab99ab-9a34-4247-8440-c7ce3b73fdd0',
            ShiftName: 'Hành Chính (08:00 - 17:00)',
            WorkDate: '/Date(1596128400000)/',
            WorkDateView: '31/07/2020',
            DayOffWeek: 'T6',
            InTime1: null,
            InTimeLabel: 'Vào',
            OutTime1: null,
            OutTimeLabel: 'Ra',
            WorkHours: 0,
            NightWorkHours: 0,
            LateDuration1: 0,
            LateDuration1Label: '',
            EarlyDuration1: 0,
            EarlyDuration1Label: '',
            ListLeaveday: [
                {
                    LeavedayTypeName: 'LuanTest_Nghỉ không có tối đa',
                    LeaveHours: 8,
                    StatusLeave: 'E_REJECTED',
                    StatusLeaveView: 'Từ chối'
                }
            ],
            ListOvertime: [],
            TotalLeavedays: 1,
            TotalLeaveBussinessdays: 0,
            TotalOvertimeHours: 28,
            TotalWorkdays: 27,
            TotalRealWorkdays: 0,
            Workday: 31,
            IsDateNow: false,
            WeekInMonth: 5,
            TitleWeek: null,
            CountIndex: 35,
            ID: '2f82024c-fefe-4fc1-af44-ba09575abd62',
            ServerUpdate: null,
            ServerCreate: null,
            UserUpdate: null,
            UserCreate: null,
            DateCreate: null,
            DateUpdate: '/Date(1595932227054)/',
            UserLockID: null,
            DateLock: null,
            IsDelete: null,
            IPCreate: null,
            IPUpdate: null,
            TotalRow: 0,
            OrgParent1: null,
            OrgParent2: null,
            OrgParentCode1: null,
            OrgParentCode2: null,
            OrgParentEN1: null,
            OrgParentEN2: null,
            ActionStatus: null,
            Label: null,
            LabelView: null
        }
    ]
};
export default class WorkDay extends Component {
    constructor(porps) {
        super(porps);

        this.state = {
            items: {},
            isLoadingItems: false
        };
        this.listItemOpenSwipeOut = {}; //[];
        this.oldIndexOpenSwipeOut = null;
    }

    loadItems() {
        this.setState({ isLoadingItems: true });
        setTimeout(() => {
            //for (let i = -15; i < 85; i++) {
            //     const time = day.timestamp + i * 24 * 60 * 60 * 1000;
            //     const strTime = this.timeToString(time);
            //     if (!this.state.items[strTime]) {
            //         this.state.items[strTime] = [];
            //         const numItems = Math.floor(Math.random() * 3 + 1);
            //         for (let j = 0; j < numItems; j++) {
            //             this.state.items[strTime].push({
            //                 name: 'Item for ' + strTime + ' #' + j,
            //                 height: Math.max(50, Math.floor(Math.random() * 150))
            //             });
            //         }
            //     }
            // }
            // const newItems = {};
            // Object.keys(this.state.items).forEach(key => { newItems[key] = this.state.items[key]; });

            // console.log(newItems, ___data, 'newItems2222')
            this.setState({
                items: ___data,
                isLoadingItems: false
            });
        }, 1000);
    }

    handerOpenSwipeOut = (indexOnOpen) => {
        if (this.oldIndexOpenSwipeOut !== null && this.oldIndexOpenSwipeOut != indexOnOpen) {
            if (
                !Vnr_Function.CheckIsNullOrEmpty(this.listItemOpenSwipeOut[this.oldIndexOpenSwipeOut]) &&
                this.listItemOpenSwipeOut[this.oldIndexOpenSwipeOut]['value'] != null
            ) {
                this.listItemOpenSwipeOut[this.oldIndexOpenSwipeOut]['value'].close();
            }
        }
        this.oldIndexOpenSwipeOut = indexOnOpen;
    };

    moveToDetail = (item) => {
        const { detail, rowTouch } = this.props;
        if (!Vnr_Function.CheckIsNullOrEmpty(rowTouch) && typeof rowTouch == 'function') {
            rowTouch();
        } else if (
            !Vnr_Function.CheckIsNullOrEmpty(detail) &&
            !Vnr_Function.CheckIsNullOrEmpty(detail.screenDetail) &&
            !Vnr_Function.CheckIsNullOrEmpty(detail.screenName)
        ) {
            DrawerServices.navigate(detail.screenDetail, {
                dataItem: item,
                screenName: detail.screenName
            });
        }
    };

    renderItem(item) {
        let _rowAction = [];
        if (PermissionForAppMobile && PermissionForAppMobile.value) {
            const permission = PermissionForAppMobile.value;

            if (
                permission['New_Att_Leaveday_New_Index_Portal'] &&
                permission['New_Att_Leaveday_New_Index_Portal']['Create']
            ) {
                _rowAction = [
                    {
                        ..._rowAction,
                        type: 'E_LEAVEDAY',

                        title: translate('HRM_LeaveDayRegister'),
                        isSheet: false,
                        onPress: (item) => {
                            DrawerServices.navigate('AttSubmitLeaveDayAddOrEdit', {
                                workDayItem: { ...item },
                                reload: this.refreshList,
                                goBack: 'WorkDay'
                            });
                        }
                    }
                ];
            }

            if (
                permission['New_Att_Overtime_New_Index_Portal'] &&
                permission['New_Att_Overtime_New_Index_Portal']['Create']
            ) {
                _rowAction = [
                    ..._rowAction,
                    {
                        type: 'E_OVERTIME',
                        title: translate('HRM_OvertimeRegister'),
                        isSheet: false,
                        onPress: (item) => {
                            DrawerServices.navigate('AttSubmitOvertimeAddOrEdit', {
                                workDayItem: { ...item },
                                reload: this.refreshList,
                                goBack: 'WorkDay'
                            });
                        }
                    }
                ];
            }

            if (
                permission['New_Att_TamScanLogRegister_New_Index_Portal'] &&
                permission['New_Att_TamScanLogRegister_New_Index_Portal']['Create']
            ) {
                _rowAction = [
                    ..._rowAction,
                    {
                        type: 'E_INOUT',
                        title: translate('HRM_AddInOut'),
                        isSheet: false,
                        onPress: (item) => {
                            this.setState({ isOnUpdateInOut: true, dataItemForAddInOut: item });
                        }
                    }
                ];
            }
        }
        return (
            <TouchableWithoutFeedback
                onPress={() => {
                    // this.moveToDetail(item);
                }}
                onPressIn={() => {
                    this.handerOpenSwipeOut(item.ID);
                }}
                style={styles.styViewBtnWrap}
            >
                <View style={styles.styViewRenderItem}>
                    <RenderItem
                        index={item.ID}
                        dataItem={item}
                        rowActions={[..._rowAction]}
                        listItemOpenSwipeOut={this.listItemOpenSwipeOut}
                        handerOpenSwipeOut={this.handerOpenSwipeOut}
                    />
                </View>
            </TouchableWithoutFeedback>
        );
        // return (
        //     <TouchableOpacity
        //         testID={testIDs.agenda.ITEM}
        //         style={[styles.item, { height: item.height }]}
        //         onPress={() => Alert.alert(item.name)}
        //     >
        //         <Text>{item.name}</Text>
        //     </TouchableOpacity>
        // );
    }

    renderEmptyDate() {
        return (
            <View style={styles.emptyDate}>
                <Text>This is empty date!</Text>
            </View>
        );
    }

    rowHasChanged(r1, r2) {
        return r1.name !== r2.name;
    }

    timeToString(time) {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }

    render() {
        const vacation = { key: 'vacation', color: 'red', selectedDotColor: 'blue' };
        const massage = { key: 'massage', color: 'blue', selectedDotColor: 'blue' };
        const workout = { key: 'workout', color: 'green' };
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <Agenda
                    //displayLoadingIndicator={this.state.isLoadingItems}
                    // loadItemsForMonth={(month) => { console.log('trigger items loading', month) }}
                    minDate={'2020-07-08'}
                    // Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined
                    maxDate={'2020-08-09'}
                    testID={testIDs.agenda.CONTAINER}
                    items={this.state.items}
                    loadItemsForMonth={(month) => {
                        this.loadItems(month);
                    }}
                    pagingEnabled={true}
                    scrollEnabled={false}
                    selected={'2020-07-28'}
                    renderItem={this.renderItem.bind(this)}
                    renderEmptyDate={this.renderEmptyDate.bind(this)}
                    renderDay={() => {
                        return <View />;
                    }}
                    rowHasChanged={this.rowHasChanged.bind(this)}
                    onDayPress={() => {}}
                    // Callback that gets called when day changes while scrolling agenda list
                    onDayChange={() => {}}
                    markingType={'multi-dot'}
                    markedDates={{
                        '2020-07-08': { dots: [vacation, massage, workout], selected: false },
                        '2020-07-09': { textColor: '#43515c' },
                        '2020-07-14': { dots: [vacation, massage, workout], selected: false },
                        '2020-07-21': { dots: [massage, workout], disabled: true },
                        '2020-07-22': { dots: [massage, workout], disabled: true }
                    }}
                    // monthFormat={'yyyy'}
                    theme={{
                        //backgroundColor: '#ffffff',
                        //calendarBackground: '#ffffff',
                        //textSectionTitleColor: '#b6c1cd',
                        textSectionTitleDisabledColor: '#d9e1e8',
                        selectedDayBackgroundColor: Colors.primary,
                        // selectedDayTextColor: '#ffffff',
                        todayTextColor: Colors.primary,
                        // dayTextColor: '#2d4150',
                        // textDisabledColor: '#d9e1e8',
                        dotColor: Colors.primary,
                        // selectedDotColor: '#ffffff',
                        // arrowColor: 'orange',
                        // disabledArrowColor: '#d9e1e8',
                        // monthTextColor: 'blue',
                        indicatorColor: Colors.primary
                        // textDayFontFamily: 'monospace',
                        // textMonthFontFamily: 'monospace',
                        // textDayHeaderFontFamily: 'monospace',
                        //textDayFontWeight: '300',
                        //textMonthFontWeight: 'bold',
                        //textDayHeaderFontWeight: '300',
                        //textDayFontSize: 16,
                        // textMonthFontSize: 16,
                        //textDayHeaderFontSize: 16
                    }}
                    //renderDay={(day, item) => (<Text>{day ? day.day : 'item'}</Text>)}
                    //hideExtraDays={false}
                />
                {/* <View style={[styleSheets.container]}>
                    {
                        valueCutOffDuration && (
                            <View style={[styleSheets.col_10]}>
                                <View style={[styleSheets.col_1]}>
                                    <VnrPicker
                                        key={configPicker.fieldName}
                                        {...configPicker}
                                        value={valueCutOffDuration}
                                        onFinish={(Item) => {
                                            if (!Vnr_Function.CheckIsNullOrEmpty(Item)) {
                                                this.setState(state => {
                                                    state[configPicker.fieldName]
                                                        = Item[configPicker.valueField]
                                                });

                                                this.props.setValue(Item);
                                            }
                                        }}
                                    />
                                </View>
                                <View style={[styleSheets.col_9]}>
                                    <VnrListItem
                                        detail={{
                                            dataLocal: false,
                                            screenDetail: "WorkDayViewDetail",
                                            screenName: "GeneralInfoAttWorkDay"
                                        }}
                                        api={{
                                            urlApi: '[URI_HR]/Att_GetData/GetWorkDayByProIDandCutOID',
                                            type: "E_POST",
                                            dataBody: {
                                                profileID: '136a8e27-7bc2-4e09-b434-6367f49b9304',
                                                CutOffDurationID: valueCutOffDuration.ID
                                            },
                                            pageSize: 20
                                        }}
                                        valueField="ID"
                                        headerConfig={{
                                            ProfileID: "c064ab94-e195-485b-847c-238e0d4798e2",
                                            sysuserid: "c064ab94-e195-485b-847c-238e0d4798e2",
                                            userid: "136a8e27-7bc2-4e09-b434-6367f49b9304",
                                            userlogin: "nam.hoang"
                                        }}
                                        renderConfig={listConfig["ScreenList"]}
                                    />
                                </View>
                            </View>
                        )
                    }
                </View> */}
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    styViewRenderItem: {
        flex: 1,
        // marginVertical: 5,
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 1
    },
    styViewBtnWrap: { backgroundColor: Colors.red, flex: 1 },
    emptyDate: {
        height: 15,
        flex: 1,
        paddingTop: 30
    }
});
// const mapStateToProps = state => {
//     return {
//         dataCutOffDuration: state.cutOffDuration.data,
//         valueCutOffDuration: state.cutOffDuration.value,
//     };
// };
// const mapDispatchToProps = dispatch => {
//     return {
//         fetchCutOffDuration: () => {
//             dispatch(cutOffDuration.actions.fetchCutOffDuration());
//         },
//         setValue: val => {
//             dispatch(cutOffDuration.actions.setValueCutOffDuration(val));
//         }
//     }
// }

// export default connect(mapStateToProps, mapDispatchToProps)(WorkDay)
