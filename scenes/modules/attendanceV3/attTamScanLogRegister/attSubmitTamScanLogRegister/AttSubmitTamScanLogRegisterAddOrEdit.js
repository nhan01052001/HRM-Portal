import React from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    Image,
    Modal,
    FlatList,
    ScrollView,
    Platform,
    KeyboardAvoidingView,
    Keyboard
} from 'react-native';
import moment from 'moment';
import { IconCloseCircle } from '../../../../../constants/Icons';
import { Colors, CustomStyleSheet, Size, styleSheets } from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import { translate } from '../../../../../i18n/translate';
import VnrDateFromTo from '../../../../../componentsV3/VnrDateFromTo/VnrDateFromTo';
import AttTamScanLogRegisterComponent from './AttTamScanLogRegisterComponent';
import VnrApprovalProcess from '../../../../../componentsV3/VnrApprovalProcess/VnrApprovalProcess';
import HttpService from '../../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { EnumIcon, EnumName, ScreenName } from '../../../../../assets/constant';
import VnrIndeterminate from '../../../../../components/VnrLoading/VnrIndeterminate';
import { AlertInModal } from '../../../../../components/Alert/Alert';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';
import { ToasterInModal, ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { SafeAreaView } from 'react-native-safe-area-context';
import { AttSubmitTamScanLogRegisterBusinessFunction } from './AttSubmitTamScanLogRegisterBusiness';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import ListButtonRegister from '../../../../../componentsV3/ListButtonRegister/ListButtonRegister';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';

const initSateDefault = {
    ID: null,
    Profile: {
        ID: null,
        ProfileName: '',
        disable: true
    },
    fieldConfig: {
        WorkDate: {
            visibleConfig: true,
            isValid: true
        },
        InTime: {
            visibleConfig: true,
            isValid: false
        },
        OutTime: {
            visibleConfig: true,
            isValid: false
        },
        PlaceID: {
            visibleConfig: true,
            isValid: false
        },
        MissInOutReason: {
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
        OrgStructureTransID: {
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
    isKeyboardShowOrHide: false,
    dataApprovalProcess: []
};

class AttSubmitTamScanLogRegisterAddOrEdit extends React.Component {
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
        this.keyboardDidShowListener = null;
        this.keyboardDidHideListener = null;
        this.refApproval = null;
    }

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

        this.ToasterSeviceCallBack = () => {
            return this.ToasterSevice;
        };
    };

    // getConfigValid = () => {
    //     const _configField =
    //         ConfigField && ConfigField.value['AttSubmitTamScanLogRegisterAddOrEdit']
    //             ? ConfigField.value['AttSubmitTamScanLogRegisterAddOrEdit']['Hidden']
    //             : [];

    //     let { fieldConfig } = this.state;

    //     _configField.forEach((fieldName) => {
    //         let _field = fieldConfig[fieldName];
    //         if (_field && typeof _field === 'object') {
    //             _field = {
    //                 ..._field,
    //                 visibleConfig: false,
    //             };

    //             fieldConfig = {
    //                 ...fieldConfig,
    //                 [fieldName]: _field,
    //             };
    //         }
    //     });

    //     this.setState({ fieldConfig }, () => {
    //         const { params } = this.state;

    //         let { record } = params;

    //         if (!record) {
    //             // [CREATE] Step 3: Tạo mới
    //             this.initData();
    //         } else {
    //             // [EDIT] Step 3: Chỉnh sửa
    //             this.isModify = true;
    //             this.getRecordAndConfigByID(record, this.handleSetState);
    //         }
    //     });
    // };

    getConfigValid = () => {
        let { fieldConfig } = this.state;
        const tblName = 'Attendance_FormRegisterTamScanLog';
        VnrLoadingSevices.show();
        HttpService.Get(`[URI_CENTER]/api/Sys_common/GetValidateJson?listFormId=${tblName}`).then(res => {
            VnrLoadingSevices.hide();
            const data = res.Status == EnumName.E_SUCCESS && res.Data && res.Data[tblName] ? res.Data[tblName] : null;
            if (data && Object.keys(data).length > 0) {
                const listControl = Object.keys(fieldConfig);
                listControl.forEach(key => {
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
                    this.initData();
                } else {
                    // [EDIT] Step 3: Chỉnh sửa
                    this.isModify = true;
                    this.getRecordAndConfigByID(record, this.handleSetState);
                }
            });
        });
    };

    initData = () => {
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
            const { params, DateFromTo } = this.state;
            if (params.listItem && params.listItem.length > 0) {
                // Trường hợp tạo mới từ ngày công
                let listday = params.listItem.map(item => moment(item.WorkDate).format('YYYY-MM-DD'));
                this.setState({
                    DateFromTo: {
                        ...DateFromTo,
                        value: listday ? listday : [],
                        refresh: !DateFromTo.refresh
                    },
                    isShowModal: true
                }, () => {
                    this.getApprovalProcess();
                });
            } else if (this.refVnrDateFromTo && this.refVnrDateFromTo.showModal) {
                this.refVnrDateFromTo.showModal();
            }
        });
    };

    getHighSupervisor = (OrgStructureTransID = null) => {
        const { Profile } = this.state;
        let payload = {};

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
            type: 'E_TAMSCANLOGREGISTER',
            ...payload
        }).then(resData => {
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
        });
    };

    // Step 1: Gọi hàm onShow để tạo mới hoặc chỉnh sửa hoặc onShowFromWorkDay để tạo mới
    onShow = params => {
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

    showLoading = isShow => {
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

    handleSetState = response => {
        const { DateFromTo, UserApprove, UserApprove3, UserApprove4, UserApprove2 } = this.state;

        this.levelApprove = response.LevelApproved ? response.LevelApproved : 4;

        let nextState = {
            isShowModal: true,
            DateFromTo: {
                ...DateFromTo,
                value: response.TimeLog ? [moment(response.TimeLog).format('YYYY-MM-DD')] : null,
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

        this.setState(nextState);
    };

    refreshForm = () => {
        this.AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            title: 'HRM_PortalApp_OnReset',
            message: 'HRM_PortalApp_OnReset_Message',
            onCancel: () => { },
            onConfirm: () => {
                const { DateFromTo } = this.state;
                if (DateFromTo.value && DateFromTo.value.length > 0) {
                    const { params } = this.state;

                    let { record } = params;

                    if (!record) {
                        // nếu bấm refresh lấy lại cấp duyệt
                        this.getApprovalProcess();
                    } else {
                        // ếu bấm refresh khi Chỉnh sửa
                        this.isModify = true;
                        this.getRecordAndConfigByID(record, this.handleSetState);
                    }

                    DateFromTo.value.map(item => {
                        if (this.listRefGetDataSave[item]) {
                            this.listRefGetDataSave[item].unduData();
                        }
                    });
                }
            }
        });
    };
    //#endregion

    delete = item => {
        const { DateFromTo } = this.state;
        let rs = DateFromTo.value.filter(e => {
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

    onDeleteItemDay = index => {
        this.AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            title: 'HRM_PortalApp_OnDeleteItemDay',
            textRightButton: 'Confirm',
            onCancel: () => { },
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
        const { DateFromTo } = this.state;
        if (DateFromTo.value && Array.isArray(DateFromTo.value) && DateFromTo.value.length > 0) {
            if (DateFromTo.value[index]) DateFromTo.value[index] = moment(date).format('YYYY-MM-DD');

            this.setState({
                DateFromTo: {
                    ...DateFromTo,
                    value: DateFromTo.value,
                    refresh: !DateFromTo.refresh
                }
            });
        }
    };

    onChangeDateFromTo = range => {
        const { DateFromTo } = this.state;
        this.listRefGetDataSave = {};
        this.setState({
            DateFromTo: {
                ...DateFromTo,
                value: range,
                refresh: !DateFromTo.refresh
            },
            isShowModal: true
        }, () => {
            this.getApprovalProcess();
        });
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
        let lstMissSave = [];
        const {
                DateFromTo,
                Profile,
                modalErrorDetail,
                params
            } = this.state,
            { apiConfig } = dataVnrStorage,
            { uriPor } = apiConfig,
            { record } = params;
        let dataApprovalProcess = [];

        if (typeof this.refApproval?.getData === 'function') {
            dataApprovalProcess = this.refApproval?.getData();
        }

        if (DateFromTo.value && DateFromTo.value.length > 0) {
            DateFromTo.value.map(item => {
                if (this.listRefGetDataSave[item]) {
                    let data = this.listRefGetDataSave[item].getAllData();
                    if (data) {
                        lstMissSave.push({
                            ...data,
                            DataApprove: dataApprovalProcess
                        });
                    }
                }
            });
        }
        let payload = {};

        if (lstMissSave.length > 0) {
            payload = {
                ...payload,
                ID: record && record.ID ? record.ID : null,
                ProfileIDs: Profile.ID,
                UserSubmit: Profile.ID,
                Host: uriPor,
                ListMissInOutSave: lstMissSave,
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
                AttSubmitTamScanLogRegisterBusinessFunction.checkForReLoadScreen[
                    ScreenName.AttSubmitTamScanLogRegister
                ] = true;
                AttSubmitTamScanLogRegisterBusinessFunction.checkForReLoadScreen[
                    ScreenName.AttSaveTempSubmitTamScanLogRegister
                ] = true;
                AttSubmitTamScanLogRegisterBusinessFunction.checkForReLoadScreen[
                    ScreenName.AttApproveSubmitTamScanLogRegister
                ] = true;
            }

            const callSave = () => {
                this.isProcessing = true;
                this.showLoading(true);
                HttpService.Post('[URI_CENTER]/api/Att_TAMScanLogRegister/CreateOrUpdateInOutRegister', payload).then(
                    res => {
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
                                                message: translate(
                                                    'HRM_Attendance_Message_InvalidRequestDataPleaseCheckAgain'
                                                ),
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
                                            message: translate(
                                                'HRM_Attendance_Message_InvalidRequestDataDoYouWantToSave'
                                            ),
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
                    }
                );
            };

            if (isconfirm) {
                this.AlertSevice.alert({
                    iconType: EnumIcon.E_CONFIRM,
                    title: 'HRM_PortalApp_OnSave_Temp',
                    message: 'HRM_PortalApp_OnSave_Temp_Message',
                    onCancel: () => { },
                    onConfirm: () => {
                        callSave();
                        AttSubmitTamScanLogRegisterBusinessFunction.checkForReLoadScreen[
                            ScreenName.AttSubmitTamScanLogRegister
                        ] = true;
                        AttSubmitTamScanLogRegisterBusinessFunction.checkForReLoadScreen[
                            ScreenName.AttSaveTempSubmitTamScanLogRegister
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

    getErrorMessageRespone() {
        const { modalErrorDetail, Profile } = this.state,
            { cacheID } = modalErrorDetail;

        this.showLoading(true);
        HttpService.Post('[URI_CENTER]/api/Att_GetData/GetErrorMessageRespone', {
            cacheID: cacheID,
            IsPortal: true,
            ProfileID: Profile.ID
        }).then(res => {
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

    getApprovalProcess = () => {
        const { Profile, DateFromTo } = this.state;
        if (!Profile.ID || !DateFromTo.value) return;

        this.showLoading(true);
        const payload = {
            'ProfileID': Profile.ID,
            'WorkDate': Array.isArray(DateFromTo.value) ? moment(DateFromTo.value[0]).format('YYYY/MM/DD') : moment(DateFromTo.value.startDate).format('YYYY/MM/DD'),
            'BusinessType': 'E_TAMSCANLOGREGISTER'
        };

        HttpService.Post('[URI_CENTER]/api/Sys_Common/GetDataApproveByProfileID', payload).then((res) => {
            this.showLoading(false);
            if (res?.Status === EnumName.E_SUCCESS) {
                this.setState({
                    dataApprovalProcess: res.Data
                });
            } else {
                this.ToasterSevice.showError('HRM_PortalApp_CannotFetchApprovalProcess');
            }

        }).catch(() => {
            this.showLoading(false);
            this.ToasterSevice.showError('HRM_PortalApp_CannotFetchApprovalProcess');
        });
    };

    UNSAFE_componentWillMount() {
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    _keyboardDidShow = () => {
        this.setState({
            isKeyboardShowOrHide: true
        });
    };

    _keyboardDidHide = () => {
        this.setState({
            isKeyboardShowOrHide: false
        });
    };

    render() {
        const {
            DateFromTo,
            isShowModal,

            params,
            /// lỗi chi tiết
            modalErrorDetail,
            // ---------- //
            fieldConfig,
            isKeyboardShowOrHide
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
            PermissionForAppMobile.value['HRM_PortalV3_Att_AttInOut_BtnSaveTemp'] &&
            PermissionForAppMobile.value['HRM_PortalV3_Att_AttInOut_BtnSaveTemp']['View']
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
                    ref={ref => (this.refVnrDateFromTo = ref)}
                    //key={DateFromTo.id}
                    refresh={DateFromTo.refresh}
                    value={DateFromTo.value === null ? {} : DateFromTo.value}
                    displayOptions={true}
                    onlyChooseEveryDay={true}
                    disable={DateFromTo.disable}
                    onFinish={range => this.onChangeDateFromTo(range)}
                />

                {DateFromTo.value !== null ? (
                    !DateFromTo.value.startDate || !DateFromTo.value.endDate ? (
                        <Modal
                            animationType="slide"
                            transparent={false}
                            visible={isShowModal} //isShowModal
                        >
                            <SafeAreaView style={styles.wrapInsideModal}>
                                <ToasterInModal ref={refs => (this.ToasterSevice = refs)} />
                                <AlertInModal ref={refs => (this.AlertSevice = refs)} />

                                <View style={styles.flRowSpaceBetween}>
                                    <VnrText
                                        style={[styleSheets.lable, styles.styHeaderText]}
                                        i18nKey={
                                            this.isModify
                                                ? 'HRM_PortalApp_TSLRegister_Update'
                                                : 'HRM_PortalApp_TSLRegister_Create'
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
                                <KeyboardAvoidingView
                                    scrollEnabled={true}
                                    style={styles.styAvoiding}
                                    behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                                >
                                    <FlatList
                                        ref={refs => (this.refFlatList = refs)}
                                        style={styles.styFlatListContainer}
                                        data={DateFromTo.value}
                                        renderItem={({ item, index }) => (
                                            <AttTamScanLogRegisterComponent
                                                key={item}
                                                ref={refCom => {
                                                    this.listRefGetDataSave[`${item}`] = refCom;
                                                }}
                                                levelApprove={this.levelApprove}
                                                onUpdateDay={this.onUpdateDay}
                                                onDeleteItemDay={this.onDeleteItemDay}
                                                isRefresh={false}
                                                indexDay={index}
                                                workDate={item}
                                                record={params?.record}
                                                fieldConfig={fieldConfig}
                                                showLoading={this.showLoading}
                                                onScrollToInputIOS={this.onScrollToInputIOS}
                                                ToasterSevice={() => this.ToasterSeviceCallBack()}
                                                isShowDelete={
                                                    Array.isArray(DateFromTo.value) && DateFromTo.value.length == 1
                                                        ? false
                                                        : true
                                                }
                                            />
                                        )}
                                        keyExtractor={(item, index) => index}
                                        ItemSeparatorComponent={() => <View style={styles.separate} />}
                                        ListFooterComponent={() => {
                                            const { dataApprovalProcess } = this.state;
                                            return <VnrApprovalProcess ref={(ref) => (this.refApproval = ref)} ToasterSevice={this.ToasterSeviceCallBack} isEdit={PermissionForAppMobile.value?.['Sys_ProcessApprove_ChangeProcess']?.['View']} data={dataApprovalProcess} />;
                                        }}
                                    />

                                    {/* button */}
                                    <ListButtonRegister
                                        listActions={listActions}
                                        isKeyboardShowOrHide={isKeyboardShowOrHide}
                                    />
                                </KeyboardAvoidingView>
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
                    ) : null
                ) : null}
            </View>
        );
    }
}

const styles = styleComonAddOrEdit;

export default AttSubmitTamScanLogRegisterAddOrEdit;
