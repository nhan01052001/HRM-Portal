import React from 'react';
import { View, TouchableOpacity, Platform } from 'react-native';
import { Colors, CustomStyleSheet, styleSheets, stylesVnrPickerV3 } from '../../../../../constants/styleConfig';
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
// import VnrPickerLittle from '../../../../../componentsV3/VnrPickerLittle/VnrPickerLittle';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';
import DrawerServices from '../../../../../utils/DrawerServices';
import VnrPickerLittle from '../../../../../componentsV3/VnrPickerLittle/VnrPickerLittle';

const initSateDefault = {
    DateRage: {
        value: null,
        lable: 'HRM_PortalApp_TakeBusinessTrip_TotalBizTripDays',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    HoursFrom: {
        value: null,
        lable: 'Thời gian từ',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    HoursTo: {
        value: null,
        lable: 'Thời gian đến',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    DurationType: {
        value: null,
        data: [],
        lable: 'HRM_PortalApp_TakeBusinessTrip_DurationType',
        disable: false,
        refresh: false,
        visible: false,
        visibleConfig: true
    },
    BusinessTripTypeID: {
        value: null,
        lable: 'HRM_PortalApp_TakeBusinessTrip_LeaveDayTypeID',
        disable: true,
        refresh: false,
        visible: false,
        visibleConfig: false
    },
    PlaceFrom: {
        value: null,
        lable: 'PlaceFrom',
        disable: true,
        refresh: false,
        visible: false,
        visibleConfig: true
    },
    ContactInfo: {
        value: null,
        lable: 'HRM_PortalApp_TakeBusinessTrip_ContactInfo',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    PlaceInFromID: {
        value: null,
        lable: 'PlaceFrom',
        disable: true,
        refresh: false,
        visible: false,
        visibleConfig: true
    },
    PlaceInToID: {
        value: null,
        lable: 'ContactInfo',
        disable: true,
        refresh: false,
        visible: false,
        visibleConfig: true
    },
    PlaceOutToID: {
        value: null,
        lable: 'ContactInfo',
        disable: true,
        refresh: false,
        visible: false,
        visibleConfig: true
    },
    PlaceSendToID: {
        value: null,
        lable: 'PlaceSendToID',
        disable: true,
        refresh: false,
        visible: false,
        visibleConfig: true
    },
    BusinessTripReasonID: {
        value: null,
        lable: 'HRM_Attendance_BusinessTravel_BusinessTripReasonID',
        disable: true,
        refresh: false,
        visible: false,
        visibleConfig: true
    },
    LeaveDays: {
        value: null,
        lable: 'HRM_PortalApp_TakeBusinessTrip_LeaveDays',
        visible: false,
        visibleConfig: true
    },
    LeaveHours: {
        value: null,
        lable: 'HRM_PortalApp_TakeBusinessTrip_LeaveHours',
        visible: false,
        visibleConfig: true
    },
    ShiftID: {
        value: null
    },
    BusinessReason: {
        value: '',
        lable: 'HRM_PortalApp_TSLRegister_Comment',
        disable: true,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    FileAttachment: {
        lable: 'HRM_PortalApp_TakeBusinessTrip_Attachments',
        visible: true,
        visibleConfig: true,
        disable: true,
        refresh: false,
        value: null
    },

    VehicleID: {
        value: null,
        api: {
            urlApi: '[URI_CENTER]/api/Cat_GetData/GetMultiVehicle',
            type: 'E_GET'
        },
        lable: 'HRM_PortalApp_TakeBusinessTrip_Vehicles',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    MissionDistanceID: {
        value: null,
        api: {
            urlApi: '[URI_CENTER]/api/Cat_GetData/GetMissionDistanceMulti',
            type: 'E_GET'
        },
        lable: 'HRM_PortalApp_TakeBusinessTrip_Distance',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    TravelWarrantID: {
        value: null,
        api: {
            urlApi: '[URI_CENTER]/api/Cat_GetData/GetTravelWarrantMulti',
            type: 'E_GET'
        },
        lable: 'HRM_PortalApp_TakeBusinessTrip_TravelPaper',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    NoNightStay: {
        value: '',
        lable: 'HRM_PortalApp_TakeBusinessTrip_HotelDays',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    TypeOfServiceID: {
        value: null,
        api: {
            urlApi: '[URI_CENTER]/api/Cat_GetData/GetTypeOfServiceMulti',
            type: 'E_GET'
        },
        lable: 'HRM_PortalApp_TakeBusinessTrip_Service',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    OrtherInfo: {
        value: '',
        lable: 'HRM_PortalApp_TakeBusinessTrip_OrtherDetail',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    timeRangeFromRoster: null,
    lstLeaveDaysHours: {},
    SumDays: 1,

    Location: {
        value: null,
        lable: 'HRM_PortalApp_TakeBusinessTrip_Location',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true,
        data: []
    },
    Content: {
        value: '',
        lable: 'HRM_PortalApp_TakeBusinessTrip_Content',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },

    PreparationWork: {
        value: '',
        lable: 'HRM_PortalApp_TakeBusinessTrip_PreparationWork',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    }
};

const DATA_DURATION_FULL = ['E_FULLSHIFT', 'E_FIRSTHALFSHIFT', 'E_LASTHALFSHIFT', 'E_BYHOURS'],
    DATA_DURATION_HAlF = ['E_FULLSHIFT', 'E_FIRST', 'E_LAST', 'E_FIRST_AND_LAST'];

class AttSubmitTakeBusinessTripComponent extends React.Component {
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
            isRefreshState: false,
            isShowOrther: false
        };
        this.layoutHeightItem = null;
    }

    // Những trường hợp được phép render lại
    shouldComponentUpdate(nextProps, nextState) {
        if (
            nextProps.isRefresh !== this.props.isRefresh ||
            nextProps.isShowDelete !== this.props.isShowDelete ||
            nextProps.acIsCheckEmpty !== this.props.acIsCheckEmpty ||
            // thay đổi state value thì mới render lại
            nextState.isRefreshState !== this.state.isRefreshState ||
            nextState.isShowOrther !== this.state.isShowOrther ||
            // thay đổi state value thì mới render lại
            // nextState.DateStart.value !== this.state.DateStart.value ||
            // nextState.DateEnd.value !== this.state.DateEnd.value ||
            nextState.HoursFrom.value !== this.state.HoursFrom.value ||
            nextState.HoursTo.value !== this.state.HoursTo.value ||
            nextState.DurationType.value !== this.state.DurationType.value ||
            nextState.BusinessReason.value !== this.state.BusinessReason.value ||
            nextState.BusinessTripTypeID.value !== this.state.BusinessTripTypeID.value ||
            nextState.Location.value !== this.state.Location.value ||
            nextState.FileAttachment.value !== this.state.FileAttachment.value ||
            nextState.LeaveDays.value !== this.state.LeaveDays.value ||
            nextState.LeaveHours.value !== this.state.LeaveHours.value ||
            nextState.PlaceFrom !== this.state.PlaceFrom ||
            nextState.ContactInfo !== this.state.ContactInfo ||
            nextState.PlaceInFromID !== this.state.PlaceInFromID ||
            nextState.PlaceInToID !== this.state.PlaceInToID ||
            nextState.PlaceOutToID !== this.state.PlaceOutToID ||
            nextState.PlaceSendToID !== this.state.PlaceSendToID ||
            nextState.BusinessTripReasonID !== this.state.BusinessTripReasonID ||
            nextState.Content.value !== this.state.Content.value ||
            nextState.PreparationWork.value !== this.state.PreparationWork.value
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
                DateEnd: DateRage.value[DateRage.value.length - 1]
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
        if (LeaveDays.value != null && LeaveDays.value != null) {
            if (LeaveDays.visible && LeaveHours.visible) {
                return `${translate(LeaveDays.lable)}: (${Vnr_Function.mathRoundNumber(LeaveDays.value)} ${translate(
                    'HRM_PortalApp_Day_Lowercase'
                )}) - ${translate(LeaveHours.lable)}: (${Vnr_Function.mathRoundNumber(LeaveHours.value)} ${translate(
                    'HRM_PortalApp_Hour_Lowercase'
                )})`;
            } else if (LeaveDays.visible) {
                return `${translate(LeaveDays.lable)}: (${Vnr_Function.mathRoundNumber(LeaveDays.value)} ${translate(
                    'HRM_PortalApp_Day_Lowercase'
                )})`;
            } else if (LeaveHours.visible) {
                return `${translate(LeaveHours.lable)}: (${Vnr_Function.mathRoundNumber(LeaveHours.value)} ${translate(
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
                DurationType,
                BusinessTripTypeID,
                PlaceFrom,
                ContactInfo,
                PlaceInFromID,
                PlaceInToID,
                // eslint-disable-next-line no-unused-vars
                PlaceOutToID,
                PlaceSendToID,
                BusinessTripReasonID,
                Content,
                PreparationWork,
                Location,
                HoursFrom,
                HoursTo
            } = this.state;

        const profileInfo = dataVnrStorage
            ? dataVnrStorage.currentUser
                ? dataVnrStorage.currentUser.info
                : null
            : null;

        const { E_ProfileID, E_FullName } = EnumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] };

        const { DateRage, FileAttachment, BusinessReason } = this.state;

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
                BusinessTripTypeID: {
                    ...BusinessTripTypeID,
                    disable: false,
                    visible: false,
                    value: record.BusinessTripTypeID
                        ? { BusinessTravelName: record.BusinessTravelName, ID: record.BusinessTripTypeID }
                        : null,
                    refresh: !BusinessTripTypeID.refresh
                },
                DurationType: {
                    ...DurationType,
                    visible: true,
                    disable: false,
                    value: record.DurationType ? { Text: record.DurationTypeView, Value: record.DurationType } : null,
                    refresh: !DurationType.refresh
                },
                BusinessReason: {
                    ...BusinessReason,
                    disable: false,
                    visible: true,
                    value: record.Note ? record.Note : null,
                    refresh: !BusinessReason.refresh
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
                    ...HoursFrom,
                    visible: true,
                    value: record.HourFrom ? moment(record.HourFrom) : null,
                    refresh: !HoursFrom.refresh
                },
                HoursTo: {
                    ...HoursTo,
                    visible: true,
                    value: record.HourTo ? moment(record.HourTo) : null,
                    refresh: !HoursTo.refresh
                },
                PlaceSendToID: {
                    ...PlaceSendToID,
                    disable: false,
                    visible: true,
                    value: record.PlaceSendToID
                        ? { WorkPlaceName: record.PlaceSendToName, ID: record.PlaceSendToID }
                        : null,
                    refresh: !PlaceSendToID.refresh
                },
                BusinessTripReasonID: {
                    ...BusinessTripReasonID,
                    disable: false,
                    value: record.BusinessTripReasonID
                        ? { BusinessTripReasonName: record.BusinessTripReasonName, ID: record.BusinessTripReasonID }
                        : null,
                    visible: true,
                    refresh: !BusinessTripReasonID.refresh
                },
                Content: {
                    ...Content,
                    disable: false,
                    visible: true,
                    value: record.Content ? record.Content : null,
                    refresh: !Content.refresh
                },
                PreparationWork: {
                    ...PreparationWork,
                    disable: false,
                    visible: true,
                    value: record.PreparationWork ? record.PreparationWork : null,
                    refresh: !PreparationWork.refresh
                },
                ContactInfo: {
                    ...ContactInfo,
                    disable: false,
                    visible: true,
                    value: record.ContactInfo ?? null,
                    refresh: !ContactInfo.refresh
                },
                Location: {
                    ...Location,
                    disable: false,
                    visible: true,
                    value: record.WorkPlaceBussinessID
                        ? { WorkPlaceCodeName: record.WorkPlaceBussinessName, ID: record.WorkPlaceBussinessID }
                        : null,
                    refresh: !Location.refresh
                }
            };

            if (record.IsInTravel) {
                nextState = {
                    ...nextState,
                    PlaceFrom: {
                        ...PlaceFrom,
                        disable: false,
                        visible: true,
                        value: record.PlaceFrom ? record.PlaceFrom : null,
                        refresh: !PlaceFrom.refresh
                    },
                    ContactInfo: {
                        ...ContactInfo,
                        disable: false,
                        visible: true,
                        value: record.ContactInfo ? record.ContactInfo : null,
                        refresh: !ContactInfo.refresh
                    }
                };
            } else if (record.IsDomesticTravel) {
                nextState = {
                    ...nextState,
                    PlaceInFromID: {
                        ...PlaceInFromID,
                        disable: false,
                        visible: true,
                        value: record.PlaceInFromID
                            ? { ProvinceCodeName: record.PlaceInFromName, ID: record.PlaceInFromID }
                            : null,
                        refresh: !PlaceInFromID.refresh
                    },
                    PlaceInToID: {
                        ...PlaceInToID,
                        disable: false,
                        visible: true,
                        value: record.PlaceInToID
                            ? { ProvinceCodeName: record.PlaceInToName, ID: record.PlaceInToID }
                            : null,
                        refresh: !PlaceInToID.refresh
                    }
                };
            } else if (record.IsOutTravel) {
                this.getDataPlaceOutTo(record);
            }

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
                this.getDataLeavedayType(true);
                this.getDataBusinessTripReason();
                this.getDataPlaceSend();
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

    getDataPlaceSend = async () => {
        const { PlaceSendToID } = this.state;
        const resPlaceSend = await HttpService.Get(
            '[URI_CENTER]/api/Att_GetData/GetMultiWorkPlaceCodeNameWhichEmailNotNull?text=&TextField=SendToID'
        );
        this.setState({
            PlaceSendToID: {
                ...PlaceSendToID,
                data: resPlaceSend.Data,
                disable: false,
                visible: true
            }
        });
    };

    getDataBusinessTripReason = async () => {
        const { BusinessTripReasonID } = this.state;
        const resBusinessTripReasonID = await HttpService.Get(
            '[URI_CENTER]/api/Att_GetData/GetMultiBussinessTripReason?text=&TextField=BusinessTripReasonName'
        );
        this.setState({
            BusinessTripReasonID: {
                ...BusinessTripReasonID,
                data: resBusinessTripReasonID.Data,
                disable: false,
                visible: true
            }
        });
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
        const { DateRage, FileAttachment, BusinessReason, isRefreshState } = this.state;
        this.setState(
            {
                DateRage: {
                    ...DateRage,
                    value: item,
                    refresh: !DateRage.refresh
                },
                BusinessReason: {
                    ...BusinessReason,
                    disable: false,
                    refresh: !BusinessReason.refresh
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
                this.getDataBusinessTripReason();
                this.getDataPlaceSend();
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

    getDataPlaceOutTo = async (record) => {
        const { PlaceOutToID } = this.state;
        const resCountry = await HttpService.Get('[URI_CENTER]/api/Cat_GetData/GetMultiCountry');
        this.setState({
            PlaceOutToID: {
                ...PlaceOutToID,
                disable: false,
                data: resCountry.Data,
                visible: true,
                value: record.PlaceOutToID ? { CountryCodeName: record.PlaceOutToName, ID: record.PlaceOutToID } : null,
                refresh: !PlaceOutToID.refresh
            }
        });
    };

    getDataLeavedayType = async (isFromModify) => {
        const {
            DateRage,
            Profile,
            LeaveDays,
            LeaveHours,
            BusinessTripTypeID,
            DurationType,
            ShiftID,
            HoursFrom,
            HoursTo,
            isRefreshState
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
                        lstLeaveDaysHours: {}
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

                    const resLeaveType = await HttpService.Post(
                        '[URI_CENTER]/api/Att_GetData/GetBussinessTravelTypeByDate',
                        {
                            // lấy cùng 1 ngày
                            DateFrom: dataBody.DateStart,
                            DateTo: dataBody.DateStart,
                            // ...dataBody,
                            // ProfileID: Profile.ID,
                            MultiProfile: 1
                        }
                    );

                    for (let index = 0; index < DateRage.value.length; index++) {
                        const item = DateRage.value[index];

                        const resRoster = await HttpService.Post(
                            '[URI_CENTER]/api/Att_BussinessTravel/GetRosterForCheckBusinessTrip',
                            {
                                ...dataBody,
                                DateStart: moment(item).format('YYYY/MM/DD'),
                                DateEnd: moment(item).format('YYYY/MM/DD')
                            }
                        );

                        const resData = resRoster.Data;
                        if (resData) {
                            if (resData.IsNonShift && resData.MessageError) {
                                this.ToasterSevice().showWarning(
                                    `${moment(item).format('DD/MM/YYYY')} ${resData.MessageError}`,
                                    5000
                                );
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
                                });
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
                        DurationType: {
                            ...DurationType,
                            value: findValue ? findValue : null,
                            data: dataDurationType,
                            refresh: !DurationType.refresh,
                            visible: true,
                            disable: false
                        },
                        lstLeaveDaysHours: dataRoster.lstLeaveDaysHours,
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
                            BusinessTripTypeID: {
                                ...BusinessTripTypeID,
                                value: null,
                                data: dataLeaveType,
                                refresh: !BusinessTripTypeID.refresh,
                                visible: true,
                                disable: false
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
                        DurationType: EnumName.E_FULLSHIFT,
                        ListProfileID: [Profile.ID]
                    };

                    HttpService.MultiRequest([
                        HttpService.Post(
                            '[URI_CENTER]/api/Att_BussinessTravel/GetRosterForCheckBusinessTrip',
                            dataBody
                        ),
                        HttpService.Post('[URI_CENTER]/api/Att_GetData/GetBussinessTravelTypeByDate', {
                            DateFrom: dataBody.DateStart,
                            DateTo: dataBody.DateEnd,
                            // ...dataBody,
                            // ProfileID: Profile.ID,
                            MultiProfile: 1
                        })
                    ]).then((resAll) => {
                        this.showLoading(false);

                        const [resRoster, resLeaveType] = resAll;
                        let nextState = { isRefreshState: !isRefreshState };
                        if (isFromModify) {
                            let valueDuration = DurationType.value?.Value;
                            if (valueDuration) {
                                valueDuration = dataDurationType.find((item) => item?.Value === valueDuration);
                            }
                            nextState = {
                                ...nextState,
                                DurationType: {
                                    ...DurationType,
                                    value: valueDuration,
                                    data: dataDurationType,
                                    refresh: !DurationType.refresh
                                }
                            };

                            if (resLeaveType) {
                                const dataLeaveType = resLeaveType.Data;

                                nextState = {
                                    ...nextState,
                                    BusinessTripTypeID: {
                                        ...BusinessTripTypeID,
                                        data: dataLeaveType,
                                        refresh: !BusinessTripTypeID.refresh
                                    }
                                };
                            }
                        } else {
                            if (resRoster) {
                                const dataRoster = resRoster.Data;
                                if (dataRoster && dataRoster.IsNonShift && dataRoster.MessageError) {
                                    this.ToasterSevice().showWarning(dataRoster.MessageError, 5000);
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
                                    ShiftID: {
                                        ...ShiftID,
                                        value:
                                            dataRoster && dataRoster.ListShift && dataRoster.ListShift.length > 0
                                                ? dataRoster.ListShift.map((e) => e.ShiftID).join(',')
                                                : null
                                    },
                                    HoursFrom: {
                                        ...HoursFrom,
                                        value: dataRoster && dataRoster.HoursFrom ? dataRoster.HoursFrom : null,
                                        refresh: !HoursFrom.refresh
                                    },
                                    HoursTo: {
                                        ...HoursTo,
                                        value: dataRoster && dataRoster.HoursTo ? dataRoster.HoursTo : null,
                                        refresh: !HoursTo.refresh
                                    }
                                };
                            }

                            if (resLeaveType) {
                                const dataLeaveType = resLeaveType.Data;

                                nextState = {
                                    ...nextState,
                                    BusinessTripTypeID: {
                                        ...BusinessTripTypeID,
                                        value: null,
                                        data: dataLeaveType,
                                        refresh: !BusinessTripTypeID.refresh,
                                        visible: true,
                                        disable: false
                                    }
                                };
                            }
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
        const { DurationType, DateRage, LeaveDays, LeaveHours } = this.state;
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
        }

        this.setState(nextState, () => {
            this.getRosterAfterChangeDuration();
        });
    };

    getRosterAfterChangeDuration = async () => {
        const { Profile, LeaveDays, LeaveHours, DurationType, ShiftID, DateRage, HoursFrom, HoursTo } = this.state;
        if (DurationType.value) {
            if (DateRage.value && Array.isArray(DateRage.value) && DateRage.value.length > 0) {
                // Đăng ký nhiều ngày cùng lúc
                let nextState = {};
                this.showLoading(true);

                const dataRoster = {
                    LeaveDays: 0,
                    LeaveHours: 0,
                    ListShift: {},
                    HoursFrom: {},
                    HoursTo: {},
                    listHoursFrom: [],
                    listHoursTo: [],
                    lstLeaveDaysHours: {}
                };

                const dataBody = {
                    DurationType: DurationType.value ? DurationType.value.Value : null,
                    ListProfileID: [Profile.ID],
                    ShiftID: ShiftID.value ? ShiftID.value : null
                };

                for (let index = 0; index < DateRage.value.length; index++) {
                    const item = DateRage.value[index];

                    const resRoster = await HttpService.Post(
                        '[URI_CENTER]/api/Att_BussinessTravel/GetRosterForCheckBusinessTrip',
                        {
                            ...dataBody,
                            DateStart: Vnr_Function.formatDateAPI(item),
                            DateEnd: Vnr_Function.formatDateAPI(item)
                        }
                    );

                    const resData = resRoster.Data;
                    if (resData.IsNonShift && resData.MessageError) {
                        this.ToasterSevice().showWarning(
                            `${moment(item).format('DD/MM/YYYY')} ${resData.MessageError}`,
                            5000
                        );
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

                    if (resData.ListShift && resData.ListShift.length > 0)
                        resData.ListShift.forEach((e) => {
                            dataRoster.ListShift[e.ShiftID] = e;
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
                        value: Object.keys(dataRoster.HoursTo).length == 1 ? Object.keys(dataRoster.HoursTo)[0] : null,
                        refresh: !HoursTo.refresh
                    },
                    ShiftID: {
                        ...ShiftID,
                        value:
                            dataRoster.ListShift && Object.keys(dataRoster.ListShift).length > 0
                                ? Object.keys(dataRoster.ListShift).join(',')
                                : null
                    },
                    timeRangeFromRoster: getTimeRages
                };

                this.setState(nextState, () => {
                    if (DurationType.value?.Value == EnumName.E_BYHOURS) {
                        this.onChangeHourFromOrHourTo();
                    }
                });
            } else {
                const { DateStart, DateEnd } = this.getDate();
                this.showLoading(true);

                const dataBody = {
                    DateStart: Vnr_Function.formatDateAPI(DateStart),
                    DateEnd: Vnr_Function.formatDateAPI(DateEnd),
                    DurationType: DurationType.value ? DurationType.value.Value : null,
                    ListProfileID: [Profile.ID],
                    ShiftID: ShiftID.value ? ShiftID.value : null
                };

                HttpService.Post('[URI_CENTER]/api/Att_BussinessTravel/GetRosterForCheckBusinessTrip', dataBody).then(
                    (resRoster) => {
                        this.showLoading(false);
                        let nextState = {};

                        if (resRoster) {
                            const dataRoster = resRoster.Data;
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
                                ShiftID: {
                                    ...ShiftID,
                                    value: dataRoster.ListShift
                                        ? dataRoster.ListShift.map((e) => e.ShiftID).join(',')
                                        : null
                                }
                            };
                        }

                        this.setState(nextState);
                    }
                );
            }
        }
    };

    onChangeHourFromOrHourTo = () => {
        try {
            const { HoursFrom, HoursTo, Profile } = this.state;
            const { DateStart, DateEnd } = this.getDate();
            if (HoursFrom.value && HoursTo.value && DateStart && DateEnd) {
                const payload = {
                    DateFrom: moment(DateStart).format('YYYY/MM/DD'),
                    DateTo: moment(DateEnd).format('YYYY/MM/DD'),
                    DurationType: 'E_BYHOURS',
                    HourFrom: Vnr_Function.formatDateAPI(HoursFrom.value),
                    HourTo: Vnr_Function.formatDateAPI(HoursTo.value),
                    ProfileID: Profile.ID
                };
                HttpService.Post('[URI_CENTER]/api/Att_BussinessTravel/TotalBusinesDayByBusinessTripType', {
                    ...payload
                })
                    .then((res) => {
                        if (res?.Status !== EnumName.E_SUCCESS) {
                            this.ToasterSevice().showWarning(res?.Message);
                            return;
                        }
                        this.setState({
                            SumDays: res?.Data ? res.Data : 0
                        });
                    })
                    .catch((err) => {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: err });
                    });
            }
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };
    //#endregion

    //#region Step 4: Các xử lý còn lại
    onChangeBusinessType = async () => {
        const { BusinessTripTypeID, PlaceFrom, PlaceInFromID, PlaceInToID, PlaceOutToID } = this.state;
        if (BusinessTripTypeID.value) {
            let businessTripType = BusinessTripTypeID.value;
            if (businessTripType.Location) {
                if (businessTripType.Location === 'E_DOMESTIC') {
                    const resProvince = await HttpService.Get('[URI_CENTER]/api/Cat_GetData/GetMultiProvince');
                    this.setState({
                        PlaceInFromID: {
                            ...PlaceInFromID,
                            disable: false,
                            data: resProvince.Data,
                            visible: true
                        },
                        PlaceInToID: {
                            ...PlaceInToID,
                            disable: false,
                            data: resProvince.Data,
                            visible: true
                        },
                        PlaceFrom: {
                            ...PlaceFrom,
                            value: null,
                            disable: false,
                            visible: false
                        },
                        PlaceOutToID: {
                            ...PlaceOutToID,
                            value: null,
                            disable: false,
                            visible: false
                        }
                    });
                } else if (businessTripType.Location === 'E_IN') {
                    this.setState({
                        PlaceFrom: {
                            ...PlaceFrom,
                            disable: false,
                            visible: true
                        },
                        PlaceInFromID: {
                            ...PlaceInFromID,
                            value: null,
                            disable: false,
                            visible: false
                        },
                        PlaceInToID: {
                            ...PlaceInToID,
                            value: null,
                            disable: false,
                            visible: false
                        },
                        PlaceOutToID: {
                            ...PlaceOutToID,
                            value: null,
                            disable: false,
                            visible: false
                        }
                    });
                } else if (businessTripType.Location === 'E_OUT') {
                    const resCountry = await HttpService.Get('[URI_CENTER]/api/Cat_GetData/GetMultiCountry');
                    this.setState({
                        PlaceFrom: {
                            ...PlaceFrom,
                            value: null,
                            disable: false,
                            visible: false
                        },
                        PlaceInFromID: {
                            ...PlaceInFromID,
                            value: null,
                            disable: false,
                            visible: false
                        },
                        PlaceInToID: {
                            ...PlaceInToID,
                            value: null,
                            disable: false,
                            visible: false
                        },
                        PlaceOutToID: {
                            ...PlaceOutToID,
                            data: resCountry.Data,
                            disable: false,
                            visible: true
                        }
                    });
                }
            } else {
                this.setState({
                    PlaceFrom: {
                        ...PlaceFrom,
                        disable: false,
                        visible: true
                    },
                    PlaceInFromID: {
                        ...PlaceInFromID,
                        disable: false,
                        visible: false
                    },
                    PlaceInToID: {
                        ...PlaceInToID,
                        disable: false,
                        visible: false
                    },
                    PlaceOutToID: {
                        ...PlaceOutToID,
                        disable: false,
                        visible: false
                    }
                });
            }
        } else {
            this.setState({
                PlaceFrom: {
                    ...PlaceFrom,
                    disable: false,
                    visible: false
                },
                PlaceInFromID: {
                    ...PlaceInFromID,
                    disable: false,
                    visible: false
                },
                PlaceInToID: {
                    ...PlaceInToID,
                    disable: false,
                    visible: false
                },
                PlaceOutToID: {
                    ...PlaceOutToID,
                    disable: false,
                    visible: false
                }
            });
        }
    };
    renderWorkDate = () => {
        const { DateRage } = this.state,
            { record, fieldConfig } = this.props;

        let isModify = record ? true : false;
        if (DateRage.value && Array.isArray(DateRage.value) && DateRage.value.length > 1) {
            // Đăng ký nhiều ngày cùng lúc
            return (
                <VnrDateFromTo
                    fieldValid={fieldConfig?.RegisterDate?.isValid}
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
                    fieldValid={fieldConfig?.RegisterDate?.isValid}
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
                    fieldValid={fieldConfig?.RegisterDate?.isValid}
                    lable={DateRage.lable}
                    isControll={true}
                    refresh={DateRage.refresh}
                    // value={
                    //     isSimilarRegistration === false
                    // }
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

    getDataVisible = () => {
        const { PlaceFrom, ContactInfo, PlaceInFromID, PlaceInToID, PlaceOutToID } = this.state;

        return {
            PlaceFrom,
            ContactInfo,
            PlaceInFromID,
            PlaceInToID,
            PlaceOutToID
        };
    };

    getAllData = () => {
        const {
                Profile,
                FileAttachment,
                BusinessReason,
                BusinessTripTypeID,
                DurationType,
                HoursFrom,
                HoursTo,
                PlaceFrom,
                ContactInfo,
                PlaceInFromID,
                PlaceInToID,
                PlaceOutToID,
                PlaceSendToID,
                BusinessTripReasonID,
                Location,
                Content,
                PreparationWork
            } = this.state,
            { levelApprove, record } = this.props;
        const { DateStart, DateEnd } = this.getDate();
        let SumDays = this.state.SumDays;

        if (DurationType?.value?.Value === 'E_FIRSTHALFSHIFT' || DurationType?.value?.Value === 'E_LASTHALFSHIFT') {
            // nữa ca trước || nữa ca sau
            SumDays = 0.5;
        }

        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = (Math.random() * 16) | 0,
                v = c == 'x' ? r : (r & 0x3) | 0x8;
            return v.toString(16);
        });

        return {
            ProfileID: Profile.ID,
            ListProfileID: [Profile.ID],
            ID: record && record.ID ? record.ID : uuid,
            DateFrom: DateStart ? moment(DateStart).format('YYYY/MM/DD') : null,
            DateTo: DateEnd ? moment(DateEnd).format('YYYY/MM/DD') : null,
            HourFrom: HoursFrom.value ? Vnr_Function.formatDateAPI(HoursFrom.value) : null,
            HourTo: HoursTo.value ? Vnr_Function.formatDateAPI(HoursTo.value) : null,
            BusinessTripTypeID: BusinessTripTypeID.value ? BusinessTripTypeID.value.ID : null,
            DurationType: DurationType.value ? DurationType.value.Value : null,
            DateRange: null,
            //IsDataError: true,
            FileAttachment: FileAttachment.value ? FileAttachment.value.map((item) => item.fileName).join(',') : null,
            Note: BusinessReason.value ? BusinessReason.value : null,
            PlaceFrom: PlaceFrom.value ? PlaceFrom.value : null,
            ContactInfo: ContactInfo.value ? ContactInfo.value : null,
            PlaceFromCombobox: PlaceInFromID.value ? PlaceInFromID.value.ID : null,
            PlaceToCombobox: PlaceInToID.value ? PlaceInToID.value.ID : null,
            PlaceFromCountry: PlaceOutToID.value ? PlaceOutToID.value.ID : null,
            PlaceSendToID: PlaceSendToID.value ? PlaceSendToID.value.ID : null,
            BusinessTripReasonID: BusinessTripReasonID.value ? BusinessTripReasonID.value.ID : null,
            LevelApproved: levelApprove,
            SumDays,
            RegisterDate: DateStart ? moment(DateStart).format('YYYY/MM/DD') : null,
            Content: Content.value ? Content.value : null,
            WorkPlaceBussinessID: Location.value?.ID ?? null,
            PreparationWork: PreparationWork.value ? PreparationWork.value : null
        };
    };

    //#endregion

    render() {
        const {
            FileAttachment,
            BusinessReason,
            DurationType,
            BusinessTripTypeID,
            // LeaveDays,
            HoursFrom,
            HoursTo,
            PlaceFrom,
            ContactInfo,
            PlaceInFromID,
            PlaceInToID,
            PlaceOutToID,
            PlaceSendToID,
            BusinessTripReasonID,
            Location,
            Content,
            PreparationWork
        } = this.state;

        const {
                fieldConfig,
                isShowDelete,
                onDeleteItemDay,
                indexDay,
                acIsCheckEmpty,
                onScrollToInputIOS,
                isSimilarRegistration
            } = this.props,
            { viewInputMultiline } = stylesVnrPickerV3;

        return (
            <View
                style={[styles.wrapItem, CustomStyleSheet.marginTop(0)]}
                onLayout={(event) => {
                    const layout = event.nativeEvent.layout;
                    this.layoutHeightItem = layout.height;
                }}
            >
                {/* Title group for time */}
                <View
                    style={[
                        styles.flRowSpaceBetween,
                        CustomStyleSheet.borderTopColor(Colors.gray_5),
                        CustomStyleSheet.borderTopWidth(isSimilarRegistration ? 0.5 : 0)
                    ]}
                >
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

                {/* Loại đăng ký */}
                {DurationType.visible && fieldConfig?.DurationType?.visibleConfig && (
                    <VnrPickerLittle
                        fieldValid={fieldConfig?.DurationType?.isValid}
                        isCheckEmpty={false}
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
                    fieldConfig?.HoursFrom?.visibleConfig &&
                    HoursTo.visible &&
                    HoursTo.visibleConfig && (
                    <View style={styles.styRowDateFromTo}>
                        {/* Giờ vào */}
                        <View style={styles.styRowDate}>
                            <VnrDate
                                isHiddenIcon={true}
                                fieldValid={fieldConfig?.HoursFrom?.isValid}
                                refresh={HoursFrom.refresh}
                                response={'string'}
                                format={'HH:mm'}
                                type={'time'}
                                value={HoursFrom.value}
                                lable={HoursFrom.lable}
                                placeHolder={'HH:mm'}
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
                                        this.onChangeHourFromOrHourTo
                                    );
                                }}
                            />
                        </View>

                        <View style={styles.styRowDateLine} />

                        {/* Giờ ra */}
                        <View style={styles.styRowDate}>
                            <VnrDate
                                isHiddenIcon={true}
                                isCheckEmpty={acIsCheckEmpty}
                                fieldValid={fieldConfig?.HoursTo?.isValid}
                                refresh={HoursTo.refresh}
                                response={'string'}
                                format={'HH:mm'}
                                type={'time'}
                                value={HoursTo.value}
                                lable={HoursTo.lable}
                                placeHolder={'HH:mm'}
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
                                        this.onChangeHourFromOrHourTo
                                    );
                                }}
                            />
                        </View>
                    </View>
                )}

                {/* Tổng ngày nghỉ - Tổng giờ */}
                {/* {(LeaveDays.visible || fieldConfig?.LeaveHours?.visible) && (
                    <View style={styles.styViewLeaveDayCount}>
                        <Text style={[styleSheets.lable, styles.styViewLeaveDayCountLable]}>
                            {this.getTxtTotalCount()}
                        </Text>
                    </View>
                )} */}

                {/* diễn giải */}
                <View style={styles.styRowControl}>
                    {/* Title group for Explanation */}
                    <View style={styles.flRowSpaceBetween}>
                        <VnrText
                            style={[styleSheets.lable, styles.styLableGp, CustomStyleSheet.fontWeight('600')]}
                            i18nKey={'HRM_PortalApp_Explanation'}
                        />
                    </View>
                </View>

                {/* Địa điểm */}
                {((Location.visible && fieldConfig?.Location?.visibleConfig)) && (
                    <VnrPickerQuickly
                        api={{
                            urlApi: '[URI_CENTER]/api/Cat_GetData/GetMultiWorkPlace',
                            type: 'E_GET'
                        }}
                        stylePlaceholder={{
                            colors: Colors.gray_6
                        }}
                        isCheckEmpty={acIsCheckEmpty}
                        refresh={Location.refresh}
                        value={Location.value}
                        textField="WorkPlaceCodeName"
                        valueField="ID"
                        filter={true}
                        filterLocal={true}
                        autoFilter={true}
                        filterParams="WorkPlaceCodeName"
                        disable={Location.disable}
                        lable={Location.lable}
                        onFinish={(item) => {
                            this.setState({
                                Location: {
                                    ...Location,
                                    value: item,
                                    refresh: !Location.refresh
                                }
                            });
                        }}
                    />
                )}

                {/* Thông tin liên hệ */}
                {((ContactInfo.visible && fieldConfig?.ContactInfo?.visibleConfig)) && (
                    <VnrTextInput
                        isCheckEmpty={acIsCheckEmpty}
                        fieldValid={fieldConfig?.ContactInfo?.isValid}
                        placeHolder={'HRM_PortalApp_PleaseInput'}
                        disable={ContactInfo.disable}
                        lable={ContactInfo.lable}
                        style={[styleSheets.text]}
                        value={ContactInfo.value}
                        isTextRow={true}
                        onFocus={() => {
                            Platform.OS == 'ios' &&
                                typeof onScrollToInputIOS === 'function' &&
                                onScrollToInputIOS(indexDay + 1, this.layoutHeightItem);
                        }}
                        onChangeText={(text) => {
                            this.setState({
                                ContactInfo: {
                                    ...ContactInfo,
                                    value: text,
                                    refresh: !ContactInfo.refresh
                                }
                            });
                        }}
                        refresh={ContactInfo.refresh}
                    />
                )}

                {/* Nội dung */}
                {((Content.visible && fieldConfig?.Content?.visibleConfig)) && (
                    <VnrTextInput
                        isCheckEmpty={acIsCheckEmpty}
                        fieldValid={fieldConfig?.Content?.isValid}
                        placeHolder={'HRM_PortalApp_PleaseInput'}
                        disable={Content.disable}
                        lable={Content.lable}
                        style={[styleSheets.text, viewInputMultiline]}
                        multiline={true}
                        value={Content.value}
                        onFocus={() => {
                            Platform.OS == 'ios' &&
                                typeof onScrollToInputIOS === 'function' &&
                                onScrollToInputIOS(indexDay + 1, this.layoutHeightItem);
                        }}
                        onChangeText={(text) => {
                            this.setState({
                                Content: {
                                    ...Content,
                                    value: text,
                                    refresh: !Content.refresh
                                }
                            });
                        }}
                        refresh={Content.refresh}
                    />
                )}

                {/* Công tác chuẩn bị */}
                {((PreparationWork.visible && fieldConfig?.PreparationWork?.visibleConfig)) && (
                    <VnrTextInput
                        isCheckEmpty={acIsCheckEmpty}
                        fieldValid={fieldConfig?.PreparationWork?.isValid}
                        placeHolder={'HRM_PortalApp_PleaseInput'}
                        disable={PreparationWork.disable}
                        lable={PreparationWork.lable}
                        style={[styleSheets.text, viewInputMultiline]}
                        multiline={true}
                        value={PreparationWork.value}
                        onFocus={() => {
                            Platform.OS == 'ios' &&
                                typeof onScrollToInputIOS === 'function' &&
                                onScrollToInputIOS(indexDay + 1, this.layoutHeightItem);
                        }}
                        onChangeText={(text) => {
                            this.setState({
                                PreparationWork: {
                                    ...PreparationWork,
                                    value: text,
                                    refresh: !PreparationWork.refresh
                                }
                            });
                        }}
                        refresh={PreparationWork.refresh}
                    />
                )}

                {/* Loại Công tác */}
                {BusinessTripTypeID.visible && fieldConfig?.BusinessTripTypeID?.visibleConfig && (
                    <VnrPickerQuickly
                        isCheckEmpty={acIsCheckEmpty}
                        fieldValid={fieldConfig?.BusinessTripTypeID?.isValid}
                        refresh={BusinessTripTypeID.refresh}
                        dataLocal={BusinessTripTypeID.data}
                        value={BusinessTripTypeID.value}
                        textField="BusinessTravelName"
                        valueField="ID"
                        filter={true}
                        filterLocal={true}
                        autoFilter={true}
                        filterParams="BusinessTravelName"
                        disable={BusinessTripTypeID.disable}
                        lable={BusinessTripTypeID.lable}
                        onFinish={(item) => {
                            this.setState(
                                {
                                    BusinessTripTypeID: {
                                        ...BusinessTripTypeID,
                                        value: item,
                                        refresh: !BusinessTripTypeID.refresh
                                    }
                                },
                                this.onChangeBusinessType
                            );
                        }}
                    />
                )}
                {/* Nơi đi */}
                {PlaceFrom.visible && fieldConfig?.PlaceFrom?.visibleConfig && (
                    <VnrTextInput
                        isCheckEmpty={acIsCheckEmpty}
                        fieldValid={fieldConfig?.PlaceFrom?.isValid}
                        placeHolder={'HRM_PortalApp_PleaseInput'}
                        disable={PlaceFrom.disable}
                        lable={PlaceFrom.lable}
                        style={[styleSheets.text, viewInputMultiline]}
                        multiline={true}
                        value={PlaceFrom.value}
                        onFocus={() => {
                            Platform.OS == 'ios' &&
                                typeof onScrollToInputIOS === 'function' &&
                                onScrollToInputIOS(indexDay + 1, this.layoutHeightItem);
                        }}
                        onChangeText={(text) => {
                            this.setState({
                                PlaceFrom: {
                                    ...PlaceFrom,
                                    value: text,
                                    refresh: !PlaceFrom.refresh
                                }
                            });
                        }}
                        refresh={PlaceFrom.refresh}
                    />
                )}

                {/* Nơi đi */}
                {PlaceInFromID.visible && fieldConfig?.PlaceFromCombobox?.visibleConfig && (
                    <VnrPickerQuickly
                        isCheckEmpty={acIsCheckEmpty}
                        refresh={PlaceInFromID.refresh}
                        dataLocal={PlaceInFromID.data}
                        value={PlaceInFromID.value}
                        textField="ProvinceCodeName"
                        valueField="ID"
                        filter={true}
                        filterLocal={true}
                        autoFilter={true}
                        filterParams="ProvinceName"
                        disable={PlaceInFromID.disable}
                        lable={PlaceInFromID.lable}
                        onFinish={(item) => {
                            this.setState({
                                PlaceInFromID: {
                                    ...PlaceInFromID,
                                    value: item,
                                    refresh: !PlaceInFromID.refresh
                                }
                            });
                        }}
                    />
                )}

                {/* Nơi đến */}
                {PlaceInToID.visible && fieldConfig?.PlaceToCombobox?.visibleConfig && (
                    <VnrPickerQuickly
                        isCheckEmpty={acIsCheckEmpty}
                        refresh={PlaceInToID.refresh}
                        dataLocal={PlaceInToID.data}
                        value={PlaceInToID.value}
                        textField="ProvinceCodeName"
                        valueField="ID"
                        filter={true}
                        filterLocal={true}
                        autoFilter={true}
                        filterParams="ProvinceName"
                        disable={PlaceInToID.disable}
                        lable={PlaceInToID.lable}
                        onFinish={(item) => {
                            this.setState({
                                PlaceInToID: {
                                    ...PlaceInToID,
                                    value: item,
                                    refresh: !PlaceInToID.refresh
                                }
                            });
                        }}
                    />
                )}

                {/* Nơi đến */}
                {PlaceOutToID.visible && fieldConfig?.PlaceOutToID?.visibleConfig && (
                    <VnrPickerQuickly
                        isCheckEmpty={acIsCheckEmpty}
                        refresh={PlaceOutToID.refresh}
                        dataLocal={PlaceOutToID.data}
                        value={PlaceOutToID.value}
                        textField="CountryCodeName"
                        valueField="ID"
                        filter={true}
                        filterLocal={true}
                        autoFilter={true}
                        filterParams="CountryName"
                        disable={PlaceOutToID.disable}
                        lable={PlaceOutToID.lable}
                        onFinish={(item) => {
                            this.setState({
                                PlaceOutToID: {
                                    ...PlaceOutToID,
                                    value: item,
                                    refresh: !PlaceOutToID.refresh
                                }
                            });
                        }}
                    />
                )}

                {/* Nơi đưa đến */}
                {PlaceSendToID.visible && fieldConfig?.PlaceSendToID?.visibleConfig && (
                    <VnrPickerQuickly
                        isCheckEmpty={acIsCheckEmpty}
                        refresh={PlaceSendToID.refresh}
                        dataLocal={PlaceSendToID.data}
                        value={PlaceSendToID.value}
                        textField="WorkPlaceName"
                        valueField="ID"
                        filter={true}
                        filterLocal={true}
                        autoFilter={true}
                        filterParams="WorkPlaceName"
                        disable={PlaceSendToID.disable}
                        lable={PlaceSendToID.lable}
                        onFinish={(item) => {
                            this.setState({
                                PlaceSendToID: {
                                    ...PlaceSendToID,
                                    value: item,
                                    refresh: !PlaceSendToID.refresh
                                }
                            });
                        }}
                    />
                )}

                {/* Lý do đi công tác */}
                {BusinessTripReasonID.visible && fieldConfig?.BusinessTripReasonID?.visibleConfig && (
                    <VnrPickerQuickly
                        isCheckEmpty={acIsCheckEmpty}
                        refresh={BusinessTripReasonID.refresh}
                        dataLocal={BusinessTripReasonID.data}
                        value={BusinessTripReasonID.value}
                        textField="BusinessTripReasonName"
                        valueField="ID"
                        filter={true}
                        filterLocal={true}
                        autoFilter={true}
                        filterParams="BusinessTripReasonName"
                        disable={BusinessTripReasonID.disable}
                        lable={BusinessTripReasonID.lable}
                        onFinish={(item) => {
                            this.setState({
                                BusinessTripReasonID: {
                                    ...BusinessTripReasonID,
                                    value: item,
                                    refresh: !BusinessTripReasonID.refresh
                                }
                            });
                        }}
                    />
                )}

                {BusinessReason.visible && fieldConfig?.Note?.visibleConfig && (
                    <VnrTextInput
                        isCheckEmpty={acIsCheckEmpty}
                        fieldValid={fieldConfig?.Note?.isValid}
                        placeHolder={'HRM_PortalApp_PleaseInput'}
                        disable={BusinessReason.disable}
                        lable={BusinessReason.lable}
                        style={[styleSheets.text, viewInputMultiline]}
                        multiline={true}
                        value={BusinessReason.value}
                        onFocus={() => {
                            Platform.OS == 'ios' &&
                                typeof onScrollToInputIOS === 'function' &&
                                onScrollToInputIOS(indexDay + 1, this.layoutHeightItem);
                        }}
                        onChangeText={(text) => {
                            this.setState({
                                BusinessReason: {
                                    ...BusinessReason,
                                    value: text,
                                    refresh: !BusinessReason.refresh
                                }
                            });
                        }}
                        refresh={BusinessReason.refresh}
                    />
                )}

                {/* Tập tin đính kèm */}
                {FileAttachment.visible && fieldConfig?.FileAttachment?.visibleConfig && (
                    <View style={{}}>
                        <VnrAttachFile
                            fieldValid={fieldConfig?.FileAttachment?.isValid}
                            isCheckEmpty={acIsCheckEmpty}
                            lable={FileAttachment.lable}
                            disable={FileAttachment.disable}
                            refresh={FileAttachment.refresh}
                            value={FileAttachment.value}
                            style
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
            </View>
        );
    }
}

const styles = styleComonAddOrEdit;

export default AttSubmitTakeBusinessTripComponent;
