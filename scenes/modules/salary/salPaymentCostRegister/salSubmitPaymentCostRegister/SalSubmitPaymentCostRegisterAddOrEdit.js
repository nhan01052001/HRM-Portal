import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    Size,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import HttpService from '../../../../../utils/HttpService';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName } from '../../../../../assets/constant';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { IconPublish } from '../../../../../constants/Icons';

let enumName = null,
    profileInfo = null;

export default class SalSubmitPaymentCostRegisterAddOrEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ProfileID: {
                ID: null,
                ProfileName: '',
                label: 'HRM_HR_Employees'
            },
            RequestPeriod: {
                label: 'HRM_Sal_PaymentCostRegister_RequestPeriod',
                api: {
                    urlApi: '[URI_HR]/Att_GetData/GetMultiCutOffDuration',
                    type: 'E_GET'
                },
                valueField: 'ID',
                textField: 'CutOffDurationName',
                data: [],
                disable: false,
                refresh: false,
                value: null,
                visibleConfig: true,
                visible: true
            },
            PaymentPeriod: {
                label: 'HRM_Sal_PaymentCostRegister_PayPeriod',
                api: {
                    urlApi: '[URI_HR]/Att_GetData/GetMultiCutOffDuration',
                    type: 'E_GET'
                },
                valueField: 'ID',
                textField: 'CutOffDurationName',
                data: [],
                disable: false,
                refresh: false,
                value: null,
                visibleConfig: true,
                visible: true
            },
            UserApproveID: {
                label: 'HRM_Attendance_Overtime_UserApproveID',
                api: {
                    urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_SALPAYEXPENSE',
                    type: 'E_GET'
                },
                data: [],
                valueField: 'ID',
                textField: 'UserInfoName',
                disable: true,
                visible: false,
                refresh: false,
                value: null,
                visibleConfig: false
            },
            UserApproveID2: {
                label: 'HRM_Attendance_Overtime_UserApproveID3',
                api: {
                    urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_SALPAYEXPENSE',
                    type: 'E_GET'
                },
                data: [],
                valueField: 'ID',
                textField: 'UserInfoName',
                disable: true,
                visible: false,
                refresh: false,
                value: null,
                visibleConfig: false
            },
            UserApproveID3: {
                label: 'HRM_Attendance_Leaveday_UserApproveID4',
                api: {
                    urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_SALPAYEXPENSE',
                    type: 'E_GET'
                },
                data: [],
                valueField: 'ID',
                textField: 'UserInfoName',
                disable: true,
                visible: false,
                refresh: false,
                value: null,
                visibleConfig: false
            },
            UserApproveID4: {
                label: 'HRM_Attendance_Overtime_UserApproveID2',
                api: {
                    urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_SALPAYEXPENSE',
                    type: 'E_GET'
                },
                data: [],
                valueField: 'ID',
                textField: 'UserInfoName',
                disable: true,
                visible: false,
                refresh: false,
                value: null,
                visibleConfig: false
            },
            IsTransfer: false,
            fieldValid: {}
        };

        //set title screen
        props.navigation.setParams({
            title:
                props.navigation.state.params && props.navigation.state.params.record
                    ? 'HRM_Sal_PaymentCostRegister_Edit_Title'
                    : 'HRM_Sal_PaymentCostRegister_Create_Title'
        });

        //biến trạng thái
        this.isModify = false;
        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;

        this.levelApproved = null;
        this.isOnlyOneLevelApprove = null;
    }

    //#region [khởi tạo - lấy các dữ liệu cho control, lấy giá trị mặc đinh]

    //promise get config valid
    getConfigValid = (tblName) => {
        return HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName);
    };

    componentDidMount() {
        //get config validate
        VnrLoadingSevices.show();
        this.getConfigValid('New_Sal_PaymentCostRegister').then((res) => {
            VnrLoadingSevices.hide();
            if (res) {
                try {
                    //map field hidden by config
                    const _configField =
                        ConfigField && ConfigField.value['SalSubmitPaymentCostRegisterAddOrEdit']
                            ? ConfigField.value['SalSubmitPaymentCostRegisterAddOrEdit']['Hidden']
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

                        let { record } = this.props.navigation.state.params;

                        //get config khi đăng ký
                        if (!record) {
                            this.initData();
                        } else {
                            this.isModify = true;
                            this.handleSetState(record);
                        }
                    });
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            }
        });
    }

    initData = () => {
        const { E_ProfileID, E_FullName } = enumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] },
            { ProfileID } = this.state;

        let nextState = {
            ProfileID: {
                ...ProfileID,
                ..._profile
            }
        };

        this.setState(nextState, () => {
            this.loadUserApprovedByConfig();
        });
    };

    loadUserApprovedByConfig = () => {
        const { ProfileID, UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4 } = this.state;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Sal_GetData/GetHighSuppervisorApproveEvaluation', {
            userSubmit: ProfileID.ID,
            ProfileID: ProfileID.ID
        }).then((data) => {
            VnrLoadingSevices.hide();

            if (data != null) {
                let nextState = {
                    UserApproveID: { ...UserApproveID },
                    UserApproveID2: { ...UserApproveID2 },
                    UserApproveID3: { ...UserApproveID3 },
                    UserApproveID4: { ...UserApproveID4 }
                };

                this.levelApproved = data.LevelApprove;
                if (data.LevelApprove == '1' || data.LevelApprove == '2') {
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

                    if (data.LevelApprove == '1') {
                        if (data.SupervisorID != null) {
                            nextState = {
                                UserApproveID: {
                                    ...nextState.UserApproveID,
                                    value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID }
                                },
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID }
                                },
                                UserApproveID3: {
                                    ...nextState.UserApproveID3,
                                    value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID }
                                },
                                UserApproveID4: {
                                    ...nextState.UserApproveID4,
                                    value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID }
                                }
                            };
                        }
                    }
                    if (data.LevelApprove == '2') {
                        if (data.IsOnlyOneLevelApprove == true) {
                            this.isOnlyOneLevelApprove = true;
                            if (data.SupervisorID != null) {
                                nextState = {
                                    UserApproveID: {
                                        ...nextState.UserApproveID,
                                        value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID }
                                    },
                                    UserApproveID2: {
                                        ...nextState.UserApproveID2,
                                        value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID }
                                    },
                                    UserApproveID3: {
                                        ...nextState.UserApproveID3,
                                        value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID }
                                    },
                                    UserApproveID4: {
                                        ...nextState.UserApproveID4,
                                        value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID }
                                    }
                                };
                            }
                        } else {
                            if (data.SupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApproveID: {
                                        ...nextState.UserApproveID,
                                        value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID }
                                    }
                                };
                            }
                            if (data.MidSupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApproveID2: {
                                        ...nextState.UserApproveID2,
                                        value: { UserInfoName: data.SupervisorNextName, ID: data.MidSupervisorID }
                                    },
                                    UserApproveID3: {
                                        ...nextState.UserApproveID3,
                                        value: { UserInfoName: data.SupervisorNextName, ID: data.MidSupervisorID }
                                    },
                                    UserApproveID4: {
                                        ...nextState.UserApproveID4,
                                        value: { UserInfoName: data.SupervisorNextName, ID: data.MidSupervisorID }
                                    }
                                };
                            }
                        }
                    }
                } else if (data.LevelApprove == '3') {
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
                    if (data.SupervisorID != null) {
                        nextState = {
                            ...nextState,
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID }
                            }
                        };
                    }
                    if (data.MidSupervisorID != null) {
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: { UserInfoName: data.SupervisorNextName, ID: data.MidSupervisorID }
                            }
                        };
                    }
                    if (data.NextMidSupervisorID != null) {
                        nextState = {
                            ...nextState,
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                value: { UserInfoName: data.NextMidSupervisorName, ID: data.NextMidSupervisorID }
                            },
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: { UserInfoName: data.NextMidSupervisorName, ID: data.NextMidSupervisorID }
                            }
                        };
                    }
                } else if (data.LevelApprove == '4') {
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
                    if (data.SupervisorID != null) {
                        nextState = {
                            ...nextState,
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                value: { UserInfoName: data.SupervisorName, ID: data.SupervisorID }
                            }
                        };
                    }
                    if (data.MidSupervisorID != null) {
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: { UserInfoName: data.SupervisorNextName, ID: data.MidSupervisorID }
                            }
                        };
                    }
                    if (data.NextMidSupervisorID != null) {
                        nextState = {
                            ...nextState,
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                value: { UserInfoName: data.NextMidSupervisorName, ID: data.NextMidSupervisorID }
                            }
                        };
                    }
                    if (data.HighSupervisorID != null) {
                        nextState = {
                            ...nextState,
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: { UserInfoName: data.HighSupervisorName, ID: data.HighSupervisorID }
                            }
                        };
                    }
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
            }
        });
    };

    handleSetState = (item) => {
        const {
            ProfileID,
            RequestPeriod,
            PaymentPeriod,
            UserApproveID,
            UserApproveID2,
            UserApproveID3,
            UserApproveID4
        } = this.state;

        let nextState = {};

        nextState = {
            ID: item.ID,
            ProfileID: {
                ...ProfileID,
                ID: item.ProfileID,
                ProfileName: item.ProfileName
            },
            IsTransfer:
                item.IsTransfer && (item.IsTransfer == 'True' || item.IsTransfer == 'true' || item.IsTransfer == true)
                    ? true
                    : false,
            RequestPeriod: {
                ...RequestPeriod,
                disable: true,
                value: item.RequestPeriod
                    ? { ID: item.RequestPeriod, CutOffDurationName: item.RequestPeriodName }
                    : null,
                refresh: !RequestPeriod.refresh
            },
            PaymentPeriod: {
                ...PaymentPeriod,
                value: item.PaymentPeriod
                    ? { ID: item.PaymentPeriod, CutOffDurationName: item.PaymentPeriodName }
                    : null,
                refresh: !PaymentPeriod.refresh
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

        this.setState(nextState);
    };
    //#endregion

    onChangeRequestPeriod = (item) => {
        const { RequestPeriod, PaymentPeriod } = this.state;
        this.setState({
            RequestPeriod: {
                ...RequestPeriod,
                value: item,
                refresh: !RequestPeriod.refresh
            },
            PaymentPeriod: {
                ...PaymentPeriod,
                value: item,
                refresh: !PaymentPeriod.refresh
            }
        });
    };

    onChangePaymentPeriod = (item) => {
        const { PaymentPeriod } = this.state;
        this.setState({
            PaymentPeriod: {
                ...PaymentPeriod,
                value: item,
                refresh: !PaymentPeriod.refresh
            }
        });
    };

    CreatePeriod = (navigation) => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        const {
            ID,
            ProfileID,
            RequestPeriod,
            PaymentPeriod,
            UserApproveID,
            UserApproveID2,
            UserApproveID3,
            UserApproveID4,
            IsTransfer
        } = this.state;

        let param = {
            ProfileID: ProfileID.ID,
            RequestPeriod: RequestPeriod.value ? RequestPeriod.value.ID : null,
            PaymentPeriod: PaymentPeriod.value ? PaymentPeriod.value.ID : null,
            UserApproveID: UserApproveID.value ? UserApproveID.value.ID : null,
            UserApproveID2: UserApproveID2.value ? UserApproveID2.value.ID : null,
            UserApproveID3: UserApproveID3.value ? UserApproveID3.value.ID : null,
            UserApproveID4: UserApproveID4.value ? UserApproveID4.value.ID : null,
            IsPortal: true,
            UserSubmit: ProfileID.ID,
            UserSubmitID: ProfileID.ID,
            Status: 'E_SUBMIT_TEMP'
        };

        if (ID) {
            param = {
                ...param,
                ID
            };
        }

        if (this.isModify)
            param = {
                ...param,
                IsTransfer: IsTransfer
            };

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Sal_GetData/ValidatePaymentCost', param).then((data) => {
            VnrLoadingSevices.hide();

            //xử lý lại event Save
            this.isProcessing = false;

            if (data) {
                if (data.Success == true) {
                    this.onSavePeriod(param, navigation);
                } else {
                    ToasterSevice.showWarning(data.Messenger);
                }
            }
        });
    };

    onSavePeriod = (param, navigation) => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Sal_PaymentCostRegister', param).then((data) => {
            VnrLoadingSevices.hide();

            if (data.ActionStatus == 'Success') {
                param = {
                    ...param,
                    ID: data.ID
                };

                const { reload, record } = navigation.state.params;

                if (record) {
                    if (reload && typeof reload === 'function') {
                        reload();
                    }

                    navigation.navigate('SalSubmitPaymentCostRegisterAddPay', { MasterData: param, reload });
                } else {
                    navigation.navigate('SalSubmitPaymentCostRegisterAddPay', { MasterData: param, reload });
                }
            } else {
                ToasterSevice.showWarning(data.ActionStatus);
            }
        });
    };

    render() {
        const {
                RequestPeriod,
                PaymentPeriod,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4,
                fieldValid
            } = this.state,
            { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                    >
                        {/* Kỳ yêu cầu - RequestPeriod */}
                        {RequestPeriod.visibleConfig && RequestPeriod.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={RequestPeriod.label} />

                                    {/* valid RequestPeriod */}
                                    {fieldValid.RequestPeriod && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={RequestPeriod.api}
                                        refresh={RequestPeriod.refresh}
                                        textField={RequestPeriod.textField}
                                        valueField={RequestPeriod.valueField}
                                        filter={true}
                                        value={RequestPeriod.value}
                                        filterServer={false}
                                        disable={RequestPeriod.disable}
                                        onFinish={(item) => this.onChangeRequestPeriod(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Kỳ thanh toán - PaymentPeriod */}
                        {PaymentPeriod.visibleConfig && PaymentPeriod.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PaymentPeriod.label} />

                                    {/* valid PaymentPeriod */}
                                    {fieldValid.PaymentPeriod && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={PaymentPeriod.api}
                                        refresh={PaymentPeriod.refresh}
                                        textField={PaymentPeriod.textField}
                                        valueField={PaymentPeriod.valueField}
                                        filter={true}
                                        value={PaymentPeriod.value}
                                        filterServer={false}
                                        disable={PaymentPeriod.disable}
                                        onFinish={(item) => this.onChangePaymentPeriod(item)}
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
                                        api={UserApproveID.api}
                                        refresh={UserApproveID.refresh}
                                        textField="UserInfoName"
                                        valueField="ID"
                                        filter={true}
                                        value={UserApproveID.value}
                                        filterServer={true}
                                        filterParams="text"
                                        disable={UserApproveID.disable}
                                        onFinish={() => {}}
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
                                        api={UserApproveID2.api}
                                        value={UserApproveID2.value}
                                        refresh={UserApproveID2.refresh}
                                        textField="UserInfoName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={true}
                                        filterParams="text"
                                        disable={UserApproveID2.disable}
                                        onFinish={() => {}}
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
                                        api={UserApproveID3.api}
                                        value={UserApproveID3.value}
                                        refresh={UserApproveID3.refresh}
                                        textField="UserInfoName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={true}
                                        filterParams="text"
                                        disable={UserApproveID3.disable}
                                        onFinish={() => {}}
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
                                        api={UserApproveID4.api}
                                        refresh={UserApproveID4.refresh}
                                        textField="UserInfoName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={true}
                                        value={UserApproveID4.value}
                                        filterParams="text"
                                        disable={UserApproveID4.disable}
                                        onFinish={() => {}}
                                    />
                                </View>
                            </View>
                        )}
                    </KeyboardAwareScrollView>

                    <View style={styles.groupButton}>
                        <TouchableOpacity
                            onPress={() => this.CreatePeriod(this.props.navigation)}
                            style={styles.groupButton__button_save}
                        >
                            <IconPublish size={Size.iconSize} color={Colors.white} />
                            <VnrText
                                style={[styleSheets.lable, styles.groupButton__text]}
                                i18nKey={'HRM_Common_Save'}
                            />
                        </TouchableOpacity>
                    </View>
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
    groupButton__button_save: {
        height: Size.heightButton,
        borderRadius: styleSheets.radius_5,
        backgroundColor: Colors.primary,
        flex: 5,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    groupButton__text: {
        marginLeft: 5,
        color: Colors.white
    }
});
