/* eslint-disable react/display-name */
import React from 'react';
import { View } from 'react-native';
import { Colors, styleSheets } from '../../constants/styleConfig';
import { TransitionPresets } from 'react-navigation-stack';
import VnrText from '../../components/VnrText/VnrText';
import DrawerToggle from '../../components/DrawerComponent/DrawerToggle';
import ButtonGoBack from '../../components/buttonGoBack/buttonGoBack';
import ButtonGoBackHome from '../../components/buttonGoBack/buttonGoBackHome';
import { translate } from '../../i18n/translate';

const navigationOptionsConfigScreenTabbar = (navigation, Title_Key) => {
    const { params = {} } = navigation.state;
    return {
        tabBarVisible: false,
        title: (
            <VnrText i18nKey={params.title ? params.title : Title_Key} style={styleSheets.headerTitleStyle}>
                {Title_Key}
            </VnrText>
        ),
        headerLeft: () => {
            return params.headerLeft ? params.headerLeft : null;
        },
        headerStyle: {
            backgroundColor: Colors.white,
            shadowColor: 'transparent',
            shadowRadius: 0,
            shadowOffset: {
                height: 0
            },
            elevation: 0,
            borderBottomColor: Colors.gray_5,
            borderBottomWidth: 0.5
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
            fontWeight: '500'
        },
        headerRight: () => {
            const { index, routes } = navigation.state;
            let params = null;
            if (routes && routes.length > 0) params = routes[index] ? routes[index]['params'] : null;
            else params = navigation.state ? navigation.state.params : null;

            return params ? params.headerRight : undefined;
        }
    };
};

const navigationOptionsConfig = (navigation, Title_Key) => {
    return {
        title: (
            <VnrText i18nKey={Title_Key} style={styleSheets.headerTitleStyle}>
                {Title_Key}
            </VnrText>
        ),
        headerLeft: () => <DrawerToggle Key={Title_Key} />,
        headerRight: () => {
            const { params = {} } = navigation.state;
            return params.headerRight ? params.headerRight : <View />;
        },
        headerStyle: {
            backgroundColor: Colors.white,
            shadowColor: 'transparent',
            shadowRadius: 0,
            shadowOffset: {
                // hide border ios
                height: 0
            },
            elevation: 0, //hide shadow android,
            borderBottomColor: Colors.gray_5,
            borderBottomWidth: 0.5
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
            fontWeight: '500'
        },
        ...TransitionPresets.ModalSlideFromBottomIOS
    };
};

const navigationOptionsConfigHeaderNull = () => {
    return {
        header: null,
        headerForceInset: { top: 'never' }
    };
};

const navigationOptionsConfigGoBack = (navigation, Title_Key, gobackFunction = null) => {
    const { params = {} } = navigation.state;
    return {
        tabBarVisible: false,
        title: (
            <VnrText i18nKey={params.title ? params.title : Title_Key} style={styleSheets.headerTitleStyle}>
                {Title_Key}
            </VnrText>
        ),
        headerLeft: () => {
            const { index, routes } = navigation.state;
            let params = null;
            if (routes && routes.length > 0) params = routes[index] ? routes[index]['params'] : null;
            else params = navigation.state ? navigation.state.params : null;

            return (params && params.headerLeft) ? (
                params.headerLeft
            ) : (
                <ButtonGoBack Key={Title_Key} navigation={navigation} gobackFunction={gobackFunction} />
            );
        },
        headerStyle: {
            backgroundColor: Colors.white,
            shadowColor: 'transparent',
            shadowRadius: 0,
            shadowOffset: {
                height: 0
            },
            elevation: 0,
            borderBottomColor: Colors.gray_5,
            borderBottomWidth: 0.5
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
            fontWeight: '500'
        },
        headerRight: () => {
            const { index, routes } = navigation.state;
            let params = null;
            if (routes && routes.length > 0) params = routes[index] ? routes[index]['params'] : null;
            else params = navigation.state ? navigation.state.params : null;

            return params ? params.headerRight : undefined;
        }
    };
};

const navigationOptionsConfigGoBackHone = (navigation, Title_Key) => {
    const { params = {} } = navigation.state;
    return {
        tabBarVisible: false,
        title: (
            <VnrText i18nKey={params.title ? params.title : Title_Key} style={styleSheets.headerTitleStyle}>
                {Title_Key}
            </VnrText>
        ),
        headerLeft: () => {
            const { index, routes } = navigation.state;
            let params = null;
            if (routes && routes.length > 0) params = routes[index] ? routes[index]['params'] : null;
            else params = navigation.state ? navigation.state.params : null;

            return (params && params.headerLeft) ? params.headerLeft : <ButtonGoBackHome Key={Title_Key} navigation={navigation} />;
        },
        //headerLeft: () => <ButtonGoBackHome Key={Title_Key} navigation={navigation} />,
        headerStyle: {
            backgroundColor: Colors.white,
            shadowColor: 'transparent',
            shadowRadius: 0,
            shadowOffset: {
                height: 0
            },
            elevation: 0,
            borderBottomColor: Colors.gray_5,
            borderBottomWidth: 0.5
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
            // textTransform: 'uppercase',
            fontWeight: '500'
        },
        headerRight: () => {
            const { params = {} } = navigation.state;
            return params.headerRight;
        }
    };
};

const navigationOptionsTopTab = Title_Key => {
    return {
        title: translate(Title_Key)
    };
};

const navigationOptionsTopTabCustomHeaderRight = (navigation, Title_Key) => {
    const { params = {} } = navigation.state;
    return {
        tabBarVisible: false,
        title: (
            <VnrText i18nKey={params.title ? params.title : Title_Key} style={styleSheets.headerTitleStyle}>
                {Title_Key}
            </VnrText>
        ),
        headerLeft: () => <ButtonGoBackHome Key={Title_Key} navigation={navigation} />,
        headerStyle: {
            backgroundColor: Colors.white,
            shadowColor: 'transparent',
            shadowRadius: 0,
            shadowOffset: {
                height: 0
            },
            elevation: 0
        },
        headerTintColor: Colors.white,
        headerTitleStyle: {
            fontWeight: '500',
            color: Colors.gray_10
        },
        headerRight: () => {
            const { index, routes } = navigation.state;
            let params = null;
            if (routes && routes.length > 0) params = routes[index] ? routes[index]['params'] : null;
            else params = navigation.state ? navigation.state.params : null;

            return params ? params.headerRight : undefined;
        }
    };
};

export default {
    navigationOptionsConfig: navigationOptionsConfig,
    navigationOptionsConfigHeaderNull: navigationOptionsConfigHeaderNull,
    navigationOptionsConfigGoBack: navigationOptionsConfigGoBack,
    navigationOptionsConfigGoBackHone: navigationOptionsConfigGoBackHone,
    navigationOptionsTopTab: navigationOptionsTopTab,
    navigationOptionsTopTabCustomHeaderRight: navigationOptionsTopTabCustomHeaderRight,
    navigationOptionsConfigScreenTabbar: navigationOptionsConfigScreenTabbar
};
