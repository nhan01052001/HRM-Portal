import { Platform } from 'react-native';
import { Colors, Size } from './styleConfig';

export const themeStyleCalanderList = {
    'stylesheet.day.basic': {
        selected: {
            backgroundColor: Colors.primary,
            borderRadius: 32
        }
    },
    selectedDayBackgroundColor: Colors.primary,
    monthTextColor: Colors.black,
    textMonthFontSize: Size.text,
    textDayHeaderFontSize: Size.text,
    dayTextColor: Colors.gray_10,
    todayTextColor: Colors.primary,
    todayButtonFontFamily: Platform.OS == 'android' ? 'Roboto-Regular' : 'AvenirNext-Regular',
    textDayFontFamily: Platform.OS == 'android' ? 'Roboto-Regular' : 'AvenirNext-Regular',
    textMonthFontFamily: Platform.OS == 'android' ? 'Roboto-Regular' : 'AvenirNext-Regular',
    textDayHeaderFontFamily: Platform.OS == 'android' ? 'Roboto-Regular' : 'AvenirNext-Regular',
    'stylesheet.calendar.header': {
        monthText: {
            textAlign: 'left',
            fontSize: Size.text,
            fontWeight: Platform.OS == 'ios' ? '500' : '600',
            marginTop: 12
        },
        header: {}
    },
    'stylesheet.day.single': {
        today: {
            padding: 0,
            backgroundColor: Colors.primary_transparent_8,
            borderRadius: 30
        },
        todayText: {
            fontSize: Size.text + 2,
            fontFamily: Platform.OS == 'android' ? 'SF-Pro-Text-Medium' : 'SFProText-Bold',
            fontWeight: '500',
            color: Colors.primary
        }
    }
};
