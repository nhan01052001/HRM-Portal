import React, { Component } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    FlatList,
    Modal,
    KeyboardAvoidingView,
    Platform,
    StyleSheet
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styleSheets, Size, Colors, CustomStyleSheet, stylesVnrPickerV3 } from '../../../../../constants/styleConfig';
import { IconCloseCircle, IconCancel, IconPlus } from '../../../../../constants/Icons';
import VnrText from '../../../../../components/VnrText/VnrText';
import HttpService from '../../../../../utils/HttpService';
import { ToasterSevice, ToasterInModal } from '../../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import moment from 'moment';
import { translate } from '../../../../../i18n/translate';
import { AlertInModal } from '../../../../../components/Alert/Alert';
import { EnumName, EnumIcon, ScreenName } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrDateFromTo from '../../../../../componentsV3/VnrDateFromTo/VnrDateFromTo';
import AttSubmitWorkingOvertimeComponent from './AttSubmitWorkingOvertimeComponent.js';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';
import VnrLoadApproval from '../../../../../componentsV3/VnrLoadApproval/VnrLoadApproval';
import VnrIndeterminate from '../../../../../components/VnrLoading/VnrIndeterminate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile.js';
import ListButtonRegister from '../../../../../componentsV3/ListButtonRegister/ListButtonRegister.js';
import { AttSubmitWorkingOvertimeBusinessFunction } from './AttSubmitWorkingOvertimeBusiness.js';
import VnrTextInput from '../../../../../componentsV3/VnrTextInput/VnrTextInput.js';
import VnrPickerLittle from '../../../../../componentsV3/VnrPickerLittle/VnrPickerLittle.js';
import VnrAttachFile from '../../../../../componentsV3/VnrAttachFile/VnrAttachFile.js';
import AttSubmitWorkingOvertimeApprovalProcess from './AttSubmitWorkingOvertimeApprovalProcess.js';

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
        ID: null,
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
    DateFromTo: {
        refresh: false,
        disable: false,
        value: null
    },
    SimilarRegistration: {
        refresh: false,
        disable: false,
        value: false,
        visible: false,
        visibleConfig: false
    },
    params: null,
    isShowModal: false,
    isShowModalApprove: false,
    isShowLoading: false,
    fieldConfig: {
        WorkDate: {
            visibleConfig: true,
            isValid: true
        },
        DurationType: {
            visibleConfig: false,
            isValid: true
        },
        OvertimeTypeID: {
            visibleConfig: false,
            isValid: false
        },
        TimeFrom: {
            visibleConfig: false,
            isValid: false
        },
        RegisterHours: {
            visibleConfig: false,
            isValid: true
        },
        MethodPayment: {
            visibleConfig: true,
            isValid: true
        },
        ReasonOT: {
            visibleConfig: false,
            isValid: false
        },
        FileAttachment: {
            visibleConfig: true,
            isValid: false
        },
        OvertimeReasonID: {
            visibleConfig: false,
            isValid: false
        },
        RegisterByHours: {
            visibleConfig: false
            // isValid: false,
        },
        TransferDepartment: {
            visibleConfig: false,
            isValid: false
        },

        // Checkbox Chuyển TLĐV
        IsUnitAssistant: {
            visibleConfig: false,
            isValid: false
        },

        // Checkbox Đăng ký ăn ngoài giờ
        IsSignUpToEat: {
            visibleConfig: false,
            isValid: false
        },

        // Checkbox Yêu cầu thanh toán TCKC
        IsRequestForBenefit: {
            visibleConfig: false,
            isValid: false
        },

        // Checkbox Yêu cầu ra/vào cổng
        IsRequestEntryExitGate: {
            visibleConfig: false,
            isValid: false
        },

        // Loại đơn vị kinh doanh
        BusinessUnitTypeID: {
            visibleConfig: false,
            isValid: false
        },

        // Đơn vị kinh doanh
        BusinessUnitID: {
            visibleConfig: false,
            isValid: false
        },

        // Nơi gửi đến
        SendToID: {
            visibleConfig: false,
            isValid: false
        },

        OvertimeArea: {
            visibleConfig: false,
            isValid: false
        },

        ShiftID: {
            visibleConfig: false,
            isValid: true
        },

        IsOverTimeBreak: {
            visibleConfig: false,
            isValid: true
        },

        IsNotCheckInOut: {
            visibleConfig: false,
            isValid: true
        },

        Explanation: {
            visibleConfig: false
        },

        CouponCode: {
            visibleConfig: true,
            isValid: true
        },

        Emp: {
            visibleConfig: true,
            isValid: true
        },

        OvertimeHour: {
            visibleConfig: true,
            isValid: true
        },

        WorkPlace: {
            visibleConfig: true,
            isValid: false
        },

        WorkPlan: {
            visibleConfig: true,
            isValid: false
        }
    },
    modalErrorDetail: {
        isModalVisible: false,
        cacheID: null,
        data: []
    },

    dayHaveShift: null,
    dayNotHaveShift: null,

    isPassRecord: false,
    IsHasFormulaTotal: false,

    isError: false,
    CouponCode: {
        lable: 'HRM_PortalApp_OT_CouponCode',
        visible: true,
        visibleConfig: true,
        disable: false,
        value: '',
        refresh: false
    },

    MethodPayment: {
        lable: 'lblform_PersonalSubmitOverTimeInfo_MethodPayment',
        visible: true,
        visibleConfig: true,
        refresh: false,
        value: null,
        data: [
            {
                'Text': 'Trả tiền',
                'Value': 'E_CASHOUT',
                'Number': 1
            },
            {
                'Text': 'Nghỉ bù',
                'Value': 'E_TIMEOFF',
                'Number': 2
            },
            {
                'Text': 'Trả tiền và nghỉ bù',
                'Value': 'E_CASHOUT_TIMEOFF',
                'Number': 3
            }
        ]
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

    listRenderData: []
};

export default class AttSubmitWorkingOvertimeAddOrEdit extends Component {
    constructor(props) {
        super(props);
        this.state = initSateDefault;
        this.refVnrDateFromTo = null;
        this.isStatusVnrDateFromTo = false;
        this.listRefGetDataSave = {};
        // khai báo các biến this trong hàm setVariable
        this.setVariable();

        // props.navigation.setParams({
        //   title: props.navigation.state.params.record
        //     ? 'HRM_Category_ShiftItem_Overtime_Update_Title'
        //     : 'HRM_Category_ShiftItem_Overtime_Create_Title'
        // });
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
        this.DurationType = null;
    };

    //#region [khởi tạo - check đăng ký hộ, lấy các dữ liệu cho control, lấy giá trị mặc đinh]
    refreshView = () => {
        // this.props.navigation.setParams({ title: 'HRM_Category_ShiftItem_Overtime_Create_Title' });
        this.setVariable();
        this.setState(initSateDefault, () => this.getConfigValid('New_Portal_Att_Overtime', true));
    };
    //promise get config valid

    getConfigValid = () => {
        let { fieldConfig } = this.state;
        const tblName = 'Attendance_FormRegisterOvertime';
        VnrLoadingSevices.show();
        HttpService.Get(`[URI_CENTER]/api/Sys_common/GetValidateJson?listFormId=${tblName}`).then((res) => {
            VnrLoadingSevices.hide();
            const data = res.Status == EnumName.E_SUCCESS && res.Data && res.Data[tblName] ? res.Data[tblName] : null;
            if (data && Object.keys(data).length > 0) {
                const listControl = Object.keys(fieldConfig);
                listControl.forEach((key) => {
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

            this.setState({ fieldConfig }, () => {
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

    componentDidMount() {
        //get config validate
        // this.getConfigValid('New_Portal_Att_Overtime')
    }

    handleSetState = (response) => {
        const { DateFromTo, UserApprove, UserApprove3, UserApprove4, UserApprove2, SimilarRegistration } = this.state;

        this.levelApprove = response.LevelApproved ? response.LevelApproved : 4;

        let nextState = {
            isShowModal: true,
            SimilarRegistration: {
                value: false,
                refresh: !SimilarRegistration.refresh
            },
            DateFromTo: {
                ...DateFromTo,
                value: response && response.WorkDate ? [moment(response.WorkDate).format('YYYY-MM-DD')] : null,
                refresh: !DateFromTo.refresh
            },
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
            },
            IsHasFormulaTotal: response?.IsHasFormulaTotal
        };

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
        this.setState(nextState);
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
            //[CREATE] Step 4: Lấy cấp duyệt . => không cần gọi ở này => gọi trong component luôn
            // this.GetHighSupervior();
            const { params } = this.state;
            if (params && params.listItem && params.listItem.length > 0) {
                let listday = params.listItem.map((item) => moment(item.WorkDate).format('YYYY-MM-DD'));
                // nhan.nguyen: 0181349
                this.handleWhenChangeDateOvertime(listday);
            }
            // else if (this.refVnrDateFromTo && this.refVnrDateFromTo.showModal) {
            //     // Show modal chọn ngày đăng ký
            //     this.refVnrDateFromTo.showModal();
            // }
            else {
                this.setState({
                    isRefresh: !this.state.isRefresh,
                    isShowModal: true,
                    listRenderData: [1]
                });
            }
        });
    };

    GetHighSupervior = (DurationType = null, OrgStructureTransID = null) => {
        const { Profile } = this.state;

        let payload = {};
        if (DurationType) {
            this.DurationType = DurationType;
            payload = {
                DurationType: DurationType
            };
        }

        if (OrgStructureTransID) {
            payload = {
                ...payload,
                OrgStructureTransID
            };
        }

        this.showLoading(true);
        HttpService.Post('[URI_CENTER]/api/Att_GetData/GetHighSupervisor', {
            ProfileID: Profile.ID,
            userSubmit: Profile.ID,
            type: 'E_OVERTIMEPLAN',
            ...payload
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
                                visible: false
                            },
                            UserApprove2: {
                                ...nextState.UserApprove2,
                                levelApproval: 3
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
                    },
                    IsHasFormulaTotal: result?.IsHasFormulaTotal
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
                const { DateFromTo, SimilarRegistration } = this.state;
                if (DateFromTo.value && DateFromTo.value.length > 0) {
                    const { params } = this.state;

                    let { record } = params;

                    if (!record) {
                        // nếu bấm refresh lấy lại cấp duyệt
                        this.GetHighSupervior(this.DurationType);
                    } else {
                        // Nếu bấm refresh khi Chỉnh sửa
                        this.isModify = true;
                        this.getRecordAndConfigByID(record, this.handleSetState);
                    }

                    DateFromTo.value.map((item) => {
                        if (this.listRefGetDataSave[SimilarRegistration.value === true ? 1 : item]) {
                            this.listRefGetDataSave[SimilarRegistration.value === true ? 1 : item].unduData();
                        }
                    });
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
        let lstOverTimeItem = [];
        const {
                DateFromTo,
                Profile,
                UserApprove,
                UserApprove2,
                UserApprove3,
                UserApprove4,
                modalErrorDetail,
                params,
                SimilarRegistration
            } = this.state,
            { record } = params;

        if (Array.isArray(DateFromTo.value) && DateFromTo.value.length > 0) {
            DateFromTo.value.map((item) => {
                if (this.listRefGetDataSave[SimilarRegistration.value === true ? 1 : item]) {
                    const data = this.listRefGetDataSave[SimilarRegistration.value === true ? 1 : item].getAllData();
                    if (data) {
                        lstOverTimeItem.push({
                            ...data,
                            WorkDate: moment(item).format('YYYY/MM/DD HH:mm'),
                            WorkDateTo: moment(item).format('YYYY/MM/DD HH:mm'),
                            ListWorkDateRepeat: [`${moment(item).format('YYYY/MM/DD HH:mm')}`]
                        });
                    }
                }
            });
        }

        let payload = {
            ProfileRemoveIDs: this.ProfileRemoveIDs,
            IsRemoveAndContinue: this.IsRemoveAndContinue,
            CacheID: this.CacheID,
            IsContinueSave: this.IsContinueSave,
            Host: dataVnrStorage?.apiConfig?.uriPor
        };

        if (lstOverTimeItem.length > 0) {
            payload = {
                ...payload,
                ProfileIds: Profile.ID,
                // UserApproveID: UserApprove.value ? UserApprove.value.ID : null,
                // UserApproveID4: UserApprove2.value ? UserApprove2.value.ID : null,
                // Lý do gán lại cấp duyệt thứ tự 1.2.3.4 là do server tự gán lại theo thứ tự 1.3.4.2
                UserApproveID: UserApprove && UserApprove.value ? UserApprove.value.ID : null,
                UserApproveID2: UserApprove3 && UserApprove3.value ? UserApprove3.value.ID : null,
                UserApproveID3: UserApprove4 && UserApprove4.value ? UserApprove4.value.ID : null,
                UserApproveID4: UserApprove2 && UserApprove2.value ? UserApprove2.value.ID : null,
                ListOvertimeItem: lstOverTimeItem,
                ObjectRegister: 'E_Emp'
            };

            if (isSend) {
                payload = {
                    ...payload,
                    IsAddNewAndSendMail: true
                };
                AttSubmitWorkingOvertimeBusinessFunction.checkForReLoadScreen[ScreenName.AttSubmitWorkingOvertime] =
                    true;
                AttSubmitWorkingOvertimeBusinessFunction.checkForReLoadScreen[
                    ScreenName.AttApproveSubmitWorkingOvertime
                ] = true;
                AttSubmitWorkingOvertimeBusinessFunction.checkForReLoadScreen[
                    ScreenName.AttSaveTempSubmitWorkingOvertime
                ] = true;
            }

            if (this.isModify === true && params && record) {
                payload = {
                    ...payload,
                    ID: record.ID,
                    Status: record.Status,
                    userSubmit: Profile.ID
                };
            }

            this.isProcessing = true;
            this.showLoading(true);
            HttpService.Post('[URI_CENTER]/api/Att_OvertimePlan/CreateOrUpdateOvertimePlanNew', payload).then((res) => {
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
        const { DateFromTo, isRefresh, Profile, SimilarRegistration } = this.state;
        VnrLoadingSevices.show();
        this.listRefGetDataSave = {};
        let shiftID = [],
            indexAllowe = [],
            indexError = [],
            dayAllowe = [],
            dayError = [],
            arrPromise = [],
            arrPromise2 = [];
        // way 1: needn't use for to get arr promise. just use for to loop one API manytimes. => not optimal performance
        // for (let i = 0; i < range.length; i++) {
        //   await HttpService.Post('[URI_CENTER]/api/Att_GetData/GetShiftByProfileAndWorkDate', {
        //     profileID: Profile.ID,
        //     WorkDate: range[i],
        //   }).then((res) => {
        //     console.log(res, 'res');
        //     if (res && res.Status === "SUCCESS" && res.Data && Array.isArray(res.Data)) {
        //       if (res.Data.length === 0) {
        //         shiftID.push({});
        //       } else if (res.Data.length === 1) {
        //         shiftID.push({ [`ID${1}`]: res.Data[0].ID });
        //       } else {
        //         res.Data.map((item, index) => {
        //           shiftID.push({ [`ID${index + 1}`]: item.ID });
        //         })
        //       }
        //     }
        //   }).catch((err) => {
        //     this.props.ToasterSevice().showWarning(translate('HRM_Message_GetDataServices_Error'), 3000)
        //   })
        // };

        for (let i = 0; i < range.length; i++) {
            arrPromise.push(
                HttpService.Post('[URI_CENTER]/api/Att_GetData/GetShiftByProfileAndWorkDate', {
                    profileID: Profile.ID,
                    WorkDate: range[i]
                })
            );
            arrPromise2.push(
                HttpService.Post('[URI_CENTER]/api/Att_GetData/GetOvertimeDurationTypeByDate', {
                    profileID: Profile.ID,
                    WorkDate: range[i]
                })
            );
        }

        // way 2: use for to get arr promise then use MultiRequest(Promise.all) to get data ==> more optimal performance
        await HttpService.MultiRequest(arrPromise)
            .then((res) => {
                if (res && Array.isArray(res)) {
                    res.map((data, index) => {
                        if (data && data.Status === 'SUCCESS' && data.Data && Array.isArray(data.Data)) {
                            if (data.Data.length === 0) {
                                indexError.push(index);
                                shiftID.push({});
                            } else if (data.Data.length === 1) {
                                // date have 1 shift
                                indexAllowe.push(index);
                                shiftID.push({ [`ID${1}`]: data.Data[0].ID });
                            } else {
                                data.Data.map((item, index) => {
                                    // date have many shift
                                    indexAllowe.push(index);
                                    shiftID.push({ [`ID${index + 1}`]: item.ID });
                                });
                            }

                            // get last item => hide loading
                            if (index === res.length - 1) {
                                VnrLoadingSevices.hide();
                            }
                        }
                    });
                }
            })
            .catch(() => {
                this.props.ToasterSevice().showWarning(translate('HRM_Message_GetDataServices_Error'), 3000);
            });

        //  way 3: similar way 2. but not use MultiRequest instead use Promise.all
        // await Promise.all(arrPromise).then((res) => {
        //   if (res && Array.isArray(res)) {
        //     res.map((data, index) => {
        //       if (data && data.Status === "SUCCESS" && data.Data && Array.isArray(data.Data)) {
        //         if (data.Data.length === 0) {
        //           indexError.push(index);
        //           shiftID.push({});
        //         } else if (data.Data.length === 1) {
        //           // date have 1 shift
        //           indexAllowe.push(index);
        //           shiftID.push({ [`ID${1}`]: data.Data[0].ID });
        //         } else {
        //           data.Data.map((item, index) => {
        //             // date have many shift
        //             indexAllowe.push(index);
        //             shiftID.push({ [`ID${index + 1}`]: item.ID });
        //           })
        //         }

        //         // get last item => hide loading
        //         if (index === res.length - 1) {
        //           VnrLoadingSevices.hide();
        //         }
        //       }
        //     })
        //   }
        // }).catch((err) => {
        //   this.props.ToasterSevice().showWarning(translate('HRM_Message_GetDataServices_Error'), 3000)
        // });

        // get date have shift
        if (indexAllowe.length > 0) {
            indexAllowe.map((day) => {
                dayAllowe.push(range[day]);
            });
        }

        // get date not shift
        if (indexError.length > 0) {
            indexError.map((day) => {
                dayError.push(range[day]);
            });
        }

        let nextState = {
            DateFromTo: {
                ...DateFromTo,
                value: range,
                refresh: !DateFromTo.refresh
            },
            isRefresh: !isRefresh,
            isShowModal: true,
            dayHaveShift: dayAllowe.length > 0 ? dayAllowe : null,
            dayNotHaveShift: dayError.length > 0 ? dayError : null,
            isPassRecord: true
        };

        // check in array shift have 1 shift difference
        if (this.allAreEqual(shiftID) === false) {
            nextState = {
                ...nextState,
                SimilarRegistration: {
                    ...SimilarRegistration,
                    value: false,
                    refresh: !SimilarRegistration.refresh,
                    visible: false,
                    visibleConfig: false
                }
            };
        } else {
            // get duration type to compare
            let arrTemp = [];
            await this.getDurationType(arrPromise2)
                .then((res) => {
                    if (res && Array.isArray(res)) {
                        res.map((data) => {
                            if (data && data.Status === 'SUCCESS' && data.Data && Array.isArray(data.Data)) {
                                if (data.Data.length > 0) {
                                    if (data.Data.length === 1) {
                                        arrTemp.push({
                                            ID: data.Data[0]?.ID ? data.Data[0]?.ID : null
                                        });
                                    } else {
                                        data.Data.map((item) => {
                                            if (item.ID === 'E_OT_LATE') {
                                                arrTemp.push({
                                                    ID: item.ID ? item.ID : null
                                                });
                                            }
                                        });
                                    }
                                } else {
                                    arrTemp.push({
                                        ID: 'E_OT_UNLIMIT'
                                    });
                                }
                            }
                        });
                    }
                })
                .catch(() => {
                    this.props.ToasterSevice().showWarning(translate('HRM_Message_GetDataServices_Error'), 3000);
                });

            // function arr compare duration type receive above
            if (this.allAreEqual(arrTemp) === false) {
                nextState = {
                    ...nextState,
                    SimilarRegistration: {
                        ...SimilarRegistration,
                        value: false,
                        refresh: !SimilarRegistration.refresh,
                        visible: false,
                        visibleConfig: false
                    }
                };
            } else {
                nextState = {
                    ...nextState,
                    SimilarRegistration: {
                        ...SimilarRegistration,
                        value: SimilarRegistration.value,
                        refresh: !SimilarRegistration.refresh,
                        visible: true,
                        visibleConfig: true
                    }
                };
            }
        }

        this.setState(nextState);
    };

    allAreEqual = (array) => {
        const result = array.every((element) => {
            if (Vnr_Function.compare(element, array[0])) {
                return true;
            }
        });

        return result;
    };

    getDurationType = async (arr) => {
        return await HttpService.MultiRequest(arr);
    };

    onClose = () => {
        const { DateFromTo } = this.state;

        this.setState({
            isShowModal: false,
            DateFromTo: {
                ...DateFromTo,
                value: null,
                refresh: !DateFromTo.refresh
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

    // Thay đổi đăng ký tương tự
    onChangeSimilarRegistration = (value) => {
        const { SimilarRegistration } = this.state;
        this.listRefGetDataSave = {};

        this.setState({
            SimilarRegistration: {
                ...SimilarRegistration,
                value: value,
                refresh: !SimilarRegistration.refresh
            }
        });
    };

    renderApprove = () => {
        return (
            <View style={[
                CustomStyleSheet.flex(1),
                CustomStyleSheet.backgroundColor(Colors.gray_4)
            ]}>
                <View
                    style={
                        [CustomStyleSheet.paddingHorizontal(24),
                            CustomStyleSheet.paddingVertical(8)]
                    }
                >
                    <TouchableOpacity
                        onPress={() => {
                            if (Array.isArray(this.state?.listRenderData)) {
                                if (this.state?.listRenderData.length > 1)
                                    this.setState({
                                        listRenderData: [...this.state?.listRenderData, this.state?.listRenderData.length + 1]
                                    });

                            }
                        }}
                        activeOpacity={0.7}
                        style={customStyles.buttonAddEmp}
                    >
                        <IconPlus size={Size.iconSize} color={Colors.blue} />
                        <Text
                            style={[
                                styleSheets.text,
                                CustomStyleSheet.color(Colors.blue),
                                CustomStyleSheet.fontSize(16),
                                CustomStyleSheet.fontWeight('500'),
                                CustomStyleSheet.marginLeft(6)
                            ]}
                        >Thêm nhân viên</Text>
                    </TouchableOpacity>
                </View>
                {/* <TouchableOpacity
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
                </TouchableOpacity> */}

                <View style={customStyles.wrapApprovalProcess}>
                    <AttSubmitWorkingOvertimeApprovalProcess />
                </View>
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
                const { listRenderData } = this.state;
                if (listRenderData && Array.isArray(listRenderData) && listRenderData.length > 1) {
                    //
                    this.setState({
                        listRenderData: listRenderData.splice(index, 1)
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

    handleUpdateDateOvertime = (value, index) => {
        const { DateFromTo } = this.state;

        let valueTemp = value && Array.isArray(value) ? value[0] : value;
        if (Array.isArray(DateFromTo.value) && DateFromTo.value.length > 0) {
            if (DateFromTo.value.includes(valueTemp)) {
                let textError = translate('HRM_ProtalApp_SamDayOfWorkingOvertime');
                textError = textError.replace('[E_DAY]', moment(new Date(valueTemp)).format('DD/MM/YYYY'));
                this.ToasterSevice.showWarning(textError);
            } else {
                let arrTemp = Array.isArray(DateFromTo.value) && DateFromTo.value.length > 0 ? DateFromTo.value : [];
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
            listRenderData,
            SimilarRegistration,
            isRefresh,
            fieldConfig,
            params,
            dayNotHaveShift,
            dayHaveShift,
            isPassRecord,
            IsHasFormulaTotal,
            isError,
            CouponCode,
            MethodPayment,
            ReasonOT,
            FileAttachment
        } = this.state;
        if (listRenderData && Array.isArray(listRenderData) && listRenderData.length > 0) {
            return (
                <FlatList
                    ref={(refs) => (this.refFlatList = refs)}
                    style={[styles.styFlatListContainer]}
                    data={listRenderData}
                    renderItem={({ item, index }) => (
                        <AttSubmitWorkingOvertimeComponent
                            key={item}
                            ref={(ref) => {
                                this.listRefGetDataSave[`${item}`] = ref;
                            }}
                            levelApprove={this.levelApprove}
                            onScrollToInputIOS={this.onScrollToInputIOS}
                            // onUpdateDay={this.onUpdateDay}
                            listDayHaveShift={dayHaveShift}
                            listDayNotHaveShift={dayNotHaveShift}
                            // allDateRegister={DateFromTo.value}
                            onDeleteItemDay={this.onDeleteItemDay}
                            isRefresh={isRefresh}
                            indexDay={index}
                            isStatusVnrDateFromTo={this.isStatusVnrDateFromTo}
                            // workDate={item}
                            record={params?.record}
                            isPassRecord={isPassRecord}
                            isSimilarRegistration={SimilarRegistration.value}
                            fieldConfig={fieldConfig}
                            isShowDelete={
                                SimilarRegistration.value === false &&
                                    Array.isArray(listRenderData) &&
                                    listRenderData.length > 1
                                    ? true
                                    : false
                            }
                            value={item}
                            showLoading={this.showLoading}
                            ToasterSevice={() => this.ToasterSeviceCallBack()}
                            onSubmitDateRegister={(value, isStatusVnrDateFromTo) => {
                                this.isStatusVnrDateFromTo = isStatusVnrDateFromTo;
                                this.setState(
                                    {
                                        SimilarRegistration: {
                                            ...SimilarRegistration,
                                            visible: !isStatusVnrDateFromTo,
                                            visibleConfig: !isStatusVnrDateFromTo,
                                            refresh: !SimilarRegistration.refresh
                                        }
                                        // isRefresh: !isRefresh
                                    },
                                    () => {
                                        if (value) {
                                            this.onChangeDateFromTo(value);
                                        }
                                    }
                                );
                            }}
                            onUpdateDateRegister={(value, index) => {
                                this.handleUpdateDateOvertime(value, index);
                            }}
                            onChangeGetHighSupervior={(ID) => {
                                this.GetHighSupervior(ID);
                            }}
                            onGetHighSupervisorFromOrgStructureTransID={(OrgStructureTransID) => {
                                if (IsHasFormulaTotal) {
                                    this.GetHighSupervior(null, OrgStructureTransID);
                                }
                            }}
                        />
                    )}
                    keyExtractor={(item, index) => index}
                    ItemSeparatorComponent={() => <View style={styleComonAddOrEdit.separate} />}
                    ListFooterComponent={this.renderApprove}
                    ListHeaderComponent={() => {
                        return (
                            <View>
                                <View
                                    style={[CustomStyleSheet.marginLeft(24), CustomStyleSheet.paddingVertical(12)]}
                                >
                                    <Text style={[styleSheets.lable, CustomStyleSheet.fontSize(16), CustomStyleSheet.fontWeight('600')]}>
                                        {translate('HRM_PortalApp_HreRecruitmentProposalProcessing_General')}
                                    </Text>
                                </View>

                                <View
                                    style={[CustomStyleSheet.flex(1), CustomStyleSheet.height(48)]}
                                >
                                    <VnrTextInput
                                        isCheckEmpty={isError && fieldConfig?.CouponCode?.isValid && CouponCode.value.length === 0 ? true : false}
                                        fieldValid={fieldConfig?.CouponCode?.isValid}
                                        placeHolder={'HRM_PortalApp_PleaseInput'}
                                        disable={CouponCode.disable}
                                        lable={CouponCode.lable}
                                        style={[styleSheets.text]}
                                        value={CouponCode.value}
                                        isTextRow={true}
                                        onChangeText={(text) => {
                                            this.setState({
                                                CouponCode: {
                                                    ...CouponCode,
                                                    value: text,
                                                    refresh: !CouponCode.refresh
                                                }
                                            });
                                        }}
                                        refresh={CouponCode.refresh}
                                    />
                                </View>

                                {/* Phương thức thanh toán */}
                                {MethodPayment.visible && fieldConfig?.MethodPayment.visibleConfig && (
                                    <View style={[
                                        CustomStyleSheet.borderBottomWidth(0.5),
                                        CustomStyleSheet.borderBottomColor(Colors.gray_5)
                                    ]}>
                                        <VnrPickerLittle
                                            isNewUIValue={true}
                                            fieldValid={fieldConfig?.MethodPayment?.isValid}
                                            isCheckEmpty={
                                                fieldConfig?.MethodPayment?.isValid && isError && !MethodPayment.value ? true : false
                                            }
                                            refresh={MethodPayment.refresh}
                                            dataLocal={MethodPayment.data}
                                            value={MethodPayment.value}
                                            textField="Text"
                                            valueField="Value"
                                            filter={true}
                                            filterServer={true}
                                            filterParams="text"
                                            params="MethodPayment"
                                            disable={MethodPayment.disable}
                                            lable={MethodPayment.lable}
                                            stylePicker={styles.resetBorder}
                                            isChooseQuickly={true}
                                            onFinish={(item) => {
                                                this.setState({
                                                    MethodPayment: {
                                                        ...MethodPayment,
                                                        value: item ? { ...item } : null,
                                                        refresh: !MethodPayment.refresh
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                )}

                                {/* Lý do tăng ca */}
                                {ReasonOT.visible && fieldConfig?.ReasonOT.visibleConfig && (
                                    <VnrTextInput
                                        fieldValid={fieldConfig?.ReasonOT?.isValid}
                                        isCheckEmpty={
                                            fieldConfig?.ReasonOT?.isValid && isError && ReasonOT.value.length === 0 ? true : false
                                        }
                                        placeHolder={'HRM_PortalApp_PleaseInput'}
                                        disable={ReasonOT.disable}
                                        lable={ReasonOT.lable}
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
                                        value={ReasonOT.value}
                                        maxLength={500}
                                        onChangeText={(text) => {
                                            this.setState({
                                                ReasonOT: {
                                                    ...ReasonOT,
                                                    value: text,
                                                    refresh: !ReasonOT.refresh
                                                }
                                            });
                                        }}
                                        refresh={ReasonOT.refresh}
                                    />
                                )}

                                {/* Tập tin đính kèm */}
                                {FileAttachment.visible && fieldConfig?.FileAttachment.visibleConfig && (
                                    <VnrAttachFile
                                        fieldValid={fieldConfig?.FileAttachment?.isValid}
                                        isCheckEmpty={
                                            fieldConfig?.FileAttachment?.isValid && isError && !FileAttachment.value ? true : false
                                        }
                                        style={customStyles.styleAttachFile}
                                        isHideIconLeft={true}
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
                                )}

                                <View
                                    style={customStyles.line12}
                                />
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

    handleWhenChangeDateOvertime = (range) => {
        // handle when range is {startDate, endDate}
        const { SimilarRegistration } = this.state;

        if (range && range.startDate && range.endDate) {
            let days = [];
            let start = new Date(range.startDate).getTime();
            let end = new Date(range.endDate || range.startDate).getTime();
            for (let cur = start; cur <= end; cur += 60 * 60 * 24000) {
                let curStr = new Date(cur).toISOString().substring(0, 10);
                days.push(curStr);
            }
            this.isStatusVnrDateFromTo = true;
            this.setState(
                {
                    SimilarRegistration: {
                        ...SimilarRegistration,
                        visible: false,
                        visibleConfig: false,
                        refresh: !SimilarRegistration.refresh
                    }
                },
                () => {
                    this.onChangeDateFromTo(days);
                }
            );
        } else {
            this.isStatusVnrDateFromTo = false;
            this.setState(
                {
                    SimilarRegistration: {
                        ...SimilarRegistration,
                        visible: true,
                        visibleConfig: true,
                        refresh: !SimilarRegistration.refresh
                    }
                },
                () => {
                    this.onChangeDateFromTo(range);
                }
            );
        }
    };

    render() {
        const {
            UserApprove,
            UserApprove3,
            UserApprove4,
            UserApprove2,
            DateFromTo,
            isShowModalApprove,
            modalErrorDetail
        } = this.state;

        const listActions = [];
        listActions.push({
            type: EnumName.E_REGISTER,
            title: 'HRM_PortalApp_Register',
            onPress: () => this.onSaveAndSend()
        });
        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['HRM_PortalV3_Att_OvertimePlan_BtnSaveTemp'] &&
            PermissionForAppMobile.value['HRM_PortalV3_Att_OvertimePlan_BtnSaveTemp']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_TEMP,
                title: '',
                onPress: () => this.onSaveTemp()
            });
        }
        listActions.push({
            type: EnumName.E_REFRESH,
            title: '',
            onPress: () => this.refreshForm()
        });

        return (
            <View style={styles.container}>
                <VnrDateFromTo
                    ref={(ref) => (this.refVnrDateFromTo = ref)}
                    // key={DateFromTo.id}
                    refresh={DateFromTo.refresh}
                    value={['2025-09-17']}
                    displayOptions={true}
                    onlyChooseEveryDay={false}
                    disable={DateFromTo.disable}
                    onFinish={(range) => {
                        this.handleWhenChangeDateOvertime(range);
                    }}
                />
                <Modal
                    animationType="slide"
                    transparent={false}
                    visible={this.state.isShowModal} //isShowModal
                    style={{ ...CustomStyleSheet.padding(0), ...CustomStyleSheet.margin(0) }}
                >
                    <SafeAreaView style={styleComonAddOrEdit.wrapInsideModal}>
                        <ToasterInModal
                            ref={(refs) => {
                                this.ToasterSevice = refs;
                            }}
                        />
                        <AlertInModal ref={(refs) => (this.AlertSevice = refs)} />

                        <View
                            style={[
                                styleComonAddOrEdit.flRowSpaceBetween,
                                CustomStyleSheet.paddingVertical(18),
                                CustomStyleSheet.alignItems('center'),
                                CustomStyleSheet.backgroundColor(Colors.gray_4)
                            ]}
                        >
                            <View style={[CustomStyleSheet.flex(1), CustomStyleSheet.alignItems('center')]}>
                                <VnrText
                                    style={[
                                        styleSheets.lable,
                                        styleComonAddOrEdit.styHeaderText,
                                        CustomStyleSheet.fontWeight('700'),
                                        CustomStyleSheet.fontSize(16)
                                    ]}
                                    i18nKey={
                                        this.isModify
                                            ? 'HRM_PortalApp_WorkingOvertime_Update'
                                            : 'HRM_PortalApp_WorkingOvertime_Register'
                                    }
                                />
                            </View>
                            <TouchableOpacity
                                style={customStyles.buttonClose}
                                onPress={() => this.onClose()}
                            >
                                <IconCancel size={Size.iconSize - 2} color={Colors.gray_8} />
                            </TouchableOpacity>
                        </View>

                        {this._renderHeaderLoading()}

                        {/* Đăng ký tương tự */}
                        {/* {SimilarRegistration.visible && SimilarRegistration.visibleConfig && (
                                <View style={CustomStyleSheet.backgroundColor(Colors.white)}>
                                    <VnrSwitch
                                        lable={'HRM_PortalApp_TakeLeave_Similar'}
                                        subLable={translate('HRM_PortalApp_TakeLeave_Similar_Detail')}
                                        value={SimilarRegistration.value}
                                        onFinish={(value) => {
                                            this.onChangeSimilarRegistration(value);
                                        }}
                                    />
                                </View>
                            )} */}

                        <KeyboardAvoidingView
                            scrollEnabled={true}
                            style={[styleComonAddOrEdit.styAvoiding, { backgroundColor: Colors.white }]}
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
            </View>
        );
    }
}

const styles = styleComonAddOrEdit;
const customStyles = StyleSheet.create({
    buttonClose: {
        padding: 6,
        borderRadius: 100,
        backgroundColor: Colors.white,
        borderWidth: 0.5,
        borderColor: Colors.greySecondaryConstraint
    },
    line12: {
        height: 12,
        width: '100%',
        backgroundColor: Colors.gray_4
    },

    styleAttachFile: {
        flex: 1,
        flexDirection: 'row',
        paddingHorizontal: Size.defineSpace,
        alignItems: 'center'
    },

    buttonAddEmp: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 12,
        backgroundColor: Colors.blue_1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 8,
        borderStyle: 'dashed',
        borderColor: Colors.blue,
        borderWidth: 1
    },

    wrapApprovalProcess: {
        flex: 1,
        backgroundColor: Colors.white,
        padding: 12
    }
});
