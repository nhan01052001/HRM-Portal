import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import HreApproveViolationList from '../hreViolationList/HreViolationList';
import { styleSheets, Colors, styleSafeAreaView, styleContentFilterDesign } from '../../../../../constants/styleConfig';
import VnrFilterCommon from '../../../../../components/VnrFilter/VnrFilterCommon';
import { ConfigList } from '../../../../../assets/configProject/ConfigList';
import { PermissionForAppMobile } from '../../../../../assets/configProject/PermissionForAppMobile';
import { ScreenName, EnumName, EnumTask } from '../../../../../assets/constant';
import { generateRowActionAndSelected, HreApproveViolationBusinessFunction } from './HreApproveViolationBusiness';
import { connect } from 'react-redux';
import { startTask } from '../../../../../factories/BackGroundTask';

let configList = null,
    enumName = null,
    hreApproveViolation = null,
    hreApproveViolationViewDetail = null,
    hreApproveViolationKeyTask = null,
    pageSizeList = 20;

class HreApproveViolation extends Component {
    constructor(props) {
        super(props);

        this.state = {
            dataBody: null,
            rowActions: [],
            selected: [],
            isRefreshList: false,
            isLazyLoading: false,
            keyQuery: null,
            dataChange: false, //biến check dữ liệu có thay đổi hay không
            isvisibleModalRefer: false
        };

        this.storeParamsDefault = null;
        // this.setCheckBoxFilter = this.setCheckBoxFilter.bind(this);
        //biến lưu lại object filter
        this.paramsFilter = null;
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
        // Gửi yêu cầu lọc dữ liệu
        this.setState(_paramsDefault, () => {
            const { dataBody, keyQuery } = this.state;
            startTask({
                keyTask: hreApproveViolationKeyTask,
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
        const _configList = configList[hreApproveViolation],
            renderRow = _configList[enumName.E_Row],
            orderBy = _configList[enumName.E_Order];

        const dataRowActionAndSelected = generateRowActionAndSelected();
        let _params = {
            IsPortal: true,
            sort: orderBy,
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
                    keyTask: hreApproveViolationKeyTask,
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
                    keyTask: hreApproveViolationKeyTask,
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
        if (nextProps.reloadScreenName == hreApproveViolationKeyTask) {
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
        if (!ConfigList.value[ScreenName.HreApproveViolation]) {
            PermissionForAppMobile.value = {
                ...PermissionForAppMobile.value,
                New_Hre_Violation_Approve_btnApprove: { View: true },
                New_Hre_Violation_Approve_btnReject: { View: true }
            };
            ConfigList.value[ScreenName.HreApproveViolation] = {
                Api: {
                    urlApi: '[URI_HR]/Por_GetData/Get_ViolationApprove_Portal',
                    type: 'POST',
                    pageSize: 20
                },
                Row: [],
                Order: [
                    {
                        field: 'DateUpdate',
                        dir: 'desc'
                    }
                ],
                BusinessAction: [
                    {
                        Type: 'E_APPROVE',
                        Resource: {
                            Name: 'New_Hre_Violation_Approve_btnApprove',
                            Rule: 'View'
                        },
                        Confirm: {
                            isInputText: false,
                            isValidInputText: false
                        }
                    },
                    {
                        Type: 'E_REJECT',
                        Resource: {
                            Name: 'New_Hre_Violation_Approve_btnReject',
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
        //set by config
        configList = ConfigList.value;
        enumName = EnumName;
        hreApproveViolation = ScreenName.HreApproveViolation;
        hreApproveViolationViewDetail = ScreenName.HreApproveViolationViewDetail;
        hreApproveViolationKeyTask = EnumTask.KT_HreApproveViolation;
        HreApproveViolationBusinessFunction.setThisForBusiness(this);
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: hreApproveViolationKeyTask,
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
                {hreApproveViolation && hreApproveViolationViewDetail && enumName && (
                    <View style={[styles.container]}>
                        <VnrFilterCommon
                            dataBody={dataBody}
                            style={styleContentFilterDesign}
                            screenName={hreApproveViolation}
                            onSubmitEditing={this.reload}
                        />

                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <HreApproveViolationList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: hreApproveViolationViewDetail,
                                        screenName: hreApproveViolation
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    //callbackDataSource={this.getDataSource}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={hreApproveViolationKeyTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Por_GetData/Get_ViolationApprove_Portal',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: 20
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

export default connect(mapStateToProps, null)(HreApproveViolation);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.gray_3
    }
});
