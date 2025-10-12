import React, { Component } from 'react';
import { View, Platform, Animated, TouchableOpacity, StyleSheet } from 'react-native';
import { EnumStatus, EnumName, EnumTask } from '../../../../../../../assets/constant';
import Vnr_Function from '../../../../../../../utils/Vnr_Function';
import EmptyData from '../../../../../../../components/EmptyData/EmptyData';
import {
    ExpandableCalendar,
    CalendarProvider,
    AgendaList
} from '../../../../../../../node_modules/react-native-calendars';
import { connect } from 'react-redux';
import { startTask } from '../../../../../../../factories/BackGroundTask';
import { getDataLocal } from '../../../../../../../factories/LocalData';
import DrawerServices from '../../../../../../../utils/DrawerServices';
import { Colors, styleSheets, Size, styleSafeAreaView } from '../../../../../../../constants/styleConfig';
import moment from 'moment';
import { SafeAreaView } from 'react-native-safe-area-context';
import VnrLoadingScreen from '../../../../../../../components/VnrLoading/VnrLoadingScreen';
import HreInterviewCalendarListItem from '../hreInterviewCalendarList/HreInterviewCalendarListItem';
import VnrIndeterminate from '../../../../../../../components/VnrLoading/VnrIndeterminate';
import { IconHome } from '../../../../../../../constants/Icons';
import { generateRowActionAndSelected } from '../../hreInterview/hreWaitingInterview/HreWaitingInterviewBusiness';

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
            // dotColor: 'transparent',
            indicatorColor: Colors.primary,
            dayTextColor: Colors.gray_10,
            arrowColor: Colors.gray_9,
            textDayFontFamily: Platform.OS == 'android' ? 'Roboto-Regular' : 'AvenirNext-Regular',
            textMonthFontFamily: Platform.OS == 'android' ? 'Roboto-Regular' : 'AvenirNext-Regular',
            textDayHeaderFontFamily: Platform.OS == 'android' ? 'Roboto-Regular' : 'AvenirNext-Regular',
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
                // staticHeader: {
                //     position: 'absolute',
                //     left: 0,
                //     right: 0,
                //     top: 0,
                //     backgroundColor: Colors.white,
                //     paddingHorizontal: 0
                // },
                // calendar: {
                //     paddingLeft: 15,
                //     paddingRight: 0
                // }
            }
        }
    },
    customContainerMarked: {
        container: {
            backgroundColor: Colors.gray_2,
            borderRadius: 1,
            marginLeft: 30
        }
    }
};

class HreInterviewCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isLoadingHeader: true, //biến loading calendar
            isLoading: false, //biến loading
            // // minDate: moment(new Date()).startOf('month').format('YYYY-MM-DD'),
            // maxDate: moment(new Date()).endOf('month').format('YYYY-MM-DD'),
            daySelected: moment().format('YYYY-MM-DD'),
            listMarked: {},
            monthSelected: moment().format('YYYY-MM-DD'), //thang select, mac dinh thang hien tai
            data: null,
            keyQuery: EnumName.E_PRIMARY_DATA,
            isLazyLoading: false,
            dataChange: false, //biến check dữ liệu có thay đổi hay không
            refreshing: false,
            isExpandCalendar: false,
            isRefreshList: false,
            disableBtnViewDetail: true
        };
        this.scrollViewRef = React.createRef(); //ref đến scroll lịch
        this.hreEventCalendarListRef = React.createRef(); //ref đến list scroll

        this.scrollYAnimatedValue = new Animated.Value(0);
        this.scrollY = new Animated.Value(0);

        this.storeParamsDefault = null; //biến lưu param default
        this.paramsFilter = null; //biến lưu lại object filter
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
        const { keyQuery, daySelected } = this.state;

        const startWeek = moment(daySelected).startOf('W'),
            endWeek = moment(daySelected).endOf('W'),
            _payload = {
                DateStart: Vnr_Function.formatDateAPI(startWeek),
                DateEnd: Vnr_Function.formatDateAPI(endWeek, true),
                keyQuery: keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA
            };

        startTask({
            keyTask: EnumTask.KT_HreInterviewCalendar,
            payload: _payload
        });
    };

    componentDidMount() {
        this.generaRender();
    }

    paramsDefault = () => {
        const date = new Date();
        const dataRowActionAndSelected = generateRowActionAndSelected();
        const startWeek = moment(date).startOf('W'),
            endWeek = moment(date).endOf('W');

        return {
            rowActions: dataRowActionAndSelected.rowActions,
            DateStart: Vnr_Function.formatDateAPI(startWeek),
            DateEnd: Vnr_Function.formatDateAPI(endWeek, true)
        };
    };

    generaRender = () => {
        const param = this.paramsDefault();

        this.setState(
            {
                ...param,
                daySelected: moment().format('YYYY-MM-DD'),
                minDate: moment(param.DateStart).format('YYYY-MM-DD'),
                maxDate: moment(param.DateEnd).format('YYYY-MM-DD'),
                isRefreshList: !this.state.isRefreshList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isLoading: true
            },
            () => {
                this.loadItems();
                startTask({
                    keyTask: EnumTask.KT_HreInterviewCalendar,
                    payload: {
                        ...param,
                        keyQuery: EnumName.E_PRIMARY_DATA,
                        isCompare: true,
                        reload: this.loadItems
                    }
                });
            }
        );
    };

    loadItems = (isLazyLoading) => {
        // eslint-disable-next-line no-unused-vars
        const { keyQuery } = this.state;

        this.setState({ isLoading: true });
        getDataLocal(EnumTask.KT_HreInterviewCalendar).then((resData) => {
            const res = resData && resData[keyQuery] ? resData[keyQuery] : null;
            if (res && res.Status == EnumName.E_SUCCESS && res.Data && res.Data.length > 0) {
                let _listMarked = {},
                    _dataSource = [];
                //_daySelected = null;

                _dataSource = res.Data.map((item) => {
                    const dateTime = moment(item.Date).format('YYYY-MM-DD');
                    _listMarked[dateTime] = { marked: true, dotColor: Colors.primary, activeOpacity: 0 };

                    // if (_daySelected == null) {
                    //     _daySelected = dateTime;
                    // }
                    item.title = dateTime;
                    item.source = item.data;
                    item.data = (item.data && item.data.length > 0) ? [item.data[0]] : [{}];
                    return item;
                });

                this.setState({
                    //daySelected : _daySelected,
                    data: _dataSource,
                    listMarked: _listMarked,
                    isLoading: false,
                    isLoadingHeader: isLazyLoading ? false : true
                });
            } else {
                this.setState({
                    data: EnumName.E_EMPTYDATA,
                    listMarked: {},
                    isLoading: false,
                    isLoadingHeader: isLazyLoading ? false : true,
                    disableBtnViewDetail : false
                });
            }
        });
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == EnumTask.KT_HreInterviewCalendar) {
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

    onDayPress = (dayChagne) => {
        this.setState(
            {
                daySelected: dayChagne
            },
            this.onChangeDay(dayChagne)
        );
    };

    onChangeDay = (value) => {
        if (!value ) {
            return;
        }
        const { minDate, maxDate } = this.state;
        if (moment(value) < moment(minDate) || moment(value) > moment(maxDate)) {
            const startWeek = moment(value).startOf('W'),
                endWeek = moment(value).endOf('W'),
                param = {
                    DateStart: Vnr_Function.formatDateAPI(startWeek),
                    DateEnd: Vnr_Function.formatDateAPI(endWeek, true)
                };


            this.setState(
                {
                    //daySelected: value.dateString,
                    minDate: moment(param.DateStart).format('YYYY-MM-DD'),
                    maxDate: moment(param.DateEnd).format('YYYY-MM-DD'),
                    isRefreshList: !this.state.isRefreshList,
                    keyQuery: EnumName.E_FILTER,
                    isLoading: true
                },
                () => {
                    Vnr_Function.delay(() => {
                        startTask({
                            keyTask: EnumTask.KT_HreInterviewCalendar,
                            payload: {
                                ...param,
                                keyQuery: EnumName.E_FILTER
                            }
                        });
                    }, 1000);
                }
            );
        }
    };

    handleCalendarToggled = () => {
        let { isExpandCalendar } = this.state;
        this.setState({
            isExpandCalendar: !isExpandCalendar
        });
    };

    renderItem(item) {
        const { rowActions } = this.state;
        if (item && item.section !== null) {
            return (
                <HreInterviewCalendarListItem
                    key={item.section.Date}
                    reloadScreenList={this.pullToRefresh}
                    dataItem={item.section}
                    rowActions={rowActions}
                />
            );
        }
    }

    onScrollEnd() {
        if (this.state.disableBtnViewDetail && Platform.OS === 'android')
            this.setState({
                disableBtnViewDetail: false
            });
    }

    render() {
        const { isLoading, data, daySelected, listMarked, disableBtnViewDetail } = this.state;

        let contentList = <View />;
        if (isLoading) {
            contentList = <VnrLoadingScreen size="large" isVisible={isLoading} type={EnumStatus.E_APPROVE} />;
        } else if (data == EnumName.E_EMPTYDATA) {
            contentList = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (!Vnr_Function.CheckIsNullOrEmpty(data) && Object.keys(data).length > 0) {
            contentList = (
                <AgendaList
                    ref={(refAgenda) => (this.refAgenda = refAgenda)}
                    testID={testIDs.agenda.CONTAINER}
                    sections={data}
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
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styles.styViewContainerWrap}>
                    <TouchableOpacity style={styles.styBtnGoHome} onPress={() => DrawerServices.goBack()}>
                        <IconHome color={Colors.gray_10} size={Size.iconSizeHeader} />
                    </TouchableOpacity>

                    <CalendarProvider
                        date={daySelected}
                        onDateChanged={(item) => this.onDayPress(item)}
                        // onMonthChange={(month) => this.onChangeMonth(month)}
                    >
                        <ExpandableCalendar
                            testID={testIDs.expandableCalendar.CONTAINER}
                            theme={testIDs.theme.CONTAINER}
                            firstDay={1}
                            markingType={'dot'}
                            markedDates={listMarked}
                            // minDate={minDate}
                            // maxDate={maxDate}
                            // onCalendarToggled={() => this.handleCalendarToggled()}
                            // renderHeader={() => <VnrText i18nKey={'Lịch phỏng vấn'} style={styleSheets.headerTitleStyle}/>}
                        />
                        {this._renderHeaderLoading()}
                        {disableBtnViewDetail && <View style={styles.opacityTransparent} />}
                        {contentList}
                    </CalendarProvider>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styViewContainerWrap: {
        position: 'relative',
        top: 0,
        right: 0,
        left: 0,
        height: '100%',
        elevation: 99
    },
    styBtnGoHome: {
        position: 'absolute',
        top: 13,
        left: Size.defineSpace,
        elevation: 4,
        zIndex: 4
    },
    styAgenda: {
        flex: 1,
        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineSpace,
        backgroundColor: Colors.gray_2
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
    }
});

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

// export default HreEventCalendar

export default connect(mapStateToProps, null)(HreInterviewCalendar);
