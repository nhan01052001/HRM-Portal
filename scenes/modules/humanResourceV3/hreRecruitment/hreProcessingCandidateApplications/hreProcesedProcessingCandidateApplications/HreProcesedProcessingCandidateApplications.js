import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import {
    styleSheets,
    styleSafeAreaView,
    styleContentFilterDesign,
    styleContentFilterDesignV3
} from '../../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../../componentsV3/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../../../assets/constant';
import { connect } from 'react-redux';
import { startTask } from '../../../../../../factories/BackGroundTask';
import SafeAreaViewDetail from '../../../../../../components/safeAreaView/SafeAreaViewDetail';
import HreProcessingCandidateApplicationsList from '../hreProcessingCandidateApplicationsList/HreProcessingCandidateApplicationsList';
import { generateRowActionAndSelected, HreProcessingCandidateApplicationsBusiness } from '../HreProcessingCandidateApplicationsBusiness';

let configList = null,
    enumName = null,
    hreProcesedProcessingCandidateApplications = null,
    hreProcesedProcessingCandidateApplicationsViewDetail = null,
    hreProcesedProcessingCandidateApplicationsKeyTask = null,
    pageSizeList = 50;

class HreProcesedProcessingCandidateApplications extends Component {
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
            if (HreProcessingCandidateApplicationsBusiness.checkForReLoadScreen['HreProcesedProcessingCandidateApplications']) {
                this.reload();
            }
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

        // set false khi đã reload.
        HreProcessingCandidateApplicationsBusiness.checkForReLoadScreen[hreProcesedProcessingCandidateApplications] = false;

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: hreProcesedProcessingCandidateApplicationsKeyTask,
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
        const _configList = configList[hreProcesedProcessingCandidateApplications],
            //orderBy = _configList[enumName.E_Order],
            renderRow = _configList[enumName.E_Row],
            filter = _configList[enumName.E_Filter],
            groupField = _configList[enumName.E_Field_Group] ? _configList[enumName.E_Field_Group] : null,
            dataFromParams = this.checkDataFormNotify();

        const dataRowActionAndSelected = generateRowActionAndSelected(hreProcesedProcessingCandidateApplications);
        let _params = {
            ...dataFromParams,
            IsPortalNew: true,
            filter: filter,
            pageSize: pageSizeList,
            tabEnum: 'E_PROCESSED'
        };

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
                    keyTask: hreProcesedProcessingCandidateApplicationsKeyTask,
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
                    keyTask: hreProcesedProcessingCandidateApplicationsKeyTask,
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
        if (nextProps.reloadScreenName == hreProcesedProcessingCandidateApplicationsKeyTask) {
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
        if (!ConfigList.value[ScreenName.HreProcesedProcessingCandidateApplications]) {
            ConfigList.value[ScreenName.HreProcesedProcessingCandidateApplications] = {
                Api: {
                    urlApi: '[URI_CENTER]/api/Rec_CandidateProfile/New_GetCandidateProfileApproveByFilterHandle',
                    type: 'POST',
                    pageSize: 20
                },
                Row: [
                    {
                        TypeView: 'E_PROFILE',
                        Name: 'PositionName, GenderView, Age'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'PositionLast',
                        DisplayKey: 'HRM_PortalApp_MostRecentPosition',
                        DataType: 'string'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'CompanyName',
                        DisplayKey: 'HRM_PortalApp_MostRecentCompany',
                        DataType: 'string'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'Experience',
                        DisplayKey: 'HRM_PortalApp_MostRecentExperience',
                        DataType: 'string',
                        Unit: 'HRM_PortalApp_Only_Year'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'HistorySalaryView',
                        DisplayKey: 'HRM_PortalApp_MostRecentSalary',
                        DataType: 'string'
                    }
                ],
                Order: [
                    {
                        field: 'DateUpdate',
                        dir: 'desc'
                    }
                ],
                BusinessAction: [
                ],
                GroupField: [
                    {
                        TextField: 'JobVacancyName',
                        ValueField: 'JobVacancyName',
                        DisplayKey: 'HRM_PortalApp_PositionAppliedFor',
                        DataType: 'string'
                    },
                    {
                        TextField: 'CompanyName',
                        ValueField: 'CompanyName',
                        DisplayKey: 'HRM_PortalApp_PositionAppliedFor',
                        DataType: 'string'
                    },
                    {
                        TextField: 'PositionLast',
                        ValueField: 'PositionLast',
                        DisplayKey: 'HRM_PortalApp_PositionAppliedFor',
                        DataType: 'string'
                    }
                ]
            };
        }

        hreProcesedProcessingCandidateApplications = ScreenName.HreProcesedProcessingCandidateApplications;
        hreProcesedProcessingCandidateApplicationsViewDetail = ScreenName.HreProcessingCandidateApplicationsViewDetail;
        hreProcesedProcessingCandidateApplicationsKeyTask = EnumTask.KT_HreProcesedProcessingCandidateApplications;

        // set false khi đã reload.
        HreProcessingCandidateApplicationsBusiness.checkForReLoadScreen[hreProcesedProcessingCandidateApplications] = false;

        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: hreProcesedProcessingCandidateApplicationsKeyTask,
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
                {hreProcesedProcessingCandidateApplications && hreProcesedProcessingCandidateApplicationsViewDetail && enumName && (
                    <View style={[styleSheets.containerGrey]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={{
                                ...styleContentFilterDesign,
                                ...styleContentFilterDesignV3
                            }}
                            screenName={hreProcesedProcessingCandidateApplications}
                            onSubmitEditing={this.reload}
                            scrollYAnimatedValue={this.scrollYAnimatedValue}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <HreProcessingCandidateApplicationsList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: 'HreCandidateInformation', //hreProcesedProcessingCandidateApplicationsViewDetail,
                                        screenName: hreProcesedProcessingCandidateApplications
                                    }}
                                    scrollYAnimatedValue={this.scrollYAnimatedValue}
                                    rowActions={rowActions}
                                    selected={selected}
                                    groupField={groupField}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={hreProcesedProcessingCandidateApplicationsKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    onCreate={this.onCreate}
                                    renderConfig={renderRow}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    valueField="ID"
                                    isShowBtnCreate={true}
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
)(HreProcesedProcessingCandidateApplications);
