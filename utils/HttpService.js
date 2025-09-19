/* eslint-disable no-async-promise-executor */
/* eslint-disable no-console */
import axios from 'axios';
import { getConfigSSO, getDataVnrStorage, logout, setdataVnrStorageFromValue } from '../assets/auth/authentication';
import Vnr_Function from './Vnr_Function';
import DrawerServices from './DrawerServices';
import { VnrLoadingSevices } from '../components/VnrLoading/VnrLoadingPages';
import store from '../store';
import { AlertSevice } from '../components/Alert/Alert';
import { EnumIcon, EnumName } from '../assets/constant';
import { authorize, refresh } from 'react-native-app-auth';
import { ToasterSevice } from '../components/Toaster/Toaster';
import { SaveLogError } from '../scenes/modules/feedback/Api';
import moment from 'moment';

// Thời gian buffer trước khi token hết hạn (5 phút)
const TOKEN_EXPIRY_BUFFER = 5 * 60 * 1000;
// Thời gian tối thiểu giữa các lần refresh (1 phút)
const MIN_REFRESH_INTERVAL = 60 * 1000;
class HttpServiceClass {
    constructor() {
        this.axiosInstance = axios.create({
            headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json'
            }
        });

        // Token management
        this.idToken = null;
        this.accessToken = null;
        this.refreshToken = null;
        this.tokenExpiryTime = null;
        this.lastRefreshTime = null;
        this.isRefreshing = false;
        this.refreshSubscribers = [];
        this.isAuthen = false;

        // Internet Connect
        this.refreshSubscribersConect = [];

        // Retry configuration
        this.failedRefreshCount = 0;
        this.maxFailedRefreshAttempts = 3;

        // Thêm biến để theo dõi trạng thái logout
        this.isLoggingOut = false;
        // Error logging
        this.errorLogs = [];
        this.maxLogSize = 100; // Giới hạn số lượng log

        // Thêm biến để lưu trữ promise refresh token đang chạy
        this.refreshTokenPromise = null;

        // Thêm biến để lưu trữ trạng thái hiển thị alert khi không có internet
        this.isShowAlertNoNetwork = false;

        // Thêm biến kiểm soát alert
        this.isShowingAuthAlert = false;
        this.lastAuthError = null;

        // Thêm biến kiểm soát curl debug mode
        this.curlDebugMode = true;

        // Khởi tạo interceptors
        this._setupInterceptors();
    }

    _setupInterceptors() {
        // Request interceptor
        this.axiosInstance.interceptors.request.use(
            async (config) => {
                try {
                    // Hàng đợi khi mất kết nối internet
                    if (this.checkConnectInternet() === false) {
                        await new Promise((resolve, reject) => {
                            this.refreshSubscribersConect.push({ resolve, reject });
                        });
                    }
                    await this._ensureValidToken();

                    // set header mặc định
                    config.headers = { ...this.getHeader(), ...config.headers };

                    if (this.accessToken) {
                        config.headers.Authorization = `Bearer ${this.accessToken}`;
                    }

                    return config;
                } catch (error) {
                    this._addErrorLog(error, 'TOKEN_ERROR', true);
                    return Promise.reject(error);
                }
            },
            (error) => {
                this._addErrorLog(error, 'REQUEST_ERROR', true);
                return Promise.reject(error);
            }
        );

        // Response interceptor
        this.axiosInstance.interceptors.response.use(
            (response) => {


                if (response.status == 200) {
                    // response.status == 200 reset failedRefreshCount
                    this.failedRefreshCount = 0;
                    try {
                        if (response.data && typeof response.data == 'string') {
                            return JSON.parse(response.data.trim());
                        } else {
                            return response.data;
                        }
                    } catch (error) {
                        return response.data;
                    }
                } else if (!Vnr_Function.CheckIsNullOrEmpty(response)) {
                    return response;
                } else {
                    return null;
                }
            },
            async (error) => {
                // Log error
                this._addErrorLog(error, 'RESPONSE_ERROR_401');

                if (error.status == 500) {
                    this._logCurlCommand(error.config);
                }

                if (error.response && error.response.status == 401 && this.isAuthen) {
                    if (this.isRefreshing) {
                        try {
                            const token = await new Promise((resolve, reject) => {
                                this.refreshSubscribers.push({ resolve, reject });
                            });
                            console.log('this.accessToken end', token);

                            error.config.headers.Authorization = `Bearer ${token}`;
                            return this.axiosInstance.request(error.config);
                        } catch (refreshError) {
                            this._addErrorLog(refreshError, 'REFRESH_ERROR');
                            return Promise.reject(refreshError);
                        }
                    }

                    try {
                        await this._refreshToken();
                        error.config.headers.Authorization = `Bearer ${this.accessToken}`;
                        return this.axiosInstance.request(error.config);
                    } catch (refreshError) {
                        console.log(refreshError, 'refreshError');
                        this._addErrorLog(refreshError, 'REFRESH_ERROR');
                        return Promise.reject(refreshError);
                    }
                } else {
                    return Promise.reject(error);
                }
            }
        );
    }

    async _ensureValidToken() {
        // Chưa Login
        if (!this.accessToken || !this.tokenExpiryTime) {
            // Chưa có accesstoken và ngày hết hạn token thì lấy
            await this._loadTokenFromStorage();
        }

        if (!this.isAuthen || this.checkConnectInternet() === false) return;

        const now = Date.now();
        const timeUntilExpiry = this.tokenExpiryTime - now;

        // Refresh token nếu:
        // 1. Sắp hết hạn (còn < 5 phút)
        // 2. Đã đủ thời gian tối thiểu từ lần refresh trước
        if (
            timeUntilExpiry < TOKEN_EXPIRY_BUFFER &&
            (!this.lastRefreshTime || now - this.lastRefreshTime > MIN_REFRESH_INTERVAL)
        ) {
            //console.log('Token sắp hết hạn');
            await this._refreshToken();
        } else {
            //console.log('Token vẫn còn hạn, this.isRefreshing:', timeUntilExpiry);
        }
    }

    async _loadTokenFromStorage() {
        const _dataVnrStorage = getDataVnrStorage();
        const { currentUser } = _dataVnrStorage;

        if (currentUser?.headers?.tokenportalapp) {
            this.accessToken = currentUser.headers.tokenportalapp;
            this.refreshToken = currentUser.headers.refreshToken;
            this.idToken = currentUser.headers.idToken;
            // Decode và lưu thời gian hết hạn
            const decodedToken = Vnr_Function.jwtDecode(this.accessToken);
            this.tokenExpiryTime = decodedToken.exp * 1000;
            this.isAuthen = true;
        } else {
            this.isAuthen = false;
        }
    }

    /**
     * Kiểm tra xem lỗi có cần hiển thị alert hay không
     * @param {Error} error - Lỗi cần kiểm tra
     * @returns {boolean} - true nếu cần hiển thị alert
     */
    _isErrorNeedAlert(error) {
        return error.code === 'service_configuration_fetch_error' || error.code === 'browser_not_found';
    }

    /**
     * Lấy message lỗi tương ứng với mã lỗi
     * @param {Error} error - Lỗi cần lấy message
     * @returns {string} - Message lỗi
     */
    _getErrorMessage(error) {
        if (error.code === 'service_configuration_fetch_error') {
            //'Không thể kết nối đến dịch vụ xác thực. Vui lòng kiểm tra kết nối mạng và thử lại.';
            return 'auth_error_network';
        }
        if (error.code === 'browser_not_found') {
            //'Không tìm thấy trình duyệt phù hợp. Vui lòng cài đặt trình duyệt web và thử lại.';
            return 'auth_error_browser';
        }
        return 'auth_error_general';
    }

    /**
     * Hiển thị alert xác thực và xử lý retry
     * @param {string} message - Message hiển thị
     * @param {Function} onRetry - Callback khi người dùng chọn thử lại
     */
    async _showAuthAlert(message, onRetry) {
        // Nếu đang hiển thị alert, không hiển thị alert mới
        if (this.isShowingAuthAlert) {
            return;
        }

        this.isShowingAuthAlert = true;

        try {
            await new Promise((resolve) => {
                AlertSevice.alert({
                    title: 'auth_error',
                    iconType: EnumIcon.E_WARNING,
                    message: message,
                    showCancel: false,
                    textRightButton: 'HRM_Common_TryAgain',
                    onBackDrop: async () => {
                        this.isShowingAuthAlert = false;
                        await onRetry();
                        resolve();
                    },
                    onConfirm: async () => {
                        this.isShowingAuthAlert = false;
                        await onRetry();
                        resolve();
                    }
                });
            });
        } finally {
            // Đảm bảo reset trạng thái alert
            this.isShowingAuthAlert = false;
        }
    }

    /**
     * Thực hiện thao tác retry (refresh hoặc authorize)
     * @param {boolean} isRetry - true nếu là retry authorize, false nếu là retry refresh
     * @param {Object} configIdentity - Cấu hình SSO
     * @returns {Promise<Object>} - Kết quả retry
     */
    async _performRetryOperation(isRetry, configIdentity) {
        if (isRetry) {
            // Thử lại với authorize
            return await authorize(configIdentity);
        }
        // Thử lại với refresh token
        return await refresh(configIdentity, {
            refreshToken: this.refreshToken
        });
    }

    /**
     * Xử lý kết quả sau khi retry
     * @param {Object} retryResult - Kết quả retry
     * @param {string} errorMessage - Message lỗi
     * @param {Function} onRetry - Callback retry
     * @returns {Promise<Object>} - Kết quả xử lý
     */
    async _handleRetryResult(retryResult, errorMessage, onRetry) {
        // Nếu retry thành công
        if (retryResult?.accessToken && retryResult?.refreshToken) {
            this.lastAuthError = null;
            return retryResult;
        }

        // Nếu retry thất bại và vẫn là lỗi cần alert
        if (this._isErrorNeedAlert(retryResult)) {
            await this._showAuthAlert(errorMessage, onRetry);
        }
        return null;
    }

    /**
     * Xử lý lỗi khi retry
     * @param {Error} retryError - Lỗi retry
     * @param {string} errorMessage - Message lỗi
     * @param {Function} onRetry - Callback retry
     * @returns {Promise<Object>} - Kết quả xử lý
     */
    async _handleRetryError(retryError, errorMessage, onRetry) {
        // Ghi log lỗi
        this._addErrorLog(retryError, 'RETRY_AUTH_ERROR');

        // Chỉ hiển thị alert nếu là lỗi cần alert và chưa hiển thị alert
        if (this._isErrorNeedAlert(retryError) && !this.isShowingAuthAlert) {
            await this._showAuthAlert(errorMessage, onRetry);
        }
        return null;
    }

    /**
     * Xử lý lỗi xác thực và thực hiện retry nếu cần
     * @param {Error} error - Lỗi cần xử lý
     * @param {boolean} isRetry - true nếu là retry authorize, false nếu là retry refresh
     * @returns {Promise<Object>} - Kết quả xử lý
     */
    handleAuthError = (error, isRetry = false) => {
        return new Promise(async (resolve) => {
            // Kiểm tra điều kiện hiển thị alert
            if (!this._isErrorNeedAlert(error) || this.isShowingAuthAlert) {
                resolve(null);
                return;
            }

            // Chuẩn bị thông tin lỗi
            const errorMessage = this._getErrorMessage(error);

            // Callback xử lý retry
            const onRetry = async () => {
                try {
                    // 1. Lấy cấu hình SSO
                    const configIdentity = await getConfigSSO();
                    // 2. Thực hiện retry
                    const retryResult = await this._performRetryOperation(isRetry, configIdentity);
                    // 3. Xử lý kết quả retry
                    const result = await this._handleRetryResult(retryResult, errorMessage, onRetry);
                    resolve(result);
                } catch (retryError) {
                    // 4. Xử lý lỗi retry
                    const result = await this._handleRetryError(retryError, errorMessage, onRetry);
                    resolve(result);
                }
            };

            // Hiển thị alert và xử lý retry
            await this._showAuthAlert(errorMessage, onRetry);
            resolve(null);
        });
    };

    async actionRefreshToken() {
        let newAuthState = null;
        const configIdentity = await getConfigSSO();
        try {
            newAuthState = await refresh(configIdentity, {
                refreshToken: this.refreshToken
            });
        } catch (error) {
            this._addErrorLog(error, 'REFRESH_TOKEN_ERROR_START_AUTHORIZE');
            newAuthState = await this.handleAuthError(error);
        }

        if (!newAuthState || !newAuthState.accessToken || !newAuthState.refreshToken) {
            try {
                newAuthState = await authorize(configIdentity);
            } catch (e) {
                this._addErrorLog(e, 'RE_AUTHORIZE_ERROR');
                newAuthState = await this.handleAuthError(e, true);
            }
        }

        if (!newAuthState || !newAuthState.accessToken || !newAuthState.refreshToken) {
            return null;
        }

        return newAuthState;
    }

    async _refreshToken() {
        this._addErrorLog(null, 'START_REFRESH');
        // Nếu đang logout, không refresh nữa
        if (this.isLoggingOut) {
            return Promise.reject(new Error('User is logging out'));
        }

        // Không refresh nếu token còn hạn và không bị force
        // if (!force && this.tokenExpiryTime && Date.now() < this.tokenExpiryTime - TOKEN_EXPIRY_BUFFER) {
        //     return;
        // }

        // Nếu đã có một refresh token đang chạy, trả về promise đó
        if (this.refreshTokenPromise && this.isRefreshing) {
            return this.refreshTokenPromise;
        }

        // Đánh dấu đang refresh
        this.isRefreshing = true;

        // Tạo promise mới và lưu lại để các request khác có thể đợi
        this.refreshTokenPromise = (async () => {
            try {
                const _dataVnrStorage = getDataVnrStorage();
                if (!_dataVnrStorage.currentUser?.info?.isLoginSSO) {
                    throw new Error('User not logged in with SSO');
                }

                if (this.failedRefreshCount >= this.maxFailedRefreshAttempts) {
                    // Xử lý lỗi refresh
                    throw new Error('Vượt quá số lần refresh');
                }

                let newAuthState = await this.actionRefreshToken();
                if (!newAuthState || !newAuthState.accessToken || !newAuthState.refreshToken) {
                    throw new Error('Invalid refresh response. newAuthState:' + newAuthState);
                }

                // Cập nhật tokens
                this.accessToken = newAuthState.accessToken;
                this.refreshToken = newAuthState.refreshToken;
                this.idToken = newAuthState.idToken;
                // Cập nhật expiry time
                const decodedToken = Vnr_Function.jwtDecode(this.accessToken);
                this.tokenExpiryTime = decodedToken.exp * 1000;
                this.lastRefreshTime = Date.now();

                // Lưu vào storage
                const { currentUser } = _dataVnrStorage;
                currentUser.headers.tokenportalapp = this.accessToken;
                currentUser.headers.refreshToken = this.refreshToken;
                currentUser.headers.idToken = newAuthState.idToken;
                await setdataVnrStorageFromValue('currentUser', currentUser);
                this._addErrorLog(newAuthState, 'SUCCESS_REFRESH');

                // Tăng số lần thất bại
                this.failedRefreshCount++;

                // Thông báo cho các subscribers
                this.refreshSubscribers.forEach((callback) => {
                    callback.resolve(this.accessToken);
                });

                return this.accessToken;
            } catch (error) {
                // console.log('Refresh token error: count :', this.failedRefreshCount);
                // Thông báo cho các subscribers về lỗi
                this.refreshSubscribers.forEach((callback) => {
                    callback.reject(error);
                });
                this._handleRefreshError(error);
                throw error;
            } finally {
                this.isRefreshing = false;
                this.refreshTokenPromise = null;
                this.refreshSubscribers = [];
            }
        })();

        return this.refreshTokenPromise;
    }

    // Xử lý khi refresh token thất bại
    _handleRefreshError(error) {
        //Nếu đang logout, không làm gì cả
        if (this.isLoggingOut) {
            return;
        }

        // Đánh dấu đang logout để tránh gọi nhiều lần
        this.isLoggingOut = true;
        this.isAuthen = false;
        this._addErrorLog(error, 'REFRESH_FAILED_LOGOUT', true);

        // Clear token data
        this.accessToken = null;
        this.refreshToken = null;
        this.tokenExpiryTime = null;
        this.lastRefreshTime = null;
        this.failedRefreshCount = 0;

        // Logout user
        logout();
        this.isLoggingOut = false;
    }

    resetToken() {
        // Clear token data
        this.isAuthen = false;
        this.accessToken = null;
        this.refreshToken = null;
        this.tokenExpiryTime = null;
        this.lastRefreshTime = null;
        this.failedRefreshCount = 0;
    }

    // Public method để lấy token
    async getToken(forceRefresh = false) {
        await this._ensureValidToken();
        if (forceRefresh) {
            await this._refreshToken();
        }
        return this.accessToken;
    }

    async getFullInfoToken(forceRefresh = false) {
        await this._ensureValidToken();
        if (forceRefresh) {
            await this._refreshToken();
        }
        return {
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
            idToken: this.idToken,
            HTTP_ACCESSTOKEN: this.accessToken,
            HTTP_REFRESHTOKEN: this.refreshToken,
            HTTP_IDTOKEN: this.idToken
        };
    }

    async updateToken(newAuthState) {
        try {
            if (!newAuthState || !newAuthState.accessToken || !newAuthState.refreshToken) {
                return false;
            }

            const _dataVnrStorage = getDataVnrStorage();
            // Cập nhật tokens
            this.accessToken = newAuthState.accessToken;
            this.refreshToken = newAuthState.refreshToken;
            this.idToken = newAuthState.idToken;
            // Cập nhật expiry time
            const decodedToken = Vnr_Function.jwtDecode(this.accessToken);
            this.tokenExpiryTime = decodedToken.exp * 1000;
            this.lastRefreshTime = Date.now();

            // Lưu vào storage
            const { currentUser } = _dataVnrStorage;
            currentUser.headers.tokenportalapp = this.accessToken;
            currentUser.headers.refreshToken = this.refreshToken;
            currentUser.headers.idToken = newAuthState.idToken;
            await setdataVnrStorageFromValue('currentUser', currentUser);
            this._addErrorLog(newAuthState, 'UPDATE_SUCCESS_TOKEN');

            return true;
        } catch (error) {
            this._addErrorLog(error, 'UPDATE_TOKEN_ERROR');
            return false;
        }
    }

    // ===== CURL DEBUG METHODS =====

    /**
     * Bật/tắt chế độ debug curl
     * @param {boolean} enabled - true để bật, false để tắt
     */
    setCurlDebugMode(enabled) {
        this.curlDebugMode = enabled;
        console.log(`Curl debug mode: ${enabled ? 'ENABLED' : 'DISABLED'}`);
    }

    /**
     * Tạo curl command từ axios config
     * @param {Object} config - Axios request config
     * @returns {string} - Curl command
     */
    _generateCurlCommand(config) {
        try {
            const { method = 'GET', url, headers = {}, data } = config;

            let curlCommand = `curl -X ${method.toUpperCase()}`;

            // Thêm URL
            curlCommand += ` '${url}'`;

            // Thêm headers
            Object.entries(headers).forEach(([key, value]) => {
                if (
                    value &&
                    key !== 'common' &&
                    key !== 'delete' &&
                    key !== 'get' &&
                    key !== 'head' &&
                    key !== 'post' &&
                    key !== 'put' &&
                    key !== 'patch'
                ) {
                    curlCommand += ` \\\n  -H '${key}: ${value}'`;
                }
            });

            // Thêm data cho POST/PUT requests
            if (
                data &&
                (method.toUpperCase() === 'POST' || method.toUpperCase() === 'PUT' || method.toUpperCase() === 'PATCH')
            ) {
                if (typeof data === 'string') {
                    curlCommand += ` \\\n  -d '${data}'`;
                } else if (typeof data === 'object') {
                    curlCommand += ` \\\n  -d '${JSON.stringify(data)}'`;
                }
            }

            return curlCommand;
        } catch (error) {
            console.error('Error generating curl command:', error);
            return 'Error generating curl command';
        }
    }

    /**
     * Log curl command ra console
     * @param {Object} config - Axios request config
     */
    _logCurlCommand(config) {

        console.log(config, 'config');

        if (!this.curlDebugMode) return;

        const curlCommand = this._generateCurlCommand(config);
        console.log('\n=== CURL DEBUG ===');
        console.log('URL:', config.url);
        console.log('Method:', config.method?.toUpperCase() || 'GET');
        console.log('Curl Command:');
        console.log(curlCommand);
        console.log('==================\n');
    }

    // ===== HELPER METHODS =====
    // Thêm error vào mảng log
    _addErrorLog(error, type = 'API_ERROR', isSendLog = false) {
        try {
            const errorLog = {
                timestamp: moment(new Date()).format('DD/MM/YYYY HH:mm:ss'),
                type: type,
                error: error,
                url: error?.config?.url || 'N/A',
                method: error?.config?.method || 'N/A',
                status: error?.response?.status || 'N/A',
                message: error?.message || 'Unknown error'
            };

            // Thêm vào đầu mảng
            this.errorLogs.unshift(errorLog);

            // Giới hạn kích thước mảng
            if (this.errorLogs.length > this.maxLogSize) {
                this.errorLogs = this.errorLogs.slice(0, this.maxLogSize);
            }

            console.log('addErrorLogerror', this.errorLogs);

            // Gửi log lên server
            //isSendLog && this._sendErrorLog(this.errorLogs);
        } catch (logError) {
            console.error('Error logging failed:', logError);
        }
    }

    // Gửi error log lên server
    async _sendErrorLog(errorLog) {
        try {
            const errorDescription = {
                ...errorLog,
                userInfo: {
                    token: this.accessToken,
                    tokenExpiry: this.tokenExpiryTime
                }
            };

            await SaveLogError(errorDescription);
        } catch (sendError) {
            console.error('Error sending log:', sendError);
        }
    }

    // Lấy tất cả logs
    getErrorLogs() {
        return [...this.errorLogs];
    }

    // Xóa logs
    clearErrorLogs() {
        this.errorLogs = [];
    }

    getApiData() {
        let _dataVnrStorage = getDataVnrStorage();
        return _dataVnrStorage.apiConfig;
    }

    getHeader() {
        let _dataVnrStorage = getDataVnrStorage();
        const { currentUser } = _dataVnrStorage;
        const defaultHeader = { 'Application-Request': 'APP_PORTAL_' + _dataVnrStorage.customerID };
        if (currentUser != null) {
            return { ...currentUser.headers, ...defaultHeader };
        }
        return defaultHeader;
    }

    generateHeader() {
        return this.getHeader();
    }

    handelUrl(url) {
        let uri = this.getApiData();
        const addString = (stringUri) => {
            if (stringUri && typeof stringUri === 'string')
                return stringUri.split('')[stringUri.length - 1] == '/' ? stringUri : `${stringUri}/`;
            else return stringUri;
        };

        if (url.indexOf('[URI_SYS]') == 0) {
            return url.replace('[URI_SYS]', addString(uri.uriSys));
        } else if (url.indexOf('[URI_HR]') == 0) {
            return url.replace('[URI_HR]', addString(uri.uriHr));
        } else if (url.indexOf('[URI_POR]') == 0) {
            return url.replace('[URI_POR]', addString(uri.uriPor));
        } else if (url.indexOf('[URI_MAIN]') == 0) {
            return url.replace('[URI_MAIN]', addString(uri.uriMain));
        } else if (url.indexOf('[URI_CENTER]') == 0) {
            return url.replace('[URI_CENTER]', addString(uri.uriCenter));
        } else if (url.indexOf('[URI_STORAGE]') == 0) {
            return url.replace('[URI_STORAGE]', addString(uri.uriStorage));
        } else if (url.indexOf('[URI_IDENTITY]') == 0) {
            return url.replace('[URI_IDENTITY]', addString(uri.uriIdentity));
        } else {
            return url;
        }
    }

    // ===== HTTP METHODS =====

    Get(url, config) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.axiosInstance.get(this.handelUrl(url), config);
                resolve(response);
            } catch (error) {
                this.handleErrorResponse(url, reject, error);
            }
        });
    }

    Post(url, data, config) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.axiosInstance.post(this.handelUrl(url), data, config);
                resolve(response);
            } catch (error) {
                this.handleErrorResponse(url, reject, error);
            }
        });
    }

    Put(url, data, config) {
        return new Promise(async (resolve, reject) => {
            try {
                const response = await this.axiosInstance.put(this.handelUrl(url), data, config);
                resolve(response);
            } catch (error) {
                this.handleErrorResponse(url, reject, error);
            }
        });
    }

    MultiRequest(listRequest) {
        return new Promise((resolve, reject) => {
            axios
                .all(listRequest)
                .then(
                    axios.spread(function () {
                        resolve([].slice.call(arguments));
                    })
                )
                .catch((error) => {
                    VnrLoadingSevices.hide();
                    if (this.checkConnectInternet() === false) {
                        // Không có internet
                        reject(EnumName.E_NOINTERNET);
                    } else if (error.response) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                        // Lỗi api có các trạng thái lỗi
                        console.log(error.response.status);
                    } else if (error.request) {
                        // The request was made but no response was received
                        console.log(error.request);
                    } else {
                        // Something happened in setting up the request that triggered an Error
                        console.log('Error', error.message);
                    }
                });
        });
    }

    // ===== ERROR HANDLING =====

    handleErrorResponse(url, reject, error) {
        VnrLoadingSevices.hide();
        if (this.checkConnectInternet() === false) {
            // Không có internet
            reject(EnumName.E_NOINTERNET);
            this.showAlertNoNetwork();
            ToasterSevice.showError('no-connect-internet', 6000);
        } else if (error.response) {
            // Không có lỗi 401 ở đây nữa
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            // Lỗi api có các trạng thái lỗi
            console.log(error.response.status, url);
        } else if (error.request) {
            console.log(error.request, 'error.request');
            //ToasterSevice.showError('request-no-response', 6000);
            reject(EnumName.E_REQUEST_NO_RESPONSE);
            // The request was made but no response was received
        } else {
            //ToasterSevice.showError('request-no-response', 6000);
            reject(EnumName.E_REQUEST_NO_RESPONSE);
            // Something happened in setting up the request that triggered an Error
            console.log('Error', error.message);
        }
    }

    checkSubscribersConect() {
        if (this.refreshSubscribersConect && this.refreshSubscribersConect.length > 0)
            this.refreshSubscribersConect.forEach((callback) => {
                callback.resolve();
            });
    }

    showAlertNoNetwork() {
        if (this.isShowAlertNoNetwork) return;

        this.isShowAlertNoNetwork = true;
        AlertSevice.alert({
            title: 'no-connect-internet',
            iconType: EnumIcon.E_WARNING,
            message: 'HRM_Alert_Please_Check_NetWork',
            showCancel: false,
            textRightButton: 'HRM_Common_TryAgain',
            onConfirm: () => {
                this.isShowAlertNoNetwork = false;
                DrawerServices.navigate('Home');
            },
            onBackDrop: () => {
                this.isShowAlertNoNetwork = false;
                DrawerServices.navigate('Home');
            }
        });
    }

    checkConnectInternet() {
        if (store.getState()['network']) {
            const isConnected = store.getState()['network']['isConnected'];
            return isConnected;
        }
        return false;
    }

    startRefreshToken() {}

    // ===== PUBLIC CURL METHODS =====

    /**
     * Bật chế độ debug curl
     */
    enableCurlDebug() {
        this.setCurlDebugMode(true);
    }

    /**
     * Tắt chế độ debug curl
     */
    disableCurlDebug() {
        this.setCurlDebugMode(false);
    }

    /**
     * Kiểm tra trạng thái curl debug mode
     * @returns {boolean}
     */
    isCurlDebugEnabled() {
        return this.curlDebugMode;
    }

    /**
     * Tạo curl command cho một request cụ thể
     * @param {string} method - HTTP method
     * @param {string} url - URL
     * @param {Object} data - Request data
     * @param {Object} headers - Request headers
     * @returns {string} - Curl command
     */
    generateCurl(method, url, data = null, headers = {}) {
        const config = {
            method,
            url: this.handelUrl(url),
            headers: { ...this.getHeader(), ...headers },
            data
        };

        if (this.accessToken) {
            config.headers.Authorization = `Bearer ${this.accessToken}`;
        }

        return this._generateCurlCommand(config);
    }

    // Thêm vào phương thức destructor để dọn dẹp
    destroy() {
        // Hủy tất cả các request đang chờ
        this.clearErrorLogs();
        this.refreshSubscribers.forEach((request) => request.reject(new Error('Service destroyed')));
        this.refreshSubscribers = [];

        this.refreshSubscribersConect.forEach((request) => request.reject(new Error('Service destroyed')));
        this.refreshSubscribersConect = [];
    }
}

// Export single instance
const HttpService = new HttpServiceClass();
export default HttpService;
