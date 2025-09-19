/* eslint-disable react-native/no-unused-styles */
import React, { Component } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, Size, Colors, CustomStyleSheet } from '../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../assets/auth/authentication';
import { cutOffDuration } from '../../../../assets/cutOffDuration';
import moment from 'moment';
import VnrDate from '../../../../components/VnrDate/VnrDate';
import CheckBox from 'react-native-check-box';
import VnrText from '../../../../components/VnrText/VnrText';
import AttRequestList from './AttRequestList';
import HttpService from '../../../../utils/HttpService';
import VnrLoading from '../../../../components/VnrLoading/VnrLoading';
import { IconDate } from '../../../../constants/Icons';
import DrawerServices from '../../../../utils/DrawerServices';

export default class AttRequest extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            isCheckAll: true,
            isCheckOvertime: false,
            isCheckLeave: false,
            isCheckInOut: false,
            isCheckBusiness: false,
            ischeckRoster: false,
            isRefreshDateFrom: false,
            isRefreshDateTo: false,
            dateFrom: null,
            dateTo: null,
            showContainer: true,
            listType: ['E_OVERTIME', 'E_LEAVE_DAY', 'E_BUSSINESSTRAVEL', 'E_TAMSCANLOGREGISTER', 'E_ROSTER']
        };
        this.refDateFrom = null;
        this.refDateTo = null;
    }

    setDateFrom = _dateFrom => {
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
            this.setState({ dateFrom: _dateFrom, isRefreshDateFrom: !this.state.isRefreshDateFrom });
        }
    };

    setDateTo = _dateTo => {
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
            this.setState({ dateTo: _dateTo, isRefreshDateTo: !this.state.isRefreshDateTo });
        }
    };
    showDateFrom = () => {
        this.refDateFrom.showDatePicker();
    };
    showDateTo = () => {
        this.refDateTo.showDatePicker();
    };

    getCutOffByMonth = dataBody => {
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

            this.getCutOffByMonth(dataBody).then(res => {
                try {
                    if (res && Array.isArray(res)) {
                        cutOffDuration.data = [...res];
                        cutOffDuration.value = { ...res[0] };
                        const value = res[0],
                            _dateFrom = new Date(moment(value.DateStart)),
                            _dateTo = new Date(moment(value.DateEnd));
                        this.setState({
                            dateFrom: _dateFrom,
                            dateTo: _dateTo,
                            isRefreshDateFrom: !this.state.isRefreshDateFrom,
                            isRefreshDateTo: !this.state.isRefreshDateTo
                        });
                    }
                } catch (error) {
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                }
            });
        } else {
            const _cutOff = cutOffDuration.value;
            if (Object.keys(_cutOff).length > 0 && _cutOff.DateStart && _cutOff.DateEnd) {
                const value = _cutOff,
                    _dateFrom = new Date(moment(value.DateStart)),
                    _dateTo = new Date(moment(value.DateEnd));
                this.setState({
                    dateFrom: _dateFrom,
                    dateTo: _dateTo,
                    isRefreshDateFrom: !this.state.isRefreshDateFrom,
                    isRefreshDateTo: !this.state.isRefreshDateTo
                });
            } else {
                let date = new Date(),
                    year = moment(date).format('YYYY'),
                    month = moment(date).format('MM'),
                    dataBody = {
                        Month: month,
                        Year: year
                    };

                this.getCutOffByMonth(dataBody).then(res => {
                    try {
                        if (res && Array.isArray(res)) {
                            cutOffDuration.data = [...res];
                            cutOffDuration.value = { ...res[0] };
                            const value = res[0],
                                _dateFrom = new Date(moment(value.DateStart)),
                                _dateTo = new Date(moment(value.DateEnd));
                            this.setState({
                                dateFrom: _dateFrom,
                                dateTo: _dateTo,
                                isRefreshDateFrom: !this.state.isRefreshDateFrom,
                                isRefreshDateTo: !this.state.isRefreshDateTo
                            });
                        }
                    } catch (error) {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    }
                });
            }
        }
    };

    componentDidMount() {
        setTimeout(() => {
            this.setState({ showContainer: true });
        }, 0);
        this.reload();
    }

    setCheckBoxFilter = value => {
        let { listType } = this.state;

        switch (value) {
            case 'E_ALL': {
                if (this.state.isCheckAll == true) {
                    listType.length = 0;
                } else {
                    listType = ['E_OVERTIME', 'E_LEAVE_DAY', 'E_BUSSINESSTRAVEL', 'E_TAMSCANLOGREGISTER', 'E_ROSTER'];
                }
                this.setState({
                    isCheckAll: this.state.isCheckAll ? false : true,
                    isCheckOvertime: false,
                    isCheckLeave: false,
                    isCheckInOut: false,
                    isCheckBusiness: false,
                    ischeckRoster: false,
                    listType: listType
                });
                break;
            }
            case 'E_OVERTIME': {
                if (this.state.isCheckOvertime == true) {
                    listType = listType.filter(item => item != 'E_OVERTIME');
                } else if (listType.length == 5) {
                    listType.length = 0;
                    listType.push('E_OVERTIME');
                } else {
                    listType.push('E_OVERTIME');
                }
                this.setState({
                    isCheckAll: false,
                    isCheckOvertime: this.state.isCheckOvertime ? false : true,
                    listType: listType
                });
                break;
            }
            case 'E_LEAVE_DAY': {
                if (this.state.isCheckLeave == true) {
                    listType = listType.filter(item => item != 'E_LEAVE_DAY');
                } else if (listType.length == 5) {
                    listType.length = 0;
                    listType.push('E_LEAVE_DAY');
                } else {
                    listType.push('E_LEAVE_DAY');
                }
                this.setState({
                    isCheckAll: false,
                    isCheckLeave: this.state.isCheckLeave ? false : true,
                    listType: listType
                });
                break;
            }

            case 'E_BUSSINESSTRAVEL': {
                if (this.state.isCheckBusiness == true) {
                    listType = listType.filter(item => item != 'E_BUSSINESSTRAVEL');
                } else if (listType.length == 5) {
                    listType.length = 0;
                    listType.push('E_BUSSINESSTRAVEL');
                } else {
                    listType.push('E_BUSSINESSTRAVEL');
                }
                this.setState({
                    isCheckAll: false,
                    isCheckBusiness: this.state.isCheckBusiness ? false : true,
                    listType: listType
                });
                break;
            }
            case 'E_TAMSCANLOGREGISTER': {
                if (this.state.isCheckInOut == true) {
                    listType = listType.filter(item => item != 'E_TAMSCANLOGREGISTER');
                } else if (listType.length == 5) {
                    listType.length = 0;
                    listType.push('E_TAMSCANLOGREGISTER');
                } else {
                    listType.push('E_TAMSCANLOGREGISTER');
                }
                this.setState({
                    isCheckAll: false,
                    isCheckInOut: this.state.isCheckInOut ? false : true,
                    listType: listType
                });
                break;
            }
            case 'E_ROSTER': {
                if (this.state.ischeckRoster == true) {
                    listType = listType.filter(item => item != 'E_ROSTER');
                } else if (listType.length == 5) {
                    listType.length = 0;
                    listType.push('E_ROSTER');
                } else {
                    listType.push('E_ROSTER');
                }
                this.setState({
                    isCheckAll: false,
                    ischeckRoster: this.state.ischeckRoster ? false : true,
                    listType: listType
                });
                break;
            }
        }
    };

    render() {
        const {
            isCheckAll,
            isCheckOvertime,
            isCheckInOut,
            isCheckBusiness,
            isCheckLeave,
            ischeckRoster,
            dateFrom,
            dateTo,
            showContainer,
            listType,
            isRefreshDateFrom,
            isRefreshDateTo
        } = this.state;
        const {
            styleComonFilter,
            styleListOptionFilter,
            styleVieDateFromTo,
            bntDataFromTo,
            pickerhiden,
            txtDateFromTo,
            styleTopItem,
            lebleCheckbox,
            styleOption
        } = styles;

        let viewList = <VnrLoading size="large" isVisible={true} />;
        if (dateFrom && dateTo) {
            viewList = (
                <AttRequestList
                    api={{
                        urlApi: '[URI_HR]/Att_GetData/GetListDataWorkdayByProfile',
                        type: 'E_POST',
                        dataBody: {
                            profileID: dataVnrStorage.currentUser.info.ProfileID,
                            dateStart: dateFrom,
                            dateEnd: dateTo,
                            type: listType.toString()
                        }
                    }}
                    detail={{
                        dataLocal: false
                        //screenDetail: listConfig['ScreenName']
                    }}
                    valueField="ID"
                />
            );
        }
        return (
            showContainer && (
                <SafeAreaView style={CustomStyleSheet.flex(1)} forceInset={{ top: 'never' }}>
                    <View style={pickerhiden}>
                        <VnrDate
                            value={dateFrom ? dateFrom : new Date()}
                            refresh={isRefreshDateFrom}
                            ref={ref => (this.refDateFrom = ref)}
                            type="date"
                            placeholder="CHOOSE_TIME"
                            fieldName="txtDate"
                            onFinish={value => this.setDateFrom(value)}
                            format="DD-MM-YYYY" //"hh:mm:ss"//
                        />
                        <VnrDate
                            value={dateTo ? dateTo : new Date()}
                            refresh={isRefreshDateTo}
                            ref={ref => (this.refDateTo = ref)}
                            type="date"
                            placeholder="CHOOSE_TIME"
                            fieldName="txtDate"
                            onFinish={value => this.setDateTo(value)}
                            format="DD-MM-YYYY" //"hh:mm:ss"//
                        />
                    </View>
                    <View style={[styleSheets.container]}>
                        <View style={styleComonFilter}>
                            <View style={styleVieDateFromTo}>
                                <TouchableOpacity style={bntDataFromTo} onPress={() => this.showDateFrom()}>
                                    <IconDate size={Size.iconSize} color={Colors.black} />
                                    <Text style={[styleSheets.lable, txtDateFromTo]}>
                                        {dateFrom && moment(dateFrom).format('DD/MM/YYYY')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <VnrText
                                style={[styleSheets.text, { color: Colors.black }]}
                                i18nKey={'HRM_Attendance_OTTo'}
                            />
                            <View style={styleVieDateFromTo}>
                                <TouchableOpacity style={bntDataFromTo} onPress={() => this.showDateTo()}>
                                    <IconDate size={Size.iconSize} color={Colors.black} />
                                    <Text style={[styleSheets.lable, txtDateFromTo]}>
                                        {dateTo && moment(dateTo).format('DD/MM/YYYY')}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={styleListOptionFilter}>
                            <View style={styleTopItem}>
                                <TouchableOpacity style={styleOption} onPress={() => this.setCheckBoxFilter('E_ALL')}>
                                    <CheckBox
                                        checkBoxColor={Colors.grey}
                                        checkedCheckBoxColor={Colors.primary}
                                        onClick={() => this.setCheckBoxFilter('E_ALL')}
                                        isChecked={isCheckAll}
                                    />
                                    <View style={CustomStyleSheet.maxWidth('90%')}>
                                        <VnrText
                                            style={[styleSheets.text, lebleCheckbox]}
                                            i18nKey={'HRM_System_AllSetting'}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styleOption}
                                    onPress={() => this.setCheckBoxFilter('E_TAMSCANLOGREGISTER')}
                                >
                                    <CheckBox
                                        checkBoxColor={Colors.grey}
                                        checkedCheckBoxColor={Colors.primary}
                                        onClick={() => this.setCheckBoxFilter('E_TAMSCANLOGREGISTER')}
                                        isChecked={isCheckInOut}
                                    />
                                    <View style={CustomStyleSheet.maxWidth('90%')}>
                                        <VnrText
                                            style={[styleSheets.text, lebleCheckbox]}
                                            i18nKey={'HRM_System_Resource_Att_InOut'}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styleTopItem}>
                                <TouchableOpacity
                                    style={styleOption}
                                    onPress={() => this.setCheckBoxFilter('E_LEAVE_DAY')}
                                >
                                    <CheckBox
                                        checkBoxColor={Colors.grey}
                                        checkedCheckBoxColor={Colors.primary}
                                        onClick={() => this.setCheckBoxFilter('E_LEAVE_DAY')}
                                        isChecked={isCheckLeave}
                                    />
                                    <View style={CustomStyleSheet.maxWidth('90%')}>
                                        <VnrText
                                            // numberOfLines={1}
                                            style={[styleSheets.text, lebleCheckbox]}
                                            i18nKey={'TypeQuantity__E_LeaveDay'}
                                        />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styleOption}
                                    onPress={() => this.setCheckBoxFilter('E_OVERTIME')}
                                >
                                    <CheckBox
                                        checkBoxColor={Colors.grey}
                                        checkedCheckBoxColor={Colors.primary}
                                        onClick={() => this.setCheckBoxFilter('E_OVERTIME')}
                                        isChecked={isCheckOvertime}
                                    />
                                    <View style={CustomStyleSheet.maxWidth('90%')}>
                                        <VnrText
                                            style={[styleSheets.text, lebleCheckbox]}
                                            i18nKey={'HRM_Att_Overtime'}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                            <View style={styleTopItem}>
                                <TouchableOpacity
                                    style={styleOption}
                                    onPress={() => this.setCheckBoxFilter('E_BUSSINESSTRAVEL')}
                                >
                                    <CheckBox
                                        checkBoxColor={Colors.grey}
                                        checkedCheckBoxColor={Colors.primary}
                                        onClick={() => this.setCheckBoxFilter('E_BUSSINESSTRAVEL')}
                                        isChecked={isCheckBusiness}
                                    />
                                    <View style={CustomStyleSheet.maxWidth('90%')}>
                                        <VnrText style={[styleSheets.text, lebleCheckbox]} i18nKey={'TypeTripView'} />
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    style={styleOption}
                                    onPress={() => this.setCheckBoxFilter('E_ROSTER')}
                                >
                                    <CheckBox
                                        checkBoxColor={Colors.grey}
                                        checkedCheckBoxColor={Colors.primary}
                                        onClick={() => this.setCheckBoxFilter('E_ROSTER')}
                                        isChecked={ischeckRoster}
                                    />
                                    <View style={CustomStyleSheet.maxWidth('90%')}>
                                        <VnrText
                                            style={[styleSheets.text, lebleCheckbox]}
                                            i18nKey={'HRM_Attendance_Roster'}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {viewList}
                    </View>
                </SafeAreaView>
            )
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
    styleListOptionFilter: {
        height: 100,
        flexDirection: 'row',
        backgroundColor: Colors.white,
        //alignItems: 'flex-start',
        justifyContent: 'space-between',
        marginBottom: styleSheets.m_10,
        paddingHorizontal: 10
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
    },
    styleTopItem: {
        height: '100%',
        // flexDirection: 'row',
        borderRightColor: Colors.borderColor,
        // paddingHorizontal: styleSheets.p_10,
        alignItems: 'flex-start',
        justifyContent: 'space-around'
    },
    lebleCheckbox: {
        fontSize: Size.text + 2,
        marginHorizontal: styleSheets.m_5
    },
    styleOption: {
        flexDirection: 'row',
        alignItems: 'center',
        maxWidth: (Size.deviceWidth - 30) / 3
    }
});
