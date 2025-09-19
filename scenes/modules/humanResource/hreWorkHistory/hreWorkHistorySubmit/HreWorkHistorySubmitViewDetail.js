/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import { View, ScrollView, Text, Image, StyleSheet } from 'react-native';
import { styleSheets, styleScreenDetail, styleSafeAreaView, Colors, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import VnrFormatStringType from '../../../../../componentsV3/VnrFormatStringType/VnrFormatStringType';
import { translate } from '../../../../../i18n/translate';
import moment from 'moment';
import HttpService from '../../../../../utils/HttpService';
import { EnumName, ScreenName } from '../../../../../assets/constant';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';

const configDefault = [
        {
            TypeView: 'E_COMMON',
            Name: 'TypeOfTransferName',
            DisplayKey: 'HRM_PortalApp_WorkProcess',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'JobTitleName',
            NameOld: 'JobTitleOld',
            DisplayKey: 'HRM_Portal_Button_Working_History',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'GrossAmountCurrencyName',
            NameOld: 'GrossAmountCurrencyName_Old',
            DisplayKey: 'HRM_PortalApp_BasicSalary',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'OrgStructureName',
            NameOld: 'OrgStructureName_Old',
            DisplayKey: 'HRM_Hre_ApproveWalletConfirmation_OrgStructureName',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'PositionName',
            NameOld: 'Position_Old',
            DisplayKey: 'HRM_HR_Profile_PositionName',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'JobTitleName',
            NameOld: 'OldJobTitleName',
            DisplayKey: 'HRM_HR_Profile_JobTitleName',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'SalaryClassName',
            NameOld: 'SalaryClassName_Old',
            DisplayKey: 'HRM_PortalApp_SalaryGrades',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'WorkPlaceName',
            NameOld: 'WorkLocationOld',
            DisplayKey: 'HRM_PortalApp_WorkHistory_Workplace',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'SupervisorName',
            NameOld: 'SupervisorName_Old',
            DisplayKey: 'HRM_PortalApp_DirectManager',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'MidSupervisorName',
            NameOld: 'MidSupervisorName_Old',
            DisplayKey: 'HRM_PortalApp_MidManager',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'NextSupervisorName',
            NameOld: 'NextSupervisorName_Old',
            DisplayKey: 'HRM_PortalApp_NextManager',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'HighSupervisorName',
            NameOld: 'HighSupervisor_Old',
            DisplayKey: 'HRM_PortalApp_SeniorManager',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'UserApproveName',
            DisplayKey: 'HRM_PortalApp_Approval_UserApproveID',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'UserApproveName3',
            DisplayKey: 'HRM_PortalApp_Approval_UserApproveID2',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'UserApproveName4',
            DisplayKey: 'HRM_PortalApp_Approval_UserApproveID3',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'UserApproveName2',
            DisplayKey: 'HRM_PortalApp_Approval_UserApproveID4',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'KPIAmountCurrencyName',
            NameOld: 'KPIAmountCurrencyName_Old',
            DisplayKey: 'HRM_PortalApp_WorkHistory_KPIAmount',
            DataType: 'string',
            isSalary: true
        },
        {
            TypeView: 'E_COMMON',
            Name: 'AmountTotalCurrencyName',
            NameOld: 'AmountTotalCurrencyName_Old',
            DisplayKey: 'HRM_PortalApp_ContractHistory_Salary',
            DataType: 'string',
            isSalary: true
        },
        {
            TypeView: 'E_COMMON',
            Name: 'Note',
            DisplayKey: 'Notes',
            DataType: 'string'
        },
        {
            TypeView: 'E_FILEATTACH',
            Name: 'lstFileAttach',
            DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
            DataType: 'FileAttach'
        }
    ],
    dataFilter = [
        {
            id: 1,
            lable: 'HRM_PortalApp_WorkProcess',
            enum: 'Hre_WorkHistory',
            icon: require('../../../../../assets/images/workhistory/workhistory.png'),
            isSelected: false
        },
        {
            id: 2,
            lable: 'ModuleFunction__E_REWARD',
            enum: 'Hre_Reward',
            icon: require('../../../../../assets/images/workhistory/reward.png'),
            isSelected: false
        },
        {
            id: 3,
            lable: 'HRM_PortalApp_SalaryLevel',
            enum: 'Sal_BasicSalary',
            icon: require('../../../../../assets/images/workhistory/basicsalary.png'),
            isSelected: false
        },
        {
            id: 4,
            lable: 'ModuleFunction__E_CONCURRENT',
            enum: 'Hre_ConCurrent',
            icon: require('../../../../../assets/images/workhistory/concurrent.png'),
            isSelected: false
        },
        {
            id: 5,
            lable: 'ModuleFunction__E_DISCIPLINE',
            enum: 'Hre_Discipline',
            icon: require('../../../../../assets/images/workhistory/discipline.png'),
            isSelected: false
        },
        {
            id: 6,
            lable: 'HRM_Hr_Hre_IsCopyAccident',
            enum: 'Hre_Accident',
            icon: require('../../../../../assets/images/workhistory/accident.png'),
            isSelected: false
        }
    ],
    configDefaultReward = [
        {
            TypeView: 'E_COMMON',
            Name: 'RewardedTypeName',
            DisplayKey: 'HRM_HR_Reward_RewardedTypeID',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'RewardCurrencyName',
            DisplayKey: 'HRM_HR_Reward_RewardValue',
            DataType: 'string',
            isSalary: true
        },
        {
            TypeView: 'E_COMMON',
            Name: 'NoOfReward',
            DisplayKey: 'HRM_PortalApp_NoOfReward',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'PayCutOffDurationName',
            DisplayKey: 'HRM_PortalApp_PayCutOffDuration',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'Description',
            DisplayKey: 'Description',
            DataType: 'string'
        },
        {
            TypeView: 'E_FILEATTACH',
            Name: 'lstFileAttach',
            DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
            DataType: 'FileAttach'
        }
    ],
    configDefaultConCurrent = [
        {
            TypeView: 'E_COMMON',
            Name: 'DecisionNoConCurrent',
            DisplayKey: 'HRM_HR_Discipline_DecisionNo',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'OrgStructureNameConCurrent',
            DisplayKey: 'HRM_PortalApp_ConcurrentOrgstructure',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'JobTitleName',
            NameOld: 'JobTitleOld',
            DisplayKey: 'HRM_PortalApp_WorkHistory_ConcurrentJobtitle',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'OrgStructureNameConCurrent',
            DisplayKey: 'HRM_PortalApp_WorkHistory_ConcurrentPosition',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'DateComeBack',
            DisplayKey: 'HRM_PortalApp_DayComeback',
            DataType: 'DateTime',
            DataFormat: 'DD/MM/YYYY'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'SalaryClassNameConCurrent',
            DisplayKey: 'HRM_PortalApp_InspectionSalaryRange',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'DateNotice',
            DisplayKey: 'HRM_PortalApp_DateOfNoticeOfTransfer',
            DataType: 'DateTime',
            DataFormat: 'DD/MM/YYYY'
        },
        {
            TypeView: 'E_FILEATTACH',
            Name: 'lstFileAttach',
            DisplayKey: '',
            DataType: 'FileAttach'
        }
    ],
    configDefaultConCurrentAllowance = [
        {
            TypeView: 'E_COMMON',
            Name: 'TypeAllowanceName',
            DisplayKey: 'HRM_PortalApp_TypeOfAllowance',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'UnusualAllowanceCfgName',
            DisplayKey: 'HRM_PortalApp_NameOfAllowance',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'AllowanceCurrencyName',
            DisplayKey: 'HRM_PortalApp_AmountOfMoney',
            DataType: 'string',
            isSalary: true
        },
        {
            TypeView: 'E_COMMON',
            Name: 'AllowanceMonthStart',
            NameSecond: 'AllowanceMonthEnd',
            DisplayKey: 'HRM_PortalApp_Concurrent_EffectiveTime',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'Notes',
            DisplayKey: 'Notes',
            DataType: 'string'
        }
    ],
    configDefaultDiscipline = [
        {
            TypeView: 'E_COMMON',
            Name: 'DisciplinedTypesName',
            DisplayKey: 'HRM_HR_Reward_RewardedTypeID',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'CountDis',
            DisplayKey: 'HRM_CountDiscipline',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'DisciplineReson',
            DisplayKey: 'HRM_PortalApp_DisciplineReson',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'DecisionNo',
            DisplayKey: 'HRM_PortalApp_DecisionNo',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'DisciplineTypeName',
            DisplayKey: 'HRM_PortalApp_DisciplineType',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'EffectiveTime',
            DisplayKey: 'HRM_PortalApp_DisciplineTime',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'AmountOfFine',
            DisplayKey: 'HRM_PortalApp_AmountOfFine',
            DataType: 'string',
            isSalary: true
        },
        {
            TypeView: 'E_COMMON',
            Name: 'Notes',
            DisplayKey: 'Notes',
            DataType: 'string'
        },
        {
            TypeView: 'E_FILEATTACH',
            Name: 'lstFileAttach',
            DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
            DataType: 'FileAttach'
        }
    ],
    configDefaultAccident = [
        {
            TypeView: 'E_COMMON',
            Name: 'AccidentTypeName',
            DisplayKey: 'HRM_PortalApp_WorkHistory_AccidentType',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'TimeHappen',
            DisplayKey: 'HRM_PortalApp_WorkHistory_AccidentTime',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'Place',
            DisplayKey: 'HRM_PortalApp_WorkHistory_PlaceOfAccident',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'FirstMoney',
            DisplayKey: 'HRM_PortalApp_CashAdvance',
            DataType: 'string',
            isSalary: true
        },
        {
            TypeView: 'E_COMMON',
            Name: 'RealMoney',
            DisplayKey: 'HRM_PortalApp_RealPay',
            DataType: 'string',
            isSalary: true
        },
        {
            TypeView: 'E_COMMON',
            Name: 'CompanyPay',
            DisplayKey: 'HRM_PortalApp_CompanyPays',
            DataType: 'string',
            isSalary: true
        },
        {
            TypeView: 'E_COMMON',
            Name: 'InsPay',
            DisplayKey: 'HRM_PortalApp_BHXHPay',
            DataType: 'string',
            isSalary: true
        },
        {
            TypeView: 'E_COMMON',
            Name: 'OtherInspaid',
            DisplayKey: 'HRM_PortalApp_InsuranceVoluntarilyPays',
            DataType: 'string',
            isSalary: true
        },
        {
            TypeView: 'E_COMMON',
            Name: 'DescriptionAccident',
            DisplayKey: 'Description',
            DataType: 'string'
        },
        {
            TypeView: 'E_COMMON',
            Name: 'NoteAccident',
            DisplayKey: 'Notes',
            DataType: 'string'
        },
        {
            TypeView: 'E_FILEATTACH',
            Name: 'lstFileAttach',
            DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
            DataType: 'FileAttach'
        }
    ],
    configDefaultSalary = [
        {
            TypeView: 'E_COMMON',
            Name: 'SalGrossAmountCurrencyName',
            NameOld: 'SalGrossAmountCurrencyName_Old',
            DisplayKey: 'HRM_PortalApp_BasicSalary',
            DataType: 'string',
            isSalary: true
        },
        {
            TypeView: 'E_COMMON',
            Name: 'SalKPIAmountCurrencyName',
            NameOld: 'SalKPIAmountCurrencyName_Old',
            DisplayKey: 'HRM_PortalApp_ContractHistory_ProductivityBonus',
            DataType: 'string',
            isSalary: true
        },
        {
            TypeView: 'E_COMMON',
            Name: 'SalAmountTotalCurrencyName',
            NameOld: 'SalAmountTotalCurrencyName_Old',
            DisplayKey: 'HRM_PortalApp_ContractHistory_Salary',
            DataType: 'string',
            isSalary: true
        },
        {
            TypeView: 'E_COMMON',
            Name: 'NoteBasicSalary',
            DisplayKey: 'Note',
            DataType: 'string'
        },
        {
            TypeView: 'E_FILEATTACH',
            Name: 'lstFileAttach',
            DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
            DataType: 'FileAttach'
        }
    ];

export default class HreWorkHistorySubmitViewDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataItem: null,
            configListDetail: null,
            configListDetailConCurrentAllowance: null
        };
    }

    getDataItem = async () => {
        try {
            const _params = this.props.navigation.state.params,
                { screenName, dataId, dataItem, isLock } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail = ConfigListDetail.value[screenName]
                    ? ConfigListDetail.value[screenName]
                    : configDefault,
                _configListDetailConCurrentAllowance = ConfigListDetail.value[
                    ScreenName.HreWorkHistorySubmitViewDetailConCurrentAllowance
                ]
                    ? ConfigListDetail.value[ScreenName.HreWorkHistorySubmitViewDetailConCurrentAllowance]
                    : configDefaultConCurrentAllowance;

            // default isSalary = true, if not unlocked isSalary = true, else isSalary = false
            // filter all config but just check element have isSalary different null and undefined
            if (Array.isArray(_configListDetail)) {
                _configListDetail.forEach(element => {
                    if (element.isSalary !== null && element.isSalary !== undefined) element.isSalary = isLock;
                });
            }

            if (Array.isArray(_configListDetailConCurrentAllowance)) {
                _configListDetailConCurrentAllowance.forEach(element => {
                    if (element.isSalary !== null && element.isSalary !== undefined) element.isSalary = isLock;
                });
            }

            let id = !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem[`${screenName}ID`];
            if (id) {
                let api = null;

                //#region handle api each scren
                if (screenName === 'Hre_Reward') {
                    api = {
                        url: '[URI_CENTER]/api/Hre_Reward/New_GetProfileRewardNewPortalByID',
                        dataBody: {
                            ID: id
                        }
                    };
                } else if (screenName === 'Hre_ConCurrent') {
                    api = null;
                } else if (screenName === 'Hre_Discipline') {
                    api = {
                        url: '[URI_CENTER]/api/Hre_Discipline/New_GetDisciplineDetailPortal',
                        dataBody: {
                            ID: id
                        }
                    };
                } else if (screenName === 'Hre_Accident') {
                    api = null;
                } else if (screenName === 'Sal_BasicSalary') {
                    api = null;
                }
                //#endregion

                if (api) {
                    const response = await HttpService.Post(api.url, api.dataBody);
                    if (response && response.Status == EnumName.E_SUCCESS) {
                        let data = null;
                        let rsData = response?.Data;

                        //#region handle data return from API
                        if (screenName === 'Hre_WorkHistory') {
                            data = {
                                ...dataItem,
                                ...rsData?.ApprovedProcess[0],
                                ...rsData?.New_Hre_ProfilePersonalDetailModel[0],
                                ...rsData?.WorkHistorySalaryModel[0],
                                lstFileAttach: ManageFileSevice.setFileAttachApp(dataItem?.FileAttach)
                            };
                        } else if (screenName === 'Hre_Reward') {
                            data = {
                                ...dataItem,
                                ...rsData,
                                ...rsData?.New_Hre_RewardModel[0],
                                lstFileAttach: ManageFileSevice.setFileAttachApp(dataItem?.FileAttachReward)
                            };
                        } else if (screenName === 'Hre_ConCurrent') {
                            data = {
                                ...dataItem,
                                ...rsData,
                                ...rsData?.UnusualAllowanceData[0],
                                lstFileAttach: ManageFileSevice.setFileAttachApp(dataItem?.FileAttachConCurrent)
                            };
                        } else if (screenName === 'Hre_Discipline') {
                            data = {
                                ...dataItem,
                                ...rsData,
                                ...rsData?.DisciplineInformation[0],
                                lstFileAttach: ManageFileSevice.setFileAttachApp(dataItem?.FileAttachDiscipline)
                            };
                        } else if (screenName === 'Hre_Accident') {
                            data = {
                                ...dataItem,
                                ...rsData,
                                lstFileAttach: ManageFileSevice.setFileAttachApp(dataItem?.FileAttachAccident)
                            };
                        } else if (screenName === 'Sal_BasicSalary') {
                            data = {
                                ...dataItem,
                                ...rsData,
                                lstFileAttach: ManageFileSevice.setFileAttachApp(dataItem?.FileAttachBasicSalary)
                            };
                        }
                        //#endregion

                        this.setState({
                            configListDetail: _configListDetail,
                            dataItem: data,
                            configListDetailConCurrentAllowance: _configListDetailConCurrentAllowance
                        });
                    } else {
                        this.setState({ dataItem: 'EmptyData' });
                    }
                } else if (dataItem) {
                    //#region handle data from local
                    let data = { ...dataItem };
                    if (screenName === 'Hre_WorkHistory') {
                        data = {
                            ...dataItem,
                            lstFileAttach: ManageFileSevice.setFileAttachApp(dataItem?.FileAttach)
                        };
                    } else if (screenName === 'Hre_Reward') {
                        data = {
                            ...dataItem,
                            lstFileAttach: ManageFileSevice.setFileAttachApp(dataItem?.FileAttachReward)
                        };
                    } else if (screenName === 'Hre_ConCurrent') {
                        data = {
                            ...dataItem,
                            lstFileAttach: ManageFileSevice.setFileAttachApp(dataItem?.FileAttachConCurrent)
                        };
                    } else if (screenName === 'Hre_Discipline') {
                        data = {
                            ...dataItem,
                            lstFileAttach: ManageFileSevice.setFileAttachApp(dataItem?.FileAttachAccident)
                        };
                    } else if (screenName === 'Hre_Accident') {
                        data = {
                            ...dataItem,
                            lstFileAttach: ManageFileSevice.setFileAttachApp(dataItem?.FileAttachAccident)
                        };
                    } else if (screenName === 'Sal_BasicSalary') {
                        data = {
                            ...dataItem,
                            lstFileAttach: ManageFileSevice.setFileAttachApp(dataItem?.FileAttachBasicSalary)
                        };
                    }
                    //#endregion
                    this.setState({
                        configListDetail: _configListDetail,
                        dataItem: data,
                        configListDetailConCurrentAllowance: _configListDetailConCurrentAllowance
                    });
                } else {
                    this.setState({ dataItem: 'EmptyData' });
                }
            } else if (dataItem) {
                //#region handle data from local
                let data = { ...dataItem };
                if (screenName === 'Hre_WorkHistory') {
                    data = {
                        ...dataItem,
                        lstFileAttach: ManageFileSevice.setFileAttachApp(dataItem?.FileAttach)
                    };
                } else if (screenName === 'Hre_Reward') {
                    data = {
                        ...dataItem,
                        lstFileAttach: ManageFileSevice.setFileAttachApp(dataItem?.FileAttachReward)
                    };
                } else if (screenName === 'Hre_ConCurrent') {
                    data = {
                        ...dataItem,
                        lstFileAttach: ManageFileSevice.setFileAttachApp(dataItem?.FileAttachConCurrent)
                    };
                } else if (screenName === 'Hre_Discipline') {
                    data = {
                        ...dataItem,
                        lstFileAttach: ManageFileSevice.setFileAttachApp(dataItem?.FileAttachAccident)
                    };
                } else if (screenName === 'Hre_Accident') {
                    data = {
                        ...dataItem,
                        lstFileAttach: ManageFileSevice.setFileAttachApp(dataItem?.FileAttachAccident)
                    };
                } else if (screenName === 'Sal_BasicSalary') {
                    data = {
                        ...dataItem,
                        lstFileAttach: ManageFileSevice.setFileAttachApp(dataItem?.FileAttachBasicSalary)
                    };
                }
                //#endregion
                this.setState({
                    configListDetail: _configListDetail,
                    dataItem: data,
                    configListDetailConCurrentAllowance: _configListDetailConCurrentAllowance
                });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    componentDidMount() {
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, configListDetailConCurrentAllowance } = this.state,
            { containerItemDetail, contentScroll } = styleScreenDetail;
        const _params = this.props.navigation.state.params,
            { screenName } = typeof _params == 'object' ? _params : JSON.parse(_params);
        let contentViewDetail = <VnrLoading size={'large'} />;
        let rsFind = dataFilter.find(item => item.enum === dataItem?.TableData);

        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={contentScroll} showsVerticalScrollIndicator={false}>
                        <View
                            style={styles.styViewDetail}
                        >
                            {rsFind?.icon && <Image source={rsFind.icon} />}
                            <Text style={[styleSheets.lable, CustomStyleSheet.marginLeft(6)]}>
                                {translate(rsFind?.lable)}{' '}
                                {dataItem?.dateEffect && `(${moment(dataItem?.dateEffect).format('DD/MM/YYYY')})`}{' '}
                            </Text>
                        </View>
                        <View style={containerItemDetail}>
                            {configListDetail.map(e => {
                                if (e.TypeView != 'E_COMMON_PROFILE')
                                    return <VnrFormatStringType data={dataItem} col={e} allConfig={configListDetail} />;
                            })}
                        </View>
                        {screenName === 'Hre_ConCurrent' &&
                            (Array.isArray(dataItem?.UnusualAllowanceData) &&
                                Array.isArray(configListDetailConCurrentAllowance) &&
                                dataItem?.UnusualAllowanceData.map((item, index) => {
                                    return (
                                        <View key={index} style={contentScroll}>
                                            <View
                                                style={{
                                                    backgroundColor: Colors.gray_3,
                                                    paddingHorizontal: 12,
                                                    paddingVertical: 6,
                                                    flexDirection: 'row',
                                                    alignItems: 'center'
                                                }}
                                            >
                                                <Text style={[styleSheets.lable, CustomStyleSheet.marginLeft(6)]}>
                                                    {`${translate(['HRM_PortalApp_UnusualAllowanceData'])}`} {index + 1}
                                                </Text>
                                            </View>
                                            <View style={containerItemDetail}>
                                                {configListDetailConCurrentAllowance.map(e => {
                                                    if (e.TypeView != 'E_COMMON_PROFILE')
                                                        return (
                                                            <VnrFormatStringType
                                                                data={item}
                                                                col={e}
                                                                allConfig={configListDetail}
                                                            />
                                                        );
                                                })}
                                            </View>
                                        </View>
                                    );
                                }))}
                    </ScrollView>
                </View>
            );
        } else if (dataItem == 'EmptyData') {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaViewDetail>
        );
    }
}

const styles = StyleSheet.create({
    styViewDetail: { backgroundColor: Colors.gray_3,
        paddingHorizontal: 12,
        paddingVertical: 6,
        flexDirection: 'row',
        alignItems: 'center'
    }
})