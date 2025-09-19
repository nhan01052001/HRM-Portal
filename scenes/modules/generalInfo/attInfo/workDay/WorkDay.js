import React, { Component } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Platform } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, Size, Colors, CustomStyleSheet } from '../../../../../constants/styleConfig';
import { Calendar } from '../../../../../components/calendars';
import DrawerServices from '../../../../../utils/DrawerServices';
import moment from 'moment';
import VnrText from '../../../../../components/VnrText/VnrText';
import WorkDayList from './workDayList/WorkDayList';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import ModalAddInOut from './ModalAddInOut';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import { EnumTask, EnumName } from '../../../../../assets/constant';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import { IconMoreHorizontal } from '../../../../../constants/Icons';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { translate } from '../../../../../i18n/translate';

class WorkDay extends Component {
    constructor(porps) {
        super(porps);
        this.state = {
            daySelected: moment(new Date()).format('YYYY-MM-DD'),
            currentMonth: null,
            dataFilter: null,
            isRefreshList: false,
            keyQuery: null,
            isOnUpdateInOut: false,
            dataItemForAddInOut: null,
            cutOffDurationByMonthYear: null,
            TotalWorkdays: 0,
            TotalRealWorkdays: 0,
            TotalOvertimeHours: 0,
            TotalLeaveBussinessdays: 0,
            TotalLeavedays: 0,
            refreshCalendarHeaderTotal: false,
            isLazyLoading: false,
            dataChange: false, //biến check dữ liệu có thay đổi hay không
            isMissingInoutFilter: false
        };
    }

    GetCutOffDurationByMonthYear = (_dateString, _Month, _Year) => {
        // chay lazy loading
        startTask({
            keyTask: EnumTask.KT_Workday,
            payload: {
                Month: _Month,
                Year: _Year,
                keyQuery: EnumName.E_FILTER
            }
        });
    };

    pullToRefresh = () => {
        const { currentMonth, keyQuery } = this.state,
            _payload = {
                Month: currentMonth && currentMonth.month ? currentMonth.month : null,
                Year: currentMonth && currentMonth.year ? currentMonth.year : null,
                keyQuery: keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA
            };

        this.setState(
            {
                isMissingInoutFilter: false,
                isRefreshList: !this.state.isRefreshList
            },
            () => {
                startTask({
                    keyTask: EnumTask.KT_Workday,
                    payload: _payload
                });
            }
        ); //
    };

    onChangeMonth = (value) => {
        if (!value) {
            return;
        }
        // luu lai value thang hien tai

        // this.setCurrentMonth(value);
        this.setState(
            {
                currentMonth: value,
                daySelected: value.dateString,
                isRefreshList: !this.state.isRefreshList,
                keyQuery: EnumName.E_FILTER
            },
            () => {
                this.GetCutOffDurationByMonthYear(value.dateString, value.month, value.year);
            }
        );
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == EnumTask.KT_Workday) {
            //khi màn hình đang reload thì messsage phải là filter thì màn hình mới reload
            if (keyQuery === EnumName.E_FILTER && nextProps.message && keyQuery == nextProps.message.keyQuery) {
                this.setState({
                    isLazyLoading: !this.state.isLazyLoading,
                    dataChange: nextProps.message.dataChange
                });
            } else if (nextProps.message && keyQuery == nextProps.message.keyQuery) {
                // trường hợp không filter
                this.setState({
                    isLazyLoading: !this.state.isLazyLoading,
                    dataChange: nextProps.message.dataChange
                });
            }
        }
    }

    paramsDefault = () => {
        const { params = {} } = this.props.navigation.state,
            { CutOffDurationID, CutOffDuration, businessType } =
                typeof params == 'object' ? params : JSON.parse(params);

        if (CutOffDurationID && CutOffDuration) {
            // Vào từ Notification
            return {
                businessType: businessType,
                CutOffDurationID: CutOffDurationID,
                daySelected: moment(CutOffDuration).format('YYYY-MM-DD')
            };
        } else {
            return {};
        }
    };

    componentDidMount() {
        // chay lazy loading
        let _paramsDefault = this.paramsDefault();
        let _keyQuery = _paramsDefault.daySelected ? EnumName.E_FILTER : EnumName.E_PRIMARY_DATA;
        this.setState(
            {
                keyQuery: _keyQuery,
                isRefreshList: _paramsDefault.daySelected ? !this.state.isRefreshList : this.state.isRefreshList,
                daySelected: _paramsDefault.daySelected
                    ? _paramsDefault.daySelected
                    : moment(new Date()).format('YYYY-MM-DD'),
                isMissingInoutFilter:
                    _paramsDefault.businessType && _paramsDefault.businessType == 'E_MISSING_IN_OUT_NOTAUTOCOMPUWORKDAY'
                        ? true
                        : false
            },
            () => {
                startTask({
                    keyTask: EnumTask.KT_Workday,
                    payload: {
                        ..._paramsDefault,
                        keyQuery: _keyQuery,
                        isCompare: true
                    }
                });
            }
        );
    }

    onSelectDay = (day) => {
        this.setState({
            currentMonth: day,
            daySelected: day.dateString,
            dataFilter: day.timestamp
        });
    };

    refreshList = () => {
        this.setState({ isRefreshList: !this.state.isRefreshList });
        this.pullToRefresh();
    };

    setTotalWorkDay = (data) => {
        let nextState = {
            ...data,
            refreshCalendarHeaderTotal: !this.state.refreshCalendarHeaderTotal
        };

        this.setState(nextState);
    };

    renderViewTopWorkDay = () => {
        const {
            TotalPaidWorkDays,
            TotalOTPayroll,
            TotalUnPaidWorkDays,
            StdWorkdayCount,
            TotalNightHoursAndNightOvertime,
            TotalForgeLeaveDays,
            isEmptyData
        } = this.state;
        // Có cấu hình ẩn field thì không hiển thị vùng master
        const _configField = ConfigField && ConfigField.value['Workday'] ? ConfigField.value['Workday']['Hidden'] : [];

        let isShowMasterData = _configField.findIndex((key) => key == 'MasterData') > -1 ? false : true,
            isShowWorkDayViewDetail = _configField.findIndex(key => key == 'ShowWorkDayViewDetail') > -1 ? false : true,
            isShowTotalUnPaidWorkDays =
                _configField.findIndex((key) => key == 'TotalUnPaidWorkDays') > -1 ? false : true,
            isShowTotalPaidWorkDays = _configField.findIndex((key) => key == 'TotalPaidWorkDays') > -1 ? false : true,
            isShowTotalForgeLeaveDays =
                _configField.findIndex((key) => key == 'TotalForgeLeaveDays') > -1 ? false : true,
            isShowTotalOTPayroll = _configField.findIndex((key) => key == 'TotalOTPayroll') > -1 ? false : true,
            isShowTotalNightHoursAndNightOvertime =
                _configField.findIndex((key) => key == 'TotalNightHoursAndNightOvertime') > -1 ? false : true;

        if (!isShowMasterData || isEmptyData) {
            return <View />;
        } else {
            return (
                <View style={styles.ViewTopWorkDay}>
                    <View style={styles.styLeftAvatar}>
                        <Image
                            source={require('../../../../../assets/images/WorkdayIcon.png')}
                            style={styles.stySizeIcon}
                        />
                    </View>
                    <View style={styles.styBoxRight}>
                        {
                            isShowWorkDayViewDetail && (
                                <TouchableOpacity
                                    style={styles.styBoxButtonDetail}
                                    onPress={() => {
                                        DrawerServices.navigate('WorkDayViewDetail', {
                                            dataItem: this.state,
                                            screenName: 'WorkDayMasterViewDetail'
                                        });
                                    }}
                                >
                                    <IconMoreHorizontal size={Size.iconSize} color={Colors.black} />
                                </TouchableOpacity>
                            )
                        }
                        {/* Công chuẩn (ngày) */}
                        {StdWorkdayCount != null && StdWorkdayCount > 0 && (
                            <View style={styles.styBox}>
                                <View style={styles.styBoxLableView}>
                                    <VnrText
                                        style={[styleSheets.lable, styles.styboxLable]}
                                        i18nKey={'HRM_Attendance_AttendanceTable_StdWorkDayCount'}
                                        numberOfLines={1}
                                    />
                                </View>
                                <View>
                                    <Text style={[styleSheets.text, styles.styboxValue]}>
                                        {StdWorkdayCount ? Vnr_Function.mathRoundNumber(StdWorkdayCount) : 0}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* Tổng ngày công tính lương */}
                        {TotalPaidWorkDays != null && TotalPaidWorkDays > 0 && isShowTotalPaidWorkDays && (
                            <View style={styles.styBox}>
                                <View style={styles.styBoxLableView}>
                                    <VnrText
                                        style={[styleSheets.lable, styles.styboxLable]}
                                        i18nKey={'HRM_Att_Workday_Master_SalWorkDay'}
                                        numberOfLines={1}
                                    />
                                </View>
                                <View>
                                    <Text style={[styleSheets.text, styles.styboxValue]}>
                                        {TotalPaidWorkDays ? Vnr_Function.mathRoundNumber(TotalPaidWorkDays) : 0}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* Tổng ngày nghỉ ngừng việc */}
                        {TotalForgeLeaveDays != null && TotalForgeLeaveDays > 0 && isShowTotalForgeLeaveDays && (
                            <View style={styles.styBox}>
                                <View style={styles.styBoxLableView}>
                                    <VnrText
                                        style={[styleSheets.lable, styles.styboxLable]}
                                        i18nKey={'HRM_Att_Workday_Master_ForgeLeaveDays'}
                                        numberOfLines={1}
                                    />
                                </View>
                                <View>
                                    <Text style={[styleSheets.text, styles.styboxValue]}>
                                        {TotalForgeLeaveDays ? Vnr_Function.mathRoundNumber(TotalForgeLeaveDays) : 0}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* Tổng OT tính lương */}
                        {TotalOTPayroll != null && TotalOTPayroll > 0 && isShowTotalOTPayroll && (
                            <View style={styles.styBox}>
                                <View style={styles.styBoxLableView}>
                                    <VnrText
                                        style={[styleSheets.lable, styles.styboxLable]}
                                        i18nKey={'HRM_Att_Workday_Master_TotalOTPayroll'}
                                        numberOfLines={1}
                                    />
                                </View>
                                <View>
                                    <Text style={[styleSheets.text, styles.styboxValue]}>
                                        {TotalOTPayroll ? Vnr_Function.mathRoundNumber(TotalOTPayroll) : 0}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* Tổng ngày không tính lương */}
                        {TotalUnPaidWorkDays != null && TotalUnPaidWorkDays > 0 && isShowTotalUnPaidWorkDays && (
                            <View style={styles.styBox}>
                                <View style={styles.styBoxLableView}>
                                    <VnrText
                                        style={[styleSheets.lable, styles.styboxLable]}
                                        i18nKey={'HRM_Att_Workday_Master_Not_SalWorkDay'}
                                        numberOfLines={1}
                                    />
                                </View>
                                <View>
                                    <Text style={[styleSheets.text, styles.styboxValue]}>
                                        {TotalUnPaidWorkDays ? Vnr_Function.mathRoundNumber(TotalUnPaidWorkDays) : 0}
                                    </Text>
                                </View>
                            </View>
                        )}

                        {/* Tổng công ca đêm */}
                        {TotalNightHoursAndNightOvertime != null &&
                            TotalNightHoursAndNightOvertime > 0 &&
                            isShowTotalNightHoursAndNightOvertime && (
                            <View style={styles.styBox}>
                                <View style={styles.styBoxLableView}>
                                    <VnrText
                                        style={[styleSheets.lable, styles.styboxLable]}
                                        i18nKey={'HRM_Att_Workday_Master_TotalNightHoursAndNightOvertime'}
                                        numberOfLines={1}
                                    />
                                </View>
                                <View>
                                    <Text style={[styleSheets.text, styles.styboxValue]}>
                                        {TotalNightHoursAndNightOvertime
                                            ? Vnr_Function.mathRoundNumber(TotalNightHoursAndNightOvertime)
                                            : 0}
                                    </Text>
                                </View>
                            </View>
                        )}
                    </View>
                </View>
            );
        }
    };

    hideModalUpdateInOut = () => {
        this.setState({ isOnUpdateInOut: false, dataItemForAddInOut: null });
    };

    render() {
        const {
            daySelected,
            dataFilter,
            isRefreshList,
            refreshCalendarHeaderTotal,
            dataItemForAddInOut,
            isOnUpdateInOut,
            isLazyLoading,
            keyQuery,
            dataChange,
            isMissingInoutFilter
        } = this.state;
        let _paramsDefault = this.paramsDefault(),
            _keyQuery = keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA;

        if (_paramsDefault.CutOffDurationID) {
            _keyQuery = EnumName.E_FILTER;
        }

        let _rowAction = [];
        if (PermissionForAppMobile && PermissionForAppMobile.value) {
            const permission = PermissionForAppMobile.value;

            if (
                permission['New_Att_Leaveday_New_Index_WorkDay_btnCreate'] &&
                permission['New_Att_Leaveday_New_Index_WorkDay_btnCreate']['View']
            ) {
                _rowAction = [
                    {
                        ..._rowAction,
                        type: 'E_LEAVEDAY',
                        title: translate('HRM_LeaveDayRegister'),
                        isSheet: false,
                        onPress: (item) => {
                            DrawerServices.navigate('AttSubmitLeaveDayAddOrEdit', {
                                workDayItem: { ...item },
                                reload: this.refreshList,
                                goBack: 'WorkDay'
                            });
                        }
                    }
                ];
            }

            if (
                permission['New_Att_Overtime_New_Index_WorkDay_btnCreate'] &&
                permission['New_Att_Overtime_New_Index_WorkDay_btnCreate']['View']
            ) {
                _rowAction = [
                    ..._rowAction,
                    {
                        type: 'E_OVERTIME',
                        title: translate('HRM_OvertimeRegister'),
                        isSheet: false,
                        onPress: (item) => {
                            DrawerServices.navigate('AttSubmitOvertimeAddOrEdit', {
                                workDayItem: { ...item },
                                reload: this.refreshList,
                                goBack: 'WorkDay'
                            });
                        }
                    }
                ];
            }

            if (
                permission['New_Att_TamScanLogRegister_New_Index_WorkDay_btnCreate'] &&
                permission['New_Att_TamScanLogRegister_New_Index_WorkDay_btnCreate']['View']
            ) {
                _rowAction = [
                    ..._rowAction,
                    {
                        type: 'E_INOUT',
                        title: translate('HRM_AddInOut'),
                        isSheet: false,
                        onPress: (item) => {
                            // DrawerServices.navigate('AttSubmitTSLRegisterAddOrEdit', {
                            //   workDayItem: { ...item },
                            //   reload: this.refreshList,
                            //   goBack: 'WorkDay',
                            // });
                            this.setState({ isOnUpdateInOut: true, dataItemForAddInOut: item });
                        }
                    }
                ];
            }

            if (
                permission['New_Att_LateEarlyAllowed_New_Index_WorkDay_btnCreate'] &&
                permission['New_Att_LateEarlyAllowed_New_Index_WorkDay_btnCreate']['View']
            ) {
                _rowAction = [
                    ..._rowAction,
                    {
                        type: EnumName.E_EARLYALLOWED,
                        title: translate('HRM_PortalApp_Add_LateEarlyAllowed'),
                        isSheet: false,
                        onPress: (item) => {
                            DrawerServices.navigate('AttSubmitLateEarlyAllowedAddOrEdit', {
                                workDayItem: { ...item },
                                reload: this.refreshList,
                                goBack: 'WorkDay'
                            });
                        }
                    }
                ];
            }
        }

        return (
            <SafeAreaView style={CustomStyleSheet.flex(1)} forceInset={{ top: 'never' }}>
                <View style={styleSheets.containerGrey}>
                    <Calendar
                        //onPressHideAll={() => this.onChangeMonth(this.getCurrentMonth())}
                        // autoClose={fa}
                        headerStyle={styles.styHeaderCalendar}
                        viewTopWorkDay={this.renderViewTopWorkDay}
                        refreshCalendarHeaderTotal={refreshCalendarHeaderTotal}
                        refreshList={this.refreshList}
                        current={daySelected}
                        markedDates={{ [daySelected]: { selected: true } }}
                        onDayPress={(day) => this.onSelectDay(day)}
                        monthFormat={'MM-yyyy'}
                        firstDay={1}
                        onMonthChange={(dataValue) => this.onChangeMonth(dataValue)}
                        onlyMonth={true}
                    />
                    <View style={[styleSheets.col_10, styles.styViewBorder]}>
                        {dataVnrStorage.currentUser != null ? (
                            <WorkDayList
                                setTotalWorkDay={this.setTotalWorkDay}
                                isLazyLoading={isLazyLoading}
                                isRefreshList={isRefreshList}
                                dataFilter={dataFilter}
                                keyDataLocal={EnumTask.KT_Workday}
                                pullToRefresh={this.pullToRefresh}
                                keyQuery={_keyQuery}
                                dataChange={dataChange}
                                isMissingInoutFilter={isMissingInoutFilter}
                                // keyDataLocal={'sdadada'}
                                // api={{
                                //   urlApi: '[URI_HR]/Att_GetData/GetDataWorkdayPortalNewApp',
                                //   type: 'E_GET',
                                //   dataBody: {
                                //     ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                                //     CutOffDurationID: cutOffDurationByMonthYear,
                                //   },
                                // }}
                                rowActions={[..._rowAction]}
                                valueField="ID"
                            />
                        ) : (
                            <VnrLoading size="large" isVisible={true} />
                        )}
                    </View>

                    {dataItemForAddInOut && dataItemForAddInOut && (
                        <ModalAddInOut
                            reload={this.refreshList}
                            workDayItem={dataItemForAddInOut}
                            isOnUpdateInOut={isOnUpdateInOut}
                            hideModalUpdateInOut={this.hideModalUpdateInOut}
                        />
                    )}
                </View>
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    styViewBorder: {
        borderTopColor: Colors.borderColor,
        borderTopWidth: 1
    },
    styHeaderCalendar: {
        backgroundColor: Colors.white,
        paddingVertical: 5
    },
    ViewTopWorkDay: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: Size.defineSpace,
        paddingBottom: 5
    },
    styLeftAvatar: {
        marginTop: 27,
        justifyContent: 'center',
        marginRight: Size.defineSpace
    },
    stySizeIcon: {
        width: Size.deviceWidth * 0.15,
        height: Size.deviceWidth * 0.15,
        maxWidth: 100,
        maxHeight: 100
    },
    styBoxRight: {
        flex: 1,
        justifyContent: 'center'
    },
    styBoxButtonDetail: {
        alignItems: 'flex-end',
        height: 27
    },
    styBoxLableView: {
        flex: 1
    },
    styboxLable: {
        // fontSize: Size.text + 1,
        // fontWeight: Platform.OS =='ios' ? '500' : '600',
        // color: Colors.gray_10
    },
    styboxValue: {
        // fontSize: Size.text + 2,
        fontWeight: Platform.OS == 'ios' ? '600' : '700',
        color: Colors.black,
        marginLeft: Size.defineSpace
    },
    styBox: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 5
    }
});

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(mapStateToProps, null)(WorkDay);
