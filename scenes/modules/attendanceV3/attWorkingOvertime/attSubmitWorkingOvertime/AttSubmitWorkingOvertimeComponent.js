import React, { Component } from 'react';
import { View, TouchableOpacity, Text, Platform } from 'react-native';
import {
    Colors,
    Size,
    styleSheets,
    stylesVnrPickerV3,
    stylesListPickerControl,
    styleValid,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrDate from '../../../../../componentsV3/VnrDate/VnrDate';
import VnrTextInput from '../../../../../componentsV3/VnrTextInput/VnrTextInput';
import HttpService from '../../../../../utils/HttpService';
import { EnumName } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import moment from 'moment';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import VnrPickerLittle from '../../../../../componentsV3/VnrPickerLittle/VnrPickerLittle';
import VnrSwitch from '../../../../../componentsV3/VnrSwitch/VnrSwitch';
import { translate } from '../../../../../i18n/translate';
import VnrDateFromTo from '../../../../../componentsV3/VnrDateFromTo/VnrDateFromTo';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';
import CheckBox from 'react-native-check-box';
import { IconCreate } from '../../../../../constants/Icons';
import VnrTreeView from '../../../../../componentsV3/VnrTreeView/VnrTreeView';
import VnrPickerQuickly from '../../../../../componentsV3/VnrPickerQuickly/VnrPickerQuickly';

const configOrgStructureTransID = {
    textField: 'Name',
    valueField: 'id'
};

const initSateDefault = {
    modalLimit: {
        isModalVisible: false,
        data: []
    },
    isRefesh: false,
    isChoseProfile: true,
    CheckProfilesExclude: false,
    Profiles: {
        ID: null,
        ProfileName: '',
        disable: true
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
        }
    },
    Profile: {
        ID: null,
        ProfileName: ''
    },
    WorkDate: {
        value: null,
        lable: 'HRM_PortalApp_AttLeaveFund_OvertimeDate',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    IsGetShiftByProfile: {
        visible: true,
        visibleConfig: false,
        refresh: false,
        value: false,
        disable: false
    },
    ShiftID: {
        lable: 'HRM_Attendance_InOut_ShiftID',
        disable: false,
        refresh: false,
        value: null,
        data: [],
        visible: false,
        visibleConfig: false
    },
    TempShiftID: {
        disable: false,
        refresh: false,
        value: null,
        data: [],
        visible: false,
        visibleConfig: true
    },
    DurationType: {
        lable: 'lblform_PersonalSubmitOverTimeInfo_DurationType',
        disable: false,
        refresh: false,
        value: null,
        data: [],
        visible: false,
        visibleConfig: true
    },
    IsOverTimeBreak: {
        lable: 'HRM_PortalApp_OTOnBreakTime',
        refresh: false,
        disable: false,
        value: false,
        visible: true,
        visibleConfig: true
    },
    OvertimeTypeID: {
        lable: 'HRM_PortalApp_TypeOverTime',
        disable: false,
        refresh: false,
        value: null,
        data: null,
        visible: true,
        visibleConfig: true
    },
    TimeFrom: {
        lable: 'HRM_PortalApp_TSLRegister_InTime',
        value: null,
        refresh: false,
        disable: false,
        visible: false,
        visibleConfig: true
    },
    TimeTo: {
        lable: 'HRM_PortalApp_TSLRegister_OutTime',
        value: null,
        refresh: false,
        disable: false,
        visible: false,
        visibleConfig: true
    },
    RegisterHours: {
        disable: false,
        data: null,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    RegisterHoursConfig: {
        disable: false,
        refresh: false,
        value: null,
        data: [],
        visible: false,
        visibleConfig: true
    },
    IsNotCheckInOut: {
        lable: 'HRM_PortalApp_IsNotCheckInOut',
        refresh: false,
        disable: false,
        value: false,
        visible: true,
        visibleConfig: true
    },
    MethodPayment: {
        lable: 'lblform_PersonalSubmitOverTimeInfo_MethodPayment',
        visible: true,
        visibleConfig: true,
        refresh: false,
        value: null,
        data: []
    },
    JobTypeID: {
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null,
        data: []
    },
    ReasonOT: {
        lable: 'HRM_PortalApp_ReasonOvertime',
        visible: true,
        visibleConfig: true,
        disable: false,
        value: '',
        refresh: false
    },
    FileAttachment: {
        lable: 'HRM_PortalApp_TakeLeave_FileAttachment',
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },
    UserApprove: {
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },
    UserApprove3: {
        visible: false,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },
    UserApprove4: {
        visible: false,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },
    UserApprove2: {
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },
    UserComment1: {
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },
    UserComment2: {
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },
    UserComment3: {
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },
    UserComment4: {
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },
    currDataAnalysic: [],
    isVisibleAnalysic: false,
    fieldValid: {},
    DateFromTo: {
        refresh: false,
        disable: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    RegisterByHours: {
        refresh: false,
        disable: false,
        value: false,
        visible: false,
        visibleConfig: true
    },
    HoursOverTime: null,
    params: null,
    isShowModal: false,
    workDateAllowe: null,
    isRefreshState: false,
    OvertimeReasonID: {
        lable: 'HRM_Attendance_Overtime_OvertimeList_ReasonOT',
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null,
        data: []
    },
    isError: false,

    // Other Information

    isOtherInformation: false,
    isShowBtnOtherInformation: false,

    IsUnitAssistant: {
        lable: 'HRM_Attendance_IsUnitAssistant',
        refresh: false,
        disable: false,
        value: false,
        visible: true,
        visibleConfig: true
    },

    IsSignUpToEat: {
        lable: 'HRM_RequestOTMeal',
        refresh: false,
        disable: false,
        value: false,
        visible: true,
        visibleConfig: true
    },

    IsRequestForBenefit: {
        lable: 'HRM_RequestEmergencyAllowancePayment',
        refresh: false,
        disable: false,
        value: false,
        visible: true,
        visibleConfig: true
    },

    IsRequestEntryExitGate: {
        lable: 'HRM_RequestEntryExiGate',
        refresh: false,
        disable: false,
        value: false,
        visible: true,
        visibleConfig: true
    },

    BusinessUnitTypeID: {
        lable: 'HRM_Portal_Att_TimesheetEvaluation_BusinessUnitTypeName',
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null,
        data: null
    },

    BusinessUnitID: {
        lable: 'HRM_Payroll_Sal_SeveranceAllowance_ShopID',
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null,
        data: null
    },

    SendToID: {
        lable: 'HRM_Category_HeadcountOrg_MailToHeadcount_code',
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null,
        data: null
    },

    OvertimeArea: {
        lable: 'HRM_OTWorkingArea',
        visible: true,
        visibleConfig: true,
        disable: false,
        value: '',
        refresh: false
    },
    IsIncludeBenefitsHours: {
        label: 'HRM_Attendance_Overtime_IsIncludeBenefitsHours',
        PregnancyHours: '',
        PregnanyType: '',
        BenefitsMessage: '',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: false
    },
    TransferDepartment: {
        lable: 'HRM_PortalApp_TransferDepartment',
        disable: false,
        refresh: false,
        value: null,
        data: [],
        visible: true,
        visibleConfig: true
    },

    // task 0166648: [TB W47][APP] [Hotfix HRM.8.11.27] Thêm tính năng đăng ký tăng ca theo khung giờ cấu hình
    isRegisterOvertimeByTimeConfig: false,

    Emp: {
        lable: 'HRM_PortalApp_Employee',
        disable: false,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true,
        data: []
    },
    OvertimeHour: {
        lable: 'HRM_PortalApp_OvertimeHour',
        value: null,
        refresh: false,
        disable: false,
        visible: true,
        visibleConfig: true
    },
    WorkPlace: {
        lable: 'HRM_PortalApp_TSLRegister_PlaceID',
        visible: true,
        visibleConfig: true,
        disable: false,
        value: '',
        refresh: false
    },

    WorkPlan: {
        lable: 'HRM_PortalApp_OT_WorkPlan',
        visible: true,
        visibleConfig: true,
        disable: false,
        value: '',
        refresh: false
    },

    InfoHour: {
        visible: false
    }
};

class AttSubmitWorkingOvertimeComponent extends Component {
    constructor(props) {
        super(props);
        this.state = initSateDefault;

        this.focusTextInput = null;

        // show or hide SimilarRegistration
        this.isStatusVnrDateFromTo = props.isStatusVnrDateFromTo;
        this.layoutHeightItem = null;
        this.maxTimeRegister = {
            maxEndOT: null,
            minStartOT: null
        };
    }

    componentDidMount() {
        this.initState();
    }

    // Get Type Register
    getTypeRegister = () => {
        const { WorkDate, Profiles, DurationType } = this.state;

        HttpService.Post('[URI_CENTER]/api/Att_GetData/GetOvertimeDurationTypeByDate', {
            WorkDate: WorkDate.value ? WorkDate.value : null,
            profileID: Profiles.ID ? Profiles.ID : null
        })
            .then((res) => {
                if (res && res.Status === 'SUCCESS') {
                    if (res.Data && Array.isArray(res.Data) && res.Data.length > 0) {
                        this.setState({
                            DurationType: {
                                ...DurationType,
                                value: {
                                    ...res.Data.find((value) => {
                                        return value.ID === 'E_OT_LATE';
                                    }),
                                    Checked: true
                                },
                                data: res.Data,
                                disabled: false,
                                refresh: !DurationType.refresh
                            }
                        });
                    }
                }
            })
            .catch(() => {
                this.props.ToasterSevice().showWarning(translate('HRM_Message_GetDataServices_Error'), 3000);
            });
    };

    //change ngày công
    onChangeWorkDate = (item) => {
        const { WorkDate } = this.state;
        let nextState = {
            WorkDate: {
                ...WorkDate,
                value: item,
                refresh: !WorkDate.refresh
            }
        };

        this.setState(nextState, () => {
            return this.checkExistsShift(item);
        });
    };

    // Step 1: Khởi tạo dữ liệu
    initState = async () => {
        const { record, value, fieldConfig, isPassRecord } = this.props,
            { Profiles, isRefreshState, WorkDate, Profile, RegisterByHours, IsOverTimeBreak } = this.state;
        const profileInfo = dataVnrStorage
            ? dataVnrStorage.currentUser
                ? dataVnrStorage.currentUser.info
                : null
            : null;

        let isShowBtnOtherInformation = false;

        if (
            fieldConfig?.IsRequestEntryExitGate?.visibleConfig ||
            fieldConfig?.IsRequestForBenefit?.visibleConfig ||
            fieldConfig?.IsSignUpToEat?.visibleConfig ||
            fieldConfig?.IsUnitAssistant?.visibleConfig ||
            fieldConfig?.SendToID?.visibleConfig ||
            fieldConfig?.BusinessUnitID?.visibleConfig ||
            fieldConfig?.BusinessUnitTypeID?.visibleConfig ||
            fieldConfig?.OvertimeArea?.visibleConfig
        ) {
            isShowBtnOtherInformation = true;
        }

        const { E_ProfileID, E_FullName } = EnumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] };
        if (record && !isPassRecord) {
            const {
                    FileAttachment,
                    TimeFrom,
                    TimeTo,
                    RegisterHours,
                    DurationType,
                    OvertimeTypeID,
                    ShiftID,
                    ReasonOT,
                    MethodPayment,
                    IsRequestEntryExitGate,
                    IsRequestForBenefit,
                    IsSignUpToEat,
                    IsUnitAssistant,
                    SendToID,
                    BusinessUnitID,
                    BusinessUnitTypeID,
                    OvertimeArea,
                    OvertimeReasonID,
                    TransferDepartment,
                    IsIncludeBenefitsHours,
                    IsNotCheckInOut
                } = this.state,
                workDateFormat = record.WorkDateRoot ? moment(record.WorkDateRoot).format('YYYY-MM-DD') : null;
            // Modify
            let nextState = {
                isShowBtnOtherInformation: isShowBtnOtherInformation,
                isRefreshState: !isRefreshState,
                Profile: {
                    ...Profile,
                    ..._profile
                },
                Profiles: {
                    ...Profiles,
                    ..._profile
                },
                WorkDate: {
                    ...WorkDate,
                    value: record && record.WorkDate ? [moment(record.WorkDate).format('YYYY-MM-DD')] : null,
                    refresh: !WorkDate.refresh
                },
                RegisterHours: {
                    ...RegisterHours,
                    value: record && record.RegisterHours ? record.RegisterHours : null,
                    refresh: !RegisterHours.refresh
                },
                TimeFrom: {
                    ...TimeFrom,
                    // Optimal code: Before: new Date(`${moment(record.WorkDate).format("YYYY-MM-DD")} ${record.StartOtString}`)
                    // => present: moment(record.WorkDateRoot).add(moment.duration(record.StartOtString)) ===> auto return to format moment
                    value:
                        record && record.StartOtString && workDateFormat
                            ? moment(workDateFormat).add(moment.duration(record.StartOtString))
                            : null,
                    refresh: !TimeFrom.refresh
                },
                TimeTo: {
                    ...TimeTo,
                    // Optimal code: Before: new Date(`${moment(new Date(record.WorkDate)).format("YYYY-MM-DD")} ${record.EndOTString}`)
                    // => present: moment(record.WorkDateRoot).add(moment.duration(record.EndOTString)) ===> auto return to format moment
                    value:
                        record && record.EndOTString && workDateFormat
                            ? moment(workDateFormat).add(moment.duration(record.EndOTString))
                            : null,
                    refresh: !TimeTo.refresh
                },
                ShiftID: {
                    ...ShiftID,
                    disable: true,
                    refresh: !ShiftID.refresh,
                    visible: true,
                    value: record.ShiftID
                        ? {
                            ID: record.ShiftID,
                            ShiftName: `${record?.ShiftCode ? record?.ShiftCode + ' - ' : ''}${record.ShiftName}`
                        }
                        : null,
                    data: record.ShiftID
                        ? [
                            {
                                ID: record.ShiftID,
                                ShiftName: record.ShiftName
                            }
                        ]
                        : []
                },
                ReasonOT: {
                    ...ReasonOT,
                    value: record.ReasonOT ? record.ReasonOT : '',
                    refresh: !ReasonOT.refresh
                },
                OvertimeReasonID: {
                    ...OvertimeReasonID,
                    value: record.OvertimeReasonID
                        ? { ID: record.OvertimeReasonID, OvertimeReasonName: record.OvertimeReasonName }
                        : null,
                    refresh: !OvertimeReasonID.refresh
                },
                IsIncludeBenefitsHours: {
                    ...IsIncludeBenefitsHours,
                    value: record?.IsIncludeBenefitsHours,
                    BenefitsMessage: record?.BenefitsMessage ? record?.BenefitsMessage : '',
                    PregnancyHours: record?.PregnancyHours ? record?.PregnancyHours : '',
                    PregnanyType: record?.PregnanyType ? record?.PregnanyType : '',
                    visible: record?.IsIncludeBenefitsHours,
                    refresh: !IsIncludeBenefitsHours.refresh
                },
                TransferDepartment: {
                    ...TransferDepartment,
                    value: record.OrgStructureTransID ? [{
                        id: record.OrgStructureTransID,
                        Name: record.OrgStructureTransName
                    }] : null,
                    refresh: !TransferDepartment.refresh
                },
                IsOverTimeBreak: {
                    ...IsOverTimeBreak,
                    value: record?.IsOverTimeBreak,
                    refresh: !IsOverTimeBreak.refresh
                },
                IsNotCheckInOut: {
                    ...IsNotCheckInOut,
                    value: record?.IsNotCheckInOut,
                    refresh: !IsNotCheckInOut.refresh
                }
            };

            // 	0186001: [TB W42][hot fix LTP_v8.12.30.01.08] Tách từ task 185934 Task APP
            if (record?.MaxEndHourOT)
                this.maxTimeRegister = {
                    ...this.maxTimeRegister,
                    maxEndOT: new Date(
                        `${moment(record.WorkDate).format('YYYY-MM-DD')} ${record?.MaxEndHourOT}`)
                };

            if (record?.MinStartHourOT)
                this.maxTimeRegister = {
                    ...this.maxTimeRegister,
                    minStartOT: new Date(
                        `${moment(record.WorkDate).format('YYYY-MM-DD')} ${record?.MinStartHourOT}`)
                };


            // nhan.nguyen: task: 	0166648: [APP] [Hotfix HRM.8.11.27] Thêm tính năng đăng ký tăng ca theo khung giờ cấu hình
            if (typeof record?.ListRegisterHours === 'string' && record?.ListRegisterHours.length > 0) {
                let data = [];
                record?.ListRegisterHours.split(',').map((item) => {
                    data.push({
                        Value: item
                    });
                });
                nextState = {
                    ...nextState,
                    RegisterByHours: {
                        ...RegisterByHours,
                        value: true,
                        disable: true,
                        refresh: !RegisterByHours.refresh
                    },
                    RegisterHours: {
                        ...nextState.RegisterHours,
                        data
                    },
                    isRegisterOvertimeByTimeConfig: true
                };
            } else {
                nextState = {
                    ...nextState,
                    RegisterByHours: {
                        ...RegisterByHours,
                        disable: false,
                        refresh: !RegisterByHours.refresh
                    },
                    isRegisterOvertimeByTimeConfig: false
                };
            }

            if (
                record.IsRequestEntryExitGate ||
                record.IsRequestForBenefit ||
                record.IsSignUpToEat ||
                record.IsUnitAssistant ||
                record.SendToID ||
                record.BusinessUnitID ||
                record.BusinessUnitTypeID ||
                record.OvertimeArea ||
                record?.IsOverTimeBreak
            ) {
                nextState = {
                    ...nextState,
                    IsRequestEntryExitGate: {
                        ...IsRequestEntryExitGate,
                        value: record.IsRequestEntryExitGate,
                        refresh: !IsRequestEntryExitGate.refresh
                    },
                    IsRequestForBenefit: {
                        ...IsRequestForBenefit,
                        value: record.IsRequestForBenefit,
                        refresh: !IsRequestForBenefit.refresh
                    },
                    IsSignUpToEat: {
                        ...IsSignUpToEat,
                        value: record.IsSignUpToEat,
                        refresh: !IsSignUpToEat.refresh
                    },
                    IsUnitAssistant: {
                        ...IsUnitAssistant,
                        value: record.IsUnitAssistant,
                        refresh: !IsUnitAssistant.refresh
                    },
                    SendToID: {
                        ...SendToID,
                        value: record.SendToID ? { ID: record.SendToID, WorkPlaceName: record.SendToView } : null,
                        refresh: !SendToID.refresh
                    },
                    BusinessUnitID: {
                        ...BusinessUnitID,
                        value: record.BusinessUnitID
                            ? { ID: record.BusinessUnitID, ShopName: record.BusinessUnitView }
                            : null,
                        refresh: !BusinessUnitID.refresh
                    },
                    BusinessUnitTypeID: {
                        ...BusinessUnitTypeID,
                        value: record.BusinessUnitTypeID
                            ? { ID: record.BusinessUnitTypeID, ShopGroupView: record.BusinessUnitTypeView }
                            : null,
                        refresh: !BusinessUnitTypeID.refresh
                    },
                    OvertimeArea: {
                        ...OvertimeArea,
                        value: record.OvertimeArea ? record.OvertimeArea : '',
                        refresh: !OvertimeArea.refresh
                    },
                    IsOverTimeBreak: {
                        ...IsOverTimeBreak,
                        value: record.IsOverTimeBreak,
                        refresh: !IsOverTimeBreak.refresh
                    }
                };
            }

            this.showLoading(true);
            await HttpService.MultiRequest([
                HttpService.Post('[URI_CENTER]/api/Att_GetData/GetOvertimeDurationTypeByDate', {
                    WorkDate: record.WorkDate ? moment(record.WorkDate).format('YYYY-MM-DD') : null,
                    profileID: _profile.ID
                }),
                HttpService.Post('[URI_CENTER]/api/Att_GetData/GetMultiOvertimeTypeByTimeLine', {
                    WorkDate: record.WorkDate ? moment(record.WorkDate).format('YYYY-MM-DD') : null,
                    profileID: _profile.ID
                }),
                HttpService.Get('[URI_CENTER]/api/Att_GetData/GetEnum?text=MethodPayment')
            ])
                .then((resAll) => {
                    this.showLoading(false);
                    if (resAll && Array.isArray(resAll) && resAll.length > 0) {
                        const [resDurationOverTime, resTypeOverTime, resMethodPayment] = resAll;
                        if (
                            resDurationOverTime &&
                            resDurationOverTime.Status === 'SUCCESS' &&
                            resDurationOverTime.Data &&
                            Array.isArray(resDurationOverTime.Data)
                        ) {
                            let valueDurationDefault = null;
                            resDurationOverTime.Data.map((item) => {
                                if (item.ID === record.DurationType) {
                                    valueDurationDefault = item;
                                }
                            });
                            nextState = {
                                ...nextState,
                                DurationType: {
                                    ...DurationType,
                                    data: resDurationOverTime.Data,
                                    value: valueDurationDefault,
                                    refresh: !DurationType.refresh
                                },
                                workDateAllowe: [record.WorkDateRoot ? moment(record.WorkDateRoot) : null] //.format("YYYY-MM-DD")
                            };
                        }
                        if (
                            resTypeOverTime &&
                            resTypeOverTime.Status === 'SUCCESS' &&
                            resTypeOverTime.Data &&
                            Array.isArray(resTypeOverTime.Data)
                        ) {
                            let valueTypeOT = null;
                            resTypeOverTime.Data.map((item) => {
                                if (item.ID === record.OvertimeTypeID) {
                                    valueTypeOT = item;
                                }
                            });
                            nextState = {
                                ...nextState,
                                OvertimeTypeID: {
                                    ...OvertimeTypeID,
                                    value: valueTypeOT,
                                    data: resTypeOverTime.Data,
                                    refresh: !OvertimeTypeID.refresh
                                }
                            };
                        }
                        if (
                            resMethodPayment &&
                            resMethodPayment.Status === 'SUCCESS' &&
                            resMethodPayment.Data &&
                            Array.isArray(resMethodPayment.Data)
                        ) {
                            let valueMethodPayment = null;
                            resMethodPayment.Data.map((item) => {
                                if (item.Value === record.MethodPayment) {
                                    valueMethodPayment = item;
                                }
                            });
                            nextState = {
                                ...nextState,
                                MethodPayment: {
                                    ...MethodPayment,
                                    value: valueMethodPayment,
                                    refresh: !MethodPayment.refresh
                                }
                            };
                        }

                    }
                })
                .catch(() => {
                    this.props.ToasterSevice().showWarning(translate('HRM_Message_GetDataServices_Error'), 3000);
                });

            // Value Acttachment
            if (record.FileAttachment) {
                let valFile = ManageFileSevice.setFileAttachApp(record.FileAttachment);

                nextState = {
                    ...nextState,
                    FileAttachment: {
                        ...FileAttachment,
                        disable: false,
                        value: valFile && valFile.length > 0 ? valFile : null,
                        refresh: !FileAttachment.refresh
                    }
                };
            } else {
                nextState = {
                    ...nextState,
                    FileAttachment: {
                        ...FileAttachment,
                        disable: false,
                        value: null,
                        refresh: !FileAttachment.refresh
                    }
                };
            }

            this.setState(nextState, () => {
                this.checkExistsShift([moment(record.WorkDate).format('YYYY-MM-DD')]);
            });
        } else {
            this.setState(
                {
                    ...initSateDefault,
                    isShowBtnOtherInformation: false,
                    Profiles: {
                        ...Profiles,
                        ..._profile
                    },
                    isRefreshState: !isRefreshState
                },
                () => {
                    this.checkExistsShift(value);
                    this.getProfileDetailForAttendance();
                }
            );
        }
    };

    //#region [chọn phương thức thah toán]
    onPickerChangeMethodPayment = (item) => {
        const { MethodPayment } = this.state;
        this.setState({
            MethodPayment: {
                ...MethodPayment,
                value: item ? { ...item } : null,
                refresh: !MethodPayment.refresh
            }
        });
    };

    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextProps.isRefresh !== this.props.isRefresh ||
            nextProps.isPassRecord !== this.props.isPassRecord ||
            nextProps.isStatusVnrDateFromTo !== this.props.isStatusVnrDateFromTo ||
            nextProps.isSimilarRegistration !== this.props.isSimilarRegistration ||
            Vnr_Function.compare(nextProps.value, this.props.value) === false ||
            Vnr_Function.compare(nextState.WorkDate.value, this.state.WorkDate.value) === false ||
            nextState.DurationType.value !== this.state.DurationType.value ||
            nextState.RegisterByHours.value !== this.state.RegisterByHours.value ||
            nextState.RegisterHours.value !== this.state.RegisterHours.value ||
            nextState.TimeFrom.value !== this.state.TimeFrom.value ||
            nextState.TimeTo.value !== this.state.TimeTo.value ||
            nextState.OvertimeTypeID.value !== this.state.OvertimeTypeID.value ||
            nextState.MethodPayment.value !== this.state.MethodPayment.value ||
            Vnr_Function.compare(nextState.TransferDepartment.value, this.state.TransferDepartment.value) === false ||
            nextState.TransferDepartment.refresh !== this.state.TransferDepartment.refresh ||
            Vnr_Function.compare(nextState.MethodPayment.data, this.state.MethodPayment.data) === false ||
            nextState.ReasonOT.value !== this.state.ReasonOT.value ||
            nextState.FileAttachment.value !== this.state.FileAttachment.value ||
            nextState.OvertimeReasonID.value !== this.state.OvertimeReasonID.value ||
            nextState.isError !== this.state.isError ||
            nextState.IsUnitAssistant.value !== this.state.IsUnitAssistant.value ||
            nextState.IsSignUpToEat.value !== this.state.IsSignUpToEat.value ||
            nextState.IsRequestForBenefit.value !== this.state.IsRequestForBenefit.value ||
            nextState.IsRequestEntryExitGate.value !== this.state.IsRequestEntryExitGate.value ||
            nextState.BusinessUnitTypeID.value !== this.state.BusinessUnitTypeID.value ||
            nextState.BusinessUnitID.value !== this.state.BusinessUnitID.value ||
            nextState.SendToID.value !== this.state.SendToID.value ||
            nextState.isOtherInformation !== this.state.isOtherInformation ||
            nextState.OvertimeArea.value !== this.state.OvertimeArea.value ||
            nextState.isShowBtnOtherInformation !== this.state.isShowBtnOtherInformation ||
            Vnr_Function.compare(nextState.IsIncludeBenefitsHours, this.state.IsIncludeBenefitsHours) === false ||
            nextState.IsOverTimeBreak.value !== this.state.IsOverTimeBreak.value ||
            nextState.IsNotCheckInOut.value !== this.state.IsNotCheckInOut.value
        ) {
            return true;
        } else {
            return false;
        }
    }

    //#region [chọn Giờ bắt đầu tăng ca - TimeFrom, TimeTo]
    onTimeChangeWorkDateIn = (time) => {
        const { TimeFrom, TimeTo, isRegisterOvertimeByTimeConfig, RegisterByHours, DurationType, RegisterHours } = this.state;

        // 	0186001: [TB W42][hot fix LTP_v8.12.30.01.08] Tách từ task 185934 Task APP
        let tempTime = time;
        if (DurationType.value?.ID === 'E_OT_LATE'
            && (!!this.maxTimeRegister.minStartOT)
            && (moment(time, 'HH:mm').isBefore(moment(this.maxTimeRegister.minStartOT, 'HH:mm')))) {
            tempTime = TimeFrom.value ?? this.maxTimeRegister.minStartOT;
            this.props.ToasterSevice().showWarning(`${translate(TimeFrom.lable)} ${translate('HRM_PortalApp_CannotEarlierThan')} ${moment(this.maxTimeRegister.minStartOT).format('HH:mm')}`, 3000);
        }

        if (DurationType.value?.ID === 'E_OT_EARLY'
            && (!!this.maxTimeRegister.maxEndOT)
            && RegisterByHours.value
            && moment(time, 'HH:mm').add(RegisterHours.value, 'hours').isAfter(moment(this.maxTimeRegister.maxEndOT, 'HH:mm'))) {
            this.props.ToasterSevice().showWarning(`${translate('HRM_PortalApp_EndTime')} ${translate('HRM_PortalApp_MusNotLaterThan')} ${moment(this.maxTimeRegister.maxEndOT).format('HH:mm')}`, 3000);
            this.setState({
                TimeFrom: {
                    ...TimeFrom,
                    refresh: !TimeFrom.refresh
                }
            });

            return;
        }


        this.setState(
            {
                TimeFrom: {
                    ...TimeFrom,
                    value: tempTime,
                    refresh: !TimeFrom.refresh
                },
                HoursOverTime: this.caculatorHourOverTime(tempTime, TimeTo.value).hours
            },
            () => {
                // task 0166648: [TB W47][APP] [Hotfix HRM.8.11.27] Thêm tính năng đăng ký tăng ca theo khung giờ cấu hình
                // when have config register overtime by time config then update time end
                if (isRegisterOvertimeByTimeConfig || RegisterByHours.value) {
                    this.UpdateEndOT();
                } else {
                    // default
                    this.UpdateRegisterHours();
                }
            }
        );
    };

    onTimeChangeWorkDateOut = (time) => {
        const { TimeTo, DurationType } = this.state;

        // 	0186001: [TB W42][hot fix LTP_v8.12.30.01.08] Tách từ task 185934 Task APP
        let tempTime = time;
        if (DurationType.value?.ID === 'E_OT_EARLY'
            && (!!this.maxTimeRegister.maxEndOT)
            && moment(time, 'HH:mm').isAfter(moment(this.maxTimeRegister.maxEndOT, 'HH:mm'))) {
            tempTime = TimeTo.value ?? this.maxTimeRegister.maxEndOT;
            this.props.ToasterSevice().showWarning(`${translate('HRM_PortalApp_EndTime')} ${translate('HRM_PortalApp_MusNotLaterThan')} ${moment(this.maxTimeRegister.maxEndOT).format('HH:mm')}`, 3000);
        }

        this.setState(
            {
                TimeTo: {
                    ...TimeTo,
                    value: tempTime,
                    refresh: !TimeTo.refresh
                },
                HoursOverTime: this.caculatorHourOverTime(tempTime, TimeTo.value).hours
            },
            () => {
                const { value } = DurationType;

                if ((value && value?.ID == 'E_OT_BREAK_AFTER') || value?.ID == 'E_OT_BREAK_BEFORE') {
                    // this.UpdateEndOT(true, true);
                } else {
                    this.UpdateRegisterHours();
                }
            }
        );
    };
    //#endregion

    UpdateRegisterHours = (isConfig = false) => {
        this.showLoading(true);
        const {
            RegisterHours,
            IsOverTimeBreak,
            DurationType,
            ShiftID,
            TempShiftID,
            TimeFrom,
            TimeTo,
            Profiles,
            WorkDate,
            workDateAllowe,
            IsIncludeBenefitsHours,
            IsNotCheckInOut
        } = this.state;
        let shiftID = TempShiftID.value ? TempShiftID.value.ID : ShiftID.value ? ShiftID.value.ID : null,
            timeStart = TimeFrom.value ? moment(TimeFrom.value).format('HH:mm') : null,
            timeEnd = TimeTo.value ? moment(TimeTo.value).format('HH:mm') : null,
            durationType = DurationType.value ? DurationType.value.ID : null;
        HttpService.Post('[URI_CENTER]/api/Att_GetData/UpdateRegisterHours', {
            timeStart: timeStart,
            timeEnd: timeEnd,
            shiftID: shiftID,
            DurationType: durationType,
            IsOverTimeBreak: IsOverTimeBreak.value,
            IsNotCheckInOut: IsNotCheckInOut.value,
            ProfileID: Profiles.ID,
            WorkDateRoot:
                workDateAllowe && Array.isArray(workDateAllowe) && workDateAllowe.length > 0
                    ? moment(workDateAllowe[0]).format('YYYY-MM-DD HH:mm:ss')
                    : null
        }).then((data) => {
            this.showLoading(false);
            if (data && data.Status === 'SUCCESS') {
                // task: 0166648: [APP] [Hotfix HRM.8.11.27] Thêm tính năng đăng ký tăng ca theo khung giờ cấu hình
                let value = null;
                if (isConfig && data.Data?.RegisterHours === 0) {
                    value = null;
                } else if (data.Data?.RegisterHours) {
                    value = data.Data?.RegisterHours.toString();
                } else if (typeof data.Data === 'number') {
                    value = data.Data.toString();
                }
                this.setState(
                    {
                        RegisterHours: {
                            ...RegisterHours,
                            value: value,
                            refresh: !RegisterHours.refresh
                        },
                        IsIncludeBenefitsHours: {
                            ...IsIncludeBenefitsHours,
                            visible:
                                data.Data?.PregnancyHours &&
                                    Array.isArray(WorkDate.value) &&
                                    WorkDate.value.length === 1
                                    ? true
                                    : false,
                            PregnancyHours:
                                data.Data?.PregnancyHours ? data.Data?.PregnancyHours.toString() : null,
                            PregnanyType: data.Data?.PregnanyType ? data.Data?.PregnanyType : null,
                            BenefitsMessage: data.Data?.BenefitsMessage ? data.Data?.BenefitsMessage : null,
                            refresh: !IsIncludeBenefitsHours.refresh
                        }
                    },
                    () => {
                        // nhan.nguyen: ID task: 0169685 [Hotfix_TBCBALL_v8.11.31.01.08] Modify chọn mặc định giá trị field “Phương thức thanh toán” - đăng ký ngoài giờ App
                        this.handleGetValueDefaultForPaymentMethod();
                    }
                );
            }
        });
    };

    UpdateEndOT = (isRegister, isChangeByTimeOut) => {
        const {
            RegisterHours,
            DurationType,
            ShiftID,
            TempShiftID,
            TimeFrom,
            TimeTo,
            workDateAllowe,
            RegisterByHours,
            Profiles,
            IsIncludeBenefitsHours,
            WorkDate,
            IsOverTimeBreak,
            IsNotCheckInOut
        } = this.state;
        let shiftID = TempShiftID.value ? TempShiftID.value.ID : ShiftID.value ? ShiftID.value.ID : null,
            timeStart = TimeFrom.value ? moment(TimeFrom.value).format('HH:mm') : null,
            timeEnd = TimeTo.value ? moment(TimeTo.value).format('HH:mm') : null,
            durationType = DurationType.value ? DurationType.value.ID : null,
            workdateRoot =
                workDateAllowe && Array.isArray(workDateAllowe) && workDateAllowe.length > 0
                    ? moment(workDateAllowe[0]).format('YYYY-MM-DD HH:mm:ss')
                    : null;

        this.showLoading(true);
        let dataBody = {};
        if (RegisterHours.value && parseFloat(RegisterHours.value) > 0) {
            dataBody = {
                ...dataBody,
                RegisterHours: parseFloat(RegisterHours.value)
            };
        }

        if (IsOverTimeBreak.value) {
            dataBody = {
                ...dataBody,
                IsOverTimeBreak: true
            };
        }

        HttpService.Post('[URI_CENTER]/api/Att_GetData/UpdateStartOT', {
            ...dataBody,
            TimeStart: timeStart,
            TimeEnd: timeEnd,
            RegisterHours: RegisterHours.value,
            ShiftID: shiftID,
            DurationType2: durationType,
            WorkDateRoot: workdateRoot,
            // IsOverTimeBreak: false,
            IsChangeByTimeOut: isChangeByTimeOut,
            IsChangeByRegisterHours: true,
            ProfileID: Profiles.ID,
            IsNotCheckInOut: IsNotCheckInOut.value
        }).then((data) => {
            this.showLoading(false);
            if (data && data.Status === 'SUCCESS' && data?.Data) {
                let [timeStart, timeEnd] = [null, null];

                if (data?.Data?.StartEndTime.includes('|')) [timeStart, timeEnd] = data?.Data?.StartEndTime.split('|');
                else if (DurationType.value?.ID === 'E_OT_EARLY'
                    && (!!this.maxTimeRegister.maxEndOT) && !RegisterByHours.value) {
                    timeStart = data?.Data?.StartEndTime;
                    timeEnd = moment(this.maxTimeRegister.maxEndOT).format('HH:mm');
                } else
                    timeEnd = data?.Data?.StartEndTime;

                let nextState = {};

                if (timeStart) {
                    nextState = {
                        ...nextState,
                        TimeFrom: {
                            ...TimeFrom,
                            value: new Date(`${moment(workDateAllowe[0]).format('MM/DD/YYYY')} ${timeStart}`),
                            refresh: !TimeFrom.refresh
                        }
                    };
                }

                this.setState(
                    {
                        ...nextState,
                        TimeTo: {
                            ...TimeTo,
                            value: timeEnd
                                ? new Date(`${moment(workDateAllowe[0]).format('MM/DD/YYYY')} ${timeEnd}`)
                                : new Date(
                                    `${moment(workDateAllowe[0]).format('MM/DD/YYYY')} ${moment(
                                        moment(TimeFrom.value).add(RegisterHours.value, 'hours').format('LT'),
                                        'h:mm A'
                                    ).format('HH:mm')}`
                                ),
                            refresh: !TimeTo.refresh
                        },
                        IsIncludeBenefitsHours: {
                            ...IsIncludeBenefitsHours,
                            visible:
                                data.Data?.PregnancyHours &&
                                    Array.isArray(WorkDate.value) &&
                                    WorkDate.value.length === 1
                                    ? true
                                    : false,
                            PregnancyHours:
                                data.Data?.PregnancyHours ? data.Data?.PregnancyHours.toString() : null,
                            PregnanyType: data.Data?.PregnanyType ? data.Data?.PregnanyType : null,
                            BenefitsMessage: data.Data?.BenefitsMessage ? data.Data?.BenefitsMessage : null,
                            refresh: !IsIncludeBenefitsHours.refresh
                        }
                    },
                    () => {
                        if (RegisterByHours.value) {
                            // nhan.nguyen: ID task: 0169685 [Hotfix_TBCBALL_v8.11.31.01.08] Modify chọn mặc định giá trị field “Phương thức thanh toán” - đăng ký ngoài giờ App
                            this.handleGetValueDefaultForPaymentMethod();
                        }
                    }
                );
            }
        });
    };

    caculatorHourOverTime = (hoursIn, hoursOut) => {
        if ((hoursIn, hoursOut)) {
            let hoursOutTemp = moment(`${moment(hoursOut).format('HH:mm:ss a')}`, 'HH:mm:ss a');
            let hoursInTemp = moment(`${moment(hoursIn).format('HH:mm:ss a')}`, 'HH:mm:ss a');
            let duration = moment.duration(hoursOutTemp.diff(hoursInTemp));
            let hours = parseInt(duration.asHours());
            let minute = parseInt(duration.asMinutes()) % 60;

            return {
                hours,
                minute
            };
        }

        return {
            hours: '',
            minute: ''
        };
    };

    checkExistsShift = async (value = this.state.WorkDate.value) => {
        const { Profiles, ShiftID, IsNotCheckInOut, IsOverTimeBreak } = this.state;
        const { listDayHaveShift, listDayNotHaveShift, isSimilarRegistration, record } = this.props;
        if (value && Array.isArray(value) && value.length > 0 && Profiles.ID) {
            this.showLoading(true);
            let arrAllowe = [],
                arrError = [],
                valueShiftID = null,
                indexAllowe = [],
                indexError = [],
                arrPromise = [];
            // way 1:
            // for (let i = 0; i < value.length; i++) {
            //     await HttpService.Post('[URI_CENTER]/api/Att_GetData/GetShiftByProfileAndWorkDate', {
            //         profileID: Profiles.ID,
            //         WorkDate: value[i],
            //     }).then((res) => {
            //         if (res && res.Status === "SUCCESS" && res.Data && Array.isArray(res.Data)) {
            //             if (res.Data.length === 0) {
            //                 arrError.push(moment(new Date(value[i])).format("DD/MM/YYYY"));
            //             } else {
            //                 arrAllowe.push(value[i]);
            //                 valueShiftID = res.Data;
            //             }
            //         }
            //     }).catch((()) => {
            //         this.props.ToasterSevice().showWarning(translate('HRM_Message_GetDataServices_Error'), 3000)
            //     })
            // };

            for (let i = 0; i < value.length; i++) {
                arrPromise.push(
                    HttpService.Post('[URI_CENTER]/api/Att_GetData/GetShiftByProfileAndWorkDate', {
                        profileID: Profiles.ID,
                        WorkDate: value[i]
                    })
                );
            }

            // way 2:
            // await Promise.all(arrPromise).then((res) => {
            //     if (res && Array.isArray(res)) {
            //         res.map((data, index) => {
            //             if (data && data.Status === "SUCCESS" && data.Data && Array.isArray(data.Data)) {
            //                 if (data.Data.length === 0) {
            //                     indexError.push(index);
            //                 } else {
            //                     indexAllowe.push(index);
            //                     valueShiftID = data.Data;
            //                 }
            //             }
            //         })
            //     }
            // }).catch((()) => {
            //     this.props.ToasterSevice().showWarning(translate('HRM_Message_GetDataServices_Error'), 3000)
            // });

            // way 3:
            await HttpService.MultiRequest(arrPromise)
                .then((res) => {
                    if (res && Array.isArray(res)) {
                        res.map((data, index) => {
                            if (data && data.Status === 'SUCCESS' && data.Data && Array.isArray(data.Data)) {
                                if (data.Data.length === 0) {
                                    indexError.push(index);
                                } else {
                                    indexAllowe.push(index);
                                    valueShiftID = data.Data;
                                }
                            }
                        });
                    }
                })
                .catch(() => {
                    this.props.ToasterSevice().showWarning(translate('HRM_Message_GetDataServices_Error'), 3000);
                });


            this.showLoading(false);
            if (isSimilarRegistration === false && indexAllowe.length > 0) {
                indexAllowe.map((day) => {
                    arrAllowe.push(value[day]);
                });
            }

            if (isSimilarRegistration === false && indexError.length > 0) {
                indexError.map((day) => {
                    arrError.push(value[day]);
                });
            }

            // noti date not shift
            // QC request CLOSE
            // if (listDayNotHaveShift && Array.isArray(listDayNotHaveShift) && listDayNotHaveShift.length > 0) {
            //     let valueDisPlay = [];
            //     listDayNotHaveShift.map((item) => {
            //         valueDisPlay.push(moment(new Date(item)).format("DD/MM/YYYY"));
            //     })
            //     if (isSimilarRegistration === false) {
            //         this.props.ToasterSevice().showWarning(translate('HRM_Attendance_TimeSheet_Date') + " " + valueDisPlay.join(', ') + " " + translate('PlsCheckRosterOfEmpByDate'), 3000)
            //     } else {
            //         if (allDateRegister && Array.isArray(allDateRegister) && indexDay === allDateRegister.length - 1) {
            //             this.props.ToasterSevice().showWarning(translate('HRM_Attendance_TimeSheet_Date') + " " + valueDisPlay.join(', ') + " " + translate('PlsCheckRosterOfEmpByDate'), 3000)
            //         }
            //     }
            // }

            if (!record) {
                // 0185030: [TB W38]INOAC_v8.12.14.01.07 Tách từ task 184635 Xử lý ĐK OT ngày nghỉ ngày OT ngày OFF/ngày lễ
                if (valueShiftID) {
                    let isNotCheckInOut = valueShiftID.find((item) => item?.IsNotCheckInOut),
                        nextState = {},
                        isDayNotShift = Array.isArray(valueShiftID) && valueShiftID.length > 0 && valueShiftID[0]?.IsDayNotShift,
                        valueShift = valueShiftID.length == 1 ? valueShiftID[0] : null;

                    if (isNotCheckInOut)
                        nextState = {
                            ...nextState,
                            IsNotCheckInOut: {
                                ...IsNotCheckInOut,
                                disable: true,
                                value: true,
                                refresh: !IsNotCheckInOut.refresh
                            }
                        };

                    this.setState({
                        ...nextState,
                        ShiftID: {
                            ...ShiftID,
                            disable: isDayNotShift == false, // ngày có ca disable = true, ngày không ca mới cho chọn
                            refresh: !ShiftID.refresh,
                            visible: true,
                            value: valueShift,
                            data: valueShiftID
                        },
                        IsOverTimeBreak: {
                            ...IsOverTimeBreak,
                            visible: !isDayNotShift
                                ? false : true,
                            refresh: !IsOverTimeBreak.refresh
                        }
                    });
                }

                if (isSimilarRegistration === true) {
                    if (listDayHaveShift && Array.isArray(listDayHaveShift) && listDayHaveShift.length > 0) {
                        this.getMultiWhenChangeWorkDate(listDayHaveShift, Profiles.ID);
                    } else {
                        this.getMultiWhenChangeWorkDate(listDayNotHaveShift, Profiles.ID);
                    }
                } else if (arrAllowe.length > 0) {
                    this.getMultiWhenChangeWorkDate(arrAllowe, Profiles.ID);
                } else {
                    this.getMultiWhenChangeWorkDate(arrError, Profiles.ID);
                }
            } else {
                // 0186124: [TB W40]0186038: [Hotfix TPC_v8.12.36] Portal+APP_Thêm button "không kiểm tra in/out" ở màn hình DS tăng ca - APP
                let isNotCheckInOut = valueShiftID.find((item) => item?.ID === ShiftID.value?.ID);

                if (isNotCheckInOut?.IsNotCheckInOut) {
                    this.setState({
                        IsNotCheckInOut: {
                            ...IsNotCheckInOut,
                            disable: true,
                            refresh: !IsNotCheckInOut.refresh
                        }
                    });
                }
            }
        }
    };

    showLoading = (isShow) => {
        const { showLoading } = this.props;
        showLoading && showLoading(isShow);
    };

    ToasterSevice = () => {
        const { ToasterSevice } = this.props;
        return ToasterSevice;
    };

    getMultiWhenChangeWorkDate = (valueWorkDate, profileID = this.state.Profiles.ID) => {
        valueWorkDate = this.state.workDateAllowe ?? this.state.WorkDate.value;
        const dataBody = {
                WorkDate: valueWorkDate[0],
                profileID
            },
            { WorkDate, DurationType, isRefreshState, OvertimeTypeID } = this.state;
        HttpService.MultiRequest([
            HttpService.Post('[URI_CENTER]/api/Att_GetData/GetOvertimeDurationTypeByDate', dataBody),
            HttpService.Post('[URI_CENTER]/api/Att_GetData/GetMultiOvertimeTypeByTimeLine', {
                WorkDate:
                    WorkDate.value && Array.isArray(WorkDate.value) && WorkDate.value.length > 0
                        ? WorkDate.value[0]
                        : null,
                profileID
            })
        ])
            .then((resAll) => {
                this.showLoading(false);
                if (resAll && Array.isArray(resAll) && resAll.length > 0) {
                    const [resDurationOverTime, resTypeOverTime] = resAll;

                    let nextState = { isRefreshState: !isRefreshState };
                    // load default type register
                    let valueDurationDefault = null;

                    // when date not shift then skip
                    if (
                        resDurationOverTime &&
                        resDurationOverTime.Status === 'SUCCESS' &&
                        resDurationOverTime.Data &&
                        Array.isArray(resDurationOverTime.Data)
                    ) {

                        if (resDurationOverTime.Data.length > 0) {
                            if (resDurationOverTime.Data.length === 1) {
                                valueDurationDefault = resDurationOverTime.Data[0];
                            } else {
                                // default gat value IsActive = true
                                valueDurationDefault = resDurationOverTime.Data.find((item) => item?.IsActive);

                                // if not have IsActive, get dafult is E_OT_LATE
                                if (!valueDurationDefault)
                                    valueDurationDefault = resDurationOverTime.Data.find(
                                        (item) => item.ID === 'E_OT_LATE'
                                    );
                            }
                        }
                        nextState = {
                            ...nextState,
                            DurationType: {
                                ...DurationType,
                                data: resDurationOverTime.Data,
                                value: valueDurationDefault,
                                disable: valueDurationDefault && resDurationOverTime.Data.length === 1 ? true : false,
                                refresh: !DurationType.refresh
                            },
                            workDateAllowe: [valueWorkDate[0]]
                        };
                    }
                    if (
                        resTypeOverTime &&
                        resTypeOverTime.Status === 'SUCCESS' &&
                        resTypeOverTime.Data &&
                        Array.isArray(resTypeOverTime.Data)
                    ) {
                        nextState = {
                            ...nextState,
                            OvertimeTypeID: {
                                ...OvertimeTypeID,
                                data: resTypeOverTime.Data,
                                refresh: !OvertimeTypeID.refresh
                            }
                        };
                    }

                    // hash code: when date not shift then default load E_OT_UNLIMIT
                    // if (isPass) {
                    //     nextState = {
                    //         ...nextState,
                    //         DurationType: {
                    //             ...DurationType,
                    //             data: [unLimited],
                    //             value: unLimited,
                    //             refresh: !DurationType.refresh,
                    //         },
                    //     };
                    // }
                    this.setState(nextState, () => {
                        this.getRegistHourOrEndHourOT();
                    });
                }
            })
            .catch(() => {
                this.props.ToasterSevice().showWarning(translate('HRM_Message_GetDataServices_Error'), 3000);
            });
    };

    // get hour start hour end
    getRegistHourOrEndHourOT = (isSwitchRegisterByHours = false) => {
        const { ShiftID, DurationType, TimeFrom, TimeTo, workDateAllowe, RegisterHours, RegisterByHours, Profiles } = this.state;
        if (
            (ShiftID.value && ShiftID.value?.ID && DurationType.value && DurationType.value?.ID) ||
            RegisterHours.value
        ) {
            this.showLoading(true);
            let dataBody = {};
            let data = [];

            // follow by portal
            if (isSwitchRegisterByHours && RegisterHours.value) {
                dataBody = {
                    ...dataBody,
                    RegisterHours: parseFloat(RegisterHours.value)
                };
            } else {
                dataBody = {
                    ...dataBody,
                    TypeOT: DurationType.value?.ID
                };
            }

            if (Profiles.ID) {
                dataBody = {
                    ...dataBody,
                    ProfileID: Profiles.ID
                };
            }


            HttpService.Post('[URI_CENTER]/api/Att_GetData/GetRegistHourOrEndHourOT', {
                ...dataBody,
                ShiftID: ShiftID.value && ShiftID.value.ID ? ShiftID.value.ID : null
            })
                .then((res) => {
                    this.showLoading(false);
                    if (
                        res &&
                        res.Status === 'SUCCESS' &&
                        res.Data &&
                        (Object.keys(res.Data).length === 0 && res.Data.constructor === Object) === false
                    ) {
                        let nextState = {};
                        if (res.Data.StartHourOT || res.Data.EndHourOT) {
                            nextState = {
                                ...nextState,
                                TimeFrom: {
                                    ...TimeFrom,
                                    value: new Date(
                                        `${moment(workDateAllowe[0]).format('MM/DD/YYYY')} ${res.Data.StartHourOT}`
                                    ),
                                    refresh: !TimeFrom.refresh
                                },
                                TimeTo: {
                                    ...TimeTo,
                                    value: new Date(
                                        `${moment(workDateAllowe[0]).format('MM/DD/YYYY')} ${res.Data.EndHourOT}`
                                    ),
                                    refresh: !TimeTo.refresh
                                }
                            };

                            // 	0186001: [TB W42][hot fix LTP_v8.12.30.01.08] Tách từ task 185934 Task APP
                            if (res.Data?.MaxEndHourOT)
                                this.maxTimeRegister = {
                                    ...this.maxTimeRegister,
                                    maxEndOT: new Date(
                                        `${moment(workDateAllowe[0]).format('MM/DD/YYYY')} ${res.Data?.MaxEndHourOT}`)
                                };

                            if (res.Data?.MinStartHourOT)
                                this.maxTimeRegister = {
                                    ...this.maxTimeRegister,
                                    minStartOT: new Date(
                                        `${moment(workDateAllowe[0]).format('MM/DD/YYYY')} ${res.Data?.MinStartHourOT}`)
                                };

                        }

                        // nhan.nguyen: task: 	0166648: [APP] [Hotfix HRM.8.11.27] Thêm tính năng đăng ký tăng ca theo khung giờ cấu hình
                        if (typeof res.Data?.ListRegisterHours === 'string' && res.Data?.ListRegisterHours.length > 0) {
                            res.Data?.ListRegisterHours.split(',').map((item) => {
                                data.push({
                                    Value: item
                                });
                            });
                            nextState = {
                                ...nextState,
                                RegisterByHours: {
                                    ...RegisterByHours,
                                    value: true,
                                    disable: true,
                                    refresh: !RegisterByHours.refresh
                                },
                                RegisterHours: {
                                    ...RegisterHours,
                                    value: RegisterHours.value ? RegisterHours.value : null,
                                    data,
                                    refresh: !RegisterHours.refresh
                                },
                                isRegisterOvertimeByTimeConfig: true
                            };
                        } else {
                            nextState = {
                                ...nextState,
                                RegisterByHours: {
                                    ...RegisterByHours,
                                    disable: false,
                                    refresh: !RegisterByHours.refresh
                                },
                                RegisterHours: {
                                    ...RegisterHours,
                                    value: null,
                                    data: null,
                                    refresh: !RegisterHours.refresh
                                },
                                isRegisterOvertimeByTimeConfig: false
                            };
                        }

                        this.setState(nextState, () => {
                            this.UpdateRegisterHours(data.length > 0 ? true : false);
                        });
                    }
                })
                .catch(() => {
                    this.props.ToasterSevice().showWarning(translate('HRM_Message_GetDataServices_Error'), 3000);
                });
        }
    };

    getAllData = () => {
        const {
                WorkDate,
                OvertimeTypeID,
                ShiftID,
                TimeFrom,
                TimeTo,
                RegisterHours,
                Profiles,
                MethodPayment,
                ReasonOT,
                FileAttachment,
                OvertimeReasonID,
                IsRequestEntryExitGate,
                IsRequestForBenefit,
                IsSignUpToEat,
                IsUnitAssistant,
                SendToID,
                BusinessUnitID,
                BusinessUnitTypeID,
                isOtherInformation,
                OvertimeArea,
                DurationType,
                TransferDepartment,
                IsIncludeBenefitsHours,
                IsOverTimeBreak,
                IsNotCheckInOut
            } = this.state,
            { fieldConfig, levelApprove } = this.props;

        let FinallyFileName = [],
            valueTimeFrom = null,
            valueTimeTo = null;
        if (FileAttachment.value && Array.isArray(FileAttachment.value) && FileAttachment.value.length > 0) {
            FileAttachment.value.map((item) => {
                FinallyFileName.push(item.fileName);
            });
        }

        valueTimeFrom = TimeFrom.value
            ? `${moment(new Date()).format('YYYY/MM/DD')} ${moment(TimeFrom.value).format('HH:mm')}`
            : null;
        valueTimeTo = TimeTo.value
            ? `${moment(new Date()).format('YYYY/MM/DD')} ${moment(TimeTo.value).format('HH:mm')}`
            : null;

        if (
            (fieldConfig?.WorkDate?.visibleConfig && fieldConfig?.WorkDate?.isValid && !WorkDate.value) ||
            (fieldConfig?.OvertimeTypeID?.visibleConfig &&
                fieldConfig?.OvertimeTypeID?.isValid &&
                !OvertimeTypeID.value) ||
            (fieldConfig?.RegisterHours?.visibleConfig &&
                fieldConfig?.RegisterHours?.isValid &&
                (!RegisterHours.value || parseFloat(RegisterHours.value) === 0)) ||
            (fieldConfig?.DurationType.visibleConfig && !DurationType.value) ||
            (fieldConfig?.MethodPayment?.visibleConfig &&
                fieldConfig?.MethodPayment?.isValid &&
                !MethodPayment.value) ||
            (fieldConfig?.TransferDepartment?.visibleConfig &&
                fieldConfig?.TransferDepartment?.isValid &&
                !TransferDepartment.value) ||
            (fieldConfig?.ReasonOT?.visibleConfig && fieldConfig?.ReasonOT?.isValid && !ReasonOT.value) ||
            (fieldConfig?.FileAttachment?.visibleConfig &&
                fieldConfig?.FileAttachment?.isValid &&
                !FileAttachment.value) ||
            (fieldConfig?.OvertimeReasonID?.visibleConfig &&
                fieldConfig?.OvertimeReasonID?.isValid &&
                !OvertimeReasonID.value) ||
            !RegisterHours.value ||
            parseFloat(RegisterHours.value) === 0 ||
            // OtherInfo
            (fieldConfig?.IsRequestEntryExitGate?.visibleConfig &&
                fieldConfig?.IsRequestEntryExitGate?.isValid &&
                IsRequestEntryExitGate.value == null) ||
            (fieldConfig?.IsRequestForBenefit?.visibleConfig &&
                fieldConfig?.IsRequestForBenefit?.isValid &&
                IsRequestForBenefit.value == null) ||
            (fieldConfig?.IsSignUpToEat?.visibleConfig &&
                fieldConfig?.IsSignUpToEat?.isValid &&
                IsSignUpToEat.value == null) ||
            (fieldConfig?.IsUnitAssistant?.visibleConfig &&
                fieldConfig?.IsUnitAssistant?.isValid &&
                IsUnitAssistant.value == null) ||
            (fieldConfig?.SendToID?.visibleConfig && fieldConfig?.SendToID?.isValid && SendToID.value == null) ||
            (fieldConfig?.BusinessUnitID?.visibleConfig &&
                fieldConfig?.BusinessUnitID?.isValid &&
                BusinessUnitID.value == null) ||
            (fieldConfig?.BusinessUnitTypeID?.visibleConfig &&
                fieldConfig?.BusinessUnitTypeID?.isValid &&
                BusinessUnitTypeID.value == null) ||
            (fieldConfig?.OvertimeArea?.visibleConfig &&
                fieldConfig?.OvertimeArea?.isValid &&
                OvertimeArea.value == null)
        ) {
            this.setState(
                {
                    isError: true
                },
                () => {
                    this.props.ToasterSevice().showWarning('HRM_PortalApp_InputValue_Please');
                }
            );
        } else {
            let data = {};
            if (isOtherInformation) {
                data = {
                    IsRequestEntryExitGate: IsRequestEntryExitGate?.value,
                    IsRequestForBenefit: IsRequestForBenefit?.value,
                    IsSignUpToEat: IsSignUpToEat?.value,
                    IsUnitAssistant: IsUnitAssistant?.value,
                    SendToID: SendToID?.value?.ID,
                    BusinessUnitID: BusinessUnitID?.value?.ID,
                    BusinessUnitTypeID: BusinessUnitTypeID?.value?.ID,
                    OvertimeArea: OvertimeArea?.value
                };
            }
            this.setState({
                isError: false
            });

            let orgStructureTransID = null;
            if (Array.isArray(TransferDepartment.value) && TransferDepartment.value.length > 0)
                orgStructureTransID = TransferDepartment.value[0][configOrgStructureTransID.valueField];

            return {
                ReasonOT: ReasonOT.value,
                IsIncludeBenefitsHours: IsIncludeBenefitsHours.value,
                DurationType: DurationType.value && DurationType.value.ID ? DurationType.value.ID : null,
                FileAttachment: FinallyFileName.length > 0 ? FinallyFileName.join(',') : null,
                ListProfileID: [Profiles.ID],
                MethodPayment: MethodPayment.value ? MethodPayment.value.Value : null,
                OvertimeTypeID: OvertimeTypeID.value && OvertimeTypeID.value.ID ? OvertimeTypeID.value.ID : null,
                RegisterHours: RegisterHours.value ? parseFloat(RegisterHours.value) : null,
                RegisterRepeatTime: null,
                ShiftID: ShiftID.value && ShiftID.value?.ID ? ShiftID.value?.ID : null,
                TimeFrom: valueTimeFrom,
                TimeTo: valueTimeTo,
                OvertimeReasonID: OvertimeReasonID.value ? OvertimeReasonID.value.ID : null,
                dataCheckbox: null,
                LevelApproved: levelApprove,
                OrgStructureTransID: orgStructureTransID,
                IsOverTimeBreak: IsOverTimeBreak.value,
                IsNotCheckInOut: IsNotCheckInOut.value,
                ...data
            };
        }
    };

    unduData = () => {
        this.initState();
    };

    handleWhenChangeDateOvertime = (value) => {
        // handle when range is {startDate, endDate}
        if (value && value.startDate && value.endDate) {
            let days = [];
            let start = new Date(value.startDate).getTime();
            let end = new Date(value.endDate || value.startDate).getTime();
            for (let cur = start; cur <= end; cur += 60 * 60 * 24000) {
                let curStr = new Date(cur).toISOString().substring(0, 10);
                days.push(curStr);
            }
            this.isStatusVnrDateFromTo = true;
            this.onChangeWorkDate(days);
        } else {
            this.isStatusVnrDateFromTo = false;
            this.onChangeWorkDate(value);
        }
    };

    // nhan.nguyen: ID task: 0169685 [Hotfix_TBCBALL_v8.11.31.01.08] Modify chọn mặc định giá trị field “Phương thức thanh toán” - đăng ký ngoài giờ App
    handleGetValueDefaultForPaymentMethod = (isPass = false) => {
        try {
            this.showLoading(true);
            const { WorkDate, ShiftID, TempShiftID, TimeFrom, TimeTo, Profiles, MethodPayment } = this.state;

            let shiftID = TempShiftID.value ? TempShiftID.value.ID : ShiftID.value ? ShiftID.value.ID : null,
                timeStart = TimeFrom.value ? moment(TimeFrom.value).format('HH:mm') : null,
                timeEnd = TimeTo.value ? moment(TimeTo.value).format('HH:mm') : null,
                workDate =
                    Array.isArray(WorkDate.value) && WorkDate.value.length > 0
                        ? moment(WorkDate.value[0]).format('YYYY/MM/DD')
                        : null;

            if (Profiles.ID && timeStart && timeEnd && shiftID && workDate && !isPass) {
                HttpService.Post('[URI_CENTER]/api/Att_GetData/GetMethodPaymentOvertimePlan', {
                    TimeStart: timeStart,
                    TimeEnd: timeEnd,
                    ShiftID: shiftID,
                    ProfileID: Profiles.ID,
                    WorkDate: workDate
                }).then((res) => {
                    this.showLoading(false);
                    if (res && res?.Status === EnumName.E_SUCCESS) {
                        let nextState = {};
                        if (Array.isArray(res?.Data)) {
                            if (res?.Data.length === 1) {
                                nextState = {
                                    ...nextState,
                                    MethodPayment: {
                                        ...MethodPayment,
                                        data: res?.Data,
                                        value: res?.Data[0],
                                        refresh: !MethodPayment.refresh
                                    }
                                };
                            } else {
                                nextState = {
                                    ...nextState,
                                    MethodPayment: {
                                        ...MethodPayment,
                                        data: res?.Data,
                                        value: null,
                                        refresh: !MethodPayment.refresh
                                    }
                                };
                            }
                        } else {
                            nextState = {
                                ...nextState,
                                MethodPayment: {
                                    ...MethodPayment,
                                    data: [],
                                    value: null,
                                    refresh: !MethodPayment.refresh
                                }
                            };
                        }

                        this.setState(nextState, () => {
                            const { MethodPayment } = this.state;
                            // if data of method payment is empty then load all methods payment from API [URI_CENTER]/api/Att_GetData/GetEnum?text=MethodPayment
                            if (MethodPayment.data.length === 0) {
                                this.handleGetValueDefaultForPaymentMethod(true);
                            }
                        });
                    }
                });
            } else {
                HttpService.Get('[URI_CENTER]/api/Att_GetData/GetEnum?text=MethodPayment')
                    .then((res) => {
                        this.showLoading(false);
                        if (res && res?.Status === EnumName.E_SUCCESS) {
                            if (Array.isArray(res?.Data)) {
                                this.setState({
                                    MethodPayment: {
                                        ...MethodPayment,
                                        data: res?.Data,
                                        value: null,
                                        refresh: !MethodPayment.refresh
                                    }
                                });
                            }
                        } else {
                            this.props
                                .ToasterSevice()
                                .showWarning(translate('HRM_Message_GetDataServices_Error'), 3000);
                        }
                    })
                    .catch(() => {
                        this.showLoading(false);
                    });
            }
        } catch (error) {
            this.showLoading(true);
        }
    };

    getProfileDetailForAttendance = () => {
        HttpService.Post('[URI_CENTER]/api/Att_GetData/GetProfileDetailForAttendance', {
            'page': 1,
            'pageSize': 100
        }).then((res) => {
            if (res?.Status === EnumName.E_SUCCESS) {
                this.setState({
                    Emp: {
                        ...this.state.Emp,
                        lable: 'HRM_PortalApp_Employee',
                        data: res?.Data?.Data?.length > 0 ? res?.Data?.Data : [],
                        refresh: !this.state.Emp.refresh
                    }
                });
            }
        });
    }

    render() {
        const {
                isShowDelete,
                fieldConfig,
                onDeleteItemDay,
                indexDay,
                onScrollToInputIOS
            } = this.props,
            {
                WorkDate,
                OvertimeTypeID,
                DurationType,
                TimeFrom,
                TimeTo,
                RegisterHours,
                RegisterByHours,
                OvertimeReasonID,
                isError,
                IsRequestEntryExitGate,
                IsRequestForBenefit,
                IsSignUpToEat,
                IsUnitAssistant,
                SendToID,
                BusinessUnitID,
                BusinessUnitTypeID,
                isOtherInformation,
                OvertimeArea,
                isShowBtnOtherInformation,
                ShiftID,
                IsIncludeBenefitsHours,
                TransferDepartment,
                IsOverTimeBreak,
                IsNotCheckInOut,
                Emp,
                OvertimeHour,
                WorkPlace,
                WorkPlan,
                InfoHour
            } = this.state,
            { viewInputMultiline } = stylesVnrPickerV3;

        return (
            <View
                style={styles.wrapItem}
                onLayout={(event) => {
                    const layout = event.nativeEvent.layout;
                    this.layoutHeightItem = layout.height;
                }}
            >
                {/* Title group for time */}
                <View style={[styles.flRowSpaceBetween, CustomStyleSheet.justifyContent('flex-end')]}>
                    {isShowDelete && (
                        <TouchableOpacity onPress={() => onDeleteItemDay(indexDay)}>
                            <VnrText
                                style={[styleSheets.lable, styles.styLableDeleteGp, CustomStyleSheet.fontSize(16)]}
                                i18nKey={'HRM_PortalApp_Delete'}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {(Emp.visible && Emp.visibleConfig || 1 === 1) && (
                    <VnrPickerQuickly
                        isNewUIValue={true}
                        dataLocal={Emp.data}
                        fieldValid={true}
                        isCheckEmpty={fieldConfig?.Emp?.isValid && isError && !Emp.value ? true : false}
                        refresh={Emp.refresh}
                        textField="JoinProfileNameCode"
                        valueField="ID"
                        filter={true}
                        autoFilter={true}
                        filterLocal={true}
                        value={Emp.value}
                        disable={Emp.disable}
                        lable={Emp.lable}
                        onFinish={(item) => {
                            this.setState(
                                {
                                    Emp: {
                                        ...Emp,
                                        value: item ? { ...item } : null,
                                        refresh: !Emp.refresh
                                    }
                                });
                        }}
                    />
                )}

                {/* Ngày tăng ca */}
                {WorkDate.visible && fieldConfig?.WorkDate?.visibleConfig && (
                    <VnrDateFromTo
                        isNewUIValue={true}
                        isHiddenIcon={true}
                        fieldValid={fieldConfig?.WorkDate?.isValid}
                        isCheckEmpty={fieldConfig?.WorkDate?.isValid && !WorkDate.value ? true : false}
                        key={WorkDate.id}
                        lable={WorkDate.lable}
                        refresh={WorkDate.refresh}
                        value={WorkDate.value ?? {}}
                        displayOptions={false}
                        onlyChooseEveryDay={false}
                        onlyChooseOneDay={true}
                        disable={WorkDate.disable}
                        isControll={true}
                        onFinish={(value) => {
                            this.handleWhenChangeDateOvertime(value);
                        }}
                    />
                )}

                {OvertimeHour.visible && fieldConfig?.OvertimeHour?.visibleConfig && (
                    <VnrDate
                        isNewUIValue={true}
                        isHiddenIcon={true}
                        fieldValid={fieldConfig?.OvertimeHour?.isValid}
                        refresh={OvertimeHour.refresh}
                        response={'string'}
                        format={'HH:mm'}
                        type={'time'}
                        value={OvertimeHour.value}
                        lable={OvertimeHour.lable}
                        placeHolder={'SELECT_ITEM'}
                        disable={OvertimeHour.disable}
                        stylePicker={[styles.resetBorder, CustomStyleSheet.borderBottomWidth(1)]}
                        onFinish={(item) => {
                            this.onTimeChangeWorkDateIn(item);
                        }}
                    />
                )}

                {/* Nơi làm việc */}
                {WorkPlace.visible && fieldConfig?.WorkPlace.visibleConfig && (
                    <VnrTextInput
                        fieldValid={fieldConfig?.WorkPlace?.isValid}
                        isCheckEmpty={
                            fieldConfig?.WorkPlace?.isValid && isError && WorkPlace.value.length === 0 ? true : false
                        }
                        placeHolder={'HRM_PortalApp_PleaseInput'}
                        disable={WorkPlace.disable}
                        lable={WorkPlace.lable}
                        style={[
                            styleSheets.text,
                            stylesVnrPickerV3.viewInputMultiline,
                            CustomStyleSheet.paddingHorizontal(Size.defineSpace),
                            CustomStyleSheet.maxHeight(200)
                        ]}
                        styleLabel={[
                            CustomStyleSheet.paddingHorizontal(Size.defineSpace)
                        ]}
                        styleContent={[
                            CustomStyleSheet.paddingHorizontal(0),
                            CustomStyleSheet.flex(0)
                        ]}
                        multiline={true}
                        value={WorkPlace.value}
                        maxLength={500}
                        onChangeText={(text) => {
                            this.setState({
                                WorkPlace: {
                                    ...WorkPlace,
                                    value: text,
                                    refresh: !WorkPlace.refresh
                                }
                            });
                        }}
                        refresh={WorkPlace.refresh}
                    />
                )}

                {/* Kế hoạch công việc */}
                {WorkPlan.visible && fieldConfig?.WorkPlan.visibleConfig && (
                    <VnrTextInput
                        fieldValid={fieldConfig?.WorkPlan?.isValid}
                        isCheckEmpty={
                            fieldConfig?.WorkPlan?.isValid && isError && WorkPlan.value.length === 0 ? true : false
                        }
                        placeHolder={'HRM_PortalApp_PleaseInput'}
                        disable={WorkPlan.disable}
                        lable={WorkPlan.lable}
                        style={[
                            styleSheets.text,
                            stylesVnrPickerV3.viewInputMultiline,
                            CustomStyleSheet.paddingHorizontal(Size.defineSpace),
                            CustomStyleSheet.maxHeight(200)
                        ]}
                        styleLabel={[
                            CustomStyleSheet.paddingHorizontal(Size.defineSpace)
                        ]}
                        styleContent={[
                            CustomStyleSheet.paddingHorizontal(0),
                            CustomStyleSheet.flex(0)
                        ]}
                        multiline={true}
                        value={WorkPlan.value}
                        maxLength={500}
                        onChangeText={(text) => {
                            this.setState({
                                WorkPlan: {
                                    ...WorkPlan,
                                    value: text,
                                    refresh: !WorkPlan.refresh
                                }
                            });
                        }}
                        refresh={WorkPlan.refresh}
                    />
                )}

                {/* ca - ShiftID */}
                {ShiftID.visible && ShiftID.visibleConfig && (
                    <VnrPickerQuickly
                        dataLocal={ShiftID.data}
                        isCheckEmpty={false}
                        refresh={ShiftID.refresh}
                        textField="ShiftName"
                        valueField="ID"
                        filter={true}
                        autoFilter={true}
                        filterLocal={true}
                        value={ShiftID.value}
                        disable={ShiftID.disable}
                        lable={ShiftID.lable}
                        onFinish={(item) => {
                            this.setState(
                                {
                                    ShiftID: {
                                        ...ShiftID,
                                        value: item ? { ...item } : null,
                                        refresh: !ShiftID.refresh
                                    }
                                },
                                () => {
                                    this.getRegistHourOrEndHourOT();
                                }
                            );
                        }}
                    />
                )}

                {/* Loại đăng ký */}
                {DurationType.visible && fieldConfig?.DurationType?.visibleConfig && (
                    <VnrPickerLittle
                        fieldValid={true}
                        isCheckEmpty={true}
                        refresh={DurationType.refresh}
                        dataLocal={DurationType.data ? DurationType.data : []}
                        // api={{
                        //     urlApi:
                        //         '[URI_CENTER]/api/Att_GetData/GetOvertimeDurationTypeByDate',
                        //     type: 'E_POST',
                        //     "dataBody": {
                        //         "WorkDate": `${WorkDate.value}`,
                        //         "profileID": `${Profiles.ID ? Profiles.ID : ''}`
                        //     }
                        // }}
                        value={DurationType.value}
                        textField="Translate"
                        valueField="ID"
                        filter={true}
                        filterServer={true}
                        filterParams="text"
                        disable={DurationType.disable}
                        lable={DurationType.lable}
                        stylePicker={styles.resetBorder}
                        isChooseQuickly={true}
                        onFinish={(item) => {
                            this.setState(
                                {
                                    DurationType: {
                                        ...DurationType,
                                        value: item ? { ...item } : null,
                                        refresh: !DurationType.refresh
                                    }
                                },
                                () => {
                                    this.getRegistHourOrEndHourOT();
                                }
                            );
                        }}
                    />
                )}

                {/* Đăng ký theo giờ */}
                {RegisterByHours.visible && fieldConfig?.RegisterByHours?.visibleConfig && (
                    <VnrSwitch
                        lable={'HRM_PortalApp_SubscriptionByHours'}
                        subLable={translate('HRM_PortalApp_Sub_SubscriptionByHours')}
                        isDisable={RegisterByHours.disable}
                        value={RegisterByHours.value}
                        onFinish={(value) =>
                            this.setState(
                                {
                                    RegisterByHours: {
                                        ...RegisterByHours,
                                        value: value,
                                        refresh: !RegisterByHours.refresh
                                    }
                                },
                                () => {
                                    if (value) {
                                        this.getRegistHourOrEndHourOT(true);
                                    } else {
                                        this.UpdateEndOT(true, true);
                                    }
                                }
                            )
                        }
                    />
                )}

                {/* Số giờ, giờ vào, giờ kết thúc */}
                <View style={CustomStyleSheet.flexDirection('row')}>
                    {/* Số giờ */}
                    {RegisterHours.visible && RegisterHours.visibleConfig && RegisterByHours.value === true && (
                        <View style={CustomStyleSheet.flex(0.5)}>
                            {Array.isArray(RegisterHours.data) && RegisterHours.data.length > 0 ? (
                                <View>
                                    <VnrPickerLittle
                                        fieldValid={fieldConfig?.RegisterHours?.isValid}
                                        refresh={RegisterHours.refresh}
                                        dataLocal={RegisterHours.data}
                                        value={
                                            RegisterHours.value
                                                ? {
                                                    isSelect: true,
                                                    Value: `${RegisterHours.value}`
                                                }
                                                : null
                                        }
                                        textField="Value"
                                        valueField="Value"
                                        disable={RegisterHours.disable}
                                        lable={'HRM_PortalApp_OnlyTime'}
                                        stylePicker={[styles.resetBorder, CustomStyleSheet.borderBottomWidth(1)]}
                                        placeholder={' '}
                                        onFinish={(value) => {
                                            if (value) {
                                                // 	0186001: [TB W42][hot fix LTP_v8.12.30.01.08] Tách từ task 185934 Task APP
                                                let nextState = {};
                                                if (this.maxTimeRegister?.maxEndOT && DurationType.value?.ID === 'E_OT_EARLY') {
                                                    let timeStart = moment(this.maxTimeRegister?.maxEndOT, 'HH:mm').subtract(value?.Value, 'hours');
                                                    nextState = {
                                                        ...nextState,
                                                        TimeFrom: {
                                                            ...TimeFrom,
                                                            value: timeStart,
                                                            refresh: !TimeFrom.refresh
                                                        }
                                                    };
                                                }

                                                this.setState(
                                                    {
                                                        ...nextState,
                                                        RegisterHours: {
                                                            ...RegisterHours,
                                                            value: value?.Value,
                                                            refresh: !RegisterHours.refresh
                                                        }
                                                    },
                                                    () => {
                                                        this.UpdateEndOT();
                                                    }
                                                );
                                            }
                                        }}
                                    />
                                </View>
                            ) : (
                                <View>
                                    {/* click focus TextInput */}
                                    <TouchableOpacity
                                        style={[styles.inputRef]}
                                        onPress={() => {
                                            this.focusTextInput.focus();
                                        }}
                                    >
                                        <VnrText
                                            i18nKey={'HRM_PortalApp_TakeBusinessTrip_LeaveHours'}
                                            style={[styleSheets.text, styles.styLbNotHaveValuePicker]}
                                        />
                                    </TouchableOpacity>
                                    <VnrTextInput
                                        ref={(input) => {
                                            this.focusTextInput = input;
                                        }}
                                        placeHolder={'0'}
                                        value={RegisterHours.value ? `${RegisterHours.value}` : RegisterHours.value}
                                        refresh={RegisterHours.refresh}
                                        disable={RegisterHours.disable}
                                        styleContent={[
                                            stylesVnrPickerV3.styContentPicker,
                                            styles.resetBorder,
                                            CustomStyleSheet.borderBottomWidth(1)
                                        ]}
                                        style={[
                                            styleSheets.text,
                                            styleSheets.textInput,
                                            styles.customForTextInputChooseHour
                                        ]}
                                        keyboardType={'numeric'}
                                        charType={'double'}
                                        returnKeyType={'done'}
                                        textRight={true}
                                        onChangeText={(value) => {
                                            if (value === RegisterHours.value)
                                                return;

                                            let nextState = {};

                                            if (this.maxTimeRegister?.maxEndOT && DurationType.value?.ID === 'E_OT_EARLY') {
                                                let timeStart = moment(this.maxTimeRegister?.maxEndOT, 'HH:mm').subtract(value, 'hours');
                                                nextState = {
                                                    ...nextState,
                                                    TimeFrom: {
                                                        ...TimeFrom,
                                                        value: timeStart,
                                                        refresh: !TimeFrom.refresh
                                                    }
                                                };
                                            }

                                            this.setState(
                                                {
                                                    ...nextState,
                                                    RegisterHours: {
                                                        ...RegisterHours,
                                                        value: value,
                                                        refresh: !RegisterHours.refresh
                                                    }
                                                },
                                                () => {
                                                    this.UpdateEndOT();
                                                }
                                            );
                                        }}
                                    />
                                </View>
                            )}
                        </View>
                    )}
                    {RegisterByHours.value === true && <View style={styles.styRowDateLine} />}
                    {/* Giờ vào */}
                    {TimeFrom.visible && TimeFrom.visibleConfig && (
                        <View style={CustomStyleSheet.flex(0.5)}>
                            <VnrDate
                                fieldValid={fieldConfig?.TimeFrom?.isValid}
                                refresh={TimeFrom.refresh}
                                response={'string'}
                                format={'HH:mm'}
                                type={'time'}
                                value={TimeFrom.value}
                                lable={TimeFrom.lable}
                                placeHolder={'00:00'}
                                disable={TimeFrom.disable}
                                stylePicker={[styles.resetBorder, CustomStyleSheet.borderBottomWidth(1)]}
                                onFinish={(item) => {
                                    this.onTimeChangeWorkDateIn(item);
                                }}
                            />
                        </View>
                    )}
                    {RegisterByHours.value === false && <View style={styles.styRowDateLine} />}
                    {/* Giờ ra */}
                    {TimeTo.visible && TimeTo.visibleConfig && RegisterByHours.value === false && (
                        <View style={CustomStyleSheet.flex(0.5)}>
                            <VnrDate
                                fieldValid={fieldConfig?.TimeTo?.isValid}
                                refresh={TimeTo.refresh}
                                response={'string'}
                                format={'HH:mm'}
                                type={'time'}
                                value={TimeTo.value}
                                lable={TimeTo.lable}
                                placeHolder={'00:00'}
                                disable={TimeTo.disable}
                                stylePicker={[styles.resetBorder, CustomStyleSheet.borderBottomWidth(1)]}
                                onFinish={(item) => {
                                    this.onTimeChangeWorkDateOut(item);
                                }}
                            />
                        </View>
                    )}
                </View>
                {TimeFrom.value && (RegisterHours.value || TimeTo.value) && InfoHour.visible ? (
                    <View style={styles.caculatorHour}>
                        <Text
                            style={[
                                !RegisterHours.value || parseFloat(RegisterHours.value) === 0
                                    ? { color: Colors.red }
                                    : { color: Colors.black },
                                { ...CustomStyleSheet.fontWeight('400'), ...CustomStyleSheet.fontSize(14) }
                            ]}
                        >
                            {RegisterByHours.value === true
                                ? `${translate('HRM_PortalApp_EndTime') + ': ' + moment(TimeTo.value).format('HH:mm')} ${IsIncludeBenefitsHours.value && IsIncludeBenefitsHours?.PregnancyHours ? ' ' + `(+${IsIncludeBenefitsHours?.PregnancyHours} ${translate('HRM_PortalApp_OnlyHoursForWorkingOvertime')})` : ''}`
                                : RegisterHours.value
                                    ? `${translate('HRM_PortalApp_OnlyTime') +
                                    ': ' +
                                    RegisterHours.value +
                                    ' ' +
                                    translate('HRM_PortalApp_OnlyHoursForWorkingOvertime')
                                    } ${IsIncludeBenefitsHours.value && IsIncludeBenefitsHours?.PregnancyHours ? ' ' + `(+${IsIncludeBenefitsHours?.PregnancyHours} ${translate('HRM_PortalApp_OnlyHoursForWorkingOvertime')})` : ''}`
                                    : ''}
                        </Text>
                    </View>
                ) : null}

                {IsIncludeBenefitsHours.visible && (
                    <View
                        style={[
                            styles.caculatorHour,
                            CustomStyleSheet.flexDirection('row'),
                            CustomStyleSheet.borderBottomWidth(0),
                            CustomStyleSheet.flexWrap('wrap')
                        ]}
                    >
                        <VnrText
                            style={[
                                styleSheets.text,
                                styles.styLableGp,
                                CustomStyleSheet.fontWeight('400'),
                                CustomStyleSheet.fontSize(14)
                            ]}
                            i18nKey={'HRM_PortalApp_BenefitEntitlement'}
                        />
                        <Text>{': '}</Text>
                        <TouchableOpacity
                            onPress={() => {
                                this.setState({
                                    IsIncludeBenefitsHours: {
                                        ...IsIncludeBenefitsHours,
                                        value: !IsIncludeBenefitsHours.value,
                                        refresh: !IsIncludeBenefitsHours.refresh
                                    }
                                });
                            }}
                        >
                            <Text
                                style={[
                                    styleSheets.text,
                                    styles.styLableGp,
                                    CustomStyleSheet.fontWeight('400'),
                                    CustomStyleSheet.fontSize(14),
                                    IsIncludeBenefitsHours.value
                                        ? CustomStyleSheet.color(Colors.red)
                                        : CustomStyleSheet.color(Colors.blue)
                                ]}
                            >
                                {`${IsIncludeBenefitsHours.value ? translate('HRM_PortalApp_AttWorkingOvertime_Revoke') : translate('HRM_PortalApp_HreWorkManage_Add')} ${IsIncludeBenefitsHours.PregnancyHours} ${translate('HRM_PortalApp_Hours_Lowercase')} `}
                            </Text>
                        </TouchableOpacity>
                        <Text
                            style={[
                                styleSheets.text,
                                styles.styLableGp,
                                CustomStyleSheet.fontWeight('400'),
                                CustomStyleSheet.fontSize(14)
                            ]}
                        >
                            {`${IsIncludeBenefitsHours.value ? IsIncludeBenefitsHours.BenefitsMessage : IsIncludeBenefitsHours?.PregnanyType}`}
                        </Text>
                    </View>
                )}
                {
                    fieldConfig?.Explanation?.visibleConfig && <View style={styles.flRowSpaceBetween}>
                        <VnrText style={[styleSheets.lable, styles.styLableGp]} i18nKey={'HRM_PortalApp_Explanation'} />
                    </View>
                }
                {/* Loại tăng ca */}
                {OvertimeTypeID.visible && fieldConfig?.OvertimeTypeID?.visibleConfig && (
                    <VnrPickerLittle
                        fieldValid={fieldConfig?.OvertimeTypeID?.isValid}
                        isCheckEmpty={
                            fieldConfig?.OvertimeTypeID?.isValid && isError && !OvertimeTypeID.value ? true : false
                        }
                        refresh={OvertimeTypeID.refresh}
                        dataLocal={OvertimeTypeID.data ? OvertimeTypeID.data : []}
                        // api={{
                        //     urlApi:
                        //         '[URI_CENTER]/api/Att_GetData/GetMultiOvertimeTypeByTimeLine',
                        //     type: 'E_POST',
                        //     "dataBody": {
                        //         "WorkDate": `${this.workDateAllowe}`,
                        //         "profileID": `${Profiles.ID ? Profiles.ID : ''}`
                        //     }
                        // }}
                        value={OvertimeTypeID.value}
                        textField="OvertimeTypeName"
                        valueField="ID"
                        filter={true}
                        filterServer={true}
                        filterParams="text"
                        disable={OvertimeTypeID.disable}
                        lable={OvertimeTypeID.lable}
                        stylePicker={styles.resetBorder}
                        isChooseQuickly={true}
                        onFinish={(item) => {
                            this.setState({
                                OvertimeTypeID: {
                                    ...OvertimeTypeID,
                                    value: item ? { ...item } : null,
                                    refresh: !OvertimeTypeID.refresh
                                }
                            });
                        }}
                    />
                )}

                {(IsOverTimeBreak.visible && fieldConfig?.IsOverTimeBreak?.visibleConfig) && (
                    <View style={[CustomStyleSheet.borderBottomColor(Colors.gray_5), CustomStyleSheet.borderBottomWidth(0.5)]}>
                        <VnrSwitch
                            lable={IsOverTimeBreak.lable}
                            isDisable={IsOverTimeBreak.disable}
                            value={IsOverTimeBreak.value}
                            onFinish={(value) => this.setState({
                                IsOverTimeBreak: {
                                    ...IsOverTimeBreak,
                                    value: value,
                                    refresh: !IsOverTimeBreak.refresh
                                }
                            }, () => {
                                if (RegisterByHours.value) {
                                    this.UpdateEndOT();
                                } else {
                                    this.UpdateRegisterHours();
                                }
                            })}
                        />
                    </View>
                )}

                {/* không kiểm tra in/out */}
                {IsNotCheckInOut.visible && fieldConfig?.IsNotCheckInOut?.visibleConfig && (
                    <View style={[CustomStyleSheet.borderBottomColor(Colors.gray_5), CustomStyleSheet.borderBottomWidth(0.5)]}>
                        <VnrSwitch
                            lable={IsNotCheckInOut.lable}
                            isDisable={IsNotCheckInOut.disable}
                            value={IsNotCheckInOut.value}
                            onFinish={(value) => this.setState({
                                IsNotCheckInOut: {
                                    ...IsNotCheckInOut,
                                    value: value,
                                    refresh: !IsNotCheckInOut.refresh
                                }
                            })}
                        />
                    </View>
                )}

                {/* Phong ban điều chuyển */}
                {TransferDepartment.visible && fieldConfig?.TransferDepartment.visibleConfig &&
                    <View>
                        <VnrTreeView
                            api={{
                                urlApi: '[URI_CENTER]/api/Cat_GetData/GetOrgTreeView',
                                type: 'E_GET'
                            }}
                            refresh={TransferDepartment.refresh}
                            isControlCreate={true}
                            fieldValid={fieldConfig?.TransferDepartment?.isValid}
                            isCheckEmpty={
                                fieldConfig?.TransferDepartment?.isValid && isError && !TransferDepartment.value
                                    ? true
                                    : false
                            }
                            fieldName={'OrgStructureIDs'}
                            isCheckChildren={false}
                            response={'string'}
                            textField={configOrgStructureTransID.textField}
                            valueField={configOrgStructureTransID.valueField}
                            newStyle={true}
                            layoutFilter={true}
                            value={TransferDepartment.value}
                            lable={TransferDepartment.lable}
                            onSelect={(listItem) => {
                                this.setState({
                                    TransferDepartment: {
                                        ...TransferDepartment,
                                        value: listItem,
                                        refresh: !TransferDepartment.refresh
                                    }
                                });
                            }}
                        />
                    </View>
                }

                {/* OPTION Lý do tăng ca */}
                {/* default hide */}
                {OvertimeReasonID.visible && fieldConfig?.OvertimeReasonID.visibleConfig && (
                    <VnrPickerLittle
                        fieldValid={fieldConfig?.OvertimeReasonID?.isValid}
                        isCheckEmpty={
                            fieldConfig?.OvertimeReasonID?.isValid && isError && !OvertimeReasonID.value ? true : false
                        }
                        refresh={OvertimeReasonID.refresh}
                        api={{
                            urlApi: '[URI_CENTER]/api/Att_GetData/GetMultiOvertimeReason',
                            type: 'E_GET'
                        }}
                        value={OvertimeReasonID.value}
                        textField="OvertimeReasonName"
                        valueField="ID"
                        filter={true}
                        filterServer={true}
                        filterParams="text"
                        // params="OvertimeReasonID"
                        disable={OvertimeReasonID.disable}
                        lable={OvertimeReasonID.lable}
                        stylePicker={styles.resetBorder}
                        isChooseQuickly={true}
                        onFinish={(item) => {
                            this.setState({
                                OvertimeReasonID: {
                                    ...OvertimeReasonID,
                                    value: { ...item },
                                    refresh: !OvertimeReasonID.refresh
                                }
                            });
                        }}
                    />
                )}

                {isOtherInformation === false && isShowBtnOtherInformation && (
                    <View style={styles.wrapBtnOtherInformation}>
                        <TouchableOpacity
                            // disabled={isOtherInformation}
                            onPress={() => {
                                this.setState({
                                    isOtherInformation: true
                                });
                            }}
                            style={styles.btnOtherInformation}
                        >
                            <IconCreate size={Size.iconSize} color={Colors.blue} />
                            <VnrText
                                style={[
                                    styleSheets.text,
                                    stylesVnrPickerV3.styLbNotHaveValuePicker,
                                    { ...CustomStyleSheet.marginLeft(8), ...CustomStyleSheet.color(Colors.blue) }
                                ]}
                                i18nKey={'HRM_Sys_OtherInfor'}
                            />
                        </TouchableOpacity>
                    </View>
                )}

                {isOtherInformation && (
                    <View>
                        {/* Checkbox Chuyển TLĐV - IsUnitAssistant */}
                        {IsUnitAssistant.visibleConfig && fieldConfig?.IsUnitAssistant.visibleConfig && (
                            <View
                                style={[
                                    stylesListPickerControl.contentViewControl,
                                    stylesVnrPickerV3.styContentPicker,
                                    styles.wrapLableAndCheckbox
                                ]}
                            >
                                <View style={styles.fl07_aliCenter}>
                                    <View style={stylesListPickerControl.viewLable}>
                                        <VnrText
                                            style={[
                                                styleSheets.text,
                                                stylesVnrPickerV3.styLbNotHaveValuePicker,
                                                CustomStyleSheet.marginLeft(0)
                                            ]}
                                            i18nKey={IsUnitAssistant.lable}
                                        />
                                        {fieldConfig?.IsUnitAssistant?.isValid && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                </View>
                                <View style={styles.wrapCheckbox}>
                                    <CheckBox
                                        isChecked={IsUnitAssistant.value}
                                        disable={IsUnitAssistant.disable}
                                        checkedCheckBoxColor={Colors.primary}
                                        onClick={() =>
                                            this.setState({
                                                IsUnitAssistant: {
                                                    ...IsUnitAssistant,
                                                    value: !IsUnitAssistant.value
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Checkbox Đăng ký ăn ngoài giờ - IsSignUpToEat */}
                        {IsSignUpToEat.visibleConfig && fieldConfig?.IsSignUpToEat.visibleConfig && (
                            <View
                                style={[
                                    stylesListPickerControl.contentViewControl,
                                    stylesVnrPickerV3.styContentPicker,
                                    styles.wrapLableAndCheckbox
                                ]}
                            >
                                <View style={styles.fl07_aliCenter}>
                                    <View style={stylesListPickerControl.viewLable}>
                                        <VnrText
                                            style={[
                                                styleSheets.text,
                                                stylesVnrPickerV3.styLbNotHaveValuePicker,
                                                CustomStyleSheet.marginLeft(0)
                                            ]}
                                            i18nKey={IsSignUpToEat.lable}
                                        />
                                        {fieldConfig?.IsSignUpToEat?.isValid && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                </View>
                                <View style={styles.wrapCheckbox}>
                                    <CheckBox
                                        isChecked={IsSignUpToEat.value}
                                        disable={IsSignUpToEat.disable}
                                        checkedCheckBoxColor={Colors.primary}
                                        onClick={() =>
                                            this.setState({
                                                IsSignUpToEat: {
                                                    ...IsSignUpToEat,
                                                    value: !IsSignUpToEat.value
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Checkbox Yêu cầu thanh toán TCKC - IsRequestForBenefit */}
                        {IsRequestForBenefit.visibleConfig && fieldConfig?.IsRequestForBenefit.visibleConfig && (
                            <View
                                style={[
                                    stylesListPickerControl.contentViewControl,
                                    stylesVnrPickerV3.styContentPicker,
                                    styles.wrapLableAndCheckbox
                                ]}
                            >
                                <View style={styles.fl07_aliCenter}>
                                    <View style={stylesListPickerControl.viewLable}>
                                        <VnrText
                                            style={[
                                                styleSheets.text,
                                                stylesVnrPickerV3.styLbNotHaveValuePicker,
                                                CustomStyleSheet.marginLeft(0)
                                            ]}
                                            i18nKey={IsRequestForBenefit.lable}
                                        />
                                        {fieldConfig?.IsRequestForBenefit?.isValid && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                </View>
                                <View style={styles.wrapCheckbox}>
                                    <CheckBox
                                        isChecked={IsRequestForBenefit.value}
                                        disable={IsRequestForBenefit.disable}
                                        checkedCheckBoxColor={Colors.primary}
                                        onClick={() =>
                                            this.setState({
                                                IsRequestForBenefit: {
                                                    ...IsRequestForBenefit,
                                                    value: !IsRequestForBenefit.value
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Checkbox Yêu cầu ra/vào cổng - IsRequestEntryExitGate */}
                        {IsRequestEntryExitGate.visibleConfig && fieldConfig?.IsRequestEntryExitGate.visibleConfig && (
                            <View
                                style={[
                                    stylesListPickerControl.contentViewControl,
                                    stylesVnrPickerV3.styContentPicker,
                                    styles.wrapLableAndCheckbox
                                ]}
                            >
                                <View style={styles.fl07_aliCenter}>
                                    <View style={stylesListPickerControl.viewLable}>
                                        <VnrText
                                            style={[
                                                styleSheets.text,
                                                stylesVnrPickerV3.styLbNotHaveValuePicker,
                                                CustomStyleSheet.marginLeft(8)
                                            ]}
                                            i18nKey={IsRequestEntryExitGate.lable}
                                        />
                                        {fieldConfig?.IsRequestEntryExitGate?.isValid && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                </View>
                                <View style={styles.wrapCheckbox}>
                                    <CheckBox
                                        isChecked={IsRequestEntryExitGate.value}
                                        disable={IsRequestEntryExitGate.disable}
                                        checkedCheckBoxColor={Colors.primary}
                                        onClick={() =>
                                            this.setState({
                                                IsRequestEntryExitGate: {
                                                    ...IsRequestEntryExitGate,
                                                    value: !IsRequestEntryExitGate.value
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Loại đơn vị kinh doanh */}
                        {BusinessUnitTypeID.visible && fieldConfig?.BusinessUnitTypeID.visibleConfig && (
                            <VnrPickerLittle
                                fieldValid={fieldConfig?.BusinessUnitTypeID?.isValid}
                                isCheckEmpty={
                                    fieldConfig?.BusinessUnitTypeID?.isValid && isError && !BusinessUnitTypeID.value
                                        ? true
                                        : false
                                }
                                refresh={BusinessUnitTypeID.refresh}
                                // dataLocal={BusinessUnitTypeID.data ? BusinessUnitTypeID.data : []}
                                api={{
                                    urlApi: '[URI_CENTER]/api/Att_GetData/GetMultiShopGroup?text=&TextField=BusinessUnitTypeID',
                                    type: 'E_GET'
                                }}
                                value={BusinessUnitTypeID.value}
                                textField="ShopGroupView"
                                valueField="ID"
                                filter={true}
                                filterServer={true}
                                // filterParams="text"
                                // params="BusinessUnitTypeID"
                                disable={BusinessUnitTypeID.disable}
                                lable={BusinessUnitTypeID.lable}
                                stylePicker={styles.resetBorder}
                                isChooseQuickly={true}
                                onFinish={(item) => {
                                    this.setState({
                                        BusinessUnitTypeID: {
                                            ...BusinessUnitTypeID,
                                            value: item ? item : null,
                                            refresh: !BusinessUnitTypeID.refresh
                                        }
                                    });
                                }}
                            />
                        )}

                        {/* Đơn vị kinh doanh */}
                        {BusinessUnitID.visible && fieldConfig?.BusinessUnitID.visibleConfig && (
                            <VnrPickerLittle
                                fieldValid={fieldConfig?.BusinessUnitID?.isValid}
                                isCheckEmpty={
                                    fieldConfig?.BusinessUnitID?.isValid && isError && !BusinessUnitID.value
                                        ? true
                                        : false
                                }
                                refresh={BusinessUnitID.refresh}
                                // dataLocal={BusinessUnitID.data ? BusinessUnitID.data : []}
                                api={{
                                    urlApi: '[URI_CENTER]/api/Att_GetData/GetMultiShop?text=&TextField=BusinessUnitID',
                                    type: 'E_GET'
                                }}
                                value={BusinessUnitID.value}
                                textField="ShopName"
                                valueField="ID"
                                filter={true}
                                filterServer={true}
                                // filterParams="text"
                                // params="BusinessUnitID"
                                disable={BusinessUnitID.disable}
                                lable={BusinessUnitID.lable}
                                stylePicker={styles.resetBorder}
                                isChooseQuickly={true}
                                onFinish={(item) => {
                                    this.setState({
                                        BusinessUnitID: {
                                            ...BusinessUnitID,
                                            value: item ? item : null,
                                            refresh: !BusinessUnitID.refresh
                                        }
                                    });
                                }}
                            />
                        )}

                        {/* Nơi gửi đến */}
                        {SendToID.visible && fieldConfig?.SendToID.visibleConfig && (
                            <VnrPickerLittle
                                fieldValid={fieldConfig?.SendToID?.isValid}
                                isCheckEmpty={
                                    fieldConfig?.SendToID?.isValid && isError && !SendToID.value ? true : false
                                }
                                refresh={SendToID.refresh}
                                // dataLocal={SendToID.data ? SendToID.data : []}
                                api={{
                                    urlApi: '[URI_CENTER]/api/Att_GetData/GetMultiWorkPlaceCodeNameWhichEmailNotNull?text=&TextField=SendToID',
                                    type: 'E_GET'
                                }}
                                value={SendToID.value}
                                textField="WorkPlaceName"
                                valueField="ID"
                                filter={true}
                                filterServer={true}
                                // filterParams="text"
                                // params="SendToID"
                                disable={SendToID.disable}
                                lable={SendToID.lable}
                                stylePicker={styles.resetBorder}
                                isChooseQuickly={true}
                                onFinish={(item) => {
                                    this.setState({
                                        SendToID: {
                                            ...SendToID,
                                            value: item ? item : null,
                                            refresh: !SendToID.refresh
                                        }
                                    });
                                }}
                            />
                        )}

                        {/* Lý do tăng ca */}
                        {OvertimeArea.visible && fieldConfig?.OvertimeArea.visibleConfig && (
                            <VnrTextInput
                                fieldValid={fieldConfig?.OvertimeArea?.isValid}
                                isCheckEmpty={
                                    fieldConfig?.OvertimeArea?.isValid && isError && OvertimeArea.value.length === 0
                                        ? true
                                        : false
                                }
                                placeHolder={'HRM_PortalApp_PleaseInput'}
                                disable={OvertimeArea.disable}
                                lable={OvertimeArea.lable}
                                style={[styleSheets.text, viewInputMultiline, CustomStyleSheet.paddingHorizontal(8)]}
                                multiline={true}
                                value={OvertimeArea.value}
                                onChangeText={(text) => {
                                    this.setState({
                                        OvertimeArea: {
                                            ...OvertimeArea,
                                            value: text,
                                            refresh: !OvertimeArea.refresh
                                        }
                                    });
                                }}
                                onFocus={() => {
                                    Platform.OS == 'ios' && onScrollToInputIOS(indexDay + 1, this.layoutHeightItem);
                                }}
                                refresh={OvertimeArea.refresh}
                            />
                        )}
                    </View>
                )}
            </View>
        );
    }
}

const styles = styleComonAddOrEdit;

export default AttSubmitWorkingOvertimeComponent;
