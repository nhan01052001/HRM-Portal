import AsyncStorage from '@react-native-async-storage/async-storage';
import DrawerServices from '../../utils/DrawerServices';
import HttpService from '../../utils/HttpService';
import { VnrLoadingSevices } from '../../components/VnrLoading/VnrLoadingPages';
import NotificationsService from '../../utils/NotificationsService';
import store from '../../store';
import generalProfileInfo from '../../redux/generalProfileInfo';
import base64 from 'react-native-base64';
import { removeMultiKey, SInfoService } from '../../factories/LocalData';
import MessagingSoketIO from '../../utils/MessagingSoketIO';
import badgesNotification from '../../redux/badgesNotification';
import { logout as logoutIds4 } from 'react-native-app-auth';
import SignalRService from '../../utils/SignalRService';
import Vnr_Function from '../../utils/Vnr_Function';
import _ from 'lodash';
import { EnumUser } from '../constant';

/**
 * Class VnrStorageSingleton - quản lý dữ liệu người dùng
 */
class VnrStorageSingleton {
    constructor() {
        // Khởi tạo giá trị mặc định
        this._data = {
            // newApp layout V3
            isNewLayoutV3: true,
            // -------------------//
            isFinishedRateApp: false, // Đã đánh giá app chưa
            customerID: null,
            currentUser: null,
            apiConfig: null,
            providerSso: null,
            deviceToken: null,
            deviceID: null,
            languageApp: 'VN',
            useLanguage: 'VN,EN',
            topNavigate: [],
            linkSSO: null,
            touchID: null,
            loginWithBio: {
                username: null,
                password: null
            }
        };
    }

    /**
     * Phương thức lấy instance của singleton
     * @returns {VnrStorageSingleton} Instance của VnrStorageSingleton
     */
    static getInstance() {
        if (!VnrStorageSingleton._instance) {
            VnrStorageSingleton._instance = new VnrStorageSingleton();
        }
        return VnrStorageSingleton._instance;
    }

    /**
     * Phương thức lấy toàn bộ dữ liệu
     * @returns {Object} Dữ liệu người dùng
     */
    getData() {
        return this._data;
    }

    /**
     * Phương thức lấy dữ liệu theo loại sử dụng Strategy Pattern
     * @param {string} name - Tên thuộc tính cần lấy (userid, profileidapp, userlogin)
     * @returns {Object|null} Dữ liệu theo loại
     */
    getDataUserByName(name) {
        return this._data.currentUser?.headers?.[name] || null;
    }

    /**
     * Phương thức lấy userId của người dùng
     * @returns {string|null} UserId của người dùng hiện tại
     */
    getUserId() {
        return this.getDataUserByName('userid');
    }

    /**
     * Phương thức lấy profileId của người dùng
     * @returns {string|null} ProfileId của người dùng hiện tại
     */
    getProfileId() {
        return this.getDataUserByName('profileidapp');
    }

    /**
     * Phương thức lấy userLogin của người dùng
     * @returns {string|null} UserLogin của người dùng hiện tại
     */
    getUserLogin() {
        return this.getDataUserByName('userlogin');
    }

    /**
     * Phương thức cập nhật giá trị theo khóa
     * @param {string} property - Tên thuộc tính
     * @param {*} value - Giá trị cần cập nhật
     * @returns {Promise<boolean>} Kết quả cập nhật
     */
    async setValueByKey(property, value) {
        this._data[property] = value;
        await SInfoService.setItem(EnumUser.DATA_VNR_SECUR_LTM, this._data);
        return true;
    }

    /**
     * Phương thức cập nhật toàn bộ dữ liệu
     * @param {Object} dataFormStorage - Dữ liệu cần cập nhật
     * @returns {Promise<boolean>} Kết quả cập nhật
     */
    async setData(dataFormStorage) {
        Object.keys(dataFormStorage).forEach((key) => {
            this._data[key] = dataFormStorage[key];
        });
        await SInfoService.setItem(EnumUser.DATA_VNR_SECUR_LTM, this._data);
        return true;
    }

    /**
     * Phương thức cập nhật toàn bộ dữ liệu trừ currentUser lưu vào Storage
     * @param {Object} dataFormStorage - Dữ liệu cần cập nhật
     * @returns {Promise<boolean>} Kết quả cập nhật
     */
    async setDataQRStorage(dataFormStorage) {
        const cloneData = _.cloneDeep(this._data);
        Object.keys(dataFormStorage).forEach((key) => {
            cloneData[key] = dataFormStorage[key];
        });
        cloneData['currentUser'] = null;
        await AsyncStorage.setItem('@DATA_VNR_STORAGE', JSON.stringify(cloneData));
        return;
    }

    /**
     * Phương thức cập nhật dữ liệu từ thông tin người dùng
     * @param {Object} dataUser - Thông tin người dùng
     * @returns {Promise<boolean>} Kết quả cập nhật
     */
    async setDataFromUser(dataUser) {
        // login Lần đầu không gắn info
        if (dataUser && dataUser.IsFirstLogin === true) {
            this._data.currentUser = {
                headers: {
                    profileidapp: dataUser.ProfileID,
                    sysuserid: dataUser.UserID,
                    userid: dataUser.UserID,
                    userlogin: dataUser.UserName,
                    languagecode: dataUser.Language,
                    isportalapp: true,
                    tokenportalapp: dataUser.TokenPortalApp,
                    refreshToken: dataUser.refreshToken,
                    idToken: dataUser.idToken,
                    // SSO Token
                    cookieType: dataUser.cookieType ? dataUser.cookieType : null
                }
            };

            await SInfoService.setItem(EnumUser.DATA_VNR_SECUR_LTM, this._data);
            return true;
        }

        SInfoService.setItem('E_SAVE_ACCOUNT', {
            UserName: dataUser.UserName,
            Password: dataUser.Password
        });

        this._data.currentUser = {
            headers: {
                profileidapp: dataUser.ProfileID,
                sysuserid: dataUser.UserID,
                userid: dataUser.UserID,
                userlogin: dataUser.UserName,
                languagecode: dataUser.Language,
                isportalapp: true,
                tokenportalapp: dataUser.TokenPortalApp,
                refreshToken: dataUser.refreshToken,
                idToken: dataUser.idToken,
                // SSO Token
                cookieType: dataUser.cookieType ? dataUser.cookieType : null
            },
            info: {
                ProfileID: dataUser.ProfileID,
                Email: dataUser.Email,
                FullName: dataUser.FullName,
                ImagePath: dataUser.ImagePath,
                IsChat: dataUser.IsChat ? dataUser.IsChat : false,
                userid: dataUser.UserID,
                IsGroupChat: dataUser.IsGroupChat ? dataUser.IsGroupChat : false,

                // login bằng SSO
                isLoginSSO: dataUser.isLoginSSO ? true : false
            }
        };

        if (dataUser.UseLanguage) {
            this._data.useLanguage = dataUser.UseLanguage;
        } else {
            this._data.useLanguage = 'VN,EN';
        }

        if (dataUser.linkSSO) {
            this._data.linkSSO = dataUser.linkSSO;
        }

        this._data.deviceID = await Vnr_Function.getUnitIdApp();
        this._data.languageApp = dataUser.Language;
        this._data.versionApi = dataUser.versionApi;
        const { uriNews, serviceEndpointApi, chatEndpointApi, surveyEndpointApi, uriStorage, uriNewsWordPress } =
            dataUser;

        //tin tức
        if (uriNews) {
            const { uriMain, uriPor } = this._data.apiConfig;
            const { languageApp } = this._data;
            var str = {
                ConfigWeb: { uriNews: uriNews, uriMain: uriMain },
                ConfigOption: { languagecode: languageApp }
            };
            let btoaStr = base64.encode(JSON.stringify(str));
            let checkPath = uriPor.lastIndexOf('/') == uriPor.length - 1 ? '' : '/';
            let uriNewsBtoa = uriPor + checkPath + 'tech-blog/tech-index.html?data=' + btoaStr;
            this._data.apiConfig.uriNews = uriNewsBtoa;
        }

        if (uriNewsWordPress) {
            this._data.apiConfig.uriNewsWordPress = uriNewsWordPress;
        }

        //chat
        if (chatEndpointApi) {
            this._data.apiConfig.chatEndpointApi = chatEndpointApi;
        }

        //khảo sát
        if (surveyEndpointApi) {
            this._data.apiConfig.surveyEndpointApi = surveyEndpointApi;
        }

        // API Service
        if (serviceEndpointApi) {
            this._data.apiConfig.serviceEndpointApi = serviceEndpointApi;
        }

        // uriStorage image with Tenant
        if (uriStorage) {
            this._data.apiConfig.uriStorage = uriStorage;
        }

        await SInfoService.setItem(EnumUser.DATA_VNR_SECUR_LTM, this._data);
        return true;
    }

    /**
     * Phương thức lấy cấu hình SSO
     * @param {string} _UriIdentity - URI của Identity server (tùy chọn)
     * @returns {Promise<Object>} Cấu hình SSO
     */
    async getConfigSSO(_UriIdentity) {
        const identityserver = {
            issuer: null,
            clientId: 'hrm10_portal_app',
            redirectUrl: 'portal4hrm:/Home',
            clientSecret: 'secret',
            scopes: ['openid', 'profile', 'api', 'offline_access', 'IdentityServerApi'],
            responseTypes: ['code'],
            connectionTimeoutSeconds: 60,
            iosPrefersEphemeralSession: true,
            dangerouslyAllowInsecureHttpRequests: true
        };

        if (this._data.apiConfig && this._data.apiConfig.uriIdentity) {
            identityserver.issuer = this._data.apiConfig.uriIdentity;
        } else if (_UriIdentity) {
            identityserver.issuer = _UriIdentity;
        } else {
            let _customerID = null;
            if (this._data.customerID) {
                _customerID = this._data.customerID;
            } else {
                const dataListQr = await AsyncStorage.getItem('@DATA_SCANED_QR_LIST'),
                    dataListQrJson = dataListQr != null ? JSON.parse(dataListQr) : [],
                    qrSelected = dataListQrJson.find((item) => item.isSelect == true);

                _customerID = qrSelected.ID;
            }

            const dataQR = await HttpService.Get('https://qr.vnresource.net/api/AppCustomer?QRCode=' + _customerID);

            if (dataQR && dataQR.UriPor && dataQR.UriHR && dataQR.UriMain && dataQR.UriSys && dataQR.ID) {
                let dataFile = {
                    uriPor: dataQR.UriPor,
                    uriSys: dataQR.UriSys,
                    uriHr: dataQR.UriHR,
                    uriMain: dataQR.UriMain,
                    uriCenter: dataQR.UriCenter,
                    uriIdentity: dataQR.UriIdentity
                };

                // Phải gọi Api để lấy uriIdentity vì bản tải từ appstore không có uriIdentity
                identityserver.issuer = dataFile.uriIdentity;

                this._data.apiConfig = { ...dataFile };
                this._data.customerID = dataQR.ID;
                await this.setData(this._data);
            }
        }

        return identityserver;
    }
}

// Khởi tạo instance static
VnrStorageSingleton._instance = null;

// Tạo instance của singleton
const dataVnrStorageInstance = VnrStorageSingleton.getInstance();

/**
 * Hàm đăng xuất người dùng
 * @param {Object} params - Tham số đăng xuất
 * @returns {Promise<void>}
 */
export const logout = async (params) => {
    try {
        VnrLoadingSevices.show();

        let _dataVnrStorage = getDataVnrStorage(),
            { currentUser } = _dataVnrStorage,
            _idToken = null;

        //disconnect socket
        MessagingSoketIO.send({}, 'CLIENT-LOGOUT');
        if (currentUser) {
            const dataLogout = {
                userID: currentUser.headers.userid,
                deviceToken: _dataVnrStorage.deviceToken
            };

            if (dataLogout && dataLogout.deviceToken && dataLogout.userID)
                HttpService.Post('[URI_HR]/Por_GetData/LogoutAppMobile', dataLogout);
        }

        // Xóa dữ liệu cache trên server
        if (_dataVnrStorage.currentUser && _dataVnrStorage.currentUser.headers)
            await HttpService.Post(
                '[URI_POR]/Portal/ResetCacheApp',
                {
                    userLogin: _dataVnrStorage.currentUser.headers.userlogin,
                    isActiveUser: params && params.isActiveUser == false ? false : true,
                    deviceID: dataVnrStorage.deviceID ? dataVnrStorage.deviceID : ''
                },
                {
                    headers: _dataVnrStorage.currentUser.headers
                }
            );

        // kiểm tra login Ids4 và có tokent id
        if (
            currentUser &&
            currentUser.info &&
            currentUser.info.isLoginSSO &&
            currentUser.headers &&
            currentUser.headers.tokenportalapp
        ) {
            _idToken = currentUser.headers.idToken;
        }

        // logout SSO
        _dataVnrStorage.currentUser = null;
        // Xoá topNavigate 4 Item Menu
        _dataVnrStorage.topNavigate = [];

        await setdataVnrStorage(_dataVnrStorage);

        // clear current token
        HttpService.resetToken();
        //set number chuông thông báo về 0
        store.dispatch(badgesNotification.actions.clearStateAllBadges(0));

        //Đưa data Profile về null
        store.dispatch(generalProfileInfo.actions.setGeneralProfileInfo(null));
        // Xoá tất cả notification của user hiện tạn khi logout
        NotificationsService.removeAllNotifications();

        SignalRService.disconnect(); // disconnect signal

        const removeCacheData = await removeMultiKey();
        if (removeCacheData.actionStatus) {
            // Xoá dữ liệu cache
            DrawerServices.navigate('Login');
            VnrLoadingSevices.hide();

            // Có id Token thì mới logout
            if (_idToken) {
                const configIdentity = await getConfigSSO();

                logoutIds4(configIdentity, {
                    idToken: _idToken,
                    postLogoutRedirectUrl: configIdentity.redirectUrl
                });
            }
        }
    } catch (error) {
        VnrLoadingSevices.hide();
        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
    }
};

/**
 * Lấy dữ liệu người dùng
 * @returns {Object} Dữ liệu người dùng
 */
export const getDataVnrStorage = () => {
    return dataVnrStorageInstance.getData();
};

/**
 * Cập nhật giá trị theo khóa
 * @param {string} property - Tên thuộc tính
 * @param {*} value - Giá trị cần cập nhật
 * @returns {Promise<boolean>} Kết quả cập nhật
 */
export const setdataVnrStorageFromValue = async (property, value) => {
    return await dataVnrStorageInstance.setValueByKey(property, value);
};

/**
 * Cập nhật dữ liệu từ thông tin người dùng
 * @param {Object} dataUser - Thông tin người dùng
 * @returns {Promise<boolean>} Kết quả cập nhật
 */
export const setdataVnrStorageFromDataUser = async (dataUser) => {
    return await dataVnrStorageInstance.setDataFromUser(dataUser);
};

/**
 * Cập nhật toàn bộ dữ liệu
 * @param {Object} dataFormStorage - Dữ liệu cần cập nhật
 * @returns {Promise<boolean>} Kết quả cập nhật
 */
export const setdataVnrStorage = async (dataFormStorage) => {
    return await dataVnrStorageInstance.setData(dataFormStorage);
};


/**
 * Cập nhật toàn bộ dữ liệu trừ current user lưu vào Storage
 * @param {Object} dataFormStorage - Dữ liệu cần cập nhật
 * @returns {Promise<boolean>} Kết quả cập nhật
 */
export const setdataDataQrStorage = async (dataFormStorage) => {
    return await dataVnrStorageInstance.setDataQRStorage(dataFormStorage);
};

/**
 * Lấy cấu hình SSO
 * @param {string} _UriIdentity - URI của Identity server (tùy chọn)
 * @returns {Promise<Object>} Cấu hình SSO
 */
export const getConfigSSO = async (_UriIdentity) => {
    return await dataVnrStorageInstance.getConfigSSO(_UriIdentity);
};

/**
 * Lấy dữ liệu theo loại
 * @param {string} type - Loại dữ liệu cần lấy ('userInfo', 'userHeader', 'apiConfig')
 * @returns {Object|null} Dữ liệu theo loại
 */
export const getDataUserByType = (type) => {
    return dataVnrStorageInstance.getDataUserByName(type);
};

/**
 * Lấy userId của người dùng
 * @returns {string|null} UserId của người dùng hiện tại
 */
export const getUserId = () => {
    return dataVnrStorageInstance.getUserId();
};

/**
 * Lấy profileId của người dùng
 * @returns {string|null} ProfileId của người dùng hiện tại
 */
export const getProfileId = () => {
    return dataVnrStorageInstance.getProfileId();
};

/**
 * Lấy userLogin của người dùng
 * @returns {string|null} UserLogin của người dùng hiện tại
 */
export const getUserLogin = () => {
    return dataVnrStorageInstance.getUserLogin();
};

// Duy trì export biến dataVnrStorage cho các file cũ
export const dataVnrStorage = dataVnrStorageInstance.getData();
