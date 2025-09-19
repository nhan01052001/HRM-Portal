import React, { Component } from 'react';
// import { View, StyleSheet, } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import moment from 'moment';
import { Colors, Size, styleSheets, styleSafeAreaView } from '../../../../constants/styleConfig';
import { RefreshControl, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Agenda } from '../../../../node_modules/react-native-calendars';
import AttDataWorkdaysEmpsItem from './AttDataWorkdaysEmpsItem';
import DrawerServices from '../../../../utils/DrawerServices';
import HttpService from '../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import { VnrLoadingSevices } from '../../../../components/VnrLoading/VnrLoadingPages';
import VnrText from '../../../../components/VnrText/VnrText';
import { EnumName } from '../../../../assets/constant';
import EmptyData from '../../../../components/EmptyData/EmptyData';

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

export default class AttDataWorkdaysEmps extends Component {
    constructor(porps) {
        super(porps);

        this.state = {
            dataCalendar: {},
            listMarked: {},
            isLoading: false,
            isGetOT: true,
            isGetLD: true,
            isGetRT: true,
            daySelected: moment(new Date()).format('YYYY-MM-DD'),
            currentDate: null,
            calendarToggled: false,
            isCheckAll: true,
            isCheckLeave: false,
            ischeckRoster: false,
            isCheckOvertime: false,
            refreshing: false
        };
        this.listItemOpenSwipeOut = {}; //[];
        this.oldIndexOpenSwipeOut = null;
        this.refAgenda = null;
    }

    loadItems(date) {
        const { isCheckAll, isCheckLeave, ischeckRoster, isCheckOvertime } = this.state;

        this.setState({ isLoading: true });
        !date.isPullToRefresh && VnrLoadingSevices.show();

        const y = date.year,
            m = date.month,
            dateStart = moment(new Date(y, m - 1, 1)).format('MM/DD/YYYY hh:mm:ss A'),
            dateEnd = moment(new Date(y, m, 0)).format('MM/DD/YYYY hh:mm:ss A'),
            _dataBody = {
                ...{
                    DateStart: dateStart,
                    DateEnd: dateEnd,
                    IsGetOT: isCheckAll ? true : isCheckOvertime,
                    IsGetLD: isCheckAll ? true : isCheckLeave,
                    IsGetRT: isCheckAll ? true : ischeckRoster,
                    IsGetFT: false,
                    IsGetPOT: false,
                    ProfileID: dataVnrStorage.currentUser.info.ProfileID
                }
            };
        HttpService.Post('[URI_HR]/Att_GetData/GetWorkDayData', _dataBody, null, this.reload).then(res => {
            try {
                const listMarker = {
                        E_OVERTIME: { key: 'E_OVERTIME', color: Colors.red },
                        E_LEAVE_DAY: { key: 'E_LEAVE_DAY', color: Colors.purple },
                        E_ROSTER: { key: 'E_ROSTER', color: Colors.green }
                    },
                    listData = {},
                    listMarked = {};
                if (res && Array.isArray(res) && res.length > 0) {
                    res.forEach(item => {
                        let dateTime = moment(item.DateStart).format('YYYY-MM-DD'),
                            calendertype = item.CalendarType;

                        if (listMarked[dateTime]) {
                            if (!listMarked[dateTime]['added'][calendertype]) {
                                listMarked[dateTime]['dots'].push(listMarker[calendertype]);
                                listMarked[dateTime]['added'][calendertype] = true;
                            }
                        } else {
                            listMarked[dateTime] = {
                                dots: [listMarker[calendertype]],
                                added: { [calendertype]: true }
                            };
                        }

                        if (listData[dateTime]) {
                            let calendarItem = listData[dateTime];
                            if (calendarItem[0] && calendarItem[0]['data']) {
                                calendarItem[0]['data'].push(item);
                            }
                        } else {
                            listData[dateTime] = [{ data: [item], dateTime: item.DateStart }];
                        }
                    });
                }
                this.setState({
                    dataCalendar: listData,
                    listMarked: listMarked,
                    isLoading: false,
                    daySelected: date.dateString,
                    refreshing: false,
                    currentDate: {
                        year: date.year,
                        month: date.month
                    }
                });
                setTimeout(() => {
                    VnrLoadingSevices.hide();
                }, 500);
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    }

    moveToDetail = item => {
        DrawerServices.navigate('AttDataWorkdaysEmpsViewDetail', {
            dataItem: item
        });
    };

    renderItem(item) {
        return (
            <TouchableOpacity
                onPress={() => this.moveToDetail(item)}
                style={{
                    width: Size.deviceWidth
                }}
            >
                <AttDataWorkdaysEmpsItem dataItem={item} />
            </TouchableOpacity>
        );
    }

    renderEmptyDate() {
        const { isLoading } = this.state;
        return (
            <View style={styles.emptyDate}>
                {!isLoading && <EmptyData messageEmptyData={'HRM_Sal_HoldSalary_NotData'} />}
            </View>
        );
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
        const { currentDate } = this.state;
        this.setState(
            {
                daySelected: date.dateString
            },
            () => {
                if (currentDate != null && (currentDate.month != date.month || currentDate.year != date.year)) {
                    this.loadItems({
                        year: date.year,
                        month: date.month
                    });
                }
            }
        );
    };

    reload = () => {
        const current = new Date(),
            newDate = {
                year: current.getFullYear(),
                month: current.getMonth() + 1
            };
        this.loadItems(newDate);
    };

    componentDidMount() {
        this.reload();
    }

    onchangeMonth = date => {
        this.loadItems({
            year: date.year,
            month: date.month
        });
        // this.loadItems()
    };

    setCheckBoxFilter = value => {
        let { currentDate } = this.state;

        switch (value) {
            case EnumName.E_ALL: {
                this.setState(
                    {
                        isCheckAll: true,
                        isCheckOvertime: false,
                        isCheckLeave: false,
                        ischeckRoster: false
                    },
                    () => this.loadItems(currentDate)
                );
                break;
            }
            case EnumName.E_OVERTIME: {
                this.setState(
                    {
                        isCheckAll: false,
                        isCheckOvertime: !this.state.isCheckOvertime
                    },
                    () => this.loadItems(currentDate)
                );
                break;
            }
            case EnumName.E_LEAVE_DAY: {
                this.setState(
                    {
                        isCheckAll: false,
                        isCheckLeave: !this.state.isCheckLeave
                    },
                    () => this.loadItems(currentDate)
                );
                break;
            }
            case EnumName.E_ROSTER: {
                this.setState(
                    {
                        isCheckAll: false,
                        ischeckRoster: !this.state.ischeckRoster
                    },
                    () => this.loadItems(currentDate)
                );
                break;
            }
        }
    };

    _handleRefresh = () => {
        const { currentDate } = this.state;
        this.setState({ refreshing: true }, () => this.loadItems({ isPullToRefresh: true, ...currentDate }));
    };

    render() {
        const {
            daySelected,
            listMarked,
            dataCalendar,
            calendarToggled,
            isCheckAll,
            isCheckLeave,
            ischeckRoster,
            isCheckOvertime,
            refreshing
        } = this.state;
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.containerGrey}>
                    <View style={styles.viewFilter}>
                        <TouchableOpacity
                            onPress={() => this.setCheckBoxFilter(EnumName.E_ALL)}
                            style={[
                                styles.viewFilterItem,
                                styles.viewFilterItemAll,
                                isCheckAll && styles.viewFilterItem__active
                            ]}
                        >
                            <VnrText
                                style={[styleSheets.text, isCheckAll && styles.viewFilterItem_text__active]}
                                i18nKey={'HRM_System_AllSetting'}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.setCheckBoxFilter(EnumName.E_OVERTIME)}
                            style={[styles.viewFilterItem, isCheckOvertime && styles.viewFilterItem__active]}
                        >
                            <VnrText
                                style={[styleSheets.text, isCheckOvertime && styles.viewFilterItem_text__active]}
                                i18nKey={'HRM_Att_Overtime'}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.setCheckBoxFilter(EnumName.E_LEAVE_DAY)}
                            style={[styles.viewFilterItem, isCheckLeave && styles.viewFilterItem__active]}
                        >
                            <VnrText
                                style={[styleSheets.text, isCheckLeave && styles.viewFilterItem_text__active]}
                                i18nKey={'HRM_Att_LeaveDay'}
                            />
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={() => this.setCheckBoxFilter(EnumName.E_ROSTER)}
                            style={[
                                styles.viewFilterItem,
                                styles.viewFilterItemSTC,
                                ischeckRoster && styles.viewFilterItem__active
                            ]}
                        >
                            <VnrText
                                style={[styleSheets.text, ischeckRoster && styles.viewFilterItem_text__active]}
                                i18nKey={'HRM_Attendance_ShiftName'}
                            />
                        </TouchableOpacity>
                    </View>
                    <Agenda
                        ref={refAgenda => (this.refAgenda = refAgenda)}
                        testID={testIDs.agenda.CONTAINER}
                        items={dataCalendar}
                        onCalendarToggled={calendarOpened => {
                            this.setState({
                                calendarToggled: calendarOpened
                            });
                        }}
                        onVisibleMonthsChange={months => {
                            calendarToggled &&
                                setTimeout(() => {
                                    this.loadItems(months[1]);
                                }, 200);
                        }}
                        selected={daySelected}
                        renderItem={this.renderItem.bind(this)}
                        renderEmptyDate={this.renderEmptyDate.bind(this)}
                        renderDay={() => {
                            return <View />;
                        }}
                        rowHasChanged={this.rowHasChanged.bind(this)}
                        onDayPress={day => this.onDayPress(day)}
                        renderEmptyData={this.renderEmptyDate.bind(this)}
                        onDayChange={day => this.onDayPress(day)}
                        markingType={'multi-dot'}
                        markedDates={listMarked}
                        theme={{
                            backgroundColor: Colors.gray_3,
                            textSectionTitleDisabledColor: Colors.grayD,
                            selectedDayBackgroundColor: Colors.primary,
                            todayTextColor: Colors.primary,
                            dotColor: Colors.primary,
                            indicatorColor: Colors.primary
                        }}
                        refreshControl={
                            <RefreshControl
                                onRefresh={() => this._handleRefresh()}
                                refreshing={refreshing}
                                size="large"
                                tintColor={Colors.primary}
                            />
                        }
                    />
                </View>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    emptyDate: {
        flex: 1
    },
    viewFilter: {
        width: Size.deviceWidth - Size.defineSpace * 2,
        marginVertical: Size.defineSpace / 2,
        marginHorizontal: Size.defineSpace,
        height: 40,
        flexDirection: 'row',
        borderRadius: 13,
        justifyContent: 'space-between'
    },
    viewFilterItem: {
        flexGrow: 1,
        borderColor: Colors.gray_5,
        borderWidth: 0.5,
        backgroundColor: Colors.white,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewFilterItemAll: {
        borderTopLeftRadius: 13,
        borderBottomLeftRadius: 13
    },
    viewFilterItemSTC: {
        borderTopRightRadius: 13,
        borderBottomRightRadius: 13
    },
    viewFilterItem__active: {
        borderColor: Colors.white,
        backgroundColor: Colors.primary
    },
    viewFilterItem_text__active: {
        fontWeight: '600',
        color: Colors.white
    }
});
