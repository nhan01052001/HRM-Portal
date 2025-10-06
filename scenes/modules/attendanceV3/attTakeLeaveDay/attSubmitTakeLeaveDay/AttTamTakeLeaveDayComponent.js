/* eslint-disable indent */
import React from 'react';
import { View, TouchableOpacity, Text, Platform, StyleSheet } from 'react-native';
import { styleSheets, stylesVnrPickerV3, Colors, styleValid, CustomStyleSheet } from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrDate from '../../../../../componentsV3/VnrDate/VnrDate';
import VnrTextInput from '../../../../../componentsV3/VnrTextInput/VnrTextInput';
import VnrAttachFile from '../../../../../componentsV3/VnrAttachFile/VnrAttachFile';
import VnrPickerQuickly from '../../../../../componentsV3/VnrPickerQuickly/VnrPickerQuickly';
import HttpService from '../../../../../utils/HttpService';
import { EnumName } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import moment from 'moment';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import VnrDateFromTo from '../../../../../componentsV3/VnrDateFromTo/VnrDateFromTo';
import { translate } from '../../../../../i18n/translate';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';
import DrawerServices from '../../../../../utils/DrawerServices';
import CheckBox from 'react-native-check-box';
import VnrPickerLittle from '../../../../../componentsV3/VnrPickerLittle/VnrPickerLittle';

const initSateDefault = {
    DateRage: {
        value: null,
        lable: 'HRM_PortalApp_TakeLeave_WorkDate',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    HoursFrom: {
        value: null,
        lable: 'HRM_PortalApp_TakeLeave_HoursFrom',
        disable: false,
        refresh: false,
        visible: false,
        visibleConfig: true
    },
    HoursTo: {
        value: null,
        valueConfigRegisterHours: null,
        lable: 'HRM_PortalApp_TakeLeave_HoursTo',
        data: [],
        disable: false,
        refresh: false,
        visible: false,
        visibleConfig: true
    },
    DurationType: {
        value: null,
        data: [],
        lable: 'HRM_PortalApp_TakeLeave_DurationType',
        disable: false,
        refresh: false,
        visible: false,
        visibleConfig: true
    },
    LeaveDayTypeID: {
        value: null,
        lable: 'HRM_PortalApp_TakeLeave_LeaveDayTypeID',
        disable: true,
        refresh: false,
        visible: false,
        visibleConfig: true
    },
    LeaveDays: {
        value: null,
        lable: 'HRM_PortalApp_TakeLeave_LeaveDays',
        visible: false,
        visibleConfig: true
    },
    LeaveHours: {
        value: null,
        lable: 'HRM_PortalApp_TakeLeave_LeaveHours',
        visible: true,
        visibleConfig: true
    },
    ShiftID: {
        lable: 'HRM_Attendance_InOut_ShiftID',
        value: null,
        visible: false,
        refresh: false,
        visibleConfig: true,
        disable: false
    },
    BirthType: {
        data: null,
        value: null,
        lable: 'HRM_PortalApp_TakeLeave_BirthType',
        disable: false,
        refresh: false,
        visible: false,
        visibleConfig: true,
        isValid: false
    },
    Children: {
        value: '',
        lable: 'HRM_PortalApp_TakeLeave_Children',
        disable: false,
        refresh: false,
        visible: false,
        visibleConfig: true,
        isValid: false
    },
    ListLeaveDayTypeDefault: {
        value: null,
        data: null
    },
    Comment: {
        value: '',
        lable: 'HRM_PortalApp_TakeLeave_Comment',
        disable: true,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    FileAttachment: {
        lable: 'HRM_PortalApp_TakeLeave_FileAttachment',
        visible: true,
        visibleConfig: true,
        disable: true,
        refresh: false,
        value: null
    },
    timeRangeFromRoster: null,
    lstLeaveDaysHours: {},
    acIsCheckEmpty: false,
    RequiredDocuments: '',
    AddEmployee: {
        lable: 'HRM_PortalApp_TakeLeave_ToNeedAReplacement',
        subLable: 'HRM_PortalApp_TakeLeave_ChooseReplacementIfHave',
        value: false,
        visible: true,
        refresh: false,
        visibleConfig: true,
        disable: false
    },
    Substitute: {
        data: null,
        value: null,
        lable: 'HRM_PortalApp_TakeLeave_SubstituteID',
        disable: false,
        refresh: false,
        visible: false,
        visibleConfig: true,
        isValid: false
    },
    FileAttach: {
        lable: 'HRM_PortalApp_DocumentToSubmit',
        visible: false,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },
    RelativeTypeID: {
        value: null,
        lable: 'HRM_HR_Relatives_RelativeTypeID',
        disable: false,
        refresh: false,
        visible: false,
        visibleConfig: true
    },
    IsPermissionLeave: {
        lable: 'HRM_PortalApp_LeaveDay_IsPermissionLeave',
        value: false,
        visible: true,
        refresh: false,
        visibleConfig: true,
        disable: false
    }
};

const DATA_DURATION_FULL = ['E_FULLSHIFT', 'E_FIRSTHALFSHIFT', 'E_LASTHALFSHIFT', 'E_MIDDLEOFSHIFT'],
    DATA_DURATION_HAlF = ['E_FULLSHIFT', 'E_FIRST', 'E_LAST', 'E_FIRST_AND_LAST'];

class AttTakeLeaveDayComponent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initSateDefault,
            Profile: {
                ID: null,
                ProfileName: '',
                disable: true
            },
            isConfigMultiTimeInOut: true,
            isRefreshState: false
        };

        this.layoutHeightItem = null;
        this.ShiftIDByDate = null;
        this.IsHaveListRegisterHours = null;
    }

    // Những trường hợp được phép render lại
    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextProps.isRefresh !== this.props.isRefresh ||
            nextProps.isShowDelete !== this.props.isShowDelete ||
            nextProps.acIsCheckEmpty !== this.props.acIsCheckEmpty ||
            // thay đổi state value thì mới render lại
            nextState.isRefreshState !== this.state.isRefreshState ||
            // thay đổi state value thì mới render lại
            // nextState.DateStart.value !== this.state.DateStart.value ||
            // nextState.DateEnd.value !== this.state.DateEnd.value ||
            nextState.HoursFrom.value !== this.state.HoursFrom.value ||
            nextState.HoursTo.value !== this.state.HoursTo.value ||
            nextState.DurationType.value !== this.state.DurationType.value ||
            nextState.Comment.value !== this.state.Comment.value ||
            nextState.LeaveDayTypeID.value !== this.state.LeaveDayTypeID.value ||
            nextState.FileAttachment.value !== this.state.FileAttachment.value ||
            nextState.LeaveDays.value !== this.state.LeaveDays.value ||
            nextState.LeaveHours.value !== this.state.LeaveHours.value ||
            nextState.Children.value !== this.state.Children.value ||
            nextState.BirthType.value !== this.state.BirthType.value ||
            nextState.RequiredDocuments !== this.state.RequiredDocuments ||
            nextState.acIsCheckEmpty !== this.state.acIsCheckEmpty.value ||
            nextState.ShiftID.value !== this.state.ShiftID.value ||
            nextState.AddEmployee.value !== this.state.AddEmployee.value ||
            nextState.FileAttach.value !== this.state.FileAttach.value ||
            nextState.RelativeTypeID.value !== this.state.RelativeTypeID.value
        ) {
            return true;
        } else {
            return false;
        }
    }

    //#region Hàm xử lý, getDate, getTxtTotalCount, findIntersectionTimeFrame (Tìm giao ca)
    // doTimeRangesOverlap (check HourFrom HourTo có nằm trong giao ca không)
    getDate = () => {
        const { DateRage } = this.state;
        const lstDurationType = DATA_DURATION_FULL.map((key) => {
            return { Text: translate(key), Value: key };
        });

        if (DateRage.value && Array.isArray(DateRage.value) && DateRage.value.length > 1) {
            // Đăng ký nhiều ngày cùng lúc
            return {
                dataDurationType: lstDurationType,
                DateStart: DateRage.value[0],
                DateEnd: DateRage.value[0]
            };
        } else if (
            DateRage.value &&
            Object.keys(DateRage.value).length > 0 &&
            DateRage.value.startDate &&
            DateRage.value.endDate
        ) {
            // Đăng ký nhiều ngày liên tục
            let isSameDay = moment(DateRage.value.startDate).isSame(DateRage.value.endDate, 'day'),
                _data = isSameDay
                    ? lstDurationType
                    : DATA_DURATION_HAlF.map((key) => {
                        return { Text: translate(key), Value: key };
                    });

            return {
                dataDurationType: _data,
                DateStart: DateRage.value.startDate,
                DateEnd: isSameDay ? DateRage.value.endDate : moment(DateRage.value.endDate).endOf('day')
            };
        } else {
            // Đăng ký từng ngày , 1 ngày
            return {
                dataDurationType: lstDurationType,
                DateStart: DateRage.value[0],
                DateEnd: DateRage.value[0]
            };
        }
    };

    getTxtTotalCount = () => {
        const { LeaveDays, LeaveHours } = this.state;
        const { fieldConfig } = this.props;
        if (LeaveDays.value != null && LeaveDays.value != undefined) {
            if (LeaveDays.visible && fieldConfig?.LeaveHours?.visibleConfig && LeaveHours.visible) {
                return `${translate(LeaveDays.lable)}: (${LeaveDays.value} ${translate(
                    'HRM_PortalApp_Day_Lowercase'
                )}) - ${translate(LeaveHours.lable)}: (${LeaveHours.value} ${translate(
                    'HRM_PortalApp_Hour_Lowercase'
                )})`;
            } else if (LeaveDays.visible) {
                return `${translate(LeaveDays.lable)}: (${LeaveDays.value} ${translate(
                    'HRM_PortalApp_Day_Lowercase'
                )})`;
            } else if (fieldConfig?.LeaveHours?.visibleConfig && LeaveHours.visible) {
                return `${translate(LeaveHours.lable)}: (${LeaveHours.value} ${translate(
                    'HRM_PortalApp_Hour_Lowercase'
                )})`;
            } else {
                return '';
            }
        }
    };

    findIntersectionTimeFrame = (lstTimeStart, lstTimeEnd) => {
        // input : lstTimeStart : ["HH:mm","HH:mm", ... ] , lstTimeEnd : ["HH:mm","HH:mm", ...]
        const intersectionStart = moment.max(lstTimeStart);

        const intersectionEnd = moment.min(lstTimeEnd);

        if (intersectionStart.isBefore(intersectionEnd)) {
            return [intersectionStart, intersectionEnd];
        }
        // No intersection found
        return null;
    };

    doTimeRangesOverlap = (timeRange1, timeRange2) => {
        // input : timeRange1 : ["HH:mm","HH:mm"] , timeRange2 : ["HH:mm","HH:mm"]
        const [start1, end1] = timeRange1;
        const [start2, end2] = timeRange2;

        const startTime1 = start1;
        const endTime1 = end1;
        const startTime2 = start2;
        const endTime2 = end2;

        // Check if any of the conditions are true for overlap
        const isOverlap =
            (startTime1.isSameOrBefore(startTime2) && endTime1.isSameOrAfter(startTime2)) ||
            (startTime1.isSameOrAfter(startTime2) && startTime1.isBefore(endTime2)) ||
            (startTime2.isSameOrBefore(startTime1) && endTime2.isSameOrAfter(startTime1));

        return isOverlap;
    };

    showLoading = (isShow) => {
        const { showLoading } = this.props;
        showLoading && showLoading(isShow);
    };

    ToasterSevice = () => {
        const { ToasterSevice } = this.props;
        return ToasterSevice;
    };
    //#endregion

    //#region Step 1: Khởi tạo dữ liệu
    initState = () => {
        const { dateRage, record, workDate } = this.props,
            {
                Profile,
                isRefreshState,
                LeaveDays,
                LeaveHours,
                HoursFrom,
                HoursTo,
                DurationType,
                LeaveDayTypeID,
                BirthType,
                Children,
                AddEmployee,
                Substitute,
                FileAttach,
                RelativeTypeID,
                IsPermissionLeave
            } = this.state;

        const profileInfo = dataVnrStorage
            ? dataVnrStorage.currentUser
                ? dataVnrStorage.currentUser.info
                : null
            : null;

        const { E_ProfileID, E_FullName } = EnumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] };

        const { DateRage, FileAttachment, Comment } = this.state;

        if (record) {
            // Modify
            let dayValue = dateRage ? dateRage : [workDate];

            if (record.DurationType) {
                if (
                    record.DurationType === EnumName.E_FULLSHIFT ||
                    (DateRage.value &&
                        Object.keys(DateRage.value).length > 0 &&
                        DateRage.value.startDate &&
                        DateRage.value.endDate &&
                        !moment(DateRage.value.startDate).isSame(DateRage.value.endDate, 'day'))
                ) {
                    // Đăng ký nhiều ngày liên tục OR E_FULLSHIFT => hiển thị Ngày
                    nextState = {
                        ...nextState,
                        LeaveDays: {
                            ...LeaveDays,
                            visible: true
                        },
                        LeaveHours: {
                            ...LeaveHours,
                            visible: false
                        }
                    };
                } else {
                    nextState = {
                        ...nextState,
                        LeaveDays: {
                            ...LeaveDays,
                            visible: false
                        },
                        LeaveHours: {
                            ...LeaveHours,
                            visible: true
                        }
                    };
                }

                if (record.DurationType == EnumName.E_MIDDLEOFSHIFT) {
                    nextState = {
                        ...nextState,
                        HoursFrom: {
                            ...HoursFrom,
                            visible: true
                        },
                        HoursTo: {
                            ...HoursTo,
                            visible: true
                        }
                    };
                } else {
                    nextState = {
                        ...nextState,
                        HoursFrom: {
                            ...HoursFrom,
                            visible: false
                        },
                        HoursTo: {
                            ...HoursTo,
                            visible: false
                        }
                    };
                }
            }

            let nextState = {
                isRefreshState: !isRefreshState,
                Profile: {
                    ...Profile,
                    ..._profile
                },
                DateRage: {
                    ...DateRage,
                    value: dayValue,
                    refresh: !DateRage.refresh
                },
                LeaveDayTypeID: {
                    ...LeaveDayTypeID,
                    disable: false,
                    visible: true,
                    value: record.LeaveDayTypeID
                        ? {
                            LeaveDayTypeName: `${record.LeaveDayTypeCode} - ${record.LeaveDayTypeName}`,
                            ID: record.LeaveDayTypeID
                        }
                        : null,
                    refresh: !LeaveDayTypeID.refresh
                },
                DurationType: {
                    ...DurationType,
                    visible: true,
                    disable: false,
                    value: record.DurationType ? { Text: record.DurationTypeView, Value: record.DurationType } : null,
                    refresh: !DurationType.refresh
                },
                Comment: {
                    ...Comment,
                    disable: false,
                    visible: true,
                    value: record.Comment ? record.Comment : null,
                    refresh: !Comment.refresh
                },
                LeaveDays: {
                    ...nextState.LeaveDays,
                    value: record.LeaveDays ? record.LeaveDays : 0
                },
                LeaveHours: {
                    ...nextState.LeaveHours,
                    value: record.LeaveHours ? record.LeaveHours : 0
                },
                HoursFrom: {
                    ...nextState.HoursFrom,
                    value: record.HoursFrom ? moment(record.HoursFrom) : null
                },
                HoursTo: {
                    ...nextState.HoursTo,
                    valueConfigRegisterHours: record?.LeaveHours ? {
                        'Value': record?.LeaveHours,
                        'Text': `${record?.LeaveHours}`,
                        'isSelect': true
                    } : null,
                    value: record.HoursTo ? moment(record.HoursTo) : null
                },
                BirthType: {
                    ...BirthType,
                    disable: false,
                    visible: record.BirthType ? true : false,
                    value: record.BirthType ? { Value: record.BirthType, Text: record.BirthTypeName } : null,
                    refresh: !BirthType.refresh
                },
                Children: {
                    ...Children,
                    disable: false,
                    visible: record.Children ? true : false,
                    value: record.Children ? `${record.Children}` : null,
                    refresh: !Children.refresh
                },
                AddEmployee: {
                    ...AddEmployee,
                    disable: false,
                    visible: true,
                    value: record.IsSubstitute ? true : false,
                    refresh: !AddEmployee.refresh
                },
                Substitute: {
                    ...Substitute,
                    visible: record.IsSubstitute ? true : false,
                    value: record.SubstituteID
                        ? { JoinProfileNameCode: record.SubstituteName, ID: record.SubstituteID }
                        : null,
                    refresh: !Substitute.refresh
                },
                RelativeTypeID: {
                    ...RelativeTypeID,
                    visible: record.RelativeTypeID ? true : false,
                    value: record.RelativeTypeID
                        ? { RelativeTypeName: `${record.RelativeTypeCode} - ${record.RelativeTypeName}`, ID: record.RelativeTypeID }
                        : null,
                    refresh: !RelativeTypeID.refresh
                },
                IsPermissionLeave: {
                    ...IsPermissionLeave,
                    value: record.IsPermissionLeave ?? false,
                    refresh: !IsPermissionLeave.refresh
                }
            };

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

            // Value FileAttach
            if (record.FileAttach) {
                let valFile = ManageFileSevice.setFileAttachApp(record.FileAttach);

                nextState = {
                    ...nextState,
                    FileAttach: {
                        ...FileAttach,
                        disable: false,
                        value: (valFile && valFile.length > 0) ? valFile : null,
                        refresh: !FileAttach.refresh
                    }
                };
            }
            else {
                nextState = {
                    ...nextState,
                    FileAttach: {
                        ...FileAttach,
                        disable: false,
                        value: null,
                        refresh: !FileAttach.refresh
                    }
                };
            }

            this.setState(nextState, () => {
                this.getDataLeavedayType(true);
                this.getRosterForCheckLeaveday();
            });
        } else {
            this.setState(
                {
                    ...initSateDefault,
                    Profile: {
                        ...Profile,
                        ..._profile
                    },
                    isRefreshState: !isRefreshState
                },
                () => {
                    let dayValue = dateRage ? dateRage : [workDate];
                    this.onChangeDateRage(dayValue, true);
                }
            );
        }
    };

    componentDidMount() {
        this.initState();
    }

    unduData = () => {
        this.initState();
    };
    //#endregion

    //#region Step 2: Change DateRage. Lấy dữ liệu data leaveDayType và Duration
    onChangeDateRage = (item, isFromInit) => {
        const { DateRage, FileAttachment, Comment, isRefreshState } = this.state;
        this.setState(
            {
                DateRage: {
                    ...DateRage,
                    value: item,
                    refresh: !DateRage.refresh
                },
                Comment: {
                    ...Comment,
                    disable: false,
                    refresh: !Comment.refresh
                },
                FileAttachment: {
                    ...FileAttachment,
                    disable: false,
                    refresh: !FileAttachment.refresh
                },
                isRefreshState: !isRefreshState
            },
            () => {
                this.getDataLeavedayType();

                // gọi từ componentsDidmount thì k cần gọi
                if (!isFromInit) {
                    // Cập nhật lại ngày đăng ký bên ngoài
                    const { DateRage } = this.state;

                    const { onUpdateDay, indexDay } = this.props;
                    onUpdateDay && onUpdateDay(indexDay, DateRage.value);
                }
            }
        );
    };

    onChangeDateRageOnly = () => { };

    getDataLeavedayType = async (isFromModify) => {
        const {
            DateRage,
            Profile,
            LeaveDays,
            LeaveHours,
            LeaveDayTypeID,
            DurationType,
            ShiftID,
            HoursFrom,
            HoursTo,
            isRefreshState,
            ListLeaveDayTypeDefault,
            BirthType,
            Children,
            FileAttach,
            FileAttachment
        } = this.state;

        try {
            if (DateRage.value) {
                if (DateRage.value && Array.isArray(DateRage.value) && DateRage.value.length > 1) {
                    // Đăng ký nhiều ngày cùng lúc
                    let nextState = {};
                    this.showLoading(true);

                    const dataRoster = {
                        LeaveDays: 0,
                        LeaveHours: 0,
                        ListShift: {},
                        lstLeaveDaysHours: {},
                        DurationType: {
                            value: null,
                            data: []
                        }
                    };

                    const dataDurationType = DATA_DURATION_FULL.map((key) => {
                        return { Text: translate(key), Value: key };
                    }),
                        { DateStart, DateEnd } = this.getDate(),
                        dataBody = {
                            DateStart: Vnr_Function.formatDateAPI(DateStart),
                            DateEnd: Vnr_Function.formatDateAPI(DateEnd),
                            DurationType: EnumName.E_FULLSHIFT,
                            ListProfileID: [Profile.ID]
                        };

                    const resLeaveType = await HttpService.Post('[URI_CENTER]/api/Att_GetData/GetLeaveTypeByGrade', {
                        ...dataBody,
                        ProfileID: Profile.ID
                    });

                    for (let index = 0; index < DateRage.value.length; index++) {
                        const item = DateRage.value[index];

                        const resRoster = await HttpService.Post(
                            '[URI_CENTER]/api/Att_LeaveDay/GetRosterForCheckLeaveDay',
                            {
                                ...dataBody,
                                DateStart: Vnr_Function.formatDateAPI(item),
                                DateEnd: Vnr_Function.formatDateAPI(item)
                            }
                        );

                        const resData = resRoster.Data;
                        if (resData) {
                            if (resData.IsNonShift && resData.MessageError) {
                                this.props
                                    .ToasterSevice()
                                    .showWarning(`${moment(item).format('DD/MM/YYYY')} ${resData.MessageError}`, 5000);
                            }

                            // Cộng lại tổng giờ nghỉ và tổng ngày nghỉ lại
                            if (resData.LeaveDays && resData.LeaveHours) {
                                dataRoster.LeaveDays += resData.LeaveDays;
                                dataRoster.LeaveHours += resData.LeaveHours;

                                dataRoster.lstLeaveDaysHours[item] = {
                                    LeaveDays: resData.LeaveDays,
                                    LeaveHours: resData.LeaveHours
                                };
                            }

                            if (resData.ListShift && resData.ListShift.length > 0)
                                resData.ListShift.forEach((e) => {
                                    dataRoster.ListShift[e.ShiftID] = e;
                                    //	0184782: [Hotfix_ KOG_v8.11. 21.01.10.217]: Lỗi hiển thị số giờ nghỉ không đúng khi đăng ký ngày nghỉ trên app.
                                    this.ShiftIDByDate = {
                                        ...this.ShiftIDByDate,
                                        [`${item}`]: e.ShiftID
                                    };
                                });

                            // nhan.nguyen: 0172432: [Hotfix_TBCBALL_v8.11.31.01.08] Modify áp dụng cấu hình "loại trừ ngày nghỉ" cho App
                            if (
                                Array.isArray(resData?.ListDurationTypeExclude) &&
                                resData?.ListDurationTypeExclude.length > 0
                            ) {
                                let findDurationType = resData?.ListDurationTypeExclude.find(
                                    (item) => item?.Value === resData?.DurationType
                                );

                                // default durationtype from resData
                                let valueDuration = findDurationType
                                    ? findDurationType
                                    : resData?.ListDurationTypeExclude[0];

                                dataRoster.DurationType.value = valueDuration;
                                dataRoster.DurationType.data = resData?.ListDurationTypeExclude;
                            }

                            // 0185343: [hot fix OPA_v8.12.20.01.06] [App OPA] lỗi đăng ký ngày nghỉ không hiển thị field đính kèm chứng từ
                            if (resRoster?.Data?.InsuranceType && !FileAttach?.visible) {
                                nextState = {
                                    ...nextState,
                                    FileAttach: {
                                        ...FileAttach,
                                        visible: true,
                                        refresh: !FileAttach.refresh
                                    },
                                    FileAttachment: {
                                        ...FileAttachment,
                                        visible: false,
                                        refresh: !FileAttachment.refresh
                                    }
                                };
                            } else if (!resRoster?.Data?.InsuranceType && FileAttach?.visible) {
                                nextState = {
                                    ...nextState,
                                    FileAttach: {
                                        ...FileAttach,
                                        visible: false,
                                        refresh: !FileAttach.refresh
                                    },
                                    FileAttachment: {
                                        ...FileAttachment,
                                        visible: true,
                                        refresh: !FileAttachment.refresh
                                    }
                                };
                            }
                        }
                    }

                    this.showLoading(false);

                    let findValue = null;
                    if (dataDurationType && Array.isArray(dataDurationType) && dataDurationType.length > 0) {
                        findValue = dataDurationType.find((e) => e.Value === EnumName.E_FULLSHIFT);
                    }

                    nextState = {
                        ...nextState,
                        LeaveDays: {
                            ...LeaveDays,
                            value: dataRoster.LeaveDays ? dataRoster.LeaveDays : 0,
                            visible: true
                        },
                        LeaveHours: {
                            ...LeaveHours,
                            value: dataRoster.LeaveHours ? dataRoster.LeaveHours : 0,
                            visible: false
                        },
                        lstLeaveDaysHours: dataRoster.lstLeaveDaysHours,
                        DurationType: {
                            ...DurationType,
                            value: findValue ? findValue : null,
                            data: dataDurationType,
                            refresh: !DurationType.refresh,
                            visible: true,
                            disable: false
                        },
                        ShiftID: {
                            ...ShiftID,
                            value:
                                dataRoster.ListShift && Object.keys(dataRoster.ListShift).length > 0
                                    ? Object.keys(dataRoster.ListShift).join(',')
                                    : null
                        }
                    };

                    if (resLeaveType) {
                        const dataLeaveType = resLeaveType.Data;

                        nextState = {
                            ...nextState,
                            LeaveDayTypeID: {
                                ...LeaveDayTypeID,
                                value: null,
                                data: dataLeaveType,
                                refresh: !LeaveDayTypeID.refresh,
                                visible: true,
                                disable: false
                            }
                        };
                    }

                    // nhan.nguyen: 0172432: [Hotfix_TBCBALL_v8.11.31.01.08] Modify áp dụng cấu hình "loại trừ ngày nghỉ" cho App
                    if (dataRoster.DurationType.value || dataRoster.DurationType.data.length > 0) {
                        nextState = {
                            ...nextState,
                            DurationType: {
                                ...DurationType,
                                value: dataRoster.DurationType.value,
                                data: dataRoster.DurationType.data,
                                refresh: !DurationType.refresh
                            }
                        };
                    }

                    this.setState(nextState);
                } else {
                    // từ ngày đến ngày và 1 ngày
                    this.showLoading(true);

                    const { DateStart, DateEnd, dataDurationType } = this.getDate();
                    const dataBody = {
                        DateStart: moment(DateStart).format('YYYY/MM/DD'), //Vnr_Function.formatDateAPI(DateStart),
                        DateEnd: moment(DateEnd).format('YYYY/MM/DD'), //Vnr_Function.formatDateAPI(DateEnd),
                        DurationType: isFromModify ? DurationType.value.Value : EnumName.E_FULLSHIFT,
                        ListProfileID: [Profile.ID],
                        LeaveDayTypeID: LeaveDayTypeID.value ? LeaveDayTypeID.value.ID : null
                    };

                    HttpService.MultiRequest([
                        HttpService.Post('[URI_CENTER]/api/Att_LeaveDay/GetRosterForCheckLeaveDay', dataBody),
                        HttpService.Post('[URI_CENTER]/api/Att_GetData/GetLeaveTypeByGrade', {
                            ...dataBody,
                            ProfileID: Profile.ID
                        })
                    ]).then((resAll) => {
                        this.showLoading(false);

                        const [resRoster, resLeaveType] = resAll;
                        let nextState = { isRefreshState: !isRefreshState };
                        if (isFromModify) {
                            let valueDuration = DurationType.value;
                            if (
                                Array.isArray(resRoster?.Data?.ListDurationTypeExclude) &&
                                resRoster?.Data?.ListDurationTypeExclude.length > 0
                            ) {
                                let findDurationType = resRoster?.Data?.ListDurationTypeExclude.find(
                                    (item) => item?.Value === DurationType.value.Value
                                );
                                // default durationtype from resRoster
                                if (findDurationType) {
                                    valueDuration = findDurationType;
                                }

                                nextState = {
                                    ...nextState,
                                    DurationType: {
                                        ...DurationType,
                                        value: valueDuration,
                                        data: resRoster?.Data?.ListDurationTypeExclude,
                                        refresh: !DurationType.refresh
                                    }
                                };
                            } else {
                                nextState = {
                                    ...nextState,
                                    DurationType: {
                                        ...DurationType,
                                        data: dataDurationType,
                                        refresh: !DurationType.refresh
                                    }
                                };
                            }

                            if (resLeaveType) {
                                const dataLeaveType = resLeaveType.Data;

                                nextState = {
                                    ...nextState,
                                    LeaveDayTypeID: {
                                        ...LeaveDayTypeID,
                                        data: dataLeaveType,
                                        refresh: !LeaveDayTypeID.refresh
                                    }
                                };
                            }

                            const dataRoster = resRoster.Data;

                            // hieu.tran 171081
                            if (dataRoster && dataRoster.ListEnumBirthType && dataRoster.ListEnumBirthType.length > 0) {
                                nextState = {
                                    ...nextState,
                                    ListLeaveDayTypeDefault: {
                                        ...ListLeaveDayTypeDefault,
                                        data: dataRoster.ListLeaveDayTypeDefault,
                                        value: null
                                    },
                                    BirthType: {
                                        ...BirthType,
                                        data: dataRoster.ListEnumBirthType,
                                        value:
                                            BirthType.value && dataRoster.ListEnumBirthType.length > 0
                                                ? dataRoster.ListEnumBirthType.find(
                                                    (item) => item.Value == BirthType.value.Value
                                                )
                                                : null,
                                        visible: true,
                                        refresh: BirthType.refresh
                                    },
                                    Children: {
                                        ...Children,
                                        visible: true,
                                        refresh: Children.refresh
                                    }
                                };
                            } else {
                                nextState = {
                                    ...nextState,
                                    ListLeaveDayTypeDefault: {
                                        ...ListLeaveDayTypeDefault,
                                        data: dataRoster.ListLeaveDayTypeDefault,
                                        value: null
                                    },
                                    BirthType: {
                                        ...BirthType,
                                        data: null,
                                        value: null,
                                        visible: false,
                                        refresh: BirthType.refresh
                                    },
                                    Children: {
                                        ...Children,
                                        value: '',
                                        visible: false,
                                        refresh: Children.refresh
                                    }
                                };
                            }
                        } else {
                            if (resRoster) {
                                const dataRoster = resRoster.Data;
                                if (dataRoster?.ListShift?.length > 1) {
                                    dataRoster.ListShift.unshift({
                                        ShiftName: translate('HRM_Att_TakeLeave_AllShift'),
                                        ShiftID: null
                                    });
                                    nextState = {
                                        ...nextState,
                                        ShiftID: {
                                            ...ShiftID,
                                            data: dataRoster.ListShift,
                                            visible: true,
                                            value: { ...dataRoster.ListShift[0] }
                                        }
                                    };
                                } else {
                                    nextState = {
                                        ...nextState,
                                        ShiftID: {
                                            ...ShiftID,
                                            value:
                                                dataRoster && dataRoster.ListShift && dataRoster.ListShift?.length > 0
                                                    ? { ...dataRoster.ListShift[0] }
                                                    : null
                                        }
                                    };
                                }
                                if (dataRoster && dataRoster.IsNonShift && dataRoster.MessageError) {
                                    this.props.ToasterSevice().showWarning(dataRoster.MessageError, 5000);
                                }

                                let findValue = null;
                                if (
                                    dataDurationType &&
                                    Array.isArray(dataDurationType) &&
                                    dataDurationType.length > 0
                                ) {
                                    findValue = dataDurationType.find((e) => e.Value === EnumName.E_FULLSHIFT);
                                }

                                nextState = {
                                    ...nextState,
                                    LeaveDays: {
                                        ...LeaveDays,
                                        value: dataRoster && dataRoster.LeaveDays ? dataRoster.LeaveDays : 0,
                                        visible: true
                                    },
                                    LeaveHours: {
                                        ...LeaveHours,
                                        value: dataRoster && dataRoster.LeaveHours ? dataRoster.LeaveHours : 0,
                                        visible: false
                                    },
                                    DurationType: {
                                        ...DurationType,
                                        value: findValue ? findValue : null,
                                        data: dataDurationType,
                                        refresh: !DurationType.refresh,
                                        visible: true,
                                        disable: false
                                    },
                                    HoursFrom: {
                                        ...HoursFrom,
                                        value: dataRoster && dataRoster.HoursFrom ? dataRoster.HoursFrom : null,
                                        visible: false
                                    },
                                    HoursTo: {
                                        ...HoursTo,
                                        value: dataRoster && dataRoster.HoursTo ? dataRoster.HoursTo : null,
                                        visible: false
                                    }
                                };

                                // hieu.tran 171081
                                if (
                                    dataRoster &&
                                    dataRoster.ListEnumBirthType &&
                                    dataRoster.ListEnumBirthType.length > 0
                                ) {
                                    nextState = {
                                        ...nextState,
                                        ListLeaveDayTypeDefault: {
                                            ...ListLeaveDayTypeDefault,
                                            data: dataRoster.ListLeaveDayTypeDefault,
                                            value: null
                                        },
                                        BirthType: {
                                            ...BirthType,
                                            data: dataRoster.ListEnumBirthType,
                                            visible: true,
                                            refresh: BirthType.refresh
                                        },
                                        Children: {
                                            ...Children,
                                            visible: true,
                                            refresh: Children.refresh
                                        }
                                    };
                                } else {
                                    nextState = {
                                        ...nextState,
                                        ListLeaveDayTypeDefault: {
                                            ...ListLeaveDayTypeDefault,
                                            data: dataRoster.ListLeaveDayTypeDefault,
                                            value: null
                                        },
                                        BirthType: {
                                            ...BirthType,
                                            data: null,
                                            value: null,
                                            visible: false,
                                            refresh: BirthType.refresh
                                        },
                                        Children: {
                                            ...Children,
                                            value: '',
                                            visible: false,
                                            refresh: Children.refresh
                                        }
                                    };
                                }
                            }

                            if (resLeaveType) {
                                const dataLeaveType = resLeaveType.Data;

                                nextState = {
                                    ...nextState,
                                    LeaveDayTypeID: {
                                        ...LeaveDayTypeID,
                                        value: null,
                                        data: dataLeaveType,
                                        refresh: !LeaveDayTypeID.refresh,
                                        visible: true,
                                        disable: false
                                    }
                                };
                            }

                            // nhan.nguyen: 0172432: [Hotfix_TBCBALL_v8.11.31.01.08] Modify áp dụng cấu hình "loại trừ ngày nghỉ" cho App
                            if (
                                Array.isArray(resRoster?.Data?.ListDurationTypeExclude) &&
                                resRoster?.Data?.ListDurationTypeExclude.length > 0
                            ) {
                                let findDurationType = resRoster?.Data?.ListDurationTypeExclude.find(
                                    (item) => item?.Value === resRoster?.Data?.DurationType
                                );

                                // default durationtype from resRoster
                                let valueDuration = findDurationType
                                    ? findDurationType
                                    : resRoster?.Data?.ListDurationTypeExclude[0];

                                nextState = {
                                    ...nextState,
                                    DurationType: {
                                        ...DurationType,
                                        value: valueDuration,
                                        data: resRoster?.Data?.ListDurationTypeExclude,
                                        refresh: !DurationType.refresh
                                    }
                                };
                            }
                        }

                        // 0185343: [hot fix OPA_v8.12.20.01.06] [App OPA] lỗi đăng ký ngày nghỉ không hiển thị field đính kèm chứng từ
                        if (resRoster?.Data?.InsuranceType && !FileAttach?.visible) {
                            nextState = {
                                ...nextState,
                                FileAttach: {
                                    ...FileAttach,
                                    visible: true,
                                    refresh: !FileAttach.refresh
                                },
                                FileAttachment: {
                                    ...FileAttachment,
                                    visible: false,
                                    refresh: !FileAttachment.refresh
                                }
                            };
                        } else if (!resRoster?.Data?.InsuranceType && FileAttach?.visible) {
                            nextState = {
                                ...nextState,
                                FileAttach: {
                                    ...FileAttach,
                                    visible: false,
                                    refresh: !FileAttach.refresh
                                },
                                FileAttachment: {
                                    ...FileAttachment,
                                    visible: true,
                                    refresh: !FileAttachment.refresh
                                }
                            };
                        }

                        this.setState(nextState);
                    });
                }
            }
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };
    //#endregion

    //#region Step 3: Change Loại ĐK
    onchangeDuration = (item) => {
        const { DurationType, DateRage, LeaveDays, LeaveHours, HoursFrom, HoursTo } = this.state;
        let nextState = {
            DurationType: {
                ...DurationType,
                value: item,
                refresh: !DurationType.refresh
            }
        };

        if (item) {
            if (
                item.Value === EnumName.E_FULLSHIFT ||
                (DateRage.value &&
                    Object.keys(DateRage.value).length > 0 &&
                    DateRage.value.startDate &&
                    DateRage.value.endDate &&
                    !moment(DateRage.value.startDate).isSame(DateRage.value.endDate, 'day'))
            ) {
                // Đăng ký nhiều ngày liên tục OR E_FULLSHIFT => hiển thị Ngày
                nextState = {
                    ...nextState,
                    LeaveDays: {
                        ...LeaveDays,
                        visible: true
                    },
                    LeaveHours: {
                        ...LeaveHours,
                        visible: false
                    }
                };
            } else {
                nextState = {
                    ...nextState,
                    LeaveDays: {
                        ...LeaveDays,
                        visible: false
                    },
                    LeaveHours: {
                        ...LeaveHours,
                        visible: true
                    }
                };
            }

            if (item.Value == EnumName.E_MIDDLEOFSHIFT) {
                nextState = {
                    ...nextState,
                    HoursFrom: {
                        ...HoursFrom,
                        visible: true
                    },
                    HoursTo: {
                        ...HoursTo,
                        visible: true
                    },
                    LeaveDays: {
                        ...LeaveDays,
                        visible: true
                    }
                };
            } else {
                nextState = {
                    ...nextState,
                    HoursFrom: {
                        ...HoursFrom,
                        visible: false
                    },
                    HoursTo: {
                        ...HoursTo,
                        visible: false
                    }
                };
            }
        }

        this.setState(nextState, () => {
            this.getRosterForCheckLeaveday();
        });
    };

    getRosterForCheckLeaveday = async (isChangeBirthTypeOrChildren = false) => {
        const {
            Profile,
            LeaveDays,
            LeaveHours,
            DurationType,
            ShiftID,
            DateRage,
            HoursFrom,
            HoursTo,
            LeaveDayTypeID,
            BirthType,
            Children,
            ListLeaveDayTypeDefault,
            isRefreshState,
            FileAttach,
            FileAttachment,
            RelativeTypeID
        } = this.state;
        if (DurationType.value) {
            if (DateRage.value && Array.isArray(DateRage.value) && DateRage.value.length > 1) {
                // Đăng ký nhiều ngày cùng lúc
                let nextState = {};
                const dataDurationType = DATA_DURATION_FULL.map((key) => {
                    return { Text: translate(key), Value: key };
                });
                this.showLoading(true);

                const dataRoster = {
                    LeaveDays: 0,
                    LeaveHours: 0,
                    ListShift: {},
                    HoursFrom: {},
                    HoursTo: {},
                    listHoursFrom: [],
                    listHoursTo: [],
                    lstLeaveDaysHours: {},
                    DurationType: {
                        value: null,
                        data: []
                    },
                    listRegisterHours: []
                };

                const dataBody = {
                    DurationType: DurationType.value ? DurationType.value.Value : null,
                    ListProfileID: [Profile.ID],
                    ShiftID: ShiftID.value ? ShiftID.value : null,
                    LeaveDayTypeID: LeaveDayTypeID.value ? LeaveDayTypeID.value.ID : null
                };

                for (let index = 0; index < DateRage.value.length; index++) {
                    const item = DateRage.value[index];

                    const resRoster = await HttpService.Post(
                        '[URI_CENTER]/api/Att_LeaveDay/GetRosterForCheckLeaveDay',
                        {
                            ...dataBody,
                            DateStart: Vnr_Function.formatDateAPI(item),
                            DateEnd: Vnr_Function.formatDateAPI(item)
                        }
                    );

                    const resData = resRoster.Data;

                    // 0185682: Tách từ task 0159195: Lỗi không chặn đăng ký nghỉ phép năm theo số giờ cho phép - APP
                    if (resData?.IsHaveListRegisterHours && Array.isArray(resData?.ListRegisterHours)) {
                        this.IsHaveListRegisterHours = resData?.IsHaveListRegisterHours;
                        dataRoster.listRegisterHours = resData?.ListRegisterHours;
                    }

                    if (resData && resData.ListEnumBirthType && resData.ListEnumBirthType.length > 0) {
                        this.props.ToasterSevice().showWarning('HRM_PortalApp_TakeLeave_BirthType_NoSP', 5000);

                        this.setState({
                            LeaveDayTypeID: {
                                ...LeaveDayTypeID,
                                value: null,
                                refresh: LeaveDayTypeID.refresh
                            }
                        });
                        return;
                    }

                    if (resData.IsNonShift && resData.MessageError) {
                        this.props
                            .ToasterSevice()
                            .showWarning(`${moment(item).format('DD/MM/YYYY')} ${resData.MessageError}`, 5000);
                    }

                    // Cộng tổng giờ nghỉ và tổng ngày nghỉ lại
                    if (resData.LeaveDays && resData.LeaveHours) {
                        dataRoster.LeaveDays += resData.LeaveDays;
                        dataRoster.LeaveHours += resData.LeaveHours;

                        dataRoster.lstLeaveDaysHours[item] = {
                            LeaveDays: resData.LeaveDays,
                            LeaveHours: resData.LeaveHours
                        };
                    }

                    if (resData.ListShift && resData.ListShift?.length > 0)
                        resData.ListShift.forEach((e) => {
                            dataRoster.ListShift[e.ShiftID] = e;
                            //	0184782: [Hotfix_ KOG_v8.11. 21.01.10.217]: Lỗi hiển thị số giờ nghỉ không đúng khi đăng ký ngày nghỉ trên app.
                            this.ShiftIDByDate = {
                                ...this.ShiftIDByDate,
                                [`${item}`]: e.ShiftID
                            };
                        });

                    if (resData.HoursFrom) {
                        dataRoster.HoursFrom[resData.HoursFrom] = resData.HoursFrom;

                        // giữ ca
                        dataRoster.listHoursFrom.push(moment(resData.HoursFrom));
                    }

                    if (resData.HoursTo) {
                        dataRoster.HoursTo[resData.HoursTo] = resData.HoursTo;

                        // giữ ca
                        dataRoster.listHoursTo.push(moment(resData.HoursTo));
                    }

                    // nhan.nguyen: 0172432: [Hotfix_TBCBALL_v8.11.31.01.08] Modify áp dụng cấu hình "loại trừ ngày nghỉ" cho App
                    if (
                        Array.isArray(resData?.ListDurationTypeExclude) &&
                        resData?.ListDurationTypeExclude.length > 0
                    ) {
                        let findDurationType = resData?.ListDurationTypeExclude.find(
                            (item) => item?.Value === resData?.DurationType
                        );

                        // default durationtype from resData
                        let valueDuration = findDurationType ? findDurationType : resData?.ListDurationTypeExclude[0];

                        dataRoster.DurationType.value = valueDuration;
                        dataRoster.DurationType.data = resData?.ListDurationTypeExclude;
                    } else if (resData?.DurationType) {
                        dataRoster.DurationType.value = dataDurationType.find((e) => e.Value === resData?.DurationType);
                    }

                    // 0185343: [hot fix OPA_v8.12.20.01.06] [App OPA] lỗi đăng ký ngày nghỉ không hiển thị field đính kèm chứng từ
                    if (resRoster?.Data?.InsuranceType && !FileAttach?.visible) {
                        nextState = {
                            ...nextState,
                            FileAttach: {
                                ...FileAttach,
                                visible: true,
                                refresh: !FileAttach.refresh
                            },
                            FileAttachment: {
                                ...FileAttachment,
                                visible: false,
                                refresh: !FileAttachment.refresh
                            }
                        };
                    } else if (!resRoster?.Data?.InsuranceType && FileAttach?.visible) {
                        nextState = {
                            ...nextState,
                            FileAttach: {
                                ...FileAttach,
                                visible: false,
                                refresh: !FileAttach.refresh
                            },
                            FileAttachment: {
                                ...FileAttachment,
                                visible: true,
                                refresh: !FileAttachment.refresh
                            }
                        };
                    }
                    if (resData?.IsFuneral) {
                        nextState = {
                            ...nextState,
                            RelativeTypeID: {
                                ...RelativeTypeID,
                                visible: true
                            }
                        };
                    } else {
                        nextState = {
                            ...nextState,
                            RelativeTypeID: {
                                ...RelativeTypeID,
                                value: null,
                                visible: false
                            }
                        };
                    }
                }

                // giữ ca
                let getTimeRages = null;
                if (dataRoster.listHoursFrom.length > 0 && dataRoster.listHoursTo.length > 0)
                    getTimeRages = this.findIntersectionTimeFrame(dataRoster.listHoursFrom, dataRoster.listHoursTo);

                this.showLoading(false);

                nextState = {
                    ...nextState,
                    LeaveDays: {
                        ...LeaveDays,
                        value: dataRoster.LeaveDays ? dataRoster.LeaveDays : 0
                    },
                    LeaveHours: {
                        ...LeaveHours,
                        value: dataRoster.LeaveHours ? dataRoster.LeaveHours : 0
                    },
                    lstLeaveDaysHours: dataRoster.lstLeaveDaysHours,
                    HoursFrom: {
                        ...HoursFrom,
                        value:
                            Object.keys(dataRoster.HoursFrom).length == 1 ? Object.keys(dataRoster.HoursFrom)[0] : null,
                        refresh: !HoursFrom.refresh
                    },
                    HoursTo: {
                        ...HoursTo,
                        data: dataRoster.listRegisterHours,
                        value: Object.keys(dataRoster.HoursTo).length == 1 ? Object.keys(dataRoster.HoursTo)[0] : null,
                        refresh: !HoursTo.refresh
                    },
                    ShiftID: {
                        ...ShiftID,
                        value:
                            dataRoster.ListShift && Object.keys(dataRoster.ListShift)?.length > 0
                                ? Object.keys(dataRoster.ListShift).join(',')
                                : null
                    },
                    timeRangeFromRoster: getTimeRages
                };

                // nhan.nguyen: 0172432: [Hotfix_TBCBALL_v8.11.31.01.08] Modify áp dụng cấu hình "loại trừ ngày nghỉ" cho App
                if (dataRoster.DurationType.value && dataRoster.DurationType.data.length > 0) {
                    nextState = {
                        ...nextState,
                        DurationType: {
                            ...DurationType,
                            value: dataRoster.DurationType.value,
                            data: dataRoster.DurationType.data,
                            refresh: !DurationType.refresh
                        }
                    };
                } else {
                    let findValue = dataRoster.DurationType.value;
                    if (
                        dataDurationType &&
                        Array.isArray(dataDurationType) &&
                        dataDurationType.length > 0 &&
                        findValue == null
                    ) {
                        findValue = dataDurationType.find((e) => e.Value === EnumName.E_FULLSHIFT);
                    }

                    nextState = {
                        ...nextState,
                        DurationType: {
                            ...DurationType,
                            value: findValue ? findValue : null,
                            data: dataDurationType,
                            refresh: !DurationType.refresh,
                            visible: true,
                            disable: false
                        }
                    };
                }

                // hide controls HoursFrom and HoursTo
                if (nextState?.DurationType?.value?.Value !== EnumName.E_MIDDLEOFSHIFT) {
                    nextState = {
                        ...nextState,
                        HoursFrom: {
                            ...HoursFrom,
                            visible: false
                        },
                        HoursTo: {
                            ...HoursTo,
                            visible: false
                        }
                    };
                } else {
                    // không load giờ vào ra đã chọn khi bấm chọn Loại ngày nghỉ
                    nextState = {
                        ...nextState,
                        HoursFrom: {
                            ...HoursFrom,
                            value: HoursFrom.value
                                ? HoursFrom.value
                                : Object.keys(dataRoster.HoursFrom).length == 1
                                    ? Object.keys(dataRoster.HoursFrom)[0]
                                    : null,
                            refresh: !HoursTo.refresh
                        },
                        HoursTo: {
                            ...HoursTo,
                            data: dataRoster.listRegisterHours,
                            value: HoursTo.value
                                ? HoursTo.value
                                : Object.keys(dataRoster.HoursTo).length == 1
                                    ? Object.keys(dataRoster.HoursTo)[0]
                                    : null,
                            refresh: !HoursTo.refresh
                        }
                    };
                }

                this.setState(nextState, () => {
                    // nhan.nguyen: tính số giờ nghỉ khi chọn loại giữa ca
                    if (DurationType.value?.Value === EnumName.E_MIDDLEOFSHIFT) {
                        this.handleGetLeaveHourMidleShift();
                    }
                });
            } else {
                const { DateStart, DateEnd, dataDurationType } = this.getDate();
                this.showLoading(true);

                const dataBody = {
                    DateStart: Vnr_Function.formatDateAPI(DateStart),
                    DateEnd: Vnr_Function.formatDateAPI(DateEnd),
                    DurationType: DurationType.value ? DurationType.value.Value : null,
                    ListProfileID: [Profile.ID],
                    ShiftID: ShiftID.value ? ShiftID.value.ShiftID : null,
                    LeaveDayTypeID: LeaveDayTypeID.value ? LeaveDayTypeID.value.ID : null
                };

                HttpService.Post('[URI_CENTER]/api/Att_LeaveDay/GetRosterForCheckLeaveDay', dataBody).then(
                    (resRoster) => {
                        this.showLoading(false);
                        let nextState = {};

                        if (resRoster) {
                            const dataRoster = resRoster.Data;
                            if (dataRoster?.ListShift?.length > 1) {
                                dataRoster?.ListShift?.unshift({
                                    ShiftName: translate('HRM_Att_TakeLeave_AllShift'),
                                    ShiftID: null
                                });
                                nextState = {
                                    ...nextState,
                                    ShiftID: {
                                        ...ShiftID,
                                        value: { ...dataRoster.ListShift[0] }
                                    }
                                };
                            } else {
                                nextState = {
                                    ...nextState,
                                    ShiftID: {
                                        ...ShiftID,
                                        value:
                                            dataRoster && dataRoster.ListShift && dataRoster.ListShift?.length > 0
                                                ? { ...dataRoster.ListShift[0] }
                                                : null
                                    }
                                };
                            }
                            if (dataRoster?.IsFuneral) {
                                nextState = {
                                    ...nextState,
                                    RelativeTypeID: {
                                        ...RelativeTypeID,
                                        visible: true
                                    }
                                };
                            } else {
                                nextState = {
                                    ...nextState,
                                    RelativeTypeID: {
                                        ...RelativeTypeID,
                                        value: null,
                                        visible: false
                                    }
                                };
                            }
                            nextState = {
                                ...nextState,
                                isRefreshState: !isRefreshState,
                                LeaveDays: {
                                    ...LeaveDays,
                                    value: dataRoster.LeaveDays ? dataRoster.LeaveDays : 0
                                },
                                LeaveHours: {
                                    ...LeaveHours,
                                    value: dataRoster.LeaveHours ? dataRoster.LeaveHours : 0
                                },
                                HoursFrom: {
                                    ...HoursFrom,
                                    value: dataRoster?.HoursFrom ? dataRoster?.HoursFrom : null,
                                    refresh: !HoursFrom.refresh
                                },
                                HoursTo: {
                                    ...HoursTo,
                                    value: dataRoster?.HoursTo ? dataRoster?.HoursTo : null,
                                    refresh: !HoursTo.refresh
                                }
                            };

                            let valueBirthType = null;
                            // hieu.tran 171081
                            if (!isChangeBirthTypeOrChildren) {
                                if (
                                    dataRoster &&
                                    dataRoster.ListEnumBirthType &&
                                    dataRoster.ListEnumBirthType.length > 0
                                ) {
                                    valueBirthType = dataRoster.ListEnumBirthType.find(
                                        (item) => item.Value == 'E_NormalBirth'
                                    );

                                    if (valueBirthType == null && dataRoster.ListEnumBirthType.length == 1) {
                                        valueBirthType = dataRoster.ListEnumBirthType[0];
                                    }

                                    nextState = {
                                        ...nextState,
                                        ListLeaveDayTypeDefault: {
                                            ...ListLeaveDayTypeDefault,
                                            data: dataRoster.ListLeaveDayTypeDefault,
                                            value: null
                                        },
                                        BirthType: {
                                            ...BirthType,
                                            data: dataRoster.ListEnumBirthType,
                                            value: valueBirthType ? valueBirthType : null,
                                            visible: true,
                                            isValid: true,
                                            refresh: BirthType.refresh
                                        },
                                        Children: {
                                            ...Children,
                                            value: valueBirthType ? '1' : '',
                                            isValid: true,
                                            visible: true,
                                            refresh: Children.refresh
                                        }
                                    };
                                } else {
                                    nextState = {
                                        ...nextState,
                                        ListLeaveDayTypeDefault: {
                                            ...ListLeaveDayTypeDefault,
                                            data: dataRoster.ListLeaveDayTypeDefault,
                                            value: null
                                        },
                                        BirthType: {
                                            ...BirthType,
                                            data: null,
                                            value: null,
                                            visible: false,
                                            isValid: false,
                                            refresh: BirthType.refresh
                                        },
                                        Children: {
                                            ...Children,
                                            value: '',
                                            visible: false,
                                            isValid: false,
                                            refresh: Children.refresh
                                        }
                                    };
                                }
                            }

                            // nhan.nguyen: 0172432: [Hotfix_TBCBALL_v8.11.31.01.08] Modify áp dụng cấu hình "loại trừ ngày nghỉ" cho App
                            if (
                                Array.isArray(dataRoster?.ListDurationTypeExclude) &&
                                dataRoster?.ListDurationTypeExclude.length > 0
                            ) {
                                let findDurationType = dataRoster?.ListDurationTypeExclude.find(
                                    (item) => item?.Value === dataRoster?.DurationType
                                );

                                // default durationtype from dataRoster
                                let valueDuration = findDurationType
                                    ? findDurationType
                                    : dataRoster?.ListDurationTypeExclude[0];

                                nextState = {
                                    ...nextState,
                                    DurationType: {
                                        ...DurationType,
                                        value: valueDuration,
                                        data: dataRoster?.ListDurationTypeExclude,
                                        refresh: !DurationType.refresh
                                    }
                                };
                            } else {
                                let findValue = null;
                                if (
                                    dataDurationType &&
                                    Array.isArray(dataDurationType) &&
                                    dataDurationType.length > 0
                                ) {
                                    findValue = dataRoster?.DurationType
                                        ? dataDurationType.find((e) => e.Value === dataRoster?.DurationType)
                                        : dataDurationType.find((e) => e.Value === EnumName.E_FULLSHIFT);
                                }

                                nextState = {
                                    ...nextState,
                                    DurationType: {
                                        ...DurationType,
                                        value: findValue,
                                        data: dataDurationType,
                                        refresh: !DurationType.refresh
                                    }
                                };
                            }
                            // hide controls HoursFrom and HoursTo
                            if (nextState?.DurationType?.value?.Value !== EnumName.E_MIDDLEOFSHIFT) {
                                nextState = {
                                    ...nextState,
                                    HoursFrom: {
                                        ...(nextState.HoursFrom ? nextState.HoursFrom : HoursFrom),
                                        visible: false
                                    },
                                    HoursTo: {
                                        ...(nextState.HoursTo ? nextState.HoursTo : HoursTo),
                                        visible: false
                                    }
                                };
                            } else {
                                // không load giờ vào ra đã chọn khi bấm chọn Loại ngày nghỉ
                                nextState = {
                                    ...nextState,
                                    HoursFrom: {
                                        ...HoursFrom,
                                        value: HoursFrom.value ? HoursFrom.value : dataRoster?.HoursFrom,
                                        refresh: !HoursTo.refresh
                                    },
                                    HoursTo: {
                                        ...HoursTo,
                                        value: HoursTo.value ? HoursTo.value : dataRoster?.HoursTo,
                                        refresh: !HoursTo.refresh
                                    }
                                };
                            }

                            // 0185343: [hot fix OPA_v8.12.20.01.06] [App OPA] lỗi đăng ký ngày nghỉ không hiển thị field đính kèm chứng từ
                            if (resRoster?.Data?.InsuranceType && !FileAttach?.visible) {
                                nextState = {
                                    ...nextState,
                                    FileAttach: {
                                        ...FileAttach,
                                        visible: true,
                                        refresh: !FileAttach.refresh
                                    },
                                    FileAttachment: {
                                        ...FileAttachment,
                                        visible: false,
                                        refresh: !FileAttachment.refresh
                                    }
                                };
                            } else if (!resRoster?.Data?.InsuranceType && FileAttach?.visible) {
                                nextState = {
                                    ...nextState,
                                    FileAttach: {
                                        ...FileAttach,
                                        visible: false,
                                        refresh: !FileAttach.refresh
                                    },
                                    FileAttachment: {
                                        ...FileAttachment,
                                        visible: true,
                                        refresh: !FileAttachment.refresh
                                    }
                                };
                            }

                            // 0185682: Tách từ task 0159195: Lỗi không chặn đăng ký nghỉ phép năm theo số giờ cho phép - APP
                            if (dataRoster?.IsHaveListRegisterHours && Array.isArray(dataRoster?.ListRegisterHours)) {
                                this.IsHaveListRegisterHours = dataRoster?.IsHaveListRegisterHours;
                                nextState = {
                                    ...nextState,
                                    HoursTo: {
                                        ...HoursTo,
                                        data: dataRoster?.ListRegisterHours,
                                        value: this.props?.record?.HoursTo ? moment(this.props?.record?.HoursTo) : null,
                                        refresh: !HoursTo.refresh
                                    }
                                };
                            }

                            this.setState(nextState, () => {
                                // Trường hợp loại sinh == 1, set số con == 1
                                valueBirthType != null &&
                                    !isChangeBirthTypeOrChildren &&
                                    this.changeBirthTypeOrChildren();

                                // nhan.nguyen: tính số giờ nghỉ khi chọn loại giữa ca
                                if (DurationType.value?.Value === EnumName.E_MIDDLEOFSHIFT) {
                                    this.handleGetLeaveHourMidleShift();
                                }
                            });
                        }
                    }
                );
            }
        }
    };

    onChangeHourFromOrHourTo = () => {
        const { HoursFrom, HoursTo, timeRangeFromRoster } = this.state;
        if ((HoursFrom.value && HoursTo.value, timeRangeFromRoster)) {
            // check Giờ có nằm trong ca
            const timeChange = [moment(HoursFrom), moment(HoursTo)];
            const isValid = this.doTimeRangesOverlap(timeChange, timeRangeFromRoster);
            if (!isValid) {
                this.props.ToasterSevice().showWarning('HRM_PortalApp_TakeLeave_OutoffShift');
            }
        }
    };

    onChangeLeaveDayType = (item) => {
        const { LeaveDayTypeID } = this.state;
        this.setState(
            {
                LeaveDayTypeID: {
                    ...LeaveDayTypeID,
                    value: item,
                    refresh: !LeaveDayTypeID.refresh
                }
            },
            () => {
                this.getDataRequiredDocuments();
                this.getRemainFromLeaveDayType();
                this.getRosterForCheckLeaveday();
            }
        );
    };

    getDataRequiredDocuments = () => {
        const { LeaveDayTypeID, Profile } = this.state;
        if (LeaveDayTypeID.value) {
            const { DateStart, DateEnd } = this.getDate(),
                dataBody = {
                    DateStart: Vnr_Function.formatDateAPI(DateStart),
                    DateEnd: Vnr_Function.formatDateAPI(DateEnd),
                    ProfileID: Profile.ID
                };
            this.showLoading(true);
            HttpService.Post('[URI_CENTER]/api/Att_GetData/GetLeaveTypeByGrade', {
                ...dataBody
            })
                .then((res) => {
                    this.showLoading(false);
                    if (res.Status === EnumName.E_SUCCESS && res.Data) {
                        for (let i = 0; i < res.Data.length; i++) {
                            let item = res.Data[i];
                            if (item.ID === LeaveDayTypeID.value.ID) {
                                this.setState({
                                    RequiredDocuments: item.RequiredDocuments ? item.RequiredDocuments : ''
                                });
                                break;
                            }
                        }
                    }
                    // eslint-disable-next-line no-console
                })
                .catch(() => { });
        } else {
            this.setState({
                RequiredDocuments: ''
            });
        }
    };

    changeBirthTypeOrChildren = () => {
        // Hieu.Tran 171081
        const { BirthType, Children, ListLeaveDayTypeDefault, DateRage, isRefreshState } = this.state;
        const { DateStart } = this.getDate();

        if (
            BirthType.value &&
            Children.value !== null &&
            Children.value !== '' &&
            ListLeaveDayTypeDefault.data &&
            ListLeaveDayTypeDefault.data.length > 0
        ) {
            const birthValue = BirthType.value.Value,
                children = parseInt(Children.value);

            const findDays = ListLeaveDayTypeDefault.data.find((item) => {
                return item.BirthType == birthValue && item.Children == children;
            });

            if (findDays && findDays.Days) {
                if (findDays.Days > 1) {
                    // const dateRage = [DateStart,];
                    const dateRage = {
                        startDate: DateStart,
                        endDate: moment(DateStart)
                            .add(findDays.Days - 1, 'day')
                            .format('YYYY-MM-DD')
                    };

                    this.setState(
                        {
                            ListLeaveDayTypeDefault: {
                                ...ListLeaveDayTypeDefault,
                                value: findDays
                            },
                            DateRage: {
                                ...DateRage,
                                value: dateRage,
                                refresh: !DateRage.refresh
                            },
                            isRefreshState: !isRefreshState
                        },
                        () => {
                            this.getRosterForCheckLeaveday(true);
                        }
                    );
                }
            } else {
                const listEnum = ListLeaveDayTypeDefault.data.filter((item) => item.BirthType == birthValue);
                let maxDays = null;
                listEnum.forEach((item) => {
                    if (maxDays == null || (maxDays && item.Days > maxDays.Days)) {
                        maxDays = item;
                    }
                });
                if (maxDays && maxDays.Days > 1) {
                    // const dateRage = [DateStart, moment(DateStart).add(maxDays.Days - 1, 'day').format("DD-MM-YYYY")];
                    const dateRage = {
                        startDate: DateStart,
                        endDate: moment(DateStart)
                            .add(maxDays.Days - 1, 'day')
                            .format('YYYY-MM-DD')
                    };
                    this.setState(
                        {
                            ListLeaveDayTypeDefault: {
                                ...ListLeaveDayTypeDefault,
                                value: maxDays
                            },
                            DateRage: {
                                ...DateRage,
                                value: dateRage,
                                refresh: !DateRage.refresh
                            },
                            isRefreshState: !isRefreshState
                        },
                        () => {
                            this.getRosterForCheckLeaveday(true);
                        }
                    );
                }
            }
        }
    };
    //#endregion

    //#region Step 4: Các xử lý còn lại

    renderWorkDate = () => {
        const { DateRage } = this.state,
            { record, fieldConfig } = this.props;

        let isModify = record ? true : false;
        if (DateRage.value && Array.isArray(DateRage.value) && DateRage.value.length > 1) {
            // Đăng ký nhiều ngày cùng lúc
            return (
                <VnrDateFromTo
                    fieldValid={fieldConfig?.RegistrationDate?.isValid}
                    isCheckEmpty={fieldConfig?.RegistrationDate?.isValid && !DateRage.value ? true : false}
                    isControll={true}
                    lable={DateRage.lable}
                    refresh={DateRage.refresh}
                    value={DateRage.value === null ? {} : DateRage.value}
                    displayOptions={true}
                    onlyChooseEveryDay={false}
                    disable={DateRage.disable}
                    onFinish={(item) => this.onChangeDateRage(item)}
                />
            );
        } else if (
            DateRage.value &&
            Object.keys(DateRage.value).length > 0 &&
            DateRage.value.startDate &&
            DateRage.value.endDate
        ) {
            // Đăng ký nhiều ngày liên tục
            return (
                <VnrDateFromTo
                    fieldValid={fieldConfig?.RegistrationDate?.isValid}
                    isCheckEmpty={fieldConfig?.RegistrationDate?.isValid && !DateRage.value ? true : false}
                    isControll={true}
                    lable={DateRage.lable}
                    refresh={DateRage.refresh}
                    value={DateRage.value === null ? {} : DateRage.value}
                    displayOptions={isModify ? false : true}
                    onlyChooseEveryDay={false}
                    disable={DateRage.disable}
                    onFinish={(item) => this.onChangeDateRage(item)}
                />
            );
        } else {
            // Đăng ký từng ngày, 1 ngày
            return (
                <VnrDateFromTo
                    fieldValid={fieldConfig?.RegistrationDate?.isValid}
                    isCheckEmpty={fieldConfig?.RegistrationDate?.isValid && !DateRage.value ? true : false}
                    lable={DateRage.lable}
                    isControll={true}
                    refresh={DateRage.refresh}
                    value={DateRage.value === null ? {} : DateRage.value}
                    displayOptions={true}
                    onlyChooseEveryDay={false}
                    onlyChooseOneDay={true}
                    disable={DateRage.disable}
                    onFinish={(item) => this.onChangeDateRage(item)}
                />
            );
        }
    };

    getRemainFromLeaveDayType = () => {
        const { Profile, LeaveDayTypeID } = this.state;

        if (LeaveDayTypeID.value) {
            const { DateStart } = this.getDate(),
                { updateShowRemain } = this.props;

            this.showLoading(true);
            HttpService.Post('[URI_CENTER]/api/Att_LeaveDay/GetRemainAnlDays', {
                ProfileID: Profile.ID,
                DateStart: DateStart ? Vnr_Function.parseDateTime(DateStart) : null,
                LeavedayTypeID: LeaveDayTypeID.value ? LeaveDayTypeID.value.ID : null
            }).then((res) => {
                this.showLoading(false);
                if (res.Status === EnumName.E_SUCCESS && res?.Data) {
                    updateShowRemain && updateShowRemain(res?.Data);
                }
            });
        }
    };

    getAllData = () => {
        const {
            Profile,
            FileAttachment,
            Comment,
            LeaveDays,
            LeaveHours,
            LeaveDayTypeID,
            DurationType,
            ShiftID,
            HoursFrom,
            HoursTo,
            lstLeaveDaysHours,
            ListLeaveDayTypeDefault,
            BirthType,
            Children,
            AddEmployee,
            Substitute,
            FileAttach,
            RelativeTypeID,
            IsPermissionLeave
        } = this.state,
            { levelApprove, fieldConfig, record } = this.props;

        const { DateStart, DateEnd } = this.getDate();

        if (
            (!LeaveDayTypeID.value) ||
            (fieldConfig.Comment.isValid && (Comment.value == null || Comment.value == '')) ||
            (fieldConfig?.FileAttachment?.isValid && !FileAttachment.value) ||
            !DurationType.value ||
            (BirthType.visible && BirthType.isValid && !BirthType.value) ||
            (RelativeTypeID.visible && !RelativeTypeID.value) ||
            (Children.visible && Children.isValid && (Children.value == null || Children.value == '')) ||
            (fieldConfig?.FileAttach?.isValid && !FileAttach.value)
        ) {
            this.setState({
                acIsCheckEmpty: true
            });
            return;
        }

        let nextPrams = {};

        if (FileAttach.visible) {
            nextPrams = {
                ...nextPrams,
                FileAttach: FileAttach.value ? FileAttach.value.map(item => item.fileName).join(',') : null
            };
        }

        return {
            IsTwoShift: ShiftID.value?.ShiftID === null ? true : false,
            ID: record && record.ID ? record.ID : null,
            ProfileID: Profile.ID,
            ListProfileID: [Profile.ID],
            DateStart: DateStart ? Vnr_Function.formatDateAPI(DateStart) : null,
            DateEnd: DateEnd ? Vnr_Function.formatDateAPI(DateEnd) : null,
            HoursFrom: HoursFrom.value ? Vnr_Function.formatDateAPI(HoursFrom.value) : null,
            HoursTo: HoursTo.value ? Vnr_Function.formatDateAPI(HoursTo.value) : null,
            LeaveDayTypeID: LeaveDayTypeID.value ? LeaveDayTypeID.value.ID : null,
            DurationType: DurationType.value ? DurationType.value.Value : null,
            ShiftID: ShiftID.value?.ShiftID ? ShiftID.value?.ShiftID : null,
            LeaveDays: !isNaN(LeaveDays.value) ? LeaveDays.value : 0,
            LeaveHours: !isNaN(LeaveHours.value) ? LeaveHours.value : 0,
            LevelApproved: levelApprove,
            FileAttachment: FileAttachment.value ? FileAttachment.value.map((item) => item.fileName).join(',') : null,
            Comment: Comment.value ? Comment.value : null,
            LeaveBirth: ListLeaveDayTypeDefault.value ? ListLeaveDayTypeDefault.value.Days : null,
            LeaveDayTypeDefaultID: ListLeaveDayTypeDefault.value ? ListLeaveDayTypeDefault.value.ID : null,
            lstLeaveDaysHours: lstLeaveDaysHours,
            IsSubstitute: AddEmployee.value,
            SubstituteID: Substitute.value ? Substitute.value.ID : null,
            ShiftIDByDate: this.ShiftIDByDate,
            RelativeTypeID: RelativeTypeID.value ? RelativeTypeID.value.ID : null,
            IsPermissionLeave: IsPermissionLeave.value,
            ...nextPrams
        };
    };

    GetLeaveHoursByShift = () => {
        try {
            const { LeaveDays, LeaveHours, DurationType, ShiftID, HoursFrom, HoursTo } = this.state;

            if (ShiftID?.value?.ShiftID) {
                let params = {
                    DurationType: DurationType.value?.Value ? DurationType.value.Value : null,
                    ShiftID: ShiftID.value?.ShiftID ? ShiftID.value?.ShiftID : null
                };

                HttpService.Post('[URI_CENTER]/api/Att_LeaveDay/GetLeaveHoursByShift', params)
                    .then((res) => {
                        if (res?.Status === EnumName.E_SUCCESS) {
                            this.setState({
                                LeaveDays: {
                                    ...LeaveDays,
                                    value: !isNaN(res?.Data?.LeaveDays) ? res?.Data?.LeaveDays : LeaveDays?.value,
                                    refresh: !LeaveDays?.refresh
                                },
                                LeaveHours: {
                                    ...LeaveHours,
                                    value: !isNaN(res?.Data?.LeaveHours) ? res?.Data?.LeaveHours : LeaveHours?.value,
                                    refresh: !LeaveHours?.refresh
                                },
                                HoursFrom: {
                                    ...HoursFrom,
                                    value: res?.Data?.HoursFrom
                                        ? Vnr_Function.formatDateAPI(res?.Data?.HoursFrom)
                                        : null,
                                    refresh: !HoursFrom?.refresh
                                },
                                HoursTo: {
                                    ...HoursTo,
                                    value: res?.Data?.HoursTo ? Vnr_Function.formatDateAPI(res?.Data?.HoursTo) : null,
                                    refresh: !HoursTo?.refresh
                                }
                            });
                        }
                    })
                    .catch((error) => {
                        this.showLoading(false);
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    });
            }
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    handleNeedAReplacement = () => {
        const { AddEmployee } = this.state;
        this.setState(
            {
                AddEmployee: {
                    ...AddEmployee,
                    value: !AddEmployee.value,
                    refresh: !AddEmployee.refresh
                }
            },
            () => {
                this.handleShowSubstituteID();
            }
        );
    };

    handleShowSubstituteID = async () => {
        const { AddEmployee, Substitute } = this.state;
        const res = await HttpService.Post('[URI_CENTER]/api/Att_GetData/GetProfileDetailForAttendance_App', {
            page: 1,
            pageSize: 100
        });

        if (AddEmployee.value) {
            this.setState({
                Substitute: {
                    ...Substitute,
                    data: res.Data,
                    visible: true,
                    refresh: !Substitute.refresh
                }
            });
        } else {
            this.setState({
                Substitute: {
                    ...Substitute,
                    visible: false,
                    value: null,
                    refresh: !Substitute.refresh
                }
            });
        }
    };

    //#endregion

    //#region: change hours
    handleGetLeaveHourMidleShift = () => {
        try {
            const { Profile, LeaveDays, LeaveHours, LeaveDayTypeID, DurationType, ShiftID, HoursFrom, HoursTo, DateRage } =
                this.state;

            const { DateStart, DateEnd } = this.getDate();

            let tempShift = [];

            if (this.ShiftIDByDate) {
                if (this.ShiftIDByDate[DateStart]) {
                    tempShift.push(this.ShiftIDByDate[DateStart]);
                }
            }

            if (HoursFrom.value && HoursTo.value) {
                if (Profile.ID && DateStart && DateEnd) {
                    let params = {
                        ListProfileID: [Profile.ID],
                        DateStart: DateStart ? moment(DateStart).format('YYYY/MM/DD') : null,
                        DateEnd: DateEnd ? moment(DateEnd).format('YYYY/MM/DD') : null,
                        DurationType: DurationType.value?.Value ? DurationType.value.Value : null,
                        HoursFrom: HoursFrom.value ? Vnr_Function.formatDateAPI(HoursFrom.value) : null,
                        HoursTo: HoursTo.value ? Vnr_Function.formatDateAPI(HoursTo.value) : null,
                        LeaveDayTypeID: LeaveDayTypeID.value?.ID ? LeaveDayTypeID.value.ID : null,
                        ShiftID: tempShift.length > 0 ? tempShift[0] : ShiftID.value.ShiftID ? ShiftID.value.ShiftID : null
                    };

                    this.showLoading(true);

                    HttpService.Post('[URI_CENTER]/api/Att_LeaveDay/GetLeaveHourMidleShift', params)
                        .then((res) => {
                            this.showLoading(false);

                            if (res?.Status === EnumName.E_SUCCESS) {
                                if (res?.Data?.MessageError && typeof res?.Data?.MessageError === 'string' && res?.Data?.MessageError.length > 0) {
                                    this.props
                                        .ToasterSevice()
                                        .showError(res?.Data?.MessageError);
                                }
                                let lstLeaveDaysHours = {};
                                if (Array.isArray(DateRage.value) && DateRage.value.length > 0) {
                                    DateRage.value.map((item) => {
                                        lstLeaveDaysHours = {
                                            ...lstLeaveDaysHours,
                                            [item]: {
                                                LeaveDays: !isNaN(res?.Data?.LeaveDays) ? res?.Data?.LeaveDays : LeaveDays?.value,
                                                LeaveHours: !isNaN(res?.Data?.LeaveHours)
                                                    ? res?.Data?.LeaveHours
                                                    : LeaveHours?.value
                                            }
                                        };
                                    });
                                }

                                this.setState({
                                    lstLeaveDaysHours: { ...lstLeaveDaysHours },
                                    LeaveDays: {
                                        ...LeaveDays,
                                        value: !isNaN(res?.Data?.LeaveDays) ? res?.Data?.LeaveDays : LeaveDays?.value,
                                        refresh: !LeaveDays?.refresh
                                    },

                                    LeaveHours: {
                                        ...LeaveHours,
                                        value: !isNaN(res?.Data?.LeaveHours)
                                            ? res?.Data?.LeaveHours
                                            : LeaveHours?.value,
                                        refresh: !LeaveHours?.refresh
                                    }
                                });
                            }
                        })
                        .catch((error) => {
                            this.showLoading(false);
                            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                        });
                }
            }
        } catch (error) {
            this.showLoading(false);
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };
    //#endregion

    render() {
        const {
            FileAttachment,
            Comment,
            DurationType,
            LeaveDayTypeID,
            LeaveDays,
            HoursFrom,
            HoursTo,
            Children,
            BirthType,
            acIsCheckEmpty,
            RequiredDocuments,
            ShiftID,
            AddEmployee,
            Substitute,
            FileAttach,
            RelativeTypeID,
            IsPermissionLeave
        } = this.state;

        const { fieldConfig, isShowDelete, onDeleteItemDay, indexDay, onScrollToInputIOS, showRemain } = this.props,
            { viewInputMultiline } = stylesVnrPickerV3;

        return (
            <View
                style={styles.wrapItem}
                onLayout={(event) => {
                    const layout = event.nativeEvent.layout;
                    this.layoutHeightItem = layout.height;
                }}
            >
                {/* Thời gian */}
                {/* Title group for time */}
                <View style={styles.flRowSpaceBetween}>
                    <VnrText style={[styleSheets.lable, styles.styLableGp]} i18nKey={'HRM_PortalApp_LableTime'} />

                    {isShowDelete && (
                        <TouchableOpacity onPress={() => onDeleteItemDay(indexDay)}>
                            <VnrText
                                style={[styleSheets.lable, styles.styLableDeleteGp]}
                                i18nKey={'HRM_PortalApp_Delete'}
                            />
                        </TouchableOpacity>
                    )}
                </View>

                {/* Ngày đăng ký */}
                {this.renderWorkDate()}

                {/* ca - ShiftID */}
                {ShiftID.visible && ShiftID.visibleConfig && (
                    <VnrPickerQuickly
                        dataLocal={ShiftID.data}
                        isCheckEmpty={true}
                        refresh={ShiftID.refresh}
                        textField="ShiftName"
                        valueField="ShiftID"
                        filter={false}
                        value={ShiftID.value}
                        disable={ShiftID.disable}
                        lable={ShiftID.lable}
                        onFinish={(item) => {
                            this.setState(
                                {
                                    ShiftID: {
                                        ...ShiftID,
                                        value: item,
                                        refresh: !ShiftID.refresh
                                    }
                                },
                                () => this.GetLeaveHoursByShift()
                            );
                        }}
                    />
                )}

                {/* Loại đăng ký */}
                {/* hard code */}
                {DurationType.visible && fieldConfig?.DurationType.visibleConfig && (
                    <VnrPickerQuickly
                        fieldValid={true}
                        isCheckEmpty={true}
                        refresh={DurationType.refresh}
                        value={DurationType.value}
                        dataLocal={DurationType.data}
                        textField="Text"
                        valueField="Value"
                        filter={false}
                        disable={DurationType.disable}
                        lable={DurationType.lable}
                        onFinish={(item) => this.onchangeDuration(item)}
                    />
                )}

                {/* Số giờ, giờ vào, giờ kết thúc */}
                {HoursFrom.visible &&
                    fieldConfig?.HoursFrom.visibleConfig &&
                    HoursTo.visible &&
                    HoursTo.visibleConfig && (
                        <View style={styles.styRowDateFromTo}>
                            {/* Giờ vào */}
                            <View style={styles.styRowDate}>
                                <VnrDate
                                    fieldValid={fieldConfig?.HoursFrom?.isValid}
                                    refresh={HoursFrom.refresh}
                                    response={'string'}
                                    format={'HH:mm'}
                                    type={'time'}
                                    value={HoursFrom.value}
                                    lable={HoursFrom.lable}
                                    placeHolder={'HRM_PortalApp_TSLRegister_Time'}
                                    disable={HoursFrom.disable}
                                    onFinish={(item) => {
                                        this.setState(
                                            {
                                                HoursFrom: {
                                                    ...HoursFrom,
                                                    value: item,
                                                    refresh: !HoursFrom.refresh
                                                }
                                            },
                                            () => {
                                                this.onChangeHourFromOrHourTo();
                                                this.handleGetLeaveHourMidleShift();
                                            }
                                        );
                                    }}
                                />
                            </View>

                            <View style={styles.styRowDateLine} />

                            {/* Giờ ra */}
                            <View style={styles.styRowDate}>
                                {
                                    this.IsHaveListRegisterHours ? (
                                        <VnrPickerLittle
                                            fieldValid={fieldConfig?.HoursTo?.isValid}
                                            refresh={HoursTo.refresh}
                                            dataLocal={HoursTo.data}
                                            value={HoursTo.valueConfigRegisterHours}
                                            textField="Text"
                                            valueField="Value"
                                            disable={HoursTo.disable}
                                            lable={'HRM_PortalApp_OnlyTime'}
                                            stylePicker={[styles.resetBorder, CustomStyleSheet.borderBottomWidth(1)]}
                                            placeholder={' '}
                                            onFinish={(value) => {
                                                if (value) {
                                                    this.setState(
                                                        {
                                                            HoursTo: {
                                                                ...HoursTo,
                                                                valueConfigRegisterHours: value,
                                                                value: moment(moment(this.state.HoursFrom.value).add(value?.Value, 'hours')),
                                                                refresh: !HoursTo.refresh
                                                            }
                                                        }, () => {
                                                            this.handleGetLeaveHourMidleShift();
                                                        });
                                                }
                                            }}
                                        />
                                    ) : (
                                        <VnrDate
                                            isCheckEmpty={acIsCheckEmpty}
                                            fieldValid={fieldConfig?.HoursTo?.isValid}
                                            refresh={HoursTo.refresh}
                                            response={'string'}
                                            format={'HH:mm'}
                                            type={'time'}
                                            value={HoursTo.value}
                                            lable={HoursTo.lable}
                                            placeHolder={'HRM_PortalApp_TSLRegister_Time'}
                                            disable={HoursTo.disable}
                                            onFinish={(item) => {
                                                this.setState(
                                                    {
                                                        HoursTo: {
                                                            ...HoursTo,
                                                            value: item,
                                                            refresh: !HoursTo.refresh
                                                        }
                                                    },
                                                    () => {
                                                        this.onChangeHourFromOrHourTo();
                                                        this.handleGetLeaveHourMidleShift();
                                                    }
                                                );
                                            }}
                                        />
                                    )
                                }
                            </View>
                        </View>
                    )}

                {/* Tổng ngày nghỉ - Tổng giờ */}
                {((LeaveDays.visible || fieldConfig?.LeaveHours?.visible) && !this.IsHaveListRegisterHours) && (
                    <View style={styles.styViewLeaveDayCount}>
                        <Text style={[styleSheets.lable, styles.styViewLeaveDayCountLable]}>
                            {this.getTxtTotalCount()}
                        </Text>
                    </View>
                )}

                {/* 0185682: Tách từ task 0159195: Lỗi không chặn đăng ký nghỉ phép năm theo số giờ cho phép - APP */}
                {
                    (HoursTo?.valueConfigRegisterHours && this.IsHaveListRegisterHours && HoursFrom.value && HoursTo?.valueConfigRegisterHours?.Value) && (
                        <View style={styles.styViewLeaveDayCount}>
                            <Text style={[styleSheets.lable, styles.styViewLeaveDayCountLable]}>
                                {translate('HRM_PortalApp_EndTime')}: {moment(moment(HoursFrom.value).add(HoursTo?.valueConfigRegisterHours?.Value, 'hours')).format('HH:mm')}
                            </Text>
                        </View>
                    )
                }

                {/* diễn giải */}
                <View style={styles.styRowControl}>
                    {/* Title group for Explanation */}
                    <View style={styles.flRowSpaceBetween}>
                        <VnrText style={[styleSheets.lable, styles.styLableGp]} i18nKey={'HRM_PortalApp_Explanation'} />
                    </View>
                </View>

                {/* Loại ngày nghỉ */}
                {LeaveDayTypeID.visible && fieldConfig?.LeaveDayTypeID.visibleConfig && (
                    <VnrPickerQuickly
                        isCheckEmpty={acIsCheckEmpty}
                        fieldValid={true}
                        refresh={LeaveDayTypeID.refresh}
                        dataLocal={LeaveDayTypeID.data}
                        value={LeaveDayTypeID.value}
                        textField="LeaveDayTypeName"
                        valueField="ID"
                        filter={true}
                        filterLocal={true}
                        autoFilter={true}
                        filterParams="LeaveDayTypeName"
                        disable={LeaveDayTypeID.disable}
                        lable={LeaveDayTypeID.lable}
                        onFinish={(item) => this.onChangeLeaveDayType(item)}
                    />
                )}

                {/* Loại ngày nghỉ */}
                {RelativeTypeID.visible && fieldConfig?.RelativeTypeID.visibleConfig && (
                    <VnrPickerQuickly
                        api={{
                            urlApi: '[URI_CENTER]/api/Cat_GetData/GetMultiRelativeType',
                            type: 'E_GET'
                        }}
                        isCheckEmpty={acIsCheckEmpty}
                        fieldValid={fieldConfig?.RelativeTypeID?.isValid}
                        refresh={RelativeTypeID.refresh}
                        value={RelativeTypeID.value}
                        textField="RelativeTypeName"
                        valueField="ID"
                        fieldName={'Relationship'}
                        filter={true}
                        filterLocal={true}
                        autoFilter={true}
                        filterParams="RelativeTypeName"
                        disable={RelativeTypeID.disable}
                        lable={RelativeTypeID.lable}
                        onFinish={(item) => {
                            this.setState({
                                RelativeTypeID: {
                                    ...RelativeTypeID,
                                    value: item,
                                    refresh: !RelativeTypeID.refresh
                                }
                            });
                        }}
                    />
                )}

                {
                    (showRemain?.isPrioritize && showRemain?.value) && (
                        <View style={[styles.styViewLeaveDayCount, style.wrapShowRemain]}>
                            {
                                showRemain?.value?.MaxPerMonth && (
                                    <Text style={[styleSheets.lable, styles.styViewLeaveDayCountLable]}>
                                        {`${translate('HRM_PortalApp_MaximumLeave')} (${showRemain?.value?.MaxPerMonth + ' ' + translate('HRM_PortalApp_DayOnMonth')})`}
                                        {showRemain?.value?.RemainPerMonth && ':'}
                                        {
                                            showRemain?.value?.RemainPerMonth && (
                                                <Text style={{ color: Colors.blue }}>
                                                    {` ${showRemain?.value?.RemainPerMonth} ${translate('HRM_PortalApp_Only_days')}`}
                                                </Text>
                                            )
                                        }
                                    </Text>
                                )
                            }
                            {
                                showRemain?.value?.MaxPerYear && (
                                    <Text style={[styleSheets.lable, styles.styViewLeaveDayCountLable]}>
                                        {`${translate('HRM_PortalApp_MaximumLeave')} (${showRemain?.value?.MaxPerYear + ' ' + translate('HRM_PortalApp_DayOnYear')})`}
                                        {showRemain?.value?.RemainPerYear && ':'}
                                        {
                                            showRemain?.value?.RemainPerYear && (
                                                <Text style={{ color: Colors.blue }}>
                                                    {` ${showRemain?.value?.RemainPerYear} ${translate('HRM_PortalApp_Only_days')}`}
                                                </Text>
                                            )
                                        }
                                    </Text>
                                )
                            }
                        </View>
                    )
                }

                {RequiredDocuments != '' && (
                    <View>
                        <View style={styles.styRowControl}>
                            {/* Title group for Explanation */}
                            <View style={styles.flRowSpaceBetween}>
                                <VnrText
                                    style={[styleSheets.text, styles.styLableGp, stylesVnrPickerV3.styLbNoValuePicker]}
                                    i18nKey={'CatLeaveDayType_RequiredDocuments'}
                                />
                            </View>
                        </View>
                        <View style={styles.flRowSpaceBetween}>
                            <Text style={[styleSheets.text, styles.styLableGp]}>{RequiredDocuments}</Text>
                        </View>
                    </View>
                )}

                {AddEmployee.visible && fieldConfig?.AddEmployee?.visibleConfig && (
                    <View style={stylesVnrPickerV3.styContentPicker}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={[
                                stylesVnrPickerV3.styBntPicker,
                                stylesVnrPickerV3.onlyFlRowSpaceBetween
                            ]}
                            onPress={() => this.handleNeedAReplacement()}
                        >
                            <View style={[stylesVnrPickerV3.styLbPicker, CustomStyleSheet.width('50%'), CustomStyleSheet.maxHeight('100%')]}>
                                <VnrText
                                    numberOfLines={2}
                                    style={[styleSheets.text, stylesVnrPickerV3.styLbNoValuePicker]}
                                    i18nKey={AddEmployee.lable}
                                />
                                {fieldConfig?.AddEmployee?.isValid && (
                                    <VnrText style={[styleSheets.text, styleValid]} i18nKey={'*'} />
                                )}
                            </View>
                            <CheckBox
                                checkBoxColor={Colors.black}
                                checkedCheckBoxColor={Colors.primary}
                                onClick={this.handleNeedAReplacement}
                                isChecked={AddEmployee.value}
                            />
                        </TouchableOpacity>
                    </View>
                )}

                {IsPermissionLeave.visible && fieldConfig?.IsPermissionLeave?.visibleConfig && (
                    <View style={stylesVnrPickerV3.styContentPicker}>
                        <TouchableOpacity
                            activeOpacity={0.7}
                            style={[
                                stylesVnrPickerV3.styBntPicker,
                                stylesVnrPickerV3.onlyFlRowSpaceBetween
                            ]}
                            onPress={() => {
                                this.setState(
                                    {
                                        IsPermissionLeave: {
                                            ...IsPermissionLeave,
                                            value: !IsPermissionLeave.value,
                                            refresh: !IsPermissionLeave.refresh
                                        }
                                    }
                                );
                            }}
                        >
                            <View style={[stylesVnrPickerV3.styLbPicker, CustomStyleSheet.width('50%'), CustomStyleSheet.maxHeight('100%')]}>
                                <VnrText
                                    numberOfLines={2}
                                    style={[styleSheets.text, stylesVnrPickerV3.styLbNoValuePicker]}
                                    i18nKey={IsPermissionLeave.lable}
                                />
                                {fieldConfig?.IsPermissionLeave?.isValid && (
                                    <VnrText style={[styleSheets.text, styleValid]} i18nKey={'*'} />
                                )}
                            </View>
                            <CheckBox
                                checkBoxColor={Colors.black}
                                checkedCheckBoxColor={Colors.primary}
                                onClick={() => {
                                    this.setState(
                                        {
                                            IsPermissionLeave: {
                                                ...IsPermissionLeave,
                                                value: !IsPermissionLeave.value,
                                                refresh: !IsPermissionLeave.refresh
                                            }
                                        }
                                    );
                                }}
                                isChecked={IsPermissionLeave.value}
                            />
                        </TouchableOpacity>
                    </View>
                )}

                {/* Loại ngày nghỉ Chông chăm vợ sinh - Loại sinh */}
                {Substitute.visible && fieldConfig?.Substitute?.visibleConfig && (
                    <VnrPickerQuickly
                        isCheckEmpty={acIsCheckEmpty}
                        fieldValid={Substitute.isValid}
                        refresh={Substitute.refresh}
                        dataLocal={Substitute.data}
                        value={Substitute.value}
                        textField="JoinProfileNameCode"
                        valueField="ID"
                        filter={true}
                        filterLocal={true}
                        autoFilter={true}
                        filterParams="ProfileName"
                        disable={Substitute.disable}
                        lable={Substitute.lable}
                        onFinish={(item) => {
                            this.setState({
                                Substitute: {
                                    ...Substitute,
                                    value: item,
                                    refresh: !Substitute.refresh
                                }
                            });
                        }}
                    />
                )}

                {/* Loại ngày nghỉ Chông chăm vợ sinh - Loại sinh */}
                {BirthType.visible && (
                    <VnrPickerQuickly
                        isCheckEmpty={acIsCheckEmpty}
                        fieldValid={BirthType.isValid}
                        refresh={BirthType.refresh}
                        dataLocal={BirthType.data}
                        value={BirthType.value}
                        textField="Text"
                        valueField="Value"
                        filter={false}
                        disable={BirthType.disable}
                        lable={BirthType.lable}
                        onFinish={(item) => {
                            this.setState(
                                {
                                    BirthType: {
                                        ...BirthType,
                                        value: item,
                                        refresh: !BirthType.refresh
                                    }
                                },
                                this.changeBirthTypeOrChildren()
                            );
                        }}
                    />
                )}

                {/* Loại ngày nghỉ Chông chăm vợ sinh - Số con */}
                {Children.visible && (
                    <VnrTextInput
                        isCheckEmpty={acIsCheckEmpty}
                        fieldValid={Children.isValid}
                        placeHolder={'HRM_PortalApp_PleaseInput'}
                        disable={Children.disable}
                        lable={Children.lable}
                        style={styleSheets.text}
                        multiline={true}
                        value={Children.value}
                        charType={'int'}
                        keyboardType={'numeric'}
                        onBlur={this.changeBirthTypeOrChildren}
                        onSubmitEditing={this.changeBirthTypeOrChildren}
                        onFocus={() => {
                            Platform.OS == 'ios' && onScrollToInputIOS(indexDay + 1, this.layoutHeightItem);
                        }}
                        onChangeText={(text) => {
                            this.setState({
                                Children: {
                                    ...Children,
                                    value: text,
                                    refresh: !Children.refresh
                                }
                            });
                        }}
                        refresh={Children.refresh}
                    />
                )}

                {Comment.visible && fieldConfig?.Comment.visibleConfig && (
                    <VnrTextInput
                        isCheckEmpty={acIsCheckEmpty}
                        fieldValid={fieldConfig?.Comment?.isValid}
                        placeHolder={'HRM_PortalApp_PleaseInput'}
                        disable={Comment.disable}
                        lable={Comment.lable}
                        style={[styleSheets.text, viewInputMultiline]}
                        multiline={true}
                        value={Comment.value}
                        onFocus={() => {
                            Platform.OS == 'ios' && onScrollToInputIOS(indexDay + 1, this.layoutHeightItem);
                        }}
                        onChangeText={(text) => {
                            this.setState({
                                Comment: {
                                    ...Comment,
                                    value: text,
                                    refresh: !Comment.refresh
                                }
                            });
                        }}
                        refresh={Comment.refresh}
                    />
                )}

                {/* Tập tin đính kèm */}
                {FileAttachment.visible && fieldConfig?.FileAttachment.visibleConfig && (
                    <View style={{}}>
                        <VnrAttachFile
                            fieldValid={fieldConfig?.FileAttachment?.isValid}
                            isCheckEmpty={acIsCheckEmpty}
                            lable={FileAttachment.lable}
                            disable={FileAttachment.disable}
                            refresh={FileAttachment.refresh}
                            value={FileAttachment.value}
                            multiFile={true}
                            uri={'[URI_CENTER]/api/Sys_Common/saveFileFromApp'}
                            onFinish={(file) => {
                                this.setState({
                                    FileAttachment: {
                                        ...FileAttachment,
                                        value: file,
                                        refresh: !FileAttachment.refresh
                                    }
                                });
                            }}
                        />
                    </View>
                )}

                {/* Tập tin đính kèm */}
                {(FileAttach.visible && fieldConfig?.FileAttach.visibleConfig) && (
                    <View style={{}}>
                        <VnrAttachFile
                            fieldValid={fieldConfig?.FileAttach?.isValid}
                            isCheckEmpty={acIsCheckEmpty}
                            lable={FileAttach.lable}
                            disable={FileAttach.disable}
                            refresh={FileAttach.refresh}
                            value={FileAttach.value}
                            multiFile={true}
                            uri={'[URI_CENTER]/api/Sys_Common/saveFileFromApp'}
                            onFinish={(file) => {
                                this.setState({
                                    FileAttach: {
                                        ...FileAttach,
                                        value: file,
                                        refresh: !FileAttach.refresh
                                    }
                                });
                            }}
                        />
                    </View>
                )}
            </View>
        );
    }
}

const styles = styleComonAddOrEdit;

const style = StyleSheet.create({
    wrapShowRemain: {
        flexDirection: 'column', alignItems: 'flex-start'
    }
});

export default AttTakeLeaveDayComponent;