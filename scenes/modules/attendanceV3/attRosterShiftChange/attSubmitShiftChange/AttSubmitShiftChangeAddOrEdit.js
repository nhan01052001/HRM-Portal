import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    Image,
    FlatList,
    Modal,
    KeyboardAvoidingView,
    Platform,
    StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
    styleSheets,
    Size,
    Colors,
    CustomStyleSheet,
    styleValid
} from '../../../../../constants/styleConfig.js';
import { IconCloseCircle, IconCancel } from '../../../../../constants/Icons.js';
import VnrText from '../../../../../components/VnrText/VnrText.js';
import HttpService from '../../../../../utils/HttpService.js';
import { ToasterSevice, ToasterInModal } from '../../../../../components/Toaster/Toaster.js';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages.js';
import moment from 'moment';
import { translate } from '../../../../../i18n/translate.js';
import { AlertInModal } from '../../../../../components/Alert/Alert.js';
import { EnumName, EnumIcon, ScreenName } from '../../../../../assets/constant.js';
import { dataVnrStorage } from '../../../../../assets/auth/authentication.js';
import VnrDateFromTo from '../../../../../componentsV3/VnrDateFromTo/VnrDateFromTo.js';
import AttSubmitShiftChangeComponent from './AttSubmitShiftChangeComponent.js';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit.js';
import VnrLoadApproval from '../../../../../componentsV3/VnrLoadApproval/VnrLoadApproval.js';
import VnrIndeterminate from '../../../../../components/VnrLoading/VnrIndeterminate.js';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile.js';
import ListButtonRegister from '../../../../../componentsV3/ListButtonRegister/ListButtonRegister.js';
import { AttSubmitShiftChangeBusinessFunction } from './AttSubmitShiftChangeBusiness.js';
import DrawerServices from '../../../../../utils/DrawerServices.js';
import VnrPickerWeekDays from '../../../../../componentsV3/VnrPickerWeekDays/VnrPickerWeekDays.js';
import { DATA_WEEKS } from '../../../../../componentsV3/VnrPickerWeekDays/VnrPickerWeekDays.js';

const API_APPROVE = {
    urlApi: '[URI_CENTER]/api/Att_GetData/GetMultiUserApproved',
    type: 'E_POST',
    dataBody: {
        text: '',
        Type: 'E_LEAVE_DAY'
    }
};

const initSateDefault = {
    isRefresh: false,
    Profile: {
        ID: 'e6f1d9ce-29e9-4681-a714-68b898a2c9c2',
        ProfileName: ''
    },
    UserApprove: {
        label: 'HRM_PortalApp_Approval_UserApproveID',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true,
        levelApproval: 1
    },
    UserApprove3: {
        label: 'HRM_PortalApp_Approval_UserApproveID2',
        disable: false,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true,
        levelApproval: 2
    },
    UserApprove4: {
        label: 'HRM_PortalApp_Approval_UserApproveID3',
        disable: false,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true,
        levelApproval: 3
    },
    UserApprove2: {
        label: 'HRM_PortalApp_Approval_UserApproveID4',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true,
        levelApproval: 4
    },
    fieldValid: {},
    ChangeShiftDate: {
        label: 'HRM_PortalApp_ShiftChangeDate',
        refresh: false,
        disable: false,
        value: null
    },
    params: null,
    isShowModal: false,
    isShowModalApprove: false,
    isShowLoading: false,
    fieldConfig: {
        ChangeShiftDate: {
            visibleConfig: true,
            isValid: true
        },
        RepeatWeek: {
            visibleConfig: true,
            isValid: false
        },
        Comment: {
            visibleConfig: true,
            isValid: false
        },
        FileAttach: {
            visibleConfig: true,
            isValid: false
        }
    },
    modalErrorDetail: {
        isModalVisible: false,
        cacheID: null,
        data: []
    },
    type: null,
    RepeatWeek: {
        label: 'HRM_PortalApp_Repeat',
        disable: false,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    DataChangeShiftDate: [],
    isDisableBtnSave: false,
    isHiddenButtonChangeData: PermissionForAppMobile &&
        PermissionForAppMobile.value['HRM_PortalV3_Att_RegisterChangeShift_ChkChangeSchedule'] &&
        PermissionForAppMobile.value['HRM_PortalV3_Att_RegisterChangeShift_ChkChangeSchedule']['View']
};

export const dataConvertDate = {
    0: 'HRM_Attendance_RosterGroup_SunShiftID|SunShift',
    1: 'HRM_Attendance_RosterGroup_MonShiftID|MonShift',
    2: 'HRM_Attendance_RosterGroup_TueShiftID|TueShift',
    3: 'HRM_Attendance_RosterGroup_WedShiftID|WedShift',
    4: 'HRM_Attendance_RosterGroup_ThuShiftID|ThuShift',
    5: 'HRM_Attendance_RosterGroup_FriShiftID|FriShift',
    6: 'HRM_Attendance_RosterGroup_SatShiftID|SatShift'
};

export default class AttSubmitShiftChangeAddOrEdit extends Component {
    constructor(props) {
        super(props);
        this.state = { ...initSateDefault };
        this.refVnrDateFromTo = null;
        this.refVnrDateFromTo2 = null;
        this.listRefGetDataSave = {};
        this.layoutHeightItem = null;
        // khai báo các biến this trong hàm setVariable
        this.setVariable();

        // props.navigation.setParams({
        //   title: props.navigation.state.params.record
        //     ? 'HRM_Category_ShiftItem_Overtime_Update_Title'
        //     : 'HRM_Category_ShiftItem_Overtime_Create_Title'
        // });

        // Bind the handleClick method in the constructor
        this.ToasterSeviceCallBack = this.ToasterSeviceCallBack.bind(this);
    }
    setVariable = () => {
        this.isRegisterHelp = null;
        this.isModify = false;
        this.hasChange = false;
        this.isChangeLevelApprove = false;
        this.isRegisterOrgOvertimeExcept = false;
        this.isRegisterOrgOvertime = false;
        this.levelApproveOT = 2;
        // Bao nhiêu cấp duyệt
        this.levelApprove = null;
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

        this.ToasterSevice = {
            showError: null,
            showSuccess: null,
            showWarning: null,
            showInfo: null
        };

        this.AlertSevice = {
            alert: null
        };

        // Thông báo chi tiết lỗi
        this.IsContinueSave = false;
        this.ProfileRemoveIDs = null;
        this.IsRemoveAndContinue = null;
        this.CacheID = null;
        this.refFlatList = null;
    };

    //#region [khởi tạo - check đăng ký hộ, lấy các dữ liệu cho control, lấy giá trị mặc đinh]
    refreshView = () => {
        // this.props.navigation.setParams({ title: 'HRM_Category_ShiftItem_Overtime_Create_Title' });
        this.setVariable();
        this.setState(initSateDefault, () => this.getConfigValid('Filter_Attendance_ChangeShift_List', true));
    };
    //promise get config valid

    getConfigValid = () => {
        let { fieldConfig } = this.state;
        const tblName = 'Filter_Attendance_ChangeShift_List';
        HttpService.Get(`[URI_CENTER]/api/Sys_common/GetValidateJson?listFormId=${tblName}`).then((res) => {
            const data = res.Status == EnumName.E_SUCCESS && res.Data && res.Data[tblName] ? res.Data[tblName] : null;
            if (data && Object.keys(data).length > 0) {
                [].forEach((key) => {
                    if (data[key] && data[key]['hasInApp']) {
                        const { validation } = data[key];
                        fieldConfig = {
                            ...fieldConfig,
                            [key]: {
                                visibleConfig: data[key] && data[key]['hidden'] == true ? false : true,
                                isValid: validation && validation.nullable == false ? true : false
                            }
                        };
                    }
                });
            }

            this.setState({
                fieldConfig,
                isHiddenButtonChangeData: PermissionForAppMobile &&
                    PermissionForAppMobile.value['HRM_PortalV3_Att_RegisterChangeShift_ChkChangeSchedule'] &&
                    PermissionForAppMobile.value['HRM_PortalV3_Att_RegisterChangeShift_ChkChangeSchedule']['View']
            }, () => {
                const { params } = this.state;

                let { record } = params;

                if (!record) {
                    // [CREATE] Step 3: Tạo mới
                    this.isModify = false;
                    this.initData();
                } else {
                    // [EDIT] Step 3: Chỉnh sửa
                    this.isModify = true;
                    this.getRecordAndConfigByID(record, this.handleSetState);
                }
            });
        });
    };

    handleSetState = (response) => {
        const {
            ChangeShiftDate,
            UserApprove,
            UserApprove3,
            UserApprove4,
            UserApprove2,
            isRefresh
        } = this.state;

        this.levelApprove = response.LevelApproved ? response.LevelApproved : 4;

        let nextState = {
            isShowModal: true,
            isRefresh: !isRefresh,
            type: response?.Type,
            ID: response.ID,
            Profile: {
                ID: response.ProfileID,
                ProfileName: response.ProfileName
            },
            UserApprove: {
                ...UserApprove,
                value: response.UserApproveID
                    ? {
                        UserInfoName: response.UserApproveName,
                        ID: response.UserApproveID,
                        AvatarURI: response.AvatarUserApprove1 ? response.AvatarUserApprove1 : null
                    }
                    : null,
                disable: true,
                refresh: !UserApprove.refresh
            },
            UserApprove3: {
                ...UserApprove3,
                value: response.UserApproveID3
                    ? {
                        UserInfoName: response.UserApproveName3,
                        ID: response.UserApproveID3,
                        AvatarURI: response.AvatarUserApprove2 ? response.AvatarUserApprove2 : null
                    }
                    : null,
                disable: true,
                refresh: !UserApprove3.refresh
            },
            UserApprove4: {
                ...UserApprove4,
                value: response.UserApproveID4
                    ? {
                        UserInfoName: response.UserApproveName4,
                        ID: response.UserApproveID4,
                        AvatarURI: response.AvatarUserApprove3 ? response.AvatarUserApprove3 : null
                    }
                    : null,
                disable: true,
                refresh: !UserApprove4.refresh
            },
            UserApprove2: {
                ...UserApprove2,
                value: response.UserApproveID2
                    ? {
                        UserInfoName: response.UserApproveName2,
                        ID: response.UserApproveID2,
                        AvatarURI: response.AvatarUserApprove4 ? response.AvatarUserApprove4 : null
                    }
                    : null,
                disable: true,
                refresh: !UserApprove2.refresh
            }
        };

        if (response?.DateEnd && response?.DateStart) {
            nextState = {
                ...nextState,
                ChangeShiftDate: {
                    ...ChangeShiftDate,
                    value: {
                        startDate: response?.DateStart,
                        endDate: response?.DateEnd
                    },
                    refresh: !ChangeShiftDate.refresh
                }
            };
        }

        if (this.levelApprove == 4) {
            nextState = {
                ...nextState,
                UserApprove: {
                    ...nextState.UserApprove,
                    levelApproval: 1
                },
                UserApprove3: {
                    ...nextState.UserApprove3,
                    visible: true,
                    levelApproval: 2
                },
                UserApprove4: {
                    ...nextState.UserApprove4,
                    visible: true,
                    levelApproval: 3
                },
                UserApprove2: {
                    ...nextState.UserApprove2,
                    levelApproval: 4
                }
            };
        } else if (this.levelApprove == 3) {
            nextState = {
                ...nextState,
                UserApprove: {
                    ...nextState.UserApprove,
                    levelApproval: 1
                },
                UserApprove3: {
                    ...nextState.UserApprove3,
                    visible: true,
                    levelApproval: 2
                },
                UserApprove4: {
                    ...nextState.UserApprove4,
                    visible: false
                },
                UserApprove2: {
                    ...nextState.UserApprove2,
                    levelApproval: 3
                }
            };
        } else {
            nextState = {
                ...nextState,
                UserApprove: {
                    ...nextState.UserApprove,
                    levelApproval: 1
                },
                UserApprove3: {
                    ...nextState.UserApprove3,
                    visible: false
                },
                UserApprove4: {
                    ...nextState.UserApprove4,
                    visible: false
                },
                UserApprove2: {
                    ...nextState.UserApprove2,
                    levelApproval: 2
                }
            };
        }

        this.setState(nextState, () => {
            (response?.Type === EnumName.E_CHANGE_SHIFT) ? this.onGetShiftByDate(response) : this.listRefGetDataSave['1']?.initState();
        });
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        // trường hợp có get config thì vào hàm này get
        _handleSetState(record);
    };
    //#endregion

    initData = () => {
        this.showLoading(false);
        const profileInfo = dataVnrStorage
            ? dataVnrStorage.currentUser
                ? dataVnrStorage.currentUser.info
                : null
            : null;

        const { E_ProfileID, E_FullName } = EnumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] };

        const { Profile } = this.state;

        let nextState = {
            Profile: {
                ...Profile,
                ..._profile
            }
        };

        this.setState(nextState, () => {
            //[CREATE] Step 4: Lấy cấp duyệt .
            this.GetHighSupervior();
            const { params } = this.state;

            if (params && params.listItem && params.listItem.length > 0) {
                let listday = params.listItem.map((item) => moment(item.WorkDate).format('YYYY-MM-DD'));
                if (Array.isArray(listday)) {
                    this.onChangeDateFromTo({
                        startDate: listday[0],
                        endDate: listday[listday.length - 1]
                    });
                }
            } else if (this.refVnrDateFromTo && this.refVnrDateFromTo.showModal) {
                // Show modal chọn ngày đăng ký
                this.refVnrDateFromTo.showModal();
            }
        });
    };

    GetHighSupervior = () => {
        const { Profile } = this.state;

        this.showLoading(true);
        HttpService.Post('[URI_CENTER]/api/Att_GetData/GetHighSupervisor', {
            ProfileID: Profile.ID,
            UserSubmit: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.userid : null,
            Type: 'E_ROSTER'
        }).then((resData) => {
            if (resData.Status == EnumName.E_SUCCESS) {
                const result = resData.Data;
                const { UserApprove, UserApprove2, UserApprove3, UserApprove4 } = this.state;
                let nextState = {
                    UserApprove: { ...UserApprove },
                    UserApprove2: { ...UserApprove2 },
                    UserApprove3: { ...UserApprove3 },
                    UserApprove4: { ...UserApprove4 }
                };

                //truong hop chạy theo approve grade
                if (result.LevelApprove > 0) {
                    if (result.IsChangeApprove != true) {
                        nextState = {
                            UserApprove: { ...nextState.UserApprove, disable: true },
                            UserApprove2: { ...nextState.UserApprove2, disable: true },
                            UserApprove3: { ...nextState.UserApprove3, disable: true },
                            UserApprove4: { ...nextState.UserApprove4, disable: true }
                        };
                    } else {
                        nextState = {
                            UserApprove: { ...nextState.UserApprove, disable: false },
                            UserApprove2: { ...nextState.UserApprove2, disable: false },
                            UserApprove3: { ...nextState.UserApprove3, disable: false },
                            UserApprove4: { ...nextState.UserApprove4, disable: false }
                        };
                    }

                    this.levelApprove = result.LevelApprove;

                    if (result.LevelApprove == 2 || result.LevelApprove == 1) {
                        if (result.IsOnlyOneLevelApprove) {
                            this.levelApprove = 1;
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
                            }

                            if (result.MidSupervisorID != null) {
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
                            }
                        }

                        nextState = {
                            ...nextState,
                            UserApprove: {
                                ...nextState.UserApprove,
                                levelApproval: 1
                            },
                            UserApprove3: {
                                ...nextState.UserApprove3,
                                visible: false,
                                levelApproval: 0
                            },
                            UserApprove4: {
                                ...nextState.UserApprove4,
                                visible: false,
                                levelApproval: 0
                            },
                            UserApprove2: {
                                ...nextState.UserApprove2,
                                levelApproval: 2
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
                        }

                        if (result.MidSupervisorID != null) {
                            nextState = {
                                ...nextState,
                                UserApprove3: {
                                    ...nextState.UserApprove3,
                                    value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
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
                        }

                        nextState = {
                            ...nextState,
                            UserApprove: {
                                ...nextState.UserApprove,
                                levelApproval: 1
                            },
                            UserApprove3: {
                                ...nextState.UserApprove3,
                                visible: true,
                                levelApproval: 2
                            },
                            UserApprove4: {
                                ...nextState.UserApprove4,
                                visible: false,
                                levelApproval: 3
                            },
                            UserApprove2: {
                                ...nextState.UserApprove2,
                                levelApproval: 4
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
                        }

                        if (result.MidSupervisorID != null) {
                            nextState = {
                                ...nextState,
                                UserApprove3: {
                                    ...nextState.UserApprove3,
                                    value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
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
                        }

                        if (result.HighSupervisorID) {
                            nextState = {
                                ...nextState,
                                UserApprove2: {
                                    ...nextState.UserApprove2,
                                    value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                                }
                            };
                        }

                        nextState = {
                            ...nextState,
                            UserApprove: {
                                ...nextState.UserApprove,
                                levelApproval: 1
                            },
                            UserApprove3: {
                                ...nextState.UserApprove3,
                                visible: true,
                                levelApproval: 2
                            },
                            UserApprove4: {
                                ...nextState.UserApprove4,
                                visible: true,
                                levelApproval: 3
                            },
                            UserApprove2: {
                                ...nextState.UserApprove2,
                                levelApproval: 4
                            }
                        };

                        // nextState = {
                        //     ...nextState,
                        //     isShowApprove3: true,
                        //     isShowApprove4: true
                        // }
                    }

                    if (result.IsChangeApprove != true) {
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
                            },
                            UserApprove4: {
                                ...nextState.UserApprove4,
                                disable: true
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
                    if (result.IsConCurrent) {
                        let dataFirstApprove = [],
                            dataMidApprove = [],
                            dataLastApprove = [];

                        for (let i = 0; i < result.ListSupervior.length; i++) {
                            dataFirstApprove.push({
                                UserInfoName: result.ListSupervior[i].SupervisorName,
                                ID: result.ListSupervior[i].SupervisorID
                            });
                        }

                        for (let i = 0; i < result.ListHightSupervior.length; i++) {
                            dataMidApprove.push({
                                UserInfoName: result.ListHightSupervior[i].HighSupervisorName,
                                ID: result.ListHightSupervior[i].HighSupervisorID
                            });
                            dataLastApprove.push({
                                UserInfoName: result.ListHightSupervior[i].HighSupervisorName,
                                ID: result.ListHightSupervior[i].HighSupervisorID
                            });
                        }

                        nextState = {
                            ...nextState,
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
                            }
                        };
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
                        if (result.HighSupervisorID != null) {
                            nextState = {
                                ...nextState,
                                UserApprove2: {
                                    ...nextState.UserApprove2,
                                    value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                                }
                            };
                        } else {
                            nextState = {
                                ...nextState,
                                UserApprove2: {
                                    ...nextState.UserApprove2,
                                    value: null
                                }
                            };
                        }
                        if (result.MidSupervisorID != null) {
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
                        if (result.IsChangeApprove != true) {
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
                }

                nextState = {
                    ...nextState,
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

                this.setState(nextState, () => { });
            }
            this.showLoading(false);
        });
    };

    refreshForm = () => {
        this.AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            title: 'HRM_PortalApp_OnReset',
            message: 'HRM_PortalApp_OnReset_Message',
            onCancel: () => { },
            onConfirm: () => {
                const { DataChangeShiftDate, type } = this.state;

                if (DataChangeShiftDate.length > 0) {
                    const {
                        params } = this.state;

                    let { record } = params;

                    if (!record) {
                        // nếu bấm refresh lấy lại cấp duyệt
                        this.GetHighSupervior();
                        this.initData();
                    } else {
                        // Nếu bấm refresh khi Chỉnh sửa
                        this.isModify = true;
                        this.getRecordAndConfigByID(record, this.handleSetState);
                    }

                    if (type === EnumName.E_CHANGE_SHIFT) {
                        DataChangeShiftDate.map((item) => {
                            this.listRefGetDataSave[item.ID].unduData();
                        });
                    } else {
                        this.listRefGetDataSave['1'].unduData();
                    }
                }
            }
        });
    };

    //#endregion

    //#region [lưu]
    onSaveAndSend = () => {
        this.onSave(true);
    };

    onSaveTemp = () => {
        this.AlertSevice.alert({
            iconType: EnumIcon.E_CONFIRM,
            title: 'HRM_PortalApp_OnSave_Temp',
            message: 'HRM_PortalApp_OnSave_Temp_Message',
            onCancel: () => { },
            onConfirm: () => {
                this.onSave();
            }
        });
    };

    onSave = (isSend) => {
        let lstRosterItem = [],
            isDataComplete = true,
            objWeekDay = {};
        const {
                Profile,
                UserApprove,
                UserApprove2,
                UserApprove3,
                UserApprove4,
                modalErrorDetail,
                ChangeShiftDate,
                DataChangeShiftDate,
                type,
                RepeatWeek,
                params } = this.state,
            { record } = params;
        let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });

        if (type === EnumName.E_CHANGE_SHIFT) {
            DataChangeShiftDate.map((item) => {
                if (!item?.isDisable) {
                    const data = this.listRefGetDataSave[item.ID].getAllData();
                    if (data) {
                        objWeekDay = {
                            ...objWeekDay,
                            [`${item.key}ID`]: data.ShiftID,
                            Comment: data?.Comment,
                            FileAttach: data?.FileAttach
                        };
                        lstRosterItem.push({
                            ...data
                        });
                    } else {
                        isDataComplete = false;
                    }
                }
            });
        } else {
            const data = this.listRefGetDataSave['1'].getAllData();
            if (data) {
                objWeekDay = {
                    ...data,
                    DateEnd: ChangeShiftDate.value?.endDate ? `${moment(ChangeShiftDate.value?.endDate).format('YYYY/MM/DD')}` : null,
                    DateStart: ChangeShiftDate.value?.startDate ? `${moment(ChangeShiftDate.value?.startDate).format('YYYY/MM/DD')}` : null
                };
                lstRosterItem = [];
            } else {
                isDataComplete = false;
            }
        }

        const ListRosterItem = [
            {
                ID: record?.ID ? record.ID : uuid,
                ProfileID: Profile.ID,
                DateEnd: ChangeShiftDate.value?.endDate ? `${moment(ChangeShiftDate.value?.endDate).format('YYYY/MM/DD')} 23:59:59` : null,
                DateStart: ChangeShiftDate.value?.startDate ? `${moment(ChangeShiftDate.value?.startDate).format('YYYY/MM/DD')} 00:00:00` : null,
                Type: type,
                LevelApproved: this.levelApprove,
                IsRepeatWeek: RepeatWeek.value?.length > 0,
                IsRepeatAllWeek: RepeatWeek.value?.length === 7,
                ChangeShiftID: null,
                // AlternateShiftID: null,
                UserSubmit: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.userid : null,
                IsSubstitute: false,
                ListRosterChangeShiftDetail: RepeatWeek.value?.length > 0 ? [] : lstRosterItem,
                ...objWeekDay
            }
        ];

        let payload = {
            ProfileRemoveIDs: this.ProfileRemoveIDs,
            IsRemoveAndContinue: this.IsRemoveAndContinue,
            CacheID: this.CacheID,
            IsContinueSave: this.IsContinueSave,
            Host: dataVnrStorage?.apiConfig?.uriPor,
            UserSubmit: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.userid : null
        };

        if (ListRosterItem?.length > 0 && isDataComplete) {
            payload = {
                ...payload,
                ProfileIDs: Profile.ID,
                // Lý do gán lại cấp duyệt thứ tự 1.2.3.4 là do server tự gán lại theo thứ tự 1.3.4.2
                UserApproveID: UserApprove && UserApprove.value ? UserApprove.value.ID : null,
                UserApproveID2: UserApprove3 && UserApprove3.value ? UserApprove3.value.ID : null,
                UserApproveID3: UserApprove4 && UserApprove4.value ? UserApprove4.value.ID : null,
                UserApproveID4: UserApprove2 && UserApprove2.value ? UserApprove2.value.ID : null,
                ListRosterItem: ListRosterItem
            };

            if (isSend) {
                payload = {
                    ...payload,
                    IsAddNewAndSendMail: true
                };
                AttSubmitShiftChangeBusinessFunction.checkForReLoadScreen[ScreenName.AttSubmitShiftChange] = true;
                AttSubmitShiftChangeBusinessFunction.checkForReLoadScreen[ScreenName.AttApproveSubmitShiftChange] =
                    true;
                AttSubmitShiftChangeBusinessFunction.checkForReLoadScreen[ScreenName.AttSaveTempSubmitShiftChange] =
                    true;
            }

            if (this.isModify === true && params && record) {
                payload = {
                    ...payload,
                    ID: record.ID,
                    Status: record.Status,
                    userSubmit: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.userid : null
                };
            }
            this.isProcessing = true;
            this.showLoading(true);
            HttpService.Post('[URI_CENTER]/api/Att_Roster/CreateOrUpdateRoster', payload).then((res) => {
                this.isProcessing = false;
                this.showLoading(false);
                if (res && typeof res === EnumName.E_object) {
                    if (res.Status == EnumName.E_SUCCESS) {
                        this.onClose();

                        ToasterSevice.showSuccess('Hrm_Succeed', 5500);

                        const { reload } = params;
                        if (reload && typeof reload === 'function') {
                            reload();
                        }
                    } else if (res.Status == EnumName.E_FAIL) {
                        if (res.Data) {
                            if (res.Data.IsBlock == true) {
                                if (res.Data.IsRemoveAndContinue) {
                                    this.AlertSevice.alert({
                                        title: translate('Hrm_Notification'),
                                        iconType: EnumIcon.E_WARNING,
                                        message: translate('HRM_Attendance_Message_InvalidRequestDataPleaseCheckAgain'),
                                        //lưu và tiếp tục
                                        colorSecondConfirm: Colors.primary,
                                        textSecondConfirm: translate('Button_OK'),
                                        onSecondConfirm: () => {
                                            this.ProfileRemoveIDs = res.Data.ProfileRemoveIDs;
                                            this.IsRemoveAndContinue = true;
                                            this.CacheID = res.Data.CacheID;
                                            this.onSave(isSend);
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
                                                        cacheID: res.Data.CacheID,
                                                        isModalVisible: true
                                                    }
                                                },
                                                () => {
                                                    this.getErrorMessageRespone();
                                                }
                                            );
                                        }
                                    });
                                } else {
                                    this.AlertSevice.alert({
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
                                                        cacheID: res.Data.CacheID,
                                                        isModalVisible: true
                                                    }
                                                },
                                                () => {
                                                    this.getErrorMessageRespone();
                                                }
                                            );
                                        }
                                    });
                                }
                            } else {
                                this.AlertSevice.alert({
                                    title: translate('Hrm_Notification'),
                                    iconType: EnumIcon.E_WARNING,
                                    message: translate('HRM_Attendance_Message_InvalidRequestDataDoYouWantToSave'),
                                    //lưu và tiếp tục
                                    colorSecondConfirm: Colors.primary,
                                    textSecondConfirm: translate('Button_OK'),
                                    onSecondConfirm: () => {
                                        this.IsContinueSave = true;
                                        this.ProfileRemoveIDs = res.Data.ProfileRemoveIDs;
                                        this.IsRemoveAndContinue = true;
                                        this.CacheID = res.Data.CacheID;
                                        this.onSave(isSend);
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
                                                    cacheID: res.Data.CacheID,
                                                    isModalVisible: true
                                                }
                                            },
                                            () => {
                                                this.getErrorMessageRespone();
                                            }
                                        );
                                    }
                                });
                            }
                        } else if (res.Message) {
                            this.ToasterSevice.showWarning(res.Message, 4000);
                        }
                    } else if (res.Status == 'Hrm_Locked') {
                        this.ToasterSevice.showWarning('Hrm_Locked', 4000);
                    } else if (res.Status == 'INVALID_REQUEST_VALIDATOR') {
                        this.ToasterSevice.showError(res?.Data[0]?.description, 4000);
                    } else if (res.Message) {
                        this.ToasterSevice.showWarning(res.Message, 4000);
                    }
                }
            });
        }
    };
    //#endregion

    // nhan new
    onChangeDateFromTo = async (range) => {
        const { ChangeShiftDate, isRefresh, isShowModal, RepeatWeek } = this.state;
        this.listRefGetDataSave = {};

        // nếu range không là array thì là đổi ca ngược lại là đổi lịch
        let type = !Array.isArray(range) ? EnumName.E_CHANGE_SHIFT : EnumName.E_CHANGE_SHIFT_COMPANSATION;
        if (Array.isArray(range)) {
            range = {
                startDate: range[0],
                endDate: range[range.length - 1]
            };
        }

        let nextState = {
            ChangeShiftDate: {
                ...ChangeShiftDate,
                value: range,
                refresh: !ChangeShiftDate.refresh
            },
            isRefresh: !isRefresh,
            type,
            RepeatWeek: {
                ...RepeatWeek,
                value: null,
                refresh: !RepeatWeek.refresh
            }
        };

        if (!isShowModal) {
            nextState = {
                ...nextState,
                isShowModal: true
            };
        }

        this.setState(nextState, () => {
            (this.state.type === EnumName.E_CHANGE_SHIFT) ? this.onGetShiftByDate() : this.listRefGetDataSave['1']?.initState();
        });
    };

    onGetShiftByDate = (response = null) => {
        try {
            const { ChangeShiftDate, type, Profile, isRefresh, RepeatWeek } = this.state;
            if (Profile.ID && ChangeShiftDate.value) {
                let payload = {};
                if (type === EnumName.E_CHANGE_SHIFT) {
                    payload = {
                        DateEnd: `${moment(ChangeShiftDate.value?.endDate).format('YYYY/MM/DD')} 23:59:59`,
                        DateStart: `${moment(ChangeShiftDate.value?.startDate).format('YYYY/MM/DD')} 00:00:00`,
                        IsDateEnd: true,
                        IsDateStart: true,
                        ProfileID: Profile.ID,
                        Type: EnumName.E_CHANGE_SHIFT
                    };
                } else {
                    payload = {
                        DateEnd: `${moment(ChangeShiftDate.value[ChangeShiftDate.value.length - 1]).format('YYYY/MM/DD')}`,
                        DateStart: `${moment(ChangeShiftDate.value[0]).format('YYYY/MM/DD')}`,
                        IsDateEnd: true,
                        IsDateStart: true,
                        ProfileID: Profile.ID,
                        Type: EnumName.E_CHANGE_SHIFT_COMPANSATION
                    };
                }

                const days = this.handleSplitDay(ChangeShiftDate.value);
                let weekdays = [];
                if (Array.isArray(days) && days.length > 0) {
                    if (days.length > 7) {
                        const groupDates = this.groupDateByWeekday(days);
                        for (let i = 0; i < 7; i++) {
                            let itemConvertDate = dataConvertDate[i].split('|'),
                                weekday = translate(itemConvertDate[0]);
                            weekdays.push({
                                ID: i === 0 ? 8 : i + 1,
                                weekday: weekday,
                                Text: `${weekday} - ${Array.isArray(groupDates[i])
                                    ? groupDates[i].map((item) => {
                                        return moment(item).format('DD/MM/YYYY');
                                    }).join(', ')
                                    : moment(groupDates[i]).format('DD/MM/YYYY')}`,
                                numberWeekday: i,
                                rootdate: moment(groupDates[i]).format('YYYY/MM/DD'),
                                key: itemConvertDate[1]
                            });
                        }
                    } else {
                        days.map((item) => {
                            let itemConvertDate = dataConvertDate[moment(item).weekday()].split('|'),
                                weekday = translate(itemConvertDate[0]);
                            weekdays.push({
                                ID: moment(item).weekday() === 0 ? 8 : moment(item).weekday() + 1,
                                weekday: weekday,
                                Text: `${weekday} - ${moment(item).format('DD/MM/YYYY')}`,
                                numberWeekday: moment(item).weekday(),
                                rootdate: moment(item).format('YYYY/MM/DD'),
                                key: itemConvertDate[1]
                            });
                        });
                    }
                }

                let nextState = {
                    isDisableBtnSave: false
                };
                if (weekdays.length > 0) {
                    weekdays.sort((a, b) => a.ID - b.ID);
                    if (days.length > 7) {
                        const DATA_WEEKS_BK = [...DATA_WEEKS];
                        DATA_WEEKS_BK.forEach((item) => {
                            item.isChecked = true;
                        });

                        nextState = {
                            ...nextState,
                            RepeatWeek: {
                                ...RepeatWeek,
                                value: DATA_WEEKS_BK,
                                isRefresh: !RepeatWeek.refresh,
                                visible: true
                            }
                        };
                    }
                }

                // case modify just need take DateStart/DateEnd from edit, not need format
                if (this.isModify) {
                    payload = {
                        ...payload,
                        DateEnd: ChangeShiftDate.value?.endDate,
                        DateStart: ChangeShiftDate.value?.startDate
                    };
                }

                // VnrLoadingSevices.show();
                HttpService.Post('[URI_CENTER]/api/Att_Roster/GetShiftByDate', payload)
                    .then((res) => {
                        VnrLoadingSevices.hide();
                        let finalData = [];
                        if (res && res?.Status === EnumName.E_SUCCESS && Object.keys(res?.Data).length > 0) {
                            if (res?.Data?.Message) {
                                this.setState({
                                    ...nextState,
                                    DataChangeShiftDate: weekdays,
                                    isDisableBtnSave: true,
                                    isRefresh: !isRefresh
                                }, () => {
                                    this.ToasterSevice.showWarning(res?.Data?.Message);
                                });
                                return;
                            }
                            weekdays.map((item) => {
                                finalData.push({
                                    ...item,
                                    value: {
                                        ShiftID: res?.Data[`${item.key}ID`],
                                        ShiftName: res?.Data[`${item.key}Name`],
                                        ListShift: res?.Data[`List${item.key}`],
                                        key: item.key
                                    }
                                });
                            });
                        } else {
                            nextState = {
                                ...nextState,
                                isDisableBtnSave: true
                            };
                        }

                        if (finalData.length > 0 && this.isModify && response) {
                            finalData = finalData.map((item) => {
                                if (response[`${item?.key}ID`])
                                    return {
                                        ...item,
                                        [`Item${item.ID}`]: {
                                            ID: response[`${item?.key}ID`],
                                            ShiftName: response[`${item?.key}Name`],
                                            'ShiftID': response[`${item?.key}ID`],
                                            'DateShift': item.rootdate,
                                            'DayOfWeek': item.numberWeekday
                                        }
                                    };
                                return { ...item };
                            });
                        }

                        this.setState({
                            ...nextState,
                            DataChangeShiftDate: finalData,
                            isRefresh: !isRefresh
                        });
                    })
                    .catch(() => {
                        VnrLoadingSevices.hide();
                    });
            }
        } catch (error) {
            VnrLoadingSevices.hide();
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    onClose = () => {
        const { ChangeShiftDate } = this.state;
        this.setVariable();
        this.setState({
            ...initSateDefault,
            isShowModal: false,
            ChangeShiftDate: {
                ...ChangeShiftDate,
                value: null,
                refresh: !ChangeShiftDate.refresh
            }
        });
    };

    // Step 1: Gọi hàm onShow để tạo mới hoặc chỉnh sửa hoặc onShowFromWorkDay để tạo mới
    onShow = (params) => {
        this.setState(
            {
                ...{ ...initSateDefault },
                params: params
            },
            () => {
                // Step 2: Lấy cấu hình ẩn hiện
                this.getConfigValid();
            }
        );
    };

    renderApprove = () => {
        return (
            <View style={styleComonAddOrEdit.styViewApprove}>
                <TouchableOpacity
                    style={styleComonAddOrEdit.styBtnShowApprove}
                    onPress={() => {
                        this.setState({
                            isShowModalApprove: true
                        });
                    }}
                >
                    <Image
                        source={require('../../../../../assets/images/vnrDateFromTo/circle.png')}
                        style={{ marginRight: Size.defineHalfSpace }}
                    />
                    <VnrText style={[styleSheets.text]} i18nKey={'HRM_PortalApp_Approval_Process'} />
                    <Text style={[styleSheets.text, CustomStyleSheet.fontWeight('700')]}>
                        {` ${this.levelApprove ? this.levelApprove : '0'} ${translate('HRM_PortalApp_Approval_Level')}`}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    };

    showLoading = (isShow) => {
        this.setState({
            isShowLoading: isShow
        });
    };

    _renderHeaderLoading = () => {
        if (this.state.isShowLoading) {
            return (
                <View style={styleComonAddOrEdit.styLoadingHeader}>
                    <View style={styleComonAddOrEdit.styViewLoading} />
                    <VnrIndeterminate isVisible={this.state.isShowLoading} />
                </View>
            );
        } else return <View />;
    };

    ToasterSeviceCallBack = () => {
        return this.ToasterSevice;
    };

    onDeleteItemDay = (index) => {
        this.AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            title: 'HRM_PortalApp_OnDeleteItemDay',
            textRightButton: 'Confirm',
            onCancel: () => { },
            onConfirm: () => {
                const { ChangeShiftDate } = this.state;
                if (ChangeShiftDate.value && Array.isArray(ChangeShiftDate.value) && ChangeShiftDate.value.length > 1) {
                    if (this.listRefGetDataSave[ChangeShiftDate.value[index]]) {
                        delete this.listRefGetDataSave[ChangeShiftDate.value[index]];
                    }
                    // Xóa
                    ChangeShiftDate.value.splice(index, 1);

                    this.setState({
                        ChangeShiftDate: {
                            ...ChangeShiftDate,
                            value: ChangeShiftDate.value,
                            refresh: !ChangeShiftDate.refresh
                        }
                    });
                }
            }
        });
    };

    getErrorMessageRespone() {
        const { modalErrorDetail, Profile } = this.state,
            { cacheID } = modalErrorDetail;

        if (cacheID) {
            this.showLoading(true);
            HttpService.Post('[URI_CENTER]/api/Att_GetData/GetErrorMessageRespone', {
                cacheID: cacheID,
                IsPortal: true,
                ProfileID: Profile.ID
            }).then((res) => {
                this.showLoading(false);
                if (res && res.Data && res.Status == EnumName.E_SUCCESS) {
                    const data = res.Data.Data;
                    this.setState({
                        modalErrorDetail: {
                            ...modalErrorDetail,
                            data: data
                        }
                    });
                }
            });
        }
    }

    renderErrorDetail = () => {
        const { modalErrorDetail } = this.state,
            { data } = modalErrorDetail;

        if (data && data.length > 0) {
            const dataGroup = this.groupByMessage(data, 'MessageName'),
                dataSourceError = this.mappingDataGroup(dataGroup);

            return dataSourceError.map((dataItem, index) => {
                let viewContent = <View />;
                if (dataItem['Type'] && dataItem['Type'] == 'E_GROUP') {
                    viewContent = (
                        <View style={styleComonAddOrEdit.styleViewTitleGroup}>
                            <VnrText
                                style={[styleSheets.lable, styleComonAddOrEdit.styFontErrTitle]}
                                i18nKey={dataItem['TitleGroup']}
                            />
                        </View>
                    );
                } else {
                    viewContent = (
                        <View style={styleComonAddOrEdit.styFontErrInfo}>
                            <View style={styleComonAddOrEdit.styFontErrLine}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    i18nKey={'HRM_PortalApp_Message_ErrorCodeEmp'}
                                />

                                <View style={styleComonAddOrEdit.styFontErrVal}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    >
                                        {dataItem['CodeEmp']}
                                    </Text>
                                </View>
                            </View>

                            <View style={styleComonAddOrEdit.styFontErrLine}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    i18nKey={'HRM_PortalApp_Message_ErrorProfileName'}
                                />

                                <View style={styleComonAddOrEdit.styFontErrVal}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    >
                                        {dataItem['ProfileName']}
                                    </Text>
                                </View>
                            </View>

                            <View style={styleComonAddOrEdit.styFontErrLine}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    i18nKey={'HRM_PortalApp_Message_ErrorDescription'}
                                />

                                <View style={[styleComonAddOrEdit.styFontErrVal, CustomStyleSheet.marginLeft(6)]}>
                                    <Text style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}>
                                        {dataItem['ErrorDescription']}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    );
                }

                return (
                    <View
                        key={index}
                        style={[
                            styleComonAddOrEdit.styleViewNoBorder,
                            dataSourceError.length - 1 == index && styleComonAddOrEdit.styleViewNoBorder
                        ]}
                    >
                        {viewContent}
                    </View>
                );
            });
        } else {
            return (
                <View style={styles.noData}>
                    <Text style={[styleComonAddOrEdit.styHeaderText, { color: Colors.white }]}>
                        {translate('HRM_HR_NoneData')}
                    </Text>
                </View>
            );
        }
    };

    groupByMessage = (array, key) => {
        // Return the end result
        return array.reduce((result, currentValue) => {
            // If an array already present for key, push it to the array. Else create an array and push the object
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            // Return the current iteration `result` value, this will be taken as next iteration `result` value and accumulate
            return result;
        }, {}); // empty object is the initial value for result object
    };

    mappingDataGroup = (dataGroup) => {
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

    handleUpdateDateShiftChange = (value, index) => {
        const { ChangeShiftDate } = this.state;

        let valueTemp = value && Array.isArray(value) ? value[0] : value;
        if (Array.isArray(ChangeShiftDate.value) && ChangeShiftDate.value.length > 0) {
            if (ChangeShiftDate.value.includes(valueTemp)) {
                let textError = translate('HRM_ProtalApp_SamDayOfShiftChange');
                textError = textError.replace('[E_DAY]', moment(new Date(valueTemp)).format('DD/MM/YYYY'));
                this.ToasterSevice.showWarning(textError);
            } else {
                let arrTemp =
                    Array.isArray(ChangeShiftDate.value) && ChangeShiftDate.value.length > 0
                        ? ChangeShiftDate.value
                        : [];
                arrTemp[index] = valueTemp;
                this.onChangeDateFromTo(arrTemp);
            }
        }
    };

    onScrollToInputIOS = (index, height) => {
        try {
            if (this.refFlatList && this.refFlatList.scrollToOffset && index && height) {
                setTimeout(() => {
                    this.refFlatList.scrollToOffset({ animated: true, offset: height * index - 200 });
                }, 260);
            }
        } catch (error) {
            //
        }
    };

    renderItems = () => {
        const {
            ChangeShiftDate,
            isRefresh,
            fieldConfig,
            params,
            type,
            RepeatWeek,
            DataChangeShiftDate,
            isHiddenButtonChangeData
        } = this.state;
        if (ChangeShiftDate.value) {
            const days = this.handleSplitDay(ChangeShiftDate.value);
            return (
                <FlatList
                    ref={(refs) => (this.refFlatList = refs)}
                    style={styles.styFlatListContainer}
                    data={
                        type === EnumName.E_CHANGE_SHIFT && DataChangeShiftDate.length > 0 ? DataChangeShiftDate : [1]
                    }
                    renderItem={({ item, index }) => (
                        <View
                            key={item === 1 ? item : item?.ID}
                        >
                            <AttSubmitShiftChangeComponent
                                ref={(ref) => {
                                    this.listRefGetDataSave[`${item === 1 ? 1 : item.ID}`] = ref;
                                }}
                                type={type}
                                onScrollToInputIOS={this.onScrollToInputIOS}
                                workDayRoot={ChangeShiftDate.value}
                                isRefresh={isRefresh}
                                record={params?.record}
                                fieldConfig={fieldConfig}
                                value={item === 1 ? (days ? days : {}) : item}
                                showLoading={this.showLoading}
                                onDisableButtonSave={this.setDisableBtnSave}
                                ToasterSevice={this.ToasterSeviceCallBack}
                                index={index}
                                length={type === EnumName.E_CHANGE_SHIFT && DataChangeShiftDate.length > 0 ? DataChangeShiftDate : [1]}
                            />
                        </View>
                    )}
                    keyExtractor={(item, index) => index}
                    ListFooterComponent={this.renderApprove}
                    ListHeaderComponent={() => {
                        let valueChangeShiftDate = ChangeShiftDate.value;
                        if (type !== EnumName.E_CHANGE_SHIFT)
                            valueChangeShiftDate = [ChangeShiftDate.value?.startDate, ChangeShiftDate.value?.endDate];

                        return (
                            <View style={CustomStyleSheet.backgroundColor(Colors.white)}>
                                <View>
                                    <View
                                        style={{
                                            paddingHorizontal: Size.defineSpace,
                                            paddingVertical: Size.defineHalfSpace
                                        }}
                                    >
                                        <VnrText
                                            style={[styleSheets.lable, styles.styLableGp]}
                                            i18nKey={'HRM_PortalApp_LableTime'}
                                        />
                                    </View>

                                    <View style={styles.container}>
                                        <VnrDateFromTo
                                            ref={(ref) => (this.refVnrDateFromTo2 = ref)}
                                            isHiddenIcon={true}
                                            fieldValid={fieldConfig?.ChangeShiftDate?.isValid}
                                            lable={ChangeShiftDate.label}
                                            refresh={ChangeShiftDate.refresh}
                                            value={valueChangeShiftDate}
                                            displayOptions={true}
                                            onlyChooseEveryDay={false}
                                            isChangeShiftorChangeSchedule={true}
                                            isControll={true}
                                            isHiddenChooseEveryDay={!isHiddenButtonChangeData}
                                            isHiddenChooseAboutDays={false}
                                            onFinish={(value) => {
                                                this.onChangeDateFromTo(value);
                                            }}
                                        />
                                    </View>

                                    {
                                        type !== EnumName.E_CHANGE_SHIFT ? (
                                            <View>
                                                <TouchableOpacity
                                                    style={stylesCustom.viewDate}
                                                    onPress={() => {
                                                        this.refVnrDateFromTo2.showModal();
                                                    }}
                                                >
                                                    <View>
                                                        <Text style={[styleSheets.text, stylesCustom.textLabelDate]}>{translate(ChangeShiftDate.label)}
                                                            {
                                                                fieldConfig?.ChangeShiftDate?.isValid && (
                                                                    <Text style={[styleSheets.text, styleValid]}>*</Text>
                                                                )
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View>
                                                        <Text style={[styleSheets.text, stylesCustom.textDate]}>{ChangeShiftDate.value?.startDate ? moment(ChangeShiftDate.value?.startDate).format('DD/MM/YYYY') : translate('SELECT_ITEM')}</Text>
                                                    </View>
                                                </TouchableOpacity>

                                                <TouchableOpacity
                                                    style={stylesCustom.viewDate}
                                                    onPress={() => {
                                                        this.refVnrDateFromTo2.showModal(true);
                                                    }}
                                                >
                                                    <View>
                                                        <Text
                                                            style={[styleSheets.text, stylesCustom.textLabelDate]}
                                                        >{translate('HRM_PortalApp_TheReplacementDay')}
                                                            {
                                                                fieldConfig?.ChangeShiftDate?.isValid && (
                                                                    <Text style={[styleSheets.text, styleValid]}>*</Text>
                                                                )
                                                            }
                                                        </Text>
                                                    </View>
                                                    <View>
                                                        <Text style={[styleSheets.text, stylesCustom.textDate]}>{ChangeShiftDate.value?.endDate ? moment(ChangeShiftDate.value?.endDate).format('DD/MM/YYYY') : translate('SELECT_ITEM')}</Text>
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                        ) : (
                                            <VnrDateFromTo
                                                isHiddenIcon={true}
                                                fieldValid={fieldConfig?.ChangeShiftDate?.isValid}
                                                lable={ChangeShiftDate.label}
                                                refresh={ChangeShiftDate.refresh}
                                                value={valueChangeShiftDate}
                                                displayOptions={true}
                                                onlyChooseEveryDay={false}
                                                isChangeShiftorChangeSchedule={true}
                                                isControll={true}
                                                isHiddenChooseEveryDay={!isHiddenButtonChangeData}
                                                isHiddenChooseAboutDays={false}
                                                onFinish={(value) => {
                                                    this.onChangeDateFromTo(value);
                                                }}
                                            />
                                        )
                                    }
                                </View>

                                {(type === EnumName.E_CHANGE_SHIFT) && (
                                    <View>
                                        <View>
                                            {
                                                (RepeatWeek.visible && RepeatWeek.visibleConfig) && (
                                                    <VnrPickerWeekDays
                                                        isCheckEmpty={fieldConfig?.RepeatWeek?.isValid}
                                                        refresh={RepeatWeek.refresh}
                                                        value={Array.isArray(RepeatWeek.value) ? RepeatWeek.value : []}
                                                        textField="Text"
                                                        valueField="Value"
                                                        filter={false}
                                                        disable={RepeatWeek.disable}
                                                        lable={RepeatWeek.label}
                                                        isCheckAll={DataChangeShiftDate.length === 7}
                                                        onFinish={(item, objClose) => {
                                                            if (objClose?.isClose)
                                                                return;
                                                            let nextState = {};
                                                            if (Array.isArray(item) && item.length > 0 && DataChangeShiftDate.length === 7) {
                                                                DataChangeShiftDate.forEach((value) => {
                                                                    if (item.some((element) => element?.numberWeekday === value?.numberWeekday)) {
                                                                        value.isDisable = false;
                                                                    } else {
                                                                        value.isDisable = true;
                                                                    }
                                                                });
                                                                nextState = {
                                                                    DataChangeShiftDate: [...DataChangeShiftDate],
                                                                    isRefresh: !isRefresh
                                                                };
                                                            }

                                                            this.setState({
                                                                ...nextState,
                                                                RepeatWeek: {
                                                                    ...RepeatWeek,
                                                                    value: item,
                                                                    refresh: !RepeatWeek.refresh
                                                                }
                                                            });
                                                        }}
                                                    />
                                                )
                                            }
                                        </View>
                                        <View>
                                            <View
                                                style={{
                                                    paddingHorizontal: Size.defineSpace,
                                                    paddingVertical: Size.defineHalfSpace
                                                }}
                                            >
                                                <VnrText
                                                    style={[styleSheets.lable, styles.styLableGp]}
                                                    i18nKey={'HRM_PortalApp_AlternateShift'}
                                                />
                                                <VnrText
                                                    style={[
                                                        styleSheets.text,
                                                        { ...CustomStyleSheet.fontSize(Size.text - 1.5) }
                                                    ]}
                                                    i18nKey={'HRM_PortalApp_NotSelectRepeatShowWarning'}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                )}
                            </View>
                        );
                    }}
                />
            );
        }
    };

    onChangeUserApprove = (item) => {
        const { UserApprove, UserApprove2, UserApprove3, UserApprove4 } = this.state;

        let nextState = {
            UserApprove: {
                ...UserApprove,
                value: { ...item }
                //refresh: !UserApprove.refresh
            }
        };

        //nếu 1 cấp duyệt mới chạy
        if (this.levelApprove == 1) {
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

            if (!item) {
                nextState = {
                    ...nextState,
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
                nextState = {
                    ...nextState,
                    UserApprove2: {
                        ...UserApprove2,
                        value: { ...item },
                        refresh: !UserApprove2.refresh
                    },
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
        }

        this.setState(nextState);
    };

    //change duyệt cuối
    onChangeUserApprove2 = (item) => {
        const { UserApprove, UserApprove2, UserApprove3, UserApprove4 } = this.state;

        let nextState = {
            UserApprove2: {
                ...UserApprove2,
                value: { ...item },
                refresh: !UserApprove2.refresh
            }
        };

        //nếu 1 cấp duyệt mới chạy
        if (this.levelApprove == 1) {
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
                    UserApprove: {
                        ...UserApprove,
                        value: { ...item },
                        refresh: !UserApprove.refresh
                    },
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
        } else if (this.levelApprove == 2) {
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
        } else if (this.levelApprove == 3) {
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

    closeModalErrorDetail = () => {
        let nextState = {
            modalErrorDetail: {
                ...this.state.modalErrorDetail,
                isModalVisible: false
            }
        };

        this.setState(nextState);
    };

    handleSplitDay = (range) => {
        if (range && range.startDate && range.endDate) {
            let days = [];
            let start = new Date(moment(range.startDate).format('YYYY-MM-DD')).getTime();
            let end = new Date(moment(range.endDate || range.startDate).format('YYYY-MM-DD')).getTime();
            for (let cur = start; cur <= end; cur += 60 * 60 * 24000) {
                let curStr = new Date(cur).toISOString().substring(0, 10);
                days.push(curStr);
            }
            return days;
        }

        return range;
    };

    groupDateByWeekday = (dates = []) => {
        if ((!Array.isArray(dates) && dates.length > 0)) {
            return [];
        }

        const groups = dates.reduce((acc, date) => {
            // create a composed key: 'weekday'
            const weekday = `${moment(date).weekday()}`;

            // add this key as a property to the result object
            if (!acc[weekday]) {
                acc[weekday] = [];
            }

            // push the current date that belongs to the weekday calculated befor
            acc[weekday].push(moment(date).format('YYYY/MM/DD'));

            return acc;

        }, {});

        return groups;

    }

    setDisableBtnSave = (value) => {
        this.setState({
            isDisableBtnSave: value
        });
    }

    render() {
        const {
            UserApprove,
            UserApprove3,
            UserApprove4,
            UserApprove2,
            ChangeShiftDate,
            isShowModal,
            isShowModalApprove,
            modalErrorDetail,
            isDisableBtnSave,
            type,
            isHiddenButtonChangeData
        } = this.state;

        const listActions = [];
        listActions.push({
            type: EnumName.E_REFRESH,
            title: '',
            onPress: () => this.refreshForm()
        });
        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['HRM_PortalV3_Att_OvertimePlan_BtnSaveTemp'] &&
            PermissionForAppMobile.value['HRM_PortalV3_Att_OvertimePlan_BtnSaveTemp']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_TEMP,
                title: '',
                disable: isDisableBtnSave,
                onPress: () => this.onSaveTemp()
            });
        }

        if (type === EnumName.E_CHANGE_SHIFT) {
            listActions.push({
                type: EnumName.E_REGISTER,
                title: 'HRM_PortalApp_Register',
                disable: isDisableBtnSave,
                onPress: () => this.onSaveAndSend()
            });
        }

        // if(isDisableBtnSave && listActions.length > 0) {
        //     listActions.forEach((elemnt) => {
        //         elemnt.disable = isDisableBtnSave;
        //     })
        // }

        return (
            <View style={styles.container}>
                <VnrDateFromTo
                    ref={(ref) => (this.refVnrDateFromTo = ref)}
                    // key={ChangeShiftDate.id}
                    refresh={ChangeShiftDate.refresh}
                    value={ChangeShiftDate.value ? ChangeShiftDate.value : {}}
                    displayOptions={true}
                    disable={ChangeShiftDate.disable}
                    isChangeShiftorChangeSchedule={true}
                    isHiddenChooseEveryDay={!isHiddenButtonChangeData}
                    isHiddenChooseAboutDays={false}
                    onFinish={(range) => {
                        this.onChangeDateFromTo(range);
                    }}
                />
                {ChangeShiftDate.value && (
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={isShowModal} //isShowModal
                        style={{ ...CustomStyleSheet.padding(0), ...CustomStyleSheet.margin(0) }}
                    >
                        <SafeAreaView style={styleComonAddOrEdit.wrapInsideModal}>
                            <ToasterInModal
                                ref={(refs) => {
                                    this.ToasterSevice = refs;
                                }}
                            />
                            <AlertInModal ref={(refs) => (this.AlertSevice = refs)} />

                            <View style={styleComonAddOrEdit.flRowSpaceBetween}>
                                <VnrText
                                    style={[
                                        styleSheets.lable,
                                        styleComonAddOrEdit.styHeaderText,
                                        CustomStyleSheet.fontWeight('700')
                                    ]}
                                    i18nKey={
                                        this.isModify
                                            ? 'HRM_PortalApp_ShiftChange_Update'
                                            : 'HRM_PortalApp_ShiftChange_Register'
                                    }
                                />
                                <TouchableOpacity onPress={() => this.onClose()}>
                                    <IconCancel size={Size.iconSize} color={Colors.gray_8} />
                                </TouchableOpacity>
                            </View>

                            <View style={styleComonAddOrEdit.styViewLogo}>
                                <Image source={require('../../../../../assets/images/vnrDateFromTo/Group.png')} />
                            </View>

                            {this._renderHeaderLoading()}

                            <KeyboardAvoidingView
                                scrollEnabled={true}
                                style={styleComonAddOrEdit.styAvoiding}
                                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                            >
                                {this.renderItems()}
                            </KeyboardAvoidingView>

                            {/* button */}
                            <ListButtonRegister listActions={listActions} />

                            {/* modal cấp duyệt */}
                            {isShowModalApprove ? ( //styles.wrapModalApprovaLevel
                                <View style={styleComonAddOrEdit.wrapModalApproval}>
                                    <TouchableOpacity
                                        style={[styleComonAddOrEdit.bgOpacity]}
                                        onPress={() => {
                                            this.setState({
                                                isShowModalApprove: false
                                            });
                                        }}
                                    />
                                    <View style={styleComonAddOrEdit.wrapFullScreen}>
                                        <SafeAreaView style={styleComonAddOrEdit.wrapContentModalApproval}>
                                            <View style={styleComonAddOrEdit.wrapTitileHeaderModalApprovaLevel}>
                                                <VnrText
                                                    style={[
                                                        styleSheets.text,
                                                        styleComonAddOrEdit.styRegister,
                                                        styleComonAddOrEdit.fS16fW600
                                                    ]}
                                                    i18nKey={'HRM_PortalApp_Approval_Process'}
                                                />
                                                <VnrText
                                                    style={[
                                                        styleSheets.text,
                                                        styleComonAddOrEdit.styApproveProcessTitle
                                                    ]}
                                                    i18nKey={`${this.levelApprove} ${translate(
                                                        'HRM_PortalApp_Approval_Level'
                                                    )}`}
                                                />
                                            </View>
                                            <View style={styleComonAddOrEdit.wrapLevelApproval}>
                                                <View style={styleComonAddOrEdit.h90}>
                                                    <VnrLoadApproval
                                                        api={API_APPROVE}
                                                        refresh={UserApprove.refresh}
                                                        textField="UserInfoName"
                                                        valueField="ID"
                                                        nameApprovalLevel={UserApprove.label}
                                                        levelApproval={UserApprove.levelApproval}
                                                        filter={true}
                                                        filterServer={true}
                                                        filterParams={'Text'}
                                                        autoFilter={true}
                                                        status={UserApprove.status}
                                                        value={UserApprove.value}
                                                        disable={UserApprove.disable}
                                                        onFinish={(item) => {
                                                            this.onChangeUserApprove(item);
                                                        }}
                                                    />
                                                </View>

                                                {UserApprove3.visible && UserApprove3.visibleConfig && (
                                                    <View style={styleComonAddOrEdit.h90}>
                                                        <VnrLoadApproval
                                                            api={API_APPROVE}
                                                            refresh={UserApprove3.refresh}
                                                            textField="UserInfoName"
                                                            nameApprovalLevel={UserApprove3.label}
                                                            levelApproval={UserApprove3.levelApproval}
                                                            valueField="ID"
                                                            filter={true}
                                                            filterServer={true}
                                                            filterParams={'Text'}
                                                            autoFilter={true}
                                                            status={UserApprove3.status}
                                                            value={UserApprove3.value}
                                                            disable={UserApprove3.disable}
                                                            onFinish={(item) => {
                                                                this.setState({
                                                                    UserApprove3: {
                                                                        ...UserApprove3,
                                                                        value: item,
                                                                        refresh: !UserApprove3.refresh
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </View>
                                                )}

                                                {UserApprove4.visible && UserApprove4.visibleConfig && (
                                                    <View style={styleComonAddOrEdit.h90}>
                                                        <VnrLoadApproval
                                                            api={API_APPROVE}
                                                            refresh={UserApprove4.refresh}
                                                            textField="UserInfoName"
                                                            nameApprovalLevel={UserApprove4.label}
                                                            levelApproval={UserApprove4.levelApproval}
                                                            valueField="ID"
                                                            filter={true}
                                                            filterServer={true}
                                                            filterParams={'Text'}
                                                            autoFilter={true}
                                                            status={UserApprove4.status}
                                                            value={UserApprove4.value}
                                                            disable={UserApprove4.disable}
                                                            onFinish={(item) => {
                                                                this.setState({
                                                                    UserApprove4: {
                                                                        ...UserApprove4,
                                                                        value: item,
                                                                        refresh: !UserApprove4.refresh
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </View>
                                                )}

                                                <View style={styleComonAddOrEdit.h90}>
                                                    <VnrLoadApproval
                                                        api={API_APPROVE}
                                                        refresh={UserApprove2.refresh}
                                                        textField="UserInfoName"
                                                        nameApprovalLevel={UserApprove2.label}
                                                        levelApproval={UserApprove2.levelApproval}
                                                        valueField="ID"
                                                        filter={true}
                                                        filterServer={true}
                                                        filterParams={'Text'}
                                                        autoFilter={true}
                                                        status={UserApprove2.status}
                                                        value={UserApprove2.value}
                                                        disable={UserApprove2.disable}
                                                        onFinish={(item) => {
                                                            this.onChangeUserApprove2(item);
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                        </SafeAreaView>
                                    </View>
                                </View>
                            ) : null}
                        </SafeAreaView>
                        {modalErrorDetail.isModalVisible && (
                            <Modal animationType="slide" transparent={true} isVisible={true}>
                                <View style={styleComonAddOrEdit.wrapModalError}>
                                    <TouchableOpacity
                                        style={[styleComonAddOrEdit.bgOpacity]}
                                        onPress={() => this.closeModalErrorDetail()}
                                    />
                                    <View style={styleComonAddOrEdit.wrapContentModalError}>
                                        <View style={styleComonAddOrEdit.wrapTitileHeaderModalError}>
                                            <VnrText
                                                style={[
                                                    styleSheets.text,
                                                    styleComonAddOrEdit.styRegister,
                                                    styleComonAddOrEdit.fS16fW600
                                                ]}
                                                i18nKey={'HRM_PortalApp_Message_ErrorDetail'}
                                            />

                                            <TouchableOpacity onPress={() => this.closeModalErrorDetail()}>
                                                <IconCloseCircle size={Size.iconSize} color={Colors.white} />
                                            </TouchableOpacity>
                                        </View>
                                        <ScrollView
                                            style={[
                                                styleComonAddOrEdit.wrapLevelError,
                                                CustomStyleSheet.paddingHorizontal(8)
                                            ]}
                                        >
                                            {this.renderErrorDetail()}
                                        </ScrollView>
                                    </View>
                                </View>
                            </Modal>
                        )}
                    </Modal>
                )}
            </View>
        );
    }
}

const stylesCustom = StyleSheet.create({
    viewDate: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: Size.defineHalfSpace + 6,
        paddingHorizontal: Size.defineSpace,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    },

    textDate: {
        fontSize: Size.text + 1,
        fontWeight: '500'
    },

    textLabelDate: {
        fontSize: Size.text + 1,
        color: Colors.gray_8
    }
});

const styles = styleComonAddOrEdit;
