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
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import HttpService from '../../../../../utils/HttpService';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import moment from 'moment';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { IconPublish } from '../../../../../constants/Icons';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import VnrAutoComplete from '../../../../../components/VnrAutoComplete/VnrAutoComplete';
import { LanguageLevelBusinessFunction } from './LanguageLevelBusinessFunction';

let enumName = null,
    profileInfo = null;

export default class LanguageLevelAddOrEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            ID: null,
            Profile: {
                label: 'HRM_Attendance_Overtime_ProfileName',
                ID: null,
                ProfileName: '',
                disable: true
            },
            SpecialTypeID: {
                label: 'HRM_HR_Language_SpecialTypeID',
                api: {
                    urlApi: '[URI_HR]/Hre_GetData/GetMultiLanguageType',
                    type: 'E_GET'
                },
                valueField: 'ID',
                textField: 'NameEntityName',
                data: [],
                disable: false,
                refresh: false,
                value: null,
                visibleConfig: true,
                visible: true
            },
            SpecialSkillID: {
                label: 'HRM_HR_Language_SpecialSkillID',
                api: {
                    urlApi: '[URI_HR]/Hre_GetData/GetMultiLanguageSkill',
                    type: 'E_GET'
                },
                valueField: 'ID',
                textField: 'NameEntityName',
                data: [],
                disable: false,
                refresh: false,
                value: null,
                visibleConfig: true,
                visible: true
            },
            SpecialLevelID: {
                label: 'HRM_HR_Language_SpecialLevelID',
                api: {
                    urlApi: '[URI_HR]/Hre_GetData/GetMultiLanguageLevel',
                    type: 'E_GET'
                },
                valueField: 'ID',
                textField: 'NameEntityName',
                data: [],
                disable: false,
                refresh: false,
                value: null,
                visibleConfig: true,
                visible: true
            },
            RatingOrScore: {
                label: 'HRM_HR_Language_RatingOrScore',
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            },
            IsSkillMain: {
                label: 'HRM_HR_Computing_IsSkillMain',
                disable: false,
                refresh: false,
                value: false,
                visibleConfig: true,
                visible: true
            },
            Listening: {
                label: 'HRM_Hre_ProfileLanguageLevel_Listening',
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            },
            Speaking: {
                label: 'HRM_Hre_ProfileLanguageLevel_Speaking',
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            },
            Reading: {
                label: 'HRM_Hre_ProfileLanguageLevel_Reading',
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            },
            Writing: {
                label: 'HRM_Hre_ProfileLanguageLevel_Writing',
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            },
            TrainingPlace: {
                label: 'HRM_HR_SoftSkill_TrainingPlace',
                data: [],
                api: {
                    urlApi: '[URI_HR]/Cat_GetData/GetMultiTrainingPlace',
                    type: 'E_GET'
                },
                valueField: 'TrainingPlace',
                textField: 'TrainingPlace',
                disable: false,
                value: null,
                refresh: false,
                visibleConfig: true,
                visible: true
            },
            TrainingAddress: {
                label: 'HRM_HR_Qualification_TrainingAddress',
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            },
            DateStart: {
                label: 'HRM_HR_AppendixContract_DateStartAppendixContract',
                value: null,
                refresh: false,
                visibleConfig: true,
                visible: true,
                disable: false
            },
            DateEnd: {
                label: 'HRM_HR_AppendixContract_DateEndAppendixContract',
                value: null,
                refresh: false,
                visibleConfig: true,
                visible: true,
                disable: false
            },
            DateOfIssue: {
                label: 'HRM_Tra_TraineeCertificate_DateCertificate',
                value: null,
                refresh: false,
                visibleConfig: true,
                visible: true,
                disable: false
            },
            DayIssue: {
                label: 'HRM_Tra_TraineeCertificate_DateCertificate',
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            },
            MonthIssue: {
                label: 'HRM_Tra_TraineeCertificate_DateCertificate',
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            },
            YearIssue: {
                label: 'HRM_Tra_TraineeCertificate_DateCertificate',
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            },
            DateExpired: {
                label: 'HRM_System_User_DateExpiredPass',
                value: null,
                refresh: false,
                visibleConfig: true,
                visible: true,
                disable: false
            },
            DayExpired: {
                label: 'HRM_System_User_DateExpiredPass',
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            },
            MonthExpired: {
                label: 'HRM_System_User_DateExpiredPass',
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            },
            YearExpired: {
                label: 'HRM_System_User_DateExpiredPass',
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            },
            FileAttach: {
                label: 'HRM_Category_JobTitle_FileAttachment',
                visible: true,
                visibleConfig: true,
                disable: false,
                refresh: false,
                value: null
            },
            Comment: {
                label: 'HRM_Category_Subject_Notes',
                disable: false,
                value: '',
                refresh: false,
                visibleConfig: true,
                visible: true
            },
            fieldValid: {}
        };

        props.navigation.setParams({
            title:
                props.navigation.state.params && props.navigation.state.params.record
                    ? 'HRM_Hre_ProfileLanguageLevel_Update_Title'
                    : 'HRM_Hre_ProfileLanguageLevel_Create_Title'
        });

        //biến trạng thái
        this.isModify = false;
        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;
    }

    //#region [khởi tạo - lấy các dữ liệu cho control, lấy giá trị mặc đinh]

    //promise get config valid
    getConfigValid = tblName => {
        return HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + tblName);
    };

    componentDidMount() {
        //get config validate
        VnrLoadingSevices.show();
        this.getConfigValid('Hre_ProfileLanguageLevel').then(res => {
            VnrLoadingSevices.hide();
            if (res) {
                try {
                    //map field hidden by config
                    const _configField =
                        ConfigField && ConfigField.value['LanguageLevelAddOrEdit']
                            ? ConfigField.value['LanguageLevelAddOrEdit']['Hidden']
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

                        let { record } = this.props.navigation.state.params;

                        //get config khi đăng ký
                        if (!record) {
                            this.initData();
                        } else {
                            this.isModify = true;
                            this.getRecordAndConfigByID(record);
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
            _profile = {
                ID: profileInfo[E_ProfileID],
                ProfileName: profileInfo[E_FullName]
            };

        let nextState = {
            Profile: _profile
        };

        this.setState(nextState);
    };

    handleSetState = (record) => {
        const {
                Profile,
                SpecialTypeID,
                SpecialSkillID,
                SpecialLevelID,
                RatingOrScore,
                IsSkillMain,
                Listening,
                Speaking,
                Reading,
                Writing,
                TrainingPlace,
                TrainingAddress,
                DateStart,
                DateEnd,
                DateOfIssue,
                DayIssue,
                MonthIssue,
                YearIssue,
                DateExpired,
                DayExpired,
                MonthExpired,
                YearExpired,
                FileAttach,
                Comment
            } = this.state,
            item = record;

        let nextState = {
            ID: record.ID,
            Profile: {
                ...Profile,
                ID: item.ProfileID,
                ProfileName: item.ProfileName
            },
            SpecialTypeID: {
                ...SpecialTypeID,
                value: item.SpecialTypeID ? { ID: item.SpecialTypeID, NameEntityName: item.SpecialTypeName } : null,
                refresh: !SpecialTypeID.refresh
            },
            SpecialSkillID: {
                ...SpecialSkillID,
                value: item.SpecialSkillID ? { ID: item.SpecialSkillID, NameEntityName: item.SpecialSkillName } : null,
                refresh: !SpecialSkillID.refresh
            },
            SpecialLevelID: {
                ...SpecialLevelID,
                value: item.SpecialLevelID ? { ID: item.SpecialLevelID, NameEntityName: item.SpecialLevelName } : null,
                refresh: !SpecialLevelID.refresh
            },
            RatingOrScore: {
                ...RatingOrScore,
                value: item.RatingOrScore,
                refresh: !RatingOrScore.refresh
            },
            IsSkillMain: {
                ...IsSkillMain,
                value: item.IsSkillMain == true ? true : false,
                refresh: !IsSkillMain.refresh
            },
            Listening: {
                ...Listening,
                value: item.Listening,
                refresh: !Listening.refresh
            },
            Speaking: {
                ...Speaking,
                value: item.Speaking,
                refresh: !Speaking.refresh
            },
            Reading: {
                ...Reading,
                value: item.Reading,
                refresh: !Reading.refresh
            },
            Writing: {
                ...Writing,
                value: item.Writing,
                refresh: !Writing.refresh
            },
            TrainingPlace: {
                ...TrainingPlace,
                value: item.TrainingPlace
                    ? { TrainingPlace: item.TrainingPlace }
                    : null,
                refresh: !TrainingPlace.refresh
            },
            TrainingAddress: {
                ...TrainingAddress,
                value: item.TrainingAddress,
                refresh: !TrainingAddress.refresh
            },
            DateStart: {
                ...DateStart,
                value: item.DateStart,
                refresh: !DateStart.refresh
            },
            DateEnd: {
                ...DateEnd,
                value: item.DateEnd,
                refresh: !DateEnd.refresh
            },
            DateOfIssue: {
                ...DateOfIssue,
                value: item.DateOfIssue,
                refresh: !DateOfIssue.refresh
            },
            DayIssue: {
                ...DayIssue,
                value: item.DayIssue,
                refresh: !DayIssue.refresh
            },
            MonthIssue: {
                ...MonthIssue,
                value: item.MonthIssue,
                refresh: !MonthIssue.refresh
            },
            YearIssue: {
                ...YearIssue,
                value: item.YearIssue,
                refresh: !YearIssue.refresh
            },
            DateExpired: {
                ...DateExpired,
                value: item.DateExpired,
                refresh: !DateExpired.refresh
            },
            DayExpired: {
                ...DayExpired,
                value: item.DayExpired,
                refresh: !DayExpired.refresh
            },
            MonthExpired: {
                ...MonthExpired,
                value: item.MonthExpired,
                refresh: !MonthExpired.refresh
            },
            YearExpired: {
                ...YearExpired,
                value: item.YearExpired,
                refresh: !YearExpired.refresh
            },
            FileAttach: {
                ...FileAttach,
                value: item.lstFileAttach,
                refresh: !FileAttach.refresh
            },
            Comment: {
                ...Comment,
                value: item.Comment,
                refresh: !Comment.refresh
            }
        };

        this.setState(nextState);
    };

    getRecordAndConfigByID = record => {
        this.handleSetState(record);
    };
    //#endregion

    //#region [event component]

    //change DateOfIssue
    onChangeDateOfIssue = item => {
        const { DateOfIssue, DayIssue, MonthIssue, YearIssue } = this.state;

        let nextState = {
            DateOfIssue: {
                ...DateOfIssue,
                value: item,
                refresh: !DateOfIssue.refresh
            }
        };

        if (item) {
            let _moment = moment(item),
                _day = _moment.format('D'),
                _month = _moment.format('M'),
                _year = _moment.format('YYYY');

            nextState = {
                ...nextState,
                DayIssue: {
                    ...DayIssue,
                    value: _day,
                    refresh: !DayIssue.refresh
                },
                MonthIssue: {
                    ...MonthIssue,
                    value: _month,
                    refresh: !MonthIssue.refresh
                },
                YearIssue: {
                    ...YearIssue,
                    value: _year,
                    refresh: !YearIssue.refresh
                }
            };
        }

        this.setState(nextState);
    };

    //change DateExpired
    onChangeDateExpired = item => {
        const { DateExpired, DayExpired, MonthExpired, YearExpired } = this.state;

        let nextState = {
            DateExpired: {
                ...DateExpired,
                value: item,
                refresh: !DateExpired.refresh
            }
        };

        if (item) {
            let _moment = moment(item),
                _day = _moment.format('D'),
                _month = _moment.format('M'),
                _year = _moment.format('YYYY');

            nextState = {
                ...nextState,
                DayExpired: {
                    ...DayExpired,
                    value: _day,
                    refresh: !DayExpired.refresh
                },
                MonthExpired: {
                    ...MonthExpired,
                    value: _month,
                    refresh: !MonthExpired.refresh
                },
                YearExpired: {
                    ...YearExpired,
                    value: _year,
                    refresh: !YearExpired.refresh
                }
            };
        }

        this.setState(nextState);
    };
    //#endregion

    //#region [Lưu]
    onSave = () => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        const {
                ID,
                Profile,
                SpecialTypeID,
                SpecialSkillID,
                SpecialLevelID,
                RatingOrScore,
                IsSkillMain,
                Listening,
                Speaking,
                Reading,
                Writing,
                TrainingPlace,
                TrainingAddress,
                DateStart,
                DateEnd,
                DateOfIssue,
                DayIssue,
                MonthIssue,
                YearIssue,
                DateExpired,
                DayExpired,
                MonthExpired,
                YearExpired,
                FileAttach,
                Comment
            } = this.state,
            { languageApp } = dataVnrStorage;

        let params = {
            Comment: Comment.value,
            DateEnd: DateEnd.value ? moment(DateEnd.value).format('YYYY-MM-DD HH:mm') : null,
            DateExpired: DateExpired.value ? moment(DateExpired.value).format('YYYY-MM-DD HH:mm') : null,
            DateOfIssue: DateOfIssue.value ? moment(DateOfIssue.value).format('YYYY-MM-DD HH:mm') : null,
            DateStart: DateStart.value ? moment(DateStart.value).format('YYYY-MM-DD HH:mm') : null,
            DayExpired: DayExpired.value,
            DayIssue: DayIssue.value,
            FileAttach: FileAttach.value ? FileAttach.value.map(item => item.fileName).join(',') : null,
            IsPortal: true,
            IsSkillMain: IsSkillMain.value,
            KeyCode: languageApp,
            Listening: Listening.value,
            MonthExpired: MonthExpired.value,
            MonthIssue: MonthIssue.value,
            ProfileID: Profile.ID,
            RatingOrScore: RatingOrScore.value,
            Reading: Reading.value,
            Speaking: Speaking.value,
            SpecialLevelID: SpecialLevelID.value ? SpecialLevelID.value.ID : null,
            SpecialSkillID: SpecialSkillID.value ? SpecialSkillID.value.ID : null,
            SpecialTypeID: SpecialTypeID.value ? SpecialTypeID.value.ID : null,
            TrainingAddress: TrainingAddress.value,
            TrainingPlace: TrainingPlace.value ? TrainingPlace.value.TrainingPlace : null,
            UserID: Profile.ID,
            UserSubmit: Profile.ID,
            Writing: Writing.value,
            YearExpired: YearExpired.value,
            YearIssue: YearIssue.value
        };

        if (ID) {
            params = {
                ...params,
                ID
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Hre_GetData/SaveProfileLanguageLevelRequestInfo', params).then(data => {
            VnrLoadingSevices.hide();

            try {
                if (data.ActionStatus && data.ActionStatus.split('|')[0] == 'InValid') {
                    let _mess = data.ActionStatus.split('|')[1];
                    ToasterSevice.showWarning(_mess);

                    //xử lý lại event Save
                    this.isProcessing = false;
                } else {
                    ToasterSevice.showSuccess(data.ActionStatus);

                    const { reload, screenName } = this.props.navigation.state.params;
                    if (reload && typeof reload == 'function') {
                        reload();
                    }

                    if (this.isModify) {
                        // Nếu Edit ở màn hình đã xác nhận thì reload lại màn hình danh sách chỉnh sửa
                        if (
                            screenName == ScreenName.LanguageLevelConfirmed ||
                            screenName == ScreenName.LanguageLevelEdit
                        ) {
                            LanguageLevelBusinessFunction.checkForLoadEditDelete[ScreenName.LanguageLevelEdit] = true;
                            DrawerServices.navigate('LanguageLevelEdit');
                        } else {
                            DrawerServices.navigate(ScreenName.LanguageLevelWaitConfirm);
                        }
                    } else {
                        LanguageLevelBusinessFunction.checkForLoadEditDelete[
                            ScreenName.LanguageLevelWaitConfirm
                        ] = true;
                        DrawerServices.navigate('LanguageLevelWaitConfirm');
                    }
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };
    //#endregion

    render() {
        const {
            SpecialTypeID,
            SpecialSkillID,
            SpecialLevelID,
            RatingOrScore,
            IsSkillMain,
            Listening,
            Speaking,
            Reading,
            Writing,
            TrainingPlace,
            TrainingAddress,
            DateStart,
            DateEnd,
            DateOfIssue,
            DateExpired,
            FileAttach,
            Comment,
            fieldValid
        } = this.state;

        const {
            textLableInfo,
            contentViewControl,
            viewLable,
            viewControl,
            viewInputMultiline
        } = stylesListPickerControl;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={{ ...CustomStyleSheet.flexGrow(1), ...CustomStyleSheet.paddingTop(10) }}
                        ref={ref => (this.scrollViewRef = ref)}
                    >
                        {/* SpecialTypeID */}
                        {SpecialTypeID.visible && SpecialTypeID.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={SpecialTypeID.label} />

                                    {/* valid SpecialTypeID */}
                                    {fieldValid.SpecialTypeID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={SpecialTypeID.api}
                                        refresh={SpecialTypeID.refresh}
                                        textField={SpecialTypeID.textField}
                                        valueField={SpecialTypeID.valueField}
                                        filter={true}
                                        value={SpecialTypeID.value}
                                        filterServer={false}
                                        autoFilter={true}
                                        disable={SpecialTypeID.disable}
                                        onFinish={item =>
                                            this.setState({
                                                SpecialTypeID: {
                                                    ...SpecialTypeID,
                                                    value: item,
                                                    refresh: !SpecialTypeID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* SpecialSkillID */}
                        {SpecialSkillID.visible && SpecialSkillID.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={SpecialSkillID.label} />

                                    {/* valid SpecialSkillID */}
                                    {fieldValid.SpecialSkillID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={SpecialSkillID.api}
                                        refresh={SpecialSkillID.refresh}
                                        textField={SpecialSkillID.textField}
                                        valueField={SpecialSkillID.valueField}
                                        filter={true}
                                        value={SpecialSkillID.value}
                                        filterServer={true}
                                        autoFilter={false}
                                        filterParams="text"
                                        disable={SpecialSkillID.disable}
                                        onFinish={item =>
                                            this.setState({
                                                SpecialSkillID: {
                                                    ...SpecialSkillID,
                                                    value: item,
                                                    refresh: !SpecialSkillID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* SpecialLevelID */}
                        {SpecialLevelID.visible && SpecialLevelID.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={SpecialLevelID.label} />

                                    {/* valid SpecialLevelID */}
                                    {fieldValid.SpecialLevelID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={SpecialLevelID.api}
                                        refresh={SpecialLevelID.refresh}
                                        textField={SpecialLevelID.textField}
                                        valueField={SpecialLevelID.valueField}
                                        filter={true}
                                        value={SpecialLevelID.value}
                                        filterServer={true}
                                        autoFilter={true}
                                        filterParams="text"
                                        disable={SpecialLevelID.disable}
                                        onFinish={item =>
                                            this.setState({
                                                SpecialLevelID: {
                                                    ...SpecialLevelID,
                                                    value: item,
                                                    refresh: !SpecialLevelID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* RatingOrScore */}
                        {RatingOrScore.visibleConfig && RatingOrScore.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={RatingOrScore.label} />
                                    {fieldValid.RatingOrScore && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={RatingOrScore.disable}
                                        refresh={RatingOrScore.refresh}
                                        value={RatingOrScore.value}
                                        multiline={false}
                                        onChangeText={text =>
                                            this.setState({
                                                RatingOrScore: {
                                                    ...RatingOrScore,
                                                    value: text,
                                                    refresh: !RatingOrScore.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* IsSkillMain */}
                        <View style={styles.styListBtnTypePregnancy}>
                            {IsSkillMain.visibleConfig && IsSkillMain.visible && (
                                <TouchableOpacity
                                    style={[
                                        styles.styBtnTypePregnancy,
                                        IsSkillMain.value == true && styles.styBtnTypePregnancyActive
                                    ]}
                                    onPress={() =>
                                        this.setState({
                                            IsSkillMain: {
                                                ...IsSkillMain,
                                                value: !IsSkillMain.value,
                                                refresh: !IsSkillMain.refresh
                                            }
                                        })
                                    }
                                >
                                    <VnrText
                                        style={[
                                            styleSheets.text,
                                            IsSkillMain.value == true && styles.styBtnTypePregnancyTextActive
                                        ]}
                                        i18nKey={IsSkillMain.label}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>

                        {/* DateStart */}
                        {DateStart.visibleConfig && DateStart.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DateStart.label} />

                                    {fieldValid.DateStart && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={DateStart.value}
                                        refresh={DateStart.refresh}
                                        type={'date'}
                                        onFinish={value =>
                                            this.setState({
                                                DateStart: {
                                                    ...DateStart,
                                                    value,
                                                    refresh: !DateStart.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* DateEnd */}
                        {DateEnd.visibleConfig && DateEnd.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DateEnd.label} />

                                    {fieldValid.DateEnd && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={DateEnd.value}
                                        refresh={DateEnd.refresh}
                                        type={'date'}
                                        onFinish={value =>
                                            this.setState({
                                                DateEnd: {
                                                    ...DateEnd,
                                                    value,
                                                    refresh: !DateEnd.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* DateOfIssue */}
                        {DateOfIssue.visibleConfig && DateOfIssue.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DateOfIssue.label} />

                                    {fieldValid.DateOfIssue && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={DateOfIssue.value}
                                        refresh={DateOfIssue.refresh}
                                        type={'date'}
                                        onFinish={value => this.onChangeDateOfIssue(value)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* DateExpired */}
                        {DateExpired.visibleConfig && DateExpired.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DateExpired.label} />

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

                        {/* Listening */}
                        {Listening.visibleConfig && Listening.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Listening.label} />
                                    {fieldValid.Listening && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Listening.disable}
                                        refresh={Listening.refresh}
                                        value={Listening.value}
                                        multiline={false}
                                        onChangeText={text =>
                                            this.setState({
                                                Listening: {
                                                    ...Listening,
                                                    value: text,
                                                    refresh: !Listening.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Speaking */}
                        {Speaking.visibleConfig && Speaking.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Speaking.label} />
                                    {fieldValid.Speaking && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Speaking.disable}
                                        refresh={Speaking.refresh}
                                        value={Speaking.value}
                                        multiline={false}
                                        onChangeText={text =>
                                            this.setState({
                                                Speaking: {
                                                    ...Speaking,
                                                    value: text,
                                                    refresh: !Speaking.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Reading */}
                        {Reading.visibleConfig && Reading.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Reading.label} />
                                    {fieldValid.Reading && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Reading.disable}
                                        refresh={Reading.refresh}
                                        value={Reading.value}
                                        multiline={false}
                                        onChangeText={text =>
                                            this.setState({
                                                Reading: {
                                                    ...Reading,
                                                    value: text,
                                                    refresh: !Reading.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Writing */}
                        {Writing.visibleConfig && Writing.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Writing.label} />
                                    {fieldValid.Writing && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Writing.disable}
                                        refresh={Writing.refresh}
                                        value={Writing.value}
                                        multiline={false}
                                        onChangeText={text =>
                                            this.setState({
                                                Writing: {
                                                    ...Writing,
                                                    value: text,
                                                    refresh: !Writing.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* TrainingPlace */}
                        {TrainingPlace.visibleConfig && TrainingPlace.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={TrainingPlace.label} />
                                    {fieldValid.TrainingPlace && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrAutoComplete
                                        api={TrainingPlace.api}
                                        value={TrainingPlace.value}
                                        refresh={TrainingPlace.refresh}
                                        textField={TrainingPlace.textField}
                                        valueField={TrainingPlace.valueField}
                                        filter={true}
                                        filterServer={false}
                                        autoFilter={true}
                                        onFinish={item =>
                                            this.setState({
                                                TrainingPlace: {
                                                    ...TrainingPlace,
                                                    value: item,
                                                    refresh: !TrainingPlace.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* TrainingAddress */}
                        {TrainingAddress.visibleConfig && TrainingAddress.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={TrainingAddress.label}
                                    />
                                    {fieldValid.TrainingAddress && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={TrainingAddress.disable}
                                        refresh={TrainingAddress.refresh}
                                        value={TrainingAddress.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={text =>
                                            this.setState({
                                                TrainingAddress: {
                                                    ...TrainingAddress,
                                                    value: text,
                                                    refresh: !TrainingAddress.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* FileAttach */}
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

                        {/* Comment */}
                        {Comment.visibleConfig && Comment.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Comment.label} />
                                    {fieldValid.Comment && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Comment.disable}
                                        refresh={Comment.refresh}
                                        value={Comment.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={text =>
                                            this.setState({
                                                Comment: {
                                                    ...Comment,
                                                    value: text,
                                                    refresh: !Comment.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}
                    </KeyboardAwareScrollView>

                    <View style={styles.groupButton}>
                        <TouchableOpacity
                            onPress={() => this.onSave(this.props.navigation)}
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
    },
    styListBtnTypePregnancy: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginHorizontal: Size.defineSpace,
        justifyContent: 'space-between',
        marginVertical: Size.defineHalfSpace
    },
    styBtnTypePregnancy: {
        paddingHorizontal: Size.defineSpace * 0.8,
        paddingVertical: 5,
        backgroundColor: Colors.gray_3,
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 11
    },
    styBtnTypePregnancyActive: {
        backgroundColor: Colors.primary
    },
    styBtnTypePregnancyTextActive: {
        color: Colors.white,
        fontWeight: '500'
    }
});
