import React, { Component } from 'react';
import { View, Animated } from 'react-native';
import {
    styleSheets,
    styleSafeAreaView,
    styleContentFilterDesign,
    styleContentFilterDesignV3
} from '../../../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../../../componentsV3/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../../../../assets/constant';
import { connect } from 'react-redux';
import { startTask } from '../../../../../../../factories/BackGroundTask';
import SafeAreaViewDetail from '../../../../../../../components/safeAreaView/SafeAreaViewDetail';
import moment from 'moment';
import HreInterviewList from '../hreInterviewList/HreInterviewList';
import {
    generateRowActionAndSelected,
    HreWaitingInterviewBusiness
} from '../hreWaitingInterview/HreWaitingInterviewBusiness';
import Vnr_Function from '../../../../../../../utils/Vnr_Function';
import { PermissionForAppMobile } from '../../../../../../../assets/configProject/PermissionForAppMobile';
import HreResultInterviewAddOrEdit from './HreResultInterviewAddOrEdit';

let configList = null,
    enumName = null,
    hreWaitingInterview = null,
    hreWaitingInterviewViewDetail = null,
    hreWaitingInterviewKeyTask = null,
    pageSizeList = 20;

class HreWaitingInterview extends Component {
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
        this.HreResultInterviewAddOrEdit = null;
        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // Trường hợp goBack từ detail thì phải gán lại this
            HreWaitingInterviewBusiness.setThisForBusiness(this);
            if (HreWaitingInterviewBusiness.checkForReLoadScreen[ScreenName.HreWaitingInterview]) {
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

        HreWaitingInterviewBusiness.checkForReLoadScreen[ScreenName.HreWaitingInterview] = false;
        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: hreWaitingInterviewKeyTask,
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
        const _configList = configList[hreWaitingInterview],
            //orderBy = _configList[enumName.E_Order],
            renderRow = _configList[enumName.E_Row],
            filter = _configList[enumName.E_Filter],
            groupField = _configList[enumName.E_Field_Group] ? _configList[enumName.E_Field_Group] : null,
            dataFromParams = this.checkDataFormNotify();

        const dataItem = dataFromParams.dataItem ? dataFromParams.dataItem : {},
            {
                InterviewDate,
                TimeStart,
                TimeEnd
                // JobVacancyID,
                // RoundInterview,
                // InterviewType,
                // Gender,
                // SourceAdsID
            } = dataItem;

        const dataRowActionAndSelected = generateRowActionAndSelected();
        let _params = {
            ...dataFromParams,
            IsPortalNew: true,
            filter: filter,
            pageSize: pageSizeList,
            StatusSyn: null,
            // filter mặc định
            InterviewDateFrom: InterviewDate ? Vnr_Function.formatDateAPI(InterviewDate) : null,
            InterviewDateTo: InterviewDate ? Vnr_Function.formatDateAPI(InterviewDate, true) : null,
            TimeStart: TimeStart ? moment(TimeStart).format('HH:mm') : null,
            TimeEnd: TimeEnd ? moment(TimeEnd).format('HH:mm') : null
            // JobVacancyIDSearch: JobVacancyID ? JobVacancyID : null,
            // RoundInterview: RoundInterview ? RoundInterview : null,
            // InterviewType: InterviewType ? InterviewType : null,
            // Gender: Gender ? Gender : null,
            // SourceAdsIDs: SourceAdsID ? SourceAdsID : null
            //defaultParams: defaultParams
        };

        // Control VnrDateFromTo
        _params['InterviewDate'] = {
            startDate: _params.InterviewDateFrom,
            endDate: _params.InterviewDateTo
        };

        return {
            rowActions: dataRowActionAndSelected.rowActions,
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
                    keyTask: hreWaitingInterviewKeyTask,
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
                    keyTask: hreWaitingInterviewKeyTask,
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
        if (nextProps.reloadScreenName == hreWaitingInterviewKeyTask) {
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
        if (!ConfigList.value[ScreenName.HreWaitingInterview]) {
            PermissionForAppMobile.value['New_PortalV3_Rec_InterviewPlan_CreateInterviewResult'] = {
                View: true
            };
            ConfigList.value[ScreenName.HreWaitingInterview] = {
                Api: {
                    urlApi: '[URI_CENTER]/api/Att_GetData/New_GetAnnualDetailPersonal',
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
                        TypeView: 'E_STATUS',
                        Name: 'Status',
                        DisplayKey: '',
                        DataType: 'string'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'InterviewSchedule',
                        DisplayKey: 'HRM_PortalApp_InterviewSchedule',
                        DataType: 'string'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'JobVacancyName',
                        DisplayKey: 'HRM_PortalApp_jobVacancy',
                        DataType: 'string'
                    }
                ],
                BusinessAction: [
                    {
                        Type: 'E_ENTER_INTERVIEW',
                        Resource: {
                            Name: 'New_PortalV3_Rec_InterviewPlan_CreateInterviewResult',
                            Rule: 'View'
                        },
                        Confirm: {
                            isInputText: true,
                            isValidInputText: false
                        }
                    },
                    {
                        Type: 'E_MODIFY',
                        Resource: {
                            Name: 'New_PortalV3_Rec_InterviewPlan_CreateInterviewResult',
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

        hreWaitingInterview = ScreenName.HreWaitingInterview;
        hreWaitingInterviewViewDetail = ScreenName.HreAnnualManageViewDetail;
        hreWaitingInterviewKeyTask = EnumTask.KT_HreWaitingInterview;
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: hreWaitingInterviewKeyTask,
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

    onCreate = (item) => {
        if (this.HreResultInterviewAddOrEdit && this.HreResultInterviewAddOrEdit.onShow) {
            this.HreResultInterviewAddOrEdit.onShow({
                reload: this.reload,
                record: item,
                isCreate: true
            });
        }
    };

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
                {hreWaitingInterview && hreWaitingInterviewViewDetail && enumName && (
                    <View style={[styleSheets.containerGrey]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={{
                                ...styleContentFilterDesign,
                                ...styleContentFilterDesignV3
                            }}
                            screenName={hreWaitingInterview}
                            onSubmitEditing={this.reload}
                            scrollYAnimatedValue={this.scrollYAnimatedValue}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <HreInterviewList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: ScreenName.HreCandidateInterview,
                                        screenName: hreWaitingInterview
                                    }}
                                    scrollYAnimatedValue={this.scrollYAnimatedValue}
                                    rowActions={rowActions}
                                    selected={selected}
                                    groupField={groupField}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={hreWaitingInterviewKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    renderConfig={renderRow}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    valueField="ID"
                                />
                            )}
                        </View>

                        <HreResultInterviewAddOrEdit ref={(refs) => (this.HreResultInterviewAddOrEdit = refs)} />
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

export default connect(mapStateToProps, null)(HreWaitingInterview);
