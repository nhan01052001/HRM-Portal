import I18n from 'react-native-i18n';
import VN from './locales/vi';
import EN from './locales/en';
import CN from './locales/cn';

export const setDataLang = (data, languageApp) => {
    if (languageApp && data) {
        if (languageApp === 'VN') {
            let lang = { ...VN, ...data };

            if (lang) {
                I18n.translations.VN = lang;
            }
        } else if (languageApp === 'EN') {
            let lang = { ...EN, ...data };

            if (lang) {
                I18n.translations.EN = lang;
            }
        } else if (languageApp === 'CN') {
            let lang = { ...CN, ...data };

            if (lang) {
                I18n.translations.CN = lang;
            }
        }
    }
};
