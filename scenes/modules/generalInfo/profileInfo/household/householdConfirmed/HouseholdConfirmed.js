import React, { Component } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-navigation';
import HouseholdList from '../householdList/HouseholdList';
import { styleSheets, styleSafeAreaView } from '../../../../../../constants/styleConfig';
import { ConfigList } from '../../../../../../assets/configProject/ConfigList';
import { PermissionForAppMobile } from '../../../../../../assets/configProject/PermissionForAppMobile';
import { ScreenName, EnumName, EnumTask } from '../../../../../../assets/constant';
import { HouseholdConfirmedBusinessFunction, generateRowActionAndSelected } from './HouseholdConfirmedBusinessFunction';
import { connect } from 'react-redux';
import { startTask } from '../../../../../../factories/BackGroundTask';
import { VnrBtnCreate } from '../../../../../../componentsV3/VnrBtnCreate/VnrBtnCreate';

let enumName = null,
    householdConfirmed = null,
    householdConfirmedViewDetail = null,
    householdConfirmedTask = null,
    pageSizeList = 20;

class HouseholdConfirmed extends Component {
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
                keyTask: householdConfirmedTask,
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
        const dataRowActionAndSelected = generateRowActionAndSelected(householdConfirmed);
        let _params = {
            // IsPortal: true,
            // sort: orderBy,
            // pageSize: pageSizeList,
            // NotificationID: this.checkDataFormNotify()
        };

        return {
            rowActions: dataRowActionAndSelected.rowActions,
            selected: dataRowActionAndSelected.selected,
            // renderRow: renderRow,
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
                    keyTask: householdConfirmedTask,
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
                    keyTask: householdConfirmedTask,
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
        if (nextProps.reloadScreenName == householdConfirmedTask) {
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
        if (!ConfigList.value[ScreenName.HouseholdConfirmed]) {
            PermissionForAppMobile.value['HouseholdInfo_Index_HouseholdInfoGird'] = {
                Modify: true,
                Create: true,
                View: true
            };

            ConfigList.value[ScreenName.HouseholdConfirmed] = {
                Api: {
                    urlApi: '[URI_HR]/Att_GetData/GetSalHreHouseholdInfo',
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
                        Type: 'E_MODIFY',
                        Resource: {
                            Name: 'HouseholdInfo_Index_HouseholdInfoGird',
                            Rule: 'Modify'
                        },
                        Confirm: {
                            isInputText: false,
                            isValidInputText: false
                        }
                    }
                ]
            };
        }

        //set by config
        enumName = EnumName;

        householdConfirmed = ScreenName.HouseholdConfirmed;
        householdConfirmedViewDetail = ScreenName.HouseholdConfirmedViewDetail;
        householdConfirmedTask = EnumTask.KT_HouseholdConfirmed;

        HouseholdConfirmedBusinessFunction.setThisForBusiness(this);
        let _paramsDefault = this.paramsDefault();
        this.storeParamsDefault = _paramsDefault;
        this.setState(_paramsDefault);

        startTask({
            keyTask: householdConfirmedTask,
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
        const {
            dataBody,
            rowActions,
            selected,
            isLazyLoading,
            isRefreshList,
            keyQuery,
            dataChange
        } = this.state;

        return (
            <SafeAreaView {...styleSafeAreaView}>
                {householdConfirmed && householdConfirmedViewDetail && enumName && (
                    <View style={[styleSheets.container]}>
                        <View style={[styleSheets.container]}>
                            {keyQuery && (
                                <HouseholdList
                                    detail={{
                                        dataLocal: false,
                                        screenDetail: householdConfirmedViewDetail,
                                        screenName: householdConfirmed
                                    }}
                                    rowActions={rowActions}
                                    selected={selected}
                                    reloadScreenList={this.reload.bind(this)}
                                    keyDataLocal={householdConfirmedTask}
                                    pullToRefresh={this.pullToRefresh}
                                    pagingRequest={this.pagingRequest}
                                    isLazyLoading={isLazyLoading}
                                    isRefreshList={isRefreshList}
                                    dataChange={dataChange}
                                    keyQuery={keyQuery != null ? keyQuery : EnumName.E_PRIMARY_DATA}
                                    api={{
                                        urlApi: '[URI_HR]/Att_GetData/GetSalHreHouseholdInfo',
                                        type: enumName.E_POST,
                                        dataBody: dataBody,
                                        pageSize: 20
                                    }}
                                    valueField="ID"
                                    renderConfig={null}
                                />
                            )}
                            {PermissionForAppMobile &&
                                PermissionForAppMobile.value['HouseholdInfo_Index_HouseholdInfoGird'] &&
                                PermissionForAppMobile.value['HouseholdInfo_Index_HouseholdInfoGird']['Create'] && (
                                <VnrBtnCreate
                                    onAction={() => {
                                        this.props.navigation.navigate('HouseholdAddRelative');
                                    }}
                                />
                            )}
                        </View>
                    </View>
                )}
            </SafeAreaView>
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
)(HouseholdConfirmed);
