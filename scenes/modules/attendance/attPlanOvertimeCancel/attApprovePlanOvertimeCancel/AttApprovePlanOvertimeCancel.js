import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import AttPlanOvertimeCancelList from '../attPlanOvertimeCancelList/AttPlanOvertimeCancelList';
import {
    styleSheets,
    Colors,
    Size,
    styleSafeAreaView,
    styleContentFilterDesign,
    stylesModalPopupBottom,
    CustomStyleSheet
} from '../../../../../constants/styleConfig';
import Modal from 'react-native-modal';
import VnrFilterCommon from '../../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import {
    AttApprovePlanOvertimeCancelBusinessFunction,
    generateRowActionAndSelected
} from './AttApprovePlanOvertimeCancelBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import VnrText from '../../../../../components/VnrText/VnrText';
import { IconCancel, IconColse } from '../../../../../constants/Icons';

let configList = null,
    enumName = null,
    attApprovePlanOvertimeCancel = null,
    attApprovePlanOvertimeCancelViewDetail = null,
    attApprovePlanOvertimeCancelKeyTask = null,
    pageSizeList = 20;

class AttApprovePlanOvertimeCancel extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataBody: null,
            rowActions: [],
            selected: [],
            isRefreshList: false,
            isLazyLoading: false,
            keyQuery: null,
            dataChange: false, //biến check dữ liệu có thay đổi hay không
            dataPlanLimit: {
                data: null,
                modalVisiblePlanLimit: false
            }
        };

        this.storeParamsDefault = null;

        //biến lưu lại object filter
        this.paramsFilter = null;
        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            AttApprovePlanOvertimeCancelBusinessFunction.setThisForBusiness(this);
        });
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    checkDataFormNotify = () => {
        const { params = {} } = this.props.navigation.state,
            { NotificationID } = typeof params == 'object' ? params : JSON.parse(params);
        return NotificationID ? NotificationID : null;
    };

    reload = paramsFilter => {
        if (paramsFilter === 'E_KEEP_FILTER') {
            paramsFilter = { ...this.paramsFilter };
        } else {
            this.paramsFilter = { ...paramsFilter };
        }

        let _paramsDefault = this.storeParamsDefault,
            _keyQuery = EnumName.E_FILTER;

        _paramsDefault = {
            ..._paramsDefault,
            keyQuery: _keyQuery,
            isRefreshList: !this.state.isRefreshList, // reload lại ds.
            dataBody: {
                ..._paramsDefault.dataBody,
                ...paramsFilter
            }
        };

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: attApprovePlanOvertimeCancelKeyTask,
                payload: {
                    ...dataBody,
                    keyQuery: keyQuery,
                    isCompare: false,
                    reload: this.reload
                }
            });
        });
    };

    paramsDefault = () => {
        const _configList = configList[attApprovePlanOvertimeCancel],
            renderRow = _configList[enumName.E_Row],
            orderBy = _configList[enumName.E_Order];

        const dataRowActionAndSelected = generateRowActionAndSelected();
        let _params = {
            IsPortal: true,
            sort: orderBy,
            pageSize: pageSizeList,
            NotificationID: this.checkDataFormNotify()
        };
        return {
            rowActions: dataRowActionAndSelected.rowActions,
            selected: dataRowActionAndSelected.selected,
            renderRow: renderRow,
            dataBody: _params,
            keyQuery: EnumName.E_PRIMARY_DATA
        };
    };

    pullToRefresh = () => {
        const { dataBody, keyQuery } = this.state;
        this.setState(
            {
                keyQuery: keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA
            },
            () => {
                startTask({
                    keyTask: attApprovePlanOvertimeCancelKeyTask,
                    payload: {
                        ...dataBody,
                        keyQuery: keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA,
                        isCompare: false,
                        reload: this.reload
                    }
                });
            }
        );
    };

    pagingRequest = (page, pageSize) => {
        const { dataBody } = this.state;
        this.setState(
            {
                keyQuery: EnumName.E_PAGING
            },
            () => {
                startTask({
                    keyTask: attApprovePlanOvertimeCancelKeyTask,
                    payload: {
                        ...dataBody,
                        page: page,
                        pageSize: pageSize,
                        keyQuery: EnumName.E_PAGING,
                        isCompare: false,
                        reload: this.reload
                    }
                });
            }
        );
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == attApprovePlanOvertimeCancelKeyTask) {
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

    componentDidMount() {
        //set by config
        if (!ConfigList.value[ScreenName.AttApprovePlanOvertimeCancel]) {
            PermissionForAppMobile.value = {
                ...PermissionForAppMobile.value,
                New_Att_RequestCancelationOvertimePlan_New_Index_btnApprove: { View: true },
                New_Att_RequestCancelationOvertimePlan_New_Index_btnReject: { View: true }
            };
            ConfigList.value[ScreenName.AttApprovePlanOvertimeCancel] = {
                Api: {
                    urlApi: '[URI_HR]/Att_GetData/New_GetRequestCancalationOTPlan_Approve',
                    type: 'POST',
                    pageSize: 20
                },
                Row: [],
                Order: [
                    {
                        field: 'DateUpdate',
                        dir: 'desc'
                    }
                ],
                BusinessAction: [
                    {
                        Type: 'E_APPROVE',
                        Resource: {
                            Name: 'New_Att_RequestCancelationOvertimePlan_New_Index_btnApprove',
                            Rule: 'View'
                        },
                        Confirm: {
                            isInputText: true,
                            isValidInputText: false
                        }
                    },
                    {
                        Type: 'E_REJECT',
                        Resource: {
                            Name: 'New_Att_RequestCancelationOvertimePlan_New_Index_btnReject',
                            Rule: 'View'
                        },
                        Confirm: {
                            isInputText: true,
                            isValidInputText: false
                        }
                    }
                ]
            };
        }
        configList = ConfigList.value;
        enumName = EnumName;
        attApprovePlanOvertimeCancel = ScreenName.AttApprovePlanOvertimeCancel;
        attApprovePlanOvertimeCancelViewDetail = ScreenName.AttApprovePlanOvertimeCancelViewDetail;
        attApprovePlanOvertimeCancelKeyTask = EnumTask.KT_AttApprovePlanOvertimeCancel;

        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: attApprovePlanOvertimeCancelKeyTask,
            payload: {
                ..._paramsDefault.dataBody,
                pageSize: pageSizeList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload
            }
        });
    }

    //#region  hiển thị số giờ lũy kế
    openModalPlanLimit = data => {
        const { dataPlanLimit } = this.state;
        if (!data) {
            return;
        }

        VnrLoadingSevices.show();
        HttpService.Post('[URI_HR]/Att_GetData/GetOvertimePlanLimit', {
            ProfileIDs: data.ProfileID,
            WorkDateRoot: Vnr_Function.formatDateAPI(data.WorkDate)
        }).then(res => {
            VnrLoadingSevices.hide();
            if (res && res.Data && res.Data.length > 0)
                this.setState({
                    dataPlanLimit: {
                        ...dataPlanLimit,
                        data: res.Data[0],
                        modalVisiblePlanLimit: true
                    }
                });
            else
                this.setState({
                    dataPlanLimit: {
                        ...dataPlanLimit,
                        data: enumName.E_EMPTYDATA,
                        modalVisiblePlanLimit: true
                    }
                });
        });
    };

    closeModalPlanLimit = () => {
        const { dataPlanLimit } = this.state;
        this.setState({
            dataPlanLimit: {
                ...dataPlanLimit,
                modalVisiblePlanLimit: false
            }
        });
    };

    viewListItemPlanLimitTime = () => {
        const { dataPlanLimit } = this.state;
        if (dataPlanLimit.data === EnumName.E_EMPTYDATA) {
            return <EmptyData messageEmptyData={'EmptyData'} />;
        } else {
            const {
                udHourByMonth,
                udHourByYear,
                udLimitColorYearFinance,
                udLimitColorMonth,
                udLimitColorYear,
                udHourByYearFinance
            } = dataPlanLimit.data;

            return (
                <View style={{}}>
                    <View style={styles.viewTextTimeWithBorder}>
                        <VnrText
                            style={[styleSheets.Text, udLimitColorMonth && { color: udLimitColorMonth }]}
                            i18nKey={'udHourByMonth'}
                        />
                        <Text style={[styleSheets.Text, udLimitColorMonth && { color: udLimitColorMonth }]}>
                            {udHourByMonth !== null ? `: ${udHourByMonth}` : ''}
                        </Text>
                    </View>

                    <View style={styles.viewTextTimeWithoutBorder}>
                        <VnrText
                            style={[styleSheets.Text, udLimitColorYear && { color: udLimitColorYear }]}
                            i18nKey={'udHourByYear'}
                        />
                        <Text style={[styleSheets.Text, udLimitColorYear && { color: udLimitColorYear }]}>
                            {udHourByYear !== null ? `: ${udHourByYear}` : ''}
                        </Text>
                    </View>

                    <View style={styles.viewTextTimeWithoutBorder}>
                        <VnrText
                            style={[styleSheets.Text, udLimitColorYearFinance && { color: udLimitColorYearFinance }]}
                            i18nKey={'udHourByYearFinance'}
                        />
                        <Text style={[styleSheets.Text, udLimitColorYearFinance && { color: udLimitColorYearFinance }]}>
                            {udHourByYearFinance != null ? `: ${udHourByYearFinance}` : ''}
                        </Text>
                    </View>
                </View>
            );
        }
    };

    //#endregion

    render() {
        const {
            dataBody,
            renderRow,
            rowActions,
            selected,
            isLazyLoading,
            isRefreshList,
            keyQuery,
            dataChange,
            dataPlanLimit
        } = this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {attApprovePlanOvertimeCancel && attApprovePlanOvertimeCancelViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={styleContentFilterDesign}
                            screenName={attApprovePlanOvertimeCancel}
                            onSubmitEditing={this.reload}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <AttPlanOvertimeCancelList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: attApprovePlanOvertimeCancelViewDetail,
                                        screenName: attApprovePlanOvertimeCancel
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={attApprovePlanOvertimeCancelKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Att_GetData/New_GetRequestCancalationOTPlan_Approve',
                                        type: enumName.E_POST,
                                        pageSize: 20,
                                        dataBody: dataBody
                                    }}
                                    valueField="ID"
                                    renderConfig={renderRow}
                                />
                            )}
                        </View>

                        {dataPlanLimit.modalVisiblePlanLimit && (
                            <Modal
                                onBackButtonPress={() => this.closeModalPlanLimit()}
                                isVisible={true}
                                onBackdropPress={() => this.closeModalPlanLimit()}
                                customBackdrop={
                                    <TouchableWithoutFeedback onPress={() => this.closeModalPlanLimit()}>
                                        <View
                                            style={styleSheets.coatingOpacity05}
                                        />
                                    </TouchableWithoutFeedback>
                                }
                                style={CustomStyleSheet.margin(0)}
                            >
                                <View style={stylesModalPopupBottom.viewModalTime}>
                                    <SafeAreaView {...styleSafeAreaView} style={stylesModalPopupBottom.safeRadius}>
                                        <View style={styles.headerCloseModal}>
                                            <IconColse color={Colors.white} size={Size.iconSize} />
                                            <VnrText style={styleSheets.lable} i18nKey={'HRM_Common_ViewLimit'} />
                                            <TouchableOpacity onPress={() => this.closeModalPlanLimit()}>
                                                <IconCancel color={Colors.black} size={Size.iconSize} />
                                            </TouchableOpacity>
                                        </View>
                                        <ScrollView style={styleSheets.flexGrow1flexDirectionColumn}>
                                            {this.viewListItemPlanLimitTime()}
                                        </ScrollView>
                                    </SafeAreaView>
                                </View>
                            </Modal>
                        )}
                    </View>
                )}
            </SafeAreaView>
        );
    }
}

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
)(AttApprovePlanOvertimeCancel);

const styles = StyleSheet.create({
    headerCloseModal: {
        paddingVertical: 15,
        paddingHorizontal: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    viewTextTimeWithBorder: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        padding: styleSheets.p_15,
        borderBottomWidth: 1,
        borderBottomColor: Colors.borderColor
    },
    viewTextTimeWithoutBorder: {
        flexDirection: 'row',
        height: 50,
        alignItems: 'center',
        padding: styleSheets.p_15
    }
});
