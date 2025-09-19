import React, { Component } from 'react';
import { Text, View, TouchableOpacity, StyleSheet, TouchableWithoutFeedback, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import AttPlanOvertimeList from '../attPlanOvertimeList/AttPlanOvertimeList';
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
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import { AttApprovePlanOvertimeBusinessFunction, generateRowActionAndSelected } from './AttApprovePlanOvertimeBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import Vnr_Function from '../../../../../utils/Vnr_Function';
import EmptyData from '../../../../../components/EmptyData/EmptyData';
import HttpService from '../../../../../utils/HttpService';
import { VnrLoadingSevices } from '../../../../../components/VnrLoading/VnrLoadingPages';
import VnrText from '../../../../../components/VnrText/VnrText';
import { IconCancel, IconColse } from '../../../../../constants/Icons';
import { ConfigListDetail } from '../../../../../assets/configProject/ConfigListDetail';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';

let configList = null,
    enumName = null,
    attApprovePlanOvertime = null,
    attApprovePlanOvertimeViewDetail = null,
    attApprovePlanOvertimeKeyTask = null,
    pageSizeList = 20;

const configDefaultLimit = [
    {
        TypeView: 'E_COMMON',
        Name: 'udHourByMonth',
        DisplayKey: 'udHourByMonth',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'udHourByYear',
        DisplayKey: 'udHourByYear',
        DataType: 'string'
    },
    {
        TypeView: 'E_COMMON',
        Name: 'udHourByYearFinance',
        DisplayKey: 'udHourByYearFinance',
        DataType: 'string'
    }
];

class AttApprovePlanOvertime extends Component {
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
            AttApprovePlanOvertimeBusinessFunction.setThisForBusiness(this);
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
                keyTask: attApprovePlanOvertimeKeyTask,
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
        const _configList = configList[attApprovePlanOvertime],
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
                    keyTask: attApprovePlanOvertimeKeyTask,
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
                    keyTask: attApprovePlanOvertimeKeyTask,
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
        if (nextProps.reloadScreenName == attApprovePlanOvertimeKeyTask) {
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
        configList = ConfigList.value;
        enumName = EnumName;
        attApprovePlanOvertime = ScreenName.AttApprovePlanOvertime;
        attApprovePlanOvertimeViewDetail = ScreenName.AttApprovePlanOvertimeViewDetail;
        attApprovePlanOvertimeKeyTask = EnumTask.KT_AttApprovePlanOvertime;

        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;

        this.setState(_paramsDefault);

        startTask({
            keyTask: attApprovePlanOvertimeKeyTask,
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
            const { udLimitColorYearFinance, udLimitColorMonth, udLimitColorYear } = dataPlanLimit.data;

            const data = dataPlanLimit.data;

            const dataColor = {
                udHourByMonth: udLimitColorMonth ? udLimitColorMonth : null,
                udHourByYear: udLimitColorYear ? udLimitColorYear : null,
                udHourByYearFinance: udLimitColorYearFinance ? udLimitColorYearFinance : null
            };
            const _configListLimit = ConfigListDetail.value['GetOvertimePlanLimitViewDetail']
                ? ConfigListDetail.value['GetOvertimePlanLimitViewDetail']
                : configDefaultLimit;

            if (_configListLimit) {
                return (
                    <View style={{}}>
                        {_configListLimit.map((col, index) => {
                            return (
                                <View
                                    key={index}
                                    style={
                                        index == _configListLimit.length - 1
                                            ? styles.viewTextTimeWithoutBorder
                                            : styles.viewTextTimeWithBorder
                                    }
                                >
                                    <VnrText
                                        style={[
                                            styleSheets.text,
                                            dataColor[col.Name] && { color: dataColor[col.Name] }
                                        ]}
                                        i18nKey={col.DisplayKey}
                                    />

                                    <Text
                                        style={[
                                            styleSheets.text,
                                            dataColor[col.Name] && { color: dataColor[col.Name] }
                                        ]}
                                    >
                                        {data[col.Name] !== null ? `: ${data[col.Name]}` : ''}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                );
            }
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
                {attApprovePlanOvertime && attApprovePlanOvertimeViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={styleContentFilterDesign}
                            screenName={attApprovePlanOvertime}
                            onSubmitEditing={this.reload}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <AttPlanOvertimeList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: attApprovePlanOvertimeViewDetail,
                                        screenName: attApprovePlanOvertime
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={attApprovePlanOvertimeKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Att_GetData/New_PlanOvertimeApproveByFilter',
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
                                            style={styles.coating}
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
                                        <ScrollView style={styles.viewListItemPlanLimitTime}>
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
)(AttApprovePlanOvertime);

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
    },
    coating: {
        flex: 1,
        backgroundColor: Colors.black,
        opacity: 0.5
    },
    viewListItemPlanLimitTime: { flexGrow: 1, flexDirection: 'column' }
});
