import React, { Component } from 'react';
import { ActivityIndicator, Platform } from 'react-native';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import XDate from 'xdate';
import PropTypes from 'prop-types';
import styleConstructor from './style';
import { weekDayNames } from '../../dateutils';
import {
  IconDate,
  IconColse,
  IconPrev,
  IconNextForward,
} from '../../../../../constants/Icons';
import { Colors, styleSheets, Size } from '../../../../../constants/styleConfig';

import {
  CHANGE_MONTH_LEFT_ARROW,
  CHANGE_MONTH_RIGHT_ARROW,
  HEADER_MONTH_NAME,
} from '../../testIDs';

class CalendarHeader extends Component {
  static displayName = 'IGNORE';

  static propTypes = {
    theme: PropTypes.object,
    hideArrows: PropTypes.bool,
    month: PropTypes.instanceOf(XDate),
    addMonth: PropTypes.func,
    showIndicator: PropTypes.bool,
    firstDay: PropTypes.number,
    renderArrow: PropTypes.func,
    isVisibleWeek: PropTypes.bool,
    weekNumbers: PropTypes.bool,
    onPressArrowLeft: PropTypes.func,
    onPressArrowRight: PropTypes.func,
    disableArrowLeft: PropTypes.bool,
    disableArrowRight: PropTypes.bool,
    webAriaLevel: PropTypes.number,
  };

  static defaultProps = {
    monthFormat: 'MMMM yyyy',
    webAriaLevel: 1,
  };

  constructor(props) {
    super(props);
    this.style = styleConstructor(props.theme);
    this.addMonth = this.addMonth.bind(this);
    this.substractMonth = this.substractMonth.bind(this);
    this.onPressLeft = this.onPressLeft.bind(this);
    this.onPressRight = this.onPressRight.bind(this);
  }

  addMonth() {
    this.props.addMonth(1);
  }

  substractMonth() {
    this.props.addMonth(-1);
  }

  shouldComponentUpdate(nextProps) {
    // this.props = nextProps;
    if (
      nextProps.month.toString('yyyy MM') !==
      this.props.month.toString('yyyy MM')
    ) {
      return true;
    }
    if (nextProps.showIndicator !== this.props.showIndicator) {
      return true;
    }
    if (nextProps.isVisibleWeek !== this.props.isVisibleWeek) {
      return true;
    }
    if (nextProps.isVisibleMonth !== this.props.isVisibleMonth) {
      return true;
    }
    if (nextProps.firstDay !== this.props.firstDay) {
      return true;
    }
    if (nextProps.weekNumbers !== this.props.weekNumbers) {
      return true;
    }
    if (nextProps.monthFormat !== this.props.monthFormat) {
      return true;
    }
    if (nextProps.renderArrow !== this.props.renderArrow) {
      return true;
    }
    if (nextProps.disableArrowLeft !== this.props.disableArrowLeft) {
      return true;
    }
    if (nextProps.disableArrowRight !== this.props.disableArrowRight) {
      return true;
    }

    if (
      nextProps.refreshCalendarHeaderTotal !==
      this.props.refreshCalendarHeaderTotal
    ) {
      return true;
    }

    return false;
  }

  onPressLeft() {
    const { onPressArrowLeft } = this.props;
    if (typeof onPressArrowLeft === 'function') {
      return onPressArrowLeft(this.substractMonth, this.props.month);
    }
    return this.substractMonth();
  }

  onPressRight() {
    const { onPressArrowRight } = this.props;
    if (typeof onPressArrowRight === 'function') {
      return onPressArrowRight(this.addMonth, this.props.month);
    }
    return this.addMonth();
  }

  // componentWillReceiveProps(nextProps) {
  //   debugger
  //   if (nextProps.refreshCalendarHeaderTotal !== this.props.refreshCalendarHeaderTotal) {

  //   }
  // }

  render() {
    let leftArrow = <View />;
    let rightArrow = <View />;
    let weekDaysNames = weekDayNames(this.props.firstDay);
    const { testID } = this.props;

    // add button show/hide weeks (customCalendar)
    let leftButtonShowHide = (
      <TouchableOpacity
        style={this.style.arrow}
        onPress={() => this.props.showHideMonth()}>
        <IconDate size={Size.iconSize} color={Colors.gray_10} />
      </TouchableOpacity>
    );

    if (this.props.isVisibleWeek || this.props.isVisibleMonth) {
      leftButtonShowHide = (
        <TouchableOpacity
          style={this.style.arrow}
          onPress={() => this.props.hideAll()}>
          <IconColse size={Size.iconSize} color={Colors.gray_10} />
        </TouchableOpacity>
      );
    }

    if (!this.props.hideArrows) {
      leftArrow = (
        <TouchableOpacity
          onPress={this.onPressLeft}
          disabled={this.props.disableArrowLeft}
          style={this.style.arrow}
          hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
          testID={
            testID
              ? `${CHANGE_MONTH_LEFT_ARROW}-${testID}`
              : CHANGE_MONTH_LEFT_ARROW
          }>
          {this.props.renderArrow ? (
            this.props.renderArrow('left')
          ) : (
              <IconPrev size={Size.iconSize} color={Colors.primary} />
              // <Image
              //   source={require('../img/previous.png')}
              //   style={
              //     this.props.disableArrowLeft
              //       ? this.style.disabledArrowImage
              //       : this.style.arrowImage
              //   }
              // />
            )}
        </TouchableOpacity>
      );
      rightArrow = (
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <TouchableOpacity
            onPress={this.onPressRight}
            disabled={this.props.disableArrowRight}
            style={[this.style.arrow]}
            hitSlop={{ left: 20, right: 20, top: 20, bottom: 20 }}
            testID={
              testID
                ? `${CHANGE_MONTH_RIGHT_ARROW}-${testID}`
                : CHANGE_MONTH_RIGHT_ARROW
            }>
            {this.props.renderArrow ? (
              this.props.renderArrow('right')
            ) : (
                <IconNextForward size={Size.iconSize} color={Colors.primary} />
                // <Image
                //   source={require('../img/next.png')}
                //   style={
                //     this.props.disableArrowRight
                //       ? this.style.disabledArrowImage
                //       : this.style.arrowImage
                //   }
                // />
              )}
          </TouchableOpacity>
          {/* add button show/hide weeks (customCalendar) */}
        </View>
      );
    }

    let indicator;
    if (this.props.showIndicator) {
      indicator = (
        <ActivityIndicator
          color={this.props.theme && this.props.theme.indicatorColor}
        />
      );
    }

    const webProps =
      Platform.OS === 'web' ? { 'aria-level': this.props.webAriaLevel } : {};

    return (
      <View
        testID={testID}
        style={this.props.style}
        accessible
        accessibilityRole={'adjustable'}
        accessibilityActions={[
          { name: 'increment', label: 'increment' },
          { name: 'decrement', label: 'decrement' },
        ]}
        onAccessibilityAction={this.onAccessibilityAction}
        accessibilityElementsHidden={this.props.accessibilityElementsHidden} // iOS
        importantForAccessibility={this.props.importantForAccessibility} // Android
      >
        <TouchableOpacity onPress={() => this.props.showHideMonth()} activeOpacity={0.7}>
          <View style={this.style.header}>
            {leftArrow}
            <View style={{ flexDirection: 'row' }}>
              {/* <TouchableOpacity
                activeOpacity={this.props.onlyMonth && 1}
                onPress={() => this.props.showHideMonth()}> */}
              <Text
                allowFontScaling={false}
                style={[
                  this.style.monthText,
                  { color: Colors.gray_10 },
                  styleSheets.lable,
                  { fontSize: Size.text + 4 },
                ]}
                {...webProps}
                testID={
                  testID
                    ? `${HEADER_MONTH_NAME}-${testID}`
                    : HEADER_MONTH_NAME
                }>
                {`${this.props.month.toString('MM')} - `}
              </Text>
              {/* </TouchableOpacity>
              <TouchableOpacity
                activeOpacity={this.props.onlyMonth && 1}
                onPress={() => this.props.showHideMonth()}> */}
              <Text
                allowFontScaling={false}
                style={[
                  this.style.monthText,
                  { color: Colors.gray_10 },
                  styleSheets.lable,
                  { fontSize: Size.text + 4 },
                ]}
                {...webProps}
                testID={
                  testID
                    ? `${HEADER_MONTH_NAME}-${testID}`
                    : HEADER_MONTH_NAME
                }>
                {this.props.month.getFullYear()}
              </Text>
              {/* </TouchableOpacity> */}
              {leftButtonShowHide}
              {indicator}
            </View>
            {rightArrow}
          </View>
        </TouchableOpacity>

        {this.props.viewTopWorkDay && this.props.viewTopWorkDay()}

        {this.props.isVisibleWeek && !this.props.onlyMonth && (
          <View style={this.style.week}>
            {this.props.weekNumbers && (
              <Text allowFontScaling={false} style={this.style.dayHeader} />
            )}
            {weekDaysNames.map((day, idx) => (
              <Text
                allowFontScaling={false}
                key={idx}
                style={this.style.dayHeader}
                numberOfLines={1}
                accessibilityLabel={''}
              // accessible={false} // not working
              // importantForAccessibility='no'
              >
                {day}
              </Text>
            ))}
          </View>
        )}
      </View>
    );
  }

  onAccessibilityAction = event => {
    switch (event.nativeEvent.actionName) {
      case 'decrement':
        this.onPressLeft();
        break;
      case 'increment':
        this.onPressRight();
        break;
      default:
        break;
    }
  };
}

export default CalendarHeader;
