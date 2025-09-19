import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import {
    generateRowActionAndSelected,
    AttApprovedRegisterVehicleBusinessFunction
} from './AttApprovedRegisterVehicleBusiness';
import HttpService from '../../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';
import EmptyData from '../../../../../components/EmptyData/EmptyData';

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
        TypeView: 'E_COMMON',
        Name: 'OrgStructureName',
        DisplayKey: 'HRM_OrgStructureName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'JobTitleName',
        DisplayKey: 'HRM_Evaluation_Evaluator_JobTitleName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PositionName',
        DisplayKey: 'HRM_HR_Profile_PositionName',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Detail_Process_Info_Common',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DurationTypeView',
        DisplayKey: 'HRM_Attendance_RegisterVehicle_DurationType',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PurposeRegisterName',
        DisplayKey: 'HRM_Attendance_RegisterVehicle_PurposeRegister',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DepartureDate',
        DisplayKey: 'DepartureDate',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'ReturnDate',
        DisplayKey: 'ReturnDatev2',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DepartureTime',
        NameSecond: 'ReturnTime',
        DisplayKey: 'HRM_Sys_TimeRange',
        DataType: 'DateToFrom',
        DataFormat: 'HH:mm'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PlaceFrom',
        DisplayKey: 'HRM_Attendance_RegisterVehicle_PlaceFrom',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'PlaceTo',
        DisplayKey: 'HRM_Attendance_RegisterVehicle_PlaceTo',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'WorkPlaceName',
        DisplayKey: 'HRM_Attendance_RegisterVehicle_SendTo',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'Note',
        DisplayKey: 'HRM_Attendance_RegisterVehicle_Note',
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
        Name: 'SendMailStatusView',
        DisplayKey: 'SendMailStatus',
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

export default class AttApprovedRegisterVehicleViewDetail extends Component {
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
                    ConfigListDetail.value[screenName] != null ? ConfigListDetail.value[screenName] : configDefault;

            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
                const response = await HttpService.Post('[URI_HR]/Att_GetData/GetRegisterVehicleById', {
                    id: !Vnr_Function.CheckIsNullOrEmpty(dataId) ? dataId : dataItem.ID,
                    screenName: screenName,
                    uri: dataVnrStorage.apiConfig.uriHr
                });
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
        this.getDataItem(true);
    };

    componentDidMount() {
        AttApprovedRegisterVehicleBusinessFunction.setThisForBusiness(this);
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
