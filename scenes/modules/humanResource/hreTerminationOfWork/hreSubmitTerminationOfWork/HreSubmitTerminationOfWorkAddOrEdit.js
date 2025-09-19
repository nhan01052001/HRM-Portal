import React, { Component } from 'react';
import { View, Text, TouchableOpacity, Image, FlatList, Modal, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { styleSheets, Size, Colors, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { IconCancel, IconNextForward } from '../../../../../constants/Icons';
import VnrText from '../../../../../components/VnrText/VnrText';
import HttpService from '../../../../../utils/HttpService';
import { ToasterSevice, ToasterInModal } from '../../../../../components/Toaster/Toaster';
import { translate } from '../../../../../i18n/translate';
import { AlertInModal } from '../../../../../components/Alert/Alert';
import { EnumName, EnumIcon } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import HreSubmitTerminationOfWorkComponent from './HreSubmitTerminationOfWorkComponent';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';
import VnrLoadApproval from '../../../../../componentsV3/VnrLoadApproval/VnrLoadApproval';
import VnrIndeterminate from '../../../../../components/VnrLoading/VnrIndeterminate';
import DrawerServices from '../../../../../utils/DrawerServices';

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
    UserApprove2: {
        label: 'HRM_PortalApp_Approval_UserApproveID2',
        disable: false,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true,
        levelApproval: 2
    },
    UserApprove3: {
        label: 'HRM_PortalApp_Approval_UserApproveID3',
        disable: false,
        refresh: false,
        value: null,
        visible: false,
        visibleConfig: true,
        levelApproval: 3
    },
    UserApprove4: {
        label: 'HRM_PortalApp_Approval_UserApproveID4',
        disable: false,
        refresh: false,
        value: null,
        visible: true,
        visibleConfig: true,
        levelApproval: 4
    },
    fieldValid: {},
    params: null,
    isShowModal: false,
    isShowModalApprove: false,
    isShowLoading: false,
    isShowBtnSurvey: false,
    isDisableBtnsave: true,
    fieldConfig: {
        RequestDate: {
            visibleConfig: true,
            isValid: false
        },
        DecisionNo: {
            visibleConfig: true,
            isValid: false
        },
        TypeOfStopID: {
            visibleConfig: true,
            isValid: false
        },
        ResignReasonID: {
            visibleConfig: true,
            isValid: false
        },
        OtherReason: {
            visibleConfig: true,
            isValid: false
        },
        LastWorkingDay: {
            visibleConfig: true,
            isValid: false
        },
        DateStop: {
            visibleConfig: true,
            isValid: false
        },
        Note: {
            visibleConfig: true,
            isValid: false
        },
        Attachment: {
            visibleConfig: true,
            isValid: false
        }
    },
    isPassRecord: false
};

export default class HreSubmitTerminationOfWorkAddOrEdit extends Component {
    constructor(props) {
        super(props);
        this.state = initSateDefault;
        //this.refVnrDateFromTo = null;
        //this.isStatusVnrDateFromTo = false;
        this.listRefGetDataSave = {};
        // khai báo các biến this trong hàm setVariable
        this.setVariable();
    }

    setVariable = () => {
        // Bao nhiêu cấp duyệt
        this.levelApprove = null;
        this.isModify = false;
    };

    //#region [khởi tạo - check đăng ký hộ, lấy các dữ liệu cho control, lấy giá trị mặc đinh]
    refreshView = () => {
        // this.props.navigation.setParams({ title: 'HRM_Category_ShiftItem_Overtime_Create_Title' });
        this.setVariable();
        this.setState(initSateDefault, () => this.getConfigValid());
    };
    //promise get config valid

    getConfigValid = () => {
        let { fieldConfig, params } = this.state;

        const tblName = 'HumanResources_FormRegisterStopWorking';
        HttpService.MultiRequest([
            HttpService.Get(`[URI_CENTER]/api/Sys_common/GetValidateJson?listFormId=${tblName}`),
            HttpService.Post('[URI_CENTER]/api/Hre_GetData/GetByFieldSysCodeConfig', { TableName: 'Hre_StopWorking' }),
            HttpService.Post('[URI_CENTER]/api/Hre_StopWorking/GetByIDStopWoking', {
                ID: params?.record ? params?.record.ID : null
            })
        ]).then((resAll) => {
            const [res, codeConfig, cogBtnSurvey] = resAll;
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
            if (codeConfig && codeConfig.Status == EnumName.E_SUCCESS && codeConfig.Data && codeConfig.Data[0])
                fieldConfig = {
                    ...fieldConfig,
                    DecisionNo: {
                        ...fieldConfig.DecisionNo,
                        disable: codeConfig.Data[0].IsEdit
                    }
                };

            this.setState(
                {
                    fieldConfig,
                    isShowBtnSurvey:
                        cogBtnSurvey?.Data?.StatusButton && cogBtnSurvey?.Data?.StatusButton == EnumName.E_SHOW
                            ? true
                            : false
                },
                () => {
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
                }
            );
        });
    };

    componentDidMount() {
        //get config validate
        // this.getConfigValid('New_Portal_Att_Overtime')
    }

    handleSetState = (response) => {
        const { UserApprove, UserApprove3, UserApprove4, UserApprove2 } = this.state;

        this.levelApprove = response.LevelApproved ? response.LevelApproved : 4;

        let nextState = {
            isShowModal: true,
            ID: response.ID,
            Profile: {
                ID: response.ProfileID,
                ProfileName: response.ProfileName
            },

            UserApprove: {
                ...UserApprove,
                value: response.ApprovalProcess[1]
                    ? {
                        UserInfoName: response.ApprovalProcess[1].UserInfoName,
                        ID: response.ApprovalProcess[1].UserApproveID,
                        AvatarURI: response.ApprovalProcess[1].ImagePath
                            ? response.ApprovalProcess[1].ImagePath
                            : null
                    }
                    : null,
                disable: true,
                refresh: !UserApprove.refresh
            },
            UserApprove3: {
                ...UserApprove3,
                value: response.ApprovalProcess[3]
                    ? {
                        UserInfoName: response.ApprovalProcess[3].UserInfoName,
                        ID: response.ApprovalProcess[3].UserApproveID3,
                        AvatarURI: response.ApprovalProcess[3].ImagePath
                            ? response.ApprovalProcess[3].ImagePath
                            : null
                    }
                    : null,
                disable: true,
                refresh: !UserApprove3.refresh
            },
            UserApprove4: {
                ...UserApprove4,
                value: response.ApprovalProcess[4]
                    ? {
                        UserInfoName: response.ApprovalProcess[4].UserInfoName,
                        ID: response.ApprovalProcess[4].UserApproveID4,
                        AvatarURI: response.ApprovalProcess[4].ImagePath
                            ? response.ApprovalProcess[4].ImagePath
                            : null
                    }
                    : null,
                disable: true,
                refresh: !UserApprove4.refresh
            },
            UserApprove2: {
                ...UserApprove2,
                value: response.ApprovalProcess[2]
                    ? {
                        UserInfoName: response.ApprovalProcess[2].UserInfoName,
                        ID: response.ApprovalProcess[2].UserApproveID2,
                        AvatarURI: response.ApprovalProcess[2].ImagePath
                            ? response.ApprovalProcess[2].ImagePath
                            : null
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
            },
            isShowModal: true
        };

        this.setState(nextState, () => {
            //[CREATE] Step 4: Lấy cấp duyệt .
            this.getHighSupervisor();
            // const { params } = this.state;
            // if (params && params.listItem && params.listItem.length > 0) {
            //   // let listday = params.listItem.map((item) => moment(item.WorkDate).format('YYYY-MM-DD'))
            //   // this.setState({
            //   //   DateFromTo: {
            //   //     ...DateFromTo,
            //   //     value: listday ? listday : [],
            //   //     refresh: !DateFromTo.refresh,
            //   //   },
            //   //   isShowModal: true,
            //   // })
            // }
            // else {
            //   // Show modal chọn ngày đăng ký
            //   if (this.refVnrDateFromTo && this.refVnrDateFromTo.showModal) {
            //     this.refVnrDateFromTo.showModal();
            //   }
            // }
        });
    };

    getHighSupervisor = (params = {}) => {
        const { Profile } = this.state;
        const { LastWorkingDay, RequestDate, DateStop, ResignReasonID, TypeOfStopID } = params;
        if (LastWorkingDay && DateStop) {
            const dataBody = {
                ProfileID: Profile.ID,
                UserSubmit: Profile.ID,
                Type: 'E_STOPWORKING',
                LastWorkingDay: LastWorkingDay,
                RequestDate: RequestDate,
                DateStop: DateStop,
                ResignReasonID: ResignReasonID,
                TypeOfStopID: TypeOfStopID
            };

            this.showLoading(true);
            HttpService.Post('[URI_CENTER]/api/Hre_StopWorking/GetUserApproveWithType', dataBody).then((resData) => {
                if (resData.Status == EnumName.E_SUCCESS) {
                    const result = resData.Data;
                    const { UserApprove, UserApprove2, UserApprove3, UserApprove4 } = this.state;
                    let nextState = {
                        UserApprove: { ...UserApprove },
                        UserApprove2: { ...UserApprove2 },
                        UserApprove3: { ...UserApprove3 },
                        UserApprove4: { ...UserApprove4 }
                    };

                    this.levelApprove = result.length;
                    result.forEach((item) => {
                        if (item.FieldName == 'UserApprove1') {
                            nextState = {
                                ...nextState,
                                UserApprove: {
                                    ...nextState.UserApprove,
                                    disable: true,
                                    visible: item.IsShow,
                                    value: {
                                        UserInfoName: item.UserInfoName,
                                        ID: item.UserApproveID,
                                        AvatarURI: item.ImagePath
                                    }
                                }
                            };
                        }

                        if (item.FieldName == 'UserApprove2') {
                            nextState = {
                                ...nextState,
                                UserApprove2: {
                                    ...nextState.UserApprove2,
                                    disable: true,
                                    visible: item.IsShow,
                                    value: {
                                        UserInfoName: item.UserInfoName,
                                        ID: item.UserApproveID2,
                                        AvatarURI: item.ImagePath
                                    }
                                }
                            };
                        }

                        if (item.FieldName == 'UserApprove3') {
                            nextState = {
                                ...nextState,
                                UserApprove3: {
                                    ...nextState.UserApprove3,
                                    disable: true,
                                    visible: item.IsShow,
                                    value: {
                                        UserInfoName: item.UserInfoName,
                                        ID: item.UserApproveID3,
                                        AvatarURI: item.ImagePath
                                    }
                                }
                            };
                        }

                        if (item.FieldName == 'UserApprove4') {
                            nextState = {
                                ...nextState,
                                UserApprove4: {
                                    ...nextState.UserApprove4,
                                    disable: true,
                                    visible: item.IsShow,
                                    value: {
                                        UserInfoName: item.UserInfoName,
                                        ID: item.UserApproveID4,
                                        AvatarURI: item.ImagePath
                                    }
                                }
                            };
                        }
                    });

                    this.setState(nextState, () => {});
                }
                this.showLoading(false);
            });
        }
    };

    refreshForm = () => {
        this.AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            title: 'HRM_PortalApp_OnReset',
            message: 'HRM_PortalApp_OnReset_Message',
            onCancel: () => {},
            onConfirm: () => {
                const { params } = this.state;

                let { record } = params;

                if (!record) {
                    // nếu bấm refresh lấy lại cấp duyệt
                    this.getHighSupervisor();
                } else {
                    // Nếu bấm refresh khi Chỉnh sửa
                    this.isModify = true;
                    this.getRecordAndConfigByID(record, this.handleSetState);
                }

                Object.keys(this.listRefGetDataSave).map((key) => {
                    if (this.listRefGetDataSave[key]) {
                        this.listRefGetDataSave[key].unduData();
                    }
                });
            }
        });
    };

    //#endregion

    //#region [lưu]
    onAcSurvey = () => {
        this.showLoading(true);
        const { Profile } = this.state;

        let payload = this.getPayload();
        HttpService.Post('[URI_CENTER]/api/Hre_StopWorking/New_ButtonContinueTheSurveyStopWorking', {
            ProfileID: Profile ? Profile.ID : null
        }).then((res) => {
            this.showLoading(false);
            if (res && res.Status == EnumName.E_SUCCESS) {
                const { StatusButton, ActionStatus, SurveyPortalID, SurveyProfileID } = res.Data;
                if (StatusButton == EnumName.E_HIDE || StatusButton == EnumName.E_READONLY) {
                    this.ToasterSevice.showWarning(ActionStatus ? ActionStatus : 'Hrm_Fail', 4000);
                } else if (ActionStatus && typeof ActionStatus == 'string') {
                    this.ToasterSevice.showWarning(ActionStatus, 4000);
                } else if (SurveyPortalID) {
                    this.onClose();
                    DrawerServices.navigate('HreSurveyEmployeeViewDetail', {
                        dataId: SurveyPortalID,
                        isSurveyTermination: true,
                        payloadTermination: payload,
                        surveyProfileID: SurveyProfileID
                    });
                } else {
                    this.ToasterSevice.showWarning('Hrm_Fail', 4000);
                }
            }
        });
    };

    onSaveAndSend = () => {
        this.onSave(true);
    };

    onSaveTemp = () => {
        this.AlertSevice.alert({
            iconType: EnumIcon.E_CONFIRM,
            title: 'HRM_PortalApp_OnSave_Temp',
            message: 'HRM_PortalApp_OnSave_Temp_Message',
            onCancel: () => {},
            onConfirm: () => {
                this.onSave();
            }
        });
    };

    getPayload = () => {
        const { Profile, UserApprove, UserApprove2, UserApprove3, UserApprove4, params } = this.state,
            { record } = params;

        let payload = {};
        if (this.listRefGetDataSave && Object.keys(this.listRefGetDataSave).length > 0) {
            Object.keys(this.listRefGetDataSave).map((key) => {
                if (this.listRefGetDataSave[key]) {
                    const data = this.listRefGetDataSave[key].getAllData();
                    if (data) {
                        payload = {
                            ...payload,
                            ...data
                        };
                    }
                }
            });
        }

        payload = {
            ...payload,
            ProfileIds: Profile.ID,
            userSubmit: Profile.ID,
            // UserApprove: UserApprove.value ? UserApprove.value.ID : null,
            // UserApprove4: UserApprove2.value ? UserApprove2.value.ID : null,
            // Lý do gán lại cấp duyệt thứ tự 1.2.3.4 là do server tự gán lại theo thứ tự 1.3.4.2
            UserApproveID: UserApprove && UserApprove.value ? UserApprove.value.ID : null,
            UserApproveID2: UserApprove2 && UserApprove2.value ? UserApprove2.value.ID : null,
            UserApproveID3: UserApprove3 && UserApprove3.value ? UserApprove3.value.ID : null,
            UserApproveID4: UserApprove4 && UserApprove4.value ? UserApprove4.value.ID : null
        };

        // if (isSend) {
        //   payload = {
        //     ...payload,
        //     IsAddNewAndSendMail: true,
        //   }
        // }

        if (this.isModify === true && params && record) {
            payload = {
                ...payload,
                ID: record && record.ID ? record.ID : null,
                Status: record.Status
            };
        }
        return payload;
    };

    onSave = () => {
        let payload = this.getPayload();
        this.isProcessing = true;
        this.showLoading(true);
        HttpService.Post('[URI_CENTER]api/Hre_StopWorking/CreateOrUpdateStopWorking', payload)
            .then((res) => {
                this.isProcessing = false;
                this.showLoading(false);
                if (res && typeof res === EnumName.E_object) {
                    if (res.Status == EnumName.E_SUCCESS) {
                        this.onClose();

                        ToasterSevice.showSuccess('Hrm_Succeed', 5500);

                        const { reload } = this.state?.params;
                        if (reload && typeof reload === 'function') {
                            reload();
                        }
                    } else if (res && res.Data && res.Data[0]?.description) {
                        this.ToasterSevice.showWarning(res.Data[0]?.description, 4000);
                    } else if (res.Message) {
                        this.ToasterSevice.showWarning(res.Message, 4000);
                    } else {
                        this.ToasterSevice.showWarning('Hrm_Fail', 4000);
                    }
                }
            })
            .catch((error) => {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            });
    };
    //#endregion

    onClose = () => {
        this.setState({
            isShowModal: false
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

    renderApprove = () => {
        return (
            <View style={styleComonAddOrEdit.styViewApprove}>
                <TouchableOpacity
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
                </TouchableOpacity>
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

    onScrollToInputIOS = (index, height) => {
        try {
            if (this.refFlatList && this.refFlatList.scrollToOffset && index && height) {
                setTimeout(() => {
                    this.refFlatList.scrollToOffset({ animated: true, offset: height * index - 200 });
                }, 260);
            }
        } catch (error) {
            // eslint-disable-next-line no-console
            console.log(error, 'onScrollToInputIOS');
        }
    };

    renderBtnSave = () => {
        const { isDisableBtnsave, isShowBtnSurvey } = this.state;
        if (isShowBtnSurvey) {
            if (isDisableBtnsave) {
                return (
                    <View
                        style={[
                            styleComonAddOrEdit.wrapBtnSurvey,
                            {
                                backgroundColor: Colors.gray_3,
                                borderColor: Colors.white
                            }
                        ]}
                    >
                        <IconNextForward size={Size.text + 2} color={Colors.gray_7} />
                        <VnrText
                            style={[styleSheets.lable, styleComonAddOrEdit.stySurvey, { color: Colors.gray_7 }]}
                            i18nKey={'HRM_PortalApp_NextSurvey'}
                        />
                    </View>
                );
            } else {
                return (
                    <TouchableOpacity style={[styleComonAddOrEdit.wrapBtnSurvey]} onPress={() => this.onAcSurvey()}>
                        <IconNextForward size={Size.text + 2} color={Colors.primary} />
                        <VnrText
                            style={[styleSheets.lable, styleComonAddOrEdit.stySurvey]}
                            i18nKey={'HRM_PortalApp_NextSurvey'}
                        />
                    </TouchableOpacity>
                );
            }
        } else if (isDisableBtnsave) {
            return (
                <View
                    style={[
                        styleComonAddOrEdit.wrapBtnRegister,
                        {
                            backgroundColor: Colors.gray_3
                        }
                    ]}
                >
                    <VnrText
                        style={[styleSheets.lable, styleComonAddOrEdit.styRegister, { color: Colors.gray_7 }]}
                        i18nKey={'HRM_PortalApp_Register'}
                    />
                </View>
            );
        } else {
            return (
                <TouchableOpacity style={styleComonAddOrEdit.wrapBtnRegister} onPress={() => this.onSaveAndSend()}>
                    <VnrText
                        style={[styleSheets.lable, styleComonAddOrEdit.styRegister]}
                        i18nKey={'HRM_PortalApp_Register'}
                    />
                </TouchableOpacity>
            );
        }
    };

    renderItems = () => {
        const { fieldConfig, params, isCheckEmpty } = this.state;
        const newKey = Vnr_Function.MakeId(10);
        return (
            <FlatList
                ref={(refs) => (this.refFlatList = refs)}
                style={styles.styFlatListContainer}
                data={[{}]}
                renderItem={({ item, index }) => (
                    <HreSubmitTerminationOfWorkComponent
                        key={item}
                        ref={(refCom) => {
                            this.listRefGetDataSave[`${newKey}`] = refCom;
                        }}
                        levelApprove={this.levelApprove}
                        acIsCheckEmpty={isCheckEmpty}
                        onUpdateDay={this.onUpdateDay}
                        indexDay={index}
                        record={params?.record}
                        fieldConfig={fieldConfig}
                        showLoading={this.showLoading}
                        ToasterSevice={() => this.ToasterSeviceCallBack()}
                        onScrollToInputIOS={this.onScrollToInputIOS}
                        getHighSupervisor={this.getHighSupervisor}
                        setDisableSave={this.setDisableSave}
                    />
                )}
                keyExtractor={(item, index) => index}
                ItemSeparatorComponent={() => <View style={styles.separate} />}
                ListFooterComponent={this.renderApprove}
            />
        );
    };

    onChangeUserApprove = (item) => {
        const { UserApprove } = this.state;
        let nextState = {
            UserApprove: {
                ...UserApprove,
                value: item,
                refresh: !UserApprove.refresh
            }
        };

        if (this.levelApprove == 1) {
            const { UserApprove2, UserApprove3, UserApprove4 } = this.state;

            nextState = {
                ...nextState,
                UserApprove2: {
                    ...UserApprove2,
                    value: item ? { ...item } : null,
                    refresh: !UserApprove2.refresh
                },
                UserApprove3: {
                    ...UserApprove3,
                    value: item ? { ...item } : null,
                    refresh: !UserApprove3.refresh
                },
                UserApprove4: {
                    ...UserApprove4,
                    value: item ? { ...item } : null,
                    refresh: !UserApprove4.refresh
                }
            };
        }

        this.setState(nextState);
    };

    //change duyệt cuối
    onChangeUserApprove4 = (item) => {
        const { UserApprove4 } = this.state;
        let nextState = {
            UserApprove4: {
                ...UserApprove4,
                value: item,
                refresh: !UserApprove4.refresh
            }
        };

        if (this.levelApprove == '2') {
            const { UserApprove2, UserApprove3 } = this.state;

            // _UserApprove2.value(_UserApprove4);
            // _UserApprove3.value(_UserApprove4);
            nextState = {
                ...nextState,
                UserApprove2: {
                    ...UserApprove2,
                    value: item ? { ...item } : null,
                    refresh: !UserApprove2.refresh
                },
                UserApprove3: {
                    ...UserApprove3,
                    value: item ? { ...item } : null,
                    refresh: !UserApprove3.refresh
                }
            };
        }
        if (this.levelApprove == '3') {
            const { UserApprove3 } = this.state;

            //_UserApprove3.value(_UserApprove4);
            nextState = {
                ...nextState,
                UserApprove3: {
                    ...UserApprove3,
                    value: item ? { ...item } : null,
                    refresh: !UserApprove3.refresh
                }
            };
        }

        this.setState(nextState);
    };

    setDisableSave = (bool) => {
        this.setState({
            isDisableBtnsave: bool
        });
    };

    render() {
        const {
            Profile,
            UserApprove,
            UserApprove3,
            UserApprove4,
            UserApprove2,
            //DateFromTo,
            isShowModal,
            isShowModalApprove
        } = this.state;

        return (
            <View style={styles.container}>
                {Profile.ID && (
                    <Modal
                        animationType="slide"
                        transparent={false}
                        visible={isShowModal} //isShowModal
                        style={[CustomStyleSheet.padding(0), CustomStyleSheet.margin(0)]}
                    >
                        <SafeAreaView style={styleComonAddOrEdit.wrapInsideModal}>
                            <ToasterInModal
                                ref={(refs) => {
                                    this.ToasterSevice = refs;
                                }}
                            />
                            <AlertInModal ref={(refs) => (this.AlertSevice = refs)} />

                            <View style={styleComonAddOrEdit.flRowSpaceBetween}>
                                <VnrText
                                    style={[
                                        styleSheets.lable,
                                        styleComonAddOrEdit.styHeaderText,
                                        CustomStyleSheet.fontWeight('700')
                                    ]}
                                    i18nKey={this.isModify ? 'HRM_HR_StopWorking_Edit' : 'HRM_HR_StopWorking_AddNew'}
                                />
                                <TouchableOpacity onPress={() => this.onClose()}>
                                    <IconCancel size={Size.iconSize} color={Colors.gray_8} />
                                </TouchableOpacity>
                            </View>

                            {this._renderHeaderLoading()}

                            <KeyboardAvoidingView
                                scrollEnabled={true}
                                style={styleComonAddOrEdit.styAvoiding}
                                behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                            >
                                {this.renderItems()}
                            </KeyboardAvoidingView>

                            {/* button */}
                            <View style={styleComonAddOrEdit.wrapButtonHandler}>
                                <TouchableOpacity
                                    style={styleComonAddOrEdit.btnRefresh}
                                    onPress={() => this.refreshForm()}
                                >
                                    <Image
                                        style={{ width: Size.iconSize, height: Size.iconSize }}
                                        resizeMode="cover"
                                        source={require('../../../../../assets/images/vnrDateFromTo/reset-sm.png')}
                                    />
                                </TouchableOpacity>

                                {this.renderBtnSave()}

                                {/* <TouchableOpacity style={styleComonAddOrEdit.btnSaveTemp} onPress={() => this.onSaveTemp()}>
                    <IconSave size={Size.iconSize} color={'#000'} />
                  </TouchableOpacity> */}
                            </View>

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
                                                    i18nKey={`${
                                                        this.levelApprove ? this.levelApprove : '0'
                                                    } ${translate('HRM_PortalApp_Approval_Level')}`}
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

                                                {UserApprove2.visible && UserApprove2.visibleConfig && (
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
                                                                this.setState({
                                                                    UserApprove2: {
                                                                        ...UserApprove2,
                                                                        value: item,
                                                                        refresh: !UserApprove2.refresh
                                                                    }
                                                                });
                                                            }}
                                                        />
                                                    </View>
                                                )}

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
                                                            this.onChangeUserApprove4(item);
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                        </SafeAreaView>
                                    </View>
                                </View>
                            ) : null}
                        </SafeAreaView>
                    </Modal>
                )}
            </View>
        );
    }
}

const styles = styleComonAddOrEdit;
