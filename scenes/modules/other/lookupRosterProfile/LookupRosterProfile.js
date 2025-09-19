import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, Size, Colors, styleSafeAreaView } from '../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import moment from 'moment';
import VnrDate from '../../../../components/VnrDate/VnrDate';
import VnrText from '../../../../components/VnrText/VnrText';
import LookupRosterProfileList from './LookupRosterProfileList';
import { ConfigList } from '../../../../assets/configProject/ConfigList';
import { EnumName, ScreenName } from '../../../../assets/constant';
import { IconDate } from '../../../../constants/Icons';

let configList = null,
    screenName = null;
export default class LookupRosterProfile extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            isRefreshDateFrom: false,
            isRefreshDateTo: false,
            dateFrom: new Date(),
            dateTo: new Date(),
            renderRow: null
        };
        this.refDateFrom = null;
        this.refDateTo = null;
    }

    setDateFrom = (_dateFrom) => {
        const { dateTo } = this.state,
            dateFromFormat = moment(_dateFrom).format('YYYY/MM/DD'),
            dateToFormat = moment(dateTo).format('YYYY/MM/DD');
        if (!moment(dateFromFormat).isBefore(dateToFormat)) {
            this.setState({
                dateFrom: _dateFrom,
                dateTo: _dateFrom,
                isRefreshDateFrom: !this.state.isRefreshDateFrom,
                isRefreshDateTo: !this.state.isRefreshDateTo
            });
        } else {
            this.setState({
                dateFrom: _dateFrom,
                isRefreshDateFrom: !this.state.isRefreshDateFrom
            });
        }
    };

    setDateTo = (_dateTo) => {
        const { dateFrom } = this.state,
            dateFromFormat = moment(dateFrom).format('YYYY/MM/DD'),
            dateToFormat = moment(_dateTo).format('YYYY/MM/DD');
        if (!moment(dateFromFormat).isBefore(dateToFormat) && !moment(dateFromFormat).isSame(dateToFormat)) {
            this.setState({
                dateFrom: _dateTo,
                dateTo: _dateTo,
                isRefreshDateFrom: !this.state.isRefreshDateFrom,
                isRefreshDateTo: !this.state.isRefreshDateTo
            });
            // setTimeout(() => {
            //     ToasterSevice.showError('MessageDate_CannotBeSmaller',4000);
            // }, 500);
        } else {
            this.setState({
                dateTo: _dateTo,
                isRefreshDateTo: !this.state.isRefreshDateTo
            });
        }
    };

    showDateFrom = () => {
        this.refDateFrom.showDatePicker();
    };

    showDateTo = () => {
        this.refDateTo.showDatePicker();
    };

    componentDidMount() {
        this.generaRender();
    }

    generaRender = () => {
        configList = ConfigList.value;
        screenName = ScreenName.LookupRosterProfile;
        const _configList = configList && configList[screenName],
            renderRow = _configList && _configList[EnumName.E_Row];

        this.setState({ renderRow });
    };

    render() {
        const { dateFrom, dateTo, isRefreshDateFrom, isRefreshDateTo, renderRow } = this.state,
            dataBody = {
                ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                DateStart: moment(dateFrom).format('YYYY-MM-DD'),
                DateEnd: moment(dateTo).format('YYYY-MM-DD'),
                IsGetOT: false,
                IsGetLD: false,
                IsGetRT: true,
                IsGetFT: false,
                IsGetPOT: false
            };

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styles.pickerhiden}>
                    <VnrDate
                        value={dateFrom}
                        refresh={isRefreshDateFrom}
                        ref={(ref) => {
                            this.refDateFrom = ref;
                        }}
                        type="date"
                        placeholder="CHOOSE_TIME"
                        fieldName="txtDate"
                        onFinish={(value) => this.setDateFrom(value)}
                        format="DD-MM-YYYY" //"hh:mm:ss"//
                    />
                    <VnrDate
                        value={dateTo}
                        refresh={isRefreshDateTo}
                        ref={(ref) => {
                            this.refDateTo = ref;
                        }}
                        type="date"
                        placeholder="CHOOSE_TIME"
                        fieldName="txtDate"
                        onFinish={(value) => this.setDateTo(value)}
                        format="DD-MM-YYYY" //"hh:mm:ss"//
                    />
                </View>
                <View style={[styleSheets.container]}>
                    <View style={styles.styleComonFilter}>
                        <View style={styles.styleVieDateFromTo}>
                            <TouchableOpacity style={styles.bntDataFromTo} onPress={() => this.showDateFrom()}>
                                <IconDate size={Size.iconSize} color={Colors.black} />
                                <Text style={[styleSheets.lable, styles.txtDateFromTo]}>
                                    {moment(dateFrom).format('DD/MM/YYYY')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                        <VnrText style={[styleSheets.text, { color: Colors.black }]} i18nKey={'HRM_Attendance_OTTo'} />
                        <View style={styles.styleVieDateFromTo}>
                            <TouchableOpacity style={styles.bntDataFromTo} onPress={() => this.showDateTo()}>
                                <IconDate size={Size.iconSize} color={Colors.black} />
                                <Text style={[styleSheets.lable, styles.txtDateFromTo]}>
                                    {moment(dateTo).format('DD/MM/YYYY')}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                    {renderRow && (
                        <LookupRosterProfileList
                            detail={{
                                dataLocal: false,
                                screenName: screenName
                                //screenDetail: screenViewDetail,
                            }}
                            api={{
                                urlApi: '[URI_HR]/Att_GetData/GetWorkDayData',
                                type: 'E_POST',
                                dataBody: dataBody
                            }}
                            valueField="ID"
                            renderConfig={renderRow}
                        />
                    )}
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styleVieDateFromTo: {
        flex: 5
    },
    styleComonFilter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        height: 60,
        backgroundColor: Colors.white
    },
    bntDataFromTo: {
        marginHorizontal: styleSheets.m_20,
        borderRadius: 30,
        height: 40,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        borderColor: Colors.gray_5,
        borderWidth: 0.5
    },
    pickerhiden: {
        position: 'absolute',
        top: -100
    },
    txtDateFromTo: {
        color: Colors.black,
        marginLeft: 7
    }
});
