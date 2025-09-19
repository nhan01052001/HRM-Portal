/* eslint-disable react-native/split-platform-components */
import { Platform, PermissionsAndroid } from 'react-native';
import moment from 'moment';
import { Colors } from '../constants/styleConfig';
import { translate } from '../i18n/translate';
import { startTask } from '../factories/BackGroundTask';
import { EnumName, EnumTask } from '../assets/constant';
import { setdataVnrStorageFromValue } from '../assets/auth/authentication';
import HttpService from './HttpService';
import { PermissionForAppMobile } from '../assets/configProject/PermissionForAppMobile';

const arrayStrReplace = [
    'f384r50',
    '99ca42',
    '48h0y4',
    'o00h00',
    'fhds7ds4'
];

export default class Vnr_Services {
    static statusColorForRecruitment = {
        CodeColor1: [
            'E_PASS',
            'E_HIRED',
            'E_TOCANDIDATE',
            'E_TOINTERVIEWER',
            'E_APPROVED1',
            'E_FIRST_APPROVED',
            'E_APPROVED2',
            'E_APPROVED3',
            'E_APPROVED',
            'E_VALID',
            'E_CONFIRMED',
            'E_PASS',
            'E_SENT',
            'E_TOCANDIDATE',
            'E_TOINTERVIEWER'
        ], //Màu xanh lá
        CodeColor2: [], //Màu xanh da trời
        CodeColor3: [
            'E_NOTPASSFILTER',
            'E_FAIL',
            'E_DECLINEINTERVIEW',
            'E_DECLINEJOBOFFERS',
            'E_REJECTED_PROPOSAL',
            'E_REJECTED',
            'E_REJECT',
            'E_CANCEL',
            'E_NOTYETSUBMITTED',
            'E_INVALID',
            'E_OVERDUE',
            'E_DECLINEINTERVIEW',
            'E_FAIL',
            'E_REJECTED_HIRING',
            'E_WITHDRAW_APPLICATION'
        ], //Màu đỏ
        CodeColor4: ['E_APPLY'], //Màu xanh dạ
        CodeColor5: ['E_NOTAPPLY', 'E_SUBMIT_TEMP', 'E_NOTTRANSFERRED', 'E_TEMPSAVE', 'E_10DAYS', 'E_WAITINGPROPOSE'], //Màu xám đen(Lưu tạm)
        CodeColor6: [
            'E_WAITAPPROVECV',
            'E_WAITINTERVIEWSCHEDULE',
            'E_WAITCONFIRMSCHEDULE',
            'E_WAITINTERVIEW',
            'E_WAITHIRE',
            'E_WAIT_APPROVED_PROPOSAL',
            'E_NOTNOTIFIED',
            'E_UNSENT',
            'E_WAITING_APPROVED',
            'E_WAIT_APPROVED',
            'E_WAITAPPROVE',
            'E_SUBMIT',
            'E_WAITINGCONFIRM',
            'E_WAITINTERVIEWSCHEDULE',
            'E_WAITCONFIRMSCHEDULE',
            'E_WAITINTERVIEW',
            'E_UNSENT',
            'E_NOTSENT',
            'E_NOTNOTIFIED',
            'E_WAITING_CANCEL',
            'E_REQUEST_CANCEL',
            'E_3DAYS',
            'E_TODAY'
        ], //Màu cam(Chờ duyệt)
        CodeColor7: ['E_JOBOFFER', 'E_WAITPROPOSE', 'E_HIRE', 'E_CONFIRM', 'E_TRANSFERRED', 'E_POSTING'],
        CodeColor8: ['E_WAITCONFIRM'],
        CodeColor9: ['E_FEEDBACK_PROPOSAL', 'E_FEEDBACK', 'E_REQUEST_CHANGE'],
        CodeColor10: ['E_EXPIRE_POSTING', 'E_STOP_POSTING']
    };

    static colorForRecruitment = {
        //Mã màu 1
        CodeColor1: {
            bgStatus: '#52c41a14',
            colorStatus: '#52c41a',
            borderStatus: ''
        },
        //Mã màu 2
        CodeColor2: {
            bgStatus: '#0971dc14',
            colorStatus: '#0971dc',
            borderStatus: ''
        },
        //Mã màu 3
        CodeColor3: {
            bgStatus: '#f5222d14',
            colorStatus: '#f5222d',
            borderStatus: ''
        },
        //Mã màu 4
        CodeColor4: {
            bgStatus: '#04bf8a14',
            colorStatus: '#41b883',
            borderStatus: ''
        },
        //Mã màu 5
        CodeColor5: {
            bgStatus: '#00000014',
            colorStatus: '#121212',
            borderStatus: ''
        },
        //Mã màu 6
        CodeColor6: {
            bgStatus: '#fa8c1614',
            colorStatus: '#fa8c16',
            borderStatus: ''
        },
        //Mã màu 7
        CodeColor7: {
            bgStatus: '#e6f7ff',
            colorStatus: '#096dd9',
            borderStatus: ''
        },
        //Mã màu 8
        CodeColor8: {
            bgStatus: '#fadb147a',
            colorStatus: '#000000',
            borderStatus: ''
        },
        //Mã màu 9
        CodeColor9: {
            bgStatus: '#faf3ff',
            colorStatus: '#681be5',
            borderStatus: ''
        }
    };

    static handleStatus = (status, SendEmailStatus, TypeApprove, isHaveRequestCancel) => {
        let lstStatus = [];

        // if (SendEmailStatus === null || SendEmailStatus === undefined) {
        //     lstStatus.push('E_MODIFY');
        // }

        if (
            status === 'E_SUBMIT_TEMP' ||
            status === 'E_TEMPSAVE'
            // status === 'E_SUBMIT' ||
            // || status === 'E_REJECTED' || status === "E_APPROVED3"
            // || status === "E_FIRST_APPROVED" || status === "E_APPROVED2" || status === "E_APPROVED1"
        ) {
            lstStatus.push('E_DELETE');
            lstStatus.push('E_MODIFY');
        }

        if (
            status === 'E_SUBMIT' ||
            status == 'E_APPROVED3' ||
            status == 'E_FIRST_APPROVED' ||
            status == 'E_APPROVED2' ||
            status == 'E_APPROVED1' ||
            status == 'E_APPROVED'
        ) {
            lstStatus.push('E_CANCEL');
            if (isHaveRequestCancel) lstStatus.push('E_REQUEST_CANCEL');
        }

        if (status === 'E_SUBMIT_TEMP' || status === 'E_TEMPSAVE') {
            lstStatus.push('E_SENDMAIL');
        }

        if (TypeApprove === 'E_REQUEST_CANCEL') {
            lstStatus.push('E_REQUEST_CANCEL');
        }

        lstStatus = lstStatus.filter(function (item, pos) {
            return lstStatus.indexOf(item) == pos;
        });

        return lstStatus.join();
    };
    static handleStatusApprove = (status, TypeApprove) => {
        let lstStatus = [];
        // if ((status === 'E_SUBMIT' ||
        //     status == "E_APPROVED3" || status == "E_FIRST_APPROVED" ||
        //     status == "E_APPROVED2" || status == "E_APPROVED1") && (TypeApprove && TypeApprove === "E_APPROVED")) {
        //     lstStatus.push('E_APPROVE');
        // }

        if (
            ((status === 'E_SUBMIT' ||
                status == 'E_APPROVED3' ||
                status == 'E_FIRST_APPROVED' ||
                status == 'E_APPROVED2' ||
                status == 'E_APPROVED1' ||
                status === 'E_REQUEST_CANCEL') &&
                TypeApprove &&
                TypeApprove === 'E_APPROVED') ||
            status === 'E_WAITAPPROVE' ||
            status === 'E_WAIT_APPROVED' ||
            status === 'E_WAITING_CONFIRM'
        ) {
            lstStatus.push('E_APPROVE');
            lstStatus.push('E_REJECT');
        }

        if (status === 'E_APPROVED') {
            lstStatus.push('E_CANCEL');
        }

        return lstStatus.join();
    };
    static formatStyleStatusApp = (Status) => {
        let styleStatusApp = {};

        if (
            Status == 'E_SUBMIT' ||
            Status == 'E_APPROVED3' ||
            Status == 'E_FIRST_APPROVED' ||
            Status == 'E_APPROVED2' ||
            Status == 'E_APPROVED1' ||
            Status == 'E_WAITING' ||
            Status === 'E_Appraisal' ||
            Status === 'E_WAITAPPROVE' ||
            Status === 'E_WAITINGCONFIRM' ||
            Status === 'E_WAIT_APPROVED' ||
            Status === 'E_WAITING_CONFIRM' ||
            this.statusColorForRecruitment.CodeColor6.includes(Status)
        ) {
            // Chờ duyệt
            styleStatusApp.colorStatus = '#FA8C16';
            styleStatusApp.borderStatus = Colors.white;
            styleStatusApp.bgStatus = '250, 140, 22, 0.08';
        } else if (
            Status == 'E_REJECTED' ||
            Status == 'E_REJECT' ||
            this.statusColorForRecruitment.CodeColor3.includes(Status)
        ) {
            //Từ chối
            styleStatusApp.colorStatus = '#FA541C';
            styleStatusApp.borderStatus = Colors.white;
            styleStatusApp.bgStatus = '250, 84, 28, 0.08';
        } else if (
            Status == 'E_CANCEL' ||
            Status === 'E_Overdue' ||
            Status === 'E_CANCELED' ||
            this.statusColorForRecruitment.CodeColor10.includes(Status)
        ) {
            // Hủy
            styleStatusApp.colorStatus = '#F5222D';
            styleStatusApp.borderStatus = Colors.white;
            styleStatusApp.bgStatus = '245, 34, 45, 0.08';
        } else if (
            Status === 'E_SUBMIT_TEMP' ||
            Status == null ||
            Status === 'E_TEMPSAVE' ||
            this.statusColorForRecruitment.CodeColor5.includes(Status)
        ) {
            // Lưu tạm
            styleStatusApp.colorStatus = '#262626';
            styleStatusApp.borderStatus = Colors.white;
            styleStatusApp.bgStatus = '0, 0, 0, 0.08';
        } else if (
            Status == 'E_APPROVED' ||
            Status === 'E_DONE' ||
            Status === 'E_Evaluated' ||
            Status === 'E_CONFIRMED' ||
            this.statusColorForRecruitment.CodeColor1.includes(Status)
        ) {
            // Đã duyệt
            styleStatusApp.colorStatus = '#52C41A';
            styleStatusApp.borderStatus = Colors.white;
            styleStatusApp.bgStatus = '82, 196, 26, 0.08';
        } else if (Status == 'E_PendingCancellation' || Status === 'E_REQUEST_CANCEL') {
            // Chờ hủy
            styleStatusApp.colorStatus = '#FADB14';
            styleStatusApp.borderStatus = Colors.white;
            styleStatusApp.bgStatus = '255, 253, 232';
        } else if (Status == 'E_REQUEST_CHANGE' || this.statusColorForRecruitment.CodeColor9.includes(Status)) {
            // Chờ hủy
            styleStatusApp.colorStatus = '#722ED1';
            styleStatusApp.borderStatus = Colors.white;
            styleStatusApp.bgStatus = '114, 46, 209, 0.08';
        } else if (Status === 'E_CONFIRM' || this.statusColorForRecruitment.CodeColor7.includes(Status)) {
            // Đã xác nhận
            styleStatusApp.colorStatus = '#0971DC';
            styleStatusApp.borderStatus = Colors.white;
            styleStatusApp.bgStatus = '9, 113, 220, 0.08';
        }

        return styleStatusApp;
    };

    static applyGroupField = (data, groupField) => {
        if (groupField && Array.isArray(groupField) && groupField.length > 0 && data.length > 0) {
            const dataNotInGroup = [],
                objGroup = {};

            data.map((item) => {
                let newKeyGroup = '',
                    listTextField = [];

                groupField.forEach((el) => {
                    let { TextField, ValueField, DataType, DisplayKey, DataFormat } = el;
                    let getValue = ValueField && item[ValueField] != null ? item[ValueField] : '';

                    newKeyGroup += `${getValue}`;

                    if (DisplayKey && item[TextField] != null) {
                        let textField = item[TextField];
                        if (DataType != 'string' && DataType == 'DateTime' && textField && DataFormat) {
                            textField = moment(textField).format(DataFormat);
                        }
                        listTextField.push(`${translate(DisplayKey)}: ${textField}`);
                    } else {
                        let textField = item[TextField];
                        listTextField = [textField];
                    }
                });

                if (newKeyGroup && objGroup[newKeyGroup]) {
                    objGroup[newKeyGroup]['dataGroupMaster'].push(item);
                } else if (newKeyGroup !== null && newKeyGroup !== '') {
                    objGroup[newKeyGroup] = {
                        // ...item,
                        TotalRow: item?.TotalRow ? item?.TotalRow : null,
                        isGroup: true,
                        keyGroup: newKeyGroup,
                        listTextField: listTextField,
                        dataGroupMaster: [item],
                        isCheckAll: false
                    };
                } else {
                    dataNotInGroup.push(item);
                }
            });

            data = [...Object.values(objGroup), ...dataNotInGroup];

            return data;
        }

        return data;
    };

    static deleteTokenEncodedParamFromLink = (obj = {}) => {
        if (obj?.tokenEncodedParam) {
            delete obj.tokenEncodedParam;
        }
    };

    static checkIsTrue = (listTimeLogConfig, timeLogFiles, fileName) => {
        return (
            (timeLogFiles[fileName] &&
                listTimeLogConfig[fileName] &&
                moment(listTimeLogConfig[fileName]).isBefore(timeLogFiles[fileName])) ||
            (timeLogFiles[fileName] && listTimeLogConfig[fileName] == undefined)
        );
    };

    static startTaskGetDataConfig = (_dataCurrentUser, isHaveData = true) => {
        const { currentUser } = _dataCurrentUser,
            { listTimeLogConfig } = currentUser;
        if (currentUser && currentUser.headers) {
            HttpService.Get('[URI_SYS]/sys_getdata/GetLastChangeTime_PortalApp')
                .then((timeLogFiles) => {
                    let isGetLang = false,
                        isGetConfigApp = false,
                        isGetConfigAppByUser = false;
                    if (listTimeLogConfig == null || listTimeLogConfig == undefined || !isHaveData) {
                        currentUser.listTimeLogConfig = timeLogFiles;
                        setdataVnrStorageFromValue('currentUser', currentUser);

                        startTask({
                            keyTask: EnumTask.KT_Permission_RequestDataConfig,
                            payload: {
                                keyQuery: EnumName.E_PRIMARY_DATA,
                                isGetLang: true,
                                isGetConfigApp: true,
                                isGetConfigAppByUser: true
                            }
                        });
                    } else if (listTimeLogConfig && timeLogFiles) {
                        // check update Lang
                        if (
                            this.checkIsTrue(listTimeLogConfig, timeLogFiles, 'Lang_EN_SPEC') &&
                            _dataCurrentUser.languageApp === 'EN'
                        ) {
                            isGetLang = true;
                        } else if (
                            this.checkIsTrue(listTimeLogConfig, timeLogFiles, 'Lang_VN_SPEC') &&
                            _dataCurrentUser.languageApp === 'VN'
                        ) {
                            isGetLang = true;
                        } else if (
                            this.checkIsTrue(listTimeLogConfig, timeLogFiles, 'Lang_CN_SPEC') &&
                            _dataCurrentUser.languageApp === 'CN'
                        ) {
                            isGetLang = true;
                        }

                        // check update isGetConfigAppByUser
                        if (this.checkIsTrue(listTimeLogConfig, timeLogFiles, 'ConfigDashboard_SPEC')) {
                            isGetConfigAppByUser = true;
                        } else if (this.checkIsTrue(listTimeLogConfig, timeLogFiles, 'ConfigDrawer_SPEC')) {
                            isGetConfigAppByUser = true;
                        }

                        // check update isGetConfigApp
                        if (
                            this.checkIsTrue(listTimeLogConfig, timeLogFiles, 'ConfigListDetail_SPEC') ||
                            this.checkIsTrue(listTimeLogConfig, timeLogFiles, 'ConfigList_SPEC') ||
                            this.checkIsTrue(listTimeLogConfig, timeLogFiles, 'ConfigField_SPEC') ||
                            this.checkIsTrue(listTimeLogConfig, timeLogFiles, 'ConfigListFilter_SPEC')
                        ) {
                            isGetConfigApp = true;
                        }

                        currentUser.listTimeLogConfig = timeLogFiles;
                        setdataVnrStorageFromValue('currentUser', currentUser);

                        if (isGetConfigApp || isGetConfigAppByUser || isGetLang) {
                            startTask({
                                keyTask: EnumTask.KT_Permission_RequestDataConfig,
                                payload: {
                                    keyQuery: EnumName.E_PRIMARY_DATA,
                                    isGetLang: isGetLang,
                                    isGetConfigApp: isGetConfigApp,
                                    isGetConfigAppByUser: isGetConfigAppByUser
                                }
                            });
                        }
                    }
                })
                .catch(() => {
                    startTask({
                        keyTask: EnumTask.KT_Permission_RequestDataConfig,
                        payload: {
                            keyQuery: EnumName.E_PRIMARY_DATA,
                            isGetLang: true,
                            isGetConfigApp: true,
                            isGetConfigAppByUser: true
                        }
                    });
                });
        }
    };

    static checkVersionDeviceGreaterThan33 = async () => {
        if (Number(Platform.Version) >= 33) {
            return true;
        }

        const permission = PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE;

        const hasPermission = await PermissionsAndroid.check(permission);
        if (hasPermission) {
            return true;
        }

        const status = await PermissionsAndroid.request(permission);
        return status === 'granted';
    };

    static checkPermissions = (key, permission) => {
        if (!key || !permission) return false;

        return PermissionForAppMobile &&
            PermissionForAppMobile.value[key] &&
            PermissionForAppMobile.value[key][permission]
            ? true
            : false;
    };

    static encryptCode(guid, algorithm) {
        try {
            const parts = guid.split('-');
            const length = parts.length - 1;

            for (let i = 0; i < length; i++) {
                const val = algorithm[i];
                const replacement = arrayStrReplace[val];
                parts[i] = parts[i] + replacement;
            }

            return parts.join('');
        } catch (error) {
            return '';
        }
    }

    static decryptCode(qrCode) {
        try {
            // eslint-disable-next-line no-unused-vars
            for (const item of arrayStrReplace) {
                qrCode = qrCode.replaceAll(item, '-');
            }

            return qrCode;
        } catch (error) {
            // Trả về chính mã QR nếu giải mã thất bại - có thể thay đổi theo yêu cầu
            return qrCode;
        }
    }
}
