import React, { Component } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { Size, Colors, styleSafeAreaView, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { Calendar } from '../../../../../components/calendars';
import moment from 'moment';
import HttpService from '../../../../../utils/HttpService';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { cutOffDuration } from '../../../../../assets/cutOffDuration';
import { ScrollView } from 'react-native-gesture-handler';
import { EnumStatus } from '../../../../../assets/constant';
import VnrLoadingScreen from '../../../../../components/VnrLoading/VnrLoadingScreen';
import DrawerServices from '../../../../../utils/DrawerServices';
import { translate } from '../../../../../i18n/translate';
import InOutListWeek from './InOutListWeek';

export default class InOut extends Component {
    constructor(porps) {
        super(porps);

        this.state = {
            dataGeneral: [],
            dataList: {},
            weeklyData: {},
            isloadingData: true,
            isRefresh: true,
            monthYear: {
                value: new Date(),
                refresh: false
            },
            isShowModalDetailWorkDay: false,
            isRefreshChart: false,
            isShowMore: false,
            refreshing: false
        };

        this.objCutOff = null;
    }

    getCutOffByMonth = (dataBody) => {
        return HttpService.Post('[URI_HR]/Att_GetData/GetCutOffDurationByMonthYear', dataBody, null, this.reload);
    };

    reload = () => {
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
                    this.getDataList();
                }
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
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
                            this.getDataList();
                        }
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });
            }
        );
    };

    getDataList = () => {
        const valueCutOffDuration = this.objCutOff;
        this.setState({ refreshing: true });
        HttpService.Post(
            '[URI_HR]/Att_GetData/GetTAMScanLogByProfileID',
            {
                CutOffDurationID: valueCutOffDuration && valueCutOffDuration.ID ? valueCutOffDuration.ID : null,
                ProfileID: dataVnrStorage.currentUser.info.ProfileID
            },
            null,
            this.reload
        ).then((res) => {
            try {
                let data = {};
                if (res && res.Data && Array.isArray(res.Data)) {
                    res.Data.forEach((item) => {
                        const timeLog = moment(item.TimeLog).format('YYYY-MM-DD');
                        if (data[timeLog]) {
                            data[timeLog]['data'].push(item);
                        } else {
                            data[timeLog] = { data: [item], dateTime: item.TimeLog };
                        }
                    });
                }

                this.setState(
                    {
                        dataList: data,
                        isloadingData: false,
                        refreshing: false
                    },
                    () => {
                        this.groupByWeek();
                    }
                );
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

    getWeekOfMonth = (date) => {
        const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
        const firstDayWeekday = firstDayOfMonth.getDay(); // Thứ trong tuần (0 - Chủ Nhật, 1 - Thứ Hai, ...)
        return Math.ceil((date.getDate() + firstDayWeekday) / 7);
    };

    groupByWeek = () => {
        const { dataList } = this.state;
        let _weeklyData = {};

        Object.keys(dataList).forEach((dateString) => {
            let date = new Date(dateString),
                weekNum = this.getWeekOfMonth(date),
                weekNumber = translate('E_WEEK') + ' ' + weekNum;

            if (!_weeklyData[weekNumber]) {
                _weeklyData[weekNumber] = { days: [], range: '' };
            }
            _weeklyData[weekNumber].days.push({ date: dateString, ...dataList[dateString] });
        });

        // Tính toán range (DD/MM/YYYY - DD/MM/YYYY) cho từng tuần
        Object.keys(_weeklyData).forEach((weekKey) => {
            let anyDate = new Date(_weeklyData[weekKey].days[0].date); // Lấy một ngày trong tuần đó

            let startOfWeek = this.getMonday(anyDate); // Lấy ngày đầu tuần (Thứ 2)
            let endOfWeek = this.getSunday(anyDate); // Lấy ngày cuối tuần (Chủ Nhật)

            _weeklyData[weekKey].range = `${this.formatDate(startOfWeek)} - ${this.formatDate(endOfWeek)}`;
        });

        this.setState({
            weeklyData: _weeklyData
        });
    };

    getMonday = (date) => {
        let d = new Date(date);
        let day = d.getDay();
        let diff = d.getDate() - day + (day === 0 ? -6 : 1); // Chuyển về Thứ 2
        return new Date(d.setDate(diff));
    };

    getSunday = (date) => {
        let d = new Date(this.getMonday(date)); // Bắt đầu từ Thứ 2
        return new Date(d.setDate(d.getDate() + 6)); // Cộng thêm 6 ngày để ra Chủ Nhật
    };

    // Định dạng ngày thành 'DD/MM/YYYY'
    formatDate = (date) => {
        return moment(date).format('DD/MM/YYYY');
    };

    scrollToSpecificDay = (yOffset) => {
        if (this.scrollViewRef) {
            setTimeout(() => {
                this.scrollViewRef.scrollTo({ y: yOffset, animated: true });
            }, 500); // Đợi UI render xong
        }
    };

    render() {
        const { refreshing, monthYear, isloadingData, weeklyData } = this.state;

        let viewContent = <View />;
        if (isloadingData) {
            viewContent = (
                <View style={CustomStyleSheet.flex(1)}>
                    <VnrLoadingScreen size="large" isVisible={isloadingData} type={EnumStatus.E_SUBMIT} />
                </View>
            );
        } else if (weeklyData && Object.keys(weeklyData).length > 0) {
            viewContent = (
                <ScrollView
                    ref={(ref) => (this.scrollViewRef = ref)}
                    contentContainerStyle={{ padding: Size.defineSpace }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            onRefresh={() => this.getDataList()}
                            refreshing={refreshing}
                            size="large"
                            tintColor={Colors.primary}
                        />
                    }
                >
                    <InOutListWeek weeklyData={weeklyData} scrollToSpecificDay={this.scrollToSpecificDay} />
                </ScrollView>
            );
        } else if (!isloadingData) {
            viewContent = (
                <View style={CustomStyleSheet.flex(1)}>
                    <EmptyData messageEmptyData={'EmptyData'} />
                </View>
            );
        }

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
    containerGrey: {
        flex: 1,
        backgroundColor: Colors.gray_3
    }
});
