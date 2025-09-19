import React, { Component } from 'react';
import { View, StyleSheet, Platform, Image, TouchableOpacity, Text } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import {
    styleSheets,
    Size,
    Colors,
    stylesScreenDetailV2,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { Calendar } from '../../../../../components/calendars';
import moment from 'moment';
import AttendanceCalendarDetailList from './attendanceCalendarDetailList/AttendanceCalendarDetailList';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import { EnumTask, EnumName, EnumIcon, EnumStatus } from '../../../../../assets/constant';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import DrawerServices from '../../../../../utils/DrawerServices';
import { IconMoreHorizontal } from '../../../../../constants/Icons';
import VnrText from '../../../../../components/VnrText/VnrText';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import HttpService from '../../../../../utils/HttpService';
import Color from 'color';
import { translate } from '../../../../../i18n/translate';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import Vnr_Function from '../../../../../utils/Vnr_Function';

class AttendanceCalendarDetail extends Component {
    constructor(props) {
        super(props);
        this.state = {
            daySelected: moment(new Date()).format('YYYY-MM-DD'),
            currentMonth: null,
            dataFilter: null,
            isRefreshList: false,
            keyQuery: null,
            isOnUpdateInOut: false,
            dataItemForAddInOut: null,
            cutOffDurationByMonthYear: null,
            TotalAttendanceDetails: 0,
            TotalRealAttendanceDetails: 0,
            TotalOvertimeHours: 0,
            TotalLeaveBussinessdays: 0,
            TotalLeavedays: 0,
            refreshCalendarHeaderTotal: false,
            isLazyLoading: false,
            dataChange: false, //biến check dữ liệu có thay đổi hay không
            monthSelected: null,
            yearSelected: null
        };

        // set ListActions cho header options;
        if (
            PermissionForAppMobile &&
            PermissionForAppMobile.value['New_Attendance_ConfirmHistoryAttendanceTable_Portal'] &&
            PermissionForAppMobile.value['New_Attendance_ConfirmHistoryAttendanceTable_Portal']['View']
        ) {
            props.navigation.setParams({
                headerRight: (
                    <TouchableOpacity
                        style={CustomStyleSheet.marginRight(12)}
                        onPress={() =>
                            props.navigation.navigate('AttendanceCalenderDetailHistory', {
                                monthSelected: this.state.monthSelected
                                    ? this.state.monthSelected
                                    : parseInt(moment(new Date()).format('MM')),
                                yearSelected: this.state.yearSelected
                                    ? this.state.yearSelected
                                    : parseInt(moment(new Date()).format('YYYY'))
                            })
                        }
                    >
                        <View style={styleSheets.bnt_HeaderRight}>
                            <Text style={styles.styTextTitleWorkHistory}>{translate('HRM_Title_WorkHistory')}</Text>
                        </View>
                    </TouchableOpacity>
                )
            });
        }
    }

    GetCutOffDurationByMonthYear = (_dateString, _Month, _Year) => {
        // chay lazy loading
        startTask({
            keyTask: EnumTask.KT_AttendanceCalendarDetail,
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

        startTask({
            keyTask: EnumTask.KT_AttendanceCalendarDetail,
            payload: _payload
        });
    };

    onChangeMonth = (value) => {
        if (!value) {
            return;
        }
        // luu lai value thang hien tai
        this.setState(
            {
                currentMonth: value,
                daySelected: value.dateString,
                isRefreshList: !this.state.isRefreshList,
                keyQuery: EnumName.E_FILTER,
                monthSelected: value.month,
                yearSelected: value.year
            },
            () => {
                Vnr_Function.delay(() => {
                    this.GetCutOffDurationByMonthYear(value.dateString, value.month, value.year);
                }, 1500);
            }
        );
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == EnumTask.KT_AttendanceCalendarDetail) {
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
            { CutOffDurationID, CutOffDuration } = typeof params == 'object' ? params : JSON.parse(params);

        if (CutOffDurationID && CutOffDuration) {
            // Vào từ Notification
            return {
                CutOffDurationID: CutOffDurationID,
                daySelected: moment(CutOffDuration).format('YYYY-MM-DD')
            };
        } else {
            return {};
        }
    };

    reload = (isFilter) => {
        if (isFilter) {
            const { daySelected, isRefreshList } = this.state;
            const _paramsDefault = {
                Month: parseInt(moment(daySelected).format('MM')),
                Year: parseInt(moment(daySelected).format('YYYY'))
            };

            this.setState(
                {
                    isLoading: true,
                    isRefreshList: !isRefreshList,
                    keyQuery: EnumName.E_FILTER
                },
                () => {
                    startTask({
                        keyTask: EnumTask.KT_AttendanceCalendarDetail,
                        payload: {
                            ..._paramsDefault,
                            keyQuery: EnumName.E_FILTER,
                            isCompare: false,
                            reload: this.reload
                        }
                    });
                }
            );
        } else {
            // chay lazy loading
            let _paramsDefault = this.paramsDefault();
            let _keyQuery = _paramsDefault.daySelected ? EnumName.E_FILTER : EnumName.E_PRIMARY_DATA;
            this.setState(
                {
                    keyQuery: _keyQuery,
                    isRefreshList: _paramsDefault.daySelected ? !this.state.isRefreshList : this.state.isRefreshList,
                    daySelected: _paramsDefault.daySelected
                        ? _paramsDefault.daySelected
                        : moment(new Date()).format('YYYY-MM-DD')
                },
                () => {
                    startTask({
                        keyTask: EnumTask.KT_AttendanceCalendarDetail,
                        payload: {
                            ..._paramsDefault,
                            keyQuery: _keyQuery,
                            isCompare: true
                        }
                    });
                }
            );
        }
    };

    componentDidMount() {
        this.reload();
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

    hideModalUpdateInOut = () => {
        this.setState({ isOnUpdateInOut: false, dataItemForAddInOut: null });
    };

    renderViewTopWorkDay = () => {
        const { TotalDaysReceiveSalary, TotalOvertimeHours, TotalUnpaidLeaves } = this.state;

        return (
            <View style={styles.ViewTopWorkDay}>
                <View style={styles.styLeftAvatar}>
                    <Image
                        source={require('../../../../../assets/images/WorkdayIcon.png')}
                        style={styles.stySizeIcon}
                    />
                </View>
                <View style={styles.styBoxRight}>
                    <TouchableOpacity
                        style={styles.styBoxButtonDetail}
                        onPress={() => {
                            DrawerServices.navigate('AttendanceCalendarViewDetail', {
                                dataItem: this.state,
                                screenName: 'AttendanceCalendarDetail'
                            });
                        }}
                    >
                        <IconMoreHorizontal size={Size.iconSize} color={Colors.black} />
                    </TouchableOpacity>
                    {/* Tổng ngày công tính lương (ngày) */}
                    {TotalDaysReceiveSalary != null && (
                        <View style={styles.styBox}>
                            <View style={styles.styBoxLableView}>
                                <VnrText
                                    style={[styleSheets.lable, styles.styboxLable]}
                                    i18nKey={'HRM_Attendance_TabWorkdate_TotalWorkdatePayroll'}
                                    numberOfLines={1}
                                />
                            </View>
                            <View>
                                <Text style={[styleSheets.text, styles.styboxValue]}>
                                    {TotalDaysReceiveSalary ? Vnr_Function.mathRoundNumber(TotalDaysReceiveSalary) : 0}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Tổng giờ tăng ca */}
                    {TotalOvertimeHours != null && (
                        <View style={styles.styBox}>
                            <View style={styles.styBoxLableView}>
                                <VnrText
                                    style={[styleSheets.lable, styles.styboxLable]}
                                    i18nKey={'HRM_Attendance_CompensationDetail_OvertimeInMonth'}
                                    numberOfLines={1}
                                />
                            </View>
                            <View>
                                <Text style={[styleSheets.text, styles.styboxValue]}>
                                    {TotalOvertimeHours ? Vnr_Function.mathRoundNumber(TotalOvertimeHours) : 0}
                                </Text>
                            </View>
                        </View>
                    )}

                    {/* Tổng ngày không tính lương */}
                    {TotalUnpaidLeaves != null && (
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
                                    {TotalUnpaidLeaves ? Vnr_Function.mathRoundNumber(TotalUnpaidLeaves) : 0}
                                </Text>
                            </View>
                        </View>
                    )}
                </View>
            </View>
        );
    };

    approveAndReject = (isReject, reasonReject) => {
        const { ListAttendanceTableID } = this.state,
            dataBody = {
                recordID: ListAttendanceTableID ? ListAttendanceTableID.ID : null,
                isConfirm: false,
                isReject: isReject
            };

        if (!isReject) {
            dataBody.isConfirm = true;
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/UpdateStatusConfirmReject', dataBody).then((res) => {
                VnrLoadingSevices.hide();
                let actionStatus = res ? res[0] : false;

                if (
                    actionStatus &&
                    typeof actionStatus === 'string' &&
                    actionStatus.split('|')[1] === EnumName.E_Success
                ) {
                    this.reload(true);
                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                }
            });
        } else if (reasonReject) {
            // nhập lại lý do từ chối
            dataBody.reasonReject = reasonReject;
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/UpdateStatusConfirmReject', dataBody).then((res) => {
                VnrLoadingSevices.hide();
                let actionStatus = res ? res[0] : false;
                if (
                    actionStatus &&
                    typeof actionStatus === 'string' &&
                    actionStatus.split('|')[1] === EnumName.E_Success
                ) {
                    this.reload(true);
                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                } else if (res && res[0] && typeof res[0] == 'string') {
                    AlertSevice.alert({
                        iconType: EnumIcon.E_REJECT,
                        title: translate('HRM_Reason_PleaseEnterReject'),
                        message: res[0],
                        isInputText: true,
                        inputValue: reasonReject,
                        onCancel: () => {},
                        onConfirm: () => {}
                    });
                    // ToasterSevice.showError(res[0], 4000);
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                }
            });
        } else {
            AlertSevice.alert({
                iconType: EnumIcon.E_REJECT,
                title: translate('HRM_Reason_PleaseEnterReject'),
                isInputText: true,
                onCancel: () => {},
                onConfirm: (reason) => {
                    dataBody.reasonReject = reason;
                    VnrLoadingSevices.show();
                    HttpService.Post('[URI_HR]/Att_GetData/UpdateStatusConfirmReject', dataBody).then((res) => {
                        VnrLoadingSevices.hide();
                        let actionStatus = res ? res[0] : false;

                        if (
                            actionStatus &&
                            typeof actionStatus === 'string' &&
                            actionStatus.split('|')[1] === EnumName.E_Success
                        ) {
                            this.reload(true);
                            ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                        } else if (res && res[0] && typeof res[0] == 'string') {
                            AlertSevice.alert({
                                iconType: EnumIcon.E_REJECT,
                                title: translate('HRM_Reason_PleaseEnterReject'),
                                message: res[0],
                                isInputText: true,
                                inputValue: reason,
                                onCancel: () => {},
                                onConfirm: (reason) => {
                                    this.approveAndReject(isReject, reason);
                                }
                            });
                            // ToasterSevice.showError(res[0], 4000);
                        } else {
                            ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                        }
                    });
                }
            });
        }
    };

    convertTextToColor = (value) => {
        const [num1, num2, num3, opacity] = value.split(',');
        return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
    };

    render() {
        const {
            daySelected,
            dataFilter,
            isRefreshList,
            refreshCalendarHeaderTotal,
            ListAttendanceTableID,
            isLazyLoading,
            keyQuery,
            dataChange
        } = this.state;

        let isShowApprove = false,
            isShowReject = false;

        let colorStatusView = null,
            borderStatusView = null,
            bgStatusView = null,
            dataTime = null,
            textStatusView = '',
            valueItemStatus = {};

        // New_Personal_New_Attendance_New_Attendance7_btnConfirm
        // New_Personal_New_Attendance_New_Attendance7_btnReject
        if (ListAttendanceTableID) {
            if (ListAttendanceTableID.Status == null || ListAttendanceTableID.Status == EnumStatus.E_WAITING) {
                isShowApprove = true;
                isShowReject = true;
            } else if (ListAttendanceTableID.Status == EnumName.E_CONFIRM) {
                isShowApprove = false;
                isShowReject = false;
            } else if (ListAttendanceTableID.Status !== EnumStatus.E_REJECT) {
                isShowApprove = true;
            }

            if (
                PermissionForAppMobile &&
                PermissionForAppMobile.value['New_Personal_New_Attendance_New_Attendance7_btnConfirm'] &&
                PermissionForAppMobile.value['New_Personal_New_Attendance_New_Attendance7_btnConfirm']['View'] == false
            ) {
                isShowApprove = false;
            }

            if (
                PermissionForAppMobile &&
                PermissionForAppMobile.value['New_Personal_New_Attendance_New_Attendance7_btnReject'] &&
                PermissionForAppMobile.value['New_Personal_New_Attendance_New_Attendance7_btnReject']['View'] == false
            ) {
                isShowReject = false;
            }

            if (ListAttendanceTableID.Status == EnumName.E_CONFIRM) {
                dataTime = `${translate('HRM_Attendance_Overtime_WorkDateConfirm')}: ${moment(
                    ListAttendanceTableID.DateConfirm
                ).format('DD/MM/YYYY')}`;
                textStatusView = translate('HRM_Common_Confirm');

                valueItemStatus['colorStatus'] = this.convertTextToColor('39,194,76,1');
                valueItemStatus['borderStatus'] = this.convertTextToColor('39,194,76,0.5');
                valueItemStatus['bgStatus'] = this.convertTextToColor('39,194,76,0.04');
            } else if (ListAttendanceTableID.Status == EnumName.E_REJECT) {
                dataTime = `${translate('HRM_Attendance_Overtime_OvertimeList_DateReject')}: ${moment(
                    ListAttendanceTableID.DateReject
                ).format('DD/MM/YYYY')}`;
                textStatusView = translate('HRM_Common_Rejected');

                valueItemStatus['colorStatus'] = this.convertTextToColor('240,80,80,1');
                valueItemStatus['borderStatus'] = this.convertTextToColor('240,80,80,0.5');
                valueItemStatus['bgStatus'] = this.convertTextToColor('240,80,80,0.04');
            }

            const { colorStatus, borderStatus, bgStatus } = valueItemStatus;
            colorStatusView = colorStatus ? colorStatus : null;
            borderStatusView = borderStatus ? borderStatus : null;
            bgStatusView = bgStatus ? bgStatus : null;
        }

        let _paramsDefault = this.paramsDefault(),
            _keyQuery = keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA;

        if (_paramsDefault.CutOffDurationID) {
            _keyQuery = EnumName.E_FILTER;
        }
        let _rowAction = [];

        return (
            <SafeAreaView style={CustomStyleSheet.flex(1)} forceInset={{ top: 'never' }}>
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
                <View style={[styleSheets.container, { borderBottomColor: Colors.white }]}>
                    {dataVnrStorage.currentUser != null ? (
                        <AttendanceCalendarDetailList
                            setTotalWorkDay={this.setTotalWorkDay}
                            isLazyLoading={isLazyLoading}
                            isRefreshList={isRefreshList}
                            dataFilter={dataFilter}
                            keyDataLocal={EnumTask.KT_AttendanceCalendarDetail}
                            pullToRefresh={this.pullToRefresh}
                            keyQuery={_keyQuery}
                            dataChange={dataChange}
                            // keyDataLocal={'sdadada'}
                            // api={{
                            //   urlApi: '[URI_HR]/Att_GetData/GetDataAttendanceDetailPortalNewApp',
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

                <View style={styles.styDetailStatus}>
                    {ListAttendanceTableID && ListAttendanceTableID.Status == EnumName.E_REJECT && (
                        <View style={styles.styViewReason}>
                            <Text style={[styleSheets.lable, stylesScreenDetailV2.styTextLableInfo]}>
                                {`${translate('HRM_Attendance_Overtime_DeclineReason')}: `}
                            </Text>

                            <Text style={[styleSheets.text, styles.styValueTotal]}>
                                {ListAttendanceTableID.RejectReason ? ListAttendanceTableID.RejectReason : ''}
                            </Text>
                        </View>
                    )}

                    {ListAttendanceTableID &&
                        (ListAttendanceTableID.Status == EnumName.E_CONFIRM ||
                            ListAttendanceTableID.Status == EnumName.E_REJECT) && (
                        <View
                            style={[
                                stylesScreenDetailV2.styViewStatusColor,
                                styles.styViewStatus,
                                {
                                    borderColor: borderStatusView ? borderStatusView : Colors.gray_10,
                                    backgroundColor: bgStatusView ? bgStatusView : Colors.white
                                }
                            ]}
                        >
                            <Text
                                style={[
                                    styleSheets.text,
                                    colorStatusView !== null && {
                                        color: colorStatusView
                                    }
                                ]}
                            >
                                {textStatusView}
                            </Text>
                            {dataTime != null && (
                                <Text
                                    style={[
                                        styleSheets.text,
                                        stylesScreenDetailV2.styTextValueDateTimeStatus,
                                        colorStatusView !== null && {
                                            color: colorStatusView
                                        }
                                    ]}
                                >
                                    {dataTime}
                                </Text>
                            )}
                        </View>
                    )}

                    {(isShowApprove || isShowReject) && (
                        <View style={styles.styViewBtnBottom}>
                            {isShowApprove && (
                                <TouchableOpacity
                                    onPress={() => this.approveAndReject(false)}
                                    style={[styles.styBtnBottom, { backgroundColor: Colors.green }]}
                                >
                                    <VnrText
                                        style={[styleSheets.lable, styles.styBtnText]}
                                        i18nKey={'HRM_Common_Confirm'}
                                    />
                                </TouchableOpacity>
                            )}

                            {isShowReject && (
                                <TouchableOpacity
                                    onPress={() => this.approveAndReject(true)}
                                    style={[
                                        styles.styBtnBottom,
                                        { backgroundColor: Colors.orange, marginLeft: Size.defineHalfSpace }
                                    ]}
                                >
                                    <VnrText
                                        style={[styleSheets.lable, styles.styBtnText]}
                                        i18nKey={'HRM_Common_Reject'}
                                    />
                                </TouchableOpacity>
                            )}
                        </View>
                    )}
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
    styTextTitleWorkHistory: {
        color: Colors.DarkslateBlue,
        fontWeight: '700'
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
        alignItems: 'flex-end'
        // height: 20
    },
    styBoxLableView: {
        flex: 1
    },
    styViewReason: {
        flexDirection: 'row',
        marginBottom: Size.defineSpace,
        marginHorizontal: Size.defineSpace
    },
    styValueTotal: {
        color: Colors.gray_7,
        marginLeft: 3
    },
    styDetailStatus: {
        paddingTop: Size.defineHalfSpace
    },
    styViewStatus: {
        marginBottom: Size.defineSpace,
        marginTop: 0,
        marginHorizontal: Size.defineSpace
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
        marginBottom: 3
    },
    styViewBtnBottom: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'flex-end',
        paddingVertical: Size.defineSpace,
        paddingHorizontal: Size.defineSpace
    },
    styBtnBottom: {
        flex: 1,
        height: Size.heightButton,
        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'center',

        paddingHorizontal: Size.defineSpace,
        borderRadius: 7
    },
    styBtnText: {
        color: Colors.white,
        marginLeft: 4
    }
});

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(mapStateToProps, null)(AttendanceCalendarDetail);
