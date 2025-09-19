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
        label: 'HRM_Medical_HistoryMedical_DiseaseID',
        value: null,
        refresh: false,
        visibleConfig: true,
        visible: true,
        disable: false
    },
    DateIn: {
        label: 'HRM_Medical_HistoryMedical_DateIn',
        disable: false,
        value: null,
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
    HealthInsNo: {
        label: 'HRM_Medical_HistoryMedical_HealthInsNo',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    DiseasesInPast: {
        label: 'HRM_Medical_HistoryMedical_DiseasesInPast',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    Description: {
        label: 'HRM_Medical_HistoryMedical_Description',
        disable: false,
        value: '',
        refresh: false,
        visibleConfig: true,
        visible: true
    },
    fieldValid: {}
};

export default class MedHistoryMedicalAddOrEdit extends Component {
    constructor(props) {
        super(props);

        this.state = initSateDefault;

        props.navigation.setParams({
            title:
                props.navigation.state.params && props.navigation.state.params.record
                    ? 'HRM_Medical_HistoryMedical_Update_Title'
                    : 'HRM_Medical_HistoryMedical_Create_Title'
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
        this.props.navigation.setParams({ title: 'HRM_Medical_HistoryMedical_Create_Title' });
        this.setVariable();

        let resetState = {
            ...initSateDefault
        };
        this.setState(resetState, () => this.getConfigValid('Med_HistoryMedicalPortal', true));
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
                        ConfigField && ConfigField.value['MedHistoryMedicalAddOrEdit']
                            ? ConfigField.value['MedHistoryMedicalAddOrEdit']['Hidden']
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
        this.getConfigValid('Med_HistoryMedicalPortal');
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

        this.setState(nextState, () => {
            this.setValueDefaultForMedHistoryMedical();
        });
    };

    getRecordAndConfigByID = (record, _handleSetState) => {
        _handleSetState(record);
    };

    handleSetState = record => {
        let nextState = {};

        const { Profile, DiseaseID, DiseasesInPast, DateIn, Description, HealthInsNo, Status } = this.state,
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
            DateIn: {
                ...DateIn,
                value: item.DateIn ? moment(item.DateIn).format('YYYY-MM-DD HH:mm:ss') : null,
                refresh: !DateIn.refresh
            },
            DiseasesInPast: {
                ...DiseasesInPast,
                value: item.DiseasesInPast ? item.DiseasesInPast : '',
                refresh: !DiseasesInPast.refresh
            },
            Description: {
                ...Description,
                value: item.Description ? item.Description : '',
                refresh: !Description.refresh
            },
            HealthInsNo: {
                ...HealthInsNo,
                value: item.HealthInsNo ? item.HealthInsNo : '',
                refresh: !HealthInsNo.refresh
            },
            Status: {
                ...Status,
                value: item.Status ? { Value: item.Status } : null
            }
        };

        this.setState(nextState, () => {
            this.setValueDefaultForMedHistoryMedical();
        });
    };
    //#endregion

    setValueDefaultForMedHistoryMedical = () => {
        const { Status } = this.state;
        HttpService.Get('[URI_POR]/New_Personal/GetDefaultValueMed?table=Med_HistoryMedical').then(function(data) {
            if (data) {
                this.setState({
                    Status: {
                        ...Status,
                        value: data.Status ? data.Status : null,
                        refresh: !Status.refresh
                    }
                });
            }
        });
    };

    onSave = (navigation, isCreate, isSend) => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        const { ID, Profile, DiseaseID, DiseasesInPast, DateIn, Description, HealthInsNo, Status } = this.state,
            { apiConfig } = dataVnrStorage,
            { uriMain, uriPor } = apiConfig;

        let param = {
            ProfileID: Profile.ID,
            DiseaseID: DiseaseID.value ? DiseaseID.value.ID : null,
            DateIn: DateIn.value ? moment(DateIn.value).format('YYYY-MM-DD') : null,
            Status: Status.value ? Status.value : null,
            DiseasesInPast: DiseasesInPast.value ? DiseasesInPast.value : '',
            Description: Description.value ? Description.value : '',
            HealthInsNo: HealthInsNo.value ? HealthInsNo.value : '',
            IsPortal: true,
            UserSubmit: Profile.ID,
            UserID: dataVnrStorage.currentUser ? dataVnrStorage.currentUser.info.userid : null
        };

        console.log(param, 'paramparamparam');
        if (ID) {
            param = {
                ...param,
                ID
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Med_HistoryMedical', param).then(data => {
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
        const { DiseaseID, DiseasesInPast, DateIn, Description, HealthInsNo, fieldValid } = this.state;

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
                        {/* Ngày khám -  DateIn*/}
                        {DateIn.visibleConfig && DateIn.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DateIn.label} />
                                    {fieldValid.DateIn && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={DateIn.value}
                                        refresh={DateIn.refresh}
                                        disable={DateIn.disable}
                                        type={'date'}
                                        onFinish={value =>
                                            this.setState({
                                                DateIn: {
                                                    ...DateIn,
                                                    value: value,
                                                    refresh: !DateIn.refresh
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

                        {/* Số thẻ BHYT -  HealthInsNo*/}
                        {HealthInsNo.visibleConfig && HealthInsNo.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={HealthInsNo.label} />
                                    {fieldValid.HealthInsNo && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={HealthInsNo.disable}
                                        refresh={HealthInsNo.refresh}
                                        value={HealthInsNo.value}
                                        onChangeText={text =>
                                            this.setState({
                                                HealthInsNo: {
                                                    ...HealthInsNo,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Tiểu sử bệnh -  DiseasesInPast*/}
                        {DiseasesInPast.visibleConfig && DiseasesInPast.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DiseasesInPast.label} />
                                    {fieldValid.DiseasesInPast && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={DiseasesInPast.disable}
                                        refresh={DiseasesInPast.refresh}
                                        value={DiseasesInPast.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={text =>
                                            this.setState({
                                                DiseasesInPast: {
                                                    ...DiseasesInPast,
                                                    value: text
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Mô tả -  HealthNote1*/}
                        {Description.visibleConfig && Description.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Description.label} />
                                    {fieldValid.Description && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={Description.disable}
                                        refresh={Description.refresh}
                                        value={Description.value}
                                        style={[styleSheets.text, viewInputMultiline]}
                                        multiline={true}
                                        onChangeText={text =>
                                            this.setState({
                                                Description: {
                                                    ...Description,
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
