/* eslint-disable no-console */
// eslint-disable-next-line react-native/split-platform-components
import { Platform, NativeModules, PermissionsAndroid } from 'react-native';
import { dataVnrStorage, logout } from '../assets/auth/authentication';
import Vnr_Function from './Vnr_Function';
import DrawerServices from './DrawerServices';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NtfNotificationBusinessFunction } from '../scenes/notification/NtfNotificationBusiness';
import { ConfigVersionBuild } from '../assets/configProject/ConfigVersionBuild';
import { ScreenName } from '../assets/constant';
import { PermissionForAppMobile } from '../assets/configProject/PermissionForAppMobile';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidBadgeIconType, AndroidImportance, EventType } from '@notifee/react-native';
import { Colors } from '../constants/styleConfig';
import DeviceInfo from 'react-native-device-info';
import { PERMISSIONS, request } from 'react-native-permissions';
import HttpService from './HttpService';

let _functionCallback = null;
const { BadgeModule } = NativeModules;

export default class NotificationsService {
    static initAndroidFirebase(callback) {
        _functionCallback = callback && typeof callback == 'function' ? callback : () => {};
        //callback(null);
        this.checkPermission();
        this.messageListener();
    }

    // lấy được cấp quyền chúng ta sẽ lấy Fcm Token về ( như id của mỗi thiết bị ) lưu vào AsynStorage
    static async getToken() {
        try {
            let fcmToken = await AsyncStorage.getItem('fcmToken');
            console.log(' fcmToken: ', fcmToken);
            if (!fcmToken) {
                fcmToken = await messaging().getToken();
                if (fcmToken && _functionCallback != null) {
                    console.log('after fcmToken: ', fcmToken);
                    await AsyncStorage.setItem('fcmToken', fcmToken);
                    _functionCallback(fcmToken);
                }
            } else if (_functionCallback != null) {
                _functionCallback(fcmToken);
            }
        } catch (error) {
            _functionCallback && _functionCallback(null);
        }
    }

    // kiểm tra đã có  quyền chưa nếu chưa thì yêu cầu cấp , đã có thì getTokent()
    static async checkPermission() {
        try {
            messaging()
                .hasPermission()
                .then(enabled => {
                    if (enabled == true) {
                        this.getToken();
                    } else {
                        this.requestPermission();
                    }
                })
                .catch(err => {
                    console.log(JSON.stringify(err));
                    this.showAlert('error checkPermission', err.toString());
                    //this.setState({ error: err.toString() })
                });
        } catch (error) {
            console.log(JSON.stringify(error));
            // this.showAlert('error checkPermission', error.toString());
        }
    }

    // hàm yêu cầu cấp quyền
    static async requestPermission() {
        if (Platform.OS === 'ios') {
            messaging()
                .requestPermission()
                .then(async authStatus => {
                    const enabled =
                        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

                    if (enabled) {
                        this.getToken();
                    } else _functionCallback && _functionCallback(null);
                })
                .catch(error => {
                    console.log(JSON.stringify(error));
                });
        } else {
            try {
                const levelDevices = await DeviceInfo.getApiLevel();
                if (levelDevices >= 33) {
                    const granted = await request(PERMISSIONS.ANDROID.POST_NOTIFICATIONS);
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) this.getToken();
                    else _functionCallback && _functionCallback(null);
                } else {
                    _functionCallback && _functionCallback(null);
                }
            } catch (error) {
                console.log(JSON.stringify(error));
            }
        }
    }

    static checkDuplicate(remoteMessage, listDisplayed) {
        if (remoteMessage && listDisplayed) {
            // Check for duplicates based on your criteria
            const duplicateNotification = listDisplayed.find(item => {
                const { remote } = item.notification;
                return remote && remoteMessage.messageId === remote.messageId;
            });

            if (duplicateNotification) {
                return true;
            } else {
                return false;
            }
        } else {
            return false;
        }
    }

    static onMessageReceived = async (remoteMessage, isOnBackground) => {
        if (remoteMessage) {
            try {
                const { notification, data } = remoteMessage,
                    dataNoti = data && data.parameters ? JSON.parse(data.parameters) : null;

                let getBadgeCurrent = null;
                if (dataNoti != null && dataNoti.numberApprove != null) {
                    getBadgeCurrent = dataNoti.numberApprove;
                }

                if (getBadgeCurrent != null) {
                    this.setBadgeIcon(getBadgeCurrent);
                }

                const chanelId = this.channelId;
                if (!isOnBackground) {
                    const listDisplayed = await notifee.getDisplayedNotifications();
                    // erorr duplicated notifications ios
                    if (
                        Platform.OS == 'ios' &&
                        Array.isArray(listDisplayed) &&
                        this.checkDuplicate(remoteMessage, listDisplayed) == true
                    ) {
                        return;
                    }

                    await notifee.displayNotification({
                        id: remoteMessage.messageId,
                        title: notification.title,
                        body: notification.body,
                        data: data,
                        android: {
                            pressAction: {
                                id: 'default'
                            },
                            channelId: chanelId,
                            smallIcon: 'ic_notification',
                            color: Colors.primary,
                            badgeIconType: AndroidBadgeIconType.SMALL
                        }
                    });
                }

                notifee.onBackgroundEvent(async ({ type, detail }) => {
                    const { notification } = detail;

                    if (type === EventType.PRESS) {
                        this.opentNotify(notification);
                    }
                    notifee.cancelNotification(notification.id);
                });

                notifee.onForegroundEvent(({ type }) => {
                    switch (type) {
                        case EventType.DISMISSED:
                            console.log('DISMISSED');
                            break;
                        case EventType.PRESS:
                            console.log('PRESS');
                            break;
                    }
                });
            } catch (error) {
                console.log(error, 'errorerrorerror');
            }
        }
    };

    static async setBadgeIcon(number) {
        try {
            if (number != null) {
                if (Platform.OS === 'android') {
                    // Set badge count
                    BadgeModule.setBadgeCount(parseInt(number));
                } else {
                    notifee.setBadgeCount(parseInt(number));
                }
            }
        } catch (error) {
            console.log(error, 'error');
        }
    }

    static fetchContbadges() {
        if (dataVnrStorage && dataVnrStorage.isNewLayoutV3) {
            HttpService.Get('[URI_CENTER]/api/Sys_Common/GetCountDataDashBoardApp', null, this.fetchContbadges).then(
                countBaged => {
                    if (countBaged && countBaged.Data != null && typeof countBaged.Data == 'number') {
                        this.setBadgeIcon(countBaged.Data);
                    }
                }
            );
        }
    }

    static async messageListener() {
        messaging().onMessage(remoteMessage => this.onMessageReceived(remoteMessage, false));
        if (Platform.OS == 'android') {
            const getChannel = await notifee.getChannel('NOTIFICATION_CHANNEL');
            if (getChannel == null) {
                this.channelId = await notifee.createChannel({
                    id: 'NOTIFICATION_CHANNEL',
                    name: 'NOTIFICATION CHANNEL',
                    lights: false,
                    vibration: true,
                    sound: 'default',
                    importance: AndroidImportance.HIGH,
                    badge: true // disable in badges
                });
            } else {
                this.channelId = getChannel.id;
            }
        }

        // ios and android set badge only
        messaging().setBackgroundMessageHandler(remoteMessage => this.onMessageReceived(remoteMessage, true));

        // Handle notification open when app is in the foreground
        messaging().onNotificationOpenedApp(remoteMessage => {
            this.opentNotify(remoteMessage);
        });

        // initial notification when app is in closed NOT in (background or foreground)
        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                this.opentNotify(remoteMessage);
            });

        //handle notification open when app Background
        notifee.onForegroundEvent(({ type, detail }) => {
            switch (type) {
                case EventType.DISMISSED:
                    break;
                case EventType.PRESS:
                    this.opentNotify(detail.notification);
                    break;
            }
        });
    }

    static mappingScreenNameV3(screenName) {
        if (Vnr_Function.CheckIsNullOrEmpty(screenName) == true ) {
            return '';
        }
        let isNewLayoutV3 = false;
        if (dataVnrStorage.apiConfig && dataVnrStorage.apiConfig.uriCenter && dataVnrStorage.apiConfig.uriIdentity) {
            isNewLayoutV3 = true;
        }
        let per = PermissionForAppMobile.value;
        if (isNewLayoutV3) {
            // Nếu chạy giao diện mới thì vào từ thông báo chuyển đến màn hình mới.
            // Kiểm tra thêm phải có key quyền
            if (per['Att_WorkDayDetail_Portal_Mobile_V2']?.View && screenName == ScreenName.WorkDay)
                return ScreenName.AttWorkDayCalendar;
            // Quên chấm công
            else if (
                per['New_Att_TamScanLogRegister_New_Index_V2']?.View &&
                screenName.includes('AttSubmitTSLRegister')
            ) {
                if (screenName == ScreenName.AttSubmitTSLRegister) return ScreenName.AttSubmitTamScanLogRegister;
                else if (screenName == ScreenName.AttSubmitTSLRegisterViewDetail)
                    return ScreenName.AttSubmitTamScanLogRegisterViewDetail;
                else return screenName;
            } else if (
                per['New_Att_TamScanLogRegisterApprove_New_Index_V2']?.View &&
                (screenName.includes('AttApproveTSLRegister') || screenName.includes('AttApprovedTSLRegister'))
            ) {
                if (screenName == ScreenName.AttApproveTSLRegister) return ScreenName.AttApproveTamScanLogRegister;
                else if (screenName == ScreenName.AttApproveTSLRegisterViewDetail)
                    return ScreenName.AttApproveTamScanLogRegisterViewDetail;
                else if (screenName == ScreenName.AttApprovedTSLRegister)
                    return ScreenName.AttApprovedTamScanLogRegister;
                else if (screenName == ScreenName.AttApprovedTSLRegisterViewDetail)
                    return ScreenName.AttApprovedTamScanLogRegisterViewDetail;
                else return screenName;
            }
            // Ngày nghỉ
            else if (per['New_Att_Leaveday_New_Index_V2']?.View && screenName.includes('AttSubmitLeaveDay')) {
                if (screenName == ScreenName.AttSubmitLeaveDay) return ScreenName.AttSubmitTakeLeaveDay;
                else if (screenName == ScreenName.AttSubmitLeaveDayViewDetail)
                    return ScreenName.AttSubmitTakeLeaveDayViewDetail;
                else return screenName;
            } else if (
                per['New_Att_LeaveDayApprove_New_Index_V2']?.View &&
                (screenName.includes('AttApproveLeaveDay') || screenName.includes('AttApprovedLeaveDay'))
            ) {
                if (screenName == ScreenName.AttApproveLeaveDay) return ScreenName.AttApproveTakeLeaveDay;
                else if (screenName == ScreenName.AttApprovedLeaveDay) return ScreenName.AttApprovedTakeLeaveDay;
                else if (screenName == ScreenName.AttApproveLeaveDayViewDetail)
                    return ScreenName.AttApproveTakeLeaveDayViewDetail;
                else if (screenName == ScreenName.AttApprovedLeaveDayViewDetail)
                    return ScreenName.AttApprovedTakeLeaveDayViewDetail;
                else return screenName;
            }
            // Đi công tác
            else if (
                per['New_Att_BussinessTravel_New_Index_V2']?.View &&
                screenName.includes('AttSubmitBusinessTrip')
            ) {
                if (screenName == ScreenName.AttSubmitBusinessTrip) return ScreenName.AttSubmitTakeBusinessTrip;
                else if (screenName == ScreenName.AttSubmitBusinessTripViewDetail)
                    return ScreenName.AttSubmitTakeBusinessTripViewDetail;
                else return screenName;
            } else if (
                per['New_Att_BussinessTravelApprove_New_Index_V2']?.View &&
                (screenName.includes('AttApproveBusinessTrip') || screenName.includes('AttApprovedBusinessTrip'))
            ) {
                if (screenName == ScreenName.AttApproveBusinessTrip) return ScreenName.AttApproveTakeBusinessTrip;
                else if (screenName == ScreenName.AttApprovedBusinessTrip)
                    return ScreenName.AttApprovedTakeBusinessTrip;
                else if (screenName == ScreenName.AttApproveBusinessTripViewDetail)
                    return ScreenName.AttApproveTakeLeaveDayViewDetail;
                else if (screenName == ScreenName.AttApprovedBusinessTripViewDetail)
                    return ScreenName.AttApprovedTakeLeaveDayViewDetail;
                else return screenName;
            }
            // Tăng ca
            else if (per['New_Att_OvertimePlan_New_Index_V2']?.View && screenName.includes('AttSubmitPlanOvertime')) {
                if (screenName == ScreenName.AttSubmitPlanOvertime) return ScreenName.AttSubmitWorkingOvertime;
                else if (screenName == ScreenName.AttSubmitPlanOvertimeViewDetail)
                    return ScreenName.AttSubmitWorkingOvertimeViewDetail;
                else return screenName;
            } else if (
                per['New_Att_OvertimePlanApprove_New_Index_V2']?.View &&
                (screenName.includes('AttApprovePlanOvertime') || screenName.includes('AttApprovedPlanOvertime'))
            ) {
                if (screenName == ScreenName.AttApprovePlanOvertime) return ScreenName.AttApproveWorkingOvertime;
                else if (screenName == ScreenName.AttApprovedPlanOvertime) return ScreenName.AttApprovedWorkingOvertime;
                else if (screenName == ScreenName.AttApprovePlanOvertimeViewDetail)
                    return ScreenName.AttApproveWorkingOvertimeViewDetail;
                else if (screenName == ScreenName.AttApprovedPlanOvertimeViewDetail)
                    return ScreenName.AttApprovedWorkingOvertimeViewDetail;
                else return screenName;
            } else return screenName;
        } else return screenName;
    }

    static opentNotify(notification) {
        if (
            !Vnr_Function.CheckIsNullOrEmpty(notification) &&
            !Vnr_Function.CheckIsNullOrEmpty(notification.data) &&
            !Vnr_Function.CheckIsNullOrEmpty(notification.data.pushScreenName)
        ) {
            let screenName = notification.data.pushScreenName;
            let params = {};

            if (!Vnr_Function.CheckIsNullOrEmpty(notification.data.parameters)) {
                params =
                    typeof notification.data.parameters == 'object'
                        ? notification.data.parameters
                        : JSON.parse(notification.data.parameters);
            }

            if (
                params &&
                params.dataId &&
                [
                    '080834',
                    '080904',
                    '080912',
                    '080914',
                    '080916',
                    '080918',
                    '080920',
                    '080922',
                    '080924',
                    '080926',
                    '080928',
                    '080930',
                    '080932',
                    '080934',
                    '080936',
                    '080938',
                    '080940'
                ].indexOf(ConfigVersionBuild.value) < 0
            )
                NtfNotificationBusinessFunction.updateIsSeen(params);

            DrawerServices.navigateForVersion(this.mappingScreenNameV3(screenName), {
                ...params,
                NotificationID: params.dataId,
                NotificationIDs: params.dataId,
                // ==== trường hợp cho ngày công ======//
                CutOffDuration: params.CutOffDuration ? params.CutOffDuration : null,
                CutOffDurationID: params.CutOffDurationID ? params.CutOffDurationID : null,
                // ==== trường hợp Cần dùng Title và Body ======//
                Title: params.Title ? params.Title : null,
                Body: params.Body ? params.Body : null
                // Title : params.Title ? params.Title : null,
            });
        } else if (notification) {
            this.checkActiveUser(notification);
        }
    }

    static checkActiveUser(notification) {
        try {
            const { parameters } = notification.data;
            let params = null;

            if (parameters && typeof parameters === 'string') {
                params = JSON.parse(parameters);
            }

            if (params && typeof params === 'object' && params.dataId === 'E_INACTIVE_USER') {
                let timeOut = setTimeout(() => {
                    // logout User
                    logout();

                    //clear TimeOut
                    clearTimeout(timeOut);
                }, 4000);
            }
        } catch (error) {
            console.log(error, 'error checkActiveUser');
        }
    }

    // hàm Xoá tất cả Notify
    static removeAllNotifications() {
        notifee.cancelAllNotifications();
        this.setBadgeIcon(0);
    }
    static getListUserPushNotify() {}

    static handleViewDetailFormNotification(pushScreenName, screenNameDetail) {
        return DrawerServices.getParentScreen(pushScreenName, screenNameDetail);
    }
}
