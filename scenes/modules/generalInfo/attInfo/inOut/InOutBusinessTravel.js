import React, { Component } from 'react';
import { View, StyleSheet, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, Size, Colors, styleSafeAreaView, CustomStyleSheet } from '../../../../../constants/styleConfig';
import moment from 'moment';
import HttpService from '../../../../../utils/HttpService';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import InOutBusinessTravelItem from './InOutBusinessTravelItem';
import { ScrollView } from 'react-native-gesture-handler';
import { Calendar } from '../../../../../components/calendars/src';
import { cutOffDuration } from '../../../../../assets/cutOffDuration';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { EnumStatus } from '../../../../../assets/constant';
import VnrLoadingScreen from '../../../../../components/VnrLoading/VnrLoadingScreen';
import DrawerServices from '../../../../../utils/DrawerServices';

export default class InOutBusinessTravel extends Component {
    constructor(porps) {
        super(porps);

        this.state = {
            dataGeneral: [],
            dataList: {},
            isloadingData: true,
            isRefresh: true,
            dataBody: null,
            isShowModalDetailWorkDay: false,
            isRefreshChart: false,
            isShowMore: false,
            refreshing: false,
            monthYear: {
                value: new Date(),
                refresh: false
            }
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

    getDataList = () => {
        const valueCutOffDuration = this.objCutOff;
        this.setState({ refreshing: true });
        HttpService.Post(
            '[URI_HR]/Att_GetData/Get_Att_TamScanAppPortal',
            {
                CutOffDurationID: valueCutOffDuration && valueCutOffDuration.ID ? valueCutOffDuration.ID : null,
                ProfileIDs: dataVnrStorage.currentUser.info.ProfileID,
                Page: 1,
                PageSize: 100000
            },
            null,
            this.reload
        ).then((res) => {
            try {
                let data = {};
                if (res && res.data && Array.isArray(res.data)) {
                    res.data.forEach((item) => {
                        const timeLog = moment(item.WhileTimeLog).format('YYYY-MM-DD');
                        if (data[timeLog]) {
                            data[timeLog]['data'].push(item);
                        } else {
                            data[timeLog] = { data: [item], dateTime: item.WhileTimeLog };
                        }
                    });
                }

                this.setState({
                    dataList: data,
                    isloadingData: false,
                    refreshing: false
                });
            } catch (error) {
                DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
            }
        });
    };

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

    render() {
        const { refreshing, dataList, monthYear, isloadingData, dataBody } = this.state;

        let viewContent = <View />;
        if (isloadingData) {
            viewContent = (
                <View style={CustomStyleSheet.flex(1)}>
                    <VnrLoadingScreen size="large" isVisible={isloadingData} type={EnumStatus.E_SUBMIT} />
                </View>
            );
        } else if (dataList && Object.keys(dataList).length > 0) {
            viewContent = (
                <ScrollView
                    contentContainerStyle={{ paddingBottom: Size.defineSpace }}
                    showsVerticalScrollIndicator={false}
                    refreshControl={
                        <RefreshControl
                            onRefresh={() => this.getDataList(dataBody)}
                            refreshing={refreshing}
                            size="large"
                            tintColor={Colors.primary}
                        />
                    }
                >
                    {Object.keys(dataList).map((key) => {
                        return <InOutBusinessTravelItem dataItem={dataList[key]} index={key} key={key} />;
                    })}
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

                    <View style={[styleSheets.container]}>{viewContent}</View>
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styHeaderCalendar: { backgroundColor: Colors.white, paddingVertical: 5 },
    containerGrey: {
        flex: 1,
        backgroundColor: Colors.gray_3
    }
});
