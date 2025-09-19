import React, { Component } from 'react';
import { View } from 'react-native';
import HreTerminationOfWorkList from '../../hreTerminationOfWorkList/HreTerminationOfWorkList';
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
    HreApproveTerminationOfWorkBusinessFunction
} from '../HreApproveTerminationOfWorkBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../../factories/BackGroundTask';
import { Animated } from 'react-native';
import SafeAreaViewDetail from '../../../../../../components/safeAreaView/SafeAreaViewDetail';
import { ConfigListFilter } from '../../../../../../assets/configProject/ConfigListFilter';

let configList = null,
    enumName = null,
    hreRejectTerminationOfWork = null,
    hreApproveTerminationOfWork = null,
    hreApproveTerminationOfWorkViewDetail = null,
    keyListTask = null,
    pageSizeList = 20;

class HreRejectTerminationOfWork extends Component {
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
            HreApproveTerminationOfWorkBusinessFunction.setThisForBusiness(this);
            if (HreApproveTerminationOfWorkBusinessFunction.checkForReLoadScreen[hreRejectTerminationOfWork]) {
                this.reload();
            }
        });
    }

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
        // set false khi đã reload.
        HreApproveTerminationOfWorkBusinessFunction.checkForReLoadScreen[hreRejectTerminationOfWork] = false;
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
        if (!hreRejectTerminationOfWork) {
            hreRejectTerminationOfWork = ScreenName.HreRejectTerminationOfWork;
        }
        if (!configList[hreRejectTerminationOfWork]) {
            configList[hreRejectTerminationOfWork] = {
                Api: {
                    urlApi: '[URI_CENTER]/api/Hre_StopWorking/New_GetStopWorkingApprovedNewPortal',
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
                Row: [
                    {
                        TypeView: 'E_COMMON',
                        Name: 'DateStop',
                        DisplayKey: 'HRM_PortalApp_TerminationOfWork_DateStopWork',
                        DataType: 'DateTime',
                        DataFormat: 'DD/MM/YYYY'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'TypeOfStopName',
                        DisplayKey: 'HRM_PortalApp_TerminationOfWork_TypeStopWork',
                        DataType: 'string'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'ResignReasonName',
                        DisplayKey: 'HRM_PortalApp_TerminationOfWork_ReasonStopWork',
                        DataType: 'string'
                    },
                    {
                        TypeView: 'E_STATUS',
                        Name: 'Status',
                        DisplayKey: 'HRM_Attendance_Overtime_OvertimeList_Status',
                        DataType: 'string'
                    }
                ],
                BusinessAction: []
            };
        }

        const _configList = configList[hreRejectTerminationOfWork],
            renderRow = _configList[enumName.E_Row],
            filter = _configList[enumName.E_Filter],
            dataFromParams = this.checkDataFormNotify();

        const dataRowActionAndSelected = generateRowActionAndSelected(hreRejectTerminationOfWork);
        let _params = {
            ...dataFromParams,
            IsPortalNew: true,
            filter: filter,
            pageSize: pageSizeList,
            StatusSyn: 'E_REJECT',
            tabAll: false,
            tabEnum: 'HR_TAB_DENIED'
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
        hreRejectTerminationOfWork = ScreenName.HreRejectTerminationOfWork;
        hreApproveTerminationOfWork = ScreenName.HreApproveTerminationOfWork;
        hreApproveTerminationOfWorkViewDetail = ScreenName.HreApproveTerminationOfWorkViewDetail;
        keyListTask = EnumTask.KT_HreRejectTerminationOfWork;
        HreApproveTerminationOfWorkBusinessFunction.checkForReLoadScreen[hreRejectTerminationOfWork] = false;
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        let _paramsDefault = this.paramsDefault(),
            paramStore = { ..._paramsDefault, dataBody: { ..._paramsDefault.dataBody } },
            dataFromParams = this.checkDataFormNotify();

        // xoa filter defaule
        Object.keys(dataFromParams).forEach((key) => {
            paramStore.dataBody[key] = null;
        });

        this.storeParamsDefault = paramStore;
        this.setState(ConfigListFilter.value[hreRejectTerminationOfWork] ? _paramsDefault : paramStore);

        startTask({
            keyTask: keyListTask,
            payload: {
                ..._paramsDefault.dataBody,
                pageSize: pageSizeList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload,
                StatusSyn: 'E_REJECT',
                skip: 0,
                take: 20,
                tabAll: false,
                tabEnum: 'HR_TAB_DENIED'
            }
        });
    }

    render() {
        const { dataBody, renderRow, rowActions, selected, isLazyLoading, isRefreshList, keyQuery, dataChange } =
            this.state;

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                {hreRejectTerminationOfWork && hreApproveTerminationOfWorkViewDetail && enumName && (
                    <View style={[styleSheets.containerGrey]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={{
                                ...styleContentFilterDesign,
                                ...styleContentFilterDesignV3
                            }}
                            screenName={hreApproveTerminationOfWork}
                            onSubmitEditing={this.reload}
                            scrollYAnimatedValue={this.scrollYAnimatedValue}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <HreTerminationOfWorkList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: hreApproveTerminationOfWorkViewDetail,
                                        screenName: hreApproveTerminationOfWork
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
                                        urlApi: '[URI_CENTER]/api/Hre_StopWorking/New_GetStopWorkingApprovedNewPortal',
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

const mapStateToProps = (state) => {
    return {
        reloadScreenName: state.lazyLoadingReducer.reloadScreenName,
        isChange: state.lazyLoadingReducer.isChange,
        message: state.lazyLoadingReducer.message
    };
};

export default connect(mapStateToProps, null)(HreRejectTerminationOfWork);
