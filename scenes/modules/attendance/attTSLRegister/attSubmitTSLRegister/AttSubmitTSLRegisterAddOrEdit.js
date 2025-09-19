import React, { Component } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    // eslint-disable-next-line react-native/split-platform-components
    PermissionsAndroid,
    StyleSheet,
    TouchableWithoutFeedback,
    ScrollView,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Size,
    Colors,
    styleValid,
    styleSafeAreaView,
    stylesListPickerControl,
    stylesModalPopupBottom,
    styleViewTitleForGroup,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { IconColse } from '../../../../../constants/Icons';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import HttpService from '../../../../../utils/HttpService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import { EnumName, EnumIcon } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { translate } from '../../../../../i18n/translate';
import Modal from 'react-native-modal';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import DrawerServices from '../../../../../utils/DrawerServices';

let enumName = null,
    profileInfo = null;

const initSateDefault = {
    isRefesh: false,
    isChoseProfile: true,
    CheckProfilesExclude: false,
    Profiles: {
        refresh: false,
        value: null
    },
    currentLocation: {
        latitude: 0,
        longitude: 0,
        address: null,
        isShowModalMap: false,
        fileImageMapCurrentLocation: null
    },
    OrgStructures: {
        refresh: false,
        value: null
    },
    ProfilesExclude: {
        refresh: false,
        value: null
    },
    ProfileID: { ID: null, ProfileName: '' },
    CardCode: '',
    Type: {
        refresh: false,
        value: null,
        data: []
    },
    TimeLog: { value: null, refresh: false },
    TimeLogTime: { value: null, refresh: false },
    TimeLogOut: { value: null, refresh: false },
    TimeLogTimeOut: { value: null, refresh: false },
    MachineNo: '',
    MissInOutReason: {
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    isShowApprove3: false,
    isShowApprove4: false,
    isInAndOut: false,
    UserApprove: {
        disable: false,
        refresh: false,
        value: null
    },
    UserApprove3: {
        isShowBusiness: false,
        disable: false,
        refresh: false,
        value: null
    },
    UserApprove4: {
        isShowBusiness: false,
        disable: false,
        refresh: false,
        value: null
    },
    UserApprove2: {
        disable: false,
        refresh: false,
        value: null
    },
    Comment: {
        value: '',
        visible: true,
        visibleConfig: true
    },
    RejectReason: '',
    // need fix for task 0158060 ECOPARK
    FileAttachment: {
        label: 'HRM_Att_BusinessTravel_FileAttachment',
        visible: true,
        visibleConfig: true,
        disable: true,
        refresh: false,
        value: null
    },
    fieldValid: {},
    modalErrorDetail: {
        isModalVisible: false,
        cacheID: null,
        data: []
    }
};

export default class AttSubmitTSLRegisterAddOrEdit extends Component {
    constructor(props) {
        super(props);
        this.state = initSateDefault;
        this.setVariable();
        props.navigation.setParams({
            title: props.navigation.state.params.record
                ? 'HRM_Canteen_TamScanLog_Update'
                : 'HRM_Canteen_TamScanLog_AddNew'
        });
    }

    setVariable = () => {
        this.isRegisterHelp = null;
        this.levelApproveInOut = null;
        this.isModify = false;

        //xử lý set DateStart khi tạo mới từ màn hình Ngày công (WorkDay)
        //biến check load xong hàm getConfig và GetHighSupervior
        //dùng để call hàm onChangeDateStart khi 2 hàm trên chạy xong
        this.isDoneInit = null;

        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;

        this.IsContinueSave = false;
        this.ProfileRemoveIDs = null;
        this.IsRemoveAndContinue = null;
        this.CacheID = null;
    };

    refreshView = () => {
        this.props.navigation.setParams({ title: 'HRM_Canteen_TamScanLog_AddNew' });
        this.setVariable();
        this.setState(initSateDefault, () => this.getConfigValid('Att_TAMScanLogRegisterPortal', true));
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
                                    ...CustomStyleSheet.paddingBottom(5),
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
        HttpService.Post('[URI_HR]/Att_GetData/GetErrorMessageRespone', {
            cacheID: cacheID
        }).then(res => {
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
    onSaveAndCreate = navigation => {
        this.onSave(navigation, true, null);
    };

    onSaveAndSend = navigation => {
        this.onSave(navigation, null, true);
    };

    onSave = (navigation, isCreate, isSend) => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        const {
                Type,
                ProfileID,
                UserApprove,
                UserApprove3,
                UserApprove4,
                UserApprove2,
                TimeLog,
                TimeLogTime,
                TimeLogOut,
                TimeLogTimeOut,
                MissInOutReason,
                Comment,
                FileAttachment,
                modalErrorDetail
            } = this.state,
            { apiConfig } = dataVnrStorage,
            { uriPor } = apiConfig;

        let params = {
            ...this.state,
            ProfileIds: ProfileID ? ProfileID.ID : null,
            OrgStructureIDs: null,
            ProfileIDsExclude: null,
            TimeLog: TimeLog.value ? moment(TimeLog.value).format('YYYY-MM-DD 00:00:00') : null,
            TimeLogTime: TimeLogTime.value ? moment(TimeLogTime.value).format('HH:mm') : null,
            TimeLogTimeOut: TimeLogTimeOut.value ? moment(TimeLogTimeOut.value).format('HH:mm') : null,
            TimeLogOut:
                TimeLogOut.value && TimeLogTimeOut.value
                    ? `${moment(TimeLogOut.value).format('YYYY-MM-DD')} ${moment(TimeLogTimeOut.value).format(
                        'HH:mm:ss'
                    )}`
                    : null,
            MissInOutReason: MissInOutReason ? (MissInOutReason.value ? MissInOutReason.value.ID : null) : null,
            IsPortal: true,
            Status: 'E_SUBMIT',
            Comment: Comment.value ? Comment.value : '',
            Type: Type && Type.value ? Type.value.Value : '',
            ProfileID: ProfileID ? ProfileID.ID : null,
            UserApproveID: UserApprove ? (UserApprove.value ? UserApprove.value.ID : null) : null,
            UserApproveID2: UserApprove2 ? (UserApprove2.value ? UserApprove2.value.ID : null) : null,
            UserApproveID3: UserApprove3 ? (UserApprove3.value ? UserApprove3.value.ID : null) : null,
            UserApproveID4: UserApprove4 ? (UserApprove4.value ? UserApprove4.value.ID : null) : null,
            UserSubmit: ProfileID ? ProfileID.ID : null,
            // need fix for task 0158060 ECOPARK
            FileAttachment: FileAttachment.value ? FileAttachment.value.map(item => item.fileName).join(',') : null
        };

        if (isSend) {
            params = {
                ...params,
                SendEmailStatus: 'E_SUBMIT',
                Host: uriPor,
                IsAddNewAndSendMail: true
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Att_TAMScanLogRegister', params).then(data => {
            this.isProcessing = false;
            VnrLoadingSevices.hide();

            try {
                if (data && typeof data === enumName.E_object) {
                    if (data.ErrorRespone) {
                        if (data.ErrorRespone.IsBlock == true) {
                            if (data.ErrorRespone.IsShowRemoveAndContinue) {
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
                                            }
                                        );
                                    }
                                });
                            } else {
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
                                            }
                                        );
                                    }
                                });
                            }
                        } else {
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
                                        }
                                    );
                                }
                            });
                        }
                    } else if (data.ActionStatus == 'Hrm_Locked') {
                        ToasterSevice.showWarning('Hrm_Locked', 4000);
                    } else if (data.ActionStatus == 'Success') {
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
                    } else {
                        ToasterSevice.showWarning(data.ActionStatus, 4000);
                    }
                } else {
                    DrawerServices.navigate('ErrorScreen', {
                        ErrorDisplay: { AttSubmitTSLRegisterAddOrEdit: 'create error' }
                    });
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    //get type in/out
    getTypeInOut = () => {
        HttpService.Get('[URI_SYS]/Sys_GetData/GetEnum?text=TamScanLogType').then(res => {
            try {
                let { Type } = this.state,
                    data = [];

                if (this.isModify) {
                    data = res.filter(item => {
                        return item.Value != 'E_INOUT';
                    });
                } else {
                    data = [...res];
                }

                this.setState(
                    {
                        Type: {
                            ...Type,
                            refresh: !Type.refresh,
                            data: data
                        }
                    },
                    () => {
                        const { workDayItem } = this.props.navigation.state.params;
                        if (workDayItem) {
                            // if (this.isDoneInit) {
                            const { TimeLog, TimeLogOut } = this.state;

                            let findType = null;
                            if (workDayItem.Type) {
                                findType = data.find(item => item.Value === workDayItem.Type);

                                if (!findType) {
                                    findType = { Value: workDayItem.Type, Text: translate(workDayItem.Type) };
                                }
                                //call onChangeType

                                this.setState({
                                    TimeLog: {
                                        ...TimeLog,
                                        value: moment(workDayItem.WorkDate).format('YYYY-MM-DD HH:mm:ss'),
                                        refresh: !TimeLog.refresh
                                    },
                                    TimeLogOut: {
                                        ...TimeLogOut,
                                        value:
                                            findType && findType.Value == enumName.E_INOUT
                                                ? moment(workDayItem.WorkDate).format('YYYY-MM-DD HH:mm:ss')
                                                : null,
                                        refresh: !TimeLogOut.refresh
                                    }
                                });

                                this.isDoneInit = true;
                                this.onChangeType(findType);
                            }
                        }
                    }
                );
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
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
                        ConfigField && ConfigField.value['AttSubmitTSLRegisterAddOrEdit']
                            ? ConfigField.value['AttSubmitTSLRegisterAddOrEdit']['Hidden']
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
                        //check đăng ký hộ
                        this.isRegisterHelp = false;
                        this.initData(record);
                    });
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            }
        });
    };

    componentDidMount() {
        //get config validate
        this.getConfigValid('Att_TAMScanLogRegisterPortal');
    }

    handleSetState = (_id, response, data, isChangeLevelApprove) => {
        this.levelApproveInOut = data;

        let _isShowApprove3 = false,
            _isShowApprove4 = false,
            objType = null,
            objMissInOutReason = null,
            objUserApprove = null,
            objUserApprove2 = null,
            objUserApprove3 = null,
            objUserApprove4 = null;

        if (data == 4) {
            _isShowApprove3 = true;
            _isShowApprove4 = true;
        } else if (data == 3) {
            _isShowApprove3 = true;
            _isShowApprove4 = false;
        } else {
            _isShowApprove3 = false;
            _isShowApprove4 = false;
        }

        if (response['Type']) {
            objType = {
                Text: response['TypeView'],
                Value: response['Type']
            };
        }

        if (response['MissInOutReason']) {
            objMissInOutReason = {
                TAMScanReasonMissName: response['TAMScanReasonMissName'],
                ID: response['MissInOutReason']
            };
        } else {
            this.getConfigTamScanReasonMiss('Cat_TAMScanReasonMiss');
        }

        if (response['UserApproveID']) {
            objUserApprove = {
                UserInfoName: response['UserApproveName'],
                ID: response['UserApproveID']
            };
        }

        if (response['UserApproveID2']) {
            objUserApprove2 = {
                UserInfoName: response['UserApproveName2'],
                ID: response['UserApproveID2']
            };
        }

        if (response['UserApproveID3']) {
            objUserApprove3 = {
                UserInfoName: response['UserApproveName3'],
                ID: response['UserApproveID3']
            };
        }

        if (response['UserApproveID4']) {
            objUserApprove4 = {
                UserInfoName: response['UserApproveName4'],
                ID: response['UserApproveID4']
            };
        }

        this.setState({
            ID: _id,
            ProfileID: {
                ID: response['ProfileID'],
                ProfileName: response['ProfileName']
            },
            CardCode: response['CardCode'],
            Type: {
                ...this.state.Type,
                refresh: !this.state.Type.refresh,
                value: objType
            },
            TimeLog: { value: response['TimeLog'], refresh: !this.state.TimeLog.refresh },
            TimeLogTime: { value: response['TimeLogTime'], refresh: !this.state.TimeLogTime.refresh },
            TimeLogOut: { ...this.state.TimeLogOut, value: null, refresh: !this.state.TimeLogOut.refresh },
            TimeLogTimeOut: { ...this.state.TimeLogTimeOut, value: null, refresh: !this.state.TimeLogTimeOut.refresh },
            MachineNo: response['MachineNo'],
            MissInOutReason: {
                ...this.state.MissInOutReason,
                refresh: !this.state.MissInOutReason.refresh,
                value: objMissInOutReason
            },
            isShowApprove3: _isShowApprove3,
            isShowApprove4: _isShowApprove4,
            isInAndOut: false,
            UserApprove: {
                ...this.state.UserApprove,
                refresh: !this.state.UserApprove.refresh,
                disable: !isChangeLevelApprove,
                value: objUserApprove
            },
            UserApprove3: {
                ...this.state.UserApprove3,
                refresh: !this.state.UserApprove3.refresh,
                disable: !isChangeLevelApprove,
                value: objUserApprove3
            },
            UserApprove4: {
                ...this.state.UserApprove4,
                refresh: !this.state.UserApprove4.refresh,
                disable: !isChangeLevelApprove,
                value: objUserApprove4
            },
            UserApprove2: {
                ...this.state.UserApprove2,
                refresh: !this.state.UserApprove2.refresh,
                disable: !isChangeLevelApprove,
                value: objUserApprove2
            },
            Comment: {
                ...this.state.Comment,
                value: response['Comment']
            },
            RejectReason: response['RejectReason'],
            // need fix for task 0158060 ECOPARK
            FileAttachment: {
                ...this.state.FileAttachment,
                value: response.lstFileAttach,
                disable: false,
                refresh: !this.state.FileAttachment.refresh
            }
        });
    };

    getRecordAndConfigByID = (_id, _handleSetState) => {
        VnrLoadingSevices.show();

        HttpService.MultiRequest([
            HttpService.Get('[URI_HR]/Att_GetData/New_GetAttTamScanLogByID?ID=' + _id),
            HttpService.Post('[URI_HR]/Att_GetData/GetConfigAproveRegister', { RecordID: _id }),
            HttpService.Post('[URI_HR]/Att_GetData/GetReadOnlyApproverControl', {
                profileID: dataVnrStorage.currentUser.info.ProfileID
            })
        ]).then(res => {
            VnrLoadingSevices.hide();

            try {
                _handleSetState(_id, res[0], res[1], res[2]);
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    initData = record => {
        //sửa
        if (record) {
            this.isModify = true;
            // //get type in/out
            this.getTypeInOut();

            let _id = record.ID;
            this.getRecordAndConfigByID(_id, this.handleSetState);
        } else {
            const { E_ProfileID, E_FullName } = enumName;
            let _profile = {
                ID: profileInfo[E_ProfileID],
                ProfileName: profileInfo[E_FullName]
            };

            this.setState({ ProfileID: _profile }, () => {
                this.GetCardCodeByProfileID(_profile.ID);
                this.loadHighSupervisor_TamScanLogRegister(_profile.ID);
                this.getConfigTamScanReasonMiss('Cat_TAMScanReasonMiss');
            });
        }
    };

    GetCardCodeByProfileID = profileID => {
        HttpService.Post('[URI_HR]/Hre_GetData/GetCardCodeByProfileID', { id: profileID }).then(data => {
            try {
                if (data && data.length > 1 && data[1]) {
                    this.setState({ CardCode: data[1].CodeAttendance });
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    getConfigTamScanReasonMiss = tableName => {
        const { MissInOutReason } = this.state;
        HttpService.Post('[URI_HR]/Att_GetData/GetDataConfigDefault', {
            tableName: tableName
        }).then(res => {
            this.setState({
                MissInOutReason: {
                    ...MissInOutReason,
                    value: {
                        ID: res.ValueID,
                        MissReasonID: '00000000-0000-0000-0000-000000000000',
                        MissReasonName: res.DefaultValue,
                        TAMScanReasonMissName: res.DefaultValue,
                        isSelect: true
                    },
                    refresh: !MissInOutReason.refresh
                }
            });
        });
    };

    getParamForGradeApprove = () => {
        const { TimeLog, TimeLogOut, Type, TimeLogTime, TimeLogTimeOut } = this.state;
        let param = {},
            _timeIn = TimeLog.value ? moment(TimeLog.value).format('YYYY-MM-DD HH:mm:ss') : null,
            _timeOut = TimeLogOut.value ? moment(TimeLogOut.value).format('YYYY-MM-DD HH:mm:ss') : null,
            _type = Type.value ? Type.value.Value : null;

        if (_type != '' && (_timeIn != null || _timeOut != null)) {
            if (_type == 'E_INOUT') {
                let hoursIn = TimeLogTime.value ? moment(TimeLogTime.value).format('HH') : '',
                    minuteIn = TimeLogTime.value ? moment(TimeLogTime.value).format('mm') : '',
                    hoursOut = TimeLogTimeOut.value ? moment(TimeLogTimeOut.value).format('HH') : '',
                    minuteOut = TimeLogTimeOut.value ? moment(TimeLogTimeOut.value).format('mm') : '';

                _timeIn = TimeLog.value
                    ? moment(TimeLog.value)
                        .hours(hoursIn)
                        .minutes(minuteIn)
                    : null;
                _timeOut = TimeLogOut.value
                    ? moment(TimeLogOut.value)
                        .hours(hoursOut)
                        .minutes(minuteOut)
                    : null;
            } else if (_type == 'E_OUT') {
                let hoursIn = TimeLogTime.value ? moment(TimeLogTime.value).format('HH') : '',
                    minuteIn = TimeLogTime.value ? moment(TimeLogTime.value).format('mm') : '';

                _timeOut = TimeLog.value
                    ? moment(TimeLog.value)
                        .hours(hoursIn)
                        .minutes(minuteIn)
                    : null;
                _timeIn = null;
            } else {
                let hoursIn = TimeLogTime.value ? moment(TimeLogTime.value).format('HH') : '',
                    minuteIn = TimeLogTime.value ? moment(TimeLogTime.value).format('mm') : '';

                _timeIn = TimeLog.value
                    ? moment(TimeLog.value)
                        .hours(hoursIn)
                        .minutes(minuteIn)
                    : null;
                _timeOut = null;
            }

            if (_timeOut == null) {
                _timeOut = _timeIn;
            } else if (_timeIn == null) {
                _timeIn = _timeOut;
            }

            param = {
                DateStart: _timeIn ? _timeIn.format('YYYY-MM-DD HH:mm:ss') : null,
                DateEnd: _timeOut ? _timeOut.format('YYYY-MM-DD HH:mm:ss') : null
            };
        }

        return param;
    };

    GetHighSupervior = () => {
        const { ProfileID, Type, TimeLog, TimeLogTime, TimeLogOut, TimeLogTimeOut } = this.state;
        let paramGradeApprove = this.getParamForGradeApprove();

        let isCheckGetApprove =
            Type.value == 'E_INOUT'
                ? TimeLog.value && TimeLogTime.value && TimeLogOut.value && TimeLogTimeOut.value
                : TimeLog.value && TimeLogTime.value;

        if (ProfileID.ID && Type.value && isCheckGetApprove) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/GetHighSupervisor', {
                ProfileID: ProfileID.ID,
                userSubmit: ProfileID.ID,
                type: 'E_TAMSCANLOGREGISTER',
                missionPlaceType: null,
                resource: {
                    ...paramGradeApprove,
                    TypeTamLog: Type.value ? Type.value.Value : null
                }
            }).then(result => {
                VnrLoadingSevices.hide();

                try {
                    const { UserApprove, UserApprove2, UserApprove3, UserApprove4 } = this.state;

                    let nextState = {
                        UserApprove: { ...UserApprove },
                        UserApprove2: { ...UserApprove2 },
                        UserApprove3: { ...UserApprove3 },
                        UserApprove4: { ...UserApprove4 }
                    };

                    //truong hop chạy theo approve grade
                    if (result.LevelApprove > 0) {
                        if (result.IsChangeApprove != true) {
                            nextState = {
                                UserApprove: { ...nextState.UserApprove, disable: true },
                                UserApprove2: { ...nextState.UserApprove2, disable: true },
                                UserApprove3: { ...nextState.UserApprove3, disable: true },
                                UserApprove4: { ...nextState.UserApprove4 }
                            };
                        } else {
                            nextState = {
                                UserApprove: { ...nextState.UserApprove, disable: false },
                                UserApprove2: { ...nextState.UserApprove2, disable: false },
                                UserApprove3: { ...nextState.UserApprove3, disable: false },
                                UserApprove4: { ...nextState.UserApprove4 }
                            };
                        }

                        this.levelApproveInOut = result.LevelApprove;

                        if (result.LevelApprove == 2) {
                            if (result.IsOnlyOneLevelApprove) {
                                this.levelApproveInOut = 1;
                                if (result.SupervisorID != null) {
                                    nextState = {
                                        UserApprove: {
                                            ...nextState.UserApprove,
                                            value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                        },
                                        UserApprove2: {
                                            ...nextState.UserApprove2,
                                            value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                        },
                                        UserApprove3: {
                                            ...nextState.UserApprove3,
                                            value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                        },
                                        UserApprove4: {
                                            ...nextState.UserApprove4,
                                            value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                        }
                                    };
                                }
                            } else {
                                if (result.SupervisorID != null) {
                                    nextState = {
                                        ...nextState,
                                        UserApprove: {
                                            ...nextState.UserApprove,
                                            value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                        }
                                    };
                                }

                                if (result.MidSupervisorID != null) {
                                    nextState = {
                                        ...nextState,
                                        UserApprove2: {
                                            ...nextState.UserApprove2,
                                            value: {
                                                UserInfoName: result.SupervisorNextName,
                                                ID: result.MidSupervisorID
                                            }
                                        },
                                        UserApprove3: {
                                            ...nextState.UserApprove3,
                                            value: {
                                                UserInfoName: result.SupervisorNextName,
                                                ID: result.MidSupervisorID
                                            }
                                        },
                                        UserApprove4: {
                                            ...nextState.UserApprove4,
                                            value: {
                                                UserInfoName: result.SupervisorNextName,
                                                ID: result.MidSupervisorID
                                            }
                                        }
                                    };
                                }
                            }

                            nextState = {
                                ...nextState,
                                isShowApprove3: false,
                                isShowApprove4: false
                            };
                        } else if (result.LevelApprove == 3) {
                            if (result.SupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                    }
                                };
                            }

                            if (result.MidSupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                    }
                                };
                            }

                            if (result.NextMidSupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: {
                                            UserInfoName: result.NextMidSupervisorName,
                                            ID: result.NextMidSupervisorID
                                        }
                                    },
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        value: {
                                            UserInfoName: result.NextMidSupervisorName,
                                            ID: result.NextMidSupervisorID
                                        }
                                    }
                                };
                            }

                            nextState = {
                                ...nextState,
                                isShowApprove3: true,
                                isShowApprove4: false
                            };
                        } else if (result.LevelApprove == 4) {
                            if (result.SupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                    }
                                };
                            }

                            if (result.MidSupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                    }
                                };
                            }

                            if (result.NextMidSupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        value: {
                                            UserInfoName: result.NextMidSupervisorName,
                                            ID: result.NextMidSupervisorID
                                        }
                                    }
                                };
                            }

                            if (result.HighSupervisorID) {
                                nextState = {
                                    ...nextState,
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                                    }
                                };
                            }

                            nextState = {
                                ...nextState,
                                isShowApprove3: true,
                                isShowApprove4: true
                            };
                        }

                        if (result.IsChangeApprove != true) {
                            nextState = {
                                ...nextState,
                                UserApprove: {
                                    ...nextState.UserApprove,
                                    disable: true
                                },
                                UserApprove2: {
                                    ...nextState.UserApprove2,
                                    disable: true
                                },
                                UserApprove3: {
                                    ...nextState.UserApprove3,
                                    disable: true
                                },
                                UserApprove4: {
                                    ...nextState.UserApprove4,
                                    disable: true
                                }
                            };
                        } else {
                            nextState = {
                                ...nextState,
                                UserApprove: {
                                    ...nextState.UserApprove,
                                    disable: false
                                },
                                UserApprove2: {
                                    ...nextState.UserApprove2,
                                    disable: false
                                },
                                UserApprove3: {
                                    ...nextState.UserApprove3,
                                    disable: false
                                },
                                UserApprove4: {
                                    ...nextState.UserApprove4,
                                    disable: false
                                }
                            };
                        }
                    }

                    //TH chạy không theo approve grade
                    else if (result.LevelApprove == 0) {
                        if (result.IsConCurrent) {
                            let dataFirstApprove = [],
                                dataMidApprove = [],
                                dataLastApprove = [];

                            for (let i = 0; i < result.lstSupervior.length; i++) {
                                dataFirstApprove.push({
                                    UserInfoName: result.lstSupervior[i].SupervisorName,
                                    ID: result.lstSupervior[i].SupervisorID
                                });
                            }

                            for (let i = 0; i < result.lstHightSupervior.length; i++) {
                                dataMidApprove.push({
                                    UserInfoName: result.lstHightSupervior[i].HighSupervisorName,
                                    ID: result.lstHightSupervior[i].HighSupervisorID
                                });
                                dataLastApprove.push({
                                    UserInfoName: result.lstHightSupervior[i].HighSupervisorName,
                                    ID: result.lstHightSupervior[i].HighSupervisorID
                                });
                            }

                            // nextState = {
                            //     UserApprove: {
                            //         ...this.state.UserApprove,
                            //         refresh: !this.state.UserApprove.refresh,
                            //         value: null,
                            //         data: [...dataFirstApprove]
                            //     },
                            //     UserApprove2: {
                            //         ...this.state.UserApprove2,
                            //         refresh: !this.state.UserApprove2.refresh,
                            //         value: null,
                            //         data: [...dataLastApprove]
                            //     },
                            //     UserApprove3: {
                            //         ...this.state.UserApprove3,
                            //         refresh: !this.state.UserApprove3.refresh,
                            //         value: null,
                            //         data: [...dataMidApprove]
                            //     }
                            // }
                            nextState = {
                                ...nextState,
                                UserApprove: {
                                    ...nextState.UserApprove,
                                    value: null
                                },
                                UserApprove2: {
                                    ...nextState.UserApprove2,
                                    value: null
                                },
                                UserApprove3: {
                                    ...nextState.UserApprove3,
                                    value: null
                                }
                            };
                        } else {
                            if (result.SupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        value: { UserInfoName: result.SupervisorName, ID: result.SupervisorID }
                                    }
                                };
                            } else {
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        value: null
                                    }
                                };
                            }
                            if (result.HighSupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: { UserInfoName: result.HighSupervisorName, ID: result.HighSupervisorID }
                                    }
                                };
                            } else {
                                nextState = {
                                    ...nextState,
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: null
                                    }
                                };
                            }
                            if (result.MidSupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                    },
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                    },
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        value: { UserInfoName: result.SupervisorNextName, ID: result.MidSupervisorID }
                                    }
                                };
                            } else {
                                nextState = {
                                    ...nextState,
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: null
                                    },
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        value: null
                                    },
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        value: null
                                    }
                                };
                            }
                            if (result.IsChangeApprove != true) {
                                nextState = {
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        disable: true
                                    },
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        disable: true
                                    },
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        disable: true
                                    },
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        disable: true
                                    }
                                };
                            } else {
                                nextState = {
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        disable: false
                                    },
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        disable: false
                                    },
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        disable: false
                                    },
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        disable: false
                                    }
                                };
                            }
                        }
                    }

                    nextState = {
                        ...nextState,
                        UserApprove: {
                            ...nextState.UserApprove,
                            refresh: !UserApprove.refresh
                        },
                        UserApprove2: {
                            ...nextState.UserApprove2,
                            refresh: !UserApprove2.refresh
                        },
                        UserApprove3: {
                            ...nextState.UserApprove3,
                            refresh: !UserApprove3.refresh
                        },
                        UserApprove4: {
                            ...nextState.UserApprove4,
                            refresh: !UserApprove4.refresh
                        }
                    };

                    this.setState(nextState, () => {
                        //get type in/out
                        // const { workDayItem } = this.props.navigation.state.params;
                        // if (workDayItem) {
                        //     if (this.isDoneInit) {
                        //         const { TimeLog, Type } = this.state,
                        //             { data } = Type;
                        //         this.setState({
                        //             TimeLog: {
                        //                 ...TimeLog,
                        //                 value: moment(workDayItem.WorkDate).format("YYYY-MM-DD HH:mm:ss"),
                        //                 refresh: !TimeLog.refresh
                        //             }
                        //         });
                        //         if (workDayItem.Type) {
                        //             let findType = data.find(item => item.Value === workDayItem.Type);
                        //             if (!findType) {
                        //                 findType = { Value: workDayItem.Type, Text: workDayItem.Type };
                        //             }
                        //             console.log(data, findType, workDayItem, 'findType')
                        //             //call onChangeType
                        //             this.onChangeType(findType);
                        //         }
                        //     }
                        //     else {
                        //         this.isDoneInit = true;
                        //     }
                        // }
                    });
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        }
    };

    loadHighSupervisor_TamScanLogRegister = pro => {
        if (pro) {
            this.GetHighSupervior();
            if (!this.isDoneInit) this.getTypeInOut();
        } else {
            this.setState({
                UserApprove: null,
                UserApprove3: null,
                UserApprove4: null,
                UserApprove2: null
            });
        }
    };

    onChangeUserApprove = item => {
        this.setState({
            UserApprove: {
                ...this.state.UserApprove,
                value: item
            }
        });
        //nếu 1 cấp duyệt mới chạy
        if (this.levelApproveInOut == 1) {
            //ẩn 3,4
            this.setState({ isShowApprove3: false, isShowApprove4: false });

            //set duyệt 2,3,4 = 1
            let user1 = { ...item };

            if (!user1) {
                this.setState({
                    UserApprove2: { ...this.state.UserApprove2, value: null },
                    UserApprove3: { ...this.state.UserApprove3, value: null },
                    UserApprove4: { ...this.state.UserApprove4, value: null }
                });
            } else {
                this.setState({
                    UserApprove2: { ...this.state.UserApprove2, value: { ...user1 } },
                    UserApprove3: { ...this.state.UserApprove3, value: { ...user1 } },
                    UserApprove4: { ...this.state.UserApprove4, value: { ...user1 } }
                });
            }
        }
    };

    onChangeUserApprove2 = item => {
        this.setState({
            UserApprove2: {
                ...this.state.UserApprove2,
                value: item
            }
        });

        //nếu 1 cấp duyệt mới chạy
        if (this.levelApproveInOut == 1) {
            //ẩn 3,4
            // isShowEle('#divMidApprove');
            // isShowEle('#divMidNextApprove');
            this.setState({ isShowApprove3: false, isShowApprove4: false });

            //set duyệt 2,3,4 = 1
            let user2 = { ...item }; //this.state.UserApprove2.value;//$("#UserApproveID").data("kendoComboBox"),
            // user2 = $("#UserApproveID2").data("kendoComboBox"),
            // user3 = $("#UserApproveID3").data("kendoComboBox"),
            // user4 = $("#UserApproveID4").data("kendoComboBox"),
            // _data2 = user2.dataSource.data();

            if (!user2) {
                this.setState({
                    UserApprove1: { ...this.state.UserApprove1, value: null },
                    UserApprove3: { ...this.state.UserApprove3, value: null },
                    UserApprove4: { ...this.state.UserApprove4, value: null }
                });
                // user1.value([]);
                // user3.value([]);
                // user4.value([]);
            } else {
                this.setState({
                    UserApprove1: { ...this.state.UserApprove1, value: { ...user2 } },
                    UserApprove3: { ...this.state.UserApprove3, value: { ...user2 } },
                    UserApprove4: { ...this.state.UserApprove4, value: { ...user2 } }
                });
                // _data2.forEach(function (item) {
                //     if (item.ID == user2.value()) {
                //         checkAddDatasource(user1, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //         checkAddDatasource(user3, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //         checkAddDatasource(user4, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //     }
                // });
            }
        } else if (this.levelApproveInOut == 2) {
            let user2 = { ...item };
            // user2 = $("#UserApproveID2").data("kendoComboBox"),
            // user3 = $("#UserApproveID3").data("kendoComboBox"),
            // user4 = $("#UserApproveID4").data("kendoComboBox"),
            // _data2 = user2.dataSource.data();
            if (!user2) {
                this.setState({
                    UserApprove3: { ...this.state.UserApprove3, value: null },
                    UserApprove4: { ...this.state.UserApprove4, value: null }
                });
                // user3.value([]);
                // user4.value([]);
            } else {
                this.setState({
                    UserApprove3: { ...this.state.UserApprove3, value: { ...user2 } },
                    UserApprove4: { ...this.state.UserApprove4, value: { ...user2 } }
                });
                // _data2.forEach(function (item) {
                //     if (item.ID == user2.value()) {
                //         checkAddDatasource(user3, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //         checkAddDatasource(user4, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //     }
                // });
            }
        } else if (this.levelApproveInOut == 3) {
            var user2 = { ...item }; //$("#UserApproveID").data("kendoComboBox"),
            // user2 = $("#UserApproveID2").data("kendoComboBox"),
            // user3 = $("#UserApproveID3").data("kendoComboBox"),
            // user4 = $("#UserApproveID4").data("kendoComboBox"),
            // _data2 = user2.dataSource.data();
            if (!user2) {
                this.setState({
                    UserApprove4: { ...this.state.UserApprove4, value: null }
                });
                //user4.value([]);
            } else {
                this.setState({
                    UserApprove4: { ...this.state.UserApprove4, value: { ...item } }
                });
                // _data2.forEach(function (item) {
                //     if (item.ID == user2.value()) {
                //         checkAddDatasource(user4, { UserInfoName: item.UserInfoName, ID: item.ID }, "ID", item.ID);
                //     }
                // });
            }
        }
    };

    onChangeType = item => {
        const { Type, TimeLogOut, TimeLogTimeOut } = this.state;

        if (!Vnr_Function.CheckIsNullOrEmpty(item)) {
            if (item.Value == 'E_INOUT') {
                this.setState(
                    {
                        Type: {
                            ...Type,
                            value: { ...item },
                            refresh: !Type.refresh
                        },
                        isInAndOut: true
                        // TimeLogOut: {
                        //     ...TimeLogOut,
                        //     value: null,
                        //     refresh: !TimeLogOut.refresh
                        // },
                        // TimeLogTimeOut: {
                        //     ...TimeLogTimeOut,
                        //     value: null,
                        //     refresh: !TimeLogTimeOut.refresh
                        // }
                    },
                    () => this.GetHighSupervior()
                );
            } else {
                this.setState(
                    {
                        Type: {
                            ...Type,
                            value: { ...item },
                            refresh: !Type.refresh
                        },
                        isInAndOut: false,
                        TimeLogOut: {
                            ...TimeLogOut,
                            value: null,
                            refresh: !TimeLogOut.refresh
                        },
                        TimeLogTimeOut: {
                            ...TimeLogTimeOut,
                            value: null,
                            refresh: !TimeLogTimeOut.refresh
                        }
                    },
                    () => this.GetHighSupervior()
                );
            }
        } else {
            this.setState(
                {
                    Type: {
                        ...Type,
                        value: null,
                        refresh: !Type.refresh
                    },
                    isInAndOut: false,
                    TimeLogOut: {
                        ...TimeLogOut,
                        value: null,
                        refresh: !TimeLogOut.refresh
                    },
                    TimeLogTimeOut: {
                        ...TimeLogTimeOut,
                        value: null,
                        refresh: !TimeLogTimeOut.refresh
                    }
                },
                () => this.GetHighSupervior()
            );
        }
    };

    requestLocationPermission = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION, {
                title: 'Cool Photo App Camera Permission',
                message: 'Cool Photo App needs access to your camera ' + 'so you can take awesome pictures.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK'
            });
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            //
        }
    };

    checkPlatformCallRequestLocation = async () => {
        if (Platform.OS == 'android') {
            const Permission = await this.requestLocationPermission();
            if (Permission == true) {
                this.getLocation();
            }
        } else {
            this.getLocation();
        }
    };

    getAddressFromCoordinate = async (latitude, longitude) => {
        var NY = {
            lat: latitude,
            lng: longitude
        };
        return Geocoder.geocodePosition(NY);
    };

    getLocation = async () => {
        Geolocation.getCurrentPosition(
            position => {
                //console.log(position);
                let { latitude, longitude } = position.coords;
                const { currentLocation } = this.state;
                currentLocation.latitude = latitude;
                currentLocation.longitude = longitude;
                this.getAddressFromCoordinate(latitude, longitude).then(res => {
                    currentLocation.address = res[0].formattedAddress;
                    currentLocation.isShowModalMap = true;
                    this.setState({ currentLocation });
                });
            },
            () => {
                ToasterSevice.showError('PERMISSION_DENIED_GPS', 10000);
            },
            { enableHighAccuracy: false, timeout: 20000, maximumAge: 1000 }
        );
    };

    saveCurrentLocation = fileImageMapCurrentLocation => {
        const { currentLocation } = this.state;
        currentLocation.isShowModalMap = false;
        currentLocation.fileImageMapCurrentLocation = fileImageMapCurrentLocation;
        this.setState({ currentLocation });
    };

    render() {
        const {
                Type,
                TimeLog,
                TimeLogTime,
                TimeLogOut,
                TimeLogTimeOut,
                MissInOutReason,
                isShowApprove3,
                isShowApprove4,
                UserApprove,
                UserApprove3,
                UserApprove4,
                UserApprove2,
                isInAndOut,
                Comment,
                fieldValid,
                FileAttachment,
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

        const listActions = [];
        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_TamScanLogRegister_New_CreateOrUpdate_btnSaveandSendMail'] &&
            PermissionForAppMobile.value['New_Att_TamScanLogRegister_New_CreateOrUpdate_btnSaveandSendMail']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_SENMAIL,
                title: translate('HRM_Common_SaveAndSendMail'),
                onPress: () => this.onSaveAndSend(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_TamScanLogRegister_btnSaveClose'] &&
            PermissionForAppMobile.value['New_Att_TamScanLogRegister_btnSaveClose']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_CLOSE,
                title: translate('HRM_Common_SaveClose'),
                onPress: () => this.onSave(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Att_TamScanLogRegister_btnSaveCreate'] &&
            PermissionForAppMobile.value['New_Att_TamScanLogRegister_btnSaveCreate']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_NEW,
                title: translate('HRM_Common_SaveNew'),
                onPress: () => this.onSaveAndCreate(this.props.navigation)
            });
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                    >
                        {/* Type - Loại dữ liệu */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'HRM_Attendance_TAMScanLog_Type'}
                                />

                                {/* valid Type */}
                                {fieldValid.Type && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>
                            <View style={viewControl}>
                                <VnrPickerQuickly
                                    dataLocal={Type.data}
                                    textField="Text"
                                    valueField="Value"
                                    filter={false}
                                    value={Type.value}
                                    refresh={Type.refresh}
                                    onFinish={item => this.onChangeType(item)}
                                />
                            </View>
                        </View>

                        {/* TimeLog - Thời gian quẹt thẻ */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'HRM_Attendance_TAMScanLog_DateFrom'}
                                />

                                {/* valid TimeLog */}
                                {fieldValid.TimeLog && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>

                            <View style={viewControl}>
                                <View style={styleSheets.flexGrow1flexDirectionColumn}>
                                    <View style={formDate_To_From}>
                                        <View style={controlDate_from}>
                                            <VnrDate
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={TimeLog.value}
                                                refresh={TimeLog.refresh}
                                                type={'date'}
                                                onFinish={value => {
                                                    this.setState(
                                                        {
                                                            TimeLog: {
                                                                ...TimeLog,
                                                                value,
                                                                refresh: !TimeLog.refresh
                                                            }
                                                        },
                                                        () => this.GetHighSupervior()
                                                    );
                                                }}
                                            />
                                        </View>
                                        <View style={controlDate_To}>
                                            <VnrDate
                                                value={TimeLogTime.value}
                                                refresh={TimeLogTime.refresh}
                                                format={'HH:mm'}
                                                type={'time'}
                                                stylePicker={{ marginLeft: styleSheets.m_5 }}
                                                onFinish={value => {
                                                    this.setState(
                                                        {
                                                            TimeLogTime: {
                                                                ...TimeLogTime,
                                                                value,
                                                                refresh: !TimeLogTime.refresh
                                                            }
                                                        },
                                                        () => this.GetHighSupervior()
                                                    );
                                                }}
                                            />
                                        </View>
                                    </View>

                                    {/* hiển thị cho cả In và Out */}
                                    {isInAndOut && (
                                        <View style={[formDate_To_From, { marginTop: Size.defineSpace }]}>
                                            <View style={controlDate_from}>
                                                <VnrDate
                                                    response={'string'}
                                                    format={'DD/MM/YYYY'}
                                                    type={'date'}
                                                    value={TimeLogOut.value}
                                                    refresh={TimeLogOut.refresh}
                                                    onFinish={value => {
                                                        this.setState(
                                                            {
                                                                TimeLogOut: {
                                                                    ...TimeLogOut,
                                                                    value,
                                                                    refresh: !TimeLogOut.refresh
                                                                }
                                                            },
                                                            () => this.GetHighSupervior()
                                                        );
                                                    }}
                                                />
                                            </View>
                                            <View style={controlDate_To}>
                                                <VnrDate
                                                    value={TimeLogTimeOut.value}
                                                    refresh={TimeLogTimeOut.refresh}
                                                    format={'HH:mm'}
                                                    type={'time'}
                                                    stylePicker={{ marginLeft: styleSheets.m_5 }}
                                                    onFinish={value => {
                                                        this.setState(
                                                            {
                                                                TimeLogTimeOut: {
                                                                    ...TimeLogTimeOut,
                                                                    value,
                                                                    refresh: !TimeLogTimeOut.refresh
                                                                }
                                                            },
                                                            () => this.GetHighSupervior()
                                                        );
                                                    }}
                                                />
                                            </View>
                                        </View>
                                    )}
                                </View>
                            </View>
                        </View>

                        {/* MissInOutReason - Lý do không quẹt thẻ */}
                        {MissInOutReason.visibleConfig && MissInOutReason.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_TAMScanReasonMiss'}
                                    />

                                    {/* valid MissInOutReason */}
                                    {fieldValid.MissInOutReason && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>

                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiTamScanReasonMiss',
                                            type: 'E_GET'
                                        }}
                                        textField="TAMScanReasonMissName"
                                        valueField="ID"
                                        filter={true}
                                        refresh={MissInOutReason.refresh}
                                        filterServer={false}
                                        autoFilter={true}
                                        value={MissInOutReason.value}
                                        onFinish={item => {
                                            this.setState({
                                                MissInOutReason: {
                                                    ...this.state.MissInOutReason,
                                                    value: item
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Duyệt đầu - UserApprove */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'HRM_Attendance_TAMScanLog_UserApproveID'}
                                />

                                {/* valid UserApproveID */}
                                {fieldValid.UserApproveID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>
                            <View style={viewControl}>
                                <VnrPicker
                                    api={{
                                        urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_TAMSCANLOGREGISTER',
                                        type: 'E_GET'
                                    }}
                                    refresh={UserApprove.refresh}
                                    textField="UserInfoName"
                                    valueField="ID"
                                    filter={true}
                                    value={UserApprove.value}
                                    filterServer={true}
                                    filterParams="text"
                                    disable={UserApprove.disable}
                                    onFinish={item => this.onChangeUserApprove(item)}
                                />
                            </View>
                        </View>

                        {/* Duyệt kế tiếp - UserApprove3 */}
                        {isShowApprove3 && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_TAMScanLog_UserApproveID3'}
                                    />

                                    {/* valid UserApproveID3 */}
                                    {fieldValid.UserApproveID3 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>

                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_TAMSCANLOGREGISTER',
                                            type: 'E_GET'
                                        }}
                                        value={UserApprove3.value}
                                        refresh={UserApprove3.refresh}
                                        textField="UserInfoName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={true}
                                        filterParams="text"
                                        disable={UserApprove3.disable}
                                        onFinish={item => {
                                            this.setState({
                                                UserApprove3: {
                                                    ...UserApprove3,
                                                    value: item
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Duyệt tiếp theo - UserApprove4 */}
                        {isShowApprove4 && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_TAMScanLog_UserApproveID4'}
                                    />

                                    {/* valid UserApproveID4 */}
                                    {fieldValid.UserApproveID4 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>

                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_TAMSCANLOGREGISTER',
                                            type: 'E_GET'
                                        }}
                                        value={UserApprove4.value}
                                        refresh={UserApprove4.refresh}
                                        textField="UserInfoName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={true}
                                        filterParams="text"
                                        disable={UserApprove4.disable}
                                        onFinish={item => {
                                            this.setState({
                                                UserApprove4: {
                                                    ...UserApprove4,
                                                    value: item
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Duyệt cuối - UserApprove2 */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'HRM_Attendance_TAMScanLog_UserApproveID2'}
                                />

                                {/* valid UserApproveID2 */}
                                {fieldValid.UserApproveID2 && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>
                            <View style={viewControl}>
                                <VnrPicker
                                    api={{
                                        urlApi: '[URI_SYS]/Sys_GetData/GetMultiUserApproved_E_TAMSCANLOGREGISTER',
                                        type: 'E_GET'
                                    }}
                                    refresh={UserApprove2.refresh}
                                    textField="UserInfoName"
                                    valueField="ID"
                                    filter={true}
                                    filterServer={true}
                                    value={UserApprove2.value}
                                    filterParams="text"
                                    disable={UserApprove2.disable}
                                    onFinish={item => this.onChangeUserApprove2(item)}
                                />
                            </View>
                        </View>

                        {/* Mô tả - Comment */}
                        {Comment.visibleConfig && Comment.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Attendance_TAMScanLog_Comment'}
                                    />

                                    {/* valid Comment */}
                                    {fieldValid.Comment && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>

                                <View style={viewControl}>
                                    <VnrTextInput
                                        value={Comment.value}
                                        onChangeText={text =>
                                            this.setState({
                                                Comment: {
                                                    ...Comment,
                                                    value: text
                                                }
                                            })
                                        }
                                        // multiline={true}
                                        // numberOfLines={5}
                                    />
                                </View>
                            </View>
                        )}

                        {/* need fix for task 0158060 ECOPARK */}
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
                                        onFinish={file => {
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
                                        <VnrText style={styleSheets.lable} i18nKey={'Hrm_Notification'} />
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
    /// style modal error
    styleViewBorderButtom: {
        borderBottomWidth: 0.5,
        borderBottomColor: Colors.borderColor,
        flex: 1,
        marginBottom: 0.5,
        marginHorizontal: 10,
        paddingVertical: 10
    },
    groupButton: {
        flexGrow: 1,
        flexDirection: 'row',
        // borderTopWidth: 0.5,
        // borderTopColor: Colors.grey,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: styleSheets.p_10,
        backgroundColor: Colors.white,
        marginTop: 10,
        marginBottom: 10
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
        alignItems: 'center'
    }
});
