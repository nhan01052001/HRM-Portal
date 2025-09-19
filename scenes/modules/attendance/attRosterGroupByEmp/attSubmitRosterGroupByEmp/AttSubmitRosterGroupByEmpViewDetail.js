import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView, Size, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import {
    generateRowActionAndSelected,
    AttSubmitRosterGroupByEmpBusinessFunction
} from './AttSubmitRosterGroupByEmpBusiness';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import DrawerServices from '../../../../../utils/DrawerServices';
import ListButtonMenuRight from '../../../../../components/ListButtonMenuRight/ListButtonMenuRight';

// eslint-disable-next-line no-unused-vars
const configDefault = [
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
        DisplayKey: 'HRM_Eva_Performance_OrgStructureName',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'SalaryClassName',
        DisplayKey: 'HRM_Payroll_BasicSalary_SalaryClassName',
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
        Name: 'TypeView',
        DisplayKey: 'HRM_Attendance_RosterGroupByEmp_Type',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateStart',
        DisplayKey: 'HRM_Attendance_RosterGroupByEmp_DateStart',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'DateEnd',
        DisplayKey: 'HRM_Attendance_RosterGroupByEmp_DateEnd',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY'
    },
    {
        TypeView: 'E_REASON',
        Name: 'Comment',
        NameCancel: 'CommentCancel',
        NameReject: 'DeclineReason',
        DisplayKey: 'HRM_Attendance_Overtime_ReasonOT',
        DataType: 'string'
    },
    {
        TypeView: 'E_SHOW_MORE_INFO',
        DisplayKey: 'HRM_Attendance_RosterGroupByEmp_DateChange',
        ConfigListDetail: [
            {
                Name: 'MonShiftName',
                DisplayKey: 'HRM_Attendance_RosterGroupByEmp_MonShiftID',
                DataType: 'string'
            },
            {
                Name: 'TueShiftName',
                DisplayKey: 'HRM_Attendance_RosterGroupByEmp_TueShiftID',
                DataType: 'string'
            },
            {
                Name: 'WedShiftName',
                DisplayKey: 'HRM_Attendance_RosterGroupByEmp_WedShiftID',
                DataType: 'string'
            },
            {
                Name: 'ThuShiftName',
                DisplayKey: 'HRM_Attendance_RosterGroupByEmp_ThuShiftID',
                DataType: 'string'
            },
            {
                Name: 'FriShiftName',
                DisplayKey: 'HRM_Attendance_RosterGroupByEmp_FriShiftID',
                DataType: 'string'
            },
            {
                Name: 'SatShiftName',
                DisplayKey: 'HRM_Attendance_RosterGroupByEmp_SatShiftID',
                DataType: 'string'
            },
            {
                Name: 'SunShiftName',
                DisplayKey: 'HRM_Attendance_RosterGroupByEmp_SunShiftID',
                DataType: 'string'
            },
            {
                Name: 'MonShift2Name',
                DisplayKey: 'MonShift2Name',
                DataType: 'string'
            },
            {
                Name: 'TueShift2Name',
                DisplayKey: 'TueShift2Name',
                DataType: 'string'
            },
            {
                Name: 'WedShift2Name',
                DisplayKey: 'WedShift2Name',
                DataType: 'string'
            },
            {
                Name: 'ThuShift2Name',
                DisplayKey: 'ThuShift2Name',
                DataType: 'string'
            },
            {
                Name: 'FriShift2Name',
                DisplayKey: 'FriShift2Name',
                DataType: 'string'
            },
            {
                Name: 'SatShift2Name',
                DisplayKey: 'SatShift2Name',
                DataType: 'string'
            },
            {
                Name: 'SunShift2Name',
                DisplayKey: 'SunShift2Name',
                DataType: 'string'
            }
        ]
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Detail_Approve_Info_Common',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'UserApproveIDName',
        DisplayKey: 'HRM_Attendance_RosterGroupByEmp_UserApproveID',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'UserApprove3IDName',
        DisplayKey: 'HRM_Attendance_RosterGroupByEmp_UserApproveID3',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'UserApprove4IDName',
        DisplayKey: 'HRM_Attendance_RosterGroupByEmp_UserApproveID4',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'UserApprove2IDName',
        DisplayKey: 'HRM_Attendance_RosterGroupByEmp_UserApproveID2',
        DataType: 'string'
    },
    {
        TypeView: 'E_STATUS',
        Name: 'StatusView',
        DisplayKey: 'HRM_Attendance_Overtime_OvertimeList_Status',
        DataType: 'string'
    }
];

export default class AttSubmitRosterGroupByEmpViewDetail extends Component {
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
                _configListDetail = ConfigListDetail.value[screenName];

            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
                const response = await HttpService.Post('[URI_HR]/Att_GetData/GetRosterGroupByEmpById', {
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

    reload = (E_KEEP_FILTER, actionIsDelete) => {
        const { reloadScreenList } = this.props.navigation.state.params;

        !Vnr_Function.CheckIsNullOrEmpty(reloadScreenList) && reloadScreenList('E_KEEP_FILTER');

        //nếu action = Delete => back về danh sách
        if (actionIsDelete) {
            DrawerServices.navigate('AttSubmitRosterGroupByEmp');
        } else {
            this.getDataItem(true);
        }
    };

    componentDidMount() {
        AttSubmitRosterGroupByEmpBusinessFunction.setThisForBusiness(this);
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
                        <View
                            style={[
                                containerItemDetail,
                                dataItem.isGroup && {
                                    ...CustomStyleSheet.paddingHorizontal(0),
                                    ...CustomStyleSheet.paddingTop(Size.defineSpace)
                                }
                            ]}
                        >
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
