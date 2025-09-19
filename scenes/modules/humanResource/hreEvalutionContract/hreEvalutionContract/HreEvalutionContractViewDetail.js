import React, { Component } from 'react';
import {
    View,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    Platform,
    KeyboardAvoidingView,
    Image
} from 'react-native';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    Size,
    Colors,
    stylesScreenDetailV3,
    stylesVnrPickerV3,
    stylesVnrFilter,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import DrawerServices from '../../../../../utils/DrawerServices';
import { EnumName, ScreenName, EnumIcon } from '../../../../../assets/constant';
import Vnr_Services from '../../../../../utils/Vnr_Services';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import { translate } from '../../../../../i18n/translate';
import { IconShowDown, IconShowUp, IconSave, IconCheck, IconCancel } from '../../../../../constants/Icons';
import moment from 'moment';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import VnrText from '../../../../../components/VnrText/VnrText';
import VnrTextInput from '../../../../../componentsV3/VnrTextInput/VnrTextInput';
import VnrPickerLittle from '../../../../../componentsV3/VnrPickerLittle/VnrPickerLittle';
import VnrPickerQuickly from '../../../../../componentsV3/VnrPickerQuickly/VnrPickerQuickly';
import VnrDateFromTo from '../../../../../componentsV3/VnrDateFromTo/VnrDateFromTo';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';

const configDefault = [
    {
        TypeView: 'E_STATUS',
        Name: 'StatusPerFormanceView',
        DisplayKey: 'HRM_Attendance_Overtime_OvertimeList_Status',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP_PROFILE',
        DisplayKey: 'HRM_PortalApp_Subscribers',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'ProfileName',
        DisplayKey: 'HRM_HR_Profile_ProfileName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'JobTitleName',
        DisplayKey: 'HRM_HR_Profile_JobTitleName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'PositionName',
        DisplayKey: 'HRM_HR_Profile_PositionName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_COMPANY',
        DisplayKey: 'E_COMPANY',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_BRANCH',
        DisplayKey: 'E_BRANCH',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_UNIT',
        DisplayKey: 'HRM_Hre_SignatureRegister_E_UNIT',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_DIVISION',
        DisplayKey: 'HRM_Hre_SignatureRegister_E_DIVISION',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_DEPARTMENT',
        DisplayKey: 'HRM_HR_Profile_OrgStructureName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_TEAM',
        DisplayKey: 'Group',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON_PROFILE',
        Name: 'E_SECTION',
        DisplayKey: 'E_SECTION',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_PortalApp_ContractHistory_Contract',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ContractNo',
        DisplayKey: 'HRM_PortalApp_ContractHistory_ContractNo',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ContractTypeName',
        DisplayKey: 'HRM_PortalApp_ContractHistory_ContractType',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'FormatPeriodFromDate',
        NameSecond: 'FormatPeriodToDate',
        DisplayKey: 'HRM_PortalApp_ContractHistory_ContractDuration',
        DataType: 'DateToFrom',
        DataFormat: 'MM/DD/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TimesContract',
        DisplayKey: 'HRM_PortalApp_ContractTimes',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'FormatDateHire',
        DisplayKey: 'HRM_PortalApp_Contract_DateHire',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'FormatDateEvaluation',
        DisplayKey: 'HRM_PortalApp_Contract_DateEvaluation',
        DataType: 'string'
    }
];

const initSateDefault = {
    Strengths: {
        value: null,
        lable: 'HRM_PortalApp_Contract_Strengths',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    Weaknesses: {
        value: null,
        lable: 'HRM_PortalApp_Contract_Weaknesses',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    NoteEvaluator: {
        value: null,
        lable: 'Note',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    ResultsContractEva: {
        value: null,
        lable: 'HRM_PortalApp_Contract_ResultEvaluation',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    ResultEva: {
        value: null,
        lable: 'HRM_PortalApp_Contract_ContractAction',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    },
    NextContractTypeID: {
        value: null,
        lable: 'HRM_PortalApp_ContractHistory_ContractType',
        disable: false,
        refresh: false,
        visible: false,
        visibleConfig: false
    },
    DateContract: {
        value: {},
        lable: 'HRM_PortalApp_ContractHistory_ContractDuration',
        disable: false,
        refresh: false,
        visible: false,
        visibleConfig: false
    },
    DurationNextContract: {
        value: '',
        lable: 'HRM_PortalApp_Contract_ContractTerm',
        disable: false,
        refresh: false,
        visible: false,
        visibleConfig: false,
        placeHolder: '0'
    },
    UnitTimeNextContract: {
        value: null,
        lable: ' ',
        disable: false,
        refresh: false,
        visible: true,
        visibleConfig: true
    }
};

const dataDefaultUnitTimeNextContract = [
    {
        Text: 'HRM_PortalApp_TSLRegister_day',
        Value: 'E_DAY'
    },
    {
        Text: 'HRM_PortalApp_TaxPay_Month',
        Value: 'E_MONTH'
    },
    {
        Text: 'HRM_PortalApp_Only_Year',
        Value: 'E_YEAR'
    },
    {
        Text: 'HRM_PortalApp_Contract_Indefinite',
        Value: 'E_INDEFINITE'
    }
];

const configLeveApprove = [
    {
        TypeView: 'E_USERAPPROVE1',
        Name: 'ProfileName',
        DisplayKey: 'HRM_PortalApp_Contract_Evaluator1',
        DataType: 'string'
    },
    {
        TypeView: 'E_USERAPPROVE3',
        Name: 'ProfileName',
        DisplayKey: 'HRM_PortalApp_Contract_Evaluator2',
        DataType: 'string'
    },
    {
        TypeView: 'E_USERAPPROVE4',
        Name: 'ProfileName',
        DisplayKey: 'HRM_PortalApp_Contract_Evaluator3',
        DataType: 'string'
    },
    {
        TypeView: 'E_USERAPPROVE2',
        Name: 'ProfileName',
        DisplayKey: 'HRM_PortalApp_Contract_Evaluator4',
        DataType: 'string'
    }
];

const sizeImg = 44;

export default class HreEvalutionContractViewDetail extends Component {
    constructor(props) {
        super(props);
        (this.state = {
            dataItem: null,
            configListDetail: null,
            dataWorkList: [],
            search: '',
            ...initSateDefault
        }),
        (this.refModal = null);
        this.refModalAddWork = null;
    }

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[ScreenName.HreEvalutionContractViewDetail]
                    ? ConfigListDetail.value[ScreenName.HreEvalutionContractViewDetail]
                    : configDefault;

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem?.ID;
            if (id) {
                const {
                    Weaknesses,
                    Strengths,
                    NoteEvaluator,
                    ResultsContractEva,
                    ResultEva,
                    NextContractTypeID,
                    DateContract,
                    DurationNextContract,
                    UnitTimeNextContract
                } = this.state;
                let nextState = {};
                const response = await HttpService.Post(
                    `[URI_CENTER]/api/Hre_Contract/GetEvaDetailByID/${id}`,
                    null,
                    null,
                    this.reload
                );
                if (response && response.Status == EnumName.E_SUCCESS) {
                    let data = response.Data;

                    data.itemStatus = Vnr_Services.formatStyleStatusApp(data?.StatusPerFormance);

                    if (Array.isArray(data?.PerformanceEvaDetail) && data?.PerformanceEvaDetail.length > 0) {
                        data.isShowPerformanceEvaDetail = true;
                        data.isShowGeneralAppraisalDetail = true;
                        data.isShowLevelAssessmentHistory = true;
                        data?.PerformanceEvaDetail.forEach(element => {
                            element.refresh = false;
                        });
                    }

                    let isOUT = data?.ResultsContractEva && data?.ResultsContractEva === 'PASS';
                    nextState = {
                        ...nextState,
                        Strengths: {
                            ...Strengths,
                            value: data?.Strengths,
                            refresh: !Strengths.refresh
                        },
                        Weaknesses: {
                            ...Weaknesses,
                            value: data?.Weaknesses,
                            refresh: !Weaknesses.refresh
                        },
                        NoteEvaluator: {
                            ...NoteEvaluator,
                            value: data?.NoteEvaluator,
                            refresh: !NoteEvaluator.refresh
                        },
                        ResultsContractEva: {
                            ...ResultsContractEva,
                            value: data?.ResultsContractEva
                                ? { Value: data?.ResultsContractEva, Text: data?.ResultsContractEvaView }
                                : null,
                            refresh: !ResultsContractEva.refresh
                        },
                        ResultEva: {
                            ...ResultEva,
                            value: data?.ResultEva ? { Value: data?.ResultEva, Text: data?.ResultEvaView } : null,
                            refresh: !ResultEva.refresh
                        },
                        NextContractTypeID: {
                            ...NextContractTypeID,
                            value: data?.NextContractTypeID
                                ? { ID: data?.NextContractTypeID, ContractTypeName: data?.ContractTypeName }
                                : null,
                            visible: isOUT ? true : false,
                            visibleConfig: isOUT ? true : false,
                            refresh: !NextContractTypeID.refresh
                        },
                        DurationNextContract: {
                            ...DurationNextContract,
                            value: data?.DurationNextContract ? `${data?.DurationNextContract}` : '',
                            visible: isOUT ? true : false,
                            visibleConfig: isOUT ? true : false,
                            refresh: !DurationNextContract.refresh
                        },
                        UnitTimeNextContract: {
                            ...UnitTimeNextContract,
                            value: data?.UnitTimeNextContract
                                ? { Value: data?.UnitTimeNextContract, Text: data?.UnitTimeNextContractView }
                                : null,
                            refresh: !UnitTimeNextContract.refresh
                        }
                    };

                    if (data?.DateStartNextContract && data?.DateEndNextContract) {
                        nextState = {
                            ...nextState,
                            DateContract: {
                                ...DateContract,
                                value: {
                                    startDate: data?.DateStartNextContract,
                                    endDate: data?.DateEndNextContract
                                },
                                visible: isOUT ? true : false,
                                visibleConfig: isOUT ? true : false,
                                refresh: !DateContract.refresh
                            }
                        };
                    }

                    this.setState({
                        configListDetail: _configListDetail,
                        dataItem: { ...dataItem, ...data },
                        ...nextState
                    });
                } else {
                    this.setState({ dataItem: 'EmptyData' });
                }
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                dataItem.ProfileName = `${dataItem?.ProfileName} - ${dataItem?.CodeEmp}`;
                this.setState({ configListDetail: _configListDetail, dataItem });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    reload = () => {
        const { reloadScreenList } = this.props.navigation.state.params;
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');
        this.setState({ dataItem: null }, () => {
            this.getDataItem(true);
        });
    };

    componentDidMount() {
        this.getDataItem();
    }

    handleDeleta = item => {
        AlertSevice.alert({
            iconType: EnumIcon.E_WARNING,
            title: translate('HRM_PortalApp_HreWorkManage_DeleteWork'),
            message: `${translate('HRM_PortalApp_HreWorkManage_AskBeforeDelete')} \n${translate(
                'HRM_PortalApp_HreWorkManage_AreYouSureDelete'
            )}`,
            onCancel: () => { },
            onConfirm: () => {
                if (item?.ID) {
                    try {
                        VnrLoadingSevices.show();
                        HttpService.Post('[URI_CENTER]/api/Hre_ProfileWorkList/RemoveProfileWorkList', {
                            ID: item?.ID
                        })
                            .then(res => {
                                VnrLoadingSevices.hide();
                                if (res?.Status === EnumName.E_SUCCESS) {
                                    ToasterSevice.showSuccess('DeleteSuccess');
                                    this.getDataItem();
                                }
                            })
                            .catch(error => {
                                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                            });
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                }
            }
        });
    };

    handleResultsContractEva = item => {
        if (item) {
            const {
                ResultsContractEva,
                ResultEva,
                NextContractTypeID,
                DateContract,
                DurationNextContract
            } = this.state;
            let isOUT = item?.Value && item?.Value === 'OUT';
            let nextState = {
                ResultsContractEva: {
                    ...ResultsContractEva,
                    value: item ? item : null,
                    refresh: !ResultsContractEva.refresh
                },
                ResultEva: {
                    ...ResultEva,
                    value: isOUT
                        ? {
                            Text: translate('HRM_PortalApp_Contract_StopContract'),
                            Value: 'E_CUT',
                            Number: 2
                        }
                        : {
                            Text: translate('HRM_PortalApp_Contract_SignNextContract'),
                            Value: 'E_NEXTCONTRACT',
                            Number: 1
                        },
                    refresh: !ResultEva.refresh
                },
                NextContractTypeID: {
                    ...NextContractTypeID,
                    visible: isOUT ? false : true,
                    visibleConfig: isOUT ? false : true,
                    refresh: !NextContractTypeID.refresh
                },
                DurationNextContract: {
                    ...DurationNextContract,
                    visible: isOUT ? false : true,
                    visibleConfig: isOUT ? false : true,
                    refresh: !DurationNextContract.refresh
                },
                DateContract: {
                    ...DateContract,
                    visible: isOUT ? false : true,
                    visibleConfig: isOUT ? false : true,
                    refresh: !DateContract.refresh
                }
            };

            this.setState({
                ...nextState
            });
        }
    };

    handleRefresh = data => {
        if (data) {
            const {
                Weaknesses,
                Strengths,
                NoteEvaluator,
                ResultsContractEva,
                ResultEva,
                NextContractTypeID,
                DateContract,
                DurationNextContract,
                UnitTimeNextContract
            } = this.state;

            let isOUT = data?.ResultsContractEva && data?.ResultsContractEva === 'PASS';
            let nextState = {
                Strengths: {
                    ...Strengths,
                    value: data?.Strengths,
                    refresh: !Strengths.refresh
                },
                Weaknesses: {
                    ...Weaknesses,
                    value: data?.Weaknesses,
                    refresh: !Weaknesses.refresh
                },
                NoteEvaluator: {
                    ...NoteEvaluator,
                    value: data?.NoteEvaluator,
                    refresh: !NoteEvaluator.refresh
                },
                ResultsContractEva: {
                    ...ResultsContractEva,
                    value: data?.ResultsContractEva
                        ? { Value: data?.ResultsContractEva, Text: data?.ResultsContractEvaView }
                        : null,
                    refresh: !ResultsContractEva.refresh
                },
                ResultEva: {
                    ...ResultEva,
                    value: data?.ResultEva ? { Value: data?.ResultEva, Text: data?.ResultEvaView } : null,
                    refresh: !ResultEva.refresh
                },
                NextContractTypeID: {
                    ...NextContractTypeID,
                    value: data?.NextContractTypeID
                        ? { ID: data?.NextContractTypeID, ContractTypeName: data?.ContractTypeName }
                        : null,
                    visible: isOUT ? true : false,
                    visibleConfig: isOUT ? true : false,
                    refresh: !NextContractTypeID.refresh
                },
                DurationNextContract: {
                    ...DurationNextContract,
                    value: data?.DurationNextContract ? `${data?.DurationNextContract}` : '',
                    visible: isOUT ? true : false,
                    visibleConfig: isOUT ? true : false,
                    refresh: !DurationNextContract.refresh
                },
                UnitTimeNextContract: {
                    ...UnitTimeNextContract,
                    value: data?.UnitTimeNextContract
                        ? { Value: data?.UnitTimeNextContract, Text: data?.UnitTimeNextContractView }
                        : null,
                    refresh: !UnitTimeNextContract.refresh
                }
            };

            if (data?.DateStartNextContract && data?.DateEndNextContract) {
                nextState = {
                    ...nextState,
                    DateContract: {
                        ...DateContract,
                        value: {
                            startDate: data?.DateStartNextContract,
                            endDate: data?.DateEndNextContract
                        },
                        visible: isOUT ? true : false,
                        visibleConfig: isOUT ? true : false,
                        refresh: !DateContract.refresh
                    }
                };
            }

            this.setState({ ...nextState });
        }
    };

    handleOnSave = (isSend = false) => {
        const {
            dataItem,
            Weaknesses,
            Strengths,
            NoteEvaluator,
            ResultsContractEva,
            ResultEva,
            NextContractTypeID,
            DateContract,
            DurationNextContract,
            UnitTimeNextContract
        } = this.state;

        if (dataItem?.ID) {
            let params = {
                DateEndNextContract: DateContract.value?.endDate ? DateContract.value?.endDate : null,
                DateStartNextContract: DateContract.value?.startDate ? DateContract.value?.startDate : null,
                DurationNextContract: DurationNextContract.value ? Number(DurationNextContract.value) : null,
                EvaluatorID: dataItem?.EvaluatorID ? dataItem?.EvaluatorID : null,
                DateUpdate: dataItem?.DateUpdate ? dataItem?.DateUpdate : null,
                UnitTimeNextContract: UnitTimeNextContract.value?.Value ? UnitTimeNextContract.value?.Value : null,
                ID: dataItem?.ID,
                IsPortal: true,
                NextContractTypeID: NextContractTypeID.value?.ID ? NextContractTypeID.value.ID : null,
                NoteEvaluator: NoteEvaluator.value ? NoteEvaluator.value : null,
                OrderEva: dataItem?.OrderEva ? dataItem?.OrderEva : null,
                OverallScore: dataItem?.OverallScore ? dataItem?.OverallScore : null,
                PerformanceEvaDetails: dataItem?.PerformanceEvaDetail ? dataItem?.PerformanceEvaDetail : null,
                PerformanceID: dataItem?.PerformanceID ? dataItem?.PerformanceID : null,
                ResultEva: ResultEva.value?.Value ? ResultEva.value?.Value : null,
                ResultsContractEva: ResultsContractEva.value?.Value ? ResultsContractEva.value?.Value : null,
                Weaknesses: Weaknesses.value ? Weaknesses.value : null,
                Strengths: Strengths.value ? Strengths.value : null
            };

            if (isSend) {
                params = {
                    ...params,
                    SaveType: 'SaveAndSend'
                };
            }

            try {
                VnrLoadingSevices.show();
                HttpService.Post('[URI_CENTER]/api/Hre_Contract/CreateOrUpdatePerformanceEva', params)
                    .then(res => {
                        VnrLoadingSevices.hide();
                        if (res?.Status === EnumName.E_SUCCESS) {
                            ToasterSevice.showSuccess('Hrm_Succeed', 5500);
                            this.getDataItem();
                        } else {
                            VnrLoadingSevices.hide();
                            ToasterSevice.showWarning(res?.Data, 5500);
                        }
                    })
                    .catch(error => {
                        VnrLoadingSevices.hide();
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    });
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        }
    };

    handleInheritance = () => {
        const { dataItem, Weaknesses, Strengths, NoteEvaluator } = this.state;

        if (dataItem?.EvaluatorID) {
            let nextState = {};
            nextState = {
                ...nextState,
                Strengths: {
                    ...Strengths,
                    value: dataItem?.HisStrengths,
                    refresh: !Strengths.refresh
                },
                Weaknesses: {
                    ...Weaknesses,
                    value: dataItem?.HisWeaknesses,
                    refresh: !Weaknesses.refresh
                },
                NoteEvaluator: {
                    ...NoteEvaluator,
                    value: dataItem?.HisNoteEvaluator,
                    refresh: !NoteEvaluator.refresh
                }
            };

            if (Array.isArray(dataItem?.HisPerformanceEvaDetail) && Array.isArray(dataItem?.PerformanceEvaDetail)) {
                dataItem?.PerformanceEvaDetail.forEach((element) => {
                    const rs = dataItem?.HisPerformanceEvaDetail.find(
                        item => item?.KPIID === element?.ID || item?.KPIName === element?.KPIName
                    );
                    if (rs && rs?.Actual) {
                        element.Actual = rs?.Actual;
                    }
                });
                nextState = {
                    ...nextState,
                    dataItem: {
                        ...dataItem
                    }
                };
            }

            this.setState({
                ...nextState
            });
        }
    };

    handleChooseNextContractTypeID = (contractTime = {}) => {
        try {
            const { DateContract, NextContractTypeID, UnitTimeNextContract, DurationNextContract } = this.state;

            if (NextContractTypeID.value?.ID && DateContract.value?.startDate) {
                let params = {
                    ...contractTime,
                    DateStartNextContract: DateContract.value?.startDate,
                    NextContractTypeID: NextContractTypeID.value.ID
                };

                HttpService.Post('[URI_CENTER]/api/Hre_Contract/GetContractByContractType4EvaluContract', params)
                    .then(res => {
                        if (res?.Status === EnumName.E_SUCCESS) {
                            let nextState = {};

                            if (res?.Data?.DateStartNextContract && res?.Data?.DateEndNextContract) {
                                nextState = {
                                    ...nextState,
                                    DateContract: {
                                        ...DateContract,
                                        value: {
                                            startDate: res?.Data?.DateStartNextContract,
                                            endDate: res?.Data?.DateEndNextContract
                                        },
                                        refresh: !DateContract.refresh
                                    }
                                };
                            }

                            if (res?.Data?.DateStartNextContract && !res?.Data?.DateEndNextContract) {
                                nextState = {
                                    ...nextState,
                                    DateContract: {
                                        ...DateContract,
                                        value: {
                                            startDate: res?.Data?.DateStartNextContract,
                                            endDate: res?.Data?.DateStartNextContract
                                        },
                                        refresh: !DateContract.refresh
                                    }
                                };
                            }

                            if (!res?.Data?.DateStartNextContract && res?.Data?.DateEndNextContract) {
                                nextState = {
                                    ...nextState,
                                    DateContract: {
                                        ...DateContract,
                                        value: {
                                            startDate: res?.Data?.DateEndNextContract,
                                            endDate: res?.Data?.DateEndNextContract
                                        },
                                        refresh: !DateContract.refresh
                                    }
                                };
                            }

                            this.setState({
                                ...nextState,

                                DurationNextContract: {
                                    ...DurationNextContract,
                                    value: res?.Data?.DurationNextContract ? `${res?.Data?.DurationNextContract}` : '',
                                    refresh: !DurationNextContract.refresh
                                },

                                UnitTimeNextContract: {
                                    ...UnitTimeNextContract,
                                    value: res?.Data?.UnitTimeNextContract
                                        ? {
                                            Value: res?.Data?.UnitTimeNextContract,
                                            Text: res?.Data?.UnitTimeNextContractView
                                        }
                                        : null,
                                    refresh: !UnitTimeNextContract.refresh
                                }
                            });
                        }
                    })
                    .catch(error => {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    });
            }
        } catch (error) {
            DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
        }
    };

    handleDurationNextContract = item => {
        if (item) {
            const { DateContract, DurationNextContract, UnitTimeNextContract } = this.state;

            let nextState = {
                UnitTimeNextContract: {
                    ...UnitTimeNextContract,
                    value: item,
                    refresh: !UnitTimeNextContract.refresh
                }
            };

            if (item?.Value === 'E_INDEFINITE') {
                nextState = {
                    ...nextState,
                    DurationNextContract: {
                        ...DurationNextContract,
                        value: '',
                        placeHolder: '',
                        disable: true,
                        refresh: !DurationNextContract.refresh
                    },

                    DateContract: {
                        ...DateContract,
                        disable: true,
                        value: {},
                        refresh: !DateContract.refresh
                    }
                };
            } else {
                nextState = {
                    ...nextState,
                    DurationNextContract: {
                        ...DurationNextContract,
                        value: DurationNextContract?.value ? DurationNextContract?.value : '',
                        placeHolder: '0',
                        disable: false,
                        refresh: !DurationNextContract.refresh
                    },

                    DateContract: {
                        ...DateContract,
                        disable: false,
                        refresh: !DateContract.refresh
                    }
                };
            }

            this.setState(
                {
                    ...nextState
                },
                () => {
                    if (DurationNextContract?.value !== null && DurationNextContract?.value !== undefined) {
                        this.handleChooseNextContractTypeID({
                            Duration: Number(DurationNextContract?.value),
                            UnitTime: item?.Value
                        });
                    }
                }
            );
        }
    };

    // nhan.nguyen: 0175740: [Hotfix build 05 QC]- App - Màn hình "Đánh giá hợp đồng" bổ sung logic xử lý (Tách từ task 0174344)
    handleValidePoindEvalute = async (dataItem, index) => {
        if (
            dataItem?.ID &&
            dataItem?.PerformanceID &&
            !isNaN(dataItem?.OverallScore) &&
            dataItem?.PerformanceEvaDetail
        ) {
            try {
                const dataBody = {
                    ID: dataItem?.ID,
                    OverallScore: Number(dataItem?.OverallScore),
                    PerformanceID: dataItem?.PerformanceID,
                    PerformanceEvaDetail: dataItem?.PerformanceEvaDetail
                };
                VnrLoadingSevices.show();
                HttpService.Post('[URI_CENTER]/api/Hre_Contract/GetEvaDetailComputeFormular', { ...dataBody })
                    .then(res => {
                        VnrLoadingSevices.hide();
                        if (res && res?.Status === EnumName.E_SUCCESS && res?.Data) {
                            let nextState = {};

                            if (res?.Data?.ResultsContractEva) {
                                nextState = {
                                    ...nextState,
                                    ResultsContractEva: {
                                        ...this.state.ResultsContractEva,
                                        value: res?.Data?.ResultsContractEva
                                            ? {
                                                Value: res?.Data?.ResultsContractEva,
                                                Text: res?.Data?.ResultsContractEvaView
                                            }
                                            : null,
                                        refresh: !this.state.ResultsContractEva.refresh
                                    }
                                };
                            }

                            if (res?.Data?.StatusActualOutput === EnumName.E_Success) {
                                this.setState(
                                    {
                                        ...nextState,
                                        dataItem: { ...dataItem, TotalMark: res?.Data?.TotalMark }
                                    },
                                    () => {
                                        this.handleResultsContractEva(nextState?.ResultsContractEva?.value);
                                    }
                                );
                            } else {
                                let data = { ...dataItem, PerformanceEvaDetail: res?.Data?.PerformanceEvaDetail };
                                data.PerformanceEvaDetail[index].Actual = '';

                                this.setState(
                                    {
                                        dataItem: data
                                    },
                                    () => {
                                        if (!(res?.Data?.StatusActualOutput === EnumName.E_Success)) {
                                            ToasterSevice.showWarning(res?.Data?.StatusActualOutput);
                                        }
                                    }
                                );
                            }
                        } else {
                            dataItem.PerformanceEvaDetail[index].Actual = '';
                        }
                    })
                    .catch(error => {
                        VnrLoadingSevices.hide();
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    });
            } catch (error) {
                VnrLoadingSevices.hide();
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        } else {
            ToasterSevice.showError('HRM_Common_SendRequest_Error');
        }
    };

    render() {
        const {
                dataItem,
                configListDetail,
                Weaknesses,
                Strengths,
                NoteEvaluator,
                ResultsContractEva,
                ResultEva,
                NextContractTypeID,
                DateContract,
                DurationNextContract,
                UnitTimeNextContract
            } = this.state,
            { containerItemDetail, contentScroll } = styleScreenDetail;
        let evaluated = 0,
            needevaluat = 0;

        if (dataItem?.Progress) {
            let arrProgress = dataItem?.Progress.split('/');
            if (Array.isArray(arrProgress) && arrProgress.length === 2) {
                evaluated = arrProgress[0];
                needevaluat = arrProgress[1];
            }
        }
        let valueProgress = (valueProgress = (evaluated / needevaluat) * 100);
        //#region handle styles
        let styTextLable = { ...styleSheets.text, ...{ textAlign: 'left' } },
            dataApprover = [];

        if (Array.isArray(dataItem?.lstEvaluator)) {
            dataApprover = dataItem?.lstEvaluator;
        }

        let contentViewDetail = <VnrLoading size={'large'} />;

        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={contentScroll} showsVerticalScrollIndicator={false}>
                        <View style={[containerItemDetail, CustomStyleSheet.paddingHorizontal(0)]}>
                            <View style={{ paddingHorizontal: styleSheets.p_10 }}>
                                {configListDetail.map(e => {
                                    if (e.TypeView != 'E_COMMON_PROFILE')
                                        return Vnr_Function.formatStringTypeV3(dataItem, e, configListDetail);
                                })}
                            </View>

                            <View
                                style={[stylesScreenDetailV3.styItemContent, { paddingHorizontal: styleSheets.p_10 }]}
                            >
                                <View style={[stylesScreenDetailV3.viewLable, CustomStyleSheet.justifyContent('flex-start')]}>
                                    <VnrText
                                        style={[styleSheets.text, { ...styleSheets.text, ...{ textAlign: 'left' } }]}
                                        i18nKey={'HRM_PortalApp_Contract_Evaluator'}
                                    // numberOfLines={1}
                                    />
                                </View>
                                <View style={stylesScreenDetailV3.styViewValue}>
                                    {Array.isArray(dataItem?.lstEvaluator) &&
                                        dataItem?.lstEvaluator.map((item, index) => {
                                            return (
                                                <View style={styles.flex_Row_Ali_Center} key={index}>
                                                    <View style={CustomStyleSheet.marginRight(6)}>
                                                        {Vnr_Function.renderAvatarCricleByName(
                                                            item?.ImagePath,
                                                            item?.ProfileName,
                                                            16
                                                        )}
                                                    </View>
                                                    <Text
                                                        numberOfLines={1}
                                                        style={[styleSheets.text, styles.textProfileName]}
                                                    >
                                                        {item?.ProfileName}
                                                    </Text>
                                                </View>
                                            );
                                        })}
                                </View>
                            </View>

                            {/* Progress */}
                            <View>
                                <View style={{ paddingHorizontal: styleSheets.p_10 }}>
                                    <Text style={[styleSheets.text, { fontSize: Size.text }]}>
                                        {translate('HRM_PortalApp_Contract_Process')}
                                    </Text>
                                </View>
                                <View style={[styles.styProgress, { paddingHorizontal: styleSheets.p_10 }]}>
                                    <View style={styles.styLeftProgress}>
                                        <View style={styles.styViewProgress}>
                                            <View style={[styles.styValProgress, { width: `${valueProgress}%` }]} />
                                        </View>
                                    </View>
                                    <View style={styles.styRightProgress}>
                                        <Text style={styleSheets.lable}>
                                            {dataItem?.Progress ? dataItem?.Progress : ''}
                                        </Text>
                                    </View>
                                </View>
                            </View>

                            {/* Evaluate */}
                            <View
                                style={CustomStyleSheet.marginRight(6)}
                            >
                                <View style={styles.wrapLable}>
                                    <Text style={[styleSheets.lable, CustomStyleSheet.marginRight(6)]}>
                                        {translate(['HRM_PortalApp_Contract_Evaluate'])}
                                    </Text>
                                </View>
                                {/* Evaluate Criteria */}
                                <View>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => {
                                            this.setState({
                                                dataItem: {
                                                    ...dataItem,
                                                    isShowPerformanceEvaDetail: !dataItem?.isShowPerformanceEvaDetail
                                                }
                                            });
                                        }}
                                        style={styles.wrapNameEvalution}
                                    >
                                        <View style={styles.flex_Row_Ali_Center_Jus_Beet}>
                                            <View style={CustomStyleSheet.flex(1)}>
                                                <Text style={[styleSheets.lable, { fontSize: Size.text + 1 }]}>
                                                    {translate(['HRM_PortalApp_Contract_EvaluateCriteria'])}
                                                </Text>
                                            </View>

                                            <View style={[CustomStyleSheet.flex(1), CustomStyleSheet.alignItems('flex-end')]}>
                                                {dataItem?.isShowPerformanceEvaDetail ? (
                                                    <IconShowDown size={20} color={Colors.black} />
                                                ) : (
                                                    <IconShowUp size={20} color={Colors.black} />
                                                )}
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    {dataItem?.isShowPerformanceEvaDetail && (
                                        <View style={CustomStyleSheet.flex(1)}>
                                            {Array.isArray(dataItem?.PerformanceEvaDetail) &&
                                                dataItem?.PerformanceEvaDetail.map((item, index) => {
                                                    return (
                                                        <View
                                                            style={{
                                                                paddingHorizontal: styleSheets.p_10 + 12
                                                            }}
                                                            key={index}
                                                        >
                                                            <VnrTextInput
                                                                placeHolder={'HRM_PortalApp_Contract_EnterNumber'}
                                                                disable={false}
                                                                lable={item?.KPIName}
                                                                style={[
                                                                    styleSheets.text,
                                                                    stylesVnrPickerV3.viewInputMultiline,
                                                                    CustomStyleSheet.minHeight(40)
                                                                ]}
                                                                styleContent={CustomStyleSheet.paddingHorizontal(0)}
                                                                multiline={false}
                                                                charType="int"
                                                                keyboardType="numeric"
                                                                value={!isNaN(item?.Actual) ? `${item?.Actual}` : ''}
                                                                onChangeText={text => {
                                                                    if (text.length === 0) {
                                                                        delete dataItem.PerformanceEvaDetail[index]
                                                                            .Actual;
                                                                        dataItem.PerformanceEvaDetail[
                                                                            index
                                                                        ].IsChangeActual = false;
                                                                    } else {
                                                                        dataItem.PerformanceEvaDetail[
                                                                            index
                                                                        ].Actual = text ? Number(text) : text;
                                                                        dataItem.PerformanceEvaDetail[
                                                                            index
                                                                        ].IsChangeActual = true;
                                                                    }

                                                                    this.setState(
                                                                        {
                                                                            dataItem: { ...dataItem }
                                                                        },
                                                                        () => {
                                                                            setTimeout(() => {
                                                                                this.handleValidePoindEvalute(
                                                                                    dataItem,
                                                                                    index
                                                                                );
                                                                            }, 100);
                                                                        }
                                                                    );
                                                                }}
                                                                refresh={item?.refresh}
                                                            />
                                                        </View>
                                                    );
                                                })}
                                            <View style={styles.wrapLablePoint}>
                                                <Text numberOfLines={2} style={[styleSheets.lable, CustomStyleSheet.marginLeft(6)]}>
                                                    {`${translate('HRM_PortalApp_Contract_FinalAverage')}: ${dataItem?.OverallScore ? dataItem?.OverallScore : 0
                                                    }`}
                                                    {'  '}
                                                    {`${translate('HRM_PortalApp_Contract_Average')}: ${dataItem?.TotalMark ? dataItem?.TotalMark : 0
                                                    }`}
                                                </Text>
                                            </View>
                                        </View>
                                    )}
                                </View>

                                {/* Level Assessment History */}
                                <View>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => {
                                            this.setState({
                                                dataItem: {
                                                    ...dataItem,
                                                    isShowLevelAssessmentHistory: !dataItem?.isShowLevelAssessmentHistory
                                                }
                                            });
                                        }}
                                        style={styles.wrapNameEvalution}
                                    >
                                        <View style={styles.flex_Row_Ali_Center_Jus_Beet}>
                                            <View style={CustomStyleSheet.flex(1)}>
                                                <Text style={[styleSheets.lable, { fontSize: Size.text + 1 }]}>
                                                    {translate(['HRM_PortalApp_Contract_LevelAssessmentHistory'])}
                                                </Text>
                                            </View>

                                            <View style={[CustomStyleSheet.flex(1), CustomStyleSheet.alignItems('flex-end')]}>
                                                {dataItem?.isShowLevelAssessmentHistory ? (
                                                    <IconShowDown size={20} color={Colors.black} />
                                                ) : (
                                                    <IconShowUp size={20} color={Colors.black} />
                                                )}
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    {dataItem?.isShowLevelAssessmentHistory && dataItem?.HistoryEvaID && (
                                        <View
                                            style={CustomStyleSheet.flex(1)}
                                        >
                                            <View style={styles.wrapInheritance}>
                                                <View style={styles.wrapNameAndIconInheritance}>
                                                    {Vnr_Function.renderAvatarCricleByName(
                                                        dataItem.HisEvaluatorImagePath,
                                                        dataItem.HisEvaluatorName,
                                                        32,
                                                        true
                                                    )}
                                                    <View style={CustomStyleSheet.marginLeft(6)}>
                                                        <Text
                                                            numberOfLines={2}
                                                            style={[
                                                                styleSheets.lable,
                                                                CustomStyleSheet.fontSize(Size.text + 1), CustomStyleSheet.maxWidth('100%')
                                                            ]}
                                                        >
                                                            {dataItem?.HisEvaluatorName
                                                                ? dataItem?.HisEvaluatorName
                                                                : ''}
                                                        </Text>
                                                    </View>
                                                </View>

                                                <TouchableOpacity
                                                    onPress={() => {
                                                        this.handleInheritance();
                                                    }}
                                                    style={styles.btnInheritance}
                                                >
                                                    <Image
                                                        source={require('../../../../../assets/images/outline.png')}
                                                        style={styles.size16}
                                                    />
                                                    <Text style={[styleSheets.text, styles.textInheritance]}>
                                                        {translate('HRM_PortalApp_Contract_Inheritance')}
                                                    </Text>
                                                </TouchableOpacity>
                                            </View>

                                            <View>
                                                <View style={styles.wrapLabelEvaluateCriteria}>
                                                    <Text style={[styleSheets.lable, { fontSize: Size.text + 1 }]}>
                                                        {translate(['HRM_PortalApp_Contract_EvaluateCriteria'])}
                                                    </Text>
                                                </View>

                                                <View style={CustomStyleSheet.flex(1)}>
                                                    {Array.isArray(dataItem?.HisPerformanceEvaDetail) &&
                                                        dataItem?.HisPerformanceEvaDetail.map((item, index) => {
                                                            return (
                                                                <View style={styles.wrapCriteriaNeedEva} key={index}>
                                                                    <View>
                                                                        <Text
                                                                            style={[
                                                                                styleSheets.text,
                                                                                {
                                                                                    fontSize: Size.text + 1,
                                                                                    color: Colors.gray_7
                                                                                }
                                                                            ]}
                                                                        >
                                                                            {item?.KPIName}
                                                                        </Text>
                                                                        <Text
                                                                            style={[
                                                                                styleSheets.lable,
                                                                                { fontSize: Size.text + 1 }
                                                                            ]}
                                                                        >
                                                                            {item?.Actual}
                                                                        </Text>
                                                                    </View>
                                                                </View>
                                                            );
                                                        })}
                                                    <View
                                                        style={[
                                                            styles.wrapLablePoint,
                                                            {
                                                                paddingHorizontal: styleSheets.p_10 + 12
                                                            }
                                                        ]}
                                                    >
                                                        <Text
                                                            numberOfLines={2}
                                                            style={[styleSheets.lable, CustomStyleSheet.marginLeft(6)]}
                                                        >
                                                            {`${translate('HRM_PortalApp_Contract_FinalAverage')}: ${dataItem?.OverallScore ? dataItem?.OverallScore : 0
                                                            }`}
                                                            {'  '}
                                                            {`${translate('HRM_PortalApp_Contract_Average')}: ${dataItem?.TotalMark ? dataItem?.TotalMark : 0
                                                            }`}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>

                                            <View>
                                                <View style={styles.wrapLabelEvaluateCriteria}>
                                                    <Text style={[styleSheets.lable, { fontSize: Size.text + 1 }]}>
                                                        {translate(['HRM_PortalApp_Contract_GeneralAppraisal'])}
                                                    </Text>
                                                </View>

                                                <View style={styles.wrapLabelEvaluateCriteria}>
                                                    <View>
                                                        <Text style={[styleSheets.lable, { fontSize: Size.text + 1 }]}>
                                                            {translate('HRM_PortalApp_Contract_Strengths')}
                                                        </Text>
                                                        <Text style={[styleSheets.text, { fontSize: Size.text + 1 }]}>
                                                            {dataItem?.HisStrengths ? dataItem?.HisStrengths : ''}
                                                        </Text>
                                                    </View>
                                                    <View style={CustomStyleSheet.marginVertical(4)}>
                                                        <Text style={[styleSheets.lable, { fontSize: Size.text + 1 }]}>
                                                            {translate('HRM_PortalApp_Contract_Weaknesses')}
                                                        </Text>
                                                        <Text style={[styleSheets.text, { fontSize: Size.text + 1 }]}>
                                                            {dataItem?.HisWeaknesses ? dataItem?.HisWeaknesses : ''}
                                                        </Text>
                                                    </View>
                                                    <View>
                                                        <Text style={[styleSheets.lable, { fontSize: Size.text + 1 }]}>
                                                            {translate('Note')}
                                                        </Text>
                                                        <Text style={[styleSheets.text, { fontSize: Size.text + 1 }]}>
                                                            {dataItem?.HisNoteEvaluator
                                                                ? dataItem?.HisNoteEvaluator
                                                                : ''}
                                                        </Text>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>
                                    )}
                                </View>

                                {/* General Appraisal */}
                                <View>
                                    <TouchableOpacity
                                        activeOpacity={1}
                                        onPress={() => {
                                            this.setState({
                                                dataItem: {
                                                    ...dataItem,
                                                    isShowGeneralAppraisalDetail: !dataItem?.isShowGeneralAppraisalDetail
                                                }
                                            });
                                        }}
                                        style={styles.wrapNameEvalution}
                                    >
                                        <View style={styles.flex_Row_Ali_Center_Jus_Beet}>
                                            <View style={CustomStyleSheet.flex(1)}>
                                                <Text style={[styleSheets.lable, { fontSize: Size.text + 1 }]}>
                                                    {translate(['HRM_PortalApp_Contract_GeneralAppraisal'])}
                                                </Text>
                                            </View>

                                            <View style={[CustomStyleSheet.flex(1), CustomStyleSheet.alignItems('flex-end')]}>
                                                {dataItem?.isShowGeneralAppraisalDetail ? (
                                                    <IconShowDown size={20} color={Colors.black} />
                                                ) : (
                                                    <IconShowUp size={20} color={Colors.black} />
                                                )}
                                            </View>
                                        </View>
                                    </TouchableOpacity>
                                    {dataItem?.isShowGeneralAppraisalDetail && (
                                        <View
                                            style={[[CustomStyleSheet.flex(1), CustomStyleSheet.paddingHorizontal(styleSheets.p_10)]]}
                                        >
                                            <VnrTextInput
                                                placeHolder={'HRM_PortalApp_PleaseInput'}
                                                disable={false}
                                                lable={Strengths.lable}
                                                style={[styleSheets.text, stylesVnrPickerV3.viewInputMultiline]}
                                                multiline={true}
                                                value={Strengths.value}
                                                onChangeText={text => {
                                                    this.setState({
                                                        Strengths: {
                                                            ...Strengths,
                                                            value: text,
                                                            refresh: !Strengths.refresh
                                                        }
                                                    });
                                                }}
                                                refresh={Strengths?.refresh}
                                            />

                                            <VnrTextInput
                                                placeHolder={'HRM_PortalApp_PleaseInput'}
                                                disable={false}
                                                lable={Weaknesses.lable}
                                                style={[styleSheets.text, stylesVnrPickerV3.viewInputMultiline]}
                                                multiline={true}
                                                value={Weaknesses.value}
                                                onChangeText={text => {
                                                    this.setState({
                                                        Weaknesses: {
                                                            ...Weaknesses,
                                                            value: text,
                                                            refresh: !Weaknesses.refresh
                                                        }
                                                    });
                                                }}
                                                refresh={NoteEvaluator?.refresh}
                                            />

                                            <VnrTextInput
                                                placeHolder={'HRM_PortalApp_PleaseInput'}
                                                disable={false}
                                                lable={NoteEvaluator.lable}
                                                style={[styleSheets.text, stylesVnrPickerV3.viewInputMultiline]}
                                                multiline={true}
                                                value={NoteEvaluator.value}
                                                onChangeText={text => {
                                                    this.setState({
                                                        NoteEvaluator: {
                                                            ...NoteEvaluator,
                                                            value: text,
                                                            refresh: !NoteEvaluator.refresh
                                                        }
                                                    });
                                                }}
                                                refresh={NoteEvaluator?.refresh}
                                            />
                                        </View>
                                    )}
                                </View>
                            </View>

                            {/* Confirm */}
                            <View>
                                <View style={styles.wrapLable}>
                                    <Text style={[styleSheets.lable, CustomStyleSheet.marginLeft(6)]}>
                                        {translate(['HRM_PortalApp_Contract_Confirm'])}
                                    </Text>
                                </View>

                                {/* Kết quả đánh giá - ResultsContractEva */}
                                <View style={CustomStyleSheet.flex(1)}>
                                    {ResultsContractEva.visible && ResultsContractEva.visibleConfig && (
                                        <VnrPickerLittle
                                            refresh={ResultsContractEva.refresh}
                                            api={{
                                                urlApi: '[URI_CENTER]/api/Att_GetData/GetEnum?text=ResultsContractEva',
                                                type: 'E_GET'
                                            }}
                                            value={ResultsContractEva.value}
                                            textField="Text"
                                            valueField="Value"
                                            filter={false}
                                            disable={ResultsContractEva.disable}
                                            lable={ResultsContractEva.lable}
                                            stylePicker={styles.resetBorder}
                                            isChooseQuickly={true}
                                            onFinish={item => {
                                                this.handleResultsContractEva(item);
                                            }}
                                        />
                                    )}

                                    {/* Xử lý hợp đồng - ResultEva */}
                                    {ResultEva.visible && ResultEva.visibleConfig && (
                                        <VnrPickerLittle
                                            refresh={ResultEva.refresh}
                                            api={{
                                                urlApi: '[URI_CENTER]/api/Att_GetData/GetEnum?text=ResultEva',
                                                type: 'E_GET'
                                            }}
                                            value={ResultEva.value}
                                            textField="Text"
                                            valueField="Value"
                                            filter={false}
                                            disable={ResultEva.disable}
                                            lable={ResultEva.lable}
                                            stylePicker={styles.resetBorder}
                                            isChooseQuickly={true}
                                            onFinish={item => {
                                                this.setState({
                                                    ResultEva: {
                                                        ...ResultEva,
                                                        value: item ? item : null,
                                                        refresh: !ResultEva.refresh
                                                    }
                                                });
                                            }}
                                        />
                                    )}

                                    {/* Loại hợp đồng -  NextContractTypeID */}
                                    {NextContractTypeID?.visible && NextContractTypeID?.visibleConfig && (
                                        <VnrPickerQuickly
                                            refresh={NextContractTypeID.refresh}
                                            api={{
                                                urlApi: '[URI_CENTER]/api/Cat_GetData/GetContractTypeMulti',
                                                type: 'E_GET'
                                            }}
                                            value={NextContractTypeID.value}
                                            textField="ContractTypeName"
                                            valueField="ID"
                                            filter={true}
                                            filterServer={true}
                                            filterParams="text"
                                            disable={NextContractTypeID.disable}
                                            lable={NextContractTypeID.lable}
                                            onFinish={item => {
                                                this.setState(
                                                    {
                                                        NextContractTypeID: {
                                                            ...NextContractTypeID,
                                                            value: item,
                                                            refresh: !NextContractTypeID.refresh
                                                        }
                                                    },
                                                    () => {
                                                        this.handleChooseNextContractTypeID();
                                                    }
                                                );
                                            }}
                                        />
                                    )}

                                    {/* Thời hạn hợp đồng - DurationNextContract */}
                                    {DurationNextContract?.visible && DurationNextContract.visibleConfig && (
                                        <View style={styles.wrapDurationNextContract}>
                                            <View style={CustomStyleSheet.flex(0.3)}>
                                                <Text
                                                    numberOfLines={2}
                                                    style={[
                                                        styleSheets.text,
                                                        stylesVnrPickerV3.styLbNotHaveValuePicker,
                                                        CustomStyleSheet.maxWidth('100%')
                                                    ]}
                                                >
                                                    {translate(DurationNextContract.lable)}
                                                </Text>
                                            </View>
                                            <View
                                                style={styles.wrapInputDurationNextContract}
                                            >
                                                {UnitTimeNextContract.value?.Value !== 'E_INDEFINITE' && (
                                                    <View style={CustomStyleSheet.flex(0.3)}>
                                                        <VnrTextInput
                                                            placeHolder={DurationNextContract.placeHolder}
                                                            disable={DurationNextContract.disable}
                                                            keyboardType={'numeric'}
                                                            charType={'double'}
                                                            returnKeyType={'done'}
                                                            style={[styleSheets.text, CustomStyleSheet.textAlign('right')]}
                                                            styleContent={[CustomStyleSheet.borderBottomWidth(0), CustomStyleSheet.paddingHorizontal(0)]}
                                                            value={DurationNextContract.value}
                                                            onChangeText={text => {
                                                                if (text !== '0') {
                                                                    this.setState(
                                                                        {
                                                                            DurationNextContract: {
                                                                                ...DurationNextContract,
                                                                                value: text,
                                                                                refresh: !DurationNextContract.refresh
                                                                            }
                                                                        },
                                                                        () => {
                                                                            if (UnitTimeNextContract.value?.Value) {
                                                                                this.handleChooseNextContractTypeID({
                                                                                    Duration: Number(text),
                                                                                    UnitTime:
                                                                                        UnitTimeNextContract.value
                                                                                            ?.Value
                                                                                });
                                                                            }
                                                                        }
                                                                    );
                                                                }
                                                            }}
                                                            refresh={DurationNextContract.refresh}
                                                        />
                                                    </View>
                                                )}
                                                <View
                                                    style={[
                                                        CustomStyleSheet.flex(0.7),
                                                        UnitTimeNextContract.value?.Value === 'E_INDEFINITE' && CustomStyleSheet.flex(1)
                                                    ]}
                                                >
                                                    <VnrPickerLittle
                                                        refresh={UnitTimeNextContract.refresh}
                                                        dataLocal={dataDefaultUnitTimeNextContract}
                                                        lable={' '}
                                                        value={UnitTimeNextContract.value}
                                                        textField="Text"
                                                        valueField="Value"
                                                        filter={false}
                                                        disable={UnitTimeNextContract.disable}
                                                        placeholder={translate('HRM_Category_Element_SelectFormula')}
                                                        stylePicker={CustomStyleSheet.borderBottomWidth(0)}
                                                        isChooseQuickly={true}
                                                        onFinish={item => {
                                                            this.handleDurationNextContract(item);
                                                        }}
                                                    />
                                                </View>
                                            </View>
                                        </View>
                                    )}

                                    {/* Thời hạn hợp đồng -  DateContract*/}
                                    {DateContract.visible && DateContract.visibleConfig && (
                                        <VnrDateFromTo
                                            lable={DateContract.lable}
                                            refresh={DateContract.refresh}
                                            value={DateContract.value}
                                            isOptionChooseAboutDays={true}
                                            disable={DateContract.disable}
                                            isControll={true}
                                            isHiddenIcon={true}
                                            onFinish={value => {
                                                this.setState({
                                                    DateContract: {
                                                        ...DateContract,
                                                        value: value ? value : {},
                                                        refresh: !DateContract.refresh
                                                    }
                                                });
                                            }}
                                        />
                                    )}
                                </View>
                            </View>
                        </View>

                        {/* Evaluation Process */}
                        <View style={contentScroll}>
                            <View
                                style={[
                                    styles.wrapLable,
                                    CustomStyleSheet.marginBottom(16)
                                ]}
                            >
                                <Text style={[styleSheets.lable, CustomStyleSheet.marginLeft(6)]}>
                                    {translate(['HRM_PortalApp_Contract_EvaluationProcess'])}
                                </Text>
                            </View>
                            {dataApprover.length > 0 &&
                                dataApprover.map((item, index) => {
                                    return (
                                        <View
                                            key={index}
                                            style={[CustomStyleSheet.marginBottom(Size.defineSpace - 4), CustomStyleSheet.paddingHorizontal(16)]}
                                        >
                                            <View style={stylesScreenDetailV3.wrapLevelApproveAndDisplaykey}>
                                                <View
                                                    style={[
                                                        stylesScreenDetailV3.wrapLevelApprove,
                                                        (item?.StatusProcess === EnumName.E_success ||
                                                            item?.StatusProcess === EnumName.E_process ||
                                                            dataApprover[index - 1]?.StatusProcess ===
                                                            EnumName.E_success) && {
                                                            backgroundColor: Colors.green
                                                        },
                                                        item?.FieldName === 'UserReject' && {
                                                            backgroundColor: Colors.red
                                                        }
                                                    ]}
                                                >
                                                    {item?.FieldName === 'UserReject' ? (
                                                        <IconCancel size={Size.iconSize - 10} color={Colors.white} />
                                                    ) : item?.StatusProcess === EnumName.E_success ? (
                                                        <IconCheck size={Size.iconSize - 10} color={Colors.white} />
                                                    ) : (
                                                        <Text
                                                            style={[
                                                                styleSheets.styTextValueDateTimeStatus,
                                                                item?.StatusProcess === EnumName.E_process && {
                                                                    color: Colors.white
                                                                }
                                                            ]}
                                                        >
                                                            {index + 1}
                                                        </Text>
                                                    )}
                                                </View>
                                                <VnrText
                                                    style={[styleSheets.text, styTextLable]}
                                                    i18nKey={configLeveApprove[index]?.DisplayKey}
                                                    value={configLeveApprove[index]?.DisplayKey}
                                                />
                                            </View>
                                            <View style={[stylesScreenDetailV3.wrapInforApprover]}>
                                                <View style={stylesScreenDetailV3.wrapStraightLine}>
                                                    <View
                                                        style={[
                                                            stylesScreenDetailV3.straightLine,
                                                            (item?.StatusProcess === EnumName.E_success ||
                                                                item?.StatusProcess === EnumName.E_process ||
                                                                dataApprover[index - 1]?.StatusProcess ===
                                                                EnumName.E_success) && {
                                                                backgroundColor: Colors.green
                                                            },
                                                            item?.FieldName === 'UserReject' && {
                                                                backgroundColor: Colors.red
                                                            }
                                                        ]}
                                                    />
                                                </View>
                                                <View style={CustomStyleSheet.flex(1)}>
                                                    <View style={stylesVnrFilter.viewLable}>
                                                        {Vnr_Function.renderAvatarCricleByName(
                                                            item?.ImagePath,
                                                            item[(configLeveApprove[index]?.Name)]
                                                                ? item[(configLeveApprove[index]?.Name)]
                                                                : 'A',
                                                            sizeImg
                                                        )}
                                                        <View style={styleSheets.wrapNameAndSubtitle}>
                                                            <View style={CustomStyleSheet.flex(1)}>
                                                                <Text
                                                                    numberOfLines={2}
                                                                    style={[styleSheets.subTitleApprover]}
                                                                >
                                                                    <Text style={[styleSheets.detailNameApprover]}>
                                                                        {item[(configLeveApprove[index]?.Name)]}{' '}
                                                                    </Text>
                                                                    {item?.Content
                                                                        ? item?.Content
                                                                        : item?.FieldName === 'UserReject'
                                                                            ? translate('HRM_PortalApp_Rejected')
                                                                            : item?.StatusProcess === EnumName.E_success
                                                                                ? translate('HRM_PortalApp_Approved')
                                                                                : ''}
                                                                </Text>
                                                            </View>
                                                            {item?.PositionName && (
                                                                <Text style={[styleSheets.detailPositionApprover]}>
                                                                    {item?.PositionName}
                                                                </Text>
                                                            )}
                                                        </View>
                                                    </View>
                                                    {item?.Comment ? (
                                                        <View
                                                            style={[
                                                                { marginLeft: sizeImg + Size.defineSpace - 4 },
                                                                stylesScreenDetailV3.styleComment
                                                            ]}
                                                        >
                                                            <Text style={styleSheets.text}>{item?.Comment}</Text>
                                                        </View>
                                                    ) : null}
                                                    {item?.DateUpdated && (
                                                        <View style={[{ marginLeft: sizeImg + Size.defineSpace - 4 }]}>
                                                            <Text style={[CustomStyleSheet.fontSize(12), CustomStyleSheet.fontWeight('400')]}>
                                                                {translate('E_AT_TIME')}{' '}
                                                                {moment(item?.DateUpdated).format('HH:mm, DD/MM/YYYY')}
                                                            </Text>
                                                        </View>
                                                    )}
                                                </View>
                                            </View>
                                        </View>
                                    );
                                })}
                        </View>
                    </ScrollView>
                    {/* button */}
                    {dataItem?.StatusPerFormance !== 'E_Evaluated' && (
                        <View style={styleComonAddOrEdit.wrapButtonHandler}>
                            {PermissionForAppMobile &&
                                PermissionForAppMobile.value['New_HreEvalutionContract_btnEvaluation'] &&
                                PermissionForAppMobile.value['New_HreEvalutionContract_btnEvaluation']['View'] && (
                                <TouchableOpacity
                                    style={[styleComonAddOrEdit.wrapBtnRegister, CustomStyleSheet.marginRight(6)]}
                                    onPress={() => {
                                        this.handleOnSave(true);
                                    }}
                                >
                                    <VnrText
                                        style={[styleSheets.lable, styleComonAddOrEdit.styRegister]}
                                        i18nKey={'HRM_PortalApp_Contract_Evaluation'}
                                    />
                                </TouchableOpacity>
                            )}

                            {PermissionForAppMobile &&
                                PermissionForAppMobile.value['New_HreEvalutionContract_btnSaveTemp'] &&
                                PermissionForAppMobile.value['New_HreEvalutionContract_btnSaveTemp']['View'] && (
                                <TouchableOpacity
                                    style={[
                                        styleComonAddOrEdit.btnSaveTemp,
                                        !PermissionForAppMobile.value['New_HreEvalutionContract_btnEvaluation'][
                                            'View'
                                        ] && CustomStyleSheet.paddingVertical(8)
                                    ]}
                                    onPress={() => this.handleOnSave(false)}
                                >
                                    <IconSave size={Size.iconSize} color={'#000'} />
                                </TouchableOpacity>
                            )}

                            <TouchableOpacity
                                style={styleComonAddOrEdit.btnRefresh}
                                onPress={() => this.handleRefresh(dataItem)}
                            >
                                <Image
                                    style={{ width: Size.iconSize, height: Size.iconSize }}
                                    resizeMode="cover"
                                    source={require('../../../../../assets/images/vnrDateFromTo/reset-sm.png')}
                                />
                            </TouchableOpacity>
                        </View>
                    )}
                </View>
            );
        } else if (dataItem == 'EmptyData') {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                <View style={[styleSheets.container]}>
                    <KeyboardAvoidingView
                        style={CustomStyleSheet.flex(1)}
                        scrollEnabled={true}
                        behavior={Platform.OS == 'ios' ? 'padding' : 'height'}
                    >
                        {contentViewDetail}
                        <View
                            style={styles.empty}
                        />
                    </KeyboardAvoidingView>
                </View>
            </SafeAreaViewDetail>
        );
    }
}

const styles = StyleSheet.create({
    styProgress: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center'
    },
    styLeftProgress: {
        flex: 9,
        paddingRight: Size.defineSpace
    },
    styRightProgress: {
        flex: 1
    },
    styViewProgress: {
        height: 6,
        borderRadius: 6,
        backgroundColor: Colors.gray_5
    },
    styValProgress: {
        height: 6,
        borderRadius: 6,
        backgroundColor: Colors.primary
    },
    flex_Row_Ali_Center: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    textProfileName: {
        fontSize: Size.text - 1,
        color: Colors.blue
    },
    wrapLable: {
        backgroundColor: Colors.gray_3,
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center'
    },
    wrapNameEvalution: {
        paddingHorizontal: styleSheets.p_10 + 12,
        paddingVertical: styleSheets.p_10,
        borderBottomColor: Colors.gray_3,
        borderBottomWidth: 0.5
    },
    flex_Row_Ali_Center_Jus_Beet: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    wrapLablePoint: {
        backgroundColor: Colors.gray_3,
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center'
    },
    wrapInheritance: {
        paddingVertical: 8,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        paddingHorizontal: styleSheets.p_10 + 12
    },
    wrapNameAndIconInheritance: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: '60%'
    },
    btnInheritance: {
        borderColor: Colors.blue,
        borderWidth: 1,
        borderRadius: 4,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 6
    },
    textInheritance: {
        fontSize: Size.text,
        marginLeft: 6,
        color: Colors.blue
    },
    wrapLabelEvaluateCriteria: {
        flex: 1,
        paddingHorizontal: styleSheets.p_10 + 12,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5,
        paddingVertical: 12
    },
    size16: {
        width: 16,
        height: 16
    },
    wrapCriteriaNeedEva: {
        paddingHorizontal: styleSheets.p_10 + 12,
        paddingVertical: 6,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    },

    wrapDurationNextContract: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingLeft: 8,
        borderBottomColor: Colors.gray_5,
        borderBottomWidth: 0.5
    },

    wrapInputDurationNextContract: {
        flex: 0.7,
        flexDirection: 'row',
        alignItems: 'center'
    },

    empty: {
        position: 'absolute',
        bottom: Size.defineSpace,
        right: 0
    }
});
