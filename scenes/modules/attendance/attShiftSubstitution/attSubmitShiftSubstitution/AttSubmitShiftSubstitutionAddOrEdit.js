import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Size,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    stylesScreenDetailV2,
    stylesModalPopupBottom,
    styleViewTitleForGroup,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import Modal from 'react-native-modal';
import HttpService from '../../../../../utils/HttpService';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { translate } from '../../../../../i18n/translate';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { EnumName, EnumIcon } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../utils/DrawerServices';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import moment from 'moment';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import { IconColse } from '../../../../../constants/Icons';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import VnrPickerMultiSave from '../../../../../components/VnrPickerMulti/VnrPickerMultiSave';

let enumName = null,
    profileInfo = null;

const initSateDefault = {
    ChangeShiftType: {
        label: 'HRM_Att_ShiftSubstitution_ChangeShiftType',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        data: [],
        visibleConfig: true
    },
    ProfileID1: {
        ID: null,
        ProfileName: '',
        visible: true,
        visibleConfig: true,
        label: 'HRM_Att_ShiftSubstitution_Requester'
    },
    ProfileID2: {
        label: 'HRM_Att_ShiftSubstitution_SubstitutePerson',
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        data: null,
        visibleConfig: true
    },
    ChangeDate: {
        label: 'HRM_Att_ShiftSubstitution_CurrentDate',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    AlternateDate: {
        label: 'HRM_Att_ShiftSubstitution_SubstituteDate',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    ChangeShiftID: {
        label: 'HRM_Att_ShiftSubstitution_CurrentShift',
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true,
        data: []
    },
    AlternateShiftID: {
        label: 'HRM_Att_ShiftSubstitution_SubstituteShift',
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true,
        data: []
    },
    UserApproveID: {
        label: 'HRM_Attendance_Overtime_UserApproveID',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    UserApproveID2: {
        label: 'HRM_Attendance_Overtime_UserApproveID3',
        disable: false,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    UserApproveID3: {
        label: 'HRM_Attendance_Att_Overtime_Submit_UserApproveID4',
        disable: false,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    UserApproveID4: {
        label: 'HRM_Attendance_Overtime_UserApproveID2',
        disable: false,
        visible: true,
        refresh: false,
        value: null,
        visibleConfig: true
    },
    ChangeShiftReason: {
        label: 'HRM_Att_ShiftSubstitution_ChangeShiftReason',
        disable: false,
        refresh: false,
        value: '',
        visible: true,
        visibleConfig: true
    },
    modalErrorDetail: {
        isModalVisible: false,
        cacheID: null,
        data: []
    },
    fieldValid: {},
    disableBtnSave: false,
    isConfigFromServer: false,
    lstChangeShiftID: null,
    parentChangeShiftID: null,
    parentAlternateShiftID: null,
    lstAlternateNotSelected: null,
    messageBeforeSave: ''
};

// eslint-disable-next-line no-unused-vars
const dataDefault = [
    {
        ChangeShift: 'AR6 - AR6',
        ChangeShiftID: 'feb6e77e-2b01-4f1a-93ee-0c0297c24ec8',
        Code: 'AR6',
        ID: 'feb6e77e-2b01-4f1a-93ee-0c0297c24ec8',
        OrderNumber: null,
        OrgStructures: null,
        ShiftName: 'AR6 - AR6',
        ShopIDs: null,
        isSelect: true
    },
    {
        ChangeShift: 'CaKGH - Ca không giới hạn',
        ChangeShiftID: '2e0677da-3b43-4310-a4a9-fd8edd7428ff',
        Code: 'CaKGH',
        ID: '2e0677da-3b43-4310-a4a9-fd8edd7428ff',
        OrderNumber: null,
        OrgStructures: null,
        ShiftName: 'CaKGH - Ca không giới hạn',
        ShopIDs: null,
        isSelect: true
    }
];

export default class AttSubmitShiftSubstitutionAddOrEdit extends Component {
    constructor(props) {
        super(props);
        this.state = initSateDefault;

        this.setVariable();

        props.navigation.setParams({
            title:
                props.navigation.state.params && props.navigation.state.params.record
                    ? 'HRM_Attendance_ShiftSubstitution_Popup_Edit'
                    : 'HRM_Attendance_ShiftSubstitution_Popup_Create'
        });
    }

    setVariable = () => {
        //this.isRegisterHelp = null;
        this.levelApproveShiftSubstitution = null;
        this.isChangeLevelApprove = null;
        this.isChangeLevelApprove = [];
        this.dataLastApprove = [];
        //this.isRegisterOrgOvertime = false;
        //this.levelApproveRoster = 2;
        this.isModify = false;
        // this.configIsShowRoster2 = false;
        // this.listWarningRoster = [];
        // this.isSetFirst = true;
        this.IsContinueSave = false;
        this.ProfileRemoveIDs = null;
        this.IsRemoveAndContinue = null;
        this.CacheID = null;

        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;

        this.paramsExtend = {
            IsRosterNonContinue12Hour: null,
            IsRosterNightNonContinue2Weekly: null,
            IsMaxDayOFFInWeek: null,
            IsPregnancyWorkingNightShift: null,
            IsOverrideRosterQuestion: null
        };
    };

    refreshView = () => {
        this.props.navigation.setParams({ title: 'HRM_Attendance_ShiftSubstitution_Popup_Create' });
        this.setVariable();
        this.setState(initSateDefault, () => this.getConfigValid('Att_ShiftSubstitution', true));
    };

    //#region [lưu]
    save = (navigation, isCreate, isSend) => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        const {
                ID,
                //UserSubmitIDForEdit,
                ChangeShiftType,
                ProfileID1,
                ProfileID2,
                ChangeDate,
                AlternateDate,
                ChangeShiftID,
                AlternateShiftID,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4,
                ChangeShiftReason,
                modalErrorDetail,
                isConfigFromServer,
                parentChangeShiftID,
                parentAlternateShiftID,
                messageBeforeSave
            } = this.state,
            { apiConfig } = dataVnrStorage,
            { uriPor } = apiConfig;

        let ChangeShiftDetailID = [];
        let AlternateShiftDetailID = [];
        let param = {};

        // nhan.nguyen => task 0157453 (Điều chỉnh màn hình Đổi ca làm việc)
        if (isConfigFromServer) {
            if (ChangeShiftID.value && ChangeShiftID.value.length > 0) {
                ChangeShiftID.value.map(value => {
                    ChangeShiftDetailID.push(value.ID);
                });
            }
            if (AlternateShiftID.value && AlternateShiftID.value.length > 0) {
                AlternateShiftID.value.map(value => {
                    AlternateShiftDetailID.push(value.ID);
                });
            }
            param = {
                ChangeShiftID: parentChangeShiftID,
                AlternateShiftID: parentAlternateShiftID,
                ChangeShiftDetailID: ChangeShiftDetailID.length > 0 ? ChangeShiftDetailID.join(',') : null,
                AlternateShiftDetailID: AlternateShiftDetailID.length > 0 ? AlternateShiftDetailID.join(',') : null
            };
        } else {
            param = {
                AlternateShiftID: AlternateShiftID.value ? AlternateShiftID.value.ID : null,
                ChangeShiftID: ChangeShiftID.value ? ChangeShiftID.value.ID : null
            };
        }

        param = {
            ...param,
            ChangeShiftType: ChangeShiftType.value ? ChangeShiftType.value.Value : null,
            ProfileID1: ProfileID1.ID,
            ProfileID2: ProfileID2.value ? ProfileID2.value.ID : null,
            Status: 'E_SUBMIT',
            UserApproveID: UserApproveID.value ? UserApproveID.value.ID : null,
            UserApproveID3: UserApproveID3.value ? UserApproveID3.value.ID : null,
            UserApproveID4: UserApproveID4.value ? UserApproveID4.value.ID : null,
            UserApproveID2: UserApproveID2.value ? UserApproveID2.value.ID : null,
            ChangeShiftReason: ChangeShiftReason.value,
            AlternateDate: AlternateDate.value ? moment(AlternateDate.value).format('YYYY-MM-DD HH:mm:ss') : null,
            ChangeDate: ChangeDate.value ? moment(ChangeDate.value).format('YYYY-MM-DD HH:mm:ss') : null,
            IsPortal: true,
            // UserSubmit: ProfileID1.ID,
            // Host: isSend ? uriPor : uriMain,
            // UserRegister: dataVnrStorage.currentUser.info.userid,
            ProfileRemoveIDs: this.ProfileRemoveIDs,
            IsRemoveAndContinue: this.IsRemoveAndContinue,
            CacheID: this.CacheID,
            IsContinueSave: this.IsContinueSave,
            SendEmailStatus: isSend ? 'E_SUBMIT' : null,
            Host: isSend ? uriPor : null,
            IsAddNewAndSendMail: isSend
            // UserSubmitID: ProfileID1.ID
        };

        if (ID) {
            param = {
                ...param,
                ID
            };
        }

        if (messageBeforeSave.length > 0) {
            ToasterSevice.showWarning(messageBeforeSave);
            this.isProcessing = false;
        } else {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/api/Att_ShiftSubstitution', param).then(data => {
                VnrLoadingSevices.hide();
                this.isProcessing = false;
                if (data.ErrorRespone) {
                    if (data.ErrorRespone.IsBlock == true) {
                        if (data.ErrorRespone.IsShowRemoveAndContinue) {
                            //xử lý lại event Save
                            this.isProcessing = false;

                            AlertSevice.alert({
                                title: translate('Hrm_Notification'),
                                iconType: EnumIcon.E_WARNING,
                                message: translate('HRM_Attendance_Message_InvalidRequestDataPleaseCheckAgain'),
                                //lưu và tiếp tục
                                colorSecondConfirm: Colors.primary,
                                textSecondConfirm: translate('Button_OK'),
                                onSecondConfirm: () => {
                                    this.ProfileRemoveIDs = data.ErrorRespone.ProfileRemoveIDs;
                                    this.IsRemoveAndContinue = true;
                                    this.CacheID = data.ErrorRespone.CacheID;
                                    this.onSave(navigation, isCreate, isSend);
                                },
                                //đóng
                                onCancel: () => {},
                                //chi tiết lỗi
                                textRightButton: translate('Button_Detail'),
                                onConfirm: () => {
                                    this.setState(
                                        {
                                            modalErrorDetail: {
                                                ...modalErrorDetail,
                                                cacheID: data.ErrorRespone.CacheID,
                                                isModalVisible: true
                                            }
                                        },
                                        () => {
                                            this.getErrorMessageRespone();
                                            this.isProcessing = false;
                                        }
                                    );
                                }
                            });
                        } else {
                            //xử lý lại event Save
                            this.isProcessing = false;

                            AlertSevice.alert({
                                title: translate('Hrm_Notification'),
                                iconType: EnumIcon.E_WARNING,
                                message: translate('HRM_Attendance_Message_InvalidRequestDataPleaseCheckAgain'),
                                textRightButton: translate('Button_Detail'),
                                //đóng popup
                                onCancel: () => {},
                                //chi tiết lỗi
                                onConfirm: () => {
                                    this.setState(
                                        {
                                            modalErrorDetail: {
                                                ...modalErrorDetail,
                                                cacheID: data.ErrorRespone.CacheID,
                                                isModalVisible: true
                                            }
                                        },
                                        () => {
                                            this.getErrorMessageRespone();
                                            this.isProcessing = false;
                                        }
                                    );
                                }
                            });
                        }
                    } else {
                        this.isProcessing = false;

                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_WARNING,
                            message: translate('HRM_Attendance_Message_InvalidRequestDataDoYouWantToSave'),
                            //lưu và tiếp tục
                            colorSecondConfirm: Colors.primary,
                            textSecondConfirm: translate('Button_OK'),
                            onSecondConfirm: () => {
                                this.IsContinueSave = true;
                                this.ProfileRemoveIDs = data.ErrorRespone.ProfileRemoveIDs;
                                this.IsRemoveAndContinue = true;
                                this.CacheID = data.ErrorRespone.CacheID;
                                this.onSave(navigation, isCreate, isSend);
                            },
                            //đóng
                            onCancel: () => {},
                            //chi tiết lỗi
                            textRightButton: translate('Button_Detail'),
                            onConfirm: () => {
                                this.setState(
                                    {
                                        modalErrorDetail: {
                                            ...modalErrorDetail,
                                            cacheID: data.ErrorRespone.CacheID,
                                            isModalVisible: true
                                        }
                                    },
                                    () => {
                                        this.getErrorMessageRespone();
                                        this.isProcessing = false;
                                    }
                                );
                            }
                        });
                    }
                }
                if (data.ActionStatus == 'Success') {
                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);

                    if (isCreate) {
                        this.refreshView();
                    } else {
                        navigation.goBack();
                    }

                    const { reload } = navigation.state.params;
                    if (typeof reload == 'function') {
                        reload();
                    }
                } else if (data.ActionStatus == 'Locked') {
                    ToasterSevice.showWarning('DataIsLocked', 4000);
                } else if (data.IsReceiveOvertimeBonusOrg == true) {
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        icon: `${Platform.OS === 'ios' ? 'ios-' : 'md-'}checkmark-circle`,
                        iconColor: Colors.danger,
                        message: data.ActionStatus,
                        onCancel: () => {},
                        onConfirm: () => {
                            this.IsReceiveOvertimeBonusOrg = true;
                            this.onSave(navigation, isCreate, isSend);
                        }
                    });
                } else if (data.IsConfirmPreg == true && data.IsconfirmPregContinue == true) {
                    let _content = translate('Employee') + data.ActionStatus;
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        icon: `${Platform.OS === 'ios' ? 'ios-' : 'md-'}checkmark-circle`,
                        iconColor: Colors.danger,
                        message: _content,
                        onCancel: () => {},
                        onConfirm: () => {
                            this.IsConfirmPreg = true;
                            this.IsconfirmPregContinue = true;
                            this.onSave(navigation, isCreate, isSend);
                        }
                    });
                } else if (data.IsConfirmPreg == true && data.IsconfirmPregContinue == false) {
                    let _content = translate('Employee') + data.ActionStatus;
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        icon: `${Platform.OS === 'ios' ? 'ios-' : 'md-'}checkmark-circle`,
                        iconColor: Colors.danger,
                        message: _content,
                        onCancel: () => {},
                        onConfirm: () => {
                            this.IsConfirmPreg = true;
                            this.onSave(navigation, isCreate, isSend);
                        }
                    });
                } else if (data.ActionStatus == 'errorRegisterHoursPro') {
                    let nextState = {
                        modalLimit: {
                            isModalVisible: true,
                            data: [...data.OvertimeLimitPopupList]
                        }
                    };

                    this.setState(nextState);
                } else if (data.ActionStatus.indexOf('errorRegisterHoursByMonth') > -1) {
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        icon: `${Platform.OS === 'ios' ? 'ios-' : 'md-'}checkmark-circle`,
                        iconColor: Colors.danger,
                        message: data.ActionStatus.split('|')[1],
                        onCancel: () => {},
                        onConfirm: () => {
                            this.IsConfirmSaveContinue = true;
                            this.onSave(navigation, isCreate, isSend);
                        }
                    });
                } else if (data.ActionStatus.indexOf('errorRegisterHoursByYear') > -1) {
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        icon: `${Platform.OS === 'ios' ? 'ios-' : 'md-'}checkmark-circle`,
                        iconColor: Colors.danger,
                        message: data.ActionStatus.split('|')[1],
                        onCancel: () => {},
                        onConfirm: () => {
                            this.IsConfirmSaveContinue = true;
                            this.onSave(navigation, isCreate, isSend);
                        }
                    });
                } else if (data.ActionStatus.indexOf('errorRegisterHoursByDay') > -1) {
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        icon: `${Platform.OS === 'ios' ? 'ios-' : 'md-'}checkmark-circle`,
                        iconColor: Colors.danger,
                        message: data.ActionStatus.split('|')[1],
                        onCancel: () => {},
                        onConfirm: () => {
                            this.IsConfirmSaveContinue = true;
                            this.onSave(navigation, isCreate, isSend);
                        }
                    });
                } else if (data.ActionStatus.indexOf('errorRegisterHoursByWeek') > -1) {
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        icon: `${Platform.OS === 'ios' ? 'ios-' : 'md-'}checkmark-circle`,
                        iconColor: Colors.danger,
                        message: data.ActionStatus.split('|')[1],
                        onCancel: () => {},
                        onConfirm: () => {
                            this.IsConfirmSaveContinue = true;
                            this.onSave(navigation, isCreate, isSend);
                        }
                    });
                } else if (data.ActionStatus.indexOf('errorPregnancyPro') > -1) {
                    let mess = translate('Employee') + data.ActionStatus.split('|')[1];
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        icon: `${Platform.OS === 'ios' ? 'ios-' : 'md-'}checkmark-circle`,
                        iconColor: Colors.danger,
                        message: mess,
                        onCancel: () => {},
                        onConfirm: () => {}
                    });
                } else if (data.IsconfirmPregContinue == true && data.IsConfirmPreg == false) {
                    let _content = translate('Employee') + data.ActionStatus;
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        icon: `${Platform.OS === 'ios' ? 'ios-' : 'md-'}checkmark-circle`,
                        iconColor: Colors.danger,
                        message: _content,
                        onCancel: () => {},
                        onConfirm: () => {
                            this.IsconfirmPregContinue = true;
                            this.onSave(navigation, isCreate, isSend);
                        }
                    });
                } else if (typeof data.ActionStatus == 'string') {
                    ToasterSevice.showWarning(data.ActionStatus);
                }
            });
        }
    };

    saveAndCreate = navigation => {
        this.save(navigation, true, null);
    };

    saveAndSend = navigation => {
        this.save(navigation, null, true);
    };
    //#endregion

    //promise get config valid
    getConfigValid = (tblName, isRefresh) => {
        VnrLoadingSevices.show();
        HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName).then(res => {
            VnrLoadingSevices.hide();
            if (res) {
                try {
                    this.setState({ fieldValid: res }, () => {
                        enumName = EnumName;
                        profileInfo = dataVnrStorage
                            ? dataVnrStorage.currentUser
                                ? dataVnrStorage.currentUser.info
                                : null
                            : null;

                        let { record } = !isRefresh ? this.props.navigation.state.params : {};

                        //get config khi đăng ký
                        if (!record) {
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
        const { ChangeShiftID, AlternateShiftID } = this.state;

        HttpService.Post('[URI_HR]/Por_GetData/GetConfigByKey', {
            key: 'HRM_ATT_ROSTER_ISALLOWSREGISTRATIONMULTIPLESHIFTS'
        }).then(res => {
            this.setState({
                isConfigFromServer: res === 'True' ? true : false,
                ChangeShiftID: {
                    ...ChangeShiftID,
                    disable: res === 'True' ? false : true,
                    refresh: !ChangeShiftID.refresh
                },
                AlternateShiftID: {
                    ...AlternateShiftID,
                    disable: res === 'True' ? false : true,
                    refresh: !ChangeShiftID.refresh
                }
            });
        });
    };

    componentDidMount() {
        //get config validate
        this.getConfigValid('Att_ShiftSubstitution');
        this.getConfigMultiShift();
    }

    handleSetState = (item, res) => {
        const GetReadOnlyApproverControl = res[0],
            GetLevelApproveShiftSubstitution = res[1],
            dataShift = res[2],
            listUserByConfig = res[3], // xử lý task  0143719
            isConfigFromServer = res[4],
            {
                ChangeShiftType,
                ProfileID1,
                ProfileID2,
                ChangeDate,
                AlternateDate,
                ChangeShiftID,
                AlternateShiftID,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4,
                ChangeShiftReason
            } = this.state;

        this.levelApproveShiftSubstitution = GetLevelApproveShiftSubstitution;
        let nextState = {
            ID: item.ID,
            ChangeShiftType: {
                ...ChangeShiftType,
                value: item.ChangeShiftType
                    ? { Text: item.ChangeShiftSubstitutionTypeView, Value: item.ChangeShiftType }
                    : null,
                refresh: !ChangeShiftType.refresh
            },
            ProfileID1: {
                ...ProfileID1,
                ID: item.ProfileID1,
                ProfileName: item.ProfileNameRequest,
                refresh: !ProfileID1.refresh
            },
            ProfileID2: {
                ...ProfileID2,
                data: listUserByConfig != null && listUserByConfig.length > 0 ? listUserByConfig : null,
                disable: true,
                value: item.ProfileID2 ? { ID: item.ProfileID2, ProfileName: item.ProfileNameSubsPerson } : null,
                refresh: !ProfileID2.refresh
            },
            ChangeDate: {
                ...ChangeDate,
                value: item.ChangeDate ? moment(item.ChangeDate).format('YYYY-MM-DD HH:mm:ss') : null,
                refresh: !ChangeDate.refresh
            },
            AlternateDate: {
                ...AlternateDate,
                value: item.AlternateDate ? moment(item.AlternateDate).format('YYYY-MM-DD HH:mm:ss') : null,
                disable: item.ChangeShiftType == 'E_SAMEDAY' ? true : false,
                refresh: !AlternateDate.refresh
            },
            ChangeShiftID: {
                ...ChangeShiftID,
                value: item.ChangeShiftID ? { ID: item.ChangeShiftID, ShiftName: item.ChangeShiftName } : null,
                data: [...dataShift],
                refresh: !ChangeShiftID.refresh
            },
            AlternateShiftID: {
                ...AlternateShiftID,
                value: item.AlternateShiftID ? { ID: item.AlternateShiftID, ShiftName: item.AlternateShiftName } : null,
                data: [...dataShift],
                refresh: !AlternateShiftID.refresh
            },
            ChangeShiftReason: {
                ...ChangeShiftReason,
                value: item.ChangeShiftReason,
                refresh: !ChangeShiftReason.refresh
            },
            UserApproveID: {
                ...UserApproveID,
                value: item.UserApproveID ? { ID: item.UserApproveID, UserInfoName: item.FirstApproverName } : null,
                refresh: !UserApproveID.refresh
            },
            UserApproveID2: {
                ...UserApproveID2,
                value: item.UserApproveID2 ? { ID: item.UserApproveID2, UserInfoName: item.MidApproverName } : null,
                refresh: !UserApproveID2.refresh
            },
            UserApproveID3: {
                ...UserApproveID3,
                value: item.UserApproveID3 ? { ID: item.UserApproveID3, UserInfoName: item.NextApproverName } : null,
                refresh: !UserApproveID3.refresh
            },
            UserApproveID4: {
                ...UserApproveID4,
                value: item.UserApproveID4 ? { ID: item.UserApproveID4, UserInfoName: item.LastApproverName } : null,
                refresh: !UserApproveID4.refresh
            }
        };

        // nhan.nguyen => task 0157453 (Điều chỉnh màn hình Đổi ca làm việc)
        let temp = isConfigFromServer === 'True' ? true : false;
        if (temp) {
            const dataChangeDate = res[5],
                dataAlternateDate = res[6];
            let valueChangeDate = [],
                valueAlternateDate = [];

            if (
                item.ChangeShiftDetailID &&
                item.AlternateShiftDetailID &&
                dataChangeDate.lstShiftMulti.length > 0 &&
                dataAlternateDate.lstShiftMulti.length > 0
            ) {
                item.ChangeShiftDetailID.split(',').find(item => {
                    dataChangeDate.lstShiftMulti.find(it => {
                        if (item === it.ID) {
                            valueChangeDate.push({ ...it, isSelect: true });
                        }
                    });
                });

                item.AlternateShiftDetailID.split(',').find(item => {
                    dataAlternateDate.lstShiftMulti.find(it => {
                        if (item === it.ID) {
                            valueAlternateDate.push({ ...it, isSelect: true });
                        }
                    });
                });
            }

            nextState = {
                ...nextState,
                ChangeShiftID: {
                    ...ChangeShiftID,
                    value: valueChangeDate.length > 0 ? valueChangeDate : null,
                    data: dataChangeDate.lstShiftMulti.length > 0 ? dataChangeDate.lstShiftMulti : null,
                    refresh: !ChangeShiftID.refresh
                },
                AlternateShiftID: {
                    ...AlternateShiftID,
                    value: valueAlternateDate.length > 0 ? valueAlternateDate : null,
                    data: dataAlternateDate.lstShiftMulti.length > 0 ? dataAlternateDate.lstShiftMulti : null,
                    refresh: !AlternateShiftID.refresh
                },
                parentChangeShiftID: item.ChangeShiftID,
                parentAlternateShiftID: item.AlternateShiftID
            };
        }

        if (!GetReadOnlyApproverControl) {
            nextState = {
                ...nextState,
                UserApproveID: {
                    ...nextState.UserApproveID,
                    disable: true
                },
                UserApproveID2: {
                    ...nextState.UserApproveID2,
                    disable: true
                },
                UserApproveID3: {
                    ...nextState.UserApproveID3,
                    disable: true
                },
                UserApproveID4: {
                    ...nextState.UserApproveID4,
                    disable: true
                }
            };
        }

        if (this.levelApproveShiftSubstitution == 4) {
            // $('#divMidApprove').removeClass('hide');
            // $('#divMidNextApprove').removeClass('hide');
            nextState = {
                ...nextState,
                UserApproveID2: {
                    ...nextState.UserApproveID2,
                    visible: true
                },
                UserApproveID3: {
                    ...nextState.UserApproveID3,
                    visible: true
                }
            };
        } else if (this.levelApproveShiftSubstitution == 3) {
            // $('#divMidApprove').removeClass('hide');
            // $('#divMidNextApprove').addClass('hide');
            nextState = {
                ...nextState,
                UserApproveID2: {
                    ...nextState.UserApproveID2,
                    visible: true
                },
                UserApproveID3: {
                    ...nextState.UserApproveID3,
                    visible: false
                }
            };
        } else {
            //$('#divMidApprove').addClass('hide');
            nextState = {
                ...nextState,
                UserApproveID2: {
                    ...nextState.UserApproveID2,
                    visible: false
                },
                UserApproveID3: {
                    ...nextState.UserApproveID3,
                    visible: false
                }
            };
        }

        this.setState({ ...nextState, isConfigFromServer: temp }, () => {
            this.GetHighSupervior();
        });
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        const { ProfileID1, ChangeDate, AlternateDate, ChangeShiftType, ProfileID2 } = record;

        VnrLoadingSevices.show();
        HttpService.MultiRequest([
            HttpService.Post('[URI_HR]/Att_GetData/GetReadOnlyApproverControl', { profileID: ProfileID1 }),
            HttpService.Post('[URI_HR]/Att_GetData/GetLevelApproveShiftSubstitution', { profileID: ProfileID1 }),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiShift'),
            HttpService.Post('[URI_HR]/Att_GetData/SetDataSourceForControlSubstitute', { profileID1: ProfileID1 }),
            HttpService.Post('[URI_HR]/Por_GetData/GetConfigByKey', {
                key: 'HRM_ATT_ROSTER_ISALLOWSREGISTRATIONMULTIPLESHIFTS'
            }),
            HttpService.Post('[URI_HR]/Att_GetData/GetShiftByChangeDate', {
                profileID: ProfileID1,
                changeDate: moment(ChangeDate).format('YYYY-MM-DD HH:mm:ss'),
                alternateDate: moment(AlternateDate).format('YYYY-MM-DD HH:mm:ss'),
                changeShiftType: ChangeShiftType,
                isMultiShift: true
            }),
            HttpService.Post('[URI_HR]/Att_GetData/GetShiftByAlternateDate', {
                profileID: ProfileID2,
                alternateDate: moment(AlternateDate).format('YYYY-MM-DD HH:mm:ss'),
                changeDate: moment(ChangeDate).format('YYYY-MM-DD HH:mm:ss'),
                changeShiftType: ChangeShiftType,
                isMultiShift: true,
                isChangeShift: true,
                lstChangeShiftID: null
            })
        ]).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res && res.length == 7) {
                    _handleSetState(record, res);
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
            this.getRecordAndConfigByID(record, this.handleSetState);
        } else {
            const { E_ProfileID, E_FullName } = enumName,
                { ProfileID1, ChangeShiftType, ChangeDate, AlternateDate } = this.state;

            let changeShiftTypeValue = {
                Text: translate('ChangeShiftSubstitutionType__E_SAMEDAY'),
                Value: 'E_SAMEDAY'
            };

            this.setState(
                {
                    ProfileID1: {
                        ...ProfileID1,
                        ID: profileInfo[E_ProfileID],
                        ProfileName: profileInfo[E_FullName]
                    },
                    ChangeShiftType: {
                        ...ChangeShiftType,
                        value: changeShiftTypeValue,
                        refresh: !ChangeShiftType.refresh
                    },
                    ChangeDate: {
                        ...ChangeDate,
                        disable: true,
                        refresh: !ChangeDate.refresh
                    },
                    AlternateDate: {
                        ...AlternateDate,
                        disable: true,
                        refresh: !AlternateDate.refresh
                    }
                },
                () => {
                    this.GetHighSupervior();

                    // xử lý task  0143719
                    this.setDataSubstituteByConfig();
                }
            );

            this.GetMultiShift();
        }
    };

    setDataSubstituteByConfig = () => {
        const { ProfileID1, ProfileID2 } = this.state;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/SetDataSourceForControlSubstitute', { profileID1: ProfileID1.ID }).then(
            res => {
                if (res != null && res.length > 0) {
                    this.setState({
                        ProfileID2: {
                            ...ProfileID2,
                            disable: false,
                            data: [...res],
                            refresh: !ProfileID2.refresh
                        }
                    });
                } else {
                    this.setState({
                        ProfileID2: {
                            ...ProfileID2,
                            disable: false,
                            refresh: !ProfileID2.refresh
                        }
                    });
                }
                VnrLoadingSevices.hide();
            }
        );
    };

    GetMultiShift = () => {
        const { AlternateShiftID, ChangeShiftID, isConfigFromServer } = this.state;

        if (!isConfigFromServer) {
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiShift').then(res => {
                if (res) {
                    this.setState({
                        AlternateShiftID: {
                            ...AlternateShiftID,
                            data: [...res],
                            refresh: !AlternateShiftID.refresh
                        },
                        ChangeShiftID: {
                            ...ChangeShiftID,
                            data: [...res],
                            refresh: !ChangeShiftID.refresh
                        }
                    });
                }
            });
        }
    };

    GetHighSupervior = () => {
        const { ProfileID1 } = this.state,
            { ID } = ProfileID1;

        HttpService.Post('[URI_HR]/Att_GetData/GetHighSupervisor', {
            ProfileID: ID,
            userSubmit: ID,
            type: 'E_SHIFTSUBSTITUTION'
        }).then(result => {
            try {
                const {
                    UserApproveID,
                    UserApproveID2,
                    UserApproveID3,
                    UserApproveID4
                } = this.state;

                let nextState = {
                    UserApproveID: { ...UserApproveID },
                    UserApproveID2: { ...UserApproveID2 },
                    UserApproveID3: { ...UserApproveID3 },
                    UserApproveID4: { ...UserApproveID4 }
                };

                // if (result.MidSupervisorID)
                //     isSet = false;

                // var multiUserApproveID = $(frm + ' #' + control1).data('kendoComboBox'),
                //     multiUserApproveID2 = $(frm + ' #' + control2).data('kendoComboBox'),
                //     multiUserApproveID3 = $(frm + ' #' + control3).data('kendoComboBox'),
                //     multiUserApproveID4 = $(frm + ' #' + control4).data('kendoComboBox');

                //truong hop chạy theo approve grade
                if (result.LevelApprove > 0) {
                    if (result.IsChangeApprove != true) {
                        // multiUserApproveID.enable(false);
                        // multiUserApproveID2.enable(false);
                        // multiUserApproveID3.enable(false);
                        // multiUserApproveID4.enable(false);
                        nextState = {
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                disable: true
                            },
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                disable: true
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                disable: true
                            },
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                disable: true
                            }
                        };
                    } else {
                        // multiUserApproveID.enable(true);
                        // multiUserApproveID2.enable(true);
                        // multiUserApproveID3.enable(true);
                        // multiUserApproveID4.enable(true);
                        nextState = {
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                disable: false
                            },
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                disable: false
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                disable: false
                            },
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                disable: false
                            }
                        };
                    }

                    this.levelApproveShiftSubstitution = result.LevelApprove;

                    if (result.LevelApprove == 2) {
                        if (result.IsOnlyOneLevelApprove) {
                            this.levelApproveShiftSubstitution = 1;
                            if (result.SupervisorID != null) {
                                nextState = {
                                    UserApproveID: {
                                        ...nextState.UserApproveID,
                                        value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                    },
                                    UserApproveID2: {
                                        ...nextState.UserApproveID2,
                                        value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                    },
                                    UserApproveID3: {
                                        ...nextState.UserApproveID3,
                                        value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                    },
                                    UserApproveID4: {
                                        ...nextState.UserApproveID4,
                                        value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                    }
                                };
                            }
                        } else {
                            if (result.SupervisorID != null) {
                                //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                                nextState = {
                                    ...nextState,
                                    UserApproveID: {
                                        ...nextState.UserApproveID,
                                        value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                    }
                                };
                            } else if (!this.isModify) {
                                //multiUserApproveID.value(null);
                                nextState = {
                                    ...nextState,
                                    UserApproveID: {
                                        ...nextState.UserApproveID,
                                        value: null
                                    }
                                };
                            }

                            if (result.MidSupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApproveID2: {
                                        ...nextState.UserApproveID2,
                                        value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                    },
                                    UserApproveID3: {
                                        ...nextState.UserApproveID3,
                                        value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                    },
                                    UserApproveID4: {
                                        ...nextState.UserApproveID4,
                                        value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                    }
                                };
                            } else if (!this.isModify) {
                                // multiUserApproveID3.value(null);
                                // multiUserApproveID2.value(null);
                                // multiUserApproveID4.value(null);
                                nextState = {
                                    ...nextState,
                                    UserApproveID2: {
                                        ...nextState.UserApproveID2,
                                        value: null
                                    },
                                    UserApproveID3: {
                                        ...nextState.UserApproveID3,
                                        value: null
                                    },
                                    UserApproveID4: {
                                        ...nextState.UserApproveID4,
                                        value: null
                                    }
                                };
                            }
                        }

                        // isShowEle('#' + divControl3);
                        // isShowEle('#' + divControl4);
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                visible: false
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                visible: false
                            }
                        };
                    } else if (result.LevelApprove == 3) {
                        if (result.SupervisorID != null) {
                            nextState = {
                                ...nextState,
                                UserApproveID: {
                                    ...nextState.UserApproveID,
                                    value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                }
                            };
                            //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                        } else if (!this.isModify) {
                            //multiUserApproveID.value(null);
                            nextState = {
                                ...nextState,
                                UserApproveID: {
                                    ...nextState.UserApproveID,
                                    value: null
                                }
                            };
                        }

                        if (result.MidSupervisorID != null) {
                            nextState = {
                                ...nextState,
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                }
                            };
                            //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                        } else if (!this.isModify) {
                            //multiUserApproveID3.value(null);
                            nextState = {
                                ...nextState,
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    value: null
                                }
                            };
                        }

                        if (result.NextMidSupervisorID != null) {
                            nextState = {
                                ...nextState,
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    value: {
                                        UserInfoName: result.NextMidSupervisorName,
                                        ID: result.NextMidSupervisorID
                                    }
                                },
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    value: {
                                        UserInfoName: result.NextMidSupervisorName,
                                        ID: result.NextMidSupervisorID
                                    }
                                }
                            };
                            //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID);
                            //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID);
                        } else if (!this.isModify) {
                            // multiUserApproveID2.value(null);
                            // multiUserApproveID4.value(null);
                            nextState = {
                                ...nextState,
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    value: null
                                },
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    value: null
                                }
                            };
                        }

                        // isShowEle('#' + divControl3, true);
                        // isShowEle('#' + divControl4);

                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                visible: true
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                visible: false
                            }
                        };
                    } else if (result.LevelApprove == 4) {
                        if (result.SupervisorID != null) {
                            nextState = {
                                ...nextState,
                                UserApproveID: {
                                    ...nextState.UserApproveID,
                                    value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                }
                            };
                            //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                        } else if (!this.isModify) {
                            //multiUserApproveID.value(null);
                            nextState = {
                                ...nextState,
                                UserApproveID: {
                                    ...nextState.UserApproveID,
                                    value: null
                                }
                            };
                        }

                        if (result.MidSupervisorID != null) {
                            nextState = {
                                ...nextState,
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                }
                            };
                            //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                        } else if (!this.isModify) {
                            //multiUserApproveID3.value(null);
                            nextState = {
                                ...nextState,
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    value: null
                                }
                            };
                        }

                        if (result.NextMidSupervisorID != null) {
                            nextState = {
                                ...nextState,
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    value: {
                                        UserInfoName: result.NextMidSupervisorName,
                                        ID: result.NextMidSupervisorID
                                    }
                                }
                            };
                            //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID);
                        } else if (!this.isModify) {
                            //multiUserApproveID4.value(null);
                            nextState = {
                                ...nextState,
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    value: null
                                }
                            };
                        }

                        if (result.HighSupervisorID) {
                            nextState = {
                                ...nextState,
                                UserApproveID4: {
                                    ...nextState.UserApproveID4,
                                    value: {
                                        UserInfoName: result.HighSupervisorName,
                                        ID: result.HighSupervisorID
                                    }
                                }
                            };
                            //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
                        } else if (!this.isModify) {
                            nextState = {
                                ...nextState,
                                UserApproveID4: {
                                    ...nextState.UserApproveID4,
                                    value: null
                                }
                            };
                            //multiUserApproveID2.value(null);
                        }

                        // isShowEle('#' + divControl3, true);
                        // isShowEle('#' + divControl4, true);
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                visible: true
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                visible: true
                            }
                        };
                    }
                    if (result.IsChangeApprove != true) {
                        // isReadOnlyComboBox($("#" + control1), true);
                        // isReadOnlyComboBox($("#" + control2), true);
                        // isReadOnlyComboBox($("#" + control3), true);
                        // isReadOnlyComboBox($("#" + control4), true);
                        nextState = {
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                disable: true
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                disable: true
                            },
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                disable: true
                            },
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                disable: true
                            }
                        };
                    } else {
                        // isReadOnlyComboBox($("#" + control1), false);
                        // isReadOnlyComboBox($("#" + control2), false);
                        // isReadOnlyComboBox($("#" + control3), false);
                        // isReadOnlyComboBox($("#" + control4), false);
                        nextState = {
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                disable: false
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                disable: false
                            },
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                disable: false
                            },
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                disable: false
                            }
                        };
                    }

                    //this.setupDisplayApprover(result.LevelApprove)
                }

                //TH chạy không theo approve grade
                // else if (result.LevelApprove == 0) {
                //     if (result.IsConCurrent) {
                //         var dataFirstApprove = [];
                //         for (var i = 0; i < result.lstSupervior.length; i++) {
                //             dataFirstApprove.push({ UserInfoName: result.lstSupervior[i].SupervisorName, ID: result.lstSupervior[i].SupervisorID });
                //         }
                //         for (var i = 0; i < result.lstHightSupervior.length; i++) {
                //             dataMidApprove.push({ UserInfoName: result.lstHightSupervior[i].HighSupervisorName, ID: result.lstHightSupervior[i].HighSupervisorID });
                //             dataLastApprove.push({ UserInfoName: result.lstHightSupervior[i].HighSupervisorName, ID: result.lstHightSupervior[i].HighSupervisorID });
                //         }
                //         multiUserApproveID.setDataSource(dataFirstApprove);
                //         multiUserApproveID.refresh();
                //         multiUserApproveID2.setDataSource(dataLastApprove);
                //         multiUserApproveID2.refresh();
                //         multiUserApproveID3.setDataSource(dataMidApprove);
                //         multiUserApproveID3.refresh();
                //     }
                //     else {
                //         if (result.SupervisorID != null) {
                //             checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                //         }
                //         else {
                //             multiUserApproveID.refresh();
                //             multiUserApproveID.value(null);
                //         }
                //         if (result.HighSupervisorID != null) {
                //             dataLastApprove.push({ UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID });
                //             checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
                //         }
                //         else {
                //             multiUserApproveID2.refresh();
                //             multiUserApproveID2.value(null);
                //         }
                //         if (result.MidSupervisorID != null) {
                //             dataMidApprove.push({ UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID });
                //             checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                //             checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                //             checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                //         }
                //         else {
                //             multiUserApproveID2.refresh();
                //             multiUserApproveID2.value(null);
                //             multiUserApproveID3.refresh();
                //             multiUserApproveID3.value(null);
                //             multiUserApproveID4.refresh();
                //             multiUserApproveID4.value(null);
                //         }
                //         if (result.IsChangeApprove != true) {
                //             isReadOnlyComboBox($("#" + control1), true);
                //             isReadOnlyComboBox($("#" + control2), true);
                //             isReadOnlyComboBox($("#" + control3), true);
                //             isReadOnlyComboBox($("#" + control4), true);
                //         }
                //         else {
                //             isReadOnlyComboBox($("#" + control1), false);
                //             isReadOnlyComboBox($("#" + control2), false);
                //             isReadOnlyComboBox($("#" + control3), false);
                //             isReadOnlyComboBox($("#" + control4), false);
                //         }
                //     }
                // }

                nextState = {
                    UserApproveID: {
                        ...nextState.UserApproveID,
                        refresh: !UserApproveID.refresh
                    },
                    UserApproveID2: {
                        ...nextState.UserApproveID2,
                        refresh: !UserApproveID2.refresh
                    },
                    UserApproveID3: {
                        ...nextState.UserApproveID3,
                        refresh: !UserApproveID3.refresh
                    },
                    UserApproveID4: {
                        ...nextState.UserApproveID4,
                        refresh: !UserApproveID4.refresh
                    }
                };

                this.setState(nextState);
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    onChangeUserApprove = item => {
        const { UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4 } = this.state;

        let nextState = {
            UserApproveID: {
                ...UserApproveID,
                value: item,
                refresh: !UserApproveID.refresh
            }
        };

        //nếu 1 cấp duyệt mới chạy
        if (this.levelApproveShiftSubstitution == 1) {
            let user1 = { ...item };
            if (!user1) {
                nextState = {
                    ...nextState,
                    UserApproveID2: {
                        ...UserApproveID2,
                        value: null,
                        visible: false,
                        refresh: !UserApproveID2.refresh
                    },
                    UserApproveID3: {
                        ...UserApproveID3,
                        value: null,
                        visible: false,
                        refresh: !UserApproveID3.refresh
                    },
                    UserApproveID4: { ...UserApproveID4, value: null, refresh: !UserApproveID4.refresh }
                };
            } else {
                nextState = {
                    ...nextState,
                    UserApproveID2: {
                        ...UserApproveID2,
                        value: { ...item },
                        visible: false,
                        refresh: !UserApproveID2.refresh
                    },
                    UserApproveID3: {
                        ...UserApproveID3,
                        value: { ...item },
                        visible: false,
                        refresh: !UserApproveID3.refresh
                    },
                    UserApproveID4: { ...UserApproveID4, value: { ...item }, refresh: !UserApproveID4.refresh }
                };
            }
        }

        this.setState(nextState);
    };

    onChangeUserApprove2 = item => {
        const { UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4 } = this.state;

        let nextState = {
            UserApproveID4: {
                ...UserApproveID4,
                value: item,
                refresh: !UserApproveID4.refresh
            }
        };

        //nếu 1 cấp duyệt mới chạy
        if (this.levelApproveShiftSubstitution == 1) {
            let user2 = { ...item };
            if (!user2) {
                nextState = {
                    ...nextState,
                    UserApproveID: { ...UserApproveID, value: null, refresh: !UserApproveID.refresh },
                    UserApproveID3: {
                        ...UserApproveID3,
                        visible: false,
                        value: null,
                        refresh: !UserApproveID3.refresh
                    },
                    UserApproveID2: { ...UserApproveID2, visible: false, value: null, refresh: !UserApproveID2.refresh }
                };
            } else {
                nextState = {
                    ...nextState,
                    UserApproveID: { ...UserApproveID, value: { ...item }, refresh: !UserApproveID.refresh },
                    UserApproveID3: {
                        ...UserApproveID3,
                        visible: false,
                        value: { ...item },
                        refresh: !UserApproveID3.refresh
                    },
                    UserApproveID2: {
                        ...UserApproveID2,
                        visible: false,
                        value: { ...item },
                        refresh: !UserApproveID2.refresh
                    }
                };
            }
        } else if (this.levelApproveShiftSubstitution == 2) {
            let user2 = { ...item };
            if (!user2) {
                nextState = {
                    ...nextState,
                    UserApproveID3: { ...UserApproveID3, value: null, refresh: !UserApproveID3.refresh },
                    UserApproveID2: { ...UserApproveID2, value: null, refresh: !UserApproveID2.refresh }
                };
            } else {
                nextState = {
                    ...nextState,
                    UserApproveID3: { ...UserApproveID3, value: { ...item }, refresh: !UserApproveID3.refresh },
                    UserApproveID2: { ...UserApproveID2, value: { ...item }, refresh: !UserApproveID2.refresh }
                };
            }
        } else if (this.levelApproveShiftSubstitution == 3) {
            let user2 = { ...item };

            if (!user2) {
                nextState = {
                    ...nextState,
                    UserApproveID3: { ...UserApproveID3, value: null, refresh: !UserApproveID3.refresh }
                };
            } else {
                nextState = {
                    ...nextState,
                    UserApproveID3: { ...UserApproveID3, value: { ...item }, refresh: !UserApproveID3.refresh }
                };
            }
        }

        this.setState(nextState);
    };

    getDailyShiftAlternateDate = () => {
        const {
            ProfileID2,
            AlternateShiftID,
            AlternateDate,
            ChangeDate,
            ChangeShiftType,
            ChangeShiftID,
            isConfigFromServer
        } = this.state;

        if (ProfileID2.value && ProfileID2.value.ID && AlternateDate.value && ChangeDate.value) {
            let _changeShiftType = ChangeShiftType.value ? ChangeShiftType.value.Value : null;
            HttpService.Post('[URI_HR]/Att_GetData/GetShiftByAlternateDate', {
                profileID: ProfileID2.value.ID,
                alternateDate: moment(AlternateDate.value).format('YYYY-MM-DD HH:mm:ss'),
                changeDate: moment(ChangeDate.value).format('YYYY-MM-DD HH:mm:ss'),
                changeShiftType: _changeShiftType,
                isMultiShift: true,
                isChangeShift: true
            }).then(result => {
                if (result) {
                    if (result.error) {
                        this.setState({
                            ChangeShiftID: {
                                ...ChangeShiftID,
                                value: null,
                                refresh: !ChangeShiftID.refresh
                            },
                            AlternateShiftID: {
                                ...AlternateShiftID,
                                value: null,
                                refresh: !AlternateShiftID.refresh
                            },
                            disableBtnSave: true
                        });

                        ToasterSevice.showWarning('WarningDoNotMeetTheConditionsOFF');
                    } else if (result.shiftRoot && result.shiftRoot.ShiftNameView) {
                        //  check điều kiện ở trên với shiftRoot không còn shiftAlternateDate nữa!

                        if (isConfigFromServer) {
                            //kiểm tra xem lstShiftMulti(API trả về) có phải là 1 mảng hay không, có lớn hơn 0
                            if (Array.isArray(result.lstShiftMulti) && result.lstShiftMulti.length > 0) {

                                this.setState(
                                    {
                                        AlternateShiftID: {
                                            ...AlternateShiftID,
                                            value: result.lstShiftMulti,
                                            data: result.lstShiftMulti,
                                            disable:
                                                result.lstShiftMulti.length > 1 && _changeShiftType !== 'E_DIFFERENTDAY'
                                                    ? false
                                                    : true,
                                            refresh: !AlternateShiftID.refresh
                                        },
                                        disableBtnSave: false,
                                        parentAlternateShiftID: result.shiftRoot.ID,
                                        lstAlternateNotSelected: null
                                    },
                                    () => {
                                        this.onCompareShiftChangeAndShiftAlternate();
                                        if (_changeShiftType == 'E_DIFFERENTDAY') {
                                            this.getDailyShiftChangeDate();
                                        }
                                    }
                                );
                            } else {
                                // khi lstShiftMulti không phải là 1 mảng hoặc mảng đó = 0
                                // có thông báo là không có làm việc hay không!
                            }
                        } else {
                            let alternateShift = {
                                ShiftName: result.shiftRoot['ShiftNameView'],
                                ID: result.shiftRoot['ID']
                            };

                            this.setState(
                                {
                                    AlternateShiftID: {
                                        ...AlternateShiftID,
                                        value: alternateShift,
                                        data: [alternateShift],
                                        refresh: !AlternateShiftID.refresh
                                    },
                                    disableBtnSave: false
                                },
                                () => {
                                    if (_changeShiftType == 'E_DIFFERENTDAY') {
                                        this.getDailyShiftChangeDate();
                                    }
                                }
                            );
                        }
                    }
                } else {
                    this.setState({
                        AlternateShiftID: {
                            ...AlternateShiftID,
                            data: [],
                            value: null,
                            refresh: !AlternateShiftID.refresh
                        }
                    });
                }
            });
        } else {
            this.setState({
                AlternateShiftID: {
                    ...AlternateShiftID,
                    data: [],
                    value: null,
                    refresh: !AlternateShiftID.refresh
                }
            });
        }
    };

    getDailyShiftChangeDate = () => {
        const {
            ProfileID1,
            ChangeDate,
            ChangeShiftType,
            ChangeShiftID,
            AlternateDate,
            AlternateShiftID,
            isConfigFromServer
        } = this.state;

        if (ChangeDate.value && AlternateDate.value) {
            let _changeShiftType = ChangeShiftType.value ? ChangeShiftType.value.Value : null;

            HttpService.Post('[URI_HR]/Att_GetData/GetShiftByChangeDate', {
                profileID: ProfileID1.ID,
                changeDate: moment(ChangeDate.value).format('YYYY-MM-DD HH:mm:ss'),
                alternateDate: moment(AlternateDate.value).format('YYYY-MM-DD HH:mm:ss'),
                changeShiftType: _changeShiftType,
                isMultiShift: true
            }).then(result => {
                if (result) {
                    if (result.error) {
                        this.setState({
                            ChangeShiftID: {
                                ...ChangeShiftID,
                                value: null,
                                refresh: !ChangeShiftID.refresh
                            },
                            AlternateShiftID: {
                                ...AlternateShiftID,
                                value: null,
                                refresh: !AlternateShiftID
                            },
                            disableBtnSave: true
                        });

                        ToasterSevice.showWarning('WarningDoNotMeetTheConditionsOFF');
                    } else if (result.shiftRoot && result.shiftRoot.ShiftNameView) {
                        //  check điều kiện ở trên với shiftRoot không còn shiftChangeDate nữa!
                        if (isConfigFromServer) {
                            //kiểm tra xem lstShiftMulti(API trả về) có phải là 1 mảng hay không, có lớn hơn 0
                            if (Array.isArray(result.lstShiftMulti) && result.lstShiftMulti.length > 0) {

                                this.setState({
                                    ChangeShiftID: {
                                        ...ChangeShiftID,
                                        data: result.lstShiftMulti,
                                        value: result.lstShiftMulti,
                                        disable:
                                            result.lstShiftMulti.length > 1 && _changeShiftType !== 'E_DIFFERENTDAY'
                                                ? false
                                                : true,
                                        refresh: !ChangeShiftID.refresh
                                    },
                                    disableBtnSave: false,
                                    parentChangeShiftID: result.shiftRoot.ID
                                });
                            } else {
                                // khi lstShiftMulti không phải là 1 mảng hoặc mảng đó = 0
                                // có thông báo là không có làm việc hay không!
                            }
                        } else {
                            // shiftChangeDate => shiftRoot (shiftChangeDate đổi thành shiftRoot)
                            let changeShift = {
                                ShiftName: result.shiftRoot['ShiftNameView'],
                                ID: result.shiftRoot['ID']
                            };

                            this.setState(
                                {
                                    ChangeShiftID: {
                                        ...ChangeShiftID,
                                        value: changeShift,
                                        data: [changeShift],
                                        refresh: !ChangeShiftID.refresh
                                    },
                                    disableBtnSave: false
                                },
                                () => {
                                    const { ChangeShiftID, AlternateShiftID, ChangeShiftType } = this.state;
                                    let _alternateShiftID = AlternateShiftID.value ? AlternateShiftID.value.ID : null,
                                        _changeShiftType = ChangeShiftType.value ? ChangeShiftType.value.Value : null;

                                    if (_changeShiftType == 'E_DIFFERENTDAY' && changeShift.ID && !_alternateShiftID) {
                                        this.setState({
                                            ChangeShiftID: {
                                                ...ChangeShiftID,
                                                value: null,
                                                refresh: !ChangeShiftID.refresh
                                            },
                                            disableBtnSave: true
                                        });

                                        ToasterSevice.showWarning('WarningDoNotMeetTheConditionsOFF');
                                    }
                                }
                            );
                        }
                    }
                }
            });
        } else {
            this.setState({
                ChangeShiftID: {
                    ...ChangeShiftID,
                    data: [],
                    value: null,
                    refresh: !ChangeShiftID.refresh
                }
            });
        }
    };

    ChangeAlternateDate = () => {
        const { ChangeDate, AlternateDate, ChangeShiftType, ProfileID2 } = this.state;

        if (ChangeDate.value && ChangeShiftType.value) {
            if (ChangeShiftType.value.Value == 'E_SAMEDAY') {
                this.validateData(ProfileID2.value ? ProfileID2.value.ID : null, false);
            }
        } else {
            this.setState({
                AlternateDate: {
                    ...AlternateDate,
                    value: null,
                    disable: true,
                    refresh: !AlternateDate.refresh
                }
            });
        }
    };

    //#region [xử lý group theo Message để thông báo lỗi]
    groupByMessage = (array, key) => {
        // Return the end result
        return array.reduce((result, currentValue) => {
            // If an array already present for key, push it to the array. Else create an array and push the object
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
            return result;
        }, {}); // empty object is the initial value for result object
    };

    mappingDataGroup = dataGroup => {
        let dataSource = [];
        let key = '';
        for (key in dataGroup) {
            let title =
                translate('HRM_Attendance_Message_MessageName') +
                ': ' +
                key +
                ' (' +
                translate('NumberCount') +
                ': ' +
                dataGroup[key].length +
                ')';

            dataSource = [...dataSource, { Type: 'E_GROUP', TitleGroup: title }, ...dataGroup[key]];
        }

        return dataSource;
    };

    renderErrorDetail = () => {
        const { modalErrorDetail } = this.state,
            { data } = modalErrorDetail,
            { styleViewTitleGroup } = styleViewTitleForGroup,
            RenderItemAction = styles;

        if (data) {
            const dataGroup = this.groupByMessage(data, 'MessageName'),
                dataSourceError = this.mappingDataGroup(dataGroup);

            return dataSourceError.map((dataItem, index) => {
                let viewContent = <View />;
                if (dataItem['Type'] && dataItem['Type'] == 'E_GROUP') {
                    viewContent = (
                        <View
                            style={[
                                styleViewTitleGroup,
                                {
                                    ...CustomStyleSheet.marginHorizontal(0),
                                    ...CustomStyleSheet.paddingBottom(5),
                                    ...CustomStyleSheet.marginBottom(10)
                                }
                            ]}
                        >
                            <VnrText
                                style={[styleSheets.text, {
                                    ...CustomStyleSheet.fontWeight('500'),
                                    ...CustomStyleSheet.color(Colors.primary)
                                }]}
                                i18nKey={dataItem['TitleGroup']}
                            />
                        </View>
                    );
                } else {
                    viewContent = (
                        <View style={RenderItemAction.viewInfo}>
                            <View style={RenderItemAction.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                    i18nKey={'HRM_HR_Profile_CodeEmp'}
                                />
                                <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text numberOfLines={1} style={[styleSheets.textItalic, RenderItemAction.fontText]}>
                                        {dataItem['CodeEmp']}
                                    </Text>
                                </View>
                            </View>

                            <View style={RenderItemAction.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                    i18nKey={'HRM_HR_Profile_ProfileName'}
                                />
                                <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text numberOfLines={1} style={[styleSheets.textItalic, RenderItemAction.fontText]}>
                                        {dataItem['ProfileName']}
                                    </Text>
                                </View>
                            </View>

                            <View style={RenderItemAction.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                    i18nKey={'HRM_Attendance_ErrorMessageRespone_ErrorDescription'}
                                />
                                <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>
                                        {dataItem['ErrorDescription']}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    );
                }

                return <View key={index} style={styles.styleViewBorderButtom}>{viewContent}</View>;
            });
        } else {
            return <View />;
        }
    };

    getErrorMessageRespone() {
        const { modalErrorDetail } = this.state,
            { cacheID } = modalErrorDetail;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetErrorMessageRespone', { cacheID: cacheID }).then(res => {
            VnrLoadingSevices.hide();
            if (res && res.Data) {
                this.setState({
                    modalErrorDetail: {
                        ...modalErrorDetail,
                        data: res.Data
                    }
                });
            }
        });
    }

    closeModalErrorDetail = () => {
        let nextState = {
            modalErrorDetail: {
                ...this.state.modalErrorDetail,
                isModalVisible: false
            }
        };

        this.setState(nextState);
    };
    //#endregion

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
            const dateStartConvert = Vnr_Function.formatDateAPI(DateStart.value);
            const dateEndConvert = Vnr_Function.formatDateAPI(DateEnd.value);

            // bat buoc chon toi da 1 tuan
            if (moment(DateEnd.value).diff(moment(DateStart.value), 'days') + 1 <= 7) {
                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Att_GetData/GetDataRosterByProfileAndDate', {
                    profileID: profileInfo.ProfileID,
                    dateStart: dateStartConvert,
                    dateEnd: dateEndConvert
                }).then(res => {
                    VnrLoadingSevices.hide();
                    if (moment(DateStart.value) <= moment(DateEnd.value)) {
                        this.SetShiftByDate(res, dataShift, item);
                    } else {
                        // $('form[name="New_Att_Roster__New_CreateOrUpdate"] .form-group  select[data-role="dropdownlist"]').each(function () {
                        //     $(this).parent().removeClass('dropdown___readonly');
                        // })
                    }
                });

                return;
            } else {
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
            const dateStartConvert = Vnr_Function.formatDateAPI(DateStart.value);
            const dateEndConvert = Vnr_Function.formatDateAPI(DateEnd.value);
            if (moment(dateEndConvert).diff(moment(dateStartConvert), 'days') + 1 <= 7) {
                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Att_GetData/GetDataRosterHaveLeavedayByProfileAndDate/', {
                    profileID: profileInfo.ProfileID,
                    dateStart: dateStartConvert
                }).then(data => {
                    VnrLoadingSevices.hide();
                    if (data) {
                        this.SetShiftInLeave(data, dataShift, item);
                    }
                });
            }
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

    SetShiftByDate = (dataRoster, dataShift, item) => {
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
        const dateEndPlus = moment(DateStart.value).add(6, 'days');
        let index = 0;
        for (let i = _DateStart; i <= dateEndPlus; i = moment(i).add(1, 'days')) {
            if (dataRoster) {
                if (i.day() == 0 && dataRoster[index] != null) {
                    nextState = {
                        ...nextState,
                        SunShift: {
                            ...nextState.SunShift,
                            value: {
                                ID: dataRoster[index].ID,
                                ShiftName: dataRoster[index].Code + '-' + dataRoster[index].ShiftName
                            }
                        }
                    };
                } else if (i.day() == 1 && dataRoster[index] != null) {
                    nextState = {
                        ...nextState,
                        MonShift: {
                            ...nextState.MonShift,
                            value: {
                                ID: dataRoster[index].ID,
                                ShiftName: dataRoster[index].Code + '-' + dataRoster[index].ShiftName
                            }
                        }
                    };
                } else if (i.day() == 2 && dataRoster[index] != null) {
                    nextState = {
                        ...nextState,
                        TueShift: {
                            ...nextState.TueShift,
                            value: {
                                ID: dataRoster[index].ID,
                                ShiftName: dataRoster[index].Code + '-' + dataRoster[index].ShiftName
                            }
                        }
                    };
                } else if (i.day() == 3 && dataRoster[index] != null) {
                    nextState = {
                        ...nextState,
                        WedShift: {
                            ...nextState.WedShift,
                            value: {
                                ID: dataRoster[index].ID,
                                ShiftName: dataRoster[index].Code + '-' + dataRoster[index].ShiftName
                            }
                        }
                    };
                } else if (i.day() == 4 && dataRoster[index] != null) {
                    nextState = {
                        ...nextState,
                        ThuShift: {
                            ...nextState.ThuShift,
                            value: {
                                ID: dataRoster[index].ID,
                                ShiftName: dataRoster[index].Code + '-' + dataRoster[index].ShiftName
                            }
                        }
                    };
                } else if (i.day() == 5 && dataRoster[index] != null) {
                    nextState = {
                        ...nextState,
                        FriShift: {
                            ...nextState.FriShift,
                            value: {
                                ID: dataRoster[index].ID,
                                ShiftName: dataRoster[index].Code + '-' + dataRoster[index].ShiftName
                            }
                        }
                    };
                } else if (i.day() == 6 && dataRoster[index] != null) {
                    nextState = {
                        ...nextState,
                        SatShift: {
                            ...nextState.SatShift,
                            value: {
                                ID: dataRoster[index].ID,
                                ShiftName: dataRoster[index].Code + '-' + dataRoster[index].ShiftName
                            }
                        }
                    };
                }
                index++;
            }
        }

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
            if (data && data.length > 0) {
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
        this.setState(obj, () => {
            this.getDailyShiftAlternateDate();
        });
    };

    onChangeShiftType = item => {
        const { ChangeShiftType, AlternateDate, ChangeShiftID, AlternateShiftID, ChangeDate } = this.state;

        this.setState({
            ChangeShiftType: {
                ...ChangeShiftType,
                value: item,
                refresh: !ChangeShiftType.refresh
            },
            AlternateShiftID: {
                ...AlternateShiftID,
                value: null,
                disable: item.Value === 'E_DIFFERENTDAY' ? true : false,
                refresh: !AlternateShiftID.refresh
            },
            ChangeShiftID: {
                ...ChangeShiftID,
                value: null,
                disable: item.Value === 'E_DIFFERENTDAY' ? true : false,
                refresh: !ChangeShiftID.refresh
            },
            AlternateDate: {
                ...AlternateDate,
                disable: false,
                value: null,
                refresh: !AlternateDate.refresh
            },
            ChangeDate: {
                ...ChangeDate,
                disable: false,
                value: null,
                refresh: !ChangeDate.refresh
            }
        });
    };

    validateData = (profileID2, isDisableDate) => {
        const {
            ID,
            ChangeShiftType,
            ProfileID1,
            ProfileID2,
            ChangeDate,
            AlternateDate,
            ChangeShiftID,
            AlternateShiftID,
            UserApproveID,
            UserApproveID2,
            UserApproveID3,
            UserApproveID4,
            ChangeShiftReason
        } = this.state;

        let param = {
            ChangeShiftType: ChangeShiftType.value ? ChangeShiftType.value.Value : null,
            ProfileID1: ProfileID1.ID,
            ProfileID2: profileID2, //ProfileID2.value ? ProfileID2.value.ID : null,
            Status: 'E_SUBMIT',
            UserApproveID: UserApproveID.value ? UserApproveID.value.ID : null,
            UserApproveID3: UserApproveID3.value ? UserApproveID3.value.ID : null,
            UserApproveID4: UserApproveID4.value ? UserApproveID4.value.ID : null,
            UserApproveID2: UserApproveID2.value ? UserApproveID2.value.ID : null,
            ChangeShiftReason: ChangeShiftReason.value,
            AlternateShiftID: AlternateShiftID.value ? AlternateShiftID.value.ID : null,
            ChangeShiftID: ChangeShiftID.value ? ChangeShiftID.value.ID : null,
            AlternateDate: AlternateDate.value ? moment(AlternateDate.value).format('YYYY-MM-DD HH:mm:ss') : null,
            ChangeDate: ChangeDate.value ? moment(ChangeDate.value).format('YYYY-MM-DD HH:mm:ss') : null,
            IsPortal: true
        };

        if (ID) {
            param = {
                ...param,
                ID
            };
        }

        HttpService.Post('[URI_HR]/Att_GetData/GetValidateShiftSubstitution', param).then(data => {
            if (data) {
                let dataItem = data.split('|');

                if (dataItem[0].indexOf('E_DUPLICATEDATE') >= 0) {
                    this.setState({
                        AlternateDate: {
                            ...AlternateDate,
                            value: null,
                            refresh: !AlternateDate.refresh
                        },
                        disableBtnSave: true
                    });

                    ToasterSevice.showWarning(dataItem[1]);
                } else if (dataItem[0].indexOf('E_DUPLICATEEMP') >= 0) {
                    this.setState({
                        ProfileID2: {
                            ...ProfileID2,
                            value: null,
                            refresh: !ProfileID2.refresh
                        },
                        AlternateDate: {
                            ...AlternateDate,
                            disable: true,
                            refresh: !AlternateDate.refresh
                        },
                        ChangeDate: {
                            ...ChangeDate,
                            disable: true,
                            refresh: !ChangeDate.refresh
                        },
                        disableBtnSave: true
                    });

                    ToasterSevice.showWarning(dataItem[1]);
                } else {
                    this.setState(
                        {
                            AlternateDate: {
                                ...AlternateDate,
                                disable: isDisableDate ? false : AlternateDate.disable,
                                refresh: !AlternateDate.refresh
                            },
                            ChangeDate: {
                                ...ChangeDate,
                                disable: isDisableDate ? false : ChangeDate.disable,
                                refresh: !ChangeDate.refresh
                            },
                            disableBtnSave: false
                        },
                        () => this.getDailyShiftAlternateDate()
                    );
                }
            }
        });
    };

    onPickProfileID2 = item => {
        const { ProfileID2 } = this.state;

        this.setState(
            {
                ProfileID2: {
                    ...ProfileID2,
                    value: item,
                    refresh: !ProfileID2.refresh
                }
            },
            () => {
                if (item) {
                    this.validateData(item.ID, true);
                }
            }
        );
    };

    onCompareShiftChangeAndShiftAlternate = () => {
        const {
            ChangeShiftID,
            AlternateShiftID,
            ChangeShiftType,
            lstAlternateNotSelected,
            lstChangeShiftID
        } = this.state;
        let _changeShiftType = ChangeShiftType.value ? ChangeShiftType.value.Value : null;
        if (_changeShiftType === 'E_SAMEDAY') {
            if (Array.isArray(ChangeShiftID.value) && Array.isArray(AlternateShiftID.value)) {
                let arrID1 = [],
                    arrID2 = [];

                if (ChangeShiftID.value.length > 0) {
                    ChangeShiftID.value.map(vl1 => {
                        arrID1.push(vl1.ID);
                    });

                    AlternateShiftID.value.map(vl2 => {
                        arrID2.push(vl2.ID);
                    });
                }
                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Att_GetData/ValidateChangeMultiShiftSubstitution', {
                    lstChangeShiftSelected: arrID1,
                    lstAlternateNotSelected: lstAlternateNotSelected,
                    lstAlternateSelected: arrID2,
                    lstChangeShiftNotSelected: lstChangeShiftID
                }).then(data => {
                    VnrLoadingSevices.hide();

                    this.setState({
                        messageBeforeSave: data
                    });

                    if (data.length > 0) {
                        ToasterSevice.showWarning(data);
                    }
                });
            }
        }
    };

    render() {
        const {
                ChangeShiftType,
                ProfileID1,
                ProfileID2,
                ChangeDate,
                AlternateDate,
                ChangeShiftID,
                AlternateShiftID,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4,
                ChangeShiftReason,
                modalErrorDetail,
                fieldValid,
                disableBtnSave,
                isConfigFromServer
            } = this.state,
            {
                textLableInfo,

                contentViewControl,
                viewLable,
                viewControl,
                viewInputMultiline
            } = stylesListPickerControl,
            { styTextGroup } = stylesScreenDetailV2;

        // xử lý task  0143719
        let propsProfileID2 = {};
        if (ProfileID2.disable == false) {
            if (ProfileID2.data != null && ProfileID2.data.length > 0) {
                propsProfileID2 = {
                    filterServer: false,
                    dataLocal: ProfileID2.data,
                    filterParams: 'ProfileName'
                };
            } else {
                propsProfileID2 = {
                    filterServer: true,
                    filterParams: 'text',
                    api: {
                        urlApi: '[URI_HR]/HrMultiSelect/GetMultiProfileForAtt',
                        type: 'E_GET'
                    }
                };
            }
        }

        //#region [Xử lý 3 nút lưu]
        const listActions = [];

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_ShiftSubstitution_New_CreateOrUpdate_btnSaveandSendMail'] &&
            PermissionForAppMobile.value['New_Att_ShiftSubstitution_New_CreateOrUpdate_btnSaveandSendMail']['View']
        ) {
            listActions.push({
                disable: disableBtnSave,
                type: EnumName.E_SAVE_SENMAIL,
                title: translate('HRM_Common_SaveAndSendMail'),
                onPress: () => this.saveAndSend(this.props.navigation)
            });
        }

        listActions.push(
            {
                disable: disableBtnSave,
                type: EnumName.E_SAVE_CLOSE,
                title: translate('HRM_Common_SaveClose'),
                onPress: () => this.save(this.props.navigation)
            },
            {
                disable: disableBtnSave,
                type: EnumName.E_SAVE_NEW,
                title: translate('HRM_Common_SaveNew'),
                onPress: () => this.saveAndCreate(this.props.navigation)
            }
        );
        //#endregion;
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                    >
                        {/* ChangeShiftType - loại đổi ca */}
                        {ChangeShiftType.visibleConfig && ChangeShiftType.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={ChangeShiftType.label}
                                    />

                                    {/* valid ChangeShiftType */}
                                    {fieldValid.ChangeShiftType && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        api={{
                                            urlApi: '[URI_SYS]/Sys_GetData/GetEnum?text=ChangeShiftSubstitutionType',
                                            type: 'E_GET'
                                        }}
                                        refresh={ChangeShiftType.refresh}
                                        textField="Text"
                                        valueField="Value"
                                        filter={false}
                                        value={ChangeShiftType.value}
                                        disable={ChangeShiftType.disable}
                                        onFinish={item => this.onChangeShiftType(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Chọn nhân viên */}
                        <View style={styles.styViewGroup}>
                            <VnrText
                                style={[styleSheets.lable, styTextGroup, styles.styViewLalbe]}
                                i18nKey={'HRM_Chose_Profile'}
                            />

                            {/* Nhân viên yêu cầu - ProfileID1 */}
                            {ProfileID1.visibleConfig && ProfileID1.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={ProfileID1.label} />

                                        {/* valid ProfileID1 */}
                                        {fieldValid.ProfileID1 && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={true}
                                            style={[
                                                styleSheets.text,
                                                viewInputMultiline,
                                                { backgroundColor: Colors.white }
                                            ]}
                                            value={ProfileID1['ProfileName']}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Nhân viên thay thế - ProfileID2 */}
                            {ProfileID2.visibleConfig && ProfileID2.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={ProfileID2.label} />

                                        {/* valid ProfileID2 */}
                                        {fieldValid.ProfileID2 && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            refresh={ProfileID2.refresh}
                                            textField="ProfileName"
                                            valueField="ID"
                                            filter={true}
                                            value={ProfileID2.value}
                                            disable={ProfileID2.disable}
                                            onFinish={item => this.onPickProfileID2(item)}
                                            {...propsProfileID2}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Chọn ngày */}
                        <View style={styles.styViewGroup}>
                            <VnrText
                                style={[styleSheets.lable, styTextGroup, styles.styViewLalbe]}
                                i18nKey={'HRM_HR_Task_Date'}
                            />

                            {/*  Ngày đổi - ChangeDate*/}
                            {ChangeDate.visibleConfig && ChangeDate.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={ChangeDate.label} />

                                        {/* valid AlternateDate */}
                                        {fieldValid.ChangeDate && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={ChangeDate.value}
                                            refresh={ChangeDate.refresh}
                                            disable={ChangeDate.disable}
                                            type={'date'}
                                            onFinish={value => {
                                                this.setState(
                                                    {
                                                        ChangeDate: {
                                                            ...ChangeDate,
                                                            value,
                                                            refresh: !ChangeDate.refresh
                                                        },
                                                        AlternateDate: {
                                                            ...AlternateDate,
                                                            value:
                                                                ChangeShiftType.value.Value == 'E_SAMEDAY'
                                                                    ? value
                                                                    : AlternateDate.value,
                                                            disable:
                                                                ChangeShiftType.value.Value == 'E_SAMEDAY'
                                                                    ? true
                                                                    : AlternateDate.disable,
                                                            refresh: !AlternateDate.refresh
                                                        }
                                                    },
                                                    () => {
                                                        this.ChangeAlternateDate();
                                                        this.getDailyShiftChangeDate();
                                                    }
                                                );
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* ngày thay thế - AlternateDate */}
                            {AlternateDate.visibleConfig && AlternateDate.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={AlternateDate.label}
                                        />

                                        {/* valid AlternateDate */}
                                        {fieldValid.AlternateDate && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={AlternateDate.value}
                                            refresh={AlternateDate.refresh}
                                            type={'date'}
                                            disable={AlternateDate.disable}
                                            onFinish={value => {
                                                this.setState(
                                                    {
                                                        AlternateDate: {
                                                            ...AlternateDate,
                                                            value,
                                                            refresh: !AlternateDate.refresh
                                                        }
                                                    },
                                                    () =>
                                                        this.validateData(
                                                            ProfileID2.value ? ProfileID2.value.ID : null,
                                                            false
                                                        )
                                                );
                                            }}
                                        />
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* Chọn ca */}
                        <View style={styles.styViewGroup}>
                            <VnrText
                                style={[styleSheets.lable, styTextGroup, styles.styViewLalbe]}
                                i18nKey={'HRM_Chose_Shift'}
                            />

                            {/* Ca đổi - ChangeShiftID */}
                            {ChangeShiftID.visibleConfig && ChangeShiftID.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={ChangeShiftID.label}
                                        />

                                        {/* valid ChangeShiftID */}
                                        {fieldValid.ChangeShiftID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        {isConfigFromServer ? (
                                            <VnrPickerMultiSave
                                                // api={{
                                                //     urlApi:
                                                //         '[URI_HR]/Att_GetData/GetMultiShiftByOrdernumber',
                                                //     type: 'E_GET',
                                                // }}
                                                dataLocal={ChangeShiftID.data}
                                                isRenderLimit={true}
                                                isConfig={isConfigFromServer}
                                                apiRemove={{
                                                    urlApi: '[URI_HR]/Att_GetData/CheckInOutShift',
                                                    type: 'E_POST',
                                                    dataBody: {
                                                        strShiftID: ''
                                                    }
                                                }}
                                                refresh={ChangeShiftID.refresh}
                                                textField="ShiftNameView"
                                                valueField="ID"
                                                filter={true}
                                                filterServer={false}
                                                autoFilter={true}
                                                value={ChangeShiftID.value}
                                                disable={ChangeShiftID.disable}
                                                onFinish={item => {
                                                    let arr = [];
                                                    let arrID1 = [];
                                                    let arrID2 = [];

                                                    if (item.length > 0) {
                                                        item.map(vl1 => {
                                                            arrID1.push(vl1.ID);
                                                        });

                                                        ChangeShiftID.data.map(vl2 => {
                                                            arrID2.push(vl2.ID);
                                                        });

                                                        arrID2.filter(vl3 => {
                                                            if (!arrID1.includes(vl3)) {
                                                                arr.push(vl3);
                                                            }
                                                        });
                                                    }
                                                    this.onPickShift({
                                                        ChangeShiftID: {
                                                            ...ChangeShiftID,
                                                            value: item,
                                                            refresh: !ChangeShiftID.refresh
                                                        },
                                                        lstChangeShiftID: arr.length === 0 ? null : arr
                                                    });
                                                }}
                                            />
                                        ) : (
                                            <VnrPicker
                                                dataLocal={ChangeShiftID.data}
                                                refresh={ChangeShiftID.refresh}
                                                textField="ShiftName"
                                                valueField="ID"
                                                filter={true}
                                                value={ChangeShiftID.value}
                                                filterServer={false}
                                                disable={false} //ChangeShiftID.disable
                                                onFinish={item => {
                                                    this.setState({
                                                        ChangeShiftID: {
                                                            ...ChangeShiftID,
                                                            value: item,
                                                            refresh: !ChangeShiftID.refresh
                                                        }
                                                    });
                                                }}
                                            />
                                        )}
                                    </View>
                                </View>
                            )}

                            {/* Ca thay thế - AlternateShiftID */}
                            {AlternateShiftID.visibleConfig && AlternateShiftID.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={AlternateShiftID.label}
                                        />

                                        {/* valid AlternateShiftID */}
                                        {fieldValid.AlternateShiftID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        {isConfigFromServer ? (
                                            <VnrPickerMultiSave
                                                // api={{
                                                //     urlApi:
                                                //         '[URI_HR]/Att_GetData/GetMultiShiftByOrdernumber',
                                                //     type: 'E_GET',
                                                // }}
                                                dataLocal={AlternateShiftID.data}
                                                isRenderLimit={true}
                                                isConfig={isConfigFromServer}
                                                apiRemove={{
                                                    urlApi: '[URI_HR]/Att_GetData/CheckInOutShift',
                                                    type: 'E_POST',
                                                    dataBody: {
                                                        strShiftID: ''
                                                    }
                                                }}
                                                refresh={AlternateShiftID.refresh}
                                                textField="ShiftNameView"
                                                valueField="ID"
                                                filter={true}
                                                filterServer={false}
                                                autoFilter={true}
                                                value={AlternateShiftID.value}
                                                disable={AlternateShiftID.disable}
                                                onFinish={item => {
                                                    let arr = [];
                                                    let arrID1 = [];
                                                    let arrID2 = [];

                                                    if (item.length > 0) {
                                                        item.map(vl1 => {
                                                            arrID1.push(vl1.ID);
                                                        });

                                                        AlternateShiftID.data.map(vl2 => {
                                                            arrID2.push(vl2.ID);
                                                        });

                                                        arrID2.filter(vl3 => {
                                                            if (!arrID1.includes(vl3)) {
                                                                arr.push(vl3);
                                                            }
                                                        });
                                                    }

                                                    this.setState(
                                                        {
                                                            AlternateShiftID: {
                                                                ...AlternateShiftID,
                                                                value: item,
                                                                refresh: !AlternateShiftID.refresh
                                                            },
                                                            lstAlternateNotSelected: arr.length === 0 ? null : arr
                                                        },
                                                        () => {
                                                            this.onCompareShiftChangeAndShiftAlternate();
                                                        }
                                                    );
                                                }}
                                            />
                                        ) : (
                                            <VnrPicker
                                                dataLocal={AlternateShiftID.data}
                                                refresh={AlternateShiftID.refresh}
                                                textField="ShiftName"
                                                valueField="ID"
                                                filter={true}
                                                value={AlternateShiftID.value}
                                                filterServer={false}
                                                //filterParams="text"
                                                disable={false}
                                                onFinish={item => {
                                                    this.setState({
                                                        AlternateShiftID: {
                                                            ...AlternateShiftID,
                                                            value: item,
                                                            refresh: !AlternateShiftID.refresh
                                                        }
                                                    });
                                                }}
                                            />
                                        )}
                                    </View>
                                </View>
                            )}
                        </View>

                        {/* ChangeShiftReason - Lý do đổi ca */}
                        {ChangeShiftReason.visibleConfig && ChangeShiftReason.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={ChangeShiftReason.label}
                                    />

                                    {/* valid ChangeShiftReason */}
                                    {fieldValid.ChangeShiftReason && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={ChangeShiftReason.disable}
                                        refresh={ChangeShiftReason.refresh}
                                        value={ChangeShiftReason.value}
                                        onChangeText={text =>
                                            this.setState({
                                                ChangeShiftReason: {
                                                    ...ChangeShiftReason,
                                                    value: text,
                                                    refresh: !ChangeShiftReason.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* UserApproveID - duyệt đầu */}
                        {UserApproveID.visibleConfig && UserApproveID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={UserApproveID.label} />

                                    {/* valid UserApproveID */}
                                    {fieldValid.UserApproveID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_SHIFTSUBSTITUTION',
                                            type: 'E_GET'
                                        }}
                                        refresh={UserApproveID.refresh}
                                        textField="UserInfoName"
                                        valueField="ID"
                                        filter={true}
                                        value={UserApproveID.value}
                                        filterServer={true}
                                        filterParams="text"
                                        disable={UserApproveID.disable}
                                        onFinish={item => this.onChangeUserApprove(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* UserApproveID2 - duyệt giữa */}
                        {UserApproveID2.visibleConfig && UserApproveID2.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={UserApproveID2.label} />

                                    {/* valid UserApproveID2 */}
                                    {fieldValid.UserApproveID2 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_SHIFTSUBSTITUTION',
                                            type: 'E_GET'
                                        }}
                                        value={UserApproveID2.value}
                                        refresh={UserApproveID2.refresh}
                                        textField="UserInfoName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={true}
                                        filterParams="text"
                                        disable={UserApproveID2.disable}
                                        onFinish={item => {
                                            this.setState({
                                                UserApproveID2: {
                                                    ...UserApproveID2,
                                                    value: item,
                                                    refresh: !UserApproveID2.refresh
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* UserApproveID3 - duyệt tiếp theo */}
                        {UserApproveID3.visibleConfig && UserApproveID3.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={UserApproveID3.label} />

                                    {/* valid UserApproveID3 */}
                                    {fieldValid.UserApproveID3 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_SHIFTSUBSTITUTION',
                                            type: 'E_GET'
                                        }}
                                        value={UserApproveID3.value}
                                        refresh={UserApproveID3.refresh}
                                        textField="UserInfoName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={true}
                                        filterParams="text"
                                        disable={UserApproveID3.disable}
                                        onFinish={item => {
                                            this.setState({
                                                UserApproveID3: {
                                                    ...UserApproveID3,
                                                    value: item,
                                                    refresh: !UserApproveID3.refresh
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* UserApproveID4 - duyệt cuối */}
                        {UserApproveID4.visibleConfig && UserApproveID4.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={UserApproveID4.label} />

                                    {/* valid UserApproveID4 */}
                                    {fieldValid.UserApproveID4 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_SHIFTSUBSTITUTION',
                                            type: 'E_GET'
                                        }}
                                        refresh={UserApproveID4.refresh}
                                        textField="UserInfoName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={true}
                                        value={UserApproveID4.value}
                                        filterParams="text"
                                        disable={UserApproveID4.disable}
                                        onFinish={item => this.onChangeUserApprove2(item)}
                                    />
                                </View>
                            </View>
                        )}
                    </KeyboardAwareScrollView>

                    <ListButtonSave listActions={listActions} />

                    {modalErrorDetail.isModalVisible && (
                        <Modal
                            onBackButtonPress={() => this.closeModalErrorDetail()}
                            isVisible={true}
                            onBackdropPress={() => this.closeModalErrorDetail()}
                            customBackdrop={
                                <TouchableWithoutFeedback onPress={() => this.closeModalErrorDetail()}>
                                    <View
                                        style={styleSheets.coatingOpacity05}
                                    />
                                </TouchableWithoutFeedback>
                            }
                            style={CustomStyleSheet.margin(0)}
                        >
                            <View style={stylesModalPopupBottom.viewModal}>
                                <SafeAreaView {...styleSafeAreaView} style={stylesModalPopupBottom.safeRadius}>
                                    <View style={styles.headerCloseModal}>
                                        <IconColse color={Colors.white} size={Size.iconSize} />
                                        <VnrText
                                            style={styleSheets.lable}
                                            i18nKey={'HRM_Attendance_Message_ViolationNotification'}
                                        />
                                        <TouchableOpacity onPress={() => this.closeModalErrorDetail()}>
                                            <IconColse color={Colors.grey} size={Size.iconSize} />
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView style={styleSheets.flexGrow1flexDirectionColumn}>
                                        {this.renderErrorDetail()}
                                    </ScrollView>
                                    <View style={styles.groupButton}>
                                        <TouchableOpacity
                                            onPress={() => this.closeModalErrorDetail()}
                                            style={styles.btnClose}
                                        >
                                            <VnrText
                                                style={[styleSheets.lable, { color: Colors.white }]}
                                                i18nKey={'HRM_Common_Close'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </SafeAreaView>
                            </View>
                        </Modal>
                    )}
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    groupButton: {
        flexGrow: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: styleSheets.p_10,
        backgroundColor: Colors.white,
        marginTop: 10,
        marginBottom: 10
    },
    styViewGroup: {
        paddingVertical: Size.defineHalfSpace,
        backgroundColor: Colors.gray_2,
        marginBottom: Size.defineSpace
    },
    styViewLalbe: {
        marginHorizontal: Size.defineSpace,
        marginBottom: 5
    },
    headerCloseModal: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    btnClose: {
        height: Size.heightButton,
        backgroundColor: Colors.red,
        borderRadius: styleSheets.radius_5,
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
    },
    // eslint-disable-next-line react-native/no-unused-styles
    viewInfo: {
        flex: 1
    },
    // eslint-disable-next-line react-native/no-unused-styles
    Line: {
        flex: 1,
        flexDirection: 'row',
        maxWidth: '100%',
        marginVertical: 2
    },
    // eslint-disable-next-line react-native/no-unused-styles
    fontText: {
        fontSize: Size.text - 1
    },
    styleViewBorderButtom: {
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.borderColor,
        flex: 1,
        marginBottom: 0.5,
        marginHorizontal: 10,
        paddingVertical: 10
    }
});
