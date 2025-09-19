import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import AttDelegationApprovalList from '../../attDelegationApprovalList/AttDelegationApprovalList';
import {
    styleSheets,
    styleSafeAreaView,
    styleContentFilterDesign,
    styleContentFilterDesignV3
} from '../../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../../componentsV3/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../../../assets/constant';
import { generateRowActionAndSelected, AttSubmitDelegationApprovalBusiness } from '../AttSubmitDelegationApprovalBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../../factories/BackGroundTask';
import AttSubmitDelegationApprovalAddOrEdit from '../AttSubmitDelegationApprovalAddOrEdit';
import SafeAreaViewDetail from '../../../../../../components/safeAreaView/SafeAreaViewDetail';

let configList = null,
    enumName = null,
    attRejectSubmitDelegationApproval = null,
    AttSubmitDelegationApproval = null,
    attSubmitDelegationApprovalViewDetail = null,
    attRejectDelegationApprovalKeyTask = null,
    dataRowActionAndSelected = null,
    pageSizeList = 20;

class AttRejectSubmitDelegationApproval extends Component {
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

        this.AttSubmitDelegationApprovalAddOrEdit = null;

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // Trường hợp goBack từ detail thì phải gán lại this
            AttSubmitDelegationApprovalBusiness.setThisForBusiness(this, false, dataRowActionAndSelected?.rowActions);
            if (AttSubmitDelegationApprovalBusiness.checkForReLoadScreen[attRejectSubmitDelegationApproval]) {
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
        if (this.AttSubmitDelegationApprovalAddOrEdit && this.AttSubmitDelegationApprovalAddOrEdit.onShow) {
            this.AttSubmitDelegationApprovalAddOrEdit.onShow({
                reload: this.reload,
                record: null
            });
        }
    };

    onEdit = item => {
        if (item) {
            if (this.AttSubmitDelegationApprovalAddOrEdit && this.AttSubmitDelegationApprovalAddOrEdit.onShow) {
                this.AttSubmitDelegationApprovalAddOrEdit.onShow({
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
        AttSubmitDelegationApprovalBusiness.checkForReLoadScreen[attRejectSubmitDelegationApproval] = false;

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: attRejectDelegationApprovalKeyTask,
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
        if (!attRejectSubmitDelegationApproval) {
            attRejectSubmitDelegationApproval = ScreenName.AttRejectSubmitDelegationApproval;
        }
        if (!configList[attRejectSubmitDelegationApproval]) {
            configList[attRejectSubmitDelegationApproval] = {
                Api: {
                    urlApi: '[URI_HR]/Att_GetData/New_GetDelegateApproveList',
                    type: 'POST',
                    pageSize: 20
                },
                Row: [
                    {
                        TypeView: 'E_STATUS',
                        Name: 'Status',
                        DisplayKey: '',
                        DataType: 'string'
                    },
                    {
                        TypeView: 'E_PROFILE',
                        Name: 'E_DEPARTMENT'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'DataTypeDelegateView',
                        DisplayKey: 'HRM_PortalApp_Process',
                        DataType: 'string'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'DateFrom',
                        NameSecond: 'DateTo',
                        DisplayKey: 'HRM_PortalApp_Authorizationeriod',
                        DataType: 'DateToFrom',
                        DataFormat: 'DD/MM/YYYY'
                    }
                ],
                Order: [
                    {
                        field: 'DateUpdate',
                        dir: 'desc'
                    }
                ],
                BusinessAction: []
            };
        }

        const _configList = configList[attRejectSubmitDelegationApproval],
            renderRow = _configList[enumName.E_Row],
            filter = _configList[enumName.E_Filter],
            dataFromParams = this.checkDataFormNotify();

        dataRowActionAndSelected = generateRowActionAndSelected(attRejectSubmitDelegationApproval);
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
            renderRow: renderRow,
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
                    keyTask: attRejectDelegationApprovalKeyTask,
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
                    keyTask: attRejectDelegationApprovalKeyTask,
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
        if (nextProps.reloadScreenName == attRejectDelegationApprovalKeyTask) {
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
        attRejectSubmitDelegationApproval = ScreenName.AttRejectSubmitDelegationApproval;
        AttSubmitDelegationApproval = ScreenName.AttSubmitDelegationApproval;
        attSubmitDelegationApprovalViewDetail = ScreenName.AttSubmitDelegationApprovalViewDetail;
        attRejectDelegationApprovalKeyTask = EnumTask.KT_AttRejectSubmitDelegationApproval;
        AttSubmitDelegationApprovalBusiness.checkForReLoadScreen[attRejectSubmitDelegationApproval] = false;
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: attRejectDelegationApprovalKeyTask,
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
            dataChange,
            renderRow
        } = this.state;

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                {attRejectSubmitDelegationApproval && attSubmitDelegationApprovalViewDetail && enumName && (
                    <View style={[styleSheets.containerGrey]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={{
                                ...styleContentFilterDesign,
                                ...styleContentFilterDesignV3
                            }}
                            screenName={AttSubmitDelegationApproval}
                            onSubmitEditing={this.reload}
                            scrollYAnimatedValue={this.scrollYAnimatedValue}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <AttDelegationApprovalList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: attSubmitDelegationApprovalViewDetail,
                                        screenName: AttSubmitDelegationApproval,
                                        screenNameRender: attRejectSubmitDelegationApproval
                                    }}
                                    scrollYAnimatedValue={this.scrollYAnimatedValue}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={attRejectDelegationApprovalKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    onCreate={this.onCreate}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Att_GetData/New_GetDelegateApproveList',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: pageSizeList
                                    }}
                                    valueField="ID"
                                    renderConfig={renderRow}
                                />
                            )}
                        </View>

                        <AttSubmitDelegationApprovalAddOrEdit
                            ref={refs => (this.AttSubmitDelegationApprovalAddOrEdit = refs)}
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
)(AttRejectSubmitDelegationApproval);
