import React, { Component } from 'react';
import { Animated, View } from 'react-native';
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
import { generateRowActionAndSelected, AttApproveWorkingOvertimeBusiness } from '../AttApproveWorkingOvertimeBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../../factories/BackGroundTask';
import SafeAreaViewDetail from '../../../../../../components/safeAreaView/SafeAreaViewDetail';

let configList = null,
    enumName = null,
    attCanceledWorkingOvertime = null,
    attApproveWorkingOvertimeViewDetail = null,
    attApprovedWorkingOvertime = null,
    keyListTask = null,
    pageSizeList = 20;

class AttCanceledWorkingOvertime extends Component {
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
        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // reload danh sách khi có approve hoặc reject dữ liệu
            AttApproveWorkingOvertimeBusiness.setThisForBusiness(this);
            if (AttApproveWorkingOvertimeBusiness.checkForReLoadScreen[attCanceledWorkingOvertime]) {
                this.reload();
            }
        });
    }

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
        // set false khi đã reload.
        AttApproveWorkingOvertimeBusiness.checkForReLoadScreen[attCanceledWorkingOvertime] = false;
        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: keyListTask,
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
        if (!attCanceledWorkingOvertime) {
            attCanceledWorkingOvertime = ScreenName.AttCanceledWorkingOvertime;
        }
        if (!configList[attCanceledWorkingOvertime]) {
            configList[attCanceledWorkingOvertime] = {
                Api: {
                    urlApi: '[URI_CENTER]/api/Att_OvertimePlan/New_PlanGetOvertimeApprovedByFilterHandle_App',
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

        const _configList = configList[attCanceledWorkingOvertime],
            renderRow = _configList[enumName.E_Row],
            filter = _configList[enumName.E_Filter],
            dataFromParams = this.checkDataFormNotify();

        const dataRowActionAndSelected = generateRowActionAndSelected(attCanceledWorkingOvertime);
        let _params = {
            ...dataFromParams,
            IsPortalNew: true,
            filter: filter,
            pageSize: pageSizeList,
            Status: 'E_CANCEL'
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
                    keyTask: keyListTask,
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
                    keyTask: keyListTask,
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
        if (nextProps.reloadScreenName == keyListTask) {
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

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    componentDidMount() {
        attCanceledWorkingOvertime = ScreenName.AttCanceledWorkingOvertime;
        attApprovedWorkingOvertime = ScreenName.AttApprovedWorkingOvertime;
        attApproveWorkingOvertimeViewDetail = ScreenName.AttApproveWorkingOvertimeViewDetail;
        keyListTask = EnumTask.KT_AttCanceledWorkingOvertime;
        AttApproveWorkingOvertimeBusiness.checkForReLoadScreen[attCanceledWorkingOvertime] = false;
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: keyListTask,
            payload: {
                ..._paramsDefault.dataBody,
                pageSize: pageSizeList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload,
                Status: 'E_CANCEL',
                skip: 0,
                take: 20
            }
        });
    }

    render() {
        const {
            dataBody,
            renderRow,
            rowActions,
            selected,
            isLazyLoading,
            isRefreshList,
            keyQuery,
            dataChange
        } = this.state;

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                {attCanceledWorkingOvertime && attApproveWorkingOvertimeViewDetail && enumName && (
                    <View style={[styleSheets.containerGrey]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={{
                                ...styleContentFilterDesign,
                                ...styleContentFilterDesignV3
                            }}
                            screenName={attApprovedWorkingOvertime}
                            onSubmitEditing={this.reload}
                            scrollYAnimatedValue={this.scrollYAnimatedValue}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <AttWorkingOvertimeList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: attApproveWorkingOvertimeViewDetail,
                                        screenName: attApprovedWorkingOvertime
                                    }}
                                    scrollYAnimatedValue={this.scrollYAnimatedValue}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={keyListTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi:
                                            '[URI_CENTER]/api/Att_OvertimePlan/New_PlanGetOvertimeApprovedByFilterHandle_App',
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
)(AttCanceledWorkingOvertime);
