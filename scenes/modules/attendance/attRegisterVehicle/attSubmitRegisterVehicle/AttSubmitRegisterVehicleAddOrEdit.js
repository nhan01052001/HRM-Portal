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
import {
    IconColse
} from '../../../../../constants/Icons';
import Modal from 'react-native-modal';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';

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
    DateFrom: {
        label: 'HRM_Attendance_RegisterVehicle_RegisterDate',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    DateTo: {
        label: 'HRM_Attendance_RegisterVehicle_RegisterDate',
        value: null,
        refresh: false,
        disable: true,
        visibleConfig: true,
        visible: true
    },
    DurationType: {
        label: 'HRM_Attendance_RegisterVehicle_DurationType',
        data: [],
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    PurposeRegisterID: {
        label: 'HRM_Attendance_RegisterVehicle_PurposeRegister',
        data: [],
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    HourFrom: {
        label: 'HRM_Attendance_HoursFromTrip',
        value: null,
        refresh: false,
        disable: true,
        visibleConfig: true,
        visible: true
    },
    HourTo: {
        label: 'HRM_Attendance_HoursToTrip',
        value: null,
        refresh: false,
        disable: true,
        visibleConfig: true,
        visible: true
    },
    PlaceFrom: {
        label: 'HRM_Attendance_RegisterVehicle_PlaceFrom',
        disable: true,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    PlaceTo: {
        label: 'HRM_Attendance_RegisterVehicle_PlaceTo',
        disable: true,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    Note: {
        label: 'HRM_Attendance_RegisterVehicle_Note',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    PlaceSendToID: {
        label: 'HRM_Attendance_RegisterVehicle_SendTo',
        data: [],
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    FileAttachment: {
        label: 'HRM_Attendance_RegisterVehicle_FileAttachment',
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
        visible: false,
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

export default class AttSubmitRegisterVehicleAddOrEdit extends Component {
    constructor(props) {
        super(props);

        this.state = initSateDefault;

        // need fix
        props.navigation.setParams({
            title:
                props.navigation.state.params && props.navigation.state.params.record
                    ? 'HRM_Attendance_RegisterVehicle_Popup_Edit'
                    : 'HRM_Attendance_RegisterVehicle_Popup_Create'
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
        this.props.navigation.setParams({ title: 'HRM_Attendance_RegisterVehicle_Popup_Create' });
        this.setVariable();

        const { DateFrom, DateTo, FileAttachment } = this.state;
        let resetState = {
            ...initSateDefault,
            DateFrom: {
                ...initSateDefault.DateFrom,
                refresh: !DateFrom.refresh
            },
            DateTo: {
                ...initSateDefault.DateTo,
                refresh: !DateTo.refresh
            },
            FileAttachment: {
                ...initSateDefault.FileAttachment,
                refresh: !FileAttachment.refresh
            }
        };
        this.setState(resetState, () => this.getConfigValid('Att_RegisterVehicle', true));
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
                        ConfigField && ConfigField.value['AttSubmitRegisterVehicleAddOrEdit']
                            ? ConfigField.value['AttSubmitRegisterVehicleAddOrEdit']['Hidden']
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
        this.getConfigValid('Att_RegisterVehicle');
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

        let readOnlyCtrlBT = this.readOnlyCtrlBT(true);

        nextState = {
            ...nextState,
            ...readOnlyCtrlBT
        };

        this.setState(nextState, () => {
            this.GetHighSupervior();
        });
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        const { ID } = record,
            { E_ProfileID } = enumName,
            ProfileID = profileInfo[E_ProfileID];

        let type = 'BussinessTravelDurationType';

        let arrRequest = [
            HttpService.Get('[URI_HR]/Att_GetData/GetRegisterVehicleById?id=' + ID),
            HttpService.Get(`[URI_SYS]/Sys_GetData/GetEnum?text=${type}`),
            HttpService.Post('[URI_HR]/Att_GetData/GetHighSupervisor', {
                ProfileID: ProfileID,
                userSubmit: ProfileID,
                type: 'E_REGISTERVEHICLEAPPROVE'
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

    loadDurationType = () => {
        const { DateFrom, DateTo, DurationType } = this.state;
        if (DateFrom.value && DateTo.value) {
            let type = 'BussinessTravelDurationType';

            HttpService.Get(`[URI_SYS]/Sys_GetData/GetEnum?text=${type}`).then(data => {

                if (data.length == 1) {
                    let valDurationType = { Text: data[0]['Text'], Value: data[0]['Value'] };
                    this.setState({
                        DurationType: {
                            ...DurationType,
                            value: valDurationType,
                            data: data,
                            refresh: !DurationType.refresh
                        }
                    });
                } else {
                    this.setState({
                        DurationType: {
                            ...DurationType,
                            value: null,
                            data: data,
                            refresh: !DurationType.refresh
                        }
                    });
                }
            });
        }
    };

    handleSetState = (record, resAll) => {
        let nextState = {};

        const {
                Profile,
                DateFrom,
                DateTo,
                DurationType,
                PurposeRegisterID,
                HourFrom,
                HourTo,
                PlaceFrom,
                PlaceTo,
                PlaceSendToID,
                FileAttachment,
                Note,
                UserApproveID,
                UserApproveID3,
                UserApproveID4,
                UserApproveID2
            } = this.state,
            item = resAll[0],
            dataDurationType = resAll[1],
            configHighSupervisor = resAll[2];

        nextState = {
            ...this.state,
            ID: record.ID,
            Profile: {
                ...Profile,
                ID: item.ProfileID,
                ProfileName: item.ProfileName
            },
            DateFrom: {
                ...DateFrom,
                value: item.DateFrom ? moment(item.DateFrom).format('YYYY-MM-DD HH:mm:ss') : null,
                disable: false,
                refresh: !DateFrom.refresh
            },
            DateTo: {
                ...DateTo,
                value: item.DateTo ? moment(item.DateTo).format('YYYY-MM-DD HH:mm:ss') : null,
                disable: false,
                refresh: !DateTo.refresh
            },
            HourFrom: {
                ...HourFrom,
                value: item.HourFrom ? moment(item.HourFrom).format('YYYY-MM-DD HH:mm:ss') : null,
                disable: false,
                refresh: !HourFrom.refresh
            },
            HourTo: {
                ...HourTo,
                value: item.HourTo ? moment(item.HourTo).format('YYYY-MM-DD HH:mm:ss') : null,
                disable: false,
                refresh: !HourTo.refresh
            },
            DurationType: {
                ...DurationType,
                data: dataDurationType,
                value:
                    item.DurationType && dataDurationType
                        ? dataDurationType.find(i => i.Value == item.DurationType)
                        : null,
                disable: false,
                visible: true,
                refresh: !DurationType.refresh
            },
            PurposeRegisterID: {
                ...PurposeRegisterID,
                value: item.PurposeRegisterID
                    ? { ID: item.PurposeRegisterID, RegisterVehicleTypeName: item.RegisterVehicleTypeName }
                    : null,
                disable: false,
                visible: true,
                refresh: !PurposeRegisterID.refresh
            },
            PlaceSendToID: {
                ...PlaceSendToID,
                value: item.PlaceSendToID ? { ID: item.PlaceSendToID, WorkPlaceCodeName: item.PlaceSendTo } : null,
                disable: false,
                visible: true,
                refresh: !PlaceSendToID.refresh
            },
            FileAttachment: {
                ...FileAttachment,
                value: item.lstFileAttach,
                disable: false,
                refresh: !FileAttachment.refresh
            },
            PlaceFrom: {
                ...PlaceFrom,
                value: item.PlaceFrom ? item.PlaceFrom : '',
                disable: false,
                refresh: !PlaceFrom.refresh,
                visible: true
            },
            PlaceTo: {
                ...PlaceTo,
                value: item.PlaceTo ? item.PlaceTo : '',
                disable: false,
                refresh: !PlaceTo.refresh,
                visible: true
            },
            Note: {
                ...Note,
                value: item.Note ? item.Note : '',
                refresh: !Note.refresh
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

        if (configHighSupervisor && configHighSupervisor.LevelApprove > 0) {
            if (configHighSupervisor.IsChangeApprove != true) {
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

        if (configHighSupervisor && configHighSupervisor.LevelApprove > 0) {
            if (configHighSupervisor.IsChangeApprove != true) {
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

        if (configHighSupervisor) {
            this.levelApproveLateEarlyAllowed = configHighSupervisor.LevelApprove;
            if (configHighSupervisor.LevelApprove == 2) {
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
            } else if (configHighSupervisor.LevelApprove == 3) {
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
            } else if (configHighSupervisor.LevelApprove == 4) {
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

        this.setState(nextState);
    };
    //#endregion

    onChangeDateFrom = value => {
        const { DateFrom, DateTo, DurationType } = this.state;

        let nextState = {
            DateFrom: {
                ...DateFrom,
                value: value,
                refresh: !DateFrom.refresh
            },
            DurationType: {
                ...DurationType,
                DurationType: {
                    ...DurationType,
                    value: null,
                    disable: false,
                    refresh: !DurationType.refresh
                }
            }
        };

        if (value) {
            let _state = this.readOnlyCtrlBT(false);

            nextState = {
                ...nextState,
                ..._state
            };

            nextState = {
                ...nextState,
                DateTo: {
                    ...DateTo,
                    value: value,
                    disable: false,
                    refresh: !DateTo.refresh
                }
            };

            this.setState(nextState, () => {
                this.loadDurationType();
            });
        } else {
            let _state = this.readOnlyCtrlBT(true);
            nextState = {
                ...nextState,
                ..._state,
                DateTo: {
                    ...DateTo,
                    disable: true,
                    refresh: !DateTo.refresh
                }
            };

            this.setState(nextState, () => {
                this.loadDurationType();
            });
        }
    };

    onChangeDateTo = value => {
        const { DateTo } = this.state;

        let nextState = {
            DateTo: {
                ...DateTo,
                value: value,
                refresh: !DateTo.refresh
            }
        };

        if (value) {
            this.setState(nextState, () => {
                this.loadDurationType();
            });
        } else {
            let _state = this.readOnlyCtrlBT(true);
            nextState = {
                ...nextState,
                ..._state
            };

            this.setState(nextState, () => {
                this.loadDurationType();
            });
        }
    };

    GetHighSupervior = () => {
        const {
            Profile,
            UserApproveID,
            UserApproveID2,
            UserApproveID3,
            UserApproveID4
            //PurposeRegisterID
        } = this.state;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetHighSupervisor', {
            ProfileID: Profile.ID,
            userSubmit: Profile.ID,
            type: 'E_REGISTERVEHICLEAPPROVE',
            resource: {
                // BusinessTripTypeID : PurposeRegisterID.val
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
                                    ID: result.MidSupervisorID
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

    readOnlyCtrlBT = isReadOnly => {
        const {
            UserApproveID,
            UserApproveID2,
            UserApproveID3,
            UserApproveID4,
            DurationType,
            PlaceSendToID,
            PurposeRegisterID,
            HourFrom,
            HourTo,
            PlaceFrom,
            PlaceTo
        } = this.state;

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
            ...nextState,
            DurationType: {
                ...DurationType,
                disable: isReadOnly,
                refresh: !DurationType.refresh
            },
            PlaceSendToID: {
                ...PlaceSendToID,
                disable: isReadOnly,
                refresh: !PlaceSendToID.refresh
            },
            PurposeRegisterID: {
                ...PurposeRegisterID,
                disable: isReadOnly,
                refresh: !PurposeRegisterID.refresh
            },
            HourFrom: {
                ...HourFrom,
                disable: isReadOnly,
                refresh: !HourFrom.refresh
            },
            HourTo: {
                ...HourTo,
                disable: isReadOnly,
                refresh: !HourTo.refresh
            },
            PlaceFrom: {
                ...PlaceFrom,
                disable: isReadOnly,
                refresh: !PlaceFrom.refresh
            },
            PlaceTo: {
                ...PlaceTo,
                disable: isReadOnly,
                refresh: !PlaceTo.refresh
            }
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
                DateFrom,
                DateTo,
                DurationType,
                PurposeRegisterID,
                HourFrom,
                HourTo,
                PlaceFrom,
                PlaceTo,
                PlaceSendToID,
                FileAttachment,
                UserApproveID,
                UserApproveID3,
                UserApproveID4,
                UserApproveID2,
                Note
            } = this.state,
            { apiConfig } = dataVnrStorage,
            { uriPor } = apiConfig;

        let param = {
            ProfileID: Profile.ID,
            Status: 'E_SUBMIT',

            DateFrom: DateFrom.value ? moment(DateFrom.value).format('YYYY-MM-DD HH:mm:ss') : null,
            DateTo: DateTo.value ? moment(DateTo.value).format('YYYY-MM-DD HH:mm:ss') : null,
            HourFrom: HourFrom.value ? moment(HourFrom.value).format('YYYY-MM-DD HH:mm:ss') : null,
            HourTo: HourTo.value ? moment(HourTo.value).format('YYYY-MM-DD HH:mm:ss') : null,
            DurationType: DurationType.value ? DurationType.value.Value : null,
            PurposeRegisterID: PurposeRegisterID.value ? PurposeRegisterID.value.ID : null,
            PlaceSendToID: PlaceSendToID.value ? PlaceSendToID.value.ID : null,
            FileAttachment: FileAttachment.value ? FileAttachment.value.map(item => item.fileName).join(',') : null,
            PlaceFrom: PlaceFrom.value,
            PlaceTo: PlaceTo.value,
            Note: Note.value,

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
            IsContinueSave: this.IsContinueSave
        };

        // Send mail
        if (isSend) {
            param = {
                ...param,
                SendEmailStatus: 'E_SUBMIT',
                Host: uriPor,
                IsAddNewAndSendMail: true
            };
        }

        if (ID) {
            param = {
                ...param,
                ID
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Att_RegisterVehicle', param).then(data => {

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
                        onCancel: () => { }
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
                                {
                                    ...CustomStyleSheet.marginHorizontal(0),
                                    ...CustomStyleSheet.marginBottom(10)
                                }
                            ]}
                        >
                            <VnrText
                                style={[styleSheets.text, {
                                    ...CustomStyleSheet.fontWeight('500'),
                                    ...CustomStyleSheet.color(Colors.primary)
                                }]}
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

    render() {
        const {
            DateFrom,
            DateTo,
            DurationType,
            PurposeRegisterID,
            HourFrom,
            HourTo,
            PlaceFrom,
            PlaceTo,
            PlaceSendToID,
            Note,
            FileAttachment,
            UserApproveID,
            UserApproveID2,
            UserApproveID3,
            UserApproveID4,
            fieldValid,
            modalErrorDetail
        } = this.state;

        const {
            textLableInfo,
            contentViewControl,
            viewLable,
            viewControl,
            viewInputMultiline,
            formDate_To_From,
            controlDate_To,
            controlDate_from
        } = stylesListPickerControl;

        //#region [Xử lý 3 nút lưu]
        const listActions = [];

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_RegisterVehicle_New_CreateOrUpdate_btnSaveandSendMail'] &&
            PermissionForAppMobile.value['New_Att_RegisterVehicle_New_CreateOrUpdate_btnSaveandSendMail']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_SENMAIL,
                title: translate('HRM_Common_SaveAndSendMail'),
                onPress: () => this.onSaveAndSend(this.props.navigation)
            });
        }
        // listActions.push(
        //   {
        //     type: EnumName.E_SAVE_SENMAIL,
        //     title: translate('HRM_Common_SaveAndSendMail'),
        //     onPress: () => this.onSaveAndSend(this.props.navigation),
        //   }
        // );

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_RegisterVehicle_New_CreateOrUpdate_btnSaveClose'] &&
            PermissionForAppMobile.value['New_Att_RegisterVehicle_New_CreateOrUpdate_btnSaveClose']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_CLOSE,
                title: translate('HRM_Common_SaveClose'),
                onPress: () => this.onSave(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_RegisterVehicle_New_CreateOrUpdate_btnSaveCreate'] &&
            PermissionForAppMobile.value['New_Att_RegisterVehicle_New_CreateOrUpdate_btnSaveCreate']['View']
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
                        contentContainerStyle={{ ...CustomStyleSheet.flexGrow(1), ...CustomStyleSheet.padding(1) }}
                        ref={ref => (this.scrollViewRef = ref)}
                    >
                        {/* Thời gian công tác - DateFrom - DateTo */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DateFrom.label} />

                                {/* valid DateFrom */}
                                {fieldValid.DateFrom && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>
                            <View style={viewControl}>
                                <View style={formDate_To_From}>
                                    <View style={controlDate_from}>
                                        <VnrDate
                                            disable={DateFrom.disable}
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={DateFrom.value}
                                            refresh={DateFrom.refresh}
                                            type={'date'}
                                            onFinish={value => this.onChangeDateFrom(value)}
                                        />
                                    </View>
                                    <View style={controlDate_To}>
                                        <VnrDate
                                            disable={DateTo.disable}
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={DateTo.value}
                                            refresh={DateTo.refresh}
                                            type={'date'}
                                            onFinish={value => this.onChangeDateTo(value)}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Loại đăng ký -  DurationType */}
                        {DurationType.visibleConfig && DurationType.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DurationType.label} />

                                    {/* valid DurationType */}
                                    {fieldValid.DurationType && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        autoFilter={true}
                                        dataLocal={DurationType.data}
                                        refresh={DurationType.refresh}
                                        textField="Text"
                                        valueField="Value"
                                        filter={true}
                                        value={DurationType.value}
                                        filterServer={false}
                                        disable={DurationType.disable}
                                        onFinish={item =>
                                            this.setState({
                                                DurationType: {
                                                    ...DurationType,
                                                    value: item,
                                                    refresh: !DurationType.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Loại công tác -  PurposeRegisterID */}
                        {PurposeRegisterID.visibleConfig && PurposeRegisterID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={PurposeRegisterID.label}
                                    />

                                    {/* valid PurposeRegisterID */}
                                    {fieldValid.PurposeRegisterID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiPurposeRegisterVehicle',
                                            type: 'E_GET'
                                        }}
                                        autoFilter={true}
                                        refresh={PurposeRegisterID.refresh}
                                        textField="RegisterVehicleTypeName"
                                        valueField="ID"
                                        filter={true}
                                        value={PurposeRegisterID.value}
                                        filterServer={false}
                                        disable={PurposeRegisterID.disable}
                                        onFinish={item =>
                                            this.setState({
                                                PurposeRegisterID: {
                                                    ...PurposeRegisterID,
                                                    value: item,
                                                    refresh: !PurposeRegisterID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Giờ đi - Giờ về -  HourFrom - HourTo*/}
                        {HourFrom.visibleConfig && HourFrom.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        value={`${translate(HourFrom.label)} - ${translate(HourTo.label)}`}
                                    />

                                    {/* valid HourFrom */}
                                    {fieldValid.HourFrom && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <View style={formDate_To_From}>
                                        <View style={controlDate_from}>
                                            <VnrDate
                                                disable={HourFrom.disable}
                                                format={'HH:mm'}
                                                value={HourFrom.value}
                                                refresh={HourFrom.refresh}
                                                type={'time'}
                                                onFinish={value =>
                                                    this.setState({
                                                        HourFrom: {
                                                            ...HourFrom,
                                                            value: value,
                                                            refresh: !HourFrom.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                        <View style={controlDate_To}>
                                            <VnrDate
                                                disable={HourTo.disable}
                                                format={'HH:mm'}
                                                value={HourTo.value}
                                                refresh={HourTo.refresh}
                                                type={'time'}
                                                onFinish={value =>
                                                    this.setState({
                                                        HourTo: {
                                                            ...HourTo,
                                                            value: value,
                                                            refresh: !HourTo.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Nơi đi -  PlaceFrom*/}
                        {PlaceFrom.visibleConfig && PlaceFrom.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PlaceFrom.label} />
                                    {fieldValid.PlaceFrom && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={PlaceFrom.disable}
                                        refresh={PlaceFrom.refresh}
                                        value={PlaceFrom.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={text =>
                                            this.setState({
                                                PlaceFrom: {
                                                    ...PlaceFrom,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Nơi đến -  PlaceTo*/}
                        {PlaceTo.visibleConfig && PlaceTo.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PlaceTo.label} />
                                    {fieldValid.PlaceTo && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={PlaceTo.disable}
                                        refresh={PlaceTo.refresh}
                                        value={PlaceTo.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={text =>
                                            this.setState({
                                                PlaceTo: {
                                                    ...PlaceTo,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Nơi gửi đến -  PlaceSendToID */}
                        {PlaceSendToID.visibleConfig && PlaceSendToID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PlaceSendToID.label} />

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
                                        autoBind={true}
                                        autoFilter={true}
                                        refresh={PlaceSendToID.refresh}
                                        textField="WorkPlaceCodeName"
                                        valueField="ID"
                                        filter={true}
                                        value={PlaceSendToID.value}
                                        filterServer={false}
                                        disable={PlaceSendToID.disable}
                                        onFinish={item =>
                                            this.setState({
                                                PlaceSendToID: {
                                                    ...PlaceSendToID,
                                                    value: item,
                                                    refresh: !PlaceSendToID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Tập tin đính kèm - FileAttach */}
                        {FileAttachment.visible && FileAttachment.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={FileAttachment.label} />

                                    {/* valid FileAttachment */}
                                    {fieldValid.FileAttachment && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrAttachFile
                                        disable={FileAttachment.disable}
                                        refresh={FileAttachment.refresh}
                                        value={FileAttachment.value}
                                        multiFile={true}
                                        uri={'[URI_POR]/New_Home/saveFileFromApp'}
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

                        {/* Ghi chú -  Note*/}
                        {Note.visibleConfig && Note.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Note.label} />
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
    coating: {
        flex: 1,
        backgroundColor: Colors.black,
        opacity: 0.5
    },
    wrapRenderError: { flexGrow: 1, flexDirection: 'column' },
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
