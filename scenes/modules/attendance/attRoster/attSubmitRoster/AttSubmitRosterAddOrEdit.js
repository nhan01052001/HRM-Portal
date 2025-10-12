import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Size,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import Icon from 'react-native-vector-icons/Ionicons';
import HttpService from '../../../../../utils/HttpService';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VnrPickerMulti from '../../../../../components/VnrPickerMulti/VnrPickerMulti';
import VnrPickerMultiSave from '../../../../../components/VnrPickerMulti/VnrPickerMultiSave';
import VnrTreeView from '../../../../../components/VnrTreeView/VnrTreeView';
import RadioForm from 'react-native-simple-radio-button';
import CheckBox from 'react-native-check-box';
import { translate } from '../../../../../i18n/translate';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { EnumName, EnumIcon } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import NotificationsService from '../../../../../utils/NotificationsService';
import DrawerServices from '../../../../../utils/DrawerServices';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import moment from 'moment';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';

let enumName = null,
    profileInfo = null;

const initSateDefault = {
    isRefesh: false,
    isChoseProfile: true,
    CheckProfilesExclude: false,
    Profiles: {
        refresh: false,
        value: null
    },
    OrgStructures: {
        refresh: false,
        value: null
    },
    ProfilesExclude: {
        refresh: false,
        value: null,
        api: {
            urlApi: '[URI_HR]/Hre_GetData/GetMultiProfileByOrderNumber',
            type: 'E_GET'
        },
        disable: true
    },
    ProfileID: {
        ID: null,
        ProfileName: ''
    },
    Type: {
        visible: true,
        visibleConfig: true,
        refresh: false,
        value: null,
        data: []
    },
    ChangeShiftType: {
        visible: true,
        visibleConfig: true,
        refresh: false,
        data: [],
        value: null
    },
    RosterGroupName: {
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    UserApprove: {
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },
    UserApprove3: {
        disable: false,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    UserApprove4: {
        disable: false,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    UserApprove2: {
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },
    MonShift: {
        disable: true,
        refresh: false,
        visible: true,
        value: null,
        data: []
    },
    MonShift2: {
        disable: true,
        refresh: false,
        visible: true,
        value: null,
        data: []
    },
    TueShift: {
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        data: []
    },
    TueShift2: {
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        data: []
    },
    WedShift: {
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        data: []
    },
    WedShift2: {
        disable: true,
        refresh: false,
        visible: true,
        value: null,
        data: []
    },
    ThuShift: {
        disable: true,
        refresh: false,
        visible: true,
        value: null,
        data: []
    },
    ThuShift2: {
        disable: true,
        visible: true,
        refresh: false,
        value: null,
        data: []
    },
    FriShift: {
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        data: []
    },
    FriShift2: {
        disable: true,
        refresh: false,
        visible: true,
        value: null,
        data: []
    },
    SatShift: {
        disable: true,
        refresh: false,
        visible: true,
        value: null,
        data: []
    },
    SatShift2: {
        disable: true,
        refresh: false,
        value: null,
        data: []
    },
    SunShift: {
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        data: []
    },
    SunShift2: {
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        data: []
    },
    DateStart: {
        visible: true,
        visibleConfig: true,
        value: null,
        refresh: false
    },
    DateEnd: {
        visible: true,
        visibleConfig: true,
        value: null,
        refresh: false,
        disable: false
    },
    DateChange: {
        visibleConfig: true,
        value: null,
        refresh: false,
        visible: false
    },
    Comment: {
        visible: true,
        visibleConfig: true,
        disable: true,
        value: '',
        refresh: false
    },
    ChangeShiftID: {
        visible: false,
        visibleConfig: true,
        disable: true,
        refresh: false,
        value: null,
        data: []
    },
    SubstituteShiftID: {
        visible: false,
        visibleConfig: true,
        disable: true,
        refresh: false,
        value: null,
        data: []
    },
    isShowRoster: true,
    isShowRoster2: false,
    isAllowEditRosterOnDateChange: false,
    fieldValid: {},
    isConfigFromServer: false
};

export default class AttSubmitRosterAddOrEdit extends Component {
    constructor(props) {
        super(props);
        this.state = initSateDefault;

        this.setVariable();

        props.navigation.setParams({
            title: props.navigation.state.params.record
                ? 'HRM_Attendance_Roster_Update'
                : 'HRM_Attendance_Roster_Create'
        });
    }

    setVariable = () => {
        this.isRegisterHelp = null;
        this.isChangeLevelApprove = false;
        this.isRegisterOrgOvertime = false;
        this.levelApproveRoster = 2;
        this.isModify = false;
        this.configIsShowRoster2 = false;
        this.listWarningRoster = [];
        this.isSetFirst = true;

        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;

        this.paramsExtend = {
            IsRosterNonContinue12Hour: null,
            IsRosterNightNonContinue2Weekly: null,
            IsMaxDayOFFInWeek: null,
            IsPregnancyWorkingNightShift: null,
            IsOverrideRosterQuestion: null,
            IsCheckRequestShift: null
        };
    };

    refreshView = () => {
        this.props.navigation.setParams({ title: 'HRM_Attendance_Roster_Create' });
        this.setVariable();
        this.setState(initSateDefault, () => this.getConfigValid('Att_Roster_Potal', true));
    };

    save = (navigation, isCreate, isSend) => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        if (this.isRegisterHelp && !this.isModify) {
            this.saveRegisterHelp(navigation);
        } else {
            this.saveNotRegisterHelp(navigation, isCreate, isSend);
        }
    };

    saveAndCreate = navigation => {
        this.save(navigation, true, null);
    };

    saveAndSend = navigation => {
        this.save(navigation, null, true);
    };

    saveRegisterHelp = (navigation, isEmail = false) => {
        const {
            UserApprove,
            UserApprove3,
            UserApprove4,
            UserApprove2,
            DateStart,
            DateEnd,
            DateChange,
            RosterGroupName,
            Type,
            ChangeShiftType,
            Profiles,
            OrgStructures,
            ProfilesExclude,
            isChoseProfile,
            Comment,
            MonShift,
            MonShift2,
            TueShift,
            TueShift2,
            WedShift,
            WedShift2,
            ThuShift,
            ThuShift2,
            FriShift,
            FriShift2,
            SatShift,
            SatShift2,
            SunShift,
            SunShift2
        } = this.state;

        let params = {
            ...this.state,
            ...this.paramsExtend,
            MonShiftID: MonShift.value ? MonShift.value.ID : null,
            TueShiftID: TueShift.value ? TueShift.value.ID : null,
            WedShiftID: WedShift.value ? WedShift.value.ID : null,
            ThuShiftID: ThuShift.value ? ThuShift.value.ID : null,
            FriShiftID: FriShift.value ? FriShift.value.ID : null,
            SatShiftID: SatShift.value ? SatShift.value.ID : null,
            SunShiftID: SunShift.value ? SunShift.value.ID : null,
            MonShiftID2: MonShift2.value ? MonShift2.value.ID : null,
            TueShiftID2: TueShift2.value ? TueShift2.value.ID : null,
            WedShiftID2: WedShift2.value ? WedShift2.value.ID : null,
            ThuShiftID2: ThuShift2.value ? ThuShift2.value.ID : null,
            FriShiftID2: FriShift2.value ? FriShift2.value.ID : null,
            SatShiftID2: SatShift2.value ? SatShift2.value.ID : null,
            SunShiftID2: SunShift2.value ? SunShift2.value.ID : null,
            Comment: Comment.value,
            IsPortal: true,
            Status: 'E_SUBMIT',
            Type: Type.value ? Type.value.Value : null,
            DateStart: DateStart.value,
            DateEnd: DateEnd.value,
            DateChange: DateChange.value,
            RosterGroupName: RosterGroupName.value ? RosterGroupName.value.Key : null,
            ChangeShiftType: ChangeShiftType.value ? ChangeShiftType.value.Value : null,
            ProfileID: null,
            UserApproveID: UserApprove.value ? UserApprove.value.ID : null,
            UserApproveID2: UserApprove2.value ? UserApprove2.value.ID : null,
            UserApproveID3: UserApprove3.value ? UserApprove3.value.ID : null,
            UserApproveID4: UserApprove4.value ? UserApprove4.value.ID : null,
            IsHelp: true,
            IsPortalNew: true,
            IsAddNewAndSendMail: isEmail,
            Host: ''
        };

        if (isChoseProfile) {
            params = {
                ...params,
                ProfileIds: Profiles.value ? Profiles.value.map(item => item.ID).join() : null,
                ProfileID: Profiles.value ? (Profiles.value[0] ? Profiles.value[0].ID : null) : null,
                OrgStructureIDs: null,
                ProfileIDsExclude: null
            };
        } else {
            params = {
                ...params,
                ProfileIDsExclude: ProfilesExclude.value ? ProfilesExclude.value.map(item => item.ID).join() : null,
                OrgStructureIDs: OrgStructures.value ? OrgStructures.value.map(item => item.OrderNumber).join() : null,
                ProfileIds: null
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Att_Roster', params).then(data => {
            VnrLoadingSevices.hide();
            try {
                if (data) {
                    if (data.ActionStatus == 'Success') {
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        navigation.navigate('AttSubmitRoster');
                        const { reload } = navigation.state.params;
                        reload();
                        NotificationsService.getListUserPushNotify();

                        this.listWarningRoster = [];
                    } else if (data.IsOverrideRosterQuestion) {
                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_INFO,
                            message: translate('HRM_Att_Roster_IsOverrideRosterQuestion'),
                            onCancel: () => {},
                            onConfirm: () => {
                                this.paramsExtend = {
                                    ...this.paramsExtend,
                                    IsOverrideRosterQuestion: true
                                };
                                this.saveRegisterHelp(navigation, isEmail);
                            }
                        });
                    }

                    // Kiểm tra có vượt quá 12 tiếng hay không
                    else if (
                        data.IsRosterNonContinue12Hour &&
                        !this.listWarningRoster.includes('IsRosterNonContinue12Hour')
                    ) {
                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_INFO,
                            message: data.ActionStatus,
                            onCancel: () => {},
                            onConfirm: () => {
                                this.listWarningRoster.push('IsRosterNonContinue12Hour');
                                this.paramsExtend = {
                                    ...this.paramsExtend,
                                    IsRosterNonContinue12Hour: true
                                };
                                this.saveRegisterHelp(navigation, isEmail);
                            }
                        });
                    } else if (data.IsCheckRequestShift && !this.listWarningRoster.includes('IsCheckRequestShift')) {
                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_INFO,
                            message: data.ActionStatus,
                            onCancel: () => {},
                            onConfirm: () => {
                                this.listWarningRoster.push('IsCheckRequestShift');
                                this.paramsExtend = {
                                    ...this.paramsExtend,
                                    IsCheckRequestShift: true
                                };
                                this.saveRegisterHelp(navigation, isEmail);
                            }
                        });
                    } else if (
                        data.IsRosterNightNonContinue2Weekly &&
                        !this.listWarningRoster.includes('IsRosterNightNonContinue2Weekly')
                    ) {
                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_INFO,
                            message: data.ActionStatus,
                            onCancel: () => {},
                            onConfirm: () => {
                                this.listWarningRoster.push('IsRosterNightNonContinue2Weekly');
                                this.paramsExtend = {
                                    ...this.paramsExtend,
                                    IsRosterNightNonContinue2Weekly: true
                                };
                                this.saveRegisterHelp(navigation, isEmail);
                            }
                        });
                    }

                    // Kiểm tra có vượt quá số ngày off trong tuần
                    else if (data.IsMaxDayOFFInWeek && !this.listWarningRoster.includes('IsMaxDayOFFInWeek')) {
                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_INFO,
                            message: data.ActionStatus,
                            onCancel: () => {},
                            onConfirm: () => {
                                this.listWarningRoster.push('IsMaxDayOFFInWeek');
                                this.paramsExtend = {
                                    ...this.paramsExtend,
                                    IsMaxDayOFFInWeek: true
                                };
                                this.saveRegisterHelp(navigation, isEmail);
                            }
                        });
                    } else if (data.ActionStatus == 'Block_EditRosterOnDateChange') {
                        ToasterSevice.showWarning(data.ActionStatus, 4000);
                        return;
                    } else if (data.ActionStatus == 'Warning_EditRosterOnDateChange') {
                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_WARNING,
                            message: data.ActionStatus1,
                            onCancel: () => {},
                            onConfirm: () => {
                                this.listWarningRoster.push('IsValidateWarningEditRosterOnDateChange');
                                this.paramsExtend = {
                                    ...this.paramsExtend,
                                    IsValidateWarningEditRosterOnDateChange: true
                                };
                                this.saveRegisterHelp(navigation, isEmail);
                            }
                        });
                    }
                    // Kiểm tra ca đêm
                    else if (
                        data.IsPregnancyWorkingNightShift &&
                        !this.listWarningRoster.includes('IsPregnancyWorkingNightShift')
                    ) {
                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_INFO,
                            message: data.ActionStatus,
                            onCancel: () => {},
                            onConfirm: () => {
                                this.listWarningRoster.push('IsPregnancyWorkingNightShift');
                                this.paramsExtend = {
                                    ...this.paramsExtend,
                                    IsPregnancyWorkingNightShift: true
                                };
                                this.saveRegisterHelp(navigation, isEmail);
                            }
                        });
                    } else if (typeof data.ActionStatus === 'string') {
                        ToasterSevice.showWarning(data.ActionStatus, 4000);
                    } else {
                        ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                    }
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    saveNotRegisterHelp = (navigation, isCreate, isSend) => {
        const {
                UserApprove,
                UserApprove3,
                UserApprove4,
                UserApprove2,
                DateStart,
                DateEnd,
                DateChange,
                RosterGroupName,
                Type,
                ChangeShiftType,
                Comment,
                ProfileID,
                MonShift,
                MonShift2,
                TueShift,
                TueShift2,
                WedShift,
                WedShift2,
                ThuShift,
                ThuShift2,
                FriShift,
                FriShift2,
                SatShift,
                SatShift2,
                SunShift,
                SunShift2,
                ChangeShiftID,
                SubstituteShiftID,
                isConfigFromServer
            } = this.state,
            { apiConfig } = dataVnrStorage,
            { uriPor } = apiConfig;

        let params = {
            ...this.state,
            ...this.paramsExtend,
            ChangeShiftID: ChangeShiftID.value ? ChangeShiftID.value.ID : null,
            SubstituteShiftID: SubstituteShiftID.value ? SubstituteShiftID.value.ID : null,
            Comment: Comment.value,
            IsPortal: true,
            Status: 'E_SUBMIT',
            Type: Type.value ? Type.value.Value : null,
            DateStart: DateStart.value,
            DateEnd: DateEnd.value,
            DateChange: DateChange.value,
            RosterGroupName: RosterGroupName.value ? RosterGroupName.value.Key : null,
            ChangeShiftType: ChangeShiftType.value ? ChangeShiftType.value.Value : null,
            ProfileID: ProfileID.ID,
            ProfileIds: ProfileID.ID,
            UserApproveID: UserApprove.value ? UserApprove.value.ID : null,
            UserApproveID2: UserApprove2.value ? UserApprove2.value.ID : null,
            UserApproveID3: UserApprove3.value ? UserApprove3.value.ID : null,
            UserApproveID4: UserApprove4.value ? UserApprove4.value.ID : null,
            IsPortalNew: true,
            IsAddNewAndSendMail: false,
            Host: ''
        };

        let isType =
            Type.value !== null &&
            isConfigFromServer === true &&
            (Type.value.Value === 'E_SHIFT_MANUAL' ||
                Type.value.Value === 'E_CHANGE_SHIFT' ||
                Type.value.Value === 'E_DEFAULT');

        if (isType) {
            params = {
                ...params,
                MonShiftIDs: MonShift.value
                    ? MonShift.value
                        .map(value => {
                            return value.ID;
                        })
                        .join(',')
                    : null,
                TueShiftIDs: TueShift.value
                    ? TueShift.value
                        .map(value => {
                            return value.ID;
                        })
                        .join(',')
                    : null,
                WedShiftIDs: WedShift.value
                    ? WedShift.value
                        .map(value => {
                            return value.ID;
                        })
                        .join(',')
                    : null,
                ThuShiftIDs: ThuShift.value
                    ? ThuShift.value
                        .map(value => {
                            return value.ID;
                        })
                        .join(',')
                    : null,
                FriShiftIDs: FriShift.value
                    ? FriShift.value
                        .map(value => {
                            return value.ID;
                        })
                        .join(',')
                    : null,
                SatShiftIDs: SatShift.value
                    ? SatShift.value
                        .map(value => {
                            return value.ID;
                        })
                        .join(',')
                    : null,
                SunShiftIDs: SunShift.value
                    ? SunShift.value
                        .map(value => {
                            return value.ID;
                        })
                        .join(',')
                    : null,
                lstMonShift: MonShift.value
                    ? MonShift.value.map(value => {
                        return value.ID;
                    })
                    : null,
                lstTueShift: TueShift.value
                    ? TueShift.value.map(value => {
                        return value.ID;
                    })
                    : null,
                lstThuShift: ThuShift.value
                    ? ThuShift.value.map(value => {
                        return value.ID;
                    })
                    : null,
                lstWedShift: WedShift.value
                    ? WedShift.value.map(value => {
                        return value.ID;
                    })
                    : null,
                lstFriShift: FriShift.value
                    ? FriShift.value.map(value => {
                        return value.ID;
                    })
                    : null,
                lstSatShift: SatShift.value
                    ? SatShift.value.map(value => {
                        return value.ID;
                    })
                    : null,
                lstSunShift: SunShift.value
                    ? SunShift.value.map(value => {
                        return value.ID;
                    })
                    : null,
                IsCreateMultiShift: true
            };
        } else {
            params = {
                ...params,
                MonShiftID: MonShift.value ? MonShift.value.ID : null,
                TueShiftID: TueShift.value ? TueShift.value.ID : null,
                WedShiftID: WedShift.value ? WedShift.value.ID : null,
                ThuShiftID: ThuShift.value ? ThuShift.value.ID : null,
                FriShiftID: FriShift.value ? FriShift.value.ID : null,
                SatShiftID: SatShift.value ? SatShift.value.ID : null,
                SunShiftID: SunShift.value ? SunShift.value.ID : null,
                MonShiftID2: MonShift2.value ? MonShift2.value.ID : null,
                TueShiftID2: TueShift2.value ? TueShift2.value.ID : null,
                WedShiftID2: WedShift2.value ? WedShift2.value.ID : null,
                ThuShiftID2: ThuShift2.value ? ThuShift2.value.ID : null,
                FriShiftID2: FriShift2.value ? FriShift2.value.ID : null,
                SatShiftID2: SatShift2.value ? SatShift2.value.ID : null,
                SunShiftID2: SunShift2.value ? SunShift2.value.ID : null
            };
        }

        if (isSend) {
            params = {
                ...params,
                SendEmailStatus: 'E_SUBMIT',
                Host: uriPor,
                IsAddNewAndSendMail: true
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Att_Roster', params).then(data => {
            this.isProcessing = false;
            VnrLoadingSevices.hide();
            try {
                if (data) {
                    if (data.ActionStatus == 'Success') {
                        this.listWarningRoster = [];

                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);

                        if (isCreate) {
                            this.refreshView();
                        } else {
                            navigation.goBack();
                        }

                        const { reload } = navigation.state.params;
                        if (reload && typeof reload === 'function') {
                            reload();
                        }

                        NotificationsService.getListUserPushNotify();
                    } else if (data.IsOverrideRosterQuestion) {
                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            icon: `${Platform.OS === 'ios' ? 'ios-' : 'md-'}checkmark-circle`,
                            iconColor: Colors.danger,
                            message: translate('HRM_Att_Roster_IsOverrideRosterQuestion'),
                            onCancel: () => {},
                            onConfirm: () => {
                                this.paramsExtend = {
                                    ...this.paramsExtend,
                                    IsOverrideRosterQuestion: true
                                };
                                this.saveNotRegisterHelp(navigation, isCreate, isSend);
                            }
                        });
                    }
                    // Kiểm tra có vượt quá 12 tiếng hay không
                    else if (
                        data.IsPregnancyWorkingNightShift &&
                        !this.listWarningRoster.includes('IsPregnancyWorkingNightShift')
                    ) {
                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_INFO,
                            message: data.ActionStatus,
                            onCancel: () => {},
                            onConfirm: () => {
                                this.listWarningRoster.push('IsPregnancyWorkingNightShift');
                                this.paramsExtend = {
                                    ...this.paramsExtend,
                                    IsPregnancyWorkingNightShift: true
                                };
                                this.saveNotRegisterHelp(navigation, isCreate, isSend);
                            }
                        });
                    } else if (data.IsCheckRequestShift && !this.listWarningRoster.includes('IsCheckRequestShift')) {
                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_INFO,
                            message: data.ActionStatus,
                            onCancel: () => {},
                            onConfirm: () => {
                                this.listWarningRoster.push('IsCheckRequestShift');
                                this.paramsExtend = {
                                    ...this.paramsExtend,
                                    IsCheckRequestShift: true
                                };
                                this.saveNotRegisterHelp(navigation, isCreate, isSend);
                            }
                        });
                    }
                    // Kiểm tra có vượt quá 12 tiếng hay không
                    else if (
                        data.IsRosterNonContinue12Hour &&
                        !this.listWarningRoster.includes('IsRosterNonContinue12Hour')
                    ) {
                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_INFO,
                            message: data.ActionStatus,
                            onCancel: () => {},
                            onConfirm: () => {
                                this.listWarningRoster.push('IsRosterNonContinue12Hour');
                                this.paramsExtend = {
                                    ...this.paramsExtend,
                                    IsRosterNonContinue12Hour: true
                                };
                                this.saveNotRegisterHelp(navigation, isCreate, isSend);
                            }
                        });
                    } else if (
                        data.IsRosterNightNonContinue2Weekly &&
                        !this.listWarningRoster.includes('IsRosterNightNonContinue2Weekly')
                    ) {
                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_INFO,
                            message: data.ActionStatus,
                            onCancel: () => {},
                            onConfirm: () => {
                                this.listWarningRoster.push('IsRosterNightNonContinue2Weekly');
                                this.paramsExtend = {
                                    ...this.paramsExtend,
                                    IsRosterNightNonContinue2Weekly: true
                                };
                                this.saveNotRegisterHelp(navigation, isCreate, isSend);
                            }
                        });
                    } else if (data.IsMaxDayOFFInWeek && !this.listWarningRoster.includes('IsMaxDayOFFInWeek')) {
                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_INFO,
                            message: data.ActionStatus,
                            onCancel: () => {},
                            onConfirm: () => {
                                this.listWarningRoster.push('IsMaxDayOFFInWeek');
                                this.paramsExtend = {
                                    ...this.paramsExtend,
                                    IsMaxDayOFFInWeek: true
                                };
                                this.saveNotRegisterHelp(navigation, isCreate, isSend);
                            }
                        });
                    } else if (data.ActionStatus == 'Warning_EditRosterOnDateChange') {
                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_WARNING,
                            message: data.ActionStatus1,
                            onCancel: () => {},
                            onConfirm: () => {
                                this.listWarningRoster.push('IsValidateWarningEditRosterOnDateChange');
                                this.paramsExtend = {
                                    ...this.paramsExtend,
                                    IsValidateWarningEditRosterOnDateChange: true
                                };
                                this.saveNotRegisterHelp(navigation, isCreate, isSend);
                            }
                        });
                    } else if (data.ActionStatus == 'Block_EditRosterOnDateChange') {
                        ToasterSevice.showWarning(data.ActionStatus1, 4000);
                        return;
                    } else if (typeof data.ActionStatus === 'string') {
                        ToasterSevice.showWarning(translate(data.ActionStatus), 4000);
                    }
                } else {
                    DrawerServices.navigate('ErrorScreen', {
                        ErrorDisplay: { AttSubmitRosterAddOrEdit: 'Error create roster' }
                    });
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    hasChange = () => {
        if (this.isRegisterHelp) {
            const {
                UserApprove,
                UserApprove3,
                UserApprove4,
                UserApprove2,
                TimeLog,
                TimeLogTime,
                TimeLogOut,
                TimeLogTimeOut,
                MissInOutReason,
                Profiles,
                Type,
                OrgStructures,
                ProfilesExclude,
                MachineNo,
                CardCode,
                Comment,
                RejectReason,
                isChoseProfile
            } = this.state;

            let params = {
                Type: Type ? (Type.value ? Type.value.Value : null) : null,
                TimeLog: TimeLog ? TimeLog.value : null,
                TimeLogTime: TimeLogTime ? TimeLogTime.value : null,
                TimeLogOut,
                TimeLogTimeOut,
                MachineNo,
                CardCode,
                Comment,
                RejectReason,
                MissInOutReason: MissInOutReason ? (MissInOutReason.value ? MissInOutReason.value.ID : null) : null,
                ProfileID: null,
                UserApproveID: UserApprove ? (UserApprove.value ? UserApprove.value.ID : null) : null,
                UserApproveID2: UserApprove2 ? (UserApprove2.value ? UserApprove2.value.ID : null) : null,
                UserApproveID3: UserApprove3 ? (UserApprove3.value ? UserApprove3.value.ID : null) : null,
                UserApproveID4: UserApprove4 ? (UserApprove4.value ? UserApprove4.value.ID : null) : null
            };

            if (isChoseProfile) {
                params = {
                    ...params,
                    ProfileIds: Profiles.value ? Profiles.value.map(item => item.ID).join() : null,
                    OrgStructureIDs: null,
                    ProfileIDsExclude: null
                };
            } else {
                params = {
                    ...params,
                    ProfileIDsExclude: ProfilesExclude.value ? ProfilesExclude.value.map(item => item.ID).join() : null,
                    OrgStructureIDs: OrgStructures.value
                        ? OrgStructures.value.map(item => item.OrderNumber).join()
                        : null,
                    ProfileIds: null
                };
            }

            let isHasChange = false;
            let key = '';
            for (key in params) {
                if (params[key] && params[key] !== '') {
                    isHasChange = true;
                    break;
                }
            }

            if (isHasChange) {
                this.alertHasChangeData();
            } else {
                this.props.navigation.navigate('AttSubmitTSLRegister');
            }
        } else {
            const {
                UserApprove,
                UserApprove3,
                UserApprove4,
                UserApprove2,
                TimeLog,
                TimeLogTime,
                TimeLogOut,
                TimeLogTimeOut,
                MissInOutReason,
                Type,
                MachineNo,
                CardCode,
                Comment,
                RejectReason
            } = this.state;

            let params = {
                MachineNo,
                CardCode,
                Comment,
                RejectReason,
                ProfileIds: null,
                OrgStructureIDs: null,
                ProfileIDsExclude: null,
                TimeLog: TimeLog ? TimeLog.value : null,
                TimeLogTime: TimeLogTime ? TimeLogTime.value : null,
                TimeLogOut,
                TimeLogTimeOut,
                MissInOutReason: MissInOutReason ? (MissInOutReason.value ? MissInOutReason.value.ID : null) : null,
                Type: Type ? (Type.value ? Type.value.Value : null) : null,
                UserApproveID: UserApprove ? (UserApprove.value ? UserApprove.value.ID : null) : null,
                UserApproveID2: UserApprove2 ? (UserApprove2.value ? UserApprove2.value.ID : null) : null,
                UserApproveID3: UserApprove3 ? (UserApprove3.value ? UserApprove3.value.ID : null) : null,
                UserApproveID4: UserApprove4 ? (UserApprove4.value ? UserApprove4.value.ID : null) : null
            };

            let isHasChange = false;
            let key = '';
            for (key in params) {
                if (params[key] && params[key] !== '') {
                    isHasChange = true;
                    break;
                }
            }

            if (isHasChange) {
                this.alertHasChangeData();
            } else {
                this.props.navigation.navigate('AttSubmitTSLRegister');
            }
        }
    };

    //check đăng ký hộ
    checkAllowRegisterHelp = record => {
        //New_Att_TAMScanLog_Register_Help

        VnrLoadingSevices.show();
        let checkPermissionHelp = false;
        HttpService.Get('[URI_HR]/Att_GetData/GetSettingByKey?Key=HRM_ATT_CONFIG_ISALLOWREGISTROSTERONPORTAL').then(
            data => {
                VnrLoadingSevices.hide();
                try {
                    if (data && data.Value1) {
                        // đăng ký hộ
                        if (checkPermissionHelp) {
                            this.isRegisterHelp = true;
                            this.initData(record);
                        }
                        //không đăng ký hộ
                        else {
                            this.isRegisterHelp = false;
                            this.initData(record);
                        }
                    }
                    //không đăng ký hộ
                    else {
                        this.isRegisterHelp = false;
                        this.initData(record);
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            }
        );
    };

    getConfigTypeAndDataShiftType = () => {
        VnrLoadingSevices.show();
        HttpService.MultiRequest([
            HttpService.Post('[URI_SYS]/Sys_GetData/GetEnum?text=ChangeShiftType'),
            HttpService.Get('[URI_HR]/Att_GetData/GetAllowShifType?isPortal=true'),
            HttpService.Get(
                '[URI_HR]/Att_GetData/GetConfigIsNotAllowResgistInPortal?Key=HRM_ATT_CONFIG_ISSHOWTWOSHIFTINDAY'
            ),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiShiftByOrdernumberinPortal'),
            HttpService.Get('[URI_SYS]/Sys_GetData/GetEnum?text=RosterType'),
            HttpService.Post('[URI_HR]/Att_GetData/GetConfigByKey', {
                key: 'HRM_ATT_WORKDAY_ISALLOWEDITROSTERONDATECHANGE'
            })
        ]).then(resAll => {
            VnrLoadingSevices.hide();
            try {
                if (resAll) {
                    const {
                            ChangeShiftType,
                            Type,
                            MonShift,
                            MonShift2,
                            TueShift,
                            TueShift2,
                            WedShift,
                            WedShift2,
                            ThuShift,
                            ThuShift2,
                            FriShift,
                            FriShift2,
                            SatShift,
                            SatShift2,
                            SunShift,
                            SunShift2
                        } = this.state,
                        dataShiftType = resAll[0],
                        dataCheckConfigAllowEditRoster = resAll[5],
                        config = resAll[1],
                        _isShowRoster2 = resAll[2],
                        _shiftType = dataShiftType.find(item => item.Value === 'E_LC'),
                        _textShiftType = _shiftType ? _shiftType.Text : null;

                    let _dataShift = [];
                    if (resAll[3] && Array.isArray(resAll[3])) {
                        _dataShift = [...resAll[3]];
                    }

                    let _dataType = [];
                    if (resAll[4] && Array.isArray(resAll[4])) {
                        _dataType = resAll[4];
                    }

                    let nextState = {
                        ChangeShiftType: {
                            data: [...dataShiftType],
                            value: { Value: 'E_LC', Text: _textShiftType },
                            refresh: !ChangeShiftType.refresh
                        },
                        MonShift: {
                            ...MonShift,
                            data: [..._dataShift],
                            refresh: !MonShift2.refresh
                        },
                        TueShift: {
                            ...TueShift,
                            data: [..._dataShift],
                            refresh: !TueShift.refresh
                        },
                        WedShift: {
                            ...WedShift,
                            data: [..._dataShift],
                            refresh: !WedShift.refresh
                        },
                        ThuShift: {
                            ...ThuShift,
                            data: [..._dataShift],
                            refresh: !ThuShift.refresh
                        },
                        FriShift: {
                            ...FriShift,
                            data: [..._dataShift],
                            refresh: !FriShift.refresh
                        },
                        SatShift: {
                            ...SatShift,
                            data: [..._dataShift],
                            refresh: !SatShift.refresh
                        },
                        SunShift: {
                            ...SunShift,
                            data: [..._dataShift],
                            refresh: !SunShift.refresh
                        }
                    };

                    if (_isShowRoster2 && _isShowRoster2 == true) {
                        this.configIsShowRoster2 = true;
                        nextState = {
                            ...nextState,
                            isShowRoster2: true,
                            MonShift2: {
                                ...MonShift2,
                                data: [..._dataShift],
                                refresh: !MonShift2.refresh
                            },
                            TueShift2: {
                                ...TueShift2,
                                data: [..._dataShift],
                                refresh: !TueShift2.refresh
                            },
                            WedShift2: {
                                ...WedShift2,
                                data: [..._dataShift],
                                refresh: !WedShift2.refresh
                            },
                            ThuShift2: {
                                ...ThuShift2,
                                data: [..._dataShift],
                                refresh: !ThuShift2.refresh
                            },
                            FriShift2: {
                                ...FriShift2,
                                data: [..._dataShift],
                                refresh: !FriShift2.refresh
                            },
                            SatShift2: {
                                ...SatShift2,
                                data: [..._dataShift],
                                refresh: !SatShift2.refresh
                            },
                            SunShift2: {
                                ...SunShift2,
                                data: [..._dataShift],
                                refresh: !SunShift2.refresh
                            }
                        };
                    }

                    if (config && config !== '') {
                        let _type = _dataType.find(item => item.Value === config),
                            _textType = _type ? _type.Text : '',
                            objValType = _type ? { Text: _textType, Value: config } : null;

                        nextState = {
                            ...nextState,
                            Type: {
                                ...Type,
                                data: [..._dataType],
                                value: objValType,
                                refresh: !Type.refresh
                            }
                        };

                        if (config === 'E_SHIFT_MANUAL') {
                            const { DateEnd } = this.state;
                            nextState = {
                                ...nextState,
                                DateEnd: {
                                    ...DateEnd,
                                    disable: true
                                }
                            };
                        } else if (config === 'E_ROSTERGROUP') {
                            const { RosterGroupName } = this.state;
                            nextState = {
                                ...nextState,
                                RosterGroupName: {
                                    ...RosterGroupName,
                                    visible: true
                                }
                            };
                        } else if (config === 'E_CHANGE_SHIFT_COMPANSATION') {
                            const { DateChange } = this.state;
                            nextState = {
                                ...nextState,
                                DateChange: {
                                    ...DateChange,
                                    visible: true
                                }
                            };
                        }
                    } else {
                        nextState = {
                            ...nextState,
                            Type: {
                                ...Type,
                                data: [..._dataType],
                                refresh: !Type.refresh
                            }
                        };
                    }

                    // lấy cấu hình Disable field
                    if (
                        dataCheckConfigAllowEditRoster &&
                        (dataCheckConfigAllowEditRoster.Value1 == 'true' ||
                            dataCheckConfigAllowEditRoster.Value1 == 'True')
                    ) {
                        nextState = {
                            ...nextState,
                            isAllowEditRosterOnDateChange: true
                        };
                    }

                    this.setState(nextState);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    //promise get config valid
    getConfigValid = (tblName, isRefresh) => {
        VnrLoadingSevices.show();
        HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName).then(res => {
            VnrLoadingSevices.hide();
            if (res) {
                try {

                    const _configField = ConfigField && ConfigField.value['AttSubmitRosterAddOrEdit']
                        ? ConfigField.value['AttSubmitRosterAddOrEdit']['Hidden']
                        : [];

                    let nextState = { fieldValid: res };

                    _configField.forEach(fieldConfig => {
                        let _field = this.state[fieldConfig];
                        if (_field && typeof _field === 'object') {
                            _field = {
                                ..._field,
                                visibleConfig: false
                            };

                            nextState = {
                                ...nextState,
                                [fieldConfig]: { ..._field }
                            };
                        }
                    });

                    this.setState(nextState, () => {
                        enumName = EnumName;
                        profileInfo = dataVnrStorage
                            ? dataVnrStorage.currentUser
                                ? dataVnrStorage.currentUser.info
                                : null
                            : null;

                        let { record } = !isRefresh ? this.props.navigation.state.params : {};

                        //get config khi đăng ký
                        if (!record) {
                            this.getConfigTypeAndDataShiftType();
                            this.isRegisterHelp = false;
                            this.initData(null);
                        } else {
                            this.isModify = true;
                            this.getRecordAndConfigByID(record, this.handleSetState);
                        }
                    });
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            }
        });
    };

    getConfigMultiShift = () => {
        HttpService.Post('[URI_HR]/Por_GetData/GetConfigByKey', {
            key: 'HRM_ATT_ROSTER_ISALLOWSREGISTRATIONMULTIPLESHIFTS'
        }).then(res => {
            this.setState({
                isConfigFromServer: res === 'True' ? true : false
            });
        });
    };

    componentDidMount() {
        //get config validate
        this.getConfigValid('Att_Roster_Potal');
    }

    getValueSame = (arrayA, arrayB) => {
        let rsArray = [];
        arrayA.map(a => {
            arrayB.find(b => {
                if (a === b.ID) {
                    b.isSelect = true;
                    rsArray.push(b);
                    return b;
                }
            });
        });

        return rsArray;
    };

    handleSetState = (_id, res) => {
        const response = res[0],
            highSupervisor = res[1],
            levelApprove = res[2],
            dataType = res[3],
            dataChangeShiftType = res[4],
            isShowRoster2 = res[5],
            dataShift = res[6],
            dataCheckConfigAllowEditRoster = res[7],
            isConfigFromServer = res[8],
            {
                ChangeShiftType,
                Type,
                MonShift,
                MonShift2,
                TueShift,
                TueShift2,
                DateStart,
                DateEnd,
                DateChange,
                WedShift,
                WedShift2,
                ThuShift,
                ThuShift2,
                FriShift,
                FriShift2,
                SatShift,
                SatShift2,
                RosterGroupName,
                SunShift,
                SunShift2,
                UserApprove,
                UserApprove2,
                UserApprove3,
                UserApprove4,
                Comment,
                SubstituteShiftID,
                ChangeShiftID
            } = this.state;

        let _dataShift = [],
            _dataType = [],
            _dataChangeShiftType = [];
        if (dataShift && Array.isArray(dataShift)) {
            _dataShift = dataShift;
        }

        let valueType = null;
        if (dataType && Array.isArray(dataType)) {
            _dataType = dataType;

            response['Type'] ? { Text: response['TypeView'], Value: response['Type'] } : null;
            if (response['Type']) {
                valueType = _dataType.find(item => item.Value == response['Type']);
            }
        }

        if (dataChangeShiftType && Array.isArray(dataChangeShiftType)) {
            _dataChangeShiftType = dataChangeShiftType;
        }
        let nextState = {
            ID: _id,

            UserApprove: {
                ...UserApprove,
                refresh: !UserApprove.refresh,
                value: response['UserApproveID']
                    ? { UserInfoName: response['UserApproveIDName'], ID: response['UserApproveID'] }
                    : null
            },
            UserApprove3: {
                ...UserApprove3,
                refresh: !UserApprove3.refresh,
                value: response['UserApproveID3']
                    ? { UserInfoName: response['UserApprove3IDName'], ID: response['UserApproveID3'] }
                    : null
            },
            UserApprove4: {
                ...UserApprove4,
                refresh: !UserApprove4.refresh,
                value: response['UserApproveID4']
                    ? { UserInfoName: response['UserApprove4IDName'], ID: response['UserApproveID4'] }
                    : null
            },
            UserApprove2: {
                ...UserApprove2,
                refresh: !UserApprove2.refresh,
                value: response['UserApproveID2']
                    ? { UserInfoName: response['UserApprove2IDName'], ID: response['UserApproveID2'] }
                    : null
            },
            ProfileID: {
                ID: response['ProfileID'],
                ProfileName: response['ProfileName']
            },
            DateStart: {
                ...DateStart,
                refresh: !DateStart.refresh,
                value: response['DateStart']
            },
            DateEnd: {
                ...DateEnd,
                refresh: !DateEnd.refresh,
                value: response['DateEnd']
            },
            DateChange: {
                ...DateChange,
                refresh: !DateChange.refresh,
                value: response['DateChange']
            },
            RosterGroupName: {
                ...RosterGroupName,
                refresh: !RosterGroupName.refresh,
                value: response['RosterGroupName']
                    ? { Value: response['RosterGroupName'], Key: response['RosterGroupName'] }
                    : null
            },
            Type: {
                ...Type,
                data: [..._dataType],
                value: { ...valueType },
                refresh: !Type.refresh
            },
            ChangeShiftType: {
                ...ChangeShiftType,
                data: [..._dataChangeShiftType],
                value: response['ChangeShiftType']
                    ? { Text: response['ChangeShiftTypeView'], Value: response['ChangeShiftType'] }
                    : null,
                refresh: !ChangeShiftType.refresh
            },
            Comment: {
                ...Comment,
                disable: false,
                value: response['Comment'],
                refresh: !Comment.refresh
            }
        };

        let temp = isConfigFromServer === 'True' ? true : false;
        let isType =
            valueType &&
            temp === true &&
            (valueType.Value === 'E_SHIFT_MANUAL' ||
                valueType.Value === 'E_CHANGE_SHIFT' ||
                valueType.Value === 'E_DEFAULT');

        // debugger
        if (isType) {
            nextState = {
                ...nextState,
                MonShift: {
                    ...MonShift,
                    data: [..._dataShift],
                    disable: false,
                    refresh: !MonShift.refresh,
                    value: response['MonShiftIDs']
                        ? this.getValueSame(response['MonShiftIDs'].split(','), _dataShift)
                        : null
                },
                TueShift: {
                    ...TueShift,
                    data: [..._dataShift],
                    refresh: !TueShift.refresh,
                    disable: false,
                    value: response['TueShiftIDs']
                        ? this.getValueSame(response['TueShiftIDs'].split(','), _dataShift)
                        : null
                },
                WedShift: {
                    ...WedShift,
                    data: [..._dataShift],
                    refresh: !WedShift.refresh,
                    disable: false,
                    value: response['WedShiftIDs']
                        ? this.getValueSame(response['WedShiftIDs'].split(','), _dataShift)
                        : null
                },
                ThuShift: {
                    ...ThuShift,
                    data: [..._dataShift],
                    refresh: !ThuShift.refresh,
                    disable: false,
                    value: response['ThuShiftIDs']
                        ? this.getValueSame(response['ThuShiftIDs'].split(','), _dataShift)
                        : null
                },
                FriShift: {
                    ...FriShift,
                    data: [..._dataShift],
                    disable: false,
                    refresh: !FriShift.refresh,
                    value: response['FriShiftIDs']
                        ? this.getValueSame(response['FriShiftIDs'].split(','), _dataShift)
                        : null
                },
                SatShift: {
                    ...SatShift,
                    data: [..._dataShift],
                    refresh: !SatShift.refresh,
                    disable: false,
                    value: response['SatShiftIDs']
                        ? this.getValueSame(response['SatShiftIDs'].split(','), _dataShift)
                        : null
                },
                SunShift: {
                    ...SunShift,
                    data: [..._dataShift],
                    refresh: !SunShift.refresh,
                    disable: false,
                    value: response['SunShiftIDs']
                        ? this.getValueSame(response['SunShiftIDs'].split(','), _dataShift)
                        : null
                }
            };
        } else {
            nextState = {
                ...nextState,
                MonShift: {
                    ...MonShift,
                    data: [..._dataShift],
                    disable: false,
                    refresh: !MonShift.refresh,
                    value: response['MonShiftID']
                        ? { ShiftName: response['MonShiftName'], ID: response['MonShiftID'] }
                        : null
                },
                MonShift2: {
                    ...MonShift2,
                    data: [..._dataShift],
                    disable: false,
                    refresh: !MonShift2.refresh,
                    value: response['MonShift2ID']
                        ? { ShiftName: response['MonShift2Name'], ID: response['MonShift2ID'] }
                        : null
                },
                TueShift: {
                    ...TueShift,
                    data: [..._dataShift],
                    refresh: !TueShift.refresh,
                    disable: false,
                    value: response['TueShiftID']
                        ? { ShiftName: response['TueShiftName'], ID: response['TueShiftID'] }
                        : null
                },
                TueShift2: {
                    ...TueShift2,
                    data: [..._dataShift],
                    refresh: !TueShift2.refresh,
                    disable: false,
                    value: response['TueShift2ID']
                        ? { ShiftName: response['TueShift2Name'], ID: response['TueShift2ID'] }
                        : null
                },
                WedShift: {
                    ...WedShift,
                    data: [..._dataShift],
                    refresh: !WedShift.refresh,
                    disable: false,
                    value: response['WedShiftID']
                        ? { ShiftName: response['WedShiftName'], ID: response['WedShiftID'] }
                        : null
                },
                WedShift2: {
                    ...WedShift2,
                    data: [..._dataShift],
                    refresh: !WedShift2.refresh,
                    disable: false,
                    value: response['WedShift2ID']
                        ? { ShiftName: response['WedShift2Name'], ID: response['WedShift2ID'] }
                        : null
                },
                ThuShift: {
                    ...ThuShift,
                    data: [..._dataShift],
                    refresh: !ThuShift.refresh,
                    disable: false,
                    value: response['ThuShiftID']
                        ? { ShiftName: response['ThuShiftName'], ID: response['ThuShiftID'] }
                        : null
                },
                ThuShift2: {
                    ...ThuShift2,
                    data: [..._dataShift],
                    disable: false,
                    refresh: !ThuShift2.refresh,
                    value: response['ThuShift2ID']
                        ? { ShiftName: response['ThuShift2Name'], ID: response['ThuShift2ID'] }
                        : null
                },
                FriShift: {
                    ...FriShift,
                    data: [..._dataShift],
                    disable: false,
                    refresh: !FriShift.refresh,
                    value: response['FriShiftID']
                        ? { ShiftName: response['FriShiftName'], ID: response['FriShiftID'] }
                        : null
                },
                FriShift2: {
                    ...FriShift2,
                    data: [..._dataShift],
                    disable: false,
                    refresh: !FriShift2.refresh,
                    value: response['FriShift2ID']
                        ? { ShiftName: response['FriShift2Name'], ID: response['FriShift2ID'] }
                        : null
                },
                SatShift: {
                    ...SatShift,
                    data: [..._dataShift],
                    refresh: !SatShift.refresh,
                    disable: false,
                    value: response['SatShiftID']
                        ? { ShiftName: response['SatShiftName'], ID: response['SatShiftID'] }
                        : null
                },
                SatShift2: {
                    ...SatShift2,
                    data: [..._dataShift],
                    refresh: !SatShift2.refresh,
                    disable: false,
                    value: response['SatShift2ID']
                        ? { ShiftName: response['SatShift2Name'], ID: response['SatShift2ID'] }
                        : null
                },
                SunShift: {
                    ...SunShift,
                    data: [..._dataShift],
                    refresh: !SunShift.refresh,
                    disable: false,
                    value: response['SunShiftID']
                        ? { ShiftName: response['SunShiftName'], ID: response['SunShiftID'] }
                        : null
                },
                SunShift2: {
                    ...SunShift2,
                    data: [..._dataShift],
                    disable: false,
                    refresh: !SunShift2.refresh,
                    value: response['SunShift2ID']
                        ? { ShiftName: response['SunShift2Name'], ID: response['SunShift2ID'] }
                        : null
                }
            };
        }

        if (isShowRoster2) {
            nextState = {
                ...nextState,
                isShowRoster2: true
            };
        }

        if (response['Type'] == 'E_ROSTERGROUP') {
            nextState = {
                ...nextState,
                isShowRoster: false,
                RosterGroupName: {
                    ...nextState.RosterGroupName,
                    visible: true
                }
            };
        } else if (response['Type'] == 'E_CHANGE_SHIFT_COMPANSATION') {
            //isShowEle(frm + ' #divDateChange', true);
            nextState = {
                ...nextState,
                DateChange: {
                    ...nextState.DateChange,
                    visible: true
                },
                SubstituteShiftID: {
                    ...SubstituteShiftID,
                    value: response.SubstituteShiftID
                        ? { ID: response.SubstituteShiftID, ShiftName: response.SubstituteShiftName }
                        : null,
                    visible: true,
                    refresh: !SubstituteShiftID.refresh
                },
                ChangeShiftID: {
                    ...ChangeShiftID,
                    value: response.ChangeShiftID
                        ? { ID: response.ChangeShiftID, ShiftName: response.ChangeShiftName }
                        : null,
                    visible: true,
                    refresh: !ChangeShiftID.refresh
                },
                isShowRoster: false
            };
        }

        if (highSupervisor.IsChangeApprove) {
            this.isChangeLevelApprove = true;
            // $('#UserApproveID').data('kendoComboBox').readonly(false);
            // $('#UserApproveID2').data('kendoComboBox').readonly(false);
            // $('#UserApproveID3').data('kendoComboBox').readonly(false);
            // $('#UserApproveID4').data('kendoComboBox').readonly(false);
        }

        if (levelApprove == 4) {
            // isShowEle('#idUserApproveID3', true);
            // isShowEle('#idUserApproveID4', true);
            nextState = {
                ...nextState,
                UserApprove3: {
                    ...nextState.UserApprove3,
                    visible: true
                },
                UserApprove4: {
                    ...nextState.UserApprove4,
                    visible: true
                }
            };
        } else if (levelApprove == 3) {
            // isShowEle('#idUserApproveID3', true);
            // isShowEle('#idUserApproveID4');
            nextState = {
                ...nextState,
                UserApprove3: {
                    ...nextState.UserApprove3,
                    visible: true
                },
                UserApprove4: {
                    ...nextState.UserApprove4,
                    visible: false
                }
            };
        } else if (levelApprove == 1) {
            //
        } else {
            // isShowEle('#idUserApproveID3');
            // isShowEle('#idUserApproveID4');
            nextState = {
                ...nextState,
                UserApprove3: {
                    ...nextState.UserApprove3,
                    visible: false
                },
                UserApprove4: {
                    ...nextState.UserApprove4,
                    visible: false
                }
            };
        }

        // lấy cấu hình Disable field
        if (
            dataCheckConfigAllowEditRoster &&
            (dataCheckConfigAllowEditRoster.Value1 == 'true' || dataCheckConfigAllowEditRoster.Value1 == 'True')
        ) {
            nextState = {
                ...nextState,
                isAllowEditRosterOnDateChange: true
            };
        }

        this.isRegisterHelp = false;

        this.setState({ ...nextState, isConfigFromServer: isConfigFromServer === 'True' ? true : false }, () => {
            // load enable/disable ca
            nextState.isAllowEditRosterOnDateChange && this.ChangeShiftByConfig(response);
        });
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        const { ID, ProfileID, DateEnd, DateStart, RosterGroupName } = record;
        VnrLoadingSevices.show();
        HttpService.MultiRequest([
            HttpService.Get('[URI_HR]/api/Att_Roster?id=' + ID),
            HttpService.Post('[URI_HR]/Att_GetData/GetHighSupervisor', {
                ProfileID: ProfileID,
                userSubmit: ProfileID,
                type: 'E_ROSTER'
            }),
            HttpService.Post('[URI_HR]/Att_GetData/GetLevelApprovedRoster', {
                ProfileID: ProfileID,
                userSubmit: ProfileID,
                dateStart: DateStart ? moment(DateStart).format('YYYY-MM-DD HH:mm:ss') : null,
                dateEnd: DateEnd ? moment(DateEnd).format('YYYY-MM-DD HH:mm:ss') : null,
                rosterGroupName: RosterGroupName
            }),
            // HttpService.Post('[URI_HR]/Att_GetData/GetEnumRosterTypeByGradeAttendance', {
            //     ProfileIds: ProfileID,
            //     DateEnd: DateEnd ? moment(DateEnd).format('YYYY-MM-DD HH:mm:ss') : null,
            // }),
            HttpService.Get('[URI_SYS]/Sys_GetData/GetEnum?text=RosterType'),
            HttpService.Post('[URI_SYS]/Sys_GetData/GetEnum?text=ChangeShiftType'),
            HttpService.Get(
                '[URI_HR]/Att_GetData/GetConfigIsNotAllowResgistInPortal?Key=HRM_ATT_CONFIG_ISSHOWTWOSHIFTINDAY'
            ),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiShiftByOrdernumber'),
            HttpService.Post('[URI_HR]/Att_GetData/GetConfigByKey', {
                key: 'HRM_ATT_WORKDAY_ISALLOWEDITROSTERONDATECHANGE'
            }),
            HttpService.Post('[URI_HR]/Por_GetData/GetConfigByKey', {
                key: 'HRM_ATT_ROSTER_ISALLOWSREGISTRATIONMULTIPLESHIFTS'
            })
        ]).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res && res.length == 9) {
                    _handleSetState(ID, res);
                } else {
                    DrawerServices.navigate('ErrorScreen');
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    initData = record => {
        //sửa
        if (record) {
            this.isModify = true;
            //let _id = record.ID;
            this.getRecordAndConfigByID(record, this.handleSetState);
        } else {
            const { E_ProfileID, E_FullName } = enumName;
            let _profile = {
                ID: profileInfo[E_ProfileID],
                ProfileName: profileInfo[E_FullName]
            };
            this.setState({ ProfileID: _profile });
            this.loadHighSupervisor(_profile.ID);
            this.getConfigMultiShift();

            // //không có đăng ký hộ
            // if (!this.isRegisterHelp) {

            //     const { E_ProfileID, E_FullName } = enumName;
            //     let _profile =
            //     {
            //         ID: profileInfo[E_ProfileID],
            //         ProfileName: profileInfo[E_FullName]
            //     };
            //     this.setState({ ProfileID: _profile });
            //     this.loadHighSupervisor(_profile.ID);
            // }
            // else {
            //     //let _profile = { ID: null, ProfileName: '' };
            //     this.setState({ isRefesh: !this.state.isRefesh });
            //     //this.readOnlyCtrlRT(true);
            // }
        }
    };

    RemoveValidateUser = () => {
        // if (co) {
        //     $(frm + ' #remove-condition1 .control-label span').text('');
        //     $(frm + ' #remove-condition2 .control-label span').text('');
        // }
        // else {
        //     $(frm + ' #remove-condition1 .control-label span').text('(*)');
        //     $(frm + ' #remove-condition2 .control-label span').text('(*)');
        // }
    };

    GetHighSupervior = (profileId, type) => {
        const { Profiles } = this.state;

        // //trường hợp chọn NV
        // if (this.isRegisterHelp && isChoseProfile) {
        //     //chọn nhiều NV
        //     if (Profiles.value && Profiles.value.length >= 2) {
        //         this.isRegisterOrgOvertime = true;
        //         this.readOnlyUserApprove(false);
        //         this.RemoveValidateUser(true);
        //     }
        //     else {
        //         this.isRegisterOrgOvertime = false;
        //         this.readOnlyUserApprove(true);
        //         this.RemoveValidateUser(false);
        //     }
        // }
        // //Trường hợp chọn phòng ban
        // else if (this.isRegisterHelp && !isChoseProfile) {
        //     this.isRegisterOrgOvertime = true;
        //     this.readOnlyUserApprove(false);
        //     this.RemoveValidateUser(true);
        // }

        HttpService.Post('[URI_HR]/Att_GetData/GetHighSupervisor', {
            ProfileID: profileId,
            userSubmit: profileId,
            type: type
        }).then(result => {
            try {
                const {
                    UserApprove,
                    UserApprove3,
                    UserApprove4,
                    UserApprove2,
                    DateStart,
                    DateEnd,
                    isChoseProfile,
                    OrgStructures
                } = this.state;

                //truong hop chạy theo approve grade
                if (result.LevelApprove > 0) {
                    //levelApproveOT = result.LevelApprove;
                    if (result.IsChangeApprove == true) {
                        this.isChangeLevelApprove = true;
                    }

                    this.levelApproveRoster = result.LevelApprove;
                    if (result.IsOnlyOneLevelApprove) {
                        this.levelApproveRoster = 1;
                    }
                    if (this.isRegisterOrgOvertime) {
                        if (this.levelApproveRoster == 3) {
                            this.setState({
                                UserApprove3: {
                                    ...UserApprove3,
                                    visible: true
                                }
                            });
                        } else if (this.levelApproveRoster == 4) {
                            this.setState({
                                UserApprove3: {
                                    ...UserApprove3,
                                    visible: true,
                                    refresh: !UserApprove3.refresh
                                },
                                UserApprove4: {
                                    ...UserApprove4,
                                    visible: true,
                                    refresh: !UserApprove4.refresh
                                }
                            });
                        } else {
                            this.setState({
                                UserApprove3: {
                                    ...UserApprove3,
                                    visible: false,
                                    refresh: !UserApprove3.refresh
                                },
                                UserApprove4: {
                                    ...UserApprove4,
                                    visible: false,
                                    refresh: !UserApprove4.refresh
                                }
                            });
                        }
                        this.setState(
                            {
                                UserApprove: {
                                    ...UserApprove,
                                    value: null,
                                    refresh: !UserApprove.refresh
                                },
                                UserApprove3: {
                                    ...UserApprove3,
                                    value: null,
                                    refresh: !UserApprove3.refresh
                                },
                                UserApprove4: {
                                    ...UserApprove4,
                                    visible: null,
                                    refresh: !UserApprove4.refresh
                                },
                                UserApprove2: {
                                    ...UserApprove2,
                                    value: null,
                                    refresh: !UserApprove2.refresh
                                }
                            },
                            () => this.RemoveValidateUser(true)
                        );
                    } else {
                        let nextState = {
                            UserApprove: { ...UserApprove },
                            UserApprove3: { ...UserApprove3 },
                            UserApprove4: { ...UserApprove4 },
                            UserApprove2: { ...UserApprove2 }
                        };

                        if (result.LevelApprove == 2) {
                            if (result.IsOnlyOneLevelApprove) {
                                this.levelApproveRoster = 1;
                                if (result.SupervisorID != null) {
                                    // this.setState({
                                    //     UserApprove: {
                                    //         ...UserApprove,
                                    //         value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID },
                                    //         refresh: !UserApprove.refresh
                                    //     },
                                    //     UserApprove3: {
                                    //         ...UserApprove3,
                                    //         value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID },
                                    //         refresh: !UserApprove3.refresh
                                    //     },
                                    //     UserApprove4: {
                                    //         ...UserApprove4,
                                    //         visible: { UserInfoName: result.SupervisorName, ID: result.SupervisorID },
                                    //         refresh: !UserApprove4.refresh
                                    //     },
                                    //     UserApprove2: {
                                    //         ...UserApprove2,
                                    //         value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID },
                                    //         refresh: !UserApprove2.refresh
                                    //     }
                                    // })

                                    nextState = {
                                        UserApprove: {
                                            ...nextState.UserApprove,
                                            value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                        },
                                        UserApprove3: {
                                            ...nextState.UserApprove3,
                                            value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                        },
                                        UserApprove4: {
                                            ...nextState.UserApprove4,
                                            value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                        },
                                        UserApprove2: {
                                            ...nextState.UserApprove2,
                                            value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                        }
                                    };
                                } else {
                                    // this.setState({
                                    //     UserApprove: {
                                    //         ...UserApprove,
                                    //         value: null,
                                    //         refresh: !UserApprove.refresh
                                    //     },
                                    //     UserApprove3: {
                                    //         ...UserApprove3,
                                    //         value: null,
                                    //         refresh: !UserApprove3.refresh
                                    //     },
                                    //     UserApprove4: {
                                    //         ...UserApprove4,
                                    //         visible: null,
                                    //         refresh: !UserApprove4.refresh
                                    //     },
                                    //     UserApprove2: {
                                    //         ...UserApprove2,
                                    //         value: null,
                                    //         refresh: !UserApprove2.refresh
                                    //     }
                                    // })
                                    nextState = {
                                        UserApprove: {
                                            ...nextState.UserApprove,
                                            value: null
                                        },
                                        UserApprove3: {
                                            ...nextState.UserApprove3,
                                            value: null
                                        },
                                        UserApprove4: {
                                            ...nextState.UserApprove4,
                                            value: null
                                        },
                                        UserApprove2: {
                                            ...nextState.UserApprove2,
                                            value: null
                                        }
                                    };
                                }
                            } else {
                                if (result.SupervisorID != null) {
                                    // this.setState({
                                    //     UserApprove: {
                                    //         ...UserApprove,
                                    //         value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID },
                                    //         refresh: !UserApprove.refresh
                                    //     }
                                    // })
                                    nextState = {
                                        ...nextState,
                                        UserApprove: {
                                            ...nextState.UserApprove,
                                            value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                        }
                                    };
                                } else {
                                    // this.setState({
                                    //     UserApprove: {
                                    //         ...UserApprove,
                                    //         value: null,
                                    //         refresh: !UserApprove.refresh
                                    //     }
                                    // })
                                    nextState = {
                                        ...nextState,
                                        UserApprove: {
                                            ...nextState.UserApprove,
                                            value: null
                                        }
                                    };
                                }

                                if (result.MidSupervisorID != null) {
                                    // this.setState({
                                    //     UserApprove2: {
                                    //         ...UserApprove2,
                                    //         value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID },
                                    //         refresh: !UserApprove2.refresh
                                    //     },
                                    //     UserApprove3: {
                                    //         ...UserApprove3,
                                    //         value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID },
                                    //         refresh: !UserApprove3.refresh
                                    //     },
                                    //     UserApprove4: {
                                    //         ...UserApprove4,
                                    //         value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID },
                                    //         refresh: !UserApprove4.refresh
                                    //     }
                                    // })

                                    nextState = {
                                        UserApprove: {
                                            ...nextState.UserApprove
                                        },
                                        UserApprove2: {
                                            ...nextState.UserApprove2,
                                            value: {
                                                UserInfoName: result.SupervisorNextName,
                                                ID: result.MidSupervisorID
                                            }
                                        },
                                        UserApprove3: {
                                            ...nextState.UserApprove3,
                                            value: {
                                                UserInfoName: result.SupervisorNextName,
                                                ID: result.MidSupervisorID
                                            }
                                        },
                                        UserApprove4: {
                                            ...nextState.UserApprove4,
                                            value: {
                                                UserInfoName: result.SupervisorNextName,
                                                ID: result.MidSupervisorID
                                            }
                                        }
                                    };
                                } else {
                                    // this.setState({
                                    //     UserApprove2: {
                                    //         ...UserApprove2,
                                    //         value: null,
                                    //         refresh: !UserApprove2.refresh
                                    //     },
                                    //     UserApprove3: {
                                    //         ...UserApprove3,
                                    //         value: null,
                                    //         refresh: !UserApprove3.refresh
                                    //     },
                                    //     UserApprove4: {
                                    //         ...UserApprove4,
                                    //         value: null,
                                    //         refresh: !UserApprove4.refresh
                                    //     }
                                    // })

                                    nextState = {
                                        UserApprove: {
                                            ...nextState.UserApprove
                                        },
                                        UserApprove2: {
                                            ...nextState.UserApprove2,
                                            value: null
                                        },
                                        UserApprove3: {
                                            ...nextState.UserApprove3,
                                            value: null
                                        },
                                        UserApprove4: {
                                            ...nextState.UserApprove4,
                                            value: null
                                        }
                                    };
                                }
                            }

                            // this.setState({
                            //     UserApprove3: {
                            //         ...UserApprove3,
                            //         visible: false,
                            //         refresh: !UserApprove3.refresh
                            //     }
                            // })

                            nextState = {
                                UserApprove: {
                                    ...nextState.UserApprove,
                                    refresh: !nextState.UserApprove.refresh
                                },
                                UserApprove3: {
                                    ...nextState.UserApprove3,
                                    visible: false,
                                    refresh: !nextState.UserApprove3.refresh
                                },
                                UserApprove4: {
                                    ...nextState.UserApprove4,
                                    refresh: !nextState.UserApprove4.refresh
                                },
                                UserApprove2: {
                                    ...nextState.UserApprove2,
                                    refresh: !nextState.UserApprove2.refresh
                                }
                            };
                        } else if (result.LevelApprove == 3) {
                            if (result.SupervisorID != null) {
                                // this.setState({
                                //     UserApprove: {
                                //         ...UserApprove,
                                //         value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID },
                                //         refresh: !UserApprove.refresh
                                //     }
                                // })

                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                    }
                                };
                            } else {
                                // this.setState({
                                //     UserApprove: {
                                //         ...UserApprove,
                                //         value: null,
                                //         refresh: !UserApprove.refresh
                                //     }
                                // })
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        value: null
                                    }
                                };
                            }

                            if (result.MidSupervisorID != null) {
                                // this.setState({
                                //     UserApprove3: {
                                //         ...UserApprove3,
                                //         value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID },
                                //         refresh: !UserApprove3.refresh
                                //     }
                                // })
                                nextState = {
                                    ...nextState,
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                    }
                                };
                            } else {
                                // this.setState({
                                //     UserApprove3: {
                                //         ...UserApprove3,
                                //         value: null,
                                //         refresh: !UserApprove3.refresh
                                //     }
                                // })
                                nextState = {
                                    ...nextState,
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        value: null
                                    }
                                };
                            }

                            if (result.NextMidSupervisorID != null) {
                                // this.setState({
                                //     UserApprove4: {
                                //         ...UserApprove4,
                                //         value: { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID },
                                //         refresh: !UserApprove4.refresh
                                //     },
                                //     UserApprove2: {
                                //         ...UserApprove2,
                                //         value: { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID },
                                //         refresh: !UserApprove2.refresh
                                //     }
                                // })

                                nextState = {
                                    ...nextState,
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        value: {
                                            UserInfoName: result.NextMidSupervisorName,
                                            ID: result.NextMidSupervisorID
                                        }
                                    },
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: {
                                            UserInfoName: result.NextMidSupervisorName,
                                            ID: result.NextMidSupervisorID
                                        }
                                    }
                                };
                            } else {
                                // this.setState({
                                //     UserApprove4: {
                                //         ...UserApprove4,
                                //         value: null,
                                //         refresh: !UserApprove4.refresh
                                //     },
                                //     UserApprove2: {
                                //         ...UserApprove2,
                                //         value: null,
                                //         refresh: !UserApprove2.refresh
                                //     }
                                // })
                                nextState = {
                                    ...nextState,
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        value: null
                                    },
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: null
                                    }
                                };
                            }

                            this.setState({
                                UserApprove3: {
                                    ...UserApprove3,
                                    visible: true,
                                    refresh: !UserApprove3.refresh
                                },
                                UserApprove4: {
                                    ...UserApprove4,
                                    visible: false,
                                    refresh: !UserApprove4.refresh
                                }
                            });

                            nextState = {
                                UserApprove: {
                                    ...nextState.UserApprove,
                                    refresh: !nextState.UserApprove.refresh
                                },
                                UserApprove3: {
                                    ...nextState.UserApprove3,
                                    visible: true,
                                    refresh: !nextState.UserApprove3.refresh
                                },
                                UserApprove4: {
                                    ...nextState.UserApprove4,
                                    visible: false,
                                    refresh: !nextState.UserApprove4.refresh
                                },
                                UserApprove2: {
                                    ...nextState.UserApprove2,
                                    refresh: !nextState.UserApprove2.refresh
                                }
                            };
                        } else if (result.LevelApprove == 4) {
                            if (result.SupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                    }
                                };
                                // this.setState({
                                //     UserApprove: {
                                //         ...UserApprove,
                                //         value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID },
                                //         refresh: !UserApprove.refresh
                                //     }
                                // })
                            } else {
                                // this.setState({
                                //     UserApprove: {
                                //         ...UserApprove,
                                //         value: null,
                                //         refresh: !UserApprove.refresh
                                //     }
                                // })
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        value: null
                                    }
                                };
                            }

                            if (result.MidSupervisorID != null) {
                                // this.setState({
                                //     UserApprove3: {
                                //         ...UserApprove3,
                                //         value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID },
                                //         refresh: !UserApprove3.refresh
                                //     }
                                // })

                                nextState = {
                                    ...nextState,
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                    }
                                };
                            } else {
                                // this.setState({
                                //     UserApprove3: {
                                //         ...UserApprove3,
                                //         value: null,
                                //         refresh: !UserApprove3.refresh
                                //     }
                                // })

                                nextState = {
                                    ...nextState,
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        value: null
                                    }
                                };
                            }

                            if (result.NextMidSupervisorID != null) {
                                // this.setState({
                                //     UserApprove4: {
                                //         ...UserApprove4,
                                //         value: { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID },
                                //         refresh: !UserApprove4.refresh
                                //     }
                                // })

                                nextState = {
                                    ...nextState,
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        value: {
                                            UserInfoName: result.NextMidSupervisorName,
                                            ID: result.NextMidSupervisorID
                                        }
                                    }
                                };
                            } else {
                                // this.setState({
                                //     UserApprove4: {
                                //         ...UserApprove4,
                                //         value: null,
                                //         refresh: !UserApprove4.refresh
                                //     }
                                // })
                                nextState = {
                                    ...nextState,
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        value: null
                                    }
                                };
                            }

                            if (result.HighSupervisorID != null) {
                                // this.setState({
                                //     UserApprove2: {
                                //         ...UserApprove2,
                                //         value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID },
                                //         refresh: !UserApprove2.refresh
                                //     }
                                // })
                                nextState = {
                                    ...nextState,
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                                    }
                                };
                            } else {
                                // this.setState({
                                //     UserApprove2: {
                                //         ...UserApprove2,
                                //         value: null,
                                //         refresh: !UserApprove2.refresh
                                //     }
                                // })
                                nextState = {
                                    ...nextState,
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: null
                                    }
                                };
                            }

                            nextState = {
                                UserApprove: {
                                    ...nextState.UserApprove,
                                    refresh: !nextState.UserApprove.refresh
                                },
                                UserApprove3: {
                                    ...nextState.UserApprove3,
                                    visible: true,
                                    refresh: !nextState.UserApprove3.refresh
                                },
                                UserApprove4: {
                                    ...nextState.UserApprove4,
                                    visible: true,
                                    refresh: !nextState.UserApprove4.refresh
                                },
                                UserApprove2: {
                                    ...nextState.UserApprove2,
                                    refresh: !nextState.UserApprove2.refresh
                                }
                            };

                            //this.setState(nextState);
                            // this.setState({
                            //     UserApprove3: {
                            //         ...UserApprove3,
                            //         visible: true
                            //     },
                            //     UserApprove4: {
                            //         ...UserApprove4,
                            //         visible: true
                            //     }
                            // })
                        }

                        if (result.IsChangeApprove != true) {
                            // this.setState({
                            //     UserApprove: {
                            //         ...UserApprove,
                            //         disable: true,
                            //         refresh: !UserApprove.refresh
                            //     },
                            //     UserApprove3: {
                            //         ...UserApprove3,
                            //         disable: true,
                            //         refresh: !UserApprove3.refresh
                            //     },
                            //     UserApprove4: {
                            //         ...UserApprove4,
                            //         disable: true,
                            //         refresh: !UserApprove4.refresh
                            //     },
                            //     UserApprove2: {
                            //         ...UserApprove2,
                            //         disable: true,
                            //         refresh: !UserApprove2.refresh
                            //     }
                            // })
                            nextState = {
                                UserApprove: {
                                    ...nextState.UserApprove,
                                    disable: true
                                },
                                UserApprove3: {
                                    ...nextState.UserApprove3,
                                    disable: true
                                },
                                UserApprove4: {
                                    ...nextState.UserApprove4,
                                    disable: true
                                },
                                UserApprove2: {
                                    ...nextState.UserApprove2,
                                    disable: true
                                }
                            };
                        } else if (DateStart.value && DateEnd.value) {
                            // this.setState({
                            //     UserApprove: {
                            //         ...UserApprove,
                            //         disable: false,
                            //         refresh: !UserApprove.refresh
                            //     },
                            //     UserApprove3: {
                            //         ...UserApprove3,
                            //         disable: false,
                            //         refresh: !UserApprove3.refresh
                            //     },
                            //     UserApprove4: {
                            //         ...UserApprove4,
                            //         disable: false,
                            //         refresh: !UserApprove4.refresh
                            //     },
                            //     UserApprove2: {
                            //         ...UserApprove2,
                            //         disable: false,
                            //         refresh: !UserApprove2.refresh
                            //     }
                            // })
                            nextState = {
                                UserApprove: {
                                    ...nextState.UserApprove,
                                    disable: false
                                },
                                UserApprove3: {
                                    ...nextState.UserApprove3,
                                    disable: false
                                },
                                UserApprove4: {
                                    ...nextState.UserApprove4,
                                    disable: false
                                },
                                UserApprove2: {
                                    ...nextState.UserApprove2,
                                    disable: false
                                }
                            };
                        }

                        this.setState(nextState);
                    }
                }

                //TH chạy không theo approvegrade
                else if (result.LevelApprove == 0) {
                    this.levelApproveRoster = 2;
                    if (this.isRegisterOrgOvertime) {
                        this.setState({
                            UserApprove: {
                                ...UserApprove,
                                value: null,
                                refresh: !UserApprove.refresh
                            },
                            UserApprove3: {
                                ...UserApprove3,
                                value: null,
                                refresh: !UserApprove3.refresh
                            },
                            UserApprove4: {
                                ...UserApprove4,
                                value: null,
                                refresh: !UserApprove4.refresh
                            },
                            UserApprove2: {
                                ...UserApprove2,
                                value: null,
                                refresh: !UserApprove2.refresh
                            }
                        });

                        if (result.IsChangeApprove != true) {
                            let IsReadOnlyCondition = true;
                            if (this.isRegisterHelp) {
                                if (isChoseProfile) {
                                    let countUserQuantity = Profiles && Profiles.value ? Profiles.value.length : null;
                                    if (countUserQuantity != null && countUserQuantity.length >= 2) {
                                        IsReadOnlyCondition = false;
                                        this.setState({
                                            UserApprove: {
                                                ...UserApprove,
                                                disable: false,
                                                refresh: !UserApprove.refresh
                                            },
                                            UserApprove2: {
                                                ...UserApprove2,
                                                disable: false,
                                                refresh: !UserApprove2.refresh
                                            },
                                            UserApprove4: {
                                                ...UserApprove4,
                                                disable: false,
                                                refresh: !UserApprove4.refresh
                                            },
                                            UserApprove3: {
                                                ...UserApprove3,
                                                disable: false,
                                                refresh: !UserApprove3.refresh
                                            }
                                        });
                                    }
                                } else if (OrgStructures && OrgStructures.value && OrgStructures.value.length >= 1) {
                                    IsReadOnlyCondition = false;
                                    this.setState({
                                        UserApprove: {
                                            ...UserApprove,
                                            disable: false,
                                            refresh: !UserApprove.refresh
                                        },
                                        UserApprove2: {
                                            ...UserApprove2,
                                            disable: false,
                                            refresh: !UserApprove2.refresh
                                        },
                                        UserApprove4: {
                                            ...UserApprove4,
                                            disable: false,
                                            refresh: !UserApprove4.refresh
                                        },
                                        UserApprove3: {
                                            ...UserApprove3,
                                            disable: false,
                                            refresh: !UserApprove3.refresh
                                        }
                                    });
                                }

                                if (IsReadOnlyCondition == true) {
                                    this.setState({
                                        UserApprove: {
                                            ...UserApprove,
                                            disable: true,
                                            refresh: !UserApprove.refresh
                                        },
                                        UserApprove2: {
                                            ...UserApprove2,
                                            disable: true,
                                            refresh: !UserApprove2.refresh
                                        },
                                        UserApprove4: {
                                            ...UserApprove4,
                                            disable: true,
                                            refresh: !UserApprove4.refresh
                                        },
                                        UserApprove3: {
                                            ...UserApprove3,
                                            disable: true,
                                            refresh: !UserApprove3.refresh
                                        }
                                    });
                                }
                            }
                        }
                    }

                    //vì là else của isRegisterOrgOvertime nên sẽ luôn là chọn 1 người
                    else {
                        if (result.IsChangeApprove == true) {
                            this.isChangeLevelApprove = true;
                        }
                        if (result.SupervisorID != null) {
                            // Người duyệt đầu
                            this.setState({
                                UserApprove: {
                                    ...UserApprove,
                                    value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID },
                                    refresh: !UserApprove.refresh
                                }
                            });
                        } else {
                            this.setState({
                                UserApprove: {
                                    ...UserApprove,
                                    value: null,
                                    refresh: !UserApprove.refresh
                                }
                            });
                        }

                        // Mặc định 2 cấp. Gán bằng Hre_Profile.MidSupervisorID
                        if (result.MidSupervisorID != null) {
                            this.setState({
                                UserApprove2: {
                                    ...UserApprove2,
                                    value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID },
                                    refresh: !UserApprove2.refresh
                                },
                                UserApprove4: {
                                    ...UserApprove4,
                                    value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID },
                                    refresh: !UserApprove4.refresh
                                },
                                UserApprove3: {
                                    ...UserApprove3,
                                    value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID },
                                    refresh: !UserApprove3.refresh
                                }
                            });
                        } else {
                            this.setState({
                                UserApprove2: {
                                    ...UserApprove2,
                                    value: null,
                                    refresh: !UserApprove2.refresh
                                },
                                UserApprove4: {
                                    ...UserApprove4,
                                    value: null,
                                    refresh: !UserApprove4.refresh
                                },
                                UserApprove3: {
                                    ...UserApprove3,
                                    value: null,
                                    refresh: !UserApprove3.refresh
                                }
                            });
                        }
                        if (result.IsChangeApprove != true) {
                            this.setState({
                                UserApprove: {
                                    ...UserApprove,
                                    disable: true,
                                    refresh: !UserApprove.refresh
                                },
                                UserApprove2: {
                                    ...UserApprove2,
                                    disable: true,
                                    refresh: !UserApprove2.refresh
                                },
                                UserApprove4: {
                                    ...UserApprove4,
                                    disable: true,
                                    refresh: !UserApprove4.refresh
                                },
                                UserApprove3: {
                                    ...UserApprove3,
                                    disable: true,
                                    refresh: !UserApprove3.refresh
                                }
                            });
                        } else if (DateStart.value && DateEnd.value) {
                            this.setState({
                                UserApprove: {
                                    ...UserApprove,
                                    disable: false,
                                    refresh: !UserApprove.refresh
                                },
                                UserApprove2: {
                                    ...UserApprove2,
                                    disable: false,
                                    refresh: !UserApprove2.refresh
                                },
                                UserApprove4: {
                                    ...UserApprove4,
                                    disable: false,
                                    refresh: !UserApprove4.refresh
                                },
                                UserApprove3: {
                                    ...UserApprove3,
                                    disable: false,
                                    refresh: !UserApprove3.refresh
                                }
                            });
                        }
                    }
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    loadHighSupervisor = profileId => {
        if (profileId) {
            this.GetHighSupervior(profileId, 'E_ROSTER');
        } else {
            const { UserApprove, UserApprove3, UserApprove4, UserApprove2 } = this.state;
            this.setState({
                UserApprove: { ...UserApprove, value: null },
                UserApprove3: { ...UserApprove3, value: null },
                UserApprove4: { ...UserApprove4, value: null },
                UserApprove2: { ...UserApprove2, value: null }
            });
        }
    };

    onChangeUserApprove = item => {
        const { UserApprove, UserApprove2, UserApprove3, UserApprove4 } = this.state;

        let nextState = {
            UserApprove: {
                ...UserApprove,
                value: item,
                refresh: !UserApprove.refresh
            }
        };

        //nếu 1 cấp duyệt mới chạy
        if (this.levelApproveRoster == 1) {
            let user1 = { ...item };
            if (!user1) {
                nextState = {
                    ...nextState,
                    UserApprove2: { ...UserApprove2, value: null, refresh: !UserApprove2.refresh },
                    UserApprove3: { ...UserApprove3, value: null, visible: false, refresh: !UserApprove3.refresh },
                    UserApprove4: { ...UserApprove4, value: null, visible: false, refresh: !UserApprove4.refresh }
                };
            } else {
                nextState = {
                    ...nextState,
                    UserApprove2: { ...UserApprove2, value: { ...item }, refresh: !UserApprove2.refresh },
                    UserApprove3: {
                        ...UserApprove3,
                        value: { ...item },
                        visible: false,
                        refresh: !UserApprove3.refresh
                    },
                    UserApprove4: {
                        ...UserApprove4,
                        value: { ...item },
                        visible: false,
                        refresh: !UserApprove4.refresh
                    }
                };
            }
        }

        this.setState(nextState);
    };

    onChangeUserApprove2 = item => {
        const { UserApprove, UserApprove2, UserApprove3, UserApprove4 } = this.state;

        let nextState = {
            UserApprove2: {
                ...UserApprove2,
                value: item,
                refresh: !UserApprove2.refresh
            }
        };

        //nếu 1 cấp duyệt mới chạy
        if (this.levelApproveRoster == 1) {
            let user2 = { ...item };
            if (!user2) {
                nextState = {
                    ...nextState,
                    UserApprove: { ...UserApprove, value: null, refresh: !UserApprove.refresh },
                    UserApprove3: { ...UserApprove3, visible: false, value: null, refresh: !UserApprove3.refresh },
                    UserApprove4: { ...UserApprove4, visible: false, value: null, refresh: !UserApprove4.refresh }
                };
            } else {
                nextState = {
                    ...nextState,
                    UserApprove: { ...UserApprove, value: { ...item }, refresh: !UserApprove.refresh },
                    UserApprove3: {
                        ...UserApprove3,
                        visible: false,
                        value: { ...item },
                        refresh: !UserApprove3.refresh
                    },
                    UserApprove4: {
                        ...UserApprove4,
                        visible: false,
                        value: { ...item },
                        refresh: !UserApprove4.refresh
                    }
                };
            }
        } else if (this.levelApproveRoster == 2) {
            let user2 = { ...item };
            if (!user2) {
                nextState = {
                    ...nextState,
                    UserApprove3: { ...UserApprove3, value: null, refresh: !UserApprove3.refresh },
                    UserApprove4: { ...UserApprove4, value: null, refresh: !UserApprove4.refresh }
                };
            } else {
                nextState = {
                    ...nextState,
                    UserApprove3: { ...UserApprove3, value: { ...item }, refresh: !UserApprove3.refresh },
                    UserApprove4: { ...UserApprove4, value: { ...item }, refresh: !UserApprove4.refresh }
                };
            }
        } else if (this.levelApproveRoster == 3) {
            let user2 = { ...item };

            if (!user2) {
                nextState = {
                    ...nextState,
                    UserApprove4: { ...UserApprove4, value: null, refresh: !UserApprove4.refresh }
                };
            } else {
                nextState = {
                    ...nextState,
                    UserApprove4: { ...UserApprove4, value: { ...item }, refresh: !UserApprove4.refresh }
                };
            }
        }

        this.setState(nextState);
    };

    readOnlyShift = indexWeek => {
        const { MonShift, TueShift, WedShift, ThuShift, FriShift, SatShift, SunShift } = this.state;

        if (indexWeek == 0) {
            this.setState({
                MonShift: {
                    ...MonShift,
                    disable: true,
                    value: null,
                    refresh: !MonShift.refresh
                },
                TueShift: {
                    ...TueShift,
                    disable: true,
                    value: null,
                    refresh: !TueShift.refresh
                },
                WedShift: {
                    ...WedShift,
                    disable: true,
                    value: null,
                    refresh: !WedShift.refresh
                },
                ThuShift: {
                    ...ThuShift,
                    disable: true,
                    value: null,
                    refresh: !ThuShift.refresh
                },
                FriShift: {
                    ...FriShift,
                    disable: true,
                    value: null,
                    refresh: !FriShift.refresh
                },
                SatShift: {
                    ...SatShift,
                    disable: true,
                    value: null,
                    refresh: !SatShift.refresh
                },
                SunShift: {
                    ...SunShift,
                    disable: false,
                    refresh: !SunShift.refresh
                }
            });
            // $('#MonShiftID').data('kendoDropDownList').readonly();
            // $('#TueShiftID').data('kendoDropDownList').readonly();
            // $('#WedShiftID').data('kendoDropDownList').readonly();
            // $('#ThuShiftID').data('kendoDropDownList').readonly();
            // $('#FriShiftID').data('kendoDropDownList').readonly();
            // $('#SatShiftID').data('kendoDropDownList').readonly();
            // $('#SunShiftID').data('kendoDropDownList').readonly(false);
            // $('#MonShiftID').data('kendoDropDownList').value(null);
            // $('#TueShiftID').data('kendoDropDownList').value(null);
            // $('#WedShiftID').data('kendoDropDownList').value(null);
            // $('#ThuShiftID').data('kendoDropDownList').value(null);
            // $('#FriShiftID').data('kendoDropDownList').value(null);
            // $('#SatShiftID').data('kendoDropDownList').value(null);
        } else if (indexWeek == 1) {
            // $('#MonShiftID').data('kendoDropDownList').readonly(false);
            // $('#TueShiftID').data('kendoDropDownList').readonly();
            // $('#WedShiftID').data('kendoDropDownList').readonly();
            // $('#ThuShiftID').data('kendoDropDownList').readonly();
            // $('#FriShiftID').data('kendoDropDownList').readonly();
            // $('#SatShiftID').data('kendoDropDownList').readonly();
            // $('#SunShiftID').data('kendoDropDownList').readonly();

            // $('#TueShiftID').data('kendoDropDownList').value(null);
            // $('#WedShiftID').data('kendoDropDownList').value(null);
            // $('#ThuShiftID').data('kendoDropDownList').value(null);
            // $('#FriShiftID').data('kendoDropDownList').value(null);
            // $('#SatShiftID').data('kendoDropDownList').value(null);
            // $('#SunShiftID').data('kendoDropDownList').value(null);

            this.setState({
                MonShift: {
                    ...MonShift,
                    disable: false,
                    refresh: !MonShift.refresh
                },
                TueShift: {
                    ...TueShift,
                    disable: true,
                    value: null,
                    refresh: !TueShift.refresh
                },
                WedShift: {
                    ...WedShift,
                    disable: true,
                    value: null,
                    refresh: !WedShift.refresh
                },
                ThuShift: {
                    ...ThuShift,
                    disable: true,
                    value: null,
                    refresh: !ThuShift.refresh
                },
                FriShift: {
                    ...FriShift,
                    disable: true,
                    value: null,
                    refresh: !FriShift.refresh
                },
                SatShift: {
                    ...SatShift,
                    disable: true,
                    value: null,
                    refresh: !SatShift.refresh
                },
                SunShift: {
                    ...SunShift,
                    disable: true,
                    value: null,
                    refresh: !SunShift.refresh
                }
            });
        } else if (indexWeek == 2) {
            // $('#MonShiftID').data('kendoDropDownList').readonly();
            // $('#TueShiftID').data('kendoDropDownList').readonly(false);
            // $('#WedShiftID').data('kendoDropDownList').readonly();
            // $('#ThuShiftID').data('kendoDropDownList').readonly();
            // $('#FriShiftID').data('kendoDropDownList').readonly();
            // $('#SatShiftID').data('kendoDropDownList').readonly();
            // $('#SunShiftID').data('kendoDropDownList').readonly();

            // $('#MonShiftID').data('kendoDropDownList').value(null);
            // $('#WedShiftID').data('kendoDropDownList').value(null);
            // $('#ThuShiftID').data('kendoDropDownList').value(null);
            // $('#FriShiftID').data('kendoDropDownList').value(null);
            // $('#SatShiftID').data('kendoDropDownList').value(null);
            // $('#SunShiftID').data('kendoDropDownList').value(null);
            this.setState({
                MonShift: {
                    ...MonShift,
                    disable: true,
                    value: null,
                    refresh: !MonShift.refresh
                },
                TueShift: {
                    ...TueShift,
                    disable: false,
                    refresh: !TueShift.refresh
                },
                WedShift: {
                    ...WedShift,
                    disable: true,
                    value: null,
                    refresh: !WedShift.refresh
                },
                ThuShift: {
                    ...ThuShift,
                    disable: true,
                    value: null,
                    refresh: !ThuShift.refresh
                },
                FriShift: {
                    ...FriShift,
                    disable: true,
                    value: null,
                    refresh: !FriShift.refresh
                },
                SatShift: {
                    ...SatShift,
                    disable: true,
                    value: null,
                    refresh: !SatShift.refresh
                },
                SunShift: {
                    ...SunShift,
                    disable: true,
                    value: null,
                    refresh: !SunShift.refresh
                }
            });
        } else if (indexWeek == 3) {
            // $('#MonShiftID').data('kendoDropDownList').readonly();
            // $('#TueShiftID').data('kendoDropDownList').readonly();
            // $('#WedShiftID').data('kendoDropDownList').readonly(false);
            // $('#ThuShiftID').data('kendoDropDownList').readonly();
            // $('#FriShiftID').data('kendoDropDownList').readonly();
            // $('#SatShiftID').data('kendoDropDownList').readonly();
            // $('#SunShiftID').data('kendoDropDownList').readonly();

            // $('#MonShiftID').data('kendoDropDownList').value(null);
            // $('#TueShiftID').data('kendoDropDownList').value(null);
            // $('#ThuShiftID').data('kendoDropDownList').value(null);
            // $('#FriShiftID').data('kendoDropDownList').value(null);
            // $('#SatShiftID').data('kendoDropDownList').value(null);
            // $('#SunShiftID').data('kendoDropDownList').value(null);
            this.setState({
                MonShift: {
                    ...MonShift,
                    disable: true,
                    value: null,
                    refresh: !MonShift.refresh
                },
                TueShift: {
                    ...TueShift,
                    disable: true,
                    value: null,
                    refresh: !TueShift.refresh
                },
                WedShift: {
                    ...WedShift,
                    disable: false,
                    refresh: !WedShift.refresh
                },
                ThuShift: {
                    ...ThuShift,
                    disable: true,
                    value: null,
                    refresh: !ThuShift.refresh
                },
                FriShift: {
                    ...FriShift,
                    disable: true,
                    value: null,
                    refresh: !FriShift.refresh
                },
                SatShift: {
                    ...SatShift,
                    disable: true,
                    value: null,
                    refresh: !SatShift.refresh
                },
                SunShift: {
                    ...SunShift,
                    disable: true,
                    value: null,
                    refresh: !SunShift.refresh
                }
            });
        } else if (indexWeek == 4) {
            // $('#MonShiftID').data('kendoDropDownList').readonly();
            // $('#TueShiftID').data('kendoDropDownList').readonly();
            // $('#WedShiftID').data('kendoDropDownList').readonly();
            // $('#ThuShiftID').data('kendoDropDownList').readonly(false);
            // $('#FriShiftID').data('kendoDropDownList').readonly();
            // $('#SatShiftID').data('kendoDropDownList').readonly();
            // $('#SunShiftID').data('kendoDropDownList').readonly();

            // $('#MonShiftID').data('kendoDropDownList').value(null);
            // $('#TueShiftID').data('kendoDropDownList').value(null);
            // $('#WedShiftID').data('kendoDropDownList').value(null);
            // $('#FriShiftID').data('kendoDropDownList').value(null);
            // $('#SatShiftID').data('kendoDropDownList').value(null);
            // $('#SunShiftID').data('kendoDropDownList').value(null);
            this.setState({
                MonShift: {
                    ...MonShift,
                    disable: true,
                    value: null,
                    refresh: !MonShift.refresh
                },
                TueShift: {
                    ...TueShift,
                    disable: true,
                    value: null,
                    refresh: !TueShift.refresh
                },
                WedShift: {
                    ...WedShift,
                    disable: true,
                    value: null,
                    refresh: !WedShift.refresh
                },
                ThuShift: {
                    ...ThuShift,
                    disable: false,
                    refresh: !ThuShift.refresh
                },
                FriShift: {
                    ...FriShift,
                    disable: true,
                    value: null,
                    refresh: !FriShift.refresh
                },
                SatShift: {
                    ...SatShift,
                    disable: true,
                    value: null,
                    refresh: !SatShift.refresh
                },
                SunShift: {
                    ...SunShift,
                    disable: true,
                    value: null,
                    refresh: !SunShift.refresh
                }
            });
        } else if (indexWeek == 5) {
            // $('#MonShiftID').data('kendoDropDownList').readonly();
            // $('#TueShiftID').data('kendoDropDownList').readonly();
            // $('#WedShiftID').data('kendoDropDownList').readonly();
            // $('#ThuShiftID').data('kendoDropDownList').readonly();
            // $('#FriShiftID').data('kendoDropDownList').readonly(false);
            // $('#SatShiftID').data('kendoDropDownList').readonly();
            // $('#SunShiftID').data('kendoDropDownList').readonly();

            // $('#MonShiftID').data('kendoDropDownList').value(null);
            // $('#TueShiftID').data('kendoDropDownList').value(null);
            // $('#WedShiftID').data('kendoDropDownList').value(null);
            // $('#ThuShiftID').data('kendoDropDownList').value(null);
            // $('#SatShiftID').data('kendoDropDownList').value(null);
            // $('#SunShiftID').data('kendoDropDownList').value(null);
            this.setState({
                MonShift: {
                    ...MonShift,
                    disable: true,
                    value: null,
                    refresh: !MonShift.refresh
                },
                TueShift: {
                    ...TueShift,
                    disable: true,
                    value: null,
                    refresh: !TueShift.refresh
                },
                WedShift: {
                    ...WedShift,
                    disable: true,
                    value: null,
                    refresh: !WedShift.refresh
                },
                ThuShift: {
                    ...ThuShift,
                    disable: true,
                    value: null,
                    refresh: !ThuShift.refresh
                },
                FriShift: {
                    ...FriShift,
                    disable: false,
                    refresh: !FriShift.refresh
                },
                SatShift: {
                    ...SatShift,
                    disable: true,
                    value: null,
                    refresh: !SatShift.refresh
                },
                SunShift: {
                    ...SunShift,
                    disable: true,
                    value: null,
                    refresh: !SunShift.refresh
                }
            });
        } else if (indexWeek == 6) {
            // $('#MonShiftID').data('kendoDropDownList').readonly();
            // $('#TueShiftID').data('kendoDropDownList').readonly();
            // $('#WedShiftID').data('kendoDropDownList').readonly();
            // $('#ThuShiftID').data('kendoDropDownList').readonly();
            // $('#FriShiftID').data('kendoDropDownList').readonly();
            // $('#SatShiftID').data('kendoDropDownList').readonly(false);
            // $('#SunShiftID').data('kendoDropDownList').readonly();

            // $('#MonShiftID').data('kendoDropDownList').value(null);
            // $('#TueShiftID').data('kendoDropDownList').value(null);
            // $('#WedShiftID').data('kendoDropDownList').value(null);
            // $('#ThuShiftID').data('kendoDropDownList').value(null);
            // $('#FriShiftID').data('kendoDropDownList').value(null);
            // $('#SunShiftID').data('kendoDropDownList').value(null);
            this.setState({
                MonShift: {
                    ...MonShift,
                    disable: true,
                    value: null,
                    refresh: !MonShift.refresh
                },
                TueShift: {
                    ...TueShift,
                    disable: true,
                    value: null,
                    refresh: !TueShift.refresh
                },
                WedShift: {
                    ...WedShift,
                    disable: true,
                    value: null,
                    refresh: !WedShift.refresh
                },
                ThuShift: {
                    ...ThuShift,
                    disable: true,
                    value: null,
                    refresh: !ThuShift.refresh
                },
                FriShift: {
                    ...FriShift,
                    disable: true,
                    value: null,
                    refresh: !FriShift.refresh
                },
                SatShift: {
                    ...SatShift,
                    disable: false,
                    refresh: !SatShift.refresh
                },
                SunShift: {
                    ...SunShift,
                    disable: true,
                    value: null,
                    refresh: !SunShift.refresh
                }
            });
        }
    };

    // Hieu.tran - 126400
    getShiftByProfileAndDateStart = (profileID, dateStart, dateEnd) => {
        return HttpService.Post('[URI_HR]/Att_GetData/LoadShiftByProfile', {
            ProfileIDs: profileID,
            dateStart: Vnr_Function.formatDateAPI(dateStart),
            DateEnd: Vnr_Function.formatDateAPI(dateEnd),
            IsRegisterOrg: false
        });
    };

    ChangeShiftByConfig = async item => {
        const {
            DateStart,
            DateEnd,
            Type,
            isAllowEditRosterOnDateChange,
            SunShift,
            MonShift,
            TueShift,
            WedShift,
            ThuShift,
            FriShift,
            SatShift
        } = this.state;

        // Lấy ca theo ngày bắt đầu ngày kết thúc
        let dataShift = [];
        if (DateStart && DateEnd && DateStart.value != null && DateEnd.value != null) {
            VnrLoadingSevices.show();
            dataShift = await this.getShiftByProfileAndDateStart(profileInfo.ProfileID, DateStart.value, DateEnd.value);
            VnrLoadingSevices.hide();
        }

        if (
            profileInfo &&
            isAllowEditRosterOnDateChange &&
            (Type &&
                (Type.value.Value != 'E_ROSTERGROUP' &&
                    Type.value.Value != 'E_CHANGE_SHIFT_COMPANSATION' &&
                    Type.value.Value != 'E_DEFAULT')) &&
            DateStart &&
            DateEnd &&
            DateStart.value != null &&
            DateEnd.value != null
        ) {
            // bat buoc chon toi da 1 tuan
            if (moment(DateEnd.value).diff(moment(DateStart.value), 'days') + 1 <= 7) {
                this.SetShiftByDate(dataShift, item);
                return;

                // VnrLoadingSevices.show();
                // HttpService.Post('[URI_HR]/Att_GetData/GetDataRosterByProfileAndDate', {
                //     profileID: profileInfo.ProfileID,
                //     dateStart: dateStartConvert,
                //     dateEnd: dateEndConvert,
                // }).then((res) => {
                //     VnrLoadingSevices.hide();
                //     if (moment(DateStart.value) <= moment(DateEnd.value)) {
                //         this.SetShiftByDate(res, dataShift, item);
                //     } else {
                //         // $('form[name="New_Att_Roster__New_CreateOrUpdate"] .form-group  select[data-role="dropdownlist"]').each(function () {
                //         //     $(this).parent().removeClass('dropdown___readonly');
                //         // })
                //     }
                // });

                // return;
            } else {
                // Bỏ logic Cũ task 170811
                let valueFromData = dataShift && dataShift.length === 1 ? dataShift[0] : null;
                let nextState = {
                    SunShift: {
                        ...SunShift,
                        disable: false,
                        data: dataShift,
                        value: valueFromData,
                        refresh: !SunShift.refresh
                    },
                    MonShift: {
                        ...MonShift,
                        disable: false,
                        data: dataShift,
                        value: valueFromData,
                        refresh: !MonShift.refresh
                    },
                    TueShift: {
                        ...TueShift,
                        disable: false,
                        data: dataShift,
                        value: valueFromData,
                        refresh: !TueShift.refresh
                    },
                    WedShift: {
                        ...WedShift,
                        disable: false,
                        data: dataShift,
                        value: valueFromData,
                        refresh: !WedShift.refresh
                    },
                    ThuShift: {
                        ...ThuShift,
                        disable: false,
                        data: dataShift,
                        value: valueFromData,
                        refresh: !ThuShift.refresh
                    },
                    FriShift: {
                        ...FriShift,
                        disable: false,
                        data: dataShift,
                        value: valueFromData,
                        refresh: !FriShift.refresh
                    },
                    SatShift: {
                        ...SatShift,
                        disable: false,
                        data: dataShift,
                        value: valueFromData,
                        refresh: !SatShift.refresh
                    }
                };

                this.setState(nextState);
                ToasterSevice.showWarning('WarningPleaseDoNotChangeShiftGreaterThan7Day', 5000);
                return;
            }
        } else if (
            profileInfo &&
            Type &&
            Type.value.Value == 'E_DEFAULT' &&
            DateStart &&
            DateEnd &&
            DateStart.value != null &&
            DateEnd.value != null
        ) {
            this.SetShiftInLeave(dataShift, item);
            // const dateStartConvert = Vnr_Function.formatDateAPI(DateStart.value);
            // const dateEndConvert = Vnr_Function.formatDateAPI(DateEnd.value);
            // if (moment(dateEndConvert).diff(moment(dateStartConvert), 'days') + 1 <= 7) {
            //     VnrLoadingSevices.show();
            //     HttpService.Post('[URI_HR]/Att_GetData/GetDataRosterHaveLeavedayByProfileAndDate/', {
            //         profileID: profileInfo.ProfileID,
            //         dateStart: dateStartConvert,
            //     }).then((data) => {
            //         VnrLoadingSevices.hide();
            //         if (data) {
            //             this.SetShiftInLeave(data, dataShift, item);
            //         }
            //     });
            // }
        } else if (
            Type &&
            Type.value.Value &&
            DateStart &&
            DateEnd &&
            DateStart.value != null &&
            DateEnd.value != null
        ) {
            let valueFromData = dataShift && dataShift.length === 1 ? dataShift[0] : null;
            let nextState = {
                SunShift: {
                    ...SunShift,
                    disable: false,
                    data: dataShift,
                    value: valueFromData,
                    refresh: !SunShift.refresh
                },
                MonShift: {
                    ...MonShift,
                    disable: false,
                    data: dataShift,
                    value: valueFromData,
                    refresh: !MonShift.refresh
                },
                TueShift: {
                    ...TueShift,
                    disable: false,
                    data: dataShift,
                    value: valueFromData,
                    refresh: !TueShift.refresh
                },
                WedShift: {
                    ...WedShift,
                    disable: false,
                    data: dataShift,
                    value: valueFromData,
                    refresh: !WedShift.refresh
                },
                ThuShift: {
                    ...ThuShift,
                    disable: false,
                    data: dataShift,
                    value: valueFromData,
                    refresh: !ThuShift.refresh
                },
                FriShift: {
                    ...FriShift,
                    disable: false,
                    data: dataShift,
                    value: valueFromData,
                    refresh: !FriShift.refresh
                },
                SatShift: {
                    ...SatShift,
                    disable: false,
                    data: dataShift,
                    value: valueFromData,
                    refresh: !SatShift.refresh
                }
            };

            this.setState(nextState, () => {
                this.setShiftFirst(item);
            });
        }
    };

    SetShiftByDate = (dataShift, item) => {
        const {
            DateStart,
            DateEnd,
            SunShift,
            MonShift,
            TueShift,
            WedShift,
            ThuShift,
            FriShift,
            SatShift
            //Type,
            // isAllowEditRosterOnDateChange
        } = this.state;

        let valueFromData = dataShift && dataShift.length === 1 ? dataShift[0] : null;
        let nextState = {
            SunShift: {
                ...SunShift,
                disable: true,
                value: null,
                refresh: !SunShift.refresh
            },
            MonShift: {
                ...MonShift,
                disable: true,
                value: null,
                refresh: !MonShift.refresh
            },
            TueShift: {
                ...TueShift,
                disable: true,
                value: null,
                refresh: !TueShift.refresh
            },
            WedShift: {
                ...WedShift,
                disable: true,
                value: null,
                refresh: !WedShift.refresh
            },
            ThuShift: {
                ...ThuShift,
                disable: true,
                value: null,
                refresh: !ThuShift.refresh
            },
            FriShift: {
                ...FriShift,
                disable: true,
                value: null,
                refresh: !FriShift.refresh
            },
            SatShift: {
                ...SatShift,
                disable: true,
                value: null,
                refresh: !SatShift.refresh
            }
        };

        const _DateStart = moment(DateStart.value);
        const _DateEnd = moment(DateEnd.value);

        for (let i = _DateStart; i <= _DateEnd; i = moment(i).add(1, 'days')) {
            let result = i._d.toDateString().substr(0, 3) + 'Shift';

            const getState = this.state[result];
            nextState = {
                ...nextState,
                [result]: {
                    ...getState,
                    disable: false,
                    value: valueFromData,
                    refresh: !getState.refresh
                }
            };
        }

        //set value theo ngày
        // const dateEndPlus = moment(DateStart.value).add(6, 'days');
        // let index = 0;
        // for (let i = _DateStart; i <= dateEndPlus; i = moment(i).add(1, 'days')) {
        //     if (dataRoster) {
        //         if (i.day() == 0 && dataRoster[index] != null) {
        //             nextState = {
        //                 ...nextState,
        //                 SunShift: {
        //                     ...nextState.SunShift,
        //                     value: {
        //                         ID: dataRoster[index].ID,
        //                         ShiftName: dataRoster[index].Code + '-' + dataRoster[index].ShiftName,
        //                     },
        //                 },
        //             };
        //         } else if (i.day() == 1 && dataRoster[index] != null) {
        //             nextState = {
        //                 ...nextState,
        //                 MonShift: {
        //                     ...nextState.MonShift,
        //                     value: {
        //                         ID: dataRoster[index].ID,
        //                         ShiftName: dataRoster[index].Code + '-' + dataRoster[index].ShiftName,
        //                     },
        //                 },
        //             };
        //         } else if (i.day() == 2 && dataRoster[index] != null) {
        //             nextState = {
        //                 ...nextState,
        //                 TueShift: {
        //                     ...nextState.TueShift,
        //                     value: {
        //                         ID: dataRoster[index].ID,
        //                         ShiftName: dataRoster[index].Code + '-' + dataRoster[index].ShiftName,
        //                     },
        //                 },
        //             };
        //         } else if (i.day() == 3 && dataRoster[index] != null) {
        //             nextState = {
        //                 ...nextState,
        //                 WedShift: {
        //                     ...nextState.WedShift,
        //                     value: {
        //                         ID: dataRoster[index].ID,
        //                         ShiftName: dataRoster[index].Code + '-' + dataRoster[index].ShiftName,
        //                     },
        //                 },
        //             };
        //         } else if (i.day() == 4 && dataRoster[index] != null) {
        //             nextState = {
        //                 ...nextState,
        //                 ThuShift: {
        //                     ...nextState.ThuShift,
        //                     value: {
        //                         ID: dataRoster[index].ID,
        //                         ShiftName: dataRoster[index].Code + '-' + dataRoster[index].ShiftName,
        //                     },
        //                 },
        //             };
        //         } else if (i.day() == 5 && dataRoster[index] != null) {
        //             nextState = {
        //                 ...nextState,
        //                 FriShift: {
        //                     ...nextState.FriShift,
        //                     value: {
        //                         ID: dataRoster[index].ID,
        //                         ShiftName: dataRoster[index].Code + '-' + dataRoster[index].ShiftName,
        //                     },
        //                 },
        //             };
        //         } else if (i.day() == 6 && dataRoster[index] != null) {
        //             nextState = {
        //                 ...nextState,
        //                 SatShift: {
        //                     ...nextState.SatShift,
        //                     value: {
        //                         ID: dataRoster[index].ID,
        //                         ShiftName: dataRoster[index].Code + '-' + dataRoster[index].ShiftName,
        //                     },
        //                 },
        //             };
        //         }
        //         index++;
        //     }
        // }

        nextState = {
            ...nextState,
            SunShift: {
                ...nextState.SunShift,
                data: dataShift
            },
            MonShift: {
                ...nextState.MonShift,
                data: dataShift
            },
            TueShift: {
                ...nextState.TueShift,
                data: dataShift
            },
            WedShift: {
                ...nextState.WedShift,
                data: dataShift
            },
            ThuShift: {
                ...nextState.ThuShift,
                data: dataShift
            },
            FriShift: {
                ...nextState.FriShift,
                data: dataShift
            },
            SatShift: {
                ...nextState.SatShift,
                data: dataShift
            }
        };

        this.setState(nextState, () => {
            this.setShiftFirst(item);
        });
    };

    SetShiftInLeave = (data, dataShift, item) => {
        //set value theo ngày
        const { DateStart, SunShift, MonShift, TueShift, WedShift, ThuShift, FriShift, SatShift } = this.state;

        let valueFromData = dataShift && dataShift.length === 1 ? dataShift[0] : null;
        let nextState = {
            SunShift: {
                ...SunShift,
                disable: false,
                data: dataShift,
                value: valueFromData,
                refresh: !SunShift.refresh
            },
            MonShift: {
                ...MonShift,
                disable: false,
                data: dataShift,
                value: valueFromData,
                refresh: !MonShift.refresh
            },
            TueShift: {
                ...TueShift,
                disable: false,
                data: dataShift,
                value: valueFromData,
                refresh: !TueShift.refresh
            },
            WedShift: {
                ...WedShift,
                disable: false,
                data: dataShift,
                value: valueFromData,
                refresh: !WedShift.refresh
            },
            ThuShift: {
                ...ThuShift,
                disable: false,
                data: dataShift,
                value: valueFromData,
                refresh: !ThuShift.refresh
            },
            FriShift: {
                ...FriShift,
                disable: false,
                data: dataShift,
                value: valueFromData,
                refresh: !FriShift.refresh
            },
            SatShift: {
                ...SatShift,
                disable: false,
                data: dataShift,
                value: valueFromData,
                refresh: !SatShift.refresh
            }
        };
        const _DateStart = moment(DateStart.value);
        const dateEndPlus = moment(DateStart.value).add(6, 'days');
        for (let i = _DateStart; i <= dateEndPlus; i = moment(i).add(1, 'days')) {
            if (data && data.lenght > 0) {
                let dataSourceShift = (dataSourceShift = data.filter(s => s.DayOfWeek == i.day()));
                if (i.day() == 0 && dataSourceShift.length > 0) {
                    nextState = {
                        ...nextState,
                        SunShift: {
                            ...SunShift,
                            value: dataSourceShift[0].ID
                        }
                    };
                } else if (i.day() == 1 && dataSourceShift.length > 0) {
                    nextState = {
                        ...nextState,
                        MonShift: {
                            ...MonShift,
                            value: dataSourceShift[0].ID
                        }
                    };
                } else if (i.day() == 2 && dataSourceShift.length > 0) {
                    nextState = {
                        ...nextState,
                        TueShift: {
                            ...TueShift,
                            value: dataSourceShift[0].ID
                        }
                    };
                } else if (i.day() == 3 && dataSourceShift.length > 0) {
                    nextState = {
                        ...nextState,
                        WedShift: {
                            ...WedShift,
                            value: dataSourceShift[0].ID
                        }
                    };
                } else if (i.day() == 4 && dataSourceShift.length > 0) {
                    nextState = {
                        ...nextState,
                        ThuShift: {
                            ...ThuShift,
                            value: dataSourceShift[0].ID
                        }
                    };
                } else if (i.day() == 5 && dataSourceShift.length > 0) {
                    nextState = {
                        ...nextState,
                        FriShift: {
                            ...FriShift,
                            value: dataSourceShift[0].ID
                        }
                    };
                } else if (i.day() == 6 && dataSourceShift.length > 0) {
                    nextState = {
                        ...nextState,
                        SatShift: {
                            ...SatShift,
                            value: dataSourceShift[0].ID
                        }
                    };
                }
            }
        }

        this.setState(nextState, () => {
            this.setShiftFirst(item);
        });
    };

    setShiftFirst = response => {
        if (this.isModify && this.isSetFirst && response) {
            const { MonShift, TueShift, WedShift, ThuShift, FriShift, SatShift, SunShift } = this.state;

            let nextState = {
                MonShift: {
                    ...MonShift,
                    refresh: !MonShift.refresh,
                    value: response['MonShiftID']
                        ? { ShiftName: response['MonShiftName'], ID: response['MonShiftID'] }
                        : null
                },
                TueShift: {
                    ...TueShift,
                    refresh: !TueShift.refresh,
                    value: response['TueShiftID']
                        ? { ShiftName: response['TueShiftName'], ID: response['TueShiftID'] }
                        : null
                },
                WedShift: {
                    ...WedShift,
                    refresh: !WedShift.refresh,
                    value: response['WedShiftID']
                        ? { ShiftName: response['WedShiftName'], ID: response['WedShiftID'] }
                        : null
                },
                ThuShift: {
                    ...ThuShift,
                    refresh: !ThuShift.refresh,
                    value: response['ThuShiftID']
                        ? { ShiftName: response['ThuShiftName'], ID: response['ThuShiftID'] }
                        : null
                },
                FriShift: {
                    ...FriShift,
                    refresh: !FriShift.refresh,
                    value: response['FriShiftID']
                        ? { ShiftName: response['FriShiftName'], ID: response['FriShiftID'] }
                        : null
                },
                SatShift: {
                    ...SatShift,
                    refresh: !SatShift.refresh,
                    value: response['SatShiftID']
                        ? { ShiftName: response['SatShiftName'], ID: response['SatShiftID'] }
                        : null
                },
                SunShift: {
                    ...SunShift,
                    refresh: !SunShift.refresh,
                    value: response['SunShiftID']
                        ? { ShiftName: response['SunShiftName'], ID: response['SunShiftID'] }
                        : null
                }
            };

            this.setState(nextState, () => (this.isSetFirst = false));
        }
    };

    //change loại
    onChangeType = item => {
        const { Type, DateChange, DateStart, DateEnd, RosterGroupName, ChangeShiftID, SubstituteShiftID } = this.state;

        let nextState = {
            Type: {
                ...Type,
                value: item ? item : null,
                refresh: !Type.refresh
            },
            DateChange: {
                ...DateChange,
                visible: false
            }
        };

        let dateStart = { ...DateStart },
            _type = item ? item.Value : '';

        if (_type == 'E_ROSTERGROUP') {
            //isShowEle('#area-shift');
            //isShowEle('#group-roster', true);
            //$('#area-info').removeClass('col-sm-6').addClass('col-sm-12');
            //$('div.modal[name=New_Att_Roster__New_CreateOrUpdate] div.modal-dialog')
            //.css('width', '60%');

            nextState = {
                ...nextState,
                isShowRoster: false,
                RosterGroupName: {
                    ...RosterGroupName,
                    visible: true
                }
            };
        }
        //điều chỉnh bằng tay
        else if (_type == 'E_SHIFT_MANUAL') {
            //dateEnd.value(dateStart.value());
            //dateEnd.readonly(true);
            nextState = {
                ...nextState,
                DateEnd: {
                    ...DateEnd,
                    value: dateStart.value,
                    disable: true,
                    refresh: !DateEnd.refresh
                }
            };
        }
        //nghỉ bù - làm bù
        else if (_type == 'E_CHANGE_SHIFT_COMPANSATION') {
            nextState = {
                ...nextState,
                DateEnd: {
                    ...DateEnd,
                    value: dateStart.value,
                    disable: true,
                    refresh: !DateEnd.refresh
                },
                DateChange: {
                    ...DateChange,
                    visible: true,
                    refresh: !DateChange.refresh
                },
                ChangeShiftID: {
                    ...ChangeShiftID,
                    visible: true,
                    disable: true,
                    refresh: !ChangeShiftID.refresh
                },
                SubstituteShiftID: {
                    ...SubstituteShiftID,
                    visible: true,
                    disable: true,
                    refresh: !SubstituteShiftID.refresh
                },
                isShowRoster: false
            };

            if (dateStart.value) {
                let indexWeek = new Date(dateStart.value).getDay();
                this.readOnlyShift(indexWeek);
            }
        } else if (this.configIsShowRoster2) {
            nextState = {
                ...nextState,
                isShowRoster: true,
                isShowRoster2: true,
                RosterGroupName: {
                    ...RosterGroupName,
                    visible: false,
                    refresh: !RosterGroupName.refresh
                }
            };
        } else {
            nextState = {
                ...nextState,
                isShowRoster: true,
                RosterGroupName: {
                    ...RosterGroupName,
                    visible: false,
                    refresh: !RosterGroupName.refresh
                }
            };
        }


        this.setState(nextState, () => this.ChangeShiftByConfig());
    };

    //change ngày đổi ca
    onDateChange = value => {
        const { DateChange, DateStart, Type } = this.state;

        let nextState = {
            DateChange: {
                ...DateChange,
                value: value
            }
        };

        let dateStart = { ...DateStart };

        if (dateStart && dateStart.value) {
            let indexWeek = new Date(dateStart.value).getDay();
            this.readOnlyShift(indexWeek);
        }

        this.setState(nextState, () => {
            if (Type.value && Type.value.Value == 'E_CHANGE_SHIFT_COMPANSATION') {
                const { DateChange, ProfileID, SubstituteShiftID } = this.state;
                if (DateChange.value) {
                    this.getShiftByDate(ProfileID.ID, DateChange.value).then(result => {
                        if (result) {
                            let nextState = {
                                SubstituteShiftID: {
                                    ...SubstituteShiftID,
                                    value: null,
                                    data: [],
                                    refresh: !SubstituteShiftID.refresh
                                }
                            };

                            if (result.length == 1) {
                                let objValue = { ShiftName: result[0]['ShiftNameView'], ID: result[0]['ID'] };

                                nextState = {
                                    SubstituteShiftID: {
                                        ...SubstituteShiftID,
                                        value: { ...objValue },
                                        data: [{ ...objValue }],
                                        refresh: !SubstituteShiftID.refresh
                                    }
                                };
                            }

                            this.setState(nextState);
                        } else {
                            this.setState({
                                SubstituteShiftID: {
                                    ...SubstituteShiftID,
                                    value: null,
                                    data: [],
                                    refresh: !SubstituteShiftID.refresh
                                }
                            });
                        }
                    });
                } else {
                    this.setState({
                        SubstituteShiftID: {
                            ...SubstituteShiftID,
                            value: null,
                            data: [],
                            refresh: !SubstituteShiftID.refresh
                        }
                    });
                }
            }
        });
    };

    getShiftByDate = (profileID, date) => {
        return HttpService.Post('[URI_HR]/Att_GetData/GetShiftByChangeDate', {
            profileID: profileID,
            changeDate: moment(date).format('YYYY-MM-DD HH:mm:ss')
        });
    };

    //change DateStart
    onChangeDateStart = value => {
        const { DateStart, Type, DateEnd, isChoseProfile, Profiles, ProfileID } = this.state,
            _type = Type.value ? Type.value.Value : '',
            dateStart = { ...DateStart };

        let nextState = {
            DateStart: {
                ...DateStart,
                value: value
            }
        };

        if (_type == 'E_SHIFT_MANUAL' || _type == 'E_CHANGE_SHIFT_COMPANSATION' || _type == 'E_CHANGE_SHIFT') {
            //let dateStartValue = value;
            //var dateEnd = $(frm + " #DateEnd").data("kendoDatePicker");
            //dateEnd.value(dateStartValue);
            //isReadOnlyDateTime($(frm + ' #DateEnd'), true);

            nextState = {
                ...nextState,
                DateEnd: {
                    ...DateEnd,
                    value: value,
                    disable: _type == 'E_CHANGE_SHIFT' ? false : true,
                    refresh: !DateEnd.refresh
                }
            };
        } else {
            //isReadOnlyDateTime($(frm + ' #DateEnd'), false);
            nextState = {
                ...nextState,
                DateEnd: {
                    ...DateEnd,
                    disable: false,
                    refresh: !DateEnd.refresh
                }
            };
        }

        if (dateStart.value && DateEnd.value) {
            //check đăng ký hộ
            let profileIds = null;

            if (this.isRegisterHelp && isChoseProfile) {
                // profileIds = $(frm + ' #VnrSelectProfileOrOrgStructure_Profile_SelectProfileOrOrgStructureOvertimeInfo')
                // .data('kendoMultiSelect').value()[0];

                profileIds = Profiles.value ? (Profiles.value[0] ? Profiles.value[0].ID : null) : null;
            } else {
                //profileIds = $('#ProfileID').data('kendoMultiSelect').value()[0];
                profileIds = ProfileID.ID ? ProfileID.ID : null;
            }

            if (profileIds) {
                this.readOnlyCtrlRT(false);
            } else {
                this.readOnlyCtrlRT(true);
            }
        } else {
            this.readOnlyCtrlRT(true);
        }

        this.setState(nextState, () => {
            this.ChangeShiftByConfig();

            if (_type == 'E_CHANGE_SHIFT_COMPANSATION') {
                const { DateStart, ProfileID, ChangeShiftID } = this.state;
                //var dateChange = $(frm + " #DateStart").data("kendoDatePicker");
                if (DateStart.value) {
                    // var optionValues = {};
                    // optionValues["ProfileID"] = profile;
                    // optionValues["DateValue"] = dateChange.value();
                    // var optionControls = {};
                    // optionControls["ControlName"] = 'ChangeShiftID';
                    this.getShiftByDate(ProfileID.ID, DateStart.value).then(result => {
                        if (result) {
                            // var changeShiftView = $(frm + ' #' + optionControls["ControlName"]).data('kendoDropDownList');
                            // changeShiftView.setDataSource([]);
                            // changeShiftView.value(null);

                            let nextState = {
                                ChangeShiftID: {
                                    ...ChangeShiftID,
                                    value: null,
                                    data: [],
                                    refresh: !ChangeShiftID.refresh
                                }
                            };

                            if (result.length == 1) {
                                // changeShiftView.setDataSource([{ ShiftName: result[0]['ShiftNameView'], ID: result[0]['ID'] }]);

                                // changeShiftView.dataSource.read().then(function () {
                                //     setTimeout(function () {
                                //         changeShiftView.value(result[0][changeShiftView.options.dataValueField]);
                                //     }, 200)
                                // });

                                let objValue = { ShiftName: result[0]['ShiftNameView'], ID: result[0]['ID'] };

                                nextState = {
                                    ChangeShiftID: {
                                        ...ChangeShiftID,
                                        value: { ...objValue },
                                        data: [{ ...objValue }],
                                        refresh: !ChangeShiftID.refresh
                                    }
                                };
                            }

                            this.setState(nextState);
                        } else {
                            // $('#' + optionControls["ControlName"]).data('kendoDropDownList').value(null);
                            // $('#' + optionControls["ControlName"]).data('kendoDropDownList').setDataSource([]);
                            this.setState({
                                ChangeShiftID: {
                                    ...ChangeShiftID,
                                    value: null,
                                    data: [],
                                    refresh: !ChangeShiftID.refresh
                                }
                            });
                        }
                    });
                } else {
                    //$('#ChangeShiftID').data('kendoDropDownList').value(null);

                    this.setState({
                        ChangeShiftID: {
                            ...ChangeShiftID,
                            value: null,
                            data: [],
                            refresh: !ChangeShiftID.refresh
                        }
                    });
                }
            }
        });
    };

    //change DateEnd
    onChangeDateEnd = value => {
        const { DateEnd, DateStart, isChoseProfile, UserApprove, UserApprove2 } = this.state;

        let nextState = {
            DateEnd: {
                ...DateEnd,
                value: value
            }
        };

        if (!value) {
            this.readOnlyCtrlRT(true);
            return;
        }

        this.readOnlyCtrlRT(false);

        if (this.isRegisterHelp && DateStart.value) {
            //var checkedOrg = $('input[name=ChooseProfileOrOrgStructure_SelectProfileOrOrgStructureOvertimeInfo]:checked').val();
            if (!isChoseProfile) {
                // isReadOnlyComboBox($(frm + ' #UserApproveID'), false);
                // isReadOnlyComboBox($(frm + ' #UserApproveID2'), false);
                nextState = {
                    ...nextState,
                    UserApprove: {
                        ...UserApprove,
                        disable: false,
                        refresh: !UserApprove.refresh
                    },
                    UserApprove2: {
                        ...UserApprove2,
                        disable: false,
                        refresh: !UserApprove2.refresh
                    }
                };
            }
        }

        this.setState(nextState, () => this.ChangeShiftByConfig());
    };

    treeViewResult = items => {
        const { OrgStructures, ProfilesExclude } = this.state,
            { value } = ProfilesExclude;

        //loại trừ nhân viên không thuộc phòng ban vừa chọn
        let _newValue = [],
            _disableProfileExclude = items && items.length ? false : true;

        if (value && items) {
            value.forEach(profile => {
                let isExist = items.find(org => org.id === profile.OrgStructureID);
                if (isExist) {
                    _newValue = [..._newValue, { ...profile }];
                }
            });
        }

        this.setState(
            {
                OrgStructures: {
                    ...OrgStructures,
                    value: [...items]
                },
                ProfilesExclude: {
                    ...ProfilesExclude,
                    disable: _disableProfileExclude,
                    value: _newValue,
                    api: {
                        urlApi:
                            '[URI_HR]/Hre_GetData/GetMultiProfileByOrderNumber?orderNumber=' +
                            items.map(item => item.OrderNumber).join(),
                        type: 'E_GET'
                    },
                    refresh: !ProfilesExclude.refresh
                }
            },
            () => {
                if (items) {
                    let strOrderNumber = items.map(item => item.OrderNumber).join();

                    HttpService.Post('[URI_HR]/Att_GetData/GetProfileByOrgNumber', { orgNumber: strOrderNumber }).then(
                        returnValue => {
                            try {
                                if (returnValue) {
                                    this.GetHighSupervior(returnValue, 'E_ROSTER');
                                }
                            } catch (error) {
                                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                            }
                        }
                    );
                }
            }
        );
    };

    addMoreExcludeProfiles = items => {
        //
        this.props.navigation.navigate('AttSubmitRosterAddOrEdit');

        if (items.length) {
            const { ProfilesExclude } = this.state,
                _profilesExclude = ProfilesExclude.value;

            if (_profilesExclude && _profilesExclude.length) {
                let data = [];
                items.forEach(item => {
                    let findItem = _profilesExclude.find(profileExclude => {
                        return item.ID == profileExclude.ID;
                    });

                    if (!findItem) {
                        data = [...data, { ...item }];
                    }
                });

                this.setState({
                    ProfilesExclude: {
                        ...ProfilesExclude,
                        refresh: !ProfilesExclude.refresh,
                        value: [..._profilesExclude, ...data]
                    }
                });
            } else {
                this.setState({
                    ProfilesExclude: {
                        ...ProfilesExclude,
                        refresh: !ProfilesExclude.refresh,
                        value: [...items]
                    }
                });
            }
        }
    };

    onFinishPickerMultiExcludeProfile = items => {
        //
        this.setState({
            ProfilesExclude: {
                ...this.state.ProfilesExclude,
                value: [...items]
            }
        });
    };

    nextScreenAddMoreProfilesExcludeProfile = () => {
        const { OrgStructures } = this.state;
        this.props.navigation.navigate('FilterToAddProfile', {
            addMoreProfiles: this.addMoreExcludeProfiles,
            valueFilter: { OrgStructureID: OrgStructures.value }
        });
    };

    addMoreProfiles = items => {
        this.props.navigation.navigate('AttSubmitRosterAddOrEdit');
        this.onFinishPickerMulti(items, true);
    };

    onFinishPickerMulti = (items, isAddMore) => {
        const { Profiles, DateStart, DateEnd } = this.state;

        if (isAddMore) {
            if (items.length) {
                const _profiles = Profiles.value;
                let nextState = {};

                if (_profiles && _profiles.length) {
                    let data = [];
                    items.forEach(item => {
                        let findItem = _profiles.find(profile => {
                            return item.ID == profile.ID;
                        });

                        if (!findItem) {
                            data = [...data, { ...item }];
                        }
                    });

                    nextState = {
                        Profiles: {
                            ...Profiles,
                            value: [..._profiles, ...data],
                            refresh: !Profiles.refresh
                        }
                    };
                } else {
                    nextState = {
                        Profiles: {
                            ...Profiles,
                            value: [...items],
                            refresh: !Profiles.refresh
                        }
                    };
                }

                this.setState(nextState, () => {
                    let pro = items && items[0] ? items[0].ID : null;
                    this.loadHighSupervisor(pro);

                    if (pro) {
                        if (DateStart.value && DateEnd.value) {
                            this.readOnlyCtrlRT(false);
                        } else {
                            this.readOnlyCtrlRT(true);
                        }
                    } else {
                        this.readOnlyCtrlRT(true);
                    }
                });
            }
        } else {
            this.setState(
                {
                    Profiles: {
                        ...Profiles,
                        value: [...items]
                    }
                },
                () => {
                    let pro = items && items[0] ? items[0].ID : null;
                    this.loadHighSupervisor(pro);

                    if (pro) {
                        if (DateStart.value && DateEnd.value) {
                            this.readOnlyCtrlRT(false);
                        } else {
                            this.readOnlyCtrlRT(true);
                        }
                    } else {
                        this.readOnlyCtrlRT(true);
                    }
                }
            );
        }
    };

    nextScreenAddMoreProfiles = () => {
        this.props.navigation.navigate('FilterToAddProfile', {
            addMoreProfiles: this.addMoreProfiles,
            valueFilter: false
        });
    };

    onCheckExcludeProfile = CheckProfilesExclude => {
        //
        let nextState = { CheckProfilesExclude: !CheckProfilesExclude };
        // if (CheckProfilesExclude) {
        //     nextState = {
        //         ...nextState,
        //         ProfilesExclude: {
        //             refresh: false,//!this.state.ProfilesExclude.refresh,
        //             value: null
        //         }
        //     }
        // }
        this.setState(nextState);
    };

    readOnlyCtrlRT = isDisable => {
        const {
            Comment,
            MonShift,
            MonShift2,
            TueShift,
            TueShift2,
            WedShift,
            WedShift2,
            ThuShift,
            ThuShift2,
            FriShift,
            FriShift2,
            SatShift,
            SatShift2,
            SunShift,
            SunShift2
        } = this.state;

        this.setState({
            Comment: { ...Comment, disable: false, refresh: !Comment.refresh },
            MonShift: { ...MonShift, disable: isDisable, refresh: !MonShift.refresh },
            MonShift2: { ...MonShift2, disable: isDisable, refresh: !MonShift2.refresh },
            TueShift: { ...TueShift, disable: isDisable, refresh: !TueShift.refresh },
            TueShift2: { ...TueShift2, disable: isDisable, refresh: !TueShift2.refresh },
            WedShift: { ...WedShift, disable: isDisable, refresh: !WedShift.refresh },
            WedShift2: { ...WedShift2, disable: isDisable, refresh: !WedShift2.refresh },
            ThuShift: { ...ThuShift, disable: isDisable, refresh: !ThuShift.refresh },
            ThuShift2: { ...ThuShift2, disable: isDisable, refresh: !ThuShift2.refresh },
            FriShift: { ...FriShift, disable: isDisable, refresh: !FriShift.refresh },
            FriShift2: { ...FriShift2, disable: isDisable, refresh: !FriShift2.refresh },
            SatShift: { ...SatShift, disable: isDisable, refresh: !SatShift.refresh },
            SatShift2: { ...SatShift2, disable: isDisable, refresh: !SatShift2.refresh },
            SunShift: { ...SunShift, disable: isDisable, refresh: !SunShift.refresh },
            SunShift2: { ...SunShift2, disable: isDisable, refresh: !SunShift2.refresh }
        });
    };

    readOnlyUserApprove = isDisable => {
        // isReadOnlyComboBox($(frm + ' #UserApproveID'), isReadOnly);
        // isReadOnlyComboBox($(frm + ' #UserApproveID2'), isReadOnly);
        // isReadOnlyComboBox($(frm + ' #UserApproveID3'), isReadOnly);
        // isReadOnlyComboBox($(frm + ' #UserApproveID4'), isReadOnly);

        const { UserApprove, UserApprove2, UserApprove3, UserApprove4 } = this.state;

        this.setState({
            UserApprove: { ...UserApprove, disable: isDisable, refresh: !UserApprove.refresh },
            UserApprove2: { ...UserApprove2, disable: isDisable, refresh: !UserApprove2.refresh },
            UserApprove3: { ...UserApprove3, disable: isDisable, refresh: !UserApprove3.refresh },
            UserApprove4: { ...UserApprove4, disable: isDisable, refresh: !UserApprove4.refresh }
        });
    };

    setValueShift = isShift1 => {
        const { MonShift } = this.state;
        if (isShift1) {
            if (MonShift.value) {
                const { TueShift, WedShift, ThuShift, FriShift, SatShift, SunShift } = this.state,
                    _value = MonShift.value;

                this.setState({
                    TueShift: {
                        ...TueShift,
                        value: _value,
                        refresh: !TueShift.refresh
                    },
                    WedShift: {
                        ...WedShift,
                        value: _value,
                        refresh: !WedShift.refresh
                    },
                    ThuShift: {
                        ...ThuShift,
                        value: _value,
                        refresh: !ThuShift.refresh
                    },
                    FriShift: {
                        ...FriShift,
                        value: _value,
                        refresh: !FriShift.refresh
                    },
                    SatShift: {
                        ...SatShift,
                        value: _value,
                        refresh: !SatShift.refresh
                    },
                    SunShift: {
                        ...SunShift,
                        value: _value,
                        refresh: !SunShift.refresh
                    }
                });
            } else {
                ToasterSevice.showWarning('ChoseShiftMonday', 4000);
            }
        } else {
            const { MonShift2 } = this.state;
            if (MonShift2.value) {
                const { TueShift2, WedShift2, ThuShift2, FriShift2, SatShift2, SunShift2 } = this.state,
                    _value = MonShift2.value;

                this.setState({
                    TueShift2: {
                        ...TueShift2,
                        value: _value,
                        refresh: !TueShift2.refresh
                    },
                    WedShift2: {
                        ...WedShift2,
                        value: _value,
                        refresh: !WedShift2.refresh
                    },
                    ThuShift2: {
                        ...ThuShift2,
                        value: _value,
                        refresh: !ThuShift2.refresh
                    },
                    FriShift2: {
                        ...FriShift2,
                        value: _value,
                        refresh: !FriShift2.refresh
                    },
                    SatShift2: {
                        ...SatShift2,
                        value: _value,
                        refresh: !SatShift2.refresh
                    },
                    SunShift2: {
                        ...SunShift2,
                        value: _value,
                        refresh: !SunShift2.refresh
                    }
                });
            } else {
                ToasterSevice.showWarning('ChoseShiftMonday', 4000);
            }
        }
    };

    onPickShift = obj => {
        this.setState(obj);
    };

    onChangeRadioButton = value => {
        //var radioValue = $("input[name='ChooseProfileOrOrgStructure_SelectProfileOrOrgStructureOvertimeInfo']:checked").val();
        //var countUserQuantity = $('#VnrSelectProfileOrOrgStructure_Profile_SelectProfileOrOrgStructureOvertimeInfo').val() != null ? $('#VnrSelectProfileOrOrgStructure_Profile_SelectProfileOrOrgStructureOvertimeInfo').val() : null;

        const { isChoseProfile, Profiles } = this.state;

        //chọn phòng ban

        if (this.isRegisterHelp && !isChoseProfile) {
            this.readOnlyUserApprove(false);
            this.RemoveValidateUser(true);
        }
        //nếu ngược lại là nhân viên có thêm 2 trường hợp
        else if (this.isRegisterHelp) {
            //quay trở lại radio nhân viên mà nếu vẫn còn 2 ng trở lên vẫn bỏ validate
            if (Profiles.value && Profiles.value.length >= 2) {
                this.RemoveValidateUser(true);
                this.readOnlyUserApprove(false);
            }
            //gọi lại hàm load người duyệt
            else {
                const pro = Profiles.value && Profiles.value[0] ? Profiles.value[0].ID : null;
                this.loadHighSupervisor(pro);
                this.RemoveValidateUser(false);
                this.readOnlyUserApprove(true);
            }
        }

        this.setState({ isChoseProfile: value });
    };

    render() {
        let {
            isConfigFromServer,
            isChoseProfile,
            Profiles,
            ProfileID,
            Type,
            DateStart,
            DateEnd,
            DateChange,
            CheckProfilesExclude,
            ProfilesExclude,
            OrgStructures,
            UserApprove,
            UserApprove3,
            UserApprove4,
            UserApprove2,
            Comment,
            MonShift,
            MonShift2,
            TueShift,
            TueShift2,
            WedShift,
            WedShift2,
            ThuShift,
            ThuShift2,
            FriShift,
            FriShift2,
            SatShift,
            SatShift2,
            SunShift,
            SunShift2,
            RosterGroupName,
            isShowRoster,
            isShowRoster2,
            ChangeShiftID,
            SubstituteShiftID,
            fieldValid
        } = this.state;

        const {
            textLableInfo,
            formDate_To_From,
            controlDate_To,
            controlDate_from,
            contentViewControl,
            viewLable,
            viewControl
        } = stylesListPickerControl;


        //#region [Xử lý 3 nút lưu]
        const listActions = [];

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_Roster_New_CreateOrUpdate_btnSaveandSendMail'] &&
            PermissionForAppMobile.value['New_Att_Roster_New_CreateOrUpdate_btnSaveandSendMail']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_SENMAIL,
                title: translate('HRM_Common_SaveAndSendMail'),
                onPress: () => this.saveAndSend(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_Roster_New_CreateOrUpdate_btnSaveandClose'] &&
            PermissionForAppMobile.value['New_Att_Roster_New_CreateOrUpdate_btnSaveandClose']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_CLOSE,
                title: translate('HRM_Common_SaveClose'),
                onPress: () => this.save(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_Roster_New_CreateOrUpdate_btnSaveNew'] &&
            PermissionForAppMobile.value['New_Att_Roster_New_CreateOrUpdate_btnSaveNew']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_NEW,
                title: translate('HRM_Common_SaveNew'),
                onPress: () => this.saveAndCreate(this.props.navigation)
            });
        }

        let isType =
            Type.value !== null &&
            isConfigFromServer === true &&
            (Type.value.Value === 'E_SHIFT_MANUAL' ||
                Type.value.Value === 'E_CHANGE_SHIFT' ||
                Type.value.Value === 'E_DEFAULT');

        //#endregion
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>
                    {this.isRegisterHelp != null && (
                        <KeyboardAwareScrollView
                            keyboardShouldPersistTaps={'handled'}
                            contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                        >
                            {/* Profiles */}
                            {this.isRegisterHelp && !this.isModify ? (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <RadioForm
                                            formHorizontal={true}
                                            labelHorizontal={true}
                                            buttonStyle={CustomStyleSheet.marginLeft(20)}
                                            buttonSize={16}
                                            buttonOuterSize={30}
                                            animation={false}
                                            radio_props={[
                                                { label: 'Nhân viên', value: true },
                                                { label: 'Phòng ban', value: false }
                                            ]}
                                            initial={0}
                                            onPress={value => this.onChangeRadioButton(value)}
                                        />
                                    </View>
                                    <View style={viewControl}>
                                        {isChoseProfile ? (
                                            <View style={styleSheets.flex1flexDirectionRow}>
                                                <View style={CustomStyleSheet.flex(1)}>
                                                    <VnrPickerMulti
                                                        api={{
                                                            urlApi: '[URI_HR]/Hre_GetData/GetMultiProfile',
                                                            type: 'E_GET'
                                                        }}
                                                        value={Profiles.value}
                                                        refresh={Profiles.refresh}
                                                        textField="ProfileName"
                                                        valueField="ID"
                                                        filter={true}
                                                        filterServer={true}
                                                        filterParams="text"
                                                        //placeHolder={"cs"}
                                                        onFinish={items => this.onFinishPickerMulti(items)}
                                                    />
                                                </View>

                                                <View>
                                                    <TouchableOpacity
                                                        style={styles.btnNoName}
                                                        onPress={() => this.nextScreenAddMoreProfiles()}
                                                    >
                                                        <Icon name={'md-search'} size={Size.iconSize} color={'#fff'} />
                                                    </TouchableOpacity>
                                                </View>
                                            </View>
                                        ) : (
                                            <View style={CustomStyleSheet.flex(1)}>
                                                <View style={CustomStyleSheet.flex(1)}>
                                                    <VnrTreeView
                                                        api={{
                                                            urlApi: '[URI_HR]/Cat_GetData/GetOrgTreeView',
                                                            type: 'E_GET'
                                                        }}
                                                        value={OrgStructures.value}
                                                        refresh={OrgStructures.refresh}
                                                        isCheckChildren={true}
                                                        valueField={'OrderNumber'}
                                                        onSelect={items => this.treeViewResult(items)}
                                                    />
                                                </View>
                                                <View style={styleSheets.flex1flexDirectionRow}>
                                                    <TouchableOpacity
                                                        onPress={() =>
                                                            this.setState({
                                                                CheckProfilesExclude: !CheckProfilesExclude
                                                            })
                                                        }
                                                    >
                                                        <Text>Loại trừ nhân viên</Text>
                                                        <CheckBox
                                                            isChecked={CheckProfilesExclude}
                                                            onClick={() =>
                                                                this.onCheckExcludeProfile(CheckProfilesExclude)
                                                            }
                                                        />
                                                    </TouchableOpacity>
                                                </View>
                                                {CheckProfilesExclude && (
                                                    <View style={styleSheets.flex1flexDirectionRow}>
                                                        <View style={CustomStyleSheet.flex(1)}>
                                                            <VnrPickerMulti
                                                                api={ProfilesExclude.api}
                                                                value={ProfilesExclude.value}
                                                                refresh={ProfilesExclude.refresh}
                                                                textField="ProfileName"
                                                                valueField="ID"
                                                                filter={true}
                                                                filterServer={true}
                                                                disable={ProfilesExclude.disable}
                                                                filterParams="text"
                                                                onFinish={items =>
                                                                    this.onFinishPickerMultiExcludeProfile(items)
                                                                }
                                                            />
                                                        </View>

                                                        <View>
                                                            <TouchableOpacity
                                                                style={styles.btnNoName}
                                                                onPress={() => {
                                                                    if (!ProfilesExclude.disable) {
                                                                        this.nextScreenAddMoreProfilesExcludeProfile();
                                                                    }
                                                                }}
                                                            >
                                                                <Icon
                                                                    name={'md-search'}
                                                                    size={Size.iconSize}
                                                                    color={'#fff'}
                                                                />
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                </View>
                            ) : (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Overtime_ProfileName'}
                                        />

                                        {/* valid ProfileID */}
                                        {fieldValid.ProfileID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrTextInput disable={true} value={ProfileID['ProfileName']} />
                                    </View>
                                </View>
                            )}

                            {/* Type - loại */}
                            {Type.visible && Type.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Roster_Type'}
                                        />

                                        {/* valid Type */}
                                        {fieldValid.Type && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerQuickly
                                            dataLocal={Type.data}
                                            textField="Text"
                                            valueField="Value"
                                            filter={false}
                                            refresh={Type.refresh}
                                            value={Type.value}
                                            onFinish={item => this.onChangeType(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* DateStart - DateEnd - ngày hiệu lực */}
                            {DateStart.visible && DateStart.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Roster_DateStart'}
                                        />

                                        {/* valid DateStart */}
                                        {fieldValid.DateStart && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <View style={formDate_To_From}>
                                            <View style={controlDate_from}>
                                                <VnrDate
                                                    response={'string'}
                                                    format={'DD/MM/YYYY'}
                                                    value={DateStart.value}
                                                    refresh={DateStart.refresh}
                                                    type={'date'}
                                                    onFinish={value => this.onChangeDateStart(value)}
                                                />
                                            </View>
                                            <View style={controlDate_To}>
                                                <VnrDate
                                                    disable={DateEnd.disable}
                                                    response={'string'}
                                                    format={'DD/MM/YYYY'}
                                                    value={DateEnd.value}
                                                    refresh={DateEnd.refresh}
                                                    type={'date'}
                                                    onFinish={value => this.onChangeDateEnd(value)}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}

                            {/* ChangeShiftID - ca thay thế */}
                            {ChangeShiftID.visible && ChangeShiftID.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Roster_ChangeShiftID'}
                                        />

                                        {/* valid ChangeShiftID */}
                                        {fieldValid.ChangeShiftID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi: '[URI_HR]/Cat_GetData/GetMultiShiftByOrdernumberinPortal',
                                                type: 'E_GET'
                                            }}
                                            refresh={ChangeShiftID.refresh}
                                            textField="ShiftName"
                                            valueField="ID"
                                            filter={false}
                                            value={ChangeShiftID.value}
                                            //filterServer={true}
                                            //filterParams="text"
                                            disable={ChangeShiftID.disable}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* DateChange - ngày đổi ca */}
                            {DateChange.visible && DateChange.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Roster_DateChange'}
                                        />

                                        {/* valid DateChange */}
                                        {fieldValid.DateChange && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={DateChange.value}
                                            refresh={DateChange.refresh}
                                            type={'date'}
                                            onFinish={value => this.onDateChange(value)}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* SubstituteShiftID - ca thay thế */}
                            {SubstituteShiftID.visible && SubstituteShiftID.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Roster_SubstituteShiftID'}
                                        />

                                        {/* valid SubstituteShiftID */}
                                        {fieldValid.SubstituteShiftID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi: '[URI_HR]/Cat_GetData/GetMultiShiftByOrdernumberinPortal',
                                                type: 'E_GET'
                                            }}
                                            refresh={SubstituteShiftID.refresh}
                                            textField="ShiftName"
                                            valueField="ID"
                                            filter={false}
                                            value={SubstituteShiftID.value}
                                            //filterServer={true}
                                            //filterParams="text"
                                            disable={SubstituteShiftID.disable}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* RosterGroupName - nhóm ca */}
                            {RosterGroupName.visible && RosterGroupName.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Roster_RosterGroupName'}
                                        />

                                        {/* valid RosterGroupName */}
                                        {fieldValid.RosterGroupName && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi:
                                                    '[URI_HR]/Sal_GetData/New_GetConfigElementReturnList?key=HRM_ATT_CONFIG_NAME_ROSTERGROUP',
                                                type: 'E_GET'
                                            }}
                                            refresh={RosterGroupName.refresh}
                                            textField="Value"
                                            valueField="Key"
                                            filter={true}
                                            value={RosterGroupName.value}
                                            filterServer={false}
                                            autoFilter={true}
                                            disable={RosterGroupName.disable}
                                            onFinish={item =>
                                                this.setState({
                                                    RosterGroupName: {
                                                        ...RosterGroupName,
                                                        value: item
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* UserApproveID - duyệt đầu */}
                            {UserApprove.visible && UserApprove.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_TAMScanLog_UserApproveID'}
                                        />

                                        {/* valid UserApproveID */}
                                        {fieldValid.UserApproveID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_ROSTER',
                                                type: 'E_GET'
                                            }}
                                            refresh={UserApprove.refresh}
                                            textField="UserInfoName"
                                            valueField="ID"
                                            filter={true}
                                            value={UserApprove.value}
                                            filterServer={true}
                                            filterParams="text"
                                            disable={UserApprove.disable}
                                            onFinish={item => this.onChangeUserApprove(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* UserApproveID3 - duyệt giữa */}
                            {UserApprove3.visible && UserApprove3.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_TAMScanLog_UserApproveID3'}
                                        />

                                        {/* valid UserApproveID3 */}
                                        {fieldValid.UserApproveID3 && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_ROSTER',
                                                type: 'E_GET'
                                            }}
                                            value={UserApprove3.value}
                                            refresh={UserApprove3.refresh}
                                            textField="UserInfoName"
                                            valueField="ID"
                                            filter={true}
                                            filterServer={true}
                                            filterParams="text"
                                            disable={UserApprove3.disable}
                                            onFinish={item => {
                                                this.setState({
                                                    UserApprove3: {
                                                        ...UserApprove3,
                                                        value: item
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* UserApproveID4 - duyệt tiếp theo */}
                            {UserApprove4.visible && UserApprove4.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_TAMScanLog_UserApproveID4'}
                                        />

                                        {/* valid UserApproveID4 */}
                                        {fieldValid.UserApproveID4 && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_ROSTER',
                                                type: 'E_GET'
                                            }}
                                            value={UserApprove4.value}
                                            refresh={UserApprove4.refresh}
                                            textField="UserInfoName"
                                            valueField="ID"
                                            filter={true}
                                            filterServer={true}
                                            filterParams="text"
                                            disable={UserApprove4.disable}
                                            onFinish={item => {
                                                this.setState({
                                                    UserApprove4: {
                                                        ...UserApprove4,
                                                        value: item
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* UserApproveID2 - duyệt cuối */}
                            {UserApprove2.visible && UserApprove2.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_TAMScanLog_UserApproveID2'}
                                        />

                                        {/* valid UserApproveID2 */}
                                        {fieldValid.UserApproveID2 && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_ROSTER',
                                                type: 'E_GET'
                                            }}
                                            refresh={UserApprove2.refresh}
                                            textField="UserInfoName"
                                            valueField="ID"
                                            filter={true}
                                            filterServer={true}
                                            value={UserApprove2.value}
                                            filterParams="text"
                                            disable={UserApprove2.disable}
                                            onFinish={item => this.onChangeUserApprove2(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Comment - ghi chú */}
                            {Comment.visible && Comment.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Roster_Comment'}
                                        />

                                        {/* valid Comment */}
                                        {fieldValid.Comment && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={Comment.disable}
                                            refresh={Comment.refresh}
                                            value={Comment.value}
                                            onChangeText={text =>
                                                this.setState({ Comment: { ...Comment, value: text } })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* chọn ca */}
                            {isShowRoster && (
                                <View>
                                    {/* ca 1 */}
                                    <View>
                                        {/* ca ngày thứ 2 */}
                                        <View style={contentViewControl}>
                                            <View style={viewLable}>
                                                <VnrText
                                                    style={[styleSheets.text, textLableInfo]}
                                                    i18nKey={'HRM_Attendance_Roster_MonShiftID'}
                                                />

                                                {/* valid MonShiftID */}
                                                {fieldValid.MonShiftID && (
                                                    <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                )}
                                            </View>
                                            <View style={viewControl}>
                                                <View style={CustomStyleSheet.flex(8)}>
                                                    {isType ? (
                                                        <VnrPickerMultiSave
                                                            api={{
                                                                urlApi:
                                                                    '[URI_HR]/Cat_GetData/GetMultiShiftByOrdernumber',
                                                                type: 'E_GET'
                                                            }}
                                                            // dataLocal={MonShift.data}
                                                            isConfig={isConfigFromServer}
                                                            apiRemove={{
                                                                urlApi: '[URI_HR]/Att_GetData/CheckInOutShift',
                                                                type: 'E_POST',
                                                                dataBody: {
                                                                    strShiftID: ''
                                                                }
                                                            }}
                                                            refresh={MonShift.refresh}
                                                            textField="ShiftName"
                                                            valueField="ID"
                                                            filter={true}
                                                            filterServer={false}
                                                            autoFilter={true}
                                                            value={MonShift.value}
                                                            disable={MonShift.disable}
                                                            onFinish={item => {
                                                                this.onPickShift({
                                                                    MonShift: { ...MonShift, value: item }
                                                                });
                                                            }}
                                                        />
                                                    ) : (
                                                        <VnrPicker
                                                            dataLocal={MonShift.data}
                                                            refresh={MonShift.refresh}
                                                            textField="ShiftName"
                                                            valueField="ID"
                                                            filter={true}
                                                            filterServer={false}
                                                            autoFilter={true}
                                                            value={MonShift.value}
                                                            disable={MonShift.disable}
                                                            onFinish={item =>
                                                                this.onPickShift({
                                                                    MonShift: { ...MonShift, value: item }
                                                                })
                                                            }
                                                        />
                                                    )}
                                                </View>
                                            </View>
                                        </View>

                                        {/* ca ngày thứ 3 */}
                                        <View style={contentViewControl}>
                                            <View style={viewLable}>
                                                <VnrText
                                                    style={[styleSheets.text, textLableInfo]}
                                                    i18nKey={'HRM_Attendance_Roster_TueShiftID'}
                                                />

                                                {/* valid TueShiftID */}
                                                {fieldValid.TueShiftID && (
                                                    <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                )}
                                            </View>
                                            <View style={viewControl}>
                                                {isType ? (
                                                    <VnrPickerMultiSave
                                                        api={{
                                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiShiftByOrdernumber',
                                                            type: 'E_GET'
                                                        }}
                                                        // dataLocal={TueShift.data}
                                                        isConfig={isConfigFromServer}
                                                        apiRemove={{
                                                            urlApi: '[URI_HR]/Att_GetData/CheckInOutShift',
                                                            type: 'E_POST',
                                                            dataBody: {
                                                                strShiftID: ''
                                                            }
                                                        }}
                                                        refresh={TueShift.refresh}
                                                        textField="ShiftName"
                                                        valueField="ID"
                                                        filter={true}
                                                        filterServer={false}
                                                        autoFilter={true}
                                                        value={TueShift.value}
                                                        disable={TueShift.disable}
                                                        onFinish={item =>
                                                            this.onPickShift({ TueShift: { ...TueShift, value: item } })
                                                        }
                                                    />
                                                ) : (
                                                    <VnrPicker
                                                        dataLocal={TueShift.data}
                                                        refresh={TueShift.refresh}
                                                        textField="ShiftName"
                                                        valueField="ID"
                                                        filter={true}
                                                        filterServer={false}
                                                        autoFilter={true}
                                                        value={TueShift.value}
                                                        disable={TueShift.disable}
                                                        onFinish={item =>
                                                            this.onPickShift({ TueShift: { ...TueShift, value: item } })
                                                        }
                                                    />
                                                )}
                                            </View>
                                        </View>

                                        {/* ca ngày thứ 4 */}
                                        <View style={contentViewControl}>
                                            <View style={viewLable}>
                                                <VnrText
                                                    style={[styleSheets.text, textLableInfo]}
                                                    i18nKey={'HRM_Attendance_Roster_WedShiftID'}
                                                />

                                                {/* valid WedShiftID */}
                                                {fieldValid.WedShiftID && (
                                                    <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                )}
                                            </View>
                                            <View style={viewControl}>
                                                {isType ? (
                                                    <VnrPickerMultiSave
                                                        api={{
                                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiShiftByOrdernumber',
                                                            type: 'E_GET'
                                                        }}
                                                        // dataLocal={WedShiftID.data}
                                                        isConfig={isConfigFromServer}
                                                        apiRemove={{
                                                            urlApi: '[URI_HR]/Att_GetData/CheckInOutShift',
                                                            type: 'E_POST',
                                                            dataBody: {
                                                                strShiftID: ''
                                                            }
                                                        }}
                                                        refresh={WedShift.refresh}
                                                        textField="ShiftName"
                                                        valueField="ID"
                                                        filter={true}
                                                        filterServer={false}
                                                        autoFilter={true}
                                                        value={WedShift.value}
                                                        disable={WedShift.disable}
                                                        onFinish={item =>
                                                            this.onPickShift({ WedShift: { ...WedShift, value: item } })
                                                        }
                                                    />
                                                ) : (
                                                    <VnrPicker
                                                        dataLocal={WedShift.data}
                                                        refresh={WedShift.refresh}
                                                        textField="ShiftName"
                                                        valueField="ID"
                                                        filter={true}
                                                        filterServer={false}
                                                        autoFilter={true}
                                                        value={WedShift.value}
                                                        disable={WedShift.disable}
                                                        onFinish={item =>
                                                            this.onPickShift({ WedShift: { ...WedShift, value: item } })
                                                        }
                                                    />
                                                )}
                                            </View>
                                        </View>

                                        {/* ca ngày thứ 5 */}
                                        <View style={contentViewControl}>
                                            <View style={viewLable}>
                                                <VnrText
                                                    style={[styleSheets.text, textLableInfo]}
                                                    i18nKey={'HRM_Attendance_Roster_ThuShiftID'}
                                                />

                                                {/* valid ThuShiftID */}
                                                {fieldValid.ThuShiftID && (
                                                    <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                )}
                                            </View>
                                            <View style={viewControl}>
                                                {isType ? (
                                                    <VnrPickerMultiSave
                                                        api={{
                                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiShiftByOrdernumber',
                                                            type: 'E_GET'
                                                        }}
                                                        // dataLocal={ThuShift.data}
                                                        isConfig={isConfigFromServer}
                                                        apiRemove={{
                                                            urlApi: '[URI_HR]/Att_GetData/CheckInOutShift',
                                                            type: 'E_POST',
                                                            dataBody: {
                                                                strShiftID: ''
                                                            }
                                                        }}
                                                        refresh={ThuShift.refresh}
                                                        textField="ShiftName"
                                                        valueField="ID"
                                                        filter={true}
                                                        filterServer={false}
                                                        autoFilter={true}
                                                        value={ThuShift.value}
                                                        disable={ThuShift.disable}
                                                        onFinish={item =>
                                                            this.onPickShift({ ThuShift: { ...ThuShift, value: item } })
                                                        }
                                                    />
                                                ) : (
                                                    <VnrPicker
                                                        dataLocal={ThuShift.data}
                                                        refresh={ThuShift.refresh}
                                                        textField="ShiftName"
                                                        valueField="ID"
                                                        filter={true}
                                                        filterServer={false}
                                                        autoFilter={true}
                                                        value={ThuShift.value}
                                                        disable={ThuShift.disable}
                                                        onFinish={item =>
                                                            this.onPickShift({ ThuShift: { ...ThuShift, value: item } })
                                                        }
                                                    />
                                                )}
                                            </View>
                                        </View>

                                        {/* ca ngày thứ 6 */}
                                        <View style={contentViewControl}>
                                            <View style={viewLable}>
                                                <VnrText
                                                    style={[styleSheets.text, textLableInfo]}
                                                    i18nKey={'HRM_Attendance_Roster_FriShiftID'}
                                                />

                                                {/* valid FriShiftID */}
                                                {fieldValid.FriShiftID && (
                                                    <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                )}
                                            </View>
                                            <View style={viewControl}>
                                                {isType ? (
                                                    <VnrPickerMultiSave
                                                        api={{
                                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiShiftByOrdernumber',
                                                            type: 'E_GET'
                                                        }}
                                                        // dataLocal={FriShift.data}
                                                        isConfig={isConfigFromServer}
                                                        apiRemove={{
                                                            urlApi: '[URI_HR]/Att_GetData/CheckInOutShift',
                                                            type: 'E_POST',
                                                            dataBody: {
                                                                strShiftID: ''
                                                            }
                                                        }}
                                                        refresh={FriShift.refresh}
                                                        textField="ShiftName"
                                                        valueField="ID"
                                                        filter={true}
                                                        filterServer={false}
                                                        autoFilter={true}
                                                        value={FriShift.value}
                                                        disable={FriShift.disable}
                                                        onFinish={item =>
                                                            this.onPickShift({ FriShift: { ...FriShift, value: item } })
                                                        }
                                                    />
                                                ) : (
                                                    <VnrPicker
                                                        dataLocal={FriShift.data}
                                                        refresh={FriShift.refresh}
                                                        textField="ShiftName"
                                                        valueField="ID"
                                                        filter={true}
                                                        filterServer={false}
                                                        autoFilter={true}
                                                        value={FriShift.value}
                                                        disable={FriShift.disable}
                                                        onFinish={item =>
                                                            this.onPickShift({ FriShift: { ...FriShift, value: item } })
                                                        }
                                                    />
                                                )}
                                            </View>
                                        </View>

                                        {/* ca ngày thứ 7 */}
                                        <View style={contentViewControl}>
                                            <View style={viewLable}>
                                                <VnrText
                                                    style={[styleSheets.text, textLableInfo]}
                                                    i18nKey={'HRM_Attendance_Roster_SatShiftID'}
                                                />

                                                {/* valid SatShiftID */}
                                                {fieldValid.SatShiftID && (
                                                    <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                )}
                                            </View>
                                            <View style={viewControl}>
                                                {isType ? (
                                                    <VnrPickerMultiSave
                                                        api={{
                                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiShiftByOrdernumber',
                                                            type: 'E_GET'
                                                        }}
                                                        // dataLocal={SatShift.data}
                                                        isConfig={isConfigFromServer}
                                                        apiRemove={{
                                                            urlApi: '[URI_HR]/Att_GetData/CheckInOutShift',
                                                            type: 'E_POST',
                                                            dataBody: {
                                                                strShiftID: ''
                                                            }
                                                        }}
                                                        refresh={SatShift.refresh}
                                                        textField="ShiftName"
                                                        valueField="ID"
                                                        filter={true}
                                                        filterServer={false}
                                                        autoFilter={true}
                                                        value={SatShift.value}
                                                        disable={SatShift.disable}
                                                        onFinish={item =>
                                                            this.onPickShift({ SatShift: { ...SatShift, value: item } })
                                                        }
                                                    />
                                                ) : (
                                                    <VnrPicker
                                                        dataLocal={SatShift.data}
                                                        refresh={SatShift.refresh}
                                                        textField="ShiftName"
                                                        valueField="ID"
                                                        filter={true}
                                                        filterServer={false}
                                                        autoFilter={true}
                                                        value={SatShift.value}
                                                        disable={SatShift.disable}
                                                        onFinish={item =>
                                                            this.onPickShift({ SatShift: { ...SatShift, value: item } })
                                                        }
                                                    />
                                                )}
                                            </View>
                                        </View>

                                        {/* ca ngày thứ cn */}
                                        <View style={contentViewControl}>
                                            <View style={viewLable}>
                                                <VnrText
                                                    style={[styleSheets.text, textLableInfo]}
                                                    i18nKey={'HRM_Attendance_Roster_SunShiftID'}
                                                />

                                                {/* valid SunShiftID */}
                                                {fieldValid.SunShiftID && (
                                                    <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                )}
                                            </View>
                                            <View style={viewControl}>
                                                {isType ? (
                                                    <VnrPickerMultiSave
                                                        api={{
                                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiShiftByOrdernumber',
                                                            type: 'E_GET'
                                                        }}
                                                        // dataLocal={SunShift.data}
                                                        isConfig={isConfigFromServer}
                                                        apiRemove={{
                                                            urlApi: '[URI_HR]/Att_GetData/CheckInOutShift',
                                                            type: 'E_POST',
                                                            dataBody: {
                                                                strShiftID: ''
                                                            }
                                                        }}
                                                        refresh={SunShift.refresh}
                                                        textField="ShiftName"
                                                        valueField="ID"
                                                        filter={true}
                                                        filterServer={false}
                                                        autoFilter={true}
                                                        value={SunShift.value}
                                                        disable={SunShift.disable}
                                                        onFinish={item =>
                                                            this.onPickShift({ SunShift: { ...SunShift, value: item } })
                                                        }
                                                    />
                                                ) : (
                                                    <VnrPicker
                                                        dataLocal={SunShift.data}
                                                        refresh={SunShift.refresh}
                                                        textField="ShiftName"
                                                        valueField="ID"
                                                        filter={true}
                                                        filterServer={false}
                                                        autoFilter={true}
                                                        value={SunShift.value}
                                                        disable={SunShift.disable}
                                                        onFinish={item =>
                                                            this.onPickShift({ SunShift: { ...SunShift, value: item } })
                                                        }
                                                    />
                                                )}
                                            </View>
                                        </View>
                                    </View>

                                    {/* ca 2 */}
                                    {isShowRoster2 && !isType ? (
                                        <View>
                                            {/* ca 2 ngày thứ 2 */}
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={'HRM_Attendance_Roster_MonShiftID'}
                                                    />

                                                    {/* valid MonShift2ID */}
                                                    {fieldValid.MonShift2ID && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <View style={CustomStyleSheet.flex(8)}>
                                                        <VnrPicker
                                                            autoFilter={true}
                                                            dataLocal={MonShift2.data}
                                                            refresh={MonShift2.refresh}
                                                            textField="ShiftName"
                                                            valueField="ID"
                                                            filter={true}
                                                            filterServer={false}
                                                            value={MonShift2.value}
                                                            disable={MonShift2.disable}
                                                            onFinish={item =>
                                                                this.onPickShift({
                                                                    MonShift2: { ...MonShift2, value: item }
                                                                })
                                                            }
                                                        />
                                                    </View>
                                                </View>
                                            </View>

                                            {/* ca 2 ngày thứ 3 */}
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={'HRM_Attendance_Roster_TueShiftID'}
                                                    />

                                                    {/* valid TueShift2ID */}
                                                    {fieldValid.TueShift2ID && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPicker
                                                        autoFilter={true}
                                                        dataLocal={TueShift2.data}
                                                        refresh={TueShift2.refresh}
                                                        textField="ShiftName"
                                                        valueField="ID"
                                                        filter={true}
                                                        filterServer={false}
                                                        value={TueShift2.value}
                                                        disable={TueShift2.disable}
                                                        onFinish={item =>
                                                            this.onPickShift({
                                                                TueShift2: { ...TueShift2, value: item }
                                                            })
                                                        }
                                                    />
                                                </View>
                                            </View>

                                            {/* ca 2 ngày thứ 4 */}
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={'HRM_Attendance_Roster_WedShiftID'}
                                                    />

                                                    {/* valid WedShift2ID */}
                                                    {fieldValid.WedShift2ID && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPicker
                                                        autoFilter={true}
                                                        dataLocal={WedShift2.data}
                                                        refresh={WedShift2.refresh}
                                                        textField="ShiftName"
                                                        valueField="ID"
                                                        filter={true}
                                                        filterServer={false}
                                                        value={WedShift2.value}
                                                        disable={WedShift2.disable}
                                                        onFinish={item =>
                                                            this.onPickShift({
                                                                WedShift2: { ...WedShift2, value: item }
                                                            })
                                                        }
                                                    />
                                                </View>
                                            </View>

                                            {/* ca 2 ngày thứ 5 */}
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={'HRM_Attendance_Roster_ThuShiftID'}
                                                    />

                                                    {/* valid ThuShift2ID */}
                                                    {fieldValid.ThuShift2ID && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPicker
                                                        autoFilter={true}
                                                        dataLocal={ThuShift2.data}
                                                        refresh={ThuShift2.refresh}
                                                        textField="ShiftName"
                                                        valueField="ID"
                                                        filter={true}
                                                        filterServer={false}
                                                        value={ThuShift2.value}
                                                        disable={ThuShift2.disable}
                                                        onFinish={item =>
                                                            this.onPickShift({
                                                                ThuShift2: { ...ThuShift2, value: item }
                                                            })
                                                        }
                                                    />
                                                </View>
                                            </View>

                                            {/* ca 2 ngày thứ 6 */}
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={'HRM_Attendance_Roster_FriShiftID'}
                                                    />

                                                    {/* valid FriShift2ID */}
                                                    {fieldValid.FriShift2ID && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPicker
                                                        autoFilter={true}
                                                        dataLocal={FriShift2.data}
                                                        refresh={FriShift2.refresh}
                                                        textField="ShiftName"
                                                        valueField="ID"
                                                        filter={true}
                                                        filterServer={false}
                                                        value={FriShift2.value}
                                                        disable={FriShift2.disable}
                                                        onFinish={item =>
                                                            this.onPickShift({
                                                                FriShift2: { ...FriShift2, value: item }
                                                            })
                                                        }
                                                    />
                                                </View>
                                            </View>

                                            {/* ca 2 ngày thứ 7 */}
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={'HRM_Attendance_Roster_SatShiftID'}
                                                    />

                                                    {/* valid SatShift2ID */}
                                                    {fieldValid.SatShift2ID && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPicker
                                                        autoFilter={true}
                                                        dataLocal={SatShift2.data}
                                                        refresh={SatShift2.refresh}
                                                        textField="ShiftName"
                                                        valueField="ID"
                                                        filter={true}
                                                        filterServer={false}
                                                        value={SatShift2.value}
                                                        disable={SatShift2.disable}
                                                        onFinish={item =>
                                                            this.onPickShift({
                                                                SatShift2: { ...SatShift2, value: item }
                                                            })
                                                        }
                                                    />
                                                </View>
                                            </View>

                                            {/* ca 2 ngày thứ cn */}
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={'HRM_Attendance_Roster_SunShiftID'}
                                                    />

                                                    {/* valid SunShift2ID */}
                                                    {fieldValid.SunShift2ID && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPicker
                                                        autoFilter={true}
                                                        dataLocal={SunShift2.data}
                                                        refresh={SunShift2.refresh}
                                                        textField="ShiftName"
                                                        valueField="ID"
                                                        filter={true}
                                                        filterServer={false}
                                                        value={SunShift2.value}
                                                        disable={SunShift2.disable}
                                                        onFinish={item =>
                                                            this.onPickShift({
                                                                SunShift2: { ...SunShift2, value: item }
                                                            })
                                                        }
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    ) : null}
                                </View>
                            )}
                        </KeyboardAwareScrollView>
                    )}
                    {this.isRegisterHelp != null && (
                        <ListButtonSave listActions={listActions} />
                    )}
                </View>
            </SafeAreaView>
        );
    }
}
const styles = StyleSheet.create({
    btnNoName: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.orange,
        justifyContent: 'center',
        padding: 15,
        paddingBottom: 8,
        paddingTop: 8,
        marginLeft: 5,
        alignItems: 'center'
    }
});
{
    /* loại đăng ký đổi ca */
}
{
    /* <View style={contentViewControl}>
                                    <View style={viewLable} >
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={"HRM_Attendance_Roster_ChangeShiftType"} />
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            dataLocal={ChangeShiftType.data}
                                            textField="Text"
                                            valueField="Value"
                                            filter={true}
                                            refresh={ChangeShiftType.refresh}
                                            filterServer={false}
                                            value={ChangeShiftType.value}
                                            onFinish={(item) => {
                                                this.setState({
                                                    ChangeShiftType: {
                                                        ...this.state.ChangeShiftType,
                                                        value: item
                                                    }
                                                })
                                            }}
                                        />
                                    </View>
                                </View> */
}
{
    /* chọn ca */
}
{
    /* <View style={contentViewControl}>
    <View style={viewLable} >
        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={"HRM_Chose_Shift"} />
    </View>
    <View style={viewControl}>
        <VnrPicker
            api={
                {
                    "urlApi": "[URI_HR]/Cat_GetData/GetMultiShiftByOrdernumber",
                    "type": "E_GET"
                }
            }
            refresh={Tmp_ShiftID.refresh}
            textField="ShiftName"
            valueField="ID"
            filter={true}
            value={Tmp_ShiftID.value}
            filterServer={false}
            //filterParams="text"
            disable={Tmp_ShiftID.disable}
            onFinish={(item) => alert('1')}
        />
    </View>
</View> */
}
