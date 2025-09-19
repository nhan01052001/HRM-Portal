import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import {
    generateRowActionAndSelected,
    HreApproveWorkHistorySalaryBusinessFunction
} from './HreApproveWorkHistorySalaryBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';

const configDefault = [
    {
        TypeView: 'E_LIMIT',
        Name: 'WarningViolation',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_HR_Profile_Info',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CodeEmp',
        DisplayKey: 'HRM_HR_Profile_CodeEmp',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ProfileName',
        DisplayKey: 'HRM_HR_Profile_ProfileName',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_HR_Profile_Rec_WorkHistory',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DecisionNo',
        DisplayKey: 'DecisionNo',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DecisionDate',
        DisplayKey: 'HRM_Hre_WorkHistorySalaryForViewProfileDetail_DecisionDate',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateEffective',
        DisplayKey: 'HRM_Category_Cat_HRPlanningPeriod_DateEffective',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TypeOfTransferName',
        DisplayKey: 'TypeOfTransferName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'OrgStructureName',
        DisplayKey: 'E_DEPARTMENT',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'JobTitleName',
        DisplayKey: 'JobTitleName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PositionName',
        DisplayKey: 'PositionID',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CompanyName',
        DisplayKey: 'Company',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'AbilityTitleVNI',
        DisplayKey: 'AbilityTileID',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PayrollGroupName',
        DisplayKey: 'HRM_HR_WorkHistory_PayrollGroupID',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'WorkPlaceName',
        DisplayKey: 'HRM_HR_WorkHistory_WorkLocation',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'RegionName',
        DisplayKey: 'HRM_HR_Profile_RegionID',
        DataType: 'string'
    },

    {
        TypeView: 'E_COMMON',
        Name: 'SupervisorName',
        DisplayKey: 'HRM_HR_WorkHistory_SupervisiorID',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'MidSupervisorName',
        DisplayKey: 'HRM_HR_Profile_MidSupervisorID',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'NextSupervisorName',
        DisplayKey: 'Nextsupervisor',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'HighSupervisorName',
        DisplayKey: 'HRM_HR_WorkHistory_HighSupervisiorID',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_ApprovedInfo',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SuggetedUserName',
        DisplayKey: 'HRM_HR_Profile_SuggetedUserID',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateSugget',
        DisplayKey: 'DateSugget',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_USERAPPROVE1',
        Name: 'UserApproveName',
        DisplayKey: 'HRM_Attendance_Leaveday_UserApproveID',
        DataType: 'string'
    },
    {
        TypeView: 'E_USERAPPROVE2',
        Name: 'UserApproveID2Name',
        DisplayKey: 'HRM_Attendance_Leaveday_UserApproveID3',
        DataType: 'string'
    },
    {
        TypeView: 'E_USERAPPROVE3',
        Name: 'UserApproveID3Name',
        DisplayKey: 'HRM_Attendance_Leaveday_UserApproveID4',
        DataType: 'string'
    },
    {
        TypeView: 'E_USERAPPROVE4',
        Name: 'UserApproveID4Name',
        DisplayKey: 'HRM_Attendance_Leaveday_UserApproveID2',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_BasicSalaryInfor',
        DataType: 'string'
    },
    {
        Name: 'IsCreateBasicSalary',
        DisplayKey: 'CreateBasicSalary',
        DataType: 'bool'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateEffective',
        DisplayKey: 'DateEffective',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'GrossAmountSalary',
        DisplayKey: 'lblform_Hre_WorkHistorySalary_GrossAmountSalary',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'InsuranceAmountSalary',
        DisplayKey: 'E_SalaryInsurance',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'AmountTotalSalary',
        DisplayKey: 'NextTotalSalary',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'NoteSalary',
        DisplayKey: 'Note',
        DataType: 'string'
    },
    {
        TypeView: 'E_SHOW_MORE_INFO',
        DisplayKey: 'HRM_Payroll_Category_UnusualEDType_List',
        ConfigListDetail: [
            {
                Name: 'AllowanceTotal1',
                DisplayKey: 'HRM_HR_ProfileTemp_AllowanceID1',
                DataType: 'string'
            },
            {
                Name: 'AllowanceTotal2',
                DisplayKey: 'HRM_HR_ProfileTemp_AllowanceID2',
                DataType: 'string'
            },
            {
                Name: 'AllowanceTotal3',
                DisplayKey: 'HRM_HR_ProfileTemp_AllowanceID3',
                DataType: 'string'
            },
            {
                Name: 'AllowanceTotal4',
                DisplayKey: 'HRM_HR_ProfileTemp_AllowanceID4',
                DataType: 'string'
            },
            {
                Name: 'AllowanceTotal5',
                DisplayKey: 'HRM_HR_ProfileTemp_AllowanceID5',
                DataType: 'string'
            },
            {
                Name: 'AllowanceTotal6',
                DisplayKey: 'HRM_HR_ProfileTemp_AllowanceID6',
                DataType: 'string'
            },
            {
                Name: 'AllowanceTotal7',
                DisplayKey: 'HRM_HR_ProfileTemp_AllowanceID7',
                DataType: 'string'
            },
            {
                Name: 'AllowanceTotal8',
                DisplayKey: 'HRM_HR_ProfileTemp_AllowanceID8',
                DataType: 'string'
            },
            {
                Name: 'AllowanceTotal9',
                DisplayKey: 'HRM_HR_ProfileTemp_AllowanceID9',
                DataType: 'string'
            },
            {
                Name: 'AllowanceTotal10',
                DisplayKey: 'HRM_HR_ProfileTemp_AllowanceID10',
                DataType: 'string'
            },
            {
                Name: 'AllowanceTotal11',
                DisplayKey: 'HRM_HR_ProfileTemp_AllowanceID11',
                DataType: 'string'
            },
            {
                Name: 'AllowanceTotal12',
                DisplayKey: 'HRM_HR_ProfileTemp_AllowanceID12',
                DataType: 'string'
            },
            {
                Name: 'AllowanceTotal13',
                DisplayKey: 'HRM_HR_ProfileTemp_AllowanceID13',
                DataType: 'string'
            },
            {
                Name: 'AllowanceTotal14',
                DisplayKey: 'HRM_HR_ProfileTemp_AllowanceID14',
                DataType: 'string'
            },
            {
                Name: 'AllowanceTotal15',
                DisplayKey: 'HRM_HR_ProfileTemp_AllowanceID15',
                DataType: 'string'
            }
        ]
    },
    {
        TypeView: 'E_STATUS',
        Name: 'StatusView',
        DisplayKey: 'HRM_Attendance_Overtime_OvertimeList_Status',
        DataType: 'string'
    }
];

export default class HreApproveWorkHistorySalaryViewDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataItem: null,
            configListDetail: null,
            dataRowActionAndSelected: generateRowActionAndSelected(),
            listActions: this.resultListActionHeader()
        };
    }

    resultListActionHeader = () => {
        const _params = this.props.navigation.state.params;
        if (_params && _params.listActions && Array.isArray(_params.listActions)) {
            return _params.listActions;
        }
        return [];
    };

    rowActionsHeaderRight = dataItem => {
        let _listActions = [];
        const { rowActions } = this.state.dataRowActionAndSelected;

        if (
            !Vnr_Function.CheckIsNullOrEmpty(rowActions) &&
            !Vnr_Function.CheckIsNullOrEmpty(dataItem.BusinessAllowAction)
        ) {
            _listActions = rowActions.filter(item => {
                return dataItem.BusinessAllowAction.indexOf(item.type) >= 0;
            });
        }
        return _listActions;
    };

    getDataItem = async (isReload = false) => {
        try {
            const _params = this.props.navigation.state.params,
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail =
                    ConfigListDetail.value[screenName] !== null ? ConfigListDetail.value[screenName] : configDefault;

            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
                const response = await HttpService.Post('[URI_HR]/Por_GetData/GetWorkHistoryById', {
                    id: !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID,
                    screenName: screenName,
                    uri: dataVnrStorage.apiConfig.uriHr
                });
                for (let i = 0; i <= 14; i++) {
                    if (response[`UsualAllowanceName${i + 1}Salary`] !== null) {
                        response[`AllowanceTotal${i + 1}`] =
                            response[`UsualAllowanceName${i + 1}Salary`].toString() +
                            ': ' +
                            (response[`AllowanceAmount${i + 1}Salary`] !== null
                                ? Vnr_Function.formatNumber(response[`AllowanceAmount${i + 1}Salary`]).toString() + ' '
                                : ' ') +
                            (response[`CurrencyName${i + 1}Salary`] !== null
                                ? response[`CurrencyName${i + 1}Salary`].toString()
                                : '');
                    }
                }

                const _listActions = await this.rowActionsHeaderRight(response);
                if (!Vnr_Function.CheckIsNullOrEmpty(response)) {
                    this.setState({
                        configListDetail: _configListDetail,
                        dataItem: response,
                        listActions: _listActions
                    });
                } else {
                    this.setState({ dataItem: 'EmptyData' });
                }
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                for (let i = 0; i <= 14; i++) {
                    if (dataItem[`UsualAllowanceName${i + 1}Salary`] !== null) {
                        dataItem[`AllowanceTotal${i + 1}`] =
                            dataItem[`UsualAllowanceName${i + 1}Salary`].toString() +
                            ': ' +
                            (dataItem[`AllowanceAmount${i + 1}Salary`] !== null
                                ? Vnr_Function.formatNumber(dataItem[`AllowanceAmount${i + 1}Salary`]).toString() + ' '
                                : ' ') +
                            (dataItem[`CurrencyName${i + 1}Salary`] !== null
                                ? dataItem[`CurrencyName${i + 1}Salary`].toString()
                                : '');
                    }
                }
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
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER', true);
    };

    componentDidMount() {
        HreApproveWorkHistorySalaryBusinessFunction.setThisForBusiness(this);
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail, listActions } = this.state,
            { containerItemDetail, bottomActions } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={CustomStyleSheet.flexGrow(1)}>
                        <View style={containerItemDetail}>
                            {configListDetail.map(e => {
                                return Vnr_Function.formatStringTypeV2(dataItem, e);
                            })}
                        </View>
                    </ScrollView>
                    {Array.isArray(listActions) && listActions.length > 0 && (
                        <View style={bottomActions}>
                            <ListButtonMenuRight listActions={listActions} dataItem={dataItem} />
                        </View>
                    )}
                </View>
            );
        } else if (dataItem == 'EmptyData') {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaView>
        );
    }
}
