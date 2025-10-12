import React, { Component, createRef } from 'react';
import { View, Animated } from 'react-native';
import AttTakeDailyTaskList from '../../attTakeDailyTaskList/AttTakeDailyTaskList';
import {
    styleSheets,
    styleSafeAreaView,
    styleContentFilterDesign,
    styleContentFilterDesignV3
} from '../../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../../componentsV3/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../../../assets/constant';
import { AttApproveTakeDailyTaskBusiness, generateRowActionAndSelected } from '../AttApproveTakeDailyTaskBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../../factories/BackGroundTask';
import SafeAreaViewDetail from '../../../../../../components/safeAreaView/SafeAreaViewDetail';
import VnrModalError from '../../../../../../componentsV3/VnrModalError/VnrModalError';

let configList = null,
    enumName = null,
    attApproveTakeDailyTask = null,
    attApproveTakeDailyTaskViewDetail = null,
    attApproveTakeDailyTaskKeyTask = null,
    pageSizeList = 20;

class AttApproveTakeDailyTask extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataBody: null,
            rowActions: [],
            selected: [],
            groupField: [],
            isRefreshList: false,
            isLazyLoading: false,
            keyQuery: null,
            dataChange: false //biến check dữ liệu có thay đổi hay không
        };

        this.scrollYAnimatedValue = new Animated.Value(0);
        this.storeParamsDefault = null;

        //biến lưu lại object filter
        this.paramsFilter = null;

        // ref modal error
        this.refModalError = createRef(null);

        //biến lưu lại object filter
        this.paramsFilter = null;
        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // reload danh sách khi có approve hoặc reject dữ liệu
            AttApproveTakeDailyTaskBusiness.setThisForBusiness(this);
            if (AttApproveTakeDailyTaskBusiness.checkForReLoadScreen[attApproveTakeDailyTask]) {
                this.reload();
            }
        });
    }

    checkDataFormNotify = () => {
        const { params = {} } = this.props.navigation.state,
            _params = typeof params == 'object' ? params : JSON.parse(params);
        return _params;
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

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: attApproveTakeDailyTaskKeyTask,
                payload: {
                    ...dataBody,
                    IsWaiting: true,
                    keyQuery: keyQuery,
                    isCompare: false,
                    reload: this.reload
                }
            });
        });
    };

    paramsDefault = () => {
        if (!attApproveTakeDailyTask) {
            attApproveTakeDailyTask = ScreenName.AttApproveTakeDailyTask;
        }
        if (!configList[attApproveTakeDailyTask]) {
            configList[attApproveTakeDailyTask] = {
                Api: {
                    urlApi: '[URI_CENTER]/api/Att_OvertimePlan/New_PlanOvertimeApproveByFilterHandle_App',
                    type: 'POST',
                    pageSize: 20
                },
                Order: [
                    {
                        field: 'TimeLog',
                        dir: 'desc'
                    }
                ],
                GroupField: [],
                Filter: [
                    {
                        logic: 'and',
                        filters: []
                    }
                ],
                BusinessAction: [
                    {
                        Type: 'E_APPROVE',
                        Resource: {
                            Name: 'New_Att_PlanOvertime_Approve_New_Index_btnApprove',
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
                            Name: 'New_Att_PlanOvertime_Approve_New_Index_btnReject',
                            Rule: 'View'
                        },
                        Confirm: {
                            isInputText: true,
                            isValidInputText: true
                        }
                    }
                ]
            };
        }

        const _configList = configList[attApproveTakeDailyTask],
            renderRow = _configList[enumName.E_Row],
            filter = _configList[enumName.E_Filter],
            dataFromParams = this.checkDataFormNotify(),
            groupField = _configList[enumName.E_Field_Group] ? _configList[enumName.E_Field_Group] : null;

        const dataRowActionAndSelected = generateRowActionAndSelected(attApproveTakeDailyTask);
        let _params = {
            ...dataFromParams,
            IsPortalNew: true,
            filter: filter,
            pageSize: pageSizeList
        };

        return {
            rowActions: dataRowActionAndSelected.rowActions,
            selected: dataRowActionAndSelected.selected,
            groupField: groupField,
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
                    keyTask: attApproveTakeDailyTaskKeyTask,
                    payload: {
                        ...dataBody,
                        IsWaiting: true,
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
                    keyTask: attApproveTakeDailyTaskKeyTask,
                    payload: {
                        ...dataBody,
                        page: page,
                        IsWaiting: true,
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

        if (nextProps.reloadScreenName == attApproveTakeDailyTaskKeyTask) {
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
        attApproveTakeDailyTask = ScreenName.AttApproveTakeDailyTask;
        attApproveTakeDailyTaskViewDetail = ScreenName.AttApproveTakeDailyTaskViewDetail;
        attApproveTakeDailyTaskKeyTask = EnumTask.KT_AttApproveTakeDailyTask;
        AttApproveTakeDailyTaskBusiness.setThisForBusiness(this);
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: attApproveTakeDailyTaskKeyTask,
            payload: {
                ..._paramsDefault.dataBody,
                pageSize: pageSizeList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload,
                Status: null,
                skip: 0,
                take: 20,
                IsWaiting: true
            }
        });
    }

    onShowModalError = (data, cacheID) => {
        if (this.refModalError && this.refModalError.show) {
            this.refModalError.show(data, cacheID);
        }
    };

    render() {
        const {
            dataBody,
            renderRow,
            rowActions,
            groupField,
            selected,
            isLazyLoading,
            isRefreshList,
            keyQuery,
            dataChange
        } = this.state;
        console.log(rowActions, 'rowActions');

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                {attApproveTakeDailyTask && attApproveTakeDailyTaskViewDetail && enumName && (
                    <View style={[styleSheets.containerGrey]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={{
                                ...styleContentFilterDesign,
                                ...styleContentFilterDesignV3
                            }}
                            screenName={attApproveTakeDailyTask}
                            onSubmitEditing={this.reload}
                            scrollYAnimatedValue={this.scrollYAnimatedValue}
                        />
                        {/* </Animated.View> */}
                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <AttTakeDailyTaskList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: attApproveTakeDailyTaskViewDetail,
                                        screenName: attApproveTakeDailyTask,
                                        screenNameRender: ScreenName.AttApproveTakeDailyTask
                                    }}
                                    scrollYAnimatedValue={this.scrollYAnimatedValue}
                                    rowActions={rowActions}
                                    selected={selected}
                                    groupField={groupField}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={attApproveTakeDailyTaskKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi:
                                            '[URI_CENTER]/api/Att_OvertimePlan/New_PlanOvertimeApproveByFilterHandle_App',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: 20
                                    }}
                                    valueField="ID"
                                    renderConfig={renderRow}
                                />
                            )}
                        </View>
                    </View>
                )}
                <VnrModalError ref={refs => (this.refModalError = refs)} />
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
)(AttApproveTakeDailyTask);
