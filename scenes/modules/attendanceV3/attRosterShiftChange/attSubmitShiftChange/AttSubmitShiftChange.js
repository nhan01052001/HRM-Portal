import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import AttShiftChangeList from '../attShiftChangeList/AttShiftChangeList';
import {
    styleSheets,
    styleSafeAreaView,
    styleContentFilterDesign,
    styleContentFilterDesignV3
} from '../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../componentsV3/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import { generateRowActionAndSelected, AttSubmitShiftChangeBusinessFunction } from './AttSubmitShiftChangeBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import AttSubmitShiftChangeAddOrEdit from './AttSubmitShiftChangeAddOrEdit';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';

let configList = null,
    enumName = null,
    attSubmitShiftChange = null,
    attSubmitShiftChangeViewDetail = null,
    attSubmitShiftChangeKeyTask = null,
    pageSizeList = 20;

class AttSubmitShiftChange extends Component {
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

        this.AttSubmitShiftChangeAddOrEdit = null;

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // Trường hợp goBack từ detail thì phải gán lại this
            AttSubmitShiftChangeBusinessFunction.setThisForBusiness(this);
            if (AttSubmitShiftChangeBusinessFunction.checkForReLoadScreen[attSubmitShiftChange]) {
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
        if (this.AttSubmitShiftChangeAddOrEdit && this.AttSubmitShiftChangeAddOrEdit.onShow) {
            this.AttSubmitShiftChangeAddOrEdit.onShow({
                reload: this.reload,
                record: null
            });
            // this.AttSubmitShiftChangeAddOrEdit.onChangeDateFromTo({ startDate: '2023-03-11', endDate: '2023-03-14' });
        }
    };

    onEdit = (item) => {
        if (item) {
            if (this.AttSubmitShiftChangeAddOrEdit && this.AttSubmitShiftChangeAddOrEdit.onShow) {
                this.AttSubmitShiftChangeAddOrEdit.onShow({
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
        console.log(paramsFilter, this.paramsFilter, 'paramsFilter');

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
        AttSubmitShiftChangeBusinessFunction.checkForReLoadScreen[attSubmitShiftChange] = false;

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: attSubmitShiftChangeKeyTask,
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
        if (!attSubmitShiftChange) {
            attSubmitShiftChange = ScreenName.AttSubmitShiftChange;
        }
        if (!configList[attSubmitShiftChange]) {
            configList[attSubmitShiftChange] = {
                Api: {
                    urlApi: '[URI_CENTER]/api/Att_Roster/GetRosterByFilter_App',
                    type: 'POST',
                    pageSize: 20
                },
                Row: [
                    {
                        TypeView: 'E_COMMON',
                        Name: 'DateStart',
                        NameSecond: 'DateEnd',
                        DisplayKey: 'HRM_PortalApp_ShiftChangeDate',
                        DataType: 'DateToFrom',
                        DataFormat: 'DD/MM/YYYY'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'ChangeShiftTypeView',
                        DisplayKey: 'HRM_PortalApp_TypeChangeShift',
                        DataType: 'string'
                    }
                ],
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
                        Type: 'E_MODIFY',
                        Resource: {
                            Name: 'New_Att_Roster_New_Index_V2',
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
                            Name: 'New_Att_Roster_New_Index_V2',
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
                            Name: 'New_Att_Roster_New_Index_btnSendMail',
                            Rule: 'View'
                        }
                    },
                    {
                        Type: 'E_CANCEL',
                        Resource: {
                            Name: 'New_Att_Roster_New_Index_btnCancel',
                            Rule: 'View'
                        },
                        Confirm: {
                            isInputText: true,
                            isValidInputText: false
                        }
                    }
                ]
            };
        }

        const _configList = configList[attSubmitShiftChange],
            renderRow = _configList[enumName.E_Row],
            filter = _configList[enumName.E_Filter],
            dataFromParams = this.checkDataFormNotify();

        const dataRowActionAndSelected = generateRowActionAndSelected(attSubmitShiftChange);
        let _params = {
            ...dataFromParams,
            IsPortalNew: true,
            filter: filter,
            pageSize: pageSizeList,
            Status: null
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
                    keyTask: attSubmitShiftChangeKeyTask,
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
                    keyTask: attSubmitShiftChangeKeyTask,
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
        if (nextProps.reloadScreenName == attSubmitShiftChangeKeyTask) {
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
        attSubmitShiftChange = ScreenName.AttSubmitShiftChange;
        attSubmitShiftChangeViewDetail = ScreenName.AttSubmitShiftChangeViewDetail;
        attSubmitShiftChangeKeyTask = EnumTask.KT_AttSubmitShiftChange;
        AttSubmitShiftChangeBusinessFunction.checkForReLoadScreen[attSubmitShiftChange] = false;
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: attSubmitShiftChangeKeyTask,
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
        const { dataBody, rowActions, selected, isLazyLoading, isRefreshList, keyQuery, dataChange, renderRow } =
            this.state;

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                {attSubmitShiftChange && attSubmitShiftChangeViewDetail && enumName && (
                    <View style={[styleSheets.containerGrey]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={{
                                ...styleContentFilterDesign,
                                ...styleContentFilterDesignV3
                            }}
                            screenName={attSubmitShiftChange}
                            onSubmitEditing={this.reload}
                            scrollYAnimatedValue={this.scrollYAnimatedValue}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <AttShiftChangeList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: attSubmitShiftChangeViewDetail,
                                        screenName: attSubmitShiftChange,
                                        screenNameRender: ScreenName.AttSubmitShiftChange
                                    }}
                                    scrollYAnimatedValue={this.scrollYAnimatedValue}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={attSubmitShiftChangeKeyTask}
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
                                    renderConfig={renderRow}
                                />
                            )}
                        </View>

                        <AttSubmitShiftChangeAddOrEdit ref={(refs) => (this.AttSubmitShiftChangeAddOrEdit = refs)} />
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

export default connect(mapStateToProps, null)(AttSubmitShiftChange);
