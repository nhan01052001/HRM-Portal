import React, { Component } from 'react';
import { Text } from 'react-native';
import { connect } from 'react-redux';
import I18n from '../../i18n/i18n';
import { styleSheets } from '../../constants/styleConfig';
import Vnr_Function from '../../utils/Vnr_Function';

class VnrText extends Component {
    constructor(props) {
        super(props);
        this.state = {
            i18n: I18n
        };
    }

    UNSAFE_componentWillMount() {
        const { language } = this.props;
        if (language) this.setMainLocaleLanguage(language);
    }

    UNSAFE_componentWillReceiveProps = nextProps => {
        const { language } = nextProps;
        if (language) this.setMainLocaleLanguage(language);
    };

    setMainLocaleLanguage = language => {
        let { i18n } = this.state;
        i18n.locale = language;
        this.setState({ i18n });
    };

    translate = () => {
        const { i18nKey, value, language } = this.props;
        const { i18n } = this.state;

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
                    if (i18nKey.includes('HRM' && '_') || i18nKey.includes('E' && '_') || i18nKey.includes('_'))
                        Vnr_Function.sendMailFeedback(i18nKey);
                    return i18nKey;
                }
            }
            return i18n.t(i18nKey);
        } else {
            return value;
        }
    };

    render() {
        const { style } = this.props;
        return (
            <Text style={[styleSheets.text, style]} {...this.props}>
                {this.translate()}
            </Text>
        );
    }
}

const mapStateToProps = state => {
    return {
        language: state.languageReducer.language
    };
};

export default connect(
    mapStateToProps,
    null
)(VnrText);
