import I18n from 'react-native-i18n';

import EN from './locales/en';
import VN from './locales/vi';
import CN from './locales/cn';

I18n.translations = {
    EN,
    VN,
    CN
};

I18n.locale = 'VN';
export default I18n;
