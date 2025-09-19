import moment from 'moment';
import React, { Component } from 'react';
import { View, TouchableOpacity, StyleSheet, Image, Text, FlatList, Platform } from 'react-native';
import { dataVnrStorage } from '../../assets/auth/authentication';
import { PermissionForAppMobile } from '../../assets/configProject/PermissionForAppMobile';
import { EnumIcon, EnumName, EnumStatus, EnumTask, ScreenName } from '../../assets/constant';
import { IconRadioCheck, IconRadioUnCheck } from '../../constants/Icons';
import { Size, styleSheets, Colors, CustomStyleSheet } from '../../constants/styleConfig';
import { startTask } from '../../factories/BackGroundTask';
import { getDataLocal } from '../../factories/LocalData';
import { translate } from '../../i18n/translate';
import DrawerServices from '../../utils/DrawerServices';
import VnrLoading from '../VnrLoading/VnrLoading';
import VnrMonthYear from '../VnrMonthYear/VnrMonthYear';
import VnrText from '../VnrText/VnrText';
import { connect } from 'react-redux';
import Vnr_Function from '../../utils/Vnr_Function';
import { AlertSevice } from '../Alert/Alert';
import ModalAddInOut from '../../scenes/modules/generalInfo/attInfo/workDay/ModalAddInOut';

const lisWeekName = {
    VN: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
    EN: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
};

class CalendarHome extends Component {
    constructor(props) {
        super(props);
        const permission = PermissionForAppMobile.value;

        this.state = {
            dataCalendar: [],
            isLoading: true,
            MonthStart: {
                value: new Date(), //'2022/05/01'
                refresh: false,
                disable: false,
                visibleConfig: true,
                visible: true
            },
            typeFilter: {
                value: EnumName.E_MISS_INOUT
            },
            isWatingAddOut: false, // tham số hiển thị modal bổ sung dữ liêu Out sau khi bổ sung In xong
            daySelected: moment(new Date()).format('YYYY-MM-DD'),
            currentMonth: null,
            dataFilter: null,
            isRefreshList: false,
            keyQuery: EnumName.E_PRIMARY_DATA,
            isOnUpdateInOut: false,
            dataItemForAddInOut: null,
            dataItemForAddInOutTemp: null,
            cutOffDurationByMonthYear: null,
            isLazyLoading: false,
            dataChange: false, //biến check dữ liệu có thay đổi hay khôngm
            messageCalendar: '',
            showHideGroup: {},
            //

            // if (
            //     permission['New_Att_TamScanLogRegister_New_Index_Portal'] &&
            //     permiss
            perSubmitLeaveday:
                permission &&
                permission['New_Att_Leaveday_New_Index_Portal'] &&
                permission['New_Att_Leaveday_New_Index_Portal']['Create'],
            perSubmitOvertime:
                permission &&
                permission['New_Att_Overtime_New_Index_Portal'] &&
                permission['New_Att_Overtime_New_Index_Portal']['Create'],
            perSubmitInOut:
                permission &&
                permission['New_Att_TamScanLogRegister_New_Index_Portal'] &&
                permission['New_Att_TamScanLogRegister_New_Index_Portal']['Create']
        };
    }

    onChangeMonth = value => {
        if (!value) {
            return;
        }
        const { MonthStart } = this.state;
        this.setState(
            {
                MonthStart: {
                    ...MonthStart,
                    value,
                    refresh: !MonthStart.refresh
                },
                isLoading: true,
                // currentMonth: value,
                // daySelected: value.dateString,
                isRefreshList: !this.state.isRefreshList,
                keyQuery: EnumName.E_FILTER
            },
            () => {
                startTask({
                    keyTask: EnumTask.KT_Workday,
                    payload: {
                        Month: moment(value).format('MM'),
                        Year: moment(value).format('YYYY'),
                        keyQuery: EnumName.E_FILTER
                    }
                });
            }
        );
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == EnumTask.KT_Workday) {
            //khi màn hình đang reload thì messsage phải là filter thì màn hình mới reload
            if (keyQuery === EnumName.E_FILTER && nextProps.message && keyQuery == nextProps.message.keyQuery) {
                this.remoteData(true);
            } else if (nextProps.message && keyQuery == nextProps.message.keyQuery) {
                // trường hợp không filter
                //console.log(nextProps, 'componentWillReceiveProps')
                if (!nextProps.message.dataChange) {
                    this.setState({
                        isLoadingHeader: false
                    });
                } else {
                    this.remoteData(true);
                }
            }
        }
    }

    paramsDefault = () => {
        return {};
    };

    componentDidMount() {
        const { MonthStart, keyQuery } = this.state;
        this.remoteData();
        startTask({
            keyTask: EnumTask.KT_Workday,
            payload: {
                // ..._paramsDefault,
                Month: parseInt(moment(MonthStart.value).format('MM')),
                Year: parseInt(moment(MonthStart.value).format('YYYY')),
                keyQuery: keyQuery,
                isCompare: true
            }
        });
    }

    reload = () => {
        const { MonthStart, keyQuery } = this.state;
        this.setState({
            isLoading: true
        });
        startTask({
            keyTask: EnumTask.KT_Workday,
            payload: {
                // ..._paramsDefault,
                Month: parseInt(moment(MonthStart.value).format('MM')),
                Year: parseInt(moment(MonthStart.value).format('YYYY')),
                keyQuery: keyQuery,
                isCompare: true
            }
        });
    };

    checkStatusList = (fieldStatus, data) => {
        let itemStatus = null;
        if (data && data.length > 0) {
            let checkIndexReject = data.findIndex(
                e => e[fieldStatus] == EnumStatus.E_REJECT || e[fieldStatus] == EnumStatus.E_REJECTED
            );
            if (checkIndexReject > -1) {
                itemStatus = data[checkIndexReject].itemStatus;
            } else {
                let checkIndexSubmit = data.findIndex(
                    e => e[fieldStatus] == EnumStatus.E_SUBMIT_TEMP || e[fieldStatus] == 'E_SUBMIT'
                );
                if (checkIndexSubmit > -1) {
                    itemStatus = data[checkIndexSubmit].itemStatus;
                } else {
                    let checkHaveApprove = true;
                    data.forEach(e => {
                        if (
                            e[fieldStatus] !== EnumStatus.E_APPROVE ||
                            e[fieldStatus] !== EnumStatus.E_APPROVED1 ||
                            e[fieldStatus] !== EnumStatus.E_APPROVED ||
                            e[fieldStatus] !== EnumStatus.E_APPROVED2 ||
                            e[fieldStatus] !== EnumStatus.E_APPROVED3 ||
                            e[fieldStatus] !== EnumStatus.E_FIRST_APPROVED
                        ) {
                            checkHaveApprove = false;
                        }
                    });
                    if (checkHaveApprove) {
                        itemStatus = data[0].itemStatus;
                    }
                }
            }
        }

        return itemStatus;
    };

    remoteData = isLazyLoading => {
        const { keyQuery, MonthStart } = this.state;
        if (keyQuery) {
            getDataLocal(EnumTask.KT_Workday)
                .then(resData => {
                    const res = resData && resData[keyQuery] ? resData[keyQuery] : null;

                    if (res && res != EnumName.E_EMPTYDATA && Array.isArray(res) && res.length > 0) {
                        let dataTemp = [];
                        let dataListTable = [];

                        let newListDates = [];
                        let dateEnd = moment(MonthStart.value)
                            .endOf('month')
                            .format('DD');
                        for (let index = 1; index <= parseFloat(dateEnd); index++) {
                            newListDates.push({
                                WorkDate: moment(MonthStart.value).date(index),
                                IsHaveNotShift: true,
                                isSelect: false
                            });
                        }

                        res.reverse().forEach(item => {
                            if (item.TitleWeek == null) {
                                // check có ca không
                                if (item.ShiftID == null) item.IsHaveNotShift = true;
                                else item.IsHaveNotShift = false;

                                // check missInout
                                if (
                                    item.ShiftID != null &&
                                    (item.Type == 'E_MISS_OUT' ||
                                        item.Type == 'E_MISS_IN' ||
                                        item.Type == 'E_MISS_IN_OUT') &&
                                    item.Type !== 'E_HOLIDAY'
                                )
                                    item.isMissInOut = true;
                                else item.isMissInOut = false;

                                // if (item.ListTamscanlogRegister && item.ListTamscanlogRegister.length > 0 && item.isMissInOut) {
                                //     item.itemStatus = this.checkStatusList('Status', item.ListTamscanlogRegister);
                                // }

                                // if (item.ListOvertime && item.ListOvertime.length > 0) {
                                //     item.itemStatus = this.checkStatusList('StatusOvertime', item.ListOvertime);
                                // }

                                // if (item.ListLeaveday && item.ListLeaveday.length > 0) {
                                //     item.itemStatus = this.checkStatusList('StatusLeave', item.ListLeaveday);
                                // }
                                let indexWorkdate = parseFloat(moment(item.WorkDate).format('DD')) - 1;

                                if (newListDates[indexWorkdate]) newListDates[indexWorkdate] = item;
                            }
                        });

                        dataListTable = newListDates; //dataListTable.reverse();

                        /// cộng thêm ngày của tháng trước
                        if (dataListTable.length > 0) {
                            let firstDay = dataListTable[0].WorkDate;

                            let checkDateOfWeek = moment(firstDay).day();

                            for (let i = 0; i < checkDateOfWeek; i++) {
                                dataTemp.push({});
                            }
                        }

                        this.setState({
                            // fullData: data,
                            messageCalendar: '',
                            dataCalendar: [...dataTemp, ...dataListTable],
                            isLoading: false,
                            refreshing: false,
                            footerLoading: false,
                            isLoadingHeader: isLazyLoading ? false : true
                        });
                    } else if (res == EnumName.E_EMPTYDATA || (Array.isArray(res) && res.length == 0)) {
                        this.setState({
                            fullData: [],
                            dataCalendar: EnumName.E_EMPTYDATA,
                            isLoading: false,
                            messageCalendar: '',
                            // refreshing: false,
                            //footerLoading: false,
                            isLoadingHeader: isLazyLoading ? false : true
                        });
                    }
                })
                .catch(error => {
                    // ToasterSevice.showError("HRM_Common_SendRequest_Error", 4000);
                    // this.setState({ isLoading: false, messageEmptyData: 'HRM_Common_SendRequest_Error' });
                    DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                });
        }
    };

    hideModalUpdateInOut = () => {
        this.setState({
            isOnUpdateInOut: false,
            dataItemForAddInOut: null
            // dataItemForAddInOutTemp: null
        });
    };

    showTypeName = text => {
        AlertSevice.alert({
            title: translate('HRM_Common_ViewMore'),
            iconType: EnumIcon.E_INFO,
            message: text,
            showConfirm: false,
            showCancel: false
        });
    };

    renderTamscanlogRegister = _listTamscanlogRegister => {
        return _listTamscanlogRegister.map((item, index) => {
            let colorStatusView = null,
                borderStatusView = null,
                bgStatusView = null;

            if (item.itemStatus) {
                const { colorStatus, borderStatus, bgStatus } = item.itemStatus;
                colorStatusView = colorStatus ? colorStatus : null;
                borderStatusView = borderStatus ? borderStatus : null;
                bgStatusView = bgStatus ? bgStatus : null;
            }

            return (
                <View style={styles.viewStatus} key={index}>
                    <View style={styles.styViewStatusRow}>
                        <View style={styles.dotSttTamscanlogRegister} />
                        <Text style={[styleSheets.textItalic, styles.txtRegister]}>
                            {item.TypeTamscanlogRegisterView}
                        </Text>
                    </View>

                    <View
                        style={styles.styViewStatusRow}
                    >
                        <Text style={[styleSheets.textItalic, styles.txtNameType]}>
                            {item.TimeLog ? moment(item.TimeLog).format('HH:mm') : ''}
                        </Text>

                        {/* <View style={[styles.styViewTextType]}>


                        <View />
                    </View> */}

                        <View
                            style={[
                                styles.styViewStatus,
                                {
                                    borderColor: borderStatusView
                                        ? Vnr_Function.convertTextToColor(borderStatusView)
                                        : Colors.gray_10,
                                    backgroundColor: bgStatusView
                                        ? Vnr_Function.convertTextToColor(bgStatusView)
                                        : Colors.white
                                }
                            ]}
                        >
                            <Text
                                style={[
                                    styleSheets.text,
                                    styles.txtStatus,
                                    {
                                        color: colorStatusView
                                            ? Vnr_Function.convertTextToColor(colorStatusView)
                                            : Colors.gray_10
                                    }
                                ]}
                                numberOfLines={1}
                            >
                                {item.StatusView}
                            </Text>
                        </View>
                    </View>
                </View>
            );
        });
    };

    renderListLeaveDay = _listLeaveDay => {
        return _listLeaveDay.map((item, index) => {
            let textTypeBusiness = '',
                textShowDetail = '',
                colorStatusView = null,
                borderStatusView = null,
                bgStatusView = null;

            if (item.itemStatus) {
                const { colorStatus, borderStatus, bgStatus } = item.itemStatus;
                colorStatusView = colorStatus ? colorStatus : null;
                borderStatusView = borderStatus ? borderStatus : null;
                bgStatusView = bgStatus ? bgStatus : null;
            }

            if (item.LeavedayTypeName) textTypeBusiness = `${item.LeavedayTypeName}`;

            textShowDetail = `${translate('HRM_PortalApp_Workday_LeaveDayType')} ${textTypeBusiness} ${
                item.LeaveDays ? Vnr_Function.mathRoundNumber(item.LeaveDays) : ''
            } ${translate('E_DAY_LOWERCASE')}`;

            return (
                <View style={styles.viewStatus} key={index}>
                    <View style={styles.dotSttLeaveDay} />

                    <View style={[styles.styViewTextType]}>
                        <Text style={[styleSheets.textItalic, styles.txtRegister]}>
                            {`${translate('AnnualLeaveDetailType__E_ANNUAL_LEAVE')}`}
                        </Text>

                        {item.LeavedayTypeCode ? (
                            <TouchableOpacity onPress={() => this.showTypeName(textShowDetail)}>
                                <Text style={[styleSheets.textItalic, styles.txtCodeType]}>
                                    {`${item.LeaveDays} ${item.LeavedayTypeCode}`}
                                </Text>
                            </TouchableOpacity>
                        ) : (
                            <View onPress={() => this.showTypeName(textShowDetail)}>
                                <Text style={[styleSheets.textItalic, styles.txtNameType]}>
                                    {`${textTypeBusiness} ${
                                        item.LeaveDays ? Vnr_Function.mathRoundNumber(item.LeaveDays) : ''
                                    } ${translate('E_DAY_LOWERCASE')}`}
                                </Text>
                            </View>
                        )}
                        <View />
                    </View>

                    <View
                        style={[
                            styles.styViewStatus,
                            {
                                borderColor: borderStatusView
                                    ? Vnr_Function.convertTextToColor(borderStatusView)
                                    : Colors.gray_10,
                                backgroundColor: bgStatusView
                                    ? Vnr_Function.convertTextToColor(bgStatusView)
                                    : Colors.white
                            }
                        ]}
                    >
                        <Text
                            style={[
                                styleSheets.text,
                                styles.txtStatus,
                                {
                                    color: colorStatusView
                                        ? Vnr_Function.convertTextToColor(colorStatusView)
                                        : Colors.gray_10
                                }
                            ]}
                            numberOfLines={1}
                        >
                            {item.StatusLeaveView}
                        </Text>
                    </View>
                </View>
            );
        });
    };

    renderListOvertime = _listOvertime => {
        let objGroup = {};
        _listOvertime.map(item => {
            if (item.GroupType) {
                if (objGroup[item.GroupType]) {
                    objGroup[item.GroupType].value += item.OvertimeHours;
                    objGroup[item.GroupType].data.push(item);
                } else {
                    objGroup[item.GroupType] = {
                        value: item.OvertimeHours,
                        data: [item],
                        isDisplay: false
                    };
                }
            }
        });

        // if (Object.keys(objGroup).length > 0) {
        //     return Object.keys(objGroup).map(key => {
        //         let keyTranslate = '',
        //             valueHoursGroup = objGroup[key] ? objGroup[key]['value'] : '0',
        //             dataGroup = objGroup[key] ? objGroup[key]['data'] : [],
        //             newKeyState = `${key}${valueHoursGroup}${moment(item.WorkDate).format('DDMMYYYYHHmmss')}`;
        //         console.log(newKeyState, showHideGroup, showHideGroup[`${newKeyState}`], 'showHideGroup')

        //         if (key === "E_WORKDAY") {
        //             keyTranslate = 'HRM_Att_Workday_Master_TotalOvertimeHoursWorkday';
        //         } else if (key === "E_WEEKEND") {
        //             keyTranslate = 'HRM_Att_Workday_Master_TotalOvertimeHoursWeekend';
        //         } else if (key === "E_HOLIDAY") {
        //             keyTranslate = 'HRM_Att_Workday_Master_TotalOvertimeHoursHoliday';
        //         }

        //         return (
        //             <View>
        //                 <View style={styles.viewStatus}>
        //                     <View style={styles.dotSttOvertime} />

        //                     <View style={[styles.styViewTextType]}>
        //                         <Text style={[styleSheets.textItalic, styles.txtRegister]}>
        //                             {`${translate('HRM_Att_WorkdaySummary_OT')}`}
        //                         </Text>

        //                         <View>
        //                             <Text style={[styleSheets.textItalic, styles.txtNameType]}>
        //                                 {`${valueHoursGroup} ${translate(keyTranslate)}`}
        //                             </Text>
        //                         </View>
        //                         <View />
        //                     </View>

        //                     {
        //                         showHideGroup[newKeyState] ? (
        //                             <TouchableOpacity
        //                                 style={[
        //                                     styles.styViewStatus,
        //                                     {
        //                                         borderColor: Colors.gray_8
        //                                     }
        //                                 ]}

        //                                 onPress={() => {
        //                                     this.setState({
        //                                         showHideGroup: {
        //                                             ...showHideGroup,
        //                                             [newKeyState]: false
        //                                         }
        //                                     }, () => {
        //                                         callBack && callBack()
        //                                     })
        //                                 }}
        //                             >
        //                                 <IconUp size={Size.iconSize - 4} color={Colors.gray_8} />
        //                             </TouchableOpacity>
        //                         )
        //                             : (
        //                                 <TouchableOpacity
        //                                     style={[
        //                                         styles.styViewStatus,
        //                                         {
        //                                             borderColor: Colors.gray_8
        //                                         }
        //                                     ]}

        //                                     onPress={() => {
        //                                         this.setState({
        //                                             showHideGroup: {
        //                                                 ...showHideGroup,
        //                                                 [newKeyState]: true
        //                                             }
        //                                         }, () => {
        //                                             callBack && callBack()
        //                                         })
        //                                     }}
        //                                 >
        //                                     <IconDown size={Size.iconSize - 4} color={Colors.gray_8} />
        //                                 </TouchableOpacity>
        //                             )
        //                     }

        //                 </View>
        //                 {/* <View style={{}}> */}
        //                 {
        //                     showHideGroup[newKeyState] && (
        //                         dataGroup.map(item => {
        //                             let colorStatusView = null,
        //                                 borderStatusView = null,
        //                                 bgStatusView = null;
        //                             if (item.itemStatus) {
        //                                 const { colorStatus, borderStatus, bgStatus } = item.itemStatus;
        //                                 colorStatusView = colorStatus ? colorStatus : null;
        //                                 borderStatusView = borderStatus ? borderStatus : null;
        //                                 bgStatusView = bgStatus ? bgStatus : null;
        //                             }

        //                             return (
        //                                 <View style={styles.viewStatusGroup}>
        //                                     <View style={styles.dotSttOvertime} />

        //                                     <View style={[styles.styViewTextType]}>
        //                                         <Text style={[styleSheets.textItalic, styles.txtRegister]}>
        //                                             {`${translate('HRM_Att_WorkdaySummary_OT')}`}
        //                                         </Text>

        //                                         <View>
        //                                             <Text style={[styleSheets.textItalic]}>
        //                                                 {`${item.OvertimeHours} ${item.OvertimeTypeName}`}
        //                                             </Text>
        //                                         </View>
        //                                         <View />
        //                                     </View>

        //                                     <View
        //                                         style={[
        //                                             styles.styViewStatus,
        //                                             {
        //                                                 borderColor: borderStatusView
        //                                                     ? Vnr_Function.convertTextToColor(borderStatusView)
        //                                                     : Colors.gray_10,
        //                                                 backgroundColor: bgStatusView
        //                                                     ? Vnr_Function.convertTextToColor(bgStatusView)
        //                                                     : Colors.white,
        //                                             },
        //                                         ]}>
        //                                         <Text
        //                                             style={[
        //                                                 styleSheets.text,
        //                                                 styles.txtStatus,
        //                                                 {
        //                                                     color: colorStatusView
        //                                                         ? Vnr_Function.convertTextToColor(colorStatusView)
        //                                                         : Colors.gray_10,
        //                                                 },
        //                                             ]}
        //                                             numberOfLines={1}>
        //                                             {item.StatusOvertimeView}
        //                                         </Text>
        //                                     </View>
        //                                 </View>
        //                             );
        //                         })
        //                     )
        //                 }
        //                 {/* </View> */}
        //             </View>
        //         );
        //     });
        // }
        // else {
        return _listOvertime.map((item, index) => {
            let textTypeBusiness = '',
                colorStatusView = null,
                borderStatusView = null,
                bgStatusView = null;

            if (item.itemStatus) {
                const { colorStatus, borderStatus, bgStatus } = item.itemStatus;
                colorStatusView = colorStatus ? colorStatus : null;
                borderStatusView = borderStatus ? borderStatus : null;
                bgStatusView = bgStatus ? bgStatus : null;
            }

            if (item.OvertimeTypeName) textTypeBusiness = `${item.OvertimeTypeName}`.toLowerCase();

            return (
                <View style={styles.viewStatus} key={index}>
                    <View style={styles.dotSttOvertime} />

                    <View style={styles.styViewTextType}>
                        <Text style={[styleSheets.textItalic, styles.txtRegister]}>
                            {`${translate('HRM_Att_Overtime')} ${textTypeBusiness} ${item.OvertimeHours} ${translate(
                                'E_IMPORT_FILE_HOUR'
                            )}`}
                        </Text>
                    </View>

                    <View
                        style={[
                            styles.styViewStatus,
                            {
                                borderColor: borderStatusView
                                    ? Vnr_Function.convertTextToColor(borderStatusView)
                                    : Colors.gray_10,
                                backgroundColor: bgStatusView
                                    ? Vnr_Function.convertTextToColor(bgStatusView)
                                    : Colors.white
                            }
                        ]}
                    >
                        <Text
                            style={[
                                styleSheets.text,
                                styles.txtStatus,
                                {
                                    color: colorStatusView
                                        ? Vnr_Function.convertTextToColor(colorStatusView)
                                        : Colors.gray_10
                                }
                            ]}
                            numberOfLines={1}
                        >
                            {item.StatusOvertimeView}
                        </Text>
                    </View>
                </View>
            );
        });
        // }
    };

    submitData = (enumType, item, typeInOrOut) => {
        const { perSubmitInOut, perSubmitLeaveday, perSubmitOvertime } = this.state;
        if (perSubmitLeaveday && enumType == EnumName.E_LEAVE_DAY && item) {
            DrawerServices.navigateForVersion(ScreenName.AttSubmitLeaveDayAddOrEdit, {
                workDayItem: { ...item },
                reload: this.refreshList,
                goBack: 'Home'
            });
        } else if (perSubmitOvertime && enumType == EnumName.E_OVERTIME) {
            DrawerServices.navigateForVersion(ScreenName.AttSubmitOvertimeAddOrEdit, {
                workDayItem: { ...item },
                reload: this.refreshList,
                goBack: 'Home'
            });
        } else if (enumType == EnumName.E_MISS_INOUT && perSubmitInOut) {
            // DrawerServices.navigateForVersion(ScreenName.AttSubmitTSLRegisterAddOrEdit, {
            //     workDayItem: {
            //         ...item,
            //         Type: typeInOrOut
            //     },
            //     goBack: 'Home',
            // });

            if (typeInOrOut == EnumName.E_INOUT)
                this.setState({
                    isOnUpdateInOut: true,
                    isWatingAddOut: true, // tham số hiển thị modal bổ sung dữ liêu Out sau khi bổ sung In xong
                    dataItemForAddInOut: {
                        ...item,
                        Type: EnumName.E_IN
                    },
                    dataItemForAddInOutTemp: {
                        ...item,
                        Type: EnumName.E_OUT
                    }
                });
            else
                this.setState({
                    isOnUpdateInOut: true,
                    isWatingAddOut: false, // tham số hiển thị modal bổ sung dữ liêu Out sau khi bổ sung In xong
                    dataItemForAddInOut: {
                        ...item,
                        Type: typeInOrOut
                    },
                    dataItemForAddInOutTemp: null
                });

            // actionSubmitInOut(item, typeInOrOut)
        }
    };

    refreshList = () => {
        const { isWatingAddOut, dataItemForAddInOutTemp } = this.state;
        if (isWatingAddOut) {
            this.setState(
                {
                    isOnUpdateInOut: true,
                    isWatingAddOut: false,
                    dataItemForAddInOut: {
                        ...{ ...dataItemForAddInOutTemp },
                        Type: EnumName.E_OUT
                    },
                    dataItemForAddInOutTemp: null
                },
                () => {
                    this.reload();
                }
            );
        } else {
            this.setState({ isLoading: true });
            this.reload();
        }
    };

    choseChangeShift = enumType => {
        let { dataCalendar, typeFilter } = this.state;

        if (dataCalendar == EnumName.E_EMPTYDATA || (Array.isArray(dataCalendar) && dataCalendar.length == 0)) return;

        if (enumType == typeFilter.value) return;

        dataCalendar = dataCalendar.map(item => {
            item.isSelect = false;
            return item;
        });

        this.setState({
            typeFilter: {
                value: enumType
            },
            messageCalendar: '',
            dataCalendar
        });
    };

    selectDateItem = (index, id) => {
        let { typeFilter, dataCalendar, perSubmitInOut, perSubmitLeaveday, perSubmitOvertime } = this.state,
            callBack = () => this.selectDateItem(index, id);

        dataCalendar = dataCalendar.map(item => {
            if (item.ID == id) item.isSelect = true;
            else item.isSelect = false;

            return item;
        });

        const item = dataCalendar[index];
        let messageCalendar = '',
            contentMessageSubmit = '';

        if (!item || (item && item.IsHaveNotShift)) return;

        if (typeFilter.value == EnumName.E_MISS_INOUT && item.isMissInOut) {
            let isMissIn = false,
                isMissOut = false;

            if (item.isSelect) {
                // (item.Type == 'E_MISS_OUT' || item.Type == 'E_MISS_IN' || item.Type == 'E_MISS_IN_OUT')

                if (item.Type == 'E_MISS_IN_OUT') {
                    isMissIn = true;
                    isMissOut = true;
                } else {
                    if (item.Type == 'E_MISS_IN' && item.ShiftID != null) {
                        isMissIn = true;
                    }

                    if (item.Type == 'E_MISS_OUT' && item.ShiftID != null) {
                        isMissOut = true;
                    }
                }

                if (isMissIn && item.ListTamscanlogRegister && item.ListTamscanlogRegister.length > 0) {
                    let indexCheckIn = item.ListTamscanlogRegister.findIndex(
                        e => e.TypeTamscanlogRegister == EnumName.E_IN
                    );
                    if (indexCheckIn > -1) isMissIn = false;
                }

                if (isMissOut && item.ListTamscanlogRegister && item.ListTamscanlogRegister.length > 0) {
                    let indexCheckOut = item.ListTamscanlogRegister.findIndex(
                        e => e.TypeTamscanlogRegister == EnumName.E_OUT
                    );
                    if (indexCheckOut > -1) isMissOut = false;
                }

                if (item.ListLeaveday && item.ListLeaveday.length > 0) {
                    let key = translate('HRM_PortalApp_Calendar_NextLeaveDay_AddInOut');
                    let textMessage = key.replace('E_WORKDAY', moment(item.WorkDate).format('DD/MM/YYYY'));
                    contentMessageSubmit = (
                        <View style={styles.styRowText}>
                            <Text style={[styleSheets.text, styles.styTextDetail]}>{textMessage}</Text>
                            {perSubmitInOut && (
                                <TouchableOpacity
                                    onPress={() => this.submitData(typeFilter.value, item, EnumName.E_IN)}
                                >
                                    <Text style={[styleSheets.text, styles.styTextDetailLink]}>
                                        {translate('E_IN_AT')}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {perSubmitInOut && (
                                <TouchableOpacity
                                    onPress={() => this.submitData(typeFilter.value, item, EnumName.E_OUT)}
                                >
                                    <Text
                                        style={[
                                            styleSheets.text,
                                            styles.styTextDetailLink,
                                            { marginLeft: Size.defineHalfSpace }
                                        ]}
                                    >
                                        {translate('E_OUT_AT')}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                } else if (isMissIn && isMissOut) {
                    let key = translate('HRM_PortalApp_Calendar_Miss_InOut');
                    let textMessage = key.replace('E_WORKDAY', moment(item.WorkDate).format('DD/MM/YYYY'));

                    contentMessageSubmit = (
                        <View style={styles.styRowText}>
                            <Text style={[styleSheets.text, styles.styTextDetail]}>{textMessage}</Text>
                            {perSubmitInOut && (
                                <TouchableOpacity
                                    onPress={() => this.submitData(typeFilter.value, item, EnumName.E_INOUT)}
                                >
                                    <Text style={[styleSheets.text, styles.styTextDetailLink]}>
                                        {translate('HRM_Common_Register')}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                } else if (isMissIn) {
                    let key = translate('HRM_PortalApp_Calendar_Miss_In');
                    let textMessage = key.replace('E_WORKDAY', moment(item.WorkDate).format('DD/MM/YYYY'));
                    contentMessageSubmit = (
                        <View style={styles.styRowText}>
                            <Text style={[styleSheets.text, styles.styTextDetail]}>{textMessage}</Text>
                            {perSubmitInOut && (
                                <TouchableOpacity
                                    onPress={() => this.submitData(typeFilter.value, item, EnumName.E_IN)}
                                >
                                    <Text style={[styleSheets.text, styles.styTextDetailLink]}>
                                        {translate('E_IN_AT')}
                                    </Text>
                                </TouchableOpacity>
                            )}
                            {/* <Text style={[styleSheets.text, styles.styTextDetailLink]}> {translate('E_OUT_AT')}</Text> */}
                        </View>
                    );
                } else if (isMissOut) {
                    let key = translate('HRM_PortalApp_Calendar_Miss_Out');
                    let textMessage = key.replace('E_WORKDAY', moment(item.WorkDate).format('DD/MM/YYYY'));
                    contentMessageSubmit = (
                        <View style={styles.styRowText}>
                            <Text style={[styleSheets.text, styles.styTextDetail]}>{textMessage}</Text>
                            {perSubmitInOut && (
                                <TouchableOpacity
                                    onPress={() => this.submitData(typeFilter.value, item, EnumName.E_OUT)}
                                >
                                    <Text style={[styleSheets.text, styles.styTextDetailLink]}>
                                        {translate('E_OUT_AT')}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                } else {
                    let key = translate('HRM_PortalApp_Calendar_Next_AddInOut');
                    let textMessage = key.replace('E_WORKDAY', moment(item.WorkDate).format('DD/MM/YYYY'));
                    contentMessageSubmit = (
                        <View style={styles.styRowText}>
                            <Text style={[styleSheets.text, styles.styTextDetail]}>{textMessage}</Text>
                            {perSubmitInOut && (
                                <TouchableOpacity
                                    onPress={() => this.submitData(typeFilter.value, item, EnumName.E_IN)}
                                >
                                    <Text style={[styleSheets.text, styles.styTextDetailLink]}>
                                        {translate('E_IN_AT')}
                                    </Text>
                                </TouchableOpacity>
                            )}

                            {perSubmitInOut && (
                                <TouchableOpacity
                                    onPress={() => this.submitData(typeFilter.value, item, EnumName.E_OUT)}
                                >
                                    <Text
                                        style={[
                                            styleSheets.text,
                                            styles.styTextDetailLink,
                                            { marginLeft: Size.defineHalfSpace }
                                        ]}
                                    >
                                        {translate('E_OUT_AT')}
                                    </Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    );
                }

                messageCalendar = (
                    <View style={styles.styViewDetail}>
                        {this.renderTamscanlogRegister(item.ListTamscanlogRegister)}
                        {this.renderListLeaveDay(item.ListLeaveday)}
                        {contentMessageSubmit}
                    </View>
                );
            }
        } else if (typeFilter.value == EnumName.E_OVERTIME) {
            if (item.isSelect) {
                if (item.ListOvertime && item.ListOvertime.length > 0) {
                    let key = translate('HRM_PortalApp_Calendar_Next_AddOvertime');
                    let textMessage = key.replace('E_WORKDAY', moment(item.WorkDate).format('DD/MM/YYYY'));

                    messageCalendar = (
                        <View style={styles.styViewDetail}>
                            {this.renderListOvertime(item.ListOvertime, item, callBack)}

                            <View style={styles.styRowText}>
                                <Text style={[styleSheets.text, styles.styTextDetail]}>{textMessage}</Text>
                                {perSubmitOvertime && (
                                    <TouchableOpacity onPress={() => this.submitData(typeFilter.value, item)}>
                                        <Text style={[styleSheets.text, styles.styTextDetailLink]}>
                                            {translate('HRM_Common_Register')}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                {/* {
                                    perSubmitOvertime && (
                                        <Text style={[styleSheets.text, styles.styTextDetailLink]}> {translate('HRM_Common_Register')}</Text>
                                    )
                                } */}
                            </View>
                        </View>
                    );
                } else {
                    let key = translate('HRM_PortalApp_Calendar_AddOvertime');
                    let textMessage = key.replace('E_WORKDAY', moment(item.WorkDate).format('DD/MM/YYYY'));
                    messageCalendar = (
                        <View style={styles.styViewDetail}>
                            <View style={styles.styRowText}>
                                <Text style={[styleSheets.text, styles.styTextDetail]}>{textMessage}</Text>

                                {perSubmitOvertime && (
                                    <TouchableOpacity onPress={() => this.submitData(typeFilter.value, item)}>
                                        <Text style={[styleSheets.text, styles.styTextDetailLink]}>
                                            {translate('HRM_Common_Register')}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                {/* {
                                    perSubmitOvertime && (
                                        <Text style={[styleSheets.text, styles.styTextDetailLink]}> {translate('HRM_Common_Register')}</Text>
                                    )
                                } */}
                            </View>
                        </View>
                    );
                }
            }
        } else if (typeFilter.value == EnumName.E_LEAVE_DAY) {
            let key = translate('HRM_PortalApp_Calendar_Next_AddLeaveDay');
            let textMessage = key.replace('E_WORKDAY', moment(item.WorkDate).format('DD/MM/YYYY'));

            if (item.isSelect) {
                if (item.ListLeaveday && item.ListLeaveday.length > 0) {
                    messageCalendar = (
                        <View style={styles.styViewDetail}>
                            {this.renderListLeaveDay(item.ListLeaveday)}
                            <View style={styles.styRowText}>
                                <Text style={[styleSheets.text, styles.styTextDetail]}>{textMessage}</Text>
                                {perSubmitLeaveday && (
                                    <TouchableOpacity onPress={() => this.submitData(typeFilter.value, item)}>
                                        <Text style={[styleSheets.text, styles.styTextDetailLink]}>
                                            {translate('HRM_Common_Register')}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                                {/* {

                                    perSubmitLeaveday && (
                                        <Text style={[styleSheets.text, styles.styTextDetailLink]}> {translate('HRM_Common_Register')}</Text>
                                    )
                                } */}
                            </View>
                        </View>
                    );
                } else {
                    let key = translate('HRM_PortalApp_Calendar_AddLeaveDay');
                    let textMessage = key.replace('E_WORKDAY', moment(item.WorkDate).format('DD/MM/YYYY'));
                    messageCalendar = (
                        <View style={styles.styViewDetail}>
                            <View style={styles.styRowText}>
                                <Text style={[styleSheets.text, styles.styTextDetail]}>{textMessage}</Text>

                                {perSubmitLeaveday && (
                                    <TouchableOpacity onPress={() => this.submitData(typeFilter.value, item)}>
                                        <Text style={[styleSheets.text, styles.styTextDetailLink]}>
                                            {translate('HRM_Common_Register')}
                                        </Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    );
                }
            }
        }

        this.setState({
            dataCalendar,
            messageCalendar: messageCalendar
        });
    };

    render() {
        const {
            MonthStart,
            dataCalendar,
            isLoading,
            typeFilter,
            messageCalendar,
            dataItemForAddInOut,
            isOnUpdateInOut
        } = this.state;

        let contentCalendar = <View />;

        if (isLoading) {
            contentCalendar = (
                <View style={styles.styContentEmpty}>
                    <VnrLoading size="large" isVisible={isLoading} />
                </View>
            );
        } else if (dataCalendar == EnumName.E_EMPTYDATA) {
            contentCalendar = (
                <View style={styles.styContentEmpty}>
                    <Image
                        source={require('../../assets/images/EmptyImage.png')}
                        style={styles.styImgEmpty}
                        resizeMode={'contain'}
                    />
                    <VnrText
                        i18nKey={'EmptyData'}
                        style={[styleSheets.text, styles.styTextPicker, CustomStyleSheet.textAlign('center')]}
                    />
                </View>
            );
        } else if (dataCalendar && dataCalendar.length > 0) {
            contentCalendar = (
                <FlatList
                    scrollEnabled={false}
                    style={{ backgroundColor: Colors.white }}
                    data={dataCalendar}
                    numColumns={7}
                    columnWrapperStyle={styles.styFlistContent}
                    renderItem={({ item, index }) => {
                        return item.WorkDate ? (
                            <TouchableOpacity
                                key={index}
                                style={styles.styViewListWrapItem}
                                onPress={() => this.selectDateItem(index, item.ID)}
                            >
                                <View
                                    style={[
                                        styles.styDateItemUnActive,
                                        typeFilter.value == EnumName.E_MISS_INOUT &&
                                            item.isMissInOut &&
                                            (!item.ListTamscanlogRegister ||
                                                (item.ListTamscanlogRegister &&
                                                    item.ListTamscanlogRegister.length == 0)) &&
                                            styles.styDateItemActiveMissInOut,
                                        typeFilter.value == EnumName.E_OVERTIME &&
                                            (item.ListOvertime && item.ListOvertime.length > 0) &&
                                            styles.styDateItemActiveOverTime,
                                        typeFilter.value == EnumName.E_LEAVE_DAY &&
                                            (item.ListLeaveday && item.ListLeaveday.length > 0) &&
                                            styles.styDateItemActiveLeaveday,
                                        item.isSelect && styles.styDateItemActive(typeFilter.value)
                                    ]}
                                >
                                    <Text
                                        style={[
                                            styleSheets.text,
                                            styles.styDateText,
                                            typeFilter.value == EnumName.E_MISS_INOUT &&
                                                item.isMissInOut &&
                                                ((item.ListTamscanlogRegister &&
                                                    item.ListTamscanlogRegister.length > 0) ||
                                                    (item.ListLeaveday && item.ListLeaveday.length > 0)) &&
                                                styles.styTextItemActiveMissInOut,
                                            item.isSelect && styles.styDateTextActive,
                                            item.IsHaveNotShift && styles.styDateHaveNotShift
                                            // item.IsHaveNotWorking && styles.styDateHaveNotWorking
                                        ]}
                                        numberOfLines={1}
                                    >
                                        {moment(item.WorkDate).format('DD')}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <View
                                key={index}
                                style={styles.styViewListWrapItem}
                                onPress={() => this.selectDateItem(index, item.ID)}
                            >
                                <View style={[styles.styDateItemUnActive, item.isSelect && styles.styDateItemActive]} />
                            </View>
                        );
                    }}
                    keyExtractor={(item, index) => {
                        return index;
                    }}
                />
            );
        }

        return (
            <View style={styles.container}>
                <View style={styles.styleView}>
                    <View style={styles.styleView_TitleGroup}>
                        <VnrText style={[styleSheets.text, styles.styleText]} i18nKey={'Ngày công'} />
                        <VnrText
                            style={[styleSheets.text, styles.styleTextTitle]}
                            i18nKey={'Chọn để lọc lại dữ liệu'}
                        />
                    </View>

                    <View style={styles.styleViewControl}>
                        <VnrMonthYear
                            response={'string'}
                            format={'MM/YYYY'}
                            value={MonthStart.value}
                            refresh={MonthStart.refresh}
                            type={'date'}
                            stylePicker={styles.styPicker}
                            styleTextPicker={styles.styTextPicker}
                            onFinish={value => this.onChangeMonth(value)}
                        />
                    </View>
                </View>

                <View style={styles.styContent}>
                    <View style={styles.styLeftCalendar}>
                        <View style={styles.styViewListWrap}>
                            {lisWeekName[dataVnrStorage.languageApp == 'EN' ? 'EN' : 'VN'].map((text, index) => (
                                <View style={styles.styViewListWeekItem} key={index}>
                                    <View style={styles.styWeekView}>
                                        <Text style={[styleSheets.text, styles.styWeekNameText]}>{text}</Text>
                                    </View>
                                </View>
                            ))}
                        </View>

                        {contentCalendar}
                    </View>
                    <View style={styles.styRightCalendar}>
                        <View style={styles.styTileFilter}>
                            <Text style={[styleSheets.lable, styles.styTextTitle]}>Bộ lọc</Text>
                        </View>

                        <View style={styles.styViewFilter}>
                            <TouchableOpacity
                                style={styles.styDotTypeItem}
                                onPress={() => this.choseChangeShift(EnumName.E_MISS_INOUT)}
                            >
                                <View style={styles.styDotType}>
                                    {typeFilter.value == EnumName.E_MISS_INOUT ? (
                                        <IconRadioCheck size={SIZE_ICON} color={Colors.orange} />
                                    ) : (
                                        <IconRadioUnCheck size={SIZE_ICON} color={Colors.orange} />
                                    )}
                                </View>
                                <VnrText style={[styleSheets.text, styles.styDotTypeLable]} i18nKey={'Thiếu inout'} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.styDotTypeItem}
                                onPress={() => this.choseChangeShift(EnumName.E_OVERTIME)}
                            >
                                <View style={styles.styDotType}>
                                    {typeFilter.value == EnumName.E_OVERTIME ? (
                                        <IconRadioCheck size={SIZE_ICON} color={Colors.red} />
                                    ) : (
                                        <IconRadioUnCheck size={SIZE_ICON} color={Colors.red} />
                                    )}
                                </View>
                                <VnrText style={[styleSheets.text, styles.styDotTypeLable]} i18nKey={'Tăng ca'} />
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={styles.styDotTypeItem}
                                onPress={() => this.choseChangeShift(EnumName.E_LEAVE_DAY)}
                            >
                                <View style={styles.styDotType}>
                                    {typeFilter.value == EnumName.E_LEAVE_DAY ? (
                                        <IconRadioCheck size={SIZE_ICON} color={Colors.purple} />
                                    ) : (
                                        <IconRadioUnCheck size={SIZE_ICON} color={Colors.purple} />
                                    )}
                                </View>
                                <VnrText style={[styleSheets.text, styles.styDotTypeLable]} i18nKey={'Ngày nghỉ'} />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                {messageCalendar != '' && messageCalendar}

                {dataItemForAddInOut && (
                    <ModalAddInOut
                        reload={this.refreshList}
                        workDayItem={dataItemForAddInOut}
                        isOnUpdateInOut={isOnUpdateInOut}
                        hideModalUpdateInOut={this.hideModalUpdateInOut}
                    />
                )}
            </View>
        );
    }
}

const WIDTH_LEFT_CALENDAR = (Size.deviceWidth - Size.defineSpace * 2) * 0.63,
    WIDTH_RIGHT_CALENDAR = (Size.deviceWidth - Size.defineSpace * 2) * 0.37,
    SIZE_ICON = Size.iconSize - 5;

const WIDTH_DATE = WIDTH_LEFT_CALENDAR / 7,
    WIDTH_DATE_CONTENT = WIDTH_DATE - 2;

const SIZE_TEXT = Size.text - 2;

const styles = StyleSheet.create({
    styFlistContent : {
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    styViewStatusRow: {
        flex: 4,
        justifyContent: 'flex-start',
        alignItems: 'center',
        flexDirection: 'row'
    },
    container: {
        minHeight: 200,
        width: Size.deviceWidth,
        marginTop: Size.defineSpace,
        backgroundColor: Colors.white,
        paddingHorizontal: Size.defineSpace,
        paddingBottom: Size.defineSpace
    },
    styContentEmpty: {
        minHeight: 150,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20
    },
    styContent: {
        flex: 1,
        flexDirection: 'row',
        paddingTop: Size.defineHalfSpace
    },
    styLeftCalendar: {
        width: WIDTH_LEFT_CALENDAR,
        marginLeft: -3
    },
    styRightCalendar: {
        width: WIDTH_RIGHT_CALENDAR,
        paddingLeft: Size.defineSpace
    },
    styViewListWrap: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap'
        // paddingTop: Size.defineHalfSpace,
    },
    styImgEmpty: {
        width: WIDTH_RIGHT_CALENDAR * 0.65,
        height: WIDTH_RIGHT_CALENDAR * 0.65,
        marginBottom: Size.defineHalfSpace
    },
    styViewListWeekItem: {
        flex: 1,
        // width: WIDTH_DATE,
        // height: WIDTH_DATE,
        alignItems: 'flex-start'
    },
    styleViewControl: {
        width: WIDTH_RIGHT_CALENDAR,
        alignSelf: 'flex-end'
    },
    styViewListWrapItem: {
        width: WIDTH_DATE,
        height: WIDTH_DATE,
        alignItems: 'center',
        paddingHorizontal: 2
    },
    styWeekNameText: {
        fontWeight: '600',
        color: Colors.gray_7,
        fontSize: SIZE_TEXT
    },
    styViewDetail: {
        marginTop: Size.defineHalfSpace
    },
    styRowText: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    styDateItemUnActive: {
        width: WIDTH_DATE_CONTENT,
        height: WIDTH_DATE_CONTENT,
        borderRadius: WIDTH_DATE_CONTENT / 2,
        justifyContent: 'center',
        alignItems: 'center',
        position: 'relative',
        borderWidth: 1,
        borderColor: Colors.white
    },
    styDateItemActive: enumType => {
        if (enumType == EnumName.E_MISS_INOUT) {
            return {
                backgroundColor: Colors.orange
            };
        } else if (enumType == EnumName.E_LEAVE_DAY) {
            return {
                backgroundColor: Colors.purple
            };
        } else if (enumType == EnumName.E_OVERTIME) {
            return {
                backgroundColor: Colors.red
            };
        }
    },
    styDateItemActiveMissInOut: {
        borderColor: Colors.orange
    },
    styTextItemActiveMissInOut: {
        color: Colors.orange
    },
    styDateItemActiveOverTime: {
        borderColor: Colors.red
    },
    styDateItemActiveLeaveday: {
        borderColor: Colors.purple
    },
    styDateText: {
        fontSize: SIZE_TEXT,
        color: Colors.black
    },
    styDateTextActive: {
        color: Colors.white
    },
    styDateHaveNotShift: {
        color: Colors.gray_7
    },
    styWeekView: {
        width: WIDTH_DATE,
        justifyContent: 'center',
        alignItems: 'center'
    },
    styTextDetail: {
        fontSize: SIZE_TEXT,
        color: Colors.black
    },
    styTextDetailLink: {
        fontSize: Size.text - 2,
        color: Colors.primary,
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        textDecorationColor: Colors.primary
    },
    dotSttTamscanlogRegister: {
        backgroundColor: Colors.orange,
        width: 8,
        height: 8,
        borderRadius: 4,
        marginRight: 7
    },
    styPicker: {
        height: Size.heightInput - 10
    },
    styTextPicker: {
        fontSize: Size.text - 3
    },
    styTextTitle: {
        fontSize: Size.text - 3
    },
    styTileFilter: {
        // height: WIDTH_DATE
    },
    styViewFilter: {
        justifyContent: 'flex-start'
    },

    //styles group
    styleView: {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    styleView_TitleGroup: {
        paddingVertical: Size.defineSpace,
        paddingBottom: 0
    },
    styleText: {
        textTransform: 'uppercase',
        color: Colors.primary,
        fontWeight: Platform.OS == 'android' ? '700' : '600',
        fontSize: Size.text + 3
    },
    styleTextTitle: {
        color: Colors.gray_7,
        fontWeight: Platform.OS == 'android' ? '400' : '600',
        fontSize: Size.text
    },

    // style ListLeaveDay , ListOvertime
    viewStatus: {
        flex: 1,
        // marginBottom: 3,
        // paddingHorizontal: Size.defineHalfSpace,
        paddingVertical: 5,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center'
        // backgroundColor: Colors.primary_transparent_8
    },
    styViewTextType: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        flexWrap: 'wrap'
    },
    styDotTypeItem: {
        marginTop: Size.defineHalfSpace,
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    styDotType: {
        marginRight: 5
    },
    styDotTypeLable: {
        fontSize: Size.text - 3
    },
    dotSttLeaveDay: {
        backgroundColor: Colors.purple,
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 7
        // marginTop: Size.text - 7,
    },
    dotSttOvertime: {
        backgroundColor: Colors.red,
        width: 6,
        height: 6,
        borderRadius: 3,
        marginRight: 7
        // marginBottom: Size.text - 5,
    },
    txtRegister: {
        fontSize: SIZE_TEXT,
        fontWeight: '500'
    },
    txtCodeType: {
        fontSize: SIZE_TEXT,
        fontWeight: '500',
        color: Colors.black,
        textDecorationLine: 'underline',
        textDecorationStyle: 'solid',
        textDecorationColor: Colors.black,
        paddingBottom: 2
    },
    txtNameType: {
        fontSize: SIZE_TEXT,
        fontWeight: '500',
        color: Colors.black
        //paddingBottom: 2
    },
    txtStatus: {
        fontWeight: '500',
        fontSize: SIZE_TEXT - 2,
        color: Colors.orange
    },
    styViewStatus: {
        marginLeft: 5,
        borderRadius: styleSheets.radius_5,
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: Colors.gray_5,
        paddingVertical: 1,
        paddingHorizontal: Size.defineHalfSpace - 3,
        justifyContent: 'flex-start'
    }
});

const mapStateToProps = state => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(
    mapStateToProps,
    null
)(CalendarHome);
