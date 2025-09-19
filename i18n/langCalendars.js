import { LocaleConfig } from '../components/calendars';
import moment from 'moment';
import { dataVnrStorage } from '../assets/auth/authentication';

export const setLanguageCalendar = (language = 'VN') => {
    LocaleConfig.locales['VN'] = {
        monthNames: [
            'Tháng 1',
            'Tháng 2',
            'Tháng 3',
            'Tháng 4',
            'Tháng 5',
            'Tháng 6',
            'Tháng 7',
            'Tháng 8',
            'Tháng 9',
            'Tháng 10',
            'Tháng 11',
            'Tháng 12'
        ],
        monthNamesShort: ['T1', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'T8', 'T9', 'T10', 'T11', 'T12'],
        dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        dayNamesShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
        today: 'Aujourd\'hui'
    };

    LocaleConfig.locales['EN'] = {
        monthNames: [
            'January',
            'February',
            'March',
            'April',
            'May',
            'June',
            'July',
            'August',
            'September',
            'October',
            'November',
            'December'
        ],
        monthNamesShort: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
        dayNames: ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'],
        dayNamesShort: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        today: 'Aujourd\'hui'
    };
    // set ngon ngu cho lich.
    try {
        if (language === 'VN') {
            LocaleConfig.defaultLocale = 'VN';
        } else {
            LocaleConfig.defaultLocale = 'EN';
        }
    } catch (error) {
        console.log(error);
    }
};

export const getDayOfWeek = day => {
    const lang = {
            VN: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
            EN: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
        },
        langfilter = lang[dataVnrStorage.languageApp],
        numberDay = moment(day).day();
    return langfilter[numberDay];
};
