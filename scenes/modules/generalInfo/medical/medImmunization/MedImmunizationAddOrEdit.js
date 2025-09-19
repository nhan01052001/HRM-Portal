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
    InjectionStatus: {
        label: 'HRM_Medical_ImmunizationRecord_InjectionStatusView',
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true,
        disable: false
    },
    ImmunizationOrganization: {
        label: 'HRM_Medical_ImmunizationRecord_ImmunizationOrganization',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    HealthNote1: {
        label: 'HRM_Medical_ImmunizationRecord_HealthNote1',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    HealthNote2: {
        label: 'HRM_Medical_ImmunizationRecord_HealthNote2',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    MedicineID: {
        label: 'HRM_Medical_ImmunizationRecord_MedicineName',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    InjectionNo: {
        label: 'HRM_Medical_ImmunizationRecord_InjectionNo',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    InjectionDate: {
        label: 'HRM_Medical_ImmunizationRecord_InjectionDate',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    InjectionPlace: {
        label: 'HRM_Medical_ImmunizationRecord_InjectionPlace',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    InjectionReason: {
        label: 'HRM_Medical_ImmunizationRecord_InjectionReason',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    fieldValid: {}
};

export default class MedImmunizationAddOrEdit extends Component {
    constructor(props) {
        super(props);

        this.state = initSateDefault;

        props.navigation.setParams({
            title:
                props.navigation.state.params && props.navigation.state.params.record
                    ? 'HRM_Med_ImmunizationRecord_PopUp_Edit_Title'
                    : 'HRM_Med_ImmunizationRecord_PopUp_Create_Title'
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
        this.setState(resetState, () => this.getConfigValid('Med_ImmunizationRecordPortal', true));
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
                        ConfigField && ConfigField.value['MedImmunizationAddOrEdit']
                            ? ConfigField.value['MedImmunizationAddOrEdit']['Hidden']
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
        this.getConfigValid('Med_ImmunizationRecordPortal');
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

        this.setState(nextState);
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        _handleSetState(record);
    };

    handleSetState = record => {
        let nextState = {};

        const {
                Profile,
                DiseaseID,
                InjectionStatus,
                ImmunizationOrganization,
                HealthNote1,
                HealthNote2,
                MedicineID,
                InjectionNo,
                InjectionDate,
                InjectionPlace,
                InjectionReason
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
            InjectionStatus: {
                ...InjectionStatus,
                value: item.InjectionStatus ? { Value: item.InjectionStatus, Text: item.InjectionStatusView } : null,
                disable: false,
                visible: true
            },
            MedicineID: {
                ...MedicineID,
                value: item.MedicineID ? { ID: item.MedicineID, MedicineName: item.MedicineName } : null,
                disable: false,
                visible: true
            },
            InjectionDate: {
                ...InjectionDate,
                value: item.InjectionDate ? moment(item.InjectionDate).format('YYYY-MM-DD HH:mm:ss') : null,
                disable: false,
                refresh: !InjectionDate.refresh
            },
            ImmunizationOrganization: {
                ...ImmunizationOrganization,
                value: item.ImmunizationOrganization ? item.ImmunizationOrganization : '',
                refresh: !ImmunizationOrganization.refresh
            },
            HealthNote1: {
                ...HealthNote1,
                value: item.HealthNote1 ? item.HealthNote1 : '',
                refresh: !HealthNote1.refresh
            },
            HealthNote2: {
                ...HealthNote2,
                value: item.HealthNote2 ? item.HealthNote2 : '',
                refresh: !HealthNote2.refresh
            },
            InjectionNo: {
                ...InjectionNo,
                value: item.InjectionNo ? `${item.InjectionNo}` : '',
                refresh: !InjectionNo.refresh
            },
            InjectionPlace: {
                ...InjectionPlace,
                value: item.InjectionPlace ? item.InjectionPlace : '',
                refresh: !InjectionPlace.refresh
            },
            InjectionReason: {
                ...InjectionReason,
                value: item.InjectionReason ? item.InjectionReason : '',
                refresh: !InjectionReason.refresh
            }
        };

        this.setState(nextState);
    };
    //#endregion

    onSave = (navigation, isCreate, isSend) => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        const {
                ID,
                Profile,
                DiseaseID,
                InjectionStatus,
                ImmunizationOrganization,
                HealthNote1,
                HealthNote2,
                MedicineID,
                InjectionNo,
                InjectionDate,
                InjectionPlace,
                InjectionReason
            } = this.state,
            { apiConfig } = dataVnrStorage,
            { uriMain, uriPor } = apiConfig;

        let param = {
            ProfileID: Profile.ID,
            InjectionNo: InjectionNo.value ? InjectionNo.value : '',
            HealthNote1: HealthNote1.value ? HealthNote1.value : '',
            HealthNote2: HealthNote2.value ? HealthNote2.value : '',
            InjectionReason: InjectionReason.value ? InjectionReason.value : '',
            InjectionDate: InjectionDate.value ? moment(InjectionDate.value).format('YYYY-MM-DD') : null,
            DiseaseID: DiseaseID.value ? DiseaseID.value.ID : null,
            InjectionStatus: InjectionStatus.value ? InjectionStatus.value.Value : null,
            MedicineID: MedicineID.value ? MedicineID.value.ID : null,
            IsPortal: true,
            UserSubmit: Profile.ID,
            UserID: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.userid : null,
            ImmunizationOrganization: ImmunizationOrganization.value ? ImmunizationOrganization.value : '',
            InjectionPlace: InjectionPlace.value ? InjectionPlace.value : ''
        };

        if (ID) {
            param = {
                ...param,
                ID
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Med_ImmunizationRecord', param).then(data => {
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
            InjectionStatus,
            ImmunizationOrganization,
            HealthNote1,
            HealthNote2,
            MedicineID,
            InjectionNo,
            InjectionDate,
            InjectionPlace,
            InjectionReason,
            fieldValid
        } = this.state;

        const {
            textLableInfo,
            contentViewControl,
            viewLable,
            viewControl,
            viewInputMultiline
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

                        {/* Tình trạng tiêm -  InjectionStatus */}
                        {InjectionStatus.visibleConfig && InjectionStatus.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={InjectionStatus.label}
                                    />

                                    {/* valid DurationType */}
                                    {fieldValid.InjectionStatus && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        autoFilter={true}
                                        api={{
                                            urlApi: '[URI_SYS]/Sys_GetData/GetEnum?text=InjectionStatus',
                                            type: 'E_GET'
                                        }}
                                        autoBind={true}
                                        refresh={InjectionStatus.refresh}
                                        textField="Text"
                                        valueField="Value"
                                        filter={true}
                                        value={InjectionStatus.value}
                                        filterServer={false}
                                        disable={InjectionStatus.disable}
                                        onFinish={item =>
                                            this.setState({
                                                InjectionStatus: {
                                                    ...InjectionStatus,
                                                    value: item,
                                                    refresh: !InjectionStatus.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Đơn vị đăng ký tiêm -  ImmunizationOrganization*/}
                        {ImmunizationOrganization.visibleConfig && ImmunizationOrganization.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={ImmunizationOrganization.label}
                                    />
                                    {fieldValid.ImmunizationOrganization && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={ImmunizationOrganization.disable}
                                        refresh={ImmunizationOrganization.refresh}
                                        value={ImmunizationOrganization.value}
                                        //multiline={true}
                                        onChangeText={text =>
                                            this.setState({
                                                ImmunizationOrganization: {
                                                    ...ImmunizationOrganization,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ghi chú sức khỏe sau tiêm -  HealthNote1*/}
                        {HealthNote1.visibleConfig && HealthNote1.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={HealthNote1.label} />
                                    {fieldValid.HealthNote1 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={HealthNote1.disable}
                                        refresh={HealthNote1.refresh}
                                        value={HealthNote1.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={text =>
                                            this.setState({
                                                HealthNote1: {
                                                    ...HealthNote1,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Lưu ý trình trạng sức khỏe (Nếu có) -  HealthNote2*/}
                        {HealthNote2.visibleConfig && HealthNote2.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={HealthNote2.label} />
                                    {fieldValid.HealthNote2 && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={HealthNote2.disable}
                                        refresh={HealthNote2.refresh}
                                        value={HealthNote2.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={text =>
                                            this.setState({
                                                HealthNote2: {
                                                    ...HealthNote2,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Tình trạng tiêm -  MedicineID */}
                        {MedicineID.visibleConfig && MedicineID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={MedicineID.label} />

                                    {/* valid DurationType */}
                                    {fieldValid.MedicineID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrPickerQuickly
                                        autoFilter={true}
                                        api={{
                                            urlApi: '[URI_HR]/Med_GetData/GetMultiMedicineOnlyVaccine',
                                            type: 'E_GET'
                                        }}
                                        refresh={MedicineID.refresh}
                                        textField="MedicineName"
                                        valueField="ID"
                                        filter={true}
                                        value={MedicineID.value}
                                        filterServer={false}
                                        disable={MedicineID.disable}
                                        onFinish={item =>
                                            this.setState({
                                                MedicineID: {
                                                    ...MedicineID,
                                                    value: item,
                                                    refresh: !MedicineID.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Mũi tiêm số -  InjectionNo*/}
                        {InjectionNo.visibleConfig && InjectionNo.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={InjectionNo.label} />
                                    {fieldValid.InjectionNo && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        keyboardType={'numeric'}
                                        charType={'int'}
                                        disable={InjectionNo.disable}
                                        refresh={InjectionNo.refresh}
                                        value={InjectionNo.value}
                                        onChangeText={text =>
                                            this.setState({
                                                InjectionNo: {
                                                    ...InjectionNo,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày tiêm - InjectionDate */}
                        {InjectionDate.visibleConfig && InjectionDate.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={InjectionDate.label} />
                                    {fieldValid.InjectionDate && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={InjectionDate.value}
                                        refresh={InjectionDate.refresh}
                                        disable={InjectionDate.disable}
                                        type={'date'}
                                        onFinish={value =>
                                            this.setState({
                                                InjectionDate: {
                                                    ...InjectionDate,
                                                    value: value,
                                                    refresh: !InjectionStatus.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Nơi tiêm -  InjectionPlace*/}
                        {InjectionPlace.visibleConfig && InjectionPlace.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={InjectionPlace.label} />
                                    {fieldValid.InjectionPlace && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={InjectionPlace.disable}
                                        refresh={InjectionPlace.refresh}
                                        value={InjectionPlace.value}
                                        //multiline={true}
                                        onChangeText={text =>
                                            this.setState({
                                                InjectionPlace: {
                                                    ...InjectionPlace,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Lý do chưa tiêm -  HealthNote1*/}
                        {InjectionReason.visibleConfig && InjectionReason.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={InjectionReason.label}
                                    />
                                    {fieldValid.InjectionReason && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={InjectionReason.disable}
                                        refresh={InjectionReason.refresh}
                                        value={InjectionReason.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={text =>
                                            this.setState({
                                                InjectionReason: {
                                                    ...InjectionReason,
                                                    value: text
                                                }
                                            })
                                        }
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
