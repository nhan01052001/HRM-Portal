import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { generateRowActionAndSelected, AttApprovePregnancyBusinessFunction } from './AttApprovePregnancyBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';

const configDefault = [
    {
        Name: 'CodeEmp',
        DisplayKey: 'HRM_HR_Profile_CodeEmp',
        DataType: 'string'
    },
    {
        Name: 'ProfileName',
        DisplayKey: 'ProfileName',
        DataType: 'string'
    },
    {
        Name: 'OrgStructureName',
        DisplayKey: 'OrgStructureName',
        DataType: 'string'
    },
    {
        Name: 'PositionName',
        DisplayKey: 'HRM_Attendance_PositionName',
        DataType: 'string'
    },
    {
        Name: 'JobTitleName',
        DisplayKey: 'HRM_Attendance_JobTitleName',
        DataType: 'string'
    },
    {
        Name: 'TypeView',
        DisplayKey: 'HRM_Attendance_Pregnancy_Type',
        DataType: 'string'
    },
    {
        Name: 'DateStart',
        DisplayKey: 'HRM_Attendance_Pregnancy_DateStart',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'DateEnd',
        DisplayKey: 'HRM_Attendance_Pregnancy_DateEnd',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        Name: 'TypePregnancyEarlyShift',
        DisplayKey: 'HRM_Attendance_Pregnancy_TypePregnancyEarlyShift',
        DataType: 'Bool'
    },
    {
        Name: 'TypePregnancyEarlyView',
        DisplayKey: 'HRM_Attendance_Pregnancy_TypePregnancyEarlyView',
        DataType: 'DateTime',
        DataFormat: 'hh:mm'
    },
    {
        Name: 'Comment',
        DisplayKey: 'HRM_AttendanceProfileTimeSheet_Note',
        DataType: 'string'
    },
    {
        Name: 'StatusView',
        DisplayKey: 'HRM_Attendance_Leaveday_Status',
        DataType: 'string'
    },
    {
        Name: 'FirstApproverName',
        DisplayKey: 'HRM_Attendance_FirstApproverName',
        DataType: 'string'
    },
    {
        Name: 'MidApproverName',
        DisplayKey: 'HRM_Attendance_TAMScanLog_UserApproveID3',
        DataType: 'string'
    },
    {
        Name: 'NextApproverName',
        DisplayKey: 'HRM_Attendance_TAMScanLog_UserApproveID4',
        DataType: 'string'
    },
    {
        Name: 'LastApproverName',
        DisplayKey: 'HRM_Attendance_TAMScanLog_UserApproveID2',
        DataType: 'string'
    },
    {
        Name: 'DeclineReason',
        DisplayKey: 'HRM_Att_Leaveday_LeavedayList_DeclineReason',
        DataType: 'string'
    }
];

export default class AttApprovePregnancyViewDetail extends Component {
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
                const response = await HttpService.Post('[URI_HR]/Att_GetData/GetPregnancyById', {
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
        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER', true);
    };

    componentDidMount() {
        AttApprovePregnancyBusinessFunction.setThisForBusiness(this);
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
