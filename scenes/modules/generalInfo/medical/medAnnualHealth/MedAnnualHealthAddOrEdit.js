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
    stylesModalPopupBottom,
    styleScreenDetail,
    styleButtonAddOrEdit
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
import { EnumName, EnumIcon, ScreenName } from '../../../../../assets/constant';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import VnrPickerQuickly from '../../../../../components/VnrPickerQuickly/VnrPickerQuickly';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { IconColse } from '../../../../../constants/Icons';
import VnrPickerMulti from '../../../../../components/VnrPickerMulti/VnrPickerMulti';
import { translate } from '../../../../../i18n/translate';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import Modal from 'react-native-modal';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ScrollView, TouchableWithoutFeedback } from 'react-native-gesture-handler';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';

let enumName = null,
    profileInfo = null;

const initSateDefault = {
    ID: null,
    Profile: {
        label: 'HRM_Attendance_Overtime_ProfileName',
        ID: null,
        ProfileName: '',
        disable: true
    },
    DiseaseID: {
        label: 'HRM_Medical_ImmunizationRecord_DiseaseName',
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true,
        disable: false
    },
    DateReceived: {
        label: 'HRM_Medical_AnnualHealth_DateReceived',
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true,
        disable: false
    },
    CutOffDurationID: {
        label: 'HRM_Medical_AnnualHealth_CutOffDurationName',
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true,
        disable: false
    },
    Cost: {
        label: 'HRM_Medical_AnnualHealth_Cost',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    CostUnitID: {
        label: 'HRM_Medical_AnnualHealth_Unit',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    HealthCheckGroup: {
        label: 'HRM_Medical_HealthCheckGroup',
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true,
        disable: false
    },
    AnnualHealthTimeID: {
        label: 'HRM_Medical_AnnualHealth_TimeTitle',
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true,
        disable: false
    },
    TypeResultHealthID: {
        label: 'HRM_Medical_AnnualHealth_TypeResultHealthName',
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true,
        disable: false
    },
    HeightTemp: {
        label: 'HRM_Medical_AnnualHealth_Height',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    WeightTemp: {
        label: 'HRM_Medical_AnnualHealth_Weight',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    BloodType: {
        label: 'AnnualHealthBloodType',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    BMITemp: {
        label: 'HRM_Medical_AnnualHealthSearch_BMI',
        disable: true,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    Result: {
        label: 'HRM_Medical_AnnualHealth_Result',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    Note: {
        label: 'HRM_Medical_AnnualHealth_Note',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    Diagnostic: {
        label: 'HRM_Medical_AnnualHealth_Diagnostic',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    MedicalAdvice: {
        label: 'HRM_Medical_AnnualHealth_MedicalAdvice',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    Status: {
        label: 'HRM_Medical_AnnualHealth_Status',
        disable: false,
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    FileAttachment: {
        label: 'HRM_Medical_AnnualHealth_FileAttachment',
        visible: true,
        visibleConfig: true,
        disable: true,
        refresh: false,
        value: null
    },
    fieldValid: {}
};

export default class MedAnnualHealthAddOrEdit extends Component {
    constructor(props) {
        super(props);

        this.state = initSateDefault;

        props.navigation.setParams({
            title:
                props.navigation.state.params && props.navigation.state.params.record
                    ? 'HRM_Medical_AnnualHealth_Update'
                    : 'HRM_Medical_AnnualHealth_Create'
        });

        this.setVariable();
    }

    //#region [khởi tạo - lấy các dữ liệu cho control, lấy giá trị mặc đinh]
    setVariable = () => {
        //biến trạng thái
        this.isModify = false;
        //check processing cho nhấn lưu nhiều lần
        this.isProcessing = false;
    };

    refreshView = () => {
        this.props.navigation.setParams({ title: 'HRM_Attendance_LateEarlyAllowed_Popup_Create' });
        this.setVariable();

        let resetState = {
            ...initSateDefault
        };
        this.setState(resetState, () => this.getConfigValid('Med_AnnualHealthPortal', true));
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
                        ConfigField && ConfigField.value['MedAnnualHealthAddOrEdit']
                            ? ConfigField.value['MedAnnualHealthAddOrEdit']['Hidden']
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
        this.getConfigValid('Med_AnnualHealthPortal');
    }

    initData = () => {
        const { E_ProfileID, E_FullName } = enumName,
            _profile = { ID: profileInfo[E_ProfileID], ProfileName: profileInfo[E_FullName] },
            { Profile } = this.state;

        let nextState = {
            Profile: {
                ...Profile,
                ..._profile
            }
        };
        debugger;
        // let readOnlyCtrlOT = this.readOnlyCtrlOT(true);

        // nextState = {
        //   ...nextState,
        //   ...readOnlyCtrlOT
        // }

        this.setState(nextState, () => {
            this.setValueDefaultForMedAnnualHealth();
            this.changeValue();
        });
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        _handleSetState(record);
    };

    handleSetState = record => {
        let nextState = {};

        const {
                Profile,
                DiseaseID,
                DateReceived,
                CutOffDurationID,
                Cost,
                CostUnitID,
                HealthCheckGroup,
                AnnualHealthTimeID,
                TypeResultHealthID,
                HeightTemp,
                WeightTemp,
                BloodType,
                BMITemp,
                Result,
                Note,
                Diagnostic,
                MedicalAdvice,
                FileAttachment
            } = this.state,
            item = record;

        nextState = {
            ...this.state,
            ID: record.ID,
            Profile: {
                ...Profile,
                ID: item.ProfileID,
                ProfileName: item.ProfileName
            },
            DiseaseID: {
                ...DiseaseID,
                value: item.DiseaseID ? { ID: item.DiseaseID, DiseaseName: item.DiseaseName } : null,
                disable: false,
                visible: true
            },
            AnnualHealthTimeID: {
                ...AnnualHealthTimeID,
                value: item.AnnualHealthTimeID ? { ID: item.AnnualHealthTimeID, NameEntityName: '' } : null,
                refresh: !AnnualHealthTimeID.refresh
            },
            HealthCheckGroup: {
                ...HealthCheckGroup,
                value: item.HealthCheckGroup
                    ? { Value: item.HealthCheckGroup, Text: translate(item.HealthCheckGroup) }
                    : null,
                refresh: !HealthCheckGroup.refresh
            },
            DateReceived: {
                ...DateReceived,
                value: item.DateReceived ? moment(item.DateReceived).format('YYYY-MM-DD HH:mm:ss') : null,
                refresh: !DateReceived.refresh
            },
            CutOffDurationID: {
                ...CutOffDurationID,
                value: item.CutOffDurationID
                    ? { ID: item.CutOffDurationID, CutOffDurationName: item.CutOffDurationName }
                    : null,
                refresh: !CutOffDurationID.refresh
            },
            Cost: {
                ...Cost,
                value: item.Cost ? `${item.Cost}` : '',
                refresh: !Cost.refresh
            },
            CostUnitID: {
                ...CostUnitID,
                value: item.CostUnitID ? { ID: item.CostUnitID, CurrencyName: item.CurrencyName } : null,
                refresh: !CostUnitID.refresh
            },
            TypeResultHealthID: {
                ...TypeResultHealthID,
                value: item.TypeResultHealthID
                    ? { ID: item.TypeResultHealthID, TypeResultHealthName: item.TypeResultHealthName }
                    : null,
                refresh: !TypeResultHealthID.refresh
            },
            HeightTemp: {
                ...HeightTemp,
                value: item.HeightTemp ? `${item.HeightTemp}` : '',
                refresh: !HeightTemp.refresh
            },
            WeightTemp: {
                ...WeightTemp,
                value: item.WeightTemp ? `${item.WeightTemp}` : '',
                refresh: !WeightTemp.refresh
            },
            BloodType: {
                ...BloodType,
                value: item.BloodType ? `${item.BloodType}` : '',
                refresh: !BloodType.refresh
            },
            BMITemp: {
                ...BMITemp,
                value: item.BMI ? `${item.BMI}` : '',
                refresh: !BMITemp.refresh
            },
            Note: {
                ...Note,
                value: item.Note ? item.Note : '',
                refresh: !Note.refresh
            },
            Result: {
                ...Result,
                value: item.Result ? item.Result : '',
                refresh: !Result.refresh
            },
            Diagnostic: {
                ...Diagnostic,
                value: item.Diagnostic ? item.Diagnostic : '',
                refresh: !Diagnostic.refresh
            },
            MedicalAdvice: {
                ...MedicalAdvice,
                value: item.MedicalAdvice ? item.MedicalAdvice : '',
                refresh: !MedicalAdvice.refresh
            },
            FileAttachment: {
                ...FileAttachment,
                value: item.lstFileAttach,
                refresh: !FileAttachment.refresh
            }
        };

        this.setState(nextState);
    };
    //#endregion

    changeValue = () => {
        const { HeightTemp, WeightTemp, BloodType, Profile } = this.state;
        HttpService.Post('[URI_HR]/Med_GetData/GetInfoByProfileID', {
            ProfileID: Profile.ID
        }).then(data => {
            if (data) {
                console.log(data, 'datadatadata');
                this.setState(
                    {
                        HeightTemp: {
                            ...HeightTemp,
                            value: data.Height ? `${data.Height}` : '',
                            refresh: !HeightTemp.refresh
                        },
                        WeightTemp: {
                            ...WeightTemp,
                            value: data.Weight ? `${data.Weight}` : '',
                            refresh: !WeightTemp.refresh
                        },
                        BloodType: {
                            ...BloodType,
                            value: data.BloodType ? `${data.BloodType}` : '',
                            refresh: !BloodType.refresh
                        }
                    },
                    () => {
                        this.calculatorBMI();
                    }
                );
            }
        });
    };

    setValueDefaultForMedAnnualHealth = () => {
        const { CostUnitID, Status } = this.state;
        HttpService.Get('[URI_POR]/New_Personal/GetDefaultValueMed?table=Med_AnnualHealth').then(data => {
            if (data && data.CurrencyName && data.CurrencyID) {
                this.setState({
                    CostUnitID: {
                        ...CostUnitID,
                        value: {
                            ID: data.CurrencyID,
                            CurrencyName: data.CurrencyName
                        },
                        refresh: !CostUnitID.refresh
                    },
                    Status: {
                        ...Status,
                        value: data.Status ? data.Status : null,
                        refresh: !Status.refresh
                    }
                });
            }
        });
    };

    calculatorBMI = () => {
        const { HeightTemp, WeightTemp, BMITemp } = this.state;
        let height = HeightTemp.value ? parseFloat(HeightTemp.value) / 100 : 0,
            weight = WeightTemp.value ? parseFloat(WeightTemp.value) : 0;

        if (height && weight && height > 0 && weight > 0) {
            var total = weight / (height * height);
            this.setState({
                BMITemp: {
                    ...BMITemp,
                    value: `${total}`,
                    refresh: !BMITemp.refresh
                }
            });
        } else {
            this.setState({
                BMITemp: {
                    ...BMITemp,
                    value: '0',
                    refresh: !BMITemp.refresh
                }
            });
        }
    };

    onSave = (navigation, isCreate, isSend) => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        const {
                ID,
                Profile,
                DiseaseID,
                DateReceived,
                CutOffDurationID,
                Cost,
                CostUnitID,
                HealthCheckGroup,
                AnnualHealthTimeID,
                TypeResultHealthID,
                HeightTemp,
                WeightTemp,
                BloodType,
                BMITemp,
                Result,
                Note,
                Diagnostic,
                MedicalAdvice,
                Status,
                FileAttachment
            } = this.state,
            { apiConfig } = dataVnrStorage,
            { uriMain, uriPor } = apiConfig;

        let param = {
            ProfileID: Profile.ID,
            CutOffDurationID: CutOffDurationID.value ? CutOffDurationID.value.ID : '',
            AnnualHealthTimeID: AnnualHealthTimeID.value ? AnnualHealthTimeID.value.ID : '',
            DateReceived: DateReceived.value ? moment(DateReceived.value).format('YYYY-MM-DD') : null,
            DiseaseID: DiseaseID.value ? DiseaseID.value.ID : null,
            HealthCheckGroup: HealthCheckGroup.value ? HealthCheckGroup.value.Value : null,
            CostUnitID: CostUnitID.value ? CostUnitID.value.ID : null,
            Cost: Cost.value ? parseFloat(Cost.value.split(',').join('')) : '',
            HeightTemp: HeightTemp.value ? parseFloat(HeightTemp.value) : '',
            WeightTemp: WeightTemp.value ? parseFloat(WeightTemp.value) : '',
            BMI: BMITemp.value ? parseFloat(BMITemp.value) : '',
            BMITemp: BMITemp.value ? parseFloat(BMITemp.value) : '',
            BloodType: BloodType.value ? BloodType.value : '',
            Result: Result.value ? Result.value : '',
            Note: Note.value ? Note.value : '',
            Diagnostic: Diagnostic.value ? Diagnostic.value : '',
            MedicalAdvice: MedicalAdvice.value ? MedicalAdvice.value : '',
            IsPortal: true,
            UserSubmit: Profile.ID,
            UserID: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.userid : null,
            TypeResultHealthID: TypeResultHealthID.value ? TypeResultHealthID.value.ID : null,
            Status: Status.value ? Status.value : null,
            FileAttachment: FileAttachment.value ? FileAttachment.value.map(item => item.fileName).join(',') : null
        };

        if (ID) {
            param = {
                ...param,
                ID
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Med_AnnualHealth', param).then(data => {
            VnrLoadingSevices.hide();
            this.isProcessing = false;
            if (data.ActionStatus == 'Success') {
                ToasterSevice.showSuccess('Hrm_Succeed', 4000);

                if (isCreate) {
                    this.refreshView();
                } else {
                    navigation.goBack();
                }

                const { reload } = navigation.state.params;
                if (typeof reload == 'function') {
                    reload();
                }
            } else if (data.ActionStatus) {
                ToasterSevice.showWarning(data.ActionStatus);
            }
        });
    };

    onSaveAndCreate = navigation => {
        this.onSave(navigation, true, null);
    };

    onSaveAndSend = navigation => {
        this.onSave(navigation, null, true);
    };

    render() {
        const {
            DiseaseID,
            DateReceived,
            CutOffDurationID,
            Cost,
            CostUnitID,
            HealthCheckGroup,
            AnnualHealthTimeID,
            TypeResultHealthID,
            HeightTemp,
            WeightTemp,
            BloodType,
            BMITemp,
            Result,
            Note,
            Diagnostic,
            MedicalAdvice,
            FileAttachment,
            fieldValid
        } = this.state;

        const {
            textLableInfo,
            contentViewControl,
            viewLable,
            viewControl,
            viewInputMultiline,
            formDate_To_From,
            controlDate_from,
            controlDate_To
        } = stylesListPickerControl;

        //#region [Xử lý 3 nút lưu]
        const listActions = [];

        listActions.push({
            type: EnumName.E_SAVE_CLOSE,
            title: translate('HRM_Common_SaveClose'),
            onPress: () => this.onSave(this.props.navigation)
        });

        //#endregion

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={{ flexGrow: 1, paddingTop: 10 }}
                        ref={ref => (this.scrollViewRef = ref)}
                    >
                        {/* Ngày khám -  DateReceived */}
                        {DateReceived.visibleConfig && DateReceived.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DateReceived.label} />

                                    {/* valid DateReceived */}
                                    {fieldValid.DateReceived && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={DateReceived.value}
                                        refresh={DateReceived.refresh}
                                        disable={DateReceived.disable}
                                        type={'date'}
                                        onFinish={value =>
                                            this.setState({
                                                DateReceived: {
                                                    ...DateReceived,
                                                    value: value,
                                                    refresh: !DateReceived.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Kỳ lương -  CutOffDurationID*/}
                        {CutOffDurationID.visibleConfig && CutOffDurationID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={CutOffDurationID.label}
                                    />
                                    {fieldValid.CutOffDurationID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        autoFilter={true}
                                        api={{
                                            urlApi: '[URI_HR]/Att_GetData/GetMultiCutOffDuration',
                                            type: 'E_GET'
                                        }}
                                        refresh={CutOffDurationID.refresh}
                                        textField="CutOffDurationName"
                                        valueField="CutOffDurationID"
                                        filter={true}
                                        value={CutOffDurationID.value}
                                        filterServer={false}
                                        disable={CutOffDurationID.disable}
                                        onFinish={item =>
                                            this.setState({
                                                CutOffDurationID: {
                                                    ...CutOffDurationID,
                                                    value: item,
                                                    refresh: !CutOffDurationID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Số tiền -  Cost, Đơn vị tính - CostUnitID */}
                        {Cost.visibleConfig && Cost.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Cost.label} />
                                    {fieldValid.Cost && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>

                                <View style={formDate_To_From}>
                                    {/* Số tiền -  Cost */}
                                    <View style={controlDate_from}>
                                        <VnrTextInput
                                            value={Cost.value}
                                            refresh={Cost.refresh}
                                            disable={Cost.disable}
                                            keyboardType={'numeric'}
                                            charType={'money'}
                                            returnKeyType={'done'}
                                            onChangeText={value =>
                                                this.setState({
                                                    Cost: {
                                                        ...Cost,
                                                        value,
                                                        refresh: !Cost.refresh
                                                    }
                                                })
                                            }
                                            // onBlur={this.onChangeRegisterHours}
                                            // onSubmitEditing={this.onChangeRegisterHours}
                                        />
                                    </View>

                                    {/* Đơn vị tính - CostUnitID */}
                                    <View style={controlDate_To}>
                                        <VnrPickerQuickly
                                            api={{
                                                urlApi: '[URI_HR]/Cat_GetData/GetMultiCurrency',
                                                type: 'E_GET'
                                            }}
                                            refresh={CostUnitID.refresh}
                                            textField="CurrencyName"
                                            valueField="ID"
                                            filter={false}
                                            value={CostUnitID.value}
                                            disable={CostUnitID.disable}
                                            onFinish={item =>
                                                this.setState({
                                                    CostUnitID: {
                                                        ...CostUnitID,
                                                        value: item,
                                                        refresh: !CostUnitID.refresh
                                                    }
                                                })
                                            }
                                        />
                                    </View>
                                </View>
                            </View>
                        )}

                        {/* Nhóm khám -  HealthCheckGroup*/}
                        {HealthCheckGroup.visibleConfig && HealthCheckGroup.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={HealthCheckGroup.label}
                                    />
                                    {fieldValid.HealthCheckGroup && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        autoFilter={true}
                                        api={{
                                            urlApi: '[URI_SYS]/Sys_GetData/GetEnum?text=HealthCheckGroup',
                                            type: 'E_GET'
                                        }}
                                        refresh={HealthCheckGroup.refresh}
                                        textField="Text"
                                        valueField="Value"
                                        filter={true}
                                        value={HealthCheckGroup.value}
                                        filterServer={false}
                                        disable={HealthCheckGroup.disable}
                                        onFinish={item =>
                                            this.setState({
                                                HealthCheckGroup: {
                                                    ...HealthCheckGroup,
                                                    value: item,
                                                    refresh: !HealthCheckGroup.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Đợt khám sức khỏe -  AnnualHealthTimeID */}
                        {AnnualHealthTimeID.visibleConfig && AnnualHealthTimeID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={AnnualHealthTimeID.label}
                                    />

                                    {/* valid AnnualHealthTimeIDype */}
                                    {fieldValid.AnnualHealthTimeID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        autoFilter={true}
                                        api={{
                                            urlApi: '[URI_HR]/Cat_GetData/GetMultiAnnualHealthTimeCodeName',
                                            type: 'E_GET'
                                        }}
                                        autoBind={true}
                                        refresh={AnnualHealthTimeID.refresh}
                                        textField="NameEntityName"
                                        valueField="ID"
                                        filter={true}
                                        value={AnnualHealthTimeID.value}
                                        filterServer={false}
                                        disable={AnnualHealthTimeID.disable}
                                        onFinish={item =>
                                            this.setState({
                                                AnnualHealthTimeID: {
                                                    ...AnnualHealthTimeID,
                                                    value: item,
                                                    refresh: !AnnualHealthTimeID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Loại sức khỏe -  TypeResultHealthID */}
                        {TypeResultHealthID.visibleConfig && TypeResultHealthID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={TypeResultHealthID.label}
                                    />

                                    {/* valid TypeResultHealthID */}
                                    {fieldValid.TypeResultHealthID && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        autoFilter={true}
                                        api={{
                                            urlApi: '[URI_HR]/Med_GetData/GetMultiTypeResultHealth',
                                            type: 'E_GET'
                                        }}
                                        refresh={TypeResultHealthID.refresh}
                                        textField="TypeResultHealthName"
                                        valueField="ID"
                                        filter={true}
                                        value={TypeResultHealthID.value}
                                        filterServer={false}
                                        disable={TypeResultHealthID.disable}
                                        onFinish={item =>
                                            this.setState({
                                                TypeResultHealthID: {
                                                    ...TypeResultHealthID,
                                                    value: item,
                                                    refresh: !TypeResultHealthID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Bệnh -  DiseaseID */}
                        {DiseaseID.visibleConfig && DiseaseID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DiseaseID.label} />

                                    {/* valid DurationType */}
                                    {fieldValid.DiseaseID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        autoFilter={true}
                                        api={{
                                            urlApi: '[URI_HR]/Med_GetData/GetMultiDisease',
                                            type: 'E_GET'
                                        }}
                                        refresh={DiseaseID.refresh}
                                        textField="DiseaseName"
                                        valueField="ID"
                                        filter={true}
                                        value={DiseaseID.value}
                                        filterServer={false}
                                        disable={DiseaseID.disable}
                                        onFinish={item =>
                                            this.setState({
                                                DiseaseID: {
                                                    ...DiseaseID,
                                                    value: item,
                                                    refresh: !DiseaseID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Chiều cao -  HeightTemp*/}
                        {HeightTemp.visibleConfig && HeightTemp.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={`${translate(HeightTemp.label)} (cm)`}
                                    />
                                    {fieldValid.HeightTemp && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        keyboardType={'numeric'}
                                        charType={'double'}
                                        disable={HeightTemp.disable}
                                        refresh={HeightTemp.refresh}
                                        value={HeightTemp.value}
                                        returnKeyType={'done'}
                                        onBlur={this.calculatorBMI}
                                        onSubmitEditing={this.calculatorBMI}
                                        onChangeText={text =>
                                            this.setState({
                                                HeightTemp: {
                                                    ...HeightTemp,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Cân nặng -  WeightTemp*/}
                        {WeightTemp.visibleConfig && WeightTemp.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={`${translate(WeightTemp.label)} (kg)`}
                                    />
                                    {fieldValid.WeightTemp && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        keyboardType={'numeric'}
                                        charType={'double'}
                                        disable={WeightTemp.disable}
                                        refresh={WeightTemp.refresh}
                                        value={WeightTemp.value}
                                        returnKeyType={'done'}
                                        onBlur={this.calculatorBMI}
                                        onSubmitEditing={this.calculatorBMI}
                                        onChangeText={text =>
                                            this.setState({
                                                WeightTemp: {
                                                    ...WeightTemp,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Nhóm máu -  BloodType*/}
                        {BloodType.visibleConfig && BloodType.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={BloodType.label} />
                                    {fieldValid.BloodType && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={BloodType.disable}
                                        refresh={BloodType.refresh}
                                        value={BloodType.value}
                                        onChangeText={text =>
                                            this.setState({
                                                BloodType: {
                                                    ...BloodType,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* BMI -  BMITemp*/}
                        {BMITemp.visibleConfig && BMITemp.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={BMITemp.label} />
                                    {fieldValid.BMITemp && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={BMITemp.disable}
                                        refresh={BMITemp.refresh}
                                        value={BMITemp.value}
                                        onChangeText={text =>
                                            this.setState({
                                                BMITemp: {
                                                    ...BMITemp,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Kết quả -  Result*/}
                        {Result.visibleConfig && Result.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Result.label} />
                                    {fieldValid.Result && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Result.disable}
                                        refresh={Result.refresh}
                                        value={Result.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={text =>
                                            this.setState({
                                                Result: {
                                                    ...Result,
                                                    value: text
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

                        {/* Chẩn đoán -  Diagnostic*/}
                        {Diagnostic.visibleConfig && Diagnostic.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Diagnostic.label} />
                                    {fieldValid.Diagnostic && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Diagnostic.disable}
                                        refresh={Diagnostic.refresh}
                                        value={Diagnostic.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={text =>
                                            this.setState({
                                                Diagnostic: {
                                                    ...Diagnostic,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Tư vấn y tế -  MedicalAdvice*/}
                        {MedicalAdvice.visibleConfig && MedicalAdvice.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={MedicalAdvice.label} />
                                    {fieldValid.MedicalAdvice && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={MedicalAdvice.disable}
                                        refresh={MedicalAdvice.refresh}
                                        value={MedicalAdvice.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={text =>
                                            this.setState({
                                                MedicalAdvice: {
                                                    ...MedicalAdvice,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Tập tin đính kèm - FileAttachment */}
                        {FileAttachment.visible && FileAttachment.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={FileAttachment.label} />
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
                </View>
            </SafeAreaView>
        );
    }
}
