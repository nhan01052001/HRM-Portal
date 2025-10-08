import React, { Component } from 'react';
import { View, Animated, DeviceEventEmitter } from 'react-native';
import AttWorkingOvertimeList from '../../attWorkingOvertimeList/AttWorkingOvertimeList';
import {
    styleSheets,
    styleSafeAreaView
} from '../../../../../../constants/styleConfig';
import { ConfigList } from '../../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../../../assets/constant';
import {
    generateRowActionAndSelected,
    AttSubmitWorkingOvertimeBusinessFunction
} from '../AttSubmitWorkingOvertimeBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../../factories/BackGroundTask';
import AttSubmitWorkingOvertimeAddOrEdit from '../AttSubmitWorkingOvertimeAddOrEdit';
import SafeAreaViewDetail from '../../../../../../components/safeAreaView/SafeAreaViewDetail';

let configList = null,
    enumName = null,
    attApproveSubmitWorkingOvertime = null,
    attSubmitWorkingOvertime = null,
    attSubmitWorkingOvertimeViewDetail = null,
    attApproveSubmitWorkingOvertimeTask = null,
    dataRowActionAndSelected = null,
    pageSizeList = 20;

class AttApproveSubmitWorkingOvertime extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataBody: null,
            rowActions: [],
            selected: [],
            isRefreshList: false,
            isLazyLoading: false,
            keyQuery: null,
            dataChange: false //biến check dữ liệu có thay đổi hay không
        };

        // animation filter
        this.scrollYAnimatedValue = new Animated.Value(0);

        this.storeParamsDefault = null;

        //biến lưu lại object filter
        this.paramsFilter = null;

        this.AttSubmitWorkingOvertimeAddOrEdit = null;

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // Trường hợp goBack từ detail thì phải gán lại this
            AttSubmitWorkingOvertimeBusinessFunction.setThisForBusiness(this, dataRowActionAndSelected?.rowActions);
            if (AttSubmitWorkingOvertimeBusinessFunction.checkForReLoadScreen[attApproveSubmitWorkingOvertime]) {
                this.reload();
            }
        });
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
        if (this.planResultListener) {
            this.planResultListener.remove();
            this.planResultListener = null;
        }
    }

    onCreate = () => {
        if (this.AttSubmitWorkingOvertimeAddOrEdit && this.AttSubmitWorkingOvertimeAddOrEdit.onShow) {
            this.AttSubmitWorkingOvertimeAddOrEdit.onShow({
                reload: this.reload,
                record: null
            });
        }
    };

    onEdit = item => {
        if (item) {
            if (this.AttSubmitWorkingOvertimeAddOrEdit && this.AttSubmitWorkingOvertimeAddOrEdit.onShow) {
                this.AttSubmitWorkingOvertimeAddOrEdit.onShow({
                    reload: this.reload,
                    record: item
                });
            }
        }
    };

    reload = paramsFilter => {
        if (paramsFilter === 'E_KEEP_FILTER') {
            paramsFilter = { ...this.paramsFilter };
        } else {
            this.paramsFilter = { ...paramsFilter };
        }

        let _paramsDefault = this.storeParamsDefault ? this.storeParamsDefault : this.paramsDefault(),
            _keyQuery = EnumName.E_FILTER;

        _paramsDefault = {
            ..._paramsDefault,
            keyQuery: _keyQuery,
            isRefreshList: !this.state.isRefreshList, // reload lại ds.
            dataBody: {
                ..._paramsDefault?.dataBody,
                ...paramsFilter
            }
        };

        // set false when reloaded
        AttSubmitWorkingOvertimeBusinessFunction.checkForReLoadScreen[attApproveSubmitWorkingOvertime] = false;

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: attApproveSubmitWorkingOvertimeTask,
                payload: {
                    ...dataBody,
                    keyQuery: keyQuery,
                    isCompare: false,
                    reload: this.reload
                }
            });
        });
    };

    checkDataFormNotify = () => {
        const { params = {} } = this.props.navigation.state,
            _params = typeof params == 'object' ? params : JSON.parse(params);
        return _params;
    };

    paramsDefault = () => {
        if (!attApproveSubmitWorkingOvertime) {
            attApproveSubmitWorkingOvertime = ScreenName.AttApproveSubmitWorkingOvertime;
        }
        if (!configList[attApproveSubmitWorkingOvertime]) {
            configList[attApproveSubmitWorkingOvertime] = {
                Api: {
                    urlApi: '[URI_CENTER]/api/Att_OvertimePlan/New_PlanOvertimeByFilterHandle_App',
                    type: 'POST',
                    pageSize: 20
                },
                Order: [
                    {
                        field: 'TimeLog',
                        dir: 'desc'
                    }
                ],
                Filter: [
                    {
                        logic: 'and',
                        filters: []
                    }
                ],
                BusinessAction: [
                    {
                        Type: 'E_CANCEL',
                        Resource: {
                            Name: 'Att_Overtime_Index_btnCancel_Overtime',
                            Rule: 'View'
                        },
                        Confirm: {
                            isInputText: true,
                            isValidInputText: false
                        }
                    },
                    {
                        Type: 'E_REQUEST_CANCEL',
                        Resource: {
                            Name: 'New_Att_OvertimePlan_BtnRequestCancel',
                            Rule: 'View'
                        },
                        Confirm: {
                            isInputText: true,
                            isValidInputText: false,
                            isAttachFile: true,
                            isNotNullAttachFile: true
                        }
                    }
                ]
            };
        }

        const _configList = configList[attApproveSubmitWorkingOvertime],
            filter = _configList[enumName.E_Filter],
            dataFromParams = this.checkDataFormNotify();

        dataRowActionAndSelected = generateRowActionAndSelected(attApproveSubmitWorkingOvertime);
        let _params = {
            ...dataFromParams,
            IsPortalNew: true,
            filter: filter,
            pageSize: pageSizeList,
            Status: 'E_WAIT_APPROVED'
        };

        return {
            rowActions: dataRowActionAndSelected.rowActions,
            selected: dataRowActionAndSelected.selected,
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
                    keyTask: attApproveSubmitWorkingOvertimeTask,
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

    pagingRequest = (page) => {
        const { dataBody } = this.state;
        this.setState(
            {
                keyQuery: EnumName.E_PAGING
            },
            () => {
                startTask({
                    keyTask: attApproveSubmitWorkingOvertimeTask,
                    payload: {
                        ...dataBody,
                        page: page,
                        pageSize: 20,
                        keyQuery: EnumName.E_PAGING,
                        isCompare: false,
                        reload: this.reload,
                        dataSourceRequestString: `page=${page}&pageSize=20`,
                        take: 20
                    }
                });
            }
        );
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == attApproveSubmitWorkingOvertimeTask) {
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
        attApproveSubmitWorkingOvertime = ScreenName.AttApproveSubmitWorkingOvertime;
        attSubmitWorkingOvertime = ScreenName.AttSubmitWorkingOvertime;
        attSubmitWorkingOvertimeViewDetail = ScreenName.AttSubmitWorkingOvertimeViewDetail;
        attApproveSubmitWorkingOvertimeTask = EnumTask.KT_AttApproveSubmitWorkingOvertime;
        AttSubmitWorkingOvertimeBusinessFunction.checkForReLoadScreen[attApproveSubmitWorkingOvertime] = false;
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        // Listen plan/result toggle to reload with status
        this.planResultListener = DeviceEventEmitter.addListener(
            'ATT_WO_PLAN_RESULT_CHANGED',
            ({ isPlan }) => {
                // merge toggle state into filter and reload
                const nextFilter = {
                    ...(this.paramsFilter || {}),
                    IsPlan: isPlan
                };
                this.reload(nextFilter);
            }
        );

        startTask({
            keyTask: attApproveSubmitWorkingOvertimeTask,
            payload: {
                ..._paramsDefault.dataBody,
                pageSize: pageSizeList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload,
                Status: 'E_APPROVED1,E_APPROVED2,E_FIRST_APPROVED,E_SUBMIT',
                skip: 0,
                take: 20
            }
        });
    }

    render() {
        const {
            dataBody,
            rowActions,
            selected,
            isLazyLoading,
            isRefreshList,
            keyQuery,
            dataChange
        } = this.state;

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                {attApproveSubmitWorkingOvertime && attSubmitWorkingOvertimeViewDetail && enumName && (
                    <View style={[styleSheets.containerGrey]}>
                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <AttWorkingOvertimeList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: attSubmitWorkingOvertimeViewDetail,
                                        screenName: attSubmitWorkingOvertime,
                                        screenNameRender: attApproveSubmitWorkingOvertime
                                    }}
                                    scrollYAnimatedValue={this.scrollYAnimatedValue}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={attApproveSubmitWorkingOvertimeTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    onCreate={this.onCreate}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_CENTER]/api/Att_OvertimePlan/New_PlanOvertimeByFilterHandle_App',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: pageSizeList
                                    }}
                                    valueField="ID"
                                />
                            )}
                        </View>

                        <AttSubmitWorkingOvertimeAddOrEdit
                            ref={refs => (this.AttSubmitWorkingOvertimeAddOrEdit = refs)}
                        />
                    </View>
                )}
            </SafeAreaViewDetail>
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
)(AttApproveSubmitWorkingOvertime);
