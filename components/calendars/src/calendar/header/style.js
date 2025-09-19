import {StyleSheet} from 'react-native';
import * as defaultStyle from '../../style';
import {Colors} from '../../../../../constants/styleConfig';

const STYLESHEET_ID = 'stylesheet.calendar.header';

export default function(theme = {}) {
  const appStyle = {...defaultStyle, ...theme};
  return StyleSheet.create({
    header: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginHorizontal: 30,
      marginBottom: 5,
      alignItems: 'center',
      backgroundColor: Colors.whiteOpacity30,
      borderRadius: 15,
    },
    monthText: {
      fontSize: appStyle.textMonthFontSize,
      fontFamily: appStyle.textMonthFontFamily,
      fontWeight: appStyle.textMonthFontWeight,
      color: appStyle.monthTextColor,
      marginVertical: 5,
    },
    arrow: {
      padding: 10,
      paddingHorizontal: 10,
      paddingVertical: 5,
      ...appStyle.arrowStyle,
      color: appStyle.foregroundColor,
    },
    arrowImage: {
      tintColor: appStyle.foregroundColor,
      // backgroundColor: appStyle.foregroundColor,
    },
    disabledArrowImage: {
      tintColor: appStyle.disabledArrowColor,
    },
    week: {
      marginTop: 7,
      flexDirection: 'row',
      justifyContent: 'space-around',
    },
    dayHeader: {
      marginTop: 2,
      marginBottom: 7,
      width: 32,
      textAlign: 'center',
      fontSize: appStyle.textDayHeaderFontSize,
      fontFamily: appStyle.textDayHeaderFontFamily,
      fontWeight: appStyle.textDayHeaderFontWeight,
      color: appStyle.foregroundColor, //appStyle.textSectionTitleColor,
    },
    ...(theme[STYLESHEET_ID] || {}),
  });
}
