/* eslint-disable no-console */
import React, { Component } from 'react';
import { View, StyleSheet, Image, StatusBar, Platform } from 'react-native';
import { Colors, Size } from '../../constants/styleConfig';
import NotificationsService from '../../utils/NotificationsService';
import Vnr_Function from '../../utils/Vnr_Function';
import AsyncStorage from '@react-native-async-storage/async-storage';
import HttpService from '../../utils/HttpService';
import languageReducer from '../../redux/i18n';
import { ConfigDashboard } from '../../assets/configProject/ConfigDashboard';
import { ConfigField } from '../../assets/configProject/ConfigField';
import { ConfigList } from '../../assets/configProject/ConfigList';
import { ConfigListDetail } from '../../assets/configProject/ConfigListDetail';
import { ConfigListFilter } from '../../assets/configProject/ConfigListFilter';
import { PermissionForAppMobile } from '../../assets/configProject/PermissionForAppMobile';
import { ConfigMappingSalary } from '../../assets/configProject/ConfigMappingSalary';
import { ConfigChart } from '../../assets/configProject/ConfigChart';
import { dataVnrStorage, getDataVnrStorage, logout, setdataVnrStorage } from '../../assets/auth/authentication';
import store from '../../store';
import { startTask } from '../../factories/BackGroundTask';
import { getDataLocal, saveDataLocal } from '../../factories/LocalData';
import { EnumIcon, EnumName, EnumTask, ScreenName } from '../../assets/constant';
import { connect } from 'react-redux';
import badgesNotification from '../../redux/badgesNotification';
import { UpdateVersionApi } from '../../components/modalUpdateVersion/ModalUpdateVersion';
import { AlertSevice } from '../../components/Alert/Alert';
import * as Progress from 'react-native-progress';
import DrawerServices from '../../utils/DrawerServices';
import { setDataLang } from '../../i18n/setDataLang';
import SignalRService from '../../utils/SignalRService';
import Vnr_Services from '../../utils/Vnr_Services';
import { SaveLogError } from '../modules/feedback/Api';

const sourceLogo = '../../assets/images/LogoPlashScreen.png';

class PermissionScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            keyQuery: EnumName.E_PRIMARY_DATA,
            isLoadingHeader: true,
            urlIcon: null
        };
        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            this.handelPermission();
        });

        if (Platform.OS == 'android') {
            StatusBar.setBackgroundColor(Colors.white, true);
        }

        StatusBar.setBarStyle('dark-content');
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    setLanguage = async (language, dataLang) => {
        if (dataLang) {
            const dataListLocal = await getDataLocal(EnumTask.KT_Permission_RequestDataConfig),
                dataConfigLocal = dataListLocal ? dataListLocal[EnumName.E_PRIMARY_DATA] : null;

            dataConfigLocal[2] = dataLang;
            await saveDataLocal(EnumTask.KT_Permission_RequestDataConfig, {
                [EnumName.E_PRIMARY_DATA]: dataConfigLocal
            });

            language !== null && store.dispatch(languageReducer.actions.changeLanguage(language));
            this.router('Permission');
        } else {
            language !== null && store.dispatch(languageReducer.actions.changeLanguage(language));
        }
    };

    reGetCongfigLanguage = () => {
        AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            title: 'Lỗi ngôn ngữ',
            message: 'Kết nối không ổn định bạn có thể bấm tại lại khi kết nối mạng tốt hơn',
            showCancel: false,
            textRightButton: 'Tải lại',
            onConfirm: () => {
                startTask({
                    keyTask: EnumTask.KT_Permission_RequestDataConfig,
                    payload: {
                        keyQuery: EnumName.E_PRIMARY_DATA,
                        isGetLang: true,
                        isGetConfigApp: false,
                        isGetConfigAppByUser: false
                    }
                });
            }
        });
    };

    permissionGranted = async (dataFormStorage) => {
        await setdataVnrStorage(dataFormStorage);
        this.setLanguage(dataVnrStorage.languageApp);
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (
            nextProps.reloadScreenName == EnumTask.KT_Permission_RequestDataConfig &&
            keyQuery === nextProps.message.keyQuery
        ) {
            this.requestDataConfig(true, dataVnrStorage);
        }

        // if (nextProps.reloadScreenName == ScreenName.AttSubmitTSLRegister) {
        //     this.pullToRefresh()
        // }

        // trường hợp không có internet, lắng nghe sự kiện bấm "thử lại"
        if (nextProps.reloadScreenName == ScreenName.Permission) {
            Vnr_Services.startTaskGetDataConfig(dataVnrStorage, true);
        }

        // Tắt mở lại app không có internet khi có internet tự chạy lại
        if (this.props.isConnected == false && nextProps.isConnected == true) {
            this.handelPermission();
        }
    }

    // startTaskGetDataConfig = (_dataCurrentUser, isHaveData) => {
    //     Vnr_Services.startTaskGetDataConfig(_dataCurrentUser, isHaveData);
    // };

    getCountNumberNotify = () => {
        const { fetchCountNotifyInfo } = this.props;
        if (
            PermissionForAppMobile.value &&
            PermissionForAppMobile.value &&
            PermissionForAppMobile.value['New_Feature_Notification_Tabbar'] &&
            PermissionForAppMobile.value['New_Feature_Notification_Tabbar']['View'] &&
            fetchCountNotifyInfo &&
            typeof fetchCountNotifyInfo == 'function'
        ) {
            fetchCountNotifyInfo();
        }
    };

    getLangCodeByUser = () => {
        HttpService.Get(
            `[URI_POR]/Portal/GetLangCodeByUser?userLogin=${dataVnrStorage.currentUser.headers.userlogin}`
        ).then((language) => {
            if (
                language &&
                (language === 'VN' || language === 'EN' || language === 'CN') &&
                dataVnrStorage.languageApp !== null &&
                dataVnrStorage.languageApp !== language
            ) {
                AlertSevice.alert({
                    iconType: EnumIcon.E_INFO,
                    message: 'HRM_PortalApp_Alert_Reload_Languages',
                    showCancel: false,
                    textRightButton: 'HRM_PortalApp_Common_Reload',
                    onConfirm: () => {
                        HttpService.Get(`[URI_POR]/Portal/GetLangMobile?langcode=${language}`).then((dataLang) => {
                            dataVnrStorage.languageApp = language;
                            dataVnrStorage.currentUser.headers.languagecode = language;
                            setdataVnrStorage(dataVnrStorage);
                            this.setLanguage(language, dataLang);
                        });
                    }
                });
            }
        });
    };

    checkUserActive = () => {
        const _dataVnrStorage = getDataVnrStorage();
        HttpService.Post('[URI_POR]/Portal/CheckUserActive', {
            userID: _dataVnrStorage.currentUser.headers.userid
        }).then((res) => {
            if (res !== null && res === false) {
                //false => InActive => về view Login, clear storage
                logout({ isActiveUser: false });
            }
        });
    };

    checkGetConfig = (_dataCurrentUser) => {
        const _params =
                this.props.navigation?.state && this.props.navigation?.state?.params
                    ? this.props.navigation?.state?.params
                    : {},
            { isFromLogin } = _params && typeof _params == 'object' ? _params : JSON.parse(_params);

        if (isFromLogin) {
            // Từ login vào
            Vnr_Services.startTaskGetDataConfig(_dataCurrentUser, false);
        } else {
            // Get data Lcoal
            this.requestDataConfig(false, _dataCurrentUser);
        }
    };

    requestDataConfig = async (isReload = false, _dataCurrentUser) => {
        try {
            const res = await getDataLocal(EnumTask.KT_Permission_RequestDataConfig);
            const getDataConfig = res?.[EnumName.E_PRIMARY_DATA];

            if (getDataConfig) {
                this.configureApp(getDataConfig, isReload);

                // Có dữ liệu => Check dateUpdate
                !isReload && Vnr_Services.startTaskGetDataConfig(_dataCurrentUser, true);
            } else {
                // Không có config => Lấy dữ liệu mới
                Vnr_Services.startTaskGetDataConfig(_dataCurrentUser, false);
            }
        } catch (error) {
            console.log(error);

            SaveLogError(error);
        }
    };

    configureApp = (getDataConfig, isReload) => {
        try {
            const [configApp, configAppByUser, dataLang, dataLangEN] = getDataConfig || [];
            if (getDataConfig[0]) {
                let configListDetailRes = JSON.parse(configApp[2]);

                ConfigList.value = JSON.parse(configApp[0]);
                ConfigListFilter.value = JSON.parse(configApp[1]);
                ConfigListDetail.value = configListDetailRes;
                ConfigListDetail.configAlign = configListDetailRes.StyleLineViewDetail
                    ? configListDetailRes.StyleLineViewDetail
                    : 'E_ALIGN_LAYOUT';
                ConfigField.value = JSON.parse(configApp[3]);
                ConfigMappingSalary.value = JSON.parse(configApp[4]);
                ConfigChart.value = configApp[5] && JSON.parse(configApp[5]);
                //config chart
                if (configApp[5]) {
                    ConfigChart.value = JSON.parse(configApp[5]);
                }

                if (UpdateVersionApi && typeof UpdateVersionApi.checkVersion === 'function') {
                    UpdateVersionApi.checkVersion();
                }
            }

            //config navigate
            if (configAppByUser) {
                ConfigDashboard.value = configAppByUser[0];
                // ConfigDrawer.value = configAppByUser[1];
                PermissionForAppMobile.value = configAppByUser[2];
            }

            //config lang VN or EN or ...
            if (dataLang && typeof dataLang === 'object' && Object.keys(dataLang).length > 0) {
                setDataLang(dataLang, dataVnrStorage.languageApp);
            } else {
                // Lỗi ngôn ngữ
                this.reGetCongfigLanguage();
                return;
            }

            //config lang EN
            if (dataLangEN && typeof dataLangEN === 'object' && Object.keys(dataLangEN).length > 0) {
                setDataLang(dataLangEN, 'EN');
            }

            AsyncStorage.setItem('@DATA_VNR_STORAGE', JSON.stringify(dataVnrStorage));
            if (dataVnrStorage.currentUser && dataVnrStorage.currentUser.headers) {
                const { apiConfig } = dataVnrStorage;
                if (apiConfig && apiConfig.uriIdentity != null) {
                    // Refresh token
                    //HttpService.startRefreshToken();
                    SignalRService.startConnect();
                } else {
                    !isReload && this.checkUserActive();
                }
            }
            //config FCM
            NotificationsService.initAndroidFirebase(null);

            //không có trong cac bản build này
            this.getCountNumberNotify();

            // đồng bộ ngôn ngữ , trơờng hợp relooad thì kh4ng cần chạy hàm này
            if (!isReload && dataVnrStorage.currentUser && dataVnrStorage.currentUser.headers) {
                this.getLangCodeByUser();
            }

            const getNavigationTo = DrawerServices.getNavigationTo();
            if (getNavigationTo && getNavigationTo != '') {
                // click deeplink khi app 0ang offline
                DrawerServices.OpenDeeplink(getNavigationTo);
            } else {
                this.router('Main');
            }

            DrawerServices.checkNavigationToNFC == false;
        } catch (error) {
            SaveLogError(error);
            console.log(error);
            DrawerServices.navigate('Login');
        }
    };

    callbackFirebase = async (tokenFirebase) => {
        dataVnrStorage.deviceToken = tokenFirebase;
        await setdataVnrStorage(dataVnrStorage);

        if (dataVnrStorage.apiConfig == null) {
            this.router('QrScanner');
        } else {
            this.router('Login');
        }
    };

    updateTokenApp = (dataFormStorage) => {
        const { currentUser } = dataFormStorage;
        const dataUpdate = {
            LanguageCode: currentUser.headers.languagecode,
            DeviceToken: dataFormStorage.deviceToken
        };
        if (dataUpdate && dataUpdate.DeviceToken) {
            HttpService.Post('[URI_HR]/Por_GetData/UpdateTokenFirebaseApp', dataUpdate);
        }
    };

    handleLogined = async (deviceToken, _dataCurrentUser) => {
        if (deviceToken == null) {
            // chua duoc cap quyen , da login
            let newCalllBack = async (tokenFirebase) => {
                _dataCurrentUser.deviceToken = tokenFirebase;
                await this.permissionGranted(_dataCurrentUser);
                this.updateTokenApp(_dataCurrentUser);
                this.checkGetConfig(_dataCurrentUser);
            };

            NotificationsService.initAndroidFirebase(newCalllBack);
        } else {
            // da duoc cap quyen , da login
            await this.permissionGranted(_dataCurrentUser);
            this.checkGetConfig(_dataCurrentUser);
            // !isFromLogin && this.requestDataConfig();

            // // chạy Task GetDataConfig
            // this.startTaskGetDataConfig(_dataCurrentUser);
        }
    };

    getUrl = (apiConfig) => {
        const { uriPor } = apiConfig;
        this.setState({
            urlIcon: `${uriPor}/Content/images/icons/LogoPlashScreen.png`
        });
    };

    handelPermission = async () => {
        try {
            let dataStorage = await AsyncStorage.getItem('@DATA_VNR_STORAGE');

            // if (dataStorage == null) {
            //   // Lấy cấu hình cũ lưu vào cái SInfoService. lưu trong SInfoService thông tin được bảo mật hơn
            //   const dataCheck = await AsyncStorage.getItem('@DATA_VNR_STORAGE');
            //   if (dataCheck !== null) {
            //     const dataVnrCheck = typeof dataCheck == 'string' ? JSON.parse(dataCheck) : dataCheck;
            //     dataStorage = dataVnrCheck;
            //   }
            // }

            if (dataStorage !== null) {
                const _dataCurrentUser = typeof dataStorage == 'string' ? JSON.parse(dataStorage) : dataStorage;
                const { apiConfig, currentUser, deviceToken } = _dataCurrentUser;

                if (!Vnr_Function.CheckIsNullOrEmpty(apiConfig)) {
                    this.getUrl(apiConfig);
                    // da login
                    if (
                        !Vnr_Function.CheckIsNullOrEmpty(currentUser) &&
                        currentUser.headers != null &&
                        currentUser.info != null
                    ) {
                        this.handleLogined(deviceToken, _dataCurrentUser);
                    } else {
                        // da duoc cap quyen, logout
                        await setdataVnrStorage(_dataCurrentUser);
                        this.setLanguage(_dataCurrentUser.languageApp);
                        NotificationsService.initAndroidFirebase(this.callbackFirebase.bind(this));
                    }
                } else {
                    // chua login
                    NotificationsService.initAndroidFirebase(this.callbackFirebase.bind(this));
                }
            } else {
                NotificationsService.initAndroidFirebase(this.callbackFirebase.bind(this));
            }
        } catch (e) {
            console.log(e);
            SaveLogError(e);
        }
    };

    router = (roouterName) => {
        const { navigation } = this.props;
        this.setState({
            isLoadingHeader: false
        });
        navigation.navigate(roouterName);
    };

    render() {
        const { isLoadingHeader, urlIcon } = this.state;

        return (
            <View style={styles.BackgroundLogin} accessibilityLabel="Permission-Loading">
                {/* <Image source={require(sourceLogo)} style={sizeLogo} resizeMode={'contain'} /> */}
                {urlIcon ? (
                    <Image source={{ uri: urlIcon }} style={styles.sizeLogo} resizeMode={'contain'} />
                ) : (
                    <Image source={require(sourceLogo)} style={styles.sizeLogo} resizeMode={'contain'} />
                )}
                <View style={styles.styContentPer}>
                    {isLoadingHeader ? (
                        <Progress.Bar
                            progress={0}
                            width={WIDTH_PROGRESS}
                            indeterminate={true}
                            borderWidth={0}
                            height={2}
                            borderRadius={5}
                            animationType={'decay'}
                            color={Colors.primary_7}
                        />
                    ) : (
                        <View />
                    )}
                </View>
            </View>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message,
        isConnected: state.network.isConnected
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchCountNotifyInfo: () => {
            dispatch(badgesNotification.actions.fetchCountNotifyInfo());
        }
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(PermissionScene);

const MAX_WIDTH = Size.deviceWidth * 0.56;
const WIDTH_PROGRESS = Size.deviceWidth * 0.4 > MAX_WIDTH ? MAX_WIDTH : Size.deviceWidth * 0.4;

const styles = StyleSheet.create({
    BackgroundLogin: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
        alignItems: 'center'
    },
    sizeLogo: {
        height: 191 * (Size.deviceWidth / 537),
        maxWidth: Size.deviceWidth * 0.56,
        aspectRatio: 2
    }
});
