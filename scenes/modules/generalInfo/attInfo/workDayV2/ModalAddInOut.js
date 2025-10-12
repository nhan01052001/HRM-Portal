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
    ActivityIndicator,
    Platform
} from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Size,
    Colors,
    styleSafeAreaView,
    styleViewTitleForGroup,
    stylesModalPopupBottom,
    stylesScreenDetailV3,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import Modal from 'react-native-modal';
import { IconEdit, IconColse } from '../../../../../constants/Icons';
import { translate } from '../../../../../i18n/translate';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import HttpService from '../../../../../utils/HttpService';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';
import Geocoder from 'react-native-geocoder';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import { EnumName, EnumIcon } from '../../../../../assets/constant';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../utils/DrawerServices';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';

let enumName = null,
    profileInfo = null;
export default class ModalAddInOut extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isRefesh: false,
            isChoseProfile: true,
            CheckProfilesExclude: false,
            typeView: '',
            isLoadingModal: false,
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
            TimeLogOut: null,
            TimeLogTimeOut: null,
            MachineNo: '',
            MissInOutReason: {
                refresh: false,
                value: null,
                visibleConfig: true
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
            Comment: '',
            RejectReason: '',
            isTimeLogTimeModal: false,
            isTimeLogModal: false,
            modalErrorDetail: {
                isModalVisible: false,
                cacheID: '6fd0e45b-7ef1-4a95-98e8-cfe7ef50f3ee',
                data: []
            }
        };

        this.isRegisterHelp = null;
        this.levelApproveInOut = null;
        this.isModify = false;

        //xử lý set DateStart khi tạo mới từ màn hình Ngày công (WorkDay)
        //biến check load xong hàm getConfig và GetHighSupervior
        //dùng để call hàm onChangeDateStart khi 2 hàm trên chạy xong
        this.isDoneInit = null;

        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;

        // Chi tiết lỗi
        this.IsContinueSave = false;
        this.ProfileRemoveIDs = null;
        this.IsRemoveAndContinue = null;
        this.CacheID = null;

        this.resTypePicker = null;
        // props.navigation.setParams({
        //   title: props.record
        //     ? 'HRM_Canteen_TamScanLog_Update'
        //     : 'HRM_Canteen_TamScanLog_AddNew',
        //   headerRight: (
        //     <TouchableOpacity onPress={() => this.save(props.navigation)}>
        //       <View style={stylesListPickerControl.headerButtonStyle}>
        //         <IconPublish size={Size.iconSizeHeader} color={Colors.white} />
        //       </View>
        //     </TouchableOpacity>
        //   ),
        // });
    }

    save = (navigation) => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        if (this.isRegisterHelp && !this.isModify) {
            this.saveRegisterHelp(navigation);
        } else {
            this.saveNotRegisterHelp(navigation);
        }
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
                                style={[styleSheets.text, styles.styTextGroupExtend]}
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

    getErrorMessageRespone = () => {
        const { modalErrorDetail } = this.state,
            { cacheID } = modalErrorDetail;

        this.showHideLoading(true);
        HttpService.Post('[URI_HR]/Att_GetData/GetErrorMessageRespone', {
            cacheID: cacheID
        }).then((res) => {
            this.showHideLoading(false);
            if (res && res.Data) {
                this.setState({
                    modalErrorDetail: {
                        ...modalErrorDetail,
                        data: res.Data
                    }
                });
            }
        });
    };

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

    saveNotRegisterHelp = (navigation) => {
        const {
                Type,
                ProfileID,
                UserApprove,
                UserApprove3,
                UserApprove4,
                UserApprove2,
                TimeLog,
                TimeLogTime,
                MissInOutReason,
                modalErrorDetail
            } = this.state,
            { apiConfig } = dataVnrStorage,
            { uriPor } = apiConfig;

        const { workDayItem } = this.props;
        // let params = {
        //   ...this.state,
        //   ProfileIds: ProfileID ? ProfileID.ID : null,
        //   OrgStructureIDs: null,
        //   ProfileIDsExclude: null,
        //   TimeLog: TimeLog ? TimeLog.value : null,
        //   TimeLogTime: TimeLogTime
        //     ? moment(TimeLogTime.value).format('YYYY-MM-DD HH:mm:ss')
        //     : null,
        //   MissInOutReason: MissInOutReason
        //     ? MissInOutReason.value
        //       ? MissInOutReason.value.ID
        //       : null
        //     : null,
        //   IsPortal: true,
        //   Status: 'E_SUBMIT',
        //   Type: Type ? (Type.value ? Type.value.Value : null) : null,
        //   ProfileID: ProfileID ? ProfileID.ID : null,
        //   UserApproveID: UserApprove
        //     ? UserApprove.value
        //       ? UserApprove.value.ID
        //       : null
        //     : null,
        //   UserApproveID2: UserApprove2
        //     ? UserApprove2.value
        //       ? UserApprove2.value.ID
        //       : null
        //     : null,
        //   UserApproveID3: UserApprove3
        //     ? UserApprove3.value
        //       ? UserApprove3.value.ID
        //       : null
        //     : null,
        //   UserApproveID4: UserApprove4
        //     ? UserApprove4.value
        //       ? UserApprove4.value.ID
        //       : null
        //     : null,
        // };

        let params = {
            ...this.state,
            ProfileIds: ProfileID ? ProfileID.ID : null,
            OrgStructureIDs: null,
            ProfileIDsExclude: null,
            TimeLog: TimeLog ? moment(TimeLog.value).format('YYYY-MM-DD 00:00:00') : null,
            TimeLogTime: TimeLogTime.value ? moment(TimeLogTime.value).format('HH:mm') : null,
            WorkDate: workDayItem ? moment(workDayItem.WorkDate).format('YYYY-MM-DD HH:mm:ss') : null,
            // TimeLogTimeOut: TimeLogTimeOut.value ? moment(TimeLogTimeOut.value).format('HH:mm') : null,
            //TimeLogOut: TimeLogOut.value ? moment(TimeLogOut.value).format("YYYY-MM-DD HH:mm:ss") : null,
            MissInOutReason: MissInOutReason ? (MissInOutReason.value ? MissInOutReason.value.ID : null) : null,
            IsPortal: true,
            Status: 'E_SUBMIT',
            Type: Type && Type.value ? Type.value.Value : null,
            ProfileID: ProfileID ? ProfileID.ID : null,
            UserApproveID: UserApprove ? (UserApprove.value ? UserApprove.value.ID : null) : null,
            UserApproveID2: UserApprove2 ? (UserApprove2.value ? UserApprove2.value.ID : null) : null,
            UserApproveID3: UserApprove3 ? (UserApprove3.value ? UserApprove3.value.ID : null) : null,
            UserApproveID4: UserApprove4 ? (UserApprove4.value ? UserApprove4.value.ID : null) : null
        };

        params = {
            ...params,
            SendEmailStatus: 'E_SUBMIT',
            Host: uriPor,
            IsAddNewAndSendMail: true
        };

        let formData = new FormData();
        formData.append('AttTamScanModel', JSON.stringify(params));

        const configs = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        };

        this.showHideLoading(true);
        HttpService.Post('[URI_POR]/New_Att_TamScanLogRegister/SaveAttTamScanLogResHelp', formData, configs).then(
            (data) => {
                this.showHideLoading(false);
                this.isProcessing = false;
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
                                            this.onSave(navigation);
                                        },
                                        //đóng
                                        onCancel: () => {},
                                        //chi tiết lỗi
                                        textRightButton: translate('Button_Detail'),
                                        onConfirm: () => {
                                            try {
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
                                            } catch (error) {
                                                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                                            }
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
                                            try {
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
                                            } catch (error) {
                                                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                                            }
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
                                        this.onSave(navigation);
                                    },
                                    //đóng
                                    onCancel: () => {},
                                    //chi tiết lỗi
                                    textRightButton: translate('Button_Detail'),
                                    onConfirm: () => {
                                        try {
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
                                        } catch (error) {
                                            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                                        }
                                    }
                                });
                            }
                        } else if (data.ActionStatus == 'Hrm_Locked') {
                            this.showTextWarning('Hrm_Locked');
                        } else if (data.ActionStatus == 'Success') {
                            ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                            this.hideModalEdit();
                            // if (isCreate) {
                            //   this.refreshView();
                            // }
                            // else {
                            //   navigation.goBack();
                            // }

                            const { reload } = this.props;
                            if (reload && typeof reload === 'function') {
                                reload();
                            }
                        } else {
                            this.showTextWarning(data.ActionStatus);
                        }
                    } else {
                        DrawerServices.navigate('ErrorScreen', {
                            ErrorDisplay: { AttSubmitTSLRegisterAddOrEdit: 'create error' }
                        });
                    }
                    // if (res && typeof res === enumName.E_object) {
                    //   if (res.ActionStatus == 'Hrm_Locked') {
                    //     ToasterSevice.showWarning('Hrm_Locked', 4000);

                    //     //xử lý lại event Save
                    //     this.isProcessing = false;
                    //   } else if (res.ActionStatus == 'Success') {
                    //     ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                    //     //navigation.navigate('AttSubmitTSLRegister');

                    //     // navigation.goBack();

                    //     const { reload } = this.props;
                    //     if (reload && typeof reload === 'function') {
                    //       reload();
                    //     }

                    //     //NotificationsService.getListUserPushNotify();
                    //   } else {
                    //     ToasterSevice.showWarning(res.ActionStatus, 4000);

                    //     //xử lý lại event Save
                    //     this.isProcessing = false;
                    //   }
                    // } else {
                    //   DrawerServices.navigate('ErrorScreen', {
                    //     ErrorDisplay: { AttSubmitTSLRegisterAddOrEdit: 'create error' },
                    //   });
                    // }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            }
        );
    };

    alertHasChangeData = () => {
        AlertSevice.alert({
            iconType: EnumIcon.E_INFO,
            message: 'Dữ liệu chưa được lưu, bạn vẫn muốn bỏ qua!',
            onCancel: () => {},
            onConfirm: () => {
                this.props.navigation.navigate('AttSubmitTSLRegister');
            }
        });
    };

    hasChange = () => {
        if (this.isRegisterHelp) {
            const {
                UserApprove,
                UserApprove3,
                UserApprove4,
                UserApprove2,
                TimeLog,
                TimeLogTime,
                TimeLogOut,
                TimeLogTimeOut,
                MissInOutReason,
                Profiles,
                Type,
                OrgStructures,
                ProfilesExclude,
                MachineNo,
                CardCode,
                Comment,
                RejectReason,
                isChoseProfile
            } = this.state;
            let params = {
                Type: Type ? (Type.value ? Type.value.Value : null) : null,
                TimeLog: TimeLog ? TimeLog.value : null,
                TimeLogTime: TimeLogTime ? moment(TimeLogTime.value).format('YYYY-MM-DD HH:mm:ss') : null,
                TimeLogOut,
                TimeLogTimeOut,
                MachineNo,
                CardCode,
                Comment,
                RejectReason,
                MissInOutReason: MissInOutReason ? (MissInOutReason.value ? MissInOutReason.value.ID : null) : null,
                ProfileID: null,
                UserApproveID: UserApprove ? (UserApprove.value ? UserApprove.value.ID : null) : null,
                UserApproveID2: UserApprove2 ? (UserApprove2.value ? UserApprove2.value.ID : null) : null,
                UserApproveID3: UserApprove3 ? (UserApprove3.value ? UserApprove3.value.ID : null) : null,
                UserApproveID4: UserApprove4 ? (UserApprove4.value ? UserApprove4.value.ID : null) : null
            };

            if (isChoseProfile) {
                params = {
                    ...params,
                    ProfileIds: Profiles.value ? Profiles.value.map((item) => item.ID).join() : null,
                    OrgStructureIDs: null,
                    ProfileIDsExclude: null
                };
            } else {
                params = {
                    ...params,
                    ProfileIDsExclude: ProfilesExclude.value
                        ? ProfilesExclude.value.map((item) => item.ID).join()
                        : null,
                    OrgStructureIDs: OrgStructures.value
                        ? OrgStructures.value.map((item) => item.OrderNumber).join()
                        : null,
                    ProfileIds: null
                };
            }

            let isHasChange = false;
            // eslint-disable-next-line no-unused-vars
            for (let key in params) {
                if (params[key] && params[key] !== '') {
                    isHasChange = true;
                    break;
                }
            }

            if (isHasChange) {
                this.alertHasChangeData();
            } else {
                this.props.navigation.navigate('AttSubmitTSLRegister');
            }
        } else {
            const {
                UserApprove,
                UserApprove3,
                UserApprove4,
                UserApprove2,
                TimeLog,
                TimeLogTime,
                TimeLogOut,
                TimeLogTimeOut,
                MissInOutReason,
                Type,
                MachineNo,
                CardCode,
                Comment,
                RejectReason
            } = this.state;

            let params = {
                MachineNo,
                CardCode,
                Comment,
                RejectReason,
                ProfileIds: null,
                OrgStructureIDs: null,
                ProfileIDsExclude: null,
                TimeLog: TimeLog ? TimeLog.value : null,
                TimeLogTime: TimeLogTime ? moment(TimeLogTime.value).format('YYYY-MM-DD HH:mm:ss') : null,
                TimeLogOut,
                TimeLogTimeOut,
                MissInOutReason: MissInOutReason ? (MissInOutReason.value ? MissInOutReason.value.ID : null) : null,
                Type: Type ? (Type.value ? Type.value.Value : null) : null,
                UserApproveID: UserApprove ? (UserApprove.value ? UserApprove.value.ID : null) : null,
                UserApproveID2: UserApprove2 ? (UserApprove2.value ? UserApprove2.value.ID : null) : null,
                UserApproveID3: UserApprove3 ? (UserApprove3.value ? UserApprove3.value.ID : null) : null,
                UserApproveID4: UserApprove4 ? (UserApprove4.value ? UserApprove4.value.ID : null) : null
            };

            let isHasChange = false;
            // eslint-disable-next-line no-unused-vars
            for (let key in params) {
                if (params[key] && params[key] !== '') {
                    isHasChange = true;
                    break;
                }
            }

            if (isHasChange) {
                this.alertHasChangeData();
            } else {
                this.props.navigation.navigate('AttSubmitTSLRegister');
            }
        }
    };

    //get type in/out
    getTypeInOut = (TimeLogTimeFromRoster) => {
        const _configField =
            ConfigField && ConfigField.value['AttSubmitTSLRegisterAddOrEdit']
                ? ConfigField.value['AttSubmitTSLRegisterAddOrEdit']['Hidden']
                : [];

        let MissInOutvisibleConfig = _configField.findIndex((key) => key == 'MissInOutReason') > -1 ? false : true;

        HttpService.Get('[URI_SYS]/Sys_GetData/GetEnum?text=TamScanLogType').then((res) => {
            try {
                let { Type, MissInOutReason } = this.state,
                    data = [];
                if (this.isModify) {
                    data = res.filter((item) => {
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
                        },
                        MissInOutReason: {
                            ...MissInOutReason,
                            visibleConfig: MissInOutvisibleConfig
                        }
                    },
                    () => {
                        const { workDayItem } = this.props;
                        if (workDayItem) {
                            const { TimeLog, TimeLogTime } = this.state;
                            this.setState({
                                TimeLog: {
                                    ...TimeLog,
                                    value: moment(workDayItem.WorkDate).format('YYYY-MM-DD HH:mm:ss'),
                                    refresh: !TimeLog.refresh
                                },
                                TimeLogTime: {
                                    ...TimeLogTime,
                                    value: TimeLogTimeFromRoster ? TimeLogTimeFromRoster : new Date(),
                                    refresh: !TimeLogTime.refresh
                                }
                            });

                            if (workDayItem.Type) {
                                let findType = data.find((item) => item.Value === workDayItem.Type);

                                if (!findType) {
                                    findType = data[0];
                                }

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

    componentDidMount() {
        enumName = EnumName;
        profileInfo = dataVnrStorage ? (dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info : null) : null;

        let { record } = this.props;

        //get type in/out
        this.getTypeInOut();

        //check đăng ký hộ
        this.isRegisterHelp = false;
        this.initData(record);
    }

    handleSetState = (_id, response, data) => {
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
            TimeLog: {
                value: response['TimeLog'],
                refresh: !this.state.TimeLog.refresh
            },
            TimeLogTime: {
                value: response['TimeLogTime'],
                refresh: !this.state.TimeLogTime.refresh
            },
            TimeLogOut: null,
            TimeLogTimeOut: null,
            MachineNo: response['MachineNo'],
            MissInOutReason: {
                refresh: !this.state.MissInOutReason.refresh,
                value: objMissInOutReason
            },
            isShowApprove3: _isShowApprove3,
            isShowApprove4: _isShowApprove4,
            isInAndOut: false,
            UserApprove: {
                ...this.state.UserApprove,
                refresh: !this.state.UserApprove.refresh,
                value: objUserApprove
            },
            UserApprove3: {
                ...this.state.UserApprove3,
                refresh: !this.state.UserApprove3.refresh,
                value: objUserApprove3
            },
            UserApprove4: {
                ...this.state.UserApprove4,
                refresh: !this.state.UserApprove4.refresh,
                value: objUserApprove4
            },
            UserApprove2: {
                ...this.state.UserApprove2,
                refresh: !this.state.UserApprove2.refresh,
                value: objUserApprove2
            },
            Comment: response['Comment'],
            RejectReason: response['RejectReason']
        });
    };

    getRecordAndConfigByID = (_id, _handleSetState) => {
        this.showHideLoading(true);

        HttpService.MultiRequest([
            HttpService.Get('[URI_HR]/Att_GetData/New_GetAttTamScanLogByID?ID=' + _id),
            HttpService.Post('[URI_HR]/Att_GetData/GetConfigAproveRegister', {
                RecordID: _id
            })
        ]).then((res) => {
            this.showHideLoading(false);

            try {
                _handleSetState(_id, res[0], res[1]);
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    initData = (record) => {
        //sửa
        if (record) {
            this.isModify = true;
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
            });
        }
    };

    GetCardCodeByProfileID = (profileID) => {
        HttpService.Post('[URI_HR]/Hre_GetData/GetCardCodeByProfileID', {
            id: profileID
        }).then((data) => {
            try {
                if (data && data.length > 1 && data[1]) {
                    this.setState({ CardCode: data[1].CodeAttendance });
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    GetHighSupervior = (profileId, type) => {
        this.showHideLoading(true);

        let { workDayItem } = this.props,
            _id = workDayItem.ID,
            _type = workDayItem.Type;
        HttpService.MultiRequest([
            HttpService.Post('[URI_HR]/Att_GetData/GetHighSupervisor', {
                ProfileID: profileId,
                userSubmit: profileId,
                type: type
            }),
            HttpService.Post('[URI_HR]/Att_GetData/GetBeginOrEndShiftByWorkday', {
                id: _id,
                type: _type
            })
        ]).then((resAll) => {
            const [result, TimeLogTimeFromRoster] = resAll;
            this.showHideLoading(false);

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
                                        value: {
                                            UserInfoName: result.SupervisorName,
                                            ID: result.SupervisorID
                                        }
                                    },
                                    UserApprove2: {
                                        ...nextState.UserApprove2,
                                        value: {
                                            UserInfoName: result.SupervisorName,
                                            ID: result.SupervisorID
                                        }
                                    },
                                    UserApprove3: {
                                        ...nextState.UserApprove3,
                                        value: {
                                            UserInfoName: result.SupervisorName,
                                            ID: result.SupervisorID
                                        }
                                    },
                                    UserApprove4: {
                                        ...nextState.UserApprove4,
                                        value: {
                                            UserInfoName: result.SupervisorName,
                                            ID: result.SupervisorID
                                        }
                                    }
                                };
                            }
                        } else {
                            if (result.SupervisorID != null) {
                                nextState = {
                                    ...nextState,
                                    UserApprove: {
                                        ...nextState.UserApprove,
                                        value: {
                                            UserInfoName: result.SupervisorName,
                                            ID: result.SupervisorID
                                        }
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
                                    value: {
                                        UserInfoName: result.SupervisorName,
                                        ID: result.SupervisorID
                                    }
                                }
                            };
                        }

                        if (result.MidSupervisorID != null) {
                            nextState = {
                                ...nextState,
                                UserApprove3: {
                                    ...nextState.UserApprove3,
                                    value: {
                                        UserInfoName: result.SupervisorNextName,
                                        ID: result.MidSupervisorID
                                    }
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
                                    value: {
                                        UserInfoName: result.SupervisorName,
                                        ID: result.SupervisorID
                                    }
                                }
                            };
                        }

                        if (result.MidSupervisorID != null) {
                            nextState = {
                                ...nextState,
                                UserApprove3: {
                                    ...nextState.UserApprove3,
                                    value: {
                                        UserInfoName: result.SupervisorNextName,
                                        ID: result.MidSupervisorID
                                    }
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
                                    value: {
                                        UserInfoName: result.HighSupervisorName,
                                        ID: result.HighSupervisorID
                                    }
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
                                    value: {
                                        UserInfoName: result.SupervisorName,
                                        ID: result.SupervisorID
                                    }
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
                                    value: {
                                        UserInfoName: result.HighSupervisorName,
                                        ID: result.HighSupervisorID
                                    }
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
                    //if (!this.isDoneInit)
                    this.getTypeInOut(TimeLogTimeFromRoster);
                    // const { workDayItem } = this.props;
                    // if (workDayItem) {
                    //   const { TimeLog, Type, TimeLogTime } = this.state,
                    //     { data } = Type;
                    //   this.setState({
                    //     TimeLog: {
                    //       ...TimeLog,
                    //       value: moment(workDayItem.WorkDate).format(
                    //         'YYYY-MM-DD HH:mm:ss',
                    //       ),
                    //       refresh: !TimeLog.refresh,
                    //     },
                    //     TimeLogTime: {
                    //       ...TimeLogTime,
                    //       value: TimeLogTimeFromRoster ? TimeLogTimeFromRoster : new Date(),
                    //       refresh: !TimeLogTime.refresh,
                    //     },
                    //   });

                    //   if (workDayItem.Type) {
                    //     let findType = data.find(
                    //       item => item.Value === workDayItem.Type,
                    //     );

                    //     if (!findType) {
                    //       findType = { Value: workDayItem.Type, Text: workDayItem.Type };
                    //     }

                    //     //call onChangeType
                    //     this.onChangeType(findType);
                    //   }

                    // }
                });
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    loadHighSupervisor_TamScanLogRegister = (pro) => {
        if (pro) {
            this.GetHighSupervior(pro, 'E_TAMSCANLOGREGISTER');
        } else {
            this.setState({
                UserApprove: null,
                UserApprove3: null,
                UserApprove4: null,
                UserApprove2: null
            });
        }
    };

    onChangeUserApprove = (item) => {
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

    onChangeUserApprove2 = (item) => {
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

    onChangeType = (item) => {
        const { Type } = this.state;

        if (!Vnr_Function.CheckIsNullOrEmpty(item)) {
            if (item.Value == 'E_INOUT') {
                this.setState({
                    Type: {
                        ...Type,
                        value: { ...item },
                        refresh: !Type.refresh
                    },
                    isInAndOut: true,
                    TimeLogOut: null,
                    TimeLogTimeOut: null
                });
            } else {
                this.setState({
                    Type: {
                        ...Type,
                        value: { ...item },
                        refresh: !Type.refresh
                    },
                    isInAndOut: false,
                    TimeLogOut: null,
                    TimeLogTimeOut: null,
                    typeView: item.Text
                });
            }
        } else {
            this.setState({
                Type: {
                    ...Type,
                    value: null,
                    refresh: !Type.refresh
                },
                isInAndOut: false,
                TimeLogOut: null,
                TimeLogTimeOut: null
            });
        }
    };

    treeViewResult = (items) => {
        this.setState({
            OrgStructures: {
                ...this.state.OrgStructures,
                value: [...items]
            }
        });
    };

    addMoreExcludeProfiles = (items) => {
        this.props.navigation.navigate('AttSubmitTSLRegisterAddOrEdit');

        if (items.length) {
            const { ProfilesExclude } = this.state,
                _profilesExclude = ProfilesExclude.value;

            if (_profilesExclude && _profilesExclude.length) {
                let data = [];
                items.forEach((item) => {
                    let findItem = _profilesExclude.find((profileExclude) => {
                        return item.ID == profileExclude.ID;
                    });

                    if (!findItem) {
                        data = [...data, { ...item }];
                    }
                });

                this.setState({
                    ProfilesExclude: {
                        ...ProfilesExclude,
                        refresh: !ProfilesExclude.refresh,
                        value: [..._profilesExclude, ...data]
                    }
                });
            } else {
                this.setState({
                    ProfilesExclude: {
                        ...ProfilesExclude,
                        refresh: !ProfilesExclude.refresh,
                        value: [...items]
                    }
                });
            }
        }
    };

    onFinishPickerMultiExcludeProfile = (items) => {
        this.setState({
            ProfilesExclude: {
                ...this.state.ProfilesExclude,
                value: [...items]
            }
        });
    };

    nextScreenAddMoreProfilesExcludeProfile = () => {
        const { OrgStructures } = this.state;
        this.props.navigation.navigate('FilterToAddProfile', {
            addMoreProfiles: this.addMoreExcludeProfiles,
            valueFilter: { OrgStructureID: OrgStructures.value }
        });
    };

    addMoreProfiles = (items) => {
        this.props.navigation.navigate('AttSubmitTSLRegisterAddOrEdit');
        this.onFinishPickerMulti(items, true);
    };

    onFinishPickerMulti = (items, isAddMore) => {
        if (isAddMore) {
            if (items.length) {
                const { Profiles } = this.state,
                    _profiles = Profiles.value;

                if (_profiles && _profiles.length) {
                    let data = [];
                    items.forEach((item) => {
                        let findItem = _profiles.find((profile) => {
                            return item.ID == profile.ID;
                        });

                        if (!findItem) {
                            data = [...data, { ...item }];
                        }
                    });

                    this.setState({
                        Profiles: {
                            ...Profiles,
                            refresh: !Profiles.refresh,
                            value: [..._profiles, ...data]
                        }
                    });
                } else if (items.length == 1) {
                    this.setState(
                        {
                            Profiles: {
                                ...Profiles,
                                refresh: !Profiles.refresh,
                                value: [...items]
                            }
                        },
                        this.loadHighSupervisor_TamScanLogRegister(items[0].ID)
                    );
                } else {
                    this.setState({
                        Profiles: {
                            ...Profiles,
                            refresh: !Profiles.refresh,
                            value: [...items]
                        },
                        UserApprove: { ...this.state.UserApprove, value: null },
                        UserApprove2: { ...this.state.UserApprove2, value: null },
                        UserApprove3: { ...this.state.UserApprove3, value: null },
                        UserApprove4: { ...this.state.UserApprove4, value: null }
                    });
                }
            }
        } else if (items.length == 1) {
            this.setState(
                {
                    Profiles: {
                        ...this.state.Profiles,
                        value: [...items]
                    }
                },
                this.loadHighSupervisor_TamScanLogRegister(items[0].ID)
            );
        } else {
            this.setState({
                Profiles: {
                    ...this.state.Profiles,
                    value: [...items]
                },
                UserApprove: { ...this.state.UserApprove, value: null },
                UserApprove2: { ...this.state.UserApprove2, value: null },
                UserApprove3: { ...this.state.UserApprove3, value: null },
                UserApprove4: { ...this.state.UserApprove4, value: null }
            });
        }
    };

    nextScreenAddMoreProfiles = () => {
        this.props.navigation.navigate('FilterToAddProfile', {
            addMoreProfiles: this.addMoreProfiles,
            valueFilter: false
        });
    };

    onChangeRadio = (value) => {
        this.setState({ isChoseProfile: value });
    };

    onCheckExcludeProfile = (CheckProfilesExclude) => {
        this.setState({ CheckProfilesExclude: !CheckProfilesExclude });
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
            // eslint-disable-next-line no-console
            console.warn(err);
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
            (position) => {
                //console.log(position);
                let { latitude, longitude } = position.coords;
                const { currentLocation } = this.state;
                currentLocation.latitude = latitude;
                currentLocation.longitude = longitude;
                this.getAddressFromCoordinate(latitude, longitude).then((res) => {
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

    saveCurrentLocation = (fileImageMapCurrentLocation) => {
        const { currentLocation } = this.state;
        currentLocation.isShowModalMap = false;
        currentLocation.fileImageMapCurrentLocation = fileImageMapCurrentLocation;
        this.setState({ currentLocation });
    };

    getControl = () => this.toControl;

    setControl = (ctrl) => {
        this.toControl = ctrl;
    };

    hideModalEdit = () => {
        const { hideModalUpdateInOut } = this.props;
        hideModalUpdateInOut();
    };

    initViewControl = (type, filedNameUpdate, value) => {
        const { checkInOutUpdate } = this.state;
        if (type == 'E_DATE') {
            let _ctrl = {
                filedNameUpdate: filedNameUpdate,
                value:
                    checkInOutUpdate != null && checkInOutUpdate[filedNameUpdate] != undefined
                        ? checkInOutUpdate[filedNameUpdate]
                        : moment(value),
                format: 'DD-MM-YYYY',
                hideControl: true,
                type: 'date'
            };
            this.setControl(_ctrl);
            this.setState({ checkInOutUpdate: this.state.checkInOutUpdate });
        }
        if (type == 'E_TIME') {
            let _ctrl = {
                filedNameUpdate: filedNameUpdate,
                value:
                    checkInOutUpdate != null && checkInOutUpdate[filedNameUpdate] != undefined
                        ? checkInOutUpdate[filedNameUpdate]
                        : moment(value),
                format: 'HH:mm',
                hideControl: true,
                type: 'time'
            };
            this.setControl(_ctrl);
            this.setState({ checkInOutUpdate: this.state.checkInOutUpdate });
        }
    };

    // onFinish = (item, control) => {
    //     this.setControl(null);
    //     // const obj = {
    //     //   ...this.state.checkInOutUpdate,
    //     //   ...{[control.filedNameUpdate]: item},
    //     // };
    //     this.setState({
    //         TimeLogTime: {
    //             ...TimeLogTime,
    //             value: value ? moment(value).format('HH:mm') : null
    //         }
    //     });
    //     this.setState({});
    // };

    pickChangeType = () => {
        this.resTypePicker && this.resTypePicker.opentModal && this.resTypePicker.opentModal();
    };

    showHideLoading = (bool) => {
        this.setState({
            isLoadingModal: bool
        });
    };

    showTextWarning = (text) => {
        let timeOut = setTimeout(() => {
            this.setState({
                textWarning: ''
            });

            clearTimeout(timeOut);
        }, 4000);

        this.setState({
            textWarning: translate(text)
        });
    };

    render() {
        const {
                TimeLogTime,
                isTimeLogTimeModal,
                TimeLog,
                Comment,
                MissInOutReason,
                modalErrorDetail,
                Type,
                isLoadingModal,
                textWarning
            } = this.state,
            { workDayItem, isOnUpdateInOut } = this.props;

        let textInOut = '';

        if (Type.value && Type.value.Value == EnumName.E_IN) {
            // iconInOut = <IconLogin size={Size.iconSize} color={Colors.primary} />;
            textInOut = <VnrText style={[styleSheets.text, styles.styLinkText]} i18nKey={'InTime'} />;
        } else {
            // iconInOut = <IconLogout size={Size.iconSize} color={Colors.primary} />;
            textInOut = <VnrText style={[styleSheets.text, styles.styLinkText]} i18nKey={'TimeCoOut'} />;
        }

        return (
            <View>
                {TimeLog.value && (
                    <Modal
                        onBackButtonPress={() => this.hideModalEdit()}
                        key={'@MODAL_EDIT'}
                        isVisible={isOnUpdateInOut}
                        onBackdropPress={() => this.hideModalEdit()}
                        customBackdrop={
                            <TouchableWithoutFeedback onPress={() => this.hideModalEdit()}>
                                <View style={stylesScreenDetailV3.modalBackdrop} />
                            </TouchableWithoutFeedback>
                        }
                        style={CustomStyleSheet.margin(0)}
                    >
                        <View style={styles.viewEditModal}>
                            {isLoadingModal && (
                                <View style={styles.styleViewLoading}>
                                    <ActivityIndicator size={Size.iconSize} color={Colors.primary} />
                                </View>
                            )}
                            <SafeAreaView {...styleSafeAreaView} style={styles.stySafeAreaView}>
                                <KeyboardAwareScrollView
                                    keyboardShouldPersistTaps={'handled'}
                                    contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                                    enableOnAndroid={false}
                                >
                                    <View style={styles.headerCloseModal}>
                                        <View style={styles.groupTitle}>
                                            <View style={styles.titleModal}>
                                                <VnrText
                                                    style={[styleSheets.lable, styles.titleModal__text]}
                                                    i18nKey={'HRM_Canteen_TamScanLog_AddNew'}
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    <View style={CustomStyleSheet.flex(1)}>
                                        {textWarning && (
                                            <View style={styles.formError}>
                                                <View style={styleSheets.lable}>
                                                    <Text style={[styleSheets.text, styles.textError]}>
                                                        {textWarning}
                                                    </Text>
                                                </View>
                                            </View>
                                        )}

                                        <View style={styles.styleViewContentModal}>
                                            <View style={styles.groupTitleShiftName}>
                                                <Text style={[styleSheets.text, styles.titleTimeLog]}>
                                                    {TimeLog.value != null
                                                        ? `${translate(
                                                            `E_${moment(TimeLog.value).format('dddd')}`.toUpperCase()
                                                        )}, ${moment(TimeLog.value).format('DD')} ${translate(
                                                            'Month_Lowercase'
                                                        )} ${moment(TimeLog.value).format('M')} ${translate(
                                                            'E_YEAR'
                                                        ).toLowerCase()} ${moment(TimeLog.value).format('YYYY')}`
                                                        : //moment(TimeLog.value).format('DD/MM/YYYY')
                                                        `${translate(
                                                            `E_${moment().format('dddd')}`.toUpperCase()
                                                        )}, ${moment().format('DD')} ${translate(
                                                            'Month_Lowercase'
                                                        )} ${moment().format('M')} ${translate(
                                                            'E_YEAR'
                                                        ).toLowerCase()} ${moment().format('YYYY')}`}
                                                </Text>
                                                {workDayItem && workDayItem.ShiftName != null && (
                                                    <Text style={[styleSheets.text, styles.titleShiftName]}>
                                                        {workDayItem.ShiftName}
                                                    </Text>
                                                )}
                                            </View>

                                            <TouchableOpacity
                                                onPress={() => {
                                                    this.setState({ isTimeLogTimeModal: true });
                                                }}
                                                style={styles.bntChangeTimeLog}
                                            >
                                                {/* <IconTime size={Size.iconSize + 3} color={Colors.primary} /> */}
                                                <View style={styles.bntChangeTimeLog_top}>
                                                    <Text style={[styleSheets.text, styles.textTimeLogTime]}>
                                                        {TimeLogTime.value != null
                                                            ? moment(TimeLogTime.value).format('HH')
                                                            : moment().format('HH')}
                                                    </Text>
                                                    <Text style={[styleSheets.text, styles.textLineCenter]}>:</Text>
                                                    <Text style={[styleSheets.text, styles.textTimeLogTime]}>
                                                        {TimeLogTime.value != null
                                                            ? moment(TimeLogTime.value).format('mm')
                                                            : moment().format('mm')}
                                                    </Text>
                                                </View>

                                                <TouchableOpacity
                                                    onPress={this.pickChangeType}
                                                    style={styles.bntChangeTimeLog_bottom}
                                                >
                                                    {textInOut}
                                                </TouchableOpacity>
                                            </TouchableOpacity>

                                            {MissInOutReason.visibleConfig && (
                                                <View style={styles.viewReason}>
                                                    <VnrPicker
                                                        stylePlaceholder={styles.styPickerGrey}
                                                        // stylePicker={styles.stylesControl}
                                                        placeholder={'HRM_Attendance_TAMScanReasonMiss'}
                                                        api={{
                                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiTamScanReasonMiss',
                                                            type: 'E_GET'
                                                        }}
                                                        textField="TAMScanReasonMissName"
                                                        valueField="ID"
                                                        filter={true}
                                                        refresh={MissInOutReason.refresh}
                                                        filterServer={false}
                                                        value={MissInOutReason.value}
                                                        onFinish={(item) => {
                                                            this.setState({
                                                                MissInOutReason: {
                                                                    ...this.state.MissInOutReason,
                                                                    value: item
                                                                }
                                                            });
                                                        }}
                                                    />
                                                </View>
                                            )}

                                            <View style={styles.viewCommentUpdateInOut}>
                                                <View style={styles.bntShowNotes}>
                                                    <IconEdit color={Colors.primary} size={Size.iconSize} />
                                                </View>

                                                <VnrTextInput
                                                    style={styles.styleInputNote}
                                                    placeholder={`${translate('HRM_Attendance_TAMScanLog_Comment')}`}
                                                    onChangeText={(text) => this.setState({ Comment: text })}
                                                    value={Comment}
                                                    returnKeyType="done"
                                                />
                                            </View>
                                        </View>
                                    </View>

                                    <View style={styles.styleViewBntApprove}>
                                        <TouchableOpacity style={styles.bntCancel} onPress={() => this.hideModalEdit()}>
                                            <VnrText
                                                style={[styleSheets.lable, { color: Colors.gray_10 }]}
                                                i18nKey={'HRM_Common_Close'}
                                            />
                                        </TouchableOpacity>
                                        <TouchableOpacity
                                            style={styles.bntApprove}
                                            onPress={() => {
                                                this.save();
                                            }}
                                        >
                                            <VnrText
                                                style={[styleSheets.lable, styles.bntApprove_text]}
                                                i18nKey={'Hrm_Common_SubmitApproved'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </KeyboardAwareScrollView>
                            </SafeAreaView>
                        </View>

                        {isTimeLogTimeModal && (
                            <VnrDate
                                autoShowModal={true}
                                hideControl={true}
                                value={TimeLogTime.value}
                                refresh={TimeLogTime.refresh}
                                format={'HH:mm'}
                                type={'time'}
                                onFinish={(value) => {
                                    this.setState({
                                        TimeLogTime: {
                                            ...TimeLogTime,
                                            value: value ? value : TimeLogTime.value
                                        },
                                        isTimeLogTimeModal: false
                                    });
                                }}
                                onCancel={() => this.setState({ isTimeLogTimeModal: false })}
                            />
                        )}

                        <View style={styles.styViewPickerQuickly}>
                            <VnrPickerQuickly
                                ref={(refs) => (this.resTypePicker = refs)}
                                dataLocal={Type.data}
                                textField="Text"
                                valueField="Value"
                                filter={false}
                                value={Type.value}
                                refresh={Type.refresh}
                                onFinish={(item) => this.onChangeType(item)}
                            />
                        </View>
                    </Modal>
                )}

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
                                <View style={styles.headerCloseModalError}>
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
        );
    }
}

const styles = StyleSheet.create({
    styViewPickerQuickly: { position: 'absolute', bottom: -200 },
    styPickerGrey: { color: Colors.grey, opacity: 0.8 },
    stySafeAreaView: { flex: 1, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
    styTextGroupExtend: {
        fontWeight: '500',
        color: Colors.primary
    },
    styViewTitleGroupExtend: {
        marginHorizontal: 0,
        paddingBottom: 5,
        marginBottom: 10,
        marginTop: 0
    },
    textError: {
        color: Colors.orange,
        fontSize: Size.text
    },
    formError: {
        width: '100%',
        marginVertical: Size.defineHalfSpace,
        alignItems: 'center',
        justifyContent: 'center'
    },
    bntApprove: {
        flex: 1,
        height: 50,
        borderRadius: 7,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bntApprove_text: {
        fontWeight: '600',
        color: Colors.white
    },
    bntCancel: {
        width: '30%',
        height: 50,
        borderRadius: 7,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.gray_5,
        borderWidth: 1
    },
    styleViewBntApprove: {
        flexDirection: 'row',
        paddingHorizontal: Size.defineSpace,
        flex: 1,
        alignItems: 'flex-end',
        paddingVertical: 15
    },
    headerCloseModal: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        // marginBottom: 15,
        justifyContent: 'center',
        alignItems: 'center'
        // borderBottomColor: Colors.borderColor,
        // borderBottomWidth: 1,
    },
    styleViewContentModal: {
        paddingHorizontal: Size.defineSpace
    },
    bntChangeTimeLog: {
        marginBottom: 20,
        marginTop: Size.defineSpace,
        paddingVertical: 10,
        borderColor: Colors.primary,
        borderWidth: 1,
        borderRadius: 10
    },
    bntChangeTimeLog_top: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center'
        // alignItems: 'center',
    },
    bntChangeTimeLog_bottom: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center'
    },
    styLinkText: {
        color: Colors.primary,
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        textDecorationColor: Colors.primary
    },
    textTimeLogTime: {
        color: Colors.black,
        fontSize: Size.text + 6,
        fontWeight: '600',
        marginHorizontal: 5
    },
    textLineCenter: {
        color: Colors.black,
        fontSize: Size.text + 6,
        fontWeight: '600'
    },
    viewEditModal: {
        backgroundColor: Colors.white,
        height: Size.deviceheight * 0.7,
        width: Size.deviceWidth,
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
    },
    viewReason: {
        flexDirection: 'row',
        marginBottom: 20,
        // marginTop: 10,
        alignItems: 'center'
        // borderBottomColor: Colors.borderColor,
        // borderBottomWidth: 1,
        // paddingHorizontal: Size.defineSpace
    },
    viewCommentUpdateInOut: {
        flexDirection: 'row',
        paddingHorizontal: 5,
        alignItems: 'center',
        borderColor: Colors.gray_5,
        borderWidth: 0.5,
        borderRadius: 7
        // marginTop: Size.defineSpace
        // marginHorizontal: Size.defineSpace
    },
    bntShowNotes: {
        marginRight: 10,
        height: Size.heightInput,
        justifyContent: 'center'
    },
    styleInputNote: {
        height: Size.heightInput
    },
    groupTitle: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    groupTitleShiftName: {
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleModal: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    titleModal__text: {
        marginLeft: 13,
        fontWeight: '600',
        fontSize: Size.text + 2
    },
    titleTimeLog: {
        fontWeight: '500',
        fontSize: Size.text - 1
    },
    titleShiftName: {
        color: Colors.gray_7,
        fontSize: Size.text - 2
    },
    // stylesControl:{
    //   borderWidth: 0,
    // }

    /// style modal error
    headerCloseModalError: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
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

    styleViewLoading: {
        position: 'absolute',
        top: 0,
        height: '100%',
        width: '100%',
        zIndex: 2,
        justifyContent: 'center',
        alignItems: 'center'
    }
});
