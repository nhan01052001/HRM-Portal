/* eslint-disable no-undef */
import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, Platform } from 'react-native';
import Modal from 'react-native-modal';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Size,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleScreenDetail,
    stylesModalPopupBottom,
    styleValid,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { IconPublish, IconColse } from '../../../../../constants/Icons';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import Icon from 'react-native-vector-icons/Ionicons';
import HttpService from '../../../../../utils/HttpService';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import VnrPickerMulti from '../../../../../components/VnrPickerMulti/VnrPickerMulti';
import VnrTreeView from '../../../../../components/VnrTreeView/VnrTreeView';
import moment from 'moment';
import RadioForm from 'react-native-simple-radio-button';
import CheckBox from 'react-native-check-box';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { translate } from '../../../../../i18n/translate';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import { EnumName, EnumIcon } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../utils/DrawerServices';
import RenderItemDataAnalysic from './RenderItemDataAnalysic';
import { ModalCheckEmpsSevices } from '../../../../../components/modal/ModalCheckEmps';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';

let enumName = null,
    profileInfo = null;

const initSateDefault = {
    modalLimit: {
        isModalVisible: false,
        data: []
    },
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
    WorkDate: {
        value: null,
        refresh: false,
        disable: false
    },
    IsGetShiftByProfile: {
        visible: true,
        visibleConfig: false,
        refresh: false,
        value: false,
        disable: false
    },
    divShiftID: {
        visible: true,
        visibleConfig: true,
        ShiftID: {
            disable: false,
            refresh: false,
            value: null,
            data: []
        }
    },
    divTempShiftID: {
        visible: false,
        visibleConfig: true,
        TempShiftID: {
            disable: false,
            refresh: false,
            value: null,
            data: []
        }
    },
    removeDurationType: {
        visible: true,
        visibleConfig: true,
        DurationType: {
            disable: false,
            refresh: false,
            value: null,
            data: []
        }
    },
    IsOverTimeBreak: {
        visible: true,
        visibleConfig: true,
        refresh: false,
        value: false,
        disable: false
    },
    // task: 0163864
    IsBreakAsWork: {
        visible: true,
        visibleConfig: true,
        refresh: false,
        value: false,
        disable: false
    },
    divOvertimeTypeID: {
        visible: true,
        visibleConfig: true,
        OvertimeTypeID: {
            disable: false,
            refresh: false,
            value: null
        }
    },
    checkShiftByProfile: {
        visible: true,
        visibleConfig: true,
        WorkDateIn: {
            value: null,
            refresh: false,
            disable: false
        },
        WorkDateOut: {
            value: null,
            refresh: false,
            disable: false
        }
    },
    eleRegisterHours: {
        visible: true,
        visibleConfig: true,
        RegisterHours: {
            disable: false,
            refresh: false,
            value: null
        }
    },
    eleRegisterHoursConfig: {
        visible: false,
        visibleConfig: true,
        RegisterHoursConfig: {
            disable: false,
            refresh: false,
            value: null,
            data: []
        }
    },
    IsNotCheckInOut: {
        visible: true,
        visibleConfig: true,
        refresh: false,
        value: false,
        disable: false
    },
    MethodPayment: {
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
        visible: true,
        visibleConfig: true,
        disable: false,
        value: '',
        refresh: false
    },
    FileAttach: {
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
    divIsRegistedFood: {
        visible: false,
        visibleConfig: true,
        IsMealRegistration: {
            value: false,
            refresh: false,
            MenuID: {
                disable: false,
                refresh: false,
                value: null
            },
            FoodID: {
                disable: false,
                refresh: false,
                value: null
            },
            Menu2ID: {
                disable: false,
                refresh: false,
                value: null
            },
            Food2ID: {
                disable: false,
                refresh: false,
                value: null
            }
        },
        IsCarRegistration: {
            value: false,
            refresh: false,
            OvertimePlaceID: {
                disable: false,
                refresh: false,
                value: null
            }
        }
    },
    currDataAnalysic: [],
    isVisibleAnalysic: false,
    fieldValid: {}
};

export default class AttSubmitOvertimeAddOrEdit extends Component {
    constructor(props) {
        super(props);
        this.state = initSateDefault;
        // khai báo các biến this trong hàm setVariable
        this.setVariable();

        props.navigation.setParams({
            title: props.navigation.state.params.record
                ? 'HRM_Category_ShiftItem_Overtime_Update_Title'
                : 'HRM_Category_ShiftItem_Overtime_Create_Title'
        });
    }

    setVariable = () => {
        this.isRegisterHelp = null;
        this.isModify = null;
        this.hasChange = false;
        this.isChangeLevelApprove = false;
        this.isRegisterOrgOvertimeExcept = false;
        this.isRegisterOrgOvertime = false;
        this.levelApproveOT = 2;
        this.levelApprove = 2;
        this.configLevelApprove = null;
        this._IsLoadShift = false;
        this.allowOvertimeType = null;
        this.GlobalDataSource = [];
        this.IsFirstEvenDataBound = true;

        //xử lý set DateStart khi tạo mới từ màn hình Ngày công (WorkDay)
        //biến check load xong hàm getConfig và GetHighSupervior
        //dùng để call hàm onChangeDateStart khi 2 hàm trên chạy xong
        this.isDoneInit = null;

        //check processing cho nhấn phân tích lưu nhiều lần
        this.isProcessingAnalysic = false;

        //check processing cho nhấn lưu nhiều lần
        this.isProcessingSave = false;

        this.paramsExtend = {
            Is12Hour: null,
            IsConfirm12Hour: null
        };
    };

    //#region [khởi tạo - check đăng ký hộ, lấy các dữ liệu cho control, lấy giá trị mặc đinh]
    refreshView = () => {
        this.props.navigation.setParams({ title: 'HRM_Category_ShiftItem_Overtime_Create_Title' });
        this.setVariable();

        // Lỗi lưu và tạo mới tại màn hình DS Kế hoạch tăng ca
        const { FileAttach } = this.state;
        let resetState = {
            ...initSateDefault,
            FileAttach: {
                ...initSateDefault.FileAttach,
                refresh: !FileAttach.refresh
            }
        };

        this.setState(resetState, () => this.getConfigValid('New_Portal_Att_Overtime', true));
    };
    //promise get config valid
    getConfigValid = (tblName, isRefresh) => {
        VnrLoadingSevices.show();
        HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName).then(res => {
            if (res) {
                try {
                    //map field hidden by config
                    const _configField =
                        ConfigField && ConfigField.value['AttSubmitOvertimeAddOrEdit']
                            ? ConfigField.value['AttSubmitOvertimeAddOrEdit']['Hidden']
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
                        //tạo mới
                        if (!record) {
                            VnrLoadingSevices.show();
                            this.isModify = false;
                            this.isRegisterHelp = false;
                            this.initData();
                        }
                        //chỉnh sửa
                        else {
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
        this.getConfigValid('New_Portal_Att_Overtime');
    }

    handleSetState = (_id, res, objRecord) => {
        const response = objRecord,
            getOvertimeDurationTypeByDate = res[0],
            getOvertimeTypeByDate = res[1],
            getAllowOvertimeType = res[2],
            getConfigElementLISTREGISTERHOURS = res[3],
            getMethodPayment = res[4],
            getMultiDurationType = res[5],
            getConfigElementLEAVE_APPROVE_OVERTIME = res[6],
            getMultiShift = res[7],
            getConfigAproveOverTime = res[8],
            isChangeLevelAprpovedOvertime = res[9],
            getJobType = res[10],
            getMultiJobTypeByCodeName = res[11],
            dataProfileHireJob = res[12],
            getCommentWhenEdit = res[13],
            {
                UserApprove,
                UserApprove3,
                UserApprove4,
                UserApprove2,
                UserComment1,
                UserComment2,
                UserComment3,
                UserComment4,
                WorkDate,
                divShiftID,
                removeDurationType,
                divOvertimeTypeID,
                checkShiftByProfile,
                eleRegisterHours,
                eleRegisterHoursConfig,
                MethodPayment,
                ReasonOT,
                Profile,
                IsGetShiftByProfile,
                IsOverTimeBreak,
                IsNotCheckInOut,
                JobTypeID,
                divIsRegistedFood,
                IsBreakAsWork
            } = this.state,
            { ShiftID } = divShiftID,
            { DurationType } = removeDurationType,
            { OvertimeTypeID } = divOvertimeTypeID,
            { WorkDateIn, WorkDateOut } = checkShiftByProfile,
            { RegisterHoursConfig } = eleRegisterHoursConfig,
            { RegisterHours } = eleRegisterHours,
            { IsMealRegistration, IsCarRegistration } = divIsRegistedFood,
            { Menu2ID, MenuID, FoodID, Food2ID } = IsMealRegistration,
            { OvertimePlaceID } = IsCarRegistration;

        this.configLevelApprove = getConfigElementLEAVE_APPROVE_OVERTIME;
        this.isRegisterHelp = false;

        let dataSourceDuration = [],
            findDurationType = null;

        if (getOvertimeDurationTypeByDate && Array.isArray(getOvertimeDurationTypeByDate)) {
            dataSourceDuration = getOvertimeDurationTypeByDate.map(item => {
                return { Text: item['Translate'], Value: item['Name'] };
            });
        } else if (getMultiDurationType && Array.isArray(getMultiDurationType)) {
            dataSourceDuration = [...getMultiDurationType];
        }

        if (response['DurationType']) {
            findDurationType = dataSourceDuration.find(item => item.Value == response['DurationType']);
            if (!findDurationType) {
                findDurationType = {
                    Value: response['DurationType'],
                    Text: response['DurationType']
                };
            }
        }

        let dataSourceMethodPayment = [],
            findMethodPayment = null;

        if (getOvertimeTypeByDate) {
            if (getOvertimeTypeByDate[1] && Array.isArray(getOvertimeTypeByDate[1])) {
                dataSourceMethodPayment = [...getOvertimeTypeByDate[1]];
            } else if (getMethodPayment && Array.isArray(getMethodPayment)) {
                dataSourceMethodPayment = [...getMethodPayment];
            }
        } else if (getMethodPayment && Array.isArray(getMethodPayment)) {
            dataSourceMethodPayment = [...getMethodPayment];
        }

        if (response['MethodPayment']) {
            findMethodPayment = dataSourceMethodPayment.find(item => item.Value == response['MethodPayment']);
            if (!findMethodPayment) {
                findMethodPayment = {
                    Value: response['MethodPayment'],
                    Text: response['MethodPayment']
                };
            }
        }

        let dataSourceJobType = [],
            findJobType = null;

        if (getJobType && Array.isArray(getJobType)) {
            dataSourceJobType = [...getJobType];
        } else if (getMultiJobTypeByCodeName && Array.isArray(getMultiJobTypeByCodeName)) {
            dataSourceJobType = [...getMultiJobTypeByCodeName];
        }

        if (response['JobTypeID']) {
            findJobType = dataSourceJobType.find(item => item.ID == response['JobTypeID']);
            if (!findJobType) {
                findJobType = {
                    ID: response['JobTypeID'],
                    JobTypeName: response['JobTypeID']
                };
            }
        }

        let dataSourceShift = [];
        if (getMultiShift && Array.isArray(getMultiShift)) {
            dataSourceShift = [...getMultiShift];
        }

        let nextState = {
            ID: _id,
            IsGetShiftByProfile: {
                ...IsGetShiftByProfile,
                visible: false,
                visibleConfig: false
            },
            divShiftID: {
                ...divShiftID,
                ShiftID: {
                    ...ShiftID,
                    data: dataSourceShift,
                    value: response['ShiftID'] ? { ID: response['ShiftID'], ShiftName: response['ShiftName'] } : null,
                    disable: true,
                    refresh: !ShiftID.refresh
                }
            },
            JobTypeID: {
                ...JobTypeID,
                data: dataSourceJobType,
                value: findJobType,
                refresh: !JobTypeID.refresh
            },
            WorkDate: {
                ...WorkDate,
                disable: true,
                refresh: !WorkDate.refresh,
                value: response['WorkDate']
            },
            removeDurationType: {
                ...removeDurationType,
                DurationType: {
                    ...DurationType,
                    data: dataSourceDuration,
                    value: findDurationType,
                    refresh: !DurationType.refresh
                }
            },
            MethodPayment: {
                ...MethodPayment,
                data: dataSourceMethodPayment,
                value: findMethodPayment,
                refresh: !MethodPayment.refresh
            },
            divIsRegistedFood: {
                ...divIsRegistedFood,
                IsMealRegistration: {
                    ...IsMealRegistration,
                    MenuID: {
                        ...MenuID,
                        value: response['MenuID'] ? { ID: response['MenuID'], MenuName: response['MenuName'] } : null,
                        refresh: !MenuID.refresh
                    },
                    Menu2ID: {
                        ...Menu2ID,
                        value: response['Menu2ID']
                            ? { ID: response['Menu2ID'], MenuName: response['MenuName2'] }
                            : null,
                        refresh: !Menu2ID.refresh
                    },
                    FoodID: {
                        ...FoodID,
                        value: response['FoodID'] ? { ID: response['FoodID'], FoodName: response['FoodName'] } : null,
                        refresh: !FoodID.refresh
                    },
                    Food2ID: {
                        ...Food2ID,
                        value: response['Food2ID']
                            ? { ID: response['Food2ID'], FoodName: response['FoodName2'] }
                            : null,
                        refresh: !Food2ID.refresh
                    }
                },
                IsCarRegistration: {
                    ...IsCarRegistration,
                    OvertimePlaceID: {
                        ...OvertimePlaceID,
                        value: response['OvertimePlaceID']
                            ? {
                                ID: response['OvertimePlaceID'],
                                WorkPlaceName: response['OvertimePlaceName']
                            }
                            : null,
                        refresh: !OvertimePlaceID.refresh
                    }
                }
            }
        };

        if (getAllowOvertimeType != true) {
            nextState = {
                ...nextState,
                divOvertimeTypeID: {
                    ...divOvertimeTypeID,
                    visible: false,
                    OvertimeTypeID: {
                        ...OvertimeTypeID,
                        value: response['OvertimeTypeID']
                            ? {
                                ID: response['OvertimeTypeID'],
                                OvertimeTypeName: response['OvertimeTypeName']
                            }
                            : null,
                        refresh: !OvertimeTypeID.refresh
                    }
                }
            };
        } else {
            nextState = {
                ...nextState,
                divOvertimeTypeID: {
                    ...divOvertimeTypeID,
                    OvertimeTypeID: {
                        ...OvertimeTypeID,
                        value: response['OvertimeTypeID']
                            ? {
                                ID: response['OvertimeTypeID'],
                                OvertimeTypeName: response['OvertimeTypeName']
                            }
                            : null,
                        refresh: !OvertimeTypeID.refresh
                    }
                }
            };
        }

        if (
            getConfigElementLISTREGISTERHOURS &&
            getConfigElementLISTREGISTERHOURS.Value1 &&
            getConfigElementLISTREGISTERHOURS.Value1 !== ''
        ) {
            let data = [],
                findRegisterHoursConfig = null,
                strRegistHours = getConfigElementLISTREGISTERHOURS.Value1.split(',');
            for (let i = 0; i < strRegistHours.length; i++) {
                data.push({ Text: strRegistHours[i], Value: strRegistHours[i] });
            }

            if (response['RegisterHours']) {
                findRegisterHoursConfig = {
                    Value: response['RegisterHours'],
                    Text: response['RegisterHours']
                };
            }

            nextState = {
                ...nextState,
                eleRegisterHours: {
                    ...eleRegisterHours,
                    visible: false
                },
                eleRegisterHoursConfig: {
                    ...eleRegisterHoursConfig,
                    visible: true,
                    RegisterHoursConfig: {
                        ...RegisterHoursConfig,
                        data: [...data],
                        value: findRegisterHoursConfig,
                        refresh: !RegisterHoursConfig.refresh
                    }
                },
                checkShiftByProfile: {
                    ...checkShiftByProfile,
                    WorkDateIn: {
                        ...WorkDateIn,
                        disable: true,
                        refresh: !WorkDateIn.refresh
                    },
                    WorkDateOut: {
                        ...WorkDateOut,
                        disable: true,
                        refresh: !WorkDateOut.refresh
                    }
                }
            };
        } else {
            nextState = {
                ...nextState,
                eleRegisterHoursConfig: {
                    ...eleRegisterHoursConfig,
                    visible: false
                },
                eleRegisterHours: {
                    ...eleRegisterHours,
                    visible: true
                }
            };
        }

        //set value cho UserApprove
        nextState = {
            ...nextState,
            UserApprove: {
                ...UserApprove,
                refresh: !UserApprove.refresh,
                value: response['UserApproveID']
                    ? {
                        UserInfoName: response['UserApproveName1'],
                        ID: response['UserApproveID']
                    }
                    : null
            },
            UserApprove3: {
                ...UserApprove3,
                refresh: !UserApprove3.refresh,
                visible: false,
                value: response['UserApproveID3']
                    ? {
                        UserInfoName: response['UserApproveName3'],
                        ID: response['UserApproveID3']
                    }
                    : null
            },
            UserApprove4: {
                ...UserApprove4,
                visible: false,
                refresh: !UserApprove4.refresh,
                value: response['UserApproveID4']
                    ? {
                        UserInfoName: response['UserApproveName4'],
                        ID: response['UserApproveID4']
                    }
                    : null
            },
            UserApprove2: {
                ...UserApprove2,
                refresh: !UserApprove2.refresh,
                value: response['UserApproveID2']
                    ? {
                        UserInfoName: response['UserApproveName2'],
                        ID: response['UserApproveID2']
                    }
                    : null
            }
        };

        if (getConfigAproveOverTime) {
            if (getConfigAproveOverTime == 2) {
                nextState = {
                    ...nextState,
                    UserApprove3: {
                        ...UserApprove3,
                        visible: false,
                        refresh: !UserApprove3.refresh,
                        value: response['UserApproveID3']
                            ? {
                                UserInfoName: response['UserApproveName3'],
                                ID: response['UserApproveID3']
                            }
                            : null
                    },
                    UserApprove4: {
                        ...UserApprove4,
                        visible: false,
                        refresh: !UserApprove4.refresh,
                        value: response['UserApproveID4']
                            ? {
                                UserInfoName: response['UserApproveName4'],
                                ID: response['UserApproveID4']
                            }
                            : null
                    }
                };
            } else if (getConfigAproveOverTime == 3) {
                this.levelApproveOT = 3;
                nextState = {
                    ...nextState,
                    UserApprove3: {
                        ...UserApprove3,
                        visible: true,
                        refresh: !UserApprove3.refresh,
                        value: response['UserApproveID3']
                            ? {
                                UserInfoName: response['UserApproveName3'],
                                ID: response['UserApproveID3']
                            }
                            : null
                    },
                    UserApprove4: {
                        ...UserApprove4,
                        visible: false,
                        refresh: !UserApprove4.refresh,
                        value: response['UserApproveID4']
                            ? {
                                UserInfoName: response['UserApproveName4'],
                                ID: response['UserApproveID4']
                            }
                            : null
                    }
                };
            } else if (getConfigAproveOverTime == 4) {
                this.levelApproveOT = 4;
                nextState = {
                    ...nextState,
                    UserApprove3: {
                        ...UserApprove3,
                        visible: true,
                        refresh: !UserApprove3.refresh,
                        value: response['UserApproveID3']
                            ? {
                                UserInfoName: response['UserApproveName3'],
                                ID: response['UserApproveID3']
                            }
                            : null
                    },
                    UserApprove4: {
                        ...UserApprove4,
                        visible: true,
                        refresh: !UserApprove4.refresh,
                        value: response['UserApproveID4']
                            ? {
                                UserInfoName: response['UserApproveName4'],
                                ID: response['UserApproveID4']
                            }
                            : null
                    }
                };
            }
        }

        if (!isChangeLevelAprpovedOvertime) {
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

        if (getCommentWhenEdit) {
            let _dataProfileHireJob =
                Array.isArray(dataProfileHireJob) && dataProfileHireJob.length > 0 ? [...dataProfileHireJob] : [];
            let lstUserComment1 = [];
            let lstUserComment2 = [];
            let lstUserComment3 = [];
            let lstUserComment4 = [];

            let data = getCommentWhenEdit;

            for (let i = 0; i < data.length; i++) {
                if (data[i].LevelComment == 1) {
                    lstUserComment1.push({ ProfileName: data[i].ProfileName, ID: data[i].ID });
                } else if (data[i].LevelComment == 2) {
                    lstUserComment2.push({ ProfileName: data[i].ProfileName, ID: data[i].ID });
                } else if (data[i].LevelComment == 3) {
                    lstUserComment3.push({ ProfileName: data[i].ProfileName, ID: data[i].ID });
                } else if (data[i].LevelComment == 4) {
                    lstUserComment4.push({ ProfileName: data[i].ProfileName, ID: data[i].ID });
                }
            }

            if (lstUserComment1.length > 0)
                nextState = {
                    ...nextState,
                    UserComment1: {
                        ...UserComment1,
                        value: lstUserComment1,
                        data: _dataProfileHireJob,
                        refresh: !UserComment1.refresh
                    }
                };

            if (lstUserComment2.length > 0)
                nextState = {
                    ...nextState,
                    UserComment2: {
                        ...UserComment2,
                        value: lstUserComment2,
                        data: _dataProfileHireJob,
                        refresh: !UserComment2.refresh
                    }
                };

            if (lstUserComment3.length > 0)
                nextState = {
                    ...nextState,
                    UserComment3: {
                        ...UserComment3,
                        value: lstUserComment3,
                        data: _dataProfileHireJob,
                        refresh: !UserComment3.refresh
                    }
                };

            if (lstUserComment4.length > 0)
                nextState = {
                    ...nextState,
                    UserComment4: {
                        ...UserComment4,
                        value: lstUserComment4,
                        data: _dataProfileHireJob,
                        refresh: !UserComment4.refresh
                    }
                };
        }

        if (response['IsOverTimeBreak']) {
            nextState = {
                ...nextState,
                IsOverTimeBreak: {
                    ...IsOverTimeBreak,
                    value: true,
                    refresh: !IsOverTimeBreak.refresh
                }
            };
        }

        // task: 0163864
        if (response['IsBreakAsWork']) {
            nextState = {
                ...nextState,
                IsBreakAsWork: {
                    ...IsBreakAsWork,
                    value: true,
                    refresh: !IsBreakAsWork.refresh
                }
            };
        }

        if (response['IsNotCheckInOut']) {
            nextState = {
                ...nextState,
                IsNotCheckInOut: {
                    ...IsNotCheckInOut,
                    value: true,
                    refresh: !IsNotCheckInOut.refresh
                }
            };
        }

        let _eleRegisterHours = nextState.eleRegisterHours
                ? { ...nextState.eleRegisterHours }
                : { ...eleRegisterHours },
            _checkShiftByProfile = nextState.checkShiftByProfile
                ? { ...nextState.checkShiftByProfile }
                : { ...checkShiftByProfile };

        nextState = {
            ...nextState,
            Profile: {
                ...Profile,
                ID: response['ProfileID'],
                ProfileName: response['ProfileName']
            },
            ReasonOT: {
                ...ReasonOT,
                value: response['ReasonOT'],
                refresh: !ReasonOT.refresh
            },
            eleRegisterHours: {
                ..._eleRegisterHours,
                RegisterHours: {
                    ..._eleRegisterHours.RegisterHours,
                    value: response['RegisterHours'] ? response['RegisterHours'].toString() : null,
                    refresh: !RegisterHours.refresh
                }
            },
            checkShiftByProfile: {
                ..._checkShiftByProfile,
                WorkDateIn: {
                    ..._checkShiftByProfile.WorkDateIn,
                    value: response['WorkDateIn'] ? moment(response['WorkDateIn']).toDate() : null,
                    refresh: !WorkDateIn.refresh
                },
                WorkDateOut: {
                    ..._checkShiftByProfile.WorkDateOut,
                    value: response['WorkDateOut'] ? moment(response['WorkDateOut']).toDate() : null,
                    refresh: !WorkDateOut.refresh
                }
            }
        };

        this.setState(nextState);
    };

    getRecordAndConfigByID = async (record, _handleSetState) => {
        VnrLoadingSevices.show();
        const { ID } = record,
            getRecord = await HttpService.Get('[URI_HR]/api/Att_Overtime/New_Edit?id=' + ID);

        VnrLoadingSevices.hide();

        if (getRecord) {
            let objRecord = getRecord,
                { ProfileID, WorkDate, WorkDateIn, WorkDateOut, ShiftID } = {
                    ...objRecord
                };

            let _wordate = WorkDate ? moment(WorkDate).format('YYYY-MM-DD HH:mm:ss') : null,
                _WorkDateIn = WorkDateIn ? moment(WorkDateIn).format('HH:mm') : null,
                _WorkDateOut = WorkDateOut ? moment(WorkDateOut).format('HH:mm') : null;

            let arrRequest = [
                HttpService.Post('[URI_HR]/Att_GetData/GetOvertimeDurationTypeByDate', {
                    ProfileID: ProfileID,
                    WorkDate: _wordate,
                    IsPortal: true
                }),
                HttpService.Post('[URI_HR]/Att_GetData/GetOvertimeTypeByDate', {
                    ProfileID: ProfileID,
                    WorkDate: moment(WorkDate).format('YYYY-MM-DD HH:mm:ss'),
                    ShiftID: ShiftID,
                    timeStart: _WorkDateIn,
                    timeEnd: _WorkDateOut
                }),
                HttpService.Post('[URI_HR]/Att_GetData/GetAllowOvertimeType'),
                HttpService.Post('[URI_HR]/Sal_GetData/GetConfigElement', {
                    Key: 'HRM_ATT_OT_LISTREGISTERHOURS'
                }),
                HttpService.Get('[URI_SYS]/Sys_GetData/GetEnum?text=MethodPayment'),
                HttpService.Get('[URI_HR]/Att_GetData/GetMultiDurationType'),
                HttpService.Post('[URI_HR]/Sal_GetData/GetConfigElement', {
                    Key: 'HRM_ATT_CONFIG_NUMBER_LEAVE_APPROVE_OVERTIME'
                }),
                HttpService.Get('[URI_HR]/Cat_GetData/GetMultiShift'),
                HttpService.Post('[URI_HR]/Att_GetData/GetConfigAproveOverTime', {
                    RecordID: ID
                }),
                HttpService.Post('[URI_HR]/Att_GetData/IsChangeLevelAprpovedOvertime', {
                    RecordID: ID
                }),
                HttpService.Post('[URI_HR]/Att_GetData/GetJobType', {
                    ProfileId: ProfileID,
                    workDate: _wordate,
                    lstOrg: ''
                }),
                HttpService.Get('[URI_HR]/Cat_GetData/GetMultiJobTypeByCodeName'),
                HttpService.Get('[URI_HR]/Hre_GetData/GetMultiProfileHireJob'),
                HttpService.Post('[URI_HR]/Att_GetData/GetUserCommentWhenEdit', {
                    userComment1: objRecord.UserComment1 ? objRecord.UserComment1 : '',
                    userComment2: objRecord.UserComment2 ? objRecord.UserComment2 : '',
                    userComment3: objRecord.UserComment3 ? objRecord.UserComment3 : '',
                    userComment4: objRecord.UserComment4 ? objRecord.UserComment4 : ''
                })
            ];

            VnrLoadingSevices.show();
            HttpService.MultiRequest(arrRequest).then(res => {
                VnrLoadingSevices.hide();
                try {
                    if (res) {
                        _handleSetState(ID, res, { ...objRecord });
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        }
    };

    getConfig = () => {
        let nextState = this.readOnlyCtrlOT(true);
        const {
                divOvertimeTypeID,
                eleRegisterHours,
                eleRegisterHoursConfig,
                JobTypeID,
                checkShiftByProfile,
                MethodPayment,
                removeDurationType,
                divShiftID,
                Profile,
                OrgStructures,
                UserComment1,
                UserComment2,
                UserComment3,
                UserComment4
            } = this.state,
            { ShiftID } = divShiftID,
            { RegisterHoursConfig } = eleRegisterHoursConfig,
            { WorkDateIn, WorkDateOut } = checkShiftByProfile,
            { DurationType } = removeDurationType;

        let _divOvertimeTypeID = nextState.divOvertimeTypeID
                ? { ...nextState.divOvertimeTypeID }
                : { ...divOvertimeTypeID },
            _eleRegisterHours = nextState.eleRegisterHours
                ? { ...nextState.eleRegisterHours }
                : { ...eleRegisterHours },
            _eleRegisterHoursConfig = nextState.eleRegisterHoursConfig
                ? { ...nextState.eleRegisterHoursConfig }
                : { ...eleRegisterHoursConfig },
            _checkShiftByProfile = nextState.checkShiftByProfile
                ? { ...nextState.checkShiftByProfile }
                : { ...checkShiftByProfile },
            _MethodPayment = nextState.MethodPayment ? { ...nextState.MethodPayment } : { ...MethodPayment },
            _removeDurationType = nextState.removeDurationType
                ? { ...nextState.removeDurationType }
                : { ...removeDurationType },
            _divShiftID = nextState.divShiftID ? { ...nextState.divShiftID } : { ...divShiftID };

        VnrLoadingSevices.show();
        HttpService.MultiRequest([
            HttpService.Post('[URI_HR]/Att_GetData/GetAllowOvertimeType'),
            HttpService.Post('[URI_HR]/Sal_GetData/GetConfigElement', {
                Key: 'HRM_ATT_OT_LISTREGISTERHOURS'
            }),
            HttpService.Get('[URI_SYS]/Sys_GetData/GetEnum?text=MethodPayment'),
            HttpService.Get('[URI_HR]/Att_GetData/GetMultiDurationType'),
            HttpService.Post('[URI_HR]/Sal_GetData/GetConfigElement', {
                Key: 'HRM_ATT_CONFIG_NUMBER_LEAVE_APPROVE_OVERTIME'
            }),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiShift'),
            HttpService.Get('[URI_HR]/Cat_GetData/GetMultiJobTypeByCodeName'),
            HttpService.Get('[URI_HR]/Hre_GetData/GetMultiProfileHireJob'),
            HttpService.Post('[URI_HR]Att_GetData/GetListCommentLevel', {
                dataFilter: {
                    ProfileID: Profile.ID,
                    OrgStructureID: OrgStructures.value
                },
                business: 'ConfigCommentOvertime'
            })
        ]).then(resAll => {
            VnrLoadingSevices.hide();
            try {
                if (resAll) {
                    this.allowOvertimeType = resAll[0];

                    if (resAll[0] != true) {
                        nextState = {
                            ...nextState,
                            divOvertimeTypeID: {
                                ..._divOvertimeTypeID,
                                visible: false
                            }
                        };
                    }

                    if (resAll[1]) {
                        if (resAll[1].Value1 && resAll[1].Value1 !== '') {
                            let data = [],
                                strRegistHours = resAll[1].Value1.split(',');

                            //isListRegisterHours = strRegistHours;
                            for (let i = 0; i < strRegistHours.length; i++) {
                                data.push({ Text: strRegistHours[i], Value: strRegistHours[i] });
                            }

                            nextState = {
                                ...nextState,
                                eleRegisterHoursConfig: {
                                    ..._eleRegisterHoursConfig,
                                    visible: true,
                                    RegisterHoursConfig: {
                                        ..._eleRegisterHoursConfig.RegisterHoursConfig,
                                        data: [...data],
                                        refresh: !RegisterHoursConfig.refresh
                                    }
                                },
                                eleRegisterHours: {
                                    ..._eleRegisterHours,
                                    visible: false
                                },
                                checkShiftByProfile: {
                                    ..._checkShiftByProfile,
                                    WorkDateIn: {
                                        ..._checkShiftByProfile.WorkDateIn,
                                        disable: true,
                                        refresh: !WorkDateIn.refresh
                                    },
                                    WorkDateOut: {
                                        ..._checkShiftByProfile.WorkDateOut,
                                        disable: true,
                                        refresh: !WorkDateOut.refresh
                                    }
                                }
                            };
                        } else {
                            nextState = {
                                ...nextState,
                                eleRegisterHours: {
                                    ..._eleRegisterHours,
                                    visible: true
                                },
                                eleRegisterHoursConfig: {
                                    ..._eleRegisterHoursConfig,
                                    visible: false
                                }
                            };
                        }
                    }

                    if (resAll[2] && Array.isArray(resAll[2])) {
                        let _data = resAll[2];

                        nextState = {
                            ...nextState,
                            MethodPayment: {
                                ..._MethodPayment,
                                data: [..._data],
                                refresh: !MethodPayment.refresh
                            }
                        };
                    }

                    if (resAll[3] && Array.isArray(resAll[3])) {
                        let _data = resAll[3];

                        nextState = {
                            ...nextState,
                            removeDurationType: {
                                ..._removeDurationType,
                                DurationType: {
                                    ..._removeDurationType.DurationType,
                                    data: [..._data],
                                    refresh: !DurationType.refresh
                                }
                            }
                        };
                    }

                    this.configLevelApprove = resAll[4];

                    //ShiftID
                    if (resAll[5] && Array.isArray(resAll[5])) {
                        let _data = resAll[5];

                        nextState = {
                            ...nextState,
                            divShiftID: {
                                ..._divShiftID,
                                ShiftID: {
                                    ..._divShiftID.ShiftID,
                                    data: [..._data],
                                    refresh: !ShiftID.refresh
                                }
                            }
                        };
                    }

                    //JobTypeID
                    if (resAll[6] && Array.isArray(resAll[6])) {
                        let _data = resAll[6];

                        nextState = {
                            ...nextState,
                            JobTypeID: {
                                ...JobTypeID,
                                data: [..._data],
                                refresh: !JobTypeID.refresh
                            }
                        };
                    }

                    //setUserComment
                    if (resAll[8]) {
                        let _dataProfileHireJob =
                            Array.isArray(resAll[7]) && resAll[7].length > 0 ? [...resAll[7]] : [];
                        let lstUserComment1 = [];
                        let lstUserComment2 = [];
                        let lstUserComment3 = [];
                        let lstUserComment4 = [];

                        let data = resAll[8];

                        for (let i = 0; i < data.length; i++) {
                            if (data[i].LevelComment == 1) {
                                lstUserComment1.push({ ProfileName: data[i].ProfileName, ID: data[i].ID });
                            } else if (data[i].LevelComment == 2) {
                                lstUserComment2.push({ ProfileName: data[i].ProfileName, ID: data[i].ID });
                            } else if (data[i].LevelComment == 3) {
                                lstUserComment3.push({ ProfileName: data[i].ProfileName, ID: data[i].ID });
                            } else if (data[i].LevelComment == 4) {
                                lstUserComment4.push({ ProfileName: data[i].ProfileName, ID: data[i].ID });
                            }
                        }

                        if (lstUserComment1.length > 0)
                            nextState = {
                                ...nextState,
                                UserComment1: {
                                    ...UserComment1,
                                    value: lstUserComment1,
                                    data: _dataProfileHireJob,
                                    refresh: !UserComment1.refresh
                                }
                            };

                        if (lstUserComment2.length > 0)
                            nextState = {
                                ...nextState,
                                UserComment2: {
                                    ...UserComment2,
                                    value: lstUserComment2,
                                    data: _dataProfileHireJob,
                                    refresh: !UserComment2.refresh
                                }
                            };

                        if (lstUserComment3.length > 0)
                            nextState = {
                                ...nextState,
                                UserComment3: {
                                    ...UserComment3,
                                    value: lstUserComment3,
                                    data: _dataProfileHireJob,
                                    refresh: !UserComment3.refresh
                                }
                            };

                        if (lstUserComment4.length > 0)
                            nextState = {
                                ...nextState,
                                UserComment4: {
                                    ...UserComment4,
                                    value: lstUserComment4,
                                    data: _dataProfileHireJob,
                                    refresh: !UserComment4.refresh
                                }
                            };
                    }

                    this.setState(nextState, () => {
                        const { workDayItem } = this.props.navigation.state.params;
                        if (workDayItem) {
                            //if (this.isDoneInit) {
                            //call onDateChangeWorkDate
                            this.onDateChangeWorkDate(moment(workDayItem.WorkDate).format('YYYY-MM-DD HH:mm:ss'));
                            //} else {
                            //  this.isDoneInit = true;
                            //}
                        }
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
                _profile = {
                    ID: profileInfo[E_ProfileID],
                    ProfileName: profileInfo[E_FullName],
                    userid: profileInfo['userid']
                };

            this.setState({ Profile: _profile }, () => {
                this.getConfig();
                //this.GetHighSupervior(_profile.ID, _profile.ID, 'E_OVERTIME');
            });
        }
    };
    //#endregion

    //#region [button add more để chọn thêm nhân viên - ở phòng ban hoặc nhân viên]

    //add thêm nhân viên
    addMoreProfiles = items => {
        this.props.navigation.navigate('AttSubmitOvertimeAddOrEdit');
        this.onMultiPickerChangeProfile(items, true);
    };

    addMoreExcludeProfiles = items => {
        //
        this.props.navigation.navigate('AttSubmitLeaveDayAddOrEdit');

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

    nextScreenAddMoreProfiles = () => {
        this.props.navigation.navigate('FilterToAddProfile', {
            addMoreProfiles: this.addMoreProfiles,
            valueFilter: false
        });
    };

    onCheckExcludeProfile = CheckProfilesExclude => {
        let nextState = { CheckProfilesExclude: !CheckProfilesExclude };
        this.setState(nextState);
    };
    //#endregion

    //#region [function xử lý nghiệp vụ]

    readOnlyCtrlOT = isReadOnly => {
        let nextState = null;

        const {
                divShiftID,
                removeDurationType,
                divOvertimeTypeID,
                JobTypeID,
                IsGetShiftByProfile,
                IsOverTimeBreak,
                checkShiftByProfile,
                eleRegisterHours,
                MethodPayment,
                UserApprove,
                UserApprove2,
                UserApprove3,
                UserApprove4,
                ReasonOT
            } = this.state,
            { ShiftID } = divShiftID,
            { DurationType } = removeDurationType,
            { OvertimeTypeID } = divOvertimeTypeID,
            { WorkDateIn, WorkDateOut } = checkShiftByProfile,
            { RegisterHours } = eleRegisterHours;

        nextState = {
            divShiftID: {
                ...divShiftID,
                ShiftID: {
                    ...ShiftID,
                    disable: isReadOnly,
                    refresh: !ShiftID.refresh
                }
            },
            removeDurationType: {
                ...removeDurationType,
                DurationType: {
                    ...DurationType,
                    disable: isReadOnly,
                    refresh: !DurationType.refresh
                }
            },
            divOvertimeTypeID: {
                ...divOvertimeTypeID,
                OvertimeTypeID: {
                    ...OvertimeTypeID,
                    disable: isReadOnly,
                    refresh: !OvertimeTypeID.refresh
                }
            },
            JobTypeID: {
                ...JobTypeID,
                disable: isReadOnly,
                refresh: !JobTypeID.refresh
            },
            IsOverTimeBreak: {
                ...IsOverTimeBreak,
                disable: isReadOnly,
                refresh: !IsOverTimeBreak.refresh
            },
            checkShiftByProfile: {
                ...checkShiftByProfile,
                WorkDateIn: {
                    ...WorkDateIn,
                    disable: isReadOnly,
                    refresh: !WorkDateIn.refresh
                },
                WorkDateOut: {
                    ...WorkDateOut,
                    disable: isReadOnly,
                    refresh: !WorkDateOut.refresh
                }
            },
            eleRegisterHours: {
                ...eleRegisterHours,
                RegisterHours: {
                    ...RegisterHours,
                    disable: isReadOnly,
                    refresh: !RegisterHours.refresh
                }
            },
            MethodPayment: {
                ...MethodPayment,
                disable: isReadOnly,
                refresh: !MethodPayment.refresh
            },
            ReasonOT: {
                ...ReasonOT,
                disable: isReadOnly,
                refresh: !ReasonOT.refresh
            },
            IsGetShiftByProfile: {
                ...IsGetShiftByProfile,
                disable: isReadOnly,
                refresh: !IsGetShiftByProfile.refresh
            }
        };

        if (this.isChangeLevelApprove) {
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

        return nextState;
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

    GetHighSupervior = (profileId, userSubmit, type) => {
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
                    isChoseProfile,
                    Profiles,
                    OrgStructures,
                    WorkDate
                } = this.state;

                let nextState = {
                        UserApprove: { ...UserApprove },
                        UserApprove2: { ...UserApprove2 },
                        UserApprove3: { ...UserApprove3 },
                        UserApprove4: { ...UserApprove4 }
                    },
                    isSet = false;

                if (result.IsChangeApprove == true) {
                    this.isChangeLevelApprove = true;
                } else if (this.isRegisterOrgOvertime == true) {
                    this.isChangeLevelApprove = true;
                }

                //truong hop chạy theo approve grade
                if (result.LevelApprove > 0) {
                    this.levelApproveOT = result.LevelApprove;
                    if (result.IsOnlyOneLevelApprove) {
                        this.levelApproveOT = 1;
                    }
                    if (this.isRegisterOrgOvertime) {
                        if (this.levelApproveOT == 3) {
                            //isShowEle('#idUserApproveID3', true);
                            nextState = {
                                ...nextState,
                                UserApprove3: {
                                    ...nextState.UserApprove3,
                                    visible: true
                                }
                            };
                        } else if (this.levelApproveOT == 4) {
                            // $("#" + divControl3).show();
                            // $("#" + divControl4).show();
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
                        } else {
                            // isShowEle('#idUserApproveID3', false);
                            // isShowEle('#idUserApproveID4', false);
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
                        // Không gán người duyệt mà load tất cả người duyệt
                        // multiUserApproveID.value(null);
                        // multiUserApproveID.dataSource.read();
                        // multiUserApproveID2.value(null);
                        // multiUserApproveID2.dataSource.read();
                        // multiUserApproveID3.value(null);
                        // multiUserApproveID3.dataSource.read();
                        // multiUserApproveID4.value(null);
                        // multiUserApproveID4.dataSource.read();
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
                    } else if (result.LevelApprove == 2) {
                        // Nếu 1 cấp duyệt thì 4 người duyệt là 1
                        if (result.IsOnlyOneLevelApprove == true) {
                            this.levelApproveOT = 1;
                            if (result.SupervisorID != null) {
                                // checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                                // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                                // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                                // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);

                                nextState = {
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        value: {
                                            UserInfoName: result.SupervisorName,
                                            ID: result.SupervisorID
                                        }
                                    },
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: {
                                            UserInfoName: result.SupervisorName,
                                            ID: result.SupervisorID
                                        }
                                    },
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        value: {
                                            UserInfoName: result.SupervisorName,
                                            ID: result.SupervisorID
                                        }
                                    },
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        value: {
                                            UserInfoName: result.SupervisorName,
                                            ID: result.SupervisorID
                                        }
                                    }
                                };
                            }
                        } else {
                            if (result.SupervisorID != null) {
                                //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        value: {
                                            UserInfoName: result.SupervisorName,
                                            ID: result.SupervisorID
                                        }
                                    }
                                };
                            }
                            if (result.MidSupervisorID != null) {
                                //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                                nextState = {
                                    ...nextState,
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: {
                                            UserInfoName: result.SupervisorNextName,
                                            ID: result.MidSupervisorID
                                        }
                                    }
                                };
                                if (!isSet) {
                                    //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                                    //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                                    nextState = {
                                        ...nextState,
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
                                }
                            }
                        }

                        //isShowEle('#idUserApproveID3');
                        nextState = {
                            ...nextState,
                            UserApprove3: {
                                ...nextState.UserApprove3,
                                visible: false
                            }
                        };
                    } else if (result.LevelApprove == 3) {
                        if (result.SupervisorID != null) {
                            //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                            nextState = {
                                ...nextState,
                                UserApprove: {
                                    ...nextState.UserApprove,
                                    value: {
                                        UserInfoName: result.SupervisorName,
                                        ID: result.SupervisorID
                                    }
                                }
                            };
                        }
                        if (result.MidSupervisorID != null && !isSet) {
                            //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                            nextState = {
                                ...nextState,
                                UserApprove3: {
                                    ...nextState.UserApprove3,
                                    value: {
                                        UserInfoName: result.SupervisorNextName,
                                        ID: result.MidSupervisorID
                                    }
                                }
                            };
                        }
                        if (result.NextMidSupervisorID != null) {
                            //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID)
                            //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID)
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
                        } else {
                            // multiUserApproveID2.value(null);
                            // multiUserApproveID2.dataSource.read();
                            // multiUserApproveID4.value(null);
                            // multiUserApproveID4.dataSource.read();
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
                        //isShowEle('#idUserApproveID3', true);
                        nextState = {
                            ...nextState,
                            UserApprove3: {
                                ...nextState.UserApprove3,
                                visible: true
                            }
                        };
                    } else if (result.LevelApprove == 4) {
                        if (result.SupervisorID != null) {
                            //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                            nextState = {
                                ...nextState,
                                UserApprove: {
                                    ...nextState.UserApprove,
                                    value: {
                                        UserInfoName: result.SupervisorName,
                                        ID: result.SupervisorID
                                    }
                                }
                            };
                        }
                        if (result.MidSupervisorID != null && !isSet) {
                            //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                            nextState = {
                                ...nextState,
                                UserApprove3: {
                                    ...nextState.UserApprove3,
                                    value: {
                                        UserInfoName: result.SupervisorNextName,
                                        ID: result.MidSupervisorID
                                    }
                                }
                            };
                        }
                        if (result.NextMidSupervisorID != null) {
                            //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID)
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
                        }
                        if (result.HighSupervisorID != null) {
                            //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID)
                            nextState = {
                                ...nextState,
                                UserApprove2: {
                                    ...nextState.UserApprove2,
                                    value: {
                                        UserInfoName: result.HighSupervisorName,
                                        ID: result.HighSupervisorID
                                    }
                                }
                            };
                        }
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
                    }
                    if (result.IsChangeApprove != true) {
                        let IsReadOnlyCondition = true;
                        if (this.isRegisterHelp) {
                            if (isChoseProfile) {
                                // let countUserQuantity = $('#VnrSelectProfileOrOrgStructure_Profile_SelectProfileOrOrgStructureOvertimeInfo').val() != null
                                //     ? $('#VnrSelectProfileOrOrgStructure_Profile_SelectProfileOrOrgStructureOvertimeInfo').val() : null;
                                if (Profiles.value && Profiles.value.length >= 2) {
                                    IsReadOnlyCondition = false;
                                    // isReadOnlyComboBox($("#" + control1), false);
                                    // isReadOnlyComboBox($("#" + control2), false);
                                    // isReadOnlyComboBox($("#" + control3), false);
                                    // isReadOnlyComboBox($("#" + control4), false);
                                    nextState = {
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
                                        },
                                        UserApprove4: {
                                            ...nextState.UserApprove4,
                                            disable: false
                                        }
                                    };
                                }
                            } else if (OrgStructures.value && OrgStructures.value.length >= 1) {
                                IsReadOnlyCondition = false;
                            }
                        }

                        if (IsReadOnlyCondition) {
                            // isReadOnlyComboBox($("#" + control1), true);
                            // isReadOnlyComboBox($("#" + control2), true);
                            // isReadOnlyComboBox($("#" + control3), true);
                            // isReadOnlyComboBox($("#" + control4), true);
                            nextState = {
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
                                },
                                UserApprove4: {
                                    ...nextState.UserApprove4,
                                    disable: true
                                }
                            };
                        }
                    } else if (WorkDate.value) {
                        // isReadOnlyComboBox($("#" + control1), false);
                        // isReadOnlyComboBox($("#" + control2), false);
                        // isReadOnlyComboBox($("#" + control3), false);
                        // isReadOnlyComboBox($("#" + control4), false);
                        nextState = {
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
                            },
                            UserApprove4: {
                                ...nextState.UserApprove4,
                                disable: false
                            }
                        };
                    }
                }

                //TH chạy không theo approve grade
                else if (result.LevelApprove == 0) {
                    //nếu isRegisterOrgOvertime là true nghĩa là chọn trên 1 người
                    if (this.isRegisterOrgOvertime) {
                        if (
                            this.configLevelApprove &&
                            this.configLevelApprove.Value1 &&
                            this.configLevelApprove.Value1 !== ''
                        ) {
                            if (this.configLevelApprove.Value1 == '3') {
                                this.levelApproveOT = 3;
                                nextState = {
                                    ...nextState,
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        visible: true
                                    }
                                };
                            } else if (this.configLevelApprove.Value1 == '1') {
                                this.levelApproveOT = 1;
                            } else {
                                this.levelApproveOT = 2;
                            }
                        } else {
                            this.levelApproveOT = 2;
                        }

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

                        if (result.IsChangeApprove != true) {
                            let IsReadOnlyCondition = true;
                            if (this.isRegisterHelp) {
                                if (isChoseProfile) {
                                    // var countUserQuantity = $('#VnrSelectProfileOrOrgStructure_Profile_SelectProfileOrOrgStructureOvertimeInfo').val() != null
                                    //     ? $('#VnrSelectProfileOrOrgStructure_Profile_SelectProfileOrOrgStructureOvertimeInfo').val() : null;
                                    if (Profiles.value && Profiles.value.length >= 2) {
                                        IsReadOnlyCondition = false;
                                        // isReadOnlyComboBox($("#" + control1), false);//vì khi chọn 1 tên nó sẽ khóa 4 cái control lại nên khi đến cái tên thứ 2
                                        // isReadOnlyComboBox($("#" + control2), false);//nếu chí có condition là false thì 4 control vẫn bị khóa
                                        // isReadOnlyComboBox($("#" + control3), false);
                                        // isReadOnlyComboBox($("#" + control4), false);
                                        nextState = {
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
                                            },
                                            UserApprove4: {
                                                ...nextState.UserApprove4,
                                                disable: false
                                            }
                                        };
                                    }
                                } else if (OrgStructures.value && OrgStructures.value.length >= 1) {
                                    IsReadOnlyCondition = false;
                                    // isReadOnlyComboBox($("#" + control1), false);//vì khi chọn 1 tên nó sẽ khóa 4 cái control lại nên khi đổi qua chọn p ban
                                    // isReadOnlyComboBox($("#" + control2), false);//nếu chí có condition là false thì 4 control vẫn bị khóa
                                    // isReadOnlyComboBox($("#" + control3), false);
                                    // isReadOnlyComboBox($("#" + control4), false);

                                    nextState = {
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
                                        },
                                        UserApprove4: {
                                            ...nextState.UserApprove4,
                                            disable: false
                                        }
                                    };
                                }

                                if (IsReadOnlyCondition == true) {
                                    // isReadOnlyComboBox($("#" + control1), true);
                                    // isReadOnlyComboBox($("#" + control2), true);
                                    // isReadOnlyComboBox($("#" + control3), true);
                                    // isReadOnlyComboBox($("#" + control4), true);
                                    nextState = {
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
                                        },
                                        UserApprove4: {
                                            ...nextState.UserApprove4,
                                            disable: true
                                        }
                                    };
                                }
                            }
                        }
                    }

                    //vì là else của isRegisterOrgOvertime nên sẽ luôn là chọn 1 người
                    else {
                        if (result.IsChangeApprove != true) {
                            // isReadOnlyComboBox($("#" + control1), true);
                            // isReadOnlyComboBox($("#" + control2), true);
                            // isReadOnlyComboBox($("#" + control3), true);
                            // isReadOnlyComboBox($("#" + control4), true);
                            nextState = {
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
                                },
                                UserApprove4: {
                                    ...nextState.UserApprove4,
                                    disable: true
                                }
                            };
                        }
                        if (result.SupervisorID != null) {
                            //dataUserApprove1.push({ UserInfoName: result.SupervisorName, ID: result.SupervisorID });
                            //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID)
                            nextState = {
                                ...nextState,
                                UserApprove: {
                                    ...nextState.UserApprove,
                                    value: {
                                        UserInfoName: result.SupervisorName,
                                        ID: result.SupervisorID
                                    }
                                }
                            };
                        } else {
                            // multiUserApproveID.refresh();
                            // multiUserApproveID.value(null);
                            nextState = {
                                ...nextState,
                                UserApprove: {
                                    ...nextState.UserApprove,
                                    value: null
                                }
                            };
                        }
                        if (result.HighSupervisorID != null) {
                            //dataUserApprove3.push({ UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID });
                            //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
                            nextState = {
                                ...nextState,
                                UserApprove2: {
                                    ...nextState.UserApprove2,
                                    value: {
                                        UserInfoName: result.HighSupervisorName,
                                        ID: result.HighSupervisorID
                                    }
                                },
                                UserApprove4: {
                                    ...nextState.UserApprove4,
                                    value: {
                                        UserInfoName: result.HighSupervisorName,
                                        ID: result.HighSupervisorID
                                    }
                                }
                            };
                        } else {
                            //multiUserApproveID2.refresh();
                            //multiUserApproveID2.value(null);
                            nextState = {
                                ...nextState,
                                UserApprove2: {
                                    ...nextState.UserApprove2,
                                    value: null
                                }
                            };
                        }
                        if (result.IsChangeApprove != true) {
                            let IsReadOnlyCondition = true;
                            if (this.isRegisterHelp) {
                                if (isChoseProfile) {
                                    // var countUserQuantity = $('#VnrSelectProfileOrOrgStructure_Profile_SelectProfileOrOrgStructureOvertimeInfo').val() != null
                                    // ? $('#VnrSelectProfileOrOrgStructure_Profile_SelectProfileOrOrgStructureOvertimeInfo').val() : null;
                                    if (Profiles.value && Profiles.value.length >= 2) {
                                        IsReadOnlyCondition = false;
                                        // isReadOnlyComboBox($("#" + control1), false);//vì khi chọn 1 tên nó sẽ khóa 4 cái control lại nên khi đến cái tên thứ 2
                                        // isReadOnlyComboBox($("#" + control2), false);//nếu chí có condition là false thì 4 control vẫn bị khóa
                                        // isReadOnlyComboBox($("#" + control3), false);
                                        // isReadOnlyComboBox($("#" + control4), false);
                                        nextState = {
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
                                            },
                                            UserApprove4: {
                                                ...nextState.UserApprove4,
                                                disable: false
                                            }
                                        };
                                    }
                                } else if (OrgStructures.value && OrgStructures.value.length >= 1) {
                                    IsReadOnlyCondition = false;
                                    // isReadOnlyComboBox($("#" + control1), false);//vì khi chọn 1 tên nó sẽ khóa 4 cái control lại nên khi đến cái tên thứ 2
                                    // isReadOnlyComboBox($("#" + control2), false);//nếu chí có condition là false thì 4 control vẫn bị khóa
                                    // isReadOnlyComboBox($("#" + control3), false);
                                    // isReadOnlyComboBox($("#" + control4), false);
                                    nextState = {
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
                                        },
                                        UserApprove4: {
                                            ...nextState.UserApprove4,
                                            disable: false
                                        }
                                    };
                                }
                            }

                            if (IsReadOnlyCondition == true) {
                                // isReadOnlyComboBox($("#" + control1), true);
                                // isReadOnlyComboBox($("#" + control2), true);
                                // isReadOnlyComboBox($("#" + control3), true);
                                // isReadOnlyComboBox($("#" + control4), true);
                                nextState = {
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
                                    },
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        disable: true
                                    }
                                };
                            }
                        } else if (WorkDate.value) {
                            // isReadOnlyComboBox($("#" + control1), false);
                            // isReadOnlyComboBox($("#" + control2), false);

                            if (!isSet) {
                                //isReadOnlyComboBox($("#" + control3), false);
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
                            } else {
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        disable: false
                                    },
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        disable: false
                                    }
                                };
                            }
                        }

                        // Vinh.Mai Kiểm tra load người duyệt không theo chế độ duyệt
                        if (
                            this.configLevelApprove &&
                            this.configLevelApprove.Value1 &&
                            this.configLevelApprove.Value1 !== ''
                        ) {
                            if (this.configLevelApprove.Value1 == '3') {
                                this.levelApproveOT = 3;
                                // ND3 == ND4
                                //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
                                //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
                                //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                                //isShowEle('#idUserApproveID3', true);

                                nextState = {
                                    ...nextState,
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: {
                                            UserInfoName: result.HighSupervisorName,
                                            ID: result.HighSupervisorID
                                        }
                                    },
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        value: {
                                            UserInfoName: result.HighSupervisorName,
                                            ID: result.HighSupervisorID
                                        }
                                    },
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        value: {
                                            UserInfoName: result.SupervisorNextName,
                                            ID: result.MidSupervisorID
                                        },
                                        visible: true
                                    }
                                };
                            } else if (this.configLevelApprove.Value1 == '1') {
                                this.levelApproveOT = 1;
                                // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                                // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                                // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);

                                nextState = {
                                    ...nextState,
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: {
                                            UserInfoName: result.SupervisorName,
                                            ID: result.SupervisorID
                                        }
                                    },
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        value: {
                                            UserInfoName: result.SupervisorName,
                                            ID: result.SupervisorID
                                        }
                                    },
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        value: {
                                            UserInfoName: result.SupervisorName,
                                            ID: result.SupervisorID
                                        }
                                    }
                                };
                            } else {
                                this.levelApprove = 2;
                                // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                                // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                                // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);

                                nextState = {
                                    ...nextState,
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
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
                                    },
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        value: {
                                            UserInfoName: result.SupervisorNextName,
                                            ID: result.MidSupervisorID
                                        }
                                    }
                                };
                            }
                        } else {
                            this.levelApprove = 2;
                            // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                            // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                            // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);

                            nextState = {
                                ...nextState,
                                UserApprove2: {
                                    ...nextState.UserApprove2,
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
                                },
                                UserApprove3: {
                                    ...nextState.UserApprove3,
                                    value: {
                                        UserInfoName: result.SupervisorNextName,
                                        ID: result.MidSupervisorID
                                    }
                                }
                            };
                        }
                    }
                }

                nextState = {
                    UserApprove: {
                        ...nextState.UserApprove,
                        refresh: !UserApprove.refresh
                    },
                    UserApprove2: {
                        ...nextState.UserApprove2,
                        refresh: !UserApprove2.refresh
                    },
                    UserApprove3: {
                        ...nextState.UserApprove3,
                        refresh: !UserApprove3.refresh
                    },
                    UserApprove4: {
                        ...nextState.UserApprove4,
                        refresh: !UserApprove4.refresh
                    }
                };

                this.setState(nextState, () => {
                    const { workDayItem } = this.props.navigation.state.params;
                    if (workDayItem) {
                        if (this.isDoneInit) {
                            //call onDateChangeWorkDate
                            this.onDateChangeWorkDate(moment(workDayItem.WorkDate).format('YYYY-MM-DD HH:mm:ss'));
                        } else {
                            this.isDoneInit = true;
                        }
                    }
                });
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    OnChangeHighSupervisor(timeStart, timeEnd) {
        const { WorkDate, isChoseProfile, Profiles, Profile, eleRegisterHours, eleRegisterHoursConfig } = this.state,
            { RegisterHours } = eleRegisterHours,
            { RegisterHoursConfig } = eleRegisterHoursConfig;

        var pro = null,
            isRegisterOrg = false,
            dayType = null, //$('#OvertimeDayType').val(),
            workdate = WorkDate.value ? moment(WorkDate.value).format('YYYY-MM-DD HH:mm:ss') : null;

        //có cấu hình đk ký hộ
        if (this.isRegisterHelp) {
            //chọn nhân viên > lấy nhân viên đầu tiên
            if (isChoseProfile) {
                if (Profiles.value && Profiles.value[0]) pro = Profiles.value[0].ID;

                if (Profiles.value && Profiles.value.length > 1) {
                    isRegisterOrg = true;
                } else {
                    isRegisterOrg = false;
                }
            }
            //chọn phòng ban > set _profileID = null
            else {
                pro = null;
                isRegisterOrg = true;
            }
        } else {
            pro = Profile.ID;
            isRegisterOrg = false;
        }

        if (pro && timeStart && timeEnd && workdate && (RegisterHours.value || RegisterHoursConfig.value)) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/ChangeHighSupervisor', {
                ProfileID: pro,
                UserSubmit: profileInfo[enumName.E_ProfileID],
                DayType: dayType,
                TimeStart: timeStart,
                TimeEnd: timeEnd,
                workdate: workdate
            }).then(result => {
                //
                try {
                    const {
                        UserApprove,
                        UserApprove2,
                        UserApprove3,
                        UserApprove4
                    } = this.state;

                    let isSet = false,
                        nextState = {
                            UserApprove: { ...UserApprove },
                            UserApprove2: { ...UserApprove2 },
                            UserApprove3: { ...UserApprove3 },
                            UserApprove4: { ...UserApprove4 }
                        };

                    if (result.MidSupervisorID) isSet = false;

                    //truong hop chạy theo approve grade
                    if (result.LevelApprove > 0) {
                        // Gán số cấp duyệt
                        if (result.IsChangeApprove != true) {
                            nextState = {
                                UserApprove: { ...nextState.UserApprove, disable: true },
                                UserApprove2: { ...nextState.UserApprove2, disable: true },
                                UserApprove3: { ...nextState.UserApprove3, disable: true },
                                UserApprove4: { ...nextState.UserApprove4 }
                            };
                        } else {
                            nextState = {
                                UserApprove: { ...nextState.UserApprove, disable: false },
                                UserApprove2: { ...nextState.UserApprove2, disable: false },
                                UserApprove3: { ...nextState.UserApprove3, disable: false },
                                UserApprove4: { ...nextState.UserApprove4 }
                            };
                        }

                        this.levelApprove = result.LevelApprove;
                        if (result.IsOnlyOneLevelApprove) {
                            this.levelApprove = 1;
                        }

                        if (isRegisterOrg) {
                            if (this.levelApprove == 3) {
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
                            } else if (this.levelApprove == 4) {
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
                            // Không gán người duyệt mà load tất cả người duyệt
                            // multiUserApproveID.value(null);
                            // multiUserApproveID.dataSource.read();
                            // multiUserApproveID2.value(null);
                            // multiUserApproveID2.dataSource.read();
                            // multiUserApproveID3.value(null);
                            // multiUserApproveID3.dataSource.read();
                            // multiUserApproveID4.value(null);
                            // multiUserApproveID4.dataSource.read();
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
                        } else if (result.LevelApprove == 2) {
                            if (result.IsOnlyOneLevelApprove == true) {
                                // Nếu 1 cấp duyệt thì 4 người duyệt là 1
                                this.levelApproveOT = 1;
                                if (result.SupervisorID != null) {
                                    // checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                                    // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                                    // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                                    // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                                    nextState = {
                                        UserApprove: {
                                            ...nextState.UserApprove,
                                            value: {
                                                UserInfoName: result.SupervisorName,
                                                ID: result.SupervisorID
                                            }
                                        },
                                        UserApprove2: {
                                            ...nextState.UserApprove2,
                                            value: {
                                                UserInfoName: result.SupervisorName,
                                                ID: result.SupervisorID
                                            }
                                        },
                                        UserApprove3: {
                                            ...nextState.UserApprove3,
                                            value: {
                                                UserInfoName: result.SupervisorName,
                                                ID: result.SupervisorID
                                            }
                                        },
                                        UserApprove4: {
                                            ...nextState.UserApprove4,
                                            value: {
                                                UserInfoName: result.SupervisorName,
                                                ID: result.SupervisorID
                                            }
                                        }
                                    };
                                } else {
                                    // multiUserApproveID.value(null);
                                    // multiUserApproveID3.value(null);
                                    // multiUserApproveID4.value(null);
                                    // multiUserApproveID2.value(null);
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
                                    //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                                    nextState = {
                                        ...nextState,
                                        UserApprove: {
                                            ...nextState.UserApprove,
                                            value: {
                                                UserInfoName: result.SupervisorName,
                                                ID: result.SupervisorID
                                            }
                                        }
                                    };
                                } else {
                                    //multiUserApproveID.value(null);
                                    nextState = {
                                        ...nextState,
                                        UserApprove: {
                                            ...nextState.UserApprove,
                                            value: null
                                        }
                                    };
                                }
                                if (result.MidSupervisorID != null) {
                                    //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                                    nextState = {
                                        ...nextState,
                                        UserApprove2: {
                                            ...nextState.UserApprove2,
                                            value: {
                                                UserInfoName: result.SupervisorNextName,
                                                ID: result.MidSupervisorID
                                            }
                                        }
                                    };
                                    if (!isSet) {
                                        //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                                        //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                                        nextState = {
                                            ...nextState,
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
                                    }
                                } else {
                                    // multiUserApproveID3.value(null);
                                    // multiUserApproveID4.value(null);
                                    // multiUserApproveID2.value(null);
                                    nextState = {
                                        ...nextState,
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
                            }
                            //isShowEle('#idUserApproveID3');
                            nextState = {
                                ...nextState,
                                UserApprove3: {
                                    ...nextState.UserApprove3,
                                    visible: false
                                }
                            };
                        } else if (result.LevelApprove == 3) {
                            if (result.SupervisorID != null) {
                                //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        value: {
                                            UserInfoName: result.SupervisorName,
                                            ID: result.SupervisorID
                                        }
                                    }
                                };
                            } else {
                                //multiUserApproveID.value(null);
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        value: null
                                    }
                                };
                            }
                            if (result.MidSupervisorID != null && !isSet) {
                                //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                                nextState = {
                                    ...nextState,
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        value: {
                                            UserInfoName: result.SupervisorNextName,
                                            ID: result.MidSupervisorID
                                        }
                                    }
                                };
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
                                //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID)
                                //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID)
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
                            } else {
                                // multiUserApproveID4.value(null);
                                // multiUserApproveID2.value(null);
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
                            //isShowEle('#idUserApproveID3', true);
                            nextState = {
                                ...nextState,
                                UserApprove3: {
                                    ...nextState.UserApprove3,
                                    visible: true
                                }
                            };
                        } else if (result.LevelApprove == 4) {
                            if (result.SupervisorID != null) {
                                //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        value: {
                                            UserInfoName: result.SupervisorName,
                                            ID: result.SupervisorID
                                        }
                                    }
                                };
                            } else {
                                //multiUserApproveID.value(null);
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        value: null
                                    }
                                };
                            }
                            if (result.MidSupervisorID != null && !isSet) {
                                //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                                nextState = {
                                    ...nextState,
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        value: {
                                            UserInfoName: result.SupervisorNextName,
                                            ID: result.MidSupervisorID
                                        }
                                    }
                                };
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
                                //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID)
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
                                //multiUserApproveID4.value(null);
                                nextState = {
                                    ...nextState,
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        value: null
                                    }
                                };
                            }
                            if (result.HighSupervisorID != null) {
                                //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID)
                                nextState = {
                                    ...nextState,
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: {
                                            UserInfoName: result.HighSupervisorName,
                                            ID: result.HighSupervisorID
                                        }
                                    }
                                };
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
                        }
                    }
                    //TH chạy không theo approvegrade
                    else if (result.LevelApprove == 0) {
                        if (isRegisterOrg) {
                            if (
                                this.configLevelApprove &&
                                this.configLevelApprove.Value1 &&
                                this.configLevelApprove.Value1 !== ''
                            ) {
                                if (this.configLevelApprove.Value1 == '3') {
                                    this.levelApprove = 3;
                                    //isShowEle('#idUserApproveID3', true);
                                    nextState = {
                                        ...nextState,
                                        UserApprove3: {
                                            ...nextState.UserApprove3,
                                            visible: true
                                        }
                                    };
                                } else if (this.configLevelApprove.Value1 == '1') {
                                    this.levelApprove = 1;
                                } else {
                                    this.levelApprove = 2;
                                }
                            } else {
                                this.levelApprove = 2;
                            }

                            // Không gán người duyệt mà load tất cả người duyệt
                            // multiUserApproveID.value(null);
                            // multiUserApproveID.dataSource.read();
                            // multiUserApproveID2.value(null);
                            // multiUserApproveID2.dataSource.read();
                            // multiUserApproveID3.value(null);
                            // multiUserApproveID3.dataSource.read();
                            // multiUserApproveID4.value(null);
                            // multiUserApproveID4.dataSource.read();
                            nextState = {
                                UserApprove3: {
                                    ...nextState.UserApprove3,
                                    value: null
                                },
                                UserApprove4: {
                                    ...nextState.UserApprove4,
                                    value: null
                                },
                                UserApprove: {
                                    ...nextState.UserApprove,
                                    value: null
                                },
                                UserApprove2: {
                                    ...nextState.UserApprove2,
                                    value: null
                                }
                            };
                        } else {
                            if (result.SupervisorID != null) {
                                //dataUserApprove1.push({ UserInfoName: result.SupervisorName, ID: result.SupervisorID });
                                //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID)
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        value: {
                                            UserInfoName: result.SupervisorName,
                                            ID: result.SupervisorID
                                        }
                                    }
                                };
                            } else {
                                // multiUserApproveID.refresh();
                                // multiUserApproveID.value(null);
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        value: null
                                    }
                                };
                            }
                            if (result.HighSupervisorID != null) {
                                //dataUserApprove3.push({ UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID });
                                //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
                                nextState = {
                                    ...nextState,
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: {
                                            UserInfoName: result.HighSupervisorName,
                                            ID: result.HighSupervisorID
                                        }
                                    },
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        value: {
                                            UserInfoName: result.HighSupervisorName,
                                            ID: result.HighSupervisorID
                                        }
                                    }
                                };
                                // if (multiUserApproveID4) {
                                //     //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
                                // }
                            } else {
                                // multiUserApproveID2.refresh();
                                // multiUserApproveID2.value(null);
                                nextState = {
                                    ...nextState,
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: null
                                    }
                                };
                            }
                            if (result.IsChangeApprove != true) {
                                // multiUserApproveID.readonly();
                                // multiUserApproveID2.readonly();
                                // multiUserApproveID3.readonly();
                                // multiUserApproveID4.readonly();
                                nextState = {
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
                                    },
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        disable: true
                                    }
                                };
                            } else {
                                // multiUserApproveID.readonly(false);
                                // multiUserApproveID2.readonly(false);
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        disable: false
                                    },
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        disable: false
                                    }
                                };
                                if (!isSet)
                                    //multiUserApproveID3.readonly(false);
                                    nextState = {
                                        ...nextState,
                                        UserApprove3: {
                                            ...nextState.UserApprove3,
                                            disable: false
                                        }
                                    };
                            }

                            // Vinh.Mai Kiểm tra load người duyệt không theo chế độ duyệt
                            if (
                                this.configLevelApprove &&
                                this.configLevelApprove.Value1 &&
                                this.configLevelApprove.Value1 !== ''
                            ) {
                                if (this.configLevelApprove.Value1 == '3') {
                                    this.levelApproveOT = 3;
                                    // ND3 == ND4
                                    // checkAddDatasource(multiUserApproveID2, , "ID", result.HighSupervisorID);
                                    // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
                                    // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                                    // isShowEle('#idUserApproveID3', true);
                                    nextState = {
                                        ...nextState,
                                        UserApprove2: {
                                            ...nextState.UserApprove2,
                                            value: {
                                                UserInfoName: result.HighSupervisorName,
                                                ID: result.HighSupervisorID
                                            }
                                        },
                                        UserApprove3: {
                                            ...nextState.UserApprove3,
                                            visible: true,
                                            value: {
                                                UserInfoName: result.HighSupervisorName,
                                                ID: result.HighSupervisorID
                                            }
                                        },
                                        UserApprove4: {
                                            ...nextState.UserApprove4,
                                            value: {
                                                UserInfoName: result.HighSupervisorName,
                                                ID: result.HighSupervisorID
                                            }
                                        }
                                    };
                                } else if (this.configLevelApprove.Value1 == '1') {
                                    // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                                    // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                                    // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                                    nextState = {
                                        ...nextState,
                                        UserApprove2: {
                                            ...nextState.UserApprove2,
                                            value: {
                                                UserInfoName: result.SupervisorName,
                                                ID: result.SupervisorID
                                            }
                                        },
                                        UserApprove3: {
                                            ...nextState.UserApprove3,
                                            value: {
                                                UserInfoName: result.SupervisorName,
                                                ID: result.SupervisorID
                                            }
                                        },
                                        UserApprove4: {
                                            ...nextState.UserApprove4,
                                            value: {
                                                UserInfoName: result.SupervisorName,
                                                ID: result.SupervisorID
                                            }
                                        }
                                    };
                                } else {
                                    // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                                    // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                                    // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
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
                                }
                            } else {
                                // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                                // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                                // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
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
                            }
                        }
                    }

                    nextState = {
                        UserApprove: {
                            ...nextState.UserApprove,
                            refresh: !UserApprove.refresh
                        },
                        UserApprove2: {
                            ...nextState.UserApprove2,
                            refresh: !UserApprove2.refresh
                        },
                        UserApprove3: {
                            ...nextState.UserApprove3,
                            refresh: !UserApprove3.refresh
                        },
                        UserApprove4: {
                            ...nextState.UserApprove4,
                            refresh: !UserApprove4.refresh
                        }
                    };

                    this.setState(nextState, () => {
                        VnrLoadingSevices.hide();
                    });
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        } else {
            //null profile ID
        }
    }

    CheckRegisterOvertimeDayHaveShift = dataBody => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/CheckRegisterOvertimeDayHaveShift', dataBody).then(data => {
            VnrLoadingSevices.hide();
            try {
                let nextState = {};
                const { divShiftID } = this.state,
                    { ShiftID } = divShiftID;
                if (data) {
                    nextState = {
                        divShiftID: {
                            ...divShiftID,
                            ShiftID: {
                                ...ShiftID,
                                disable: true,
                                refresh: !ShiftID.refresh
                            }
                        }
                    };
                } else {
                    nextState = {
                        divShiftID: {
                            ...divShiftID,
                            ShiftID: {
                                ...ShiftID,
                                disable: false,
                                refresh: !ShiftID.refresh
                            }
                        }
                    };
                }
                this.setState(nextState);
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    GetShiftByProfileIDAndWorkDate = (data, dataBody) => {
        const { divShiftID, divTempShiftID, IsGetShiftByProfile, ReasonOT } = this.state;
        let nextState = {};

        //nextState = this.readOnlyCtrlOT(false);
        //this.setState(nextState);

        if (data == false) {
            nextState = {
                divTempShiftID: {
                    ...divTempShiftID,
                    TempShiftID: {
                        ...divTempShiftID.TempShiftID,
                        value: null,
                        refresh: !divTempShiftID.TempShiftID.refresh
                    }
                }
            };

            //nếu không check lấy ca theo nv
            if (!IsGetShiftByProfile.value) {
                nextState = {
                    divTempShiftID: {
                        ...nextState.divTempShiftID,
                        visible: false
                    },
                    divShiftID: {
                        ...divShiftID,
                        visible: true
                    }
                };
            }

            nextState = {
                ...nextState,
                ReasonOT: {
                    ...ReasonOT,
                    disable: false,
                    refresh: !ReasonOT.refresh
                }
            };

            this.setState(nextState, () => {
                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Att_GetData/GetShiftByProfileIDAndWorkDate', dataBody).then(data => {
                    VnrLoadingSevices.hide();
                    try {
                        const { divShiftID, removeDurationType } = this.state,
                            { DurationType } = removeDurationType,
                            { ShiftID } = divShiftID;

                        //nextState = this.readOnlyCtrlOT(false);
                        let nextState1 = this.readOnlyCtrlOT(false),
                            findShift = data[0] ? ShiftID.data.find(item => item.ID == data[0].ID) : null;

                        nextState1 = {
                            ...nextState1,
                            removeDurationType: {
                                ...removeDurationType,
                                DurationType: {
                                    ...DurationType,
                                    disable: true,
                                    refresh: !DurationType.refresh
                                }
                            }
                        };

                        if (data != '') {
                            nextState1 = {
                                ...nextState1,
                                divShiftID: {
                                    ...divShiftID,
                                    ShiftID: {
                                        ...ShiftID,
                                        value: { ...findShift },
                                        refresh: !ShiftID.refresh
                                    }
                                }
                            };
                        } else {
                            nextState1 = {
                                ...nextState1,
                                divShiftID: {
                                    ...divShiftID,
                                    ShiftID: {
                                        ...ShiftID,
                                        value: null,
                                        refresh: !ShiftID.refresh
                                    }
                                }
                            };
                        }

                        this.setState(nextState1, () => {
                            const { IsGetShiftByProfile, checkShiftByProfile } = this.state,
                                { WorkDateIn, WorkDateOut } = checkShiftByProfile;

                            this.GetOvertimeTypeByDate();
                            this.GetDurationTypeByDate(IsGetShiftByProfile.value);

                            //check cấu hình disabled ca nếu không có đk hộ
                            if (!this.isRegisterHelp) {
                                let _dataBody = {
                                    ProfileID: dataBody.ProfileID,
                                    WorkDate: dataBody.WorkDate
                                };
                                this.CheckRegisterOvertimeDayHaveShift({ ..._dataBody });
                            }

                            let timeStart = WorkDateIn.value ? moment(WorkDateIn.value).format('HH:mm') : null,
                                timeEnd = WorkDateOut.value ? moment(WorkDateOut.value).format('HH:mm') : null;
                            this.OnChangeHighSupervisor(timeStart, timeEnd);
                        });
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });
            });
        } else if (data == true) {
            nextState = {
                divShiftID: {
                    ...divShiftID,
                    ShiftID: {
                        ...divShiftID.ShiftID,
                        value: null,
                        refresh: !divShiftID.ShiftID.refresh
                    }
                }
            };

            //nếu không check lấy ca theo nv
            if (!IsGetShiftByProfile.value) {
                nextState = {
                    divTempShiftID: {
                        ...divTempShiftID,
                        visible: true
                    },
                    divShiftID: {
                        ...nextState.divShiftID,
                        visible: false
                    }
                };
            }

            nextState = {
                ...nextState,
                ReasonOT: {
                    ...ReasonOT,
                    disable: false,
                    refresh: !ReasonOT.refresh
                }
            };

            this.setState(nextState, () => {
                HttpService.Post('[URI_HR]/Att_GetData/GetShiftByProfileIDAndWorkDate', dataBody).then(data => {
                    const { divTempShiftID, removeDurationType } = this.state,
                        { DurationType } = removeDurationType,
                        { TempShiftID } = divTempShiftID;

                    let nextState1 = {
                        removeDurationType: {
                            ...removeDurationType,
                            DurationType: {
                                ...DurationType,
                                disable: true,
                                refresh: !DurationType.refresh
                            }
                        }
                    };

                    if (data != '') {
                        nextState1 = {
                            divTempShiftID: {
                                ...divTempShiftID,
                                TempShiftID: {
                                    ...TempShiftID,
                                    data: [...data],
                                    refresh: !TempShiftID.refresh
                                }
                            }
                        };

                        if (data[0].IndexShiftByWorkDate) {
                            let _IndexShiftByWorkDate = data[0].IndexShiftByWorkDate;
                            nextState1 = {
                                divTempShiftID: {
                                    ...nextState1.divTempShiftID,
                                    TempShiftID: {
                                        ...nextState1.divTempShiftID.TempShiftID,
                                        value: { ...data[_IndexShiftByWorkDate] }
                                    }
                                }
                            };
                        } else {
                            nextState1 = {
                                divTempShiftID: {
                                    ...nextState1.divTempShiftID,
                                    TempShiftID: {
                                        ...nextState1.divTempShiftID.TempShiftID,
                                        value: null,
                                        refresh: !TempShiftID.refresh
                                    }
                                }
                            };
                        }
                    } else {
                        nextState1 = {
                            divTempShiftID: {
                                ...divTempShiftID,
                                TempShiftID: {
                                    ...TempShiftID,
                                    value: null,
                                    refresh: !TempShiftID.refresh
                                }
                            }
                        };
                    }

                    this.setState(nextState1, () => {
                        const { IsGetShiftByProfile, checkShiftByProfile } = this.state,
                            { WorkDateIn, WorkDateOut } = checkShiftByProfile;

                        this.GetOvertimeTypeByDate();
                        this.GetDurationTypeByDate(IsGetShiftByProfile.value);

                        //check cấu hình disabled ca nếu không có đk hộ
                        if (!this.isRegisterHelp) {
                            let _dataBody = {
                                ProfileID: dataBody.ProfileID,
                                WorkDate: dataBody.WorkDate
                            };
                            this.CheckRegisterOvertimeDayHaveShift({ ..._dataBody });
                        }

                        let timeStart = WorkDateIn.value ? moment(WorkDateIn.value).format('HH:mm') : null,
                            timeEnd = WorkDateOut.value ? moment(WorkDateOut.value).format('HH:mm') : null;
                        this.OnChangeHighSupervisor(timeStart, timeEnd);
                    });
                });
            });
        }
    };

    ChangeWorkDate = () => {
        const { WorkDate, isChoseProfile, Profiles, Profile, IsGetShiftByProfile } = this.state;
        let _wordate = WorkDate.value ? moment(WorkDate.value).format('YYYY-MM-DD HH:mm:ss') : null,
            _profileID = null,
            nextState = {};

        if (_wordate) {
            //có cấu hình đk ký hộ
            if (this.isRegisterHelp) {
                //chọn nhân viên > lấy nhân viên đầu tiên
                if (isChoseProfile) {
                    if (Profiles.value && Profiles.value[0]) {
                        _profileID = Profiles.value[0].ID;

                        if (Profiles.value.length > 1) {
                            this.isRegisterOrgOvertime = true;
                        }
                    }
                }
                //chọn phòng ban > set _profileID = null
                else {
                    _profileID = null;
                    this.isRegisterOrgOvertime = true;
                    this.isRegisterOrgOvertimeExcept = true;
                }
            } else {
                _profileID = Profile.ID;
                this.isRegisterOrgOvertime = false;
                this.isRegisterOrgOvertimeExcept = false;
            }

            if (_profileID) {
                this.GetConfigLoadShiftByProfileAndWorkDate().then(data => {
                    this._IsLoadShift = data;
                    this.GetShiftByProfileIDAndWorkDate(data, {
                        ProfileID: _profileID,
                        WorkDate: _wordate,
                        IsLoadShift: data
                    });
                });
            } else if (!isChoseProfile) {
                this.GetDurationTypeByDate(IsGetShiftByProfile.value);
            }

            // //unable các control sau khi chọn ngày hoặc phòng ban
            // if (_profileID || OrgStructures.value) {
            //     nextState = this.readOnlyCtrlOT(false);
            //     this.setState(nextState);
            // }
            // //disable các control khi bỏ chọn
            // else {
            //     nextState = this.readOnlyCtrlOT(true);
            //     this.setState(nextState);
            // }
        }
        //disable các control khi bỏ chọn
        else {
            nextState = this.readOnlyCtrlOT(true);
            this.setState(nextState);
        }
    };

    GetOvertimeTypeByDate = () => {
        const {
                WorkDate,
                divTempShiftID,
                Profiles,
                Profile,
                MethodPayment,
                isChoseProfile,
                checkShiftByProfile,
                divOvertimeTypeID,
                eleRegisterHours
            } = this.state,
            { RegisterHours } = eleRegisterHours,
            { OvertimeTypeID } = divOvertimeTypeID,
            { TempShiftID } = divTempShiftID,
            { WorkDateIn, WorkDateOut } = checkShiftByProfile;

        let _profileID = null,
            _wordate = WorkDate.value ? moment(WorkDate.value).format('YYYY-MM-DD HH:mm:ss') : null,
            _TempShiftID = TempShiftID.value ? TempShiftID.value.ID : null,
            _timeStart = WorkDateIn.value ? moment(WorkDateIn.value).format('HH:mm') : null,
            _timeEnd = WorkDateOut.value ? moment(WorkDateOut.value).format('HH:mm') : null,
            nextState = {};

        if (_wordate) {
            //có cấu hình đk ký hộ
            if (this.isRegisterHelp) {
                //chọn nhân viên > lấy nhân viên đầu tiên
                if (isChoseProfile) {
                    if (Profiles.value && Profiles.value[0]) _profileID = Profiles.value[0].ID;
                }
                //chọn phòng ban > set _profileID = null
                else {
                    _profileID = null;
                }
            } else {
                _profileID = Profile.ID;
            }

            if (_profileID) {
                //VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Att_GetData/GetOvertimeTypeByDate', {
                    ProfileID: _profileID,
                    WorkDate: _wordate,
                    ShiftID: _TempShiftID,
                    timeStart: _timeStart,
                    timeEnd: _timeEnd
                }).then(data => {
                    if (data[0] != null) {
                        if (this.allowOvertimeType != true) {
                            //$('#OvertimeType').addClass('hide');
                            nextState = {
                                divOvertimeTypeID: {
                                    ...divOvertimeTypeID,
                                    visible: false
                                }
                            };
                        } else {
                            //var OvertimeTypeID = $('#OvertimeTypeID').data("kendoDropDownList");
                            //OvertimeTypeID.value(data1[0]);
                            let _value = this.allowOvertimeType[0] ? this.allowOvertimeType[0] : null;
                            if (_value) {
                                nextState = {
                                    divOvertimeTypeID: {
                                        ...divOvertimeTypeID,
                                        OvertimeTypeID: {
                                            ...OvertimeTypeID,
                                            value: { ..._value },
                                            refresh: !OvertimeTypeID.refresh
                                        }
                                    }
                                };
                            }
                        }
                    }

                    if (data[1] != null) {
                        nextState = {
                            ...nextState,
                            MethodPayment: {
                                ...MethodPayment,
                                data: [...data[1]],
                                value: { ...data[1][0] },
                                refresh: !MethodPayment.refresh
                            }
                        };

                        if (data[2] != null) {
                            nextState = {
                                ...nextState,
                                MethodPayment: {
                                    ...nextState.MethodPayment,
                                    disable: data[2]
                                },
                                eleRegisterHours: {
                                    ...eleRegisterHours,
                                    RegisterHours: {
                                        ...RegisterHours,
                                        disable: data[2],
                                        refresh: !RegisterHours.refresh
                                    }
                                }
                            };
                        } else {
                            nextState = {
                                ...nextState,
                                MethodPayment: {
                                    ...nextState.MethodPayment,
                                    disable: false
                                },
                                eleRegisterHours: {
                                    ...eleRegisterHours,
                                    RegisterHours: {
                                        ...RegisterHours,
                                        disable: false,
                                        refresh: !RegisterHours.refresh
                                    }
                                }
                            };
                        }
                    }

                    this.setState(nextState);
                });
            }
        } else {
            ToasterSevice.showWarning('HRM_Format_DDMMYY', 4000);
        }
    };

    GetOvertimeDurationTypeDetailByDate = (nextState, dataBody) => {
        VnrLoadingSevices.show();

        HttpService.Post('[URI_HR]/Att_GetData/GetOvertimeDurationTypeDetailByDate', { ...dataBody }).then(res => {
            try {
                if (nextState.removeDurationType && nextState.removeDurationType.DurationType && res) {
                    if (nextState.removeDurationType.DurationType.data) {
                        let findValue = nextState.removeDurationType.DurationType.data.find(item => item.Value == res);
                        nextState.removeDurationType.DurationType.value = findValue
                            ? findValue
                            : {
                                Value: res,
                                Text: translate(res)
                            };
                    }
                    nextState.removeDurationType.DurationType.disable = false;
                }

                this.setState(nextState, () => {
                    VnrLoadingSevices.hide();
                });
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });

        //if (isGetConfigLoadShiftByProfileAndWorkDate) {
        const { WorkDate, divTempShiftID, divShiftID } = this.state,
            { TempShiftID } = divTempShiftID,
            { ShiftID } = divShiftID;

        let _profileID = dataBody.ProfileID,
            _wordate = WorkDate.value ? moment(WorkDate.value).format('YYYY-MM-DD HH:mm:ss') : null,
            nextState1 = {};

        this.GetConfigLoadShiftByProfileAndWorkDate().then(data => {
            this._IsLoadShift = data;
            if (data == false) {
                nextState1 = {
                    divTempShiftID: {
                        ...divTempShiftID,
                        TempShiftID: {
                            ...TempShiftID,
                            value: null,
                            refresh: !TempShiftID.refresh
                        }
                    }
                };

                this.setState(nextState1, () => {
                    const { divShiftID } = this.state,
                        { ShiftID } = divShiftID;

                    HttpService.Post('[URI_HR]/Att_GetData/GetShiftByProfileIDAndWorkDate', {
                        ProfileID: _profileID,
                        WorkDate: _wordate,
                        IsLoadShift: data
                    }).then(data => {
                        if (data != '') {
                            this.setState({
                                divShiftID: {
                                    ...divShiftID,
                                    ShiftID: {
                                        ...ShiftID,
                                        value: { ...data[0] },
                                        refresh: !ShiftID.refresh
                                    }
                                }
                            });
                        } else {
                            this.setState({
                                divShiftID: {
                                    ...divShiftID,
                                    ShiftID: {
                                        ...ShiftID,
                                        value: null,
                                        refresh: !ShiftID.refresh
                                    }
                                }
                            });
                        }
                    });
                });
            } else if (data == true) {
                nextState1 = {
                    divShiftID: {
                        ...divShiftID,
                        ShiftID: {
                            ...ShiftID,
                            value: null,
                            refresh: !ShiftID.refresh
                        }
                    }
                };

                this.setState(nextState1, () => {
                    const { divTempShiftID } = this.state,
                        { TempShiftID } = divTempShiftID;

                    HttpService.Post('[URI_HR]/Att_GetData/GetShiftByProfileIDAndWorkDate', {
                        ProfileID: _profileID,
                        WorkDate: _wordate,
                        IsLoadShift: data
                    }).then(data => {
                        if (data != '') {
                            if (data[0].IndexShiftByWorkDate != null) {
                                let _IndexShiftByWorkDate = data[0].IndexShiftByWorkDate;
                                this.setState({
                                    divTempShiftID: {
                                        ...divTempShiftID,
                                        TempShiftID: {
                                            ...TempShiftID,
                                            data: [...data],
                                            value: { ...data[_IndexShiftByWorkDate] },
                                            refresh: !TempShiftID.refresh
                                        }
                                    }
                                });
                            } else {
                                this.setState({
                                    divTempShiftID: {
                                        ...divTempShiftID,
                                        TempShiftID: {
                                            ...TempShiftID,
                                            data: [...data],
                                            value: null,
                                            refresh: !TempShiftID.refresh
                                        }
                                    }
                                });
                            }
                        } else {
                            this.setState({
                                divTempShiftID: {
                                    ...divTempShiftID,
                                    TempShiftID: {
                                        ...TempShiftID,
                                        value: null,
                                        refresh: !TempShiftID.refresh
                                    }
                                }
                            });
                        }
                    });
                });
            }
        });
        //}
    };

    GetDurationTypeByDate = isGetShiftByProfile => {
        const { WorkDate, Profiles, Profile, OrgStructures, isChoseProfile, removeDurationType } = this.state,
            { DurationType } = removeDurationType;

        let _profileID = null,
            _wordate = WorkDate.value ? moment(WorkDate.value).format('YYYY-MM-DD HH:mm:ss') : null,
            nextState = {};

        //có cấu hình đk ký hộ
        if (this.isRegisterHelp) {
            //chọn nhân viên > lấy nhân viên đầu tiên
            if (isChoseProfile) {
                if (Profiles.value && Profiles.value[0]) {
                    _profileID = Profiles.value[0].ID;
                }
            }
            //chọn phòng ban > set _profileID = null
            else {
                _profileID = null;
            }
        } else {
            _profileID = Profile.ID;
        }

        if (_wordate) {
            //chọn nhân viên
            if (_profileID) {
                VnrLoadingSevices.show();
                HttpService.Post('[URI_HR]/Att_Getdata/GetOvertimeDurationTypeByDate', {
                    ProfileID: _profileID,
                    WorkDate: _wordate,
                    IsPortal: true
                }).then(data => {
                    try {
                        let dataSource = [];

                        //chỉ lấy trước ca, sau ca nếu có check Lấy ca theo NV
                        if (isGetShiftByProfile) {
                            for (var i = 0; i < data.length; i++) {
                                if (data[i].Name == 'E_OT_LATE' || data[i].Name == 'E_OT_EARLY') {
                                    dataSource.push({
                                        Text: data[i].Translate,
                                        Value: data[i].Name
                                    });
                                }
                            }
                        } else {
                            for (let i = 0; i < data.length; i++) {
                                if (data[i]) dataSource.push({ Text: data[i].Translate, Value: data[i].Name });
                            }
                        }

                        nextState = {
                            removeDurationType: {
                                ...removeDurationType,
                                DurationType: {
                                    ...DurationType,
                                    disable: false,
                                    data: [...dataSource],
                                    value: null,
                                    refresh: !DurationType.refresh
                                }
                            }
                        };

                        //thêm xử lý 03/12/2019 task 110859
                        this.GetOvertimeDurationTypeDetailByDate(nextState, {
                            ProfileID: _profileID,
                            WorkDate: _wordate
                        });
                    } catch (error) {
                        VnrLoadingSevices.hide();
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });
            }
            //chọn phòng ban
            else if (!isChoseProfile) {
                let _orgNumber = OrgStructures.value ? OrgStructures.value.map(item => item.OrderNumber).join() : '';

                this.GetProfileByOrgNumber({ orgNumber: _orgNumber }).then(returnValue => {
                    if (returnValue) {
                        HttpService.Post('[URI_HR]/Att_GetData/GetOvertimeDurationTypeByDate', {
                            ProfileID: returnValue,
                            WorkDate: _wordate,
                            IsPortal: true
                        }).then(data => {
                            var dataSource = [];

                            //chỉ lấy trước ca, sau ca nếu có check Lấy ca theo NV
                            if (isGetShiftByProfile) {
                                for (var i = 0; i < data.length; i++) {
                                    if (data[i].Name == 'E_OT_LATE' || data[i].Name == 'E_OT_EARLY') {
                                        dataSource.push({
                                            Text: data[i].Translate,
                                            Value: data[i].Name
                                        });
                                    }
                                }
                            } else {
                                for (let i = 0; i < data.length; i++) {
                                    dataSource.push({
                                        Text: data[i].Translate,
                                        Value: data[i].Name
                                    });
                                }
                            }

                            nextState = {
                                removeDurationType: {
                                    ...removeDurationType,
                                    DurationType: {
                                        ...DurationType,
                                        disable: false,
                                        data: [...dataSource],
                                        value: null,
                                        refresh: !DurationType.refresh
                                    }
                                }
                            };

                            //thêm xử lý 03/12/2019 task 110859
                            this.GetOvertimeDurationTypeDetailByDate(nextState, {
                                ProfileID: returnValue,
                                WorkDate: _wordate
                            });
                        });
                    }
                });
            }
        }
    };

    GetProfileByOrgNumber = async dataBody => {
        return await HttpService.Post('[URI_HR]/Att_GetData/GetProfileByOrgNumber', { ...dataBody });
    };

    ComputeResgistHourOrEndHourtOT = (_TypeOT, _RegistHour, _ShiftID) => {
        if (!_RegistHour || _RegistHour === '') _RegistHour = 0;

        const { checkShiftByProfile, IsBreakAsWork, WorkDate } = this.state,
            { WorkDateIn, WorkDateOut } = checkShiftByProfile;

        let dataBody = {};
        if (IsBreakAsWork.visible && IsBreakAsWork.visibleConfig) {
            dataBody = {
                workDate: WorkDate.value ? moment(WorkDate.value).format('MM/DD/YYYY HH:mm:ss') : null,
                isBreakAsWork: IsBreakAsWork.value
            };
        }
        if (_ShiftID) {
            HttpService.Post('[URI_HR]/Att_GetData/GetRegistHourOrEndHourOT', {
                ShiftID: _ShiftID,
                RegistHour: _RegistHour,
                TypeOT: _TypeOT,
                ...dataBody
            }).then(data => {
                if (data) {
                    let _WorkDateInVal =
                            data.StartHourOT && data.StartHourOT.indexOf(':') > 0
                                ? moment()
                                    .hours(data.StartHourOT.split(':')[0])
                                    .minute(data.StartHourOT.split(':')[1])
                                    .toDate()
                                : null,
                        _WorkDateOutVal =
                            data.EndHourOT && data.EndHourOT.indexOf(':') > 0
                                ? moment()
                                    .hours(data.EndHourOT.split(':')[0])
                                    .minute(data.EndHourOT.split(':')[1])
                                    .toDate()
                                : null,
                        nextState = {
                            checkShiftByProfile: {
                                ...checkShiftByProfile,
                                WorkDateIn: {
                                    ...WorkDateIn,
                                    value: _WorkDateInVal,
                                    refresh: !WorkDateIn.refresh
                                },
                                WorkDateOut: {
                                    ...WorkDateOut,
                                    value: _WorkDateOutVal,
                                    refresh: !WorkDateOut.refresh
                                }
                            }
                        };

                    this.setState(nextState, () => this.GetOvertimeTypeByDate());
                }
            });
        }
    };

    UpdateRegisterHours = () => {
        const {
                eleRegisterHours,
                IsOverTimeBreak,
                removeDurationType,
                divShiftID,
                divTempShiftID,
                checkShiftByProfile
            } = this.state,
            { RegisterHours } = eleRegisterHours,
            { WorkDateIn, WorkDateOut } = checkShiftByProfile,
            { ShiftID } = divShiftID,
            { TempShiftID } = divTempShiftID,
            { DurationType } = removeDurationType;

        let shiftID = TempShiftID.value ? TempShiftID.value.ID : ShiftID.value ? ShiftID.value.ID : null,
            timeStart = WorkDateIn.value ? moment(WorkDateIn.value).format('HH:mm') : null,
            timeEnd = WorkDateOut.value ? moment(WorkDateOut.value).format('HH:mm') : null,
            durationType = DurationType.value ? DurationType.value.Value : null;

        HttpService.Post('[URI_HR]/Att_GetData/UpdateRegisterHours', {
            timeStart: timeStart,
            timeEnd: timeEnd,
            shiftID: shiftID,
            DurationType: durationType,
            IsOverTimeBreak: IsOverTimeBreak.value
        }).then(data => {
            this.setState(
                {
                    eleRegisterHours: {
                        ...eleRegisterHours,
                        RegisterHours: {
                            ...RegisterHours,
                            value: data ? data.toString() : data,
                            refresh: !RegisterHours.refresh
                        }
                    }
                },
                () => {
                    this.OnChangeHighSupervisor(timeStart, timeEnd);
                }
            );
        });
    };

    UpdateEndOT = (isRegister, isChangeByTimeOut) => {
        const {
                eleRegisterHours,
                removeDurationType,
                WorkDate,
                divShiftID,
                divTempShiftID,
                checkShiftByProfile,
                IsBreakAsWork
            } = this.state,
            { RegisterHours } = eleRegisterHours,
            { WorkDateIn, WorkDateOut } = checkShiftByProfile,
            { ShiftID } = divShiftID,
            { TempShiftID } = divTempShiftID,
            { DurationType } = removeDurationType;

        let shiftID = TempShiftID.value ? TempShiftID.value.ID : ShiftID.value ? ShiftID.value.ID : null,
            timeStart = WorkDateIn.value ? moment(WorkDateIn.value).format('HH:mm') : null,
            timeEnd = WorkDateOut.value ? moment(WorkDateOut.value).format('HH:mm') : null,
            durationType = DurationType.value ? DurationType.value.Value : null,
            workdateRoot = WorkDate.value ? moment(WorkDate.value).format('YYYY-MM-DD HH:mm:ss') : null;

        //#region [remove]
        // if (isRegister != false) {
        //     if (ShiftID.value) {
        //         this.ComputeResgistHourOrEndHourtOT(durationType, RegisterHours.value, ShiftID.value.ID);
        //     }
        //     if (TempShiftID.value) {
        //         this.ComputeResgistHourOrEndHourtOT(durationType, RegisterHours.value, TempShiftID.value.ID);
        //     }
        // }

        //if (!_enumEARLY) _enumEARLY = 'E_OT_EARLY';
        //#endregion

        if (shiftID) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/UpdateStartOT', {
                timeStart: timeStart,
                timeEnd: timeEnd,
                RegisterHours: RegisterHours.value,
                ShiftID: shiftID,
                DurationType: durationType,
                WorkdateRoot: workdateRoot,
                IsOverTimeBreak: false,
                IsChangeByTimeOut: isChangeByTimeOut,
                isBreakAsWork: IsBreakAsWork.value
            }).then(data => {
                VnrLoadingSevices.hide();

                if (data == 'WaringRegisterHourGreaterThanTimeBreak') {
                    ToasterSevice.showWarning(data, 5000);
                } else if (data == 'WaringRegisterHourGreaterThanTimeWithinShift') {
                    ToasterSevice.showWarning(data, 5000);
                } else if (durationType == 'E_OT_EARLY') {
                    if (data.indexOf('|') == 5) {
                        let strDate = data.split('|'),
                            _WorkDateInVal =
                                    strDate[0] && strDate[0].indexOf(':') > 0
                                        ? moment()
                                            .hours(strDate[0].split(':')[0])
                                            .minute(strDate[0].split(':')[1])
                                            .toDate()
                                        : null,
                            _WorkDateOutVal =
                                    strDate[1] && strDate[1].indexOf(':') > 0
                                        ? moment()
                                            .hours(strDate[1].split(':')[0])
                                            .minute(strDate[1].split(':')[1])
                                            .toDate()
                                        : null;

                        let nextState1 = {
                            checkShiftByProfile: {
                                ...checkShiftByProfile,
                                WorkDateIn: {
                                    ...WorkDateIn,
                                    value: _WorkDateInVal,
                                    refresh: !WorkDateIn.refresh
                                },
                                WorkDateOut: {
                                    ...WorkDateOut,
                                    value: _WorkDateOutVal,
                                    refresh: !WorkDateOut.refresh
                                }
                            }
                        };

                        this.setState(nextState1, () => {
                            // task: 0163864
                            if (isRegister != false && !timeStart && !timeEnd) {
                                if (ShiftID.value) {
                                    this.ComputeResgistHourOrEndHourtOT(
                                        durationType,
                                        RegisterHours.value,
                                        ShiftID.value.ID
                                    );
                                }
                                if (TempShiftID.value) {
                                    this.ComputeResgistHourOrEndHourtOT(
                                        durationType,
                                        RegisterHours.value,
                                        TempShiftID.value.ID
                                    );
                                }
                            }

                            this.OnChangeHighSupervisor(strDate[0], strDate[1]);
                        });
                    }
                }
                //xử lý cho task Thêm Loại OT - 117552
                else if (durationType == 'E_OT_BREAK_AFTER' || durationType == 'E_OT_BREAK_BEFORE') {
                    if (data.indexOf('|') != -1) {
                        let strDate = data.split('|'),
                            _WorkDateInVal =
                                    strDate[0] && strDate[0].indexOf(':') > 0
                                        ? moment()
                                            .hours(strDate[0].split(':')[0])
                                            .minute(strDate[0].split(':')[1])
                                            .toDate()
                                        : null,
                            _WorkDateOutVal =
                                    strDate[1] && strDate[1].indexOf(':') > 0
                                        ? moment()
                                            .hours(strDate[1].split(':')[0])
                                            .minute(strDate[1].split(':')[1])
                                            .toDate()
                                        : null,
                            _RegisterHours = strDate[2];

                        let nextState1 = {
                            checkShiftByProfile: {
                                ...checkShiftByProfile,
                                WorkDateIn: {
                                    ...WorkDateIn,
                                    value: _WorkDateInVal,
                                    refresh: !WorkDateIn.refresh
                                },
                                WorkDateOut: {
                                    ...WorkDateOut,
                                    value: _WorkDateOutVal,
                                    refresh: !WorkDateOut.refresh
                                }
                            },
                            eleRegisterHours: {
                                ...eleRegisterHours,
                                RegisterHours: {
                                    ...RegisterHours,
                                    refresh: !RegisterHours.refresh,
                                    value: _RegisterHours
                                }
                            }
                        };

                        this.setState(nextState1, () => {
                            if (isRegister != false && !timeStart && !timeEnd) {
                                if (ShiftID.value) {
                                    this.ComputeResgistHourOrEndHourtOT(
                                        durationType,
                                        RegisterHours.value,
                                        ShiftID.value.ID
                                    );
                                } else if (TempShiftID.value) {
                                    this.ComputeResgistHourOrEndHourtOT(
                                        durationType,
                                        RegisterHours.value,
                                        TempShiftID.value.ID
                                    );
                                }
                            }

                            this.OnChangeHighSupervisor(strDate[0], strDate[1]);
                        });
                    }
                } else if (data.indexOf('|') == 5) {
                    let strDate = data.split('|'),
                        _WorkDateInVal =
                                    strDate[0] && strDate[0].indexOf(':') > 0
                                        ? moment()
                                            .hours(strDate[0].split(':')[0])
                                            .minute(strDate[0].split(':')[1])
                                            .toDate()
                                        : null,
                        _WorkDateOutVal =
                                    strDate[1] && strDate[1].indexOf(':') > 0
                                        ? moment()
                                            .hours(strDate[1].split(':')[0])
                                            .minute(strDate[1].split(':')[1])
                                            .toDate()
                                        : null;

                    let nextState1 = {
                        checkShiftByProfile: {
                            ...checkShiftByProfile,
                            WorkDateIn: {
                                ...WorkDateIn,
                                value: _WorkDateInVal,
                                refresh: !WorkDateIn.refresh
                            },
                            WorkDateOut: {
                                ...WorkDateOut,
                                value: _WorkDateOutVal,
                                refresh: !WorkDateOut.refresh
                            }
                        }
                    };

                    this.setState(nextState1, () => {
                        if (isRegister != false && !timeStart && !timeEnd) {
                            if (ShiftID.value) {
                                this.ComputeResgistHourOrEndHourtOT(
                                    durationType,
                                    RegisterHours.value,
                                    ShiftID.value.ID
                                );
                            } else if (TempShiftID.value) {
                                this.ComputeResgistHourOrEndHourtOT(
                                    durationType,
                                    RegisterHours.value,
                                    TempShiftID.value.ID
                                );
                            }
                        }

                        this.OnChangeHighSupervisor(strDate[0], strDate[1]);
                    });
                } else {
                    let _WorkDateOutVal =
                                    data.indexOf(':') > 0
                                        ? moment()
                                            .hours(data.split(':')[0])
                                            .minute(data.split(':')[1])
                                            .toDate()
                                        : null,
                        nextState1 = {
                            checkShiftByProfile: {
                                ...checkShiftByProfile,
                                // WorkDateIn: {
                                //     ...WorkDateIn,
                                //     value: strDate[0],
                                //     refresh: !WorkDateIn.refresh
                                // },
                                WorkDateOut: {
                                    ...WorkDateOut,
                                    value: _WorkDateOutVal,
                                    refresh: !WorkDateOut.refresh
                                }
                            }
                        };

                    this.setState(nextState1, () => {
                        if (isRegister != false && !timeStart && !timeEnd) {
                            if (ShiftID.value) {
                                this.ComputeResgistHourOrEndHourtOT(
                                    durationType,
                                    RegisterHours.value,
                                    ShiftID.value.ID
                                );
                            }
                            if (TempShiftID.value) {
                                this.ComputeResgistHourOrEndHourtOT(
                                    durationType,
                                    RegisterHours.value,
                                    TempShiftID.value.ID
                                );
                            }
                        }

                        const { checkShiftByProfile } = this.state,
                            { WorkDateIn } = checkShiftByProfile;
                        let _WorkDateInVal = WorkDateIn.value ? moment(WorkDateIn.value).format('HH:mm') : null;
                        this.OnChangeHighSupervisor(_WorkDateInVal, data);
                    });
                }
            });
        }

        //[Tin.Nguyen - 20170403] xét cấu hình số giờ tăng ca tối thiểu đăng ký ăn
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Sal_GetData/GetConfigElement', {
            Key: 'HRM_ATT_OT_MINHOURSTOREGISTEDFOOD'
        }).then(returnValue => {
            VnrLoadingSevices.hide();
            try {
                const { divIsRegistedFood, eleRegisterHours } = this.state,
                    { RegisterHours } = eleRegisterHours;

                let nextState = {};

                if (returnValue && returnValue.Value1) {
                    var registedHours = RegisterHours.value,
                        registedHoursConfig = parseFloat(returnValue.Value1);

                    if (registedHours >= registedHoursConfig) {
                        nextState = {
                            divIsRegistedFood: {
                                ...divIsRegistedFood,
                                visibleConfig: true
                            }
                        };
                    } else {
                        nextState = {
                            divIsRegistedFood: {
                                ...divIsRegistedFood,
                                visibleConfig: false
                            }
                        };
                    }
                } else {
                    nextState = {
                        divIsRegistedFood: {
                            ...divIsRegistedFood,
                            visibleConfig: false
                        }
                    };
                }

                this.setState(nextState);
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    onChangeListRegisterHours = RegisterHoursConfigVal => {
        const { eleRegisterHours } = this.state,
            { RegisterHours } = eleRegisterHours;

        this.setState(
            {
                eleRegisterHours: {
                    ...eleRegisterHours,
                    RegisterHours: {
                        ...RegisterHours,
                        value: RegisterHoursConfigVal ? RegisterHoursConfigVal.Value : null,
                        refresh: !RegisterHours.refresh
                    }
                }
            },
            () => {
                this.UpdateEndOT(true);
            }
        );
    };

    GetConfigLoadShiftByProfileAndWorkDate = async () => {
        return await HttpService.Post('[URI_HR]/Att_GetData/GetConfigLoadShiftByProfileAndWorkDate');
    };

    ShowShiftByProfileAndWorkDay = () => {
        const { divShiftID, Profiles, divTempShiftID, WorkDate, IsGetShiftByProfile } = this.state,
            { ShiftID } = divShiftID,
            { TempShiftID } = divTempShiftID;

        let _profileIds = Profiles.value ? Profiles.value.map(item => item.ID) : null,
            nextState = {};

        if (_profileIds != null) {
            var arrprofileIds = _profileIds.splice(',');
            if (arrprofileIds.length == 1) {
                let _workDate = WorkDate.value ? moment(WorkDate.value).format('YYYY-MM-DD HH:mm:ss') : null;
                if (_workDate != null && _workDate != '') {
                    //ktra xem co cau hinh hien thi ca mac dinh theo nhan vien k
                    this.GetConfigLoadShiftByProfileAndWorkDate().then(data => {
                        this._IsLoadShift = data;

                        if (data == false) {
                            nextState = {
                                divShiftID: {
                                    ...divShiftID,
                                    visible: true
                                },
                                divTempShiftID: {
                                    ...divTempShiftID,
                                    visible: false,
                                    TempShiftID: {
                                        ...TempShiftID,
                                        value: null,
                                        refresh: !TempShiftID.refresh
                                    }
                                }
                            };

                            HttpService.Post('[URI_HR]/Att_GetData/GetShiftByProfileIDAndWorkDate', {
                                ProfileID: arrprofileIds[0],
                                WorkDate: _workDate,
                                IsLoadShift: false
                            }).then(data => {
                                if (data != '') {
                                    //_ShiftData.value(data[0].ID);
                                    nextState = {
                                        ...nextState,
                                        divShiftID: {
                                            ...nextState.divShiftID,
                                            ShiftID: {
                                                ...nextState.divShiftID.ShiftID,
                                                value: { ...data[0] },
                                                refresh: !ShiftID.refresh
                                            }
                                        }
                                    };
                                } else {
                                    //_ShiftData.value(null);
                                    nextState = {
                                        ...nextState,
                                        divShiftID: {
                                            ...nextState.divShiftID,
                                            ShiftID: {
                                                ...nextState.divShiftID.ShiftID,
                                                value: null,
                                                refresh: !ShiftID.refresh
                                            }
                                        }
                                    };
                                }

                                this.setState(nextState);
                            });
                        } else if (data == true) {
                            nextState = {
                                divShiftID: {
                                    ...divShiftID,
                                    visible: false,
                                    ShiftID: {
                                        ...ShiftID,
                                        value: null,
                                        refresh: !ShiftID.refresh
                                    }
                                },
                                divTempShiftID: {
                                    ...divTempShiftID,
                                    visible: true
                                }
                            };

                            HttpService.Post('[URI_HR]/Att_GetData/GetShiftByProfileIDAndWorkDate', {
                                ProfileID: arrprofileIds[0],
                                WorkDate: _workDate,
                                IsLoadShift: true
                            }).then(data => {
                                if (data != '') {
                                    //_dropdownTempShiftID.setDataSource(data);
                                    if (data[0].IndexShiftByWorkDate != null) {
                                        let _IndexShiftByWorkDate = data[0].IndexShiftByWorkDate;
                                        //_dropdownTempShiftID.value(data[_IndexShiftByWorkDate].ID);

                                        nextState = {
                                            ...nextState,
                                            divTempShiftID: {
                                                ...nextState.divTempShiftID,
                                                data: [...data],
                                                value: { ...data[_IndexShiftByWorkDate] },
                                                refresh: !divTempShiftID.refresh
                                            }
                                        };
                                    } else {
                                        //_dropdownTempShiftID.value(null);
                                        nextState = {
                                            ...nextState,
                                            divTempShiftID: {
                                                ...nextState.divTempShiftID,
                                                data: [...data],
                                                value: null,
                                                refresh: !divTempShiftID.refresh
                                            }
                                        };
                                    }
                                } else {
                                    //_dropdownTempShiftID.value(null);
                                    nextState = {
                                        ...nextState,
                                        divTempShiftID: {
                                            ...nextState.divTempShiftID,
                                            value: null,
                                            refresh: !divTempShiftID.refresh
                                        }
                                    };
                                }

                                this.setState(nextState);
                            });
                        }
                    });
                }
            }

            if (IsGetShiftByProfile.value) {
                // isShowEle(frm + ' #divShiftID', false);
                // isShowEle(frm + ' #divTempShiftID', false);
                this.setState({
                    divTempShiftID: {
                        ...divTempShiftID,
                        visible: false
                    },
                    divShiftID: {
                        ...divShiftID,
                        visible: false
                    }
                });
            }
        } else {
            //_dropdownTempShiftID.value(null);
            //_ShiftData.value(null);
            this.setState({
                divTempShiftID: {
                    ...divTempShiftID,
                    visible: false,
                    TempShiftID: {
                        ...TempShiftID,
                        value: null,
                        refresh: !TempShiftID.refresh
                    }
                },
                divShiftID: {
                    ...divShiftID,
                    ShiftID: {
                        ...ShiftID,
                        value: null,
                        refresh: !ShiftID.refresh
                    }
                }
            });
        }
    };

    UpdateWorkDateIn = () => {
        // nhan.nguyen: 0174745
        // this.UpdateEndOT(false, true);
        this.UpdateRegisterHours();
    };

    GetJobType = () => {
        const { Profiles, Profile, WorkDate, OrgStructures } = this.state;
        let _profileID = Profiles.value ? Profiles.value.map(item => item.ID).join() : '',
            org = OrgStructures.value ? OrgStructures.value.map(item => item.OrderNumber).join() : '',
            _workday = WorkDate.value ? moment(WorkDate.value).format('YYYY-MM-DD HH:mm:ss') : null;

        if (!this.isRegisterHelp) {
            _profileID = Profile.ID;
        }

        if (_workday && (_profileID || org)) {
            HttpService.Post('[URI_HR]/Att_GetData/GetJobType', {
                ProfileId: _profileID,
                workDate: _workday,
                lstOrg: org
            }).then(data => {
                if (!data) return;

                const { JobTypeID } = this.state;
                this.setState({
                    JobTypeID: {
                        ...JobTypeID,
                        data: [...data],
                        refresh: !JobTypeID.refresh
                    }
                });
            });
        }
    };
    //#endregion

    //#region [chọn nhân viên, phòng ban]

    //chọn nhân viên hoặc phòng ban
    onChangeRadioButton = value => {
        let nextState = { isChoseProfile: value };

        // //chọn phòng ban
        // if (this.isRegisterHelp && !value) {
        //     this.isChooseMultiPro = true;
        //     this.isChangeLevelLeavedayApprove = true;
        //     //validate lam sau
        //     //$('label[control-field=UserApproveID] > span').remove()
        //     //$('label[control-field=UserApproveID2] > span').remove()

        //     nextState = {
        //         ...nextState,
        //         UserApprove: {
        //             ...UserApprove,
        //             value: null,
        //             refresh: !UserApprove.refresh
        //         },
        //         UserApprove2: {
        //             ...UserApprove2,
        //             value: null,
        //             refresh: !UserApprove2.refresh
        //         },
        //         UserApprove3: {
        //             ...UserApprove3,
        //             value: null,
        //             refresh: !UserApprove3.refresh
        //         },
        //         UserApprove4: {
        //             ...UserApprove4,
        //             value: null,
        //             refresh: !UserApprove4.refresh
        //         }
        //     }
        // }
        // //nếu ngược lại là nhân viên có thêm 2 trường hợp
        // else if (this.isRegisterHelp) {
        //     this.isChooseMultiPro = false;
        //     this.isChangeLevelLeavedayApprove = false;
        //     //validate lam sau
        //     // if (!$('label[control-field=UserApproveID]').children().is('span'))
        //     //     $('label[control-field=UserApproveID]').append('<span>(*)</span>')
        //     // if (!$('label[control-field=UserApproveID2]').children().is('span'))
        //     //     $('label[control-field=UserApproveID2]').append('<span>(*)</span>')
        // }

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
                    this.ChangeWorkDate();

                    const { Profiles, WorkDate, divShiftID, divTempShiftID, UserApprove, UserApprove2, UserApprove3, UserApprove4 } = this.state;

                    let pro = Profiles.value[0].ID,
                        userSubmit = profileInfo[enumName.E_ProfileID],
                        nextState1 = {};

                    if (Profiles.value != null && Profiles.value.length >= 2) {
                        this.RemoveValidateUser(true);
                        this.isRegisterOrgOvertime = true;
                    } else {
                        this.RemoveValidateUser(false);
                        this.isRegisterOrgOvertime = false;
                        this.isRegisterOrgOvertimeExcept = false;

                        nextState1 = {
                            divShiftID: {
                                ...divShiftID,
                                visible: true
                            },
                            divTempShiftID: {
                                ...divTempShiftID,
                                visible: false
                            }
                        };
                    }

                    if (pro) {
                        this.GetHighSupervior(pro, userSubmit, 'E_OVERTIME');

                        //unable các control sau khi chọn profile và có workdate
                        if (WorkDate.value) {
                            let _divShiftIDVisible = nextState1.divShiftID ? true : divShiftID.ShiftID.visible,
                                _state1 = this.readOnlyCtrlOT(false);

                            _state1.divShiftID.ShiftID.visible = _divShiftIDVisible;
                            nextState1 = {
                                ...nextState1,
                                ..._state1
                            };
                        }
                    } else {
                        //disable các control khi bỏ chọn
                        let _state1 = this.readOnlyCtrlOT(true),
                            _UserApprove = _state1.UserApprove ? { ...nextState1.UserApprove } : { ...UserApprove },
                            _UserApprove2 = _state1.UserApprove2 ? { ...nextState1.UserApprove2 } : { ...UserApprove2 },
                            _UserApprove3 = _state1.UserApprove3 ? { ...nextState1.UserApprove3 } : { ...UserApprove3 },
                            _UserApprove4 = _state1.UserApprove4 ? { ...nextState1.UserApprove4 } : { ...UserApprove4 };

                        nextState1 = {
                            ...nextState1,
                            UserApprove: {
                                ..._UserApprove,
                                value: null,
                                refresh: !UserApprove.refresh
                            },
                            UserApprove2: {
                                ..._UserApprove2,
                                value: null,
                                refresh: !UserApprove2.refresh
                            },
                            UserApprove3: {
                                ..._UserApprove3,
                                value: null,
                                refresh: !UserApprove3.refresh
                            },
                            UserApprove4: {
                                ..._UserApprove4,
                                value: null,
                                refresh: !UserApprove4.refresh
                            }
                        };
                    }

                    this.setState(nextState1, () => {
                        this.ShowShiftByProfileAndWorkDay();

                        //load dữ liệu cho dropdown loại công việc
                        this.GetJobType();
                    });
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
                this.ChangeWorkDate();

                const {
                    Profiles,
                    WorkDate,
                    divShiftID,
                    divTempShiftID,
                    UserApprove,
                    UserApprove2,
                    UserApprove3,
                    UserApprove4
                } = this.state;

                let pro = Profiles.value && Profiles.value[0] ? Profiles.value[0].ID : null,
                    userSubmit = profileInfo[enumName.E_ProfileID],
                    nextState1 = {};

                if (Profiles.value != null && Profiles.value.length >= 2) {
                    this.RemoveValidateUser(true);
                    this.isRegisterOrgOvertime = true;
                } else {
                    this.RemoveValidateUser(false);
                    this.isRegisterOrgOvertime = false;
                    this.isRegisterOrgOvertimeExcept = false;

                    // isShowEle(frm + ' #divShiftID', true);
                    // isShowEle(frm + ' #divTempShiftID', false);

                    nextState1 = {
                        divShiftID: {
                            ...divShiftID,
                            visible: true
                        },
                        divTempShiftID: {
                            ...divTempShiftID,
                            visible: false
                        }
                    };
                }

                if (pro) {
                    this.GetHighSupervior(pro, userSubmit, 'E_OVERTIME');

                    //unable các control sau khi chọn profile và có workdate
                    if (WorkDate.value) {
                        let _divShiftIDVisible = nextState1.divShiftID ? true : divShiftID.ShiftID.visible,
                            _state1 = this.readOnlyCtrlOT(false);

                        _state1.divShiftID.ShiftID.visible = _divShiftIDVisible;
                        nextState1 = {
                            ...nextState1,
                            ..._state1
                        };
                    }
                } else {
                    // var multiUserApproveID = $("#UserApproveID").data("kendoComboBox"),
                    //     multiUserApproveID2 = $("#UserApproveID3").data("kendoComboBox"),
                    //     multiUserApproveID3 = $("#UserApproveID4").data("kendoComboBox"),
                    //     multiUserApproveID4 = $("#UserApproveID2").data("kendoComboBox");

                    // multiUserApproveID.value(null);
                    // multiUserApproveID2.value(null);
                    // multiUserApproveID3.value(null);
                    // multiUserApproveID4.value(null);

                    //disable các control khi bỏ chọn
                    let _state1 = this.readOnlyCtrlOT(true),
                        _UserApprove = _state1.UserApprove ? { ...nextState1.UserApprove } : { ...UserApprove },
                        _UserApprove2 = _state1.UserApprove2 ? { ...nextState1.UserApprove2 } : { ...UserApprove2 },
                        _UserApprove3 = _state1.UserApprove3 ? { ...nextState1.UserApprove3 } : { ...UserApprove3 },
                        _UserApprove4 = _state1.UserApprove4 ? { ...nextState1.UserApprove4 } : { ...UserApprove4 };

                    nextState1 = {
                        ...nextState1,
                        UserApprove: {
                            ..._UserApprove,
                            value: null,
                            refresh: !UserApprove.refresh
                        },
                        UserApprove2: {
                            ..._UserApprove2,
                            value: null,
                            refresh: !UserApprove2.refresh
                        },
                        UserApprove3: {
                            ..._UserApprove3,
                            value: null,
                            refresh: !UserApprove3.refresh
                        },
                        UserApprove4: {
                            ..._UserApprove4,
                            value: null,
                            refresh: !UserApprove4.refresh
                        }
                    };
                }

                this.setState(nextState1, () => {
                    this.ShowShiftByProfileAndWorkDay();

                    //load dữ liệu cho dropdown loại công việc
                    this.GetJobType();
                });
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
                if (items && items.length) {
                    const { OrgStructures, WorkDate } = this.state;
                    let _orgNumber = OrgStructures.value
                        ? OrgStructures.value.map(item => item.OrderNumber).join()
                        : '';

                    this.GetProfileByOrgNumber({ orgNumber: _orgNumber }).then(returnValue => {
                        this.isRegisterOrgOvertimeExcept = true;
                        //set biến này là true thì nó auto vào điều kiện giống như chọn 2 người trở lên
                        this.isRegisterOrgOvertime = true;
                        if (returnValue)
                            this.GetHighSupervior(returnValue, profileInfo[enumName.E_ProfileID], 'E_OVERTIME');

                        //unable các control sau khi chọn phòng ban và có workdate
                        if (WorkDate.value) {
                            let _state1 = this.readOnlyCtrlOT(false);
                            this.setState({ ..._state1 }, () => {
                                this.GetJobType();
                            });
                        } else {
                            let _state1 = this.readOnlyCtrlOT(true);
                            this.setState({ ..._state1 }, () => {
                                this.GetJobType();
                            });
                        }
                    });
                }
                //disable các control khi khởi tạo
                else {
                    let _state1 = this.readOnlyCtrlOT(false);
                    this.setState({ ..._state1 }, () => {
                        this.GetJobType();
                    });
                }
            }
        );
    };
    //#endregion

    //#region [chọn ngày công]
    onDateChangeWorkDate = date => {
        const { WorkDate } = this.state;
        let nextState = this.readOnlyCtrlOT(false);

        nextState = {
            ...nextState,
            WorkDate: {
                ...WorkDate,
                value: date,
                refresh: !WorkDate.refresh
            }
        };

        this.setState(nextState, () => {
            //load dữ liệu cho dropdown loại công việc
            this.GetJobType();
            this.ChangeWorkDate();
        });
    };
    //#endregion

    //#region [chọn ca]
    onPickerChangeShiftID = item => {
        const { divShiftID, IsBreakAsWork } = this.state,
            { ShiftID } = divShiftID;

        // task: 0163864
        let nextState = {};
        if (item && item.IsBreakAsWork) {
            nextState = {
                ...nextState,
                IsBreakAsWork: {
                    ...IsBreakAsWork,
                    visible: false,
                    visibleConfig: false
                }
            };
        } else {
            nextState = {
                ...nextState,
                IsBreakAsWork: {
                    ...IsBreakAsWork,
                    visible: true,
                    visibleConfig: true
                }
            };
        }

        this.setState(
            {
                ...nextState,
                divShiftID: {
                    ...divShiftID,
                    ShiftID: {
                        ...ShiftID,
                        value: { ...item },
                        refresh: !ShiftID.refresh
                    }
                }
            },
            () => {
                const { removeDurationType, eleRegisterHours } = this.state,
                    { DurationType } = removeDurationType,
                    { RegisterHours } = eleRegisterHours;

                let durationType = DurationType.value ? DurationType.value.Value : null,
                    shiftID = item ? item.ID : null;

                this.ComputeResgistHourOrEndHourtOT(durationType, RegisterHours.value, shiftID);
                this.GetOvertimeTypeByDate();
            }
        );
    };
    //#endregion

    //#region [chọn ca Temp]
    onPickerChangeTempShiftID = item => {
        const { divTempShiftID } = this.state,
            { TempShiftID } = divTempShiftID;

        this.setState({
            divTempShiftID: {
                ...divTempShiftID,
                TempShiftID: {
                    ...TempShiftID,
                    value: { ...item },
                    refresh: !TempShiftID.refresh
                }
            }
        });
    };
    //#endregion

    //#region [chọn Loại đăng ký - DurationType]
    onPickerChangeDurationType = item => {
        const { removeDurationType } = this.state,
            { DurationType } = removeDurationType;

        this.setState(
            {
                removeDurationType: {
                    ...removeDurationType,
                    DurationType: {
                        ...DurationType,
                        value: item ? { ...item } : null,
                        refresh: !DurationType.refresh
                    }
                }
            },
            () => {
                const { divShiftID, divTempShiftID, eleRegisterHours } = this.state,
                    { ShiftID } = divShiftID,
                    { TempShiftID } = divTempShiftID,
                    { RegisterHours } = eleRegisterHours;

                let durationType = item ? item.Value : null,
                    shiftID = ShiftID.value ? ShiftID.value.ID : null,
                    tempShiftID = TempShiftID.value ? TempShiftID.value.ID : null;

                if (shiftID) {
                    this.ComputeResgistHourOrEndHourtOT(durationType, RegisterHours.value, shiftID);
                }
                if (tempShiftID) {
                    this.ComputeResgistHourOrEndHourtOT(durationType, RegisterHours.value, tempShiftID);
                }
                //this.GetOvertimeTypeByDate();
            }
        );
    };
    //#endregion

    //#region [chọn Loại tăng ca - OvertimeTypeID]
    onPickerChangeOvertimeTypeID = item => {
        const { divOvertimeTypeID } = this.state,
            { OvertimeTypeID } = divOvertimeTypeID;

        this.setState({
            divOvertimeTypeID: {
                ...divOvertimeTypeID,
                OvertimeTypeID: {
                    ...OvertimeTypeID,
                    value: { ...item },
                    refresh: !OvertimeTypeID.refresh
                }
            }
        });
    };
    //#endregion

    //#region [chọn Giờ bắt đầu tăng ca - WorkDateIn, WorkDateOut]
    onTimeChangeWorkDateIn = time => {
        const { checkShiftByProfile } = this.state,
            { WorkDateIn } = checkShiftByProfile;

        this.setState(
            {
                checkShiftByProfile: {
                    ...checkShiftByProfile,
                    WorkDateIn: {
                        ...WorkDateIn,
                        value: time,
                        refresh: !WorkDateIn.refresh
                    }
                }
            },
            () => {
                this.UpdateWorkDateIn();
            }
        );
    };

    onTimeChangeWorkDateOut = time => {
        const { checkShiftByProfile, removeDurationType } = this.state,
            { WorkDateOut } = checkShiftByProfile,
            { DurationType } = removeDurationType;

        this.setState(
            {
                checkShiftByProfile: {
                    ...checkShiftByProfile,
                    WorkDateOut: {
                        ...WorkDateOut,
                        value: time,
                        refresh: !WorkDateOut.refresh
                    }
                }
            },
            () => {
                const { value } = DurationType;

                if (value == 'E_OT_BREAK_AFTER' || value == 'E_OT_BREAK_BEFORE') {
                    this.UpdateEndOT(true, true);
                } else {
                    this.UpdateRegisterHours();
                }
            }
        );
    };
    //#endregion

    //#region [chọn số giờ]

    //theo cấu hình
    onChangeRegisterHoursConfig = item => {
        const { eleRegisterHoursConfig } = this.state,
            { RegisterHoursConfig } = eleRegisterHoursConfig;

        this.setState(
            {
                eleRegisterHoursConfig: {
                    ...eleRegisterHoursConfig,
                    RegisterHoursConfig: {
                        ...RegisterHoursConfig,
                        value: item ? { ...item } : null,
                        refresh: !RegisterHoursConfig.refresh
                    }
                }
            },
            () => {
                const { removeDurationType } = this.state,
                    { DurationType } = removeDurationType;

                if (DurationType.value && DurationType.value.Value) {
                    this.onChangeListRegisterHours(item);
                }
            }
        );
    };

    //không cấu hình
    onChangeRegisterHours = () => {
        let _paramErr = 'Error';
        this.UpdateEndOT(true, _paramErr);
    };
    //#endregion

    //#region [chọn phương thức thah toán]
    onPickerChangeMethodPayment = item => {
        const { MethodPayment } = this.state;
        this.setState({
            MethodPayment: {
                ...MethodPayment,
                value: item ? { ...item } : null,
                refresh: !MethodPayment.refresh
            }
        });
    };
    //#endregion

    //#region [chọn loại công việc]
    onChangeJobTypeID = item => {
        const { JobTypeID } = this.state;
        this.setState({
            JobTypeID: {
                ...JobTypeID,
                value: { ...item },
                refresh: !JobTypeID.refresh
            }
        });
    };
    //#endregion

    //#region [change duyệt đầu, duyệt cuối]

    //change duyệt đầu
    onChangeUserApprove = item => {
        const { UserApprove, UserApprove2, UserApprove3, UserApprove4 } = this.state;

        let nextState = {
            UserApprove: {
                ...UserApprove,
                value: { ...item },
                refresh: !UserApprove.refresh
            }
        };

        //nếu 1 cấp duyệt mới chạy
        if (this.levelApproveOT == 1) {
            //ẩn 3,4
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
                value: { ...item },
                refresh: !UserApprove2.refresh
            }
        };

        if (this.levelApproveOT == 1) {
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
        } else if (this.levelApproveOT == 2) {
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
        } else if (this.levelApproveOT == 3) {
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

    //#region [phân tích OT]

    removeItem = id => {
        const { currDataAnalysic } = this.state;
        let nextState = currDataAnalysic.filter(item => item.ID != id);
        this.GlobalDataSource = [...nextState];
        this.setState({
            currDataAnalysic: [...nextState]
        });
    };

    analysisOvertimeListRender = (dataBody, data) => {
        const { IsBreakAsWork } = this.state;
        if (data) {
            this.GlobalDataSource = [...this.GlobalDataSource, ...data];

            this.MappingDataSourceToGlobalData();
        } else {
            VnrLoadingSevices.show();

            // {...dataBody, IsBreakAsWork: IsBreakAsWork.value }, task: 0163864 (nhan.nguyen)
            HttpService.Post('[URI_HR]/Att_GetData/AnalysisOvertimeList', {
                ...dataBody,
                IsBreakAsWork: IsBreakAsWork.value
            }).then(data => {
                VnrLoadingSevices.hide();
                try {
                    if (data && Array.isArray(data.Data)) {
                        this.GlobalDataSource = [...this.GlobalDataSource, ...data.Data];

                        this.MappingDataSourceToGlobalData();
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        }
    };

    analysisOvertimeList = async dataBody => {
        // {...dataBody, IsBreakAsWork: IsBreakAsWork.value }, task: 0163864 (nhan.nguyen)
        const { IsBreakAsWork } = this.state;
        return await HttpService.Post('[URI_HR]/Att_GetData/AnalysisOvertimeList', {
            ...dataBody,
            IsBreakAsWork: IsBreakAsWork.value
        });
    };

    analysisOvertimeListValidate = async dataBody => {
        return await HttpService.Post('[URI_HR]/Att_GetData/AnalysisOvertimeListValidate', dataBody);
    };

    MappingDataSourceToGlobalData = () => {
        this.IsFirstEvenDataBound = false;

        //tao ID cho tung item de xoa
        let cloneData = [...this.GlobalDataSource],
            _currDataAnalysic = cloneData.map((item, i) => {
                let _timeSpan = moment().format('DDMMYYYYHHmmss') + i;
                return {
                    ...item,
                    ID: _timeSpan
                };
            });

        this.setState(
            {
                currDataAnalysic: [..._currDataAnalysic],
                isVisibleAnalysic: true
            },
            () => {
                //xử lý lại event Save
                this.isProcessingAnalysic = false;
            }
        );
    };

    analysic = (navigation, isConfirmLimit) => {
        if (this.isProcessingAnalysic) {
            return;
        }
        this.isProcessingAnalysic = true;

        const {
                UserApprove,
                UserApprove3,
                UserApprove4,
                UserApprove2,
                WorkDate,
                divShiftID,
                divTempShiftID,
                removeDurationType,
                divOvertimeTypeID,
                checkShiftByProfile,
                eleRegisterHours,
                eleRegisterHoursConfig,
                MethodPayment,
                ReasonOT,
                Profile,
                Profiles,
                IsGetShiftByProfile,
                OrgStructures,
                isChoseProfile,
                ProfilesExclude,
                IsOverTimeBreak,
                IsNotCheckInOut,
                JobTypeID,
                divIsRegistedFood,
                currDataAnalysic,
                UserComment1,
                UserComment2,
                UserComment3,
                UserComment4,
                IsBreakAsWork
            } = this.state,
            { ShiftID } = divShiftID,
            { TempShiftID } = divTempShiftID,
            { DurationType } = removeDurationType,
            { OvertimeTypeID } = divOvertimeTypeID,
            { WorkDateIn, WorkDateOut } = checkShiftByProfile,
            { RegisterHoursConfig } = eleRegisterHoursConfig,
            { RegisterHours } = eleRegisterHours,
            { IsMealRegistration, IsCarRegistration } = divIsRegistedFood,
            { MenuID, Menu2ID, Food2ID, FoodID } = IsMealRegistration,
            { OvertimePlaceID } = IsCarRegistration;

        let params = {
            IsPortal: true,
            IsChecking: true,
            Status: 'E_SUBMIT',
            WorkDate: WorkDate.value ? moment(WorkDate.value).format('YYYY-MM-DD HH:mm:ss') : null,
            IsGetShiftByProfile: IsGetShiftByProfile.value,
            ShiftID: ShiftID.value ? ShiftID.value.ID : null,
            TempShiftID: TempShiftID.value ? TempShiftID.value.ID : null,
            DurationType: DurationType.value ? DurationType.value.Value : null,
            IsOverTimeBreak: IsOverTimeBreak.value,
            OvertimeTypeID: OvertimeTypeID.value ? OvertimeTypeID.value.ID : null,
            WorkDateIn: WorkDateIn.value ? moment(WorkDateIn.value).format('HH:mm') : null,
            WorkDateOut: WorkDateOut.value ? moment(WorkDateOut.value).format('HH:mm') : null,
            RegisterHours: RegisterHours.value,
            RegisterHoursConfig: RegisterHoursConfig.value ? RegisterHoursConfig.value.Value : null,
            IsNotCheckInOut: IsNotCheckInOut.value,
            MethodPayment: MethodPayment.value ? MethodPayment.value.Value : null,
            JobTypeID: JobTypeID.value ? JobTypeID.value.ID : null,
            ReasonOT: ReasonOT.value,
            UserApproveID: UserApprove.value ? UserApprove.value.ID : null,
            UserApproveID2: UserApprove2.value ? UserApprove2.value.ID : null,
            UserApproveID3: UserApprove3.value ? UserApprove3.value.ID : null,
            UserApproveID4: UserApprove4.value ? UserApprove4.value.ID : null,
            WorkDateTime: WorkDateIn.value ? moment(WorkDateIn.value).format('HH:mm') + ':00' : null,
            WorkHour: WorkDateIn.value ? moment(WorkDateIn.value).format('HH:mm') : null,
            MenuID: MenuID.value ? MenuID.value.ID : null,
            Menu2ID: Menu2ID.value ? Menu2ID.value.ID : null,
            Food2ID: Food2ID.value ? Food2ID.value.ID : null,
            FoodID: FoodID.value ? FoodID.value.ID : null,
            OvertimePlaceID: OvertimePlaceID.value ? OvertimePlaceID.value.ID : null,

            UserComment1View: UserComment1.value ? UserComment1.value.map(item => item.ProfileName).join() : null,
            UserComment2View: UserComment2.value ? UserComment2.value.map(item => item.ProfileName).join() : null,
            UserComment3View: UserComment3.value ? UserComment3.value.map(item => item.ProfileName).join() : null,
            UserComment4View: UserComment4.value ? UserComment4.value.map(item => item.ProfileName).join() : null,

            UserComment1: UserComment1.value ? UserComment1.value.map(item => item.ID).join() : null,
            UserComment2: UserComment2.value ? UserComment2.value.map(item => item.ID).join() : null,
            UserComment3: UserComment3.value ? UserComment3.value.map(item => item.ID).join() : null,
            UserComment4: UserComment4.value ? UserComment4.value.map(item => item.ID).join() : null,
            IsBreakAsWork: IsBreakAsWork.value
        };

        if (this.isRegisterHelp) {
            if (isChoseProfile) {
                let _profiles = Profiles.value ? Profiles.value.map(item => item.ID).join() : '';
                params = {
                    ...params,
                    strOrgStructureIDs: null,
                    ProfileIDsExclude: null,
                    ProfileIds: _profiles,
                    ProfileID: _profiles
                };
            } else {
                let _orgs = OrgStructures.value ? OrgStructures.value.map(item => item.OrderNumber).join() : '';
                params = {
                    ...params,
                    ProfileIds: null,
                    strOrgStructureIDs: _orgs,
                    OrgStructureID: _orgs,
                    ProfileIDsExclude: ProfilesExclude.value ? ProfilesExclude.value.map(item => item.ID).join() : ''
                };
            }
        } else {
            params = {
                ...params,
                ProfileID: Profile.ID
            };
        }

        //xử lý vượt ngày tháng năm
        if (isConfirmLimit == true) {
            params = {
                ...params,
                isConfirmLimit: true
            };
        }

        let updatedRecords = [],
            currData = [...currDataAnalysic];

        for (let i = 0; i < currData.length; i++) {
            let obj = currData[i];

            if (obj['InTime'] && obj['InTime'].indexOf('/Date') >= 0)
                obj['InTime'] = new Date(
                    parseInt(obj['InTime'].replace('/Date(', '').replace(')/', ''), 10)
                ).toISOString();

            if (obj['OutTime'] && obj['OutTime'].indexOf('/Date') >= 0)
                obj['OutTime'] = new Date(
                    parseInt(obj['OutTime'].replace('/Date(', '').replace(')/', ''), 10)
                ).toISOString();

            if (obj['WorkDate'].indexOf('/Date') >= 0) {
                obj['WorkDate'] = new Date(
                    parseInt(obj['WorkDate'].replace('/Date(', '').replace(')/', ''), 10)
                ).toISOString();
            }

            if (obj['WorkDateTo'] && obj['WorkDateTo'].indexOf('/Date') >= 0)
                obj['WorkDateTo'] = new Date(
                    parseInt(obj['WorkDateTo'].replace('/Date(', '').replace(')/', ''), 10)
                ).toISOString();

            if (obj['WorkDateRoot'] && obj['WorkDateRoot'].indexOf('/Date') >= 0)
                obj['WorkDateRoot'] = new Date(
                    parseInt(obj['WorkDateRoot'].replace('/Date(', '').replace(')/', ''), 10)
                ).toISOString();

            updatedRecords.push(obj);
        }

        let dataBody = {
            models: [...updatedRecords],
            params: { ...params }
        };

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/AnalysisOvertimeListValidate', {
            ...dataBody
        }).then(data => {
            VnrLoadingSevices.hide();

            try {
                let cloneParams = { ...params };

                if (data[0] == 'error') {
                    if (data[1].indexOf('ConfirmDuplicate') > -1) {
                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_INFO,
                            message: translate('HRM_Overwite_Data'),
                            onCancel: () => {
                                //xử lý lại event Save
                                this.isProcessingAnalysic = false;
                            },
                            onConfirm: () => {
                                let data1 = {};

                                if (data[1].indexOf('ConfirmDuplicateGrid') > -1) {
                                    let lstDup = data[1].split('|');

                                    lstDup.splice(lstDup.length - 1);
                                    lstDup.splice(0, 1);

                                    this.GlobalDataSource = [];
                                    let currentData = [...currDataAnalysic];

                                    for (let i = 0; i < currentData.length; i++) {
                                        if (lstDup.indexOf(i.toString()) == -1) {
                                            let obj = currentData[i];

                                            if (obj['InTime'] && obj['InTime'].indexOf('/Date') >= 0)
                                                obj['InTime'] = new Date(
                                                    parseInt(obj['InTime'].replace('/Date(', '').replace(')/', ''), 10)
                                                ).toISOString();

                                            if (obj['OutTime'] && obj['OutTime'].indexOf('/Date') >= 0)
                                                obj['OutTime'] = new Date(
                                                    parseInt(obj['OutTime'].replace('/Date(', '').replace(')/', ''), 10)
                                                ).toISOString();

                                            if (obj['WorkDate'].indexOf('/Date') >= 0) {
                                                obj['WorkDate'] = new Date(
                                                    parseInt(
                                                        obj['WorkDate'].replace('/Date(', '').replace(')/', ''),
                                                        10
                                                    )
                                                ).toISOString();
                                            }

                                            if (obj['WorkDateTo'] && obj['WorkDateTo'].indexOf('/Date') >= 0)
                                                obj['WorkDateTo'] = new Date(
                                                    parseInt(
                                                        obj['WorkDateTo'].replace('/Date(', '').replace(')/', ''),
                                                        10
                                                    )
                                                ).toISOString();

                                            if (obj['WorkDateRoot'] && obj['WorkDateRoot'].indexOf('/Date') >= 0)
                                                obj['WorkDateRoot'] = new Date(
                                                    parseInt(
                                                        obj['WorkDateRoot'].replace('/Date(', '').replace(')/', ''),
                                                        10
                                                    )
                                                ).toISOString();

                                            this.GlobalDataSource.push(obj);
                                        }
                                    }

                                    data1 = {
                                        models: [...this.GlobalDataSource],
                                        params: { ...cloneParams, isDelDuplicate: true }
                                    };
                                } else {
                                    data1 = {
                                        models: [...updatedRecords],
                                        params: { ...cloneParams, isDelDuplicate: true }
                                    };
                                }

                                VnrLoadingSevices.show();
                                this.analysisOvertimeListValidate(data1).then(data => {
                                    VnrLoadingSevices.hide();
                                    try {
                                        let cloneData1 = { ...data1 };

                                        if (data[0] && typeof data[0] == 'string') {
                                            //flagValidate = false;

                                            //xử lý lại event Save
                                            this.isProcessingAnalysic = false;
                                        }

                                        if (data[0] == 'error') {
                                            ToasterSevice.showWarning(data[1], 5000);

                                            //xử lý lại event Save
                                            this.isProcessingAnalysic = false;
                                        } else if (data[0] == 'errorRegisterHours') {
                                            if (data.length == 2 && data[1] != '') {
                                                AlertSevice.alert({
                                                    title: translate('Hrm_Notification'),
                                                    iconType: EnumIcon.E_INFO,
                                                    message:
                                                        translate('WaringOvertimeBy') +
                                                        ' ' +
                                                        data[1] +
                                                        ' ' +
                                                        translate('IsLimited'),
                                                    onCancel: () => {
                                                        //xử lý lại event Save
                                                        this.isProcessingAnalysic = false;
                                                    },
                                                    onConfirm: () => {
                                                        this.IsFirstEvenDataBound = true;

                                                        this.analysisOvertimeList({ ...cloneData1.params }).then(
                                                            data => {
                                                                //check khung giờ cho Phổ Đình
                                                                if (data.IsConfirmWorkingByFrame) {
                                                                    //check có dữ liệu bị BLOCK status
                                                                    let listInvalidFame = data.EmployeeWorkingResults
                                                                            ? data.EmployeeWorkingResults
                                                                            : [],
                                                                        textLeftButton = '',
                                                                        isShowLeftButton = false;

                                                                    if (
                                                                        !listInvalidFame.find(
                                                                            item => item.Status === 'E_BLOCK'
                                                                        )
                                                                    ) {
                                                                        textLeftButton = translate(
                                                                            'HRM_Confirm_Limit_TimeSlot'
                                                                        );
                                                                        isShowLeftButton = true;
                                                                    }

                                                                    listInvalidFame.forEach(item => {
                                                                        item.DateString = moment(item.Date).format(
                                                                            'DD/MM/YYYY'
                                                                        );
                                                                    });

                                                                    //xử lý group theo ngày cho data
                                                                    const groupBy = (array, key) => {
                                                                        // Return the end result
                                                                        return array.reduce((result, currentValue) => {
                                                                            // If an array already present for key, push it to the array. Else create an array and push the object
                                                                            (result[currentValue[key]] =
                                                                                result[currentValue[key]] || []).push(
                                                                                currentValue
                                                                            );

                                                                            // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
                                                                            return result;
                                                                        }, {}); // empty object is the initial value for result object
                                                                    };

                                                                    const objInvalidFameGroup = groupBy(
                                                                        listInvalidFame,
                                                                        'DateString'
                                                                    );

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
                                                                            let paramLimitTimeSlot = {
                                                                                ...cloneData1.params,
                                                                                IsConfirmWorkingByFrame: true
                                                                            };

                                                                            this.analysisOvertimeListRender(
                                                                                paramLimitTimeSlot
                                                                            );
                                                                        },
                                                                        onClose: () => {},
                                                                        dataSource
                                                                    });

                                                                    //xử lý lại event Save
                                                                    this.isProcessingAnalysic = false;
                                                                } else if (
                                                                    data &&
                                                                    data.Data &&
                                                                    Array.isArray(data.Data)
                                                                ) {
                                                                    this.analysisOvertimeListRender(null, [
                                                                        ...data.Data
                                                                    ]);
                                                                }
                                                            }
                                                        );
                                                    }
                                                });
                                            } else if (data.length >= 3 && data[1] != '') {
                                                let mess =
                                                    translate('WaringOvertimeBy') +
                                                    ' ' +
                                                    data[1] +
                                                    ' ' +
                                                    translate('IsLimited') +
                                                    data[2];

                                                AlertSevice.alert({
                                                    title: translate('Hrm_Notification'),
                                                    iconType: EnumIcon.E_INFO,
                                                    message: mess,
                                                    onCancel: () => {
                                                        //xử lý lại event Save
                                                        this.isProcessingAnalysic = false;
                                                    },
                                                    onConfirm: () => {
                                                        this.IsFirstEvenDataBound = true;
                                                        this.analysisOvertimeListRender({
                                                            ...cloneData1.params
                                                        });
                                                    }
                                                });
                                            } else {
                                                ToasterSevice.showWarning(
                                                    'HoursOversubscribedHoursRegistrationRules',
                                                    5000
                                                );

                                                //xử lý lại event Save
                                                this.isProcessingAnalysic = false;
                                            }
                                        } else if (data[0] == 'errorPregnancyPro') {
                                            let mess = translate('Employee') + data[1];
                                            AlertSevice.alert({
                                                title: translate('Hrm_Notification'),
                                                iconType: EnumIcon.E_INFO,
                                                message: mess,
                                                showConfirm: false,
                                                onCancel: () => {},
                                                onConfirm: () => {}
                                            });

                                            //xử lý lại event Save
                                            this.isProcessingAnalysic = false;
                                        } else if (data[0] == 'errorPregnancyOrg') {
                                            let messageText = translate('Employee') + data[1];
                                            AlertSevice.alert({
                                                title: translate('Hrm_Notification'),
                                                iconType: EnumIcon.E_INFO,
                                                message: messageText,
                                                onCancel: () => {
                                                    //xử lý lại event Save
                                                    this.isProcessingAnalysic = false;
                                                },
                                                onConfirm: () => {
                                                    let data2 = {
                                                        models: { ...updatedRecords },
                                                        params: {
                                                            ...cloneData1.params,
                                                            IsConfirm: true,
                                                            IsConfirmPreg: true
                                                        }
                                                    };

                                                    this.analysisOvertimeListValidate({ ...data2 }).then(data => {
                                                        try {
                                                            let cloneData2 = { ...data2 };

                                                            if (data[0] && typeof data[0] == 'string') {
                                                                //flagValidate = false;
                                                                //Loading(false);

                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            }
                                                            if (data[0] == 'error') {
                                                                ToasterSevice.showWarning(data[1]);

                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            } else if (data[0] == 'errorRegisterHours') {
                                                                if (data.length == 2 && data[1] != '') {
                                                                    AlertSevice.alert({
                                                                        title: translate('Hrm_Notification'),
                                                                        iconType: EnumIcon.E_INFO,
                                                                        message:
                                                                            translate('WaringOvertimeBy') +
                                                                            ' ' +
                                                                            data[1] +
                                                                            ' ' +
                                                                            translate('IsLimited'),
                                                                        onCancel: () => {
                                                                            //xử lý lại event Save
                                                                            this.isProcessingAnalysic = false;
                                                                        },
                                                                        onConfirm: () => {
                                                                            this.IsFirstEvenDataBound = true;
                                                                            this.analysisOvertimeListRender({
                                                                                ...cloneData2.params
                                                                            });
                                                                        }
                                                                    });
                                                                } else if (data.length >= 3 && data[1] != '') {
                                                                    let mess =
                                                                        translate('WaringOvertimeBy') +
                                                                        ' ' +
                                                                        data[1] +
                                                                        ' ' +
                                                                        translate('IsLimited') +
                                                                        data[2];

                                                                    AlertSevice.alert({
                                                                        title: translate('Hrm_Notification'),
                                                                        iconType: EnumIcon.E_INFO,
                                                                        message: mess,
                                                                        onCancel: () => {
                                                                            //xử lý lại event Save
                                                                            this.isProcessingAnalysic = false;
                                                                        },
                                                                        onConfirm: () => {
                                                                            this.IsFirstEvenDataBound = true;
                                                                            this.analysisOvertimeListRender({
                                                                                ...cloneData2.params
                                                                            });
                                                                        }
                                                                    });
                                                                } else {
                                                                    ToasterSevice.showWarning(
                                                                        'HoursOversubscribedHoursRegistrationRules',
                                                                        5000
                                                                    );

                                                                    //xử lý lại event Save
                                                                    this.isProcessingAnalysic = false;
                                                                }
                                                            } else if (data[0] == 'errorNotRoster') {
                                                                ToasterSevice.showWarning(
                                                                    'CanNotPlsCheckRosterOfEmpByDate',
                                                                    5000
                                                                );

                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            } else if (data[0] == 'errorIsRegisterLeaveday') {
                                                                ToasterSevice.showWarning('WarningNotRegisterOT', 5000);

                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            } else if (data[0] == 'WarningDateQuitInRosterTimes') {
                                                                ToasterSevice.showWarning(data[1], 5000);

                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            } else if (data[0] == 'errorRegisterHoursInPast') {
                                                                ToasterSevice.showWarning(
                                                                    'WarningRegisterOTInPastMoreThanConfig',
                                                                    5000
                                                                );

                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            } else if (data == 'FieldNotAllowNull') {
                                                                ToasterSevice.showWarning(
                                                                    'HRM_Attendance_Leaveday_ProfileID',
                                                                    5000
                                                                );

                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            } else {
                                                                this.IsFirstEvenDataBound = true;
                                                                this.analysisOvertimeList({
                                                                    ...cloneData2.params
                                                                }).then(data => {
                                                                    try {
                                                                        if (data) {
                                                                            let cloneParamsOfData2 = {
                                                                                ...cloneData2.params
                                                                            };

                                                                            if (data == 'Error') {
                                                                                //xử lý lại event Save
                                                                                this.isProcessingAnalysic = false;
                                                                                ToasterSevice.showWarning(
                                                                                    'HRM_Message_DataInvalidRegisterLessThanConfig',
                                                                                    5000
                                                                                );
                                                                                return;
                                                                            }

                                                                            if (
                                                                                data ==
                                                                                'WarningRegistHoursInPrenancyHours'
                                                                            ) {
                                                                                //xử lý lại event Save
                                                                                this.isProcessingAnalysic = false;
                                                                                ToasterSevice.showWarning(
                                                                                    'WarningRegistHoursInPrenancyHours',
                                                                                    5000
                                                                                );
                                                                                return;
                                                                            }

                                                                            if (
                                                                                typeof data == 'object' &&
                                                                                data[0] == 'errorProfileNotShift'
                                                                            ) {
                                                                                AlertSevice.alert({
                                                                                    title: translate(
                                                                                        'Hrm_Notification'
                                                                                    ),
                                                                                    iconType: EnumIcon.E_INFO,
                                                                                    message:
                                                                                        data[1] +
                                                                                        ' ' +
                                                                                        translate(
                                                                                            'PlsCheckRosterOfEmpByDate'
                                                                                        ) +
                                                                                        '. ' +
                                                                                        translate(
                                                                                            'HRM_Message_AreYouContinute'
                                                                                        ) +
                                                                                        '?',
                                                                                    onCancel: () => {
                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;
                                                                                    },
                                                                                    onConfirm: () => {
                                                                                        let params = {
                                                                                            ...cloneParamsOfData2,
                                                                                            strCodeEmpInvalidData:
                                                                                                data[1]
                                                                                        };

                                                                                        VnrLoadingSevices.show();
                                                                                        this.analysisOvertimeList(
                                                                                            params
                                                                                        ).then(data1 => {
                                                                                            VnrLoadingSevices.hide();
                                                                                            try {
                                                                                                //let cloneParams1OfData2 = { ...params };

                                                                                                if (data1 == 'Error') {
                                                                                                    //xử lý lại event Save
                                                                                                    this.isProcessingAnalysic = false;
                                                                                                    ToasterSevice.showWarning(
                                                                                                        'HRM_Message_DataInvalidRegisterLessThanConfig',
                                                                                                        5000
                                                                                                    );
                                                                                                    return;
                                                                                                }

                                                                                                if (
                                                                                                    data1 ==
                                                                                                    'WarningRegistHoursInPrenancyHours'
                                                                                                ) {
                                                                                                    ToasterSevice.showWarning(
                                                                                                        'WarningRegistHoursInPrenancyHours',
                                                                                                        5000
                                                                                                    );

                                                                                                    //xử lý lại event Save
                                                                                                    this.isProcessingAnalysic = false;
                                                                                                    return;
                                                                                                }
                                                                                                if (
                                                                                                    data1.success ==
                                                                                                    'ErrorValidateWorkingBlock'
                                                                                                ) {
                                                                                                    //xử lý lại event Save
                                                                                                    this.isProcessingAnalysic = false;
                                                                                                    ToasterSevice.showWarning(
                                                                                                        'WarningRegistHoursInPrenancyHours',
                                                                                                        5000
                                                                                                    );
                                                                                                    return;
                                                                                                }
                                                                                                if (
                                                                                                    data1[0] ==
                                                                                                    'ErrorValidateWorkingWarning'
                                                                                                ) {
                                                                                                    //xử lý lại event Save
                                                                                                    this.isProcessingAnalysic = false;
                                                                                                    ToasterSevice.showWarning(
                                                                                                        data1[1],
                                                                                                        5000
                                                                                                    );
                                                                                                    return;
                                                                                                }
                                                                                                // if (data1[0] == 'ErrorValidateWorkingWarning') {
                                                                                                //     AlertSevice.alert({
                                                                                                //         title: translate('Hrm_Notification'),
                                                                                                //         icon: `${Platform.OS === 'ios' ? 'ios-' : 'md-'}alert-outline`,
                                                                                                //         iconColor: Colors.orange,
                                                                                                //         message: data[1],
                                                                                                //         onCancel: () => { },
                                                                                                //         onConfirm: () => {
                                                                                                //
                                                                                                //             let params = {
                                                                                                //                 ...cloneParams1OfData2,
                                                                                                //                 strCodeEmpInvalidData: data[1]
                                                                                                //             }
                                                                                                //             this.analysisOvertimeListRender(params);
                                                                                                //         }
                                                                                                //     })
                                                                                                // }

                                                                                                if (
                                                                                                    data1.Data &&
                                                                                                    Array.isArray(
                                                                                                        data1.Data
                                                                                                    )
                                                                                                ) {
                                                                                                    this.analysisOvertimeListRender(
                                                                                                        null,
                                                                                                        [...data1.Data]
                                                                                                    );
                                                                                                }
                                                                                            } catch (error) {
                                                                                                DrawerServices.navigate(
                                                                                                    'ErrorScreen',
                                                                                                    {
                                                                                                        ErrorDisplay: error
                                                                                                    }
                                                                                                );
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }

                                                                            // if (data1[0] == 'ErrorValidateWorkingWarning') {
                                                                            //     ToasterSevice.showWarning(data1[1], 5000);
                                                                            //     return;
                                                                            // }
                                                                            // if (data1[0] == 'ErrorValidateWorkingWarning') {
                                                                            //     AlertSevice.alert({
                                                                            //         title: translate('Hrm_Notification'),
                                                                            //         icon: `${Platform.OS === 'ios' ? 'ios-' : 'md-'}alert-outline`,
                                                                            //         iconColor: Colors.orange,
                                                                            //         message: data[1],
                                                                            //         onCancel: () => { },
                                                                            //         onConfirm: () => {
                                                                            //
                                                                            //             let params = {
                                                                            //                 ...data2.params,
                                                                            //                 strCodeEmpInvalidData: data[1]
                                                                            //             }
                                                                            //             this.analysisOvertimeListRender(params);
                                                                            //         }
                                                                            //     })
                                                                            // }

                                                                            if (data.Data && Array.isArray(data.Data)) {
                                                                                this.analysisOvertimeListRender(null, [
                                                                                    ...data.Data
                                                                                ]);
                                                                            }
                                                                        }
                                                                    } catch (error) {
                                                                        DrawerServices.navigate('ErrorScreen', {
                                                                            ErrorDisplay: error
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        } catch (error) {
                                                            DrawerServices.navigate('ErrorScreen', {
                                                                ErrorDisplay: error
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        } else if (data[0] == 'errorNotRoster') {
                                            ToasterSevice.showWarning('CanNotPlsCheckRosterOfEmpByDate');

                                            //xử lý lại event Save
                                            this.isProcessingAnalysic = false;
                                        } else if (data[0] == 'errorNotIsReceiveOvertimeBonusPro') {
                                            let mess = translate('Employee') + data[1];
                                            AlertSevice.alert({
                                                title: translate('Hrm_Notification'),
                                                iconType: EnumIcon.E_INFO,
                                                message: mess,
                                                onCancel: () => {
                                                    //xử lý lại event Save
                                                    this.isProcessingAnalysic = false;
                                                },
                                                onConfirm: () => {},
                                                showConfirm: false
                                            });

                                            //xử lý lại event Save
                                            this.isProcessingAnalysic = false;
                                        } else if (data[0] == 'errorNotIsReceiveOvertimeBonusOrg') {
                                            let messageText = translate('Employee') + data[1];
                                            AlertSevice.alert({
                                                title: translate('Hrm_Notification'),
                                                iconType: EnumIcon.E_INFO,
                                                message: messageText,
                                                onCancel: () => {
                                                    //xử lý lại event Save
                                                    this.isProcessingAnalysic = false;
                                                },
                                                onConfirm: () => {
                                                    let data2 = {
                                                        models: [...updatedRecords],
                                                        params: {
                                                            ...cloneData1.params,
                                                            IsConfirm: true
                                                        }
                                                    };

                                                    VnrLoadingSevices.show();
                                                    this.analysisOvertimeListValidate(data2).then(data => {
                                                        VnrLoadingSevices.hide();
                                                        try {
                                                            let cloneData2 = { ...data2 };

                                                            if (data[0] && typeof data[0] == 'string') {
                                                                //flagValidate = false;

                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            }
                                                            if (data[0] == 'error') {
                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;

                                                                ToasterSevice.showWarning(data[1], 5000);
                                                            } else if (data[0] == 'errorRegisterHours') {
                                                                if (data.length == 2 && data[1] != '') {
                                                                    AlertSevice.alert({
                                                                        title: translate('Hrm_Notification'),
                                                                        iconType: EnumIcon.E_INFO,
                                                                        message:
                                                                            translate('WaringOvertimeBy') +
                                                                            ' ' +
                                                                            data[1] +
                                                                            ' ' +
                                                                            translate('IsLimited'),
                                                                        onCancel: () => {
                                                                            //xử lý lại event Save
                                                                            this.isProcessingAnalysic = false;
                                                                        },
                                                                        onConfirm: () => {
                                                                            this.IsFirstEvenDataBound = true;
                                                                            this.analysisOvertimeListRender({
                                                                                ...cloneData2.params
                                                                            });
                                                                        }
                                                                    });
                                                                } else if (data.length >= 3 && data[1] != '') {
                                                                    let mess =
                                                                        translate('WaringOvertimeBy') +
                                                                        ' ' +
                                                                        data[1] +
                                                                        ' ' +
                                                                        translate('IsLimited') +
                                                                        data[2];

                                                                    AlertSevice.alert({
                                                                        title: translate('Hrm_Notification'),
                                                                        iconType: EnumIcon.E_INFO,
                                                                        message: mess,
                                                                        onCancel: () => {
                                                                            //xử lý lại event Save
                                                                            this.isProcessingAnalysic = false;
                                                                        },
                                                                        onConfirm: () => {
                                                                            this.IsFirstEvenDataBound = true;
                                                                            this.analysisOvertimeListRender({
                                                                                ...cloneData2.params
                                                                            });
                                                                        }
                                                                    });
                                                                } else {
                                                                    //xử lý lại event Save
                                                                    this.isProcessingAnalysic = false;

                                                                    ToasterSevice.showWarning(
                                                                        'HoursOversubscribedHoursRegistrationRules'
                                                                    );
                                                                }
                                                            } else if (data[0] == 'errorPregnancyPro') {
                                                                var messageTextPreg = translate('Employee') + data[1];
                                                                AlertSevice.alert({
                                                                    title: translate('Hrm_Notification'),
                                                                    iconType: EnumIcon.E_INFO,
                                                                    message: messageTextPreg,
                                                                    onCancel: () => {},
                                                                    onConfirm: () => {},
                                                                    showConfirm: false
                                                                });

                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            } else if (data[0] == 'errorPregnancyOrg') {
                                                                var messageText = translate('Employee') + data[1];
                                                                AlertSevice.alert({
                                                                    title: translate('Hrm_Notification'),
                                                                    iconType: EnumIcon.E_INFO,
                                                                    message: messageText,
                                                                    onCancel: () => {
                                                                        //xử lý lại event Save
                                                                        this.isProcessingAnalysic = false;
                                                                    },
                                                                    onConfirm: () => {
                                                                        let data2 = {
                                                                            models: [...updatedRecords],
                                                                            params: {
                                                                                ...cloneData2.params,
                                                                                IsConfirm: true,
                                                                                IsConfirmPreg: true
                                                                            }
                                                                        };

                                                                        VnrLoadingSevices.show();
                                                                        this.analysisOvertimeListValidate(data2).then(
                                                                            data => {
                                                                                VnrLoadingSevices.hide();
                                                                                try {
                                                                                    let cloneData2OfData2 = {
                                                                                        ...data2
                                                                                    };

                                                                                    if (
                                                                                        data[0] &&
                                                                                        typeof data[0] == 'string'
                                                                                    ) {
                                                                                        //flagValidate = false;

                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;
                                                                                    }
                                                                                    if (data[0] == 'error') {
                                                                                        ToasterSevice.showWarning(
                                                                                            data[1]
                                                                                        );

                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;
                                                                                    } else if (
                                                                                        data[0] == 'errorRegisterHours'
                                                                                    ) {
                                                                                        if (
                                                                                            data.length == 2 &&
                                                                                            data[1] != ''
                                                                                        ) {
                                                                                            AlertSevice.alert({
                                                                                                title: translate(
                                                                                                    'Hrm_Notification'
                                                                                                ),
                                                                                                iconType:
                                                                                                    EnumIcon.E_INFO,
                                                                                                message:
                                                                                                    translate(
                                                                                                        'WaringOvertimeBy'
                                                                                                    ) +
                                                                                                    ' ' +
                                                                                                    data[1] +
                                                                                                    ' ' +
                                                                                                    translate(
                                                                                                        'IsLimited'
                                                                                                    ),
                                                                                                onCancel: () => {
                                                                                                    //xử lý lại event Save
                                                                                                    this.isProcessingAnalysic = false;
                                                                                                },
                                                                                                onConfirm: () => {
                                                                                                    this.IsFirstEvenDataBound = true;
                                                                                                    this.analysisOvertimeListRender(
                                                                                                        {
                                                                                                            ...cloneData2OfData2.params
                                                                                                        }
                                                                                                    );
                                                                                                }
                                                                                            });
                                                                                        } else if (
                                                                                            data.length >= 3 &&
                                                                                            data[1] != ''
                                                                                        ) {
                                                                                            let mess =
                                                                                                translate(
                                                                                                    'WaringOvertimeBy'
                                                                                                ) +
                                                                                                ' ' +
                                                                                                data[1] +
                                                                                                ' ' +
                                                                                                translate('IsLimited') +
                                                                                                data[2];

                                                                                            AlertSevice.alert({
                                                                                                title: translate(
                                                                                                    'Hrm_Notification'
                                                                                                ),
                                                                                                iconType:
                                                                                                    EnumIcon.E_INFO,
                                                                                                message: mess,
                                                                                                onCancel: () => {
                                                                                                    //xử lý lại event Save
                                                                                                    this.isProcessingAnalysic = false;
                                                                                                },
                                                                                                onConfirm: () => {
                                                                                                    this.IsFirstEvenDataBound = true;
                                                                                                    this.analysisOvertimeListRender(
                                                                                                        {
                                                                                                            ...cloneData2OfData2.params
                                                                                                        }
                                                                                                    );
                                                                                                }
                                                                                            });
                                                                                        } else {
                                                                                            //xử lý lại event Save
                                                                                            this.isProcessingAnalysic = false;

                                                                                            ToasterSevice.showWarning(
                                                                                                'HoursOversubscribedHoursRegistrationRules',
                                                                                                5000
                                                                                            );
                                                                                        }
                                                                                    } else if (
                                                                                        data[0] == 'errorNotRoster'
                                                                                    ) {
                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;

                                                                                        ToasterSevice.showWarning(
                                                                                            'CanNotPlsCheckRosterOfEmpByDate',
                                                                                            5000
                                                                                        );
                                                                                    } else if (
                                                                                        data[0] ==
                                                                                        'errorIsRegisterLeaveday'
                                                                                    ) {
                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;

                                                                                        ToasterSevice.showWarning(
                                                                                            'WarningNotRegisterOT',
                                                                                            5000
                                                                                        );
                                                                                    } else if (
                                                                                        data[0] ==
                                                                                        'WarningDateQuitInRosterTimes'
                                                                                    ) {
                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;

                                                                                        ToasterSevice.showWarning(
                                                                                            data[1],
                                                                                            5000
                                                                                        );
                                                                                    } else if (
                                                                                        data[0] ==
                                                                                        'errorRegisterHoursInPast'
                                                                                    ) {
                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;

                                                                                        ToasterSevice.showWarning(
                                                                                            'WarningRegisterOTInPastMoreThanConfig',
                                                                                            5000
                                                                                        );
                                                                                    } else if (
                                                                                        data == 'FieldNotAllowNull'
                                                                                    ) {
                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;

                                                                                        ToasterSevice.showWarning(
                                                                                            'HRM_Attendance_Leaveday_ProfileID',
                                                                                            5000
                                                                                        );
                                                                                    } else {
                                                                                        this.IsFirstEvenDataBound = true;
                                                                                        VnrLoadingSevices.show();
                                                                                        this.analysisOvertimeList({
                                                                                            ...cloneData2OfData2.params
                                                                                        }).then(data => {
                                                                                            VnrLoadingSevices.hide();
                                                                                            try {
                                                                                                if (data) {
                                                                                                    let paramsOfCloneData2OfData2 = {
                                                                                                        ...cloneData2OfData2.params
                                                                                                    };

                                                                                                    if (
                                                                                                        data == 'Error'
                                                                                                    ) {
                                                                                                        //xử lý lại event Save
                                                                                                        this.isProcessingAnalysic = false;

                                                                                                        ToasterSevice.showWarning(
                                                                                                            'HRM_Message_DataInvalidRegisterLessThanConfig',
                                                                                                            5000
                                                                                                        );
                                                                                                        return;
                                                                                                    }

                                                                                                    if (
                                                                                                        data ==
                                                                                                        'WarningRegistHoursInPrenancyHours'
                                                                                                    ) {
                                                                                                        //xử lý lại event Save
                                                                                                        this.isProcessingAnalysic = false;

                                                                                                        ToasterSevice.showWarning(
                                                                                                            'WarningRegistHoursInPrenancyHours',
                                                                                                            5000
                                                                                                        );
                                                                                                        return;
                                                                                                    }

                                                                                                    if (
                                                                                                        typeof data ==
                                                                                                            'object' &&
                                                                                                        data[0] ==
                                                                                                            'errorProfileNotShift'
                                                                                                    ) {
                                                                                                        AlertSevice.alert(
                                                                                                            {
                                                                                                                title: translate(
                                                                                                                    'Hrm_Notification'
                                                                                                                ),
                                                                                                                icon: `${
                                                                                                                    Platform.OS ===
                                                                                                                    'ios'
                                                                                                                        ? 'ios-'
                                                                                                                        : 'md-'
                                                                                                                }alert-outline`,
                                                                                                                iconColor:
                                                                                                                    Colors.orange,
                                                                                                                message:
                                                                                                                    data[1] +
                                                                                                                    ' ' +
                                                                                                                    translate(
                                                                                                                        'PlsCheckRosterOfEmpByDate'
                                                                                                                    ) +
                                                                                                                    '. ' +
                                                                                                                    translate(
                                                                                                                        'HRM_Message_AreYouContinute'
                                                                                                                    ) +
                                                                                                                    '?',
                                                                                                                onCancel: () => {
                                                                                                                    //xử lý lại event Save
                                                                                                                    this.isProcessingAnalysic = false;
                                                                                                                },
                                                                                                                onConfirm: () => {
                                                                                                                    let params = {
                                                                                                                        ...paramsOfCloneData2OfData2,
                                                                                                                        strCodeEmpInvalidData:
                                                                                                                            data[1]
                                                                                                                    };

                                                                                                                    VnrLoadingSevices.show();
                                                                                                                    this.analysisOvertimeList(
                                                                                                                        params
                                                                                                                    ).then(
                                                                                                                        data1 => {
                                                                                                                            VnrLoadingSevices.hide();
                                                                                                                            if (
                                                                                                                                data1 ==
                                                                                                                                'Error'
                                                                                                                            ) {
                                                                                                                                //xử lý lại event Save
                                                                                                                                this.isProcessingAnalysic = false;

                                                                                                                                ToasterSevice.showWarning(
                                                                                                                                    'HRM_Message_DataInvalidRegisterLessThanConfig',
                                                                                                                                    5000
                                                                                                                                );
                                                                                                                                return;
                                                                                                                            }

                                                                                                                            if (
                                                                                                                                data1 ==
                                                                                                                                'WarningRegistHoursInPrenancyHours'
                                                                                                                            ) {
                                                                                                                                //xử lý lại event Save
                                                                                                                                this.isProcessingAnalysic = false;

                                                                                                                                ToasterSevice.showWarning(
                                                                                                                                    'WarningRegistHoursInPrenancyHours',
                                                                                                                                    5000
                                                                                                                                );
                                                                                                                                return;
                                                                                                                            }
                                                                                                                            this.analysisOvertimeListRender(
                                                                                                                                null,
                                                                                                                                [
                                                                                                                                    ...data1.Data
                                                                                                                                ]
                                                                                                                            );
                                                                                                                        }
                                                                                                                    );
                                                                                                                }
                                                                                                            }
                                                                                                        );
                                                                                                    }

                                                                                                    if (
                                                                                                        data.Data &&
                                                                                                        Array.isArray(
                                                                                                            data.Data
                                                                                                        )
                                                                                                    ) {
                                                                                                        this.analysisOvertimeListRender(
                                                                                                            null,
                                                                                                            [
                                                                                                                ...data.Data
                                                                                                            ]
                                                                                                        );
                                                                                                    }
                                                                                                }
                                                                                            } catch (error) {
                                                                                                DrawerServices.navigate(
                                                                                                    'ErrorScreen',
                                                                                                    {
                                                                                                        ErrorDisplay: error
                                                                                                    }
                                                                                                );
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                } catch (error) {
                                                                                    DrawerServices.navigate(
                                                                                        'ErrorScreen',
                                                                                        { ErrorDisplay: error }
                                                                                    );
                                                                                }
                                                                            }
                                                                        );
                                                                    }
                                                                });
                                                            } else if (data[0] == 'errorNotRoster') {
                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;

                                                                ToasterSevice.showWarning(
                                                                    'CanNotPlsCheckRosterOfEmpByDate',
                                                                    5000
                                                                );
                                                            } else if (data[0] == 'errorIsRegisterLeaveday') {
                                                                ToasterSevice.showWarning('WarningNotRegisterOT', 5000);

                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            } else if (data[0] == 'WarningDateQuitInRosterTimes') {
                                                                ToasterSevice.showWarning(data[1], 5000);

                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            } else if (data[0] == 'errorRegisterHoursInPast') {
                                                                ToasterSevice.showWarning(
                                                                    'WarningRegisterOTInPastMoreThanConfig',
                                                                    5000
                                                                );

                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            } else if (data == 'FieldNotAllowNull') {
                                                                ToasterSevice.showWarning(
                                                                    'HRM_Attendance_Leaveday_ProfileID',
                                                                    5000
                                                                );

                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            } else {
                                                                this.IsFirstEvenDataBound = true;

                                                                VnrLoadingSevices.show();
                                                                this.analysisOvertimeList({
                                                                    ...cloneData2.params
                                                                }).then(data => {
                                                                    VnrLoadingSevices.hide();
                                                                    try {
                                                                        if (data) {
                                                                            let paramsOfCloneData2OfData2 = {
                                                                                ...cloneData2.params
                                                                            };

                                                                            if (data == 'Error') {
                                                                                //xử lý lại event Save
                                                                                this.isProcessingAnalysic = false;

                                                                                ToasterSevice.showWarning(
                                                                                    'HRM_Message_DataInvalidRegisterLessThanConfig',
                                                                                    5000
                                                                                );
                                                                                return;
                                                                            }

                                                                            if (
                                                                                data ==
                                                                                'WarningRegistHoursInPrenancyHours'
                                                                            ) {
                                                                                //xử lý lại event Save
                                                                                this.isProcessingAnalysic = false;

                                                                                ToasterSevice.showWarning(
                                                                                    'WarningRegistHoursInPrenancyHours',
                                                                                    5000
                                                                                );
                                                                                return;
                                                                            }

                                                                            if (
                                                                                typeof data == 'object' &&
                                                                                data[0] == 'errorProfileNotShift'
                                                                            ) {
                                                                                AlertSevice.alert({
                                                                                    title: translate(
                                                                                        'Hrm_Notification'
                                                                                    ),
                                                                                    iconType: EnumIcon.E_INFO,
                                                                                    message:
                                                                                        data[1] +
                                                                                        ' ' +
                                                                                        translate(
                                                                                            'PlsCheckRosterOfEmpByDate'
                                                                                        ) +
                                                                                        '. ' +
                                                                                        translate(
                                                                                            'HRM_Message_AreYouContinute'
                                                                                        ) +
                                                                                        '?',
                                                                                    onCancel: () => {
                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;
                                                                                    },
                                                                                    onConfirm: () => {
                                                                                        let params = {
                                                                                            ...paramsOfCloneData2OfData2,
                                                                                            strCodeEmpInvalidData:
                                                                                                data[1]
                                                                                        };

                                                                                        VnrLoadingSevices.show();
                                                                                        this.analysisOvertimeList(
                                                                                            params
                                                                                        ).then(data1 => {
                                                                                            VnrLoadingSevices.hide();
                                                                                            if (data1 == 'Error') {
                                                                                                //xử lý lại event Save
                                                                                                this.isProcessingAnalysic = false;

                                                                                                ToasterSevice.showWarning(
                                                                                                    'HRM_Message_DataInvalidRegisterLessThanConfig',
                                                                                                    5000
                                                                                                );
                                                                                                return;
                                                                                            }

                                                                                            if (
                                                                                                data1 ==
                                                                                                'WarningRegistHoursInPrenancyHours'
                                                                                            ) {
                                                                                                //xử lý lại event Save
                                                                                                this.isProcessingAnalysic = false;

                                                                                                ToasterSevice.showWarning(
                                                                                                    'WarningRegistHoursInPrenancyHours',
                                                                                                    5000
                                                                                                );
                                                                                                return;
                                                                                            }

                                                                                            this.analysisOvertimeListRender(
                                                                                                null,
                                                                                                [...data1.Data]
                                                                                            );
                                                                                        });
                                                                                    }
                                                                                });
                                                                            }

                                                                            if (
                                                                                data1[0] == 'ErrorValidateWorkingBlock'
                                                                            ) {
                                                                                ToasterSevice.showWarning(data1[1]);

                                                                                //xử lý lại event Save
                                                                                this.isProcessingAnalysic = false;

                                                                                return;
                                                                            }
                                                                            if (
                                                                                data1[0] ==
                                                                                'ErrorValidateWorkingWarning'
                                                                            ) {
                                                                                AlertSevice.alert({
                                                                                    title: translate(
                                                                                        'Hrm_Notification'
                                                                                    ),
                                                                                    iconType: EnumIcon.E_INFO,
                                                                                    message: data[1],
                                                                                    onCancel: () => {
                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;
                                                                                    },
                                                                                    onConfirm: () => {
                                                                                        let params = {
                                                                                            ...paramsOfCloneData2OfData2,
                                                                                            strCodeEmpInvalidData:
                                                                                                data[1]
                                                                                        };
                                                                                        this.analysisOvertimeListRender(
                                                                                            params
                                                                                        );
                                                                                    }
                                                                                });
                                                                            }

                                                                            if (data.Data) {
                                                                                this.analysisOvertimeListRender(null, [
                                                                                    ...data.Data
                                                                                ]);
                                                                            }
                                                                        }
                                                                    } catch (error) {
                                                                        DrawerServices.navigate('ErrorScreen', {
                                                                            ErrorDisplay: error
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        } catch (error) {
                                                            DrawerServices.navigate('ErrorScreen', {
                                                                ErrorDisplay: error
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        } else if (data[0] == 'errorIsRegisterLeaveday') {
                                            ToasterSevice.showWarning('WarningNotRegisterOT', 5000);

                                            //xử lý lại event Save
                                            this.isProcessingAnalysic = false;
                                        } else if (data[0] == 'WarningDateQuitInRosterTimes') {
                                            ToasterSevice.showWarning(data[1], 5000);

                                            //xử lý lại event Save
                                            this.isProcessingAnalysic = false;
                                        } else if (data[0] == 'errorRegisterHoursInPast') {
                                            ToasterSevice.showWarning('WarningRegisterOTInPastMoreThanConfig', 5000);

                                            //xử lý lại event Save
                                            this.isProcessingAnalysic = false;
                                        } else if (data == 'FieldNotAllowNull') {
                                            ToasterSevice.showWarning('HRM_Attendance_Leaveday_ProfileID', 5000);

                                            //xử lý lại event Save
                                            this.isProcessingAnalysic = false;
                                        } else {
                                            this.IsFirstEvenDataBound = true;

                                            VnrLoadingSevices.show();
                                            this.analysisOvertimeList({ ...cloneData1.params }).then(data => {
                                                VnrLoadingSevices.hide();
                                                if (data) {
                                                    //check khung giờ Phổ Đình
                                                    if (data.IsConfirmWorkingByFrame) {
                                                        //check có dữ liệu bị BLOCK status
                                                        let listInvalidFame = data.EmployeeWorkingResults
                                                                ? data.EmployeeWorkingResults
                                                                : [],
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
                                                                (result[currentValue[key]] =
                                                                    result[currentValue[key]] || []).push(currentValue);

                                                                // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
                                                                return result;
                                                            }, {}); // empty object is the initial value for result object
                                                        };

                                                        const objInvalidFameGroup = groupBy(
                                                            listInvalidFame,
                                                            'DateString'
                                                        );

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
                                                                let paramLimitTimeSlot = {
                                                                    ...cloneData1.params,
                                                                    IsConfirmWorkingByFrame: true
                                                                };

                                                                this.analysisOvertimeListRender(paramLimitTimeSlot);
                                                            },
                                                            onClose: () => {},
                                                            dataSource
                                                        });

                                                        //xử lý lại event Save
                                                        this.isProcessingAnalysic = false;
                                                    } else {
                                                        let cloneData1OfData1 = { ...cloneData1 };

                                                        if (data == 'Error') {
                                                            ToasterSevice.showWarning(
                                                                'HRM_Message_DataInvalidRegisterLessThanConfig',
                                                                5000
                                                            );

                                                            //xử lý lại event Save
                                                            this.isProcessingAnalysic = false;

                                                            return;
                                                        }

                                                        if (data == 'WarningRegistHoursInPrenancyHours') {
                                                            ToasterSevice.showWarning(
                                                                'WarningRegistHoursInPrenancyHours',
                                                                5000
                                                            );

                                                            //xử lý lại event Save
                                                            this.isProcessingAnalysic = false;

                                                            return;
                                                        }

                                                        if (data.success == 'ErrorValidateWorkingBlock') {
                                                            ToasterSevice.showWarning(data.mess);

                                                            //xử lý lại event Save
                                                            this.isProcessingAnalysic = false;

                                                            return;
                                                        }

                                                        if (data.success == 'ErrorValidateWorkingWarning') {
                                                            AlertSevice.alert({
                                                                title: translate('Hrm_Notification'),
                                                                iconType: EnumIcon.E_INFO,
                                                                message: data.mess,
                                                                onCancel: () => {
                                                                    //xử lý lại event Save
                                                                    this.isProcessingAnalysic = false;
                                                                },
                                                                onConfirm: () => {
                                                                    let params = {
                                                                        ...cloneData1OfData1.params,
                                                                        strCodeEmpInvalidData: data[1],
                                                                        IsConfirmWorkingByFrame: true
                                                                    };
                                                                    this.analysisOvertimeListRender(params);
                                                                }
                                                            });
                                                        }

                                                        if (
                                                            typeof data == 'object' &&
                                                            data[0] == 'errorProfileNotShift'
                                                        ) {
                                                            AlertSevice.alert({
                                                                title: translate('Hrm_Notification'),
                                                                iconType: EnumIcon.E_INFO,
                                                                message:
                                                                    data[1] +
                                                                    ' ' +
                                                                    translate('PlsCheckRosterOfEmpByDate') +
                                                                    '. ' +
                                                                    translate('HRM_Message_AreYouContinute') +
                                                                    '?',
                                                                onCancel: () => {
                                                                    //xử lý lại event Save
                                                                    this.isProcessingAnalysic = false;
                                                                },
                                                                onConfirm: () => {
                                                                    let params = {
                                                                        ...cloneData1OfData1.params,
                                                                        strCodeEmpInvalidData: data[1]
                                                                    };

                                                                    VnrLoadingSevices.show();
                                                                    this.analysisOvertimeList(params).then(data1 => {
                                                                        VnrLoadingSevices.hide();
                                                                        try {
                                                                            if (data1 == 'Error') {
                                                                                //xử lý lại event Save
                                                                                this.isProcessingAnalysic = false;

                                                                                ToasterSevice.showWarning(
                                                                                    'HRM_Message_DataInvalidRegisterLessThanConfig',
                                                                                    5000
                                                                                );
                                                                                return;
                                                                            }

                                                                            if (
                                                                                data1 ==
                                                                                'WarningRegistHoursInPrenancyHours'
                                                                            ) {
                                                                                //xử lý lại event Save
                                                                                this.isProcessingAnalysic = false;

                                                                                ToasterSevice.showWarning(
                                                                                    'WarningRegistHoursInPrenancyHours',
                                                                                    5000
                                                                                );
                                                                                return;
                                                                            }

                                                                            if (data1 && Array.isArray(data1.Data)) {
                                                                                this.analysisOvertimeListRender(null, [
                                                                                    ...data1.Data
                                                                                ]);
                                                                            }
                                                                        } catch (error) {
                                                                            DrawerServices.navigate('ErrorScreen', {
                                                                                ErrorDisplay: error
                                                                            });
                                                                        }
                                                                    });
                                                                }
                                                            });
                                                        } else if (
                                                            typeof data == 'object' &&
                                                            data.success == 'ErrorUserApprove'
                                                        ) {
                                                            ToasterSevice.showWarning(data.mess);
                                                            this.analysisOvertimeListRender(null, []);
                                                        } else if (
                                                            typeof data == 'object' &&
                                                            data.success == 'errorRegisterHoursInPast'
                                                        ) {
                                                            ToasterSevice.showWarning(data.mess);
                                                            this.analysisOvertimeListRender(null, []);
                                                        }

                                                        if (data.Data && Array.isArray(data.Data)) {
                                                            this.analysisOvertimeListRender(null, [...data.Data]);
                                                        }
                                                    }
                                                }
                                            });
                                        }
                                    } catch (error) {
                                        DrawerServices.navigate('ErrorScreen', {
                                            ErrorDisplay: error
                                        });
                                    }
                                });
                            }
                        });
                    } else {
                        ToasterSevice.showWarning(data[1]);

                        //xử lý lại event Save
                        this.isProcessingAnalysic = false;
                    }
                } else if (data[0] == 'errorRegisterHours') {
                    if (data.length == 2 && data[1] != '') {
                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_INFO,
                            message: translate('WaringOvertimeBy') + ' ' + data[1] + ' ' + translate('IsLimited'),
                            onCancel: () => {
                                //xử lý lại event Save
                                this.isProcessingAnalysic = false;
                            },
                            onConfirm: () => {
                                this.IsFirstEvenDataBound = true;

                                this.analysisOvertimeList({ ...cloneParams }).then(data => {
                                    //check giới hạn khung giờ cho Phổ Đình
                                    if (data.IsConfirmWorkingByFrame) {
                                        //check có dữ liệu bị BLOCK status
                                        let listInvalidFame = data.EmployeeWorkingResults
                                                ? data.EmployeeWorkingResults
                                                : [],
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
                                                (result[currentValue[key]] = result[currentValue[key]] || []).push(
                                                    currentValue
                                                );

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
                                                let paramLimitTimeSlot = {
                                                    ...cloneParams,
                                                    IsConfirmWorkingByFrame: true
                                                };

                                                this.analysisOvertimeListRender(paramLimitTimeSlot);
                                            },
                                            onClose: () => {},
                                            dataSource
                                        });

                                        //xử lý lại event Save
                                        this.isProcessingAnalysic = false;
                                    } else if (data && data.Data && Array.isArray(data.Data)) {
                                        this.analysisOvertimeListRender(null, [...data.Data]);
                                    }
                                });
                            }
                        });
                    } else if (data.length >= 3 && data[1] != '') {
                        let mess =
                            translate('WaringOvertimeBy') + ' ' + data[1] + ' ' + translate('IsLimited') + data[2];

                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_INFO,
                            message: mess,
                            onCancel: () => {
                                //xử lý lại event Save
                                this.isProcessingAnalysic = false;
                            },
                            onConfirm: () => {
                                this.IsFirstEvenDataBound = true;
                                this.analysisOvertimeListRender({ ...cloneParams });
                            }
                        });
                    } else {
                        ToasterSevice.showWarning('HoursOversubscribedHoursRegistrationRules');

                        //xử lý lại event Save
                        this.isProcessingAnalysic = false;
                    }
                } else if (data[0] == 'errorRegisterHoursPro') {
                    //nhan - cấu hình bắt ngày tháng năm task 0108015
                    // listOvertimeLimit = data[1];
                    // if (!$(frm + ' #Grid_OvertimeLimit').data('kendoGrid')) {

                    //     $('#loadModal2').load('/New_Att_Overtime/New_OvertimeLimit', function (response1, status, xhr) {
                    //         if (status == 'success') {

                    //             binding_OvertimeLimit(listOvertimeLimit)
                    //         }
                    //         else {
                    //             Loading(false);
                    //         }
                    //     });

                    // }

                    let nextState = {
                        modalLimit: {
                            isModalVisible: true,
                            data: [...data[1]]
                        }
                    };

                    this.setState(nextState, () => {
                        //xử lý lại event Save
                        this.isProcessingAnalysic = false;
                    });
                } else if (data[0] == 'errorRegisterHoursOrg') {
                    // Loading(false);
                    // FormData.IsConfirmLimit = true;
                    // isDisabledLink(eleLink, false);

                    // listOvertimeLimit = data[1];
                    // if (!$(frm + ' #Grid_OvertimeLimit').data('kendoGrid')) {

                    //     $('#loadModal2').load('/New_Att_Overtime/New_OvertimeLimit', function (response1, status, xhr) {
                    //         if (status == 'success') {
                    //             binding_OvertimeLimit(listOvertimeLimit)
                    //         }
                    //         else {
                    //             Loading(false);
                    //         }
                    //     });

                    // }

                    let nextState = {
                        modalLimit: {
                            isModalVisible: true,
                            data: [...data[1]]
                        }
                    };

                    this.setState(nextState, () => {
                        //xử lý lại event Save
                        this.isProcessingAnalysic = false;
                    });
                } else if (data[0] == 'errorPregnancyPro') {
                    let mess = translate('Employee') + data[1];
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        iconType: EnumIcon.E_INFO,
                        message: mess,
                        onCancel: () => {},
                        onConfirm: () => {},
                        showConfirm: false
                    });

                    //xử lý lại event Save
                    this.isProcessingAnalysic = false;
                } else if (data[0] == 'errorPregnancyOrg') {
                    let messageText = translate('Employee') + data[1];

                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        iconType: EnumIcon.E_INFO,
                        message: messageText,
                        onCancel: () => {
                            //xử lý lại event Save
                            this.isProcessingAnalysic = false;
                        },
                        onConfirm: () => {
                            let data2 = {
                                models: [...updatedRecords],
                                params: {
                                    ...cloneParams,
                                    IsConfirm: true,
                                    IsConfirmPreg: true
                                }
                            };

                            VnrLoadingSevices.show();
                            this.analysisOvertimeListValidate(data2).then(data => {
                                VnrLoadingSevices.hide();
                                try {
                                    let cloneData2 = { ...data2 };

                                    if (data[0] && typeof data[0] == 'string') {
                                        //flagValidate = false;
                                        //Loading(false);

                                        //xử lý lại event Save
                                        this.isProcessingAnalysic = false;
                                    }
                                    if (data[0] == 'error') {
                                        ToasterSevice.showWarning(data[1], 5000);

                                        //xử lý lại event Save
                                        this.isProcessingAnalysic = false;
                                    } else if (data[0] == 'errorRegisterHours') {
                                        if (data.length == 2 && data[1] != '') {
                                            AlertSevice.alert({
                                                title: translate('Hrm_Notification'),
                                                iconType: EnumIcon.E_INFO,
                                                message:
                                                    translate('WaringOvertimeBy') +
                                                    ' ' +
                                                    data[1] +
                                                    ' ' +
                                                    translate('IsLimited'),
                                                onCancel: () => {
                                                    //xử lý lại event Save
                                                    this.isProcessingAnalysic = false;
                                                },
                                                onConfirm: () => {
                                                    this.IsFirstEvenDataBound = true;
                                                    this.analysisOvertimeListRender({
                                                        ...cloneData2.params
                                                    });
                                                }
                                            });
                                        } else if (data.length >= 3 && data[1] != '') {
                                            let mess =
                                                translate('WaringOvertimeBy') +
                                                ' ' +
                                                data[1] +
                                                ' ' +
                                                translate('IsLimited') +
                                                data[2];

                                            AlertSevice.alert({
                                                title: translate('Hrm_Notification'),
                                                iconType: EnumIcon.E_INFO,
                                                message: mess,
                                                onCancel: () => {
                                                    //xử lý lại event Save
                                                    this.isProcessingAnalysic = false;
                                                },
                                                onConfirm: () => {
                                                    this.IsFirstEvenDataBound = true;
                                                    this.analysisOvertimeListRender({
                                                        ...cloneData2.params
                                                    });
                                                }
                                            });
                                        } else {
                                            ToasterSevice.showWarning('HoursOversubscribedHoursRegistrationRules');

                                            //xử lý lại event Save
                                            this.isProcessingAnalysic = false;
                                        }
                                    } else if (data[0] == 'errorNotRoster') {
                                        ToasterSevice.showWarning('CanNotPlsCheckRosterOfEmpByDate');

                                        //xử lý lại event Save
                                        this.isProcessingAnalysic = false;
                                    } else if (data[0] == 'errorIsRegisterLeaveday') {
                                        ToasterSevice.showWarning('WarningNotRegisterOT');

                                        //xử lý lại event Save
                                        this.isProcessingAnalysic = false;
                                    } else if (data[0] == 'WarningDateQuitInRosterTimes') {
                                        ToasterSevice.showWarning(data[1]);

                                        //xử lý lại event Save
                                        this.isProcessingAnalysic = false;
                                    } else if (data[0] == 'errorRegisterHoursInPast') {
                                        ToasterSevice.showWarning('WarningRegisterOTInPastMoreThanConfig');

                                        //xử lý lại event Save
                                        this.isProcessingAnalysic = false;
                                    } else if (data == 'FieldNotAllowNull') {
                                        ToasterSevice.showWarning('HRM_Attendance_Leaveday_ProfileID');

                                        //xử lý lại event Save
                                        this.isProcessingAnalysic = false;
                                    } else {
                                        this.IsFirstEvenDataBound = true;

                                        VnrLoadingSevices.show();
                                        this.analysisOvertimeList({ ...cloneData2.params }).then(data => {
                                            VnrLoadingSevices.hide();
                                            try {
                                                if (data) {
                                                    let paramsCloneData2OfData2 = {
                                                        ...cloneData2.params
                                                    };

                                                    if (data == 'Error') {
                                                        ToasterSevice.showWarning('HRM_Message_DataInvalid');

                                                        //xử lý lại event Save
                                                        this.isProcessingAnalysic = false;

                                                        return;
                                                    }

                                                    if (data == 'WarningRegistHoursInPrenancyHours') {
                                                        ToasterSevice.showWarning('WarningRegistHoursInPrenancyHours');

                                                        //xử lý lại event Save
                                                        this.isProcessingAnalysic = false;

                                                        return;
                                                    }

                                                    if (typeof data == 'object' && data[0] == 'errorProfileNotShift') {
                                                        AlertSevice.alert({
                                                            title: translate('Hrm_Notification'),
                                                            iconType: EnumIcon.E_INFO,
                                                            message:
                                                                data[1] +
                                                                ' ' +
                                                                translate('PlsCheckRosterOfEmpByDate') +
                                                                '. ' +
                                                                translate('HRM_Message_AreYouContinute') +
                                                                '?',
                                                            onCancel: () => {
                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            },
                                                            onConfirm: () => {
                                                                let params = {
                                                                    ...paramsCloneData2OfData2,
                                                                    strCodeEmpInvalidData: data[1]
                                                                };

                                                                VnrLoadingSevices.show();
                                                                this.analysisOvertimeList(params).then(data1 => {
                                                                    VnrLoadingSevices.hide();
                                                                    if (data1 == 'Error') {
                                                                        ToasterSevice.showWarning(
                                                                            'HRM_Message_DataInvalid'
                                                                        );

                                                                        //xử lý lại event Save
                                                                        this.isProcessingAnalysic = false;

                                                                        return;
                                                                    }

                                                                    if (data1 == 'WarningRegistHoursInPrenancyHours') {
                                                                        ToasterSevice.showWarning(
                                                                            'WarningRegistHoursInPrenancyHours'
                                                                        );

                                                                        //xử lý lại event Save
                                                                        this.isProcessingAnalysic = false;

                                                                        return;
                                                                    }

                                                                    if (data1 && Array.isArray(data1.Data)) {
                                                                        this.analysisOvertimeListRender(null, [
                                                                            ...data1.Data
                                                                        ]);
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    }

                                                    if (data && Array.isArray(data.Data)) {
                                                        this.analysisOvertimeListRender(null, [...data.Data]);
                                                    }
                                                }
                                            } catch (error) {
                                                DrawerServices.navigate('ErrorScreen', {
                                                    ErrorDisplay: error
                                                });
                                            }
                                        });
                                    }
                                } catch (error) {
                                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                                }
                            });
                        }
                    });
                } else if (data[0] == 'errorNotRoster') {
                    ToasterSevice.showWarning('CanNotPlsCheckRosterOfEmpByDate', 5000);

                    //xử lý lại event Save
                    this.isProcessingAnalysic = false;
                } else if (data[0] == 'errorNotIsReceiveOvertimeBonusPro') {
                    let mess = translate('Employee') + data[1];
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        iconType: EnumIcon.E_INFO,
                        message: mess,
                        onCancel: () => {},
                        onConfirm: () => {},
                        showConfirm: false
                    });

                    //xử lý lại event Save
                    this.isProcessingAnalysic = false;
                } else if (data[0] == 'errorNotIsReceiveOvertimeBonusOrg') {
                    let messageText = translate('Employee') + data[1];

                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        iconType: EnumIcon.E_INFO,
                        message: messageText,
                        onCancel: () => {
                            //xử lý lại event Save
                            this.isProcessingAnalysic = false;
                        },
                        onConfirm: () => {
                            let data2 = {
                                models: [...updatedRecords],
                                params: {
                                    ...cloneParams,
                                    IsConfirm: true
                                }
                            };

                            VnrLoadingSevices.show();
                            this.analysisOvertimeListValidate(data2).then(data => {
                                VnrLoadingSevices.hide();
                                try {
                                    let cloneData2 = { ...data2 };

                                    if (data[0] && typeof data[0] == 'string') {
                                        //flagValidate = false;

                                        //xử lý lại event Save
                                        this.isProcessingAnalysic = false;
                                    }
                                    if (data[0] == 'error') {
                                        if (data[1].indexOf('ConfirmDuplicate') > -1) {
                                            AlertSevice.alert({
                                                title: translate('Hrm_Notification'),
                                                iconType: EnumIcon.E_INFO,
                                                message: translate('HRM_Overwite_Data'),
                                                onCancel: () => {
                                                    //xử lý lại event Save
                                                    this.isProcessingAnalysic = false;
                                                },
                                                onConfirm: () => {
                                                    let data1 = {};

                                                    if (data[1].indexOf('ConfirmDuplicateGrid') > -1) {
                                                        let lstDup = data[1].split('|');
                                                        lstDup.splice(lstDup.length - 1);
                                                        lstDup.splice(0, 1);

                                                        this.GlobalDataSource = [];
                                                        let currentData = [...currDataAnalysic]; //$('#Overtime_Validate').data().kendoGrid.dataSource.data();
                                                        for (let i = 0; i < currentData.length; i++) {
                                                            if (lstDup.indexOf(i.toString()) == -1) {
                                                                let obj = currentData[i];

                                                                if (
                                                                    obj['InTime'] &&
                                                                    obj['InTime'].indexOf('/Date') >= 0
                                                                )
                                                                    obj['InTime'] = new Date(
                                                                        parseInt(
                                                                            obj['InTime']
                                                                                .replace('/Date(', '')
                                                                                .replace(')/', ''),
                                                                            10
                                                                        )
                                                                    ).toISOString();

                                                                if (
                                                                    obj['OutTime'] &&
                                                                    obj['OutTime'].indexOf('/Date') >= 0
                                                                )
                                                                    obj['OutTime'] = new Date(
                                                                        parseInt(
                                                                            obj['OutTime']
                                                                                .replace('/Date(', '')
                                                                                .replace(')/', ''),
                                                                            10
                                                                        )
                                                                    ).toISOString();

                                                                if (obj['WorkDate'].indexOf('/Date') >= 0) {
                                                                    obj['WorkDate'] = new Date(
                                                                        parseInt(
                                                                            obj['WorkDate']
                                                                                .replace('/Date(', '')
                                                                                .replace(')/', ''),
                                                                            10
                                                                        )
                                                                    ).toISOString();
                                                                }

                                                                if (
                                                                    obj['WorkDateTo'] &&
                                                                    obj['WorkDateTo'].indexOf('/Date') >= 0
                                                                )
                                                                    obj['WorkDateTo'] = new Date(
                                                                        parseInt(
                                                                            obj['WorkDateTo']
                                                                                .replace('/Date(', '')
                                                                                .replace(')/', ''),
                                                                            10
                                                                        )
                                                                    ).toISOString();

                                                                if (
                                                                    obj['WorkDateRoot'] &&
                                                                    obj['WorkDateRoot'].indexOf('/Date') >= 0
                                                                )
                                                                    obj['WorkDateRoot'] = new Date(
                                                                        parseInt(
                                                                            obj['WorkDateRoot']
                                                                                .replace('/Date(', '')
                                                                                .replace(')/', ''),
                                                                            10
                                                                        )
                                                                    ).toISOString();

                                                                this.GlobalDataSource.push(obj);
                                                            }
                                                        }

                                                        data1 = {
                                                            models: [...this.GlobalDataSource],
                                                            params: {
                                                                ...cloneData2.params,
                                                                isDelDuplicate: true
                                                            }
                                                        };
                                                    } else {
                                                        data1 = {
                                                            models: [...updatedRecords],
                                                            params: {
                                                                ...cloneData2.params,
                                                                isDelDuplicate: true
                                                            }
                                                        };
                                                    }

                                                    VnrLoadingSevices.show();
                                                    this.analysisOvertimeListValidate(data1).then(data => {
                                                        VnrLoadingSevices.hide();
                                                        try {
                                                            let cloneData1 = { ...data1 };

                                                            if (data[0] && typeof data[0] == 'string') {
                                                                //flagValidate = false;

                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            }
                                                            if (data[0] == 'error') {
                                                                ToasterSevice.showWarning(data[1]);

                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            } else if (data[0] == 'errorRegisterHours') {
                                                                if (data.length == 2 && data[1] != '') {
                                                                    AlertSevice.alert({
                                                                        title: translate('Hrm_Notification'),
                                                                        iconType: EnumIcon.E_INFO,
                                                                        message:
                                                                            translate('WaringOvertimeBy') +
                                                                            ' ' +
                                                                            data[1] +
                                                                            ' ' +
                                                                            translate('IsLimited'),
                                                                        onCancel: () => {
                                                                            //xử lý lại event Save
                                                                            this.isProcessingAnalysic = false;
                                                                        },
                                                                        onConfirm: () => {
                                                                            this.IsFirstEvenDataBound = true;
                                                                            this.analysisOvertimeList({
                                                                                ...cloneData1.params
                                                                            }).then(data => {
                                                                                if (data && Array.isArray(data.Data)) {
                                                                                    this.analysisOvertimeListRender(
                                                                                        null,
                                                                                        [...data.Data]
                                                                                    );
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                } else if (data.length >= 3 && data[1] != '') {
                                                                    let mess =
                                                                        translate('WaringOvertimeBy') +
                                                                        ' ' +
                                                                        data[1] +
                                                                        ' ' +
                                                                        translate('IsLimited') +
                                                                        data[2];

                                                                    AlertSevice.alert({
                                                                        title: translate('Hrm_Notification'),
                                                                        iconType: EnumIcon.E_INFO,
                                                                        message: mess,
                                                                        onCancel: () => {
                                                                            //xử lý lại event Save
                                                                            this.isProcessingAnalysic = false;
                                                                        },
                                                                        onConfirm: () => {
                                                                            this.IsFirstEvenDataBound = true;
                                                                            this.analysisOvertimeList({
                                                                                ...cloneData1.params
                                                                            }).then(data => {
                                                                                if (data && data.Data) {
                                                                                    this.analysisOvertimeListRender(
                                                                                        null,
                                                                                        [...data.Data]
                                                                                    );
                                                                                }
                                                                            });
                                                                        }
                                                                    });
                                                                } else {
                                                                    ToasterSevice.showWarning(
                                                                        'HoursOversubscribedHoursRegistrationRules'
                                                                    );

                                                                    //xử lý lại event Save
                                                                    this.isProcessingAnalysic = false;
                                                                }
                                                            } else if (data[0] == 'errorRegisterHoursPro') {
                                                                //nhan - cấu hình bắt ngày tháng năm task 0108015
                                                                // listOvertimeLimit = data[1];
                                                                // if (!$(frm + ' #Grid_OvertimeLimit').data('kendoGrid')) {

                                                                //     $('#loadModal2').load('/New_Att_Overtime/New_OvertimeLimit', function (response1, status, xhr) {
                                                                //         if (status == 'success') {
                                                                //             binding_OvertimeLimit(listOvertimeLimit)
                                                                //         }
                                                                //         else {
                                                                //             Loading(false);
                                                                //         }
                                                                //     });

                                                                // }

                                                                let nextState = {
                                                                    modalLimit: {
                                                                        isModalVisible: true,
                                                                        data: [...data[1]]
                                                                    }
                                                                };

                                                                this.setState(nextState, () => {
                                                                    //xử lý lại event Save
                                                                    this.isProcessingAnalysic = false;
                                                                });
                                                            } else if (data[0] == 'errorRegisterHoursOrg') {
                                                                // FormData.IsConfirmLimit = true;
                                                                // listOvertimeLimit = data[1];
                                                                // if (!$(frm + ' #Grid_OvertimeLimit').data('kendoGrid')) {

                                                                //     $('#loadModal2').load('/New_Att_Overtime/New_OvertimeLimit', function (response1, status, xhr) {
                                                                //         if (status == 'success') {
                                                                //             binding_OvertimeLimit(listOvertimeLimit)
                                                                //         }
                                                                //         else {
                                                                //             Loading(false);
                                                                //         }
                                                                //     });

                                                                // }

                                                                let nextState = {
                                                                    modalLimit: {
                                                                        isModalVisible: true,
                                                                        data: [...data[1]]
                                                                    }
                                                                };

                                                                this.setState(nextState, () => {
                                                                    //xử lý lại event Save
                                                                    this.isProcessingAnalysic = false;
                                                                });
                                                            } else if (data[0] == 'errorPregnancyPro') {
                                                                let mess = translate('Employee') + data[1];
                                                                AlertSevice.alert({
                                                                    title: translate('Hrm_Notification'),
                                                                    iconType: EnumIcon.E_INFO,
                                                                    message: mess,
                                                                    onCancel: () => {},
                                                                    onConfirm: () => {},
                                                                    showConfirm: false
                                                                });

                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            } else if (data[0] == 'errorPregnancyOrg') {
                                                                let messageText = translate('Employee') + data[1];
                                                                AlertSevice.alert({
                                                                    title: translate('Hrm_Notification'),
                                                                    iconType: EnumIcon.E_INFO,
                                                                    message: messageText,
                                                                    onCancel: () => {
                                                                        //xử lý lại event Save
                                                                        this.isProcessingAnalysic = false;
                                                                    },
                                                                    onConfirm: () => {
                                                                        let data2 = {
                                                                            models: [...updatedRecords],
                                                                            params: {
                                                                                ...cloneData1.params,
                                                                                IsConfirm: true,
                                                                                IsConfirmPreg: true
                                                                            }
                                                                        };

                                                                        VnrLoadingSevices.show();
                                                                        this.analysisOvertimeListValidate(data2).then(
                                                                            data => {
                                                                                VnrLoadingSevices.hide();
                                                                                try {
                                                                                    let cloneData2OfData2 = {
                                                                                        ...data2
                                                                                    };

                                                                                    if (
                                                                                        data[0] &&
                                                                                        typeof data[0] == 'string'
                                                                                    ) {
                                                                                        //flagValidate = false;
                                                                                        //Loading(false);

                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;
                                                                                    }
                                                                                    if (data[0] == 'error') {
                                                                                        ToasterSevice.showWarning(
                                                                                            data[1]
                                                                                        );

                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;
                                                                                    } else if (
                                                                                        data[0] == 'errorRegisterHours'
                                                                                    ) {
                                                                                        if (
                                                                                            data.length == 2 &&
                                                                                            data[1] != ''
                                                                                        ) {
                                                                                            AlertSevice.alert({
                                                                                                title: translate(
                                                                                                    'Hrm_Notification'
                                                                                                ),
                                                                                                iconType:
                                                                                                    EnumIcon.E_INFO,
                                                                                                message:
                                                                                                    translate(
                                                                                                        'WaringOvertimeBy'
                                                                                                    ) +
                                                                                                    ' ' +
                                                                                                    data[1] +
                                                                                                    ' ' +
                                                                                                    translate(
                                                                                                        'IsLimited'
                                                                                                    ),
                                                                                                onCancel: () => {
                                                                                                    //xử lý lại event Save
                                                                                                    this.isProcessingAnalysic = false;
                                                                                                },
                                                                                                onConfirm: () => {
                                                                                                    this.IsFirstEvenDataBound = true;

                                                                                                    VnrLoadingSevices.show();
                                                                                                    this.analysisOvertimeList(
                                                                                                        {
                                                                                                            ...cloneData2OfData2.params
                                                                                                        }
                                                                                                    ).then(data => {
                                                                                                        VnrLoadingSevices.hide();
                                                                                                        try {
                                                                                                            if (
                                                                                                                data &&
                                                                                                                Array.isArray(
                                                                                                                    data.Data
                                                                                                                )
                                                                                                            ) {
                                                                                                                this.analysisOvertimeListRender(
                                                                                                                    null,
                                                                                                                    [
                                                                                                                        ...data.Data
                                                                                                                    ]
                                                                                                                );
                                                                                                            }
                                                                                                        } catch (error) {
                                                                                                            DrawerServices.navigate(
                                                                                                                'ErrorScreen',
                                                                                                                {
                                                                                                                    ErrorDisplay: error
                                                                                                                }
                                                                                                            );
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            });
                                                                                        } else if (
                                                                                            data.length >= 3 &&
                                                                                            data[1] != ''
                                                                                        ) {
                                                                                            let mess =
                                                                                                translate(
                                                                                                    'WaringOvertimeBy'
                                                                                                ) +
                                                                                                ' ' +
                                                                                                data[1] +
                                                                                                ' ' +
                                                                                                translate('IsLimited') +
                                                                                                data[2];

                                                                                            AlertSevice.alert({
                                                                                                title: translate(
                                                                                                    'Hrm_Notification'
                                                                                                ),
                                                                                                iconType:
                                                                                                    EnumIcon.E_INFO,
                                                                                                message: mess,
                                                                                                onCancel: () => {
                                                                                                    //xử lý lại event Save
                                                                                                    this.isProcessingAnalysic = false;
                                                                                                },
                                                                                                onConfirm: () => {
                                                                                                    this.IsFirstEvenDataBound = true;

                                                                                                    VnrLoadingSevices.show();
                                                                                                    this.analysisOvertimeList(
                                                                                                        {
                                                                                                            ...cloneData2OfData2.params
                                                                                                        }
                                                                                                    ).then(data => {
                                                                                                        VnrLoadingSevices.hide();
                                                                                                        try {
                                                                                                            if (
                                                                                                                data &&
                                                                                                                Array.isArray(
                                                                                                                    data.Data
                                                                                                                )
                                                                                                            ) {
                                                                                                                this.analysisOvertimeListRender(
                                                                                                                    null,
                                                                                                                    [
                                                                                                                        ...data.Data
                                                                                                                    ]
                                                                                                                );
                                                                                                            }
                                                                                                        } catch (error) {
                                                                                                            DrawerServices.navigate(
                                                                                                                'ErrorScreen',
                                                                                                                {
                                                                                                                    ErrorDisplay: error
                                                                                                                }
                                                                                                            );
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            });
                                                                                        } else {
                                                                                            ToasterSevice.showWarning(
                                                                                                'HoursOversubscribedHoursRegistrationRules'
                                                                                            );

                                                                                            //xử lý lại event Save
                                                                                            this.isProcessingAnalysic = false;
                                                                                        }
                                                                                    } else if (
                                                                                        data[0] == 'errorNotRoster'
                                                                                    ) {
                                                                                        ToasterSevice.showWarning(
                                                                                            'CanNotPlsCheckRosterOfEmpByDate'
                                                                                        );

                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;
                                                                                    } else if (
                                                                                        data[0] ==
                                                                                        'errorIsRegisterLeaveday'
                                                                                    ) {
                                                                                        ToasterSevice.showWarning(
                                                                                            'WarningNotRegisterOT'
                                                                                        );

                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;
                                                                                    } else if (
                                                                                        data[0] ==
                                                                                        'WarningDateQuitInRosterTimes'
                                                                                    ) {
                                                                                        ToasterSevice.showWarning(
                                                                                            data[1],
                                                                                            'warning',
                                                                                            false
                                                                                        );

                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;
                                                                                    } else if (
                                                                                        data[0] ==
                                                                                        'errorRegisterHoursInPast'
                                                                                    ) {
                                                                                        ToasterSevice.showWarning(
                                                                                            'WarningRegisterOTInPastMoreThanConfig'
                                                                                        );

                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;
                                                                                    } else if (
                                                                                        data == 'FieldNotAllowNull'
                                                                                    ) {
                                                                                        ToasterSevice.showWarning(
                                                                                            'HRM_Attendance_Leaveday_ProfileID'
                                                                                        );

                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;
                                                                                    } else {
                                                                                        this.IsFirstEvenDataBound = true;
                                                                                        VnrLoadingSevices.show();
                                                                                        this.analysisOvertimeList({
                                                                                            ...cloneData2OfData2.params
                                                                                        }).then(data => {
                                                                                            VnrLoadingSevices.hide();
                                                                                            try {
                                                                                                if (data) {
                                                                                                    let paramsCloneData2OfData2 = {
                                                                                                        ...cloneData2OfData2.params
                                                                                                    };

                                                                                                    if (
                                                                                                        data == 'Error'
                                                                                                    ) {
                                                                                                        //xử lý lại event Save
                                                                                                        this.isProcessingAnalysic = false;

                                                                                                        ToasterSevice.showWarning(
                                                                                                            'HRM_Message_DataInvalidRegisterLessThanConfig'
                                                                                                        );
                                                                                                        return;
                                                                                                    }

                                                                                                    if (
                                                                                                        data ==
                                                                                                        'WarningRegistHoursInPrenancyHours'
                                                                                                    ) {
                                                                                                        //xử lý lại event Save
                                                                                                        this.isProcessingAnalysic = false;

                                                                                                        ToasterSevice.showWarning(
                                                                                                            'WarningRegistHoursInPrenancyHours'
                                                                                                        );
                                                                                                        return;
                                                                                                    }

                                                                                                    if (
                                                                                                        typeof data ==
                                                                                                            'object' &&
                                                                                                        data[0] ==
                                                                                                            'errorProfileNotShift'
                                                                                                    ) {
                                                                                                        AlertSevice.alert(
                                                                                                            {
                                                                                                                title: translate(
                                                                                                                    'Hrm_Notification'
                                                                                                                ),
                                                                                                                iconType:
                                                                                                                    EnumIcon.E_INFO,
                                                                                                                message:
                                                                                                                    data[1] +
                                                                                                                    ' ' +
                                                                                                                    translate(
                                                                                                                        'PlsCheckRosterOfEmpByDate'
                                                                                                                    ) +
                                                                                                                    '. ' +
                                                                                                                    translate(
                                                                                                                        'HRM_Message_AreYouContinute'
                                                                                                                    ) +
                                                                                                                    '?',
                                                                                                                onCancel: () => {
                                                                                                                    //xử lý lại event Save
                                                                                                                    this.isProcessingAnalysic = false;
                                                                                                                },
                                                                                                                onConfirm: () => {
                                                                                                                    let params = {
                                                                                                                        ...paramsCloneData2OfData2,
                                                                                                                        strCodeEmpInvalidData:
                                                                                                                            data[1]
                                                                                                                    };

                                                                                                                    VnrLoadingSevices.show();
                                                                                                                    this.analysisOvertimeList(
                                                                                                                        params
                                                                                                                    ).then(
                                                                                                                        data1 => {
                                                                                                                            VnrLoadingSevices.hide();
                                                                                                                            try {
                                                                                                                                if (
                                                                                                                                    data1 ==
                                                                                                                                    'Error'
                                                                                                                                ) {
                                                                                                                                    //xử lý lại event Save
                                                                                                                                    this.isProcessingAnalysic = false;
                                                                                                                                    ToasterSevice.showWarning(
                                                                                                                                        'HRM_Message_DataInvalidRegisterLessThanConfig'
                                                                                                                                    );
                                                                                                                                    return;
                                                                                                                                }

                                                                                                                                if (
                                                                                                                                    data1 ==
                                                                                                                                    'WarningRegistHoursInPrenancyHours'
                                                                                                                                ) {
                                                                                                                                    //xử lý lại event Save
                                                                                                                                    this.isProcessingAnalysic = false;
                                                                                                                                    ToasterSevice.showWarning(
                                                                                                                                        'WarningRegistHoursInPrenancyHours'
                                                                                                                                    );
                                                                                                                                    return;
                                                                                                                                }

                                                                                                                                if (
                                                                                                                                    data1 &&
                                                                                                                                    Array.isArray(
                                                                                                                                        data1.Data
                                                                                                                                    )
                                                                                                                                ) {
                                                                                                                                    this.analysisOvertimeListRender(
                                                                                                                                        null,
                                                                                                                                        [
                                                                                                                                            ...data1.Data
                                                                                                                                        ]
                                                                                                                                    );
                                                                                                                                }
                                                                                                                            } catch (error) {
                                                                                                                                DrawerServices.navigate(
                                                                                                                                    'ErrorScreen',
                                                                                                                                    {
                                                                                                                                        ErrorDisplay: error
                                                                                                                                    }
                                                                                                                                );
                                                                                                                            }
                                                                                                                        }
                                                                                                                    );
                                                                                                                }
                                                                                                            }
                                                                                                        );
                                                                                                    }

                                                                                                    if (
                                                                                                        data &&
                                                                                                        Array.isArray(
                                                                                                            data.Data
                                                                                                        )
                                                                                                    ) {
                                                                                                        this.analysisOvertimeListRender(
                                                                                                            null,
                                                                                                            [
                                                                                                                ...data.Data
                                                                                                            ]
                                                                                                        );
                                                                                                    }
                                                                                                }
                                                                                            } catch (error) {
                                                                                                DrawerServices.navigate(
                                                                                                    'ErrorScreen',
                                                                                                    {
                                                                                                        ErrorDisplay: error
                                                                                                    }
                                                                                                );
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                } catch (error) {
                                                                                    DrawerServices.navigate(
                                                                                        'ErrorScreen',
                                                                                        { ErrorDisplay: error }
                                                                                    );
                                                                                }
                                                                            }
                                                                        );
                                                                    }
                                                                });
                                                            } else if (data[0] == 'errorNotRoster') {
                                                                ToasterSevice.showWarning(
                                                                    'CanNotPlsCheckRosterOfEmpByDate'
                                                                );

                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            } else if (data[0] == 'errorNotIsReceiveOvertimeBonusPro') {
                                                                let mess = translate('Employee') + data[1];
                                                                AlertSevice.alert({
                                                                    title: translate('Hrm_Notification'),
                                                                    iconType: EnumIcon.E_INFO,
                                                                    message: mess,
                                                                    onCancel: () => {},
                                                                    onConfirm: () => {},
                                                                    showConfirm: false
                                                                });

                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            } else if (data[0] == 'errorNotIsReceiveOvertimeBonusOrg') {
                                                                let messageText = translate('Employee') + data[1];
                                                                AlertSevice.alert({
                                                                    title: translate('Hrm_Notification'),
                                                                    iconType: EnumIcon.E_INFO,
                                                                    message: messageText,
                                                                    onCancel: () => {
                                                                        //xử lý lại event Save
                                                                        this.isProcessingAnalysic = false;
                                                                    },
                                                                    onConfirm: () => {
                                                                        let data2 = {
                                                                            models: [...updatedRecords],
                                                                            params: {
                                                                                ...cloneData1.params,
                                                                                IsConfirm: true
                                                                            }
                                                                        };

                                                                        VnrLoadingSevices.show();
                                                                        this.analysisOvertimeListValidate(data2).then(
                                                                            data => {
                                                                                VnrLoadingSevices.hide();
                                                                                try {
                                                                                    let cloneData2OfData2 = {
                                                                                        ...data2
                                                                                    };

                                                                                    if (
                                                                                        data[0] &&
                                                                                        typeof data[0] == 'string'
                                                                                    ) {
                                                                                        //flagValidate = false;

                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;
                                                                                    }
                                                                                    if (data[0] == 'error') {
                                                                                        ToasterSevice.showWarning(
                                                                                            data[1]
                                                                                        );

                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;
                                                                                    } else if (
                                                                                        data[0] == 'errorRegisterHours'
                                                                                    ) {
                                                                                        if (
                                                                                            data.length == 2 &&
                                                                                            data[1] != ''
                                                                                        ) {
                                                                                            AlertSevice.alert({
                                                                                                title: translate(
                                                                                                    'Hrm_Notification'
                                                                                                ),
                                                                                                iconType:
                                                                                                    EnumIcon.E_INFO,
                                                                                                message:
                                                                                                    translate(
                                                                                                        'WaringOvertimeBy'
                                                                                                    ) +
                                                                                                    ' ' +
                                                                                                    data[1] +
                                                                                                    ' ' +
                                                                                                    translate(
                                                                                                        'IsLimited'
                                                                                                    ),
                                                                                                onCancel: () => {
                                                                                                    //xử lý lại event Save
                                                                                                    this.isProcessingAnalysic = false;
                                                                                                },
                                                                                                onConfirm: () => {
                                                                                                    this.IsFirstEvenDataBound = true;

                                                                                                    VnrLoadingSevices.show();
                                                                                                    this.analysisOvertimeList(
                                                                                                        {
                                                                                                            ...cloneData2OfData2.params
                                                                                                        }
                                                                                                    ).then(data => {
                                                                                                        VnrLoadingSevices.hide();
                                                                                                        try {
                                                                                                            if (
                                                                                                                data &&
                                                                                                                Array.isArray(
                                                                                                                    data.Data
                                                                                                                )
                                                                                                            ) {
                                                                                                                this.analysisOvertimeListRender(
                                                                                                                    null,
                                                                                                                    [
                                                                                                                        ...data.Data
                                                                                                                    ]
                                                                                                                );
                                                                                                            }
                                                                                                        } catch (error) {
                                                                                                            DrawerServices.navigate(
                                                                                                                'ErrorScreen',
                                                                                                                {
                                                                                                                    ErrorDisplay: error
                                                                                                                }
                                                                                                            );
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            });
                                                                                        } else if (
                                                                                            data.length >= 3 &&
                                                                                            data[1] != ''
                                                                                        ) {
                                                                                            let mess =
                                                                                                translate(
                                                                                                    'WaringOvertimeBy'
                                                                                                ) +
                                                                                                ' ' +
                                                                                                data[1] +
                                                                                                ' ' +
                                                                                                translate('IsLimited') +
                                                                                                data[2];

                                                                                            AlertSevice.alert({
                                                                                                title: translate(
                                                                                                    'Hrm_Notification'
                                                                                                ),
                                                                                                iconType:
                                                                                                    EnumIcon.E_INFO,
                                                                                                message: mess,
                                                                                                onCancel: () => {
                                                                                                    //xử lý lại event Save
                                                                                                    this.isProcessingAnalysic = false;
                                                                                                },
                                                                                                onConfirm: () => {
                                                                                                    this.IsFirstEvenDataBound = true;

                                                                                                    VnrLoadingSevices.show();
                                                                                                    this.analysisOvertimeList(
                                                                                                        {
                                                                                                            ...cloneData2OfData2.params
                                                                                                        }
                                                                                                    ).then(data => {
                                                                                                        VnrLoadingSevices.hide();
                                                                                                        try {
                                                                                                            if (
                                                                                                                data &&
                                                                                                                Array.isArray(
                                                                                                                    data.Data
                                                                                                                )
                                                                                                            ) {
                                                                                                                this.analysisOvertimeListRender(
                                                                                                                    null,
                                                                                                                    [
                                                                                                                        ...data.Data
                                                                                                                    ]
                                                                                                                );
                                                                                                            }
                                                                                                        } catch (error) {
                                                                                                            DrawerServices.navigate(
                                                                                                                'ErrorScreen',
                                                                                                                {
                                                                                                                    ErrorDisplay: error
                                                                                                                }
                                                                                                            );
                                                                                                        }
                                                                                                    });
                                                                                                }
                                                                                            });
                                                                                        } else {
                                                                                            ToasterSevice.showWarning(
                                                                                                'HoursOversubscribedHoursRegistrationRules'
                                                                                            );
                                                                                        }
                                                                                    } else if (
                                                                                        data[0] == 'errorPregnancyPro'
                                                                                    ) {
                                                                                        let messageTextPreg =
                                                                                            translate('Employee') +
                                                                                            data[1];
                                                                                        AlertSevice.alert({
                                                                                            title: translate(
                                                                                                'Hrm_Notification'
                                                                                            ),
                                                                                            iconType: EnumIcon.E_INFO,
                                                                                            message: messageTextPreg,
                                                                                            onCancel: () => {},
                                                                                            onConfirm: () => {},
                                                                                            showConfirm: false
                                                                                        });

                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;
                                                                                    } else if (
                                                                                        data[0] == 'errorPregnancyOrg'
                                                                                    ) {
                                                                                        let messageText =
                                                                                            translate('Employee') +
                                                                                            data[1];
                                                                                        AlertSevice.alert({
                                                                                            title: translate(
                                                                                                'Hrm_Notification'
                                                                                            ),
                                                                                            iconType: EnumIcon.E_INFO,
                                                                                            message: messageText,
                                                                                            onCancel: () => {
                                                                                                //xử lý lại event Save
                                                                                                this.isProcessingAnalysic = false;
                                                                                            },
                                                                                            onConfirm: () => {
                                                                                                let data2 = {
                                                                                                    models: [
                                                                                                        ...updatedRecords
                                                                                                    ],
                                                                                                    params: {
                                                                                                        ...cloneData2OfData2.params,
                                                                                                        IsConfirm: true,
                                                                                                        IsConfirmPreg: true
                                                                                                    }
                                                                                                };
                                                                                                VnrLoadingSevices.show();
                                                                                                this.analysisOvertimeListValidate(
                                                                                                    data2
                                                                                                ).then(data => {
                                                                                                    VnrLoadingSevices.hide();
                                                                                                    try {
                                                                                                        let paramsCloneData2OfData2 = {
                                                                                                            ...data2.params
                                                                                                        };

                                                                                                        if (
                                                                                                            data[0] &&
                                                                                                            typeof data[0] ==
                                                                                                                'string'
                                                                                                        ) {
                                                                                                            //flagValidate = false;

                                                                                                            //xử lý lại event Save
                                                                                                            this.isProcessingAnalysic = false;
                                                                                                        }
                                                                                                        if (
                                                                                                            data[0] ==
                                                                                                            'error'
                                                                                                        ) {
                                                                                                            ToasterSevice.showWarning(
                                                                                                                data[1]
                                                                                                            );

                                                                                                            //xử lý lại event Save
                                                                                                            this.isProcessingAnalysic = false;
                                                                                                        } else if (
                                                                                                            data[0] ==
                                                                                                            'errorRegisterHours'
                                                                                                        ) {
                                                                                                            if (
                                                                                                                data.length ==
                                                                                                                    2 &&
                                                                                                                data[1] !=
                                                                                                                    ''
                                                                                                            ) {
                                                                                                                AlertSevice.alert(
                                                                                                                    {
                                                                                                                        title: translate(
                                                                                                                            'Hrm_Notification'
                                                                                                                        ),
                                                                                                                        iconType:
                                                                                                                            EnumIcon.E_INFO,
                                                                                                                        message:
                                                                                                                            translate(
                                                                                                                                'WaringOvertimeBy'
                                                                                                                            ) +
                                                                                                                            ' ' +
                                                                                                                            data[1] +
                                                                                                                            ' ' +
                                                                                                                            translate(
                                                                                                                                'IsLimited'
                                                                                                                            ),
                                                                                                                        onCancel: () => {
                                                                                                                            //xử lý lại event Save
                                                                                                                            this.isProcessingAnalysic = false;
                                                                                                                        },
                                                                                                                        onConfirm: () => {
                                                                                                                            this.IsFirstEvenDataBound = true;

                                                                                                                            VnrLoadingSevices.show();
                                                                                                                            this.analysisOvertimeList(
                                                                                                                                {
                                                                                                                                    ...paramsCloneData2OfData2
                                                                                                                                }
                                                                                                                            ).then(
                                                                                                                                data => {
                                                                                                                                    VnrLoadingSevices.hide();
                                                                                                                                    try {
                                                                                                                                        if (
                                                                                                                                            data &&
                                                                                                                                            Array.isArray(
                                                                                                                                                data.Data
                                                                                                                                            )
                                                                                                                                        ) {
                                                                                                                                            this.analysisOvertimeListRender(
                                                                                                                                                null,
                                                                                                                                                [
                                                                                                                                                    ...data.Data
                                                                                                                                                ]
                                                                                                                                            );
                                                                                                                                        }
                                                                                                                                    } catch (error) {
                                                                                                                                        DrawerServices.navigate(
                                                                                                                                            'ErrorScreen',
                                                                                                                                            {
                                                                                                                                                ErrorDisplay: error
                                                                                                                                            }
                                                                                                                                        );
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            );
                                                                                                                        }
                                                                                                                    }
                                                                                                                );
                                                                                                            } else if (
                                                                                                                data.length >=
                                                                                                                    3 &&
                                                                                                                data[1] !=
                                                                                                                    ''
                                                                                                            ) {
                                                                                                                let mess =
                                                                                                                    translate(
                                                                                                                        'WaringOvertimeBy'
                                                                                                                    ) +
                                                                                                                    ' ' +
                                                                                                                    data[1] +
                                                                                                                    ' ' +
                                                                                                                    translate(
                                                                                                                        'IsLimited'
                                                                                                                    ) +
                                                                                                                    data[2];

                                                                                                                AlertSevice.alert(
                                                                                                                    {
                                                                                                                        title: translate(
                                                                                                                            'Hrm_Notification'
                                                                                                                        ),
                                                                                                                        iconType:
                                                                                                                            EnumIcon.E_INFO,
                                                                                                                        message: mess,
                                                                                                                        onCancel: () => {
                                                                                                                            //xử lý lại event Save
                                                                                                                            this.isProcessingAnalysic = false;
                                                                                                                        },
                                                                                                                        onConfirm: () => {
                                                                                                                            this.IsFirstEvenDataBound = true;

                                                                                                                            VnrLoadingSevices.show();
                                                                                                                            this.analysisOvertimeList(
                                                                                                                                {
                                                                                                                                    ...paramsCloneData2OfData2
                                                                                                                                }
                                                                                                                            ).then(
                                                                                                                                data => {
                                                                                                                                    VnrLoadingSevices.hide();
                                                                                                                                    try {
                                                                                                                                        if (
                                                                                                                                            data &&
                                                                                                                                            Array.isArray(
                                                                                                                                                data.Data
                                                                                                                                            )
                                                                                                                                        ) {
                                                                                                                                            this.analysisOvertimeListRender(
                                                                                                                                                null,
                                                                                                                                                [
                                                                                                                                                    ...data.Data
                                                                                                                                                ]
                                                                                                                                            );
                                                                                                                                        }
                                                                                                                                    } catch (error) {
                                                                                                                                        DrawerServices.navigate(
                                                                                                                                            'ErrorScreen',
                                                                                                                                            {
                                                                                                                                                ErrorDisplay: error
                                                                                                                                            }
                                                                                                                                        );
                                                                                                                                    }
                                                                                                                                }
                                                                                                                            );
                                                                                                                        }
                                                                                                                    }
                                                                                                                );
                                                                                                            } else {
                                                                                                                ToasterSevice.showWarning(
                                                                                                                    'HoursOversubscribedHoursRegistrationRules'
                                                                                                                );

                                                                                                                //xử lý lại event Save
                                                                                                                this.isProcessingAnalysic = false;
                                                                                                            }
                                                                                                        } else if (
                                                                                                            data[0] ==
                                                                                                            'errorNotRoster'
                                                                                                        ) {
                                                                                                            ToasterSevice.showWarning(
                                                                                                                'CanNotPlsCheckRosterOfEmpByDate'
                                                                                                            );

                                                                                                            //xử lý lại event Save
                                                                                                            this.isProcessingAnalysic = false;
                                                                                                        } else if (
                                                                                                            data[0] ==
                                                                                                            'errorIsRegisterLeaveday'
                                                                                                        ) {
                                                                                                            ToasterSevice.showWarning(
                                                                                                                'WarningNotRegisterOT'
                                                                                                            );

                                                                                                            //xử lý lại event Save
                                                                                                            this.isProcessingAnalysic = false;
                                                                                                        } else if (
                                                                                                            data[0] ==
                                                                                                            'WarningDateQuitInRosterTimes'
                                                                                                        ) {
                                                                                                            ToasterSevice.showWarning(
                                                                                                                data[1],
                                                                                                                'warning',
                                                                                                                false
                                                                                                            );

                                                                                                            //xử lý lại event Save
                                                                                                            this.isProcessingAnalysic = false;
                                                                                                        } else if (
                                                                                                            data[0] ==
                                                                                                            'errorRegisterHoursInPast'
                                                                                                        ) {
                                                                                                            ToasterSevice.showWarning(
                                                                                                                'WarningRegisterOTInPastMoreThanConfig'
                                                                                                            );

                                                                                                            //xử lý lại event Save
                                                                                                            this.isProcessingAnalysic = false;
                                                                                                        } else if (
                                                                                                            data ==
                                                                                                            'FieldNotAllowNull'
                                                                                                        ) {
                                                                                                            ToasterSevice.showWarning(
                                                                                                                'HRM_Attendance_Leaveday_ProfileID'
                                                                                                            );

                                                                                                            //xử lý lại event Save
                                                                                                            this.isProcessingAnalysic = false;
                                                                                                        } else {
                                                                                                            this.IsFirstEvenDataBound = true;
                                                                                                            VnrLoadingSevices.show();
                                                                                                            this.analysisOvertimeList(
                                                                                                                {
                                                                                                                    ...paramsCloneData2OfData2
                                                                                                                }
                                                                                                            ).then(
                                                                                                                data => {
                                                                                                                    VnrLoadingSevices.hide();
                                                                                                                    try {
                                                                                                                        if (
                                                                                                                            data
                                                                                                                        ) {
                                                                                                                            let cloneparamsCloneData2OfData2 = {
                                                                                                                                ...paramsCloneData2OfData2
                                                                                                                            };

                                                                                                                            if (
                                                                                                                                data ==
                                                                                                                                'Error'
                                                                                                                            ) {
                                                                                                                                //xử lý lại event Save
                                                                                                                                this.isProcessingAnalysic = false;

                                                                                                                                ToasterSevice.showWarning(
                                                                                                                                    'HRM_Message_DataInvalidRegisterLessThanConfig'
                                                                                                                                );
                                                                                                                                return;
                                                                                                                            }

                                                                                                                            if (
                                                                                                                                data ==
                                                                                                                                'WarningRegistHoursInPrenancyHours'
                                                                                                                            ) {
                                                                                                                                //xử lý lại event Save
                                                                                                                                this.isProcessingAnalysic = false;

                                                                                                                                ToasterSevice.showWarning(
                                                                                                                                    'WarningRegistHoursInPrenancyHours'
                                                                                                                                );
                                                                                                                                return;
                                                                                                                            }

                                                                                                                            if (
                                                                                                                                typeof data ==
                                                                                                                                    'object' &&
                                                                                                                                data[0] ==
                                                                                                                                    'errorProfileNotShift'
                                                                                                                            ) {
                                                                                                                                AlertSevice.alert(
                                                                                                                                    {
                                                                                                                                        title: translate(
                                                                                                                                            'Hrm_Notification'
                                                                                                                                        ),
                                                                                                                                        iconType:
                                                                                                                                            EnumIcon.E_INFO,
                                                                                                                                        message:
                                                                                                                                            data[1] +
                                                                                                                                            ' ' +
                                                                                                                                            translate(
                                                                                                                                                'PlsCheckRosterOfEmpByDate'
                                                                                                                                            ) +
                                                                                                                                            '. ' +
                                                                                                                                            translate(
                                                                                                                                                'HRM_Message_AreYouContinute'
                                                                                                                                            ) +
                                                                                                                                            '?',
                                                                                                                                        onCancel: () => {
                                                                                                                                            //xử lý lại event Save
                                                                                                                                            this.isProcessingAnalysic = false;
                                                                                                                                        },
                                                                                                                                        onConfirm: () => {
                                                                                                                                            let params = {
                                                                                                                                                ...cloneparamsCloneData2OfData2,
                                                                                                                                                strCodeEmpInvalidData:
                                                                                                                                                    data[1]
                                                                                                                                            };

                                                                                                                                            VnrLoadingSevices.show();
                                                                                                                                            this.analysisOvertimeList(
                                                                                                                                                params
                                                                                                                                            ).then(
                                                                                                                                                data1 => {
                                                                                                                                                    VnrLoadingSevices.hide();
                                                                                                                                                    if (
                                                                                                                                                        data1 ==
                                                                                                                                                        'Error'
                                                                                                                                                    ) {
                                                                                                                                                        //xử lý lại event Save
                                                                                                                                                        this.isProcessingAnalysic = false;

                                                                                                                                                        ToasterSevice.showWarning(
                                                                                                                                                            'HRM_Message_DataInvalidRegisterLessThanConfig'
                                                                                                                                                        );
                                                                                                                                                        return;
                                                                                                                                                    }

                                                                                                                                                    if (
                                                                                                                                                        data1 ==
                                                                                                                                                        'WarningRegistHoursInPrenancyHours'
                                                                                                                                                    ) {
                                                                                                                                                        //xử lý lại event Save
                                                                                                                                                        this.isProcessingAnalysic = false;

                                                                                                                                                        ToasterSevice.showWarning(
                                                                                                                                                            'WarningRegistHoursInPrenancyHours'
                                                                                                                                                        );
                                                                                                                                                        return;
                                                                                                                                                    }

                                                                                                                                                    if (
                                                                                                                                                        data1 &&
                                                                                                                                                        Array.isArray(
                                                                                                                                                            data1.Data
                                                                                                                                                        )
                                                                                                                                                    ) {
                                                                                                                                                        this.analysisOvertimeListRender(
                                                                                                                                                            null,
                                                                                                                                                            [
                                                                                                                                                                ...data1.Data
                                                                                                                                                            ]
                                                                                                                                                        );
                                                                                                                                                    }
                                                                                                                                                }
                                                                                                                                            );
                                                                                                                                        }
                                                                                                                                    }
                                                                                                                                );
                                                                                                                            }

                                                                                                                            if (
                                                                                                                                data &&
                                                                                                                                Array.isArray(
                                                                                                                                    data.Data
                                                                                                                                )
                                                                                                                            ) {
                                                                                                                                this.analysisOvertimeListRender(
                                                                                                                                    null,
                                                                                                                                    [
                                                                                                                                        ...data.Data
                                                                                                                                    ]
                                                                                                                                );
                                                                                                                            }
                                                                                                                        }
                                                                                                                    } catch (error) {
                                                                                                                        DrawerServices.navigate(
                                                                                                                            'ErrorScreen',
                                                                                                                            {
                                                                                                                                ErrorDisplay: error
                                                                                                                            }
                                                                                                                        );
                                                                                                                    }
                                                                                                                }
                                                                                                            );
                                                                                                        }
                                                                                                    } catch (error) {
                                                                                                        DrawerServices.navigate(
                                                                                                            'ErrorScreen',
                                                                                                            {
                                                                                                                ErrorDisplay: error
                                                                                                            }
                                                                                                        );
                                                                                                    }
                                                                                                });
                                                                                            }
                                                                                        });
                                                                                    } else if (
                                                                                        data[0] == 'errorNotRoster'
                                                                                    ) {
                                                                                        ToasterSevice.showWarning(
                                                                                            'CanNotPlsCheckRosterOfEmpByDate'
                                                                                        );

                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;
                                                                                    } else if (
                                                                                        data[0] ==
                                                                                        'errorIsRegisterLeaveday'
                                                                                    ) {
                                                                                        ToasterSevice.showWarning(
                                                                                            'WarningNotRegisterOT'
                                                                                        );

                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;
                                                                                    } else if (
                                                                                        data[0] ==
                                                                                        'WarningDateQuitInRosterTimes'
                                                                                    ) {
                                                                                        ToasterSevice.showWarning(
                                                                                            data[1],
                                                                                            'warning',
                                                                                            false
                                                                                        );

                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;
                                                                                    } else if (
                                                                                        data[0] ==
                                                                                        'errorRegisterHoursInPast'
                                                                                    ) {
                                                                                        ToasterSevice.showWarning(
                                                                                            'WarningRegisterOTInPastMoreThanConfig'
                                                                                        );

                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;
                                                                                    } else if (
                                                                                        data == 'FieldNotAllowNull'
                                                                                    ) {
                                                                                        ToasterSevice.showWarning(
                                                                                            'HRM_Attendance_Leaveday_ProfileID'
                                                                                        );

                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;
                                                                                    } else {
                                                                                        this.IsFirstEvenDataBound = true;

                                                                                        VnrLoadingSevices.show();
                                                                                        this.analysisOvertimeList({
                                                                                            ...cloneData2OfData2.params
                                                                                        }).then(data => {
                                                                                            VnrLoadingSevices.hide();
                                                                                            try {
                                                                                                if (data) {
                                                                                                    let paramsCloneData2OfData2 = {
                                                                                                        ...cloneData2OfData2.params
                                                                                                    };

                                                                                                    if (
                                                                                                        data == 'Error'
                                                                                                    ) {
                                                                                                        ToasterSevice.showWarning(
                                                                                                            'HRM_Message_DataInvalidRegisterLessThanConfig'
                                                                                                        );

                                                                                                        //xử lý lại event Save
                                                                                                        this.isProcessingAnalysic = false;
                                                                                                        return;
                                                                                                    }

                                                                                                    if (
                                                                                                        data ==
                                                                                                        'WarningRegistHoursInPrenancyHours'
                                                                                                    ) {
                                                                                                        ToasterSevice.showWarning(
                                                                                                            'WarningRegistHoursInPrenancyHours'
                                                                                                        );

                                                                                                        //xử lý lại event Save
                                                                                                        this.isProcessingAnalysic = false;
                                                                                                        return;
                                                                                                    }

                                                                                                    if (
                                                                                                        typeof data ==
                                                                                                            'object' &&
                                                                                                        data[0] ==
                                                                                                            'errorProfileNotShift'
                                                                                                    ) {
                                                                                                        AlertSevice.alert(
                                                                                                            {
                                                                                                                title: translate(
                                                                                                                    'Hrm_Notification'
                                                                                                                ),
                                                                                                                iconType:
                                                                                                                    EnumIcon.E_INFO,
                                                                                                                message:
                                                                                                                    data[1] +
                                                                                                                    ' ' +
                                                                                                                    translate(
                                                                                                                        'PlsCheckRosterOfEmpByDate'
                                                                                                                    ) +
                                                                                                                    '. ' +
                                                                                                                    translate(
                                                                                                                        'HRM_Message_AreYouContinute'
                                                                                                                    ) +
                                                                                                                    '?',
                                                                                                                onCancel: () => {
                                                                                                                    //xử lý lại event Save
                                                                                                                    this.isProcessingAnalysic = false;
                                                                                                                },
                                                                                                                onConfirm: () => {
                                                                                                                    let params = {
                                                                                                                        ...paramsCloneData2OfData2,
                                                                                                                        strCodeEmpInvalidData:
                                                                                                                            data[1]
                                                                                                                    };

                                                                                                                    VnrLoadingSevices.show();
                                                                                                                    this.analysisOvertimeList(
                                                                                                                        params
                                                                                                                    ).then(
                                                                                                                        data1 => {
                                                                                                                            VnrLoadingSevices.hide();
                                                                                                                            if (
                                                                                                                                data1 ==
                                                                                                                                'Error'
                                                                                                                            ) {
                                                                                                                                //xử lý lại event Save
                                                                                                                                this.isProcessingAnalysic = false;

                                                                                                                                ToasterSevice.showWarning(
                                                                                                                                    'HRM_Message_DataInvalidRegisterLessThanConfig'
                                                                                                                                );
                                                                                                                                return;
                                                                                                                            }

                                                                                                                            if (
                                                                                                                                data1 ==
                                                                                                                                'WarningRegistHoursInPrenancyHours'
                                                                                                                            ) {
                                                                                                                                //xử lý lại event Save
                                                                                                                                this.isProcessingAnalysic = false;

                                                                                                                                ToasterSevice.showWarning(
                                                                                                                                    'WarningRegistHoursInPrenancyHours'
                                                                                                                                );
                                                                                                                                return;
                                                                                                                            }

                                                                                                                            if (
                                                                                                                                data1 &&
                                                                                                                                Array.isArray(
                                                                                                                                    data1.Data
                                                                                                                                )
                                                                                                                            ) {
                                                                                                                                this.analysisOvertimeListRender(
                                                                                                                                    null,
                                                                                                                                    [
                                                                                                                                        ...data1.Data
                                                                                                                                    ]
                                                                                                                                );
                                                                                                                            }
                                                                                                                        }
                                                                                                                    );
                                                                                                                }
                                                                                                            }
                                                                                                        );
                                                                                                    }

                                                                                                    if (
                                                                                                        data &&
                                                                                                        Array.isArray(
                                                                                                            data.Data
                                                                                                        )
                                                                                                    ) {
                                                                                                        this.analysisOvertimeListRender(
                                                                                                            null,
                                                                                                            [
                                                                                                                ...data.Data
                                                                                                            ]
                                                                                                        );
                                                                                                    }
                                                                                                }
                                                                                            } catch (error) {
                                                                                                DrawerServices.navigate(
                                                                                                    'ErrorScreen',
                                                                                                    {
                                                                                                        ErrorDisplay: error
                                                                                                    }
                                                                                                );
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                } catch (error) {
                                                                                    DrawerServices.navigate(
                                                                                        'ErrorScreen',
                                                                                        { ErrorDisplay: error }
                                                                                    );
                                                                                }
                                                                            }
                                                                        );
                                                                    }
                                                                });
                                                            } else if (data[0] == 'errorIsRegisterLeaveday') {
                                                                ToasterSevice.showWarning('WarningNotRegisterOT');

                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            } else if (data[0] == 'WarningDateQuitInRosterTimes') {
                                                                ToasterSevice.showWarning(data[1], 'warning', false);

                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            } else if (data[0] == 'errorRegisterHoursInPast') {
                                                                ToasterSevice.showWarning(
                                                                    'WarningRegisterOTInPastMoreThanConfig'
                                                                );

                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            } else if (data == 'FieldNotAllowNull') {
                                                                ToasterSevice.showWarning(
                                                                    'HRM_Attendance_Leaveday_ProfileID'
                                                                );

                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            } else {
                                                                this.IsFirstEvenDataBound = true;

                                                                VnrLoadingSevices.show();
                                                                this.analysisOvertimeList({
                                                                    ...cloneData1.params
                                                                }).then(data => {
                                                                    VnrLoadingSevices.hide();
                                                                    try {
                                                                        if (data) {
                                                                            let paramsCloneData1 = {
                                                                                ...cloneData1.params
                                                                            };

                                                                            if (data == 'Error') {
                                                                                //xử lý lại event Save
                                                                                this.isProcessingAnalysic = false;

                                                                                ToasterSevice.showWarning(
                                                                                    'HRM_Message_DataInvalidRegisterLessThanConfig'
                                                                                );
                                                                                return;
                                                                            }

                                                                            if (
                                                                                data ==
                                                                                'WarningRegistHoursInPrenancyHours'
                                                                            ) {
                                                                                //xử lý lại event Save
                                                                                this.isProcessingAnalysic = false;

                                                                                ToasterSevice.showWarning(
                                                                                    'WarningRegistHoursInPrenancyHours'
                                                                                );
                                                                                return;
                                                                            }

                                                                            if (
                                                                                typeof data == 'object' &&
                                                                                data[0] == 'errorProfileNotShift'
                                                                            ) {
                                                                                AlertSevice.alert({
                                                                                    title: translate(
                                                                                        'Hrm_Notification'
                                                                                    ),
                                                                                    iconType: EnumIcon.E_INFO,
                                                                                    message:
                                                                                        data[1] +
                                                                                        ' ' +
                                                                                        translate(
                                                                                            'PlsCheckRosterOfEmpByDate'
                                                                                        ) +
                                                                                        '. ' +
                                                                                        translate(
                                                                                            'HRM_Message_AreYouContinute'
                                                                                        ) +
                                                                                        '?',
                                                                                    onCancel: () => {
                                                                                        //xử lý lại event Save
                                                                                        this.isProcessingAnalysic = false;
                                                                                    },
                                                                                    onConfirm: () => {
                                                                                        let params = {
                                                                                            ...paramsCloneData1,
                                                                                            strCodeEmpInvalidData:
                                                                                                data[1]
                                                                                        };

                                                                                        VnrLoadingSevices.show();
                                                                                        this.analysisOvertimeList(
                                                                                            params
                                                                                        ).then(data1 => {
                                                                                            VnrLoadingSevices.hide();
                                                                                            if (data1 == 'Error') {
                                                                                                //xử lý lại event Save
                                                                                                this.isProcessingAnalysic = false;

                                                                                                ToasterSevice.showWarning(
                                                                                                    'HRM_Message_DataInvalidRegisterLessThanConfig'
                                                                                                );
                                                                                                return;
                                                                                            }

                                                                                            if (
                                                                                                data1 ==
                                                                                                'WarningRegistHoursInPrenancyHours'
                                                                                            ) {
                                                                                                //xử lý lại event Save
                                                                                                this.isProcessingAnalysic = false;

                                                                                                ToasterSevice.showWarning(
                                                                                                    'WarningRegistHoursInPrenancyHours'
                                                                                                );
                                                                                                return;
                                                                                            }

                                                                                            if (
                                                                                                data1 &&
                                                                                                Array.isArray(
                                                                                                    data1.Data
                                                                                                )
                                                                                            ) {
                                                                                                this.analysisOvertimeListRender(
                                                                                                    null,
                                                                                                    [...data1.Data]
                                                                                                );
                                                                                            }
                                                                                        });
                                                                                    }
                                                                                });
                                                                            } else if (
                                                                                typeof data == 'object' &&
                                                                                data.success == 'ErrorUserApprove'
                                                                            ) {
                                                                                ToasterSevice.showWarning(data.mess);
                                                                                this.analysisOvertimeListRender(
                                                                                    null,
                                                                                    []
                                                                                );
                                                                            } else if (
                                                                                typeof data == 'object' &&
                                                                                data.success ==
                                                                                    'errorRegisterHoursInPast'
                                                                            ) {
                                                                                ToasterSevice.showWarning(data.mess);
                                                                                this.analysisOvertimeListRender(
                                                                                    null,
                                                                                    []
                                                                                );
                                                                            }

                                                                            if (data && Array.isArray(data.Data)) {
                                                                                this.analysisOvertimeListRender(null, [
                                                                                    ...data.Data
                                                                                ]);
                                                                            }
                                                                        }
                                                                    } catch (error) {
                                                                        DrawerServices.navigate('ErrorScreen', {
                                                                            ErrorDisplay: error
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        } catch (error) {
                                                            DrawerServices.navigate('ErrorScreen', {
                                                                ErrorDisplay: error
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        } else {
                                            //xử lý lại event Save
                                            this.isProcessingAnalysic = false;

                                            ToasterSevice.showWarning(data[1], 'warning', false);
                                        }
                                    } else if (data[0] == 'errorRegisterHours') {
                                        if (data.length == 2 && data[1] != '') {
                                            AlertSevice.alert({
                                                title: translate('Hrm_Notification'),
                                                iconType: EnumIcon.E_INFO,
                                                message:
                                                    translate('WaringOvertimeBy') +
                                                    ' ' +
                                                    data[1] +
                                                    ' ' +
                                                    translate('IsLimited'),
                                                onCancel: () => {
                                                    //xử lý lại event Save
                                                    this.isProcessingAnalysic = false;
                                                },
                                                onConfirm: () => {
                                                    this.IsFirstEvenDataBound = true;

                                                    VnrLoadingSevices.show();
                                                    this.analysisOvertimeList({
                                                        ...cloneData2.params
                                                    }).then(data => {
                                                        VnrLoadingSevices.hide();
                                                        try {
                                                            if (data && Array.isArray(data.Data)) {
                                                                this.analysisOvertimeListRender(null, [...data.Data]);
                                                            }
                                                        } catch (error) {
                                                            DrawerServices.navigate('ErrorScreen', {
                                                                ErrorDisplay: error
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        } else if (data.length >= 3 && data[1] != '') {
                                            let mess =
                                                translate('WaringOvertimeBy') +
                                                ' ' +
                                                data[1] +
                                                ' ' +
                                                translate('IsLimited') +
                                                data[2];

                                            AlertSevice.alert({
                                                title: translate('Hrm_Notification'),
                                                iconType: EnumIcon.E_INFO,
                                                message: mess,
                                                onCancel: () => {
                                                    //xử lý lại event Save
                                                    this.isProcessingAnalysic = false;
                                                },
                                                onConfirm: () => {
                                                    this.IsFirstEvenDataBound = true;

                                                    VnrLoadingSevices.show();
                                                    this.analysisOvertimeList({
                                                        ...cloneData2.params
                                                    }).then(data => {
                                                        VnrLoadingSevices.hide();
                                                        try {
                                                            if (data && Array.isArray(data.Data)) {
                                                                this.analysisOvertimeListRender(null, [...data.Data]);
                                                            }
                                                        } catch (error) {
                                                            DrawerServices.navigate('ErrorScreen', {
                                                                ErrorDisplay: error
                                                            });
                                                        }
                                                    });
                                                }
                                            });
                                        } else {
                                            ToasterSevice.showWarning('HoursOversubscribedHoursRegistrationRules');

                                            //xử lý lại event Save
                                            this.isProcessingAnalysic = false;
                                        }
                                    } else if (data[0] == 'errorPregnancyPro') {
                                        var messageTextPreg = translate('Employee') + data[1];
                                        AlertSevice.alert({
                                            title: translate('Hrm_Notification'),
                                            iconType: EnumIcon.E_INFO,
                                            message: messageTextPreg,
                                            onCancel: () => {},
                                            onConfirm: () => {},
                                            showConfirm: false
                                        });

                                        //xử lý lại event Save
                                        this.isProcessingAnalysic = false;
                                    } else if (data[0] == 'errorPregnancyOrg') {
                                        let messageText = translate('Employee') + data[1];
                                        AlertSevice.alert({
                                            title: translate('Hrm_Notification'),
                                            iconType: EnumIcon.E_INFO,
                                            message: messageText,
                                            onCancel: () => {
                                                //xử lý lại event Save
                                                this.isProcessingAnalysic = false;
                                            },
                                            onConfirm: () => {
                                                let data2 = {
                                                    models: [...updatedRecords],
                                                    params: {
                                                        ...cloneData2.params,
                                                        IsConfirm: true,
                                                        IsConfirmPreg: true
                                                    }
                                                };

                                                VnrLoadingSevices.show();
                                                this.analysisOvertimeListValidate(data2).then(data => {
                                                    VnrLoadingSevices.hide();
                                                    try {
                                                        if (data[0] && typeof data[0] == 'string') {
                                                            //flagValidate = false;
                                                            //Loading(false);

                                                            //xử lý lại event Save
                                                            this.isProcessingAnalysic = false;
                                                        }
                                                        if (data[0] == 'error') {
                                                            //ToasterSevice.showWarning(data[1], 'warning', false);
                                                            //Loading(false);
                                                            ToasterSevice.showWarning(data[1]);

                                                            //xử lý lại event Save
                                                            this.isProcessingAnalysic = false;
                                                        } else if (data[0] == 'errorRegisterHours') {
                                                            if (data.length == 2 && data[1] != '') {
                                                                AlertSevice.alert({
                                                                    title: translate('Hrm_Notification'),
                                                                    iconType: EnumIcon.E_INFO,
                                                                    message:
                                                                        translate('WaringOvertimeBy') +
                                                                        ' ' +
                                                                        data[1] +
                                                                        ' ' +
                                                                        translate('IsLimited'),
                                                                    onCancel: () => {
                                                                        //xử lý lại event Save
                                                                        this.isProcessingAnalysic = false;
                                                                    },
                                                                    onConfirm: () => {
                                                                        this.IsFirstEvenDataBound = true;

                                                                        VnrLoadingSevices.show();
                                                                        this.analysisOvertimeList({
                                                                            ...data2.params
                                                                        }).then(data => {
                                                                            VnrLoadingSevices.hide();
                                                                            try {
                                                                                if (data && data.Data) {
                                                                                    this.analysisOvertimeListRender(
                                                                                        null,
                                                                                        [...data.Data]
                                                                                    );
                                                                                }
                                                                            } catch (error) {
                                                                                DrawerServices.navigate('ErrorScreen', {
                                                                                    ErrorDisplay: error
                                                                                });
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            } else if (data.length >= 3 && data[1] != '') {
                                                                let mess =
                                                                    translate('WaringOvertimeBy') +
                                                                    ' ' +
                                                                    data[1] +
                                                                    ' ' +
                                                                    translate('IsLimited') +
                                                                    data[2];

                                                                AlertSevice.alert({
                                                                    title: translate('Hrm_Notification'),
                                                                    iconType: EnumIcon.E_INFO,
                                                                    message: mess,
                                                                    onCancel: () => {
                                                                        //xử lý lại event Save
                                                                        this.isProcessingAnalysic = false;
                                                                    },
                                                                    onConfirm: () => {
                                                                        this.IsFirstEvenDataBound = true;

                                                                        VnrLoadingSevices.show();
                                                                        this.analysisOvertimeList({
                                                                            ...data2.params
                                                                        }).then(data => {
                                                                            VnrLoadingSevices.hide();
                                                                            try {
                                                                                if (data && data.Data) {
                                                                                    this.analysisOvertimeListRender(
                                                                                        null,
                                                                                        [...data.Data]
                                                                                    );
                                                                                }
                                                                            } catch (error) {
                                                                                DrawerServices.navigate('ErrorScreen', {
                                                                                    ErrorDisplay: error
                                                                                });
                                                                            }
                                                                        });
                                                                    }
                                                                });
                                                            } else {
                                                                ToasterSevice.showWarning(
                                                                    'HoursOversubscribedHoursRegistrationRules'
                                                                );

                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            }
                                                        } else if (data[0] == 'errorNotRoster') {
                                                            ToasterSevice.showWarning(
                                                                'CanNotPlsCheckRosterOfEmpByDate'
                                                            );

                                                            //xử lý lại event Save
                                                            this.isProcessingAnalysic = false;
                                                            //Loading(false);
                                                        } else if (data[0] == 'errorIsRegisterLeaveday') {
                                                            ToasterSevice.showWarning('WarningNotRegisterOT');

                                                            //xử lý lại event Save
                                                            this.isProcessingAnalysic = false;
                                                            //Loading(false);
                                                        } else if (data[0] == 'WarningDateQuitInRosterTimes') {
                                                            ToasterSevice.showWarning(data[1], 'warning', false);

                                                            //xử lý lại event Save
                                                            this.isProcessingAnalysic = false;
                                                            //Loading(false);
                                                        } else if (data[0] == 'errorRegisterHoursInPast') {
                                                            ToasterSevice.showWarning(
                                                                'WarningRegisterOTInPastMoreThanConfig'
                                                            );

                                                            //xử lý lại event Save
                                                            this.isProcessingAnalysic = false;
                                                            //Loading(false);
                                                        } else if (data == 'FieldNotAllowNull') {
                                                            ToasterSevice.showWarning(
                                                                'HRM_Attendance_Leaveday_ProfileID'
                                                            );

                                                            //xử lý lại event Save
                                                            this.isProcessingAnalysic = false;
                                                            //Loading(false);
                                                        } else {
                                                            this.IsFirstEvenDataBound = true;

                                                            VnrLoadingSevices.show();
                                                            this.analysisOvertimeListValidate(data2).then(data => {
                                                                VnrLoadingSevices.hide();
                                                                if (data) {
                                                                    if (data == 'Error') {
                                                                        ToasterSevice.showWarning(
                                                                            'HRM_Message_DataInvalid'
                                                                        );
                                                                        //Loading(false);

                                                                        //xử lý lại event Save
                                                                        this.isProcessingAnalysic = false;
                                                                        return;
                                                                    }

                                                                    if (data == 'WarningRegistHoursInPrenancyHours') {
                                                                        ToasterSevice.showWarning(
                                                                            'WarningRegistHoursInPrenancyHours'
                                                                        );

                                                                        //xử lý lại event Save
                                                                        this.isProcessingAnalysic = false;
                                                                        //Loading(false);
                                                                        return;
                                                                    } else if (data[0] == 'errorRegisterHoursOrg') {
                                                                        // listOvertimeLimit = data[1];
                                                                        // if (!$(frm + ' #Grid_OvertimeLimit').data('kendoGrid')) {

                                                                        //     $('#loadModal2').load('/New_Att_Overtime/New_OvertimeLimit', function (response1, status, xhr) {
                                                                        //         if (status == 'success') {
                                                                        //             binding_OvertimeLimit(listOvertimeLimit)
                                                                        //         }
                                                                        //         else {
                                                                        //             //Loading(false);
                                                                        //         }
                                                                        //     });

                                                                        // }

                                                                        let nextState = {
                                                                            modalLimit: {
                                                                                isModalVisible: true,
                                                                                data: [...data[1]]
                                                                            }
                                                                        };

                                                                        this.setState(nextState, () => {
                                                                            //xử lý lại event Save
                                                                            this.isProcessingAnalysic = false;
                                                                        });
                                                                    }
                                                                    if (
                                                                        typeof data == 'object' &&
                                                                        data[0] == 'errorProfileNotShift'
                                                                    ) {
                                                                        //Loading(false);
                                                                        AlertSevice.alert({
                                                                            title: translate('Hrm_Notification'),
                                                                            iconType: EnumIcon.E_INFO,
                                                                            message:
                                                                                data[1] +
                                                                                ' ' +
                                                                                translate('PlsCheckRosterOfEmpByDate') +
                                                                                '. ' +
                                                                                translate(
                                                                                    'HRM_Message_AreYouContinute'
                                                                                ) +
                                                                                '?',
                                                                            onCancel: () => {
                                                                                //xử lý lại event Save
                                                                                this.isProcessingAnalysic = false;
                                                                            },
                                                                            onConfirm: () => {
                                                                                let params = {
                                                                                    ...data2.params,
                                                                                    strCodeEmpInvalidData: data[1]
                                                                                };

                                                                                VnrLoadingSevices.show();
                                                                                this.analysisOvertimeList(params).then(
                                                                                    data1 => {
                                                                                        VnrLoadingSevices.hide();
                                                                                        if (data1 == 'Error') {
                                                                                            ToasterSevice.showWarning(
                                                                                                'HRM_Message_DataInvalid'
                                                                                            );

                                                                                            //xử lý lại event Save
                                                                                            this.isProcessingAnalysic = false;

                                                                                            return;
                                                                                        }

                                                                                        if (
                                                                                            data1 ==
                                                                                            'WarningRegistHoursInPrenancyHours'
                                                                                        ) {
                                                                                            //xử lý lại event Save
                                                                                            this.isProcessingAnalysic = false;

                                                                                            ToasterSevice.showWarning(
                                                                                                'WarningRegistHoursInPrenancyHours'
                                                                                            );
                                                                                            return;
                                                                                        }

                                                                                        this.analysisOvertimeListRender(
                                                                                            null,
                                                                                            [...data1.Data]
                                                                                        );
                                                                                    }
                                                                                );
                                                                            }
                                                                        });
                                                                    }

                                                                    if (data.Data) {
                                                                        this.analysisOvertimeListRender(null, [
                                                                            ...data.Data
                                                                        ]);
                                                                    }
                                                                }
                                                            });
                                                        }
                                                    } catch (error) {
                                                        DrawerServices.navigate('ErrorScreen', {
                                                            ErrorDisplay: error
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    } else if (data[0] == 'errorNotRoster') {
                                        ToasterSevice.showWarning('CanNotPlsCheckRosterOfEmpByDate');

                                        //xử lý lại event Save
                                        this.isProcessingAnalysic = false;
                                    } else if (data[0] == 'errorIsRegisterLeaveday') {
                                        ToasterSevice.showWarning('WarningNotRegisterOT');

                                        //xử lý lại event Save
                                        this.isProcessingAnalysic = false;
                                    } else if (data[0] == 'WarningDateQuitInRosterTimes') {
                                        ToasterSevice.showWarning(data[1], 'warning', false);

                                        //xử lý lại event Save
                                        this.isProcessingAnalysic = false;
                                    } else if (data[0] == 'errorRegisterHoursInPast') {
                                        ToasterSevice.showWarning('WarningRegisterOTInPastMoreThanConfig');

                                        //xử lý lại event Save
                                        this.isProcessingAnalysic = false;
                                    } else if (data == 'FieldNotAllowNull') {
                                        ToasterSevice.showWarning('HRM_Attendance_Leaveday_ProfileID');

                                        //xử lý lại event Save
                                        this.isProcessingAnalysic = false;
                                    } else {
                                        this.IsFirstEvenDataBound = true;

                                        VnrLoadingSevices.show();
                                        this.analysisOvertimeList({ ...data2.params }).then(data => {
                                            VnrLoadingSevices.hide();
                                            if (data) {
                                                //check khung giờ Phổ Đình
                                                if (data.IsConfirmWorkingByFrame) {
                                                    //check có dữ liệu bị BLOCK status
                                                    let listInvalidFame = data.EmployeeWorkingResults
                                                            ? data.EmployeeWorkingResults
                                                            : [],
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
                                                            (result[currentValue[key]] =
                                                                result[currentValue[key]] || []).push(currentValue);

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
                                                            let paramLimitTimeSlot = {
                                                                ...data2.params,
                                                                IsConfirmWorkingByFrame: true
                                                            };

                                                            this.analysisOvertimeListRender(paramLimitTimeSlot);
                                                        },
                                                        onClose: () => {},
                                                        dataSource
                                                    });

                                                    //xử lý lại event Save
                                                    this.isProcessingAnalysic = false;
                                                } else {
                                                    if (data == 'Error') {
                                                        ToasterSevice.showWarning('HRM_Message_DataInvalid');

                                                        //xử lý lại event Save
                                                        this.isProcessingAnalysic = false;

                                                        return;
                                                    }

                                                    if (data == 'WarningRegistHoursInPrenancyHours') {
                                                        ToasterSevice.showWarning('WarningRegistHoursInPrenancyHours');

                                                        //xử lý lại event Save
                                                        this.isProcessingAnalysic = false;

                                                        return;
                                                    }

                                                    if (typeof data == 'object' && data[0] == 'errorProfileNotShift') {
                                                        AlertSevice.alert({
                                                            title: translate('Hrm_Notification'),
                                                            iconType: EnumIcon.E_INFO,
                                                            message:
                                                                data[1] +
                                                                ' ' +
                                                                translate('PlsCheckRosterOfEmpByDate') +
                                                                '. ' +
                                                                translate('HRM_Message_AreYouContinute') +
                                                                '?',
                                                            onCancel: () => {
                                                                //xử lý lại event Save
                                                                this.isProcessingAnalysic = false;
                                                            },
                                                            onConfirm: () => {
                                                                let params = {
                                                                    ...data2.params,
                                                                    strCodeEmpInvalidData: data[1]
                                                                };

                                                                VnrLoadingSevices.show();
                                                                this.analysisOvertimeList(params).then(data1 => {
                                                                    VnrLoadingSevices.hide();
                                                                    try {
                                                                        if (data1 == 'Error') {
                                                                            ToasterSevice.showWarning(
                                                                                'HRM_Message_DataInvalid'
                                                                            );

                                                                            //xử lý lại event Save
                                                                            this.isProcessingAnalysic = false;

                                                                            return;
                                                                        }

                                                                        if (
                                                                            data1 == 'WarningRegistHoursInPrenancyHours'
                                                                        ) {
                                                                            ToasterSevice.showWarning(
                                                                                'WarningRegistHoursInPrenancyHours'
                                                                            );

                                                                            //xử lý lại event Save
                                                                            this.isProcessingAnalysic = false;

                                                                            return;
                                                                        }

                                                                        this.analysisOvertimeListRender(null, [
                                                                            ...data1.Data
                                                                        ]);
                                                                    } catch (error) {
                                                                        DrawerServices.navigate('ErrorScreen', {
                                                                            ErrorDisplay: error
                                                                        });
                                                                    }
                                                                });
                                                            }
                                                        });
                                                    } else if (
                                                        typeof data == 'object' &&
                                                        data.success == 'ErrorUserApprove'
                                                    ) {
                                                        ToasterSevice.showWarning(data.mess);

                                                        //xử lý lại event Save
                                                        this.isProcessingAnalysic = false;
                                                    } else if (
                                                        typeof data == 'object' &&
                                                        data.success == 'errorRegisterHoursInPast'
                                                    ) {
                                                        ToasterSevice.showWarning(data.mess);

                                                        //xử lý lại event Save
                                                        this.isProcessingAnalysic = false;
                                                    }

                                                    if (data.Data) {
                                                        this.analysisOvertimeListRender(null, [...data.Data]);
                                                    }
                                                }
                                            }
                                        });
                                    }
                                } catch (error) {
                                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                                }
                            });
                        }
                    });
                } else if (data[0] == 'errorIsRegisterLeaveday') {
                    ToasterSevice.showWarning('WarningNotRegisterOT', 5000);

                    //xử lý lại event Save
                    this.isProcessingAnalysic = false;
                } else if (data[0] == 'WarningDateQuitInRosterTimes') {
                    ToasterSevice.showWarning(data[1], 5000);

                    //xử lý lại event Save
                    this.isProcessingAnalysic = false;
                } else if (data[0] == 'errorRegisterHoursInPast') {
                    ToasterSevice.showWarning('WarningRegisterOTInPastMoreThanConfig', 5000);

                    //xử lý lại event Save
                    this.isProcessingAnalysic = false;
                } else if (data[0] == 'errorNotAllowOvertimeByDate') {
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        iconType: EnumIcon.E_INFO,
                        message: translate('WaringNotAllowOvertime') + data[1].Value,
                        onCancel: () => {},
                        onConfirm: () => {
                            // $(frm + ' #WorkDate').val('');
                            // if ($(frm + ' #WorkDateTo').length > 0)
                            //     $(frm + ' #WorkDateTo').val('');
                        }
                    });

                    //xử lý lại event Save
                    this.isProcessingAnalysic = false;
                } else if (data.indexOf('FieldNotAllowNull') >= 0) {
                    ToasterSevice.showWarning('HRM_ProfileOrStructureNotNull', 5000);

                    //xử lý lại event Save
                    this.isProcessingAnalysic = false;
                } else if (data[0] == 'ErrorValidateWorkingBlock') {
                    ToasterSevice.showWarning(data.mess, 5000);

                    //xử lý lại event Save
                    this.isProcessingAnalysic = false;
                    return;
                } else if (data[0] == 'ErrorValidateWorkingWarning') {
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        iconType: EnumIcon.E_INFO,
                        message: data.mess,
                        onCancel: () => {
                            //xử lý lại event Save
                            this.isProcessingAnalysic = false;
                        },
                        onConfirm: () => {
                            let params = {
                                ...cloneParams,
                                strCodeEmpInvalidData: data[1],
                                IsConfirmWorkingByFrame: true
                            };

                            VnrLoadingSevices.show();
                            this.analysisOvertimeList(params).then(data1 => {
                                VnrLoadingSevices.hide();
                                if (data1 && Array.isArray(data1.Data)) {
                                    this.analysisOvertimeListRender(null, [...data1.Data]);
                                }
                            });
                        }
                    });
                } else if (data[0] === 'errorWarningConfigIsApproveDataLocked') {
                    ToasterSevice.showWarning('WarningDataIsLocked', 5000);

                    //xử lý lại event Save
                    this.isProcessingAnalysic = false;
                    return;
                } else {
                    this.IsFirstEvenDataBound = true;
                    VnrLoadingSevices.show();

                    this.analysisOvertimeList({ ...cloneParams }).then(data => {
                        VnrLoadingSevices.hide();
                        try {
                            if (data) {
                                if (data.IsConfirmWorkingByFrame) {
                                    //check có dữ liệu bị BLOCK status
                                    let listInvalidFame = data.EmployeeWorkingResults
                                            ? data.EmployeeWorkingResults
                                            : [],
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
                                            (result[currentValue[key]] = result[currentValue[key]] || []).push(
                                                currentValue
                                            );

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
                                            let paramLimitTimeSlot = { ...cloneParams, IsConfirmWorkingByFrame: true };

                                            this.analysisOvertimeListRender(paramLimitTimeSlot);
                                        },
                                        onClose: () => {},
                                        dataSource
                                    });

                                    //xử lý lại event Save
                                    this.isProcessingAnalysic = false;
                                } else {
                                    if (data == 'Error') {
                                        ToasterSevice.showWarning('HRM_Message_DataInvalidRegisterLessThanConfig');

                                        //xử lý lại event Save
                                        this.isProcessingAnalysic = false;
                                        return;
                                    }

                                    if (data == 'WarningRegistHoursInPrenancyHours') {
                                        ToasterSevice.showWarning('WarningRegistHoursInPrenancyHours');

                                        //xử lý lại event Save
                                        this.isProcessingAnalysic = false;
                                        return;
                                    }

                                    //thông báo khi có 1 trong 3 người duyệt bị lõi => bị lỗi
                                    if (data.success == 'ErrorUserApprove') {
                                        ToasterSevice.showWarning(data.mess);

                                        //xử lý lại event Save
                                        this.isProcessingAnalysic = false;
                                        return;
                                    } else if (typeof data == 'object' && data.success == 'errorRegisterHoursInPast') {
                                        ToasterSevice.showWarning(data.mess);

                                        //xử lý lại event Save
                                        this.isProcessingAnalysic = false;
                                    }

                                    if (data.success == 'ErrorValidateWorkingBlock') {
                                        ToasterSevice.showWarning(data.mess);

                                        //xử lý lại event Save
                                        this.isProcessingAnalysic = false;
                                        return;
                                    }

                                    if (data.success == 'ErrorValidateWorkingWarning') {
                                        AlertSevice.alert({
                                            title: translate('Hrm_Notification'),
                                            iconType: EnumIcon.E_INFO,
                                            message: data.mess,
                                            onCancel: () => {
                                                //xử lý lại event Save
                                                this.isProcessingAnalysic = false;
                                            },
                                            onConfirm: () => {
                                                let params = {
                                                    ...cloneParams,
                                                    strCodeEmpInvalidData: data.msg,
                                                    IsConfirmWorkingByFrame: true
                                                };

                                                VnrLoadingSevices.show();
                                                this.analysisOvertimeList(params).then(data1 => {
                                                    VnrLoadingSevices.hide();
                                                    try {
                                                        if (data1 && Array.isArray(data1.Data)) {
                                                            this.analysisOvertimeListRender(null, [...data1.Data]);
                                                        }
                                                    } catch (error) {
                                                        DrawerServices.navigate('ErrorScreen', {
                                                            ErrorDisplay: error
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }

                                    if (typeof data == 'object' && data[0] == 'errorProfileNotShift') {
                                        AlertSevice.alert({
                                            title: translate('Hrm_Notification'),
                                            iconType: EnumIcon.E_INFO,
                                            message:
                                                data[1] +
                                                ' ' +
                                                translate('PlsCheckRosterOfEmpByDate') +
                                                '. ' +
                                                translate('HRM_Message_AreYouContinute') +
                                                '?',
                                            onCancel: () => {
                                                //xử lý lại event Save
                                                this.isProcessingAnalysic = false;
                                            },
                                            onConfirm: () => {
                                                let params = {
                                                    ...cloneParams,
                                                    strCodeEmpInvalidData: data[1]
                                                };
                                                VnrLoadingSevices.show();
                                                this.analysisOvertimeList(params).then(data1 => {
                                                    VnrLoadingSevices.hide();
                                                    try {
                                                        if (data1 == 'Error') {
                                                            ToasterSevice.showWarning(
                                                                'HRM_Message_DataInvalidRegisterLessThanConfig'
                                                            );

                                                            //xử lý lại event Save
                                                            this.isProcessingAnalysic = false;
                                                            return;
                                                        }

                                                        if (data1 == 'WarningRegistHoursInPrenancyHours') {
                                                            ToasterSevice.showWarning(
                                                                'WarningRegistHoursInPrenancyHours'
                                                            );

                                                            //xử lý lại event Save
                                                            this.isProcessingAnalysic = false;
                                                            return;
                                                        }

                                                        if (data1 && Array.isArray(data1.Data)) {
                                                            this.analysisOvertimeListRender(null, [...data1.Data]);
                                                        }
                                                    } catch (error) {
                                                        DrawerServices.navigate('ErrorScreen', {
                                                            ErrorDisplay: error
                                                        });
                                                    }
                                                });
                                            }
                                        });
                                    }

                                    if (data && Array.isArray(data.Data)) {
                                        this.analysisOvertimeListRender(null, [...data.Data]);
                                    }
                                }
                            }
                        } catch (error) {
                            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                        }
                    });
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };
    //#endregion

    //#region [lưu]
    saveAndCreate = navigation => {
        this.save(navigation, true, null);
    };

    saveAndSend = navigation => {
        this.save(navigation, null, true);
    };

    save = async (navigation, isCreate = null, isSend = null) => {
        if (this.isProcessingSave) {
            return;
        }

        this.isProcessingSave = true;

        const {
                ID,
                UserApprove,
                UserApprove3,
                UserApprove4,
                UserApprove2,
                UserComment1,
                UserComment2,
                UserComment3,
                UserComment4,
                WorkDate,
                divShiftID,
                divTempShiftID,
                removeDurationType,
                divOvertimeTypeID,
                checkShiftByProfile,
                eleRegisterHours,
                eleRegisterHoursConfig,
                MethodPayment,
                ReasonOT,
                Profile,
                Profiles,
                IsGetShiftByProfile,
                OrgStructures,
                isChoseProfile,
                ProfilesExclude,
                IsOverTimeBreak,
                IsNotCheckInOut,
                JobTypeID,
                divIsRegistedFood,
                currDataAnalysic
            } = this.state,
            { ShiftID } = divShiftID,
            { TempShiftID } = divTempShiftID,
            { DurationType } = removeDurationType,
            { OvertimeTypeID } = divOvertimeTypeID,
            { WorkDateIn, WorkDateOut } = checkShiftByProfile,
            { RegisterHoursConfig } = eleRegisterHoursConfig,
            { RegisterHours } = eleRegisterHours,
            { IsMealRegistration, IsCarRegistration } = divIsRegistedFood,
            { MenuID, Menu2ID, Food2ID, FoodID } = IsMealRegistration,
            { OvertimePlaceID } = IsCarRegistration;

        let params = {
            IsPortal: true,
            IsChecking: true,
            Status: 'E_SUBMIT',
            WorkDate: WorkDate.value ? moment(WorkDate.value).format('YYYY-MM-DD HH:mm:ss') : null,
            IsGetShiftByProfile: IsGetShiftByProfile.value,
            ShiftID: ShiftID.value ? ShiftID.value.ID : null,
            TempShiftID: TempShiftID.value ? TempShiftID.value.ID : null,
            DurationType: DurationType.value ? DurationType.value.Value : null,
            IsOverTimeBreak: IsOverTimeBreak.value,
            OvertimeTypeID: OvertimeTypeID.value ? OvertimeTypeID.value.ID : null,
            WorkDateIn: WorkDateIn.value ? moment(WorkDateIn.value).format('HH:mm') : null,
            WorkDateOut: WorkDateOut.value ? moment(WorkDateOut.value).format('HH:mm') : null,
            RegisterHours: RegisterHours.value,
            RegisterHoursConfig: RegisterHoursConfig.value ? RegisterHoursConfig.value.Value : null,
            IsNotCheckInOut: IsNotCheckInOut.value,
            MethodPayment: MethodPayment.value ? MethodPayment.value.Value : null,
            JobTypeID: JobTypeID.value ? JobTypeID.value.ID : null,
            ReasonOT: ReasonOT.value,
            UserApproveID: UserApprove.value ? UserApprove.value.ID : null,
            UserApproveID2: UserApprove2.value ? UserApprove2.value.ID : null,
            UserApproveID3: UserApprove3.value ? UserApprove3.value.ID : null,
            UserApproveID4: UserApprove4.value ? UserApprove4.value.ID : null,

            UserComment1View: UserComment1.value ? UserComment1.value.map(item => item.ProfileName).join() : null,
            UserComment2View: UserComment2.value ? UserComment2.value.map(item => item.ProfileName).join() : null,
            UserComment3View: UserComment3.value ? UserComment3.value.map(item => item.ProfileName).join() : null,
            UserComment4View: UserComment4.value ? UserComment4.value.map(item => item.ProfileName).join() : null,

            UserComment1: UserComment1.value ? UserComment1.value.map(item => item.ID).join() : null,
            UserComment2: UserComment2.value ? UserComment2.value.map(item => item.ID).join() : null,
            UserComment3: UserComment3.value ? UserComment3.value.map(item => item.ID).join() : null,
            UserComment4: UserComment4.value ? UserComment4.value.map(item => item.ID).join() : null,

            WorkDateTime: WorkDateIn.value ? moment(WorkDateIn.value).format('HH:mm') + ':00' : null,
            WorkHour: WorkDateIn.value ? moment(WorkDateIn.value).format('HH:mm') : null,
            MenuID: MenuID.value ? MenuID.value.ID : null,
            Menu2ID: Menu2ID.value ? Menu2ID.value.ID : null,
            Food2ID: Food2ID.value ? Food2ID.value.ID : null,
            FoodID: FoodID.value ? FoodID.value.ID : null,
            OvertimePlaceID: OvertimePlaceID.value ? OvertimePlaceID.value.ID : null
        };

        const { apiConfig } = dataVnrStorage,
            _uriPor = apiConfig ? apiConfig.uriPor : null;

        //cập nhật
        if (this.isModify) {
            let { record } = this.props.navigation.state.params;

            params = {
                ...params,
                ID,
                InTime: params['WorkDateIn'],
                OutTime: params['WorkDateOut'],
                UserSubmit: profileInfo[enumName.E_ProfileID],
                Host: _uriPor,
                ProfileID: Profile.ID,
                IsAddNewAndSendMail: isSend,
                Status: record.Status
            };

            VnrLoadingSevices.show();
            this.onSaveEdit({ ...params }).then(data => {
                VnrLoadingSevices.hide();

                //xử lý lại event Save
                this.isProcessingSave = false;

                try {
                    if (data.IsConfirmWorkingByFrame) {
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
                                let paramLimitTimeSlot = { ...params, IsConfirmWorkingByFrame: true };

                                this.onSaveEdit({ ...paramLimitTimeSlot }).then(data => {
                                    VnrLoadingSevices.hide();
                                    try {
                                        if (data && data.ActionStatus == 'Locked') {
                                            ToasterSevice.showWarning('DataIsLocked');
                                        } else if (data && data.ActionStatus != 'Success') {
                                            ToasterSevice.showWarning(data.ActionStatus);
                                        } else {
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
                                        }
                                    } catch (error) {
                                        DrawerServices.navigate('ErrorScreen', {
                                            ErrorDisplay: error
                                        });
                                    }
                                });
                            },
                            onClose: () => {},
                            dataSource
                        });

                        //xử lý lại event Save
                        this.isProcessingAnalysic = false;
                    } else if (data && data.ActionStatus == 'Locked') {
                        ToasterSevice.showWarning('DataIsLocked');
                    } else if (data && data.ActionStatus == 'ErrorValidateWorkingBlock') {
                        ToasterSevice.showWarning(data.ActionStatus);
                    } else if (data && data.ActionStatus == 'ErrorValidateWorkingWarning') {
                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            icon: `${Platform.OS === 'ios' ? 'ios-' : 'md-'}checkmark-circle`,
                            iconColor: Colors.danger,
                            message: data.ActionStatus1,
                            onCancel: () => {},
                            onConfirm: () => {
                                VnrLoadingSevices.show();
                                this.onSaveEdit({
                                    ...params,
                                    IsConfirmWorkingByFrame: true
                                }).then(data => {
                                    VnrLoadingSevices.hide();
                                    try {
                                        if (data && data.ActionStatus == 'Locked') {
                                            ToasterSevice.showWarning('DataIsLocked');
                                        } else if (data && data.ActionStatus != 'Success') {
                                            ToasterSevice.showWarning(data.ActionStatus);
                                        } else {
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
                                        }
                                    } catch (error) {
                                        DrawerServices.navigate('ErrorScreen', {
                                            ErrorDisplay: error
                                        });
                                    }
                                });
                            }
                        });
                    } else if (data && data.ActionStatus != 'Success') {
                        ToasterSevice.showWarning(data.ActionStatus);
                    } else {
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
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        }
        //đăng ký
        else {
            if (this.isRegisterHelp) {
                if (isChoseProfile) {
                    let _profiles = Profiles.value ? Profiles.value.map(item => item.ID).join() : '';

                    params = {
                        ...params,
                        strOrgStructureIDs: null,
                        ProfileIDsExclude: null,
                        ProfileIds: _profiles,
                        ProfileID: _profiles
                    };
                } else {
                    let _orgs = OrgStructures.value ? OrgStructures.value.map(item => item.OrderNumber).join() : '';

                    params = {
                        ...params,
                        ProfileIds: null,
                        strOrgStructureIDs: _orgs,
                        OrgStructureID: _orgs,
                        ProfileIDsExclude: ProfilesExclude.value
                            ? ProfilesExclude.value.map(item => item.ID).join()
                            : ''
                    };
                }
            } else {
                params = {
                    ...params,
                    ProfileID: Profile.ID
                };
            }

            let dataResut = false;

            if (!dataResut) {
                let data = {},
                    dataTemp = {},
                    currentData = [...currDataAnalysic];

                if (currentData.length <= 0) {
                    VnrLoadingSevices.show();
                    let result = await HttpService.Post('[URI_HR]//Att_GetData/GetConfig_AllowSplit');

                    VnrLoadingSevices.hide();
                    if (result && result.configMaxOT == false) {
                        dataResut = true;
                    } else {
                        dataTemp = { ...params };
                    }
                }

                if (!dataResut) {
                    let updatedRecords = [];

                    //get all record
                    for (let i = 0; i < currentData.length; i++) {
                        let obj = currentData[i];

                        if (obj['InTime'] && obj['InTime'].indexOf('/Date') >= 0)
                            obj['InTime'] = new Date(
                                parseInt(obj['InTime'].replace('/Date(', '').replace(')/', ''), 10)
                            ).toISOString();

                        if (obj['OutTime'] && obj['OutTime'].indexOf('/Date') >= 0)
                            obj['OutTime'] = new Date(
                                parseInt(obj['OutTime'].replace('/Date(', '').replace(')/', ''), 10)
                            ).toISOString();

                        if (obj['WorkDate'].indexOf('/Date') >= 0)
                            obj['WorkDate'] = new Date(
                                parseInt(obj['WorkDate'].replace('/Date(', '').replace(')/', ''), 10)
                            ).toISOString();

                        obj['UserSubmit'] = profileInfo[enumName.E_ProfileID];

                        obj['IsAddNewAndSendMail'] = isSend;

                        if (obj['WorkDateRoot'] != null && obj['WorkDateRoot'].indexOf('/Date') >= 0)
                            obj['WorkDateRoot'] = new Date(
                                parseInt(obj['WorkDateRoot'].replace('/Date(', '').replace(')/', ''), 10)
                            ).toISOString();

                        obj['AnalyseHour'] = null;

                        obj['UserRegister'] = profileInfo['userid'];
                        obj['Host'] = _uriPor;
                        obj['IsPortal'] = true;

                        updatedRecords.push(obj);
                    }

                    if (Object.keys(dataTemp).length === 0) {
                        data = {
                            models: [...updatedRecords],
                            params: {},
                            userID: profileInfo['userid']
                        };
                    } else {
                        data = {
                            models: [],
                            params: { ...dataTemp },
                            userID: profileInfo['userid']
                        };
                    }

                    //check duplicate
                    VnrLoadingSevices.show();
                    HttpService.Post('[URI_HR]//Att_GetData/AnalysisOvertime_Duplicate', { ...data }).then(
                        dataResult1 => {
                            VnrLoadingSevices.hide();

                            try {
                                if (dataResult1.ActionStatus == 'Error') {
                                    ToasterSevice.showWarning('DataIncreasedCaAlreadyExist');
                                } else {
                                    //ẩn modal kiểm tra hợp lệ
                                    this.setState({ isVisibleAnalysic: false });

                                    VnrLoadingSevices.show();
                                    this.onSaveAdd(data.models).then(dataResult2 => {
                                        VnrLoadingSevices.hide();

                                        //xử lý lại event Save
                                        this.isProcessingSave = false;

                                        try {
                                            //check khung giờ Phổ Đình
                                            if (dataResult2.IsConfirmWorkingByFrame) {
                                                //check có dữ liệu bị BLOCK status
                                                let listInvalidFame = dataResult2.EmployeeWorkingResults
                                                        ? dataResult2.EmployeeWorkingResults
                                                        : [],
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
                                                        (result[currentValue[key]] =
                                                            result[currentValue[key]] || []).push(currentValue);

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
                                                        let paramLimitTimeSlot = { ...data };

                                                        if (paramLimitTimeSlot.models && paramLimitTimeSlot.models[0]) {
                                                            paramLimitTimeSlot.models[0].IsConfirmWorkingByFrame = true;
                                                        }

                                                        this.onSaveAdd(paramLimitTimeSlot.models).then(data => {
                                                            VnrLoadingSevices.hide();
                                                            try {
                                                                if (data && data.ActionStatus == 'Locked') {
                                                                    ToasterSevice.showWarning('DataIsLocked');

                                                                    //show modal kiểm tra hợp lệ
                                                                    this.setState({ isVisibleAnalysic: true });
                                                                } else if (data && data.ActionStatus != 'Success') {
                                                                    ToasterSevice.showWarning(data.ActionStatus);

                                                                    //show modal kiểm tra hợp lệ
                                                                    this.setState({ isVisibleAnalysic: true });
                                                                } else {
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
                                                                }
                                                            } catch (error) {
                                                                DrawerServices.navigate('ErrorScreen', {
                                                                    ErrorDisplay: error
                                                                });
                                                            }
                                                        });
                                                    },
                                                    onClose: () => {},
                                                    dataSource
                                                });

                                                //xử lý lại event Save
                                                this.isProcessingAnalysic = false;
                                            }

                                            if (dataResult2.ActionStatus == 'Success') {
                                                ToasterSevice.showSuccess('InsertSuccess');

                                                if (isCreate) {
                                                    this.refreshView();
                                                } else {
                                                    navigation.goBack();
                                                }

                                                const { reload } = navigation.state.params;
                                                if (typeof reload == 'function') {
                                                    reload();
                                                }
                                            } else if (
                                                dataResult2 &&
                                                dataResult2.ActionStatus == 'ErrorValidateWorkingBlock'
                                            ) {
                                                ToasterSevice.showWarning(dataResult2.ActionStatus1);

                                                //show modal kiểm tra hợp lệ
                                                this.setState({ isVisibleAnalysic: true });
                                            } else if (
                                                dataResult2 &&
                                                dataResult2.ActionStatus == 'ErrorValidateWorkingWarning'
                                            ) {
                                                AlertSevice.alert({
                                                    title: translate('Hrm_Notification'),
                                                    iconType: EnumIcon.E_INFO,
                                                    message: dataResult2.ActionStatus1,
                                                    onCancel: () => {},
                                                    onConfirm: () => {
                                                        if (data.models[0]) {
                                                            data.models[0].IsConfirmWorkingByFrame = true;
                                                        }

                                                        VnrLoadingSevices.show();
                                                        this.onSaveAdd(data.models).then(data => {
                                                            VnrLoadingSevices.hide();
                                                            try {
                                                                if (data && data.ActionStatus == 'Locked') {
                                                                    ToasterSevice.showWarning('DataIsLocked');

                                                                    //show modal kiểm tra hợp lệ
                                                                    this.setState({ isVisibleAnalysic: true });
                                                                } else if (data && data.ActionStatus != 'Success') {
                                                                    ToasterSevice.showWarning(data.ActionStatus);

                                                                    //show modal kiểm tra hợp lệ
                                                                    this.setState({ isVisibleAnalysic: true });
                                                                } else {
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
                                                                }
                                                            } catch (error) {
                                                                DrawerServices.navigate('ErrorScreen', {
                                                                    ErrorDisplay: error
                                                                });
                                                            }
                                                        });
                                                    }
                                                });
                                            } else if (dataResult2.ActionStatus == 'Locked') {
                                                ToasterSevice.showWarning('AudienceLocked');

                                                //show modal kiểm tra hợp lệ
                                                this.setState({ isVisibleAnalysic: true });
                                            } else {
                                                ToasterSevice.showWarning('InsertFail');

                                                //show modal kiểm tra hợp lệ
                                                this.setState({ isVisibleAnalysic: true });
                                            }
                                        } catch (error) {
                                            DrawerServices.navigate('ErrorScreen', {
                                                ErrorDisplay: error
                                            });
                                        }
                                    });
                                }
                            } catch (error) {
                                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                            }
                        }
                    );
                } else {
                    //xử lý lại event Save
                    this.isProcessingSave = false;

                    ToasterSevice.showWarning('NeverInvalidDataAnalysis');
                }
            }
        }
    };

    onSaveAdd = dataBody => {
        // task: Nhan.Nguyen 0168019: [HOTFIX_VDSC_v8.11.12.01.11.46] Lỗi đăng ký tăng ca trên App
        const { apiConfig } = dataVnrStorage,
            _uriPor = apiConfig ? apiConfig.uriPor : null;

        if (dataBody && dataBody.length > 0) {
            const models = dataBody.map(item => {
                if (item.WorkDateTime) {
                    let strInTime = item.WorkDateTime.split(':');
                    let hour = parseInt(strInTime[0]);
                    let minute = parseInt(strInTime[1]);

                    let newDateIn = new Date(`${moment(item.InTime).format('YYYY/MM/DD')} ${hour}:${minute}:00`);
                    item.InTime = Vnr_Function.formatDateAPI(newDateIn);
                }

                if (item.RegisterTimeOut) {
                    let strInTime = item.RegisterTimeOut.split(':');
                    let hour = parseInt(strInTime[0]);
                    let minute = parseInt(strInTime[1]);

                    let newDateOut = new Date(`${moment(item.WorkDateRoot).format('YYYY/MM/DD')} ${hour}:${minute}:00`);
                    item.OutTime = Vnr_Function.formatDateAPI(newDateOut);
                }

                item.WorkDate = Vnr_Function.formatDateAPI(item.WorkDate);
                item.WorkDateRoot = Vnr_Function.formatDateAPI(item.WorkDateRoot);

                item.UserRegister = dataVnrStorage.currentUser.headers.userid;
                item.UserCreate = dataVnrStorage.currentUser.headers.userid;
                item.UserUpdate = dataVnrStorage.currentUser.headers.userid;

                item.UserLoginID = dataVnrStorage.currentUser.headers.userid;
                item.Host = _uriPor;
                item.IsPortal = true;
                return item;
            });

            return HttpService.Post('[URI_HR]/api/Att_Overtime', models);
        }
        // return HttpService.Post('[URI_HR]/Att_GetData/CreateAnalysis', dataBody);
    };

    onSaveEdit = dataBody => {
        return HttpService.Post('[URI_HR]/api/Att_OvertimeEdit', dataBody);
    };

    saveRegisterHelp = (navigation, isEmail = false) => {
        const {
                ID,
                isChoseProfile,
                Profiles,
                OrgStructures,
                ProfilesExclude,
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
                divBusinessReason
            } = this.state,
            { Comment } = divComment,
            { BusinessReason } = divBusinessReason,
            { LeaveDayType } = LeaveDayTypeFull,
            { TempLeaveDayType } = LeaveDayTypeByGrade,
            { DurationType, DurationTypeDetail } = Div_DurationType1,
            { OtherDurationType, DurationTypeFullShift } = DurationTypeDetail,
            { HoursFrom, HoursTo, divLeaveHours } = OtherDurationType,
            { LeaveHours } = divLeaveHours,
            { LeaveDays } = DurationTypeFullShift,
            { TypeHalfShift, divTypeHalfShiftContent } = Div_TypeHalfShift1,
            { divTypeHalfShiftLeaveHours, divTypeHalfShiftLeaveDay } = divTypeHalfShiftContent,
            { TypeHalfShiftLeaveDays } = divTypeHalfShiftLeaveDay,
            { TypeHalfShiftLeaveHours } = divTypeHalfShiftLeaveHours,
            { Shift } = divShift,
            { dayportal, hoursportal } = btnComputeRemainDaysPortal;

        let params = {
            ...this.paramsExtend,
            IsPortal: true,
            Status: 'E_SUBMIT',
            Comment: Comment.value,
            BusinessReason: BusinessReason.value,
            DateReturnToWork: DateReturnToWork.value,
            DateStart: DateStart.value,
            DateEnd: DateEnd.value,
            LeaveDayTypeID: LeaveDayType.value ? LeaveDayType.value.ID : null,
            TempLeaveDayTypeID: TempLeaveDayType.value ? TempLeaveDayType.value.ID : null,
            DurationType: DurationType.value ? DurationType.value.Value : null,
            HoursFrom: HoursFrom.value,
            HoursTo: HoursTo.value,
            LeaveHours:
                !LeaveHours.value || LeaveHours.value == 0 || LeaveHours.value == '0'
                    ? TypeHalfShiftLeaveHours.value
                    : LeaveHours.value,
            LeaveDays: LeaveDays.value,
            TypeHalfShift: TypeHalfShift.value ? TypeHalfShift.value.Value : null,
            TypeHalfShiftLeaveDays: TypeHalfShiftLeaveDays.value,
            TypeHalfShiftLeaveHours: TypeHalfShiftLeaveHours.value,
            ShiftID: Shift.value ? Shift.value.ID : null,
            ProfileID: null,
            UserApproveID: UserApprove.value ? UserApprove.value.ID : null,
            UserApproveID2: UserApprove2.value ? UserApprove2.value.ID : null,
            UserApproveID3: UserApprove3.value ? UserApprove3.value.ID : null,
            UserApproveID4: UserApprove4.value ? UserApprove4.value.ID : null,
            Remain: dayportal.value ? dayportal.value : hoursportal.value,
            HaveMeal: null,
            IsMeal: null,
            TotalDuration: LeaveDays.value,
            IsAddNewAndSendMail: isEmail,
            FileAttachment: null
        };

        if (ID) {
            params = {
                ...params,
                ID
            };
        }

        if (isChoseProfile) {
            params = {
                ...params,
                ProfileIds: Profiles.value ? Profiles.value.map(item => item.ID).join() : null,
                ProfileID: null,
                strOrgStructureIDs: null,
                ProfileIDsExclude: null
            };
        } else {
            params = {
                ...params,
                ProfileIDsExclude: ProfilesExclude.value ? ProfilesExclude.value.map(item => item.ID).join() : null,
                strOrgStructureIDs: OrgStructures.value
                    ? OrgStructures.value.map(item => item.OrderNumber).join()
                    : null,
                ProfileIds: null
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Att_Leaveday', params)
            .then(data => {
                VnrLoadingSevices.hide();
                try {
                    if (data) {
                        let str = '';
                        /**********************************Vựt số ngày nghỉ tối đa trong tháng*************************************************/
                        if (data.ActionStatus.indexOf(' ') != -1) {
                            let strSplit = data.ActionStatus.split(' ');

                            for (let i = 0; i < strSplit.length - 1; i++) {
                                str += strSplit[i] + ' ';
                            }
                            if (data.ActionStatus.endsWith('OverMaxNumdayLeaveInMonth') == true) {
                                let tran = translate('OverMaxNumdayLeaveInMonth');
                                ToasterSevice.showWarning(
                                    data.ActionStatus.slice(0, str.length, strSplit[strSplit.length - 1].length) +
                                        ' ' +
                                        tran,
                                    5000
                                );
                                return;
                            }
                        }

                        /**********************************Đăng Ký Thành Công*************************************************/
                        if (data.ActionStatus == 'Success') {
                            ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                            navigation.navigate('AttSubmitLeaveDay');
                            const { reload } = navigation.state.params;
                            reload();
                            return;
                        }

                        //Vượt quá số người trong khung giờ
                        if (data.IsConfirmWorkingByFrame) {
                            AlertSevice.alert({
                                title: translate('Hrm_Notification'),
                                iconType: EnumIcon.E_INFO,
                                message: data.ActionStatus,
                                onCancel: () => {},
                                onConfirm: () => {
                                    this.paramsExtend = {
                                        ...this.paramsExtend,
                                        IsConfirmWorkingByFrame: true
                                    };
                                    this.saveRegisterHelp(navigation, isEmail);

                                    // let _bool = DoveSave(_status, urlCreateOrUpdate, frm, isScheduler);
                                    // if (_bool) {
                                    //     let model = { SysUserID: _ajaxHeader().userid };
                                    //     if ($('#Leaveday__Index__LeavedayGird').data('kendoGrid')) {
                                    //         reloadGrid('Leaveday__Index__LeavedayGird');
                                    //     }
                                    //     ToasterSevice.showWarning("Success", 'success', true);
                                    // }
                                }
                            });

                            return;
                        }

                        /**********************************Không Có Lịch Làm Việc Trong Khoản Thời Gian Đăng Ký*************************************************/
                        if (data.ActionStatus == 'WarningNotRosterInThisTime') {
                            ToasterSevice.showWarning('WarningNotRosterInThisTime', 5000);
                            return;
                        }

                        if (data.IsDisSolvedAnnualLeave) {
                            // AlertSevice.alert({
                            //     title: translate('Hrm_Notification'),
                            //     icon: `${Platform.OS === 'ios' ? 'ios-' : 'md-'}checkmark-circle`,
                            //     iconColor: Colors.danger,
                            //     message: translate('HRM_Message_EmployeeHaveNotAnnualLeave_YouwantDissolved'),
                            //     onCancel: () => { },
                            //     onConfirm: () => {
                            //
                            //         this.paramsExtend = {
                            //             ...this.paramsExtend,
                            //             IsConfirmWorkingByFrame: true
                            //         }
                            //         this.saveRegisterHelp(navigation, isEmail);

                            //         listDisSolvedAnnualLeave = data.ListDisSolvedAnnualLeave;
                            //         for (let i = 0; i < listDisSolvedAnnualLeave.length; i++) {
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
                            // })

                            alert('chưa hỗ trợ');

                            return;
                        }

                        if (data.ActionStatus == 'WaringLeaveHourGreaterThanRemain') {
                            ToasterSevice.showWarning('WaringLeaveHourGreaterThanRemain', 5000);
                            return;
                        }
                        if (data.ActionStatus == 'WaringYouCannotCreateLeavedayPast') {
                            ToasterSevice.showWarning('WaringYouCannotCreateLeavedayPast', 5000);
                            return;
                        }
                        if (data.ActionStatus == 'WarningDonotRegistLeavedayInProbation') {
                            ToasterSevice.showWarning('WarningDonotRegistLeavedayInProbation', 5000);
                            return;
                        }
                        if (data.ActionStatus == 'WaringNotLeaveDaysAndLeavehours') {
                            ToasterSevice.showWarning('WaringNotLeaveDaysAndLeavehours', 5000);
                            return;
                        }
                        if (data.ActionStatus == 'Locked') {
                            ToasterSevice.showWarning('DataIsLocked', 5000);
                            return;
                        }
                        if (data.ActionStatus.indexOf('OverMaxNumdayLeaveInMonth') == 12) {
                            let strSplit = data.ActionStatus.split(' ');
                            let tran = translate('OverMaxNumdayLeaveInMonth');
                            ToasterSevice.showWarning(strSplit[0] + ' ' + strSplit[1] + ' ' + tran, 5000);
                            return;
                        }

                        if (data.ActionStatus == 'CheckLeavedayProbationning') {
                            AlertSevice.alert({
                                title: translate('Hrm_Notification'),
                                iconType: EnumIcon.E_INFO,
                                message: translate('CheckLeavedayProbationning'),
                                onCancel: () => {},
                                onConfirm: () => {
                                    this.paramsExtend = {
                                        ...this.paramsExtend,
                                        IsExcludeProbation: true
                                    };
                                    this.saveRegisterHelp(navigation, isEmail);
                                }
                            });
                            return;
                        }

                        if (data.IsCheckDuplicate) {
                            AlertSevice.alert({
                                title: translate('Hrm_Notification'),
                                iconType: EnumIcon.E_INFO,
                                message: str + translate('CheckLeavedayDuplicateRemove'),
                                onCancel: () => {},
                                onConfirm: () => {
                                    this.paramsExtend = {
                                        ...this.paramsExtend,
                                        IsCheckDuplicate: true
                                    };
                                    this.saveRegisterHelp(navigation, isEmail);
                                }
                            });
                            return;
                        }

                        if (data.IsCheckLeaveEliminate) {
                            AlertSevice.alert({
                                title: translate('Hrm_Notification'),
                                iconType: EnumIcon.E_INFO,
                                message: translate('Employee') + str + translate('CheckAnnualyLeaveDayEliminate'),
                                onCancel: () => {},
                                onConfirm: () => {
                                    this.paramsExtend = {
                                        ...this.paramsExtend,
                                        IsCheckLeaveEliminate: true
                                    };
                                    this.saveRegisterHelp(navigation, isEmail);
                                }
                            });
                            return;
                        }

                        if (data.ActionStatus == 'ErrorTotalLeave') {
                            ToasterSevice.showWarning('NumberHolidayExceedingPolicy', 5000);
                        } else {
                            ToasterSevice.showWarning(data.ActionStatus, 5000);
                            //alert('chưa hỗ trợ')
                            //$('#IsExcludeProbation').val(false);
                            //IsDisSolvedAnnualLeave(data.IsDisSolvedAnnualLeave, data.ActionStatus);
                        }
                    } else {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: '' });
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            })
            .catch(() => {
                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                VnrLoadingSevices.hide();
            });
    };

    saveNotRegisterHelp = () => {};

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
    //#endregion

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

    hideModalAnalysic = () => {
        this.setState({ isVisibleAnalysic: false });
    };

    render() {
        const {
            isChoseProfile,
            CheckProfilesExclude,
            Profiles,
            OrgStructures,
            ProfilesExclude,
            Profile,
            WorkDate,
            IsGetShiftByProfile,
            divShiftID,
            divTempShiftID,
            removeDurationType,
            IsOverTimeBreak,
            divOvertimeTypeID,
            checkShiftByProfile,
            eleRegisterHours,
            eleRegisterHoursConfig,
            IsNotCheckInOut,
            MethodPayment,
            JobTypeID,
            ReasonOT,
            FileAttach,
            UserApprove,
            UserApprove3,
            UserApprove4,
            UserApprove2,
            UserComment1,
            UserComment2,
            UserComment3,
            UserComment4,
            divIsRegistedFood,
            currDataAnalysic,
            modalLimit,
            isVisibleAnalysic,
            fieldValid,
            IsBreakAsWork
        } = this.state;

        this.isRegisterHelp != null &&
            (({ ShiftID } = divShiftID),
            ({ TempShiftID } = divTempShiftID),
            ({ DurationType } = removeDurationType),
            ({ OvertimeTypeID } = divOvertimeTypeID),
            ({ WorkDateIn, WorkDateOut } = checkShiftByProfile),
            ({ RegisterHours } = eleRegisterHours),
            ({ RegisterHoursConfig } = eleRegisterHoursConfig),
            ({ IsMealRegistration, IsCarRegistration } = divIsRegistedFood),
            ({ MenuID, Menu2ID, FoodID, Food2ID } = IsMealRegistration),
            ({ OvertimePlaceID } = IsCarRegistration));

        const {
            textLableInfo,
            formDate_To_From,
            controlDate_To,
            controlDate_from,
            contentViewControl,
            viewLable,
            viewControl
        } = stylesListPickerControl;

        const listActions = [];

        if (!this.isModify && isVisibleAnalysic === false) {
            listActions.push({
                type: EnumName.E_ANALYSICS,
                title: translate('HRM_Attendance_ComputeOvertime'),
                onPress: () => this.analysic(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_Overtime_New_CreateOrUpdate_btnSaveandSendMail'] &&
            PermissionForAppMobile.value['New_Att_Overtime_New_CreateOrUpdate_btnSaveandSendMail']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_SENMAIL,
                title: translate('HRM_Common_SaveAndSendMail'),
                onPress: () => this.saveAndSend(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_Overtime_New_CreateOrUpdate_btnSave'] &&
            PermissionForAppMobile.value['New_Att_Overtime_New_CreateOrUpdate_btnSave']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_CLOSE,
                title: translate('HRM_Common_SaveClose'),
                onPress: () => this.save(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_Overtime_New_CreateOrUpdate_btnSaveNew'] &&
            PermissionForAppMobile.value['New_Att_Overtime_New_CreateOrUpdate_btnSaveNew']['View']
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
                            keyboardShouldPersistTaps={'handled'}
                            contentContainerStyle={
                                this.isModify == false && currDataAnalysic.length > 0
                                    ? CustomStyleSheet.flexGrow(5)
                                    : CustomStyleSheet.flexGrow(1)
                            }
                        >
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
                                            radio_props={[{ label: 'NV', value: true }, { label: 'PB', value: false }]}
                                            initial={0}
                                            onPress={value => this.onChangeRadioButton(value)}
                                        />
                                    </View>
                                    <View style={viewControl}>
                                        {isChoseProfile ? (
                                            <View style={styles.wrapChoseProfile}>
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
                                                        onFinish={items => this.onMultiPickerChangeProfile(items)}
                                                    />
                                                </View>

                                                <View>
                                                    <TouchableOpacity
                                                        style={styles.btnAddMoreProfiles}
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
                                                <View style={styles.wrapChoseProfile}>
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
                                                    <View style={styles.wrapChoseProfile}>
                                                        <View style={CustomStyleSheet.flex(1)}>
                                                            <VnrPickerMulti
                                                                api={ProfilesExclude.api}
                                                                value={ProfilesExclude.value}
                                                                refresh={ProfilesExclude.refresh}
                                                                textField="ProfileName"
                                                                valueField="ID"
                                                                filter={true}
                                                                filterServer={true}
                                                                filterParams="text"
                                                                onFinish={items =>
                                                                    this.onFinishPickerMultiExcludeProfile(items)
                                                                }
                                                            />
                                                        </View>

                                                        <View>
                                                            <TouchableOpacity
                                                                style={styles.btnAddMoreProfilesExcludeProfile}
                                                                onPress={() =>
                                                                    this.nextScreenAddMoreProfilesExcludeProfile()
                                                                }
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
                                        <VnrTextInput disable={true} value={Profile['ProfileName']} />
                                    </View>
                                </View>
                            )}

                            {/* Ngày công - WorkDate */}
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_Overtime_WorkDate'}
                                    />

                                    {/* valid WorkDate */}
                                    {fieldValid.WorkDate && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={WorkDate.value}
                                        disable={WorkDate.disable}
                                        refresh={WorkDate.refresh}
                                        type={'date'}
                                        onFinish={value => this.onDateChangeWorkDate(value)}
                                    />
                                </View>
                            </View>

                            {/* Checkbox Lấy theo ca làm việc - IsGetShiftByProfile */}
                            {IsGetShiftByProfile.visibleConfig && IsGetShiftByProfile.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Att_Get_Shift_By_Profile'}
                                        />

                                        {/* valid IsGetShiftByProfile */}
                                        {fieldValid.IsGetShiftByProfile && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <CheckBox
                                            isChecked={IsGetShiftByProfile.value}
                                            disable={IsGetShiftByProfile.disable}
                                            onClick={() =>
                                                this.setState({
                                                    IsGetShiftByProfile: {
                                                        ...IsGetShiftByProfile,
                                                        value: !IsGetShiftByProfile.value
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* ca - ShiftID - divShiftID */}
                            {divShiftID.visible && divShiftID.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Overtime_ShiftID'}
                                        />

                                        {/* valid ShiftID */}
                                        {fieldValid.ShiftID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            dataLocal={ShiftID.data}
                                            refresh={ShiftID.refresh}
                                            textField="ShiftName"
                                            valueField="ID"
                                            filter={true}
                                            value={ShiftID.value}
                                            filterServer={false}
                                            autoFilter={true}
                                            disable={ShiftID.disable}
                                            onFinish={item => this.onPickerChangeShiftID(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* ca - TempShiftID - divTempShiftID */}
                            {divTempShiftID.visible && divTempShiftID.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Overtime_ShiftID'}
                                        />

                                        {/* valid TempShiftID */}
                                        {fieldValid.TempShiftID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            dataLocal={TempShiftID.data}
                                            refresh={TempShiftID.refresh}
                                            textField="ShiftName"
                                            valueField="ID"
                                            filter={true}
                                            value={TempShiftID.value}
                                            filterServer={false}
                                            autoFilter={true}
                                            disable={TempShiftID.disable}
                                            onFinish={item => this.onPickerChangeTempShiftID(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Loại đăng ký - DurationType - removeDurationType HRM_System_UserApprove_Type*/}
                            {removeDurationType.visible && removeDurationType.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'DurationType'} />

                                        {/* valid DurationType */}
                                        {fieldValid.DurationType && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        {/* <VnrPicker
                      dataLocal={DurationType.data}
                      refresh={DurationType.refresh}
                      textField="Text"
                      valueField="Value"
                      filter={true}
                      value={DurationType.value}
                      filterServer={false}
                      disable={DurationType.disable}
                      onFinish={item => this.onPickerChangeDurationType(item)}
                    /> */}
                                        <VnrPickerQuickly
                                            dataLocal={DurationType.data}
                                            refresh={DurationType.refresh}
                                            textField="Text"
                                            valueField="Value"
                                            filter={false}
                                            value={DurationType.value}
                                            //filterServer={false}
                                            disable={DurationType.disable}
                                            onFinish={item => this.onPickerChangeDurationType(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Checkbox Lấy theo ca làm việc - IsOverTimeBreak */}
                            {IsOverTimeBreak.visibleConfig && IsOverTimeBreak.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_IsOverTimeBreak'}
                                        />

                                        {/* valid IsOverTimeBreak */}
                                        {fieldValid.IsOverTimeBreak && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <CheckBox
                                            isChecked={IsOverTimeBreak.value}
                                            disable={IsOverTimeBreak.disable}
                                            onClick={() =>
                                                this.setState({
                                                    IsOverTimeBreak: {
                                                        ...IsOverTimeBreak,
                                                        value: !IsOverTimeBreak.value
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* task: 0163864 */}
                            {/* Checkbox Nghỉ giữa ca trong thời gian tăng ca tính như đi làm - IsBreakAsWork */}
                            {IsBreakAsWork.visibleConfig && IsBreakAsWork.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Overtime_IsBreakAsWork'}
                                        />
                                        {/* valid IsBreakAsWork */}
                                        {fieldValid.IsBreakAsWork && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <CheckBox
                                            isChecked={IsBreakAsWork.value}
                                            disable={IsBreakAsWork.disable}
                                            onClick={() =>
                                                this.setState(
                                                    {
                                                        IsBreakAsWork: {
                                                            ...IsBreakAsWork,
                                                            value: !IsBreakAsWork.value
                                                        }
                                                    },
                                                    () => {
                                                        if (removeDurationType.DurationType.value) {
                                                            this.UpdateEndOT(true, true);
                                                        }
                                                    }
                                                )
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Loại tăng ca - OvertimeTypeID - divOvertimeTypeID */}
                            {divOvertimeTypeID.visible && divOvertimeTypeID.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Att_Report_OvertimeTypeID'}
                                        />

                                        {/* valid OvertimeTypeID */}
                                        {fieldValid.OvertimeTypeID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi: '[URI_HR]/Cat_GetData/GetMultiOvertimeTypeNotInPortal',
                                                type: 'E_GET'
                                            }}
                                            refresh={OvertimeTypeID.refresh}
                                            textField="OvertimeTypeName"
                                            valueField="ID"
                                            filter={true}
                                            value={OvertimeTypeID.value}
                                            filterServer={true}
                                            filterParams="text"
                                            disable={OvertimeTypeID.disable}
                                            onFinish={item => this.onPickerChangeOvertimeTypeID(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Giờ bắt đầu tăng ca - WorkDateIn,WorkDateOut - checkShiftByProfile*/}
                            {checkShiftByProfile.visible && checkShiftByProfile.visibleConfig && (
                                <View>
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={'HRM_Attendance_Overtime_HourStartOverTime'}
                                            />

                                            {/* valid WorkDateIn */}
                                            {fieldValid.WorkDateIn && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <View style={formDate_To_From}>
                                                <View style={controlDate_from}>
                                                    <VnrDate
                                                        disable={WorkDateIn.disable}
                                                        format={'HH:mm'}
                                                        value={WorkDateIn.value}
                                                        refresh={WorkDateIn.refresh}
                                                        type={'time'}
                                                        onFinish={value => this.onTimeChangeWorkDateIn(value)}
                                                    />
                                                </View>
                                                <View style={controlDate_To}>
                                                    <VnrDate
                                                        disable={WorkDateOut.disable}
                                                        format={'HH:mm'}
                                                        value={WorkDateOut.value}
                                                        refresh={WorkDateOut.refresh}
                                                        type={'time'}
                                                        onFinish={value => this.onTimeChangeWorkDateOut(value)}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )}

                            {/* Số giờ ĐK - RegisterHours, RegisterHoursConfig */}
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_Overtime_RegisterHours'}
                                    />

                                    {/* valid RegisterHours */}
                                    {fieldValid.RegisterHours && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>

                                <View style={viewControl}>
                                    {/* không cấu hình số giờ - RegisterHours - eleRegisterHours */}
                                    {eleRegisterHours.visible && eleRegisterHours.visibleConfig && (
                                        <VnrTextInput
                                            value={RegisterHours.value}
                                            refresh={RegisterHours.refresh}
                                            disable={RegisterHours.disable}
                                            keyboardType={'numeric'}
                                            charType={'double'}
                                            returnKeyType={'done'}
                                            onChangeText={value => {
                                                this.setState({
                                                    eleRegisterHours: {
                                                        ...eleRegisterHours,
                                                        RegisterHours: {
                                                            ...RegisterHours,
                                                            value: value
                                                        }
                                                    }
                                                });
                                            }}
                                            onBlur={this.onChangeRegisterHours}
                                            onSubmitEditing={this.onChangeRegisterHours}
                                        />
                                    )}

                                    {/* có cấu hình số giờ - RegisterHoursConfig - eleRegisterHoursConfig */}
                                    {eleRegisterHoursConfig.visible && eleRegisterHoursConfig.visibleConfig && (
                                        <VnrPicker
                                            dataLocal={RegisterHoursConfig.data}
                                            textField="Text"
                                            valueField="Value"
                                            filter={false}
                                            refresh={RegisterHoursConfig.refresh}
                                            value={RegisterHoursConfig.value}
                                            onFinish={item => this.onChangeRegisterHoursConfig(item)}
                                        />
                                    )}
                                </View>

                                {divIsRegistedFood.visible && (
                                    <View>
                                        {/* đăng ký ăn */}
                                        <View style={contentViewControl}>
                                            <View style={viewLable}>
                                                <VnrText
                                                    style={[styleSheets.text, textLableInfo]}
                                                    i18nKey={'HRM_Attendance_Overtime_IsMealRegistration'}
                                                />

                                                {/* valid IsMealRegistration */}
                                                {fieldValid.IsMealRegistration && (
                                                    <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                )}
                                            </View>
                                            <View style={viewControl}>
                                                <CheckBox
                                                    isChecked={IsMealRegistration.value}
                                                    onClick={() =>
                                                        this.setState({
                                                            divIsRegistedFood: {
                                                                ...divIsRegistedFood,
                                                                IsMealRegistration: {
                                                                    ...IsMealRegistration,
                                                                    value: !IsMealRegistration.value
                                                                }
                                                            }
                                                        })
                                                    }
                                                />
                                            </View>
                                        </View>

                                        {/* checked đăng ký ăn */}
                                        {IsMealRegistration.value && (
                                            <View>
                                                {/* Món 1 */}
                                                <View>
                                                    <View style={contentViewControl}>
                                                        <View style={viewLable}>
                                                            <VnrText
                                                                style={[styleSheets.text, textLableInfo]}
                                                                i18nKey={'HRM_Attendance_Overtime_MenuID'}
                                                            />

                                                            {/* valid MenuID */}
                                                            {fieldValid.MenuID && (
                                                                <VnrText
                                                                    style={styleValid}
                                                                    i18nKey={'HRM_Valid_Char'}
                                                                />
                                                            )}
                                                        </View>
                                                        <View style={viewControl}>
                                                            <VnrPicker
                                                                api={{
                                                                    urlApi: '[URI_HR]/Canteen_GetData/GetMultiMenu',
                                                                    type: 'E_GET'
                                                                }}
                                                                refresh={MenuID.refresh}
                                                                textField="MenuName"
                                                                valueField="ID"
                                                                filter={true}
                                                                value={MenuID.value}
                                                                filterServer={false}
                                                                onFinish={item =>
                                                                    this.setState({
                                                                        divIsRegistedFood: {
                                                                            ...divIsRegistedFood,
                                                                            IsMealRegistration: {
                                                                                ...IsMealRegistration,
                                                                                MenuID: {
                                                                                    ...MenuID,
                                                                                    value: item ? { ...item } : null,
                                                                                    refresh: !MenuID.refresh
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            />
                                                        </View>
                                                    </View>

                                                    <View style={contentViewControl}>
                                                        <View style={viewLable}>
                                                            <VnrText
                                                                style={[styleSheets.text, textLableInfo]}
                                                                i18nKey={'HRM_Attendance_Overtime_FoodID'}
                                                            />

                                                            {/* valid FoodID */}
                                                            {fieldValid.FoodID && (
                                                                <VnrText
                                                                    style={styleValid}
                                                                    i18nKey={'HRM_Valid_Char'}
                                                                />
                                                            )}
                                                        </View>
                                                        <View style={viewControl}>
                                                            <VnrPicker
                                                                api={{
                                                                    urlApi: '[URI_HR]/Canteen_GetData/GetMultiFood',
                                                                    type: 'E_GET'
                                                                }}
                                                                refresh={FoodID.refresh}
                                                                textField="FoodName"
                                                                valueField="ID"
                                                                filter={true}
                                                                value={FoodID.value}
                                                                filterServer={false}
                                                                onFinish={item =>
                                                                    this.setState({
                                                                        divIsRegistedFood: {
                                                                            ...divIsRegistedFood,
                                                                            IsMealRegistration: {
                                                                                ...IsMealRegistration,
                                                                                FoodID: {
                                                                                    ...FoodID,
                                                                                    value: item ? { ...item } : null,
                                                                                    refresh: !FoodID.refresh
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            />
                                                        </View>
                                                    </View>
                                                </View>

                                                {/* Món 2 */}
                                                <View>
                                                    <View style={contentViewControl}>
                                                        <View style={viewLable}>
                                                            <VnrText
                                                                style={[styleSheets.text, textLableInfo]}
                                                                i18nKey={'HRM_Attendance_Overtime_MenuID2'}
                                                            />

                                                            {/* valid Menu2ID */}
                                                            {fieldValid.Menu2ID && (
                                                                <VnrText
                                                                    style={styleValid}
                                                                    i18nKey={'HRM_Valid_Char'}
                                                                />
                                                            )}
                                                        </View>
                                                        <View style={viewControl}>
                                                            <VnrPicker
                                                                api={{
                                                                    urlApi: '[URI_HR]/Canteen_GetData/GetMultiMenu',
                                                                    type: 'E_GET'
                                                                }}
                                                                refresh={Menu2ID.refresh}
                                                                textField="MenuName"
                                                                valueField="ID"
                                                                filter={true}
                                                                value={Menu2ID.value}
                                                                filterServer={false}
                                                                onFinish={item =>
                                                                    this.setState({
                                                                        divIsRegistedFood: {
                                                                            ...divIsRegistedFood,
                                                                            IsMealRegistration: {
                                                                                ...IsMealRegistration,
                                                                                Menu2ID: {
                                                                                    ...Menu2ID,
                                                                                    value: item ? { ...item } : null,
                                                                                    refresh: !Menu2ID.refresh
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            />
                                                        </View>
                                                    </View>
                                                    <View style={contentViewControl}>
                                                        <View style={viewLable}>
                                                            <VnrText
                                                                style={[styleSheets.text, textLableInfo]}
                                                                i18nKey={'HRM_Attendance_Overtime_FoodID2'}
                                                            />

                                                            {/* valid Food2ID */}
                                                            {fieldValid.Food2ID && (
                                                                <VnrText
                                                                    style={styleValid}
                                                                    i18nKey={'HRM_Valid_Char'}
                                                                />
                                                            )}
                                                        </View>
                                                        <View style={viewControl}>
                                                            <VnrPicker
                                                                api={{
                                                                    urlApi: '[URI_HR]/Canteen_GetData/GetMultiFood',
                                                                    type: 'E_GET'
                                                                }}
                                                                refresh={Food2ID.refresh}
                                                                textField="FoodName"
                                                                valueField="ID"
                                                                filter={true}
                                                                value={Food2ID.value}
                                                                filterServer={false}
                                                                onFinish={item =>
                                                                    this.setState({
                                                                        divIsRegistedFood: {
                                                                            ...divIsRegistedFood,
                                                                            IsMealRegistration: {
                                                                                ...IsMealRegistration,
                                                                                Food2ID: {
                                                                                    ...Food2ID,
                                                                                    value: item ? { ...item } : null,
                                                                                    refresh: !Food2ID.refresh
                                                                                }
                                                                            }
                                                                        }
                                                                    })
                                                                }
                                                            />
                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        )}

                                        {/* đăng ký xe */}
                                        <View style={contentViewControl}>
                                            <View style={viewLable}>
                                                <VnrText
                                                    style={[styleSheets.text, textLableInfo]}
                                                    i18nKey={'HRM_Attendance_Overtime_IsCarRegistration'}
                                                />

                                                {/* valid IsCarRegistration */}
                                                {fieldValid.IsCarRegistration && (
                                                    <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                )}
                                            </View>
                                            <View style={viewControl}>
                                                <CheckBox
                                                    isChecked={IsCarRegistration.value}
                                                    onClick={() =>
                                                        this.setState({
                                                            divIsRegistedFood: {
                                                                ...divIsRegistedFood,
                                                                IsCarRegistration: {
                                                                    ...IsCarRegistration,
                                                                    value: !IsCarRegistration.value
                                                                }
                                                            }
                                                        })
                                                    }
                                                />
                                            </View>
                                        </View>

                                        {/* checked đăng ký xe */}
                                        {IsCarRegistration.value && (
                                            <View style={contentViewControl}>
                                                <View style={viewLable}>
                                                    <VnrText
                                                        style={[styleSheets.text, textLableInfo]}
                                                        i18nKey={'HRM_Attendance_Overtime_OvertimePlaceID'}
                                                    />

                                                    {/* valid OvertimePlaceID */}
                                                    {fieldValid.OvertimePlaceID && (
                                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                                    )}
                                                </View>
                                                <View style={viewControl}>
                                                    <VnrPicker
                                                        api={{
                                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiWorkPlace',
                                                            type: 'E_GET'
                                                        }}
                                                        refresh={OvertimePlaceID.refresh}
                                                        textField="WorkPlaceName"
                                                        valueField="ID"
                                                        filter={true}
                                                        value={OvertimePlaceID.value}
                                                        filterServer={false}
                                                        onFinish={item =>
                                                            this.setState({
                                                                divIsRegistedFood: {
                                                                    ...divIsRegistedFood,
                                                                    IsCarRegistration: {
                                                                        ...IsCarRegistration,
                                                                        OvertimePlaceID: {
                                                                            ...OvertimePlaceID,
                                                                            value: item ? { ...item } : null,
                                                                            refresh: !OvertimePlaceID.refresh
                                                                        }
                                                                    }
                                                                }
                                                            })
                                                        }
                                                    />
                                                </View>
                                            </View>
                                        )}
                                    </View>
                                )}
                            </View>

                            {/* Checkbox Không kiểm tra in/out - IsNotCheckInOut */}
                            {IsNotCheckInOut.visibleConfig && IsNotCheckInOut.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_IsNotCheckInOut'}
                                        />

                                        {/* valid IsNotCheckInOut */}
                                        {fieldValid.IsNotCheckInOut && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <CheckBox
                                            isChecked={IsNotCheckInOut.value}
                                            disable={IsNotCheckInOut.disable}
                                            onClick={() =>
                                                this.setState({
                                                    IsNotCheckInOut: {
                                                        ...IsNotCheckInOut,
                                                        value: !IsNotCheckInOut.value
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* PT thanh toán - MethodPayment */}
                            {MethodPayment.visibleConfig && MethodPayment.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Overtime_MethodPayment'}
                                        />

                                        {/* valid MethodPayment */}
                                        {fieldValid.MethodPayment && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        {/* <VnrPicker
                    dataLocal={MethodPayment.data}
                    refresh={MethodPayment.refresh}
                    textField="Text"
                    valueField="Value"
                    filter={false}
                    value={MethodPayment.value}
                    disable={MethodPayment.disable}
                    onFinish={item => this.onPickerChangeMethodPayment(item)}
                  /> */}

                                        <VnrPickerQuickly
                                            dataLocal={MethodPayment.data}
                                            refresh={MethodPayment.refresh}
                                            textField="Text"
                                            valueField="Value"
                                            filter={false}
                                            value={MethodPayment.value}
                                            disable={MethodPayment.disable}
                                            onFinish={item => this.onPickerChangeMethodPayment(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* duyệt đầu */}
                            {UserApprove.visibleConfig && UserApprove.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Overtime_UserApproveID'}
                                        />

                                        {/* valid UserApproveID */}
                                        {fieldValid.UserApproveID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_OVERTIME',
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
                                            i18nKey={'HRM_Attendance_Overtime_UserApproveID3'}
                                        />

                                        {/* valid UserApproveID3 */}
                                        {fieldValid.UserApproveID3 && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_OVERTIME',
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
                                            i18nKey={'HRM_Attendance_Att_Overtime_Submit_UserApproveID4'}
                                        />

                                        {/* valid UserApproveID4 */}
                                        {fieldValid.UserApproveID4 && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_OVERTIME',
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
                            {UserApprove2.visibleConfig && UserApprove2.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Overtime_UserApproveID2'}
                                        />

                                        {/* valid UserApproveID2 */}
                                        {fieldValid.UserApproveID2 && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            api={{
                                                urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_OVERTIME',
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

                            {/*UserComment1*/}
                            {UserComment1.visibleConfig && UserComment1.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'UserCommentName1'}
                                        />

                                        {/* valid UserComment1 */}
                                        {fieldValid.UserComment1 && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerMulti
                                            dataLocal={UserComment1.data}
                                            refresh={UserComment1.refresh}
                                            textField="ProfileName"
                                            valueField="ID"
                                            filter={true}
                                            value={UserComment1.value}
                                            filterServer={true}
                                            filterParams="text"
                                            disable={UserComment1.disable}
                                            onFinish={items => {
                                                this.setState({
                                                    UserComment1: {
                                                        ...UserComment1,
                                                        value: items,
                                                        refresh: !UserComment1.refresh
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/*UserComment2*/}
                            {UserComment2.visibleConfig && UserComment2.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'UserCommentName2'}
                                        />

                                        {/* valid UserComment2 */}
                                        {fieldValid.UserComment2 && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerMulti
                                            dataLocal={UserComment2.data}
                                            refresh={UserComment2.refresh}
                                            textField="ProfileName"
                                            valueField="ID"
                                            filter={true}
                                            value={UserComment2.value}
                                            filterServer={true}
                                            filterParams="text"
                                            disable={UserComment2.disable}
                                            onFinish={items =>
                                                this.setState({
                                                    UserComment2: {
                                                        ...UserComment2,
                                                        value: items,
                                                        refresh: !UserComment2.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/*UserComment3*/}
                            {UserComment3.visibleConfig && UserComment3.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'UserCommentName3'}
                                        />

                                        {/* valid UserComment3 */}
                                        {fieldValid.UserComment3 && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerMulti
                                            dataLocal={UserComment3.data}
                                            refresh={UserComment3.refresh}
                                            textField="ProfileName"
                                            valueField="ID"
                                            filter={true}
                                            value={UserComment3.value}
                                            filterServer={true}
                                            filterParams="text"
                                            disable={UserComment3.disable}
                                            onFinish={items =>
                                                this.setState({
                                                    UserComment3: {
                                                        ...UserComment3,
                                                        value: items,
                                                        refresh: !UserComment3.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/*UserComment4*/}
                            {UserComment4.visibleConfig && UserComment4.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'UserCommentName4'}
                                        />

                                        {/* valid UserComment4 */}
                                        {fieldValid.UserComment4 && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerMulti
                                            dataLocal={UserComment4.data}
                                            refresh={UserComment4.refresh}
                                            textField="ProfileName"
                                            valueField="ID"
                                            filter={true}
                                            value={UserComment4.value}
                                            filterServer={true}
                                            filterParams="text"
                                            disable={UserComment4.disable}
                                            onFinish={items =>
                                                this.setState({
                                                    UserComment4: {
                                                        ...UserComment4,
                                                        value: items,
                                                        refresh: !UserComment4.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Loại công việc - JobTypeID */}
                            {JobTypeID.visible && JobTypeID.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_HR_HDTJob_Type'}
                                        />

                                        {/* valid JobTypeID */}
                                        {fieldValid.JobTypeID && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPicker
                                            dataLocal={JobTypeID.data}
                                            refresh={JobTypeID.refresh}
                                            textField="JobTypeName"
                                            valueField="ID"
                                            filter={true}
                                            filterServer={true}
                                            value={JobTypeID.value}
                                            filterParams="text"
                                            disable={JobTypeID.disable}
                                            onFinish={item => this.onChangeJobTypeID(item)}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Lý do tăng ca - ReasonOT*/}
                            {ReasonOT.visible && ReasonOT.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_Overtime_ReasonOT'}
                                        />

                                        {/* valid ReasonOT */}
                                        {fieldValid.ReasonOT && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={ReasonOT.disable}
                                            refresh={ReasonOT.refresh}
                                            value={ReasonOT.value}
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

                            {/* Tập tin đính kèm - FileAttach */}
                            {FileAttach.visible && FileAttach.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_HR_Reward_Attachment'}
                                        />

                                        {/* valid FileAttach */}
                                        {fieldValid.FileAttach && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrAttachFile
                                            disable={FileAttach.disable}
                                            // value={[{ exr: 'sdsadsa' },
                                            // { "ext": ".doc", "fileName": "docssss.doc",
                                            //  "path": "http://192.168.1.58:6200//Uploads//doc.doc",
                                            //   "size": 19 }]}
                                            value={FileAttach.value}
                                            multiFile={true}
                                            uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                            onFinish={() => {

                                            }}
                                        />
                                    </View>
                                </View>
                            )}
                        </KeyboardAwareScrollView>
                    )}

                    {this.isRegisterHelp != null && <ListButtonSave listActions={listActions} />}

                    {
                        <Modal
                            onBackButtonPress={() => this.hideModalAnalysic()}
                            isVisible={this.isModify == false && currDataAnalysic.length > 0 && isVisibleAnalysic}
                            onBackdropPress={() => this.hideModalAnalysic()}
                            customBackdrop={
                                <TouchableWithoutFeedback onPress={() => this.hideModalAnalysic()}>
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
                                        <TouchableOpacity onPress={() => this.hideModalAnalysic()}>
                                            <IconColse color={Colors.grey} size={Size.iconSize} />
                                        </TouchableOpacity>
                                        <VnrText
                                            style={styleSheets.lable}
                                            i18nKey={'HRM_Attendance_ComputeWorkDay_ComputeData'}
                                        />
                                        <IconPublish color={Colors.white} size={Size.iconSize} />
                                    </View>

                                    <ScrollView style={styles.wrapRenderError}>
                                        {currDataAnalysic.map((dataItem, index) => {
                                            return (
                                                <RenderItemDataAnalysic
                                                    key={index}
                                                    dataItem={dataItem}
                                                    index={index}
                                                    removeItem={this.removeItem}
                                                />
                                            );
                                        })}
                                    </ScrollView>

                                    <ListButtonSave listActions={listActions} />
                                    {/* <View style={styles.groupButton}>

                    <TouchableOpacity
                      onPress={() => this.save(this.props.navigation)}
                      style={styles.groupButton__button_save}>
                      <IconPublish size={Size.iconSize} color={Colors.white} />
                      <VnrText
                        style={[styleSheets.lable, styles.groupButton__text]}
                        i18nKey={'HRM_Common_SaveClose'}
                      />
                    </TouchableOpacity>
                  </View> */}
                                </SafeAreaView>
                            </View>
                        </Modal>
                    }

                    {modalLimit.isModalVisible && (
                        <Modal
                            onBackButtonPress={() => this.closeModal()}
                            isVisible={true}
                            onBackdropPress={() => this.closeModal()}
                            customBackdrop={
                                <TouchableWithoutFeedback onPress={() => this.closeModal()}>
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
                                        <TouchableOpacity onPress={() => this.closeModal()}>
                                            <IconColse color={Colors.grey} size={Size.iconSize} />
                                        </TouchableOpacity>
                                        <VnrText style={styleSheets.lable} i18nKey={'Hrm_Notification'} />
                                        <IconColse color={Colors.white} size={Size.iconSize} />
                                    </View>
                                    <ScrollView style={styles.wrapChoseProfile}>
                                        {this.viewListItemLimit()}
                                    </ScrollView>
                                    <View style={styles.groupButton}>
                                        <TouchableOpacity onPress={() => this.closeModal()} style={styles.btnClose}>
                                            {/* <IconColse size={Size.iconSize} color={Colors.white} /> */}
                                            <VnrText
                                                style={[styleSheets.lable, { color: Colors.greySecondary }]}
                                                i18nKey={'Cancel'}
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
        alignItems: 'center',
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 1
    },
    groupButton: {
        flexGrow: 1,
        flexDirection: 'row',
        // borderTopWidth: 0.5,
        // borderTopColor: Colors.grey,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: Size.defineSpace,
        backgroundColor: Colors.white,
        marginTop: 10,
        marginBottom: 10
    },
    btnClose: {
        height: Size.heightButton,
        backgroundColor: Colors.borderColor,
        borderRadius: styleSheets.radius_5,
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
    },
    wrapChoseProfile: {
        flex: 1, flexDirection: 'row'
    },

    btnAddMoreProfiles: {
        flex: 1,
        flexDirection: 'row',
        backgroundColor: Colors.orange,
        justifyContent: 'center',
        padding: 15,
        paddingBottom: 8,
        paddingTop: 8,
        marginLeft: 5,
        alignItems: 'center'
    },
    coating: {
        flex: 1,
        backgroundColor: Colors.black,
        opacity: 0.1
    },
    wrapRenderError: { flexGrow: 5, flexDirection: 'column' },
    btnAddMoreProfilesExcludeProfile: {
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
