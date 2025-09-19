import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import ImagePicker from 'react-native-image-picker';
import ViewShot from 'react-native-view-shot';
import moment from 'moment';
import { styleSheets, Size, Colors, CustomStyleSheet } from '../../../../constants/styleConfig';
import VnrText from '../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../components/VnrTextInput/VnrTextInput';
import {
    IconBack,
    IconEdit,
    IconFinger
} from '../../../../constants/Icons';
import Time from './Time';
import HttpFactory from '../../../../factories/HttpFactory';
import HttpService from '../../../../utils/HttpService';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import Vnr_Function from '../../../../utils/Vnr_Function';
import { translate } from '../../../../i18n/translate';
import { VnrLoadingSevices } from '../../../../components/VnrLoading/VnrLoadingPages';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ToasterSevice } from '../../../../components/Toaster/Toaster';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AlertSevice } from '../../../../components/Alert/Alert';
import { EnumIcon, EnumName, EnumTask } from '../../../../assets/constant';
import { connect } from 'react-redux';
import { startTask } from '../../../../factories/BackGroundTask';
import { getDataLocal, saveDataLocal } from '../../../../factories/LocalData';
import LottieView from 'lottie-react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';
import { Platform } from 'react-native';
import Modal from 'react-native-modal';
import DeviceInfo from 'react-native-device-info';
import DrawerServices from '../../../../utils/DrawerServices';

class AttTSLCheckInOutNFC extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isSupported: true,
            keyQuery: null,
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
            networkInfo: props.detailsNetwork,
            // appState: AppState.currentState,

            modalVisibleScanned: false
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

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            this.initState();
        });
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
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
        ImagePicker.launchCamera(options, response => {
            if (response.didCancel) {
                VnrLoadingSevices.hide();
            } else {
                const title = response.uri
                    .split('/')
                    .pop()
                    .split('#')[0]
                    .split('?')[0];
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

    takePhotoMap = () => {
        // eslint-disable-next-line react/no-string-refs
        this.refs.viewShot.capture().then(uri => {
            const title = uri
                .split('/')
                .pop()
                .split('#')[0]
                .split('?')[0];
            const ext = title.substring(title.indexOf('.') + 1, title.length);
            const file = {
                uri: uri,
                name: title,
                type: 'image/' + ext
            };
            this.setState({ imageMap: file });
        });
    };

    formatDateServer = () => {
        const apiFormatDate = {
            urlApi: '[URI_SYS]/Sys_GetData/GetFormatDate',
            type: 'E_POST',
            dataBody: {
                value: moment(new Date()).format('DD/MM/YYYY')
            }
        };
        return HttpFactory.getDataPicker(apiFormatDate);
    };

    checkSurveyWhenCheckingGPS = (ProfileID, TimeLog) => {
        const dataBody = {
            profileID: ProfileID,
            timeLog: TimeLog
        };
        HttpService.Post('[URI_HR]/Att_GetData/APISurveyWhenCheckingGPS', dataBody).then(resLink => {
            if (resLink && resLink !== '') {
                AlertSevice.alert({
                    iconType: EnumIcon.E_INFO,
                    title: 'Hrm_Notification',
                    message: 'HRM_Att_SurveyWhenCheckingGPS_Message',
                    textRightButton: 'HRM_Common_Continue',
                    textLeftButton: 'HRM_Common_Close',
                    onConfirm: () => {
                        Vnr_Function.openLink(resLink);
                    }
                });
            }
        });
    };

    checkCoodinateInListCatShop = () => {
        const { configConstraintDistanceWithRadious, latitude, longitude } = this.state,
            { listCatShop } = configConstraintDistanceWithRadious ? configConstraintDistanceWithRadious : {},
            geolocationInput = { latitude: latitude, longitude: longitude };
        if (Array.isArray(listCatShop) && listCatShop.length > 0) {
            let psssCheckPosition = false;
            let itemShopPasss = null;

            // eslint-disable-next-line no-unused-vars
            for (let item of listCatShop) {
                if (item.Coodinate && item.CoordinateDistance) {
                    let geolocationCenter = {
                        latitude: item.Coodinate.split(',')[0], //37.785834,
                        longitude: item.Coodinate.split(',')[1] //-122.406417
                    };
                    let radious = item.CoordinateDistance;
                    if (this.getDistanceWithingRadious(geolocationInput, geolocationCenter, radious)) {
                        psssCheckPosition = true;
                        itemShopPasss = item;
                        break;
                    }
                }
            }

            if (!psssCheckPosition) {
                return null;
            } else {
                return itemShopPasss;
            }
        }
    };

    requestData = (imageMap, typeData, distance = '') => {
        const {
                configConstraintWifi,
                configConstraintDistanceWithRadious,
                isAllowCheckInGPSLeavedayBusinessTrip,
                configLoadWorkPlace
            } = this.state,
            { isCheckingByCoordinates } = configConstraintDistanceWithRadious,
            { isCheckingByMACAdress } = configConstraintWifi;

        VnrLoadingSevices.show();

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

        const dataBody = {
            DivicesID: this.divicesID,
            ProfileID: dataVnrStorage.currentUser.info.ProfileID,
            UserSubmit: dataVnrStorage.currentUser.info.ProfileID,
            UserUpdate: dataVnrStorage.currentUser.info.ProfileID,
            Comment: this.state.Comment,
            IsPortal: true,
            Status: 'E_SUBMIT',
            Type: null,
            IsCheckGPS: true,
            MACAddress: isCheckingByMACAdress && this.isConfirmMACAdressNotMatch === false ? _bssid : null,
            IsScreenCheckInGPS: true, // chấm công giờ serverF
            IsAllowApprove: isApprove,
            TimeLogTime: moment(new Date()).format('HH:mm'),
            TimeLog: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            LocationAddress: `NFC|${DeviceInfo.getUniqueId()}`,
            Distance: distance,
            Coordinate: '',
            IsAllowCheckInGPSWhenLeavedayBusinessTrip: isAllowCheckInGPSLeavedayBusinessTrip,
            PlaceID: configLoadWorkPlace.value ? configLoadWorkPlace.value.ID : null
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
            HttpService.Post('[URI_HR]/Att_GetData/New_SaveTamScanLog', formData, configs).then(res => {
                if (!Vnr_Function.CheckIsNullOrEmpty(res) && res == 'Success') {
                    ToasterSevice.showSuccess('Hrm_Succeed');
                    this.reload(true);
                } else if (res && typeof res === 'string') {
                    if (res === 'WarningCheckInGPSInLeavedayBusinessTravel') {
                        //mở lại event
                        this.isProcessing = false;

                        AlertSevice.alert({
                            iconType: EnumIcon.E_WARNING,
                            title: 'E_WARNING',
                            message: 'WarningCheckInGPSInLeavedayBusinessTravel',
                            textRightButton: 'HRM_Common_Continue',
                            textLeftButton: 'HRM_Common_Close',
                            onConfirm: () => {
                                this.setState(
                                    {
                                        isAllowCheckInGPSLeavedayBusinessTrip: true
                                    },
                                    () => {
                                        this.requestData(imageMap, typeData, distance);
                                    }
                                );
                            }
                        });
                    } else if (res === 'OnlyAllowATTCheckInGPSForBizTrip') {
                        this.reload();
                        ToasterSevice.showWarning(res);
                    } else if (res === 'Hrm_Locked') {
                        ToasterSevice.showWarning('Hrm_Locked');
                    } else {
                        ToasterSevice.showWarning(res);
                    }
                } else {
                    ToasterSevice.showWarning('HRM_Common_SendRequest_Error');
                }
                //mở lại event
                this.isProcessing = false;
                this.isConfirmMACAdressNotMatch = false;
                this.isConfirmCoodinateNotMatch = false;
                VnrLoadingSevices.hide();
            });
        };

        // let messAlertSave = '',
        //   typeAppTransTitle = typeData === 'E_IN' ? 'HRM_Attendance_InTime' : 'HRM_Attendance_HoursTo',
        //   typeAppTransMess = typeData === 'E_IN' ? translate('E_IN') : translate('E_OUT');

        // if (dataVnrStorage.languageApp == 'VN') {
        //   messAlertSave = `Bạn có chắc xác nhận giờ ${typeAppTransMess.toLowerCase()} là ${dataBody.TimeLogTime} không?`;
        // }
        // else {
        //   messAlertSave = `Are you sure the ${typeAppTransMess.toLowerCase()} time is confirmed at ${dataBody.TimeLogTime}?`;
        // }

        // if (this.isConfirmSaveTamScanLog) {
        //   AlertSevice.alert({
        //     iconType: EnumIcon.E_INFO,
        //     title: typeAppTransTitle,
        //     message: messAlertSave,
        //     textLeftButton: 'HRM_Common_No_AVN',
        //     textRightButton: 'HRM_Common_Yes_AVN',
        //     onBackDrop: () => {
        //       VnrLoadingSevices.hide();
        //       this.reload();
        //     },
        //     onCancel: () => {
        //       VnrLoadingSevices.hide();
        //       this.reload();
        //     },
        //     onConfirm: callBackConfirmRequest,
        //   });
        // }
        // else {
        callBackConfirmRequest();
        // }
    };

    requestGetCoondinateInBeforce = () => {
        const dataBody = {
            ProfileID: dataVnrStorage.currentUser.info.ProfileID,
            Type: EnumName.E_IN,
            TimeLogTime: moment(new Date()).format('HH:mm')
        };
        return HttpService.Post('[URI_HR]//Att_GetData/GetCoondiNateInBefore', dataBody);
    };

    onConfirm = async () => {
        // chup anh map
        // eslint-disable-next-line react/no-string-refs
        if (!Vnr_Function.CheckIsNullOrEmpty(this.refs.viewShot)) {
            this.isProcessing = true;
            VnrLoadingSevices.show();
            // eslint-disable-next-line react/no-string-refs
            const uri = await this.refs.viewShot.capture();
            const title = uri
                .split('/')
                .pop()
                .split('#')[0]
                .split('?')[0];
            const ext = title.substring(title.indexOf('.') + 1, title.length);
            const file = {
                uri: uri,
                name: title,
                type: 'image/' + ext
            };

            this.requestData(file);
        }
    };

    goBack = () => {
        const { navigation } = this.props;
        navigation.navigate('Home');
    };

    // checkInFromNFC = (isFromTagNFC) => {
    //   if (isFromTagNFC == true) {
    //     //this.isConfirmSaveTamScanLog = false; //ko Bắt confirm khi Save Data
    //     this.checkConstraintPhotoSaveInOut()
    //   }
    // }

    reload = async (isReloadData, isFromTagNFC) => {
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

        getDataLocal(EnumTask.KT_AttTSLCheckInOutNFC)
            .then(async data => {
                try {
                    const resAll = data && data[EnumName.E_PRIMARY_DATA] ? data[EnumName.E_PRIMARY_DATA] : null;

                    if (resAll == null) {
                        return;
                    }

                    let {
                        checkIn,
                        checkOut,
                        // configConstraintInOut,
                        //configConstraintPhotoGrapCheck,
                        //configConstraintDistanceTwoPoint,
                        configConstraintWifi
                        //configConstraintDistanceWithRadious,
                        //configLoadWorkPlace
                    } = this.state;

                    const resWorkPlace = resAll[0];
                    let resDataInOut = resAll[1];

                    const isCheckingByMACAdress = true;

                    if (isReloadData) {
                        resDataInOut = await HttpService.Post('[URI_HR]/Por_GetData/Get_TAMScanLogOrderTimeLogDesc', {
                            ProfileID: dataVnrStorage.currentUser.info.ProfileID
                        });
                        resAll[1] = resDataInOut;
                        saveDataLocal(EnumTask.KT_AttTSLCheckInOutNFC, {
                            [EnumName.E_PRIMARY_DATA]: resAll
                        });
                    }

                    // kiểm tra cấu hình chấm công khoảng cách và MACID
                    if (isCheckingByMACAdress) {
                        // Check dữ liệu DS MAC
                        if (resWorkPlace.MACAddress) {
                            this.isConfirmMACAdressNotMatch = false;

                            configConstraintWifi = {
                                isCheckingByMACAdress: isCheckingByMACAdress,
                                macID: resWorkPlace.MACAddress,
                                configCheckInWifi: resWorkPlace.ConfigCheckInWifi
                                    ? resWorkPlace.ConfigCheckInWifi
                                    : null
                            };
                            // ,04:62:DC:5D:39:61:81,04:79:B2:7A:2C:59:81
                        } else {
                            this.isConfirmMACAdressNotMatch = false;
                            configConstraintWifi = {
                                isCheckingByMACAdress: isCheckingByMACAdress
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
                            // const now = moment(new Date()), //todays date
                            //   end = moment(res2.TimeLog), // time check in
                            //   duration = moment.duration(now.diff(end)),
                            //   { hours, minutes } = duration._data;

                            // numberHoursMinutes = moment.utc(duration.asMilliseconds()).format("HH:mm");
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
                                    //configConstraintInOut,
                                    //configConstraintPhotoGrapCheck,
                                    //configConstraintDistanceTwoPoint,
                                    configConstraintWifi,
                                    //configConstraintDistanceWithRadious,
                                    isloading: false,
                                    isAllowCheckInGPSLeavedayBusinessTrip: false
                                    //configLoadWorkPlace
                                },
                                () => {
                                    if (isFromTagNFC) this.checkConstraintPhotoSaveInOut();
                                }
                            );
                        } else {
                            checkIn.timeCheckIn = null;
                            checkIn.isCheck = false;
                            // checkOut.isCheck = true;
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
                                    //configConstraintInOut,
                                    //configConstraintPhotoGrapCheck,
                                    // configConstraintDistanceTwoPoint,
                                    configConstraintWifi,
                                    // configConstraintDistanceWithRadious,
                                    isloading: false,
                                    isAllowCheckInGPSLeavedayBusinessTrip: false
                                    //configLoadWorkPlace
                                },
                                () => {
                                    if (isFromTagNFC) this.checkConstraintPhotoSaveInOut();
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
                                //configConstraintInOut,
                                //configConstraintPhotoGrapCheck,
                                // configConstraintDistanceTwoPoint,
                                configConstraintWifi,
                                //configConstraintDistanceWithRadious,
                                isloading: false,
                                isAllowCheckInGPSLeavedayBusinessTrip: false
                                //configLoadWorkPlace
                            },
                            () => {
                                if (isFromTagNFC) this.checkConstraintPhotoSaveInOut();
                            }
                        );
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            })
            .catch(() => {

            });
    };

    UNSAFE_componentWillReceiveProps(nextProps) {

        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == EnumTask.KT_AttTSLCheckInOutNFC) {
            if (nextProps.message && keyQuery == nextProps.message.keyQuery && nextProps.message.dataChange) {
                this.reload();
            }
        }

        // if (!Vnr_Function.compare(nextProps.detailsNetwork, this.state.networkInfo)) {
        //   this.checkWifiAccpet(nextProps.detailsNetwork);
        // }
    }

    checkDeviceSupportedNFC = async () => {
        try {
            const deviceIsSupported = await NfcManager.isSupported();
            if (deviceIsSupported) {
                const isEnable = await NfcManager.isEnabled();
                if (!isEnable) {
                    AlertSevice.alert({
                        iconType: EnumIcon.E_WARNING,
                        message: 'Tính năng NFC chưa được kích hoạt trên thiết bị của bạn',
                        title: 'setting',
                        textRightButton: 'setting',
                        onCancel: () => {
                            VnrLoadingSevices.hide();
                        },
                        onConfirm: () => {
                            NfcManager.goToNfcSetting();
                        }
                    });
                } else {
                    // if (this.addListenerAppState == null)
                    //   this.addListenerAppState = AppState.addEventListener('change', this._handleAppStateChange);
                }
            } else {
                this.setState({
                    isSupported: false
                });
                //ToasterSevice.showWarning('Thiết bị của bạn không hỗ trợ NFC');
                //this.goBack();
            }
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    checkDeviceSupportedNFC = async () => {
        try {
            const deviceIsSupported = await NfcManager.isSupported();
            if (deviceIsSupported) {
                const isEnable = await NfcManager.isEnabled();
                if (!isEnable) {
                    AlertSevice.alert({
                        iconType: EnumIcon.E_WARNING,
                        message: 'Tính năng NFC chưa được kích hoạt trên thiết bị của bạn',
                        title: 'setting',
                        textRightButton: 'setting',
                        onCancel: () => {
                            VnrLoadingSevices.hide();
                        },
                        onConfirm: () => {
                            NfcManager.goToNfcSetting();
                        }
                    });
                } else {
                    // NfcManager.start();
                    // this.checkConstraintPhotoSaveInOut();
                }
            } else {
                this.setState({
                    isSupported: false
                });
                //ToasterSevice.showWarning('Thiết bị của bạn không hỗ trợ NFC');
                //this.goBack();
            }
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    initState = (isStartRequestServer = true) => {
        // alert('initState')
        this.checkDeviceSupportedNFC();
        // Mặc định vô màn hình
        this.reload(false, true);

        this.setState({ isloading: true, keyQuery: EnumName.E_PRIMARY_DATA }, () => {
            isStartRequestServer == true &&
                startTask({
                    keyTask: EnumTask.KT_AttTSLCheckInOutNFC,
                    payload: {
                        keyQuery: EnumName.E_PRIMARY_DATA,
                        isCompare: true
                    }
                });
        });
    };

    componentDidMount() {
        //this.initState();
    }

    // componentWillUnmount() {
    //   AppState.removeEventListener('change', this._handleAppStateChange);
    // }

    componentDidUpdate() {}

    hideModalCamara = () => {
        this.isConfirmMACAdressNotMatch = false;
        this.isConfirmCoodinateNotMatch = false;
        this.setState({
            isvisibleModalCamara: false
        });
    };

    compareBssid = (macID, bssid) => {
        const hexToString = hex => {
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

    checkWifiAccpet = detailsNetwork => {
        const { configConstraintWifi, networkInfo } = this.state,
            { macID, isCheckingByMACAdress } = configConstraintWifi ? configConstraintWifi : {};

        NetInfo.fetch('wifi').then(res => {
            const { bssid } = res.details;
            let isCheckPassWifi = false;
            if (isCheckingByMACAdress && bssid && macID) {
                if (Object.keys(networkInfo).length == 0) {
                    ToasterSevice.showError('HRM_Alert_Please_Check_NetWork');
                    return;
                }
                const resultCompare = this.handleCompareBssid(macID, bssid);

                if (resultCompare && resultCompare['actionStatus'] === true && resultCompare['macAddressEqua']) {
                    isCheckPassWifi = true;
                }
            }

            this.setState({
                networkInfo: {
                    ...(detailsNetwork ? detailsNetwork : this.props.detailsNetwork),
                    ...res.details,
                    isCheckPassWifi
                }
            });
        });
    };

    scanTag = async () => {
        await NfcManager.registerTagEvent();
    };

    cancelReadTag = async () => {
        await NfcManager.unregisterTagEvent();
    };

    checkConstraintPhotoSaveInOut = async () => {
        const { configConstraintWifi, networkInfo } = this.state,
            { macID, isCheckingByMACAdress, configCheckInWifi } = configConstraintWifi ? configConstraintWifi : {};


        let _bssid = '';

        NfcManager.start();

        Platform.OS == 'android' && this.setModalVisibleScanned(true);
        try {
            // register for the NFC tag with NDEF in it
            await NfcManager.requestTechnology(NfcTech.Ndef);
            // the resolved tag object will contain `ndefMessage` property
            const tag = await NfcManager.getTag();
            if (tag && tag.id) {
                let macaddress = tag.id.match(/.{1,2}/g).join(':');
                _bssid = macaddress;
            }
        } catch (ex) {
            //
        } finally {
            // stop the nfc scanning
            NfcManager.cancelTechnologyRequest();
            Platform.OS == 'android' && this.setModalVisibleScanned(false);
        }

        // kiem tra bien bssid

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
                    ToasterSevice.showError('Block_NotMatch_MAC_NFC');
                    return;
                } else {
                    AlertSevice.alert({
                        iconType: EnumIcon.E_WARNING,
                        title: 'E_WARNING',
                        message: 'Warning_NotMatch_MAC_NFC',
                        textRightButton: 'HRM_Common_Continue',
                        textLeftButton: 'HRM_Common_Close',
                        onCancel: () => {
                            this.reload();
                        },
                        onConfirm: () => {
                            this.isConfirmMACAdressNotMatch = true;
                        }
                    });
                    this.macAddressCheckPass = null;
                    return;
                }
            } else if (resultCompare && resultCompare['actionStatus'] === true && resultCompare['macAddressEqua']) {
                this.macAddressCheckPass = resultCompare['macAddressEqua'];
            }
        }
        this.onConfirm();
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

    renderModalContent = () => (
        <View style={styles.modalScanContent}>
            <VnrText style={styleSheets.lable} i18nKey={'HRM_PortalApp_CheckInOutNFC_Message'} />

            <LottieView
                style={styles.modalScanImage}
                source={require('../../../../assets/images/animation/nfc_animation_scan')}
                autoPlay
                loop
            />

            <TouchableOpacity style={styles.btnScanImage} onPress={() => this.setModalVisibleScanned(false)}>
                <VnrText style={[styleSheets.text, { color: Colors.greySecondary }]} i18nKey={'HRM_Common_Close'} />
            </TouchableOpacity>
        </View>
    );

    setModalVisibleScanned = isVisible => {
        this.setState({
            modalVisibleScanned: isVisible
        });
    };

    renderModalContent = () => (
        <View style={styles.modalScanContent}>
            <VnrText style={styleSheets.lable} i18nKey={'HRM_PortalApp_CheckInOutNFC_Message'} />

            <LottieView
                style={styles.modalScanImage}
                source={require('../../../../assets/images/animation/nfc_animation_scan')}
                autoPlay
                loop
            />

            <TouchableOpacity style={styles.btnScanImage} onPress={() => this.setModalVisibleScanned(false)}>
                <VnrText style={[styleSheets.text, { color: Colors.greySecondary }]} i18nKey={'HRM_Common_Close'} />
            </TouchableOpacity>
        </View>
    );

    setModalVisibleScanned = isVisible => {
        this.setState({
            modalVisibleScanned: isVisible
        });
    };

    render() {
        const {
            checkIn,
            checkOut,
            isloading,
            isSupported,
            modalVisibleScanned
        } = this.state;

        let viewButtonPrimary = (
            <View style={styles.viewButton}>
                <VnrLoading size={'large'} />
            </View>
        );

        // xử lý button chính
        if (!isloading) {
            viewButtonPrimary = (
                <View style={styles.viewButton}>
                    <TouchableOpacity
                        style={styles.viewButton_circle}
                        onPress={() => this.checkConstraintPhotoSaveInOut()}
                    >
                        <IconFinger
                            color={Colors.white}
                            size={Size.deviceheight >= 1024 ? 100 : Size.deviceWidth * 0.2}
                        />
                    </TouchableOpacity>
                </View>
            );
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
                                    {translate('HRM_AppPortal_CheckNFC')}
                                </Text>
                                <View style={styles.bntGoBackNone} />
                            </View>

                            <LottieView
                                style={styles.lottieViewNfcAnimation}
                                source={require('../../../../assets/images/animation/nfc_animation.json')}
                                autoPlay
                                loop
                            />

                            {/* eslint-disable-next-line react/no-string-refs */}
                            <ViewShot style={styles.viewWifi} ref="viewShot" options={{ format: 'jpg', quality: 0.1 }}>
                                <View style={styles.viewWifiContent}>
                                    <VnrText
                                        style={[
                                            styleSheets.text,
                                            styles.textNFC
                                        ]}
                                        i18nKey={
                                            isSupported
                                                ? 'HRM_PortalApp_CheckInOutNFC_Message'
                                                : 'HRM_PortalApp_NFC_notSupport'
                                        }
                                    />
                                </View>
                            </ViewShot>
                        </View>

                        {isSupported && (
                            <View style={styles.viewForm}>
                                <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                                    <View style={styles.viewWecome}>
                                        {this.renderSessionText()}
                                        <View style={styles.viewTime}>
                                            <View style={styles.viewSessionTime}>
                                                <Time
                                                    key={'E_TIMEWORK'}
                                                    format={'hh:mm'}
                                                    style={styles.componentTime}
                                                />
                                            </View>
                                            <View style={styles.viewSession}>
                                                {this.renderSessionImage()}
                                                <Text style={[styleSheets.text, styles.txtTimeSession]}>
                                                    {moment().format('A')}
                                                </Text>
                                            </View>
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
                                            onChangeText={text => this.setState({ Comment: text })}
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
                        )}

                        <Modal
                            isVisible={modalVisibleScanned}
                            onBackdropPress={() => this.setModalVisibleScanned(false)}
                            backdropOpacity={0.5}
                            animationIn="slideInUp"
                            animationOut="slideOutDown"
                            style={styles.modalScan}
                        >
                            {this.renderModalContent()}
                        </Modal>
                    </View>
                </KeyboardAwareScrollView>
            </SafeAreaView>
        );
    }
}

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
        flexDirection: 'row'
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
    txtTimeSession: {
        fontSize: Size.text + 10,
        fontWeight: '400'
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

    modalScan: {
        width: Size.deviceWidth - Size.defineSpace * 4,
        margin: Size.defineSpace * 2,
        justifyContent: 'flex-end'
    },
    modalScanContent: {
        height: '40%',
        backgroundColor: Colors.white,
        padding: Size.defineSpace,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 20
    },
    modalScanImage: {
        flex: 1,
        width: Size.deviceWidth * 0.57,
        maxWidth: 350,
        aspectRatio: 1.5,
        marginBottom: Size.defineHalfSpace,
        justifyContent: 'center',
        alignItems: 'center'
    },
    btnScanImage: {
        width: '100%',
        height: 50,
        borderRadius: 10,
        backgroundColor: Colors.gray_4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    lottieViewNfcAnimation: {
        width: Size.deviceWidth * 0.57,
        maxWidth: 350,
        aspectRatio: 1.5,
        marginBottom: Size.defineHalfSpace
    },
    textNFC: { textAlign: 'center', marginLeft: 5, marginTop: -1 },
    componentTime: {
        fontSize:
            Size.deviceWidth <= 350 ? Size.text + 30 : Size.text + 35,
        paddingBottom: 0,
        fontWeight: '500'
    }
});

const mapStateToProps = state => {
    return {
        detailsNetwork: state.network.detailsNetwork,
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(
    mapStateToProps,
    null
)(AttTSLCheckInOutNFC);
