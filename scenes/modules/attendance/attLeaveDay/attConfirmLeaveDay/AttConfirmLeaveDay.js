import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import moment from 'moment';
import VnrText from '../../../../../components/VnrText/VnrText';
import {
    Size,
    styleSheets,
    styleSafeAreaView,
    Colors,
    stylesScreenDetailV2,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import { dataVnrStorage } from '../../../../../assets/auth/authentication';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import VnrLoading from '../../../../../components/VnrLoading/VnrLoading';
import VnrYearPicker from '../../../../../components/VnrYearPicker/VnrYearPicker';
import VnrIndeterminate from '../../../../../components/VnrLoading/VnrIndeterminate';
import { translate } from '../../../../../i18n/translate';
import { connect } from 'react-redux';
import { EnumTask, EnumName, EnumIcon } from '../../../../../assets/constant';
import { startTask } from '../../../../../factories/BackGroundTask';
import { getDataLocal } from '../../../../../factories/LocalData';
import HttpService from '../../../../../utils/HttpService';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import { ToasterSevice } from '../../../../../components/Toaster/Toaster';
import { AlertSevice } from '../../../../../components/Alert/Alert';
import Color from 'color';
import DrawerServices from '../../../../../utils/DrawerServices';

class AttConfirmLeaveDay extends Component {
    constructor(porps) {
        super(porps);

        this.state = {
            isLoading: true,
            dataGeneral: null,
            yearSelected: new Date().getFullYear(),
            isLoadingHeader: true,
            keyQuery: EnumName.E_PRIMARY_DATA,
            refreshing: false,
            dataRemainLeaveDays: null
            // isLoadingList: false,
        };
    }

    onSubmitYear = data => {
        const dataBody = {
            profileID: dataVnrStorage.currentUser.info.ProfileID,
            year: data.year
        };

        this.setState(
            {
                isLoading: true,
                yearSelected: data.year,
                keyQuery: EnumName.E_FILTER
            },
            () => {
                startTask({
                    keyTask: EnumTask.KT_AttConfirmLeaveDay,
                    payload: {
                        ...dataBody,
                        keyQuery: EnumName.E_FILTER,
                        isCompare: false,
                        reload: this.getDataGeneral
                    }
                });
            }
        );
    };

    reload = isFilter => {
        if (isFilter) {
            const { yearSelected } = this.state;
            const dataBody = {
                profileID: dataVnrStorage.currentUser.info.ProfileID,
                year: yearSelected
            };

            this.setState(
                {
                    isLoading: true,
                    keyQuery: EnumName.E_FILTER
                },
                () => {
                    startTask({
                        keyTask: EnumTask.KT_AttConfirmLeaveDay,
                        payload: {
                            ...dataBody,
                            keyQuery: EnumName.E_FILTER,
                            isCompare: false,
                            reload: this.getDataGeneral
                        }
                    });
                }
            );
        } else {
            this.getDataGeneral();
            startTask({
                keyTask: EnumTask.KT_AttConfirmLeaveDay,
                payload: {
                    keyQuery: EnumName.E_PRIMARY_DATA,
                    isCompare: true,
                    reload: this.getDataGeneral
                }
            });
        }
    };

    getDataGeneral = isLazyLoading => {
        const { keyQuery, yearSelected } = this.state;

        getDataLocal(EnumTask.KT_AttConfirmLeaveDay).then(resData => {
            const res = resData && resData[keyQuery] ? resData[keyQuery] : null;
            let data = res.Data;
            if (data && data !== EnumName.E_EMPTYDATA && data.length > 0) {
                const objData = {};
                data.map(item => {
                    item.TotalLeavedayInMonthView = `${
                        item.TotalLeavedayInMonth != null ? Vnr_Function.mathRoundNumber(item.TotalLeavedayInMonth) : ''
                    } ${translate('E_DAY_LOWERCASE')}`;
                    if (objData[item.LeaveDayTypeID]) {
                        let itemValue = objData[item.LeaveDayTypeID];
                        itemValue.total += item.TotalLeavedayInMonth != null ? item.TotalLeavedayInMonth : 0;
                        itemValue.list.push(item);
                    } else {
                        objData[item.LeaveDayTypeID] = {
                            total: item.TotalLeavedayInMonth != null ? item.TotalLeavedayInMonth : 0,
                            list: [item],
                            lableGroup: item.LeaveDayTypeName,
                            status: item.Status,
                            statusView: item.StatusView,
                            dateReject: item.DateRejectLeaveday,
                            dataConfirm: item.DateConfirmLeaveday,
                            reasonReject: item.RejectReason
                        };
                    }
                });

                this.setState(
                    {
                        dataGeneral: objData,
                        isLoading: false,
                        isLoadingHeader: isLazyLoading ? false : true,
                        refreshing: false
                    },
                    () => {
                        this.getRemainLeaveDays({
                            ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                            year: yearSelected,
                            listLeaveDayTypeID: Object.keys(objData)
                        });
                    }
                );
            } else {
                this.setState({
                    dataGeneral: EnumName.E_EMPTYDATA,
                    isLoading: false,
                    isLoadingHeader: isLazyLoading ? false : true,
                    refreshing: false
                });
            }
        });
    };

    _renderHeaderLoading = () => {
        return <VnrIndeterminate isVisible={this.state.isLoadingHeader} />;
    };

    _handleRefresh = () => {
        const dataBody = {
            profileID: dataVnrStorage.currentUser.info.ProfileID,
            year: this.state.yearSelected
        };

        this.setState(
            {
                refreshing: true,
                keyQuery: EnumName.E_FILTER
            },
            () => {
                startTask({
                    keyTask: EnumTask.KT_AttConfirmLeaveDay,
                    payload: {
                        ...dataBody,
                        keyQuery: EnumName.E_FILTER,
                        isCompare: false,
                        reload: this.getDataGeneral
                    }
                });
            }
        );
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;

        if (nextProps.reloadScreenName == EnumTask.KT_AttConfirmLeaveDay) {
            //khi màn hình đang reload thì messsage phải là filter thì màn hình mới reload
            if (keyQuery === EnumName.E_FILTER && nextProps.message && keyQuery == nextProps.message.keyQuery) {
                this.getDataGeneral(true);
            } else if (nextProps.message && keyQuery == nextProps.message.keyQuery) {
                // dataChange == true ? khác : giống nhau
                if (!nextProps.message.dataChange) {
                    this.setState({
                        isLoadingHeader: false
                    });
                } else {
                    this.getDataGeneral(true);
                }
            }
        }
    }

    componentDidMount() {
        this.reload();
    }

    approveAndReject = (isReject, leaveDayTypeID, reasonReject) => {
        const { yearSelected, dataGeneral } = this.state,
            dataBody = {
                ProfileID: dataVnrStorage.currentUser.info.ProfileID,
                Year: yearSelected,
                isConfirm: false,
                isReject: isReject,
                LeaveDayTypeID: leaveDayTypeID ? leaveDayTypeID : Object.keys(dataGeneral).join()
            };

        if (!isReject) {
            dataBody.isConfirm = true;
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/UpdateConfirmRejectByLeaveDayTypeID', dataBody).then(res => {
                VnrLoadingSevices.hide();
                if (res && res[0] && res[0] === EnumName.E_Success) {
                    this.reload(true);
                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                } else {
                    ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                }
            });
        } else if (reasonReject) {
            // nhập lại lý do từ chối
            dataBody.rejectReason = reasonReject;
            VnrLoadingSevices.show();
            HttpService.Post('[URI_HR]/Att_GetData/UpdateConfirmRejectByLeaveDayTypeID', dataBody).then(res => {
                VnrLoadingSevices.hide();
                if (res && res[0] && res[0] === EnumName.E_Success) {
                    this.reload(true);
                    ToasterSevice.showSuccess('Hrm_Succeed', 4000);
                } else if (res && res[0] && typeof res[0] == 'string') {
                    AlertSevice.alert({
                        iconType: EnumIcon.E_REJECT,
                        title: translate('HRM_Reason_PleaseEnterReject'),
                        message: res[0],
                        isInputText: true,
                        inputValue: dataBody.rejectReason,
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
                onConfirm: reason => {
                    dataBody.rejectReason = reason;
                    VnrLoadingSevices.show();
                    HttpService.Post('[URI_HR]/Att_GetData/UpdateConfirmRejectByLeaveDayTypeID', dataBody).then(
                        res => {
                            VnrLoadingSevices.hide();
                            if (res && res[0] && res[0] === EnumName.E_Success) {
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
                                    onConfirm: reason => {
                                        this.approveAndReject(isReject, leaveDayTypeID, reason);
                                    }
                                });
                                // ToasterSevice.showError(res[0], 4000);
                            } else {
                                ToasterSevice.showError('HRM_Common_SendRequest_Error', 4000);
                            }
                        }
                    );
                }
            });
        }
    };

    convertTextToColor = value => {
        const [num1, num2, num3, opacity] = value.split(',');
        return Color.rgb(parseFloat(num1), parseFloat(num2), parseFloat(num3), parseFloat(opacity));
    };

    getRemainLeaveDays = dataBody => {
        if (
            dataBody.listLeaveDayTypeID &&
            Array.isArray(dataBody.listLeaveDayTypeID) &&
            dataBody.listLeaveDayTypeID.length > 0
        ) {
            let rs = [];
            dataBody.listLeaveDayTypeID.map((item, index) => {
                HttpService.Get(
                    `[URI_HR]/Att_GetData/GetRemainByType?ProfileID=${dataBody.ProfileID}&Year=${
                        dataBody.year
                    }&LeaveDayTypeID=${item}`
                )
                    .then(res => {
                        if (res !== null && res !== undefined && typeof res == 'number') {
                            rs.push({
                                remainLeaveDay: res,
                                leaveDayTypeID: item
                            });
                            if (index + 1 === dataBody.listLeaveDayTypeID.length) {
                                this.setState({
                                    dataRemainLeaveDays: rs
                                });
                            }
                        }
                    })
                    .catch(error => {
                        DrawerServices.navigate('ErrorScreen', { ErrorDisplay: error });
                    });
            });
        }
    };

    render() {
        const { refreshing, isLoading, dataGeneral, yearSelected, dataRemainLeaveDays } = this.state;
        let viewContent = <View />;

        if (isLoading) {
            viewContent = <VnrLoading size="large" isVisible={isLoading} />;
        } else if (dataGeneral == EnumName.E_EMPTYDATA || Object.keys(dataGeneral).length == 0) {
            viewContent = <EmptyData messageEmptyData={'EmptyData'} />;
        } else if (dataGeneral && Object.keys(dataGeneral).length > 0) {
            viewContent = (
                <View style={styles.container}>
                    <ScrollView
                        style={CustomStyleSheet.flex(1)}
                        refreshControl={
                            <RefreshControl
                                onRefresh={() => this._handleRefresh()}
                                refreshing={refreshing}
                                size="large"
                                tintColor={Colors.primary}
                            />
                        }
                    >
                        {Object.keys(dataGeneral).map((key, index) => {
                            let lableGroup = dataGeneral[key]['lableGroup'],
                                { status, statusView, dateReject, dataConfirm, reasonReject } = dataGeneral[key],
                                colorStatusView = null,
                                borderStatusView = null,
                                bgStatusView = null,
                                dataTime = '',
                                valueItemStatus = {};

                            if (status == EnumName.E_CONFIRM) {
                                dataTime = dataConfirm ? dataConfirm.split('__')[1] : '';

                                valueItemStatus['colorStatus'] = this.convertTextToColor('39,194,76,1');
                                valueItemStatus['borderStatus'] = this.convertTextToColor('39,194,76,0.5');
                                valueItemStatus['bgStatus'] = this.convertTextToColor('39,194,76,0.04');
                            } else if (status == EnumName.E_REJECT) {
                                dataTime = dateReject ? dateReject.split('__')[1] : '';

                                valueItemStatus['colorStatus'] = this.convertTextToColor('240,80,80,1');
                                valueItemStatus['borderStatus'] = this.convertTextToColor('240,80,80,0.5');
                                valueItemStatus['bgStatus'] = this.convertTextToColor('240,80,80,0.04');
                            }

                            const { colorStatus, borderStatus, bgStatus } = valueItemStatus;
                            colorStatusView = colorStatus ? colorStatus : null;
                            borderStatusView = borderStatus ? borderStatus : null;
                            bgStatusView = bgStatus ? bgStatus : null;

                            return (
                                <View key={index} style={stylesScreenDetailV2.containerItemDetail}>
                                    {Vnr_Function.formatStringTypeV2(
                                        { title: key },
                                        {
                                            TypeView: 'E_GROUP',
                                            DisplayKey: lableGroup,
                                            DataType: 'string'
                                        }
                                    )}
                                    {dataGeneral[key]['list'].map((item, i) => (
                                        <View
                                            key={i}
                                        >
                                            {Vnr_Function.formatStringTypeV2(item, {
                                                TypeView: 'E_COMMON',
                                                DisplayKey: item.CutOffDurationName,
                                                Name: 'TotalLeavedayInMonthView',
                                                DataType: 'string'
                                            })}
                                        </View>
                                    ))}

                                    <View style={styles.styViewTotal}>
                                        <Text style={[styleSheets.lable, stylesScreenDetailV2.styTextLableInfo]}>
                                            {`${translate('HRM_SysColumn_Sum')}: `}
                                        </Text>

                                        <Text style={[styleSheets.text, styles.styValueTotal]}>
                                            {`${Vnr_Function.mathRoundNumber(dataGeneral[key]['total'])} ${translate(
                                                'E_DAY_LOWERCASE'
                                            )}`}
                                        </Text>
                                    </View>

                                    {dataRemainLeaveDays &&
                                    Array.isArray(dataRemainLeaveDays) &&
                                    dataRemainLeaveDays.length > 0
                                        ? dataRemainLeaveDays.map(item => {
                                            if (item.leaveDayTypeID === key) {
                                                return (
                                                    <View style={styles.styViewTotal}>
                                                        <Text
                                                            style={[
                                                                styleSheets.lable,
                                                                stylesScreenDetailV2.styTextLableInfo
                                                            ]}
                                                        >
                                                            {`${translate('Hrm_AnnualLeave_Remaining')}: `}
                                                        </Text>

                                                        <Text style={[styleSheets.text, styles.styValueTotal]}>
                                                            {Vnr_Function.mathRoundNumber(item.remainLeaveDay)}{' '}
                                                            {translate('E_DAY_LOWERCASE')}
                                                        </Text>
                                                    </View>
                                                );
                                            }
                                        })
                                        : null}

                                    {(status == EnumName.E_CONFIRM || status == EnumName.E_REJECT) && (
                                        <View style={styles.styViewReason}>
                                            <Text style={[styleSheets.lable, stylesScreenDetailV2.styTextLableInfo]}>
                                                {`${translate('HRM_Attendance_Overtime_DeclineReason')}: `}
                                            </Text>

                                            <Text style={[styleSheets.text, styles.styValueTotal]}>{reasonReject}</Text>
                                        </View>
                                    )}

                                    {(status == EnumName.E_CONFIRM || status == EnumName.E_REJECT) && (
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
                                                {statusView}
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
                                                    {moment(dataTime).format('DD/MM/YYYY')}
                                                </Text>
                                            )}
                                        </View>
                                    )}

                                    <View style={styles.styViewBtn}>
                                        {status != EnumName.E_CONFIRM && (
                                            <TouchableOpacity
                                                onPress={() => this.approveAndReject(false, key)}
                                                style={[styles.styBtn, { backgroundColor: Colors.green }]}
                                            >
                                                <VnrText
                                                    style={[styleSheets.lable, styles.styBtnText]}
                                                    i18nKey={'HRM_Common_Confirm'}
                                                />
                                            </TouchableOpacity>
                                        )}

                                        {status != EnumName.E_CONFIRM && status != EnumName.E_REJECT && (
                                            <TouchableOpacity
                                                onPress={() => this.approveAndReject(true, key)}
                                                style={[styles.styBtn, { backgroundColor: Colors.orange }]}
                                            >
                                                <VnrText
                                                    style={[styleSheets.lable, styles.styBtnText]}
                                                    i18nKey={'HRM_Common_Reject'}
                                                />
                                            </TouchableOpacity>
                                        )}
                                    </View>

                                    {/* item.RejectReason
                                             khoong : 2 nut
                                             xacs nhan : 0 nut nao hien trang thai
                                             tu choi : 1 xacs nhan, hien trang thai
                                             E_CONFIRM,E_REJECT
                                        */}
                                </View>
                            );
                        })}
                    </ScrollView>
                    {/* {
                        Object.keys(dataGeneral).length > 1 && (
                            <View style={styles.styViewBtnBottom}>
                                <TouchableOpacity
                                    onPress={() => this.approveAndReject(false, null)}
                                    style={[
                                        styles.styBtnBottom,
                                        { backgroundColor: Colors.green },
                                    ]}
                                >
                                    <VnrText
                                        style={[styleSheets.lable, styles.styBtnText]}
                                        i18nKey={'HRM_Common_Confirm'}
                                    />
                                </TouchableOpacity>


                                <TouchableOpacity
                                    onPress={() => this.approveAndReject(true, null)}
                                    style={[
                                        styles.styBtnBottom,
                                        { backgroundColor: Colors.orange, marginLeft: Size.defineHalfSpace },
                                    ]}
                                >
                                    <VnrText
                                        style={[styleSheets.lable, styles.styBtnText]}
                                        i18nKey={'HRM_Common_Reject'}
                                    />
                                </TouchableOpacity>
                            </View>
                        )
                    } */}
                </View>
            );
        }

        return (
            <SafeAreaView {...styleSafeAreaView}>
                <View style={styles.searchYear}>
                    <VnrYearPicker onFinish={item => this.onSubmitYear(item)} value={yearSelected} />
                </View>

                {this._renderHeaderLoading()}
                {viewContent}
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    searchYear: {
        backgroundColor: Colors.white,
        paddingVertical: 10,
        flexDirection: 'row'
    },
    styViewTotal: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginVertical: Size.defineSpace
    },
    styViewReason: {
        flexDirection: 'row',
        marginBottom: Size.defineSpace
    },
    styViewStatus: {
        marginBottom: Size.defineSpace,
        marginTop: 0
    },
    styValueTotal: {
        color: Colors.gray_7,
        marginLeft: 3
    },
    styViewBtn: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        marginBottom: Size.defineSpace
    },
    styBtn: {
        width: 'auto',
        height: Size.heightButton,
        flexDirection: 'row',

        alignItems: 'center',
        justifyContent: 'center',

        paddingHorizontal: Size.defineSpace,
        marginLeft: Size.defineHalfSpace,
        borderRadius: 7
    },
    styBtnText: {
        color: Colors.white,
        marginLeft: 4
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
)(AttConfirmLeaveDay);
