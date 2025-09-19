/* eslint-disable no-console */
import React, { Component } from 'react';
import { View, Platform } from 'react-native';
import DeviceInfo from 'react-native-device-info';
import { ToasterSevice } from '../Toaster/Toaster';
import codePush from 'react-native-code-push';
import { dataVnrStorage, getDataVnrStorage } from '../../assets/auth/authentication';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { EnumIcon, PlatformURL } from '../../assets/constant';
import { AlertSevice } from '../Alert/Alert';
import base64 from 'react-native-base64';
import { ConfigVersionBuild } from '../../assets/configProject/ConfigVersionBuild';
import Vnr_Function from '../../utils/Vnr_Function';
import HttpService from '../../utils/HttpService';
import { VnrLoadingSevices } from '../VnrLoading/VnrLoadingPages';
import VnrUpdateApp from './VnrUpdateApp';
import update from '../../redux/update';
import store from '../../store';
import { STATUS_UPDATE_LATER } from '../../redux/update/reducer';
import { translate } from '../../i18n/translate';
const CODE_PUSH_DEPLOYMENT_KEY = Platform.select({
    ios: '_m--EouDZ7ZTJLKSHCu5VqR2wHsHbJ-Nv5fb7',
    android: 'RyH1TDKalxleZmeTAzfmhx_8WcC4lcrcQ8lF1'
});

const api = {
    isProgressUpdate: false,
    checkVersion: null
};

export const UpdateVersionApi = api;

const defaultState = {
    modalUpdateVisible: false,
    isMandatory: false,
    updateInfo: {},
    progress: 0,
    isUpdate: false,
    isUpdateLater: false,
    modalUpdateAppStore: false,
    versionNameWaitUpdate: '',
    codePushKey: null
};
export default class ModalUpdateVersion extends Component {
    constructor(props) {
        super(props);
        this.state = { ...defaultState };
        // tham số khi bị pendding update true/false
        this.isPendingProgress = false;
        // App đang trong quá trình update
        this.isUpdateProgressing = false;
    }

    convertBase64ToObj = (_base64) => {
        const utf8DecodedString = base64.decode(_base64);
        const decodedString = decodeURIComponent(escape(utf8DecodedString));
        return JSON.parse(decodedString);
    };

    addQrToList = async (dataQr) => {
        VnrLoadingSevices.show();
        let strListQr = await AsyncStorage.getItem('@DATA_SCANED_QR_LIST'),
            dataListQr = strListQr != null ? JSON.parse(strListQr) : null;

        if (dataListQr == null) {
            dataListQr = [
                {
                    ...dataQr,
                    isSelect: true
                }
            ];
        } else if (dataListQr && Array.isArray(dataListQr) && dataListQr.length > 0) {
            let findIndex = dataListQr.findIndex((item) => item.ID == dataQr.ID);

            if (findIndex > -1) {
                dataListQr = dataListQr.map((item) => {
                    if (item.ID == dataQr.ID) {
                        item = {
                            ...dataQr,
                            isSelect: true
                        };
                    } else {
                        item.isSelect = false;
                    }
                    return item;
                });
            } else {
                dataListQr = dataListQr.map((item) => {
                    item.isSelect = false;
                    return item;
                });

                dataListQr.push({
                    ...dataQr,
                    isSelect: true
                });
            }
        }

        if (dataListQr !== null) {
            await AsyncStorage.setItem('@DATA_SCANED_QR_LIST', JSON.stringify(dataListQr));
            this.checkVersion();
        }

        VnrLoadingSevices.hide();
    };

    getVersionCodeProject = () => {
        AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            title: 'Thông báo hệ thống',
            message: 'Hệ thống cần tải bản Cập nhật mới nhằm cải thiện tốc độ mở app và dung lượng app',
            // textLeftButton: 'HRM_Common_Close',
            showCancel: false,
            textRightButton: 'HRM_Common_Edit',
            onCancel: async () => {
                const strVersionRejectUpdate = await AsyncStorage.getItem('@DATA_VERSION_REJECT_UPDATE');

                let versionRejectUpdate = strVersionRejectUpdate != null ? JSON.parse(strVersionRejectUpdate) : {};

                // lưu người dùng đã từ chối update version này.
                versionRejectUpdate = {
                    ...versionRejectUpdate,
                    ...{
                        REJECT_RESCAN_QR: true
                    }
                };

                await AsyncStorage.setItem('@DATA_VERSION_REJECT_UPDATE', JSON.stringify(versionRejectUpdate));
            },
            onConfirm: () => {
                VnrLoadingSevices.show();
                if (dataVnrStorage.apiConfig) {
                    const checkVersionBuild = ConfigVersionBuild.value,
                        dataBody = {
                            UriPor: dataVnrStorage.apiConfig.uriPor,
                            UriHR: dataVnrStorage.apiConfig.uriHr,
                            UriMain: dataVnrStorage.apiConfig.uriMain,
                            UriSys: dataVnrStorage.apiConfig.uriSys
                        };

                    if (
                        checkVersionBuild == '080919AVN' &&
                        dataVnrStorage.apiConfig &&
                        dataVnrStorage.apiConfig.uriPor == 'https://hrportal.ajinomoto.com.vn/'
                    ) {
                        dataVnrStorage.apiConfig.uriMain = `${dataVnrStorage.apiConfig.uriPor}GetResourceMain/Index/?resource=`;
                    }

                    HttpService.Post('https://qr.vnresource.net/Home/getInfoCustomer', dataBody)
                        .then((res) => {
                            VnrLoadingSevices.hide();
                            try {
                                if (
                                    res &&
                                    res.UriPor &&
                                    res.UriHR &&
                                    res.UriMain &&
                                    res.UriSys &&
                                    res.VersionCode &&
                                    res.keyUpdateIos &&
                                    res.keyUpdateAndroid
                                ) {
                                    this.addQrToList(res);
                                } else {
                                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000, 'TOP');
                                }
                            } catch (error) {
                                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000, 'TOP');
                            }
                        })
                        .catch(() => {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000, 'TOP');
                        });
                }
            }
        });
    };
    checkNewBuildVersion = (qrSelected) => {
        if (HttpService.checkConnectInternet() === false) {
            return;
        }

        let qrCode = qrSelected.ID;
        if (qrCode && qrCode !== '') {
            HttpService.Get('https://qr.vnresource.net/api/AppCustomer?QRCode=' + qrCode).then((res) => {
                if (
                    res &&
                    res.UriPor &&
                    res.UriHR &&
                    res.UriMain &&
                    res.UriSys &&
                    res.ID &&
                    res.keyUpdateIos &&
                    res.keyUpdateAndroid
                ) {
                    let keyPlatForm = Platform.OS == 'android' ? 'keyUpdateAndroid' : 'keyUpdateIos';
                    if (
                        qrSelected[keyPlatForm] !== res[keyPlatForm] ||
                        qrSelected.VersionCode !== res.VersionCode ||
                        qrSelected.UriPor !== res.UriPor ||
                        qrSelected.UriHR !== res.UriHR ||
                        qrSelected.UriMain !== res.UriMain ||
                        qrSelected.UriSys !== res.UriSys ||
                        qrSelected.UriCenter !== res.UriCenter ||
                        qrSelected.UriIdentity !== res.UriIdentity
                    )
                        this.addQrToList(res);
                    else return;
                } else {
                    ToasterSevice.showError('HRM_Incorrect_QRCode', 4000, 'TOP');
                }
            });
        }
    };

    checkVersion = async (isFromSetting) => {
        // VnrLoadingSevices.show();// bản chính cần có
        const isUpdateLater = store.getState()['update']['isUpdateLater'],
            { codePushKey } = this.state,
            _dataVnrStorage = getDataVnrStorage();

        // Android chỉ bị ngắt update khi tắt hẳn app
        if (this.isUpdateProgressing && Platform.OS == 'android') return;

        const strVersionRejectUpdate = await AsyncStorage.getItem('@DATA_VERSION_REJECT_UPDATE'),
            versionRejectUpdate = strVersionRejectUpdate != null ? JSON.parse(strVersionRejectUpdate) : {};

        const dataListQr = await AsyncStorage.getItem('@DATA_SCANED_QR_LIST'),
            dataListQrJson = dataListQr != null ? JSON.parse(dataListQr) : [],
            qrSelected = dataListQrJson.find((item) => item.isSelect == true);

        // VnrLoadingSevices.hide();// bản chính cần có
        let CodePushKEY = CODE_PUSH_DEPLOYMENT_KEY;

        if (
            dataVnrStorage.apiConfig &&
            qrSelected &&
            qrSelected.isSelect &&
            qrSelected.VersionCode &&
            qrSelected.keyUpdateIos &&
            qrSelected.keyUpdateAndroid
        ) {
            CodePushKEY = Platform.OS == 'ios' ? qrSelected.keyUpdateIos : qrSelected.keyUpdateAndroid;
            // Kiểm tra dự án có upbuild mới hay không thì update Code App theo build mới
            this.checkNewBuildVersion(qrSelected);
        } else if (dataVnrStorage.apiConfig && (!qrSelected || (qrSelected && !qrSelected.VersionCode))) {
            // chưa quét lại QR. Không có CodePushKEY
            if (!versionRejectUpdate['REJECT_RESCAN_QR']) {
                // Chưa từ chối
                this.getVersionCodeProject();
                return;
            } else {
                CodePushKEY = CODE_PUSH_DEPLOYMENT_KEY;
            }
        } else {
            CodePushKEY = CODE_PUSH_DEPLOYMENT_KEY;
        }

        const thisVersionApp = DeviceInfo.getVersion();
        codePush.checkForUpdate(CodePushKEY).then(async (update) => {
            try {
                if (update && !update.failedInstall && update.description) {
                    const { versionNameApp, description } = this.convertBase64ToObj(update.description),
                        isMandatory = _dataVnrStorage.currentUser == null ? true : update.isMandatory;
                    let allowUpdate = true;

                    // kiểm tra app đã chạy đúng version trên appStore và CHPlay chưa
                    if (versionNameApp && allowUpdate) {
                        let platForm = Platform.OS;
                        if (versionNameApp[platForm] !== thisVersionApp) {
                            if (versionRejectUpdate && versionRejectUpdate[versionNameApp[platForm]]) {
                                console.log('Từ chối update');
                            } else {
                                // Bắt buộc update app trên appStore và CHPlay
                                this.setState({
                                    versionNameWaitUpdate: versionNameApp[platForm],
                                    updateInfo: update, // Thông tin cập nhật
                                    isMandatory: update.isMandatory, // Có bắt buộc hay không
                                    description: description,
                                    modalUpdateAppStore: true // hiển thị modal cập nhật tren appStore và CHPlay
                                });
                                return;
                            }
                        }
                    }

                    // if (allowUpdate) {
                    //     // Check parkage installed == parkage server, trường hợp app tự update appStore và CHPlay
                    //     const verCurrent = `${CodePushKEY}_${update.label}`;
                    //     const getUpdateMetadata = await codePush.getUpdateMetadata(codePush.UpdateState.RUNNING);
                    //     if (getUpdateMetadata != null) {
                    //         const verMeta = `${getUpdateMetadata.deploymentKey}_${getUpdateMetadata.label}`;
                    //         if (verCurrent == verMeta) {
                    //             getUpdateMetadata.install();
                    //             return;
                    //         }
                    //     }
                    // }

                    // kiểm tra internet có mạnh hay không
                    // if (allowUpdate) {
                    //     const checkSpeed = await SpeedTestInterNet('https://qr.vnresource.net/content/images/system/CheckSpeedInternet.jpg');
                    //     if (checkSpeed && checkSpeed.isGood == false) {
                    //         ToasterSevice.showWarning('HRM_Update_Warning_Slow_InterNet', 6000);
                    //         return;
                    //     }
                    // }
                    if (this.isPendingProgress && codePushKey) {
                        if (isUpdateLater) this.updateLater();
                        else this.update();
                    } else {
                        this.setState({
                            codePushKey: CodePushKEY,
                            modalUpdateVisible: true, // hiển thị modal cập nhật
                            updateInfo: update, // Thông tin cập nhật
                            isMandatory: isMandatory, // Có bắt buộc hay không
                            description: description
                        });
                    }
                } else if (update && update.failedInstall) {
                    const { description } = this.convertBase64ToObj(update.description),
                        isMandatory = _dataVnrStorage.currentUser == null ? true : update.isMandatory;
                    // cho phép update khi fail
                    if (this.isPendingProgress && codePushKey) {
                        if (isUpdateLater) this.updateLater();
                        else this.update();
                    } else {
                        this.setState({
                            codePushKey: CodePushKEY,
                            modalUpdateVisible: true, // hiển thị modal cập nhật
                            updateInfo: update, // Thông tin cập nhật
                            isMandatory: isMandatory, // Có bắt buộc hay không
                            description: description
                        });
                    }
                } else if (isFromSetting) {
                    ToasterSevice.showSuccess('HRM_Title_Check_Version_Done');
                }
            } catch (error) {
                console.log(error, 'checkForUpdate');
            }
        });
    };

    async componentDidMount() {
        api.checkVersion = this.checkVersion.bind(this);
    }

    // ReUpdate Before update failded
    reUpdate = () => {
        this.setState({ isUpdate: true });
        const { codePushKey } = this.state;

        codePush.clearUpdates();
        // updateDialog: false, code-push no longer confirms the customer, and updates directly to avoid popping up native modal
        codePush.sync(
            {
                deploymentKey: codePushKey ? codePushKey : CODE_PUSH_DEPLOYMENT_KEY,
                updateDialog: false,
                installMode: codePush.InstallMode.IMMEDIATE
            },
            this.codePushStatusDidChange,
            this.codePushDownloadDidProgress
        );
    };

    update = () => {
        this.setState({ isUpdate: true });
        const { codePushKey } = this.state;
        // updateDialog: false, code-push no longer confirms the customer, and updates directly to avoid popping up native modal
        codePush.sync(
            {
                deploymentKey: codePushKey ? codePushKey : CODE_PUSH_DEPLOYMENT_KEY,
                updateDialog: false,
                installMode: codePush.InstallMode.ON_NEXT_RESUME,
                mandatoryInstallMode: codePush.InstallMode.ON_NEXT_RESUME
            },
            this.codePushStatusDidChange,
            this.codePushDownloadDidProgress
        );
    };

    updateLater = () => {
        this.setState({ isUpdateLater: true, modalUpdateVisible: false }, this.setUpdateLater);
        const { codePushKey } = this.state;
        // updateDialog: false, code-push no longer confirms the customer, and updates directly to avoid popping up native modal
        codePush.sync(
            {
                deploymentKey: codePushKey ? codePushKey : CODE_PUSH_DEPLOYMENT_KEY,
                updateDialog: false,
                installMode: codePush.InstallMode.ON_NEXT_RESUME,
                mandatoryInstallMode: codePush.InstallMode.ON_NEXT_RESUME
            },
            this.codePushStatusDidChange,
            this.codePushDownloadDidProgress
        );
    };

    updateOnStore = () => {
        const link = PlatformURL;
        Vnr_Function.openLink(link);
    };

    onCancelUpdateOnStore = () => {
        this.setState({ modalUpdateAppStore: false });
    };

    // Cancel, do not show the modal panel
    onCancel = async () => {
        this.setState({ ...defaultState });
    };

    // Calculate download progress
    codePushDownloadDidProgress = (Progress) => {
        const { isUpdateLater, isUpdate, progress } = this.state,
            progressFromStore = store.getState()['update']['progress'],
            _progress = isUpdateLater ? progressFromStore : progress;

        if (isUpdate || isUpdateLater) {
            let currProgress = Math.round((Progress.receivedBytes / Progress.totalBytes) * 100);
            if ((this.isPendingProgress == true && currProgress >= _progress) || this.isPendingProgress == false) {
                if (isUpdateLater) this.setProgressLater(currProgress);
                else
                    this.setState({
                        progress: currProgress
                    });
            }
        }
    };

    // Download status changes, monitor status changes, when an update error occurs, prompt update failure information and close the panel
    codePushStatusDidChange = (syncStatus) => {
        if (this.state.isUpdate || this.state.isUpdateLater) {
            switch (syncStatus) {
                case codePush.SyncStatus.CHECKING_FOR_UPDATE:
                    console.log('Checking for update'); // 1
                    break;
                case codePush.SyncStatus.DOWNLOADING_PACKAGE:
                    if (Platform.OS == 'android') this.isUpdateProgressing = true;
                    console.log('Downloading package'); // 2
                    break;
                case codePush.SyncStatus.AWAITING_USER_ACTION:
                    console.log('Awaiting user action');
                    break;
                case codePush.SyncStatus.INSTALLING_UPDATE:
                    console.log('Installing update');
                    break;
                case codePush.SyncStatus.UP_TO_DATE:
                    ToasterSevice.showError('App up to date.', 8000);
                    //this.onCancel();
                    console.log('App up to date.');
                    break;
                case codePush.SyncStatus.UPDATE_IGNORED:
                    console.log('Update cancelled by user');
                    break;
                case codePush.SyncStatus.UPDATE_INSTALLED:
                    this.isPendingProgress = false;
                    ToasterSevice.showSuccess('Hoàn tất quá trình tải bản cập nhật', 8000);
                    if (this.state.isUpdate) {
                        this.setState({ ...defaultState }, () => {
                            setTimeout(() => {
                                codePush.restartApp();
                            }, 200);
                        });
                    }
                    else {
                        this.setUpdateStatus(STATUS_UPDATE_LATER.DONE);
                    }
                    console.log('Update installed and will be applied on restart.');
                    break;
                case codePush.SyncStatus.UNKNOWN_ERROR:
                    this.isPendingProgress = true;
                    this.isUpdateProgressing = false;
                    this.setUpdateStatus(STATUS_UPDATE_LATER.ERROR);
                    ToasterSevice.showWarning('Quá trình update bị gián đoạn', 8000);
                    // When the update error occurs, prompt the message and close the panel
                    // this.toast.show('Update error, please restart the application! ');
                    //this.onCancel();
                    break;
            }
        }
    };

    setProgressLater = (progress) => {
        store.dispatch(update.actions.setProgress(progress));
    };

    setUpdateLater = () => {
        store.dispatch(update.actions.setIsUpdateLater(true));
    };

    setUpdateStatus = (status) => {
        store.dispatch(update.actions.setStatus(status));
    };

    render() {
        const { modalUpdateVisible, modalUpdateAppStore, description, progress, isUpdate, isMandatory, updateInfo } =
            this.state;

        return (
            <View>
                <VnrUpdateApp
                    isShowModal={modalUpdateVisible}
                    isUpdate={isUpdate}
                    isMandatory={isMandatory}
                    description={description}
                    progress={progress}
                    textButtoncancel={translate('HRM_PortalApp_DownloadAndUpdateLater')}
                    title={translate('HRM_PortalApp_TitleUpdate')}
                    onPressUpdate={() => {
                        updateInfo.failedInstall ? this.reUpdate() : this.update();
                    }}
                    onPressUpdateLater={() => {
                        this.updateLater();
                    }}
                />

                <VnrUpdateApp
                    isShowModal={modalUpdateAppStore}
                    isUpdate={isUpdate}
                    isMandatory={isMandatory}
                    description={description}
                    progress={progress}
                    title={translate('HRM_PortalApp_UpdateOnstore_Title')}
                    textButtoncancel={translate('HRM_PortalApp_RemindUpdateLater')}
                    onPressUpdate={() => {
                        this.updateOnStore();
                    }}
                    onPressUpdateLater={() => {
                        this.onCancelUpdateOnStore();
                    }}
                />
            </View>
        );
    }
}
