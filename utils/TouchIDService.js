import HttpService from '../utils/HttpService';
import { VnrLoadingSevices } from '../components/VnrLoading/VnrLoadingPages';
import DeviceInfo from 'react-native-device-info';
import { ToasterSevice } from '../components/Toaster/Toaster';
import TouchID from 'react-native-touch-id';
import { EnumIcon, EnumName, EnumUser } from '../assets/constant';
import { translate } from '../i18n/translate';
import { AlertSevice } from '../components/Alert/Alert';
import { SInfoService } from '../factories/LocalData';
import { getDataVnrStorage } from '../assets/auth/authentication';
import DrawerServices from './DrawerServices';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { Keyboard } from 'react-native';

class TouchIDService {
    static async openTouchID(setEnable) {
        try {
            if (setEnable && typeof setEnable === 'function') {
                this.setEnable = setEnable;
            }

            let message;
            const configs = {
                title: translate('HRM_Authentication_Required'), // Android
                imageColor: Colors.primary, // Android
                imageErrorColor: Colors.red, // Android
                sensorDescription: translate('HRM_Login_TouchID'), // Android
                sensorErrorDescription: translate('HRM_Login_TouchID_Failed'), // Android
                cancelText: translate('HRM_Login_TouchID_Cancel'), // Android
                fallbackLabel: '', // iOS (if empty, then label is hidden)
                unifiedErrors: false, // use unified error messages (default false)
                passcodeFallback: false // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
            };
            const type = await TouchID.isSupported();
            switch (type) {
                case 'TouchID':
                    message = '';

                    break;
                case 'FaceID':
                    message = '';

                    break;
            }
            if (type) {
                TouchID.authenticate(message, configs)
                    .then(() => {
                        AlertSevice.alert({
                            iconType: EnumIcon.E_KEY,
                            placeholder: translate('HRM_System_User_Password'),
                            isValidInputText: true,
                            title: translate('Hrm_Portal_Login_Enter_Password'),
                            isInputText: true,
                            autoFocus: true,
                            typeInputText: 'E_PASSWORD',
                            onConfirm: (valueText) => {
                                // kiểm tra password
                                this.confirmPassWordSetting(valueText);
                            }
                        });
                    })
                    .catch(() => {
                        ToasterSevice.showError('HRM_Authentication_Failed', 7000);
                        // AlertSevice.alert({
                        //   iconType: EnumIcon.E_DEFAULT,
                        //   title: translate(EnumName.E_CANCEL),
                        //   message: translate('HRM_Login_Bio_Cancel'),
                        // })
                    });
            }
        } catch (err) {
            // ToasterSevice.showInfo(translate('HRM_Open_Setting_TouchID'), 7000)
        }
    }

    static async removeTouchID(setEnable) {
        if (setEnable && typeof setEnable === 'function') {
            this.setEnable = setEnable;
        }

        AlertSevice.alert({
            iconType: EnumIcon.E_INFO,
            title: translate(EnumName.E_CANCEL),
            message: translate('HRM_Login_Bio_Cancel'),
            textRightButton: translate(EnumName.E_CANCEL),
            onBackDrop: () => {},
            onCancel: () => {},
            onConfirm: async () => {
                this.isRemoveTouchID();
            }
        });
    }

    static async isRemoveTouchID(setEnable) {
        if (setEnable && typeof setEnable === 'function') {
            this.setEnable = setEnable;
        }

        let dataVnrStorage = getDataVnrStorage();
        const { userid } = dataVnrStorage.currentUser.headers;
        const data = (await SInfoService.getItem(EnumUser.DATASAVEID)) || [];
        const existedUser = data?.find((d) => d[EnumUser.USERID] === userid);
        if (existedUser) {
            const dataChanged = data.map((m) => {
                if (m.userid === userid) {
                    m.touchID = null;
                }
                return m;
            }); //**************** */

            await SInfoService.setItem(EnumUser.DATASAVEID, dataChanged);
            this.setEnable && this.setEnable(false);
        }
    }

    static async confirmPassWordSetting(passWord) {
        let dataVnrStorage = getDataVnrStorage();
        if (dataVnrStorage.currentUser) {
            const dataBody = {
                UserName: dataVnrStorage.currentUser.headers.userlogin,
                StrPass: passWord,
                UserID: dataVnrStorage.currentUser.headers.userid
            };
            VnrLoadingSevices.show();
            const res = await HttpService.Post('[URI_HR]//Sal_GetData/ConfirmPasswordPayslip', dataBody);
            VnrLoadingSevices.hide();

            if (res != undefined && res != null) {
                if (res.LoginStatus) {
                    const data = (await SInfoService.getItem(EnumUser.DATASAVEID)) || [];
                    // // lần đầu tiên, chưa đăng kí nên null, cho giá trị là mảng rỗng

                    const { userid, userlogin } = dataVnrStorage.currentUser.headers;

                    const existedUser = data?.find((d) => d[EnumUser.USERID] === userid);

                    let target = existedUser;

                    if (existedUser) {
                        target[EnumUser.TOUCHID] = DeviceInfo.getUniqueId();

                        const dataChanged = data.map((m) => {
                            if (m.userid === userid) {
                                m.touchID = target.touchID;
                                m[EnumUser.PASSWORD] = passWord;
                            } else {
                                m.touchID = null;
                            }
                            return m;
                        }); //**************** */

                        await SInfoService.setItem(EnumUser.DATASAVEID, dataChanged);
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        this.setEnable && this.setEnable(true);
                    } else {
                        // laàn đầu : mảng rỗng => append : rỗng
                        target = {};
                        target[EnumUser.USERID] = userid;
                        target[EnumUser.USERNAME] = userlogin;
                        target[EnumUser.TOUCHID] = DeviceInfo.getUniqueId();
                        target[EnumUser.PASSWORD] = passWord;
                        const appendData = data.map((m) => ({ ...m, touchID: null })); // lần đầu rỗng

                        await SInfoService.setItem(EnumUser.DATASAVEID, [...appendData, target]);
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        this.setEnable && this.setEnable(true);
                    }
                } else {
                    AlertSevice.alert({
                        iconType: EnumIcon.E_KEY,
                        placeholder: translate('HRM_System_User_Password'),
                        isValidInputText: true,
                        title: translate('Hrm_Portal_Login_Enter_Password'),
                        message: res.LoginErrorStatusMessage,
                        isInputText: true,
                        autoFocus: true,
                        typeInputText: 'E_PASSWORD',
                        onBackDrop: () => {},
                        onCancel: () => {
                            this.setEnable && this.setEnable(false);
                        },
                        onConfirm: (valueText) => {
                            this.setEnable && this.setEnable(false);
                            this.confirmPassWordSetting(valueText);
                        }
                    });
                }
            } else {
                return null;
            }
        }
    }

    //#region check confirm password
    static confirmPassWord(passWord) {
        let dataVnrStorage = getDataVnrStorage();
        if (dataVnrStorage.currentUser) {
            const dataBody = {
                UserName: dataVnrStorage.currentUser.headers.userlogin,
                StrPass: passWord,
                UserID: dataVnrStorage.currentUser.headers.userid
            };
            HttpService.Post('[URI_HR]//Sal_GetData/ConfirmPasswordPayslip', dataBody).then((res) => {
                if (res != undefined && res != null) {
                    if (res.LoginStatus) {
                        this.onFinish(true);
                    } else {
                        AlertSevice.alert({
                            iconType: EnumIcon.E_KEY,
                            placeholder: translate('HRM_System_User_Password'),
                            autoFocus: true,
                            title: translate('Hrm_Portal_Login_Enter_Password'),
                            message: res.LoginErrorStatusMessage,
                            isInputText: true,
                            typeInputText: 'E_PASSWORD',
                            onBackDrop: () => {
                                this.onFinish(false);
                            },
                            onCancel: () => {
                                this.onFinish(false);
                            },
                            onConfirm: (valueText) => {
                                this.confirmPassWord(valueText);
                            }
                        });
                    }
                } else {
                    this.onFinish(false);
                }
            });
        }
    }

    static checkConfirmPass(onFinish, ENUM = 'E_PAYROLLTABLE') {
        if (onFinish && typeof onFinish === 'function') {
            this.onFinish = onFinish;
        }
        let dataVnrStorage = getDataVnrStorage();

        HttpService.Post('[URI_HR]/Sys_GetData/GetConfigConfirmPassOnPortal', {
            ProfileID: dataVnrStorage.currentUser.info.ProfileID
        }).then((res) => {
            if (Array.isArray(res) && res.length === 2) {
                if (res[1] && ENUM == 'E_PAYROLLTABLE' && (res[1] === 'True' || res[1] === true || res[1] === 'true')) {
                    dataVnrStorage.isNewLayoutV3
                        ? DrawerServices.navigate('SalChangePasswordFromHomeV3')
                        : DrawerServices.navigate('SalChangePasswordFromHome');
                } else {
                    let arrEnumConfig = res[0]?.split(',');
                    if (Array.isArray(arrEnumConfig) && arrEnumConfig.length > 0) {
                        // có bật cấu hình xác thực trước khi xem phiếu lương
                        const resultFind = arrEnumConfig.find((item) => item === ENUM);
                        if (resultFind) {
                            this.handleTouchID();
                        } else {
                            this.onFinish(true);
                        }
                    } else {
                        this.onFinish(true);
                    }
                }
            } else {
                this.onFinish(true);
            }
        });
    }

    static async handleTouchID() {
        try {
            let dataVnrStorage = getDataVnrStorage();

            const { apiConfig } = dataVnrStorage;
            const { userid } = dataVnrStorage.currentUser.info;
            const dataStorage = await SInfoService.getItem(EnumUser.DATASAVEID);

            const findUser = dataStorage?.find((x) => x.userid === userid);
            Keyboard.dismiss();

            if (apiConfig == null) {
                ToasterSevice.showError('PleaseUploadFileConfig', 3000);
                return true;
            }

            const data = {
                UserName: findUser?.username,
                Password: findUser?.password
            };

            let message;

            const configs = {
                title: translate('HRM_Authentication_Required'), // Android
                mageColor: Colors.primary, // Android
                imageErrorColor: Colors.red, // Android
                sensorDescription: translate('HRM_Login_TouchID'), // Android
                sensorErrorDescription: translate('HRM_Login_TouchID_Failed'), // Android
                cancelText: translate('HRM_Login_TouchID_Cancel'), // Android
                fallbackLabel: '', // iOS (if empty, then label is hidden)
                unifiedErrors: false, // use unified error messages (default false)
                passcodeFallback: false // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
            };

            let type = undefined;
            try {
                type = await TouchID.isSupported();
            } catch (error) {
                type = undefined;
            }

            switch (type) {
                case 'TouchID':
                    message = '';
                    break;
                case 'FaceID':
                    message = '';
                    break;
            }

            if (!type) {
                // Cho xác thực bằng password
                AlertSevice.alert({
                    iconType: EnumIcon.E_KEY,
                    placeholder: translate('HRM_System_User_Password'),
                    title: translate('Hrm_Portal_Login_Enter_Password'),
                    isInputText: true,
                    autoFocus: true,
                    typeInputText: 'E_PASSWORD',
                    onBackDrop: () => {
                        this.onFinish(false);
                    },
                    onCancel: () => {
                        this.onFinish(false);
                    },
                    onConfirm: (valueText) => {
                        this.confirmPassWord(valueText);
                    }
                });
            } else if (type) {
                if (findUser && findUser.touchID) {
                    // có setting xác thực bằng vân tay
                    TouchID.authenticate(message, configs)
                        .then(() => {
                            // xác thực thành công
                            this.confirmPassWord(data.Password);
                        })
                        .catch(() => {
                            // Xác thực không thành công. Cho xác thực bằng password
                            AlertSevice.alert({
                                iconType: EnumIcon.E_KEY,
                                placeholder: translate('HRM_System_User_Password'),
                                title: translate('Hrm_Portal_Login_Enter_Password'),
                                message: translate('HRM_Authentication_Failed'),
                                isInputText: true,
                                autoFocus: true,
                                typeInputText: 'E_PASSWORD',
                                onBackDrop: () => {
                                    this.onFinish(false);
                                },
                                onCancel: () => {
                                    this.onFinish(false);
                                },
                                onConfirm: (valueText) => {
                                    this.confirmPassWord(valueText);
                                }
                            });
                        });
                } else {
                    // Chưa setting xác thực bằng vân tay
                    const optionalConfigObject = {
                        unifiedErrors: false,
                        passcodeFallback: true
                    };
                    TouchID.isSupported(optionalConfigObject).then((biometryType) => {
                        let typeID = biometryType === 'FaceID' ? 'FaceID' : 'TouchID';

                        if (dataVnrStorage.currentUser.info && dataVnrStorage.currentUser.info.isLoginSSO) {
                            if (typeID === 'TouchID') {
                                ToasterSevice.showError('HRM_Salary_Error_TouchID', 10000);
                            } else if (typeID === 'FaceID') {
                                ToasterSevice.showError('HRM_Salary_Error_FaceID', 10000);
                            }
                        }

                        // Cho xác thực bằng password
                        AlertSevice.alert({
                            iconType: EnumIcon.E_KEY,
                            placeholder: translate('HRM_System_User_Password'),
                            title: translate('Hrm_Portal_Login_Enter_Password'),
                            isInputText: true,
                            autoFocus: true,
                            typeInputText: 'E_PASSWORD',
                            onBackDrop: () => {
                                this.onFinish(false);
                            },
                            onCancel: () => {
                                this.onFinish(false);
                            },
                            onConfirm: (valueText) => {
                                this.confirmPassWord(valueText);
                            }
                        });
                    });
                }
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.log(err, 'err');
        }
    }

    //#endregion
}

export default TouchIDService;
