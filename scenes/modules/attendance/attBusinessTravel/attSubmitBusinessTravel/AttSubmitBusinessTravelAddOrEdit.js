import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
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
import Modal from 'react-native-modal';
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
import { translate } from '../../../../../i18n/translate';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';

let enumName = null,
    profileInfo = null;

const initSateDefault = {
    ID: null,
    Profile: {
        ID: null,
        ProfileName: '',
        disable: true
    },
    BusinessTripTypeID: {
        data: [],
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    DurationType: {
        data: [],
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    DateFrom: {
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    DateTo: {
        value: null,
        refresh: false,
        disable: true,
        visibleConfig: true,
        visible: true
    },
    DateStayFrom: {
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: false
    },
    DateStayTo: {
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: false
    },
    HourFrom: {
        value: null,
        refresh: false,
        disable: true,
        visibleConfig: true,
        visible: true
    },
    HourTo: {
        value: null,
        refresh: false,
        disable: true,
        visibleConfig: true,
        visible: true
    },
    PlaceFrom: {
        disable: true,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    PlaceTo: {
        disable: true,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    PlaceInFromID: {
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    PlaceInToID: {
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    PlaceOutToID: {
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    PlaceSendToID: {
        data: [],
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    FileAttachment: {
        visible: true,
        visibleConfig: true,
        disable: true,
        refresh: false,
        value: null
    },
    Note: {
        disable: true,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    BusinessTripReasonID: {
        label: 'HRM_Attendance_BusinessTravel_BusinessTripReasonID',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    UserApproveID: {
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    UserApproveID2: {
        disable: true,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    UserApproveID3: {
        disable: true,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    UserApproveID4: {
        disable: false,
        visible: true,
        refresh: false,
        value: null,
        visibleConfig: true
    },
    dataError: null,
    modalErrorDetail: {
        isModalVisible: false,
        cacheID: null,
        data: []
    },
    fieldValid: {},
    listTemplate: {
        visibleConfig: true,
        visible: false,
        listFile: []
    },
    SumDay: {
        value: '',
        refresh: false,
        disable: true,
        visibleConfig: true,
        visible: false
    },
    TotalDayStay: {
        value: '',
        refresh: false,
        disable: true,
        visibleConfig: true,
        visible: false
    }
};

export default class AttSubmitBusinessTravelAddOrEdit extends Component {
    constructor(props) {
        super(props);

        this.state = initSateDefault;

        this.setVariable();
        //set title screen
        props.navigation.setParams({
            title:
                props.navigation.state.params && props.navigation.state.params.record
                    ? 'Business_Travel_Update'
                    : 'Business_Travel_CreateNew'
        });
    }

    setVariable = () => {
        //biến trạng thái
        this.isModify = false;
        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;
        this.isChangeLevelApprove = null;
        this.levelApproveBussinessTravel = null;
        this.dataMidApprove = [];
        this.dataLastApprove = [];
        this.IsContinueSave = false;
        this.ProfileRemoveIDs = null;
        this.IsRemoveAndContinue = null;
        this.CacheID = null;
    };

    refreshView = () => {
        this.props.navigation.setParams({ title: 'Business_Travel_Create' });
        this.setVariable();
        this.setState(initSateDefault, () => this.getConfigValid('Att_BussinessTravel', true));
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
                        ConfigField && ConfigField.value['AttSubmitBusinessTravelAddOrEdit']
                            ? ConfigField.value['AttSubmitBusinessTravelAddOrEdit']['Hidden']
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
                            this.readOnlyCtrlBT(true, this.initData);
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
        this.getConfigValid('Att_BussinessTravel');
    }

    initData = () => {
        const { E_ProfileID, E_FullName } = enumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] };

        //get DurationType
        VnrLoadingSevices.show();
        HttpService.Get('[URI_SYS]/Sys_GetData/GetEnum?text=BussinessTravelDurationType').then((res) => {
            VnrLoadingSevices.hide();
            if (res) {
                const { DurationType } = this.state;
                let nextState = {
                    Profile: _profile
                };

                if (Array.isArray(res) && res.length == 1) {
                    let itemDurationType = res[0];
                    nextState = {
                        ...nextState,
                        DurationType: {
                            ...DurationType,
                            value: itemDurationType
                                ? { Text: itemDurationType.Text, Value: itemDurationType.Value }
                                : null,
                            data: [...res],
                            refresh: DurationType.refresh
                        }
                    };
                } else {
                    nextState = {
                        ...nextState,
                        DurationType: {
                            ...DurationType,
                            data: [...res],
                            refresh: DurationType.refresh
                        }
                    };
                }

                this.setState(nextState, () => {
                    this.GetHighSupervior(null);
                });
            } else {
                this.setState({ Profile: _profile }, () => {
                    this.GetHighSupervior(null);
                });
            }
        });
    };

    handleSetState = (record, resAll) => {
        let nextState = {};
        const {
                Profile,
                BusinessTripTypeID,
                DurationType,
                DateFrom,
                DateTo,
                DateStayFrom,
                DateStayTo,
                HourFrom,
                HourTo,
                PlaceFrom,
                PlaceTo,
                PlaceInToID,
                PlaceInFromID,
                PlaceOutToID,
                PlaceSendToID,
                FileAttachment,
                Note,
                BusinessTripReasonID,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4
            } = this.state,
            DataDurationType = resAll[0],
            item = resAll[1],
            readOnlyApproverControl = resAll[2],
            levelApproveBussinessTravel = resAll[3];

        nextState = {
            ID: record.ID,
            Profile: {
                ...Profile,
                ID: item.ProfileID,
                ProfileName: item.ProfileName
            },
            BusinessTripTypeID: {
                ...BusinessTripTypeID,
                value: item.BusinessTripTypeID
                    ? { ID: item.BusinessTripTypeID, BusinessTravelName: item.BusinessTravelType }
                    : null,
                disable: false,
                refresh: !BusinessTripTypeID.refresh
            },
            DurationType: {
                ...DurationType,
                data: [...DataDurationType],
                value: item.DurationType ? { Text: item.DurationTypeTravel, Value: item.DurationType } : null,
                disable: false,
                refresh: !DurationType.refresh
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
            DateStayFrom: {
                ...DateStayFrom,
                value: item.DateStayFrom ? moment(item.DateStayFrom).format('YYYY-MM-DD HH:mm:ss') : null,
                disable: false,
                refresh: !DateStayFrom.refresh
            },
            DateStayTo: {
                ...DateStayTo,
                value: item.DateStayTo ? moment(item.DateStayTo).format('YYYY-MM-DD HH:mm:ss') : null,
                disable: false,
                refresh: !DateStayTo.refresh
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
            PlaceTo: {
                ...PlaceTo,
                value: item.PlaceTo ? item.PlaceTo : '',
                disable: false,
                refresh: !PlaceTo.refresh
            },
            PlaceFrom: {
                ...PlaceFrom,
                value: item.PlaceFrom ? item.PlaceFrom : '',
                disable: false,
                refresh: !PlaceFrom.refresh
            },
            PlaceInToID: {
                ...PlaceInToID,
                value: item.PlaceInToID ? { ID: item.PlaceInToID, ProvinceCodeName: item.PlaceInTo } : null,
                disable: false,
                refresh: !PlaceInToID.refresh
            },
            PlaceInFromID: {
                ...PlaceInFromID,
                value: item.PlaceInFromID ? { ID: item.PlaceInFromID, ProvinceCodeName: item.PlaceInFrom } : null,
                disable: false,
                refresh: !PlaceInFromID.refresh
            },
            PlaceOutToID: {
                ...PlaceOutToID,
                value: item.PlaceOutToID ? { ID: item.PlaceOutToID, CountryName: item.PlaceOutTo } : null,
                disable: false,
                refresh: !PlaceOutToID.refresh
            },
            PlaceSendToID: {
                ...PlaceSendToID,
                value: item.PlaceSendToID ? { ID: item.PlaceSendToID, WorkPlaceName: item.SendTo } : null,
                disable: false,
                refresh: !PlaceSendToID.refresh
            },
            FileAttachment: {
                ...FileAttachment,
                value: item.lstFileAttach,
                refresh: !FileAttachment.refresh
            },
            Note: {
                ...Note,
                value: item.Note,
                disable: false,
                refresh: !Note.refresh
            },
            BusinessTripReasonID: {
                ...BusinessTripReasonID,
                value: item.BusinessTripReasonID
                    ? { ID: item.BusinessTripReasonID, BusinessTripReasonName: item.BusinessTripReasonName }
                    : null,
                disable: false,
                refresh: !BusinessTripReasonID.refresh
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

        if (!readOnlyApproverControl) {
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
                },
                UserApproveID4: {
                    ...nextState.UserApproveID4,
                    disable: true
                }
            };
        }

        if (levelApproveBussinessTravel) {
            this.levelApproveBussinessTravel = levelApproveBussinessTravel;

            if (levelApproveBussinessTravel == 4) {
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
            } else if (levelApproveBussinessTravel == 3) {
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

        this.setState(nextState, () => {
            this.ChangeBusinessTripType(nextState.BusinessTripTypeID.value, true);
            this.loadDurationType();
            this.calculateBusinessDay();
        });
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        const { ID } = record,
            { E_ProfileID } = enumName,
            ProfileID = profileInfo[E_ProfileID];

        let arrRequest = [
            HttpService.Get('[URI_SYS]/Sys_GetData/GetEnum?text=BussinessTravelDurationType'),
            HttpService.Get('[URI_HR]/Att_GetData/GetBussinessTravelByID?id=' + ID),
            HttpService.Post('[URI_HR]/Att_GetData/GetReadOnlyApproverControl', { profileID: ProfileID })
        ];

        VnrLoadingSevices.show();
        HttpService.MultiRequest(arrRequest).then((resAll) => {
            VnrLoadingSevices.hide();
            try {
                this.GetLevelApproveBussinessTravel(_handleSetState, record, resAll);
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };
    //#endregion

    GetLevelApproveBussinessTravel = (_handleSetState, record, resAll) => {
        const item = resAll[1],
            { BusinessTripTypeID, ProfileID } = item;
        HttpService.Post('[URI_HR]/Att_GetData/GetLevelApproveBussinessTravel', {
            ProfileID: ProfileID,
            resource: { BusinessTripTypeID }
        }).then((res) => {
            if (res) {
                resAll = [...resAll, res];
                _handleSetState(record, resAll);
            }
        });
    };

    GetHighSupervior = (_businessTripTypeID) => {
        const { Profile, UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4 } = this.state;
        //let _businessTripTypeID = BusinessTripTypeID.value ? BusinessTripTypeID.value.ID : null;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]//Att_GetData/GetHighSupervisor', {
            ProfileID: Profile.ID,
            userSubmit: Profile.ID,
            type: 'E_LEAVE_DAY_BUSINESSTRAVEL',
            missionPlaceType: '',
            resource: { BusinessTripTypeID: _businessTripTypeID }
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
                if (result.IsChangeApprove == true) {
                    this.isChangeLevelApprove = true;
                }

                this.levelApproveBussinessTravel = result.LevelApprove;

                if (result.LevelApprove == 2) {
                    if (result.IsOnlyOneLevelApprove) {
                        this.levelApproveBussinessTravel = 1;

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
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                disable: true
                            },
                            UserApproveID1: {
                                ...nextState.UserApproveID1,
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
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                disable: false
                            },
                            UserApproveID1: {
                                ...nextState.UserApproveID1,
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
        if (this.levelApproveBussinessTravel == 1) {
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
        if (this.levelApproveBussinessTravel == 1) {
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
        } else if (this.levelApproveBussinessTravel == 2) {
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
        } else if (this.levelApproveBussinessTravel == 3) {
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

    //Pick Loại công tác
    onPickedBusinessTripTypeID = (item, isModify) => {
        const { BusinessTripTypeID } = this.state;
        let nextState = {
            BusinessTripTypeID: {
                ...BusinessTripTypeID,
                value: item,
                refresh: !BusinessTripTypeID.refresh
            }
        };
        this.setState(nextState, () => {
            this.ChangeBusinessTripType(item, isModify);
            this.GetHighSupervior(item ? item.ID : null);
            this.showFileTemplate(item);
            this.calculateBusinessDay();
        });
    };

    showFileTemplate = (item) => {
        const { listTemplate } = this.state;

        if (item && item.FileAttachment && item.FileAttachment !== '') {
            let strFile = item.FileAttachment,
                listFile = strFile.split(','),
                _listFile = listFile.map((itemFile) => {
                    return {
                        path: `${dataVnrStorage.apiConfig.uriMain}/Uploads/${itemFile}`,
                        fileName: itemFile
                    };
                });

            this.setState({
                listTemplate: {
                    ...listTemplate,
                    listFile: _listFile,
                    visible: true
                }
            });
        } else {
            this.setState({
                listTemplate: {
                    ...listTemplate,
                    listFile: [],
                    visible: false
                }
            });
        }
    };

    ChangeBusinessTripType = (item, isModify) => {
        const { DateStayFrom, DateStayTo, TotalDayStay, DateFrom, DateTo } = this.state;
        if (item) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]//Cat_GetData/GetCatBussinessTravelByID', { id: item.ID }).then((res) => {
                VnrLoadingSevices.hide();
                if (res) {
                    if (res.Location && res.Location != '')
                    {
                        this.showHideControlBusinessTravel({
                            locationType: res.Location,
                            typeBusinessTrip: item.ID,
                            isModify
                        });
                    }
                    if (res?.IsAccommodation) { //kiểm tra loại công tác có check lưu trú không
                        this.setState({
                            DateStayFrom: {
                                ...DateStayFrom,
                                visible: true,
                                value: !isModify ? DateFrom.value : DateStayFrom.value,
                                refresh: !DateStayFrom.refresh
                            },
                            DateStayTo: {
                                ...DateStayTo,
                                visible: true,
                                value: !isModify ? DateTo.value : DateStayTo.value,
                                refresh: !DateStayTo.refresh
                            },
                            TotalDayStay: {
                                ...TotalDayStay,
                                visible: true,
                                refresh: !TotalDayStay.refresh
                            }
                        }, () => {
                            this.handleCalTotalDayStay();
                            this.showHideControlBusinessTravel({
                                locationType: null,
                                typeBusinessTrip: item.ID,
                                isModify
                            });
                        });
                    } else {
                        this.setState({
                            DateStayFrom: {
                                ...DateStayFrom,
                                visible: false,
                                value: null,
                                refresh: !DateStayFrom.refresh
                            },
                            DateStayTo: {
                                ...DateStayTo,
                                visible: false,
                                value: null,
                                refresh: !DateStayTo.refresh
                            },
                            TotalDayStay: {
                                ...TotalDayStay,
                                visible: false,
                                value: '',
                                refresh: !TotalDayStay.refresh
                            }
                        }, () => {
                            this.showHideControlBusinessTravel({
                                locationType: null,
                                typeBusinessTrip: item.ID,
                                isModify
                            });
                        });
                    }
                }
                else this.showHideControlBusinessTravel({ locationType: null, typeBusinessTrip: item.ID, isModify });
            });
        } else {
            this.showHideControlBusinessTravel({ locationType: null, typeBusinessTrip: null, isModify });
        }
    };

    showHideControlBusinessTravel = ({ locationType, isModify = false }) => {
        const { HourFrom, HourTo, PlaceFrom, PlaceTo, PlaceInFromID, PlaceInToID, PlaceOutToID } = this.state;
        let nextState = {};

        if (locationType == 'E_OUT' || locationType == 'E_DOMESTIC') {
            nextState = {
                ...nextState,
                PlaceFrom: {
                    ...PlaceFrom,
                    visible: false,
                    value: isModify ? PlaceFrom.value : '',
                    refresh: !PlaceFrom.refresh
                },
                PlaceTo: {
                    ...PlaceTo,
                    visible: false,
                    value: isModify ? PlaceTo.value : '',
                    refresh: !PlaceTo.refresh
                },
                HourFrom: {
                    ...HourFrom,
                    visible: false,
                    value: isModify ? HourFrom.value : null,
                    refresh: !HourFrom.refresh
                },
                HourTo: {
                    ...HourTo,
                    visible: false,
                    value: isModify ? HourTo.value : null,
                    refresh: !HourTo.refresh
                }
            };
        }

        if (locationType == 'E_OUT') {
            nextState = {
                ...nextState,
                PlaceInFromID: {
                    ...PlaceInFromID,
                    visible: false,
                    value: isModify ? PlaceInFromID.value : null,
                    refresh: !PlaceInFromID.refresh
                },
                PlaceInToID: {
                    ...PlaceInToID,
                    visible: false,
                    value: isModify ? PlaceInToID.value : null,
                    refresh: !PlaceInToID.refresh
                },
                PlaceOutToID: {
                    ...PlaceOutToID,
                    visible: true,
                    value: isModify ? PlaceOutToID.value : null,
                    refresh: !PlaceOutToID.refresh
                }
            };
        } else if (locationType == 'E_DOMESTIC') {
            nextState = {
                ...nextState,
                PlaceInFromID: {
                    ...PlaceInFromID,
                    visible: true,
                    value: isModify ? PlaceInFromID.value : null,
                    refresh: !PlaceInFromID.refresh
                },
                PlaceInToID: {
                    ...PlaceInToID,
                    visible: true,
                    value: isModify ? PlaceInToID.value : null,
                    refresh: !PlaceInToID.refresh
                },
                PlaceOutToID: {
                    ...PlaceOutToID,
                    visible: false,
                    value: isModify ? PlaceOutToID.value : null,
                    refresh: !PlaceOutToID.refresh
                }
            };
        } else if (!locationType || locationType == 'E_IN' || locationType == '') {
            nextState = {
                ...nextState,
                PlaceFrom: {
                    ...PlaceFrom,
                    visible: true,
                    value: isModify ? PlaceFrom.value : '',
                    refresh: !PlaceFrom.refresh
                },
                PlaceTo: {
                    ...PlaceTo,
                    visible: true,
                    value: isModify ? PlaceTo.value : '',
                    refresh: !PlaceTo.refresh
                },
                HourFrom: {
                    ...HourFrom,
                    visible: true,
                    value: isModify ? HourFrom.value : null,
                    refresh: !HourFrom.refresh
                },
                HourTo: {
                    ...HourTo,
                    visible: true,
                    value: isModify ? HourTo.value : null,
                    refresh: !HourTo.refresh
                },
                PlaceInFromID: {
                    ...PlaceInFromID,
                    visible: false,
                    value: isModify ? PlaceInFromID.value : null,
                    refresh: !PlaceInFromID.refresh
                },
                PlaceInToID: {
                    ...PlaceInToID,
                    visible: false,
                    value: isModify ? PlaceInToID.value : null,
                    refresh: !PlaceInToID.refresh
                },
                PlaceOutToID: {
                    ...PlaceOutToID,
                    visible: false,
                    value: isModify ? PlaceOutToID.value : null,
                    refresh: !PlaceOutToID.refresh
                }
            };
        }

        this.setState(nextState);
    };

    //change DateFrom
    onChangeDateFrom = (value) => {
        const { DateFrom, DateTo } = this.state;
        let nextState = {
            DateFrom: {
                ...DateFrom,
                value: value,
                refresh: !DateFrom.refresh
            },
            DateTo: {
                ...DateTo,
                value: value,
                refresh: !DateTo.refresh
            }
        };

        this.setState(nextState, () => {
            this.readOnlyCtrlBT(false);
        });
    };

    //change DateTo
    onChangeDateTo = (value) => {
        const { DateTo } = this.state;
        let nextState = {
            DateTo: {
                ...DateTo,
                value: value,
                refresh: !DateTo.refresh
            }
        };

        this.setState(nextState, () => this.loadDurationType());
    };

    //change DateFrom
    onChangeDateStayFrom = (value) => {
        const { DateStayFrom, DateFrom } = this.state;
        // Chuyển đổi chuỗi ngày thành đối tượng Date
        const dateStayFromStr = value.replace(' ', 'T');
        const dateFromStr = DateFrom.value.replace(' ', 'T');
        const dateStayFrom = new Date(dateStayFromStr);
        const dateFrom = new Date(dateFromStr);
        if (dateStayFrom > dateFrom) {
            ToasterSevice.showWarning('HRM_PortalApp_StartDateFromTo', 4000);
        }
        let nextState = {
            DateStayFrom: {
                ...DateStayFrom,
                value: value,
                refresh: !DateStayFrom.refresh
            }
        };

        this.setState(nextState, () => this.handleCalTotalDayStay());
    };

    //change DateStayTo
    onChangeDateStayTo = (value) => {
        const { DateStayTo, DateTo } = this.state;
        // Chuyển đổi chuỗi ngày thành đối tượng Date
        const dateStayToStr = value.replace(' ', 'T');
        const dateToStr = DateTo.value.replace(' ', 'T');
        const dateStayTo = new Date(dateStayToStr);
        const dateTo = new Date(dateToStr);
        if (dateStayTo < dateTo) {
            ToasterSevice.showWarning('HRM_PortalApp_EndDateFromTo', 4000);
        }
        let nextState = {
            DateStayTo: {
                ...DateStayTo,
                value: value,
                refresh: !DateStayTo.refresh
            }
        };

        this.setState(nextState, () => this.handleCalTotalDayStay());
    };

    handleCalTotalDayStay = () => {
        const { DateStayTo, DateStayFrom, TotalDayStay } = this.state;
        if (!DateStayFrom?.value || !DateStayTo?.value) return;
        // Chuyển đổi chuỗi ngày thành đối tượng Date
        const dateFromStr = DateStayFrom.value.replace(' ', 'T');
        const dateToStr = DateStayTo.value.replace(' ', 'T');
        const dateFrom = new Date(dateFromStr);
        const dateTo = new Date(dateToStr);

        // Kiểm tra xem đối tượng Date có hợp lệ không
        if (isNaN(dateFrom) || isNaN(dateTo)) {
            return;
        }
        // Tính số ngày nghỉ
        const totalDays = Math.floor((dateTo - dateFrom) / (1000 * 60 * 60 * 24)) + 1;
        this.setState({
            TotalDayStay: {
                ...TotalDayStay,
                value: !isNaN(totalDays) ? totalDays.toString() : '',
                refresh: !TotalDayStay.refresh
            }
        });
    }

    calculateBusinessDay = () => {
        const { Profile, SumDay, DateFrom, DateTo, DurationType, BusinessTripTypeID } = this.state;
        // ==== chưa mở ra vì sợ code ra source 19avn lỗi ====//

        if (SumDay.visibleConfig) {
            const dataBody = {
                profileID: Profile.ID,
                businessTripType: BusinessTripTypeID.value ? BusinessTripTypeID.value.ID : null,
                workDateFrom: DateFrom.value,
                workDateTo: DateTo.value,
                durationType: DurationType.value ? DurationType.value.Value : null
            };

            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/TotalBusinesDayByBusinessTripType', dataBody).then((res) => {
                VnrLoadingSevices.hide();
                if (res != null && res !== undefined) {
                    this.setState({
                        SumDay: {
                            ...SumDay,
                            value: `${res}`,
                            visible: true,
                            refresh: !SumDay.refresh
                        }
                    });
                }
            });
        }
    };

    loadDurationType = () => {
        const { DateFrom, DateTo, DurationType } = this.state;
        if (DateFrom.value && DateTo.value) {
            let type = 'BussinessTravelDurationType';
            if (moment(DateFrom.value).format('YYYY-MM-DD') != moment(DateTo.value).format('YYYY-MM-DD'))
                type = 'BussinessTravelTypeHalfShift';

            HttpService.Post('[URI_SYS]/Sys_GetData/GetEnum', { text: type }).then((data) => {
                if (data) {
                    if (Array.isArray(data) && data.length == 1) {
                        let itemDurationType = data[0];
                        this.setState({
                            DurationType: {
                                ...DurationType,
                                value: itemDurationType
                                    ? { Text: itemDurationType.Text, Value: itemDurationType.Value }
                                    : null,
                                data: [...data],
                                refresh: !DurationType.refresh
                            }
                        });
                    } else {
                        this.setState({
                            DurationType: {
                                ...DurationType,
                                data: [...data],
                                refresh: !DurationType.refresh
                            }
                        });
                    }
                }
            });
        }
    };

    onPickBusinessTripReasonID = (item) => {
        const { BusinessTripReasonID } = this.state;
        this.setState({
            BusinessTripReasonID: {
                ...BusinessTripReasonID,
                value: item,
                refresh: !BusinessTripReasonID.refresh
            }
        });
    };

    readOnlyCtrlBT = (isReadOnly, callback) => {
        const {
            BusinessTripTypeID,
            DurationType,
            DateFrom,
            DateTo,
            HourFrom,
            HourTo,
            PlaceFrom,
            PlaceTo,

            PlaceOutToID,
            PlaceSendToID,
            FileAttachment,
            Note,
            UserApproveID,
            UserApproveID2,
            UserApproveID3,
            UserApproveID4
        } = this.state;

        let isReadOnlyUserApprove = true;
        if (this.isChangeLevelApprove) {
            isReadOnlyUserApprove = isReadOnly;
        }

        this.setState(
            {
                BusinessTripTypeID: {
                    ...BusinessTripTypeID,
                    disable: isReadOnly,
                    refresh: !BusinessTripTypeID.refresh
                },
                DurationType: {
                    ...DurationType,
                    disable: isReadOnly,
                    refresh: !DurationType.refresh
                },
                DateFrom: {
                    ...DateFrom,
                    disable: isReadOnly,
                    refresh: !DateFrom.refresh
                },
                DateTo: {
                    ...DateTo,
                    disable: isReadOnly,
                    refresh: !DateTo.refresh
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
                },
                PlaceOutToID: {
                    ...PlaceOutToID,
                    disable: isReadOnly,
                    refresh: !PlaceOutToID.refresh
                },
                PlaceSendToID: {
                    ...PlaceSendToID,
                    disable: isReadOnly,
                    refresh: !PlaceSendToID.refresh
                },
                FileAttachment: {
                    ...FileAttachment,
                    disable: isReadOnly,
                    refresh: !FileAttachment.refresh
                },
                Note: {
                    ...Note,
                    disable: isReadOnly,
                    refresh: !Note.refresh
                },
                UserApproveID: {
                    ...UserApproveID,
                    disable: isReadOnlyUserApprove,
                    refresh: !UserApproveID.refresh
                },
                UserApproveID2: {
                    ...UserApproveID2,
                    disable: isReadOnlyUserApprove,
                    refresh: !UserApproveID2.refresh
                },
                UserApproveID3: {
                    ...UserApproveID3,
                    disable: isReadOnlyUserApprove,
                    refresh: !UserApproveID3.refresh
                },
                UserApproveID4: {
                    ...UserApproveID4,
                    disable: isReadOnlyUserApprove,
                    refresh: !UserApproveID4.refresh
                }
            },
            () => {
                if (callback && typeof callback === 'function') {
                    callback();
                }
            }
        );
    };

    closeModal = () => {
        let nextState = {
            modalErrorDetail: {
                ...this.state.modalErrorDetail,
                isModalVisible: false
            }
        };

        this.setState(nextState);
    };

    onSave = (navigation, isCreate, isSend) => {
        if (this.isProcessing) {
            return;
        }

        const {
                ID,
                Profile,
                BusinessTripTypeID,
                DurationType,
                DateFrom,
                DateTo,
                HourFrom,
                HourTo,
                PlaceFrom,
                PlaceTo,
                PlaceInFromID,
                PlaceInToID,
                PlaceOutToID,
                PlaceSendToID,
                FileAttachment,
                Note,
                BusinessTripReasonID,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4,
                modalErrorDetail,
                SumDay,
                TotalDayStay,
                DateStayFrom,
                DateStayTo
            } = this.state,
            { apiConfig } = dataVnrStorage,
            { uriPor } = apiConfig;

        const dateStayTo = new Date(DateStayTo.value.replace(' ', 'T'));
        const dateTo = new Date(DateTo.value.replace(' ', 'T'));
        const dateStayFrom = new Date(DateStayFrom.value.replace(' ', 'T'));
        const dateFrom = new Date(DateFrom.value.replace(' ', 'T'));

        if (dateStayTo < dateTo) {
            ToasterSevice.showWarning('HRM_PortalApp_EndDateFromTo', 4000);
            return;
        }
        if (dateStayFrom > dateFrom) {
            ToasterSevice.showWarning('HRM_PortalApp_StartDateFromTo', 4000);
            return;
        }

        let param = {
            ProfileID: Profile.ID,
            ProfileIds: Profile.ID,
            Note: Note.value,
            HourFrom: HourFrom.value,
            HourTo: HourTo.value,
            DateFrom: DateFrom.value,
            DateTo: DateTo.value,
            IsPortal: true,
            UserSubmit: Profile.ID,
            OrgStructureIDs: null,
            ProfileIDsExclude: null,
            Status: 'E_SUBMIT',
            UserApproveID: UserApproveID.value ? UserApproveID.value.ID : null,
            UserApproveID2: UserApproveID2.value ? UserApproveID2.value.ID : null,
            UserApproveID3: UserApproveID3.value ? UserApproveID3.value.ID : null,
            UserApproveID4: UserApproveID4.value ? UserApproveID4.value.ID : null,
            BusinessTripTypeID: BusinessTripTypeID.value ? BusinessTripTypeID.value.ID : null,
            DurationType: DurationType.value ? DurationType.value.Value : null,
            PlaceFrom: PlaceFrom.value,
            PlaceTo: PlaceTo.value,
            BusinessTripReasonID: BusinessTripReasonID.value ? BusinessTripReasonID.value.ID : null,
            PlaceInFromID: PlaceInFromID.value ? PlaceInFromID.value.ID : null,
            PlaceInToID: PlaceInToID.value ? PlaceInToID.value.ID : null,
            PlaceOutToID: PlaceOutToID.value ? PlaceOutToID.value.ID : null,
            PlaceSendToID: PlaceSendToID.value ? PlaceSendToID.value.ID : null,
            IsContinueSave: this.IsContinueSave,
            FileAttachment: FileAttachment.value ? FileAttachment.value.map((item) => item.fileName).join(',') : null,
            UserSubmitID: Profile.ID,
            ProfileRemoveIDs: this.ProfileRemoveIDs,
            IsRemoveAndContinue: this.IsRemoveAndContinue,
            CacheID: this.CacheID,
            SumDay: SumDay.value != '' ? SumDay.value : null,
            TotalDayStay: TotalDayStay.value != '' ? TotalDayStay.value : null,
            DateStayFrom: DateStayFrom.value,
            DateStayTo: DateStayTo.value,
            IsAccommodation: DateStayTo.value ? true : false
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
        this.isProcessing = true;
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Att_BussinessTravel', param).then((data) => {
            VnrLoadingSevices.hide();
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
                } else if (data.ActionStatus.indexOf('BlockSaveBusinessTravel') >= 0) {
                    let messResult = data.ActionStatus.split('|');
                    ToasterSevice.showWarning(messResult[1], 4000);

                    //xử lý lại event Save
                    this.isProcessing = false;
                } else if (data.ActionStatus.indexOf('WarningSaveBusinessTravel') >= 0) {
                    let messResult = data.ActionStatus.split('|');

                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        iconType: EnumIcon.E_WARNING,
                        message: messResult[1],
                        onCancel: () => {
                            this.isProcessing = false;
                        },
                        onConfirm: () => {
                            this.isProcessing = false;
                            this.IsContinueSave = true;
                            this.onSave(navigation, isCreate, isSend);
                        }
                    });
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
                        <View style={[styleViewTitleGroup, styles.wrapLableGroup]}>
                            <VnrText
                                style={[styleSheets.text, styles.txtLableGroup]}
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
    //#endregion

    render() {
        const {
                BusinessTripTypeID,
                DurationType,
                DateFrom,
                DateTo,
                DateStayFrom,
                DateStayTo,
                HourFrom,
                HourTo,
                PlaceFrom,
                PlaceTo,
                PlaceInFromID,
                PlaceInToID,
                PlaceOutToID,
                PlaceSendToID,
                FileAttachment,
                Note,
                BusinessTripReasonID,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4,
                modalErrorDetail,
                fieldValid,
                listTemplate,
                SumDay,
                TotalDayStay
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
            PermissionForAppMobile.value['New_Att_BussinessTravel_New_CreateOrUpdate_btnSaveandSendMail'] &&
            PermissionForAppMobile.value['New_Att_BussinessTravel_New_CreateOrUpdate_btnSaveandSendMail']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_SENMAIL,
                title: translate('HRM_Common_SaveAndSendMail'),
                onPress: () => this.onSaveAndSend(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_BussinessTravel_New_CreateOrUpdate_btnSaveClose'] &&
            PermissionForAppMobile.value['New_Att_BussinessTravel_New_CreateOrUpdate_btnSaveClose']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_CLOSE,
                title: translate('HRM_Common_SaveClose'),
                onPress: () => this.onSave(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_BussinessTravel_New_CreateOrUpdate_btnSaveCreate'] &&
            PermissionForAppMobile.value['New_Att_BussinessTravel_New_CreateOrUpdate_btnSaveCreate']['View']
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
                        contentContainerStyle={styles.flexGrow1}
                    >
                        {/* Tên nhân viên -  ProfileName*/}
                        {/* <View style={contentViewControl}>
              <View style={viewLable}>
                <VnrText
                  style={[styleSheets.text, textLableInfo]}
                  i18nKey={'HRM_Attendance_Overtime_ProfileName'}
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
            </View> */}

                        {/* Thời gian công tác - DateFrom, DateTo */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'HRM_BusinessTravel_Working_Time'}
                                />

                                {/* valid DateStart */}
                                {fieldValid.DateFrom && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>
                            <View style={viewControl}>
                                <View style={formDate_To_From}>
                                    <View style={controlDate_from}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={DateFrom.value}
                                            refresh={DateFrom.refresh}
                                            type={'date'}
                                            onFinish={(value) => this.onChangeDateFrom(value)}
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
                                            onFinish={(value) => this.onChangeDateTo(value)}
                                        />
                                    </View>
                                </View>
                            </View>
                        </View>

                        {/* Loại đăng ký - DurationType */}
                        {DurationType.visibleConfig && DurationType.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_DurationType'}
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
                                        onFinish={(item) =>
                                            this.setState(
                                                {
                                                    DurationType: {
                                                        ...DurationType,
                                                        value: item,
                                                        refresh: !DurationType.refresh
                                                    }
                                                },
                                                () => {
                                                    this.calculateBusinessDay();
                                                }
                                            )
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Loại công tác -  BusinessTripTypeID */}
                        {BusinessTripTypeID.visibleConfig && BusinessTripTypeID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_BusinessTravelType'}
                                    />

                                    {fieldValid.BusinessTripTypeID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiCatBussinessTravel',
                                            type: 'E_GET'
                                        }}
                                        refresh={BusinessTripTypeID.refresh}
                                        textField="BusinessTravelName"
                                        valueField="ID"
                                        filter={true}
                                        value={BusinessTripTypeID.value}
                                        filterServer={false}
                                        disable={BusinessTripTypeID.disable}
                                        onFinish={(item) => this.onPickedBusinessTripTypeID(item, this.isModify)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Tổng số ngày -  SumDay */}
                        {SumDay.visibleConfig && SumDay.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_BusinessTravel_SumDay'}
                                    />
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={SumDay.disable}
                                        refresh={SumDay.refresh}
                                        value={SumDay.value}
                                        onChangeText={(text) =>
                                            this.setState({
                                                SumDay: {
                                                    ...SumDay,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Giờ đi, giờ về - HourFrom, HourTo */}
                        {HourFrom.visibleConfig && HourFrom.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_HoursFromTrip'}
                                    />
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={' - '} />
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_HoursToTrip'}
                                    />

                                    {/* valid DateStart */}
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
                                                    this.setState({
                                                        HourFrom: {
                                                            ...HourFrom,
                                                            value: value
                                                                ? moment(value).format('YYYY-MM-DD HH:mm:ss')
                                                                : null,
                                                            refresh: !HourFrom.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                        <View style={controlDate_To}>
                                            <VnrDate
                                                disable={HourTo.disable}
                                                response={'string'}
                                                format={'HH:mm'}
                                                value={HourTo.value}
                                                refresh={HourTo.refresh}
                                                type={'time'}
                                                onFinish={(value) =>
                                                    this.setState({
                                                        HourTo: {
                                                            ...HourTo,
                                                            value: value
                                                                ? moment(value).format('YYYY-MM-DD HH:mm:ss')
                                                                : null,
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

                        {/* Thời gian lưu trú- DateStayFrom, DateStayTo */}
                        {
                            DateStayFrom.visibleConfig && DateStayFrom.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Attendance_BusinessTravel_DateStay'}
                                        />

                                        {/* valid DateStart */}
                                        {fieldValid.DateStayFrom && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                    </View>
                                    <View style={viewControl}>
                                        <View style={formDate_To_From}>
                                            <View style={controlDate_from}>
                                                <VnrDate
                                                    response={'string'}
                                                    format={'DD/MM/YYYY'}
                                                    value={DateStayFrom.value}
                                                    refresh={DateStayFrom.refresh}
                                                    type={'date'}
                                                    onFinish={(value) => this.onChangeDateStayFrom(value)}
                                                />
                                            </View>
                                            <View style={controlDate_To}>
                                                <VnrDate
                                                    disable={DateStayTo.disable}
                                                    response={'string'}
                                                    format={'DD/MM/YYYY'}
                                                    value={DateStayTo.value}
                                                    refresh={DateStayTo.refresh}
                                                    type={'date'}
                                                    onFinish={(value) => this.onChangeDateStayTo(value)}
                                                />
                                            </View>
                                        </View>
                                    </View>
                                </View>
                            )
                        }

                        {/* Tổng số ngày -  SumDay */}
                        {TotalDayStay.visibleConfig && TotalDayStay.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'TotalDayStay'}
                                    />
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={TotalDayStay.disable}
                                        refresh={TotalDayStay.refresh}
                                        value={TotalDayStay.value}
                                        onChangeText={(text) =>
                                            this.setState({
                                                TotalDayStay: {
                                                    ...TotalDayStay,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Nơi đi -  PlaceFrom */}
                        {PlaceFrom.visibleConfig && PlaceFrom.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_PlaceInFrom'}
                                    />

                                    {fieldValid.PlaceFrom && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={PlaceFrom.disable}
                                        refresh={PlaceFrom.refresh}
                                        value={PlaceFrom.value}
                                        onChangeText={(text) =>
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

                        {/* Nơi đến -  PlaceTo */}
                        {PlaceTo.visibleConfig && PlaceTo.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_PlaceInTo'}
                                    />

                                    {fieldValid.PlaceTo && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={PlaceTo.disable}
                                        refresh={PlaceTo.refresh}
                                        value={PlaceTo.value}
                                        onChangeText={(text) =>
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

                        {/** Nơi Đi ngoại tỉnh - PlaceInFromID */}
                        {PlaceInFromID.visibleConfig && PlaceInFromID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_PlaceInFrom'}
                                    />

                                    {fieldValid.PlaceInFromID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetProvinceVN',
                                            type: 'E_GET'
                                        }}
                                        refresh={PlaceInFromID.refresh}
                                        textField="ProvinceCodeName"
                                        valueField="ID"
                                        autoFilter={true}
                                        filter={true}
                                        value={PlaceInFromID.value}
                                        filterServer={false}
                                        disable={PlaceInFromID.disable}
                                        onFinish={(item) =>
                                            this.setState({
                                                PlaceInFromID: {
                                                    ...PlaceInFromID,
                                                    value: item,
                                                    refresh: !PlaceInFromID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/** Nơi Đến ngoại tỉnh - PlaceInFromID */}
                        {PlaceInToID.visibleConfig && PlaceInToID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_PlaceInTo'}
                                    />

                                    {fieldValid.PlaceInToID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetProvinceVN',
                                            type: 'E_GET'
                                        }}
                                        refresh={PlaceInToID.refresh}
                                        textField="ProvinceCodeName"
                                        autoFilter={true}
                                        valueField="ID"
                                        filter={true}
                                        value={PlaceInToID.value}
                                        filterServer={false}
                                        disable={PlaceInToID.disable}
                                        onFinish={(item) =>
                                            this.setState({
                                                PlaceInToID: {
                                                    ...PlaceInToID,
                                                    value: item,
                                                    refresh: !PlaceInToID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Nơi đến nước ngoài -  PlaceOutToID */}
                        {PlaceOutToID.visibleConfig && PlaceOutToID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_PlaceOutTo'}
                                    />

                                    {fieldValid.PlaceOutToID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetCountryNotVn',
                                            type: 'E_GET'
                                        }}
                                        autoFilter={true}
                                        refresh={PlaceOutToID.refresh}
                                        textField="CountryName"
                                        valueField="ID"
                                        filter={true}
                                        value={PlaceOutToID.value}
                                        filterServer={false}
                                        disable={PlaceOutToID.disable}
                                        onFinish={(item) =>
                                            this.setState({
                                                PlaceOutToID: {
                                                    ...PlaceOutToID,
                                                    value: item,
                                                    refresh: !PlaceOutToID.refresh
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
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_SendTo'}
                                    />

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
                                        refresh={PlaceSendToID.refresh}
                                        textField="WorkPlaceName"
                                        valueField="ID"
                                        filter={true}
                                        value={PlaceSendToID.value}
                                        filterServer={false}
                                        disable={PlaceSendToID.disable}
                                        onFinish={(item) =>
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

                        {/* Người duyệt đầu - UserApproveID*/}
                        {UserApproveID.visibleConfig && UserApproveID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_TAMScanLog_UserApproveID'}
                                    />

                                    {/* valid UserApproveID */}
                                    {fieldValid.UserApproveID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_LEAVE_DAY_BUSINESSTRAVEL',
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
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_Overtime_UserApproveID3'}
                                    />

                                    {/* valid UserApproveID2 */}
                                    {fieldValid.UserApproveID2 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_LEAVE_DAY_BUSINESSTRAVEL',
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
                                                    value: item
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
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_Att_Overtime_Submit_UserApproveID4'}
                                    />

                                    {/* valid UserApproveID3 */}
                                    {fieldValid.UserApproveID3 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_LEAVE_DAY_BUSINESSTRAVEL',
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
                                                    value: item
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
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_Overtime_UserApproveID2'}
                                    />

                                    {/* valid UserApproveID4 */}
                                    {fieldValid.UserApproveID4 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_LEAVE_DAY_BUSINESSTRAVEL',
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

                        {/* Lý do đi công tác  -  BusinessTripReasonID*/}
                        {BusinessTripReasonID.visibleConfig && BusinessTripReasonID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={BusinessTripReasonID.label}
                                    />
                                    {fieldValid.BusinessTripReasonID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiBusinessTripReason',
                                            type: 'E_GET'
                                        }}
                                        value={BusinessTripReasonID.value}
                                        refresh={BusinessTripReasonID.refresh}
                                        textField="BusinessTripReasonName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={false}
                                        disable={BusinessTripReasonID.disable}
                                        onFinish={(item) => this.onPickBusinessTripReasonID(item)}
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
                                        i18nKey={'HRM_BusinessTravel_Note'}
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
                                        onChangeText={(text) =>
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

                        {/* Tập tin đính kèm - FileAttachment */}
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
                                        //disable={FileAttachment.disable}
                                        refresh={FileAttachment.refresh}
                                        value={FileAttachment.value}
                                        multiFile={true}
                                        uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                        onFinish={(file) => {
                                            this.setState({
                                                FileAttachment: {
                                                    ...FileAttachment,
                                                    value: file
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Tải mẫu - listTemplate */}
                        {listTemplate.visible && listTemplate.visibleConfig && listTemplate.listFile.length && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Evaluation_DownloadTemplateFile'}
                                    />
                                </View>
                                <View style={[viewControl, styles.listFile]}>
                                    {Vnr_Function.formatStringType(listTemplate, {
                                        Name: 'listFile',
                                        DataType: 'fileattach'
                                    })}
                                </View>
                            </View>
                        )}
                    </KeyboardAwareScrollView>

                    <ListButtonSave listActions={listActions} />

                    {modalErrorDetail.isModalVisible && (
                        <Modal
                            onBackButtonPress={() => this.closeModal()}
                            isVisible={true}
                            onBackdropPress={() => this.closeModal()}
                            customBackdrop={
                                <TouchableWithoutFeedback onPress={() => this.closeModal()}>
                                    <View style={styles.coating} />
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
                                    <ScrollView style={styles.flexGrow1Coulum}>{this.renderErrorDetail()}</ScrollView>
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
    styleViewBorderButtom: {
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.borderColor,
        flex: 1,
        marginBottom: 0.5,
        marginHorizontal: 10,
        paddingVertical: 10
    },
    listFile: {
        flexDirection: 'column',
        height: 100,
        justifyContent: 'space-between'
    },
    coating: {
        flex: 1,
        backgroundColor: Colors.black,
        opacity: 0.5
    },
    margin0: {
        margin: 0
    },
    wrapLableGroup: {
        marginHorizontal: 0,
        paddingBottom: 5,
        marginBottom: 10
    },
    txtLableGroup: { fontWeight: '500', color: Colors.primary },
    flex1: {
        flex: 1
    },
    flexGrow1: {
        flexGrow: 1
    },
    flexGrow1Coulum: { flexGrow: 1, flexDirection: 'column' },
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
