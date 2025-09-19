import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    styleScreenDetail,
    styleSafeAreaView,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { View, ScrollView } from 'react-native';
import HttpService from '../../../../../utils/HttpService';

const configDefault = [
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Att_AttendanceTable'
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
        Name: 'TotalActualWorkHour',
        DisplayKey: 'HRM_Attendance_AttendanceTable_TotalActualWorkHour',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        Name: 'TotalDifferenceHour',
        DisplayKey: 'HRM_Attendance_AttendanceTable_TotalDifferenceHour',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        Name: 'InitSaveSickValue',
        DisplayKey: 'HRM_Attendance_AnnualLeave_AdditionalAnnualLeave',
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
        Name: 'LateEarlyDeductionHours',
        DisplayKey: 'HRM_Attendance_AttendanceTable_LateEarlyDeductionHours',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        Name: 'TotalAttComputePayroll',
        DisplayKey: 'HRM_Attendance_AttendanceTable_TotalAttComputePayroll',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        Name: 'LateEarlyCount',
        DisplayKey: 'HRM_Attendance_AttendanceTable_LateEarlyCount',
        DataType: 'Double',
        DataFormat: '#.###,##'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Attendance_AttendanceTable_Leaveday'
    },
    {
        Name: 'AnlHoursTaken',
        DisplayKey: 'HRM_Attendance_AttendanceTable_AnlHoursTaken',
        DataType: 'string'
    },

    {
        Name: 'AnlDayTaken',
        DisplayKey: 'HRM_Attendance_AttendanceTable_AnlDayTaken',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Attendance_AttendanceTable_Overtime'
    },
    {
        Name: 'Overtime1Hours',
        DisplayKey: 'GroupOvertimeHours1',
        DataType: 'string'
    },
    {
        Name: 'TotalBreakConfirmHours',
        DisplayKey: 'HRM_Attendance_Overtime_ConfirmOTBreakHours',
        DataType: 'string'
    }
];

export default class AttendanceCalendarViewDetail extends Component {
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
                ConfigListDetail.value[screenName] != null ? ConfigListDetail.value[screenName] : configDefault;

            // eslint-disable-next-line no-empty
            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
            } else if (dataItem && dataItem.cutOffDuration) {
                const valueCutOffDuration = dataItem.cutOffDuration;
                HttpService.Post(
                    '[URI_HR]/Att_GetData/New_GetAttendanceTableByProIDandCutOID',
                    {
                        CutOffDurationID: valueCutOffDuration ? valueCutOffDuration : null
                    },
                    null,
                    this.getDataItem
                ).then((res) => {
                    if (res) {
                        let configListDetailCopy = [];

                        _configListDetail.forEach((e) => {
                            let item = { ...e };
                            if (item && item.DisplayKey && Object.prototype.hasOwnProperty.call(res, item.DisplayKey)) {
                                if (res[item.DisplayKey]) item.DisplayKey = res[item.DisplayKey];
                                else item.DisplayKey = null;
                            }
                            configListDetailCopy.push(item);
                        });

                        this.setState({ configListDetail: configListDetailCopy, dataItem: res });
                    } else this.setState({ configListDetail: _configListDetail, dataItem: 'EmptyData' });
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
