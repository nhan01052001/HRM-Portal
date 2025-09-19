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
import HreCandidateProfileList from './hreCandidateProfileList/HreCandidateProfileList';
import HreCandidateProfileCreateQR from './HreCandidateProfileCreateQR';

let configList = null,
    enumName = null,
    hreCandidateProfile = null,
    hreCandidateProfileViewDetail = null,
    hreCandidateProfileKeyTask = null,
    pageSizeList = 50;

class HreCandidateProfile extends Component {
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
        // HreCandidateProfileBusiness.checkForReLoadScreen[HreCandidateProfile] = false;
        // E_BETWEEN > ExperienceFrom,ExperienceTo
        // E_LESS > ExperienceTo
        // E_BIGGER > ExperienceFrom
        // E_EQUAL > ExperienceFrom,ExperienceTo
        const { ExperienceTo, ExperienceToLess, ExperienceFrom, ExperienceFromBigger, ExperienceFromToEqua, ExperienceLevel } = _paramsDefault.dataBody;
        if (ExperienceLevel != null && _paramsDefault.dataBody) {
            if (ExperienceLevel == 'E_LESS') {
                _paramsDefault.dataBody['ExperienceTo'] = ExperienceToLess;
                _paramsDefault.dataBody['ExperienceFrom'] = '';
            }
            else if (ExperienceLevel == 'E_BIGGER') {
                _paramsDefault.dataBody['ExperienceTo'] = '';
                _paramsDefault.dataBody['ExperienceFrom'] = ExperienceFromBigger;
            }
            else if (ExperienceLevel == 'E_EQUAL') {
                _paramsDefault.dataBody['ExperienceTo'] = ExperienceFromToEqua;
                _paramsDefault.dataBody['ExperienceFrom'] = ExperienceFromToEqua;
            }
            else {
                _paramsDefault.dataBody['ExperienceTo'] = ExperienceTo;
                _paramsDefault.dataBody['ExperienceFrom'] = ExperienceFrom;
            }
        }

        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: hreCandidateProfileKeyTask,
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
        const _configList = configList[hreCandidateProfile],
            //orderBy = _configList[enumName.E_Order],
            renderRow = _configList[enumName.E_Row],
            filter = _configList[enumName.E_Filter],
            groupField = _configList[enumName.E_Field_Group] ? _configList[enumName.E_Field_Group] : null,
            dataFromParams = this.checkDataFormNotify();

        // const dataRowActionAndSelected = generateRowActionAndSelected(HreCandidateProfile);
        let _params = {
            ...dataFromParams,
            IsPortalNew: true,
            filter: filter,
            pageSize: pageSizeList
        };

        return {
            // rowActions: dataRowActionAndSelected.rowActions,
            // selected: dataRowActionAndSelected.selected,
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
                    keyTask: hreCandidateProfileKeyTask,
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
                    keyTask: hreCandidateProfileKeyTask,
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
        if (nextProps.reloadScreenName == hreCandidateProfileKeyTask) {
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
        if (!ConfigList.value[ScreenName.HreCandidateProfile]) {
            ConfigList.value[ScreenName.HreCandidateProfile] = {
                Api: {
                    urlApi: '[URI_CENTER]/api/Rec_CandidateProfile/New_GetCandidateProfileByFilterHandle',
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
                        Name: 'CodeCandidate, GenderView, CandicateAge'
                    },
                    {
                        TypeView: 'E_COMMON_SPECIAL',
                        Name: 'StrJobVacancyName',
                        DisplayKey: 'HRM_PortalApp_PositionAppliedFor',
                        DataType: 'string'
                    },
                    {
                        TypeView: 'E_COMMON',
                        Name: 'WorkPlaceName',
                        DisplayKey: 'HRM_PortalApp_HreRecruitmentProposalProcessing_WorkplaceName',
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
                        Name: 'SalaryLast',
                        DisplayKey: 'HRM_PortalApp_MostRecentSalary',
                        DataType: 'Double',
                        DataFormat: '#.###,##',
                        Unit: 'VND'
                    }
                    // {
                    //     TypeView: 'E_CLUSTER',
                    //     Name: 'DurationTypeView, MethodPaymentView, OrgStructureName, StatusView'
                    // }
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
                ]
            };
        }

        hreCandidateProfile = ScreenName.HreCandidateProfile;
        hreCandidateProfileViewDetail = ScreenName.HreProcessingCandidateApplicationsViewDetail;
        hreCandidateProfileKeyTask = EnumTask.KT_HreCandidateProfile;

        // set false khi đã reload.
        // hreCandidateProfileBusiness.checkForReLoadScreen[HreCandidateProfile] = false;

        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: hreCandidateProfileKeyTask,
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

    onCreateQR = () => {
        if (this.HreCandidateProfileCreateQR && this.HreCandidateProfileCreateQR.openModalQRcode) {
            this.HreCandidateProfileCreateQR.openModalQRcode({
                reload: this.reload,
                record: null
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
                {hreCandidateProfile && hreCandidateProfileViewDetail && enumName && (
                    <View style={[styleSheets.containerGrey]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={{
                                ...styleContentFilterDesign,
                                ...styleContentFilterDesignV3
                            }}
                            screenName={hreCandidateProfile}
                            onSubmitEditing={this.reload}
                            scrollYAnimatedValue={this.scrollYAnimatedValue}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <HreCandidateProfileList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: 'HreCandidateInformation', //HreCandidateProfileViewDetail,
                                        screenName: hreCandidateProfile
                                    }}
                                    scrollYAnimatedValue={this.scrollYAnimatedValue}
                                    rowActions={rowActions}
                                    selected={selected}
                                    groupField={groupField}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={hreCandidateProfileKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    renderConfig={renderRow}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    valueField="ID"
                                    onCreateQR={this.onCreateQR}
                                    isShowBtnCreate={false}
                                />
                            )}
                        </View>
                        <HreCandidateProfileCreateQR
                            ref={refs => (this.HreCandidateProfileCreateQR = refs)}
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
)(HreCandidateProfile);
