import React, { Component } from 'react';
import { SafeAreaView } from 'react-navigation';
import { styleSheets, styleScreenDetail, styleSafeAreaView, Size, Colors } from '../../../../../constants/styleConfig';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { IconMoreHorizontal } from '../../../../../constants/Icons';
import VnrText from '../../../../../components/VnrText/VnrText';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import { ConfigField } from '../../../../../assets/configProject/ConfigField';

const configDefault = [
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Att_Workday_Master_SalWorkDay',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalRealWorkdays',
        DisplayKey: 'HRM_Att_Workday_Master_ActualTotal',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalPaidLeaveDays',
        DisplayKey: 'HRM_Att_Workday_Master_PaidLeave',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalBusinessDayLeaveDays',
        DisplayKey: 'HRM_Att_Workday_Master_Total_BussinessLeave',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalHoliday',
        DisplayKey: 'HolidayType__E_HOLIDAY_HLD',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Att_Workday_Master_ForgeLeaveDays',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalForgeLeaveDays',
        DisplayKey: 'HRM_Att_Workday_Master_ForgeLeaveDays',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Att_Workday_Master_Not_SalWorkDay',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalUnPaidLeaveDays',
        DisplayKey: 'HRM_Att_Workday_Master_Total_UnPaidLeaveDays',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Att_Workday_Master_TotalOTPayroll',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalOvertimeHoursWorkday',
        DisplayKey: 'HRM_Att_Workday_Master_TotalOvertimeHoursWorkday',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalOvertimeHoursWeekend',
        DisplayKey: 'HRM_Att_Workday_Master_TotalOvertimeHoursWeekend',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalOvertimeHoursHoliday',
        DisplayKey: 'HRM_Att_Workday_Master_TotalOvertimeHoursHoliday',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Att_Workday_Master_TotalNightHours',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalNightHoursAndNightOvertime',
        DisplayKey: 'HRM_Att_Workday_Master_TotalNightHoursAndNightOvertime',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalOvertimeHoursNightWorkday',
        DisplayKey: 'HRM_Att_Workday_Master_TotalOvertimeHoursNightWorkday',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalOvertimeHoursNightWeekend',
        DisplayKey: 'HRM_Att_Workday_Master_TotalOvertimeHoursNightWeekend',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalOvertimeHoursNightHoliday',
        DisplayKey: 'HRM_Att_Workday_Master_TotalOvertimeHoursNightHoliday',
        DataType: 'string'
    },
    {
        TypeView: 'E_GROUP',
        DisplayKey: 'HRM_Att_Workday_Master_Total_LateEarlyDuration',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'TotalLateEarlyDuration3',
        DisplayKey: 'HRM_Att_Workday_Master_Total_LateEarlyDuration',
        DataType: 'string'
    }
];

export default class WorkDayV2ViewDetail extends Component {
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
                { screenName, dataId, dataItem } = typeof _params == 'object' ? _params : JSON.parse(_params),
                _configListDetail =
                    ConfigListDetail.value[screenName] != null ? ConfigListDetail.value[screenName] : configDefault;
            if (!Vnr_Function.CheckIsNullOrEmpty(dataId) || isReload) {
            } else if (!Vnr_Function.CheckIsNullOrEmpty(dataItem)) {
                this.setState({ configListDetail: _configListDetail, dataItem });
            } else {
                this.setState({ dataItem: 'EmptyData' });
            }
        } catch (error) {
            this.setState({ dataItem: 'EmptyData' });
        }
    };

    renderViewTopWorkDay = () => {
        const {
            TotalPaidWorkDays,
            TotalOTPayroll,
            TotalUnPaidWorkDays,
            StdWorkdayCount,
            TotalNightHoursAndNightOvertime,
            TotalForgeLeaveDays
        } = this.state.dataItem;

        // Có cấu hình ẩn field thì không hiển thị vùng master
        const _configField = ConfigField && ConfigField.value['Workday'] ? ConfigField.value['Workday']['Hidden'] : [];

        let isShowMasterData = _configField.findIndex(key => key == 'MasterData') > -1 ? false : true,
            isShowTotalPaidWorkDays = _configField.findIndex(key => key == 'TotalPaidWorkDays') > -1 ? false : true,
            isShowTotalForgeLeaveDays = _configField.findIndex(key => key == 'TotalForgeLeaveDays') > -1 ? false : true,
            isShowTotalOTPayroll = _configField.findIndex(key => key == 'TotalOTPayroll') > -1 ? false : true,
            isShowTotalUnPaidWorkDays = _configField.findIndex(key => key == 'TotalUnPaidWorkDays') > -1 ? false : true,
            isShowTotalNightHoursAndNightOvertime =
                _configField.findIndex(key => key == 'TotalNightHoursAndNightOvertime') > -1 ? false : true;

        return (
            <View style={styles.ViewTopWorkDay}>
                <View style={styles.styLeftAvatar}>
                    <Image
                        source={require('../../../../../assets/images/WorkdayIcon.png')}
                        style={styles.stySizeIcon}
                    />
                </View>
                <View style={styles.styBoxRight}>
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
    };

    componentDidMount() {
        this.getDataItem();
    }

    render() {
        const { dataItem, configListDetail } = this.state,
            { containerItemDetail } = styleScreenDetail;
        let contentViewDetail = <VnrLoading size={'large'} />;
        if (dataItem && configListDetail) {
            contentViewDetail = (
                <View style={styleSheets.container}>
                    {this.renderViewTopWorkDay()}
                    <ScrollView style={{ flexGrow: 1 }}>
                        <View style={containerItemDetail}>
                            {configListDetail.map(e => {
                                return Vnr_Function.formatStringTypeV2(dataItem, e);
                            })}
                        </View>
                    </ScrollView>
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

const styles = StyleSheet.create({
    ViewTopWorkDay: {
        width: '100%',
        flexDirection: 'row',
        paddingHorizontal: Size.defineSpace,
        paddingVertical: Size.defineHalfSpace
    },
    styLeftAvatar: {
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
        // fontWeight: '600',
        // color: Colors.gray_10
    },
    styboxValue: {
        // fontSize: Size.text + 2,
        fontWeight: '700',
        color: Colors.black,
        marginLeft: Size.defineSpace
    },
    styBox: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        marginBottom: 5
    }
});
