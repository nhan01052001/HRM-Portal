import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    CustomStyleSheet
} from '../../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../../components/EmptyData/EmptyData';
import { View, ScrollView } from 'react-native';

const configDefault = [
    {
        Name: 'IsPublish',
        DisplayKey: 'HRM_Sal_PITFinalization_IsPublish',
        DataType: 'bool'
    },
    {
        Name: 'DatePublish',
        DisplayKey: 'HRM_Attendance_ReportMonthlyTimeSheet_DatePublish',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY',
        ClassStyle: ''
    },
    {
        Name: 'UserPublish',
        DisplayKey: 'UserPublic',
        DataType: 'string'
    },
    {
        Name: 'DateConfirm',
        DisplayKey: 'HRM_Attendance_Overtime_WorkDateConfirm',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY',
        ClassStyle: ''
    },
    {
        Name: 'UserConfirm',
        DisplayKey: 'ConfirmationPersonID',
        DataType: 'string'
    },
    {
        Name: 'DateReject',
        DisplayKey: 'DateRejection',
        DataType: 'DateTime',
        DataFormat: 'DD/MM/YYYY',
        ClassStyle: ''
    },
    {
        Name: 'UserReject',
        DisplayKey: 'HRM_Sal_PITFinalizationDelegatee_UserReject',
        DataType: 'string'
    },
    {
        Name: 'RejectReason',
        DisplayKey: 'HRM_Attendance_AttendanceTable_RejectReason',
        DataType: 'string'
    },
    {
        Name: 'ConfirmLeavedayTypeName',
        DisplayKey: 'HRM_Attendance_ConfirmHistoryAttendanceTable_ConfirmLeavedayTypeName',
        DataType: 'string'
    },
    {
        Name: 'DateConfirmLeaveday',
        DisplayKey: 'HRM_Attendance_ConfirmHistoryAttendanceTable_DateConfirmLeaveday',
        DataType: 'string'
    },
    {
        Name: 'UserConfirmLeaveday',
        DisplayKey: 'HRM_Attendance_ConfirmHistoryAttendanceTable_UserConfirmLeaveday',
        DataType: 'string'
    },
    {
        Name: 'RejectLeavedayTypeName',
        DisplayKey: 'HRM_Attendance_ConfirmHistoryAttendanceTable_RejectLeavedayTypeName',
        DataType: 'string'
    },
    {
        Name: 'DateRejectLeaveday',
        DisplayKey: 'HRM_Attendance_ConfirmHistoryAttendanceTable_DateRejectLeaveday',
        DataType: 'string'
    },
    {
        Name: 'UserRejectLeaveday',
        DisplayKey: 'HRM_Attendance_ConfirmHistoryAttendanceTable_UserRejectLeaveday',
        DataType: 'string'
    },
    {
        Name: 'ListRejectReason',
        DisplayKey: 'HRM_Attendance_ConfirmHistoryAttendanceTable_ListRejectReason',
        DataType: 'string'
    },
    {
        Name: 'CutOffDurationName',
        DisplayKey: 'lblform_Att_ReportWorkDayDetail_CutOffDurationID',
        DataType: 'string'
    },
    {
        Name: 'StdWorkDayCount',
        DisplayKey: 'HRM_Attendance_AttendanceTable_StdWorkDayCount',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        Name: 'RealWorkDayCount',
        DisplayKey: 'HRM_Attendance_AttendanceTable_RealWorkDayCount',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        Name: 'PaidWorkDayCount',
        DisplayKey: 'HRM_Attendance_AttendanceTable_PaidWorkDayCount',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        Name: 'NightShiftHours',
        DisplayKey: 'HRM_Attendance_AttendanceTable_NightShiftHours',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        Name: 'AnlDayTaken',
        DisplayKey: 'HRM_Attendance_AttendanceTable_AnlDayTaken',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        Name: 'AnlDayAvailable',
        DisplayKey: 'HRM_Attendance_AttendanceTable_AnlDayAvailable',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        Name: 'Overtime1TypeName',
        DisplayKey: 'OvertimeTypeName1',
        DataType: 'string'
    },
    {
        Name: 'Overtime1Hours',
        DisplayKey: 'HRM_Attendance_ConfirmHistoryAttendaceTable_Overtime1Hours',
        DataType: 'string'
    },
    {
        Name: 'Overtime2TypeName',
        DisplayKey: 'OvertimeTypeName2',
        DataType: 'string'
    },
    {
        Name: 'Overtime2Hours',
        DisplayKey: 'HRM_Attendance_ConfirmHistoryAttendaceTable_Overtime2Hours',
        DataType: 'string'
    },
    {
        Name: 'Overtime3TypeName',
        DisplayKey: 'OvertimeTypeName3',
        DataType: 'string'
    },
    {
        Name: 'Overtime3Hours',
        DisplayKey: 'HRM_Attendance_ConfirmHistoryAttendaceTable_Overtime3Hours',
        DataType: 'string'
    },
    {
        Name: 'Overtime4TypeName',
        DisplayKey: 'OvertimeTypeName4',
        DataType: 'string'
    },
    {
        Name: 'Overtime4Hours',
        DisplayKey: 'HRM_Attendance_ConfirmHistoryAttendaceTable_Overtime4Hours',
        DataType: 'string'
    },
    {
        Name: 'Overtime5TypeName',
        DisplayKey: 'OvertimeTypeName5',
        DataType: 'string'
    },
    {
        Name: 'Overtime5Hours',
        DisplayKey: 'HRM_Attendance_ConfirmHistoryAttendaceTable_Overtime5Hours',
        DataType: 'string'
    },
    {
        Name: 'Overtime6TypeName',
        DisplayKey: 'Overtime6TypeID',
        DataType: 'string'
    },
    {
        Name: 'Overtime6Hours',
        DisplayKey: 'HRM_Attendance_ConfirmHistoryAttendaceTable_Overtime6Hours',
        DataType: 'string'
    },
    {
        Name: 'LateEarlyDeductionHours',
        DisplayKey: 'HRM_Attendance_AttendanceTable_LateEarlyDeductionHours',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        Name: 'UnPaidLeave',
        DisplayKey: 'E_OFF_NOT_SALARY',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        Name: 'TotalAnlDayAvailable',
        DisplayKey: 'HRM_Attendance_ConfirmHistoryAttendaceTable_TotalAnlDayAvailable',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        Name: 'AnlDayAdjacent',
        DisplayKey: 'HRM_Attendance_ConfirmHistoryAttendaceTable_AnlDayAdjacent',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        Name: 'PaidLeaveDays',
        DisplayKey: 'HRM_Attendance_AttendanceTable_PaidLeaveDays',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        Name: 'TotalMissInOut',
        DisplayKey: 'HRM_Attendance_ConfirmHistoryAttendaceTable_TotalMissInOut',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        Name: 'LateEarlyCount',
        DisplayKey: 'HRM_HR_Profile_LateEarlyCount',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        Name: 'AnlLeaveDay',
        DisplayKey: 'HRM_Attendance_ConfirmHistoryAttendaceTable_AnlLeaveDay',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        Name: 'AnlLeaveHours',
        DisplayKey: 'HRM_Attandance_History_AnnualLeaveHours',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        Name: 'TotalBreakConfirmHours',
        DisplayKey: 'HRM_Attendance_Overtime_ConfirmOTBreakHours',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        Name: 'TotalDaysReceiveSalary',
        DisplayKey: 'HRM_Attendance_AttendanceTable_TotalDaysReceiveSalary',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        TypeView: 'E_STATUS',
        Name: 'StatusView',
        DisplayKey: 'HRM_Attendance_Overtime_OvertimeList_Status',
        DataType: 'string'
    }
];

export default class AttendanceCalenderDetailHistoryDetail extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataItem: null,
            configListDetail: null
        };
    }

    getDataItem = async (isReload = false) => {
        try {
            const _params = this.props.navigation.state.params,
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params);

            let _configListDetail =
                ConfigListDetail.value[screenName] === null ? ConfigListDetail.value[screenName] : configDefault;
            // eslint-disable-next-line no-empty
            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
            } else if (dataItem) {
                let configListDetailCopy = [];

                _configListDetail.forEach((e) => {
                    let item = { ...e };
                    if (item && item.DisplayKey && Object.prototype.hasOwnProperty.call(dataItem, item.DisplayKey)) {
                        if (dataItem[item.DisplayKey]) item.DisplayKey = dataItem[item.DisplayKey];
                        else item.DisplayKey = null;
                    }
                    configListDetailCopy.push(item);
                });

                this.setState({ configListDetail: configListDetailCopy, dataItem: dataItem });
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
        const { dataItem, configListDetail } = this.state,
            { containerItemDetail } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem == 'EmptyData') {
            contentViewDetail = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    <ScrollView style={CustomStyleSheet.flexGrow(1)}>
                        <View style={containerItemDetail}>
                            {configListDetail.map((e) => {
                                if (e.DisplayKey !== null) return Vnr_Function.formatStringTypeV2(dataItem, e);
                                else return <View />;
                            })}
                        </View>
                    </ScrollView>
                </View>
            );
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={[styleSheets.container]}>{contentViewDetail}</View>
            </SafeAreaView>
        );
    }
}
