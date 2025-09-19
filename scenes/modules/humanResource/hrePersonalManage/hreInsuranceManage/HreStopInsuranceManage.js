import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import HrePersonalManageList from '../hrePersonalManageList/HrePersonalManageList';
import {
    styleSheets,
    styleSafeAreaView,
    styleContentFilterDesign,
    styleContentFilterDesignV3
} from '../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../componentsV3/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';

let configList = null,
    enumName = null,
    hreStopInsuranceManage = null,
    hreStopInsuranceManageViewDetail = null,
    hreStopInsuranceManageKeyTask = null,
    pageSizeList = 50;

class HreStopInsuranceManage extends Component {
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

        // animation filter
        this.scrollYAnimatedValue = new Animated.Value(0);

        this.storeParamsDefault = null;

        //biến lưu lại object filter
        this.paramsFilter = null;

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // Trường hợp goBack từ detail thì phải gán lại this
            // AttSubmitWorkingOvertimeBusinessFunction.setThisForBusiness(this);
            // if (AttSubmitWorkingOvertimeBusinessFunction.checkForReLoadScreen[hreStopInsuranceManage]) {
            //     this.reload();
            // } else {
            //     
            // }
        });
    }

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
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
        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: hreStopInsuranceManageKeyTask,
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
        const _configList = configList[hreStopInsuranceManage],
            //orderBy = _configList[enumName.E_Order],
            renderRow = _configList[enumName.E_Row],
            filter = _configList[enumName.E_Filter],
            groupField = _configList[enumName.E_Field_Group] ? _configList[enumName.E_Field_Group] : null,
            dataFromParams = this.checkDataFormNotify();

        let _params = {
            ...dataFromParams,
            IsPortalNew: true,
            filter: filter,
            pageSize: pageSizeList,
            StatusSyn: 'E_STOP'
        };

        return {
            // rowActions: dataRowActionAndSelected.rowActions,
            // selected: dataRowActionAndSelected.selected,
            renderRow: renderRow,
            groupField: groupField,
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
                    keyTask: hreStopInsuranceManageKeyTask,
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
                    keyTask: hreStopInsuranceManageKeyTask,
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
        if (nextProps.reloadScreenName == hreStopInsuranceManageKeyTask) {
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
        if (!ConfigList.value[ScreenName.HreStopInsuranceManage]) {
            ConfigList.value[ScreenName.HreStopInsuranceManage] = {
                Api: {
                    urlApi: '[URI_CENTER]/api/Hre_ProfileAPI/New_GetProfileInsurancePortal',
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
                        Name: 'HealthInsNo',
                        DisplayKey: 'HRM_PortalApp_HealthInsNo',
                        DataType: 'string'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'SocialInsNo',
                        DisplayKey: 'HRM_PortalApp_SocialInsBookNo',
                        DataType: 'string'
                    }
                ],
                GroupField: [],
                BusinessAction: []
            };
        }

        hreStopInsuranceManage = ScreenName.HreStopInsuranceManage;
        hreStopInsuranceManageViewDetail = ScreenName.HreInsuranceManageViewDetail;
        hreStopInsuranceManageKeyTask = EnumTask.KT_HreStopInsuranceManage;
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: hreStopInsuranceManageKeyTask,
            payload: {
                ..._paramsDefault.dataBody,
                pageSize: pageSizeList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload,
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
            groupField,
            dataChange,
            renderRow
        } = this.state;

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                {hreStopInsuranceManage && hreStopInsuranceManageViewDetail && enumName && (
                    <View style={[styleSheets.containerGrey]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={{
                                ...styleContentFilterDesign,
                                ...styleContentFilterDesignV3
                            }}
                            screenName={hreStopInsuranceManage}
                            onSubmitEditing={this.reload}
                            scrollYAnimatedValue={this.scrollYAnimatedValue}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <HrePersonalManageList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: hreStopInsuranceManageViewDetail,
                                        screenName: hreStopInsuranceManage
                                    }}
                                    scrollYAnimatedValue={this.scrollYAnimatedValue}
                                    rowActions={rowActions}
                                    selected={selected}
                                    groupField={groupField}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={hreStopInsuranceManageKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    onCreate={this.onCreate}
                                    renderConfig={renderRow}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
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
)(HreStopInsuranceManage);
