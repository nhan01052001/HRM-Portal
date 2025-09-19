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
import { ComputerLevelConfirmedBusinessFunction } from './computerLevelConfirmed/ComputerLevelConfirmedBusinessFunction';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import { AlertSevice } from '../../../../../components/Alert/Alert';

const initSateDefault = {
    ID: null,
    Profile: {},
    SpecialTypeID: {
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
    IsSkillMain: {
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
    MainExpertise: {
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
    DateEnd: {
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    Grade: {
        disable: false,
        refresh: false,
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
    DateExpired: {
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    DateOfIssue: {
        value: null,
        refresh: false,
        disable: false,
        visibleConfig: true,
        visible: true
    },
    FileAttach: {
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
    fieldValid: {}
};
export default class ComputerLevelAddOrEdit extends Component {
    constructor(porps) {
        super(porps);
        this.state = initSateDefault;

        this.isModify = false;
        this.profileInfo = dataVnrStorage && dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info : {};

        porps.navigation.setParams({
            title: porps.navigation.state.params.record
                ? 'HRM_HR_ComputerLevel_PopUp_Edit_Title'
                : 'HRM_HR_ComputerLevel_PopUp_Create_Title'
        });
    }

    //#region [khởi tạo , lấy các dữ liệu cho control, lấy giá trị mặc đinh]
    //promise get config valid
    getConfigValid = (tblName) => {
        VnrLoadingSevices.show();
        HttpService.Get('[URI_HR]/Hre_GetDataV2/GetFieldInfoFileByTableNameKaizenVersion?tableName=' + tblName).then(
            res => {
                VnrLoadingSevices.hide();
                if (res) {
                    try {
                        //map field hidden by config
                        const _configField =
                            ConfigField && ConfigField.value['ComputerLevelAddOrEdit']
                                ? ConfigField.value['ComputerLevelAddOrEdit']['Hidden']
                                : [];
                        const { E_ProfileID, E_FullName } = EnumName,
                            _profile = { ID: this.profileInfo[E_ProfileID], ProfileName: this.profileInfo[E_FullName] };

                        let nextState = { Profile: _profile },
                            tempConfig = {};

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
    };

    componentDidMount() {
        //get config validate
        this.getConfigValid('Hre_ProfileComputingLevel');
    }

    refreshView = () => {
        this.props.navigation.setParams({ title: 'HRM_HR_ComputerLevel_PopUp_Create_Title' });

        let resetState = {
            ...initSateDefault
        };
        this.setState(resetState, () => this.getConfigValid('Hre_ProfileQualification'));
    };

    getConfig = () => {};

    setRecordForModify = response => {
        try {
            const {
                SpecialTypeID,
                SpecialLevelID,
                IsSkillMain,
                TrainingPlace,
                MainExpertise,
                DateStart,
                DateEnd,
                Grade,
                TrainingAddress,
                DateExpired,
                DateOfIssue,
                FileAttach,
                Comment
            } = this.state;
            let nextState = {
                ID: response.ID,
                // Profile: {
                //     ...Profile,
                //     ID: response.Profile ? response.Profile['ProfileID'] : null,
                //     ProfileName: response.Profile ? response.Profile['ProfileName'] : ''
                // },
                SpecialTypeID: {
                    ...SpecialTypeID,
                    refresh: !SpecialTypeID.refresh,
                    value: response['SpecialTypeID']
                        ? { ID: response['SpecialTypeID'], NameEntityName: response['ComputingType'] }
                        : null
                },
                SpecialLevelID: {
                    ...SpecialLevelID,
                    refresh: !SpecialLevelID.refresh,
                    value: response['SpecialLevelID']
                        ? { ID: response['SpecialLevelID'], NameEntityName: response['ComputingLevel'] }
                        : null
                },
                IsSkillMain: {
                    ...IsSkillMain,
                    refresh: !IsSkillMain.refresh,
                    value: response['IsSkillMain'] ? response['IsSkillMain'] : false
                },
                TrainingPlace: {
                    ...TrainingPlace,
                    refresh: !TrainingPlace.refresh,
                    value: response['TrainingPlace'] ? { TrainingPlaceName: response['TrainingPlace'] } : null
                },
                MainExpertise: {
                    ...MainExpertise,
                    refresh: !MainExpertise.refresh,
                    value: response['MainExpertise'] ? response['MainExpertise'] : ''
                },
                DateStart: {
                    ...DateStart,
                    refresh: !DateStart.refresh,
                    value: response['DateStart'] ? moment(response['DateStart']).toDate() : null
                },
                DateEnd: {
                    ...DateEnd,
                    refresh: !DateEnd.refresh,
                    value: response['DateEnd'] ? moment(response['DateEnd']).toDate() : null
                },
                Grade: {
                    ...Grade,
                    refresh: !Grade.refresh,
                    value: response['Grade'] ? response['Grade'] : ''
                },
                TrainingAddress: {
                    ...TrainingAddress,
                    refresh: !TrainingAddress.refresh,
                    value: response['TrainingAddress'] ? response['TrainingAddress'] : ''
                },
                DateExpired: {
                    ...DateExpired,
                    refresh: !DateExpired.refresh,
                    value: response['DateExpired'] ? moment(response['DateExpired']).toDate() : null
                },
                DateOfIssue: {
                    ...DateOfIssue,
                    refresh: !DateOfIssue.refresh,
                    value: response['DateOfIssue'] ? moment(response['DateOfIssue']).toDate() : null
                },
                Comment: {
                    ...Comment,
                    refresh: !Comment.refresh,
                    value: response['Comment'] ? response['Comment'] : ''
                },
                FileAttach: {
                    ...FileAttach,
                    value: response.lstFileAttach ? response.lstFileAttach : null,
                    refresh: !FileAttach.refresh
                }
            };

            this.setState({ ...nextState });
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };
    //#endregion

    //change Trình độ học vấn - SpecialTypeID
    onChangeEducationLevel = item => {
        const { SpecialTypeID } = this.state;

        this.setState({
            SpecialTypeID: {
                ...SpecialTypeID,
                value: item
            }
        });
    };

    // change Trình độ - SpecialLevelID
    onChangeSpecialLevel = items => {
        const { SpecialLevelID } = this.state;

        this.setState({
            SpecialLevelID: {
                ...SpecialLevelID,
                value: items
            }
        });
    };

    onChangeTrainingPlace = items => {
        const { TrainingPlace } = this.state;

        this.setState({
            TrainingPlace: {
                ...TrainingPlace,
                value: items
            }
        });
    };

    onChangeDateStart = value => {
        const { DateStart } = this.state;

        this.setState({
            DateStart: {
                ...DateStart,
                value: value
            }
        });
    };

    onChangeDateFinish = value => {
        const { DateEnd } = this.state;

        this.setState({
            DateEnd: {
                ...DateEnd,
                value: value
            }
        });
    };

    onChangeDateExpired = value => {
        const { DateExpired } = this.state;

        this.setState({
            DateExpired: {
                ...DateExpired,
                value: value
            }
        });
    };

    onChangeDateOfIssue = value => {
        const { DateOfIssue } = this.state;

        this.setState({
            DateOfIssue: {
                ...DateOfIssue,
                value: value,
                isRefresh: !DateOfIssue.refresh
            }
        });
    };

    save = (navigation, isCreate, isSend) => {
        const {
            ID,
            Profile,
            SpecialTypeID,
            SpecialLevelID,
            IsSkillMain,
            TrainingPlace,
            MainExpertise,
            DateStart,
            DateEnd,
            Grade,
            TrainingAddress,
            DateExpired,
            DateOfIssue,
            FileAttach,
            Comment
        } = this.state;

        //moment(DateEndUnion.value).format('YYYY-MM-DD HH:mm:ss')
        let params = {
            ID,
            Grade: Grade.value ? Grade.value : null,
            Comment: Comment.value ? Comment.value : null,
            DateExpired: DateExpired.value ? moment(DateExpired.value).format('YYYY-MM-DD HH:mm:ss') : null,
            DateOfIssue: DateOfIssue.value ? moment(DateOfIssue.value).format('YYYY-MM-DD HH:mm:ss') : null,
            DateEnd: DateEnd.value ? moment(DateEnd.value).format('YYYY-MM-DD HH:mm:ss') : null,
            DateStart: DateStart.value ? moment(DateStart.value).format('YYYY-MM-DD HH:mm:ss') : null,
            SpecialTypeID: SpecialTypeID.value ? SpecialTypeID.value.ID : null,
            FileAttach: FileAttach.value ? FileAttach.value.map(item => item.fileName).join(',') : null,
            IsPortal: true,
            IsSkillMain: IsSkillMain.value ? IsSkillMain.value : null,
            // ProfileID: "136a8e27-7bc2-4e09-b434-6367f49b9304"
            UserSubmit: Profile.ID,
            ProfileID: Profile.ID,
            TrainingAddress: TrainingAddress.value ? TrainingAddress.value : null,
            SpecialLevelID: SpecialLevelID.value ? SpecialLevelID.value.ID : null,
            MainExpertise: MainExpertise.value ? MainExpertise.value : null,
            TrainingPlace: TrainingPlace.value ? TrainingPlace.value.TrainingPlaceName : null
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
        HttpService.Post('[URI_HR]/api/Hre_ComputerLevel', params).then(data => {
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
                        const { reload } = navigation.state.params;
                        if (reload && typeof reload === 'function') {
                            reload();
                        }

                        ComputerLevelConfirmedBusinessFunction.checkForLoadEditDelete[
                            ScreenName.ComputerLevelWaitConfirm
                        ] = true;
                        DrawerServices.navigate(ScreenName.ComputerLevelWaitConfirm);
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
            SpecialTypeID,
            SpecialLevelID,
            IsSkillMain,
            TrainingPlace,
            MainExpertise,
            DateStart,
            DateEnd,
            Grade,
            TrainingAddress,
            DateExpired,
            DateOfIssue,
            FileAttach,
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
            PermissionForAppMobile.value['New_ProfileComputerLevel_BtnSaveClose'] &&
            PermissionForAppMobile.value['New_ProfileComputerLevel_BtnSaveClose']['View']
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
                        {/* Loại kỹ năng - SpecialTypeID */}
                        {SpecialTypeID.visibleConfig && SpecialTypeID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_HR_SoftSkill_SoftSkillType'}
                                    />

                                    {fieldValid.SpecialTypeID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        autoBind={true}
                                        api={{
                                            urlApi: '[URI_HR]/Hre_GetData/GetMultiComputingType',
                                            type: 'E_GET'
                                        }}
                                        filterParams="text"
                                        value={SpecialTypeID.value}
                                        refresh={SpecialTypeID.refresh}
                                        textField="NameEntityName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={true}
                                        autoFilter={true}
                                        onFinish={item => {
                                            this.setState({
                                                SpecialTypeID: {
                                                    ...SpecialTypeID,
                                                    value: item,
                                                    refresh: !SpecialTypeID.refresh
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Cấp bậc - SpecialLevelID */}
                        {SpecialLevelID.visibleConfig && SpecialLevelID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_HR_SoftSkill_SoftSkillLevel'}
                                    />

                                    {fieldValid.SpecialLevelID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        autoBind={true}
                                        api={{
                                            urlApi: '[URI_HR]/Hre_GetData/GetMultiComputingLevel',
                                            type: 'E_GET'
                                        }}
                                        filterParams="text"
                                        value={SpecialLevelID.value}
                                        refresh={SpecialLevelID.refresh}
                                        textField="NameEntityName"
                                        valueField="ID"
                                        filter={true}
                                        filterServer={true}
                                        autoFilter={true}
                                        onFinish={items => {
                                            this.setState({
                                                SpecialLevelID: {
                                                    ...SpecialLevelID,
                                                    value: items,
                                                    refresh: !SpecialLevelID.refresh
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Là kỹ năng chính - IsSkillMain */}
                        {IsSkillMain.visibleConfig && IsSkillMain.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'IsSkillMain'} />

                                    {fieldValid.IsSkillMain && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <CheckBox
                                        checkBoxColor={Colors.primary}
                                        checkedCheckBoxColor={Colors.primary}
                                        isChecked={IsSkillMain.value}
                                        disable={IsSkillMain.disable}
                                        onClick={() =>
                                            this.setState({
                                                IsSkillMain: {
                                                    ...IsSkillMain,
                                                    value: !IsSkillMain.value,
                                                    refresh: !IsSkillMain.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Chuyên môn chính - MainExpertise */}
                        {MainExpertise.visibleConfig && MainExpertise.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'MainExpertise'} />

                                    {fieldValid.MainExpertise && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        multiline={true}
                                        disable={MainExpertise.disable}
                                        refresh={MainExpertise.refresh}
                                        value={MainExpertise.value}
                                        onChangeText={text =>
                                            this.setState({
                                                MainExpertise: {
                                                    ...MainExpertise,
                                                    value: text,
                                                    refresh: !MainExpertise.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Xếp loại - Grade */}
                        {Grade.visibleConfig && Grade.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'Grade'} />

                                    {fieldValid.Grade && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Grade.disable}
                                        refresh={Grade.refresh}
                                        value={Grade.value}
                                        onChangeText={text =>
                                            this.setState({
                                                Grade: {
                                                    ...Grade,
                                                    value: text,
                                                    refresh: !Grade.refresh
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
                                        onFinish={items => {
                                            this.setState({
                                                TrainingPlace: {
                                                    ...TrainingPlace,
                                                    value: items,
                                                    refresh: !TrainingPlace.refresh
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Địa chỉ - TrainingAddress */}
                        {TrainingAddress.visibleConfig && TrainingAddress.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'Address'} />

                                    {fieldValid.TrainingAddress && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={TrainingAddress.disable}
                                        refresh={TrainingAddress.refresh}
                                        value={TrainingAddress.value}
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

                        {/* Thời gian - DateStart, DateEnd */}
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
                                                onFinish={value => {
                                                    this.setState({
                                                        DateStart: {
                                                            ...DateStart,
                                                            value: value,
                                                            refresh: !DateStart.refresh
                                                        }
                                                    });
                                                }}
                                            />
                                        </View>
                                        <View style={controlDate_To}>
                                            <VnrDate
                                                disable={DateEnd.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DateEnd.value}
                                                refresh={DateEnd.refresh}
                                                type={'date'}
                                                onFinish={value => {
                                                    this.setState({
                                                        DateEnd: {
                                                            ...DateEnd,
                                                            value: value,
                                                            refresh: !DateEnd.refresh
                                                        }
                                                    });
                                                }}
                                            />
                                        </View>
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Ngày cấp - DateOfIssue */}
                        {DateOfIssue.visibleConfig && DateOfIssue.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={'DateOfIssue'} />
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
                                        onFinish={value => {
                                            this.setState({
                                                DateOfIssue: {
                                                    ...DateOfIssue,
                                                    value: value,
                                                    refresh: !DateOfIssue.refresh
                                                }
                                            });
                                        }}
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
                                        onFinish={value => {
                                            this.setState({
                                                DateExpired: {
                                                    ...DateExpired,
                                                    value: value,
                                                    refresh: !DateExpired.refresh
                                                }
                                            });
                                        }}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Tập tin đính kèm - FileAttach - IsCheckMedical */}
                        {FileAttach.visibleConfig && FileAttach.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={'HRM_Hre_Violation_Attachment'}
                                    />
                                    {fieldValid.FileAttach && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrAttachFile
                                        disable={FileAttach.disable}
                                        // value={[{ exr: 'sdsadsa' },
                                        // { "ext": ".doc", "fileName": "docssss.doc",
                                        //  "path": "http://192.168.1.58:6200//Uploads//doc.doc",
                                        //   "size": 19 }]}
                                        value={FileAttach.value}
                                        multiFile={true}
                                        uri={'[URI_POR]/New_Home/saveFileFromApp'}
                                        refresh={FileAttach.refresh}
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
                                        multiline={true}
                                        disable={Comment.disable}
                                        refresh={Comment.refresh}
                                        value={Comment.value}
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

                    {/* bottom button close, confirm */}
                    <ListButtonSave listActions={listActions} />
                </View>
            </SafeAreaView>
        );
    }
}
