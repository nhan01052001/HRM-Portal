/* eslint-disable no-undef */
import React, { Component } from 'react';
import {
    View,
    TouchableOpacity,
    StyleSheet,
    Text,
    TouchableWithoutFeedback,
    ScrollView,
    Image,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Size,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    stylesModalPopupBottom,
    styleViewTitleForGroup,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { IconCloseCircle, IconListAlt, IconColse, IconCancel } from '../../../../../constants/Icons';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import HttpService from '../../../../../utils/HttpService';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import moment from 'moment';
import { translate } from '../../../../../i18n/translate';
import { AlertSevice } from '../../../../../components/Alert/Alert';
//import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import { EnumName, EnumIcon } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../utils/DrawerServices';
import { ModalCheckEmpsSevices } from '../../../../../components/modal/ModalCheckEmps';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import Modal from 'react-native-modal';
import { typePaidLeave } from '../../../generalInfo/attInfo/attPaidLeave/AttPaidLeave';
import EmptyData from '../../../../../components/EmptyData/EmptyData';

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
        }
    },
    Profile: {
        ID: null,
        ProfileName: ''
    },
    DateStart: {
        value: null,
        refresh: false
    },
    DateEnd: {
        value: null,
        refresh: false,
        disable: false
    },
    DateReturnToWork: {
        value: null,
        refresh: false,
        visible: false,
        visibleConfig: true
    },
    LeaveTypeGroup: {
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null,
        data: []
    },
    LeaveDayTypeFull: {
        visible: false,
        visibleConfig: true,
        LeaveDayType: {
            disable: false,
            refresh: false,
            value: null,
            data: []
        }
    },
    LeaveDayTypeByGrade: {
        visible: false,
        visibleConfig: true,
        TempLeaveDayType: {
            disable: false,
            refresh: false,
            value: null,
            data: []
        }
    },
    hasIsMeal: {
        visible: false,
        visibleConfig: true,
        IsMeal: {
            value: null,
            refresh: false
        },
        HaveMeal: {
            visible: false,
            disable: false,
            refresh: false,
            value: null
        }
    },
    btnComputeRemainDaysPortal: {
        visible: false,
        visibleConfig: true,
        dayportal: {
            visible: true,
            value: null
        },
        hoursportal: {
            visible: false,
            value: null
        },
        leaveDayTypeView: {
            visible: false,
            value: null,
            visibleConfig: false
        }
    },
    Div_DurationType1: {
        visible: true,
        visibleConfig: true,
        DurationType: {
            visible: true,
            disable: false,
            refresh: false,
            value: null,
            data: []
        },
        DurationTypeDetail: {
            visible: false,
            OtherDurationType: {
                visible: true,
                HoursFrom: {
                    visible: true,
                    value: null,
                    refresh: false,
                    disable: false
                },
                divHoursMiddleOfShift: {
                    visible: false,
                    HoursMiddleOfShift: {
                        disable: false,
                        refresh: false,
                        value: null,
                        data: []
                    }
                },
                HoursTo: {
                    visible: true,
                    value: null,
                    refresh: false,
                    disable: false
                },
                LeaveHoursDetail: {
                    visible: false,
                    ConfigLeaveHoursDetail: {
                        disable: false,
                        refresh: false,
                        value: null,
                        data: []
                    }
                },
                divLeaveHours: {
                    visible: true,
                    LeaveHours: {
                        disable: false,
                        refresh: false,
                        value: null
                    }
                }
            },
            DurationTypeFullShift: {
                visible: true,
                LeaveDays: {
                    disable: false,
                    refresh: false,
                    value: null
                }
            }
        }
    },
    Div_TypeHalfShift1: {
        visible: false,
        visibleConfig: true,
        TypeHalfShift: {
            disable: false,
            refresh: false,
            value: null,
            data: []
        },
        divTypeHalfShiftContent: {
            visible: false,
            divTypeHalfShiftLeaveDay: {
                visible: true,
                TypeHalfShiftLeaveDays: {
                    disable: false,
                    refresh: false,
                    value: null
                }
            },
            divTypeHalfShiftLeaveHours: {
                visible: true,
                TypeHalfShiftLeaveHours: {
                    disable: false,
                    refresh: false,
                    value: null
                }
            }
        },
        divMiddleShiftMoreDay: {
            visible: false,
            dataRegisterMiddleShiftModels: []
        },
        divFullShiftMoreDay: {
            visible: false,
            dataRegisterFullShiftModels: []
        },
        divFirstLastShiftMoreDay: {
            visible: false,
            dataRegisterFirstLastShiftModels: []
        }
    },
    divShift: {
        visible: false,
        visibleConfig: true,
        Shift: {
            disable: false,
            refresh: false,
            value: null,
            data: []
        }
    },
    UserApprove: {
        visibleConfig: true,
        visible: true,
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
        visibleConfig: true,
        visible: true,
        disable: false,
        refresh: false,
        value: null
    },
    divComment: {
        visible: true,
        visibleConfig: true,
        CommentLD: {
            disable: true,
            value: '',
            refresh: false
        }
    },
    PlaceSendToID: {
        visible: true,
        visibleConfig: true,
        disable: true,
        value: null,
        refresh: false
    },
    PregnancyCycleID: {
        lable: 'HRM_Attendance_Leaveday_PregnancyCycleName',
        data: [],
        visible: false,
        visibleConfig: true,
        disable: true,
        value: null,
        refresh: false
    },
    divBusinessReason: {
        visible: false,
        visibleConfig: true,
        BusinessReason: {
            disable: false,
            value: '',
            refresh: false
        }
    },
    FileAttachment: {
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    FileAttach: {
        disable: false,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    IsRequiredDocuments: {
        disable: false,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    dataAnnualDetail: {
        data: null,
        modalVisibleAnnualDetail: false
    },
    modalErrorDetail: {
        isModalVisible: false,
        cacheID: null,
        data: []
    },
    fieldValid: {}
};

export default class AttSubmitLeaveDayAddOrEdit extends Component {
    constructor(props) {
        super(props);

        this.state = initSateDefault;
        // khai báo các biến this trong hàm setVariable
        this.setVariable();

        props.navigation.setParams({
            title: props.navigation.state.params.record
                ? 'HRM_Attendance_LeaveDay_Edit'
                : 'HRM_Attendance_LeaveDay_AddNew'
            // headerRight: (
            //     <TouchableOpacity onPress={() => this.save(props.navigation)}>
            //         <View style={stylesListPickerControl.headerButtonStyle}>
            //             <IconPublish
            //                 size={Size.iconSizeHeader}
            //                 color={Colors.white}
            //             />
            //         </View>
            //     </TouchableOpacity>
            // )
        });
    }

    setVariable = () => {
        this.isRegisterHelp = null;
        this.isModify = false;
        this.levelApproveLeave = 2;
        this.isOnlyOnleLevelApproveLeave = false;
        this.isChooseMultiPro = false;
        this.isChangeLevelLeavedayApprove = false;
        this.IsFormulaDuration = false;
        this.dataDurationType = [];
        this.dataTypeHalfShift = [];
        this.dataTempLeaveDayTypeID = [];
        this.dataFirstApprove = [];
        this.dataMidApprove = [];
        this.dataLastApprove = [];
        this.dataFomulaDuration = [];
        this.IsLeaveHoursDetail = null;

        this.IsInsuranceLeave = false;
        this.IsconfigMultipleLeaveDayTypeFull = false;
        this.IsconfigMultipleLeaveDayType = false;
        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;

        this.IsContinueSave = false;
        this.ProfileRemoveIDs = null;
        this.IsRemoveAndContinue = null;
        this.CacheID = null;

        this.paramsExtend = {
            IsCheckingLevel: null,
            IsCheckLeaveEliminate: null,
            IsCheckDuplicate: null,
            IsExcludeProbation: null,
            IsConfirmWorkingByFrame: null,
            IsContinueMaxDayByMonthOrYear: null
        };
    };

    //#region [khởi tạo - check đăng ký hộ, lấy các dữ liệu cho control, lấy giá trọ mặc đinh]
    refreshView = () => {
        this.props.navigation.setParams({ title: 'HRM_Attendance_LeaveDay_AddNew' });
        this.setVariable();
        this.setState(initSateDefault, () => this.getConfigValid('Att_LeaveDayPortal', true));
    };
    //promise get config valid
    getConfigValid = (tblName, isRefresh) => {
        VnrLoadingSevices.show();
        HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName).then(res => {
            if (res) {
                try {
                    VnrLoadingSevices.hide();
                    //map field hidden by config
                    const _configField =
                        ConfigField && ConfigField.value['AttSubmitLeaveDayAddOrEdit']
                            ? ConfigField.value['AttSubmitLeaveDayAddOrEdit']['Hidden']
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
                            this.isRegisterHelp = false;
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
        this.getConfigValid('Att_LeaveDayPortal');
    }

    handleSetState = (_id, res) => {
        this.isRegisterHelp = false;

        const response = res[0][0],
            _IsLeaveHoursDetail = response.IsLeaveHoursDetail,
            dataDurationTypeByEnum = res[1],
            dataTypeHalfShiftByEnum = res[2],
            dataDurationType = res[3],
            dataTypeHalfShift = res[4],
            dataLeaveDayType = res[5],
            levelApproved = res[6],
            isChangeLevelAprpoved = res[7],
            dataShift = res[8],
            excludeDurationTypeByLeaveType = res[9],
            {
                divComment,
                divBusinessReason,
                DateStart,
                DateEnd,
                DateReturnToWork,
                Profile,
                UserApprove,
                UserApprove2,
                LeaveDayTypeFull,
                FileAttachment,
                Div_DurationType1,
                Div_TypeHalfShift1,
                divShift,
                UserApprove3,
                UserApprove4,
                PlaceSendToID,
                FileAttach,
                LeaveTypeGroup
            } = this.state,
            { Shift } = divShift,
            { CommentLD } = divComment,
            { BusinessReason } = divBusinessReason,
            { LeaveDayType } = LeaveDayTypeFull,
            { DurationType, DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
            { HoursFrom, HoursTo, LeaveHoursDetail, divLeaveHours } = OtherDurationType,
            { LeaveHours } = divLeaveHours,
            { ConfigLeaveHoursDetail } = LeaveHoursDetail,
            { LeaveDays } = DurationTypeFullShift,
            { TypeHalfShift, divTypeHalfShiftContent } = Div_TypeHalfShift1,
            { divTypeHalfShiftLeaveDay, divTypeHalfShiftLeaveHours } = divTypeHalfShiftContent,
            { TypeHalfShiftLeaveDays } = divTypeHalfShiftLeaveDay,
            { TypeHalfShiftLeaveHours } = divTypeHalfShiftLeaveHours;

        this.IsLeaveHoursDetail = _IsLeaveHoursDetail;

        if (dataDurationTypeByEnum && Array.isArray(dataDurationTypeByEnum)) {
            this.dataDurationType = [...dataDurationTypeByEnum];
        }

        if (dataTypeHalfShiftByEnum && Array.isArray(dataTypeHalfShiftByEnum)) {
            this.dataTypeHalfShift = [...dataTypeHalfShiftByEnum];
        }

        let _dataLeaveDayType = [],
            _dataDurationType = [],
            findDurationType = null,
            findTypeHalfShift = null,
            _dataTypeHalfShift = [],
            _dataShift = [];

        if (dataLeaveDayType && Array.isArray(dataLeaveDayType)) {
            _dataLeaveDayType = dataLeaveDayType.map(item => {
                return { LeaveDayTypeName: item.LeaveDayTypeName, ID: item.ID };
            });
        }

        if (dataDurationType && Array.isArray(dataDurationType)) {
            _dataDurationType = dataDurationType.map(item => {
                return { Text: item.Text, Value: item.Value };
            });

            if (response['DurationType']) {
                findDurationType = _dataDurationType.find(item => item.Value === response['DurationType']);
                if (!findDurationType) {
                    findDurationType = { Value: response['DurationType'], Text: response['DurationType'] };
                }
            }
        }

        if (dataTypeHalfShift && Array.isArray(dataTypeHalfShift)) {
            _dataTypeHalfShift = dataTypeHalfShift.map(item => {
                return { Text: item.Text, Value: item.Value };
            });

            if (response['TypeHalfShift']) {
                findTypeHalfShift = _dataTypeHalfShift.find(item => item.Value === response['TypeHalfShift']);
                if (!findTypeHalfShift) {
                    findTypeHalfShift = { Value: response['TypeHalfShift'], Text: response['TypeHalfShift'] };
                }
            }
        }

        if (excludeDurationTypeByLeaveType && typeof excludeDurationTypeByLeaveType === 'object') {
            let _dateStart = response['DateStart'] ? moment(response['DateStart']).format('YYYYMMDD') : null,
                _dateEnd = response['DateEnd'] ? moment(response['DateEnd']).format('YYYYMMDD') : null;

            if (_dateStart == _dateEnd) {
                if (excludeDurationTypeByLeaveType.DurationType) {
                    let dataSource = [],
                        str = excludeDurationTypeByLeaveType.DurationType;

                    for (var i = 0; i < _dataDurationType.length; i++) {
                        let item = { ..._dataDurationType[i] };

                        if (str.indexOf(item.Value) < 0) {
                            dataSource.push(item);
                        }
                    }

                    _dataDurationType = [...dataSource];
                }
            } else if (excludeDurationTypeByLeaveType.TypeHalfShift) {
                let dataSourceTypeHalfShift = [],
                    str = excludeDurationTypeByLeaveType.TypeHalfShift;

                for (let i = 0; i < _dataTypeHalfShift.length; i++) {
                    let item = { ..._dataTypeHalfShift[i] };

                    if (str.indexOf(item.Value) < 0) {
                        dataSourceTypeHalfShift.push(item);
                    }
                }

                _dataTypeHalfShift = [...dataSourceTypeHalfShift];
            }
        }

        if (dataShift && Array.isArray(dataShift)) {
            _dataShift = dataShift;
        }

        let nextState = {
            ID: _id,
            divComment: {
                ...divComment,
                visible: response['IsWorkDay'] ? false : true,
                CommentLD: {
                    ...CommentLD,
                    disable: false,
                    value: response['Comment'],
                    refresh: !CommentLD.refresh
                }
            },
            PlaceSendToID: {
                ...PlaceSendToID,
                disable: false,
                value: response['PlaceSendToID']
                    ? { WorkPlaceCodeName: response['PlaceSendToName'], ID: response['PlaceSendToID'] }
                    : null,
                refresh: !PlaceSendToID.refresh
            },
            divBusinessReason: {
                ...divBusinessReason,
                visible: response['IsWorkDay'] ? true : false,
                BusinessReason: {
                    ...BusinessReason,
                    disable: false,
                    value: response['BusinessReason'],
                    refresh: !BusinessReason.refresh
                }
            },
            UserApprove: {
                ...UserApprove,
                refresh: !UserApprove.refresh,
                value: response['UserApproveID']
                    ? { UserInfoName: response['UserApproveName'], ID: response['UserApproveID'] }
                    : null
            },
            UserApprove3: {
                ...UserApprove3,
                refresh: !UserApprove3.refresh,
                value: response['UserApproveID3']
                    ? { UserInfoName: response['UserApproveName3'], ID: response['UserApproveID3'] }
                    : null
            },
            UserApprove4: {
                ...UserApprove4,
                refresh: !UserApprove4.refresh,
                value: response['UserApproveID4']
                    ? { UserInfoName: response['UserApproveName4'], ID: response['UserApproveID4'] }
                    : null
            },
            UserApprove2: {
                ...UserApprove2,
                refresh: !UserApprove2.refresh,
                value: response['UserApproveID2']
                    ? { UserInfoName: response['UserApproveName2'], ID: response['UserApproveID2'] }
                    : null
            },
            Profile: {
                ...Profile,
                ID: response['ProfileID'],
                ProfileName: response['ProfileName']
            },
            DateStart: {
                ...DateStart,
                refresh: !DateStart.refresh,
                value: response['DateStart'] ? moment(response['DateStart']).format('YYYY-MM-DD HH:mm:ss') : null
            },
            DateEnd: {
                ...DateEnd,
                refresh: !DateEnd.refresh,
                value: response['DateEnd'] ? moment(response['DateEnd']).format('YYYY-MM-DD HH:mm:ss') : null
            },
            DateReturnToWork: {
                ...DateReturnToWork,
                value: response['DateReturnToWork'],
                refresh: !DateReturnToWork.refresh
            },
            LeaveDayTypeFull: {
                ...LeaveDayTypeFull,
                visible: true,
                LeaveDayType: {
                    ...LeaveDayType,
                    refresh: !LeaveDayType.refresh,
                    value: response['LeaveDayTypeID']
                        ? { ID: response['LeaveDayTypeID'], LeaveDayTypeName: response['LeaveDayTypeName'] }
                        : null,
                    data: [..._dataLeaveDayType]
                }
            },
            LeaveTypeGroup: {
                ...LeaveTypeGroup,
                value: response['LeaveTypeGroup'] ? { LeaveTypeGroup: response['LeaveTypeGroup'] } : null,
                refresh: !LeaveTypeGroup.refresh
            },
            Div_DurationType1: {
                ...Div_DurationType1,
                DurationType: {
                    ...DurationType,
                    value: { ...findDurationType },
                    data: [..._dataDurationType],
                    refresh: !DurationType.refresh
                },
                DurationTypeDetail: {
                    ...DurationTypeDetail,
                    OtherDurationType: {
                        ...OtherDurationType,
                        HoursFrom: {
                            ...HoursFrom,
                            disable: false,
                            value: response['HoursFrom'] ? moment(response['HoursFrom']).toDate() : null,
                            refresh: !HoursFrom.refresh
                        },
                        HoursTo: {
                            ...HoursTo,
                            disable: true,
                            value: response['HoursTo'] ? moment(response['HoursTo']).toDate() : null,
                            refresh: !HoursTo.refresh
                        },
                        divLeaveHours: {
                            ...divLeaveHours,
                            LeaveHours: {
                                ...LeaveHours,
                                refresh: !LeaveHours.refresh,
                                disable: true,
                                value: response['LeaveHours']
                            }
                        }
                    },
                    DurationTypeFullShift: {
                        ...DurationTypeFullShift,
                        LeaveDays: {
                            ...LeaveDays,
                            refresh: !LeaveDays.refresh,
                            disable: true,
                            value: response['LeaveDays']
                        }
                    }
                }
            },
            Div_TypeHalfShift1: {
                ...Div_TypeHalfShift1,
                TypeHalfShift: {
                    ...TypeHalfShift,
                    refresh: !TypeHalfShift.refresh,
                    value: { ...findTypeHalfShift },
                    data: [..._dataTypeHalfShift]
                },
                divTypeHalfShiftContent: {
                    ...divTypeHalfShiftContent,
                    divTypeHalfShiftLeaveDay: {
                        ...divTypeHalfShiftLeaveDay,
                        TypeHalfShiftLeaveDays: {
                            ...TypeHalfShiftLeaveDays,
                            refresh: !TypeHalfShiftLeaveDays.refresh,
                            value: response['TypeHalfShiftLeaveDays']
                        }
                    },
                    divTypeHalfShiftLeaveHours: {
                        ...divTypeHalfShiftLeaveHours,
                        TypeHalfShiftLeaveHours: {
                            ...TypeHalfShiftLeaveHours,
                            refresh: !TypeHalfShiftLeaveHours.refresh,
                            value: response['TypeHalfShiftLeaveHours']
                        }
                    }
                }
            },
            divShift: {
                ...divShift,
                Shift: {
                    ...Shift,
                    data: [..._dataShift],
                    refresh: !Shift.refresh,
                    value: response['ShiftID'] ? { ID: response['ShiftID'], ShiftName: response['ShiftName'] } : null
                }
            },
            FileAttachment: {
                ...FileAttachment,
                value: response.lstFileAttach,
                refresh: !FileAttachment.refresh
            },
            FileAttach: {
                ...FileAttach,
                value: response.lstFileAttachLicense,
                refresh: !FileAttach.refresh
            }
        };

        //set cấp duyệt
        if (levelApproved) {
            this.levelApproveLeave = levelApproved;
            if (levelApproved == 4) {
                this.isOnlyOnleLevelApproveLeave = false;
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
            } else if (levelApproved == 3) {
                this.isOnlyOnleLevelApproveLeave = false;
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
            } else if (levelApproved == 1) {
                this.isOnlyOnleLevelApproveLeave = true;
            } else {
                this.isOnlyOnleLevelApproveLeave = false;
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
        }

        //set được thay đổi người duyệt
        if (!isChangeLevelAprpoved) {
            nextState = {
                ...nextState,
                UserApprove: {
                    ...nextState.UserApprove,
                    disable: true,
                    refresh: !UserApprove.refresh
                },
                UserApprove2: {
                    ...nextState.UserApprove2,
                    disable: true,
                    refresh: !UserApprove2.refresh
                },
                UserApprove3: {
                    ...nextState.UserApprove3,
                    disable: true,
                    refresh: !UserApprove3.refresh
                },
                UserApprove4: {
                    ...nextState.UserApprove4,
                    disable: true,
                    refresh: !UserApprove4.refresh
                }
            };
        } else {
            nextState = {
                ...nextState,
                UserApprove: {
                    ...nextState.UserApprove,
                    disable: false,
                    refresh: !UserApprove.refresh
                },
                UserApprove2: {
                    ...nextState.UserApprove2,
                    disable: false,
                    refresh: !UserApprove2.refresh
                },
                UserApprove3: {
                    ...nextState.UserApprove3,
                    disable: false,
                    refresh: !UserApprove3.refresh
                },
                UserApprove4: {
                    ...nextState.UserApprove4,
                    disable: false,
                    refresh: !UserApprove4.refresh
                }
            };
        }

        if (response['TypeHalfShift']) {
            // isShowEle('#divTypeHalfShiftContent', true);
            // isShowEle('#Div_TypeHalfShift1', true);
            // isShowEle('#Div_DurationType1');

            nextState = {
                ...nextState,
                Div_DurationType1: {
                    ...nextState.Div_DurationType1,
                    visible: false
                },
                Div_TypeHalfShift1: {
                    ...nextState.Div_TypeHalfShift1,
                    visible: true,
                    divTypeHalfShiftContent: {
                        ...nextState.Div_TypeHalfShift1.divTypeHalfShiftContent,
                        visible: true
                    }
                }
            };
        }

        let _DurationType = response['DurationType'],
            isGetConfigMiddleOfShift = false;

        if (_DurationType == 'E_FULLSHIFT') {
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
            if (_DurationType == 'E_MIDDLEOFSHIFT' || _DurationType == 'E_OUT_OF_SHIFT') {
                const _Div_DurationType1 = nextState.Div_DurationType1,
                    _DurationTypeDetail = _Div_DurationType1.DurationTypeDetail,
                    _OtherDurationType = _DurationTypeDetail.OtherDurationType,
                    _divLeaveHours = _OtherDurationType.divLeaveHours,
                    _DurationTypeFullShift = _DurationTypeDetail.DurationTypeFullShift;

                nextState = {
                    ...nextState,
                    Div_DurationType1: {
                        ..._Div_DurationType1,
                        DurationTypeDetail: {
                            ..._DurationTypeDetail,
                            OtherDurationType: {
                                ..._OtherDurationType,
                                HoursFrom: {
                                    ..._OtherDurationType.HoursFrom,
                                    refresh: !HoursFrom.refresh
                                },
                                HoursTo: {
                                    ..._OtherDurationType.HoursTo,
                                    refresh: !HoursTo.refresh
                                },
                                divLeaveHours: {
                                    ..._divLeaveHours,
                                    LeaveHours: {
                                        ..._divLeaveHours.LeaveHours,
                                        disable: false,
                                        refresh: !LeaveHours.refresh
                                    }
                                }
                            },
                            DurationTypeFullShift: {
                                ..._DurationTypeFullShift,
                                LeaveDays: {
                                    ..._DurationTypeFullShift.LeaveDays,
                                    disable: true,
                                    refresh: !LeaveDays.refresh
                                }
                            }
                        }
                    }
                };

                if (_DurationType == 'E_MIDDLEOFSHIFT') {
                    //kiểm tra có cấu hình chọn giờ của loại nghỉ giữa ca
                    if (response['IsLeaveHoursDetail']) {
                        let _valueConfig = null,
                            dataLeaveHourDetail = response['lstLeaveHourDetail'].map(item => {
                                return { LeaveHoursDetail: item };
                            });

                        if (response['HoursFrom'] && response['HoursTo']) {
                            _valueConfig = {
                                LeaveHoursDetail:
                                    moment(response['HoursFrom']).format('HH:mm') +
                                    ' - ' +
                                    moment(response['HoursTo']).format('HH:mm')
                            };
                        }

                        nextState = {
                            ...nextState,
                            Div_DurationType1: {
                                ..._Div_DurationType1,
                                DurationTypeDetail: {
                                    ..._DurationTypeDetail,
                                    OtherDurationType: {
                                        ..._OtherDurationType,
                                        HoursFrom: {
                                            ..._OtherDurationType.HoursFrom,
                                            visible: false
                                        },
                                        HoursTo: {
                                            ..._OtherDurationType.HoursTo,
                                            visible: false
                                        },
                                        LeaveHoursDetail: {
                                            ..._OtherDurationType.LeaveHoursDetail,
                                            visible: true,
                                            ConfigLeaveHoursDetail: {
                                                ..._OtherDurationType.LeaveHoursDetail.ConfigLeaveHoursDetail,
                                                data: dataLeaveHourDetail,
                                                value: _valueConfig,
                                                refresh: !ConfigLeaveHoursDetail.refresh
                                            }
                                        },
                                        divLeaveHours: {
                                            ..._divLeaveHours,
                                            LeaveHours: {
                                                ..._divLeaveHours.LeaveHours,
                                                disable: true,
                                                refresh: !LeaveHours.refresh
                                            }
                                        }
                                    }
                                }
                            }
                        };
                    }
                    //check có cấu hình DS số giờ nghỉ theo loại nghỉ giữa ca
                    else if (response.LeaveDayTypeID) {
                        isGetConfigMiddleOfShift = true;
                    }
                }
            }

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
        }

        this.setState(nextState, () => {
            // hiển thị số phép còn lại theo loại ngày nghỉ
            this.showDayOrHourByLeaveDayType(response.LeaveDayTypeID);
            this.LoadLeaveDayTypeByGrade(null, response);
            this.showFileAttachByLeaveDayType();
            // this.ComputeTypeHalfShift(_DurationType);

            if (isGetConfigMiddleOfShift) {
                //chạy theo DS số giờ nghỉ giữa ca theo từng loại ngày nghỉ
                this.SelectMiddleOfShift(response.LeaveDayTypeID, 'E_MIDDLEOFSHIFT', {
                    Text: response.LeaveHours.toString(),
                    Value: response.LeaveHours.toString()
                });
            }
        });
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        const { ID, ProfileID, DateStart, DateEnd, LeaveDays, LeaveDayTypeID, DurationType, UserSubmit } = record;

        let arrRequest = [
            HttpService.Get(
                '[URI_POR]/Att_Leaveday/New_Edit?id=' + ID + '&profileID=' + ProfileID + '&_isPortalApp=' + true
            ),
            HttpService.Post('[URI_HR]/Sys_GetEnumData/GetEnum', { text: 'LeaveDayDurationType' }),
            HttpService.Post('[URI_HR]/Sys_GetEnumData/GetEnum', { text: 'LeaveDayType' }),
            HttpService.Post('[URI_SYS]/Sys_GetData/GetEnum', { text: 'LeaveDayDurationType' }),
            HttpService.Post('[URI_POR]/New_Att_Overtime/GetMultiTypeHalfShift'),
            HttpService.Post('[URI_HR]/Cat_GetData/GetMultiLeaveDayTypeInPortal'),
            HttpService.Post('[URI_HR]/Att_GetData/GetLevelApproved', {
                ProfileID: ProfileID,
                DateStart: moment(DateStart).format('YYYY-MM-DD HH:mm:ss'),
                DateEnd: moment(DateEnd).format('YYYY-MM-DD HH:mm:ss'),
                LeaveDays: LeaveDays,
                DurationType: DurationType,
                LeaveDayTypeID: LeaveDayTypeID
            }),
            HttpService.Post('[URI_HR]/Att_GetData/IsChangeLevelAprpoved', {
                ProfileID: ProfileID,
                userSubmit: UserSubmit,
                DateStart: moment(DateStart).format('YYYY-MM-DD HH:mm:ss')
            }),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiShift')
        ];

        if (LeaveDayTypeID) {
            arrRequest = [
                ...arrRequest,
                HttpService.Post('[URI_HR]/Att_GetData/GetExcludeDurationTypeByLeaveTypeID', { LeaveDayTypeID })
            ];
        }

        VnrLoadingSevices.show();
        HttpService.MultiRequest(arrRequest).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res && res.length >= 9) {
                    _handleSetState(ID, res);
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 5000);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    getConfig = _profile => {
        let nextState = this.readOnlyCtrlLD(true);
        const {
                DateEnd,
                Div_TypeHalfShift1,
                Div_DurationType1,
                LeaveDayTypeFull,
                LeaveDayTypeByGrade,
                DateStart,
                divShift
            } = this.state,
            { Shift } = divShift,
            { DurationType } = Div_DurationType1,
            { LeaveDayType } = LeaveDayTypeFull,
            { TempLeaveDayType } = LeaveDayTypeByGrade,
            { TypeHalfShift, divTypeHalfShiftContent } = Div_TypeHalfShift1,
            { divTypeHalfShiftLeaveHours, divTypeHalfShiftLeaveDay } = divTypeHalfShiftContent,
            { TypeHalfShiftLeaveHours } = divTypeHalfShiftLeaveHours,
            { TypeHalfShiftLeaveDays } = divTypeHalfShiftLeaveDay;

        let _DateEnd = nextState.DateEnd ? { ...nextState.DateEnd } : { ...DateEnd },
            _Div_TypeHalfShift1 = nextState.Div_TypeHalfShift1
                ? { ...nextState.Div_TypeHalfShift1 }
                : { ...Div_TypeHalfShift1 },
            _LeaveDayTypeFull = nextState.LeaveDayTypeFull
                ? { ...nextState.LeaveDayTypeFull }
                : { ...LeaveDayTypeFull },
            _LeaveDayTypeByGrade = nextState.LeaveDayTypeByGrade
                ? { ...nextState.LeaveDayTypeByGrade }
                : { ...LeaveDayTypeByGrade };

        if (DateEnd.value && DateStart.value) {
            nextState = {
                ...nextState,
                DateEnd: {
                    ..._DateEnd,
                    disable: true,
                    refresh: !DateEnd.refresh
                },
                Div_TypeHalfShift1: {
                    ..._Div_TypeHalfShift1,
                    divTypeHalfShiftContent: {
                        ..._Div_TypeHalfShift1.divTypeHalfShiftContent,
                        divTypeHalfShiftLeaveDay: {
                            ..._Div_TypeHalfShift1.divTypeHalfShiftContent.divTypeHalfShiftLeaveDay,
                            TypeHalfShiftLeaveDays: {
                                ..._Div_TypeHalfShift1.divTypeHalfShiftContent.divTypeHalfShiftLeaveDay
                                    .TypeHalfShiftLeaveDays,
                                disable: true,
                                refresh: !TypeHalfShiftLeaveDays.refresh
                            }
                        },
                        divTypeHalfShiftLeaveHours: {
                            ..._Div_TypeHalfShift1.divTypeHalfShiftContent.divTypeHalfShiftLeaveHours,
                            TypeHalfShiftLeaveHours: {
                                ..._Div_TypeHalfShift1.divTypeHalfShiftContent.divTypeHalfShiftLeaveHours
                                    .TypeHalfShiftLeaveHours,
                                disable: true,
                                refresh: !TypeHalfShiftLeaveHours.refresh
                            }
                        }
                    }
                },
                LeaveDayTypeFull: {
                    ..._LeaveDayTypeFull,
                    LeaveDayType: {
                        ..._LeaveDayTypeFull.LeaveDayType,
                        disable: true,
                        refresh: !LeaveDayType.refresh
                    }
                },
                LeaveDayTypeByGrade: {
                    ..._LeaveDayTypeByGrade,
                    TempLeaveDayType: {
                        ..._LeaveDayTypeByGrade.TempLeaveDayType,
                        value: LeaveDayType.value ? { ...LeaveDayType.value } : null,
                        refresh: !TempLeaveDayType.refresh
                    }
                }
            };
        } else {
            nextState = {
                ...nextState,
                DateEnd: {
                    ..._DateEnd,
                    disable: true,
                    refresh: !DateEnd.refresh
                },
                Div_TypeHalfShift1: {
                    ..._Div_TypeHalfShift1,
                    divTypeHalfShiftContent: {
                        ..._Div_TypeHalfShift1.divTypeHalfShiftContent,
                        divTypeHalfShiftLeaveDay: {
                            ..._Div_TypeHalfShift1.divTypeHalfShiftContent.divTypeHalfShiftLeaveDay,
                            TypeHalfShiftLeaveDays: {
                                ..._Div_TypeHalfShift1.divTypeHalfShiftContent.divTypeHalfShiftLeaveDay
                                    .TypeHalfShiftLeaveDays,
                                disable: true,
                                refresh: !TypeHalfShiftLeaveDays.refresh
                            }
                        },
                        divTypeHalfShiftLeaveHours: {
                            ..._Div_TypeHalfShift1.divTypeHalfShiftContent.divTypeHalfShiftLeaveHours,
                            TypeHalfShiftLeaveHours: {
                                ..._Div_TypeHalfShift1.divTypeHalfShiftContent.divTypeHalfShiftLeaveHours
                                    .TypeHalfShiftLeaveHours,
                                disable: true,
                                refresh: !TypeHalfShiftLeaveHours.refresh
                            }
                        }
                    }
                },
                LeaveDayTypeFull: {
                    ..._LeaveDayTypeFull,
                    LeaveDayType: {
                        ..._LeaveDayTypeFull.LeaveDayType,
                        disable: true,
                        refresh: !LeaveDayType.refresh
                    }
                }
            };
        }

        VnrLoadingSevices.show();
        HttpService.MultiRequest([
            HttpService.Post('[URI_HR]/Sys_GetEnumData/GetEnum', { text: 'LeaveDayDurationType' }),
            HttpService.Post('[URI_HR]/Sys_GetEnumData/GetEnum', { text: 'LeaveDayType' }),
            HttpService.Post('[URI_POR]/New_Att_Leaveday/GetMultiDurationType'),
            HttpService.Post('[URI_POR]/New_Att_Overtime/GetMultiTypeHalfShift'),
            HttpService.Post('[URI_HR]/Cat_GetData/GetMultiLeaveDayTypeInPortal'),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiShift')
        ]).then(resAll => {
            VnrLoadingSevices.hide();
            try {
                if (resAll) {
                    if (resAll[0] && Array.isArray(resAll[0])) {
                        this.dataDurationType = [...resAll[0]];
                    }

                    if (resAll[1] && Array.isArray(resAll[1])) {
                        this.dataTypeHalfShift = [...resAll[1]];
                    }

                    if (resAll[2] && Array.isArray(resAll[2])) {
                        let _Div_DurationType1 = nextState.Div_DurationType1
                                ? { ...nextState.Div_DurationType1 }
                                : { ...Div_DurationType1 },
                            _data = resAll[2].map(item => {
                                return { Text: item.Text, Value: item.Value };
                            });

                        nextState = {
                            ...nextState,
                            Div_DurationType1: {
                                ..._Div_DurationType1,
                                DurationType: {
                                    ..._Div_DurationType1.DurationType,
                                    data: [..._data],
                                    refresh: !DurationType.refresh
                                }
                            }
                        };
                    }

                    if (resAll[3] && Array.isArray(resAll[3])) {
                        let _Div_TypeHalfShift1 = nextState.Div_TypeHalfShift1
                                ? { ...nextState.Div_TypeHalfShift1 }
                                : { ...Div_TypeHalfShift1 },
                            _data = resAll[3].map(item => {
                                return { Text: item.Text, Value: item.Value };
                            });
                        nextState = {
                            ...nextState,
                            Div_TypeHalfShift1: {
                                ..._Div_TypeHalfShift1,
                                TypeHalfShift: {
                                    ..._Div_TypeHalfShift1.TypeHalfShift,
                                    data: [..._data],
                                    refresh: !TypeHalfShift.refresh
                                }
                            }
                        };
                    }

                    if (resAll[4] && Array.isArray(resAll[4])) {
                        let _LeaveDayTypeFull = nextState.LeaveDayTypeFull
                                ? { ...nextState.LeaveDayTypeFull }
                                : { ...LeaveDayTypeFull },
                            _data = resAll[4].map(item => {
                                return { LeaveDayTypeName: item.LeaveDayTypeName, ID: item.ID };
                            });
                        nextState = {
                            ...nextState,
                            LeaveDayTypeFull: {
                                ..._LeaveDayTypeFull,
                                LeaveDayType: {
                                    ..._LeaveDayTypeFull.LeaveDayType,
                                    data: [..._data],
                                    refresh: !LeaveDayType.refresh
                                }
                            }
                        };
                    }

                    if (resAll[5] && Array.isArray(resAll[5])) {
                        let _divShift = nextState.divShift ? { ...nextState.divShift } : { ...divShift };
                        nextState = {
                            ...nextState,
                            divShift: {
                                ..._divShift,
                                Shift: {
                                    ..._divShift.Shift,
                                    data: [...resAll[5]],
                                    refresh: !Shift.refresh
                                }
                            }
                        };
                    }

                    const { UserApprove, UserApprove3, UserApprove2, UserApprove4 } = this.state;

                    if (UserApprove.value && Object.hasOwnProperty.call(nextState, 'UserApprove')) {
                        nextState = {
                            ...nextState,
                            UserApprove: {
                                ...nextState.UserApprove,
                                value: { ...UserApprove.value }
                            }
                        };
                    }

                    if (UserApprove2.value && Object.hasOwnProperty.call(nextState, 'UserApprove2')) {
                        nextState = {
                            ...nextState,
                            UserApprove2: {
                                ...nextState.UserApprove2,
                                value: { ...UserApprove2.value }
                            }
                        };
                    }

                    if (UserApprove3.value && Object.hasOwnProperty.call(nextState, 'UserApprove3')) {
                        nextState = {
                            ...nextState,
                            UserApprove3: {
                                ...nextState.UserApprove3,
                                value: { ...UserApprove3.value }
                            }
                        };
                    }

                    if (UserApprove4.value && Object.hasOwnProperty.call(nextState, 'UserApprove4')) {
                        nextState = {
                            ...nextState,
                            UserApprove4: {
                                ...nextState.UserApprove4,
                                value: { ...UserApprove4.value }
                            }
                        };
                    }

                    this.setState(nextState, () => {
                        this.loadHighSupervisor(_profile.ID, _profile.ID);
                    });
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    initData = record => {
        //sửa
        if (this.isModify) {
            this.isModify = true;
            this.getRecordAndConfigByID(record, this.handleSetState);
        } else {
            const { E_ProfileID, E_FullName } = enumName,
                _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] };
            this.setState({ Profile: _profile }, () => {
                this.getConfig(_profile);
            });
        }
    };
    //#endregion

    //#region [function xử lý nghiệp vụ]

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

    GetMessageProfileIdExistInPrenancy = () => {
        const { DateStart, DateEnd, isChoseProfile, Profiles, Profile, Div_DurationType1 } = this.state,
            { DurationType } = Div_DurationType1;

        // Nhân dữ liệu
        let dateStartNew = DateStart.value,
            dateEndNew = DateEnd.value,
            profileIds = null,
            durationType = DurationType.value ? DurationType.value.Value : null;

        //check đăng ký hộ
        if (this.isRegisterHelp && isChoseProfile) {
            profileIds = Profiles.value && Profiles.value.length ? Profiles.value[0].ID : null;
        } else {
            profileIds = Profile.ID;
        }

        //VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetMessageProfileExistInPrenancy', {
            profileId: profileIds,
            dateStart: dateStartNew,
            dateEnd: dateEndNew,
            ShiftType: durationType
        }).then(data => {
            //VnrLoadingSevices.hide();
            try {
                if (data != null && data != '' && typeof data === 'string') {
                    ToasterSevice.showWarning(data, 4000);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    readOnlyCtrlLD = (isReadOnly, isReadOnlyTempLeaveDayType) => {
        let nextState = null;

        if (!this.isModify) {
            const {
                    UserApprove,
                    UserApprove2,
                    UserApprove3,
                    UserApprove4,
                    Div_DurationType1,
                    Div_TypeHalfShift1,
                    LeaveDayTypeByGrade,
                    divComment,
                    LeaveDayTypeFull,
                    PlaceSendToID
                } = this.state,
                { DurationType, DurationTypeDetail } = Div_DurationType1,
                { OtherDurationType } = DurationTypeDetail,
                { HoursFrom, HoursTo } = OtherDurationType,
                { CommentLD } = divComment,
                { LeaveDayType } = LeaveDayTypeFull,
                { TempLeaveDayType } = LeaveDayTypeByGrade,
                { TypeHalfShift } = Div_TypeHalfShift1;

            if (isReadOnly) {
                nextState = {
                    Div_DurationType1: {
                        ...Div_DurationType1,
                        DurationType: {
                            ...DurationType,
                            disable: true,
                            refresh: !DurationType.refresh
                        }
                    },
                    Div_TypeHalfShift1: {
                        ...Div_TypeHalfShift1,
                        TypeHalfShift: {
                            ...TypeHalfShift,
                            disable: true,
                            refresh: !TypeHalfShift.refresh
                        }
                    },
                    UserApprove: {
                        ...UserApprove,
                        disable: isReadOnly,
                        refresh: !UserApprove.refresh
                    },
                    UserApprove2: {
                        ...UserApprove2,
                        disable: isReadOnly,
                        refresh: !UserApprove2.refresh
                    },
                    UserApprove3: {
                        ...UserApprove3,
                        disable: isReadOnly,
                        refresh: !UserApprove3.refresh
                    },
                    UserApprove4: {
                        ...UserApprove4,
                        disable: isReadOnly,
                        refresh: !UserApprove4.refresh
                    }
                };
            } else if (!isReadOnly && !TempLeaveDayType.value && !LeaveDayType.value) {
                if (DurationType) {
                    nextState = {
                        ...nextState,
                        Div_DurationType1: {
                            ...Div_DurationType1,
                            DurationType: {
                                ...DurationType,
                                disable: true,
                                refresh: !DurationType.refresh
                            }
                        }
                    };
                }

                if (TypeHalfShift) {
                    nextState = {
                        ...nextState,
                        Div_TypeHalfShift1: {
                            ...Div_TypeHalfShift1,
                            TypeHalfShift: {
                                ...TypeHalfShift,
                                disable: true,
                                refresh: !TypeHalfShift.refresh
                            }
                        }
                    };
                }
                // nextState = {
                //     Div_DurationType1: {
                //         ...Div_DurationType1,
                //         DurationType: {
                //             ...DurationType,
                //             disable: true,
                //             refresh: !DurationType.refresh
                //         }
                //     },
                //     Div_TypeHalfShift1: {
                //         ...Div_TypeHalfShift1,
                //         TypeHalfShift: {
                //             ...TypeHalfShift,
                //             disable: true,
                //             refresh: !TypeHalfShift.refresh
                //         }
                //     }
                // }
            } else if (!isReadOnly && (TempLeaveDayType.value || LeaveDayType.value)) {
                if (DurationType) {
                    nextState = {
                        ...nextState,
                        Div_DurationType1: {
                            ...Div_DurationType1,
                            DurationType: {
                                ...DurationType,
                                disable: false,
                                refresh: !DurationType.refresh
                            }
                        }
                    };
                }

                if (TypeHalfShift) {
                    nextState = {
                        ...nextState,
                        Div_TypeHalfShift1: {
                            ...Div_TypeHalfShift1,
                            TypeHalfShift: {
                                ...TypeHalfShift,
                                disable: false,
                                refresh: !TypeHalfShift.refresh
                            }
                        }
                    };
                }

                // nextState = {
                //     Div_DurationType1: {
                //         ...Div_DurationType1,
                //         DurationType: {
                //             ...DurationType,
                //             disable: false,
                //             refresh: !DurationType.refresh
                //         }
                //     },
                //     Div_TypeHalfShift1: {
                //         ...Div_TypeHalfShift1,
                //         TypeHalfShift: {
                //             ...TypeHalfShift,
                //             disable: false,
                //             refresh: !TypeHalfShift.refresh
                //         }
                //     },
                // }
            }

            if (!isReadOnly && this.isChangeLevelLeavedayApprove) {
                nextState = {
                    ...nextState,
                    UserApprove: {
                        ...UserApprove,
                        disable: isReadOnly,
                        refresh: !UserApprove.refresh
                    },
                    UserApprove2: {
                        ...UserApprove2,
                        disable: isReadOnly,
                        refresh: !UserApprove2.refresh
                    },
                    UserApprove3: {
                        ...UserApprove3,
                        disable: isReadOnly,
                        refresh: !UserApprove3.refresh
                    },
                    UserApprove4: {
                        ...UserApprove4,
                        disable: isReadOnly,
                        refresh: !UserApprove4.refresh
                    }
                };
            }

            let _LeaveDayTypeByGrade = nextState.LeaveDayTypeByGrade
                    ? { ...nextState.LeaveDayTypeByGrade }
                    : { ...LeaveDayTypeByGrade },
                _Div_DurationType1 = nextState.Div_DurationType1
                    ? { ...nextState.Div_DurationType1 }
                    : { ...Div_DurationType1 };

            nextState = {
                ...nextState,
                divComment: {
                    ...divComment,
                    CommentLD: {
                        ...CommentLD,
                        disable: isReadOnly,
                        refresh: !CommentLD.refresh
                    }
                },
                PlaceSendToID: {
                    ...PlaceSendToID,
                    disable: isReadOnly,
                    refresh: !PlaceSendToID.refresh
                },
                LeaveDayTypeByGrade: {
                    ..._LeaveDayTypeByGrade,
                    TempLeaveDayType: {
                        ..._LeaveDayTypeByGrade.TempLeaveDayType,
                        disable: isReadOnlyTempLeaveDayType === true ? true : isReadOnly,
                        refresh: !TempLeaveDayType.refresh
                    }
                },
                Div_DurationType1: {
                    ..._Div_DurationType1,
                    DurationTypeDetail: {
                        ..._Div_DurationType1.DurationTypeDetail,
                        OtherDurationType: {
                            ..._Div_DurationType1.DurationTypeDetail.OtherDurationType,
                            HoursFrom: {
                                ..._Div_DurationType1.DurationTypeDetail.OtherDurationType.HoursFrom,
                                disable: isReadOnly,
                                refresh: !HoursFrom.refresh
                            },
                            HoursTo: {
                                ..._Div_DurationType1.DurationTypeDetail.OtherDurationType.HoursTo,
                                disable: isReadOnly,
                                refresh: !HoursTo.refresh
                            }
                        }
                    }
                }
            };
        }
        return nextState;
    };

    GetHighSupervior = (profileId, userSubmit, type) => {
        const { DateStart, DateEnd, LeaveDayTypeFull, LeaveDayTypeByGrade, Div_DurationType1 } = this.state,
            { LeaveDayType } = LeaveDayTypeFull,
            { TempLeaveDayType } = LeaveDayTypeByGrade,
            { DurationType } = Div_DurationType1;

        if (DateStart.value && DateEnd.value && DurationType.value && (LeaveDayType.value || TempLeaveDayType.value)) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/GetHighSupervisor', {
                ProfileID: profileId,
                userSubmit: userSubmit,
                type: type
            }).then(result => {
                VnrLoadingSevices.hide();
                try {
                    const {
                            UserApprove,
                            UserApprove2,
                            UserApprove3,
                            UserApprove4,
                            Div_DurationType1,
                            Div_TypeHalfShift1
                        } = this.state,
                        { DurationType } = Div_DurationType1,
                        { TypeHalfShift } = Div_TypeHalfShift1;

                    let nextState = {
                        UserApprove: { ...UserApprove },
                        UserApprove2: { ...UserApprove2 },
                        UserApprove3: { ...UserApprove3 },
                        UserApprove4: { ...UserApprove4 }
                    };

                    if (result.IsLeaveHoursDetail != null) this.IsLeaveHoursDetail = true;

                    if (result.IsChangeApprove == true) {
                        this.isChangeLevelLeavedayApprove = true;
                    }
                    //truong hop chạy theo approve grade
                    if (result.LevelApprove > 0) {
                        this.levelApproveLeave = result.LevelApprove;
                        if (result.LevelApprove == 2) {
                            if (result.IsOnlyOneLevelApprove) {
                                this.isOnlyOnleLevelApproveLeave = true;
                                if (result.SupervisorID != null) {
                                    nextState = {
                                        UserApprove: {
                                            ...nextState.UserApprove,
                                            value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                        },
                                        UserApprove2: {
                                            ...nextState.UserApprove2,
                                            value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                        },
                                        UserApprove3: {
                                            ...nextState.UserApprove3,
                                            value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                        },
                                        UserApprove4: {
                                            ...nextState.UserApprove4,
                                            value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                        }
                                    };
                                } else {
                                    nextState = {
                                        UserApprove: {
                                            ...nextState.UserApprove,
                                            value: null
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
                            } else {
                                if (result.SupervisorID != null) {
                                    nextState = {
                                        ...nextState,
                                        UserApprove: {
                                            ...nextState.UserApprove,
                                            value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                        }
                                    };
                                } else {
                                    nextState = {
                                        ...nextState,
                                        UserApprove: {
                                            ...nextState.UserApprove,
                                            value: null
                                        }
                                    };
                                }

                                if (result.MidSupervisorID != null) {
                                    nextState = {
                                        ...nextState,
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
                                    nextState = {
                                        ...nextState,
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
                        } else if (result.LevelApprove == 3) {
                            if (result.SupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                    }
                                };
                                //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                            } else {
                                //multiUserApproveID2.value(null);
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        value: null
                                    }
                                };
                            }

                            if (result.MidSupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                    }
                                };
                                //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                            } else {
                                //multiUserApproveID3.value(null);
                                nextState = {
                                    ...nextState,
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        value: null
                                    }
                                };
                            }

                            if (result.NextMidSupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: {
                                            UserInfoName: result.NextMidSupervisorName,
                                            ID: result.NextMidSupervisorID
                                        }
                                    },
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        value: {
                                            UserInfoName: result.NextMidSupervisorName,
                                            ID: result.NextMidSupervisorID
                                        }
                                    }
                                };
                                //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID);
                                //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID);
                            } else {
                                //multiUserApproveID2.value(null);
                                //multiUserApproveID4.value(null);
                                nextState = {
                                    ...nextState,
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: null
                                    },
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        value: null
                                    }
                                };
                            }

                            //isShowEle("#" + divControl3, true);
                            //isShowEle("#" + divControl4);
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
                        } else if (result.LevelApprove == 4) {
                            if (result.SupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                    }
                                };
                                //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                            } else {
                                // multiUserApproveID.value(null);
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        value: null
                                    }
                                };
                            }

                            if (result.MidSupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                    }
                                };
                                //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                            } else {
                                //multiUserApproveID3.value(null);
                                nextState = {
                                    ...nextState,
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        value: null
                                    }
                                };
                            }

                            if (result.NextMidSupervisorID != null) {
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
                                //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID);
                            } else {
                                nextState = {
                                    ...nextState,
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        value: null
                                    }
                                };
                                //multiUserApproveID4.value(null);
                            }

                            if (result.HighSupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                                    }
                                };
                                //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
                            } else {
                                //multiUserApproveID2.value(null);
                                nextState = {
                                    ...nextState,
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: null
                                    }
                                };
                            }

                            // isShowEle("#" + divControl3, true);
                            // isShowEle("#" + divControl4, true);
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
                        }

                        if (result.FormularDurationType && result.FormularDurationType != '') {
                            //set datasource cho duration type
                            this.IsFormulaDuration = true;

                            let dataSource = [],
                                str = result.FormularDurationType.split(','),
                                _dataDurationType = this.dataDurationType;

                            for (let i = 0; i < _dataDurationType.length; i++) {
                                //chưa tìm được cách dịch enum khi gáng datasource mới nào nên làm cách củ chuối
                                if (str.indexOf(_dataDurationType[i].Value) != -1) {
                                    dataSource.push({
                                        Text: _dataDurationType[i].Text,
                                        Value: _dataDurationType[i].Value
                                    });
                                    this.dataFomulaDuration.push({
                                        Text: _dataDurationType[i].Text,
                                        Value: _dataDurationType[i].Value
                                    });
                                }
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

                            let datasourceTypeHaltShift = [],
                                _dataTypeHalfShift = this.dataTypeHalfShift;

                            for (let i = 0; i < _dataTypeHalfShift.length; i++) {
                                //chưa tìm được cách dịch enum khi gáng datasource mới nào nên làm cách củ chuối
                                if (str.indexOf(_dataTypeHalfShift[i].Value) != -1) {
                                    datasourceTypeHaltShift.push({
                                        Text: _dataTypeHalfShift[i].Text,
                                        Value: _dataTypeHalfShift[i].Value
                                    });
                                }
                            }
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

                        nextState = {
                            ...nextState,
                            UserApprove: {
                                ...nextState.UserApprove,
                                refresh: !UserApprove.refresh
                            },
                            UserApprove2: {
                                ...nextState.UserApprove2,
                                refresh: !UserApprove.refresh
                            },
                            UserApprove3: {
                                ...nextState.UserApprove3,
                                refresh: !UserApprove.refresh
                            },
                            UserApprove4: {
                                ...nextState.UserApprove4,
                                refresh: !UserApprove.refresh
                            }
                        };

                        this.setState(nextState, () => {
                            // const { workDayItem } = this.props.navigation.state.params;
                            // if (workDayItem) {
                            //     //call onChangeDateStart
                            //     this.onChangeDateStart(moment(workDayItem.WorkDate).format("YYYY-MM-DD HH:mm:ss"));
                            // }
                        });
                    }

                    //TH chạy không theo approvegrade
                    else if (result.LevelApprove == 0) {
                        if (result.IsConCurrent == true) {
                            for (let i = 0; i < result.lstSupervior.length; i++) {
                                this.dataFirstApprove.push({
                                    UserInfoName: result.lstSupervior[i].SupervisorName,
                                    ID: result.lstSupervior[i].SupervisorID
                                });
                            }
                            for (let i = 0; i < result.lstHightSupervior.length; i++) {
                                this.dataMidApprove.push({
                                    UserInfoName: result.lstHightSupervior[i].HighSupervisorName,
                                    ID: result.lstHightSupervior[i].HighSupervisorID
                                });
                                this.dataLastApprove.push({
                                    UserInfoName: result.lstHightSupervior[i].HighSupervisorName,
                                    ID: result.lstHightSupervior[i].HighSupervisorID
                                });
                            }
                            // multiUserApproveID.setDataSource(dataFirstApprove);
                            // multiUserApproveID.refresh();
                            // multiUserApproveID2.setDataSource(dataLastApprove);
                            // multiUserApproveID2.refresh();
                            // multiUserApproveID4.setDataSource(dataLastApprove);
                            // multiUserApproveID4.refresh();
                            // multiUserApproveID3.setDataSource(dataMidApprove);
                            // multiUserApproveID3.refresh();
                        } else {
                            if (result.SupervisorID != null) {
                                this.dataFirstApprove.push({
                                    UserInfoName: result.SupervisorName,
                                    ID: result.SupervisorID
                                });
                                //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                    }
                                };
                            } else {
                                //multiUserApproveID.refresh();
                                //multiUserApproveID.value(null);
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        value: null
                                    }
                                };
                            }
                            if (result.HighSupervisorID != null) {
                                this.dataLastApprove.push({
                                    UserInfoName: result.HighSupervisorName,
                                    ID: result.HighSupervisorID
                                });
                                nextState = {
                                    ...nextState,
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                                    },
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                                    },
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                                    }
                                };
                                //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
                                //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
                                //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
                            } else {
                                // multiUserApproveID2.refresh();
                                // multiUserApproveID2.value(null);
                                // multiUserApproveID4.refresh();
                                // multiUserApproveID4.value(null);
                                nextState = {
                                    ...nextState,
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: null
                                    },
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        value: null
                                    }
                                };
                            }
                            if (result.MidSupervisorID != null) {
                                this.dataMidApprove.push({
                                    UserInfoName: result.SupervisorNextName,
                                    ID: result.MidSupervisorID
                                });
                                nextState = {
                                    ...nextState,
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                    },
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                    },
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                    }
                                };
                                //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                                //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                                //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                            } else {
                                // multiUserApproveID3.refresh();
                                // multiUserApproveID3.value(null);
                                nextState = {
                                    ...nextState,
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        value: null
                                    }
                                };
                            }

                            if (result.IsChangeApprove != true) {
                                // isReadOnlyComboBox($("#" + control1), true);
                                // isReadOnlyComboBox($("#" + control2), true);
                                // isReadOnlyComboBox($("#" + control3), true);
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        disable: true
                                    },
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        disable: true
                                    },
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        disable: true
                                    }
                                };
                            } else {
                                // isReadOnlyComboBox($("#" + control1), false);
                                // isReadOnlyComboBox($("#" + control2), false);
                                // isReadOnlyComboBox($("#" + control3), false);
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        disable: false
                                    },
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        disable: false
                                    },
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        disable: false
                                    }
                                };
                            }
                        }

                        if (result.FormularDurationType && result.FormularDurationType != '') {
                            //set datasource cho duration type
                            this.IsFormulaDuration = true;
                            let dataSource = [],
                                str = result.FormularDurationType.split(','),
                                _dataDurationType = this.dataDurationType;

                            for (let i = 0; i < _dataDurationType.length; i++) {
                                //chưa tìm được cách dịch enum khi gáng datasource mới nào nên làm cách củ chuối
                                if (str.indexOf(_dataDurationType[i].Value) != -1) {
                                    dataSource.push({
                                        Text: _dataDurationType[i].Text,
                                        Value: _dataDurationType[i].Value
                                    });
                                    this.dataFomulaDuration.push({
                                        Text: _dataDurationType[i].Text,
                                        Value: _dataDurationType[i].Value
                                    });
                                }
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

                            let datasourceTypeHaltShift = [],
                                _dataTypeHalfShift = this.dataTypeHalfShift;

                            for (let i = 0; i < _dataTypeHalfShift.length; i++) {
                                //chưa tìm được cách dịch enum khi gáng datasource mới nào nên làm cách củ chuối
                                if (str.indexOf(_dataTypeHalfShift[i].Value) != -1) {
                                    datasourceTypeHaltShift.push({
                                        Text: _dataTypeHalfShift[i].Text,
                                        Value: _dataTypeHalfShift[i].Value
                                    });
                                }
                            }
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

                        nextState = {
                            ...nextState,
                            UserApprove: {
                                ...nextState.UserApprove,
                                refresh: !UserApprove.refresh
                            },
                            UserApprove2: {
                                ...nextState.UserApprove2,
                                refresh: !UserApprove.refresh
                            },
                            UserApprove3: {
                                ...nextState.UserApprove3,
                                refresh: !UserApprove.refresh
                            },
                            UserApprove4: {
                                ...nextState.UserApprove4,
                                refresh: !UserApprove.refresh
                            }
                        };

                        this.setState(nextState),
                        () => {
                            this.LoadLeaveDayTypeByGrade();

                            // const { workDayItem } = this.props.navigation.state.params;
                            // if (workDayItem) {

                            //     //call onChangeDateStart
                            //     this.onChangeDateStart(moment(workDayItem.WorkDate).format("YYYY-MM-DD HH:mm:ss"));
                            // }
                        };
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        }
    };

    loadHighSupervisor = (profileId, userSubmit) => {
        if (profileId) {
            this.GetHighSupervior(profileId, userSubmit, 'E_LEAVE_DAY');
        } else {
            const { UserApprove, UserApprove3, UserApprove4, UserApprove2 } = this.state;
            this.setState({
                UserApprove: { ...UserApprove, value: null },
                UserApprove3: { ...UserApprove3, value: null },
                UserApprove4: { ...UserApprove4, value: null },
                UserApprove2: { ...UserApprove2, value: null }
            });
        }

        this.LoadLeaveDayTypeByGrade();

        let nextState = {};
        const { Div_TypeHalfShift1, Div_DurationType1 } = this.state,
            { DurationType, DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
            { TypeHalfShift } = Div_TypeHalfShift1,
            { HoursFrom, HoursTo } = OtherDurationType;

        let findDurationType = DurationType.data.find(item => item.Value === 'E_FULLSHIFT');
        if (!findDurationType) {
            findDurationType = { Text: 'E_FULLSHIFT', Value: 'E_FULLSHIFT' };
        }

        nextState = {
            Div_DurationType1: {
                ...Div_DurationType1,
                DurationType: {
                    ...DurationType,
                    value: { ...findDurationType },
                    refresh: !DurationType.refresh
                }
            }
        };

        let value = findDurationType.Value;
        if (!value) {
            nextState = {
                Div_DurationType1: {
                    ...nextState.Div_DurationType1,
                    DurationTypeDetail: {
                        ...DurationTypeDetail,
                        visible: false
                    }
                }
            };
        } else if (value == 'E_FULLSHIFT') {
            nextState = {
                Div_DurationType1: {
                    ...nextState.Div_DurationType1,
                    DurationTypeDetail: {
                        ...nextState.Div_DurationType1.DurationTypeDetail,
                        visible: true,
                        OtherDurationType: {
                            ...OtherDurationType,
                            visible: false,
                            HoursFrom: {
                                ...HoursFrom,
                                value: null,
                                refresh: !HoursFrom.refresh
                            },
                            HoursTo: {
                                ...HoursTo,
                                value: null,
                                refresh: !HoursTo.refresh
                            }
                        },
                        DurationTypeFullShift: {
                            ...DurationTypeFullShift,
                            visible: true
                        }
                    }
                }
            };
        }

        this.setState(nextState, () => {
            let type = TypeHalfShift.value ? TypeHalfShift.value.Value : null;
            this.ComputeTypeHalfShift(type);

            const { workDayItem } = this.props.navigation.state.params;
            if (workDayItem) {
                //call onChangeDateStart
                this.onChangeDateStart(moment(workDayItem.WorkDate).format('YYYY-MM-DD HH:mm:ss'));
            }
        });
    };

    LoadLeaveDayTypeByGrade = (changeDate, record) => {
        //xu ly chi lay nhung loai nghi theo Grade neu co
        let _profileIds = null,
            nextState = {};

        const { isChoseProfile, Profiles, Profile, DateEnd, LeaveDayTypeFull } = this.state,
            { LeaveDayType } = LeaveDayTypeFull;

        //check đăng ký hộ
        if (this.isRegisterHelp && isChoseProfile) {
            _profileIds = Profiles.value ? Profiles.value[0].ID : null;
        } else {
            _profileIds = Profile.ID ? Profile.ID : profileInfo[enumName.E_ProfileID];
        }

        if (_profileIds) {
            nextState = this.readOnlyCtrlLD(false, true);

            this.setState(nextState, () => {
                let _dateend = DateEnd.value ? moment(DateEnd.value).format('YYYY-MM-DD HH:mm:ss') : null;

                if (_dateend) {
                    VnrLoadingSevices.show();
                    HttpService.Post('[URI_HR]/Att_GetData/GetLeaveTypeByGrade', {
                        ProfileID: _profileIds,
                        DateEnd: _dateend,
                        isPortal: true
                    }).then(data => {
                        VnrLoadingSevices.hide();
                        try {
                            if (typeof data != 'object' && data.indexOf('InValidDate') >= 0) {
                                ToasterSevice.showWarning('HRM_Chose_From_Calendar', 4000);
                                return;
                            }

                            const { LeaveDayTypeByGrade, LeaveTypeGroup } = this.state,
                                { TempLeaveDayType } = LeaveDayTypeByGrade;
                            let nextState1 = {};
                            let _leaveTypeGroup = LeaveTypeGroup.value ? LeaveTypeGroup.value.LeaveTypeGroup : '';

                            if (data != '') {
                                let _data = [];

                                data.forEach(function (item) {
                                    if (item.MedicalDocument) _data.push(item);
                                });

                                this.dataTempLeaveDayTypeID = _data;

                                // Có dùng "Nhóm loại ngày nghỉ"
                                if (LeaveTypeGroup.visibleConfig) {
                                    let dataFilterByGroup = [];
                                    let dataDistinctLeaveGroup = [
                                        ...new Map(data.map(item => [item['LeaveTypeGroup'], item])).values()
                                    ];
                                    let dataFilternull = dataDistinctLeaveGroup.filter(
                                        dataDistinctLeaveGroup => dataDistinctLeaveGroup.LeaveTypeGroup != null
                                    );

                                    if (_leaveTypeGroup == '') {
                                        dataFilterByGroup = data.filter(item => item.LeaveTypeGroup == null);

                                        let valueLeaveDayType = null;
                                        if (dataFilterByGroup.length == 1) {
                                            valueLeaveDayType = dataFilterByGroup[0];
                                        }

                                        nextState1 = {
                                            LeaveDayTypeByGrade: {
                                                ...LeaveDayTypeByGrade,
                                                visible: true,
                                                TempLeaveDayType: {
                                                    ...TempLeaveDayType,
                                                    disable: false,
                                                    value: valueLeaveDayType,
                                                    data: [...dataFilterByGroup],
                                                    refresh: !TempLeaveDayType.refresh
                                                }
                                            },
                                            LeaveDayTypeFull: {
                                                ...LeaveDayTypeFull,
                                                visible: false,
                                                LeaveDayType: {
                                                    ...LeaveDayType,
                                                    data: [...dataFilterByGroup],
                                                    value: null,
                                                    refresh: !LeaveDayType.refresh
                                                }
                                            },
                                            LeaveTypeGroup: {
                                                ...LeaveTypeGroup,
                                                data: [...dataFilternull],
                                                refresh: !LeaveTypeGroup.refresh
                                            }
                                        };
                                    } else {
                                        dataFilterByGroup = data.filter(item => item.LeaveTypeGroup == _leaveTypeGroup);
                                        let valueLeaveDayType = null;
                                        if (dataFilterByGroup.length == 1) {
                                            valueLeaveDayType = dataFilterByGroup[0];
                                        }
                                        nextState1 = {
                                            LeaveDayTypeByGrade: {
                                                ...LeaveDayTypeByGrade,
                                                visible: true,
                                                TempLeaveDayType: {
                                                    ...TempLeaveDayType,
                                                    disable: false,
                                                    value: valueLeaveDayType,
                                                    data: [...dataFilterByGroup],
                                                    refresh: !TempLeaveDayType.refresh
                                                }
                                            },
                                            LeaveDayTypeFull: {
                                                ...LeaveDayTypeFull,
                                                visible: false,
                                                LeaveDayType: {
                                                    ...LeaveDayType,
                                                    data: [...dataFilterByGroup],
                                                    value: null,
                                                    refresh: !LeaveDayType.refresh
                                                }
                                            },
                                            LeaveTypeGroup: {
                                                ...LeaveTypeGroup,
                                                data: [...dataFilternull],
                                                refresh: !LeaveTypeGroup.refresh
                                            }
                                        };
                                    }
                                }
                                // Không "Nhóm loại ngày nghỉ" chạy nhữ cũ
                                else {
                                    nextState1 = {
                                        LeaveDayTypeByGrade: {
                                            ...LeaveDayTypeByGrade,
                                            visible: true,
                                            TempLeaveDayType: {
                                                ...TempLeaveDayType,
                                                disable: false,
                                                data: [...data],
                                                refresh: !TempLeaveDayType.refresh
                                            }
                                        },
                                        LeaveDayTypeFull: {
                                            ...LeaveDayTypeFull,
                                            visible: false,
                                            LeaveDayType: {
                                                ...LeaveDayType,
                                                value: null,
                                                refresh: !LeaveDayType.refresh
                                            }
                                        }
                                    };
                                }

                                if (record && !changeDate) {
                                    nextState1.LeaveDayTypeByGrade.TempLeaveDayType.value = {
                                        ID: record.LeaveDayTypeID,
                                        LeaveDayTypeName: record.LeaveDayTypeName
                                    };
                                }
                            } else {
                                nextState1 = {
                                    LeaveDayTypeFull: {
                                        ...LeaveDayTypeFull,
                                        visible: true
                                    },
                                    LeaveDayTypeByGrade: {
                                        ...LeaveDayTypeByGrade,
                                        visible: false,
                                        TempLeaveDayType: {
                                            ...TempLeaveDayType,
                                            disable: false,
                                            value: null,
                                            refresh: !TempLeaveDayType.refresh
                                        }
                                    }
                                };
                            }

                            this.setState(nextState1, () => {
                                // trường hợp loại ngày nghỉ load theo nhóm ngày nghỉ chỉ có 1
                                const { LeaveDayTypeByGrade } = this.state,
                                    { TempLeaveDayType } = LeaveDayTypeByGrade;

                                if (TempLeaveDayType && TempLeaveDayType.value) {
                                    this.onChangeTempLeaveDayTypeAfter(TempLeaveDayType.value);
                                }

                                this.checkLeaveDayTypeIsPregnancy(record);
                            });
                        } catch (error) {
                            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                        }
                    });
                }
            });
        } else {
            nextState = this.readOnlyCtrlLD(true);
            this.setState(nextState);
        }
    };

    ComputeTypeHalfShift = (ShiftType, isChangeDate) => {
        let nextState = {};
        const {
                isChoseProfile,
                Profiles,
                Profile,
                DateStart,
                DateEnd,
                LeaveDayTypeByGrade,
                UserApprove,
                UserApprove2,
                UserApprove3,
                UserApprove4,
                LeaveDayTypeFull,
                Div_TypeHalfShift1,
                Div_DurationType1,
                divShift
            } = this.state,
            { DurationType, DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
            { divLeaveHours } = OtherDurationType,
            { LeaveHours } = divLeaveHours,
            { LeaveDays } = DurationTypeFullShift,
            { LeaveDayType } = LeaveDayTypeFull,
            { TempLeaveDayType } = LeaveDayTypeByGrade,
            { TypeHalfShift, divTypeHalfShiftContent } = Div_TypeHalfShift1,
            { divTypeHalfShiftLeaveHours, divTypeHalfShiftLeaveDay } = divTypeHalfShiftContent,
            { TypeHalfShiftLeaveHours } = divTypeHalfShiftLeaveHours,
            { TypeHalfShiftLeaveDays } = divTypeHalfShiftLeaveDay;

        //ẩn/hiện số giờ nghỉ theo task 0099424
        if (TypeHalfShift.value && TypeHalfShift.value.Value == enumName.E_FULLSHIFT) {
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
                        divLeaveHours: {
                            ...divLeaveHours,
                            LeaveHours: {
                                ...LeaveHours,
                                value: 0,
                                refresh: !LeaveHours.refresh
                            }
                        }
                    },
                    DurationTypeFullShift: {
                        ...DurationTypeFullShift,
                        LeaveDays: {
                            ...LeaveDays,
                            value: 0,
                            refresh: !LeaveDays.refresh
                        }
                    }
                }
            }
        };

        let dateStart = DateStart.value ? Vnr_Function.parseDateTime(DateStart.value) : null,
            dateEnd = DateEnd.value ? Vnr_Function.parseDateTime(DateEnd.value) : null;

        if (dateStart && dateEnd) {
            let leavedayId = '',
                profileId = null;

            if (LeaveDayType.value) {
                leavedayId = LeaveDayType.value.ID;
            }

            if (TempLeaveDayType.value) {
                leavedayId = TempLeaveDayType.value.ID;
            }

            //check đăng ký hộ
            if (this.isRegisterHelp && isChoseProfile) {
                profileId = Profiles.value;
                if (profileId) profileId = profileId[0].ID;
            } else {
                profileId = Profile.ID ? Profile.ID : profileInfo[enumName.E_ProfileID];
            }

            this.setState(nextState, () => {
                const { Div_TypeHalfShift1 } = this.state,
                    { TypeHalfShift } = Div_TypeHalfShift1;

                let params = {};

                if (isChangeDate) {
                    params = {
                        ...params,
                        isChangeDate: true
                    }
                }

                VnrLoadingSevices.show();

                HttpService.Post('[URI_HR]/Att_GetData/GetRosterForCheckTypeHalfShift', {
                    profileId: profileId,
                    dateStart: dateStart,
                    dateEnd: dateEnd,
                    ShiftType: ShiftType,
                    LeaveDayTypeID: leavedayId,
                    Vehicle: null,
                    userSubmit: profileId,
                    noNightStay: null,
                    IsTrip: false,
                    IsPortal: true,
                    ...params
                }).then(async data => {
                    VnrLoadingSevices.show();
                    try {
                        if (typeof data != 'object' && data.indexOf('InValidDate') >= 0) {
                            VnrLoadingSevices.hide();
                            ToasterSevice.showWarning(data.split('|')[1], 4000);

                            return;
                        }

                        const { divComment, divBusinessReason } = this.state;

                        let nextState1 = {
                            divShift: {
                                ...divShift,
                                visible: false,
                                refresh: !divShift.refresh
                            }
                        };

                        if (data.Messages != null && data.Messages.indexOf('LeavedaySplit|') < -1) {
                            ToasterSevice.showWarning(data.Messages, 4000);
                            VnrLoadingSevices.hide();
                        } else {
                            if (data.Messages && data.Messages.indexOf('LeavedaySplit|') > -1 && !this.isModify) {
                                ToasterSevice.showWarning(data.Messages.split('LeavedaySplit|')[1], 4000);
                            }

                            if (data.IsWorkDay) {
                                nextState1 = {
                                    ...nextState1,
                                    divBusinessReason: {
                                        ...divBusinessReason,
                                        visible: true
                                    },
                                    divComment: {
                                        ...divComment,
                                        visible: false
                                    }
                                };
                            } else {
                                nextState1 = {
                                    ...nextState1,
                                    divBusinessReason: {
                                        ...divBusinessReason,
                                        visible: false
                                    },
                                    divComment: {
                                        ...divComment,
                                        visible: true
                                    }
                                };
                            }

                            nextState1 = {
                                ...nextState1,
                                UserApprove: { ...UserApprove },
                                UserApprove3: { ...UserApprove3 },
                                UserApprove4: { ...UserApprove4 },
                                UserApprove2: { ...UserApprove2 }
                            };

                            if (data.IsCatApproveGrade) {
                                if (!this.isChooseMultiPro) {
                                    this.paramsExtend.IsCheckingLevel = true;

                                    if (data.LevelApprove == 2) {
                                        this.levelApproveLeave = 2;
                                        if (data.SupervisorID != null) {
                                            nextState1 = {
                                                ...nextState1,
                                                UserApprove: {
                                                    ...nextState1.UserApprove,
                                                    value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID }
                                                }
                                            };
                                        }
                                        if (data.MidSupervisorID != null) {
                                            nextState1 = {
                                                ...nextState1,
                                                UserApprove2: {
                                                    ...nextState1.UserApprove2,
                                                    value: {
                                                        UserInfoName: data.SupervisorNextName,
                                                        ID: data.MidSupervisorID
                                                    }
                                                },
                                                UserApprove3: {
                                                    ...nextState1.UserApprove3,
                                                    value: {
                                                        UserInfoName: data.SupervisorNextName,
                                                        ID: data.MidSupervisorID
                                                    }
                                                },
                                                UserApprove4: {
                                                    ...nextState1.UserApprove4,
                                                    value: {
                                                        UserInfoName: data.SupervisorNextName,
                                                        ID: data.MidSupervisorID
                                                    }
                                                }
                                            };
                                        }
                                        nextState1 = {
                                            ...nextState1,
                                            UserApprove3: {
                                                ...nextState1.UserApprove3,
                                                visible: false
                                            },
                                            UserApprove4: {
                                                ...nextState1.UserApprove4,
                                                visible: false
                                            }
                                        };
                                    } else if (data.LevelApprove == 3) {
                                        this.levelApproveLeave = 3;

                                        if (data.SupervisorID != null) {
                                            nextState1 = {
                                                ...nextState1,
                                                UserApprove: {
                                                    ...nextState1.UserApprove,
                                                    value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID }
                                                }
                                            };
                                        } else {
                                            //multiUserApproveID.value(null);
                                            nextState1 = {
                                                ...nextState1,
                                                UserApprove: {
                                                    ...nextState1.UserApprove,
                                                    value: null
                                                }
                                            };
                                        }

                                        if (data.MidSupervisorID != null) {
                                            nextState1 = {
                                                ...nextState1,
                                                UserApprove3: {
                                                    ...nextState1.UserApprove3,
                                                    value: {
                                                        UserInfoName: data.SupervisorNextName,
                                                        ID: data.MidSupervisorID
                                                    }
                                                }
                                            };
                                        } else {
                                            nextState1 = {
                                                ...nextState1,
                                                UserApprove3: {
                                                    ...nextState1.UserApprove3,
                                                    value: null
                                                }
                                            };
                                        }

                                        if (data.NextMidSupervisorID != null) {
                                            nextState1 = {
                                                ...nextState1,
                                                UserApprove2: {
                                                    ...nextState1.UserApprove2,
                                                    value: {
                                                        UserInfoName: data.NextMidSupervisorName,
                                                        ID: data.NextMidSupervisorID
                                                    }
                                                },
                                                UserApprove4: {
                                                    ...nextState1.UserApprove4,
                                                    value: {
                                                        UserInfoName: data.NextMidSupervisorName,
                                                        ID: data.NextMidSupervisorID
                                                    }
                                                }
                                            };
                                        } else {
                                            nextState1 = {
                                                ...nextState1,
                                                UserApprove2: {
                                                    ...nextState1.UserApprove2,
                                                    value: null
                                                },
                                                UserApprove4: {
                                                    ...nextState1.UserApprove4,
                                                    value: null
                                                }
                                            };
                                        }

                                        nextState1 = {
                                            ...nextState1,
                                            UserApprove3: {
                                                ...nextState1.UserApprove3,
                                                visible: true
                                            },
                                            UserApprove4: {
                                                ...nextState1.UserApprove4,
                                                visible: false
                                            }
                                        };
                                    } else if (data.LevelApprove == 1) {
                                        this.levelApproveLeave = 1;
                                        if (data.SupervisorID != null) {
                                            nextState1 = {
                                                ...nextState1,
                                                UserApprove: {
                                                    ...nextState1.UserApprove,
                                                    value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID }
                                                },
                                                UserApprove2: {
                                                    ...nextState1.UserApprove2,
                                                    value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID }
                                                },
                                                UserApprove3: {
                                                    ...nextState1.UserApprove3,
                                                    value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID }
                                                },
                                                UserApprove4: {
                                                    ...nextState1.UserApprove4,
                                                    value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID }
                                                }
                                            };
                                        }
                                        nextState1 = {
                                            ...nextState1,
                                            UserApprove3: {
                                                ...nextState1.UserApprove3,
                                                visible: false
                                            },
                                            UserApprove4: {
                                                ...nextState1.UserApprove4,
                                                visible: false
                                            }
                                        };
                                    } else if (data.LevelApprove == 4) {
                                        this.levelApproveLeave = 4;

                                        if (data.SupervisorID != null) {
                                            nextState1 = {
                                                ...nextState1,
                                                UserApprove: {
                                                    ...nextState1.UserApprove,
                                                    value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID }
                                                }
                                            };
                                        } else {
                                            nextState1 = {
                                                ...nextState1,
                                                UserApprove: {
                                                    ...nextState1.UserApprove,
                                                    value: null
                                                }
                                            };
                                        }

                                        if (data.MidSupervisorID != null) {
                                            nextState1 = {
                                                ...nextState1,
                                                UserApprove3: {
                                                    ...nextState1.UserApprove3,
                                                    value: {
                                                        UserInfoName: data.SupervisorNextName,
                                                        ID: data.MidSupervisorID
                                                    }
                                                }
                                            };
                                        } else {
                                            nextState1 = {
                                                ...nextState1,
                                                UserApprove3: {
                                                    ...nextState1.UserApprove3,
                                                    value: null
                                                }
                                            };
                                        }

                                        if (data.NextMidSupervisorID != null) {
                                            nextState1 = {
                                                ...nextState1,
                                                UserApprove4: {
                                                    ...nextState1.UserApprove4,
                                                    value: {
                                                        UserInfoName: data.NextMidSupervisorName,
                                                        ID: data.NextMidSupervisorID
                                                    }
                                                }
                                            };
                                        } else {
                                            nextState1 = {
                                                ...nextState1,
                                                UserApprove4: {
                                                    ...nextState1.UserApprove4,
                                                    value: null
                                                }
                                            };
                                        }

                                        if (data.HighSupervisorID != null) {
                                            nextState1 = {
                                                ...nextState1,
                                                UserApprove2: {
                                                    ...nextState1.UserApprove2,
                                                    value: {
                                                        UserInfoName: data.HighSupervisorName,
                                                        ID: data.HighSupervisorID
                                                    }
                                                }
                                            };
                                        } else {
                                            nextState1 = {
                                                ...nextState1,
                                                UserApprove2: {
                                                    ...nextState1.UserApprove2,
                                                    value: null
                                                }
                                            };
                                        }

                                        nextState1 = {
                                            ...nextState1,
                                            UserApprove3: {
                                                ...nextState1.UserApprove3,
                                                visible: true
                                            },
                                            UserApprove4: {
                                                ...nextState1.UserApprove4,
                                                visible: true
                                            }
                                        };
                                    }
                                } else {
                                    this.levelApproveLeave = data.LevelApprove;
                                    if (data.LevelApprove == 4) {
                                        nextState1 = {
                                            ...nextState1,
                                            UserApprove3: {
                                                ...nextState1.UserApprove3,
                                                visible: true
                                            },
                                            UserApprove4: {
                                                ...nextState1.UserApprove4,
                                                visible: true
                                            }
                                        };
                                    } else if (data.LevelApprove == 3) {
                                        nextState1 = {
                                            ...nextState1,
                                            UserApprove3: {
                                                ...nextState1.UserApprove3,
                                                visible: true
                                            },
                                            UserApprove4: {
                                                ...nextState1.UserApprove4,
                                                visible: false
                                            }
                                        };
                                    } else {
                                        nextState1 = {
                                            ...nextState1,
                                            UserApprove3: {
                                                ...nextState1.UserApprove3,
                                                visible: false
                                            },
                                            UserApprove4: {
                                                ...nextState1.UserApprove4,
                                                visible: false
                                            }
                                        };
                                    }
                                }
                            } else if (!this.isChooseMultiPro) {
                                if (data.LevelApprove == 3) {
                                    this.levelApproveLeave = 3;
                                    nextState1 = {
                                        ...nextState1,
                                        UserApprove3: {
                                            ...nextState1.UserApprove3,
                                            visible: true
                                        }
                                    };

                                    //duyệt 1
                                    if (this.dataFirstApprove[0]) {
                                        nextState1 = {
                                            ...nextState1,
                                            UserApprove: {
                                                ...nextState1.UserApprove,
                                                value: { ...this.dataFirstApprove[0] }
                                            }
                                        };
                                    }
                                    //duyệt giữa
                                    if (this.dataMidApprove[0]) {
                                        nextState1 = {
                                            ...nextState1,
                                            UserApprove3: {
                                                ...nextState1.UserApprove3,
                                                value: { ...this.dataMidApprove[0] }
                                            }
                                        };
                                    }
                                    //duyệt cuối
                                    if (this.dataLastApprove[0]) {
                                        nextState1 = {
                                            ...nextState1,
                                            UserApprove2: {
                                                ...nextState1.UserApprove2,
                                                value: { ...this.dataLastApprove[0] }
                                            }
                                        };
                                    }
                                    //duyệt tiếp theo
                                    if (this.dataLastApprove[0]) {
                                        nextState1 = {
                                            ...nextState1,
                                            UserApprove4: {
                                                ...nextState1.UserApprove4,
                                                value: { ...this.dataLastApprove[0] }
                                            }
                                        };
                                    }
                                    this.paramsExtend.IsCheckingLevel = true;
                                } else if (data.LevelApprove == 1) {
                                    this.levelApproveLeave = 1;
                                    this.isOnlyOnleLevelApproveLeave = true;
                                    if (this.dataFirstApprove.length > 0) {
                                        nextState1 = {
                                            ...nextState1,
                                            UserApprove: {
                                                ...nextState1.UserApprove,
                                                value: { ...this.dataFirstApprove[0] }
                                            }
                                        };
                                    }
                                    if (this.dataFirstApprove.length > 0) {
                                        nextState1 = {
                                            ...nextState1,
                                            UserApprove2: {
                                                ...nextState1.UserApprove2,
                                                value: { ...this.dataFirstApprove[0] }
                                            }
                                        };
                                    }
                                    if (this.dataFirstApprove.length > 0) {
                                        nextState1 = {
                                            ...nextState1,
                                            UserApprove3: {
                                                ...nextState1.UserApprove3,
                                                value: { ...this.dataFirstApprove[0] }
                                            }
                                        };
                                    }
                                    if (this.dataFirstApprove.length > 0) {
                                        nextState1 = {
                                            ...nextState1,
                                            UserApprove4: {
                                                ...nextState1.UserApprove4,
                                                value: { ...this.dataFirstApprove[0] }
                                            }
                                        };
                                    }
                                } else {
                                    if (this.dataFirstApprove.length > 0) {
                                        nextState1 = {
                                            ...nextState1,
                                            UserApprove: {
                                                ...nextState1.UserApprove,
                                                value: { ...this.dataFirstApprove[0] }
                                            }
                                        };
                                    }
                                    if (this.dataMidApprove.length > 0) {
                                        nextState1 = {
                                            ...nextState1,
                                            UserApprove2: {
                                                ...nextState1.UserApprove2,
                                                value: { ...this.dataMidApprove[0] }
                                            }
                                        };
                                    } else if (this.dataLastApprove[0]) {
                                        nextState1 = {
                                            ...nextState1,
                                            UserApprove2: {
                                                ...nextState1.UserApprove2,
                                                value: { ...this.dataLastApprove[0] }
                                            }
                                        };
                                    }
                                    nextState1 = {
                                        ...nextState1,
                                        UserApprove3: {
                                            ...nextState1.UserApprove3,
                                            visible: false
                                        }
                                    };
                                    this.paramsExtend.IsCheckingLevel = false;
                                }
                            } else if (data.LevelApprove == 3 || this.levelApproveLeave == 3) {
                                this.levelApproveLeave = 3;
                                nextState1 = {
                                    ...nextState1,
                                    UserApprove3: {
                                        ...nextState1.UserApprove3,
                                        visible: true
                                    },
                                    UserApprove4: {
                                        ...nextState1.UserApprove4,
                                        visible: false
                                    }
                                };
                            } else if (data.LevelApprove == 4 || this.levelApproveLeave == 4) {
                                this.levelApproveLeave = 4;
                                nextState1 = {
                                    ...nextState1,
                                    UserApprove3: {
                                        ...nextState1.UserApprove3,
                                        visible: true
                                    },
                                    UserApprove4: {
                                        ...nextState1.UserApprove4,
                                        visible: true
                                    }
                                };
                            } else {
                                this.levelApproveLeave = data.LevelApprove;
                                nextState1 = {
                                    ...nextState1,
                                    UserApprove3: {
                                        ...nextState1.UserApprove3,
                                        visible: false
                                    },
                                    UserApprove4: {
                                        ...nextState1.UserApprove4,
                                        visible: false
                                    }
                                };
                            }

                            if (data.IsInsuranceType) this.IsInsuranceLeave = data.IsInsuranceType;
                            else this.IsInsuranceLeave = false;

                            if (data.IsLeaveHoursDetail != null) this.IsLeaveHoursDetail = true;
                            else this.IsLeaveHoursDetail = false;

                            //[Tin.Nguyen - 20151204] Kiểm tra trong chế độ công của nv nếu có công thức loại ngày nghỉ thì sẽ set vao duration
                            if (this.IsFormulaDuration) {
                                if (this.dataFomulaDuration.length) {
                                    nextState1 = {
                                        ...nextState1,
                                        Div_DurationType1: {
                                            ...Div_DurationType1,
                                            DurationType: {
                                                ...DurationType,
                                                disable: false,
                                                data: [...this.dataFomulaDuration],
                                                value: null
                                            }
                                        },
                                        Div_TypeHalfShift1: {
                                            ...Div_TypeHalfShift1,
                                            TypeHalfShift: {
                                                ...TypeHalfShift,
                                                disable: false,
                                                data: [...this.dataFomulaDuration],
                                                value: null
                                            }
                                        }
                                    };
                                }
                            } else {
                                if (data.ExcludeDurationType != null) {
                                    let dataSource = [],
                                        str = data.ExcludeDurationType.split(','),
                                        _dataDurationType = this.dataDurationType;

                                    for (let i = 0; i < _dataDurationType.length; i++) {
                                        //chưa tìm được cách dịch enum khi gáng datasource mới nào nên làm cách củ chuối
                                        if (str.indexOf(_dataDurationType[i].Value) == -1)
                                            dataSource.push({
                                                Text: _dataDurationType[i].Text,
                                                Value: _dataDurationType[i].Value
                                            });
                                    }

                                    //set lại value cho DurationType - fix case Edit nghỉ trong 1 ngày,
                                    //chọn Loại ngày nghỉ chỉ có DurationType = Giữa ca
                                    const { value } = DurationType;
                                    let _value = value ? (value.Value ? value.Value : value) : null,
                                        findItem = dataSource.length && dataSource.find(item => item.Value == _value);

                                    nextState1 = {
                                        ...nextState1,
                                        Div_DurationType1: {
                                            ...Div_DurationType1,
                                            DurationType: {
                                                ...DurationType,
                                                disable: false,
                                                data: [...dataSource],
                                                value: findItem ? { ...findItem } : null
                                            }
                                        }
                                    };
                                } else {
                                    let _dataDurationType = this.dataDurationType;
                                    nextState1 = {
                                        ...nextState1,
                                        Div_DurationType1: {
                                            ...Div_DurationType1,
                                            DurationType: {
                                                ...DurationType,
                                                disable: false,
                                                data: [..._dataDurationType]
                                                //value: null
                                            }
                                        }
                                    };
                                }

                                if (data.ExcludeTypeHalfShift != null) {
                                    let dataSourceTypeHalfShift = [],
                                        str = data.ExcludeTypeHalfShift.split(','),
                                        _dataTypeHalfShift = this.dataTypeHalfShift;

                                    for (let i = 0; i < _dataTypeHalfShift.length; i++) {
                                        //chưa tìm được cách dịch enum khi gáng datasource mới nào nên làm cách củ chuối
                                        if (str.indexOf(_dataTypeHalfShift[i].Value) == -1)
                                            dataSourceTypeHalfShift.push({
                                                Text: _dataTypeHalfShift[i].Text,
                                                Value: _dataTypeHalfShift[i].Value
                                            });
                                    }

                                    //set lại value cho TypeHalfShift
                                    const { value } = TypeHalfShift;
                                    let _value = value ? (value.Value ? value.Value : value) : null,
                                        findItem =
                                            dataSourceTypeHalfShift.length &&
                                            dataSourceTypeHalfShift.find(item => item.Value == _value);

                                    nextState1 = {
                                        ...nextState1,
                                        Div_TypeHalfShift1: {
                                            ...Div_TypeHalfShift1,
                                            TypeHalfShift: {
                                                ...TypeHalfShift,
                                                disable: false,
                                                data: [...dataSourceTypeHalfShift],
                                                value: findItem ? { ...findItem } : null
                                            }
                                        }
                                    };
                                } else {
                                    let _dataTypeHalfShift = this.dataTypeHalfShift;
                                    nextState1 = {
                                        ...nextState1,
                                        Div_TypeHalfShift1: {
                                            ...Div_TypeHalfShift1,
                                            TypeHalfShift: {
                                                ...TypeHalfShift,
                                                disable: false,
                                                data: [..._dataTypeHalfShift]
                                                //value: null
                                            }
                                        }
                                    };
                                }
                            }

                            const _Div_TypeHalfShift1 = nextState1.Div_TypeHalfShift1,
                                _TypeHalfShift = _Div_TypeHalfShift1.TypeHalfShift,
                                _divTypeHalfShiftContent = _Div_TypeHalfShift1.divTypeHalfShiftContent,
                                _divTypeHalfShiftLeaveDay = _divTypeHalfShiftContent.divTypeHalfShiftLeaveDay,
                                _TypeHalfShiftLeaveDays = _divTypeHalfShiftLeaveDay.TypeHalfShiftLeaveDays,
                                _divTypeHalfShiftLeaveHours = _divTypeHalfShiftContent.divTypeHalfShiftLeaveHours,
                                _TypeHalfShiftLeaveHours = _divTypeHalfShiftLeaveHours.TypeHalfShiftLeaveHours,
                                _Div_DurationType1 = nextState1.Div_DurationType1,
                                _DurationType = _Div_DurationType1.DurationType,
                                _DurationTypeDetail = _Div_DurationType1.DurationTypeDetail,
                                _OtherDurationType = _DurationTypeDetail.OtherDurationType,
                                _divLeaveHours = _OtherDurationType.divLeaveHours,
                                _LeaveHours = _divLeaveHours.LeaveHours,
                                _DurationTypeFullShift = _DurationTypeDetail.DurationTypeFullShift,
                                _LeaveDays = _DurationTypeDetail.LeaveDays,
                                _UserApprove = nextState1.UserApprove,
                                _UserApprove2 = nextState1.UserApprove2,
                                _UserApprove3 = nextState1.UserApprove3,
                                _UserApprove4 = nextState1.UserApprove4;

                            nextState1 = {
                                ...nextState1,
                                Div_TypeHalfShift1: {
                                    ..._Div_TypeHalfShift1,
                                    TypeHalfShift: {
                                        ..._TypeHalfShift,
                                        refresh: !TypeHalfShift.refresh
                                    },
                                    divTypeHalfShiftContent: {
                                        ..._divTypeHalfShiftContent,
                                        divTypeHalfShiftLeaveDay: {
                                            ..._divTypeHalfShiftLeaveDay,
                                            TypeHalfShiftLeaveDays: {
                                                ..._TypeHalfShiftLeaveDays,
                                                value: data.LeaveDays,
                                                refresh: !TypeHalfShiftLeaveDays.refresh
                                            }
                                        },
                                        divTypeHalfShiftLeaveHours: {
                                            ..._divTypeHalfShiftLeaveHours,
                                            TypeHalfShiftLeaveHours: {
                                                ..._TypeHalfShiftLeaveHours,
                                                value: data.LeaveHours,
                                                refresh: !TypeHalfShiftLeaveHours.refresh
                                            }
                                        }
                                    }
                                },
                                Div_DurationType1: {
                                    ..._Div_DurationType1,
                                    DurationType: {
                                        ..._DurationType,
                                        refresh: DurationType ? !DurationType.refresh : !_DurationType.refresh
                                    },
                                    DurationTypeDetail: {
                                        ..._DurationTypeDetail,
                                        OtherDurationType: {
                                            ..._OtherDurationType,
                                            divLeaveHours: {
                                                ..._divLeaveHours,
                                                LeaveHours: {
                                                    ..._LeaveHours,
                                                    value: data.LeaveHours,
                                                    refresh: !LeaveHours.refresh
                                                }
                                            }
                                        },
                                        DurationTypeFullShift: {
                                            ..._DurationTypeFullShift,
                                            LeaveDays: {
                                                ..._LeaveDays,
                                                value: data.LeaveDays,
                                                refresh: !LeaveDays.refresh
                                            }
                                        }
                                    }
                                },
                                UserApprove: {
                                    ..._UserApprove,
                                    refresh: !UserApprove.refresh
                                },
                                UserApprove2: {
                                    ..._UserApprove2,
                                    refresh: !UserApprove2.refresh
                                },
                                UserApprove3: {
                                    ..._UserApprove3,
                                    refresh: !UserApprove3.refresh
                                },
                                UserApprove4: {
                                    ..._UserApprove4,
                                    refresh: !UserApprove4.refresh
                                }
                            };

                            let _state = this.readOnlyCtrlLD(false);
                            let callbackAfterSetState = null;
                            // 0140578: Thêm chức năng thao tác một lần khi đăng ký cùng loại ngày nghỉ những ngày không liên tục Portal app
                            // configMultipleLeaveDayType
                            if (!this.IsInsuranceLeave) {
                                let excludeTypeHalfShift = data.ExcludeTypeHalfShift
                                    ? data.ExcludeTypeHalfShift.split(',')
                                    : [];
                                if (moment(DateEnd.value) > moment(DateStart.value)) {
                                    if (
                                        excludeTypeHalfShift != null &&
                                        excludeTypeHalfShift.includes('E_FIRSTHALFSHIFT' && 'E_LASTHALFSHIFT')
                                    )
                                        callbackAfterSetState = null;
                                    else {
                                        let _MultipleLeaveDayType = await HttpService.Get(
                                            '[URI_HR]/Att_GetData/GetSettingByKey?Key=HRM_ATT_LEAVEDAY_MULTIPLELEAVEDDAYTYPE'
                                        );

                                        if (_MultipleLeaveDayType && _MultipleLeaveDayType.Value1 != null) {
                                            let dataSourceTypeHalfShift =
                                                nextState1.Div_TypeHalfShift1 &&
                                                    nextState1.Div_TypeHalfShift1.TypeHalfShift
                                                    ? nextState1.Div_TypeHalfShift1.TypeHalfShift.data
                                                    : [];
                                            let splitMultipleLeaveDayType = _MultipleLeaveDayType.Value1.split(',');
                                            let _MultipleLeavedDayCompute = await HttpService.Post(
                                                '[URI_HR]/Sys_GetEnumData/GetEnum',
                                                { text: 'MultipleLeavedDayCompute' }
                                            );

                                            if (_MultipleLeavedDayCompute) {
                                                this.IsconfigMultipleLeaveDayType = true;
                                                //không add FULLSHIT, phải không bị loại trừ và có trong cấu hình
                                                let dataFilter = _MultipleLeavedDayCompute.filter(
                                                    (s, i) =>
                                                        s.Value != 'E_FULLSHIFT' &&
                                                        splitMultipleLeaveDayType.includes(
                                                            _MultipleLeavedDayCompute[i].Value
                                                        ) &&
                                                        !excludeTypeHalfShift.includes(
                                                            _MultipleLeavedDayCompute[i].Value
                                                        )
                                                );
                                                for (let i = 0; i < dataFilter.length > 0; i++) {
                                                    dataSourceTypeHalfShift.push({
                                                        Value: dataFilter[i].Value,
                                                        Text: dataFilter[i].Text
                                                    });
                                                }
                                            }

                                            if (
                                                _MultipleLeaveDayType &&
                                                _MultipleLeaveDayType.Value1 &&
                                                _MultipleLeaveDayType.Value1.split(',').findIndex(
                                                    s => s == 'E_FULLSHIFT'
                                                ) > -1
                                            )
                                                this.IsconfigMultipleLeaveDayTypeFull = true;

                                            nextState1 = {
                                                ...nextState1,
                                                Div_TypeHalfShift1: {
                                                    ...nextState1.Div_TypeHalfShift1,
                                                    TypeHalfShift: {
                                                        ...nextState1.Div_TypeHalfShift1.TypeHalfShift,
                                                        data: [...dataSourceTypeHalfShift]
                                                    }
                                                }
                                            };
                                        }

                                        // set Callback
                                        callbackAfterSetState = () => {
                                            // 0140578
                                            const { Div_TypeHalfShift1 } = this.state,
                                                { TypeHalfShift } = Div_TypeHalfShift1;

                                            if (
                                                TypeHalfShift.value &&
                                                TypeHalfShift.value.Value == 'E_FULLSHIFT' &&
                                                this.IsconfigMultipleLeaveDayTypeFull
                                            ) {
                                                this.onPickerChangeTypeHalfShift(TypeHalfShift.value);
                                            }
                                            // ----------------- //
                                        };
                                    }
                                }
                            }
                            //---------------------------------//
                            if (_state) {
                                this.setState(_state, () => {
                                    VnrLoadingSevices.hide();

                                    if (nextState1.Div_DurationType1 && nextState1.Div_DurationType1.DurationType) {
                                        nextState1.Div_DurationType1.DurationType.refresh = !nextState1
                                            .Div_DurationType1.DurationType.refresh;
                                    }

                                    if (nextState1.Div_TypeHalfShift1 && nextState1.Div_TypeHalfShift1.TypeHalfShift) {
                                        nextState1.Div_TypeHalfShift1.TypeHalfShift.refresh = !nextState1
                                            .Div_TypeHalfShift1.TypeHalfShift.refresh;
                                    }

                                    this.setState(nextState1, () => {
                                        callbackAfterSetState &&
                                            typeof callbackAfterSetState == 'function' &&
                                            callbackAfterSetState();
                                    });
                                });
                            } else {
                                VnrLoadingSevices.hide();

                                this.setState(nextState1, () => {
                                    callbackAfterSetState &&
                                        typeof callbackAfterSetState == 'function' &&
                                        callbackAfterSetState();
                                });
                            }
                        }
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });
            });
        } else {
            this.setState(nextState, () => {
                let _state = this.readOnlyCtrlLD(true);
                this.setState({ ..._state });
            });
        }
    };

    ComputeDurationTypes = ShiftType => {
        this.GetMessageProfileIdExistInPrenancy();

        const { Div_DurationType1 } = this.state,
            { DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
            { divLeaveHours } = OtherDurationType,
            { LeaveHours } = divLeaveHours,
            { LeaveDays } = DurationTypeFullShift;

        let nextState = {
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
                                disable: true,
                                value: 0,
                                refresh: !LeaveHours.refresh
                            }
                        }
                    },
                    DurationTypeFullShift: {
                        ...DurationTypeFullShift,
                        LeaveDays: {
                            ...LeaveDays,
                            value: 0,
                            refresh: !LeaveDays.refresh
                        }
                    }
                }
            }
        };

        this.setState(nextState, () => {
            const {
                    isChoseProfile,
                    Profiles,
                    Div_TypeHalfShift1,
                    Div_DurationType1,
                    divShift,
                    DateStart,
                    DateEnd,
                    Profile
                } = this.state,
                { DurationTypeDetail } = Div_DurationType1,
                { Shift } = divShift,
                { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
                { divLeaveHours, HoursFrom, HoursTo } = OtherDurationType,
                { LeaveHours } = divLeaveHours,
                { LeaveDays } = DurationTypeFullShift,
                { divTypeHalfShiftContent } = Div_TypeHalfShift1,
                { divTypeHalfShiftLeaveHours, divTypeHalfShiftLeaveDay } = divTypeHalfShiftContent,
                { TypeHalfShiftLeaveHours } = divTypeHalfShiftLeaveHours,
                { TypeHalfShiftLeaveDays } = divTypeHalfShiftLeaveDay;

            if (DateStart.value && DateEnd.value) {
                let dateStartNew = DateStart.value ? moment(DateStart.value).format('YYYY-MM-DD') : null,
                    dateEndNew = DateEnd.value ? moment(DateEnd.value).format('YYYY-MM-DD') : null,
                    profileIds = null;

                //check đăng ký hộ
                if (this.isRegisterHelp && isChoseProfile) {
                    profileIds = Profiles.value && Profiles.value.length ? Profiles.value[0].ID : null;
                } else {
                    profileIds = Profile.ID ? Profile.ID : profileInfo[enumName.E_ProfileID];
                }

                HttpService.Post('[URI_HR]/Att_GetData/GetRosterForCheckLeaveDay', {
                    profileId: profileIds,
                    dateStart: dateStartNew,
                    dateEnd: dateEndNew,
                    ShiftType: ShiftType,
                    isBussinessTravel: false
                }).then(data => {
                    VnrLoadingSevices.hide();
                    try {
                        if (typeof data != 'object' && data.indexOf('InValidDate') >= 0) {
                            ToasterSevice.showWarning('HRM_Chose_From_Calendar', 4000);
                            return;
                        }

                        let nextState = {
                            divShift: {
                                ...divShift,
                                visible: false
                            }
                        };

                        let callbackSelectMidleShift = null;
                        // Vinh.Mai điều chỉnh cách hiển thị message thông báo
                        if (data.Messages != null && data.Messages == 'WarningNotRosterInThisTime') {
                            ToasterSevice.showWarning('WarningNotRosterInThisTime', 4000);
                        } else if (data.Messages != null && data.Messages == 'WarningDifferentShiftInThisTime') {
                            ToasterSevice.showWarning('WarningDifferentShiftInThisTime', 4000);
                        } else {
                            if (data.Messages && typeof data.Messages === enumName.E_string) {
                                ToasterSevice.showWarning(data.Messages, 4000);
                            }
                            if (data.length > 1) {
                                let _dataSource = [];
                                data.forEach(function (item) {
                                    _dataSource.push({ text: item.ShiftName, value: item.ID });
                                });

                                nextState = {
                                    ...nextState,
                                    divShift: {
                                        ...nextState.divShift,
                                        visible: true,
                                        Shift: {
                                            ...nextState.divShift.Shift,
                                            data: [..._dataSource],
                                            refresh: !Shift.refresh
                                        }
                                    },
                                    Div_DurationType1: {
                                        ...Div_DurationType1,
                                        DurationTypeDetail: {
                                            ...DurationTypeDetail,
                                            DurationTypeFullShift: {
                                                ...DurationTypeFullShift,
                                                LeaveDays: {
                                                    ...LeaveDays,
                                                    value: data[0].LeaveDays,
                                                    refresh: !LeaveDays.refresh
                                                }
                                            },
                                            OtherDurationType: {
                                                ...OtherDurationType,
                                                divLeaveHours: {
                                                    ...divLeaveHours,
                                                    LeaveHours: {
                                                        ...LeaveHours,
                                                        value: data[0].LeaveHours,
                                                        refresh: !LeaveHours.refresh
                                                    }
                                                }
                                            }
                                        }
                                    }
                                };
                            } else if (data.length == 1) {
                                let toObj = { ShiftName: data[0].ShiftName, ID: data[0].ID },
                                    _dataSource = [{ ...toObj }];

                                nextState = {
                                    ...nextState,
                                    divShift: {
                                        ...nextState.divShift,
                                        visible: false,
                                        Shift: {
                                            ...nextState.divShift.Shift,
                                            data: _dataSource,
                                            value: { ...toObj },
                                            refresh: !Shift.refresh
                                        }
                                    },
                                    Div_DurationType1: {
                                        ...Div_DurationType1,
                                        DurationTypeDetail: {
                                            ...DurationTypeDetail,
                                            DurationTypeFullShift: {
                                                ...DurationTypeFullShift,
                                                LeaveDays: {
                                                    ...LeaveDays,
                                                    value: data[0].LeaveDays,
                                                    refresh: !LeaveDays.refresh
                                                }
                                            },
                                            OtherDurationType: {
                                                ...OtherDurationType,
                                                divLeaveHours: {
                                                    ...divLeaveHours,
                                                    LeaveHours: {
                                                        ...LeaveHours,
                                                        value: data[0].LeaveHours,
                                                        refresh: !LeaveHours.refresh
                                                    }
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
                                                    value: data[0].LeaveDays,
                                                    refresh: !TypeHalfShiftLeaveDays.refresh
                                                }
                                            },
                                            divTypeHalfShiftLeaveHours: {
                                                ...divTypeHalfShiftLeaveHours,
                                                TypeHalfShiftLeaveHours: {
                                                    ...TypeHalfShiftLeaveHours,
                                                    value: data[0].LeaveHours,
                                                    refresh: !TypeHalfShiftLeaveHours.refresh
                                                }
                                            }
                                        }
                                    }
                                };
                            } else if (data.ShiftType == 'E_FIRSTHALFSHIFT') {
                                if (data.length > 1) {
                                    //$("#divShift").show();
                                    //let ddlShift = $("#ShiftID").data("kendoDropDownList");
                                    //ddlShift.setDataSource(data);
                                    //ddlShift.refresh();
                                    //Loading(false);

                                    nextState = {
                                        ...nextState,
                                        divShift: {
                                            ...nextState.divShift,
                                            visible: true,
                                            Shift: {
                                                ...nextState.divShift.Shift,
                                                data: [...data],
                                                refresh: !Shift.refresh
                                            }
                                        }
                                    };
                                } else {
                                    //$("#divShift").hide();
                                    //let ddlShift = $("#ShiftID").data("kendoDropDownList");
                                    //ddlShift.value(data.ShiftID);
                                    //$("#LeaveDays").val(data.LeaveDays);
                                    let time1 = data.HoursFrom && moment(data.HoursFrom).toDate(), //hoursFrom.toTimeString().substr(0, 5),
                                        time2 = data.HoursTo && moment(data.HoursTo).toDate(); //hoursTo.toTimeString().substr(0, 5);
                                    //$("#HoursFrom").val(time1);
                                    //$("#HoursTo").val(time2);
                                    //$("#LeaveHours").val(data.LeaveHours);
                                    //document.getElementById("LeaveHours").readOnly = true;
                                    //Loading(false);

                                    let findShift = Shift.data.find(item => item.ID == data.ShiftID);
                                    if (!findShift) {
                                        findShift = {};
                                    }
                                    nextState = {
                                        ...nextState,
                                        divShift: {
                                            ...nextState.divShift,
                                            visible: false,
                                            Shift: {
                                                ...nextState.divShift.Shift,
                                                value: { ...findShift },
                                                refresh: !Shift.refresh
                                            }
                                        },
                                        Div_DurationType1: {
                                            ...Div_DurationType1,
                                            DurationTypeDetail: {
                                                ...DurationTypeDetail,
                                                DurationTypeFullShift: {
                                                    ...DurationTypeFullShift,
                                                    LeaveDays: {
                                                        ...LeaveDays,
                                                        value: data.LeaveDays,
                                                        refresh: !LeaveDays.refresh
                                                    }
                                                },
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
                                                    divLeaveHours: {
                                                        ...divLeaveHours,
                                                        LeaveHours: {
                                                            ...LeaveHours,
                                                            value: data.LeaveHours,
                                                            disable: true,
                                                            refresh: !LeaveHours.refresh
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    };
                                }
                            } else if (data.ShiftType == 'E_LASTHALFSHIFT') {
                                if (data.length > 1) {
                                    //$("#divShift").show();
                                    //let ddlShift = $("#ShiftID").data("kendoDropDownList");
                                    //ddlShift.setDataSource(data);
                                    //ddlShift.refresh();
                                    //Loading(false);

                                    nextState = {
                                        ...nextState,
                                        divShift: {
                                            ...nextState.divShift,
                                            visible: true,
                                            Shift: {
                                                ...nextState.divShift.Shift,
                                                data: [...data],
                                                refresh: !Shift.refresh
                                            }
                                        }
                                    };
                                } else {
                                    //$("#divShift").hide();
                                    //let ddlShift = $("#ShiftID").data("kendoDropDownList");
                                    //ddlShift.value(data.ShiftID);
                                    //$("#LeaveDays").val(data.LeaveDays);
                                    let time1 = data.HoursFrom && moment(data.HoursFrom).toDate(), //hoursFrom.toTimeString().substr(0, 5),
                                        time2 = data.HoursTo && moment(data.HoursTo).toDate(); //hoursTo.toTimeString().substr(0, 5);
                                    //$("#HoursFrom").val(time1);
                                    //$("#HoursTo").val(time2);
                                    //$("#LeaveHours").val(data.LeaveHours);
                                    //document.getElementById("LeaveHours").readOnly = true;
                                    //Loading(false);

                                    let findShift = Shift.data.find(item => item.ID == data.ShiftID);
                                    if (!findShift) {
                                        findShift = {};
                                    }

                                    nextState = {
                                        ...nextState,
                                        divShift: {
                                            ...nextState.divShift,
                                            visible: false,
                                            Shift: {
                                                ...nextState.divShift.Shift,
                                                value: { ...findShift },
                                                refresh: !Shift.refresh
                                            }
                                        },
                                        Div_DurationType1: {
                                            ...Div_DurationType1,
                                            DurationTypeDetail: {
                                                ...DurationTypeDetail,
                                                DurationTypeFullShift: {
                                                    ...DurationTypeFullShift,
                                                    LeaveDays: {
                                                        ...LeaveDays,
                                                        value: data.LeaveDays,
                                                        refresh: !LeaveDays.refresh
                                                    }
                                                },
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
                                                    divLeaveHours: {
                                                        ...divLeaveHours,
                                                        LeaveHours: {
                                                            ...LeaveHours,
                                                            value: data.LeaveHours,
                                                            disable: true,
                                                            refresh: !LeaveHours.refresh
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    };
                                }
                            } else if (data.ShiftType == 'E_MIDDLEOFSHIFT') {
                                if (data.length > 1) {
                                    //$("#divShift").show();
                                    //let ddlShift = $("#ShiftID").data("kendoDropDownList");
                                    //ddlShift.setDataSource(data);
                                    //ddlShift.refresh();
                                    //Loading(false);

                                    nextState = {
                                        ...nextState,
                                        divShift: {
                                            ...nextState.divShift,
                                            visible: true,
                                            Shift: {
                                                ...nextState.divShift.Shift,
                                                data: [...data],
                                                refresh: !Shift.refresh
                                            }
                                        }
                                    };
                                } else {
                                    //$("#divShift").hide();
                                    //let ddlShift = $("#ShiftID").data("kendoDropDownList");
                                    //ddlShift.value(data.ShiftID);
                                    //$("#LeaveDays").val(data.LeaveDays);
                                    let time1 = data.HoursFrom && moment(data.HoursFrom).toDate(), //hoursFrom.toTimeString().substr(0, 5),
                                        time2 = data.HoursTo && moment(data.HoursTo).toDate(); //hoursTo.toTimeString().substr(0, 5);
                                    //$("#HoursFrom").val(time1);
                                    //$("#HoursTo").val(time2);
                                    //$("#LeaveHours").val(data.LeaveHours);
                                    //document.getElementById("LeaveHours").readOnly = true;
                                    //Loading(false);

                                    let findShift = Shift.data.find(item => item.ID == data.ShiftID);
                                    if (!findShift) {
                                        findShift = {};
                                    }

                                    nextState = {
                                        ...nextState,
                                        divShift: {
                                            ...nextState.divShift,
                                            visible: false,
                                            Shift: {
                                                ...nextState.divShift.Shift,
                                                value: { ...findShift },
                                                refresh: !Shift.refresh
                                            }
                                        },
                                        Div_DurationType1: {
                                            ...Div_DurationType1,
                                            DurationTypeDetail: {
                                                ...DurationTypeDetail,
                                                DurationTypeFullShift: {
                                                    ...DurationTypeFullShift,
                                                    LeaveDays: {
                                                        ...LeaveDays,
                                                        value: data.LeaveDays,
                                                        refresh: !LeaveDays.refresh
                                                    }
                                                },
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
                                                    divLeaveHours: {
                                                        ...divLeaveHours,
                                                        LeaveHours: {
                                                            ...LeaveHours,
                                                            value: data.LeaveHours,
                                                            disable: true,
                                                            refresh: !LeaveHours.refresh
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    };

                                    // Xử load ca theo cấu hình, Loại giữa ca
                                    if (!this.IsLeaveHoursDetail) {
                                        callbackSelectMidleShift = () => {
                                            const { LeaveDayTypeByGrade } = this.state,
                                                { TempLeaveDayType } = LeaveDayTypeByGrade;

                                            this.SelectMiddleOfShift(
                                                TempLeaveDayType.value ? TempLeaveDayType.value.ID : null,
                                                ShiftType,
                                                null
                                            );
                                        };
                                    }
                                }
                            } else if (data.ShiftType == 'E_OUT_OF_SHIFT') {
                                if (data.length > 1) {
                                    //$("#divShift").show();
                                    //let ddlShift = $("#ShiftID").data("kendoDropDownList");
                                    //ddlShift.setDataSource(data);
                                    //ddlShift.refresh();
                                    //Loading(false);

                                    nextState = {
                                        ...nextState,
                                        divShift: {
                                            ...nextState.divShift,
                                            visible: true,
                                            Shift: {
                                                ...nextState.divShift.Shift,
                                                data: [...data],
                                                refresh: !Shift.refresh
                                            }
                                        }
                                    };
                                } else {
                                    //$("#divShift").hide();
                                    //let ddlShift = $("#ShiftID").data("kendoDropDownList");
                                    //ddlShift.value(data.ShiftID);
                                    //$("#LeaveDays").val(data.LeaveDays);
                                    let time1 = data.HoursFrom && moment(data.HoursFrom).toDate(), //hoursFrom.toTimeString().substr(0, 5),
                                        time2 = data.HoursTo && moment(data.HoursTo).toDate(); //hoursTo.toTimeString().substr(0, 5);

                                    //$("#HoursFrom").val(time1);
                                    //$("#HoursTo").val(time2);
                                    //$("#LeaveHours").val(data.LeaveHours);
                                    //document.getElementById("LeaveHours").readOnly = true;

                                    //Loading(false);

                                    let findShift = Shift.data.find(item => item.ID == data.ShiftID);
                                    if (!findShift) {
                                        findShift = {};
                                    }

                                    nextState = {
                                        ...nextState,
                                        divShift: {
                                            ...nextState.divShift,
                                            visible: false,
                                            Shift: {
                                                ...nextState.divShift.Shift,
                                                value: { ...findShift },
                                                refresh: !Shift.refresh
                                            }
                                        },
                                        Div_DurationType1: {
                                            ...Div_DurationType1,
                                            DurationTypeDetail: {
                                                ...DurationTypeDetail,
                                                DurationTypeFullShift: {
                                                    ...DurationTypeFullShift,
                                                    LeaveDays: {
                                                        ...LeaveDays,
                                                        value: data.LeaveDays,
                                                        refresh: !LeaveDays.refresh
                                                    }
                                                },
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
                                                    divLeaveHours: {
                                                        ...divLeaveHours,
                                                        LeaveHours: {
                                                            ...LeaveHours,
                                                            value: data.LeaveHours,
                                                            disable: true,
                                                            refresh: !LeaveHours.refresh
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    };
                                }
                            } else if (data.ShiftType == 'E_FULLSHIFT') {
                                //$("#LeaveDays").val(data.LeaveDays);
                                let time1 = data.HoursFrom && moment(data.HoursFrom).toDate(), //hoursFrom.toTimeString().substr(0, 5),
                                    time2 = data.HoursTo && moment(data.HoursTo).toDate(); //hoursTo.toTimeString().substr(0, 5);
                                //$("#HoursFrom").val(time1);
                                //$("#HoursTo").val(time2);
                                //$("#LeaveHours").val(data.LeaveHours);
                                //document.getElementById("LeaveHours").readOnly = true;
                                //Loading(false);

                                let findShift = Shift.data.find(item => item.ID == data.ShiftID);
                                if (!findShift) {
                                    findShift = {};
                                }

                                nextState = {
                                    ...nextState,
                                    Div_DurationType1: {
                                        ...Div_DurationType1,
                                        DurationTypeDetail: {
                                            ...DurationTypeDetail,
                                            DurationTypeFullShift: {
                                                ...DurationTypeFullShift,
                                                LeaveDays: {
                                                    ...LeaveDays,
                                                    value: data.LeaveDays,
                                                    refresh: !LeaveDays.refresh
                                                }
                                            },
                                            OtherDurationType: {
                                                ...OtherDurationType,
                                                HoursFrom: {
                                                    ...HoursFrom,
                                                    value: time1,
                                                    //value: moment(data.HoursFrom).toDate(),
                                                    refresh: !HoursFrom.refresh
                                                },
                                                HoursTo: {
                                                    ...HoursTo,
                                                    value: time2,
                                                    refresh: !HoursTo.refresh
                                                },
                                                divLeaveHours: {
                                                    ...divLeaveHours,
                                                    LeaveHours: {
                                                        ...LeaveHours,
                                                        value: data.LeaveHours,
                                                        disable: true,
                                                        refresh: !LeaveHours.refresh
                                                    }
                                                }
                                            }
                                        }
                                    }
                                };
                            }
                        }

                        this.setState(nextState, () => {
                            if (callbackSelectMidleShift && typeof callbackSelectMidleShift == 'function') {
                                callbackSelectMidleShift();
                            }
                        });
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });
            }
        });
    };

    ComputeRemainDays = () => {
        const {
                isChoseProfile,
                Profile,
                Profiles,
                DateStart,
                LeaveDayTypeByGrade,
                LeaveDayTypeFull,
                btnComputeRemainDaysPortal
            } = this.state,
            { LeaveDayType } = LeaveDayTypeFull,
            { TempLeaveDayType } = LeaveDayTypeByGrade,
            { hoursportal, dayportal } = btnComputeRemainDaysPortal;

        let _profileIds = null,
            _DateStart = DateStart.value,
            _LeaveDayTypeID = '';

        //check đăng ký hộ
        if (this.isRegisterHelp && isChoseProfile) {
            _profileIds = Profiles.value;
            if (_profileIds && _profileIds.length) _profileIds = _profileIds[0].ID;
        } else {
            _profileIds = Profile.ID;
        }

        if (LeaveDayType.value && LeaveDayType.value.ID) {
            _LeaveDayTypeID = LeaveDayType.value.ID;
        } else {
            _LeaveDayTypeID = TempLeaveDayType.value ? TempLeaveDayType.value.ID : null;
        }

        let dataBody = { profileID: _profileIds, leaveDayTypeID: _LeaveDayTypeID, dateStart: _DateStart };

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetRemainAnlDays', dataBody).then(data => {
            VnrLoadingSevices.hide();
            try {
                if (data != null) {
                    this.setState({
                        btnComputeRemainDaysPortal: {
                            ...btnComputeRemainDaysPortal,
                            hoursportal: {
                                ...hoursportal,
                                value: data,
                                refresh: !hoursportal.refresh
                            },
                            dayportal: {
                                ...dayportal,
                                value: data,
                                refresh: !dayportal.refresh
                            }
                        }
                    });
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    SetComputeDurationTypes = value => {
        let nextState = {};

        const {
                Div_DurationType1,
                LeaveDayTypeFull,
                Profiles,
                Profile,
                LeaveDayTypeByGrade,
                isChoseProfile,
                DateEnd,
                divShift
            } = this.state,
            { Shift } = divShift,
            { LeaveDayType } = LeaveDayTypeFull,
            { TempLeaveDayType } = LeaveDayTypeByGrade,
            { DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
            { LeaveDays } = DurationTypeFullShift,
            { LeaveHoursDetail, divHoursMiddleOfShift, divLeaveHours } = OtherDurationType,
            { ConfigLeaveHoursDetail } = LeaveHoursDetail,
            { LeaveHours } = divLeaveHours,
            { HoursFrom, HoursTo } = OtherDurationType;

        if (value == 'E_FULLSHIFT') {
            this.ComputeDurationTypes(value);

            nextState = {
                Div_DurationType1: {
                    ...Div_DurationType1,
                    //visible: true,
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
                                disable: true
                            },
                            HoursTo: {
                                ...HoursTo,
                                visible: true,
                                disable: true
                            },
                            divHoursMiddleOfShift: {
                                ...divHoursMiddleOfShift,
                                visible: false
                            },
                            divLeaveHours: {
                                ...divLeaveHours,
                                visible: true
                            }
                        },
                        DurationTypeFullShift: {
                            ...DurationTypeFullShift,
                            visible: true
                        }
                    }
                }
            };

            this.setState(nextState);
        } else if (value == 'E_FIRSTHALFSHIFT') {
            this.ComputeDurationTypes(value);

            nextState = {
                Div_DurationType1: {
                    ...Div_DurationType1,
                    //visible: false,
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
                                disable: true
                            },
                            HoursTo: {
                                ...HoursTo,
                                visible: true,
                                disable: true
                            },
                            divHoursMiddleOfShift: {
                                ...divHoursMiddleOfShift,
                                visible: false
                            },
                            divLeaveHours: {
                                ...divLeaveHours,
                                visible: true,
                                LeaveHours: {
                                    ...LeaveHours,
                                    disable: true
                                }
                            }
                        },
                        DurationTypeFullShift: {
                            ...DurationTypeFullShift,
                            visible: false
                        }
                    }
                }
            };

            this.setState(nextState);
        } else if (value == 'E_LASTHALFSHIFT') {
            //$('.mask-hours').removeClass('z-i-0');
            //isShowEle(item1, true);
            //isShowEle(item2, false);
            //isShowEle('#has-middle-shift', false);
            //isShowEle('#not-middle-shift', true);
            //document.getElementById("LeaveHours").readOnly = true;
            this.ComputeDurationTypes(value);
            //isShowEle(item3, true);
            //isShowEle(item4);
            //isShowEle(item5, true);
            //isShowEle(item6, true);
            //isShowEle(item7);
            //isShowEle(item8, true);

            //isReadOnlyTime($(frm + " #HoursFrom"), true);
            //isReadOnlyTime($(frm + " #HoursTo"), true);

            nextState = {
                Div_DurationType1: {
                    ...Div_DurationType1,
                    //visible: false,
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
                                disable: true
                            },
                            HoursTo: {
                                ...HoursTo,
                                visible: true,
                                disable: true
                            },
                            divHoursMiddleOfShift: {
                                ...divHoursMiddleOfShift,
                                visible: false
                            },
                            divLeaveHours: {
                                ...divLeaveHours,
                                visible: true,
                                LeaveHours: {
                                    ...LeaveHours,
                                    disable: true
                                }
                            }
                        },
                        DurationTypeFullShift: {
                            ...DurationTypeFullShift,
                            visible: false
                        }
                    }
                }
            };

            this.setState(nextState);
        } else if (value == 'E_MIDDLEOFSHIFT') {
            //chạy theo cấu hình Nghỉ giữa ca theo khung theo chế độ công
            if (this.IsLeaveHoursDetail) {
                let leaveDayTypeID = TempLeaveDayType.value
                        ? TempLeaveDayType.value.ID
                        : LeaveDayType.value
                            ? LeaveDayType.value.ID
                            : null,
                    _profileIds = null,
                    _shiftID = Shift.value ? Shift.value.ID : null;

                //check đăng ký hộ
                if (this.isRegisterHelp && isChoseProfile) {
                    _profileIds = Profiles.value && Profiles.value.length ? Profiles.value[0].ID : null;
                } else {
                    _profileIds = Profile.ID;
                }

                VnrLoadingSevices.show();
                HttpService.Get(
                    '[URI_HR]/Att_GetData/GetCofigAndDataLeaveHoursDetail?LeaveDayTypeID=' +
                    leaveDayTypeID +
                    '&ShiftID=' +
                    _shiftID +
                    '&ProfileID=' +
                    _profileIds +
                    '&MonthEnd=' +
                    DateEnd
                ).then(res => {
                    VnrLoadingSevices.hide();
                    try {
                        let _dataConfigLeaveHoursDetail = [];
                        if (res && Array.isArray(res)) {
                            _dataConfigLeaveHoursDetail = res.map(item => {
                                return {
                                    LeaveHoursDetail: item.LeaveHoursDetail
                                };
                            });
                        }

                        nextState = {
                            Div_DurationType1: {
                                ...Div_DurationType1,
                                //visible: false,
                                DurationTypeDetail: {
                                    ...DurationTypeDetail,
                                    visible: true,
                                    OtherDurationType: {
                                        ...OtherDurationType,
                                        visible: true,
                                        LeaveHoursDetail: {
                                            ...LeaveHoursDetail,
                                            visible: true,
                                            ConfigLeaveHoursDetail: {
                                                ...ConfigLeaveHoursDetail,
                                                data: [..._dataConfigLeaveHoursDetail],
                                                refresh: !ConfigLeaveHoursDetail.refresh
                                            }
                                        },
                                        HoursFrom: {
                                            ...HoursFrom,
                                            visible: false,
                                            disable: false
                                        },
                                        HoursTo: {
                                            ...HoursTo,
                                            visible: false,
                                            disable: false
                                        },
                                        divHoursMiddleOfShift: {
                                            ...divHoursMiddleOfShift,
                                            visible: false
                                        },
                                        divLeaveHours: {
                                            ...divLeaveHours,
                                            visible: true,
                                            LeaveHours: {
                                                ...LeaveHours,
                                                disable: true,
                                                value: 0,
                                                refresh: !LeaveHours.refresh
                                            }
                                        }
                                    },
                                    DurationTypeFullShift: {
                                        ...DurationTypeFullShift,
                                        visible: false
                                    }
                                }
                            }
                        };

                        this.setState(nextState);
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });
            }

            //chạy theo cấu hình mặc định hoặc cấu hình DS số giờ đăng ký nghỉ giữa ca theo từng loại ngày nghỉ
            else {
                // $("#HoursFrom").val("");
                //$("#HoursTo").val("");
                //$("#LeaveHours").val(0);

                //$('.mask-hours').addClass('z-i-0');
                //$("#LeaveHours").readOnly = false;
                // isShowEle(item1, true);
                // isShowEle(item2, false);
                // isShowEle(item3, true);

                nextState = {
                    Div_DurationType1: {
                        ...Div_DurationType1,
                        //visible: false,
                        DurationTypeDetail: {
                            ...DurationTypeDetail,
                            visible: true,
                            OtherDurationType: {
                                ...OtherDurationType,
                                visible: true,
                                HoursFrom: {
                                    ...HoursFrom,
                                    disable: false,
                                    value: null,
                                    refresh: !HoursFrom.refresh
                                },
                                HoursTo: {
                                    ...HoursTo,
                                    disable: false,
                                    value: null,
                                    refresh: !HoursTo.refresh
                                },
                                divLeaveHours: {
                                    ...divLeaveHours,
                                    LeaveHours: {
                                        ...LeaveHours,
                                        disable: false,
                                        value: 0,
                                        refresh: !LeaveHours.refresh
                                    }
                                }
                            },
                            DurationTypeFullShift: {
                                ...DurationTypeFullShift,
                                visible: false
                            }
                        }
                    }
                };

                this.setState(nextState, () => {
                    //chạy theo DS số giờ nghỉ giữa ca theo từng loại ngày nghỉ
                    this.ComputeDurationTypes(value);
                });
            }
        } else if (value == 'E_OUT_OF_SHIFT') {
            //$("#HoursFrom").val("");
            //$("#HoursTo").val("");
            //$("#LeaveHours").val(0);
            this.ComputeDurationTypes(value);
            //$("#HoursFrom").readOnly = false;
            //$("#HoursTo").readOnly = false;
            //document.getElementById("LeaveHours").readOnly = false;
            //$('.mask-hours').addClass('z-i-0');
            //isShowEle(item1, true);
            //isShowEle(item2, false);
            //isShowEle(item3, true);
            //isShowEle(item4);
            //isShowEle(item5, true);
            //isShowEle(item6, true);
            //isShowEle(item7);
            //isShowEle(item8, true);

            //isReadOnlyTime($(frm + " #HoursFrom"), false);
            //isReadOnlyTime($(frm + " #HoursTo"), false);

            nextState = {
                Div_DurationType1: {
                    ...Div_DurationType1,
                    //visible: false,
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
                                disable: false
                            },
                            HoursTo: {
                                ...HoursTo,
                                visible: true,
                                disable: false
                            },
                            divHoursMiddleOfShift: {
                                ...divHoursMiddleOfShift,
                                visible: false
                            },
                            divLeaveHours: {
                                ...divLeaveHours,
                                visible: true,
                                LeaveHours: {
                                    ...LeaveHours,
                                    disable: false,
                                    value: 0,
                                    refresh: !LeaveHours.refresh
                                }
                            }
                        },
                        DurationTypeFullShift: {
                            ...DurationTypeFullShift,
                            visible: false
                        }
                    }
                }
            };

            this.setState(nextState);
        } else {
            //$("#HoursFrom").val("");
            //$("#HoursTo").val("");
            //$("#LeaveHours").val(0);
            //$("#LeaveDays").val(0);
            //isShowEle(item3, false);
            //isShowEle(item4);
            //isShowEle(item5, true);
            //isShowEle(item6, true);
            //isShowEle(item7);
            //isShowEle(item8, true);
            //isReadOnlyTime($(frm + ' #HoursTo'), false);
            //Loading(false);

            //isReadOnlyTime($(frm + " #HoursFrom"), false);
            //isReadOnlyTime($(frm + " #HoursTo"), false);

            nextState = {
                Div_DurationType1: {
                    ...Div_DurationType1,
                    DurationTypeDetail: {
                        ...DurationTypeDetail,
                        visible: false,
                        OtherDurationType: {
                            ...OtherDurationType,
                            LeaveHoursDetail: {
                                ...LeaveHoursDetail,
                                visible: false
                            },
                            HoursFrom: {
                                ...HoursFrom,
                                visible: true,
                                disable: false
                            },
                            HoursTo: {
                                ...HoursTo,
                                visible: true,
                                disable: false
                            },
                            divHoursMiddleOfShift: {
                                ...divHoursMiddleOfShift,
                                visible: false
                            },
                            divLeaveHours: {
                                ...divLeaveHours,
                                visible: true,
                                LeaveHours: {
                                    ...LeaveHours,
                                    disable: false,
                                    value: 0,
                                    refresh: !LeaveHours.refresh
                                }
                            }
                        },
                        DurationTypeFullShift: {
                            ...DurationTypeFullShift,
                            LeaveDays: {
                                ...LeaveDays,
                                value: 0,
                                refresh: !LeaveDays.refresh
                            }
                        }
                    }
                }
            };

            this.setState(nextState);
        }
    };

    SelectMiddleOfShift = (leaveDayTypeID, type, val) => {
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
                                                    value: val,
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
                                                disable: true,
                                                visible: true,
                                                refresh: !HoursTo.refresh
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
                                                disable: false,
                                                refresh: !HoursTo.refresh
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

    showDayOrHourByLeaveDayType = leaveDayTypeID => {
        const { btnComputeRemainDaysPortal, DateStart } = this.state,
            { hoursportal, dayportal, leaveDayTypeView } = btnComputeRemainDaysPortal;

        if (leaveDayTypeID && DateStart) {
            let dateStartNew = DateStart.value,
                dataBody = {
                    ProfileID: profileInfo[enumName.E_ProfileID],
                    leaveDayTypeID: leaveDayTypeID,
                    dateStart: dateStartNew
                };

            VnrLoadingSevices.show();

            const listRequest = [
                HttpService.Post('[URI_HR]/Att_GetData/ChangeDayorHours', dataBody),
                HttpService.Post('[URI_HR]/Att_GetData/GetRemainAnlDays', dataBody),
                HttpService.Post('[URI_HR]/Att_GetData/GetLeavedayTypeById', {
                    leaveDayTypeID: leaveDayTypeID
                })
            ];

            HttpService.MultiRequest(listRequest, this.showDayOrHourByLeaveDayType).then(allData => {
                VnrLoadingSevices.hide();
                try {
                    const dataConfigDayHours = allData[0],
                        dataRemain = allData[1],
                        dataLeaveType = allData[2];

                    if (dataConfigDayHours !== null && dataRemain !== null) {
                        let nextState1 = {};

                        let result = dataConfigDayHours.split('|');
                        if (result[0] == 'E_HOURS') {
                            nextState1 = {
                                ...nextState1,
                                btnComputeRemainDaysPortal: {
                                    ...btnComputeRemainDaysPortal,
                                    hoursportal: {
                                        ...hoursportal,
                                        visible: true,
                                        value: dataRemain !== null ? dataRemain : null
                                    },
                                    dayportal: {
                                        ...dayportal,
                                        visible: false,
                                        value: null
                                    },
                                    leaveDayTypeView: {
                                        ...leaveDayTypeView,
                                        value: dataLeaveType ? dataLeaveType : null,
                                        visible: dataLeaveType ? true : false
                                    }
                                }
                            };
                        } else {
                            nextState1 = {
                                ...nextState1,
                                btnComputeRemainDaysPortal: {
                                    ...btnComputeRemainDaysPortal,
                                    hoursportal: {
                                        ...hoursportal,
                                        visible: false,
                                        value: null
                                    },
                                    dayportal: {
                                        ...dayportal,
                                        visible: true,
                                        value: dataRemain !== null ? dataRemain : null
                                    },
                                    leaveDayTypeView: {
                                        ...leaveDayTypeView,
                                        value: dataLeaveType ? dataLeaveType : null,
                                        visible: dataLeaveType ? true : false
                                    }
                                }
                            };
                        }

                        if (result.length == 3) {
                            nextState1 = {
                                ...nextState1,
                                btnComputeRemainDaysPortal: {
                                    ...nextState1.btnComputeRemainDaysPortal,
                                    visible: true
                                }
                            };
                        } else {
                            nextState1 = {
                                ...nextState1,
                                btnComputeRemainDaysPortal: {
                                    ...nextState1.btnComputeRemainDaysPortal,
                                    visible: false
                                }
                            };
                        }

                        this.setState(nextState1);
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        }
    };

    onPickerChangeHoursMiddleOfShift = item => {
        const { Div_DurationType1 } = this.state,
            { DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType } = DurationTypeDetail,
            { divHoursMiddleOfShift } = OtherDurationType,
            { HoursMiddleOfShift } = divHoursMiddleOfShift;

        this.setState(
            {
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
                                    value: item,
                                    refresh: !HoursMiddleOfShift.refresh
                                }
                            }
                        }
                    }
                }
            },
            () => {
                const { Div_DurationType1, DateStart, DateEnd, divShift } = this.state,
                    { Shift } = divShift,
                    { DurationTypeDetail } = Div_DurationType1,
                    { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
                    { LeaveDays } = DurationTypeFullShift,
                    { divHoursMiddleOfShift, divLeaveHours } = OtherDurationType,
                    { HoursMiddleOfShift } = divHoursMiddleOfShift,
                    { LeaveHours } = divLeaveHours,
                    { HoursTo, HoursFrom } = OtherDurationType,
                    dateStartNew = DateStart.value,
                    dateEndNew = DateEnd.value,
                    hoursFrom = HoursFrom.value ? moment(HoursFrom.value).format('HH:mm') : null,
                    hoursSelect = HoursMiddleOfShift.value ? HoursMiddleOfShift.value.Value : null,
                    _shiftID = Shift.value ? Shift.value.ID : null;

                if (hoursFrom && hoursSelect) {
                    VnrLoadingSevices.show();
                    HttpService.Post('[URI_HR]/Att_GetData/GetLeaveHourMidleOfShift', {
                        profileId: profileInfo[enumName.E_ProfileID],
                        dateStart: dateStartNew,
                        dateEnd: dateEndNew,
                        hourFrom: hoursFrom,
                        hoursSelect: hoursSelect,
                        ShiftID: _shiftID
                    }).then(data => {
                        VnrLoadingSevices.hide();
                        if (data.ErrorMessage == 'TimeInValid' && data.BeginShift && data.EndShift) {
                            let _message =
                                translate('WarningThisTimeValueOutTimeShiftFromTo') +
                                ' ' +
                                moment(data.BeginShift).format('HH:mm') +
                                ' ' +
                                translate('HRM_Common_ToLower') +
                                ' ' +
                                moment(data.EndShift).format('HH:mm'); //+ '. ' + translate('WarningDoYouWantSystemAutoUpdate');

                            AlertSevice.alert({
                                title: translate('Hrm_Notification'),
                                iconType: EnumIcon.E_WARNING,
                                message: _message,
                                onCancel: () => {
                                    this.setState({
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
                                                            value: null,
                                                            refresh: !HoursMiddleOfShift.refresh
                                                        }
                                                    },
                                                    HoursTo: {
                                                        ...HoursTo,
                                                        value: null,
                                                        refresh: !HoursTo.refresh
                                                    },
                                                    divLeaveHours: {
                                                        ...divLeaveHours,
                                                        LeaveHours: {
                                                            ...LeaveHours,
                                                            value: null,
                                                            refresh: !LeaveHours.refresh
                                                        }
                                                    }
                                                },
                                                DurationTypeFullShift: {
                                                    ...DurationTypeFullShift,
                                                    LeaveDays: {
                                                        ...LeaveDays,
                                                        value: null,
                                                        refresh: !LeaveDays.refresh
                                                    }
                                                }
                                            }
                                        }
                                    });
                                },
                                showConfirm: false
                            });
                        } else {
                            try {
                                let time2 = moment(data.HoursTo).toDate(), //To.toTimeString().substr(0, 5),
                                    nextState = {
                                        Div_DurationType1: {
                                            ...Div_DurationType1,
                                            DurationTypeDetail: {
                                                ...DurationTypeDetail,
                                                OtherDurationType: {
                                                    ...OtherDurationType,
                                                    divHoursMiddleOfShift: {
                                                        ...divHoursMiddleOfShift,
                                                        visible: true
                                                    },
                                                    HoursTo: {
                                                        ...HoursTo,
                                                        value: time2,
                                                        refresh: !HoursTo.refresh
                                                    },
                                                    divLeaveHours: {
                                                        ...divLeaveHours,
                                                        LeaveHours: {
                                                            ...LeaveHours,
                                                            value: data.LeaveHours,
                                                            refresh: !LeaveHours.refresh
                                                        }
                                                    }
                                                },
                                                DurationTypeFullShift: {
                                                    ...DurationTypeFullShift,
                                                    LeaveDays: {
                                                        ...LeaveDays,
                                                        value: data.LeaveDays,
                                                        refresh: !LeaveDays.refresh
                                                    }
                                                }
                                            }
                                        }
                                    };
                                this.setState(nextState);
                            } catch (error) {
                                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                            }
                        }
                    });
                }
            }
        );
    };
    //#endregion

    //#region [chọn nhân viên, phòng ban]

    //chọn nhân viên hoặc phòng ban
    onChangeRadioButton = value => {
        const { UserApprove3, UserApprove4, UserApprove2, UserApprove } = this.state;
        let nextState = { isChoseProfile: value };

        //chọn phòng ban
        if (this.isRegisterHelp && !value) {
            this.isChooseMultiPro = true;
            this.isChangeLevelLeavedayApprove = true;
            //validate lam sau
            //$('label[control-field=UserApproveID] > span').remove()
            //$('label[control-field=UserApproveID2] > span').remove()

            nextState = {
                ...nextState,
                UserApprove: {
                    ...UserApprove,
                    value: null,
                    refresh: !UserApprove.refresh
                },
                UserApprove2: {
                    ...UserApprove2,
                    value: null,
                    refresh: !UserApprove2.refresh
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
                }
            };
        }
        //nếu ngược lại là nhân viên có thêm 2 trường hợp
        else if (this.isRegisterHelp) {
            this.isChooseMultiPro = false;
            this.isChangeLevelLeavedayApprove = false;
            //validate lam sau
            // if (!$('label[control-field=UserApproveID]').children().is('span'))
            //     $('label[control-field=UserApproveID]').append('<span>(*)</span>')
            // if (!$('label[control-field=UserApproveID2]').children().is('span'))
            //     $('label[control-field=UserApproveID2]').append('<span>(*)</span>')
        }

        this.setState(nextState);
    };

    //chọn nhân viên
    onMultiPickerChangeProfile = (items, isAddMore) => {
        const { Profiles } = this.state;

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
                    const {
                        Profiles,
                        DateStart,
                        DateEnd,
                        UserApprove,
                        UserApprove2,
                        UserApprove3,
                        UserApprove4
                    } = this.state;

                    let nextState1 = {};

                    if (DateStart.value && DateEnd.value) {
                        let _state = this.readOnlyCtrlLD(false);
                        nextState1 = { ..._state };
                    } else {
                        let _state = this.readOnlyCtrlLD(true);
                        nextState1 = { ..._state };
                    }

                    if (Profiles.value && Profiles.value.length > 1) {
                        this.isChooseMultiPro = true;
                        this.isChangeLevelLeavedayApprove = true;
                        //validate lam sau
                        //$('label[control-field=UserApproveID] > span').remove()
                        //$('label[control-field=UserApproveID2] > span').remove()
                        nextState1 = {
                            ...nextState1,
                            UserApprove: {
                                ...UserApprove,
                                value: null,
                                refresh: !UserApprove.refresh
                            },
                            UserApprove2: {
                                ...UserApprove2,
                                value: null,
                                refresh: !UserApprove2.refresh
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
                            }
                        };
                    } else {
                        this.isChooseMultiPro = false;
                        this.isChangeLevelLeavedayApprove = false;
                        //validate lam sau
                        // if (!$('label[control-field=UserApproveID]').children().is('span'))
                        //     $('label[control-field=UserApproveID]').append('<span>(*)</span>')
                        // if (!$('label[control-field=UserApproveID2]').children().is('span'))
                        //     $('label[control-field=UserApproveID2]').append('<span>(*)</span>')
                    }

                    let pro = Profiles.value && Profiles.value.length ? Profiles.value[0].ID : null,
                        userSubmit = profileInfo[enumName.E_ProfileID];

                    if (pro && !this.isChooseMultiPro) {
                        this.setState(nextState1, () => this.loadHighSupervisor(pro, userSubmit));
                    } else {
                        // let multiUserApproveID = $("#UserApproveID").data("kendoComboBox"),
                        //     multiUserApproveID2 = $("#UserApproveID3").data("kendoComboBox"),
                        //     multiUserApproveID3 = $("#UserApproveID4").data("kendoComboBox"),
                        //     multiUserApproveID4 = $("#UserApproveID2").data("kendoComboBox");

                        // multiUserApproveID.value(null);
                        // multiUserApproveID2.value(null);
                        // multiUserApproveID3.value(null);
                        // multiUserApproveID4.value(null);
                        if (!this.isChooseMultiPro) {
                            let _state1 = this.readOnlyCtrlLD(true);
                            nextState1 = {
                                ...nextState1,
                                ..._state1,
                                UserApprove: {
                                    ...UserApprove,
                                    value: null,
                                    refresh: !UserApprove.refresh
                                },
                                UserApprove2: {
                                    ...UserApprove2,
                                    value: null,
                                    refresh: !UserApprove2.refresh
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
                                }
                            };
                        } else {
                            nextState1 = {
                                ...nextState1,
                                UserApprove: {
                                    ...UserApprove,
                                    value: null,
                                    refresh: !UserApprove.refresh
                                },
                                UserApprove2: {
                                    ...UserApprove2,
                                    value: null,
                                    refresh: !UserApprove2.refresh
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
                                }
                            };
                        }

                        this.setState(nextState1);
                    }
                });
            }
        } else {
            let nextState = {
                Profiles: {
                    ...Profiles,
                    value: [...items],
                    refresh: !Profiles.refresh
                }
            };

            this.setState(nextState, () => {
                const {
                    Profiles,
                    DateStart,
                    DateEnd,
                    UserApprove,
                    UserApprove2,
                    UserApprove3,
                    UserApprove4
                } = this.state;

                let nextState1 = {};

                if (DateStart.value && DateEnd.value) {
                    let _state = this.readOnlyCtrlLD(false);
                    nextState1 = { ..._state };
                } else {
                    let _state = this.readOnlyCtrlLD(true);
                    nextState1 = { ..._state };
                }

                if (Profiles.value && Profiles.value.length > 1) {
                    this.isChooseMultiPro = true;
                    this.isChangeLevelLeavedayApprove = true;
                    //validate lam sau
                    //$('label[control-field=UserApproveID] > span').remove()
                    //$('label[control-field=UserApproveID2] > span').remove()
                    nextState1 = {
                        ...nextState1,
                        UserApprove: {
                            ...UserApprove,
                            value: null,
                            refresh: !UserApprove.refresh
                        },
                        UserApprove2: {
                            ...UserApprove2,
                            value: null,
                            refresh: !UserApprove2.refresh
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
                        }
                    };
                } else {
                    this.isChooseMultiPro = false;
                    this.isChangeLevelLeavedayApprove = false;
                    //validate lam sau
                    // if (!$('label[control-field=UserApproveID]').children().is('span'))
                    //     $('label[control-field=UserApproveID]').append('<span>(*)</span>')
                    // if (!$('label[control-field=UserApproveID2]').children().is('span'))
                    //     $('label[control-field=UserApproveID2]').append('<span>(*)</span>')
                }

                let pro = Profiles.value && Profiles.value.length ? Profiles.value[0].ID : null,
                    userSubmit = profileInfo[enumName.E_ProfileID];

                if (pro && !this.isChooseMultiPro) {
                    this.setState(nextState1, () => this.loadHighSupervisor(pro, userSubmit));
                } else {
                    if (!this.isChooseMultiPro) {
                        let _state1 = this.readOnlyCtrlLD(true);
                        nextState1 = {
                            ...nextState1,
                            ..._state1,
                            UserApprove: {
                                ...UserApprove,
                                value: null,
                                refresh: !UserApprove.refresh
                            },
                            UserApprove2: {
                                ...UserApprove2,
                                value: null,
                                refresh: !UserApprove2.refresh
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
                            }
                        };
                    } else {
                        nextState1 = {
                            ...nextState1,
                            UserApprove: {
                                ...UserApprove,
                                value: null,
                                refresh: !UserApprove.refresh
                            },
                            UserApprove2: {
                                ...UserApprove2,
                                value: null,
                                refresh: !UserApprove2.refresh
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
                            }
                        };
                    }

                    this.setState(nextState1);
                }
            });
        }
    };

    //chọn phòng ban
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

        this.setState({
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
        });
    };
    //#endregion

    //#region [change DateStart]
    onChangeDateStart = value => {
        const { DateStart, DateEnd } = this.state;

        let nextState = {
            DateStart: {
                ...DateStart,
                value: value,
                refresh: !DateStart.refresh
            }
            // LeaveDayTypeByGrade: {
            //     ...LeaveDayTypeByGrade,
            //     TempLeaveDayType: {
            //         ...TempLeaveDayType,
            //         value: null,
            //         refresh: !TempLeaveDayType.refresh
            //     }
            // },
            // LeaveDayTypeFull: {
            //     ...LeaveDayTypeFull,
            //     LeaveDayType: {
            //         ...LeaveDayType,
            //         value: null,
            //         refresh: !LeaveDayType.refresh
            //     }
            // }
        };

        if (value) {
            nextState = {
                ...nextState,
                DateEnd: {
                    ...DateEnd,
                    disable: false,
                    refresh: !DateEnd.refresh
                }
            };

            this.setState(nextState, () => {
                this.resetDisplayForm(this.ChangeDateStart);
            });
        } else {
            let _state = this.readOnlyCtrlLD(true);
            nextState = {
                ...nextState,
                ..._state,
                DateEnd: {
                    ...DateEnd,
                    value: null,
                    disable: true,
                    refresh: !DateEnd.refresh
                }
            };

            this.setState(nextState, () => this.resetDisplayForm());
        }
    };

    ChangeDateStart = () => {
        const {
                Div_DurationType1,
                LeaveDayTypeFull,
                Div_TypeHalfShift1,
                DateEnd,
                DateStart,
                DateReturnToWork
            } = this.state,
            { LeaveDayType } = LeaveDayTypeFull,
            { DurationType } = Div_DurationType1;

        let nextState = {};

        if (!DateStart.value) return;

        let _DateStart1 = DateStart.value,
            _DateEnd1 = DateEnd.value;

        //show lại control Duration khi chọn lại ngày bắt đầu == ngày kết thúc
        if (_DateEnd1 && _DateStart1.toLocaleString() == _DateEnd1.toLocaleString()) {
            nextState = {
                Div_TypeHalfShift1: {
                    ...Div_TypeHalfShift1,
                    visible: false
                },
                Div_DurationType1: {
                    ...Div_DurationType1,
                    visible: true
                }
            };
        }

        if (_DateStart1) {
            nextState = {
                ...nextState,
                DateEnd: {
                    ...DateEnd,
                    value: _DateStart1,
                    disable: false,
                    refresh: !DateEnd.refresh
                },
                LeaveDayTypeFull: {
                    ...LeaveDayTypeFull,
                    LeaveDayType: {
                        ...LeaveDayType,
                        disable: false,
                        refresh: !LeaveDayType.refresh
                    }
                }
            };
        } else {
            ToasterSevice.showWarning('HRM_Chose_From_Calendar', 4000);
            nextState = {
                ...nextState,
                DateEnd: {
                    ...DateEnd,
                    value: null,
                    disable: true,
                    refresh: !DateEnd.refresh
                }
            };

            this.setState(nextState);
            return;
        }

        let _DateEnd = _DateStart1,
            someFormattedDate = null;
        if (_DateEnd) {
            someFormattedDate = moment(_DateEnd)
                .add(1, 'days')
                .toDate();
        }

        let findDurationType = DurationType.data.find(item => item.Value === enumName.E_FULLSHIFT);
        if (!findDurationType) {
            findDurationType = { Text: enumName.E_FULLSHIFT, Value: enumName.E_FULLSHIFT };
        }

        nextState = {
            ...nextState,
            DateReturnToWork: {
                ...DateReturnToWork,
                value: someFormattedDate,
                refresh: !DateReturnToWork.refresh
            },
            Div_DurationType1: {
                ...Div_DurationType1,
                DurationType: {
                    ...DurationType,
                    value: { ...findDurationType },
                    refresh: !DurationType.refresh
                }
            }
        };

        this.setState(nextState, () => {
            this.LoadLeaveDayTypeByGrade(true);
            this.SetComputeDurationTypes(enumName.E_FULLSHIFT);
            this.changeDateEnd();
            this.loadPregnancyCycle();
        });
    };
    //#endregion

    //#region [change DateEnd]
    //
    onChangeDateEnd = value => {
        const { DateStart, DateEnd } = this.state;

        let nextState = {
            DateEnd: {
                ...DateEnd,
                value: value,
                refresh: !DateStart.refresh
            }
            // LeaveDayTypeByGrade: {
            //     ...LeaveDayTypeByGrade,
            //     TempLeaveDayType: {
            //         ...TempLeaveDayType,
            //         value: null,
            //         refresh: !TempLeaveDayType.refresh
            //     }
            // },
            // LeaveDayTypeFull: {
            //     ...LeaveDayTypeFull,
            //     LeaveDayType: {
            //         ...LeaveDayType,
            //         value: null,
            //         refresh: !LeaveDayType.refresh
            //     }
            // }
        };

        if (value) {
            this.setState(nextState, () => this.resetDisplayForm(this.changeDateEnd));
        } else {
            this.setState(nextState, () => this.resetDisplayForm());
        }
    };

    changeDateEnd = () => {
        const {
                Div_DurationType1,
                LeaveDayTypeFull,
                Div_TypeHalfShift1,
                DateEnd,
                DateStart,
                DateReturnToWork
            } = this.state,
            { divTypeHalfShiftContent, TypeHalfShift } = Div_TypeHalfShift1,
            { divTypeHalfShiftLeaveDay, divTypeHalfShiftLeaveHours } = divTypeHalfShiftContent,
            { TypeHalfShiftLeaveDays } = divTypeHalfShiftLeaveDay,
            { TypeHalfShiftLeaveHours } = divTypeHalfShiftLeaveHours,
            { LeaveDayType } = LeaveDayTypeFull,
            { DurationType } = Div_DurationType1;

        let value = null;
        if (TypeHalfShift.value) {
            value = TypeHalfShift.value ? TypeHalfShift.value.Value : null;
        } else if (DurationType.value) {
            value = DurationType.value ? DurationType.value.Value : null;
        }

        this.SetComputeDurationTypes(value);

        this.LoadLeaveDayTypeByGrade(true);

        this.loadPregnancyCycle();

        let someFormattedDate = moment(DateEnd.value)
            .add(1, 'days')
            .toDate();

        let nextState = {
            DateReturnToWork: {
                ...DateReturnToWork,
                value: someFormattedDate,
                refresh: !DateReturnToWork.refresh
            }
        };

        let _DateStart = DateStart.value,
            _DateEnd = DateEnd.value;

        if (_DateStart && _DateEnd) {
            nextState = {
                LeaveDayTypeFull: {
                    ...LeaveDayTypeFull,
                    LeaveDayType: {
                        ...LeaveDayType,
                        disable: false,
                        refresh: !LeaveDayType.refresh
                    }
                }
            };

            if (_DateStart.toLocaleString() == _DateEnd.toLocaleString()) {
                //$("#TypeHalfShiftLeaveDays").val(0);
                //$("#TypeHalfShiftLeaveHours").val(0);
                //isShowEle('#Div_TypeHalfShift1', false);
                //isShowEle('#Div_DurationType1', true);
                //isShowEle('#divTypeHalfShiftContent', false);
                //let durationtype = $("#DurationType").val();
                //let type1 = $("#TypeHalfShift").data("kendoDropDownList");
                //type1.value(null);
                //let type = TypeHalfShift.value ? TypeHalfShift.value.Value : null;//$("#TypeHalfShift").val();
                // if (type == enumName.E_FULLSHIFT) {
                //     type = '';
                // }

                nextState = {
                    ...nextState,
                    Div_DurationType1: {
                        ...Div_DurationType1,
                        visible: true
                    },
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
                                    value: 0,
                                    refresh: !TypeHalfShiftLeaveDays.refresh
                                }
                            },
                            divTypeHalfShiftLeaveHours: {
                                ...divTypeHalfShiftLeaveHours,
                                TypeHalfShiftLeaveHours: {
                                    ...TypeHalfShiftLeaveHours,
                                    value: 0,
                                    refresh: !TypeHalfShiftLeaveHours.refresh
                                }
                            }
                        }
                    }
                };

                this.setState(nextState, () => {
                    this.ComputeTypeHalfShift(null);
                });
            } else {
                let type = TypeHalfShift.value ? TypeHalfShift.value.Value : null;
                if (type == enumName.E_FULLSHIFT) {
                    type = '';
                }

                let _valueTypeHalfShift = TypeHalfShift.value;
                if (_DateEnd && _DateStart && moment(_DateEnd).toDate() >= moment(_DateStart).toDate()) {
                    let findTypeHalfShift = TypeHalfShift.data.find(item => item.Value === enumName.E_FULLSHIFT);
                    if (!findTypeHalfShift) {
                        findTypeHalfShift = { Text: enumName.E_FULLSHIFT, Value: enumName.E_FULLSHIFT };
                    }
                    _valueTypeHalfShift = findTypeHalfShift;
                }

                nextState = {
                    ...nextState,
                    Div_DurationType1: {
                        ...Div_DurationType1,
                        visible: false,
                        DurationType: {
                            ...DurationType,
                            value: null,
                            refresh: !DurationType.refresh
                        }
                    },
                    Div_TypeHalfShift1: {
                        ...Div_TypeHalfShift1,
                        visible: true,
                        TypeHalfShift: {
                            ...TypeHalfShift,
                            value: { ..._valueTypeHalfShift },
                            refresh: !TypeHalfShift.refresh
                        },
                        divTypeHalfShiftContent: {
                            ...divTypeHalfShiftContent,
                            visible: true,
                            divTypeHalfShiftLeaveDay: {
                                ...divTypeHalfShiftLeaveDay,
                                TypeHalfShiftLeaveDays: {
                                    ...TypeHalfShiftLeaveDays,
                                    value: 0,
                                    refresh: !TypeHalfShiftLeaveDays.refresh
                                }
                            },
                            divTypeHalfShiftLeaveHours: {
                                ...divTypeHalfShiftLeaveHours,
                                TypeHalfShiftLeaveHours: {
                                    ...TypeHalfShiftLeaveHours,
                                    value: 0,
                                    refresh: !TypeHalfShiftLeaveHours.refresh
                                }
                            }
                        }
                    }
                };

                this.setState(nextState, () => {
                    this.ComputeTypeHalfShift(type, true);
                });
            }
        } else {
            //let _dropdownLeaveDayType = $('#LeaveDayTypeID').data("kendoComboBox");
            //_dropdownLeaveDayType.enable(false);

            nextState = {
                ...nextState,
                LeaveDayTypeFull: {
                    ...LeaveDayTypeFull,
                    LeaveDayType: {
                        ...LeaveDayType,
                        disable: true,
                        refresh: !LeaveDayType.refresh
                    }
                }
            };

            this.setState(nextState);
        }
    };

    checkLeaveDayTypeIsPregnancy = response => {
        const { LeaveDayTypeByGrade, PregnancyCycleID } = this.state,
            { TempLeaveDayType } = LeaveDayTypeByGrade;

        if (PregnancyCycleID.visibleConfig && TempLeaveDayType && TempLeaveDayType.value) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/CheckLeaveDayType', {
                leaveDayTypeID: TempLeaveDayType.value.ID
            }).then(isHavePreg => {
                VnrLoadingSevices.hide();
                if (isHavePreg) {
                    this.setState(
                        {
                            PregnancyCycleID: {
                                ...PregnancyCycleID,
                                disable: false,
                                visible: true, // show PregnancyCycleID
                                refresh: !PregnancyCycleID.refresh
                            }
                        },
                        () => {
                            this.loadPregnancyCycle(response);
                        }
                    );
                } else {
                    this.setState({
                        PregnancyCycleID: {
                            ...PregnancyCycleID,
                            value: null,
                            disable: false,
                            visible: false, // hidden PregnancyCycleID
                            refresh: !PregnancyCycleID.refresh
                        }
                    });
                }
            });
        }
    };

    loadPregnancyCycle = response => {
        const { Profile, DateStart, DateEnd, PregnancyCycleID } = this.state;

        if (Profile.ID && DateStart.value && DateEnd.value) {
            let dateStartNew = DateStart.value ? moment(DateStart.value).format('YYYY-MM-DD') : null,
                dateEndNew = DateEnd.value ? moment(DateEnd.value).format('YYYY-MM-DD') : null,
                valuePregnancyCycle =
                    response && response['PregnancyCycleID']
                        ? { ID: response['PregnancyCycleID'], PregnancyCycleName: response['PregnancyCycleName'] }
                        : null;

            VnrLoadingSevices.show();
            const dataBody = { profileId: Profile.ID, dateStart: dateStartNew, dateEnd: dateEndNew };
            HttpService.Post('[URI_HR]/Att_GetData/LoadPregnancyCycleByProAndDate', dataBody).then(
                dataPregnancyCycle => {
                    VnrLoadingSevices.hide();
                    if (dataPregnancyCycle) {
                        if (dataPregnancyCycle.length == 1) {
                            this.setState({
                                PregnancyCycleID: {
                                    ...PregnancyCycleID,
                                    data: dataPregnancyCycle,
                                    value: valuePregnancyCycle
                                        ? valuePregnancyCycle
                                        : {
                                            ID: dataPregnancyCycle[0].ID,
                                            PregnancyCycleName: dataPregnancyCycle[0].PregnancyCycleName
                                        },
                                    refresh: !PregnancyCycleID.refresh
                                }
                            });
                        } else if (dataPregnancyCycle.length > 1) {
                            this.setState({
                                PregnancyCycleID: {
                                    ...PregnancyCycleID,
                                    data: dataPregnancyCycle,
                                    value: valuePregnancyCycle,
                                    refresh: !PregnancyCycleID.refresh
                                }
                            });
                        } else {
                            this.setState({
                                PregnancyCycleID: {
                                    ...PregnancyCycleID,
                                    data: [],
                                    value: valuePregnancyCycle,
                                    refresh: !PregnancyCycleID.refresh
                                }
                            });
                        }
                    }
                }
            );
        }
    };
    //#endregion

    //#region [change DurationType, TypeHalfShift]

    //change DurationType
    onPickerChangeDurationType = item => {
        const { Div_DurationType1, DateStart, Profiles, Profile, isChoseProfile, DateEnd } = this.state,
            { DurationTypeDetail, DurationType } = Div_DurationType1,
            { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
            { LeaveDays } = DurationTypeFullShift,
            { divLeaveHours } = OtherDurationType,
            { LeaveHours } = divLeaveHours,
            { HoursFrom, HoursTo } = OtherDurationType;

        let value = item ? item.Value : null,
            dateStartNew = DateStart.value ? moment(DateStart.value).format('YYYY-MM-DD') : null,
            dateEndNew = DateEnd.value ? moment(DateEnd.value).format('YYYY-MM-DD') : null,
            profileIds = null,
            nextState = {
                Div_DurationType1: {
                    ...Div_DurationType1,
                    DurationType: {
                        ...DurationType,
                        value: { ...item }
                        //refresh: !DurationType.refresh
                    }
                }
            };

        //check đăng ký hộ
        if (this.isRegisterHelp && isChoseProfile) {
            let _profiles = Profiles.value;
            if (_profiles && _profiles.length) profileIds = _profiles.map(item => item.ID).join();
        } else {
            profileIds = Profile.ID;
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetMessageProfileDifferentShift', {
            profileId: profileIds,
            dateStart: dateStartNew,
            dateEnd: dateEndNew,
            ShiftType: value
        }).then(data => {
            VnrLoadingSevices.hide();
            try {
                if (data && data !== '') {
                    ToasterSevice.showWarning(data, 4000);

                    nextState = {
                        ...nextState,
                        Div_DurationType1: {
                            ...nextState.Div_DurationType1,
                            DurationTypeDetail: {
                                ...DurationTypeDetail,
                                OtherDurationType: {
                                    ...OtherDurationType,
                                    divLeaveHours: {
                                        ...divLeaveHours,
                                        LeaveHours: {
                                            ...LeaveHours,
                                            value: 0,
                                            disable: true,
                                            refresh: !LeaveHours.refresh
                                        }
                                    },
                                    HoursFrom: {
                                        ...HoursFrom,
                                        disable: true,
                                        refresh: !HoursFrom.refresh
                                    },
                                    HoursTo: {
                                        ...HoursTo,
                                        disable: true,
                                        refresh: !HoursTo.refresh
                                    }
                                },
                                DurationTypeFullShift: {
                                    ...DurationTypeFullShift,
                                    LeaveDays: {
                                        ...LeaveDays,
                                        value: 0,
                                        refresh: !LeaveDays.refresh
                                    }
                                }
                            }
                        }
                    };
                    this.setState(nextState);
                } else {
                    nextState = {
                        ...nextState,
                        Div_DurationType1: {
                            ...nextState.Div_DurationType1,
                            DurationTypeDetail: {
                                ...DurationTypeDetail,
                                OtherDurationType: {
                                    ...OtherDurationType,
                                    divLeaveHours: {
                                        ...divLeaveHours,
                                        LeaveHours: {
                                            ...LeaveHours,
                                            value: 0,
                                            disable: false,
                                            refresh: !LeaveHours.refresh
                                        }
                                    },
                                    HoursFrom: {
                                        ...HoursFrom,
                                        disable: false,
                                        refresh: !HoursFrom.refresh
                                    },
                                    HoursTo: {
                                        ...HoursTo,
                                        disable: false,
                                        refresh: !HoursTo.refresh
                                    }
                                }
                            }
                        }
                    };
                    this.setState(nextState, () => this.SetComputeDurationTypes(value));
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    //change TypeHalfShift
    onPickerChangeTypeHalfShift = item => {
        const { Div_TypeHalfShift1, DateStart, DateEnd, LeaveDayTypeFull, LeaveDayTypeByGrade } = this.state,
            { LeaveDayType } = LeaveDayTypeFull,
            { TempLeaveDayType } = LeaveDayTypeByGrade,
            {
                TypeHalfShift,
                divTypeHalfShiftContent,
                divMiddleShiftMoreDay,
                divFullShiftMoreDay,
                divFirstLastShiftMoreDay
            } = Div_TypeHalfShift1,
            value = item ? item.Value : null;

        let dateS = DateStart.value ? moment(DateStart.value) : null,
            dateE = DateEnd.value ? moment(DateEnd.value) : null,
            nextState = {};

        if (!this.IsInsuranceLeave) {
            if (value == 'E_MIDDLEOFSHIFT' && dateS && dateE && dateE > dateS) {
                nextState = {
                    Div_TypeHalfShift1: {
                        ...Div_TypeHalfShift1,
                        TypeHalfShift: {
                            ...TypeHalfShift,
                            value: item,
                            refresh: !TypeHalfShift.refresh
                        },
                        divTypeHalfShiftContent: {
                            ...divTypeHalfShiftContent,
                            visible: false
                        },
                        divMiddleShiftMoreDay: {
                            ...divMiddleShiftMoreDay,
                            visible: true
                        },
                        divFullShiftMoreDay: {
                            ...divFullShiftMoreDay,
                            visible: false
                        },
                        divFirstLastShiftMoreDay: {
                            ...divFirstLastShiftMoreDay,
                            visible: false
                        }
                    }
                };

                let leavedayTypeID = LeaveDayType.value;
                if (!leavedayTypeID) {
                    nextState = {
                        ...nextState,
                        LeaveDayTypeFull: {
                            ...LeaveDayTypeFull,
                            value: TempLeaveDayType.value,
                            refresh: !LeaveDayTypeFull.refresh
                        }
                    };
                }

                this.setState(nextState, () => this.GenerateControl());
            } else if (
                value == 'E_FULLSHIFT' &&
                dateS &&
                dateE &&
                dateE > dateS &&
                this.IsconfigMultipleLeaveDayTypeFull
            ) {
                nextState = {
                    Div_TypeHalfShift1: {
                        ...Div_TypeHalfShift1,
                        TypeHalfShift: {
                            ...TypeHalfShift,
                            value: item,
                            refresh: !TypeHalfShift.refresh
                        },
                        divTypeHalfShiftContent: {
                            ...divTypeHalfShiftContent,
                            visible: false
                        },
                        divMiddleShiftMoreDay: {
                            ...divMiddleShiftMoreDay,
                            visible: false
                        },
                        divFullShiftMoreDay: {
                            ...divFullShiftMoreDay,
                            visible: true
                        },
                        divFirstLastShiftMoreDay: {
                            ...divFirstLastShiftMoreDay,
                            visible: false
                        }
                    }
                };

                let leavedayTypeID = LeaveDayType.value;
                if (!leavedayTypeID) {
                    nextState = {
                        ...nextState,
                        LeaveDayTypeFull: {
                            ...LeaveDayTypeFull,
                            value: TempLeaveDayType.value,
                            refresh: !LeaveDayTypeFull.refresh
                        }
                    };
                }

                this.setState(nextState, () => this.GenerateControl());
            } else if ((value == 'E_FIRSTHALFSHIFT' || value == 'E_LASTHALFSHIFT') && dateS && dateE && dateE > dateS) {
                nextState = {
                    Div_TypeHalfShift1: {
                        ...Div_TypeHalfShift1,
                        TypeHalfShift: {
                            ...TypeHalfShift,
                            value: item,
                            refresh: !TypeHalfShift.refresh
                        },
                        divTypeHalfShiftContent: {
                            ...divTypeHalfShiftContent,
                            visible: false
                        },
                        divMiddleShiftMoreDay: {
                            ...divMiddleShiftMoreDay,
                            visible: false
                        },
                        divFullShiftMoreDay: {
                            ...divFullShiftMoreDay,
                            visible: false
                        },
                        divFirstLastShiftMoreDay: {
                            ...divFirstLastShiftMoreDay,
                            visible: true
                        }
                    }
                };

                let leavedayTypeID = LeaveDayType.value;
                if (!leavedayTypeID) {
                    nextState = {
                        ...nextState,
                        LeaveDayTypeFull: {
                            ...LeaveDayTypeFull,
                            value: TempLeaveDayType.value,
                            refresh: !LeaveDayTypeFull.refresh
                        }
                    };
                }

                this.setState(nextState, () => this.GenerateControl());
            } else {
                nextState = {
                    Div_TypeHalfShift1: {
                        ...Div_TypeHalfShift1,
                        TypeHalfShift: {
                            ...TypeHalfShift,
                            value: item,
                            refresh: !TypeHalfShift.refresh
                        },
                        divTypeHalfShiftContent: {
                            ...divTypeHalfShiftContent,
                            visible: true
                        },
                        divMiddleShiftMoreDay: {
                            ...divMiddleShiftMoreDay,
                            visible: false
                        },
                        divFullShiftMoreDay: {
                            ...divFullShiftMoreDay,
                            visible: false
                        },
                        divFirstLastShiftMoreDay: {
                            ...divFirstLastShiftMoreDay,
                            visible: false
                        }
                    }
                };

                this.setState(nextState, () => this.ComputeTypeHalfShift(value));
            }
        } else {
            nextState = {
                Div_TypeHalfShift1: {
                    ...Div_TypeHalfShift1,
                    TypeHalfShift: {
                        ...TypeHalfShift,
                        value: item,
                        refresh: !TypeHalfShift.refresh
                    },
                    divTypeHalfShiftContent: {
                        ...divTypeHalfShiftContent,
                        visible: true
                    },
                    divMiddleShiftMoreDay: {
                        ...divMiddleShiftMoreDay,
                        visible: false
                    },
                    divFullShiftMoreDay: {
                        ...divFullShiftMoreDay,
                        visible: false
                    },
                    divFirstLastShiftMoreDay: {
                        ...divFirstLastShiftMoreDay,
                        visible: false
                    }
                }
            };

            this.setState(nextState, () => this.ComputeTypeHalfShift(value));
        }
    };
    //#endregion

    //#region [change ChangeLeaveHoursDetail - khung giờ]
    ChangeLeaveHoursDetail = item => {
        const { Div_DurationType1 } = this.state,
            { DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType } = DurationTypeDetail,
            { LeaveHoursDetail } = OtherDurationType,
            { ConfigLeaveHoursDetail } = LeaveHoursDetail;

        let nextState = {
            Div_DurationType1: {
                ...Div_DurationType1,
                DurationTypeDetail: {
                    ...DurationTypeDetail,
                    OtherDurationType: {
                        ...OtherDurationType,
                        LeaveHoursDetail: {
                            ...LeaveHoursDetail,
                            ConfigLeaveHoursDetail: {
                                ...ConfigLeaveHoursDetail,
                                value: item,
                                refresh: !ConfigLeaveHoursDetail.refresh
                            }
                        }
                    }
                }
            }
        };

        this.setState(nextState, () => {
            const { Div_DurationType1, divShift, divLeaveHours } = this.state,
                { Shift } = divShift,
                { DurationTypeDetail } = Div_DurationType1,
                { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
                { LeaveDays } = DurationTypeFullShift,
                { HoursFrom, HoursTo } = OtherDurationType,
                { LeaveHours } = divLeaveHours;

            let leaveHoursDetail = item ? item.LeaveHoursDetail : '',
                shiftID = Shift.value ? Shift.value.ID : null;

            VnrLoadingSevices.show();
            HttpService.Get(
                '[URI_HR]/Att_GetData/GetLeaveHoursAndLeaveDay?LeaveHoursDetail=' +
                leaveHoursDetail +
                '&ShiftID=' +
                shiftID
            ).then(data => {
                VnrLoadingSevices.hide();
                try {
                    if (data && data.indexOf('|') >= 0) {
                        let lstData = data.split('|'),
                            hours = lstData[0].replace('"', ''),
                            day = lstData[1].replace('"', ''),
                            hoursFromTo = leaveHoursDetail ? leaveHoursDetail.split(' - ') : [],
                            nextState = {
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
                                                    value: hours,
                                                    refresh: !LeaveHours.refresh
                                                }
                                            },
                                            HoursFrom: {
                                                ...HoursFrom,
                                                value: hoursFromTo[0],
                                                refresh: !HoursFrom.refresh
                                            },
                                            HoursTo: {
                                                ...HoursTo,
                                                value: hoursFromTo[1],
                                                refresh: !HoursTo.refresh
                                            }
                                        },
                                        DurationTypeFullShift: {
                                            ...DurationTypeFullShift,
                                            LeaveDays: {
                                                ...LeaveDays,
                                                value: day,
                                                refresh: !LeaveDays.refresh
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
            });
        });
    };
    //#endregion

    //#region [change HoursFrom , HoursTo]
    onTimeChangeHoursFrom = value => {
        const { Div_DurationType1 } = this.state,
            { DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType } = DurationTypeDetail,
            { HoursFrom, HoursTo } = OtherDurationType;

        let nextState = {
            Div_DurationType1: {
                ...Div_DurationType1,
                DurationTypeDetail: {
                    ...DurationTypeDetail,
                    OtherDurationType: {
                        ...OtherDurationType,
                        HoursFrom: {
                            ...HoursFrom,
                            value: value,
                            refresh: !HoursFrom.refresh
                        }
                    }
                }
            }
        };

        if (value || HoursTo.value) {
            this.setState(nextState, () => this.HoursChange(this.callbackGetLeaveHourMidleShift));
        } else {
            this.setState(nextState);
        }
    };

    onTimeChangeHoursTo = value => {
        const { Div_DurationType1 } = this.state,
            { DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType } = DurationTypeDetail,
            { HoursTo, HoursFrom } = OtherDurationType;

        let nextState = {
            Div_DurationType1: {
                ...Div_DurationType1,
                DurationTypeDetail: {
                    ...DurationTypeDetail,
                    OtherDurationType: {
                        ...OtherDurationType,
                        HoursTo: {
                            ...HoursTo,
                            value: value,
                            refresh: !HoursTo.refresh
                        }
                    }
                }
            }
        };

        if (HoursFrom.value || value) {
            this.setState(nextState, () => this.HoursChange(this.callbackGetLeaveHourMidleShift));
        } else {
            this.setState(nextState);
        }
    };

    callbackGetLeaveHourMidleShift = (data, dataBody) => {
        const { Div_DurationType1 } = this.state,
            { DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
            { LeaveDays } = DurationTypeFullShift,
            { divLeaveHours } = OtherDurationType,
            { LeaveHours } = divLeaveHours,
            { HoursTo, HoursFrom } = OtherDurationType;

        let arrUrl = data.split('|'),
            _data = arrUrl[0];
        if (_data == 'WarningTimeInvalid') {
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
                    let nextState = {
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
                                            value: 0,
                                            refresh: !LeaveHours.refresh
                                        }
                                    }
                                },
                                DurationTypeFullShift: {
                                    ...DurationTypeFullShift,
                                    LeaveDays: {
                                        ...LeaveDays,
                                        value: 0,
                                        refresh: !LeaveDays.refresh
                                    }
                                }
                            }
                        }
                    };
                    this.setState(nextState);
                },
                onConfirm: () => {
                    dataBody = {
                        ...dataBody,
                        isConfirmSplitHours: true
                    };

                    VnrLoadingSevices.show();
                    HttpService.Post('[URI_HR]/Att_GetData/GetLeaveHourMidleShift', dataBody).then(data1 => {
                        VnrLoadingSevices.hide();
                        try {
                            if (typeof data1 == enumName.E_object) {
                                if (data1.Key != null && data1.Key != '') {
                                    ToasterSevice.showWarning(data1.Value, 4000);
                                    return;
                                }
                                let hoursFrom = new Date(parseInt(data1.HoursFrom.substr(6)));
                                let hoursTo = new Date(parseInt(data1.HoursTo.substr(6)));
                                //let _timeHoursFrom = $("#HoursFrom").data("kendoTimePicker");
                                //_timeHoursFrom.value(hoursFrom);
                                //let _timeHoursTo = $("#HoursTo").data("kendoTimePicker");
                                //_timeHoursTo.value(hoursTo);
                                //$("#LeaveHours").val(data1.LeaveHours);
                                //$("#LeaveDays").val(data1.LeaveDays);

                                let nextState = {
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
                                                        value: data1.LeaveHours,
                                                        refresh: !LeaveHours.refresh
                                                    }
                                                },
                                                HoursFrom: {
                                                    ...HoursFrom,
                                                    value: hoursFrom,
                                                    refresh: !HoursFrom.refresh
                                                },
                                                HoursTo: {
                                                    ...HoursTo,
                                                    value: hoursTo,
                                                    refresh: !HoursTo.refresh
                                                }
                                            },
                                            DurationTypeFullShift: {
                                                ...DurationTypeFullShift,
                                                LeaveDays: {
                                                    ...LeaveDays,
                                                    value: data1.LeaveDays,
                                                    refresh: !LeaveDays.refresh
                                                }
                                            }
                                        }
                                    }
                                };
                                this.setState(nextState);
                            } else {
                                ToasterSevice.showError(data1, 4000);
                            }
                        } catch (error) {
                            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                        }
                    });
                }
            });
        } else {
            ToasterSevice.showError(data, 4000);
        }
    };

    HoursChange = callbackGetLeaveHourMidleShift => {
        const {
                Div_DurationType1,
                DateStart,
                DateEnd,
                divShift,
                isChoseProfile,
                Profiles,
                Profile,
                LeaveDayTypeFull,
                LeaveDayTypeByGrade
            } = this.state,
            { Shift } = divShift,
            { LeaveDayType } = LeaveDayTypeFull,
            { TempLeaveDayType } = LeaveDayTypeByGrade,
            { DurationTypeDetail, DurationType } = Div_DurationType1,
            { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
            { LeaveDays } = DurationTypeFullShift,
            { divLeaveHours } = OtherDurationType,
            { LeaveHours } = divLeaveHours,
            { HoursTo, HoursFrom } = OtherDurationType;

        let dateStart = DateStart.value,
            dateEnd = DateEnd.value,
            nextState = {
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
                                    value: 0,
                                    disable: true,
                                    refresh: !LeaveHours.refresh
                                }
                            }
                        },
                        DurationTypeFullShift: {
                            ...DurationTypeFullShift,
                            LeaveDays: {
                                ...LeaveDays,
                                value: 0,
                                refresh: !LeaveDays.refresh
                            }
                        }
                    }
                }
            };

        if (dateStart && dateEnd) {
            let dateStartNew = dateStart,
                dateEndNew = dateEnd,
                profileIds = null,
                timeFrom = HoursFrom.value ? moment(HoursFrom.value).format('HH:mm') : null,
                timeTo = HoursTo.value ? moment(HoursTo.value).format('HH:mm') : null,
                leavedayID =
                    TempLeaveDayType.value && TempLeaveDayType.value.ID
                        ? TempLeaveDayType.value.ID
                        : LeaveDayType.value
                            ? LeaveDayType.value.ID
                            : null,
                durationType = DurationType.value ? DurationType.value.Value : null,
                shiftID = Shift.value ? Shift.value.ID : null;

            //check đăng ký hộ
            if (this.isRegisterHelp && isChoseProfile) {
                let profileId = Profiles.value;
                if (profileId && profileId.length) profileIds = profileId[0].ID;
            } else {
                profileIds = Profile.ID;
            }

            let dataBody = {
                profileId: profileIds,
                dateStart: dateStartNew,
                dateEnd: dateEndNew,
                hourFrom: timeFrom,
                hourTo: timeTo,
                leavedayTypeId: leavedayID,
                durationType: durationType,
                ShiftID: shiftID,
                isConfirmSplitHours: false
            };

            this.setState(nextState, () => {
                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Att_GetData/GetLeaveHourMidleShift', dataBody).then(data => {
                    VnrLoadingSevices.hide();
                    try {
                        if (typeof data == 'object') {
                            if (data.Key != null && data.Key != '') {
                                ToasterSevice.showWarning(data.Value, 4000);
                                return;
                            }

                            let nextState = {
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
                                                    value: data.LeaveHours,
                                                    refresh: !LeaveHours.refresh
                                                }
                                            }
                                        },
                                        DurationTypeFullShift: {
                                            ...DurationTypeFullShift,
                                            LeaveDays: {
                                                ...LeaveDays,
                                                value: data.LeaveDays,
                                                refresh: !LeaveDays.refresh
                                            }
                                        }
                                    }
                                }
                            };
                            this.setState(nextState);
                        } else {
                            callbackGetLeaveHourMidleShift(data, { ...dataBody });
                        }
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });
            });
        } else {
            this.setState(nextState);
        }
    };
    //#endregion

    //#region [change ngày đi làm lại]
    onDateChangeDateReturnToWork = () => { };
    //#endregion

    //#region [change LeaveDayType, TempLeaveDayType - Loại ngày nghỉ]
    onChangeTempLeaveDayType = item => {
        this.resetDisplayForm(() => this.onChangeTempLeaveDayTypeAfter(item));
    };

    onChangeTempLeaveDayTypeAfter = item => {
        const {
                isChoseProfile,
                Profiles,
                Profile,
                DateStart,
                DateEnd,
                LeaveDayTypeByGrade,
                Div_TypeHalfShift1,
                Div_DurationType1,
                hasIsMeal,
                btnComputeRemainDaysPortal
            } = this.state,
            { DurationType, DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
            { divLeaveHours, HoursFrom, HoursTo } = OtherDurationType,
            { LeaveHours } = divLeaveHours,
            { LeaveDays } = DurationTypeFullShift,
            { TempLeaveDayType } = LeaveDayTypeByGrade,
            { leaveDayTypeView, dayportal, hoursportal } = btnComputeRemainDaysPortal,
            { TypeHalfShift, divTypeHalfShiftContent } = Div_TypeHalfShift1;

        let pro = null,
            _leavedaytypeid = item && item.ID,
            _DateStart = DateStart.value,
            _DateEnd = DateEnd.value,
            nextState = {
                LeaveDayTypeByGrade: {
                    ...LeaveDayTypeByGrade,
                    TempLeaveDayType: {
                        ...TempLeaveDayType,
                        value: item ? { ...item } : item
                    }
                }
            };

        //check đăng ký hộ
        if (this.isRegisterHelp && isChoseProfile) {
            pro = Profiles.value;
            if (pro && pro.length) pro = pro[0];
        } else {
            pro = Profile.ID ? Profile.ID : profileInfo[enumName.E_ProfileID];
        }

        //check show MedicalDocument
        // 0182209
        // _dataTempLeaveDayTypeID.forEach(function (item) {
        //     if (item.ID == _leavedaytypeid) {
        //         if (item.MedicalDocument) {
        //             nextState = {
        //                 ...nextState,
        //                 IsCheckMedical: {
        //                     ...IsCheckMedical,
        //                     visible: true
        //                 }
        //             }
        //             //isShowEle('#IsCheckMedical', true);
        //         }
        //         else {
        //             //isShowEle('#IsCheckMedical');
        //             nextState = {
        //                 ...nextState,
        //                 IsCheckMedical: {
        //                     ...IsCheckMedical,
        //                     visible: false
        //                 }
        //             }
        //         }
        //     }
        // });

        //find item by ID
        let itemSelected = TempLeaveDayType.data.filter(item => item.ID == _leavedaytypeid);

        //check IsMeal of LeaveDayType
        if (itemSelected[0] && itemSelected[0].IsMeal) {
            nextState = {
                ...nextState,
                hasIsMeal: {
                    ...hasIsMeal,
                    visible: true
                }
            };
        } else {
            nextState = {
                ...nextState,
                hasIsMeal: {
                    ...hasIsMeal,
                    visible: false
                }
            };
        }

        if (_leavedaytypeid) {
            let dateStartNew = DateStart.value,
                dataBody = { ProfileID: pro, leaveDayTypeID: _leavedaytypeid, dateStart: dateStartNew };

            VnrLoadingSevices.show();
            HttpService.MultiRequest([
                HttpService.Post('[URI_HR]/Att_GetData/ChangeDayorHours', dataBody),
                HttpService.Post('[URI_HR]/Att_GetData/GetLeavedayTypeById', {
                    leaveDayTypeID: _leavedaytypeid
                })
            ]).then(allData => {
                const [data, dataLeaveType] = allData;

                VnrLoadingSevices.hide();
                try {
                    let nextState1 = {
                        Div_DurationType1: {
                            ...Div_DurationType1,
                            DurationType: {
                                ...DurationType,
                                disable: false,
                                refresh: !DurationType.refresh
                            }
                        }
                    };

                    let result = data.split('|');

                    if (result[0] == 'E_HOURS') {
                        nextState1 = {
                            ...nextState1,
                            btnComputeRemainDaysPortal: {
                                ...btnComputeRemainDaysPortal,
                                hoursportal: {
                                    ...hoursportal,
                                    visible: true,
                                    value: null
                                },
                                dayportal: {
                                    ...dayportal,
                                    visible: false,
                                    value: null
                                },
                                leaveDayTypeView: {
                                    ...leaveDayTypeView,
                                    value: dataLeaveType ? dataLeaveType : null,
                                    visible: dataLeaveType ? true : false
                                }
                            }
                        };
                    } else {
                        nextState1 = {
                            ...nextState1,
                            btnComputeRemainDaysPortal: {
                                ...btnComputeRemainDaysPortal,
                                hoursportal: {
                                    ...hoursportal,
                                    visible: false,
                                    value: null
                                },
                                dayportal: {
                                    ...dayportal,
                                    visible: true,
                                    value: null
                                },
                                leaveDayTypeView: {
                                    ...leaveDayTypeView,
                                    value: dataLeaveType ? dataLeaveType : null,
                                    visible: dataLeaveType ? true : false
                                }
                            }
                        };
                    }

                    if (result[1]) {
                        //format lại date, server đang trả về string dd/MM/yyyy
                        let dateEndFormat = null;
                        if (result[1] && typeof result[1] == 'string' && result[1].indexOf('/') >= 0) {
                            let _splitDate = result[1].split('/');

                            if (_splitDate.length === 3) {
                                let day = _splitDate[0],
                                    month = _splitDate[1],
                                    year = _splitDate[2];

                                dateEndFormat = moment(year + '-' + month + '-' + day).toDate();
                            }
                        }

                        nextState1 = {
                            ...nextState1,
                            DateEnd: {
                                ...DateEnd,
                                value: dateEndFormat,
                                refresh: !DateEnd.refresh
                            }
                        };
                    }

                    if (result.length == 3) {
                        nextState1 = {
                            ...nextState1,
                            btnComputeRemainDaysPortal: {
                                ...nextState1.btnComputeRemainDaysPortal,
                                visible: true
                            }
                        };
                    } else {
                        nextState1 = {
                            ...nextState1,
                            btnComputeRemainDaysPortal: {
                                ...nextState1.btnComputeRemainDaysPortal,
                                visible: false
                            }
                        };
                    }

                    this.setState(nextState1, () => {
                        if (_DateStart && _DateEnd && moment(_DateStart).isSame(_DateEnd, 'day')) {
                            let durationtype = enumName.E_FULLSHIFT;
                            let findDurationType = DurationType.data
                                ? DurationType.data.find(item => item.Value === enumName.E_FULLSHIFT)
                                : null;
                            let _Div_DurationType1 = Div_DurationType1;

                            if (nextState.Div_DurationType1) {
                                _Div_DurationType1 = nextState.Div_DurationType1;
                            }

                            nextState = {
                                ...nextState,
                                Div_DurationType1: {
                                    ..._Div_DurationType1,
                                    DurationType: {
                                        ..._Div_DurationType1.DurationType,
                                        value: findDurationType ? { ...findDurationType } : null
                                    }
                                }
                            };

                            if (!findDurationType) {
                                nextState = {
                                    ...nextState,
                                    Div_DurationType1: {
                                        ...nextState.Div_DurationType1,
                                        DurationTypeDetail: {
                                            ...DurationTypeDetail,
                                            visible: false
                                        }
                                    }
                                };
                            } else if (findDurationType && findDurationType.Value == 'E_FULLSHIFT') {
                                nextState = {
                                    ...nextState,
                                    Div_DurationType1: {
                                        ...nextState.Div_DurationType1,
                                        DurationTypeDetail: {
                                            ...DurationTypeDetail,
                                            visible: true,
                                            OtherDurationType: {
                                                ...OtherDurationType,
                                                visible: false,
                                                HoursFrom: {
                                                    ...HoursFrom,
                                                    value: null,
                                                    refresh: !HoursFrom.refresh
                                                },
                                                HoursTo: {
                                                    ...HoursTo,
                                                    value: null,
                                                    refresh: !HoursTo.refresh
                                                }
                                            },
                                            DurationTypeFullShift: {
                                                ...DurationTypeFullShift,
                                                visible: true
                                            }
                                        }
                                    }
                                };
                            }

                            if (nextState.Div_DurationType1 && nextState.Div_DurationType1.DurationType) {
                                nextState.Div_DurationType1.DurationType.refresh = !DurationType.refresh;
                            }

                            this.setState(nextState, () => {
                                this.ComputeTypeHalfShift(durationtype);
                                this.showFileAttachByLeaveDayType();
                                this.checkLeaveDayTypeIsPregnancy();
                            });
                        } else {
                            let type = TypeHalfShift.value ? TypeHalfShift.value.Value : null;

                            if (type == 'E_FULLSHIFT') {
                                type = '';
                            }

                            nextState = {
                                ...nextState,
                                Div_TypeHalfShift1: {
                                    ...Div_TypeHalfShift1,
                                    visible: true,
                                    TypeHalfShift: {
                                        ...TypeHalfShift,
                                        refresh: !TypeHalfShift.refresh
                                    },
                                    divTypeHalfShiftContent: {
                                        ...divTypeHalfShiftContent,
                                        visible: true
                                    }
                                },
                                Div_DurationType1: {
                                    ...Div_DurationType1,
                                    visible: false,
                                    DurationTypeDetail: {
                                        ...DurationTypeDetail,
                                        visible: true,
                                        OtherDurationType: {
                                            ...OtherDurationType,
                                            divLeaveHours: {
                                                ...divLeaveHours,
                                                LeaveHours: {
                                                    ...LeaveHours,
                                                    value: 0,
                                                    refresh: !LeaveHours.refresh
                                                }
                                            }
                                        },
                                        DurationTypeFullShift: {
                                            ...DurationTypeFullShift,
                                            visible: true,
                                            LeaveDays: {
                                                ...LeaveDays,
                                                value: 0,
                                                refresh: !LeaveDays.refresh
                                            }
                                        }
                                    }
                                }
                            };

                            if (nextState.Div_DurationType1.DurationType) {
                                nextState.Div_DurationType1.DurationType.refresh = !DurationType.refresh;
                            }

                            this.setState(nextState, () => {
                                this.ComputeTypeHalfShift(type);
                                this.showFileAttachByLeaveDayType();
                                this.checkLeaveDayTypeIsPregnancy();
                            });
                        }
                    });
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        } else {
            nextState = {
                ...nextState,
                Div_DurationType1: {
                    ...Div_DurationType1,
                    DurationType: {
                        ...DurationType,
                        disable: true
                        //refresh: !DurationType.refresh
                    }
                },
                btnComputeRemainDaysPortal: {
                    ...btnComputeRemainDaysPortal,
                    visible: false
                }
            };

            if (_DateStart && _DateEnd && _DateStart.toLocaleString() == _DateEnd.toLocaleString()) {
                let durationtype = enumName.E_FULLSHIFT;
                let findDurationType = DurationType.data
                    ? DurationType.data.find(item => item.Value === enumName.E_FULLSHIFT)
                    : null;
                let _Div_DurationType1 = Div_DurationType1;

                if (nextState.Div_DurationType1) {
                    _Div_DurationType1 = nextState.Div_DurationType1;
                }

                nextState = {
                    ...nextState,
                    Div_DurationType1: {
                        ..._Div_DurationType1,
                        DurationType: {
                            ..._Div_DurationType1.DurationType,
                            value: findDurationType ? { ...findDurationType } : null
                        }
                    }
                };

                if (!findDurationType) {
                    nextState = {
                        ...nextState,
                        Div_DurationType1: {
                            ...nextState.Div_DurationType1,
                            DurationTypeDetail: {
                                ...DurationTypeDetail,
                                visible: false
                            }
                        }
                    };
                } else if (findDurationType && findDurationType.Value == 'E_FULLSHIFT') {
                    nextState = {
                        ...nextState,
                        Div_DurationType1: {
                            ...nextState.Div_DurationType1,
                            DurationTypeDetail: {
                                ...DurationTypeDetail,
                                visible: true,
                                OtherDurationType: {
                                    ...OtherDurationType,
                                    visible: false,
                                    HoursFrom: {
                                        ...HoursFrom,
                                        value: null,
                                        refresh: !HoursFrom.refresh
                                    },
                                    HoursTo: {
                                        ...HoursTo,
                                        value: null,
                                        refresh: !HoursTo.refresh
                                    }
                                },
                                DurationTypeFullShift: {
                                    ...DurationTypeFullShift,
                                    visible: true
                                }
                            }
                        }
                    };
                }

                if (nextState.Div_DurationType1 && nextState.Div_DurationType1.DurationType) {
                    nextState.Div_DurationType1.DurationType.refresh = !DurationType.refresh;
                }

                this.setState(nextState, () => {
                    this.ComputeTypeHalfShift(durationtype);
                    this.showFileAttachByLeaveDayType();
                    this.checkLeaveDayTypeIsPregnancy();
                });
            } else {
                let type = TypeHalfShift.value ? TypeHalfShift.value.Value : null;

                if (type == 'E_FULLSHIFT') {
                    type = '';
                }

                nextState = {
                    ...nextState,
                    Div_TypeHalfShift1: {
                        ...Div_TypeHalfShift1,
                        visible: true,
                        TypeHalfShift: {
                            ...TypeHalfShift,
                            refresh: !TypeHalfShift.refresh
                        },
                        divTypeHalfShiftContent: {
                            ...divTypeHalfShiftContent,
                            visible: true
                        }
                    },
                    Div_DurationType1: {
                        ...Div_DurationType1,
                        visible: false,
                        DurationTypeDetail: {
                            ...DurationTypeDetail,
                            visible: true,
                            OtherDurationType: {
                                ...OtherDurationType,
                                divLeaveHours: {
                                    ...divLeaveHours,
                                    LeaveHours: {
                                        ...LeaveHours,
                                        value: 0,
                                        refresh: !LeaveHours.refresh
                                    }
                                }
                            },
                            DurationTypeFullShift: {
                                ...DurationTypeFullShift,
                                visible: true,
                                LeaveDays: {
                                    ...LeaveDays,
                                    value: 0,
                                    refresh: !LeaveDays.refresh
                                }
                            }
                        }
                    }
                };

                if (nextState.Div_DurationType1.DurationType) {
                    nextState.Div_DurationType1.DurationType.refresh = !DurationType.refresh;
                }

                this.setState(nextState, () => {
                    this.ComputeTypeHalfShift(type);
                    this.showFileAttachByLeaveDayType();
                    this.checkLeaveDayTypeIsPregnancy();
                });
            }
        }
    };

    onChangeLeaveDayType = item => {
        this.resetDisplayForm(() => this.onChangeLeaveDayTypeAfter(item));
    };

    onChangeLeaveDayTypeAfter = item => {
        const {
                isChoseProfile,
                Profiles,
                Profile,
                DateStart,
                DateEnd,
                btnComputeRemainDaysPortal,
                Div_TypeHalfShift1,
                Div_DurationType1,
                LeaveDayTypeFull,
                hasIsMeal
            } = this.state,
            { LeaveDayType } = LeaveDayTypeFull,
            { DurationType, DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
            { divLeaveHours, HoursFrom, HoursTo } = OtherDurationType,
            { LeaveHours } = divLeaveHours,
            { LeaveDays } = DurationTypeFullShift,
            { leaveDayTypeView, dayportal, hoursportal } = btnComputeRemainDaysPortal,
            { TypeHalfShift, divTypeHalfShiftContent } = Div_TypeHalfShift1;

        let _DateStart = DateStart.value,
            _DateEnd = DateEnd.value,
            pro = null,
            _leavedaytypeid = item ? item.ID : null,
            nextState = {
                LeaveDayTypeFull: {
                    ...LeaveDayTypeFull,
                    LeaveDayType: {
                        ...LeaveDayType,
                        value: { ...item }
                    }
                }
            };

        //check đăng ký hộ
        if (this.isRegisterHelp && isChoseProfile) {
            pro = Profiles.value;
            if (pro && pro.length) pro = pro[0].ID;
        } else {
            pro = Profile.ID;
        }

        //check show MedicalDocument
        // 0182209
        // _dataTempLeaveDayTypeID.forEach(function (item) {
        //     if (item.ID == _leavedaytypeid) {
        //         if (item.MedicalDocument) {
        //             nextState = {
        //                 ...nextState,
        //                 IsCheckMedical: {
        //                     ...IsCheckMedical,
        //                     visible: true
        //                 }
        //             }
        //         }
        //         else {
        //             nextState = {
        //                 ...nextState,
        //                 IsCheckMedical: {
        //                     ...IsCheckMedical,
        //                     visible: false
        //                 }
        //             }
        //         }
        //     }
        // });

        //find item by ID
        let itemSelected = LeaveDayType.data.filter(item => item.ID == _leavedaytypeid);

        //check IsMeal of LeaveDayType
        if (itemSelected[0] && itemSelected[0].IsMeal) {
            nextState = {
                ...nextState,
                hasIsMeal: {
                    ...hasIsMeal,
                    visible: true
                }
            };
        } else {
            nextState = {
                ...nextState,
                hasIsMeal: {
                    ...hasIsMeal,
                    visible: false
                }
            };
        }

        if (_leavedaytypeid) {
            let dateStartNew = DateStart.value,
                dataBody = { ProfileID: pro, leaveDayTypeID: _leavedaytypeid, dateStart: dateStartNew };

            VnrLoadingSevices.show();
            HttpService.MultiRequest([
                HttpService.Post('[URI_HR]/Att_GetData/ChangeDayorHours', dataBody),
                HttpService.Post('[URI_HR]/Att_GetData/GetLeavedayTypeById', {
                    leaveDayTypeID: _leavedaytypeid
                })
            ]).then(allData => {
                const [data, dataLeaveType] = allData;
                VnrLoadingSevices.hide();
                try {
                    let nextState1 = {
                        Div_DurationType1: {
                            ...Div_DurationType1,
                            DurationType: {
                                ...DurationType,
                                disable: false,
                                refresh: !DurationType.refresh
                            }
                        }
                    };

                    let result = data.split('|');

                    if (result[0] == 'E_HOURS') {
                        //$("#LeaveDayPor_Remain").val("");
                        //$(".hoursportal").removeClass("hide");
                        //$(".dayportal").addClass("hide");
                        nextState1 = {
                            ...nextState1,
                            btnComputeRemainDaysPortal: {
                                ...btnComputeRemainDaysPortal,
                                hoursportal: {
                                    ...hoursportal,
                                    visible: true,
                                    value: null
                                },
                                dayportal: {
                                    ...dayportal,
                                    visible: false,
                                    value: null
                                },
                                leaveDayTypeView: {
                                    ...leaveDayTypeView,
                                    value: dataLeaveType ? dataLeaveType : null,
                                    visible: dataLeaveType ? true : false
                                }
                            }
                        };
                    } else {
                        nextState1 = {
                            ...nextState1,
                            btnComputeRemainDaysPortal: {
                                ...btnComputeRemainDaysPortal,
                                hoursportal: {
                                    ...hoursportal,
                                    visible: false,
                                    value: null
                                },
                                dayportal: {
                                    ...dayportal,
                                    visible: true,
                                    value: null
                                },
                                leaveDayTypeView: {
                                    ...leaveDayTypeView,
                                    value: dataLeaveType ? dataLeaveType : null,
                                    visible: dataLeaveType ? true : false
                                }
                            }
                        };
                    }

                    if (result[1]) {
                        //format lại date, server đang trả về string dd/MM/yyyy
                        let dateEndFormat = null;
                        if (result[1] && typeof result[1] == 'string' && result[1].indexOf('/') >= 0) {
                            let _splitDate = result[1].split('/');

                            if (_splitDate.length === 3) {
                                let day = _splitDate[0],
                                    month = _splitDate[1],
                                    year = _splitDate[2];

                                dateEndFormat = moment(year + '-' + month + '-' + day).toDate();
                            }
                        }

                        nextState1 = {
                            ...nextState1,
                            DateEnd: {
                                ...DateEnd,
                                value: dateEndFormat,
                                refresh: !DateEnd.refresh
                            }
                        };
                    }

                    if (result.length == 3) {
                        //isShowEle(frm + ' .btn-compute-remain-days-portal', true);
                        nextState1 = {
                            ...nextState1,
                            btnComputeRemainDaysPortal: {
                                ...btnComputeRemainDaysPortal,
                                visible: true
                            }
                        };
                    } else {
                        nextState1 = {
                            ...nextState1,
                            btnComputeRemainDaysPortal: {
                                ...btnComputeRemainDaysPortal,
                                visible: false
                            }
                        };
                    }

                    this.setState(nextState1);
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        } else {
            nextState = {
                ...nextState,
                Div_DurationType1: {
                    ...Div_DurationType1,
                    DurationType: {
                        ...DurationType,
                        disable: true
                    }
                },
                btnComputeRemainDaysPortal: {
                    ...btnComputeRemainDaysPortal,
                    visible: false
                }
            };
        }

        if (
            _DateStart &&
            _DateEnd &&
            moment(_DateStart).format('YYYY-MM-DD') == moment(_DateEnd).format('YYYY-MM-DD')
        ) {
            let durationtype = enumName.E_FULLSHIFT,
                findDurationType = DurationType.data
                    ? DurationType.data.find(item => item.Value === enumName.E_FULLSHIFT)
                    : null,
                _Div_DurationType1 = nextState.Div_DurationType1 ? nextState.Div_DurationType1 : Div_DurationType1;

            if (!findDurationType) {
                findDurationType = { Text: translate('E_FULLSHIFT'), Value: enumName.E_FULLSHIFT };
            }

            nextState = {
                ...nextState,
                Div_DurationType1: {
                    ..._Div_DurationType1,
                    DurationType: {
                        ..._Div_DurationType1.DurationType,
                        value: { ...findDurationType }
                    }
                }
            };

            if (durationtype == '') {
                //item3.style.display = "none";
                //isShowEle('#DurationTypeDetail');
                nextState = {
                    ...nextState,
                    Div_DurationType1: {
                        ...nextState.Div_DurationType1,
                        DurationTypeDetail: {
                            ...DurationTypeDetail,
                            visible: false
                        }
                    }
                };
            } else if (durationtype == 'E_FULLSHIFT') {
                //auto vào cái này
                nextState = {
                    ...nextState,
                    Div_DurationType1: {
                        ...nextState.Div_DurationType1,
                        DurationTypeDetail: {
                            ...DurationTypeDetail,
                            visible: true,
                            OtherDurationType: {
                                ...OtherDurationType,
                                HoursFrom: {
                                    ...HoursFrom,
                                    value: null,
                                    refresh: !HoursFrom.refresh
                                },
                                HoursTo: {
                                    ...HoursTo,
                                    value: null,
                                    refresh: !HoursTo.refresh
                                }
                            },
                            DurationTypeFullShift: {
                                ...DurationTypeFullShift,
                                visible: true
                            }
                        }
                    }
                };
            }

            if (nextState.Div_DurationType1 && nextState.Div_DurationType1.DurationType) {
                nextState.Div_DurationType1.DurationType.refresh = !DurationType.refresh;
            }

            this.setState(nextState, () => {
                this.showFileAttachByLeaveDayType();
                this.ComputeTypeHalfShift(durationtype);
            });
        } else {
            let type = TypeHalfShift.value ? TypeHalfShift.value.Value : null;

            if (type == 'E_FULLSHIFT') {
                type = '';
            }

            nextState = {
                ...nextState,
                Div_TypeHalfShift1: {
                    ...Div_TypeHalfShift1,
                    visible: true,
                    TypeHalfShift: {
                        ...TypeHalfShift,
                        value: { Text: translate('E_FULLSHIFT'), Value: enumName.E_FULLSHIFT },
                        refresh: !TypeHalfShift.refresh
                    },
                    divTypeHalfShiftContent: {
                        ...divTypeHalfShiftContent,
                        visible: true
                    }
                },
                Div_DurationType1: {
                    ...nextState.Div_DurationType1,
                    visible: false,
                    DurationTypeDetail: {
                        ...DurationTypeDetail,
                        visible: true,
                        OtherDurationType: {
                            ...OtherDurationType,
                            divLeaveHours: {
                                ...divLeaveHours,
                                LeaveHours: {
                                    ...LeaveHours,
                                    value: 0,
                                    refresh: !LeaveHours.refresh
                                }
                            }
                        },
                        DurationTypeFullShift: {
                            ...DurationTypeFullShift,
                            visible: true,
                            LeaveDays: {
                                ...LeaveDays,
                                value: 0,
                                refresh: !LeaveDays.refresh
                            }
                        }
                    }
                }
            };

            if (nextState.Div_DurationType1 && nextState.Div_DurationType1.DurationType) {
                nextState.Div_DurationType1.DurationType.refresh = !DurationType.refresh;
            }

            this.setState(nextState, () => {
                this.ComputeTypeHalfShift(type);
                this.showFileAttachByLeaveDayType();
            });
        }
    };

    showFileAttachByLeaveDayType = () => {
        const { LeaveDayTypeFull, Profile, FileAttach, LeaveDayTypeByGrade, IsRequiredDocuments } = this.state,
            { LeaveDayType } = LeaveDayTypeFull,
            { TempLeaveDayType } = LeaveDayTypeByGrade;

        let leaveDayTypeID = null,
            profileID = Profile.ID;

        if (LeaveDayType.value) {
            leaveDayTypeID = LeaveDayType.value.ID;
        } else if (TempLeaveDayType.value) {
            leaveDayTypeID = TempLeaveDayType.value.ID;
        } else {
            return;
        }

        HttpService.MultiRequest([
            HttpService.Post('[URI_HR]/Att_GetData/ShowFileAttachByLeaveDayType', {
                LeaveDayTypeID: leaveDayTypeID,
                ProfileIDs: profileID
            }),
            HttpService.Post('[URI_HR]/Att_GetData/IsRequiredDocuments', {
                leaveDayID: leaveDayTypeID
            })
        ]).then(resAll => {
            const res1 = resAll[0],
                res2 = resAll[1];

            let nextState = {};

            if (res1 == 'Success') {
                nextState = {
                    ...nextState,
                    FileAttach: {
                        ...FileAttach,
                        visible: true
                    }
                };
            } else {
                nextState = {
                    ...nextState,
                    FileAttach: {
                        ...FileAttach,
                        visible: false
                    }
                };
            }

            if (res2 && res2.Item3) {
                nextState = {
                    ...nextState,
                    IsRequiredDocuments: {
                        ...IsRequiredDocuments,
                        value: res2.Item3,
                        visible: true
                    }
                };
            } else {
                nextState = {
                    ...nextState,
                    IsRequiredDocuments: {
                        ...IsRequiredDocuments,
                        value: '',
                        visible: false
                    }
                };
            }

            this.setState(nextState);
        });
    };
    //#endregion

    //#region [lưu]
    save = (navigation, isCreate, isSend) => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        this.saveNotRegisterHelp(navigation, isCreate, isSend);
    };

    saveAndCreate = navigation => {
        this.save(navigation, true, null);
    };

    saveAndSend = navigation => {
        this.save(navigation, null, true);
    };

    saveNotRegisterHelp = (navigation, isCreate, isSend) => {
        const {
                ID,
                Profile,
                DateStart,
                DateEnd,
                DateReturnToWork,
                LeaveDayTypeFull,
                LeaveDayTypeByGrade,
                Div_DurationType1,
                Div_TypeHalfShift1,
                btnComputeRemainDaysPortal,
                divShift,
                UserApprove,
                UserApprove2,
                UserApprove3,
                UserApprove4,
                divComment,
                PlaceSendToID,
                divBusinessReason,
                FileAttachment,
                PregnancyCycleID,
                FileAttach,
                modalErrorDetail
            } = this.state,
            { CommentLD } = divComment,
            { BusinessReason } = divBusinessReason,
            { LeaveDayType } = LeaveDayTypeFull,
            { TempLeaveDayType } = LeaveDayTypeByGrade,
            { DurationType, DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
            { HoursFrom, HoursTo, divLeaveHours } = OtherDurationType,
            { LeaveHours } = divLeaveHours,
            { LeaveDays } = DurationTypeFullShift,
            {
                TypeHalfShift,
                divTypeHalfShiftContent
            } = Div_TypeHalfShift1,
            { divTypeHalfShiftLeaveHours, divTypeHalfShiftLeaveDay } = divTypeHalfShiftContent,
            { TypeHalfShiftLeaveDays } = divTypeHalfShiftLeaveDay,
            { TypeHalfShiftLeaveHours } = divTypeHalfShiftLeaveHours,
            { Shift } = divShift,
            { dayportal, hoursportal } = btnComputeRemainDaysPortal,
            { apiConfig, currentUser } = dataVnrStorage,
            { info } = currentUser,
            { userid } = info;

        let _leaveHourValue = null;

        // 0161532: [Hotfix_FGL_v8.10.44.01.11.165 ] Lỗi đăng ký ngày nghỉ ngoài ca vẫn cho Lưu trên App
        if (DurationType && DurationType.value && DurationType.value.Value == 'E_MIDDLEOFSHIFT') {
            _leaveHourValue = LeaveHours.value;
        } else {
            _leaveHourValue =
                !LeaveHours.value || LeaveHours.value == 0 || LeaveHours.value == '0'
                    ? TypeHalfShiftLeaveHours.value
                    : LeaveHours.value;
        }

        let params = {
            ...this.paramsExtend,
            IsPortal: true,
            Status: 'E_SUBMIT',
            Comment: CommentLD.value,
            PlaceSendToID: PlaceSendToID.value ? PlaceSendToID.value.ID : null,
            BusinessReason: BusinessReason.value,
            DateReturnToWork: DateReturnToWork.value
                ? moment(DateReturnToWork.value).format('YYYY-MM-DD HH:mm:ss')
                : null,
            DateStart: DateStart.value ? Vnr_Function.parseDateTime(DateStart.value) : null,
            DateEnd: DateEnd.value ? Vnr_Function.parseDateTime(DateEnd.value) : null,
            LeaveDayTypeID: LeaveDayType.value ? LeaveDayType.value.ID : null,
            TempLeaveDayTypeID: TempLeaveDayType.value ? TempLeaveDayType.value.ID : null,
            DurationType: DurationType.value ? DurationType.value.Value : null,
            HoursFrom:
                typeof HoursFrom.value === 'string'
                    ? HoursFrom.value
                    : HoursFrom.value
                        ? moment(HoursFrom.value).format('HH:mm')
                        : null,
            HoursTo:
                typeof HoursTo.value === 'string'
                    ? HoursTo.value
                    : HoursTo.value
                        ? moment(HoursTo.value).format('HH:mm')
                        : null,
            LeaveHours: _leaveHourValue,
            LeaveDays: LeaveDays.value,
            TypeHalfShift: TypeHalfShift.value ? TypeHalfShift.value.Value : null,
            TypeHalfShiftLeaveDays: TypeHalfShiftLeaveDays.value,
            TypeHalfShiftLeaveHours: TypeHalfShiftLeaveHours.value,
            ShiftID: Shift.value ? Shift.value.ID : null,
            ProfileID: Profile.ID,
            UserApproveID: UserApprove.value ? UserApprove.value.ID : null,
            UserApproveID2: UserApprove2.value ? UserApprove2.value.ID : null,
            UserApproveID3: UserApprove3.value ? UserApprove3.value.ID : null,
            UserApproveID4: UserApprove4.value ? UserApprove4.value.ID : null,
            Remain: dayportal.value ? dayportal.value : hoursportal.value,
            HaveMeal: null,
            IsMeal: null,
            TotalDuration: LeaveDays.value,
            IsAddNewAndSendMail: isSend,
            SendEmailStatus: isSend ? 'E_SUBMIT' : null,
            PregnancyCycleID: PregnancyCycleID.value ? PregnancyCycleID.value.ID : null,
            FileAttachment:
                FileAttachment.value && FileAttachment.value.length > 0
                    ? FileAttachment.value.map(item => item.fileName).join(',')
                    : null,
            FileAttach:
                FileAttach.value && FileAttach.value.length > 0
                    ? FileAttach.value.map(item => item.fileName).join(',')
                    : null,
            Host: apiConfig ? apiConfig.uriPor : null,
            UserRegister: userid,
            UserSubmit: Profile ? Profile.ID : null,

            ProfileRemoveIDs: this.ProfileRemoveIDs,
            IsRemoveAndContinue: this.IsRemoveAndContinue,
            CacheID: this.CacheID,
            IsContinueSave: this.IsContinueSave
        };

        if (DateStart.value && DateEnd.value) {
            if (moment(DateStart.value).format('YYYYMMDD') == moment(DateEnd.value).format('YYYYMMDD')) {
                params = {
                    ...params,
                    DurationType: DurationType.value ? DurationType.value.Value : null,
                    TypeHalfShift: null
                };
            } else {
                params = {
                    ...params,
                    DurationType: null,
                    TypeHalfShift: TypeHalfShift.value ? TypeHalfShift.value.Value : null
                };
            }
        }

        if (params.TypeHalfShift == 'E_MIDDLEOFSHIFT') {
            let dataShiftMiddle = this.getDataShiftDetail();
            if (dataShiftMiddle && dataShiftMiddle.length > 0)
                params = {
                    ...params,
                    IsMidShiftMoreDay: true,
                    TypeHalfShift: null,
                    DurationType: 'E_MIDDLEOFSHIFT',
                    DataRegisterMiddleShiftModels: dataShiftMiddle
                };
        } else if (params.TypeHalfShift == 'E_FIRSTHALFSHIFT' || params.TypeHalfShift == 'E_LASTHALFSHIFT') {
            let dataShiftFirstLast = this.getDataFirstLastShiftDetail();
            if (dataShiftFirstLast && dataShiftFirstLast.length > 0)
                params = {
                    ...params,
                    TypeHalfShift: null,
                    DurationType: params.TypeHalfShift,
                    DataRegisterHalfShiftModels: dataShiftFirstLast
                };
        } else if (params.TypeHalfShift == 'E_FULLSHIFT') {
            let dataShiftFull = this.getDataForSaveFullShift();
            if (dataShiftFull && dataShiftFull.length > 0)
                params = {
                    ...params,
                    TypeHalfShift: null,
                    DurationType: params.TypeHalfShift,
                    DataRegisterFullShiftModels: dataShiftFull
                };
        }

        // if (dataRegisterMiddleShiftModels && dataRegisterMiddleShiftModels.length) {
        //     params = {
        //         ...params,
        //         IsMidShiftMoreDay: true,
        //         TypeHalfShift: null,
        //         DurationType: 'E_MIDDLEOFSHIFT'
        //     }
        // }

        if (ID) {
            params = {
                ...params,
                ID
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Att_LeavedayKaizenV2', params).then(data => {
            VnrLoadingSevices.hide();

            //xử lý lại event Save
            this.isProcessing = false;

            try {
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
                                    this.save(navigation, isCreate, isSend);
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
                                this.save(navigation, isCreate, isSend);
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
                } else if (
                    data.ActionStatus == 'Success' ||
                    data.ActionStatus == 'E_SUBMIT' ||
                    (data.ActionStatus && data.ActionStatus.indexOf('LeaveDaySplit|') > -1)
                ) {
                    if (data.ActionStatus.indexOf('LeaveDaySplit|') > -1) {
                        ToasterSevice.showSuccess(data.ActionStatus.split('|')[1], 4000);
                    } else {
                        ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                    }

                    if (isCreate) {
                        this.refreshView();
                    } else {
                        navigation.goBack();
                    }
                    // navigation.goBack();

                    const { reload } = this.props.navigation.state.params;

                    if (reload && typeof reload == 'function') {
                        reload();
                    }
                }

                //Vượt quá số người trong khung giờ
                else if (data.IsConfirmWorkingByFrame) {
                    //check có dữ liệu bị BLOCK status
                    let listInvalidFame = data.EmployeeWorkingResults ? data.EmployeeWorkingResults : [],
                        textLeftButton = '',
                        isShowLeftButton = false;

                    if (!listInvalidFame.find(item => item.Status === 'E_BLOCK')) {
                        textLeftButton = translate('HRM_Confirm_Limit_TimeSlot');
                        isShowLeftButton = true;
                    }

                    listInvalidFame.forEach(item => {
                        item.DateString = moment(item.Date).format('DD/MM/YYYY');
                    });

                    //xử lý group theo ngày cho data
                    const groupBy = (array, key) => {
                        // Return the end result
                        return array.reduce((result, currentValue) => {
                            // If an array already present for key, push it to the array. Else create an array and push the object
                            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);

                            // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
                            return result;
                        }, {}); // empty object is the initial value for result object
                    };

                    const objInvalidFameGroup = groupBy(listInvalidFame, 'DateString');

                    let dataSource = [];
                    let key = '';
                    for (key in objInvalidFameGroup) {
                        let title =
                            translate('HRM_Attendance_Day') +
                            ': ' +
                            key +
                            ' (' +
                            translate('NumberCount') +
                            ': ' +
                            objInvalidFameGroup[key].length +
                            ')';

                        dataSource = [
                            ...dataSource,
                            { Type: 'E_GROUP', TitleGroup: title },
                            ...objInvalidFameGroup[key]
                        ];
                    }

                    ModalCheckEmpsSevices.show({
                        //titleModal: 'Hrm_Notification',
                        textLeftButton: textLeftButton,
                        isShowLeftButton,
                        textRightButton: 'HRM_Common_Close',
                        onFinish: () => {
                            this.paramsExtend = {
                                ...this.paramsExtend,
                                IsConfirmWorkingByFrame: true
                            };

                            this.saveNotRegisterHelp(navigation, isCreate, isSend);
                        },
                        onClose: () => { },
                        dataSource
                    });
                } else if (data.ActionStatus == 'CheckLeavedayProbationning') {
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        iconType: EnumIcon.E_INFO,
                        message: translate('CheckLeavedayProbationning'),
                        onCancel: () => { },
                        onConfirm: () => {
                            this.paramsExtend = {
                                ...this.paramsExtend,
                                IsExcludeProbation: true
                            };
                            this.saveNotRegisterHelp(navigation, isCreate, isSend);
                        }
                    });
                } else if (data.ActionStatus == 'WarningMaxDayByMonth') {
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        iconType: EnumIcon.E_WARNING,
                        message: translate('WarningMaxDayByMonth'),
                        onCancel: () => { },
                        onConfirm: () => {
                            this.paramsExtend = {
                                ...this.paramsExtend,
                                IsContinueMaxDayByMonthOrYear: true
                            };
                            this.saveNotRegisterHelp(navigation, isCreate, isSend);
                        }
                    });
                } else if (data.ActionStatus == 'WarningMaxDayByYear') {
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        iconType: EnumIcon.E_WARNING,
                        message: translate('WarningMaxDayByYear'),
                        onCancel: () => { },
                        onConfirm: () => {
                            this.paramsExtend = {
                                ...this.paramsExtend,
                                IsContinueMaxDayByMonthOrYear: true
                            };
                            this.saveNotRegisterHelp(navigation, isCreate, isSend);
                        }
                    });
                } else if (data.ActionStatus == 'ErrorTotalLeave') {
                    ToasterSevice.showWarning('NumberHolidayExceedingPolicy');
                } else if (data.IsDisSolvedAnnualLeave) {
                    // Loading(false);
                    // swal({
                    //     title: translate('Hrm_Notification'),
                    //     text: translate('HRM_Message_EmployeeHaveNotAnnualLeave_YouwantDissolved'),
                    //     type: 'warning',
                    //     confirmButtonColor: '#7266ba',
                    //     confirmButtonText: 'OK',
                    //     allowOutsideClick: false,
                    //     showCancelButton: true,
                    //     cancelButtonColor: '#d33'
                    // }).then(function (isConfirm) {
                    //     if (isConfirm) {
                    //         listDisSolvedAnnualLeave = data.ListDisSolvedAnnualLeave;
                    //         for (var i = 0; i < listDisSolvedAnnualLeave.length; i++) {
                    //             let dateStart = kendo.parseDate(listDisSolvedAnnualLeave[i].DateStart);
                    //             let dateEnd = kendo.parseDate(listDisSolvedAnnualLeave[i].DateEnd);
                    //             let hoursFrom = kendo.parseDate(listDisSolvedAnnualLeave[i].HoursFrom);
                    //             let hoursTo = kendo.parseDate(listDisSolvedAnnualLeave[i].HoursTo);
                    //             listDisSolvedAnnualLeave[i].DateStart = dateStart;
                    //             listDisSolvedAnnualLeave[i].DateEnd = dateEnd;
                    //             listDisSolvedAnnualLeave[i].HoursFrom = hoursFrom;
                    //             listDisSolvedAnnualLeave[i].HoursTo = hoursTo;
                    //             listDisSolvedAnnualLeave[i].ID = kendo.guid();

                    //             $('#loadModal2').load('/New_Att_Leaveday/New_Disolved_Popup', function (response1, status, xhr) {
                    //                 if (status == 'success') {

                    //                     binding_IsDisSolvedPopup(listDisSolvedAnnualLeave);
                    //                 }
                    //                 else {
                    //                     Loading(false);
                    //                 }
                    //             });

                    //         }
                    //     }
                    // },
                    //     function (dismiss) { Loading(false); });
                    alert('chưa hỗ trợ');
                } else if (data.ActionStatus.indexOf('blockRegister') > -1) {
                    ToasterSevice.showWarning('HRM_Attendance_Message_Block_Overtime_AmountRegistered');
                } else if (data.ActionStatus.indexOf('warningRegister') > -1) {
                    let mess = data.ActionStatus.split('|')[1];
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        iconType: EnumIcon.E_WARNING,
                        message: mess,
                        onCancel: () => { },
                        onConfirm: () => {
                            this.paramsExtend = {
                                ...this.paramsExtend,
                                IsContinueRegister: true
                            };
                            this.saveNotRegisterHelp(navigation, isCreate, isSend);
                        }
                    });
                } else if (data.ActionStatus.indexOf('blockWomanRegister') > -1) {
                    ToasterSevice.showWarning('HRM_Attendance_Message_LeaveDayTypeJustRegisterForMale');
                } else if (data.ActionStatus.indexOf('blockManRegister') > -1) {
                    ToasterSevice.showWarning('HRM_Attendance_Message_LeaveDayTypeJustRegisterForFeMale');
                } else if (data.ActionStatus.indexOf('MissDocBlock') > -1) {
                    let mess = data.ActionStatus.replace('MissDocBlock|', '');
                    ToasterSevice.showWarning(mess);
                } else if (data.ActionStatus.indexOf('BlockHaveManyShiftInOneDay') > -1) {
                    let mess = data.ActionStatus.replace('BlockHaveManyShiftInOneDay|', '');
                    ToasterSevice.showWarning(mess);
                } else if (data.IsWarningMissDoc == false) {
                    let mess = data.ActionStatus.replace('WarningDoc|', '');
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        iconType: EnumIcon.E_WARNING,
                        message: mess,
                        onCancel: () => { },
                        onConfirm: () => {
                            this.paramsExtend = {
                                ...this.paramsExtend,
                                IsWarningMissDoc: true
                            };
                            this.saveNotRegisterHelp(navigation, isCreate, isSend);
                        }
                    });
                } else {
                    ToasterSevice.showWarning(data.ActionStatus);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };
    //#endregion

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
            { styleViewTitleGroup } = styleViewTitleForGroup;

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
                                styles.wrapTitleGroup
                            ]}
                        >
                            <VnrText
                                style={[styleSheets.text, styles.txtTitleGroup]}
                                i18nKey={dataItem['TitleGroup']}
                            />
                        </View>
                    );
                } else {
                    viewContent = (
                        <View style={styles.viewInfo}>
                            <View style={styles.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styles.fontText]}
                                    i18nKey={'HRM_HR_Profile_CodeEmp'}
                                />
                                <Text style={[styleSheets.textItalic, styles.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text numberOfLines={1} style={[styleSheets.textItalic, styles.fontText]}>
                                        {dataItem['CodeEmp']}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styles.fontText]}
                                    i18nKey={'HRM_HR_Profile_ProfileName'}
                                />
                                <Text style={[styleSheets.textItalic, styles.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text numberOfLines={1} style={[styleSheets.textItalic, styles.fontText]}>
                                        {dataItem['ProfileName']}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styles.fontText]}
                                    i18nKey={'HRM_Attendance_ErrorMessageRespone_ErrorDescription'}
                                />
                                <Text style={[styleSheets.textItalic, styles.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text style={[styleSheets.textItalic, styles.fontText]}>
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

    //#region [change duyệt đầu, duyệt cuối]

    //change duyệt đầu
    onChangeUserApprove = item => {
        const { UserApprove, UserApprove2, UserApprove3, UserApprove4 } = this.state;

        let nextState = {
            UserApprove: {
                ...UserApprove,
                value: { ...item }
                //refresh: !UserApprove.refresh
            }
        };

        //nếu 1 cấp duyệt mới chạy
        if (this.levelApproveLeave == 1) {
            //ẩn 3,4
            //isShowEle('#divMidApprove');
            //isShowEle('#divMidNextApprove');

            nextState = {
                ...nextState,
                UserApprove3: {
                    ...UserApprove3,
                    visible: false
                },
                UserApprove4: {
                    ...UserApprove4,
                    visible: false
                }
            };

            //set duyệt 2,3,4 = 1
            // let user1 = $("#UserApproveID").data("kendoComboBox"),
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
                    UserApprove2: {
                        ...UserApprove2,
                        value: null,
                        refresh: !UserApprove2.refresh
                    },
                    UserApprove3: {
                        ...nextState.UserApprove3,
                        value: null,
                        refresh: !UserApprove3.refresh
                    },
                    UserApprove4: {
                        ...nextState.UserApprove4,
                        value: null,
                        refresh: !UserApprove4.refresh
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
                    UserApprove2: {
                        ...UserApprove2,
                        value: { ...item },
                        refresh: !UserApprove2.refresh
                    },
                    UserApprove3: {
                        ...nextState.UserApprove3,
                        value: { ...item },
                        refresh: !UserApprove3.refresh
                    },
                    UserApprove4: {
                        ...nextState.UserApprove4,
                        value: { ...item },
                        refresh: !UserApprove4.refresh
                    }
                };
            }
        }

        this.setState(nextState);
    };

    //change duyệt cuối
    onChangeUserApprove2 = item => {
        const { UserApprove, UserApprove2, UserApprove3, UserApprove4 } = this.state;

        let nextState = {
            UserApprove2: {
                ...UserApprove2,
                value: { ...item }
                //refresh: !UserApprove2.refresh
            }
        };

        //nếu 1 cấp duyệt mới chạy
        if (this.levelApproveLeave == 1) {
            nextState = {
                ...nextState,
                UserApprove3: {
                    ...UserApprove3,
                    visible: false
                },
                UserApprove4: {
                    ...UserApprove4,
                    visible: false
                }
            };

            if (!item) {
                nextState = {
                    ...nextState,
                    UserApprove: {
                        ...UserApprove,
                        value: null,
                        refresh: !UserApprove.refresh
                    },
                    UserApprove3: {
                        ...nextState.UserApprove3,
                        value: null,
                        refresh: !UserApprove3.refresh
                    },
                    UserApprove4: {
                        ...nextState.UserApprove4,
                        value: null,
                        refresh: !UserApprove4.refresh
                    }
                };
            } else {
                nextState = {
                    ...nextState,
                    UserApprove: {
                        ...UserApprove,
                        value: { ...item },
                        refresh: !UserApprove.refresh
                    },
                    UserApprove3: {
                        ...nextState.UserApprove3,
                        value: { ...item },
                        refresh: !UserApprove3.refresh
                    },
                    UserApprove4: {
                        ...nextState.UserApprove4,
                        value: { ...item },
                        refresh: !UserApprove4.refresh
                    }
                };
            }
        } else if (this.levelApproveLeave == 2) {
            if (!item) {
                nextState = {
                    ...nextState,
                    UserApprove3: {
                        ...UserApprove3,
                        value: null,
                        refresh: !UserApprove3.refresh
                    },
                    UserApprove4: {
                        ...UserApprove4,
                        value: null,
                        refresh: !UserApprove4.refresh
                    }
                };
            } else {
                nextState = {
                    ...nextState,
                    UserApprove3: {
                        ...UserApprove3,
                        value: { ...item },
                        refresh: !UserApprove3.refresh
                    },
                    UserApprove4: {
                        ...UserApprove4,
                        value: { ...item },
                        refresh: !UserApprove4.refresh
                    }
                };
            }
        } else if (this.levelApproveLeave == 3) {
            if (!item) {
                nextState = {
                    ...nextState,
                    UserApprove4: {
                        ...UserApprove4,
                        value: null,
                        refresh: !UserApprove4.refresh
                    }
                };
            } else {
                nextState = {
                    ...nextState,
                    UserApprove4: {
                        ...UserApprove4,
                        value: { ...item },
                        refresh: !UserApprove4.refresh
                    }
                };
            }
        }

        this.setState(nextState);
    };
    //#endregion

    //#region [xem số ngày nghỉ, giờ nghỉ còn lại]

    //xem số ngày nghỉ còn lại
    onPressComputeRemainDaysPortal = () => {
        this.ComputeRemainDays();
    };

    //xem số giờ nghỉ còn lại
    onPressComputeRemainHoursPortal = () => {
        this.ComputeRemainDays();
    };

    //#endregion

    //#region xem chi tiết phép năm
    // 0155336: [Main_Hotfix PMC_v8.10.32.01.12 ] Thêm button xem chi tiết phép năm trên App
    onPressViewDetailRemain = () => {
        const { DateStart, Profile, dataAnnualDetail } = this.state;

        if (TempLeaveDayType.value && DateStart.value) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/GetViewAnnualDetail', {
                ProfileID: Profile.ID,
                LeaveDayTypeID: TempLeaveDayType.value.ID,
                DateStart: Vnr_Function.parseDateTime(DateStart.value),
                IsPortal: true
            }).then(res => {
                VnrLoadingSevices.hide();
                if (res && res.data && res.data.length > 0)
                    this.setState({
                        dataAnnualDetail: {
                            ...dataAnnualDetail,
                            data: res.data,
                            modalVisibleAnnualDetail: true
                        }
                    });
                else
                    this.setState({
                        dataAnnualDetail: {
                            ...dataAnnualDetail,
                            data: enumName.E_EMPTYDATA,
                            modalVisibleAnnualDetail: true
                        }
                    });
            });
        }
    };

    closeModalAnnualDetail = () => {
        const { dataAnnualDetail } = this.state;
        this.setState({
            dataAnnualDetail: {
                ...dataAnnualDetail,
                modalVisibleAnnualDetail: false
            }
        });
    };

    viewListItemAnnualDetailTime = () => {
        const { dataAnnualDetail, btnComputeRemainDaysPortal } = this.state,
            { leaveDayTypeView } = btnComputeRemainDaysPortal;

        if (dataAnnualDetail.data === EnumName.E_EMPTYDATA) {
            return <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataAnnualDetail.data && dataAnnualDetail.data.length > 0) {
            let typePaidLeaveDay = null;
            leaveDayTypeView.value = 'IsAnnualLeave';
            if (leaveDayTypeView.value) {
                if (leaveDayTypeView.value == 'IsAnnualLeave') {
                    //Phép năm
                    typePaidLeaveDay = EnumName.E_ANNUAL_LEAVE;
                } else if (leaveDayTypeView.value == 'IsTimeOffInLieu') {
                    //Nghỉ bù
                    typePaidLeaveDay = EnumName.E_COMPENSATORY_LEAVE;
                } else if (leaveDayTypeView.value == 'IsSick') {
                    //Phép ốm
                    typePaidLeaveDay = EnumName.E_SICK_LEAVE;
                } else if (leaveDayTypeView.value == 'IsAdditonalLeave') {
                    //Phép thêm
                    typePaidLeaveDay = EnumName.E_ADDITIONAL_LEAVE;
                } else if (leaveDayTypeView.value == 'IsPregnantLeave ') {
                    //Phép thai sản
                    typePaidLeaveDay = EnumName.E_ANNUAL_LEAVE;
                }
            }

            let { icon, secondaryColor } = typePaidLeaveDay ? typePaidLeave[typePaidLeaveDay] : {};

            let firstItem = dataAnnualDetail.data[0];

            return (
                <View style={CustomStyleSheet.flex(1)}>
                    <View style={styles.headerCloseModal}>
                        <IconColse color={Colors.white} size={Size.iconSize} />
                        <VnrText
                            style={[styleSheets.lable, styles.headerCloseModalText]}
                            value={`${translate('HRM_Attendance_AnnualLeave_MonthStart')}: ${firstItem.MonthStart}`}
                        />
                        <TouchableOpacity onPress={() => this.closeModalAnnualDetail()}>
                            <IconCancel color={Colors.black} size={Size.iconSize} />
                        </TouchableOpacity>
                    </View>
                    <View style={styles.styContentHeader}>
                        <View style={styles.styIcon(secondaryColor)}>
                            <Image source={icon} style={styles.styItemIcon} />
                        </View>

                        <View style={styles.styViewLeave}>
                            <Text style={[styleSheets.text, styles.styInfoTitle]}>
                                {`${translate('HRM_Attendance_AnnualLeave_InitAnlValue')}: ${firstItem.InitAnlValue ? firstItem.InitAnlValue : ''
                                }`}
                            </Text>

                            <Text style={[styleSheets.text, styles.styInfoTitle]}>
                                {`${translate('HRM_Attendance_AnnualLeave_AdditionalAnnualLeave')}: ${firstItem.InitSaveSickValue ? firstItem.InitSaveSickValue : ''
                                }`}
                            </Text>
                        </View>
                    </View>

                    <ScrollView style={styles.wrapRenderError}>
                        {dataAnnualDetail.data.map((item, index) => {
                            return (
                                <View key={index} style={styles.styContent}>
                                    <View style={styles.styItem}>
                                        <Text style={[styleSheets.text, styles.styInfoTitle]}>
                                            {`${translate('HRM_Attendance_AnnualDetailView_MonthInYear')} ${item.MonthInYear
                                            }`}
                                        </Text>

                                        <View style={styles.styViewInfoPri}>
                                            <Text style={[styleSheets.text, styles.styLeaveDayHours]}>
                                                {`${translate('HRM_Attendance_AnnualDetailApp_Taken')}: ${item.LeaveInMonthTotal
                                                }`}
                                            </Text>
                                            <Text style={[styleSheets.text, styles.styLeaveDayHours]}>
                                                {`${translate('HRM_Attendance_AnnualDetailApp_Accumulation')}: ${item.AvailableTotal
                                                }`}
                                            </Text>

                                            <Text
                                                style={[styleSheets.text, styles.styLeaveDayHours, CustomStyleSheet.marginRight(0)]}
                                            >
                                                {`${translate('HRM_Attendance_AnnualDetailApp_RemainCost')}: ${item.Remain
                                                }`}
                                            </Text>
                                        </View>
                                    </View>
                                </View>
                            );
                        })}
                    </ScrollView>
                </View>
            );
        }
    };
    //#endregion

    //#region [xử lý render từng ngày khi chọn TypeHalfShift = "Gữa ca" ]
    GenerateControl = () => {
        const { Profile, DateStart, DateEnd, Div_TypeHalfShift1, LeaveDayTypeFull, LeaveDayTypeByGrade } = this.state,
            { divFirstLastShiftMoreDay, divFullShiftMoreDay, TypeHalfShift } = Div_TypeHalfShift1,
            { LeaveDayType } = LeaveDayTypeFull,
            { TempLeaveDayType } = LeaveDayTypeByGrade,
            { ID } = Profile;

        let dateStart = DateStart.value ? Vnr_Function.parseDateTime(DateStart.value) : null,
            dateEnd = DateEnd.value ? Vnr_Function.parseDateTime(DateEnd.value) : null,
            leavedayTypeID = LeaveDayType.value
                ? LeaveDayType.value.ID
                : TempLeaveDayType.value
                    ? TempLeaveDayType.value.ID
                    : null;

        if (!leavedayTypeID) {
            return;
        }

        if (ID && dateStart && dateEnd && leavedayTypeID && TypeHalfShift.value) {
            HttpService.Post('[URI_HR]/Att_GetData/GetRosterForMiddleShift', {
                profileIDs: ID,
                dateStart: dateStart,
                dateEnd: dateEnd,
                leavedayTypeID: leavedayTypeID,
                ShiftType: TypeHalfShift.value ? TypeHalfShift.value.Value : null
            }).then(data => {
                if (data) {
                    if (data == 'Hrm_Error') {
                        ToasterSevice.showError('HRM_ATT_Message_Employees_RequestedNotHaveTheSameShift');
                        return;
                    }

                    this.dataShiftMoreDay = data;
                    let splitRegisterHours = [],
                        dataRegisterHours = [],
                        valRes = null;

                    let dataControl = data.map((itemControl, index) => {
                        if (divFullShiftMoreDay.visible && this.IsconfigMultipleLeaveDayTypeFull) {
                            return {
                                ...itemControl,
                                ['Date_' + index]: {
                                    value: itemControl.Date ? moment(itemControl.Date) : null,
                                    refresh: false,
                                    disable: false,
                                    visible: true
                                },
                                ['ListRegisterHours_' + index]: {
                                    disable: false,
                                    refresh: false,
                                    value: itemControl['WorkHours'],
                                    data: []
                                }
                            };
                        } else {
                            (splitRegisterHours = itemControl.ListRegisterHours
                                ? itemControl.ListRegisterHours.split(',')
                                : []),
                            (dataRegisterHours = splitRegisterHours.map(itemRes => {
                                return { Text: itemRes, Value: itemRes };
                            }));

                            valRes = dataRegisterHours.length == 1 ? dataRegisterHours[0] : null;
                            if (divFirstLastShiftMoreDay.visible) {
                                // Loại nữa ca trước, nữa ca sau
                                return {
                                    ...itemControl,
                                    ['Date_' + index]: {
                                        value: itemControl.Date ? moment(itemControl.Date) : null,
                                        refresh: false,
                                        disable: false,
                                        visible: true
                                    },
                                    ['TimeStartBreak_' + index]: {
                                        visible: true,
                                        value: itemControl.HoursFrom
                                            ? moment(itemControl.HoursFrom).format('YYYY-MM-DD HH:mm:ss')
                                            : null,
                                        refresh: false,
                                        disable: false
                                    },
                                    ['TimeEndBreak_' + index]: {
                                        visible: true,
                                        value: itemControl.HoursTo
                                            ? moment(itemControl.HoursTo).format('YYYY-MM-DD HH:mm:ss')
                                            : null,
                                        refresh: false,
                                        disable: false
                                    },
                                    ['ListRegisterHours_' + index]: {
                                        disable: false,
                                        refresh: false,
                                        value: itemControl['WorkHours'],
                                        data: []
                                    }
                                };
                            } else {
                                return {
                                    ...itemControl,
                                    ['Date_' + index]: {
                                        value: itemControl.Date ? moment(itemControl.Date) : null,
                                        refresh: false,
                                        disable: false,
                                        visible: true
                                    },
                                    ['TimeStartBreak_' + index]: {
                                        visible: true,
                                        value: itemControl.TimeStartBreak
                                            ? moment(itemControl.TimeStartBreak).format('YYYY-MM-DD HH:mm:ss')
                                            : null,
                                        refresh: false,
                                        disable: false
                                    },
                                    ['TimeEndBreak_' + index]: {
                                        visible: true,
                                        value: itemControl.TimeEndBreak
                                            ? moment(itemControl.TimeEndBreak).format('YYYY-MM-DD HH:mm:ss')
                                            : null,
                                        refresh: false,
                                        disable: false
                                    },
                                    ['ListRegisterHours_' + index]: {
                                        disable: false,
                                        refresh: false,
                                        value: valRes ? { ...valRes } : null,
                                        data: [...dataRegisterHours]
                                    }
                                };
                            }
                        }
                    });

                    if (divFullShiftMoreDay.visible && this.IsconfigMultipleLeaveDayTypeFull) {
                        this.setState({
                            Div_TypeHalfShift1: {
                                ...Div_TypeHalfShift1,
                                divFullShiftMoreDay: {
                                    ...Div_TypeHalfShift1.divFullShiftMoreDay,
                                    dataRegisterFullShiftModels: dataControl
                                }
                            }
                        });
                    } else {
                        // Giữa ca, Loại nữa ca trước, nữa ca sau
                        this.setState({
                            Div_TypeHalfShift1: {
                                ...Div_TypeHalfShift1,
                                divMiddleShiftMoreDay: {
                                    ...Div_TypeHalfShift1.divMiddleShiftMoreDay,
                                    dataRegisterMiddleShiftModels: dataControl
                                }
                            }
                        });
                    }
                }
            });
        }
    };

    onChangeTimeStartBreak = (value, index) => {
        const { Div_TypeHalfShift1 } = this.state,
            { divMiddleShiftMoreDay } = Div_TypeHalfShift1,
            { dataRegisterMiddleShiftModels } = divMiddleShiftMoreDay,
            itemShift = dataRegisterMiddleShiftModels[index];

        itemShift['TimeStartBreak_' + index].value = value;
        itemShift['TimeStartBreak_' + index].refresh = !itemShift['TimeStartBreak_' + index].refresh;

        let nextState = {
            Div_TypeHalfShift1: {
                ...Div_TypeHalfShift1,
                divMiddleShiftMoreDay: {
                    ...divMiddleShiftMoreDay,
                    dataRegisterMiddleShiftModels: [...dataRegisterMiddleShiftModels]
                }
            }
        };

        this.setState(nextState, () => {
            let _time = value ? moment(value).format('HH:mm') : null,
                _hours = itemShift['ListRegisterHours_' + index].value
                    ? itemShift['ListRegisterHours_' + index].value.Value
                    : null;
            this.GetLeaveHourMidleShiftMoreDay(index, itemShift['Date'], _time, _hours);
        });
    };

    onPickerShiftRegisterHours = (value, index) => {
        const { Div_TypeHalfShift1 } = this.state,
            { divMiddleShiftMoreDay } = Div_TypeHalfShift1,
            { dataRegisterMiddleShiftModels } = divMiddleShiftMoreDay,
            itemShift = dataRegisterMiddleShiftModels[index];

        itemShift['ListRegisterHours_' + index].value = value;
        itemShift['ListRegisterHours_' + index].refresh = !itemShift['ListRegisterHours_' + index].refresh;

        let nextState = {
            Div_TypeHalfShift1: {
                ...Div_TypeHalfShift1,
                divMiddleShiftMoreDay: {
                    ...divMiddleShiftMoreDay,
                    dataRegisterMiddleShiftModels: [...dataRegisterMiddleShiftModels]
                }
            }
        };

        this.setState(nextState, () => {
            let _time = itemShift['TimeStartBreak_' + index].value
                    ? moment(itemShift['TimeStartBreak_' + index].value).format('HH:mm')
                    : null,
                _hours = value ? value.Value : null;
            this.GetLeaveHourMidleShiftMoreDay(index, itemShift['Date'], _time, _hours);
        });
    };

    updateTimeEnd = (timeStart, hours, endShift, dataValue, index) => {
        const { Div_TypeHalfShift1 } = this.state,
            { divMiddleShiftMoreDay } = Div_TypeHalfShift1,
            { dataRegisterMiddleShiftModels } = divMiddleShiftMoreDay,
            itemShift = dataRegisterMiddleShiftModels[index];

        let nextState = {};

        if (!timeStart || !hours) return;

        let timeEnd = moment(timeStart).add(hours, 'hours'),
            timeStartBreak = new Date(moment(dataValue.TimeStartBreak).format('YYYY/MM/DD HH:mm:ss')),
            timeEndBreak = new Date(moment(dataValue.TimeEndBreak).format('YYYY/MM/DD HH:mm:ss'));

        if (timeStart >= timeStartBreak && timeStart <= timeEndBreak) {
            timeEnd = moment(timeEndBreak).add(hours, 'hours');
            timeStart = timeEndBreak;
        }

        let hoursBreak = timeEnd.diff(moment(timeStartBreak), 'hours', true);
        if (timeEnd > timeStartBreak && timeStart < timeEndBreak) {
            if (timeEnd <= timeEndBreak) hoursBreak = moment(timeEndBreak).diff(moment(timeStartBreak), 'hours', true);
            else
                hoursBreak = moment(timeEnd > timeEndBreak ? timeEndBreak : timeEnd).diff(
                    moment(timeStartBreak > timeStart ? timeStartBreak : timeStart),
                    'hours',
                    true
                );
            timeEnd = moment(timeEnd).add(hoursBreak, 'hours');
        }

        if (timeEnd > endShift) {
            itemShift['TimeEndBreak_' + index].value = null;
            itemShift['TimeEndBreak_' + index].refresh = !itemShift['TimeEndBreak_' + index].refresh;
        } else {
            itemShift['TimeEndBreak_' + index].value = timeEnd.toDate();
            itemShift['TimeEndBreak_' + index].refresh = !itemShift['TimeEndBreak_' + index].refresh;
        }

        itemShift['Days'] = hours / dataValue.WorkHours;

        nextState = {
            Div_TypeHalfShift1: {
                ...Div_TypeHalfShift1,
                divMiddleShiftMoreDay: {
                    ...divMiddleShiftMoreDay,
                    dataRegisterMiddleShiftModels: [...dataRegisterMiddleShiftModels]
                }
            }
        };
        this.setState(nextState);
    };

    GetLeaveHourMidleShiftMoreDay = (index, date, time, hours) => {
        const { Div_TypeHalfShift1 } = this.state,
            { divMiddleShiftMoreDay, TypeHalfShift } = Div_TypeHalfShift1,
            { dataRegisterMiddleShiftModels } = divMiddleShiftMoreDay,
            itemShift = dataRegisterMiddleShiftModels[index],
            { TimeStart, TimeEnd, IsNighShift } = itemShift;

        if (!date || !time) return;

        let dataFrom = moment(moment(`${date}`).format('YYYY-MM-DD') + ' ' + time).toDate(),
            beginShift = TimeStart ? moment(moment(TimeStart).format('YYYY-MM-DD HH:mm:ss')).toDate() : null,
            endShift = TimeEnd ? moment(moment(TimeEnd).format('YYYY-MM-DD HH:mm:ss')).toDate() : null,
            timeEnd = moment(dataFrom).add(parseFloat(hours), 'hours');

        let timeEndBreak = new Date(moment(itemShift['TimeEndBreak']).format('YYYY/MM/DD HH:mm:ss'));
        let timeStartBreak = new Date(moment(itemShift['TimeStartBreak']).format('YYYY/MM/DD HH:mm:ss'));
        let timeBreak = Number(
            (
                timeEndBreak.getHours() +
                timeEndBreak.getMinutes() / 60 -
                timeStartBreak.getHours() -
                timeStartBreak.getMinutes() / 60
            ).toFixed(2)
        ); // 40p

        if (timeEndBreak.toLocaleString() > dataFrom.toLocaleString()) {
            if (timeStartBreak.toLocaleString() < dataFrom.toLocaleString()) {
                let timebreak1 = Number(
                    (
                        dataFrom.getHours() +
                        dataFrom.getMinutes() / 60 -
                        timeStartBreak.getHours() -
                        timeStartBreak.getMinutes() / 60
                    ).toFixed(2)
                );
                timeBreak = timeBreak - timebreak1;
            }

            let _hours = (parseFloat(hours) + timeBreak).toFixed(2);
            timeEnd = new Date(moment(dataFrom).add(_hours, 'hours'));
        }

        if (this.IsconfigMultipleLeaveDayType && TypeHalfShift.value != 'E_MIDDLEOFSHIFT') {
            beginShift = new Date(moment(TimeStart).format('YYYY/MM/DD HH:mm:ss'));
            endShift = new Date(moment(TimeEnd).format('YYYY/MM/DD HH:mm:ss'));
        }

        if (IsNighShift == true) endShift = moment(date).add(1, 'days');

        if (dataFrom < beginShift || dataFrom > endShift || timeEnd > endShift) {
            let _message =
                translate('WarningThisTimeValueOutTimeShiftFromTo') +
                ' ' +
                moment(TimeStart).format('HH:mm') +
                ' ' +
                translate('HRM_Common_ToLower') +
                ' ' +
                moment(TimeEnd).format('HH:mm'); //+ '. ' + translate('WarningDoYouWantSystemAutoUpdate');

            AlertSevice.alert({
                title: translate('Hrm_Notification'),
                iconType: EnumIcon.E_WARNING,
                message: _message,
                onCancel: () => {
                    itemShift['ListRegisterHours_' + index].value = null;
                    itemShift['ListRegisterHours_' + index].refresh = !itemShift['TimeStartBreak_' + index].refresh;
                    this.setState({
                        Div_TypeHalfShift1: {
                            ...Div_TypeHalfShift1,
                            divMiddleShiftMoreDay: {
                                ...divMiddleShiftMoreDay,
                                dataRegisterMiddleShiftModels: [...dataRegisterMiddleShiftModels]
                            }
                        }
                    });
                },
                showConfirm: false
                // onConfirm: () => {
                //     console.log(dataRegisterMiddleShiftModels, 'dataRegisterMiddleShiftModels')
                //     itemShift['TimeStartBreak_' + index].value = TimeStart;
                //     itemShift['TimeStartBreak_' + index].refresh = !itemShift['TimeStartBreak_' + index].refresh;
                //     this.setState({
                //         Div_TypeHalfShift1: {
                //             ...Div_TypeHalfShift1,
                //             divMiddleShiftMoreDay: {
                //                 ...divMiddleShiftMoreDay,
                //                 dataRegisterMiddleShiftModels: [...dataRegisterMiddleShiftModels]
                //             }
                //         }
                //     }, () => {
                //         this.updateTimeEnd(beginShift, null, endShift, itemShift, index);
                //     })
                // }
            });
        } else {
            this.updateTimeEnd(dataFrom, hours, endShift, itemShift, index);
        }
    };

    removeShiftDetail = index => {
        const { Div_TypeHalfShift1 } = this.state,
            { divMiddleShiftMoreDay } = Div_TypeHalfShift1,
            { dataRegisterMiddleShiftModels } = divMiddleShiftMoreDay;

        let _dataRegisterMiddleShiftModels = dataRegisterMiddleShiftModels.map((item, _index) => {
            if (index === _index) {
                return {};
            }

            return item;
        });

        this.setState({
            Div_TypeHalfShift1: {
                ...Div_TypeHalfShift1,
                divMiddleShiftMoreDay: {
                    ...divMiddleShiftMoreDay,
                    dataRegisterMiddleShiftModels: [..._dataRegisterMiddleShiftModels]
                }
            }
        });
    };

    renderShift = () => {
        const { Div_TypeHalfShift1 } = this.state,
            { divMiddleShiftMoreDay, divFirstLastShiftMoreDay } = Div_TypeHalfShift1,
            { dataRegisterMiddleShiftModels } = divMiddleShiftMoreDay;

        if (divFirstLastShiftMoreDay.visible) {
            return dataRegisterMiddleShiftModels.map((item, index) => {
                if (Object.hasOwnProperty.call(item, 'Date')) {
                    let dateControl = item['Date_' + index],
                        timeStartBreak = item['TimeStartBreak_' + index],
                        timeEndBreak = item['TimeEndBreak_' + index];

                    return (
                        <View key={index} style={styles.styViewHalfShift_Item}>
                            <View style={styles.styControlHalf}>
                                <VnrDate
                                    disable={true}
                                    response={'string'}
                                    format={'DD/MM/YYYY'}
                                    value={dateControl.value ? moment(dateControl.value) : null}
                                    type={'date'}
                                />

                                <View style={styles.styControlHalfDateEnd}>
                                    <VnrTextInput
                                        value={`${timeStartBreak.value ? moment(timeStartBreak.value).format('HH:mm') : ''
                                        }${timeEndBreak.value ? ` - ${moment(timeEndBreak.value).format('HH:mm')}` : ''
                                        }`}
                                        disable={true}
                                    />
                                </View>

                                <TouchableOpacity
                                    style={styles.styControlHalfIcon}
                                    onPress={() => {
                                        this.removeShiftDetail(index);
                                    }}
                                >
                                    <IconCloseCircle size={Size.iconSize} color={Colors.gray_8} />
                                </TouchableOpacity>
                            </View>
                        </View>
                    );
                } else {
                    return <View key={index} />;
                }
            });
        } else {
            return dataRegisterMiddleShiftModels.map((item, index) => {
                if (Object.hasOwnProperty.call(item, 'Date')) {
                    let dateControl = item['Date_' + index],
                        timeStartBreak = item['TimeStartBreak_' + index],
                        timeEndBreak = item['TimeEndBreak_' + index],
                        listRegisterHours = item['ListRegisterHours_' + index];

                    if (listRegisterHours.data && listRegisterHours.data.length > 0) {
                        return (
                            <View key={index} style={styles.styViewHalfShift_Item}>
                                <View style={styles.styTitleHalf}>
                                    <VnrText
                                        style={[styleSheets.text, styles.styTitleHalf_text]}
                                        i18nKey={moment(dateControl.value).format('DD/MM/YYYY')}
                                    />

                                    <Text style={[styleSheets.text, styles.styTitleHalf_text]}>
                                        {` | ${timeStartBreak.value ? moment(timeStartBreak.value).format('HH:mm') : ''
                                        }${timeEndBreak.value ? ` - ${moment(timeEndBreak.value).format('HH:mm')}` : ''
                                        }`}
                                    </Text>
                                </View>

                                <View style={styles.styControlHalf}>
                                    <VnrDate
                                        response={'string'}
                                        format={'HH:mm'}
                                        value={timeStartBreak.value}
                                        refresh={timeStartBreak.refresh}
                                        type={'time'}
                                        onFinish={value => this.onChangeTimeStartBreak(value, index)}
                                    />

                                    <View style={styles.styControlHalfDateEnd}>
                                        <VnrPickerQuickly
                                            dataLocal={listRegisterHours.data}
                                            refresh={listRegisterHours.refresh}
                                            textField="Text"
                                            valueField="Value"
                                            filter={false}
                                            value={listRegisterHours.value}
                                            disable={listRegisterHours.disable}
                                            onFinish={item => this.onPickerShiftRegisterHours(item, index)}
                                        />
                                    </View>

                                    <TouchableOpacity
                                        style={styles.styControlHalfIcon}
                                        onPress={() => {
                                            this.removeShiftDetail(index);
                                        }}
                                    >
                                        <IconCloseCircle size={Size.iconSize} color={Colors.gray_8} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    } else {
                        return (
                            <View key={index} style={styles.styViewHalfShift_Item}>
                                <View style={styles.styTitleHalf}>
                                    <VnrText
                                        style={[styleSheets.text, styles.styTitleHalf_text]}
                                        i18nKey={moment(dateControl.value).format('DD/MM/YYYY')}
                                    />

                                    <Text style={[styleSheets.text, styles.styTitleHalf_text]}>
                                        {listRegisterHours.value && listRegisterHours.value.Value
                                            ? `| ${Vnr_Function.mathRoundNumber(
                                                listRegisterHours.value.Value
                                            )} ${translate('Hour_Lowercase')}`
                                            : ''}
                                    </Text>
                                </View>

                                <View style={styles.styControlHalf}>
                                    <VnrDate
                                        response={'string'}
                                        format={'HH:mm'}
                                        value={timeStartBreak.value}
                                        refresh={timeStartBreak.refresh}
                                        type={'time'}
                                        onFinish={value => this.onChangeTimeStartBreak(value, index)}
                                    />

                                    <View style={styles.styControlHalfDateEnd}>
                                        <VnrDate
                                            response={'string'}
                                            format={'HH:mm'}
                                            value={timeEndBreak.value}
                                            refresh={timeEndBreak.refresh}
                                            type={'time'}
                                            onFinish={value => this.onChangeTimeEndBreak(value, index)}
                                        />
                                    </View>

                                    <TouchableOpacity
                                        style={styles.styControlHalfIcon}
                                        onPress={() => {
                                            this.removeShiftDetail(index);
                                        }}
                                    >
                                        <IconCloseCircle size={Size.iconSize} color={Colors.gray_8} />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        );
                    }
                } else {
                    return <View key={index} />;
                }
            });
        }
    };

    removeFullShiftDetail = index => {
        const { Div_TypeHalfShift1 } = this.state,
            { divFullShiftMoreDay } = Div_TypeHalfShift1,
            { dataRegisterFullShiftModels } = divFullShiftMoreDay;

        let _dataRegisterFullShiftModels = dataRegisterFullShiftModels.map((item, _index) => {
            if (index === _index) {
                return {};
            }

            return item;
        });

        this.setState({
            Div_TypeHalfShift1: {
                ...Div_TypeHalfShift1,
                divFullShiftMoreDay: {
                    ...Div_TypeHalfShift1.divFullShiftMoreDay,
                    dataRegisterFullShiftModels: [..._dataRegisterFullShiftModels]
                }
            }
        });
    };

    renderFullShift = () => {
        const { Div_TypeHalfShift1 } = this.state,
            { divFullShiftMoreDay } = Div_TypeHalfShift1,
            { dataRegisterFullShiftModels } = divFullShiftMoreDay;

        return dataRegisterFullShiftModels.map((item, index) => {
            if (Object.hasOwnProperty.call(item, 'Date')) {
                let dateControl = item['Date_' + index],
                    listRegisterHours = item['ListRegisterHours_' + index];

                return (
                    <View key={index} style={styles.styViewHalfShift_Item}>
                        <View style={styles.styControlHalf}>
                            <VnrDate
                                disable={true}
                                response={'string'}
                                format={'DD/MM/YYYY'}
                                value={dateControl.value}
                                type={'date'}
                            />

                            <View style={styles.styControlHalfDateEnd}>
                                <VnrTextInput
                                    value={`${listRegisterHours.value} ${translate('Hour_Lowercase')}`}
                                    disable={true}
                                />
                            </View>

                            <TouchableOpacity
                                style={styles.styControlHalfIcon}
                                onPress={() => {
                                    this.removeFullShiftDetail(index);
                                }}
                            >
                                <IconCloseCircle size={Size.iconSize} color={Colors.gray_8} />
                            </TouchableOpacity>
                        </View>
                    </View>
                );
            } else {
                return <View key={index} />;
            }
        });
    };

    getDataShiftDetail = () => {
        const { Div_TypeHalfShift1 } = this.state,
            { divMiddleShiftMoreDay } = Div_TypeHalfShift1,
            { dataRegisterMiddleShiftModels } = divMiddleShiftMoreDay;

        let result = [];
        dataRegisterMiddleShiftModels.forEach((item, index) => {
            if (Object.hasOwnProperty.call(item, 'Date')) {
                var _date = item['Date'],
                    _timeStart = item['TimeStartBreak_' + index].value,
                    _timeEnd = item['TimeEndBreak_' + index].value,
                    _hours = item['ListRegisterHours_' + index].value,
                    _days = item['Days'];

                result.push({
                    Date: _date ? moment(_date).format('YYYY-MM-DD') : null,
                    HoursFrom: _timeStart ? moment(_timeStart).format('YYYY-MM-DD HH:mm') : null,
                    HoursTo: _timeEnd ? moment(_timeEnd).format('YYYY-MM-DD HH:mm') : null,
                    Hours: _hours ? _hours.Value : null,
                    Days: _days
                });
            }
        });

        return result;
    };

    getDataFirstLastShiftDetail = () => {
        const { Div_TypeHalfShift1 } = this.state,
            { divMiddleShiftMoreDay } = Div_TypeHalfShift1,
            { dataRegisterMiddleShiftModels } = divMiddleShiftMoreDay;

        let result = [];
        dataRegisterMiddleShiftModels.forEach((item, index) => {
            if (Object.hasOwnProperty.call(item, 'Date')) {
                var _date = item['Date'],
                    _timeStart = item['TimeStartBreak_' + index].value,
                    _timeEnd = item['TimeEndBreak_' + index].value,
                    _hours = item['ListRegisterHours_' + index].value;

                result.push({
                    Date: _date ? moment(_date).format('YYYY-MM-DD') : null,
                    HoursFrom: _timeStart ? moment(_timeStart).format('YYYY-MM-DD HH:mm') : null,
                    HoursTo: _timeEnd ? moment(_timeEnd).format('YYYY-MM-DD HH:mm') : null,
                    Hours: _hours ? _hours : null,
                    Days: _hours ? parseFloat(_hours) / 8 : 0
                });
            }
        });

        return result;
    };

    getDataForSaveFullShift() {
        const { Div_TypeHalfShift1 } = this.state,
            { divFullShiftMoreDay } = Div_TypeHalfShift1,
            { dataRegisterFullShiftModels } = divFullShiftMoreDay;

        let result = [];
        dataRegisterFullShiftModels.forEach((item, index) => {
            if (Object.hasOwnProperty.call(item, 'Date')) {
                var _date = item['Date'],
                    _hours = item['ListRegisterHours_' + index].value;

                result.push({
                    Date: _date ? moment(_date).format('YYYY-MM-DD') : null,
                    Hours: _hours ? _hours : null
                });
            }
        });

        return result;
    }

    resetDisplayForm = callback => {
        const { Div_TypeHalfShift1, DateStart, DateEnd, Div_DurationType1 } = this.state,
            { DurationType } = Div_DurationType1,
            {
                divMiddleShiftMoreDay,
                divTypeHalfShiftContent,
                divFullShiftMoreDay,
                divFirstLastShiftMoreDay,
                TypeHalfShift
            } = Div_TypeHalfShift1,
            { divTypeHalfShiftLeaveHours } = divTypeHalfShiftContent;

        let nextState = {
            Div_TypeHalfShift1: {
                ...Div_TypeHalfShift1,
                divMiddleShiftMoreDay: {
                    ...divMiddleShiftMoreDay,
                    dataRegisterMiddleShiftModels: [],
                    visible: false
                },
                divTypeHalfShiftContent: {
                    ...divTypeHalfShiftContent,
                    divTypeHalfShiftLeaveHours: {
                        ...divTypeHalfShiftLeaveHours,
                        visible: false
                    }
                },
                divFullShiftMoreDay: {
                    ...divFullShiftMoreDay,
                    dataRegisterFullShiftModels: [],
                    visible: false
                },
                divFirstLastShiftMoreDay: {
                    ...divFirstLastShiftMoreDay,
                    dataRegisterFirstLastShiftModels: [],
                    visible: false
                }
            }
        };

        if (DurationType.value && DurationType.data) {
            let objVal = DurationType.data.find(item => item.Value == 'E_FULLSHIFT');

            nextState = {
                ...nextState,
                Div_DurationType1: {
                    ...Div_DurationType1,
                    DurationType: {
                        ...DurationType,
                        value: objVal,
                        refresh: !DurationType.refresh
                    }
                }
            };
        }

        if (DateStart.value && DateEnd.value) {
            if (moment(DateStart.value) == moment(DateEnd.value)) {
                nextState.Div_TypeHalfShift1.TypeHalfShift.value = null;
                nextState.Div_TypeHalfShift1.TypeHalfShift.refresh = !nextState.Div_TypeHalfShift1.TypeHalfShift
                    .refresh;
            } else if (TypeHalfShift.data) {
                let objVal = TypeHalfShift.data.find(item => item.Value == 'E_FULLSHIFT');
                nextState.Div_TypeHalfShift1.TypeHalfShift.value = objVal;
                nextState.Div_TypeHalfShift1.TypeHalfShift.refresh = !nextState.Div_TypeHalfShift1.TypeHalfShift
                    .refresh;
            }
        }

        this.setState(nextState, () => {
            callback();
            // this.GenerateControlFullShift();
        });
    };

    onChangeLeaveTypeGroup = item => {
        const { LeaveTypeGroup } = this.state;
        this.setState(
            {
                LeaveTypeGroup: {
                    ...LeaveTypeGroup,
                    value: item,
                    refresh: !LeaveTypeGroup.refresh
                }
            },
            () => {
                this.LoadLeaveDayTypeByGrade();
                // this.ShowOrHideRemainLeavePortal();
            }
        );
    };

    //#region [0161401: [Hotfix_FGL_V8.10.44.01.11.165] Sửa logic khi đăng ký nghỉ loại "Giữa ca" trên App ]
    onChangeTimeStartBreak = (value, index) => {
        const { Div_TypeHalfShift1 } = this.state,
            { divMiddleShiftMoreDay } = Div_TypeHalfShift1,
            { dataRegisterMiddleShiftModels } = divMiddleShiftMoreDay,
            itemShift = dataRegisterMiddleShiftModels[index];

        itemShift['TimeStartBreak_' + index].value = value;
        itemShift['TimeStartBreak_' + index].refresh = !itemShift['TimeStartBreak_' + index].refresh;

        let nextState = {
            Div_TypeHalfShift1: {
                ...Div_TypeHalfShift1,
                divMiddleShiftMoreDay: {
                    ...divMiddleShiftMoreDay,
                    dataRegisterMiddleShiftModels: [...dataRegisterMiddleShiftModels]
                }
            }
        };

        if (value || itemShift['TimeEndBreak_' + index].value) {
            this.setState(nextState, () => this.HoursTimeBreakChange(this.callbackGetLeaveHourShift, index));
        } else {
            this.setState(nextState);
        }
    };

    onChangeTimeEndBreak = (value, index) => {
        const { Div_TypeHalfShift1 } = this.state,
            { divMiddleShiftMoreDay } = Div_TypeHalfShift1,
            { dataRegisterMiddleShiftModels } = divMiddleShiftMoreDay,
            itemShift = dataRegisterMiddleShiftModels[index];

        itemShift['TimeEndBreak_' + index].value = value;
        itemShift['TimeEndBreak_' + index].refresh = !itemShift['TimeEndBreak_' + index].refresh;

        let nextState = {
            Div_TypeHalfShift1: {
                ...Div_TypeHalfShift1,
                divMiddleShiftMoreDay: {
                    ...divMiddleShiftMoreDay,
                    dataRegisterMiddleShiftModels: [...dataRegisterMiddleShiftModels]
                }
            }
        };

        if (value || itemShift['TimeStartBreak_' + index].value) {
            this.setState(nextState, () => this.HoursTimeBreakChange(this.callbackGetLeaveHourShift, index));
        } else {
            this.setState(nextState);
        }
    };

    callbackGetLeaveHourShift = (data, dataBody, index) => {
        const { Div_TypeHalfShift1 } = this.state,
            { divMiddleShiftMoreDay } = Div_TypeHalfShift1,
            { dataRegisterMiddleShiftModels } = divMiddleShiftMoreDay,
            itemShift = dataRegisterMiddleShiftModels[index];

        let arrUrl = data.split('|'),
            _data = arrUrl[0];
        if (_data == 'WarningTimeInvalid') {
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
                    itemShift['ListRegisterHours_' + index].value = { Value: 0 };
                    itemShift['Days'] = 0;

                    let nextState = {
                        Div_TypeHalfShift1: {
                            ...Div_TypeHalfShift1,
                            divMiddleShiftMoreDay: {
                                ...divMiddleShiftMoreDay,
                                dataRegisterMiddleShiftModels: [...dataRegisterMiddleShiftModels]
                            }
                        }
                    };

                    this.setState(nextState);
                },
                onConfirm: () => {
                    dataBody = {
                        ...dataBody,
                        isConfirmSplitHours: true
                    };

                    VnrLoadingSevices.show();
                    HttpService.Post('[URI_HR]/Att_GetData/GetLeaveHourMidleShift', dataBody).then(data1 => {
                        VnrLoadingSevices.hide();
                        try {
                            if (typeof data1 == enumName.E_object) {
                                if (data1.Key != null && data1.Key != '') {
                                    ToasterSevice.showWarning(data1.Value, 4000);
                                    return;
                                }
                                let hoursFrom = new Date(parseInt(data1.HoursFrom.substr(6)));
                                let hoursTo = new Date(parseInt(data1.HoursTo.substr(6)));

                                itemShift['TimeStartBreak_' + index].value = hoursFrom;
                                itemShift['TimeStartBreak_' + index].refresh = !itemShift['TimeStartBreak_' + index]
                                    .refresh;

                                itemShift['TimeEndBreak_' + index].value = hoursTo;
                                itemShift['TimeEndBreak_' + index].refresh = !itemShift['TimeEndBreak_' + index]
                                    .refresh;

                                itemShift['ListRegisterHours_' + index].value = { Value: data1.LeaveHours };
                                itemShift['Days'] = data1.LeaveDays;

                                let nextState = {
                                    Div_TypeHalfShift1: {
                                        ...Div_TypeHalfShift1,
                                        divMiddleShiftMoreDay: {
                                            ...divMiddleShiftMoreDay,
                                            dataRegisterMiddleShiftModels: [...dataRegisterMiddleShiftModels]
                                        }
                                    }
                                };

                                this.setState(nextState);
                            } else {
                                ToasterSevice.showError(data1, 4000);
                            }
                        } catch (error) {
                            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                        }
                    });
                }
            });
        } else {
            ToasterSevice.showError(data, 4000);
        }
    };

    HoursTimeBreakChange = (callbackGetLeaveHourShift, index) => {
        const { Div_TypeHalfShift1 } = this.state,
            { divMiddleShiftMoreDay } = Div_TypeHalfShift1,
            { dataRegisterMiddleShiftModels } = divMiddleShiftMoreDay,
            itemShift = dataRegisterMiddleShiftModels[index],
            dateControl = itemShift['Date_' + index];

        const { Div_DurationType1, divShift, Profile, LeaveDayTypeFull, LeaveDayTypeByGrade } = this.state,
            { Shift } = divShift,
            { LeaveDayType } = LeaveDayTypeFull,
            { TempLeaveDayType } = LeaveDayTypeByGrade,
            { DurationType } = Div_DurationType1;

        itemShift['ListRegisterHours_' + index].value = { Value: 0 };
        itemShift['Days'] = 0;

        let dateStart = dateControl ? Vnr_Function.parseDateTime(dateControl) : null,
            dateEnd = dateControl ? Vnr_Function.parseDateTime(dateControl) : null,
            HoursFrom = itemShift['TimeStartBreak_' + index].value,
            HoursTo = itemShift['TimeEndBreak_' + index].value,
            nextState = {
                Div_TypeHalfShift1: {
                    ...Div_TypeHalfShift1,
                    divMiddleShiftMoreDay: {
                        ...divMiddleShiftMoreDay,
                        dataRegisterMiddleShiftModels: [...dataRegisterMiddleShiftModels]
                    }
                }
            };

        if (dateStart && dateEnd) {
            let dateStartNew = dateStart,
                dateEndNew = dateEnd,
                timeFrom = HoursFrom ? moment(HoursFrom).format('HH:mm') : null,
                timeTo = HoursTo ? moment(HoursTo).format('HH:mm') : null,
                leavedayID =
                    TempLeaveDayType.value && TempLeaveDayType.value.ID
                        ? TempLeaveDayType.value.ID
                        : LeaveDayType.value
                            ? LeaveDayType.value.ID
                            : null,
                durationType = DurationType.value ? DurationType.value.Value : null,
                shiftID = Shift.value ? Shift.value.ID : null;

            let dataBody = {
                profileId: Profile.ID,
                dateStart: dateStartNew,
                dateEnd: dateEndNew,
                hourFrom: timeFrom,
                hourTo: timeTo,
                leavedayTypeId: leavedayID,
                durationType: durationType,
                ShiftID: shiftID,
                isConfirmSplitHours: false
            };

            this.setState(nextState, () => {
                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Att_GetData/GetLeaveHourMidleShift', dataBody).then(data => {
                    VnrLoadingSevices.hide();
                    try {
                        if (typeof data == 'object') {
                            if (data.Key != null && data.Key != '') {
                                ToasterSevice.showWarning(data.Value, 4000);
                                return;
                            }

                            const { Div_TypeHalfShift1 } = this.state,
                                { divMiddleShiftMoreDay } = Div_TypeHalfShift1,
                                { dataRegisterMiddleShiftModels } = divMiddleShiftMoreDay,
                                itemShift = dataRegisterMiddleShiftModels[index];

                            itemShift['ListRegisterHours_' + index].value = { Value: data.LeaveHours };
                            itemShift['Days'] = data.LeaveDays;

                            this.setState({
                                Div_TypeHalfShift1: {
                                    ...Div_TypeHalfShift1,
                                    divMiddleShiftMoreDay: {
                                        ...divMiddleShiftMoreDay,
                                        dataRegisterMiddleShiftModels: [...dataRegisterMiddleShiftModels]
                                    }
                                }
                            });
                        } else {
                            callbackGetLeaveHourShift(data, { ...dataBody }, index);
                        }
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });
            });
        } else {
            this.setState(nextState);
        }
    };
    //#endregion
    //#endregion

    render() {
        const {
            DateStart,
            DateEnd,
            DateReturnToWork,
            LeaveTypeGroup,
            LeaveDayTypeFull,
            LeaveDayTypeByGrade,
            hasIsMeal,
            btnComputeRemainDaysPortal,
            Div_DurationType1,
            Div_TypeHalfShift1,
            divShift,
            UserApprove,
            UserApprove3,
            UserApprove4,
            UserApprove2,
            divComment,
            divBusinessReason,
            FileAttachment,
            fieldValid,
            PlaceSendToID,
            PregnancyCycleID,
            FileAttach,
            dataAnnualDetail,
            IsRequiredDocuments,
            modalErrorDetail
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

        this.isRegisterHelp != null &&
            (({ CommentLD } = divComment),
            ({ BusinessReason } = divBusinessReason),
            ({ LeaveDayType } = LeaveDayTypeFull),
            ({ TempLeaveDayType } = LeaveDayTypeByGrade),
            ({ IsMeal, HaveMeal } = hasIsMeal),
            ({ dayportal, hoursportal, leaveDayTypeView } = btnComputeRemainDaysPortal),
            ({ DurationType, DurationTypeDetail } = Div_DurationType1),
            ({ OtherDurationType, DurationTypeFullShift } = DurationTypeDetail),
            ({ HoursFrom, divHoursMiddleOfShift, HoursTo, LeaveHoursDetail, divLeaveHours } = OtherDurationType),
            ({ HoursMiddleOfShift } = divHoursMiddleOfShift),
            ({ ConfigLeaveHoursDetail } = LeaveHoursDetail),
            ({ LeaveHours } = divLeaveHours),
            ({ LeaveDays } = DurationTypeFullShift),
            ({
                divTypeHalfShiftContent,
                divMiddleShiftMoreDay,
                TypeHalfShift,
                divFullShiftMoreDay,
                divFirstLastShiftMoreDay
            } = Div_TypeHalfShift1),
            ({ divTypeHalfShiftLeaveDay, divTypeHalfShiftLeaveHours } = divTypeHalfShiftContent),
            ({ TypeHalfShiftLeaveDays } = divTypeHalfShiftLeaveDay),
            ({ TypeHalfShiftLeaveHours } = divTypeHalfShiftLeaveHours),
            ({ Shift } = divShift));

        const listActions = [];
        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_Leaveday_New_CreateOrUpdate_btnSaveandSendMail'] &&
            PermissionForAppMobile.value['New_Att_Leaveday_New_CreateOrUpdate_btnSaveandSendMail']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_SENMAIL,
                title: translate('HRM_Common_SaveAndSendMail'),
                onPress: () => this.saveAndSend(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_Leaveday_New_CreateOrUpdate_btnSaveClose'] &&
            PermissionForAppMobile.value['New_Att_Leaveday_New_CreateOrUpdate_btnSaveClose']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_CLOSE,
                title: translate('HRM_Common_SaveClose'),
                onPress: () => this.save(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_Leaveday_New_CreateOrUpdate_btnSaveNew'] &&
            PermissionForAppMobile.value['New_Att_Leaveday_New_CreateOrUpdate_btnSaveNew']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_NEW,
                title: translate('HRM_Common_SaveNew'),
                onPress: () => this.saveAndCreate(this.props.navigation)
            });
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    {this.isRegisterHelp != null && (
                        <KeyboardAwareScrollView
                            contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                            keyboardShouldPersistTaps={'handled'}
                        >
                            {/* Thời gian nghỉ - DateStart, DateEnd */}
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_Leaveday_DateFromTo'}
                                    />

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

                            {/* Ngày đi làm lại - DateReturnToWork */}
                            {DateReturnToWork.visible && DateReturnToWork.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Att_Leaveday_DateReturnToWork'}
                                        />

                                        {/* valid DateReturnToWork */}
                                        {fieldValid.DateReturnToWork && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={DateReturnToWork.value}
                                            refresh={DateReturnToWork.refresh}
                                            type={'date'}
                                            onFinish={value => this.onDateChangeDateReturnToWork(value)}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Nhóm ngày nghỉ - LeaveTypeGroup */}
                            {LeaveTypeGroup.visible && LeaveTypeGroup.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Category_LeaveDayType_LeaveTypeGroup'}
                                        />

                                        {/* valid LeaveTypeGroup */}
                                        {fieldValid.LeaveTypeGroup && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            disable={LeaveTypeGroup.disable}
                                            dataLocal={LeaveTypeGroup.data}
                                            textField="LeaveTypeGroup"
                                            valueField="LeaveTypeGroup"
                                            filter={true}
                                            refresh={LeaveTypeGroup.refresh}
                                            filterServer={false}
                                            autoFilter={true}
                                            value={LeaveTypeGroup.value}
                                            onFinish={item => this.onChangeLeaveTypeGroup(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Loại ngày nghỉ - LeaveDayTypeID -LeaveDayTypeFull */}
                            {LeaveDayTypeFull.visible && LeaveDayTypeFull.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Leaveday_LeaveDayTypeID'}
                                        />

                                        {/* valid LeaveDayTypeID */}
                                        {fieldValid.LeaveDayTypeID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            dataLocal={LeaveDayType.data}
                                            textField="LeaveDayTypeName"
                                            valueField="ID"
                                            filter={true}
                                            refresh={LeaveDayType.refresh}
                                            filterServer={false}
                                            autoFilter={true}
                                            value={LeaveDayType.value}
                                            onFinish={item => this.onChangeLeaveDayType(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Loại ngày nghỉ - TempLeaveDayType - LeaveDayTypeByGrade */}
                            {LeaveDayTypeByGrade.visible && LeaveDayTypeByGrade.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Leaveday_LeaveDayTypeID'}
                                        />

                                        {/* valid TempLeaveDayTypeID */}
                                        {fieldValid.TempLeaveDayTypeID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            disable={TempLeaveDayType.disable}
                                            dataLocal={TempLeaveDayType.data}
                                            textField="LeaveDayTypeName"
                                            valueField="ID"
                                            filter={true}
                                            refresh={TempLeaveDayType.refresh}
                                            filterServer={false}
                                            autoFilter={true}
                                            value={TempLeaveDayType.value}
                                            onFinish={item => this.onChangeTempLeaveDayType(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Thông tin hồ sơ cần nộp -  IsRequiredDocuments*/}
                            {IsRequiredDocuments.visible && IsRequiredDocuments.visibleConfig && (
                                <View style={[contentViewControl, styles.styViewLeaveDayCount]}>
                                    <Text style={[styleSheets.text, styles.styViewLeaveDayCountLable]}>
                                        {`${translate('CatLeaveDayType_RequiredDocuments')} : `}

                                        <VnrText
                                            style={[styleSheets.lable, styles.styViewLeaveDayCountValue]}
                                            value={IsRequiredDocuments.value}
                                        />
                                    </Text>
                                </View>
                            )}

                            {/* xem số ngày/giờ nghỉ*/}
                            {btnComputeRemainDaysPortal.visible && btnComputeRemainDaysPortal.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        {/* <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={"HRM_Attendance_ComputeRemainAnlDays"} /> */}
                                    </View>
                                    <View style={viewControl}>
                                        {/* dayportal */}
                                        {dayportal.visible && (
                                            <View style={styles.viewStyleDayPortal}>
                                                <TouchableOpacity
                                                    onPress={() => this.onPressComputeRemainDaysPortal()}
                                                    style={styles.bntSearchManualLeave}
                                                >
                                                    <VnrText
                                                        style={[
                                                            styleSheets.lable,
                                                            { ...CustomStyleSheet.color(Colors.white), ...CustomStyleSheet.marginRight(10) }
                                                        ]}
                                                        i18nKey={'HRM_Attendance_ComputeRemainAnlDays'}
                                                    />
                                                </TouchableOpacity>
                                                <View style={styles.styleValueManualLeave}>
                                                    <VnrText
                                                        style={[styleSheets.text, { color: Colors.primary }]}
                                                        value={`${dayportal.value
                                                            ? Vnr_Function.mathRoundNumber(dayportal.value)
                                                            : ''
                                                        } `}
                                                    />
                                                    <VnrText
                                                        style={[styleSheets.text, { color: Colors.primary }]}
                                                        i18nKey={'E_IMPORT_FILE_DAY'}
                                                    />
                                                </View>

                                                {leaveDayTypeView &&
                                                    leaveDayTypeView.visible &&
                                                    leaveDayTypeView.visibleConfig && (
                                                    <TouchableOpacity
                                                        onPress={() => this.onPressViewDetailRemain()}
                                                        style={styles.bntMvDetailManualLeave}
                                                    >
                                                        <IconListAlt size={Size.iconSize} color={Colors.gray_10} />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        )}

                                        {/* hoursportal */}
                                        {hoursportal.visible && (
                                            <View style={styles.viewStyleDayPortal}>
                                                <TouchableOpacity
                                                    onPress={() => this.onPressComputeRemainHoursPortal()}
                                                    style={styles.bntSearchManualLeave}
                                                >
                                                    <VnrText
                                                        style={[
                                                            styleSheets.lable,
                                                            { ...CustomStyleSheet.color(Colors.white), ...CustomStyleSheet.marginRight(10) }
                                                        ]}
                                                        i18nKey={'HRM_Attendance_ComputeRemainAnlHours'}
                                                    />
                                                </TouchableOpacity>
                                                <View style={styles.styleValueManualLeave}>
                                                    <VnrText
                                                        style={[styleSheets.text, { color: Colors.primary }]}
                                                        value={`${hoursportal.value
                                                            ? Vnr_Function.mathRoundNumber(hoursportal.value)
                                                            : ''
                                                        } `}
                                                    />
                                                    <VnrText
                                                        style={[styleSheets.text, { color: Colors.primary }]}
                                                        i18nKey={'E_IMPORT_FILE_HOUR'}
                                                    />
                                                </View>

                                                {leaveDayTypeView &&
                                                    leaveDayTypeView.visible &&
                                                    leaveDayTypeView.visibleConfig && (
                                                    <TouchableOpacity
                                                        onPress={() => this.onPressViewDetailRemain()}
                                                        style={styles.bntMvDetailManualLeave}
                                                    >
                                                        <IconListAlt size={Size.iconSize} color={Colors.gray_10} />
                                                    </TouchableOpacity>
                                                )}
                                            </View>
                                        )}
                                    </View>
                                </View>
                            )}

                            {/* loại - DurationType - Div_DurationType1 */}
                            {Div_DurationType1.visible && Div_DurationType1.visibleConfig && (
                                <View>
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={'HRM_Attendance_Leaveday_DurationType'}
                                            />

                                            {/* valid DurationType */}
                                            {fieldValid.DurationType && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPickerQuickly
                                                dataLocal={DurationType.data}
                                                refresh={DurationType.refresh}
                                                textField="Text"
                                                valueField="Value"
                                                filter={false}
                                                value={DurationType.value}
                                                disable={DurationType.disable}
                                                onFinish={item => this.onPickerChangeDurationType(item)}
                                            />
                                        </View>
                                    </View>

                                    {/* DurationTypeDetail */}
                                    {DurationTypeDetail.visible && (
                                        <View>
                                            {/* OtherDurationType */}
                                            {OtherDurationType.visible && (
                                                <View>
                                                    {/* giờ bắt đầu - HoursFrom */}
                                                    {HoursFrom.visible && (
                                                        <View style={contentViewControl}>
                                                            <View style={viewLable}>
                                                                <VnrText
                                                                    style={[styleSheets.text, textLableInfo]}
                                                                    i18nKey={'HRM_Attendance_Overtime_TimeFrom'}
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
                                                                    onFinish={value =>
                                                                        this.onTimeChangeHoursFrom(value)
                                                                    }
                                                                />
                                                            </View>
                                                        </View>
                                                    )}

                                                    {/* số giờ nghỉ chạy theo cấu hình DS số giờ đăng ký nghỉ giữa ca theo từng loại ngày nghỉ - HoursMiddleOfShift - divHoursMiddleOfShift */}
                                                    {divHoursMiddleOfShift.visible && (
                                                        <View style={contentViewControl}>
                                                            <View style={viewLable}>
                                                                <VnrText
                                                                    style={[styleSheets.text, textLableInfo]}
                                                                    i18nKey={'HRM_Attendance_Leaveday_LeaveHours'}
                                                                />

                                                                {/* valid HoursMiddleOfShift */}
                                                                {fieldValid.HoursMiddleOfShift && (
                                                                    <VnrText
                                                                        style={styleValid}
                                                                        i18nKey={'HRM_Valid_Char'}
                                                                    />
                                                                )}
                                                            </View>
                                                            <View style={viewControl}>
                                                                <VnrPicker
                                                                    dataLocal={HoursMiddleOfShift.data}
                                                                    refresh={HoursMiddleOfShift.refresh}
                                                                    textField="Text"
                                                                    valueField="Value"
                                                                    filter={false}
                                                                    value={HoursMiddleOfShift.value}
                                                                    disable={HoursMiddleOfShift.disable}
                                                                    onFinish={item =>
                                                                        this.onPickerChangeHoursMiddleOfShift(item)
                                                                    }
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
                                                                    i18nKey={'HRM_Attendance_Overtime_TimeTo'}
                                                                />

                                                                {/* valid HoursTo */}
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
                                                                    onFinish={value => this.onTimeChangeHoursTo(value)}
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
                                                                    i18nKey={'HRM_Attendance_Leaveday_LeaveHoursDetail'}
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
                                                                    onFinish={item => this.ChangeLeaveHoursDetail(item)}
                                                                />
                                                            </View>
                                                        </View>
                                                    )}

                                                    {/* số giờ nghỉ chạy mặc định - LeaveHours - divLeaveHours */}
                                                    {divLeaveHours.visible && (
                                                        <View style={[contentViewControl, styles.styViewLeaveDayCount]}>
                                                            <Text
                                                                style={[
                                                                    styleSheets.text,
                                                                    styles.styViewLeaveDayCountLable
                                                                ]}
                                                            >
                                                                {`${translate(
                                                                    'HRM_Attendance_Leaveday_LeaveHours'
                                                                )} : `}
                                                            </Text>
                                                            <VnrText
                                                                style={[
                                                                    styleSheets.lable,
                                                                    styles.styViewLeaveDayCountValue
                                                                ]}
                                                                value={LeaveHours.value}
                                                            />
                                                        </View>

                                                    // <View style={contentViewControl}>
                                                    //     <View style={viewLable} >
                                                    //         <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={"HRM_Attendance_Leaveday_LeaveHours"} />

                                                    //         {/* valid LeaveHours */}
                                                    //         {
                                                    //             fieldValid.LeaveHours && <VnrText style={styleValid} i18nKey={"HRM_Valid_Char"} />
                                                    //         }
                                                    //     </View>
                                                    //     <View style={viewControl}>
                                                    //         <VnrText style={[styleSheets.text, textLableInfo]}
                                                    //             value={LeaveHours.value} />
                                                    //     </View>
                                                    // </View>
                                                    )}
                                                </View>
                                            )}

                                            {/* DurationTypeFullShift */}
                                            {DurationTypeFullShift.visible && (
                                                <View>
                                                    {/* LeaveDays */}
                                                    <View style={[contentViewControl, styles.styViewLeaveDayCount]}>
                                                        <Text
                                                            style={[styleSheets.text, styles.styViewLeaveDayCountLable]}
                                                        >
                                                            {`${translate('HRM_Attendance_Leaveday_TotalLeave')} : `}
                                                        </Text>
                                                        <VnrText
                                                            style={[
                                                                styleSheets.lable,
                                                                styles.styViewLeaveDayCountValue
                                                            ]}
                                                            value={LeaveDays.value}
                                                        />
                                                    </View>
                                                    {/* <View style={contentViewControl}>
                                                                        <View style={viewLable} >
                                                                            <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={"HRM_Attendance_Leaveday_TotalLeave"} />

                                                                            {
                                                                                fieldValid.LeaveDays && <VnrText style={styleValid} i18nKey={"HRM_Valid_Char"} />
                                                                            }
                                                                        </View>
                                                                        <View style={viewControl}>
                                                                            <VnrText style={[styleSheets.text, textLableInfo]}
                                                                                value={LeaveDays.value} />
                                                                        </View>
                                                                    </View> */}
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </View>
                            )}

                            {/* loại - TypeHalfShift - Div_TypeHalfShift1 */}
                            {Div_TypeHalfShift1.visible && Div_TypeHalfShift1.visibleConfig && (
                                <View>
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={'HRM_Attendance_Leaveday_TypeHalfShift'}
                                            />

                                            {/* valid TypeHalfShift */}
                                            {fieldValid.TypeHalfShift && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPickerQuickly
                                                dataLocal={TypeHalfShift.data}
                                                refresh={TypeHalfShift.refresh}
                                                textField="Text"
                                                valueField="Value"
                                                filter={false}
                                                value={TypeHalfShift.value}
                                                disable={TypeHalfShift.disable}
                                                onFinish={item => this.onPickerChangeTypeHalfShift(item)}
                                            />
                                        </View>

                                        {/* divTypeHalfShiftContent */}
                                        {divTypeHalfShiftContent.visible && (
                                            <View>
                                                {/* divTypeHalfShiftLeaveDay - TypeHalfShiftLeaveDays */}
                                                {divTypeHalfShiftLeaveDay.visible && (
                                                    <View>
                                                        <View style={[contentViewControl, styles.styViewLeaveDayCount]}>
                                                            <Text
                                                                style={[
                                                                    styleSheets.text,
                                                                    styles.styViewLeaveDayCountLable
                                                                ]}
                                                            >
                                                                {`${translate(
                                                                    'HRM_Attendance_Leaveday_TotalLeave'
                                                                )} : `}
                                                            </Text>
                                                            <VnrText
                                                                style={[
                                                                    styleSheets.lable,
                                                                    styles.styViewLeaveDayCountValue
                                                                ]}
                                                                value={TypeHalfShiftLeaveDays.value}
                                                            />
                                                        </View>

                                                        {/* <View style={contentViewControl}>
                                                                            <View style={viewLable} >
                                                                                <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={"HRM_Attendance_Leaveday_TotalLeave"} />

                                                                                {
                                                                                    fieldValid.TypeHalfShiftLeaveDays && <VnrText style={styleValid} i18nKey={"HRM_Valid_Char"} />
                                                                                }
                                                                            </View>
                                                                            <View style={viewControl}>
                                                                                <VnrText style={[styleSheets.text, textLableInfo]}
                                                                                    value={TypeHalfShiftLeaveDays.value} />
                                                                            </View>
                                                                        </View> */}
                                                    </View>
                                                )}

                                                {/* divTypeHalfShiftLeaveHours - TypeHalfShiftLeaveHours */}
                                                {divTypeHalfShiftLeaveHours.visible && (
                                                    <View>
                                                        <View style={[contentViewControl, styles.styViewLeaveDayCount]}>
                                                            <Text
                                                                style={[
                                                                    styleSheets.text,
                                                                    styles.styViewLeaveDayCountLable
                                                                ]}
                                                            >
                                                                {`${translate('HRM_Attendance_Leaveday_Duration')} : `}
                                                            </Text>
                                                            <VnrText
                                                                style={[
                                                                    styleSheets.lable,
                                                                    styles.styViewLeaveDayCountValue
                                                                ]}
                                                                value={TypeHalfShiftLeaveHours.value}
                                                            />
                                                        </View>

                                                        {/* <View style={contentViewControl}>
                                                                            <View style={viewLable} >
                                                                                <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={"HRM_Attendance_Leaveday_Duration"} />

                                                                                {
                                                                                    fieldValid.TypeHalfShiftLeaveHours && <VnrText style={styleValid} i18nKey={"HRM_Valid_Char"} />
                                                                                }
                                                                            </View>
                                                                            <View style={viewControl}>
                                                                                <VnrText style={[styleSheets.text, textLableInfo]}
                                                                                    value={TypeHalfShiftLeaveHours.value} />
                                                                            </View>
                                                                        </View> */}
                                                    </View>
                                                )}
                                            </View>
                                        )}
                                    </View>

                                    {/* divMiddleShiftMoreDay - Ngày nghỉ liên lục loại giữa ca*/}
                                    {(divMiddleShiftMoreDay.visible || divFirstLastShiftMoreDay.visible) && (
                                        <View style={styles.styViewHalfShift}>{this.renderShift()}</View>
                                    )}

                                    {/* divFullShiftMoreDay - Ngày nghỉ liên lục loại Toàn ca*/}
                                    {divFullShiftMoreDay.visible && (
                                        <View style={styles.styViewHalfShift}>{this.renderFullShift()}</View>
                                    )}
                                </View>
                            )}

                            {/* ca làm việc - ShiftID - divShift */}
                            {divShift.visible && divShift.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Category_Shift_ShiftName'}
                                        />

                                        {/* valid ShiftID */}
                                        {fieldValid.ShiftID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            dataLocal={Shift.data}
                                            refresh={Shift.refresh}
                                            textField="ShiftName"
                                            valueField="ID"
                                            filter={true}
                                            value={Shift.value}
                                            filterServer={false}
                                            autoFilter={true}
                                            filterParams="text"
                                            disable={Shift.disable}
                                            onFinish={item => this.onPickerChangeShift(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* duyệt đầu */}
                            {UserApprove.visible && UserApprove.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Leaveday_UserApproveID'}
                                        />

                                        {/* valid UserApproveID */}
                                        {fieldValid.UserApproveID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_LEAVE_DAY',
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

                            {/* duyệt giữa */}
                            {UserApprove3.visible && UserApprove3.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Leaveday_UserApproveID3'}
                                        />

                                        {/* valid UserApproveID3 */}
                                        {fieldValid.UserApproveID3 && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_LEAVE_DAY',
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

                            {/* duyệt tiếp theo */}
                            {UserApprove4.visible && UserApprove4.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Leaveday_UserApproveID4'}
                                        />

                                        {/* valid UserApproveID4 */}
                                        {fieldValid.UserApproveID4 && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_LEAVE_DAY',
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

                            {/* duyệt cuối */}
                            {UserApprove2.visible && UserApprove2.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Leaveday_UserApproveID2'}
                                        />

                                        {/* valid UserApproveID2 */}
                                        {fieldValid.UserApproveID2 && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_LEAVE_DAY',
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

                            {/* ghi chú - divComment*/}
                            {divComment.visible && divComment.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Leaveday_CommentReson'}
                                        />

                                        {/* valid Comment */}
                                        {fieldValid.Comment && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={CommentLD.disable}
                                            refresh={CommentLD.refresh}
                                            value={CommentLD.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    divComment: {
                                                        ...divComment,
                                                        CommentLD: {
                                                            ...CommentLD,
                                                            value: text
                                                        }
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Nơi gửi đến - PlaceSendToID*/}
                            {PlaceSendToID.visible && PlaceSendToID.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_SendTo'}
                                        />

                                        {/* valid PlaceSendToID */}
                                        {fieldValid.PlaceSendToID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerQuickly
                                            api={{
                                                urlApi: '[URI_HR]/Att_GetData/GetMultiWorkPlaceForAtt',
                                                type: 'E_GET'
                                            }}
                                            //dataLocal={PlaceSendToID.data}
                                            refresh={PlaceSendToID.refresh}
                                            autoBind={true}
                                            textField="WorkPlaceCodeName"
                                            valueField="ID"
                                            filter={false}
                                            value={PlaceSendToID.value}
                                            disable={PlaceSendToID.disable}
                                            onFinish={item => {
                                                this.setState({
                                                    PlaceSendToID: {
                                                        ...PlaceSendToID,
                                                        value: item
                                                    }
                                                });
                                            }}
                                        />

                                        {/* <VnrTextInput
                                                    disable={PlaceSendToID.disable}
                                                    refresh={PlaceSendToID.refresh}
                                                    value={PlaceSendToID.value}
                                                    onChangeText={(text) => this.setState({
                                                        PlaceSendToID: {
                                                            ...PlaceSendToID,
                                                            PlaceSendToID: {
                                                                ...PlaceSendToID,
                                                                value: text
                                                            }
                                                        }
                                                    })}
                                                /> */}
                                    </View>
                                </View>
                            )}

                            {/* Nơi liên hệ và nội dung công tác - divBusinessReason*/}
                            {divBusinessReason.visible && divBusinessReason.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Leaveday_BusinessReason'}
                                        />

                                        {/* valid BusinessReason */}
                                        {fieldValid.BusinessReason && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={BusinessReason.disable}
                                            refresh={BusinessReason.refresh}
                                            value={BusinessReason.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    divBusinessReason: {
                                                        ...divBusinessReason,
                                                        BusinessReason: {
                                                            ...BusinessReason,
                                                            value: text
                                                        }
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Quá trình thai sản - PregnancyCycleID*/}
                            {PregnancyCycleID.visible && PregnancyCycleID.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={PregnancyCycleID.lable}
                                        />

                                        {/* valid PregnancyCycleID */}
                                        {fieldValid.PregnancyCycleID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerQuickly
                                            dataLocal={PregnancyCycleID.data}
                                            refresh={PregnancyCycleID.refresh}
                                            textField="PregnancyCycleName"
                                            valueField="ID"
                                            filter={true}
                                            filterServer={false}
                                            filterParams={'PregnancyCycleName'}
                                            value={PregnancyCycleID.value}
                                            disable={PregnancyCycleID.disable}
                                            onFinish={item => {
                                                this.setState({
                                                    PregnancyCycleID: {
                                                        ...PregnancyCycleID,
                                                        value: item,
                                                        refresh: !PregnancyCycleID.refresh
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Chứng từ đính kèm - FileAttach */}
                            {FileAttach.visible && FileAttach.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Leaveday_FileAttach'}
                                        />
                                    </View>
                                    <View style={viewControl}>
                                        <VnrAttachFile
                                            refresh={FileAttach.refresh}
                                            disable={FileAttach.disable}
                                            multiFile={true}
                                            value={FileAttach.value}
                                            uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                            onFinish={file =>
                                                this.setState({
                                                    FileAttach: {
                                                        ...FileAttach,
                                                        value: file
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Tập tin đính kèm - FileAttachment - FileAttachment */}
                            {FileAttachment.visible && FileAttachment.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Rec_JobVacancy_FileAttachment'}
                                        />
                                    </View>
                                    <View style={viewControl}>
                                        <VnrAttachFile
                                            refresh={FileAttachment.refresh}
                                            disable={FileAttachment.disable}
                                            multiFile={true}
                                            value={FileAttachment.value}
                                            uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                            onFinish={file =>
                                                this.setState({
                                                    FileAttachment: {
                                                        ...FileAttachment,
                                                        value: file,
                                                        refresh: !FileAttachment.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}
                        </KeyboardAwareScrollView>
                    )}
                    {this.isRegisterHelp != null && <ListButtonSave listActions={listActions} />}

                    {modalErrorDetail.isModalVisible && (
                        <Modal
                            onBackButtonPress={() => this.closeModalErrorDetail()}
                            isVisible={true}
                            onBackdropPress={() => this.closeModalErrorDetail()}
                            customBackdrop={
                                <TouchableWithoutFeedback onPress={() => this.closeModalErrorDetail()}>
                                    <View
                                        style={styles.coating}
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
                                    <ScrollView style={styles.wrapRenderError}>
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

                    <Modal
                        onBackButtonPress={() => this.closeModalAnnualDetail()}
                        isVisible={dataAnnualDetail.modalVisibleAnnualDetail}
                        onBackdropPress={() => this.closeModalAnnualDetail()}
                        customBackdrop={
                            <TouchableWithoutFeedback onPress={() => this.closeModalAnnualDetail()}>
                                <View
                                    style={styles.coating}
                                />
                            </TouchableWithoutFeedback>
                        }
                        style={CustomStyleSheet.margin(0)}
                    >
                        <View
                            style={[
                                stylesModalPopupBottom.viewModalTime,
                                {
                                    height: Size.deviceheight * 0.7
                                }
                            ]}
                        >
                            <SafeAreaView {...styleSafeAreaView} style={stylesModalPopupBottom.safeRadius}>
                                {this.viewListItemAnnualDetailTime()}
                            </SafeAreaView>
                        </View>
                    </Modal>
                </View>
            </SafeAreaView>
        );
    }
}

const WIDTH_ITEM = Size.deviceWidth - Size.defineSpace * 2;
const styles = StyleSheet.create({
    headerCloseModal: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    headerCloseModalText: {
        fontSize: Size.text + 1
    },
    viewStyleDayPortal: {
        flex: 1,
        flexDirection: 'row',
        alignContent: 'space-between',
        justifyContent: 'center'
    },
    bntSearchManualLeave: {
        flexDirection: 'row',
        backgroundColor: Colors.primary,
        borderRadius: 5,
        alignItems: 'center',
        paddingHorizontal: Size.defineHalfSpace,
        paddingVertical: 10,
        marginRight: Size.defineHalfSpace
    },
    styleValueManualLeave: {
        flexDirection: 'row',
        alignContent: 'flex-end',
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 10,
        borderColor: Colors.gray_5,
        borderWidth: 0.5,
        flex: 1,
        borderRadius: 5
    },
    bntMvDetailManualLeave: {
        flexDirection: 'row',
        borderRadius: 5,
        alignItems: 'center',
        paddingHorizontal: Size.defineHalfSpace,
        paddingVertical: 10,
        marginLeft: Size.defineHalfSpace,
        borderColor: Colors.gray_5,
        borderWidth: 0.5
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
    styViewHalfShift: {
        flex: 1,
        backgroundColor: Colors.gray_2,
        paddingHorizontal: Size.defineSpace,
        paddingBottom: Size.defineHalfSpace
    },
    styViewHalfShift_Item: {
        marginTop: Size.defineHalfSpace
    },
    styControlHalf: {
        flexDirection: 'row'
    },
    styControlHalfDateEnd: {
        marginHorizontal: Size.defineHalfSpace,
        flex: 1
    },
    styTitleHalf: {
        flexDirection: 'row',
        marginBottom: 3
    },
    styControlHalfIcon: {
        justifyContent: 'center'
    },
    styTitleHalf_text: {
        fontWeight: '600',
        fontSize: Size.text + 1
    },
    styViewLeaveDayCount: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: -10
    },
    styViewLeaveDayCountLable: {
        color: Colors.gray_9,
        fontSize: Size.text - 3
    },
    styViewLeaveDayCountValue: {
        fontWeight: '600',
        color: Colors.primary,
        fontSize: Size.text - 2
    },
    // ---------------- //
    styContent: {
        backgroundColor: Colors.white,
        paddingHorizontal: Size.defineSpace
    },
    styItem: {
        flexDirection: 'row',
        paddingVertical: 15,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        marginBottom: 0.5,

        justifyContent: 'space-between'
    },
    styIcon: bgIcon => {
        return {
            backgroundColor: bgIcon,
            paddingHorizontal: 4,
            paddingVertical: 4,
            borderRadius: 7
        };
    },
    styItemIcon: {
        width: WIDTH_ITEM * 0.1,
        height: WIDTH_ITEM * 0.1
    },
    styViewInfoPri: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center'
    },
    styContentHeader: {
        flexDirection: 'row',
        paddingHorizontal: Size.defineSpace,
        paddingBottom: Size.defineHalfSpace
    },
    styInfoTitle: {
        fontSize: Size.text - 1,
        fontWeight: Platform.OS == 'android' ? '600' : '500'
    },
    styLeaveDayHours: {
        color: Colors.gray_8,
        fontSize: Size.text - 1,
        marginRight: Size.defineSpace
    },
    styViewLeave: {
        alignItems: 'flex-start',
        marginLeft: Size.defineSpace
    },
    // ---------------- //

    // View Error Messages
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
    fontText: {
        fontSize: Size.text - 1
    },
    viewInfo: {
        flex: 1
    },
    Line: {
        flex: 1,
        flexDirection: 'row',
        maxWidth: '100%',
        marginVertical: 2
    },
    styleViewBorderButtom: {
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.borderColor,
        flex: 1,
        marginBottom: 0.5,
        marginHorizontal: 10,
        paddingVertical: 10
    },
    wrapTitleGroup: {
        marginHorizontal: 0,
        paddingBottom: 5,
        marginBottom: 10
    },
    txtTitleGroup: { fontWeight: '500', color: Colors.primary },
    coating: {
        flex: 1,
        backgroundColor: Colors.black,
        opacity: 0.5
    },
    wrapRenderError: { flexGrow: 1, flexDirection: 'column' }
});
