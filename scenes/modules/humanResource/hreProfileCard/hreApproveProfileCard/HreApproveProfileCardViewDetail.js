import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { generateRowActionAndSelected, HreApproveProfileCardBusinessFunction } from './HreApproveProfileCardBusiness';
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
        DisplayKey: 'HRM_System_Resource_HR_ProfileInformationDetail',
        IsBold: true,
        DataType: 'string'
    },
    {
        Name: 'CodeEmp',
        DisplayKey: 'HRM_Hre_SignatureRegister_CodeEmp',
        DataType: 'string'
    },
    {
        Name: 'ProfileName',
        DisplayKey: 'ProfileName',
        DataType: 'string'
    },
    {
        Name: 'OrgStructureName',
        DisplayKey: 'HRM_Eva_Performance_OrgStructureName',
        DataType: 'string'
    },
    {
        Name: 'SalaryClassName',
        DisplayKey: 'HRM_Payroll_BasicSalary_SalaryClassName',
        DataType: 'string'
    },
    {
        Name: 'PositionName',
        DisplayKey: 'HRM_HR_Profile_PositionName',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_HR_StopWorking_Info_Group_Resgistration',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'CardTypeName',
        DisplayKey: 'Hre_ProfileCard_CardTypeID',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ReasonCardIssue',
        DisplayKey: 'HRM_Hre_ProfileCard_ReasonCardIssue',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ActivationRequired',
        DisplayKey: 'HRM_HR_Profile_ActivationRequired',
        DataType: 'string'
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lstFileAttach',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
        DataType: 'FileAttach'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Notes',
        DisplayKey: 'HRM_Category_Cat_HRPlanningPeriod_Note',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Detail_Approve_Info_Common',
        DataType: 'string'
    },
    {
        TypeView: 'E_USERAPPROVE1',
        Name: 'UserApproveName',
        DisplayKey: 'HRM_Attendance_Leaveday_UserApproveID',
        DataType: 'string'
    },
    {
        TypeView: 'E_USERAPPROVE2',
        Name: 'UserApproveName2',
        DisplayKey: 'HRM_Attendance_Leaveday_UserApproveID3',
        DataType: 'string'
    },
    {
        TypeView: 'E_USERAPPROVE3',
        Name: 'UserApproveName3',
        DisplayKey: 'HRM_Attendance_Leaveday_UserApproveID4',
        DataType: 'string'
    },
    {
        TypeView: 'E_USERAPPROVE4',
        Name: 'UserApproveName4',
        DisplayKey: 'HRM_Attendance_Leaveday_UserApproveID2',
        DataType: 'string'
    },
    {
        TypeView: 'E_STATUS',
        Name: 'StatusView',
        DisplayKey: 'HRM_Attendance_Overtime_OvertimeList_Status',
        DataType: 'string'
    }
];

export default class HreApproveProfileCardViewDetail extends Component {
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
                _configListDetail = ConfigListDetail.value[screenName]
                    ? ConfigListDetail.value[screenName]
                    : configDefault;

            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
                const response = await HttpService.Post('[URI_HR]/Por_GetData/GetRequirementRecuitmentById', {
                    id: !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID,
                    screenName: screenName,
                    uri: dataVnrStorage.apiConfig.uriHr
                });
                const _listActions = await this.rowActionsHeaderRight(response);
                if (!Vnr_Function.CheckIsNullOrEmpty(response)) {
                    response.DateReject = response?.DateRejection;
                    this.setState({
                        configListDetail: _configListDetail,
                        dataItem: response,
                        listActions: _listActions
                    });
                } else {
                    this.setState({ dataItem: 'EmptyData' });
                }
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                dataItem.DateReject = dataItem?.DateRejection;
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
        HreApproveProfileCardBusinessFunction.setThisForBusiness(this);
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
