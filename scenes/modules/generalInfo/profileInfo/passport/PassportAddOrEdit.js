import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import { translate } from '../../../../../i18n/translate';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import DrawerServices from '../../../../../utils/DrawerServices';
import HttpService from '../../../../../utils/HttpService';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { EnumIcon, EnumName, ScreenName } from '../../../../../assets/constant';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import moment from 'moment';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { PassportConfirmedBusinessFunction } from './passportConfirmed/PassportConfirmedBusinessFunction';
import Vnr_Function from '../../../../../utils/Vnr_Function';

const initSateDefault = {
    IsCheckFormat: null,
    StrBlockRelativesCodeTax: null,
    IsExcludeProbation: null,
    StrBlockRelativesIDNo: null,
    IsBlockRelativesIDNo: null,
    IsBlockRelativesCodeTax: null,
    ID: null,

    // Cập nhật dữ liệu sang HSNV
    UpdatePassportToProfile: {
        visible: true,
        visibleConfig: true,
        label: 'UpdatePassportToProfileView',
        data: [
            {
                Text: 'Có',
                Value: 'E_YES',
                Number: 1
            },
            {
                Text: 'Không',
                Value: 'E_NO',
                Number: 2
            }
        ],
        disable: false,
        refresh: false,
        value: null
    },

    // Số hộ chiếu
    PassportNo: {
        visible: true,
        visibleConfig: true,
        label: 'HRM_HR_Profile_PassportNo',
        disable: false,
        refresh: false,
        value: null
    },

    // Mã hộ chiếu
    PassportCode: {
        visible: true,
        visibleConfig: true,
        label: 'HRM_HR_Passport_PassportCode',
        disable: false,
        refresh: false,
        value: null
    },

    // Loại hộ chiếu
    PassportType: {
        visible: true,
        visibleConfig: true,
        label: 'HRM_HR_Passport_PassportType',
        disable: false,
        refresh: false,
        value: null
    },

    // Ngày cấp hộ chiếu
    PassportDateOfIssue: {
        label: 'HRM_HR_Profile_PassportDateOfIssue',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },

    // Ngày hết hạn hộ chiếu
    PassportDateOfExpiry: {
        label: 'HRM_HR_Profile_PassportDateOfExpiry',
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },

    // Quốc gia
    CountryID: {
        visible: true,
        visibleConfig: true,
        label: 'PCountryName',
        data: [],
        disable: false,
        refresh: false,
        value: null
    },

    PassportPlaceOfIssue: {
        visible: true,
        visibleConfig: true,
        label: 'HRM_HR_Profile_PassportPlaceOfIssue',
        disable: false,
        refresh: false,
        value: null
    },

    PassportPlaceNewID: {
        visible: true,
        visibleConfig: true,
        label: 'HRM_HR_Profile_PassportPlaceOfIssue',
        data: [],
        disable: false,
        refresh: false,
        value: null
    },

    NoOfDaysOfResidence: {
        visible: true,
        visibleConfig: true,
        label: 'HRM_HR_Passport_NoOfDaysOfResidence',
        disable: false,
        refresh: false,
        value: null
    },

    Attachment: {
        label: 'HRM_Rec_JobVacancy_FileAttachment',
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },

    Note: {
        visible: true,
        visibleConfig: true,
        label: 'Note',
        disable: false,
        refresh: false,
        value: null
    },

    isUpperCaseText: {},
    fieldValid: {}
};
export default class PassportAddOrEdit extends Component {
    constructor(porps) {
        super(porps);
        this.state = initSateDefault;

        this.setVariable();

        porps.navigation.setParams({
            title: porps.navigation.state.params.record
                ? 'HRM_HR_Passport_PopUp_Edit_Title'
                : 'HRM_HR_Passport_PopUp_Create_Title'
        });
    }

    //#region [khởi tạo , lấy các dữ liệu cho control, lấy giá trị mặc đinh]
    //promise get config valid
    getConfigValid = (tblName, isRefresh) => {
        try {
            HttpService.MultiRequest([
                HttpService.Get('[URI_HR]/Hre_GetDataV2/GetFieldInfoFileByTableNameKaizenVersion?tableName=' + tblName),
                HttpService.Post('[URI_HR]/Hre_GetData/GetMultiProfileHireJobCommon', {
                    tableName: tblName
                }),
                HttpService.Post('[URI_HR]/Hre_GetData/UpdatePassportToProfile', {
                    profileID: this.profileInfo?.ProfileID
                })
            ]).then(resAll => {
                VnrLoadingSevices.hide();
                if (resAll && Array.isArray(resAll) && resAll.length === 3) {
                    const [resConfigValid, ValueUpdatePassportToProfile] = resAll,
                        { UpdatePassportToProfile } = this.state;
                    let nextState = {},
                        tempConfig = {};

                    try {
                        //map field hidden by config
                        const _configField =
                                ConfigField && ConfigField.value['PassportAddOrEdit']
                                    ? ConfigField.value['PassportAddOrEdit']['Hidden']
                                    : [],
                            { E_ProfileID, E_FullName } = EnumName,
                            _profile = { ID: this.profileInfo[E_ProfileID], ProfileName: this.profileInfo[E_FullName] };

                        _configField.forEach(fieldConfig => {
                            let _field = this.state[fieldConfig];
                            if (_field && typeof _field === 'object') {
                                _field = {
                                    ..._field,
                                    visibleConfig: false
                                };

                                nextState = {
                                    ...nextState,
                                    [fieldConfig]: { ..._field },
                                    Profile: _profile
                                };
                            }
                        });
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                    if (Array.isArray(resConfigValid) && resConfigValid.length > 0) {
                        resConfigValid.map(item => {
                            if (item?.FieldName)
                                tempConfig = {
                                    ...tempConfig,
                                    [item.FieldName]: {
                                        ...item
                                    }
                                };
                        });

                        nextState = { ...nextState, fieldValid: tempConfig };
                    }

                    if (ValueUpdatePassportToProfile && ValueUpdatePassportToProfile === 'E_YES') {
                        nextState = {
                            ...nextState,
                            UpdatePassportToProfile: {
                                ...UpdatePassportToProfile,
                                value: {
                                    Value: ValueUpdatePassportToProfile
                                },
                                refresh: !UpdatePassportToProfile.refresh
                            }
                        };
                    }

                    this.setState({ ...nextState }, () => {
                        let { record } = !isRefresh ? this.props.navigation.state.params : {};

                        //get config khi đăng ký
                        if (!record) {
                            this.getConfig();
                        } else {
                            this.isModify = true;
                            this.setRecordForModify(record);
                        }
                    });
                }
            });
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    refreshView = () => {
        const { Attachment } = this.state;
        this.props.navigation.setParams({ title: 'HRM_HR_Passport_PopUp_Create_Title' });
        this.setVariable();

        let resetState = {
            ...initSateDefault,
            Attachment: {
                ...Attachment,
                value: null,
                refresh: !Attachment.refresh
            }
        };
        this.setState(resetState, () => this.getConfigValid('Hre_PassportPortal', true));
    };

    setVariable = () => {
        this.stateBackup = null;
        this.isModify = false;
        this.isSaveContinue = null;
        this.profileInfo = dataVnrStorage && dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info : {};
    };

    componentDidMount() {
        VnrLoadingSevices.show();
        this.getConfigValid('Hre_PassportPortal');
    }

    setRecordForModify = response => {
        let nextState = {};

        const {
            UpdatePassportToProfile,
            PassportNo,
            PassportCode,
            PassportType,
            PassportDateOfIssue,
            PassportDateOfExpiry,
            CountryID,
            PassportPlaceOfIssue,
            PassportPlaceNewID,
            NoOfDaysOfResidence,
            Attachment,
            Note
        } = this.state;

        if (response) {
            nextState = {
                UpdatePassportToProfile: {
                    ...UpdatePassportToProfile,
                    value: response?.UpdatePassportToProfile ? { Value: response?.UpdatePassportToProfile } : null,
                    refresh: !UpdatePassportToProfile.refresh
                },
                PassportNo: {
                    ...PassportNo,
                    value: response?.PassportNo ? response?.PassportNo : null,
                    refresh: !UpdatePassportToProfile.refresh
                },
                PassportCode: {
                    ...PassportCode,
                    value: response?.PassportCode ? response?.PassportCode : null,
                    refresh: !PassportCode.refresh
                },
                PassportType: {
                    ...PassportType,
                    value: response?.PassportType ? response?.PassportType : null,
                    refresh: !PassportType.refresh
                },
                PassportDateOfIssue: {
                    ...PassportDateOfIssue,
                    value: response?.PassportDateOfIssue ? response?.PassportDateOfIssue : null,
                    refresh: !PassportDateOfIssue.refresh
                },
                PassportDateOfExpiry: {
                    ...PassportDateOfExpiry,
                    value: response?.PassportDateOfExpiry ? response?.PassportDateOfExpiry : null,
                    refresh: !PassportDateOfExpiry.refresh
                },
                CountryID: {
                    ...CountryID,
                    value: response?.CountryID ? { ID: response?.CountryID } : null,
                    refresh: !CountryID.refresh
                },
                PassportPlaceOfIssue: {
                    ...PassportPlaceOfIssue,
                    value: response?.PassportPlaceOfIssue ? response?.PassportPlaceOfIssue : null,
                    refresh: !PassportPlaceOfIssue.refresh
                },
                PassportPlaceNewID: {
                    ...PassportPlaceNewID,
                    value: response?.PassportPlaceNewID ? { ID: response?.PassportPlaceNewID } : null,
                    refresh: !PassportPlaceNewID.refresh
                },
                NoOfDaysOfResidence: {
                    ...NoOfDaysOfResidence,
                    value:
                        response?.NoOfDaysOfResidence && !isNaN(Number(response?.NoOfDaysOfResidence))
                            ? Number(response?.NoOfDaysOfResidence)
                            : null,
                    refresh: !NoOfDaysOfResidence.refresh
                },
                Note: {
                    ...Note,
                    value: response?.Note ? response?.Note : null,
                    refresh: !Note.refresh
                },
                //File đính kèm
                Attachment: {
                    ...Attachment,
                    value: response.lstFileAttach ? response.lstFileAttach : null,
                    refresh: !Attachment.refresh
                }
            };
        }

        nextState = {
            ...nextState,
            ID: response.ID
        };

        this.stateBackup = JSON.stringify({ ...nextState });
        this.setState({ ...nextState });
    };

    getConfig = () => {};

    compareData = params => {

        if (this.stateBackup == null) return false;

        const state = JSON.parse(this.stateBackup);
        let params2 = this.getParamsFromData(state);

        if (Vnr_Function.compare(params2, params)) {
            return true;
        }

        return false;
    };

    getParamsFromData = state => {
        const {
            UpdatePassportToProfile,
            PassportNo,
            PassportCode,
            PassportType,
            PassportDateOfIssue,
            PassportDateOfExpiry,
            CountryID,
            PassportPlaceOfIssue,
            PassportPlaceNewID,
            NoOfDaysOfResidence,
            Attachment,
            Note
        } = state;

        let params = {
            UpdatePassportToProfile: UpdatePassportToProfile?.value?.Value
                ? UpdatePassportToProfile?.value?.Value
                : null,
            PassportNo: PassportNo.value,
            PassportCode: PassportCode.value,
            PassportType: PassportType.value,
            PassportDateOfIssue: PassportDateOfIssue.value
                ? moment(PassportDateOfIssue.value).format('MM/DD/YYYY LT')
                : null,
            PassportDateOfExpiry: PassportDateOfExpiry.value
                ? moment(PassportDateOfExpiry.value).format('MM/DD/YYYY LT')
                : null,
            CountryID: CountryID.value?.ID ? CountryID.value.ID : null,
            PassportPlaceOfIssue: PassportPlaceOfIssue.value,
            PassportPlaceNewID: PassportPlaceNewID.value?.ID ? PassportPlaceNewID.value.ID : null,
            NoOfDaysOfResidence: NoOfDaysOfResidence.value ? Number(NoOfDaysOfResidence.value) : null,
            Note: Note.value,
            Attachment: Attachment.value ? Attachment.value.map(item => item.fileName).join(',') : null,
            IsPortal: true,
            ProfileID: this.profileInfo.ProfileID,
            UserID: this.profileInfo.userid,
            UserSubmit: this.profileInfo.ProfileID ? this.profileInfo.ProfileID : null
        };

        return { ...params };
    };

    save = (navigation, isCreate, isSend) => {
        const {
                ID
            } = this.state,
            { apiConfig } = dataVnrStorage,
            { uriPor } = apiConfig;


        let params = this.getParamsFromData(this.state);
        // if (this.compareData(params) === true) {
        //     ToasterSevice.showSuccess("Hrm_Succeed", 4000);

        //     if (isCreate) {
        //         this.refreshView();
        //     }
        //     else {
        //         // navigation.goBack();
        //         const { reload, screenName } = this.props.navigation.state.params;
        //         if (reload && typeof (reload) === 'function') {
        //             reload();
        //         }

        //         PassportConfirmedBusinessFunction.checkForLoadEditDelete[ScreenName.PassportWaitConfirm] = true;
        //         DrawerServices.navigate(ScreenName.PassportWaitConfirm);
        //     }

        //     return;
        // }

        // Send mail
        if (isSend) {
            params = {
                ...params,
                IsSubmitSave: true,
                Host: uriPor,
                IsAddNewAndSendMail: true
            };
        }

        if (ID) {
            params = {
                ...params,
                ID
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Hre_PassportPortal', params).then(data => {
            VnrLoadingSevices.hide();

            if (data && typeof data == 'object') {
                if (data.ActionStatus && data.ActionStatus.split('|')[0] == 'InValid') {
                    const message = data.ActionStatus.split('|')[1];
                    ToasterSevice.showWarning(message, 4000);
                } else if (data.ActionStatus == 'OpenPopUp') {
                    // task 141521
                    AlertSevice.alert({
                        title: translate('Hrm_Notification'),
                        iconType: EnumIcon.E_WARNING,
                        message: translate('HRM_HR_ExistingOtherRelationship_Save'),
                        textRightButton: translate('Button_OK'),
                        onCancel: () => {},
                        onConfirm: () => {
                            this.isSaveContinue = true;
                            this.save();
                        }
                    });
                } else if (data.ActionStatus != 'Success' && data.ActionStatus != translate('Success')) {
                    ToasterSevice.showWarning(data.ActionStatus, 4000);
                } else {
                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);

                    if (isCreate) {
                        this.refreshView();
                    } else {
                        // navigation.goBack();
                        const { reload } = this.props.navigation.state.params;
                        if (reload && typeof reload === 'function') {
                            reload();
                        }

                        PassportConfirmedBusinessFunction.checkForLoadEditDelete[ScreenName.PassportWaitConfirm] = true;
                        DrawerServices.navigate(ScreenName.PassportWaitConfirm);
                    }
                }
            }
        });
    };

    onSaveAndCreate = navigation => {
        this.save(navigation, true, null);
    };

    onSaveAndSend = navigation => {
        this.save(navigation, null, true);
    };

    render() {
        const {
            fieldValid,
            UpdatePassportToProfile,
            PassportNo,
            PassportCode,
            PassportType,
            PassportDateOfIssue,
            PassportDateOfExpiry,
            CountryID,
            PassportPlaceOfIssue,
            PassportPlaceNewID,
            NoOfDaysOfResidence,
            Attachment,
            Note
        } = this.state;

        const { textLableInfo, contentViewControl, viewLable, viewControl } = stylesListPickerControl;

        //#region [Xử lý 3 nút lưu]
        const listActions = [];

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Hre_Passport_BtnSaveNormal'] &&
            PermissionForAppMobile.value['New_Hre_Passport_BtnSaveNormal']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_SENMAIL,
                title: translate('HRM_Common_SaveAndSendRequest'),
                onPress: () => this.onSaveAndSend(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Hre_Passport_btnSaveClose'] &&
            PermissionForAppMobile.value['New_Hre_Passport_btnSaveClose']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_CLOSE,
                title: translate('HRM_Common_SaveClose'),
                onPress: () => this.save(this.props.navigation)
            });
        }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Hre_Passport_BtnSaveNew'] &&
            PermissionForAppMobile.value['New_Hre_Passport_BtnSaveNew']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_NEW,
                title: translate('HRM_Common_SaveNew'),
                onPress: () => this.onSaveAndCreate(this.props.navigation)
            });
        }

        //#endregion
        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView contentContainerStyle={CustomStyleSheet.flexGrow(1)}>
                        {/* thông tin chung */}
                        <View>
                            {/* Cập nhật dữ liệu sang HSNV - UpdatePassportToProfile */}
                            {UpdatePassportToProfile.visibleConfig && UpdatePassportToProfile.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={UpdatePassportToProfile.label}
                                        />

                                        {/* valid UpdatePassportToProfile */}
                                        {fieldValid?.UpdatePassportToProfile?.Nullable === false && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerQuickly
                                            autoBind={true}
                                            // dataLocal={UpdatePassportToProfile.data}
                                            api={{
                                                urlApi: '[URI_SYS]/Sys_GetData/GetEnum',
                                                type: 'E_POST',
                                                dataBody: {
                                                    text: 'BoolType'
                                                }
                                            }}
                                            refresh={UpdatePassportToProfile.refresh}
                                            textField="Text"
                                            valueField="Value"
                                            filter={false}
                                            value={UpdatePassportToProfile.value}
                                            disable={UpdatePassportToProfile.disable}
                                            onFinish={item =>
                                                this.setState({
                                                    UpdatePassportToProfile: {
                                                        ...UpdatePassportToProfile,
                                                        value: item,
                                                        refresh: !UpdatePassportToProfile.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Số hộ chiếu - PassportNo */}
                            {PassportNo.visibleConfig && PassportNo.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={PassportNo.label} />

                                        {/* valid ProfileID */}
                                        {fieldValid?.PassportNo?.Nullable === false && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={PassportNo.disable}
                                            refresh={PassportNo.refresh}
                                            value={PassportNo.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    PassportNo: {
                                                        ...PassportNo,
                                                        value: text,
                                                        refresh: !PassportNo.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Mã hộ chiếu - PassportCode */}
                            {PassportCode.visibleConfig && PassportCode.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={PassportCode.label}
                                        />

                                        {/* valid ProfileID */}
                                        {fieldValid?.PassportCode?.Nullable === false && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={PassportCode.disable}
                                            refresh={PassportCode.refresh}
                                            value={PassportCode.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    PassportCode: {
                                                        ...PassportCode,
                                                        value: text,
                                                        refresh: !PassportCode.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Loại hộ chiếu - PassportType */}
                            {PassportType.visibleConfig && PassportType.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={PassportType.label}
                                        />

                                        {/* valid ProfileID */}
                                        {fieldValid?.PassportType?.Nullable === false && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={PassportType.disable}
                                            refresh={PassportType.refresh}
                                            value={PassportType.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    PassportType: {
                                                        ...PassportType,
                                                        value: text,
                                                        refresh: !PassportType.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Ngày cấp hộ chiếu - PassportDateOfIssue */}
                            {PassportDateOfIssue.visibleConfig && PassportDateOfIssue.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={PassportDateOfIssue.label}
                                        />

                                        {fieldValid?.PassportDateOfIssue?.Nullable === false && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={PassportDateOfIssue.value}
                                            refresh={PassportDateOfIssue.refresh}
                                            type={'date'}
                                            onFinish={value =>
                                                this.setState({
                                                    PassportDateOfIssue: {
                                                        ...PassportDateOfIssue,
                                                        value,
                                                        refresh: !PassportDateOfIssue.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Ngày hết hạn hộ chiếu - PassportDateOfExpiry */}
                            {PassportDateOfExpiry.visibleConfig && PassportDateOfExpiry.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={PassportDateOfExpiry.label}
                                        />

                                        {fieldValid?.PassportDateOfExpiry?.Nullable === false && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrDate
                                            response={'string'}
                                            format={'DD/MM/YYYY'}
                                            value={PassportDateOfExpiry.value}
                                            refresh={PassportDateOfExpiry.refresh}
                                            type={'date'}
                                            onFinish={value =>
                                                this.setState({
                                                    PassportDateOfExpiry: {
                                                        ...PassportDateOfExpiry,
                                                        value,
                                                        refresh: !PassportDateOfExpiry.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Quốc gia - CountryID */}
                            {CountryID.visibleConfig && CountryID.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={CountryID.label} />

                                        {/* valid CountryID */}
                                        {fieldValid?.CountryID?.Nullable === false && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerQuickly
                                            autoBind={true}
                                            // dataLocal={CountryID.data}
                                            api={{
                                                urlApi: '[URI_HR]/Cat_GetData/GetMultiCountry',
                                                type: 'E_POST',
                                                dataBody: {}
                                            }}
                                            refresh={CountryID.refresh}
                                            textField="CountryCodeName"
                                            valueField="ID"
                                            filter={true}
                                            filterLocal={true}
                                            autoFilter={true}
                                            filterParams="CountryCodeName"
                                            value={CountryID.value}
                                            disable={CountryID.disable}
                                            onFinish={item =>
                                                this.setState({
                                                    CountryID: {
                                                        ...CountryID,
                                                        value: item,
                                                        refresh: !CountryID.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Nơi cấp hộ chiếu (TextInput) - PassportPlaceOfIssue */}
                            {PassportPlaceOfIssue.visibleConfig && PassportPlaceOfIssue.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={PassportPlaceOfIssue.label}
                                        />

                                        {/* valid ProfileID */}
                                        {fieldValid?.PassportPlaceOfIssue?.Nullable === false && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={PassportPlaceOfIssue.disable}
                                            refresh={PassportPlaceOfIssue.refresh}
                                            value={PassportPlaceOfIssue.value}
                                            onChangeText={text =>
                                                this.setState({
                                                    PassportPlaceOfIssue: {
                                                        ...PassportPlaceOfIssue,
                                                        value: text,
                                                        refresh: !PassportPlaceOfIssue.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Nơi cấp hộ chiếu (VnrPickerQuickly)  - PassportPlaceNewID */}
                            {PassportPlaceNewID.visibleConfig && PassportPlaceNewID.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={PassportPlaceNewID.label}
                                        />

                                        {/* valid PassportPlaceNewID */}
                                        {fieldValid?.PassportPlaceNewID?.Nullable === false && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrPickerQuickly
                                            autoBind={true}
                                            // dataLocal={PassportPlaceNewID.data}
                                            api={{
                                                urlApi: '[URI_HR]/Cat_GetData/GetMultiPassportIssuePlace',
                                                type: 'E_POST',
                                                dataBody: {
                                                    text: '',
                                                    filter: [
                                                        {
                                                            logic: 'and'
                                                        }
                                                    ]
                                                }
                                            }}
                                            refresh={PassportPlaceNewID.refresh}
                                            textField="PassportIssuePlaceNameCodeName"
                                            valueField="ID"
                                            filter={true}
                                            filterLocal={true}
                                            autoFilter={true}
                                            filterParams="PassportIssuePlaceNameCodeName"
                                            value={PassportPlaceNewID.value}
                                            disable={PassportPlaceNewID.disable}
                                            onFinish={item =>
                                                this.setState({
                                                    PassportPlaceNewID: {
                                                        ...PassportPlaceNewID,
                                                        value: item,
                                                        refresh: !PassportPlaceNewID.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Số ngày cư trú - NoOfDaysOfResidence */}
                            {NoOfDaysOfResidence.visibleConfig && NoOfDaysOfResidence.visible && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={NoOfDaysOfResidence.label}
                                        />

                                        {/* valid NoOfDaysOfResidence */}
                                        {fieldValid?.NoOfDaysOfResidence?.Nullable === false && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>

                                    <View style={viewControl}>
                                        <VnrTextInput
                                            disable={NoOfDaysOfResidence.disable}
                                            refresh={NoOfDaysOfResidence.refresh}
                                            value={
                                                NoOfDaysOfResidence.value && !isNaN(NoOfDaysOfResidence.value)
                                                    ? `${NoOfDaysOfResidence.value}`
                                                    : null
                                            }
                                            keyboardType={'numeric'}
                                            charType={'int'}
                                            returnKeyType={'done'}
                                            onChangeText={text => {
                                                this.setState({
                                                    NoOfDaysOfResidence: {
                                                        ...NoOfDaysOfResidence,
                                                        value: text,
                                                        refresh: !NoOfDaysOfResidence.refresh
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Tập tin đính kèm - Attachment */}
                            {Attachment.visible && Attachment.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText
                                            style={[styleSheets.text, textLableInfo]}
                                            i18nKey={'HRM_Category_LevelAgency_Attachment'}
                                        />
                                        {/* valid Attachment */}
                                        {fieldValid?.Attachment?.Nullable === false && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
                                    </View>
                                    <View style={viewControl}>
                                        <VnrAttachFile
                                            //disable={Attachment.disable}
                                            refresh={Attachment.refresh}
                                            value={Attachment.value}
                                            multiFile={true}
                                            uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                            onFinish={file => {
                                                this.setState({
                                                    Attachment: {
                                                        ...Attachment,
                                                        value: file
                                                    }
                                                });
                                            }}
                                        />
                                    </View>
                                </View>
                            )}

                            {/* Ghi chú - Note*/}
                            {Note.visible && Note.visibleConfig && (
                                <View style={contentViewControl}>
                                    <View style={viewLable}>
                                        <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Note.label} />

                                        {/* valid Note */}
                                        {fieldValid?.Note?.Nullable === false && (
                                            <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                        )}
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
                                                        value: text
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            )}
                        </View>
                    </KeyboardAwareScrollView>

                    {/* bottom button close, confirm */}
                    <ListButtonSave listActions={listActions} />
                </View>
            </SafeAreaView>
        );
    }
}
