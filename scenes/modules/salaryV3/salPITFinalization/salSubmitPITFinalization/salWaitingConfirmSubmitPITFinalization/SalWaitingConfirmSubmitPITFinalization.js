import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import SalPITFinalizationList from '../../salPITFinalizationList/SalPITFinalizationList';
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
    SalSubmitPITFinalizationBusinessFunction
} from '../SalSubmitPITFinalizationBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../../factories/BackGroundTask';
import SalSubmitPITFinalizationAddOrEdit from '../SalSubmitPITFinalizationAddOrEdit';
import SafeAreaViewDetail from '../../../../../../components/safeAreaView/SafeAreaViewDetail';
import { ConfigListFilter } from '../../../../../../assets/configProject/ConfigListFilter';

let configList = null,
    enumName = null,
    salWaitingConfirmSubmitPITFinalization = null,
    salWaitingConfirmSubmitPITFinalizationViewDetail = null,
    salWaitingConfirmSubmitPITFinalizationKeyTask = null,
    pageSizeList = 20;

class SalWaitingConfirmSubmitPITFinalization extends Component {
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

        this.SalSubmitPITFinalizationAddOrEdit = null;

        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // Trường hợp goBack từ detail thì phải gán lại this
            SalSubmitPITFinalizationBusinessFunction.setThisForBusiness(this);
            if (SalSubmitPITFinalizationBusinessFunction.checkForReLoadScreen[salWaitingConfirmSubmitPITFinalization]) {
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
        if (this.SalSubmitPITFinalizationAddOrEdit && this.SalSubmitPITFinalizationAddOrEdit.onShow) {
            this.SalSubmitPITFinalizationAddOrEdit.onShow({
                reload: this.reload,
                record: null
            });
        }
    };

    onEdit = (item) => {
        if (item) {
            if (this.SalSubmitPITFinalizationAddOrEdit && this.SalSubmitPITFinalizationAddOrEdit.onShow) {
                this.SalSubmitPITFinalizationAddOrEdit.onShow({
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
        SalSubmitPITFinalizationBusinessFunction.checkForReLoadScreen[salWaitingConfirmSubmitPITFinalization] = false;

        // Gửi yêu cầu lọc dữ liệu
        this.setState(
            {
                ..._paramsDefault
            },
            () => {
                const { dataBody, keyQuery } = this.state;
                startTask({
                    keyTask: salWaitingConfirmSubmitPITFinalizationKeyTask,
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

    paramsDefault = async () => {
        if (!configList[salWaitingConfirmSubmitPITFinalization]) {
            configList[salWaitingConfirmSubmitPITFinalization] = {
                Api: {
                    urlApi: '[URI_CENTER]/api/Sal_PITFinalizationDelegatee/New_GetPersonalPITFinalizationDelegateeHandle',
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
                        TypeView: 'E_STATUS',
                        Name: 'Status',
                        DisplayKey: '',
                        DataType: 'string'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'YearFormat',
                        DisplayKey: 'HRM_PortalApp_PITFinalization_YearOfFinalization',
                        DataType: 'string'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'CodeTax',
                        DisplayKey: 'HRM_PortalApp_PITFinalization_TaxCode',
                        DataType: 'string'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'DateConfirm',
                        DisplayKey: 'HRM_PortalApp_PITFinalization_ConfirmationDate',
                        DataType: 'DateTime',
                        DataFormat: 'DD/MM/YYYY'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'UserConfirm',
                        DisplayKey: 'HRM_PortalApp_PITFinalization_Confirmator',
                        DataType: 'string'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'UserReject',
                        DisplayKey: 'HRM_PortalApp_PITFinalization_RejectionUser',
                        DataType: 'string'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'DateStop',
                        DisplayKey: 'HRM_PortalApp_PITFinalization_RejectionDate',
                        DataType: 'DateReject',
                        DataFormat: 'DD/MM/YYYY'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'DeclineReason',
                        DisplayKey: 'HRM_PortalApp_PITFinalization_ReasonToRejection',
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
                    }
                ]
            };
        }

        const _configList = configList[salWaitingConfirmSubmitPITFinalization],
            filter = _configList[enumName.E_Filter],
            renderRow = _configList[enumName.E_Row],
            dataFromParams = this.checkDataFormNotify();

        const dataRowActionAndSelected = generateRowActionAndSelected(salWaitingConfirmSubmitPITFinalization);
        let _params = {
            ...dataFromParams,
            IsPortalNew: true,
            filter: filter,
            pageSize: pageSizeList,
            Status: 'E_WAITINGCONFIRM'
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
                    keyTask: salWaitingConfirmSubmitPITFinalizationKeyTask,
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
                    keyTask: salWaitingConfirmSubmitPITFinalizationKeyTask,
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
        if (nextProps.reloadScreenName == salWaitingConfirmSubmitPITFinalizationKeyTask) {
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
        salWaitingConfirmSubmitPITFinalization = ScreenName.SalWaitingConfirmSubmitPITFinalization;
        salWaitingConfirmSubmitPITFinalizationViewDetail = ScreenName.SalSubmitPITFinalizationViewDetail;
        salWaitingConfirmSubmitPITFinalizationKeyTask = EnumTask.KT_SalWaitingConfirmSubmitPITFinalization;
        SalSubmitPITFinalizationBusinessFunction.checkForReLoadScreen[salWaitingConfirmSubmitPITFinalization] = false;
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
        this.setState(ConfigListFilter.value[salWaitingConfirmSubmitPITFinalization] ? _paramsDefault : paramStore);

        startTask({
            keyTask: salWaitingConfirmSubmitPITFinalizationKeyTask,
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
                {salWaitingConfirmSubmitPITFinalization &&
                    salWaitingConfirmSubmitPITFinalizationViewDetail &&
                    enumName && (
                    <View style={[styleSheets.containerGrey]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={{
                                ...styleContentFilterDesign,
                                ...styleContentFilterDesignV3
                            }}
                            screenName={salWaitingConfirmSubmitPITFinalization}
                            onSubmitEditing={this.reload}
                            scrollYAnimatedValue={this.scrollYAnimatedValue}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <SalPITFinalizationList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: salWaitingConfirmSubmitPITFinalizationViewDetail,
                                        screenName: salWaitingConfirmSubmitPITFinalization,
                                        screenNameRender: ScreenName.SalWaitingConfirmSubmitPITFinalization
                                    }}
                                    scrollYAnimatedValue={this.scrollYAnimatedValue}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={salWaitingConfirmSubmitPITFinalizationKeyTask}
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
                                        urlApi: '[URI_CENTER]/api/Sal_PITFinalizationDelegatee/New_GetPersonalPITFinalizationDelegateeHandle',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: pageSizeList
                                    }}
                                    valueField="ID"
                                />
                            )}
                        </View>

                        <SalSubmitPITFinalizationAddOrEdit
                            ref={(refs) => (this.SalSubmitPITFinalizationAddOrEdit = refs)}
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

export default connect(mapStateToProps, null)(SalWaitingConfirmSubmitPITFinalization);
