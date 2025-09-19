import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleSafeAreaView,
    Colors,
    stylesListPickerControl,
    styleValid,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import { translate } from '../../../../../i18n/translate';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import DrawerServices from '../../../../../utils/DrawerServices';
import HttpService from '../../../../../utils/HttpService';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import CheckBox from 'react-native-check-box';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { EnumIcon, EnumName, ScreenName } from '../../../../../assets/constant';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import VnrAutoComplete from '../../../../../components/VnrAutoComplete/VnrAutoComplete';
import moment from 'moment';
import { QualificationConfirmedBusinessFunction } from './qualificationConfirmed/QualificationConfirmedBusinessFunction';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import { AlertSevice } from '../../../../../components/Alert/Alert';

const initSateDefault = {
    ID: null,
    Profile: {},
    EducationLevelID: {
        disable: false,
        refresh: false,
        data: null,
        value: null,
        visibleConfig: true,
        visible: true
    },
    QualificationNewID: {
        disable: false,
        refresh: false,
        data: null,
        value: null,
        visibleConfig: true,
        visible: true
    },
    SpecialLevelID: {
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true,
        data: null
    },
    TrainingType: {
        disable: false,
        refresh: false,
        value: null,
        data: null,
        visibleConfig: true,
        visible: true
    },
    TypeOfEducation: {
        disable: false,
        refresh: false,
        data: null,
        value: null,
        visibleConfig: true,
        visible: true
    },
    FieldOfTraining: {
        disable: false,
        refresh: false,
        value: '',
        visibleConfig: true,
        data: null,
        visible: true
    },
    IsQualificationMain: {
        visible: true,
        visibleConfig: true,
        refresh: false,
        value: false,
        disable: false
    },
    TrainingPlace: {
        disable: false,
        refresh: false,
        data: null,
        value: '',
        visibleConfig: true,
        visible: true
    },
    TrainingAddress: {
        disable: false,
        refresh: false,
        value: '',
        visibleConfig: true,
        visible: true
    },
    DateStart: {
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    DateFinish: {
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    GraduationDate: {
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    CertificateName: {
        disable: false,
        refresh: false,
        value: '',
        visibleConfig: true,
        visible: true
    },
    Rank: {
        disable: false,
        refresh: false,
        value: '',
        visibleConfig: true,
        visible: true
    },
    DateExpired: {
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    FileAttachment: {
        disable: false,
        refresh: false,
        value: null,
        visibleConfig: true,
        visible: true
    },
    Comment: {
        disable: false,
        refresh: false,
        value: '',
        visibleConfig: true,
        visible: true
    },
    fieldValid: {
        // EducationLevelID: true
    }
};

export default class QualificationAddOrEdit extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            ...initSateDefault
        };

        this.isModify = false;
        this.profileInfo = dataVnrStorage && dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info : {};

        porps.navigation.setParams({
            title: porps.navigation.state.params.record ? 'HRM_HR_Qualification_Update' : 'HRM_HR_Qualification_AddNew'
        });
    }

    //#region [khởi tạo , lấy các dữ liệu cho control, lấy giá trị mặc đinh]
    //promise get config valid
    getConfigValid = tblName => {
        try {
            VnrLoadingSevices.show();
            HttpService.Get('[URI_HR]/Hre_GetDataV2/GetFieldInfoFileByTableNameKaizenVersion?tableName=' + tblName).then(
                res => {

                    if (res) {
                        try {
                            VnrLoadingSevices.hide();
                            //map field hidden by config
                            const _configField =
                                ConfigField && ConfigField.value['QualificationAddOrEdit']
                                    ? ConfigField.value['QualificationAddOrEdit']['Hidden']
                                    : [],
                                { E_ProfileID, E_FullName } = EnumName,
                                _profile = {
                                    ID: this.profileInfo[E_ProfileID],
                                    ProfileName: this.profileInfo[E_FullName]
                                };

                            let nextState = { fieldValid: res, Profile: _profile };
                            let tempConfig = {};

                            if (Array.isArray(res) && res.length > 0) {
                                res.map(item => {
                                    if (item?.FieldName && !item?.Nullable)
                                        tempConfig = {
                                            ...tempConfig,
                                            [item.FieldName]: {
                                                ...item
                                            }
                                        };
                                });

                                nextState = { ...nextState, fieldValid: tempConfig };
                            }

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
                                let { record } = this.props.navigation.state.params;

                                //get config khi đăng ký
                                if (!record) {
                                    // this.isRegisterHelp = false;
                                    // this.initData();
                                    this.getConfig();
                                } else {
                                    this.isModify = true;
                                    this.setRecordForModify(record);
                                }
                            });
                        } catch (error) {
                            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                        }
                    }
                }
            );
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    componentDidMount() {
        //get config validate
        this.getConfigValid('Hre_ProfileQualification');
    }

    refreshView = () => {
        this.props.navigation.setParams({ title: 'HRM_HR_Qualification_AddNew' });

        let resetState = {
            ...initSateDefault
        };
        this.setState(resetState, () => this.getConfigValid('Hre_ProfileQualification'));
    };

    getConfig = () => { };

    setRecordForModify = response => {
        try {
            const {
                EducationLevelID,
                QualificationNewID,
                SpecialLevelID,
                TrainingType,
                TypeOfEducation,
                FieldOfTraining,
                IsQualificationMain,
                TrainingPlace,
                TrainingAddress,
                DateStart,
                DateFinish,
                GraduationDate,
                CertificateName,
                Rank,
                DateExpired,
                FileAttachment,
                Comment
            } = this.state;

            let nextState = {
                ID: response.ID,
                // Profile: {
                //     ...Profile,
                //     ID: response.Profile ? response.Profile['ProfileID'] : null,
                //     ProfileName: response.Profile ? response.Profile['ProfileName'] : ''
                // },
                EducationLevelID: {
                    ...EducationLevelID,
                    refresh: !EducationLevelID.refresh,
                    value: response['EducationLevelID']
                        ? { ID: response['EducationLevelID'], NameEntityName: response['EducationLevelName'] }
                        : null
                },
                QualificationNewID: {
                    ...QualificationNewID,
                    refresh: !QualificationNewID.refresh,
                    value: response['QualificationNewID']
                        ? { ID: response['QualificationNewID'], QualificationName: response?.QualificationNewID }
                        : null
                },
                SpecialLevelID: {
                    ...SpecialLevelID,
                    refresh: !SpecialLevelID.refresh,
                    value: response['SpecialLevelID'] ? { ID: response['SpecialLevelID'] } : null
                },
                TrainingType: {
                    ...TrainingType,
                    refresh: !TrainingType.refresh,
                    value: response['TrainingType'] ? { Value: response['TrainingType'] } : null
                },
                TypeOfEducation: {
                    ...TypeOfEducation,
                    refresh: !TypeOfEducation.refresh,
                    value: response['TypeOfEducation'] ? { Value: response['TypeOfEducation'] } : null
                },
                FieldOfTraining: {
                    ...FieldOfTraining,
                    refresh: !FieldOfTraining.refresh,
                    value: response['FieldOfTraining'] ? { SubMajorName: response['FieldOfTraining'] } : null
                },
                IsQualificationMain: {
                    ...IsQualificationMain,
                    refresh: !IsQualificationMain.refresh,
                    value: response['IsQualificationMain'] ? response['IsQualificationMain'] : false
                },
                TrainingPlace: {
                    ...TrainingPlace,
                    refresh: !TrainingPlace.refresh,
                    value: response['TrainingPlace'] ? { TrainingPlaceName: response['TrainingPlace'] } : null
                },
                TrainingAddress: {
                    ...TrainingAddress,
                    refresh: !TrainingAddress.refresh,
                    value: response['TrainingAddress'] ? response['TrainingAddress'] : ''
                },
                DateStart: {
                    ...DateStart,
                    refresh: !DateStart.refresh,
                    value: response['DateStart'] ? moment(response['DateStart']).toDate() : null
                },
                DateFinish: {
                    ...DateFinish,
                    refresh: !DateFinish.refresh,
                    value: response['DateFinish'] ? moment(response['DateFinish']).toDate() : null
                },
                GraduationDate: {
                    ...GraduationDate,
                    refresh: !GraduationDate.refresh,
                    value: response['GraduationDate'] ? moment(response['GraduationDate']).toDate() : null
                },
                CertificateName: {
                    ...CertificateName,
                    refresh: !CertificateName.refresh,
                    value: response['CertificateName'] ? response['CertificateName'] : ''
                },
                Rank: {
                    ...Rank,
                    refresh: !Rank.refresh,
                    value: response['Rank'] ? response['Rank'] : ''
                },
                DateExpired: {
                    ...DateExpired,
                    refresh: !DateExpired.refresh,
                    value: response['DateExpired'] ? moment(response['DateExpired']).toDate() : null
                },
                Comment: {
                    ...Comment,
                    refresh: !Comment.refresh,
                    value: response['Comment'] ? response['Comment'] : ''
                },
                FileAttachment: {
                    ...FileAttachment,
                    value: response.FileAttachment ? response.FileAttachment : null,
                    refresh: !FileAttachment.refresh
                }
            };

            this.setState({ ...nextState });
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };
    //#endregion

    //change Trình độ học vấn - EducationLevelID
    onChangeEducationLevel = item => {
        const { EducationLevelID } = this.state;

        this.setState({
            EducationLevelID: {
                ...EducationLevelID,
                value: item,
                refresh: !EducationLevelID.refresh
            }
        });
    };

    // change Trình độ chuyên môn - EducationLevelID
    onChangeQualificationName = items => {
        const { QualificationNewID } = this.state;

        this.setState({
            QualificationNewID: {
                ...QualificationNewID,
                value: items,
                refresh: !QualificationNewID.refresh
            }
        });
    };

    // change Trình độ - SpecialLevelID
    onChangeSpecialLevel = items => {
        const { SpecialLevelID } = this.state;

        this.setState({
            SpecialLevelID: {
                ...SpecialLevelID,
                value: items,
                refresh: !SpecialLevelID.refresh
            }
        });
    };

    // change Hệ đào tạo - TrainingType
    onChangeTrainingType = items => {
        const { TrainingType } = this.state;

        this.setState({
            TrainingType: {
                ...TrainingType,
                value: items,
                refresh: !TrainingType.refresh
            }
        });
    };

    // change Hình thức đào tạo - TypeOfEducation
    onChangeTypeOfEducation = items => {
        const { TypeOfEducation } = this.state;

        this.setState({
            TypeOfEducation: {
                ...TypeOfEducation,
                value: items,
                refresh: !TypeOfEducation.refresh
            }
        });
    };

    // change Chuyên ngành - FieldOfTraining
    onChangeFieldOfTraining = items => {
        const { FieldOfTraining } = this.state;

        this.setState({
            FieldOfTraining: {
                ...FieldOfTraining,
                value: items,
                refresh: !FieldOfTraining.refresh
            }
        });
    };

    onChangeTrainingPlace = items => {
        const { TrainingPlace } = this.state;

        this.setState({
            TrainingPlace: {
                ...TrainingPlace,
                value: items,
                refresh: !TrainingPlace.refresh
            }
        });
    };

    onChangeDateStart = value => {
        const { DateStart } = this.state;

        this.setState({
            DateStart: {
                ...DateStart,
                value: value,
                refresh: !DateStart.refresh
            }
        });
    };

    onChangeDateFinish = value => {
        const { DateFinish } = this.state;

        this.setState({
            DateFinish: {
                ...DateFinish,
                value: value,
                refresh: !DateFinish.refresh
            }
        });
    };

    onChangeGraduationDate = value => {
        const { DateEnd } = this.state;

        this.setState({
            DateEnd: {
                ...DateEnd,
                value: value,
                refresh: !DateEnd.refresh
            }
        });
    };

    onChangeDateExpired = value => {
        const { DateExpired } = this.state;

        this.setState({
            DateExpired: {
                ...DateExpired,
                value: value,
                refresh: !DateExpired.refresh
            }
        });
    };

    save = (navigation, isCreate, isSend) => {
        const {
            ID,
            Profile,
            EducationLevelID,
            QualificationNewID,
            SpecialLevelID,
            TrainingType,
            TypeOfEducation,
            FieldOfTraining,
            IsQualificationMain,
            TrainingPlace,
            TrainingAddress,
            DateStart,
            DateFinish,
            GraduationDate,
            CertificateName,
            Rank,
            DateExpired,
            FileAttachment,
            Comment
        } = this.state;

        //moment(DateEndUnion.value).format('YYYY-MM-DD HH:mm:ss')
        let params = {
            ID,
            CertificateName: CertificateName.value ? CertificateName.value : null,
            Comment: Comment.value ? Comment.value : null,
            DateExpired: DateExpired.value ? moment(DateExpired.value).format('YYYY-MM-DD HH:mm:ss') : null,
            DateFinish: DateFinish.value ? moment(DateFinish.value).format('YYYY-MM-DD HH:mm:ss') : null,
            DateStart: DateStart.value ? moment(DateStart.value).format('YYYY-MM-DD HH:mm:ss') : null,
            //DateEnd: DateEnd.value ? moment(DateEnd.value).format('YYYY-MM-DD HH:mm:ss') : null,
            EducationLevelID: EducationLevelID.value ? EducationLevelID.value.ID : null,
            FieldOfTraining: FieldOfTraining.value ? FieldOfTraining.value.SubMajorName : null,
            FileAttach: FileAttachment.value ? FileAttachment.value.map(item => item.fileName).join(',') : null,
            GraduationDate: GraduationDate.value ? moment(GraduationDate.value).format('YYYY-MM-DD HH:mm:ss') : null,
            IsPortal: true,
            IsQualificationMain: IsQualificationMain.value ? IsQualificationMain.value : null,
            // ProfileID: "136a8e27-7bc2-4e09-b434-6367f49b9304"
            UserSubmit: Profile.ID,
            ProfileID: Profile.ID,
            QualificationNewID:
                QualificationNewID.value && QualificationNewID.value.ID ? QualificationNewID.value.ID : null,
            Rank: Rank.value ? Rank.value : null,
            SpecialLevelID: SpecialLevelID.value ? SpecialLevelID.value.ID : null,
            TrainingAddress: TrainingAddress.value ? TrainingAddress.value : null,
            TrainingPlace: TrainingPlace.value ? TrainingPlace.value.TrainingPlaceName : null,
            TrainingType: TrainingType.value ? TrainingType.value.Value : null,
            TypeOfEducation: TypeOfEducation.value ? TypeOfEducation.value.Value : null
        };

        // Send mail
        if (isSend) {
            params = {
                ...params,
                IsSubmitSave: true,
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
        HttpService.Post('[URI_HR]/api/Hre_ApprovedProfileQualification', params).then(data => {
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
                        onCancel: () => { },
                        onConfirm: () => {
                            this.isSaveContinue = true;
                            this.save();
                        }
                    });
                } else if (
                    data.ActionStatus != 'Success' &&
                    data.ActionStatus != translate('HRM_Common_CreateOrEdit_Success')
                ) {
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

                        QualificationConfirmedBusinessFunction.checkForLoadEditDelete[
                            ScreenName.QualificationWaitConfirm
                        ] = true;
                        DrawerServices.navigate(ScreenName.QualificationWaitConfirm);
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
            Profile,
            EducationLevelID,
            QualificationNewID,
            SpecialLevelID,
            TrainingType,
            TypeOfEducation,
            FieldOfTraining,
            IsQualificationMain,
            TrainingPlace,
            TrainingAddress,
            DateStart,
            DateFinish,
            GraduationDate,
            CertificateName,
            Rank,
            DateExpired,
            FileAttachment,
            Comment
        } = this.state;

        const {
            textLableInfo,
            contentViewControl,
            viewLable,
            viewControl,
            formDate_To_From,
            controlDate_from,
            controlDate_To
        } = stylesListPickerControl;

        //#region [Xử lý 3 nút lưu]
        const listActions = [];

        // if (PermissionForAppMobile && PermissionForAppMobile.value['New_Hre_Passport_btnSaveClose']
        //     && PermissionForAppMobile.value['New_Hre_Passport_btnSaveClose']['View']) {
        listActions.push({
            type: EnumName.E_SAVE_SENMAIL,
            title: translate('HRM_Common_SaveAndSendRequest'),
            onPress: () => this.onSaveAndSend(this.props.navigation)
        });
        // }

        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_ProfileQualify_BtnSaveClose'] &&
            PermissionForAppMobile.value['New_ProfileQualify_BtnSaveClose']['View']
        ) {
            listActions.push({
                type: EnumName.E_SAVE_CLOSE,
                title: translate('HRM_Common_SaveClose'),
                onPress: () => this.save(this.props.navigation)
            });
        }

        // if (PermissionForAppMobile && PermissionForAppMobile.value['New_Hre_Passport_BtnSaveNew']
        //     && PermissionForAppMobile.value['New_Hre_Passport_BtnSaveNew']['View']) {
        // listActions.push(
        //     {
        //         type: EnumName.E_SAVE_NEW,
        //         title: translate('HRM_Common_SaveNew'),
        //         onPress: () => this.onSaveAndCreate(this.props.navigation),
        //     }
        // );
        // }

        //#endregion

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView contentContainerStyle={CustomStyleSheet.flexGrow(1)}>
                        {/* Nhân viên đăng ký - Profile */}
                        <View style={contentViewControl}>
                            <View style={viewLable}>
                                <VnrText
                                    style={[styleSheets.text, textLableInfo]}
                                    i18nKey={'HRM_Attendance_Overtime_ProfileName'}
                                />

                                {/* valid ProfileID */}
                                {fieldValid.ProfileID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                            </View>
                            <View style={viewControl}>
                                <VnrTextInput disable={true} value={Profile.ProfileName} />
                            </View>
                        </View>

                        {/* Trình độ học vấn - EducationLevelID */}
                        {EducationLevelID.visibleConfig && EducationLevelID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_EducationLevel_NameEntityName'}
                                    />

                                    {fieldValid.EducationLevelID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        // dataLocal={EducationLevelID.data}
                                        autoBind={true}
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiEducationLevel',
                                            type: 'E_POST',
                                            dataBody: {}
                                        }}
                                        value={EducationLevelID.value}
                                        refresh={EducationLevelID.refresh}
                                        textField="NameEntityName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={false}
                                        autoFilter={true}
                                        onFinish={item => this.onChangeEducationLevel(item)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Trình độ chuyên môn - QualificationNewID */}
                        {QualificationNewID.visibleConfig && QualificationNewID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_HR_Qualification_QualificationName'}
                                    />

                                    {fieldValid.QualificationNewID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        autoBind={true}
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiQualification',
                                            type: 'E_POST',
                                            dataBody: {}
                                        }}
                                        value={QualificationNewID.value}
                                        refresh={QualificationNewID.refresh}
                                        textField="QualificationName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={false}
                                        autoFilter={true}
                                        onFinish={items => this.onChangeQualificationName(items)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Trình độ - SpecialLevelID */}
                        {SpecialLevelID.visibleConfig && SpecialLevelID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_HR_Common_Level'}
                                    />

                                    {fieldValid.SpecialLevelID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        autoBind={true}
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiQualificationLevel',
                                            type: 'E_POST',
                                            dataBody: {}
                                        }}
                                        value={SpecialLevelID.value}
                                        refresh={SpecialLevelID.refresh}
                                        textField="NameEntityName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={false}
                                        autoFilter={true}
                                        onFinish={items => this.onChangeSpecialLevel(items)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Hệ đào tạo - TrainingType */}
                        {TrainingType.visibleConfig && TrainingType.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'TrainingTypeView'} />

                                    {fieldValid.TrainingType && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        autoBind={true}
                                        api={{
                                            urlApi: '[URI_SYS]/Sys_GetData/GetEnum?text=TrainingType',
                                            type: 'E_POST',
                                            dataBody: {}
                                        }}
                                        value={TrainingType.value}
                                        refresh={TrainingType.refresh}
                                        textField="Text"
                                        valueField="Value"
                                        filter={true}
                                        filterServer={false}
                                        autoFilter={true}
                                        onFinish={items => this.onChangeTrainingType(items)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Hình thức đào tạo - TypeOfEducation */}
                        {TypeOfEducation.visibleConfig && TypeOfEducation.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'TypeOfEducation'} />

                                    {fieldValid.TypeOfEducation && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={{
                                            urlApi: '[URI_SYS]/Sys_GetData/GetEnum?text=TypeOfEducation',
                                            type: 'E_POST',
                                            dataBody: {}
                                        }}
                                        autoBind={true}
                                        value={TypeOfEducation.value}
                                        refresh={TypeOfEducation.refresh}
                                        textField="Text"
                                        valueField="Value"
                                        filter={true}
                                        filterServer={false}
                                        autoFilter={true}
                                        onFinish={items => this.onChangeTypeOfEducation(items)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Chuyên ngành - FieldOfTraining */}
                        {FieldOfTraining.visibleConfig && FieldOfTraining.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Cat_SubMajor_SubMajorName'}
                                    />

                                    {fieldValid.FieldOfTraining && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrAutoComplete
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiSubMajor',
                                            type: 'E_GET',
                                            dataBody: {}
                                        }}
                                        autoBind={true}
                                        value={FieldOfTraining.value}
                                        refresh={FieldOfTraining.refresh}
                                        textField="SubMajorName"
                                        valueField="SubMajorName"
                                        filterParams="SubMajorName"
                                        filter={true}
                                        filterServer={false}
                                        autoFilter={true}
                                        onFinish={items => this.onChangeFieldOfTraining(items)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Là chuyên môn chính - IsQualificationMain */}
                        {IsQualificationMain.visibleConfig && IsQualificationMain.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'IsQualificationMain'}
                                    />

                                    {fieldValid.IsQualificationMain && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <CheckBox
                                        checkBoxColor={Colors.primary}
                                        checkedCheckBoxColor={Colors.primary}
                                        isChecked={IsQualificationMain.value}
                                        disable={IsQualificationMain.disable}
                                        onClick={() =>
                                            this.setState({
                                                IsQualificationMain: {
                                                    ...IsQualificationMain,
                                                    value: !IsQualificationMain.value
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Đơn vị đào tạo - TrainingPlace */}
                        {TrainingPlace.visibleConfig && TrainingPlace.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_HR_Qualification_TrainingPlace'}
                                    />

                                    {fieldValid.TrainingPlace && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrAutoComplete
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiTrainingPlaceAutoComplete',
                                            type: 'E_GET',
                                            dataBody: {}
                                        }}
                                        autoBind={true}
                                        value={TrainingPlace.value}
                                        refresh={TrainingPlace.refresh}
                                        textField="TrainingPlaceName"
                                        valueField="TrainingPlaceName"
                                        filterParams="TrainingPlaceName"
                                        filter={true}
                                        filterServer={false}
                                        autoFilter={true}
                                        onFinish={items => this.onChangeTrainingPlace(items)}
                                    />
                                    {/* <VnrTextInput
                                        disable={TrainingPlace.disable}
                                        refresh={TrainingPlace.refresh}
                                        value={TrainingPlace.value}
                                        onChangeText={text =>
                                            this.setState({
                                                TrainingPlace: {
                                                    ...TrainingPlace,
                                                    value: text,
                                                },
                                            })
                                        }
                                    /> */}
                                </View>
                            </View>
                        )}

                        {/* Địa chỉ - TrainingAddress */}
                        {TrainingAddress.visibleConfig && TrainingAddress.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'HRM_HR_Address'} />

                                    {fieldValid.TrainingAddress && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        height={70}
                                        multiline={true}
                                        disable={TrainingAddress.disable}
                                        refresh={TrainingAddress.refresh}
                                        value={TrainingAddress.value}
                                        onChangeText={text =>
                                            this.setState({
                                                TrainingAddress: {
                                                    ...TrainingAddress,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Thời gian - DateStart, DateFinish */}
                        {DateStart.visibleConfig && DateStart.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Field_Train_DurationTime'}
                                    />

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
                                                type={'date'}
                                                onFinish={value => this.onChangeDateStart(value)}
                                            />
                                        </View>
                                        <View style={controlDate_To}>
                                            <VnrDate
                                                disable={DateFinish.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DateFinish.value}
                                                refresh={DateFinish.refresh}
                                                type={'date'}
                                                onFinish={value => this.onChangeDateFinish(value)}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Ngày tốt nghiệp - GraduationDate */}
                        {GraduationDate.visibleConfig && GraduationDate.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_HR_Qualification_GraduationDate'}
                                    />

                                    {fieldValid.GraduationDate && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={GraduationDate.value}
                                        refresh={GraduationDate.refresh}
                                        type={'date'}
                                        onFinish={value => this.onChangeGraduationDate(value)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Chứng chỉ - CertificateName */}
                        {CertificateName.visibleConfig && CertificateName.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Tra_Certificate_CertificateName'}
                                    />

                                    {fieldValid.CertificateName && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={CertificateName.disable}
                                        refresh={CertificateName.refresh}
                                        value={CertificateName.value}
                                        onChangeText={text =>
                                            this.setState({
                                                CertificateName: {
                                                    ...CertificateName,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Xếp loại - Rank */}
                        {Rank.visibleConfig && Rank.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_HR_Qualification_Rank'}
                                    />

                                    {fieldValid.Rank && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Rank.disable}
                                        refresh={Rank.refresh}
                                        value={Rank.value}
                                        onChangeText={text =>
                                            this.setState({
                                                Rank: {
                                                    ...Rank,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày hết hạn - DateExpired */}
                        {DateExpired.visibleConfig && DateExpired.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_QualifiedHistory_ExpiryDate'}
                                    />
                                    {fieldValid.DateExpired && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={DateExpired.value}
                                        refresh={DateExpired.refresh}
                                        type={'date'}
                                        onFinish={value => this.onChangeDateExpired(value)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Tập tin đính kèm - FileAttachment - IsCheckMedical */}
                        {FileAttachment.visibleConfig && FileAttachment.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Rec_JobVacancy_FileAttachment'}
                                    />
                                </View>
                                <View style={viewControl}>
                                    <VnrAttachFile
                                        disable={FileAttachment.disable}
                                        // value={[{ exr: 'sdsadsa' },
                                        // { "ext": ".doc", "fileName": "docssss.doc",
                                        //  "path": "http://192.168.1.58:6200//Uploads//doc.doc",
                                        //   "size": 19 }]}
                                        value={FileAttachment.value}
                                        multiFile={true}
                                        uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                        refresh={FileAttachment.refresh}
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

                        {/* Ghi chú - Comment */}
                        {Comment.visibleConfig && Comment.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_HR_Qualification_Comment'}
                                    />

                                    {fieldValid.Comment && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        height={70}
                                        multiline={true}
                                        disable={Comment.disable}
                                        refresh={Comment.refresh}
                                        value={Comment.value}
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
                    </KeyboardAwareScrollView>

                    {/* bottom button close, confirm */}
                    <ListButtonSave listActions={listActions} />
                </View>
            </SafeAreaView>
        );
    }
}
