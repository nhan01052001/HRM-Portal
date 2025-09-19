import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import ListRankingCompliment from '../rankingComimentList/ListRankingCompliment';
import {
    styleSheets,
    styleSafeAreaView,
    styleContentFilterDesign,
    styleContentFilterDesignV3,
    Colors
} from '../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import {
    generateRowActionAndSelected,
    HistoryOfComComplimentBusinessFunction
} from '../../historyOfComCompliment/HistoryOfComComplimentBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import { ConfigListFilter } from '../../../../../assets/configProject/ConfigListFilter';

let configList = null,
    enumName = null,
    rankingPeopleGiving = null,
    rankingPeopleGivingKeyTask = null,
    pageSizeList = 20;

class RankingPeopleGiving extends Component {
    constructor(props) {
        super(props);

        this.state = {
            SearchDate: {
                value: null,
                refresh: false,
                disable: false
            },
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

        this.AttSubmitTakeLeaveDayAddOrEdit = null;

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // Trường hợp goBack từ detail thì phải gán lại this
            HistoryOfComComplimentBusinessFunction.setThisForBusiness(this);
            if (HistoryOfComComplimentBusinessFunction.checkForReLoadScreen[rankingPeopleGiving]) {
                this.reload();
            }
        });
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
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

        // set false when reloaded
        HistoryOfComComplimentBusinessFunction.checkForReLoadScreen[rankingPeopleGiving] = false;

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: rankingPeopleGivingKeyTask,
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
            { NotificationID } = typeof params == 'object' ? params : JSON.parse(params);
        return NotificationID ? NotificationID : null;
    };

    paramsDefault = () => {
        if (!rankingPeopleGiving) {
            rankingPeopleGiving = ScreenName.RankingPeopleGiving;
        }
        if (!configList[rankingPeopleGiving]) {
            configList[rankingPeopleGiving] = {
                Api: {
                    urlApi: '[URI_HR]/Com_GetData/GetComplimentRankPraiser',
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

        const _configList = configList[rankingPeopleGiving],
            filter = _configList[enumName.E_Filter];

        const dataRowActionAndSelected = generateRowActionAndSelected(rankingPeopleGiving);
        let _params = {
            // IsPortal: true,
            // sort: orderBy,
            IsPortalNew: true,
            filter: filter,
            pageSize: pageSizeList,
            NotificationID: this.checkDataFormNotify()
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
                    keyTask: rankingPeopleGivingKeyTask,
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
                    keyTask: rankingPeopleGivingKeyTask,
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
        if (nextProps.reloadScreenName == rankingPeopleGivingKeyTask) {
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
        PermissionForAppMobile.value = {
            ...PermissionForAppMobile.value,
            HistoryOfBeComCompliment_New_Index_btnSendMail: {
                View: true
            }
        };

        rankingPeopleGiving = ScreenName.RankingPeopleGiving;
        rankingPeopleGivingKeyTask = EnumTask.KT_RankingPeopleGiving;
        HistoryOfComComplimentBusinessFunction.checkForReLoadScreen[rankingPeopleGiving] = false;
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: rankingPeopleGivingKeyTask,
            payload: {
                ..._paramsDefault.dataBody,
                pageSize: pageSizeList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload,
                Status: null,
                skip: 0,
                take: 20
            }
        });
    }

    render() {
        const { dataBody, rowActions, selected, isLazyLoading, isRefreshList, keyQuery, dataChange } = this.state;

        ConfigListFilter.value[rankingPeopleGiving] = {
            ...ConfigListFilter.value[rankingPeopleGiving],
            RankingPeopleGiving: {
                FilterCommon: {
                    fieldName: 'Key',
                    placeholder: ['ProfileNameUpercase'],
                    ClassStyle: ''
                },
                FilterAdvance: [
                    {
                        ControlGroup: []
                    }
                ]
            }
        };

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                {rankingPeopleGiving && enumName && (
                    <View style={[styleSheets.containerGrey]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={{
                                ...styleContentFilterDesign,
                                contentFilter: {
                                    ...styleContentFilterDesign.contentFilter,
                                    backgroundColor: Colors.white,
                                    paddingHorizontal: 12
                                },
                                viewFilter: styleContentFilterDesignV3.viewFilter,
                                filter: {
                                    ...styleContentFilterDesignV3.filter
                                },
                                search: {
                                    ...styleContentFilterDesign.search,
                                    backgroundColor: Colors.gray_3
                                }
                            }}
                            screenName={rankingPeopleGiving}
                            onSubmitEditing={this.reload}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <ListRankingCompliment
                                    detail={{
                                        dataLocal: false,
                                        screenName: rankingPeopleGiving,
                                        screenNameRender: ScreenName.RankingPeopleGiving
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={rankingPeopleGivingKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    color="blue"
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Com_GetData/GetComplimentRankPraiser',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: pageSizeList
                                    }}
                                    valueField="ID"
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

export default connect(mapStateToProps, null)(RankingPeopleGiving);
