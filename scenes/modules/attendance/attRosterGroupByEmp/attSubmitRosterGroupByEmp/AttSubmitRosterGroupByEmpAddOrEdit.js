import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Size,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    stylesModalPopupBottom,
    styleViewTitleForGroup,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { IconColse } from '../../../../../constants/Icons';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import HttpService from '../../../../../utils/HttpService';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { translate } from '../../../../../i18n/translate';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { EnumName, EnumIcon } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../utils/DrawerServices';
import moment from 'moment';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import Modal from 'react-native-modal';

let enumName = null,
    profileInfo = null;

const initSateDefault = {
    ProfileID: {
        ID: null,
        ProfileName: ''
    },
    DateStart: {
        label: 'HRM_Att_RosterGroupByEmp_DateEffective',
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true,
        disable: false
    },
    DateEnd: {
        label: 'HRM_Att_RosterGroupByEmp_DateEffective',
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true,
        disable: false
    },
    RosterGroupTypeID: {
        label: 'HRM_Att_RosterGroupByOrganization_RosterGroupType',
        api: {
            urlApi: '[URI_HR]/Cat_GetData/GetMultiRosterGroupTypeCodeName',
            type: 'E_GET'
        },
        valueField: 'ID',
        textField: 'RosterGroupTypeName',
        data: [],
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    RosterGroupRoot: {
        label: 'HRM_Att_RosterGroupByEmp_RosterGroupRoot',
        disable: true,
        value: '',
        refresh: false,
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
    FileAttach: {
        label: 'HRM_Att_BusinessTravel_FileAttachment',
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },
    UserApproveID: {
        label: 'HRM_Attendance_TAMScanLog_UserApproveID',
        api: {
            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_ROSTERGROUPBYEMP',
            type: 'E_GET'
        },
        data: [],
        valueField: 'ID',
        textField: 'UserInfoName',
        disable: false,
        visible: true,
        refresh: false,
        value: null,
        visibleConfig: true
    },
    UserApproveID2: {
        label: 'HRM_Attendance_TAMScanLog_UserApproveID3',
        api: {
            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_ROSTERGROUPBYEMP',
            type: 'E_GET'
        },
        data: [],
        valueField: 'ID',
        textField: 'UserInfoName',
        disable: false,
        visible: false,
        refresh: false,
        value: null,
        visibleConfig: true
    },
    UserApproveID3: {
        label: 'HRM_Attendance_TAMScanLog_UserApproveID4',
        api: {
            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_ROSTERGROUPBYEMP',
            type: 'E_GET'
        },
        data: [],
        valueField: 'ID',
        textField: 'UserInfoName',
        disable: false,
        visible: false,
        refresh: false,
        value: null,
        visibleConfig: true
    },
    UserApproveID4: {
        label: 'HRM_Attendance_TAMScanLog_UserApproveID2',
        api: {
            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_ROSTERGROUPBYEMP',
            type: 'E_GET'
        },
        data: [],
        valueField: 'ID',
        textField: 'UserInfoName',
        disable: false,
        visible: true,
        refresh: false,
        value: null,
        visibleConfig: true
    },
    fieldValid: {},
    dataError: null,
    modalErrorDetail: {
        isModalVisible: false,
        cacheID: null,
        data: []
    }
};

export default class AttSubmitRosterGroupByEmpAddOrEdit extends Component {
    constructor(props) {
        super(props);
        this.state = initSateDefault;

        this.setVariable();

        props.navigation.setParams({
            title: props.navigation.state.params.record
                ? 'HRM_Attendance_RosterGroupByEmp_Popup_Edit'
                : 'HRM_Attendance_RosterGroupByEmp_Popup_Create'
        });
    }

    setVariable = () => {
        this.isRegisterHelp = null;
        this.isChangeLevelApprove = null;
        this.isRegisterOrgOvertime = null;
        this.levelApproveRoster = 2;
        this.isOnlyOnleLevelApprove = null;
        this.isModify = false;
        this.configIsShowRoster2 = false;
        this.listWarningRoster = [];
        this.isSetFirst = true;
        this.levelApproveRosterGroupByEmp = null;
        this.levelApproveOT = null;
        this.isLevelApprove2 = null;

        this.dataMidApprove = [];
        this.dataLastApprove = [];

        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;

        this.IsContinueSave = false;
        this.ProfileRemoveIDs = null;
        this.IsRemoveAndContinue = null;
        this.CacheID = null;
    };

    refreshView = () => {
        this.props.navigation.setParams({ title: 'HRM_Attendance_RosterGroupByEmp_Popup_Create' });
        this.setVariable();

        const { DateStart, DateEnd } = this.state;

        let _initSateDefault = {
            ...initSateDefault,
            DateStart: {
                ...initSateDefault.DateStart,
                refresh: !DateStart.refresh
            },
            DateEnd: {
                ...initSateDefault.DateEnd,
                refresh: !DateEnd.refresh
            }
        };

        this.setState(_initSateDefault, () => this.getConfigValid('Att_RosterGroupByEmp', true));
    };

    //#region [xử lý group theo Message để thông báo lỗi]
    closeModal = () => {
        let nextState = {
            modalErrorDetail: {
                ...this.state.modalErrorDetail,
                isModalVisible: false
            }
        };

        this.setState(nextState);
    };

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
    //#endregion

    save = (navigation, isCreate, isSend) => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        const {
                ID,
                UserSubmitID,
                ProfileID,
                DateStart,
                DateEnd,
                RosterGroupTypeID,
                RosterGroupRoot,
                Note,
                FileAttach,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4,
                modalErrorDetail
            } = this.state,
            { apiConfig } = dataVnrStorage,
            { uriPor } = apiConfig;

        let params = {
            ProfileIds: ProfileID.ID,
            ProfileID: ProfileID.ID,
            IsPortal: true,
            Status: 'E_SUBMIT',
            IsContinueSave: this.IsContinueSave,
            SendEmailStatus: isSend ? 'E_SUBMIT' : null,
            Host: isSend ? uriPor : null,
            IsAddNewAndSendMail: isSend ? true : null,
            FileAttach: FileAttach.value ? FileAttach.value.map(item => item.fileName).join(',') : null,
            DateStart: DateStart.value ? moment(DateStart.value).format('YYYY-MM-DD HH:mm:ss') : null,
            DateEnd: DateEnd.value ? moment(DateEnd.value).format('YYYY-MM-DD HH:mm:ss') : null,
            RosterGroupTypeID: RosterGroupTypeID.value ? RosterGroupTypeID.value.ID : null,
            RosterGroupRoot: RosterGroupRoot.value,
            Note: Note.value,
            UserApproveID: UserApproveID.value ? UserApproveID.value.ID : null,
            UserApproveID2: UserApproveID2.value ? UserApproveID2.value.ID : null,
            UserApproveID3: UserApproveID3.value ? UserApproveID3.value.ID : null,
            UserApproveID4: UserApproveID4.value ? UserApproveID4.value.ID : null,
            ProfileRemoveIDs: this.ProfileRemoveIDs,
            UserSubmitID: UserSubmitID ? UserSubmitID : ProfileID.ID,
            IsRemoveAndContinue: this.IsRemoveAndContinue,
            CacheID: this.CacheID
        };

        if (ID) {
            params = {
                ...params,
                ID
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Att_RosterGroupByEmp', params).then(data => {
            VnrLoadingSevices.hide();
            try {
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
                                        this.save(navigation, isCreate, isSend);
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
                                    this.save(navigation, isCreate, isSend);
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

                        const { reload } = navigation.state.params;
                        if (reload && typeof reload === 'function') {
                            reload();
                        }
                    } else if (typeof data.ActionStatus === 'string') {
                        ToasterSevice.showWarning(translate(data.ActionStatus), 4000);

                        //xử lý lại event Save
                        this.isProcessing = false;
                    }
                } else {
                    DrawerServices.navigate('ErrorScreen', {
                        ErrorDisplay: { AttSubmitRosterAddOrEdit: 'Error create roster' }
                    });
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    saveAndCreate = navigation => {
        this.save(navigation, true, null);
    };

    saveAndSend = navigation => {
        this.save(navigation, null, true);
    };

    getConfigValid = (tblName, isRefresh) => {
        VnrLoadingSevices.show();
        HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName).then(res => {
            VnrLoadingSevices.hide();
            if (res) {
                try {
                    //map field hidden by config
                    const _configField =
                        ConfigField && ConfigField.value['AttSubmitRosterGroupByEmpAddOrEdit']
                            ? ConfigField.value['AttSubmitRosterGroupByEmpAddOrEdit']['Hidden']
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
                            this.isRegisterHelp = false;
                            this.initData(null);
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
        this.getConfigValid('Att_RosterGroupByEmp');
    }

    handleSetState = (response, res) => {
        const GetReadOnlyApproverControl = res[0],
            GetLevelApproveRosterGroupByEmp = res[1],
            {
                DateStart,
                DateEnd,
                RosterGroupTypeID,
                RosterGroupRoot,
                Note,
                FileAttach,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4
            } = this.state;

        let nextState = {
            ID: response.ID,
            UserSubmitID: response['UserSubmitID'],
            FileAttach: {
                ...FileAttach,
                value: response['lstFileAttach'],
                refresh: !FileAttach.refresh
            },
            RosterGroupRoot: {
                ...RosterGroupRoot,
                value: response['RosterGroupRoot'],
                refresh: !RosterGroupRoot.refresh
            },
            UserApproveID: {
                ...UserApproveID,
                refresh: !UserApproveID.refresh,
                value: response['UserApproveID']
                    ? { UserInfoName: response['FirstApproverName'], ID: response['UserApproveID'] }
                    : null
            },
            UserApproveID2: {
                ...UserApproveID2,
                refresh: !UserApproveID2.refresh,
                value: response['UserApproveID2']
                    ? { UserInfoName: response['MidApproverName'], ID: response['UserApproveID2'] }
                    : null
            },
            UserApproveID3: {
                ...UserApproveID3,
                refresh: !UserApproveID3.refresh,
                value: response['UserApproveID3']
                    ? { UserInfoName: response['NextApproverName'], ID: response['UserApproveID3'] }
                    : null
            },
            UserApproveID4: {
                ...UserApproveID4,
                refresh: !UserApproveID4.refresh,
                value: response['UserApproveID4']
                    ? { UserInfoName: response['LastApproverName'], ID: response['UserApproveID4'] }
                    : null
            },
            ProfileID: {
                ID: response['ProfileID'],
                ProfileName: response['ProfileName']
            },
            DateStart: {
                ...DateStart,
                refresh: !DateStart.refresh,
                value: response['DateStart']
            },
            DateEnd: {
                ...DateEnd,
                refresh: !DateEnd.refresh,
                value: response['DateEnd']
            },
            RosterGroupTypeID: {
                ...RosterGroupTypeID,
                refresh: !RosterGroupTypeID.refresh,
                value: response['RosterGroupTypeID']
                    ? { ID: response['RosterGroupTypeID'], RosterGroupTypeName: response['RosterGroupTypeName'] }
                    : null
            },
            Note: {
                ...Note,
                value: response['Note'],
                refresh: !Note.refresh
            }
        };

        if (!GetReadOnlyApproverControl) {
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

        this.levelApproveRosterGroupByEmp = GetLevelApproveRosterGroupByEmp;
        if (GetLevelApproveRosterGroupByEmp == 4) {
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
        } else if (GetLevelApproveRosterGroupByEmp == 3) {
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

        this.isRegisterHelp = false;

        this.setState(nextState);
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        const { ProfileID, DateEnd, DateStart, RosterGroupName } = record;
        VnrLoadingSevices.show();
        HttpService.MultiRequest([
            HttpService.Post('[URI_HR]/Att_GetData/GetReadOnlyApproverControl', { profileID: ProfileID }),
            HttpService.Post('[URI_HR]/Att_GetData/GetLevelApproveRosterGroupByEmp', {
                ProfileID: ProfileID,
                userSubmit: ProfileID,
                dateStart: DateStart ? moment(DateStart).format('YYYY-MM-DD HH:mm:ss') : null,
                dateEnd: DateEnd ? moment(DateEnd).format('YYYY-MM-DD HH:mm:ss') : null,
                rosterGroupName: RosterGroupName
            })
        ]).then(res => {
            VnrLoadingSevices.hide();
            try {
                if (res && res.length == 2) {
                    _handleSetState(record, res);
                } else {
                    DrawerServices.navigate('ErrorScreen');
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    loadHighSupervisor_RosterGroupByEmp = () => {
        this.GetHighSupervior();
    };

    GetHighSupervior = () => {
        const { ProfileID, UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4 } = this.state;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetHighSupervisor', {
            ProfileID: ProfileID.ID,
            userSubmit: ProfileID.ID,
            type: 'E_ROSTERGROUPBYEMP'
            //missionPlaceType: "",
            //resource: filterResource
        }).then(result => {
            VnrLoadingSevices.hide();
            // if (result.MidSupervisorID)
            //     isSet = false;

            // var multiUserApproveID = $(frm + ' #' + control1).data('kendoComboBox'),
            //     multiUserApproveID2 = $(frm + ' #' + control2).data('kendoComboBox'),
            //     multiUserApproveID3 = $(frm + ' #' + control3).data('kendoComboBox'),
            //     multiUserApproveID4 = $(frm + ' #' + control4).data('kendoComboBox');

            let nextState = {
                    UserApproveID: { ...UserApproveID },
                    UserApproveID2: { ...UserApproveID2 },
                    UserApproveID3: { ...UserApproveID3 },
                    UserApproveID4: { ...UserApproveID4 }
                },
                isLoadUserApprove = true;

            //truong hop chạy theo approve grade
            if (result.LevelApprove > 0) {
                if (result.IsChangeApprove == true) {
                    this.isChangeLevelApprove = true;
                }
                this.levelApproveRosterGroupByEmp = result.LevelApprove;

                if (result.LevelApprove == 2) {
                    if (result.IsOnlyOneLevelApprove) {
                        this.levelApproveRosterGroupByEmp = 1;
                        if (result.SupervisorID != null && isLoadUserApprove) {
                            // checkAddDatasource(multiUserApproveID, {
                            //     UserInfoName: result.SupervisorName,
                            //     ID: result.SupervisorID
                            // }, "ID", result.SupervisorID);
                            // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                            // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                            // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);

                            nextState = {
                                ...nextState,
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
                        if (result.SupervisorID != null && isLoadUserApprove) {
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

                        if (result.MidSupervisorID != null && isLoadUserApprove) {
                            //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                            //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                            //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
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
                    //isShowEle('#' + divControl3);
                    //isShowEle('#' + divControl4);

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
                    if (result.SupervisorID != null && isLoadUserApprove) {
                        nextState = {
                            ...nextState,
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                            }
                        };
                        //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
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

                    if (result.MidSupervisorID != null && isLoadUserApprove) {
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

                    if (result.NextMidSupervisorID != null && isLoadUserApprove) {
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
                        //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID);
                        //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID);
                    } else if (!this.isModify) {
                        //multiUserApproveID2.value(null);
                        //multiUserApproveID4.value(null);
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
                            ...nextState.UserApproveID2,
                            visible: true
                        },
                        UserApproveID3: {
                            ...nextState.UserApproveID3,
                            visible: false
                        }
                    };
                } else if (result.LevelApprove == 4) {
                    if (result.SupervisorID != null && isLoadUserApprove) {
                        nextState = {
                            ...nextState,
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                            }
                        };
                        //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
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

                    if (result.MidSupervisorID != null && isLoadUserApprove) {
                        nextState = {
                            ...nextState,
                            UserApproveID2: {
                                ...nextState.UserApproveID2,
                                value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                            }
                        };
                        //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
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

                    if (result.NextMidSupervisorID != null && isLoadUserApprove) {
                        nextState = {
                            ...nextState,
                            UserApproveID3: {
                                ...nextState.UserApproveID3,
                                value: { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }
                            }
                        };
                        //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID);
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

                    if (result.HighSupervisorID && isLoadUserApprove) {
                        nextState = {
                            ...nextState,
                            UserApproveID4: {
                                ...nextState.UserApproveID4,
                                value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                            }
                        };
                        //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
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
                            data: [...dataFirstApprove]
                        },
                        UserApproveID2: {
                            ...nextState.UserApproveID2,
                            data: [...this.dataLastApprove]
                        },
                        UserApproveID4: {
                            ...nextState.UserApproveID4,
                            data: [...this.dataMidApprove]
                        }
                    };
                } else {
                    if (result.SupervisorID != null) {
                        nextState = {
                            ...nextState,
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                            }
                        };
                        //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
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
                            ...nextState,
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
                            },
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                disable: true
                            }
                        };
                    } else {
                        // isReadOnlyComboBox($("#" + control1), false);
                        // isReadOnlyComboBox($("#" + control2), false);
                        // isReadOnlyComboBox($("#" + control3), false);
                        // isReadOnlyComboBox($("#" + control4), false);
                        nextState = {
                            ...nextState,
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
                            },
                            UserApproveID: {
                                ...nextState.UserApproveID,
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

    readOnlyCtrlRosterGroupByEmp = (isReadOnly, callback) => {
        const {
            UserApproveID,
            UserApproveID2,
            UserApproveID3,
            UserApproveID4,
            RosterGroupTypeID,
            FileAttach,
            Note
        } = this.state;

        let nextState = {};

        if (isReadOnly || this.isChangeLevelApprove) {
            // isReadOnlyComboBox($(frm + ' #UserApproveID'), isReadOnly);
            // isReadOnlyComboBox($(frm + ' #UserApproveID2'), isReadOnly);
            // isReadOnlyComboBox($(frm + ' #UserApproveID3'), isReadOnly);
            // isReadOnlyComboBox($(frm + ' #UserApproveID4'), isReadOnly);

            nextState = {
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
        // if (this.isChangeLevelApprove) {
        //     isReadOnlyComboBox($(frm + ' #UserApproveID'), isReadOnly);
        //     isReadOnlyComboBox($(frm + ' #UserApproveID2'), isReadOnly);
        //     isReadOnlyComboBox($(frm + ' #UserApproveID3'), isReadOnly);
        //     isReadOnlyComboBox($(frm + ' #UserApproveID4'), isReadOnly);
        // }
        // isReadOnlyComboBox($(frm + ' #RosterGroupTypeID'), isReadOnly);
        // isReadOnlyAttachFile($(frm + ' #FileAttach'), isReadOnly);
        // isReadOnlyInput($(frm + ' #Note'), isReadOnly);

        nextState = {
            ...nextState,
            RosterGroupTypeID: {
                ...RosterGroupTypeID,
                disable: isReadOnly,
                refresh: !RosterGroupTypeID.refresh
            },
            FileAttach: {
                ...FileAttach,
                disable: isReadOnly,
                refresh: !FileAttach.refresh
            },
            Note: {
                ...Note,
                disable: isReadOnly,
                refresh: !Note.refresh
            }
        };

        this.setState(nextState, () => {
            if (callback && typeof callback === 'function') {
                callback();
            }
        });
    };

    initData = record => {
        //sửa
        if (record) {
            this.isModify = true;
            this.getRecordAndConfigByID(record, this.handleSetState);
        } else {
            const { E_ProfileID, E_FullName } = enumName;
            let _profile = {
                ID: profileInfo[E_ProfileID],
                ProfileName: profileInfo[E_FullName]
            };
            this.setState({ ProfileID: _profile }, () => {
                this.readOnlyCtrlRosterGroupByEmp(true, this.loadHighSupervisor_RosterGroupByEmp);
            });
        }
    };

    RemoveValidateUser = () => {
        // if (co) {
        //     $(frm + ' #remove-condition1 .control-label span').text('');
        //     $(frm + ' #remove-condition2 .control-label span').text('');
        // }
        // else {
        //     $(frm + ' #remove-condition1 .control-label span').text('(*)');
        //     $(frm + ' #remove-condition2 .control-label span').text('(*)');
        // }
    };

    loadHighSupervisor = profileId => {
        if (profileId) {
            this.GetHighSupervior(profileId, 'E_ROSTER');
        } else {
            const { UserApprove, UserApprove3, UserApprove4, UserApprove2 } = this.state;
            this.setState({
                UserApprove: { ...UserApprove, value: null },
                UserApprove3: { ...UserApprove3, value: null },
                UserApprove4: { ...UserApprove4, value: null },
                UserApprove2: { ...UserApprove2, value: null }
            });
        }
    };

    GetRosterGroupTypeByEmp = () => {
        const { DateStart, DateEnd, ProfileID, RosterGroupRoot } = this.state;
        let _dateStart = DateStart.value ? moment(DateStart.value).format('YYYY-MM-DD HH:mm:ss') : null,
            _dateEnd = DateEnd.value ? moment(DateEnd.value).format('YYYY-MM-DD HH:mm:ss') : null,
            _profileID = ProfileID.ID;

        if (_dateStart) {
            HttpService.Post('[URI_HR]/Att_GetData/GetRosterGroupTypeByEmp', {
                profileID: _profileID,
                dateStart: _dateStart,
                dateEnd: _dateEnd
            }).then(result => {
                this.setState({
                    RosterGroupRoot: {
                        ...RosterGroupRoot,
                        value: result,
                        refresh: !RosterGroupRoot.refresh
                    }
                });
            });
            // $.ajax({
            //     type: 'POST',
            //     url: uriHr + 'Att_GetData/GetRosterGroupTypeByEmp',
            //     data: { profileID: _profileID[0], dateStart: _dateStart, dateEnd: _dateEnd },
            //     datatype: 'JSON',
            //     async: false,
            //     success: function (result) {
            //         $(frm + ' #RosterGroupRoot').val(result);
            //     }
            // });
        } else {
            this.setState({
                RosterGroupRoot: {
                    ...RosterGroupRoot,
                    value: null,
                    refresh: !RosterGroupRoot.refresh
                }
            });
        }
    };

    GetApprovedGradeByRosterGroupByEmp() {
        const {
            RosterGroupTypeID,
            DateStart,
            DateEnd,
            ProfileID,
            UserApproveID,
            UserApproveID2,
            UserApproveID3,
            UserApproveID4
        } = this.state;
        let _rosterGroupTypeID = RosterGroupTypeID.value ? RosterGroupTypeID.value.ID : null,
            _dateStart = DateStart.value ? moment(DateStart.value).format('YYYY-MM-DD HH:mm:ss') : null,
            _dateEnd = DateEnd.value ? moment(DateEnd.value).format('YYYY-MM-DD HH:mm:ss') : null,
            _profileID = ProfileID.ID;

        // let control1 = "UserApproveID"
        //     , control2 = "UserApproveID4"
        //     , control3 = "UserApproveID2"
        //     , control4 = "UserApproveID3"
        //     , divControl3 = "divMidApprove"
        //     , divControl4 = "divMidNextApprove";

        if (_rosterGroupTypeID && _dateStart) {
            HttpService.Post('[URI_HR]/Att_GetData/GetApprovedGradeByRosterGroupByEmp', {
                profileID: _profileID,
                rosterGroupTypeID: _rosterGroupTypeID,
                dateStart: _dateStart,
                dateEnd: _dateEnd
            }).then(result => {
                // //nguoi duyet dau
                // var multiUserApproveID = $("#" + control1).data("kendoComboBox");
                // //ng duyet cuoi
                // var multiUserApproveID2 = $("#" + control2).data("kendoComboBox");
                // //ng duyet giữa
                // var multiUserApproveID3 = $("#" + control3).data("kendoComboBox");
                // //ng duyet kết tiếp
                // var multiUserApproveID4 = $("#" + control4).data("kendoComboBox");

                let nextState = {
                    UserApproveID: { ...UserApproveID },
                    UserApproveID2: { ...UserApproveID2 },
                    UserApproveID3: { ...UserApproveID3 },
                    UserApproveID4: { ...UserApproveID4 }
                };

                //truong hop chạy theo approve grade
                if (result.LevelApprove > 0) {
                    this.levelApproveOT = result.LevelApprove;
                    if (result.IsChangeApprove == true) {
                        this.isChangeLevelApprove = true;
                    }

                    this.levelApproveRoster = result.LevelApprove;
                    if (result.IsOnlyOneLevelApprove) {
                        this.levelApproveRoster = 1;
                    }
                    if (this.isRegisterOrgOvertime) {
                        if (this.levelApproveOT == 3) {
                            //isShowEle('#divMidApprove', true);
                            nextState = {
                                ...nextState,
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    visible: true
                                }
                            };
                        } else if (this.levelApproveOT == 4) {
                            // $("#" + divControl3).show();
                            // $("#" + divControl4).show();
                            // isShowEle('#divMidApprove', true);
                            // isShowEle('#divMidNextApprove', true);
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
                        } else {
                            // isShowEle('#divMidApprove', false);
                            // isShowEle('#divMidNextApprove', false);
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
                        // Không gán người duyệt mà load tất cả người duyệt
                        // multiUserApproveID.value(null);
                        // multiUserApproveID.dataSource.read();
                        // multiUserApproveID2.value(null);
                        // multiUserApproveID2.dataSource.read();
                        // multiUserApproveID3.value(null);
                        // multiUserApproveID3.dataSource.read();
                        // multiUserApproveID4.value(null);
                        // multiUserApproveID4.dataSource.read();

                        nextState = {
                            ...nextState,
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                value: null
                            },
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
                        //////RemoveValidateUser(true);
                    } else {
                        if (result.LevelApprove == 2) {
                            if (result.IsOnlyOneLevelApprove) {
                                this.isOnlyOnleLevelApprove = true;
                                this.levelApproveRoster = 1;
                                if (result.SupervisorID != null) {
                                    // checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                                    // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                                    // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                                    // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
                                    nextState = {
                                        ...nextState,
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
                                } else if (!this.isModify) {
                                    // multiUserApproveID.value(null);
                                    // multiUserApproveID2.value(null);
                                    // multiUserApproveID3.value(null);
                                    // multiUserApproveID4.value(null);
                                    nextState = {
                                        ...nextState,
                                        UserApproveID: {
                                            ...nextState.UserApproveID,
                                            value: null
                                        },
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
                            } else {
                                this.isLevelApprove2 = true;
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
                                    // multiUserApproveID2.value(null);
                                    // multiUserApproveID3.value(null);
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
                            nextState = {
                                ...nextState,
                                UserApproveID2: {
                                    ...nextState.UserApproveID2,
                                    visible: false
                                }
                            };
                        } else if (result.LevelApprove == 3) {
                            if (result.SupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApproveID: {
                                        ...nextState.UserApproveID,
                                        value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                    }
                                };
                                //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
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
                                nextState = {
                                    ...nextState,
                                    UserApproveID2: {
                                        ...nextState.UserApproveID2,
                                        value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                    }
                                };
                                // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                            } else if (!this.isModify) {
                                nextState = {
                                    ...nextState,
                                    UserApproveID2: {
                                        ...nextState.UserApproveID2,
                                        value: null
                                    }
                                };
                                // multiUserApproveID3.value(null);
                            }

                            if (result.NextMidSupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApproveID3: {
                                        ...nextState.UserApproveID3,
                                        value: {
                                            UserInfoName: result.NextMidSupervisorName,
                                            ID: result.NextMidSupervisorID
                                        }
                                    },
                                    UserApproveID4: {
                                        ...nextState.UserApproveID4,
                                        value: {
                                            UserInfoName: result.NextMidSupervisorName,
                                            ID: result.NextMidSupervisorID
                                        }
                                    }
                                };
                                // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID);
                                // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID);
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
                                nextState = {
                                    ...nextState,
                                    UserApproveID: {
                                        ...nextState.UserApproveID,
                                        value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                    }
                                };
                                //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
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
                                nextState = {
                                    ...nextState,
                                    UserApproveID2: {
                                        ...nextState.UserApproveID2,
                                        value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                    }
                                };
                                //checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
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
                                //checkAddDatasource(multiUserApproveID4, { UserInfoName: result.NextMidSupervisorName, ID: result.NextMidSupervisorID }, "ID", result.NextMidSupervisorID);
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

                            if (result.HighSupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApproveID4: {
                                        ...nextState.UserApproveID4,
                                        value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                                    }
                                };
                                //checkAddDatasource(multiUserApproveID2, { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }, "ID", result.HighSupervisorID);
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
                                ...nextState,
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
                                },
                                UserApproveID: {
                                    ...nextState.UserApproveID,
                                    disable: true
                                }
                            };
                        }

                        if (DateStart.value && DateEnd.value) {
                            // isReadOnlyComboBox($("#" + control1), false);
                            // isReadOnlyComboBox($("#" + control2), false);
                            // isReadOnlyComboBox($("#" + control3), false);
                            // isReadOnlyComboBox($("#" + control4), false);
                            nextState = {
                                ...nextState,
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
                                },
                                UserApproveID: {
                                    ...nextState.UserApproveID,
                                    disable: false
                                }
                            };
                        }
                    }
                }

                //TH chạy không theo approvegrade
                else if (result.LevelApprove == 0) {
                    this.levelApproveRoster = 2;
                    //nếu isRegisterOrgOvertime là true nghĩa là chọn trên 1 người
                    if (this.isRegisterOrgOvertime) {
                        // Không gán người duyệt mà load tất cả người duyệt
                        // multiUserApproveID.value(null);
                        // multiUserApproveID.dataSource.read();
                        // multiUserApproveID2.value(null);
                        // multiUserApproveID2.dataSource.read();
                        // multiUserApproveID3.value(null);
                        // multiUserApproveID3.dataSource.read();
                        // multiUserApproveID4.value(null);
                        // multiUserApproveID4.dataSource.read();
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
                            },
                            UserApproveID: {
                                ...nextState.UserApproveID,
                                value: null
                            }
                        };

                        if (result.IsChangeApprove != true) {
                            // let IsReadOnlyCondition = true;
                            // if ($(frm + ' #multi-profile').is(':visible')) {
                            //     if ($(frm + ' #Profile_SelectProfileOrOrgStructureOvertimeInfo').is(':visible')) {
                            //         var countUserQuantity = $('#VnrSelectProfileOrOrgStructure_Profile_SelectProfileOrOrgStructureOvertimeInfo').val() != null ? $('#VnrSelectProfileOrOrgStructure_Profile_SelectProfileOrOrgStructureOvertimeInfo').val() : null;
                            //         if (countUserQuantity != null && countUserQuantity.length >= 2) {
                            //             IsReadOnlyCondition = false;
                            //             isReadOnlyComboBox($("#" + control1), false);//vì khi chọn 1 tên nó sẽ khóa 4 cái control lại nên khi đến cái tên thứ 2
                            //             isReadOnlyComboBox($("#" + control2), false);//nếu chí có condition là false thì 4 control vẫn bị khóa
                            //             isReadOnlyComboBox($("#" + control3), false);
                            //             isReadOnlyComboBox($("#" + control4), false);
                            //         }
                            //     }
                            //     if ($(frm + ' #OrgStructure_SelectProfileOrOrgStructureOvertimeInfo').is(':visible')) {
                            //         if ($('#strOrgStructureIDs').val().length >= 1) {
                            //             IsReadOnlyCondition = false;
                            //             isReadOnlyComboBox($("#" + control1), false);//vì khi chọn 1 tên nó sẽ khóa 4 cái control lại nên khi đổi qua chọn p ban
                            //             isReadOnlyComboBox($("#" + control2), false);//nếu chí có condition là false thì 4 control vẫn bị khóa
                            //             isReadOnlyComboBox($("#" + control3), false);
                            //             isReadOnlyComboBox($("#" + control4), false);
                            //         }
                            //     }
                            //     if (IsReadOnlyCondition == true) {
                            //         isReadOnlyComboBox($("#" + control1), true);
                            //         isReadOnlyComboBox($("#" + control2), true);
                            //         isReadOnlyComboBox($("#" + control3), true);
                            //         isReadOnlyComboBox($("#" + control4), true);
                            //     }
                            // }
                        }
                    }

                    //vì là else của isRegisterOrgOvertime nên sẽ luôn là chọn 1 người
                    else {
                        if (result.IsChangeApprove == true) {
                            this.isChangeLevelApprove = true;
                        }
                        if (result.SupervisorID != null) {
                            nextState = {
                                ...nextState,
                                UserApproveID: {
                                    ...nextState.UserApproveID,
                                    value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                }
                            };
                            // Người duyệt đầu
                            //checkAddDatasource(multiUserApproveID, { UserInfoName: result.SupervisorName, ID: result.SupervisorID }, "ID", result.SupervisorID);
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

                        // Mặc định 2 cấp. Gán bằng Hre_Profile.MidSupervisorID
                        if (result.MidSupervisorID != null) {
                            // checkAddDatasource(multiUserApproveID2, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                            // checkAddDatasource(multiUserApproveID4, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);
                            // checkAddDatasource(multiUserApproveID3, { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }, "ID", result.MidSupervisorID);

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
                            // multiUserApproveID2.value(null);
                            // multiUserApproveID3.value(null);
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
                        } else if (DateStart.value && DateEnd.value) {
                            // isReadOnlyComboBox($("#" + control1), false);
                            // isReadOnlyComboBox($("#" + control2), false);
                            // isReadOnlyComboBox($("#" + control3), false);
                            // isReadOnlyComboBox($("#" + control4), false);
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
                    ...nextState,
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
        }
    }

    onChangeUserApprove = item => {
        const { UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4 } = this.state;

        let nextState = {
            UserApproveID: {
                ...UserApproveID,
                value: item,
                refresh: !UserApproveID.refresh
            }
        };

        //nếu 1 cấp duyệt mới chạy
        if (this.levelApproveRosterGroupByEmp == 1) {
            //ẩn 3,4
            //isShowEle('#divMidApprove');
            //isShowEle('#divMidNextApprove');
            nextState = {
                ...nextState,
                UserApproveID2: {
                    ...UserApproveID2,
                    visible: false,
                    value: item ? { ...item } : null,
                    refresh: !UserApproveID2.refresh
                },
                UserApproveID3: {
                    ...UserApproveID3,
                    visible: false,
                    value: item ? { ...item } : null,
                    refresh: !UserApproveID3.refresh
                },
                UserApproveID4: {
                    ...UserApproveID4,
                    visible: false,
                    value: item ? { ...item } : null,
                    refresh: !UserApproveID4.refresh
                }
            };

            //set duyệt 2,3,4 = 1
            // var user1 = $("#UserApproveID").data("kendoComboBox"),
            //     user2 = $("#UserApproveID2").data("kendoComboBox"),
            //     user3 = $("#UserApproveID3").data("kendoComboBox"),
            //     user4 = $("#UserApproveID4").data("kendoComboBox"),
            //     _data1 = user1.dataSource.data();
            // if (!item) {
            //     user2.value([]);
            //     user3.value([]);
            //     user4.value([]);
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

    onChangeUserApprove2 = item => {
        const { UserApproveID, UserApproveID2, UserApproveID3, UserApproveID4 } = this.state;

        let nextState = {
            UserApproveID4: {
                ...UserApproveID4,
                value: item,
                refresh: !UserApproveID4.refresh
            }
        };

        //nếu 1 cấp duyệt mới chạy
        if (this.levelApproveRosterGroupByEmp == 1) {
            nextState = {
                ...nextState,
                UserApproveID2: {
                    ...UserApproveID2,
                    value: item ? { ...item } : null,
                    visible: false,
                    refresh: !UserApproveID2.refresh
                },
                UserApproveID3: {
                    ...UserApproveID3,
                    value: item ? { ...item } : null,
                    visible: false,
                    refresh: !UserApproveID3.refresh
                },
                UserApproveID: {
                    ...UserApproveID,
                    value: item ? { ...item } : null,
                    refresh: !UserApproveID.refresh
                }
            };

            // //ẩn 3,4
            // isShowEle('#divMidApprove');
            // isShowEle('#divMidNextApprove');

            // //set duyệt 2,3,4 = 1
            // var user1 = $("#UserApproveID").data("kendoComboBox"),
            //     user2 = $("#UserApproveID4").data("kendoComboBox"),
            //     user3 = $("#UserApproveID2").data("kendoComboBox"),
            //     user4 = $("#UserApproveID3").data("kendoComboBox"),
            //     _data2 = user2.dataSource.data();

            // if (user2.value().length == 0) {
            //     user1.value([]);
            //     user3.value([]);
            //     user4.value([]);
            // }
            // else {
            //     _data2.forEach(function (item) {
            //         if (item.ID == user2.value()) {
            //             checkAddDatasource(user1, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
            //             checkAddDatasource(user3, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
            //             checkAddDatasource(user4, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
            //         }
            //     });
            // }
        } else if (this.levelApproveRosterGroupByEmp == 2) {
            // var user1 = $("#UserApproveID").data("kendoComboBox"),
            //     user2 = $("#UserApproveID4").data("kendoComboBox"),
            //     user3 = $("#UserApproveID2").data("kendoComboBox"),
            //     user4 = $("#UserApproveID3").data("kendoComboBox"),
            //     _data2 = user2.dataSource.data();
            // if (user2.value().length == 0) {
            //     user3.value([]);
            //     user4.value([]);
            // }
            // else {
            //     _data2.forEach(function (item) {
            //         if (item.ID == user2.value()) {
            //             checkAddDatasource(user3, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
            //             checkAddDatasource(user4, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
            //         }
            //     });
            // }
            nextState = {
                ...nextState,
                UserApproveID2: {
                    ...UserApproveID2,
                    value: item ? { ...item } : null,
                    refresh: !UserApproveID2.refresh
                },
                UserApproveID3: {
                    ...UserApproveID3,
                    value: item ? { ...item } : null,
                    refresh: !UserApproveID3.refresh
                }
            };
        } else if (this.levelApproveRosterGroupByEmp == 3) {
            // var user1 = $("#UserApproveID").data("kendoComboBox"),
            //     user2 = $("#UserApproveID4").data("kendoComboBox"),
            //     user3 = $("#UserApproveID2").data("kendoComboBox"),
            //     user4 = $("#UserApproveID3").data("kendoComboBox"),
            //     _data2 = user2.dataSource.data();
            // if (user2.value().length == 0) {
            //     user4.value([]);
            // }
            // else {
            //     _data2.forEach(function (item) {
            //         if (item.ID == user2.value()) {
            //             checkAddDatasource(user4, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
            //         }
            //     });
            // }
            nextState = {
                ...nextState,
                UserApproveID3: {
                    ...UserApproveID3,
                    value: item ? { ...item } : null,
                    refresh: !UserApproveID3.refresh
                }
            };
        }

        this.setState(nextState);
    };

    //change DateStart
    onChangeDateStart = value => {
        const { DateStart, DateEnd, RosterGroupRoot } = this.state;

        let nextState = {
            DateStart: {
                ...DateStart,
                value: value,
                refresh: !DateStart.refresh
            }
        };

        if (value) {
            // isReadOnlyDateTime($(frm + ' #DateEnd'), false);
            nextState = {
                ...nextState,
                DateEnd: {
                    ...DateEnd,
                    disable: false,
                    refresh: !DateEnd.refresh
                }
            };

            this.setState(nextState, () => {
                this.ChangeDateStart();
                this.GetApprovedGradeByRosterGroupByEmp();
            });
        } else {
            this.readOnlyCtrlRosterGroupByEmp(true);
            // $(frm + ' #DateEnd').data('kendoDatePicker').value(null);
            // isReadOnlyDateTime($(frm + ' #DateEnd'), true);
            // $(frm + ' #RosterGroupRoot').val("");

            nextState = {
                ...nextState,
                DateEnd: {
                    ...DateEnd,
                    value: null,
                    disable: true,
                    refresh: !DateEnd.refresh
                },
                RosterGroupRoot: {
                    ...RosterGroupRoot,
                    value: null,
                    refresh: !RosterGroupRoot.refresh
                }
            };

            this.setState(nextState, () => this.GetApprovedGradeByRosterGroupByEmp());
        }
    };

    ChangeDateStart = () => {
        const { DateStart, DateEnd } = this.state;
        let _DateStart1 = DateStart.value; //$("#DateStart").data('kendoDatePicker').value(),
        // _DateEnd1 = $("#DateEnd").data('kendoDatePicker').value(),
        //     datepicker = $("#DateEnd").data('kendoDatePicker');

        if (_DateStart1) {
            //datepicker.value(_DateStart1);
            //_DateEnd1 = datepicker;

            this.setState(
                {
                    DateEnd: {
                        ...DateEnd,
                        value: _DateStart1,
                        refresh: !DateEnd.refresh
                    }
                },
                () => {
                    this.readOnlyCtrlRosterGroupByEmp(false);
                    this.GetRosterGroupTypeByEmp();
                }
            );
        } else {
            this.readOnlyCtrlRosterGroupByEmp(false);
            this.GetRosterGroupTypeByEmp();
        }
    };

    //change DateEnd
    onChangeDateEnd = value => {
        this.setState(
            {
                DateEnd: {
                    ...this.state.DateEnd,
                    value,
                    refresh: !this.state.DateEnd.refresh
                }
            },
            () => {
                this.GetRosterGroupTypeByEmp();
                this.GetApprovedGradeByRosterGroupByEmp();
            }
        );
    };

    //change RosterGroupTypeID
    onChangeRosterGroupTypeID = item => {
        const { RosterGroupTypeID } = this.state;

        this.setState(
            {
                RosterGroupTypeID: {
                    ...RosterGroupTypeID,
                    value: item,
                    refresh: !RosterGroupTypeID.refresh
                }
            },
            () => this.GetApprovedGradeByRosterGroupByEmp()
        );
    };

    render() {
        const {
                DateStart,
                DateEnd,
                RosterGroupTypeID,
                RosterGroupRoot,
                Note,
                FileAttach,
                UserApproveID,
                UserApproveID2,
                UserApproveID3,
                UserApproveID4,
                fieldValid,
                modalErrorDetail
            } = this.state,
            {
                textLableInfo,
                formDate_To_From,
                controlDate_To,
                controlDate_from,
                contentViewControl,
                viewLable,
                viewControl
            } = stylesListPickerControl;

        //#region [Xử lý 3 nút lưu]
        const listActions = [];

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_RosterGroupByEmp_New_CreateOrUpdate_btnSaveandSendMail'] &&
            PermissionForAppMobile.value['New_Att_RosterGroupByEmp_New_CreateOrUpdate_btnSaveandSendMail']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_SENMAIL,
                title: translate('HRM_Common_SaveAndSendMail'),
                onPress: () => this.saveAndSend(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_RosterGroupByEmp_New_CreateOrUpdate_btnSaveClose'] &&
            PermissionForAppMobile.value['New_Att_RosterGroupByEmp_New_CreateOrUpdate_btnSaveClose']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_CLOSE,
                title: translate('HRM_Common_SaveClose'),
                onPress: () => this.save(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_RosterGroupByEmp_New_CreateOrUpdate_btnSaveCreate'] &&
            PermissionForAppMobile.value['New_Att_RosterGroupByEmp_New_CreateOrUpdate_btnSaveCreate']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_NEW,
                title: translate('HRM_Common_SaveNew'),
                onPress: () => this.saveAndCreate(this.props.navigation)
            });
        }

        //#endregion

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                    >
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
                                                onFinish={value => this.onChangeDateStart(value)}
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
                                                onFinish={value => this.onChangeDateEnd(value)}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Nhóm ca làm việc - RosterGroupTypeID */}
                        {RosterGroupTypeID.visible && RosterGroupTypeID.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={RosterGroupTypeID.label}
                                    />

                                    {/* valid RosterGroupTypeID */}
                                    {fieldValid.RosterGroupTypeID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        //dataLocal={RosterGroupTypeID.data}
                                        // api={{
                                        //     urlApi:
                                        //         '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_LEAVE_DAY_BUSINESSTRAVEL',
                                        //     type: 'E_GET',
                                        // }}
                                        api={RosterGroupTypeID.api}
                                        refresh={RosterGroupTypeID.refresh}
                                        textField={RosterGroupTypeID.textField}
                                        valueField={RosterGroupTypeID.valueField}
                                        filter={true}
                                        value={RosterGroupTypeID.value}
                                        filterServer={false}
                                        autoFilter={true}
                                        //filterParams="text"
                                        disable={RosterGroupTypeID.disable}
                                        onFinish={item => this.onChangeRosterGroupTypeID(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Nhóm ca trước khi đổi - RosterGroupRoot */}
                        {RosterGroupRoot.visible && RosterGroupRoot.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={RosterGroupRoot.label}
                                    />

                                    {/* valid RosterGroupRoot */}
                                    {fieldValid.RosterGroupRoot && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={RosterGroupRoot.disable}
                                        refresh={RosterGroupRoot.refresh}
                                        value={RosterGroupRoot.value}
                                        onChangeText={text =>
                                            this.setState({
                                                RosterGroupRoot: {
                                                    ...RosterGroupRoot,
                                                    value: text,
                                                    refresh: !RosterGroupRoot.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* duyệt đầu - UserApproveID */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={UserApproveID.label} />

                                {/* valid UserApproveID */}
                                {fieldValid.UserApproveID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>
                            <View style={viewControl}>
                                <VnrPicker
                                    //dataLocal={UserApproveID.data}
                                    api={UserApproveID.api}
                                    refresh={UserApproveID.refresh}
                                    textField={UserApproveID.textField}
                                    valueField={UserApproveID.valueField}
                                    filter={true}
                                    value={UserApproveID.value}
                                    filterServer={true}
                                    filterParams="text"
                                    disable={UserApproveID.disable}
                                    onFinish={item => this.onChangeUserApprove(item)}
                                />
                            </View>
                        </View>

                        {/* duyệt giữa - UserApproveID2 */}
                        {UserApproveID2.visible && (
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
                                        //dataLocal={UserApproveID2.data}
                                        api={UserApproveID2.api}
                                        value={UserApproveID2.value}
                                        refresh={UserApproveID2.refresh}
                                        textField={UserApproveID2.textField}
                                        valueField={UserApproveID2.valueField}
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

                        {/* duyệt tiếp theo - UserApproveID3 */}
                        {UserApproveID3.visible && (
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
                                        //dataLocal={UserApproveID3.data}
                                        api={UserApproveID3.api}
                                        value={UserApproveID3.value}
                                        refresh={UserApproveID3.refresh}
                                        textField={UserApproveID3.textField}
                                        valueField={UserApproveID3.valueField}
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

                        {/* duyệt cuối - UserApproveID4 */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={UserApproveID4.label} />

                                {/* valid UserApproveID4 */}
                                {fieldValid.UserApproveID4 && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>
                            <View style={viewControl}>
                                <VnrPicker
                                    //dataLocal={UserApproveID4.data}
                                    api={UserApproveID4.api}
                                    refresh={UserApproveID4.refresh}
                                    textField={UserApproveID4.textField}
                                    valueField={UserApproveID4.valueField}
                                    filter={true}
                                    filterServer={true}
                                    value={UserApproveID4.value}
                                    filterParams="text"
                                    disable={UserApproveID4.disable}
                                    onFinish={item => this.onChangeUserApprove2(item)}
                                />
                            </View>
                        </View>

                        {/* Ghi chú - Note */}
                        {Note.visible && Note.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Note.label} />

                                    {/* valid Note */}
                                    {fieldValid.Note && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Note.disable}
                                        refresh={Note.refresh}
                                        value={Note.value}
                                        onChangeText={text =>
                                            this.setState({
                                                Note: {
                                                    ...Note,
                                                    value: text,
                                                    refresh: !Note.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* File đính kèm - FileAttach */}
                        {FileAttach.visible && FileAttach.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={FileAttach.label} />
                                </View>
                                <View style={viewControl}>
                                    <VnrAttachFile
                                        refresh={FileAttach.refresh}
                                        value={FileAttach.value}
                                        multiFile={true}
                                        uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                        disable={FileAttach.disable}
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
                    </KeyboardAwareScrollView>

                    <ListButtonSave listActions={listActions} />

                    {modalErrorDetail.isModalVisible && (
                        <Modal
                            onBackButtonPress={() => this.closeModal()}
                            isVisible={true}
                            onBackdropPress={() => this.closeModal()}
                            customBackdrop={
                                <TouchableWithoutFeedback onPress={() => this.closeModal()}>
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
                                        <TouchableOpacity onPress={() => this.closeModal()}>
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
                                        <TouchableOpacity onPress={() => this.closeModal()} style={styles.btnClose}>
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
