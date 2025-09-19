import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Image,
    Modal,
    AppState,
    Linking,
    Platform,
    // eslint-disable-next-line react-native/split-platform-components
    PermissionsAndroid
} from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Geolocation from '@react-native-community/geolocation';
import moment from 'moment';
import { styleSheets, Size, Colors, CustomStyleSheet } from '../../../../constants/styleConfig';
import VnrText from '../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../components/VnrTextInput/VnrTextInput';
import {
    IconBack,
    IconCamera,
    IconRefresh,
    IconTime,
    IconBackRadious,
    IconEdit,
    IconFinger,
    IconCancel,
    IconCheck,
    IconWifi,
    IconSetting
} from '../../../../constants/Icons';
import Time from './Time';
import HttpService from '../../../../utils/HttpService';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import Vnr_Function from '../../../../utils/Vnr_Function';
import { RNCamera } from 'react-native-camera';
import { translate } from '../../../../i18n/translate';
import { VnrLoadingSevices } from '../../../../components/VnrLoading/VnrLoadingPages';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ToasterSevice } from '../../../../components/Toaster/Toaster';
import { dataVnrStorage, getDataVnrStorage, setdataVnrStorageFromValue } from '../../../../assets/auth/authentication';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertSevice } from '../../../../components/Alert/Alert';
import { EnumIcon, EnumName, EnumTask } from '../../../../assets/constant';
import { connect } from 'react-redux';
import { startTask } from '../../../../factories/BackGroundTask';
import { getDataLocal, saveDataLocal } from '../../../../factories/LocalData';
import VnrPicker from '../../../../components/VnrPicker/VnrPicker';
import LottieView from 'lottie-react-native';
import DeviceInfo from 'react-native-device-info';
import DrawerServices from '../../../../utils/DrawerServices';
import AndroidOpenSettings from 'react-native-android-open-settings';
import ImagePicker from 'react-native-image-picker';

class AttTSLCheckInOutWifi extends Component {
    constructor(props) {
        super(props);

        this.state = {
            keyQuery: EnumName.E_PRIMARY_DATA,
            latitude: 0,
            longitude: 0,
            address: '',
            addressPermissionDenied: null,
            imageMap: null,
            Comment: '',
            imageCamera: null,
            typeData: null,
            isShowNotes: false,
            isvisibleModalCamara: false,
            typeCamera: false,
            isloading: false,
            configLoadWorkPlace: {
                isCheckConfigLoadWorkPlace: false,
                refresh: false,
                value: null,
                data: null,
                visible: false
            },
            configConstraintInOut: false,
            configConstraintDistanceTwoPoint: false,
            configConstraintPhotoGrapCheck: 'E_NONE',
            configConstraintWifi: {
                isCheckingByMACAdress: false,
                configCheckInWifi: null
                // isConfirmMACAdressNotMatch: false,
            },
            configConstraintDistanceWithRadious: {
                isCheckingByCoordinates: false,
                listCatCoodinate: null,
                configCheckInCoondinate: null,
                listCoordinatesView: null,
                listCatShop: null
            },
            isAllowCheckInGPSLeavedayBusinessTrip: false,
            checkIn: {
                isCheck: true,
                timeCheckIn: null,
                address: ''
            },
            checkOut: {
                isCheck: true,
                timeCheckOut: null,
                address: ''
            },
            typeRequestData: null,
            networkInfo: props.detailsNetwork
            // appState: null,
        };

        this.ResMapViewComponent = null;

        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;
        this.isConfirmMACAdressNotMatch = false;
        this.isConfirmCoodinateNotMatch = false;
        this.isConfirmSaveTamScanLog = true;
        this.macAddressCheckPass = null;
        this.coodinateCheckPass = null;
        this.watchID = null;

        this.addListenerAppState = null;
        this.refTime = null;
    }

    takePhoto = () => {
        VnrLoadingSevices.show();
        const options = {
            title: 'Select Avatar',
            customButtons: [{ name: 'fb', title: 'Choose Photo from Facebook' }],
            storageOptions: {
                skipBackup: true,
                path: 'images'
            }
        };
        ImagePicker.launchCamera(options, (response) => {
            if (response.didCancel) {
                VnrLoadingSevices.hide();
            } else {
                const title = response.uri.split('/').pop().split('#')[0].split('?')[0];
                const file = {
                    uri: response.uri,
                    name: title,
                    type: response.type,
                    fileSize: response.fileSize
                };
                this.setState({ imageCamera: file }, () => {
                    VnrLoadingSevices.hide();
                });
            }
        });
    };

    requestData = async (typeData, distance = '') => {
        try {
            const {
                    configConstraintWifi,
                    configConstraintDistanceWithRadious,
                    isAllowCheckInGPSLeavedayBusinessTrip,
                    configLoadWorkPlace
                } = this.state,
                { isCheckingByCoordinates } = configConstraintDistanceWithRadious,
                { isCheckingByMACAdress } = configConstraintWifi;

            VnrLoadingSevices.show();
            this.isProcessing = true;

            // kiem tra bien bssid
            let _bssid = null;
            let isApprove = false;

            if (this.macAddressCheckPass !== null) {
                _bssid = this.macAddressCheckPass;
            }

            if (
                (isCheckingByMACAdress && this.isConfirmMACAdressNotMatch === false) ||
                (isCheckingByCoordinates && this.isConfirmCoodinateNotMatch === false)
            ) {
                // auto duyệt khi đúng wifi hoặc đúng tọa độ
                isApprove = true;
            }

            const newTimeLog = await HttpService.Post('[URI_HR]/Sys_GetData/GetTimeOfServer');
            const getUnitIdApp = await Vnr_Function.getUnitIdApp();

            const dataBody = {
                ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                UserSubmit: dataVnrStorage.currentUser.info.ProfileID,
                UserUpdate: dataVnrStorage.currentUser.info.ProfileID,
                Comment: this.state.Comment,
                IsPortal: true,
                Status: 'E_SUBMIT',
                Type: typeData,
                IsCheckGPS: true,
                MACAddress: isCheckingByMACAdress && this.isConfirmMACAdressNotMatch === false ? _bssid : null,
                IsScreenCheckInGPS: false, // chấm công giờ serverF
                IsAllowApprove: isApprove,
                TimeLogTime: moment(newTimeLog).format('HH:mm'),
                TimeLog: moment(newTimeLog).format('YYYY-MM-DD HH:mm:ss'),
                LocationAddress: `WIFI|${DeviceInfo.getUniqueId()}`,
                Distance: distance,
                Coordinate: '',
                IsAllowCheckInGPSWhenLeavedayBusinessTrip: isAllowCheckInGPSLeavedayBusinessTrip,
                PlaceID: configLoadWorkPlace.value ? configLoadWorkPlace.value.ID : null,
                IPDeviceGPS: getUnitIdApp
            };

            let formData = new FormData();
            // PMC bỏ lưu Hình để chấm công nhanh hơn.
            formData.append('LocationImage', null);
            formData.append('ImageCheckIn', null);
            formData.append('AttTamScanModel', JSON.stringify(dataBody));

            const configs = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            };
            const callBackConfirmRequest = () => {
                this.isConfirmSaveTamScanLog = false; // Đã confirm Save , case cảnh báo đi công tác không confirm cho lần kế tiếp
                HttpService.Post('[URI_HR]/Att_GetData/New_SaveTamScanLog', formData, configs)
                    .then((res) => {
                        if (!Vnr_Function.CheckIsNullOrEmpty(res) && res == 'Success') {
                            ToasterSevice.showSuccess('Hrm_Succeed');
                            this.reload(true, dataBody);
                        } else if (res && typeof res === 'string') {
                            if (res === 'WarningCheckInGPSInLeavedayBusinessTravel') {
                                AlertSevice.alert({
                                    timeHideModal: 10000, // Sau 10s nếu không xác nhận thì sẽ tắt
                                    iconType: EnumIcon.E_WARNING,
                                    title: 'E_WARNING',
                                    message: 'WarningCheckInGPSInLeavedayBusinessTravel',
                                    textRightButton: 'HRM_Common_Continue',
                                    textLeftButton: 'HRM_Common_Close',
                                    onBackDrop: () => {
                                        VnrLoadingSevices.hide();
                                        this.reload();
                                    },
                                    onCancel: () => {
                                        VnrLoadingSevices.hide();
                                        this.reload();
                                    },
                                    onConfirm: () => {
                                        this.setState(
                                            {
                                                isAllowCheckInGPSLeavedayBusinessTrip: true
                                            },
                                            () => {
                                                this.requestData(typeData, distance);
                                            }
                                        );
                                    }
                                });
                            } else if (res === 'OnlyAllowATTCheckInGPSForBizTrip') {
                                this.reload();
                                ToasterSevice.showWarning(res);
                            } else if (res === 'Hrm_Locked') {
                                ToasterSevice.showWarning('Hrm_Locked');
                            } else if (res.includes('E_BLOCK|')) {
                                ToasterSevice.showWarning(res.split('|')[1].trim());
                            } else if (res.includes('E_WARNING|')) {
                                // 0181527: Xử lý cảnh báo chấm công trên app nếu không thuộc thời gian cấu hình
                                const message = res.split('|')[1].trim();
                                AlertSevice.alert({
                                    iconType: EnumIcon.E_WARNING,
                                    title: 'E_WARNING',
                                    message: message,
                                    textRightButton: 'HRM_Common_Continue',
                                    textLeftButton: 'HRM_Common_Close',
                                    timeHideModal: 10000, // Sau 10s nếu không xác nhận thì sẽ tắt
                                    onBackDrop: () => {
                                        VnrLoadingSevices.hide();
                                        this.reload();
                                    },
                                    onCancel: () => {
                                        VnrLoadingSevices.hide();
                                        this.reload();
                                    },
                                    onConfirm: () => {
                                        this.setState(
                                            {
                                                IsRemoveAndContinue: true
                                            },
                                            () => {
                                                this.requestData(typeData, distance);
                                            }
                                        );
                                    }
                                });
                            } else {
                                ToasterSevice.showWarning(res);
                            }
                        } else {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 6000);
                        }
                        //mở lại event
                        this.isProcessing = false;
                        this.isConfirmMACAdressNotMatch = false;
                        this.isConfirmCoodinateNotMatch = false;
                        VnrLoadingSevices.hide();
                    })
                    .catch((error) => {
                        this.handleErrorRequest(error);
                    });
            };

            let messAlertSave = '',
                typeAppTransTitle = typeData === 'E_IN' ? 'HRM_Attendance_InTime' : 'HRM_Attendance_HoursTo',
                typeAppTransMess = typeData === 'E_IN' ? translate('E_IN') : translate('E_OUT');

            if (dataVnrStorage.languageApp == 'VN') {
                messAlertSave = `Bạn có chắc xác nhận giờ ${typeAppTransMess.toLowerCase()} là ${
                    dataBody.TimeLogTime
                } không?`;
            } else {
                messAlertSave = `Are you sure the ${typeAppTransMess.toLowerCase()} time is confirmed at ${
                    dataBody.TimeLogTime
                }?`;
            }
            if (this.isConfirmSaveTamScanLog) {
                AlertSevice.alert({
                    iconType: EnumIcon.E_INFO,
                    title: typeAppTransTitle,
                    message: messAlertSave,
                    textLeftButton: 'HRM_Common_No_AVN',
                    textRightButton: 'HRM_Common_Yes_AVN',
                    timeHideModal: 10000, // Sau 10s nếu không xác nhận thì sẽ tắt
                    onBackDrop: () => {
                        VnrLoadingSevices.hide();
                        this.reload();
                    },
                    onCancel: () => {
                        VnrLoadingSevices.hide();
                        this.reload();
                    },
                    onConfirm: callBackConfirmRequest
                });
            } else {
                callBackConfirmRequest();
            }
        } catch (error) {
            this.handleErrorRequest(error);
        }
    };

    handleErrorRequest = () => {
        this.isProcessing = false;
        this.isConfirmMACAdressNotMatch = false;
        this.isConfirmCoodinateNotMatch = false;
        VnrLoadingSevices.hide();
    };

    requestGetCoondinateInBeforce = () => {
        const dataBody = {
            ProfileID: dataVnrStorage.currentUser.info.ProfileID,
            Type: EnumName.E_IN,
            TimeLogTime: moment(new Date()).format('HH:mm')
        };
        return HttpService.Post('[URI_HR]//Att_GetData/GetCoondiNateInBefore', dataBody);
    };

    onConfirm = async (typeData) => {
        this.requestData(typeData);
    };

    goBack = () => {
        const { navigation } = this.props;
        navigation.navigate('Home');
    };

    reload = async (isReloadData, _TimeLogCheckIn) => {
        if (dataVnrStorage.currentUser == null) {
            return true;
        }
        //mở lại event
        this.isProcessing = false;
        this.isConfirmSaveTamScanLog = true; // Bắt confirm khi Save Data
        this.isConfirmMACAdressNotMatch = false;

        if (!this.state.isloading) {
            this.setState({ isloading: true });
        }

        getDataLocal(EnumTask.KT_AttTSLCheckInOutWifi)
            .then(async (data) => {
                try {
                    const resAll = data && data[EnumName.E_PRIMARY_DATA] ? data[EnumName.E_PRIMARY_DATA] : null;

                    const resCheckInOut = data && data[EnumName.E_FILTER] ? data[EnumName.E_FILTER] : null;

                    if (resAll == null) {
                        return;
                    }

                    let { checkIn, checkOut, configConstraintWifi } = this.state;

                    const resWorkPlace = resAll[0];
                    let resDataInOut = null;
                    if (isReloadData && _TimeLogCheckIn) {
                        resDataInOut = {
                            ..._TimeLogCheckIn,
                            Type: _TimeLogCheckIn.Type,
                            TimeLog: _TimeLogCheckIn.TimeLog
                        };
                    } else if (resCheckInOut) {
                        resDataInOut = resCheckInOut;
                    } else {
                        resDataInOut = await HttpService.Post('[URI_HR]/Por_GetData/Get_TAMScanLogOrderTimeLogDesc', {
                            ProfileID: dataVnrStorage.currentUser.info.ProfileID
                        });
                    }

                    // Lưu inOut
                    if (resDataInOut) {
                        saveDataLocal(EnumTask.KT_AttTSLCheckInOutWifi, {
                            [EnumName.E_PRIMARY_DATA]: resAll,
                            [EnumName.E_FILTER]: resDataInOut
                        });
                    }

                    const isCheckingByMACAdress = true;
                    // kiểm tra cấu hình chấm công khoảng cách và MACID
                    if (isCheckingByMACAdress) {
                        // Check dữ liệu DS MAC
                        if (resWorkPlace.MACAddress) {
                            this.isConfirmMACAdressNotMatch = false;

                            configConstraintWifi = {
                                isCheckingByMACAdress: isCheckingByMACAdress,
                                macID: `${resWorkPlace.MACAddress},00:13:10:85:fe:01`,
                                configCheckInWifi: resWorkPlace.ConfigCheckInWifi
                                    ? resWorkPlace.ConfigCheckInWifi
                                    : null
                            };
                        } else {
                            this.isConfirmMACAdressNotMatch = false;
                            configConstraintWifi = {
                                isCheckingByMACAdress: isCheckingByMACAdress,
                                macID: null,
                                configCheckInWifi: resWorkPlace.ConfigCheckInWifi
                                    ? resWorkPlace.ConfigCheckInWifi
                                    : null
                            };
                        }
                    }

                    // check dữ liệu gần nhất là in hay out
                    if (
                        !Vnr_Function.CheckIsNullOrEmpty(resDataInOut) &&
                        !Vnr_Function.CheckIsNullOrEmpty(resDataInOut.Type) &&
                        !Vnr_Function.CheckIsNullOrEmpty(resDataInOut.TimeLog)
                    ) {
                        if (resDataInOut.Type == 'E_IN') {
                            if (checkOut.TimeLog != null) {
                                checkOut.TimeLog = null;
                            }
                            checkOut.isCheck = false;
                            checkIn = { ...resDataInOut, ...{ isCheck: true } };
                            this.setState(
                                {
                                    checkIn,
                                    checkOut,
                                    imageCamera: null,
                                    typeRequestData: null,
                                    Comment: '',
                                    configConstraintWifi,
                                    isAllowCheckInGPSLeavedayBusinessTrip: false
                                },
                                () => {
                                    this.checkPlatformCallRequestLocation();
                                }
                            );
                        } else {
                            checkIn.timeCheckIn = null;
                            checkIn.isCheck = false;
                            checkOut = { ...resDataInOut, ...{ isCheck: true } };

                            if (checkIn.TimeLog != null) {
                                checkIn.TimeLog = null;
                            }
                            this.setState(
                                {
                                    checkIn,
                                    checkOut,
                                    imageCamera: null,
                                    typeRequestData: null,
                                    Comment: '',
                                    configConstraintWifi,
                                    isAllowCheckInGPSLeavedayBusinessTrip: false
                                },
                                () => {
                                    this.checkPlatformCallRequestLocation();
                                }
                            );
                        }
                    } else {
                        checkIn.timeCheckIn = null;
                        checkIn.isCheck = false;
                        checkOut.isCheck = true;
                        if (checkIn.TimeLog != null) {
                            checkIn.TimeLog = null;
                        }
                        this.setState(
                            {
                                checkIn,
                                checkOut,
                                imageCamera: null,
                                typeRequestData: null,
                                Comment: '',
                                configConstraintWifi,
                                isAllowCheckInGPSLeavedayBusinessTrip: false
                            },
                            () => {
                                this.checkPlatformCallRequestLocation();
                            }
                        );
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            })
            .catch(() => {});
    };

    hideModalCamara = () => {
        this.isConfirmMACAdressNotMatch = false;
        this.isConfirmCoodinateNotMatch = false;
        this.setState({
            isvisibleModalCamara: false
        });
    };

    showModalCamera = (typeRequest) => {
        // set typeRequestData để
        this.setState({ isvisibleModalCamara: true, typeRequestData: typeRequest });
    };

    takePicture = async function (camera) {
        // quality tham so chat luong hinh anh ( 0 -> 1)
        const options = { quality: 0.1, base64: false };
        const data = await camera.takePictureAsync(options);

        const title = data.uri.split('/').pop().split('#')[0].split('?')[0];
        const file = {
            uri: data.uri,
            name: title,
            type: 'image/jpeg',
            fileSize: data.height * data.width * 4,
            temp: true
        };
        this.setState({ imageCamera: file });
    };

    confirmFileReview = (value) => {
        const { imageCamera, typeRequestData } = this.state;
        if (value === true) {
            imageCamera.temp = false;
            this.setState({ imageCamera, isvisibleModalCamara: false }, () =>
                this.checkConstraintPhotoSaveInOut(typeRequestData)
            );
        } else {
            this.setState({ imageCamera: null });
        }
    };

    reviewCameraImage = (image) => {
        return (
            <View style={styleSheets.container}>
                <Image source={{ uri: image.uri }} resizeMode={'cover'} style={stylesCamera.viewAllreviewImage} />

                <View style={stylesCamera.viewAllreviewCamera}>
                    <View style={stylesCamera.oval} />
                    <View style={stylesCamera.lisbntStyle}>
                        <TouchableOpacity onPress={() => this.confirmFileReview(false)} style={stylesCamera.capture}>
                            <IconBackRadious size={Size.iconSize + 10} color={Colors.black} />
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={() => this.confirmFileReview(true)}
                            style={[stylesCamera.captureCamera, { backgroundColor: Colors.primary }]}
                        >
                            <IconCheck size={Size.iconSize + 15} color={Colors.white} />
                        </TouchableOpacity>
                        <View style={stylesCamera.capture}>
                            <IconRefresh size={Size.iconSize + 10} color={Colors.white} />
                        </View>
                    </View>
                </View>
            </View>
        );
    };

    compareBssid = (macID, bssid) => {
        const hexToString = (hex) => {
            let string = '';
            for (let i = 0; i < hex.length; i += 2) {
                string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
            }
            return string;
        };
        let items = macID.split(':'),
            other = bssid.split(':');
        for (let j = 0; j < items.length; j++) {
            if (hexToString(items[j]) !== hexToString(other[j])) {
                return false;
            }
        }

        return true;
    };

    handleCompareBssid = (macAddress, bssid) => {
        if (macAddress == null) return { actionStatus: false };

        const listAddress = macAddress.split(',');
        for (let i = 0; i < listAddress.length; i++) {
            if (this.compareBssid(listAddress[i], bssid) === true)
                return { actionStatus: true, macAddressEqua: listAddress[i] };
        }

        return { actionStatus: false };
    };

    requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else {
                return false;
            }
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    checkPlatformCallRequestLocation = async (isRecheck = false) => {
        let _dataVnrStorage = getDataVnrStorage();
        if (_dataVnrStorage.currentUser && _dataVnrStorage.currentUser.isAcceptCoordinate && isRecheck == false) {
            this.checkWifiAccpet();
        } else if (Platform.OS == 'android') {
            const Permission = await this.requestLocationPermission();
            if (Permission == true) {
                Geolocation.getCurrentPosition(
                    async (position) => {
                        let latitude = position.coords.latitude,
                            longitude = position.coords.longitude;

                        if (latitude && longitude) {
                            // Accept Coordinate
                            this.saveIsAcceptCoordinate(true);
                            this.checkWifiAccpet(true);
                        } else {
                            this.saveIsAcceptCoordinate(false);
                            this.setState({ address: 'PERMISSION_DENIED', isloading: false });
                        }
                    },
                    (error) => {
                        this.saveIsAcceptCoordinate(false);
                        if (error && error.code === 1) {
                            this.alertContrainPermission();
                        } else if (error && error.code === 2) {
                            this.alertContrainPermissionGpsService();
                        }
                        this.setState({ address: 'PERMISSION_DENIED', isloading: false });
                    },
                    { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
                );
            } else {
                this.setState({ address: 'PERMISSION_DENIED', isloading: false });
                this.alertContrainPermission();
                this.saveIsAcceptCoordinate(false);
            }
        } else {
            Geolocation.requestAuthorization();
            Geolocation.getCurrentPosition(
                async (position) => {
                    let latitude = position.coords.latitude,
                        longitude = position.coords.longitude;

                    if (latitude && longitude) {
                        // Accept Coordinate
                        this.saveIsAcceptCoordinate(true);
                        this.checkWifiAccpet(true);
                    } else {
                        this.saveIsAcceptCoordinate(false);
                        this.setState({ address: 'PERMISSION_DENIED', isloading: false });
                    }
                },
                (error) => {
                    this.saveIsAcceptCoordinate(false);
                    if (error && error.code === 1) {
                        this.alertContrainPermission();
                    } else if (error && error.code === 2) {
                        this.alertContrainPermissionGpsService();
                    }
                    this.setState({ address: 'PERMISSION_DENIED', isloading: false });
                },
                { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
            );
        }
    };

    openSettings = () => {
        const { networkInfo, isloading } = this.state,
            _dataVnrStorage = getDataVnrStorage();

        if (isloading) return;

        if (_dataVnrStorage.currentUser && !_dataVnrStorage.currentUser.isAcceptCoordinate) {
            this.checkPlatformCallRequestLocation(true);
        } else if (
            this.props.isConnected === false ||
            networkInfo.bssid == null ||
            networkInfo.bssid == undefined ||
            (networkInfo.bssid && !networkInfo.isCheckPassWifi)
        ) {
            Platform.OS === 'ios' ? Vnr_Function.openLink('App-Prefs:root=WIFI') : AndroidOpenSettings.wifiSettings();
        }
    };

    saveIsAcceptCoordinate = (bool) => {
        let _dataVnrStorage = getDataVnrStorage();
        // Accept Coordinate
        _dataVnrStorage.currentUser.isAcceptCoordinate = bool;
        setdataVnrStorageFromValue('currentUser', _dataVnrStorage.currentUser);
    };

    alertContrainPermission = () => {
        if (this.isShowAlert) {
            return;
        }
        this.isShowAlert = true;

        AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            message: 'HRM_PortalApp_Allow_Permission_GpsWifi',
            title: 'setting',
            textRightButton: 'setting',
            onCancel: () => {
                VnrLoadingSevices.hide();
                DrawerServices.goBack();
                this.isShowAlert = false;
            },
            onConfirm: () => {
                Platform.OS === 'ios' ? Vnr_Function.openLink('app-settings:') : Linking.openSettings();
                this.isShowAlert = false;
            }
        });
    };

    alertContrainPermissionGpsService = () => {
        if (this.isShowAlert) {
            return;
        }
        this.isShowAlert = true;

        AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            message: 'HRM_PortalApp_Allow_InActive_GpsWifi',
            textRightButton: 'setting',
            title: 'setting',
            onCancel: () => {
                VnrLoadingSevices.hide();
                DrawerServices.goBack();
                this.isShowAlert = false;
            },
            onConfirm: () => {
                this.isShowAlert = false;
                Platform.OS === 'ios'
                    ? DrawerServices.navigate(
                        dataVnrStorage.languageApp === 'VN' ? 'TutorialGPSiOS' : 'TutorialGPSiOSEn'
                    )
                    : AndroidOpenSettings.locationSourceSettings();
            }
        });
    };

    checkWifiAccpet = (isAcceptCoordinate = false) => {
        const { configConstraintWifi, networkInfo } = this.state,
            { macID } = configConstraintWifi ? configConstraintWifi : {};

        NetInfo.fetch('wifi')
            .then((res) => {
                const { bssid } = res.details;
                let isCheckPassWifi = false;

                if (
                    bssid != null &&
                    bssid.split(':').length == 6 &&
                    bssid != '02:00:00:00:00:00' &&
                    Object.keys(networkInfo).length > 0
                ) {
                    if (macID && macID != null && typeof macID == 'string') {
                        const resultCompare = this.handleCompareBssid(macID, bssid);
                        if (
                            resultCompare &&
                            resultCompare['actionStatus'] === true &&
                            resultCompare['macAddressEqua']
                        ) {
                            isCheckPassWifi = true;
                        }
                    }

                    this.setState({
                        networkInfo: {
                            ...res.details,
                            isCheckPassWifi
                        },
                        isloading: false
                    });
                } else {
                    this.setState({
                        networkInfo: {
                            ...res.details,
                            bssid: null,
                            isCheckPassWifi
                        },
                        isloading: false
                    });

                    // Trường hợp không bật Định vị thì không lấy được bssid
                    if (
                        res.type === 'wifi' &&
                        res.isConnected == true &&
                        isAcceptCoordinate == false
                        //&& (bssid == null || bssid == '02:00:00:00:00:00' || (bssid != null && bssid != null && bssid.split(':').length != 6 ))
                    ) {
                        this.checkPlatformCallRequestLocation(true);
                    }
                }
            })
            .catch(() => {
                this.setState({
                    networkInfo: {
                        bssid: null,
                        isCheckPassWifi: false
                    },
                    isloading: false
                });
            });
    };

    checkConstraintPhotoSaveInOut = (typeRequest) => {
        const { configConstraintWifi, networkInfo } = this.state,
            { macID, isCheckingByMACAdress, configCheckInWifi } = configConstraintWifi ? configConstraintWifi : {};

        // kiem tra bien bssid
        let _bssid = '';
        if (networkInfo.bssid && typeof networkInfo.bssid == 'string') {
            _bssid = networkInfo.bssid;
        }

        // kiem tra config validate
        if (this.isProcessing) {
            return;
        }

        // checking với địaw chỉ mac;
        if (isCheckingByMACAdress && this.isConfirmMACAdressNotMatch === false) {
            // trường hợp có cấu hình kiểm tra địa chỉ mac nhưng false
            if (Object.keys(networkInfo).length == 0) {
                ToasterSevice.showError('HRM_Alert_Please_Check_NetWork');
                return;
            }
            const resultCompare = this.handleCompareBssid(macID, _bssid);
            if (resultCompare && resultCompare['actionStatus'] === false) {
                if (configCheckInWifi && configCheckInWifi == EnumName.E_BLOCK) {
                    ToasterSevice.showError('Block_NotMatch_MAC_Wifi');
                    return;
                } else {
                    AlertSevice.alert({
                        iconType: EnumIcon.E_WARNING,
                        title: 'E_WARNING',
                        message: 'Warning_NotMatch_MAC_Wifi',
                        textRightButton: 'HRM_Common_Continue',
                        textLeftButton: 'HRM_Common_Close',
                        onCancel: () => {
                            this.reload();
                        },
                        onConfirm: () => {
                            this.isConfirmMACAdressNotMatch = true;
                            this.fbCheckConstraintPhoto(typeRequest);
                        }
                    });
                    this.macAddressCheckPass = null;
                    return;
                }
            } else if (resultCompare && resultCompare['actionStatus'] === true && resultCompare['macAddressEqua']) {
                this.macAddressCheckPass = resultCompare['macAddressEqua'];
            }
        }

        this.fbCheckConstraintPhoto(typeRequest);
    };

    fbCheckConstraintPhoto = (typeRequest) => {
        const { imageCamera, configConstraintPhotoGrapCheck, configConstraintInOut } = this.state;

        // cau hinh rang buoc chup anh
        if (
            (configConstraintPhotoGrapCheck === 'E_VALIDATE' || configConstraintPhotoGrapCheck === 'E_DEFAULT') &&
            imageCamera == null
        ) {
            this.showModalCamera(typeRequest);
            //ToasterSevice.showWarning('Att_TAMScanLog_Not_Saved_Photo');
            return;
        }

        //canh bao chup anh
        if (configConstraintPhotoGrapCheck === 'E_WARNING' && imageCamera == null) {
            AlertSevice.alert({
                iconType: EnumIcon.E_WARNING,
                title: 'E_WARNING',
                message: 'Att_TAMScanLog_Not_Saved_Photo',
                textRightButton: 'HRM_Common_Continue',
                textLeftButton: 'HRM_GPS_Tile_Take_Photo',
                onCancel: () => {
                    this.showModalCamera(typeRequest);
                },
                onConfirm: () => {
                    this.onConfirm(typeRequest);
                }
            });
            return;
        }

        // khong co rang buoc chup anh và có ràng buộc in/out
        if (configConstraintInOut === true && typeRequest === 'E_OUT') {
            this.onConfirm(typeRequest);
        } else {
            this.onConfirm(typeRequest);
        }
    };

    renderSessionImage = () => {
        const time = parseInt(moment().format('HH'));
        if (time >= 4 && time <= 10)
            return (
                <Image
                    source={require('../../../../assets/images/GPS/SessionMorning.png')}
                    style={styles.ImageColection}
                />
            );
        else if (time >= 11 && time <= 15)
            return (
                <Image
                    source={require('../../../../assets/images/GPS/SessionAfternoon.png')}
                    style={styles.ImageColection}
                />
            );
        else if (time >= 16 && time <= 18)
            return (
                <Image
                    source={require('../../../../assets/images/GPS/SessionAfternoon.png')}
                    style={styles.ImageColection}
                />
            );
        else
            return (
                <Image
                    source={require('../../../../assets/images/GPS/SessionNight.png')}
                    style={styles.ImageColection}
                />
            );
    };

    renderSessionText = () => {
        const time = parseInt(moment().format('HH'));
        if (time >= 4 && time <= 10)
            return <VnrText i18nKey={'HRM_GPS_Session_Morning'} style={[styleSheets.text, styles.txtWecome]} />;
        else if (time >= 11 && time <= 15)
            return <VnrText i18nKey={'HRM_GPS_Session_Afternoon'} style={[styleSheets.text, styles.txtWecome]} />;
        else if (time >= 16 && time <= 18)
            return <VnrText i18nKey={'HRM_GPS_Session_Afternoon'} style={[styleSheets.text, styles.txtWecome]} />;
        else return <VnrText i18nKey={'HRM_GPS_Session_Evening'} style={[styleSheets.text, styles.txtWecome]} />;
    };

    onPickTypeLoadWorkPlace = (value) => {
        //debugger
        const { configLoadWorkPlace, typeRequestData } = this.state;
        this.setState(
            {
                configLoadWorkPlace: {
                    ...configLoadWorkPlace,
                    value: value,
                    visible: false
                }
            },
            () => {
                value !== null && this.checkConstraintPhotoSaveInOut(typeRequestData);
            }
        );
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == EnumTask.KT_AttTSLCheckInOutWifi) {
            if (nextProps.message && keyQuery == nextProps.message.keyQuery && nextProps.message.dataChange) {
                this.reload();
            }
        }

        if (!Vnr_Function.compare(nextProps.detailsNetwork, this.state.networkInfo)) {
            this.checkWifiAccpet();
        }
    }

    _handleAppStateChange = async (nextAppState) => {
        if (nextAppState === 'active') {
            this.initState(false);
        }
    };

    initState = (isStartRequestServer = true) => {
        this.reload();

        if (this.addListenerAppState == null) {
            this.addListenerAppState = true;
            AppState.addEventListener('change', this._handleAppStateChange);
        }

        this.setState(
            {
                isloading: true,
                keyQuery: EnumName.E_PRIMARY_DATA
            },
            () => {
                isStartRequestServer == true &&
                    startTask({
                        keyTask: EnumTask.KT_AttTSLCheckInOutWifi,
                        payload: {
                            keyQuery: EnumName.E_PRIMARY_DATA,
                            isCompare: true
                        }
                    });
            }
        );
    };

    componentDidMount() {
        this.initState();
    }

    componentWillUnmount() {
        this.watchID != null && Geolocation.clearWatch(this.watchID);

        if (this.addListenerAppState) AppState.removeEventListener('change', this._handleAppStateChange);
    }

    componentDidUpdate() {}

    render() {
        const {
                checkIn,
                checkOut,
                imageCamera,
                isvisibleModalCamara,
                typeCamera,
                configConstraintInOut,
                configLoadWorkPlace,
                isloading,
                configConstraintWifi,
                isRefeshTime,
                networkInfo
            } = this.state,
            { macID } = configConstraintWifi ? configConstraintWifi : {};

        const _dataVnrStorage = getDataVnrStorage();

        let textMessageError = '',
            btnDisable = false,
            isActiveSettings = false,
            viewButtonPrimary = (
                <View style={styles.viewButton}>
                    <VnrLoading size={'large'} />
                </View>
            );

        if (!isloading) {
            if (macID == null) {
                textMessageError = translate('HRM_AppPortal_Wifi_InValid_MacID');
                btnDisable = true;
            } else if (_dataVnrStorage.currentUser && !_dataVnrStorage.currentUser.isAcceptCoordinate) {
                textMessageError = translate('HRM_PortalApp_Mock_NoAccess');
                btnDisable = true;
                isActiveSettings = true;
            } else if (this.props.isConnected === false) {
                textMessageError = translate('no-connect-internet');
                btnDisable = true;
                isActiveSettings = true;
            } else if (networkInfo.bssid == null || networkInfo.bssid == undefined) {
                textMessageError = translate('HRM_AppPortal_Wifi_NotConnected');
                btnDisable = true;
                isActiveSettings = true;
            } else if (networkInfo.bssid && !networkInfo.isCheckPassWifi) {
                textMessageError = translate('HRM_AppPortal_Wifi_Invalid');
                isActiveSettings = true;
                btnDisable = true;
            } else if (networkInfo.bssid && networkInfo.isCheckPassWifi) {
                textMessageError = translate('HRM_AppPortal_Wifi_Valid');
            }
        }

        // xử lý button chính
        if (!isloading) {
            if (configConstraintInOut && !isloading) {
                if (!checkIn.isCheck) {
                    viewButtonPrimary = (
                        <View style={styles.viewButton}>
                            <TouchableOpacity
                                style={[styles.viewButton_circle, btnDisable && styles.bntCheckDisable]}
                                activeOpacity={!btnDisable ? 0.6 : 1}
                                onPress={() => !btnDisable && this.checkConstraintPhotoSaveInOut('E_IN')}
                            >
                                <IconFinger
                                    color={Colors.white}
                                    size={Size.deviceheight >= 1024 ? 100 : Size.deviceWidth * 0.2}
                                />
                            </TouchableOpacity>
                        </View>
                    );
                } else {
                    viewButtonPrimary = (
                        <View style={styles.viewButton}>
                            <TouchableOpacity
                                style={[styles.button_End, btnDisable && styles.bntCheckDisable]}
                                activeOpacity={!btnDisable ? 0.6 : 1}
                                onPress={() => !btnDisable && this.checkConstraintPhotoSaveInOut('E_OUT')}
                            >
                                <IconTime color={Colors.white} size={Size.iconSize} />
                                <VnrText
                                    i18nKey={'HRM_Sys_EndDate'}
                                    style={[styleSheets.lable, styles.button_End_Text]}
                                />
                            </TouchableOpacity>
                        </View>
                    );
                }
            } else if (!configConstraintInOut && !isloading) {
                viewButtonPrimary = (
                    <View style={styles.viewButtonCheckInOut}>
                        <TouchableOpacity
                            style={[styles.bntCheckIn, btnDisable && styles.bntCheckDisable]}
                            activeOpacity={!btnDisable ? 0.6 : 1}
                            onPress={() => !btnDisable && this.checkConstraintPhotoSaveInOut('E_IN')}
                        >
                            <VnrText
                                i18nKey={'HRM_Common_CheckIn'}
                                style={[styleSheets.lable, styles.button_End_Text]}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={[styles.bntCheckOut, btnDisable && styles.bntCheckDisable]}
                            activeOpacity={!btnDisable ? 0.6 : 1}
                            onPress={() => !btnDisable && this.checkConstraintPhotoSaveInOut('E_OUT')}
                        >
                            <VnrText
                                i18nKey={'HRM_Common_CheckOut'}
                                style={[styleSheets.lable, styles.button_End_Text]}
                            />
                        </TouchableOpacity>
                    </View>
                );
            }
        }

        return (
            <SafeAreaView style={styleSheets.container}>
                <KeyboardAwareScrollView
                    scrollEnabled={false}
                    keyboardShouldPersistTaps={'handled'}
                    contentContainerStyle={CustomStyleSheet.flex(1)}
                >
                    <View style={styles.styContent}>
                        <View style={[styles.viewMap]}>
                            <View style={styles.styViewGoback}>
                                <TouchableOpacity style={styles.bntGoBack} onPress={() => this.goBack()}>
                                    <IconBack size={Size.iconSize} color={Colors.gray_10} />
                                </TouchableOpacity>
                                <Text style={[styleSheets.headerTitleStyle]}>
                                    {translate('HRM_AppPortal_CheckWifi')}
                                </Text>
                                <View style={styles.bntGoBackNone} />
                            </View>

                            <LottieView
                                style={styles.lottieViewNfcAnimation}
                                source={require('../../../../assets/images/animation/wifi_animation.json')}
                                autoPlay
                                loop
                            />

                            {/* eslint-disable-next-line react/no-string-refs */}

                            <TouchableOpacity
                                style={styles.viewWifi}
                                onPress={() => isActiveSettings && this.openSettings()}
                                disabled={!isActiveSettings}
                            >
                                <View style={[styles.viewWifiContent]}>
                                    {networkInfo.isCheckPassWifi && (
                                        <IconCheck color={Colors.green} size={Size.text + 2} />
                                    )}

                                    <Text
                                        style={[
                                            styleSheets.text,
                                            styles.textMessageError,
                                            {
                                                color: networkInfo.isCheckPassWifi ? Colors.green : Colors.red
                                            }
                                        ]}
                                        numberOfLines={2}
                                    >
                                        {textMessageError}
                                    </Text>
                                </View>
                                {networkInfo.isCheckPassWifi ? (
                                    <IconWifi color={Colors.gray_10} size={Size.text + 2} />
                                ) : (
                                    isActiveSettings && <IconSetting color={Colors.red} size={Size.text + 5} />
                                )}
                            </TouchableOpacity>
                        </View>

                        <View style={styles.viewForm}>
                            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                                <View style={styles.viewWecome}>
                                    {this.renderSessionText()}
                                    <View style={styles.viewTime}>
                                        <View style={styles.viewSessionTime}>
                                            <Time
                                                ref={(refs) => (this.refTime = refs)}
                                                isRefeshTime={isRefeshTime}
                                                key={'E_TIMEWORK'}
                                                format={'HH:mm'}
                                                style={styles.componentTime}
                                            />
                                        </View>
                                        <View style={styles.viewSession}></View>
                                    </View>

                                    <View style={styles.viewTime}>
                                        <Text style={[styleSheets.text, styles.txtTimeSession_info]}>
                                            {`${translate(
                                                `E_${moment().format('dddd')}`.toUpperCase()
                                            )}, ${moment().format('DD')} ${translate(
                                                `HRM_PortalApp_Month_${moment().format('M')}`
                                            )}`}
                                        </Text>
                                    </View>
                                </View>
                                <View style={styles.viewComment}>
                                    <View style={styles.viewComment_icon}>
                                        <IconEdit color={Colors.gray_10} size={Size.iconSize - 5} />
                                    </View>

                                    <VnrTextInput
                                        placeholder={translate('Hrm_Cat_TrainingPlace_Description')}
                                        style={[styleSheets.text, styles.commentTextInput]}
                                        onChangeText={(text) => this.setState({ Comment: text })}
                                        value={this.state.Comment}
                                        multiline={true}
                                    />
                                </View>

                                <View style={styles.viewDesTimeCheckin}>
                                    {checkIn.TimeLog != undefined && checkIn.TimeLog != null ? (
                                        <Text
                                            style={[
                                                styleSheets.textItalic,
                                                { color: Colors.gray_8, fontSize: Size.text - 2 }
                                            ]}
                                        >
                                            {translate('HRM_PortalApp_CheckInGPS_LastTime')}{' '}
                                            {`${moment(checkIn.TimeLog).format('HH:mm')} ${moment(
                                                checkIn.TimeLog
                                            ).format('DD/MM/YYYY')}`}
                                        </Text>
                                    ) : (
                                        checkOut.TimeLog != undefined &&
                                        checkOut.TimeLog != null && (
                                            <Text
                                                style={[
                                                    styleSheets.textItalic,
                                                    { color: Colors.gray_8, fontSize: Size.text - 2 }
                                                ]}
                                            >
                                                {translate('HRM_PortalApp_CheckOutGPS_LastTime')}{' '}
                                                {`${moment(checkOut.TimeLog).format('HH:mm')} ${moment(
                                                    checkOut.TimeLog
                                                ).format('DD/MM/YYYY')}`}
                                            </Text>
                                        )
                                    )}
                                </View>

                                {viewButtonPrimary}

                                <View style={styles.subMenu} />
                            </ScrollView>
                        </View>
                        <Modal
                            animationIn="fadeIn"
                            animationOut="fadeOut"
                            key={'@MODAL_CAMERA'}
                            visible={isvisibleModalCamara}
                            transparent={false}
                            onRequestClose={this.hideModalCamara}
                        >
                            {imageCamera != null && imageCamera.temp == true ? (
                                this.reviewCameraImage(imageCamera)
                            ) : (
                                <View
                                    style={{
                                        ...CustomStyleSheet.flex(1),
                                        ...CustomStyleSheet.backgroundColor(Colors.white)
                                    }}
                                >
                                    <RNCamera
                                        captureAudio={false}
                                        style={stylesCamera.preview}
                                        type={typeCamera ? RNCamera.Constants.Type.front : RNCamera.Constants.Type.back}
                                        // flashMode={typeCamera}
                                        androidCameraPermissionOptions={{
                                            title: 'Permission to use camera',
                                            message:
                                                'We would like to use your camera for taking pictures in the GPS timekeeping screen',
                                            buttonPositive: 'Ok',
                                            buttonNegative: 'Cancel'
                                        }}
                                        androidRecordAudioPermissionOptions={{
                                            title: 'Permission to use audio recording',
                                            message: 'We need your permission to use your audio',
                                            buttonPositive: 'Ok',
                                            buttonNegative: 'Cancel'
                                        }}
                                    >
                                        {({ camera, status }) => {
                                            if (status !== 'READY') {
                                                return <VnrLoading size="small" color={Colors.primary} />;
                                            } else {
                                                return (
                                                    <View style={stylesCamera.viewAll}>
                                                        <View style={stylesCamera.oval} />
                                                        <View style={stylesCamera.lisbntStyle}>
                                                            <TouchableOpacity
                                                                onPress={() => this.hideModalCamara(camera)}
                                                                style={stylesCamera.capture}
                                                            >
                                                                <IconCancel
                                                                    size={Size.iconSize + 13}
                                                                    color={Colors.black}
                                                                />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                onPress={() => this.takePicture(camera)}
                                                                style={stylesCamera.captureCamera}
                                                            >
                                                                <IconCamera
                                                                    size={Size.iconSize + 20}
                                                                    color={Colors.primary}
                                                                />
                                                            </TouchableOpacity>
                                                            <TouchableOpacity
                                                                onPress={() =>
                                                                    this.setState({
                                                                        typeCamera: !this.state.typeCamera
                                                                    })
                                                                }
                                                                style={stylesCamera.capture}
                                                            >
                                                                <IconRefresh
                                                                    size={Size.iconSize + 10}
                                                                    color={Colors.black}
                                                                />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                );
                                            }
                                        }}
                                    </RNCamera>
                                </View>
                            )}
                        </Modal>

                        <View>
                            {configLoadWorkPlace.visible && (
                                <View style={styles.positionTop999}>
                                    <VnrPicker
                                        autoShowModal={true}
                                        dataLocal={configLoadWorkPlace.data}
                                        titlePicker={'HRM_Category_WorkPlace_WorkPlaceName'}
                                        refresh={configLoadWorkPlace.refresh}
                                        textField="WorkPlaceName"
                                        valueField="ID"
                                        filter={false}
                                        value={configLoadWorkPlace.value}
                                        onFinish={(item) => this.onPickTypeLoadWorkPlace(item)}
                                    />
                                </View>
                            )}
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }
}

const stylesCamera = StyleSheet.create({
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    capture: {
        backgroundColor: Colors.white,
        borderRadius: 5,
        padding: 5,
        paddingHorizontal: 20,
        alignSelf: 'center',
        marginVertical: 20,
        height: 80,
        width: 80,
        borderColor: Colors.primary
    },
    captureCamera: {
        height: Size.deviceheight * 0.11,
        width: Size.deviceheight * 0.11,
        borderRadius: Size.deviceheight * 0.11 < 98.56 ? Size.deviceheight * 0.11 * 0.5 : 49.28,
        zIndex: 1,
        borderColor: Colors.primary,
        borderWidth: 5.5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    oval: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: Size.deviceWidth,
        flexDirection: 'row',
        backgroundColor: Colors.white,
        height: Size.deviceheight * 0.3,
        transform: [
            {
                scaleX: 1.6
            }
        ],
        borderTopStartRadius: Size.deviceWidth / 2,
        borderTopEndRadius: Size.deviceWidth / 2
    },
    viewAll: {
        width: Size.deviceWidth,
        alignItems: 'flex-start',
        height: Size.deviceheight * 0.3
    },
    viewAllreviewCamera: {
        position: 'absolute',
        bottom: 0,
        width: Size.deviceWidth,
        alignItems: 'flex-start',
        height: Size.deviceheight * 0.3
    },
    viewAllreviewImage: {
        position: 'absolute',
        width: '100%',
        height: '100%',
        bottom: Size.deviceheight * 0.3 - 40
    },
    lisbntStyle: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
        marginTop: 30
    }
});

const styles = StyleSheet.create({
    styContent: {
        flex: 1,
        alignItems: 'center',
        backgroundColor: Colors.white
    },
    ImageColection: {
        width: Size.iconSize,
        height: Size.iconSize
    },
    button_End: {
        width: '100%',
        height: 44,
        backgroundColor: Colors.orange,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 28,
        flexDirection: 'row'
    },
    button_End_Text: {
        color: Colors.white,
        // marginLeft: 7,
        fontWeight: '600',
        fontSize: Size.text + 2
    },
    viewButtonCheckInOut: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingHorizontal: Size.defineSpace
    },
    bntCheckOut: {
        backgroundColor: Colors.orange,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        height: Size.deviceWidth * 0.26,
        width: Size.deviceWidth * 0.26,
        maxWidth: 134,
        maxHeight: 134
    },
    bntCheckIn: {
        backgroundColor: Colors.primary,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        height: Size.deviceWidth * 0.26,
        width: Size.deviceWidth * 0.26,
        maxWidth: 134,
        maxHeight: 134
    },
    bntCheckDisable: {
        backgroundColor: Colors.gray_5
    },
    viewWecome: {
        alignItems: 'flex-start',
        marginBottom: 15
    },
    txtWecome: {
        color: Colors.gray_7,
        fontSize: Size.text + 10,
        paddingBottom: 0,
        marginBottom: -5
    },
    viewButton: {
        height: Size.deviceheight * 0.15,
        width: '100%',
        maxHeight: 135,
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    viewButton_circle: {
        height: Size.deviceWidth * 0.28,
        width: Size.deviceWidth * 0.28,
        maxWidth: 135,
        maxHeight: 135,
        borderRadius: (Size.deviceWidth * 0.28) / 2,
        zIndex: 1,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bntGoBack: {
        width: 35,
        height: 35,
        borderRadius: 8,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bntGoBackNone: {
        width: 35,
        height: 35
    },
    viewTime: {
        flexDirection: 'row',
        alignItems: 'flex-end'
    },
    viewComment: {
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        borderRadius: 10,
        paddingHorizontal: 10,
        paddingVertical: 10,
        flexDirection: 'row',
        marginBottom: Size.defineSpace
    },
    viewDesTimeCheckin: {
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'center',
        marginBottom: Size.defineSpace
    },
    viewComment_icon: {
        marginRight: 5,
        justifyContent: 'center'
    },
    commentTextInput: {
        minHeight: 30
    },
    viewMap: {
        backgroundColor: Colors.gray_3,
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    styViewGoback: {
        width: Size.deviceWidth,
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',
        paddingHorizontal: Size.defineSpace,
        marginBottom: Size.defineSpace,
        marginVertical: 5
    },
    viewWifi: {
        flexDirection: 'row',

        backgroundColor: Colors.white,
        paddingHorizontal: Size.defineHalfSpace,
        paddingVertical: Size.defineHalfSpace,
        marginHorizontal: Size.defineSpace,
        marginBottom: Size.defineSpace,

        borderRadius: 4
    },
    viewWifiContent: {
        flex: 1,
        flexDirection: 'row',
        marginRight: Size.defineSpace
    },
    viewForm: {
        flex: 6.2,
        backgroundColor: Colors.white,
        flexDirection: 'column',
        paddingVertical: styleSheets.p_10,
        width: Size.deviceWidth,
        maxWidth: 600,
        paddingHorizontal: 32
    },
    viewSessionTime: {
        justifyContent: 'flex-start',
        alignContent: 'flex-start',
        marginLeft: -2,
        paddingLeft: 0,
        marginVertical: -8
    },
    viewSession: {
        marginLeft: 7,
        alignItems: 'center'
    },
    txtTimeSession_info: {
        fontSize: Size.text + 7,
        fontWeight: '500'
    },
    subMenu: {
        marginTop: Size.deviceheight >= 1024 ? 70 : 30,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end'
    },
    lottieViewNfcAnimation: {
        width: Size.deviceWidth * 0.57,
        maxWidth: 350,
        aspectRatio: 1.5,
        marginBottom: Size.defineHalfSpace
    },
    componentTime: {
        fontSize: Size.deviceWidth <= 350 ? Size.text + 30 : Size.text + 35,
        paddingBottom: 0,
        fontWeight: '500'
    },
    textMessageError: {
        fontSize: Size.text,
        textAlign: 'center',
        marginLeft: 5,
        marginTop: -1
    },
    positionTop999: {
        position: 'absolute',
        top: -999
    }
});

const mapStateToProps = (state) => {
    return {
        detailsNetwork: state.network.detailsNetwork,
        isConnected: state.network.isConnected,
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(mapStateToProps, null)(AttTSLCheckInOutWifi);
