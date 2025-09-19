import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import HreTerminationOfWorkList from '../hreTerminationOfWorkList/HreTerminationOfWorkList';
import {
    styleSheets,
    styleSafeAreaView,
    styleContentFilterDesign,
    styleContentFilterDesignV3
} from '../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../componentsV3/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import {
    generateRowActionAndSelected,
    HreSubmitTerminationOfWorkBusinessFunction
} from './HreSubmitTerminationOfWorkBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';
import HreSubmitTerminationOfWorkAddOrEdit from './HreSubmitTerminationOfWorkAddOrEdit';
import SafeAreaViewDetail from '../../../../../components/safeAreaView/SafeAreaViewDetail';
import HttpService from '../../../../../utils/HttpService';
import { ConfigListFilter } from '../../../../../assets/configProject/ConfigListFilter';

let configList = null,
    enumName = null,
    hreSubmitTerminationOfWork = null,
    hreSubmitTerminationOfWorkViewDetail = null,
    hreSubmitTerminationOfWorkKeyTask = null,
    pageSizeList = 20;

class HreSubmitTerminationOfWork extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataBody: null,
            rowActions: [],
            renderRow: [],
            selected: [],
            isRefreshList: false,
            isLazyLoading: false,
            keyQuery: null,
            dataChange: false, //biến check dữ liệu có thay đổi hay không
            isShowHideCreate: true
        };

        // animation filter
        this.scrollYAnimatedValue = new Animated.Value(0);

        this.storeParamsDefault = null;

        //biến lưu lại object filter
        this.paramsFilter = null;

        this.HreSubmitTerminationOfWorkAddOrEdit = null;

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // Trường hợp goBack từ detail thì phải gán lại this
            HreSubmitTerminationOfWorkBusinessFunction.setThisForBusiness(this);
            if (HreSubmitTerminationOfWorkBusinessFunction.checkForReLoadScreen[hreSubmitTerminationOfWork]) {
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
        if (this.HreSubmitTerminationOfWorkAddOrEdit && this.HreSubmitTerminationOfWorkAddOrEdit.onShow) {
            this.HreSubmitTerminationOfWorkAddOrEdit.onShow({
                reload: this.reload,
                record: null
            });
        }
    };

    onEdit = (item) => {
        if (item) {
            if (this.HreSubmitTerminationOfWorkAddOrEdit && this.HreSubmitTerminationOfWorkAddOrEdit.onShow) {
                this.HreSubmitTerminationOfWorkAddOrEdit.onShow({
                    reload: this.reload,
                    record: item
                });
            }
        }
    };

    reload = async (paramsFilter) => {
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
        HreSubmitTerminationOfWorkBusinessFunction.checkForReLoadScreen[hreSubmitTerminationOfWork] = false;
        const isShowBtnCreate = await this.checkShowCreate();
        // Gửi yêu cầu lọc dữ liệu
        this.setState(
            {
                ..._paramsDefault,
                isShowHideCreate: isShowBtnCreate.Status == EnumName.E_SUCCESS ? isShowBtnCreate.Data : false
            },
            () => {
                const { dataBody, keyQuery } = this.state;
                startTask({
                    keyTask: hreSubmitTerminationOfWorkKeyTask,
                    payload: {
                        ...dataBody,
                        keyQuery: keyQuery,
                        isCompare: false,
                        reload: this.reload
                    }
                });
            }
        );
    };

    checkDataFormNotify = () => {
        const { params = {} } = this.props.navigation.state,
            _params = typeof params == 'object' ? params : JSON.parse(params);
        return _params;
    };

    checkShowCreate = () => {
        return HttpService.Post('[URI_CENTER]/api/Hre_StopWorking/CheckAddStopWorking');
    };

    paramsDefault = async () => {
        if (!configList[hreSubmitTerminationOfWork]) {
            configList[hreSubmitTerminationOfWork] = {
                Api: {
                    urlApi: '[URI_CENTER]/api/Hre_StopWorking/New_GetStopWorkingNewPortal',
                    type: 'POST',
                    pageSize: 20
                },
                Order: [
                    {
                        field: 'DateUpdate',
                        dir: 'desc'
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
                        Name: 'LastWorkingDay',
                        DisplayKey: 'HRM_HR_Profile_LastWorkingDate',
                        DataType: 'DateTime',
                        DataFormat: 'DD/MM/YYYY'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'DecisionNo',
                        DisplayKey: 'HRM_HR_StopWorking_DecisionNo',
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
                BusinessAction: [
                    {
                        Type: 'E_MODIFY',
                        Resource: {
                            Name: 'New_Hre_PersonalSubmitStopWorking_btnEdit',
                            Rule: 'View'
                        },
                        Confirm: {
                            isInputText: true,
                            isValidInputText: false
                        }
                    },
                    {
                        Type: 'E_REQUEST_CANCEL',
                        Resource: {
                            Name: 'New_Hre_PersonalSubmitStopWorking_btnWithDrawCancel',
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

        const _configList = configList[hreSubmitTerminationOfWork],
            filter = _configList[enumName.E_Filter],
            renderRow = _configList[enumName.E_Row],
            dataFromParams = this.checkDataFormNotify();

        const dataRowActionAndSelected = generateRowActionAndSelected(hreSubmitTerminationOfWork);
        let _params = {
            ...dataFromParams,
            IsPortalNew: true,
            filter: filter,
            pageSize: pageSizeList,
            Status: null
        };

        const isShowBtnCreate = await this.checkShowCreate();
        return {
            rowActions: dataRowActionAndSelected.rowActions,
            selected: dataRowActionAndSelected.selected,
            renderRow: renderRow,
            isShowHideCreate: isShowBtnCreate.Status == EnumName.E_SUCCESS ? isShowBtnCreate.Data : false,
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
                    keyTask: hreSubmitTerminationOfWorkKeyTask,
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
                    keyTask: hreSubmitTerminationOfWorkKeyTask,
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
        if (nextProps.reloadScreenName == hreSubmitTerminationOfWorkKeyTask) {
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

    async componentDidMount() {
        hreSubmitTerminationOfWork = ScreenName.HreSubmitTerminationOfWork;
        hreSubmitTerminationOfWorkViewDetail = ScreenName.HreSubmitTerminationOfWorkViewDetail;
        hreSubmitTerminationOfWorkKeyTask = EnumTask.KT_HreSubmitTerminationOfWork;
        HreSubmitTerminationOfWorkBusinessFunction.checkForReLoadScreen[hreSubmitTerminationOfWork] = false;
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        let _paramsDefault = await this.paramsDefault(),
            paramStore = { ..._paramsDefault, dataBody: { ..._paramsDefault.dataBody } },
            dataFromParams = this.checkDataFormNotify();

        // xoa filter defaule
        Object.keys(dataFromParams).forEach((key) => {
            paramStore.dataBody[key] = null;
        });

        this.storeParamsDefault = paramStore;
        this.setState(ConfigListFilter.value[hreSubmitTerminationOfWork] ? _paramsDefault : paramStore);

        startTask({
            keyTask: hreSubmitTerminationOfWorkKeyTask,
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
    };

    render() {
        const {
            dataBody,
            rowActions,
            selected,
            isLazyLoading,
            isRefreshList,
            keyQuery,
            dataChange,
            isShowHideCreate,
            renderRow
        } = this.state;

        return (
            <SafeAreaViewDetail style={styleSafeAreaView.style}>
                {hreSubmitTerminationOfWork && hreSubmitTerminationOfWorkViewDetail && enumName && (
                    <View style={[styleSheets.containerGrey]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={{
                                ...styleContentFilterDesign,
                                ...styleContentFilterDesignV3
                            }}
                            screenName={hreSubmitTerminationOfWork}
                            onSubmitEditing={this.reload}
                            scrollYAnimatedValue={this.scrollYAnimatedValue}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <HreTerminationOfWorkList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: hreSubmitTerminationOfWorkViewDetail,
                                        screenName: hreSubmitTerminationOfWork,
                                        screenNameRender: ScreenName.HreSubmitTerminationOfWork
                                    }}
                                    scrollYAnimatedValue={this.scrollYAnimatedValue}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={hreSubmitTerminationOfWorkKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    onCreate={this.onCreate}
                                    renderConfig={renderRow}
                                    isShowHideCreate={isShowHideCreate}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_CENTER]/api/Hre_StopWorking/New_GetStopWorkingNewPortal',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: pageSizeList
                                    }}
                                    valueField="ID"
                                />
                            )}
                        </View>

                        <HreSubmitTerminationOfWorkAddOrEdit
                            ref={(refs) => (this.HreSubmitTerminationOfWorkAddOrEdit = refs)}
                        />
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

export default connect(mapStateToProps, null)(HreSubmitTerminationOfWork);
