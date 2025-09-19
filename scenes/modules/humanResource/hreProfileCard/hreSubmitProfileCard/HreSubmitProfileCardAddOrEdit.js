import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
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
    CustomStyleSheet,
    stylesScreenDetailV3
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
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
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { IconColse } from '../../../../../constants/Icons';
import Modal from 'react-native-modal';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import VnrPickerMulti from '../../../../../components/VnrPickerMulti/VnrPickerMulti';

let enumName = null,
    profileInfo = null;

// need fix (Overtime)
const initSateDefault = {
    ID: null,
    Profile: {
        label: 'HRM_Attendance_Leaveday_ProfileID',
        ID: null,
        ProfileName: '',
        disable: true
    },
    // need fix
    CardTypeIDs: {
        label: 'Hre_ProfileCard_CardTypeID',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    CardActivationAreaList: {
        label: 'CardActivationAreaList',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    ActivationRequired: {
        label: 'HRM_HR_Profile_ActivationRequired',
        disable: false,
        placeholder: '',
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    ReasonCardIssue: {
        label: 'HRM_Hre_ProfileCard_ReasonCardIssue',
        disable: false,
        placeholder: '',
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    Notes: {
        label: 'HRM_Canteen_TamScanLog_Comment',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    FileAttach: {
        label: 'HRM_Hre_ProfileMoreInfo_AttachFile',
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },
    UserApproveID: {
        label: 'HRM_Attendance_Overtime_UserApproveID',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    UserApproveID2: {
        label: 'HRM_Attendance_Overtime_UserApproveID3',
        disable: false,
        visible: true,
        refresh: false,
        value: null,
        visibleConfig: true
    },
    UserApproveID3: {
        label: 'HRM_Attendance_Att_Overtime_Submit_UserApproveID4',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    UserApproveID4: {
        label: 'HRM_Attendance_Overtime_UserApproveID2',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    dataError: null,
    modalErrorDetail: {
        isModalVisible: false,
        cacheID: null,
        data: []
    },
    fieldValid: {}
};

export default class HreSubmitProfileCardAddOrEdit extends Component {
    constructor(props) {
        super(props);

        this.state = initSateDefault;

        // need fix
        props.navigation.setParams({
            title:
                props.navigation.state.params && props.navigation.state.params.record
                    ? 'Hrm_Hre_ProfileCard_Edit'
                    : 'Hrm_Hre_ProfileCard_Add'
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
        this.levelApproved = null;
    };

    refreshView = () => {
        this.props.navigation.setParams({
            title: 'Hrm_Hre_ProfileCard_Add'
        });
        this.setVariable();

        const { FileAttach } = this.state;
        let resetState = {
            ...initSateDefault,
            FileAttach: {
                ...initSateDefault.FileAttach,
                refresh: !FileAttach.refresh
            }
        };
        this.setState(resetState, () => this.getConfigValid('Hre_ConCurrent', true));
    };

    //promise get config valid
    getConfigValid = (tblName, isRefresh) => {
        VnrLoadingSevices.show();
        HttpService.Get('[URI_HR]/Hre_GetDataV2/GetFieldInfoFileByTableNameKaizenVersion?tableName=' + tblName).then(
            (res) => {
                VnrLoadingSevices.hide();
                if (res) {
                    try {
                        //map field hidden by config
                        const _configField =
                            ConfigField && ConfigField.value['HreSubmitProfileCardAddOrEdit']
                                ? ConfigField.value['HreSubmitProfileCardAddOrEdit']['Hidden']
                                : [];

                        let nextState = {},
                            tempConfig = {};

                        if (Array.isArray(res) && res.length > 0) {
                            res.map((item) => {
                                if (item?.FieldName && !item?.Nullable)
                                    tempConfig = {
                                        ...tempConfig,
                                        [item.FieldName]: {
                                            ...item
                                        }
                                    };
                            });

                            nextState = { ...nextState, fieldValid: tempConfig };
                        }

                        _configField.forEach((fieldConfig) => {
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
            }
        );
    };

    componentDidMount() {
        //get config validate
        this.getConfigValid('Hre_ProfileCard');
    }

    initData = () => {
        const { E_ProfileID, E_FullName } = enumName,
            _profile = {
                ID: profileInfo[E_ProfileID],
                ProfileName: profileInfo[E_FullName]
            },
            { Profile } = this.state;

        let nextState = {
            Profile: {
                ...Profile,
                ..._profile
            }
        };
        let readOnlyCtrlBT = this.readOnlyCtrlBT(true);

        nextState = {
            ...nextState,
            ...readOnlyCtrlBT
        };

        this.setState(nextState, () => {
            this.getUserApprove();
        });
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        const { ID } = record;

        let type = 'JobVacancyType';
        let arrRequest = [
            HttpService.Post('[URI_HR]/Por_GetData/GetRequirementRecuitmentById', { id: ID }),
            HttpService.Get(`[URI_SYS]/Sys_GetData/GetEnum?text=${type}`)
            // HttpService.Post("[URI_HR]/Att_GetData/GetHighSupervisor", {
            //   ProfileID: ProfileID,
            //   userSubmit: ProfileID,
            //   type: "E_REQUIREMENTRECRUITMENT",
            // }),
        ];

        VnrLoadingSevices.show();
        HttpService.MultiRequest(arrRequest).then((resAll) => {
            VnrLoadingSevices.hide();
            try {
                _handleSetState(record, resAll);
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    loadDurationType = () => {
        const { Type, ProfileReplace } = this.state;
        let type = 'JobVacancyType';

        HttpService.Get(`[URI_SYS]/Sys_GetData/GetEnum?text=${type}`).then((data) => {
            if (data.length !== 0) {
                let valType = {
                    Text: data[0]['Text'],
                    Value: data[0]['Value']
                };
                this.setState(
                    {
                        Type: {
                            ...Type,
                            value: valType,
                            data: data,
                            refresh: !Type.refresh
                        },
                        ProfileReplace: {
                            ...ProfileReplace,
                            visible: valType.Value === 'E_VACANCY_REPLACE' ? true : false,
                            refresh: !ProfileReplace.refresh
                        }
                    },
                    () => {
                        this.getUserApprove();
                    }
                );
            } else {
                this.setState(
                    {
                        Type: {
                            ...Type,
                            value: null,
                            data: data,
                            refresh: !Type.refresh
                        },
                        ProfileReplace: {
                            ...ProfileReplace,
                            visible: false,
                            refresh: !ProfileReplace.refresh
                        }
                    },
                    () => {
                        this.getUserApprove();
                    }
                );
            }
        });
    };

    //config user approve
    getUserApprove = () => {
        const { UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4, Profile } = this.state,
            profileID = Profile.ID;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Hre_GetData/GetUserApproveWithType', {
            userSubmit: profileID,
            profileID: profileID,
            Type: 'E_APPROVEWEARABLETAGS'
        }).then((data) => {
            VnrLoadingSevices.hide();
            try {
                if (data != null) {
                    let nextState = {
                        UserApproveID: { ...UserApproveID },
                        UserApproveID2: { ...UserApproveID2 },
                        UserApproveID3: { ...UserApproveID3 },
                        UserApproveID4: { ...UserApproveID4 }
                    };

                    this.levelApproved = data.LevelApprove;

                    if (data.LevelApprove == '1' || data.LevelApprove == '2') {
                        //isShowEle('#div_NguoiDuyetKeTiepStop');
                        //isShowEle('#div_NguoiDuyetTiepTheoStop');

                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                visible: false,
                                refresh: !UserApproveID2.refresh
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                visible: false,
                                refresh: !UserApproveID3.refresh
                            }
                        };

                        if (data.LevelApprove == '1') {
                            if (data.SupervisorID != null) {
                                // _UserApproveID.dataSource.add({ UserInfoName: data.SupervisorName, ID: data.SupervisorID });
                                // _UserApproveID.refresh();
                                // _UserApproveID.value([data.SupervisorID]);

                                nextState = {
                                    ...nextState,
                                    UserApproveID: {
                                        ...nextState.UserApproveID,
                                        refresh: !UserApproveID.refresh,
                                        value: {
                                            UserInfoName: data.SupervisorName,
                                            ID: data.SupervisorID
                                        }
                                    },
                                    UserApproveID4: {
                                        ...nextState.UserApproveID4,
                                        refresh: !UserApproveID4.refresh,
                                        value: {
                                            UserInfoName: data.SupervisorName,
                                            ID: data.SupervisorID
                                        },
                                        disable: true
                                    }
                                };

                                // _UserApproveID4.dataSource.add({ UserInfoName: data.SupervisorName, ID: data.SupervisorID });
                                // _UserApproveID4.refresh();
                                // _UserApproveID4.value([data.SupervisorID]);
                                // _UserApproveID4.readonly(true);
                            }
                        }

                        if (data.LevelApprove == '2') {
                            if (data.IsOnlyOneLevelApprove == true) {
                                this.isOnlyOneLevelApprove = true;

                                nextState = {
                                    ...nextState,
                                    UserApproveID4: {
                                        ...nextState.UserApproveID4,
                                        disable: true,
                                        refresh: !UserApproveID4.refresh
                                    }
                                };

                                //_UserApproveID4.readonly(true);
                                if (data.SupervisorID != null) {
                                    // _UserApproveID.dataSource.add({ UserInfoName: data.SupervisorName, ID: data.SupervisorID });
                                    // _UserApproveID.refresh();
                                    // _UserApproveID.value([data.SupervisorID]);

                                    // _UserApproveID2.dataSource.add({ UserInfoName: data.SupervisorName, ID: data.SupervisorID });
                                    // _UserApproveID2.refresh();
                                    // _UserApproveID2.value([data.SupervisorID]);

                                    nextState = {
                                        ...nextState,
                                        UserApproveID: {
                                            ...nextState.UserApproveID,
                                            value: {
                                                UserInfoName: data.SupervisorName,
                                                ID: data.SupervisorID
                                            },
                                            refresh: !UserApproveID.refresh
                                        },
                                        UserApproveID2: {
                                            ...nextState.UserApproveID2,
                                            value: {
                                                UserInfoName: data.SupervisorName,
                                                ID: data.SupervisorID
                                            },
                                            refresh: !UserApproveID2.refresh
                                        },
                                        UserApproveID3: {
                                            ...nextState.UserApproveID3,
                                            value: {
                                                UserInfoName: data.SupervisorName,
                                                ID: data.SupervisorID
                                            },
                                            refresh: !UserApproveID3.refresh
                                        },
                                        UserApproveID4: {
                                            ...nextState.UserApproveID4,
                                            value: {
                                                UserInfoName: data.SupervisorName,
                                                ID: data.SupervisorID
                                            },
                                            refresh: !UserApproveID4.refresh
                                        }
                                    };
                                    // _UserApproveID3.dataSource.add({ UserInfoName: data.SupervisorName, ID: data.SupervisorID });
                                    // _UserApproveID3.refresh();
                                    // _UserApproveID3.value([data.SupervisorID]);

                                    // _UserApproveID4.dataSource.add({ UserInfoName: data.SupervisorName, ID: data.SupervisorID });
                                    // _UserApproveID4.refresh();
                                    // _UserApproveID4.value([data.SupervisorID]);
                                }
                            } else {
                                if (data.SupervisorID != null) {
                                    // _UserApproveID.dataSource.add({ UserInfoName: data.SupervisorName, ID: data.SupervisorID });
                                    // _UserApproveID.refresh();
                                    // _UserApproveID.value([data.SupervisorID]);
                                    nextState = {
                                        ...nextState,
                                        UserApproveID: {
                                            ...nextState.UserApproveID,
                                            refresh: !UserApproveID.refresh,
                                            value: {
                                                UserInfoName: data.SupervisorName,
                                                ID: data.SupervisorID
                                            }
                                        }
                                    };
                                }
                                if (data.MidSupervisorID != null) {
                                    // _UserApproveID2.dataSource.add({ UserInfoName: data.SupervisorNextName, ID: data.MidSupervisorID });
                                    // _UserApproveID2.refresh();
                                    // _UserApproveID2.value([data.MidSupervisorID]);

                                    // _UserApproveID3.dataSource.add({ UserInfoName: data.SupervisorNextName, ID: data.MidSupervisorID });
                                    // _UserApproveID3.refresh();
                                    // _UserApproveID3.value([data.MidSupervisorID]);

                                    // _UserApproveID4.dataSource.add({ UserInfoName: data.SupervisorNextName, ID: data.MidSupervisorID });
                                    // _UserApproveID4.refresh();
                                    // _UserApproveID4.value([data.MidSupervisorID]);

                                    nextState = {
                                        ...nextState,
                                        UserApproveID2: {
                                            ...nextState.UserApproveID2,
                                            refresh: !UserApproveID2.refresh,
                                            value: {
                                                UserInfoName: data.SupervisorNextName,
                                                ID: data.MidSupervisorID
                                            }
                                        },
                                        UserApproveID3: {
                                            ...nextState.UserApproveID3,
                                            refresh: !UserApproveID3.refresh,
                                            value: {
                                                UserInfoName: data.SupervisorNextName,
                                                ID: data.MidSupervisorID
                                            }
                                        },
                                        UserApproveID4: {
                                            ...nextState.UserApproveID4,
                                            refresh: !UserApproveID4.refresh,
                                            value: {
                                                UserInfoName: data.SupervisorNextName,
                                                ID: data.MidSupervisorID
                                            }
                                        }
                                    };
                                }
                            }
                        }
                    } else if (data.LevelApprove == '3') {
                        //$("#div_NguoiDuyetKeTiepStop").show();
                        //$("#div_NguoiDuyetTiepTheoStop").hide();

                        // isShowEle('#div_NguoiDuyetKeTiepStop', true);
                        // isShowEle('#div_NguoiDuyetTiepTheoStop');

                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                visible: true,
                                refresh: !UserApproveID2.refresh
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                visible: false,
                                refresh: !UserApproveID3.refresh
                            }
                        };

                        if (data.SupervisorID != null) {
                            // _UserApproveID.dataSource.add({ UserInfoName: data.SupervisorName, ID: data.SupervisorID });
                            // _UserApproveID.refresh();
                            // _UserApproveID.value([data.SupervisorID]);
                            nextState = {
                                ...nextState,
                                UserApproveID: {
                                    ...nextState.UserApproveID,
                                    refresh: !UserApproveID.refresh,
                                    value: {
                                        UserInfoName: data.SupervisorName,
                                        ID: data.SupervisorID
                                    }
                                }
                            };
                        }
                        if (data.MidSupervisorID != null) {
                            // _UserApproveID2.dataSource.add({ UserInfoName: data.SupervisorNextName, ID: data.MidSupervisorID });
                            // _UserApproveID2.refresh();
                            // _UserApproveID2.value([data.MidSupervisorID]);
                            nextState = {
                                ...nextState,
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    refresh: !UserApproveID2.refresh,
                                    value: {
                                        UserInfoName: data.SupervisorNextName,
                                        ID: data.MidSupervisorID
                                    }
                                }
                            };
                        }
                        if (data.NextMidSupervisorID != null) {
                            // _UserApproveID3.dataSource.add({ UserInfoName: data.NextMidSupervisorName, ID: data.NextMidSupervisorID });
                            // _UserApproveID3.refresh();
                            // _UserApproveID3.value([data.NextMidSupervisorID]);

                            // _UserApproveID4.dataSource.add({ UserInfoName: data.NextMidSupervisorName, ID: data.NextMidSupervisorID });
                            // _UserApproveID2.refresh();
                            // _UserApproveID4.value(data.NextMidSupervisorID);

                            nextState = {
                                ...nextState,
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    refresh: !UserApproveID3.refresh,
                                    value: {
                                        UserInfoName: data.NextMidSupervisorName,
                                        ID: data.NextMidSupervisorID
                                    }
                                },
                                UserApproveID4: {
                                    ...nextState.UserApproveID4,
                                    refresh: !UserApproveID4.refresh,
                                    value: {
                                        UserInfoName: data.NextMidSupervisorName,
                                        ID: data.NextMidSupervisorID
                                    }
                                }
                            };
                        }
                    } else if (data.LevelApprove == '4') {
                        //$("#div_NguoiDuyetKeTiepStop").show();
                        //$("#div_NguoiDuyetTiepTheoStop").show();

                        // isShowEle('#div_NguoiDuyetKeTiepStop', true);
                        // isShowEle('#div_NguoiDuyetTiepTheoStop', true);

                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                visible: true,
                                refresh: !UserApproveID2.refresh
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                visible: true,
                                refresh: !UserApproveID3.refresh
                            }
                        };

                        if (data.SupervisorID != null) {
                            // _UserApproveID.dataSource.add({ UserInfoName: data.SupervisorName, ID: data.SupervisorID });
                            // _UserApproveID.refresh();
                            // _UserApproveID.value([data.SupervisorID]);

                            nextState = {
                                ...nextState,
                                UserApproveID: {
                                    ...nextState.UserApproveID,
                                    refresh: !UserApproveID.refresh,
                                    value: {
                                        UserInfoName: data.SupervisorName,
                                        ID: data.SupervisorID
                                    }
                                }
                            };
                        }
                        if (data.MidSupervisorID != null) {
                            // _UserApproveID2.dataSource.add({ UserInfoName: data.SupervisorNextName, ID: data.MidSupervisorID });
                            // _UserApproveID2.refresh();
                            // _UserApproveID2.value([data.MidSupervisorID]);
                            nextState = {
                                ...nextState,
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    refresh: !UserApproveID2.refresh,
                                    value: {
                                        UserInfoName: data.SupervisorNextName,
                                        ID: data.MidSupervisorID
                                    }
                                }
                            };
                        }
                        if (data.NextMidSupervisorID != null) {
                            // _UserApproveID3.dataSource.add({ UserInfoName: data.NextMidSupervisorName, ID: data.NextMidSupervisorID });
                            // _UserApproveID3.refresh();
                            // _UserApproveID3.value([data.NextMidSupervisorID]);
                            nextState = {
                                ...nextState,
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    refresh: !UserApproveID3.refresh,
                                    value: {
                                        UserInfoName: data.NextMidSupervisorName,
                                        ID: data.NextMidSupervisorID
                                    }
                                }
                            };
                        }
                        if (data.HighSupervisorID != null) {
                            // _UserApproveID4.dataSource.add({ UserInfoName: data.HighSupervisorName, ID: data.HighSupervisorID });
                            // _UserApproveID4.refresh();
                            // _UserApproveID4.value([data.HighSupervisorID]);
                            nextState = {
                                ...nextState,
                                UserApproveID4: {
                                    ...nextState.UserApproveID4,
                                    refresh: !UserApproveID4.refresh,
                                    value: {
                                        UserInfoName: data.HighSupervisorName,
                                        ID: data.HighSupervisorID
                                    }
                                }
                            };
                        }
                    } else {
                        //$("#div_NguoiDuyetKeTiepStop").hide();
                        //$("#div_NguoiDuyetTiepTheoStop").hide();
                        // isShowEle('#div_NguoiDuyetKeTiepStop');
                        // isShowEle('#div_NguoiDuyetTiepTheoStop');
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                visible: false,
                                refresh: !UserApproveID2.refresh
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                visible: false,
                                refresh: !UserApproveID3.refresh
                            }
                        };
                    }
                    this.setState(nextState);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    handleSetState = (record) => {
        let nextState = {};

        const {
            Profile,
            CardTypeIDs,
            CardActivationAreaList,
            ActivationRequired,
            ReasonCardIssue,
            Notes,
            FileAttach,
            UserApproveID,
            UserApproveID2,
            UserApproveID3,
            UserApproveID4
        } = this.state;
        // configHighSupervisor = resAll[2];

        nextState = {
            ...this.state,
            ID: record.ID,
            CardTypeIDs: {
                ...CardTypeIDs,
                value: record.lstCardTypes ? record.lstCardTypes : null,
                disable: false,
                refresh: !CardTypeIDs.refresh
            },
            Profile: {
                ...Profile,
                ID: record.UserSubmitID,
                ProfileName: record.UserSubmitName
            },
            CardActivationAreaList: {
                ...CardActivationAreaList,
                value: record.lstActivationAreas ? record.lstActivationAreas : null,
                disable: false,
                refresh: !CardActivationAreaList.refresh
            },
            ActivationRequired: {
                ...ActivationRequired,
                value: record.ActivationRequired,
                disable: false,
                refresh: !ActivationRequired.refresh
            },
            ReasonCardIssue: {
                ...ReasonCardIssue,
                value: record.ReasonCardIssue ? record.ReasonCardIssue : '',
                disable: false,
                refresh: !ReasonCardIssue.refresh
            },
            FileAttach: {
                ...FileAttach,
                value: record.lstFileAttach,
                disable: false,
                refresh: !FileAttach.refresh
            },
            Notes: {
                ...Notes,
                value: record.Notes ? record.Notes : '',
                disable: false,
                refresh: !Notes.refresh
            },
            UserApproveID: {
                ...UserApproveID,
                value: record.UserApproveID ? { ID: record.UserApproveID, UserInfoName: record.UserApproveName } : null,
                disable: true,
                refresh: !UserApproveID.refresh
            },
            UserApproveID2: {
                ...UserApproveID2,
                value: record.UserApproveID2
                    ? { ID: record.UserApproveID2, UserInfoName: record.UserApproveName2 }
                    : null,
                disable: true,
                refresh: !UserApproveID2.refresh
            },
            UserApproveID3: {
                ...UserApproveID3,
                value: record.UserApproveID3
                    ? { ID: record.UserApproveID3, UserInfoName: record.UserApproveName3 }
                    : null,
                disable: true,
                refresh: !UserApproveID3.refresh
            },
            UserApproveID4: {
                ...UserApproveID4,
                value: record.UserApproveID4
                    ? { ID: record.UserApproveID4, UserInfoName: record.UserApproveName4 }
                    : null,
                disable: true,
                refresh: !UserApproveID4.refresh
            }
        };

        this.setState(nextState);
    };
    //#endregion

    //picked duyệt đầu
    onChangeUserApproveID = (item) => {
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
    onChangeUserApproveID4 = (item) => {
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

    readOnlyCtrlBT = (isReadOnly) => {
        const { UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4 } = this.state;

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

        nextState = {
            ...nextState
            // DurationType: {
            //     ...DurationType,
            //     disable: isReadOnly,
            //     refresh: !DurationType.refresh,
            // },
            // PlaceSendToID: {
            //     ...PlaceSendToID,
            //     disable: isReadOnly,
            //     refresh: !PlaceSendToID.refresh,
            // },
            // PurposeRegisterID: {
            //     ...PurposeRegisterID,
            //     disable: isReadOnly,
            //     refresh: !PurposeRegisterID.refresh,
            // },
            // HourFrom: {
            //     ...HourFrom,
            //     disable: isReadOnly,
            //     refresh: !HourFrom.refresh,
            // },
            // HourTo: {
            //     ...HourTo,
            //     disable: isReadOnly,
            //     refresh: !HourTo.refresh,
            // },
            // PlaceFrom: {
            //     ...PlaceFrom,
            //     disable: isReadOnly,
            //     refresh: !PlaceFrom.refresh,
            // },
            // PlaceTo: {
            //     ...PlaceTo,
            //     disable: isReadOnly,
            //     refresh: !PlaceTo.refresh,
            // },
        };

        if (this.isModify) {
            // nextState = {
            //   ...nextState,
            //   WorkDate: {
            //     ...WorkDate,
            //     disable: true
            //   }
            // }
        }

        return nextState;
    };

    onSave = (navigation, isCreate, isSend) => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;
        const {
                ID,
                Profile,
                CardTypeIDs,
                CardActivationAreaList,
                ActivationRequired,
                ReasonCardIssue,
                Notes,
                FileAttach,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4
            } = this.state,
            { apiConfig } = dataVnrStorage,
            { uriPor } = apiConfig;

        let param = {
            UserSubmit: Profile.ID,
            ProfileID: Profile.ID,
            CardTypeIDs: Array.isArray(CardTypeIDs.value)
                ? CardTypeIDs.value
                    .map((item) => {
                        return item.ID;
                    })
                    .join()
                : null,
            CardActivationAreaList: Array.isArray(CardActivationAreaList.value)
                ? CardActivationAreaList.value
                    .map((item) => {
                        return item.ID;
                    })
                    .join()
                : null,
            ActivationRequired: ActivationRequired.value ? ActivationRequired.value : null,
            ReasonCardIssue: ReasonCardIssue.value,
            FileAttach: FileAttach.value ? FileAttach.value.map((item) => item.fileName).join(',') : null,
            Notes: Notes.value,

            IsPortal: true,
            UserSubmitID: Profile.ID,
            UserApproveID: UserApproveID.value ? UserApproveID.value.ID : null,
            UserApproveID2: UserApproveID2.value ? UserApproveID2.value.ID : null,
            UserApproveID3: UserApproveID3.value ? UserApproveID3.value.ID : null,
            UserApproveID4: UserApproveID4.value ? UserApproveID4.value.ID : null,

            //UserRegister: dataVnrStorage.currentUser.info.userid,
            ProfileRemoveIDs: this.ProfileRemoveIDs,
            //IsRemoveAndContinue: this.IsRemoveAndContinue,
            CacheID: this.CacheID,
            IsContinueSave: this.IsContinueSave,
            LevelApproved: this.levelApproved
        };

        // Send mail
        if (isSend) {
            param = {
                ...param,
                Status: 'E_SUBMIT',
                Host: uriPor,
                IsSendMail: true
            };
        }

        if (ID) {
            param = {
                ...param,
                ID
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Hre_ProfileCard', param).then((data) => {
            VnrLoadingSevices.hide();
            this.isProcessing = false;
            if (data.ConfigMessage) {
                if (data.ConfigMessage == 'E_BLOCK') {
                    this.isProcessing = false;
                    ToasterSevice.showWarning(data.ActionStatus, 4000);
                } else if (data.ConfigMessage == 'E_WARRNING') {
                    this.isProcessing = false;

                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        iconType: EnumIcon.E_WARNING,
                        message: data.ActionStatus,
                        //lưu và tiếp tục
                        textRightButton: translate('Button_OK'),
                        onConfirm: () => {
                            this.IsContinueSave = true;
                            this.onSave(navigation, isCreate, isSend);
                        },
                        //đóng
                        onCancel: () => {}
                    });
                }
            } else if (data.ActionStatus.indexOf('Success') >= 0) {
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

    onSaveAndCreate = (navigation) => {
        this.onSave(navigation, true, null);
    };

    onSaveAndSend = (navigation) => {
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

    mappingDataGroup = (dataGroup) => {
        let dataSource = [];
        // eslint-disable-next-line no-unused-vars
        for (let key in dataGroup) {
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
                        <View style={[styleViewTitleGroup, styles.styViewTitleGroupExtend]}>
                            <VnrText
                                style={[styleSheets.text, styles.styTextTitleGroup]}
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

                return (
                    <View key={index} style={styles.styleViewBorderButtom}>
                        {viewContent}
                    </View>
                );
            });
        } else {
            return <View />;
        }
    };

    getErrorMessageRespone() {
        const { modalErrorDetail } = this.state,
            { cacheID } = modalErrorDetail;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetErrorMessageRespone', {
            cacheID: cacheID
        }).then((res) => {
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

    formatDate = (val) => {
        if (val) {
            return moment(val).format('YYYY-MM-DD HH:mm:ss');
        }

        return null;
    };

    formatTime = (val) => {
        if (val) {
            return moment(val).format('HH:mm');
        }

        return null;
    };

    // nhan.nguyen: task: 0164710
    treeViewResult = (items) => {
        const { OrganizationStructureID } = this.state;
        this.setState(
            {
                OrganizationStructureID: {
                    ...OrganizationStructureID,
                    value: items
                }
            },
            () => {
                // this.onChangeTreeView();
            }
        );
    };

    render() {
        const {
            CardTypeIDs,
            CardActivationAreaList,
            ActivationRequired,
            ReasonCardIssue,
            Notes,
            FileAttach,
            UserApproveID,
            UserApproveID2,
            UserApproveID3,
            UserApproveID4,
            fieldValid,
            modalErrorDetail
        } = this.state;

        const { textLableInfo, contentViewControl, viewLable, viewControl, viewInputMultiline } =
            stylesListPickerControl;

        //#region [Xử lý 3 nút lưu]
        const listActions = [];

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Hre_ProfileCardPortalList_btnSendMail'] &&
            PermissionForAppMobile.value['New_Hre_ProfileCardPortalList_btnSendMail']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_SENMAIL,
                title: translate('HRM_Common_SaveAndEmail'),
                onPress: () => this.onSaveAndSend(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Hre_ProfileCardPortalList_btnSaveClose'] &&
            PermissionForAppMobile.value['New_Hre_ProfileCardPortalList_btnSaveClose']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_CLOSE,
                title: translate('HRM_Common_SaveClose'),
                onPress: () => this.onSave(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Hre_ProfileCardPortalList_btnSaveNew'] &&
            PermissionForAppMobile.value['New_Hre_ProfileCardPortalList_btnSaveNew']['View']
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
                        contentContainerStyle={styles.styViewKeyboard}
                        ref={(ref) => (this.scrollViewRef = ref)}
                    >
                        {/* Loại thẻ - CardTypeIDs */}
                        {CardTypeIDs.visibleConfig && CardTypeIDs.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={CardTypeIDs.label} />

                                    {/* valid CardTypeIDs */}
                                    {fieldValid.CardTypeIDs && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerMulti
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiCardType',
                                            type: 'E_GET'
                                        }}
                                        // dataLocal={CardTypeIDs.data}
                                        refresh={CardTypeIDs.refresh}
                                        textField="CardTypeNameCode"
                                        valueField="ID"
                                        filter={true}
                                        value={CardTypeIDs.value}
                                        filterServer={true}
                                        autoFilter={true}
                                        filterParams="text"
                                        disable={CardTypeIDs.disable}
                                        onFinish={(item) => {
                                            this.setState({
                                                CardTypeIDs: {
                                                    ...CardTypeIDs,
                                                    value: item,
                                                    refresh: !CardTypeIDs.refresh
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Khu vực kích hoạt - CardActivationAreaList */}
                        {CardActivationAreaList.visibleConfig && CardActivationAreaList.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={CardActivationAreaList.label}
                                    />

                                    {/* valid CardActivationAreaList */}
                                    {fieldValid.CardActivationAreaList && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerMulti
                                        api={{
                                            urlApi: '[URI_HR]/Hre_GetDataV2/GetMultiActivationArea',
                                            type: 'E_POST',
                                            dataBody: {
                                                text: ''
                                            }
                                        }}
                                        // dataLocal={CardActivationAreaList.data}
                                        refresh={CardActivationAreaList.refresh}
                                        textField="NameEntityName"
                                        valueField="ID"
                                        filter={true}
                                        value={CardActivationAreaList.value}
                                        filterServer={true}
                                        autoFilter={true}
                                        filterParams="text"
                                        disable={CardActivationAreaList.disable}
                                        onFinish={(item) => {
                                            this.setState({
                                                CardActivationAreaList: {
                                                    ...CardActivationAreaList,
                                                    value: item,
                                                    refresh: !CardActivationAreaList.refresh
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Yêu cầu kích hoạt  -  ActivationRequired*/}
                        {ActivationRequired.visibleConfig && ActivationRequired.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={ActivationRequired.label}
                                    />
                                    {fieldValid.ActivationRequired && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={ActivationRequired.disable}
                                        placeholder={translate(`${ActivationRequired.placeholder}`)}
                                        refresh={ActivationRequired.refresh}
                                        value={ActivationRequired.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                ActivationRequired: {
                                                    ...ActivationRequired,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Lý do cấp thẻ  -  ReasonCardIssue*/}
                        {ReasonCardIssue.visibleConfig && ReasonCardIssue.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={ReasonCardIssue.label}
                                    />
                                    {fieldValid.ReasonCardIssue && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={ReasonCardIssue.disable}
                                        placeholder={translate(`${ReasonCardIssue.placeholder}`)}
                                        refresh={ReasonCardIssue.refresh}
                                        value={ReasonCardIssue.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                ReasonCardIssue: {
                                                    ...ReasonCardIssue,
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
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={FileAttach.label} />

                                    {/* valid FileAttach */}
                                    {fieldValid.FileAttach && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrAttachFile
                                        disable={FileAttach.disable}
                                        refresh={FileAttach.refresh}
                                        value={FileAttach.value}
                                        multiFile={true}
                                        uri={'[URI_POR]/New_Home/saveFileFromApp'}
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
                            </View>
                        )}

                        {/* Ghi chú -  Notes*/}
                        {Notes.visibleConfig && Notes.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Notes.label} />
                                    {fieldValid.Notes && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Notes.disable}
                                        refresh={Notes.refresh}
                                        value={Notes.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                Notes: {
                                                    ...Notes,
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
                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_APPROVE_LATEEARLYALLOWED',
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
                                        onFinish={(item) => this.onChangeUserApproveID(item)}
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
                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_APPROVE_LATEEARLYALLOWED',
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
                                        onFinish={(item) => {
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
                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_APPROVE_LATEEARLYALLOWED',
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
                                        onFinish={(item) => {
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
                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_APPROVE_LATEEARLYALLOWED',
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
                                        onFinish={(item) => this.onChangeUserApproveID4(item)}
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
                                        style={stylesScreenDetailV3.modalBackdrop}
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
                                    <ScrollView style={styleSheets.flexGrow1flexDirectionColumn}>
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
    styViewKeyboard: {
        flexGrow: 1,
        paddingTop: 10
    },
    styTextTitleGroup: {
        fontWeight: '500',
        color: Colors.primary
    },
    styViewTitleGroupExtend: {
        marginHorizontal: 0,
        paddingBottom: 5,
        marginBottom: 10
    },
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
    }
});
