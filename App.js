/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { AppState, Linking } from 'react-native';
import store from './store';
import { Provider } from 'react-redux';
import DrawerServices from './utils/DrawerServices';
import ModalUpdateVersion, { UpdateVersionApi } from './components/modalUpdateVersion/ModalUpdateVersion';
import AppRootContainer from './navigation/RootNavigator';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import NetworkProvider from './components/network/NetworkProvider';
import ToasterComponent from './components/Toaster/Toaster';
import VnrLoadingPages from './components/VnrLoading/VnrLoadingPages';
import ModalCheckEmps from './components/modal/ModalCheckEmps';
import ModalShowData from './components/modal/ModalShowData';
import AlertComponent from './components/Alert/Alert';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import codePush from 'react-native-code-push';
import SplashScreen from 'react-native-splash-screen';
import { getDataVnrStorage } from './assets/auth/authentication';
import HttpService, { checkReloadRequestError } from './utils/HttpService';
import { resetTaskRunning } from './factories/BackGroundTask';
import NetInfo from '@react-native-community/netinfo';
import VnrBalloon from './components/VnrBalloon/VnrBalloon';
import { DashboardApi } from './scenes/home/Home';
import SignalRService from './utils/SignalRService';
import Vnr_Services from './utils/Vnr_Services';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            appState: AppState.currentState,
            isFeedback: false
        };

        this.handleOpenURL = this.handleOpenURL.bind(this);
    }

    componentWillUnmount() {
        AppState.removeEventListener('change', this._handleAppStateChange);
        // RNShake.removeEventListener('ShakeEvent');
    }

    router = (roouterName) => {
        const { navigation } = this.props;
        navigation.navigate(roouterName);
    };

    _handleAppStateChange = (nextAppState) => {
        if (nextAppState === 'background') {
            // console.log("App is in Background Mode.")
        }
        if (nextAppState === 'active') {
            this.jobActions();
        }
    };

    jobActions = () => {
        NetInfo.fetch().then((res) => {
            if (res.isConnected) {
                // kiểm tra phiên bản cập
                if (UpdateVersionApi.checkVersion && typeof UpdateVersionApi.checkVersion == 'function') {
                    UpdateVersionApi.checkVersion();
                }

                // Chống spam API
                resetTaskRunning();

                // đồng bộ ngôn ngữ
                let _dataVnrStorage = getDataVnrStorage(),
                    { currentUser } = _dataVnrStorage;

                if (currentUser && currentUser.info && currentUser.info.isLoginSSO) {
                    // reconnect SignalR
                    SignalRService.startConnect();
                }

                // đếm lại số dòng chờ duyệt icon, badge
                if (
                    currentUser &&
                    currentUser.info &&
                    currentUser.info.isLoginSSO &&
                    currentUser.headers &&
                    currentUser.headers.tokenportalapp
                ) {
                    this.reGetCountApp();
                }

                // if (checkReloadRequestError) {
                //     checkReloadRequestError();
                // }

                if (currentUser && currentUser.info) {
                    Vnr_Services.startTaskGetDataConfig(_dataVnrStorage);
                }
            }
        });
    };

    reGetCountApp = () => {
        DashboardApi.reGetCountApp && DashboardApi.reGetCountApp();
    };

    listenerNetWork = (isConnect) => {
        if (isConnect === true) {
            // kiem tra 1 lan nua
            this.jobActions();
        }
    };

    handleOpenURL(event) {
        // adb shell am start -a android.intent.action.VIEW -d "portal4hrm://main/" com.hrmeportal
        if (event && event.url) {
            DrawerServices.OpenDeeplink(event.url);
        }
    }

    _getCurrentRouteName(navState) {
        if (Object.prototype.hasOwnProperty.call(navState, 'index')) {
            this._getCurrentRouteName(navState.routes[navState.index]);
        } else {
            DrawerServices.setHistoryScreen(navState.routeName);
        }
    }

    componentDidMount() {
        setTimeout(() => {
            SplashScreen.hide();
        }, 0);
        AppState.addEventListener('change', this._handleAppStateChange);

        Linking.getInitialURL().then((url) => this.handleOpenURL({ url }));

        Linking.addEventListener('url', this.handleOpenURL);
    }

    render() {
        return (
            <Provider store={store}>
                <SafeAreaProvider>
                    <ToasterComponent />
                    <VnrLoadingPages />
                    <ModalCheckEmps />
                    <ModalShowData />
                    <VnrBalloon />
                    <ErrorBoundary>
                        <AppRootContainer
                            ref={(Drawercontainer) => DrawerServices.setDrawercontainer(Drawercontainer)}
                            onNavigationStateChange={(prevState, newState) => {
                                this._getCurrentRouteName(newState);
                            }}
                        />
                    </ErrorBoundary>
                    <AlertComponent />
                    <NetworkProvider listenerNetWork={this.listenerNetWork} />
                    <ModalUpdateVersion />
                    {/* <Authorize /> */}
                </SafeAreaProvider>
            </Provider>
        );
    }
}

const codePushOptions = {
    checkFrequency: codePush.CheckFrequency.MANUAL
    //installMode: codePush.InstallMode.IMMEDIATE
};
export default codePush(codePushOptions)(App);
