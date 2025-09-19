import React, { Component } from 'react';
import {
  View,
  ViewPropTypes,
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';
import PropTypes, { element } from 'prop-types';
import XDate from 'xdate';
import { Size, styleSheets, Colors } from '../../../../constants/styleConfig';
import dateutils, { month } from '../dateutils';
import { xdateToData, parseDate } from '../interface';
import styleConstructor from './style';
import Day from './day/basic';
import UnitDay from './day/period';
import MultiDotDay from './day/multi-dot';
import MultiPeriodDay from './day/multi-period';
import SingleDay from './day/custom';
import CalendarHeader from './header';
import shouldComponentUpdate from './updater';
import { SELECT_DATE_SLOT } from '../testIDs';
import MonthList from '../month-list/index';
//Fallback when RN version is < 0.44
const viewPropTypes = ViewPropTypes || View.propTypes;
const EmptyArray = [];

/**
 * @description: Calendar component
 * @example: https://github.com/wix/react-native-calendars/blob/master/example/src/screens/calendars.js
 * @gif: https://github.com/wix/react-native-calendars/blob/master/demo/calendar.gif
 */
class Calendar extends Component {
  static displayName = 'Calendar';

  static propTypes = {
    autoClose: PropTypes.bool,
    onlyMonth: PropTypes.bool,
    onPressHideAll: PropTypes.func, // add function show/Hide Weeks (customCalendar)
    viewTopWorkDay: PropTypes.func, // add function show/Hide Weeks (customCalendar)
    refreshList: PropTypes.func, // add function show/Hide Weeks (customCalendar)
    /** Specify theme properties to override specific styles for calendar parts. Default = {} */
    theme: PropTypes.object,
    /** Collection of dates that have to be marked. Default = {} */
    markedDates: PropTypes.object,
    /** Specify style for calendar container element. Default = {} */
    style: viewPropTypes.style,
    /** Initially visible month. Default = Date() */
    current: PropTypes.any,
    /** Minimum date that can be selected, dates before minDate will be grayed out. Default = undefined */
    minDate: PropTypes.any,
    /** Maximum date that can be selected, dates after maxDate will be grayed out. Default = undefined */
    maxDate: PropTypes.any,
    /** If firstDay=1 week starts from Monday. Note that dayNames and dayNamesShort should still start from Sunday. */
    firstDay: PropTypes.number,
    /** Date marking style [simple/period/multi-dot/multi-period]. Default = 'simple' */
    markingType: PropTypes.string,
    /** Hide month navigation arrows. Default = false */
    hideArrows: PropTypes.bool,
    /** Display loading indicator. Default = false */
    displayLoadingIndicator: PropTypes.bool,
    /** Do not show days of other months in month page. Default = false */
    hideExtraDays: PropTypes.bool,
    /** Handler which gets executed on day press. Default = undefined */
    onDayPress: PropTypes.func,
    /** Handler which gets executed on day long press. Default = undefined */
    onDayLongPress: PropTypes.func,
    /** Handler which gets executed when month changes in calendar. Default = undefined */
    onMonthChange: PropTypes.func,
    /** Handler which gets executed when visible month changes in calendar. Default = undefined */
    onVisibleMonthsChange: PropTypes.func,
    /** Replace default arrows with custom ones (direction can be 'left' or 'right') */
    renderArrow: PropTypes.func,
    /** Provide custom day rendering component */
    dayComponent: PropTypes.any,
    /** Month format in calendar title. Formatting values: http://arshaw.com/xdate/#Formatting */
    monthFormat: PropTypes.string,
    /** Disables changing month when click on days of other months (when hideExtraDays is false). Default = false */
    disableMonthChange: PropTypes.bool,
    /**  Hide day names. Default = false */
    hideDayNames: PropTypes.bool,
    /** Disable days by default. Default = false */
    disabledByDefault: PropTypes.bool,
    /** Show week numbers. Default = false */
    showWeekNumbers: PropTypes.bool,
    /** Handler which gets executed when press arrow icon left. It receive a callback can go back month */
    onPressArrowLeft: PropTypes.func,
    /** Handler which gets executed when press arrow icon right. It receive a callback can go next month */
    onPressArrowRight: PropTypes.func,
    /** Disable left arrow. Default = false */
    disableArrowLeft: PropTypes.bool,
    /** Disable right arrow. Default = false */
    disableArrowRight: PropTypes.bool,
    /** Style passed to the header */
    headerStyle: PropTypes.oneOfType([
      PropTypes.object,
      PropTypes.number,
      PropTypes.array,
    ]),
    /** Provide aria-level for calendar heading for proper accessibility when used with web (react-native-web) */
    webAriaLevel: PropTypes.number,
  };

  constructor(props) {
    super(props);

    this.style = styleConstructor(this.props.theme);

    this.state = {
      currentMonth: props.current ? parseDate(props.current) : XDate(),
      isVisibleWeek: false,
      isVisibleMonth: false,
    };
    this.hideAll = this.hideAll.bind(this);
    this.showHideMonth = this.showHideMonth.bind(this);
    this.showHideWeeks = this.showHideWeeks.bind(this); // add function show/Hide Weeks (customCalendar)
    this.updateMonth = this.updateMonth.bind(this);
    this.addMonth = this.addMonth.bind(this);
    this.pressDay = this.pressDay.bind(this);
    this.longPressDay = this.longPressDay.bind(this);
    this.shouldComponentUpdate = shouldComponentUpdate;
    this.changeMonth = this.changeMonth.bind(this);
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    const current = parseDate(nextProps.current);
    if (
      (current &&
        current.toString('yyyy MM') !==
        this.state.currentMonth.toString('yyyy MM')) ||
      nextProps.refreshCalendarHeaderTotal !==
      this.props.refreshCalendarHeaderTotal
    ) {
      this.setState({ currentMonth: current.clone() });
    }
  }

  // add function show/Hide Weeks (customCalendar)
  showHideWeeks() {
    this.setState({
      isVisibleWeek: !this.state.isVisibleWeek,
      isVisibleMonth: false,
    });
  }
  // add function show/Hide Month (customCalendar)
  showHideMonth() {
    this.setState({
      isVisibleMonth: !this.state.isVisibleMonth,
      isVisibleWeek: false,
    });
  }

  hideAll() {
    this.setState({ isVisibleMonth: false, isVisibleWeek: false }, () => {
      this.props.onPressHideAll && this.props.onPressHideAll()
      // const currMont = this.state.currentMonth.clone();
      // if (this.props.onMonthChange) {
      //   this.props.onMonthChange(xdateToData(currMont));
      // }
      // if (this.props.onVisibleMonthsChange) {
      //   this.props.onVisibleMonthsChange([xdateToData(currMont)]);
      // }
    });
  }

  updateMonth(day, doNotTriggerListeners) {
    if (
      day.toString('yyyy MM') === this.state.currentMonth.toString('yyyy MM')
    ) {
      return;
    }
    this.setState(
      {
        currentMonth: day.clone(),
      },
      () => {
        if (!doNotTriggerListeners) {
          const currMont = this.state.currentMonth.clone();
          if (this.props.onMonthChange) {
            this.props.onMonthChange(xdateToData(currMont));
          }
          if (this.props.onVisibleMonthsChange) {
            this.props.onVisibleMonthsChange([xdateToData(currMont)]);
          }
        }
      },
    );
  }

  _handleDayInteraction(date, interaction) {
    const day = parseDate(date);
    const minDate = parseDate(this.props.minDate);
    const maxDate = parseDate(this.props.maxDate);
    if (
      !(minDate && !dateutils.isGTE(day, minDate)) &&
      !(maxDate && !dateutils.isLTE(day, maxDate))
    ) {
      const shouldUpdateMonth =
        this.props.disableMonthChange === undefined ||
        !this.props.disableMonthChange;
      if (shouldUpdateMonth) {
        this.updateMonth(day);
      }
      if (interaction) {
        interaction(xdateToData(day));
      }
    }
  }

  pressDay(date) {
    this._handleDayInteraction(date, this.props.onDayPress);
  }

  longPressDay(date) {
    this._handleDayInteraction(date, this.props.onDayLongPress);
  }

  addMonth(count) {
    this.updateMonth(this.state.currentMonth.clone().addMonths(count, true));
  }

  renderDay(day, id) {
    const minDate = parseDate(this.props.minDate);
    const maxDate = parseDate(this.props.maxDate);
    let state = '';
    if (this.props.disabledByDefault) {
      state = 'disabled';
    } else if (
      (minDate && !dateutils.isGTE(day, minDate)) ||
      (maxDate && !dateutils.isLTE(day, maxDate))
    ) {
      state = 'disabled';
    } else if (!dateutils.sameMonth(day, this.state.currentMonth)) {
      state = 'disabled';
    } else if (dateutils.sameDate(day, XDate())) {
      state = 'today';
    }

    if (
      !dateutils.sameMonth(day, this.state.currentMonth) &&
      this.props.hideExtraDays
    ) {
      return <View key={id} style={{ flex: 1 }} />;
    }

    const DayComp = this.getDayComponent();
    const date = day.getDate();
    const dateAsObject = xdateToData(day);
    const accessibilityLabel = `${
      state === 'today' ? 'today' : ''
      } ${day.toString('dddd MMMM d')} ${this.getMarkingLabel(day)}`;

    return (
      <View style={{ flex: 1, alignItems: 'center' }} key={id}>
        <DayComp
          testID={`${SELECT_DATE_SLOT}-${dateAsObject.dateString}`}
          state={state}
          theme={this.props.theme}
          onPress={this.pressDay}
          onLongPress={this.longPressDay}
          date={dateAsObject}
          marking={this.getDateMarking(day)}
          accessibilityLabel={accessibilityLabel}>
          {date}
        </DayComp>
      </View>
    );
  }

  getMarkingLabel(day) {
    let label = '';
    const marking = this.getDateMarking(day);

    if (marking.accessibilityLabel) {
      return marking.accessibilityLabel;
    }

    if (marking.selected) {
      label += 'selected ';
      if (!marking.marked) {
        label += 'You have no entries for this day ';
      }
    }
    if (marking.marked) {
      label += 'You have entries for this day ';
    }
    if (marking.startingDay) {
      label += 'period start ';
    }
    if (marking.endingDay) {
      label += 'period end ';
    }
    if (marking.disabled || marking.disableTouchEvent) {
      label += 'disabled ';
    }
    return label;
  }

  getDayComponent() {
    if (this.props.dayComponent) {
      return this.props.dayComponent;
    }

    switch (this.props.markingType) {
      case 'period':
        return UnitDay;
      case 'multi-dot':
        return MultiDotDay;
      case 'multi-period':
        return MultiPeriodDay;
      case 'custom':
        return SingleDay;
      default:
        return Day;
    }
  }

  getDateMarking(day) {
    if (!this.props.markedDates) {
      return false;
    }

    const dates =
      this.props.markedDates[day.toString('yyyy-MM-dd')] || EmptyArray;
    if (dates.length || dates) {
      return dates;
    } else {
      return false;
    }
  }

  renderWeekNumber(weekNumber) {
    return (
      <Day
        key={`week-${weekNumber}`}
        theme={this.props.theme}
        marking={{ disableTouchEvent: true }}
        state="disabled">
        {weekNumber}
      </Day>
    );
  }

  renderWeek(days, id) {
    const week = [];
    days.forEach((day, id2) => {
      week.push(this.renderDay(day, id2));
    }, this);

    if (this.props.showWeekNumbers) {
      week.unshift(this.renderWeekNumber(days[days.length - 1].getWeek()));
    }

    return (
      <View style={this.style.week} key={id}>
        {week}
      </View>
    );
  }

  changeMonth(monthNumber) {
   
    const currentDate = this.state.currentMonth.getDate(),
      currentYear = this.state.currentMonth.getFullYear(),
      day = new XDate(currentYear, monthNumber, 1, 0, 0, 0, true);
    if (
      day.toString('yyyy MM') === this.state.currentMonth.toString('yyyy MM')
    ) {
      return;
    }
    if (this.props.autoClose) {
      this.setState(
        {
          currentMonth: day.clone(),
          isVisibleMonth: false,
          isVisibleWeek: false, 
        },
        () => {
          const currMont = this.state.currentMonth.clone();
          if (this.props.onMonthChange) {
            this.props.onMonthChange(xdateToData(currMont));
          }
          if (this.props.onVisibleMonthsChange) {
            this.props.onVisibleMonthsChange([xdateToData(currMont)]);
          }
        },
      );
    } else {
      this.setState(
        {
          currentMonth: day.clone(),
        },
        () => {
          const currMont = this.state.currentMonth.clone();
          if (this.props.onMonthChange) {
            this.props.onMonthChange(xdateToData(currMont));
          }
          if (this.props.onVisibleMonthsChange) {
            this.props.onVisibleMonthsChange([xdateToData(currMont)]);
          }
        },
      );
    }

    // this.setState({
    //   currentMonth : new XDate(currentYear, monthNumber, currentDate, 0, 0, 0, true),
    //   isVisibleMonth : false,
    //   isVisibleWeek: true
    // })
  }

  renderMonthViews() {
    const listMonth = dateutils.MonthYearNames();
    return listMonth.map(item => {
      if (this.state.currentMonth.getMonth() === item.value) {
        return (
          <TouchableOpacity
            style={stylesCustom.itemMonth}
            onPress={() => this.changeMonth(item.value)}>
            <View style={[stylesCustom.monthActive]}>
              <Text
                style={[styleSheets.text, stylesCustom.txtMonthActiveStyle]}>
                {item.key}
              </Text>
            </View>
          </TouchableOpacity>
        );
      } else {
        return (
          <TouchableOpacity
            style={stylesCustom.itemMonth}
            onPress={() => this.changeMonth(item.value)}>
            <View style={[stylesCustom.monthUnActive]}>
              <Text style={[styleSheets.text, stylesCustom.txtMonthStyle]}>
                {item.key}
              </Text>
            </View>
          </TouchableOpacity>
        );
      }
    });
  }

  render() {
    const days = dateutils.page(this.state.currentMonth, this.props.firstDay);
    const weeks = [];

    while (days.length) {
      weeks.push(this.renderWeek(days.splice(0, 7), weeks.length));
    }

    let indicator,
      ContentCalendar = <View />;
    const current = parseDate(this.props.current);

    if (current) {
      const lastMonthOfDay = current
        .clone()
        .addMonths(1, true)
        .setDate(1)
        .addDays(-1)
        .toString('yyyy-MM-dd');
      if (
        this.props.displayLoadingIndicator &&
        !(this.props.markedDates && this.props.markedDates[lastMonthOfDay])
      ) {
        indicator = true;
      }
    }

    if (this.state.isVisibleMonth) {
      ContentCalendar = (
        <MonthList
          onPressArrowLeft={this.props.onPressArrowLeft}
          onPressArrowRight={this.props.onPressArrowRight}
          addMonth={this.addMonth}
          month={this.state.currentMonth}
          changeMonth={this.changeMonth}
        />)
      // ContentCalendar = (
      //   <View style={stylesCustom.monthViewofYear}>
      //     {this.renderMonthViews()}
      //   </View>
      // );
    }

    if (this.state.isVisibleWeek && !this.props.onlyMonth) {
      ContentCalendar = <View style={this.style.monthView}>{weeks}</View>;
    }

    return (
      <View
        style={[this.style.container, this.props.style]}
        accessibilityElementsHidden={this.props.accessibilityElementsHidden} // iOS
        importantForAccessibility={this.props.importantForAccessibility}>
        <CalendarHeader
          refreshCalendarHeaderTotal={this.props.refreshCalendarHeaderTotal}
          testID={this.props.testID}
          ref={c => (this.header = c)}
          style={this.props.headerStyle}
          theme={this.props.theme}
          hideArrows={this.props.hideArrows}
          month={this.state.currentMonth}
          addMonth={this.addMonth}
          showIndicator={indicator}
          firstDay={this.props.firstDay}
          renderArrow={this.props.renderArrow}
          monthFormat={this.props.monthFormat}
          //hideDayNames={this.props.hideDayNames}
          onlyMonth={this.props.onlyMonth}
          hideAll={this.hideAll}
          showHideMonth={this.showHideMonth} // function show/hide weeks (customCalendar)
          showHideWeeks={this.showHideWeeks} // function show/hide weeks (customCalendar)
          isVisibleMonth={this.state.isVisibleMonth}
          isVisibleWeek={this.state.isVisibleWeek} // hide dayName when weeks hide (customCalendar)
          viewTopWorkDay={this.props.viewTopWorkDay} // hide dayName when weeks hide (customCalendar)
          weekNumbers={this.props.showWeekNumbers}
          onPressArrowLeft={this.props.onPressArrowLeft}
          onPressArrowRight={this.props.onPressArrowRight}
          webAriaLevel={this.props.webAriaLevel}
          disableArrowLeft={this.props.disableArrowLeft}
          disableArrowRight={this.props.disableArrowRight}
        />
        {/* </TouchableOpacity> */}
        {
          // add function show/Hide Weeks (customCalendar)
          ContentCalendar
        }
      </View>
    );
  }
}

const stylesCustom = StyleSheet.create({
  monthViewofYear: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
  },
  itemMonth: {
    width: Size.deviceWidth / 4 - 5,
    //backgroundColor : 'red',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 10,
  },
  monthActive: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: 35 / 2,
  },
  monthUnActive: {
    width: 35,
    height: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  txtMonthStyle: {
    color: '#43515c',
  },
  txtMonthActiveStyle: {
    color: Colors.white,
  },
});

export default Calendar;
