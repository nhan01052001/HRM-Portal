/* eslint-disable react/no-string-refs */
import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    // eslint-disable-next-line react-native/split-platform-components
    PermissionsAndroid,
    ScrollView,
    Image,
    Modal,
    Linking,
    Platform,
    AppState
} from 'react-native';
// import { AppState } from 'react-native';
import NetInfo from '@react-native-community/netinfo';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import ImagePicker from 'react-native-image-picker';
import ViewShot from 'react-native-view-shot';
import moment from 'moment';
// import Modal from 'react-native-modal';
import { styleSheets, Size, Colors, CustomStyleSheet } from '../../../../constants/styleConfig';
import VnrText from '../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../components/VnrTextInput/VnrTextInput';
import {
    IconBack,
    IconCamera,
    IconRefresh,
    IconTime,
    IconLocation,
    IconBackRadious,
    IconMap,
    IconEdit,
    IconFinger,
    IconCancel,
    IconCheck
} from '../../../../constants/Icons';
import Time from './Time';
import TimeWork from './TimeWork';
import HttpFactory from '../../../../factories/HttpFactory';
import HttpService from '../../../../utils/HttpService';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import MapViewComponent from '../../../../components/ViewMap/Map';
import Vnr_Function from '../../../../utils/Vnr_Function';
import { RNCamera } from 'react-native-camera';
import { translate } from '../../../../i18n/translate';
import { VnrLoadingSevices } from '../../../../components/VnrLoading/VnrLoadingPages';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ToasterSevice } from '../../../../components/Toaster/Toaster';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import { SafeAreaView } from 'react-navigation';
import { AlertSevice } from '../../../../components/Alert/Alert';
import { EnumIcon, EnumName, EnumTask } from '../../../../assets/constant';
import { connect } from 'react-redux';
import { isPointWithinRadius, getDistance } from 'geolib';
import DrawerServices from '../../../../utils/DrawerServices';
import { startTask } from '../../../../factories/BackGroundTask';
import { getDataLocal } from '../../../../factories/LocalData';
import AndroidOpenSettings from 'react-native-android-open-settings';
import VnrPicker from '../../../../components/VnrPicker/VnrPicker';
// import NfcManager, { NfcTech } from 'react-native-nfc-manager';

class CheckinNFCTest extends Component {
    constructor(props) {
        super(props);

        this.state = {
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
            configConstraintInOut: true,
            configConstraintDistanceTwoPoint: false,
            configConstraintPhotoGrapCheck: 'E_DEFAULT',
            configConstraintWifi: {
                isCheckingByMACAdress: false,
                configCheckInWifi: null
                // isConfirmMACAdressNotMatch: false,
            },
            configConstraintDistanceWithRadious: {
                isCheckingByCoordinates: false,
                listCatCoodinate: null,
                configCheckInCoondinate: null,
                listCoordinatesView: null
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
            appState: AppState.currentState
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
    }

    // watchID: ?number = null;

    requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            // eslint-disable-next-line no-console
            console.warn(err);
        }
    };

    checkPlatformCallRequestLocation = async () => {
        if (Platform.OS == 'android') {
            const Permission = await this.requestLocationPermission();
            if (Permission == true) {
                if (!this.addListenerAppState) {
                    this.addListenerAppState = AppState.addEventListener('change', this._handleAppStateChange);
                }
                this.getLocation();
            } else {
                this.setState({ address: 'PERMISSION_DENIED' });
                this.alertContrainPermission();
            }
        } else {
            Geolocation.requestAuthorization();
            if (!this.addListenerAppState) {
                this.addListenerAppState = AppState.addEventListener('change', this._handleAppStateChange);
            }
            this.getLocation();
        }
    };

    getAddressFromCoordinate = async (_latitude, _longitude) => {
        Geocoder.fallbackToGoogle('AIzaSyCpdZF84dl65Ok8VnsIPXKQXD5_41z2a4g');
        var NY = {
            lat: _latitude,
            lng: _longitude
        };
        return Geocoder.geocodePosition(NY);
    };

    alertContrainPermission = () => {
        AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            message: 'HRM_PortalApp_Allow_Permission_GPS',
            title: 'setting',
            textRightButton: 'setting',
            onCancel: () => {
                VnrLoadingSevices.hide();
            },
            onConfirm: () => {
                Platform.OS === 'ios' ? Vnr_Function.openLink('app-settings:') : Linking.openSettings();
            }
        });
    };

    alertContrainPermissionGpsService = () => {
        AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            message: 'PERMISSION_DENIED_GPS',
            textRightButton: 'setting',
            title: 'setting',
            onCancel: () => {
                VnrLoadingSevices.hide();
            },
            onConfirm: () => {
                Platform.OS === 'ios'
                    ? DrawerServices.navigate(
                        dataVnrStorage.languageApp === 'VN' ? 'TutorialGPSiOS' : 'TutorialGPSiOSEn'
                    )
                    : AndroidOpenSettings.locationSourceSettings();
            }
        });
    };

    getAddressFromWorkPlace = (latitude, longitude, networkInfo) => {
        const { configConstraintDistanceWithRadious } = this.state;

        let geolocationInput = { latitude: latitude, longitude: longitude },
            configLoadWorkPlace = configConstraintDistanceWithRadious.listCatCoodinate;

        if (configLoadWorkPlace !== null && Array.isArray(configLoadWorkPlace)) {
            let subjectPosition = [];

            configLoadWorkPlace.forEach((item) => {
                if (item.Coodinate && item.CoordinateDistance) {
                    let geolocationCenter = {
                            latitude: parseFloat(item.Coodinate.replace(' ', '').split(',')[0]),
                            longitude: parseFloat(item.Coodinate.replace(' ', '').split(',')[1])
                        },
                        radious = item.CoordinateDistance;
                    if (this.getDistanceWithingRadious(geolocationInput, geolocationCenter, radious)) {
                        subjectPosition.push(item);
                    }
                }
            });

            if (subjectPosition.length > 1) {
                let minDistance = null,
                    indexDistance = null;

                subjectPosition.forEach((item, index) => {
                    let geolocationCenter = {
                        latitude: parseFloat(item.Coodinate.replace(' ', '').split(',')[0]), //37.785834,
                        longitude: parseFloat(item.Coodinate.replace(' ', '').split(',')[1]) //-122.406417
                    };

                    let calcDistance = getDistance(geolocationInput, geolocationCenter);

                    if (minDistance == null && indexDistance == null) {
                        minDistance = calcDistance;
                        indexDistance = index;
                    } else if (minDistance != null && calcDistance < minDistance) {
                        minDistance = calcDistance;
                        indexDistance = index;
                    }
                });
                subjectPosition = [subjectPosition[indexDistance]];
            }

            if (subjectPosition.length > 0) {
                this.setState({
                    latitude,
                    longitude,
                    address: subjectPosition[0]['Address'],
                    networkInfo: networkInfo,
                    isloading: false
                });
            } else {
                this.getAddressFromCoordinate(latitude, longitude).then((res) => {
                    this.setState({
                        latitude,
                        longitude,
                        address: res[0].formattedAddress,
                        networkInfo: networkInfo,
                        isloading: false
                    });
                });
            }
        }
    };

    getLocation = async () => {
        Geolocation.getCurrentPosition(
            async (position) => {
                let { latitude, longitude, networkInfo } = this.state;
                latitude = position.coords.latitude;
                longitude = position.coords.longitude;

                let infoWifi = await NetInfo.fetch('wifi');
                networkInfo = infoWifi ? infoWifi.details : {};

                this.getAddressFromCoordinate(latitude, longitude).then((res) => {
                    this.setState({
                        latitude,
                        longitude,
                        address: res[0].formattedAddress,
                        networkInfo
                    });
                });

                if (this.watchID === null) {
                    this.watchID = Geolocation.watchPosition((position) => {
                        let { latitude, longitude } = this.state;
                        //console.log(position,'position watchID')
                        latitude = position.coords.latitude;
                        longitude = position.coords.longitude;
                        this.getAddressFromCoordinate(latitude, longitude).then((res) => {
                            this.setState({ latitude, longitude, address: res[0].formattedAddress });
                        });
                    });
                }
            },
            (error) => {
                if (error && error.code === 1) {
                    this.alertContrainPermission();
                } else if (error && error.code === 2) {
                    this.alertContrainPermissionGpsService();
                }
                this.setState({ address: 'PERMISSION_DENIED' });
            },
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 10000 }
        );

        // if(this.watchID === null){
        //   this.watchID = Geolocation.watchPosition(position => {
        //     console.log('this.watchID','position')
        //     let { latitude, longitude } = this.state;
        //     //console.log(position,'position watchID')
        //     latitude = position.coords.latitude;
        //     longitude = position.coords.longitude;
        //     this.getAddressFromCoordinate(latitude, longitude).then(res => {
        //       this.setState({ latitude, longitude, address: res[0].formattedAddress });
        //     });
        //   });
        // }
    };

    request = (object) => {
        const { origins, destination, mode } = object;

        return `https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origins}&destinations=${destination}&mode=${mode}&key=AIzaSyBTYqg2O9nKdq4aT3mC1ZaxiE54bOKWKRA`;
    };

    getDistancePlacesId = () => {
        const { origins, destination } = this.state;
        if (origins != null && destination != null) {
            const request = this.request({
                origins: `place_id:${origins.placeID}`, //10.817442, 106.685132
                destination: `place_id:${destination.placeID}`,
                mode: 'driving'
            });
            fetch(request)
                .then((response) => response.json())
                .then(() => {});
        }
    };

    getDistanceCoordinate = (_origins, _destination) => {
        if (_origins != null && _destination != null) {
            const request = this.request({
                origins: _origins, //'10.825910,106.680568',
                destination: _destination,
                mode: 'driving'
            });
            return HttpService.Get(request);
        }
    };

    getDistanceWithingRadious = (GeolocationInput, GeolocationCenter, radious) => {
        // checks if GeolocationInput is within a radius of 5 km from GeolocationCenter
        const pointWithinRadius = isPointWithinRadius(GeolocationInput, GeolocationCenter, radious);
        return pointWithinRadius;
    };

    // openSearchPlacesOrigins() {
    //   RNGooglePlaces.openAutocompleteModal()
    //     .then((place) => {
    //       this.setState({ origins: place }, this.getDistancePlacesId);
    //       console.log(place);
    //     })
    //     .catch(error => console.log(error.message));  // error is a Javascript Error object
    // }
    // openSearchPlacesDestination() {
    //   RNGooglePlaces.openAutocompleteModal()
    //     .then((place) => {
    //       this.setState({ destination: place }, this.getDistancePlacesId);
    //       console.log(place)
    //     })
    //     .catch(error => console.log(error.message));  // error is a Javascript Error object
    // }

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

    takePhotoMap = () => {
        this.refs.viewShot.capture().then((uri) => {
            const title = uri.split('/').pop().split('#')[0].split('?')[0];
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
        HttpService.Post('[URI_HR]/Att_GetData/APISurveyWhenCheckingGPS', dataBody).then((resLink) => {
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

    requestData = (imageMap, typeData, distance = '') => {
        const {
                imageCamera,
                address,
                latitude,
                longitude,
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

        let handleAddress = this.handleAddress(latitude, longitude, address);

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
            ProfileID: dataVnrStorage.currentUser.info.ProfileID,
            UserSubmit: dataVnrStorage.currentUser.info.ProfileID,
            UserUpdate: dataVnrStorage.currentUser.info.ProfileID,
            Comment: this.state.Comment,
            IsPortal: true,
            Status: 'E_SUBMIT',
            Type: typeData,
            IsCheckGPS: true,
            MACAddress: isCheckingByMACAdress && this.isConfirmMACAdressNotMatch === false ? _bssid : null,
            IsScreenCheckInGPS: true, // chấm công giờ server
            IsAllowApprove: isApprove,
            TimeLogTime: moment(new Date()).format('HH:mm'),
            TimeLog: moment(new Date()).format('YYYY-MM-DD HH:mm:ss'),
            LocationAddress: handleAddress,
            Distance: distance,
            Coordinate: latitude && longitude ? `${latitude}|${longitude}` : '',
            IsAllowCheckInGPSWhenLeavedayBusinessTrip: isAllowCheckInGPSLeavedayBusinessTrip,
            PlaceID: configLoadWorkPlace.value ? configLoadWorkPlace.value.ID : null
        };

        let formData = new FormData();
        formData.append('LocationImage', imageMap);
        formData.append('ImageCheckIn', imageCamera);
        formData.append('AttTamScanModel', JSON.stringify(dataBody));

        const configs = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        };

        const callBackConfirmRequest = () => {
            this.isConfirmSaveTamScanLog = false; // Đã confirm Save , case cảnh báo đi công tác không confirm cho lần kế tiếp
            HttpService.Post('[URI_HR]/Att_GetData/New_SaveTamScanLog', formData, configs).then((res) => {
                if (!Vnr_Function.CheckIsNullOrEmpty(res) && res == 'Success') {
                    // task 143871
                    if (typeData == EnumName.E_OUT)
                        this.checkSurveyWhenCheckingGPS(dataBody.ProfileID, dataBody.TimeLog);

                    ToasterSevice.showSuccess('Hrm_Succeed');
                    this.reload();
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
        //     typeAppTransTitle = typeData === 'E_IN' ? 'HRM_Attendance_InTime' : 'HRM_Attendance_HoursTo',
        //     typeAppTransMess = typeData === 'E_IN' ? translate('E_IN') : translate('E_OUT');

        // if (dataVnrStorage.languageApp == 'VN') {
        //     messAlertSave = `Bạn có chắc xác nhận giờ ${typeAppTransMess.toLowerCase()} là ${
        //         dataBody.TimeLogTime
        //     } không?`;
        // } else {
        //     messAlertSave = `Are you sure the ${typeAppTransMess.toLowerCase()} time is confirmed at ${
        //         dataBody.TimeLogTime
        //     }?`;
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
        //}
    };

    handleAddress = (latitude, longitude, formattedAddress) => {
        const { configConstraintDistanceWithRadious } = this.state;

        let geolocationInput = { latitude: latitude, longitude: longitude },
            configLoadWorkPlace = configConstraintDistanceWithRadious.listCatCoodinate;

        if (configLoadWorkPlace !== null && Array.isArray(configLoadWorkPlace)) {
            let subjectPosition = [];

            configLoadWorkPlace.forEach((item) => {
                let _Coodinate = item.Coodinate ? item.Coodinate.replace(' ', '').split(',') : null;
                if (_Coodinate && _Coodinate.length > 0 && item.CoordinateDistance) {
                    let geolocationCenter = {
                            latitude: parseFloat(_Coodinate[0]),
                            longitude: parseFloat(_Coodinate[1])
                        },
                        radious = item.CoordinateDistance;
                    if (this.getDistanceWithingRadious(geolocationInput, geolocationCenter, radious)) {
                        subjectPosition.push(item);
                    }
                }
            });

            if (subjectPosition.length > 1) {
                let minDistance = null,
                    indexDistance = null;

                subjectPosition.forEach((item, index) => {
                    let _Coodinate = item.Coodinate ? item.Coodinate.replace(' ', '').split(',') : null;
                    if (_Coodinate && _Coodinate.length > 0) {
                        let geolocationCenter = {
                            latitude: parseFloat(_Coodinate[0]), //37.785834,
                            longitude: parseFloat(_Coodinate[1]) //-122.406417
                        };

                        let calcDistance = getDistance(geolocationInput, geolocationCenter);

                        if (minDistance == null && indexDistance == null) {
                            minDistance = calcDistance;
                            indexDistance = index;
                        } else if (minDistance != null && calcDistance < minDistance) {
                            minDistance = calcDistance;
                            indexDistance = index;
                        }
                    }
                });

                subjectPosition = [subjectPosition[indexDistance]];
            }

            if (subjectPosition.length > 0) {
                VnrLoadingSevices.hide();
                return subjectPosition[0]['Address'];
            } else {
                VnrLoadingSevices.hide();
                return formattedAddress;
            }
        } else {
            VnrLoadingSevices.hide();
            return formattedAddress;
        }
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
        // chup anh map
        const { latitude, longitude, configConstraintDistanceTwoPoint } = this.state;
        if (!Vnr_Function.CheckIsNullOrEmpty(this.refs.viewShot)) {
            this.isProcessing = true;
            VnrLoadingSevices.show();
            const uri = await this.refs.viewShot.capture();
            const title = uri.split('/').pop().split('#')[0].split('?')[0];
            const ext = title.substring(title.indexOf('.') + 1, title.length);
            const file = {
                uri: uri,
                name: title,
                type: 'image/' + ext
            };

            // co cau hinh tinhs khoanr cach giua 2 lan check in
            if (configConstraintDistanceTwoPoint && typeData === EnumName.E_IN) {
                const dataOrigin = await this.requestGetCoondinateInBeforce();

                // lay vi tri checkin gan nhat
                const origin = dataOrigin ? `${dataOrigin.split('|')[0]},${dataOrigin.split('|')[1]}` : '';
                // lay vi tri hien tai
                const destination = `${latitude},${longitude}`;
                // tinh khoan cach
                const dataDistance = origin
                    ? await this.getDistanceCoordinate(origin.split('|')[0], destination)
                    : null;
                if (
                    dataDistance &&
                    dataDistance.rows[0] &&
                    dataDistance.rows[0].elements &&
                    dataDistance.rows[0].elements[0] &&
                    dataDistance.rows[0].elements[0].distance
                ) {
                    const distance = dataDistance.rows[0].elements[0].distance.text;
                    this.requestData(file, typeData, distance);
                } else {
                    this.requestData(file, typeData);
                }
                // 37.785856, -122.406456mmm37.785834,-122.406417
                VnrLoadingSevices.hide();
            } else {
                this.requestData(file, typeData);
            }
        }
    };

    goBack = () => {
        const { navigation } = this.props;
        navigation.navigate('Home');
    };

    reload = async () => {
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

        getDataLocal(EnumTask.KT_AttCheckInGPS)
            .then(
                // async
                (data) => {
                    try {
                        const resAll = data && data[EnumName.E_PRIMARY_DATA] ? data[EnumName.E_PRIMARY_DATA] : null;
                        if (resAll == null) {
                            return;
                        }
                        let {
                            checkIn,
                            checkOut,
                            configConstraintInOut,
                            configConstraintPhotoGrapCheck,
                            configConstraintDistanceTwoPoint,
                            configConstraintWifi,
                            configConstraintDistanceWithRadious,
                            configLoadWorkPlace
                        } = this.state;

                        const res1 = resAll[0],
                            resWorkPlace = resAll[1],
                            res3 = resAll[2],
                            res4 = resAll[3],
                            resCheckingByCoordinates = resAll[4],
                            resCheckingByMAC = resAll[5];

                        const isCheckingByCoordinates =
                            resCheckingByCoordinates &&
                            (resCheckingByCoordinates == 'True' ||
                                resCheckingByCoordinates == 'true' ||
                                resCheckingByCoordinates == true);

                        const isCheckingByMACAdress =
                            resCheckingByMAC &&
                            (resCheckingByMAC == 'True' || resCheckingByMAC == 'true' || resCheckingByMAC == true);

                        //const resDataInOut = await
                        HttpService.Post('[URI_HR]/Por_GetData/Get_TAMScanLogOrderTimeLogDesc', {
                            ProfileID: dataVnrStorage.currentUser.info.ProfileID
                        }).then(async (resDataInOut) => {
                            // kiem tra cau hinh cap inout
                            if (
                                res1 &&
                                res1.Value1 &&
                                (res1.Value1 == 'True' || res3 == 'true' || res1.Value1 == true)
                            ) {
                                configConstraintInOut = true;
                            } else {
                                configConstraintInOut = false;
                            }

                            //kiem tra cau hinh rang buoc chup anh
                            if (res3) {
                                configConstraintPhotoGrapCheck = res3;
                            }

                            // kiem tra cau hinh tinh khoang duong di
                            if (res4 && (res4 == 'True' || res4 == 'true' || res4 == true)) {
                                configConstraintDistanceTwoPoint = true;
                            }

                            // kiểm tra cấu hình chấm công khoảng cách và MACID

                            if (isCheckingByCoordinates) {
                                // check dữ liệu Tọa độ
                                this.isConfirmCoodinateNotMatch = false;
                                configConstraintDistanceWithRadious = {
                                    isCheckingByCoordinates: isCheckingByCoordinates,
                                    listCatCoodinate: resWorkPlace.ListCatCoodinate,
                                    listCoordinatesView:
                                        resWorkPlace.ListCoordinatesView &&
                                        Array.isArray(resWorkPlace.ListCoordinatesView) &&
                                        resWorkPlace.ListCoordinatesView.length > 0
                                            ? resWorkPlace.ListCoordinatesView
                                            : null,
                                    configCheckInCoondinate: resWorkPlace.ConfigCheckInCoondinate
                                        ? resWorkPlace.ConfigCheckInCoondinate
                                        : null
                                };
                            } else if (isCheckingByMACAdress) {
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
                                } else {
                                    this.isConfirmMACAdressNotMatch = false;
                                    configConstraintWifi = {
                                        isCheckingByMACAdress: isCheckingByMACAdress
                                    };
                                }
                            }

                            // check có DS Nơi làm việc hay không
                            if (resWorkPlace && resWorkPlace.ListCatWorkPlace) {
                                configLoadWorkPlace = {
                                    ...configLoadWorkPlace,
                                    data: resWorkPlace.ListCatWorkPlace,
                                    value: null,
                                    refresh: !configLoadWorkPlace.refresh
                                };
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
                                            configConstraintInOut,
                                            configConstraintPhotoGrapCheck,
                                            configConstraintDistanceTwoPoint,
                                            configConstraintWifi,
                                            configConstraintDistanceWithRadious,
                                            isloading: false,
                                            isAllowCheckInGPSLeavedayBusinessTrip: false,
                                            configLoadWorkPlace
                                        },
                                        () => {
                                            this.checkPlatformCallRequestLocation();
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
                                            configConstraintInOut,
                                            configConstraintPhotoGrapCheck,
                                            configConstraintDistanceTwoPoint,
                                            configConstraintWifi,
                                            configConstraintDistanceWithRadious,
                                            isloading: false,
                                            isAllowCheckInGPSLeavedayBusinessTrip: false,
                                            configLoadWorkPlace
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
                                        configConstraintInOut,
                                        configConstraintPhotoGrapCheck,
                                        configConstraintDistanceTwoPoint,
                                        configConstraintWifi,
                                        configConstraintDistanceWithRadious,
                                        isloading: false,
                                        isAllowCheckInGPSLeavedayBusinessTrip: false,
                                        configLoadWorkPlace
                                    },
                                    () => {
                                        this.checkPlatformCallRequestLocation();
                                    }
                                );
                            }
                        });
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                }
            )
            .catch((error) => {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            });
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == EnumTask.KT_AttCheckInGPS) {
            if (nextProps.message && keyQuery == nextProps.message.keyQuery && nextProps.message.dataChange) {
                this.reload();
            }
        }

        if (!Vnr_Function.compare(nextProps.detailsNetwork, this.state.networkInfo)) {
            this.setState({
                networkInfo: nextProps.detailsNetwork
            });
        }
    }

    _handleAppStateChange = async (nextAppState) => {
        // console.log(nextAppState, 'nextAppState')
        if (nextAppState === 'active') {
            this.initState(false);
        }
    };

    initState = (isStartRequestServer = true) => {
        this.checkPlatformCallRequestLocation();
        this.reload();

        this.setState({ isloading: true, keyQuery: EnumName.E_PRIMARY_DATA }, () => {
            isStartRequestServer == true &&
                startTask({
                    keyTask: EnumTask.KT_AttCheckInGPS,
                    payload: {
                        keyQuery: EnumName.E_PRIMARY_DATA,
                        isCompare: true
                    }
                });
        });
    };

    componentDidMount() {
        this.initState();
    }

    componentWillUnmount() {
        this.watchID != null && Geolocation.clearWatch(this.watchID);

        AppState.removeEventListener('change', this._handleAppStateChange);
    }

    componentDidUpdate() {}

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

    checkConstraintPhotoSaveInOut = async (typeRequest) => {
        const {
                configConstraintDistanceWithRadious,
                configConstraintWifi,
                configLoadWorkPlace,
                latitude,
                longitude,
                address,
                networkInfo
            } = this.state,
            { listCatCoodinate, configCheckInCoondinate, isCheckingByCoordinates } = configConstraintDistanceWithRadious
                ? configConstraintDistanceWithRadious
                : {},
            geolocationInput = { latitude: latitude, longitude: longitude },
            //geolocationInput = { latitude: 10.825782, longitude: 106.680575 },
            { macID, isCheckingByMACAdress, configCheckInWifi } = configConstraintWifi ? configConstraintWifi : {};

        // kiem tra bien bssid
        let _bssid = '';
        // if (networkInfo.bssid && typeof networkInfo.bssid == 'string') {
        //   _bssid = networkInfo.bssid;
        // }

        // try {
        //   // register for the NFC tag with NDEF in it
        //   await NfcManager.requestTechnology(NfcTech.Ndef);
        //   // the resolved tag object will contain `ndefMessage` property
        //   const tag = await NfcManager.getTag();
        //   if (tag && tag.id) {
        //     _bssid = tag.id;
        //   }
        //   console.warn('Tag found', tag);
        // } catch (ex) {
        //   console.warn('Oops!', ex);
        // } finally {
        //   // stop the nfc scanning
        //   NfcManager.cancelTechnologyRequest();
        // }

        // kiem tra config validate
        if (this.isProcessing) {
            return;
        }

        // Ràng buộc truy cập vị trí.
        if (address == '' || address == null || address === 'PERMISSION_DENIED') {
            this.alertContrainPermission();
            return;
        }

        // Chấm công trong phạm vi cho phép
        if (isCheckingByCoordinates && this.isConfirmCoodinateNotMatch === false) {
            let isBlock = configCheckInCoondinate && configCheckInCoondinate == EnumName.E_BLOCK;

            if (listCatCoodinate == null || (Array.isArray(listCatCoodinate) && listCatCoodinate.length == 0)) {
                if (isBlock) {
                    ToasterSevice.showError('Block_NotMatch_Coodinate');
                    return;
                } else {
                    AlertSevice.alert({
                        iconType: EnumIcon.E_WARNING,
                        title: 'E_WARNING',
                        message: 'Warning_NotMatch_Coodinate',
                        textRightButton: 'HRM_Common_Continue',
                        textLeftButton: 'HRM_Common_Close',
                        onCancel: () => {
                            this.reload();
                        },
                        onConfirm: () => {
                            this.isConfirmCoodinateNotMatch = true;
                            this.fbCheckConstraintPhoto(typeRequest);
                        }
                    });
                    this.coodinateCheckPass = null;
                    return;
                }
            } else if (Array.isArray(listCatCoodinate) && listCatCoodinate.length > 0) {
                let psssCheckPosition = false;
                let coodinateCheckPass = null;

                // eslint-disable-next-line no-unused-vars
                for (let item of listCatCoodinate) {
                    let _Coodinate = item.Coodinate ? item.Coodinate.replace(' ', '').split(',') : null;
                    if (_Coodinate && _Coodinate.length > 0 && item.CoordinateDistance) {
                        let geolocationCenter = null;
                        geolocationCenter = {
                            latitude: _Coodinate[0], //37.785834,
                            longitude: _Coodinate[1] //-122.406417
                        };

                        let radious = item.CoordinateDistance;
                        if (
                            geolocationCenter &&
                            this.getDistanceWithingRadious(geolocationInput, geolocationCenter, radious)
                        ) {
                            psssCheckPosition = true;
                            coodinateCheckPass = geolocationCenter;
                            break;
                        }
                    }
                }

                if (!psssCheckPosition) {
                    // vị trí hợp lệ
                    if (isBlock) {
                        ToasterSevice.showError('Block_NotMatch_Coodinate');
                        return;
                    } else {
                        AlertSevice.alert({
                            iconType: EnumIcon.E_WARNING,
                            title: 'E_WARNING',
                            message: 'Warning_NotMatch_Coodinate',
                            textRightButton: 'HRM_Common_Continue',
                            textLeftButton: 'HRM_Common_Close',
                            onCancel: () => {
                                this.reload();
                            },
                            onConfirm: () => {
                                this.isConfirmCoodinateNotMatch = true;
                                this.fbCheckConstraintPhoto(typeRequest);
                            }
                        });
                        this.coodinateCheckPass = null;
                        return;
                    }
                } else {
                    this.coodinateCheckPass = coodinateCheckPass;
                }
            }
        }

        // kiểm tra xem có cấu hình load nơi làm việc khi chấm công GPS không
        // nếu còn configLoadWorkPlace.data !== null thì có check
        if (
            configLoadWorkPlace.data !== null &&
            Array.isArray(configLoadWorkPlace.data) &&
            configLoadWorkPlace.value == null
        ) {
            let subjectPosition = [];

            configLoadWorkPlace.data.forEach((item) => {
                let _Coodinate = item.Coodinate ? item.Coodinate.replace(' ', '').split(',') : null;
                if (_Coodinate && _Coodinate.length > 0 && item.CoordinateDistance) {
                    let geolocationCenter = {
                            latitude: _Coodinate[0], //37.785834,
                            longitude: _Coodinate[1] //-122.406417
                        },
                        radious = item.CoordinateDistance;
                    if (this.getDistanceWithingRadious(geolocationInput, geolocationCenter, radious)) {
                        subjectPosition.push(item);
                    }
                }
            });

            if (subjectPosition.length > 1) {
                let minDistance = null,
                    indexDistance = null;

                subjectPosition.forEach((item, index) => {
                    let _Coodinate = item.Coodinate ? item.Coodinate.replace(' ', '').split(',') : null;
                    if (_Coodinate && _Coodinate.length > 0) {
                        let geolocationCenter = {
                            latitude: _Coodinate[0], //37.785834,
                            longitude: _Coodinate[1] //-122.406417
                        };

                        let calcDistance = getDistance(geolocationInput, geolocationCenter);

                        if (minDistance == null && indexDistance == null) {
                            minDistance = calcDistance;
                            indexDistance = index;
                        } else if (minDistance != null && calcDistance < minDistance) {
                            minDistance = calcDistance;
                            indexDistance = index;
                        }
                    }
                });

                subjectPosition = [subjectPosition[indexDistance]];
            }

            this.setState({
                configLoadWorkPlace: {
                    ...configLoadWorkPlace,
                    value: subjectPosition.length > 0 ? subjectPosition[0] : null,
                    visible: true
                },
                typeRequestData: typeRequest
            });

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
                    ToasterSevice.showError('Việc chấm công bằng NFC của bạn không chính xác');
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
                    if (configConstraintInOut === true && typeRequest === 'E_OUT') {
                        this.moveToDetaiShift();
                    } else {
                        this.onConfirm(typeRequest);
                    }
                }
            });
            return;
        }

        // khong co rang buoc chup anh và có ràng buộc in/out
        if (configConstraintInOut === true && typeRequest === 'E_OUT') {
            this.moveToDetaiShift();
        } else {
            this.onConfirm(typeRequest);
        }
    };

    moveToDetaiShift = () => {
        const { navigation } = this.props,
            {
                Comment,
                address,
                imageCamera,
                checkIn,
                latitude,
                longitude,
                configConstraintWifi,
                isAllowCheckInGPSLeavedayBusinessTrip
            } = this.state,
            { isCheckingByMACAdress } = configConstraintWifi ? configConstraintWifi : {};

        let _bssid = null;
        if (this.macAddressCheckPass !== null) {
            _bssid = this.macAddressCheckPass;
        }

        const dataBodyOut = {
            ProfileID: dataVnrStorage.currentUser.info.ProfileID,
            UserSubmit: dataVnrStorage.currentUser.info.ProfileID,
            UserUpdate: dataVnrStorage.currentUser.info.ProfileID,
            Comment: Comment,
            IsPortal: true,
            Status: 'E_SUBMIT',
            Type: 'E_OUT',
            IsCheckGPS: true,
            MACAddress: isCheckingByMACAdress && this.isConfirmMACAdressNotMatch === false ? _bssid : null,
            IsScreenCheckInGPS: true, // chấm công giờ server,
            IsAllowApprove: isCheckingByMACAdress && this.isConfirmMACAdressNotMatch === false, // auto duyệt khi đúng wifi
            TimeLogTime: new Date(),
            TimeLog: new Date(),
            LocationAddress: address,
            Coordinate: latitude && longitude ? `${latitude}|${longitude}` : '',
            IsAllowCheckInGPSWhenLeavedayBusinessTrip: isAllowCheckInGPSLeavedayBusinessTrip
        };

        if (!Vnr_Function.CheckIsNullOrEmpty(this.refs.viewShot)) {
            VnrLoadingSevices.show();
            this.isProcessing = true;
            this.refs.viewShot.capture().then((uri) => {
                VnrLoadingSevices.hide();
                const title = uri.split('/').pop().split('#')[0].split('?')[0];
                const ext = title.substring(title.indexOf('.') + 1, title.length);
                const file = {
                    uri: uri,
                    name: title,
                    type: 'image/' + ext
                };

                this.isProcessing = false;
                navigation.navigate('ShiftDetail', {
                    dataBodyCheckOut: dataBodyOut,
                    imgMap: file,
                    imgCamera: imageCamera,
                    dataCheckIn: checkIn,
                    reloadGPS: this.reload
                });
            });
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

    render() {
        const {
            latitude,
            longitude,
            address,
            checkIn,
            checkOut,
            imageCamera,
            isvisibleModalCamara,
            typeCamera,
            configConstraintInOut,
            configLoadWorkPlace,
            isloading,
            configConstraintDistanceWithRadious
        } = this.state;

        const coordinate = { latitude: latitude, longitude: longitude };
        const { bntGoBack } = styles;

        let viewMapcomponentWithAdress = <View style={styles.viewloadingMap} />,
            // viewImageCamera = <View />,
            // viewTimeCheckIn = <View />,
            viewButtonPrimary = (
                <View style={styles.viewButton}>
                    <VnrLoading size={'large'} />
                </View>
            );

        // imageCamera.temp == false khong con la tam thoi
        // if (imageCamera != null && !imageCamera.temp) {
        //     viewImageCamera = <Image source={{ uri: imageCamera.uri }} style={styleImageCamera} />;
        // }

        // if (checkIn.TimeLog != undefined && checkIn.TimeLog != null && configConstraintInOut) {
        //     viewTimeCheckIn = (
        //         <View style={styles.viewAddressTime}>
        //             <View style={styles.viewAddressTime_Left}>
        //                 <VnrText i18nKey={'InTime'} />
        //                 <Text style={[styleSheets.lable, styles.viewAddressTime_TimeIn]}>
        //                     {moment(checkIn.TimeLog).format('hh:mm A')}
        //                 </Text>
        //             </View>
        //             <View style={styles.viewAddressTime_right}>
        //                 <TimeWork TimeCheckIn={checkIn.TimeLog} style={styles.viewAddressTime_Countdown} />
        //             </View>
        //         </View>
        //     );
        // }

        if (
            coordinate.latitude != 0 &&
            coordinate.longitude != 0 &&
            address &&
            typeof address === 'string' &&
            address !== 'PERMISSION_DENIED' &&
            !isloading
        ) {
            let handleAddress = this.handleAddress(coordinate.latitude, coordinate.longitude, address);
            viewMapcomponentWithAdress = (
                <ViewShot style={styles.viewShot_map} ref="viewShot" options={{ format: 'jpg', quality: 0.1 }}>
                    <MapViewComponent
                        isShowCallout={false}
                        styleMap={CustomStyleSheet.flex(1)}
                        //ref={ref => (this.ResMapViewComponent = ref)}
                        coordinate={coordinate}
                        address={handleAddress}
                    />
                    <View style={styles.viewAdress_Top}>
                        <View style={styles.viewAdress_Top_location}>
                            <IconLocation color={Colors.gray_10} size={17} />
                        </View>
                        <View style={styles.viewAddress}>
                            {checkIn.isCheck &&
                                checkIn.TimeLog != undefined &&
                                checkIn.TimeLog != null &&
                                configConstraintInOut && (
                                <View style={styles.viewAddressTime}>
                                    <View style={styles.viewAddressTime_Left}>
                                        <VnrText i18nKey={'InTime'} />
                                        <Text style={[styleSheets.lable, styles.viewAddressTime_TimeIn]}>
                                            {moment(checkIn.TimeLog).format('hh:mm A')}
                                        </Text>
                                    </View>
                                    <View style={styles.viewAddressTime_right}>
                                        <TimeWork
                                            TimeCheckIn={checkIn.TimeLog}
                                            style={styles.viewAddressTime_Countdown}
                                        />
                                    </View>
                                </View>
                            )}
                            <View style={styles.viewAddressTime}>
                                <IconMap color={Colors.black} size={Size.text + 2} />
                                <Text style={[styleSheets.text, styles.styTextMapAddress]} numberOfLines={2}>
                                    {handleAddress}
                                </Text>
                            </View>
                        </View>
                    </View>
                </ViewShot>
            );
        } else if (address && address === 'PERMISSION_DENIED' && !isloading) {
            viewMapcomponentWithAdress = <View style={styles.viewErrorMap} />;
        }

        // xử lý button chính
        if (!isloading && address !== '' && address !== null) {
            if (configConstraintInOut && !isloading) {
                if (!checkIn.isCheck) {
                    viewButtonPrimary = (
                        <View style={styles.viewButton}>
                            <TouchableOpacity
                                style={styles.viewButton_circle}
                                onPress={() => this.checkConstraintPhotoSaveInOut('E_IN')}
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
                                style={styles.button_End}
                                onPress={() => this.checkConstraintPhotoSaveInOut('E_OUT')}
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
                            style={styles.bntCheckIn}
                            onPress={() => this.checkConstraintPhotoSaveInOut('E_IN')}
                        >
                            <VnrText
                                i18nKey={'HRM_Common_CheckIn'}
                                style={[styleSheets.lable, styles.button_End_Text]}
                            />
                            {/* {checkIn.TimeLog != undefined && checkIn.TimeLog != null && (
                <Text style={[styleSheets.text, styles.timeCheckIn]}>
                  {`(${moment(checkIn.TimeLog).format('hh:mm A')})`}
                </Text>
              )} */}
                        </TouchableOpacity>
                        <TouchableOpacity
                            style={styles.bntCheckOut}
                            onPress={() => this.checkConstraintPhotoSaveInOut('E_OUT')}
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
            <SafeAreaView style={CustomStyleSheet.flex(1)}>
                <KeyboardAwareScrollView
                    scrollEnabled={false}
                    keyboardShouldPersistTaps={'handled'}
                    contentContainerStyle={CustomStyleSheet.flex(1)}
                >
                    <View style={[styleSheets.container, styles.styContainerExtend]}>
                        <View
                            style={[
                                styles.viewMap,
                                configConstraintDistanceWithRadious &&
                                    configConstraintDistanceWithRadious.listCoordinatesView && {
                                    backgroundColor: Colors.gray_2
                                }
                            ]}
                        >
                            {viewMapcomponentWithAdress}
                        </View>

                        {configConstraintDistanceWithRadious &&
                            configConstraintDistanceWithRadious.listCoordinatesView && (
                            <View style={styles.viewShopName}>
                                {configConstraintDistanceWithRadious.listCoordinatesView.map((str, index) => (
                                    <View key={index} style={styles.styRowShop}>
                                        <View style={styles.styDotShop} />
                                        <Text style={[styleSheets.text, styles.styTextShopName]}>{str}</Text>
                                    </View>
                                ))}
                            </View>
                        )}

                        <View style={styles.viewForm}>
                            <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
                                <View style={styles.viewWecome}>
                                    {this.renderSessionText()}
                                    <View style={styles.viewTime}>
                                        <View style={styles.viewSessionTime}>
                                            <Time
                                                key={'E_TIMEWORK'}
                                                ref={'refTime'}
                                                format={'hh:mm'}
                                                style={styles.styTimeViewSession}
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

                        <View style={styles.styViewGoBackBtn}>
                            <TouchableOpacity style={bntGoBack} onPress={() => this.goBack()}>
                                <IconBack size={Size.iconSizeHeader} color={Colors.gray_10} />
                            </TouchableOpacity>
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
                                <View style={styles.styViewCameraWrap}>
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
                                <View style={styles.styLoadWorkPlacePicker}>
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

const SizeProgress = 171;
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
    styLoadWorkPlacePicker: {
        position: 'absolute',
        top: -999
    },
    styViewCameraWrap: { flex: 1, backgroundColor: Colors.white },
    styViewGoBackBtn: {
        position: 'absolute',
        width: Size.deviceWidth,
        opacity: 1,
        top: 15,
        left: 10
    },
    styTextMapAddress: { textAlign: 'center' },
    styTimeViewSession: {
        fontSize: Size.deviceWidth <= 350 ? Size.text + 30 : Size.text + 35,
        paddingBottom: 0,
        fontWeight: '500'
    },
    styContainerExtend: { backgroundColor: Colors.white, alignItems: 'center' },
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
    viewAdress_Top: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        alignItems: 'center'
    },
    viewAdress_Top_location: {
        position: 'absolute',
        top: -50,
        right: 32,
        backgroundColor: Colors.white,
        width: 44,
        height: 44,
        borderRadius: 22,
        alignItems: 'center',
        justifyContent: 'center'
    },
    viewAddress: {
        backgroundColor: Colors.whiteOpacity70,
        paddingHorizontal: 15,
        paddingVertical: 8,
        // height: 80,
        width: Size.deviceWidth - 64,
        maxWidth: 350,
        borderRadius: 8
    },
    viewAddressTime: {
        flex: 1,
        flexDirection: 'row',
        marginBottom: 10
    },
    viewAddressTime_Left: {
        flex: 3,
        borderRightWidth: 0.5,
        borderRightColor: Colors.gray_5,
        justifyContent: 'center',
        alignItems: 'center'
    },
    viewAddressTime_right: {
        flex: 7,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: -13
    },
    viewAddressTime_TimeIn: {
        fontWeight: '600',
        color: Colors.NeutralGreen
    },
    viewAddressTime_Countdown: {
        fontSize: Size.deviceWidth <= 350 ? Size.text + 24 : Size.text + 25,
        fontWeight: '700',
        color: Colors.primary
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

    // eslint-disable-next-line react-native/no-unused-styles
    styleImageCamera: {
        position: 'absolute',
        top: 0,
        height: SizeProgress,
        width: SizeProgress,
        borderRadius: SizeProgress / 2,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: styleSheets.m_10,
        resizeMode: 'cover',
        zIndex: 0
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
    // eslint-disable-next-line react-native/no-unused-styles
    bntGoBack: {
        width: 44,
        height: 44,
        borderRadius: 8,
        backgroundColor: Colors.white,
        alignItems: 'center',
        justifyContent: 'center'
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
    viewShopName: {
        alignItems: 'flex-start',
        //marginBottom: 15,
        backgroundColor: Colors.gray_2,
        paddingVertical: Size.defineHalfSpace,
        width: Size.deviceWidth,
        maxWidth: 600,
        paddingHorizontal: 32
    },
    styRowShop: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 5
    },
    styDotShop: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: Colors.gray_8,
        marginRight: 5,
        marginTop: 2
    },
    styTextShopName: {
        fontSize: Size.text - 2,
        color: Colors.gray_8
    },
    viewMap: {
        flex: 3.8,
        width: '100%'
    },
    viewForm: {
        flex: 6.2,
        backgroundColor: Colors.white,
        flexDirection: 'column',
        paddingVertical: styleSheets.p_10,
        width: Size.deviceWidth,
        maxWidth: 600,
        paddingHorizontal: 32
        // backgroundColor: 'red'
        // marginHorizontal: Size.deviceWidth - 600
    },
    viewErrorMap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    viewloadingMap: {
        flex: 1,
        overflow: 'hidden',
        borderBottomLeftRadius: 40,
        borderBottomRightRadius: 40,
        backgroundColor: Colors.whitePure3
    },
    viewShot_map: {
        flex: 1,
        overflow: 'hidden',
        borderBottomLeftRadius: Size.deviceWidth >= 1024 ? 60 : 40,
        borderBottomRightRadius: Size.deviceWidth >= 1024 ? 60 : 40,
        backgroundColor: Colors.whitePure3
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
    }
});

const mapStateToProps = (state) => {
    return {
        detailsNetwork: state.network.detailsNetwork,
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(mapStateToProps, null)(CheckinNFCTest);
