import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    Size,
    stylesModalPopupBottom,
    styleViewTitleForGroup,
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
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName, EnumIcon } from '../../../../../assets/constant';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { IconColse } from '../../../../../constants/Icons';
import Modal from 'react-native-modal';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import Vnr_Function from '../../../../../utils/Vnr_Function';

let enumName = null,
    profileInfo = null;

const initSateDefault = {
    ID: null,
    Profile: {
        label: 'HRM_Attendance_Leaveday_ProfileID',
        ID: null,
        ProfileName: '',
        disable: true
    },
    WorkDate: {
        label: 'HRM_Attendance_Overtime_WorkDate',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    ShiftID: {
        label: 'HRM_Attendance_InOut_ShiftID',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: false
    },
    LateEarlyType: {
        label: 'LateEarlyTypeView',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: false
    },
    LateMinutes: {
        label: 'HRM_Attendance_LateEarlyAllowed_LateMinutes',
        disable: false,
        refresh: false,
        value: '0',
        visible: false,
        visibleConfig: true
    },
    EarlyMinutes: {
        label: 'HRM_Attendance_LateEarlyAllowed_EarlyMinutes',
        disable: false,
        refresh: false,
        value: '0',
        visible: false,
        visibleConfig: true
    },
    LateEarlyReasonID: {
        label: 'HRM_Attendance_LateEarlyAllowed_OvertimeResonLateName',
        disable: false,
        refresh: false,
        value: '',
        visible: false,
        visibleConfig: true
    },
    EarlyLateReasonID: {
        label: 'HRM_Attendance_LateEarlyAllowed_OvertimeResonEarlyName',
        disable: false,
        refresh: false,
        value: '',
        visible: false,
        visibleConfig: true
    },
    Note: {
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    UserApproveID: {
        label: 'HRM_Attendance_LateEarlyAllowed_UserApproveName',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    UserApproveID2: {
        label: 'HRM_Attendance_LateEarlyAllowed_UserApproveName2',
        disable: false,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    UserApproveID3: {
        label: 'HRM_Attendance_LateEarlyAllowed_UserApproveName3',
        disable: false,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    UserApproveID4: {
        label: 'HRM_Attendance_LateEarlyAllowed_UserApproveName4',
        disable: false,
        visible: true,
        refresh: false,
        value: null,
        visibleConfig: true
    },
    FileAttach: {
        label: 'HRM_Att_BusinessTravel_FileAttachment',
        visible: true,
        visibleConfig: true,
        disable: true,
        refresh: false,
        value: null
    },
    modalErrorDetail: {
        isModalVisible: false,
        cacheID: null,
        data: []
    },
    fieldValid: {},
    isConfigMultiShift: false
};

export default class AttSubmitLateEarlyAllowedAddOrEdit extends Component {
    constructor(props) {
        super(props);

        this.state = initSateDefault;

        props.navigation.setParams({
            title:
                props.navigation.state.params && props.navigation.state.params.record
                    ? 'HRM_Attendance_LateEarlyAllowed_Popup_Edit'
                    : 'HRM_Attendance_LateEarlyAllowed_Popup_Create'
        });

        this.setVariable();
    }

    //#region [khởi tạo - lấy các dữ liệu cho control, lấy giá trị mặc đinh]
    setVariable = () => {
        //biến trạng thái
        this.isModify = false;
        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;

        this.isChangeLevelApprove = null;
        this.levelApproveLateEarlyAllowed = null;

        // show detail error
        this.IsContinueSave = false;
        this.ProfileRemoveIDs = null;
        this.IsRemoveAndContinue = null;
        this.CacheID = null;
    };

    refreshView = () => {
        this.props.navigation.setParams({ title: 'HRM_Attendance_LateEarlyAllowed_Popup_Create' });
        this.setVariable();

        const { WorkDate } = this.state;
        let resetState = {
            ...initSateDefault,
            WorkDate: {
                ...initSateDefault.WorkDate,
                refresh: !WorkDate.refresh
            }
        };
        this.setState(resetState, () => this.getConfigValid('Att_LateEarlyAllowed', true));
    };

    //promise get config valid
    getConfigValid = (tblName, isRefresh) => {
        VnrLoadingSevices.show();
        HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName).then(res => {
            VnrLoadingSevices.hide();
            if (res) {
                try {
                    //map field hidden by config
                    const _configField =
                        ConfigField && ConfigField.value['AttSubmitLateEarlyAllowedAddOrEdit']
                            ? ConfigField.value['AttSubmitLateEarlyAllowedAddOrEdit']['Hidden']
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
        this.getConfigValid('Att_LateEarlyAllowed');
    }

    initData = () => {
        const { E_ProfileID, E_FullName } = enumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] },
            { Profile } = this.state;

        let nextState = {
            Profile: {
                ...Profile,
                ..._profile
            }
        };

        let readOnlyCtrlOT = this.readOnlyCtrlOT(true);

        nextState = {
            ...nextState,
            ...readOnlyCtrlOT
        };

        this.setState(nextState, () => {
            this.GetLateEarlyType();
            this.getConfigMultiShift();
            //this.GetHighSupervior();
        });
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        //  { Profile } = this.state;
        const { ID } = record,
            { E_ProfileID } = enumName,
            ProfileID = profileInfo[E_ProfileID];

        let arrRequest = [
            HttpService.Get('[URI_HR]/Att_GetData/GetLateEarlyAllowedID?id=' + ID),
            HttpService.Get('[URI_SYS]/Sys_GetData/GetEnumForAtt?text=LateEarlyType&filterConfig=E_PORTAL'),
            HttpService.Post('[URI_HR]/Att_GetData/GetHighSupervisor', {
                ProfileID: ProfileID,
                userSubmit: ProfileID,
                type: 'E_APPROVE_LATEEARLYALLOWED',
                resource: {
                    DateStart: record.WorkDate ? Vnr_Function.parseDateTime(record.WorkDate) : null
                }
            })
        ];

        VnrLoadingSevices.show();
        HttpService.MultiRequest(arrRequest).then(resAll => {
            VnrLoadingSevices.hide();
            try {
                _handleSetState(record, resAll);
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    GetLateEarlyType = () => {
        HttpService.Get('[URI_SYS]/Sys_GetData/GetEnumForAtt?text=LateEarlyType&filterConfig=E_PORTAL').then(res => {
            if (res) {
                const { LateEarlyType, WorkDate } = this.state;

                let nextState = {
                    LateEarlyType: {
                        ...LateEarlyType,
                        data: res,
                        disable: WorkDate.value ? false : true,
                        refresh: !LateEarlyType.refresh
                    }
                };

                this.setState(nextState, () => {
                    // Vào từ màn hình Ngày công
                    const { workDayItem } = this.props.navigation.state.params;
                    if (workDayItem) {
                        // Task bổ sung
                        this.initFormSumitFromWorkday(workDayItem);
                    }
                });
            }
        });
    };

    initFormSumitFromWorkday = (workDayItem, type) => {
        const { WorkDate, LateEarlyType, LateMinutes, EarlyMinutes, LateEarlyReasonID, EarlyLateReasonID } = this.state;
        let nextState = {
            LateMinutes: {
                ...LateMinutes,
                value: '0',
                refresh: !LateMinutes.refresh,
                visible: false
            },
            EarlyMinutes: {
                ...EarlyMinutes,
                value: '0',
                refresh: !EarlyMinutes.refresh,
                visible: false
            },
            LateEarlyReasonID: {
                ...LateEarlyReasonID,
                visible: false,
                value: null,
                refresh: !LateEarlyReasonID.refresh
            },
            EarlyLateReasonID: {
                ...EarlyLateReasonID,
                visible: false,
                value: null,
                refresh: !EarlyLateReasonID.refresh
            }
        };

        if (WorkDate.value == null && workDayItem && workDayItem.WorkDate) {
            // Vào từ màn hình Ngày công
            nextState = {
                ...nextState,
                WorkDate: {
                    ...WorkDate,
                    value: moment(workDayItem.WorkDate).format('YYYY-MM-DD HH:mm:ss'),
                    refresh: !WorkDate.refresh
                }
            };
        }

        let valLateEarlyType = type ? type : null;
        if (LateEarlyType.data && LateEarlyType.data) {
            if (workDayItem.LateDuration1 && workDayItem.EarlyDuration1) {
                valLateEarlyType = LateEarlyType.data.find(item => item.Value == 'E_ALLOWEARLYLATE');

                nextState = {
                    ...nextState,
                    LateMinutes: {
                        ...LateMinutes,
                        value: `${workDayItem.LateDuration1}`,
                        refresh: !LateMinutes.refresh,
                        disable: false,
                        visible: true
                    },
                    EarlyMinutes: {
                        ...EarlyMinutes,
                        value: `${workDayItem.EarlyDuration1}`,
                        refresh: !EarlyMinutes.refresh,
                        disable: false,
                        visible: true
                    },
                    LateEarlyReasonID: {
                        ...nextState.LateEarlyReasonID,
                        visible: true
                    },
                    EarlyLateReasonID: {
                        ...nextState.EarlyLateReasonID,
                        visible: true
                    }
                };
            } else if (workDayItem.LateDuration1) {
                valLateEarlyType = LateEarlyType.data.find(item => item.Value == 'E_ALLOWLATE');

                nextState = {
                    ...nextState,
                    LateMinutes: {
                        ...LateMinutes,
                        value: `${workDayItem.LateDuration1}`,
                        refresh: !LateMinutes.refresh,
                        disable: false,
                        visible: true
                    },
                    LateEarlyReasonID: {
                        ...nextState.LateEarlyReasonID,
                        visible: true
                    }
                };
            } else if (workDayItem.EarlyDuration1) {
                valLateEarlyType = LateEarlyType.data.find(item => item.Value == 'E_ALLOWEARLY');

                nextState = {
                    ...nextState,
                    EarlyMinutes: {
                        ...EarlyMinutes,
                        value: `${workDayItem.EarlyDuration1}`,
                        refresh: !EarlyMinutes.refresh,
                        disable: false,
                        visible: true
                    },
                    EarlyLateReasonID: {
                        ...nextState.EarlyLateReasonID,
                        visible: true
                    }
                };
            }
        }

        nextState = {
            ...nextState,
            LateEarlyType: {
                ...LateEarlyType,
                value: valLateEarlyType,
                refresh: !LateEarlyType.refresh,
                disable: false,
                visible: true
            }
        };

        this.setState(nextState);
    };

    handleSetState = (record, resAll) => {
        let nextState = {};

        const {
                Profile,
                WorkDate,
                LateEarlyType,
                LateMinutes,
                EarlyMinutes,
                LateEarlyReasonID,
                EarlyLateReasonID,
                FileAttach,
                UserApproveID,
                UserApproveID3,
                UserApproveID4,
                UserApproveID2,
                Note
            } = this.state,
            item = resAll[0],
            levelApproveLateEarlyAllowed = resAll[2].LevelApprove;
        // console.log(item, 'item')
        let dataLateEarlyType = [];

        if (resAll[1] && resAll[1].length > 0)
            dataLateEarlyType = resAll[1].filter(res => res.Value !== 'E_ALLOWEARLYLATE');

        nextState = {
            ...this.state,
            ID: record.ID,
            Profile: {
                ...Profile,
                ID: item.ProfileID,
                ProfileName: item.ProfileName
            },
            WorkDate: {
                ...WorkDate,
                value: item.WorkDate ? moment(item.WorkDate).format('YYYY-MM-DD HH:mm:ss') : null,
                disable: true,
                refresh: !WorkDate.refresh
            },
            LateEarlyType: {
                ...LateEarlyType,
                data: dataLateEarlyType,
                value: item.LateEarlyType ? { Value: item.LateEarlyType, Text: item.LateEarlyTypeView } : null,
                disable: false,
                visible: true
            },
            LateMinutes: {
                ...LateMinutes,
                disable: false,
                value: item.LateMinutes ? item.LateMinutes.toString() : '0',
                refresh: !LateMinutes.refresh
            },
            EarlyMinutes: {
                ...EarlyMinutes,
                disable: false,
                value: item.EarlyMinutes ? item.EarlyMinutes.toString() : '0',
                refresh: !EarlyMinutes.refresh
            },

            Note: {
                ...Note,
                value: item.Note ? item.Note : '',
                refresh: !Note.refresh
            },
            FileAttach: {
                ...FileAttach,
                value: item.lstFileAttach,
                disable: false,
                refresh: !FileAttach.refresh
            },
            UserApproveID: {
                ...UserApproveID,
                value: item.UserApproveID ? { ID: item.UserApproveID, UserInfoName: item.UserApproveName } : null,
                refresh: !UserApproveID.refresh
            },
            UserApproveID2: {
                ...UserApproveID2,
                value: item.UserApproveID2 ? { ID: item.UserApproveID2, UserInfoName: item.UserApproveName2 } : null,
                refresh: !UserApproveID2.refresh
            },
            UserApproveID3: {
                ...UserApproveID3,
                value: item.UserApproveID3 ? { ID: item.UserApproveID3, UserInfoName: item.UserApproveName3 } : null,
                refresh: !UserApproveID3.refresh
            },
            UserApproveID4: {
                ...UserApproveID4,
                value: item.UserApproveID4 ? { ID: item.UserApproveID4, UserInfoName: item.UserApproveName4 } : null,
                refresh: !UserApproveID4.refresh
            }
        };

        if (item.LateEarlyType && item.LateEarlyType == 'E_ALLOWEARLYLATE') {
            nextState = {
                ...nextState,
                LateMinutes: {
                    ...nextState.LateMinutes,
                    visible: true
                },
                EarlyMinutes: {
                    ...nextState.EarlyMinutes,
                    visible: true
                },
                LateEarlyReasonID: {
                    ...LateEarlyReasonID,
                    value: item.LateEarlyReasonID
                        ? { ID: item.LateEarlyReasonID, OvertimeResonName: item.OvertimeResonName }
                        : null,
                    refresh: !LateEarlyReasonID.refresh,
                    visible: true
                },
                EarlyLateReasonID: {
                    ...EarlyLateReasonID,
                    value: item.EarlyLateReasonID
                        ? { ID: item.LateEarlyReasonID, OvertimeResonName: item.OvertimeResonName }
                        : null,
                    refresh: !EarlyLateReasonID.refresh,
                    visible: true
                }
            };
        } else if (item.LateEarlyType && item.LateEarlyType == 'E_ALLOWLATE') {
            nextState = {
                ...nextState,
                LateMinutes: {
                    ...nextState.LateMinutes,
                    visible: true
                },
                EarlyMinutes: {
                    ...nextState.EarlyMinutes,
                    visible: false
                },
                LateEarlyReasonID: {
                    ...LateEarlyReasonID,
                    value: item.LateEarlyReasonID
                        ? { ID: item.LateEarlyReasonID, OvertimeResonName: item.OvertimeResonName }
                        : null,
                    refresh: !LateEarlyReasonID.refresh,
                    visible: true
                },
                EarlyLateReasonID: {
                    ...EarlyLateReasonID,
                    value: null,
                    refresh: !EarlyLateReasonID.refresh,
                    visible: false
                }
            };
        } else if (item.LateEarlyType && item.LateEarlyType == 'E_ALLOWEARLY') {
            nextState = {
                ...nextState,
                LateMinutes: {
                    ...nextState.LateMinutes,
                    visible: false
                },
                EarlyMinutes: {
                    ...nextState.EarlyMinutes,
                    visible: true
                },
                LateEarlyReasonID: {
                    ...LateEarlyReasonID,
                    value: null,
                    refresh: !LateEarlyReasonID.refresh,
                    visible: false
                },
                EarlyLateReasonID: {
                    ...EarlyLateReasonID,
                    value: item.LateEarlyReasonID
                        ? { ID: item.LateEarlyReasonID, OvertimeResonName: item.OvertimeResonName }
                        : null,
                    refresh: !EarlyLateReasonID.refresh,
                    visible: true
                }
            };
        } else {
            nextState = {
                ...nextState,
                LateMinutes: {
                    ...nextState.LateMinutes,
                    visible: false
                },
                EarlyMinutes: {
                    ...nextState.EarlyMinutes,
                    visible: false
                }
            };
        }

        if (levelApproveLateEarlyAllowed) {
            this.levelApproveLateEarlyAllowed = levelApproveLateEarlyAllowed;

            if (levelApproveLateEarlyAllowed == 4) {
                nextState = {
                    ...nextState,
                    UserApproveID2: {
                        ...nextState.UserApproveID2,
                        visible: true
                    },
                    UserApproveID3: {
                        ...nextState.UserApproveID3,
                        visible: true
                    }
                };
            } else if (levelApproveLateEarlyAllowed == 3) {
                nextState = {
                    ...nextState,
                    UserApproveID2: {
                        ...nextState.UserApproveID2,
                        visible: true
                    },
                    UserApproveID3: {
                        ...nextState.UserApproveID3,
                        visible: false
                    }
                };
            } else {
                nextState = {
                    ...nextState,
                    UserApproveID2: {
                        ...nextState.UserApproveID2,
                        visible: false
                    },
                    UserApproveID3: {
                        ...nextState.UserApproveID3,
                        visible: false
                    }
                };
            }
        }

        this.setState(nextState);
    };
    //#endregion

    //change ngày công
    onChangeWorkDate = item => {
        const { WorkDate, LateEarlyType, isConfigMultiShift } = this.state;

        if (isConfigMultiShift) {
            // trường hợp có cấu hình nhiều ca
            this.setState(
                {
                    WorkDate: {
                        ...WorkDate,
                        value: moment(item).format('YYYY-MM-DD HH:mm:ss'),
                        refresh: !WorkDate.refresh
                    }
                },
                () => {
                    this.getShiftByWorkDayLateEarly();
                }
            );
        } else {
            let nextState = {
                WorkDate: {
                    ...WorkDate,
                    value: item,
                    refresh: !WorkDate.refresh
                },
                LateEarlyType: {
                    ...LateEarlyType,
                    disable: false,
                    visible: true
                }
            };

            this.setState(nextState, () => {
                this.getLateEarlyDurationWorkDay();
                this.GetHighSupervior();
            });
        }
    };

    getLateEarlyDurationWorkDay = type => {
        VnrLoadingSevices.show();
        const { WorkDate } = this.state;

        if (WorkDate.value == null) return;

        HttpService.Post('[URI_HR]/Att_GetData/GetLateEarlyDurationWorkDay', {
            profileID: dataVnrStorage.currentUser.info.ProfileID,
            workDate: moment(WorkDate.value).format('YYYY-MM-DD HH:mm:ss')
        }).then(data => {
            if (data) {
                VnrLoadingSevices.hide();

                let params = {
                    EarlyDuration1: data.EarlyDuration,
                    LateDuration1: data.LateDuration
                };

                this.initFormSumitFromWorkday(params, type);
            }
        });
    };

    //change loại đăng ký
    onChangeLateEarlyType = item => {
        const { LateEarlyType, LateMinutes, EarlyMinutes, LateEarlyReasonID, EarlyLateReasonID } = this.state;

        let nextState = {
            LateEarlyType: {
                ...LateEarlyType,
                value: item,
                refresh: !LateEarlyType.refresh
            },
            LateMinutes: {
                ...LateMinutes,
                refresh: !LateMinutes.refresh,
                visible: false
            },
            EarlyMinutes: {
                ...EarlyMinutes,
                refresh: !EarlyMinutes.refresh,
                visible: false
            },
            LateEarlyReasonID: {
                ...LateEarlyReasonID,
                value: null,
                refresh: !LateEarlyReasonID.refresh,
                visible: false
            },
            EarlyLateReasonID: {
                ...EarlyLateReasonID,
                value: null,
                refresh: !EarlyLateReasonID.refresh,
                visible: false
            }
        };

        if (item && item.Value == 'E_ALLOWEARLYLATE') {
            nextState = {
                ...nextState,
                LateMinutes: {
                    ...nextState.LateMinutes,
                    visible: true
                },
                EarlyMinutes: {
                    ...nextState.EarlyMinutes,
                    visible: true
                },
                LateEarlyReasonID: {
                    ...nextState.LateEarlyReasonID,
                    visible: true
                },
                EarlyLateReasonID: {
                    ...nextState.EarlyLateReasonID,
                    visible: true
                }
            };
        } else if (item && item.Value == 'E_ALLOWLATE') {
            nextState = {
                ...nextState,
                LateMinutes: {
                    ...nextState.LateMinutes,
                    visible: true
                },
                EarlyMinutes: {
                    ...nextState.EarlyMinutes,
                    visible: false
                },
                LateEarlyReasonID: {
                    ...nextState.LateEarlyReasonID,
                    visible: true
                }
            };
        } else if (item && item.Value == 'E_ALLOWEARLY') {
            nextState = {
                ...nextState,
                LateMinutes: {
                    ...nextState.LateMinutes,
                    visible: false
                },
                EarlyMinutes: {
                    ...nextState.EarlyMinutes,
                    visible: true
                },
                EarlyLateReasonID: {
                    ...nextState.EarlyLateReasonID,
                    visible: true
                }
            };
        } else {
            nextState = {
                ...nextState,
                LateMinutes: {
                    ...nextState.LateMinutes,
                    visible: false
                },
                EarlyMinutes: {
                    ...nextState.EarlyMinutes,
                    visible: false
                },
                LateEarlyReasonID: {
                    ...nextState.LateEarlyReasonID,
                    visible: false
                },
                EarlyLateReasonID: {
                    ...nextState.EarlyLateReasonID,
                    visible: false
                }
            };
        }

        this.setState(nextState);
    };

    GetHighSupervior = () => {
        const { Profile, UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4, WorkDate } = this.state;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetHighSupervisor', {
            ProfileID: Profile.ID,
            userSubmit: Profile.ID,
            type: 'E_APPROVE_LATEEARLYALLOWED',
            resource: {
                DateStart: WorkDate.value ? Vnr_Function.parseDateTime(WorkDate.value) : null
            }
        }).then(result => {
            VnrLoadingSevices.hide();
            let nextState = {
                UserApproveID: { ...UserApproveID },
                UserApproveID2: { ...UserApproveID2 },
                UserApproveID3: { ...UserApproveID3 },
                UserApproveID4: { ...UserApproveID4 }
            };

            //truong hop chạy theo approve grade
            if (result.LevelApprove > 0) {
                if (result.IsChangeApprove == true) {
                    this.isChangeLevelApprove = true;
                }

                this.levelApproveLateEarlyAllowed = result.LevelApprove;

                if (result.LevelApprove == 2) {
                    if (result.IsOnlyOneLevelApprove) {
                        this.levelApproveLateEarlyAllowed = 1;

                        if (result.SupervisorID != null) {
                            nextState = {
                                UserApproveID: {
                                    ...nextState.UserApproveID,
                                    value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                },
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                },
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                },
                                UserApproveID4: {
                                    ...nextState.UserApproveID4,
                                    value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                }
                            };
                        }
                        // checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                        // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                        // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                        // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
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
                        } else if (!this.isModify) {
                            //multiUserApproveID.value(null);
                            nextState = {
                                ...nextState,
                                UserApproveID: {
                                    ...nextState.UserApproveID,
                                    value: null
                                }
                            };
                        }

                        if (result.MidSupervisorID != null) {
                            // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                            // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                            // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);

                            nextState = {
                                ...nextState,
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                },
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                },
                                UserApproveID4: {
                                    ...nextState.UserApproveID4,
                                    value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                }
                            };
                        } else if (!this.isModify) {
                            // multiUserApproveID3.value(null);
                            // multiUserApproveID2.value(null);
                            // multiUserApproveID4.value(null);
                            nextState = {
                                ...nextState,
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    value: null
                                },
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    value: null
                                },
                                UserApproveID4: {
                                    ...nextState.UserApproveID4,
                                    value: null
                                }
                            };
                        }
                    }

                    // isShowEle('#' + divControl3);
                    // isShowEle('#' + divControl4);

                    nextState = {
                        ...nextState,
                        UserApproveID2: {
                            ...nextState.UserApproveID2,
                            visible: false
                        },
                        UserApproveID3: {
                            ...nextState.UserApproveID3,
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
                    } else if (!this.isModify) {
                        // multiUserApproveID.value(null);
                        nextState = {
                            ...nextState,
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                value: null
                            }
                        };
                    }

                    if (result.MidSupervisorID != null) {
                        //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: {
                                    UserInfoName: result.SupervisorNextName,
                                    ID: result.MidSupervisorIDa
                                }
                            }
                        };
                    } else if (!this.isModify) {
                        //multiUserApproveID3.value(null);
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: null
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
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                value: { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }
                            }
                        };
                    } else if (!this.isModify) {
                        // multiUserApproveID2.value(null);
                        // multiUserApproveID4.value(null);
                        nextState = {
                            ...nextState,
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: null
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                value: null
                            }
                        };
                    }

                    // isShowEle('#' + divControl3, true);
                    // isShowEle('#' + divControl4);
                    nextState = {
                        ...nextState,
                        UserApproveID2: {
                            ...nextState.UserApproveID2,
                            visible: true
                        },
                        UserApproveID3: {
                            ...nextState.UserApproveID3,
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
                    } else if (!this.isModify) {
                        // multiUserApproveID.value(null);
                        nextState = {
                            ...nextState,
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                value: null
                            }
                        };
                    }

                    if (result.MidSupervisorID != null) {
                        // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                            }
                        };
                    } else if (!this.isModify) {
                        // multiUserApproveID3.value(null);
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: null
                            }
                        };
                    }

                    if (result.NextMidSupervisorID != null) {
                        // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                value: { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }
                            }
                        };
                    } else if (!this.isModify) {
                        // multiUserApproveID4.value(null);
                        nextState = {
                            ...nextState,
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                value: null
                            }
                        };
                    }

                    if (result.HighSupervisorID) {
                        // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                            }
                        };
                    } else if (!this.isModify) {
                        // multiUserApproveID2.value(null);
                        nextState = {
                            ...nextState,
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: null
                            }
                        };
                    }

                    // isShowEle('#' + divControl3, true);
                    // isShowEle('#' + divControl4, true);
                    nextState = {
                        ...nextState,
                        UserApproveID2: {
                            ...nextState.UserApproveID2,
                            visible: true
                        },
                        UserApproveID3: {
                            ...nextState.UserApproveID3,
                            visible: true
                        }
                    };
                }
            }

            //TH chạy không theo approve grade
            else if (result.LevelApprove == 0) {
                if (result.IsConCurrent) {
                    let dataFirstApprove = [];
                    for (let i = 0; i < result.lstSupervior.length; i++) {
                        dataFirstApprove.push({
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
                    // multiUserApproveID3.setDataSource(dataMidApprove);
                    // multiUserApproveID3.refresh();
                    nextState = {
                        ...nextState,
                        UserApproveID: {
                            ...nextState.UserApproveID,
                            data: dataFirstApprove
                        },
                        UserApproveID4: {
                            ...nextState.UserApproveID4,
                            data: this.dataLastApprove
                        },
                        UserApproveID2: {
                            ...nextState.UserApproveID2,
                            data: this.dataMidApprove
                        }
                    };
                } else {
                    if (result.SupervisorID != null) {
                        // checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                            }
                        };
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
                        nextState = {
                            ...nextState,
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                            }
                        };
                        // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
                    } else {
                        // multiUserApproveID2.refresh();
                        // multiUserApproveID2.value(null);
                        nextState = {
                            ...nextState,
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: null
                            }
                        };
                    }
                    if (result.MidSupervisorID != null) {
                        this.dataMidApprove.push({
                            UserInfoName: result.SupervisorNextName,
                            ID: result.MidSupervisorID
                        });
                        // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                        // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                        // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                            },
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
                        // multiUserApproveID2.refresh();
                        // multiUserApproveID2.value(null);
                        // multiUserApproveID3.refresh();
                        // multiUserApproveID3.value(null);
                        // multiUserApproveID4.refresh();
                        // multiUserApproveID4.value(null);
                        nextState = {
                            ...nextState,
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: null
                            },
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: null
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                value: null
                            }
                        };
                    }
                    if (result.IsChangeApprove != true) {
                        // isReadOnlyComboBox($("#" + control1), true);
                        // isReadOnlyComboBox($("#" + control2), true);
                        // isReadOnlyComboBox($("#" + control3), true);
                        // isReadOnlyComboBox($("#" + control4), true);
                        nextState = {
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                disable: true
                            },
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
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
                        // isReadOnlyComboBox($("#" + control1), false);
                        // isReadOnlyComboBox($("#" + control2), false);
                        // isReadOnlyComboBox($("#" + control3), false);
                        // isReadOnlyComboBox($("#" + control4), false);
                        nextState = {
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                disable: false
                            },
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
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
            }

            nextState = {
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

    //picked duyệt đầu
    onChangeUserApproveID = item => {
        const { UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4 } = this.state;
        let nextState = {
            UserApproveID: {
                ...UserApproveID,
                value: item,
                refresh: !UserApproveID.refresh
            }
        };

        // var user1 = $("#UserApproveID").data("kendoComboBox");
        // var user2 = $("#UserApproveID2").data("kendoComboBox");
        // var user3 = $("#UserApproveID3").data("kendoComboBox");
        // var user4 = $("#UserApproveID4").data("kendoComboBox");
        //nếu 1 cấp duyệt mới chạy
        if (this.levelApproveLateEarlyAllowed == 1) {
            //ẩn 3,4
            // isShowEle('#divMidApprove');
            // isShowEle('#divMidNextApprove');

            nextState = {
                ...nextState,
                UserApproveID2: {
                    ...UserApproveID2,
                    visible: false
                },
                UserApproveID3: {
                    ...UserApproveID3,
                    visible: false
                }
            };

            if (item) {
                nextState = {
                    ...nextState,
                    UserApproveID2: {
                        ...nextState.UserApproveID2,
                        value: item,
                        refresh: !UserApproveID2.refresh
                    },
                    UserApproveID3: {
                        ...nextState.UserApproveID3,
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

            //_data1 = user1.dataSource.data();
            // if (false) {
            //     // user2.value([]);
            //     // user3.value([]);
            //     // user4.value([]);
            // }
            // else {
            //     _data1.forEach(function (item) {
            //         if (item.ID == user1.value()) {
            //             checkAddDatasource(user2, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
            //             checkAddDatasource(user3, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
            //             checkAddDatasource(user4, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
            //         }
            //     });

            // }
        }

        this.setState(nextState);
    };

    //picked duyệt cuối
    onChangeUserApproveID4 = item => {
        const { UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4 } = this.state;
        let nextState = {
            UserApproveID4: {
                ...UserApproveID4,
                value: item,
                refresh: !UserApproveID4.refresh
            }
        };

        //nếu 1 cấp duyệt mới chạy
        if (this.levelApproveLateEarlyAllowed == 1) {
            //ẩn 3,4
            // isShowEle('#divMidApprove');
            // isShowEle('#divMidNextApprove');
            nextState = {
                ...nextState,
                UserApproveID2: {
                    ...UserApproveID2,
                    visible: false
                },
                UserApproveID3: {
                    ...UserApproveID3,
                    visible: false
                }
            };

            //set duyệt 2,3,4 = 1
            // var user1 = $("#UserApproveID").data("kendoComboBox"),
            //   user2 = $("#UserApproveID4").data("kendoComboBox"),
            //   user3 = $("#UserApproveID2").data("kendoComboBox"),
            //   user4 = $("#UserApproveID3").data("kendoComboBox"),
            //   _data2 = user2.dataSource.data();

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
                    UserApproveID2: {
                        ...nextState.UserApproveID2,
                        value: null,
                        refresh: !UserApproveID2.refresh
                    },
                    UserApproveID3: {
                        ...nextState.UserApproveID3,
                        value: null,
                        refresh: !UserApproveID3.refresh
                    }
                };
            } else {
                // _data2.forEach(function (item) {
                //   if (item.ID == user2.value()) {
                //     checkAddDatasource(user1, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //     checkAddDatasource(user3, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //     checkAddDatasource(user4, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //   }
                // });
                nextState = {
                    ...nextState,
                    UserApproveID: {
                        ...UserApproveID,
                        value: { ...item },
                        refresh: !UserApproveID.refresh
                    },
                    UserApproveID2: {
                        ...nextState.UserApproveID2,
                        value: { ...item },
                        refresh: !UserApproveID2.refresh
                    },
                    UserApproveID3: {
                        ...nextState.UserApproveID3,
                        value: { ...item },
                        refresh: !UserApproveID3.refresh
                    }
                };
            }
        } else if (this.levelApproveLateEarlyAllowed == 2) {
            // var user1 = $("#UserApproveID").data("kendoComboBox"),
            //   user2 = $("#UserApproveID4").data("kendoComboBox"),
            //   user3 = $("#UserApproveID2").data("kendoComboBox"),
            //   user4 = $("#UserApproveID3").data("kendoComboBox"),
            //   _data2 = user2.dataSource.data();
            if (!item) {
                // user3.value([]);
                // user4.value([]);
                nextState = {
                    ...nextState,
                    UserApproveID2: {
                        ...UserApproveID2,
                        value: null,
                        refresh: !UserApproveID2.refresh
                    },
                    UserApproveID3: {
                        ...UserApproveID3,
                        value: null,
                        refresh: !UserApproveID3.refresh
                    }
                };
            } else {
                // _data2.forEach(function (item) {
                //   if (item.ID == user2.value()) {
                //     checkAddDatasource(user3, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //     checkAddDatasource(user4, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //   }
                // });
                nextState = {
                    ...nextState,
                    UserApproveID2: {
                        ...UserApproveID2,
                        value: { ...item },
                        refresh: !UserApproveID2.refresh
                    },
                    UserApproveID3: {
                        ...UserApproveID3,
                        value: { ...item },
                        refresh: !UserApproveID3.refresh
                    }
                };
            }
        } else if (this.levelApproveLateEarlyAllowed == 3) {
            // var user1 = $("#UserApproveID").data("kendoComboBox"),
            //   user2 = $("#UserApproveID4").data("kendoComboBox"),
            //   user3 = $("#UserApproveID2").data("kendoComboBox"),
            //   user4 = $("#UserApproveID3").data("kendoComboBox"),
            //   _data2 = user2.dataSource.data();
            if (!item) {
                // user4.value([]);
                nextState = {
                    ...nextState,
                    UserApproveID3: {
                        ...UserApproveID3,
                        value: null,
                        refresh: !UserApproveID3.refresh
                    }
                };
            } else {
                // _data2.forEach(function (item) {
                //   if (item.ID == user2.value()) {
                //     checkAddDatasource(user4, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //   }
                // });
                nextState = {
                    ...nextState,
                    UserApproveID3: {
                        ...UserApproveID3,
                        value: { ...item },
                        refresh: !UserApproveID3.refresh
                    }
                };
            }
        }

        this.setState(nextState);
    };

    readOnlyCtrlOT = isReadOnly => {
        const { UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4, WorkDate } = this.state;

        let nextState = {};

        if (isReadOnly) {
            nextState = {
                ...nextState,
                UserApproveID: {
                    ...UserApproveID,
                    disable: isReadOnly,
                    refresh: !UserApproveID.refresh
                },
                UserApproveID2: {
                    ...UserApproveID2,
                    disable: isReadOnly,
                    refresh: !UserApproveID2.refresh
                },
                UserApproveID3: {
                    ...UserApproveID3,
                    disable: isReadOnly,
                    refresh: !UserApproveID3.refresh
                },
                UserApproveID4: {
                    ...UserApproveID4,
                    disable: isReadOnly,
                    refresh: !UserApproveID4.refresh
                }
            };
        } else if (this.isChangeLevelApprove) {
            nextState = {
                ...nextState,
                UserApproveID: {
                    ...UserApproveID,
                    disable: isReadOnly,
                    refresh: !UserApproveID.refresh
                },
                UserApproveID2: {
                    ...UserApproveID2,
                    disable: isReadOnly,
                    refresh: !UserApproveID2.refresh
                },
                UserApproveID3: {
                    ...UserApproveID3,
                    disable: isReadOnly,
                    refresh: !UserApproveID3.refresh
                },
                UserApproveID4: {
                    ...UserApproveID4,
                    disable: isReadOnly,
                    refresh: !UserApproveID4.refresh
                }
            };
        }

        if (this.isModify) {
            nextState = {
                ...nextState,
                WorkDate: {
                    ...WorkDate,
                    disable: true
                }
            };
        }

        return nextState;

        // isReadOnlyDropDownList($(frm + ' #ShiftID'), isReadOnly);
        // isReadOnlyDropDownList($(frm + ' #DurationType'), isReadOnly);
        // isReadOnlyDropDownList($(frm + ' #OvertimeTypeID'), isReadOnly);
        // isReadOnlyDropDownList($(frm + ' #JobTypeID'), isReadOnly);
        // // isDisabledCheckboxInput($(frm + ' #IsOverTimeBreak'), isReadOnly);
        // // isReadOnlyComboBox($(frm + ' #BusinessUnitTypeID'), isReadOnly);
        // // isReadOnlyComboBox($(frm + ' #BusinessUnitID'), isReadOnly);
        // if (isReadOnly) {
        //     isReadOnlyComboBox($(frm + ' #UserApproveID'), isReadOnly);
        //     isReadOnlyComboBox($(frm + ' #UserApproveID2'), isReadOnly);
        //     isReadOnlyComboBox($(frm + ' #UserApproveID3'), isReadOnly);
        //     isReadOnlyComboBox($(frm + ' #UserApproveID4'), isReadOnly);
        // }
        // isReadOnlyTime($(frm + ' [field-name=TimeFrom]'), isReadOnly);
        // isReadOnlyTime($(frm + ' [field-name=TimeTo]'), isReadOnly);
        // isReadOnlyNumeric($(frm + ' [field-name=RegisterHours]'), isReadOnly);
        // isReadOnlyDropDownList($(frm + ' #MethodPayment'), isReadOnly);
        // if (!isReadOnly) {
        //     if (isChangeLevelApprovePlanOT) {
        //         isReadOnlyComboBox($(frm + ' #UserApproveID'), isReadOnly);
        //         isReadOnlyComboBox($(frm + ' #UserApproveID3'), isReadOnly);
        //         isReadOnlyComboBox($(frm + ' #UserApproveID4'), isReadOnly);
        //         isReadOnlyComboBox($(frm + ' #UserApproveID2'), isReadOnly);
        //     }
        // }

        //isReadOnlyInput($(frm + ' [field-name=ReasonOT]'), isReadOnly);
    };

    onSave = (navigation, isCreate, isSend) => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        const {
                ID,
                modalErrorDetail,
                Profile,
                WorkDate,
                LateEarlyType,
                LateMinutes,
                EarlyMinutes,
                LateEarlyReasonID,
                EarlyLateReasonID,
                FileAttach,
                UserApproveID,
                UserApproveID3,
                UserApproveID4,
                UserApproveID2,
                Note,
                ShiftID
            } = this.state,
            { apiConfig } = dataVnrStorage,
            { uriMain, uriPor } = apiConfig;

        let param = {
            ProfileID: Profile.ID,
            Status: 'E_SUBMIT',
            WorkDate: WorkDate.value ? moment(WorkDate.value).format('YYYY-MM-DD HH:mm:ss') : null,
            LateEarlyType: LateEarlyType.value ? LateEarlyType.value.Value : null,
            LateMinutes: LateMinutes.value,
            EarlyMinutes: EarlyMinutes.value,
            LateEarlyReasonID: LateEarlyReasonID.value ? LateEarlyReasonID.value.ID : null,
            EarlyLateReasonID: EarlyLateReasonID.value ? EarlyLateReasonID.value.ID : null,
            IsPortal: true,
            UserSubmitID: Profile.ID,
            Attachment: FileAttach.value ? FileAttach.value.map(item => item.fileName).join(',') : null,
            UserApproveID: UserApproveID.value ? UserApproveID.value.ID : null,
            UserApproveID2: UserApproveID2.value ? UserApproveID2.value.ID : null,
            UserApproveID3: UserApproveID3.value ? UserApproveID3.value.ID : null,
            UserApproveID4: UserApproveID4.value ? UserApproveID4.value.ID : null,
            Note: Note.value,
            // Send mail
            SendEmailStatus: isSend ? 'E_SUBMIT' : null,
            Host: isSend ? uriPor : uriMain,
            IsAddNewAndSendMail: isSend,
            // Multi Shift
            ShiftID: ShiftID.value ? ShiftID.value.Value : null,

            //UserRegister: dataVnrStorage.currentUser.info.userid,
            ProfileRemoveIDs: this.ProfileRemoveIDs,
            IsRemoveAndContinue: this.IsRemoveAndContinue,
            CacheID: this.CacheID,
            IsContinueSave: this.IsContinueSave
        };

        if (ID) {
            param = {
                ...param,
                ID
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Att_LateEarlyAllowed', param).then(data => {
            VnrLoadingSevices.hide();
            this.isProcessing = false;

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
                                this.onSave(navigation, isCreate, isSend);
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
                            onCancel: () => {},
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
                            this.onSave(navigation, isCreate, isSend);
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
            }
            if (data.ActionStatus.indexOf('Success') >= 0) {
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
            } else if (data.ActionStatus == 'Locked') {
                ToasterSevice.showWarning('DataIsLocked', 4000);
            } else if (typeof data.ActionStatus == 'string') {
                ToasterSevice.showWarning(data.ActionStatus);
            } else {
                ToasterSevice.showWarning('HRM_Common_SendRequest_Error');
            }
        });
    };

    onSaveAndCreate = navigation => {
        this.onSave(navigation, true, null);
    };

    onSaveAndSend = navigation => {
        this.onSave(navigation, null, true);
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
            { data } = modalErrorDetail,
            { styleViewTitleGroup } = styleViewTitleForGroup,
            RenderItemAction = styles;

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
                        <View style={RenderItemAction.viewInfo}>
                            <View style={RenderItemAction.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                    i18nKey={'HRM_HR_Profile_CodeEmp'}
                                />
                                <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text numberOfLines={1} style={[styleSheets.textItalic, RenderItemAction.fontText]}>
                                        {dataItem['CodeEmp']}
                                    </Text>
                                </View>
                            </View>

                            <View style={RenderItemAction.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                    i18nKey={'HRM_HR_Profile_ProfileName'}
                                />
                                <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text numberOfLines={1} style={[styleSheets.textItalic, RenderItemAction.fontText]}>
                                        {dataItem['ProfileName']}
                                    </Text>
                                </View>
                            </View>

                            <View style={RenderItemAction.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                    i18nKey={'HRM_Attendance_ErrorMessageRespone_ErrorDescription'}
                                />
                                <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>
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

    formatDate = val => {
        if (val) {
            return moment(val).format('YYYY-MM-DD HH:mm:ss');
        }

        return null;
    };

    formatTime = val => {
        if (val) {
            return moment(val).format('HH:mm');
        }

        return null;
    };

    //#region 0156247: [App] Điều chỉnh màn hình tạo mới đi trễ về sớm	( Nhiều ca BAV )
    getConfigMultiShift = () => {
        VnrLoadingSevices.show();

        HttpService.Post('[URI_HR]/Por_GetData/GetConfigByKey', {
            key: 'HRM_ATT_ROSTER_ISALLOWSREGISTRATIONMULTIPLESHIFTS'
        }).then(res => {
            VnrLoadingSevices.hide();
            this.setState({
                isConfigMultiShift: res === 'True' ? true : false
            });
        });
    };

    // ( Nhiều ca BAV )
    getShiftByWorkDayLateEarly = () => {
        const { WorkDate, Profile, ShiftID, LateEarlyType } = this.state;

        VnrLoadingSevices.show();

        HttpService.Post('[URI_HR]/Att_GetData/GetShiftByWorkDayLateEarly', {
            profileID: Profile.ID,
            dateTime: Vnr_Function.formatDateAPI(WorkDate.value)
        }).then(dataReult => {
            VnrLoadingSevices.hide();

            if (dataReult == 'error') {
                ToasterSevice.showWarning('WarningRegisterLateEarlyAllowByWorkDay', 5000);

                this.setState({
                    ShiftID: {
                        ...ShiftID,
                        visible: false,
                        data: null,
                        value: null,
                        refresh: !ShiftID.refresh
                    }
                });
            } else if (dataReult.length == 0) {
                // Ngày 1 ca làm việc chạy nhưu bình thường
                this.setState(
                    {
                        ShiftID: {
                            ...ShiftID,
                            visible: false,
                            data: null,
                            value: null,
                            refresh: !ShiftID.refresh
                        },
                        LateEarlyType: {
                            ...LateEarlyType,
                            disable: false,
                            visible: true
                        }
                    },
                    () => {
                        // Gọi giống change Workday
                        //this.getLateEarlyDurationWorkDay();
                        this.GetHighSupervior();
                    }
                );
            } else {
                let dataSource = [],
                    nextState = {};

                for (var i = 0; i < dataReult.length; i++) {
                    dataSource.push({ Text: dataReult[i].Code + ' ' + dataReult[i].ShiftName, Value: dataReult[i].ID });
                }

                if (dataSource.length == 1)
                    nextState = {
                        ...nextState,
                        ShiftID: {
                            ...ShiftID,
                            visible: true,
                            data: dataSource,
                            value: dataSource[0],
                            refresh: !ShiftID.refresh
                        }
                    };
                else
                    nextState = {
                        ...nextState,
                        ShiftID: {
                            ...ShiftID,
                            visible: true,
                            data: dataSource,
                            value: null,
                            refresh: !ShiftID.refresh
                        }
                    };

                this.setState(nextState, () => {
                    // Gọi giống change Workday
                    //this.getLateEarlyDurationWorkDay();
                    this.GetHighSupervior();
                });
            }
        });
    };

    getLateEarlyTypeByWorkDayDetail = () => {
        const { WorkDate, Profile, ShiftID, LateEarlyType } = this.state;

        VnrLoadingSevices.show();

        HttpService.Post('[URI_HR]/Att_GetData/GetLateEarlyTypeByWorkDayDetail', {
            profileID: Profile.ID,
            dateTime: Vnr_Function.formatDateAPI(WorkDate.value),
            shiftID: ShiftID.value ? ShiftID.value.Value : null
        }).then(data => {
            VnrLoadingSevices.hide();
            let nextState = {};

            const dataReult = data.types ? data.types : [];
            if (dataReult.length == 0) {
                ToasterSevice.showWarning('WarningRegisterLateEarlyAllowByWorkDay');
                nextState = {
                    ...nextState,
                    LateEarlyType: {
                        ...LateEarlyType,
                        value: null,
                        data: null,
                        disable: false,
                        visible: true
                    }
                };
            } else {
                let dataSource = [];
                for (var i = 0; i < dataReult.length; i++) {
                    dataSource.push({ Text: dataReult[i].Translate, Value: dataReult[i].Name });
                }

                if (dataSource.length == 1)
                    nextState = {
                        ...nextState,
                        LateEarlyType: {
                            ...LateEarlyType,
                            value: dataSource[0],
                            data: dataSource,
                            disable: false,
                            visible: true
                        }
                    };
                else
                    nextState = {
                        ...nextState,
                        LateEarlyType: {
                            ...LateEarlyType,
                            value: null,
                            data: dataSource,
                            disable: false,
                            visible: true
                        }
                    };
            }

            this.setState(nextState, () => {
                const { LateEarlyType } = this.state;
                // Nếu set value cho LateEarlyType thì phải gọi hàm onChangeLateEarlyType để load cho đúng logic
                if (data.EarlyDuration1 || data.LateDuration1) {
                    let params = {
                        EarlyDuration1: data.EarlyDuration1,
                        LateDuration1: data.LateDuration1
                    };
                    this.initFormSumitFromWorkday(params, LateEarlyType.value);
                }
                // if (LateEarlyType && LateEarlyType.value) {
                //   this.onChangeLateEarlyType(LateEarlyType.value);
                // }
            });
        });
    };

    onChangeShiftID = item => {
        const { ShiftID } = this.state;
        this.setState(
            {
                ShiftID: {
                    ...ShiftID,
                    value: item,
                    refresh: !ShiftID.refresh
                }
            },
            () => this.getLateEarlyTypeByWorkDayDetail()
        );
    };

    //#endregion

    render() {
        const {
            ShiftID,
            WorkDate,
            LateEarlyType,
            LateMinutes,
            EarlyMinutes,
            LateEarlyReasonID,
            EarlyLateReasonID,
            UserApproveID,
            UserApproveID2,
            UserApproveID3,
            UserApproveID4,
            Note,
            FileAttach,
            fieldValid,
            modalErrorDetail
        } = this.state;

        const {
            textLableInfo,
            contentViewControl,
            viewLable,
            viewControl,
            viewInputMultiline
        } = stylesListPickerControl;

        //#region [Xử lý 3 nút lưu]
        const listActions = [];

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_LateEarlyAllowed_New_CreateOrUpdate_btnSaveandSendMail'] &&
            PermissionForAppMobile.value['New_Att_LateEarlyAllowed_New_CreateOrUpdate_btnSaveandSendMail']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_SENMAIL,
                title: translate('HRM_Common_SaveAndSendMail'),
                onPress: () => this.onSaveAndSend(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_LateEarlyAllowed_New_CreateOrUpdate_btnSaveClose'] &&
            PermissionForAppMobile.value['New_Att_LateEarlyAllowed_New_CreateOrUpdate_btnSaveClose']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_CLOSE,
                title: translate('HRM_Common_SaveClose'),
                onPress: () => this.onSave(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_LateEarlyAllowed_New_CreateOrUpdate_btnSaveCreate'] &&
            PermissionForAppMobile.value['New_Att_LateEarlyAllowed_New_CreateOrUpdate_btnSaveCreate']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_NEW,
                title: translate('HRM_Common_SaveNew'),
                onPress: () => this.onSaveAndCreate(this.props.navigation)
            });
        }

        //#endregion

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={{ ...CustomStyleSheet.flexGrow(1), ...CustomStyleSheet.paddingTop(10) }}
                        ref={ref => (this.scrollViewRef = ref)}
                    >
                        {/* Ngày công - WorkDate */}
                        {WorkDate.visibleConfig && WorkDate.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={WorkDate.label} />

                                    {fieldValid.WorkDate && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={WorkDate.value}
                                        refresh={WorkDate.refresh}
                                        disable={WorkDate.disable}
                                        type={'date'}
                                        onFinish={value => this.onChangeWorkDate(value)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ca -  ShiftID */}
                        {ShiftID.visibleConfig && ShiftID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={ShiftID.label} />

                                    {/* valid DurationType */}
                                    {fieldValid.ShiftID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        autoFilter={true}
                                        dataLocal={ShiftID.data}
                                        refresh={ShiftID.refresh}
                                        textField="Text"
                                        valueField="Value"
                                        filter={true}
                                        value={ShiftID.value}
                                        filterServer={false}
                                        disable={ShiftID.disable}
                                        onFinish={item => this.onChangeShiftID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Loại đăng ký -  LateEarlyType */}
                        {LateEarlyType.visibleConfig && LateEarlyType.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={LateEarlyType.label} />

                                    {/* valid DurationType */}
                                    {fieldValid.LateEarlyType && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        autoFilter={true}
                                        dataLocal={LateEarlyType.data}
                                        refresh={LateEarlyType.refresh}
                                        textField="Text"
                                        valueField="Value"
                                        filter={true}
                                        value={LateEarlyType.value}
                                        filterServer={false}
                                        disable={LateEarlyType.disable}
                                        onFinish={item => this.onChangeLateEarlyType(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Số phút vào trễ - LateMinutes */}
                        {LateMinutes.visibleConfig && LateMinutes.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={LateMinutes.label} />
                                    {fieldValid.LateMinutes && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        value={LateMinutes.value}
                                        refresh={LateMinutes.refresh}
                                        disable={LateMinutes.disable}
                                        keyboardType={Platform.OS == 'ios' ? 'decimal-pad' : 'numeric'}
                                        charType={'double'}
                                        returnKeyType={'done'}
                                        onChangeText={value =>
                                            this.setState({
                                                LateMinutes: {
                                                    ...LateMinutes,
                                                    value: value
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Số phút về sớm - EarlyMinutes*/}
                        {EarlyMinutes.visibleConfig && EarlyMinutes.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={EarlyMinutes.label} />
                                    {fieldValid.EarlyMinutes && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        value={EarlyMinutes.value}
                                        refresh={EarlyMinutes.refresh}
                                        disable={EarlyMinutes.disable}
                                        keyboardType={Platform.OS == 'ios' ? 'decimal-pad' : 'numeric'}
                                        charType={'double'}
                                        returnKeyType={'done'}
                                        onChangeText={value =>
                                            this.setState({
                                                EarlyMinutes: {
                                                    ...EarlyMinutes,
                                                    value: value
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Lý do Vào trễ -  LateEarlyReasonID*/}
                        {LateEarlyReasonID.visibleConfig && LateEarlyReasonID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={LateEarlyReasonID.label}
                                    />
                                    {fieldValid.LateEarlyReasonID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetOvertimeResonMulti',
                                            type: 'E_GET'
                                        }}
                                        autoFilter={true}
                                        refresh={LateEarlyReasonID.refresh}
                                        textField="OvertimeResonName"
                                        valueField="ID"
                                        filter={true}
                                        value={LateEarlyReasonID.value}
                                        filterServer={false}
                                        disable={LateEarlyReasonID.disable}
                                        onFinish={item =>
                                            this.setState({
                                                LateEarlyReasonID: {
                                                    ...LateEarlyReasonID,
                                                    value: item,
                                                    refresh: !LateEarlyReasonID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Lý do Về sớm -  EarlyLateReasonID*/}
                        {EarlyLateReasonID.visibleConfig && EarlyLateReasonID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={EarlyLateReasonID.label}
                                    />
                                    {fieldValid.EarlyLateReasonID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetOvertimeResonMulti',
                                            type: 'E_GET'
                                        }}
                                        autoFilter={true}
                                        refresh={EarlyLateReasonID.refresh}
                                        textField="OvertimeResonName"
                                        valueField="ID"
                                        filter={true}
                                        value={EarlyLateReasonID.value}
                                        filterServer={false}
                                        disable={EarlyLateReasonID.disable}
                                        onFinish={item =>
                                            this.setState({
                                                EarlyLateReasonID: {
                                                    ...EarlyLateReasonID,
                                                    value: item,
                                                    refresh: !EarlyLateReasonID.refresh
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
                                        i18nKey={'HRM_Rec_JobVacancy_FileAttachment'}
                                    />
                                </View>
                                <View style={viewControl}>
                                    <VnrAttachFile
                                        //disable={FileAttach.disable}
                                        refresh={FileAttach.refresh}
                                        value={FileAttach.value}
                                        multiFile={true}
                                        uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                        onFinish={file => {
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
                            </View>
                        )}

                        {/* Ghi chú -  Note*/}
                        {Note.visibleConfig && Note.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_LateEarlyAllowed_Note'}
                                    />
                                    {fieldValid.Note && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Note.disable}
                                        refresh={Note.refresh}
                                        value={Note.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={text =>
                                            this.setState({
                                                Note: {
                                                    ...Note,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Người duyệt đầu - UserApproveID*/}
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
                                        api={{
                                            urlApi:
                                                '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_APPROVE_LATEEARLYALLOWED',
                                            type: 'E_GET'
                                        }}
                                        refresh={UserApproveID.refresh}
                                        textField="UserInfoName"
                                        valueField="ID"
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

                        {/* Người duyệt kế tiếp - UserApproveID3*/}
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
                                        api={{
                                            urlApi:
                                                '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_APPROVE_LATEEARLYALLOWED',
                                            type: 'E_GET'
                                        }}
                                        refresh={UserApproveID2.refresh}
                                        textField="UserInfoName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={true}
                                        value={UserApproveID2.value}
                                        filterParams="text"
                                        disable={UserApproveID2.disable}
                                        onFinish={item => {
                                            this.setState({
                                                UserApproveID2: {
                                                    ...UserApproveID2,
                                                    value: item,
                                                    refresh: !UserApproveID2.refresh
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Người duyệt tiếp theo - UserApproveID4*/}
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
                                        api={{
                                            urlApi:
                                                '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_APPROVE_LATEEARLYALLOWED',
                                            type: 'E_GET'
                                        }}
                                        value={UserApproveID3.value}
                                        refresh={UserApproveID3.refresh}
                                        textField="UserInfoName"
                                        valueField="ID"
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

                        {/* Người duyệt cuối - UserApproveID2 */}
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
                                        api={{
                                            urlApi:
                                                '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_APPROVE_LATEEARLYALLOWED',
                                            type: 'E_GET'
                                        }}
                                        value={UserApproveID4.value}
                                        refresh={UserApproveID4.refresh}
                                        textField="UserInfoName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={true}
                                        filterParams="text"
                                        disable={UserApproveID4.disable}
                                        onFinish={item => this.onChangeUserApproveID4(item)}
                                    />
                                </View>
                            </View>
                        )}
                    </KeyboardAwareScrollView>

                    <ListButtonSave listActions={listActions} />

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
    styleViewBorderButtom: {
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.borderColor,
        flex: 1,
        marginBottom: 0.5,
        marginHorizontal: 10,
        paddingVertical: 10
    },
    coating:  {
        flex: 1,
        backgroundColor: Colors.black,
        opacity: 0.5
    },
    wrapRenderError: { flexGrow: 1, flexDirection: 'column' },
    wrapTitleGroup: {
        marginHorizontal: 0,
        paddingBottom: 5,
        marginBottom: 10
    },
    txtTitleGroup: { fontWeight: '500', color: Colors.primary },
    // eslint-disable-next-line react-native/no-unused-styles
    fontText: {
        fontSize: Size.text - 1
    },
    // eslint-disable-next-line react-native/no-unused-styles
    viewInfo: {
        flex: 1
    },
    // eslint-disable-next-line react-native/no-unused-styles
    Line: {
        flex: 1,
        flexDirection: 'row',
        maxWidth: '100%',
        marginVertical: 2
    }
});
