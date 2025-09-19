import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import HreRequirementRecruitmentList from '../hreRequirementRecruitmentList/HreRequirementRecruitmentList';
import { styleSheets, styleSafeAreaView, styleContentFilterDesign } from '../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import {
    generateRowActionAndSelected,
    HreApprovedRequirementRecruitmentBusinessFunction
} from './HreApprovedRequirementRecruitmentBusiness';
//import { HreApprovedRequirementRecruitmentBusiness } from '../hreApproveRequirementRecruitment/HreApproveRequirementRecruitmentBusiness';
import { HreApproveRequirementRecruitmentBusinessFunction } from '../hreApproveRequirementRecruitment/HreApproveRequirementRecruitmentBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';

let configList = null,
    enumName = null,
    hreApprovedRequirementRecruitment = null,
    hreApprovedRequirementRecruitmentViewDetail = null,
    hreApprovedRequirementRecruitmentKeyTask = null,
    pageSizeList = 20;

class HreApprovedRequirementRecruitment extends Component {
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

        this.storeParamsDefault = null;

        //biến lưu lại object filter
        this.paramsFilter = null;
        this.willFocusScreen = this.props.navigation.addListener('willFocus', () => {
            // reload danh sách khi có approve hoặc reject dữ liệu
            if (
                HreApproveRequirementRecruitmentBusinessFunction.checkForReLoadScreen[
                    ScreenName.HreApprovedRequirementRecruitment
                ]
            ) {
                this.reload();
            }
        });
    }

    reload = (paramsFilter) => {
        if (paramsFilter === 'E_KEEP_FILTER') {
            paramsFilter = { ...this.paramsFilter };
        } else {
            this.paramsFilter = { ...paramsFilter };
        }

        let _paramsDefault = this.storeParamsDefault,
            _keyQuery = EnumName.E_FILTER;

        _paramsDefault = {
            ..._paramsDefault,
            keyQuery: _keyQuery,
            isRefreshList: !this.state.isRefreshList, // reload lại ds.
            dataBody: {
                ..._paramsDefault.dataBody,
                ...paramsFilter
            }
        };
        // set false khi đã reload.
        HreApproveRequirementRecruitmentBusinessFunction.checkForReLoadScreen[
            ScreenName.HreApprovedRequirementRecruitment
        ] = false;
        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: hreApprovedRequirementRecruitmentKeyTask,
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
            { NotificationID } = typeof params == 'object' ? params : JSON.parse(params);
        return NotificationID ? NotificationID : null;
    };

    paramsDefault = () => {
        const _configList = configList[hreApprovedRequirementRecruitment],
            renderRow = _configList[enumName.E_Row],
            orderBy = _configList[enumName.E_Order];

        const dataRowActionAndSelected = generateRowActionAndSelected();
        let _params = {
            IsPortal: true,
            sort: orderBy,
            pageSize: pageSizeList,
            NotificationID: this.checkDataFormNotify()
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
                    keyTask: hreApprovedRequirementRecruitmentKeyTask,
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

    pagingRequest = (page, pageSize) => {
        const { dataBody } = this.state;
        this.setState(
            {
                keyQuery: EnumName.E_PAGING
            },
            () => {
                startTask({
                    keyTask: hreApprovedRequirementRecruitmentKeyTask,
                    payload: {
                        ...dataBody,
                        page: page,
                        pageSize: pageSize,
                        keyQuery: EnumName.E_PAGING,
                        isCompare: false,
                        reload: this.reload
                    }
                });
            }
        );
    };

    UNSAFE_componentWillReceiveProps(nextProps) {
        const { keyQuery } = this.state;
        if (nextProps.reloadScreenName == hreApprovedRequirementRecruitmentKeyTask) {
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

    componentWillUnmount() {
        if (this.willFocusScreen) {
            this.willFocusScreen.remove();
        }
    }

    componentDidMount() {
        HreApproveRequirementRecruitmentBusinessFunction.checkForReLoadScreen[
            ScreenName.HreApprovedRequirementRecruitment
        ] = false;

        if (!ConfigList.value[ScreenName.HreApprovedRequirementRecruitment]) {
            ConfigList.value[ScreenName.HreApprovedRequirementRecruitment] = {
                Api: {
                    urlApi: '/Por_GetData/Portal_GetListRequirementRecruitmentByUserApproved',
                    type: 'POST',
                    pageSize: 20
                },
                Order: [
                    {
                        field: 'DateUpdate',
                        dir: 'desc'
                    }
                ],
                BusinessAction: []
            };
        }
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        hreApprovedRequirementRecruitment = ScreenName.HreApprovedRequirementRecruitment;
        hreApprovedRequirementRecruitmentViewDetail = ScreenName.HreApprovedRequirementRecruitmentViewDetail;
        hreApprovedRequirementRecruitmentKeyTask = EnumTask.KT_HreApprovedRequirementRecruitment;
        HreApprovedRequirementRecruitmentBusinessFunction.setThisForBusiness(this);
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: hreApprovedRequirementRecruitmentKeyTask,
            payload: {
                ..._paramsDefault.dataBody,
                pageSize: pageSizeList,
                keyQuery: EnumName.E_PRIMARY_DATA,
                isCompare: true,
                reload: this.reload
            }
        });
    }

    render() {
        const { dataBody, renderRow, rowActions, selected, isLazyLoading, isRefreshList, keyQuery, dataChange } =
            this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {hreApprovedRequirementRecruitment && hreApprovedRequirementRecruitmentViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={styleContentFilterDesign}
                            screenName={hreApprovedRequirementRecruitment}
                            onSubmitEditing={this.reload}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <HreRequirementRecruitmentList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: hreApprovedRequirementRecruitmentViewDetail,
                                        screenName: hreApprovedRequirementRecruitment
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={hreApprovedRequirementRecruitmentKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    GroupField={dataBody.GroupField}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Por_GetData/Portal_GetListRequirementRecruitmentByUserApproved',
                                        type: enumName.E_POST,
                                        pageSize: 20,
                                        dataBody: dataBody
                                    }}
                                    valueField="ID"
                                    renderConfig={renderRow}
                                />
                            )}
                        </View>
                    </View>
                )}
            </SafeAreaView>
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

export default connect(mapStateToProps, null)(HreApprovedRequirementRecruitment);
