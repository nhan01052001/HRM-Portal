import React, { Component } from 'react';
import { View, Animated, DeviceEventEmitter } from 'react-native';
import PlanResultState from '../PlanResultState';
import AttWorkingOvertimeList from '../attWorkingOvertimeList/AttWorkingOvertimeList';
import {
    styleSheets,
    styleSafeAreaView,
    styleContentFilterDesign,
    styleContentFilterDesignV3
} from '../../../../../constants/styleConfig';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import {
    generateRowActionAndSelected,
    AttSubmitWorkingOvertimeBusinessFunction
} from './AttSubmitWorkingOvertimeBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import AttSubmitWorkingOvertimeAddOrEdit from './AttSubmitWorkingOvertimeAddOrEdit';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import VnrFilterCommon from '../../../../../componentsV3/VnrFilter/VnrFilterCommon';
import styleComonAddOrEdit from '../../../../../constants/styleComonAddOrEdit';

let configList = null,
    enumName = null,
    attSubmitWorkingOvertime = null,
    attSubmitWorkingOvertimeViewDetail = null,
    attSubmitWorkingOvertimeKeyTask = null,
    dataRowActionAndSelected = null,
    pageSizeList = 20;

class AttSubmitWorkingOvertime extends Component {
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
            if (AttSubmitWorkingOvertimeBusinessFunction.checkForReLoadScreen[attSubmitWorkingOvertime]) {
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

    onEdit = (item) => {
        if (item) {
            if (this.AttSubmitWorkingOvertimeAddOrEdit && this.AttSubmitWorkingOvertimeAddOrEdit.onShow) {
                this.AttSubmitWorkingOvertimeAddOrEdit.onShow({
                    reload: this.reload,
                    record: item
                });
            }
        }
    };

    reload = (paramsFilter) => {
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
        AttSubmitWorkingOvertimeBusinessFunction.checkForReLoadScreen[attSubmitWorkingOvertime] = false;

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: attSubmitWorkingOvertimeKeyTask,
                payload: {
                    ...dataBody,
                    keyQuery: keyQuery,
                    isCompare: false,
                    reload: this.reload,
                    api: paramsFilter?.IsPlan
                        ? '[URI_CENTER]/api/Att_OvertimeForm/New_OvertimeFormRegister'
                        : '[URI_CENTER]/api/Att_OvertimeForm/New_OvertimeFormRegister'
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
        if (!attSubmitWorkingOvertime) {
            attSubmitWorkingOvertime = ScreenName.AttSubmitWorkingOvertime;
        }
        if (!configList[attSubmitWorkingOvertime]) {
            configList[attSubmitWorkingOvertime] = {
                Api: {
                    urlApi: '[URI_CENTER]/api/Att_OvertimePlan/New_PlanOvertimeByFilterHandle_App',
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
                        Type: 'E_MODIFY',
                        Resource: {
                            Name: 'New_Att_OvertimePlan_New_Index_V2',
                            Rule: 'Modify'
                        },
                        Confirm: {
                            isInputText: true,
                            isValidInputText: false
                        }
                    },
                    {
                        Type: 'E_DELETE',
                        Resource: {
                            Name: 'New_Att_OvertimePlan_New_Index_V2',
                            Rule: 'Delete'
                        },
                        Confirm: {
                            isInputText: false,
                            isValidInputText: false
                        }
                    },
                    {
                        Type: 'E_SENDMAIL',
                        Resource: {
                            Name: 'New_Att_PlanOvertime_New_Index_btnSendMail',
                            Rule: 'View'
                        }
                    },
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

        const _configList = configList[attSubmitWorkingOvertime],
            filter = _configList[enumName.E_Filter],
            dataFromParams = this.checkDataFormNotify();

        dataRowActionAndSelected = generateRowActionAndSelected(attSubmitWorkingOvertime);
        let _params = {
            ...dataFromParams,
            IsPortalNew: true,
            filter: filter,
            pageSize: pageSizeList,
            Status: null,
            IsPlan: PlanResultState.isPlan === true
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
                    keyTask: attSubmitWorkingOvertimeKeyTask,
                    payload: {
                        ...dataBody,
                        keyQuery: keyQuery == EnumName.E_FILTER ? keyQuery : EnumName.E_PRIMARY_DATA,
                        isCompare: false,
                        reload: this.reload,
                        api: '[URI_CENTER]/api/Att_OvertimeForm/New_OvertimeFormRegister'
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
                    keyTask: attSubmitWorkingOvertimeKeyTask,
                    payload: {
                        ...dataBody,
                        page: page,
                        pageSize: 20,
                        keyQuery: EnumName.E_PAGING,
                        isCompare: false,
                        reload: this.reload,
                        dataSourceRequestString: `page=${page}&pageSize=20`,
                        take: 20,
                        api: '[URI_CENTER]/api/Att_OvertimeForm/New_OvertimeFormRegister'
                    }
                });
            }
        );
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == attSubmitWorkingOvertimeKeyTask) {
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
        attSubmitWorkingOvertime = ScreenName.AttSubmitWorkingOvertime;
        attSubmitWorkingOvertimeViewDetail = ScreenName.AttSubmitWorkingOvertimeViewDetail;
        attSubmitWorkingOvertimeKeyTask = EnumTask.KT_AttSubmitWorkingOvertime;
        AttSubmitWorkingOvertimeBusinessFunction.checkForReLoadScreen[attSubmitWorkingOvertime] = false;
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        // Listen plan/result toggle to reload with status
        this.planResultListener = DeviceEventEmitter.addListener('ATT_WO_PLAN_RESULT_CHANGED', ({ isPlan }) => {
            const nextFilter = {
                ...(this.paramsFilter || {}),
                IsPlan: isPlan
            };
            this.reload(nextFilter);
        });

        startTask({
            keyTask: attSubmitWorkingOvertimeKeyTask,
            payload: {
                ..._paramsDefault.dataBody,
                pageSize: pageSizeList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload,
                Status: null,
                skip: 0,
                take: 20,
                api: '[URI_CENTER]/api/Att_OvertimeForm/New_OvertimeFormRegister'
            }
        });
    }

    render() {
        const { dataBody, rowActions, selected, isLazyLoading, isRefreshList, keyQuery, dataChange } = this.state;

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                {attSubmitWorkingOvertime && attSubmitWorkingOvertimeViewDetail && enumName && (
                    <View style={[styleSheets.containerGrey]}>
                        <View style={styleComonAddOrEdit.container}>
                            <VnrFilterCommon
                                ref={(ref) => (this.refFilter = ref)}
                                dataBody={dataBody}
                                style={{
                                    ...styleContentFilterDesign,
                                    ...styleContentFilterDesignV3
                                }}
                                screenName={attSubmitWorkingOvertime}
                                onSubmitEditing={this.reload}
                                tblName={'Filter_Attendance_Overtime_list'}
                                scrollYAnimatedValue={this.scrollYAnimatedValue}
                            />
                        </View>

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <AttWorkingOvertimeList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: attSubmitWorkingOvertimeViewDetail,
                                        screenName: attSubmitWorkingOvertime,
                                        screenNameRender: ScreenName.AttSubmitWorkingOvertime
                                    }}
                                    scrollYAnimatedValue={this.scrollYAnimatedValue}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={attSubmitWorkingOvertimeKeyTask}
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
                            ref={(refs) => (this.AttSubmitWorkingOvertimeAddOrEdit = refs)}
                        />
                    </View>
                )}
            </SafeAreaViewDetail>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(mapStateToProps, null)(AttSubmitWorkingOvertime);
