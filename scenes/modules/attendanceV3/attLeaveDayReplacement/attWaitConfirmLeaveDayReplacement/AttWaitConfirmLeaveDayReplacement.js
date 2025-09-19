import React, { Component } from 'react';
import { View, Animated } from 'react-native';
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
import moment from 'moment';
import AttLeaveDayReplacementList from '../attLeaveDayReplacementList/AttLeaveDayReplacementList';
import { generateRowActionAndSelected, AttLeaveDayReplacementBusiness } from '../AttLeaveDayReplacementBusiness';
import AttLeaveDayReplacementAddOrEdit from '../AttLeaveDayReplacementAddOrEdit';

let configList = null,
    enumName = null,
    attWaitConfirmLeaveDayReplacement = null,
    attLeaveDayReplacement = null,
    attLeaveDayReplacementViewDetail = null,
    attWaitConfirmLeaveDayReplacementKeyTask = null,
    dataRowActionAndSelected= null,
    pageSizeList = 50;

class AttWaitConfirmLeaveDayReplacement extends Component {
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
        this.AttLeaveDayReplacementAddOrEdit = null;

        // animation filter
        this.scrollYAnimatedValue = new Animated.Value(0);

        this.storeParamsDefault = null;

        //biến lưu lại object filter
        this.paramsFilter = null;
        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // Trường hợp goBack từ detail thì phải gán lại this
            AttLeaveDayReplacementBusiness.setThisForBusiness(this, dataRowActionAndSelected?.rowActions);
            if (AttLeaveDayReplacementBusiness.checkForReLoadScreen[attWaitConfirmLeaveDayReplacement]) {
                this.reload();
            }
        });
    }

    onCreate = (item) => {
        if (item) {
            if (this.AttLeaveDayReplacementAddOrEdit && this.AttLeaveDayReplacementAddOrEdit.onShow) {
                this.AttLeaveDayReplacementAddOrEdit.onShow({
                    reload: this.reload,
                    record: item
                });
            }
        }
    };

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
                ...paramsFilter,
                Year:
                    paramsFilter && paramsFilter.Year
                        ? `${paramsFilter.Year}/01/01`
                        : `${parseInt(moment(new Date()).format('YYYY'))}/01/01`
            }
        };
        // set false when reloaded
        AttLeaveDayReplacementBusiness.checkForReLoadScreen[attWaitConfirmLeaveDayReplacement] = false;
        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: attWaitConfirmLeaveDayReplacementKeyTask,
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
        const _configList = configList[attWaitConfirmLeaveDayReplacement],
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
            tabEnum: 'E_PROCESSED',
            Year: `${parseInt(moment(new Date()).format('YYYY'))}/01/01`
        };
        dataRowActionAndSelected = generateRowActionAndSelected(attWaitConfirmLeaveDayReplacement);

        return {
            rowActions: dataRowActionAndSelected.rowActions,
            selected: dataRowActionAndSelected.selected,
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
                    keyTask: attWaitConfirmLeaveDayReplacementKeyTask,
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

    pagingRequest = page => {
        const { dataBody } = this.state;
        this.setState(
            {
                keyQuery: EnumName.E_PAGING
            },
            () => {
                startTask({
                    keyTask: attWaitConfirmLeaveDayReplacementKeyTask,
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
        if (nextProps.reloadScreenName == attWaitConfirmLeaveDayReplacementKeyTask) {
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
        if (!ConfigList.value[ScreenName.AttWaitConfirmLeaveDayReplacement]) {
            ConfigList.value[ScreenName.AttWaitConfirmLeaveDayReplacement] = {
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
                BusinessAction: [
                    {
                        Type: 'E_APPROVE',
                        Resource: {
                            Name: 'New_PortalV3_Att_DayOffNeedReplacement_BtnConfirm',
                            Rule: 'View'
                        },
                        Confirm: {
                            isInputText: false,
                            isValidInputText: false
                        }
                    }
                ]
            };
        }

        attWaitConfirmLeaveDayReplacement = ScreenName.AttWaitConfirmLeaveDayReplacement;
        attLeaveDayReplacement = ScreenName.AttLeaveDayReplacement;
        attLeaveDayReplacementViewDetail = ScreenName.AttLeaveDayReplacementViewDetail;
        attWaitConfirmLeaveDayReplacementKeyTask = EnumTask.KT_AttWaitConfirmLeaveDayReplacement;
        AttLeaveDayReplacementBusiness.checkForReLoadScreen[attWaitConfirmLeaveDayReplacement] = false;
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: attWaitConfirmLeaveDayReplacementKeyTask,
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
                {attWaitConfirmLeaveDayReplacement && attLeaveDayReplacementViewDetail && enumName && (
                    <View style={[styleSheets.containerGrey]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={{
                                ...styleContentFilterDesign,
                                ...styleContentFilterDesignV3
                            }}
                            screenName={attLeaveDayReplacement}
                            onSubmitEditing={this.reload}
                            tblName={'Filter_Register_Daily_Work '}
                            scrollYAnimatedValue={this.scrollYAnimatedValue}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <AttLeaveDayReplacementList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: attLeaveDayReplacementViewDetail,
                                        screenName: attLeaveDayReplacement,
                                        screenNameRender: attWaitConfirmLeaveDayReplacement
                                    }}
                                    scrollYAnimatedValue={this.scrollYAnimatedValue}
                                    rowActions={rowActions}
                                    selected={selected}
                                    groupField={groupField}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={attWaitConfirmLeaveDayReplacementKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    renderConfig={renderRow}
                                    onCreate={this.onCreate}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    valueField="ID"
                                    isShowBtnCreate={false}
                                />
                            )}
                        </View>
                        <AttLeaveDayReplacementAddOrEdit ref={refs => (this.AttLeaveDayReplacementAddOrEdit = refs)} />
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
)(AttWaitConfirmLeaveDayReplacement);
