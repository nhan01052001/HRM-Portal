import React, { Component } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    styleSheets,
    Colors,
    Size,
    styleSafeAreaView
} from '../../../../../constants/styleConfig';
import moment from 'moment';
import {
    StyleSheet,
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    Platform,
    Animated
} from 'react-native';
import { ExpandableCalendar, CalendarProvider } from '../../../../../node_modules/react-native-calendars';
import Modal from 'react-native-modal';
import VnrIndeterminate from '../../../../../components/VnrLoading/VnrIndeterminate';
import { translate } from '../../../../../i18n/translate';
import HreEventCalendarList from '../hreEventCalendarList/HreEventCalendarList';
import { IconHome, IconEyeBlack, IconCancel } from '../../../../../constants/Icons';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName } from '../../../../../assets/constant';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrText from '../../../../../components/VnrText/VnrText';
import { connect } from 'react-redux';
import { EnumTask, EnumStatus } from '../../../../../assets/constant';
import { startTask } from '../../../../../factories/BackGroundTask';
import { getDataLocal } from '../../../../../factories/LocalData';
import VnrLoadingScreen from '../../../../../components/VnrLoading/VnrLoadingScreen';
import EmptyData from '../../../../../components/EmptyData/EmptyData';

let hreEventCalendarKeyTask = null;
// pageSizeList = 20;

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
            'stylesheet.expandable.main': {
                week: {
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
                    // paddingHorizontal: 10,
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
                //     backgroundColor: Colors.red,
                //     paddingHorizontal: 0
                // },
                // calendar: {
                //     paddingLeft: 0,
                //     paddingRight: 0,
                // },
            }
        }
    },
    customContainerMarked: {
        container: {
            backgroundColor: Colors.gray_2,
            borderRadius: 1,
            paddingLeft: 0,
            paddingRight: 0
        }
    }
};

const filter = [
    {
        name: 'HRM_PortalApp_EventCalendar_Event',
        listName: 'ListDataEvents'
    },
    {
        name: 'HRM_PortalApp_EventCalendar_LeaveDay',
        listName: 'ListDataLeaveday'
    },
    {
        name: 'HRM_PortalApp_EventCalendar_ProfileHire',
        listName: 'ListDataProfileHire'
    },
    {
        name: 'HRM_PortalApp_EventCalendar_BirthDay',
        listName: 'ListDataBirthDays'
    },
    {
        name: 'HRM_PortalApp_EventCalendar_Seniority',
        listName: 'ListDataSenior'
    },
    {
        name: 'HRM_PortalApp_EventCalendar_Resignation',
        listName: 'ListDataProfileQuit'
    },
    {
        name: 'HRM_PortalApp_EventCalendar_Holiday',
        listName: 'ListDataDayOff'
    }
];

class HreEventCalendar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isVisible: false,
            isLoadingHeader: true, //biến loading calendar
            isLoading: true, //biến loading
            minDate: moment(new Date())
                .startOf('month')
                .format('YYYY-MM-DD'),
            maxDate: moment(new Date())
                .endOf('month')
                .format('YYYY-MM-DD'),
            daySelected: moment(this.props.navigation.state.params?.DateCalendar).format('YYYY-MM-DD'),
            monthYearRange: null,
            listMarked: {},
            tempFilter: [],
            monthSelected: moment().format('YYYY-MM-DD'), //thang select, mac dinh thang hien tai
            filterText: [],
            data: [],
            keyQuery: EnumName.E_PRIMARY_DATA,
            isLazyLoading: false,
            dataChange: false, //biến check dữ liệu có thay đổi hay không
            refreshing: false,
            dataBackup: [],
            isNoFilter: false
        };
        this.scrollViewRef = React.createRef(); //ref đến scroll lịch
        this.hreEventCalendarListRef = React.createRef(); //ref đến list scroll

        this.scrollYAnimatedValue = new Animated.Value(0);
        this.scrollY = new Animated.Value(0);

        this.storeParamsDefault = null; //biến lưu param default
        this.paramsFilter = null; //biến lưu lại object filter
    }

    paramsDefault = () => {
        let _params = {
            Month: moment()
                .startOf('month')
                .format('YYYY-MM-DD'),
            FilterText: ''
        };

        return {
            dataBody: _params,
            keyQuery: EnumName.E_PRIMARY_DATA
        };
    };

    componentDidMount() {
        hreEventCalendarKeyTask = EnumTask.KT_HreEventCalendar;

        this.setState({
            tempFilter: filter.map(item => item.listName),
            filterText: filter.map(item => item.listName)
        });

        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault; // lưu param default
        this.loadItems();
        startTask({
            keyTask: hreEventCalendarKeyTask,
            payload: {
                ..._paramsDefault.dataBody,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.loadItems
            }
        });
    }

    loadItems(isLazyLoading) {
        const { keyQuery, daySelected, tempFilter, isNoFilter } = this.state;
        this.setState({ isLoading: true });
        getDataLocal(EnumTask.KT_HreEventCalendar)
            .then(resData => {
                const res = resData && resData[keyQuery] ? resData[keyQuery] : null;
                if (res && res.Status == EnumName.E_SUCCESS && res.Data) {
                    let listMarked = {};
                    let filteredData = null;
                    let handleData = res?.Data?.ListWorkdayByDate?.filter(
                        day =>
                            (day.ListDataEvents && day.ListDataEvents.length > 0) ||
                            (day.ListDataLeaveday && day.ListDataLeaveday.length > 0) ||
                            (day.ListDataProfileHire && day.ListDataProfileHire.length > 0) ||
                            (day.ListDataProfileQuit && day.ListDataProfileQuit.length > 0) ||
                            (day.ListDataSenior && day.ListDataSenior.length > 0) ||
                            (day.ListDataBirthDays && day.ListDataBirthDays.length > 0) ||
                            (day.ListDataDayOff && day.ListDataDayOff.length > 0)
                    );
                    // Lọc chỉ giữ lại các mục trong tháng
                    handleData = handleData.filter(item => {
                        const monthOfItem = new Date(item.DateCalendar).getMonth();
                        return monthOfItem === new Date(daySelected).getMonth();
                    });
                    if (tempFilter.length > 0 && tempFilter.length < filter.length) {
                        filteredData = handleData?.filter(day =>
                            tempFilter.some(key => day[key] && day[key].length > 0)
                        );
                        filteredData.forEach(item => {
                            let date = moment(item.DateCalendar).format('YYYY-MM-DD');
                            // Kiểm tra nếu date trùng với daySelected
                            if (date === daySelected) {
                                listMarked[date] = {
                                    // marked: true,
                                    customStyles: {
                                        text: {
                                            color: Colors.white
                                        },
                                        container: {
                                            backgroundColor: Colors.primary
                                        }
                                    }
                                };
                            } else {
                                // Nếu không trùng, thiết lập giá trị mặc định
                                listMarked[date] = {
                                    customStyles: {
                                        text: {
                                            color: Colors.pink
                                        }
                                    }
                                };
                            }
                        });
                    } else if (isNoFilter) {
                        filteredData = handleData?.filter(day =>
                            tempFilter.some(key => day[key] && day[key].length > 0)
                        );
                        filteredData.forEach(item => {
                            let date = moment(item.DateCalendar).format('YYYY-MM-DD');
                            // Kiểm tra nếu date trùng với daySelected
                            if (date === daySelected) {
                                listMarked[date] = {
                                    // marked: true,
                                    customStyles: {
                                        text: {
                                            color: Colors.white
                                        },
                                        container: {
                                            backgroundColor: Colors.primary
                                        }
                                    }
                                };
                            } else {
                                // Nếu không trùng, thiết lập giá trị mặc định
                                listMarked[date] = {
                                    customStyles: {
                                        text: {
                                            color: Colors.pink
                                        }
                                    }
                                };
                            }
                        });
                    } else {
                        handleData.forEach(item => {
                            let date = moment(item.DateCalendar).format('YYYY-MM-DD');
                            // Kiểm tra nếu date trùng với daySelected
                            if (date === daySelected) {
                                listMarked[date] = {
                                    // marked: true,
                                    customStyles: {
                                        text: {
                                            color: Colors.white
                                        },
                                        container: {
                                            backgroundColor: Colors.primary
                                        }
                                    }
                                };
                            } else {
                                // Nếu không trùng, thiết lập giá trị mặc định
                                listMarked[date] = {
                                    customStyles: {
                                        text: {
                                            color: Colors.pink
                                        }
                                    }
                                };
                            }
                        });
                    }

                    this.setState({
                        listMarked: listMarked,
                        data: filteredData ? filteredData : handleData,
                        dataBackup: handleData,
                        isLoading: false,
                        isLoadingHeader: isLazyLoading ? false : true,
                        refreshing: false
                    });
                } else if (res == EnumName.E_EMPTYDATA) {
                    this.setState({
                        data: [],
                        isLoading: false,
                        isLoadingHeader: isLazyLoading ? false : true
                    });
                }
            })
            .catch(error => {
                // eslint-disable-next-line no-console
                console.log('error: ', error);
            });
    }

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == hreEventCalendarKeyTask) {
            //khi màn hình đang reload thì messsage phải là filter thì màn hình mới reload
            if (keyQuery === EnumName.E_FILTER && nextProps.message && keyQuery == nextProps.message.keyQuery) {
                this.loadItems(true); //dữ liệu đổi thì reload datalocal
            } else if (nextProps.message && keyQuery == nextProps.message.keyQuery) {
                // dataChange == true ? khác : giống nhau
                if (!nextProps.message.dataChange) {
                    this.setState({
                        isLoadingHeader: false //dữ liệu không đổi thì ngừng load calendar
                    });
                } else {
                    this.loadItems(true); //dữ liệu đổi reload datalocal
                }
            }
        }
    }

    shouldComponentUpdate(nextState) {
        return !Vnr_Function.compare(nextState.data, this.state.data);
    }

    showModal = () => {
        return this.setState({ isVisible: true });
    };

    hideModal = callback => {
        this.setState({ isVisible: false }, () => {
            if (callback && typeof callback === 'function') {
                callback();
            }
        });
    };

    _renderHeaderLoading = () => {
        return <VnrIndeterminate isVisible={this.state.isLoadingHeader} />;
    };

    onFilter() {
        const { tempFilter, dataBackup } = this.state;
        const currentDate = moment().format('YYYY-MM-DD');
        let listMarked = {};

        this.hideModal(() => {
            const filteredData = dataBackup?.filter(day => tempFilter.some(key => day[key] && day[key].length > 0));
            filteredData.forEach(item => {
                let date = moment(item?.DateCalendar).format('YYYY-MM-DD');
                // Nếu không trùng, thiết lập giá trị mặc định
                if (date == currentDate) {
                    listMarked[currentDate] = {
                        // marked: true,
                        customStyles: {
                            text: {
                                color: Colors.primary
                            },
                            container: {
                                backgroundColor: 'transparent'
                            }
                        }
                    };
                } else {
                    listMarked[date] = {
                        customStyles: {
                            text: {
                                color: Colors.pink
                            }
                        }
                    };
                }
            });

            this.setState(
                {
                    filterText: tempFilter,
                    data: filteredData,
                    listMarked: listMarked
                },
                () => {
                    filteredData.length > 0 &&
                        this.onDayPress(moment(filteredData?.[0].DateCalendar).format('YYYY-MM-DD'));
                }
            );
        });
    }

    onDayPress = selectedDate => {
        const { listMarked, daySelected } = this.state;
        const currentDate = moment().format('YYYY-MM-DD');

        // Sao chép listMarked để tránh thay đổi trực tiếp state
        const updatedListMarked = { ...listMarked };

        // Khôi phục custom cũ cho ngày trước đó (nếu có)
        if (daySelected && daySelected !== currentDate && updatedListMarked[daySelected]) {
            updatedListMarked[daySelected] = {
                // marked: true,
                customStyles: {
                    text: {
                        color: Colors.pink
                    },
                    container: {
                        backgroundColor: 'transparent'
                    }
                }
            };
        } else if (daySelected && daySelected === currentDate && updatedListMarked[daySelected]) {
            updatedListMarked[daySelected] = {
                // marked: true,
                customStyles: {
                    text: {
                        color: Colors.primary
                    },
                    container: {
                        backgroundColor: 'transparent'
                    }
                }
            };
        }

        // Thực hiện tùy chỉnh listMarked cho ngày được chọn
        updatedListMarked[selectedDate] = {
            // marked: true,
            customStyles: {
                text: {
                    color: Colors.white
                },
                container: {
                    backgroundColor: Colors.primary
                }
            }
        };

        if (Object.keys(listMarked).includes(selectedDate)) {
            this.setState(
                {
                    daySelected: selectedDate,
                    listMarked: updatedListMarked
                },
                () => {
                    const indexToScroll = this.findIndexToScroll(selectedDate);
                    // Cuộn đến chỉ mục của HreEventCalendarListItem
                    this.scrollToEventListItem(indexToScroll);
                }
            );
        } else {
            const handleNotInList = { ...listMarked };
            if (daySelected && daySelected !== currentDate && handleNotInList[daySelected]) {
                handleNotInList[daySelected] = {
                    // marked: true,
                    customStyles: {
                        text: {
                            color: Colors.pink
                        },
                        container: {
                            backgroundColor: 'transparent'
                        }
                    }
                };
            } else if (daySelected && daySelected === currentDate && handleNotInList[daySelected]) {
                handleNotInList[daySelected] = {
                    // marked: true,
                    customStyles: {
                        text: {
                            color: Colors.primary
                        },
                        container: {
                            backgroundColor: 'transparent'
                        }
                    }
                };
            }
            this.setState({
                daySelected: selectedDate,
                listMarked: handleNotInList
            });
        }
    };

    findIndexToScroll = selectedDate => {
        const { data } = this.state;
        const dataIndex = data.findIndex(item => moment(item.DateCalendar).format('YYYY-MM-DD') === selectedDate);
        return dataIndex >= 0 ? dataIndex : 0;
    };

    scrollToEventListItem = index => {
        if (this.scrollViewRef && this.hreEventCalendarListRef?.flatListRef) {
            this.scrollViewRef.scrollTo({
                y: this.hreEventCalendarListRef.flatListRef.props.getItemLayout(0, index).offset,
                animated: true
            });
        }
    };

    // _handleRefresh = () => {
    //     this.setState({ refreshing: true }, () => {
    //         this.pullToRefresh && this.pullToRefresh()
    //     });
    // };

    // pullToRefresh = () => {
    //     const { keyQuery } = this.state
    //     this.setState(
    //         {
    //             keyQuery:
    //                 keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA,
    //         },
    //         () => {
    //             console.log('pullToRefresh');
    //             startTask({
    //                 keyTask: hreEventCalendarKeyTask,
    //                 payload: {
    //                     keyQuery:
    //                         keyQuery == EnumName.E_FILTER
    //                             ? keyQuery
    //                             : EnumName.E_PRIMARY_DATA,
    //                     isCompare: false,
    //                     reload: this.loadItems,
    //                 },
    //             })
    //         },
    //     )
    // }

    onChangeMonth = value => {
        const { daySelected, tempFilter } = this.state;
        let isCheckNoFilterChangeMonth;
        if (tempFilter.length == 0) {
            isCheckNoFilterChangeMonth = true;
        }
        this.setState(
            {
                minDate: moment(daySelected)
                    .startOf('month')
                    .format('YYYY-MM-DD'),
                maxDate: moment(daySelected)
                    .endOf('month')
                    .format('YYYY-MM-DD'),
                isNoFilter: isCheckNoFilterChangeMonth,
                monthSelected: moment(value.dateString)
                    .startOf('month')
                    .format('YYYY-MM-DD'),
                keyQuery: EnumName.E_FILTER
            },
            () => {
                startTask({
                    keyTask: hreEventCalendarKeyTask,
                    payload: {
                        keyQuery: EnumName.E_FILTER,
                        Month: this.state.monthSelected,
                        isCompare: true,
                        reload: this.loadItems
                    }
                });
            }
        );
    };

    render() {
        const {
            data,
            isVisible,
            tempFilter,
            daySelected,
            monthSelected,
            isLoading,
            filterText,
            minDate,
            maxDate,
            listMarked
        } = this.state;

        const hasDataForFilter = data?.some(day => filterText.some(filterField => day[filterField]?.length > 0));
        let contentList = <View />;
        if (isLoading) {
            contentList = <VnrLoadingScreen size="large" isVisible={isLoading} type={EnumStatus.E_APPROVE} />;
        } else if (data == EnumName.E_EMPTYDATA || data.length == 0 || filterText.length == 0 || !hasDataForFilter) {
            contentList = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (!Vnr_Function.CheckIsNullOrEmpty(data) && data?.length > 0) {
            contentList = (
                <ScrollView
                    ref={ref => (this.scrollViewRef = ref)}
                    style={styles.styViewContentWrap}
                    // refreshControl={
                    //     <RefreshControl
                    //         onRefresh={() => this._handleRefresh()}
                    //         refreshing={refreshing}
                    //         size="large"
                    //         tintColor={Colors.primary}
                    //     />
                    // }
                >
                    <HreEventCalendarList
                        ref={ref => (this.hreEventCalendarListRef = ref)}
                        data={data}
                        monthSelected={monthSelected}
                        daySelected={daySelected}
                        pullToRefresh={this.pullToRefresh}
                        scrollToEventListItem={this.scrollToEventListItem}
                        filter={filterText}
                    />
                </ScrollView>
            );
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styles.styViewContainerWrap}>
                    <TouchableOpacity style={styles.styBtnGoHome} onPress={() => DrawerServices.goBack()}>
                        <IconHome color={Colors.gray_10} size={Size.iconSizeHeader} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.styBtnFilter} onPress={() => this.showModal()}>
                        <IconEyeBlack color={Colors.gray_10} size={Size.iconSizeHeader} />
                    </TouchableOpacity>
                    <CalendarProvider
                        date={daySelected}
                        onDateChanged={item => this.onDayPress(item)}
                        onMonthChange={month => this.onChangeMonth(month)}
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
                            // hideArrows
                            // hideExtraDays={true}
                        />
                        {/* {this._renderHeaderLoading()} */}

                        {contentList}
                    </CalendarProvider>
                </View>
                <Modal
                    isVisible={isVisible}
                    onBackdropPress={() => {
                        this.hideModal();
                    }}
                    animationIn="slideInUp" // Hiệu ứng khi modal hiển thị (hiệu ứng từ phía dưới lên)
                    animationOut="slideOutDown" // Hiệu ứng khi modal ẩn đi (hiệu ứng từ phía trên xuống)
                    backdropOpacity={0.7}
                    style={styles.modal}
                    onRequestClose={() => this.hideModal()}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <Text style={[styleSheets.lable, styles.styModalHeaderTExxt]}>
                                {translate('HRM_PortalApp_EventCalendar_InfoDisplay')}
                            </Text>
                            <TouchableOpacity
                                onPress={() => {
                                    this.hideModal();
                                }}
                            >
                                <IconCancel color={Colors.black} size={Size.iconSize} />
                            </TouchableOpacity>
                        </View>
                        <ScrollView>
                            {filter.map((item, index) => {
                                let icon = '';
                                if (item.name === 'HRM_PortalApp_EventCalendar_Event') {
                                    icon = require('../../../../../assets/images/hreWorkHistory/event.png');
                                } else if (item.name === 'HRM_PortalApp_EventCalendar_LeaveDay') {
                                    icon = require('../../../../../assets/images/hreWorkHistory/leaveDay.png');
                                } else if (item.name === 'HRM_PortalApp_EventCalendar_ProfileHire') {
                                    icon = require('../../../../../assets/images/hreWorkHistory/newEmp.png');
                                } else if (item.name === 'HRM_PortalApp_EventCalendar_BirthDay') {
                                    icon = require('../../../../../assets/images/hreWorkHistory/birthDay.png');
                                } else if (item.name === 'HRM_PortalApp_EventCalendar_Seniority') {
                                    icon = require('../../../../../assets/images/hreWorkHistory/growthYear.png');
                                } else if (item.name === 'HRM_PortalApp_EventCalendar_Resignation') {
                                    icon = require('../../../../../assets/images/hreWorkHistory/outWork.png');
                                } else if (item.name === 'HRM_PortalApp_EventCalendar_Holiday') {
                                    icon = require('../../../../../assets/images/hreWorkHistory/holiday.png');
                                }
                                const checkIcon = require('../../../../../assets/images/hreWorkHistory/check.png');
                                const uncheckIcon = require('../../../../../assets/images/hreWorkHistory/unCheck.png');

                                return (
                                    <TouchableOpacity
                                        key={index}
                                        onPress={() => {
                                            if (tempFilter.includes(item.listName)) {
                                                let newFilterCheck = tempFilter.filter(
                                                    itemFilter => itemFilter !== item.listName
                                                );
                                                return this.setState({ tempFilter: newFilterCheck });
                                            } else {
                                                return this.setState({ tempFilter: [...tempFilter, item.listName] });
                                            }
                                        }}
                                        style={styles.filterItem}
                                    >
                                        <Image
                                            source={icon}
                                            style={[
                                                Size.iconSize,
                                                styles.styViewImage
                                            ]}
                                            resizeMode={'contain'}
                                        />
                                        <Text style={[styleSheets.text, styles.styViewTextName]}>
                                            {translate(item.name)}
                                        </Text>
                                        <View>
                                            {tempFilter.includes(item.listName) ? (
                                                <Image
                                                    source={checkIcon}
                                                    style={[Size.iconSize, styles.styImageCheckIcon]}
                                                    resizeMode={'contain'}
                                                />
                                            ) : (
                                                <Image
                                                    source={uncheckIcon}
                                                    style={[Size.iconSize, styles.styImageCheckIcon]}
                                                    resizeMode={'contain'}
                                                />
                                            )}
                                        </View>
                                    </TouchableOpacity>
                                );
                            })}
                        </ScrollView>
                        <TouchableOpacity style={styles.applyButton} onPress={() => this.onFilter()}>
                            <VnrText
                                style={[styleSheets.lable, { color: Colors.white, fontSize: Size.text + 2 }]}
                                i18nKey={'HRM_Common_Apply'}
                            />
                        </TouchableOpacity>
                    </View>
                </Modal>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styModalHeaderTExxt: { fontWeight: '600',
        color: Colors.gray_10 },
    styViewContainerWrap: { position: 'relative',
        top: 0,
        right: 0,
        left: 0,
        height: '100%',
        elevation: 99 },
    styImageCheckIcon: { width: 24,
        height: 24 },
    styViewTextName: { fontSize: Size.text + 2,
        flex: 1 },
    styViewImage: { marginRight: Size.defineHalfSpace,
        width: 24,
        height: 24 },
    styViewContentWrap: {
        backgroundColor: Colors.gray_2,
        flex: 1,
        padding: Size.defineSpace
    },
    modal: {
        margin: 0
    },
    modalContainer: {
        backgroundColor: Colors.white,
        flexDirection: 'column',
        flex: 1,
        height: Size.deviceheight * 0.7,
        width: Size.deviceWidth,
        position: 'absolute',
        bottom: 0
    },
    modalHeader: {
        padding: Size.defineSpace,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: Colors.gray_2
    },
    filterItem: {
        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineSpace,
        backgroundColor: Colors.white,
        flexDirection: 'row',
        alignItems: 'center'
    },
    applyButton: {
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center',
        height: Size.heightButton,
        marginBottom: 10,
        marginHorizontal: Size.defineSpace,
        borderRadius: Size.borderRadiusBotton
    },
    styBtnGoHome: {
        position: 'absolute',
        top: 13,
        left: Size.defineSpace,
        elevation: 4,
        zIndex: 4
    },
    styBtnFilter: {
        position: 'absolute',
        top: 13,
        right: Size.defineSpace,
        elevation: 4,
        zIndex: 4
    }
});

const mapStateToProps = state => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

// export default HreEventCalendar

export default connect(
    mapStateToProps,
    null
)(HreEventCalendar);
