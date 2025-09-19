import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    Size
} from '../../../../../constants/styleConfig';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import HttpService from '../../../../../utils/HttpService';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName, EnumIcon, ScreenName } from '../../../../../assets/constant';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { IconCloseCircle } from '../../../../../constants/Icons';
// import Modal from 'react-native-modal';
import { translate } from '../../../../../i18n/translate';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import VnrYearPicker from '../../../../../components/VnrYearPicker/VnrYearPicker';
import CheckBox from 'react-native-check-box';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { SalApprovePITFinalizationBusinessFunction } from './SalApprovePITFinalizationBusiness';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';

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
    YearFormat: {
        label: 'HRM_Sal_PITFinalizationDelegatee_Year',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    IsPITFinalization: {
        label: 'HRM_Sal_PITFinalizationDelegatee_IsPITFinalization',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true
    },
    IsExportTax: {
        label: 'HRM_Sal_PITFinalizationDelegatee_IsExportTax',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: true
    },
    IsTaxableIncome: {
        label: 'HRM_Sal_PITFinalizationDelegatee_IsTaxableIncome',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: false
    },
    IsTaxCurrentIncome: {
        label: 'HRM_Sal_PITFinalizationDelegatee_IsTaxCurrentIncome',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: false
    },
    TaxCode: {
        label: 'HRM_Sal_PITFinalizationDelegatee_TaxCode',
        disable: true,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    Note: {
        label: 'HRM_Sal_PITFinalizationDelegatee_Note',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    FileAttachment: {
        label: 'HRM_Sal_PITFinalizationDelegatee_FileAttachment',
        visible: true,
        visibleConfig: true,
        disable: false,
        refresh: false,
        value: null
    },
    listTemplate: {
        visibleConfig: true,
        visible: false,
        listFile: []
    },
    fieldValid: {},
    //0172177: [LTG] [APP] Điều chỉnh giao diện màn hình DS Ủy quyền quyết toán thuế
    IsTransferCompany: {
        label: 'HRM_Sal_PITFinalizationDelegatee_IsTransferCompany',
        disable: false,
        refresh: false,
        value: false,
        visibleConfig: true,
        visible: false
    },
    Nationality: {
        label: 'HRM_Sal_PITFinalizationDelegatee_Nationality',
        disable: true,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    modalErrorDetail: {
        isModalVisible: false,
        cacheID: null,
        data: []
    },
    isDisableYearControl: true
};

export default class SalApprovePITFinalizationAddOrEdit extends Component {
    constructor(props) {
        super(props);

        this.state = initSateDefault;

        // need fix
        props.navigation.setParams({
            title:
                props.navigation.state.params && props.navigation.state.params.record
                    ? 'HRM_Payroll_Sal_PITFinalizationDelegatee_Update_Title'
                    : 'HRM_Payroll_Sal_PITFinalizationDelegatee_Create_Title'
        });

        this.setVariable();
    }
    //#region [khởi tạo - lấy các dữ liệu cho control, lấy giá trị mặc đinh]
    setVariable = () => {
        //biến trạng thái
        this.isModify = false;
        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;
        // Thông báo chi tiết lỗi
        this.IsContinueSave = false;
        this.ProfileRemoveIDs = null;
        this.IsRemoveAndContinue = null;
        this.CacheID = null;
    };

    refreshView = () => {
        this.props.navigation.setParams({ title: 'HRM_Payroll_Sal_PITFinalizationDelegatee_Create_Title' });
        this.setVariable();

        const { FileAttachment } = this.state;
        let resetState = {
            ...initSateDefault,
            FileAttachment: {
                ...initSateDefault.FileAttachment,
                refresh: !FileAttachment.refresh
            }
        };
        this.setState(resetState, () => this.getConfigValid('New_Sal_PITFinalizationDelegatee', true));
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
                        ConfigField && ConfigField.value['SalApprovePITFinalizationAddOrEdit']
                            ? ConfigField.value['SalApprovePITFinalizationAddOrEdit']['Hidden']
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
        this.getConfigValid('New_Sal_PITFinalizationDelegatee');
    }

    initData = async () => {
        const { E_ProfileID, E_FullName } = enumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] },
            { Profile, listTemplate, YearFormat, Nationality, TaxCode } = this.state;

        let _listFile = null;
        if (dataVnrStorage.languageApp == 'VN') {
            _listFile = {
                path: `${dataVnrStorage.apiConfig.uriPor}/Templates/TemplateWordAVN/TAX_08(VN).doc`,
                fileName: translate('HRM_Sal_PITFinalizationDelegatee_TaxTemplate')
            };
        } else {
            _listFile = {
                path: `${dataVnrStorage.apiConfig.uriPor}/Templates/TemplateWordAVN/TAX_08(VN).doc`,
                fileName: translate('HRM_Sal_PITFinalizationDelegatee_TaxTemplate')
            };
        }

        let nextState = {
            Profile: {
                ...Profile,
                ..._profile
            },
            listTemplate: {
                ...listTemplate,
                listFile: [_listFile],
                visible: true
            },
            // nhan.nguyen: task 0171259: APP - Màn hình bổ sung logic khi tạo mới DS Đăng ký Uỷ quyền quyết toán thuế
            YearFormat: {
                ...YearFormat,
                value: !isNaN(Number(moment(new Date()).format('YYYY')))
                    ? Number(moment(new Date()).format('YYYY')) - 1
                    : null,
                isRefresh: !YearFormat.refresh
            }
        };

        //nhan.nguyen: 0172177
        if (_profile.ID) {
            await HttpService.Post('[URI_HR]/Cat_GetData/GetCodeTaxAndNation', {
                ProfileID: _profile.ID
            })
                .then((res) => {
                    if (res) {
                        nextState = {
                            ...nextState,
                            Nationality: {
                                ...Nationality,
                                value: res?.CountryCodeName ? res?.CountryCodeName : null,
                                refresh: !Nationality.refresh
                            },
                            TaxCode: {
                                ...TaxCode,
                                value: res?.CodeTax ? res?.CodeTax : '',
                                refresh: !TaxCode.refresh
                            }
                        };
                    }
                })
                .catch((error) => {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                });
        }

        this.setState(nextState);
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        const { ID } = record;

        VnrLoadingSevices.show();
        HttpService.Get(`[URI_HR]/api/Sal_PITFinalizationDelegatee/GetById?id=${ID}`).then((data) => {
            VnrLoadingSevices.hide();
            try {
                _handleSetState(record, data);
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    handleSetState = (record, dataItem) => {
        let nextState = {};

        const {
                Profile,
                YearFormat,
                IsPITFinalization,
                IsExportTax,
                IsTaxableIncome,
                IsTaxCurrentIncome,
                Note,
                FileAttachment,
                listTemplate,
                IsTransferCompany,
                Nationality,
                TaxCode
            } = this.state,
            item = dataItem;

        let _listFile = null;
        if (dataVnrStorage.languageApp == 'VN') {
            _listFile = {
                path: `${dataVnrStorage.apiConfig.uriPor}/Templates/TemplateWordAVN/TAX_08(VN).doc`,
                fileName: translate('HRM_Sal_PITFinalizationDelegatee_TaxTemplate')
            };
        } else {
            _listFile = {
                path: `${dataVnrStorage.apiConfig.uriPor}/Templates/TemplateWordAVN/TAX_08(VN).doc`,
                fileName: translate('HRM_Sal_PITFinalizationDelegatee_TaxTemplate')
            };
        }

        nextState = {
            ...this.state,
            ID: record.ID,
            Profile: {
                ...Profile,
                ID: item.ProfileID,
                ProfileName: item.ProfileName
            },
            YearFormat: {
                ...YearFormat,
                value: item.Year
            },
            IsPITFinalization: {
                ...IsPITFinalization,
                value: item.IsPITFinalization
            },
            IsExportTax: {
                ...IsExportTax,
                value: item.IsExportTax
            },
            IsTaxableIncome: {
                ...IsTaxableIncome,
                value: item.IsTaxableIncome,
                visible: item.IsPITFinalization
            },
            IsTaxCurrentIncome: {
                ...IsTaxCurrentIncome,
                value: item.IsTaxCurrentIncome,
                visible: item.IsPITFinalization
            },

            // nhan.nguyen: 0172177
            IsTransferCompany: {
                ...IsTransferCompany,
                value: item.IsTransferCompany ? item.IsTransferCompany : false,
                visible: item.IsPITFinalization ? item.IsPITFinalization : false,
                refresh: !IsTransferCompany.refresh
            },
            Nationality: {
                ...Nationality,
                value: item?.Nationality ? item?.Nationality : null,
                refresh: !Nationality.refresh
            },
            TaxCode: {
                ...TaxCode,
                value: item?.TaxCode ? item?.TaxCode : null,
                refresh: !TaxCode.refresh
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
                refresh: !Note.refresh
            },
            listTemplate: {
                ...listTemplate,
                listFile: [_listFile],
                visible: true
            }
        };

        this.setState(nextState);
    };
    //#endregion

    onSave = (navigation, isCreate, isSend, isWarning, isContinous) => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;
        const {
            ID,
            Profile,
            YearFormat,
            IsPITFinalization,
            IsExportTax,
            IsTaxableIncome,
            IsTaxCurrentIncome,
            TaxCode,
            Note,
            FileAttachment,
            fieldValid,
            IsTransferCompany,
            Nationality,
            modalErrorDetail
        } = this.state;

        if (fieldValid?.TaxCode && (!TaxCode.value || TaxCode.value?.length === 0)) {
            ToasterSevice.showWarning('HRM_Sal_PITFinalizationDelegateeInfo_ValidateTaxCode');
            return;
        }

        let param = {
            ProfileID: Profile.ID,
            ProfileIDs: Profile.ID,
            UserSubmit: Profile.ID,
            IsPortal: true,

            Status: 'E_TEMPSAVE',
            Year: YearFormat.value,
            YearFormat: YearFormat.value ? moment().year(YearFormat.value).startOf('year').format('MM/DD/YYYY') : null,
            IsPITFinalization: IsPITFinalization.value,
            IsExportTax: IsExportTax.value,
            IsTaxableIncome: IsTaxableIncome.value,
            IsTaxCurrentIncome: IsTaxCurrentIncome.value,
            TaxCode: TaxCode.value,

            // nhan.nguyen:0172177
            IsTransferCompany: IsTransferCompany.value,
            Nationality: Nationality.value ? Nationality.value : null,

            Note: Note.value ? Note.value : null,
            FileAttachment: FileAttachment.value ? FileAttachment.value.map((item) => item.fileName).join(',') : null
        };

        // Send mail
        if (isSend) {
            param = {
                ...param,
                Status: 'E_WAITINGCONFIRM',
                IsSendRequest: true
            };
        }

        if (isWarning) {
            param = {
                ...param,
                isWarning: true
            };
        }

        if (isContinous) {
            param = {
                ...param,
                IsContinueSave: true,
                ProfileRemoveIDs: this.ProfileRemoveIDs,
                IsRemoveAndContinue: this.IsRemoveAndContinue,
                CacheID: this.CacheID
            };
        }

        if (ID) {
            param = {
                ...param,
                ID
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Sal_PITFinalizationDelegatee', param).then((data) => {
            VnrLoadingSevices.hide();
            this.isProcessing = false;
            if (data.ActionStatus == 'Success') {
                ToasterSevice.showSuccess('Hrm_Succeed', 4000);

                if (isCreate) {
                    this.refreshView();
                } else {
                    // navigation.goBack();
                    SalApprovePITFinalizationBusinessFunction.checkForReLoadScreen[
                        ScreenName.SalApprovePITFinalization
                    ] = true;
                    navigation.navigate('SalApprovePITFinalization');
                }

                // const { reload } = this.props.navigation.state.params;
                // if (reload && typeof (reload) == 'function') {
                //   reload();
                // }
            } else if (data.ErrorRespone) {
                if (data.ErrorRespone.IsBlock) {
                    // Nếu có IsBlock, kiểm tra có IsShowRemoveAndContinue hay không
                    if (data.ErrorRespone.IsShowRemoveAndContinue) {
                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_WARNING,
                            message: translate('HRM_Attendance_Message_InvalidRequestDataPleaseCheckAgain'),
                            // Lưu và tiếp tục
                            colorSecondConfirm: Colors.primary,
                            textSecondConfirm: translate('Button_OK'),
                            onSecondConfirm: () => {
                                this.ProfileRemoveIDs = data.ErrorRespone.ProfileRemoveIDs;
                                this.IsRemoveAndContinue = true;
                                this.CacheID = data.ErrorRespone.CacheID;
                                this.onSave(navigation, isCreate, isSend, isWarning, true);
                            },
                            // Đóng
                            onCancel: () => {},
                            // Chi tiết lỗi
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
                            // Đóng popup
                            onCancel: () => {},
                            // Chi tiết lỗi
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
                        // Lưu và tiếp tục
                        colorSecondConfirm: Colors.primary,
                        textSecondConfirm: translate('Button_OK'),
                        onSecondConfirm: () => {
                            this.IsContinueSave = true;
                            this.ProfileRemoveIDs = data.ErrorRespone.ProfileRemoveIDs;
                            this.IsRemoveAndContinue = true;
                            this.CacheID = data.ErrorRespone.CacheID;
                            this.onSave(navigation, isCreate, isSend, isWarning, true);
                        },
                        // Đóng
                        onCancel: () => {},
                        // Chi tiết lỗi
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
            } else if (data?.isWarning) {
                AlertSevice.alert({
                    title: translate('Hrm_Notification'),
                    iconType: EnumIcon.E_WARNING,
                    message: data?.ActionStatus,
                    //lưu và tiếp tục
                    colorSecondConfirm: Colors.primary,
                    textSecondConfirm: translate('Button_OK'),
                    onConfirm: () => {
                        // this.ProfileRemoveIDs = res.Data.ProfileRemoveIDs;
                        // this.IsRemoveAndContinue = true;
                        // this.CacheID = res.Data.CacheID;
                        this.onSave(navigation, isCreate, isSend, true);
                    },
                    //đóng
                    onCancel: () => {}
                });
            } else {
                ToasterSevice.showWarning(data.ActionStatus);
            }
        });
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
            { data } = modalErrorDetail;

        if (data) {
            const dataGroup = this.groupByMessage(data, 'MessageName'),
                dataSourceError = this.mappingDataGroup(dataGroup);

            return dataSourceError.map((dataItem, index) => {
                let viewContent = <View />;
                if (dataItem['Type'] && dataItem['Type'] == 'E_GROUP') {
                    viewContent = (
                        <View style={styleComonAddOrEdit.styleViewTitleGroup}>
                            <VnrText
                                style={[styleSheets.lable, styleComonAddOrEdit.styFontErrTitle]}
                                i18nKey={dataItem['TitleGroup']}
                            />
                        </View>
                    );
                } else {
                    viewContent = (
                        <View style={styleComonAddOrEdit.styFontErrInfo}>
                            <View style={styleComonAddOrEdit.styFontErrLine}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    i18nKey={'HRM_PortalApp_Message_ErrorCodeEmp'}
                                />

                                <View style={styleComonAddOrEdit.styFontErrVal}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    >
                                        {dataItem['CodeEmp']}
                                    </Text>
                                </View>
                            </View>

                            <View style={styleComonAddOrEdit.styFontErrLine}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    i18nKey={'HRM_PortalApp_Message_ErrorProfileName'}
                                />

                                <View style={styleComonAddOrEdit.styFontErrVal}>
                                    <Text
                                        numberOfLines={1}
                                        style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    >
                                        {dataItem['ProfileName']}
                                    </Text>
                                </View>
                            </View>

                            <View style={styleComonAddOrEdit.styFontErrLine}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}
                                    i18nKey={'HRM_PortalApp_Message_ErrorDescription'}
                                />

                                <View style={styleComonAddOrEdit.styFontErrVal}>
                                    <Text style={[styleSheets.textItalic, styleComonAddOrEdit.styFontErrText]}>
                                        {dataItem['ErrorDescription']}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    );
                }

                return (
                    <View
                        key={index}
                        style={[
                            styleComonAddOrEdit.styleViewBorderButtom,
                            dataSourceError.length - 1 == index && styleComonAddOrEdit.styleViewNoBorder
                        ]}
                    >
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

    closeModalErrorDetail = () => {
        let nextState = {
            modalErrorDetail: {
                ...this.state.modalErrorDetail,
                isModalVisible: false
            }
        };

        this.setState(nextState);
    };

    onSaveAndCreate = (navigation) => {
        this.onSave(navigation, true, null);
    };

    onSaveAndSend = (navigation) => {
        this.onSave(navigation, null, true);
    };

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

    onChangePITFinalization = () => {
        const { IsPITFinalization, IsTaxableIncome, IsTaxCurrentIncome, IsTransferCompany } = this.state,
            valITem = !IsPITFinalization.value;

        this.setState({
            IsPITFinalization: {
                ...IsPITFinalization,
                value: valITem
            },
            IsTaxableIncome: {
                ...IsTaxableIncome,
                value: false,
                visible: valITem
            },
            IsTaxCurrentIncome: {
                ...IsTaxCurrentIncome,
                value: false,
                visible: valITem
            },

            IsTransferCompany: {
                ...IsTransferCompany,
                value: false,
                visible: valITem
            }
        });
    };

    render() {
        const {
            YearFormat,
            IsPITFinalization,
            IsExportTax,
            IsTaxableIncome,
            IsTaxCurrentIncome,
            Note,
            FileAttachment,
            listTemplate,
            TaxCode,
            fieldValid,
            IsTransferCompany,
            Nationality,
            modalErrorDetail,
            isDisableYearControl
        } = this.state;

        const { textLableInfo, contentViewControl, viewLable, viewControl, viewInputMultiline } =
            stylesListPickerControl;
        //#region [Xử lý 3 nút lưu]
        const listActions = [];

        listActions.push({
            type: EnumName.E_SAVE_SENMAIL,
            title: translate('HRM_Common_Sal_PITFinalizationDelegatee_SaveAndSendRequest'),
            onPress: () => this.onSaveAndSend(this.props.navigation)
        });

        listActions.push({
            type: EnumName.E_SAVE_CLOSE,
            title: translate('HRM_Common_Sal_PITFinalizationDelegatee_SaveClose'),
            onPress: () => this.onSave(this.props.navigation)
        });

        //#endregion
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={styles.styKeyboardContainer}
                        ref={(ref) => (this.scrollViewRef = ref)}
                    >
                        {/* Năm quyết toán - YearFormat */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={YearFormat.label} />

                                {/* valid YearFormat */}
                                {fieldValid.YearFormat && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>
                            <View style={viewControl}>
                                <VnrYearPicker
                                    disable={isDisableYearControl}
                                    onFinish={(item) => {
                                        this.setState({
                                            YearFormat: {
                                                ...YearFormat,
                                                value: !isNaN(Number(item.year))
                                                    ? Number(item.year) - 1
                                                    : !isNaN(Number(moment(new Date()).format('YYYY')))
                                                        ? Number(moment(new Date()).format('YYYY')) - 1
                                                        : null,
                                                refresh: !YearFormat.refresh
                                            }
                                        });
                                    }}
                                    value={YearFormat.value}
                                    stylePicker={styles.styPickerVYear}
                                />
                            </View>
                        </View>

                        {/*Ủy quyền quyết toán thuế - IsPITFinalization */}
                        <View style={styles.styListBtnTypePregnancy}>
                            {IsPITFinalization.visibleConfig && IsPITFinalization.visible && (
                                <TouchableOpacity
                                    style={styles.styBtnTypePregnancy}
                                    onPress={() => this.onChangePITFinalization()}
                                >
                                    <CheckBox
                                        checkBoxColor={Colors.black}
                                        checkedCheckBoxColor={Colors.primary}
                                        isChecked={IsPITFinalization.value}
                                        disable={IsPITFinalization.disable}
                                        onClick={() => this.onChangePITFinalization()}
                                    />
                                    <VnrText
                                        style={[styleSheets.text, styles.styBtnTypePregnancyText]}
                                        i18nKey={IsPITFinalization.label}
                                    />
                                    {fieldValid.IsPITFinalization && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Thu nhập chịu thuế - IsTaxableIncome */}
                        {IsTaxableIncome.visibleConfig && IsTaxableIncome.visible && (
                            <View style={styles.styListBtnTypePregnancy}>
                                <TouchableOpacity
                                    style={styles.styBtnTypePregnancy}
                                    onPress={() =>
                                        this.setState({
                                            IsTaxableIncome: {
                                                ...IsTaxableIncome,
                                                value: !IsTaxableIncome.value
                                            }
                                        })
                                    }
                                >
                                    <CheckBox
                                        checkBoxColor={Colors.black}
                                        checkedCheckBoxColor={Colors.primary}
                                        isChecked={IsTaxableIncome.value}
                                        disable={IsTaxableIncome.disable}
                                        onClick={() =>
                                            this.setState({
                                                IsTaxableIncome: {
                                                    ...IsTaxableIncome,
                                                    value: !IsTaxableIncome.value
                                                }
                                            })
                                        }
                                    />
                                    <VnrText
                                        style={[styleSheets.text, styles.styBtnTypePregnancyText]}
                                        i18nKey={IsTaxableIncome.label}
                                    />
                                    {fieldValid.IsTaxableIncome && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* nhan.nguyen: 0172177: [LTG] [APP] Điều chỉnh giao diện màn hình DS Ủy quyền quyết toán thuế*/}
                        {/* Điều chuyển công ty/đơn vị trong Tập đoàn- IsTransferCompany */}
                        {IsTransferCompany.visibleConfig && IsTransferCompany.visible && (
                            <View style={styles.styListBtnTypePregnancy}>
                                <TouchableOpacity
                                    style={styles.styBtnTypePregnancy}
                                    onPress={() =>
                                        this.setState({
                                            IsTransferCompany: {
                                                ...IsTransferCompany,
                                                value: !IsTransferCompany.value
                                            }
                                        })
                                    }
                                >
                                    <CheckBox
                                        checkBoxColor={Colors.black}
                                        checkedCheckBoxColor={Colors.primary}
                                        isChecked={IsTransferCompany.value}
                                        disable={IsTransferCompany.disable}
                                        onClick={() =>
                                            this.setState({
                                                IsTransferCompany: {
                                                    ...IsTransferCompany,
                                                    value: !IsTransferCompany.value
                                                }
                                            })
                                        }
                                    />
                                    <VnrText
                                        numberOfLines={2}
                                        style={[
                                            styleSheets.text,
                                            styles.styBtnTypePregnancyText,
                                            styles.styTextTypePrenancy
                                        ]}
                                        i18nKey={IsTransferCompany.label}
                                    />
                                    {fieldValid.IsTransferCompany && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Thu nhập chịu thuế, vãng lai (<= 10 triệu/tháng) - IsTaxCurrentIncome */}
                        {IsTaxCurrentIncome.visibleConfig && IsTaxCurrentIncome.visible && (
                            <View style={styles.styListBtnTypePregnancy}>
                                <TouchableOpacity
                                    style={styles.styBtnTypePregnancy}
                                    onPress={() =>
                                        this.setState({
                                            IsTaxCurrentIncome: {
                                                ...IsTaxCurrentIncome,
                                                value: !IsTaxCurrentIncome.value
                                            }
                                        })
                                    }
                                >
                                    <CheckBox
                                        checkBoxColor={Colors.black}
                                        checkedCheckBoxColor={Colors.primary}
                                        isChecked={IsTaxCurrentIncome.value}
                                        disable={IsTaxCurrentIncome.disable}
                                        onClick={() =>
                                            this.setState({
                                                IsTaxCurrentIncome: {
                                                    ...IsTaxCurrentIncome,
                                                    value: !IsTaxCurrentIncome.value
                                                }
                                            })
                                        }
                                    />
                                    <VnrText
                                        numberOfLines={2}
                                        style={[
                                            styleSheets.text,
                                            styles.styBtnTypePregnancyText,
                                            styles.styTextTypePrenancy
                                        ]}
                                        i18nKey={IsTaxCurrentIncome.label}
                                    />
                                    {fieldValid.IsTaxCurrentIncome && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </TouchableOpacity>
                            </View>
                        )}

                        {/* Xuất chứng từ khấu trừ thuế - IsExportTax */}
                        <View style={styles.styListBtnTypePregnancy}>
                            {IsExportTax.visibleConfig && IsExportTax.visible && (
                                <TouchableOpacity
                                    style={styles.styBtnTypePregnancy}
                                    onPress={() =>
                                        this.setState({
                                            IsExportTax: {
                                                ...IsExportTax,
                                                value: !IsExportTax.value
                                            }
                                        })
                                    }
                                >
                                    <CheckBox
                                        checkBoxColor={Colors.black}
                                        checkedCheckBoxColor={Colors.primary}
                                        isChecked={IsExportTax.value}
                                        disable={IsExportTax.disable}
                                        onClick={() =>
                                            this.setState({
                                                IsExportTax: {
                                                    ...IsExportTax,
                                                    value: !IsExportTax.value
                                                }
                                            })
                                        }
                                    />
                                    <VnrText
                                        style={[styleSheets.text, styles.styBtnTypePregnancyText]}
                                        i18nKey={IsExportTax.label}
                                    />
                                    {fieldValid.IsExportTax && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* Quốc tịch - Nationality */}
                        {Nationality.visibleConfig && Nationality.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Nationality.label} />
                                    {fieldValid.Nationality && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Nationality.disable}
                                        refresh={Nationality.refresh}
                                        value={Nationality.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                Nationality: {
                                                    ...Nationality,
                                                    value: text,
                                                    refresh: !Nationality.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* nhan.nguyen: task: 0171259: APP - Màn hình bổ sung logic khi tạo mới DS Đăng ký Uỷ quyền quyết toán thuế */}
                        {/* Mã số thuế -  TaxCode*/}
                        {TaxCode.visibleConfig && TaxCode.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={TaxCode.label} />
                                    {fieldValid.TaxCode && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={TaxCode.disable}
                                        refresh={TaxCode.refresh}
                                        value={TaxCode.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={(text) =>
                                            this.setState({
                                                TaxCode: {
                                                    ...TaxCode,
                                                    value: text,
                                                    refresh: !TaxCode.refresh
                                                }
                                            })
                                        }
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

                        {/* Tải mẫu - listTemplate */}
                        {listTemplate.visible && listTemplate.visibleConfig && listTemplate.listFile.length && (
                            <View style={contentViewControl}>
                                <View style={viewControl}>
                                    {Vnr_Function.formatStringType(listTemplate, {
                                        Name: 'listFile',
                                        DataType: 'fileattach'
                                    })}
                                </View>
                            </View>
                        )}
                    </KeyboardAwareScrollView>

                    <ListButtonSave listActions={listActions} />
                </View>
                {modalErrorDetail.isModalVisible && (
                    <Modal animationType="slide" transparent={true} isVisible={true}>
                        <View style={styleComonAddOrEdit.wrapModalError}>
                            <TouchableOpacity
                                style={[styleComonAddOrEdit.bgOpacity]}
                                onPress={() => this.closeModalErrorDetail()}
                            />
                            <SafeAreaView style={styleComonAddOrEdit.wrapContentModalError}>
                                <View style={styleComonAddOrEdit.wrapTitileHeaderModalError}>
                                    <VnrText
                                        style={[
                                            styleSheets.text,
                                            styleComonAddOrEdit.styRegister,
                                            styleComonAddOrEdit.fS16fW600
                                        ]}
                                        i18nKey={'HRM_PortalApp_Message_ErrorDetail'}
                                    />

                                    <TouchableOpacity onPress={() => this.closeModalErrorDetail()}>
                                        <IconCloseCircle size={Size.iconSize} color={Colors.white} />
                                    </TouchableOpacity>
                                </View>
                                <ScrollView style={styleComonAddOrEdit.wrapLevelError}>
                                    {this.renderErrorDetail()}
                                </ScrollView>
                            </SafeAreaView>
                        </View>
                    </Modal>
                )}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styPickerVYear: {
        backgroundColor: Colors.white,
        width: Size.deviceWidth - Size.defineSpace * 2,
        marginHorizontal: 0
    },
    styTextTypePrenancy: { maxWidth: '90%' },
    styKeyboardContainer: { flexGrow: 1, paddingTop: 10 },
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
    }
});
