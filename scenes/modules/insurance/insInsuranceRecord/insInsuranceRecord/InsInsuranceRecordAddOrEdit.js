import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Colors,
    styleSafeAreaView,
    stylesListPickerControl,
    styleValid,
    Size,
    stylesScreenDetailV2,
    stylesModalPopupBottom,
    styleViewTitleForGroup,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import CheckBox from 'react-native-check-box';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrPicker from '../../../../../components/VnrPicker/VnrPicker';
import HttpService from '../../../../../utils/HttpService';
import VnrDate from '../../../../../components/VnrDate/VnrDate';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName, EnumIcon } from '../../../../../assets/constant';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import ListButtonSave from '../../../../../components/ListButtonMenuRight/ListButtonSave';
import { translate } from '../../../../../i18n/translate';
import VnrTextInput from '../../../../../components/VnrTextInput/VnrTextInput';
import VnrAttachFile from '../../../../../components/VnrAttachFile/VnrAttachFile';
import moment from 'moment';
import VnrPickerMulti from '../../../../../components/VnrPickerMulti/VnrPickerMulti';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { IconColse } from '../../../../../constants/Icons';
import Modal from 'react-native-modal';
import VnrTreeView from '../../../../../components/VnrTreeViewV2/VnrTreeView';
import VnrAutoComplete from '../../../../../components/VnrAutoComplete/VnrAutoComplete';

const InsuranceTypeAllowed = [
    'E_PREGNANCY_SUCKLE',
    'E_PREGNANCY_SUCKLE_ONLY_CHILD',
    'E_SUCKLE_TWINS',
    'E_PREGNANCY_SUCKLE_TRIPLE_BORN',
    'E_PREGNANCY_SUCKLE_ADOPTION_1_CHILD',
    'E_PREGNANCY_SUCKLE_ADOPTION_OVER_2_CHILD',
    'E_PREGNANCY_SUCKLE_ADOPTION_NOT_QUIT',
    'E_PREGNANCY_LEAVE_PREG_NORMAL_CASE',
    'E_PRENANCY_SURGERY_LESS_32_WEEKS',
    'E_PREGNANCY_LEAVE_PREG_TWIN',
    'E_PREGNANCY_SUCKLE_ADOPTION',
    'E_PREGNANCY_LEAVE_PREG_ABOVE_3',
    'E_SUCKLE_SURGERY_TWINS',
    'E_PREGNANCY_SUPPORT1TIMES_MEN',
    'E_PREGNANCY_LEAVE_PREG'
];
export default class InsInsuranceRecordAddOrEdit extends Component {
    constructor(props) {
        super(props);

        this.state = {
            modalErrorDetail: {
                isModalVisible: false,
                cacheID: null,
                data: []
            },
            ProfileID: {
                ID: null,
                ProfileName: '',
                disable: true,
                label: 'HRM_Insurance_InsuranceRecord_ProfileIDV2'
            },
            ParentID: {
                ID: null,
                label: 'HRM_Insurance_InsuranceRecord_ParentIDV2',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            InsuranceType: {
                label: 'HRM_Insurance_InsuranceRecord_InsuranceType',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true,
                data: [],
                textField: 'InsuranceType',
                valueField: 'Code'
            },
            IDNoV2: {
                label: 'HRM_Insurance_InsuranceRecord_IDNo',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            IsAdjust: {
                label: 'HRM_Insurance_InsuranceRecord_IsAdjust',
                disable: false,
                refresh: false,
                value: false,
                visible: true,
                visibleConfig: true
            },
            PreviousApproveDate: {
                ID: null,
                label: 'HRM_Insurance_InsuranceRecord_PreviousApproveDate',
                disable: false,
                refresh: false,
                value: null,
                visible: false,
                visibleConfig: true
            },
            SettlementTime: {
                label: 'HRM_Insurance_InsuranceRecord_SettlementTime',
                disable: true,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            InsuranceCodeV2: {
                ID: null,
                label: 'HRM_Insurance_InsuranceRecord_InsuranceCode',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            DateOfBirth: {
                ID: null,
                label: 'HRM_HR_Profile_DayOfBirth',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            MonthYearSettlement: {
                label: 'HRM_Insurance_InsuranceRecord_MonthYearSettlement',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            strSettlement: {
                label: 'HRM_Insurance_InsuranceRecord_Settlement',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true,
                api: {
                    urlApi: '[URI_HR]/Tas_GetData/GetEnumAssignTask?text=C70Settlement',
                    type: 'E_GET'
                },
                valueField: 'Value',
                textField: 'Text',
                data: []
            },
            AdditionalMonthYearSettlement: {
                label: 'HRM_Insurance_InsuranceRecord_AdditionalMonthYearSettlement',
                disable: false,
                refresh: false,
                value: null,
                visible: false,
                visibleConfig: true
            },
            AdditionalSettlementString: {
                label: 'HRM_Insurance_InsuranceRecord_AdditionalSettlement',
                disable: false,
                refresh: false,
                value: null,
                visible: false,
                visibleConfig: true,
                api: {
                    urlApi: '[URI_HR]/Tas_GetData/GetEnumAssignTask?text=C70Settlement',
                    type: 'E_GET'
                },
                valueField: 'Value',
                textField: 'Text',
                data: []
            },
            SeriNo: {
                label: 'HRM_Insurance_InsuranceRecord_SeriNo',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            InsRecordCode: {
                label: 'HRM_Insurance_InsuranceRecord_InsRecordCode',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            DateStart: {
                label: 'HRM_Insurance_InsuranceRecord_DateStart',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            DateEnd: {
                label: 'HRM_Insurance_InsuranceRecord_DateEnd',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            DoctorDateStart: {
                label: 'HRM_Insurance_InsuranceRecord_DoctorDateStart',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            DoctorDateEnd: {
                label: 'HRM_Insurance_InsuranceRecord_DoctorDateEnd',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            DayCount: {
                label: 'HRM_Insurance_InsuranceRecord_DayCount',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            RecordDate: {
                label: 'HRM_Insurance_InsuranceRecord_RecordDate',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            InsuranceTime: {
                label: 'HRM_Insurance_InsuranceRecord_InsuranceTime',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            RelativesID: {
                label: 'HRM_Insurance_InsuranceRecord_ChildRelative',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true,
                valueField: 'ID',
                textField: 'RelativeName',
                data: []
            },
            DateSuckle: {
                label: 'HRM_Insurance_InsuranceRecord_DateSuckle',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            ChildHealthInsNo: {
                label: 'HRM_Insurance_InsuranceRecord_ChildHealthInsNo',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            PaymentMethod: {
                label: 'HRM_Insurance_InsuranceRecord_PaymentMethod',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                api: {
                    urlApi: '[URI_SYS]/Sys_GetData/GetEnum?text=PaymentMethod',
                    type: 'E_GET'
                },
                valueField: 'Value',
                textField: 'Text',
                data: [],
                visibleConfig: true
            },
            AccountNumber: {
                label: 'HRM_Insurance_InsuranceRecord_AccountNumber',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            BankID: {
                label: 'HRM_Insurance_InsuranceRecord_BankID',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true,
                api: {
                    urlApi: '[URI_HR]/Cat_GetData/GetMultiBank',
                    type: 'E_GET'
                },
                valueField: 'ID',
                textField: 'BankCodeName',
                data: [],
                filterServer: true,
                filterParam: 'text'
            },
            BranchID: {
                label: 'HRM_Insurance_InsuranceRecord_BranchID',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true,
                valueField: 'ID',
                textField: 'BranchCodeName',
                data: []
            },
            Amount: {
                label: 'HRM_Insurance_InsuranceRecord_Amount',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            DocumentLink: {
                label: 'HRM_Insurance_InsuranceRecord_DocumentLink',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            FileAttachment: {
                label: 'HRM_Insurance_InsuranceRecord_FileAttachment',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            DateStartWorking: {
                label: 'HRM_Insurance_InsuranceRecord_DateStartWorking',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            DatePregnancy: {
                label: 'HRM_Insurance_InsuranceRecord_DatePregnancy',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            EstimateDueDate: {
                label: 'HRM_Insurance_InsuranceRecord_EstimateDueDate',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            AntenatalCareCondition: {
                label: 'HRM_Insurance_InsuranceRecord_AntenatalCareCondition',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true,
                api: {
                    urlApi: '[URI_HR]/Tas_GetData/GetEnumAssignTask?text=AntenatalCareCondition',
                    type: 'E_GET'
                },
                valueField: 'Value',
                textField: 'Text',
                data: []
            },
            ChildbirthCondition: {
                label: 'HRM_Insurance_InsuranceRecord_ChildbirthCondition',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true,
                api: {
                    urlApi: '[URI_HR]/Tas_GetData/GetEnumAssignTask?text=GivingBirthCondition',
                    type: 'E_GET'
                },
                valueField: 'Value',
                textField: 'Text',
                data: []
            },
            ChildInsuranceCode: {
                label: 'HRM_Insurance_InsuranceRecord_ChildInsuranceCode',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            FoetusAge: {
                label: 'HRM_Insurance_InsuranceRecord_FoetusAge',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            ChildLostDate: {
                label: 'HRM_Insurance_InsuranceRecord_ChildLostDate',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            ChildrenNumber: {
                label: 'HRM_Insurance_InsuranceRecord_ChildrenNumber',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            NumberOfLostChild: {
                label: 'HRM_Insurance_InsuranceRecord_NumberOfLostChild',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            AdoptionDate: {
                label: 'HRM_Insurance_InsuranceRecord_AdoptionDate',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            SurrogacyAdoptionDate: {
                label: 'HRM_Insurance_InsuranceRecord_SurrogacyAdoptionDate',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            WifeID: {
                label: 'HRM_Insurance_InsuranceRecord_WifeID',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true,
                api: {
                    urlApi: '[URI_HR]/Ins_GetData/getWifeListByProfileID',
                    type: 'E_GET'
                },
                valueField: 'ID',
                textField: 'RelativeName',
                data: []
            },
            MotherSocialInsuranceNumer: {
                label: 'HRM_Insurance_InsuranceRecord_MotherSocialInsuranceNumer',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            MotherHealthInsuranceCardNumber: {
                label: 'HRM_Insurance_InsuranceRecord_MotherHealthInsuranceCardNumber',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            MotherIDNumber: {
                label: 'HRM_Insurance_InsuranceRecord_MotherIDNumber',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            IsMaternityLeave: {
                label: 'HRM_Insurance_InsuranceRecord_IsMaternityLeave',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            SurrogacyType: {
                label: 'HRM_Insurance_InsuranceRecord_SurrogacyType',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true,
                api: {
                    urlApi: '[URI_HR]/Tas_GetData/GetEnumAssignTask?text=SurrogacyType',
                    type: 'E_GET'
                },
                valueField: 'Value',
                textField: 'Text',
                data: []
            },
            IsSurgeryOrUnder32Weeks: {
                label: 'HRM_Insurance_InsuranceRecord_IsSurgeryOrUnder32Weeks',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            MotherLostDate: {
                label: 'HRM_Insurance_InsuranceRecord_MotherLostDate',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            ConclusionDate: {
                label: 'HRM_Insurance_InsuranceRecord_ConclusionDate',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            MedicalExaminationFees: {
                label: 'HRM_Insurance_InsuranceRecord_MedicalExaminationFees',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            NurturerSocialInsuranceNumer: {
                label: 'HRM_Insurance_InsuranceRecord_NurturerSocialInsuranceNumer',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            IsFatherTakeCareOfChild: {
                label: 'HRM_Insurance_InsuranceRecord_IsFatherTakeCareOfChild',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            AdjustmentReason: {
                label: 'HRM_Insurance_InsuranceRecord_AdjustmentReason',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            TreatmentLineID: {
                label: 'HRM_Insurance_InsuranceRecord_TreatmentLineID',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true,
                api: {
                    urlApi: '[URI_HR]/Ins_GetData/GetMultiInsTreatmentLine',
                    type: 'E_GET'
                },
                valueField: 'ID',
                textField: 'NameEntityName',
                data: [],
                filterServer: true,
                filterParam: 'text'
            },
            NumberOfChildSick: {
                label: 'HRM_Insurance_InsuranceRecord_NumberOfChildSick',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            Diagnose: {
                label: 'HRM_Insurance_InsuranceRecord_Diagnose',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            SickName: {
                label: 'HRM_Insurance_InsuranceRecord_SickID',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true,
                api: {
                    urlApi: '[URI_HR]/Ins_GetData/GetMultiInsSick',
                    type: 'E_GET'
                },
                valueField: 'SickName',
                textField: 'SickName',
                data: []
            },
            Reason: {
                label: 'HRM_Insurance_InsuranceRecord_Reason',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            WeeklyDayOff: {
                label: 'HRM_Insurance_InsuranceRecord_WeeklyDayOff',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true,
                api: {
                    urlApi: '[URI_SYS]/Sys_GetData/GetEnum?text=DaysOFWeeks',
                    type: 'E_GET'
                },
                valueField: 'Value',
                textField: 'Text',
                data: []
            },
            WorkingCondition: {
                label: 'HRM_Insurance_InsuranceRecord_WorkingCondition',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                api: {
                    urlApi: '[URI_SYS]/Sys_GetData/GetEnum?text=WorkingCondition',
                    type: 'E_GET'
                },
                valueField: 'Value',
                textField: 'Text',
                data: [],
                visibleConfig: true
            },
            HealthDeclineRate: {
                label: 'HRM_Insurance_InsuranceRecord_HealthDeclineRate',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            DiagnosticDate: {
                label: 'HRM_Insurance_InsuranceRecord_DiagnosticDate',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            CommentIR: {
                label: 'HRM_Insurance_InsuranceRecord_Comment',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true
            },
            TypeData: {
                label: 'HRM_Insurance_InsuranceRecord_TypeData',
                disable: false,
                refresh: false,
                value: null,
                visible: true,
                visibleConfig: true,
                api: {
                    urlApi: '[URI_SYS]/Sys_GetData/GetEnum?text=InsuranceRecordTypeData',
                    type: 'E_GET'
                },
                valueField: 'Value',
                textField: 'Text',
                data: []
            },
            fieldValid: {}
        };

        //set title screen
        props.navigation.setParams({ title: 'HRM_Insurance_InsuranceRecord_PopUp_Edit_Title' });

        this.isProcessing = false;
        this.IsContinueSave = false;
        this.ProfileRemoveIDs = null;
        this.IsRemoveAndContinue = null;
        this.CacheID = null;
    }

    //#region [khởi tạo - lấy các dữ liệu cho control, lấy giá trị mặc đinh]

    componentDidMount() {
        let { record } = this.props.navigation.state.params,
            _insType = record ? record.InsuranceType : null,
            valid = this.getConfigValid(_insType);

        //get config validate
        VnrLoadingSevices.show();
        HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + valid).then((res) => {
            VnrLoadingSevices.hide();
            if (res) {
                try {
                    //map field hidden by config
                    const _configField =
                        ConfigField && ConfigField.value['InsInsuranceRecord']
                            ? ConfigField.value['InsInsuranceRecord']['Hidden']
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
                        if (record) {
                            this.getRecordAndConfigByID(record, this.handleSetState);
                            // this.handleSetState(record);
                        }
                    });
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            }
        });
    }

    getRecordAndConfigByID = (record, _handleSetState) => {
        VnrLoadingSevices.show();
        HttpService.Get('[URI_SYS]/Sys_GetData/CheckIsInsuranceInfomationNotAllowEdit').then((resConfigRealOnly) => {
            VnrLoadingSevices.hide();
            try {
                _handleSetState(record, resConfigRealOnly);
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    fnShowField = (nextState, insuranceType) => {
        const { ShowHideFields } = nextState;
        //console.log(ShowHideFields, insuranceType);
        if (ShowHideFields && ShowHideFields.length > 0) {
            ShowHideFields.map((itemConfig) => {
                if (itemConfig.Field && itemConfig.Field.length > 0) {
                    itemConfig.Field.map((itemHidden) => {
                        let _field = nextState[itemHidden] ? nextState[itemHidden] : this.state[itemHidden];

                        if (_field && typeof _field === 'object') {
                            _field = {
                                ..._field,
                                visibleConfig: true
                            };

                            nextState = {
                                ...nextState,
                                [itemHidden]: { ..._field }
                            };
                        }
                    });
                }
            });

            let checkInsType = ShowHideFields.find((itemType) => {
                return itemType.InsuranceType.indexOf(insuranceType) >= 0;
            });

            if (checkInsType) {
                let _hiddenField = checkInsType.Field;

                _hiddenField.forEach((itemHidden) => {
                    let _field = nextState[itemHidden] ? nextState[itemHidden] : this.state[itemHidden];

                    if (_field && typeof _field === 'object') {
                        _field = {
                            ..._field,
                            visibleConfig: false
                        };

                        nextState = {
                            ...nextState,
                            [itemHidden]: { ..._field }
                        };
                    }
                });
            }
        }

        return nextState;
    };

    handleSetState = (item, configRealOnly) => {
        const {
                ProfileID,
                ParentID,
                IDNoV2,
                IsAdjust,
                PreviousApproveDate,
                SettlementTime,
                InsuranceCodeV2,
                DateOfBirth,
                MonthYearSettlement,
                strSettlement,
                AdditionalMonthYearSettlement,
                AdditionalSettlementString,
                SeriNo,
                InsRecordCode,
                DateStart,
                DateEnd,
                DoctorDateStart,
                DoctorDateEnd,
                DayCount,
                RecordDate,
                InsuranceTime,
                RelativesID,
                ChildHealthInsNo,
                PaymentMethod,
                AccountNumber,
                BankID,
                BranchID,
                Amount,
                DocumentLink,
                FileAttachment,
                DateStartWorking,
                DatePregnancy,
                EstimateDueDate,
                AntenatalCareCondition,
                ChildbirthCondition,
                ChildInsuranceCode,
                FoetusAge,
                DateSuckle,
                ChildLostDate,
                ChildrenNumber,
                NumberOfLostChild,
                AdoptionDate,
                SurrogacyAdoptionDate,
                CommentIR,
                WifeID,
                MotherSocialInsuranceNumer,
                MotherHealthInsuranceCardNumber,
                MotherIDNumber,
                IsMaternityLeave,
                SurrogacyType,
                IsSurgeryOrUnder32Weeks,
                MotherLostDate,
                ConclusionDate,
                MedicalExaminationFees,
                NurturerSocialInsuranceNumer,
                IsFatherTakeCareOfChild,
                AdjustmentReason,
                TreatmentLineID,
                NumberOfChildSick,
                Diagnose,
                SickName,
                Reason,
                WeeklyDayOff,
                WorkingCondition,
                HealthDeclineRate,
                DiagnosticDate,
                TypeData
            } = this.state,
            ShowHideFields = item.ShowHideFields ? item.ShowHideFields.HRM9Default : [];

        let valueWeeklyDayOff = [];
        if (item.WeeklyDayOff && item.WeeklyDayOffView) {
            let splitWeeklyDayOff = item.WeeklyDayOff.split(','),
                splitWeeklyDayOffView = item.WeeklyDayOffView.split(',');

            if (splitWeeklyDayOff.length > 0 && splitWeeklyDayOff.length == splitWeeklyDayOffView.length) {
                valueWeeklyDayOff = splitWeeklyDayOff.map((item, i) => {
                    return { Value: item, Text: splitWeeklyDayOffView[i] };
                });
            }
        }
        let nextState = {};

        nextState = {
            IsAdjust: {
                ...IsAdjust,
                value: IsAdjust,
                refresh: !IsAdjust.refresh
            },
            PreviousApproveDate: {
                ...PreviousApproveDate,
                visible: IsAdjust,
                value: item.PreviousApproveDate,
                refresh: !PreviousApproveDate.refresh
            },
            ShowHideFields,
            InsuranceTypeGroup1: item.InsuranceTypeGroup1,
            IsMethod: item.IsMethod,
            UserSubmit: item.UserSubmit,
            record: item,
            IsPaymented: item.IsPaymented,
            StatusV2: item.StatusV2,
            DocumentStatus: item.DocumentStatus,
            ID: item.ID,
            ProfileID: {
                ...ProfileID,
                ID: item.ProfileID,
                ProfileName: item.ProfileCodeName
            },
            ParentID: {
                ...ParentID,
                value: [{ Code: item.InsuranceType, Name: item.InsuranceTypeView, id: item.InsuranceTypeID }],
                refresh: !ParentID.refresh
            },
            IDNoV2: {
                ...IDNoV2,
                value: item.IDNo ? item.IDNo : null,
                refresh: !IDNoV2.refresh
            },
            SettlementTime: {
                ...SettlementTime,
                value: item.SettlementTimeView,
                refresh: !SettlementTime.refresh
            },
            InsuranceCodeV2: {
                ...InsuranceCodeV2,
                value: item.InsuranceCode ? item.InsuranceCode : null,
                refresh: !InsuranceCodeV2.refresh
            },
            FileAttachment: {
                ...FileAttachment,
                value: item.lstFileAttach,
                refresh: !FileAttachment.refresh
            },
            TreatmentLineID: {
                ...TreatmentLineID,
                value: item.TreatmentLineID
                    ? { NameEntityName: item.TreatmentLineName, ID: item.TreatmentLineID }
                    : null,
                refresh: !TreatmentLineID.refresh
            },
            DateOfBirth: {
                ...DateOfBirth,
                value: item.DateOfBirth,
                refresh: !DateOfBirth.refresh
            },
            MonthYearSettlement: {
                ...MonthYearSettlement,
                value: item.MonthYearSettlement,
                refresh: !MonthYearSettlement.refresh
            },
            strSettlement: {
                ...strSettlement,
                value: item.strSettlement
                    ? { Text: translate('C70Settlement__' + item.strSettlement), Value: item.strSettlement }
                    : null,
                refresh: !strSettlement.refresh
            },
            AdditionalMonthYearSettlement: {
                ...AdditionalMonthYearSettlement,
                value: item.AdditionalMonthYearSettlement,
                visible: IsAdjust,
                refresh: !AdditionalMonthYearSettlement.refresh
            },
            AdditionalSettlementString: {
                ...AdditionalSettlementString,
                value: item.AdditionalSettlementString
                    ? {
                        Text: translate('C70Settlement__' + item.AdditionalSettlementString),
                        Value: item.AdditionalSettlementString
                    }
                    : null,
                visible: IsAdjust,
                refresh: !AdditionalSettlementString.refresh
            },
            SeriNo: {
                ...SeriNo,
                value: item.SeriNo ? item.SeriNo : null,
                refresh: !SeriNo.refresh
            },
            InsRecordCode: {
                ...InsRecordCode,
                value: item.InsRecordCode ? item.InsRecordCode : null,
                refresh: !InsRecordCode.refresh
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
            DoctorDateStart: {
                ...DoctorDateStart,
                value: item.DoctorDateStart,
                refresh: !DoctorDateStart.refresh
            },
            DoctorDateEnd: {
                ...DoctorDateEnd,
                value: item.DoctorDateEnd,
                refresh: !DoctorDateEnd.refresh
            },
            DayCount: {
                ...DayCount,
                value: item.DayCount ? item.DayCount.toString() : null,
                refresh: !DayCount.refresh
            },
            RecordDate: {
                ...RecordDate,
                value: item.RecordDate,
                refresh: !RecordDate.refresh
            },
            InsuranceTime: {
                ...InsuranceTime,
                value: item.InsuranceTime,
                refresh: !InsuranceTime.refresh
            },
            RelativesID: {
                ...RelativesID,
                value: item.RelativesID ? { RelativeName: item.RelativeName, ID: item.RelativesID } : null,
                refresh: !RelativesID.refresh
            },
            ChildHealthInsNo: {
                ...ChildHealthInsNo,
                value: item.ChildHealthInsNo ? item.ChildHealthInsNo : null,
                disable: item.ChildHealthInsNo ? true : false,
                refresh: !ChildHealthInsNo.refresh
            },
            PaymentMethod: {
                ...PaymentMethod,
                value: item.PaymentMethod ? { Value: item.PaymentMethod, Text: item.PaymentMethodView } : null,
                refresh: !PaymentMethod.refresh
            },
            AccountNumber: {
                ...AccountNumber,
                value: item.AccountNumber ? item.AccountNumber : null,
                refresh: !AccountNumber.refresh
            },
            BankID: {
                ...BankID,
                value: item.BankID ? { ID: item.BankID, BankCodeName: item.BankCodeName } : null,
                refresh: !BankID.refresh
            },
            BranchID: {
                ...BranchID,
                value: item.BranchID ? { ID: item.BranchID, BranchCodeName: item.BranchCodeName } : null,
                refresh: !BranchID.refresh
            },
            Amount: {
                ...Amount,
                value: item.Amount ? item.Amount.toString() : null,
                refresh: !Amount.refresh
            },
            DocumentLink: {
                ...DocumentLink,
                value: item.DocumentLink ? item.DocumentLink : null,
                refresh: !DocumentLink.refresh
            },
            DateStartWorking: {
                ...DateStartWorking,
                value: item.DateStartWorking,
                refresh: !DateStartWorking.refresh
            },
            DatePregnancy: {
                ...DatePregnancy,
                value: item.DatePregnancy,
                refresh: !DatePregnancy.refresh
            },
            EstimateDueDate: {
                ...EstimateDueDate,
                value: item.EstimateDueDate,
                refresh: !EstimateDueDate.refresh
            },
            AntenatalCareCondition: {
                ...AntenatalCareCondition,
                value: item.AntenatalCareCondition
                    ? { Text: item.AntenatalCareConditionView, Value: item.AntenatalCareCondition }
                    : null,
                refresh: !AntenatalCareCondition.refresh
            },
            ChildbirthCondition: {
                ...ChildbirthCondition,
                value: item.ChildbirthCondition
                    ? { Text: item.ChildbirthConditionView, Value: item.ChildbirthCondition }
                    : null,
                refresh: !ChildbirthCondition.refresh
            },
            ChildInsuranceCode: {
                ...ChildInsuranceCode,
                value: item.ChildInsuranceCode ? item.ChildInsuranceCode : null,
                disable: item.ChildInsuranceCode ? true : false,
                refresh: !ChildInsuranceCode.refresh
            },
            FoetusAge: {
                ...FoetusAge,
                value: item.FoetusAge ? item.FoetusAge.toString() : null,
                refresh: !FoetusAge.refresh
            },
            DateSuckle: {
                ...DateSuckle,
                value: item.DateSuckle,
                refresh: !DateSuckle.refresh
            },
            ChildLostDate: {
                ...ChildLostDate,
                value: item.ChildLostDate,
                refresh: !ChildLostDate.refresh
            },
            ChildrenNumber: {
                ...ChildrenNumber,
                value: item.ChildrenNumber ? item.ChildrenNumber.toString() : null,
                refresh: !ChildrenNumber.refresh
            },
            NumberOfLostChild: {
                ...NumberOfLostChild,
                value: item.NumberOfLostChild ? item.NumberOfLostChild.toString() : null,
                refresh: !NumberOfLostChild.refresh
            },
            AdoptionDate: {
                ...AdoptionDate,
                value: item.AdoptionDate,
                refresh: !AdoptionDate.refresh
            },
            SurrogacyAdoptionDate: {
                ...SurrogacyAdoptionDate,
                value: item.SurrogacyAdoptionDate,
                refresh: !SurrogacyAdoptionDate.refresh
            },
            CommentIR: {
                ...CommentIR,
                value: item.Comment ? item.Comment : null,
                refresh: !CommentIR.refresh
            },
            WifeID: {
                ...WifeID,
                value: item.WifeID ? { ID: item.WifeID, RelativeName: item.WifeName } : null,
                refresh: !WifeID.refresh
            },
            MotherSocialInsuranceNumer: {
                ...MotherSocialInsuranceNumer,
                value: item.MotherSocialInsuranceNumer,
                disable: item.MotherSocialInsuranceNumer ? true : false,
                refresh: !MotherSocialInsuranceNumer.refresh
            },
            MotherHealthInsuranceCardNumber: {
                ...MotherHealthInsuranceCardNumber,
                disable: item.MotherHealthInsuranceCardNumber ? true : false,
                value: item.MotherHealthInsuranceCardNumber,
                refresh: !MotherHealthInsuranceCardNumber.refresh
            },
            MotherIDNumber: {
                ...MotherIDNumber,
                disable: item.MotherIDNumber ? true : false,
                value: item.MotherIDNumber,
                refresh: !MotherIDNumber.refresh
            },
            IsMaternityLeave: {
                ...IsMaternityLeave,
                value: item.IsMaternityLeave,
                refresh: !IsMaternityLeave.refresh
            },
            SurrogacyType: {
                ...SurrogacyType,
                value: item.SurrogacyType ? { Text: item.SurrogacyTypeView, Value: item.SurrogacyType } : null,
                refresh: !SurrogacyType.refresh
            },
            IsSurgeryOrUnder32Weeks: {
                ...IsSurgeryOrUnder32Weeks,
                value: item.IsSurgeryOrUnder32Weeks,
                refresh: !IsSurgeryOrUnder32Weeks.refresh
            },
            MotherLostDate: {
                ...MotherLostDate,
                value: item.MotherLostDate,
                refresh: !MotherLostDate.refresh
            },
            ConclusionDate: {
                ...ConclusionDate,
                value: item.ConclusionDate,
                refresh: !ConclusionDate.refresh
            },
            MedicalExaminationFees: {
                ...MedicalExaminationFees,
                value: item.MedicalExaminationFees ? item.MedicalExaminationFees.toString() : null,
                refresh: !MedicalExaminationFees.refresh
            },
            NurturerSocialInsuranceNumer: {
                ...NurturerSocialInsuranceNumer,
                value: item.NurturerSocialInsuranceNumer,
                refresh: !NurturerSocialInsuranceNumer.refresh
            },
            IsFatherTakeCareOfChild: {
                ...IsFatherTakeCareOfChild,
                value: item.IsFatherTakeCareOfChild,
                refresh: !IsFatherTakeCareOfChild.refresh
            },
            AdjustmentReason: {
                ...AdjustmentReason,
                value: item.AdjustmentReason ? item.AdjustmentReason : null,
                refresh: !AdjustmentReason.refresh
            },
            NumberOfChildSick: {
                ...NumberOfChildSick,
                value: item.NumberOfChildSick ? item.NumberOfChildSick.toString() : null,
                refresh: !NumberOfChildSick.refresh
            },
            Diagnose: {
                ...Diagnose,
                value: item.Diagnose,
                refresh: !Diagnose.refresh
            },
            SickName: {
                ...SickName,
                value:
                    item.SickCodeName && item.SickCodeName != ' - '
                        ? { SickName: item.SickCodeName }
                        : item.NewSickName
                            ? { SickName: item.NewSickName }
                            : null,
                refresh: !SickName.refresh
            },
            Reason: {
                ...Reason,
                value: item.Reason ? item.Reason : null,
                refresh: !Reason.refresh
            },
            WeeklyDayOff: {
                ...WeeklyDayOff,
                value: valueWeeklyDayOff,
                refresh: !Reason.refresh
            },
            WorkingCondition: {
                ...WorkingCondition,
                value: item.WorkingCondition ? { Value: item.WorkingCondition, Text: item.WorkingConditionView } : null,
                refresh: !WorkingCondition.refresh
            },
            HealthDeclineRate: {
                ...HealthDeclineRate,
                value: item.HealthDeclineRate,
                refresh: !HealthDeclineRate.refresh
            },
            DiagnosticDate: {
                ...DiagnosticDate,
                value: item.DiagnosticDate,
                refresh: !DiagnosticDate.refresh
            },
            TypeData: {
                ...TypeData,
                value: item.TypeData ? { Value: item.TypeData, Text: item.TypeDataView } : null,
                refresh: !TypeData.refresh
            }
        };

        nextState = this.fnShowField(nextState, item.InsuranceType);

        // 144948
        if (configRealOnly) {
            nextState = {
                ...nextState,
                ParentID: {
                    ...nextState.ParentID,
                    disable: true
                },
                IDNoV2: {
                    ...nextState.IDNoV2,
                    disable: true
                },
                InsuranceCodeV2: {
                    ...nextState.InsuranceCodeV2,
                    disable: true
                },
                DateOfBirth: {
                    ...nextState.DateOfBirth,
                    disable: true
                },
                DateStart: {
                    ...nextState.DateStart,
                    disable: true
                },
                DateEnd: {
                    ...nextState.DateEnd,
                    disable: true
                },
                RecordDate: {
                    ...nextState.RecordDate,
                    disable: true
                },
                DayCount: {
                    ...nextState.DayCount,
                    disable: true
                }
            };
        }

        this.setState(nextState, () => {
            this.initHandleTreeView(() => this.getRelativeListByProfileID(item), true);

            HttpService.Post('[URI_HR]/Ins_GetData/getWifeListByProfileID', {
                text: null,
                profileID: item.ProfileID
            }).then((data) => {
                if (data) {
                    const { WifeID } = this.state;

                    this.setState({
                        WifeID: {
                            ...WifeID,
                            data: data.map((itemWife) => {
                                return { ID: itemWife.Relative_ID, RelativeName: itemWife.RelativeName };
                            }),
                            refresh: !WifeID.refresh
                        }
                    });
                }
            });
        });
    };

    getRelativeListByProfileID = (item) => {
        let dataBody = {
            text: null,
            profileID: item.ProfileID
        };

        if (InsuranceTypeAllowed.includes(item.InsuranceType ? item.InsuranceType : null)) {
            dataBody = {
                ...dataBody,
                insuranceType: item.InsuranceType,
                dateStart: item.DateStart ? moment(item.DateStart).format('YYYY-MM-DD') : null,
                dateEnd: item.DateEnd ? moment(item.DateEnd).format('YYYY-MM-DD') : null
            };
        }

        HttpService.Post('[URI_HR]/Ins_GetData/getRelativeListByProfileID', dataBody).then((data) => {
            if (data) {
                const { RelativesID } = this.state;

                this.setState(
                    {
                        RelativesID: {
                            ...RelativesID,
                            data: data.map((itemChild) => {
                                return { ID: itemChild.Relative_ID, RelativeName: itemChild.RelativeName };
                            }),
                            refresh: !RelativesID.refresh
                        }
                    },
                    () => this.fnChangeChild()
                );
            }
        });
    };
    //#endregion

    getConfigValid = (_type) => {
        const objFieldInfo = [
            //Ins_InsuranceRecordV2SickView_SickLong
            {
                Type: ['E_SICK_LONG'],
                Field: 'Ins_InsuranceRecordV2SickView_SickLong'
            },
            //Ins_InsuranceRecordV2SickView_SickShort
            {
                Type: ['E_SICK_SHORT'],
                Field: 'Ins_InsuranceRecordV2SickView_SickShort'
            },
            //Ins_InsuranceRecordV2SickView_ChildSick
            {
                Type: ['E_SICK_CHILD'],
                Field: 'Ins_InsuranceRecordV2SickView_ChildSick'
            },
            //Ins_InsuranceRecordV2RestoView_Resto
            {
                Type: [
                    'E_RESTORATION_AFTER_SICK',
                    'E_RESTORATION_LONG_TERM_HEALTHCARE',
                    'E_RESTORATION_OTHER_SICK',
                    'E_RESTORATION_AFTER_SURGERY',
                    'E_RESTORATION_AFTER_OTHER_PREGNANCY',
                    'E_RESTORATION_AFTER_PRENANCY_SURGERY',
                    'E_RESTORATION_AFTER_PRENANCY_OVER_2_CHILD',
                    'E_RESTORATION_PREGNANCY_LOST'
                ],
                Field: 'Ins_InsuranceRecordV2RestoView_Resto'
            },
            //Ins_InsuranceRecordV2RestoView_ReduceRate
            {
                Type: [
                    'E_RESTORATION_DESC_WORKCAPACITY_OVER_51_PERCENT',
                    'E_RESTORATION_DESC_WORKCAPACITY_15_TO_30_PERCENT',
                    'E_RESTORATION_DESC_WORKCAPACITY_31_TO_50_PERCENT'
                ],
                Field: 'Ins_InsuranceRecordV2RestoView_ReduceRate'
            },
            //Ins_InsuranceRecordV2PregView_FoetusAge
            {
                Type: [
                    'E_PREGNANCY_LOST',
                    'E_PREGNANCY_LOST_LESS_5_WEEKS',
                    'E_PREGNANCY_LOST_5_TO_13_WEEKS',
                    'E_PREGNANCY_LOST_13_TO_25_WEEKS',
                    'E_PREGNANCY_LOST_OVER_25_WEEKS'
                ],
                Field: 'Ins_InsuranceRecordV2PregView_FoetusAge'
            },
            //Ins_InsuranceRecordV2PregView_GiveBirth
            {
                Type: [
                    'E_PREGNANCY_SUCKLE_ONLY_CHILD',
                    'E_SUCKLE_TWINS',
                    'E_PREGNANCY_SUCKLE_TRIPLE_BORN',
                    'E_PREGNANCY_SUCKLE_3_31_CASE',
                    'E_PREGNANCY_SURROGACY_NORMAL_CASE_1_CHILD',
                    'E_PREGNANCY_SURROGACY_NORMAL_CASE_TWIN',
                    'E_PREGNANCY_SURROGACY_NORMAL_CASE_OVER_3_CHILD'
                ],
                Field: 'Ins_InsuranceRecordV2PregView_GiveBirth'
            },
            //Ins_InsuranceRecordV2RestoView_ChildDie60
            {
                Type: [
                    'E_CHILD_DIE_LESS60DAYS',
                    'E_PREGNANCY_SURROGACY_DEAD_CASE_HANDOVER_BELOW',
                    'E_CHILD_DIE_OVER60DAYS',
                    'E_PREGNANCY_SUCKLE_CHILD_ALIVE_MOTHER_ABOVE_2',
                    'E_PREGNANCY_SUCKLE_CHILD_DIE_MOTHER_BELOW_2_MONTH',
                    'E_PREGNANCY_SUCKLE_CHILD_DIE_MOTHER_ABOVE_2_MONTH'
                ],
                Field: 'Ins_InsuranceRecordV2RestoView_ChildDie60'
            },
            //Ins_InsuranceRecordV2RestoView_ChildDie
            {
                Type: [
                    'E_PREGNANCY_SURROGACY_DEAD_CASE_HANDOVER_ABOVE',
                    'E_PREGNANCY_SURROGACY_DEAD_CASE_OVER_2_CHILD_ALIVE',
                    'E_PREGNANCY_SUCKLE_TWIN_BORN_ALIVE'
                ],
                Field: 'Ins_InsuranceRecordV2RestoView_ChildDie'
            },
            //Ins_InsuranceRecordV2RestoView_MotherDieSuckle
            {
                Type: ['E_PREGNANCY_SUCKLE_4_34_CASE'],
                Field: 'Ins_InsuranceRecordV2RestoView_MotherDieSuckle'
            },
            //Ins_InsuranceRecordV2RestoView_634case
            {
                Type: ['E_PREGNANCY_SUCKLE_6_34_CASE'],
                Field: 'Ins_InsuranceRecordV2RestoView_634case'
            },
            //Ins_InsuranceRecordV2RestoView_AdoptionNotQuit
            {
                Type: ['E_PREGNANCY_SUCKLE_ADOPTION_NOT_QUIT'],
                Field: 'Ins_InsuranceRecordV2RestoView_AdoptionNotQuit'
            },
            //Ins_InsuranceRecordV2RestoView_Adoption
            {
                Type: ['E_PREGNANCY_SUCKLE_ADOPTION_1_CHILD', 'E_PREGNANCY_SUCKLE_ADOPTION_OVER_2_CHILD'],
                Field: 'Ins_InsuranceRecordV2RestoView_Adoption'
            },
            //Ins_InsuranceRecordV2PregView_SurrogacyNotQuit
            {
                Type: ['E_PREGNANCY_SUCKLE_ADOPTION_MOTHER_NOT_QUIT'],
                Field: 'Ins_InsuranceRecordV2PregView_SurrogacyNotQuit'
            },
            //Ins_InsuranceRecordV2PregView_LeavePreg
            {
                Type: [
                    'E_PREGNANCY_LEAVE_PREG_NORMAL_CASE',
                    'E_PREGNANCY_LEAVE_PREG_TWIN',
                    'E_PREGNANCY_LEAVE_PREG_ABOVE_3',
                    'E_SUCKLE_SURGERY_TWINS'
                ],
                Field: 'Ins_InsuranceRecordV2PregView_LeavePreg'
            },
            //Ins_InsuranceRecordV2PregView_Less32
            {
                Type: ['E_PRENANCY_SURGERY_LESS_32_WEEKS'],
                Field: 'Ins_InsuranceRecordV2PregView_Less32'
            },
            //Ins_InsuranceRecordV2PregView_SurrogacyRequest
            {
                Type: [
                    'E_PREGNANCY_SURROGACY_REQUEST_NORMAL_CASE_ADOPT_1',
                    'E_PREGNANCY_SURROGACY_REQUEST_NORMAL_CASE_ADOPT_2',
                    'E_PREGNANCY_SURROGACY_REQUEST_NORMAL_CASE_ADOPT_3'
                ],
                Field: 'Ins_InsuranceRecordV2PregView_SurrogacyRequest'
            },
            //Ins_InsuranceRecordV2PregView_SurrogacyRequestMotherDead
            {
                Type: ['E_PREGNANCY_SURROGACY_REQUEST_MOTHER_DEAD_OR_SICK'],
                Field: 'Ins_InsuranceRecordV2PregView_SurrogacyRequestMotherDead'
            },
            //Ins_InsuranceRecordV2PregView_SupportingMen
            {
                Type: ['E_PREGNANCY_SUPPORT1TIMES_MEN'],
                Field: 'Ins_InsuranceRecordV2PregView_SupportingMen'
            },
            {
                Type: ['E_PREGNANCY_EXAMINE'],
                Field: 'Ins_InsuranceRecordV2PregView_Examine'
            },
            {
                Type: ['E_PREGNANCY_PREVENTION', 'E_PREGNANCY_PREVENTION_IUD', 'E_PREGNANCY_PREVENTION_STERILIZATION'],
                Field: 'Ins_InsuranceRecordV2PregView_PREVENTION'
            }
        ].find((item) => {
            if (item.Type.indexOf(_type) >= 0) return item;
        });

        if (objFieldInfo) {
            return objFieldInfo.Field;
        }

        return 'Ins_InsuranceRecordV2';
    };

    onSave = (navigation, isCreate, isSend) => {
        if (this.isProcessing) {
            return;
        }

        this.isProcessing = true;

        const {
            UserSubmit,
            modalErrorDetail,
            IsPaymented,
            StatusV2,
            DocumentStatus,
            ID,
            ProfileID,
            ParentID,
            InsuranceType,
            IDNoV2,
            IsAdjust,
            PreviousApproveDate,
            SettlementTime,
            InsuranceCodeV2,
            DateOfBirth,
            MonthYearSettlement,
            strSettlement,
            AdditionalMonthYearSettlement,
            AdditionalSettlementString,
            SeriNo,
            InsRecordCode,
            DateStart,
            DateEnd,
            DoctorDateStart,
            DoctorDateEnd,
            DayCount,
            RecordDate,
            InsuranceTime,
            RelativesID,
            ChildHealthInsNo,
            PaymentMethod,
            AccountNumber,
            BankID,
            BranchID,
            Amount,
            DocumentLink,
            FileAttachment,
            DateStartWorking,
            DatePregnancy,
            EstimateDueDate,
            AntenatalCareCondition,
            ChildbirthCondition,
            ChildInsuranceCode,
            FoetusAge,
            DateSuckle,
            ChildLostDate,
            ChildrenNumber,
            NumberOfLostChild,
            AdoptionDate,
            SurrogacyAdoptionDate,
            CommentIR,
            WifeID,
            MotherSocialInsuranceNumer,
            MotherHealthInsuranceCardNumber,
            MotherIDNumber,
            IsMaternityLeave,
            SurrogacyType,
            IsSurgeryOrUnder32Weeks,
            MotherLostDate,
            ConclusionDate,
            MedicalExaminationFees,
            NurturerSocialInsuranceNumer,
            IsFatherTakeCareOfChild,
            AdjustmentReason,
            TreatmentLineID,
            NumberOfChildSick,
            Diagnose,
            SickName,
            Reason,
            WeeklyDayOff,
            WorkingCondition,
            HealthDeclineRate,
            DiagnosticDate,
            TypeData
        } = this.state;

        let param = {
            IsPaymented,
            StatusV2,
            DocumentStatus,
            ID,
            ProfileID: ProfileID.ID,
            InsuranceRecordParentID: ParentID.value && ParentID.value[0] ? ParentID.value[0].Code : null,
            InsuranceType:
                InsuranceType.value && typeof InsuranceType.value == 'object'
                    ? InsuranceType.value.Code
                    : InsuranceType.value,
            IDNoV2: IDNoV2.value,
            IsAdjust: IsAdjust.value ? IsAdjust.value.value : null,
            PreviousApproveDate: PreviousApproveDate.value
                ? moment(PreviousApproveDate.value).format('YYYY-MM-DD HH:mm:ss')
                : null,
            SettlementTime: SettlementTime.value,
            InsuranceCodeV2: InsuranceCodeV2.value,
            DateOfBirth: DateOfBirth.value ? moment(DateOfBirth.value).format('YYYY-MM-DD HH:mm:ss') : null,
            MonthYearSettlement: MonthYearSettlement.value
                ? moment(MonthYearSettlement.value).format('YYYY-MM-DD HH:mm:ss')
                : null,
            strSettlement: strSettlement.value ? strSettlement.value.Value : null,
            AdditionalMonthYearSettlement: AdditionalMonthYearSettlement.value
                ? moment(AdditionalMonthYearSettlement.value).format('YYYY-MM-DD HH:mm:ss')
                : null,
            AdditionalSettlementString: AdditionalSettlementString.value
                ? AdditionalSettlementString.value.Value
                : null,
            SeriNo: SeriNo.value,
            InsRecordCode: InsRecordCode.value,
            DateStart: DateStart.value ? moment(DateStart.value).format('YYYY-MM-DD HH:mm:ss') : null,
            DateEnd: DateEnd.value ? moment(DateEnd.value).format('YYYY-MM-DD HH:mm:ss') : null,
            DoctorDateStart: DoctorDateStart.value ? moment(DoctorDateStart.value).format('YYYY-MM-DD HH:mm:ss') : null,
            DoctorDateEnd: DoctorDateEnd.value ? moment(DoctorDateEnd.value).format('YYYY-MM-DD HH:mm:ss') : null,
            // nhan.nguyen (support) 0176792: [TB W14][Hotfix_ FGL_v8.10.44.01.11.293] Điều chỉnh logic ràng buộc cập nhập chứng từ BHXH (ID task gốc 0145148 )
            DayCount: !isNaN(Number(DayCount?.value)) ? Number(DayCount?.value) : null,
            RecordDate: RecordDate.value ? moment(RecordDate.value).format('YYYY-MM-DD HH:mm:ss') : null,
            InsuranceTime: InsuranceTime.value ? moment(InsuranceTime.value).format('YYYY-MM-DD HH:mm:ss') : null,
            RelativesID: RelativesID.value ? RelativesID.value.ID : null,
            ChildHealthInsNo: ChildHealthInsNo.value,
            PaymentMethod: PaymentMethod.value ? PaymentMethod.value.Value : null,
            AccountNumber: AccountNumber.value,
            BankID: BankID.value ? BankID.value.ID : null,
            BranchID: BranchID.value ? BranchID.value.ID : null,
            Amount: Amount.value,
            DocumentLink: DocumentLink.value,
            FileAttachment: FileAttachment.value ? FileAttachment.value.map((item) => item.fileName).join(',') : null,
            DateStartWorking: DateStartWorking.value
                ? moment(DateStartWorking.value).format('YYYY-MM-DD HH:mm:ss')
                : null,
            DatePregnancy: DatePregnancy.value ? moment(DatePregnancy.value).format('YYYY-MM-DD HH:mm:ss') : null,
            EstimateDueDate: EstimateDueDate.value ? moment(EstimateDueDate.value).format('YYYY-MM-DD HH:mm:ss') : null,
            AntenatalCareCondition: AntenatalCareCondition.value ? AntenatalCareCondition.value.Value : null,
            ChildbirthCondition: ChildbirthCondition.value ? ChildbirthCondition.value.Value : null,
            ChildInsuranceCode: ChildInsuranceCode.value,
            FoetusAge: FoetusAge.value,
            DateSuckle: DateSuckle.value ? moment(DateSuckle.value).format('YYYY-MM-DD HH:mm:ss') : null,
            ChildLostDate: ChildLostDate.value ? moment(ChildLostDate.value).format('YYYY-MM-DD HH:mm:ss') : null,
            ChildrenNumber: ChildrenNumber.value,
            NumberOfLostChild: NumberOfLostChild.value,
            AdoptionDate: AdoptionDate.value ? moment(AdoptionDate.value).format('YYYY-MM-DD HH:mm:ss') : null,
            SurrogacyAdoptionDate: SurrogacyAdoptionDate.value
                ? moment(SurrogacyAdoptionDate.value).format('YYYY-MM-DD HH:mm:ss')
                : null,
            Comment: CommentIR.value,
            WifeID: WifeID.value ? WifeID.value.ID : null,
            MotherSocialInsuranceNumer: MotherSocialInsuranceNumer.value,
            MotherHealthInsuranceCardNumber: MotherHealthInsuranceCardNumber.value,
            MotherIDNumber: MotherIDNumber.value,
            IsMaternityLeave: IsMaternityLeave.value,
            SurrogacyType: SurrogacyType.value ? SurrogacyType.value.Value : null,
            IsSurgeryOrUnder32Weeks: IsSurgeryOrUnder32Weeks.value,
            MotherLostDate: MotherLostDate.value ? moment(MotherLostDate.value).format('YYYY-MM-DD HH:mm:ss') : null,
            ConclusionDate: ConclusionDate.value ? moment(ConclusionDate.value).format('YYYY-MM-DD HH:mm:ss') : null,
            MedicalExaminationFees: MedicalExaminationFees.value,
            NurturerSocialInsuranceNumer: NurturerSocialInsuranceNumer.value,
            IsFatherTakeCareOfChild: IsFatherTakeCareOfChild.value,
            AdjustmentReason: AdjustmentReason.value,
            TreatmentLineID: TreatmentLineID.value ? TreatmentLineID.value.ID : null,
            NumberOfChildSick: NumberOfChildSick.value,
            Diagnose: Diagnose.value,
            SickName: SickName.value ? SickName.value['SickName'] : null,
            Reason: Reason.value,
            WeeklyDayOff: WeeklyDayOff.value ? WeeklyDayOff.value.map((item) => item.Value).join() : null,
            WorkingCondition: WorkingCondition.value ? WorkingCondition.value.Value : null,
            HealthDeclineRate: HealthDeclineRate.value,
            DiagnosticDate: DiagnosticDate.value ? moment(DiagnosticDate.value).format('YYYY-MM-DD HH:mm:ss') : null,
            TypeData: TypeData.value ? TypeData.value.Value : null,
            ProfileRemoveIDs: this.ProfileRemoveIDs,
            IsRemoveAndContinue: this.IsRemoveAndContinue,
            CacheID: this.CacheID,
            IsContinueSave: this.IsContinueSave,
            UserSubmit: UserSubmit,
            ValidateInfo: this.getConfigValid(
                InsuranceType.value && typeof InsuranceType.value == 'object'
                    ? InsuranceType.value.Code
                    : InsuranceType.value
            )
        };

        if (isSend) {
            param = {
                ...param,
                isSendMail: true
            };
        }

        if (!MonthYearSettlement.visible || !MonthYearSettlement.visibleConfig) {
            param = {
                ...param,
                MonthYearSettlement: null
            };
        }

        if (!strSettlement.visibleConfig || !strSettlement.visible) {
            param = {
                ...param,
                strSettlement: null
            };
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/api/Ins_InsuranceRecordV2', param).then((data) => {
            VnrLoadingSevices.hide();

            //xử lý lại event Save
            this.isProcessing = false;

            if (data) {
                if (data.ErrorRespone) {
                    if (data.ErrorRespone.IsBlock == true) {
                        if (data.ErrorRespone.IsShowRemoveAndContinue) {
                            //xử lý lại event Save
                            this.isProcessing = false;

                            AlertSevice.alert({
                                title: translate('Hrm_Notification'),
                                iconType: EnumIcon.E_WARNING,
                                message: translate('HRM_Attendance_Message_InvalidRequestDataPleaseCheckAgain'),
                                //lưu và tiếp tục
                                colorSecondConfirm: Colors.primary,
                                textSecondConfirm: translate('Button_OK'),
                                onSecondConfirm: () => {
                                    this.ProfileRemoveIDs = data.ErrorRespone.ProfileRemoveIDs;
                                    this.IsRemoveAndContinue = true;
                                    this.CacheID = data.ErrorRespone.CacheID;
                                    this.onSave(navigation, isCreate, isSend);
                                },
                                //đóng
                                onCancel: () => {},
                                //chi tiết lỗi
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
                                            this.isProcessing = false;
                                        }
                                    );
                                }
                            });
                        } else {
                            //xử lý lại event Save
                            this.isProcessing = false;

                            AlertSevice.alert({
                                title: translate('Hrm_Notification'),
                                iconType: EnumIcon.E_WARNING,
                                message: translate('HRM_Attendance_Message_InvalidRequestDataPleaseCheckAgain'),
                                textRightButton: translate('Button_Detail'),
                                //đóng popup
                                onCancel: () => {},
                                //chi tiết lỗi
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
                                            this.isProcessing = false;
                                        }
                                    );
                                }
                            });
                        }
                    } else {
                        this.isProcessing = false;

                        AlertSevice.alert({
                            title: translate('Hrm_Notification'),
                            iconType: EnumIcon.E_WARNING,
                            message: translate('HRM_Attendance_Message_InvalidRequestDataDoYouWantToSave'),
                            //lưu và tiếp tục
                            colorSecondConfirm: Colors.primary,
                            textSecondConfirm: translate('Button_OK'),
                            onSecondConfirm: () => {
                                this.IsContinueSave = true;
                                this.ProfileRemoveIDs = data.ErrorRespone.ProfileRemoveIDs;
                                this.IsRemoveAndContinue = true;
                                this.CacheID = data.ErrorRespone.CacheID;
                                this.onSave(navigation, isCreate, isSend);
                            },
                            //đóng
                            onCancel: () => {},
                            //chi tiết lỗi
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
                                        this.isProcessing = false;
                                    }
                                );
                            }
                        });
                    }
                } else if (data.ActionStatus == 'Success') {
                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                    navigation.goBack();

                    const { reload } = this.props.navigation.state.params;
                    if (reload && typeof reload == 'function') {
                        reload();
                    }
                } else if (data && data.ActionStatus == 'Locked') {
                    ToasterSevice.showWarning('Locked');
                } else {
                    ToasterSevice.showWarning(data.ActionStatus, 10000);
                }
            }
        });
    };

    onSaveAndSend = (navigation) => {
        this.onSave(navigation, null, true);
    };

    //#region [xử lý group theo Message để thông báo lỗi]
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
            { data } = modalErrorDetail,
            { styleViewTitleGroup } = styleViewTitleForGroup,
            RenderItemAction = styles;

        if (data) {
            const dataGroup = this.groupByMessage(data, 'MessageName'),
                dataSourceError = this.mappingDataGroup(dataGroup);

            return dataSourceError.map((dataItem, index) => {
                let viewContent = <View />;
                if (dataItem['Type'] && dataItem['Type'] == 'E_GROUP') {
                    viewContent = (
                        <View style={[styleViewTitleGroup, styles.styViewTitleGroupExtend]}>
                            <VnrText
                                style={[styleSheets.text, styles.styViewErrorTitleGroup]}
                                i18nKey={dataItem['TitleGroup']}
                            />
                        </View>
                    );
                } else {
                    viewContent = (
                        <View style={RenderItemAction.viewInfo}>
                            <View style={RenderItemAction.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                    i18nKey={'HRM_HR_Profile_CodeEmp'}
                                />
                                <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text numberOfLines={1} style={[styleSheets.textItalic, RenderItemAction.fontText]}>
                                        {dataItem['CodeEmp']}
                                    </Text>
                                </View>
                            </View>

                            <View style={RenderItemAction.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                    i18nKey={'HRM_HR_Profile_ProfileName'}
                                />
                                <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text numberOfLines={1} style={[styleSheets.textItalic, RenderItemAction.fontText]}>
                                        {dataItem['ProfileName']}
                                    </Text>
                                </View>
                            </View>

                            <View style={RenderItemAction.Line}>
                                <VnrText
                                    numberOfLines={1}
                                    style={[styleSheets.textItalic, RenderItemAction.fontText]}
                                    i18nKey={'HRM_Attendance_ErrorMessageRespone_ErrorDescription'}
                                />
                                <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>: </Text>
                                <View style={CustomStyleSheet.flex(1)}>
                                    <Text style={[styleSheets.textItalic, RenderItemAction.fontText]}>
                                        {dataItem['ErrorDescription']}
                                    </Text>
                                </View>
                            </View>
                        </View>
                    );
                }

                return <View key={index} style={styles.styleViewBorderButtom}>{viewContent}</View>;
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
    //#endregion

    onChangeBankID = () => {
        const { BankID, BranchID } = this.state;

        if (BankID.value) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Cat_GetData/GetBanchInfoByBankMulti', { BankID: BankID.value.ID }).then(
                (data) => {
                    VnrLoadingSevices.hide();

                    if (data) {
                        this.setState({
                            BranchID: {
                                ...BranchID,
                                data,
                                refresh: !BranchID.refresh
                            }
                        });
                    }
                }
            );
        }
    };

    fnGetWeeklyDaysOff = () => {
        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Ins_GetData/GetDefaultConfig').then((response) => {
            VnrLoadingSevices.hide();

            if (response) {
                let isConfig = false;

                // eslint-disable-next-line no-unused-vars
                for (let item in response) {
                    if (response[item].FieldName == 'WeeklyDayOff') {
                        isConfig = true;
                    }
                }
                if (!isConfig) {
                    this.aaaa();
                }
            }
        });
    };

    aaaa = () => {
        const { DateStart, DateEnd, ProfileID, InsuranceType, WeeklyDayOff } = this.state;
        let dateStart = DateStart.value ? moment(DateStart.value).format('YYYY-MM-DD 00:00:00') : null,
            dateEnd = DateEnd.value ? moment(DateEnd.value).format('YYYY-MM-DD 00:00:00') : null,
            profileId = ProfileID.ID,
            insuranceCode = InsuranceType.value ? InsuranceType.value.Code : null,
            weeklyDaysOff = WeeklyDayOff.value ? WeeklyDayOff.value.map((item) => item.Value).join() : null;
        //var valWeeklyDaysOff = weeklyDaysOff.value().join(',');

        if (dateStart && dateEnd && profileId && insuranceCode) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Ins_GetData/getWeeklyDaysOff', {
                profileID: profileId,
                dateStart: dateStart,
                dateEnd: dateEnd,
                insuranceType: insuranceCode
            }).then((data) => {
                VnrLoadingSevices.hide();

                if (data) {
                    if (data == 'NotExisted' || data == 'Error') {
                        ToasterSevice.showWarning('HRM_Hr_INS_InsRecordV2_Notify_WeeklyDaysOffInValid');
                    } else if (data != null) {
                        //show len multiselect
                        var a = data.split(',');
                        weeklyDaysOff.value(a);
                    }
                }
            });
        }
    };

    fnChangeDateEnd_SickView = () => {
        const { DateStart, DateEnd, ProfileID, InsuranceType, ID } = this.state;
        //khi chọn ngày kết thúc chứng từ sẽ validate chứng từ đó có giao với ngày đi làm không => Nếu giao thì thông báo
        let profileIds = ProfileID.ID,
            datestart = DateStart.value ? moment(DateStart.value).format('YYYY-MM-DD 00:00:00') : null,
            dateend = DateEnd.value ? moment(DateEnd.value).format('YYYY-MM-DD 00:00:00') : null,
            insuranceCode = InsuranceType.value ? InsuranceType.value.Code : null,
            dataParam = {
                insuranceType: insuranceCode,
                insuranceRecordId: ID,
                profileids: profileIds,
                dateStart: datestart,
                dateEnd: dateend,
                isWorkday: true
            };

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Ins_GetData/ValidateDateInsuranceRecord', dataParam).then((data) => {
            VnrLoadingSevices.hide();
            if (data && data.ErrorCode) {
                //xuất thông báo
                ToasterSevice.showWarning(data.ErrorCode);
            }

            this.fnGetWeeklyDaysOff();
        });
    };

    fnCalcDayCountV2 = () => {
        const { DateStart, DateEnd, ProfileID, InsuranceType, DayCount, RecordDate } = this.state;

        let profiles = ProfileID.ID,
            insuranceCode = InsuranceType.value ? InsuranceType.value.Code : null,
            datestart = DateStart.value ? moment(DateStart.value).format('YYYY-MM-DD 00:00:00') : null,
            dateend = DateEnd.value ? moment(DateEnd.value).format('YYYY-MM-DD 00:00:00') : null,
            recordDate = RecordDate.value ? moment(RecordDate.value).format('YYYY-MM-DD 00:00:00') : null,
            childSickId = null;

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Ins_GetData/RealDayCount', {
            ProfileIDs: profiles,
            InsuranceType: insuranceCode,
            DateStart: datestart,
            DateEnd: dateend,
            RecordDate: recordDate,
            ChildSickID: childSickId
        }).then((data) => {
            VnrLoadingSevices.hide();

            if (data) {
                this.setState({
                    DayCount: {
                        ...DayCount,
                        value: data ? data.toString() : null,
                        refresh: !DayCount.refresh
                    }
                });
            }
        });
    };

    render() {
        const {
                ParentID,
                InsuranceType,
                IDNoV2,
                IsAdjust,
                PreviousApproveDate,
                SettlementTime,
                InsuranceCodeV2,
                DateOfBirth,
                MonthYearSettlement,
                strSettlement,
                AdditionalMonthYearSettlement,
                AdditionalSettlementString,
                SeriNo,
                InsRecordCode,
                DateStart,
                DateEnd,
                DoctorDateStart,
                DoctorDateEnd,
                DayCount,
                RecordDate,
                InsuranceTime,
                RelativesID,
                ChildHealthInsNo,
                PaymentMethod,
                AccountNumber,
                BankID,
                BranchID,
                Amount,
                DocumentLink,
                FileAttachment,
                DateStartWorking,
                DatePregnancy,
                EstimateDueDate,
                AntenatalCareCondition,
                ChildbirthCondition,
                ChildInsuranceCode,
                FoetusAge,
                DateSuckle,
                ChildLostDate,
                ChildrenNumber,
                NumberOfLostChild,
                AdoptionDate,
                SurrogacyAdoptionDate,
                CommentIR,
                WifeID,
                MotherSocialInsuranceNumer,
                MotherHealthInsuranceCardNumber,
                MotherIDNumber,
                IsMaternityLeave,
                SurrogacyType,
                IsSurgeryOrUnder32Weeks,
                MotherLostDate,
                ConclusionDate,
                MedicalExaminationFees,
                NurturerSocialInsuranceNumer,
                IsFatherTakeCareOfChild,
                AdjustmentReason,
                TreatmentLineID,
                NumberOfChildSick,
                Diagnose,
                SickName,
                Reason,
                WeeklyDayOff,
                WorkingCondition,
                HealthDeclineRate,
                DiagnosticDate,
                TypeData,
                fieldValid,
                modalErrorDetail
            } = this.state,
            {
                textLableInfo,
                contentViewControl,
                viewLable,
                viewControl
            } = stylesListPickerControl,
            stylesDetailV2 = stylesScreenDetailV2;

        //#region [Xử lý 3 nút lưu]
        const listActions = [];

        // eslint-disable-next-line no-constant-condition
        if (false) {
            listActions.push({
                type: EnumName.E_SAVE_SENMAIL,
                title: translate('HRM_Common_SaveAndSendMail'),
                onPress: () => this.onSaveAndSend(this.props.navigation)
            });
        }

        // eslint-disable-next-line no-constant-condition
        if (true) {
            listActions.push({
                type: EnumName.E_SAVE_CLOSE,
                title: translate('HRM_Common_SaveClose'),
                onPress: () => this.onSave(this.props.navigation)
            });
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styleSheets.container}>
                    <KeyboardAwareScrollView
                        keyboardShouldPersistTaps={'handled'}
                        contentContainerStyle={CustomStyleSheet.flexGrow(1)}
                    >
                        {/* Nhóm chứng từ - ParentID */}
                        {ParentID.visibleConfig && ParentID.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={ParentID.label} />

                                    {/* valid ParentID */}
                                    {fieldValid.ParentID && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTreeView
                                        api={{
                                            urlApi: '[URI_HR]/Ins_GetData/GetInsRecordTypeFolderTree',
                                            type: 'E_GET'
                                        }}
                                        disable={ParentID.disable}
                                        value={ParentID.value}
                                        refresh={ParentID.refresh}
                                        isCheckChildren={false}
                                        valueField={'Code'}
                                        textField={'Name'}
                                        onSelect={(items) => this.treeViewResult(items)}
                                    />
                                </View>
                            </View>
                        )}

                        {/* Loại chứng từ - InsuranceType */}
                        {InsuranceType.visibleConfig && InsuranceType.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={InsuranceType.label} />

                                    {/* valid InsuranceType */}
                                    {fieldValid.InsuranceType && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        dataLocal={InsuranceType.data}
                                        textField={InsuranceType.textField}
                                        valueField={InsuranceType.valueField}
                                        refresh={InsuranceType.refresh}
                                        filter={true}
                                        value={InsuranceType.value}
                                        filterServer={false}
                                        disable={InsuranceType.disable}
                                        onFinish={(item) =>
                                            this.setState(
                                                {
                                                    InsuranceType: {
                                                        ...InsuranceType,
                                                        value: item,
                                                        refresh: !InsuranceType.refresh
                                                    }
                                                },
                                                () => this.changeDivclass()
                                            )
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Số CMND/CCCD - IDNoV2 */}
                        {IDNoV2.visibleConfig && IDNoV2.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={IDNoV2.label} />
                                    {fieldValid.IDNoV2 && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={true}
                                        refresh={IDNoV2.refresh}
                                        value={IDNoV2.value}
                                        onChangeText={(text) =>
                                            this.setState({
                                                IDNoV2: {
                                                    ...IDNoV2,
                                                    value: text,
                                                    refresh: !IDNoV2.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Điều chỉnh - IsAdjust */}
                        {IsAdjust.visibleConfig && IsAdjust.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={IsAdjust.label} />

                                    {/* valid IsAdjust */}
                                    {fieldValid.IsAdjust && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <CheckBox
                                        isChecked={IsAdjust.value}
                                        disable={IsAdjust.disable}
                                        onClick={() =>
                                            this.setState({
                                                IsAdjust: {
                                                    ...IsAdjust,
                                                    value: !IsAdjust.value,
                                                    refresh: !IsAdjust.refresh
                                                },
                                                PreviousApproveDate: {
                                                    ...PreviousApproveDate,
                                                    visible: !IsAdjust.value,
                                                    refresh: !PreviousApproveDate.refresh
                                                },
                                                AdditionalMonthYearSettlement: {
                                                    ...AdditionalMonthYearSettlement,
                                                    visible: !IsAdjust.value,
                                                    refresh: !AdditionalMonthYearSettlement.refresh
                                                },
                                                AdditionalSettlementString: {
                                                    ...AdditionalSettlementString,
                                                    visible: !IsAdjust.value,
                                                    refresh: !AdditionalSettlementString.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Từ ngày duyệt trước - PreviousApproveDate */}
                        {PreviousApproveDate.visible && PreviousApproveDate.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={PreviousApproveDate.label}
                                    />

                                    {/* valid PreviousApproveDate */}
                                    {fieldValid.PreviousApproveDate && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        disable={PreviousApproveDate.disable}
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={PreviousApproveDate.value}
                                        refresh={PreviousApproveDate.refresh}
                                        type={'date'}
                                        onFinish={(value) =>
                                            this.setState({
                                                PreviousApproveDate: {
                                                    ...PreviousApproveDate,
                                                    value,
                                                    refresh: !PreviousApproveDate.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Lần giải quyết - SettlementTime */}
                        {SettlementTime.visibleConfig && SettlementTime.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={SettlementTime.label} />
                                    {fieldValid.SeriNo && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={SettlementTime.disable}
                                        refresh={SettlementTime.refresh}
                                        value={SettlementTime.value}
                                        onChangeText={(text) =>
                                            this.setState({
                                                SettlementTime: {
                                                    ...SettlementTime,
                                                    value: text,
                                                    refresh: !SettlementTime.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Mã số BHXH - InsuranceCodeV2 */}
                        {InsuranceCodeV2.visibleConfig && InsuranceCodeV2.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={InsuranceCodeV2.label}
                                    />
                                    {fieldValid.SeriNo && <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />}
                                </View>
                                <View style={viewControl}>
                                    <VnrTextInput
                                        disable={true}
                                        refresh={InsuranceCodeV2.refresh}
                                        value={InsuranceCodeV2.value}
                                        onChangeText={(text) =>
                                            this.setState({
                                                InsuranceCodeV2: {
                                                    ...InsuranceCodeV2,
                                                    value: text,
                                                    refresh: !InsuranceCodeV2.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Ngày sinh - DateOfBirth */}
                        {DateOfBirth.visible && DateOfBirth.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={DateOfBirth.label} />

                                    {/* valid DateOfBirth */}
                                    {fieldValid.DateOfBirth && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        disable={true}
                                        response={'string'}
                                        format={'DD/MM/YYYY'}
                                        value={DateOfBirth.value}
                                        refresh={DateOfBirth.refresh}
                                        type={'date'}
                                        onFinish={(value) =>
                                            this.setState({
                                                DateOfBirth: {
                                                    ...DateOfBirth,
                                                    value,
                                                    refresh: !DateOfBirth.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Tháng đề nghị - MonthYearSettlement */}
                        {MonthYearSettlement.visible && MonthYearSettlement.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={MonthYearSettlement.label}
                                    />

                                    {/* valid MonthYearSettlement */}
                                    {fieldValid.MonthYearSettlement && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        disable={MonthYearSettlement.disable}
                                        response={'string'}
                                        format={'MM/YYYY'}
                                        value={MonthYearSettlement.value}
                                        refresh={MonthYearSettlement.refresh}
                                        type={'date'}
                                        onFinish={(value) =>
                                            this.setState({
                                                MonthYearSettlement: {
                                                    ...MonthYearSettlement,
                                                    value,
                                                    refresh: !MonthYearSettlement.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Lần đề nghị - strSettlement */}
                        {strSettlement.visibleConfig && strSettlement.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={strSettlement.label} />

                                    {/* valid strSettlement */}
                                    {fieldValid.strSettlement && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={strSettlement.api}
                                        textField={strSettlement.textField}
                                        valueField={strSettlement.valueField}
                                        refresh={strSettlement.refresh}
                                        filter={true}
                                        value={strSettlement.value}
                                        filterServer={false}
                                        disable={strSettlement.disable}
                                        onFinish={(item) =>
                                            this.setState({
                                                strSettlement: {
                                                    ...strSettlement,
                                                    value: item,
                                                    refresh: !strSettlement.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Tháng bổ sung - AdditionalMonthYearSettlement */}
                        {AdditionalMonthYearSettlement.visible && AdditionalMonthYearSettlement.visibleConfig && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={AdditionalMonthYearSettlement.label}
                                    />

                                    {/* valid DateStart */}
                                    {fieldValid.AdditionalMonthYearSettlement && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrDate
                                        disable={AdditionalMonthYearSettlement.disable}
                                        response={'string'}
                                        format={'MM/YYYY'}
                                        value={AdditionalMonthYearSettlement.value}
                                        refresh={AdditionalMonthYearSettlement.refresh}
                                        type={'date'}
                                        onFinish={(value) =>
                                            this.setState(
                                                {
                                                    AdditionalMonthYearSettlement: {
                                                        ...AdditionalMonthYearSettlement,
                                                        value,
                                                        refresh: !AdditionalMonthYearSettlement.refresh
                                                    }
                                                },
                                                () => this.fnGetWeeklyDaysOff()
                                            )
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        {/* Lần bổ sung - AdditionalSettlementString */}
                        {AdditionalSettlementString.visibleConfig && AdditionalSettlementString.visible && (
                            <View style={contentViewControl}>
                                <View style={viewLable}>
                                    <VnrText
                                        style={[styleSheets.text, textLableInfo]}
                                        i18nKey={AdditionalSettlementString.label}
                                    />

                                    {/* valid AdditionalSettlementString */}
                                    {fieldValid.AdditionalSettlementString && (
                                        <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                    )}
                                </View>
                                <View style={viewControl}>
                                    <VnrPicker
                                        api={AdditionalSettlementString.api}
                                        textField={AdditionalSettlementString.textField}
                                        valueField={AdditionalSettlementString.valueField}
                                        refresh={AdditionalSettlementString.refresh}
                                        filter={true}
                                        value={AdditionalSettlementString.value}
                                        filterServer={AdditionalSettlementString.filterServer}
                                        filterParams={AdditionalSettlementString.filterParam}
                                        disable={AdditionalSettlementString.disable}
                                        onFinish={(item) =>
                                            this.setState({
                                                AdditionalSettlementString: {
                                                    ...AdditionalSettlementString,
                                                    value: item,
                                                    refresh: !AdditionalSettlementString.refresh
                                                }
                                            })
                                        }
                                    />
                                </View>
                            </View>
                        )}

                        <View
                            style={[
                                stylesDetailV2.styItemContentGroup,
                                {
                                    paddingHorizontal: Size.defineSpace
                                }
                            ]}
                        >
                            <View style={styleSheets.viewLable}>
                                <VnrText
                                    style={[styleSheets.text, stylesDetailV2.styTextGroup]}
                                    i18nKey={'HRM_Insurance_InsuranceRecord_AdditionalInformation'}
                                />
                            </View>
                        </View>

                        {InsuranceType.value && InsuranceType.value.Code.includes('E_SICK') && (
                            <View>
                                {/* Tuyến điều trị - TreatmentLineID */}
                                {TreatmentLineID.visibleConfig && TreatmentLineID.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={TreatmentLineID.label}
                                            />

                                            {/* valid TreatmentLineID */}
                                            {fieldValid.TreatmentLineID && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                api={TreatmentLineID.api}
                                                textField={TreatmentLineID.textField}
                                                valueField={TreatmentLineID.valueField}
                                                refresh={TreatmentLineID.refresh}
                                                filter={true}
                                                value={TreatmentLineID.value}
                                                filterServer={TreatmentLineID.filterServer}
                                                filterParams={TreatmentLineID.filterParam}
                                                disable={TreatmentLineID.disable}
                                                onFinish={(item) =>
                                                    this.setState({
                                                        TreatmentLineID: {
                                                            ...TreatmentLineID,
                                                            value: item,
                                                            refresh: !TreatmentLineID.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Số seri - SeriNo */}
                                {SeriNo.visibleConfig && SeriNo.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={SeriNo.label} />
                                            {fieldValid.SeriNo && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={SeriNo.disable}
                                                refresh={SeriNo.refresh}
                                                value={SeriNo.value}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        SeriNo: {
                                                            ...SeriNo,
                                                            value: text,
                                                            refresh: !SeriNo.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Mã chứng từ - InsRecordCode*/}
                                {InsRecordCode.visibleConfig && InsRecordCode.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={InsRecordCode.label}
                                            />
                                            {fieldValid.InsRecordCode && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={InsRecordCode.disable}
                                                refresh={InsRecordCode.refresh}
                                                value={InsRecordCode.value}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        InsRecordCode: {
                                                            ...InsRecordCode,
                                                            value: text,
                                                            refresh: !InsRecordCode.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ngày bắt đầu - DateStart */}
                                {DateStart.visible && DateStart.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DateStart.label}
                                            />

                                            {/* valid DateStart */}
                                            {fieldValid.DateStart && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={DateStart.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DateStart.value}
                                                refresh={DateStart.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState(
                                                        {
                                                            DateStart: {
                                                                ...DateStart,
                                                                value,
                                                                refresh: !DateStart.refresh
                                                            }
                                                        },
                                                        () => this.fnGetWeeklyDaysOff()
                                                    )
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ngày kết thúc - DateEnd */}
                                {DateStart.visible && DateEnd.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DateEnd.label}
                                            />

                                            {/* valid DateEnd */}
                                            {fieldValid.DateEnd && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={DateEnd.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DateEnd.value}
                                                refresh={DateEnd.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState(
                                                        {
                                                            DateEnd: {
                                                                ...DateEnd,
                                                                value,
                                                                refresh: !DateEnd.refresh
                                                            }
                                                        },
                                                        () => this.fnChangeDateEnd_SickView()
                                                    )
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Từ ngày BS đề nghị - DoctorDateStart */}
                                {DoctorDateStart.visible && DoctorDateStart.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DoctorDateStart.label}
                                            />

                                            {/* valid DoctorDateStart */}
                                            {fieldValid.DoctorDateStart && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={DoctorDateStart.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DoctorDateStart.value}
                                                refresh={DoctorDateStart.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState({
                                                        DoctorDateStart: {
                                                            ...DoctorDateStart,
                                                            value,
                                                            refresh: !DoctorDateStart.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Đến ngày BS đề nghị - DoctorDateEnd */}
                                {DoctorDateEnd.visible && DoctorDateEnd.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DoctorDateEnd.label}
                                            />

                                            {/* valid DoctorDateEnd */}
                                            {fieldValid.DoctorDateEnd && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={DoctorDateEnd.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DoctorDateEnd.value}
                                                refresh={DoctorDateEnd.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState({
                                                        DoctorDateEnd: {
                                                            ...DoctorDateEnd,
                                                            value,
                                                            refresh: !DoctorDateEnd.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Số ngày - DayCount */}
                                {DayCount.visible && DayCount.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DayCount.label}
                                            />

                                            {/* valid DateStart */}
                                            {fieldValid.DayCount && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <View style={styles.styleValueManualLeave}>
                                                <VnrTextInput
                                                    styles={CustomStyleSheet.flex(1)}
                                                    value={DayCount.value}
                                                    refresh={DayCount.refresh}
                                                    disable={DayCount.disable}
                                                    keyboardType={'numeric'}
                                                    charType={'double'}
                                                    returnKeyType={'done'}
                                                    onChangeText={(value) => {
                                                        this.setState({
                                                            DayCount: {
                                                                ...DayCount,
                                                                value: value
                                                            }
                                                        });
                                                    }}
                                                />
                                            </View>

                                            <View style={styles.viewStyleDayPortal}>
                                                <TouchableOpacity
                                                    onPress={() => this.fnCalcDayCountV2()}
                                                    style={styles.bntSearchManualLeave}
                                                >
                                                    <VnrText
                                                        style={[styleSheets.lable, { color: Colors.white }]}
                                                        i18nKey={'HRM_Common_Calculate'}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                )}

                                {/* Ngày nhận chứng từ - RecordDate */}
                                {RecordDate.visible && RecordDate.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={RecordDate.label}
                                            />

                                            {/* valid RecordDate */}
                                            {fieldValid.RecordDate && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={RecordDate.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={RecordDate.value}
                                                refresh={RecordDate.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState({
                                                        RecordDate: {
                                                            ...RecordDate,
                                                            value,
                                                            refresh: !RecordDate.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Thời điểm - InsuranceTime */}
                                {InsuranceTime.visible && InsuranceTime.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={InsuranceTime.label}
                                            />

                                            {/* valid InsuranceTime */}
                                            {fieldValid.InsuranceTime && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={InsuranceTime.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={InsuranceTime.value}
                                                refresh={InsuranceTime.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState({
                                                        InsuranceTime: {
                                                            ...InsuranceTime,
                                                            value,
                                                            refresh: !InsuranceTime.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Con - RelativesID */}
                                {RelativesID.visibleConfig && RelativesID.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={RelativesID.label}
                                            />

                                            {/* valid RelativesID */}
                                            {fieldValid.RelativesID && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                dataLocal={RelativesID.data}
                                                refresh={RelativesID.refresh}
                                                textField={RelativesID.textField}
                                                valueField={RelativesID.valueField}
                                                filter={true}
                                                value={RelativesID.value}
                                                filterServer={false}
                                                disable={RelativesID.disable}
                                                onFinish={(item) =>
                                                    this.setState(
                                                        {
                                                            RelativesID: {
                                                                ...RelativesID,
                                                                value: item,
                                                                refresh: !RelativesID.refresh
                                                            }
                                                        },
                                                        () => this.fnChangeChild()
                                                    )
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ngày sinh con - DateSuckle */}
                                {DateSuckle.visibleConfig && DateSuckle.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DateSuckle.label}
                                            />

                                            {/* valid DateSuckle */}
                                            {fieldValid.DateSuckle && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={DateSuckle.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DateSuckle.value}
                                                refresh={DateSuckle.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState({
                                                        DateSuckle: {
                                                            ...DateSuckle,
                                                            value,
                                                            refresh: !DateSuckle.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Số thẻ BHYT của con - ChildHealthInsNo*/}
                                {ChildHealthInsNo.visibleConfig && ChildHealthInsNo.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={ChildHealthInsNo.label}
                                            />
                                            {fieldValid.ChildHealthInsNo && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={ChildHealthInsNo.disable}
                                                refresh={ChildHealthInsNo.refresh}
                                                value={ChildHealthInsNo.value}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        ChildHealthInsNo: {
                                                            ...ChildHealthInsNo,
                                                            value: text,
                                                            refresh: !ChildHealthInsNo.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Số con bị ốm - NumberOfChildSick */}
                                {NumberOfChildSick.visible && NumberOfChildSick.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={NumberOfChildSick.label}
                                            />

                                            {/* valid NumberOfChildSick */}
                                            {fieldValid.NumberOfChildSick && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                value={NumberOfChildSick.value}
                                                refresh={NumberOfChildSick.refresh}
                                                disable={NumberOfChildSick.disable}
                                                keyboardType={'numeric'}
                                                charType={'double'}
                                                returnKeyType={'done'}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        NumberOfChildSick: {
                                                            ...NumberOfChildSick,
                                                            value: value,
                                                            refresh: !NumberOfChildSick.refresh
                                                        }
                                                    });
                                                }}
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Chẩn đoán - Diagnose*/}
                                {Diagnose.visibleConfig && Diagnose.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={Diagnose.label}
                                            />
                                            {fieldValid.Diagnose && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={Diagnose.disable}
                                                refresh={Diagnose.refresh}
                                                value={Diagnose.value}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        Diagnose: {
                                                            ...Diagnose,
                                                            value: text,
                                                            refresh: !Diagnose.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Bệnh - SickName */}
                                {SickName.visibleConfig && SickName.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={SickName.label}
                                            />

                                            {/* valid SickName */}
                                            {fieldValid.SickName && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrAutoComplete
                                                api={SickName.api}
                                                autoBind={true}
                                                value={SickName.value}
                                                refresh={SickName.refresh}
                                                textField={SickName.textField}
                                                valueField={SickName.valueField}
                                                filter={true}
                                                filterServer={false}
                                                autoFilter={true}
                                                onFinish={(item) =>
                                                    this.setState({
                                                        SickName: {
                                                            ...SickName,
                                                            value: item,
                                                            refresh: !SickName.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Nguyên nhân - Reason */}
                                {Reason.visibleConfig && Reason.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Reason.label} />
                                            {fieldValid.Reason && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={Reason.disable}
                                                refresh={Reason.refresh}
                                                value={Reason.value}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        Reason: {
                                                            ...Reason,
                                                            value: text,
                                                            refresh: !Reason.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Nghỉ dưỡng thai - IsMaternityLeave */}
                                {IsMaternityLeave.visibleConfig && IsMaternityLeave.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={IsMaternityLeave.label}
                                            />

                                            {/* valid IsMaternityLeave */}
                                            {fieldValid.IsMaternityLeave && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <CheckBox
                                                isChecked={IsMaternityLeave.value}
                                                disable={IsMaternityLeave.disable}
                                                onClick={() =>
                                                    this.setState({
                                                        IsMaternityLeave: {
                                                            ...IsMaternityLeave,
                                                            value: !IsMaternityLeave.value,
                                                            refresh: !IsMaternityLeave.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ngày nghỉ hàng tuần - WeeklyDayOff*/}
                                {WeeklyDayOff.visibleConfig && WeeklyDayOff.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={WeeklyDayOff.label}
                                            />

                                            {/* valid WeeklyDayOff */}
                                            {fieldValid.WeeklyDayOff && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPickerMulti
                                                api={WeeklyDayOff.api}
                                                refresh={WeeklyDayOff.refresh}
                                                textField={WeeklyDayOff.textField}
                                                valueField={WeeklyDayOff.valueField}
                                                filter={true}
                                                value={WeeklyDayOff.value}
                                                filterServer={false}
                                                disable={WeeklyDayOff.disable}
                                                onFinish={(items) =>
                                                    this.setState({
                                                        WeeklyDayOff: {
                                                            ...WeeklyDayOff,
                                                            value: items,
                                                            refresh: !WeeklyDayOff.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Điều kiện làm việc - WorkingCondition */}
                                {WorkingCondition.visibleConfig && WorkingCondition.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={WorkingCondition.label}
                                            />

                                            {/* valid WorkingCondition */}
                                            {fieldValid.WorkingCondition && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                api={WorkingCondition.api}
                                                refresh={WorkingCondition.refresh}
                                                textField={WorkingCondition.textField}
                                                valueField={WorkingCondition.valueField}
                                                filter={true}
                                                value={WorkingCondition.value}
                                                filterServer={false}
                                                disable={WorkingCondition.disable}
                                                onFinish={(item) =>
                                                    this.setState({
                                                        WorkingCondition: {
                                                            ...WorkingCondition,
                                                            value: item,
                                                            refresh: !WorkingCondition.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Hình thức nhận - PaymentMethod */}
                                {PaymentMethod.visibleConfig && PaymentMethod.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={PaymentMethod.label}
                                            />

                                            {/* valid PaymentMethod */}
                                            {fieldValid.PaymentMethod && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                api={PaymentMethod.api}
                                                refresh={PaymentMethod.refresh}
                                                textField={PaymentMethod.textField}
                                                valueField={PaymentMethod.valueField}
                                                filter={true}
                                                value={PaymentMethod.value}
                                                filterServer={false}
                                                disable={PaymentMethod.disable}
                                                onFinish={(item) =>
                                                    this.setState({
                                                        PaymentMethod: {
                                                            ...PaymentMethod,
                                                            value: item,
                                                            refresh: !PaymentMethod.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Số tài khoản -  AccountNumber*/}
                                {AccountNumber.visibleConfig && AccountNumber.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={AccountNumber.label}
                                            />
                                            {fieldValid.AccountNumber && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={AccountNumber.disable}
                                                refresh={AccountNumber.refresh}
                                                value={AccountNumber.value}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        AccountNumber: {
                                                            ...AccountNumber,
                                                            value: text,
                                                            refresh: !AccountNumber.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ngân hàng - BankID */}
                                {BankID.visibleConfig && BankID.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={BankID.label} />

                                            {/* valid BankID */}
                                            {fieldValid.BankID && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                api={BankID.api}
                                                refresh={BankID.refresh}
                                                textField={BankID.textField}
                                                valueField={BankID.valueField}
                                                filter={true}
                                                value={BankID.value}
                                                filterServer={BankID.filterServer}
                                                filterParam={BankID.filterParam}
                                                disable={BankID.disable}
                                                onFinish={(item) =>
                                                    this.setState(
                                                        {
                                                            BankID: {
                                                                ...BankID,
                                                                value: item,
                                                                refresh: !BankID.refresh
                                                            }
                                                        },
                                                        () => this.onChangeBankID()
                                                    )
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Chi nhánh - BranchID*/}
                                {BranchID.visibleConfig && BranchID.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={BranchID.label}
                                            />
                                            {fieldValid.BranchID && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                dataLocal={BranchID.data}
                                                refresh={BranchID.refresh}
                                                textField={BranchID.textField}
                                                valueField={BranchID.valueField}
                                                filter={true}
                                                filterServer={false}
                                                value={BranchID.value}
                                                disable={BranchID.disable}
                                                onFinish={(item) =>
                                                    this.setState({
                                                        BranchID: {
                                                            ...BranchID,
                                                            value: item,
                                                            refresh: !BranchID.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Số tiền - Amount */}
                                {Amount.visible && Amount.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText style={[styleSheets.text, textLableInfo]} i18nKey={Amount.label} />

                                            {/* valid Amount */}
                                            {fieldValid.Amount && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                value={Amount.value}
                                                refresh={Amount.refresh}
                                                disable={Amount.disable}
                                                keyboardType={'numeric'}
                                                charType={'money'}
                                                returnKeyType={'done'}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        Amount: {
                                                            ...Amount,
                                                            value: value,
                                                            refresh: !Amount.refresh
                                                        }
                                                    });
                                                }}
                                                onBlur={this.onChangeRegisterHours}
                                                onSubmitEditing={this.onChangeRegisterHours}
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ghi chú - CommentIR*/}
                                {CommentIR.visibleConfig && CommentIR.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={CommentIR.label}
                                            />
                                            {fieldValid.CommentIR && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={CommentIR.disable}
                                                refresh={CommentIR.refresh}
                                                value={CommentIR.value}
                                                multiline={true}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        CommentIR: {
                                                            ...CommentIR,
                                                            value: text,
                                                            refresh: !CommentIR.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Đường dẫn văn bản - DocumentLink*/}
                                {DocumentLink.visibleConfig && DocumentLink.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DocumentLink.label}
                                            />
                                            {fieldValid.DocumentLink && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={DocumentLink.disable}
                                                refresh={DocumentLink.refresh}
                                                value={DocumentLink.value}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        DocumentLink: {
                                                            ...DocumentLink,
                                                            value: text,
                                                            refresh: !DocumentLink.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* File đính kèm - FileAttachment */}
                                {FileAttachment.visible && FileAttachment.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={FileAttachment.label}
                                            />
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
                                                uri={'[URI_POR]/New_Home/saveFileFromAppInsuranceRecord'}
                                                onFinish={(file) => {
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
                            </View>
                        )}

                        {InsuranceType.value &&
                            (InsuranceType.value.Code.includes('E_ACCIDENT') ||
                                InsuranceType.value.Code.includes('E_RESTORATION')) && (
                            <View>
                                {/* Ngày đi làm lại - DateStartWorking */}
                                {DateStartWorking.visible && DateStartWorking.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DateStartWorking.label}
                                            />

                                            {/* valid DateStartWorking */}
                                            {fieldValid.DateStartWorking && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={DateStartWorking.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DateStartWorking.value}
                                                refresh={DateStartWorking.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState(
                                                        {
                                                            DateStartWorking: {
                                                                ...DateStartWorking,
                                                                value,
                                                                refresh: !DateStartWorking.refresh
                                                            }
                                                        },
                                                        () => this.fnGetWeeklyDaysOff()
                                                    )
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Số seri - SeriNo */}
                                {SeriNo.visibleConfig && SeriNo.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={SeriNo.label}
                                            />
                                            {fieldValid.SeriNo && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={SeriNo.disable}
                                                refresh={SeriNo.refresh}
                                                value={SeriNo.value}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        SeriNo: {
                                                            ...SeriNo,
                                                            value: text,
                                                            refresh: !SeriNo.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Mã chứng từ - InsRecordCode*/}
                                {InsRecordCode.visibleConfig && InsRecordCode.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={InsRecordCode.label}
                                            />
                                            {fieldValid.InsRecordCode && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={InsRecordCode.disable}
                                                refresh={InsRecordCode.refresh}
                                                value={InsRecordCode.value}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        InsRecordCode: {
                                                            ...InsRecordCode,
                                                            value: text,
                                                            refresh: !InsRecordCode.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ngày bắt đầu - DateStart */}
                                {DateStart.visible && DateStart.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DateStart.label}
                                            />

                                            {/* valid DateStart */}
                                            {fieldValid.DateStart && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={DateStart.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DateStart.value}
                                                refresh={DateStart.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState(
                                                        {
                                                            DateStart: {
                                                                ...DateStart,
                                                                value,
                                                                refresh: !DateStart.refresh
                                                            }
                                                        },
                                                        () => this.fnGetWeeklyDaysOff()
                                                    )
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ngày kết thúc - DateEnd */}
                                {DateStart.visible && DateEnd.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DateEnd.label}
                                            />

                                            {/* valid DateEnd */}
                                            {fieldValid.DateEnd && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={DateEnd.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DateEnd.value}
                                                refresh={DateEnd.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState(
                                                        {
                                                            DateEnd: {
                                                                ...DateEnd,
                                                                value,
                                                                refresh: !DateEnd.refresh
                                                            }
                                                        },
                                                        () => this.fnChangeDateEnd_SickView()
                                                    )
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Từ ngày BS đề nghị - DoctorDateStart */}
                                {DoctorDateStart.visible && DoctorDateStart.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DoctorDateStart.label}
                                            />

                                            {/* valid DoctorDateStart */}
                                            {fieldValid.DoctorDateStart && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={DoctorDateStart.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DoctorDateStart.value}
                                                refresh={DoctorDateStart.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState({
                                                        DoctorDateStart: {
                                                            ...DoctorDateStart,
                                                            value,
                                                            refresh: !DoctorDateStart.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Đến ngày BS đề nghị - DoctorDateEnd */}
                                {DoctorDateEnd.visible && DoctorDateEnd.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DoctorDateEnd.label}
                                            />

                                            {/* valid DoctorDateEnd */}
                                            {fieldValid.DoctorDateEnd && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={DoctorDateEnd.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DoctorDateEnd.value}
                                                refresh={DoctorDateEnd.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState({
                                                        DoctorDateEnd: {
                                                            ...DoctorDateEnd,
                                                            value,
                                                            refresh: !DoctorDateEnd.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Số ngày - DayCount */}
                                {DayCount.visible && DayCount.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DayCount.label}
                                            />

                                            {/* valid DateStart */}
                                            {fieldValid.DayCount && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <View style={styles.styleValueManualLeave}>
                                                <VnrTextInput
                                                    value={DayCount.value}
                                                    refresh={DayCount.refresh}
                                                    disable={DayCount.disable}
                                                    keyboardType={'numeric'}
                                                    charType={'double'}
                                                    returnKeyType={'done'}
                                                    onChangeText={(value) => {
                                                        this.setState({
                                                            DayCount: {
                                                                ...DayCount,
                                                                value: value
                                                            }
                                                        });
                                                    }}
                                                />
                                            </View>

                                            <View style={styles.viewStyleDayPortal}>
                                                <TouchableOpacity
                                                    onPress={() => this.fnCalcDayCountV2()}
                                                    style={styles.bntSearchManualLeave}
                                                >
                                                    <VnrText
                                                        style={[styleSheets.lable, { color: Colors.white }]}
                                                        i18nKey={'HRM_Common_Calculate'}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                )}

                                {/* Ngày nhận chứng từ - RecordDate */}
                                {RecordDate.visible && RecordDate.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={RecordDate.label}
                                            />

                                            {/* valid RecordDate */}
                                            {fieldValid.RecordDate && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={RecordDate.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={RecordDate.value}
                                                refresh={RecordDate.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState({
                                                        RecordDate: {
                                                            ...RecordDate,
                                                            value,
                                                            refresh: !RecordDate.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Thời điểm - InsuranceTime */}
                                {InsuranceTime.visible && InsuranceTime.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={InsuranceTime.label}
                                            />

                                            {/* valid InsuranceTime */}
                                            {fieldValid.InsuranceTime && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={InsuranceTime.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={InsuranceTime.value}
                                                refresh={InsuranceTime.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState({
                                                        InsuranceTime: {
                                                            ...InsuranceTime,
                                                            value,
                                                            refresh: !InsuranceTime.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Tỉ lệ suy giảm - HealthDeclineRate */}
                                {HealthDeclineRate.visible && HealthDeclineRate.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={HealthDeclineRate.label}
                                            />

                                            {/* valid HealthDeclineRate */}
                                            {fieldValid.HealthDeclineRate && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                value={HealthDeclineRate.value}
                                                refresh={HealthDeclineRate.refresh}
                                                disable={HealthDeclineRate.disable}
                                                keyboardType={'numeric'}
                                                charType={'double'}
                                                returnKeyType={'done'}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        HealthDeclineRate: {
                                                            ...HealthDeclineRate,
                                                            value: value,
                                                            refresh: !HealthDeclineRate.refresh
                                                        }
                                                    });
                                                }}
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ngày giám định - DiagnosticDate */}
                                {DiagnosticDate.visibleConfig && DiagnosticDate.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DiagnosticDate.label}
                                            />

                                            {/* valid DiagnosticDate */}
                                            {fieldValid.DiagnosticDate && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={DiagnosticDate.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DiagnosticDate.value}
                                                refresh={DiagnosticDate.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState({
                                                        DiagnosticDate: {
                                                            ...DiagnosticDate,
                                                            value,
                                                            refresh: !DiagnosticDate.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ghi chú - CommentIR*/}
                                {CommentIR.visibleConfig && CommentIR.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={CommentIR.label}
                                            />
                                            {fieldValid.CommentIR && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={CommentIR.disable}
                                                refresh={CommentIR.refresh}
                                                value={CommentIR.value}
                                                multiline={true}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        CommentIR: {
                                                            ...CommentIR,
                                                            value: text,
                                                            refresh: !CommentIR.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Nơi dưỡng sức - TypeData */}
                                {TypeData.visibleConfig && TypeData.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={TypeData.label}
                                            />

                                            {/* valid TypeData */}
                                            {fieldValid.TypeData && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                api={TypeData.api}
                                                refresh={TypeData.refresh}
                                                textField={TypeData.textField}
                                                valueField={TypeData.valueField}
                                                filter={true}
                                                value={TypeData.value}
                                                filterServer={false}
                                                disable={TypeData.disable}
                                                onFinish={(item) =>
                                                    this.setState({
                                                        TypeData: {
                                                            ...TypeData,
                                                            value: item,
                                                            refresh: !TypeData.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Lý do đề nghị điều chỉnh - AdjustmentReason*/}
                                {AdjustmentReason.visibleConfig && AdjustmentReason.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={AdjustmentReason.label}
                                            />
                                            {fieldValid.AdjustmentReason && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={AdjustmentReason.disable}
                                                refresh={AdjustmentReason.refresh}
                                                value={AdjustmentReason.value}
                                                multiline={true}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        AdjustmentReason: {
                                                            ...AdjustmentReason,
                                                            value: text,
                                                            refresh: !AdjustmentReason.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Hình thức nhận - PaymentMethod */}
                                {PaymentMethod.visibleConfig && PaymentMethod.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={PaymentMethod.label}
                                            />

                                            {/* valid PaymentMethod */}
                                            {fieldValid.PaymentMethod && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                api={PaymentMethod.api}
                                                refresh={PaymentMethod.refresh}
                                                textField={PaymentMethod.textField}
                                                valueField={PaymentMethod.valueField}
                                                filter={true}
                                                value={PaymentMethod.value}
                                                filterServer={false}
                                                disable={PaymentMethod.disable}
                                                onFinish={(item) =>
                                                    this.setState({
                                                        PaymentMethod: {
                                                            ...PaymentMethod,
                                                            value: item,
                                                            refresh: !PaymentMethod.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Số tài khoản -  AccountNumber*/}
                                {AccountNumber.visibleConfig && AccountNumber.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={AccountNumber.label}
                                            />
                                            {fieldValid.AccountNumber && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={AccountNumber.disable}
                                                refresh={AccountNumber.refresh}
                                                value={AccountNumber.value}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        AccountNumber: {
                                                            ...AccountNumber,
                                                            value: text,
                                                            refresh: !AccountNumber.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ngân hàng - BankID */}
                                {BankID.visibleConfig && BankID.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={BankID.label}
                                            />

                                            {/* valid BankID */}
                                            {fieldValid.BankID && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                api={BankID.api}
                                                refresh={BankID.refresh}
                                                textField={BankID.textField}
                                                valueField={BankID.valueField}
                                                filter={true}
                                                value={BankID.value}
                                                filterServer={BankID.filterServer}
                                                filterParam={BankID.filterParam}
                                                disable={BankID.disable}
                                                onFinish={(item) =>
                                                    this.setState(
                                                        {
                                                            BankID: {
                                                                ...BankID,
                                                                value: item,
                                                                refresh: !BankID.refresh
                                                            }
                                                        },
                                                        () => this.onChangeBankID()
                                                    )
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Chi nhánh - BranchID*/}
                                {BranchID.visibleConfig && BranchID.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={BranchID.label}
                                            />
                                            {fieldValid.BranchID && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                dataLocal={BranchID.data}
                                                refresh={BranchID.refresh}
                                                textField={BranchID.textField}
                                                valueField={BranchID.valueField}
                                                filter={true}
                                                filterServer={false}
                                                value={BranchID.value}
                                                disable={BranchID.disable}
                                                onFinish={(item) =>
                                                    this.setState({
                                                        BranchID: {
                                                            ...BranchID,
                                                            value: item,
                                                            refresh: !BranchID.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Số tiền - Amount */}
                                {Amount.visible && Amount.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={Amount.label}
                                            />

                                            {/* valid Amount */}
                                            {fieldValid.Amount && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                value={Amount.value}
                                                refresh={Amount.refresh}
                                                disable={Amount.disable}
                                                keyboardType={'numeric'}
                                                charType={'money'}
                                                returnKeyType={'done'}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        Amount: {
                                                            ...Amount,
                                                            value: value,
                                                            refresh: !Amount.refresh
                                                        }
                                                    });
                                                }}
                                                onBlur={this.onChangeRegisterHours}
                                                onSubmitEditing={this.onChangeRegisterHours}
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Đường dẫn văn bản - DocumentLink*/}
                                {DocumentLink.visibleConfig && DocumentLink.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DocumentLink.label}
                                            />
                                            {fieldValid.DocumentLink && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={DocumentLink.disable}
                                                refresh={DocumentLink.refresh}
                                                value={DocumentLink.value}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        DocumentLink: {
                                                            ...DocumentLink,
                                                            value: text,
                                                            refresh: !DocumentLink.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* File đính kèm - FileAttachment */}
                                {FileAttachment.visible && FileAttachment.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={FileAttachment.label}
                                            />
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
                                                uri={'[URI_POR]/New_Home/saveFileFromAppInsuranceRecord'}
                                                onFinish={(file) => {
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
                            </View>
                        )}

                        {InsuranceType.value &&
                            (InsuranceType.value.Code.includes('E_SUCKLE') ||
                                InsuranceType.value.Code.includes('E_PREGNANCY') ||
                                InsuranceType.value.Code.includes('E_CHILD') ||
                                InsuranceType.value.Code.includes('E_PRENANCY_SURGERY_LESS_32_WEEKS')) && (
                            <View>
                                {/* Ngày đi làm lại - DateStartWorking */}
                                {DateStartWorking.visible && DateStartWorking.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DateStartWorking.label}
                                            />

                                            {/* valid DateStartWorking */}
                                            {fieldValid.DateStartWorking && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={DateStartWorking.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DateStartWorking.value}
                                                refresh={DateStartWorking.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState(
                                                        {
                                                            DateStartWorking: {
                                                                ...DateStartWorking,
                                                                value,
                                                                refresh: !DateStartWorking.refresh
                                                            }
                                                        },
                                                        () => this.fnGetWeeklyDaysOff()
                                                    )
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Số seri - SeriNo */}
                                {SeriNo.visibleConfig && SeriNo.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={SeriNo.label}
                                            />
                                            {fieldValid.SeriNo && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={SeriNo.disable}
                                                refresh={SeriNo.refresh}
                                                value={SeriNo.value}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        SeriNo: {
                                                            ...SeriNo,
                                                            value: text,
                                                            refresh: !SeriNo.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Mã chứng từ - InsRecordCode*/}
                                {InsRecordCode.visibleConfig && InsRecordCode.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={InsRecordCode.label}
                                            />
                                            {fieldValid.InsRecordCode && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={InsRecordCode.disable}
                                                refresh={InsRecordCode.refresh}
                                                value={InsRecordCode.value}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        InsRecordCode: {
                                                            ...InsRecordCode,
                                                            value: text,
                                                            refresh: !InsRecordCode.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ngày bắt đầu - DateStart */}
                                {DateStart.visible && DateStart.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DateStart.label}
                                            />

                                            {/* valid DateStart */}
                                            {fieldValid.DateStart && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={DateStart.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DateStart.value}
                                                refresh={DateStart.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState(
                                                        {
                                                            DateStart: {
                                                                ...DateStart,
                                                                value,
                                                                refresh: !DateStart.refresh
                                                            }
                                                        },
                                                        () => {
                                                            this.fnGetWeeklyDaysOff();
                                                            this.getRelativeListByProfileIDAndDateStartEnd();
                                                        }
                                                    )
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ngày kết thúc - DateEnd */}
                                {DateStart.visible && DateEnd.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DateEnd.label}
                                            />

                                            {/* valid DateEnd */}
                                            {fieldValid.DateEnd && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={DateEnd.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DateEnd.value}
                                                refresh={DateEnd.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState(
                                                        {
                                                            DateEnd: {
                                                                ...DateEnd,
                                                                value,
                                                                refresh: !DateEnd.refresh
                                                            }
                                                        },
                                                        () => {
                                                            this.fnChangeDateEnd_SickView();
                                                            this.getRelativeListByProfileIDAndDateStartEnd();
                                                        }
                                                    )
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Từ ngày BS đề nghị - DoctorDateStart */}
                                {DoctorDateStart.visible && DoctorDateStart.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DoctorDateStart.label}
                                            />

                                            {/* valid DoctorDateStart */}
                                            {fieldValid.DoctorDateStart && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={DoctorDateStart.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DoctorDateStart.value}
                                                refresh={DoctorDateStart.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState({
                                                        DoctorDateStart: {
                                                            ...DoctorDateStart,
                                                            value,
                                                            refresh: !DoctorDateStart.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Đến ngày BS đề nghị - DoctorDateEnd */}
                                {DoctorDateEnd.visible && DoctorDateEnd.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DoctorDateEnd.label}
                                            />

                                            {/* valid DoctorDateEnd */}
                                            {fieldValid.DoctorDateEnd && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={DoctorDateEnd.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DoctorDateEnd.value}
                                                refresh={DoctorDateEnd.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState({
                                                        DoctorDateEnd: {
                                                            ...DoctorDateEnd,
                                                            value,
                                                            refresh: !DoctorDateEnd.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Số ngày - DayCount */}
                                {DayCount.visible && DayCount.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DayCount.label}
                                            />

                                            {/* valid DateStart */}
                                            {fieldValid.DayCount && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <View style={styles.styleValueManualLeave}>
                                                <VnrTextInput
                                                    value={DayCount.value}
                                                    refresh={DayCount.refresh}
                                                    disable={DayCount.disable}
                                                    keyboardType={'numeric'}
                                                    charType={'double'}
                                                    returnKeyType={'done'}
                                                    onChangeText={(value) => {
                                                        this.setState({
                                                            DayCount: {
                                                                ...DayCount,
                                                                value: value
                                                            }
                                                        });
                                                    }}
                                                />
                                            </View>

                                            <View style={styles.viewStyleDayPortal}>
                                                <TouchableOpacity
                                                    onPress={() => this.fnCalcDayCountV2()}
                                                    style={styles.bntSearchManualLeave}
                                                >
                                                    <VnrText
                                                        style={[styleSheets.lable, { color: Colors.white }]}
                                                        i18nKey={'HRM_Common_Calculate'}
                                                    />
                                                </TouchableOpacity>
                                            </View>
                                        </View>
                                    </View>
                                )}

                                {/* Ngày nhận chứng từ - RecordDate */}
                                {RecordDate.visible && RecordDate.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={RecordDate.label}
                                            />

                                            {/* valid RecordDate */}
                                            {fieldValid.RecordDate && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={RecordDate.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={RecordDate.value}
                                                refresh={RecordDate.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState({
                                                        RecordDate: {
                                                            ...RecordDate,
                                                            value,
                                                            refresh: !RecordDate.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Thời điểm - InsuranceTime */}
                                {InsuranceTime.visible && InsuranceTime.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={InsuranceTime.label}
                                            />

                                            {/* valid InsuranceTime */}
                                            {fieldValid.InsuranceTime && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={InsuranceTime.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={InsuranceTime.value}
                                                refresh={InsuranceTime.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState({
                                                        InsuranceTime: {
                                                            ...InsuranceTime,
                                                            value,
                                                            refresh: !InsuranceTime.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ngày mang thai - DatePregnancy */}
                                {DatePregnancy.visibleConfig && DatePregnancy.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DatePregnancy.label}
                                            />

                                            {/* valid DatePregnancy */}
                                            {fieldValid.DatePregnancy && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={DatePregnancy.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DatePregnancy.value}
                                                refresh={DatePregnancy.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState({
                                                        DatePregnancy: {
                                                            ...DatePregnancy,
                                                            value,
                                                            refresh: !DatePregnancy.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ngày dự sinh - EstimateDueDate */}
                                {EstimateDueDate.visibleConfig && EstimateDueDate.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={EstimateDueDate.label}
                                            />

                                            {/* valid EstimateDueDate */}
                                            {fieldValid.EstimateDueDate && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={EstimateDueDate.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={EstimateDueDate.value}
                                                refresh={EstimateDueDate.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState({
                                                        EstimateDueDate: {
                                                            ...EstimateDueDate,
                                                            value,
                                                            refresh: !EstimateDueDate.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Điều kiện khám thai - AntenatalCareCondition */}
                                {AntenatalCareCondition.visibleConfig && AntenatalCareCondition.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={AntenatalCareCondition.label}
                                            />

                                            {/* valid AntenatalCareCondition */}
                                            {fieldValid.AntenatalCareCondition && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                api={AntenatalCareCondition.api}
                                                refresh={AntenatalCareCondition.refresh}
                                                textField={AntenatalCareCondition.textField}
                                                valueField={AntenatalCareCondition.valueField}
                                                filter={true}
                                                value={AntenatalCareCondition.value}
                                                filterServer={false}
                                                disable={AntenatalCareCondition.disable}
                                                onFinish={(item) =>
                                                    this.setState({
                                                        AntenatalCareCondition: {
                                                            ...AntenatalCareCondition,
                                                            value: item,
                                                            refresh: !AntenatalCareCondition.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Điều kiện sinh con - ChildbirthCondition */}
                                {ChildbirthCondition.visibleConfig && ChildbirthCondition.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={ChildbirthCondition.label}
                                            />

                                            {/* valid ChildbirthCondition */}
                                            {fieldValid.ChildbirthCondition && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                api={ChildbirthCondition.api}
                                                refresh={ChildbirthCondition.refresh}
                                                textField={ChildbirthCondition.textField}
                                                valueField={ChildbirthCondition.valueField}
                                                filter={true}
                                                value={ChildbirthCondition.value}
                                                filterServer={false}
                                                disable={ChildbirthCondition.disable}
                                                onFinish={(item) =>
                                                    this.setState({
                                                        ChildbirthCondition: {
                                                            ...ChildbirthCondition,
                                                            value: item,
                                                            refresh: !ChildbirthCondition.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Con - RelativesID */}
                                {RelativesID.visibleConfig && RelativesID.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={RelativesID.label}
                                            />

                                            {/* valid RelativesID */}
                                            {fieldValid.RelativesID && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                dataLocal={RelativesID.data}
                                                refresh={RelativesID.refresh}
                                                textField={RelativesID.textField}
                                                valueField={RelativesID.valueField}
                                                filter={true}
                                                value={RelativesID.value}
                                                filterServer={false}
                                                disable={RelativesID.disable}
                                                onFinish={(item) =>
                                                    this.setState(
                                                        {
                                                            RelativesID: {
                                                                ...RelativesID,
                                                                value: item,
                                                                refresh: !RelativesID.refresh
                                                            }
                                                        },
                                                        () => this.fnChangeChild('E_PREG_VIEW')
                                                    )
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Mã số BHXH của con - ChildInsuranceCode*/}
                                {ChildInsuranceCode.visibleConfig && ChildInsuranceCode.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={ChildInsuranceCode.label}
                                            />
                                            {fieldValid.ChildInsuranceCode && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={ChildInsuranceCode.disable}
                                                refresh={ChildInsuranceCode.refresh}
                                                value={ChildInsuranceCode.value}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        ChildInsuranceCode: {
                                                            ...ChildInsuranceCode,
                                                            value: text,
                                                            refresh: !ChildInsuranceCode.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Số thẻ BHYT của con - ChildHealthInsNo*/}
                                {ChildHealthInsNo.visibleConfig && ChildHealthInsNo.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={ChildHealthInsNo.label}
                                            />
                                            {fieldValid.ChildHealthInsNo && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={ChildHealthInsNo.disable}
                                                refresh={ChildHealthInsNo.refresh}
                                                value={ChildHealthInsNo.value}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        ChildHealthInsNo: {
                                                            ...ChildHealthInsNo,
                                                            value: text,
                                                            refresh: !ChildHealthInsNo.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Tuổi thai - FoetusAge */}
                                {FoetusAge.visible && FoetusAge.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={FoetusAge.label}
                                            />

                                            {/* valid FoetusAge */}
                                            {fieldValid.FoetusAge && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                value={FoetusAge.value}
                                                refresh={FoetusAge.refresh}
                                                disable={FoetusAge.disable}
                                                keyboardType={'numeric'}
                                                charType={'double'}
                                                returnKeyType={'done'}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        FoetusAge: {
                                                            ...FoetusAge,
                                                            value: value,
                                                            refresh: !FoetusAge.refresh
                                                        }
                                                    });
                                                }}
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ngày sinh con - DateSuckle */}
                                {DateSuckle.visibleConfig && DateSuckle.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DateSuckle.label}
                                            />

                                            {/* valid DateSuckle */}
                                            {fieldValid.DateSuckle && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={DateSuckle.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={DateSuckle.value}
                                                refresh={DateSuckle.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState({
                                                        DateSuckle: {
                                                            ...DateSuckle,
                                                            value,
                                                            refresh: !DateSuckle.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ngày con chết - ChildLostDate */}
                                {ChildLostDate.visibleConfig && ChildLostDate.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={ChildLostDate.label}
                                            />

                                            {/* valid ChildLostDate */}
                                            {fieldValid.ChildLostDate && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={ChildLostDate.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={ChildLostDate.value}
                                                refresh={ChildLostDate.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState({
                                                        ChildLostDate: {
                                                            ...ChildLostDate,
                                                            value,
                                                            refresh: !ChildLostDate.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Số con - ChildrenNumber */}
                                {ChildrenNumber.visible && ChildrenNumber.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={ChildrenNumber.label}
                                            />

                                            {/* valid ChildrenNumber */}
                                            {fieldValid.ChildrenNumber && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                value={ChildrenNumber.value}
                                                refresh={ChildrenNumber.refresh}
                                                disable={ChildrenNumber.disable}
                                                keyboardType={'numeric'}
                                                charType={'double'}
                                                returnKeyType={'done'}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        ChildrenNumber: {
                                                            ...ChildrenNumber,
                                                            value: value,
                                                            refresh: !ChildrenNumber.refresh
                                                        }
                                                    });
                                                }}
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Số con chết - NumberOfLostChild */}
                                {NumberOfLostChild.visible && NumberOfLostChild.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={NumberOfLostChild.label}
                                            />

                                            {/* valid NumberOfLostChild */}
                                            {fieldValid.NumberOfLostChild && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                value={NumberOfLostChild.value}
                                                refresh={NumberOfLostChild.refresh}
                                                disable={NumberOfLostChild.disable}
                                                keyboardType={'numeric'}
                                                charType={'double'}
                                                returnKeyType={'done'}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        NumberOfLostChild: {
                                                            ...NumberOfLostChild,
                                                            value: value,
                                                            refresh: !NumberOfLostChild.refresh
                                                        }
                                                    });
                                                }}
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ngày nhận nuôi con nuôi - AdoptionDate */}
                                {AdoptionDate.visibleConfig && AdoptionDate.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={AdoptionDate.label}
                                            />

                                            {/* valid AdoptionDate */}
                                            {fieldValid.AdoptionDate && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={AdoptionDate.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={AdoptionDate.value}
                                                refresh={AdoptionDate.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState({
                                                        AdoptionDate: {
                                                            ...AdoptionDate,
                                                            value,
                                                            refresh: !AdoptionDate.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ngày nhận con (Mang thai hộ) - SurrogacyAdoptionDate */}
                                {SurrogacyAdoptionDate.visibleConfig && SurrogacyAdoptionDate.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={SurrogacyAdoptionDate.label}
                                            />

                                            {/* valid SurrogacyAdoptionDate */}
                                            {fieldValid.SurrogacyAdoptionDate && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={SurrogacyAdoptionDate.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={SurrogacyAdoptionDate.value}
                                                refresh={SurrogacyAdoptionDate.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState({
                                                        SurrogacyAdoptionDate: {
                                                            ...SurrogacyAdoptionDate,
                                                            value,
                                                            refresh: !SurrogacyAdoptionDate.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ghi chú - CommentIR*/}
                                {CommentIR.visibleConfig && CommentIR.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={CommentIR.label}
                                            />
                                            {fieldValid.CommentIR && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={CommentIR.disable}
                                                refresh={CommentIR.refresh}
                                                value={CommentIR.value}
                                                multiline={true}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        CommentIR: {
                                                            ...CommentIR,
                                                            value: text,
                                                            refresh: !CommentIR.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ngày nghỉ hàng tuần - WeeklyDayOff*/}
                                {WeeklyDayOff.visibleConfig && WeeklyDayOff.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={WeeklyDayOff.label}
                                            />

                                            {/* valid WeeklyDayOff */}
                                            {fieldValid.WeeklyDayOff && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPickerMulti
                                                api={WeeklyDayOff.api}
                                                refresh={WeeklyDayOff.refresh}
                                                textField={WeeklyDayOff.textField}
                                                valueField={WeeklyDayOff.valueField}
                                                filter={true}
                                                value={WeeklyDayOff.value}
                                                filterServer={false}
                                                disable={WeeklyDayOff.disable}
                                                onFinish={(items) =>
                                                    this.setState({
                                                        WeeklyDayOff: {
                                                            ...WeeklyDayOff,
                                                            value: items,
                                                            refresh: !WeeklyDayOff.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Vợ - WifeID */}
                                {WifeID.visibleConfig && WifeID.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={WifeID.label}
                                            />

                                            {/* valid WifeID */}
                                            {fieldValid.WifeID && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                dataLocal={WifeID.data}
                                                refresh={WifeID.refresh}
                                                textField={WifeID.textField}
                                                valueField={WifeID.valueField}
                                                filter={true}
                                                value={WifeID.value}
                                                filterServer={false}
                                                disable={WifeID.disable}
                                                onFinish={(item) =>
                                                    this.setState(
                                                        {
                                                            WifeID: {
                                                                ...WifeID,
                                                                value: item,
                                                                refresh: !WifeID.refresh
                                                            }
                                                        },
                                                        () => this.fnChangeWife()
                                                    )
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Mã số BHXH của mẹ - MotherSocialInsuranceNumer */}
                                {MotherSocialInsuranceNumer.visibleConfig && MotherSocialInsuranceNumer.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={MotherSocialInsuranceNumer.label}
                                            />
                                            {fieldValid.MotherSocialInsuranceNumer && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={MotherSocialInsuranceNumer.disable}
                                                refresh={MotherSocialInsuranceNumer.refresh}
                                                value={MotherSocialInsuranceNumer.value}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        MotherSocialInsuranceNumer: {
                                                            ...MotherSocialInsuranceNumer,
                                                            value: text,
                                                            refresh: !MotherSocialInsuranceNumer.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Số thẻ BHYT của mẹ - MotherHealthInsuranceCardNumber */}
                                {MotherHealthInsuranceCardNumber.visibleConfig &&
                                        MotherHealthInsuranceCardNumber.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={MotherHealthInsuranceCardNumber.label}
                                            />
                                            {fieldValid.MotherHealthInsuranceCardNumber && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={MotherHealthInsuranceCardNumber.disable}
                                                refresh={MotherHealthInsuranceCardNumber.refresh}
                                                value={MotherHealthInsuranceCardNumber.value}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        MotherHealthInsuranceCardNumber: {
                                                            ...MotherHealthInsuranceCardNumber,
                                                            value: text,
                                                            refresh: !MotherHealthInsuranceCardNumber.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Số CMND của mẹ - MotherIDNumber */}
                                {MotherIDNumber.visibleConfig && MotherIDNumber.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={MotherIDNumber.label}
                                            />
                                            {fieldValid.MotherIDNumber && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={MotherIDNumber.disable}
                                                refresh={MotherIDNumber.refresh}
                                                value={MotherIDNumber.value}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        MotherIDNumber: {
                                                            ...MotherIDNumber,
                                                            value: text,
                                                            refresh: !MotherIDNumber.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Nghỉ dưỡng thai - IsMaternityLeave */}
                                {IsMaternityLeave.visibleConfig && IsMaternityLeave.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={IsMaternityLeave.label}
                                            />

                                            {/* valid IsMaternityLeave */}
                                            {fieldValid.IsMaternityLeave && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <CheckBox
                                                isChecked={IsMaternityLeave.value}
                                                disable={IsMaternityLeave.disable}
                                                onClick={() =>
                                                    this.setState({
                                                        IsMaternityLeave: {
                                                            ...IsMaternityLeave,
                                                            value: !IsMaternityLeave.value,
                                                            refresh: !IsMaternityLeave.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Mang thai hộ - SurrogacyType */}
                                {SurrogacyType.visibleConfig && SurrogacyType.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={SurrogacyType.label}
                                            />

                                            {/* valid SurrogacyType */}
                                            {fieldValid.SurrogacyType && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                api={SurrogacyType.api}
                                                refresh={SurrogacyType.refresh}
                                                textField={SurrogacyType.textField}
                                                valueField={SurrogacyType.valueField}
                                                filter={true}
                                                value={SurrogacyType.value}
                                                filterServer={false}
                                                disable={SurrogacyType.disable}
                                                onFinish={(item) =>
                                                    this.setState({
                                                        SurrogacyType: {
                                                            ...SurrogacyType,
                                                            value: item,
                                                            refresh: !SurrogacyType.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Phẫu thuật hoặc thai dưới 32 tuần - IsSurgeryOrUnder32Weeks */}
                                {IsSurgeryOrUnder32Weeks.visibleConfig && IsSurgeryOrUnder32Weeks.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={IsSurgeryOrUnder32Weeks.label}
                                            />

                                            {/* valid IsSurgeryOrUnder32Weeks */}
                                            {fieldValid.IsSurgeryOrUnder32Weeks && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <CheckBox
                                                isChecked={IsSurgeryOrUnder32Weeks.value}
                                                disable={IsSurgeryOrUnder32Weeks.disable}
                                                onClick={() =>
                                                    this.setState({
                                                        IsSurgeryOrUnder32Weeks: {
                                                            ...IsSurgeryOrUnder32Weeks,
                                                            value: !IsSurgeryOrUnder32Weeks.value,
                                                            refresh: !IsSurgeryOrUnder32Weeks.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ngày mẹ chết - MotherLostDate */}
                                {MotherLostDate.visibleConfig && MotherLostDate.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={MotherLostDate.label}
                                            />

                                            {/* valid MotherLostDate */}
                                            {fieldValid.MotherLostDate && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={MotherLostDate.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={MotherLostDate.value}
                                                refresh={MotherLostDate.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState({
                                                        MotherLostDate: {
                                                            ...MotherLostDate,
                                                            value,
                                                            refresh: !MotherLostDate.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ngày kết luận mẹ không đủ điều kiện chăm con - ConclusionDate */}
                                {ConclusionDate.visibleConfig && ConclusionDate.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={ConclusionDate.label}
                                            />

                                            {/* valid ConclusionDate */}
                                            {fieldValid.ConclusionDate && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrDate
                                                disable={ConclusionDate.disable}
                                                response={'string'}
                                                format={'DD/MM/YYYY'}
                                                value={ConclusionDate.value}
                                                refresh={ConclusionDate.refresh}
                                                type={'date'}
                                                onFinish={(value) =>
                                                    this.setState({
                                                        ConclusionDate: {
                                                            ...ConclusionDate,
                                                            value,
                                                            refresh: !ConclusionDate.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Phí giám định y khoa - MedicalExaminationFees */}
                                {MedicalExaminationFees.visible && MedicalExaminationFees.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={MedicalExaminationFees.label}
                                            />

                                            {/* valid MedicalExaminationFees */}
                                            {fieldValid.MedicalExaminationFees && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                value={MedicalExaminationFees.value}
                                                refresh={MedicalExaminationFees.refresh}
                                                disable={MedicalExaminationFees.disable}
                                                keyboardType={'numeric'}
                                                charType={'double'}
                                                returnKeyType={'done'}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        MedicalExaminationFees: {
                                                            ...MedicalExaminationFees,
                                                            value: value,
                                                            refresh: !MedicalExaminationFees.refresh
                                                        }
                                                    });
                                                }}
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Mã số BHXH của người nuôi dưỡng - NurturerSocialInsuranceNumer */}
                                {NurturerSocialInsuranceNumer.visibleConfig &&
                                        NurturerSocialInsuranceNumer.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={NurturerSocialInsuranceNumer.label}
                                            />
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={NurturerSocialInsuranceNumer.disable}
                                                refresh={NurturerSocialInsuranceNumer.refresh}
                                                value={NurturerSocialInsuranceNumer.value}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        NurturerSocialInsuranceNumer: {
                                                            ...NurturerSocialInsuranceNumer,
                                                            value: text,
                                                            refresh: !NurturerSocialInsuranceNumer.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Cha nghỉ chăm con - IsFatherTakeCareOfChild */}
                                {IsFatherTakeCareOfChild.visibleConfig && IsFatherTakeCareOfChild.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={IsFatherTakeCareOfChild.label}
                                            />
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={IsFatherTakeCareOfChild.disable}
                                                refresh={IsFatherTakeCareOfChild.refresh}
                                                value={IsFatherTakeCareOfChild.value}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        IsFatherTakeCareOfChild: {
                                                            ...IsFatherTakeCareOfChild,
                                                            value: text,
                                                            refresh: !IsFatherTakeCareOfChild.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Lý do đề nghị điều chỉnh - AdjustmentReason */}
                                {AdjustmentReason.visibleConfig && AdjustmentReason.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={AdjustmentReason.label}
                                            />
                                            {fieldValid.AdjustmentReason && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={AdjustmentReason.disable}
                                                refresh={AdjustmentReason.refresh}
                                                value={AdjustmentReason.value}
                                                multiFile={true}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        AdjustmentReason: {
                                                            ...AdjustmentReason,
                                                            value: text,
                                                            refresh: !AdjustmentReason.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Hình thức nhận - PaymentMethod */}
                                {PaymentMethod.visibleConfig && PaymentMethod.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={PaymentMethod.label}
                                            />

                                            {/* valid PaymentMethod */}
                                            {fieldValid.PaymentMethod && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                api={PaymentMethod.api}
                                                refresh={PaymentMethod.refresh}
                                                textField={PaymentMethod.textField}
                                                valueField={PaymentMethod.valueField}
                                                filter={true}
                                                value={PaymentMethod.value}
                                                filterServer={false}
                                                disable={PaymentMethod.disable}
                                                onFinish={(item) =>
                                                    this.setState({
                                                        PaymentMethod: {
                                                            ...PaymentMethod,
                                                            value: item,
                                                            refresh: !PaymentMethod.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Số tài khoản -  AccountNumber*/}
                                {AccountNumber.visibleConfig && AccountNumber.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={AccountNumber.label}
                                            />
                                            {fieldValid.AccountNumber && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={AccountNumber.disable}
                                                refresh={AccountNumber.refresh}
                                                value={AccountNumber.value}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        AccountNumber: {
                                                            ...AccountNumber,
                                                            value: text,
                                                            refresh: !AccountNumber.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Ngân hàng - BankID */}
                                {BankID.visibleConfig && BankID.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={BankID.label}
                                            />

                                            {/* valid BankID */}
                                            {fieldValid.BankID && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                api={BankID.api}
                                                refresh={BankID.refresh}
                                                textField={BankID.textField}
                                                valueField={BankID.valueField}
                                                filter={true}
                                                value={BankID.value}
                                                filterServer={BankID.filterServer}
                                                filterParam={BankID.filterParam}
                                                disable={BankID.disable}
                                                onFinish={(item) =>
                                                    this.setState(
                                                        {
                                                            BankID: {
                                                                ...BankID,
                                                                value: item,
                                                                refresh: !BankID.refresh
                                                            }
                                                        },
                                                        () => this.onChangeBankID()
                                                    )
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Chi nhánh - BranchID*/}
                                {BranchID.visibleConfig && BranchID.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={BranchID.label}
                                            />
                                            {fieldValid.BranchID && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrPicker
                                                dataLocal={BranchID.data}
                                                refresh={BranchID.refresh}
                                                textField={BranchID.textField}
                                                valueField={BranchID.valueField}
                                                filter={true}
                                                filterServer={false}
                                                value={BranchID.value}
                                                disable={BranchID.disable}
                                                onFinish={(item) =>
                                                    this.setState({
                                                        BranchID: {
                                                            ...BranchID,
                                                            value: item,
                                                            refresh: !BranchID.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Số tiền - Amount */}
                                {Amount.visible && Amount.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={Amount.label}
                                            />

                                            {/* valid Amount */}
                                            {fieldValid.Amount && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                value={Amount.value}
                                                refresh={Amount.refresh}
                                                disable={Amount.disable}
                                                keyboardType={'numeric'}
                                                charType={'money'}
                                                returnKeyType={'done'}
                                                onChangeText={(value) => {
                                                    this.setState({
                                                        Amount: {
                                                            ...Amount,
                                                            value: value,
                                                            refresh: !Amount.refresh
                                                        }
                                                    });
                                                }}
                                                onBlur={this.onChangeRegisterHours}
                                                onSubmitEditing={this.onChangeRegisterHours}
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* Đường dẫn văn bản - DocumentLink*/}
                                {DocumentLink.visibleConfig && DocumentLink.visible && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={DocumentLink.label}
                                            />
                                            {fieldValid.DocumentLink && (
                                                <VnrText style={styleValid} i18nKey={'HRM_Valid_Char'} />
                                            )}
                                        </View>
                                        <View style={viewControl}>
                                            <VnrTextInput
                                                disable={DocumentLink.disable}
                                                refresh={DocumentLink.refresh}
                                                value={DocumentLink.value}
                                                onChangeText={(text) =>
                                                    this.setState({
                                                        DocumentLink: {
                                                            ...DocumentLink,
                                                            value: text,
                                                            refresh: !DocumentLink.refresh
                                                        }
                                                    })
                                                }
                                            />
                                        </View>
                                    </View>
                                )}

                                {/* File đính kèm - FileAttachment */}
                                {FileAttachment.visible && FileAttachment.visibleConfig && (
                                    <View style={contentViewControl}>
                                        <View style={viewLable}>
                                            <VnrText
                                                style={[styleSheets.text, textLableInfo]}
                                                i18nKey={FileAttachment.label}
                                            />
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
                                                uri={'[URI_POR]/New_Home/saveFileFromAppInsuranceRecord'}
                                                onFinish={(file) => {
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
                            </View>
                        )}
                    </KeyboardAwareScrollView>

                    <ListButtonSave listActions={listActions} />

                    {modalErrorDetail.isModalVisible && (
                        <Modal
                            onBackButtonPress={() => this.closeModalErrorDetail()}
                            isVisible={true}
                            onBackdropPress={() => this.closeModalErrorDetail()}
                            customBackdrop={
                                <TouchableWithoutFeedback onPress={() => this.closeModalErrorDetail()}>
                                    <View
                                        style={styles.styModalBackdrop}
                                    />
                                </TouchableWithoutFeedback>
                            }
                            style={CustomStyleSheet.margin(0)}
                        >
                            <View style={stylesModalPopupBottom.viewModal}>
                                <SafeAreaView {...styleSafeAreaView} style={stylesModalPopupBottom.safeRadius}>
                                    <View style={styles.headerCloseModal}>
                                        <IconColse color={Colors.white} size={Size.iconSize} />
                                        <VnrText
                                            style={styleSheets.lable}
                                            i18nKey={'HRM_Attendance_Message_ViolationNotification'}
                                        />
                                        <TouchableOpacity onPress={() => this.closeModalErrorDetail()}>
                                            <IconColse color={Colors.grey} size={Size.iconSize} />
                                        </TouchableOpacity>
                                    </View>
                                    <ScrollView style={styles.scrollViewError}>{this.renderErrorDetail()}</ScrollView>
                                    <View style={styles.groupButton}>
                                        <TouchableOpacity
                                            onPress={() => this.closeModalErrorDetail()}
                                            style={styles.btnClose}
                                        >
                                            <VnrText
                                                style={[styleSheets.lable, { color: Colors.white }]}
                                                i18nKey={'HRM_Common_Close'}
                                            />
                                        </TouchableOpacity>
                                    </View>
                                </SafeAreaView>
                            </View>
                        </Modal>
                    )}
                </View>
            </SafeAreaView>
        );
    }

    fnChangeWife = () => {
        const { WifeID, MotherSocialInsuranceNumer, MotherHealthInsuranceCardNumber, MotherIDNumber } = this.state;
        let wife = WifeID.value;

        if (wife && wife.ID) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Ins_GetData/getInfoByWifeID', { relativeID: wife.ID }).then((data) => {
                VnrLoadingSevices.hide();

                if (data != null) {
                    let nextState = {};
                    if (data.SocialInsNo) {
                        nextState = {
                            ...nextState,
                            MotherSocialInsuranceNumer: {
                                ...MotherSocialInsuranceNumer,
                                value: data.SocialInsNo,
                                disable: true,
                                refresh: !MotherSocialInsuranceNumer.refresh
                            }
                        };
                    } else {
                        nextState = {
                            ...nextState,
                            MotherSocialInsuranceNumer: {
                                ...MotherSocialInsuranceNumer,
                                value: null,
                                disable: false,
                                refresh: !MotherSocialInsuranceNumer.refresh
                            }
                        };
                    }

                    if (data.HealthInsNo) {
                        nextState = {
                            ...nextState,
                            MotherHealthInsuranceCardNumber: {
                                ...MotherHealthInsuranceCardNumber,
                                value: data.HealthInsNo,
                                disable: true,
                                refresh: !MotherHealthInsuranceCardNumber.refresh
                            }
                        };
                    } else {
                        nextState = {
                            ...nextState,
                            MotherHealthInsuranceCardNumber: {
                                ...MotherHealthInsuranceCardNumber,
                                value: null,
                                disable: false,
                                refresh: !MotherHealthInsuranceCardNumber.refresh
                            }
                        };
                    }

                    if (data.IDNo) {
                        nextState = {
                            ...nextState,
                            MotherIDNumber: {
                                ...MotherIDNumber,
                                value: data.IDNo,
                                disable: true,
                                refresh: !MotherIDNumber.refresh
                            }
                        };
                    } else {
                        nextState = {
                            ...nextState,
                            MotherIDNumber: {
                                ...MotherIDNumber,
                                value: null,
                                disable: false,
                                refresh: !MotherIDNumber.refresh
                            }
                        };
                    }

                    this.setState(nextState);
                } else {
                    this.setState({
                        MotherSocialInsuranceNumer: {
                            ...MotherSocialInsuranceNumer,
                            value: null,
                            disable: false,
                            refresh: !MotherSocialInsuranceNumer.refresh
                        },
                        MotherHealthInsuranceCardNumber: {
                            ...MotherHealthInsuranceCardNumber,
                            value: null,
                            disable: false,
                            refresh: !MotherHealthInsuranceCardNumber.refresh
                        },
                        MotherIDNumber: {
                            ...MotherIDNumber,
                            value: null,
                            disable: false,
                            refresh: !MotherIDNumber.refresh
                        }
                    });
                }
            });
        } else {
            this.setState({
                MotherSocialInsuranceNumer: {
                    ...MotherSocialInsuranceNumer,
                    value: null,
                    disable: false,
                    refresh: !MotherSocialInsuranceNumer.refresh
                },
                MotherHealthInsuranceCardNumber: {
                    ...MotherHealthInsuranceCardNumber,
                    value: null,
                    disable: false,
                    refresh: !MotherHealthInsuranceCardNumber.refresh
                },
                MotherIDNumber: {
                    ...MotherIDNumber,
                    value: null,
                    disable: false,
                    refresh: !MotherIDNumber.refresh
                }
            });
        }
    };

    fnChangeChild = () => {
        const { RelativesID, DateSuckle, ChildHealthInsNo, InsuranceType, ChildInsuranceCode } = this.state;
        let nextState = {},
            insuranceCode = InsuranceType.value ? InsuranceType.value.Code : null;

        nextState = {
            ...nextState,
            ChildHealthInsNo: {
                ...ChildHealthInsNo,
                value: null,
                refresh: !ChildHealthInsNo.refresh
            }
        };

        if (insuranceCode != null && insuranceCode.includes('E_SICK')) {
            nextState = {
                ...nextState,
                ChildHealthInsNo: {
                    ...ChildHealthInsNo,
                    value: null,
                    disable: false,
                    refresh: !ChildHealthInsNo.refresh
                },
                DateSuckle: {
                    ...DateSuckle,
                    disable: false,
                    refresh: !DateSuckle.refresh
                }
            };

            if (insuranceCode == 'E_SICK_CHILD') {
                this.setState(nextState, () => {
                    VnrLoadingSevices.show();
                    HttpService.Post('[URI_HR]/Ins_GetData/getYearOfBirhByRelativeID', {
                        relativeid: RelativesID.value ? RelativesID.value.ID : null
                    }).then((data) => {
                        VnrLoadingSevices.hide();

                        const { DateSuckle, ChildHealthInsNo } = this.state;

                        if (data) {
                            this.setState({
                                DateSuckle: {
                                    ...DateSuckle,
                                    value: data.YearOfBirthDateTime,
                                    disable: true,
                                    refresh: !DateSuckle.refresh
                                },
                                ChildHealthInsNo: {
                                    ...ChildHealthInsNo,
                                    value: data.HealthInsNo,
                                    disable: true,
                                    refresh: !ChildHealthInsNo.refresh
                                }
                            });
                        } else {
                            this.setState({
                                DateSuckle: {
                                    ...DateSuckle,
                                    disable: false,
                                    refresh: !DateSuckle.refresh
                                },
                                ChildHealthInsNo: {
                                    ...ChildHealthInsNo,
                                    value: null,
                                    disable: false,
                                    refresh: !ChildHealthInsNo.refresh
                                }
                            });
                        }
                    });
                });
            } else {
                this.setState(nextState);
            }
        } else if (RelativesID.value) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Ins_GetData/getYearOfBirhByRelativeID', {
                relativeid: RelativesID.value ? RelativesID.value.ID : null
            }).then((data) => {
                VnrLoadingSevices.hide();
                if (data) {
                    let nextState = {};

                    if (data.HealthInsNo) {
                        nextState = {
                            ...nextState,
                            ChildHealthInsNo: {
                                ...ChildHealthInsNo,
                                value: data.HealthInsNo,
                                disable: true,
                                refresh: !ChildHealthInsNo.refresh
                            }
                        };
                    } else {
                        nextState = {
                            ...nextState,
                            ChildHealthInsNo: {
                                ...ChildHealthInsNo,
                                value: null,
                                disable: false,
                                refresh: !ChildHealthInsNo.refresh
                            }
                        };
                    }

                    if (data.SocialInsNo) {
                        nextState = {
                            ...nextState,
                            ChildInsuranceCode: {
                                ...ChildInsuranceCode,
                                value: data.SocialInsNo,
                                disable: true,
                                refresh: !ChildInsuranceCode.refresh
                            }
                        };
                    } else {
                        nextState = {
                            ...nextState,
                            ChildInsuranceCode: {
                                ...ChildInsuranceCode,
                                value: null,
                                disable: false,
                                refresh: !ChildInsuranceCode.refresh
                            }
                        };
                    }
                    nextState = {
                        ...nextState,
                        DateSuckle: {
                            ...DateSuckle,
                            value: data.YearOfBirthDateTime,
                            refresh: !DateSuckle.refresh
                        }
                    };

                    this.setState(nextState);
                } else {
                    this.setState({
                        ChildHealthInsNo: {
                            ...ChildHealthInsNo,
                            value: null,
                            disable: false,
                            refresh: !ChildHealthInsNo.refresh
                        },
                        ChildInsuranceCode: {
                            ...ChildInsuranceCode,
                            value: null,
                            disable: false,
                            refresh: !ChildInsuranceCode.refresh
                        },
                        DateSuckle: {
                            ...DateSuckle,
                            value: null,
                            refresh: !DateSuckle.refresh
                        }
                    });
                }
            });
        } else {
            this.setState({
                ChildHealthInsNo: {
                    ...ChildHealthInsNo,
                    value: null,
                    disable: false,
                    refresh: !ChildHealthInsNo.refresh
                },
                ChildInsuranceCode: {
                    ...ChildInsuranceCode,
                    value: null,
                    disable: false,
                    refresh: !ChildInsuranceCode.refresh
                },
                DateSuckle: {
                    ...DateSuckle,
                    value: null,
                    refresh: !DateSuckle.refresh
                }
            });
        }
    };

    initHandleTreeView = (callback, isUpdate = false) => {
        const { InsuranceTypeGroup1, IsMethod, InsuranceType, ParentID } = this.state;

        if (IsMethod) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Ins_GetData/GetMultiInsuranceRecordType_ByParent', {
                text: '',
                Code: '',
                ParentID: '',
                InsuranceType: ParentID.value && ParentID.value[0] ? ParentID.value[0].Code : null,
                InsuranceTypeGroup1: ''
            }).then((data) => {
                VnrLoadingSevices.hide();

                if (data) {
                    this.setState(
                        {
                            InsuranceType: {
                                ...InsuranceType,
                                data: data ? data : [],
                                value: data && data.length == 1 ? { ...data[0] } : null,
                                refresh: !InsuranceType.refresh
                            }
                        },
                        () => {
                            if (callback && typeof callback === 'function') {
                                callback();
                            }

                            this.changeDivclass(isUpdate);
                        }
                    );
                }
            });
        } else {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Ins_GetData/GetMultiInsuranceRecordType_ByParent', {
                text: '',
                Code: ParentID.value && ParentID.value[0] ? ParentID.value[0].Code : null,
                ParentID: ParentID.value && ParentID.value[0] ? ParentID.value[0].id : null,
                InsuranceType: '',
                InsuranceTypeGroup1: InsuranceTypeGroup1
            }).then((data) => {
                VnrLoadingSevices.hide();

                if (data) {
                    this.setState(
                        {
                            InsuranceType: {
                                ...InsuranceType,
                                data: data ? data : [],
                                value: data && data.length == 1 ? { ...data[0] } : null,
                                refresh: !InsuranceType.refresh
                            }
                        },
                        () => {
                            if (callback && typeof callback === 'function') {
                                callback();
                            }

                            this.changeDivclass(isUpdate);
                        }
                    );
                }
            });
        }
    };

    //chọn phòng ban
    treeViewResult = (items) => {
        const { ParentID, IsMethod, InsuranceTypeGroup1 } = this.state;

        this.setState(
            {
                ParentID: {
                    ...ParentID,
                    value: items
                },
                IsMethod: items && items.length ? items[0].IsMethod : IsMethod,
                InsuranceTypeGroup1: items && items.length ? items[0].InsuranceRecordTypeGroup1 : InsuranceTypeGroup1
            },
            () => this.initHandleTreeView()
        );
    };

    changeDivclass = (isUpdate = false) => {
        const { InsuranceType } = this.state,
            insuranceCode = InsuranceType.value ? InsuranceType.value.Code : null;

        this.changeProfileV2(isUpdate);
        this.loadDataConfig();

        if (insuranceCode && insuranceCode.includes('E_SICK')) {
            this.eventChangeSivkView();
        } else if (
            (insuranceCode && insuranceCode.includes('E_ACCIDENT')) ||
            (insuranceCode && insuranceCode.includes('E_RESTORATION'))
        ) {
            this.eventChangeRestoView(insuranceCode);
        } else if (
            (insuranceCode && insuranceCode.includes('E_SUCKLE')) ||
            (insuranceCode && insuranceCode.includes('E_PREGNANCY')) ||
            (insuranceCode && insuranceCode.includes('E_CHILD')) ||
            (insuranceCode && insuranceCode == 'E_PRENANCY_SURGERY_LESS_32_WEEKS')
        ) {
            this.eventChangePregView();
        }
    };

    eventChangePregView = () => {
        const {
            InsuranceType,
            ChildrenNumber,
            IsSurgeryOrUnder32Weeks,
            IsMaternityLeave,
            IsFatherTakeCareOfChild,
            ShowHideFields,
            RelativesID
        } = this.state;
        let insuranceCode = InsuranceType.value ? InsuranceType.value.Code : null,
            objFatherQuit = [
                'E_PREGNANCY_LEAVE_PREG_NORMAL_CASE',
                'E_PRENANCY_SURGERY_LESS_32_WEEKS',
                'E_PREGNANCY_LEAVE_PREG_ABOVE_3',
                'E_SUCKLE_SURGERY_TWINS',
                'E_PREGNANCY_LEAVE_PREG_TWIN'
            ],
            nextState = {
                ShowHideFields,
                RelativesID: {
                    ...RelativesID,
                    disable: false,
                    refresh: !RelativesID.refresh
                }
            };

        if (
            insuranceCode == 'E_PREGNANCY_SUCKLE_ONLY_CHILD' ||
            insuranceCode == 'E_PREGNANCY_SUCKLE_ADOPTION_1_CHILD' ||
            insuranceCode == 'E_PREGNANCY_LEAVE_PREG_NORMAL_CASE'
        ) {
            nextState = {
                ...nextState,
                ChildrenNumber: {
                    ...ChildrenNumber,
                    value: '1',
                    disable: true,
                    refresh: !ChildrenNumber.refresh
                }
            };
        } else if (insuranceCode == 'E_PREGNANCY_SUCKLE_ADOPTION_OVER_2_CHILD' || insuranceCode == 'E_SUCKLE_TWINS') {
            nextState = {
                ...nextState,
                ChildrenNumber: {
                    ...ChildrenNumber,
                    value: '2',
                    disable: false,
                    refresh: !ChildrenNumber.refresh
                }
            };
        }
        // else if ((insuranceCode == 'E_PREGNANCY_SUCKLE_TRIPLE_BORN'
        //   || insuranceCode == 'E_PREGNANCY_LEAVE_PREG_ABOVE_3') && (ID == '00000000-0000-0000-0000-000000000000' || ID == '')) {
        //   nextState = {
        //     ...nextState,
        //     ChildrenNumber: {
        //       ...ChildrenNumber,
        //       value: '3',
        //       refresh: !ChildrenNumber.refresh
        //     }
        //   }
        // }
        else if (insuranceCode == 'E_PRENANCY_SURGERY_LESS_32_WEEKS' || insuranceCode == 'E_SUCKLE_SURGERY_TWINS') {
            nextState = {
                ...nextState,
                IsSurgeryOrUnder32Weeks: {
                    ...IsSurgeryOrUnder32Weeks,
                    value: true,
                    refresh: !IsSurgeryOrUnder32Weeks.refresh
                }
            };
        } else if (insuranceCode == 'E_PREGNANCY_SUCKLE_3_31_CASE') {
            nextState = {
                ...nextState,
                IsMaternityLeave: {
                    ...IsMaternityLeave,
                    value: true,
                    refresh: !IsMaternityLeave.refresh
                }
            };
        }

        if (objFatherQuit.indexOf(insuranceCode) >= 0) {
            nextState = {
                ...nextState,
                IsFatherTakeCareOfChild: {
                    ...IsFatherTakeCareOfChild,
                    value: true,
                    refresh: !IsFatherTakeCareOfChild.refresh
                }
            };
        }

        nextState = this.fnShowField(nextState, insuranceCode);

        let valid = this.getConfigValid(insuranceCode);

        VnrLoadingSevices.show();
        HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + valid).then((res) => {
            VnrLoadingSevices.hide();
            if (res) {
                try {
                    nextState = {
                        ...nextState,
                        fieldValid: res
                    };

                    this.setState(nextState, () => {
                        HttpService.Post('[URI_HR]/Ins_GetData/ValidateCalculateAndGetWeeklyDaysOff', {
                            InsuranceType: insuranceCode
                        }).then((response) => {
                            if (response == 'True') {
                                this.fnCalcDayCountV2_PregView();
                                this.getDataWeekly();
                            }
                        });
                    });
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            }
        });
    };

    fnCalcDayCountV2_PregView = () => {
        const { ProfileID, DayCount, InsuranceType, DateStart, DateEnd, RecordDate } = this.state;
        let profiles = ProfileID.ID,
            insuranceCode = InsuranceType.value ? InsuranceType.value.Code : null,
            datestart = DateStart.value ? moment(DateStart.value).format('YYYY-MM-DD HH:mm:ss') : null,
            dateend = DateEnd.value ? moment(DateEnd.value).format('YYYY-MM-DD HH:mm:ss') : null,
            recordDate = RecordDate.value ? moment(RecordDate.value).format('YYYY-MM-DD HH:mm:ss') : null;

        HttpService.Post('[URI_HR]/Ins_GetData/RealDayCount', {
            ProfileIDs: profiles,
            InsuranceType: insuranceCode,
            DateStart: datestart,
            DateEnd: dateend,
            RecordDate: recordDate,
            ChildSickID: null
        }).then((data) => {
            if (data) {
                this.setState({
                    DayCount: {
                        ...DayCount,
                        value: data.toString(),
                        refresh: !DayCount.refresh
                    }
                });
            }
        });
    };

    eventChangeRestoView = () => {
        const { InsuranceType } = this.state;
        let valid = this.getConfigValid(InsuranceType.value ? InsuranceType.value.Code : null);

        VnrLoadingSevices.show();
        HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + valid).then((res) => {
            VnrLoadingSevices.hide();
            if (res) {
                try {
                    this.setState({ fieldValid: res }, () => {
                        HttpService.Post('[URI_HR]/Ins_GetData/ValidateCalculateAndGetWeeklyDaysOff', {
                            InsuranceType: InsuranceType.value ? InsuranceType.value.Code : null
                        }).then((response) => {
                            if (response == 'True') {
                                this.fnCalcDayCountV2_RestoView();
                            }
                        });
                    });
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            }
        });
    };

    fnCalcDayCountV2_RestoView = () => {
        const { ProfileID, DayCount, InsuranceType, DateStart, DateEnd, RecordDate, ShowHideFields } = this.state;
        let profiles = ProfileID.ID,
            insuranceCode = InsuranceType.value ? InsuranceType.value.Code : null,
            datestart = DateStart.value ? moment(DateStart.value).format('YYYY-MM-DD HH:mm:ss') : null,
            dateend = DateEnd.value ? moment(DateEnd.value).format('YYYY-MM-DD HH:mm:ss') : null,
            recordDate = RecordDate.value ? moment(RecordDate.value).format('YYYY-MM-DD HH:mm:ss') : null;

        HttpService.Post('[URI_HR]/Ins_GetData/RealDayCount', {
            ProfileIDs: profiles,
            InsuranceType: insuranceCode,
            DateStart: datestart,
            DateEnd: dateend,
            RecordDate: recordDate,
            ChildSickID: null
        }).then((data) => {
            if (data) {
                let nextState = {
                    ShowHideFields,
                    DayCount: {
                        ...DayCount,
                        value: data.toString(),
                        refresh: !DayCount.refresh
                    }
                };

                nextState = this.fnShowField(nextState, insuranceCode);

                this.setState(nextState);
            }
        });
    };

    eventChangeSivkView = () => {
        const { InsuranceType, DateSuckle, NumberOfChildSick, RelativesID, ChildHealthInsNo, ShowHideFields } =
            this.state;
        let insuranceCode = InsuranceType.value ? InsuranceType.value.Code : null,
            nextState = { ShowHideFields };

        if (insuranceCode == 'E_SICK_LONG' || insuranceCode == 'E_SICK_SHORT') {
            nextState = {
                ...nextState,
                DateSuckle: {
                    ...DateSuckle,
                    disable: true,
                    refresh: !DateSuckle.refresh
                },
                NumberOfChildSick: {
                    ...NumberOfChildSick,
                    disable: true,
                    refresh: !NumberOfChildSick.refresh
                },
                ChildHealthInsNo: {
                    ...ChildHealthInsNo,
                    visibleConfig: false,
                    refresh: !ChildHealthInsNo.refresh
                },
                RelativesID: {
                    ...RelativesID,
                    disable: true,
                    refresh: !RelativesID.refresh
                }
            };
        } else {
            nextState = {
                ...nextState,
                DateSuckle: {
                    ...DateSuckle,
                    disable: false,
                    refresh: !DateSuckle.refresh
                },
                NumberOfChildSick: {
                    ...NumberOfChildSick,
                    disable: false,
                    refresh: !NumberOfChildSick.refresh
                },
                RelativesID: {
                    ...RelativesID,
                    disable: false,
                    refresh: !RelativesID.refresh
                }
            };
        }

        nextState = this.fnShowField(nextState, insuranceCode);

        let valid = this.getConfigValid(insuranceCode);

        VnrLoadingSevices.show();
        HttpService.Get('[URI_POR]/Portal/GetConfigValid?tableName=' + valid).then((res) => {
            VnrLoadingSevices.hide();
            if (res) {
                try {
                    nextState = {
                        ...nextState,
                        fieldValid: res
                    };

                    this.setState(nextState, () => {
                        HttpService.Post('[URI_HR]/Ins_GetData/ValidateCalculateAndGetWeeklyDaysOff', {
                            InsuranceType: insuranceCode
                        }).then((response) => {
                            if (response == 'True') {
                                this.fnCalcDayCountV2();
                                this.aaaa();
                            }
                        });
                    });
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            }
        });
    };

    loadDataConfig = () => {
        HttpService.Get('[URI_HR]/Ins_GetData/GetDefaultConfig').then((response) => {
            if (response) {
                const {
                    PaymentMethod,
                    WorkingCondition,
                    AntenatalCareCondition,
                    ChildbirthCondition,
                    SurrogacyType,
                    TypeData,
                    WeeklyDayOff
                } = this.state;

                let nextState = {};
                response.forEach((item) => {
                    let _value = item.DefaultValue,
                        _text = item.DefaultValue;

                    if (item.FieldName == 'WeeklyDayOff') {
                        nextState = {
                            ...nextState,
                            WeeklyDayOff: {
                                ...WeeklyDayOff,
                                value: [{ Value: _value, Text: _text }],
                                refresh: !WeeklyDayOff.refresh
                            }
                        };
                    } else if (item.FieldName == 'DocumentStatus') {
                        nextState = {
                            ...nextState,
                            DocumentStatus: _value
                        };
                    } else if (item.FieldName == 'PaymentMethod') {
                        nextState = {
                            ...nextState,
                            PaymentMethod: {
                                ...PaymentMethod,
                                value: { Value: _value, Text: translate('PaymentMethod__' + _text) },
                                refresh: !PaymentMethod.refresh
                            }
                        };
                    } else if (item.FieldName == 'WorkingCondition') {
                        nextState = {
                            ...nextState,
                            WorkingCondition: {
                                ...WorkingCondition,
                                value: { Value: _value, Text: translate('WorkingCondition__' + _text) },
                                refresh: !WorkingCondition.refresh
                            }
                        };
                    } else if (item.FieldName == 'AntenatalCareCondition') {
                        nextState = {
                            ...nextState,
                            AntenatalCareCondition: {
                                ...AntenatalCareCondition,
                                value: { Value: _value, Text: translate('AntenatalCareCondition__' + _text) },
                                refresh: !AntenatalCareCondition.refresh
                            }
                        };
                    } else if (item.FieldName == 'ChildbirthCondition') {
                        nextState = {
                            ...nextState,
                            ChildbirthCondition: {
                                ...ChildbirthCondition,
                                value: { Value: _value, Text: translate('GivingBirthCondition__' + _text) },
                                refresh: !ChildbirthCondition.refresh
                            }
                        };
                    } else if (item.FieldName == 'SurrogacyType') {
                        nextState = {
                            ...nextState,
                            SurrogacyType: {
                                ...SurrogacyType,
                                value: { Value: _value, Text: translate('SurrogacyType__' + _text) },
                                refresh: !SurrogacyType.refresh
                            }
                        };
                    } else if (item.FieldName == 'TypeData') {
                        nextState = {
                            ...nextState,
                            TypeData: {
                                ...TypeData,
                                value: { Value: _value, Text: _text },
                                refresh: !TypeData.refresh
                            }
                        };
                    }
                });

                this.setState(nextState);
            }
        });
    };

    changeProfileV2 = (isUpdate = false) => {
        const { InsuranceType, ProfileID, IDNoV2, AccountNumber, InsuranceCodeV2, DateOfBirth, ID } = this.state;

        let insuranceCode = InsuranceType.value ? InsuranceType.value.Code : null;

        HttpService.Post('[URI_HR]/Ins_GetData/GetInfoProfileByIdV2', { id: ProfileID.ID }).then((response) => {
            if (ID == '00000000-0000-0000-0000-000000000000' || ID == '') {
                let _IDNoV2 = response.IDCard ? response.IDCard : response.IDNo,
                    _insuranceCode = response.InsuranceCode ? response.InsuranceCode : response.SocialInsNo;

                _IDNoV2 = _IDNoV2 ? _IDNoV2 : response.PassportNo;

                this.setState(
                    {
                        IDNoV2: {
                            ...IDNoV2,
                            value: _IDNoV2,
                            refresh: !IDNoV2.refresh
                        },
                        InsuranceCodeV2: {
                            ...InsuranceCodeV2,
                            value: _insuranceCode,
                            refresh: !InsuranceCodeV2.refresh
                        },
                        AccountNumber: {
                            ...AccountNumber,
                            value: response.AccountNo,
                            refresh: !AccountNumber.refresh
                        },
                        DateOfBirth: {
                            ...DateOfBirth,
                            value: response.DateOfBirth,
                            refresh: !DateOfBirth.refresh
                        }
                    },
                    () => {
                        if (insuranceCode) {
                            if (insuranceCode == 'E_SICK_CHILD') {
                                this.loadRelativeByProfileV2456(isUpdate);
                            } else if (
                                insuranceCode.includes('E_SUCKLE') ||
                                insuranceCode.includes('E_PREGNANCY') ||
                                insuranceCode.includes('E_CHILD') ||
                                insuranceCode.includes('E_PRENANCY_SURGERY_LESS_32_WEEKS')
                            ) {
                                this.loadRelativeByProfileV2456(isUpdate);
                                this.loadWifeByProfileV2();
                            }
                        }

                        this.changeBank();
                        this.fnChangeAdditionalSettlement_Waiting();
                    }
                );
            } else {
                this.setState(
                    {
                        DateOfBirth: {
                            ...DateOfBirth,
                            value: response.DateOfBirth,
                            refresh: !DateOfBirth.refresh
                        }
                    },
                    () => {
                        if (insuranceCode) {
                            if (insuranceCode == 'E_SICK_CHILD') {
                                this.loadRelativeByProfileV2456(isUpdate);
                            } else if (
                                insuranceCode.includes('E_SUCKLE') ||
                                insuranceCode.includes('E_PREGNANCY') ||
                                insuranceCode.includes('E_CHILD') ||
                                insuranceCode.includes('E_PRENANCY_SURGERY_LESS_32_WEEKS')
                            ) {
                                this.loadRelativeByProfileV2456(isUpdate);
                                this.loadWifeByProfileV2();
                            }
                        }

                        this.changeBank();
                        this.fnChangeAdditionalSettlement_Waiting();
                    }
                );
            }
        });
    };

    changeBank = () => {
        // const { ProfileID, BankID, BranchID } = this.state;
        // // let profileId = $('#form_Ins_InsuranceRecordV2').find('#InsuranceRecordInfoV2_ProfileID').getKendoComboBox().value();
        // let gridSelected = hrmGrid.functionEvent.getSeletedId(gridName);
        // HttpService.Post('[URI_HR]/Ins_GetData/getBankInfoByProfileID', { id: ProfileID.id }).then(response1 => {
        //   let nextState = {};
        //   let bankIDsick = $('#InsuranceRecordV2_BankID').getKendoComboBox();
        //   let branchIDsick = $('#InsuranceRecordV2_BranchID').getKendoComboBox();
        //   if (gridSelected.length == 0) {
        //     if (bankIDsick && (response1.BankID != null || response1.BankID != "")) {
        //       bankIDsick.value(response1.BankID);
        //       if (branchIDsick && (branchIDsick.value != null || branchIDsick.value != "")) {
        //         branchIDsick.value(response1.BranchID);
        //       }
        //     }
        //   }
        //   let bankIDpreg = $('#InsuranceRecordV2_PregView_BankID').getKendoComboBox();
        //   let branchIDpreg = $('#InsuranceRecordV2_PregView_BranchID').getKendoComboBox();
        //   if (gridSelected.length == 0) {
        //     if (bankIDpreg && (response1.BankID != null || response1.BankID != "")) {
        //       bankIDpreg.value(response1.BankID);
        //       if (branchIDpreg && (branchIDpreg.value != null || branchIDpreg.value != "")) {
        //         branchIDpreg.value(response1.BranchID);
        //       }
        //     }
        //   }
        //   let bankIDresto = $('#InsuranceRecordV2_Resto_BankID').getKendoComboBox();
        //   let branchIDresto = $('#InsuranceRecordV2_Resto_BranchID').getKendoComboBox();
        //   if (gridSelected.length == 0) {
        //     if (bankIDresto && (response1.BankID != null || response1.BankID != "")) {
        //       bankIDresto.value(response1.BankID);
        //       if (branchIDresto && (branchIDresto.value != null || branchIDresto.value != "")) {
        //         branchIDresto.value(response1.BranchID);
        //       }
        //     }
        //   }
        // })
    };

    fnChangeAdditionalSettlement_Waiting = () => {
        const { InsuranceType, AdditionalSettlementString, AdditionalMonthYearSettlement } = this.state;
        let insuranceType = InsuranceType.value ? InsuranceType.value.Code : null,
            _AdditionalMonthYearSettlement = AdditionalMonthYearSettlement.value
                ? moment(AdditionalMonthYearSettlement.value).format('YYYY-MM-DD HH:mm:ss')
                : null,
            _AdditionalSettlement = AdditionalSettlementString.value;

        if (insuranceType != '' && _AdditionalMonthYearSettlement != '' && _AdditionalSettlement != '') {
            // HttpService.Post('[URI_HR]/Ins_GetData/GetPreviousApproveDate', {
            //   Id: ID,
            //   ProfileID: _profileid,
            //   insuranceType: _insuranceType,
            //   additionalMonthYearSettlement: _AdditionalMonthYearSettlement,
            //   additionalSettlement: _AdditionalSettlement
            // }).then(data => {
            //   if (data) {
            //     this.setState({
            //       PreviousApproveDate: {
            //         ...PreviousApproveDate,
            //         data,
            //         refresh: !PreviousApproveDate.refresh
            //       }
            //     })
            //   }
            // })
        }
    };

    loadRelativeByProfileV2456 = (isUpdate = false) => {
        const { ProfileID, RelativesID, DateStart, DateEnd, InsuranceType, ChildInsuranceCode, ChildHealthInsNo } =
            this.state;

        let dataBody = {
            text: '',
            profileID: ProfileID.ID
        };

        if (
            InsuranceTypeAllowed.includes(
                InsuranceType.value ? (InsuranceType.value.Code ? InsuranceType.value.Code : null) : null
            )
        ) {
            dataBody = {
                ...dataBody,
                insuranceType: InsuranceType.value.Code,
                dateStart: DateStart.value ? moment(DateStart.value).format('YYYY-MM-DD') : null,
                dateEnd: DateEnd.value ? moment(DateEnd.value).format('YYYY-MM-DD') : null
            };
        }

        HttpService.Post('[URI_HR]/Ins_GetData/getRelativeListByProfileID', dataBody).then((data) => {
            if (data) {
                if (data.length == 1) {
                    this.setState(
                        {
                            RelativesID: {
                                ...RelativesID,
                                data,
                                value: isUpdate ? RelativesID.value : data[0],
                                refresh: !RelativesID.refresh
                            }
                        },
                        () => this.fnChangeChild456()
                    );
                } else {
                    this.setState(
                        {
                            RelativesID: {
                                ...RelativesID,
                                value: isUpdate ? RelativesID.value : null,
                                data,
                                refresh: !RelativesID.refresh
                            },
                            ChildInsuranceCode: {
                                ...ChildInsuranceCode,
                                value: isUpdate ? ChildInsuranceCode.value : null,
                                disable: false,
                                refresh: !ChildInsuranceCode.refresh
                            },
                            ChildHealthInsNo: {
                                ...ChildHealthInsNo,
                                value: isUpdate ? ChildHealthInsNo.value : null,
                                disable: false,
                                refresh: !ChildHealthInsNo.refresh
                            }
                        },
                        () => this.fnChangeChild456()
                    );
                }
            }
        });
    };

    getRelativeListByProfileIDAndDateStartEnd = () => {
        const { ProfileID, RelativesID, DateStart, DateEnd, InsuranceType, ChildInsuranceCode, ChildHealthInsNo } =
            this.state;
        let dataBody = {
            text: '',
            profileID: ProfileID.ID
        };

        if (
            InsuranceTypeAllowed.includes(
                InsuranceType.value ? (InsuranceType.value.Code ? InsuranceType.value.Code : null) : null
            )
        ) {
            dataBody = {
                ...dataBody,
                insuranceType: InsuranceType.value.Code,
                dateStart: DateStart.value ? moment(DateStart.value).format('YYYY-MM-DD') : null,
                dateEnd: DateEnd.value ? moment(DateEnd.value).format('YYYY-MM-DD') : null
            };
        }

        HttpService.Post('[URI_HR]/Ins_GetData/getRelativeListByProfileID', dataBody).then((data) => {
            if (data) {
                if (data.length == 1) {
                    this.setState(
                        {
                            RelativesID: {
                                ...RelativesID,
                                data,
                                value: data[0],
                                refresh: !RelativesID.refresh
                            }
                        },
                        () => {
                            this.getInforHealthInsNoAndInsuranceCodeChild();
                        }
                    );
                } else {
                    this.setState({
                        RelativesID: {
                            ...RelativesID,
                            value: null,
                            data,
                            refresh: !RelativesID.refresh
                        },
                        ChildInsuranceCode: {
                            ...ChildInsuranceCode,
                            value: null,
                            disable: false,
                            refresh: !ChildInsuranceCode.refresh
                        },
                        ChildHealthInsNo: {
                            ...ChildHealthInsNo,
                            value: null,
                            disable: false,
                            refresh: !ChildHealthInsNo.refresh
                        }
                    });
                }
            }
        });
    };

    getInforHealthInsNoAndInsuranceCodeChild = () => {
        const { RelativesID, ChildInsuranceCode, ChildHealthInsNo } = this.state;

        HttpService.Get(`[URI_HR]/Ins_GetData/getYearOfBirhByRelativeID?relativeid=${RelativesID.value.ID}`)
            .then((res) => {
                if (res) {
                    this.setState({
                        ChildInsuranceCode: {
                            ...ChildInsuranceCode,
                            value: res.HealthInsNo,
                            disable: res.HealthInsNo ? true : false,
                            refresh: !ChildInsuranceCode.refresh
                        },
                        ChildHealthInsNo: {
                            ...ChildHealthInsNo,
                            value: res.SocialInsNo,
                            disable: res.SocialInsNo ? true : false,
                            refresh: !ChildHealthInsNo.refresh
                        }
                    });
                }
            })
            .catch((err) => {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: err });
            });
    };

    fnChangeChild456 = () => {
        const { RelativesID, DateSuckle, ChildHealthInsNo, InsuranceType, ChildInsuranceCode } = this.state;
        let nextState = {},
            insuranceCode = InsuranceType.value ? InsuranceType.value.Code : null;

        nextState = {
            ...nextState,
            ChildHealthInsNo: {
                ...ChildHealthInsNo,
                value: null,
                refresh: !ChildHealthInsNo.refresh
            }
        };

        if (RelativesID.value && insuranceCode.includes('E_SICK')) {
            nextState = {
                ...nextState,
                ChildHealthInsNo: {
                    ...ChildHealthInsNo,
                    value: null,
                    disable: false,
                    refresh: !ChildHealthInsNo.refresh
                },
                DateSuckle: {
                    ...DateSuckle,
                    disable: false,
                    refresh: !DateSuckle.refresh
                }
            };

            if (insuranceCode == 'E_SICK_CHILD') {
                this.setState(nextState, () => {
                    VnrLoadingSevices.show();
                    HttpService.Post('[URI_HR]/Ins_GetData/getYearOfBirhByRelativeID', {
                        relativeid: RelativesID.value ? RelativesID.value.ID : null
                    }).then((data) => {
                        VnrLoadingSevices.hide();

                        const { DateSuckle, ChildHealthInsNo } = this.state;

                        if (data) {
                            this.setState({
                                DateSuckle: {
                                    ...DateSuckle,
                                    value: data.YearOfBirthDateTime,
                                    disable: true,
                                    refresh: !DateSuckle.refresh
                                },
                                ChildHealthInsNo: {
                                    ...ChildHealthInsNo,
                                    value: data.HealthInsNo,
                                    disable: data.HealthInsNo ? true : false,
                                    refresh: !ChildHealthInsNo.refresh
                                }
                            });
                        } else {
                            this.setState({
                                DateSuckle: {
                                    ...DateSuckle,
                                    //value: data.YearOfBirth,
                                    disable: false,
                                    refresh: !DateSuckle.refresh
                                },
                                ChildHealthInsNo: {
                                    ...ChildHealthInsNo,
                                    value: null,
                                    disable: false,
                                    refresh: !ChildHealthInsNo.refresh
                                }
                            });
                        }
                    });
                });
            } else {
                this.setState(nextState);
            }
        } else if (RelativesID.value) {
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Ins_GetData/getYearOfBirhByRelativeID', {
                relativeid: RelativesID.value ? RelativesID.value.ID : null
            }).then((data) => {
                VnrLoadingSevices.hide();

                if (data != null) {
                    let nextState = {};

                    if (data.HealthInsNo) {
                        nextState = {
                            ...nextState,
                            ChildHealthInsNo: {
                                ...ChildHealthInsNo,
                                value: data.HealthInsNo,
                                disable: true,
                                refresh: !ChildHealthInsNo.refresh
                            }
                        };
                    } else {
                        nextState = {
                            ...nextState,
                            ChildHealthInsNo: {
                                ...ChildHealthInsNo,
                                value: null,
                                disable: false,
                                refresh: !ChildHealthInsNo.refresh
                            }
                        };
                    }

                    if (data.SocialInsNo) {
                        nextState = {
                            ...nextState,
                            ChildInsuranceCode: {
                                ...ChildInsuranceCode,
                                value: data.SocialInsNo,
                                disable: true,
                                refresh: !ChildInsuranceCode.refresh
                            }
                        };
                    } else {
                        nextState = {
                            ...nextState,
                            ChildInsuranceCode: {
                                ...ChildInsuranceCode,
                                value: null,
                                disable: false,
                                refresh: !ChildInsuranceCode.refresh
                            }
                        };
                    }

                    nextState = {
                        ...nextState,
                        DateSuckle: {
                            ...DateSuckle,
                            value: data.YearOfBirthDateTime,
                            refresh: !DateSuckle.refresh
                        }
                    };

                    this.setState(nextState);
                } else {
                    this.setState({
                        ChildHealthInsNo: {
                            ...ChildHealthInsNo,
                            value: null,
                            disable: false,
                            refresh: !ChildHealthInsNo.refresh
                        },
                        ChildInsuranceCode: {
                            ...ChildInsuranceCode,
                            value: null,
                            disable: false,
                            refresh: !ChildInsuranceCode.refresh
                        }
                    });
                }
            });
        } else {
            this.setState({
                ChildHealthInsNo: {
                    ...ChildHealthInsNo,
                    value: null,
                    disable: false,
                    refresh: !ChildHealthInsNo.refresh
                },
                ChildInsuranceCode: {
                    ...ChildInsuranceCode,
                    value: null,
                    disable: false,
                    refresh: !ChildInsuranceCode.refresh
                },
                DateSuckle: {
                    ...DateSuckle,
                    disable: false,
                    refresh: !DateSuckle.refresh
                }
            });
        }
    };

    loadWifeByProfileV2 = () => {
        const { InsuranceType, WifeID, ProfileID } = this.state;
        let insuranceCode = InsuranceType.value ? InsuranceType.value.Code : null;

        if (
            insuranceCode &&
            (insuranceCode.includes('E_SUCKLE') ||
                insuranceCode.includes('E_PREGNANCY') ||
                insuranceCode.includes('E_CHILD') ||
                insuranceCode.includes('E_PRENANCY_SURGERY_LESS_32_WEEKS'))
        ) {
            HttpService.Post('[URI_HR]/Ins_GetData/getWifeListByProfileID', { text: '', profileID: ProfileID.ID }).then(
                (data) => {
                    if (data) {
                        if (data.length == 1) {
                            this.setState(
                                {
                                    WifeID: {
                                        ...WifeID,
                                        data,
                                        value: data[0],
                                        refresh: !WifeID.refresh
                                    }
                                },
                                () => this.fnChangeWife()
                            );
                        } else {
                            this.setState(
                                {
                                    WifeID: {
                                        ...WifeID,
                                        data,
                                        refresh: !WifeID.refresh
                                    }
                                },
                                () => this.fnChangeWife()
                            );
                        }
                    }
                }
            );
        }
    };
}

const styles = StyleSheet.create({
    styViewErrorTitleGroup: {
        fontWeight: '500',
        color: Colors.primary
    },
    styModalBackdrop: {
        flex: 1,
        backgroundColor: Colors.black,
        opacity: 0.5
    },
    styViewTitleGroupExtend: { marginHorizontal: 0, paddingBottom: 5, marginBottom: 10 },
    // styles Error detail
    btnClose: {
        height: Size.heightButton,
        backgroundColor: Colors.red,
        borderRadius: styleSheets.radius_5,
        flex: 3,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 5
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
    scrollViewError: {
        flexGrow: 1,
        flexDirection: 'column',
        paddingHorizontal: Size.defineSpace
    },
    /// ==================================//
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
    viewStyleDayPortal: {
        // flex: 1,ck
        flexDirection: 'row',
        alignContent: 'space-between',
        justifyContent: 'center'
    },
    bntSearchManualLeave: {
        flexDirection: 'row',
        backgroundColor: Colors.primary,
        borderRadius: 5,
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingVertical: 10,
        marginRight: 10
    },
    styleValueManualLeave: {
        flex: 1,
        marginRight: Size.defineHalfSpace
    }
});
