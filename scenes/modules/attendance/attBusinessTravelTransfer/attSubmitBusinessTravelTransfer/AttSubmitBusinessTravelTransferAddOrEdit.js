import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Text, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    Size,
    stylesModalPopupBottom,
    styleViewTitleForGroup
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import HttpService from '../../../../../utils/HttpService';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../utils/DrawerServices';
// import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { EnumName, EnumIcon } from '../../../../../assets/constant';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { IconColse } from '../../../../../constants/Icons';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import Modal from 'react-native-modal';
let enumName = null,
    profileInfo = null;

const initSateDefault = {
    ID: null,
    Profile: {
        label: 'HRM_Attendance_Leaveday_ProfileID',
        ID: null,
        ProfileName: '',
        disable: true,
        visible: false
    },
    BusinessTrip: {
        label: 'HRM_Att_BusinessTrip',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    BusinessTravelID: {
        label: 'HRM_Attendance_BusinessTravelType',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    TransferDate: {
        label: 'HRM_Att_TransferDate',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    DayType: {
        label: 'HRM_Attendance_ScheduleWork',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    LeaveDayTypeCode: {
        label: 'HRM_Attendance_LeavedayTypeView',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    TransferTypeID: {
        label: 'HRM_Att_MovementType',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    HourFrom: {
        label: 'HRM_Att_BusinessTravelTransfer_TransferDate',
        value: null,
        refresh: false,
        disable: true,
        visibleConfig: true,
        visible: true
    },
    HourTo: {
        label: 'HRM_Att_BusinessTravelTransfer_TransferDate',
        value: null,
        refresh: false,
        disable: true,
        visibleConfig: true,
        visible: true
    },
    HourTotal: {
        label: 'HRM_Att_BusinessTravelTransfer_TotalHour',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    TransferRoute: {
        label: 'HRM_Att_BusinessTravelTransfer_TransferRoute',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    UserApproveID: {
        label: 'HRM_Attendance_TAMScanLog_UserApproveID',
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    UserApproveID2: {
        label: 'HRM_Attendance_TAMScanLog_UserApproveID3',
        disable: true,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    UserApproveID3: {
        label: 'HRM_Attendance_TAMScanLog_UserApproveID4',
        disable: true,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    UserApproveID4: {
        label: 'HRM_Attendance_TAMScanLog_UserApproveID2',
        disable: true,
        visible: true,
        refresh: false,
        value: null,
        visibleConfig: true
    },
    modalErrorDetail: {
        isModalVisible: false,
        cacheID: null,
        data: []
    },
    fieldValid: {}
};

export default class AttSubmitBusinessTravelTransferAddOrEdit extends Component {
    constructor(props) {
        super(props);
        this.state = initSateDefault;
        //set title screen
        props.navigation.setParams({
            title:
                props.navigation.state.params && props.navigation.state.params.record
                    ? 'HRM_Attendance_BusinessTravelTransfer_Popup_Edit'
                    : 'HRM_Attendance_BusinessTravelTransfer_Popup_Create'
        });
        this.setVariable();
    }

    setVariable = () => {
        //biến trạng thái
        this.isModify = false;
        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;
        this.isChangeLevelApprove = null;
        this.levelApprovePregnancyRegister = null;
        this.dataMidApprove = [];
        this.dataLastApprove = [];
        this.levelApproveBusinessTravelTransfer = null;
        //this.UserSubmitIDForEdit = null;

        // this xử lý save
        this.ProfileRemoveIDs = null;
        this.IsRemoveAndContinue = null;
        this.CacheID = null;
    };

    refreshView = () => {
        this.props.navigation.setParams({ title: 'HRM_Attendance_BusinessTravelTransfer_Popup_Create' });
        this.setVariable();
        // Lỗi không clean được control VnrDate, tạm thời fix như vậy
        // có thể fix ở control VnrDate nhưng sợ ảnh hưởng các case khác
        const { TransferDate, HourFrom, HourTo } = this.state;
        let resetState = {
            ...initSateDefault,
            TransferDate: {
                ...initSateDefault.TransferDate,
                refresh: !TransferDate.refresh
            },
            HourFrom: {
                ...initSateDefault.HourFrom,
                refresh: !HourFrom.refresh
            },
            HourTo: {
                ...initSateDefault.HourTo,
                refresh: !HourTo.refresh
            }
        };

        this.setState(resetState, () => this.getConfigValid('Att_BusinessTravelTransfer', true));
    };

    //#region [khởi tạo - lấy các dữ liệu cho control, lấy giá trị mặc đinh]

    //promise get config valid
    getConfigValid = (tblName, isRefresh) => {
        VnrLoadingSevices.show();
        HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName).then((res) => {
            VnrLoadingSevices.hide();
            if (res) {
                try {
                    //map field hidden by config
                    const _configField =
                        ConfigField && ConfigField.value['AttSubmitBusinessTravelTransferAddOrEdit']
                            ? ConfigField.value['AttSubmitBusinessTravelTransferAddOrEdit']['Hidden']
                            : [];

                    let nextState = { fieldValid: res };

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
        });
    };

    componentDidMount() {
        //get config validate
        this.getConfigValid('Att_BusinessTravelTransfer');
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

        this.setState(nextState, () => this.GetDataBusinessTrip());
    };

    GetDataBusinessTrip = () => {
        const { Profile, BusinessTrip } = this.state,
            { ID } = Profile;
        let nextState = {};

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetMultiBusinessTravelByProfileIDs', { profileIDs: ID }).then(
            (result) => {
                VnrLoadingSevices.hide();

                if (result) {
                    if (result.length == 1) {
                        let businessTrip = { BusinessTravelDate: result[0]['BusinessTravelDate'], ID: result[0]['ID'] };
                        nextState = {
                            ...nextState,
                            BusinessTrip: {
                                ...BusinessTrip,
                                data: [businessTrip],
                                value: businessTrip,
                                refresh: !BusinessTrip.refresh
                            }
                        };
                    } else {
                        nextState = {
                            ...nextState,
                            BusinessTrip: {
                                ...BusinessTrip,
                                data: [...result],
                                refresh: !BusinessTrip.refresh
                            }
                        };
                    }
                }

                this.setState(nextState, () => {
                    this.GetHighSupervior();

                    if (result && result.length == 1) {
                        this.GetDataBusinessTravel();
                    }
                });
            }
        );
    };

    GetDataBusinessTravel() {
        const { BusinessTrip, BusinessTravelID, TransferTypeID } = this.state;
        let nextState = {};

        if (BusinessTrip.value) {
            HttpService.Post('[URI_HR]/Att_GetData/GetBusinessTripTypeByBusinessTravelID', {
                id: BusinessTrip.value.ID
            }).then((result) => {
                if (result) {
                    let businessTripType = { BusinessTravelType: result['BusinessTravelType'], ID: result['ID'] };
                    nextState = {
                        BusinessTravelID: {
                            ...BusinessTravelID,
                            data: [businessTripType],
                            value: businessTripType,
                            refresh: !BusinessTravelID.refresh,
                            disable: true
                        }
                    };

                    this.setState(nextState, () => {
                        this.GetDataMovementType();
                    });
                }
            });
        } else {
            nextState = {
                BusinessTravelID: {
                    ...BusinessTravelID,
                    data: [],
                    value: null,
                    refresh: !BusinessTravelID.refresh,
                    disable: true
                },
                TransferTypeID: {
                    ...TransferTypeID,
                    data: [],
                    value: null,
                    refresh: !TransferTypeID.refresh
                }
            };

            this.setState(nextState);
        }
    }

    GetDataMovementType() {
        const { BusinessTravelID, TransferTypeID, TransferDate, Profile } = this.state,
            { ID } = Profile;

        let _id = BusinessTravelID.value ? BusinessTravelID.value.ID : null,
            nextState = {};

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/LoadTransferTypeByTransferDate', {
            profileID: ID,
            businessTripTypeIds: _id,
            dateTransfer: Vnr_Function.formatDateAPI(TransferDate.value)
        }).then((result) => {
            VnrLoadingSevices.hide();
            if (result) {
                if (result.length == 1) {
                    let movementTypeView = { MovementTypeName: result[0]['MovementTypeName'], ID: result[0]['ID'] };
                    nextState = {
                        TransferTypeID: {
                            ...TransferTypeID,
                            data: [movementTypeView],
                            value: movementTypeView,
                            refresh: !TransferTypeID.refresh,
                            disable: true
                        }
                    };
                } else if (result.length > 0) {
                    nextState = {
                        TransferTypeID: {
                            ...TransferTypeID,
                            data: result,
                            value: null,
                            disable: false,
                            refresh: !TransferTypeID.refresh
                        }
                    };
                } else {
                    // khong có du lieu
                    nextState = {
                        TransferTypeID: {
                            ...TransferTypeID,
                            refresh: !TransferTypeID.refresh,
                            value: null,
                            disable: true
                        }
                    };
                }

                this.setState(nextState, () => this.ReadOnlyHourFromHourTo());
            } else {
                this.ReadOnlyHourFromHourTo();
            }
        });
    }

    handleSetState = (record, res) => {
        const {
                Profile,
                BusinessTrip,
                BusinessTravelID,
                TransferDate,
                TransferTypeID,
                HourFrom,
                HourTo,
                HourTotal,
                TransferRoute,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4
            } = this.state,
            item = res[0],
            businessTravel = res[1],
            dataCatMovementTypes = res[2];

        let nextState = {},
            dataBusinessTravel = [];

        if (businessTravel) {
            dataBusinessTravel = [
                { BusinessTravelType: businessTravel['BusinessTravelType'], ID: businessTravel['ID'] }
            ];
        }

        nextState = {
            ID: record.ID,
            Profile: {
                ...Profile,
                ID: item.ProfileID,
                ProfileName: item.ProfileName
            },
            BusinessTrip: {
                ...BusinessTrip,
                value: item.BusinessTripID ? { BusinessTravelDate: item.BusinessTrip, ID: item.BusinessTripID } : null,
                refresh: !BusinessTrip.refresh
            },
            BusinessTravelID: {
                ...BusinessTravelID,
                value: item.BusinessTravelID
                    ? { BusinessTravelType: item.BusinessTravelType, ID: item.BusinessTravelID }
                    : null,
                data: dataBusinessTravel ? [...dataBusinessTravel] : [],
                refresh: !BusinessTravelID.refresh
            },
            TransferTypeID: {
                ...TransferTypeID,
                value: item.TransferTypeID ? { MovementTypeName: item.MovementType, ID: item.TransferTypeID } : null,
                data: dataCatMovementTypes ? [...dataCatMovementTypes] : [],
                refresh: !TransferTypeID.refresh
            },
            TransferDate: {
                ...TransferDate,
                value: item.TransferDate ? moment(item.TransferDate).format('YYYY-MM-DD HH:mm:ss') : null,
                disable: false,
                refresh: !TransferDate.refresh
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
            HourTotal: {
                ...HourTotal,
                value: item.HourTotal ? item.HourTotal.toString() : '',
                disable: false,
                refresh: !HourTotal.refresh
            },
            TransferRoute: {
                ...TransferRoute,
                value: item.TransferRoute,
                disable: false,
                refresh: !TransferRoute.refresh
            },
            UserApproveID: {
                ...UserApproveID,
                value: item.UserApproveID ? { ID: item.UserApproveID, UserInfoName: item.FirstApproverName } : null,
                refresh: !UserApproveID.refresh
            },
            UserApproveID2: {
                ...UserApproveID2,
                value: item.UserApproveID2 ? { ID: item.UserApproveID2, UserInfoName: item.MidApproverName } : null,
                refresh: !UserApproveID2.refresh
            },
            UserApproveID3: {
                ...UserApproveID3,
                value: item.UserApproveID3 ? { ID: item.UserApproveID3, UserInfoName: item.NextApproverName } : null,
                refresh: !UserApproveID3.refresh
            },
            UserApproveID4: {
                ...UserApproveID4,
                value: item.UserApproveID4 ? { ID: item.UserApproveID4, UserInfoName: item.LastApproverName } : null,
                refresh: !UserApproveID4.refresh
            }
        };

        this.setState(nextState, () => {
            this.GetDataBusinessTrip();
            this.getDayTypeAndDayCode();
        });
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        const { ID, BusinessTripID, BusinessTravelID } = record;
        let arrRequest = [HttpService.Get('[URI_HR]/Att_GetData/GetBussinessTravelTransferByID?id=' + ID)];

        if (BusinessTripID) {
            arrRequest = [
                ...arrRequest,
                HttpService.Post('[URI_HR]/Att_GetData/GetBusinessTripTypeByBusinessTravelID', { id: BusinessTripID })
            ];
        }

        if (BusinessTravelID) {
            arrRequest = [
                ...arrRequest,
                HttpService.Post('[URI_HR]/Att_GetData/GetCatMovementTypesRawData', {
                    businessTripTypeIds: BusinessTravelID
                })
            ];
        }

        VnrLoadingSevices.show();
        HttpService.MultiRequest(arrRequest).then((res) => {
            VnrLoadingSevices.hide();
            try {
                if (res && res.length) {
                    _handleSetState(record, res);
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 5000);
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };
    //#endregion

    GetHighSupervior = () => {
        const { Profile, UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4 } = this.state;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]//Att_GetData/GetHighSupervisor', {
            ProfileID: Profile.ID,
            userSubmit: Profile.ID,
            type: 'E_BUSINESSTRAVELTRANSFER'
        }).then((result) => {
            VnrLoadingSevices.hide();
            let nextState = {
                UserApproveID: { ...UserApproveID },
                UserApproveID2: { ...UserApproveID2 },
                UserApproveID3: { ...UserApproveID3 },
                UserApproveID4: { ...UserApproveID4 }
            };

            //truong hop chạy theo approve grade
            if (result.LevelApprove > 0) {
                if (result.IsChangeApprove != true) {
                    // multiUserApproveID.enable(false);
                    // multiUserApproveID2.enable(false);
                    // multiUserApproveID3.enable(false);
                    // multiUserApproveID4.enable(false);
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
                } else {
                    // multiUserApproveID.enable(true);
                    // multiUserApproveID2.enable(true);
                    // multiUserApproveID3.enable(true);
                    // multiUserApproveID4.enable(true);
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
                }

                this.levelApproveBusinessTravelTransfer = result.LevelApprove;

                if (result.LevelApprove == 2) {
                    if (result.IsOnlyOneLevelApprove) {
                        this.levelApproveBusinessTravelTransfer = 1;

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
                        //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
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
                        // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID);
                        // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID);
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
                        //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
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
                        //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                value: { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }
                            }
                        };
                    } else if (!this.isModify) {
                        //multiUserApproveID4.value(null);
                        nextState = {
                            ...nextState,
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                value: null
                            }
                        };
                    }

                    if (result.HighSupervisorID) {
                        //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                            }
                        };
                    } else if (!this.isModify) {
                        //multiUserApproveID2.value(null);
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
                    // isReadOnlyComboBox($("#" + control1), false);
                    // isReadOnlyComboBox($("#" + control2), false);
                    // isReadOnlyComboBox($("#" + control3), false);
                    // isReadOnlyComboBox($("#" + control4), false);
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
                            data: this.dataLastApprove
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
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                            }
                        };
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
                    } else {
                        //"UserApproveID", "UserApproveID4", "UserApproveID2", "UserApproveID3"
                        // multiUserApproveID2.refresh();
                        // multiUserApproveID2.value(null);
                        // multiUserApproveID3.refresh();
                        // multiUserApproveID3.value(null);
                        // multiUserApproveID4.refresh();
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
    onChangeUserApproveID = (item) => {
        const { UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4 } = this.state;
        let nextState = {
            UserApproveID: {
                ...UserApproveID,
                value: item,
                refresh: !UserApproveID.refresh
            }
        };

        //nếu 1 cấp duyệt mới chạy
        if (this.levelApproveBusinessTravelTransfer == 1) {
            //ẩn 3,4
            // isShowEle('#divMidApprove');
            // isShowEle('#divMidNextApprove');

            nextState = {
                ...nextState,
                UserApproveID2: {
                    ...UserApproveID2,
                    visibleConfig: false
                },
                UserApproveID3: {
                    ...UserApproveID3,
                    visibleConfig: false
                }
            };

            //set duyệt 2,3,4 = 1
            // var user1 = $("#UserApproveID").data("kendoComboBox"),
            //   user2 = $("#UserApproveID2").data("kendoComboBox"),
            //   user3 = $("#UserApproveID3").data("kendoComboBox"),
            //   user4 = $("#UserApproveID4").data("kendoComboBox"),
            //   _data1 = user1.dataSource.data();
            if (!item) {
                // user2.value([]);
                // user3.value([]);
                // user4.value([]);
                nextState = {
                    ...nextState,
                    UserApproveID2: {
                        ...nextState.UserApproveID2,
                        value: null,
                        refresh: !UserApproveID2.refresh
                    },
                    UserApproveID3: {
                        ...nextState.UserApproveID3,
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
                // _data1.forEach(function (item) {
                //   if (item.ID == user1.value()) {
                //     checkAddDatasource(user2, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //     checkAddDatasource(user3, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //     checkAddDatasource(user4, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //   }
                // });
                nextState = {
                    ...nextState,
                    UserApproveID2: {
                        ...nextState.UserApproveID2,
                        value: { ...item },
                        refresh: !UserApproveID2.refresh
                    },
                    UserApproveID3: {
                        ...nextState.UserApproveID3,
                        value: { ...item },
                        refresh: !UserApproveID3.refresh
                    },
                    UserApproveID4: {
                        ...UserApproveID4,
                        value: { ...item },
                        refresh: !UserApproveID4.refresh
                    }
                };
            }
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
        if (this.levelApproveBusinessTravelTransfer == 1) {
            //ẩn 3,4
            // isShowEle('#divMidApprove');
            // isShowEle('#divMidNextApprove');
            nextState = {
                ...nextState,
                UserApproveID2: {
                    ...UserApproveID2,
                    visibleConfig: false
                },
                UserApproveID3: {
                    ...UserApproveID3,
                    visibleConfig: false
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
        } else if (this.levelApproveBusinessTravelTransfer == 2) {
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
        } else if (this.levelApproveBusinessTravelTransfer == 3) {
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

    //change BusinessTravelID
    onChangeBusinessTravelID = (item) => {
        const { BusinessTravelID } = this.state;
        let nextState = {
            BusinessTravelID: {
                ...BusinessTravelID,
                value: item,
                refresh: !BusinessTravelID.refresh
            }
        };

        this.setState(nextState, () => {
            this.GetDataTransferType();
            this.ReadOnlyHourFromHourTo();
        });
    };

    GetDataTransferType = () => {
        const { BusinessTravelID, TransferTypeID } = this.state;
        if (BusinessTravelID.value) {
            this.GetDataMovementType();
        } else {
            this.setState({
                TransferTypeID: {
                    ...TransferTypeID,
                    data: [],
                    value: null,
                    refresh: !TransferTypeID.refresh
                }
            });
        }
    };

    //change BusinessTrip
    onPickBusinessTrip = (item) => {
        const { BusinessTrip } = this.state;
        let nextState = {
            BusinessTrip: {
                ...BusinessTrip,
                value: item,
                refresh: !BusinessTrip.refresh
            }
        };

        this.setState(nextState, () => {
            this.GetDataBusinessTravel();
            this.ReadOnlyHourFromHourTo();
        });
    };

    ReadOnlyHourFromHourTo = () => {
        const { BusinessTrip, BusinessTravelID, TransferDate, TransferTypeID } = this.state;

        if (!BusinessTrip.value || !BusinessTravelID.value || !TransferDate.value || !TransferTypeID.value)
            this.ReadOnlyCtrl(true);
        else this.ReadOnlyCtrl(false);
    };

    ReadOnlyCtrl = (isReadOnly) => {
        const { HourTo, HourFrom } = this.state;
        this.setState({
            HourTo: {
                ...HourTo,
                disable: isReadOnly,
                refresh: !HourTo.refresh
            },
            HourFrom: {
                ...HourFrom,
                disable: isReadOnly,
                refresh: !HourFrom.refresh
            }
        });
    };

    getDayTypeAndDayCode = () => {
        const { TransferDate, DayType, LeaveDayTypeCode } = this.state;

        if (DayType.visibleConfig || DayType.visibleConfig) {
            let dataBody = {
                profileID: profileInfo.ProfileID,
                dateTransfer: Vnr_Function.formatDateAPI(TransferDate.value)
            };

            VnrLoadingSevices.show();
            HttpService.MultiRequest([
                HttpService.Post('[URI_HR]/Att_GetData/GetDayTypeForBusinessTravelTransfer', dataBody),
                HttpService.Post('[URI_HR]/Att_GetData/GetLeaveDayTypeCodeForBusinessTravelTransfer', dataBody)
            ]).then((resAll) => {
                VnrLoadingSevices.hide();
                this.setState({
                    DayType: {
                        ...DayType,
                        value: resAll[0] ? resAll[0] : '',
                        visible: true
                    },
                    LeaveDayTypeCode: {
                        ...LeaveDayTypeCode,
                        value: resAll[1] ? resAll[1] : '',
                        visible: true
                    }
                });
            });
        }
    };

    SetValueHourTotal = () => {
        const { HourFrom, HourTo, HourTotal } = this.state;
        if (HourFrom.value && HourTo.value) {
            let _from = moment(HourFrom.value).format('HH:mm'),
                _to = moment(HourTo.value).format('HH:mm');

            HttpService.Post('[URI_HR]//Att_GetData/GetValueHourTotal', { timeStart: _from, timeEnd: _to }).then(
                (data) => {
                    if (data) {
                        this.setState({
                            HourTotal: {
                                ...HourTotal,
                                value: data,
                                refresh: !HourTotal.refresh
                            }
                        });
                    }
                }
            );
        }
    };

    onSave = (navigation, isCreate, isSend) => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        const {
                ID,
                Profile,
                BusinessTrip,
                BusinessTravelID,
                TransferDate,
                TransferTypeID,
                HourFrom,
                HourTo,
                HourTotal,
                TransferRoute,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4,
                modalErrorDetail
            } = this.state,
            { apiConfig } = dataVnrStorage,
            { uriPor } = apiConfig;

        let param = {
            HourTotal: HourTotal.value,
            TransferRoute: TransferRoute.value,
            HourFrom: HourFrom.value ? moment(HourFrom.value).format('HH:mm') : null,
            HourTo: HourTo.value ? moment(HourTo.value).format('HH:mm') : null,
            TransferDate: TransferDate.value ? moment(TransferDate.value).format('YYYY-MM-DD 00:00:00') : null,
            BusinessTripID: BusinessTrip.value ? BusinessTrip.value.ID : null,
            BusinessTravelID: BusinessTravelID.value ? BusinessTravelID.value.ID : null,
            TransferTypeID: TransferTypeID.value ? TransferTypeID.value.ID : null,
            ProfileID: Profile.ID,
            IsPortal: true,
            UserSubmit: Profile.ID,
            Status: 'E_SUBMIT',
            UserApproveID: UserApproveID.value ? UserApproveID.value.ID : null,
            UserApproveID2: UserApproveID2.value ? UserApproveID2.value.ID : null,
            UserApproveID3: UserApproveID3.value ? UserApproveID3.value.ID : null,
            UserApproveID4: UserApproveID4.value ? UserApproveID4.value.ID : null,
            UserSubmitID: Profile.ID

            // ProfileRemoveIDs: this.ProfileRemoveIDs,
            // IsRemoveAndContinue: this.IsRemoveAndContinue,
            // CacheID: this.CacheID,
        };

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
        HttpService.Post('[URI_HR]/api/Att_BusinessTravelTransfer', param).then((data) => {
            VnrLoadingSevices.hide();

            //xử lý lại event Save
            this.isProcessing = false;

            if (data) {
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
                            message: translate('HRM_Attendance_Message_InvalidRequestDataPleaseCheckAgain'),
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
                } else if (data.ActionStatus.indexOf('Success') >= 0) {
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

                    //xử lý lại event Save
                    this.isProcessing = false;
                } else {
                    ToasterSevice.showWarning(data.ActionStatus, 4000);

                    //xử lý lại event Save
                    this.isProcessing = false;
                }
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
                                styles.wrapLableGroup
                            ]}
                        >
                            <VnrText
                                style={[styleSheets.text, styleSheets.fontWeight500ColorPrimary]}
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
                                <View style={styles.flex1}>
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
                                <View style={styles.flex1}>
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
                                <View style={styles.flex1}>
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
        HttpService.Post('[URI_HR]/Att_GetData/GetErrorMessageRespone', { cacheID: cacheID }).then((res) => {
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

    closeModal = () => {
        let nextState = {
            modalErrorDetail: {
                ...this.state.modalErrorDetail,
                isModalVisible: false
            }
        };

        this.setState(nextState);
    };
    //#endregion

    render() {
        const {
                BusinessTrip,
                BusinessTravelID,
                TransferDate,
                TransferTypeID,
                HourFrom,
                HourTo,
                HourTotal,
                TransferRoute,
                LeaveDayTypeCode,
                DayType,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4,
                modalErrorDetail,
                fieldValid
            } = this.state,
            {
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
            PermissionForAppMobile.value['New_Att_BusinessTravelTransfer_New_CreateOrUpdate_btnSaveandSendMail'] &&
            PermissionForAppMobile.value['New_Att_BusinessTravelTransfer_New_CreateOrUpdate_btnSaveandSendMail']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_SENMAIL,
                title: translate('HRM_Common_SaveAndSendMail'),
                onPress: () => this.onSaveAndSend(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_BusinessTravelTransfer_New_CreateOrUpdate_btnSaveClose'] &&
            PermissionForAppMobile.value['New_Att_BusinessTravelTransfer_New_CreateOrUpdate_btnSaveClose']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_CLOSE,
                title: translate('HRM_Common_SaveClose'),
                onPress: () => this.onSave(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_BusinessTravelTransfer_New_CreateOrUpdate_btnSaveCreate'] &&
            PermissionForAppMobile.value['New_Att_BusinessTravelTransfer_New_CreateOrUpdate_btnSaveCreate']['View']
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
                        contentContainerStyle={styleSheets.flexGrow1}
                    >
                        {/* Tên nhân viên -  ProfileName*/}
                        {/* {Profile.visible && (
              <View style={contentViewControl}>
                <View style={viewLable}>
                  <VnrText
                    style={[styleSheets.text, textLableInfo]}
                    i18nKey={Profile.label}
                  />

                  {
                    fieldValid.ProfileID && <VnrText style={styleValid} i18nKey={"HRM_Valid_Char"} />
                  }
                </View>
                <View style={viewControl}>
                  <VnrTextInput
                    disable={Profile.disable}
                    value={Profile.ProfileName}
                  />
                </View>
              </View>
            )} */}

                        {/* Chuyến công tác - BusinessTrip */}
                        {BusinessTrip.visibleConfig && BusinessTrip.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={BusinessTrip.label} />

                                    {/* valid BusinessTrip */}
                                    {fieldValid.BusinessTripID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        dataLocal={BusinessTrip.data}
                                        refresh={BusinessTrip.refresh}
                                        textField="BusinessTravelDate"
                                        valueField="ID"
                                        filter={false}
                                        value={BusinessTrip.value}
                                        disable={BusinessTrip.disable}
                                        onFinish={(item) => this.onPickBusinessTrip(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Loại công tác - BusinessTravelID*/}
                        {BusinessTravelID.visibleConfig && BusinessTravelID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={BusinessTravelID.label}
                                    />

                                    {/* valid BusinessTravelID */}
                                    {fieldValid.BusinessTravelID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={BusinessTravelID.data}
                                        refresh={BusinessTravelID.refresh}
                                        textField="BusinessTravelType"
                                        valueField="ID"
                                        filter={true}
                                        value={BusinessTravelID.value}
                                        filterServer={false}
                                        //filterParams="text"
                                        disable={BusinessTravelID.disable}
                                        onFinish={(item) => this.onChangeBusinessTravelID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày di chuyển - TransferDate */}
                        {TransferDate.visibleConfig && TransferDate.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={TransferDate.label} />

                                    {fieldValid.TransferDate && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={TransferDate.value}
                                        refresh={TransferDate.refresh}
                                        type={'date'}
                                        onFinish={(value) =>
                                            this.setState(
                                                {
                                                    TransferDate: {
                                                        ...TransferDate,
                                                        value,
                                                        refresh: !TransferDate.refresh
                                                    }
                                                },
                                                () => {
                                                    this.GetDataMovementType();
                                                    this.getDayTypeAndDayCode();
                                                    // this.ReadOnlyHourFromHourTo();
                                                }
                                            )
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Loại ngày - DayType */}
                        {DayType.visibleConfig && DayType.visible && (
                            <View style={[contentViewControl, styles.styViewLeaveDayCount]}>
                                <Text style={[styleSheets.text, styles.styViewLeaveDayCountLable]}>
                                    {`${translate(DayType.label)} : `}
                                </Text>
                                <VnrText
                                    style={[styleSheets.lable, styles.styViewLeaveDayCountValue]}
                                    value={DayType.value}
                                />
                            </View>
                        )}

                        {/* Loại ngày nghỉ- LeaveDayTypeCode */}
                        {LeaveDayTypeCode.visibleConfig && LeaveDayTypeCode.visible && (
                            <View style={[contentViewControl, styles.styViewLeaveDayCount]}>
                                <Text style={[styleSheets.text, styles.styViewLeaveDayCountLable]}>
                                    {`${translate(LeaveDayTypeCode.label)} : `}
                                </Text>
                                <VnrText
                                    style={[styleSheets.lable, styles.styViewLeaveDayCountValue]}
                                    value={LeaveDayTypeCode.value}
                                />
                            </View>
                        )}

                        {/* Loại di chuyển - TransferTypeID*/}
                        {TransferTypeID.visibleConfig && TransferTypeID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={TransferTypeID.label} />

                                    {/* valid TransferTypeID */}
                                    {fieldValid.TransferTypeID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={TransferTypeID.data}
                                        refresh={TransferTypeID.refresh}
                                        textField="MovementTypeName"
                                        valueField="ID"
                                        filter={true}
                                        value={TransferTypeID.value}
                                        filterServer={false}
                                        //filterParams="text"
                                        disable={TransferTypeID.disable}
                                        onFinish={(item) =>
                                            this.setState(
                                                {
                                                    TransferTypeID: {
                                                        ...TransferTypeID,
                                                        value: item,
                                                        refresh: !TransferTypeID.refresh
                                                    }
                                                },
                                                () => this.ReadOnlyHourFromHourTo()
                                            )
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Thời gian di chuyển - HourFrom, HourTo */}
                        {HourFrom.visibleConfig && HourFrom.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={HourFrom.label} />

                                    {/* valid HourFrom */}
                                    {fieldValid.HourFrom && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <View style={formDate_To_From}>
                                        <View style={controlDate_from}>
                                            <VnrDate
                                                response={'string'}
                                                format={'HH:mm'}
                                                value={HourFrom.value}
                                                refresh={HourFrom.refresh}
                                                disable={HourFrom.disable}
                                                type={'time'}
                                                onFinish={(value) =>
                                                    this.setState(
                                                        {
                                                            HourFrom: {
                                                                ...HourFrom,
                                                                value,
                                                                refresh: !HourFrom.refresh
                                                            }
                                                        },
                                                        () => this.SetValueHourTotal()
                                                    )
                                                }
                                            />
                                        </View>
                                        <View style={controlDate_To}>
                                            <VnrDate
                                                response={'string'}
                                                format={'HH:mm'}
                                                value={HourTo.value}
                                                refresh={HourTo.refresh}
                                                disable={HourTo.disable}
                                                type={'time'}
                                                onFinish={(value) =>
                                                    this.setState(
                                                        {
                                                            HourTo: {
                                                                ...HourTo,
                                                                value,
                                                                refresh: !HourTo.refresh
                                                            }
                                                        },
                                                        () => this.SetValueHourTotal()
                                                    )
                                                }
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Số giờ di chuyển -  HourTotal*/}
                        {HourTotal.visibleConfig && HourTotal.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <Text style={[styleSheets.text, textLableInfo, { color: Colors.blue }]}>
                                        {`${translate(HourTotal.label)} : `}
                                    </Text>

                                    {fieldValid.HourTotal && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}

                                    <VnrText
                                        style={[styleSheets.text, textLableInfo, { color: Colors.blue }]}
                                        value={HourTotal.value}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Lộ trình di chuyển -  TransferRoute*/}
                        {TransferRoute.visibleConfig && TransferRoute.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={TransferRoute.label} />
                                    {fieldValid.TransferRoute && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={TransferRoute.disable}
                                        refresh={TransferRoute.refresh}
                                        value={TransferRoute.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                TransferRoute: {
                                                    ...TransferRoute,
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
                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_BUSINESSTRAVELTRANSFER',
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

                        {/* Người duyệt kế tiếp - UserApproveID2*/}
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
                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_BUSINESSTRAVELTRANSFER',
                                            type: 'E_GET'
                                        }}
                                        value={UserApproveID2.value}
                                        refresh={UserApproveID2.refresh}
                                        textField="UserInfoName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={true}
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

                        {/* Người duyệt tiếp theo - UserApproveID3*/}
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
                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_BUSINESSTRAVELTRANSFER',
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

                        {/* Người duyệt cuối - UserApproveID4 */}
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
                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_BUSINESSTRAVELTRANSFER',
                                            type: 'E_GET'
                                        }}
                                        refresh={UserApproveID4.refresh}
                                        textField="UserInfoName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={true}
                                        value={UserApproveID4.value}
                                        filterParams="text"
                                        disable={UserApproveID4.disable}
                                        onFinish={(item) => this.onChangeUserApproveID4(item)}
                                    />
                                </View>
                            </View>
                        )}
                    </KeyboardAwareScrollView>

                    {modalErrorDetail.isModalVisible && (
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
                            style={styles.margin0}
                        >
                            <View style={stylesModalPopupBottom.viewModal}>
                                <SafeAreaView {...styleSafeAreaView} style={stylesModalPopupBottom.safeRadius}>
                                    <View style={styles.headerCloseModal}>
                                        <TouchableOpacity onPress={() => this.closeModal()}>
                                            <IconColse color={Colors.grey} size={Size.iconSize} />
                                        </TouchableOpacity>
                                        <VnrText
                                            style={styleSheets.lable}
                                            i18nKey={'HRM_Attendance_Message_ViolationNotification'}
                                        />
                                        <IconColse color={Colors.white} size={Size.iconSize} />
                                    </View>
                                    <ScrollView style={styles.scrollViewError}>{this.renderErrorDetail()}</ScrollView>
                                    <View style={styles.groupButton}>
                                        <TouchableOpacity onPress={() => this.closeModal()} style={styles.btnClose}>
                                            <VnrText
                                                style={[styleSheets.lable, { color: Colors.white }]}
                                                i18nKey={'Cancel'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </SafeAreaView>
                            </View>
                        </Modal>
                    )}

                    <ListButtonSave listActions={listActions} />
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
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
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: styleSheets.p_10,
        backgroundColor: Colors.white,
        marginTop: 10,
        marginBottom: 10
    },
    styViewLeaveDayCount: {
        flexDirection: 'row',
        alignItems: 'center'
        // marginTop: -10
    },
    styViewLeaveDayCountLable: {
        color: Colors.gray_9,
        fontSize: Size.text - 1
    },
    styViewLeaveDayCountValue: {
        fontWeight: '600',
        color: Colors.primary,
        fontSize: Size.text - 1
    },

    // styles Error detail
    scrollViewError: {
        flexGrow: 1,
        flexDirection: 'column',
        paddingHorizontal: Size.defineSpace
    },
    coating: {
        flex: 1,
        backgroundColor: Colors.black,
        opacity: 0.5
    },
    wrapLableGroup: {
        marginHorizontal: 0,
        paddingBottom: 5,
        marginBottom: 10
    },
    flex1: {
        flex: 1
    },
    margin0: {
        margin: 0
    },
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
