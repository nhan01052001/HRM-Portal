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
    styleViewTitleForGroup,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import Modal from 'react-native-modal';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import CheckBox from 'react-native-check-box';
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
import { IconDown, IconUp, IconColse } from '../../../../../constants/Icons';
import { translate } from '../../../../../i18n/translate';
import VnrPickerMulti from '../../../../../components/VnrPickerMulti/VnrPickerMulti';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import Vnr_Function from '../../../../../utils/Vnr_Function';

let enumName = null,
    profileInfo = null;

export default class AttSubmitPregnancyAddOrEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ID: null,
            Profile: {
                label: 'HRM_Attendance_Leaveday_ProfileID',
                ID: null,
                ProfileName: '',
                disable: true
            },
            Type: {
                label: 'HRM_Attendance_Pregnancy_Type',
                data: [],
                disable: false,
                refresh: false,
                value: null,
                visible: false,
                visibleConfig: true
            },
            divTypePregnancyEarly: {
                label: 'HRM_Attendance_Pregnancy_TypePregnancyEarlyView',
                visible: false,
                TypePregnancyEarlyShift: {
                    label: 'HRM_Attendance_Pregnancy_TypePregnancyEarlyShift',
                    disable: false,
                    refresh: false,
                    value: false,
                    visibleConfig: true,
                    visible: true
                },
                IsLateIn: {
                    label: 'HRM_Attendance_WorkDay_LateDuration',
                    disable: false,
                    refresh: false,
                    value: false,
                    visibleConfig: true,
                    visible: true
                },
                IsEarlyMidOut: {
                    label: 'HRM_Attendance_Pregnancy_IsEarlyMidOut',
                    disable: false,
                    refresh: false,
                    value: false,
                    visibleConfig: true,
                    visible: true
                },
                IsLateMidIn: {
                    label: 'HRM_Attendance_Pregnancy_IsLateMidIn',
                    disable: false,
                    refresh: false,
                    value: false,
                    visibleConfig: true,
                    visible: true
                },
                IsEarlyOut: {
                    label: 'HRM_Category_Shift_IsFlast',
                    disable: false,
                    refresh: false,
                    value: false,
                    visibleConfig: true,
                    visible: true
                }
            },
            TypePregnancyEarly: {
                label: 'HRM_Attendance_Pregnancy_TypePregnancyEarlyView',
                api: {
                    urlApi: '[URI_SYS]/Sys_GetData/GetEnum?text=PregnancyLeaveEarlyType',
                    type: 'E_GET'
                },
                valueField: 'Value',
                textField: 'Text',
                data: [],
                disable: false,
                value: null,
                refresh: false,
                visible: false,
                visibleConfig: true
            },
            ChildName: {
                label: 'HRM_Attendance_Pregnancy_ChildName',
                data: [],
                disable: false,
                value: null,
                refresh: false,
                visibleConfig: true,
                visible: true
            },
            DatePregnacy: {
                label: 'HRM_Attendance_Pregnancy_DatePregnacy',
                value: null,
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            ChildBirthday: {
                label: 'HRM_Attendance_Pregnancy_DateOfBirth',
                value: null,
                refresh: false,
                disable: true,
                visibleConfig: true,
                visible: true
            },
            YearOfLose: {
                label: 'HRM_Attendance_Pregnancy_YearOfLose',
                value: null,
                refresh: false,
                disable: true,
                visibleConfig: true,
                visible: true
            },
            ChildCareCompUsedTo: {
                label: 'HRM_Attendance_Pregnancy_ChildCareCompUsedTo',
                value: null,
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            DateStart: {
                label: 'HRM_HR_Profile_DateOfEffect',
                value: null,
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            DateEnd: {
                label: 'HRM_HR_Profile_DateOfEffect',
                value: null,
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            IsOvertime: {
                label: 'HRM_Attendance_Pregnancy_IsOvertime',
                disable: false,
                refresh: false,
                value: false,
                visibleConfig: true,
                visible: true
            },
            IsNotSubmitDoc: {
                label: 'HRM_Attendance_Pregnancy_IsNotSubmitDoc',
                disable: false,
                refresh: false,
                value: false,
                visibleConfig: true,
                visible: true
            },
            IsAdjustment: {
                label: 'HRM_Attendance_Pregnancy_IsAdjustment',
                disable: false,
                refresh: false,
                value: false,
                visibleConfig: true,
                visible: true
            },
            FileAttach: {
                label: 'HRM_Rec_JobVacancy_FileAttachment',
                visible: true,
                visibleConfig: true,
                disable: true,
                refresh: false,
                value: null
            },
            Comment: {
                label: 'HRM_Attendance_Pregnancy_Comment',
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            },
            UserApproveID: {
                label: 'HRM_Attendance_TAMScanLog_UserApproveID',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            UserApproveID2: {
                label: 'HRM_Attendance_TAMScanLog_UserApproveID3',
                disable: false,
                refresh: false,
                value: null,
                visible: false,
                visibleConfig: true
            },
            UserApproveID3: {
                label: 'HRM_Attendance_TAMScanLog_UserApproveID4',
                disable: false,
                refresh: false,
                value: null,
                visible: false,
                visibleConfig: true
            },
            UserApproveID4: {
                label: 'HRM_Attendance_TAMScanLog_UserApproveID2',
                disable: false,
                visible: true,
                refresh: false,
                value: null,
                visibleConfig: true
            },
            fieldValid: {},
            isShowUsersApprove: false,
            dataError: null,
            modalErrorDetail: {
                isModalVisible: false,
                cacheID: null,
                data: []
            },
            PregnancyCycleID: {
                label: 'HRM_Attendance_Leaveday_PregnancyCycleName',
                data: [],
                disable: false,
                refresh: false,
                value: null,
                visible: false,
                visibleConfig: true
            }
        };

        //set title screen
        const { typePrenancySelected } = props.navigation.state.params;
        let keyCreate = 'HRM_Attendance_Pregnancy_AddNew';
        if (typePrenancySelected && typePrenancySelected.Value) {
            keyCreate = typePrenancySelected.Value;
        }
        props.navigation.setParams({
            title:
                props.navigation.state.params && props.navigation.state.params.record
                    ? 'HRM_Attendance_Pregnancy_Update'
                    : keyCreate
        });

        //biến trạng thái
        this.isModify = false;
        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;
        this.isChangeLevelApprove = null;
        this.levelApprovePregnancyRegister = null;
        this.dataMidApprove = [];
        this.dataLastApprove = [];
        this.UserSubmitIDForEdit = null;
        this.layoutViewUsersApprove = null;
        this.scrollViewRef = null;
        this.IsContinueSave = false;
        this.ProfileRemoveIDs = null;
        this.IsRemoveAndContinue = null;
        this.CacheID = null;
    }

    //#region [khởi tạo - lấy các dữ liệu cho control, lấy giá trị mặc đinh]

    refreshView = () => {
        this.props.navigation.setParams({ title: 'HRM_Attendance_Pregnancy_AddNew' });

        //biến trạng thái
        this.isModify = null;
        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;
        this.isChangeLevelApprove = null;
        this.levelApprovePregnancyRegister = null;
        this.dataMidApprove = [];
        this.dataLastApprove = [];
        this.UserSubmitIDForEdit = null;
        this.layoutViewUsersApprove = null;
        this.scrollViewRef = null;
        this.IsContinueSave = false;
        this.ProfileRemoveIDs = null;
        this.IsRemoveAndContinue = null;
        this.CacheID = null;

        this.setState(
            {
                ID: null,
                Profile: {
                    label: 'HRM_Attendance_Leaveday_ProfileID',
                    ID: null,
                    ProfileName: '',
                    disable: true
                },
                Type: {
                    label: 'HRM_Attendance_Pregnancy_Type',
                    data: [],
                    disable: false,
                    refresh: false,
                    value: null,
                    visible: true,
                    visibleConfig: true
                },
                divTypePregnancyEarly: {
                    label: 'HRM_Attendance_Pregnancy_TypePregnancyEarlyView',
                    visible: false,
                    TypePregnancyEarlyShift: {
                        label: 'HRM_Attendance_Pregnancy_TypePregnancyEarlyShift',
                        disable: false,
                        refresh: false,
                        value: false,
                        visibleConfig: false,
                        visible: false
                    },
                    IsLateIn: {
                        label: 'HRM_Attendance_WorkDay_LateDuration',
                        disable: false,
                        refresh: false,
                        value: false,
                        visibleConfig: true,
                        visible: true
                    },
                    IsEarlyMidOut: {
                        label: 'HRM_Attendance_Pregnancy_IsEarlyMidOut',
                        disable: false,
                        refresh: false,
                        value: false,
                        visibleConfig: true,
                        visible: true
                    },
                    IsLateMidIn: {
                        label: 'HRM_Attendance_Pregnancy_IsLateMidIn',
                        disable: false,
                        refresh: false,
                        value: false,
                        visibleConfig: true,
                        visible: true
                    },
                    IsEarlyOut: {
                        label: 'HRM_Category_Shift_IsFlast',
                        disable: false,
                        refresh: false,
                        value: false,
                        visibleConfig: true,
                        visible: true
                    }
                },
                ChildName: {
                    label: 'HRM_Attendance_Pregnancy_ChildName',
                    data: [],
                    disable: false,
                    value: null,
                    refresh: false,
                    visibleConfig: true,
                    visible: true
                },
                DatePregnacy: {
                    label: 'HRM_Attendance_Pregnancy_DatePregnacy',
                    value: null,
                    refresh: false,
                    disable: false,
                    visibleConfig: true,
                    visible: true
                },
                ChildBirthday: {
                    label: 'HRM_Attendance_Pregnancy_DateOfBirth',
                    value: null,
                    refresh: false,
                    disable: true,
                    visibleConfig: true,
                    visible: true
                },
                YearOfLose: {
                    label: 'HRM_Attendance_Pregnancy_YearOfLose',
                    value: null,
                    refresh: false,
                    disable: true,
                    visibleConfig: true,
                    visible: true
                },
                ChildCareCompUsedTo: {
                    label: 'HRM_Attendance_Pregnancy_ChildCareCompUsedTo',
                    value: null,
                    refresh: false,
                    disable: false,
                    visibleConfig: true,
                    visible: true
                },
                DateStart: {
                    label: 'HRM_HR_Profile_DateOfEffect',
                    value: null,
                    refresh: false,
                    disable: false,
                    visibleConfig: true,
                    visible: true
                },
                DateEnd: {
                    label: 'HRM_HR_Profile_DateOfEffect',
                    value: null,
                    refresh: false,
                    disable: false,
                    visibleConfig: true,
                    visible: true
                },
                IsOvertime: {
                    label: 'HRM_Attendance_Pregnancy_IsOvertime',
                    disable: false,
                    refresh: false,
                    value: false,
                    visibleConfig: true,
                    visible: true
                },
                IsNotSubmitDoc: {
                    label: 'HRM_Attendance_Pregnancy_IsNotSubmitDoc',
                    disable: false,
                    refresh: false,
                    value: false,
                    visibleConfig: true,
                    visible: true
                },
                IsAdjustment: {
                    label: 'HRM_Attendance_Pregnancy_IsAdjustment',
                    disable: false,
                    refresh: false,
                    value: false,
                    visibleConfig: true,
                    visible: true
                },
                FileAttach: {
                    label: 'HRM_Rec_JobVacancy_FileAttachment',
                    visible: true,
                    visibleConfig: true,
                    disable: true,
                    refresh: false,
                    value: null
                },
                Note: {
                    label: 'HRM_Attendance_Pregnancy_Comment',
                    disable: false,
                    value: '',
                    refresh: false,
                    visibleConfig: true,
                    visible: true
                },
                UserApproveID: {
                    label: 'HRM_Attendance_TAMScanLog_UserApproveID',
                    disable: false,
                    refresh: false,
                    value: null,
                    visible: true,
                    visibleConfig: true
                },
                UserApproveID2: {
                    label: 'HRM_Attendance_TAMScanLog_UserApproveID3',
                    disable: false,
                    refresh: false,
                    value: null,
                    visible: false,
                    visibleConfig: true
                },
                UserApproveID3: {
                    label: 'HRM_Attendance_TAMScanLog_UserApproveID4',
                    disable: false,
                    refresh: false,
                    value: null,
                    visible: false,
                    visibleConfig: true
                },
                UserApproveID4: {
                    label: 'HRM_Attendance_TAMScanLog_UserApproveID2',
                    disable: false,
                    visible: true,
                    refresh: false,
                    value: null,
                    visibleConfig: true
                },
                fieldValid: {},
                isShowUsersApprove: false,
                dataError: null,
                modalErrorDetail: {
                    isModalVisible: false,
                    cacheID: null,
                    data: []
                }
            },
            () => this.getConfigValid('Att_PregnancyRegister')
        );
    };

    //promise get config valid
    getConfigValid = tblName => {
        return HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName);
    };

    componentDidMount() {
        //get config validate
        VnrLoadingSevices.show();
        this.getConfigValid('Att_PregnancyRegister').then(res => {
            VnrLoadingSevices.hide();
            if (res) {
                try {
                    //map field hidden by config
                    const _configField =
                        ConfigField && ConfigField.value['AttSubmitPregnancyAddOrEdit']
                            ? ConfigField.value['AttSubmitPregnancyAddOrEdit']['Hidden']
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

                        let { record, typePrenancySelected } = this.props.navigation.state.params;

                        //get config khi đăng ký
                        if (!record) {
                            this.initData(typePrenancySelected);
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
    }

    initData = typePrenancySelected => {
        const { E_ProfileID, E_FullName } = enumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] },
            { Profile, Type } = this.state;
        let nextState = this.handlePickerTypeSelect(typePrenancySelected);

        nextState = {
            ...nextState,
            Profile: {
                ...Profile,
                ..._profile
            },
            Type: {
                ...Type,
                value: typePrenancySelected,
                refresh: !Type.refresh
            }
        };

        this.setState(nextState, () => {
            this.GetHighSupervior();
            this.getRelativeChild();
            this.getDataType();
            let str = typePrenancySelected && typePrenancySelected.value ? typePrenancySelected.value.Value : null;
            if (!str || str == 'E_NEW_BORN_CHILD' || str == 'E_CHILDCARECOMPENSATION') {
                this.setDateStartDefault();
            }
        });
    };

    getDataType = () => {
        HttpService.Get('[URI_SYS]/Sys_GetData/GetEnumForAtt?text=PregnancyTypeRegister&filterConfig=E_PORTAL').then(
            res => {
                if (res) {
                    const { Type } = this.state;
                    this.setState({
                        Type: {
                            ...Type,
                            data: res,
                            refresh: !Type.refresh
                        }
                    });
                }
            }
        );
    };

    getRelativeChild = () => {
        const { Type, Profile, ChildName } = this.state,
            type = Type.value ? Type.value.Value : null,
            profileId = Profile.ID;

        if (profileId && type && (type == 'E_NEW_BORN_CHILD' || type == 'E_CHILDCARECOMPENSATION')) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Hre_GetData/GetRelativeChildByProfileID', { ProfileID: profileId }).then(
                dataResult => {
                    VnrLoadingSevices.hide();

                    if (dataResult) {
                        if (dataResult.length == 1) {
                            this.setState({
                                ChildName: {
                                    ...ChildName,
                                    data: [...dataResult],
                                    value: dataResult[0],
                                    refresh: !ChildName.refresh
                                }
                            });
                        } else {
                            this.setState({
                                ChildName: {
                                    ...ChildName,
                                    data: [...dataResult],
                                    refresh: !ChildName.refresh
                                }
                            });
                        }
                    }
                }
            );
        } else {
            this.setState({
                ChildName: {
                    ...ChildName,
                    data: [],
                    value: null,
                    refresh: !ChildName.refresh
                }
            });
        }
    };

    handleShowHideFromType = (item, __nextState) => {
        const {
            Type,
            ChildBirthday,
            // divTypePregnancyEarly,
            TypePregnancyEarly,
            ChildCareCompUsedTo,
            ChildName,
            DatePregnacy
        } = __nextState;
        // {
        //   TypePregnancyEarlyShift,
        //   IsLateIn,
        //   IsEarlyMidOut,
        //   IsLateMidIn,
        //   IsEarlyOut
        // } = divTypePregnancyEarly;

        let nextState = {
                Type: {
                    ...Type,
                    value: item,
                    refresh: !Type.refresh
                }
            },
            str = item ? item.Value : null;
        if (str === 'E_LEAVE_EARLY') {
            //Đi trễ / về sớm
            nextState = {
                ...nextState,
                // divTypePregnancyEarly: {
                //   ...divTypePregnancyEarly,
                //   visible: true
                // },
                TypePregnancyEarly: {
                    ...TypePregnancyEarly,
                    visible: true,
                    refresh: !TypePregnancyEarly.refresh
                },
                ChildCareCompUsedTo: {
                    ...ChildCareCompUsedTo,
                    visible: true
                },
                ChildName: {
                    ...ChildName,
                    visible: true
                },
                DatePregnacy: {
                    ...DatePregnacy,
                    visible: true
                },
                ChildBirthday: {
                    ...ChildBirthday,
                    visible: true
                }
            };
        } else if (str === 'E_NEW_BORN_CHILD') {
            nextState = {
                ...nextState,
                ChildCareCompUsedTo: {
                    ...ChildCareCompUsedTo,
                    visible: false
                },
                // divTypePregnancyEarly: {
                //   ...divTypePregnancyEarly,
                //   visible: true
                // },
                TypePregnancyEarly: {
                    ...TypePregnancyEarly,
                    visible: true,
                    refresh: !TypePregnancyEarly.refresh
                },
                ChildName: {
                    ...ChildName,
                    visible: true
                },
                DatePregnacy: {
                    ...DatePregnacy,
                    visible: true
                },
                ChildBirthday: {
                    ...ChildBirthday,
                    visible: true
                }
            };
        } else if (str === 'E_Old') {
            nextState = {
                ...nextState,
                ChildCareCompUsedTo: {
                    ...ChildCareCompUsedTo,
                    visible: false
                },
                ChildName: {
                    ...ChildName,
                    visible: false
                },
                DatePregnacy: {
                    ...DatePregnacy,
                    visible: false
                },
                ChildBirthday: {
                    ...ChildBirthday,
                    visible: false
                },
                TypePregnancyEarly: {
                    ...TypePregnancyEarly,
                    visible: true,
                    refresh: !TypePregnancyEarly.refresh
                }
                // divTypePregnancyEarly: {
                //   ...divTypePregnancyEarly,
                //   visible: true
                // },
            };
        } else if (str === 'E_CHILDCARECOMPENSATION') {
            nextState = {
                ...nextState,
                // divTypePregnancyEarly: {
                //   ...divTypePregnancyEarly,
                //   visible: false,
                //   TypePregnancyEarlyShift: {
                //     ...TypePregnancyEarlyShift,
                //     value: false
                //   },
                //   IsLateIn: {
                //     ...IsLateIn,
                //     visible: true,
                //     value: false
                //   },
                //   IsEarlyMidOut: {
                //     ...IsEarlyMidOut,
                //     visible: true,
                //     value: false
                //   },
                //   IsLateMidIn: {
                //     ...IsLateMidIn,
                //     visible: true,
                //     value: false
                //   },
                //   IsEarlyOut: {
                //     ...IsEarlyOut,
                //     visible: true,
                //     value: false
                //   }
                // },
                TypePregnancyEarly: {
                    ...TypePregnancyEarly,
                    visible: false,
                    refresh: !TypePregnancyEarly.refresh
                },
                ChildCareCompUsedTo: {
                    ...ChildCareCompUsedTo,
                    visible: true
                },
                DatePregnacy: {
                    ...DatePregnacy,
                    visible: true
                },
                ChildBirthday: {
                    ...ChildBirthday,
                    visible: true
                },
                ChildName: {
                    ...ChildName,
                    visible: true
                }
            };
        } else if (str === 'E_MATERNITY_UP_7MONTHS') {
            nextState = {
                ...nextState,
                // divTypePregnancyEarly: {
                //   ...divTypePregnancyEarly,
                //   visible: false
                // },
                ChildCareCompUsedTo: {
                    ...ChildCareCompUsedTo,
                    visible: false
                },
                ChildName: {
                    ...ChildName,
                    visible: false
                },
                ChildBirthday: {
                    ...ChildBirthday,
                    visible: false
                },
                TypePregnancyEarly: {
                    ...TypePregnancyEarly,
                    visible: true,
                    refresh: !TypePregnancyEarly.refresh
                }
                // divTypePregnancyEarly: {
                //   ...divTypePregnancyEarly,
                //   visible: false,
                //   TypePregnancyEarlyShift: {
                //     ...TypePregnancyEarlyShift,
                //     value: false
                //   },
                //   IsLateIn: {
                //     ...IsLateIn,
                //     visible: true,
                //     value: false
                //   },
                //   IsEarlyMidOut: {
                //     ...IsEarlyMidOut,
                //     visible: true,
                //     value: false
                //   },
                //   IsLateMidIn: {
                //     ...IsLateMidIn,
                //     visible: true,
                //     value: false
                //   },
                //   IsEarlyOut: {
                //     ...IsEarlyOut,
                //     visible: true,
                //     value: false
                //   }
                // }
            };
        } else if (str === 'E_MATERNITY_UNDER_7MONTHS') {
            nextState = {
                ...nextState,
                // divTypePregnancyEarly: {
                //   ...divTypePregnancyEarly,
                //   visible: false
                // },
                TypePregnancyEarly: {
                    ...TypePregnancyEarly,
                    visible: true,
                    refresh: !TypePregnancyEarly.refresh
                },
                ChildCareCompUsedTo: {
                    ...ChildCareCompUsedTo,
                    visible: false
                },
                ChildName: {
                    ...ChildName,
                    visible: false
                },
                ChildBirthday: {
                    ...ChildBirthday,
                    visible: false
                }
                // divTypePregnancyEarly: {
                //   ...divTypePregnancyEarly,
                //   visible: false,
                //   TypePregnancyEarlyShift: {
                //     ...TypePregnancyEarlyShift,
                //     value: false
                //   },
                //   IsLateIn: {
                //     ...IsLateIn,
                //     visible: true,
                //     value: false
                //   },
                //   IsEarlyMidOut: {
                //     ...IsEarlyMidOut,
                //     visible: true,
                //     value: false
                //   },
                //   IsLateMidIn: {
                //     ...IsLateMidIn,
                //     visible: true,
                //     value: false
                //   },
                //   IsEarlyOut: {
                //     ...IsEarlyOut,
                //     visible: true,
                //     value: false
                //   }
                // }
            };
        }

        return nextState;
    };

    handleSetState = (record, resAll) => {
        let nextState = {};

        const {
                Profile,
                Type,
                TypePregnancyEarly,
                ChildName,
                DatePregnacy,
                ChildBirthday,
                YearOfLose,
                ChildCareCompUsedTo,
                DateStart,
                DateEnd,
                IsOvertime,
                IsNotSubmitDoc,
                IsAdjustment,
                FileAttach,
                Comment,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4,
                PregnancyCycleID
            } = this.state,
            levelApprovePregnancyRegister = resAll[0],
            dataPrenancy = resAll[1],
            item = resAll[2],
            dataRelativeChild = resAll[4],
            dataPregnacyProcess = resAll[3];

        this.levelApprovePregnancyRegister = levelApprovePregnancyRegister;
        this.UserSubmitIDForEdit = item.UserSubmitID;

        let dataSourceRelativeChild = [],
            valRelativeChild = item.ChildName
                ? { ID: moment().format('YYYYMMDDHHmmssms'), RelativeName: item.ChildName }
                : null;

        if (dataRelativeChild) {
            dataSourceRelativeChild =
                dataRelativeChild && Array.isArray(dataRelativeChild) ? [...dataRelativeChild] : [dataRelativeChild];
        }

        if (valRelativeChild) {
            valRelativeChild = dataSourceRelativeChild.find(itemChild => itemChild.RelativeName == item.ChildName);
            // if (!childIsExist) {
            //   dataSourceRelativeChild = [
            //     valRelativeChild,
            //     ...dataSourceRelativeChild
            //   ]
            // }
        }

        let valTypePregnancyEarly = [];
        if (item.TypePregnancyEarly) {
            valTypePregnancyEarly = item.TypePregnancyEarly.split(',').map(item => {
                return { Value: item, Text: translate('PregnancyLeaveEarlyType__' + item) };
            });
        }

        nextState = {
            ...this.state,
            ID: record.ID,
            Profile: {
                ...Profile,
                ID: item.ProfileID,
                ProfileName: item.ProfileName
            },
            TypePregnancyEarly: {
                ...TypePregnancyEarly,
                value: valTypePregnancyEarly, //item.TypePregnancyEarly,
                refresh: !TypePregnancyEarly.refresh
            },
            IsOvertime: {
                ...IsOvertime,
                value: item.IsOvertime
            },
            IsNotSubmitDoc: {
                ...IsNotSubmitDoc,
                value: item.IsNotSubmitDoc
            },
            IsAdjustment: {
                ...IsAdjustment,
                value: item.IsAdjustment
            },
            Type: {
                ...Type,
                data: dataPrenancy ? [...dataPrenancy] : [],
                value: item.Type ? { Value: item.Type, Text: item.TypeView } : null,
                disable: false,
                refresh: !Type.refresh,
                visible: true
            },
            FileAttach: {
                ...FileAttach,
                value: item.lstFileAttach,
                refresh: !FileAttach.refresh
            },
            DatePregnacy: {
                ...DatePregnacy,
                value: item.DatePregnacy ? moment(item.DatePregnacy).format('YYYY-MM-DD HH:mm:ss') : null,
                disable: false,
                refresh: !DatePregnacy.refresh
            },
            ChildBirthday: {
                ...ChildBirthday,
                value: item.ChildBirthday ? moment(item.ChildBirthday).format('YYYY-MM-DD HH:mm:ss') : null,
                disable: false,
                refresh: !ChildBirthday.refresh
            },
            YearOfLose: {
                ...YearOfLose,
                value: item.YearOfLose ? moment(item.YearOfLose).format('YYYY-MM-DD HH:mm:ss') : null,
                disable: false,
                refresh: !YearOfLose.refresh
            },
            ChildCareCompUsedTo: {
                ...ChildCareCompUsedTo,
                value: item.ChildCareCompUsedTo ? moment(item.ChildCareCompUsedTo).format('YYYY-MM-DD HH:mm:ss') : null,
                disable: false,
                refresh: !ChildCareCompUsedTo.refresh
            },
            DateStart: {
                ...DateStart,
                value: item.DateStart ? moment(item.DateStart).format('YYYY-MM-DD HH:mm:ss') : null,
                disable: false,
                refresh: !DateStart.refresh
            },
            DateEnd: {
                ...DateEnd,
                value: item.DateEnd ? moment(item.DateEnd).format('YYYY-MM-DD HH:mm:ss') : null,
                disable: false,
                refresh: !DateEnd.refresh
            },
            Comment: {
                ...Comment,
                value: item.Comment,
                disable: false,
                refresh: !Comment.refresh
            },
            ChildName: {
                ...ChildName,
                value: valRelativeChild,
                data: dataSourceRelativeChild,
                disable: false,
                refresh: !ChildName.refresh
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

        if (item.PregnancyCycleID && Array.isArray(dataPregnacyProcess)) {
            dataPregnacyProcess.map(value => {
                if (value.ID === item.PregnancyCycleID) {
                    nextState = {
                        ...nextState,
                        PregnancyCycleID: {
                            ...PregnancyCycleID,
                            value: value,
                            visibleConfig: true,
                            visible: true,
                            refresh: !PregnancyCycleID.refresh
                        }
                    };
                }
            });
        }

        nextState = {
            ...nextState,
            ...this.handleShowHideFromType({ Value: item.Type, Text: item.TypeView }, nextState)
        };

        if (this.levelApprovePregnancyRegister == 4) {
            // $('#divMidApprove').removeClass('hide');
            // $('#divMidNextApprove').removeClass('hide');
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
        } else if (this.levelApprovePregnancyRegister == 3) {
            // $('#divMidApprove').removeClass('hide');
            // $('#divMidNextApprove').addClass('hide');
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
            // $('#divMidApprove').addClass('hide');
            // $('#divMidNextApprove').addClass('hide');
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

        // if (item.Type == 'E_LEAVE_EARLY' || item.Type == 'E_NEW_BORN_CHILD' || item.Type == 'E_Old') {
        //   if (item.TypePregnancyEarlyShift) {
        //     nextState = {
        //       ...nextState,
        //       TypePregnancyEarly: {
        //         ...TypePregnancyEarly,
        //         visible: true,
        //         refresh: !TypePregnancyEarly.refresh
        //       }
        //     };
        //   }
        // }
        // else {
        //   nextState = {
        //     ...nextState,
        //     TypePregnancyEarly: {
        //       ...TypePregnancyEarly,
        //       visible: false,
        //       refresh: !TypePregnancyEarly.refresh
        //     }
        //   }
        // }

        this.setState(nextState, () => {
            const { Type } = this.state;
            let nextState = this.handlePickerTypeSelect(Type);
            this.setState(nextState);
        });
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        const { ID, ProfileID } = record;

        let arrRequest = [
            HttpService.Post('[URI_HR]//Att_GetData/GetLevelApprovePregnancyRegister', { ProfileID }),
            HttpService.Get('[URI_SYS]/Sys_GetData/GetEnumForAtt?text=PregnancyTypeRegister&filterConfig=E_PORTAL'),
            HttpService.Get('[URI_HR]/Att_GetData/New_GetAttPregnancyRegisterByID?ID=' + ID),
            HttpService.Post('[URI_HR]/Att_GetData/GetPregnancyCycleControl', {
                ProfileID: ProfileID,
                DateStart: new Date(moment(record.DateStart).format('YYYY/MM/DD')).toDateString(),
                DateEnd: new Date(moment(record.DateEnd).format('YYYY/MM/DD')).toDateString()
            })
        ];

        VnrLoadingSevices.show();
        HttpService.MultiRequest(arrRequest).then(resAll => {
            VnrLoadingSevices.hide();
            try {
                this.GetRelativeChildByProfileID(_handleSetState, record, resAll);
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };
    //#endregion

    GetRelativeChildByProfileID = (_handleSetState, record, resAll) => {
        const item = resAll[2],
            { Type } = item,
            { ProfileID } = record;

        if (Type == 'E_NEW_BORN_CHILD' || Type == 'E_CHILDCARECOMPENSATION') {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Hre_GetData/GetRelativeChildByProfileID', { ProfileID }).then(data => {
                VnrLoadingSevices.hide();
                if (data) {
                    resAll = [...resAll, data];
                }
                _handleSetState(record, resAll);
            });
        } else {
            _handleSetState(record, resAll);
        }
    };

    GetHighSupervior = () => {
        const { Profile, UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4 } = this.state;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]//Att_GetData/GetHighSupervisor', {
            ProfileID: Profile.ID,
            userSubmit: Profile.ID,
            type: 'E_PREGNANCYREGISTER'
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
                if (result.IsChangeApprove != true) {
                    // multiUserApproveID.enable(false);
                    // multiUserApproveID2.enable(false);
                    // multiUserApproveID3.enable(false);
                    // multiUserApproveID4.enable(false);
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
                    // multiUserApproveID.enable(true);
                    // multiUserApproveID2.enable(true);
                    // multiUserApproveID3.enable(true);
                    // multiUserApproveID4.enable(true);
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

                this.levelApprovePregnancyRegister = result.LevelApprove;

                if (result.LevelApprove == 2) {
                    if (result.IsOnlyOneLevelApprove) {
                        this.levelApprovePregnancyRegister = 1;
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
                            // checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                            nextState = {
                                ...nextState,
                                UserApproveID: {
                                    ...nextState.UserApproveID,
                                    value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                }
                            };
                        } else if (!this.isModify) {
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
                        // checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                        nextState = {
                            ...nextState,
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                            }
                        };
                    } else {
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
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                value: { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }
                            },
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }
                            }
                        };
                    } else if (!this.isModify) {
                        // multiUserApproveID2.value(null);
                        // multiUserApproveID4.value(null);
                        nextState = {
                            ...nextState,
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

                    // isShowEle('#' + divControl3, true);
                    // isShowEle('#' + divControl4);

                    nextState = {
                        ...nextState,
                        UserApproveID2: {
                            ...nextState.UserApproveID3,
                            visible: true
                        },
                        UserApproveID3: {
                            ...nextState.UserApproveID4,
                            visible: false
                        }
                    };
                } else if (result.LevelApprove == 4) {
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
                    } else {
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
                        nextState = {
                            ...nextState,
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
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
                        // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
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

        //nếu 1 cấp duyệt mới chạy
        if (this.levelApprovePregnancyRegister == 1) {
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
        if (this.levelApprovePregnancyRegister == 1) {
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
        } else if (this.levelApprovePregnancyRegister == 2) {
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
        } else if (this.levelApprovePregnancyRegister == 3) {
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

    handlePickerTypeSelect = item => {
        const {
            DateStart,
            DateEnd,
            ChildBirthday,
            TypePregnancyEarly,
            ChildCareCompUsedTo,
            ChildName,
            DatePregnacy,
            YearOfLose
        } = this.state;

        let nextState = {},
            str = item ? item.Value : null;

        if (!str) {
            str = item && item.value ? item.value.Value : null;
        }

        if (str == 'E_LEAVE_EARLY') {
            // $("#divTypePregnancyEarly").removeClass('hide');
            // $("#divChildren").hide();
            // $('#divDatePregnacy').show();
            // $('#divEstimateDueDate').show();
            // $('#divChildBirthday').hide();
            // $('#divYearOfLose').hide();
            // $('#dateChildCareCompUsedTo').hide();
            // $('#divComment').insertAfter($('#divUserApproveID4'));
            // $('#dvFileAttachment').insertAfter($('#divComment'));
            nextState = {
                TypePregnancyEarly: {
                    ...TypePregnancyEarly,
                    visible: true,
                    refresh: !TypePregnancyEarly.refresh
                },
                ChildName: {
                    ...ChildName,
                    visible: false,
                    refresh: !ChildName.refresh
                },
                DatePregnacy: {
                    ...DatePregnacy,
                    visible: true,
                    refresh: !DatePregnacy.refresh
                },
                ChildBirthday: {
                    ...ChildBirthday,
                    visible: false,
                    refresh: !ChildBirthday.refresh
                },
                YearOfLose: {
                    ...YearOfLose,
                    visible: false,
                    refresh: !YearOfLose.refresh
                },
                ChildCareCompUsedTo: {
                    ...ChildCareCompUsedTo,
                    visible: false,
                    refresh: !ChildCareCompUsedTo.refresh
                }
            };
        } else if (str == 'E_MATERNITY_UNDER_7MONTHS' || str == 'E_MATERNITY_UP_7MONTHS') {
            // $("#divTypePregnancyEarly").addClass('hide');
            // $("#divChildren").hide();
            // $('#divDatePregnacy').show();
            // $('#divEstimateDueDate').show();
            // $('#divChildBirthday').hide();
            // $('#divYearOfLose').hide();
            // $('#dateChildCareCompUsedTo').hide();
            // $('#divComment').insertAfter($('#divDateEffective'));
            // $('#dvFileAttachment').insertAfter($('#divComment'));
            nextState = {
                TypePregnancyEarly: {
                    ...TypePregnancyEarly,
                    visible: true,
                    refresh: !TypePregnancyEarly.refresh
                },
                ChildName: {
                    ...ChildName,
                    visible: false,
                    refresh: !ChildName.refresh
                },
                DatePregnacy: {
                    ...DatePregnacy,
                    visible: true,
                    refresh: !DatePregnacy.refresh
                },
                ChildBirthday: {
                    ...ChildBirthday,
                    visible: false,
                    refresh: !ChildBirthday.refresh
                },
                YearOfLose: {
                    ...YearOfLose,
                    visible: false,
                    refresh: !YearOfLose.refresh
                },
                ChildCareCompUsedTo: {
                    ...ChildCareCompUsedTo,
                    visible: false,
                    refresh: !ChildCareCompUsedTo.refresh
                }
            };
        } else if (str == 'E_NEW_BORN_CHILD') {
            // $("#divTypePregnancyEarly").removeClass('hide');
            // $("#divChildren").show();
            // $('#divDatePregnacy').show();
            // $('#divEstimateDueDate').hide();
            // $('#divChildBirthday').show();
            // $('#divYearOfLose').show();
            // $('#dateChildCareCompUsedTo').hide();
            // $('#divComment').insertAfter($('#divUserApproveID4'));
            // $('#dvFileAttachment').insertAfter($('#divComment'));
            nextState = {
                TypePregnancyEarly: {
                    ...TypePregnancyEarly,
                    visible: true,
                    refresh: !TypePregnancyEarly.refresh
                },
                ChildName: {
                    ...ChildName,
                    visible: true,
                    refresh: !ChildName.refresh
                },
                DatePregnacy: {
                    ...DatePregnacy,
                    visible: true,
                    refresh: !DatePregnacy.refresh
                },
                ChildBirthday: {
                    ...ChildBirthday,
                    visible: true,
                    refresh: !ChildBirthday.refresh
                },
                YearOfLose: {
                    ...YearOfLose,
                    visible: true,
                    refresh: !YearOfLose.refresh
                },
                ChildCareCompUsedTo: {
                    ...ChildCareCompUsedTo,
                    visible: false,
                    refresh: !ChildCareCompUsedTo.refresh
                }
            };
        } else if (str == 'E_CHILDCARECOMPENSATION') {
            // $("#divTypePregnancyEarly").addClass('hide');
            // $("#divChildren").show();
            // $('#divDatePregnacy').hide();
            // $('#divEstimateDueDate').hide();
            // $('#divChildBirthday').show();
            // $('#divYearOfLose').show();
            // $('#dateChildCareCompUsedTo').show();
            // $('#divComment').insertAfter($('#divUserApproveID4'));
            // $('#dvFileAttachment').insertAfter($('#divComment'));
            nextState = {
                TypePregnancyEarly: {
                    ...TypePregnancyEarly,
                    visible: false,
                    refresh: !TypePregnancyEarly.refresh
                },
                ChildName: {
                    ...ChildName,
                    visible: true,
                    refresh: !ChildName.refresh
                },
                DatePregnacy: {
                    ...DatePregnacy,
                    visible: false,
                    refresh: !DatePregnacy.refresh
                },
                ChildBirthday: {
                    ...ChildBirthday,
                    visible: true,
                    refresh: !ChildBirthday.refresh
                },
                YearOfLose: {
                    ...YearOfLose,
                    visible: true,
                    refresh: !YearOfLose.refresh
                },
                ChildCareCompUsedTo: {
                    ...ChildCareCompUsedTo,
                    visible: true,
                    refresh: !ChildCareCompUsedTo.refresh
                }
            };
        } else if (str == 'E_Old') {
            // $("#divTypePregnancyEarly").removeClass('hide');
            // $("#divChildren").hide();
            // $('#divDatePregnacy').hide();
            // $('#divEstimateDueDate').hide();
            // $('#divChildBirthday').hide();
            // $('#divYearOfLose').hide();
            // $('#dateChildCareCompUsedTo').hide();
            // $('#divComment').insertAfter($('#divDateEffective'));
            // $('#dvFileAttachment').insertAfter($('#divComment'));
            nextState = {
                TypePregnancyEarly: {
                    ...TypePregnancyEarly,
                    visible: true,
                    refresh: !TypePregnancyEarly.refresh
                },
                ChildName: {
                    ...ChildName,
                    visible: false,
                    refresh: !ChildName.refresh
                },
                DatePregnacy: {
                    ...DatePregnacy,
                    visible: false,
                    refresh: !DatePregnacy.refresh
                },
                ChildBirthday: {
                    ...ChildBirthday,
                    visible: false,
                    refresh: !ChildBirthday.refresh
                },
                YearOfLose: {
                    ...YearOfLose,
                    visible: false,
                    refresh: !YearOfLose.refresh
                },
                ChildCareCompUsedTo: {
                    ...ChildCareCompUsedTo,
                    visible: false,
                    refresh: !ChildCareCompUsedTo.refresh
                }
            };
        } else {
            // $("#divTypePregnancyEarly").addClass('hide');
            // IsCheckFalseAllRadioButton();
            // $("#divChildren").show();
            // $('#divDatePregnacy').show();
            // $('#divEstimateDueDate').show();
            // $('#divChildBirthday').show();
            // $('#divYearOfLose').show();
            // $('#dateChildCareCompUsedTo').show();
            // $('#divComment').insertAfter($('#divUserApproveID4'));
            // $('#dvFileAttachment').insertAfter($('#divComment'));
            nextState = {
                TypePregnancyEarly: {
                    ...TypePregnancyEarly,
                    visible: false,
                    refresh: !TypePregnancyEarly.refresh
                },
                ChildName: {
                    ...ChildName,
                    visible: true,
                    refresh: !ChildName.refresh
                },
                DatePregnacy: {
                    ...DatePregnacy,
                    visible: true,
                    refresh: !DatePregnacy.refresh
                },
                ChildBirthday: {
                    ...ChildBirthday,
                    visible: true,
                    refresh: !ChildBirthday.refresh
                },
                YearOfLose: {
                    ...YearOfLose,
                    visible: true,
                    refresh: !YearOfLose.refresh
                },
                ChildCareCompUsedTo: {
                    ...ChildCareCompUsedTo,
                    visible: true,
                    refresh: !ChildCareCompUsedTo.refresh
                }
            };
        }

        if (str != 'E_NEW_BORN_CHILD' && str != 'E_CHILDCARECOMPENSATION') {
            // $('#ChildCareCompUsedTo').getKendoDatePicker().value('');
            // dEnd.getKendoDatePicker().value('');
            // dStart.getKendoDatePicker().value('');

            nextState = {
                ...nextState,
                ChildCareCompUsedTo: {
                    ...nextState.ChildCareCompUsedTo,
                    value: null,
                    refresh: !ChildCareCompUsedTo.refresh
                },
                DateStart: {
                    ...DateStart,
                    value: this.isModify ? DateStart.value : null,
                    refresh: !DateStart.refresh
                },
                DateEnd: {
                    ...DateEnd,
                    value: this.isModify ? DateEnd.value : null,
                    refresh: !DateEnd.refresh
                }
            };
        } else {
            this.setDateStartDefault();
        }

        return nextState;
    };

    setDateStartDefault = () => {
        const { DateStart } = this.state,
            ID = profileInfo['ProfileID'];

        HttpService.Post('[URI_HR]/Att_GetData/GetDateStartDefault', { profileID: ID }).then(data => {
            if (data) {
                this.setState({
                    DateStart: {
                        ...DateStart,
                        value: data,
                        refresh: !DateStart.refresh
                    }
                });
            }
        });
    };

    fnChangeChild = () => {
        // const { ChildName, DateStart, DateEnd,
        //   ChildCareCompUsedTo, ChildBirthday } = this.state,
        //   relative = ChildName.value ? ChildName.value.ID : null;
        // let nextState = {};
        // if (!relative) {
        //   nextState = {
        //     DateStart: {
        //       ...DateStart,
        //       value: null,
        //       refresh: !DateStart.refresh
        //     },
        //     DateEnd: {
        //       ...DateEnd,
        //       value: null,
        //       refresh: !DateEnd.refresh
        //     },
        //     ChildCareCompUsedTo: {
        //       ...ChildCareCompUsedTo,
        //       value: null,
        //       refresh: !ChildCareCompUsedTo.refresh
        //     },
        //     ChildBirthday: {
        //       ...ChildBirthday,
        //       value: null,
        //       refresh: !ChildBirthday.refresh
        //     }
        //   }
        //   this.setState(nextState, () => this.GetYearOfBirhByRelativeID())
        // }
        // else {
        //   this.GetYearOfBirhByRelativeID();
        // }
    };

    GetYearOfBirhByRelativeID = () => {
        const { ChildName, DateStart, DateEnd, Type, YearOfLose, ChildCareCompUsedTo, ChildBirthday } = this.state,
            relative = ChildName.value ? ChildName.value.ID : null;

        HttpService.Post('[URI_HR]/Hre_GetData/GetYearOfBirhByRelativeID', { relativeid: relative }).then(data => {
            if (data) {
                let typeRegnancy = Type.value ? Type.value.Value : null,
                    yearoflose = YearOfLose.value,
                    nextState = {};

                if (data.YearOfBirth && data.YearOfBirth !== '') {
                    let _splitBirthDay = data.YearOfBirth.indexOf('/') >= 0 ? data.YearOfBirth.split('/') : null,
                        toBirthDayMoment = null;

                    if (_splitBirthDay && _splitBirthDay.length == 3) {
                        let toBirthDay = _splitBirthDay[1] + '/' + _splitBirthDay[0] + '/' + _splitBirthDay[2];
                        toBirthDayMoment = moment(toBirthDay).toDate();
                    }

                    nextState = {
                        ChildBirthday: {
                            ...ChildBirthday,
                            value: toBirthDayMoment,
                            refresh: !ChildBirthday.refresh
                        }
                    };
                    if (typeRegnancy == 'E_NEW_BORN_CHILD') {
                        if (yearoflose) {
                            let dateEndYearOfLose = yearoflose; //new Date(yearoflose);
                            //$('#DateEnd').data('kendoDatePicker').value(dateEndYearOfLose);
                            nextState = {
                                ...nextState,
                                DateEnd: {
                                    ...DateEnd,
                                    value: dateEndYearOfLose,
                                    refresh: !DateEnd.refresh
                                }
                            };
                        } else {
                            let tempDateEnd = toBirthDayMoment; //new Date($('#ChildBirthday').getKendoDatePicker().value());
                            let dateEndNextYear = this.getDateEnd(tempDateEnd);
                            let dateEnd = dateEndNextYear; //new Date(dateEndNextYear);
                            //$('#DateEnd').data('kendoDatePicker').value(dateEnd);

                            nextState = {
                                ...nextState,
                                DateEnd: {
                                    ...DateEnd,
                                    value: dateEnd,
                                    refresh: !DateEnd.refresh
                                }
                            };
                        }
                    } else if (typeRegnancy == 'E_CHILDCARECOMPENSATION') {
                        let tempDateEnd = toBirthDayMoment; //new Date($('#ChildBirthday').getKendoDatePicker().value());
                        if (yearoflose != null) {
                            let dateEndNextYear = this.getDateEnd(tempDateEnd);
                            let dateEnd = dateEndNextYear; //new Date(dateEndNextYear);
                            let dateEndYearOfLose = yearoflose; //new Date(yearoflose);
                            //$('#DateEnd').data('kendoDatePicker').value(dateEndYearOfLose);
                            //$('#ChildCareCompUsedTo').data('kendoDatePicker').value(dateEnd);
                            nextState = {
                                ...nextState,
                                DateEnd: {
                                    ...DateEnd,
                                    value: dateEndYearOfLose,
                                    refresh: !DateEnd.refresh
                                },
                                ChildCareCompUsedTo: {
                                    ...ChildCareCompUsedTo,
                                    value: dateEnd,
                                    refresh: !ChildCareCompUsedTo.refresh
                                }
                            };
                        } else {
                            let dateEndNextYear = this.getDateEnd(tempDateEnd);
                            let dateEnd = dateEndNextYear; //new Date(dateEndNextYear);
                            //$('#DateEnd').data('kendoDatePicker').value(dateEnd);
                            //$('#ChildCareCompUsedTo').data('kendoDatePicker').value(dateEnd);

                            nextState = {
                                ...nextState,
                                DateEnd: {
                                    ...DateEnd,
                                    value: dateEnd,
                                    refresh: !DateEnd.refresh
                                },
                                ChildCareCompUsedTo: {
                                    ...ChildCareCompUsedTo,
                                    value: dateEnd,
                                    refresh: !ChildCareCompUsedTo.refresh
                                }
                            };
                        }
                    }
                } else {
                    nextState = {
                        DateStart: {
                            ...DateStart,
                            value: null,
                            refresh: !DateStart.refresh
                        },
                        DateEnd: {
                            ...DateEnd,
                            value: null,
                            refresh: !DateEnd.refresh
                        }
                    };

                    if (typeRegnancy == 'E_CHILDCARECOMPENSATION') {
                        nextState = {
                            ...nextState,
                            ChildCareCompUsedTo: {
                                ...ChildCareCompUsedTo,
                                value: null,
                                refresh: !ChildCareCompUsedTo.refresh
                            }
                        };
                    }
                }

                this.setState(nextState);
            }
        });
    };

    //Pick Loại chế độ
    onPickType = (item, isNoChangeDate) => {
        const {
            Type,
            TypePregnancyEarly,
            ChildName,
            DatePregnacy,
            ChildBirthday,
            YearOfLose,
            ChildCareCompUsedTo,
            DateStart,
            DateEnd
        } = this.state;

        let nextState = this.handlePickerTypeSelect(item);

        nextState = {
            ...nextState,
            Type: {
                ...Type,
                value: item,
                refresh: !Type.refresh
            },
            ChildName: {
                ...nextState.ChildName,
                value: null,
                refresh: !ChildName.refresh
            },
            DatePregnacy: {
                ...nextState.DatePregnacy,
                value: null,
                refresh: !DatePregnacy.refresh
            },
            ChildBirthday: {
                ...nextState.ChildBirthday,
                value: null,
                refresh: !ChildBirthday.refresh
            },
            YearOfLose: {
                ...nextState.YearOfLose,
                value: null,
                refresh: !YearOfLose.refresh
            },
            ChildCareCompUsedTo: {
                ...nextState.ChildCareCompUsedTo,
                value: null,
                refresh: !ChildCareCompUsedTo.refresh
            },
            DateStart: {
                ...(nextState.DateStart ? nextState.DateStart : DateStart),
                value: isNoChangeDate ? DateStart.value : null,
                refresh: !DateStart.refresh
            },
            DateEnd: {
                ...(nextState.DateEnd ? nextState.DateEnd : DateEnd),
                value: isNoChangeDate ? DateEnd.value : null,
                refresh: !DateEnd.refresh
            },
            TypePregnancyEarly: {
                ...nextState.TypePregnancyEarly,
                value: null,
                refresh: !TypePregnancyEarly.refresh
            }
        };

        this.setState(nextState, () => {
            this.getRelativeChild();

            // let str = item ? item.Value : null;
            // if (!str || str == 'E_NEW_BORN_CHILD' || str == 'E_CHILDCARECOMPENSATION') {
            //   this.setDateStartDefault();
            // }
            // else {
            //   //this.fnChangeChild();
            // }
        });
    };

    IsCheckFalseAllRadioButton = () => {
        // $(frm + ' #TypePregnancyEarlyShift').prop('checked', false);
        // $(frm + ' #IsLateIn').prop('checked', false);
        // $(frm + ' #IsEarlyMidOut').prop('checked', false);
        // $(frm + ' #IsLateMidIn').prop('checked', false);
        // $(frm + ' #IsEarlyOut').prop('checked', false);
        // $("#divLateEarlyMInOut").removeClass('hide');
    };

    //change ChildBirthday - Ngày sinh
    onChangeChildBirthday = value => {
        const { ChildBirthday } = this.state;
        let nextState = {
            ChildBirthday: {
                ...ChildBirthday,
                value: value,
                refresh: !ChildBirthday.refresh
            }
        };

        this.setState(nextState, () => this.checkIsAllowChildUnder1YearOld());
    };

    //change ChildBirthday - Ngày mất
    onChangeYearOfLose = value => {
        const { YearOfLose } = this.state;
        let nextState = {
            YearOfLose: {
                ...YearOfLose,
                value: value,
                refresh: !YearOfLose.refresh
            }
        };

        this.setState(nextState, () => this.ChangeYearofLose());
    };

    ChangeYearofLose = () => {
        const { YearOfLose, DateEnd } = this.state;

        if (!YearOfLose.value) {
            this.checkIsAllowChildUnder1YearOld();
        } else {
            this.setState({
                DateEnd: {
                    ...DateEnd,
                    value: YearOfLose.value,
                    refresh: !DateEnd.refresh
                }
            });
        }
        // if (yearofLoseAfer) {

        //   return;
        // }
        // else {
        //   GetChildBirthdayAndDateEnd();
        // }
    };

    checkIsAllowChildUnder1YearOld = () => {
        const { ChildBirthday, Type, DateStart, DateEnd, ChildCareCompUsedTo } = this.state;
        let tmpChild = 'HRM_ATT_OT_ISALLOWCHILDUNDER1YEAROLD',
            IsAllowChildUnder1YearOld = false,
            pregnancytype = Type.value ? Type.value.Value : null,
            nextState = {};

        if (ChildBirthday.value == null) {
            nextState = {
                DateStart: {
                    ...DateStart,
                    value: null,
                    refresh: !DateStart.refresh
                },
                DateEnd: {
                    ...DateEnd,
                    value: null,
                    refresh: !DateEnd.refresh
                }
            };

            this.setState(nextState);
        } else if (pregnancytype == 'E_NEW_BORN_CHILD') {
            HttpService.Post('[URI_HR]/Att_GetData/GetSysAllSettingByName', { Name: tmpChild }).then(data => {
                if (data != null) {
                    if (data.Value1 == 'True') {
                        IsAllowChildUnder1YearOld = true;
                    }
                    if (IsAllowChildUnder1YearOld == false) {
                        nextState = {
                            DateEnd: {
                                ...DateEnd,
                                value: moment(ChildBirthday.value)
                                    .add(12, 'month')
                                    .add(-1, 'day'),
                                refresh: !DateEnd.refresh
                            }
                        };

                        this.setState(nextState);
                    }
                }
            });
        } else if (pregnancytype == 'E_CHILDCARECOMPENSATION') {
            nextState = {
                DateEnd: {
                    ...DateEnd,
                    value: moment(ChildBirthday.value)
                        .add(12, 'month')
                        .add(-1, 'day'),
                    refresh: !DateEnd.refresh
                },
                ChildCareCompUsedTo: {
                    ...ChildCareCompUsedTo,
                    value: moment(ChildBirthday.value)
                        .add(12, 'month')
                        .add(-1, 'day'),
                    refresh: !ChildCareCompUsedTo.refresh
                }
            };
            this.setState(nextState);
        } else if (pregnancytype == 'E_LEAVE_EARLY') {
            let getDateEnd = this.getDateEnd(ChildBirthday.value);
            nextState = {
                ...nextState,
                DateEnd: {
                    ...DateEnd,
                    value: getDateEnd,
                    refresh: !DateEnd.refresh
                }
            };

            this.setState(nextState);
        }
    };

    ReadOnlyControl = isRedonly => {
        const { ChildName, ChildCareCompUsedTo, ChildBirthday, DateEnd, DatePregnacy } = this.state;
        let nextState = {
            ChildName: {
                ...ChildName,
                disable: isRedonly,
                value: null,
                refresh: !ChildName.refresh
            },
            DatePregnacy: {
                ...DatePregnacy,
                disable: isRedonly,
                value: null,
                refresh: !DatePregnacy.refresh
            },
            ChildBirthday: {
                ...ChildBirthday,
                disable: isRedonly,
                value: null,
                refresh: !ChildBirthday.refresh
            },
            ChildCareCompUsedTo: {
                ...ChildCareCompUsedTo,
                value: null,
                refresh: !ChildCareCompUsedTo.refresh
            },
            DateEnd: {
                ...DateEnd,
                value: null,
                refresh: !DateEnd.refresh
            }
        };

        this.setState(nextState);
    };

    //onCheck TypePregnancyEarlyShift - Đi trễ về sớm theo ca
    onCheckTypePregnancyEarlyShift = () => {
        const { divTypePregnancyEarly } = this.state,
            { TypePregnancyEarlyShift, IsLateIn, IsEarlyMidOut, IsLateMidIn, IsEarlyOut } = divTypePregnancyEarly,
            _nextVal = !TypePregnancyEarlyShift.value;
        let nextState = {};

        if (_nextVal) {
            // $("#divLateEarlyMInOut").addClass('hide');
            // $(frm + ' #IsLateIn').prop('checked', false);
            // $(frm + ' #IsEarlyMidOut').prop('checked', false);
            // $(frm + ' #IsLateMidIn').prop('checked', false);
            // $(frm + ' #IsEarlyOut').prop('checked', false);
            nextState = {
                divTypePregnancyEarly: {
                    ...divTypePregnancyEarly,
                    TypePregnancyEarlyShift: {
                        ...TypePregnancyEarlyShift,
                        value: true
                    },
                    IsLateIn: {
                        ...IsLateIn,
                        visible: false,
                        value: false
                    },
                    IsEarlyMidOut: {
                        ...IsEarlyMidOut,
                        visible: false,
                        value: false
                    },
                    IsLateMidIn: {
                        ...IsLateMidIn,
                        visible: false,
                        value: false
                    },
                    IsEarlyOut: {
                        ...IsEarlyOut,
                        visible: false,
                        value: false
                    }
                }
            };
        } else {
            //$("#divLateEarlyMInOut").removeClass('hide');
            nextState = {
                divTypePregnancyEarly: {
                    ...divTypePregnancyEarly,
                    TypePregnancyEarlyShift: {
                        ...TypePregnancyEarlyShift,
                        value: false
                    },
                    IsLateIn: {
                        ...IsLateIn,
                        visible: true
                    },
                    IsEarlyMidOut: {
                        ...IsEarlyMidOut,
                        visible: true
                    },
                    IsLateMidIn: {
                        ...IsLateMidIn,
                        visible: true
                    },
                    IsEarlyOut: {
                        ...IsEarlyOut,
                        visible: true
                    }
                }
            };
        }

        this.setState(nextState);
    };

    onCheckTypeIsLateIn = () => {
        const { divTypePregnancyEarly } = this.state;
        this.setState({
            divTypePregnancyEarly: {
                ...divTypePregnancyEarly,
                IsLateIn: {
                    ...divTypePregnancyEarly.IsLateIn,
                    value: !divTypePregnancyEarly.IsLateIn.value
                }
            }
        });
    };

    onCheckTypeIsEarlyMidOut = () => {
        const { divTypePregnancyEarly } = this.state;
        this.setState({
            divTypePregnancyEarly: {
                ...divTypePregnancyEarly,
                IsEarlyMidOut: {
                    ...divTypePregnancyEarly.IsEarlyMidOut,
                    value: !divTypePregnancyEarly.IsEarlyMidOut.value
                }
            }
        });
    };

    onCheckTypeIsLateMidIn = () => {
        const { divTypePregnancyEarly } = this.state;
        this.setState({
            divTypePregnancyEarly: {
                ...divTypePregnancyEarly,
                IsLateMidIn: {
                    ...divTypePregnancyEarly.IsLateMidIn,
                    value: !divTypePregnancyEarly.IsLateMidIn.value
                }
            }
        });
    };

    onCheckTypeIsEarlyOut = () => {
        const { divTypePregnancyEarly } = this.state;

        this.setState({
            divTypePregnancyEarly: {
                ...divTypePregnancyEarly,
                IsEarlyOut: {
                    ...divTypePregnancyEarly.IsEarlyOut,
                    value: !divTypePregnancyEarly.IsEarlyOut.value
                }
            }
        });
    };

    onSave = (navigation, isCreate, isSend) => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        const {
                ID,
                Profile,
                Type,
                //divTypePregnancyEarly,
                TypePregnancyEarly,
                ChildName,
                DatePregnacy,
                ChildBirthday,
                YearOfLose,
                ChildCareCompUsedTo,
                DateStart,
                DateEnd,
                IsOvertime,
                IsNotSubmitDoc,
                IsAdjustment,
                FileAttach,
                Comment,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4,
                modalErrorDetail,
                PregnancyCycleID
            } = this.state,
            { apiConfig } = dataVnrStorage,
            { uriPor } = apiConfig;
        // {
        //   TypePregnancyEarlyShift,
        //   IsLateIn,
        //   IsEarlyMidOut,
        //   IsLateMidIn,
        //   IsEarlyOut
        // } = divTypePregnancyEarly;

        let param = {
            TypePregnancyEarly: TypePregnancyEarly.value
                ? TypePregnancyEarly.value.map(item => item.Value).join()
                : null,
            ChildName: ChildName.value ? ChildName.value.RelativeName : null,
            //TypePregnancyEarlyShift: TypePregnancyEarlyShift.value,
            //IsLateIn: IsLateIn.value,
            //IsEarlyMidOut: IsEarlyMidOut.value,
            //IsLateMidIn: IsLateMidIn.value,
            //IsEarlyOut: IsEarlyOut.value,
            IsOvertime: IsOvertime.value,
            IsNotSubmitDoc: IsNotSubmitDoc.value,
            IsAdjustment: IsAdjustment.value,
            Comment: Comment.value,
            DatePregnacy: DatePregnacy.value,
            ChildBirthday: ChildBirthday.value ? Vnr_Function.parseDateTime(ChildBirthday.value) : null,
            YearOfLose: YearOfLose.value,
            ChildCareCompUsedTo: ChildCareCompUsedTo.value
                ? Vnr_Function.parseDateTime(ChildCareCompUsedTo.value)
                : null,
            DateStart: DateStart.value,
            DateEnd: DateEnd.value ? Vnr_Function.parseDateTime(DateEnd.value) : null,
            ProfileID: Profile.ID,
            IsPortal: true,
            UserSubmit: Profile.ID,
            ProfileIds: Profile.ID,
            Status: 'E_SUBMIT',
            UserApproveID: UserApproveID.value ? UserApproveID.value.ID : null,
            UserApproveID2: UserApproveID2.value ? UserApproveID2.value.ID : null,
            UserApproveID3: UserApproveID3.value ? UserApproveID3.value.ID : null,
            UserApproveID4: UserApproveID4.value ? UserApproveID4.value.ID : null,
            Type: Type.value ? Type.value.Value : null,
            UserSubmitID: Profile.ID,
            FileAttachment: FileAttach.value ? FileAttach.value.map(item => item.fileName).join(',') : null,
            IsContinueSave: this.IsContinueSave,
            ProfileRemoveIDs: this.ProfileRemoveIDs,
            IsRemoveAndContinue: this.IsRemoveAndContinue,
            CacheID: this.CacheID,
            Host: uriPor,
            IsAddNewAndSendMail: isSend,
            PregnancyCycleID:
                PregnancyCycleID && PregnancyCycleID.value && PregnancyCycleID.value.ID
                    ? PregnancyCycleID.value.ID
                    : null
        };

        if (ID) {
            param = {
                ...param,
                ID
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Att_PregnancyRegister', param).then(data => {
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
                            message: translate('HRM_Attendance_Message_InvalidRequestDataDoYouWantToSave'),
                            //lưu và tiếp tục
                            colorSecondConfirm: Colors.primary,
                            textSecondConfirm: translate('Button_RemoveAndContinue'),
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
                    if (isCreate) {
                        this.refreshView();
                    } else {
                        navigation.goBack();
                    }
                    const { reload } = this.props.navigation.state.params;
                    if (reload && typeof reload == 'function') {
                        reload();
                    }
                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                } else {
                    ToasterSevice.showWarning(data.ActionStatus, 4000);
                }
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
                                style={[styleSheets.text, { ...CustomStyleSheet.fontWeight('500'), ...CustomStyleSheet.color(Colors.primary) }]}
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

    toggleUsersApprove = () => {
        this.setState(
            {
                isShowUsersApprove: !this.state.isShowUsersApprove
            },
            () => {
                setTimeout(() => {
                    this.scrollViewRef.scrollToPosition(0, this.layoutViewUsersApprove.y);
                }, 200);
            }
        );
    };

    onPickChild = item => {
        const { ChildName } = this.state;
        this.setState(
            {
                ChildName: {
                    ...ChildName,
                    value: item,
                    refresh: !ChildName.refresh
                }
            },
            () => this.fnChangeChild()
        );
    };

    GetChildBirthdayAndDateEnd = () => {
        const { ChildName, Type, DateStart, DateEnd, ChildBirthday, ChildCareCompUsedTo } = this.state;
        let childName = ChildName.value,
            typeRegnancy = Type.value ? Type.value.Value : null,
            birthDay = childName ? childName.YearOfBirth : null,
            nextState = {};
        // if (!$("#ChildName").data("kendoAutoComplete"))
        //   return;

        //var dataSourceChild = $("#ChildName").data("kendoAutoComplete").dataSource.data();
        // var birthDay = dataSourceChild.find(function (ele) {
        //   if (ele.RelativeName == childName)
        //     return ele.YearOfBirth;
        //   return null;
        // });

        if (
            birthDay &&
            birthDay != '' &&
            (typeRegnancy == 'E_NEW_BORN_CHILD' || typeRegnancy == 'E_CHILDCARECOMPENSATION')
        ) {
            let _splitBirthDay = birthDay.indexOf('/') >= 0 ? birthDay.split('/') : null;

            if (_splitBirthDay && _splitBirthDay.length == 3) {
                let toBirthDay = _splitBirthDay[1] + '/' + _splitBirthDay[0] + '/' + _splitBirthDay[2],
                    toBirthDayMoment = moment(toBirthDay).toDate();
                nextState = {
                    ChildBirthday: {
                        ...ChildBirthday,
                        value: toBirthDayMoment,
                        refresh: !ChildBirthday.refresh
                    }
                };

                //$(frm + ' #ChildBirthday').data('kendoDatePicker').value(FormatDate(birthDay.YearOfBirth));
                if (typeRegnancy == 'E_NEW_BORN_CHILD') {
                    //var tempDateEnd = new Date($('#ChildBirthday').getKendoDatePicker().value());
                    //var dateEndNextYear = getDateEnd(tempDateEnd);
                    let dateEnd = this.getDateEnd(toBirthDay); //new Date(dateEndNextYear);
                    //$(frm + ' #DateEnd').data('kendoDatePicker').value(dateEnd);
                    nextState = {
                        ...nextState,
                        DateEnd: {
                            ...DateEnd,
                            value: dateEnd,
                            refresh: !DateEnd.refresh
                        }
                    };
                } else if (typeRegnancy == 'E_CHILDCARECOMPENSATION') {
                    //var tempDateEnd = new Date($('#ChildBirthday').getKendoDatePicker().value());
                    //var dateEndNextYear = getDateEnd(tempDateEnd);
                    //var dateEnd = new Date(dateEndNextYear);
                    let dateEnd = this.getDateEnd(toBirthDay); //new Date(dateEndNextYear);
                    //$(frm + ' #DateEnd').data('kendoDatePicker').value(dateEnd);
                    //$(frm + ' #ChildCareCompUsedTo').data('kendoDatePicker').value(dateEnd);
                    nextState = {
                        ...nextState,
                        DateEnd: {
                            ...DateEnd,
                            value: dateEnd,
                            refresh: !DateEnd.refresh
                        },
                        ChildCareCompUsedTo: {
                            ...ChildCareCompUsedTo,
                            value: dateEnd,
                            refresh: !ChildCareCompUsedTo.refresh
                        }
                    };
                }
            }
        } else {
            //$(frm + ' #ChildBirthday, #DateEnd, #DateStart').val('');
            nextState = {
                DateEnd: {
                    ...DateEnd,
                    value: null,
                    refresh: !DateEnd.refresh
                },
                ChildBirthday: {
                    ...ChildBirthday,
                    value: null,
                    refresh: !ChildBirthday.refresh
                },
                DateStart: {
                    ...DateStart,
                    value: null,
                    refresh: !DateStart.refresh
                }
            };
            if (typeRegnancy == 'E_CHILDCARECOMPENSATION')
                //$(frm + ' #ChildCareCompUsedTo').val('');
                nextState = {
                    ChildCareCompUsedTo: {
                        ...ChildCareCompUsedTo,
                        value: null,
                        refresh: !ChildCareCompUsedTo.refresh
                    }
                };
        }

        this.setState(nextState);
    };

    getDateEnd = d => {
        return moment(d)
            .add(12, 'M')
            .add(-1, 'd')
            .toDate();
    };

    getPregnacyProcess = () => {
        const { DateStart, DateEnd, Profile, PregnancyCycleID } = this.state;
        if (DateStart.value && DateEnd.value && Profile.ID) {
            HttpService.Post('[URI_HR]/Att_GetData/GetPregnancyCycleControl', {
                ProfileID: Profile.ID,
                DateStart: new Date(moment(DateStart.value).format('YYYY/MM/DD')).toDateString(),
                DateEnd: new Date(moment(DateEnd.value).format('YYYY/MM/DD')).toDateString()
            })
                .then(res => {
                    if (res && Array.isArray(res) && res.length > 0) {
                        if (res.length === 1) {
                            this.setState({
                                PregnancyCycleID: {
                                    ...PregnancyCycleID,
                                    value: { ...res[0] },
                                    visibleConfig: true,
                                    visible: true,
                                    refresh: !PregnancyCycleID.refresh
                                }
                            });
                        } else {
                            this.setState({
                                PregnancyCycleID: {
                                    ...PregnancyCycleID,
                                    value: null,
                                    data: res,
                                    visibleConfig: true,
                                    visible: true,
                                    refresh: !PregnancyCycleID.refresh
                                }
                            });
                        }
                    } else {
                        this.setState({
                            PregnancyCycleID: {
                                ...PregnancyCycleID,
                                visibleConfig: false,
                                visible: false,
                                refresh: !PregnancyCycleID.refresh
                            }
                        });
                    }
                })
                .catch(error => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                });
        }
    };

    loadPregnancyTypeByDate = () => {
        const { DateStart, DateEnd, Profile, Type } = this.state;
        if (DateStart.value && DateEnd.value && Profile.ID) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/GetPregnancyTypeByDate', {
                ProfileID: Profile.ID,
                DateStart: Vnr_Function.formatDateAPI(DateStart.value),
                DateEnd: Vnr_Function.formatDateAPI(DateEnd.value)
            })
                .then(res => {
                    VnrLoadingSevices.hide();
                    if (res && typeof res == 'string' && res.indexOf('MultiplePregnancy') == -1) {
                        const findValue = Type.data ? Type.data.find(item => item.Value == res) : null;

                        let keyCreate = 'HRM_Attendance_Pregnancy_AddNew';
                        if (findValue && findValue.Value) {
                            keyCreate = findValue.Text;
                        }

                        this.props.navigation.setParams({
                            title: keyCreate
                        });

                        this.setState(
                            {
                                Type: {
                                    ...Type,
                                    value: findValue,
                                    visible: false,
                                    refresh: !Type.refresh
                                }
                            },
                            () => {
                                this.onPickType(findValue, true);
                            }
                        );
                    } else if (res && typeof res == 'string' && res.indexOf('MultiplePregnancy') != -1) {
                        ToasterSevice.showWarning('HRM_Att_Pregnancy_Benefit_Category');

                        this.props.navigation.setParams({
                            title: this.isModify ? 'HRM_Attendance_Pregnancy_Update' : 'HRM_Attendance_Pregnancy_AddNew'
                        });

                        this.setState(
                            {
                                Type: {
                                    ...Type,
                                    value: null,
                                    visible: true,
                                    refresh: !Type.refresh
                                }
                            },
                            () => {
                                this.onPickType(null, true);
                            }
                        );
                    } else {
                        this.props.navigation.setParams({
                            title: this.isModify ? 'HRM_Attendance_Pregnancy_Update' : 'HRM_Attendance_Pregnancy_AddNew'
                        });

                        this.setState(
                            {
                                Type: {
                                    ...Type,
                                    value: null,
                                    visible: true,
                                    refresh: !Type.refresh
                                }
                            },
                            () => {
                                this.onPickType(null, true);
                            }
                        );
                    }
                })
                .catch(error => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                });
        }
    };

    render() {
        const {
                Type,
                divTypePregnancyEarly,
                TypePregnancyEarly,
                ChildName,
                DatePregnacy,
                ChildBirthday,
                YearOfLose,
                ChildCareCompUsedTo,
                DateStart,
                DateEnd,
                IsOvertime,
                IsNotSubmitDoc,
                IsAdjustment,
                FileAttach,
                Comment,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4,
                fieldValid,
                isShowUsersApprove,
                modalErrorDetail,
                PregnancyCycleID
            } = this.state,
            {
                TypePregnancyEarlyShift,
                IsLateIn,
                IsEarlyMidOut,
                IsLateMidIn,
                IsEarlyOut
            } = divTypePregnancyEarly,
            {
                textLableInfo,
                contentViewControl,
                viewLable,
                viewControl,
                controlDate_To,
                controlDate_from,
                formDate_To_From,
                viewInputMultiline,
                viewBtnShowHideUser,
                viewBtnShowHideUser_text
            } = stylesListPickerControl;

        //#region [Xử lý 3 nút lưu]
        const listActions = [];

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_PregnancyRegister_New_CreateOrUpdate_btnSaveandSendMail'] &&
            PermissionForAppMobile.value['New_Att_PregnancyRegister_New_CreateOrUpdate_btnSaveandSendMail']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_SENMAIL,
                title: translate('HRM_Common_SaveAndSendMail'),
                onPress: () => this.onSaveAndSend(this.props.navigation)
            });
        }

        listActions.push(
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
        );
        //#endregion

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={ { ...CustomStyleSheet.flexGrow(1), ...CustomStyleSheet.paddingTop(10) }}
                        ref={ref => (this.scrollViewRef = ref)}
                    >
                        {/* Loại chế độ - Type */}
                        {Type.visibleConfig && Type.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Type.label} />

                                    {/* valid Type */}
                                    {fieldValid.Type && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        dataLocal={Type.data}
                                        // api={{
                                        //   urlApi:
                                        //     '[URI_SYS]/Sys_GetData/GetEnumForAtt?text=PregnancyTypeRegister&filterConfig=E_PORTAL',
                                        //   type: 'E_GET',
                                        // }}
                                        refresh={Type.refresh}
                                        autoBind={true}
                                        textField="Text"
                                        valueField="Value"
                                        filter={false}
                                        value={Type.value}
                                        disable={Type.disable}
                                        onFinish={item => this.onPickType(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Loại chính sách -  divTypePregnancyEarly */}
                        {false && (
                            <View>
                                <View style={contentViewControl}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={divTypePregnancyEarly.label}
                                    />
                                    {fieldValid.divTypePregnancyEarly && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>

                                {/* Đi trễ về sớm theo ca -  TypePregnancyEarlyShift */}
                                {TypePregnancyEarlyShift.visible && TypePregnancyEarlyShift.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <TouchableOpacity
                                            style={viewLable}
                                            onPress={this.onCheckTypePregnancyEarlyShift}
                                        >
                                            <CheckBox
                                                checkBoxColor={Colors.primary}
                                                checkedCheckBoxColor={Colors.primary}
                                                isChecked={TypePregnancyEarlyShift.value}
                                                disable={TypePregnancyEarlyShift.disable}
                                                onClick={this.onCheckTypePregnancyEarlyShift}
                                            />
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo, CustomStyleSheet.marginLeft(5)]}
                                                i18nKey={TypePregnancyEarlyShift.label}
                                            />
                                            {fieldValid.TypePregnancyEarlyShift && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {/* Vào trễ -  IsLateIn */}
                                {IsLateIn.visible && IsLateIn.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <TouchableOpacity style={viewLable} onPress={this.onCheckTypeIsLateIn}>
                                            <CheckBox
                                                checkBoxColor={Colors.primary}
                                                checkedCheckBoxColor={Colors.primary}
                                                isChecked={IsLateIn.value}
                                                disable={IsLateIn.disable}
                                                onClick={this.onCheckTypeIsLateIn}
                                            />
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo, CustomStyleSheet.marginLeft(5)]}
                                                i18nKey={IsLateIn.label}
                                            />
                                            {fieldValid.IsLateIn && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {/* Về sớm giữa ca-  IsEarlyMidOut */}
                                {IsEarlyMidOut.visible && IsEarlyMidOut.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <TouchableOpacity style={viewLable} onPress={this.onCheckTypeIsEarlyMidOut}>
                                            <CheckBox
                                                checkBoxColor={Colors.primary}
                                                checkedCheckBoxColor={Colors.primary}
                                                isChecked={IsEarlyMidOut.value}
                                                disable={IsEarlyMidOut.disable}
                                                onClick={this.onCheckTypeIsEarlyMidOut}
                                            />
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo, CustomStyleSheet.marginLeft(5)]}
                                                i18nKey={IsEarlyMidOut.label}
                                            />
                                            {fieldValid.IsEarlyMidOut && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {/* Vào trễ giữa ca -  IsLateMidIn */}
                                {IsLateMidIn.visible && IsLateMidIn.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <TouchableOpacity style={viewLable} onPress={this.onCheckTypeIsLateMidIn}>
                                            <CheckBox
                                                checkBoxColor={Colors.primary}
                                                checkedCheckBoxColor={Colors.primary}
                                                isChecked={IsLateMidIn.value}
                                                disable={IsLateMidIn.disable}
                                                onClick={this.onCheckTypeIsLateMidIn}
                                            />
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo, CustomStyleSheet.marginLeft(5)]}
                                                i18nKey={IsLateMidIn.label}
                                            />
                                            {fieldValid.IsLateMidIn && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                )}

                                {/* Về sớm -  IsEarlyOut */}
                                {IsEarlyOut.visible && IsEarlyOut.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <TouchableOpacity style={viewLable} onPress={this.onCheckTypeIsEarlyOut}>
                                            <CheckBox
                                                checkBoxColor={Colors.primary}
                                                checkedCheckBoxColor={Colors.primary}
                                                isChecked={IsEarlyOut.value}
                                                disable={IsEarlyOut.disable}
                                                onClick={this.onCheckTypeIsEarlyOut}
                                            />
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo, CustomStyleSheet.marginLeft(5)]}
                                                i18nKey={IsEarlyOut.label}
                                            />
                                            {fieldValid.IsEarlyOut && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </TouchableOpacity>
                                    </View>
                                )}
                            </View>
                        )}

                        {/* Quá trình thai sản -  PregnancyCycleID*/}
                        {PregnancyCycleID.visibleConfig && PregnancyCycleID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={PregnancyCycleID.label}
                                    />
                                    {fieldValid.PregnancyCycleID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={PregnancyCycleID.data}
                                        // api={{
                                        //   urlApi:
                                        //     '[URI_HR]/Att_GetData/GetPregnancyCycleControl',
                                        //   type: 'E_POST',
                                        //   dataBody: {
                                        //     DateStart: new Date(moment(DateStart.value).format('YYYY/MM/DD')).toDateString(),
                                        //     DateEnd: new Date(moment(DateEnd.value).format('YYYY/MM/DD')).toDateString()
                                        //   },
                                        // }}
                                        value={PregnancyCycleID.value}
                                        refresh={PregnancyCycleID.refresh}
                                        textField="PregnancyCycleName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={false}
                                        autoFilter={true}
                                        onFinish={item => {
                                            this.setState({
                                                PregnancyCycleID: {
                                                    ...PregnancyCycleID,
                                                    value: item,
                                                    refresh: !PregnancyCycleID.refresh
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {TypePregnancyEarly.visibleConfig && TypePregnancyEarly.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={TypePregnancyEarly.label}
                                    />

                                    {/* valid HaveMTypePregnancyEarlyeal */}
                                    {fieldValid.TypePregnancyEarly && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerMulti
                                        api={TypePregnancyEarly.api}
                                        value={TypePregnancyEarly.value}
                                        refresh={TypePregnancyEarly.refresh}
                                        textField={TypePregnancyEarly.textField}
                                        valueField={TypePregnancyEarly.valueField}
                                        filter={false}
                                        onFinish={items =>
                                            this.setState({
                                                TypePregnancyEarly: {
                                                    ...TypePregnancyEarly,
                                                    value: items,
                                                    refresh: !TypePregnancyEarly.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Tên con nhỏ -  ChildName*/}
                        {ChildName.visibleConfig && ChildName.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={ChildName.label} />
                                    {fieldValid.ChildName && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={ChildName.data}
                                        value={ChildName.value}
                                        refresh={ChildName.refresh}
                                        textField="RelativeName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={false}
                                        autoFilter={true}
                                        onFinish={item => this.onPickChild(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày mang thai - DatePregnacy */}
                        {DatePregnacy.visibleConfig && DatePregnacy.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DatePregnacy.label} />

                                    {fieldValid.DatePregnacy && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={DatePregnacy.value}
                                        refresh={DatePregnacy.refresh}
                                        type={'date'}
                                        onFinish={value =>
                                            this.setState({
                                                DatePregnacy: {
                                                    ...DatePregnacy,
                                                    value,
                                                    refresh: !DatePregnacy.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày sinh - ChildBirthday */}
                        {ChildBirthday.visibleConfig && ChildBirthday.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={ChildBirthday.label} />

                                    {fieldValid.ChildBirthday && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={ChildBirthday.value}
                                        refresh={ChildBirthday.refresh}
                                        type={'date'}
                                        onFinish={value => this.onChangeChildBirthday(value)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày mất - YearOfLose */}
                        {YearOfLose.visibleConfig && YearOfLose.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={YearOfLose.label} />

                                    {fieldValid.YearOfLose && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={YearOfLose.value}
                                        refresh={YearOfLose.refresh}
                                        type={'date'}
                                        onFinish={value => this.onChangeYearOfLose(value)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Phép nuôi con được dùng đến - ChildCareCompUsedTo */}
                        {ChildCareCompUsedTo.visibleConfig && ChildCareCompUsedTo.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={ChildCareCompUsedTo.label}
                                    />

                                    {fieldValid.ChildCareCompUsedTo && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={ChildCareCompUsedTo.value}
                                        refresh={ChildCareCompUsedTo.refresh}
                                        type={'date'}
                                        onFinish={value =>
                                            this.setState({
                                                ChildCareCompUsedTo: {
                                                    ...ChildCareCompUsedTo,
                                                    value,
                                                    refresh: !ChildCareCompUsedTo.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày hiệu lực - DateStart, DateEnd */}
                        {DateStart.visibleConfig && DateStart.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DateStart.label} />

                                    {/* valid DateStart */}
                                    {fieldValid.DateStart && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <View style={formDate_To_From}>
                                        <View style={controlDate_from}>
                                            <VnrDate
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DateStart.value}
                                                refresh={DateStart.refresh}
                                                disable={DateStart.disable}
                                                type={'date'}
                                                onFinish={value =>
                                                    this.setState(
                                                        {
                                                            DateStart: {
                                                                ...DateStart,
                                                                value,
                                                                refresh: !DateStart.refresh
                                                            }
                                                        },
                                                        () => {
                                                            this.getPregnacyProcess();
                                                            this.loadPregnancyTypeByDate();
                                                        }
                                                    )
                                                }
                                            />
                                        </View>
                                        <View style={controlDate_To}>
                                            <VnrDate
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DateEnd.value}
                                                refresh={DateEnd.refresh}
                                                disable={DateEnd.disable}
                                                type={'date'}
                                                onFinish={value =>
                                                    this.setState(
                                                        {
                                                            DateEnd: {
                                                                ...DateEnd,
                                                                value,
                                                                refresh: !DateEnd.refresh
                                                            }
                                                        },
                                                        () => {
                                                            this.getPregnacyProcess();
                                                            this.loadPregnancyTypeByDate();
                                                        }
                                                    )
                                                }
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Ghi chú -  Comment*/}
                        {Comment.visibleConfig && Comment.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_Pregnancy_Comment'}
                                    />
                                    {fieldValid.Comment && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Comment.disable}
                                        refresh={Comment.refresh}
                                        value={Comment.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={text =>
                                            this.setState({
                                                Comment: {
                                                    ...Comment,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        <View style={styles.styListBtnTypePregnancy}>
                            {/* Tính tăng ca - IsOvertime */}
                            {IsOvertime.visibleConfig && IsOvertime.visible && (
                                <TouchableOpacity
                                    style={styles.styBtnTypePregnancy}
                                    onPress={() =>
                                        this.setState({
                                            IsOvertime: {
                                                ...IsOvertime,
                                                value: !IsOvertime.value
                                            }
                                        })
                                    }
                                >
                                    <CheckBox
                                        checkBoxColor={Colors.primary}
                                        checkedCheckBoxColor={Colors.primary}
                                        isChecked={IsOvertime.value}
                                        disable={IsOvertime.disable}
                                        onClick={() =>
                                            this.setState({
                                                IsOvertime: {
                                                    ...IsOvertime,
                                                    value: !IsOvertime.value
                                                }
                                            })
                                        }
                                    />
                                    <VnrText
                                        style={[styleSheets.text, styles.styBtnTypePregnancyText]}
                                        i18nKey={IsOvertime.label}
                                    />
                                    {fieldValid.IsOvertime && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </TouchableOpacity>
                            )}
                            {/* Chưa nộp đơn - IsNotSubmitDoc */}
                            {IsNotSubmitDoc.visibleConfig && IsNotSubmitDoc.visible && (
                                <TouchableOpacity
                                    style={styles.styBtnTypePregnancy}
                                    onPress={() =>
                                        this.setState({
                                            IsNotSubmitDoc: {
                                                ...IsNotSubmitDoc,
                                                value: !IsNotSubmitDoc.value
                                            }
                                        })
                                    }
                                >
                                    <CheckBox
                                        checkBoxColor={Colors.primary}
                                        checkedCheckBoxColor={Colors.primary}
                                        isChecked={IsNotSubmitDoc.value}
                                        disable={IsNotSubmitDoc.disable}
                                        onClick={() =>
                                            this.setState({
                                                IsNotSubmitDoc: {
                                                    ...IsNotSubmitDoc,
                                                    value: !IsNotSubmitDoc.value
                                                }
                                            })
                                        }
                                    />
                                    <VnrText
                                        style={[styleSheets.text, styles.styBtnTypePregnancyText]}
                                        i18nKey={IsNotSubmitDoc.label}
                                    />
                                    {fieldValid.IsNotSubmitDoc && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </TouchableOpacity>
                            )}

                            {/* Điều chỉnh - IsAdjustment */}
                            {IsAdjustment.visibleConfig && IsAdjustment.visible && (
                                <TouchableOpacity
                                    style={styles.styBtnTypePregnancy}
                                    onPress={() =>
                                        this.setState({
                                            IsAdjustment: {
                                                ...IsAdjustment,
                                                value: !IsAdjustment.value
                                            }
                                        })
                                    }
                                >
                                    <CheckBox
                                        checkBoxColor={Colors.primary}
                                        checkedCheckBoxColor={Colors.primary}
                                        isChecked={IsAdjustment.value}
                                        disable={IsAdjustment.disable}
                                        onClick={() =>
                                            this.setState({
                                                IsAdjustment: {
                                                    ...IsAdjustment,
                                                    value: !IsAdjustment.value
                                                }
                                            })
                                        }
                                    />
                                    <VnrText
                                        style={[styleSheets.text, styles.styBtnTypePregnancyText]}
                                        i18nKey={IsAdjustment.label}
                                    />
                                    {fieldValid.IsAdjustment && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>

                        {isShowUsersApprove && (
                            <View>
                                {/* Người duyệt đầu - UserApproveID*/}
                                {UserApproveID.visibleConfig && UserApproveID.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={UserApproveID.label}
                                            />

                                            {/* valid UserApproveID */}
                                            {fieldValid.UserApproveID && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                api={{
                                                    urlApi:
                                                        '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_PREGNANCYREGISTER',
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

                                {/* Người duyệt kế tiếp - UserApproveID2*/}
                                {UserApproveID2.visibleConfig && UserApproveID2.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={UserApproveID2.label}
                                            />

                                            {/* valid UserApproveID2 */}
                                            {fieldValid.UserApproveID2 && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                api={{
                                                    urlApi:
                                                        '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_PREGNANCYREGISTER',
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

                                {/* Người duyệt tiếp theo - UserApproveID3*/}
                                {UserApproveID3.visibleConfig && UserApproveID3.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={UserApproveID3.label}
                                            />

                                            {/* valid UserApproveID3 */}
                                            {fieldValid.UserApproveID3 && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                api={{
                                                    urlApi:
                                                        '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_PREGNANCYREGISTER',
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

                                {/* Người duyệt cuối - UserApproveID4 */}
                                {UserApproveID4.visibleConfig && UserApproveID4.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={UserApproveID4.label}
                                            />

                                            {/* valid UserApproveID4 */}
                                            {fieldValid.UserApproveID4 && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                api={{
                                                    urlApi:
                                                        '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_PREGNANCYREGISTER',
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
                                                onFinish={item => this.onChangeUserApproveID4(item)}
                                            />
                                        </View>
                                    </View>
                                )}
                            </View>
                        )}

                        <View
                            style={contentViewControl}
                            onLayout={event => (this.layoutViewUsersApprove = event.nativeEvent.layout)}
                        >
                            <TouchableOpacity style={viewBtnShowHideUser} onPress={this.toggleUsersApprove}>
                                {isShowUsersApprove ? (
                                    <IconUp size={Size.iconSize - 3} color={Colors.primary} />
                                ) : (
                                    <IconDown size={Size.iconSize - 3} color={Colors.primary} />
                                )}
                                <VnrText
                                    style={[styleSheets.lable, viewBtnShowHideUser_text]}
                                    i18nKey={
                                        isShowUsersApprove
                                            ? 'HRM_PortalApp_Collapse_UserApprove'
                                            : 'HRM_PortalApp_Expand_UserApprove'
                                    }
                                />
                            </TouchableOpacity>
                        </View>

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
                                                    value: file
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}
                    </KeyboardAwareScrollView>

                    {/* <View style={styles.groupButton}>
            <TouchableOpacity
              onPress={() => this.onSave(this.props.navigation)}
              style={styles.groupButton__button_save}>
              <IconPublish size={Size.iconSize} color={Colors.white} />
              <VnrText
                style={[styleSheets.lable, styles.groupButton__text]}
                i18nKey={'HRM_Common_Save'}
              />
            </TouchableOpacity>
          </View> */}

                    <ListButtonSave listActions={listActions} />

                    {modalErrorDetail.isModalVisible && (
                        <Modal
                            onBackButtonPress={() => this.closeModalErrorDetail()}
                            isVisible={true}
                            onBackdropPress={() => this.closeModalErrorDetail()}
                            customBackdrop={
                                <TouchableWithoutFeedback onPress={() => this.closeModalErrorDetail()}>
                                    <View
                                        style={styleSheets.coatingOpacity05}
                                    />
                                </TouchableWithoutFeedback>
                            }
                            style={CustomStyleSheet.margin(0)}
                        >
                            <View style={stylesModalPopupBottom.viewModal}>
                                <SafeAreaView {...styleSafeAreaView} style={stylesModalPopupBottom.safeRadius}>
                                    <View style={styles.headerCloseModal}>
                                        <TouchableOpacity onPress={() => this.closeModalErrorDetail()}>
                                            <IconColse color={Colors.grey} size={Size.iconSize} />
                                        </TouchableOpacity>
                                        <VnrText
                                            style={styleSheets.lable}
                                            i18nKey={'HRM_Attendance_Message_ViolationNotification'}
                                        />
                                        <IconColse color={Colors.white} size={Size.iconSize} />
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
                                                style={[styleSheets.lable, { color: Colors.greySecondary }]}
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
    styListBtnTypePregnancy: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: Size.defineSpace,
        justifyContent: 'space-between',
        marginVertical: Size.defineHalfSpace
    },
    styBtnTypePregnancy: {
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 11,
        marginBottom: Size.defineHalfSpace
    },
    styBtnTypePregnancyText: {
        color: Colors.gray_10,
        marginLeft: 6
    },
    btnClose: {
        height: Size.heightButton,
        backgroundColor: Colors.borderColor,
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
    styleViewBorderButtom: {
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.borderColor,
        flex: 1,
        marginBottom: 0.5,
        marginHorizontal: 10,
        paddingVertical: 10
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
