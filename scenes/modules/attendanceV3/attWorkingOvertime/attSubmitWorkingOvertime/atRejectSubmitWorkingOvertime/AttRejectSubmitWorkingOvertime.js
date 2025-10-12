import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import AttWorkingOvertimeList from '../../attWorkingOvertimeList/AttWorkingOvertimeList';
import {
    styleSheets,
    styleSafeAreaView,
    styleContentFilterDesign,
    styleContentFilterDesignV3
} from '../../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../../componentsV3/VnrFilter/VnrFilterCommon';
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
    attRejectSubmitWorkingOvertime = null,
    attSubmitWorkingOvertime = null,
    attSubmitWorkingOvertimeViewDetail = null,
    attRejectSubmitWorkingOvertimeKeyTask = null,
    pageSizeList = 20;

class AttRejectSubmitWorkingOvertime extends Component {
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
            AttSubmitWorkingOvertimeBusinessFunction.setThisForBusiness(this);
            if (AttSubmitWorkingOvertimeBusinessFunction.checkForReLoadScreen[attRejectSubmitWorkingOvertime]) {
                this.reload();
            }
        });
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
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
        AttSubmitWorkingOvertimeBusinessFunction.checkForReLoadScreen[attRejectSubmitWorkingOvertime] = false;

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: attRejectSubmitWorkingOvertimeKeyTask,
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
        if (!attRejectSubmitWorkingOvertime) {
            attRejectSubmitWorkingOvertime = ScreenName.AttRejectSubmitWorkingOvertime;
        }
        if (!configList[attRejectSubmitWorkingOvertime]) {
            configList[attRejectSubmitWorkingOvertime] = {
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
                BusinessAction: []
            };
        }

        const _configList = configList[attRejectSubmitWorkingOvertime],
            filter = _configList[enumName.E_Filter],
            dataFromParams = this.checkDataFormNotify();

        const dataRowActionAndSelected = generateRowActionAndSelected(attRejectSubmitWorkingOvertime);
        let _params = {
            ...dataFromParams,
            IsPortalNew: true,
            filter: filter,
            pageSize: pageSizeList,
            Status: 'E_REJECTED'
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
                    keyTask: attRejectSubmitWorkingOvertimeKeyTask,
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
                    keyTask: attRejectSubmitWorkingOvertimeKeyTask,
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
        if (nextProps.reloadScreenName == attRejectSubmitWorkingOvertimeKeyTask) {
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
        attRejectSubmitWorkingOvertime = ScreenName.AttRejectSubmitWorkingOvertime;
        attSubmitWorkingOvertime = ScreenName.AttSubmitWorkingOvertime;
        attSubmitWorkingOvertimeViewDetail = ScreenName.AttSubmitWorkingOvertimeViewDetail;
        attRejectSubmitWorkingOvertimeKeyTask = EnumTask.KT_AttRejectSubmitWorkingOvertime;
        AttSubmitWorkingOvertimeBusinessFunction.checkForReLoadScreen[attRejectSubmitWorkingOvertime] = false;
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: attRejectSubmitWorkingOvertimeKeyTask,
            payload: {
                ..._paramsDefault.dataBody,
                pageSize: pageSizeList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload,
                Status: 'E_REJECTED',
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
                {attRejectSubmitWorkingOvertime && attSubmitWorkingOvertimeViewDetail && enumName && (
                    <View style={[styleSheets.containerGrey]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={{
                                ...styleContentFilterDesign,
                                ...styleContentFilterDesignV3
                            }}
                            screenName={attSubmitWorkingOvertime}
                            onSubmitEditing={this.reload}
                            scrollYAnimatedValue={this.scrollYAnimatedValue}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <AttWorkingOvertimeList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: attSubmitWorkingOvertimeViewDetail,
                                        screenName: attSubmitWorkingOvertime,
                                        screenNameRender: attRejectSubmitWorkingOvertime
                                    }}
                                    scrollYAnimatedValue={this.scrollYAnimatedValue}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={attRejectSubmitWorkingOvertimeKeyTask}
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
)(AttRejectSubmitWorkingOvertime);
