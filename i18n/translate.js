import i18n from '../i18n/i18n';
import store from '../store';
import Vnr_Function from '../utils/Vnr_Function';

export const translate = (i18nKey) => {
    const language = store.getState()['languageReducer']['language'];
    if (!Vnr_Function.CheckIsNullOrEmpty(i18nKey)) {
        if (i18n.t(i18nKey).indexOf('[missing') == 0) {
            if (
                i18n.translations &&
                language &&
                i18n.translations[language] &&
                i18n.translations[language][i18nKey]
            ) {
                return i18n.translations[language][i18nKey];
            } else {
                return i18nKey;
            }
        }
        return i18n.t(i18nKey);
    }
    else {
        return i18nKey;
    }
};
