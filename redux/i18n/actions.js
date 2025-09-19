import { setLanguageCalendar } from '../../i18n/langCalendars';
import I18n from 'react-native-i18n';
export const actions = {
    CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',
    changeLanguage: language => {
        // set ngon ngu en/vi cho calendar app
        if (language != null && (language === 'VN' || language === 'EN' || language === 'CN')) {
            setLanguageCalendar(language);
            I18n.locale = language;
            return {
                type: actions.CHANGE_LANGUAGE,
                language
            };
        } else {
            return null;
        }
    }
};
