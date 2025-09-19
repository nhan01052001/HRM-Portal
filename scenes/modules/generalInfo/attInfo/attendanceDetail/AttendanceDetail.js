import React, { Component } from 'react';
import { View, ScrollView, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import moment from 'moment';
import VnrText from '../../../../../components/VnrText/VnrText';
import HttpService from '../../../../../utils/HttpService';
import ManageFileSevice from '../../../../../utils/ManageFileSevice';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import {
    styleViewTitleForGroup,
    styleSafeAreaView,
    Colors,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { cutOffDuration } from '../../../../../assets/cutOffDuration';
import { Calendar } from '../../../../../components/calendars';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import AttendanceDetailList from './attendanceDetailList/AttendanceDetailList';
import ChartAttendance from './ChartAttendance';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { EnumStatus } from '../../../../../assets/constant';
import VnrLoadingScreen from '../../../../../components/VnrLoading/VnrLoadingScreen';
import DrawerServices from '../../../../../utils/DrawerServices';
export default class AttendanceDetail extends Component {
    constructor(porps) {
        super(porps);

        this.state = {
            dataGeneral: [],
            dataList: [],
            isloadingData: true,
            isRefresh: true,
            monthYear: {
                value: new Date(),
                refresh: false
            },
            isShowModalDetailWorkDay: false,
            isRefreshChart: false,
            isShowMore: false
        };

        this.objCutOff = null;
    }

    getCutOffByMonth = (dataBody) => {
        return HttpService.Post('[URI_HR]/Att_GetData/GetCutOffDurationByMonthYear', dataBody, null, this.reload);
    };

    reload = () => {
        if (!cutOffDuration.value) {
            let date = new Date(),
                year = moment(date).format('YYYY'),
                month = moment(date).format('MM'),
                dataBody = {
                    Month: month,
                    Year: year
                };

            this.getCutOffByMonth(dataBody).then((res) => {
                try {
                    if (res && Array.isArray(res)) {
                        cutOffDuration.data = [...res];
                        cutOffDuration.value = { ...res[0] };

                        this.objCutOff = { ...res[0] };
                        this.getDataGeneral(this.getDataList);
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        } else {
            const _cutOff = cutOffDuration.value;
            if (Object.keys(_cutOff).length > 0 && _cutOff.MonthYear) {
                this.objCutOff = { ..._cutOff };
                this.setState(
                    {
                        monthYear: {
                            value: _cutOff.MonthYear,
                            refresh: !this.state.monthYear.refresh
                        }
                    },
                    () => {
                        this.getDataGeneral(this.getDataList);
                    }
                );
            } else {
                let date = new Date(),
                    year = moment(date).format('YYYY'),
                    month = moment(date).format('MM'),
                    dataBody = {
                        Month: month,
                        Year: year
                    };

                this.getCutOffByMonth(dataBody).then((res) => {
                    try {
                        if (res && Array.isArray(res)) {
                            cutOffDuration.data = [...res];
                            cutOffDuration.value = { ...res[0] };

                            this.objCutOff = { ...res[0] };
                            this.getDataGeneral(this.getDataList);
                        }
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });
            }
        }
    };

    componentDidMount() {
        this.reload();
    }

    onDateChange = (XDate) => {
        let date = XDate ? XDate.dateString : new Date();
        const { monthYear } = this.state;
        this.setState(
            {
                monthYear: {
                    ...monthYear,
                    value: date
                },
                isloadingData: true
            },
            () => {
                let year = moment(date).format('YYYY'),
                    month = moment(date).format('MM'),
                    dataBody = {
                        Month: month,
                        Year: year
                    };

                this.getCutOffByMonth(dataBody).then((res) => {
                    try {
                        if (res && Array.isArray(res)) {
                            cutOffDuration.data = [...res];
                            cutOffDuration.value = { ...res[0] };

                            this.objCutOff = { ...res[0] };
                            this.getDataGeneral(this.getDataList);
                        }
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });
            }
        );
    };

    getDataGeneral = (getDataList) => {
        const valueCutOffDuration = this.objCutOff;
        HttpService.Post(
            '[URI_HR]/Att_GetData/New_GetAttendanceTableByProIDandCutOID',
            {
                CutOffDurationID: valueCutOffDuration && valueCutOffDuration.ID ? valueCutOffDuration.ID : null
            },
            null,
            this.reload
        ).then((res) => {
            getDataList(res);
        });
    };

    getDataList = (_dataGeneral) => {
        const valueCutOffDuration = this.objCutOff;
        HttpService.Post(
            '[URI_HR]/Att_GetData/GetAttendanceDetailByProIDandCutOID',
            {
                CutOffDurationID: valueCutOffDuration && valueCutOffDuration.ID ? valueCutOffDuration.ID : null
            },
            null,
            this.reload
        ).then((res) => {
            try {
                let data = [];
                if (res && res.Data) {
                    data = res.Data;
                }
                this.setState({
                    dataList: [...data],
                    dataGeneral: { ..._dataGeneral },
                    isRefreshChart: !this.state.isRefreshChart,
                    isloadingData: false
                    // monthYear: {
                    //     value: valueCutOffDuration.MonthYear,
                    //     refresh: !monthYear.refresh
                    // }
                });
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    //#region [export]
    reviewfile = (url) => {
        ManageFileSevice.ReviewFile(url);
    };

    printRowGrid2 = () => {
        let { ExportId } = this.state;
        if (!ExportId || ExportId === '') {
            ToasterSevice.showWarning('PleaseSelectSampleReport', 2000);
            return;
        }
        VnrLoadingSevices.show();

        let valueCutOffDuration = this.objCutOff;
        let CutOffDurationID = valueCutOffDuration ? valueCutOffDuration.ID : null;
        let ValueFields =
            'WorkDate,WorkDateOfWeek,FirstInTime,LastOutTime,WorkHours,ShiftName,LateEarlyMinutes,UnpaidLeaveHoursView,PaidLeaveHoursView,WorkPaidHours,NightShiftHours,OvertimeHours,OvertimeTypeName';

        HttpService.Post(
            '[URI_HR]/Att_GetData/ReportMonthlyTimeSheetByProIDandCutOID',
            {
                ExportId: ExportId,
                CutOffDurationID: CutOffDurationID,
                IsExport: true,
                ProfileID: '136a8e27-7bc2-4e09-b434-6367f49b9304',
                ValueFields: ValueFields
            },
            null,
            this.reload
        ).then((res) => {
            let _split = res.split(',');

            if (_split[0] === 'Success') {
                this.reviewfile(dataVnrStorage.apiConfig.uriMain + '/' + _split[1]);
            } else {
                ToasterSevice.showWarning(res, 2000);
            }

            VnrLoadingSevices.hide();
        });
    };

    printRowGridReport = () => {
        let { ExportId } = this.state;
        if (!ExportId || ExportId === '') {
            ToasterSevice.showWarning('PleaseSelectSampleReport', 2000);
            return;
        }
        VnrLoadingSevices.show();

        let valueCutOffDuration = this.objCutOff;
        let CutOffDurationID = valueCutOffDuration ? valueCutOffDuration.ID : null;

        HttpService.Post(
            '[URI_HR]/Att_GetData/New_GetExportIDAttendanceDetailByProfilePortal',
            {
                ExportPDF: false,
                ExportId: ExportId,
                CutOffDurationID: CutOffDurationID,
                //IsExport: true,
                ProfileID: '136a8e27-7bc2-4e09-b434-6367f49b9304'
                //ValueFields: ValueFields
            },
            null,
            this.reload
        ).then((res) => {
            let _split = res.split(',');
            if (_split[0] === 'Success') {
                this.reviewfile(dataVnrStorage.apiConfig.uriMain + '/' + _split[1]);
            } else {
                ToasterSevice.showWarning(res, 2000);
            }

            VnrLoadingSevices.hide();
        });
    };

    printRowGridPDF = () => {
        let { ExportId } = this.state;
        if (!ExportId || ExportId === '') {
            ToasterSevice.showWarning('PleaseSelectSampleReport', 2000);
            return;
        }

        VnrLoadingSevices.show();

        let valueCutOffDuration = this.objCutOff;
        let CutOffDurationID = valueCutOffDuration ? valueCutOffDuration.ID : null;

        HttpService.Post(
            '[URI_HR]/Att_GetData/New_GetExportIDAttendanceDetailByProfilePortal',
            {
                ExportPDF: true,
                ExportId: ExportId,
                CutOffDurationID: CutOffDurationID,
                ProfileID: '136a8e27-7bc2-4e09-b434-6367f49b9304'
            },
            null,
            this.reload
        ).then((res) => {
            let _split = res.split(',');

            if (_split[0] === 'Success') {
                this.reviewfile(dataVnrStorage.apiConfig.uriPor + '/' + _split[1]);
            } else {
                ToasterSevice.showWarning(res, 2000);
            }

            VnrLoadingSevices.hide();
        });
    };
    //#endregion

    render() {
        const { dataGeneral, dataList, monthYear, isRefreshChart, isloadingData } = this.state;

        let listConfigMaster =
                ConfigList && ConfigList.value ? ConfigList.value['GeneralInfoAttAttendance']['Master'] : [],
            listConfigGeneral =
                ConfigList && ConfigList.value ? ConfigList.value['GeneralInfoAttAttendance']['Row'] : [],
            viewContent = <View />;

        // task 0149730
        let listConfigGeneralCopy = [];
        if (dataGeneral && Object.keys(dataGeneral).length > 0) {
            listConfigGeneral.forEach((e) => {
                let item = { ...e };
                if (item && item.DisplayKey && Object.prototype.hasOwnProperty.call(dataGeneral, item.DisplayKey)) {
                    if (dataGeneral[item.DisplayKey]) item.DisplayKey = dataGeneral[item.DisplayKey];
                    else item.DisplayKey = null;
                }
                listConfigGeneralCopy.push(item);
            });
        }

        if (isloadingData) {
            viewContent = (
                <View style={CustomStyleSheet.flex(1)}>
                    <VnrLoadingScreen
                        size="large"
                        screenName={this.props.detail ? this.props.detail.screenName : null}
                        isVisible={isloadingData}
                        type={EnumStatus.E_SUBMIT}
                    />
                </View>
            );
        } else if (dataList && dataList.length > 0) {
            viewContent = (
                <ScrollView>
                    <View style={styles.containerChart}>
                        {dataGeneral && (
                            <ChartAttendance
                                dataSource={dataGeneral}
                                listConfigMaster={listConfigMaster}
                                listConfigGeneral={listConfigGeneralCopy}
                                isRefresh={isRefreshChart}
                            />
                        )}
                    </View>
                    <View style={styles.containerWhite}>
                        <View style={CustomStyleSheet.flex(1)}>
                            <View
                                style={[styleViewTitleForGroup.styleViewTitleGroup, CustomStyleSheet.marginBottom(10)]}
                            >
                                <VnrText
                                    style={styleViewTitleForGroup.textLableGroup}
                                    i18nKey={'HRM_Attendance_AttendanceTableItem_Title'}
                                />
                            </View>
                            <AttendanceDetailList
                                detail={{
                                    dataLocal: false,
                                    screenDetail: 'AttendanceDetailViewDetail',
                                    screenName: 'GeneralInfoAttAttendanceDetail'
                                }}
                                rowActions={[]}
                                selected={[]}
                                dataLocal={dataList}
                                valueField="ID"
                            />
                        </View>
                    </View>
                </ScrollView>
            );
        } else if (!isloadingData) {
            viewContent = (
                <View style={CustomStyleSheet.flex(1)}>
                    <EmptyData messageEmptyData={'EmptyData'} />
                </View>
            );
        }

        // const configPickerTemplate = {
        //     api: {
        //         urlApi: '[URI_HR]/Cat_GetData/GetScreenName_Attendance_Portal?screenName=Att_ReportMonthlyTimeSheetV2/Index&screenName2=New_Personal/New_Attendance',
        //         type: 'E_GET'
        //     },
        //     textField: 'ExportName',
        //     valueField: 'ID',
        //     filter: true,
        //     filterServer: false,
        //     fieldName: 'ExportId',
        //     placeHolder: ''
        // };

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styles.containerGrey}>
                    <Calendar
                        headerStyle={styles.styHeaderCalendar}
                        onlyMonth={true}
                        autoClose={true}
                        current={moment(monthYear.value).format('YYYY-MM-DD')}
                        monthFormat={'MM-yyyy'}
                        firstDay={1}
                        onMonthChange={(dataValue) => this.onDateChange(dataValue)}
                    />
                    {viewContent}
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styHeaderCalendar: {
        backgroundColor: Colors.white,
        paddingVertical: 5
    },
    containerGrey: { flex: 1, backgroundColor: Colors.greyBorder },
    containerWhite: { flex: 1, backgroundColor: Colors.white, minHeight: 200 },
    containerChart: {
        backgroundColor: Colors.white,
        marginVertical: 10
        // paddingVertical : 10,
    }
});

{
    /* <View style={[styleSheets.col_2]}>
                            <View style={{ flex: 1 }}>
                                <VnrPicker
                                    key={configPickerTemplate.fieldName}
                                    {...configPickerTemplate}
                                    onFinish={(Item) => {
                                        if (!Vnr_Function.CheckIsNullOrEmpty(Item)) {
                                            this.setState(state => {
                                                state[configPickerTemplate.fieldName]
                                                    = Item[configPickerTemplate.valueField]
                                            });
                                        }
                                    }}
                                />
                            </View>
                            <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-around" }}>
                                <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity onPress={() => this.printRowGrid2()} >
                                        <Text>Xuất phiếu công</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity onPress={() => this.printRowGridReport()} >
                                        <Text>Xuất BC</Text>
                                    </TouchableOpacity>
                                </View>

                                <View style={{ flexDirection: "row" }}>
                                    <TouchableOpacity onPress={() => this.printRowGridPDF()} >
                                        <Text>Xuất PDF</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </View> */
}
