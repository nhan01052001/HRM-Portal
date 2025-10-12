import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import AttTakeLateEarlyAllowedList from '../../attTakeLateEarlyAllowedList/AttTakeLateEarlyAllowedList';
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
    AttSubmitTakeLateEarlyAllowedBusinessFunction
} from '../AttSubmitTakeLateEarlyAllowedBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../../factories/BackGroundTask';
import AttSubmitTakeLateEarlyAllowedAddOrEdit from '../AttSubmitTakeLateEarlyAllowedAddOrEdit';
import SafeAreaViewDetail from '../../../../../../components/safeAreaView/SafeAreaViewDetail';

let configList = null,
    enumName = null,
    attCanceledSubmitTakeLateEarlyAllowed = null,
    attSubmitTakeLateEarlyAllowed = null,
    attSubmitTakeLateEarlyAllowedViewDetail = null,
    attCanceledSubmitTakeLateEarlyAllowedKeyTask = null,
    pageSizeList = 20;

class AttCanceledSubmitTakeLateEarlyAllowed extends Component {
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

        this.AttSubmitTakeLateEarlyAllowedAddOrEdit = null;

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // Trường hợp goBack từ detail thì phải gán lại this
            AttSubmitTakeLateEarlyAllowedBusinessFunction.setThisForBusiness(this);
            if (
                AttSubmitTakeLateEarlyAllowedBusinessFunction.checkForReLoadScreen[
                    attCanceledSubmitTakeLateEarlyAllowed
                ]
            ) {
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
        if (this.AttSubmitTakeLateEarlyAllowedAddOrEdit && this.AttSubmitTakeLateEarlyAllowedAddOrEdit.onShow) {
            this.AttSubmitTakeLateEarlyAllowedAddOrEdit.onShow({
                reload: this.reload,
                record: null
            });
        }
    };

    onEdit = item => {
        if (item) {
            if (this.AttSubmitTakeLateEarlyAllowedAddOrEdit && this.AttSubmitTakeLateEarlyAllowedAddOrEdit.onShow) {
                this.AttSubmitTakeLateEarlyAllowedAddOrEdit.onShow({
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
        AttSubmitTakeLateEarlyAllowedBusinessFunction.checkForReLoadScreen[
            attCanceledSubmitTakeLateEarlyAllowed
        ] = false;

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: attCanceledSubmitTakeLateEarlyAllowedKeyTask,
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
        if (!attCanceledSubmitTakeLateEarlyAllowed) {
            attCanceledSubmitTakeLateEarlyAllowed = ScreenName.AttCanceledSubmitTakeLateEarlyAllowed;
        }
        if (!configList[attCanceledSubmitTakeLateEarlyAllowed]) {
            configList[attCanceledSubmitTakeLateEarlyAllowed] = {
                Api: {
                    urlApi: '[URI_CENTER]/api/Att_LateEarlyAllowed/GetLateEarlyAllowedByFilterHandle_App',
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

        const _configList = configList[attCanceledSubmitTakeLateEarlyAllowed],
            filter = _configList[enumName.E_Filter],
            dataFromParams = this.checkDataFormNotify();

        const dataRowActionAndSelected = generateRowActionAndSelected(attCanceledSubmitTakeLateEarlyAllowed);
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
                    keyTask: attCanceledSubmitTakeLateEarlyAllowedKeyTask,
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
                    keyTask: attCanceledSubmitTakeLateEarlyAllowedKeyTask,
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
        if (nextProps.reloadScreenName == attCanceledSubmitTakeLateEarlyAllowedKeyTask) {
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
        attCanceledSubmitTakeLateEarlyAllowed = ScreenName.AttCanceledSubmitTakeLateEarlyAllowed;
        attSubmitTakeLateEarlyAllowed = ScreenName.AttSubmitTakeLateEarlyAllowed;
        attSubmitTakeLateEarlyAllowedViewDetail = ScreenName.AttSubmitTakeLateEarlyAllowedViewDetail;
        attCanceledSubmitTakeLateEarlyAllowedKeyTask = EnumTask.KT_AttCanceledSubmitTakeLateEarlyAllowed;
        AttSubmitTakeLateEarlyAllowedBusinessFunction.checkForReLoadScreen[
            attCanceledSubmitTakeLateEarlyAllowed
        ] = false;
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: attCanceledSubmitTakeLateEarlyAllowedKeyTask,
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
            rowActions,
            selected,
            isLazyLoading,
            isRefreshList,
            keyQuery,
            dataChange
        } = this.state;

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                {attCanceledSubmitTakeLateEarlyAllowed && attSubmitTakeLateEarlyAllowedViewDetail && enumName && (
                    <View style={[styleSheets.containerGrey]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={{
                                ...styleContentFilterDesign,
                                ...styleContentFilterDesignV3
                            }}
                            screenName={attSubmitTakeLateEarlyAllowed}
                            onSubmitEditing={this.reload}
                            scrollYAnimatedValue={this.scrollYAnimatedValue}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <AttTakeLateEarlyAllowedList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: attSubmitTakeLateEarlyAllowedViewDetail,
                                        screenName: attSubmitTakeLateEarlyAllowed,
                                        screenNameRender: attCanceledSubmitTakeLateEarlyAllowed
                                    }}
                                    scrollYAnimatedValue={this.scrollYAnimatedValue}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={attCanceledSubmitTakeLateEarlyAllowedKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    onCreate={this.onCreate}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi:
                                            '[URI_CENTER]/api/Att_LateEarlyAllowed/GetLateEarlyAllowedByFilterHandle_App',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: pageSizeList
                                    }}
                                    valueField="ID"
                                />
                            )}
                        </View>

                        <AttSubmitTakeLateEarlyAllowedAddOrEdit
                            ref={refs => (this.AttSubmitTakeLateEarlyAllowedAddOrEdit = refs)}
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
)(AttCanceledSubmitTakeLateEarlyAllowed);
