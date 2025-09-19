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
import moment from 'moment';
import HreProcessingJobPostingList from '../hreProcessingJobPostingList/HreProcessingJobPostingList';
import { generateRowActionAndSelected, HreProcessingJobPostingBusiness } from '../HreProcessingJobPostingBusiness';
import { PermissionForAppMobile } from '../../../../../../assets/configProject/PermissionForAppMobile';

let configList = null,
    enumName = null,
    hreWaitProcessingJobPosting = null,
    hreProcessingJobPostingViewDetail = null,
    hreWaitProcessingJobPostingKeyTask = null,
    pageSizeList = 50;

class HreWaitProcessingJobPosting extends Component {
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
            HreProcessingJobPostingBusiness.setThisForBusiness(this);
            if (HreProcessingJobPostingBusiness.checkForReLoadScreen[hreWaitProcessingJobPosting]) {
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
                ...paramsFilter,
                Year:
                    paramsFilter && paramsFilter.Year
                        ? `${paramsFilter.Year}/01/01`
                        : `${parseInt(moment(new Date()).format('YYYY'))}/01/01`
            }
        };
        // set false when reloaded
        HreProcessingJobPostingBusiness.checkForReLoadScreen[hreWaitProcessingJobPosting] = false;
        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: hreWaitProcessingJobPostingKeyTask,
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
        const _configList = configList[hreWaitProcessingJobPosting],
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
            Status: 'E_WAIT_APPROVED'
        };
        const dataRowActionAndSelected = generateRowActionAndSelected(hreWaitProcessingJobPosting);

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
                    keyTask: hreWaitProcessingJobPostingKeyTask,
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
                    keyTask: hreWaitProcessingJobPostingKeyTask,
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
        if (nextProps.reloadScreenName == hreWaitProcessingJobPostingKeyTask) {
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
        if (!ConfigList.value[ScreenName.HreWaitProcessingJobPosting]) {
            PermissionForAppMobile.value['New_PortalV3_Rec_ComposePostingApprove_btnApprove'] = {
                View: true
            };
            PermissionForAppMobile.value['New_PortalV3_Rec_ComposePostingApprove_btnReject'] = {
                View: true
            };
            PermissionForAppMobile.value['New_PortalV3_Rec_ComposePostingApprove_btnRequestChange'] = {
                View: true
            };
            ConfigList.value[ScreenName.HreWaitProcessingJobPosting] = {
                'Api': {
                    'urlApi': '[URI_CENTER]/api/Rec_JobPostingPlan/GetJobPostingPlanProcess',
                    'type': 'POST',
                    'pageSize': 20
                },
                'Row': [
                    {
                        'TypeView': 'E_STATUS',
                        'Name': 'Status',
                        'DisplayKey': '',
                        'DataType': 'string'
                    },
                    {
                        'TypeView': 'E_HEADER',
                        'Name': 'TitlePosting'
                    },
                    {
                        'TypeView': 'E_PROFILE',
                        'Name': 'NumberOfRecruitmentView'
                    },
                    {
                        'TypeView': 'E_COMMON',
                        'Name': 'EffectiveDate',
                        'DisplayKey': 'HRM_PortalApp_EffectiveDateOfPosting',
                        'DataType': 'string'
                    },
                    {
                        'TypeView': 'E_COMMON',
                        'Name': 'SourceAdsNameList',
                        'DisplayKey': 'HRM_PortalApp_HreProcessingPostingPlan_SourceAdsName',
                        'DataType': 'string'
                    },
                    {
                        'TypeView': 'E_COMMON',
                        'Name': 'NumberOfRoles',
                        'DisplayKey': 'HRM_PortalApp_HreProcessingPostingPlan_NumberOfRecruitment',
                        'DataType': 'string'
                    }
                ],
                'Order': [
                    {
                        'field': 'DateUpdate',
                        'dir': 'desc'
                    }
                ],
                'BusinessAction': [
                    {
                        'Type': 'E_APPROVE',
                        'Resource': {
                            'Name': 'New_PortalV3_Rec_ComposePostingApprove_btnApprove',
                            'Rule': 'View'
                        },
                        'Confirm': {
                            'isInputText': true,
                            'isValidInputText': false
                        }
                    },
                    {
                        'Type': 'E_REJECT',
                        'Resource': {
                            'Name': 'New_PortalV3_Rec_ComposePostingApprove_btnReject',
                            'Rule': 'View'
                        },
                        'Confirm': {
                            'isInputText': true,
                            'isValidInputText': true
                        }
                    },
                    {
                        'Type': 'E_REQUEST_CHANGE',
                        'Resource': {
                            'Name': 'New_PortalV3_Rec_ComposePostingApprove_btnRequestChange',
                            'Rule': 'View'
                        },
                        'Confirm': {
                            'isInputText': true,
                            'isValidInputText': true
                        }
                    }
                ]
            };
        }

        hreWaitProcessingJobPosting = ScreenName.HreWaitProcessingJobPosting;
        hreProcessingJobPostingViewDetail = ScreenName.HreProcessingJobPostingViewDetail;
        hreWaitProcessingJobPostingKeyTask = EnumTask.KT_HreWaitProcessingJobPosting;
        HreProcessingJobPostingBusiness.checkForReLoadScreen[hreWaitProcessingJobPosting] = false;
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: hreWaitProcessingJobPostingKeyTask,
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
                {hreWaitProcessingJobPosting && hreProcessingJobPostingViewDetail && enumName && (
                    <View style={[styleSheets.containerGrey]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={{
                                ...styleContentFilterDesign,
                                ...styleContentFilterDesignV3
                            }}
                            screenName={hreWaitProcessingJobPosting}
                            onSubmitEditing={this.reload}
                            scrollYAnimatedValue={this.scrollYAnimatedValue}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <HreProcessingJobPostingList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: hreProcessingJobPostingViewDetail,
                                        screenName: hreWaitProcessingJobPosting
                                    }}
                                    scrollYAnimatedValue={this.scrollYAnimatedValue}
                                    rowActions={rowActions}
                                    selected={selected}
                                    groupField={groupField}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={hreWaitProcessingJobPostingKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    renderConfig={renderRow}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    valueField="ID"
                                    isShowBtnCreate={false}
                                />
                            )}
                        </View>
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

export default connect(mapStateToProps, null)(HreWaitProcessingJobPosting);
