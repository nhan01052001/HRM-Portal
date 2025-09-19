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
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import VnrTreeView from '../../../../../components/VnrTreeView/VnrTreeView';

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

    Code: {
        label: 'Code',
        disable: false,
        placeholder: '',
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    ProfileReplace: {
        label: 'ProfileID2',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true
    },
    RequirementRecruitmentName: {
        label: 'RequirementRecruitmentName',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    DateRequest: {
        label: 'DateRequest',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    JobVacancyID: {
        label: 'JobVacancyID',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    OrganizationStructureID: {
        label: 'lblform_Hre_WorkHistorySalary_OrganizationStructureID1',
        disable: false,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    JobTitleID: {
        label: 'CostCenTreAllow__E_JOBTITTLE',
        data: [],
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    PositionID: {
        label: 'HRM_HR_Profile_PositionID',
        data: [],
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    RecruitmentEndDate: {
        label: 'RecruitmentEndDate',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    RecruitmentStartDate: {
        label: 'RecruitmentStartDate',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    RankID: {
        label: 'HRM_Rec_JobVacancy_RankID',
        data: [],
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    TypeRequirement: {
        label: 'TypeRequirement',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    Type: {
        label: 'HRM_Rec_JobVacancy_Type',
        data: [],
        disable: true,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    WorkPlaceID: {
        label: 'WorkPlaceID',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    DateProposal: {
        label: 'E_DateProposal',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    Quantity: {
        label: 'EmailType_RequirementRecruitment_E_Quantity',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    Reason: {
        label: 'Reason',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true
    },
    ApprovalDate: {
        label: 'HRM_Attendance_AttendanceTable_DateApprove',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    CompletionRequest: {
        label: 'HRM_HR_Task_DateComplete',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    Note: {
        label: 'Note',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    Description: {
        label: 'Description',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    FileAttachment: {
        label: 'HRM_HR_ArchivesTable_FileAttachment',
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

export default class HreSubmitRequirementRecruitmentAddOrEdit extends Component {
    constructor(props) {
        super(props);

        this.state = initSateDefault;

        // need fix
        props.navigation.setParams({
            title:
                props.navigation.state.params && props.navigation.state.params.record
                    ? 'HRM_Rec_RequirementRecruitment_PopUp_Edit_Title'
                    : 'HRM_Rec_RequirementRecruitment_PopUp_Create_Title'
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
        this.props.navigation.setParams({
            title: 'HRM_Rec_RequirementRecruitment_PopUp_Create_Title'
        });
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
        this.setState(resetState, () => this.getConfigValid('Hre_ConCurrent', true));
    };

    //promise get config valid
    getConfigValid = (tblName, isRefresh) => {
        VnrLoadingSevices.show();
        HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName).then((res) => {
            VnrLoadingSevices.hide();
            if (res) {
                try {
                    //map field hidden by config
                    const _configField =
                        ConfigField && ConfigField.value['HreSubmitRequirementRecruitmentAddOrEdit']
                            ? ConfigField.value['HreSubmitRequirementRecruitmentAddOrEdit']['Hidden']
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
        this.getConfigValid('Hre_ConCurrent');
    }

    getGenerateCode = () => {
        const { Code } = this.state;

        HttpService.Post('[URI_HR]/Sys_GetData/GetFieldGenerateCode', {
            _tableName: 'Rec_RequirementRecruitment'
        }).then((res) => {
            if (res.length !== 0) {
                this.setState({
                    Code: {
                        ...Code,
                        disable: true,
                        placeholder: 'Tự động sinh mã',
                        refresh: !Code.refresh
                    }
                });
            } else {
                this.setState({
                    Code: {
                        ...Code,
                        disable: false,
                        placeholder: '',
                        refresh: !Code.refresh
                    }
                });
            }
        });
    };

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
            this.getGenerateCode();
            this.GetHighSupervior();
        });
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        const { ID } = record,
            { E_ProfileID } = enumName,
            ProfileID = profileInfo[E_ProfileID];

        let type = 'JobVacancyType';
        let arrRequest = [
            HttpService.Post('[URI_HR]/Por_GetData/GetRequirementRecuitmentById', { id: ID }),
            HttpService.Get(`[URI_SYS]/Sys_GetData/GetEnum?text=${type}`),
            HttpService.Post('[URI_HR]/Att_GetData/GetHighSupervisor', {
                ProfileID: ProfileID,
                userSubmit: ProfileID,
                type: 'E_REQUIREMENTRECRUITMENT'
            })
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
        const {
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4,
                PositionID,
                OrganizationStructureID,
                TypeRequirement,
                Profile
            } = this.state,
            profileID = Profile.ID;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Hre_GetData/GetUserApproveWithType', {
            userSubmit: profileID,
            profileID: profileID,
            Type: 'E_REQUIREMENTRECRUITMENT',
            PosID: PositionID && PositionID.value && PositionID.value.ID ? PositionID.value.ID : null,
            organizationStructureID: OrganizationStructureID.value[0].id,
            TypeRequirement: TypeRequirement.value !== null ? TypeRequirement.value.Value : null
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

                    //_UserApproveID4.readonly(false);
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

    handleSetState = (record, resAll) => {
        let nextState = {};

        const {
                ProfileReplace,
                Profile,
                Code,
                RequirementRecruitmentName,
                Quantity,
                JobVacancyID,
                RecruitmentStartDate,
                RecruitmentEndDate,
                RankID,
                DateProposal,
                TypeRequirement,
                Type,
                OrganizationStructureID,
                PositionID,
                JobTitleID,
                WorkPlaceID,
                Reason,
                ApprovalDate,
                CompletionRequest,
                Note,
                Description,
                FileAttachment,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4
            } = this.state,
            item = resAll[0],
            type = resAll[1];
        // configHighSupervisor = resAll[2];

        let valType = {
            Text: type[0]['Text'] ? type[0]['Text'] : null,
            Value: type[0]['Value'] ? type[0]['Value'] : null
        };
        nextState = {
            ...this.state,
            ID: record.ID,
            Code: {
                ...Code,
                value: item.Code,
                disable: true,
                refresh: !Code.refresh
            },
            Profile: {
                ...Profile,
                ID: item.UserSubmitID,
                ProfileName: item.UserSubmitName
            },
            RequirementRecruitmentName: {
                ...RequirementRecruitmentName,
                value: item.RequirementRecruitmentName,
                disable: false,
                refresh: !RequirementRecruitmentName.refresh
            },
            Quantity: {
                ...Quantity,
                value: item.Quantity,
                disable: false,
                refresh: !Quantity.refresh
            },
            JobVacancyID: {
                ...JobVacancyID,
                value: item.JobVacancyID
                    ? { ID: item.JobVacancyID, JobVacancyName: item.JobVacancyName, isSelect: true }
                    : null,
                disable: false,
                refresh: !JobVacancyID.refresh
            },
            RecruitmentStartDate: {
                ...RecruitmentStartDate,
                value: item.RecruitmentStartDate
                    ? moment(item.RecruitmentStartDate).format('YYYY-MM-DD HH:mm:ss')
                    : null,
                disable: false,
                refresh: !RecruitmentStartDate.refresh
            },
            RecruitmentEndDate: {
                ...RecruitmentEndDate,
                value: item.RecruitmentEndDate ? moment(item.RecruitmentEndDate).format('YYYY-MM-DD HH:mm:ss') : null,
                disable: false,
                refresh: !RecruitmentEndDate.refresh
            },
            RankID: {
                ...RankID,
                value: item.RankID ? { ID: item.RankID, RankName: item.RankName, isSelect: true } : null,
                refresh: !RankID.refresh
            },
            DateProposal: {
                ...DateProposal,
                value: item.DateProposal ? moment(item.DateProposal).format('YYYY-MM-DD HH:mm:ss') : null,
                disable: false,
                refresh: !DateProposal.refresh
            },
            TypeRequirement: {
                ...TypeRequirement,
                value: item.TypeRequirement
                    ? { ID: item.TypeRequirement, TypeRequirementName: item.TypeRequirementName, isSelect: true }
                    : null,
                disable: false,
                refresh: !TypeRequirement.refresh
            },
            OrganizationStructureID: {
                ...OrganizationStructureID,
                value: item.OrgStructureID
                    ? [{ id: item.OrgStructureID, Name: item.OrgStructureName, isSelect: true }]
                    : null,
                disable: false,
                refresh: !OrganizationStructureID.refresh
            },
            JobTitleID: {
                ...JobTitleID,
                value: item.JobTitleID
                    ? { ID: item.JobTitleID, JobTitleName: item.JobTitleName, isSelect: true }
                    : null,
                disable: true,
                refresh: !JobTitleID.refresh
            },
            PositionID: {
                ...PositionID,
                value: item.PositionID
                    ? { ID: item.PositionID, PositionName: item.PositionName, isSelect: true }
                    : null,
                disable: true,
                refresh: !PositionID.refresh
            },
            WorkPlaceID: {
                ...WorkPlaceID,
                value: item.WorkPlaceID
                    ? { ID: item.WorkPlaceID, WorkPlaceName: item.WorkPlaceName, isSelect: true }
                    : null,
                refresh: !WorkPlaceID.refresh
            },
            Reason: {
                ...Reason,
                value: item.Reason ? item.Reason : null,
                disable: false,
                refresh: !Reason.refresh
            },
            ApprovalDate: {
                ...ApprovalDate,
                value: item.ApprovalDate ? moment(item.ApprovalDate).format('YYYY-MM-DD HH:mm:ss') : null,
                disable: false,
                refresh: !ApprovalDate.refresh
            },
            CompletionRequest: {
                ...CompletionRequest,
                value: item.CompletionRequest ? moment(item.CompletionRequest).format('YYYY-MM-DD HH:mm:ss') : null,
                disable: false,
                refresh: !CompletionRequest.refresh
            },
            Type: {
                ...Type,
                value: valType,
                data: type,
                disable: false,
                refresh: !Type.refresh
            },
            ProfileReplace: {
                ...ProfileReplace,
                visible: valType.Value === 'E_VACANCY_REPLACE' ? true : false,
                disable: false,
                refresh: !ProfileReplace.refresh
            },
            FileAttachment: {
                ...FileAttachment,
                value: item.lstFileAttach,
                disable: false,
                refresh: !FileAttachment.refresh
            },
            Note: {
                ...Note,
                value: item.Note ? item.Note : '',
                disable: false,
                refresh: !Note.refresh
            },
            Description: {
                ...Description,
                value: item.Description ? item.Description : '',
                disable: false,
                refresh: !Description.refresh
            },
            UserApproveID: {
                ...UserApproveID,
                value: item.UserApproveID ? { ID: item.UserApproveID, UserInfoName: item.UserApproveName } : null,
                disable: true,
                refresh: !UserApproveID.refresh
            },
            UserApproveID2: {
                ...UserApproveID2,
                value: item.UserApproveID2 ? { ID: item.UserApproveID2, UserInfoName: item.UserApproveID2Name } : null,
                disable: true,
                refresh: !UserApproveID2.refresh
            },
            UserApproveID3: {
                ...UserApproveID3,
                value: item.UserApproveID3 ? { ID: item.UserApproveID3, UserInfoName: item.UserApproveID3Name } : null,
                disable: true,
                refresh: !UserApproveID3.refresh
            },
            UserApproveID4: {
                ...UserApproveID4,
                value: item.UserApproveID4 ? { ID: item.UserApproveID4, UserInfoName: item.UserApproveID4Name } : null,
                disable: true,
                refresh: !UserApproveID4.refresh
            }
        };

        // if (configHighSupervisor && configHighSupervisor.LevelApprove > 0) {
        //   if (configHighSupervisor.IsChangeApprove != true) {
        //     nextState = {
        //       ...nextState,
        //       UserApproveID: {
        //         ...nextState.UserApproveID,
        //         disable: true,
        //       },
        //       UserApproveID2: {
        //         ...nextState.UserApproveID2,
        //         disable: true,
        //       },
        //       UserApproveID3: {
        //         ...nextState.UserApproveID3,
        //         disable: true,
        //       },
        //     };
        //   } else {
        //     nextState = {
        //       ...nextState,
        //       UserApproveID: {
        //         ...nextState.UserApproveID,
        //         disable: false,
        //       },
        //       UserApproveID2: {
        //         ...nextState.UserApproveID2,
        //         disable: false,
        //       },
        //       UserApproveID3: {
        //         ...nextState.UserApproveID3,
        //         disable: false,
        //       },
        //     };
        //   }
        // }

        // if (configHighSupervisor) {
        //   this.levelApproveLateEarlyAllowed = configHighSupervisor.LevelApprove;
        //   if (configHighSupervisor.LevelApprove == 2) {
        //     nextState = {
        //       ...nextState,
        //       UserApproveID2: {
        //         ...nextState.UserApproveID2,
        //         visible: false,
        //       },
        //       UserApproveID3: {
        //         ...nextState.UserApproveID3,
        //         visible: false,
        //       },
        //     };
        //   } else if (configHighSupervisor.LevelApprove == 3) {
        //     nextState = {
        //       ...nextState,
        //       UserApproveID2: {
        //         ...nextState.UserApproveID2,
        //         visible: true,
        //       },
        //       UserApproveID3: {
        //         ...nextState.UserApproveID3,
        //         visible: false,
        //       },
        //     };
        //   } else if (configHighSupervisor.LevelApprove == 4) {
        //     nextState = {
        //       ...nextState,
        //       UserApproveID2: {
        //         ...nextState.UserApproveID2,
        //         visible: true,
        //       },
        //       UserApproveID3: {
        //         ...nextState.UserApproveID3,
        //         visible: true,
        //       },
        //     };
        //   }
        // }

        // console.log(nextState, 'nextState');

        this.setState(nextState);
    };
    //#endregion

    onChangeJobVacancyID = () => {
        const { JobVacancyID, RankID, OrganizationStructureID, PositionID, JobTitleID } = this.state;
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Rec_GetData/GetJobVacancyByID', {
            JobVacancyID: JobVacancyID.value.ID
        }).then((res) => {
            VnrLoadingSevices.hide();
            if (res) {
                let nextState = {
                    OrganizationStructureID: {
                        ...OrganizationStructureID,
                        value: res.OrgStructureID
                            ? [{ Name: `${res.OrgStructureName}`, id: res.OrgStructureID }]
                            : null,
                        refresh: !OrganizationStructureID.refresh
                    },
                    JobTitleID: {
                        ...JobTitleID,
                        value: res.JobTitleID ? { ID: res.JobTitleID, JobTitleName: res.JobTitleName } : null,
                        refresh: !JobTitleID.refresh
                    },
                    PositionID: {
                        ...PositionID,
                        value: res.PositionID ? { ID: res.PositionID, PositionName: res.PositionName } : null,
                        refresh: !PositionID.refresh
                    },
                    RankID: {
                        ...RankID,
                        value: res.RankID ? { ID: res.RankID, NameEntityName: res.RankName } : null,
                        refresh: !RankID.refresh
                    }
                };
                this.setState(nextState, () => {
                    this.loadDurationType();
                });
            }
        });
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
            type: 'E_REQUIREMENTRECRUITMENT',
            resource: {
                // BusinessTripTypeID : PurposeRegisterID.val
            }
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
                this.levelApproveLateEarlyAllowed = result.LevelApprove;

                if (result.LevelApprove == 2) {
                    if (result.IsOnlyOneLevelApprove) {
                        this.levelApproveLateEarlyAllowed = 1;

                        if (result.SupervisorID != null) {
                            nextState = {
                                UserApproveID: {
                                    ...nextState.UserApproveID,
                                    value: {
                                        UserInfoName: result.SupervisorName,
                                        ID: result.SupervisorID
                                    }
                                },
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    value: {
                                        UserInfoName: result.SupervisorName,
                                        ID: result.SupervisorID
                                    }
                                },
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    value: {
                                        UserInfoName: result.SupervisorName,
                                        ID: result.SupervisorID
                                    }
                                },
                                UserApproveID4: {
                                    ...nextState.UserApproveID4,
                                    value: {
                                        UserInfoName: result.SupervisorName,
                                        ID: result.SupervisorID
                                    }
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
                                    value: {
                                        UserInfoName: result.SupervisorName,
                                        ID: result.SupervisorID
                                    }
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
                                    value: {
                                        UserInfoName: result.SupervisorNextName,
                                        ID: result.MidSupervisorID
                                    }
                                },
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    value: {
                                        UserInfoName: result.SupervisorNextName,
                                        ID: result.MidSupervisorID
                                    }
                                },
                                UserApproveID4: {
                                    ...nextState.UserApproveID4,
                                    value: {
                                        UserInfoName: result.SupervisorNextName,
                                        ID: result.MidSupervisorID
                                    }
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
                                value: {
                                    UserInfoName: result.SupervisorName,
                                    ID: result.SupervisorID
                                }
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
                                value: {
                                    UserInfoName: result.NextMidSupervisorName,
                                    ID: result.NextMidSupervisorID
                                }
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                value: {
                                    UserInfoName: result.NextMidSupervisorName,
                                    ID: result.NextMidSupervisorID
                                }
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
                                value: {
                                    UserInfoName: result.SupervisorName,
                                    ID: result.SupervisorID
                                }
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
                                value: {
                                    UserInfoName: result.SupervisorNextName,
                                    ID: result.MidSupervisorID
                                }
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
                                value: {
                                    UserInfoName: result.NextMidSupervisorName,
                                    ID: result.NextMidSupervisorID
                                }
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
                                value: {
                                    UserInfoName: result.HighSupervisorName,
                                    ID: result.HighSupervisorID
                                }
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
                                value: {
                                    UserInfoName: result.HighSupervisorName,
                                    ID: result.HighSupervisorID
                                }
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
                                value: {
                                    UserInfoName: result.SupervisorNextName,
                                    ID: result.MidSupervisorID
                                }
                            },
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: {
                                    UserInfoName: result.SupervisorNextName,
                                    ID: result.MidSupervisorID
                                }
                            },
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                value: {
                                    UserInfoName: result.SupervisorNextName,
                                    ID: result.MidSupervisorID
                                }
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
                ProfileReplace,
                Profile,
                Code,
                RequirementRecruitmentName,
                DateRequest,
                Quantity,
                JobVacancyID,
                RecruitmentStartDate,
                RecruitmentEndDate,
                RankID,
                DateProposal,
                TypeRequirement,
                Type,
                OrganizationStructureID,
                PositionID,
                JobTitleID,
                WorkPlaceID,
                Reason,
                ApprovalDate,
                CompletionRequest,
                Note,
                Description,
                FileAttachment,
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
            Status: 'E_SUBMIT',
            Code: Code.value === '' ? null : Code.value,
            RequirementRecruitmentName: RequirementRecruitmentName.value,
            OrgStructureID: OrganizationStructureID.value ? OrganizationStructureID.value[0].id : null,
            PositionID: PositionID.value ? PositionID.value.ID : null,
            JobTitleID: JobTitleID.value ? JobTitleID.value.ID : null,
            Quantity: Quantity.value,
            JobVacancyID: JobVacancyID.value ? JobVacancyID.value.ID : null,
            TypeRequirement: TypeRequirement.value ? TypeRequirement.value.Value : null,
            WorkPlaceID: WorkPlaceID.value ? WorkPlaceID.value.ID : null,
            RankID: RankID.value ? RankID.value.ID : null,
            DateRequest: DateRequest.value ? moment(DateRequest.value).format('YYYY-MM-DD HH:mm:ss') : null,
            RecruitmentStartDate: RecruitmentStartDate.value
                ? moment(RecruitmentStartDate.value).format('YYYY-MM-DD HH:mm:ss')
                : null,
            RecruitmentEndDate: RecruitmentEndDate.value
                ? moment(RecruitmentEndDate.value).format('YYYY-MM-DD HH:mm:ss')
                : null,
            DateProposal: DateProposal.value ? moment(DateProposal.value).format('YYYY-MM-DD HH:mm:ss') : null,
            CompletionRequest: CompletionRequest.value
                ? moment(CompletionRequest.value).format('YYYY-MM-DD HH:mm:ss')
                : null,
            ApprovalDate: ApprovalDate.value ? moment(ApprovalDate.value).format('YYYY-MM-DD HH:mm:ss') : null,
            Type: Type.value ? Type.value.Value : null,
            ProfileReplace: ProfileReplace.value ? ProfileReplace.value.ID : null,
            FileAttachment: FileAttachment.value ? FileAttachment.value.map((item) => item.fileName).join(',') : null,
            Note: Note.value,
            Reason: Reason.value,
            Description: Description.value,

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
                IsAddNewAndSendMail: true,
                // task: 0164852
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
        HttpService.Post('[URI_HR]/api/Rec_RequirementRecruitment', param).then((data) => {
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
                                style={[styleSheets.text, styles.styTextTitleGruop]}
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
            Code,
            ProfileReplace,
            RequirementRecruitmentName,
            Quantity,
            JobVacancyID,
            RecruitmentStartDate,
            RecruitmentEndDate,
            RankID,
            DateProposal,
            TypeRequirement,
            Type,
            OrganizationStructureID,
            PositionID,
            JobTitleID,
            WorkPlaceID,
            Reason,
            ApprovalDate,
            CompletionRequest,
            Note,
            Description,
            FileAttachment,
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
        const listActions = [
            {
                type: EnumName.E_SAVE_SENMAIL,
                title: translate('HRM_Common_SaveAndSendMail'),
                onPress: () => this.onSaveAndSend(this.props.navigation)
            },
            {
                type: EnumName.E_SAVE_CLOSE,
                title: translate('HRM_Common_SaveClose'),
                onPress: () => this.onSave(this.props.navigation)
            },
            {
                type: EnumName.E_SAVE_NEW,
                title: translate('HRM_Common_SaveNew'),
                onPress: () => this.onSaveAndCreate(this.props.navigation)
            }
        ];

        // if (
        //   PermissionForAppMobile &&
        //   PermissionForAppMobile.value[
        //     "New_Att_RegisterVehicle_New_CreateOrUpdate_btnSaveandSendMail"
        //   ] &&
        //   PermissionForAppMobile.value[
        //     "New_Att_RegisterVehicle_New_CreateOrUpdate_btnSaveandSendMail"
        //   ]["View"]
        // ) {
        //   listActions.push({
        //     type: EnumName.E_SAVE_SENMAIL,
        //     title: translate("HRM_Common_SaveAndSendMail"),
        //     onPress: () => this.onSaveAndSend(this.props.navigation),
        //   });
        // }

        // if (
        //   PermissionForAppMobile &&
        //   PermissionForAppMobile.value[
        //     "New_Att_RegisterVehicle_New_CreateOrUpdate_btnSaveClose"
        //   ] &&
        //   PermissionForAppMobile.value[
        //     "New_Att_RegisterVehicle_New_CreateOrUpdate_btnSaveClose"
        //   ]["View"]
        // ) {
        //   listActions.push({
        //     type: EnumName.E_SAVE_CLOSE,
        //     title: translate("HRM_Common_SaveClose"),
        //     onPress: () => this.onSave(this.props.navigation),
        //   });
        // }

        // if (
        //   PermissionForAppMobile &&
        //   PermissionForAppMobile.value[
        //     "New_Att_RegisterVehicle_New_CreateOrUpdate_btnSaveCreate"
        //   ] &&
        //   PermissionForAppMobile.value[
        //     "New_Att_RegisterVehicle_New_CreateOrUpdate_btnSaveCreate"
        //   ]["View"]
        // ) {
        //   listActions.push({
        //     type: EnumName.E_SAVE_NEW,
        //     title: translate("HRM_Common_SaveNew"),
        //     onPress: () => this.onSaveAndCreate(this.props.navigation),
        //   });
        // }

        //#endregion
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={styles.styViewKeyboard}
                        ref={(ref) => (this.scrollViewRef = ref)}
                    >
                        {/* Mã  -  Code*/}
                        {Code.visibleConfig && Code.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Code.label} />
                                    {fieldValid.Code && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Code.disable}
                                        placeholder={translate(`${Code.placeholder}`)}
                                        refresh={Code.refresh}
                                        value={Code.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                Code: {
                                                    ...Code,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Yêu cầu tuyển  -  RequirementRecruitmentName*/}
                        {RequirementRecruitmentName.visibleConfig && RequirementRecruitmentName.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={RequirementRecruitmentName.label}
                                    />
                                    {fieldValid.RequirementRecruitmentName && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={RequirementRecruitmentName.disable}
                                        refresh={RequirementRecruitmentName.refresh}
                                        value={RequirementRecruitmentName.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                RequirementRecruitmentName: {
                                                    ...RequirementRecruitmentName,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Vị trí tuyển - JobVacancyID */}
                        {JobVacancyID.visibleConfig && JobVacancyID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={JobVacancyID.label} />

                                    {/* valid JobVacancyID */}
                                    {fieldValid.JobVacancyID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi: '[URI_HR]//Rec_GetData/GetMultiJobVacancyV2',
                                            type: 'E_POST',
                                            dataBody: {
                                                text: ''
                                            }
                                        }}
                                        // dataLocal={JobVacancyID.data}
                                        refresh={JobVacancyID.refresh}
                                        textField="JobVacancyName"
                                        valueField="ID"
                                        filter={true}
                                        value={JobVacancyID.value}
                                        filterServer={false}
                                        filterParams="text"
                                        disable={JobVacancyID.disable}
                                        onFinish={(item) => {
                                            this.setState(
                                                {
                                                    JobVacancyID: {
                                                        ...JobVacancyID,
                                                        value: item,
                                                        refresh: !JobVacancyID.refresh
                                                    }
                                                },
                                                () => {
                                                    this.onChangeJobVacancyID();
                                                }
                                            );
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Phòng ban -  OrganizationStructureID*/}
                        {OrganizationStructureID.visibleConfig && OrganizationStructureID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={OrganizationStructureID.label}
                                    />
                                    {fieldValid.OrganizationStructureID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTreeView
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetOrgTreeView',
                                            type: 'E_GET'
                                        }}
                                        valueField={'ID'}
                                        value={OrganizationStructureID.value}
                                        refresh={OrganizationStructureID.refresh}
                                        isCheckChildren={true}
                                        onSelect={(items) => this.treeViewResult(items)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Chức danh - JobTitleID */}
                        {JobTitleID.visibleConfig && JobTitleID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={JobTitleID.label} />

                                    {/* valid JobTitleID */}
                                    {fieldValid.JobTitleID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={JobTitleID.data}
                                        refresh={JobTitleID.refresh}
                                        textField="JobTitleName"
                                        valueField="ID"
                                        filter={true}
                                        value={JobTitleID.value}
                                        filterServer={false}
                                        filterParams="JobTitleName"
                                        disable={JobTitleID.disable}
                                        onFinish={(item) => this.onChangeJobTitleID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Chức vụ - PositionID */}
                        {PositionID.visibleConfig && PositionID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PositionID.label} />

                                    {/* valid PositionID */}
                                    {fieldValid.PositionID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiPosition',
                                            type: 'E_GET'
                                        }}
                                        refresh={PositionID.refresh}
                                        textField="PositionName"
                                        valueField="ID"
                                        filter={true}
                                        value={PositionID.value}
                                        filterServer={false}
                                        filterParams="PositionName"
                                        disable={PositionID.disable}
                                        onFinish={(item) => this.onChangePositionID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Nơi làm việc - WorkPlaceID */}
                        {WorkPlaceID.visibleConfig && WorkPlaceID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={WorkPlaceID.label} />

                                    {/* valid WorkPlaceID */}
                                    {fieldValid.WorkPlaceID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiWorkPlace',
                                            type: 'E_GET'
                                        }}
                                        refresh={WorkPlaceID.refresh}
                                        textField="WorkPlaceName"
                                        valueField="ID"
                                        filter={true}
                                        value={WorkPlaceID.value}
                                        filterServer={false}
                                        filterParams="CompanyName"
                                        disable={WorkPlaceID.disable}
                                        onFinish={(item) => {
                                            this.setState({
                                                WorkPlaceID: {
                                                    ...WorkPlaceID,
                                                    value: item,
                                                    refresh: !WorkPlaceID.refresh
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày bắt đầu tuyển - RecruitmentStartDate */}
                        {RecruitmentStartDate.visibleConfig && RecruitmentStartDate.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={RecruitmentStartDate.label}
                                    />

                                    {/* valid RecruitmentStartDate */}
                                    {fieldValid.RecruitmentStartDate && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        disable={RecruitmentStartDate.disable}
                                        format={'DD/MM/YYYY'}
                                        value={RecruitmentStartDate.value}
                                        refresh={RecruitmentStartDate.refresh}
                                        type={'date'}
                                        onFinish={(value) =>
                                            this.setState({
                                                RecruitmentStartDate: {
                                                    ...RecruitmentStartDate,
                                                    value: value,
                                                    refresh: !RecruitmentStartDate.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày kết thúc tuyển - RecruitmentEndDate */}
                        {RecruitmentEndDate.visibleConfig && RecruitmentEndDate.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={RecruitmentEndDate.label}
                                    />

                                    {/* valid RecruitmentEndDate */}
                                    {fieldValid.RecruitmentEndDate && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        disable={RecruitmentEndDate.disable}
                                        format={'DD/MM/YYYY'}
                                        value={RecruitmentEndDate.value}
                                        refresh={RecruitmentEndDate.refresh}
                                        type={'date'}
                                        onFinish={(value) =>
                                            this.setState({
                                                RecruitmentEndDate: {
                                                    ...RecruitmentEndDate,
                                                    value: value,
                                                    refresh: !RecruitmentEndDate.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày bắt đầu đi làm - DateProposal */}
                        {DateProposal.visibleConfig && DateProposal.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DateProposal.label} />

                                    {/* valid DateProposal */}
                                    {fieldValid.DateProposal && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        disable={DateProposal.disable}
                                        format={'DD/MM/YYYY'}
                                        value={DateProposal.value}
                                        refresh={DateProposal.refresh}
                                        type={'date'}
                                        onFinish={(value) =>
                                            this.setState({
                                                DateProposal: {
                                                    ...DateProposal,
                                                    value: value,
                                                    refresh: !DateProposal.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Số lượng tuyển -  Quantity*/}
                        {Quantity.visibleConfig && Quantity.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Quantity.label} />
                                    {fieldValid.Quantity && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Quantity.disable}
                                        refresh={Quantity.refresh}
                                        value={Quantity.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        keyboardType="numeric"
                                        charType={'int'}
                                        onChangeText={(text) =>
                                            this.setState({
                                                Quantity: {
                                                    ...Quantity,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Đối tượng tuyển - RankID */}
                        {RankID.visibleConfig && RankID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={RankID.label} />

                                    {/* valid RankID */}
                                    {fieldValid.RankID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiRank',
                                            type: 'E_GET'
                                        }}
                                        dataLocal={RankID.data}
                                        refresh={RankID.refresh}
                                        textField="NameEntityName"
                                        valueField="ID"
                                        filter={true}
                                        value={RankID.value}
                                        filterServer={false}
                                        filterParams="NameEntityName"
                                        disable={RankID.disable}
                                        onFinish={(item) => this.onChangeRankID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Loại yêu cầu tuyển -  TypeRequirement */}
                        {TypeRequirement.visibleConfig && TypeRequirement.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={TypeRequirement.label}
                                    />

                                    {/* valid TypeRequirement */}
                                    {fieldValid.TypeRequirement && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        api={{
                                            urlApi: '[URI_HR]/Sys_GetData/GetEnum?text=TypeRequestV2',
                                            type: 'E_GET'
                                        }}
                                        autoFilter={true}
                                        dataLocal={TypeRequirement.data}
                                        refresh={TypeRequirement.refresh}
                                        textField="Text"
                                        valueField="Value"
                                        filter={true}
                                        value={TypeRequirement.value}
                                        filterServer={false}
                                        disable={TypeRequirement.disable}
                                        onFinish={(item) =>
                                            this.setState(
                                                {
                                                    TypeRequirement: {
                                                        ...TypeRequirement,
                                                        value: item,
                                                        refresh: !TypeRequirement.refresh
                                                    }
                                                },
                                                () => {
                                                    this.getUserApprove();
                                                }
                                            )
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Loại tuyển -  Type */}
                        {Type.visibleConfig && Type.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Type.label} />

                                    {/* valid Type */}
                                    {fieldValid.Type && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        api={{
                                            urlApi: '[URI_HR]/Sys_GetData/GetEnum?text=JobVacancyType',
                                            type: 'E_GET'
                                        }}
                                        autoFilter={true}
                                        dataLocal={Type.data}
                                        refresh={Type.refresh}
                                        textField="Text"
                                        valueField="Value"
                                        filter={true}
                                        value={Type.value}
                                        filterServer={false}
                                        disable={Type.disable}
                                        onFinish={(item) =>
                                            this.setState({
                                                Type: {
                                                    ...Type,
                                                    value: item,
                                                    refresh: !Type.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Nhân viên thay thế -  ProfileReplace */}
                        {ProfileReplace.visibleConfig && ProfileReplace.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={ProfileReplace.label} />

                                    {/* valid ProfileReplace */}
                                    {fieldValid.ProfileReplace && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        api={{
                                            urlApi: '[URI_HR]/Hre_GetData/GetMultiProfile',
                                            ProfileReplace: 'E_GET'
                                        }}
                                        autoFilter={true}
                                        dataLocal={ProfileReplace.data}
                                        refresh={ProfileReplace.refresh}
                                        textField="ProfileName"
                                        valueField="CodeEmp"
                                        filter={true}
                                        value={ProfileReplace.value}
                                        filterServer={false}
                                        filterParams={'ProfileName'}
                                        disable={ProfileReplace.disable}
                                        onFinish={(item) =>
                                            this.setState({
                                                ProfileReplace: {
                                                    ...ProfileReplace,
                                                    value: item,
                                                    refresh: !ProfileReplace.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Lý do tuyển -  Reason*/}
                        {Reason.visibleConfig && Reason.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Reason.label} />
                                    {fieldValid.Reason && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Reason.disable}
                                        refresh={Reason.refresh}
                                        value={Reason.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                Reason: {
                                                    ...Reason,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày duyệt - ApprovalDate */}
                        {ApprovalDate.visibleConfig && ApprovalDate.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={ApprovalDate.label} />

                                    {/* valid ApprovalDate */}
                                    {fieldValid.ApprovalDate && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        disable={ApprovalDate.disable}
                                        format={'DD/MM/YYYY'}
                                        value={ApprovalDate.value}
                                        refresh={ApprovalDate.refresh}
                                        type={'date'}
                                        onFinish={(value) =>
                                            this.setState({
                                                ApprovalDate: {
                                                    ...ApprovalDate,
                                                    value: value,
                                                    refresh: !ApprovalDate.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày hoàn thành - CompletionRequest */}
                        {CompletionRequest.visibleConfig && CompletionRequest.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={CompletionRequest.label}
                                    />

                                    {/* valid CompletionRequest */}
                                    {fieldValid.CompletionRequest && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        disable={CompletionRequest.disable}
                                        format={'DD/MM/YYYY'}
                                        value={CompletionRequest.value}
                                        refresh={CompletionRequest.refresh}
                                        type={'date'}
                                        onFinish={(value) =>
                                            this.setState({
                                                CompletionRequest: {
                                                    ...CompletionRequest,
                                                    value: value,
                                                    refresh: !CompletionRequest.refresh
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

                        {/* mô tả -  Description*/}
                        {Description.visibleConfig && Description.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Description.label} />
                                    {fieldValid.Description && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Description.disable}
                                        refresh={Description.refresh}
                                        value={Description.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                Description: {
                                                    ...Description,
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
                                    <View style={stylesScreenDetailV3.modalBackdrop} />
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
    styViewKeyboard: { flexGrow: 1, paddingTop: 10 },
    styTextTitleGruop: { fontWeight: '500', color: Colors.primary },
    styViewTitleGroupExtend: { marginHorizontal: 0, paddingBottom: 5, marginBottom: 10 },
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
