import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    Size,
    stylesModalPopupBottom,
    styleScreenDetail,
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
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName, EnumIcon, ScreenName } from '../../../../../assets/constant';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { IconColse } from '../../../../../constants/Icons';
import VnrPickerMulti from '../../../../../components/VnrPickerMulti/VnrPickerMulti';
import { translate } from '../../../../../i18n/translate';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import Modal from 'react-native-modal';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';

let enumName = null,
    profileInfo = null;

const initSateDefault = {
    ID: null,
    Profile: {
        label: 'HRM_Attendance_Overtime_ProfileName',
        ID: null,
        ProfileName: '',
        disable: true
    },
    DateStart: {
        label: 'HRM_Travel_Working_Time',
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true,
        disable: false
    },
    DateEnd: {
        label: 'HRM_Travel_Working_Time',
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true,
        disable: false
    },
    DecisionNo: {
        label: 'HRM_HR_Discipline_DecisionNo',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    LeaveDayTypeFull: {
        visible: false,
        visibleConfig: true,
        LeaveDayTypeID: {
            label: 'HRM_Fin_PurchaseRequest_Type',
            api: {
                urlApi: '[URI_HR]/Cat_GetData/GetMultiLeaveDayTypeTripInPortal',
                type: 'E_GET'
            },
            valueField: 'ID',
            textField: 'LeaveDayTypeName',
            data: [],
            disable: false,
            refresh: false,
            value: null
        }
    },
    LeaveDayTypeByGrade: {
        visible: false,
        visibleConfig: true,
        TempLeaveDayTypeID: {
            label: 'HRM_Fin_PurchaseRequest_Type',
            api: {
                urlApi: '[URI_POR]/New_Att_Overtime/GetMultiDurationType',
                type: 'E_GET'
            },
            valueField: 'ID',
            textField: 'LeaveDayTypeName',
            data: [],
            disable: false,
            refresh: false,
            value: null
        }
    },
    Div_DurationType1: {
        visible: true,
        visibleConfig: true,
        DurationType: {
            label: 'HRM_Attendance_Leaveday_DurationType',
            api: {
                urlApi: '[URI_POR]/New_Att_Leaveday/GetMultiDurationType',
                type: 'E_GET'
            },
            valueField: 'Value',
            textField: 'Text',
            data: [],
            disable: false,
            refresh: false,
            value: null
        },
        DurationTypeDetail: {
            visible: false,
            visibleConfig: true,
            OtherDurationType: {
                visible: true,
                visibleConfig: true,
                HoursFrom: {
                    label: 'HRM_Attendance_Overtime_TimeFrom',
                    value: null,
                    refresh: false,
                    disable: false,
                    visibleConfig: true,
                    visible: true
                },
                HoursTo: {
                    label: 'HRM_Attendance_Overtime_TimeTo',
                    value: null,
                    refresh: false,
                    disable: false,
                    visibleConfig: true,
                    visible: true
                },
                LeaveHoursDetail: {
                    visible: false,
                    visibleConfig: true,
                    ConfigLeaveHoursDetail: {
                        label: 'HRM_Attendance_Leaveday_LeaveHoursDetail',
                        data: [],
                        disable: false,
                        refresh: false,
                        value: null
                    }
                },
                LeaveHours: {
                    label: 'HRM_Attendance_Business_Duration',
                    disable: false,
                    value: '',
                    refresh: false,
                    visibleConfig: true,
                    visible: true
                }
            },
            DurationTypeFullShift: {
                visibleConfig: true,
                visible: true,
                LeaveDays: {
                    label: 'HRM_Attendance_Leaveday_Total',
                    disable: false,
                    value: '',
                    refresh: false
                }
            }
        }
    },
    Div_TypeHalfShift1: {
        visible: false,
        visibleConfig: true,
        TypeHalfShift: {
            label: 'HRM_Attendance_Leaveday_TypeHalfShift',
            api: {
                urlApi: '[URI_POR]/New_Att_Overtime/GetMultiTypeHalfShift',
                type: 'E_GET'
            },
            valueField: 'Value',
            textField: 'Text',
            data: [],
            disable: false,
            refresh: false,
            value: null
        },
        divTypeHalfShiftContent: {
            visible: false,
            visibleConfig: true,
            divTypeHalfShiftLeaveDay: {
                visibleConfig: true,
                visible: true,
                TypeHalfShiftLeaveDays: {
                    label: 'HRM_Attendance_Leaveday_Total',
                    disable: false,
                    value: null,
                    refresh: false
                }
            },
            divTypeHalfShiftLeaveHours: {
                visibleConfig: true,
                visible: true,
                TypeHalfShiftLeaveHours: {
                    label: 'HRM_Attendance_Business_Duration',
                    disable: false,
                    value: null,
                    refresh: false
                }
            }
        }
    },
    divShift: {
        visibleConfig: true,
        visible: false,
        ShiftID: {
            label: 'HRM_Category_Shift_ShiftName',
            api: {
                urlApi: '[URI_HR]/Cat_GetData/GetMultiShift',
                type: 'E_GET'
            },
            valueField: 'ID',
            textField: 'ShiftName',
            data: [],
            disable: false,
            value: null,
            refresh: false
        }
    },
    Type: {
        visibleConfig: true,
        visible: true,
        value: 'E_IN',
        E_IN: {
            label: 'E_Domestic_In_Travel',
            disable: false,
            refresh: false,
            value: true,
            visibleConfig: true,
            visible: true
        },
        E_DOMESTIC: {
            label: 'E_Domestic_Out_Travel',
            disable: false,
            refresh: false,
            value: false,
            visibleConfig: true,
            visible: true
        },
        E_OUT: {
            label: 'E_Oversea_Travel',
            disable: false,
            refresh: false,
            value: false,
            visibleConfig: true,
            visible: true
        }
    },
    AddressIDIn: {
        visible: false,
        visibleConfig: true,
        label: 'HRM_Att_LeaveDay_SpecificAddressIn',
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetAddressMultiVn',
            type: 'E_GET'
        },
        valueField: 'ID',
        textField: 'AddressVN',
        data: [],
        disable: false,
        value: null,
        refresh: false
    },
    AddressIDOut: {
        visible: false,
        visibleConfig: true,
        label: 'HRM_Att_LeaveDay_SpecificAddressOut',
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetAddressMultiNotVn',
            type: 'E_GET'
        },
        valueField: 'ID',
        textField: 'AddressVN',
        data: [],
        disable: false,
        value: null,
        refresh: false
    },
    PlaceOutFromID: {
        visible: false,
        visibleConfig: true,
        label: 'HRM_FIN_TravelRequestItem_Departure',
        api: {
            urlApi: '[URI_POR]/New_List_Travel/GetCountry',
            type: 'E_GET'
        },
        valueField: 'ID',
        textField: 'CountryName',
        data: [],
        disable: false,
        value: null,
        refresh: false
    },
    MissionPlaceOutID: {
        visible: false,
        visibleConfig: true,
        label: 'HRM_FIN_TravelRequestItem_Arrival',
        api: {
            urlApi: '[URI_POR]/New_List_Travel/GetCountry',
            type: 'E_GET'
        },
        valueField: 'ID',
        textField: 'CountryName',
        data: [],
        disable: false,
        value: null,
        refresh: false
    },
    PlaceInFromID: {
        visible: false,
        visibleConfig: true,
        label: 'HRM_FIN_TravelRequestItem_Departure',
        api: {
            urlApi: '[URI_POR]/New_List_Travel/GetProvinceVN',
            type: 'E_GET'
        },
        data: [],
        valueField: 'ID',
        textField: 'ProvinceName',
        disable: false,
        value: null,
        refresh: false
    },
    MissionPlaceInID: {
        visible: false,
        visibleConfig: true,
        label: 'HRM_FIN_TravelRequestItem_Arrival',
        api: {
            urlApi: '[URI_POR]/New_List_Travel/GetProvinceVN',
            type: 'E_GET'
        },
        data: [],
        valueField: 'ID',
        textField: 'ProvinceName',
        disable: false,
        value: null,
        refresh: false
    },
    TravelWarrantID: {
        label: 'HRM_Cat_TravelWarrant_TravelWarrantName',
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetTravelWarrant',
            type: 'E_GET'
        },
        data: [],
        valueField: 'ID',
        textField: 'TravelWarrantName',
        disable: false,
        value: null,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    Route: {
        label: 'HRM_Attendance_Leaveday_Route',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    VehicleID: {
        label: 'HRM_HR_Profile_TypeOfVehicle',
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetMultiVehicle',
            type: 'E_GET'
        },
        data: [],
        valueField: 'ID',
        textField: 'NameEntityName',
        disable: false,
        value: null,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    MissionDistanceID: {
        visible: true,
        visibleConfig: true,
        label: 'HRM_Cat_Cat_RatioMission_MissionDistanceID',
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetMissionDistanceMulti',
            type: 'E_GET'
        },
        data: [],
        valueField: 'ID',
        textField: 'MissionDistanceName',
        disable: false,
        value: null,
        refresh: false
    },
    NoNightStay: {
        label: 'Business_Travel_No_NightStay',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    hasIsMeal: {
        visibleConfig: true,
        visible: false,
        HaveMeal: {
            label: 'HRM_Attendance_RosterGroup_HaveMeal',
            api: {
                urlApi: '[URI_SYS]/Sys_GetData/GetEnum?text=HaveMealType',
                type: 'E_GET'
            },
            valueField: 'Value',
            textField: 'Text',
            data: [],
            disable: false,
            value: null,
            refresh: false
        }
    },
    TypeOfServiceID: {
        visible: true,
        visibleConfig: true,
        label: 'HRM_Cat_TypeOfService_Name',
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetTypeOfService',
            type: 'E_GET'
        },
        valueField: 'ID',
        textField: 'NameEntityName',
        data: [],
        disable: false,
        value: null,
        refresh: false
    },
    IsHaveCosts: {
        label: 'Business_Travel_IsHaveCosts',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    BusinessReason: {
        label: 'HRM_Attendance_Leaveday_BusinessReason',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    FileAttachment: {
        label: 'HRM_Rec_JobVacancy_FileAttachment',
        visible: true,
        visibleConfig: true,
        disable: true,
        refresh: false,
        value: null
    },
    UserApproveID: {
        label: 'HRM_Attendance_LeaveDayBusiness_UserApproveID',
        api: {
            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_LEAVE_DAY_BUSINESSTRAVEL',
            type: 'E_GET'
        },
        data: [],
        valueField: 'ID',
        textField: 'UserInfoName',
        disable: false,
        visible: true,
        refresh: false,
        value: null,
        visibleConfig: true
    },
    UserApproveID3: {
        label: 'HRM_Attendance_LeaveDayBusiness_UserApproveID3',
        api: {
            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_LEAVE_DAY_BUSINESSTRAVEL',
            type: 'E_GET'
        },
        data: [],
        valueField: 'ID',
        textField: 'UserInfoName',
        disable: false,
        visible: false,
        refresh: false,
        value: null,
        visibleConfig: true
    },
    UserApproveID4: {
        label: 'HRM_Attendance_LeaveDayBusiness_UserApproveID4',
        api: {
            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_LEAVE_DAY_BUSINESSTRAVEL',
            type: 'E_GET'
        },
        data: [],
        valueField: 'ID',
        textField: 'UserInfoName',
        disable: false,
        visible: false,
        refresh: false,
        value: null,
        visibleConfig: true
    },
    UserApproveID2: {
        label: 'HRM_Attendance_LeaveDayBusiness_UserApproveID2',
        api: {
            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_LEAVE_DAY_BUSINESSTRAVEL',
            type: 'E_GET'
        },
        data: [],
        valueField: 'ID',
        textField: 'UserInfoName',
        disable: false,
        visible: true,
        refresh: false,
        value: null,
        visibleConfig: true
    },
    fieldValid: {},
    dataBusinessCost: {
        isShowbtn: false,
        isVisible: false,
        data: []
    }
};

export default class AttSubmitBusinessTripAddOrEdit extends Component {
    constructor(props) {
        super(props);

        this.state = initSateDefault;

        props.navigation.setParams({
            title:
                props.navigation.state.params && props.navigation.state.params.record
                    ? 'Business_Travel_Update'
                    : 'Business_Travel_Create'
        });

        this.setVariable();
    }

    setVariable = () => {
        //biến trạng thái
        this.isModify = false;
        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;
        this.IsLeaveHoursDetail = null;
        this.levelApproveTrip = null;
        this.isChangeLevelBusinessApprove = null;
        this.isOnlyOnleLevelApprove = null;
        this.IsCheckingLevel = null;
        this.IsExcludeProbation = null;
        this.IsFormulaDuration = null;

        this.dataFirstApprove = [];
        this.dataLastApprove = [];
        this.dataMidApprove = [];
        this.dataFirstApprove = [];
        this.dataTypeHalfShift = [];
        this.dataFomulaDuration = [];
        this.dataDurationType = [];
        this.dataTempLeaveDayTypeID = [];
    };

    refreshView = () => {
        this.props.navigation.setParams({ title: 'Business_Travel_Create' });
        this.setVariable();
        this.setState(initSateDefault, () => this.getConfigValid('Att_LeaveDayBusinessTravel', true));
    };

    //#region [khởi tạo - lấy các dữ liệu cho control, lấy giá trị mặc đinh]

    //promise get config valid
    getConfigValid = (tblName, isRefresh) => {
        VnrLoadingSevices.show();
        HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName).then(res => {
            VnrLoadingSevices.hide();
            if (res) {
                try {

                    //map field hidden by config
                    const _configField =
                        ConfigField && ConfigField.value['AttSubmitBusinessTripAddOrEdit']
                            ? ConfigField.value['AttSubmitBusinessTripAddOrEdit']['Hidden']
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

                        let { record } = !isRefresh ? this.props.navigation.state.params : {};

                        //get config khi đăng ký
                        if (!record) {
                            this.initData();
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

    componentDidMount() {
        //get config validate
        this.getConfigValid('Att_LeaveDayBusinessTravel');
    }

    initData = () => {
        const { E_ProfileID, E_FullName } = enumName,
            _profile = {
                ID: profileInfo[E_ProfileID],
                ProfileName: profileInfo[E_FullName]
            },
            { Profile, Div_TypeHalfShift1 } = this.state,
            { divTypeHalfShiftContent } = Div_TypeHalfShift1,
            { divTypeHalfShiftLeaveDay, divTypeHalfShiftLeaveHours } = divTypeHalfShiftContent,
            { TypeHalfShiftLeaveHours } = divTypeHalfShiftLeaveHours,
            { TypeHalfShiftLeaveDays } = divTypeHalfShiftLeaveDay;

        this.readOnlyCtrlBT(true);
        this.GetConfigHrForPortalByKey();
        this.GetMultiShift();
        this.GetMissionDistanceMulti();

        let nextState = {
            Profile: {
                ...Profile,
                ..._profile
            },
            Div_TypeHalfShift1: {
                ...Div_TypeHalfShift1,
                divTypeHalfShiftContent: {
                    ...divTypeHalfShiftContent,
                    divTypeHalfShiftLeaveDay: {
                        ...divTypeHalfShiftLeaveDay,
                        TypeHalfShiftLeaveDays: {
                            ...TypeHalfShiftLeaveDays,
                            disable: true,
                            refresh: !TypeHalfShiftLeaveDays.refresh
                        }
                    },
                    divTypeHalfShiftLeaveHours: {
                        ...divTypeHalfShiftLeaveHours,
                        TypeHalfShiftLeaveHours: {
                            ...TypeHalfShiftLeaveHours,
                            disable: true,
                            refresh: !TypeHalfShiftLeaveHours.refresh
                        }
                    }
                }
            }
        };

        VnrLoadingSevices.show();
        HttpService.MultiRequest([
            //this.dataDurationType
            HttpService.Post('[URI_HR]/Sys_GetEnumData/GetEnum', { text: 'LeaveDayDurationType' }),
            //this.dataTypeHalfShift
            HttpService.Post('[URI_HR]/Sys_GetEnumData/GetEnum', { text: 'LeaveDayType' }),
            //UserApproveID
            HttpService.Get('[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_LEAVE_DAY_BUSINESSTRAVEL'),
            //DurationType
            HttpService.Get('[URI_POR]/New_Att_Leaveday/GetMultiDurationType'),
            //TempLeaveDayTypeID
            HttpService.Get('[URI_POR]/New_Att_Overtime/GetMultiDurationType'),
            //TypeHalfShift
            HttpService.Get('[URI_POR]/New_Att_Overtime/GetMultiTypeHalfShift')
            //HttpService.Post('[URI_HR]/Cat_GetData/GetMultiLeaveDayTypeInPortal'),
        ]).then(resAll => {
            VnrLoadingSevices.hide();
            try {
                if (resAll) {
                    const {
                            UserApproveID,
                            UserApproveID2,
                            UserApproveID3,
                            UserApproveID4,
                            Div_DurationType1,
                            LeaveDayTypeByGrade,
                            Div_TypeHalfShift1
                        } = this.state,
                        { TypeHalfShift } = Div_TypeHalfShift1,
                        { DurationType } = Div_DurationType1,
                        { TempLeaveDayTypeID } = LeaveDayTypeByGrade;

                    if (resAll[0] && Array.isArray(resAll[0])) {
                        this.dataDurationType = [...resAll[0]];
                    }

                    if (resAll[1] && Array.isArray(resAll[1])) {
                        this.dataTypeHalfShift = [...resAll[1]];
                    }

                    if (resAll[2] && Array.isArray(resAll[2])) {
                        nextState = {
                            ...nextState,
                            UserApproveID: {
                                ...UserApproveID,
                                data: [...resAll[2]],
                                refresh: !UserApproveID.refresh
                            },
                            UserApproveID2: {
                                ...UserApproveID2,
                                data: [...resAll[2]],
                                refresh: !UserApproveID2.refresh
                            },
                            UserApproveID3: {
                                ...UserApproveID3,
                                data: [...resAll[2]],
                                refresh: !UserApproveID3.refresh
                            },
                            UserApproveID4: {
                                ...UserApproveID4,
                                data: [...resAll[2]],
                                refresh: !UserApproveID4.refresh
                            }
                        };
                    }

                    if (resAll[3] && Array.isArray(resAll[3])) {
                        nextState = {
                            ...nextState,
                            Div_DurationType1: {
                                ...Div_DurationType1,
                                DurationType: {
                                    ...DurationType,
                                    data: [...resAll[3]],
                                    refresh: !DurationType.refresh
                                }
                            }
                        };
                    }

                    if (resAll[4] && Array.isArray(resAll[4])) {
                        nextState = {
                            ...nextState,
                            LeaveDayTypeByGrade: {
                                ...LeaveDayTypeByGrade,
                                TempLeaveDayTypeID: {
                                    ...TempLeaveDayTypeID,
                                    data: [...resAll[4]],
                                    refresh: !TempLeaveDayTypeID.refresh
                                }
                            }
                        };
                    }

                    if (resAll[5] && Array.isArray(resAll[5])) {
                        nextState = {
                            ...nextState,
                            TypeHalfShift: {
                                ...TypeHalfShift,
                                data: [...resAll[5]],
                                refresh: !TypeHalfShift.refresh
                            }
                        };
                    }

                    this.setState(nextState, () => {
                        this.GetHighSupervior();
                    });
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    GetConfigHrForPortalByKey = () => {
        HttpService.Get(
            '[URI_HR]/Hre_GetData/GetConfigHrForPortalByKey?configKey=HRM_Att_Leave_BusinessTripScope'
        ).then(data => {
            if (data && data.Value1) {
                const {
                        Type,
                        MissionPlaceInID,
                        MissionPlaceOutID,
                        PlaceInFromID,
                        PlaceOutFromID,
                        AddressIDIn,
                        AddressIDOut
                    } = this.state,
                    { E_IN, E_DOMESTIC, E_OUT } = Type;
                let arrValue = data.Value1.split(','),
                    nextState = {
                        Type: {
                            ...Type
                        }
                    };

                //E_IN
                if (!arrValue.indexOf('E_Domestic_In_Travel') < 0) {
                    nextState = {
                        Type: {
                            ...nextState.Type,
                            E_IN: {
                                ...E_IN,
                                visible: false,
                                refresh: !E_IN.refresh
                            }
                        }
                    };
                }

                //E_DOMESTIC
                if (arrValue.indexOf('E_Domestic_Out_Travel') < 0) {
                    nextState = {
                        Type: {
                            ...nextState.Type,
                            E_DOMESTIC: {
                                ...E_DOMESTIC,
                                visible: false,
                                refresh: !E_DOMESTIC.refresh
                            }
                        }
                    };
                }

                //E_OUT
                if (arrValue.indexOf('E_Domestic_External') < 0) {
                    nextState = {
                        Type: {
                            ...nextState.Type,
                            E_OUT: {
                                ...E_OUT,
                                visible: false,
                                refresh: !E_OUT.refresh
                            }
                        }
                    };
                }

                if (nextState.Type.E_IN.visible) {
                    nextState = {
                        Type: {
                            ...nextState.Type,
                            value: 'E_IN',
                            E_IN: {
                                ...E_IN,
                                value: true,
                                refresh: !E_IN.refresh
                            }
                        }
                    };
                } else if (nextState.Type.E_DOMESTIC.visible) {
                    nextState = {
                        Type: {
                            ...nextState.Type,
                            value: 'E_DOMESTIC',
                            E_DOMESTIC: {
                                ...E_DOMESTIC,
                                value: true,
                                refresh: !E_DOMESTIC.refresh
                            }
                        },
                        MissionPlaceInID: {
                            ...MissionPlaceInID,
                            visible: true,
                            refresh: !MissionPlaceInID.refresh
                        },
                        AddressIDIn: {
                            ...AddressIDIn,
                            visible: true,
                            refresh: !AddressIDIn.refresh
                        },
                        PlaceInFromID: {
                            ...PlaceInFromID,
                            visible: true,
                            refresh: !PlaceInFromID.refresh
                        }
                    };
                } else if (nextState.Type.E_OUT.visible) {
                    nextState = {
                        Type: {
                            ...nextState.Type,
                            value: 'E_OUT',
                            E_OUT: {
                                ...E_OUT,
                                value: true,
                                refresh: !E_OUT.refresh
                            }
                        },
                        MissionPlaceOutID: {
                            ...MissionPlaceOutID,
                            visible: true,
                            refresh: !MissionPlaceOutID.refresh
                        },
                        AddressIDOut: {
                            ...AddressIDOut,
                            visible: true,
                            refresh: !AddressIDOut.refresh
                        },
                        PlaceOutFromID: {
                            ...PlaceOutFromID,
                            visible: true,
                            refresh: !PlaceOutFromID.refresh
                        }
                    };
                }

                this.setState(nextState);
            }
        });
    };

    GetMultiShift = () => {
        HttpService.Get('[URI_HR]/Cat_GetData/GetMultiShift').then(res => {
            if (res && Array.isArray(res)) {
                const { divShift } = this.state,
                    { ShiftID } = divShift;

                this.setState({
                    divShift: {
                        ...divShift,
                        ShiftID: {
                            ...ShiftID,
                            data: [...res],
                            refresh: !ShiftID.refresh
                        }
                    }
                });
            }
        });
    };

    GetMissionDistanceMulti = () => {
        HttpService.Get('[URI_HR]/Cat_GetData/GetMissionDistanceMulti').then(data => {
            if (data) {
                const { MissionDistanceID } = this.state;
                this.setState({
                    MissionDistanceID: {
                        ...MissionDistanceID,
                        data: [...data],
                        refresh: !MissionDistanceID.refresh
                    }
                });
            }
        });
    };

    readOnlyCtrlBT(isReadOnly, callback) {
        const {
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4,
                Div_DurationType1,
                LeaveDayTypeByGrade,
                VehicleID,
                MissionDistanceID,
                MissionPlaceInID,
                MissionPlaceOutID,
                NoNightStay,
                IsHaveCosts,
                FileAttachment,
                BusinessReason,
                Type
            } = this.state,
            { E_IN, E_OUT, E_DOMESTIC } = Type,
            { TempLeaveDayTypeID } = LeaveDayTypeByGrade,
            { DurationType } = Div_DurationType1;
        let nextState = {};

        if (!this.isChangeLevelBusinessApprove || isReadOnly) {
            nextState = {
                ...nextState,
                UserApproveID: {
                    ...UserApproveID,
                    disable: true,
                    refresh: !UserApproveID.refresh
                },
                UserApproveID2: {
                    ...UserApproveID2,
                    disable: true,
                    refresh: !UserApproveID2.refresh
                },
                UserApproveID3: {
                    ...UserApproveID3,
                    disable: true,
                    refresh: !UserApproveID3.refresh
                },
                UserApproveID4: {
                    ...UserApproveID4,
                    disable: true,
                    refresh: !UserApproveID4.refresh
                }
            };
        } else if (this.isChangeLevelBusinessApprove) {
            nextState = {
                ...nextState,
                UserApproveID: {
                    ...UserApproveID,
                    disable: false,
                    refresh: !UserApproveID.refresh
                },
                UserApproveID2: {
                    ...UserApproveID2,
                    disable: false,
                    refresh: !UserApproveID2.refresh
                },
                UserApproveID3: {
                    ...UserApproveID3,
                    disable: false,
                    refresh: !UserApproveID3.refresh
                },
                UserApproveID4: {
                    ...UserApproveID4,
                    disable: false,
                    refresh: !UserApproveID4.refresh
                }
            };
        }

        nextState = {
            ...nextState,
            Type: {
                ...Type,
                E_IN: {
                    ...E_IN,
                    disable: isReadOnly,
                    refresh: !E_IN.refresh
                },
                E_OUT: {
                    ...E_OUT,
                    disable: isReadOnly,
                    refresh: !E_OUT.refresh
                },
                E_DOMESTIC: {
                    ...E_DOMESTIC,
                    disable: isReadOnly,
                    refresh: !E_DOMESTIC.refresh
                }
            },
            LeaveDayTypeByGrade: {
                ...LeaveDayTypeByGrade,
                TempLeaveDayTypeID: {
                    ...TempLeaveDayTypeID,
                    disable: isReadOnly,
                    refresh: !TempLeaveDayTypeID.refresh
                }
            },
            Div_DurationType1: {
                ...Div_DurationType1,
                DurationType: {
                    ...DurationType,
                    disable: isReadOnly,
                    refresh: !DurationType.refresh
                }
            },
            IsHaveCosts: {
                ...IsHaveCosts,
                disable: isReadOnly,
                refresh: !IsHaveCosts.refresh
            },
            NoNightStay: {
                ...NoNightStay,
                disable: isReadOnly,
                refresh: !NoNightStay.refresh
            },
            MissionPlaceOutID: {
                ...MissionPlaceOutID,
                disable: isReadOnly,
                refresh: !MissionPlaceOutID.refresh
            },
            MissionPlaceInID: {
                ...MissionPlaceInID,
                disable: isReadOnly,
                refresh: !MissionPlaceInID.refresh
            },
            MissionDistanceID: {
                ...MissionDistanceID,
                disable: isReadOnly,
                refresh: !MissionDistanceID.refresh
            },
            FileAttachment: {
                ...FileAttachment,
                disable: isReadOnly,
                refresh: !FileAttachment.refresh
            },
            BusinessReason: {
                ...BusinessReason,
                disable: isReadOnly,
                refresh: !BusinessReason.refresh
            },
            VehicleID: {
                ...VehicleID,
                disable: isReadOnly,
                refresh: !VehicleID.refresh
            }
        };

        this.setState(nextState, () => {
            if (callback && typeof callback == 'function') {
                callback();
            }
        });
    }

    GetHighSupervior = () => {
        const {
                Profile,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4,
                Div_DurationType1,
                Div_TypeHalfShift1,
                Type,
                DateStart,
                DateEnd
            } = this.state,
            { DurationType } = Div_DurationType1,
            { TypeHalfShift } = Div_TypeHalfShift1,
            missionPlaceType = Type.value;

        if (DateStart.value && DateEnd.value) {
            this.readOnlyCtrlBT(false);
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetHighSupervisor', {
            ProfileID: Profile.ID,
            userSubmit: Profile.ID,
            type: 'E_LEAVE_DAY_BUSINESSTRAVEL',
            missionPlaceType: missionPlaceType
        }).then(result => {
            VnrLoadingSevices.hide();
            let nextState = {
                UserApproveID: { ...UserApproveID },
                UserApproveID2: { ...UserApproveID2 },
                UserApproveID3: { ...UserApproveID3 },
                UserApproveID4: { ...UserApproveID4 }
            };

            if (result.IsLeaveHoursDetail != null) {
                this.IsLeaveHoursDetail = true;
            }

            //truong hop chạy theo approve grade
            if (result.LevelApprove > 0) {
                this.levelApproveTrip = result.LevelApprove;

                if (result.IsChangeApprove == true) {
                    this.isChangeLevelBusinessApprove = true;
                }

                if (result.LevelApprove == 2) {
                    if (result.IsOnlyOneLevelApprove) {
                        this.isOnlyOnleLevelApprove = true;

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
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                },
                                UserApproveID4: {
                                    ...nextState.UserApproveID4,
                                    value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                },
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
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
                            // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                            // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                            // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                            nextState = {
                                ...nextState,
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                },
                                UserApproveID4: {
                                    ...nextState.UserApproveID4,
                                    value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                },
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                }
                            };
                        }
                    }
                    // isShowEle("#" + divControl3);
                    // isShowEle("#" + divControl4);
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
                        //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID);
                        //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }
                            },
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }
                            }
                        };
                    }
                    // isShowEle("#" + divControl3, true);
                    // isShowEle("#" + divControl4);
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
                        //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }
                            }
                        };
                    }
                    if (result.HighSupervisorID != null) {
                        //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                            }
                        };
                    }
                    // isShowEle("#" + divControl3, true);
                    // isShowEle("#" + divControl4, true);
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

                if (result.FormularDurationType != '' && result.FormularDurationType != null) {
                    //set datasource cho duration type
                    this.IsFormulaDuration = true;
                    let dataSource = [],
                        str = result.FormularDurationType.split(',');

                    for (let i = 0; i < this.dataDurationType.length; i++) {
                        //chưa tìm được cách dịch enum khi gáng datasource mới nào nên làm cách củ chuối
                        if (str.indexOf(this.dataDurationType[i].Value) != -1) {
                            dataSource.push({
                                Text: this.dataDurationType[i].Text,
                                Value: this.dataDurationType[i].Value
                            });
                            this.dataFomulaDuration.push({
                                Text: this.dataDurationType[i].Text,
                                Value: this.dataDurationType[i].Value
                            });
                        }
                    }
                    // var ddlDurationType = $("#DurationType").data("kendoDropDownList");
                    // ddlDurationType.setDataSource(dataSource);
                    // ddlDurationType.refresh();

                    nextState = {
                        ...nextState,
                        Div_DurationType1: {
                            ...Div_DurationType1,
                            DurationType: {
                                ...DurationType,
                                data: [...dataSource],
                                refresh: !DurationType.refresh
                            }
                        }
                    };

                    let datasourceTypeHaltShift = [];
                    for (let i = 0; i < this.dataTypeHalfShift.length; i++) {
                        //chưa tìm được cách dịch enum khi gáng datasource mới nào nên làm cách củ chuối
                        if (str.indexOf(this.dataTypeHalfShift[i].Value) != -1) {
                            datasourceTypeHaltShift.push({
                                Text: this.dataTypeHalfShift[i].Text,
                                Value: this.dataTypeHalfShift[i].Value
                            });
                        }
                    }
                    // var ddlDurationType = $("#TypeHalfShift").data("kendoDropDownList");
                    // ddlDurationType.setDataSource(datasourceTypeHaltShift);
                    // ddlDurationType.refresh();

                    nextState = {
                        ...nextState,
                        Div_TypeHalfShift1: {
                            ...Div_TypeHalfShift1,
                            TypeHalfShift: {
                                ...TypeHalfShift,
                                data: [...datasourceTypeHaltShift],
                                refresh: !TypeHalfShift.refresh
                            }
                        }
                    };
                }
            }
            //TH chạy không theo approvegrade
            else if (result.LevelApprove == 0) {
                if (result.IsChangeApprove == true) {
                    this.isChangeLevelBusinessApprove = true;
                }
                if (result.IsConCurrent == true) {
                    for (let i = 0; i < result.lstSupervior.length; i++) {
                        this.dataFirstApprove.push({
                            UserInfoName: result.lstSupervior[i].SupervisorName,
                            ID: result.lstSupervior[i].SupervisorID
                        });
                    }

                    for (let i = 0; i < result.lstHightSupervior.length; i++) {
                        let item = {
                            UserInfoName: result.lstHightSupervior[i].HighSupervisorName,
                            ID: result.lstHightSupervior[i].HighSupervisorID
                        };

                        this.dataMidApprove.push(item);
                        this.dataLastApprove.push(item);
                    }
                    // multiUserApproveID.setDataSource(dataFirstApprove);
                    // multiUserApproveID.refresh();
                    // multiUserApproveID2.setDataSource(dataLastApprove);
                    // multiUserApproveID2.refresh();
                    // multiUserApproveID3.setDataSource(dataMidApprove);
                    // multiUserApproveID3.refresh();
                    nextState = {
                        ...nextState,
                        UserApproveID: {
                            ...nextState.UserApproveID,
                            data: [...this.dataFirstApprove]
                        },
                        UserApproveID3: {
                            ...nextState.UserApproveID3,
                            data: [...this.dataMidApprove]
                        },
                        UserApproveID2: {
                            ...nextState.UserApproveID2,
                            data: [...this.dataLastApprove]
                        }
                    };
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
                        this.dataFirstApprove.push({ UserInfoName: result.SupervisorName, ID: result.SupervisorID });
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
                        this.dataLastApprove.push({
                            UserInfoName: result.HighSupervisorName,
                            ID: result.HighSupervisorID
                        });
                        //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
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
                    if (result.MidSupervisorID != null) {
                        this.dataMidApprove.push({
                            UserInfoName: result.SupervisorNextName,
                            ID: result.MidSupervisorID
                        });
                        //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                        //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                            },
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

                    if (result.IsChangeApprove != true) {
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
                if (result.FormularDurationType != '' && result.FormularDurationType != null) {
                    //set datasource cho duration type
                    this.IsFormulaDuration = true;
                    let dataSource = [],
                        str = result.FormularDurationType.split(',');

                    for (let i = 0; i < this.dataDurationType.length; i++) {
                        //chưa tìm được cách dịch enum khi gáng datasource mới nào nên làm cách củ chuối
                        if (str.indexOf(this.dataDurationType[i].Value) != -1) {
                            dataSource.push({
                                Text: this.dataDurationType[i].Text,
                                Value: this.dataDurationType[i].Value
                            });
                            this.dataFomulaDuration.push({
                                Text: this.dataDurationType[i].Text,
                                Value: this.dataDurationType[i].Value
                            });
                        }
                    }
                    // var ddlDurationType = $("#DurationType").data("kendoDropDownList");
                    // ddlDurationType.setDataSource(dataSource);
                    // ddlDurationType.refresh();
                    nextState = {
                        ...nextState,
                        Div_DurationType1: {
                            ...Div_DurationType1,
                            DurationType: {
                                ...DurationType,
                                data: [...dataSource],
                                refresh: !DurationType.refresh
                            }
                        }
                    };

                    let datasourceTypeHaltShift = [];
                    for (let i = 0; i < this.dataTypeHalfShift.length; i++) {
                        //chưa tìm được cách dịch enum khi gáng datasource mới nào nên làm cách củ chuối
                        if (str.indexOf(this.dataTypeHalfShift[i].Value) != -1) {
                            datasourceTypeHaltShift.push({
                                Text: this.dataTypeHalfShift[i].Text,
                                Value: this.dataTypeHalfShift[i].Value
                            });
                        }
                    }
                    // var ddlDurationType = $("#TypeHalfShift").data("kendoDropDownList");
                    // ddlDurationType.setDataSource(datasourceTypeHaltShift);
                    // ddlDurationType.refresh();
                    nextState = {
                        ...nextState,
                        Div_TypeHalfShift1: {
                            ...Div_TypeHalfShift1,
                            TypeHalfShift: {
                                ...TypeHalfShift,
                                data: [...datasourceTypeHaltShift],
                                refresh: !TypeHalfShift.refresh
                            }
                        }
                    };
                }

                this.LoadLeaveDayTypeByGrade();
            }

            nextState = {
                ...nextState,
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

    handleSetState = (record, resAll) => {
        const {
                Profile,
                DateStart,
                DateEnd,
                DecisionNo,
                LeaveDayTypeFull,
                LeaveDayTypeByGrade,
                Div_DurationType1,
                Div_TypeHalfShift1,
                divShift,
                Type,
                AddressIDIn,
                AddressIDOut,
                MissionPlaceOutID,
                PlaceOutFromID,
                MissionPlaceInID,
                PlaceInFromID,
                TravelWarrantID,
                Route,
                VehicleID,
                MissionDistanceID,
                NoNightStay,
                hasIsMeal,
                TypeOfServiceID,
                IsHaveCosts,
                BusinessReason,
                FileAttachment,
                UserApproveID,
                UserApproveID3,
                UserApproveID4,
                UserApproveID2,
                dataBusinessCost
            } = this.state,
            { LeaveDayTypeID } = LeaveDayTypeFull,
            { TempLeaveDayTypeID } = LeaveDayTypeByGrade,
            { DurationType, DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
            { LeaveDays } = DurationTypeFullShift,
            { HoursFrom, HoursTo, LeaveHoursDetail, LeaveHours } = OtherDurationType,
            { ConfigLeaveHoursDetail } = LeaveHoursDetail,
            { TypeHalfShift, divTypeHalfShiftContent } = Div_TypeHalfShift1,
            { divTypeHalfShiftLeaveDay, divTypeHalfShiftLeaveHours } = divTypeHalfShiftContent,
            { TypeHalfShiftLeaveDays } = divTypeHalfShiftLeaveDay,
            { TypeHalfShiftLeaveHours } = divTypeHalfShiftLeaveHours,
            { ShiftID } = divShift,
            { HaveMeal } = hasIsMeal,
            { E_IN, E_DOMESTIC, E_OUT } = Type,
            item = resAll[0][0],
            leaveDayDurationType = resAll[1],
            leaveDayType = resAll[2],
            dataUserApproveID = resAll[3],
            dataDurationType = resAll[4],
            dataTypeHalfShift = resAll[5],
            dataTempLeaveDayTypeID = resAll[6],
            isChangeLevelAprpoved = resAll[7],
            levelApprovedBusinessTravel = resAll[8],
            dataShift = resAll[9],
            datatMissionDistance = resAll[10],
            isBtnViewCost = PermissionForAppMobile['New_New_List_Travel_btnViewCostItem']
                ? PermissionForAppMobile['New_New_List_Travel_btnViewCostItem']['View']
                : false;

        if (leaveDayDurationType) {
            this.dataDurationType = [...leaveDayDurationType];
        }

        if (leaveDayType) {
            this.dataTypeHalfShift = [...leaveDayType];
        }

        let nextState = {},
            isGetConfigMiddleOfShift = false,
            dataLeaveHourDetail = item.lstLeaveHourDetail
                ? item.lstLeaveHourDetail.map(item => {
                    return { LeaveHoursDetail: item };
                })
                : [];

        nextState = {
            ID: record.ID,
            Profile: {
                ...Profile,
                ID: item.ProfileID,
                ProfileName: item.ProfileName
            },
            DateStart: {
                ...DateStart,
                value: item.DateStart ? moment(item.DateStart).format('YYYY-MM-DD HH:mm:ss') : null,
                refresh: !DateStart.refresh
            },
            DateEnd: {
                ...DateEnd,
                value: item.DateEnd ? moment(item.DateEnd).format('YYYY-MM-DD HH:mm:ss') : null,
                refresh: !DateEnd.refresh
            },
            DecisionNo: {
                ...DecisionNo,
                value: item.DecisionNo,
                refresh: !DecisionNo.refresh
            },
            LeaveDayTypeFull: {
                ...LeaveDayTypeFull,
                visible: true,
                LeaveDayTypeID: {
                    ...LeaveDayTypeID,
                    disable: true,
                    value: item.LeaveDayTypeID
                        ? { ID: item.LeaveDayTypeID, LeaveDayTypeName: item.LeaveDayTypeName }
                        : null,
                    refresh: !LeaveDayTypeID.refresh
                }
            },
            LeaveDayTypeByGrade: {
                ...LeaveDayTypeByGrade,
                TempLeaveDayTypeID: {
                    ...TempLeaveDayTypeID,
                    data: [...dataTempLeaveDayTypeID],
                    refresh: !TempLeaveDayTypeID.refresh
                }
            },
            Div_DurationType1: {
                ...Div_DurationType1,
                DurationType: {
                    ...DurationType,
                    data: [...dataDurationType],
                    value: item.DurationType ? { Text: item.DurationTypeView, Value: item.DurationType } : null,
                    refresh: !DurationType.refresh
                },
                DurationTypeDetail: {
                    ...DurationTypeDetail,
                    OtherDurationType: {
                        ...OtherDurationType,
                        LeaveHours: {
                            ...LeaveHours,
                            value: item.LeaveHours != null ? item.LeaveHours.toString() : null,
                            disable: true,
                            refresh: !LeaveHours.refresh
                        },
                        HoursFrom: {
                            ...HoursFrom,
                            value: item.HoursFrom ? moment(item.HoursFrom).format('YYYY-MM-DD') : null,
                            refresh: !HoursFrom.refresh
                        },
                        HoursTo: {
                            ...HoursTo,
                            value: item.HoursTo ? moment(item.HoursTo).format('YYYY-MM-DD') : null,
                            refresh: !HoursTo.refresh
                        },
                        LeaveHoursDetail: {
                            ...LeaveHoursDetail,
                            ConfigLeaveHoursDetail: {
                                ...ConfigLeaveHoursDetail,
                                data: dataLeaveHourDetail,
                                refresh: !ConfigLeaveHoursDetail.refresh
                            }
                        }
                    },
                    DurationTypeFullShift: {
                        ...DurationTypeFullShift,
                        LeaveDays: {
                            ...LeaveDays,
                            value: item.LeaveDays != null ? item.LeaveDays.toString() : null,
                            disable: true,
                            refresh: !LeaveDays.refresh
                        }
                    }
                }
            },
            Div_TypeHalfShift1: {
                ...Div_TypeHalfShift1,
                TypeHalfShift: {
                    ...TypeHalfShift,
                    data: [...dataTypeHalfShift],
                    value: item.TypeHalfShift ? { Text: item.TypeHalfShiftView, Value: item.TypeHalfShift } : null,
                    refresh: !TypeHalfShift.refresh
                },
                divTypeHalfShiftContent: {
                    ...divTypeHalfShiftContent,
                    divTypeHalfShiftLeaveDay: {
                        ...divTypeHalfShiftLeaveDay,
                        TypeHalfShiftLeaveDays: {
                            ...TypeHalfShiftLeaveDays,
                            disable: true,
                            value: item.TypeHalfShiftLeaveDays != null ? item.TypeHalfShiftLeaveDays.toString() : null,
                            refresh: !TypeHalfShiftLeaveDays.refresh
                        }
                    },
                    divTypeHalfShiftLeaveHours: {
                        ...divTypeHalfShiftLeaveHours,
                        TypeHalfShiftLeaveHours: {
                            ...TypeHalfShiftLeaveHours,
                            disable: true,
                            value:
                                item.TypeHalfShiftLeaveHours != null ? item.TypeHalfShiftLeaveHours.toString() : null,
                            refresh: !TypeHalfShiftLeaveHours.refresh
                        }
                    }
                }
            },
            divShift: {
                ...divShift,
                ShiftID: {
                    ...ShiftID,
                    data: [...dataShift],
                    value: item.ShiftID ? { ID: item.ShiftID, ShiftName: item.ShiftName } : null,
                    refresh: !ShiftID.refresh
                }
            },
            Type: {
                ...Type,
                value: item.Type,
                E_IN: {
                    ...E_IN,
                    value: item.Type == 'E_IN' ? true : false,
                    refresh: !E_IN.refresh
                },
                E_OUT: {
                    ...E_OUT,
                    value: item.Type == 'E_OUT' ? true : false,
                    refresh: !E_OUT.refresh
                },
                E_DOMESTIC: {
                    ...E_DOMESTIC,
                    value: item.Type == 'E_DOMESTIC' ? true : false,
                    refresh: !E_DOMESTIC.refresh
                }
            },
            AddressIDIn: {
                ...AddressIDIn
            },
            AddressIDOut: {
                ...AddressIDOut
            },
            MissionPlaceOutID: {
                ...MissionPlaceOutID,
                value: item.MissionPlaceOutID
                    ? { ID: item.MissionPlaceOutID, CountryName: item.MissionPlaceOutName }
                    : null,
                refresh: !MissionPlaceOutID.refresh
            },
            PlaceOutFromID: {
                ...PlaceOutFromID,
                value: item.PlaceOutFromID ? { ID: item.PlaceOutFromID, CountryName: item.PlaceOutFromName } : null,
                refresh: !PlaceOutFromID.refresh
            },
            MissionPlaceInID: {
                ...MissionPlaceInID,
                value: item.MissionPlaceInID
                    ? { ID: item.MissionPlaceInID, ProvinceName: item.MissionPlaceInName }
                    : null,
                refresh: !MissionPlaceInID.refresh
            },
            PlaceInFromID: {
                ...PlaceInFromID,
                value: item.PlaceInFromID ? { ID: item.PlaceInFromID, ProvinceName: item.PlaceInFromName } : null,
                refresh: !PlaceInFromID.refresh
            },
            TravelWarrantID: {
                ...TravelWarrantID,
                value: item.TravelWarrantID
                    ? { ID: item.TravelWarrantID, TravelWarrantName: item.TravelWarrantName }
                    : null,
                refresh: !TravelWarrantID.refresh
            },
            Route: {
                ...Route,
                value: item.Route,
                refresh: !Route.refresh
            },
            VehicleID: {
                ...VehicleID,
                value: item.VehicleID ? { ID: item.VehicleID, NameEntityName: item.VehicleName } : null,
                refresh: !VehicleID.refresh
            },
            MissionDistanceID: {
                ...MissionDistanceID,
                data: [...datatMissionDistance],
                value: item.MissionDistanceName
                    ? { ID: item.MissionDistanceID, MissionDistanceName: item.MissionDistanceName }
                    : null,
                refresh: !MissionDistanceID.refresh
            },
            NoNightStay: {
                ...NoNightStay,
                value: item.NoNightStay ? item.NoNightStay.toString() : null,
                refresh: !NoNightStay.refresh
            },
            TypeOfServiceID: {
                ...TypeOfServiceID,
                value: item.TypeOfServiceID
                    ? { ID: item.TypeOfServiceID, NameEntityName: item.TypeOfServiceName }
                    : null,
                refresh: !TypeOfServiceID.refresh
            },
            IsHaveCosts: {
                ...IsHaveCosts,
                value: item.IsHaveCosts,
                refresh: !IsHaveCosts.refresh
            },
            BusinessReason: {
                ...BusinessReason,
                value: item.BusinessReason,
                refresh: !BusinessReason.refresh
            },
            FileAttachment: {
                ...FileAttachment,
                value: item.lstFileAttach,
                refresh: !FileAttachment.refresh
            },
            UserApproveID: {
                ...UserApproveID,
                data: [...dataUserApproveID],
                value: item.UserApproveID ? { ID: item.UserApproveID2, UserInfoName: item.UserApproveName } : null,
                refresh: !UserApproveID.refresh
            },
            UserApproveID3: {
                ...UserApproveID3,
                data: [...dataUserApproveID],
                value: item.UserApproveID3 ? { ID: item.UserApproveID3, UserInfoName: item.UserApproveName3 } : null,
                refresh: !UserApproveID3.refresh
            },
            UserApproveID4: {
                ...UserApproveID4,
                data: [...dataUserApproveID],
                value: item.UserApproveID4 ? { ID: item.UserApproveID4, UserInfoName: item.UserApproveName4 } : null,
                refresh: !UserApproveID4.refresh
            },
            UserApproveID2: {
                ...UserApproveID2,
                data: [...dataUserApproveID],
                value: item.UserApproveID2 ? { ID: item.UserApproveID2, UserInfoName: item.UserApproveName2 } : null,
                refresh: !UserApproveID2.refresh
            },
            dataBusinessCost: {
                ...dataBusinessCost,
                isShowbtn: isBtnViewCost
            }
        };

        if (item.IsMeal) {
            let _splitValMeal = item.HaveMeal ? item.HaveMeal.split(',') : [],
                _valMeal = _splitValMeal.map(itemMeal => {
                    return { Value: itemMeal, Text: translate('HaveMealType__' + itemMeal) };
                });

            nextState = {
                ...nextState,
                hasIsMeal: {
                    ...hasIsMeal,
                    visible: true,
                    HaveMeal: {
                        ...HaveMeal,
                        value: _valMeal,
                        refresh: !HaveMeal.refresh
                    }
                }
            };
        }

        if (levelApprovedBusinessTravel) {
            this.levelApproveTrip = levelApprovedBusinessTravel;

            if (levelApprovedBusinessTravel == 4) {
                this.isOnlyOnleLevelApprove = false;
                // isShowEle('#divMidApprove', true);
                // isShowEle('#divMidNextApprove', true);
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
            } else if (levelApprovedBusinessTravel == 3) {
                this.isOnlyOnleLevelApprove = false;
                // isShowEle('#divMidApprove', true);
                // isShowEle('#divMidNextApprove');
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
            } else if (levelApprovedBusinessTravel == 1) {
                this.isOnlyOnleLevelApprove = true;
            } else {
                this.isOnlyOnleLevelApprove = false;
                // isShowEle('#divMidApprove');
                // isShowEle('#divMidNextApprove');
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
            }
        }

        if (isChangeLevelAprpoved) {
            if (isChangeLevelAprpoved.IsChangeApprove) {
                this.isChangeLevelBusinessApprove = true;
                // $('#UserApproveID').data('kendoComboBox').readonly(false);
                // $('#UserApproveID2').data('kendoComboBox').readonly(false);
                // $('#UserApproveID3').data('kendoComboBox').readonly(false);
                // $('#UserApproveID4').data('kendoComboBox').readonly(false);
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
                    },
                    UserApproveID4: {
                        ...nextState.UserApproveID4,
                        disable: false
                    }
                };
            } else {
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
        }

        if (item.TypeHalfShift) {
            nextState = {
                ...nextState,
                Div_TypeHalfShift1: {
                    ...nextState.Div_TypeHalfShift1,
                    visible: true,
                    divTypeHalfShiftContent: {
                        ...nextState.Div_TypeHalfShift1.divTypeHalfShiftContent,
                        visible: true
                    }
                },
                Div_DurationType1: {
                    ...nextState.Div_DurationType1,
                    visible: false
                }
            };
        }

        if (item.DurationType == 'E_FULLSHIFT') {
            nextState = {
                ...nextState,
                Div_DurationType1: {
                    ...nextState.Div_DurationType1,
                    DurationTypeDetail: {
                        ...nextState.Div_DurationType1.DurationTypeDetail,
                        visible: true,
                        OtherDurationType: {
                            ...nextState.Div_DurationType1.DurationTypeDetail.OtherDurationType,
                            visible: false
                        },
                        DurationTypeFullShift: {
                            ...nextState.Div_DurationType1.DurationTypeDetail.DurationTypeFullShift,
                            visible: true
                        }
                    }
                },
                Div_TypeHalfShift1: {
                    ...nextState.Div_TypeHalfShift1,
                    divTypeHalfShiftContent: {
                        ...nextState.Div_TypeHalfShift1.divTypeHalfShiftContent,
                        divTypeHalfShiftLeaveHours: {
                            ...nextState.Div_TypeHalfShift1.divTypeHalfShiftContent.divTypeHalfShiftLeaveHours,
                            visible: false
                        }
                    }
                }
            };
        } else {
            nextState = {
                ...nextState,
                Div_DurationType1: {
                    ...nextState.Div_DurationType1,
                    DurationTypeDetail: {
                        ...nextState.Div_DurationType1.DurationTypeDetail,
                        visible: true,
                        OtherDurationType: {
                            ...nextState.Div_DurationType1.DurationTypeDetail.OtherDurationType,
                            visible: true
                        },
                        DurationTypeFullShift: {
                            ...nextState.Div_DurationType1.DurationTypeDetail.DurationTypeFullShift,
                            visible: false
                        }
                    }
                }
            };

            if (item.DurationType == 'E_MIDDLEOFSHIFT' || item.DurationType == 'E_OUT_OF_SHIFT') {
                nextState = {
                    ...nextState,
                    Div_DurationType1: {
                        ...nextState.Div_DurationType1,
                        DurationTypeDetail: {
                            ...nextState.Div_DurationType1.DurationTypeDetail,
                            OtherDurationType: {
                                ...nextState.Div_DurationType1.DurationTypeDetail.OtherDurationType,
                                LeaveHours: {
                                    ...nextState.Div_DurationType1.DurationTypeDetail.OtherDurationType.LeaveHours,
                                    disable: true,
                                    refresh: !LeaveHours.refresh
                                },
                                HoursFrom: {
                                    ...nextState.Div_DurationType1.DurationTypeDetail.OtherDurationType.HoursFrom,
                                    disable: false,
                                    refresh: !HoursFrom.refresh
                                },
                                HoursTo: {
                                    ...nextState.Div_DurationType1.DurationTypeDetail.OtherDurationType.HoursTo,
                                    disable: false,
                                    refresh: !HoursTo.refresh
                                }
                            },
                            DurationTypeFullShift: {
                                ...nextState.Div_DurationType1.DurationTypeDetail.DurationTypeFullShift,
                                LeaveDays: {
                                    ...nextState.Div_DurationType1.DurationTypeDetail.DurationTypeFullShift.LeaveDays,
                                    disable: true,
                                    refresh: !LeaveDays.refresh
                                }
                            }
                        }
                    }
                };

                if (item.DurationType == 'E_MIDDLEOFSHIFT') {
                    //kiểm tra có cấu hình chọn giờ của loại nghỉ giữa ca
                    if (item.IsLeaveHoursDetail) {
                        let _valueConfig = null;
                        if (item['HoursFrom'] && item['HoursTo']) {
                            _valueConfig = {
                                LeaveHoursDetail:
                                    moment(item['HoursFrom']).format('HH:mm') +
                                    ' - ' +
                                    moment(item['HoursTo']).format('HH:mm')
                            };
                        }

                        nextState = {
                            ...nextState,
                            Div_DurationType1: {
                                ...nextState.Div_DurationType1,
                                DurationTypeDetail: {
                                    ...nextState.Div_DurationType1.DurationTypeDetail,
                                    OtherDurationType: {
                                        ...nextState.Div_DurationType1.DurationTypeDetail.OtherDurationType,
                                        LeaveHoursDetail: {
                                            ...nextState.Div_DurationType1.DurationTypeDetail.OtherDurationType
                                                .LeaveHoursDetail,
                                            visible: true,
                                            ConfigLeaveHoursDetail: {
                                                ...nextState.Div_DurationType1.DurationTypeDetail.OtherDurationType
                                                    .LeaveHoursDetail.ConfigLeaveHoursDetail,
                                                value: _valueConfig
                                            }
                                        },
                                        LeaveHours: {
                                            ...nextState.Div_DurationType1.DurationTypeDetail.OtherDurationType
                                                .LeaveHours,
                                            disable: true,
                                            refresh: !LeaveHours.refresh
                                        },
                                        HoursFrom: {
                                            ...nextState.Div_DurationType1.DurationTypeDetail.OtherDurationType
                                                .HoursFrom,
                                            disable: false,
                                            refresh: !HoursFrom.refresh
                                        },
                                        HoursTo: {
                                            ...nextState.Div_DurationType1.DurationTypeDetail.OtherDurationType.HoursTo,
                                            disable: false,
                                            refresh: !HoursTo.refresh
                                        }
                                    },
                                    DurationTypeFullShift: {
                                        ...nextState.Div_DurationType1.DurationTypeDetail.DurationTypeFullShift,
                                        LeaveDays: {
                                            ...nextState.Div_DurationType1.DurationTypeDetail.DurationTypeFullShift
                                                .LeaveDays,
                                            disable: true,
                                            refresh: !LeaveDays.refresh
                                        }
                                    }
                                }
                            }
                        };
                    }
                    //check có cấu hình DS số giờ nghỉ theo loại nghỉ giữa ca
                    else {
                        isGetConfigMiddleOfShift = true;
                    }
                }
            }
        }

        if (item.Type == 'E_IN') {
            nextState = {
                ...nextState,
                MissionPlaceInID: {
                    ...nextState.MissionPlaceInID,
                    visible: false,
                    refresh: !MissionPlaceInID.refresh
                },
                PlaceInFromID: {
                    ...nextState.PlaceInFromID,
                    visible: false,
                    refresh: !PlaceInFromID.refresh
                },
                MissionPlaceOutID: {
                    ...nextState.MissionPlaceOutID,
                    visible: false,
                    refresh: !MissionPlaceOutID.refresh
                },
                PlaceOutFromID: {
                    ...nextState.PlaceOutFromID,
                    visible: false,
                    refresh: !PlaceOutFromID.refresh
                },
                AddressIDIn: {
                    ...nextState.AddressIDIn,
                    visible: false,
                    refresh: !AddressIDIn.refresh
                },
                AddressIDOut: {
                    ...nextState.AddressIDOut,
                    visible: false,
                    refresh: !AddressIDOut.refresh
                }
            };
        } else if (item.Type == 'E_DOMESTIC') {
            nextState = {
                ...nextState,
                MissionPlaceInID: {
                    ...nextState.MissionPlaceInID,
                    visible: true,
                    refresh: !MissionPlaceInID.refresh
                },
                PlaceInFromID: {
                    ...nextState.PlaceInFromID,
                    visible: true,
                    refresh: !PlaceInFromID.refresh
                },
                MissionPlaceOutID: {
                    ...nextState.MissionPlaceOutID,
                    visible: false,
                    refresh: !MissionPlaceOutID.refresh
                },
                PlaceOutFromID: {
                    ...nextState.PlaceOutFromID,
                    visible: false,
                    refresh: !PlaceOutFromID.refresh
                },
                AddressIDIn: {
                    ...nextState.AddressIDIn,
                    visible: true,
                    value: item.AddressID ? { ID: item.AddressID, AddressVN: item.AddressVN } : null,
                    refresh: !AddressIDIn.refresh
                },
                AddressIDOut: {
                    ...nextState.AddressIDOut,
                    visible: false,
                    refresh: !AddressIDOut.refresh
                }
            };
        } else if (item.Type == 'E_OUT') {
            nextState = {
                ...nextState,
                MissionPlaceInID: {
                    ...nextState.MissionPlaceInID,
                    visible: false,
                    refresh: !MissionPlaceInID.refresh
                },
                PlaceInFromID: {
                    ...nextState.PlaceInFromID,
                    visible: false,
                    refresh: !PlaceInFromID.refresh
                },
                MissionPlaceOutID: {
                    ...nextState.MissionPlaceOutID,
                    visible: true,
                    refresh: !MissionPlaceOutID.refresh
                },
                PlaceOutFromID: {
                    ...nextState.PlaceOutFromID,
                    visible: true,
                    refresh: !PlaceOutFromID.refresh
                },
                AddressIDIn: {
                    ...nextState.AddressIDIn,
                    visible: false,
                    refresh: !AddressIDIn.refresh
                },
                AddressIDOut: {
                    ...nextState.AddressIDOut,
                    visible: true,
                    value: item.AddressID ? { ID: item.AddressID, AddressVN: item.AddressVN } : null,
                    refresh: !AddressIDOut.refresh
                }
            };
        }

        this.setState(nextState, () => {
            if (isGetConfigMiddleOfShift) {
                this.readOnlyCtrlBT(false, () =>
                    this.SelectMiddleOfShift(item.LeaveDayTypeID, 'E_MIDDLEOFSHIFT', item.LeaveHours, null)
                );
            } else {
                this.readOnlyCtrlBT(false);
            }

            if (item.VehicleID) {
                this.loadDistanceByVehicle(item.VehicleID);
            }
        });
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        const { ID, DateStart, NoNightStay, VehicleID, Type, LeaveDays, LeaveDayTypeID, DurationType } = record,
            profileID = profileInfo['ProfileID'];

        VnrLoadingSevices.show();
        HttpService.MultiRequest([
            HttpService.Get(
                '[URI_POR]/Att_Leaveday/New_Edit?id=' + ID + '&profileID=' + profileID + '&_isPortalApp=' + true
            ),
            //this.dataDurationType
            HttpService.Post('[URI_HR]/Sys_GetEnumData/GetEnum', { text: 'LeaveDayDurationType' }),
            //this.dataTypeHalfShift
            HttpService.Post('[URI_HR]/Sys_GetEnumData/GetEnum', { text: 'LeaveDayType' }),
            //UserApproveID
            HttpService.Get('[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_LEAVE_DAY_BUSINESSTRAVEL'),
            //DurationType
            HttpService.Get('[URI_POR]/New_Att_Leaveday/GetMultiDurationType'),
            //TypeHalfShift
            HttpService.Get('[URI_POR]/New_Att_Overtime/GetMultiTypeHalfShift'),
            //TempLeaveDayTypeID
            HttpService.Get('[URI_POR]/New_Att_Overtime/GetMultiDurationType'),
            //IsChangeLevelAprpoved
            HttpService.Post('[URI_HR]/Att_GetData/GetHighSupervisor', {
                ProfileID: profileID,
                userSubmit: profileID,
                type: 'E_LEAVE_DAY_BUSINESSTRAVEL',
                missionPlaceType: null
            }),
            HttpService.Post('[URI_HR]/Att_GetData/GetLevelApprovedBusinessTravel', {
                ProfileID: profileID,
                DateStart: moment(DateStart).format('YYYY-MM-DD 00:00:00'),
                LeaveDays: LeaveDays,
                DurationType: DurationType,
                LeaveDayTypeID: LeaveDayTypeID,
                NoNightStay: NoNightStay,
                VehicleID: VehicleID,
                missionPlaceType: Type
            }),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiShift'),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMissionDistanceMulti')
        ]).then(resAll => {
            VnrLoadingSevices.hide();
            try {
                if (resAll) {
                    _handleSetState(record, resAll);
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 5000);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };
    //#endregion

    //#region [function xử lý nghiệp vụ]
    SelectMiddleOfShift = (leaveDayTypeID, type) => {
        if (leaveDayTypeID && type == 'E_MIDDLEOFSHIFT') {
            VnrLoadingSevices.show();
            HttpService.Get('[URI_HR]/Att_GetData/GetConfigMiddleOfShift?LeaveDayTypeID=' + leaveDayTypeID).then(
                data => {
                    VnrLoadingSevices.hide();
                    try {
                        if (data) {
                            const { Div_DurationType1 } = this.state,
                                { DurationTypeDetail } = Div_DurationType1,
                                { OtherDurationType } = DurationTypeDetail,
                                { LeaveHoursDetail, divHoursMiddleOfShift, divLeaveHours } = OtherDurationType,
                                { HoursMiddleOfShift } = divHoursMiddleOfShift,
                                { HoursTo } = OtherDurationType;

                            let nextState = {},
                                hoursConfig = data.split(','),
                                arrHoursConfig = [];

                            for (let i = 0; i < hoursConfig.length; i++) {
                                arrHoursConfig.push({ Text: hoursConfig[i], Value: hoursConfig[i] });
                            }

                            nextState = {
                                Div_DurationType1: {
                                    ...Div_DurationType1,
                                    DurationTypeDetail: {
                                        ...DurationTypeDetail,
                                        OtherDurationType: {
                                            ...OtherDurationType,
                                            divHoursMiddleOfShift: {
                                                ...divHoursMiddleOfShift,
                                                visible: true,
                                                HoursMiddleOfShift: {
                                                    ...HoursMiddleOfShift,
                                                    data: [...arrHoursConfig],
                                                    refresh: !HoursMiddleOfShift.refresh
                                                }
                                            },
                                            LeaveHoursDetail: {
                                                ...LeaveHoursDetail,
                                                visible: false
                                            },
                                            divLeaveHours: {
                                                ...divLeaveHours,
                                                visible: false
                                            },
                                            HoursTo: {
                                                ...HoursTo,
                                                visible: true
                                            }
                                        }
                                    }
                                }
                            };

                            this.setState(nextState);
                        } else {
                            const { Div_DurationType1 } = this.state,
                                { DurationTypeDetail } = Div_DurationType1,
                                { OtherDurationType } = DurationTypeDetail,
                                { LeaveHoursDetail, divHoursMiddleOfShift, divLeaveHours } = OtherDurationType,
                                { HoursTo } = OtherDurationType;

                            let nextState = {
                                Div_DurationType1: {
                                    ...Div_DurationType1,
                                    DurationTypeDetail: {
                                        ...DurationTypeDetail,
                                        OtherDurationType: {
                                            ...OtherDurationType,
                                            divHoursMiddleOfShift: {
                                                ...divHoursMiddleOfShift,
                                                visible: false
                                            },
                                            LeaveHoursDetail: {
                                                ...LeaveHoursDetail,
                                                visible: false
                                            },
                                            divLeaveHours: {
                                                ...divLeaveHours,
                                                visible: true
                                            },
                                            HoursTo: {
                                                ...HoursTo,
                                                disable: false
                                            }
                                        }
                                    }
                                }
                            };
                            this.setState(nextState);
                        }
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                }
            );
        }
    };

    onChangeType = value => {
        this.GetHighSupervior();

        const {
            MissionPlaceInID,
            MissionPlaceOutID,
            PlaceInFromID,
            PlaceOutFromID,
            AddressIDIn,
            AddressIDOut
        } = this.state;

        let nextState = {
            MissionPlaceInID: {
                ...MissionPlaceInID,
                value: null,
                refresh: !MissionPlaceInID.refresh
            },
            PlaceInFromID: {
                ...PlaceInFromID,
                value: null,
                refresh: !PlaceInFromID.refresh
            },
            MissionPlaceOutID: {
                ...MissionPlaceOutID,
                value: null,
                refresh: !MissionPlaceOutID.refresh
            },
            PlaceOutFromID: {
                ...PlaceOutFromID,
                value: null,
                refresh: !PlaceOutFromID.refresh
            },
            AddressIDIn: {
                ...AddressIDIn,
                value: null,
                refresh: !AddressIDIn.refresh
            },
            AddressIDOut: {
                ...AddressIDOut,
                value: null,
                refresh: !AddressIDOut.refresh
            }
        };

        if (value == 'E_IN') {
            nextState = {
                ...nextState,
                MissionPlaceInID: {
                    ...nextState.MissionPlaceInID,
                    visible: false,
                    value: null,
                    refresh: !MissionPlaceInID.refresh
                },
                PlaceInFromID: {
                    ...nextState.PlaceInFromID,
                    visible: false,
                    value: null,
                    refresh: !PlaceInFromID.refresh
                },
                MissionPlaceOutID: {
                    ...nextState.MissionPlaceOutID,
                    visible: false,
                    value: null,
                    refresh: !MissionPlaceOutID.refresh
                },
                PlaceOutFromID: {
                    ...nextState.PlaceOutFromID,
                    visible: false,
                    value: null,
                    refresh: !PlaceOutFromID.refresh
                },
                AddressIDIn: {
                    ...AddressIDIn,
                    visible: false,
                    value: null,
                    refresh: !AddressIDIn.refresh
                },
                AddressIDOut: {
                    ...AddressIDOut,
                    visible: false,
                    value: null,
                    refresh: !AddressIDOut.refresh
                }
            };
        } else if (value == 'E_DOMESTIC') {
            nextState = {
                ...nextState,
                MissionPlaceInID: {
                    ...nextState.MissionPlaceInID,
                    visible: true,
                    refresh: !MissionPlaceInID.refresh
                },
                PlaceInFromID: {
                    ...nextState.PlaceInFromID,
                    visible: true,
                    refresh: !PlaceInFromID.refresh
                },
                MissionPlaceOutID: {
                    ...nextState.MissionPlaceOutID,
                    visible: false,
                    refresh: !MissionPlaceOutID.refresh
                },
                PlaceOutFromID: {
                    ...nextState.PlaceOutFromID,
                    visible: false,
                    refresh: !PlaceOutFromID.refresh
                },
                AddressIDIn: {
                    ...AddressIDIn,
                    visible: true,
                    value: null,
                    refresh: !AddressIDIn.refresh
                },
                AddressIDOut: {
                    ...AddressIDOut,
                    visible: false,
                    value: null,
                    refresh: !AddressIDOut.refresh
                }
            };
        } else if (value == 'E_OUT') {
            nextState = {
                ...nextState,
                MissionPlaceInID: {
                    ...nextState.MissionPlaceInID,
                    visible: false,
                    refresh: !MissionPlaceInID.refresh
                },
                PlaceInFromID: {
                    ...nextState.PlaceInFromID,
                    visible: false,
                    refresh: !PlaceInFromID.refresh
                },
                MissionPlaceOutID: {
                    ...nextState.MissionPlaceOutID,
                    visible: true,
                    refresh: !MissionPlaceOutID.refresh
                },
                PlaceOutFromID: {
                    ...nextState.PlaceOutFromID,
                    visible: true,
                    refresh: !PlaceOutFromID.refresh
                },
                AddressIDIn: {
                    ...AddressIDIn,
                    visible: false,
                    value: null,
                    refresh: !AddressIDIn.refresh
                },
                AddressIDOut: {
                    ...AddressIDOut,
                    visible: true,
                    value: null,
                    refresh: !AddressIDOut.refresh
                }
            };
        }

        this.setState(nextState);
    };

    ComputeTypeHalfShift = ShiftType => {
        const { Div_TypeHalfShift1, Div_DurationType1 } = this.state,
            { TypeHalfShift, divTypeHalfShiftContent } = Div_TypeHalfShift1,
            { divTypeHalfShiftLeaveHours } = divTypeHalfShiftContent,
            { DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
            { LeaveHours } = OtherDurationType,
            { LeaveDays } = DurationTypeFullShift;

        let nextState = {};

        //ẩn/hiện số giờ nghỉ theo task 0099424
        if (TypeHalfShift.value && TypeHalfShift.value.Value == 'E_FULLSHIFT') {
            //isShowEle('#divTypeHalfShiftLeaveHours');
            nextState = {
                Div_TypeHalfShift1: {
                    ...Div_TypeHalfShift1,
                    divTypeHalfShiftContent: {
                        ...divTypeHalfShiftContent,
                        divTypeHalfShiftLeaveHours: {
                            ...divTypeHalfShiftLeaveHours,
                            visible: false
                        }
                    }
                }
            };
        } else {
            //isShowEle('#divTypeHalfShiftLeaveHours', true);
            nextState = {
                Div_TypeHalfShift1: {
                    ...Div_TypeHalfShift1,
                    divTypeHalfShiftContent: {
                        ...divTypeHalfShiftContent,
                        divTypeHalfShiftLeaveHours: {
                            ...divTypeHalfShiftLeaveHours,
                            visible: true
                        }
                    }
                }
            };
        }

        nextState = {
            ...nextState,
            Div_DurationType1: {
                ...Div_DurationType1,
                DurationTypeDetail: {
                    ...DurationTypeDetail,
                    OtherDurationType: {
                        ...OtherDurationType,
                        LeaveHours: {
                            ...LeaveHours,
                            value: '0',
                            refresh: !LeaveHours.refresh
                        }
                    },
                    DurationTypeFullShift: {
                        ...DurationTypeFullShift,
                        LeaveDays: {
                            ...LeaveDays,
                            value: '0',
                            refresh: !LeaveDays.refresh
                        }
                    }
                }
            }
        };

        this.setState(nextState, () => {
            const {
                    Div_TypeHalfShift1,
                    DateStart,
                    DateEnd,
                    Profile,
                    Div_DurationType1,
                    LeaveDayTypeFull,
                    LeaveDayTypeByGrade,
                    VehicleID,
                    NoNightStay,
                    divShift,
                    UserApproveID,
                    UserApproveID2,
                    UserApproveID3,
                    UserApproveID4
                } = this.state,
                { TypeHalfShift, divTypeHalfShiftContent } = Div_TypeHalfShift1,
                { divTypeHalfShiftLeaveDay, divTypeHalfShiftLeaveHours } = divTypeHalfShiftContent,
                { TypeHalfShiftLeaveDays } = divTypeHalfShiftLeaveDay,
                { TypeHalfShiftLeaveHours } = divTypeHalfShiftLeaveHours,
                { DurationTypeDetail, DurationType } = Div_DurationType1,
                { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
                { LeaveHours } = OtherDurationType,
                { LeaveDays } = DurationTypeFullShift,
                { LeaveDayTypeID } = LeaveDayTypeFull,
                { TempLeaveDayTypeID } = LeaveDayTypeByGrade;

            let dateStart = DateStart.value,
                dateEnd = DateEnd.value;

            if (dateStart && dateEnd) {
                let dateStartNew = dateStart ? moment(dateStart).format('YYYY-MM-DD HH:mm:ss') : null,
                    dateEndNew = dateEnd ? moment(dateEnd).format('YYYY-MM-DD HH:mm:ss') : null,
                    leavedayId = LeaveDayTypeID.value
                        ? LeaveDayTypeID.value.ID
                        : TempLeaveDayTypeID.value
                            ? TempLeaveDayTypeID.value.ID
                            : null,
                    profileId = Profile.ID;

                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Att_GetData/GetRosterForCheckTypeHalfShift', {
                    profileId: profileId,
                    dateStart: dateStartNew,
                    dateEnd: dateEndNew,
                    ShiftType: ShiftType,
                    LeaveDayTypeID: leavedayId,
                    Vehicle: VehicleID.value ? VehicleID.value.ID : null,
                    userSubmit: profileId,
                    noNightStay: NoNightStay.value,
                    IsTrip: true
                }).then(data => {
                    VnrLoadingSevices.hide();

                    if (typeof data != 'object' && data.indexOf('InValidDate') >= 0) {
                        ToasterSevice.showWarning('HRM_Chose_From_Calendar');
                    } else {
                        let nextState = {
                            divShift: {
                                ...divShift,
                                visible: false
                            }
                        };

                        if (data.Messages != null) {
                            ToasterSevice.showWarning(data.Messages);

                            if (data.isNonShift == true) {
                                // var ddlDurationType = $("#DurationType").data("kendoDropDownList");
                                let dataSourceDurationType = [];
                                dataSourceDurationType.push({ Text: 'E_FULLSHIFT', Value: 'E_FULLSHIFT' });
                                dataSourceDurationType.push({
                                    Text: 'E_MIDDLEOFSHIFT',
                                    Value: 'E_MIDDLEOFSHIFT'
                                });
                                // ddlDurationType.setDataSource(dataSourceDurationType);
                                // ddlDurationType.refresh();
                                // Loading(false);

                                nextState = {
                                    ...nextState,
                                    Div_DurationType1: {
                                        ...Div_DurationType1,
                                        DurationType: {
                                            ...DurationType,
                                            data: [...dataSourceDurationType],
                                            refresh: !DurationType.refresh
                                        }
                                    }
                                };
                            } else {
                                let dataSourceDurationTypeFull = [];

                                //var ddlDurationType = $("#DurationType").data("kendoDropDownList");
                                dataSourceDurationTypeFull.push({
                                    Text: 'E_FULLSHIFT',
                                    Value: 'E_FULLSHIFT'
                                });
                                dataSourceDurationTypeFull.push({
                                    Text: 'E_MIDDLEOFSHIFT',
                                    Value: 'E_MIDDLEOFSHIFT'
                                });
                                dataSourceDurationTypeFull.push({
                                    Text: 'E_LASTHALFSHIFT',
                                    Value: 'E_LASTHALFSHIFT'
                                });
                                dataSourceDurationTypeFull.push({
                                    Text: 'E_FIRSTHALFSHIFT',
                                    Value: 'E_FIRSTHALFSHIFT'
                                });
                                dataSourceDurationTypeFull.push({
                                    Text: 'E_OUT_OF_SHIFT',
                                    Value: 'E_OUT_OF_SHIFT'
                                });

                                // ddlDurationType.setDataSource(dataSourceDurationTypeFull);
                                // ddlDurationType.refresh();
                                // Loading(false);
                                nextState = {
                                    ...nextState,
                                    Div_DurationType1: {
                                        ...Div_DurationType1,
                                        DurationType: {
                                            ...DurationType,
                                            data: [...dataSourceDurationTypeFull],
                                            refresh: !DurationType.refresh
                                        }
                                    }
                                };
                            }

                            this.setState(nextState);
                        } else {
                            nextState = {
                                ...nextState,
                                // BusinessReason: {
                                //   ...BusinessReason,
                                //   visible: data.IsWorkDay ? true : false
                                // },
                                UserApproveID: {
                                    ...UserApproveID
                                },
                                UserApproveID2: {
                                    ...UserApproveID2
                                },
                                UserApproveID3: {
                                    ...UserApproveID3
                                },
                                UserApproveID4: {
                                    ...UserApproveID4
                                }
                            };

                            if (data.IsCatApproveGrade) {
                                this.IsCheckingLevel = true;

                                if (data.LevelApprove == 2) {
                                    if (data.SupervisorID != null) {
                                        nextState = {
                                            ...nextState,
                                            UserApproveID: {
                                                ...nextState.UserApproveID,
                                                value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID },
                                                refresh: UserApproveID.refresh
                                            }
                                        };
                                    }

                                    if (data.MidSupervisorID != null) {
                                        nextState = {
                                            ...nextState,
                                            UserApproveID2: {
                                                ...nextState.UserApproveID2,
                                                value: {
                                                    UserInfoName: data.SupervisorNextName,
                                                    ID: data.MidSupervisorID
                                                },
                                                refresh: UserApproveID2.refresh
                                            },
                                            UserApproveID3: {
                                                ...nextState.UserApproveID3,
                                                value: {
                                                    UserInfoName: data.SupervisorNextName,
                                                    ID: data.MidSupervisorID
                                                },
                                                refresh: UserApproveID3.refresh
                                            },
                                            UserApproveID4: {
                                                ...nextState.UserApproveID4,
                                                value: {
                                                    UserInfoName: data.SupervisorNextName,
                                                    ID: data.MidSupervisorID
                                                },
                                                refresh: UserApproveID4.refresh
                                            }
                                        };
                                    }

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
                                } else if (data.LevelApprove == 3) {
                                    if (data.SupervisorID != null) {
                                        nextState = {
                                            ...nextState,
                                            UserApproveID: {
                                                ...nextState.UserApproveID,
                                                value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID },
                                                refresh: UserApproveID.refresh
                                            }
                                        };
                                    }
                                    if (data.MidSupervisorID != null) {
                                        nextState = {
                                            ...nextState,
                                            UserApproveID3: {
                                                ...nextState.UserApproveID3,
                                                value: {
                                                    UserInfoName: data.SupervisorNextName,
                                                    ID: data.MidSupervisorID
                                                },
                                                refresh: UserApproveID3.refresh
                                            }
                                        };
                                    }
                                    if (data.NextMidSupervisorID != null) {
                                        nextState = {
                                            ...nextState,
                                            UserApproveID2: {
                                                ...nextState.UserApproveID2,
                                                value: {
                                                    UserInfoName: data.NextMidSupervisorName,
                                                    ID: data.NextMidSupervisorID
                                                },
                                                refresh: UserApproveID2.refresh
                                            },
                                            UserApproveID4: {
                                                ...nextState.UserApproveID4,
                                                value: {
                                                    UserInfoName: data.NextMidSupervisorName,
                                                    ID: data.NextMidSupervisorID
                                                },
                                                refresh: UserApproveID4.refresh
                                            }
                                        };
                                    }
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
                                } else if (data.LevelApprove == 4) {
                                    if (data.SupervisorID != null) {
                                        nextState = {
                                            ...nextState,
                                            UserApproveID: {
                                                ...nextState.UserApproveID,
                                                value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID },
                                                refresh: UserApproveID.refresh
                                            }
                                        };
                                    }
                                    if (data.MidSupervisorID != null) {
                                        nextState = {
                                            ...nextState,
                                            UserApproveID3: {
                                                ...nextState.UserApproveID3,
                                                value: {
                                                    UserInfoName: data.SupervisorNextName,
                                                    ID: data.MidSupervisorID
                                                },
                                                refresh: UserApproveID3.refresh
                                            }
                                        };
                                    }
                                    if (data.NextMidSupervisorID != null) {
                                        nextState = {
                                            ...nextState,
                                            UserApproveID4: {
                                                ...nextState.UserApproveID4,
                                                value: {
                                                    UserInfoName: data.NextMidSupervisorName,
                                                    ID: data.NextMidSupervisorID
                                                },
                                                refresh: UserApproveID4.refresh
                                            }
                                        };
                                    }
                                    if (data.HighSupervisorID != null) {
                                        nextState = {
                                            ...nextState,
                                            UserApproveID2: {
                                                ...nextState.UserApproveID2,
                                                value: {
                                                    UserInfoName: data.HighSupervisorName,
                                                    ID: data.HighSupervisorID
                                                },
                                                refresh: UserApproveID2.refresh
                                            }
                                        };
                                    }
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
                                } else if (data.LevelApprove == 1) {
                                    if (data.SupervisorID != null) {
                                        nextState = {
                                            ...nextState,
                                            UserApproveID: {
                                                ...nextState.UserApproveID,
                                                value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID },
                                                refresh: !UserApproveID.refresh
                                            },
                                            UserApproveID2: {
                                                ...nextState.UserApproveID2,
                                                value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID },
                                                refresh: !UserApproveID2.refresh
                                            },
                                            UserApproveID3: {
                                                ...nextState.UserApproveID3,
                                                value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID },
                                                refresh: !UserApproveID3.refresh
                                            },
                                            UserApproveID4: {
                                                ...nextState.UserApproveID4,
                                                value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID },
                                                refresh: !UserApproveID4.refresh
                                            }
                                        };
                                    }

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
                                }
                            } else if (data.LevelApprove == 3) {
                                nextState = {
                                    ...nextState,
                                    UserApproveID3: {
                                        ...nextState.UserApproveID3,
                                        visible: true,
                                        refresh: !UserApproveID3.refresh
                                    },
                                    UserApproveID4: {
                                        ...nextState.UserApproveID4,
                                        visible: false,
                                        refresh: !UserApproveID4.refresh
                                    }
                                };

                                //duyệt 1
                                if (this.dataFirstApprove[0]) {
                                    nextState = {
                                        ...nextState,
                                        UserApproveID: {
                                            ...UserApproveID,
                                            value: this.dataFirstApprove[0],
                                            refresh: !UserApproveID.refresh
                                        }
                                    };
                                }
                                //duyệt giữa
                                if (this.dataMidApprove[0]) {
                                    nextState = {
                                        ...nextState,
                                        UserApproveID3: {
                                            ...UserApproveID3,
                                            value: this.dataMidApprove[0],
                                            refresh: !UserApproveID3.refresh
                                        }
                                    };
                                }

                                //duyệt tiếp theo
                                if (this.dataLastApprove[0]) {
                                    nextState = {
                                        ...nextState,
                                        UserApproveID4: {
                                            ...UserApproveID4,
                                            value: this.dataLastApprove[0],
                                            refresh: !UserApproveID4.refresh
                                        }
                                    };
                                }
                                //duyệt cuối
                                if (this.dataLastApprove[0]) {
                                    nextState = {
                                        ...nextState,
                                        UserApproveID2: {
                                            ...UserApproveID2,
                                            value: this.dataLastApprove[0],
                                            refresh: !UserApproveID2.refresh
                                        }
                                    };
                                }
                                this.IsCheckingLevel = true;
                            } else if (data.LevelApprove == 1) {
                                this.isOnlyOnleLevelApprove = true;

                                if (this.dataFirstApprove.length > 0) {
                                    nextState = {
                                        ...nextState,
                                        UserApproveID: {
                                            ...nextState.UserApproveID,
                                            value: this.dataFirstApprove[0],
                                            refresh: !UserApproveID.refresh
                                        },
                                        UserApproveID2: {
                                            ...nextState.UserApproveID2,
                                            value: this.dataFirstApprove[0],
                                            refresh: !UserApproveID2.refresh
                                        },
                                        UserApproveID3: {
                                            ...nextState.UserApproveID3,
                                            value: this.dataFirstApprove[0],
                                            refresh: !UserApproveID3.refresh
                                        },
                                        UserApproveID4: {
                                            ...nextState.UserApproveID4,
                                            value: this.dataFirstApprove[0],
                                            refresh: !UserApproveID4.refresh
                                        }
                                    };
                                }
                            } else {
                                if (this.dataFirstApprove.length > 0) {
                                    nextState = {
                                        ...nextState,
                                        UserApproveID: {
                                            ...nextState.UserApproveID,
                                            value: this.dataFirstApprove[0],
                                            refresh: !UserApproveID.refresh
                                        }
                                    };
                                }
                                if (this.dataMidApprove.length > 0) {
                                    //set cho duyệt cuối
                                    if (this.dataMidApprove[0]) {
                                        nextState = {
                                            ...nextState,
                                            UserApproveID2: {
                                                ...nextState.UserApproveID2,
                                                value: this.dataMidApprove[0],
                                                refresh: !UserApproveID2.refresh
                                            },
                                            UserApproveID3: {
                                                ...nextState.UserApproveID3,
                                                value: this.dataMidApprove[0],
                                                refresh: !UserApproveID3.refresh
                                            },
                                            UserApproveID4: {
                                                ...nextState.UserApproveID4,
                                                value: this.dataMidApprove[0],
                                                refresh: !UserApproveID4.refresh
                                            }
                                        };
                                    }
                                } else if (this.dataLastApprove[0]) {
                                    nextState = {
                                        ...nextState,
                                        UserApproveID2: {
                                            ...nextState.UserApproveID2,
                                            value: this.dataLastApprove[0],
                                            refresh: !UserApproveID2.refresh
                                        },
                                        UserApproveID3: {
                                            ...nextState.UserApproveID3,
                                            value: this.dataLastApprove[0],
                                            refresh: !UserApproveID3.refresh
                                        },
                                        UserApproveID4: {
                                            ...nextState.UserApproveID4,
                                            value: this.dataLastApprove[0],
                                            refresh: !UserApproveID4.refresh
                                        }
                                    };
                                }
                                nextState = {
                                    ...nextState,
                                    UserApproveID3: {
                                        ...nextState.UserApproveID3,
                                        visible: false,
                                        refresh: !UserApproveID3.refresh
                                    }
                                };
                                this.IsCheckingLevel = false;
                            }

                            //[Tin.Nguyen - 20151204] Kiểm tra trong chế độ công của nv nếu có công thức loại ngày nghỉ thì sẽ set vao duration
                            if (this.IsFormulaDuration) {
                                if (this.dataFomulaDuration.length) {
                                    nextState = {
                                        ...nextState,
                                        Div_DurationType1: {
                                            ...Div_DurationType1,
                                            DurationType: {
                                                ...DurationType,
                                                data: [...this.dataFomulaDuration],
                                                refresh: !DurationType.refresh
                                            }
                                        },
                                        Div_TypeHalfShift1: {
                                            ...Div_TypeHalfShift1,
                                            TypeHalfShift: {
                                                ...TypeHalfShift,
                                                data: [...this.dataFomulaDuration],
                                                refresh: !TypeHalfShift.refresh
                                            }
                                        }
                                    };
                                }
                            } else {
                                if (data.ExcludeDurationType != null) {
                                    let dataSource = [],
                                        str = data.ExcludeDurationType.split(',');

                                    for (let i = 0; i < this.dataDurationType.length; i++) {
                                        //chưa tìm được cách dịch enum khi gáng datasource mới nào nên làm cách củ chuối
                                        if (str.indexOf(this.dataDurationType[i].Value) == -1)
                                            dataSource.push({
                                                Text: this.dataDurationType[i].Text,
                                                Value: this.dataDurationType[i].Value
                                            });
                                    }
                                    nextState = {
                                        ...nextState,
                                        Div_DurationType1: {
                                            ...Div_DurationType1,
                                            DurationType: {
                                                ...DurationType,
                                                data: [...dataSource],
                                                refresh: !DurationType.refresh
                                            }
                                        }
                                    };
                                } else {
                                    nextState = {
                                        ...nextState,
                                        Div_DurationType1: {
                                            ...Div_DurationType1,
                                            DurationType: {
                                                ...DurationType,
                                                data: [...this.dataDurationType],
                                                refresh: !DurationType.refresh
                                            }
                                        }
                                    };
                                }

                                if (data.isNonShift == true) {
                                    let dataSourceDurationType = [];

                                    dataSourceDurationType.push({
                                        Text: 'E_FULLSHIFT',
                                        Value: 'E_FULLSHIFT'
                                    });
                                    dataSourceDurationType.push({
                                        Text: 'E_MIDDLEOFSHIFT',
                                        Value: 'E_MIDDLEOFSHIFT'
                                    });
                                    nextState = {
                                        ...nextState,
                                        Div_DurationType1: {
                                            ...Div_DurationType1,
                                            DurationType: {
                                                ...DurationType,
                                                data: [...dataSourceDurationType],
                                                refresh: !DurationType.refresh
                                            }
                                        }
                                    };
                                } else {
                                    let dataSourceDurationTypeFull = [];

                                    dataSourceDurationTypeFull.push({
                                        Text: 'E_FULLSHIFT',
                                        Value: 'E_FULLSHIFT'
                                    });
                                    dataSourceDurationTypeFull.push({
                                        Text: 'E_MIDDLEOFSHIFT',
                                        Value: 'E_MIDDLEOFSHIFT'
                                    });
                                    dataSourceDurationTypeFull.push({
                                        Text: 'E_LASTHALFSHIFT',
                                        Value: 'E_LASTHALFSHIFT'
                                    });
                                    dataSourceDurationTypeFull.push({
                                        Text: 'E_FIRSTHALFSHIFT',
                                        Value: 'E_FIRSTHALFSHIFT'
                                    });
                                    dataSourceDurationTypeFull.push({
                                        Text: 'E_OUT_OF_SHIFT',
                                        Value: 'E_OUT_OF_SHIFT'
                                    });

                                    nextState = {
                                        ...nextState,
                                        Div_DurationType1: {
                                            ...Div_DurationType1,
                                            DurationType: {
                                                ...DurationType,
                                                data: [...dataSourceDurationTypeFull],
                                                refresh: !DurationType.refresh
                                            }
                                        }
                                    };
                                }

                                if (data.ExcludeTypeHalfShift != null) {
                                    let dataSourceTypeHalfShift = [],
                                        str = data.ExcludeTypeHalfShift.split(',');

                                    for (let i = 0; i < this.dataTypeHalfShift.length; i++) {
                                        //chưa tìm được cách dịch enum khi gáng datasource mới nào nên làm cách củ chuối
                                        if (str.indexOf(this.dataTypeHalfShift[i].Value) == -1)
                                            dataSourceTypeHalfShift.push({
                                                Text: this.dataTypeHalfShift[i].Text,
                                                Value: this.dataTypeHalfShift[i].Value
                                            });
                                    }

                                    nextState = {
                                        ...nextState,
                                        Div_TypeHalfShift1: {
                                            ...Div_TypeHalfShift1,
                                            TypeHalfShift: {
                                                ...TypeHalfShift,
                                                data: [...dataSourceTypeHalfShift],
                                                refresh: !TypeHalfShift.refresh
                                            }
                                        }
                                    };
                                } else {
                                    nextState = {
                                        ...nextState,
                                        Div_TypeHalfShift1: {
                                            ...Div_TypeHalfShift1,
                                            TypeHalfShift: {
                                                ...TypeHalfShift,
                                                data: [...this.dataTypeHalfShift],
                                                refresh: !TypeHalfShift.refresh
                                            }
                                        }
                                    };
                                }
                            }

                            nextState = {
                                ...nextState,
                                Div_DurationType1: {
                                    ...nextState.Div_DurationType1,
                                    DurationTypeDetail: {
                                        ...nextState.Div_DurationType1.DurationTypeDetail,
                                        OtherDurationType: {
                                            ...nextState.Div_DurationType1.DurationTypeDetail.OtherDurationType,
                                            LeaveHours: {
                                                ...nextState.Div_DurationType1.DurationTypeDetail.OtherDurationType
                                                    .LeaveHours,
                                                value: data.LeaveHours != null ? data.LeaveHours.toString() : null,
                                                refresh: !LeaveHours.refresh
                                            }
                                        },
                                        DurationTypeFullShift: {
                                            ...nextState.Div_DurationType1.DurationTypeDetail.DurationTypeFullShift,
                                            LeaveDays: {
                                                ...nextState.Div_DurationType1.DurationTypeDetail.DurationTypeFullShift
                                                    .LeaveDays,
                                                value: data.LeaveDays ? data.LeaveDays.toString() : null,
                                                refresh: !LeaveDays.refresh
                                            }
                                        }
                                    }
                                },
                                Div_TypeHalfShift1: {
                                    ...nextState.Div_TypeHalfShift1,
                                    divTypeHalfShiftContent: {
                                        ...nextState.Div_TypeHalfShift1.divTypeHalfShiftContent,
                                        divTypeHalfShiftLeaveDay: {
                                            ...nextState.Div_TypeHalfShift1.divTypeHalfShiftContent
                                                .divTypeHalfShiftLeaveDay,
                                            TypeHalfShiftLeaveDays: {
                                                ...nextState.Div_TypeHalfShift1.divTypeHalfShiftContent
                                                    .divTypeHalfShiftLeaveDay.TypeHalfShiftLeaveDays,
                                                value: data.LeaveDays ? data.LeaveDays.toString() : null,
                                                refresh: !TypeHalfShiftLeaveDays.refresh
                                            }
                                        },
                                        divTypeHalfShiftLeaveHours: {
                                            ...nextState.Div_TypeHalfShift1.divTypeHalfShiftContent
                                                .divTypeHalfShiftLeaveHours,
                                            TypeHalfShiftLeaveHours: {
                                                ...nextState.Div_TypeHalfShift1.divTypeHalfShiftContent
                                                    .divTypeHalfShiftLeaveHours.TypeHalfShiftLeaveHours,
                                                value: data.LeaveHours != null ? data.LeaveHours.toString() : null,
                                                refresh: !TypeHalfShiftLeaveHours.refresh
                                            }
                                        }
                                    }
                                }
                            };

                            this.setState(nextState);
                        }
                    }
                });
            }
        });
    };

    SetComputeDurationTypes = (value, LoadLeaveDayTypeByGrade) => {
        const { Div_DurationType1, LeaveDayTypeByGrade, divShift, LeaveDayTypeFull, Profile, DateEnd } = this.state,
            { ShiftID } = divShift,
            { LeaveDayTypeID } = LeaveDayTypeFull,
            { TempLeaveDayTypeID } = LeaveDayTypeByGrade,
            { DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
            { HoursFrom, HoursTo, LeaveHoursDetail, LeaveHours } = OtherDurationType,
            { ConfigLeaveHoursDetail } = LeaveHoursDetail,
            { LeaveDays } = DurationTypeFullShift;

        if (value == 'E_FULLSHIFT') {
            this.setState(
                {
                    Div_DurationType1: {
                        ...Div_DurationType1,
                        DurationTypeDetail: {
                            ...DurationTypeDetail,
                            visible: true,
                            OtherDurationType: {
                                ...OtherDurationType,
                                visible: false,
                                LeaveHoursDetail: {
                                    ...LeaveHoursDetail,
                                    visible: false
                                },
                                HoursFrom: {
                                    ...HoursFrom,
                                    visible: true,
                                    disable: true,
                                    refresh: !HoursFrom.refresh
                                },
                                HoursTo: {
                                    ...HoursTo,
                                    visible: true,
                                    disable: true,
                                    refresh: !HoursTo.refresh
                                }
                            },
                            DurationTypeFullShift: {
                                ...DurationTypeFullShift,
                                visible: true
                            }
                        }
                    }
                },
                () => this.ComputeDurationTypes(value, LoadLeaveDayTypeByGrade)
            );
        } else if (value == 'E_FIRSTHALFSHIFT') {
            this.setState(
                {
                    Div_DurationType1: {
                        ...Div_DurationType1,
                        DurationTypeDetail: {
                            ...DurationTypeDetail,
                            visible: true,
                            OtherDurationType: {
                                ...OtherDurationType,
                                visible: true,
                                LeaveHoursDetail: {
                                    ...LeaveHoursDetail,
                                    visible: false
                                },
                                HoursFrom: {
                                    ...HoursFrom,
                                    visible: true,
                                    disable: true,
                                    refresh: !HoursFrom.refresh
                                },
                                HoursTo: {
                                    ...HoursTo,
                                    visible: true,
                                    disable: true,
                                    refresh: !HoursTo.refresh
                                },
                                LeaveHours: {
                                    ...LeaveHours,
                                    disable: true,
                                    refresh: !LeaveHours.refresh
                                }
                            },
                            DurationTypeFullShift: {
                                ...DurationTypeFullShift,
                                visible: false
                            }
                        }
                    }
                },
                () => this.ComputeDurationTypes(value, LoadLeaveDayTypeByGrade)
            );
        } else if (value == 'E_LASTHALFSHIFT') {
            this.setState(
                {
                    Div_DurationType1: {
                        ...Div_DurationType1,
                        DurationTypeDetail: {
                            ...DurationTypeDetail,
                            visible: true,
                            OtherDurationType: {
                                ...OtherDurationType,
                                visible: true,
                                LeaveHoursDetail: {
                                    ...LeaveHoursDetail,
                                    visible: false
                                },
                                HoursFrom: {
                                    ...HoursFrom,
                                    disable: true,
                                    refresh: !HoursFrom.refresh,
                                    visible: true
                                },
                                HoursTo: {
                                    ...HoursTo,
                                    visible: true,
                                    disable: true,
                                    refresh: !HoursTo.refresh
                                },
                                LeaveHours: {
                                    ...LeaveHours,
                                    disable: true,
                                    refresh: !LeaveHours.refresh
                                }
                            },
                            DurationTypeFullShift: {
                                ...DurationTypeFullShift,
                                visible: false
                            }
                        }
                    }
                },
                () => this.ComputeDurationTypes(value, LoadLeaveDayTypeByGrade)
            );
        } else if (value == 'E_MIDDLEOFSHIFT') {
            //có cấu hình giữa ca
            if (this.IsLeaveHoursDetail) {
                let leaveDayTypeID = TempLeaveDayTypeID.value
                        ? TempLeaveDayTypeID.value.ID
                        : LeaveDayTypeID.value
                            ? LeaveDayTypeID.value.ID
                            : null,
                    shiftID = ShiftID.value ? ShiftID.value.ID : null,
                    dateEnd = DateEnd.value ? moment(DateEnd.value).format('YYYY-MM-DD 00:00:00') : null;

                VnrLoadingSevices.show();
                HttpService.Get(
                    '[URI_HR]/Att_GetData/GetCofigAndDataLeaveHoursDetail?' +
                        'LeaveDayTypeID=' +
                        leaveDayTypeID +
                        '&ShiftID=' +
                        shiftID +
                        '&ProfileID=' +
                        Profile.ID +
                        '&MonthEnd=' +
                        dateEnd
                ).then(res => {
                    VnrLoadingSevices.hide();

                    let _dataConfigLeaveHoursDetail = [];

                    if (res && Array.isArray(res)) {
                        _dataConfigLeaveHoursDetail = res.map(item => {
                            return { LeaveHoursDetail: item.LeaveHoursDetail };
                        });
                    }

                    try {
                        this.setState(
                            {
                                Div_DurationType1: {
                                    ...Div_DurationType1,
                                    DurationTypeDetail: {
                                        ...DurationTypeDetail,
                                        OtherDurationType: {
                                            ...OtherDurationType,
                                            visible: true,
                                            LeaveHoursDetail: {
                                                ...LeaveHoursDetail,
                                                visible: true,
                                                ConfigLeaveHoursDetail: {
                                                    ...ConfigLeaveHoursDetail,
                                                    data: _dataConfigLeaveHoursDetail,
                                                    value: null,
                                                    refresh: !ConfigLeaveHoursDetail.refresh
                                                }
                                            },
                                            HoursFrom: {
                                                ...HoursFrom,
                                                visible: false
                                            },
                                            HoursTo: {
                                                ...HoursTo,
                                                visible: false
                                            },
                                            LeaveHours: {
                                                ...LeaveHours,
                                                disable: true,
                                                value: '0',
                                                refresh: !LeaveHours.refresh
                                            }
                                        },
                                        DurationTypeFullShift: {
                                            ...DurationTypeFullShift,
                                            visible: false
                                        }
                                    }
                                }
                            },
                            () => {

                                if (LoadLeaveDayTypeByGrade && typeof LoadLeaveDayTypeByGrade === 'function') {
                                    LoadLeaveDayTypeByGrade();
                                }
                            }
                        );
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });
            } else {
                this.setState(
                    {
                        Div_DurationType1: {
                            ...Div_DurationType1,
                            DurationTypeDetail: {
                                ...DurationTypeDetail,
                                visible: true,
                                OtherDurationType: {
                                    ...OtherDurationType,
                                    visible: true,
                                    HoursFrom: {
                                        ...HoursFrom,
                                        value: null,
                                        disable: false,
                                        refresh: !HoursFrom.refresh
                                    },
                                    HoursTo: {
                                        ...HoursTo,
                                        value: null,
                                        disable: false,
                                        refresh: !HoursTo.refresh
                                    },
                                    LeaveHours: {
                                        ...LeaveHours,
                                        disable: false,
                                        value: '0',
                                        refresh: !LeaveHours.refresh
                                    }
                                },
                                DurationTypeFullShift: {
                                    ...DurationTypeFullShift,
                                    visible: false
                                }
                            }
                        }
                    },
                    () => this.ComputeDurationTypes(value, LoadLeaveDayTypeByGrade)
                );
            }
        } else if (value == 'E_OUT_OF_SHIFT') {
            this.setState(
                {
                    Div_DurationType1: {
                        ...Div_DurationType1,
                        DurationTypeDetail: {
                            ...DurationTypeDetail,
                            visible: true,
                            OtherDurationType: {
                                ...OtherDurationType,
                                visible: true,
                                LeaveHoursDetail: {
                                    ...LeaveHoursDetail,
                                    visible: false
                                },
                                HoursFrom: {
                                    ...HoursFrom,
                                    visible: true,
                                    disable: false,
                                    value: null,
                                    refresh: !HoursFrom.refresh
                                },
                                HoursTo: {
                                    ...HoursTo,
                                    visible: true,
                                    disable: false,
                                    value: null,
                                    refresh: !HoursTo.refresh
                                },
                                LeaveHours: {
                                    ...LeaveHours,
                                    value: '0',
                                    refresh: !LeaveHours.refresh
                                }
                            },
                            DurationTypeFullShift: {
                                ...DurationTypeFullShift,
                                visible: false,
                                LeaveDays: {
                                    ...LeaveDays,
                                    disable: false,
                                    refresh: !LeaveDays.refresh
                                }
                            }
                        }
                    }
                },
                () => this.ComputeDurationTypes(value, LoadLeaveDayTypeByGrade)
            );
        } else {
            this.setState(
                {
                    Div_DurationType1: {
                        ...Div_DurationType1,
                        DurationTypeDetail: {
                            ...DurationTypeDetail,
                            visible: false,
                            OtherDurationType: {
                                ...OtherDurationType,
                                visible: true,
                                LeaveHoursDetail: {
                                    ...LeaveHoursDetail,
                                    visible: false
                                },
                                HoursFrom: {
                                    ...HoursFrom,
                                    visible: true,
                                    value: null,
                                    refresh: !HoursFrom.refresh
                                },
                                HoursTo: {
                                    ...HoursTo,
                                    value: null,
                                    visible: true,
                                    refresh: !HoursTo.refresh
                                },
                                LeaveHours: {
                                    ...LeaveHours,
                                    value: '0',
                                    refresh: !LeaveHours.refresh
                                }
                            },
                            DurationTypeFullShift: {
                                ...DurationTypeFullShift,
                                LeaveDays: {
                                    ...LeaveDays,
                                    value: '0',
                                    refresh: !LeaveDays.refresh
                                }
                            }
                        }
                    }
                },
                () => {
                    if (LoadLeaveDayTypeByGrade && typeof LoadLeaveDayTypeByGrade === 'function') {
                        LoadLeaveDayTypeByGrade();
                    }
                }
            );
        }
    };

    ComputeDurationTypes = (ShiftType, LoadLeaveDayTypeByGrade) => {

        this.GetMessageProfileIdExistInPrenancy();

        const { Div_DurationType1 } = this.state,
            { DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
            { LeaveHours } = OtherDurationType,
            { LeaveDays } = DurationTypeFullShift;

        this.setState(
            {
                Div_DurationType1: {
                    ...Div_DurationType1,
                    DurationTypeDetail: {
                        ...DurationTypeDetail,
                        OtherDurationType: {
                            ...OtherDurationType,
                            LeaveHours: {
                                ...LeaveHours,
                                disable: true,
                                value: '0',
                                refresh: !LeaveHours.refresh
                            }
                        },
                        DurationTypeFullShift: {
                            ...DurationTypeFullShift,
                            LeaveDays: {
                                ...LeaveDays,
                                value: '0',
                                refresh: !LeaveDays.refresh
                            }
                        }
                    }
                }
            },
            () => {
                const { DateStart, DateEnd, Profile, divShift, Div_DurationType1, Div_TypeHalfShift1 } = this.state,
                    { divTypeHalfShiftContent } = Div_TypeHalfShift1,
                    { divTypeHalfShiftLeaveDay, divTypeHalfShiftLeaveHours } = divTypeHalfShiftContent,
                    { TypeHalfShiftLeaveDays } = divTypeHalfShiftLeaveDay,
                    { TypeHalfShiftLeaveHours } = divTypeHalfShiftLeaveHours,
                    { ShiftID } = divShift,
                    { DurationType, DurationTypeDetail } = Div_DurationType1,
                    { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
                    { LeaveHours, HoursFrom, HoursTo } = OtherDurationType,
                    { LeaveDays } = DurationTypeFullShift;

                if (DateStart.value && DateEnd.value) {
                    let dateStartNew = DateStart.value ? moment(DateStart.value).format('YYYY-MM-DD 00:00:00') : null,
                        dateEndNew = DateEnd.value ? moment(DateEnd.value).format('YYYY-MM-DD 00:00:00') : null,
                        profileId = Profile.ID;

                    VnrLoadingSevices.show();
                    HttpService.Post('[URI_HR]/Att_GetData/GetRosterForCheckLeaveDay', {
                        profileId: profileId,
                        dateStart: dateStartNew,
                        dateEnd: dateEndNew,
                        ShiftType: ShiftType,
                        isBussinessTravel: true
                    }).then(data => {
                        VnrLoadingSevices.hide();
                        if (data) {
                            if (typeof data != 'object' && data.indexOf('InValidDate') >= 0) {
                                ToasterSevice.showWarning('HRM_Chose_From_Calendar');
                            } else {
                                let nextState = {
                                    divShift: {
                                        ...divShift,
                                        visible: false
                                    }
                                };

                                if (data.Messages != null) {
                                    ToasterSevice.showWarning(data.Messages);

                                    let dataSourceDurationType = [];

                                    if (data.isNonShift == true) {
                                        dataSourceDurationType.push({
                                            Text: 'E_FULLSHIFT',
                                            Value: 'E_FULLSHIFT'
                                        });
                                        dataSourceDurationType.push({
                                            Text: 'E_MIDDLEOFSHIFT',
                                            Value: 'E_MIDDLEOFSHIFT'
                                        });
                                    } else {
                                        dataSourceDurationType.push({
                                            Text: 'E_FULLSHIFT',
                                            Value: 'E_FULLSHIFT'
                                        });
                                        dataSourceDurationType.push({
                                            Text: 'E_MIDDLEOFSHIFT',
                                            Value: 'E_MIDDLEOFSHIFT'
                                        });
                                        dataSourceDurationType.push({
                                            Text: 'E_LASTHALFSHIFT',
                                            Value: 'E_LASTHALFSHIFT'
                                        });
                                        dataSourceDurationType.push({
                                            Text: 'E_FIRSTHALFSHIFT',
                                            Value: 'E_FIRSTHALFSHIFT'
                                        });
                                        dataSourceDurationType.push({
                                            Text: 'E_OUT_OF_SHIFT',
                                            Value: 'E_OUT_OF_SHIFT'
                                        });
                                    }

                                    nextState = {
                                        ...nextState,
                                        Div_DurationType1: {
                                            ...Div_DurationType1,
                                            DurationType: {
                                                ...DurationType,
                                                data: [...dataSourceDurationType],
                                                refresh: !DurationType.refresh
                                            }
                                        }
                                    };

                                    this.setState(nextState, () => {
                                        if (LoadLeaveDayTypeByGrade && typeof LoadLeaveDayTypeByGrade === 'function') {
                                            LoadLeaveDayTypeByGrade();
                                        }
                                    });
                                } else {
                                    if (data.length > 1) {
                                        let _dataSource = data.map(item => {
                                            return { ShiftName: item.ShiftName, ID: item.ID };
                                        });

                                        nextState = {
                                            ...nextState,
                                            divShift: {
                                                ...nextState.divShift,
                                                visible: true,
                                                ShiftID: {
                                                    ...nextState.divShift.ShiftID,
                                                    data: [..._dataSource],
                                                    refresh: !ShiftID.refresh
                                                }
                                            },
                                            Div_DurationType1: {
                                                ...Div_DurationType1,
                                                DurationTypeDetail: {
                                                    ...DurationTypeDetail,
                                                    OtherDurationType: {
                                                        ...OtherDurationType,
                                                        LeaveHours: {
                                                            ...LeaveHours,
                                                            disable: true,
                                                            value:
                                                                data[0] && data[0].LeaveHours != null
                                                                    ? data[0].LeaveHours.toString()
                                                                    : null,
                                                            refresh: !LeaveHours.refresh
                                                        }
                                                    },
                                                    DurationTypeFullShift: {
                                                        ...DurationTypeFullShift,
                                                        LeaveDays: {
                                                            ...LeaveDays,
                                                            value:
                                                                data[0] && data[0].LeaveDays
                                                                    ? data[0].LeaveDays.toString()
                                                                    : null,
                                                            refresh: !LeaveDays.refresh
                                                        }
                                                    }
                                                }
                                            }
                                        };
                                    } else if (data.length == 1) {
                                        nextState = {
                                            ...nextState,
                                            divShift: {
                                                ...nextState.divShift,
                                                visible: false,
                                                ShiftID: {
                                                    ...nextState.divShift.ShiftID,
                                                    data: [{ ShiftName: data[0].ShiftName, ID: data[0].ID }],
                                                    value: { ShiftName: data[0].ShiftName, ID: data[0].ID },
                                                    refresh: !ShiftID.refresh
                                                }
                                            },
                                            Div_DurationType1: {
                                                ...Div_DurationType1,
                                                DurationTypeDetail: {
                                                    ...DurationTypeDetail,
                                                    OtherDurationType: {
                                                        ...OtherDurationType,
                                                        LeaveHours: {
                                                            ...LeaveHours,
                                                            disable: true,
                                                            value:
                                                                    data[0] && data[0].LeaveHours != null
                                                                        ? data[0].LeaveHours.toString()
                                                                        : null,
                                                            refresh: !LeaveHours.refresh
                                                        }
                                                    },
                                                    DurationTypeFullShift: {
                                                        ...DurationTypeFullShift,
                                                        LeaveDays: {
                                                            ...LeaveDays,
                                                            value:
                                                                    data[0] && data[0].LeaveDays
                                                                        ? data[0].LeaveDays.toString()
                                                                        : null,
                                                            refresh: !LeaveDays.refresh
                                                        }
                                                    }
                                                }
                                            },
                                            Div_TypeHalfShift1: {
                                                ...Div_TypeHalfShift1,
                                                divTypeHalfShiftContent: {
                                                    ...divTypeHalfShiftContent,
                                                    divTypeHalfShiftLeaveDay: {
                                                        ...divTypeHalfShiftLeaveDay,
                                                        TypeHalfShiftLeaveDays: {
                                                            ...TypeHalfShiftLeaveDays,
                                                            value:
                                                                    data[0] && data[0].LeaveDays
                                                                        ? data[0].LeaveDays.toString()
                                                                        : null,
                                                            refresh: !TypeHalfShiftLeaveDays.refresh
                                                        }
                                                    },
                                                    divTypeHalfShiftLeaveHours: {
                                                        ...divTypeHalfShiftLeaveHours,
                                                        TypeHalfShiftLeaveHours: {
                                                            ...TypeHalfShiftLeaveHours,
                                                            value:
                                                                    data[0] && data[0].LeaveHours != null
                                                                        ? data[0].LeaveHours.toString()
                                                                        : null,
                                                            refresh: !TypeHalfShiftLeaveHours.refresh
                                                        }
                                                    }
                                                }
                                            }
                                        };
                                    } else if (data.ShiftType == 'E_FIRSTHALFSHIFT') {
                                        if (data.length > 1) {
                                            nextState = {
                                                ...nextState,
                                                divShift: {
                                                    ...nextState.divShift,
                                                    visible: true,
                                                    ShiftID: {
                                                        ...nextState.divShift.ShiftID,
                                                        data: [...data],
                                                        refresh: !ShiftID.refresh
                                                    }
                                                }
                                            };
                                        } else {
                                            let time1 = data.HoursFrom && moment(data.HoursFrom).toDate(),
                                                time2 = data.HoursTo && moment(data.HoursTo).toDate();

                                            nextState = {
                                                ...nextState,
                                                divShift: {
                                                    ...nextState.divShift,
                                                    visible: false,
                                                    ShiftID: {
                                                        ...nextState.divShift.ShiftID,
                                                        value: { ID: data.ShiftID, ShiftName: '' },
                                                        refresh: !ShiftID.refresh
                                                    }
                                                },
                                                Div_DurationType1: {
                                                    ...Div_DurationType1,
                                                    DurationTypeDetail: {
                                                        ...DurationTypeDetail,
                                                        OtherDurationType: {
                                                            ...OtherDurationType,
                                                            HoursFrom: {
                                                                ...HoursFrom,
                                                                value: time1,
                                                                refresh: !HoursFrom.refresh
                                                            },
                                                            HoursTo: {
                                                                ...HoursTo,
                                                                value: time2,
                                                                refresh: !HoursTo.refresh
                                                            },
                                                            LeaveHours: {
                                                                ...LeaveHours,
                                                                disable: true,
                                                                value:
                                                                            data.LeaveHours != null
                                                                                ? data.LeaveHours.toString()
                                                                                : null,
                                                                refresh: !LeaveHours.refresh
                                                            }
                                                        },
                                                        DurationTypeFullShift: {
                                                            ...DurationTypeFullShift,
                                                            LeaveDays: {
                                                                ...LeaveDays,
                                                                value: data.LeaveDays
                                                                    ? data.LeaveDays.toString()
                                                                    : null,
                                                                refresh: !LeaveDays.refresh
                                                            }
                                                        }
                                                    }
                                                }
                                            };
                                        }
                                    } else if (data.ShiftType == 'E_LASTHALFSHIFT') {
                                        if (data.length > 1) {
                                            //$("#divShift").show();
                                            // var ddlShift = $("#ShiftID").data("kendoDropDownList");
                                            // ddlShift.setDataSource(data);
                                            // ddlShift.refresh();
                                            // Loading(false);
                                            nextState = {
                                                ...nextState,
                                                divShift: {
                                                    ...nextState.divShift,
                                                    visible: true,
                                                    ShiftID: {
                                                        ...nextState.divShift.ShiftID,
                                                        data: [...data],
                                                        refresh: !ShiftID.refresh
                                                    }
                                                }
                                            };
                                        } else {
                                            //$("#divShift").hide();
                                            //var ddlShift = $("#ShiftID").data("kendoDropDownList");
                                            //ddlShift.value(data.ShiftID);
                                            //$("#LeaveDays").val(data.LeaveDays);
                                            // var hoursFrom = new Date(parseInt(data.HoursFrom.substr(6))),
                                            //     hoursTo = new Date(parseInt(data.HoursTo.substr(6))),
                                            //     time1 = hoursFrom.toTimeString().substr(0, 5),
                                            //     time2 = hoursTo.toTimeString().substr(0, 5);
                                            let time1 = data.HoursFrom && moment(data.HoursFrom).toDate(),
                                                time2 = data.HoursTo && moment(data.HoursTo).toDate();

                                            nextState = {
                                                ...nextState,
                                                divShift: {
                                                    ...nextState.divShift,
                                                    visible: false,
                                                    ShiftID: {
                                                        ...nextState.divShift.ShiftID,
                                                        value: { ID: data.ShiftID, ShiftName: '' },
                                                        refresh: !ShiftID.refresh
                                                    }
                                                },
                                                Div_DurationType1: {
                                                    ...Div_DurationType1,
                                                    DurationTypeDetail: {
                                                        ...DurationTypeDetail,
                                                        OtherDurationType: {
                                                            ...OtherDurationType,
                                                            HoursFrom: {
                                                                ...HoursFrom,
                                                                value: time1,
                                                                refresh: !HoursFrom.refresh
                                                            },
                                                            HoursTo: {
                                                                ...HoursTo,
                                                                value: time2,
                                                                refresh: !HoursTo.refresh
                                                            },
                                                            LeaveHours: {
                                                                ...LeaveHours,
                                                                disable: true,
                                                                value:
                                                                            data.LeaveHours != null
                                                                                ? data.LeaveHours.toString()
                                                                                : null,
                                                                refresh: !LeaveHours.refresh
                                                            }
                                                        },
                                                        DurationTypeFullShift: {
                                                            ...DurationTypeFullShift,
                                                            LeaveDays: {
                                                                ...LeaveDays,
                                                                value: data.LeaveDays
                                                                    ? data.LeaveDays.toString()
                                                                    : null,
                                                                refresh: !LeaveDays.refresh
                                                            }
                                                        }
                                                    }
                                                }
                                            };
                                        }
                                    } else if (data.ShiftType == 'E_MIDDLEOFSHIFT') {
                                        if (data.length > 1) {
                                            // $("#divShift").show();
                                            // var ddlShift = $("#ShiftID").data("kendoDropDownList");
                                            // ddlShift.setDataSource(data);
                                            // ddlShift.refresh();
                                            // Loading(false);
                                            nextState = {
                                                ...nextState,
                                                divShift: {
                                                    ...nextState.divShift,
                                                    visible: true,
                                                    ShiftID: {
                                                        ...nextState.divShift.ShiftID,
                                                        data: [...data],
                                                        refresh: !ShiftID.refresh
                                                    }
                                                }
                                            };
                                        } else {
                                            let time1 = data.HoursFrom && moment(data.HoursFrom).toDate(),
                                                time2 = data.HoursTo && moment(data.HoursTo).toDate();
                                            nextState = {
                                                ...nextState,
                                                divShift: {
                                                    ...nextState.divShift,
                                                    visible: false,
                                                    ShiftID: {
                                                        ...nextState.divShift.ShiftID,
                                                        value: { ID: data.ShiftID, ShiftName: '' },
                                                        refresh: !ShiftID.refresh
                                                    }
                                                },
                                                Div_DurationType1: {
                                                    ...Div_DurationType1,
                                                    DurationTypeDetail: {
                                                        ...DurationTypeDetail,
                                                        OtherDurationType: {
                                                            ...OtherDurationType,
                                                            HoursFrom: {
                                                                ...HoursFrom,
                                                                value: time1,
                                                                refresh: !HoursFrom.refresh
                                                            },
                                                            HoursTo: {
                                                                ...HoursTo,
                                                                value: time2,
                                                                refresh: !HoursTo.refresh
                                                            },
                                                            LeaveHours: {
                                                                ...LeaveHours,
                                                                disable: true,
                                                                value:
                                                                            data.LeaveHours != null
                                                                                ? data.LeaveHours.toString()
                                                                                : null,
                                                                refresh: !LeaveHours.refresh
                                                            }
                                                        },
                                                        DurationTypeFullShift: {
                                                            ...DurationTypeFullShift,
                                                            LeaveDays: {
                                                                ...LeaveDays,
                                                                value: data.LeaveDays
                                                                    ? data.LeaveDays.toString()
                                                                    : null,
                                                                refresh: !LeaveDays.refresh
                                                            }
                                                        }
                                                    }
                                                }
                                            };
                                        }
                                    } else if (data.ShiftType == 'E_OUT_OF_SHIFT') {
                                        if (data.length > 1) {
                                            nextState = {
                                                ...nextState,
                                                divShift: {
                                                    ...nextState.divShift,
                                                    visible: true,
                                                    ShiftID: {
                                                        ...nextState.divShift.ShiftID,
                                                        data: [...data],
                                                        refresh: !ShiftID.refresh
                                                    }
                                                }
                                            };
                                        } else {
                                            let time1 = data.HoursFrom && moment(data.HoursFrom).toDate(),
                                                time2 = data.HoursTo && moment(data.HoursTo).toDate();

                                            nextState = {
                                                ...nextState,
                                                divShift: {
                                                    ...nextState.divShift,
                                                    visible: false,
                                                    ShiftID: {
                                                        ...nextState.divShift.ShiftID,
                                                        value: { ID: data.ShiftID, ShiftName: '' },
                                                        refresh: !ShiftID.refresh
                                                    }
                                                },
                                                Div_DurationType1: {
                                                    ...Div_DurationType1,
                                                    DurationTypeDetail: {
                                                        ...DurationTypeDetail,
                                                        OtherDurationType: {
                                                            ...OtherDurationType,
                                                            HoursFrom: {
                                                                ...HoursFrom,
                                                                value: time1,
                                                                refresh: !HoursFrom.refresh
                                                            },
                                                            HoursTo: {
                                                                ...HoursTo,
                                                                value: time2,
                                                                refresh: !HoursTo.refresh
                                                            },
                                                            LeaveHours: {
                                                                ...LeaveHours,
                                                                disable: true,
                                                                value:
                                                                            data.LeaveHours != null
                                                                                ? data.LeaveHours.toString()
                                                                                : null,
                                                                refresh: !LeaveHours.refresh
                                                            }
                                                        },
                                                        DurationTypeFullShift: {
                                                            ...DurationTypeFullShift,
                                                            LeaveDays: {
                                                                ...LeaveDays,
                                                                value: data.LeaveDays
                                                                    ? data.LeaveDays.toString()
                                                                    : null,
                                                                refresh: !LeaveDays.refresh
                                                            }
                                                        }
                                                    }
                                                }
                                            };
                                        }
                                    } else if (data.ShiftType == 'E_FULLSHIFT') {
                                        let time1 = data.HoursFrom && moment(data.HoursFrom).toDate(),
                                            time2 = data.HoursTo && moment(data.HoursTo).toDate();

                                        nextState = {
                                            ...nextState,
                                            Div_DurationType1: {
                                                ...Div_DurationType1,
                                                DurationTypeDetail: {
                                                    ...DurationTypeDetail,
                                                    OtherDurationType: {
                                                        ...OtherDurationType,
                                                        HoursFrom: {
                                                            ...HoursFrom,
                                                            value: time1,
                                                            refresh: !HoursFrom.refresh
                                                        },
                                                        HoursTo: {
                                                            ...HoursTo,
                                                            value: time2,
                                                            refresh: !HoursTo.refresh
                                                        },
                                                        LeaveHours: {
                                                            ...LeaveHours,
                                                            disable: true,
                                                            value:
                                                                        data.LeaveHours != null
                                                                            ? data.LeaveHours.toString()
                                                                            : null,
                                                            refresh: !LeaveHours.refresh
                                                        }
                                                    },
                                                    DurationTypeFullShift: {
                                                        ...DurationTypeFullShift,
                                                        LeaveDays: {
                                                            ...LeaveDays,
                                                            value: data.LeaveDays
                                                                ? data.LeaveDays.toString()
                                                                : null,
                                                            refresh: !LeaveDays.refresh
                                                        }
                                                    }
                                                }
                                            }
                                        };
                                    }

                                    this.setState(nextState, () => {
                                        if (LoadLeaveDayTypeByGrade && typeof LoadLeaveDayTypeByGrade === 'function') {
                                            LoadLeaveDayTypeByGrade();
                                        }
                                    });
                                }
                            }
                        }
                    });
                }
            }
        );
    };

    GetMessageProfileIdExistInPrenancy = () => {
        const { DateStart, DateEnd, Profile, Div_DurationType1 } = this.state,
            { DurationType } = Div_DurationType1;

        let dateStartNew = DateStart.value ? moment(DateStart.value).format('YYYY-MM-DD 00:00:00') : null,
            dateEndNew = DateEnd.value ? moment(DateEnd.value).format('YYYY-MM-DD 00:00:00') : null,
            profileIds = Profile.ID,
            durationType = DurationType.value ? DurationType.value.Value : null;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetMessageProfileExistInPrenancy', {
            profileId: profileIds,
            dateStart: dateStartNew,
            dateEnd: dateEndNew,
            ShiftType: durationType
        }).then(data => {
            VnrLoadingSevices.hide();
            if (data && typeof data == 'string') {
                ToasterSevice.showWarning(data);
            }
        });
    };

    changeAddressATT = value => {
        if (value) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Cat_GetData/GetDataSoureAddress', { ID: value }).then(data => {
                VnrLoadingSevices.hide();
                if (data && data.length > 0) {
                    const { MissionPlaceInID } = this.state;
                    this.setState({
                        MissionPlaceInID: {
                            ...MissionPlaceInID,
                            value: { ...data[0], ID: data[0]['ProvinceID'] },
                            refresh: !MissionPlaceInID.refresh
                        }
                    });
                }
            });
        }
    };

    changeAddressATTCountry = value => {
        if (value) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Cat_GetData/GetDataSoureAddress', { ID: value }).then(data => {
                VnrLoadingSevices.hide();
                if (data && data.length > 0) {
                    const { MissionPlaceOutID } = this.state;
                    this.setState({
                        MissionPlaceOutID: {
                            ...MissionPlaceOutID,
                            value: { ...data[0] },
                            refresh: !MissionPlaceOutID.refresh
                        }
                    });
                }
            });
        }
    };

    ComputeRemainDays = () => {
        // var _profileIds = $('#ProfileID').val();
        // var pro = _ajaxHeader().userid;
        // var _DateStart = ConvertDatetime(uriSys + 'Sys_GetData/GetFormatDate/', $("#DateStart").val());
        // var _LeaveDayTypeID = "";
        // if ($("#LeaveDayTypeID").val() != "") {
        //   _LeaveDayTypeID = $("#LeaveDayTypeID").val();
        // } else {
        //   _LeaveDayTypeID = $("#TempLeaveDayTypeID").val();
        // }
        // $.ajax({
        //   url: uriHr + "Att_GetData/GetRemainAnlDays",
        //   data: { profileID: pro, leaveDayTypeID: _LeaveDayTypeID, dateStart: _DateStart },
        //   type: 'POST',
        //   datatype: 'json',
        //   success: function (data) {
        //     if (data != null) {
        //       $("#LeaveDayPor_Remain").val(data);
        //     }
        //   }
        // });
    };

    loadDistanceByVehicle = vehicleID => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetDistanceByVehicle', { vehicleID: vehicleID }).then(data => {
            VnrLoadingSevices.hide();

            if (data) {
                let nextState = {};

                if (data.length == 0) {
                    // $("#divDistance").hide();

                    nextState = {
                        ...nextState,
                        MissionDistanceID: {
                            ...this.state.MissionDistanceID,
                            visible: false,
                            value: null,
                            data: [],
                            refresh: !this.state.MissionDistanceID.refresh
                        }
                    };
                    //var distanceControl = $("#MissionDistanceID").data("kendoDropDownList");
                    //distanceControl && distanceControl.value(null);
                    //distanceControl.setDataSource(data);
                } else {
                    // var distanceControl = $("#MissionDistanceID").data("kendoDropDownList");
                    // distanceControl.setDataSource(data);

                    // $("#divDistance").show();
                    nextState = {
                        ...nextState,
                        MissionDistanceID: {
                            ...this.state.MissionDistanceID,
                            visible: true,
                            data: [...data],
                            refresh: !this.state.MissionDistanceID.refresh
                        }
                    };
                }

                this.setState(nextState);
            }
        });
    };

    getMidbleHours = () => {
        const {
                DateStart,
                DateEnd,
                Profile,
                divShift,
                LeaveDayTypeFull,
                LeaveDayTypeByGrade,
                Div_DurationType1
            } = this.state,
            { LeaveDayTypeID } = LeaveDayTypeFull,
            { TempLeaveDayTypeID } = LeaveDayTypeByGrade,
            { ShiftID } = divShift,
            { DurationType, DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
            { LeaveHours, HoursFrom, HoursTo } = OtherDurationType,
            { LeaveDays } = DurationTypeFullShift;

        let dateStart = DateStart.value,
            dateEnd = DateEnd.value;

        if (dateStart && dateEnd) {
            let dateStartNew = moment(dateStart).format('YYYY-MM-DD 00:00:00'),
                dateEndNew = moment(dateEnd).format('YYYY-MM-DD 00:00:00'),
                profileId = Profile.ID,
                durationType = DurationType.value ? DurationType.value.Value : null,
                leavedayID = TempLeaveDayTypeID.value
                    ? TempLeaveDayTypeID.value.ID
                    : LeaveDayTypeID.value
                        ? LeaveDayTypeID.value.ID
                        : null,
                timeFrom = HoursFrom.value ? moment(HoursFrom.value).format('HH:mm') : null,
                timeTo = HoursTo.value ? moment(HoursTo.value).format('HH:mm') : null;

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/GetLeaveHourMidleShift', {
                profileId: profileId,
                dateStart: dateStartNew,
                dateEnd: dateEndNew,
                hourFrom: timeFrom,
                hourTo: timeTo,
                leavedayTypeId: leavedayID,
                durationType: durationType,
                ShiftID: ShiftID.value ? ShiftID.value.ID : null,
                isConfirmSplitHours: false
            }).then(data => {
                VnrLoadingSevices.hide();
                if (typeof data == 'object') {
                    this.setState({
                        Div_DurationType1: {
                            ...Div_DurationType1,
                            DurationTypeDetail: {
                                ...DurationTypeDetail,
                                OtherDurationType: {
                                    ...OtherDurationType,
                                    LeaveHours: {
                                        ...LeaveHours,
                                        value: data.LeaveHours != null ? data.LeaveHours.toString() : null,
                                        refresh: !LeaveHours.refresh
                                    }
                                },
                                DurationTypeFullShift: {
                                    ...DurationTypeFullShift,
                                    LeaveDays: {
                                        ...LeaveDays,
                                        value: data.LeaveDays ? data.LeaveDays.toString() : null,
                                        refresh: !LeaveDays.refresh
                                    }
                                }
                            }
                        }
                    });
                } else if (typeof data == 'string') {
                    ToasterSevice.showWarning(data);
                }
            });
        }
    };

    LoadLeaveDayTypeByGrade = () => {
        const { DateEnd, Profile, LeaveDayTypeFull, LeaveDayTypeByGrade, hasIsMeal } = this.state,
            { LeaveDayTypeID } = LeaveDayTypeFull,
            { TempLeaveDayTypeID } = LeaveDayTypeByGrade;

        //xu ly chi lay nhung loai nghi theo Grade neu co
        let _profileIds = Profile.ID,
            _dateend = DateEnd.value;

        if (_dateend) {
            let _dateEndNew = moment(_dateend).format('YYYY-MM-DD 00:00:00');

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/GetLeaveTypeByGrade', {
                ProfileID: _profileIds,
                DateEnd: _dateEndNew,
                isPortal: true,
                isBusinessTravel: true
            }).then(data => {
                VnrLoadingSevices.hide();

                if (data) {
                    if (typeof data != 'object' && data.indexOf('InValidDate') >= 0) {
                        ToasterSevice.showWarning('HRM_Chose_From_Calendar');
                    } else {
                        let nextState = {};

                        if (data != '') {
                            let _data = data.map(item => {
                                return item;
                            });

                            this.dataTempLeaveDayTypeID = _data;

                            nextState = {
                                ...nextState,
                                LeaveDayTypeByGrade: {
                                    ...LeaveDayTypeByGrade,
                                    visible: true,
                                    TempLeaveDayTypeID: {
                                        ...TempLeaveDayTypeID,
                                        data: _data,
                                        refresh: TempLeaveDayTypeID.refresh
                                    }
                                },
                                LeaveDayTypeFull: {
                                    ...LeaveDayTypeFull,
                                    visible: false,
                                    LeaveDayTypeID: {
                                        ...LeaveDayTypeID,
                                        value: null,
                                        refresh: !LeaveDayTypeID.refresh
                                    }
                                }
                            };

                            if (_data.length == 1) {
                                nextState = {
                                    ...nextState,
                                    LeaveDayTypeByGrade: {
                                        ...nextState.LeaveDayTypeByGrade,
                                        TempLeaveDayTypeID: {
                                            ...nextState.LeaveDayTypeByGrade.TempLeaveDayTypeID,
                                            value: { ..._data[0] }
                                        }
                                    }
                                };

                                if (_data[0] && _data[0].IsMeal) {
                                    nextState = {
                                        ...nextState,
                                        hasIsMeal: {
                                            ...hasIsMeal,
                                            visible: true
                                        }
                                    };
                                }

                                this.setState(nextState, () => {
                                    //vinh.mai biểu sửa, sai đừng có hỏi t nha
                                    //this.ComputeTypeHalfShift('');
                                    this.onChangeTempLeaveDayTypeID(_data[0]);
                                });
                            } else {
                                this.setState(nextState);
                            }
                        } else {
                            nextState = {
                                ...nextState,
                                LeaveDayTypeByGrade: {
                                    ...LeaveDayTypeByGrade,
                                    visible: false,
                                    TempLeaveDayTypeID: {
                                        ...TempLeaveDayTypeID,
                                        value: null,
                                        refresh: TempLeaveDayTypeID.refresh
                                    }
                                },
                                LeaveDayTypeFull: {
                                    ...LeaveDayTypeFull,
                                    visible: true
                                }
                            };

                            this.setState(nextState);
                        }
                    }
                }
            });
        }
    };

    HoursChange = () => {
        const { Div_DurationType1 } = this.state,
            { DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
            { LeaveHours } = OtherDurationType,
            { LeaveDays } = DurationTypeFullShift;

        this.setState(
            {
                Div_DurationType1: {
                    ...Div_DurationType1,
                    DurationTypeDetail: {
                        ...DurationTypeDetail,
                        OtherDurationType: {
                            ...OtherDurationType,
                            LeaveHours: {
                                ...LeaveHours,
                                disable: true,
                                value: '0',
                                refresh: !LeaveHours.refresh
                            }
                        },
                        DurationTypeFullShift: {
                            ...DurationTypeFullShift,
                            LeaveDays: {
                                ...LeaveDays,
                                value: '0',
                                refresh: !LeaveDays.refresh
                            }
                        }
                    }
                }
            },
            () => {
                const {
                        DateStart,
                        DateEnd,
                        Profile,
                        divShift,
                        LeaveDayTypeFull,
                        LeaveDayTypeByGrade,
                        Div_DurationType1,
                        divLeaveHours
                    } = this.state,
                    { LeaveDayTypeID } = LeaveDayTypeFull,
                    { TempLeaveDayTypeID } = LeaveDayTypeByGrade,
                    { ShiftID } = divShift,
                    { DurationType, DurationTypeDetail } = Div_DurationType1,
                    { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
                    { LeaveHours, HoursFrom, HoursTo } = OtherDurationType,
                    { LeaveDays } = DurationTypeFullShift;

                let dateStart = DateStart.value,
                    dateEnd = DateEnd.value;

                if (dateStart && dateEnd) {
                    let timeFrom = HoursFrom.value ? moment(HoursFrom.value).format('HH:mm') : null,
                        timeTo = HoursTo.value ? moment(HoursTo.value).format('HH:mm') : null,
                        leavedayID = TempLeaveDayTypeID.value
                            ? TempLeaveDayTypeID.value.ID
                            : LeaveDayTypeID.value
                                ? LeaveDayTypeID.value.ID
                                : null,
                        durationType = DurationType.value ? DurationType.value.Value : null,
                        dateStartNew = moment(dateStart).format('YYYY-MM-DD 00:00:00'),
                        dateEndNew = moment(dateEnd).format('YYYY-MM-DD 00:00:00'),
                        profileId = Profile.ID;

                    VnrLoadingSevices.show();
                    HttpService.Post('[URI_HR]/Att_GetData/GetLeaveHourMidleShift', {
                        profileId: profileId,
                        dateStart: dateStartNew,
                        dateEnd: dateEndNew,
                        hourFrom: timeFrom,
                        hourTo: timeTo,
                        leavedayTypeId: leavedayID,
                        durationType: durationType,
                        ShiftID: ShiftID.value ? ShiftID.value.ID : null,
                        isConfirmSplitHours: false
                    }).then(data => {
                        VnrLoadingSevices.hide();
                        if (typeof data == 'object') {
                            if (data.Key != null && data.Key != '') {
                                ToasterSevice.showWarning(data.Value);
                                return;
                            }

                            this.setState({
                                Div_DurationType1: {
                                    ...Div_DurationType1,
                                    DurationTypeDetail: {
                                        ...DurationTypeDetail,
                                        OtherDurationType: {
                                            ...OtherDurationType,
                                            LeaveHours: {
                                                ...LeaveHours,
                                                disable: true,
                                                value: data.LeaveHours != null ? data.LeaveHours.toString() : null,
                                                refresh: !LeaveHours.refresh
                                            }
                                        },
                                        DurationTypeFullShift: {
                                            ...DurationTypeFullShift,
                                            LeaveDays: {
                                                ...LeaveDays,
                                                value: data.LeaveDays ? data.LeaveDays.toString() : null,
                                                refresh: !LeaveDays.refresh
                                            }
                                        }
                                    }
                                }
                            });
                        } else {
                            let arrUrl = data.split('|'),
                                data = arrUrl[0];

                            if (data == 'WarningTimeInvalid') {
                                AlertSevice.alert({
                                    title: translate('AlertsView'),
                                    iconType: EnumIcon.E_INFO,
                                    message:
                                        translate('WarningThisTimeValueOutTimeShiftFromTo') +
                                        ' ' +
                                        arrUrl[1] +
                                        ' ' +
                                        'đến' +
                                        ' ' +
                                        arrUrl[2] +
                                        '. ' +
                                        translate('WarningDoYouWantSystemAutoUpdate'),
                                    onCancel: () => {
                                        this.setState({
                                            Div_DurationType1: {
                                                ...Div_DurationType1,
                                                DurationTypeDetail: {
                                                    ...DurationTypeDetail,
                                                    OtherDurationType: {
                                                        ...OtherDurationType,
                                                        divLeaveHours: {
                                                            ...divLeaveHours,
                                                            LeaveHours: {
                                                                ...LeaveHours,
                                                                value: '0',
                                                                refresh: !LeaveHours.refresh
                                                            }
                                                        }
                                                    },
                                                    DurationTypeFullShift: {
                                                        ...DurationTypeFullShift,
                                                        LeaveDays: {
                                                            ...LeaveDays,
                                                            value: '0',
                                                            refresh: !LeaveDays.refresh
                                                        }
                                                    }
                                                }
                                            }
                                        });
                                    },
                                    onConfirm: () => {
                                        let dataBody = {
                                            profileId: profileId,
                                            dateStart: dateStartNew,
                                            dateEnd: dateEndNew,
                                            hourFrom: timeFrom,
                                            hourTo: timeTo,
                                            leavedayTypeId: leavedayID,
                                            durationType: durationType,
                                            ShiftID: ShiftID.value ? ShiftID.value.ID : null,
                                            isConfirmSplitHours: true
                                        };
                                        this.GetLeaveHourMidleShift(dataBody);
                                    }
                                });
                            } else {
                                ToasterSevice.showWarning(data);
                            }
                        }
                    });
                }
            }
        );
    };

    GetLeaveHourMidleShift = dataBody => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetLeaveHourMidleShift', dataBody).then(data => {
            VnrLoadingSevices.hide();
            if (typeof data == 'object') {
                if (data.Key != null && data.Key != '') {
                    ToasterSevice.showWarning(data.Value);
                    // ShowNotificationProcessor(data.Value);
                    return;
                }

                const { Div_DurationType1 } = this.state,
                    { DurationTypeDetail } = Div_DurationType1,
                    { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
                    { LeaveHours, HoursFrom, HoursTo } = OtherDurationType,
                    { LeaveDays } = DurationTypeFullShift;

                let hoursFrom = moment(data.HoursFrom).toDate(),
                    hoursTo = moment(data.HoursFrom).toDate();

                this.setState({
                    Div_DurationType1: {
                        ...Div_DurationType1,
                        DurationTypeDetail: {
                            ...DurationTypeDetail,
                            OtherDurationType: {
                                ...OtherDurationType,
                                HoursFrom: {
                                    ...HoursFrom,
                                    value: hoursFrom,
                                    refresh: !HoursFrom.refresh
                                },
                                HoursTo: {
                                    ...HoursTo,
                                    value: hoursTo,
                                    refresh: !HoursTo.refresh
                                },
                                LeaveHours: {
                                    ...LeaveHours,
                                    value: data.LeaveHours != null ? data.LeaveHours.toString() : null,
                                    refresh: !LeaveHours.refresh
                                }
                            },
                            DurationTypeFullShift: {
                                ...DurationTypeFullShift,
                                LeaveDays: {
                                    ...LeaveDays,
                                    value: data.LeaveDays ? data.LeaveDays.toString() : null,
                                    refresh: !LeaveDays.refresh
                                }
                            }
                        }
                    }
                });
            } else {
                ToasterSevice.showWarning(data);
            }
        });
    };
    //#endregion

    //#region [event component]
    //change duyệt đầu
    onChangeUserApproveID = item => {
        const { UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4 } = this.state;
        let nextState = {
            UserApproveID: {
                ...UserApproveID,
                value: item,
                refresh: !UserApproveID.refresh
            }
        };
        //nếu 1 cấp duyệt mới chạy
        if (this.isOnlyOnleLevelApprove) {
            //ẩn 3,4
            // isShowEle('#divMidApprove');
            // isShowEle('#divMidNextApprove');

            nextState = {
                ...nextState,
                UserApproveID3: {
                    ...UserApproveID3,
                    visible: false,
                    refresh: !UserApproveID3.refresh
                },
                UserApproveID4: {
                    ...UserApproveID4,
                    visible: false,
                    refresh: !UserApproveID4.refresh
                }
            };

            //set duyệt 2,3,4 = 1
            // var user1 = $("#UserApproveID").data("kendoComboBox"),
            //     user2 = $("#UserApproveID2").data("kendoComboBox"),
            //     user3 = $("#UserApproveID3").data("kendoComboBox"),
            //     user4 = $("#UserApproveID4").data("kendoComboBox"),
            //     _data1 = user1.dataSource.data();
            if (!item) {
                // user2.value([]);
                // user3.value([]);
                // user4.value([]);
                nextState = {
                    ...nextState,
                    UserApproveID3: {
                        ...nextState.UserApproveID3,
                        value: null,
                        refresh: !UserApproveID3.refresh
                    },
                    UserApproveID4: {
                        ...nextState.UserApproveID4,
                        value: null,
                        refresh: !UserApproveID4.refresh
                    },
                    UserApproveID2: {
                        ...UserApproveID2,
                        value: null,
                        refresh: !UserApproveID2.refresh
                    }
                };
            } else {
                // _data1.forEach(function (item) {
                //     if (item.ID == user1.value()) {
                //         checkAddDatasource(user2, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //         checkAddDatasource(user3, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //         checkAddDatasource(user4, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //     }
                // });

                nextState = {
                    ...nextState,
                    UserApproveID3: {
                        ...nextState.UserApproveID3,
                        value: item,
                        refresh: !UserApproveID3.refresh
                    },
                    UserApproveID4: {
                        ...nextState.UserApproveID4,
                        value: item,
                        refresh: !UserApproveID4.refresh
                    },
                    UserApproveID2: {
                        ...UserApproveID2,
                        value: item,
                        refresh: !UserApproveID2.refresh
                    }
                };
            }
        }

        this.setState(nextState);
    };

    //change duyệt cuối
    onChangeUserApproveID2 = item => {
        const { UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4 } = this.state;
        let nextState = {
            UserApproveID2: {
                ...UserApproveID2,
                value: item,
                refresh: !UserApproveID2.refresh
            }
        };

        //nếu 1 cấp duyệt mới chạy
        if (this.isOnlyOnleLevelApprove) {
            //ẩn 3,4
            // isShowEle('#divMidApprove');
            // isShowEle('#divMidNextApprove');
            nextState = {
                ...nextState,
                UserApproveID3: {
                    ...UserApproveID3,
                    visible: false,
                    refresh: !UserApproveID3.refresh
                },
                UserApproveID4: {
                    ...UserApproveID4,
                    visible: false,
                    refresh: !UserApproveID4.refresh
                }
            };

            //set duyệt 2,3,4 = 1
            // var user1 = $("#UserApproveID").data("kendoComboBox"),
            //     user2 = $("#UserApproveID2").data("kendoComboBox"),
            //     user3 = $("#UserApproveID3").data("kendoComboBox"),
            //     user4 = $("#UserApproveID4").data("kendoComboBox"),
            //     _data2 = user2.dataSource.data();
            if (!item) {
                // user1.value([]);
                // user3.value([]);
                // user4.value([]);
                nextState = {
                    ...nextState,
                    UserApproveID: {
                        ...UserApproveID,
                        value: null,
                        refresh: !UserApproveID.refresh
                    },
                    UserApproveID3: {
                        ...nextState.UserApproveID3,
                        value: null,
                        refresh: !UserApproveID3.refresh
                    },
                    UserApproveID4: {
                        ...nextState.UserApproveID4,
                        value: null,
                        refresh: !UserApproveID4.refresh
                    }
                };
            } else {
                // _data2.forEach(function (item) {
                //     if (item.ID == user2.value()) {
                //         checkAddDatasource(user1, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //         checkAddDatasource(user3, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //         checkAddDatasource(user4, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //     }
                // });
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
        } else if (this.levelApproveTrip == 2) {
            // var user1 = $("#UserApproveID").data("kendoComboBox"),
            //     user2 = $("#UserApproveID2").data("kendoComboBox"),
            //     user3 = $("#UserApproveID3").data("kendoComboBox"),
            //     user4 = $("#UserApproveID4").data("kendoComboBox"),
            //     _data2 = user2.dataSource.data();
            if (!item) {
                //user3.value([]);
                //user4.value([]);
                nextState = {
                    ...nextState,
                    UserApproveID3: {
                        ...UserApproveID3,
                        value: null,
                        refresh: !UserApproveID3.refresh
                    },
                    UserApproveID4: {
                        ...UserApproveID4,
                        value: null,
                        refresh: !UserApproveID4.refresh
                    }
                };
            } else {
                //_data2.forEach(function (item) {
                //     if (item.ID == user2.value()) {
                //         checkAddDatasource(user3, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //         checkAddDatasource(user4, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //     }
                // });
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
        } else if (this.levelApproveTrip == 3) {
            // var user1 = $("#UserApproveID").data("kendoComboBox"),
            //     user2 = $("#UserApproveID2").data("kendoComboBox"),
            //     user3 = $("#UserApproveID3").data("kendoComboBox"),
            //     user4 = $("#UserApproveID4").data("kendoComboBox"),
            //     _data2 = user2.dataSource.data();
            if (!item) {
                //user4.value([]);
                nextState = {
                    ...nextState,
                    UserApproveID4: {
                        ...UserApproveID4,
                        value: null,
                        refresh: !UserApproveID4.refresh
                    }
                };
            } else {
                // _data2.forEach(function (item) {
                //     if (item.ID == user2.value()) {
                //         checkAddDatasource(user4, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //     }
                // });
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

    //change DateStart
    onChangeDateStart = value => {
        const {
                DateStart,
                DateEnd,
                LeaveDayTypeFull,
                LeaveDayTypeByGrade,
                Div_DurationType1,
                Div_TypeHalfShift1
            } = this.state,
            { DurationType } = Div_DurationType1,
            { LeaveDayTypeID } = LeaveDayTypeFull,
            { TempLeaveDayTypeID } = LeaveDayTypeByGrade;
        let nextState = {
            DateStart: {
                ...DateStart,
                value,
                refresh: !DateStart.refresh
            },
            LeaveDayTypeFull: {
                ...LeaveDayTypeFull,
                LeaveDayTypeID: {
                    ...LeaveDayTypeID,
                    value: null,
                    refresh: !LeaveDayTypeID.refresh
                }
            },
            LeaveDayTypeByGrade: {
                ...LeaveDayTypeByGrade,
                TempLeaveDayTypeID: {
                    ...TempLeaveDayTypeID,
                    value: null,
                    refresh: !TempLeaveDayTypeID.refresh
                }
            },
            Div_DurationType1: {
                ...Div_DurationType1,
                DurationType: {
                    ...DurationType,
                    value: { Text: translate('E_FULLSHIFT'), Value: 'E_FULLSHIFT' },
                    refresh: !DurationType.refresh
                }
            }
        };

        //show lại control Duration khi chọn lại ngày bắt đầu == ngày kết thúc
        if (value && DateEnd.value && moment(value).format('YYYYMMDD') == moment(DateEnd.value).format('YYYYMMDD')) {
            // isShowEle('#Div_TypeHalfShift1', false);
            // isShowEle('#Div_DurationType1', true);
            nextState = {
                ...nextState,
                Div_DurationType1: {
                    ...nextState.Div_DurationType1,
                    visible: true
                },
                Div_TypeHalfShift1: {
                    ...Div_TypeHalfShift1,
                    visible: false
                }
            };
        }

        if (value) {
            nextState = {
                ...nextState,
                DateEnd: {
                    ...DateEnd,
                    value,
                    disable: false,
                    refresh: !DateEnd.refresh
                },
                LeaveDayTypeFull: {
                    ...nextState.LeaveDayTypeFull,
                    LeaveDayTypeID: {
                        ...nextState.LeaveDayTypeFull.LeaveDayTypeID,
                        disable: false,
                        refresh: !LeaveDayTypeID.refresh
                    }
                }
            };
        }

        this.setState(nextState, () => {
            this.readOnlyCtrlBT(false, () => this.SetComputeDurationTypes('E_FULLSHIFT', this.LoadLeaveDayTypeByGrade));
        });
    };

    //change DateEnd
    onChangeDateEnd = value => {
        const { DateEnd, LeaveDayTypeFull, LeaveDayTypeByGrade, Div_DurationType1 } = this.state,
            { DurationType } = Div_DurationType1,
            { LeaveDayTypeID } = LeaveDayTypeFull,
            { TempLeaveDayTypeID } = LeaveDayTypeByGrade;
        let nextState = {
            DateEnd: {
                ...DateEnd,
                value,
                refresh: !DateEnd.refresh
            },
            LeaveDayTypeFull: {
                ...LeaveDayTypeFull,
                LeaveDayTypeID: {
                    ...LeaveDayTypeID,
                    value: null,
                    refresh: !LeaveDayTypeID.refresh
                }
            },
            LeaveDayTypeByGrade: {
                ...LeaveDayTypeByGrade,
                TempLeaveDayTypeID: {
                    ...TempLeaveDayTypeID,
                    value: null,
                    refresh: !TempLeaveDayTypeID.refresh
                }
            },
            Div_DurationType1: {
                ...Div_DurationType1,
                DurationType: {
                    ...DurationType,
                    value: { Text: translate('E_FULLSHIFT'), Value: 'E_FULLSHIFT' },
                    refresh: !DurationType.refresh
                }
            }
        };

        this.setState(nextState, () => {
            const { DateStart, LeaveDayTypeFull, Div_DurationType1, Div_TypeHalfShift1 } = this.state,
                { divTypeHalfShiftContent, TypeHalfShift } = Div_TypeHalfShift1,
                { divTypeHalfShiftLeaveDay, divTypeHalfShiftLeaveHours } = divTypeHalfShiftContent,
                { TypeHalfShiftLeaveHours } = divTypeHalfShiftLeaveHours,
                { TypeHalfShiftLeaveDays } = divTypeHalfShiftLeaveDay,
                { DurationType } = Div_DurationType1,
                { LeaveDayTypeID } = LeaveDayTypeFull;

            this.SetComputeDurationTypes(
                DurationType.value ? DurationType.value.Value : null,
                this.LoadLeaveDayTypeByGrade
            );

            let _DateStart = DateStart.value,
                _DateEnd = value,
                nextState = {};

            if (_DateStart && _DateEnd) {
                nextState = {
                    ...nextState,
                    LeaveDayTypeFull: {
                        ...LeaveDayTypeFull,
                        LeaveDayTypeID: {
                            ...LeaveDayTypeID,
                            disable: false,
                            refresh: !LeaveDayTypeID.refresh
                        }
                    }
                };

                if (moment(_DateStart).format('YYYYMMDD') == moment(_DateEnd).format('YYYYMMDD')) {
                    nextState = {
                        ...nextState,
                        Div_TypeHalfShift1: {
                            ...Div_TypeHalfShift1,
                            visible: false,
                            TypeHalfShift: {
                                ...TypeHalfShift,
                                value: null,
                                refresh: !TypeHalfShift.refresh
                            },
                            divTypeHalfShiftContent: {
                                ...divTypeHalfShiftContent,
                                visible: false,
                                divTypeHalfShiftLeaveDay: {
                                    ...divTypeHalfShiftLeaveDay,
                                    TypeHalfShiftLeaveDays: {
                                        ...TypeHalfShiftLeaveDays,
                                        value: '0',
                                        refresh: !TypeHalfShiftLeaveDays.refresh
                                    }
                                },
                                divTypeHalfShiftLeaveHours: {
                                    ...divTypeHalfShiftLeaveHours,
                                    TypeHalfShiftLeaveHours: {
                                        ...TypeHalfShiftLeaveHours,
                                        value: '0',
                                        refresh: !TypeHalfShiftLeaveHours.refresh
                                    }
                                }
                            }
                        },
                        Div_DurationType1: {
                            ...Div_DurationType1,
                            visible: true
                        }
                    };

                    this.setState(nextState, () => this.readOnlyCtrlBT(false, () => this.ComputeTypeHalfShift(null)));
                } else {
                    nextState = {
                        ...nextState,
                        Div_TypeHalfShift1: {
                            ...Div_TypeHalfShift1,
                            visible: true,
                            TypeHalfShift: {
                                ...TypeHalfShift,
                                value:
                                    moment(_DateEnd) >= moment(_DateStart)
                                        ? { Text: translate('E_FULLSHIFT'), Value: 'E_FULLSHIFT' }
                                        : TypeHalfShift.value,
                                refresh: !TypeHalfShift.refresh
                            },
                            divTypeHalfShiftContent: {
                                ...divTypeHalfShiftContent,
                                visible: true,
                                divTypeHalfShiftLeaveDay: {
                                    ...divTypeHalfShiftLeaveDay,
                                    TypeHalfShiftLeaveDays: {
                                        ...TypeHalfShiftLeaveDays,
                                        value: '0',
                                        refresh: !TypeHalfShiftLeaveDays.refresh
                                    }
                                },
                                divTypeHalfShiftLeaveHours: {
                                    ...divTypeHalfShiftLeaveHours,
                                    TypeHalfShiftLeaveHours: {
                                        ...TypeHalfShiftLeaveHours,
                                        value: '0',
                                        refresh: !TypeHalfShiftLeaveHours.refresh
                                    }
                                }
                            }
                        },
                        Div_DurationType1: {
                            ...Div_DurationType1,
                            visible: false,
                            DurationType: {
                                ...DurationType,
                                value: null,
                                refresh: !DurationType.refresh
                            }
                        }
                    };

                    let type =
                        moment(_DateEnd) >= moment(_DateStart)
                            ? null
                            : TypeHalfShift.value
                                ? TypeHalfShift.value.Value
                                : null;

                    this.setState(nextState, () => this.readOnlyCtrlBT(false, () => this.ComputeTypeHalfShift(type)));
                }
            } else {
                nextState = {
                    ...nextState,
                    LeaveDayTypeFull: {
                        ...nextState.LeaveDayTypeFull,
                        LeaveDayTypeID: {
                            ...nextState.LeaveDayTypeFull.LeaveDayTypeID,
                            disable: true,
                            refresh: !LeaveDayTypeID.refresh
                        }
                    }
                };
                this.setState(nextState, () => this.readOnlyCtrlBT(true));
            }
        });
    };

    //change LeaveDayTypeID - loại công tác
    onChangeLeaveDayTypeID = item => {
        const { LeaveDayTypeFull } = this.state,
            { LeaveDayTypeID } = LeaveDayTypeFull;

        this.setState({
            LeaveDayTypeFull: {
                ...LeaveDayTypeFull,
                LeaveDayTypeID: {
                    ...LeaveDayTypeID,
                    value: item,
                    refresh: !LeaveDayTypeID.refresh
                }
            }
        });
    };

    //change TempLeaveDayTypeID - loại công tác
    onChangeTempLeaveDayTypeID = item => {

        const {
                LeaveDayTypeByGrade,
                DateStart,
                DateEnd,
                hasIsMeal,
                Div_DurationType1,
                Div_TypeHalfShift1
            } = this.state,
            { DurationType } = Div_DurationType1,
            { TypeHalfShift } = Div_TypeHalfShift1,
            { TempLeaveDayTypeID } = LeaveDayTypeByGrade;

        let nextState = {
                LeaveDayTypeByGrade: {
                    ...LeaveDayTypeByGrade,
                    TempLeaveDayTypeID: {
                        ...TempLeaveDayTypeID,
                        value: item,
                        refresh: !TempLeaveDayTypeID.refresh
                    }
                }
            },
            _DateStart = DateStart.value,
            _DateEnd = DateEnd.value,
            _leavedaytypeid = item ? item.ID : null,
            findIsMeal = this.dataTempLeaveDayTypeID.find(item => item.ID == _leavedaytypeid);

        if (findIsMeal && findIsMeal.IsMeal) {
            nextState = {
                ...nextState,
                hasIsMeal: {
                    ...hasIsMeal,
                    visible: true
                }
            };
        }

        if (_leavedaytypeid) {
            let dateStartNew = _DateStart ? moment(_DateStart).format('YYYY-MM-DD 00:00:00') : null;

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/ChangeDayorHours', {
                leaveDayTypeID: _leavedaytypeid,
                dateStart: dateStartNew
            }).then(data => {
                VnrLoadingSevices.hide();

                if (data) {
                    const { DateEnd } = this.state;

                    let result = data.split('|');
                    if (result[0] == 'E_HOURS') {
                        // $("#LeaveDayPor_Remain").val("")
                        // $("#hoursportal").show();
                        // $("#hoursportal").hide();
                    } else {
                        // $("#LeaveDayPor_Remain").val("")
                        // $("#hoursportal").show();
                        // $("#hoursportal").hide();
                    }
                    if (result[1] != '') {
                        this.setState({
                            DateEnd: {
                                ...DateEnd,
                                value: result[1],
                                refresh: !DateEnd.refresh
                            }
                        });
                    }
                }
            });
        }

        if (_DateStart && _DateEnd && moment(_DateStart).format('YYYYMMDD') == moment(_DateEnd).format('YYYYMMDD')) {
            this.setState(nextState, () => {
                let durationtype = DurationType.value ? DurationType.value.Value : null;
                this.ComputeTypeHalfShift(durationtype);
            });
        } else {
            this.setState(nextState, () => {
                let type = TypeHalfShift.value ? TypeHalfShift.value.Value : null;
                if (type == 'E_FULLSHIFT') {
                    type = '';
                }
                this.ComputeTypeHalfShift(type);
            });
        }
    };

    //change DurationType - loại
    onChangeDurationType = item => {
        const { Div_DurationType1 } = this.state,
            { DurationType } = Div_DurationType1;

        this.setState(
            {
                Div_DurationType1: {
                    ...Div_DurationType1,
                    DurationType: {
                        ...DurationType,
                        value: item,
                        refresh: !DurationType.refresh
                    }
                }
            },
            () => this.SetComputeDurationTypes(item ? item.Value : null)
        );
    };

    //change TypeHalfShift - loại
    onChangeTypeHalfShift = item => {
        const { Div_TypeHalfShift1 } = this.state,
            { divTypeHalfShiftContent, TypeHalfShift } = Div_TypeHalfShift1,
            { divTypeHalfShiftLeaveDay, divTypeHalfShiftLeaveHours } = divTypeHalfShiftContent,
            { TypeHalfShiftLeaveHours } = divTypeHalfShiftLeaveHours,
            { TypeHalfShiftLeaveDays } = divTypeHalfShiftLeaveDay;

        if (item) {
            this.setState(
                {
                    Div_TypeHalfShift1: {
                        ...Div_TypeHalfShift1,
                        TypeHalfShift: {
                            ...TypeHalfShift,
                            value: item,
                            refresh: !TypeHalfShift.refresh
                        }
                    }
                },
                () => this.ComputeTypeHalfShift(item.Value)
            );
        } else {
            this.setState({
                Div_TypeHalfShift1: {
                    ...Div_TypeHalfShift1,
                    TypeHalfShift: {
                        ...TypeHalfShift,
                        value: null,
                        refresh: !TypeHalfShift.refresh
                    },
                    divTypeHalfShiftContent: {
                        ...divTypeHalfShiftContent,
                        divTypeHalfShiftLeaveDay: {
                            ...divTypeHalfShiftLeaveDay,
                            TypeHalfShiftLeaveDays: {
                                ...TypeHalfShiftLeaveDays,
                                value: '0',
                                refresh: !TypeHalfShiftLeaveDays.refresh
                            }
                        },
                        divTypeHalfShiftLeaveHours: {
                            ...divTypeHalfShiftLeaveHours,
                            TypeHalfShiftLeaveHours: {
                                ...TypeHalfShiftLeaveHours,
                                value: '0',
                                refresh: !TypeHalfShiftLeaveHours.refresh
                            }
                        }
                    }
                }
            });
        }
    };

    //change HoursFrom
    onChangeHoursFrom = item => {
        const { Div_DurationType1 } = this.state,
            { DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType } = DurationTypeDetail,
            { HoursFrom } = OtherDurationType;

        this.setState(
            {
                Div_DurationType1: {
                    ...Div_DurationType1,
                    DurationTypeDetail: {
                        ...DurationTypeDetail,
                        OtherDurationType: {
                            ...OtherDurationType,
                            HoursFrom: {
                                ...HoursFrom,
                                value: item,
                                refresh: !HoursFrom.refresh
                            }
                        }
                    }
                }
            },
            () => this.HoursChange()
        );
    };

    //change HoursTo
    onChangeHoursTo = item => {
        const { Div_DurationType1 } = this.state,
            { DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType } = DurationTypeDetail,
            { HoursTo } = OtherDurationType;

        this.setState(
            {
                Div_DurationType1: {
                    ...Div_DurationType1,
                    DurationTypeDetail: {
                        ...DurationTypeDetail,
                        OtherDurationType: {
                            ...OtherDurationType,
                            HoursTo: {
                                ...HoursTo,
                                value: item,
                                refresh: !HoursTo.refresh
                            }
                        }
                    }
                }
            },
            () => this.HoursChange()
        );
    };

    //change ConfigLeaveHoursDetail
    onChangeConfigLeaveHoursDetail = item => {
        const { LeaveHoursDetail } = this.state,
            { ConfigLeaveHoursDetail } = LeaveHoursDetail;

        this.setState(
            {
                LeaveHoursDetail: {
                    ...LeaveHoursDetail,
                    ConfigLeaveHoursDetail: {
                        ...ConfigLeaveHoursDetail,
                        value: item,
                        refresh: !ConfigLeaveHoursDetail.refresh
                    }
                }
            },
            () => {
                // var _fromTo = $('#ConfigLeaveHoursDetail').val();
                // _httpGet(uriHr + 'Att_GetData/GetLeaveHoursAndLeaveDay?LeaveHoursDetail='
                //   + _fromTo + '&ShiftID=' + $('#ShiftID').val()).then(function (data) {
                //     if (data) {
                //       var lstData = data.split('|'),
                //         hours = lstData[0].replace('"', ''),
                //         day = lstData[1].replace('"', '');
                //       $('#LeaveHours').val(hours);
                //       $('#LeaveDays').val(day);
                //       // Gán dữ liệu vào hoursFrom and hoursTo
                //       var hoursFromTo = _fromTo.split(' - ');
                //       $('#HoursFrom').val(hoursFromTo[0]);
                //       $('#HoursTo').val(hoursFromTo[1]);
                //     }
                //   });
            }
        );
    };

    //change ShiftID - ca
    onChangeShiftID = item => {
        const { divShift } = this.state,
            { ShiftID } = divShift;

        this.setState({
            divShift: {
                ...divShift,
                ShiftID: {
                    ...ShiftID,
                    value: item,
                    refresh: !ShiftID.refresh
                }
            }
        });
    };

    //change NoNightStay
    onChangeNoNightStay = () => {
        const { DateStart, DateEnd, Div_DurationType1, Div_TypeHalfShift1, VehicleID } = this.state,
            { DurationType } = Div_DurationType1,
            { TypeHalfShift } = Div_TypeHalfShift1;
        let _DateStart = DateStart.value,
            _DateEnd = DateEnd.value;

        if (moment(_DateStart).format('YYYYDDMM') == moment(_DateEnd).format('YYYYMMDD')) {
            var durationtype = DurationType.value ? DurationType.value.Value : null;
            this.ComputeTypeHalfShift(durationtype);
        } else {
            let type = TypeHalfShift.value ? TypeHalfShift.value.Value : null;
            if (type == 'E_FULLSHIFT') {
                type = '';
            }
            this.ComputeTypeHalfShift(type);
        }
        this.loadDistanceByVehicle(VehicleID.value ? VehicleID.value.ID : null);
    };

    //change VehicleID
    onChangeVehicleID = item => {
        const { VehicleID, DateStart, DateEnd, MissionDistanceID, Div_DurationType1, Div_TypeHalfShift1 } = this.state,
            { TypeHalfShift } = Div_TypeHalfShift1,
            { DurationType } = Div_DurationType1;

        let _DateStart = DateStart.value,
            _DateEnd = DateEnd.value;

        if (moment(_DateStart).format('YYYYMMDD') == moment(_DateEnd).format('YYYYMMDD')) {
            let durationtype = DurationType.value ? DurationType.value.Value : null;
            if (durationtype == 'E_OUT_OF_SHIFT' || durationtype == 'E_MIDDLEOFSHIFT') {
                this.getMidbleHours();
            } else {
                this.ComputeTypeHalfShift(durationtype);
            }
        } else {
            let type = TypeHalfShift.value ? TypeHalfShift.value.Value : null;
            if (type == 'E_FULLSHIFT') {
                type = '';
            }
            this.ComputeTypeHalfShift(type);
        }

        let vehicleID = item ? item.ID : null;
        if (vehicleID) {
            this.setState(
                {
                    VehicleID: {
                        ...VehicleID,
                        value: item,
                        refresh: !VehicleID.refresh
                    }
                },
                () => this.loadDistanceByVehicle(vehicleID)
            );
        } else {
            this.setState(
                {
                    VehicleID: {
                        ...VehicleID,
                        value: null,
                        refresh: !VehicleID.refresh
                    },
                    MissionDistanceID: {
                        ...MissionDistanceID,
                        value: null,
                        refresh: !MissionDistanceID.refresh
                    }
                },
                () => this.GetMissionDistanceMulti()
            );
        }
    };

    //change AddressIDIn
    onChangeAddressIDIn = item => {

        const { AddressIDIn } = this.state;
        this.setState(
            {
                AddressIDIn: {
                    ...AddressIDIn,
                    value: item,
                    refresh: !AddressIDIn.refresh
                }
            },
            () => {
                this.changeAddressATT(item ? item.ID : null);
            }
        );
    };

    //change AddressIDOut
    onChangeAddressIDOut = item => {
        const { AddressIDOut } = this.state;
        this.setState(
            {
                AddressIDOut: {
                    ...AddressIDOut,
                    value: item,
                    refresh: !AddressIDOut.refresh
                }
            },
            () => this.changeAddressATTCountry(item ? item.ID : null)
        );
    };

    //change TypeOfServiceID
    onChangeTypeOfServiceID = item => {
        const { TypeOfServiceID } = this.state;
        this.setState({
            TypeOfServiceID: {
                ...TypeOfServiceID,
                value: item,
                refresh: !TypeOfServiceID.refresh
            }
        });
    };

    //change HaveMeal
    onChangeHaveMeal = item => {
        const { hasIsMeal } = this.state,
            { HaveMeal } = hasIsMeal;

        this.setState({
            hasIsMeal: {
                ...hasIsMeal,
                HaveMeal: {
                    ...HaveMeal,
                    value: item,
                    refresh: !HaveMeal.refresh
                }
            }
        });
    };
    //change MissionDistanceID
    onChangeMissionDistanceID = item => {
        const { MissionDistanceID } = this.state;
        this.setState({
            MissionDistanceID: {
                ...MissionDistanceID,
                value: item,
                refresh: !MissionDistanceID.refresh
            }
        });
    };

    //change TravelWarrantID
    onChangeTravelWarrantID = item => {
        const { TravelWarrantID } = this.state;
        this.setState({
            TravelWarrantID: {
                ...TravelWarrantID,
                value: item,
                refresh: !TravelWarrantID.refresh
            }
        });
    };

    //change MissionPlaceInID
    onChangeMissionPlaceInID = item => {
        const { MissionPlaceInID } = this.state;
        this.setState({
            MissionPlaceInID: {
                ...MissionPlaceInID,
                value: item,
                refresh: !MissionPlaceInID.refresh
            }
        });
    };

    //change MissionPlaceOutID
    onChangeMissionPlaceOutID = item => {
        const { MissionPlaceOutID } = this.state;
        this.setState({
            MissionPlaceOutID: {
                ...MissionPlaceOutID,
                value: item,
                refresh: !MissionPlaceOutID.refresh
            }
        });
    };

    //#region [change Type]
    onPressE_IN = () => {
        const { Type } = this.state,
            { E_IN, E_OUT, E_DOMESTIC } = Type;
        this.setState(
            {
                Type: {
                    ...Type,
                    value: 'E_IN',
                    E_IN: {
                        ...E_IN,
                        value: true,
                        refresh: !E_IN.refresh
                    },
                    E_DOMESTIC: {
                        ...E_DOMESTIC,
                        value: false,
                        refresh: !E_DOMESTIC.refresh
                    },
                    E_OUT: {
                        ...E_OUT,
                        value: false,
                        refresh: !E_OUT.refresh
                    }
                }
            },
            () => this.onChangeType('E_IN')
        );
    };

    onPressE_DOMESTIC = () => {
        const { Type } = this.state,
            { E_IN, E_OUT, E_DOMESTIC } = Type;
        this.setState(
            {
                Type: {
                    ...Type,
                    value: 'E_DOMESTIC',
                    E_DOMESTIC: {
                        ...E_DOMESTIC,
                        value: true,
                        refresh: !E_DOMESTIC.refresh
                    },
                    E_IN: {
                        ...E_IN,
                        value: false,
                        refresh: !E_IN.refresh
                    },
                    E_OUT: {
                        ...E_OUT,
                        value: false,
                        refresh: !E_OUT.refresh
                    }
                }
            },
            () => this.onChangeType('E_DOMESTIC')
        );
    };

    onPressE_OUT = () => {
        const { Type } = this.state,
            { E_IN, E_OUT, E_DOMESTIC } = Type;
        this.setState(
            {
                Type: {
                    ...Type,
                    value: 'E_OUT',
                    E_OUT: {
                        ...E_OUT,
                        value: true,
                        refresh: !E_OUT.refresh
                    },
                    E_DOMESTIC: {
                        ...E_DOMESTIC,
                        value: false,
                        refresh: !E_DOMESTIC.refresh
                    },
                    E_IN: {
                        ...E_IN,
                        value: false,
                        refresh: !E_IN.refresh
                    }
                }
            },
            () => this.onChangeType('E_OUT')
        );
    };
    //#endregion

    //#endregion

    //#region [view cost]
    showDetailCost = () => {
        const { ID } = this.state;
        if (ID) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/GetBusinessTripById', {
                id: ID,
                screenName: ScreenName.AttSubmitBusinessTrip,
                uri: dataVnrStorage.apiConfig.uriHr
            }).then(res => {
                VnrLoadingSevices.hide();
                DrawerServices.navigate('AttSubmitBusinessTripViewCost', {
                    dataItem: res
                });
            });
        }
    };

    hideDetailCost = () => {
        this.setState({
            dataBusinessCost: {
                isVisible: false,
                data: []
            }
        });
    };

    viewListDetailCost = () => {
        const { itemContent, textLableInfo } = styleScreenDetail,
            { dataBusinessCost } = this.state,
            { data } = dataBusinessCost;

        if (data && data.length == 0) {
            return <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return data.map((item, index) => {
            return (
                <View
                    key={index}
                    style={styles.viewListDetailCost}
                >
                    <View style={itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, textLableInfo]}
                                i18nKey={'BusinessTripNorm__E_CostType'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            <VnrText value={item['MissionCostTypeName']} />
                        </View>
                    </View>
                    <View style={itemContent}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, textLableInfo]}
                                i18nKey={'HRM_Att_LeaveDayBusiness_Cost'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            <VnrText value={item['Cost']} />
                        </View>
                    </View>
                    <View style={[itemContent, CustomStyleSheet.borderBottomWidth(0)]}>
                        <View style={styleSheets.viewLable}>
                            <VnrText
                                style={[styleSheets.text, textLableInfo]}
                                i18nKey={'HRM_Att_LeaveDayBusiness_CurrentName'}
                            />
                        </View>
                        <View style={styleSheets.viewControl}>
                            <VnrText value={item['CurrencyName']} />
                        </View>
                    </View>
                </View>
            );
        });
    };
    //#endregion

    //#region [Lưu]

    onSave = (navigation, isCreate, isSend) => {

        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        const {
                ID,
                Profile,
                DateStart,
                DateEnd,
                DecisionNo,
                LeaveDayTypeFull,
                LeaveDayTypeByGrade,
                Div_DurationType1,
                Div_TypeHalfShift1,
                divShift,
                Type,
                AddressIDIn,
                AddressIDOut,
                MissionPlaceOutID,
                PlaceOutFromID,
                MissionPlaceInID,
                PlaceInFromID,
                TravelWarrantID,
                Route,
                VehicleID,
                MissionDistanceID,
                NoNightStay,
                hasIsMeal,
                TypeOfServiceID,
                IsHaveCosts,
                BusinessReason,
                FileAttachment,
                UserApproveID,
                UserApproveID3,
                UserApproveID4,
                UserApproveID2
            } = this.state,
            { LeaveDayTypeID } = LeaveDayTypeFull,
            { TempLeaveDayTypeID } = LeaveDayTypeByGrade,
            { DurationType, DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
            { LeaveDays } = DurationTypeFullShift,
            { HoursFrom, HoursTo, LeaveHours } = OtherDurationType,
            { TypeHalfShift, divTypeHalfShiftContent } = Div_TypeHalfShift1,
            { divTypeHalfShiftLeaveDay, divTypeHalfShiftLeaveHours } = divTypeHalfShiftContent,
            { TypeHalfShiftLeaveDays } = divTypeHalfShiftLeaveDay,
            { TypeHalfShiftLeaveHours } = divTypeHalfShiftLeaveHours,
            { ShiftID } = divShift,
            { HaveMeal } = hasIsMeal,
            { apiConfig, currentUser } = dataVnrStorage,
            { info } = currentUser,
            { userid } = info,
            { uriPor } = apiConfig;

        let params = {
            IsPortal: true,
            Status: 'E_SUBMIT',
            BusinessReason: BusinessReason.value,
            Route: Route.value,
            DateStart: DateStart.value,
            DateEnd: DateEnd.value,
            LeaveDayTypeID: LeaveDayTypeID.value ? LeaveDayTypeID.value.ID : null,
            TempLeaveDayTypeID: TempLeaveDayTypeID.value ? TempLeaveDayTypeID.value.ID : null,
            DurationType: DurationType.value ? DurationType.value.Value : null,
            HoursFrom: typeof HoursFrom.value === 'string' ? HoursFrom.value : moment(HoursFrom.value).format('HH:mm'),
            HoursTo: typeof HoursTo.value === 'string' ? HoursTo.value : moment(HoursTo.value).format('HH:mm'),
            LeaveHours:
                !LeaveHours.value || LeaveHours.value == 0 || LeaveHours.value == '0'
                    ? TypeHalfShiftLeaveHours.value
                    : LeaveHours.value,
            LeaveDays: LeaveDays.value,
            TypeHalfShift: TypeHalfShift.value ? TypeHalfShift.value.Value : null,
            TypeHalfShiftLeaveDays: TypeHalfShiftLeaveDays.value,
            TypeHalfShiftLeaveHours: TypeHalfShiftLeaveHours.value,
            ShiftID: ShiftID.value ? ShiftID.value.ID : null,
            ProfileID: Profile.ID,
            UserApproveID: UserApproveID.value ? UserApproveID.value.ID : null,
            UserApproveID2: UserApproveID2.value ? UserApproveID2.value.ID : null,
            UserApproveID3: UserApproveID3.value ? UserApproveID3.value.ID : null,
            UserApproveID4: UserApproveID4.value ? UserApproveID4.value.ID : null,
            TotalDuration: LeaveDays.value,
            FileAttachment: FileAttachment.value ? FileAttachment.value.map(item => item.fileName).join(',') : null,
            Host: apiConfig ? apiConfig.uriPor : null,
            UserRegister: userid,
            AddressID: '',
            AddressIDIn: AddressIDIn.value ? AddressIDIn.value.ID : null,
            AddressIDOut: AddressIDOut.value ? AddressIDOut.value.ID : null,
            DecisionNo: DecisionNo.value,
            HaveMeal: HaveMeal.value ? HaveMeal.value.map(itemMeal => itemMeal.Value).join() : null,
            IsHaveCosts: IsHaveCosts.value,
            IsTrip: true,
            MissionDistanceID: MissionDistanceID.value ? MissionDistanceID.value.ID : null,
            MissionPlaceInID: MissionPlaceInID.value ? MissionPlaceInID.value.ID : null,
            PlaceInFromID: PlaceInFromID.value ? PlaceInFromID.value.ID : null,
            MissionPlaceOutID: MissionPlaceOutID.value ? MissionPlaceOutID.value.ID : null,
            PlaceOutFromID: PlaceOutFromID.value ? PlaceOutFromID.value.ID : null,
            NoNightStay: NoNightStay.value,
            TravelWarrantID: TravelWarrantID.value ? TravelWarrantID.value.ID : null,
            Type: Type.value,
            TypeOfServiceID: TypeOfServiceID.value ? TypeOfServiceID.value.ID : null,
            VehicleID: VehicleID.value ? VehicleID.value.ID : null,
            IsExcludeProbation: this.IsExcludeProbation
        };

        if (isSend) {
            params = {
                ...params,
                SendEmailStatus: 'E_SUBMIT',
                Host: uriPor,
                IsAddNewAndSendMail: true
            };
        }

        if (Type.value == 'E_IN' || Type.value == 'E_DOMESTIC') {
            params = {
                ...params,
                MissionPlaceOutID: null,
                PlaceOutFromID: null
            };
        } else if (Type.value == 'E_OUT') {
            params = {
                ...params,
                MissionPlaceInID: null,
                PlaceInFromID: null
            };
        }

        if (ID) {
            params = {
                ...params,
                ID
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Att_Leaveday', params).then(data => {
            VnrLoadingSevices.hide();

            try {
                if (data.ActionStatus == 'Success' || data.ActionStatus == 'E_SUBMIT') {
                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);

                    if (isCreate) {
                        this.refreshView();
                    } else {
                        navigation.goBack();
                    }

                    const { reload } = this.props.navigation.state.params;
                    if (reload && typeof reload == 'function') {
                        reload();
                    }
                } else if (data.ActionStatus == 'CheckLeavedayProbationning') {
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        iconType: EnumIcon.E_INFO,
                        message: translate('CheckLeavedayProbationning'),
                        onCancel: () => {},
                        onConfirm: () => {
                            this.IsExcludeProbation = true;
                            this.onSave(navigation, isCreate, isSend);
                        }
                    });
                } else {
                    ToasterSevice.showWarning(data.ActionStatus);

                    //xử lý lại event Save
                    this.isProcessing = false;
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    onSaveAndCreate = navigation => {
        this.onSave(navigation, true, null);
    };

    onSaveAndSend = navigation => {
        this.onSave(navigation, null, true);
    };
    //#endregion

    render() {
        const {
                DateStart,
                DateEnd,
                DecisionNo,
                LeaveDayTypeFull,
                LeaveDayTypeByGrade,
                Div_DurationType1,
                Div_TypeHalfShift1,
                divShift,
                Type,
                AddressIDIn,
                AddressIDOut,
                MissionPlaceOutID,
                PlaceOutFromID,
                MissionPlaceInID,
                PlaceInFromID,
                TravelWarrantID,
                Route,
                VehicleID,
                MissionDistanceID,
                NoNightStay,
                hasIsMeal,
                TypeOfServiceID,
                IsHaveCosts,
                BusinessReason,
                FileAttachment,
                UserApproveID,
                UserApproveID3,
                UserApproveID4,
                UserApproveID2,
                fieldValid,
                dataBusinessCost
            } = this.state,
            { LeaveDayTypeID } = LeaveDayTypeFull,
            { TempLeaveDayTypeID } = LeaveDayTypeByGrade,
            { DurationType, DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
            { LeaveDays } = DurationTypeFullShift,
            { HoursFrom, HoursTo, LeaveHoursDetail, LeaveHours } = OtherDurationType,
            { ConfigLeaveHoursDetail } = LeaveHoursDetail,
            { TypeHalfShift, divTypeHalfShiftContent } = Div_TypeHalfShift1,
            { divTypeHalfShiftLeaveDay, divTypeHalfShiftLeaveHours } = divTypeHalfShiftContent,
            { TypeHalfShiftLeaveDays } = divTypeHalfShiftLeaveDay,
            { TypeHalfShiftLeaveHours } = divTypeHalfShiftLeaveHours,
            { ShiftID } = divShift,
            { E_IN, E_DOMESTIC, E_OUT } = Type,
            { HaveMeal } = hasIsMeal;

        const {
            textLableInfo,
            contentViewControl,
            viewLable,
            viewControl,
            controlDate_To,
            controlDate_from,
            formDate_To_From,
            viewInputMultiline
        } = stylesListPickerControl;

        //#region [Xử lý 3 nút lưu]
        const listActions = [];

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_List_Travel_New_CreateOrUpdate_btnSaveandSendMail'] &&
            PermissionForAppMobile.value['New_List_Travel_New_CreateOrUpdate_btnSaveandSendMail']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_SENMAIL,
                title: translate('HRM_Common_SaveAndSendMail'),
                onPress: () => this.onSaveAndSend(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_List_Travel_New_CreateOrUpdate_btnSaveandClose'] &&
            PermissionForAppMobile.value['New_List_Travel_New_CreateOrUpdate_btnSaveandClose']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_CLOSE,
                title: translate('HRM_Common_SaveClose'),
                onPress: () => this.onSave(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_List_Travel_New_CreateOrUpdate_btnSaveandNew'] &&
            PermissionForAppMobile.value['New_List_Travel_New_CreateOrUpdate_btnSaveandNew']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_NEW,
                title: translate('HRM_Common_SaveNew'),
                onPress: () => this.onSaveAndCreate(this.props.navigation)
            });
        }

        if (this.isModify)
            listActions.push({
                type: 'TRAVEL_COSTS',
                title: translate('HRM_Common_BusinessTravelCosts_View'),
                onPress: () => this.showDetailCost()
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
                        {/* Thời gian công tác - DateStart, DateEnd */}
                        {DateStart.visibleConfig && DateStart.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DateStart.label} />

                                    {/* valid DateStart */}
                                    {fieldValid.DateStart && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <View style={formDate_To_From}>
                                        <View style={controlDate_from}>
                                            <VnrDate
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DateStart.value}
                                                refresh={DateStart.refresh}
                                                disable={DateStart.disable}
                                                type={'date'}
                                                onFinish={value => this.onChangeDateStart(value)}
                                            />
                                        </View>
                                        <View style={controlDate_To}>
                                            <VnrDate
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DateEnd.value}
                                                refresh={DateEnd.refresh}
                                                disable={DateEnd.disable}
                                                type={'date'}
                                                onFinish={value => this.onChangeDateEnd(value)}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Số QĐ - DecisionNo */}
                        {DecisionNo.visibleConfig && DecisionNo.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DecisionNo.label} />
                                    {fieldValid.DecisionNo && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={DecisionNo.disable}
                                        refresh={DecisionNo.refresh}
                                        value={DecisionNo.value}
                                        multiline={false}
                                        onChangeText={text =>
                                            this.setState({
                                                DecisionNo: {
                                                    ...DecisionNo,
                                                    value: text,
                                                    refresh: !DecisionNo.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Loại công tác - LeaveDayTypeFull, LeaveDayTypeID */}
                        {LeaveDayTypeFull.visibleConfig && LeaveDayTypeFull.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={LeaveDayTypeID.label} />

                                    {/* valid LeaveDayTypeID */}
                                    {fieldValid.LeaveDayTypeID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={LeaveDayTypeID.api}
                                        refresh={LeaveDayTypeID.refresh}
                                        textField={LeaveDayTypeID.textField}
                                        valueField={LeaveDayTypeID.valueField}
                                        filter={true}
                                        value={LeaveDayTypeID.value}
                                        filterServer={false}
                                        disable={LeaveDayTypeID.disable}
                                        onFinish={item => this.onChangeLeaveDayTypeID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Loại công tác - LeaveDayTypeByGrade, TempLeaveDayTypeID */}
                        {LeaveDayTypeByGrade.visibleConfig && LeaveDayTypeByGrade.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={TempLeaveDayTypeID.label}
                                    />

                                    {/* valid TempLeaveDayTypeID */}
                                    {fieldValid.TempLeaveDayTypeID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={TempLeaveDayTypeID.data}
                                        refresh={TempLeaveDayTypeID.refresh}
                                        textField={TempLeaveDayTypeID.textField}
                                        valueField={TempLeaveDayTypeID.valueField}
                                        filter={true}
                                        value={TempLeaveDayTypeID.value}
                                        filterServer={false}
                                        disable={TempLeaveDayTypeID.disable}
                                        onFinish={item => this.onChangeTempLeaveDayTypeID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Loại - Div_DurationType1, DurationType */}
                        {Div_DurationType1.visibleConfig && Div_DurationType1.visible && (
                            <View>
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={DurationType.label}
                                        />

                                        {/* valid DurationType */}
                                        {fieldValid.DurationType && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            dataLocal={DurationType.data}
                                            refresh={DurationType.refresh}
                                            textField={DurationType.textField}
                                            valueField={DurationType.valueField}
                                            filter={true}
                                            value={DurationType.value}
                                            filterServer={false}
                                            disable={DurationType.disable}
                                            onFinish={item => this.onChangeDurationType(item)}
                                        />
                                    </View>
                                </View>

                                {DurationTypeDetail.visibleConfig && DurationTypeDetail.visible && (
                                    <View>
                                        {OtherDurationType.visible && OtherDurationType.visibleConfig && (
                                            <View>
                                                {/* giờ bắt đầu - HoursFrom */}
                                                {HoursFrom.visible && (
                                                    <View style={contentViewControl}>
                                                        <View style={viewLable}>
                                                            <VnrText
                                                                style={[styleSheets.text, textLableInfo]}
                                                                i18nKey={HoursFrom.label}
                                                            />

                                                            {/* valid HoursFrom */}
                                                            {fieldValid.HoursFrom && (
                                                                <VnrText
                                                                    style={styleValid}
                                                                    i18nKey={'HRM_Valid_Char'}
                                                                />
                                                            )}
                                                        </View>
                                                        <View style={viewControl}>
                                                            <VnrDate
                                                                format={'HH:mm'}
                                                                value={HoursFrom.value}
                                                                refresh={HoursFrom.refresh}
                                                                disable={HoursFrom.disable}
                                                                type={'time'}
                                                                onFinish={value => this.onChangeHoursFrom(value)}
                                                            />
                                                        </View>
                                                    </View>
                                                )}

                                                {/* giờ kết thúc - HoursTo */}
                                                {HoursTo.visible && (
                                                    <View style={contentViewControl}>
                                                        <View style={viewLable}>
                                                            <VnrText
                                                                style={[styleSheets.text, textLableInfo]}
                                                                i18nKey={HoursTo.label}
                                                            />

                                                            {/* valid HoursTo*/}
                                                            {fieldValid.HoursTo && (
                                                                <VnrText
                                                                    style={styleValid}
                                                                    i18nKey={'HRM_Valid_Char'}
                                                                />
                                                            )}
                                                        </View>
                                                        <View style={viewControl}>
                                                            <VnrDate
                                                                format={'HH:mm'}
                                                                value={HoursTo.value}
                                                                refresh={HoursTo.refresh}
                                                                disable={HoursTo.disable}
                                                                type={'time'}
                                                                onFinish={value => this.onChangeHoursTo(value)}
                                                            />
                                                        </View>
                                                    </View>
                                                )}

                                                {/* số giờ nghỉ chạy theo cấu hình khung giờ trong chế độ công - ConfigLeaveHoursDetail - LeaveHoursDetail */}
                                                {LeaveHoursDetail.visible && (
                                                    <View style={contentViewControl}>
                                                        <View style={viewLable}>
                                                            <VnrText
                                                                style={[styleSheets.text, textLableInfo]}
                                                                i18nKey={ConfigLeaveHoursDetail.label}
                                                            />

                                                            {/* valid LeaveHoursDetail */}
                                                            {fieldValid.LeaveHoursDetail && (
                                                                <VnrText
                                                                    style={styleValid}
                                                                    i18nKey={'HRM_Valid_Char'}
                                                                />
                                                            )}
                                                        </View>
                                                        <View style={viewControl}>
                                                            <VnrPickerQuickly
                                                                dataLocal={ConfigLeaveHoursDetail.data}
                                                                refresh={ConfigLeaveHoursDetail.refresh}
                                                                textField="LeaveHoursDetail"
                                                                valueField="LeaveHoursDetail"
                                                                filter={false}
                                                                value={ConfigLeaveHoursDetail.value}
                                                                disable={ConfigLeaveHoursDetail.disable}
                                                                onFinish={item =>
                                                                    this.onChangeConfigLeaveHoursDetail(item)
                                                                }
                                                            />
                                                        </View>
                                                    </View>
                                                )}

                                                {/* số giờ nghỉ chạy mặc định - LeaveHours */}
                                                {LeaveHours.visible && (
                                                    <View style={contentViewControl}>
                                                        <View style={viewLable}>
                                                            <VnrText
                                                                style={[styleSheets.text, textLableInfo]}
                                                                i18nKey={LeaveHours.label}
                                                            />

                                                            {/* valid LeaveHours */}
                                                            {fieldValid.LeaveHours && (
                                                                <VnrText
                                                                    style={styleValid}
                                                                    i18nKey={'HRM_Valid_Char'}
                                                                />
                                                            )}
                                                        </View>
                                                        <View style={viewControl}>
                                                            <VnrText
                                                                style={[styleSheets.text, textLableInfo]}
                                                                value={LeaveHours.value}
                                                            />
                                                        </View>
                                                    </View>
                                                )}
                                            </View>
                                        )}

                                        {DurationTypeFullShift.visible && DurationTypeFullShift.visibleConfig && (
                                            <View>
                                                {/* LeaveDays */}
                                                <View style={contentViewControl}>
                                                    <View style={viewLable}>
                                                        <VnrText
                                                            style={[styleSheets.text, textLableInfo]}
                                                            i18nKey={LeaveDays.label}
                                                        />

                                                        {/* valid LeaveDays */}
                                                        {fieldValid.LeaveDays && (
                                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                        )}
                                                    </View>
                                                    <View style={viewControl}>
                                                        <VnrText
                                                            style={[styleSheets.text, textLableInfo]}
                                                            value={LeaveDays.value}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Loại - Div_TypeHalfShift1, TypeHalfShift */}
                        {Div_TypeHalfShift1.visibleConfig && Div_TypeHalfShift1.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={TypeHalfShift.label} />

                                    {/* valid TypeHalfShift */}
                                    {fieldValid.TypeHalfShift && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={TypeHalfShift.data}
                                        refresh={TypeHalfShift.refresh}
                                        textField={TypeHalfShift.textField}
                                        valueField={TypeHalfShift.valueField}
                                        filter={true}
                                        value={TypeHalfShift.value}
                                        filterServer={false}
                                        disable={TypeHalfShift.disable}
                                        onFinish={item => this.onChangeTypeHalfShift(item)}
                                    />
                                </View>

                                {divTypeHalfShiftContent.visible && divTypeHalfShiftContent.visibleConfig && (
                                    <View>
                                        {/* divTypeHalfShiftLeaveDay - TypeHalfShiftLeaveDays */}
                                        {divTypeHalfShiftLeaveDay.visible && (
                                            <View>
                                                <View style={contentViewControl}>
                                                    <View style={viewLable}>
                                                        <VnrText
                                                            style={[styleSheets.text, textLableInfo]}
                                                            i18nKey={TypeHalfShiftLeaveDays.label}
                                                        />

                                                        {/* valid TypeHalfShiftLeaveDays */}
                                                        {fieldValid.TypeHalfShiftLeaveDays && (
                                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                        )}
                                                    </View>
                                                    <View style={viewControl}>
                                                        <VnrText
                                                            style={[styleSheets.text, textLableInfo]}
                                                            value={TypeHalfShiftLeaveDays.value}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        )}

                                        {/* divTypeHalfShiftLeaveHours - TypeHalfShiftLeaveHours */}
                                        {divTypeHalfShiftLeaveHours.visible && (
                                            <View>
                                                <View style={contentViewControl}>
                                                    <View style={viewLable}>
                                                        <VnrText
                                                            style={[styleSheets.text, textLableInfo]}
                                                            i18nKey={TypeHalfShiftLeaveHours.label}
                                                        />

                                                        {/* valid TypeHalfShiftLeaveHours */}
                                                        {fieldValid.TypeHalfShiftLeaveHours && (
                                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                        )}
                                                    </View>
                                                    <View style={viewControl}>
                                                        <VnrText
                                                            style={[styleSheets.text, textLableInfo]}
                                                            value={TypeHalfShiftLeaveHours.value}
                                                        />
                                                    </View>
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>
                        )}

                        {/* ca làm việc - ShiftID - divShift */}
                        {divShift.visible && divShift.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={ShiftID.label} />

                                    {/* valid ShiftID */}
                                    {fieldValid.ShiftID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={ShiftID.data}
                                        refresh={ShiftID.refresh}
                                        textField={ShiftID.textField}
                                        valueField={ShiftID.valueField}
                                        filter={true}
                                        value={ShiftID.value}
                                        filterServer={false}
                                        autoFilter={true}
                                        filterParams="text"
                                        disable={ShiftID.disable}
                                        onFinish={item => this.onChangeShiftID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Nội tỉnh, Ngoại tỉnh, Nước ngoài */}
                        <View style={styles.styListBtnTypePregnancy}>
                            {/* Nội tỉnh - E_IN */}
                            {E_IN.visibleConfig && E_IN.visible && (
                                <TouchableOpacity
                                    style={[
                                        styles.styBtnTypePregnancy,
                                        E_IN.value == true && styles.styBtnTypePregnancyActive
                                    ]}
                                    onPress={() => this.onPressE_IN()}
                                >
                                    <VnrText
                                        style={[
                                            styleSheets.text,
                                            E_IN.value == true && styles.styBtnTypePregnancyTextActive
                                        ]}
                                        i18nKey={E_IN.label}
                                    />
                                </TouchableOpacity>
                            )}

                            {/* Ngoại tỉnh - E_DOMESTIC */}
                            {E_DOMESTIC.visibleConfig && E_DOMESTIC.visible && (
                                <TouchableOpacity
                                    style={[
                                        styles.styBtnTypePregnancy,
                                        E_DOMESTIC.value == true && styles.styBtnTypePregnancyActive
                                    ]}
                                    onPress={() => this.onPressE_DOMESTIC()}
                                >
                                    <VnrText
                                        style={[
                                            styleSheets.text,
                                            E_DOMESTIC.value == true && styles.styBtnTypePregnancyTextActive
                                        ]}
                                        i18nKey={E_DOMESTIC.label}
                                    />
                                </TouchableOpacity>
                            )}

                            {/* Ngoài nước - E_OUT */}
                            {E_OUT.visibleConfig && E_OUT.visible && (
                                <TouchableOpacity
                                    style={[
                                        styles.styBtnTypePregnancy,
                                        E_OUT.value == true && styles.styBtnTypePregnancyActive
                                    ]}
                                    onPress={() => this.onPressE_OUT()}
                                >
                                    <VnrText
                                        style={[
                                            styleSheets.text,
                                            E_OUT.value == true && styles.styBtnTypePregnancyTextActive
                                        ]}
                                        i18nKey={E_OUT.label}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Địa chỉ cụ thể - AddressIDIn */}
                        {AddressIDIn.visibleConfig && AddressIDIn.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={AddressIDIn.label} />

                                    {/* valid AddressIDIn */}
                                    {fieldValid.AddressIDIn && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={AddressIDIn.api}
                                        refresh={AddressIDIn.refresh}
                                        textField={AddressIDIn.textField}
                                        valueField={AddressIDIn.valueField}
                                        filter={true}
                                        value={AddressIDIn.value}
                                        filterServer={false}
                                        disable={AddressIDIn.disable}
                                        onFinish={item => this.onChangeAddressIDIn(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Địa chỉ cụ thể - AddressIDOut */}
                        {AddressIDOut.visibleConfig && AddressIDOut.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={AddressIDOut.label} />

                                    {/* valid AddressIDOut */}
                                    {fieldValid.AddressIDOut && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={AddressIDOut.api}
                                        refresh={AddressIDOut.refresh}
                                        textField={AddressIDOut.textField}
                                        valueField={AddressIDOut.valueField}
                                        filter={true}
                                        value={AddressIDOut.value}
                                        filterServer={false}
                                        disable={AddressIDOut.disable}
                                        onFinish={item => this.onChangeAddressIDOut(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Nơi đi ngoài nước - PlaceOutFromID */}
                        {PlaceOutFromID.visibleConfig && PlaceOutFromID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PlaceOutFromID.label} />

                                    {/* valid PlaceOutFromID */}
                                    {fieldValid.PlaceOutFromID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={PlaceOutFromID.api}
                                        refresh={PlaceOutFromID.refresh}
                                        textField={PlaceOutFromID.textField}
                                        valueField={PlaceOutFromID.valueField}
                                        filter={true}
                                        value={PlaceOutFromID.value}
                                        filterServer={false}
                                        disable={PlaceOutFromID.disable}
                                        onFinish={item =>
                                            this.setState({
                                                PlaceOutFromID: {
                                                    ...PlaceOutFromID,
                                                    value: item,
                                                    refresh: !PlaceOutFromID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Nơi đến ngoài nước - MissionPlaceOutID */}
                        {MissionPlaceOutID.visibleConfig && MissionPlaceOutID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={MissionPlaceOutID.label}
                                    />

                                    {/* valid MissionPlaceOutID */}
                                    {fieldValid.MissionPlaceOutID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={MissionPlaceOutID.api}
                                        refresh={MissionPlaceOutID.refresh}
                                        textField={MissionPlaceOutID.textField}
                                        valueField={MissionPlaceOutID.valueField}
                                        filter={true}
                                        value={MissionPlaceOutID.value}
                                        filterServer={false}
                                        disable={MissionPlaceOutID.disable}
                                        onFinish={item => this.onChangeMissionPlaceOutID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Nơi đi trong nước - PlaceInFromID */}
                        {PlaceInFromID.visibleConfig && PlaceInFromID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PlaceInFromID.label} />

                                    {/* valid PlaceInFromID */}
                                    {fieldValid.PlaceInFromID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={PlaceInFromID.api}
                                        refresh={PlaceInFromID.refresh}
                                        textField={PlaceInFromID.textField}
                                        valueField={PlaceInFromID.valueField}
                                        filter={true}
                                        value={PlaceInFromID.value}
                                        filterServer={false}
                                        disable={PlaceInFromID.disable}
                                        onFinish={item =>
                                            this.setState({
                                                PlaceInFromID: {
                                                    ...PlaceInFromID,
                                                    value: item,
                                                    refresh: !PlaceInFromID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Nơi đến trong nước - MissionPlaceInID */}
                        {MissionPlaceInID.visibleConfig && MissionPlaceInID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={MissionPlaceInID.label}
                                    />

                                    {/* valid MissionPlaceInID */}
                                    {fieldValid.MissionPlaceInID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={MissionPlaceInID.api}
                                        refresh={MissionPlaceInID.refresh}
                                        textField={MissionPlaceInID.textField}
                                        valueField={MissionPlaceInID.valueField}
                                        filter={true}
                                        value={MissionPlaceInID.value}
                                        filterServer={false}
                                        disable={MissionPlaceInID.disable}
                                        onFinish={item => this.onChangeMissionPlaceInID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Nơi cấp giấy đi đường - TravelWarrantID */}
                        {TravelWarrantID.visibleConfig && TravelWarrantID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={TravelWarrantID.label}
                                    />

                                    {/* valid TravelWarrantID */}
                                    {fieldValid.TravelWarrantID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={TravelWarrantID.api}
                                        refresh={TravelWarrantID.refresh}
                                        textField={TravelWarrantID.textField}
                                        valueField={TravelWarrantID.valueField}
                                        filter={true}
                                        filterServer={true}
                                        filterParams="keyword"
                                        value={TravelWarrantID.value}
                                        disable={TravelWarrantID.disable}
                                        onFinish={item => this.onChangeTravelWarrantID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Lộ trình - Route */}
                        {Route.visibleConfig && Route.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Route.label} />
                                    {fieldValid.Route && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Route.disable}
                                        refresh={Route.refresh}
                                        value={Route.value}
                                        multiline={true}
                                        onChangeText={text =>
                                            this.setState({
                                                Route: {
                                                    ...Route,
                                                    value: text,
                                                    refresh: !Route.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Loại phương tiện đi lại - VehicleID */}
                        {VehicleID.visibleConfig && VehicleID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={VehicleID.label} />

                                    {/* valid VehicleID */}
                                    {fieldValid.VehicleID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={VehicleID.api}
                                        refresh={VehicleID.refresh}
                                        textField={VehicleID.textField}
                                        valueField={VehicleID.valueField}
                                        filter={true}
                                        value={VehicleID.value}
                                        filterServer={false}
                                        disable={VehicleID.disable}
                                        onFinish={item => this.onChangeVehicleID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Khoảng cách - MissionDistanceID */}
                        {MissionDistanceID.visibleConfig && MissionDistanceID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={MissionDistanceID.label}
                                    />

                                    {/* valid MissionDistanceID */}
                                    {fieldValid.MissionDistanceID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        //api={AddressIDIn.api}
                                        dataLocal={MissionDistanceID.data}
                                        refresh={MissionDistanceID.refresh}
                                        textField={MissionDistanceID.textField}
                                        valueField={MissionDistanceID.valueField}
                                        filter={true}
                                        value={MissionDistanceID.value}
                                        filterServer={false}
                                        disable={MissionDistanceID.disable}
                                        onFinish={item => this.onChangeMissionDistanceID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Số đêm ở khách sạn - NoNightStay */}
                        {NoNightStay.visibleConfig && NoNightStay.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={NoNightStay.label} />

                                    {/* valid NoNightStay */}
                                    {fieldValid.NoNightStay && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        value={NoNightStay.value}
                                        refresh={NoNightStay.refresh}
                                        disable={NoNightStay.disable}
                                        keyboardType={'numeric'}
                                        charType={'double'}
                                        returnKeyType={'done'}
                                        onChangeText={value => {
                                            this.setState({
                                                NoNightStay: {
                                                    ...NoNightStay,
                                                    value,
                                                    refresh: !NoNightStay.refresh
                                                }
                                            });
                                        }}
                                        onBlur={this.onChangeNoNightStay}
                                        onSubmitEditing={this.onChangeNoNightStay}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Suất ăn - hasIsMeal, HaveMeal */}
                        {hasIsMeal.visibleConfig && hasIsMeal.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={HaveMeal.label} />

                                    {/* valid HaveMeal */}
                                    {fieldValid.HaveMeal && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerMulti
                                        api={HaveMeal.api}
                                        value={HaveMeal.value}
                                        refresh={HaveMeal.refresh}
                                        textField={HaveMeal.textField}
                                        valueField={HaveMeal.valueField}
                                        filter={false}
                                        onFinish={items => this.onChangeHaveMeal(items)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Loại dịch vụ - TypeOfServiceID */}
                        {TypeOfServiceID.visibleConfig && TypeOfServiceID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={TypeOfServiceID.label}
                                    />

                                    {/* valid TypeOfServiceID */}
                                    {fieldValid.TypeOfServiceID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={TypeOfServiceID.api}
                                        refresh={TypeOfServiceID.refresh}
                                        textField={TypeOfServiceID.textField}
                                        valueField={TypeOfServiceID.valueField}
                                        filter={true}
                                        value={TypeOfServiceID.value}
                                        filterServer={false}
                                        disable={TypeOfServiceID.disable}
                                        onFinish={item => this.onChangeTypeOfServiceID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Có tính công tác phí - IsHaveCosts */}
                        <View style={styles.styListBtnTypePregnancy}>
                            {IsHaveCosts.visibleConfig && IsHaveCosts.visible && (
                                <TouchableOpacity
                                    style={[
                                        styles.styBtnTypePregnancy,
                                        IsHaveCosts.value == true && styles.styBtnTypePregnancyActive
                                    ]}
                                    onPress={() =>
                                        this.setState({
                                            IsHaveCosts: {
                                                ...IsHaveCosts,
                                                value: !IsHaveCosts.value,
                                                refresh: !IsHaveCosts.refresh
                                            }
                                        })
                                    }
                                >
                                    <VnrText
                                        style={[
                                            styleSheets.text,
                                            IsHaveCosts.value == true && styles.styBtnTypePregnancyTextActive
                                        ]}
                                        i18nKey={IsHaveCosts.label}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* duyệt đầu - UserApproveID */}
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
                                        dataLocal={UserApproveID.data}
                                        refresh={UserApproveID.refresh}
                                        textField={UserApproveID.textField}
                                        valueField={UserApproveID.valueField}
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

                        {/* duyệt giữa - UserApproveID3 */}
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
                                        dataLocal={UserApproveID3.data}
                                        value={UserApproveID3.value}
                                        refresh={UserApproveID3.refresh}
                                        textField={UserApproveID3.textField}
                                        valueField={UserApproveID3.valueField}
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

                        {/* duyệt tiếp theo - UserApproveID4 */}
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
                                        dataLocal={UserApproveID4.data}
                                        value={UserApproveID4.value}
                                        refresh={UserApproveID4.refresh}
                                        textField={UserApproveID4.textField}
                                        valueField={UserApproveID4.valueField}
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

                        {/* duyệt cuối - UserApproveID2 */}
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
                                        dataLocal={UserApproveID2.data}
                                        refresh={UserApproveID2.refresh}
                                        textField={UserApproveID2.textField}
                                        valueField={UserApproveID2.valueField}
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

                        {/* File đính kèm - FileAttachment */}
                        {FileAttachment.visible && FileAttachment.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={FileAttachment.label} />
                                </View>
                                <View style={viewControl}>
                                    <VnrAttachFile
                                        refresh={FileAttachment.refresh}
                                        value={FileAttachment.value}
                                        multiFile={true}
                                        uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                        disable={FileAttachment.disable}
                                        onFinish={file => {
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
                            </View>
                        )}

                        {/* Nơi liên hệ và nội dung công tác -  BusinessReason*/}
                        {BusinessReason.visibleConfig && BusinessReason.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={BusinessReason.label} />
                                    {fieldValid.BusinessReason && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        // disable={BusinessReason.disable}
                                        refresh={BusinessReason.refresh}
                                        value={BusinessReason.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={text =>
                                            this.setState({
                                                BusinessReason: {
                                                    ...BusinessReason,
                                                    value: text,
                                                    refresh: !BusinessReason.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}
                    </KeyboardAwareScrollView>

                    {/* bottom button close, confirm */}
                    <ListButtonSave listActions={listActions} />

                    {dataBusinessCost.isVisible && (
                        <Modal
                            onBackButtonPress={() => this.hideDetailCost()}
                            isVisible={true}
                            onBackdropPress={() => this.hideDetailCost()}
                            customBackdrop={
                                <TouchableWithoutFeedback onPress={() => this.hideDetailCost()}>
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
                                        <TouchableOpacity onPress={() => this.hideDetailCost()}>
                                            <IconColse color={Colors.grey} size={Size.iconSize} />
                                        </TouchableOpacity>
                                        <VnrText
                                            style={styleSheets.lable}
                                            i18nKey={'HRM_Common_BusinessTravelCosts_View'}
                                        />
                                        <IconColse color={Colors.white} size={Size.iconSize} />
                                    </View>
                                    <ScrollView style={styleSheets.flexGrow1flexDirectionColumn}>
                                        {this.viewListDetailCost()}
                                    </ScrollView>
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
    styListBtnTypePregnancy: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: Size.defineSpace,
        justifyContent: 'space-between',
        marginVertical: Size.defineHalfSpace
    },
    styBtnTypePregnancy: {
        paddingHorizontal: Size.defineSpace * 0.8,
        paddingVertical: 5,
        backgroundColor: Colors.gray_3,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 11
    },
    styBtnTypePregnancyActive: {
        backgroundColor: Colors.primary
    },
    styBtnTypePregnancyTextActive: {
        color: Colors.white,
        fontWeight: '500'
    },
    viewListDetailCost: {
        borderColor: Colors.gray_5,
        borderWidth: 0.5,
        borderRadius: 7,
        marginBottom: Size.defineSpace,
        paddingHorizontal: Size.defineHalfSpace,
        paddingVertical: 10,
        marginHorizontal: Size.defineHalfSpace
    }
});
