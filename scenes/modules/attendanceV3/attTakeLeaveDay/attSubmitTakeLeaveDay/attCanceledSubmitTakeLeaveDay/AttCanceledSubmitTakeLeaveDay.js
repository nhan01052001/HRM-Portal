import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import AttTakeLeaveDayList from '../../attTakeLeaveDayList/AttTakeLeaveDayList';
import {
    styleSheets,
    styleSafeAreaView,
    styleContentFilterDesign,
    styleContentFilterDesignV3
} from '../../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../../componentsV3/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../../../assets/constant';
import { generateRowActionAndSelected, AttSubmitTakeLeaveDayBusinessFunction } from '../AttSubmitTakeLeaveDayBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../../factories/BackGroundTask';
import AttSubmitTakeLeaveDayAddOrEdit from '../AttSubmitTakeLeaveDayAddOrEdit';
import SafeAreaViewDetail from '../../../../../../components/safeAreaView/SafeAreaViewDetail';

let configList = null,
    enumName = null,
    attCanceledSubmitTakeLeaveDay = null,
    attSubmitTakeLeaveDay = null,
    attSubmitTakeLeaveDayViewDetail = null,
    attCanceledSubmitTakeLeaveDayKeyTask = null,
    pageSizeList = 20;

class AttCanceledSubmitTakeLeaveDay extends Component {
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

        this.AttSubmitTakeLeaveDayAddOrEdit = null;

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // Trường hợp goBack từ detail thì phải gán lại this
            AttSubmitTakeLeaveDayBusinessFunction.setThisForBusiness(this);
            if (AttSubmitTakeLeaveDayBusinessFunction.checkForReLoadScreen[attCanceledSubmitTakeLeaveDay]) {
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
        if (this.AttSubmitTakeLeaveDayAddOrEdit && this.AttSubmitTakeLeaveDayAddOrEdit.onShow) {
            this.AttSubmitTakeLeaveDayAddOrEdit.onShow({
                reload: this.reload,
                record: null
            });
        }
    };

    onEdit = item => {
        if (item) {

            if (this.AttSubmitTakeLeaveDayAddOrEdit && this.AttSubmitTakeLeaveDayAddOrEdit.onShow) {
                this.AttSubmitTakeLeaveDayAddOrEdit.onShow({
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
        AttSubmitTakeLeaveDayBusinessFunction.checkForReLoadScreen[attCanceledSubmitTakeLeaveDay] = false;

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: attCanceledSubmitTakeLeaveDayKeyTask,
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
        if (!attCanceledSubmitTakeLeaveDay) {
            attCanceledSubmitTakeLeaveDay = ScreenName.AttCanceledSubmitTakeLeaveDay;
        }
        if (!configList[attCanceledSubmitTakeLeaveDay]) {
            configList[attCanceledSubmitTakeLeaveDay] = {
                Api: {
                    urlApi: '[URI_CENTER]/api/Att_LeaveDay/New_GetPersonalLeaveDayHandle_App',
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

        const _configList = configList[attCanceledSubmitTakeLeaveDay],
            filter = _configList[enumName.E_Filter],
            dataFromParams = this.checkDataFormNotify();

        const dataRowActionAndSelected = generateRowActionAndSelected(attCanceledSubmitTakeLeaveDay);
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
                    keyTask: attCanceledSubmitTakeLeaveDayKeyTask,
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
                    keyTask: attCanceledSubmitTakeLeaveDayKeyTask,
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
        if (nextProps.reloadScreenName == attCanceledSubmitTakeLeaveDayKeyTask) {
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
        attCanceledSubmitTakeLeaveDay = ScreenName.AttCanceledSubmitTakeLeaveDay;
        attSubmitTakeLeaveDay = ScreenName.AttSubmitTakeLeaveDay;
        attSubmitTakeLeaveDayViewDetail = ScreenName.AttSubmitTakeLeaveDayViewDetail;
        attCanceledSubmitTakeLeaveDayKeyTask = EnumTask.KT_AttCanceledSubmitTakeLeaveDay;
        AttSubmitTakeLeaveDayBusinessFunction.checkForReLoadScreen[attCanceledSubmitTakeLeaveDay] = false;
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: attCanceledSubmitTakeLeaveDayKeyTask,
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
                {attCanceledSubmitTakeLeaveDay && attSubmitTakeLeaveDayViewDetail && enumName && (
                    <View style={[styleSheets.containerGrey]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={{
                                ...styleContentFilterDesign,
                                ...styleContentFilterDesignV3
                            }}
                            screenName={attSubmitTakeLeaveDay}
                            onSubmitEditing={this.reload}
                            scrollYAnimatedValue={this.scrollYAnimatedValue}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <AttTakeLeaveDayList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: attSubmitTakeLeaveDayViewDetail,
                                        screenName: attSubmitTakeLeaveDay,
                                        screenNameRender: attCanceledSubmitTakeLeaveDay
                                    }}
                                    scrollYAnimatedValue={this.scrollYAnimatedValue}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={attCanceledSubmitTakeLeaveDayKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    onCreate={this.onCreate}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_CENTER]/api/Att_LeaveDay/New_GetPersonalLeaveDayHandle_App',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: pageSizeList
                                    }}
                                    valueField="ID"
                                />
                            )}
                        </View>

                        <AttSubmitTakeLeaveDayAddOrEdit ref={refs => (this.AttSubmitTakeLeaveDayAddOrEdit = refs)} />
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
)(AttCanceledSubmitTakeLeaveDay);
