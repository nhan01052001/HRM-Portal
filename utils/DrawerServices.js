import { DrawerActions } from 'react-navigation-drawer';
import { NavigationActions } from 'react-navigation';
import { ConfigVersionBuild } from '../assets/configProject/ConfigVersionBuild';
import { getDataVnrStorage } from '../assets/auth/authentication';
import Vnr_Services from './Vnr_Services';
import { translate } from '../i18n/translate';

let _Drawercontainer = null,
    _historyRouter = [],
    _navigateFromNotify = false,
    _checkNavigationTo = '';

const getNavigationTo = () => {
    return _checkNavigationTo;
};

const setNavigationTo = urlDeepLink => {
    _checkNavigationTo = urlDeepLink;
};

const getDrawercontainer = () => {
    return _Drawercontainer;
};

const setDrawercontainer = Drawercontainer => {
    if (Drawercontainer != null) {
        _Drawercontainer = Drawercontainer;
    }
};

const getNavigateFromNotify = () => {
    return _navigateFromNotify;
};

const setNavigateFromNotify = bool => {
    _navigateFromNotify = bool;
};

const getCurrentScreen = () => {
    return _historyRouter.length > 0 ? _historyRouter[0] : null;
};

const getBeforeScreen = () => {
    return _historyRouter.length > 1 ? _historyRouter[1] : null;
};

const setHistoryScreen = value => {
    let _getHistoryRouter = [..._historyRouter];
    if (value != null && getCurrentScreen() !== value) {
        if (_getHistoryRouter.length == 2) {
            // xoá đi 1 phần tử ở cuối mảng
            _getHistoryRouter.pop();
        }
        // set lịch sử chuyển hướng
        _historyRouter = [...[value], ..._getHistoryRouter];
    }
};

const navigate = (routeName, params) => {
    if (_Drawercontainer != null) {
        _Drawercontainer.dispatch(
            NavigationActions.navigate({
                routeName,
                params
            })
        );
    }
};

const navigateForVersion = (routeName, params) => {
    if (_Drawercontainer != null) {
        const checkVersion = ConfigVersionBuild.value;
        const navigateAction = NavigationActions.navigate({
            routeName: `Main${checkVersion}`,
            params: {},
            action: NavigationActions.navigate({
                routeName: routeName,
                params: params
            })
        });

        _Drawercontainer.dispatch(navigateAction);
    }
};

const navigateToTab = (tabNameOrParentName, routeName, params) => {
    if (_Drawercontainer != null && tabNameOrParentName && routeName) {
        const navigateAction = NavigationActions.navigate({
            routeName: tabNameOrParentName,
            params: params,
            action: NavigationActions.navigate({
                routeName: routeName,
                params: params
            })
        });

        _Drawercontainer.dispatch(navigateAction);
    }
};

const openDrawer = () => {
    if (_Drawercontainer != null) {
        _Drawercontainer.dispatch(DrawerActions.openDrawer());
    }
};

const closeDrawer = () => {
    if (_Drawercontainer != null) {
        _Drawercontainer.dispatch(DrawerActions.closeDrawer());
    }
};
const goBack = () => {
    if (_Drawercontainer != null) {
        _Drawercontainer.dispatch(NavigationActions.back());
    }
};

const OpenDeeplink = urlDeepLink => {
    if (urlDeepLink && urlDeepLink.includes('portal4hrm://main/')) {
        let _dataVnrStorage = getDataVnrStorage(),
            { currentUser } = _dataVnrStorage;

        try {
            const split = urlDeepLink.split('portal4hrm://main/'),
                getUrlandName = split[1].split('?'),
                screenName = getUrlandName && getUrlandName.length > 0 ? getUrlandName[0] : null,
                data = getUrlandName && getUrlandName.length > 0 ? getUrlandName[1] : null;

            if (screenName) {
                if (currentUser && currentUser.info) {
                    if (screenName == 'AttTSLCheckInOutNFC') {
                        setNavigationTo('');
                        navigate(screenName, {
                            isFromTagNFC: true
                        });
                    } else if (data && data.includes('=')) {
                        const splitData = data.split('&'),
                            params = {};

                        splitData.forEach(el => {
                            if (el && el.indexOf('=') > 0) {
                                let textField = el.split('=')[0],
                                    value = el.substring(el.indexOf('=') + 1, el.length);
                                if (textField && value) {
                                    params[textField] = value;
                                }
                            }
                        });

                        setNavigationTo('');
                        if (params?.encoding === true || (typeof params?.encoding === 'string' && params?.encoding === 'true')) {
                            //
                            Object.keys(params).forEach((field) => {
                                if (field !== 'encoding') {
                                    params[field] = Vnr_Services.decryptCode(params[field]);
                                }
                            });
                        }

                        if (params?.current && typeof params?.current === 'string' && params?.current.length > 0) {
                            if (params?.current !== currentUser?.info?.userid) {
                                navigate('ErrorScreen', {
                                    ErrorDisplay: {
                                        response: {
                                            status: 403,
                                            message: translate('HRM_PortalApp_NoPermission')
                                        }
                                    },
                                    isShowMess: true,
                                    isHiddenFeedback: true,
                                    isHiddenDownloadError: true,
                                    isHiddenScanQrAgain: true
                                });
                                return;
                            }
                        }

                        navigate(screenName, {
                            ...params
                        });
                    } else {
                        setNavigationTo('');
                        navigate(screenName);
                    }
                } else {
                    setNavigationTo(urlDeepLink);
                }
            }
        } catch (error) {
            //
        }
    }
};

const getParentScreen = (pushScreenName, screenNameDetail, router = _Drawercontainer?._navigation?._childrenNavigation?.Main?.router?.childRouters?.Main?.childRouters) => {
    const allScreen = router,
        findPushScreenName = allScreen[pushScreenName];

    if (findPushScreenName)
        return findPushScreenName;
    let arrayAllScreen = [];
    if (allScreen) {
        arrayAllScreen = Object.keys(allScreen);
    }
    if (arrayAllScreen.length === 0)
        return null;
    let finalResult = arrayAllScreen.find((item) => allScreen[item] && allScreen[item]?.childRouters && allScreen[item]?.childRouters[screenNameDetail] !== undefined
        ? item
        : allScreen[item]?.childRouters ? getParentScreen(pushScreenName, screenNameDetail, allScreen[item]?.childRouters) : null);
    if (finalResult)
        return finalResult;
    return null;
};

export default {
    getDrawercontainer,
    setDrawercontainer,
    getCurrentScreen: getCurrentScreen,
    getBeforeScreen: getBeforeScreen,
    setHistoryScreen: setHistoryScreen,
    navigate,
    navigateForVersion,
    openDrawer,
    closeDrawer,
    goBack,
    getNavigateFromNotify,
    setNavigateFromNotify,
    OpenDeeplink,
    getNavigationTo,
    getParentScreen,
    navigateToTab
};
