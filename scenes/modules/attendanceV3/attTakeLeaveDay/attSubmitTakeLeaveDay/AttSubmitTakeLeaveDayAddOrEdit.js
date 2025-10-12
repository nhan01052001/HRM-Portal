import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Modal,
    FlatList,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
    Keyboard,
    StyleSheet
} from 'react-native';
import moment from 'moment';
import { IconCloseCircle, IconInfo } from '../../../../../constants/Icons';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import { translate } from '../../../../../i18n/translate';
import VnrDateFromTo from '../../../../../componentsV3/VnrDateFromTo/VnrDateFromTo';
import AttTakeLeaveDayComponent from './AttTamTakeLeaveDayComponent';
// import VnrLoadApproval from '../../../../../componentsV3/VnrLoadApproval/VnrLoadApproval';
import HttpService from '../../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { EnumIcon, EnumName, ScreenName } from '../../../../../assets/constant';
import VnrIndeterminate from '../../../../../components/VnrLoading/VnrIndeterminate';
import { AlertInModal } from '../../../../../components/Alert/Alert';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';
import { ToasterInModal, ToasterSevice } from '../../../../../components/Toaster/Toaster';
import VnrSwitch from '../../../../../componentsV3/VnrSwitch/VnrSwitch';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AttSubmitTakeLeaveDayBusinessFunction } from './AttSubmitTakeLeaveDayBusiness';
import DrawerServices from '../../../../../utils/DrawerServices';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import ListButtonRegister from '../../../../../componentsV3/ListButtonRegister/ListButtonRegister';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import VnrApprovalProcess from '../../../../../componentsV3/VnrApprovalProcess/VnrApprovalProcess';

const initSateDefault = {
    ID: null,
    Profile: {
        ID: null,
        ProfileName: '',
        disable: true
    },
    fieldConfig: {
        RegistrationDate: {
            visibleConfig: true,
            isValid: true
        },
        HoursFrom: {
            visibleConfig: true,
            isValid: false
        },
        HoursTo: {
            visibleConfig: true,
            isValid: false
        },
        DurationType: {
            visibleConfig: true,
            isValid: true
        },
        LeaveDayTypeID: {
            visibleConfig: true,
            isValid: true
        },
        LeaveDays: {
            visibleConfig: true,
            isValid: false
        },
        LeaveHours: {
            visibleConfig: true,
            isValid: false
        },
        ShiftID: {
            visibleConfig: true,
            isValid: false
        },
        Comment: {
            visibleConfig: true,
            isValid: false
        },
        FileAttachment: {
            visibleConfig: true,
            isValid: false
        },
        FileAttach: {
            visibleConfig: true,
            isValid: false
        },
        AddEmployee: {
            visibleConfig: true,
            isValid: false
        },
        Substitute: {
            visibleConfig: true,
            isValid: false
        },
        RelativeTypeID: {
            visibleConfig: true,
            isValid: true
        },
        UserApprove: {
            visibleConfig: true,
            isValid: false
        },
        UserApprove3: {
            visibleConfig: true,
            isValid: false
        },
        UserApprove4: {
            visibleConfig: true,
            isValid: false
        },
        UserApprove2: {
            visibleConfig: true,
            isValid: false
        },
        IsPermissionLeave: {
            visibleConfig: true,
            isValid: false
        }
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
    params: null,
    isShowModal: false,
    DateFromTo: {
        refresh: false,
        disable: false,
        value: null
    },
    modalErrorDetail: {
        isModalVisible: false,
        cacheID: null,
        data: []
    },
    isShowLoading: false,
    isShowModalApprove: false,

    SimilarRegistration: {
        value: true,
        visible: true,
        visibleConfig: true
    },
    isShowRemain: {
        value: null,
        visible: false,
        visibleConfig: true,
        isPrioritize: false
    },
    isCheckEmpty: false,
    isVisibleKeyboard: false,
    listRemainingLeaveFunds: [],
    isShowRemainLeavefunds: false,
    isConfigRemainLeavefunds: false,
    totalRemain: 0,
    dataApprovalProcess: []
};

class AttSubmitTakeLeaveDayAddOrEdit extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            ...initSateDefault
            // isShowModal: false,
            // DateFromTo: {
            //     refresh: false,
            //     disable: false,
            //     value: null,
            // },
            // isShowLoading: false
        };
        this.refVnrDateFromTo = null;
        this.listRefGetDataSave = {};
        this.refFlatList = null;
        this.refApproval = null;

        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', () => {
            this.setState({ isVisibleKeyboard: true });
        });
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', () => {
            // console.log('keyboardDidHide');
            this.setState({ isVisibleKeyboard: false });
        });
    }

    componentWillUnmount = () => {
        this.keyboardDidShowListener && this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener && this.keyboardDidHideListener.remove();
    };

    //#region [khởi tạo - lấy các dữ liệu cho control, lấy giá trị mặc đinh]
    setVariable = () => {
        //biến trạng thái
        this.isModify = false;
        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;

        // Bao nhiêu cấp duyệt
        this.levelApprove = null;

        // Thông báo chi tiết lỗi
        this.IsContinueSave = false;
        this.ProfileRemoveIDs = null;
        this.IsRemoveAndContinue = null;
        this.CacheID = null;

        this.ToasterSevice = {
            showError: null,
            showSuccess: null,
            showWarning: null,
            showInfo: null
        };

        this.AlertSevice = {
            alert: null
        };
    };

    getConfigValid = () => {
        let { fieldConfig } = this.state;
        const tblName = 'Attendance_FormRegisterLeaveDay';
        const profileInfo = dataVnrStorage
            ? dataVnrStorage.currentUser
                ? dataVnrStorage.currentUser.info
                : null
            : null;

        const { E_ProfileID, E_FullName } = EnumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] };
        VnrLoadingSevices.show();
        HttpService.Get(`[URI_CENTER]/api/Sys_common/GetValidateJson?listFormId=${tblName}`)
            .then((resConfig) => {
                VnrLoadingSevices.hide();
                let nextState = { Profile: _profile };

                if (resConfig) {
                    const data =
                        resConfig.Status == EnumName.E_SUCCESS && resConfig.Data && resConfig.Data[tblName]
                            ? resConfig.Data[tblName]
                            : null;
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
                    nextState = {
                        ...nextState,
                        fieldConfig: fieldConfig
                    };
                }

                this.setState({ ...nextState }, () => {
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
            })
            .catch((error) => {
                VnrLoadingSevices.hide();
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            });
    };

    initData = () => {
        // nhan.nguyen: Task: 0171440
        // const profileInfo = dataVnrStorage
        //     ? dataVnrStorage.currentUser
        //         ? dataVnrStorage.currentUser.info
        //         : null
        //     : null;

        // const { E_ProfileID, E_FullName } = EnumName,
        //     _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] };

        // const { Profile } = this.state;

        // let nextState = {
        //     Profile: {
        //         ...Profile,
        //         ..._profile,
        //     },
        // };

        // this.setState(nextState, () => {
        //     //[CREATE] Step 4: Lấy cấp duyệt .
        //     this.getHighSupervisor();
        //     const { params, DateFromTo, SimilarRegistration } = this.state;
        //     if (params.listItem && params.listItem.length > 0) {
        //         // Trường hợp tạo mới từ ngày công
        //         let listday = params.listItem.map((item) => moment(item.WorkDate).format('YYYY-MM-DD'))
        //         this.setState({
        //             DateFromTo: {
        //                 ...DateFromTo,
        //                 value: listday ? listday : [],
        //                 refresh: !DateFromTo.refresh,
        //             },
        //             SimilarRegistration: {
        //                 value: false,
        //                 refresh: !SimilarRegistration.refresh
        //             },
        //             isShowModal: true,
        //         })
        //     } else {
        //         // Show modal chọn ngày đăng ký
        //         if (this.refVnrDateFromTo && this.refVnrDateFromTo.showModal) {
        //             this.refVnrDateFromTo.showModal();
        //         }
        //     }
        // });

        //[CREATE] Step 4: Lấy cấp duyệt .

        const { params, DateFromTo, SimilarRegistration } = this.state;
        if (params.listItem && params.listItem.length > 0) {
            // Trường hợp tạo mới từ ngày công
            let listday = params.listItem.map((item) => moment(item.WorkDate).format('YYYY-MM-DD'));
            this.setState(
                {
                    DateFromTo: {
                        ...DateFromTo,
                        value: listday ? listday : [],
                        refresh: !DateFromTo.refresh
                    },
                    SimilarRegistration: {
                        value: false,
                        refresh: !SimilarRegistration.refresh
                    },
                    isShowModal: true
                },
                () => {
                    this.getRemainLeave();
                    this.getApprovalProcess();
                }
            );
        } else if (this.refVnrDateFromTo && this.refVnrDateFromTo.showModal) {
            this.refVnrDateFromTo.showModal();
        }
    };

    getHighSupervisor = (totalLeaveDay, LeaveDayTypeID, DateStart, DateEnd) => {
        const { Profile } = this.state;
        if (totalLeaveDay != null) {
            this.showLoading(true);
            HttpService.Post('[URI_CENTER]/api/Att_GetData/GetHighSupervisor', {
                ProfileID: Profile.ID,
                userSubmit: Profile.ID,
                TotalLeaveDay: totalLeaveDay ? totalLeaveDay : null,
                type: 'E_LEAVE_DAY',
                LeaveDayTypeID: LeaveDayTypeID ? LeaveDayTypeID.ID : null,
                DateStart: DateStart ? DateStart : null,
                DateEnd: DateEnd ? DateEnd : null
            }).then((resData) => {
                this.showLoading(false);

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

                    this.setState(nextState, () => {});
                }
            });
        }
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

    showLoading = (isShow) => {
        this.setState({
            isShowLoading: isShow
        });
    };

    _renderHeaderLoading = () => {
        if (this.state.isShowLoading) {
            return (
                <View style={styles.styLoadingHeader}>
                    <View style={styles.styViewLoading} />
                    <VnrIndeterminate isVisible={this.state.isShowLoading} />
                </View>
            );
        } else return <View />;
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        // trường hợp có get config thì vào hàm này get
        _handleSetState(record);
    };

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
                value: {
                    startDate: moment(response.DateStart).format('YYYY-MM-DD'),
                    endDate: moment(response.DateEnd).format('YYYY-MM-DD')
                },
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
                value: response.UserApproveID
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
            this.getRemainLeave();
        });
    };

    refreshForm = () => {
        this.AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            title: 'HRM_PortalApp_OnReset',
            message: 'HRM_PortalApp_OnReset_Message',
            onCancel: () => {},
            onConfirm: () => {
                const { DateFromTo, SimilarRegistration } = this.state;
                if (DateFromTo.value && DateFromTo.value.length > 0) {
                    const { params } = this.state;

                    let { record } = params;

                    if (!record) {
                        // nếu bấm refresh lấy lại cấp duyệt
                        this.getApprovalProcess();
                    } else {
                        // Nếu bấm refresh khi Chỉnh sửa
                        this.isModify = true;
                        this.getRecordAndConfigByID(record, this.handleSetState);
                    }

                    if (Array.isArray(DateFromTo.value) && DateFromTo.value.length > 0) {
                        if (SimilarRegistration.value && DateFromTo.value.length > 1) {
                            // Đăng ký nhiều ngày cùng lcheck
                            const key = JSON.stringify(DateFromTo.value);
                            if (this.listRefGetDataSave[key]) this.listRefGetDataSave[key].unduData();
                        } else {
                            // Đăng ký từng ngày, 1 ngày
                            DateFromTo.value.map((item) => {
                                if (this.listRefGetDataSave[item]) this.listRefGetDataSave[item].unduData();
                            });
                        }
                    } else if (DateFromTo.value.startDate && DateFromTo.value.endDate) {
                        const key = `${DateFromTo.value.startDate}-${DateFromTo.value.endDate}`;
                        if (this.listRefGetDataSave[key]) this.listRefGetDataSave[key].unduData();
                    }
                }
            }
        });
    };
    //#endregion

    delete = (item) => {
        const { DateFromTo } = this.state;
        let rs = DateFromTo.value.filter((e) => {
            return moment(e).isSame(moment(item)) === false;
        });
        this.setState({
            DateFromTo: {
                ...DateFromTo,
                value: rs,
                refresh: !DateFromTo.refresh
            }
        });
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

    onDeleteItemDay = (index) => {
        this.AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            title: 'HRM_PortalApp_OnDeleteItemDay',
            textRightButton: 'Confirm',
            onCancel: () => {},
            onConfirm: () => {
                const { DateFromTo } = this.state;
                if (DateFromTo.value && Array.isArray(DateFromTo.value) && DateFromTo.value.length > 1) {
                    if (this.listRefGetDataSave[DateFromTo.value[index]]) {
                        delete this.listRefGetDataSave[DateFromTo.value[index]];
                    }
                    // Xóa
                    DateFromTo.value.splice(index, 1);

                    this.setState({
                        DateFromTo: {
                            ...DateFromTo,
                            value: DateFromTo.value,
                            refresh: !DateFromTo.refresh
                        }
                    });
                }
            }
        });
    };

    onUpdateDay = (index, date) => {
        const { DateFromTo, SimilarRegistration } = this.state;
        if (DateFromTo.value && Array.isArray(DateFromTo.value) && DateFromTo.value.length > 0) {
            if (SimilarRegistration.value) {
                this.setState(
                    {
                        DateFromTo: {
                            ...DateFromTo,
                            value: date,
                            refresh: !DateFromTo.refresh
                        }
                    },
                    () => this.getApprovalProcess()
                );
            } else {
                if (DateFromTo.value[index]) DateFromTo.value[index] = moment(new Date(date)).format('YYYY-MM-DD');

                this.setState(
                    {
                        DateFromTo: {
                            ...DateFromTo,
                            value: DateFromTo.value,
                            refresh: !DateFromTo.refresh
                        }
                    },
                    () => this.getApprovalProcess()
                );
            }
        } else if (date.endDate && date.startDate) {
            this.setState(
                {
                    DateFromTo: {
                        ...DateFromTo,
                        value: date,
                        refresh: !DateFromTo.refresh
                    }
                },
                () => this.getApprovalProcess()
            );
        }
    };

    onChangeDateFromTo = (range) => {
        const { DateFromTo } = this.state;
        this.listRefGetDataSave = {};
        this.setState(
            {
                DateFromTo: {
                    ...DateFromTo,
                    value: range,
                    refresh: !DateFromTo.refresh
                },
                isShowModal: true
            },
            () => {
                this.getRemainLeave();
                this.getApprovalProcess();
            }
        );
    };

    renderApprove = () => {
        return (
            <View style={styles.styViewApprove}>
                <TouchableOpacity
                    style={styles.styBtnShowApprove}
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

    onSaveAndSend = () => {
        this.onSave(true);
    };

    onSaveTemp = () => {
        this.onSave(false, true);
    };

    onSave = (isSend, isconfirm) => {
        if (this.isProcessing) return;
        let lstLeaveDayItem = [];
        const { DateFromTo, Profile, modalErrorDetail, params, SimilarRegistration } = this.state,
            { apiConfig } = dataVnrStorage,
            { uriPor } = apiConfig,
            { record } = params;
        let dataApprovalProcess = [];

        if (typeof this.refApproval?.getData === 'function') {
            dataApprovalProcess = this.refApproval?.getData();
        }

        if (Array.isArray(DateFromTo.value) && DateFromTo.value.length > 0) {
            if (SimilarRegistration.value && DateFromTo.value.length > 1) {
                // Đăng ký nhiều ngày cùng lúc
                const key = JSON.stringify(DateFromTo.value);
                if (this.listRefGetDataSave[key]) {
                    let data = this.listRefGetDataSave[key].getAllData();
                    if (data) {
                        const { lstLeaveDaysHours } = data;

                        DateFromTo.value.map((item) => {
                            // Gán lại LeavesDay và LeavesHours vì dữ liệu trả ra đã bị cộng dồn lại.
                            const dataLeaveDaysHours = lstLeaveDaysHours ? lstLeaveDaysHours[item] : null;

                            lstLeaveDayItem.push({
                                ...data,
                                DataApprove: dataApprovalProcess,
                                LeaveDays:
                                    dataLeaveDaysHours && dataLeaveDaysHours.LeaveDays
                                        ? dataLeaveDaysHours.LeaveDays
                                        : 0,
                                LeaveHours:
                                    dataLeaveDaysHours && dataLeaveDaysHours.LeaveHours
                                        ? dataLeaveDaysHours.LeaveHours
                                        : 0,
                                DateStart: moment(item).format('YYYY/MM/DD'),
                                DateEnd: moment(item).format('YYYY/MM/DD'),
                                //	0184782: [Hotfix_ KOG_v8.11. 21.01.10.217]: Lỗi hiển thị số giờ nghỉ không đúng khi đăng ký ngày nghỉ trên app.
                                ShiftID: data?.ShiftIDByDate[item] ? data?.ShiftIDByDate[item] : null
                            });
                        });
                    }
                }
            } else {
                // Đăng ký từng ngày, 1 ngày
                DateFromTo.value.map((item) => {
                    if (this.listRefGetDataSave[item]) {
                        let data = this.listRefGetDataSave[item].getAllData();
                        if (data) {
                            lstLeaveDayItem.push({ ...data, DataApprove: dataApprovalProcess });
                        }
                    }
                });
            }
        } else if (DateFromTo.value.startDate && DateFromTo.value.endDate) {
            const key = `${DateFromTo.value.startDate}-${DateFromTo.value.endDate}`;

            if (this.listRefGetDataSave[key]) {
                let data = this.listRefGetDataSave[key].getAllData();
                if (data) {
                    lstLeaveDayItem.push({ ...data, DataApprove: dataApprovalProcess });
                }
            }
        }

        // if (lstLeaveDayItem.length > 0) {
        //     let checkValid = true;
        //     for (let index = 0; index < lstLeaveDayItem.length; index++) {
        //         const item = lstLeaveDayItem[index];
        //         if ((fieldConfig.LeaveDayTypeID.isValid && item.LeaveDayTypeID == null) ||
        //             (fieldConfig.Comment.isValid && (item.Comment == null || item.Comment == '')) ||
        //             (fieldConfig.FileAttachment.isValid && item.FileAttachment == null) ||
        //             (fieldConfig.DurationType.isValid && item.DurationType == null)
        //         ) {
        //             checkValid = false;
        //             break;
        //         }
        //     }

        //     if (checkValid == false) {
        //         this.setState({ isCheckEmpty: true }, () => {
        //             this.ToasterSevice.showWarning('HRM_PortalApp_InputValue_Please');
        //         })
        //         return false;
        //     }
        // }

        let payload = {};
        if (lstLeaveDayItem.length > 0) {
            payload = {
                ...payload,
                ID: record && record.ID ? record.ID : null,
                ProfileIDs: Profile.ID,

                UserSubmit: Profile.ID,
                Host: uriPor,
                ListLeaveDayItem: lstLeaveDayItem,
                Status: 'E_SUBMIT_TEMP',

                ProfileRemoveIDs: this.ProfileRemoveIDs,
                IsRemoveAndContinue: this.IsRemoveAndContinue,
                CacheID: this.CacheID,
                IsContinueSave: this.IsContinueSave
            };

            if (isSend) {
                payload = {
                    ...payload,
                    IsAddNewAndSendMail: true
                };
                AttSubmitTakeLeaveDayBusinessFunction.checkForReLoadScreen[ScreenName.AttSubmitTakeLeaveDay] = true;
                AttSubmitTakeLeaveDayBusinessFunction.checkForReLoadScreen[ScreenName.AttSaveTempSubmitTakeLeaveDay] =
                    true;
                AttSubmitTakeLeaveDayBusinessFunction.checkForReLoadScreen[ScreenName.AttApproveSubmitTakeLeaveDay] =
                    true;
            }
            const callSave = () => {
                this.isProcessing = true;
                this.showLoading(true);

                HttpService.Post('[URI_CENTER]/api/Att_LeaveDay/CreateOrUpdateLeaveday', payload).then((res) => {
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
                                            message: translate(
                                                'HRM_Attendance_Message_InvalidRequestDataPleaseCheckAgain'
                                            ),
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
                                            onCancel: () => {},
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
                                            message: translate(
                                                'HRM_Attendance_Message_InvalidRequestDataPleaseCheckAgain'
                                            ),
                                            textRightButton: translate('Button_Detail'),
                                            //đóng popup
                                            onCancel: () => {},
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
                                        onCancel: () => {},
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
            };

            if (isconfirm) {
                this.AlertSevice.alert({
                    iconType: EnumIcon.E_CONFIRM,
                    title: 'HRM_PortalApp_OnSave_Temp',
                    message: 'HRM_PortalApp_OnSave_Temp_Message',
                    onCancel: () => {},
                    onConfirm: () => {
                        callSave();
                        AttSubmitTakeLeaveDayBusinessFunction.checkForReLoadScreen[ScreenName.AttSubmitTakeLeaveDay] =
                            true;
                        AttSubmitTakeLeaveDayBusinessFunction.checkForReLoadScreen[
                            ScreenName.AttSaveTempSubmitTakeLeaveDay
                        ] = true;
                    }
                });
            } else {
                callSave();
            }
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

    renderErrorDetail = () => {
        const { modalErrorDetail } = this.state,
            { data } = modalErrorDetail;

        if (data) {
            const dataGroup = this.groupByMessage(data, 'MessageName'),
                dataSourceError = this.mappingDataGroup(dataGroup);

            return dataSourceError.map((dataItem, index) => {
                let viewContent = <View />;
                if (dataItem['Type'] && dataItem['Type'] == 'E_GROUP') {
                    viewContent = (
                        <View style={styles.styleViewTitleGroup}>
                            <VnrText
                                style={[styleSheets.lable, styles.styFontErrTitle]}
                                i18nKey={dataItem['TitleGroup']}
                            />
                        </View>
                    );
                } else {
                    viewContent = (
                        <View style={styles.styFontErrInfo}>
                            <View style={styles.styFontErrLine}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styles.styFontErrText]}
                                    i18nKey={'HRM_PortalApp_Message_ErrorCodeEmp'}
                                />

                                <View style={styles.styFontErrVal}>
                                    <Text numberOfLines={1} style={[styleSheets.textItalic, styles.styFontErrText]}>
                                        {dataItem['CodeEmp']}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.styFontErrLine}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styles.styFontErrText]}
                                    i18nKey={'HRM_PortalApp_Message_ErrorProfileName'}
                                />

                                <View style={styles.styFontErrVal}>
                                    <Text numberOfLines={1} style={[styleSheets.textItalic, styles.styFontErrText]}>
                                        {dataItem['ProfileName']}
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.styFontErrLine}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styles.styFontErrText]}
                                    i18nKey={'HRM_PortalApp_Message_ErrorDescription'}
                                />

                                <View style={styles.styFontErrVal}>
                                    <Text style={[styleSheets.textItalic, styles.styFontErrText]}>
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
                            styles.styleViewBorderButtom,
                            dataSourceError.length - 1 == index && styles.styleViewNoBorder
                        ]}
                    >
                        {viewContent}
                    </View>
                );
            });
        } else {
            return <View />;
        }
    };

    getRemainLeave = () => {
        const { Profile } = this.state;
        HttpService.Get(`[URI_CENTER]/api/Att_LeaveDay/GetLeaveDayFundsRemaining?profileID=${Profile.ID}`).then(
            (resGetRemaining) => {
                let nextState = {};
                if (
                    resGetRemaining?.Status === 'SUCCESS' &&
                    Array.isArray(resGetRemaining?.Data) &&
                    resGetRemaining?.Data.length > 0
                ) {
                    // Cộng tất cả LeaveDaysRegister
                    const totalLeaveDays = resGetRemaining?.Data.reduce((sum, item) => {
                        const text = item?.FundsRemainingDetail?.LeaveDaysRegister || '0';
                        const num = parseFloat(text); // parse "1.00 Ngày" → 1.00
                        return sum + (isNaN(num) ? 0 : num);
                    }, 0);
                    nextState = {
                        ...nextState,
                        totalRemain: totalLeaveDays,
                        listRemainingLeaveFunds: [...resGetRemaining?.Data],
                        isConfigRemainLeavefunds: true,
                        isLoadingGetRemain: false
                    };
                } else {
                    nextState = {
                        ...nextState,
                        totalRemain: 0,
                        listRemainingLeaveFunds: [],
                        isConfigRemainLeavefunds: false,
                        isLoadingGetRemain: false
                    };
                }

                this.setState({ ...nextState });
            }
        );
    };

    renderRemain = () => {
        const { listRemainingLeaveFunds, totalRemain } = this.state;
        if (listRemainingLeaveFunds?.length > 0) {
            return (
                <View style={customStyle.remainingLeaveContainer}>
                    <View style={customStyle.remainingLeaveHeader}>
                        <IconInfo size={Size.iconSize} color={Colors.blue} />
                        <Text style={customStyle.remainingLeaveTitle}>{translate('HRM_Total_Leave_Balance')}</Text>
                    </View>

                    <View style={CustomStyleSheet.marginLeft(12)}>
                        {listRemainingLeaveFunds.map((item, index) => (
                            <View key={index} style={customStyle.row}>
                                <View style={customStyle.dot} />
                                <Text style={customStyle.text}>
                                    {item?.TypeName ?? ''}: {item?.FundsRemainingDetail?.TotalRemain ?? '0.00'}
                                </Text>
                            </View>
                        ))}
                    </View>

                    <View>
                        <Text style={[CustomStyleSheet.fontSize(14), CustomStyleSheet.fontWeight('700')]}>
                            {translate('HRM_PortalApp_LeaveDay_TotalLeaveDaysTaken')}: {totalRemain}{' '}
                            {translate('HRM_PortalApp_TSLRegister_day')}
                        </Text>
                    </View>
                </View>
            );
        } else return <View />;
    };

    getErrorMessageRespone() {
        const { modalErrorDetail, Profile } = this.state,
            { cacheID } = modalErrorDetail;

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

    // Thay đổi đăng ký tương tự
    onChangeSimilarRegistration = (value) => {
        const { SimilarRegistration } = this.state;

        this.setState({
            SimilarRegistration: {
                ...SimilarRegistration,
                value: value,
                refresh: !SimilarRegistration.refresh
            }
        });
    };

    componentDidMount() {
        PermissionForAppMobile.value = {
            ...PermissionForAppMobile.value,
            Sys_ProcessApprove_ChangeProcess: {
                View: true
            }
        };
    }

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

    ToasterSeviceCallBack = () => {
        return this.ToasterSevice;
    };

    renderItems = () => {
        const { DateFromTo, SimilarRegistration, fieldConfig, params, isCheckEmpty, dataApprovalProcess } = this.state;
        if (Array.isArray(DateFromTo.value) && DateFromTo.value.length > 0) {
            if (SimilarRegistration.value && DateFromTo.value.length > 1) {
                // Đăng ký nhiều ngày cùng lúc
                const key = JSON.stringify(DateFromTo.value);
                return (
                    <FlatList
                        ref={(refs) => (this.refFlatList = refs)}
                        style={styles.styFlatListContainer}
                        data={[key]}
                        renderItem={({ item, index }) => (
                            <AttTakeLeaveDayComponent
                                key={item}
                                ref={(refCom) => {
                                    this.listRefGetDataSave[`${item}`] = refCom;
                                }}
                                levelApprove={this.levelApprove}
                                acIsCheckEmpty={isCheckEmpty}
                                onUpdateDay={this.onUpdateDay}
                                onDeleteItemDay={this.onDeleteItemDay}
                                isRefresh={DateFromTo.refresh}
                                indexDay={index}
                                dateRage={DateFromTo.value}
                                record={params?.record}
                                fieldConfig={fieldConfig}
                                showLoading={this.showLoading}
                                isSimilarRegistration={true}
                                isShowDelete={false}
                                ToasterSevice={() => this.ToasterSeviceCallBack()}
                                updateShowRemain={this.updateShowRemain}
                                onScrollToInputIOS={this.onScrollToInputIOS}
                                getHighSupervisor={this.getHighSupervisor}
                                showRemain={this.state.isShowRemain}
                            />
                        )}
                        keyExtractor={(item, index) => index}
                        ItemSeparatorComponent={() => <View style={styles.separate} />}
                        ListFooterComponent={() => {
                            return (
                                <VnrApprovalProcess
                                    ref={(ref) => (this.refApproval = ref)}
                                    ToasterSevice={() => this.ToasterSeviceCallBack()}
                                    isEdit={
                                        PermissionForAppMobile.value?.['Sys_ProcessApprove_ChangeProcess']?.['View']
                                    }
                                    data={dataApprovalProcess}
                                />
                            );
                        }}
                        ListHeaderComponent={this.renderRemain}
                    />
                );
            } else {
                // Đăng ký từng ngày, 1 ngày
                return (
                    <FlatList
                        ref={(refs) => (this.refFlatList = refs)}
                        style={styles.styFlatListContainer}
                        data={DateFromTo.value}
                        renderItem={({ item, index }) => (
                            <AttTakeLeaveDayComponent
                                key={item}
                                ref={(refCom) => {
                                    this.listRefGetDataSave[`${item}`] = refCom;
                                }}
                                levelApprove={this.levelApprove}
                                acIsCheckEmpty={isCheckEmpty}
                                onUpdateDay={this.onUpdateDay}
                                onDeleteItemDay={this.onDeleteItemDay}
                                isRefresh={DateFromTo.refresh}
                                indexDay={index}
                                workDate={item}
                                record={params?.record}
                                fieldConfig={fieldConfig}
                                showLoading={this.showLoading}
                                ToasterSevice={() => this.ToasterSeviceCallBack()}
                                updateShowRemain={this.updateShowRemain}
                                onScrollToInputIOS={this.onScrollToInputIOS}
                                isShowDelete={
                                    Array.isArray(DateFromTo.value) && DateFromTo.value.length == 1 ? false : true
                                }
                                getHighSupervisor={this.getHighSupervisor}
                                showRemain={this.state.isShowRemain}
                            />
                        )}
                        keyExtractor={(item, index) => index}
                        ItemSeparatorComponent={() => <View style={styles.separate} />}
                        ListFooterComponent={() => {
                            return (
                                <VnrApprovalProcess
                                    ref={(ref) => (this.refApproval = ref)}
                                    ToasterSevice={() => this.ToasterSeviceCallBack()}
                                    isEdit={
                                        PermissionForAppMobile.value?.['Sys_ProcessApprove_ChangeProcess']?.['View']
                                    }
                                    data={dataApprovalProcess}
                                />
                            );
                        }}
                        ListHeaderComponent={this.renderRemain}
                    />
                );
            }
        } else if (DateFromTo.value.startDate && DateFromTo.value.endDate) {
            // Đăng ký nhiều ngày liên tục
            const key = `${DateFromTo.value.startDate}-${DateFromTo.value.endDate}`;
            return (
                <FlatList
                    ref={(refs) => (this.refFlatList = refs)}
                    style={styles.styFlatListContainer}
                    data={[key]}
                    renderItem={({ item, index }) => (
                        <AttTakeLeaveDayComponent
                            key={item}
                            ref={(refCom) => {
                                this.listRefGetDataSave[`${item}`] = refCom;
                            }}
                            levelApprove={this.levelApprove}
                            acIsCheckEmpty={isCheckEmpty}
                            onUpdateDay={this.onUpdateDay}
                            onDeleteItemDay={this.onDeleteItemDay}
                            isRefresh={DateFromTo.refresh}
                            indexDay={index}
                            dateRage={DateFromTo.value}
                            record={params?.record}
                            fieldConfig={fieldConfig}
                            showLoading={this.showLoading}
                            isSimilarRegistration={true}
                            isShowDelete={false}
                            updateShowRemain={this.updateShowRemain}
                            ToasterSevice={() => this.ToasterSeviceCallBack()}
                            onScrollToInputIOS={this.onScrollToInputIOS}
                            getHighSupervisor={this.getHighSupervisor}
                            showRemain={this.state.isShowRemain}
                        />
                    )}
                    keyExtractor={(item, index) => index}
                    ItemSeparatorComponent={() => <View style={styles.separate} />}
                    ListFooterComponent={() => {
                        return (
                            <VnrApprovalProcess
                                ref={(ref) => (this.refApproval = ref)}
                                ToasterSevice={() => this.ToasterSeviceCallBack()}
                                isEdit={PermissionForAppMobile.value?.['Sys_ProcessApprove_ChangeProcess']?.['View']}
                                data={dataApprovalProcess}
                            />
                        );
                    }}
                    ListHeaderComponent={this.renderRemain}
                />
            );
        }
    };

    updateShowRemain = (value) => {
        const { remain, LeaveDayNoFundDetail } = value;
        this.setState({
            isShowRemain: {
                visible: (!!remain && remain !== 0) || value?.IsLeaveDayNoFund ? true : false,
                value: value?.IsLeaveDayNoFund ? LeaveDayNoFundDetail : remain,
                isPrioritize: value?.IsLeaveDayNoFund
            }
        });
    };

    //change duyệt đầu
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

    getApprovalProcess = () => {
        const { Profile, DateFromTo } = this.state;
        if (!Profile.ID || !DateFromTo.value) return;

        this.showLoading(true);
        const payload = {
            ProfileID: Profile.ID,
            WorkDate: Array.isArray(DateFromTo.value)
                ? moment(DateFromTo.value[0]).format('YYYY/MM/DD')
                : moment(DateFromTo.value).format('YYYY/MM/DD'),
            BusinessType: 'E_LEAVEDAY'
        };

        HttpService.Post('[URI_CENTER]/api/Sys_Common/GetDataApproveByProfileID', payload)
            .then((res) => {
                this.showLoading(false);
                if (res?.Status === EnumName.E_SUCCESS) {
                    this.setState({
                        dataApprovalProcess: res.Data
                    });
                } else {
                    this.ToasterSevice.showError('HRM_PortalApp_CannotFetchApprovalProcess');
                }
            })
            .catch(() => {
                this.showLoading(false);
                this.ToasterSevice.showError('HRM_PortalApp_CannotFetchApprovalProcess');
            });
    };

    render() {
        const {
            DateFromTo,
            isShowModal,
            SimilarRegistration,
            /// lỗi chi tiết
            modalErrorDetail,
            // ---------- //
            isVisibleKeyboard
        } = this.state;

        if (Object.keys(this.state).length == 0) return <View />;

        const listActions = [];
        listActions.push({
            type: EnumName.E_REFRESH,
            title: '',
            onPress: () => this.refreshForm()
        });
        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['HRM_PortalV3_Att_LeaveDay_BtnSaveTemp'] &&
            PermissionForAppMobile.value['HRM_PortalV3_Att_LeaveDay_BtnSaveTemp']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_TEMP,
                title: '',
                onPress: () => this.onSaveTemp()
            });
        }
        listActions.push({
            type: EnumName.E_REGISTER,
            title: 'HRM_PortalApp_Register',
            onPress: () => this.onSaveAndSend()
        });

        return (
            <View style={styles.container}>
                <VnrDateFromTo
                    ref={(ref) => (this.refVnrDateFromTo = ref)}
                    // key={DateFromTo.id}
                    refresh={DateFromTo.refresh}
                    value={DateFromTo.value === null ? {} : DateFromTo.value}
                    displayOptions={true}
                    onlyChooseEveryDay={false}
                    disable={DateFromTo.disable}
                    onFinish={(range) => this.onChangeDateFromTo(range)}
                />

                {DateFromTo.value !== null ? (
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={isShowModal} //isShowModal
                    >
                        <SafeAreaView style={styles.wrapInsideModal}>
                            <ToasterInModal ref={(refs) => (this.ToasterSevice = refs)} />
                            <AlertInModal ref={(refs) => (this.AlertSevice = refs)} />

                            <View style={styles.flRowSpaceBetween}>
                                <VnrText
                                    style={[styleSheets.lable, styles.styHeaderText]}
                                    i18nKey={
                                        this.isModify
                                            ? 'HRM_PortalApp_TakeLeaveDay_Update'
                                            : 'HRM_PortalApp_TakeLeaveDay_Create'
                                    }
                                />
                                <TouchableOpacity onPress={() => this.onClose()}>
                                    <IconCloseCircle size={Size.iconSize} color={Colors.gray_8} />
                                </TouchableOpacity>
                            </View>

                            <View style={styles.styViewLogo}>
                                <Image source={require('../../../../../assets/images/vnrDateFromTo/Group.png')} />
                            </View>

                            {this._renderHeaderLoading()}

                            {/* Đăng ký tương tự */}
                            {SimilarRegistration.visible &&
                                SimilarRegistration.visibleConfig &&
                                DateFromTo.value &&
                                Array.isArray(DateFromTo.value) &&
                                DateFromTo.value.length > 1 && (
                                    <View>
                                        <VnrSwitch
                                            lable={'HRM_PortalApp_TakeLeave_Similar'}
                                            subLable={'HRM_PortalApp_TakeLeave_Similar_Detail'}
                                            value={SimilarRegistration.value}
                                            onFinish={(value) => {
                                                this.onChangeSimilarRegistration(value);
                                            }}
                                        />
                                    </View>
                                )}

                            <KeyboardAvoidingView
                                scrollEnabled={true}
                                style={styles.styAvoiding}
                                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                            >
                                {this.renderItems()}
                            </KeyboardAvoidingView>

                            {/* button */}
                            {!isVisibleKeyboard && (
                                <View style={styles.alignItems}>
                                    <ListButtonRegister listActions={listActions} />
                                </View>
                            )}
                        </SafeAreaView>

                        {modalErrorDetail.isModalVisible && (
                            <Modal animationType="slide" transparent={true} isVisible={true}>
                                <View style={styles.wrapModalError}>
                                    <TouchableOpacity
                                        style={[styles.bgOpacity]}
                                        onPress={() => this.closeModalErrorDetail()}
                                    />
                                    <SafeAreaView style={styles.wrapContentModalError}>
                                        <View style={styles.wrapTitileHeaderModalError}>
                                            <VnrText
                                                style={[styleSheets.text, styles.styRegister, styles.fS16fW600]}
                                                i18nKey={'HRM_PortalApp_Message_ErrorDetail'}
                                            />

                                            <TouchableOpacity onPress={() => this.closeModalErrorDetail()}>
                                                <IconCloseCircle size={Size.iconSize} color={Colors.white} />
                                            </TouchableOpacity>
                                        </View>
                                        <ScrollView style={styles.wrapLevelError}>
                                            {this.renderErrorDetail()}
                                        </ScrollView>
                                    </SafeAreaView>
                                </View>
                            </Modal>
                        )}
                    </Modal>
                ) : null}
            </View>
        );
    }
}

const styles = styleComonAddOrEdit;
const customStyle = StyleSheet.create({
    row: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 6
    },
    dot: {
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: Colors.black, // màu dot
        marginRight: 8
    },
    text: {
        fontSize: 14,
        color: Colors.black
    },
    remainingLeaveContainer: {
        flex: 1,
        backgroundColor: Colors.blue_transparent_8,
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderTopColor: Colors.gray_5,
        borderTopWidth: 0.5,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    },
    remainingLeaveHeader: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    remainingLeaveTitle: {
        marginLeft: 6,
        fontSize: 16,
        fontWeight: '600',
        color: Colors.blue
    }
});

export default AttSubmitTakeLeaveDayAddOrEdit;
