import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    Size,
    styleScreenDetail,
    stylesModalPopupBottom,
    styleViewTitleForGroup,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import HttpService from '../../../../../utils/HttpService';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName, EnumIcon } from '../../../../../assets/constant';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import {
    IconDown,
    IconUp,
    IconMinus,
    IconPlus,
    IconColse,
    IconTime,
    IconCancel
} from '../../../../../constants/Icons';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import Modal from 'react-native-modal';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import CheckBox from 'react-native-check-box';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';

let enumName = null,
    profileInfo = null;

const initSateDefault = {
    ID: null,
    Profile: {
        label: 'HRM_Attendance_Leaveday_ProfileID',
        ID: null,
        ProfileName: '',
        disable: true
    },
    WorkDate: {
        label: 'HRM_Attendance_Overtime_WorkDate',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    DayType: {
        label: 'DayType',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    ShiftID: {
        label: 'HRM_Attendance_Overtime_ShiftID',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    DurationType: {
        label: 'HRM_System_UserApprove_Type',
        data: [],
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    divOvertimeTypeID: {
        visible: true,
        visibleConfig: true,
        label: 'HRM_Att_Report_OvertimeTypeID',
        OvertimeTypeID: {
            data: [],
            disable: true,
            refresh: false,
            value: null,
            visible: true,
            visibleConfig: true
        }
    },
    checkShiftByProfile: {
        visible: true,
        visibleConfig: true,
        label: 'HRM_Attendance_Overtime_HourStartOverTime',
        TimeFrom: {
            value: null,
            refresh: false,
            disable: false,
            visibleConfig: true,
            visible: true
        },
        TimeTo: {
            value: null,
            refresh: false,
            disable: false,
            visibleConfig: true,
            visible: true
        }
    },
    NoConfig: {
        label: 'HRM_Attendance_Overtime_RegisterHours',
        visibleConfig: true,
        visible: true,
        RegisterHours: {
            value: null,
            refresh: false,
            disable: false,
            visibleConfig: true,
            visible: true
        },
        RegisterHoursConfig: {
            data: [],
            value: null,
            refresh: false,
            disable: false,
            visibleConfig: true,
            visible: false
        }
    },
    About: {
        label: 'HRM_Attendance_OTPlanAboutTitle',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    MethodPayment: {
        data: [],
        label: 'HRM_Attendance_Overtime_MethodPayment',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    BusinessUnitTypeID: {
        data: [],
        label: 'HRM_Category_ShopGroup_ShopGroupName',
        disable: false,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    BusinessUnitID: {
        data: [],
        label: 'HRM_Category_Shop_ShopName',
        disable: false,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    FileAttach: {
        label: 'HRM_Att_BusinessTravel_FileAttachment',
        visible: true,
        visibleConfig: true,
        disable: true,
        refresh: false,
        value: null
    },
    ReasonOT: {
        label: 'HRM_Attendance_Overtime_ReasonOT',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    RequestCancelReason: {
        label: 'HRM_Attendance_RequestCancel_CommentReson',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    OvertimeReasonID: {
        label: 'HRM_OTPlan_OvertimeReason',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    IsUnitAssistant: {
        label: 'HRM_Attendance_IsUnitAssistant',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true
    },
    UserApproveID: {
        label: 'HRM_Attendance_Overtime_UserApproveID',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
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
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    UserApproveID2: {
        label: 'HRM_Attendance_Overtime_UserApproveID3',
        disable: false,
        visible: true,
        refresh: false,
        value: null,
        visibleConfig: true
    },
    IsOverTimeBreak: {
        label: 'HRM_Attendance_IsOverTimeBreak',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true
    },
    IsNotCheckInOut: {
        label: 'HRM_Attendance_IsNotCheckInOut',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true
    },
    AdvanceOverTimeInDay: {
        visible: true,
        visibleConfig: true,
        isShowInfoAdvance: false,
        label: 'HRM_InformationOverTimeOut',
        IsTripOTInDay: {
            label: 'HRM_BizTripOTHrsDay',
            disable: false,
            refresh: false,
            value: true,
            visibleConfig: true,
            visible: true,
            OvertimeHour: {
                label: 'HRM_TotalOTWorkingHrs',
                disable: true,
                refresh: false,
                value: '0',
                visibleConfig: true,
                visible: true
            },
            HourTotal: {
                label: 'HRM_TotalHrsTravel',
                disable: true,
                refresh: false,
                value: '0',
                visibleConfig: true,
                visible: true
            }
        },
        IsRequestShuttleCar: {
            label: 'HRM_RequestShuttleCar',
            disable: false,
            refresh: false,
            value: false,
            visibleConfig: true,
            visible: true,
            JobTypeID: {
                label: 'HRM_HR_HDTJob_Type',
                data: [],
                disable: false,
                refresh: false,
                value: null,
                visibleConfig: true,
                visible: true
            },
            Place: {
                label: 'HRM_PlaceTypeOT',
                disable: false,
                refresh: false,
                value: '',
                visibleConfig: true,
                visible: true
            },
            RequestParking: {
                label: 'HRM_Att_OvertimePlan_RequestParking',
                disable: false,
                refresh: false,
                value: '',
                visibleConfig: true,
                visible: true
            }
        },
        IsSignUpToEat: {
            label: 'HRM_RequestOTMeal',
            disable: false,
            refresh: false,
            value: false,
            visibleConfig: true,
            visible: true
        },
        IsRequestEntryExitGate: {
            label: 'HRM_RequestEntryExiGate',
            disable: false,
            refresh: false,
            value: false,
            visibleConfig: true,
            visible: true
        },
        IsRequestForBenefit: {
            label: 'HRM_RequestEmergencyAllowancePayment',
            disable: false,
            refresh: false,
            value: false,
            visibleConfig: true,
            visible: true
        },
        SendToID: {
            data: [],
            label: 'HRM_Attendance_BusinessTravel_SendTo',
            disable: false,
            value: '',
            refresh: false,
            visibleConfig: true,
            visible: true
        },
        OvertimeArea: {
            label: 'HRM_OTWorkingArea',
            disable: false,
            value: '',
            refresh: false,
            visibleConfig: true,
            visible: true
        }
    },
    modalLimit: {
        isModalVisible: false,
        data: []
    },
    dataError: null,
    modalErrorDetail: {
        isModalVisible: false,
        cacheID: null,
        data: []
    },
    fieldValid: {},
    dataPlanLimit: {
        data: null,
        modalVisiblePlanLimit: false
    }
};

export default class AttSubmitPlanOvertimeCancelAddOrEdit extends Component {
    constructor(props) {
        super(props);

        this.state = initSateDefault;

        props.navigation.setParams({
            title:
                props.navigation.state.params.screenName == 'AttSubmitPlanOvertime'
                    ? 'HRM_New_Att_RequestCancelationOvertimePlan_Edit'
                    : 'HRM_New_Att_RequestCancelationOvertimePlan_Add'
        });

        this.setVariable();
    }

    //#region [khởi tạo - lấy các dữ liệu cho control, lấy giá trị mặc đinh]
    setVariable = () => {
        //biến trạng thái
        this.isModify = false;
        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;
        this.isChangeLevelApprove = null;
        this.levelApprovePregnancyRegister = null;
        this.dataMidApprove = [];
        this.dataLastApprove = [];
        this.UserSubmitIDForEdit = null;
        this.layoutViewInfoMore = null;
        this.scrollViewRef = null;
        this.isListRegisterHours = null;
        this.levelApproveRequestCancelation = null;
        this.isOnlyOnleLevelApprove = null;
        this.levelApproveOTPlan = null;
        this.isLevelApprove2 = null;
        this.levelApproveOT = null;
        this.checkByApprove = null;
        this.AllowOvertimeType = null;
        this.IsReceiveOvertimeBonusOrg = null;
        this.IsConfirmPreg = null;
        this.IsConfirmLimit = null;
        this.IsConfirmSaveContinue = null;
        this.IsconfirmPregContinue = null;
        this.IsContinueSave = false;
        this.ProfileRemoveIDs = null;
        this.IsRemoveAndContinue = null;
        this.CacheID = null;
    };

    refreshView = () => {
        this.props.navigation.setParams({ title: 'Hrm_Portal_Submit_PlanOvertime' });
        this.setVariable();
        this.setState(initSateDefault, () => this.getConfigValid('AnalysisInfo', true));
    };

    //promise get config valid
    getConfigValid = (tblName, isRefresh) => {
        VnrLoadingSevices.show();
        HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName).then(res => {
            VnrLoadingSevices.hide();
            if (res) {
                try {
                    //map field hidden by config
                    const _configField =
                        ConfigField && ConfigField.value['AttSubmitPlanOvertimeCancelAddOrEdit']
                            ? ConfigField.value['AttSubmitPlanOvertimeCancelAddOrEdit']['Hidden']
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

                    this.setState({ ...nextState }, () => {
                        enumName = EnumName;
                        profileInfo = dataVnrStorage
                            ? dataVnrStorage.currentUser
                                ? dataVnrStorage.currentUser.info
                                : null
                            : null;

                        let { record, screenName } = !isRefresh ? this.props.navigation.state.params : {};

                        // //get config khi đăng ký
                        // if (!record) {
                        //   this.initData();
                        // }
                        // else {
                        //   this.isModify = true;
                        //   this.getRecordAndConfigByID(record, this.handleSetState,
                        //     this.GetLevelByApprove, this.GetRegisterHoursConfig, this.GetMethodPaymentConfigDefault);
                        // }

                        //get config khi đăng ký
                        if (!record) {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 5000);
                        } else {
                            this.isModify = true;
                            this.getRecordAndConfigByID(
                                record,
                                screenName,
                                this.handleSetState,
                                this.GetLevelByApprove,
                                this.GetRegisterHoursConfig,
                                this.GetMethodPaymentConfigDefault
                            );
                        }
                    });
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            }
        });
    };

    componentDidMount() {
        //get config validate
        this.getConfigValid('Att_RequestCancelOvertimePlanPortal');
    }

    initData = () => {
        const { E_ProfileID, E_FullName } = enumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] },
            { Profile } = this.state;

        let nextState = {
            Profile: {
                ...Profile,
                ..._profile
            }
        };

        let readOnlyCtrlOT = this.readOnlyCtrlOT(true);

        nextState = {
            ...nextState,
            ...readOnlyCtrlOT
        };

        this.setState(nextState, () => {
            this.GetMethodPayment();
            this.GetOvertimeType();
            this.GetDurationType();
            this.GetLevelByApprove();
            this.GetRegisterHoursConfig();
            this.GetHighSupervior();
        });
    };

    getRecordAndConfigByID = (
        record,
        screenName,
        _handleSetState,
        callback1,
        callback2,
        getMethodPaymentConfigDefault
    ) => {

        const { ID, ProfileID, WorkDate } = record;
        let arrRequest = [];

        arrRequest = [
            HttpService.Post('[URI_HR]/Att_GetData/GetOvertimeDurationTypeByDate', {
                ProfileID: ProfileID,
                WorkDate: moment(WorkDate).format('YYYY-MM-DD HH:mm:ss'),
                IsPortal: true
            }),
            HttpService.Post('[URI_HR]/Att_GetData/GetLevelApproveRequestCancelOvertimePlan', { profileID: ProfileID }),
            HttpService.Post('[URI_HR]/Att_GetData/GetHighSupervisor', {
                ProfileID: ProfileID,
                userSubmit: ProfileID,
                type: 'E_REQUESTCANCEL_OVERTIMEPLAN'
            }),
            HttpService.Post('[URI_POR]/New_Att_Overtime/GetMultiMethodPayment', {}),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiOvertimeTypeNotInPortal')
        ];

        if (screenName == 'AttSubmitPlanOvertime') {
            // Yêu cầu hủy
            arrRequest.push(HttpService.Get('[URI_POR]/New_Att_PlanOvertime/GetById?ID=' + ID));
        } else {
            // Chỉnh sửa yêu cầu hủy
            arrRequest.push(HttpService.Get('[URI_HR]/Att_GetData/GetRequestCancelationOTPlanByID?ID=' + ID));
        }

        VnrLoadingSevices.show();
        HttpService.MultiRequest(arrRequest).then(resAll => {
            VnrLoadingSevices.hide();
            try {
                _handleSetState(record, screenName, resAll, callback1, callback2, getMethodPaymentConfigDefault);
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    GetDurationType = () => {
        HttpService.Get('[URI_POR]/New_Att_Overtime/GetMultiDurationType').then(res => {
            if (res) {
                const { DurationType, WorkDate } = this.state;
                this.setState({
                    DurationType: {
                        ...DurationType,
                        data: res,
                        disable: WorkDate.value ? false : true,
                        refresh: !DurationType.refresh
                    }
                });
            }
        });
    };

    GetOvertimeType = () => {
        HttpService.Get('[URI_HR]/Cat_GetData/GetMultiOvertimeTypeNotInPortal').then(res => {
            if (res) {
                const { divOvertimeTypeID, WorkDate } = this.state,
                    { OvertimeTypeID } = divOvertimeTypeID;

                let nextState = {
                    divOvertimeTypeID: {
                        ...divOvertimeTypeID,
                        OvertimeTypeID: {
                            ...OvertimeTypeID,
                            data: res,
                            disable: WorkDate.value ? false : true,
                            refresh: !OvertimeTypeID.refresh
                        }
                    }
                };

                this.setState(nextState);
            }
        });
    };

    GetRegisterHoursConfig = () => {
        HttpService.Post('[URI_HR]/Sal_GetData/GetConfigElement', { Key: 'HRM_ATT_OT_LISTREGISTERHOURS' }).then(
            returnValue => {
                if (returnValue) {
                    let nextState = {};

                    const { NoConfig, checkShiftByProfile } = this.state,
                        { RegisterHoursConfig, RegisterHours } = NoConfig,
                        { TimeFrom, TimeTo } = checkShiftByProfile;

                    if (returnValue.Value1 != '') {
                        let data = [],
                            strRegistHours = returnValue.Value1.split(',');

                        this.isListRegisterHours = strRegistHours;

                        for (let i = 0; i < strRegistHours.length; i++) {
                            data.push({ Text: strRegistHours[i], Value: strRegistHours[i] });
                        }
                        //_lstRegisterHours.setDataSource(data);

                        //isShowEle('#ele-RegisterHours');
                        //isShowEle('#ele-RegisterHoursConfig', true);

                        //readonly Hour
                        // $('[field-name="TimeFrom"]').unbind('click');
                        // $('[field-name="TimeTo"]').unbind('click');

                        // $('[field-name="TimeFrom"]').data('kendoTimePicker').readonly()
                        // $('[field-name="TimeTo"]').data('kendoTimePicker').readonly()

                        nextState = {
                            NoConfig: {
                                ...NoConfig,
                                RegisterHours: {
                                    ...RegisterHours,
                                    visible: false
                                },
                                RegisterHoursConfig: {
                                    ...RegisterHoursConfig,
                                    data: [...data],
                                    visible: true,
                                    refresh: !RegisterHoursConfig.refresh
                                }
                            },
                            checkShiftByProfile: {
                                ...checkShiftByProfile,
                                TimeFrom: {
                                    ...TimeFrom,
                                    disable: true,
                                    refresh: !TimeFrom.refresh
                                },
                                TimeTo: {
                                    ...TimeTo,
                                    disable: true,
                                    refresh: !TimeTo.refresh
                                }
                            }
                        };
                    } else {
                        this.isListRegisterHours = '';
                        // isShowEle('#ele-RegisterHours', true);
                        // isShowEle('#ele-RegisterHoursConfig');
                        nextState = {
                            NoConfig: {
                                ...NoConfig,
                                RegisterHours: {
                                    ...RegisterHours,
                                    visible: true
                                },
                                RegisterHoursConfig: {
                                    ...RegisterHoursConfig,
                                    visible: false
                                }
                            }
                        };
                    }

                    this.setState(nextState);
                }
            }
        );
    };

    GetLevelByApprove = () => {
        // HttpService.Post('[URI_HR]/Sal_GetData/GetConfigElement', { Key: 'HRM_ATT_CONFIG_NUMBER_LEAVE_APPROVE_OVERTIME' })
        //   .then(returnValue => {
        //     this.checkByApprove = returnValue;
        //   })
    };

    GetMethodPayment = () => {
        HttpService.Post('[URI_POR]/New_Att_Overtime/GetMultiMethodPayment', {}).then(data1 => {
            if (data1) {
                const { MethodPayment } = this.state;
                this.setState(
                    {
                        MethodPayment: {
                            ...MethodPayment,
                            data: data1,
                            refresh: !MethodPayment.refresh
                        }
                    },
                    () => this.GetMethodPaymentConfigDefault()
                );
            }
        });
    };

    GetMethodPaymentConfigDefault = () => {
        HttpService.Post('[URI_SYS]/Sys_GetData/GetEnum', { text: 'MethodPayment' }).then(data => {
            if (data) {
                const { MethodPayment } = this.state;
                let nextState = {};

                if (data.length == 1) {
                    nextState = {
                        MethodPayment: {
                            ...MethodPayment,
                            data: [...data],
                            value: { ...data[0] },
                            refresh: !MethodPayment.refresh
                        }
                    };
                } else {
                    nextState = {
                        MethodPayment: {
                            ...MethodPayment,
                            data: [...data],
                            refresh: !MethodPayment.refresh
                        }
                    };
                }

                this.setState(nextState);
            }
        });
    };

    GetAllowOvertimeType = () => {
        HttpService.Post('[URI_HR]/Att_GetData/GetAllowOvertimeType', {}).then(data1 => {
            this.AllowOvertimeType = data1;
        });
        // $.ajax({
        //     type: 'POST',
        //     url: uriHr + 'Att_GetData/GetAllowOvertimeType',
        //     data: {},
        //     success: function (data1) {
        //         // if (data1 != true) {
        //         //     $('#OvertimeType').addClass('hide');
        //         // } else {
        //         //     var OvertimeTypeID = $('#OvertimeTypeID').data("kendoDropDownList");
        //         //     OvertimeTypeID.value(data1[0]);
        //         // }
        //     }
        // });
    };

    handleSetState = (record, screenName, resAll, callback1, callback2, getMethodPaymentConfigDefault) => {
        let nextState = {};
        let item = null;

        if (screenName == 'AttSubmitPlanOvertime') {
            // Yêu cầu hủy
            item = resAll[5][0];
        } else {
            // Chỉnh sửa yêu cầu hủy
            item = resAll[5];
        }

        const {
                Profile,
                WorkDate,
                ShiftID,
                DurationType,
                divOvertimeTypeID,
                checkShiftByProfile,
                NoConfig,
                IsOverTimeBreak,
                IsNotCheckInOut,
                MethodPayment,
                BusinessUnitTypeID,
                BusinessUnitID,
                FileAttach,
                ReasonOT,
                RequestCancelReason,
                OvertimeReasonID,
                IsUnitAssistant,
                UserApproveID,
                UserApproveID3,
                UserApproveID4,
                UserApproveID2,
                AdvanceOverTimeInDay,
                DayType
            } = this.state,
            { OvertimeTypeID } = divOvertimeTypeID,
            { TimeFrom, TimeTo } = checkShiftByProfile,
            { RegisterHours, RegisterHoursConfig } = NoConfig,
            {
                IsTripOTInDay,
                IsRequestShuttleCar,
                IsSignUpToEat,
                IsRequestEntryExitGate,
                IsRequestForBenefit,
                SendToID,
                OvertimeArea
            } = AdvanceOverTimeInDay,
            { OvertimeHour, HourTotal } = IsTripOTInDay,
            { JobTypeID, Place, RequestParking } = IsRequestShuttleCar,
            dataDurationType = resAll[0]
                ? resAll[0].map(itemDur => {
                    return {
                        Value: itemDur.ID,
                        Text: itemDur.Translate
                    };
                })
                : [],
            configAproveOverTimePlan = resAll[1],
            configHighSupervisor = resAll[2],
            dataMethodPayment = resAll[3],
            dataOvertimeType = resAll[4];

        let _valueDurationType = null;
        if (dataDurationType.length && item.DurationType) {
            _valueDurationType = dataDurationType.find(itemDur => itemDur.Value == item.DurationType);
        }

        let _valueMethodPayment = null;
        if (dataMethodPayment && item.MethodPayment) {
            _valueMethodPayment = dataMethodPayment.find(itemMet => itemMet.Value == item.MethodPayment);
        }

        if (screenName == 'AttSubmitPlanOvertime') {
            //Yêu cầu hủy cần gán lại cấp duyệt

            item = {
                ...item,
                UserApproveID4: item['UserApproveID3'],
                UserApproveName4: item['UserApproveName3'],

                UserApproveID2: item['UserApproveID4'],
                UserApproveName2: item['UserApproveName4'],

                UserApproveID3: item['UserApproveID2'],
                UserApproveName3: item['UserApproveName2']
            };
        }

        nextState = {
            ...this.state,
            ID: item.ID,
            RecordID: item.RecordID,
            Profile: {
                ...Profile,
                ID: item.ProfileID,
                ProfileName: item.ProfileName
            },
            WorkDate: {
                ...WorkDate,
                value: item.WorkDate ? moment(item.WorkDate).format('YYYY-MM-DD HH:mm:ss') : null,
                disable: true,
                refresh: !WorkDate.refresh
            },
            ShiftID: {
                ...ShiftID,
                value: item.ShiftID ? { ID: item.ShiftID, ShiftName: item.ShiftName } : null,
                disable: true,
                refresh: !ShiftID.refresh
            },
            DayType: {
                ...DayType,
                value: item.DayType ? item.DayType : '',
                visible: true,
                refresh: !DayType.refresh
            },
            DurationType: {
                ...DurationType,
                data: dataDurationType,
                value: _valueDurationType,
                disable: false,
                refresh: !DurationType.refresh
            },
            divOvertimeTypeID: {
                ...divOvertimeTypeID,
                OvertimeTypeID: {
                    ...divOvertimeTypeID.OvertimeTypeID,
                    data: dataOvertimeType,
                    disable: false,
                    value: item.OvertimeTypeID
                        ? { ID: item.OvertimeTypeID, OvertimeTypeName: item.OvertimeTypeName }
                        : null,
                    refresh: !OvertimeTypeID.refresh
                }
            },
            checkShiftByProfile: {
                ...checkShiftByProfile,
                TimeFrom: {
                    ...checkShiftByProfile.TimeFrom,
                    value: item.TimeFrom ? moment(item.TimeFrom).format('YYYY-MM-DD HH:mm:ss') : null,
                    disable: false,
                    refresh: !TimeFrom.refresh
                },
                TimeTo: {
                    ...checkShiftByProfile.TimeTo,
                    value: item.TimeTo ? moment(item.TimeTo).format('YYYY-MM-DD HH:mm:ss') : null,
                    disable: false,
                    refresh: !TimeTo.refresh
                }
            },
            NoConfig: {
                ...NoConfig,
                RegisterHours: {
                    ...NoConfig.RegisterHours,
                    value: item.RegisterHours ? item.RegisterHours.toString() : null,
                    disable: false,
                    refresh: !RegisterHours.refresh
                },
                RegisterHoursConfig: {
                    ...NoConfig.RegisterHoursConfig,
                    disable: false,
                    //value,
                    refresh: !RegisterHoursConfig.refresh
                }
            },
            MethodPayment: {
                ...MethodPayment,
                data: dataMethodPayment,
                value: _valueMethodPayment,
                disable: false,
                refresh: !MethodPayment.refresh
            },
            BusinessUnitTypeID: {
                ...BusinessUnitTypeID,
                data: item.BusinessUnitTypeID
                    ? [{ ID: item.BusinessUnitTypeID, ShopGroupView: item.BusinessUnitTypeView }]
                    : [],
                value: item.BusinessUnitTypeID
                    ? { ID: item.BusinessUnitTypeID, ShopGroupView: item.BusinessUnitTypeView }
                    : null,
                disable: false,
                refresh: !BusinessUnitTypeID.refresh
            },
            BusinessUnitID: {
                ...BusinessUnitID,
                data: item.BusinessUnitID ? [{ ID: item.BusinessUnitID, ShopView: item.BusinessUnitView }] : [],
                value: item.BusinessUnitID ? { ID: item.BusinessUnitID, ShopView: item.BusinessUnitView } : null,
                disable: false,
                refresh: !BusinessUnitID.refresh
            },
            ReasonOT: {
                ...ReasonOT,
                value: item.ReasonOT,
                disable: false,
                refresh: !ReasonOT.refresh
            },
            RequestCancelReason: {
                ...RequestCancelReason,
                value: item.RequestCancelReason,
                disable: false,
                refresh: !RequestCancelReason.refresh
            },
            OvertimeReasonID: {
                ...OvertimeReasonID,
                value: item.OvertimeReasonID
                    ? { ID: item.OvertimeReasonID, OvertimeReasonName: item.OvertimeReasonName }
                    : null,
                refresh: !UserApproveID.refresh
            },
            IsOverTimeBreak: {
                ...IsOverTimeBreak,
                value: item.IsOverTimeBreak,
                disable: false,
                refresh: !IsOverTimeBreak.refresh
            },
            IsNotCheckInOut: {
                ...IsNotCheckInOut,
                value: item.IsNotCheckInOut,
                disable: false,
                refresh: !IsNotCheckInOut.refresh
            },
            AdvanceOverTimeInDay: {
                ...AdvanceOverTimeInDay,
                IsTripOTInDay: {
                    ...AdvanceOverTimeInDay.IsTripOTInDay,
                    value: item.OvertimeHour || item.HourTotal ? true : false,
                    OvertimeHour: {
                        ...AdvanceOverTimeInDay.IsTripOTInDay.OvertimeHour,
                        disable: false,
                        value: item.OvertimeHour ? item.OvertimeHour.toString() : '0',
                        refresh: !OvertimeHour.refresh
                    },
                    HourTotal: {
                        ...AdvanceOverTimeInDay.IsTripOTInDay.HourTotal,
                        disable: false,
                        value: item.HourTotal ? item.HourTotal.toString() : '0',
                        refresh: !HourTotal.refresh
                    }
                },
                IsRequestShuttleCar: {
                    ...AdvanceOverTimeInDay.IsRequestShuttleCar,
                    value: item.JobTypeID || item.Place ? true : false,
                    JobTypeID: {
                        ...AdvanceOverTimeInDay.IsRequestShuttleCar.JobTypeID,
                        disable: false,
                        value: item.JobTypeID ? { ID: item.JobTypeID, JobTypeName: item.JobTypeView } : null,
                        refresh: !JobTypeID.refresh
                    },
                    Place: {
                        ...AdvanceOverTimeInDay.IsRequestShuttleCar.Place,
                        disable: false,
                        value: item.Place,
                        refresh: !Place.refresh
                    },
                    RequestParking: {
                        ...AdvanceOverTimeInDay.IsRequestShuttleCar.RequestParking,
                        disable: false,
                        value: item.RequestParking,
                        refresh: !RequestParking.refresh
                    }
                },
                IsSignUpToEat: {
                    ...AdvanceOverTimeInDay.IsSignUpToEat,
                    value: item.IsSignUpToEat,
                    disable: false,
                    refresh: !IsSignUpToEat.refresh
                },
                IsRequestEntryExitGate: {
                    ...AdvanceOverTimeInDay.IsRequestEntryExitGate,
                    value: item.IsRequestEntryExitGate,
                    disable: false,
                    refresh: !IsRequestEntryExitGate.refresh
                },
                IsRequestForBenefit: {
                    ...AdvanceOverTimeInDay.IsRequestForBenefit,
                    value: item.IsRequestForBenefit,
                    disable: false,
                    refresh: !IsRequestForBenefit.refresh
                },
                SendToID: {
                    ...AdvanceOverTimeInDay.SendToID,
                    value: item.SendToID ? { ID: item.SendToID, WorkPlaceName: item.SendToView } : null,
                    disable: false,
                    refresh: !SendToID.refresh
                },
                OvertimeArea: {
                    ...AdvanceOverTimeInDay.OvertimeArea,
                    value: item.OvertimeArea,
                    disable: false,
                    refresh: !OvertimeArea.refresh
                }
            },
            FileAttach: {
                ...FileAttach,
                value: item.lstFileAttach,
                disable: false,
                refresh: !FileAttach.refresh
            },
            IsUnitAssistant: {
                ...IsUnitAssistant,
                value: item.IsUnitAssistant ? item.IsUnitAssistant : false
            },
            UserApproveID: {
                ...UserApproveID,
                value: item.UserApproveID ? { ID: item.UserApproveID, UserInfoName: item.UserApproveName1 } : null,
                refresh: !UserApproveID.refresh
            },
            UserApproveID2: {
                ...UserApproveID2,
                value: item.UserApproveID2 ? { ID: item.UserApproveID2, UserInfoName: item.UserApproveName2 } : null,
                refresh: !UserApproveID2.refresh
            },
            UserApproveID3: {
                ...UserApproveID3,
                value: item.UserApproveID3 ? { ID: item.UserApproveID3, UserInfoName: item.UserApproveName3 } : null,
                refresh: !UserApproveID3.refresh
            },
            UserApproveID4: {
                ...UserApproveID4,
                value: item.UserApproveID4 ? { ID: item.UserApproveID4, UserInfoName: item.UserApproveName4 } : null,
                refresh: !UserApproveID4.refresh
            }
        };

        if (configHighSupervisor && configHighSupervisor.LevelApprove > 0) {
            if (configHighSupervisor.IsChangeApprove != true) {
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
                    }
                };
            } else {
                nextState = {
                    ...nextState,
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
                    }
                };
            }
        }

        if (configAproveOverTimePlan) {
            this.levelApproveRequestCancelation = configAproveOverTimePlan;
            if (configAproveOverTimePlan == 2) {
                nextState = {
                    ...nextState,
                    UserApproveID3: {
                        ...nextState.UserApproveID3,
                        visible: false
                    },
                    UserApproveID4: {
                        ...nextState.UserApproveID4,
                        visible: false
                    }
                };
            } else if (configAproveOverTimePlan == 3) {
                nextState = {
                    ...nextState,
                    UserApproveID3: {
                        ...nextState.UserApproveID3,
                        visible: true
                    },
                    UserApproveID4: {
                        ...nextState.UserApproveID4,
                        visible: false
                    }
                };
            } else if (configAproveOverTimePlan == 4) {
                nextState = {
                    ...nextState,
                    UserApproveID3: {
                        ...nextState.UserApproveID3,
                        visible: true
                    },
                    UserApproveID4: {
                        ...nextState.UserApproveID4,
                        visible: true
                    }
                };
            }
        }

        this.setState(nextState, () => {
            if (callback1 && typeof callback1 === 'function') {
                callback1();
            }

            if (callback2 && typeof callback2 === 'function') {
                callback2();
            }

            if (getMethodPaymentConfigDefault && typeof getMethodPaymentConfigDefault === 'function') {
                getMethodPaymentConfigDefault();
            }

            this.GetHighSupervior();
            this.GetBusinessUnitType(item);
        });
    };
    //#endregion

    GetHighSupervior = () => {
        const {
            Profile,
            UserApproveID,
            UserApproveID2,
            UserApproveID3,
            UserApproveID4,
            WorkDate,
            DayType
        } = this.state;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetHighSupervisor', {
            ProfileID: Profile.ID,
            userSubmit: Profile.ID,
            type: 'E_REQUESTCANCEL_OVERTIMEPLAN',
            resource: {
                DateTypeCode: DayType.value ? DayType.value : null
            }
        }).then(result => {
            VnrLoadingSevices.hide();
            let nextState = {
                UserApproveID: { ...UserApproveID },
                UserApproveID2: { ...UserApproveID2 },
                UserApproveID3: { ...UserApproveID3 },
                UserApproveID4: { ...UserApproveID4 }
            };

            if (result.IsChangeApprove == true) this.levelApproveRequestCancelation = true;

            // if (result.MidSupervisorID)
            //     isSet = false;
            //nguoi duyet dau
            // var multiUserApproveID = $("#" + control1).data("kendoComboBox");
            // //ng duyet cuoi
            // var multiUserApproveID2 = $("#" + control2).data("kendoComboBox");
            // //ng duyet giữa
            // var multiUserApproveID3 = $("#" + control3).data("kendoComboBox");
            // //ng duyet kết tiếp
            // var multiUserApproveID4 = $("#" + control4).data("kendoComboBox");

            //truong hop chạy theo approve grade
            if (result.LevelApprove > 0) {
                this.levelApproveOT = result.LevelApprove;

                if (result.LevelApprove == 2) {
                    // Nếu 1 cấp duyệt thì 4 người duyệt là 1
                    if (result.IsOnlyOneLevelApprove == true) {
                        this.levelApproveOT = 1;
                        if (result.SupervisorID != null) {
                            // checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                            // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                            // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                            // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
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
                        }
                        if (result.MidSupervisorID != null) {
                            //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                            //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                            //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
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
                        }
                    }
                    //isShowEle('#idUserApproveID3');
                    nextState = {
                        ...nextState,
                        UserApproveID3: {
                            ...nextState.UserApproveID3,
                            visible: false
                        }
                    };
                } else if (result.LevelApprove == 3) {
                    if (result.SupervisorID != null) {
                        //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                            }
                        };
                    }
                    if (result.MidSupervisorID != null) {
                        //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                            }
                        };
                    }
                    if (result.NextMidSupervisorID != null) {
                        //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID)
                        //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID)
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }
                            },
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }
                            }
                        };
                    }
                    //isShowEle('#idUserApproveID3', true);
                    nextState = {
                        ...nextState,
                        UserApproveID3: {
                            ...nextState.UserApproveID3,
                            visible: true
                        }
                    };
                } else if (result.LevelApprove == 4) {
                    if (result.SupervisorID != null) {
                        //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                            }
                        };
                    }
                    if (result.MidSupervisorID != null) {
                        //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                            }
                        };
                    }
                    if (result.NextMidSupervisorID != null) {
                        //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID)
                        nextState = {
                            ...nextState,
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }
                            }
                        };
                    }
                    if (result.HighSupervisorID != null) {
                        //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID)
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                            }
                        };
                    }
                    // isShowEle('#idUserApproveID3', true);
                    // isShowEle('#idUserApproveID4', true);
                    nextState = {
                        ...nextState,
                        UserApproveID3: {
                            ...nextState.UserApproveID3,
                            visible: true
                        },
                        UserApproveID4: {
                            ...nextState.UserApproveID4,
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
                    // isReadOnlyComboBox($("#" + control1), false);
                    // isReadOnlyComboBox($("#" + control2), false);
                    // isReadOnlyComboBox($("#" + control3), false);
                    // isReadOnlyComboBox($("#" + control4), false);
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
            }

            //TH chạy không theo approve grade
            else if (result.LevelApprove == 0) {
                if (result.SupervisorID != null) {
                    //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID)
                    nextState = {
                        ...nextState,
                        UserApproveID: {
                            ...nextState.UserApproveID,
                            value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                        }
                    };
                } else {
                    // multiUserApproveID.refresh();
                    // multiUserApproveID.value(null);
                    nextState = {
                        ...nextState,
                        UserApproveID: {
                            ...nextState.UserApproveID,
                            value: null
                        }
                    };
                }
                if (result.HighSupervisorID != null) {
                    // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
                    // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
                    nextState = {
                        ...nextState,
                        UserApproveID2: {
                            ...nextState.UserApproveID2,
                            value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                        },
                        UserApproveID4: {
                            ...nextState.UserApproveID4,
                            value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                        }
                    };
                } else {
                    // multiUserApproveID2.refresh();
                    // multiUserApproveID2.value(null);
                    nextState = {
                        ...nextState,
                        UserApproveID2: {
                            ...nextState.UserApproveID2,
                            value: null
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
                } else if (WorkDate.value) {
                    // isReadOnlyComboBox($("#" + control1), false);
                    // isReadOnlyComboBox($("#" + control2), false);
                    // if (!isSet)
                    //     isReadOnlyComboBox($("#" + control3), false);
                    nextState = {
                        ...nextState,
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
                        }
                    };
                }

                if (result.IsChangeApprove == true) {
                    this.levelApproveRequestCancelation = true;
                }

                // Vinh.Mai Kiểm tra load người duyệt không theo chế độ duyệt
                if (this.checkByApprove && this.checkByApprove !== '') {
                    if (this.checkByApprove.Value1 == '3') {
                        this.levelApproveOT = 3;
                        // ND3 == ND4
                        // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
                        // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
                        // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                        // isShowEle('#idUserApproveID3', true);
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                visible: true,
                                value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                            },
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                            }
                        };
                    } else if (this.checkByApprove.Value1 == '1') {
                        // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                        // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                        // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                        nextState = {
                            ...nextState,
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
                    } else {
                        // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                        // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                        // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
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
                    }
                } else {
                    // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                    // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                    // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
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
                }
            }

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
        });
    };

    GetBusinessUnitType = item => {
        const { WorkDate, ProfileID } = item;

        if (WorkDate && ProfileID) {
            HttpService.Post('[URI_HR]/Att_GetData/GetBusinessUnitType', {
                ProfileID: ProfileID,
                WorkDate: moment(WorkDate).format('YYYY-MM-DD 00:00:00')
            }).then(data => {
                this.GetBusinessUnit(data, item);
                //var _BusinessUnitType = $('#BusinessUnitTypeID').data('kendoDropDownList');
                // if (data) {
                //   //_BusinessUnitType.setDataSource(data);
                //   // if (data.length == 1) {
                //   //     var businessUnitType = { ShopGroupView: data[0]['ShopGroupView'], ID: data[0]['ID'] };
                //   //     checkAddDatasource($(frm + ' #BusinessUnitTypeID').data('kendoDropDownList'), businessUnitType, "ID", data[0]['ID']);
                //   // }
                // }
                // else {
                //   //_BusinessUnitType.setDataSource([]);

                // }
            });
        }
    };

    GetBusinessUnit = (data, item) => {
        const { WorkDate, ProfileID } = item,
            { BusinessUnitTypeID, BusinessUnitID } = this.state;

        let nextState = {
                BusinessUnitTypeID: {
                    ...BusinessUnitTypeID,
                    data: data ? [...data] : [],
                    value: data.length == 1 ? { ShopGroupView: data[0]['ShopGroupView'], ID: data[0]['ID'] } : null,
                    refresh: !BusinessUnitTypeID.refresh
                }
            },
            _businessUnitTypeID = data.length == 1 ? data[0]['ID'] : null;

        HttpService.Post('[URI_HR]/Att_GetData/GetBusinessUnit', {
            ProfileID: ProfileID,
            WorkDate: moment(WorkDate).format('YYYY-MM-DD 00:00:00'),
            businessUnitTypeID: _businessUnitTypeID,
            isChangUnitType: true
        }).then(res => {
            if (res) {
                nextState = {
                    ...nextState,
                    BusinessUnitID: {
                        ...BusinessUnitID,
                        data: res ? [...res] : [],
                        value: res.length == 1 ? { ShopView: res[0]['ShopName'], ID: res[0]['ID'] } : null,
                        refresh: !BusinessUnitID.refresh
                    }
                };
            }

            this.setState(nextState);
            // var _BusinessUnit = $('#BusinessUnitID').data('kendoDropDownList');
            // _BusinessUnit.setDataSource([]);
            // _BusinessUnit.value(null);
            // _BusinessUnit.refresh();
            // if (data != null) {
            //   _BusinessUnit.setDataSource(data);
            //   if (data.length == 1) {
            //     var businessUnit = { ShopView: data[0]['ShopName'], ID: data[0]['ID'] };
            //     checkAddDatasource($(frm + ' #BusinessUnitID').data('kendoDropDownList'), businessUnit, "ID", data[0]['ID']);
            //   }
            // }
            // else {
            //   _BusinessUnit.setDataSource([]);
            // }
        });
    };

    //picked duyệt đầu
    onChangeUserApproveID = item => {
        const { UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4 } = this.state;
        let nextState = {
            UserApproveID: {
                ...UserApproveID,
                value: item,
                refresh: !UserApproveID.refresh
            }
        };

        // var user1 = $("#UserApproveID").data("kendoComboBox");
        // var user2 = $("#UserApproveID2").data("kendoComboBox");
        // var user3 = $("#UserApproveID3").data("kendoComboBox");
        // var user4 = $("#UserApproveID4").data("kendoComboBox");
        //nếu 1 cấp duyệt mới chạy
        if (this.levelApproveOT == 1 || (this.isModify && this.levelApproveOTPlan == 1)) {
            //ẩn 3,4
            // isShowEle('#divMidApprove');
            // isShowEle('#divMidNextApprove');

            nextState = {
                ...nextState,
                UserApproveID3: {
                    ...UserApproveID3,
                    visible: false
                },
                UserApproveID4: {
                    ...UserApproveID4,
                    visible: false
                }
            };

            if (item) {
                nextState = {
                    ...nextState,
                    UserApproveID2: {
                        ...UserApproveID2,
                        value: item,
                        refresh: !UserApproveID2.refresh
                    },
                    UserApproveID3: {
                        ...nextState.UserApproveID3,
                        value: item,
                        refresh: !UserApproveID2.refresh
                    },
                    UserApproveID4: {
                        ...nextState.UserApproveID4,
                        value: item,
                        refresh: !UserApproveID2.refresh
                    }
                };
            }

            //_data1 = user1.dataSource.data();
            // if (false) {
            //     // user2.value([]);
            //     // user3.value([]);
            //     // user4.value([]);
            // }
            // else {
            //     _data1.forEach(function (item) {
            //         if (item.ID == user1.value()) {
            //             checkAddDatasource(user2, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
            //             checkAddDatasource(user3, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
            //             checkAddDatasource(user4, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
            //         }
            //     });

            // }
        }

        this.setState(nextState);
    };

    //picked duyệt cuối
    onChangeUserApproveID2 = item => {
        const { UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4 } = this.state;
        let nextState = {
            UserApproveID2: {
                ...UserApproveID2,
                value: item,
                refresh: !UserApproveID2.refresh
            }
        };

        if (this.levelApproveOT == 1 || (this.isModify && this.levelApproveOTPlan == 1)) {
            //ẩn 3,4
            // isShowEle('#divMidApprove');
            // isShowEle('#divMidNextApprove');

            nextState = {
                ...nextState,
                UserApproveID3: {
                    ...UserApproveID3,
                    visible: false
                },
                UserApproveID4: {
                    ...UserApproveID4,
                    visible: false
                }
            };

            // //set duyệt 2,3,4 = 1
            // var user1 = $("#UserApproveID").data("kendoComboBox"),
            //     user2 = $("#UserApproveID2").data("kendoComboBox"),
            //     user3 = $("#UserApproveID3").data("kendoComboBox"),
            //     user4 = $("#UserApproveID4").data("kendoComboBox"),
            //     _data2 = user2.dataSource.data();
            // if (user2.value().length == 0) {
            //     user1.value([]);
            //     user3.value([]);
            //     user4.value([]);
            // }
            // else {
            //     _data2.forEach(function (item) {
            //         if (item.ID == user2.value()) {
            //             checkAddDatasource(user1, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
            //             checkAddDatasource(user3, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
            //             checkAddDatasource(user4, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
            //         }
            //     });
            // }

            if (item) {
                nextState = {
                    ...nextState,
                    UserApproveID: {
                        ...UserApproveID,
                        value: item,
                        refresh: !UserApproveID.refresh
                    },
                    UserApproveID3: {
                        ...nextState.UserApproveID3,
                        value: item,
                        refresh: !UserApproveID3.refresh
                    },
                    UserApproveID4: {
                        ...nextState.UserApproveID4,
                        value: item,
                        refresh: !UserApproveID4.refresh
                    }
                };
            }
        } else if (this.levelApproveOT == 2 || (this.isModify && this.levelApproveOTPlan == 2)) {
            // var user1 = $("#UserApproveID").data("kendoComboBox"),
            //     user2 = $("#UserApproveID2").data("kendoComboBox"),
            //     user3 = $("#UserApproveID3").data("kendoComboBox"),
            //     user4 = $("#UserApproveID4").data("kendoComboBox"),
            //     _data2 = user2.dataSource.data();
            // if (user2.value().length == 0) {
            //     user3.value([]);
            //     user4.value([]);
            // }
            // else {
            //     _data2.forEach(function (item) {
            //         if (item.ID == user2.value()) {
            //             checkAddDatasource(user3, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
            //             checkAddDatasource(user4, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
            //         }
            //     });
            // }
            if (item) {
                nextState = {
                    ...nextState,
                    UserApproveID3: {
                        ...UserApproveID3,
                        value: item,
                        refresh: !UserApproveID3.refresh
                    },
                    UserApproveID4: {
                        ...UserApproveID4,
                        value: item,
                        refresh: !UserApproveID4.refresh
                    }
                };
            }
        } else if (this.levelApproveOT == 3 || (this.isModify && this.levelApproveOTPlan == 3)) {
            // var user1 = $("#UserApproveID").data("kendoComboBox"),
            //     user2 = $("#UserApproveID2").data("kendoComboBox"),
            //     user3 = $("#UserApproveID3").data("kendoComboBox"),
            //     user4 = $("#UserApproveID4").data("kendoComboBox"),
            //     _data2 = user2.dataSource.data();
            // if (user2.value().length == 0) {
            //     user4.value([]);
            // }
            // else {
            //     _data2.forEach(function (item) {
            //         if (item.ID == user2.value()) {
            //             checkAddDatasource(user4, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
            //         }
            //     });
            // }
            if (item) {
                nextState = {
                    ...nextState,
                    UserApproveID4: {
                        ...UserApproveID4,
                        value: item,
                        refresh: !UserApproveID4.refresh
                    }
                };
            }
        }

        this.setState(nextState);
    };

    readOnlyCtrlOT = isReadOnly => {
        const {
                ShiftID,
                DurationType,
                divOvertimeTypeID,
                AdvanceOverTimeInDay,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4,
                WorkDate,
                checkShiftByProfile,
                NoConfig,
                MethodPayment,
                ReasonOT
            } = this.state,
            { OvertimeTypeID } = divOvertimeTypeID,
            { IsRequestShuttleCar } = AdvanceOverTimeInDay,
            { JobTypeID } = IsRequestShuttleCar,
            { TimeFrom, TimeTo } = checkShiftByProfile,
            { RegisterHours } = NoConfig;

        let nextState = {
            ShiftID: {
                ...ShiftID,
                disable: this.isModify ? true : isReadOnly,
                refresh: !ShiftID.refresh
            },

            DurationType: {
                ...DurationType,
                disable: isReadOnly,
                refresh: !DurationType.refresh
            },
            divOvertimeTypeID: {
                ...divOvertimeTypeID,
                OvertimeTypeID: {
                    ...OvertimeTypeID,
                    disable: isReadOnly,
                    refresh: !OvertimeTypeID.refresh
                }
            },
            AdvanceOverTimeInDay: {
                ...AdvanceOverTimeInDay,
                IsRequestShuttleCar: {
                    ...AdvanceOverTimeInDay.IsRequestShuttleCar,
                    JobTypeID: {
                        ...AdvanceOverTimeInDay.IsRequestShuttleCar.JobTypeID,
                        disable: isReadOnly,
                        refresh: !JobTypeID.refresh
                    }
                }
            },
            checkShiftByProfile: {
                ...checkShiftByProfile,
                TimeFrom: {
                    ...TimeFrom,
                    disable: isReadOnly,
                    refresh: !TimeFrom.refresh
                },
                TimeTo: {
                    ...TimeTo,
                    disable: isReadOnly,
                    refresh: !TimeTo.refresh
                }
            },
            MethodPayment: {
                ...MethodPayment,
                disable: isReadOnly,
                refresh: !MethodPayment.refresh
            },
            NoConfig: {
                ...NoConfig,
                RegisterHours: {
                    ...RegisterHours,
                    disable: isReadOnly,
                    refresh: !RegisterHours.refresh
                }
            },
            ReasonOT: {
                ...ReasonOT,
                disable: isReadOnly,
                refresh: !ReasonOT.refresh
            }
        };

        if (isReadOnly) {
            nextState = {
                ...nextState,
                UserApproveID: {
                    ...UserApproveID,
                    disable: isReadOnly,
                    refresh: !UserApproveID.refresh
                },
                UserApproveID2: {
                    ...UserApproveID2,
                    disable: isReadOnly,
                    refresh: !UserApproveID2.refresh
                },
                UserApproveID3: {
                    ...UserApproveID3,
                    disable: isReadOnly,
                    refresh: !UserApproveID3.refresh
                },
                UserApproveID4: {
                    ...UserApproveID4,
                    disable: isReadOnly,
                    refresh: !UserApproveID4.refresh
                }
            };
        } else if (this.levelApproveRequestCancelation) {
            nextState = {
                ...nextState,
                UserApproveID: {
                    ...UserApproveID,
                    disable: isReadOnly,
                    refresh: !UserApproveID.refresh
                },
                UserApproveID2: {
                    ...UserApproveID2,
                    disable: isReadOnly,
                    refresh: !UserApproveID2.refresh
                },
                UserApproveID3: {
                    ...UserApproveID3,
                    disable: isReadOnly,
                    refresh: !UserApproveID3.refresh
                },
                UserApproveID4: {
                    ...UserApproveID4,
                    disable: isReadOnly,
                    refresh: !UserApproveID4.refresh
                }
            };
        }

        if (this.isModify) {
            nextState = {
                ...nextState,
                WorkDate: {
                    ...WorkDate,
                    disable: true
                }
            };
        }

        return nextState;
    };

    closeModal = () => {
        let nextState = {
            modalLimit: {
                isModalVisible: false,
                data: []
            }
        };

        this.setState(nextState);
    };

    viewListItemLimit = () => {
        const { modalLimit } = this.state,
            { data } = modalLimit,
            { itemContent, textLableInfo } = styleScreenDetail;

        return data.map((item, index) => {
            return (
                <View key={index} style={{ ...CustomStyleSheet.paddingVertical(10), ...CustomStyleSheet.marginHorizontal(10) }}>
                    <View style={itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, textLableInfo]}
                                i18nKey={'HRM_Attendance_Overtime_TypeLimit'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            <VnrText value={item['TypeLimit']} />
                        </View>
                    </View>
                    <View style={itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, textLableInfo]}
                                i18nKey={'HRM_Attendance_Overtime_OvertimeList_CodeEmp'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            <VnrText value={item['CodeEmp']} />
                        </View>
                    </View>
                    <View style={itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, textLableInfo]}
                                i18nKey={'HRM_Attendance_Overtime_OvertimeList_ProfileName'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            <VnrText value={item['ProfileName']} />
                        </View>
                    </View>
                    <View style={itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, textLableInfo]}
                                i18nKey={'HRM_Attendance_Overtime_TotalOvertimeCumulative'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            <VnrText value={Vnr_Function.mathRoundNumber(item['TotalOvertimeCumulative'])} />
                        </View>
                    </View>
                </View>
            );
        });
    };

    onSave = (navigation, isCreate, isSend) => {

        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        const {
                ID,
                RecordID,
                Profile,
                WorkDate,
                ShiftID,
                DurationType,
                divOvertimeTypeID,
                checkShiftByProfile,
                NoConfig,
                MethodPayment,
                FileAttach,
                ReasonOT,
                OvertimeReasonID,
                IsUnitAssistant,
                UserApproveID,
                UserApproveID3,
                UserApproveID4,
                UserApproveID2,
                AdvanceOverTimeInDay,
                modalErrorDetail
            } = this.state,
            { OvertimeTypeID } = divOvertimeTypeID,
            { TimeFrom, TimeTo } = checkShiftByProfile,
            { RegisterHours } = NoConfig,
            {
                IsTripOTInDay,
                IsRequestShuttleCar,
                IsSignUpToEat,
                IsRequestEntryExitGate,
                IsRequestForBenefit,
                SendToID,
                OvertimeArea
            } = AdvanceOverTimeInDay,
            { OvertimeHour, HourTotal } = IsTripOTInDay,
            { JobTypeID, Place, RequestParking } = IsRequestShuttleCar,
            { apiConfig } = dataVnrStorage,
            { uriPor } = apiConfig;

        let param = {
            FileAttach: FileAttach.value ? FileAttach.value.map(item => item.fileName).join(',') : null,
            IsReceiveOvertimeBonusOrg: this.IsReceiveOvertimeBonusOrg,
            IsConfirmPreg: this.IsConfirmPreg,
            IsConfirmLimit: this.IsConfirmLimit,
            IsConfirmSaveContinue: this.IsConfirmSaveContinue,
            IsconfirmPregContinue: this.IsconfirmPregContinue,
            RequestParking: RequestParking.value,
            RegisterHours: RegisterHours.value,
            Status: 'E_SUBMIT',
            OvertimeHour: OvertimeHour.value,
            HourTotal: HourTotal.value,
            IsOverTimeBreak: null,
            IsUnitAssistant: IsUnitAssistant.value,
            IsNotCheckInOut: false,
            IsMealRegistration: false,
            IsCarRegistration: false,
            IsTripOTInDay: IsTripOTInDay.value,
            IsRequestForBenefit: IsRequestForBenefit.value,
            IsSignUpToEat: IsSignUpToEat.value,
            IsRequestEntryExitGate: IsRequestEntryExitGate.value,
            ReasonOT: ReasonOT.value,
            OvertimeReasonID: OvertimeReasonID.value ? OvertimeReasonID.value.ID : null,
            Place: Place.value,
            OvertimeArea: OvertimeArea.value,
            TimeFrom: TimeFrom.value ? moment(TimeFrom.value).format('HH:mm') : null,
            TimeTo: TimeTo.value ? moment(TimeTo.value).format('HH:mm') : null,
            WorkDate: WorkDate.value ? moment(WorkDate.value).format('YYYY-MM-DD HH:mm:ss') : null,
            ShiftID: ShiftID.value ? ShiftID.value.ID : null,
            DurationType: DurationType.value ? DurationType.value.Value : null,
            OvertimeTypeID: OvertimeTypeID.value ? OvertimeTypeID.value.ID : null,
            RegisterHoursConfig: RegisterHours.value,
            MenuID: null,
            FoodID: null,
            Menu2ID: null,
            Food2ID: null,
            OvertimePlaceID: null,
            MethodPayment: MethodPayment.value ? MethodPayment.value.Value : null,
            JobTypeID: JobTypeID.value ? JobTypeID.value.ID : null,
            SendToID: SendToID.value ? SendToID.value.ID : null,
            ProfileID: Profile.ID,
            // UserApproveID: UserApproveID.value ? UserApproveID.value.ID : null,
            // UserApproveID3: UserApproveID3.value ? UserApproveID3.value.ID : null,
            // UserApproveID4: UserApproveID4.value ? UserApproveID4.value.ID : null,
            // UserApproveID2: UserApproveID2.value ? UserApproveID2.value.ID : null,
            IsPortal: true,
            UserSubmit: Profile.ID,
            Host: uriPor,
            UserRegister: dataVnrStorage.currentUser.info.userid,
            ProfileRemoveIDs: this.ProfileRemoveIDs,
            IsRemoveAndContinue: this.IsRemoveAndContinue,
            CacheID: this.CacheID,
            IsContinueSave: this.IsContinueSave,
            IsAddNewAndSendMail: isSend,
            FunctionType: 'E_OVERTIMEPLAN'
        };

        const { screenName } = this.props.navigation.state.params;

        if (screenName == 'AttSubmitPlanOvertime') {
            // Yêu cầu hủy
            param = {
                ...param,
                RecordID: ID,
                ID: null,
                UserApproveID: UserApproveID.value ? UserApproveID.value.ID : null,
                UserApproveID2: UserApproveID3.value ? UserApproveID3.value.ID : null,
                UserApproveID3: UserApproveID4.value ? UserApproveID4.value.ID : null,
                UserApproveID4: UserApproveID2.value ? UserApproveID2.value.ID : null
            };
        } else {
            // Chỉnh sửa
            param = {
                ...param,
                RecordID,
                ID,
                UserApproveID: UserApproveID.value ? UserApproveID.value.ID : null,
                UserApproveID2: UserApproveID3.value ? UserApproveID3.value.ID : null,
                UserApproveID3: UserApproveID4.value ? UserApproveID4.value.ID : null,
                UserApproveID4: UserApproveID2.value ? UserApproveID2.value.ID : null
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Att_RequestCancelation', param).then(data => {
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
                            onCancel: () => { },
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
                            onCancel: () => { },
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
                        onCancel: () => { },
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
                    onCancel: () => { },
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
                    onCancel: () => { },
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
                    onCancel: () => { },
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
                    onCancel: () => { },
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
                    onCancel: () => { },
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
                    onCancel: () => { },
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
                    onCancel: () => { },
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
                    onCancel: () => { },
                    onConfirm: () => { }
                });
            } else if (data.IsconfirmPregContinue == true && data.IsConfirmPreg == false) {
                let _content = translate('Employee') + data.ActionStatus;
                AlertSevice.alert({
                    title: translate('Hrm_Notification'),
                    icon: `${Platform.OS === 'ios' ? 'ios-' : 'md-'}checkmark-circle`,
                    iconColor: Colors.danger,
                    message: _content,
                    onCancel: () => { },
                    onConfirm: () => {
                        this.IsconfirmPregContinue = true;
                        this.onSave(navigation, isCreate, isSend);
                    }
                });
            } else if (typeof data.ActionStatus == 'string') {
                ToasterSevice.showWarning(data.ActionStatus);
            }
        });
    };

    onSaveAndSend = navigation => {
        this.onSave(navigation, null, true);
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
                                    ...CustomStyleSheet.marginBottom(10)
                                }
                            ]}
                        >
                            <VnrText
                                style={[styleSheets.text, { ...CustomStyleSheet.fontWeight('500'), ...CustomStyleSheet.color(Colors.primary) }]}
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

    //change ngày công
    onChangeWorkDate = item => {
        const { WorkDate, Profile, checkShiftByProfile } = this.state,
            { TimeFrom, TimeTo } = checkShiftByProfile;
        let nextState = {
            WorkDate: {
                ...WorkDate,
                value: item,
                refresh: !WorkDate.refresh
            }
        };

        this.setState(nextState, () => {
            let pro = Profile.ID,
                _workDate = item ? moment(item).format('YYYY-MM-DD HH:mm:ss') : null;

            if (_workDate) {
                this.GetShiftByProfileIDAndWorkDate(pro, _workDate);

                this.GetOvertimeTypeByDate();

                this.GetOvertimeDurationTypeByDate(pro, _workDate);

                let timeStart = TimeFrom.value ? moment(TimeFrom.value).format('HH:mm') : null,
                    timeEnd = TimeTo.value ? moment(TimeTo.value).format('HH:mm') : null;
                this.OnChangeHighSupervisorPlan(timeStart, timeEnd);
            }
        });
    };

    GetShiftByProfileIDAndWorkDate = (pro, _workDate) => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetShiftByProfileIDAndWorkDate', {
            ProfileID: pro,
            WorkDate: _workDate,
            IsLoadShift: false
        }).then(data => {
            VnrLoadingSevices.hide();
            const { ShiftID, DayType } = this.state;
            if (data != '') {
                //_ShiftData.value(data[0].ID);
                if (data[0]) {
                    let _value = { ID: data[0].ID, ShiftName: data[0].Code + ' - ' + data[0].ShiftName };
                    this.setState({
                        ShiftID: {
                            ...ShiftID,
                            value: _value,
                            refresh: !ShiftID.refresh
                        },
                        DayType: {
                            ...DayType,
                            value: data[0].DataType,
                            visible: true,
                            refresh: !DayType.refresh
                        }
                    });
                }
            } else {
                //_ShiftData.value(null);
                this.setState({
                    ShiftID: {
                        ...ShiftID,
                        value: null,
                        refresh: !ShiftID.refresh
                    },
                    DayType: {
                        ...DayType,
                        value: 'OFF',
                        visible: true,
                        refresh: !DayType.refresh
                    }
                });
            }
        });
    };

    GetOvertimeDurationTypeByDate = (pro, _workDate) => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetOvertimeDurationTypeByDate', {
            ProfileID: pro,
            WorkDate: _workDate,
            IsPortal: true
        }).then(data => {
            VnrLoadingSevices.hide();
            const { DurationType } = this.state;
            let dataSource = [],
                nextState = {};

            for (let i = 0; i < data.length; i++) {
                dataSource.push({ Text: data[i].Translate, Value: data[i].Name });
            }

            if (dataSource.length == 1) {
                nextState = {
                    DurationType: {
                        ...DurationType,
                        data: dataSource,
                        value: dataSource[0],
                        refresh: !DurationType.refresh
                    }
                };
            } else {
                nextState = {
                    DurationType: {
                        ...DurationType,
                        data: dataSource,
                        value: null,
                        refresh: !DurationType.refresh
                    }
                };
            }

            this.setState(nextState, () => {
                //thêm xử lý 03/12/2019 task 110859
                this.GetOvertimeDurationTypeDetailByDate(pro, _workDate);
            });
        });
    };

    onChangeListRegisterHours(RegisterHoursConfigVal) {
        const { NoConfig } = this.state,
            { RegisterHours } = NoConfig;

        this.setState(
            {
                NoConfig: {
                    ...NoConfig,
                    RegisterHours: {
                        ...RegisterHours,
                        value: RegisterHoursConfigVal,
                        refresh: !RegisterHours.refresh
                    }
                }
            },
            () => this.UpdateEndOT(false)
        );
    }

    UpdateStartOT = isChangeByTimeOut => {
        const { ShiftID, DurationType, NoConfig, WorkDate, checkShiftByProfile } = this.state,
            { RegisterHours } = NoConfig,
            { TimeFrom, TimeTo } = checkShiftByProfile;
        let _durationType = DurationType.value ? DurationType.value.Value : null,
            workdateRoot = this.formatDate(WorkDate.value),
            timeFrom = this.formatTime(TimeFrom.value),
            timeTo = this.formatTime(TimeTo.value);

        if (ShiftID.value && ShiftID.value.ID) {
            HttpService.Post('[URI_HR]/Att_GetData/UpdateStartOT', {
                timeStart: timeFrom, //$('input[ng-model=TimeFrom]').val(),
                timeEnd: timeTo, //$('input[ng-model=TimeTo]').val(),
                RegisterHours: RegisterHours.value, //$('input[ng-model=RegisterHours]').val(),
                ShiftID: ShiftID.value.ID,
                DurationType: _durationType,
                WorkdateRoot: workdateRoot,
                IsOverTimeBreak: false, //$('#IsOverTimeBreak').is(':checked'),
                IsChangeByTimeOut: !isChangeByTimeOut ? false : isChangeByTimeOut
            }).then(data => {
                if (data == 'WaringRegisterHourGreaterThanTimeBreak') {
                    //Toaster(_parambreak, 'error', false);
                    ToasterSevice.showWarning('WaringRegisterHourGreaterThanTimeBreak');
                } else if (data == 'WaringRegisterHourGreaterThanTimeWithinShift') {
                    //Toaster(data, 'error', true);
                    ToasterSevice.showWarning('WaringRegisterHourGreaterThanTimeWithinShift');
                } else if (_durationType == 'E_OT_EARLY') {
                    if (data.indexOf('|') == 5) {
                        let strDate = data.split('|');
                        // $('input[ng-model=TimeFrom]').val(strDate[0]);
                        // $('input[ng-model=TimeTo]').val(strDate[1]);
                        this.setState(
                            {
                                checkShiftByProfile: {
                                    ...checkShiftByProfile,
                                    TimeFrom: {
                                        ...TimeFrom,
                                        value: strDate[0]
                                            ? moment().format('YYYY-MM-DD ' + strDate[0] + ':00')
                                            : null,
                                        refresh: !TimeFrom.refresh
                                    },
                                    TimeTo: {
                                        ...TimeTo,
                                        value: strDate[1]
                                            ? moment().format('YYYY-MM-DD ' + strDate[1] + ':00')
                                            : null,
                                        refresh: !TimeTo.refresh
                                    }
                                }
                            },
                            () => this.OnChangeHighSupervisorPlan(strDate[0], strDate[1])
                        );
                    }
                } else if (_durationType == 'E_OT_BREAK_AFTER' || _durationType == 'E_OT_BREAK_BEFORE') {
                    if (data.indexOf('|') != -1) {
                        let strDate = data.split('|');
                        // $('input[ng-model=TimeFrom]').val(strDate[0]);
                        // $('input[ng-model=TimeTo]').val(strDate[1]);

                        // $('input[ng-model=RegisterHours]').data('kendoNumericTextBox').value(strDate[2]);
                        // this.OnChangeHighSupervisorPlan(strDate[0], strDate[1]);

                        this.setState(
                            {
                                NoConfig: {
                                    ...NoConfig,
                                    RegisterHours: {
                                        ...RegisterHours,
                                        value: strDate[2],
                                        refresh: !RegisterHours.refresh
                                    }
                                },
                                checkShiftByProfile: {
                                    ...checkShiftByProfile,
                                    TimeFrom: {
                                        ...TimeFrom,
                                        value: strDate[0]
                                            ? moment().format('YYYY-MM-DD ' + strDate[0] + ':00')
                                            : null,
                                        refresh: !TimeFrom.refresh
                                    },
                                    TimeTo: {
                                        ...TimeTo,
                                        value: strDate[1]
                                            ? moment().format('YYYY-MM-DD ' + strDate[1] + ':00')
                                            : null,
                                        refresh: !TimeTo.refresh
                                    }
                                }
                            },
                            () => this.OnChangeHighSupervisorPlan(strDate[0], strDate[1])
                        );
                    }
                } else if (data.indexOf('|') == 5) {
                    let strDate = data.split('|');
                    // $('input[ng-model=TimeFrom]').val(strDate[0]);
                    // $('input[ng-model=TimeTo]').val(strDate[1]);
                    // this.OnChangeHighSupervisorPlan(strDate[0], strDate[1]);
                    this.setState(
                        {
                            checkShiftByProfile: {
                                ...checkShiftByProfile,
                                TimeFrom: {
                                    ...TimeFrom,
                                    value: strDate[0]
                                        ? moment().format('YYYY-MM-DD ' + strDate[0] + ':00')
                                        : null,
                                    refresh: !TimeFrom.refresh
                                },
                                TimeTo: {
                                    ...TimeTo,
                                    value: strDate[1]
                                        ? moment().format('YYYY-MM-DD ' + strDate[1] + ':00')
                                        : null,
                                    refresh: !TimeTo.refresh
                                }
                            }
                        },
                        () => this.OnChangeHighSupervisorPlan(strDate[0], strDate[1])
                    );
                } else {
                    // $('input[ng-model=TimeFrom]').val($('input[ng-model=TimeFrom]').val());
                    // $('input[ng-model=TimeTo]').val(data);
                    // this.OnChangeHighSupervisorPlan($('input[ng-model=TimeFrom]').val(), data);
                    this.setState(
                        {
                            checkShiftByProfile: {
                                ...checkShiftByProfile,
                                TimeFrom: {
                                    ...TimeFrom,
                                    value: timeFrom ? moment().format('YYYY-MM-DD ' + timeFrom + ':00') : null,
                                    refresh: !TimeFrom.refresh
                                },
                                TimeTo: {
                                    ...TimeTo,
                                    value: data ? moment().format('YYYY-MM-DD ' + data + ':00') : null,
                                    refresh: !TimeTo.refresh
                                }
                            }
                        },
                        () => this.OnChangeHighSupervisorPlan(timeFrom, data)
                    );
                }
            });
        }
    };

    UpdateEndOT = (isRegister, isChangeByTimeOut) => {
        const { ShiftID, DurationType, NoConfig } = this.state,
            { RegisterHours } = NoConfig;

        let _durationType = DurationType.value ? DurationType.value.Value : null;

        if (isRegister != false && ShiftID.value && ShiftID.value.ID) {
            this.ComputeResgistHourOrEndHourtOT(
                _durationType,
                RegisterHours.value,
                ShiftID.value.ID,
                isChangeByTimeOut
            );
        } else {
            this.UpdateStartOT(isChangeByTimeOut);
        }
    };

    GetOvertimeDurationTypeDetailByDate = (pro, _workDate) => {
        HttpService.Post('[URI_HR]/Att_GetData/GetOvertimeDurationTypeDetailByDate', {
            ProfileID: pro,
            WorkDate: _workDate
        }).then(res => {
            if (res) {
                const { DurationType } = this.state;
                this.setState(
                    {
                        DurationType: {
                            ...DurationType,
                            value: res,
                            refresh: !DurationType.refresh
                        }
                    },
                    () => {
                        let nextState = this.readOnlyCtrlOT(false);
                        this.setState(nextState);
                    }
                );
            } else {
                let nextState = this.readOnlyCtrlOT(false);
                this.setState(nextState);
            }
        });
    };

    GetOvertimeTypeByDate = () => {
        const {
                WorkDate,
                Profile,
                checkShiftByProfile,
                divOvertimeTypeID,
                MethodPayment
            } = this.state,
            { OvertimeTypeID } = divOvertimeTypeID,
            { TimeFrom, TimeTo } = checkShiftByProfile;

        let _profileID = Profile.ID,
            _wordate = this.formatDate(WorkDate.value),
            _TempShiftID = null, //$(frm + ' #TempShiftID').val(),
            //Diep.Ho-20210112:122889 Xử lý load phương thức thanh toán theo Loại tăng ca
            _OvertimeTypeID = OvertimeTypeID.value, //$(frm + ' #OvertimeTypeID').val();
            timeFrom = TimeFrom.value ? moment(TimeFrom.value).format('HH:mm') : null,
            timeTo = TimeTo.value ? moment(TimeTo.value).format('HH:mm') : null;

        if (_wordate) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/GetOvertimeTypeByDate', {
                ProfileID: _profileID,
                WorkDate: _wordate,
                ShiftID: _TempShiftID,
                OvertimeTypeID: _OvertimeTypeID,
                timeStart: timeFrom, //$(frm + ' input.TimeFrom').val(),
                timeEnd: timeTo //$(frm + ' input.TimeTo').val()
            }).then(data => {
                VnrLoadingSevices.hide();
                let nextState = {};
                if (data[0] != null) {
                    if (this.AllowOvertimeType != true) {
                        //$('#OvertimeType').addClass('hide');
                        // nextState = {
                        //     ...nextState,
                        //     divOvertimeTypeID: {
                        //         ...divOvertimeTypeID,
                        //         visible: false
                        //     }
                        // }
                    } else if (this.AllowOvertimeType && this.AllowOvertimeType[0]) {
                        nextState = {
                            ...nextState,
                            divOvertimeTypeID: {
                                ...divOvertimeTypeID,
                                OvertimeTypeID: {
                                    ...OvertimeTypeID,
                                    value: this.AllowOvertimeType[0],
                                    refresh: !OvertimeTypeID.refresh
                                }
                            }
                        };

                    }
                    // $.ajax({
                    //     type: 'POST',
                    //     url: uriHr + 'Att_GetData/GetAllowOvertimeType',
                    //     data: {},
                    //     success: function (data1) {
                    //         if (data1 != true) {
                    //             $('#OvertimeType').addClass('hide');
                    //         } else {
                    //             var OvertimeTypeID = $('#OvertimeTypeID').data("kendoDropDownList");
                    //             OvertimeTypeID.value(data1[0]);
                    //         }
                    //     }
                    // });
                }
                if (data[1] != null) {
                    // let _methodPayment = $('#MethodPayment').data("kendoDropDownList");
                    // _methodPayment.setDataSource(data[1]);
                    // _methodPayment.value((data[1])[0].Value);
                    nextState = {
                        ...nextState,
                        MethodPayment: {
                            ...MethodPayment,
                            data: data[1],
                            value: data[1][0],
                            refresh: !MethodPayment.refresh
                        }
                    };

                    // var readSRegisterHours = $(frm + ' input[ng-model=RegisterHours]').data('kendoNumericTextBox');
                    // if (!readSRegisterHours)
                    //     readSRegisterHours = $(frm + ' input[ng-model=RegisterHours]').kendoNumericTextBox({}).data('kendoNumericTextBox');

                    if (data[2] != null) {
                        //_methodPayment.readonly(data[2]);
                        nextState = {
                            ...nextState,
                            MethodPayment: {
                                ...nextState.MethodPayment,
                                disable: data[2]
                            }
                        };
                    } else {
                        //_methodPayment.readonly(false);
                        nextState = {
                            ...nextState,
                            MethodPayment: {
                                ...nextState.MethodPayment,
                                disable: false
                            }
                        };
                    }
                }
                // else {
                //     $.ajax({
                //         type: 'POST',
                //         url: uriPor + '/New_Att_Overtime/GetMultiMethodPayment',
                //         data: {},
                //         success: function (data1) {
                //             var _methodPayment = $('#MethodPayment').data("kendoDropDownList");
                //             _methodPayment.setDataSource(data1);
                //             _methodPayment.value(null);
                //         }
                //     });
                // }

                this.setState(nextState);
            });
        } else {
            //Toaster('HRM_Format_DDMMYY', 'warning', true);
            ToasterSevice.showWarning('HRM_Format_DDMMYY', 4000);
        }
    };

    formatDate = val => {
        if (val) {
            return moment(val).format('YYYY-MM-DD HH:mm:ss');
        }

        return null;
    };

    formatTime = val => {
        if (val) {
            return moment(val).format('HH:mm');
        }

        return null;
    };

    OnChangeHighSupervisorPlan = (timeStart, timeEnd) => {
        const { Profile, WorkDate, UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4 } = this.state;
        let pro = Profile.ID,
            dayType = null,
            workdate = this.formatDate(WorkDate.value);

        if (pro) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/ChangeHighSupervisorPlan', {
                ProfileID: pro,
                UserSubmit: pro,
                DayType: dayType,
                TimeStart: timeStart,
                TimeEnd: timeEnd,
                workdate: workdate
            }).then(result => {
                VnrLoadingSevices.hide();
                let nextState = {
                    UserApproveID: { ...UserApproveID },
                    UserApproveID2: { ...UserApproveID2 },
                    UserApproveID3: { ...UserApproveID3 },
                    UserApproveID4: { ...UserApproveID4 }
                };

                //truong hop chạy theo approve grade
                if (result.LevelApprove > 0) {
                    if (result.LevelApprove == 2) {
                        if (result.IsOnlyOneLevelApprove) {
                            this.isOnlyOnleLevelApprove = true;
                            this.levelApproveOTPlan = 1;
                            this.levelApproveOT = 1;
                            if (result.SupervisorID != null) {
                                // checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID, false);
                                // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID, false);
                                // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID, false);
                                // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID, false);
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
                            } else {
                                // multiUserApproveID.refresh();
                                // multiUserApproveID.value(null);
                                // multiUserApproveID2.refresh();
                                // multiUserApproveID2.value(null);
                                // multiUserApproveID3.refresh();
                                // multiUserApproveID3.value(null);
                                // multiUserApproveID4.refresh();
                                // multiUserApproveID4.value(null);
                                nextState = {
                                    UserApproveID: {
                                        ...nextState.UserApproveID,
                                        value: null
                                    },
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
                        } else {
                            this.isLevelApprove2 = true;
                            this.isOnlyOnleLevelApprove = false;
                            if (result.SupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApproveID: {
                                        ...nextState.UserApproveID,
                                        value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                    }
                                };
                                //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID, false);
                            } else {
                                // multiUserApproveID.refresh();
                                // multiUserApproveID.value(null);
                                nextState = {
                                    ...nextState,
                                    UserApproveID: {
                                        ...nextState.UserApproveID,
                                        value: null
                                    }
                                };
                            }

                            if (result.MidSupervisorID != null) {
                                // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID, false);

                                // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID, false);

                                // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID, false);
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
                            } else {
                                // multiUserApproveID2.refresh();
                                // multiUserApproveID2.value(null);
                                // multiUserApproveID3.refresh();
                                // multiUserApproveID3.value(null);
                                // multiUserApproveID4.refresh();
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

                        //$("#idUserApproveID3").hide();
                        //isShowEle('#idUserApproveID3');
                        nextState = {
                            ...nextState,
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                visible: false
                            }
                        };
                    } else if (result.LevelApprove == 3) {
                        this.isLevelApprove2 = false;
                        if (result.SupervisorID != null) {
                            //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID, false);
                            nextState = {
                                ...nextState,
                                UserApproveID: {
                                    ...nextState.UserApproveID,
                                    value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                }
                            };
                        } else {
                            // multiUserApproveID.refresh();
                            // multiUserApproveID.value(null);
                            nextState = {
                                ...nextState,
                                UserApproveID: {
                                    ...nextState.UserApproveID,
                                    value: null
                                }
                            };
                        }

                        if (result.MidSupervisorID != null) {
                            // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID, false);
                            nextState = {
                                ...nextState,
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                }
                            };
                        } else {
                            // multiUserApproveID3.refresh();
                            // multiUserApproveID3.value(null);
                            nextState = {
                                ...nextState,
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    value: null
                                }
                            };
                        }

                        if (result.NextMidSupervisorID != null) {
                            // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID, false);
                            nextState = {
                                ...nextState,
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    value: {
                                        UserInfoName: result.NextMidSupervisorName,
                                        ID: result.NextMidSupervisorID
                                    }
                                }
                            };
                        } else {
                            // multiUserApproveID2.refresh();
                            // multiUserApproveID2.value(null);
                            nextState = {
                                ...nextState,
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    value: null
                                }
                            };
                        }
                        //$("#idUserApproveID3").show();
                        // isShowEle('#idUserApproveID3', true);

                        nextState = {
                            ...nextState,
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                visible: true
                            }
                        };
                    } else if (result.LevelApprove == 4) {
                        this.isLevelApprove2 = false;
                        if (result.SupervisorID != null) {
                            //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID, false);
                            nextState = {
                                ...nextState,
                                UserApproveID: {
                                    ...nextState.UserApproveID,
                                    value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                }
                            };
                        } else {
                            //multiUserApproveID.refresh();
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
                            //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID, false);
                            nextState = {
                                ...nextState,
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                }
                            };
                        } else {
                            //multiUserApproveID3.refresh();
                            //multiUserApproveID3.value(null);
                            nextState = {
                                ...nextState,
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    value: null
                                }
                            };
                        }

                        if (result.NextMidSupervisorID != null) {
                            //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID, false);
                            nextState = {
                                ...nextState,
                                UserApproveID4: {
                                    ...nextState.UserApproveID4,
                                    value: {
                                        UserInfoName: result.NextMidSupervisorName,
                                        ID: result.NextMidSupervisorID
                                    }
                                }
                            };
                        } else {
                            //multiUserApproveID4.refresh();
                            //multiUserApproveID4.value(null);
                            nextState = {
                                ...nextState,
                                UserApproveID4: {
                                    ...nextState.UserApproveID4,
                                    value: null
                                }
                            };
                        }

                        if (result.HighSupervisorID != null) {
                            //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID, false);
                            nextState = {
                                ...nextState,
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                                }
                            };
                        } else {
                            //multiUserApproveID2.refresh();
                            //multiUserApproveID2.value(null);
                            nextState = {
                                ...nextState,
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    value: null
                                }
                            };
                        }

                        //$("#idUserApproveID3").show();
                        //$("#idUserApproveID3").show();
                        // isShowEle('#idUserApproveID3', true);
                        // isShowEle('#idUserApproveID4', true);
                        nextState = {
                            ...nextState,
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                visible: true
                            },
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                visible: true
                            }
                        };
                    }
                }
                //TH chạy không theo approvegrade
                else if (result.LevelApprove == 0) {
                    if (result.SupervisorID != null) {
                        // checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID, false);
                        nextState = {
                            ...nextState,
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                            }
                        };
                    } else {
                        // multiUserApproveID.refresh();
                        // multiUserApproveID.value(null);
                        nextState = {
                            ...nextState,
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                value: null
                            }
                        };
                    }

                    if (result.HighSupervisorID != null) {
                        //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID, false);
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                            }
                        };
                    } else {
                        //multiUserApproveID2.refresh();
                        //multiUserApproveID2.value(null);
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: null
                            }
                        };
                    }
                    if (result.IsChangeApprove == true) {
                        this.isChangeLevelApprove = true;
                    }

                    // Vinh.Mai Kiểm tra load người duyệt không theo chế độ duyệt
                    if (this.checkByApprove && this.checkByApprove.Value1 && this.checkByApprove.Value1 !== '') {
                        if (this.checkByApprove.Value1 == '3') {
                            this.levelApproveOTPlan = 3;
                            this.levelApproveOT = 3;
                            // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID, false);
                            // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID, false);
                            // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID, false);
                            // isShowEle('#idUserApproveID3', true);
                            nextState = {
                                ...nextState,
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                                },
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    visible: true,
                                    value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                                },
                                UserApproveID4: {
                                    ...nextState.UserApproveID4,
                                    value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                                }
                            };
                        } else if (this.checkByApprove.Value1 == '1') {
                            this.levelApproveOTPlan = 1;
                            this.levelApproveOT = 1;
                            // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID, false);
                            // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID, false);
                            // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID, false);
                            nextState = {
                                ...nextState,
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
                        } else {
                            this.levelApproveOTPlan = 2;
                            this.levelApproveOT = 2;
                            // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID, false);
                            // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID, false);
                            // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID, false);
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
                        }
                    } else {
                        this.levelApproveOTPlan = 2;
                        this.levelApproveOT = 2;
                        // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID, false);
                        // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID, false);
                        // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID, false);
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
                    }
                }

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
            });
        }
    };

    ComputeResgistHourOrEndHourtOT = (_TypeOT, _RegistHour, _ShiftID, isChangeByTimeOut) => {
        if (!_RegistHour || _RegistHour == '') _RegistHour = 0;

        HttpService.Post('[URI_HR]/Att_GetData/GetRegistHourOrEndHourOT', {
            ShiftID: _ShiftID,
            RegistHour: _RegistHour,
            TypeOT: _TypeOT
        }).then(data => {
            if (data) {
                const { checkShiftByProfile } = this.state,
                    { TimeFrom, TimeTo } = checkShiftByProfile;

                this.setState(
                    {
                        checkShiftByProfile: {
                            ...checkShiftByProfile,
                            TimeFrom: {
                                ...TimeFrom,
                                value: data.StartHourOT
                                    ? moment().format('YYYY-MM-DD ' + data.StartHourOT + ':00')
                                    : null,
                                refresh: !TimeFrom.refresh
                            },
                            TimeTo: {
                                ...TimeTo,
                                value: data.EndHourOT ? moment().format('YYYY-MM-DD ' + data.EndHourOT + ':00') : null,
                                refresh: !TimeTo.refresh
                            }
                        }
                    },
                    () => this.UpdateStartOT(isChangeByTimeOut)
                );
            } else {
                this.UpdateStartOT(isChangeByTimeOut);
            }
        });
    };

    //change ca làm việc
    onPickShiftID = item => {
        const { ShiftID, DurationType, NoConfig } = this.state,
            { RegisterHours } = NoConfig;
        this.setState(
            {
                ShiftID: {
                    ...ShiftID,
                    value: item,
                    refresh: !ShiftID.refresh
                }
            },
            () => {
                let _durationType = DurationType.value ? DurationType.value.Value : null;
                this.ComputeResgistHourOrEndHourtOT(_durationType, RegisterHours.value, item ? item.ID : null);
                this.GetOvertimeTypeByDate();
            }
        );
    };

    //change loại đăng ký
    onChangeDurationType = item => {
        const { DurationType, ShiftID, NoConfig } = this.state,
            { RegisterHours } = NoConfig;

        this.setState(
            {
                DurationType: {
                    ...DurationType,
                    value: item,
                    refresh: !DurationType.refresh
                }
            },
            () => {
                if (ShiftID.value) {
                    let _durationType = item ? item.Value : null;
                    this.ComputeResgistHourOrEndHourtOT(_durationType, RegisterHours.value, ShiftID.value.ID, false);
                }
                // if ($('#TempShiftID').val()) {
                //     this.ComputeResgistHourOrEndHourtOT($(this).val(), $('input[ng-model=RegisterHours]').val(), $('#TempShiftID').val());
                // }

                this.GetOvertimeTypeByDate();
            }
        );
    };

    //change loại tăng ca
    onChangeOvertimeTypeID = item => {
        const { divOvertimeTypeID } = this.state,
            { OvertimeTypeID } = divOvertimeTypeID;

        this.setState(
            {
                divOvertimeTypeID: {
                    ...divOvertimeTypeID,
                    OvertimeTypeID: {
                        ...OvertimeTypeID,
                        value: item,
                        refresh: !OvertimeTypeID.refresh
                    }
                }
            },
            () => this.GetOvertimeTypeByDate()
        );
    };

    //change giờ bắt đầu
    onChangeTimeFrom = item => {
        const { checkShiftByProfile } = this.state,
            { TimeFrom } = checkShiftByProfile;

        this.setState(
            {
                checkShiftByProfile: {
                    ...checkShiftByProfile,
                    TimeFrom: {
                        ...TimeFrom,
                        value: item,
                        refresh: !TimeFrom.refresh
                    }
                }
            },
            () => this.UpdateRegisterHours(true)
        );
    };

    //change giờ kết thúc
    onChangeTimeTo = item => {
        const { checkShiftByProfile, DurationType, AdvanceOverTimeInDay } = this.state,
            { TimeTo } = checkShiftByProfile,
            { IsTripOTInDay } = AdvanceOverTimeInDay,
            { OvertimeHour, HourTotal } = IsTripOTInDay;

        this.setState(
            {
                AdvanceOverTimeInDay: {
                    ...AdvanceOverTimeInDay,
                    IsTripOTInDay: {
                        ...AdvanceOverTimeInDay.IsTripOTInDay,
                        OvertimeHour: {
                            ...OvertimeHour,
                            disable: false,
                            refresh: !OvertimeHour.refresh
                        },
                        HourTotal: {
                            ...HourTotal,
                            disable: false,
                            refresh: !HourTotal.refresh
                        }
                    }
                },
                checkShiftByProfile: {
                    ...checkShiftByProfile,
                    TimeTo: {
                        ...TimeTo,
                        value: item,
                        refresh: !TimeTo.refresh
                    }
                }
            },
            () => {
                let _durationType = DurationType.value ? DurationType.value.Value : null;
                if (_durationType == 'E_OT_BREAK_AFTER' || _durationType == 'E_OT_BREAK_BEFORE') {
                    this.UpdateEndOT(true, true);
                } else this.UpdateRegisterHours();
            }
        );
    };

    UpdateWorkDateIn() {
        this.UpdateEndOT(false, true);
    }

    UpdateRegisterHours = callback => {
        const { NoConfig, ShiftID, DurationType, checkShiftByProfile } = this.state,
            { RegisterHours } = NoConfig,
            { TimeFrom, TimeTo } = checkShiftByProfile;

        //var RegisterHours = $('input[ng-model=RegisterHours]').data('kendoNumericTextBox');
        let shiftID = ShiftID.value ? ShiftID.value.ID : null,
            _durationType = DurationType.value ? DurationType.value.Value : null;
        // if ($('#TempShiftID').val() != '') {
        //     shiftID = $('#TempShiftID').val();
        // }
        // if ($('#ShiftID').val() != '') {
        //     shiftID = $('#ShiftID').val();
        // }
        HttpService.Post('[URI_HR]/Att_GetData/UpdateRegisterHours', {
            timeStart: this.formatTime(TimeFrom.value), //$('input[ng-model=TimeFrom]').val(),
            timeEnd: this.formatTime(TimeTo.value), //$('input[ng-model=TimeTo]').val(),
            shiftID: shiftID,
            DurationType: _durationType, //$('#DurationType').val(),
            IsOverTimeBreak: false //document.getElementById('IsOverTimeBreak').checked
        }).then(data => {
            //RegisterHours.value(data);
            //var timeStart = $('input[ng-model=TimeFrom]').val();
            //var timeEnd = $('input[ng-model=TimeTo]').val();
            this.setState(
                {
                    NoConfig: {
                        ...NoConfig,
                        RegisterHours: {
                            ...RegisterHours,
                            value: data.toString(),
                            refresh: !RegisterHours.refresh
                        }
                    }
                },
                () => {
                    if (callback) {
                        this.UpdateWorkDateIn();
                    }
                }
            );
        });
    };

    //change phương thức thanh toán
    onChangeMethodPayment = item => {
        const { MethodPayment } = this.state;
        this.setState({
            MethodPayment: {
                ...MethodPayment,
                value: item,
                refresh: !MethodPayment.refresh
            }
        });
    };

    //change số giờ di chuyển
    onChangeHourTotal = item => {
        const { AdvanceOverTimeInDay } = this.state,
            { IsTripOTInDay } = AdvanceOverTimeInDay;
        this.setState({
            AdvanceOverTimeInDay: {
                ...AdvanceOverTimeInDay,
                IsTripOTInDay: {
                    ...IsTripOTInDay,
                    HourTotal: {
                        ...IsTripOTInDay.HourTotal,
                        value: item
                    }
                }
            }
        });
    };

    onCheckIsTripOTInDay = () => {
        const { AdvanceOverTimeInDay } = this.state,
            { IsTripOTInDay } = AdvanceOverTimeInDay;
        this.setState({
            AdvanceOverTimeInDay: {
                ...AdvanceOverTimeInDay,
                IsTripOTInDay: {
                    ...AdvanceOverTimeInDay.IsTripOTInDay,
                    value: !IsTripOTInDay.value
                }
            }
        });
    };

    //change số làm ngoài giờ
    onChangeOvertimeHour = item => {
        const { AdvanceOverTimeInDay } = this.state,
            { IsTripOTInDay } = AdvanceOverTimeInDay;
        this.setState({
            AdvanceOverTimeInDay: {
                ...AdvanceOverTimeInDay,
                IsTripOTInDay: {
                    ...IsTripOTInDay,
                    OvertimeHour: {
                        ...IsTripOTInDay.OvertimeHour,
                        value: item
                    }
                }
            }
        });
    };

    onCheckIsRequestShuttleCar = () => {
        const { AdvanceOverTimeInDay } = this.state,
            { IsRequestShuttleCar } = AdvanceOverTimeInDay;
        this.setState({
            AdvanceOverTimeInDay: {
                ...AdvanceOverTimeInDay,
                IsRequestShuttleCar: {
                    ...AdvanceOverTimeInDay.IsRequestShuttleCar,
                    value: !IsRequestShuttleCar.value
                }
            }
        });
    };

    //change loại công việc
    onChangeJobTypeID = item => {
        const { AdvanceOverTimeInDay } = this.state,
            { IsRequestShuttleCar } = AdvanceOverTimeInDay,
            { JobTypeID } = IsRequestShuttleCar;
        this.setState({
            AdvanceOverTimeInDay: {
                ...AdvanceOverTimeInDay,
                IsRequestShuttleCar: {
                    ...AdvanceOverTimeInDay.IsRequestShuttleCar,
                    JobTypeID: {
                        ...AdvanceOverTimeInDay.IsRequestShuttleCar.JobTypeID,
                        value: item,
                        refresh: !JobTypeID.refresh
                    }
                }
            }
        });
    };

    onChangePlace = value => {
        const { AdvanceOverTimeInDay } = this.state,
            { IsRequestShuttleCar } = AdvanceOverTimeInDay,
            { Place } = IsRequestShuttleCar;
        this.setState({
            AdvanceOverTimeInDay: {
                ...AdvanceOverTimeInDay,
                IsRequestShuttleCar: {
                    ...AdvanceOverTimeInDay.IsRequestShuttleCar,
                    Place: {
                        ...AdvanceOverTimeInDay.IsRequestShuttleCar.Place,
                        value: value,
                        refresh: !Place.refresh
                    }
                }
            }
        });
    };

    onChangeRequestParking = value => {
        const { AdvanceOverTimeInDay } = this.state,
            { IsRequestShuttleCar } = AdvanceOverTimeInDay,
            { RequestParking } = IsRequestShuttleCar;
        this.setState({
            AdvanceOverTimeInDay: {
                ...AdvanceOverTimeInDay,
                IsRequestShuttleCar: {
                    ...AdvanceOverTimeInDay.IsRequestShuttleCar,
                    RequestParking: {
                        ...AdvanceOverTimeInDay.IsRequestShuttleCar.RequestParking,
                        value: value,
                        refresh: !RequestParking.refresh
                    }
                }
            }
        });
    };

    onCheckIsRequestForBenefit = () => {
        const { AdvanceOverTimeInDay } = this.state,
            { IsRequestForBenefit } = AdvanceOverTimeInDay;
        this.setState({
            AdvanceOverTimeInDay: {
                ...AdvanceOverTimeInDay,
                IsRequestForBenefit: {
                    ...AdvanceOverTimeInDay.IsRequestForBenefit,
                    value: !IsRequestForBenefit.value
                }
            }
        });
    };

    onCheckIsSignUpToEat = () => {
        const { AdvanceOverTimeInDay } = this.state,
            { IsSignUpToEat } = AdvanceOverTimeInDay;
        this.setState({
            AdvanceOverTimeInDay: {
                ...AdvanceOverTimeInDay,
                IsSignUpToEat: {
                    ...AdvanceOverTimeInDay.IsSignUpToEat,
                    value: !IsSignUpToEat.value
                }
            }
        });
    };

    onCheckIsRequestEntryExitGate = () => {
        const { AdvanceOverTimeInDay } = this.state,
            { IsRequestEntryExitGate } = AdvanceOverTimeInDay;
        this.setState({
            AdvanceOverTimeInDay: {
                ...AdvanceOverTimeInDay,
                IsRequestEntryExitGate: {
                    ...AdvanceOverTimeInDay.IsRequestEntryExitGate,
                    value: !IsRequestEntryExitGate.value
                }
            }
        });
    };

    onChangeOvertimeArea = value => {
        const { AdvanceOverTimeInDay } = this.state,
            { OvertimeArea } = AdvanceOverTimeInDay;
        this.setState({
            AdvanceOverTimeInDay: {
                ...AdvanceOverTimeInDay,
                OvertimeArea: {
                    ...AdvanceOverTimeInDay.OvertimeArea,
                    value: value,
                    refresh: !OvertimeArea.refresh
                }
            }
        });
    };

    onPickSendToID = item => {
        const { AdvanceOverTimeInDay } = this.state,
            { SendToID } = AdvanceOverTimeInDay;
        this.setState({
            AdvanceOverTimeInDay: {
                ...AdvanceOverTimeInDay,
                SendToID: {
                    ...AdvanceOverTimeInDay.SendToID,
                    value: item,
                    refresh: !SendToID.refresh
                }
            }
        });
    };

    onPickOvertimeReasonID = item => {
        const { OvertimeReasonID } = this.state;
        this.setState({
            OvertimeReasonID: {
                ...OvertimeReasonID,
                value: item,
                refresh: !OvertimeReasonID.refresh
            }
        });
    };
    //change số giờ đăng ký - input
    onChangeRegisterHours = () => {
        // var _paramErr = $(this).attr('paramErr'),
        //     _paramWithinshift = $('input[ng-model=RegisterHours]').attr('paramWithinshift'),
        //     _paramThantimebreak = $('input[ng-model=RegisterHours]').attr('paramThantimebreak'),
        //     _enumEARLY = $(this).attr('enum');
        this.UpdateEndOT(true);
    };

    //change số giờ đăng ký - picker
    onChangeRegisterHoursConfig = value => {
        const { NoConfig, DurationType } = this.state,
            { RegisterHoursConfig } = NoConfig;

        this.setState(
            {
                NoConfig: {
                    ...NoConfig,
                    RegisterHoursConfig: {
                        ...RegisterHoursConfig,
                        value: value,
                        refresh: !RegisterHoursConfig.refresh
                    }
                }
            },
            () => {
                if (DurationType.value) {
                    this.onChangeListRegisterHours(value);
                }
            }
        );
    };

    // hiển thị số giờ lũy kế
    openModalPlanLimit = () => {
        const { WorkDate, dataPlanLimit } = this.state;

        if (!WorkDate.value) return;

        if (dataPlanLimit.data) {
            this.setState({
                dataPlanLimit: {
                    ...dataPlanLimit,
                    modalVisiblePlanLimit: true
                }
            });
            return;
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetOvertimePlanLimit', {
            ProfileIDs: profileInfo[enumName.E_ProfileID],
            WorkDateRoot: Vnr_Function.formatDateAPI(WorkDate.value)
        }).then(res => {
            VnrLoadingSevices.hide();
            if (res && res.Data && res.Data.length > 0)
                this.setState({
                    dataPlanLimit: {
                        ...dataPlanLimit,
                        data: res.Data[0],
                        modalVisiblePlanLimit: true
                    }
                });
            else
                this.setState({
                    dataPlanLimit: {
                        ...dataPlanLimit,
                        data: enumName.E_EMPTYDATA,
                        modalVisiblePlanLimit: true
                    }
                });
        });
    };

    closeModalPlanLimit = () => {
        const { dataPlanLimit } = this.state;
        this.setState({
            dataPlanLimit: {
                ...dataPlanLimit,
                modalVisiblePlanLimit: false
            }
        });
    };

    viewListItemPlanLimitTime = () => {
        const { dataPlanLimit } = this.state;
        if (dataPlanLimit.data === EnumName.E_EMPTYDATA) {
            return <EmptyData messageEmptyData={'EmptyData'} />;
        } else {
            const {
                udHourByMonth,
                udHourByYear,
                udLimitColorYearFinance,
                udLimitColorMonth,
                udLimitColorYear,
                udHourByYearFinance
            } = dataPlanLimit.data;
            return (
                <View style={{}}>
                    <View style={styles.viewTextTimeWithBorder}>
                        <VnrText
                            style={[styleSheets.Text, udLimitColorMonth && { color: udLimitColorMonth }]}
                            i18nKey={'udHourByMonth'}
                        />
                        <Text style={[styleSheets.Text, udLimitColorMonth && { color: udLimitColorMonth }]}>
                            {udHourByMonth !== null ? `: ${udHourByMonth}` : ''}
                        </Text>
                    </View>

                    <View style={styles.viewTextTimeWithoutBorder}>
                        <VnrText
                            style={[styleSheets.Text, udLimitColorYear && { color: udLimitColorYear }]}
                            i18nKey={'udHourByYear'}
                        />
                        <Text style={[styleSheets.Text, udLimitColorYear && { color: udLimitColorYear }]}>
                            {udHourByYear !== null ? `: ${udHourByYear}` : ''}
                        </Text>
                    </View>

                    <View style={styles.viewTextTimeWithoutBorder}>
                        <VnrText
                            style={[styleSheets.Text, udLimitColorYearFinance && { color: udLimitColorYearFinance }]}
                            i18nKey={'udHourByYearFinance'}
                        />
                        <Text style={[styleSheets.Text, udLimitColorYearFinance && { color: udLimitColorYearFinance }]}>
                            {udHourByYearFinance != null ? `: ${udHourByYearFinance}` : ''}
                        </Text>
                    </View>
                </View>
            );
        }
    };

    render() {
        const {
                WorkDate,
                DayType,
                ShiftID,
                DurationType,
                divOvertimeTypeID,
                checkShiftByProfile,
                NoConfig,
                MethodPayment,
                BusinessUnitTypeID,
                BusinessUnitID,
                FileAttach,
                ReasonOT,
                RequestCancelReason,
                OvertimeReasonID,
                IsUnitAssistant,
                UserApproveID,
                UserApproveID3,
                UserApproveID4,
                UserApproveID2,
                AdvanceOverTimeInDay,
                fieldValid,
                modalLimit,
                IsOverTimeBreak,
                modalErrorDetail,
                IsNotCheckInOut,
                dataPlanLimit
            } = this.state,
            { OvertimeTypeID } = divOvertimeTypeID,
            { TimeFrom, TimeTo } = checkShiftByProfile,
            { RegisterHours, RegisterHoursConfig } = NoConfig,
            {
                IsRequestShuttleCar,
                IsSignUpToEat,
                SendToID,
                OvertimeArea,
                isShowInfoAdvance
            } = AdvanceOverTimeInDay,
            { JobTypeID, Place, RequestParking } = IsRequestShuttleCar;

        const {
            textLableInfo,
            contentViewControl,
            viewLable,
            viewControl,
            controlDate_To,
            controlDate_from,
            formDate_To_From,
            viewInputMultiline,
            viewBtnShowHideUser,
            viewBtnShowHideUser_text
        } = stylesListPickerControl;

        //#region [Xử lý 3 nút lưu]
        const listActions = [];

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_PlanOvertime_btnSaveAndMail'] &&
            PermissionForAppMobile.value['New_Att_PlanOvertime_btnSaveAndMail']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_SENMAIL,
                title: translate('HRM_Common_SaveAndSendMail'),
                onPress: () => this.onSaveAndSend(this.props.navigation)
            });
        }

        listActions.push({
            type: EnumName.E_SAVE_CLOSE,
            title: translate('HRM_Common_SaveClose'),
            onPress: () => this.onSave(this.props.navigation)
        });
        //#endregion

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={{ ...CustomStyleSheet.flexGrow(1), ...CustomStyleSheet.paddingTop(10) }}
                        ref={ref => (this.scrollViewRef = ref)}
                    >
                        {/* Ngày công - WorkDate */}
                        {WorkDate.visibleConfig && WorkDate.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={WorkDate.label} />

                                    {fieldValid.WorkDate && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={WorkDate.value}
                                        refresh={WorkDate.refresh}
                                        disable={true}
                                        type={'date'}
                                        onFinish={value => this.onChangeWorkDate(value)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Loại ngày - DayType */}
                        {DayType.visibleConfig && DayType.visible && (
                            <View style={[contentViewControl, styles.styViewLeaveDayCount]}>
                                <Text style={[styleSheets.text, styles.styViewLeaveDayCountLable]}>
                                    {`${translate(DayType.label)} : `}
                                </Text>
                                <VnrText
                                    style={[styleSheets.lable, styles.styViewLeaveDayCountValue]}
                                    value={DayType.value}
                                />
                            </View>
                        )}

                        {/* Ca - ShiftID */}
                        {ShiftID.visibleConfig && ShiftID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={ShiftID.label} />

                                    {/* valid ShiftID */}
                                    {fieldValid.ShiftID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiShiftByOrdernumber',
                                            type: 'E_GET'
                                        }}
                                        refresh={ShiftID.refresh}
                                        textField="ShiftName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={false}
                                        value={ShiftID.value}
                                        disable={true}
                                        onFinish={item => this.onPickShiftID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Loại đăng ký -  DurationType */}
                        {DurationType.visibleConfig && DurationType.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DurationType.label} />

                                    {/* valid DurationType */}
                                    {fieldValid.DurationType && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={DurationType.data}
                                        refresh={DurationType.refresh}
                                        textField="Text"
                                        valueField="Value"
                                        filter={true}
                                        value={DurationType.value}
                                        filterServer={false}
                                        disable={true}
                                        onFinish={item => this.onChangeDurationType(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Loại tăng ca - divOvertimeTypeID, OvertimeTypeID */}
                        {divOvertimeTypeID.visibleConfig && divOvertimeTypeID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={divOvertimeTypeID.label}
                                    />

                                    {/* valid OvertimeTypeID */}
                                    {fieldValid.OvertimeTypeID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={OvertimeTypeID.data}
                                        refresh={OvertimeTypeID.refresh}
                                        textField="OvertimeTypeName"
                                        valueField="ID"
                                        filter={true}
                                        value={OvertimeTypeID.value}
                                        filterServer={false}
                                        disable={true}
                                        onFinish={item => this.onChangeOvertimeTypeID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Tính OT giờ nghỉ - IsOverTimeBreak */}
                        <View style={styles.styListBtnTypePregnancy}>
                            {IsOverTimeBreak.visibleConfig && IsOverTimeBreak.visible && (
                                <View disable={true} style={styles.styBtnTypePregnancy}>
                                    <CheckBox
                                        checkBoxColor={Colors.black}
                                        checkedCheckBoxColor={Colors.primary}
                                        isChecked={IsOverTimeBreak.value}
                                        disable={true}
                                        onClick={() => { }}
                                    />
                                    <VnrText
                                        style={[styleSheets.text, styles.styBtnTypePregnancyText]}
                                        i18nKey={IsOverTimeBreak.label}
                                    />
                                    {fieldValid.IsOverTimeBreak && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                            )}
                        </View>

                        {/* Không kiểm tra in/out - IsNotCheckInOut */}
                        <View style={styles.styListBtnTypePregnancy}>
                            {IsNotCheckInOut.visibleConfig && IsNotCheckInOut.visible && (
                                <View disable={true} style={styles.styBtnTypePregnancy}>
                                    <CheckBox
                                        checkBoxColor={Colors.black}
                                        checkedCheckBoxColor={Colors.primary}
                                        isChecked={IsNotCheckInOut.value}
                                        disable={true}
                                        onClick={() => { }}
                                    />
                                    <VnrText
                                        style={[styleSheets.text, styles.styBtnTypePregnancyText]}
                                        i18nKey={IsNotCheckInOut.label}
                                    />
                                    {fieldValid.IsNotCheckInOut && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                            )}
                        </View>

                        {/* Giờ bắt đầu tăng ca - checkShiftByProfile, TimeFrom, TimeTo */}
                        {checkShiftByProfile.visibleConfig && checkShiftByProfile.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={checkShiftByProfile.label}
                                    />

                                    {/* valid TimeFrom */}
                                    {fieldValid.TimeFrom && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <View style={formDate_To_From}>
                                        <View style={controlDate_from}>
                                            <VnrDate
                                                response={'string'}
                                                format={'HH:mm'}
                                                value={TimeFrom.value}
                                                refresh={TimeFrom.refresh}
                                                disable={true}
                                                type={'time'}
                                                onFinish={value => this.onChangeTimeFrom(value)}
                                            />
                                        </View>
                                        <View style={controlDate_To}>
                                            <VnrDate
                                                response={'string'}
                                                format={'HH:mm'}
                                                value={TimeTo.value}
                                                refresh={TimeTo.refresh}
                                                disable={true}
                                                type={'time'}
                                                onFinish={value => this.onChangeTimeTo(value)}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Số giờ ĐK -  NoConfig */}
                        {NoConfig.visibleConfig &&
                            NoConfig.visible &&
                            RegisterHours.visibleConfig &&
                            RegisterHours.visible && (
                            <View style={[contentViewControl, styles.styViewLeaveDayCount]}>
                                <Text style={[styleSheets.text, styles.styViewLeaveDayCountLable]}>
                                    {`${translate(NoConfig.label)} : `}
                                </Text>
                                <VnrText
                                    style={[styleSheets.lable, styles.styViewLeaveDayCountValue]}
                                    value={RegisterHours.value}
                                />
                            </View>
                        )}

                        {RegisterHoursConfig.visibleConfig && RegisterHoursConfig.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={NoConfig.label} />

                                    {/* valid RegisterHours */}
                                    {fieldValid.RegisterHours && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>

                                {RegisterHoursConfig.visibleConfig && RegisterHoursConfig.visible && (
                                    <View style={viewControl}>
                                        <VnrPickerQuickly
                                            dataLocal={RegisterHoursConfig.data}
                                            refresh={RegisterHoursConfig.refresh}
                                            textField="Text"
                                            valueField="Value"
                                            filter={false}
                                            value={RegisterHoursConfig.value}
                                            filterServer={false}
                                            disable={true}
                                            onFinish={item => this.onChangeRegisterHoursConfig(item)}
                                        />
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Loại đơn vị kinh doanh -  BusinessUnitTypeID */}
                        {BusinessUnitTypeID.visibleConfig && BusinessUnitTypeID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={BusinessUnitTypeID.label}
                                    />

                                    {/* valid BusinessUnitTypeID */}
                                    {fieldValid.BusinessUnitTypeID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        dataLocal={BusinessUnitTypeID.data}
                                        refresh={BusinessUnitTypeID.refresh}
                                        textField="ShopGroupView"
                                        valueField="ID"
                                        filter={false}
                                        value={BusinessUnitTypeID.value}
                                        disable={true}
                                        onFinish={() => { }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Đơn vị kinh doanh -  BusinessUnitID */}
                        {BusinessUnitID.visibleConfig && BusinessUnitID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={BusinessUnitID.label} />

                                    {/* valid BusinessUnitID */}
                                    {fieldValid.BusinessUnitID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        dataLocal={BusinessUnitID.data}
                                        refresh={BusinessUnitID.refresh}
                                        textField="ShopView"
                                        valueField="ID"
                                        filter={false}
                                        value={BusinessUnitID.value}
                                        disable={true}
                                        onFinish={() => { }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* PT thanh toán -  MethodPayment */}
                        {MethodPayment.visibleConfig && MethodPayment.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={MethodPayment.label} />

                                    {/* valid MethodPayment */}
                                    {fieldValid.MethodPayment && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        dataLocal={MethodPayment.data}
                                        refresh={MethodPayment.refresh}
                                        textField="Text"
                                        valueField="Value"
                                        filter={false}
                                        value={MethodPayment.value}
                                        disable={true}
                                        onFinish={item => this.onChangeMethodPayment(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Người duyệt đầu - UserApproveID*/}
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
                                            urlApi:
                                                '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_REQUESTCANCEL_OVERTIMEPLAN',
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
                                        onFinish={item => this.onChangeUserApproveID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Người duyệt kế tiếp - UserApproveID3*/}
                        {UserApproveID3.visibleConfig && UserApproveID3.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={UserApproveID2.label} />

                                    {/* valid UserApproveID3 */}
                                    {fieldValid.UserApproveID2 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi:
                                                '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_REQUESTCANCEL_OVERTIMEPLAN',
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

                        {/* Người duyệt tiếp theo - UserApproveID4*/}
                        {UserApproveID4.visibleConfig && UserApproveID4.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={UserApproveID3.label} />

                                    {/* valid UserApproveID4 */}
                                    {fieldValid.UserApproveID3 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi:
                                                '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_REQUESTCANCEL_OVERTIMEPLAN',
                                            type: 'E_GET'
                                        }}
                                        value={UserApproveID4.value}
                                        refresh={UserApproveID4.refresh}
                                        textField="UserInfoName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={true}
                                        filterParams="text"
                                        disable={UserApproveID4.disable}
                                        onFinish={item => {
                                            this.setState({
                                                UserApproveID4: {
                                                    ...UserApproveID4,
                                                    value: item,
                                                    refresh: !UserApproveID4.refresh
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Người duyệt cuối - UserApproveID2 */}
                        {UserApproveID2.visibleConfig && UserApproveID2.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={UserApproveID4.label} />

                                    {/* valid UserApproveID2 */}
                                    {fieldValid.UserApproveID4 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi:
                                                '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_REQUESTCANCEL_OVERTIMEPLAN',
                                            type: 'E_GET'
                                        }}
                                        refresh={UserApproveID2.refresh}
                                        textField="UserInfoName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={true}
                                        value={UserApproveID2.value}
                                        filterParams="text"
                                        disable={UserApproveID2.disable}
                                        onFinish={item => this.onChangeUserApproveID2(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Lý do tăng ca -  ReasonOT*/}
                        {ReasonOT.visibleConfig && ReasonOT.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={ReasonOT.label} />
                                    {fieldValid.ReasonOT && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={true}
                                        refresh={ReasonOT.refresh}
                                        value={ReasonOT.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={text =>
                                            this.setState({
                                                ReasonOT: {
                                                    ...ReasonOT,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Lý do tăng ca 2 -  OvertimeReasonID*/}
                        {OvertimeReasonID.visibleConfig && OvertimeReasonID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={OvertimeReasonID.label}
                                    />
                                    {fieldValid.OvertimeReasonID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiOvertimeReason',
                                            type: 'E_GET'
                                        }}
                                        value={OvertimeReasonID.value}
                                        refresh={OvertimeReasonID.refresh}
                                        textField="OvertimeReasonName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={false}
                                        disable={true}
                                        onFinish={item => this.onPickOvertimeReasonID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        <View style={styles.styListBtnTypePregnancy}>
                            {/* Chuyển TLĐV - IsUnitAssistant */}
                            {false && IsUnitAssistant.visibleConfig && IsUnitAssistant.visible && (
                                <TouchableOpacity
                                    style={styles.styBtnTypePregnancy}
                                    onPress={() =>
                                        this.setState({
                                            IsUnitAssistant: {
                                                ...IsUnitAssistant,
                                                value: !IsUnitAssistant.value
                                            }
                                        })
                                    }
                                >
                                    <CheckBox
                                        checkBoxColor={Colors.black}
                                        checkedCheckBoxColor={Colors.primary}
                                        isChecked={IsUnitAssistant.value}
                                        disable={true}
                                        onClick={() =>
                                            this.setState({
                                                IsUnitAssistant: {
                                                    ...IsUnitAssistant,
                                                    value: !IsUnitAssistant.value
                                                }
                                            })
                                        }
                                    />
                                    <VnrText
                                        style={[styleSheets.text, styles.styBtnTypePregnancyText]}
                                        i18nKey={IsUnitAssistant.label}
                                    />
                                    {fieldValid.IsUnitAssistant && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Tập tin đính kèm - FileAttach */}
                        {FileAttach.visible && FileAttach.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Rec_JobVacancy_FileAttachment'}
                                    />
                                </View>
                                <View style={viewControl}>
                                    <VnrAttachFile
                                        disable={true}
                                        refresh={FileAttach.refresh}
                                        value={FileAttach.value}
                                        multiFile={true}
                                        uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                        onFinish={file => {
                                            this.setState({
                                                FileAttach: {
                                                    ...FileAttach,
                                                    value: file
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/*  Thông tin ngoài giờ mở rộng - AdvanceOverTimeInDay */}
                        {false && AdvanceOverTimeInDay.visible && AdvanceOverTimeInDay.visibleConfig && (
                            <View style={styles.styViewAllMore}>
                                {isShowInfoAdvance && (
                                    <View>
                                        {/* Khu vực làm ngoài giờ */}
                                        {OvertimeArea.visibleConfig && OvertimeArea.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={OvertimeArea.label}
                                                    />
                                                    {fieldValid.OvertimeArea && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrTextInput
                                                        disable={true}
                                                        refresh={OvertimeArea.refresh}
                                                        value={OvertimeArea.value}
                                                        style={[
                                                            styleSheets.text,
                                                            viewInputMultiline,
                                                            { backgroundColor: Colors.white }
                                                        ]}
                                                        multiline={true}
                                                        onChangeText={text => this.onChangeOvertimeArea(text)}
                                                    />
                                                </View>
                                            </View>
                                        )}

                                        {/* Yêu cầu thanh toán TCKC, Đăng ký ăn ngoài giờ - IsRequestForBenefit, IsSignUpToEat */}
                                        <View style={styles.styListBtnTypePregnancy}>
                                            {/* Yêu cầu thanh toán TCKC - IsRequestForBenefit */}
                                            {/* {IsRequestForBenefit.visibleConfig && IsRequestForBenefit.visible && (
                                                <TouchableOpacity
                                                    style={styles.styBtnTypePregnancy}
                                                    onPress={() => this.onCheckIsRequestForBenefit()}>
                                                    <CheckBox
                                                        checkBoxColor={Colors.black}
                                                        checkedCheckBoxColor={Colors.primary}
                                                        onClick={this.onCheckIsRequestForBenefit}
                                                        isChecked={IsRequestForBenefit.value}
                                                    />
                                                    <VnrText
                                                        style={[
                                                            styleSheets.text,
                                                            styles.styBtnTypePregnancyText
                                                        ]}
                                                        i18nKey={IsRequestForBenefit.label}
                                                    />
                                                </TouchableOpacity>
                                            )} */}

                                            {/* Đăng ký ăn ngoài giờ - IsSignUpToEat */}
                                            {IsSignUpToEat.visibleConfig && IsSignUpToEat.visible && (
                                                <TouchableOpacity
                                                    style={styles.styBtnTypePregnancy}
                                                    onPress={() => this.onCheckIsSignUpToEat()}
                                                >
                                                    <CheckBox
                                                        checkBoxColor={Colors.black}
                                                        checkedCheckBoxColor={Colors.primary}
                                                        onClick={this.onCheckIsSignUpToEat}
                                                        isChecked={IsSignUpToEat.value}
                                                    />
                                                    <VnrText
                                                        style={[styleSheets.text, styles.styBtnTypePregnancyText]}
                                                        i18nKey={IsSignUpToEat.label}
                                                    />
                                                </TouchableOpacity>
                                            )}

                                            {/* Yêu cầu vào/ra - IsRequestEntryExitGate */}
                                            {/* {IsRequestEntryExitGate.visibleConfig && IsRequestEntryExitGate.visible && (
                                                <TouchableOpacity
                                                    style={styles.styBtnTypePregnancy}
                                                    onPress={() => this.onCheckIsRequestEntryExitGate()}>
                                                    <CheckBox
                                                        checkBoxColor={Colors.black}
                                                        checkedCheckBoxColor={Colors.primary}
                                                        onClick={this.onCheckIsRequestEntryExitGate}
                                                        isChecked={IsRequestEntryExitGate.value}
                                                    />
                                                    <VnrText
                                                        style={[
                                                            styleSheets.text, styles.styBtnTypePregnancyText
                                                        ]}
                                                        i18nKey={IsRequestEntryExitGate.label}
                                                    />
                                                </TouchableOpacity>
                                            )} */}
                                        </View>

                                        {/* Gửi đến */}
                                        {SendToID.visibleConfig && SendToID.visible && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={SendToID.label}
                                                    />

                                                    {/* valid SendToID */}
                                                    {fieldValid.SendToID && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPickerQuickly
                                                        api={{
                                                            urlApi:
                                                                '[URI_HR]/Cat_GetData/GetMultiWorkPlaceCodeNameWhichEmailNotNull',
                                                            type: 'E_GET'
                                                        }}
                                                        value={SendToID.value}
                                                        refresh={SendToID.refresh}
                                                        textField="WorkPlaceName"
                                                        valueField="ID"
                                                        filter={false}
                                                        filterServer={false}
                                                        disable={true}
                                                        onFinish={item => this.onPickSendToID(item)}
                                                    />
                                                </View>
                                            </View>
                                        )}
                                        {/* Yêu cầu tuyến xe */}
                                        <View style={styles.styViewBlock}>
                                            <TouchableOpacity
                                                style={styles.styBtnShowHide}
                                                onPress={() => this.onCheckIsRequestShuttleCar()}
                                            >
                                                <VnrText style={[styleSheets.text]} i18nKey={'HRM_RequestShuttleCar'} />
                                                {IsRequestShuttleCar.value ? (
                                                    <IconMinus size={Size.iconSize - 3} color={Colors.primary} />
                                                ) : (
                                                    <IconPlus size={Size.iconSize - 3} color={Colors.primary} />
                                                )}
                                            </TouchableOpacity>

                                            {/* Loại công việc, Địa điểm */}
                                            {IsRequestShuttleCar.value && (
                                                <View style={styles.styViewInfoBlock}>
                                                    {/* Loại công việc */}
                                                    {JobTypeID.visibleConfig && JobTypeID.visible && (
                                                        <View style={contentViewControl}>
                                                            <View style={viewLable}>
                                                                <VnrText
                                                                    style={[styleSheets.text, textLableInfo]}
                                                                    i18nKey={JobTypeID.label}
                                                                />

                                                                {/* valid JobTypeID */}
                                                                {fieldValid.JobTypeID && (
                                                                    <VnrText
                                                                        style={styleValid}
                                                                        i18nKey={'HRM_Valid_Char'}
                                                                    />
                                                                )}
                                                            </View>
                                                            <View style={viewControl}>
                                                                <VnrPicker
                                                                    api={{
                                                                        urlApi:
                                                                            '[URI_HR]/Cat_GetData/GetMultiJobTypeByCodeName',
                                                                        type: 'E_GET'
                                                                    }}
                                                                    refresh={JobTypeID.refresh}
                                                                    textField="JobTypeName"
                                                                    valueField="ID"
                                                                    filter={true}
                                                                    filterServer={true}
                                                                    value={JobTypeID.value}
                                                                    filterParams="text"
                                                                    disable={true}
                                                                    onFinish={item => this.onChangeJobTypeID(item)}
                                                                />
                                                            </View>
                                                        </View>
                                                    )}

                                                    {/* RequestParking - Yêu cầu xếp xe không theo tuyến */}
                                                    {RequestParking.visibleConfig && RequestParking.visible && (
                                                        <View style={contentViewControl}>
                                                            <View style={viewLable}>
                                                                <VnrText
                                                                    style={[styleSheets.text, textLableInfo]}
                                                                    i18nKey={RequestParking.label}
                                                                />

                                                                {fieldValid.RequestParking && (
                                                                    <VnrText
                                                                        style={styleValid}
                                                                        i18nKey={'HRM_Valid_Char'}
                                                                    />
                                                                )}
                                                            </View>
                                                            <View style={viewControl}>
                                                                <VnrTextInput
                                                                    disable={true}
                                                                    refresh={RequestParking.refresh}
                                                                    value={RequestParking.value}
                                                                    style={[styleSheets.text, viewInputMultiline]}
                                                                    multiline={true}
                                                                    onChangeText={text =>
                                                                        this.onChangeRequestParking(text)
                                                                    }
                                                                />
                                                            </View>
                                                        </View>
                                                    )}

                                                    {/* Địa điểm */}
                                                    <View style={contentViewControl}>
                                                        <View style={viewLable}>
                                                            <VnrText
                                                                style={[styleSheets.text, textLableInfo]}
                                                                i18nKey={Place.label}
                                                            />
                                                            {fieldValid.Place && (
                                                                <VnrText
                                                                    style={styleValid}
                                                                    i18nKey={'HRM_Valid_Char'}
                                                                />
                                                            )}
                                                        </View>
                                                        <View style={viewControl}>
                                                            <VnrTextInput
                                                                disable={true}
                                                                refresh={Place.refresh}
                                                                value={Place.value}
                                                                style={[styleSheets.text, viewInputMultiline]}
                                                                multiline={true}
                                                                onChangeText={text => this.onChangePlace(text)}
                                                            />
                                                        </View>
                                                    </View>
                                                </View>
                                            )}
                                        </View>
                                    </View>
                                )}

                                <View
                                    style={contentViewControl}
                                    onLayout={event => (this.layoutViewInfoMore = event.nativeEvent.layout)}
                                >
                                    <TouchableOpacity
                                        style={viewBtnShowHideUser}
                                        onPress={() =>
                                            this.setState(
                                                {
                                                    AdvanceOverTimeInDay: {
                                                        ...AdvanceOverTimeInDay,
                                                        isShowInfoAdvance: !isShowInfoAdvance
                                                    }
                                                },
                                                () => {
                                                    setTimeout(() => {
                                                        this.layoutViewInfoMore !== null &&
                                                            this.scrollViewRef.scrollToPosition(
                                                                0,
                                                                this.layoutViewInfoMore.y + 1000
                                                            );
                                                    }, 0);
                                                }
                                            )
                                        }
                                    >
                                        {isShowInfoAdvance ? (
                                            <IconUp size={Size.iconSize - 3} color={Colors.primary} />
                                        ) : (
                                            <IconDown size={Size.iconSize - 3} color={Colors.primary} />
                                        )}
                                        <VnrText
                                            style={[styleSheets.lable, viewBtnShowHideUser_text]}
                                            i18nKey={
                                                isShowInfoAdvance
                                                    ? 'HRM_PortalApp_Colspan_Info'
                                                    : 'HRM_PortalApp_Expand_Info'
                                            }
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}

                        {/* Lý do yêu cầu hủy -  RequestCancelReason*/}
                        {RequestCancelReason.visibleConfig && RequestCancelReason.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={RequestCancelReason.label}
                                    />
                                    {fieldValid.RequestCancelReason && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={true}
                                        refresh={RequestCancelReason.refresh}
                                        value={RequestCancelReason.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={text =>
                                            this.setState({
                                                RequestCancelReason: {
                                                    ...RequestCancelReason,
                                                    value: text,
                                                    refresh: !RequestCancelReason.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}
                    </KeyboardAwareScrollView>

                    {/* số giờ lũy kế */}
                    {false &&
                        PermissionForAppMobile &&
                        PermissionForAppMobile.value['Att_OvertimePlan_btnViewAccumulation'] &&
                        PermissionForAppMobile.value['Att_OvertimePlan_btnViewAccumulation']['View'] && (
                        <TouchableOpacity
                            style={styles.viewTime}
                            activeOpacity={WorkDate.value !== null ? 0.6 : 1}
                            onPress={() => (WorkDate.value !== null ? this.openModalPlanLimit() : null)}
                        >
                            <IconTime
                                size={Size.text + 3}
                                color={WorkDate.value !== null ? Colors.black : Colors.gray_7}
                            />

                            <VnrText
                                style={[
                                    styleSheets.lable,
                                    styles.groupButton__text__view,
                                    {
                                        color: WorkDate.value !== null ? Colors.black : Colors.gray_7
                                    }
                                ]}
                                i18nKey={'HRM_Common_ViewLimit'}
                            />
                        </TouchableOpacity>
                    )}

                    <ListButtonSave listActions={listActions} />

                    {dataPlanLimit.modalVisiblePlanLimit && (
                        <Modal
                            onBackButtonPress={() => this.closeModalPlanLimit()}
                            isVisible={true}
                            onBackdropPress={() => this.closeModalPlanLimit()}
                            customBackdrop={
                                <TouchableWithoutFeedback onPress={() => this.closeModalPlanLimit()}>
                                    <View
                                        style={styleSheets.coatingOpacity05}
                                    />
                                </TouchableWithoutFeedback>
                            }
                            style={CustomStyleSheet.margin(0)}
                        >
                            <View style={stylesModalPopupBottom.viewModalTime}>
                                <SafeAreaView {...styleSafeAreaView} style={stylesModalPopupBottom.safeRadius}>
                                    <View style={styles.headerCloseModal}>
                                        <IconColse color={Colors.white} size={Size.iconSize} />
                                        <VnrText style={styleSheets.lable} i18nKey={'HRM_Common_ViewLimit'} />
                                        <TouchableOpacity onPress={() => this.closeModalPlanLimit()}>
                                            <IconCancel color={Colors.black} size={Size.iconSize} />
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView style={styleSheets.flexGrow1flexDirectionColumn}>
                                        {this.viewListItemPlanLimitTime()}
                                    </ScrollView>
                                </SafeAreaView>
                            </View>
                        </Modal>
                    )}

                    {modalLimit.isModalVisible && (
                        <Modal
                            onBackButtonPress={() => this.closeModal()}
                            isVisible={true}
                            onBackdropPress={() => this.closeModal()}
                            customBackdrop={
                                <TouchableWithoutFeedback onPress={() => this.closeModal()}>
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
                                        <VnrText style={styleSheets.lable} i18nKey={'Hrm_Notification'} />
                                        <TouchableOpacity onPress={() => this.closeModal()}>
                                            <IconColse color={Colors.grey} size={Size.iconSize} />
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView style={styleSheets.flexGrow1flexDirectionColumn}>
                                        {this.viewListItemLimit()}
                                    </ScrollView>
                                    <View style={styles.groupButton}>
                                        <TouchableOpacity onPress={() => this.closeModal()} style={styles.btnClose}>
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
    headerCloseModal: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
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
    styViewAllMore: {
        backgroundColor: Colors.gray_2,
        paddingVertical: Size.defineSpace
    },
    styViewBlock: {
        marginBottom: Size.defineSpace,
        backgroundColor: Colors.white
    },
    styViewInfoBlock: {
        marginBottom: Size.defineHalfSpace
    },
    styBtnShowHide: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        paddingHorizontal: Size.defineSpace,
        height: Size.heightInput,
        alignItems: 'center'
    },
    styListBtnTypePregnancy: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: Size.defineSpace,
        justifyContent: 'space-between',
        marginVertical: Size.defineHalfSpace
    },
    styBtnTypePregnancy: {
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 11,
        marginBottom: Size.defineHalfSpace
    },
    styBtnTypePregnancyText: {
        color: Colors.gray_10,
        marginLeft: 6
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
    styleViewBorderButtom: {
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.borderColor,
        flex: 1,
        marginBottom: 0.5,
        marginHorizontal: 10,
        paddingVertical: 10
    },
    viewTextTimeWithBorder: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        padding: styleSheets.p_15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor
    },
    viewTextTimeWithoutBorder: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        padding: styleSheets.p_15
    },
    viewTime: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 35,
        paddingTop: 5
    },
    groupButton__text__view: {
        paddingLeft: styleSheets.p_7
    },
    styViewLeaveDayCount: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -10
    },
    styViewLeaveDayCountLable: {
        color: Colors.gray_9,
        fontSize: Size.text - 1
    },
    styViewLeaveDayCountValue: {
        fontWeight: '600',
        color: Colors.primary,
        fontSize: Size.text - 1
    },
    // eslint-disable-next-line react-native/no-unused-styles
    fontText: {
        fontSize: Size.text - 1
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
    }
});
