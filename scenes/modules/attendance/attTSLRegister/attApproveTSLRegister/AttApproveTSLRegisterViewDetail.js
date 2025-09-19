import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { generateRowActionAndSelected, AttApproveTSLRegisterBusinessFunction } from './AttApproveTSLRegisterBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';

// need fix for task 0158060
const configDefault = [
    {
        Name: 'CodeEmp',
        DisplayKey: 'HRM_HR_Profile_CodeEmp',
        DataType: 'string',
        ClassStyle: ''
    },
    {
        Name: 'ProfileName',
        DisplayKey: 'HRM_HR_Profile_ProfileName',
        DataType: 'string',
        ClassStyle: ''
    },
    {
        Name: 'CardCode',
        DisplayKey: 'HRM_Attendance_TAMScanLog_CardCode',
        DataType: 'string',
        DataFormat: '',
        ClassStyle: ''
    },
    {
        Name: 'OrgStructureName',
        DisplayKey: 'HRM_Eva_Performance_OrgStructureName',
        DataType: 'string',
        ClassStyle: ''
    },
    {
        Name: 'TypeView',
        DisplayKey: 'HRM_Attendance_TAMScanLog_Type',
        DataType: 'string',
        ClassStyle: ''
    },
    {
        Name: 'TimeLog',
        DisplayKey: 'HRM_Attendance_TAMScanLog_DateFrom',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY HH:mm',
        ClassStyle: ''
    },
    {
        Name: 'StatusView',
        DisplayKey: 'HRM_Attendance_TAMScanLog_Status',
        DataType: 'string',
        ClassStyle: ''
    },
    {
        Name: 'ShopNamebyGPS',
        DisplayKey: 'HRM_PortalAPP_ShopNamebyGPS',
        DataType: 'string',
        ClassStyle: ''
    },
    {
        Name: 'DistanceGPS',
        DisplayKey: 'HRM_Attendance_TAMScanLog_DistanceGPS',
        DataType: 'Double',
        DataFormat: '#.###.##m'
    },
    {
        Name: 'TAMScanReasonMissName',
        DisplayKey: 'HRM_Attendance_WorkDay_MissInOutReason',
        DataType: 'string',
        ClassStyle: ''
    },
    {
        Name: 'Comment',
        DisplayKey: 'HRM_Attendance_TAMScanLog_Comment',
        DataType: 'string',
        ClassStyle: ''
    },
    {
        Name: 'RejectReason',
        DisplayKey: 'HRM_Attendance_WorkDay_RejectReason',
        DataType: 'string',
        ClassStyle: ''
    },
    {
        TypeView: 'E_FILEATTACH',
        Name: 'lstFileAttach',
        DisplayKey: 'HRM_Payroll_Sal_TaxInformationRegister_FileAttach',
        DataType: 'FileAttach'
    },
    {
        Name: 'UserApproveName',
        DisplayKey: 'HRM_Attendance_TAMScanLog_UserApproveID',
        DataType: 'string',
        ClassStyle: ''
    },
    {
        Name: 'UserApproveName3',
        DisplayKey: 'HRM_Attendance_TAMScanLog_UserApproveID3',
        DataType: 'string',
        ClassStyle: ''
    },
    {
        Name: 'UserApproveName4',
        DisplayKey: 'HRM_Attendance_TAMScanLog_UserApproveID4',
        DataType: 'string',
        ClassStyle: ''
    },
    {
        Name: 'UserApproveName2',
        DisplayKey: 'HRM_Attendance_TAMScanLog_UserApproveID2',
        DataType: 'string',
        ClassStyle: ''
    },
    {
        Name: 'MachineNo',
        DisplayKey: 'HRM_Attendance_TAMScanLog_MachineNo',
        DataType: 'string',
        ClassStyle: ''
    }
];

export default class AttApproveTSLRegisterViewDetail extends Component {
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
                    ConfigListDetail.value[screenName] !== null ? ConfigListDetail.value[screenName] : configDefault; // need fix for task 0158060

            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
                const response = await HttpService.Post('[URI_HR]/Att_GetData/GetTamScanLogRegisterById', {
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
        AttApproveTSLRegisterBusinessFunction.setThisForBusiness(this, true);
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
