import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import moment from 'moment';
import Modal from 'react-native-modal';
import { styleSheets, Size, Colors, styleSafeAreaView, CustomStyleSheet } from '../../../../constants/styleConfig';
import VnrText from '../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../components/VnrDate/VnrDate';
import { IconCheck, IconMap, IconEdit, IconColse } from '../../../../constants/Icons';
import HttpService from '../../../../utils/HttpService';
import Vnr_Function from '../../../../utils/Vnr_Function';
import { translate } from '../../../../i18n/translate';
import { VnrLoadingSevices } from '../../../../components/VnrLoading/VnrLoadingPages';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ToasterSevice } from '../../../../components/Toaster/Toaster';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import { SafeAreaView } from 'react-navigation';
import { AlertSevice } from '../../../../components/Alert/Alert';
import { EnumIcon } from '../../../../assets/constant';

export default class ShiftDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            Comment: '',
            isShowModalEdit: false,
            checkInOutUpdate: {
                noteInUpdate: '',
                noteOutUpdate: ''
            },
            showError: null,
            checkIn: {
                isCheck: true,
                TimeLog: null,
                address: ''
            },
            checkOut: {
                isCheck: true,
                TimeLog: null,
                address: ''
            },
            dataFromInOutGPS: null,
            dataFromInOutUpdate: null,
            isAllowCheckInGPSLeavedayBusinessTrip: false
        };
        this.toControl = null;
        this.disableSendForApprove = false;

        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;
    }

    getControl = () => this.toControl;

    setControl = (ctrl) => {
        this.toControl = ctrl;
    };

    formatDateServer = (date) => {
        const dataBody = {
            value: moment(date).format('DD/MM/YYYY')
        };
        return HttpService.Post('[URI_SYS]/Sys_GetData/GetFormatDate', dataBody);
    };

    saveInOut = (formData) => {
        const configs = {
            headers: {
                Accept: 'application/json',
                'Content-Type': 'multipart/form-data'
            }
        };
        return HttpService.Post('[URI_HR]/Att_GetData/New_SaveTamScanLog', formData, configs);
    };

    SendForApprove = () => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        const { checkInOutUpdate, checkIn } = this.state,
            { dataBodyCheckOut, reloadGPS } = this.props.navigation.state.params,
            _dataBodyCheckOut = { ...dataBodyCheckOut };

        _dataBodyCheckOut.Comment = checkInOutUpdate['noteOutUpdate'];
        _dataBodyCheckOut.IsManual = true;
        _dataBodyCheckOut.IsAllowApprove = false; // không auto duyệt
        _dataBodyCheckOut.IsScreenCheckInGPS = false; // không lấy giờ server
        _dataBodyCheckOut.TimeLog = moment(_dataBodyCheckOut.TimeLog).format('YYYY-MM-DD HH:mm:ss');
        _dataBodyCheckOut.TimeLogTime = moment(_dataBodyCheckOut.TimeLogTime).format('HH:mm');

        // Có chỉnh sửa dữ liệu in ( gửi yêu cầu duyệt )
        if (
            checkInOutUpdate != null &&
            (checkInOutUpdate['checkInTimeLog'] != undefined || checkInOutUpdate['checkInTimeLogTime'] != undefined) &&
            (moment(checkInOutUpdate['checkInTimeLog']).format('YYYY-MM-DD') !==
                moment(checkIn.TimeLog).format('YYYY-MM-DD') ||
                moment(checkInOutUpdate['checkInTimeLogTime']).format('HH:mm') !==
                    moment(checkIn.TimeLog).format('HH:mm'))
        ) {
            let formDataIn = new FormData(),
                formDataOut = new FormData(),
                checkInTimeLogTime = moment(checkIn.TimeLog).format('HH:mm'),
                checkInTimeLog = moment(checkIn.TimeLog).format('YYYY-MM-DD HH:mm:ss');

            // check in Update
            if (checkInOutUpdate['checkInTimeLog'] != undefined) {
                checkInTimeLog = moment(checkInOutUpdate['checkInTimeLog']).format('YYYY-MM-DD HH:mm:ss');
            }

            if (checkInOutUpdate['checkInTimeLogTime'] != undefined) {
                checkInTimeLogTime = moment(checkInOutUpdate['checkInTimeLogTime']).format('HH:mm');
            }

            const dataBodyCheckIn = {
                ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                UserSubmit: dataVnrStorage.currentUser.info.ProfileID,
                UserUpdate: dataVnrStorage.currentUser.info.ProfileID,
                IsPortal: true,
                Status: 'E_SUBMIT',
                Type: 'E_IN',
                IsCheckGPS: true,
                IsManual: true,
                TimeLogTime: checkInTimeLogTime,
                TimeLog: checkInTimeLog,
                Comment: checkInOutUpdate['noteInUpdate']
            };

            // check out
            if (checkInOutUpdate['checkOutTimeLog'] != undefined && checkInOutUpdate['checkOutTimeLog'] != null) {
                _dataBodyCheckOut.TimeLog = moment(checkInOutUpdate['checkOutTimeLog']).format('YYYY-MM-DD HH:mm:ss');
            }

            if (
                checkInOutUpdate['checkOutTimeLogTime'] != undefined &&
                checkInOutUpdate['checkOutTimeLogTime'] != null
            ) {
                _dataBodyCheckOut.TimeLogTime = moment(checkInOutUpdate['checkOutTimeLogTime']).format('HH:mm');
            }
            // formDataOut.append('LocationImage', imgMap);
            // formDataOut.append('ImageCheckIn', imgCamera);
            formDataOut.append('AttTamScanModel', JSON.stringify(_dataBodyCheckOut));
            formDataIn.append('AttTamScanModel', JSON.stringify(dataBodyCheckIn));
            this.disableSendForApprove = true;

            VnrLoadingSevices.show();
            HttpService.MultiRequest([this.saveInOut(formDataIn), this.saveInOut(formDataOut)])
                .then((resAll) => {
                    VnrLoadingSevices.hide();

                    this.disableSendForApprove = false;

                    if (!Vnr_Function.CheckIsNullOrEmpty(resAll[0]) && !Vnr_Function.CheckIsNullOrEmpty(resAll[1])) {
                        if (resAll[0] == 'Success' && resAll[1] == 'Success') {
                            this.goBack();
                            reloadGPS();
                            ToasterSevice.showSuccess('Hrm_Succeed');
                        } else if (typeof resAll[0] === 'string' && typeof resAll[1] === 'string') {
                            ToasterSevice.showWarning(`${translate('HRM_Common_CheckIn')}: 
                  ${resAll[0]}, ${translate('HRM_Common_CheckOut')}: ${resAll[1]}`);

                            //mở lại event
                            this.isProcessing = false;
                        }
                    }
                })
                .catch(() => {
                    VnrLoadingSevices.hide();
                });
        } else if (
        // Có chỉnh sửa dữ liệu out ( gửi yêu cầu duyệt )

            checkInOutUpdate != null &&
            (checkInOutUpdate['checkOutTimeLog'] != undefined ||
                checkInOutUpdate['checkOutTimeLogTime'] != undefined) &&
            (moment(checkInOutUpdate['checkOutTimeLog']).format('YYYY-MM-DD') !==
                moment(_dataBodyCheckOut.TimeLog).format('YYYY-MM-DD HH:mm:ss') ||
                moment(checkInOutUpdate['checkOutTimeLogTime']).format('HH:mm') !==
                    moment(_dataBodyCheckOut.TimeLog).format('HH:mm'))
        ) {
            if (checkInOutUpdate['checkOutTimeLog'] != undefined && checkInOutUpdate['checkOutTimeLog'] != null) {
                _dataBodyCheckOut.TimeLog = moment(checkInOutUpdate['checkOutTimeLog']).format('YYYY-MM-DD HH:mm:ss');
            }

            if (
                checkInOutUpdate['checkOutTimeLogTime'] != undefined &&
                checkInOutUpdate['checkOutTimeLogTime'] != null
            ) {
                _dataBodyCheckOut.TimeLogTime = moment(checkInOutUpdate['checkOutTimeLogTime']).format('HH:mm');
            }

            let formData = new FormData();
            formData.append('AttTamScanModel', JSON.stringify(_dataBodyCheckOut));
            VnrLoadingSevices.show();
            this.disableSendForApprove = true;
            this.saveInOut(formData)
                .then((res) => {
                    if (!Vnr_Function.CheckIsNullOrEmpty(res) && res == 'Success') {
                        this.goBack();
                        reloadGPS();
                        ToasterSevice.showSuccess('Hrm_Succeed');
                    } else {
                        ToasterSevice.showWarning(res.toString());
                        //mở lại event
                        this.isProcessing = false;
                    }
                    VnrLoadingSevices.hide();
                    this.disableSendForApprove = false;
                })
                .catch(() => {
                    VnrLoadingSevices.hide();
                });
        } else {
            // khong chinh sua du lieu out ( gửi yêu cầu duyệt )
            let formData = new FormData();
            formData.append('AttTamScanModel', JSON.stringify(_dataBodyCheckOut));
            VnrLoadingSevices.show();
            this.disableSendForApprove = true;
            this.saveInOut(formData)
                .then((res) => {
                    if (!Vnr_Function.CheckIsNullOrEmpty(res) && res == 'Success') {
                        this.goBack();
                        reloadGPS();
                        ToasterSevice.showSuccess('Hrm_Succeed');
                    } else {
                        ToasterSevice.showWarning(res.toString());

                        //mở lại event
                        this.isProcessing = false;
                    }
                    VnrLoadingSevices.hide();
                    this.disableSendForApprove = false;
                })
                .catch(() => {
                    VnrLoadingSevices.hide();
                });
        }
    };

    requestOutData = () => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        const { isAllowCheckInGPSLeavedayBusinessTrip } = this.state,
            { dataBodyCheckOut, imgCamera, imgMap, reloadGPS } = this.props.navigation.state.params,
            _dataBodyCheckOut = {
                ...dataBodyCheckOut,
                ...{
                    IsAllowCheckInGPSWhenLeavedayBusinessTrip: isAllowCheckInGPSLeavedayBusinessTrip
                }
            },
            configs = {
                headers: {
                    Accept: 'application/json',
                    'Content-Type': 'multipart/form-data'
                }
            };

        _dataBodyCheckOut.Comment = this.state.Comment;
        _dataBodyCheckOut.TimeLog = moment(_dataBodyCheckOut.TimeLog).format('YYYY-MM-DD HH:mm:ss');
        _dataBodyCheckOut.TimeLogTime = moment(_dataBodyCheckOut.TimeLogTime).format('HH:mm');

        let formData = new FormData();
        formData.append('LocationImage', imgMap);
        formData.append('ImageCheckIn', imgCamera);
        formData.append('AttTamScanModel', JSON.stringify(_dataBodyCheckOut));
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/New_SaveTamScanLog', formData, configs)
            .then((res) => {
                if (!Vnr_Function.CheckIsNullOrEmpty(res) && res == 'Success') {
                    ToasterSevice.showSuccess('Hrm_Succeed');
                    this.goBack();
                    reloadGPS();
                } else if (res && typeof res === 'string') {
                    if (res === 'WarningCheckInGPSInLeavedayBusinessTravel') {
                        //mở lại event
                        this.isProcessing = false;

                        AlertSevice.alert({
                            iconType: EnumIcon.E_WARNING,
                            title: 'E_WARNING',
                            message: 'WarningCheckInGPSInLeavedayBusinessTravel',
                            textRightButton: 'HRM_Common_Continue',
                            textLeftButton: 'HRM_Common_Close',
                            onConfirm: () => {
                                this.setState(
                                    {
                                        isAllowCheckInGPSLeavedayBusinessTrip: true
                                    },
                                    () => {
                                        this.requestOutData();
                                    }
                                );
                            }
                        });
                    } else if (res === 'Hrm_Locked') {
                        ToasterSevice.showWarning('Hrm_Locked');
                    } else {
                        ToasterSevice.showWarning(res);
                    }
                }
                VnrLoadingSevices.hide();
                //mở lại event
                this.isProcessing = false;
            })
            .catch(() => {
                VnrLoadingSevices.hide();
            });
    };

    openEdit = () => {
        if (this.isProcessing) {
            return;
        }

        // this.isProcessing = false;

        this.setState({ isShowModalEdit: true });
    };

    hideModalEdit = () => {
        this.setState({ isShowModalEdit: false });
        this.isProcessing = false;
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

    getTotalHourFromUpdate = () => {
        const { checkInOutUpdate, checkIn } = this.state;
        let { dataBodyCheckOut } = this.props.navigation.state.params,
            checkInTimeLogUpdate = moment(checkIn.TimeLog).format('YYYY-MM-DD'),
            checkInTimeLogTimeUpdate = moment(checkIn.TimeLog).format('HH:mm:ss'),
            checkOutTimeLogUpdate = moment(dataBodyCheckOut.TimeLog).format('YYYY-MM-DD'),
            checkOutTimeLogTimeUpdate = moment(dataBodyCheckOut.TimeLogTime).format('HH:mm:ss'),
            isUpdateTotalHours = false;

        if (checkInOutUpdate['checkInTimeLog'] != undefined && checkInOutUpdate['checkInTimeLog'] != null) {
            checkInTimeLogUpdate = moment(checkInOutUpdate['checkInTimeLog']).format('YYYY-MM-DD');
            isUpdateTotalHours = true;
        }

        if (checkInOutUpdate['checkOutTimeLog'] != undefined && checkInOutUpdate['checkOutTimeLog'] != null) {
            checkOutTimeLogUpdate = moment(checkInOutUpdate['checkOutTimeLog']).format('YYYY-MM-DD');
            isUpdateTotalHours = true;
        }

        if (checkInOutUpdate['checkInTimeLogTime'] != undefined && checkInOutUpdate['checkInTimeLogTime'] != null) {
            checkInTimeLogTimeUpdate = moment(checkInOutUpdate['checkInTimeLogTime']).format('HH:mm:ss');
            isUpdateTotalHours = true;
        }

        if (checkInOutUpdate['checkOutTimeLogTime'] != undefined && checkInOutUpdate['checkOutTimeLogTime'] != null) {
            checkOutTimeLogTimeUpdate = moment(checkInOutUpdate['checkOutTimeLogTime']).format('HH:mm:ss');
            isUpdateTotalHours = true;
        }

        if (isUpdateTotalHours) {
            VnrLoadingSevices.show();
            this.getListCheckInOutByGPS(
                `${checkInTimeLogUpdate} ${checkInTimeLogTimeUpdate}`,
                `${checkOutTimeLogUpdate} ${checkOutTimeLogTimeUpdate}`
            ).then((res) => {
                if (!Vnr_Function.CheckIsNullOrEmpty(res)) {
                    VnrLoadingSevices.hide();
                    this.setState({
                        dataFromInOutUpdate: res
                    });
                } else {
                    VnrLoadingSevices.hide();
                }
            });
        }
    };

    onFinish = (item, control) => {
        this.setControl(null);
        const obj = {
            ...this.state.checkInOutUpdate,
            ...{ [control.filedNameUpdate]: item }
        };
        this.setState({ checkInOutUpdate: obj }, this.getTotalHourFromUpdate);
    };

    onChangeTextInOutUpdate = (item, control) => {
        const obj = {
            ...this.state.checkInOutUpdate,
            ...{ [control.filedNameUpdate]: item }
        };
        this.setState({ checkInOutUpdate: obj });
    };

    getListCheckInOutByGPS = (dateTimeIn, dateTimeOut) => {
        const dataBody = {
            profileID: dataVnrStorage.currentUser.info.ProfileID,
            dateStart: moment(dateTimeIn).format('YYYY-MM-DD HH:mm:ss'),
            dateEnd: moment(dateTimeOut).format('YYYY-MM-DD HH:mm:ss')
        };
        return HttpService.Post('[URI_HR]/Att_GetData/GetListDataCheckInOutByGPS', dataBody);
    };

    generateInfo = () => {
        const { dataBodyCheckOut, dataCheckIn } = this.props.navigation.state.params,
            { checkOut, checkInOutUpdate } = this.state;

        checkOut.address = dataBodyCheckOut.LocationAddress;
        checkOut.TimeLog = dataBodyCheckOut.TimeLog;
        VnrLoadingSevices.show();
        if (
            !Vnr_Function.CheckIsNullOrEmpty(dataCheckIn.TimeLog) &&
            !Vnr_Function.CheckIsNullOrEmpty(checkOut.TimeLog)
        ) {
            this.getListCheckInOutByGPS(dataCheckIn.TimeLog, checkOut.TimeLog).then((res) => {
                checkInOutUpdate.noteOutUpdate = dataBodyCheckOut.Comment;
                if (!Vnr_Function.CheckIsNullOrEmpty(res)) {
                    VnrLoadingSevices.hide();
                    this.setState({
                        dataFromInOutUpdate: res,
                        dataFromInOutGPS: res,
                        Comment: dataBodyCheckOut.Comment,
                        checkIn: dataCheckIn,
                        checkOut,
                        checkInOutUpdate
                    });
                } else {
                    VnrLoadingSevices.hide();
                }
            });
        } else {
            this.setState({
                Comment: dataBodyCheckOut.Comment,
                checkIn: dataCheckIn,
                checkOut
            });
        }
    };

    goBack = () => {
        const { navigation } = this.props;
        navigation.goBack();
    };

    componentDidMount() {
        this.generateInfo();
    }

    render() {
        const { checkIn, checkOut, checkInOutUpdate, dataFromInOutGPS, dataFromInOutUpdate } = this.state;
        let valueHoursTotal = '',
            valueMinutesTotal = '',
            differentDateInOut = false,
            valueHoursTotalUpdate = '',
            valueMinutesTotalUpdate = '',
            showNoteIn = false,
            showNoteOut = false;

        if (dataFromInOutGPS && dataFromInOutGPS.WorkHours != null) {
            let duration = moment.duration(parseFloat(dataFromInOutGPS.WorkHours) * 60, 'minutes'),
                { hours, minutes } = duration._data;
            valueHoursTotal = hours;
            valueMinutesTotal = minutes;
            // valueHoursTotal = `${hours} ${translate('E_IMPORT_FILE_HOUR')} ${minutes} ${translate('E_IMPORT_FILE_MINUTE')}`;
        }

        if (dataFromInOutUpdate && dataFromInOutUpdate.WorkHours != null) {
            let duration = moment.duration(parseFloat(dataFromInOutUpdate.WorkHours) * 60, 'minutes'),
                { hours, minutes } = duration._data;
            valueHoursTotalUpdate = hours;
            valueMinutesTotalUpdate = minutes;
        }

        if (moment(checkIn.TimeLog).format('DD/MM/YYYY') !== moment(checkOut.TimeLog).format('DD/MM/YYYY')) {
            differentDateInOut = true;
        }

        if (
            (checkInOutUpdate != null && checkInOutUpdate['checkInTimeLog']) ||
            (checkInOutUpdate != null && checkInOutUpdate['checkInTimeLogTime'])
        ) {
            showNoteIn = true;
        }

        if (
            (checkInOutUpdate != null && checkInOutUpdate['checkOutTimeLog']) ||
            (checkInOutUpdate != null && checkInOutUpdate['checkOutTimeLogTime'])
        ) {
            showNoteOut = true;
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <KeyboardAwareScrollView
                    keyboardShouldPersistTaps={'handled'}
                    contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                    enableOnAndroid={false}
                >
                    <View style={CustomStyleSheet.flex(1)}>
                        <View style={styles.container}>
                            <View style={styles.styleShiftDate}>
                                <Text style={styleSheets.text}>
                                    {dataFromInOutGPS && dataFromInOutGPS.ShiftName
                                        ? dataFromInOutGPS.ShiftName
                                        : translate('OvertimeDayType__E_WEEKEND')}
                                </Text>
                                <Text style={styleSheets.text}>
                                    {dataFromInOutGPS && dataFromInOutGPS.StartEndShift
                                        ? dataFromInOutGPS.StartEndShift
                                        : ''}
                                </Text>
                            </View>

                            <View style={styles.ShiftInOutView}>
                                <View style={styles.ShiftInStyle}>
                                    <View style={styles.InOutStyle}>
                                        <VnrText
                                            style={[styleSheets.lable, { color: Colors.grey }]}
                                            i18nKey={'E_IN_AT'}
                                        />
                                    </View>
                                    <View style={styles.timeStyle}>
                                        <Text style={[styleSheets.lable, styles.styleTimeInOut]}>
                                            {checkIn.TimeLog && moment(checkIn.TimeLog).format('HH:mm')}
                                        </Text>
                                        {differentDateInOut && (
                                            <Text style={[styleSheets.text]}>
                                                {checkIn.TimeLog && moment(checkIn.TimeLog).format('DD/MM/YYYY')}
                                            </Text>
                                        )}
                                    </View>
                                    <View style={styles.addressStyle}>
                                        <IconMap color={Colors.black} size={Size.text} />
                                        <Text style={styleSheets.text} numberOfLines={1}>
                                            {checkIn.LocationAddress}
                                        </Text>
                                    </View>
                                </View>

                                <View style={styles.ShiftOutStyle}>
                                    <View style={styles.InOutStyle}>
                                        <VnrText
                                            style={[styleSheets.lable, { color: Colors.grey }]}
                                            i18nKey={'E_OUT_AT'}
                                        />
                                    </View>
                                    <View style={styles.timeStyle}>
                                        <Text style={[styleSheets.lable, styles.styleTimeInOut]}>
                                            {checkOut.TimeLog && moment(checkOut.TimeLog).format('HH:mm')}
                                        </Text>
                                        {differentDateInOut && (
                                            <Text style={[styleSheets.text]}>
                                                {checkOut.TimeLog && moment(checkOut.TimeLog).format('DD/MM/YYYY')}
                                            </Text>
                                        )}
                                    </View>
                                    <View style={styles.addressStyle}>
                                        <IconMap color={Colors.black} size={Size.text} />
                                        <Text style={styleSheets.text} numberOfLines={1}>
                                            {checkOut.address}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            <View style={styles.ShiftTotalView}>
                                <VnrText
                                    style={[styleSheets.lable, { color: Colors.grey }]}
                                    i18nKey={'HRM_TotalHour'}
                                />
                                <View style={styles.viewValueTotalHour}>
                                    <Text style={[styleSheets.lable, styles.styTextvalueHoursTotal]}>
                                        {valueHoursTotal}
                                    </Text>
                                    <VnrText style={styleSheets.text} i18nKey={'E_IMPORT_FILE_HOUR'} />
                                    <Text
                                        style={[
                                            styleSheets.lable,
                                            styles.styViewMinutestotal
                                        ]}
                                    >
                                        {valueMinutesTotal}
                                    </Text>
                                    <VnrText style={styleSheets.text} i18nKey={'E_IMPORT_FILE_MINUTE'} />
                                </View>
                            </View>

                            <View style={styles.viewComment}>
                                <View style={styles.bntShowNotes}>
                                    <IconEdit color={Colors.primary} size={Size.iconSize} />
                                </View>

                                <VnrTextInput
                                    style={styles.styleInputNote}
                                    placeholder={translate('Hrm_Cat_TrainingPlace_Description')}
                                    onChangeText={(text) => {
                                        checkInOutUpdate['noteOutUpdate'] = text;
                                        this.setState({ Comment: text, checkInOutUpdate });
                                    }}
                                    value={this.state.Comment}
                                    returnKeyType="done"
                                />
                            </View>
                        </View>

                        <View style={styles.containerBottom}>
                            <View style={styles.viewButtom}>
                                <View style={styles.viewBntButtom}>
                                    <TouchableOpacity style={styles.bntEdit} onPress={() => this.openEdit()}>
                                        <IconEdit color={Colors.primary} size={Size.iconSize + 2} />
                                    </TouchableOpacity>
                                    <VnrText
                                        style={[styleSheets.lable, { color: Colors.primary }]}
                                        i18nKey={'Modified'}
                                    />
                                </View>

                                <View style={styles.viewBntButtom}>
                                    <TouchableOpacity style={styles.bntConfirm} onPress={() => this.requestOutData()}>
                                        <IconCheck color={Colors.white} size={Size.iconSize + 2} />
                                    </TouchableOpacity>
                                    <VnrText
                                        style={[
                                            styleSheets.lable,
                                            {
                                                color: Colors.primary
                                            }
                                        ]}
                                        i18nKey={'Confirm'}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>

                <Modal
                    onBackButtonPress={() => this.hideModalEdit()}
                    key={'@MODAL_EDIT'}
                    isVisible={this.state.isShowModalEdit}
                    onBackdropPress={() => this.hideModalEdit()}
                    customBackdrop={
                        <TouchableWithoutFeedback onPress={() => this.hideModalEdit()}>
                            <View style={styles.styModalBackdrop} />
                        </TouchableWithoutFeedback>
                    }
                    style={CustomStyleSheet.margin(0)}
                >
                    <View style={styles.viewEditModal}>
                        <SafeAreaView {...styleSafeAreaView} style={styles.stySafeAraeView}>
                            <KeyboardAwareScrollView
                                keyboardShouldPersistTaps={'handled'}
                                contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                                enableOnAndroid={false}
                            >
                                <View style={styles.headerCloseModal}>
                                    <TouchableOpacity onPress={() => this.hideModalEdit()}>
                                        <IconColse color={Colors.grey} size={Size.iconSize} />
                                    </TouchableOpacity>
                                    <VnrText style={styleSheets.lable} i18nKey={'HRM_Att_TamScanLogRegister_List'} />
                                    <IconColse color={Colors.white} size={Size.iconSize} />
                                </View>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <View style={styles.styleViewContentModal}>
                                        <Text style={styleSheets.lable}>
                                            {dataFromInOutUpdate && dataFromInOutUpdate.ShiftName
                                                ? dataFromInOutUpdate.ShiftName
                                                : translate('OvertimeDayType__E_WEEKEND')}
                                        </Text>
                                        <Text style={styleSheets.text}>
                                            {dataFromInOutUpdate && dataFromInOutUpdate.StartEndShift
                                                ? dataFromInOutUpdate.StartEndShift
                                                : ''}
                                        </Text>
                                    </View>

                                    <View style={styles.styleViewContentModal}>
                                        <View>
                                            <VnrText style={styleSheets.lable} i18nKey={'HRM_Common_CheckIn'} />
                                        </View>
                                        <View style={styles.styleTxtRowDate}>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.initViewControl('E_DATE', 'checkInTimeLog', checkIn.TimeLog)
                                                }
                                            >
                                                <Text style={[styleSheets.text]}>
                                                    {checkInOutUpdate != null && checkInOutUpdate['checkInTimeLog']
                                                        ? moment(checkInOutUpdate['checkInTimeLog']).format(
                                                            'DD/MM/YYYY'
                                                        )
                                                        : moment(checkIn.TimeLog).format('DD/MM/YYYY')}
                                                </Text>
                                            </TouchableOpacity>
                                            <View style={styles.borderCenter} />
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.initViewControl(
                                                        'E_TIME',
                                                        'checkInTimeLogTime',
                                                        checkOut.TimeLog
                                                    )
                                                }
                                            >
                                                <Text style={[styleSheets.text, { color: Colors.primary }]}>
                                                    {checkInOutUpdate != null && checkInOutUpdate['checkInTimeLogTime']
                                                        ? moment(checkInOutUpdate['checkInTimeLogTime']).format('HH:mm')
                                                        : moment(checkIn.TimeLog).format('HH:mm')}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    {showNoteIn && (
                                        <View style={styles.viewCommentUpdateInOut}>
                                            <View style={styles.bntShowNotes}>
                                                <IconEdit color={Colors.primary} size={Size.iconSize} />
                                            </View>

                                            <VnrTextInput
                                                style={styles.styleInputNote}
                                                placeholder={`${translate(
                                                    'Hrm_Cat_TrainingPlace_Description'
                                                )} ${translate('HRM_Common_CheckIn')}`}
                                                onChangeText={(text) =>
                                                    this.onChangeTextInOutUpdate(text, {
                                                        filedNameUpdate: 'noteInUpdate'
                                                    })
                                                }
                                                value={this.state.checkInOutUpdate['noteInUpdate']}
                                                returnKeyType="done"
                                            />
                                        </View>
                                    )}

                                    <View style={styles.styleViewContentModal}>
                                        <View>
                                            <VnrText style={styleSheets.lable} i18nKey={'HRM_Common_CheckOut'} />
                                        </View>
                                        <View style={styles.styleTxtRowDate}>
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.initViewControl('E_DATE', 'checkOutTimeLog', checkOut.TimeLog)
                                                }
                                            >
                                                <Text style={[styleSheets.text]}>
                                                    {checkInOutUpdate != null && checkInOutUpdate['checkOutTimeLog']
                                                        ? moment(checkInOutUpdate['checkOutTimeLog']).format(
                                                            'DD/MM/YYYY'
                                                        )
                                                        : moment(checkOut.TimeLog).format('DD/MM/YYYY')}
                                                </Text>
                                            </TouchableOpacity>
                                            <View style={styles.borderCenter} />
                                            <TouchableOpacity
                                                onPress={() =>
                                                    this.initViewControl(
                                                        'E_TIME',
                                                        'checkOutTimeLogTime',
                                                        checkOut.TimeLog
                                                    )
                                                }
                                            >
                                                <Text style={[styleSheets.text, { color: Colors.primary }]}>
                                                    {checkInOutUpdate != null && checkInOutUpdate['checkOutTimeLogTime']
                                                        ? moment(checkInOutUpdate['checkOutTimeLogTime']).format(
                                                            'HH:mm'
                                                        )
                                                        : moment(checkOut.TimeLog).format('HH:mm')}
                                                </Text>
                                            </TouchableOpacity>
                                        </View>
                                    </View>
                                    {showNoteOut && (
                                        <View style={styles.viewCommentUpdateInOut}>
                                            <View style={styles.bntShowNotes}>
                                                <IconEdit color={Colors.primary} size={Size.iconSize} />
                                            </View>

                                            <VnrTextInput
                                                style={styles.styleInputNote}
                                                placeholder={`${translate(
                                                    'Hrm_Cat_TrainingPlace_Description'
                                                )} ${translate('HRM_Common_CheckOut')}`}
                                                onChangeText={(text) =>
                                                    this.onChangeTextInOutUpdate(text, {
                                                        filedNameUpdate: 'noteOutUpdate'
                                                    })
                                                }
                                                value={this.state.checkInOutUpdate['noteOutUpdate']}
                                                returnKeyType="done"
                                            />
                                        </View>
                                    )}

                                    <View style={styles.styleViewHoursContentModal}>
                                        <VnrText
                                            style={[styleSheets.lable, { color: Colors.grey }]}
                                            i18nKey={'HRM_TotalHour'}
                                        />
                                        <View style={styles.viewValueTotalHour}>
                                            <Text style={[styleSheets.lable, styles.styTextvalueHoursTotal]}>
                                                {valueHoursTotalUpdate}
                                            </Text>
                                            <VnrText style={styleSheets.text} i18nKey={'E_IMPORT_FILE_HOUR'} />
                                            <Text style={[styleSheets.lable, styles.styMinutesTotalTextUpdate]}>
                                                {valueMinutesTotalUpdate}
                                            </Text>
                                            <VnrText style={styleSheets.text} i18nKey={'E_IMPORT_FILE_MINUTE'} />
                                        </View>
                                    </View>
                                    {this.state.showError != null && (
                                        <View style={styles.styleViewContentModal}>
                                            <Text style={[styleSheets.lable, { color: Colors.danger }]}>
                                                {this.state.showError}
                                            </Text>
                                        </View>
                                    )}
                                </View>

                                <View style={styles.styleViewBntApprove}>
                                    <TouchableOpacity style={styles.bntCancel} onPress={() => this.hideModalEdit()}>
                                        <VnrText
                                            style={[styleSheets.lable, { color: Colors.black }]}
                                            i18nKey={'HRM_Common_Close'}
                                        />
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.bntApprove}
                                        onPress={
                                            () =>
                                                !this.disableSendForApprove &&
                                                this.setState({ isShowModalEdit: false }, () => {
                                                    this.SendForApprove();
                                                })
                                            //  this.SendForApprove()
                                        }
                                    >
                                        <VnrText
                                            style={[styleSheets.lable, { color: Colors.white }]}
                                            i18nKey={'Hrm_Common_SubmitApproved'}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </KeyboardAwareScrollView>
                        </SafeAreaView>
                    </View>
                    {this.toControl != null && (
                        <VnrDate
                            autoShowModal={true}
                            key={this.getControl().filedNameUpdate}
                            {...this.getControl()}
                            value={this.getControl()['value']}
                            onFinish={(item) => this.onFinish(item, this.getControl())}
                        />
                    )}
                </Modal>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styViewMinutestotal: {
        fontSize: Size.text + 3,
        paddingLeft: 5,
        paddingBottom: 0
    },
    styModalBackdrop: { flex: 1, backgroundColor: Colors.black, opacity: 0.5 },
    stySafeAraeView: { flex: 1, borderTopLeftRadius: 15, borderTopRightRadius: 15 },
    styMinutesTotalTextUpdate: { fontSize: Size.text + 3, paddingLeft: 5, paddingBottom: 0 },
    styTextvalueHoursTotal: { fontSize: Size.text + 3, paddingBottom: 0 },
    container: {
        flex: 1,
        backgroundColor: Colors.greyBorder,
        padding: 15
    },
    containerBottom: {
        flex: 1,
        backgroundColor: Colors.greyBorder,
        alignItems: 'flex-end',
        justifyContent: 'flex-end'
    },
    bntApprove: {
        flex: 1,
        height: 40,
        borderRadius: 15,
        backgroundColor: Colors.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    bntCancel: {
        width: '30%',
        height: 40,
        borderRadius: 15,
        marginRight: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderColor: Colors.black,
        borderWidth: 0.5
    },
    styleViewBntApprove: {
        flexDirection: 'row',
        paddingHorizontal: 10,
        // height:50,
        flex: 1,
        alignItems: 'flex-end',
        paddingVertical: 15
    },
    styleTxtRowDate: {
        flexDirection: 'row',
        minHeight: 30,
        alignItems: 'center'
    },
    borderCenter: {
        backgroundColor: Colors.borderColor,
        width: 1,
        height: 30,
        marginHorizontal: 15
    },
    styleViewHoursContentModal: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: Colors.borderColor
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
    styleViewContentModal: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 1
    },
    viewEditModal: {
        backgroundColor: Colors.white,
        height: Size.deviceheight * 0.7,
        width: Size.deviceWidth,
        position: 'absolute',
        bottom: 0,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15
        // paddingBottom:70,
        // flex:1
    },
    viewButtom: {
        // flex:1,
        flexDirection: 'row',
        backgroundColor: Colors.white,
        paddingVertical: 10
        // paddingVertical: 15,
        // alignItems:'flex-end'
        // height: 'auto',
        // width: Size.deviceWidth,
        // position: 'absolute',
        // bottom: 0
    },
    viewCommentUpdateInOut: {
        flexDirection: 'row',
        // marginBottom: 15,
        marginTop: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        borderBottomColor: Colors.borderColor,
        borderBottomWidth: 1
    },
    viewBntButtom: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    viewComment: {
        flexDirection: 'row',
        marginBottom: 15,
        alignItems: 'center',
        borderBottomColor: Colors.grey,
        borderBottomWidth: 0.5
    },
    bntEdit: {
        borderWidth: 1,
        borderColor: Colors.grey,
        width: 67,
        height: 67,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    bntConfirm: {
        backgroundColor: Colors.primary,
        width: 67,
        height: 67,
        borderRadius: 35,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    bntShowNotes: {
        marginRight: 10,
        height: Size.heightInput,
        justifyContent: 'center'
    },
    styleInputNote: {
        height: Size.heightInput
    },
    ShiftTotalView: {
        backgroundColor: Colors.white,
        paddingVertical: 17,
        paddingHorizontal: 20,
        borderRadius: styleSheets.radius_5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    styleShiftDate: {
        backgroundColor: Colors.white,
        paddingVertical: 17,
        paddingHorizontal: 10,
        borderRadius: styleSheets.radius_5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    ShiftInOutView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 15
    },
    ShiftInStyle: {
        flex: 1,
        backgroundColor: Colors.white,
        paddingVertical: 15,
        paddingHorizontal: 10,
        borderRadius: styleSheets.radius_5,
        marginRight: 7.5
    },
    ShiftOutStyle: {
        flex: 1,
        backgroundColor: Colors.white,
        paddingVertical: 15,
        paddingHorizontal: 15,
        borderRadius: styleSheets.radius_5,
        marginLeft: 7.5
    },
    InOutStyle: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor,
        paddingBottom: 10
    },
    timeStyle: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor
    },
    addressStyle: {
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        flexDirection: 'row'
    },
    styleTimeInOut: {
        fontSize: Size.text + 5,
        marginBottom: 2
    },
    viewValueTotalHour: {
        flexDirection: 'row',
        alignItems: 'flex-end'
        // justifyContent: 'center',
    }
});
